<style>
  .rnn-svg text { font-family: Helvetica, Arial, sans-serif; }
  .rnn-svg .v-title { font-size: 19px; font-weight: 700; fill: #111; }
  .rnn-svg .v-small { font-size: 13px; fill: #5E5850; }
  .rnn-svg .v-tiny  { font-size: 12px; fill: #5E5850; }
  .rnn-svg .layer-name { font-size: 13px; font-weight: 700; fill: #111; }
  .rnn-svg .tensor-name { font-size: 13px; font-style: italic; fill: #111; }
  .rnn-svg .box-blue   { fill:#EAF2FA; stroke:#3576C0; stroke-width:2; }
  .rnn-svg .box-yellow { fill:#FFF8D9; stroke:#C29E08; stroke-width:2; }
  .rnn-svg .box-green  { fill:#F0FAF0; stroke:#73B222; stroke-width:2; }
  .rnn-svg .box-red    { fill:#FDECEC; stroke:#C30B0A; stroke-width:2; }
  .rnn-svg .edge-green { stroke:#73B222; stroke-width:2; fill:none; }
  .rnn-svg .edge-red   { stroke:#C30B0A; stroke-width:2; fill:none; }
  .rnn-svg .formula-bg { fill:#FAFAF8; stroke:#E4E1D7; stroke-width:1.5; }
  /* Портретная схема ролей выше остальных — держим её в разумной ширине. */
  .stage-figure #svgSaRoles { max-width: 430px; margin: 0 auto; }
</style>

<style>
  .console {
    background: #1D1B17; color: #E8E4DA; border-radius: 12px;
    padding: 15px 18px; margin: 22px 0; overflow-x: auto;
    font-family: Menlo, Consolas, "Courier New", monospace;
    font-size: 13.5px; line-height: 1.6; white-space: pre;
  }
  .console .cmd { color: #8FD14F; }
  .console-title {
    font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
    color: #5E5850; font-weight: 800; margin: 26px 0 -12px;
  }
</style>

<p class="lead">Self-attention проще понять не с готовой формулы, а как последовательность идей: сначала увидеть узкое место RNN, затем собрать контекст обычным attention и только после этого сделать запросом каждое слово.</p>
<p>На одном сквозном примере «Я видел котю на мате» пройдём весь путь: рекуррентное состояние, взвешенная сумма, query/key/value, скалярные оценки, масштабирование, softmax, выход <code>z</code> и итоговая матричная запись.</p>
<div class="reading-contract">
  <div class="contract-card">
    <span>На входе</span>
    <strong>Векторы и скалярное произведение</strong>
    <p>Достаточно понимать, что слово представлено вектором, а линейный слой — умножением на матрицу.</p>
  </div>
  <div class="contract-card">
    <span>Сквозной пример</span>
    <strong>«Я видел котю на мате»</strong>
    <p>На этой фразе построены схемы первых девяти глав; в численных частях счёт идёт на более коротком примере из трёх токенов.</p>
  </div>
  <div class="contract-card">
    <span>Что построим</span>
    <strong>От RNN к self-attention</strong>
    <p>От последовательной RNN-схемы перейдём к полностью параллельному self-attention.</p>
  </div>
</div>
<div class="semantic-key">
<span><i class="sk-blue"></i>вход <code>x</code>, query <code>q</code></span>
<span><i class="sk-yellow"></i>key <code>k</code>, оценка и вес</span>
<span><i class="sk-red"></i>value <code>v</code>, выход <code>z</code></span>
<span><i class="sk-green"></i>контекст и скрытое состояние RNN</span>
<span><i class="sk-pink"></i>текущий шаг или выбранный элемент</span>
</div>
<div class="callout-blue"><strong>Как работать с интерактивами:</strong> используйте «← Назад» и «Далее →». Прогресс показывает текущий шаг, а в схемах self-attention можно дополнительно кликать по словам и элементам матриц.</div>
<h2 id="part-1">Глава 1. RNN читает последовательность</h2><p>
  Рекуррентная сеть обрабатывает последовательность слева направо. На шаге <code>t</code> она получает
  два вектора: вход текущего слова <code>input_t</code> и собственное <strong>скрытое состояние</strong>
  с прошлого шага <code>hidden_{t−1}</code>. Из них одна и та же функция вычисляет новое состояние:
</p><div class="math-display" data-tex="h_t = f(x_t,\, h_{t-1}) = \tanh\left(W_{xh}\,x_t + W_{hh}\,h_{t-1} + b\right), \qquad y_t = g(h_t)"></div><p>
  Важная деталь — матрицы <code>W_xh</code> и <code>W_hh</code> одни и те же на всех шагах. Сеть
  не заводит отдельные веса для второго или пятого слова: она многократно применяет один слой, которому
  дали второй вход — его же результат с прошлого шага. Начальное состояние обычно берут нулевым.
</p><p>Посмотрим, как цепочка растёт слово за словом.</p>

<div class="stage" id="stageRnnUnrolled" tabindex="0">
  <div class="stage-figure">
<svg id="rnnUnrolledSvg" viewBox="0 0 1100 570" role="img" aria-label="Зелёные векторы входа внизу, синие скрытые состояния в центре, жёлтые выходы сверху. Красные стрелки передают информацию снизу вверх и от предыдущего состояния к следующему.">
  <style>#rnnUnrolledSvg .past .output{opacity:.35}#rnnUnrolledSvg .past .output-label{fill:#C9C2B8}#rnnUnrolledSvg .past .output-link{stroke:#C9C2B8;marker-end:url(#grayArrow)}</style>
  <defs><marker id="rnnUnrolledSvg-redArrow" markerWidth="7" markerHeight="7" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#5E5850"/></marker><marker id="grayArrow" markerWidth="7" markerHeight="7" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C9C2B8"/></marker></defs>
  <g data-key="step0" data-only="1"><g class="time-step current" data-step="0">
<rect class="focus-ring" x="46" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>

<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g></g>
  <g data-key="step1" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g><g class="time-step current" data-step="1">
<rect class="focus-ring" x="221" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>
<line class="output-link" x1="245" y1="207" x2="245" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="230" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M230 67.5h30 M230 95h30 M230 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="272" y="101" font-size="19" fill="#111">output₁</text></g>
</g></g>
  <g data-key="step2" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>
<line class="output-link" x1="245" y1="207" x2="245" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="230" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M230 67.5h30 M230 95h30 M230 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="272" y="101" font-size="19" fill="#111">output₁</text></g>
</g><g class="time-step current" data-step="2">
<rect class="focus-ring" x="396" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>
<line class="output-link" x1="420" y1="207" x2="420" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="405" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M405 67.5h30 M405 95h30 M405 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="447" y="101" font-size="19" fill="#111">output₂</text></g>
</g></g>
  <g data-key="step3" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>
<line class="output-link" x1="245" y1="207" x2="245" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="230" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M230 67.5h30 M230 95h30 M230 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="272" y="101" font-size="19" fill="#111">output₁</text></g>
</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>
<line class="output-link" x1="420" y1="207" x2="420" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="405" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M405 67.5h30 M405 95h30 M405 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="447" y="101" font-size="19" fill="#111">output₂</text></g>
</g><g class="time-step current" data-step="3">
<rect class="focus-ring" x="571" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>
<line class="output-link" x1="595" y1="207" x2="595" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="580" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M580 67.5h30 M580 95h30 M580 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="622" y="101" font-size="19" fill="#111">output₃</text></g>
</g></g>
  <g data-key="step4" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>
<line class="output-link" x1="245" y1="207" x2="245" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="230" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M230 67.5h30 M230 95h30 M230 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="272" y="101" font-size="19" fill="#111">output₁</text></g>
</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>
<line class="output-link" x1="420" y1="207" x2="420" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="405" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M405 67.5h30 M405 95h30 M405 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="447" y="101" font-size="19" fill="#111">output₂</text></g>
</g><g class="time-step past" data-step="3">

<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>
<line class="output-link" x1="595" y1="207" x2="595" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="580" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M580 67.5h30 M580 95h30 M580 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="622" y="101" font-size="19" fill="#111">output₃</text></g>
</g><g class="time-step current" data-step="4">
<rect class="focus-ring" x="746" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="620" y1="270" x2="745" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="755" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M755 417.5h30 M755 445h30 M755 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="451" font-size="19" fill="#111">input₄</text><text x="770" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">мате</text><text x="770" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g>
<line class="input-link" x1="770" y1="382" x2="770" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="755" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M755 242.5h30 M755 270h30 M755 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="246" font-size="19" fill="#111">hidden₄</text></g>
<line class="output-link" x1="770" y1="207" x2="770" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="755" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M755 67.5h30 M755 95h30 M755 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="797" y="101" font-size="19" fill="#111">output₄</text></g>
</g></g>
  <g data-key="step5" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>
<line class="output-link" x1="70" y1="207" x2="70" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="55" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M55 67.5h30 M55 95h30 M55 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="97" y="101" font-size="19" fill="#111">output₀</text></g>
</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>
<line class="output-link" x1="245" y1="207" x2="245" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="230" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M230 67.5h30 M230 95h30 M230 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="272" y="101" font-size="19" fill="#111">output₁</text></g>
</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>
<line class="output-link" x1="420" y1="207" x2="420" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="405" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M405 67.5h30 M405 95h30 M405 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="447" y="101" font-size="19" fill="#111">output₂</text></g>
</g><g class="time-step past" data-step="3">

<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>
<line class="output-link" x1="595" y1="207" x2="595" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="580" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M580 67.5h30 M580 95h30 M580 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="622" y="101" font-size="19" fill="#111">output₃</text></g>
</g><g class="time-step past" data-step="4">

<line class="recurrence" x1="620" y1="270" x2="745" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="755" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M755 417.5h30 M755 445h30 M755 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="451" font-size="19" fill="#111">input₄</text><text x="770" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">мате</text><text x="770" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g>
<line class="input-link" x1="770" y1="382" x2="770" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="755" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M755 242.5h30 M755 270h30 M755 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="246" font-size="19" fill="#111">hidden₄</text></g>
<line class="output-link" x1="770" y1="207" x2="770" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="755" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M755 67.5h30 M755 95h30 M755 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="797" y="101" font-size="19" fill="#111">output₄</text></g>
</g><g class="time-step current" data-step="5">
<rect class="focus-ring" x="921" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="795" y1="270" x2="920" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="930" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M930 417.5h30 M930 445h30 M930 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="972" y="451" font-size="19" fill="#111">input₅</text><text x="945" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">&lt;eos&gt;</text></g>
<line class="input-link" x1="945" y1="382" x2="945" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="930" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M930 242.5h30 M930 270h30 M930 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="972" y="246" font-size="19" fill="#111">hidden₅</text></g>
<line class="output-link" x1="945" y1="207" x2="945" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnUnrolledSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="930" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M930 67.5h30 M930 95h30 M930 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="972" y="101" font-size="19" fill="#111">output₅</text></g>
</g></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · «Я»</div>
      <h4>Шаг 1. «Я»: input₀ → hidden₀</h4>
      <p>Первый вход — вектор слова «Я», input₀. Вместе с начальным состоянием он формирует hidden₀. Из hidden₀ можно получить output₀. В этом примере начальное состояние принимаем равным нулю.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{0} = f(\mathrm{input}_{0}, \text{начальное состояние})"></div>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · «видел»</div>
      <h4>Шаг 2. «видел»: input₁ → hidden₁</h4>
      <p>Добавляется вход «видел», input₁. Сеть объединяет его с hidden₀ и вычисляет hidden₁. Новое состояние зависит уже от двух слов: «Я видел».</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{1} = f(\mathrm{input}_{1}, \mathrm{hidden}_{0})"></div>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · «котю»</div>
      <h4>Шаг 3. «котю»: input₂ → hidden₂</h4>
      <p>Добавляется вход «котю», input₂. В hidden₂ объединяются текущий вход и информация о предыдущих словах, переданная через hidden₁. Цепочка растёт слева направо.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{2} = f(\mathrm{input}_{2}, \mathrm{hidden}_{1})"></div>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · «на»</div>
      <h4>Шаг 4. «на»: input₃ → hidden₃</h4>
      <p>Следующий вход — «на», input₃. Чтобы вычислить hidden₃, нужны input₃ и уже полученное hidden₂. Информация о прочитанной части фразы передаётся дальше через скрытое состояние.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{3} = f(\mathrm{input}_{3}, \mathrm{hidden}_{2})"></div>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · «мате»</div>
      <h4>Шаг 5. «мате»: input₄ → hidden₄</h4>
      <p>Добавляется «мате», input₄. Состояние hidden₄ зависит от текущего слова и всей предшествующей цепочки вычислений. На каждом шаге применяется одна и та же функция с общими весами.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{4} = f(\mathrm{input}_{4}, \mathrm{hidden}_{3})"></div>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · конец последовательности</div>
      <h4>Шаг 6. «&lt;eos&gt;»: input₅ → hidden₅</h4>
      <p>Последний вход — &lt;eos&gt;, маркер конца последовательности. Получаем hidden₅ и output₅. Вся цепочка построена: каждое новое состояние вычислялось из текущего входа и предыдущего состояния.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{5} = f(\mathrm{input}_{5}, \mathrm{hidden}_{4})"></div>
    </div>
  </div>
</div>

<p class="stage-hint">Шесть шагов — шесть токенов. Прошлые выходы приглушены: на каждом шаге важен только текущий столбец.</p><div class="callout">
<strong>Главная мысль части:</strong> всё, что RNN знает о прочитанной части фразы, живёт в одном
  векторе <code>hidden_t</code>. Информация о «Я» доходит до пятого шага только через пять последовательных
  пересчётов этого вектора.
</div><hr/><h2 id="part-2">Глава 2. Один выход в конце и узкое место</h2><p>
  Во многих задачах ответ нужен один на всю последовательность: тональность отзыва, класс
  предложения, а в классическом переводчике seq2seq — вектор, с которого декодер начинает генерировать
  перевод. Тогда промежуточные выходы не вычисляют, а берут только последнее состояние:
</p><div class="math-display" data-tex="\text{output} = g(h_5), \qquad h_5 = f\bigl(x_5,\, f(x_4,\, f(x_3,\, \dots))\bigr)"></div>

<div class="stage" id="stageRnnFinal" tabindex="0">
  <div class="stage-figure">
<svg id="rnnFinalSvg" viewBox="0 0 1100 570" role="img" aria-label="Зелёные векторы входа внизу, синие скрытые состояния в центре, единственный жёлтый выход сверху появляется только на последнем шаге. Красные стрелки передают информацию снизу вверх и от предыдущего состояния к следующему.">
  <defs><marker id="rnnFinalSvg-redArrow" markerWidth="7" markerHeight="7" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#5E5850"/></marker></defs>
  <g data-key="step0" data-only="1"><g class="time-step current" data-step="0">
<rect class="focus-ring" x="46" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>

<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g></g>
  <g data-key="step1" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g><g class="time-step current" data-step="1">
<rect class="focus-ring" x="221" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>

</g></g>
  <g data-key="step2" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>

</g><g class="time-step current" data-step="2">
<rect class="focus-ring" x="396" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>

</g></g>
  <g data-key="step3" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>

</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>

</g><g class="time-step current" data-step="3">
<rect class="focus-ring" x="571" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>

</g></g>
  <g data-key="step4" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>

</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>

</g><g class="time-step past" data-step="3">

<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>

</g><g class="time-step current" data-step="4">
<rect class="focus-ring" x="746" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="620" y1="270" x2="745" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="755" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M755 417.5h30 M755 445h30 M755 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="451" font-size="19" fill="#111">input₄</text><text x="770" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">мате</text><text x="770" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g>
<line class="input-link" x1="770" y1="382" x2="770" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="755" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M755 242.5h30 M755 270h30 M755 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="246" font-size="19" fill="#111">hidden₄</text></g>

</g></g>
  <g data-key="step5" data-only="1"><g class="time-step past" data-step="0">


<g class="input"><rect x="55" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M55 417.5h30 M55 445h30 M55 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="451" font-size="19" fill="#111">input₀</text><text x="70" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">Я</text><text x="70" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g>
<line class="input-link" x1="70" y1="382" x2="70" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="55" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M55 242.5h30 M55 270h30 M55 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="97" y="246" font-size="19" fill="#111">hidden₀</text></g>

</g><g class="time-step past" data-step="1">

<line class="recurrence" x1="95" y1="270" x2="220" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="230" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M230 417.5h30 M230 445h30 M230 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="451" font-size="19" fill="#111">input₁</text><text x="245" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">видел</text><text x="245" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g>
<line class="input-link" x1="245" y1="382" x2="245" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="230" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M230 242.5h30 M230 270h30 M230 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="272" y="246" font-size="19" fill="#111">hidden₁</text></g>

</g><g class="time-step past" data-step="2">

<line class="recurrence" x1="270" y1="270" x2="395" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="405" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M405 417.5h30 M405 445h30 M405 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="451" font-size="19" fill="#111">input₂</text><text x="420" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">котю</text><text x="420" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g>
<line class="input-link" x1="420" y1="382" x2="420" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="405" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M405 242.5h30 M405 270h30 M405 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="447" y="246" font-size="19" fill="#111">hidden₂</text></g>

</g><g class="time-step past" data-step="3">

<line class="recurrence" x1="445" y1="270" x2="570" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="580" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M580 417.5h30 M580 445h30 M580 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="451" font-size="19" fill="#111">input₃</text><text x="595" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">на</text><text x="595" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g>
<line class="input-link" x1="595" y1="382" x2="595" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="580" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M580 242.5h30 M580 270h30 M580 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="622" y="246" font-size="19" fill="#111">hidden₃</text></g>

</g><g class="time-step past" data-step="4">

<line class="recurrence" x1="620" y1="270" x2="745" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="755" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M755 417.5h30 M755 445h30 M755 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="451" font-size="19" fill="#111">input₄</text><text x="770" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#111">мате</text><text x="770" y="555" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g>
<line class="input-link" x1="770" y1="382" x2="770" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="755" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M755 242.5h30 M755 270h30 M755 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="797" y="246" font-size="19" fill="#111">hidden₄</text></g>

</g><g class="time-step current" data-step="5">
<rect class="focus-ring" x="921" y="207" width="48" height="126" rx="8" fill="none" stroke="#D83BB9" stroke-width="1.5"/>
<line class="recurrence" x1="795" y1="270" x2="920" y2="270" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="input"><rect x="930" y="390" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M930 417.5h30 M930 445h30 M930 472.5h30" stroke="#fff" stroke-width="1.5"/><text x="972" y="451" font-size="19" fill="#111">input₅</text><text x="945" y="529" font-size="23" text-anchor="middle" font-weight="700" fill="#D83BB9">&lt;eos&gt;</text></g>
<line class="input-link" x1="945" y1="382" x2="945" y2="333" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="hidden-state"><rect x="930" y="215" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M930 242.5h30 M930 270h30 M930 297.5h30" stroke="#fff" stroke-width="1.5"/><text x="972" y="246" font-size="19" fill="#111">hidden₅</text></g>
<line class="output-link" x1="945" y1="207" x2="945" y2="158" stroke="#5E5850" stroke-width="2" marker-end="url(#rnnFinalSvg-redArrow)" pathLength="1"/>
<g class="output"><rect x="930" y="40" width="30" height="110" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><path d="M930 67.5h30 M930 95h30 M930 122.5h30" stroke="#fff" stroke-width="1.5"/><text class="output-label" x="972" y="101" font-size="19" fill="#111">output</text></g>
</g></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · «Я»</div>
      <h4>Шаг 1. «Я»: input₀ → hidden₀</h4>
      <p>Первый вход — вектор слова «Я», input₀. Вместе с начальным состоянием он формирует hidden₀. Начальное состояние здесь равно нулю. Выход пока не вычисляется: hidden₀ передаётся следующему шагу.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{0} = f(\mathrm{input}_{0}, \text{начальное состояние})"></div>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · «видел»</div>
      <h4>Шаг 2. «видел»: input₁ → hidden₁</h4>
      <p>Добавляется вход «видел», input₁. Сеть объединяет его с hidden₀ и вычисляет hidden₁. Это промежуточное состояние зависит уже от двух слов: «Я видел». Оно передаётся дальше, отдельного выхода на этом шаге нет.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{1} = f(\mathrm{input}_{1}, \mathrm{hidden}_{0})"></div>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · «котю»</div>
      <h4>Шаг 3. «котю»: input₂ → hidden₂</h4>
      <p>Добавляется вход «котю», input₂. В hidden₂ объединяются текущий вход и информация о предыдущих словах, переданная через hidden₁. Продолжаем обновлять скрытое состояние; итоговый выход появится в конце.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{2} = f(\mathrm{input}_{2}, \mathrm{hidden}_{1})"></div>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · «на»</div>
      <h4>Шаг 4. «на»: input₃ → hidden₃</h4>
      <p>Следующий вход — «на», input₃. Из input₃ и hidden₂ вычисляется hidden₃. Информация о прочитанной части фразы передаётся следующему шагу. Промежуточный выход не формируется.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{3} = f(\mathrm{input}_{3}, \mathrm{hidden}_{2})"></div>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · «мате»</div>
      <h4>Шаг 5. «мате»: input₄ → hidden₄</h4>
      <p>Добавляется «мате», input₄. Состояние hidden₄ зависит от текущего слова и всей предшествующей цепочки вычислений. Осталось обработать маркер конца последовательности — выход ещё не вычисляется.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{4} = f(\mathrm{input}_{4}, \mathrm{hidden}_{3})"></div>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · единственный output</div>
      <h4>Шаг 6. Конец последовательности → единственный output</h4>
      <p>Последний вход — &lt;eos&gt;, маркер конца последовательности. Сначала получаем hidden₅, затем из него вычисляем единственный output для всей последовательности. Это вариант RNN «много входов → один выход»: промежуточные состояния передавали информацию дальше, а выход формируется только в конце.</p>
      <div class="math-display" data-tex="\mathrm{hidden}_{5} = f(\mathrm{input}_{5}, \mathrm{hidden}_{4}) \to \mathrm{output}=g(\mathrm{hidden}_{5})"></div>
    </div>
  </div>
</div>

<p class="stage-hint">Жёлтый выход появляется только на шестом шаге, после маркера &lt;eos&gt;.</p><div class="callout-red">
<strong>Где ломается:</strong> размер <code>hidden_5</code> не зависит от длины фразы. Шесть слов или
  шестьдесят — всё сжимается в один вектор той же размерности. Вдобавок сигнал от первого слова проходит
  через все применения <code>f</code> подряд; при обучении градиент идёт тем же путём обратно и по дороге
  затухает. Длинные зависимости такая сеть учит плохо.
</div><div class="callout">
<strong>Главная мысль части:</strong> проблема не в том, что RNN плохо считает, а в форме схемы —
  всё прочитанное проходит через одно бутылочное горлышко <code>hidden_5</code>.
</div><hr/><h2 id="part-3">Глава 3. Attention: контекст из всех входов</h2><p>
  Идея внимания: не выбрасывать промежуточные представления. Пусть у нас есть векторы всех шести позиций
  <code>v₀ … v₅</code> — в RNN с attention это hidden states каждого шага. Вместо одного последнего вектора
  возьмём их <strong>взвешенную сумму</strong>, где вес показывает, насколько позиция важна для текущего запроса:
</p><div class="math-display" data-tex="c = \sum_{i=0}^{5} \alpha_i\, v_i, \qquad \alpha_i \ge 0, \quad \sum_{i=0}^{5} \alpha_i = 1"></div><p>
  Такой вектор называют <strong>контекстом</strong>. Каждый вес умножает все компоненты своего вектора,
  поэтому размерность <code>c</code> совпадает с размерностью каждого <code>vᵢ</code>. А раз веса
  неотрицательны и в сумме дают 1, контекст — это «смесь» входов в заданных пропорциях.
</p><div class="callout-blue">
<strong>Почему это лечит узкое место:</strong> путь от любого входа до контекста теперь длиной в одно
  умножение и одно сложение, а не пять пересчётов. И если для запроса важно первое слово, достаточно дать
  ему большой вес — ничего не придётся «протаскивать» через всю цепочку.
</div><p>Посмотрим, как контекст собирается по одному вкладу.</p>

<div class="stage" id="stageRnnAttn" tabindex="0">
  <div class="stage-figure">
<svg id="rnnAttnSvg" viewBox="0 0 1120 600" role="img" aria-label="Шесть голубых векторов внизу. Их взвешенные вклады по очереди направляются в общий пурпурный вектор контекста справа. После суммирования всех вкладов контекст используется для вычисления выхода.">
  <defs><marker id="blackArrow" markerWidth="6" markerHeight="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#111"/></marker><marker id="rnnAttnSvg-redArrow" markerWidth="6" markerHeight="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C29E08"/></marker></defs>
  <g data-key="step0" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution active-link" data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#C29E08" stroke-width="2.2" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source current-source" data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source " data-index="1" opacity="0.3"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source " data-index="2" opacity="0.3"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source " data-index="3" opacity="0.3"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source " data-index="4" opacity="0.3"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source " data-index="5" opacity="0.3"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Сумма c⁽1⁾</text><text x="937" y="307" font-size="16" fill="#5E5850">Вкладов: 1 из 6</text><text x="937" y="331" font-size="16" fill="#5E5850">собрано</text></g></g>
  <g data-key="step1" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution " data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution active-link" data-source="1" d="M250 412 C250 313 678 290 885 290" fill="none" stroke="#C29E08" stroke-width="2.8" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source " data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source current-source" data-index="1" opacity="1"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source " data-index="2" opacity="0.3"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source " data-index="3" opacity="0.3"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source " data-index="4" opacity="0.3"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source " data-index="5" opacity="0.3"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Сумма c⁽2⁾</text><text x="937" y="307" font-size="16" fill="#5E5850">Вкладов: 2 из 6</text><text x="937" y="331" font-size="16" fill="#5E5850">собрано</text></g></g>
  <g data-key="step2" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution " data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="1" d="M250 412 C250 313 678 290 885 290" fill="none" stroke="#111" stroke-width="2.8" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution active-link" data-source="2" d="M415 412 C415 306 716 290 885 290" fill="none" stroke="#C29E08" stroke-width="3.0999999999999996" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source " data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source " data-index="1" opacity="1"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source current-source" data-index="2" opacity="1"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source " data-index="3" opacity="0.3"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source " data-index="4" opacity="0.3"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source " data-index="5" opacity="0.3"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Сумма c⁽3⁾</text><text x="937" y="307" font-size="16" fill="#5E5850">Вкладов: 3 из 6</text><text x="937" y="331" font-size="16" fill="#5E5850">собрано</text></g></g>
  <g data-key="step3" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution " data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="1" d="M250 412 C250 313 678 290 885 290" fill="none" stroke="#111" stroke-width="2.8" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="2" d="M415 412 C415 306 716 290 885 290" fill="none" stroke="#111" stroke-width="3.0999999999999996" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution active-link" data-source="3" d="M580 412 C580 299 754 290 885 290" fill="none" stroke="#C29E08" stroke-width="1.9000000000000001" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source " data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source " data-index="1" opacity="1"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source " data-index="2" opacity="1"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source current-source" data-index="3" opacity="1"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source " data-index="4" opacity="0.3"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source " data-index="5" opacity="0.3"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Сумма c⁽4⁾</text><text x="937" y="307" font-size="16" fill="#5E5850">Вкладов: 4 из 6</text><text x="937" y="331" font-size="16" fill="#5E5850">собрано</text></g></g>
  <g data-key="step4" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution " data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="1" d="M250 412 C250 313 678 290 885 290" fill="none" stroke="#111" stroke-width="2.8" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="2" d="M415 412 C415 306 716 290 885 290" fill="none" stroke="#111" stroke-width="3.0999999999999996" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="3" d="M580 412 C580 299 754 290 885 290" fill="none" stroke="#111" stroke-width="1.9000000000000001" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution active-link" data-source="4" d="M745 412 C745 292 792 290 885 290" fill="none" stroke="#C29E08" stroke-width="2.2" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source " data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source " data-index="1" opacity="1"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source " data-index="2" opacity="1"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source " data-index="3" opacity="1"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source current-source" data-index="4" opacity="1"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source " data-index="5" opacity="0.3"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Сумма c⁽5⁾</text><text x="937" y="307" font-size="16" fill="#5E5850">Вкладов: 5 из 6</text><text x="937" y="331" font-size="16" fill="#5E5850">собрано</text></g></g>
  <g data-key="step5" data-only="1"><text x="40" y="75" font-size="22" font-weight="700" fill="#111">Один контекст — несколько источников</text><text x="40" y="109" font-size="17" fill="#5E5850">Входы vᵢ — представления слов.</text><text x="40" y="136" font-size="17" fill="#5E5850">В RNN с attention это могут быть hidden states.</text><path class="contribution " data-source="0" d="M85 412 C85 320 640 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="1" d="M250 412 C250 313 678 290 885 290" fill="none" stroke="#111" stroke-width="2.8" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="2" d="M415 412 C415 306 716 290 885 290" fill="none" stroke="#111" stroke-width="3.0999999999999996" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="3" d="M580 412 C580 299 754 290 885 290" fill="none" stroke="#111" stroke-width="1.9000000000000001" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution " data-source="4" d="M745 412 C745 292 792 290 885 290" fill="none" stroke="#111" stroke-width="2.2" pathLength="1" marker-end="url(#blackArrow)"/><path class="contribution active-link" data-source="5" d="M910 412 C910 395 910 374 910 356" fill="none" stroke="#C29E08" stroke-width="1.6" pathLength="1" marker-end="url(#rnnAttnSvg-redArrow)"/><g class="source " data-index="0" opacity="1"><rect x="70" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M70 447.5h30 M70 475h30 M70 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="109" y="481" font-size="18" fill="#5E5850">v₀</text><text x="110" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="85" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">Я</text><text x="85" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“I”</text></g><g class="source " data-index="1" opacity="1"><rect x="235" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M235 447.5h30 M235 475h30 M235 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="274" y="481" font-size="18" fill="#5E5850">v₁</text><text x="275" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">25%</text><text x="250" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">видел</text><text x="250" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“saw”</text></g><g class="source " data-index="2" opacity="1"><rect x="400" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M400 447.5h30 M400 475h30 M400 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="439" y="481" font-size="18" fill="#5E5850">v₂</text><text x="440" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">30%</text><text x="415" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">котю</text><text x="415" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“cat”</text></g><g class="source " data-index="3" opacity="1"><rect x="565" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M565 447.5h30 M565 475h30 M565 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="604" y="481" font-size="18" fill="#5E5850">v₃</text><text x="605" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">10%</text><text x="580" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">на</text><text x="580" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“on”</text></g><g class="source " data-index="4" opacity="1"><rect x="730" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M730 447.5h30 M730 475h30 M730 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="769" y="481" font-size="18" fill="#5E5850">v₄</text><text x="770" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">15%</text><text x="745" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#111">мате</text><text x="745" y="585" font-size="17" text-anchor="middle" fill="#5E5850">“mat”</text></g><g class="source current-source" data-index="5" opacity="1"><rect x="895" y="420" width="30" height="110" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><path d="M895 447.5h30 M895 475h30 M895 502.5h30" stroke="#fff" stroke-width="1.5"/><text x="934" y="481" font-size="18" fill="#5E5850">v₅</text><text x="935" y="408" text-anchor="start" class="weight" font-size="19" fill="#C29E08">5%</text><text x="910" y="560" font-size="23" font-weight="700" text-anchor="middle" fill="#C29E08">&lt;eos&gt;</text></g><g class="context-flash"><rect x="895" y="230" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 257.5h30 M895 285h30 M895 312.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="277" font-size="20" font-weight="700" fill="#111">Контекст c</text><text x="937" y="307" font-size="16" fill="#5E5850">Все 6 вкладов</text><text x="937" y="331" font-size="16" fill="#5E5850">собраны</text></g><g class="final-output" id="finalOutput"><line x1="910" y1="222" x2="910" y2="163" stroke="#111" stroke-width="2" marker-end="url(#blackArrow)"/><rect x="895" y="40" width="30" height="110" rx="3" fill="#73B222" stroke="#111" stroke-width="1.5"/><path d="M895 67.5h30 M895 95h30 M895 122.5h30" stroke="#fff" stroke-width="1.5"/><text x="937" y="101" font-size="20" fill="#111">output</text></g></g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · вклад «Я»</div>
      <h4>Шаг 1. Добавляем вклад «Я»</h4>
      <p>Начинаем с вектора «Я»: умножаем v₀ на вес 0,15 и кладём результат в сумму. Это первый вклад в будущий контекст. Остальные входы уже доступны, но их вклады пока не добавлены.</p>
      <div class="math-display" data-tex="c^{(1)} = 0{,}15 \cdot v_{0}"></div>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · вклад «видел»</div>
      <h4>Шаг 2. Добавляем вклад «видел»</h4>
      <p>Вектор «видел» умножается на 0,25. Его вклад прибавляется к уже собранному вкладу «Я». Оба вектора участвуют в одной общей сумме.</p>
      <div class="math-display" data-tex="c^{(2)} = 0{,}15 \cdot v_{0} + 0{,}25 \cdot v_{1}"></div>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · вклад «котю»</div>
      <h4>Шаг 3. Добавляем вклад «котю»</h4>
      <p>Добавляем 0,30 × v₂ — вклад «котю». У него самый большой вес в этом учебном примере. Каждый вес умножает все компоненты соответствующего вектора.</p>
      <div class="math-display" data-tex="c^{(3)} = 0{,}15 \cdot v_{0} + 0{,}25 \cdot v_{1} + 0{,}30 \cdot v_{2}"></div>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · вклад «на»</div>
      <h4>Шаг 4. Добавляем вклад «на»</h4>
      <p>Теперь добавляем 0,10 × v₃ для слова «на». Получаем частичную взвешенную сумму четырёх векторов. На каждом шаге складываем соответствующие компоненты.</p>
      <div class="math-display" data-tex="c^{(4)} = 0{,}15 \cdot v_{0} + 0{,}25 \cdot v_{1} + 0{,}30 \cdot v_{2} + 0{,}10 \cdot v_{3}"></div>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · вклад «мате»</div>
      <h4>Шаг 5. Добавляем вклад «мате»</h4>
      <p>Добавляем 0,15 × v₄ для слова «мате». Вклады предыдущих слов остаются в сумме. Размерность контекста совпадает с размерностью каждого входного vᵢ.</p>
      <div class="math-display" data-tex="c^{(5)} = 0{,}15 \cdot v_{0} + 0{,}25 \cdot v_{1} + 0{,}30 \cdot v_{2} + 0{,}10 \cdot v_{3} + 0{,}15 \cdot v_{4}"></div>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · контекст собран</div>
      <h4>Шаг 6. Контекст собран</h4>
      <p>Добавляем последний вклад: 0,05 × v₅ для &lt;eos&gt;. Получен контекст c — взвешенная сумма всех шести векторов. Он используется при вычислении выхода. Здесь вклады показаны по очереди для наглядности; суммирование можно выполнять параллельно.</p>
      <div class="math-display" data-tex="c = 0{,}15 \cdot v_{0} + 0{,}25 \cdot v_{1} + 0{,}30 \cdot v_{2} + 0{,}10 \cdot v_{3} + 0{,}15 \cdot v_{4} + 0{,}05 \cdot v_{5}"></div>
    </div>
  </div>
</div>

<p class="stage-hint">Толщина стрелки соответствует весу. Вклады показаны по очереди, но в модели сумма считается за одну операцию.</p><p>
  Схема показывает векторы условно. Подставим числа: возьмём для <code>vᵢ</code> учебные векторы длины 4
  (эти же числа дальше станут values) и веса из интерактива.
</p><table class="shape-table">
<tr><th>Позиция</th><th>Слово</th><th>vᵢ</th><th>αᵢ</th><th>αᵢ · vᵢ</th></tr>
<tr><td>0</td><td>Я</td><td>(1, 0, 0, 1)</td><td>0,15</td><td>(0,15; 0; 0; 0,15)</td></tr>
<tr><td>1</td><td>видел</td><td>(0, 2, 0, 0)</td><td>0,25</td><td>(0; 0,50; 0; 0)</td></tr>
<tr><td>2</td><td>котю</td><td>(0, 0, 2, 1)</td><td>0,30</td><td>(0; 0; 0,60; 0,30)</td></tr>
<tr><td>3</td><td>на</td><td>(1, 0, 1, 0)</td><td>0,10</td><td>(0,10; 0; 0,10; 0)</td></tr>
<tr><td>4</td><td>мате</td><td>(0, 1, 1, 2)</td><td>0,15</td><td>(0; 0,15; 0,15; 0,30)</td></tr>
<tr><td>5</td><td>&lt;eos&gt;</td><td>(0, 0, 0, 1)</td><td>0,05</td><td>(0; 0; 0; 0,05)</td></tr>
</table><div class="callout-yellow">
<strong>Оговорка про интерактив:</strong> веса здесь заданы заранее для одного фиксированного запроса.
  Схема показывает только сборку суммы. Как модель сама вычисляет веса — это следующий шаг — self-attention.
</div><div class="callout">
<strong>Главная мысль части:</strong> attention заменяет «последнее состояние» на взвешенную сумму всех
  состояний: <code>c = Σ αᵢ vᵢ</code>. Веса неотрицательны и дают в сумме 1, а размерность контекста
  совпадает с размерностью входов.
</div><hr/><h2 id="part-4">Глава 4. Откуда берутся веса внимания</h2><p>
  Остался главный вопрос: кто назначает веса. Ответ — они вычисляются из самих векторов. Есть
  <strong>запрос</strong> — вектор того, кому нужен контекст (в переводчике это текущее состояние декодера).
  Запрос сравнивается с каждым <code>vᵢ</code> функцией оценки, а оценки превращаются в распределение через softmax:
</p><div class="math-display" data-tex="\alpha_i = \operatorname{softmax}_i\bigl(\operatorname{score}(q,\, v_i)\bigr) = \frac{\exp\bigl(\operatorname{score}(q, v_i)\bigr)}{\sum_{j}\exp\bigl(\operatorname{score}(q, v_j)\bigr)}"></div><p>
  Softmax гарантирует ровно те свойства, которые мы требовали от весов: экспонента делает их положительными,
  деление на сумму — нормирует до единицы.
</p><table class="shape-table">
<tr><th></th><th>RNN, один выход</th><th>RNN + attention</th><th>Self-attention</th></tr>
<tr><td>Что видит выход</td><td>только h₅</td><td>все h₀ … h₅</td><td>все позиции</td></tr>
<tr><td>Путь от слова 0 к выходу</td><td>5 пересчётов f</td><td>1 взвешенная сумма</td><td>1 взвешенная сумма</td></tr>
<tr><td>Кто задаёт запрос</td><td>—</td><td>декодер</td><td>каждое слово само</td></tr>
<tr><td>Нужна рекурренция</td><td>да</td><td>да, для hᵢ</td><td>нет</td></tr>
</table><p>
  Последний столбец — следующий шаг. Если убрать рекурренцию совсем и разрешить <em>каждому</em> слову фразы
  быть запросом к остальным, получится <strong>self-attention</strong>: у каждой позиции появится свой
  контекст, и все их можно вычислить параллельно.
</p><div class="callout">
<strong>Главная мысль части:</strong> веса attention — не параметры, а результат вычисления:
  softmax от оценок сходства между запросом и каждым вектором.
</div><hr/><h2 id="part-5">Глава 5. Self-attention: у каждого слова свой выход</h2><p>
  В RNN с attention запрос был один — состояние декодера. В <strong>self-attention</strong> запросом по очереди
  становится каждая позиция самой последовательности. Для позиции <code>i</code> собирается свой контекст, и
  называют его <strong>выходным вектором</strong> <code>zᵢ</code>:
</p><div class="math-display" data-tex="z_i = \sum_{j=1}^{6} \alpha_{ij}\, v_j, \qquad i = 1, \dots, 6"></div><p>
  Шесть входов дают шесть выходов. Каждый <code>zᵢ</code> относится к своему слову, но собран из
  информации всей фразы — это новое, «контекстное» представление слова.
</p>

<div class="stage" id="stageSaOutputs" tabindex="0">
  <div class="stage-figure">
<svg id="saOutputsSvg" viewBox="0 0 1080 500" role="img" aria-label="Вверху — шесть входных векторов. Под ними слова и пунктирные связи к выбранной позиции. Ниже стрелка ведёт к её новому выходному вектору. На следующем шаге выбирается другое слово.">
  <defs><marker id="arrow" markerWidth="6" markerHeight="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#111"/></marker></defs>
  <g data-key="step0" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="90" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="90" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="90" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="90" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="90" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="90" y2="274"/></g><g><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#111" font-weight="400" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#111" font-weight="400" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#111" font-weight="400" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#111" font-weight="400" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#111" font-weight="400" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(90 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(90 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₁</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
  <g data-key="step1" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="270" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="270" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="270" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="270" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="270" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="270" y2="274"/></g><g><text text-anchor="middle" fill="#111" font-weight="400" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#111" font-weight="400" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#111" font-weight="400" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#111" font-weight="400" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#111" font-weight="400" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(270 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(270 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₂</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
  <g data-key="step2" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="450" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="450" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="450" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="450" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="450" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="450" y2="274"/></g><g><text text-anchor="middle" fill="#111" font-weight="400" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#111" font-weight="400" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#111" font-weight="400" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#111" font-weight="400" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#111" font-weight="400" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(450 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(450 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₃</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
  <g data-key="step3" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="630" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="630" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="630" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="630" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="630" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="630" y2="274"/></g><g><text text-anchor="middle" fill="#111" font-weight="400" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#111" font-weight="400" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#111" font-weight="400" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#111" font-weight="400" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#111" font-weight="400" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(630 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(630 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₄</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
  <g data-key="step4" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="810" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="810" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="810" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="810" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="810" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="810" y2="274"/></g><g><text text-anchor="middle" fill="#111" font-weight="400" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#111" font-weight="400" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#111" font-weight="400" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#111" font-weight="400" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#111" font-weight="400" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(810 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(810 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₅</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
  <g data-key="step5" data-only="1"><g><g transform="translate(90 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(270 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(450 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(630 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(810 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g><g transform="translate(990 10)"><rect x="-12" y="0" width="24" height="90" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="22.5" y2="22.5" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="45" y2="45" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="67.5" y2="67.5" stroke="#fff" stroke-width="1.5"/></g></g><g><text text-anchor="middle" fill="#111" x="90" y="154" font-size="24">Я</text><text text-anchor="middle" fill="#111" x="270" y="154" font-size="24">видел</text><text text-anchor="middle" fill="#111" x="450" y="154" font-size="24">котю</text><text text-anchor="middle" fill="#111" x="630" y="154" font-size="24">на</text><text text-anchor="middle" fill="#111" x="810" y="154" font-size="24">мате</text><text text-anchor="middle" fill="#111" x="990" y="154" font-size="24">&lt;eos&gt;</text></g><g><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="90" y1="175" x2="990" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="270" y1="175" x2="990" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="450" y1="175" x2="990" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="630" y1="175" x2="990" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="810" y1="175" x2="990" y2="274"/><line stroke="#5E5850" stroke-width="1.7" stroke-dasharray="5 4" x1="990" y1="175" x2="990" y2="274"/></g><g><text text-anchor="middle" fill="#111" font-weight="400" x="90" y="307" font-size="24">Я</text><text text-anchor="middle" fill="#111" font-weight="400" x="270" y="307" font-size="24">видел</text><text text-anchor="middle" fill="#111" font-weight="400" x="450" y="307" font-size="24">котю</text><text text-anchor="middle" fill="#111" font-weight="400" x="630" y="307" font-size="24">на</text><text text-anchor="middle" fill="#111" font-weight="400" x="810" y="307" font-size="24">мате</text><text text-anchor="middle" fill="#D83BB9" font-weight="700" x="990" y="307" font-size="24">&lt;eos&gt;</text></g><g transform="translate(990 0)"><rect x="-20" y="4" width="40" height="102" rx="6" fill="none" stroke="#D83BB9" stroke-width="1.5"/><circle r="3.5" cy="274" fill="#D83BB9"/></g><g transform="translate(990 0)" opacity="1"><line x1="0" y1="323" x2="0" y2="356" stroke="#111" stroke-width="1.6" marker-end="url(#arrow)"/><text x="0" y="382" text-anchor="middle" font-size="18" fill="#C30B0A" font-weight="700">z₆</text><g transform="translate(0 400)"><rect x="-12" y="0" width="24" height="80" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"/><line x1="-12" x2="12" y1="20" y2="20" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="40" y2="40" stroke="#fff" stroke-width="1.5"/><line x1="-12" x2="12" y1="60" y2="60" stroke="#fff" stroke-width="1.5"/></g></g></g>
</svg>
  </div>

  <div class="word-row" role="group" aria-label="Выберите слово, для которого собирается выход">
    <button type="button" data-goto="0" aria-pressed="true">Я</button>
    <button type="button" data-goto="1" aria-pressed="false">видел</button>
    <button type="button" data-goto="2" aria-pressed="false">котю</button>
    <button type="button" data-goto="3" aria-pressed="false">на</button>
    <button type="button" data-goto="4" aria-pressed="false">мате</button>
    <button type="button" data-goto="5" aria-pressed="false">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · выход для «Я»</div>
      <h4>Шаг 1. «Я» → z₁</h4>
      <p>Выбираем «Я». Query этой позиции сопоставляется с keys всех шести входов. Полученные веса определяют сумму values — выходной вектор z₁, новое представление «Я» с учётом контекста.</p>
      <div class="math-display" data-tex="z_{0} = \sum_j \alpha_{0j} \cdot v_j"></div>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · выход для «видел»</div>
      <h4>Шаг 2. «видел» → z₂</h4>
      <p>Теперь выбранное слово — «видел». Входные векторы те же, но Query другой. Attention получает свои веса для этой позиции и формирует её выходной вектор z₂.</p>
      <div class="math-display" data-tex="z_{1} = \sum_j \alpha_{1j} \cdot v_j"></div>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · выход для «котю»</div>
      <h4>Шаг 3. «котю» → z₃</h4>
      <p>Для «котю» повторяем тот же расчёт: обращаемся ко всем входным позициям, включая само слово. Результат z₃ относится к «котю», хотя использует информацию всей последовательности.</p>
      <div class="math-display" data-tex="z_{2} = \sum_j \alpha_{2j} \cdot v_j"></div>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · выход для «на»</div>
      <h4>Шаг 4. «на» → z₄</h4>
      <p>Слово «на» тоже получает отдельный выход z₄. Пунктир показывает доступные связи. Равный вид линий не означает равные веса: они вычисляются для текущего Query.</p>
      <div class="math-display" data-tex="z_{3} = \sum_j \alpha_{3j} \cdot v_j"></div>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · выход для «мате»</div>
      <h4>Шаг 5. «мате» → z₅</h4>
      <p>Выбираем «мате» и получаем z₅. Каждый выход относится к своей позиции. Self-attention превращает последовательность входных представлений в последовательность представлений с контекстом.</p>
      <div class="math-display" data-tex="z_{4} = \sum_j \alpha_{4j} \cdot v_j"></div>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · выход для «&lt;eos&gt;»</div>
      <h4>Шаг 6. «&lt;eos&gt;» → z₆</h4>
      <p>Для &lt;eos&gt; вычисляется z₆. Всего у шести входных позиций шесть выходных векторов: z₁…z₆. Мы показали их по очереди для наглядности; в модели эти выходы можно вычислять параллельно. Это векторы признаков, а не предсказанные следующие слова.</p>
      <div class="math-display" data-tex="z_{5} = \sum_j \alpha_{5j} \cdot v_j"></div>
    </div>
  </div>
</div>

<p class="stage-hint">Нажмите на слово в нижнем ряду или используйте «Далее»: входные векторы не двигаются — перемещается только позиция, для которой собирается выход.</p><p>
  Связи на этой схеме нарисованы одинаково. На деле у каждой позиции-запроса свой набор весов: одни слова
  важны больше, другие меньше. Следующая схема показывает веса толщиной линий.
</p>

<div class="stage" id="stageSaLinks" tabindex="0">
  <div class="stage-figure">
<svg id="saLinksSvg" viewBox="0 0 1080 320" role="img" aria-label="Два ряда содержат одну и ту же последовательность. Шесть линий связывают выбранную нижнюю позицию с верхними словами. Толщина линий и проценты показывают веса внимания.">
  <g data-key="step0" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="4.6" stroke-opacity="0.623"/><line stroke-linecap="butt" x1="270" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="11.35" stroke-opacity="1.0"/><line stroke-linecap="butt" x1="450" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="5.35" stroke-opacity="0.665"/><line stroke-linecap="butt" x1="630" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="2.35" stroke-opacity="0.498"/><line stroke-linecap="butt" x1="810" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="3.1" stroke-opacity="0.539"/><line stroke-linecap="butt" x1="990" y1="102" x2="90" y2="310" stroke="#C29E08" stroke-width="1.85" stroke-opacity="0.47"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">16%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="700">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">43%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="500">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">19%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="500">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">7%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="500">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">10%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">5%</text></g><circle fill="#D83BB9" r="4" cx="90" cy="310"/></g>
  <g data-key="step1" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="6.6" stroke-opacity="0.735"/><line stroke-linecap="butt" x1="270" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="3.1" stroke-opacity="0.539"/><line stroke-linecap="butt" x1="450" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="9.6" stroke-opacity="0.902"/><line stroke-linecap="butt" x1="630" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="2.85" stroke-opacity="0.526"/><line stroke-linecap="butt" x1="810" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="4.6" stroke-opacity="0.623"/><line stroke-linecap="butt" x1="990" y1="102" x2="270" y2="310" stroke="#C29E08" stroke-width="1.85" stroke-opacity="0.47"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">24%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="500">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">10%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="700">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">36%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="500">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">9%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="500">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">16%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">5%</text></g><circle fill="#D83BB9" r="4" cx="270" cy="310"/></g>
  <g data-key="step2" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="4.85" stroke-opacity="0.638"/><line stroke-linecap="butt" x1="270" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="9.35" stroke-opacity="0.888"/><line stroke-linecap="butt" x1="450" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="4.1000000000000005" stroke-opacity="0.595"/><line stroke-linecap="butt" x1="630" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="3.35" stroke-opacity="0.553"/><line stroke-linecap="butt" x1="810" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="4.85" stroke-opacity="0.638"/><line stroke-linecap="butt" x1="990" y1="102" x2="450" y2="310" stroke="#C29E08" stroke-width="2.1" stroke-opacity="0.483"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">17%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="700">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">35%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="500">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">14%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="500">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">11%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="500">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">17%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">6%</text></g><circle fill="#D83BB9" r="4" cx="450" cy="310"/></g>
  <g data-key="step3" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="2.35" stroke-opacity="0.498"/><line stroke-linecap="butt" x1="270" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="3.6" stroke-opacity="0.568"/><line stroke-linecap="butt" x1="450" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="7.6000000000000005" stroke-opacity="0.791"/><line stroke-linecap="butt" x1="630" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="3.1" stroke-opacity="0.539"/><line stroke-linecap="butt" x1="810" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="9.85" stroke-opacity="0.917"/><line stroke-linecap="butt" x1="990" y1="102" x2="630" y2="310" stroke="#C29E08" stroke-width="2.1" stroke-opacity="0.483"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">7%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="500">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">12%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="500">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">28%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="500">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">10%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="700">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">37%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">6%</text></g><circle fill="#D83BB9" r="4" cx="630" cy="310"/></g>
  <g data-key="step4" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="2.35" stroke-opacity="0.498"/><line stroke-linecap="butt" x1="270" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="4.35" stroke-opacity="0.609"/><line stroke-linecap="butt" x1="450" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="7.849999999999999" stroke-opacity="0.805"/><line stroke-linecap="butt" x1="630" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="9.1" stroke-opacity="0.874"/><line stroke-linecap="butt" x1="810" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="3.1" stroke-opacity="0.539"/><line stroke-linecap="butt" x1="990" y1="102" x2="810" y2="310" stroke="#C29E08" stroke-width="1.85" stroke-opacity="0.47"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">7%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="500">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">15%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="500">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">29%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="700">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">34%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="500">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">10%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">5%</text></g><circle fill="#D83BB9" r="4" cx="810" cy="310"/></g>
  <g data-key="step5" data-only="1"><g><line stroke-linecap="butt" x1="90" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="4.35" stroke-opacity="0.609"/><line stroke-linecap="butt" x1="270" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="6.35" stroke-opacity="0.721"/><line stroke-linecap="butt" x1="450" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="6.1" stroke-opacity="0.707"/><line stroke-linecap="butt" x1="630" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="3.6" stroke-opacity="0.568"/><line stroke-linecap="butt" x1="810" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="5.1" stroke-opacity="0.651"/><line stroke-linecap="butt" x1="990" y1="102" x2="990" y2="310" stroke="#C29E08" stroke-width="3.1" stroke-opacity="0.539"/></g><g><text text-anchor="middle" fill="#111" x="90" y="51" font-size="30" font-weight="500">Я</text><text text-anchor="middle" fill="#C29E08" x="90" y="82" font-size="16">15%</text><text text-anchor="middle" fill="#111" x="270" y="51" font-size="30" font-weight="700">видел</text><text text-anchor="middle" fill="#C29E08" x="270" y="82" font-size="16">23%</text><text text-anchor="middle" fill="#111" x="450" y="51" font-size="30" font-weight="500">котю</text><text text-anchor="middle" fill="#C29E08" x="450" y="82" font-size="16">22%</text><text text-anchor="middle" fill="#111" x="630" y="51" font-size="30" font-weight="500">на</text><text text-anchor="middle" fill="#C29E08" x="630" y="82" font-size="16">12%</text><text text-anchor="middle" fill="#111" x="810" y="51" font-size="30" font-weight="500">мате</text><text text-anchor="middle" fill="#C29E08" x="810" y="82" font-size="16">18%</text><text text-anchor="middle" fill="#111" x="990" y="51" font-size="30" font-weight="500">&lt;eos&gt;</text><text text-anchor="middle" fill="#C29E08" x="990" y="82" font-size="16">10%</text></g><circle fill="#D83BB9" r="4" cx="990" cy="310"/></g>
</svg>
  </div>

  <div class="word-row" role="group" aria-label="Выберите слово — источник query">
    <button type="button" data-goto="0" aria-pressed="true">Я</button>
    <button type="button" data-goto="1" aria-pressed="false">видел</button>
    <button type="button" data-goto="2" aria-pressed="false">котю</button>
    <button type="button" data-goto="3" aria-pressed="false">на</button>
    <button type="button" data-goto="4" aria-pressed="false">мате</button>
    <button type="button" data-goto="5" aria-pressed="false">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · query — «Я»</div>
      <h4>Шаг 1. Query — «Я»</h4>
      <p>Query берётся из «Я». В учебном распределении самый большой вес у «видел» — 43%. Все шесть слов участвуют в формировании нового представления позиции «Я».</p>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · query — «видел»</div>
      <h4>Шаг 2. Query — «видел»</h4>
      <p>Теперь Query — из «видел». Набор слов тот же, но веса другие: самый большой вклад в этом примере у «котю» — 36%. Линии сходятся к новой выбранной позиции.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · query — «котю»</div>
      <h4>Шаг 3. Query — «котю»</h4>
      <p>Query слова «котю» сравнивается с keys всех слов, включая себя. Наибольший вес в примере у «видел» — 35%. Вертикальная линия связывает выбранное слово с его собственной позицией.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · query — «на»</div>
      <h4>Шаг 4. Query — «на»</h4>
      <p>Смотрим из позиции «на». Наибольший вес здесь у «мате» — 37%. Более тонкие линии означают меньшие веса, а не отсутствие связи.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · query — «мате»</div>
      <h4>Шаг 5. Query — «мате»</h4>
      <p>Теперь выбранное слово — «мате». В этом распределении наибольший вес у «на» — 34%, следующий у «котю» — 29%. Веса определяют, как смешиваются соответствующие values.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · query — «&lt;eos&gt;»</div>
      <h4>Шаг 6. Query — «&lt;eos&gt;»</h4>
      <p>Последняя позиция — &lt;eos&gt;, маркер конца последовательности. Для неё тоже есть отдельный Query и свои веса. Мы рассмотрели позиции по очереди; в self-attention их представления можно вычислять параллельно.</p>
    </div>
  </div>
</div>

<p class="stage-hint">Нажмите на слово в нижнем ряду или используйте «Далее»: нижний ряд — источник запроса, верхний — слова, на которые смотрит attention. Проценты в каждом шаге дают 100%.</p><div class="callout-blue">
<strong>Об этих процентах:</strong> в двух первых схемах веса — учебные распределения, придуманные для
  наглядности. Начиная с части 3 веса вычисляются из конкретных чисел q и k, поэтому для «Я» получится не 43%,
  а 39% на «видел». Важна не точная цифра, а то, что строка весов своя у каждого слова.
</div><div class="callout">
<strong>Главная мысль части:</strong> self-attention превращает последовательность из шести векторов в
  последовательность из шести векторов той же длины; каждый выход <code>zᵢ</code> — смесь values всей фразы
  со своими весами.
</div><hr/>

<h2 id="part-6">Глава 6. Три роли: query, key, value</h2><p>
  Если бы веса считались прямо из входных векторов <code>xᵢ</code>, веса были бы симметричными
  (<code>xᵢ · xⱼ = xⱼ · xᵢ</code>), а «что искать» и «что отдавать» совпадали бы. Поэтому каждый вход проецируется в три разных
  вектора тремя обучаемыми матрицами:
</p><div class="math-display" data-tex="q_i = W_Q^{\mathsf T} x_i, \qquad k_i = W_K^{\mathsf T} x_i, \qquad v_i = W_V^{\mathsf T} x_i"></div><table class="shape-table">
<tr><th>Вектор</th><th>Роль</th><th>Где участвует</th></tr>
<tr><td><strong>query</strong> qᵢ</td><td>что ищет позиция i</td><td>сравнивается с keys всех позиций</td></tr>
<tr><td><strong>key</strong> kⱼ</td><td>по чему позицию j находят</td><td>стоит в оценке sᵢⱼ = qᵢ · kⱼ</td></tr>
<tr><td><strong>value</strong> vⱼ</td><td>что позиция j передаёт</td><td>складывается с весом αᵢⱼ в zᵢ</td></tr>
</table><div class="stage" id="stageSaRoles" tabindex="0">
  <div class="stage-figure">
<svg id="svgSaRoles" viewBox="0 0 530 670" role="img" aria-label="Снизу — шесть входных векторов. Синий query выбранного слова сравнивается со всеми жёлтыми keys. Softmax даёт веса для суммы красных values. Сверху — выход выбранной позиции.">
  <defs>
<marker id="mq-sar" markerHeight="5" markerWidth="5" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#3576C0"></path></marker>
<marker id="mk-sar" markerHeight="5" markerWidth="5" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C29E08"></path></marker>
<marker id="mv-sar" markerHeight="5" markerWidth="5" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C30B0A"></path></marker>
<marker id="mz-sar" markerHeight="5" markerWidth="5" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C30B0A"></path></marker>
<marker id="ms-sar" markerHeight="5" markerWidth="5" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#C9C2B8"></path></marker>
</defs>
  <g data-key="step0" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="65" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="243.32" x2="65" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="203.36" x2="65" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="238.88" x2="65" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="256.64" x2="65" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="252.2" x2="65" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="259.6" x2="65" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="243.32" height="23.68"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="203.36" height="63.64"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="238.88" height="28.12"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="256.64" height="10.360000000000001"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="252.2" height="14.8"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="259.6" height="7.4"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(65 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(65 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="1"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="0.25"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="0.25"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="0.25"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="0.25"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="0.25"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
</g>
  <g data-key="step1" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="145" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="231.48000000000002" x2="145" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="252.2" x2="145" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="213.72" x2="145" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="253.68" x2="145" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="243.32" x2="145" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="259.6" x2="145" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="231.48000000000002" height="35.519999999999996"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="252.2" height="14.8"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="213.72" height="53.28"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="253.68" height="13.32"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="243.32" height="23.68"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="259.6" height="7.4"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(145 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(145 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="0.25"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="1"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="0.25"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="0.25"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="0.25"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="0.25"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
</g>
  <g data-key="step2" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="225" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="241.84" x2="225" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="215.2" x2="225" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="246.28" x2="225" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="250.72" x2="225" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="241.84" x2="225" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="258.12" x2="225" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="241.84" height="25.16"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="215.2" height="51.8"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="246.28" height="20.720000000000002"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="250.72" height="16.28"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="241.84" height="25.16"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="258.12" height="8.879999999999999"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(225 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(225 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="0.25"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="0.25"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="1"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="0.25"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="0.25"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="0.25"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
</g>
  <g data-key="step3" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="305" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="256.64" x2="305" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="249.24" x2="305" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="225.56" x2="305" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="252.2" x2="305" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="212.24" x2="305" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="258.12" x2="305" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="256.64" height="10.360000000000001"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="249.24" height="17.759999999999998"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="225.56" height="41.440000000000005"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="252.2" height="14.8"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="212.24" height="54.76"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="258.12" height="8.879999999999999"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(305 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(305 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="0.25"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="0.25"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="0.25"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="1"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="0.25"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="0.25"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
</g>
  <g data-key="step4" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="385" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="256.64" x2="385" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="244.8" x2="385" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="224.08" x2="385" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="216.68" x2="385" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="252.2" x2="385" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="259.6" x2="385" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="256.64" height="10.360000000000001"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="244.8" height="22.2"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="224.08" height="42.919999999999995"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="216.68" height="50.32"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="252.2" height="14.8"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="259.6" height="7.4"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(385 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(385 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="0.25"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="0.25"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="0.25"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="0.25"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="1"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="0.25"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
</g>
  <g data-key="step5" data-only="1">
<rect fill="#F4F3EF" height="350" stroke="#C9C2B8" stroke-dasharray="5 4" width="496" x="17" y="128"></rect>
<text fill="#5E5850" font-size="20" text-anchor="end" x="501" y="119">self-attention</text>
<g><rect x="33" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="65" y1="590" x2="65" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="55" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M55,522h20 M55,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="65" y1="502" x2="47" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="65" y1="502" x2="83" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="38.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M38.5,430h17 M38.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="74.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M74.5,430h17 M74.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="47" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="83" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="47" y1="409" x2="47" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="47" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="47" y1="331" x2="47" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M83 410 C97 350 97 309 83 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="65" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">Я</text><text x="65" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“I”</text><rect x="113" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="145" y1="590" x2="145" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="135" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M135,522h20 M135,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="145" y1="502" x2="127" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="145" y1="502" x2="163" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="118.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M118.5,430h17 M118.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="154.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M154.5,430h17 M154.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="127" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="163" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="127" y1="409" x2="127" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="127" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="127" y1="331" x2="127" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M163 410 C177 350 177 309 163 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="145" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">видел</text><text x="145" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“saw”</text><rect x="193" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="225" y1="590" x2="225" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="215" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M215,522h20 M215,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="225" y1="502" x2="207" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="225" y1="502" x2="243" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="198.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M198.5,430h17 M198.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="234.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M234.5,430h17 M234.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="207" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="243" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="207" y1="409" x2="207" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="207" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="207" y1="331" x2="207" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M243 410 C257 350 257 309 243 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="225" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">котю</text><text x="225" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“cat”</text><rect x="273" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="305" y1="590" x2="305" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="295" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M295,522h20 M295,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="305" y1="502" x2="287" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="305" y1="502" x2="323" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="278.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M278.5,430h17 M278.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="314.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M314.5,430h17 M314.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="287" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="323" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="287" y1="409" x2="287" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="287" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="287" y1="331" x2="287" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M323 410 C337 350 337 309 323 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="305" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">на</text><text x="305" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“on”</text><rect x="353" y="491" width="64" height="140" rx="9" fill="none" opacity="0"></rect><line x1="385" y1="590" x2="385" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="375" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M375,522h20 M375,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="385" y1="502" x2="367" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="385" y1="502" x2="403" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="358.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M358.5,430h17 M358.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="394.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M394.5,430h17 M394.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="367" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="403" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="367" y1="409" x2="367" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="367" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="367" y1="331" x2="367" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M403 410 C417 350 417 309 403 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="385" y="614" font-size="22" text-anchor="middle" fill="#111" font-weight="600">мате</text><text x="385" y="643" font-size="20" text-anchor="middle" fill="#5E5850">“mat”</text><rect x="433" y="491" width="64" height="140" rx="9" fill="none" opacity="1"></rect><line x1="465" y1="590" x2="465" y2="560" stroke="#C9C2B8" stroke-width="1.6" marker-end="url(#ms-sar)"></line><g><rect x="455" y="504" width="20" height="54" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M455,522h20 M455,540h20" stroke="white" stroke-width="1.5"></path></g><line x1="465" y1="502" x2="447" y2="470" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><line x1="465" y1="502" x2="483" y2="470" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></line><g><rect x="438.5" y="412" width="17" height="54" rx="3" fill="#C29E08" stroke="#111" stroke-width="1.5"></rect><path d="M438.5,430h17 M438.5,448h17" stroke="white" stroke-width="1.5"></path></g><g><rect x="474.5" y="412" width="17" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M474.5,430h17 M474.5,448h17" stroke="white" stroke-width="1.5"></path></g><text x="447" y="489" font-size="15" text-anchor="middle" fill="#C29E08">K</text><text x="483" y="489" font-size="15" text-anchor="middle" fill="#C30B0A">V</text><line x1="447" y1="409" x2="447" y2="346" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><circle cx="447" cy="338" r="7" fill="#C29E08" stroke="#C29E08" stroke-width="1.4"></circle><line x1="447" y1="331" x2="447" y2="319" stroke="#C29E08" stroke-width="1.6" marker-end="url(#mk-sar)"></line><path d="M483 410 C497 350 497 309 483 270" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mv-sar)"></path><text x="465" y="614" font-size="22" text-anchor="middle" fill="#3576C0" font-weight="600">&lt;eos&gt;</text><text x="465" y="643" font-size="20" text-anchor="middle" fill="#5E5850"></text></g><g><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="47" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="127" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="207" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="287" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="367" y2="345"></line><line stroke="#3576C0" stroke-width="1.5" marker-end="url(#mq-sar)" x1="465" y1="367" x2="447" y2="345"></line></g><g><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="47" y1="244.8" x2="465" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="127" y1="232.96" x2="465" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="207" y1="234.44" x2="465" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="287" y1="249.24" x2="465" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="367" y1="240.36" x2="465" y2="202"></line><line stroke="#C9C2B8" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#ms-sar)" x1="447" y1="252.2" x2="465" y2="202"></line></g><g><rect x="40" width="14" fill="#C29E08" stroke="#C29E08" y="244.8" height="22.2"></rect><rect x="120" width="14" fill="#C29E08" stroke="#C29E08" y="232.96" height="34.04"></rect><rect x="200" width="14" fill="#C29E08" stroke="#C29E08" y="234.44" height="32.56"></rect><rect x="280" width="14" fill="#C29E08" stroke="#C29E08" y="249.24" height="17.759999999999998"></rect><rect x="360" width="14" fill="#C29E08" stroke="#C29E08" y="240.36" height="26.64"></rect><rect x="440" width="14" fill="#C29E08" stroke="#C29E08" y="252.2" height="14.8"></rect></g>
<rect fill="#F4F3EF" height="32" stroke="#C9C2B8" stroke-dasharray="5 4" width="470" x="30" y="284"></rect>
<text fill="#111111" font-size="21" text-anchor="middle" x="265" y="307">softmax</text>
<g transform="translate(465 0)"><line x1="0" y1="502" x2="0" y2="407" stroke="#3576C0" stroke-width="1.6" marker-end="url(#mq-sar)"></line><g><rect x="-8" y="369" width="16" height="36" rx="3" fill="#3576C0" stroke="#111" stroke-width="1.5"></rect><path d="M-8,381h16 M-8,393h16" stroke="white" stroke-width="1.5"></path></g><text x="10" y="391" font-size="18" fill="#3576C0" font-weight="700">Q</text></g><g transform="translate(465 0)"><g><rect x="-10" y="145" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M-10,163h20 M-10,181h20" stroke="white" stroke-width="1.5"></path></g><line x1="0" y1="142" x2="0" y2="102" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#mz-sar)"></line></g><g><g opacity="0.25"><g><rect x="55" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M55,62h20 M55,80h20" stroke="white" stroke-width="1.5"></path></g><text x="65" y="28" font-size="21" text-anchor="middle" fill="#111">Я</text></g><g opacity="0.25"><g><rect x="135" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M135,62h20 M135,80h20" stroke="white" stroke-width="1.5"></path></g><text x="145" y="28" font-size="21" text-anchor="middle" fill="#111">видел</text></g><g opacity="0.25"><g><rect x="215" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M215,62h20 M215,80h20" stroke="white" stroke-width="1.5"></path></g><text x="225" y="28" font-size="21" text-anchor="middle" fill="#111">котю</text></g><g opacity="0.25"><g><rect x="295" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M295,62h20 M295,80h20" stroke="white" stroke-width="1.5"></path></g><text x="305" y="28" font-size="21" text-anchor="middle" fill="#111">на</text></g><g opacity="0.25"><g><rect x="375" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M375,62h20 M375,80h20" stroke="white" stroke-width="1.5"></path></g><text x="385" y="28" font-size="21" text-anchor="middle" fill="#111">мате</text></g><g opacity="1"><g><rect x="455" y="44" width="20" height="54" rx="3" fill="#C30B0A" stroke="#111" stroke-width="1.5"></rect><path d="M455,62h20 M455,80h20" stroke="white" stroke-width="1.5"></path></g><text x="465" y="28" font-size="21" text-anchor="middle" fill="#111">&lt;eos&gt;</text></g></g>
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
    <div class="step-panel" data-on="step0" data-focus="step0">
      <div class="step-kicker">Шаг 1 · query «Я»</div>
      <h4>Query — «Я»</h4>
      <p>Вектор слова «Я» даёт query Q₁. Он сравнивается с keys всех шести позиций. После softmax их values складываются с полученными весами: результат — новое представление слова «Я».</p>
    </div>
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Шаг 2 · query «видел»</div>
      <h4>Query — «видел»</h4>
      <p>Теперь query берётся из слова «видел». Keys и values остаются теми же, но другой query даёт другие веса. Взвешенная сумма становится выходным вектором для «видел».</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Шаг 3 · query «котю»</div>
      <h4>Query — «котю»</h4>
      <p>Query слова «котю» собирает информацию из всей последовательности — как на исходной схеме. У «котю» тоже есть собственные key и value: слово может учитывать и себя.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Шаг 4 · query «на»</div>
      <h4>Query — «на»</h4>
      <p>Теперь внимание смотрит из позиции «на». Query сравнивается с теми же шестью keys, а новый набор весов определяет вклад каждого value в представление слова «на».</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Шаг 5 · query «мате»</div>
      <h4>Query — «мате»</h4>
      <p>Слово «мате» становится источником query. Ещё раз меняются веса и их взвешенная сумма. Выход относится к текущей позиции, хотя использует информацию всех слов.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Шаг 6 · query «&lt;eos&gt;»</div>
      <h4>Query — «&lt;eos&gt;»</h4>
      <p>Последняя позиция — &lt;eos&gt;, маркер конца последовательности. Для неё выполняется тот же расчёт. Здесь мы показали шесть позиций по очереди; в трансформере их можно вычислять параллельно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p><p>Откуда именно берутся эти векторы и почему матрицы общие для всех слов — на следующей схеме.</p><div class="stage" id="stageSaProj" tabindex="0">
  <div class="stage-figure">
<svg id="svgSaProj" viewBox="0 0 1080 660" role="img" aria-label="Проекции q, k, v. Справа вверху шесть входных векторов токенов. Слева три матрицы весов W_Q, W_K, W_V. В пунктирной рамке — по три вектора q, k, v для каждого токена.">
  <style>
    svg { --ink:#111; --muted:#5E5850; --card:#FFFFFF; --blue:#3576C0; font-family: Helvetica, Arial, sans-serif; }
    .ink { fill: var(--ink); }
    .muted { fill: var(--muted); }
    .box { stroke: #111; stroke-width: 1.5; }
    .word-t { cursor: pointer; }
  </style>
  <defs>
    <marker id="sap-arr" markerHeight="6" markerWidth="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="context-stroke"></path></marker>
    <marker id="sap-arrI" markerHeight="6" markerWidth="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#111"></path></marker>
  </defs>
  <g data-sap="top"></g>
  <g data-sap="frame"></g>
  <g data-sap="weights"></g>
  <g data-sap="roles"></g>
  <g data-sap="vecs"></g>
  <g data-sap="conn"></g>
</svg>
  </div>
  <div class="word-row" role="group" aria-label="Выберите токен">
    <button type="button" data-token="0" aria-pressed="true" aria-label="Токен «Я»">Я</button>
    <button type="button" data-token="1" aria-pressed="false" aria-label="Токен «видел»">видел</button>
    <button type="button" data-token="2" aria-pressed="false" aria-label="Токен «котю»">котю</button>
    <button type="button" data-token="3" aria-pressed="false" aria-label="Токен «на»">на</button>
    <button type="button" data-token="4" aria-pressed="false" aria-label="Токен «мате»">мате</button>
    <button type="button" data-token="5" aria-pressed="false" aria-label="Токен «&lt;eos&gt;»">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker"></div>
      <h4></h4>
      <p></p>
      <div class="math-display" data-tex=""></div>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageSaProj');
  if (!stage) return;
  var svg = stage.querySelector('.stage-figure svg');
  if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg';
  var G = function (name) { return svg.querySelector('[data-sap="' + name + '"]'); };

  var W = ['Я', 'видел', 'котю', 'на', 'мате', '<eos>'], M = W.length, N = 7;
  var X0 = 280, CW = (1080 - X0) / M, VH = 64, XT = 104, XH = 100;
  var CX = function (i) { return X0 + (i + 0.5) * CW; };
  var ROWS = [
    { k: 'q', n: 'Q', fill: '#3576C0', ink: '#3576C0', y: 258, role: 'q: что ищет токен' },
    { k: 'k', n: 'K', fill: '#C29E08', ink: '#C29E08', y: 376, role: 'k: по чему его находят' },
    { k: 'v', n: 'V', fill: '#C30B0A', ink: '#C30B0A', y: 494, role: 'v: что он передаёт' }
  ];
  var esc = function (t) { return t.replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  function el(tag, a, p, txt) {
    var n = document.createElementNS(NS, tag);
    for (var k in a) n.setAttribute(k, a[k]);
    if (txt != null) n.textContent = txt;
    p.appendChild(n);
    return n;
  }
  function vector(p, x, y, w, h, fill) {
    var g = el('g', {}, p);
    el('rect', { x: x - w / 2, y: y, width: w, height: h, fill: fill, 'class': 'box' }, g);
    for (var i = 1; i < 4; i++) {
      el('line', { x1: x - w / 2 + 1, x2: x + w / 2 - 1, y1: y + h * i / 4, y2: y + h * i / 4, stroke: '#fff', 'stroke-width': 1.4 }, g);
    }
    return g;
  }
  function sym(p, x, y, base, sub, size) {
    size = size || 17;
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': size, 'class': 'ink' }, p);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, base);
    el('tspan', { dy: 5, 'font-size': Math.round(size * 0.72) }, t, sub);
    return t;
  }
  function brace(p, x1, x2, y, up) {
    var m = (x1 + x2) / 2, d = up ? -1 : 1, r = 12;
    el('path', {
      d: 'M' + x1 + ' ' + (y + d * r) + ' Q' + x1 + ' ' + y + ' ' + (x1 + r) + ' ' + y +
         ' L' + (m - 8) + ' ' + y + ' Q' + m + ' ' + y + ' ' + m + ' ' + (y - d * 10) +
         ' Q' + m + ' ' + y + ' ' + (m + 8) + ' ' + y + ' L' + (x2 - r) + ' ' + y +
         ' Q' + x2 + ' ' + y + ' ' + x2 + ' ' + (y + d * r),
      fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.6
    }, p);
  }

  /* верх: подпись, слова, входные векторы */
  var top = G('top');
  el('text', { x: (X0 + 1080) / 2, y: 22, 'text-anchor': 'middle', 'font-size': 16, 'class': 'muted' }, top, 'Входной вектор каждого токена');
  brace(top, X0 + 12, 1068, 44, false);
  var xRing = [], words = [];
  W.forEach(function (w, j) {
    var t = el('text', { x: CX(j), y: 84, 'text-anchor': 'middle', 'font-size': 21, 'class': 'word-t' }, top, w);
    t.addEventListener('click', function () { setSel(j); });
    words.push(t);
    vector(top, CX(j), XT, 26, XH, '#3576C0');
    xRing.push(el('rect', { x: CX(j) - 21, y: XT - 7, width: 42, height: XH + 14, rx: 7, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 1.8 }, top));
  });

  /* рамка промежуточных векторов */
  var fr = G('frame');
  el('rect', { x: X0 + 6, y: 222, width: 1080 - X0 - 12, height: 362, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.6, 'stroke-dasharray': '8 6' }, fr);
  brace(fr, X0 + 12, 1068, 606, true);
  el('text', { x: (X0 + 1080) / 2, y: 644, 'text-anchor': 'middle', 'font-size': 16, 'class': 'muted' }, fr, 'Промежуточные векторы — из них считается выход attention');

  /* матрицы весов */
  var wg = G('weights'), wBox = [];
  el('path', { d: 'M104 258 Q92 258 92 270 L92 398 Q92 408 82 408 Q92 408 92 418 L92 546 Q92 558 104 558', fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.6 }, wg);
  el('text', { x: 42, y: 402, 'text-anchor': 'middle', 'font-size': 16, 'class': 'ink' }, wg, 'Обучаемые');
  el('text', { x: 42, y: 422, 'text-anchor': 'middle', 'font-size': 16, 'class': 'ink' }, wg, 'веса');
  ROWS.forEach(function (r) {
    wBox.push(el('rect', { x: 112, y: r.y, width: 148, height: VH, fill: r.fill, 'class': 'box' }, wg));
    var t = el('text', { x: 180, y: r.y + 32, 'text-anchor': 'middle', 'font-size': 24, fill: '#111' }, wg);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, 'W');
    el('tspan', { dy: -10, 'font-size': 14 }, t, 'T');
    el('tspan', { dx: -8, dy: 17, 'font-size': 15, 'font-style': 'italic' }, t, r.n);
    var d = el('text', { x: 186, y: r.y + 54, 'text-anchor': 'middle', 'font-size': 13, fill: '#5E5850' }, wg);
    el('tspan', {}, d, 'D');
    el('tspan', { dy: 3, 'font-size': 10 }, d, 'out');
    el('tspan', { dy: -3 }, d, ' × D');
    el('tspan', { dy: 3, 'font-size': 10 }, d, 'in');
  });

  /* роли */
  var rolesG = G('roles');
  ROWS.forEach(function (r) {
    el('text', { x: 112, y: r.y + VH + 19, 'font-size': 13.5, 'font-weight': 700, fill: r.ink }, rolesG, r.role);
  });

  /* векторы q, k, v */
  var vecsG = G('vecs');
  var vec = ROWS.map(function (r) {
    return W.map(function (w, j) {
      var g = el('g', {}, vecsG);
      sym(g, CX(j), r.y - 10, r.k, w);
      vector(g, CX(j), r.y, 24, VH, r.fill);
      return g;
    });
  });

  /* связи «x × W → вектор» */
  var connG = G('conn');
  var conn = ROWS.map(function (r) {
    var g = el('g', {}, connG), mid = r.y + VH / 2;
    var h = el('line', { x1: 262, y1: mid, y2: mid, stroke: r.ink, 'stroke-width': 2.2 }, g);
    var v = el('line', { y1: XT + XH + 2, y2: mid - 9, stroke: 'var(--ink)', 'stroke-width': 1.8, 'stroke-dasharray': '5 4' }, g);
    var c = el('circle', { cy: mid, r: 9, fill: 'var(--card)', stroke: r.ink, 'stroke-width': 2 }, g);
    var x = el('text', { y: mid + 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: r.ink }, g, '×');
    var a = el('line', { y1: mid, y2: mid, stroke: r.ink, 'stroke-width': 2.2, 'marker-end': 'url(#sap-arr)' }, g);
    return {
      g: g,
      place: function (j) {
        var jx = CX(j) - 38;
        h.setAttribute('x2', jx - 9);
        v.setAttribute('x1', jx); v.setAttribute('x2', jx);
        c.setAttribute('cx', jx);
        x.setAttribute('x', jx);
        a.setAttribute('x1', jx + 9); a.setAttribute('x2', CX(j) - 13);
      }
    };
  });

  /* ── плита управления: те же правила, что и у общего степпера ── */
  var buttons = Array.prototype.slice.call(stage.querySelectorAll('.word-row button'));
  buttons.forEach(function (b, j) { b.addEventListener('click', function () { setSel(j); }); });

  var prevBtn = stage.querySelector('[data-nav="prev"]');
  var nextBtn = stage.querySelector('[data-nav="next"]');
  var counter = stage.querySelector('.stage-counter');
  var progress = stage.querySelector('.stage-progress');
  var kicker = stage.querySelector('.step-kicker');
  var titleEl = stage.querySelector('.step-live h4');
  var textEl = stage.querySelector('.step-live p');
  var fml = stage.querySelector('.math-display');

  var ticks = [];
  for (var t0 = 0; t0 < N; t0++) ticks.push(progress.appendChild(document.createElement('i')));

  var KICK = ['Шаг 1 · вход x', 'Шаг 2 · три матрицы', 'Шаг 3 · query', 'Шаг 4 · key', 'Шаг 5 · value', 'Шаг 6 · веса общие', 'Шаг 7 · зачем три вектора'];

  function setFormula(tex) {
    if (!fml) return;
    if (!tex) { fml.hidden = true; fml.textContent = ''; fml.setAttribute('data-tex', ''); return; }
    fml.hidden = false;
    fml.setAttribute('data-tex', tex);
    delete fml.dataset.rendered;
    if (window.katex) {
      try {
        window.katex.render(tex, fml, { throwOnError: false, displayMode: true, strict: 'ignore' });
        fml.dataset.rendered = '1';
        return;
      } catch (e) { /* падаем на текст ниже */ }
    }
    fml.textContent = tex;
  }

  var step = 0, sel = 0;
  var sb = function (b, s) { return b + '<sub>' + esc(s) + '</sub>'; };
  var Wt = function (n) { return 'W<sub>' + n + '</sub><sup>T</sup>'; };
  var tw = function (w) { return '\\text{' + w + '}'; };

  function render() {
    var st = step, w = W[sel], we = esc(w);

    xRing.forEach(function (r, j) { r.style.opacity = (j === sel && st >= 2 && st <= 4) || (st === 0 && j === sel) ? 1 : 0; });
    words.forEach(function (t, j) {
      t.setAttribute('fill', j === sel && st < 5 ? 'var(--blue)' : 'var(--ink)');
      t.setAttribute('font-weight', j === sel && st < 5 ? '700' : '400');
    });
    buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === sel)); });
    G('weights').style.opacity = st >= 1 ? 1 : 0.15;
    wBox.forEach(function (b, i) { b.setAttribute('stroke-width', st === i + 2 ? 3 : 1.5); });
    vec.forEach(function (row, i) {
      row.forEach(function (g, j) {
        var on = st >= 5 || (st >= 2 && i <= st - 2 && j === sel);
        g.style.opacity = on ? 1 : 0.1;
      });
    });
    conn.forEach(function (c, i) { c.place(sel); c.g.style.opacity = st === i + 2 ? 1 : 0; });
    G('frame').style.opacity = st >= 5 ? 1 : 0;
    G('roles').style.opacity = st === 6 ? 1 : 0;

    var title, text, tex;
    if (st === 0) {
      title = 'Входной вектор каждого токена';
      text = 'Каждому токену фразы соответствует вектор x размерности D<sub>in</sub>: эмбеддинг слова плюс информация о позиции. Это те же входные векторы, что в схеме про выходы. Сейчас выбран «' + we + '».';
      tex = 'x_{' + tw(w) + '} \\in \\mathbb{R}^{D_{\\mathrm{in}}}';
    } else if (st === 1) {
      title = 'Три матрицы весов';
      text = 'Слева три обучаемые матрицы: ' + Wt('Q') + ', ' + Wt('K') + ' и ' + Wt('V') + '. Они общие для всех позиций: один и тот же набор весов применяется к каждому токену. Эти матрицы меняются при обучении, а потом фиксируются.';
      tex = 'W_{Q}^{T},\\; W_{K}^{T},\\; W_{V}^{T} \\in \\mathbb{R}^{D_{\\mathrm{out}} \\times D_{\\mathrm{in}}}';
    } else if (st <= 4) {
      var r = ROWS[st - 2], nm = { q: 'Query', k: 'Key', v: 'Value' }[r.k];
      title = nm + ': ' + sb(r.k, w) + ' = ' + Wt(r.n) + ' ' + sb('x', w);
      text = [
        'Умножаем матрицу ' + Wt('Q') + ' на входной вектор «' + we + '» и получаем query ' + sb('q', w) + ' размерности D<sub>out</sub>. Query описывает, какую информацию этот токен ищет у остальных.',
        'Тот же вектор ' + sb('x', w) + ', но другая матрица — ' + Wt('K') + '. Получается key ' + sb('k', w) + '. С keys всех токенов сравнивается query, так что key отвечает за то, как этот токен «находят».',
        'Третья матрица ' + Wt('V') + ' даёт value ' + sb('v', w) + '. Value — содержимое, которое токен передаст другим, если они на него посмотрят.'
      ][st - 2];
      tex = r.k + '_{' + tw(w) + '} = W_{' + r.n + '}^{T} \\cdot x_{' + tw(w) + '}';
    } else if (st === 5) {
      title = 'Те же веса — для всех токенов';
      text = 'Те же три матрицы применяются к каждому входному вектору. У шести токенов получается 6 × 3 = 18 промежуточных векторов. Расчёты независимы, поэтому в модели их делают одним матричным умножением сразу для всей последовательности.';
      tex = 'Q = X W_{Q}, \\quad K = X W_{K}, \\quad V = X W_{V} \\quad (\\text{строки } X \\text{ — векторы } x \\text{ токенов})';
    } else {
      title = 'Зачем нужны три вектора';
      text = 'Query и key используются только для весов: q одного токена сравнивается с k всех токенов, оценки масштабируются и проходят softmax. Value — то, что складывается с этими весами в выходной вектор z. Эти два этапа показаны в соседних схемах.';
      tex = 'a_{' + tw(w) + ',j} = \\operatorname{softmax}_{j}\\!\\left( q_{' + tw(w) + '} \\cdot k_{j} / \\sqrt{D_{\\mathrm{out}}} \\right), \\quad z_{' + tw(w) + '} = \\sum_{j} a_{' + tw(w) + ',j} \\cdot v_{j}';
    }

    kicker.textContent = KICK[st];
    titleEl.innerHTML = title;
    textEl.innerHTML = text;
    setFormula(tex);

    ticks.forEach(function (tick, i) { tick.classList.toggle('done', i <= st); });
    counter.textContent = (st + 1) + ' из ' + N;
    prevBtn.disabled = st === 0;
    nextBtn.textContent = st === N - 1 ? 'Сначала ↺' : 'Далее →';
    svg.setAttribute('aria-label', 'Проекции q, k, v для токена «' + w + '». Справа вверху шесть входных векторов токенов. Слева три матрицы весов W_Q, W_K, W_V. В пунктирной рамке — по три вектора q, k, v для каждого токена.');
  }

  function move(delta) {
    var target = step + delta;
    if (target < 0) return;
    if (target >= N) target = 0;
    step = target;
    render();
  }
  function setSel(j) { sel = j; render(); }

  prevBtn.addEventListener('click', function () { move(-1); });
  nextBtn.addEventListener('click', function () { move(1); });
  stage.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') { move(1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { move(-1); event.preventDefault(); }
  });
  window.addEventListener('load', function () { if (window.katex && fml && fml.dataset.rendered !== '1') setFormula(fml.getAttribute('data-tex')); });

  render();
})();
</script>

<p class="stage-hint">Нажмите на слово, чтобы посмотреть его q, k и v; шаги переключаются кнопками или стрелками ← →.</p><div class="callout-yellow">
<strong>Практическая деталь:</strong> матрицы <code>W_Q, W_K, W_V</code> одни на все позиции, поэтому
  число параметров не зависит от длины фразы. Размерность <code>D_out</code> у q и k обязана совпадать —
  иначе их нельзя скалярно умножить; у v она может быть другой.
</div><div class="callout">
<strong>Главная мысль части:</strong> q и k нужны только для того, чтобы посчитать веса, а v — это то,
  что эти веса смешивают. Три роли — три обучаемые проекции одного входа.
</div><hr/><h2 id="part-7">Глава 7. Оценки, масштабирование и softmax</h2><p>
  Сходство query и key измеряется <strong>скалярным произведением</strong>: попарно умножаем компоненты и
  складываем. Затем оценки делим на <code>√D_out</code> и нормируем softmax по всем позициям:
</p><div class="math-display" data-tex="s_{ij} = q_i \cdot k_j, \qquad \alpha_{ij} = \frac{\exp\bigl(s_{ij}/\sqrt{D_{\text{out}}}\bigr)}{\sum_{m}\exp\bigl(s_{im}/\sqrt{D_{\text{out}}}\bigr)}"></div><p>
  Дальше во всех расчётных схемах используются одни и те же учебные векторы с <code>D_out = 4</code>. Для «Я»
  query равен <code>(0, 2, 0, 1)</code>.
</p><div class="stage" id="stageSaScores" tabindex="0">
  <div class="stage-figure">
<svg id="svgSaScores" viewBox="0 0 1080 660" role="img" aria-label="Self-attention: оценки и веса для слова «Я». Вверху шесть слов-ключей, ниже слово-запрос с пунктирными связями. Под ними пары query и key, их скалярные произведения, масштабированные оценки и веса после softmax.">
  <style>
    svg{--ink:#111;--muted:#5E5850;--card:#fff;--faint:#E4E1D7;--blue:#3576C0;--gold:#C29E08;--band:#FFF3F2;font-family:Helvetica,Arial,sans-serif}
    .ink{fill:var(--ink)}
    .muted{fill:var(--muted)}
    .box{stroke:#111;stroke-width:1.6}
    .cell{fill:#111;font-size:13px;text-anchor:middle}
    .qword{cursor:pointer}
    .halo{paint-order:stroke;stroke:var(--card);stroke-width:5px;stroke-linejoin:round}
  </style>
  <defs>
    <marker id="sas-arr" markerHeight="6" markerWidth="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#111"></path></marker>
  </defs>
  <g data-g="links"></g>
  <g data-g="weights"></g>
  <g data-g="keyWords"></g>
  <g data-g="queryWords"></g>
  <g data-g="point"></g>
  <g data-g="pairs"></g>
  <g data-g="band"></g>
  <g data-g="rowB"></g>
  <g data-g="rowC"></g>
</svg>
  </div>
  <div class="word-row" role="group" aria-label="Выберите слово-запрос">
    <button type="button" data-token="0" aria-pressed="true">Я</button>
    <button type="button" data-token="1" aria-pressed="false">видел</button>
    <button type="button" data-token="2" aria-pressed="false">котю</button>
    <button type="button" data-token="3" aria-pressed="false">на</button>
    <button type="button" data-token="4" aria-pressed="false">мате</button>
    <button type="button" data-token="5" aria-pressed="false">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker"></div>
      <h4></h4>
      <p></p>
      <div class="math-display" data-tex=""></div>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageSaScores');
  if (!stage) return;
  if (stage.dataset.sasReady === '1') return;
  stage.dataset.sasReady = '1';

  var NS = 'http://www.w3.org/2000/svg';
  var svg = stage.querySelector('.stage-figure svg');
  var prevBtn = stage.querySelector('[data-nav="prev"]');
  var nextBtn = stage.querySelector('[data-nav="next"]');
  var counter = stage.querySelector('.stage-counter');
  var progress = stage.querySelector('.stage-progress');
  var kickerEl = stage.querySelector('.step-kicker');
  var titleEl = stage.querySelector('.step-live h4');
  var textEl = stage.querySelector('.step-live p');
  var mathEl = stage.querySelector('.math-display');
  if (!svg || !prevBtn || !nextBtn || !counter || !progress) return;
  var g = function (name) { return svg.querySelector('[data-g="' + name + '"]'); };

  // ---- data (verbatim from the original mini-page) ----
  var W = ['Я', 'видел', 'котю', 'на', 'мате', '<eos>'];
  var Q = [[0,2,0,1],[1,0,2,0],[0,2,0,0],[0,0,0,2],[0,0,2,1],[1,1,1,1]]; // query-векторы
  var K = [[2,0,0,1],[0,2,0,0],[0,1,2,0],[0,0,1,2],[1,0,0,2],[0,0,0,1]]; // key-векторы
  var D = 4, R = Math.sqrt(D), N = 6, M = W.length;
  var CX = W.map(function (w, i) { return (i + 0.5) * 1080 / M; });
  var TOP = 64, PT = 200, C = 22, PY = 305;
  var FILL = { q: '#3576C0', k: '#C29E08', s: '#C29E08', a: '#C29E08' };
  var fmt = function (x) { return (Math.round(x * 100) / 100).toString().replace('.', ','); };
  var f2 = function (x) { return x.toFixed(2).replace('.', ','); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  function el(tag, attrs, parent, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    parent.appendChild(n);
    return n;
  }
  function sym(parent, x, y, base, sub, o) {
    o = o || {};
    var size = o.size || 16;
    var t = el('text', { x: x, y: y, 'text-anchor': o.anchor || 'middle', 'font-size': size, 'class': 'ink' }, parent);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, base);
    var s = el('tspan', { dy: 5, 'font-size': Math.round(size * 0.72) }, t, sub);
    if (o.tail) el('tspan', { dy: -5 }, t, o.tail);
    return s;
  }
  function calc(qi) {
    var s = K.map(function (k) {
      return k.reduce(function (acc, v, i) { return acc + v * Q[qi][i]; }, 0);
    });
    var sc = s.map(function (x) { return x / R; });
    var m = Math.max.apply(null, sc);
    var e = sc.map(function (x) { return Math.exp(x - m); });
    var z = e.reduce(function (a, b) { return a + b; }, 0);
    return { s: s, sc: sc, a: e.map(function (x) { return x / z; }) };
  }

  // ---- build the figure ----
  var links = W.map(function () {
    return el('line', { 'class': 'link', 'stroke-dasharray': '6 5', stroke: 'var(--ink)' }, g('links'));
  });
  var wl = W.map(function (w, j) {
    return el('text', { x: CX[j], y: 88, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: 'var(--blue)', 'class': 'halo' }, g('weights'));
  });
  W.forEach(function (w, j) {
    el('text', { x: CX[j], y: 44, 'text-anchor': 'middle', 'font-size': 24, 'class': 'ink' }, g('keyWords'), w);
  });
  var qw = W.map(function (w, j) {
    var t = el('text', { x: CX[j], y: 234, 'text-anchor': 'middle', 'font-size': 24, 'class': 'qword' }, g('queryWords'), w);
    t.addEventListener('click', function () { setQuery(j); });
    return t;
  });
  var point = el('circle', { r: 4.5, cy: PT, fill: 'var(--blue)' }, g('point'));

  var pairs = W.map(function (w, j) {
    var cx = CX[j], grp = el('g', {}, g('pairs'));
    var ring = el('rect', { x: cx - 84, y: 268, width: 168, height: 230, rx: 12, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 1.6 }, grp);
    var qSub = sym(grp, cx - 18, 292, 'q', W[0]);
    sym(grp, cx + 46, 292, 'k', W[j], { anchor: 'start' });
    var qv = [];
    for (var i = 0; i < 4; i++) {
      el('rect', { x: cx - 62 + i * C, y: PY, width: C, height: C, fill: FILL.q, 'class': 'box' }, grp);
      qv.push(el('text', { x: cx - 62 + i * C + C / 2, y: PY + 16, 'class': 'cell', fill: '#fff' }, grp));
    }
    for (var i2 = 0; i2 < 4; i2++) {
      el('rect', { x: cx + 30, y: PY + i2 * C, width: C, height: C, fill: FILL.k, 'class': 'box' }, grp);
      el('text', { x: cx + 30 + C / 2, y: PY + i2 * C + 16, 'class': 'cell', fill: '#111' }, grp, K[j][i2]);
    }
    el('text', { x: cx - 34, y: 440, 'text-anchor': 'middle', 'font-size': 20, 'class': 'ink' }, grp, '=');
    el('rect', { x: cx - 18, y: 410, width: 36, height: 36, fill: FILL.s, 'class': 'box' }, grp);
    var sv = el('text', { x: cx, y: 433, 'class': 'cell', fill: '#fff', 'font-weight': 700 }, grp);
    var sSub = sym(grp, cx, 468, 's', '', { size: 15 });
    var exp = el('text', { x: cx, y: 490, 'text-anchor': 'middle', 'font-size': 12.5, 'class': 'muted' }, grp);
    return { g: grp, ring: ring, qSub: qSub, qv: qv, sv: sv, sSub: sSub, exp: exp };
  });

  el('rect', { x: 8, y: 508, width: 1064, height: 58, rx: 12, fill: 'var(--band)', stroke: 'var(--gold)', 'stroke-width': 1.5 }, g('band'));
  el('text', { x: 22, y: 512, 'font-size': 14, 'font-weight': 700, fill: 'var(--gold)', 'class': 'halo' }, g('band'), 'softmax');
  var B = W.map(function (w, j) {
    var cx = CX[j];
    el('text', { x: cx - 24, y: 542, 'text-anchor': 'end', 'font-size': 14, 'class': 'ink' }, g('rowB'), 's/√' + D + ' =');
    el('rect', { x: cx - 18, y: 519, width: 36, height: 36, fill: FILL.s, 'class': 'box' }, g('rowB'));
    return el('text', { x: cx, y: 542, 'class': 'cell', fill: '#fff' }, g('rowB'));
  });
  var Cc = W.map(function (w, j) {
    var cx = CX[j];
    el('line', { x1: cx, y1: 570, x2: cx, y2: 598, stroke: 'var(--ink)', 'stroke-width': 1.6, 'marker-end': 'url(#sas-arr)' }, g('rowC'));
    var sub = sym(g('rowC'), cx - 24, 626, 'a', '', { anchor: 'end', size: 15, tail: ' =' });
    el('rect', { x: cx - 18, y: 602, width: 36, height: 36, fill: FILL.a, 'class': 'box' }, g('rowC'));
    var v = el('text', { x: cx, y: 625, 'class': 'cell', fill: '#fff', 'font-weight': 700, 'font-size': 12.5 }, g('rowC'));
    return { sub: sub, v: v };
  });

  // ---- controls (same contract as the shared stage driver) ----
  var buttons = Array.prototype.slice.call(stage.querySelectorAll('.word-row button'));
  buttons.forEach(function (b, j) {
    b.setAttribute('aria-label', 'Query слова «' + W[j] + '»');
    b.addEventListener('click', function () { setQuery(j); });
  });
  for (var t = 0; t < N; t++) progress.appendChild(document.createElement('i'));
  var ticks = Array.prototype.slice.call(progress.querySelectorAll('i'));

  // ---- formulas ----
  var texWord = function (w) {
    return '\\text{' + String(w).replace(/([{}%#$&_])/g, '\\$1') + '}';
  };
  var lastTex = '';
  function setFormula(tex) {
    if (!mathEl) return;
    lastTex = tex || '';
    if (!lastTex) { mathEl.hidden = true; mathEl.setAttribute('data-tex', ''); return; }
    mathEl.hidden = false;
    mathEl.setAttribute('data-tex', lastTex);
    if (window.katex) {
      try {
        window.katex.render(lastTex, mathEl, { throwOnError: false, displayMode: true, strict: 'ignore' });
        mathEl.dataset.rendered = '1';
        return;
      } catch (e) { /* fall through */ }
    }
    mathEl.textContent = lastTex;
  }
  window.addEventListener('load', function () {
    if (lastTex && window.katex && mathEl.dataset.rendered !== '1') setFormula(lastTex);
  });

  // ---- render ----
  var step = 0, qi = 0, px = CX[0];

  function geom() {
    point.setAttribute('cx', px);
    links.forEach(function (l, j) {
      l.setAttribute('x1', CX[j]);
      l.setAttribute('y1', TOP + 30);
      l.setAttribute('x2', px);
      l.setAttribute('y2', PT);
    });
  }

  function render() {
    var r = calc(qi), q = W[qi], st = step;
    var amax = Math.max.apply(null, r.a), best = r.a.indexOf(amax);

    pairs.forEach(function (p, j) {
      var shown = st >= 2 || j <= st, cur = st < 2 && j === st;
      p.qSub.textContent = q;
      p.sSub.textContent = q + ',' + W[j];
      Q[qi].forEach(function (v, i) { p.qv[i].textContent = v; });
      p.g.style.opacity = shown ? 1 : 0.12;
      p.sv.textContent = shown ? r.s[j] : '?';
      p.ring.style.opacity = cur ? 1 : 0;
      p.exp.textContent = Q[qi].map(function (v, i) { return v + '·' + K[j][i]; }).join('+') + ' = ' + r.s[j];
      p.exp.style.opacity = cur ? 1 : 0;
      B[j].textContent = fmt(r.sc[j]);
      Cc[j].sub.textContent = q + ',' + W[j];
      Cc[j].v.textContent = f2(r.a[j]);
      wl[j].textContent = f2(r.a[j]);
    });

    g('rowB').style.opacity = st >= 3 ? 1 : 0;
    g('band').style.opacity = st >= 4 ? 1 : 0;
    g('rowC').style.opacity = st >= 4 ? 1 : 0;
    g('weights').style.opacity = st === 5 ? 1 : 0;

    links.forEach(function (l, j) {
      var w = 1.7, c = 'var(--ink)', o = 0.65;
      if (st < 2) {
        if (j === st) { w = 2.8; o = 1; } else { c = 'var(--faint)'; o = 1; }
      } else if (st === 5) {
        w = 1 + 10 * r.a[j];
        o = 0.25 + 0.75 * r.a[j] / amax;
      }
      l.style.strokeWidth = w;
      l.setAttribute('stroke', c);
      l.style.opacity = o;
    });

    qw.forEach(function (tx, j) {
      tx.setAttribute('fill', j === qi ? 'var(--blue)' : 'var(--ink)');
      tx.setAttribute('font-weight', j === qi ? '700' : '400');
    });
    buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === qi)); });

    var Q_ = esc(q), kicker, title, text, tex;
    if (st < 2) {
      var j0 = st, k0 = W[j0], K_ = esc(k0);
      kicker = 'Шаг ' + (st + 1) + ' · «' + Q_ + '» → «' + K_ + '»';
      title = 'Оценка «' + Q_ + '» → «' + K_ + '»';
      text = j0 === 0
        ? 'Query слова «' + Q_ + '» — строка, key слова «' + K_ + '» — столбец. Их скалярное произведение даёт одно число — оценку s: попарно умножаем компоненты и складываем.' + (j0 === qi ? ' Слово сравнивается и само с собой.' : '')
        : 'Query тот же, key другой — теперь «' + K_ + '». Чем лучше key совпадает с query, тем больше оценка.' + (j0 === qi ? ' Здесь это key самого слова-запроса.' : '');
      tex = 's_{' + texWord(q + ',' + k0) + '} = q_{' + texWord(q) + '} \\cdot k_{' + texWord(k0) + '} = '
          + Q[qi].map(function (v, i) { return v + '\\cdot ' + K[j0][i]; }).join(' + ') + ' = ' + r.s[j0];
    } else if (st === 2) {
      kicker = 'Шаг 3 · все шесть оценок';
      title = 'Все шесть оценок для «' + Q_ + '»';
      text = 'Тот же расчёт повторяем для остальных keys: «котю», «на», «мате», «&lt;eos&gt;». Query не меняется. Получились шесть «сырых» оценок — по одной на каждую позицию, включая само слово. Они не нормированы, их сумма может быть любой.';
      tex = 's_{' + texWord(q) + '\\text{,j}} = [ ' + r.s.join(' ; ') + ' ]';
    } else if (st === 3) {
      kicker = 'Шаг 4 · масштабирование';
      title = 'Делим на √D<sub>out</sub>';
      text = 'Каждую оценку делим на √D<sub>out</sub>. Здесь размерность q и k равна 4, делитель — 2. При большой размерности скалярные произведения растут, softmax становится слишком «острым» и градиенты почти исчезают; деление это сдерживает.';
      tex = 's_{' + texWord(q) + '\\text{,j}} / \\sqrt{4} = [ ' + r.sc.map(fmt).join(' ; ') + ' ]';
    } else if (st === 4) {
      kicker = 'Шаг 5 · softmax';
      title = 'Softmax → веса attention';
      text = 'Softmax берёт экспоненту каждой масштабированной оценки и делит на сумму экспонент. Веса a становятся положительными и в сумме дают 1 — это распределение внимания слова «' + Q_ + '» по всем шести позициям.';
      tex = 'a_{' + texWord(q) + '\\text{,j}} = \\exp(s_{' + texWord(q) + '\\text{,j}}/\\sqrt{D}) / \\sum _{k} \\exp(s_{' + texWord(q) + '\\text{,k}}/\\sqrt{D}) = [ ' + r.a.map(f2).join(' ; ') + ' ]';
    } else {
      kicker = 'Шаг 6 · веса на связях';
      title = 'Веса на связях';
      text = 'Толщина пунктира теперь пропорциональна весу: сильнее всего «' + Q_ + '» смотрит на «' + esc(W[best]) + '» (a = ' + f2(amax) + '). С этими весами складываются values, и получается выходной вектор z<sub>' + Q_ + '</sub> — тот, что показан в схеме про выходы каждого слова. Выберите другое слово — query изменится, keys останутся прежними.';
      tex = 'z_{' + texWord(q) + '} = \\sum _{j} a_{' + texWord(q) + '\\text{,j}} \\cdot v_{j}, \\sum _{j} a_{' + texWord(q) + '\\text{,j}} = 1';
    }

    if (kickerEl) kickerEl.innerHTML = kicker;
    if (titleEl) titleEl.innerHTML = title;
    if (textEl) textEl.innerHTML = text;
    setFormula(tex);

    svg.setAttribute('aria-label', 'Self-attention: оценки и веса для слова «' + q + '». Вверху шесть слов-ключей, ниже слово-запрос с пунктирными связями. Под ними пары query и key, их скалярные произведения, масштабированные оценки и веса после softmax.');
    ticks.forEach(function (tick, i) { tick.classList.toggle('done', i <= st); });
    counter.textContent = (st + 1) + ' из ' + N;
    prevBtn.disabled = st === 0;
    nextBtn.textContent = st === N - 1 ? 'Сначала ↺' : 'Далее →';
  }

  function move(delta) {
    var target = step + delta;
    if (target < 0) return;
    if (target >= N) target = 0;
    step = target;
    render();
  }
  function setQuery(i) {
    if (i === qi) return;
    qi = i;
    px = CX[i];
    geom();
    render();
  }

  prevBtn.addEventListener('click', function () { move(-1); });
  nextBtn.addEventListener('click', function () { move(1); });
  stage.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { move(1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { move(-1); event.preventDefault(); }
  });

  geom();
  render();
})();
</script>

<p class="stage-hint">Нажмите на слово, чтобы сделать его запросом и пересчитать оценки; шаги переключаются кнопками или стрелками ← →.</p><div class="callout-red">
<strong>Что будет без деления на √D:</strong> в нашем примере вес «видел» вырос бы с 0,39 до 0,66 — распределение
  стало бы острее. С ростом размерности эффект усиливается: для случайных q и k со стандартными нормальными компонентами
  разброс <code>q · k</code> равен <code>√D</code> — около 2 при D = 4, 8 при D = 64 и 22,6 при D = 512. Softmax от
  таких оценок почти one-hot, и градиенты по остальным позициям исчезают. Деление на <code>√D</code> возвращает
  разброс к единице.
</div><div class="callout">
<strong>Главная мысль части:</strong> вес <code>αᵢⱼ</code> — это softmax масштабированной оценки
  <code>qᵢ · kⱼ / √D</code>; строка весов каждой позиции положительна и в сумме даёт 1.
</div><hr/><h2 id="part-8">Глава 8. Весь путь до выхода z</h2><p>
  Соединим части: для выбранного слова считаем оценки, превращаем их в веса и складываем values с этими весами.
  Это ровно операция из предыдущей главы, только веса теперь вычислены, а не заданы:
</p><div class="math-display" data-tex="z_i = \sum_{j} \operatorname{softmax}_j\!\left(\frac{q_i \cdot k_j}{\sqrt{D_{\text{out}}}}\right) v_j"></div><div class="stage" id="stageSaFull" tabindex="0">
  <div class="stage-figure">
<svg id="svgSaFull" viewBox="0 0 1080 770" role="img" aria-label="Вверху входные векторы шести слов и связи от слова-запроса. Ниже для каждой позиции: пара q и k, оценка, вес после softmax, value. Справа — выходной вектор z как взвешенная сумма values.">
  <style>
    #svgSaFull{--ink:#111;--muted:#5E5850;--card:#fff;--blue:#3576C0;--gold:#C29E08;--band:#FFF3F2;font-family:Helvetica,Arial,sans-serif}
    #svgSaFull .ink{fill:var(--ink)}
    #svgSaFull .muted{fill:var(--muted)}
    #svgSaFull .box{stroke:#111;stroke-width:1.6}
    #svgSaFull .cell{fill:#111;font-size:12px;text-anchor:middle}
    #svgSaFull .qword{cursor:pointer}
    #svgSaFull .halo{paint-order:stroke;stroke:var(--card);stroke-width:5px;stroke-linejoin:round}
  </style>
  <defs><marker id="saf-arr" markerHeight="6" markerWidth="6" orient="auto" refX="9" refY="5" viewBox="0 0 10 10"><path d="M0 1 L10 5 L0 9z" fill="#111"></path></marker></defs>
  <g data-g="top"></g>
  <g data-g="links"></g>
  <g data-g="point"></g>
  <g data-g="pairs"></g>
  <g data-g="rowS"></g>
  <g data-g="band"></g>
  <g data-g="rowW"></g>
  <g data-g="out"></g>
  <g data-g="strip"></g>
</svg>
  </div>
  <div class="word-row" role="group" aria-label="Выберите слово-запрос">
    <button type="button" data-token="0" aria-pressed="true" aria-label="Query слова «Я»">Я</button>
    <button type="button" data-token="1" aria-pressed="false" aria-label="Query слова «видел»">видел</button>
    <button type="button" data-token="2" aria-pressed="false" aria-label="Query слова «котю»">котю</button>
    <button type="button" data-token="3" aria-pressed="false" aria-label="Query слова «на»">на</button>
    <button type="button" data-token="4" aria-pressed="false" aria-label="Query слова «мате»">мате</button>
    <button type="button" data-token="5" aria-pressed="false" aria-label="Query слова «&lt;eos&gt;»">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live" aria-live="polite" aria-atomic="true">
      <div class="step-kicker"></div>
      <h4></h4>
      <p></p>
      <div class="math-display" data-tex=""></div>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageSaFull');
  if (!stage) return;
  var svg = stage.querySelector('.stage-figure svg');
  if (!svg) return;

  var NS = 'http://www.w3.org/2000/svg';
  var G = function (name) { return svg.querySelector('[data-g="' + name + '"]'); };

  // ── data & geometry (verbatim from the original mini-page) ──────────────
  var W = ['Я', 'видел', 'котю', 'на', 'мате', '<eos>'], M = W.length, N = 6;
  var Q = [[0,2,0,1],[1,0,2,0],[0,2,0,0],[0,0,0,2],[0,0,2,1],[1,1,1,1]];
  var K = [[2,0,0,1],[0,2,0,0],[0,1,2,0],[0,0,1,2],[1,0,0,2],[0,0,0,1]];
  var V = [[1,0,0,1],[0,2,0,0],[0,0,2,1],[1,0,1,0],[0,1,1,2],[0,0,0,1]];
  var D = 4, R = Math.sqrt(D), C = 20, TOP = 150, PT = 228;
  var CX = function (i) { return 75 + 150 * i; };
  var F = { x:'#3576C0', q:'#3576C0', k:'#C29E08', s:'#C29E08', a:'#C29E08', v:'#C30B0A', z:'#C30B0A' };
  var f2 = function (x) { return x.toFixed(2).replace('.', ','); };
  var esc = function (t) { return String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  function el(tag, a, p, t) {
    var n = document.createElementNS(NS, tag);
    for (var k in a) n.setAttribute(k, a[k]);
    if (t != null) n.textContent = t;
    p.appendChild(n);
    return n;
  }
  function sym(p, x, y, base, sub, o) {
    o = o || {};
    var size = o.size || 15;
    var t = el('text', { x: x, y: y, 'text-anchor': o.anchor || 'middle', 'font-size': size, 'class': 'ink' }, p);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, base);
    var s = el('tspan', { dy: 5, 'font-size': Math.round(size * 0.72) }, t, sub);
    if (o.tail) el('tspan', { dy: -5 }, t, o.tail);
    return s;
  }
  function stripes(p, x, y, w, h, fill) {
    var g = el('g', {}, p);
    el('rect', { x: x - w / 2, y: y, width: w, height: h, fill: fill, 'class': 'box' }, g);
    for (var i = 1; i < 4; i++) {
      el('line', { x1: x - w / 2 + 1, x2: x + w / 2 - 1, y1: y + h * i / 4, y2: y + h * i / 4, stroke: '#fff', 'stroke-width': 1.4 }, g);
    }
    return g;
  }
  function calc(qi) {
    var s = K.map(function (k) { return k.reduce(function (a, v, i) { return a + v * Q[qi][i]; }, 0); });
    var e = s.map(function (x) { return Math.exp(x / R); });
    var z = e.reduce(function (a, b) { return a + b; }, 0);
    var a = e.map(function (x) { return x / z; });
    return { s: s, a: a, out: [0,1,2,3].map(function (d) {
      return a.reduce(function (acc, w, j) { return acc + w * V[j][d]; }, 0);
    }) };
  }

  // ── build the static scaffolding ────────────────────────────────────────
  var top = G('top'), qw = [];
  W.forEach(function (w, j) {
    el('text', { x: CX(j), y: 22, 'text-anchor': 'middle', 'font-size': 19, 'class': 'ink' }, top, w);
    stripes(top, CX(j), 32, 22, 78, F.x);
    el('text', { x: CX(j), y: 140, 'text-anchor': 'middle', 'font-size': 21, 'class': 'ink' }, top, w);
    var t = el('text', { x: CX(j), y: 262, 'text-anchor': 'middle', 'font-size': 21, 'class': 'qword' }, top, w);
    t.addEventListener('click', function () { stopCycle(); setQuery(j); });
    qw.push(t);
  });
  el('text', { x: 990, y: 22,  'text-anchor': 'middle', 'font-size': 14, 'class': 'muted' }, top, 'входы x');
  el('text', { x: 990, y: 140, 'text-anchor': 'middle', 'font-size': 14, 'class': 'muted' }, top, 'keys / values');
  el('text', { x: 990, y: 262, 'text-anchor': 'middle', 'font-size': 14, 'class': 'muted' }, top, 'query');

  var links = W.map(function () {
    return el('line', { 'class': 'link', 'stroke-dasharray': '6 5', stroke: 'var(--ink)' }, G('links'));
  });
  var point = el('circle', { r: 4.5, cy: PT, fill: 'var(--blue)' }, G('point'));

  // пары q · k
  var P = W.map(function (w, j) {
    var cx = CX(j), g = G('pairs');
    var qSub = sym(g, cx - 12, 300, 'q', W[0]);
    sym(g, cx + 36, 300, 'k', w, { anchor: 'start', size: 14 });
    var qv = [], i;
    for (i = 0; i < 4; i++) {
      el('rect', { x: cx - 52 + i * C, y: 310, width: C, height: C, fill: F.q, 'class': 'box' }, g);
      qv.push(el('text', { x: cx - 42 + i * C, y: 324, 'class': 'cell', fill: '#fff' }, g));
    }
    for (i = 0; i < 4; i++) {
      el('rect', { x: cx + 32, y: 310 + i * C, width: C, height: C, fill: F.k, 'class': 'box' }, g);
      el('text', { x: cx + 42, y: 324 + i * C, 'class': 'cell', fill: '#111' }, g, K[j][i]);
    }
    el('line', { x1: cx, y1: 394, x2: cx, y2: 414, stroke: 'var(--ink)', 'stroke-width': 1.5, 'marker-end': 'url(#saf-arr)' }, g);
    return { qSub: qSub, qv: qv };
  });

  // оценки
  var S = W.map(function (w, j) {
    var cx = CX(j), g = G('rowS');
    el('text', { x: cx - 22, y: 442, 'text-anchor': 'end', 'font-size': 14, 'class': 'ink' }, g, 's =');
    el('rect', { x: cx - 16, y: 420, width: 32, height: 32, fill: F.s, 'class': 'box' }, g);
    return el('text', { x: cx, y: 441, 'class': 'cell', fill: '#fff', 'font-weight': 700, 'font-size': 13 }, g);
  });

  // softmax
  el('rect', { x: 8, y: 466, width: 880, height: 56, rx: 12, fill: 'var(--band)', stroke: 'var(--gold)', 'stroke-width': 1.5 }, G('band'));
  el('text', { x: 124, y: 470, 'font-size': 14, 'font-weight': 700, fill: 'var(--gold)', 'class': 'halo' }, G('band'), 'softmax(s / √4)');
  var A = W.map(function (w, j) {
    var cx = CX(j), g = G('band');
    el('line', { x1: cx, y1: 454, x2: cx, y2: 474, stroke: 'var(--ink)', 'stroke-width': 1.5, 'marker-end': 'url(#saf-arr)' }, g);
    var sub = sym(g, cx - 22, 502, 'a', '', { anchor: 'end', size: 14, tail: ' =' });
    el('rect', { x: cx - 16, y: 478, width: 32, height: 32, fill: F.a, 'class': 'box' }, g);
    return { sub: sub, v: el('text', { x: cx, y: 499, 'class': 'cell', fill: '#fff', 'font-weight': 700 }, g) };
  });

  // взвешенные values
  var Wv = W.map(function (w, j) {
    var cx = CX(j), g = G('rowW'), i;
    el('line', { x1: cx - 14, y1: 524, x2: cx - 14, y2: 568, stroke: 'var(--ink)', 'stroke-width': 1.5, 'marker-end': 'url(#saf-arr)' }, g);
    el('rect', { x: cx - 30, y: 574, width: 32, height: 32, fill: F.a, 'class': 'box' }, g);
    var av = el('text', { x: cx - 14, y: 595, 'class': 'cell', fill: '#fff', 'font-weight': 700 }, g);
    el('text', { x: cx + 12, y: 595, 'text-anchor': 'middle', 'font-size': 14, 'class': 'ink' }, g, '·');
    sym(g, cx + 30, 562, 'v', w, { size: 14 });
    for (i = 0; i < 4; i++) {
      el('rect', { x: cx + 20, y: 570 + i * C, width: C, height: C, fill: F.v, 'class': 'box' }, g);
      el('text', { x: cx + 30, y: 584 + i * C, 'class': 'cell', fill: '#111' }, g, V[j][i]);
    }
    el('text', { x: cx + 75, y: 620, 'text-anchor': 'middle', 'font-size': 22, 'class': 'ink' }, g, j < M - 1 ? '+' : '=');
    return av;
  });

  // выход
  var og = G('out'), zSub = sym(og, 965, 556, 'z', W[0], { size: 17 }), zv = [];
  for (var zi = 0; zi < 4; zi++) {
    el('rect', { x: 940, y: 566 + zi * 24, width: 50, height: 24, fill: F.z, 'class': 'box' }, og);
    zv.push(el('text', { x: 965, y: 582 + zi * 24, 'class': 'cell', fill: '#fff', 'font-weight': 700 }, og));
  }

  // полоса всех выходов
  var sg = G('strip');
  el('text', { x: 8, y: 700, 'font-size': 14, 'class': 'muted' }, sg, 'Выходы для всех позиций:');
  var chips = W.map(function (w, j) {
    var cx = CX(j), g = el('g', {}, sg);
    el('rect', { x: cx - 30, y: 712, width: 60, height: 30, rx: 6, fill: F.z, 'class': 'box' }, g);
    var t = el('text', { x: cx, y: 732, 'text-anchor': 'middle', 'font-size': 14, fill: '#fff' }, g);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, 'z');
    el('tspan', { dy: 4, 'font-size': 11 }, t, w);
    return g;
  });
  var chipRing = el('rect', { y: 707, width: 70, height: 40, rx: 9, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 2 }, sg);

  // ── stage chrome (this script owns prev/next, counter and progress) ─────
  var buttons = Array.prototype.slice.call(stage.querySelectorAll('.word-row button'));
  var prevBtn = stage.querySelector('[data-nav="prev"]');
  var nextBtn = stage.querySelector('[data-nav="next"]');
  var counter = stage.querySelector('.stage-counter');
  var progress = stage.querySelector('.stage-progress');
  var kicker = stage.querySelector('.step-kicker');
  var titleEl = stage.querySelector('.step-live h4');
  var textEl = stage.querySelector('.step-live p');
  var mathEl = stage.querySelector('.math-display');

  var ticks = [];
  for (var t1 = 0; t1 < N; t1++) ticks.push(progress.appendChild(document.createElement('i')));

  buttons.forEach(function (b, j) {
    b.addEventListener('click', function () { stopCycle(); setQuery(j); });
  });

  function setFormula(tex) {
    if (!mathEl) return;
    if (!tex) { mathEl.hidden = true; mathEl.removeAttribute('data-tex'); return; }
    mathEl.hidden = false;
    mathEl.setAttribute('data-tex', tex);
    mathEl.dataset.rendered = '';
    if (window.katex) {
      try {
        window.katex.render(tex, mathEl, { throwOnError: false, displayMode: true, strict: 'ignore' });
        mathEl.dataset.rendered = '1';
        return;
      } catch (e) { /* fall through */ }
    }
    mathEl.textContent = tex;
  }
  window.addEventListener('load', function () {
    if (mathEl && mathEl.dataset.rendered !== '1') setFormula(mathEl.getAttribute('data-tex'));
  });

  // ── state ──────────────────────────────────────────────────────────────
  var step = 0, qi = 0, px = CX(0), frame = 0, timer = 0;
  var done = {};
  var reduced = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function geom() {
    point.setAttribute('cx', px);
    links.forEach(function (l, j) {
      l.setAttribute('x1', CX(j)); l.setAttribute('y1', TOP + 2);
      l.setAttribute('x2', px);    l.setAttribute('y2', PT);
    });
    chipRing.setAttribute('x', px - 35);
  }

  // A word as a TeX subscript. «<eos>» can't sit inside \text{}, so it gets
  // real math-mode angle brackets instead.
  var twx = function (w) { return w === '<eos>' ? '\\langle \\text{eos} \\rangle' : '\\text{' + w + '}'; };
  var list = function (arr) { return '[\\; ' + arr.join(' \\;;\\; ') + ' \\;]'; };

  function render() {
    var r = calc(qi), q = W[qi], Qe = esc(q), st = step;
    var amax = Math.max.apply(null, r.a), best = r.a.indexOf(amax);

    P.forEach(function (p) {
      p.qSub.textContent = q;
      Q[qi].forEach(function (v, i) { p.qv[i].textContent = v; });
    });
    S.forEach(function (t, j) { t.textContent = r.s[j]; });
    A.forEach(function (x, j) { x.sub.textContent = q + ',' + W[j]; x.v.textContent = f2(r.a[j]); });
    Wv.forEach(function (t, j) { t.textContent = f2(r.a[j]); });
    zSub.textContent = q;
    zv.forEach(function (t, i) { t.textContent = f2(r.out[i]); });

    var vis = [['pairs',1],['rowS',1],['band',2],['rowW',3],['out',4],['strip',5]];
    vis.forEach(function (pair) { G(pair[0]).style.opacity = st >= pair[1] ? 1 : 0.1; });
    G('strip').style.opacity = st >= 5 ? 1 : 0;
    chips.forEach(function (c, j) { c.style.opacity = done[j] ? 1 : 0.15; });
    chipRing.style.opacity = st >= 5 ? 1 : 0;

    links.forEach(function (l, j) {
      var w = 1.7, o = 0.7;
      if (st >= 2) { w = 1 + 9 * r.a[j]; o = 0.25 + 0.75 * r.a[j] / amax; }
      l.style.strokeWidth = w; l.style.opacity = o;
    });
    qw.forEach(function (t, j) {
      t.setAttribute('fill', j === qi ? 'var(--blue)' : 'var(--ink)');
      t.setAttribute('font-weight', j === qi ? '700' : '400');
    });
    buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === qi)); });

    var qt = twx(q), qs = qt + '\\text{,j}';
    var T = [
      ['Шаг 1 · входы и связи', 'Входы и связи',
       'Все шесть входных векторов остаются на месте. Выбрано слово «' + Qe + '»: его query будет сравниваться с keys всех позиций, включая само слово. Пунктир показывает эти связи.',
       'q_{' + qt + '} = W_{Q}^{T}x_{' + qt + '},\\quad k_{j} = W_{K}^{T}x_{j},\\quad v_{j} = W_{V}^{T}x_{j}'],
      ['Шаг 2 · оценки q·k', 'Оценки q · k',
       'Один и тот же q<sub>' + Qe + '</sub> скалярно умножается на key каждой позиции. Получается шесть оценок s — насколько каждая позиция подходит к запросу «' + Qe + '».',
       's_{' + qs + '} = q_{' + qt + '} \\cdot k_{j} = ' + list(r.s)],
      ['Шаг 3 · softmax', 'Softmax → веса',
       'Оценки делим на √D<sub>out</sub> = 2 и пропускаем через softmax. Веса a положительные и в сумме дают 1. Толщина пунктира теперь соответствует весу: сильнее всего «' + Qe + '» смотрит на «' + esc(W[best]) + '».',
       'a_{' + qs + '} = \\operatorname{softmax}( s_{' + qs + '} / \\sqrt{4} ) = ' + list(r.a.map(f2))],
      ['Шаг 4 · веса × values', 'Веса умножают values',
       'Каждый вес a<sub>' + Qe + ',j</sub> умножает value v<sub>j</sub> своей позиции. Позиции с большим весом внесут больше в результат, с маленьким — почти ничего.',
       f2(amax) + ' \\cdot v_{' + twx(W[best]) + '} \\;\\; \\text{— самый крупный вклад}'],
      ['Шаг 5 · сумма — выход', 'Сумма — выход z<sub>' + Qe + '</sub>',
       'Складываем взвешенные values всех шести позиций и получаем выходной вектор z<sub>' + Qe + '</sub>: новое представление «' + Qe + '» с учётом контекста всей фразы.',
       'z_{' + qt + '} = \\sum_{j} a_{' + qs + '} \\cdot v_{j} = ' + list(r.out.map(f2))],
      ['Шаг 6 · для каждого слова', 'То же — для каждого слова',
       'Меняется только query, keys и values те же. Для каждой позиции получается свой выход — на схеме слова перебираются по очереди, а внизу копятся готовые z. В модели все шесть выходов считаются одновременно.',
       'Z = \\operatorname{softmax}( Q K^{T} / \\sqrt{D_{\\mathrm{out}}} ) \\cdot V']
    ][st];

    kicker.textContent = T[0];
    titleEl.innerHTML = T[1];
    textEl.innerHTML = T[2];
    setFormula(T[3]);

    counter.textContent = (st + 1) + ' из ' + N;
    prevBtn.disabled = st === 0;
    nextBtn.textContent = st === N - 1 ? 'Сначала ↺' : 'Далее →';
    ticks.forEach(function (tick, index) { tick.classList.toggle('done', index <= st); });
    svg.setAttribute('aria-label', 'Self-attention: выход для слова «' + q + '». Вверху входные векторы шести слов и связи от слова-запроса. Ниже для каждой позиции: пара q и k, оценка, вес после softmax, value. Справа — выходной вектор z как взвешенная сумма values.');
  }

  function setQuery(i) {
    if (step >= 4) done[i] = true;
    if (i === qi) { render(); return; }
    var from = px, to = CX(i);
    qi = i;
    render();
    cancelAnimationFrame(frame);
    if (reduced()) { px = to; geom(); return; }
    var t0 = performance.now();
    var tick = function (now) {
      var t = Math.min(1, (now - t0) / 550), e = t * t * (3 - 2 * t);
      px = from + (to - from) * e;
      geom();
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  function stopCycle() { clearTimeout(timer); timer = 0; }
  function cycle() {
    done = {};
    if (reduced()) { W.forEach(function (w, j) { done[j] = true; }); render(); return; }
    var j = 0;
    var run = function () {
      setQuery(j); j++;
      if (j < M) timer = setTimeout(run, 1300); else timer = 0;
    };
    run();
  }
  function go(i) {
    if (i < 0 || i >= N) return;
    stopCycle();
    step = i;
    if (step >= 4) done[qi] = true;
    render();
    if (step === 5) cycle();
  }

  nextBtn.addEventListener('click', function () { go((step + 1) % N); });
  prevBtn.addEventListener('click', function () { go(step - 1); });
  stage.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(step + 1, N - 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(step - 1, 0)); }
  });

  geom();
  render();
})();
</script>

<p class="stage-hint">Нажмите на слово, чтобы пройти весь путь до его выхода z; шаги переключаются кнопками или стрелками ← →.</p><div class="worked-example">
<div class="worked-label">Числовой пример · выход для слова «Я»</div>
<div class="worked-grid">
<div class="worked-cell">
<span>Подставляем</span>
<div class="math-display worked-math" data-tex="z_{\text{Я}} = 0{,}09\,v_{\text{Я}} + 0{,}39\,v_{\text{видел}} + 0{,}14\,(v_{\text{котю}} + v_{\text{на}} + v_{\text{мате}}) + 0{,}09\,v_{\text{eos}}"></div>
</div>
<div class="worked-cell worked-result">
<span>Получаем</span>
<div class="math-display worked-math" data-tex="z_{\text{Я}} = (0{,}23;\ 0{,}93;\ 0{,}58;\ 0{,}61)"></div>
</div>
</div>
<div class="worked-trace">
<div class="worked-trace-title">Две показательные компоненты</div>
<div class="worked-trace-row">
<div class="worked-trace-name">z[2]</div>
<div class="math-display worked-trace-math" data-tex="0{,}39\cdot2 + 0{,}14\cdot1 = 0{,}93"></div>
<div class="worked-trace-note">84% компоненты пришло от «видел»</div>
</div>
<div class="worked-trace-row">
<div class="worked-trace-name">z[3]</div>
<div class="math-display worked-trace-math" data-tex="0{,}14\cdot(2 + 1 + 1) = 0{,}58"></div>
<div class="worked-trace-note">у трёх слов вес одинаковый 0,14, вклад каждого пропорционален его value</div>
</div>
</div>
<p class="worked-reading"><strong>Как это прочитать:</strong> у самого «Я» value равен <code>(1, 0, 0, 1)</code>,
  а его новое представление несёт в основном вторую компоненту — ту, что пришла из «видел». Выход
  self-attention описывает слово через контекст, в котором оно стоит.</p>
</div><div class="callout">
<strong>Главная мысль части:</strong> выход слова — взвешенная сумма values всех слов с весами
  <code>softmax(q·k/√D)</code>. Для другого слова меняется только query, keys и values те же.
</div><hr/><h2 id="part-9">Глава 9. Матричная форма self-attention</h2><p>
  Все расчёты для шести слов независимы, поэтому их записывают матрицами. Сложим входные векторы строками
  в <code>X</code> — тогда проекции, оценки, веса и выходы получаются сразу для всей фразы:
</p><div class="math-display" data-tex="Q = XW_Q,\quad K = XW_K,\quad V = XW_V, \qquad H = \operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{D_{\text{out}}}}\right) V"></div><table class="shape-table">
<tr><th>Матрица</th><th>Форма</th><th>Строка i — это</th></tr>
<tr><td><code>X</code></td><td>6 × D<sub>in</sub></td><td>входной вектор токена i</td></tr>
<tr><td><code>Q, K, V</code></td><td>6 × 4</td><td>qᵢ, kᵢ, vᵢ</td></tr>
<tr><td><code>S = QKᵀ</code></td><td>6 × 6</td><td>оценки слова i со всеми словами</td></tr>
<tr><td><code>A = softmax(S/√4)</code></td><td>6 × 6</td><td>веса слова i, сумма строки = 1</td></tr>
<tr><td><code>H = AV</code></td><td>6 × 4</td><td>выход zᵢ</td></tr>
</table><div class="stage" id="stageSaMatrix" tabindex="0">
  <div class="stage-figure">
<svg id="svgSaMatrix" viewBox="0 0 1080 660" role="img" aria-label="Self-attention в матричной форме: проекции X в Q, K и V; произведение Q на K транспонированное даёт матрицу оценок S; softmax по строкам и умножение на V дают выходную матрицу H">
  <style>
    svg { font-family: Helvetica, Arial, sans-serif; --ink: #111111; --muted: #5E5850; --card: #FFFFFF; --blue: #3576C0; }
    .ink { fill: var(--ink); }
    .muted { fill: var(--muted); }
    .cell { fill: #111111; font-size: 13px; text-anchor: middle; }
    .lab { font-size: 14px; fill: var(--muted); }
    .hit { cursor: pointer; }
    .hit:hover { stroke: #C29E08; stroke-width: 2; }
    .halo { paint-order: stroke; stroke: var(--card); stroke-width: 5px; stroke-linejoin: round; }
  </style>
  <defs>
    <marker id="sam-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 1 L10 5 L0 9z" fill="var(--ink)"></path>
    </marker>
  </defs>
  <g data-g="A"></g>
  <g data-g="B"></g>
  <g data-g="C"></g>
  <g data-g="D"></g>
</svg>
  </div>
  <div class="word-row" role="group" aria-label="Выберите строку матрицы">
    <button type="button" data-token="0" aria-pressed="true">Я</button>
    <button type="button" data-token="1" aria-pressed="false">видел</button>
    <button type="button" data-token="2" aria-pressed="false">котю</button>
    <button type="button" data-token="3" aria-pressed="false">на</button>
    <button type="button" data-token="4" aria-pressed="false">мате</button>
    <button type="button" data-token="5" aria-pressed="false">&lt;eos&gt;</button>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker"></div>
      <h4></h4>
      <p></p>
      <div class="math-display" data-tex=""></div>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageSaMatrix');
  if (!stage) return;
  var svg = stage.querySelector('.stage-figure svg');
  if (!svg) return;
  if (stage.dataset.ready === '1') return;
  stage.dataset.ready = '1';

  var NS = 'http://www.w3.org/2000/svg';
  var gA = svg.querySelector('[data-g="A"]');
  var gB = svg.querySelector('[data-g="B"]');
  var gC = svg.querySelector('[data-g="C"]');
  var gD = svg.querySelector('[data-g="D"]');
  var groups = [gA, gB, gC, gD];

  var wordRow = stage.querySelector('.word-row');
  var buttons = Array.prototype.slice.call(stage.querySelectorAll('.word-row button'));
  var prevBtn = stage.querySelector('[data-nav="prev"]');
  var nextBtn = stage.querySelector('[data-nav="next"]');
  var counter = stage.querySelector('.stage-counter');
  var progress = stage.querySelector('.stage-progress');
  var kicker = stage.querySelector('.step-kicker');
  var titleEl = stage.querySelector('.step-live h4');
  var textEl = stage.querySelector('.step-live p');
  var mathEl = stage.querySelector('.math-display');

  // ---- data (verbatim from the original mini-page) ----
  var W = ['Я', 'видел', 'котю', 'на', 'мате', '<eos>'], N = 6;
  var Q = [[0,2,0,1],[1,0,2,0],[0,2,0,0],[0,0,0,2],[0,0,2,1],[1,1,1,1]];
  var K = [[2,0,0,1],[0,2,0,0],[0,1,2,0],[0,0,1,2],[1,0,0,2],[0,0,0,1]];
  var V = [[1,0,0,1],[0,2,0,0],[0,0,2,1],[1,0,1,0],[0,1,1,2],[0,0,0,1]];
  var S = Q.map(function (q) { return K.map(function (k) { return k.reduce(function (a, v, i) { return a + v * q[i]; }, 0); }); });
  var A = S.map(function (r) {
    var e = r.map(function (x) { return Math.exp(x / 2); });
    var z = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (x) { return x / z; });
  });
  var H = A.map(function (a) {
    return [0, 1, 2, 3].map(function (d) {
      return a.reduce(function (acc, w, j) { return acc + w * V[j][d]; }, 0);
    });
  });
  var F = { x: '#3576C0', q: '#3576C0', k: '#C29E08', v: '#C30B0A', s: '#C29E08', a: '#C29E08', h: '#C30B0A' };
  var f2 = function (x) { return x.toFixed(2).replace('.', ','); };
  var esc = function (t) { return String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  var step = 0, sel = 0, col = S[0].indexOf(Math.max.apply(null, S[0]));

  // ---- svg helpers (verbatim geometry) ----
  function el(tag, a, p, t) {
    var n = document.createElementNS(NS, tag);
    for (var k in a) n.setAttribute(k, a[k]);
    if (t != null) n.textContent = t;
    p.appendChild(n);
    return n;
  }
  function name(p, x, y, base, sub, sup, size) {
    size = size || 22;
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': size, fill: '#111', 'class': 'halo-l' }, p);
    el('tspan', { 'font-weight': 700, 'font-style': 'italic' }, t, base);
    if (sup) el('tspan', { dy: -9, 'font-size': Math.round(size * 0.6) }, t, sup);
    if (sub) el('tspan', { dy: sup ? 15 : 6, dx: sup ? -7 : 0, 'font-size': Math.round(size * 0.65), 'font-style': 'italic' }, t, sub);
    return t;
  }
  function brace(p, x1, x2, y, label, side) {
    side = side || 'top';
    var m = (x1 + x2) / 2, r = 8;
    if (side === 'top') {
      el('path', { d: 'M' + x1 + ' ' + (y + r) + ' Q' + x1 + ' ' + y + ' ' + (x1 + r) + ' ' + y + ' L' + (m - 6) + ' ' + y + ' Q' + m + ' ' + y + ' ' + m + ' ' + (y - 7) + ' Q' + m + ' ' + y + ' ' + (m + 6) + ' ' + y + ' L' + (x2 - r) + ' ' + y + ' Q' + x2 + ' ' + y + ' ' + x2 + ' ' + (y + r), fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.5 }, p);
      el('text', { x: m, y: y - 13, 'text-anchor': 'middle', 'class': 'lab' }, p, label);
    } else {
      var y1 = x1, y2 = x2, x = y, mm = (y1 + y2) / 2, d = side === 'left' ? -1 : 1;
      el('path', { d: 'M' + (x - d * r) + ' ' + y1 + ' Q' + x + ' ' + y1 + ' ' + x + ' ' + (y1 + r) + ' L' + x + ' ' + (mm - 6) + ' Q' + x + ' ' + mm + ' ' + (x + d * 7) + ' ' + mm + ' Q' + x + ' ' + mm + ' ' + x + ' ' + (mm + 6) + ' L' + x + ' ' + (y2 - r) + ' Q' + x + ' ' + y2 + ' ' + (x - d * r) + ' ' + y2, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.5 }, p);
      el('text', { x: x + d * 14, y: mm + 5, 'text-anchor': side === 'left' ? 'end' : 'start', 'class': 'lab' }, p, label);
    }
  }
  function contrast(fill) {
    return ['#3576C0', '#C30B0A', '#3576C0', '#C29E08'].indexOf(String(fill).toUpperCase()) !== -1 ? '#fff' : '#111';
  }
  function matrix(p, x, y, rows, cols, cw, ch, fill, vals, o) {
    o = o || {};
    var g = el('g', {}, p), cells = [], txt = [];
    for (var r = 0; r < rows; r++) {
      cells.push([]); txt.push([]);
      for (var c = 0; c < cols; c++) {
        var rc = el('rect', { x: x + c * cw, y: y + r * ch, width: cw, height: ch, fill: fill, stroke: '#111', 'stroke-width': 1, 'class': o.hit ? 'hit' : '' }, g);
        cells[r].push(rc);
        if (o.hit) (function (rr, cc) { rc.addEventListener('click', function () { o.hit(rr, cc); }); })(r, c);
        if (vals) {
          var t = el('text', { x: x + c * cw + cw / 2, y: y + r * ch + ch / 2 + 4.5, 'class': 'cell', fill: contrast(fill), 'pointer-events': 'none' }, g, vals[r][c]);
          txt[r].push(t);
        }
      }
    }
    el('rect', { x: x, y: y, width: cols * cw, height: rows * ch, fill: 'none', stroke: '#111', 'stroke-width': 1.8 }, g);
    return { g: g, cells: cells, txt: txt, x: x, y: y, cw: cw, ch: ch, rows: rows, cols: cols };
  }
  function rowRing(p, m) {
    return el('rect', { x: m.x - 3, width: m.cols * m.cw + 6, height: m.ch + 6, rx: 4, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 2.4, 'pointer-events': 'none' }, p);
  }
  function colRing(p, m) {
    return el('rect', { y: m.y - 3, width: m.cw + 6, height: m.rows * m.ch + 6, rx: 4, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 2.4, 'pointer-events': 'none' }, p);
  }
  function cellRing(p, m) {
    return el('rect', { width: m.cw + 6, height: m.ch + 6, rx: 4, fill: 'none', stroke: '#D83BB9', 'stroke-width': 2.6, 'pointer-events': 'none' }, p);
  }
  function rowLabels(p, m, x) {
    W.forEach(function (w, i) { el('text', { x: x, y: m.y + i * m.ch + m.ch / 2 + 5, 'text-anchor': 'end', 'font-size': 14, 'class': 'ink' }, p, w); });
  }
  function colLabels(p, m, y) {
    W.forEach(function (w, i) { el('text', { x: m.x + i * m.cw + m.cw / 2, y: y, 'text-anchor': 'middle', 'font-size': 12.5, 'class': 'ink' }, p, w); });
  }
  function pick(r, c) { sel = r; if (c != null) col = c; render(); }

  // ---- A: проекции ----
  var proj = [], ringsA = [];
  [['Q', F.q, Q, 'Queries'], ['K', F.k, K, 'Keys'], ['V', F.v, V, 'Values']].forEach(function (spec, r) {
    var n = spec[0], fill = spec[1], vals = spec[2], title = spec[3];
    var y = 70 + r * 196, ch = 20;
    var X = matrix(gA, 190, y, 6, 6, 28, ch, F.x, null, { hit: function (i) { pick(i); } });
    name(gA, 274, y + 68, 'X', '', null, 26);
    var Wm = matrix(gA, 388, y, 6, 4, 26, ch, fill, null);
    name(gA, 440, y + 68, 'W', n, null, 24);
    el('text', { x: 530, y: y + 70, 'text-anchor': 'middle', 'font-size': 30, 'class': 'ink' }, gA, '=');
    var R = matrix(gA, 580, y, 6, 4, 34, ch, fill, vals, { hit: function (i) { pick(i); } });
    el('text', { x: 752, y: y + 66, 'font-size': 19, 'font-weight': 700, 'class': 'ink' }, gA, title);
    name(gA, 760, y + 94, n, '', null, 20).setAttribute('text-anchor', 'start');
    rowLabels(gA, X, 180);
    ringsA.push([rowRing(gA, X), rowRing(gA, R)]);
    proj.push({ X: X, Wm: Wm, R: R });
  });
  brace(gA, 190, 358, 52, 'D_in = 6 (вход)');
  brace(gA, 388, 492, 52, 'D_out = 4');
  brace(gA, 580, 716, 52, 'D_out = 4');
  el('text', { x: 180, y: 58, 'text-anchor': 'end', 'class': 'lab' }, gA, 'строки = токены');

  // ---- B: Q · Kᵀ = S ----
  var qB = matrix(gB, 90, 150, 6, 4, 32, 30, F.q, Q, { hit: function (i) { pick(i); } });
  rowLabels(gB, qB, 82); name(gB, 154, 355, 'Q');
  var kT = K[0].map(function (_, d) { return K.map(function (k) { return k[d]; }); });
  var kB = matrix(gB, 250, 150, 4, 6, 44, 30, F.k, kT, { hit: function (r, c) { pick(sel, c); } });
  colLabels(gB, kB, 140); name(gB, 382, 300, 'K', '', 'T');
  el('text', { x: 538, y: 246, 'text-anchor': 'middle', 'font-size': 30, 'class': 'ink' }, gB, '=');
  var sB = matrix(gB, 616, 150, 6, 6, 52, 30, F.s, S, { hit: function (r, c) { pick(r, c); } });
  colLabels(gB, sB, 140); rowLabels(gB, sB, 608); name(gB, 772, 355, 'S', '', '');
  brace(gB, 616, 928, 112, 'keys: 6 токенов');
  brace(gB, 150, 330, 940, 'queries: 6', 'right');
  brace(gB, 90, 218, 112, 'D_out = 4');
  brace(gB, 250, 514, 112, 'токены: 6');
  var rQB = rowRing(gB, qB), rSB = rowRing(gB, sB), cKB = colRing(gB, kB), cSB = cellRing(gB, sB);
  var bNote = el('text', { x: 616, y: 400, 'font-size': 16, fill: '#C29E08', 'font-weight': 700 }, gB);

  // ---- C: softmax(S/√D) · V = H ----
  var aTxt = A.map(function (r) { return r.map(f2); });
  var aC = matrix(gC, 110, 190, 6, 6, 54, 30, F.a, aTxt, { hit: function (i) { pick(i); } });
  rowLabels(gC, aC, 74); colLabels(gC, aC, 180);
  el('path', { d: 'M100 178 Q84 280 100 382', fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2 }, gC);
  el('path', { d: 'M444 178 Q460 280 444 382', fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2 }, gC);
  el('text', { x: 272, y: 132, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, 'class': 'ink' }, gC, 'softmax( S / √4 ) по строкам');
  el('text', { x: 272, y: 410, 'text-anchor': 'middle', 'font-size': 15, 'class': 'muted' }, gC, 'A — веса, каждая строка в сумме 1');
  el('text', { x: 486, y: 286, 'text-anchor': 'middle', 'font-size': 26, 'class': 'ink' }, gC, '·');
  var vC = matrix(gC, 512, 190, 6, 4, 32, 30, F.v, V);
  name(gC, 576, 410, 'V');
  el('text', { x: 684, y: 286, 'text-anchor': 'middle', 'font-size': 30, 'class': 'ink' }, gC, '=');
  var hC = matrix(gC, 720, 190, 6, 4, 56, 30, F.h, H.map(function (r) { return r.map(f2); }), { hit: function (i) { pick(i); } });
  rowLabels(gC, hC, 1020); name(gC, 832, 410, 'H');
  brace(gC, 720, 944, 150, 'D_out = 4');
  brace(gC, 512, 640, 150, 'D_out = 4');
  var rAC = rowRing(gC, aC), rHC = rowRing(gC, hC);

  // ---- D: цепочка форм ----
  var chain = [['X', '6 × D_in', F.x, 90, 60], ['Q, K, V', '6 × 4', F.q, 60, 60], ['S', '6 × 6', F.s, 90, 60], ['A', '6 × 6', F.a, 90, 60], ['H', '6 × 4', F.h, 60, 60]];
  var cx = 90;
  chain.forEach(function (spec, i) {
    var n = spec[0], d = spec[1], fill = spec[2], w = spec[3], h = 90;
    el('rect', { x: cx, y: 245, width: w, height: h, fill: fill, stroke: '#111', 'stroke-width': 1.6 }, gD);
    if (i === 1) {
      el('rect', { x: cx + 8, y: 253, width: w, height: h, fill: F.k, stroke: '#111', 'stroke-width': 1.6 }, gD);
      el('rect', { x: cx + 16, y: 261, width: w, height: h, fill: F.v, stroke: '#111', 'stroke-width': 1.6 }, gD);
    }
    el('text', { x: cx + w / 2 + (i === 1 ? 8 : 0), y: 400, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, 'font-style': 'italic', 'class': 'ink' }, gD, n);
    el('text', { x: cx + w / 2 + (i === 1 ? 8 : 0), y: 424, 'text-anchor': 'middle', 'font-size': 15, 'class': 'muted' }, gD, d);
    var lbl = ['', '· W_Q, W_K, W_V', 'Q · Kᵀ', 'softmax(· / √4)', 'A · V'][i + 1];
    if (i < 4) {
      var x1 = cx + w + (i === 1 ? 30 : 14), x2 = x1 + 100;
      el('line', { x1: x1, y1: 290, x2: x2, y2: 290, stroke: 'var(--ink)', 'stroke-width': 1.8, 'marker-end': 'url(#sam-arr)' }, gD);
      el('text', { x: (x1 + x2) / 2, y: 278, 'text-anchor': 'middle', 'font-size': 14.5, 'class': 'ink' }, gD, lbl);
      cx = x2 + 14;
    }
  });
  el('text', { x: 540, y: 500, 'text-anchor': 'middle', 'font-size': 24, 'class': 'ink' }, gD).innerHTML =
    'H = softmax( Q K<tspan dy="-9" font-size="14">T</tspan><tspan dy="9"> / √D</tspan><tspan dy="6" font-size="15">out</tspan><tspan dy="-6"> ) · V</tspan>';
  el('text', { x: 540, y: 540, 'text-anchor': 'middle', 'font-size': 16, 'class': 'muted' }, gD,
    'Строка i матрицы H — тот же выходной вектор z слова i, что мы собирали по частям');

  // ---- stepper chrome (mirrors initStageScenes) ----
  progress.innerHTML = '';
  for (var t = 0; t < N; t++) progress.appendChild(document.createElement('i'));
  var ticks = Array.prototype.slice.call(progress.querySelectorAll('i'));

  var sb = function (b, s) { return b + '<sub>' + esc(s) + '</sub>'; };
  var stageOf = [0, 1, 1, 2, 2, 3];
  var KICKERS = ['Шаг 1 · Q, K, V разом', 'Шаг 2 · S = Q Kᵀ', 'Шаг 3 · одна клетка', 'Шаг 4 · softmax по строкам', 'Шаг 5 · A · V = H', 'Шаг 6 · формула целиком'];

  function tw(w) { return '\\text{' + w + '}'; }
  function trow(w) { return '\\text{строка «' + w + '»}'; }
  function ft(x) { return f2(x).replace(',', '{,}'); }

  function place(ring, m, r, c) {
    if (r != null) ring.setAttribute('y', m.y + r * m.ch - 3);
    if (c != null) ring.setAttribute('x', m.x + c * m.cw - 3);
  }

  function setMath(tex) {
    if (!tex) { mathEl.hidden = true; mathEl.setAttribute('data-tex', ''); return; }
    mathEl.hidden = false;
    mathEl.setAttribute('data-tex', tex);
    mathEl.dataset.rendered = '1';
    if (window.katex) {
      try { window.katex.render(tex, mathEl, { throwOnError: false, displayMode: true, strict: 'ignore' }); }
      catch (e) { mathEl.textContent = tex; }
    } else {
      mathEl.textContent = tex;
    }
  }

  function render() {
    var st = step, w = W[sel], we = esc(w), cw = W[col], ce = esc(cw);
    groups.forEach(function (g, i) {
      var on = stageOf[st] === i;
      g.style.opacity = on ? 1 : 0;
      g.style.visibility = on ? 'visible' : 'hidden';
    });
    ringsA.forEach(function (pair, r) { place(pair[0], proj[r].X, sel); place(pair[1], proj[r].R, sel); });
    place(rQB, qB, sel); place(rSB, sB, sel); place(cKB, kB, null, col); place(cSB, sB, sel, col);
    cKB.style.opacity = st === 2 ? 1 : 0;
    cSB.style.opacity = st === 2 ? 1 : 0;
    rSB.style.opacity = 1;
    bNote.textContent = st === 2
      ? 'S[' + w + ', ' + cw + '] = q·k = ' + Q[sel].map(function (v, i) { return v + '·' + K[col][i]; }).join(' + ') + ' = ' + S[sel][col]
      : '';
    place(rAC, aC, sel); place(rHC, hC, sel);
    [vC.g, hC.g].forEach(function (g) { g.style.opacity = st === 3 ? 0.15 : 1; });
    buttons.forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === sel)); });
    wordRow.style.visibility = st === 5 ? 'hidden' : 'visible';

    var T = [
      ['Q, K, V — одним умножением',
       'Строки X — входные векторы всех шести токенов. Умножив X на ' + sb('W', 'Q') + ', ' + sb('W', 'K') + ' и ' + sb('W', 'V') + ', получаем сразу все queries, keys и values. Выделенная строка — токен «' + we + '»: это ровно ' + sb('q', w) + ', ' + sb('k', w) + ' и ' + sb('v', w) + ' из схемы про проекции.',
       'Q = X W_{Q},\\quad K = X W_{K},\\quad V = X W_{V},\\quad (6 \\times D_{\\mathrm{in}}) \\cdot (D_{\\mathrm{in}} \\times 4) = 6 \\times 4'],
      ['Все оценки: Q · K<sup>T</sup>',
       'Транспонируем K, чтобы keys стали столбцами, и умножаем Q на Kᵀ. Получается квадратная матрица оценок 6 × 6. Строка «' + we + '» — это шесть оценок, которые мы раньше считали для этого слова по одной.',
       'S = Q K^{\\top},\\quad ' + trow(w) + ' = [\\,' + S[sel].join(' ;\\, ') + '\\,]'],
      ['Одна клетка — одна пара',
       'Клетка на пересечении строки «' + we + '» и столбца «' + ce + '» — скалярное произведение ' + sb('q', w) + ' и ' + sb('k', cw) + '. Нажмите на любую клетку S или столбец Kᵀ, чтобы увидеть её расчёт.',
       'S_{' + tw(w) + ',\\,' + tw(cw) + '} = q_{' + tw(w) + '} \\cdot k_{' + tw(cw) + '} = \\mathbf{' + S[sel][col] + '}'],
      ['Softmax по строкам',
       'Делим всю матрицу на √D<sub>out</sub> = 2 и применяем softmax отдельно к каждой строке. Получаем матрицу весов A: в строке «' + we + '» — распределение внимания этого слова, сумма строки равна 1.',
       'A = \\operatorname{softmax}( S / \\sqrt{4} ),\\quad ' + trow(w) + ' = [\\,' + A[sel].map(ft).join(' ;\\, ') + '\\,]'],
      ['A · V = H',
       'Умножаем веса на V. Строка «' + we + '» матрицы H — взвешенная сумма строк V с весами из строки A, то есть выходной вектор ' + sb('z', w) + '. Числа совпадают со схемой полного расчёта.',
       'H_{' + tw(w) + '} = \\sum_{j} A_{' + tw(w) + ',\\,j} \\cdot v_{j} = [\\,' + H[sel].map(ft).join(' ;\\, ') + '\\,]'],
      ['Вся формула целиком',
       'Три умножения и softmax заменяют весь поэлементный расчёт. Размеры: из X (6 × D<sub>in</sub>) получаются Q, K, V (6 × 4), оценки и веса — 6 × 6, выход H снова 6 × 4. Поэтому attention хорошо ложится на GPU, но матрица 6 × 6 растёт квадратично с длиной последовательности.',
       'H = \\operatorname{softmax}\\!\\left( \\frac{Q K^{\\top}}{\\sqrt{D_{\\mathrm{out}}}} \\right) V']
    ][st];

    kicker.textContent = KICKERS[st];
    titleEl.innerHTML = T[0];
    textEl.innerHTML = T[1];
    setMath(T[2]);

    ticks.forEach(function (tick, index) { tick.classList.toggle('done', index <= st); });
    counter.textContent = (st + 1) + ' из ' + N;
    prevBtn.disabled = st === 0;
    nextBtn.textContent = st === N - 1 ? 'Сначала ↺' : 'Далее →';
  }

  function move(delta) {
    var target = step + delta;
    if (target < 0) return;
    if (target >= N) target = 0;
    step = target;
    render();
  }

  buttons.forEach(function (b, j) { b.addEventListener('click', function () { pick(j); }); });
  prevBtn.addEventListener('click', function () { move(-1); });
  nextBtn.addEventListener('click', function () { move(1); });
  stage.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { move(1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { move(-1); event.preventDefault(); }
  });
  // KaTeX is loaded with `defer`, so it may be missing on the first render.
  window.addEventListener('load', function () { render(); });
  if (!window.katex) {
    var tries = 0;
    var waitKatex = setInterval(function () {
      if (window.katex) { clearInterval(waitKatex); render(); }
      else if (++tries > 60) clearInterval(waitKatex);
    }, 100);
  }

  render();
})();
</script>

<p class="stage-hint">Нажмите на слово, чтобы выбрать строку, или на любую клетку S — чтобы увидеть её расчёт; шаги переключаются кнопками или стрелками ← →.</p><div class="callout-blue">
<strong>Проверка на сквозном примере:</strong> строка «Я» матрицы S равна <code>(1; 4; 2; 2; 2; 1)</code>, строка
  A — <code>(0,09; 0,39; 0,14; 0,14; 0,14; 0,09)</code>, строка H — <code>(0,23; 0,93; 0,58; 0,61)</code>. Это те же
  числа, что мы получили поэлементно в частях 3 и 4: матричная запись ничего не меняет в расчёте.
</div><div class="callout-red">
<strong>Цена параллельности:</strong> матрицы S и A имеют размер n × n, где n — длина последовательности.
  Для 6 токенов это 36 чисел, для 4096 — почти 17 миллионов на одну голову. Память и время растут квадратично,
  и это главное ограничение self-attention на длинных текстах.
</div><div class="callout-yellow">
<strong>Что осталось за кадром:</strong> здесь нет причинной маски — каждое слово видит всю фразу, как в
  энкодере. В декодере GPT-подобных моделей клетки S выше диагонали заменяют на −∞ до softmax, чтобы слово не
  смотрело в будущее. В реальных трансформерах работают несколько голов параллельно, каждая со своими W.
</div><div class="callout">
<strong>Главная мысль части:</strong> весь self-attention — это <code>H = softmax(QKᵀ/√D)V</code>: три матричных
  умножения и softmax по строкам, где строка i матрицы H — выход слова i.
</div>

<hr/>

<h2 id="attention-part-9">Часть 9. Внимание, которое можно посчитать руками</h2>
<p>
  Вход — три токена, у каждого вектор из двух чисел (эмбеддинги заданы вручную).
  Каждый токен проецируется трижды: в запрос q, ключ k и значение v. Оценка
  s<sub>ij</sub> говорит, насколько токен i «интересуется» токеном j; softmax по строке
  превращает оценки в веса внимания, а выход токена — взвешенная сумма значений.
  Для задачи берём только выход первого токена &lt;CLS&gt;: линейный слой на два
  класса, softmax и cross-entropy.
</p>
<div class="math-display" data-tex="X\in\mathbb{R}^{3\times2}\;\xrightarrow{\;W_q,\,W_k,\,W_v\;}\;Q,K,V\;\xrightarrow{\;QK^{\top}/\sqrt2\;}\;S\in\mathbb{R}^{3\times3}\;\xrightarrow{\;\mathrm{softmax}\;}\;A\;\xrightarrow{\;\cdot\,V\;}\;O\in\mathbb{R}^{3\times2}\;\xrightarrow{\;o_1,\,W_o,\,c\;}\;z\in\mathbb{R}^{2}\;\to\;p,\ L"></div>
<div aria-label="Архитектура одной головы self-attention" class="stage" id="stageArch" tabindex="0">
<div class="stage-figure">
<svg aria-label="Цепочка self-attention: вход, проекции, оценки, softmax, смесь, линейный слой, softmax, ошибка" class="rnn-svg" id="ar-svg" role="img" viewbox="0 0 960 316">
<style>#ar-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="ar-arrow" markerheight="8" markerwidth="8" orient="auto" refx="6" refy="4.0"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"></path></marker></defs>
<text class="v-title" x="30" y="40">Восемь блоков, параметры только в жёлтых</text>
<text class="v-small" x="30" y="62">Синий — данные, жёлтый — обучаемая операция, зелёный — операции без параметров, красный — ошибка.</text>
<g data-key="ar-x"><rect class="box-blue" height="150" rx="10" width="84" x="24" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 66.0 171)" x="66.0" y="171">Input</text><text class="v-small" text-anchor="middle" x="66.0" y="266">X · 3×2</text><text class="v-tiny" text-anchor="middle" x="66.0" y="284">3 токена</text></g>
<g data-key="ar-qkv"><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="96"></rect><text class="layer-name" text-anchor="middle" x="189" y="123">V = XW_v</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="149"></rect><text class="layer-name" text-anchor="middle" x="189" y="176">Q = XW_q</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="202"></rect><text class="layer-name" text-anchor="middle" x="189" y="229">K = XW_k</text><text class="v-small" text-anchor="middle" x="189" y="266">W_q, W_k, W_v</text><text class="v-tiny" text-anchor="middle" x="189" y="284">12 параметров</text><path class="edge-green" d="M108 171 L132 171" marker-end="url(#ar-arrow)"></path></g>
<g data-key="ar-s"><rect class="box-green" height="150" rx="10" width="86" x="276" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 319.0 171)" x="319.0" y="171">Scores</text><text class="v-small" text-anchor="middle" x="319.0" y="266">S · 3×3</text><text class="v-tiny" text-anchor="middle" x="319.0" y="284">QKᵀ/√2</text><path class="edge-green" d="M244 171 L274 171" marker-end="url(#ar-arrow)"></path><path class="edge-green" d="M244 224 L274 196" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="258" y="163">Q</text><text class="tensor-name" text-anchor="middle" x="254" y="242">K</text></g>
<g data-key="ar-a"><rect class="box-green" height="150" rx="10" width="86" x="394" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 437.0 171)" x="437.0" y="171">Softmax</text><text class="v-small" text-anchor="middle" x="437.0" y="266">A · 3×3</text><text class="v-tiny" text-anchor="middle" x="437.0" y="284">по строкам</text><path class="edge-green" d="M362 171 L392 171" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="377" y="150">S</text></g>
<g data-key="ar-o"><rect class="box-green" height="150" rx="10" width="86" x="512" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 555.0 171)" x="555.0" y="171">Weighted sum</text><text class="v-small" text-anchor="middle" x="555.0" y="266">O = AV</text><text class="v-tiny" text-anchor="middle" x="555.0" y="284">0 параметров</text><path class="edge-green" d="M480 171 L510 171" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="495" y="150">A</text><path class="edge-green" d="M244 118 L258 118 L258 82 L555 82 L555 94" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="406" y="76">V идёт в обход оценок</text></g>
<g data-key="ar-f"><rect class="box-yellow" height="150" rx="10" width="96" x="630" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 678.0 171)" x="678.0" y="171">Linear</text><text class="v-small" text-anchor="middle" x="678.0" y="266">W_o · 2×2, c</text><text class="v-tiny" text-anchor="middle" x="678.0" y="284">6 параметров</text><path class="edge-green" d="M598 171 L628 171" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="613" y="150">o₁</text></g>
<g data-key="ar-p"><rect class="box-green" height="150" rx="10" width="80" x="758" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 798.0 171)" x="798.0" y="171">Softmax</text><text class="v-small" text-anchor="middle" x="798.0" y="266">p · 2</text><text class="v-tiny" text-anchor="middle" x="798.0" y="284">0 параметров</text><path class="edge-green" d="M726 171 L756 171" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="741" y="150">z</text></g>
<g data-key="ar-l"><rect class="box-red" height="150" rx="10" width="66" x="870" y="96"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 903.0 171)" x="903.0" y="171">Loss</text><text class="v-small" text-anchor="middle" x="903.0" y="266">L</text><text class="v-tiny" text-anchor="middle" x="903.0" y="284">позитив</text><path class="edge-green" d="M838 171 L868 171" marker-end="url(#ar-arrow)"></path><text class="tensor-name" text-anchor="middle" x="853" y="150">p</text></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="ar-x" data-on="ar-x"><div class="step-kicker">Шаг 1 · вход</div><h4>Три токена по два числа</h4><p>Строки <span class="math-inline" data-tex="X"></span> — эмбеддинги &lt;CLS&gt;, «фильм» и «хороший». Это единственные данные; всё остальное сеть вычислит из них и своих весов.</p></div>
<div class="step-panel" data-focus="ar-qkv" data-on="ar-x ar-qkv"><div class="step-kicker">Шаг 2 · проекции</div><h4>Три взгляда на один токен</h4><p>Каждая строка <span class="math-inline" data-tex="X"></span> умножается на три матрицы 2×2: запрос <span class="math-inline" data-tex="Q=XW_q"></span>, ключ <span class="math-inline" data-tex="K=XW_k"></span>, значение <span class="math-inline" data-tex="V=XW_v"></span>. Здесь 12 параметров, общих для всех токенов.</p></div>
<div class="step-panel" data-focus="ar-s" data-on="ar-qkv ar-s"><div class="step-kicker">Шаг 3 · оценки</div><h4>Каждый запрос против каждого ключа</h4><p><span class="math-inline" data-tex="S=QK^{\top}/\sqrt2"></span> — матрица 3×3: строка i — токен, который смотрит, столбец j — токен, на которого смотрят. Деление на <span class="math-inline" data-tex="\sqrt{d_k}"></span> не даёт оценкам расти вместе с размерностью.</p></div>
<div class="step-panel" data-focus="ar-a" data-on="ar-s ar-a"><div class="step-kicker">Шаг 4 · softmax</div><h4>Каждая строка становится распределением</h4><p>Softmax применяется по строкам: веса <span class="math-inline" data-tex="a_{ij}"></span> неотрицательны и в строке дают единицу. Параметров у softmax нет, но её выход понадобится в backward.</p></div>
<div class="step-panel" data-focus="ar-o" data-on="ar-qkv ar-a ar-o"><div class="step-kicker">Шаг 5 · взвешенная сумма</div><h4>Выход токена — смесь значений</h4><p><span class="math-inline" data-tex="o_i=\sum_j a_{ij}v_j"></span>. Обратите внимание на обходной путь сверху: <span class="math-inline" data-tex="V"></span> не участвует в оценках и идёт прямо в смесь.</p></div>
<div class="step-panel" data-focus="ar-f" data-on="ar-o ar-f"><div class="step-kicker">Шаг 6 · линейный слой</div><h4>Выход CLS → два логита</h4><p>Из трёх строк <span class="math-inline" data-tex="O"></span> классификатору нужна только первая: <span class="math-inline" data-tex="z=o_1W_o+c"></span>. Здесь ещё 6 параметров.</p></div>
<div class="step-panel" data-focus="ar-p" data-on="ar-f ar-p"><div class="step-kicker">Шаг 7 · softmax</div><h4>Два логита → две вероятности</h4><p>Экспонента и нормировка. Правильный класс — «позитив», второй по счёту.</p></div>
<div class="step-panel" data-focus="ar-l" data-on="ar-x ar-qkv ar-s ar-a ar-o ar-f ar-p ar-l"><div class="step-kicker">Шаг 8 · ошибка</div><h4>Вся сеть — одно число</h4><p>Cross-entropy сворачивает распределение в скаляр <span class="math-inline" data-tex="L"></span>. Именно по нему берутся производные всех 18 параметров.</p></div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки для навигации.</p>
<div class="callout">
<strong>Восемнадцать параметров, одна softmax в середине.</strong> Проекции хранят
  12 весов, классификатор — 6; оценки, softmax и взвешенная сумма не обучаются. В
  отличие от свёртки и RNN, здесь нет ни окна, ни порядка: каждый токен может
  смотреть на любой. Дальше проведём фразу через цепочку и вернём градиент обратно.
</div>
<hr/>

<h2 id="attention-part-10">Часть 10. Forward в формулах</h2>
<p>
  Сначала общий вид каждой операции — без чисел. Проекции — три матричных
  умножения; оценки — попарные скалярные произведения запросов и ключей; softmax
  нормирует каждую строку; выход — взвешенная сумма значений; классификатор, softmax
  и cross-entropy закрывают цепочку. Все векторы здесь — строки, поэтому матрицы
  весов стоят справа.
</p>
<div aria-label="Forward self-attention в формулах" class="stage" id="stageFF" tabindex="0">
<div class="stage-figure">
<svg aria-label="Цепочка self-attention: вход, проекции, оценки, softmax, смесь, линейный слой, softmax, ошибка" class="rnn-svg" id="ff-svg" role="img" viewbox="0 0 960 254">
<style>#ff-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="ff-arrow" markerheight="8" markerwidth="8" orient="auto" refx="6" refy="4.0"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"></path></marker></defs>
<text class="v-title" x="30" y="38">Forward: формула каждого блока</text>
<g data-key="ff-x"><rect class="box-blue" height="150" rx="10" width="84" x="24" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 66.0 153)" x="66.0" y="153">Input</text></g>
<g data-key="ff-qkv"><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="78"></rect><text class="layer-name" text-anchor="middle" x="189" y="105">V = XW_v</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="131"></rect><text class="layer-name" text-anchor="middle" x="189" y="158">Q = XW_q</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="184"></rect><text class="layer-name" text-anchor="middle" x="189" y="211">K = XW_k</text><path class="edge-green" d="M108 153 L132 153" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-s"><rect class="box-green" height="150" rx="10" width="86" x="276" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 319.0 153)" x="319.0" y="153">Scores</text><path class="edge-green" d="M244 153 L274 153" marker-end="url(#ff-arrow)"></path><path class="edge-green" d="M244 206 L274 178" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-a"><rect class="box-green" height="150" rx="10" width="86" x="394" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 437.0 153)" x="437.0" y="153">Softmax</text><path class="edge-green" d="M362 153 L392 153" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-o"><rect class="box-green" height="150" rx="10" width="86" x="512" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 555.0 153)" x="555.0" y="153">Weighted sum</text><path class="edge-green" d="M480 153 L510 153" marker-end="url(#ff-arrow)"></path><path class="edge-green" d="M244 100 L258 100 L258 64 L555 64 L555 76" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-f"><rect class="box-yellow" height="150" rx="10" width="96" x="630" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 678.0 153)" x="678.0" y="153">Linear</text><path class="edge-green" d="M598 153 L628 153" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-p"><rect class="box-green" height="150" rx="10" width="80" x="758" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 798.0 153)" x="798.0" y="153">Softmax</text><path class="edge-green" d="M726 153 L756 153" marker-end="url(#ff-arrow)"></path></g>
<g data-key="ff-l"><rect class="box-red" height="150" rx="10" width="66" x="870" y="78"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 903.0 153)" x="903.0" y="153">Loss</text><path class="edge-green" d="M838 153 L868 153" marker-end="url(#ff-arrow)"></path></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="ff-x" data-on="ff-x"><div class="step-kicker">Шаг 1 · вход и параметры</div><h4>Что фиксировано на один forward</h4><div class="math-display" data-tex="X\in\mathbb{R}^{3\times2},\qquad W_q,\,W_k,\,W_v\in\mathbb{R}^{2\times2},\qquad W_o\in\mathbb{R}^{2\times2},\ c\in\mathbb{R}^{2}"></div><p>Матрица <span class="math-inline" data-tex="X"></span>, три проекции и классификатор <span class="math-inline" data-tex="W_o,\,c"></span> не меняются.</p></div>
<div class="step-panel" data-focus="ff-qkv" data-on="ff-x ff-qkv"><div class="step-kicker">Шаг 2 · проекции</div><h4>Три матричных умножения</h4><div class="math-display" data-tex="Q=XW_q,\quad K=XW_k,\quad V=XW_v\ \in\mathbb{R}^{3\times2}"></div><p>Одна и та же матрица применяется к каждой строке — к каждому токену.</p></div>
<div class="step-panel" data-focus="ff-s" data-on="ff-qkv ff-s"><div class="step-kicker">Шаг 3 · оценки</div><h4>Попарные скалярные произведения</h4><div class="math-display" data-tex="S=\frac{QK^{\top}}{\sqrt{d_k}},\qquad s_{ij}=\frac{q_i\,k_j^{\top}}{\sqrt{d_k}},\qquad d_k=2"></div><p>Каждая клетка — скалярное произведение одного запроса и одного ключа, делённое на <span class="math-inline" data-tex="\sqrt{d_k}"></span>.</p></div>
<div class="step-panel" data-focus="ff-a" data-on="ff-s ff-a"><div class="step-kicker">Шаг 4 · softmax</div><h4>Нормируем строки</h4><div class="math-display" data-tex="a_{ij}=\dfrac{e^{s_{ij}}}{\sum_{m}e^{s_{im}}}\quad(\text{по строкам})"></div><p>Производная softmax выражается через её собственный выход <span class="math-inline" data-tex="A"></span> — поэтому в backward нужна именно она.</p></div>
<div class="step-panel" data-focus="ff-o" data-on="ff-qkv ff-a ff-o"><div class="step-kicker">Шаг 5 · смесь</div><h4>Взвешенная сумма значений</h4><div class="math-display" data-tex="O=AV,\qquad o_i=\sum_{j}a_{ij}\,v_j"></div><p>Строка <span class="math-inline" data-tex="O"></span> — выпуклая комбинация строк <span class="math-inline" data-tex="V"></span> с весами из соответствующей строки <span class="math-inline" data-tex="A"></span>.</p></div>
<div class="step-panel" data-focus="ff-f" data-on="ff-o ff-f"><div class="step-kicker">Шаг 6 · линейный слой</div><h4>Берём выход CLS</h4><div class="math-display" data-tex="z=o_1W_o+c\in\mathbb{R}^{2}"></div><p>Первая строка <span class="math-inline" data-tex="O"></span> становится вектором <span class="math-inline" data-tex="o_1"></span>, дальше — обычный полносвязный слой.</p></div>
<div class="step-panel" data-focus="ff-p" data-on="ff-f ff-p"><div class="step-kicker">Шаг 7 · softmax</div><h4>Логиты → вероятности</h4><div class="math-display" data-tex="p_k=\dfrac{e^{z_k}}{\sum_j e^{z_j}}"></div><p>Вычитаем максимум для устойчивости и нормируем экспоненты.</p></div>
<div class="step-panel" data-focus="ff-l" data-on="ff-x ff-qkv ff-s ff-a ff-o ff-f ff-p ff-l"><div class="step-kicker">Шаг 8 · loss</div><h4>Минус логарифм правильной вероятности</h4><div class="math-display" data-tex="L=-\log p_2,\qquad y=(0,\,1)\ (\text{класс позитив})"></div><p>Правильный класс — второй; loss тем меньше, чем ближе <span class="math-inline" data-tex="p_2"></span> к единице.</p></div>
</div>
</div>
<p class="stage-hint">Формулы даны в общем виде; в следующей части те же шаги проходят на конкретных числах.</p>
<div class="callout">
<strong>Шесть операций — весь прямой проход.</strong> Проекции и классификатор —
  линейные операции с параметрами; оценки — билинейная форма без параметров; softmax
  и cross-entropy — фиксированные нелинейности. Backward пройдёт эту цепочку справа
  налево, и у <span class="math-inline" data-tex="V"></span> будет свой короткий путь.
</div>
<h3>Тот же forward по элементам матриц</h3>
<p>Тот же полный прогон, но по элементам: <span class="math-inline" data-tex="x_{{i,j}}"></span> вместо чисел. Строка матрицы — один токен. Сверху виден текущий шаг; при «Далее» добавляется следующая матрица.</p>
<div aria-label="Тот же forward по элементам матриц" class="stage" id="stageSF" tabindex="0">
<div class="stage-figure">
<svg aria-label="Forward self-attention по элементам" class="rnn-svg" id="sf-svg" role="img" viewbox="0 0 960 510">
<style>#sf-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="sf-ar" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"></path></marker></defs><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="24.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="77.5" y="36">вход X</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="139.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="192.5" y="36">Q, K, V</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="254.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="307.5" y="36">оценки S</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="369.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="422.5" y="36">внимание A</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="484.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="537.5" y="36">выход O</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="599.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="652.5" y="36">o₁ → z</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="714.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="767.5" y="36">softmax p</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="829.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="882.5" y="36">loss L</text><text fill="#5E5850" font-size="12" text-anchor="middle" x="480" y="62">весь forward по элементам: X → Q, K, V → S → A → O → o₁ → z → p → L</text>
<g data-key="sf-m0" data-only="1"><rect fill="#3576C0" fill-opacity="0.1" height="114" width="96" x="70" y="175"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="118" x2="118" y1="175" y2="289"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="70" x2="166" y1="213" y2="213"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="70" x2="166" y1="251" y2="251"></line><path d="M 69 170 L 63 170 L 63 294 L 69 294" fill="none" stroke="#3576C0" stroke-width="1.8"></path><path d="M 167 170 L 173 170 L 173 294 L 167 294" fill="none" stroke="#3576C0" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="94.0" y="198.6">x<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="142.0" y="198.6">x<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="94.0" y="236.6">x<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="142.0" y="236.6">x<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="94.0" y="274.6">x<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="142.0" y="274.6">x<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="118.0" y="161">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="118.0" y="311">X · 3×2</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="198">&lt;CLS&gt;</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="236">фильм</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="274">хороший</text></g>
<g data-key="sf-a1" data-only="1"><path d="M176 232 L200 126" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M176 232 L200 232" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M176 232 L200 338" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m1" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="72" width="96" x="210" y="90"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="258" x2="258" y1="90" y2="162"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="114" y2="114"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="138" y2="138"></line><path d="M 209 85 L 203 85 L 203 167 L 209 167" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 85 L 313 85 L 313 167 L 307 167" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="106.6">q<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="106.6">q<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="130.6">q<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="130.6">q<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="154.6">q<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="154.6">q<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="76"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="184"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="78">Q = XW_q · 3×2</text><rect fill="#73B222" fill-opacity="0.1" height="72" width="96" x="210" y="196"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="258" x2="258" y1="196" y2="268"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="220" y2="220"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="244" y2="244"></line><path d="M 209 191 L 203 191 L 203 273 L 209 273" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 191 L 313 191 L 313 273 L 307 273" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="212.6">k<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="212.6">k<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="236.6">k<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="236.6">k<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="260.6">k<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="260.6">k<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="182"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="290"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="184">K = XW_k · 3×2</text><rect fill="#73B222" fill-opacity="0.1" height="72" width="96" x="210" y="302"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="258" x2="258" y1="302" y2="374"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="326" y2="326"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="210" x2="306" y1="350" y2="350"></line><path d="M 209 297 L 203 297 L 203 379 L 209 379" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 297 L 313 297 L 313 379 L 307 379" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="318.6">v<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="318.6">v<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="342.6">v<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="342.6">v<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="234.0" y="366.6">v<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="282.0" y="366.6">v<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="288"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="396"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="290">V = XW_v · 3×2</text></g>
<g data-key="sf-a2" data-only="1"><path d="M316 126 L392 160" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M316 232 L392 200" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m2" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="114" width="144" x="400" y="122"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="448" x2="448" y1="122" y2="236"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="496" x2="496" y1="122" y2="236"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="400" x2="544" y1="160" y2="160"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="400" x2="544" y1="198" y2="198"></line><path d="M 399 117 L 393 117 L 393 241 L 399 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 545 117 L 551 117 L 551 241 L 545 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="424.0" y="145.6">s<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="472.0" y="145.6">s<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="520.0" y="145.6">s<tspan dy="4" font-size="10">1,3</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="424.0" y="183.6">s<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="472.0" y="183.6">s<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="520.0" y="183.6">s<tspan dy="4" font-size="10">2,3</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="424.0" y="221.6">s<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="472.0" y="221.6">s<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="520.0" y="221.6">s<tspan dy="4" font-size="10">3,3</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="472.0" y="108">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="472.0" y="258">S = QKᵀ/√2</text></g>
<g data-key="sf-a3" data-only="1"><path d="M552 179 L592 179" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m3" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="114" width="144" x="600" y="122"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="648" x2="648" y1="122" y2="236"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="696" x2="696" y1="122" y2="236"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="600" x2="744" y1="160" y2="160"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="600" x2="744" y1="198" y2="198"></line><path d="M 599 117 L 593 117 L 593 241 L 599 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 745 117 L 751 117 L 751 241 L 745 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="624.0" y="145.6">a<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="672.0" y="145.6">a<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="720.0" y="145.6">a<tspan dy="4" font-size="10">1,3</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="624.0" y="183.6">a<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="672.0" y="183.6">a<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="720.0" y="183.6">a<tspan dy="4" font-size="10">2,3</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="624.0" y="221.6">a<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="672.0" y="221.6">a<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="720.0" y="221.6">a<tspan dy="4" font-size="10">3,3</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="672.0" y="108">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="672.0" y="258">A = softmax(S)</text></g>
<g data-key="sf-a4" data-only="1"><path d="M752 179 L792 179" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-vb" data-only="1"><path d="M320 338 L888 338 L888 248" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-dasharray="6 4" stroke-width="2"></path><text fill="#73B222" font-size="12" text-anchor="middle" x="600" y="330">V идёт в смесь O = A·V в обход оценок</text></g>
<g data-key="sf-m4" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="114" width="96" x="800" y="122"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="848" x2="848" y1="122" y2="236"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="800" x2="896" y1="160" y2="160"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="800" x2="896" y1="198" y2="198"></line><path d="M 799 117 L 793 117 L 793 241 L 799 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 897 117 L 903 117 L 903 241 L 897 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="824.0" y="145.6">o<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="872.0" y="145.6">o<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="824.0" y="183.6">o<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="872.0" y="183.6">o<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="824.0" y="221.6">o<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="872.0" y="221.6">o<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="848.0" y="108">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="848.0" y="258">O = AV</text><rect fill="none" height="38" stroke="#73B222" stroke-width="2.2" width="96" x="800" y="122"></rect></g>
<g data-key="sf-c1" data-only="1"><path d="M904 179 L936 179 L936 390 L20 390 L20 439 L50 439" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m5" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="38" width="96" x="60" y="420"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="108" x2="108" y1="420" y2="458"></line><path d="M 59 415 L 53 415 L 53 463 L 59 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 157 415 L 163 415 L 163 463 L 157 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="84.0" y="443.6">o<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="132.0" y="443.6">o<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="108.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="108.0" y="480">o₁ = строка 1 из O</text></g>
<g data-key="sf-a5" data-only="1"><path d="M164 439 L222 439" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m6" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="38" width="96" x="230" y="420"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="278" x2="278" y1="420" y2="458"></line><path d="M 229 415 L 223 415 L 223 463 L 229 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 327 415 L 333 415 L 333 463 L 327 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="254.0" y="443.6">z<tspan dy="4" font-size="10">1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="302.0" y="443.6">z<tspan dy="4" font-size="10">2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="278.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="278.0" y="480">z = o₁W_o + c</text></g>
<g data-key="sf-a6" data-only="1"><path d="M334 439 L392 439" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m7" data-only="1"><rect fill="#73B222" fill-opacity="0.1" height="38" width="96" x="400" y="420"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="448" x2="448" y1="420" y2="458"></line><path d="M 399 415 L 393 415 L 393 463 L 399 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 497 415 L 503 415 L 503 463 L 497 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="13" text-anchor="middle" x="424.0" y="443.6">p<tspan dy="4" font-size="10">1</tspan></text><text fill="#111" font-size="13" text-anchor="middle" x="472.0" y="443.6">p<tspan dy="4" font-size="10">2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="448.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="448.0" y="480">p = softmax(z)</text></g>
<g data-key="sf-a7" data-only="1"><path d="M504 439 L562 439" fill="none" marker-end="url(#sf-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="sf-m8" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="38" width="80" x="570" y="420"></rect><path d="M 569 415 L 563 415 L 563 463 L 569 463" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 651 415 L 657 415 L 657 463 L 651 463" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="17" text-anchor="middle" x="610.0" y="443.6">L</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="610.0" y="406">loss</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="610.0" y="480">L = −log p₂</text></g>
<g data-key="sf-tab0" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="22.0" y="14"></rect></g>
<g data-key="sf-tab1" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="137.0" y="14"></rect></g>
<g data-key="sf-tab2" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="252.0" y="14"></rect></g>
<g data-key="sf-tab3" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="367.0" y="14"></rect></g>
<g data-key="sf-tab4" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="482.0" y="14"></rect></g>
<g data-key="sf-tab5" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="597.0" y="14"></rect></g>
<g data-key="sf-tab6" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="712.0" y="14"></rect></g>
<g data-key="sf-tab7" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="827.0" y="14"></rect></g>
<g data-key="sf-f0" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="64" y="169"></rect></g>
<g data-key="sf-f1" data-only="1"><rect fill="none" height="320" rx="8" stroke="#D83BB9" stroke-width="2.6" width="132" x="196" y="66"></rect></g>
<g data-key="sf-f2" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="394" y="116"></rect></g>
<g data-key="sf-f3" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="594" y="116"></rect></g>
<g data-key="sf-f4" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="794" y="116"></rect></g>
<g data-key="sf-f5" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="54" y="414"></rect><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="224" y="414"></rect></g>
<g data-key="sf-f6" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="394" y="414"></rect></g>
<g data-key="sf-f7" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="92" x="564" y="414"></rect></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="sf-f0" data-on="sf-m0 sf-tab0 sf-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Матрица X (символьно)</h4><p>Три токена по два числа: <span class="math-inline" data-tex="x_{i,j}"></span> — координата j токена i.</p></div>
<div class="step-panel" data-focus="sf-f1" data-on="sf-m0 sf-a1 sf-m1 sf-tab1 sf-f1"><div class="step-kicker">Шаг 2 · проекции</div><h4>X → Q, K, V</h4><p><span class="math-inline" data-tex="q_{i,j}=\sum_m x_{i,m}W^{q}_{m,j}"></span>, так же для <span class="math-inline" data-tex="k"></span> и <span class="math-inline" data-tex="v"></span>. Три матрицы одной формы 3×2.</p></div>
<div class="step-panel" data-focus="sf-f2" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-tab2 sf-f2"><div class="step-kicker">Шаг 3 · оценки</div><h4>Q, K → S</h4><p><span class="math-inline" data-tex="s_{i,j}=\tfrac{1}{\sqrt2}\sum_m q_{i,m}k_{j,m}"></span> — строка Q на строку K. Выход 3×3.</p></div>
<div class="step-panel" data-focus="sf-f3" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-tab3 sf-f3"><div class="step-kicker">Шаг 4 · softmax</div><h4>S → A</h4><p><span class="math-inline" data-tex="a_{i,j}=\dfrac{e^{s_{i,j}}}{\sum_m e^{s_{i,m}}}"></span> — по строкам. Форма не меняется.</p></div>
<div class="step-panel" data-focus="sf-f4" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-a4 sf-vb sf-m4 sf-tab4 sf-f4"><div class="step-kicker">Шаг 5 · смесь</div><h4>A, V → O</h4><p><span class="math-inline" data-tex="o_{i,m}=\sum_j a_{i,j}v_{j,m}"></span>. Пунктир — значения, пришедшие в обход оценок. Зелёная рамка — строка CLS.</p></div>
<div class="step-panel" data-focus="sf-f5" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-a4 sf-vb sf-m4 sf-c1 sf-m5 sf-a5 sf-m6 sf-tab5 sf-f5"><div class="step-kicker">Шаг 6 · классификатор</div><h4>O → o₁ → z</h4><p>Берём первую строку <span class="math-inline" data-tex="O"></span>; логит <span class="math-inline" data-tex="z_k=\sum_m o_{1,m}W^{o}_{m,k}+c_k"></span>.</p></div>
<div class="step-panel" data-focus="sf-f6" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-a4 sf-vb sf-m4 sf-c1 sf-m5 sf-a5 sf-m6 sf-a6 sf-m7 sf-tab6 sf-f6"><div class="step-kicker">Шаг 7 · softmax</div><h4>z → p</h4><p><span class="math-inline" data-tex="p_k=\dfrac{e^{z_k}}{\sum_j e^{z_j}}"></span> — логиты становятся вероятностями.</p></div>
<div class="step-panel" data-focus="sf-f7" data-on="sf-m0 sf-a1 sf-m1 sf-a2 sf-m2 sf-a3 sf-m3 sf-a4 sf-vb sf-m4 sf-c1 sf-m5 sf-a5 sf-m6 sf-a6 sf-m7 sf-a7 sf-m8 sf-tab7 sf-f7"><div class="step-kicker">Шаг 8 · loss</div><h4>p → L</h4><p><span class="math-inline" data-tex="L=-\log p_2"></span>. Вся сеть — одно число.</p></div>
</div>
</div>
<p class="stage-hint">Полный forward одной головы: X → Q, K, V → S → A → O → o₁ → z → p → L.</p>
<hr/>

<h2 id="attention-part-11">Часть 11. Forward на числах</h2>
<p>
  Теперь те же операции на нашей фразе. Параметры маленькие и заданы вручную, модель
  не обучена. Главное — первая строка <span class="math-inline" data-tex="A"></span>: это распределение внимания токена
  &lt;CLS&gt;. Он смотрит на себя с весом 0,412, на «фильм» — 0,345, на
  «хороший» — 0,243. Только эта строка дойдёт до loss, поэтому подсвечиваем её
  зелёным.
</p>
<div aria-label="Числа прямого прохода" class="stage numeric-stage" id="stageFN" tabindex="0">
<div class="stage-figure">
<svg aria-label="Числа прямого прохода self-attention" class="rnn-svg" id="fn-svg" role="img" viewbox="0 0 960 510">
<style>#fn-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="fn-ar" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#73B222"></path></marker></defs><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="24.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="77.5" y="36">вход X</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="139.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="192.5" y="36">Q, K, V</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="254.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="307.5" y="36">оценки S</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="369.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="422.5" y="36">внимание A</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="484.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="537.5" y="36">выход O</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="599.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="652.5" y="36">o₁ → z</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="714.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="767.5" y="36">softmax p</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="107.0" x="829.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="882.5" y="36">loss L</text><text fill="#5E5850" font-size="12" text-anchor="middle" x="480" y="62">каждый шаг добавляет матрицу; строка — токен, пунктир — путь V в обход оценок</text>
<g data-key="fn-m0" data-only="1"><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="70" y="175"></rect><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="118" y="175"></rect><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="70" y="213"></rect><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="118" y="213"></rect><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="70" y="251"></rect><rect fill="#EAF2FA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="118" y="251"></rect><path d="M 69 170 L 63 170 L 63 294 L 69 294" fill="none" stroke="#3576C0" stroke-width="1.8"></path><path d="M 167 170 L 173 170 L 173 294 L 167 294" fill="none" stroke="#3576C0" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="94.0" y="198.1">1.0</text><text fill="#111" font-size="12" text-anchor="middle" x="142.0" y="198.1">0.0</text><text fill="#111" font-size="12" text-anchor="middle" x="94.0" y="236.1">0.0</text><text fill="#111" font-size="12" text-anchor="middle" x="142.0" y="236.1">1.0</text><text fill="#111" font-size="12" text-anchor="middle" x="94.0" y="274.1">1.0</text><text fill="#111" font-size="12" text-anchor="middle" x="142.0" y="274.1">−1.0</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="118.0" y="161">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="118.0" y="311">X · 3×2</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="198">&lt;CLS&gt;</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="236">фильм</text><text fill="#5E5850" font-size="12" text-anchor="end" x="58" y="274">хороший</text></g>
<g data-key="fn-a1" data-only="1"><path d="M176 232 L200 126" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M176 232 L200 232" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M176 232 L200 338" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m1" data-only="1"><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="90"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="90"></rect><rect fill="#FDECEC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="114"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="114"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="138"></rect><rect fill="#FDECEC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="138"></rect><path d="M 209 85 L 203 85 L 203 167 L 209 167" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 85 L 313 85 L 313 167 L 307 167" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="106.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="106.1">0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="130.1">−0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="130.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="154.1">1.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="154.1">−0.500</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="76"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="184"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="78">Q = XW_q · 3×2</text><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="196"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="196"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="220"></rect><rect fill="#FDECEC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="220"></rect><rect fill="#FDECEC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="244"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="244"></rect><path d="M 209 191 L 203 191 L 203 273 L 209 273" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 191 L 313 191 L 313 273 L 307 273" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="212.1">0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="212.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="236.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="236.1">−0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="260.1">−0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="260.1">1.500</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="182"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="290"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="184">K = XW_k · 3×2</text><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="302"></rect><rect fill="#F4F3EF" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="302"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="326"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="326"></rect><rect fill="#E8F3DC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="210" y="350"></rect><rect fill="#FDECEC" height="24" stroke="#C9C2B8" stroke-width="1" width="48" x="258" y="350"></rect><path d="M 209 297 L 203 297 L 203 379 L 209 379" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 307 297 L 313 297 L 313 379 L 307 379" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="318.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="318.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="342.1">0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="342.1">1.000</text><text fill="#111" font-size="12" text-anchor="middle" x="234.0" y="366.1">0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="282.0" y="366.1">−1.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="258.0" y="288"></text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="258.0" y="396"></text><text fill="#111" font-size="13" font-weight="700" text-anchor="middle" x="258" y="290">V = XW_v · 3×2</text></g>
<g data-key="fn-a2" data-only="1"><path d="M316 126 L392 160" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path><path d="M316 232 L392 200" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m2" data-only="1"><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="400" y="122"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="448" y="122"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="496" y="122"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="400" y="160"></rect><rect fill="#FDECEC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="448" y="160"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="496" y="160"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="400" y="198"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="448" y="198"></rect><rect fill="#FDECEC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="496" y="198"></rect><path d="M 399 117 L 393 117 L 393 241 L 399 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 545 117 L 551 117 L 551 241 L 545 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="424.0" y="145.1">0.707</text><text fill="#111" font-size="12" text-anchor="middle" x="472.0" y="145.1">0.530</text><text fill="#111" font-size="12" text-anchor="middle" x="520.0" y="145.1">0.177</text><text fill="#111" font-size="12" text-anchor="middle" x="424.0" y="183.1">0.530</text><text fill="#111" font-size="12" text-anchor="middle" x="472.0" y="183.1">−0.707</text><text fill="#111" font-size="12" text-anchor="middle" x="520.0" y="183.1">1.237</text><text fill="#111" font-size="12" text-anchor="middle" x="424.0" y="221.1">0.177</text><text fill="#111" font-size="12" text-anchor="middle" x="472.0" y="221.1">1.237</text><text fill="#111" font-size="12" text-anchor="middle" x="520.0" y="221.1">−1.061</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="472.0" y="108">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="472.0" y="258">S = QKᵀ/√2</text></g>
<g data-key="fn-a3" data-only="1"><path d="M552 179 L592 179" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m3" data-only="1"><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="600" y="122"></rect><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="648" y="122"></rect><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="696" y="122"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="600" y="160"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="648" y="160"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="696" y="160"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="600" y="198"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="648" y="198"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="696" y="198"></rect><path d="M 599 117 L 593 117 L 593 241 L 599 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 745 117 L 751 117 L 751 241 L 745 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="624.0" y="145.1">0.412</text><text fill="#111" font-size="12" text-anchor="middle" x="672.0" y="145.1">0.345</text><text fill="#111" font-size="12" text-anchor="middle" x="720.0" y="145.1">0.243</text><text fill="#111" font-size="12" text-anchor="middle" x="624.0" y="183.1">0.301</text><text fill="#111" font-size="12" text-anchor="middle" x="672.0" y="183.1">0.087</text><text fill="#111" font-size="12" text-anchor="middle" x="720.0" y="183.1">0.611</text><text fill="#111" font-size="12" text-anchor="middle" x="624.0" y="221.1">0.239</text><text fill="#111" font-size="12" text-anchor="middle" x="672.0" y="221.1">0.691</text><text fill="#111" font-size="12" text-anchor="middle" x="720.0" y="221.1">0.069</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="672.0" y="108">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="672.0" y="258">A = softmax(S)</text></g>
<g data-key="fn-a4" data-only="1"><path d="M752 179 L792 179" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-vb" data-only="1"><path d="M320 338 L888 338 L888 248" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-dasharray="6 4" stroke-width="2"></path><text fill="#73B222" font-size="12" text-anchor="middle" x="600" y="330">V идёт в смесь O = A·V в обход оценок</text></g>
<g data-key="fn-m4" data-only="1"><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="800" y="122"></rect><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="848" y="122"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="800" y="160"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="848" y="160"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="800" y="198"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="848" y="198"></rect><path d="M 799 117 L 793 117 L 793 241 L 799 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 897 117 L 903 117 L 903 241 L 897 241" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="824.0" y="145.1">0.706</text><text fill="#111" font-size="12" text-anchor="middle" x="872.0" y="145.1">0.103</text><text fill="#111" font-size="12" text-anchor="middle" x="824.0" y="183.1">0.651</text><text fill="#111" font-size="12" text-anchor="middle" x="872.0" y="183.1">−0.524</text><text fill="#111" font-size="12" text-anchor="middle" x="824.0" y="221.1">0.620</text><text fill="#111" font-size="12" text-anchor="middle" x="872.0" y="221.1">0.622</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="848.0" y="108">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="848.0" y="258">O = AV</text></g>
<g data-key="fn-c1" data-only="1"><path d="M904 179 L936 179 L936 390 L20 390 L20 439 L50 439" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m5" data-only="1"><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="60" y="420"></rect><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="108" y="420"></rect><path d="M 59 415 L 53 415 L 53 463 L 59 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 157 415 L 163 415 L 163 463 L 157 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="443.1">0.706</text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="443.1">0.103</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="108.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="108.0" y="480">o₁ = строка 1 из O</text></g>
<g data-key="fn-a5" data-only="1"><path d="M164 439 L222 439" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m6" data-only="1"><rect fill="#FDECEC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="230" y="420"></rect><rect fill="#E8F3DC" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="278" y="420"></rect><path d="M 229 415 L 223 415 L 223 463 L 229 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 327 415 L 333 415 L 333 463 L 327 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="254.0" y="443.1">−0.250</text><text fill="#111" font-size="12" text-anchor="middle" x="302.0" y="443.1">0.302</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="278.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="278.0" y="480">z = o₁W_o + c</text></g>
<g data-key="fn-a6" data-only="1"><path d="M334 439 L392 439" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m7" data-only="1"><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="400" y="420"></rect><rect fill="#CDEBAA" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="448" y="420"></rect><path d="M 399 415 L 393 415 L 393 463 L 399 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 497 415 L 503 415 L 503 463 L 497 463" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="424.0" y="443.1">0.365</text><text fill="#111" font-size="12" text-anchor="middle" x="472.0" y="443.1">0.635</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="448.0" y="406">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="448.0" y="480">p = softmax(z)</text></g>
<g data-key="fn-a7" data-only="1"><path d="M504 439 L562 439" fill="none" marker-end="url(#fn-ar)" stroke="#73B222" stroke-width="2.2"></path></g>
<g data-key="fn-m8" data-only="1"><rect fill="#FDECEC" height="38" stroke="#C9C2B8" stroke-width="1" width="80" x="570" y="420"></rect><path d="M 569 415 L 563 415 L 563 463 L 569 463" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 651 415 L 657 415 L 657 463 L 651 463" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="610.0" y="443.1">0.4548</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="610.0" y="406">loss</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="610.0" y="480">L = −log p₂</text></g>
<g data-key="fn-tab0" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="22.0" y="14"></rect></g>
<g data-key="fn-tab1" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="137.0" y="14"></rect></g>
<g data-key="fn-tab2" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="252.0" y="14"></rect></g>
<g data-key="fn-tab3" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="367.0" y="14"></rect></g>
<g data-key="fn-tab4" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="482.0" y="14"></rect></g>
<g data-key="fn-tab5" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="597.0" y="14"></rect></g>
<g data-key="fn-tab6" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="712.0" y="14"></rect></g>
<g data-key="fn-tab7" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="111.0" x="827.0" y="14"></rect></g>
<g data-key="fn-f0" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="64" y="169"></rect></g>
<g data-key="fn-f1" data-only="1"><rect fill="none" height="320" rx="8" stroke="#D83BB9" stroke-width="2.6" width="132" x="196" y="66"></rect></g>
<g data-key="fn-f2" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="394" y="116"></rect></g>
<g data-key="fn-f3" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="594" y="116"></rect></g>
<g data-key="fn-f4" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="794" y="116"></rect></g>
<g data-key="fn-f5" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="54" y="414"></rect><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="224" y="414"></rect></g>
<g data-key="fn-f6" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="394" y="414"></rect></g>
<g data-key="fn-f7" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="92" x="564" y="414"></rect></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="fn-f0" data-on="fn-m0 fn-tab0 fn-f0"><div class="step-kicker">Шаг 1 · вход</div><h4>Эмбеддинги и проекции</h4><div class="math-display" data-tex="X=\begin{bmatrix}1&0\\0&1\\1&-1\end{bmatrix}\begin{matrix}\leftarrow \langle\text{CLS}\rangle\\ \leftarrow \text{фильм}\\ \leftarrow \text{хороший}\end{matrix}"></div><div class="math-display" data-tex="W_q=\begin{bmatrix}1{,}0&0{,}5\\-0{,}5&1{,}0\end{bmatrix},\quad W_k=\begin{bmatrix}0{,}5&1{,}0\\1{,}0&-0{,}5\end{bmatrix},\quad W_v=\begin{bmatrix}1{,}0&0\\0{,}5&1{,}0\end{bmatrix}"></div><p>Эмбеддинги иллюстративные: у CLS вторая координата нулевая — это ещё сыграет роль в backward.</p></div>
<div class="step-panel" data-focus="fn-f1" data-on="fn-m0 fn-a1 fn-m1 fn-tab1 fn-f1"><div class="step-kicker">Шаг 2 · проекции</div><h4>Запросы, ключи, значения</h4><div class="math-display" data-tex="Q=\begin{bmatrix}1{,}0&0{,}5\\-0{,}5&1{,}0\\1{,}5&-0{,}5\end{bmatrix},\quad K=\begin{bmatrix}0{,}5&1{,}0\\1{,}0&-0{,}5\\-0{,}5&1{,}5\end{bmatrix},\quad V=\begin{bmatrix}1{,}0&0\\0{,}5&1{,}0\\0{,}5&-1{,}0\end{bmatrix}"></div><p>Первая строка каждой матрицы — это первая строка <span class="math-inline" data-tex="W"></span>: <span class="math-inline" data-tex="x_1=(1;\,0)"></span> просто её выбирает.</p></div>
<div class="step-panel" data-focus="fn-f2" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-tab2 fn-f2"><div class="step-kicker">Шаг 3 · оценки</div><h4>Девять скалярных произведений</h4><div class="math-display" data-tex="S=\frac{QK^{\top}}{\sqrt{2}}=\begin{bmatrix}0{,}7071&0{,}5303&0{,}1768\\0{,}5303&-0{,}7071&1{,}2374\\0{,}1768&1{,}2374&-1{,}0607\end{bmatrix}"></div><p>Первая строка — насколько CLS подходит каждый ключ; самая большая оценка — у самого CLS.</p></div>
<div class="step-panel" data-focus="fn-f3" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-tab3 fn-f3"><div class="step-kicker">Шаг 4 · softmax</div><h4>Веса внимания</h4><div class="math-display" data-tex="A=\operatorname{softmax}_{\text{строк}}(S)=\begin{bmatrix}0{,}4121&0{,}3454&0{,}2425\\0{,}3014&0{,}0874&0{,}6112\\0{,}2393&0{,}6912&0{,}0694\end{bmatrix}"></div><p>Каждая строка в сумме даёт 1. Строка CLS довольно плоская: 0,412, 0,345, 0,243.</p></div>
<div class="step-panel" data-focus="fn-f4" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-a4 fn-vb fn-m4 fn-tab4 fn-f4"><div class="step-kicker">Шаг 5 · смесь</div><h4>Выход CLS</h4><div class="math-display" data-tex="o_1=0{,}4121\,v_1+0{,}3454\,v_2+0{,}2425\,v_3=\left(0{,}7061;\ 0{,}1029\right),\qquad O=\begin{bmatrix}0{,}7061&0{,}1029\\0{,}6507&-0{,}5238\\0{,}6197&0{,}6218\end{bmatrix}"></div><p>Выход CLS — смесь всех трёх значений. Две другие строки тоже посчитаны, но в классификатор не пойдут.</p></div>
<div class="step-panel" data-focus="fn-f5" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-a4 fn-vb fn-m4 fn-c1 fn-m5 fn-a5 fn-m6 fn-tab5 fn-f5"><div class="step-kicker">Шаг 6 · линейный слой</div><h4>Два логита</h4><div class="math-display" data-tex="W_o=\begin{bmatrix}-0{,}5&0{,}5\\1{,}0&-0{,}5\end{bmatrix},\ c=\left(0;\ 0\right)\ \Rightarrow\ z=\left(-0{,}2502;\ 0{,}3016\right)"></div><p>Второй логит выше первого — модель уже склоняется к позитиву.</p></div>
<div class="step-panel" data-focus="fn-f6" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-a4 fn-vb fn-m4 fn-c1 fn-m5 fn-a5 fn-m6 fn-a6 fn-m7 fn-tab6 fn-f6"><div class="step-kicker">Шаг 7 · softmax</div><h4>Вероятности классов</h4><div class="math-display" data-tex="p=\operatorname{softmax}(z)=\left(0{,}3654;\ 0{,}6346\right)"></div><p>Правильному классу достаётся 0,6346.</p></div>
<div class="step-panel" data-focus="fn-f7" data-on="fn-m0 fn-a1 fn-m1 fn-a2 fn-m2 fn-a3 fn-m3 fn-a4 fn-vb fn-m4 fn-c1 fn-m5 fn-a5 fn-m6 fn-a6 fn-m7 fn-a7 fn-m8 fn-tab7 fn-f7"><div class="step-kicker">Шаг 8 · loss</div><h4>Одно число</h4><div class="math-display" data-tex="L=-\log 0{,}6346=0{,}4548"></div><p>Модель склоняется к верному ответу, но неуверенно: loss заметно больше нуля.</p></div>
</div>
</div>
<p class="stage-hint">Числа в матрицах и формулах согласованы: и то, и другое посчитано одним скриптом, округление — только при выводе.</p>
<div class="callout">
<strong>Из трёх строк A до loss доходит одна.</strong> Только распределение
  внимания токена CLS влияет на ответ; строки «фильм» и «хороший» посчитаны, но в
  классификатор не попали. При этом в первой строке участвуют ключи и значения всех
  трёх токенов — это и определит, куда пойдёт градиент.
</div>
<hr/>

<h2 id="attention-part-12">Часть 12. Что forward обязан запомнить</h2>
<p>
  Backward — это цепное правило, применённое по блокам справа налево. Чтобы
  посчитать локальную производную каждого блока, нужны величины, вычисленные в
  forward.
</p>
<table class="shape-table">
<thead><tr><th>Что помним</th><th>Форма</th><th>Зачем в backward</th></tr></thead>
<tbody>
<tr><td><code>X</code></td><td><code>3×2</code></td><td>для <code>dW_q, dW_k, dW_v = Xᵀ·(dQ, dK, dV)</code></td></tr>
<tr><td><code>Q</code>, <code>K</code></td><td><code>3×2</code></td><td>друг для друга: <code>dQ = dS·K/√d</code>, <code>dK = dSᵀ·Q/√d</code></td></tr>
<tr><td><code>V</code></td><td><code>3×2</code></td><td>для <code>dA = dO·Vᵀ</code></td></tr>
<tr><td><code>A</code> (softmax)</td><td><code>3×3</code></td><td>для якобиана softmax и для <code>dV = Aᵀ·dO</code></td></tr>
<tr><td><code>o₁</code></td><td><code>2</code></td><td>для <code>dW_o = o₁ᵀ·dz</code></td></tr>
<tr><td><code>p</code> (softmax)</td><td><code>2</code></td><td>для <code>dz = p − y</code></td></tr>
</tbody>
</table>
<div class="math-display" data-tex="\frac{\partial L}{\partial z}=p-y,\qquad \frac{\partial L}{\partial A}=\frac{\partial L}{\partial O}V^{\top},\qquad \frac{\partial L}{\partial s_{ij}}=a_{ij}\Bigl(\frac{\partial L}{\partial a_{ij}}-\sum_m a_{im}\frac{\partial L}{\partial a_{im}}\Bigr)"></div>
<div class="callout-blue">
<strong>Память растёт как T².</strong> Матрица <span class="math-inline" data-tex="A"></span> для фразы из T токенов
  занимает T×T чисел, и её нужно хранить до backward. Именно это ограничивает длину
  контекста трансформеров и мотивирует приёмы вроде FlashAttention, которые
  пересчитывают <span class="math-inline" data-tex="A"></span> в backward вместо хранения.
</div>
<hr/>

<h2 id="attention-part-13">Часть 13. Backward в формулах</h2>
<p>
  Идём справа налево. Softmax с cross-entropy дают «предсказание минус правда»;
  линейный слой отдаёт градиент выходу CLS. Дальше развилка: <span class="math-inline" data-tex="dO"></span> расходится на
  <span class="math-inline" data-tex="dA"></span> через оценки и на <span class="math-inline" data-tex="dV"></span> напрямую. Самый интересный шаг — softmax по
  строке: её якобиан вычитает взвешенное среднее.
</p>
<div aria-label="Backward self-attention в формулах" class="stage" id="stageBF" tabindex="0">
<div class="stage-figure">
<svg aria-label="Обратный проход через self-attention" class="rnn-svg" id="bf-svg" role="img" viewbox="0 0 960 260">
<style>#bf-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="bf-arrow" markerheight="8" markerwidth="8" orient="auto" refx="6" refy="4.0"><path d="M0,0 L8,4.0 L0,8 Z" fill="#C30B0A"></path></marker></defs>
<text class="v-title" x="30" y="38">Backward: локальная производная каждого блока</text>
<text class="v-small" x="30" y="58">Красные стрелки идут справа налево; верхняя — градиент значений в обход оценок.</text>
<g data-key="bf-l"><rect class="box-red" height="150" rx="10" width="66" x="870" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 903.0 159)" x="903.0" y="159">Loss</text><path class="edge-red" d="M868 159 L840 159" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-p"><rect class="box-green" height="150" rx="10" width="80" x="758" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 798.0 159)" x="798.0" y="159">Softmax</text><path class="edge-red" d="M756 159 L728 159" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-f"><rect class="box-yellow" height="150" rx="10" width="96" x="630" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 678.0 159)" x="678.0" y="159">Linear</text><path class="edge-red" d="M628 159 L600 159" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-o"><rect class="box-green" height="150" rx="10" width="86" x="512" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 555.0 159)" x="555.0" y="159">Weighted sum</text><path class="edge-red" d="M510 159 L482 159" marker-end="url(#bf-arrow)"></path><path class="edge-red" d="M555 82 L555 70 L258 70 L258 106 L246 106" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-a"><rect class="box-green" height="150" rx="10" width="86" x="394" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 437.0 159)" x="437.0" y="159">Softmax</text><path class="edge-red" d="M392 159 L364 159" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-s"><rect class="box-green" height="150" rx="10" width="86" x="276" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 319.0 159)" x="319.0" y="159">Scores</text><path class="edge-red" d="M274 159 L246 159" marker-end="url(#bf-arrow)"></path><path class="edge-red" d="M274 184 L246 212" marker-end="url(#bf-arrow)"></path></g>
<g data-key="bf-qkv"><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="84"></rect><text class="layer-name" text-anchor="middle" x="189" y="111">V = XW_v</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="137"></rect><text class="layer-name" text-anchor="middle" x="189" y="164">Q = XW_q</text><rect class="box-yellow" height="44" rx="10" width="110" x="134" y="190"></rect><text class="layer-name" text-anchor="middle" x="189" y="217">K = XW_k</text></g>
<g data-key="bf-x"><rect class="box-blue" height="150" rx="10" width="84" x="24" y="84"></rect><text class="layer-name" text-anchor="middle" transform="rotate(-90 66.0 159)" x="66.0" y="159">Input</text><path class="edge-red" d="M132 159 L110 159" marker-end="url(#bf-arrow)"></path></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="bf-p" data-on="bf-l bf-p"><div class="step-kicker">Шаг 1 · softmax + CE</div><h4>Предсказание минус правда</h4><div class="math-display" data-tex="dz=\dfrac{\partial L}{\partial z}=p-y"></div><p>Самый простой градиент во всей сети: разность распределения и one-hot метки.</p></div>
<div class="step-panel" data-focus="bf-f" data-on="bf-p bf-f"><div class="step-kicker">Шаг 2 · линейный слой</div><h4>Градиент приходит только в o₁</h4><div class="math-display" data-tex="dW_o=o_1^{\top}dz,\quad dc=dz,\quad do_1=dz\,W_o^{\top},\quad dO=\begin{bmatrix}do_1\\0\\0\end{bmatrix}"></div><p><span class="math-inline" data-tex="dW_o"></span> — внешнее произведение, <span class="math-inline" data-tex="dc"></span> — сам вектор, <span class="math-inline" data-tex="do_1"></span> уходит назад. Остальные строки <span class="math-inline" data-tex="dO"></span> — нули: их выходы не использовались.</p></div>
<div class="step-panel" data-focus="bf-o" data-on="bf-f bf-o"><div class="step-kicker">Шаг 3 · смесь</div><h4>Развилка: dA и dV</h4><div class="math-display" data-tex="dA=dO\,V^{\top},\qquad dV=A^{\top}dO"></div><p><span class="math-inline" data-tex="O=AV"></span> линейна и по <span class="math-inline" data-tex="A"></span>, и по <span class="math-inline" data-tex="V"></span>, поэтому градиент расходится на две ветки. <span class="math-inline" data-tex="dV"></span> уходит к проекциям напрямую, минуя softmax.</p></div>
<div class="step-panel" data-focus="bf-a" data-on="bf-o bf-a"><div class="step-kicker">Шаг 4 · softmax</div><h4>Вычитаем взвешенное среднее</h4><div class="math-display" data-tex="ds_{ij}=a_{ij}\Bigl(da_{ij}-\sum_{m}a_{im}\,da_{im}\Bigr)"></div><p>Внутри строки каждый вес зависит от всех оценок. Итог: <span class="math-inline" data-tex="ds_{ij}"></span> — вес, умноженный на отклонение <span class="math-inline" data-tex="da_{ij}"></span> от среднего по строке. Строка <span class="math-inline" data-tex="dS"></span> всегда суммируется в ноль.</p></div>
<div class="step-panel" data-focus="bf-s" data-on="bf-a bf-s"><div class="step-kicker">Шаг 5 · оценки</div><h4>Запросы и ключи обмениваются градиентом</h4><div class="math-display" data-tex="dQ=\frac{dS\,K}{\sqrt{d_k}},\qquad dK=\frac{dS^{\top}Q}{\sqrt{d_k}}"></div><p><span class="math-inline" data-tex="dQ"></span> получает ключи, <span class="math-inline" data-tex="dK"></span> — запросы. <span class="math-inline" data-tex="dQ"></span> берёт строки <span class="math-inline" data-tex="dS"></span>, <span class="math-inline" data-tex="dK"></span> — столбцы.</p></div>
<div class="step-panel" data-focus="bf-qkv" data-on="bf-s bf-qkv"><div class="step-kicker">Шаг 6 · проекции</div><h4>Общая матрица — сумма по токенам</h4><div class="math-display" data-tex="dW_q=X^{\top}dQ,\quad dW_k=X^{\top}dK,\quad dW_v=X^{\top}dV"></div><p>Каждая проекция применялась ко всем трём токенам, поэтому её градиент — сумма трёх вкладов, записанная как <span class="math-inline" data-tex="X^{\top}dQ"></span>.</p></div>
<div class="step-panel" data-focus="bf-x" data-on="bf-qkv bf-x"><div class="step-kicker">Шаг 7 · градиент по входу</div><h4>Три потока к эмбеддингам</h4><div class="math-display" data-tex="dX=dQ\,W_q^{\top}+dK\,W_k^{\top}+dV\,W_v^{\top}"></div><p>Нужен, если эмбеддинги обучаются или перед вниманием есть слои. Токен получает градиент как запрос, как ключ и как значение.</p></div>
</div>
</div>
<p class="stage-hint">Каждый шаг — одна локальная производная; ниже те же шаги проходят на числах нашего объекта.</p>
<div class="callout">
<strong>Backward — та же цепочка наоборот, но с развилкой.</strong> Разность
  <span class="math-inline" data-tex="p-y"></span> стартует градиент, softmax по строке превращает <span class="math-inline" data-tex="dA"></span> в <span class="math-inline" data-tex="dS"></span>
  вычитанием среднего, а <span class="math-inline" data-tex="V"></span> получает свой градиент напрямую, минуя оценки. К
  входу <span class="math-inline" data-tex="X"></span> сходятся три потока — через <span class="math-inline" data-tex="Q"></span>, <span class="math-inline" data-tex="K"></span> и <span class="math-inline" data-tex="V"></span>.
</div>
<h3>Те же градиенты по элементам матриц</h3>
<p>Полный обратный проход по элементам. Строка — токен; сверху — текущий шаг; при «Далее» добавляется следующая матрица градиента.</p>
<div aria-label="Те же градиенты по элементам матриц" class="stage" id="stageSB" tabindex="0">
<div class="stage-figure">
<svg aria-label="Backward self-attention по элементам" class="rnn-svg" id="sb-svg" role="img" viewbox="0 0 960 520">
<style>#sb-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="sb-ar" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"></path></marker><marker id="sb-arb" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#3576C0"></path></marker></defs><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="24.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="96.7" y="36">dz, dW_o</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="177.3" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="250.0" y="36">dO</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="330.7" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="403.3" y="36">dA и dV</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="484.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="556.7" y="36">dS (softmax)</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="637.3" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="710.0" y="36">dQ, dK</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="790.7" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="863.3" y="36">dW_q, dW_k, dW_v</text><text fill="#5E5850" font-size="12" text-anchor="middle" x="480" y="62">весь backward по элементам: dz → dO → dA → dS → dQ, dK; ветка dO → dV идёт мимо softmax</text>
<g data-key="sb-m0" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="38" width="96" x="40" y="138"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="88" x2="88" y1="138" y2="176"></line><path d="M 39 133 L 33 133 L 33 181 L 39 181" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 137 133 L 143 133 L 143 181 L 137 181" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="64.0" y="161.6">dz<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="112.0" y="161.6">dz<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="88.0" y="124">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="88.0" y="198">dz = p − y</text></g>
<g data-key="sb-a1" data-only="1"><path d="M144 157 L192 157" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="sb-m1" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="96" x="200" y="100"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="248" x2="248" y1="100" y2="214"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="200" x2="296" y1="138" y2="138"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="200" x2="296" y1="176" y2="176"></line><path d="M 199 95 L 193 95 L 193 219 L 199 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 297 95 L 303 95 L 303 219 L 297 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="123.6">do<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="123.6">do<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="161.6">do<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="161.6">do<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="199.6">do<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="199.6">do<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="248.0" y="86">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="248.0" y="236">dO: живёт строка 1</text></g>
<g data-key="sb-a2" data-only="1"><path d="M304 157 L352 157" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="sb-m2" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="144" x="360" y="100"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="408" x2="408" y1="100" y2="214"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="456" x2="456" y1="100" y2="214"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="360" x2="504" y1="138" y2="138"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="360" x2="504" y1="176" y2="176"></line><path d="M 359 95 L 353 95 L 353 219 L 359 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 505 95 L 511 95 L 511 219 L 505 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="123.6">da<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="123.6">da<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="123.6">da<tspan dy="4" font-size="10">1,3</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="161.6">da<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="161.6">da<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="161.6">da<tspan dy="4" font-size="10">2,3</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="199.6">da<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="199.6">da<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="199.6">da<tspan dy="4" font-size="10">3,3</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="432.0" y="86">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="432.0" y="236">dA = dO·Vᵀ</text></g>
<g data-key="sb-vb" data-only="1"><path d="M280 246 L280 318 L400 318 L400 342" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-dasharray="6 4" stroke-width="2"></path><text fill="#C30B0A" font-size="12" text-anchor="middle" x="344" y="310">dV = Aᵀ·dO</text></g>
<g data-key="sb-mV" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="96" x="320" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="368" x2="368" y1="350" y2="464"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="320" x2="416" y1="388" y2="388"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="320" x2="416" y1="426" y2="426"></line><path d="M 319 345 L 313 345 L 313 469 L 319 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 417 345 L 423 345 L 423 469 L 417 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="373.6">dv<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="373.6">dv<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="411.6">dv<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="411.6">dv<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="449.6">dv<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="449.6">dv<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="368.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="368.0" y="486">dV = Aᵀ·dO</text></g>
<g data-key="sb-a3" data-only="1"><path d="M512 157 L560 157" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="sb-m3" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="144" x="568" y="100"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="616" x2="616" y1="100" y2="214"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="664" x2="664" y1="100" y2="214"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="568" x2="712" y1="138" y2="138"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="568" x2="712" y1="176" y2="176"></line><path d="M 567 95 L 561 95 L 561 219 L 567 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 713 95 L 719 95 L 719 219 L 713 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="123.6">ds<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="123.6">ds<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="123.6">ds<tspan dy="4" font-size="10">1,3</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="161.6">ds<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="161.6">ds<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="161.6">ds<tspan dy="4" font-size="10">2,3</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="199.6">ds<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="199.6">ds<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="199.6">ds<tspan dy="4" font-size="10">3,3</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="640.0" y="86">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="640.0" y="236">dS (softmax по строкам)</text></g>
<g data-key="sb-c1" data-only="1"><path d="M720 157 L930 157 L930 505 L20 505 L20 407 L50 407" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="sb-mQK" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="96" x="60" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="108" x2="108" y1="350" y2="464"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="60" x2="156" y1="388" y2="388"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="60" x2="156" y1="426" y2="426"></line><path d="M 59 345 L 53 345 L 53 469 L 59 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 157 345 L 163 345 L 163 469 L 157 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="373.6">dq<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="373.6">dq<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="411.6">dq<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="411.6">dq<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="449.6">dq<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="449.6">dq<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="108.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="108.0" y="486">dQ = dS·K/√2</text><rect fill="#C30B0A" fill-opacity="0.12" height="114" width="96" x="190" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="238" x2="238" y1="350" y2="464"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="190" x2="286" y1="388" y2="388"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="190" x2="286" y1="426" y2="426"></line><path d="M 189 345 L 183 345 L 183 469 L 189 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 287 345 L 293 345 L 293 469 L 287 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="373.6">dk<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="373.6">dk<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="411.6">dk<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="411.6">dk<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="449.6">dk<tspan dy="4" font-size="10">3,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="449.6">dk<tspan dy="4" font-size="10">3,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="238.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="238.0" y="486">dK = dSᵀ·Q/√2</text></g>
<g data-key="sb-a5" data-only="1"><path d="M436 388 L488 388" fill="none" marker-end="url(#sb-ar)" stroke="#C30B0A" stroke-width="2.2"></path><text fill="#3576C0" font-size="12" text-anchor="middle" x="462" y="378">Xᵀ ·</text></g>
<g data-key="sb-mW" data-only="1"><rect fill="#C30B0A" fill-opacity="0.12" height="76" width="96" x="500" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="548" x2="548" y1="350" y2="426"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="500" x2="596" y1="388" y2="388"></line><path d="M 499 345 L 493 345 L 493 431 L 499 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 597 345 L 603 345 L 603 431 L 597 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="524.0" y="373.6">dW<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="572.0" y="373.6">dW<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="524.0" y="411.6">dW<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="572.0" y="411.6">dW<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="548.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="548.0" y="448">dW_q = XᵀdQ</text><rect fill="#C30B0A" fill-opacity="0.12" height="76" width="96" x="630" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="678" x2="678" y1="350" y2="426"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="630" x2="726" y1="388" y2="388"></line><path d="M 629 345 L 623 345 L 623 431 L 629 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 727 345 L 733 345 L 733 431 L 727 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="654.0" y="373.6">dW<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="702.0" y="373.6">dW<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="654.0" y="411.6">dW<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="702.0" y="411.6">dW<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="678.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="678.0" y="448">dW_k = XᵀdK</text><rect fill="#C30B0A" fill-opacity="0.12" height="76" width="96" x="760" y="350"></rect><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="808" x2="808" y1="350" y2="426"></line><line stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="1" x1="760" x2="856" y1="388" y2="388"></line><path d="M 759 345 L 753 345 L 753 431 L 759 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 857 345 L 863 345 L 863 431 L 857 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="784.0" y="373.6">dW<tspan dy="4" font-size="10">1,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="832.0" y="373.6">dW<tspan dy="4" font-size="10">1,2</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="784.0" y="411.6">dW<tspan dy="4" font-size="10">2,1</tspan></text><text fill="#111" font-size="12" text-anchor="middle" x="832.0" y="411.6">dW<tspan dy="4" font-size="10">2,2</tspan></text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="808.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="808.0" y="448">dW_v = XᵀdV</text></g>
<g data-key="sb-tab0" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="22.0" y="14"></rect></g>
<g data-key="sb-tab1" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="175.3" y="14"></rect></g>
<g data-key="sb-tab2" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="328.7" y="14"></rect></g>
<g data-key="sb-tab3" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="482.0" y="14"></rect></g>
<g data-key="sb-tab4" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="635.3" y="14"></rect></g>
<g data-key="sb-tab5" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="788.7" y="14"></rect></g>
<g data-key="sb-f0" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="34" y="132"></rect></g>
<g data-key="sb-f1" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="194" y="94"></rect></g>
<g data-key="sb-f2" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="354" y="94"></rect><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="314" y="344"></rect></g>
<g data-key="sb-f3" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="562" y="94"></rect></g>
<g data-key="sb-f4" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="54" y="344"></rect><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="184" y="344"></rect></g>
<g data-key="sb-f5" data-only="1"><rect fill="none" height="96" rx="8" stroke="#D83BB9" stroke-width="2.6" width="384" x="486" y="340"></rect></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="sb-f0" data-on="sb-m0 sb-tab0 sb-f0"><div class="step-kicker">Шаг 1 · выход</div><h4>dz</h4><p><span class="math-inline" data-tex="dz=p-y"></span>; отсюда же <span class="math-inline" data-tex="dW_o=o_1^{\top}dz"></span> и <span class="math-inline" data-tex="dc=dz"></span>.</p></div>
<div class="step-panel" data-focus="sb-f1" data-on="sb-m0 sb-a1 sb-m1 sb-tab1 sb-f1"><div class="step-kicker">Шаг 2 · линейный</div><h4>dz → dO</h4><p><span class="math-inline" data-tex="do_{1,m}=\sum_k dz_kW^{o}_{m,k}"></span>; строки 2 и 3 матрицы <span class="math-inline" data-tex="dO"></span> — нули.</p></div>
<div class="step-panel" data-focus="sb-f2" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-vb sb-mV sb-tab2 sb-f2"><div class="step-kicker">Шаг 3 · смесь</div><h4>dO → dA и dV</h4><p><span class="math-inline" data-tex="da_{i,j}=\sum_m do_{i,m}v_{j,m}"></span> и <span class="math-inline" data-tex="dv_{j,m}=\sum_i a_{i,j}do_{i,m}"></span>. Пунктир — ветка значений в обход softmax.</p></div>
<div class="step-panel" data-focus="sb-f3" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-vb sb-mV sb-a3 sb-m3 sb-tab3 sb-f3"><div class="step-kicker">Шаг 4 · softmax</div><h4>dA → dS</h4><p><span class="math-inline" data-tex="ds_{i,j}=a_{i,j}\bigl(da_{i,j}-\sum_m a_{i,m}da_{i,m}\bigr)"></span> — по строкам.</p></div>
<div class="step-panel" data-focus="sb-f4" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-vb sb-mV sb-a3 sb-m3 sb-c1 sb-mQK sb-tab4 sb-f4"><div class="step-kicker">Шаг 5 · оценки</div><h4>dS → dQ, dK</h4><p><span class="math-inline" data-tex="dq_{i,m}=\tfrac{1}{\sqrt2}\sum_j ds_{i,j}k_{j,m}"></span>, <span class="math-inline" data-tex="dk_{j,m}=\tfrac{1}{\sqrt2}\sum_i ds_{i,j}q_{i,m}"></span>.</p></div>
<div class="step-panel" data-focus="sb-f5" data-on="sb-m0 sb-a1 sb-m1 sb-a2 sb-m2 sb-vb sb-mV sb-a3 sb-m3 sb-c1 sb-mQK sb-a5 sb-mW sb-tab5 sb-f5"><div class="step-kicker">Шаг 6 · проекции</div><h4>dQ, dK, dV → dW</h4><p><span class="math-inline" data-tex="dW^{q}_{m,n}=\sum_i x_{i,m}dq_{i,n}"></span> — столбцы <span class="math-inline" data-tex="X"></span> на <span class="math-inline" data-tex="dQ"></span>; так же для ключей и значений.</p></div>
</div>
</div>
<p class="stage-hint">Полный backward: dz → dO → dA → dS → dQ, dK, а ветка dO → dV идёт мимо softmax.</p>
<hr/>

<h2 id="attention-part-14">Часть 14. Backward на числах</h2>
<p>
  Теперь та же цепочка на числах. Старт — <span class="math-inline" data-tex="dz=\left(0{,}3654;\ -0{,}3654\right)"></span>. Классификатор
  смотрит только на <span class="math-inline" data-tex="o_1"></span>, поэтому в <span class="math-inline" data-tex="dO"></span> жива одна строка — и дальше в
  <span class="math-inline" data-tex="dA"></span> и <span class="math-inline" data-tex="dS"></span> живёт только строка CLS. Отсюда <span class="math-inline" data-tex="dQ"></span> ненулевой лишь у
  CLS. А <span class="math-inline" data-tex="dK"></span> и <span class="math-inline" data-tex="dV"></span> ненулевые у всех трёх токенов: CLS смотрел на каждого
  из них.
</p>
<div aria-label="Числа обратного прохода" class="stage numeric-stage" id="stageBN" tabindex="0">
<div class="stage-figure">
<svg aria-label="Числа обратного прохода self-attention" class="rnn-svg" id="bn-svg" role="img" viewbox="0 0 960 520">
<style>#bn-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="bn-ar" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C30B0A"></path></marker><marker id="bn-arb" markerheight="9" markerwidth="9" orient="auto" refx="7" refy="4.5"><path d="M0,0 L9,4.5 L0,9 Z" fill="#3576C0"></path></marker></defs><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="24.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="96.7" y="36">dz, dW_o</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="177.3" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="250.0" y="36">dO</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="330.7" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="403.3" y="36">dA и dV</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="484.0" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="556.7" y="36">dS (softmax)</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="637.3" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="710.0" y="36">dQ, dK</text><rect fill="#FFFFFF" height="30" rx="6" stroke="#D8D4C8" stroke-width="1.2" width="145.3" x="790.7" y="16"></rect><text fill="#5E5850" font-size="12" text-anchor="middle" x="863.3" y="36">dW_q, dW_k, dW_v</text><text fill="#5E5850" font-size="12" text-anchor="middle" x="480" y="62">градиент идёт справа налево по слоям; живая только строка токена CLS</text>
<g data-key="bn-m0" data-only="1"><rect fill="rgb(255,184,184)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="40" y="138"></rect><rect fill="rgb(255,184,184)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="88" y="138"></rect><path d="M 39 133 L 33 133 L 33 181 L 39 181" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 137 133 L 143 133 L 143 181 L 137 181" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="64.0" y="161.1">0.365</text><text fill="#111" font-size="12" text-anchor="middle" x="112.0" y="161.1">−0.365</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="88.0" y="124">1 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="88.0" y="198">dz = p − y</text></g>
<g data-key="bn-a1" data-only="1"><path d="M144 157 L192 157" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="bn-m1" data-only="1"><rect fill="rgb(255,184,184)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="200" y="100"></rect><rect fill="rgb(255,154,154)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="248" y="100"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="200" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="248" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="200" y="176"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="248" y="176"></rect><path d="M 199 95 L 193 95 L 193 219 L 199 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 297 95 L 303 95 L 303 219 L 297 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="123.1">−0.365</text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="123.1">0.548</text><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="224.0" y="199.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="272.0" y="199.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="248.0" y="86">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="248.0" y="236">dO: живёт строка 1</text></g>
<g data-key="bn-a2" data-only="1"><path d="M304 157 L352 157" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="bn-m2" data-only="1"><rect fill="rgb(255,184,184)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="360" y="100"></rect><rect fill="rgb(255,184,184)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="408" y="100"></rect><rect fill="rgb(255,145,145)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="456" y="100"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="360" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="408" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="456" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="360" y="176"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="408" y="176"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="456" y="176"></rect><path d="M 359 95 L 353 95 L 353 219 L 359 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 505 95 L 511 95 L 511 219 L 505 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="123.1">−0.365</text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="123.1">0.365</text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="123.1">−0.731</text><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="384.0" y="199.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="432.0" y="199.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="480.0" y="199.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="432.0" y="86">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="432.0" y="236">dA = dO·Vᵀ</text></g>
<g data-key="bn-vb" data-only="1"><path d="M280 246 L280 318 L400 318 L400 342" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-dasharray="6 4" stroke-width="2"></path><text fill="#C30B0A" font-size="12" text-anchor="middle" x="344" y="310">dV = Aᵀ·dO</text></g>
<g data-key="bn-mV" data-only="1"><rect fill="rgb(255,220,220)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="320" y="350"></rect><rect fill="rgb(255,207,207)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="368" y="350"></rect><rect fill="rgb(255,224,224)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="320" y="388"></rect><rect fill="rgb(255,213,213)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="368" y="388"></rect><rect fill="rgb(255,230,230)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="320" y="426"></rect><rect fill="rgb(255,223,223)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="368" y="426"></rect><path d="M 319 345 L 313 345 L 313 469 L 319 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 417 345 L 423 345 L 423 469 L 417 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="373.1">−0.151</text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="373.1">0.226</text><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="411.1">−0.126</text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="411.1">0.189</text><text fill="#111" font-size="12" text-anchor="middle" x="344.0" y="449.1">−0.089</text><text fill="#111" font-size="12" text-anchor="middle" x="392.0" y="449.1">0.133</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="368.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="368.0" y="486">dV = Aᵀ·dO</text></g>
<g data-key="bn-a3" data-only="1"><path d="M512 157 L560 157" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="bn-m3" data-only="1"><rect fill="rgb(255,222,222)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="568" y="100"></rect><rect fill="rgb(255,180,180)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="616" y="100"></rect><rect fill="rgb(255,202,202)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="664" y="100"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="568" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="616" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="664" y="138"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="568" y="176"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="616" y="176"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="664" y="176"></rect><path d="M 567 95 L 561 95 L 561 219 L 567 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 713 95 L 719 95 L 719 219 L 713 219" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="123.1">−0.068</text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="123.1">0.196</text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="123.1">−0.128</text><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="161.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="592.0" y="199.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="640.0" y="199.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="688.0" y="199.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="640.0" y="86">3 × 3</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="640.0" y="236">dS (softmax по строкам)</text></g>
<g data-key="bn-c1" data-only="1"><path d="M720 157 L930 157 L930 505 L20 505 L20 407 L50 407" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-width="2.2"></path></g>
<g data-key="bn-mQK" data-only="1"><rect fill="rgb(255,192,192)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="60" y="350"></rect><rect fill="rgb(255,161,161)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="108" y="350"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="60" y="388"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="108" y="388"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="60" y="426"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="108" y="426"></rect><path d="M 59 345 L 53 345 L 53 469 L 59 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 157 345 L 163 345 L 163 469 L 157 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="373.1">0.160</text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="373.1">−0.253</text><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="411.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="411.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="84.0" y="449.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="132.0" y="449.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="108.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="108.0" y="486">dQ = dS·K/√2</text><rect fill="rgb(255,229,229)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="190" y="350"></rect><rect fill="rgb(255,237,237)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="238" y="350"></rect><rect fill="rgb(255,199,199)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="190" y="388"></rect><rect fill="rgb(255,222,222)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="238" y="388"></rect><rect fill="rgb(255,215,215)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="190" y="426"></rect><rect fill="rgb(255,230,230)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="238" y="426"></rect><path d="M 189 345 L 183 345 L 183 469 L 189 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 287 345 L 293 345 L 293 469 L 287 469" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="373.1">−0.048</text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="373.1">−0.024</text><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="411.1">0.138</text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="411.1">0.069</text><text fill="#111" font-size="12" text-anchor="middle" x="214.0" y="449.1">−0.091</text><text fill="#111" font-size="12" text-anchor="middle" x="262.0" y="449.1">−0.045</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="238.0" y="336">3 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="238.0" y="486">dK = dSᵀ·Q/√2</text></g>
<g data-key="bn-a5" data-only="1"><path d="M436 388 L488 388" fill="none" marker-end="url(#bn-ar)" stroke="#C30B0A" stroke-width="2.2"></path><text fill="#3576C0" font-size="12" text-anchor="middle" x="462" y="378">Xᵀ ·</text></g>
<g data-key="bn-mW" data-only="1"><rect fill="rgb(255,205,205)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="500" y="350"></rect><rect fill="rgb(255,182,182)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="548" y="350"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="500" y="388"></rect><rect fill="#F4F3EF" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="548" y="388"></rect><path d="M 499 345 L 493 345 L 493 431 L 499 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 597 345 L 603 345 L 603 431 L 597 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="524.0" y="373.1">0.160</text><text fill="#111" font-size="12" text-anchor="middle" x="572.0" y="373.1">−0.253</text><text fill="#111" font-size="12" text-anchor="middle" x="524.0" y="411.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="572.0" y="411.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="548.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="548.0" y="448">dW_q = XᵀdQ</text><rect fill="rgb(255,210,210)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="630" y="350"></rect><rect fill="rgb(255,228,228)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="678" y="350"></rect><rect fill="rgb(255,188,188)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="630" y="388"></rect><rect fill="rgb(255,216,216)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="678" y="388"></rect><path d="M 629 345 L 623 345 L 623 431 L 629 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 727 345 L 733 345 L 733 431 L 727 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="654.0" y="373.1">−0.138</text><text fill="#111" font-size="12" text-anchor="middle" x="702.0" y="373.1">−0.069</text><text fill="#111" font-size="12" text-anchor="middle" x="654.0" y="411.1">0.229</text><text fill="#111" font-size="12" text-anchor="middle" x="702.0" y="411.1">0.115</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="678.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="678.0" y="448">dW_k = XᵀdK</text><rect fill="rgb(255,185,185)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="760" y="350"></rect><rect fill="rgb(255,155,155)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="808" y="350"></rect><rect fill="rgb(255,236,236)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="760" y="388"></rect><rect fill="rgb(255,231,231)" height="38" stroke="#C9C2B8" stroke-width="1" width="48" x="808" y="388"></rect><path d="M 759 345 L 753 345 L 753 431 L 759 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 857 345 L 863 345 L 863 431 L 857 431" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="784.0" y="373.1">−0.239</text><text fill="#111" font-size="12" text-anchor="middle" x="832.0" y="373.1">0.359</text><text fill="#111" font-size="12" text-anchor="middle" x="784.0" y="411.1">−0.038</text><text fill="#111" font-size="12" text-anchor="middle" x="832.0" y="411.1">0.056</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="808.0" y="336">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="808.0" y="448">dW_v = XᵀdV</text></g>
<g data-key="bn-tab0" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="22.0" y="14"></rect></g>
<g data-key="bn-tab1" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="175.3" y="14"></rect></g>
<g data-key="bn-tab2" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="328.7" y="14"></rect></g>
<g data-key="bn-tab3" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="482.0" y="14"></rect></g>
<g data-key="bn-tab4" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="635.3" y="14"></rect></g>
<g data-key="bn-tab5" data-only="1"><rect fill="none" height="34" rx="8" stroke="#D83BB9" stroke-width="2.4" width="149.3" x="788.7" y="14"></rect></g>
<g data-key="bn-f0" data-only="1"><rect fill="none" height="50" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="34" y="132"></rect></g>
<g data-key="bn-f1" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="194" y="94"></rect></g>
<g data-key="bn-f2" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="354" y="94"></rect><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="314" y="344"></rect></g>
<g data-key="bn-f3" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="156" x="562" y="94"></rect></g>
<g data-key="bn-f4" data-only="1"><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="54" y="344"></rect><rect fill="none" height="126" rx="8" stroke="#D83BB9" stroke-width="2.6" width="108" x="184" y="344"></rect></g>
<g data-key="bn-f5" data-only="1"><rect fill="none" height="96" rx="8" stroke="#D83BB9" stroke-width="2.6" width="384" x="486" y="340"></rect></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="bn-f0" data-on="bn-m0 bn-tab0 bn-f0"><div class="step-kicker">Шаг 1 · dz</div><h4>Предсказание минус правда</h4><div class="math-display" data-tex="dz=p-y=\left(0{,}3654;\ -0{,}3654\right),\qquad dW_o=o_1^{\top}dz=\begin{bmatrix}0{,}2580&-0{,}2580\\0{,}0376&-0{,}0376\end{bmatrix},\quad dc=\left(0{,}3654;\ -0{,}3654\right)"></div><p>Позитиву модель дала 0,635; градиент просит поднять эту вероятность и опустить вторую.</p></div>
<div class="step-panel" data-focus="bn-f1" data-on="bn-m0 bn-a1 bn-m1 bn-tab1 bn-f1"><div class="step-kicker">Шаг 2 · dO</div><h4>Живая только строка CLS</h4><div class="math-display" data-tex="do_1=dz\,W_o^{\top}=\left(-0{,}3654;\ 0{,}5482\right),\qquad dO=\begin{bmatrix}-0{,}3654&0{,}5482\\0&0\\0&0\end{bmatrix}"></div><p>Строки «фильм» и «хороший» в классификатор не шли, поэтому их градиент — нули.</p></div>
<div class="step-panel" data-focus="bn-f2" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-vb bn-mV bn-tab2 bn-f2"><div class="step-kicker">Шаг 3 · dA и dV</div><h4>Две ветки из одного dO</h4><div class="math-display" data-tex="dA=dO\,V^{\top}=\begin{bmatrix}-0{,}3654&0{,}3654&-0{,}7309\\0&0&0\\0&0&0\end{bmatrix},\qquad dV=A^{\top}dO=\begin{bmatrix}-0{,}1506&0{,}2259\\-0{,}1262&0{,}1893\\-0{,}0886&0{,}1329\end{bmatrix}"></div><p><span class="math-inline" data-tex="da_{1j}=do_1\,v_j^{\top}"></span>: самое отрицательное значение (−0,731) — у «хороший», значит, спуск будет поднимать этот вес. А <span class="math-inline" data-tex="dv_j=a_{1j}\,do_1"></span>: все три токена получают одну и ту же поправку, масштабированную своим весом внимания.</p></div>
<div class="step-panel" data-focus="bn-f3" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-vb bn-mV bn-a3 bn-m3 bn-tab3 bn-f3"><div class="step-kicker">Шаг 4 · dS</div><h4>Softmax вычитает среднее</h4><div class="math-display" data-tex="\sum_m a_{1m}\,da_{1m}=-0{,}2017,\qquad dS=\begin{bmatrix}-0{,}0675&0{,}1959&-0{,}1283\\0&0&0\\0&0&0\end{bmatrix}"></div><p>Из каждого <span class="math-inline" data-tex="da_{1j}"></span> вычитается среднее −0,202 и результат умножается на <span class="math-inline" data-tex="a_{1j}"></span>. Строка <span class="math-inline" data-tex="dS"></span> в сумме даёт ноль. Знаки говорят, куда пойдут оценки: CLS→фильм уменьшится (0,196 &gt; 0), CLS→хороший и CLS→CLS вырастут.</p></div>
<div class="step-panel" data-focus="bn-f4" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-vb bn-mV bn-a3 bn-m3 bn-c1 bn-mQK bn-tab4 bn-f4"><div class="step-kicker">Шаг 5 · dQ и dK</div><h4>Запрос — только у CLS, ключи — у всех</h4><div class="math-display" data-tex="dQ=\frac{dS\,K}{\sqrt{2}}=\begin{bmatrix}0{,}1600&-0{,}2531\\0&0\\0&0\end{bmatrix},\qquad dK=\frac{dS^{\top}Q}{\sqrt{2}}=\begin{bmatrix}-0{,}0477&-0{,}0239\\0{,}1385&0{,}0692\\-0{,}0908&-0{,}0454\end{bmatrix}"></div><p><span class="math-inline" data-tex="dQ"></span> ненулевой лишь в первой строке. Каждая строка <span class="math-inline" data-tex="dK"></span> — это <span class="math-inline" data-tex="ds_{1j}\,q_1/\sqrt2"></span>: все три параллельны <span class="math-inline" data-tex="q_1"></span> и в сумме дают ноль.</p></div>
<div class="step-panel" data-focus="bn-f5" data-on="bn-m0 bn-a1 bn-m1 bn-a2 bn-m2 bn-vb bn-mV bn-a3 bn-m3 bn-c1 bn-mQK bn-a5 bn-mW bn-tab5 bn-f5"><div class="step-kicker">Шаг 6 · dW</div><h4>Xᵀ собирает вклады</h4><div class="math-display" data-tex="dW_q=\begin{bmatrix}0{,}1600&-0{,}2531\\0&0\end{bmatrix},\quad dW_k=\begin{bmatrix}-0{,}1385&-0{,}0692\\0{,}2292&0{,}1146\end{bmatrix},\quad dW_v=\begin{bmatrix}-0{,}2392&0{,}3589\\-0{,}0376&0{,}0564\end{bmatrix}"></div><p>Вторая строка <span class="math-inline" data-tex="dW_q"></span> — нули: единственный живой запрос принадлежит CLS, а у <span class="math-inline" data-tex="x_1=(1;\,0)"></span> вторая координата нулевая. <span class="math-inline" data-tex="dW_k"></span> и <span class="math-inline" data-tex="dW_v"></span> получают вклады от всех токенов.</p></div>
</div>
</div>
<p class="stage-hint">Пустые строки dO, dA, dS и dQ — следствие того, что loss видит только выход CLS.</p>
<div class="callout-red">
<strong>Softmax может заглушить градиент.</strong> Элементы <span class="math-inline" data-tex="dA"></span> доходят по
  модулю до 0,73, а <span class="math-inline" data-tex="dS"></span> — лишь до 0,20: якобиан softmax умножает
  на веса и вычитает среднее. Если оценки большие и строка <span class="math-inline" data-tex="A"></span> почти one-hot, эти
  множители близки к нулю, и запросы с ключами перестают учиться. Поэтому оценки и
  делят на <span class="math-inline" data-tex="\sqrt{d_k}"></span>: без масштабирования при больших <span class="math-inline" data-tex="d_k"></span> скалярные
  произведения огромны, softmax насыщается и градиент к <span class="math-inline" data-tex="Q"></span> и <span class="math-inline" data-tex="K"></span> исчезает.
</div>
<hr/>

<h2 id="attention-part-15">Часть 15. Проверка градиента и шаг обучения</h2>
<p>
  Аналитический градиент легко сверить с численным: сдвинуть один параметр на
  маленькое <span class="math-inline" data-tex="\varepsilon"></span> в обе стороны и поделить разность loss на
  <span class="math-inline" data-tex="2\varepsilon"></span>. Совпадение до десятого знака означает, что в выкладке нет ошибки.
</p>
<div class="worked-example">
<div class="worked-label">Сверка центральными разностями · ε = 10⁻⁶</div>
<div class="worked-grid">
<div class="worked-cell">
<span>Максимум расхождения по dW_q и dW_k</span>
<div class="math-display worked-math" data-tex="\max|dW-dW_{\text{числ}}|\approx1{,}4\cdot10^{-10}"></div>
</div>
<div class="worked-cell">
<span>По dW_o и dc</span>
<div class="math-display worked-math" data-tex="\max|d\theta-d\theta_{\text{числ}}|\approx2{,}7\cdot10^{-11}"></div>
</div>
<div class="worked-cell worked-result">
<span>По dW_v</span>
<div class="math-display worked-math" data-tex="\max|dW_v-dW_{v,\text{числ}}|\approx5{,}1\cdot10^{-11}"></div>
</div>
</div>
<p class="worked-reading"><strong>Как это прочитать:</strong> расхождения порядка <span class="math-inline" data-tex="10^{-10}"></span> — это шум округления, а не ошибка. Якобиан softmax, развилка на <span class="math-inline" data-tex="dA"></span> и <span class="math-inline" data-tex="dV"></span> и обмен между <span class="math-inline" data-tex="Q"></span> и <span class="math-inline" data-tex="K"></span> записаны верно.</p>
</div>
<p>
  Остаётся один шаг градиентного спуска. Вычитаем
  <span class="math-inline" data-tex="\eta\cdot\text{градиент}"></span> из каждого параметра и снова считаем loss на том же объекте.
</p>
<div class="math-display" data-tex="W_q\leftarrow W_q-\eta\,dW_q,\quad W_k\leftarrow W_k-\eta\,dW_k,\quad W_v\leftarrow W_v-\eta\,dW_v,\quad W_o\leftarrow W_o-\eta\,dW_o,\quad c\leftarrow c-\eta\,dc"></div>
<div class="worked-example">
<div class="worked-label">Один шаг · η = 0,5</div>
<div class="worked-grid">
<div class="worked-cell">
<span>Loss до шага</span>
<div class="math-display worked-math" data-tex="L = 0{,}4548"></div>
</div>
<div class="worked-cell worked-result">
<span>Loss после шага</span>
<div class="math-display worked-math" data-tex="L = 0{,}1776"></div>
</div>
</div>
<p class="worked-reading"><strong>Как это прочитать:</strong> один шаг по верному градиенту уменьшил ошибку на том же объекте в 2,6 раза — вероятность позитива выросла.</p>
</div>
<h3>Как выглядит один шаг для W<sub>q</sub></h3>
<p>
  Правило простое: из каждого веса вычитаем скорость обучения, умноженную на его
  градиент. Ниже — та же операция для матрицы запросов <span class="math-inline" data-tex="W_q"></span> на числах; на втором
  шаге подсвечена вторая строка: градиент там нулевой, и веса не меняются.
</p>
<div aria-label="Один шаг градиентного спуска для матрицы запросов" class="stage numeric-stage" id="stageGD" tabindex="0">
<div class="stage-figure">
<svg aria-label="Один шаг градиентного спуска для матрицы запросов" class="rnn-svg" id="gd-svg" role="img" viewbox="0 0 960 400">
<style>#gd-svg text { font-family: Helvetica, Arial, sans-serif; }</style>
<defs><marker id="gd-arrow2" markerheight="8" markerwidth="8" orient="auto" refx="6" refy="4.0"><path d="M0,0 L8,4.0 L0,8 Z" fill="#73B222"></path></marker></defs><text class="v-title" x="30" y="34">Шаг градиентного спуска: W_q ← W_q − η·dW_q</text>
<text class="v-small" x="30" y="56">Вычитаем η = 0,5 от градиента. Показана W_q; остальные параметры обновляются так же.</text>
<g data-key="gd-base"><rect fill="#FFF8D9" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="190" y="120"></rect><rect fill="#FFF8D9" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="254" y="120"></rect><rect fill="#FFF8D9" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="190" y="160"></rect><rect fill="#FFF8D9" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="254" y="160"></rect><path d="M 189 115 L 183 115 L 183 205 L 189 205" fill="none" stroke="#C29E08" stroke-width="1.8"></path><path d="M 319 115 L 325 115 L 325 205 L 319 205" fill="none" stroke="#C29E08" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="222.0" y="144.1">1.00</text><text fill="#111" font-size="12" text-anchor="middle" x="286.0" y="144.1">0.50</text><text fill="#111" font-size="12" text-anchor="middle" x="222.0" y="184.1">−0.50</text><text fill="#111" font-size="12" text-anchor="middle" x="286.0" y="184.1">1.00</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="254.0" y="106">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="254.0" y="222">W_q (было)</text><text fill="#5E5850" font-size="13" text-anchor="end" x="178" y="145">коорд. 1</text><text fill="#5E5850" font-size="13" text-anchor="end" x="178" y="185">коорд. 2</text><text fill="#111" font-size="18" text-anchor="middle" x="364.0" y="165">− 0,5 ×</text><rect fill="rgb(255,205,205)" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="410" y="120"></rect><rect fill="rgb(255,182,182)" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="474" y="120"></rect><rect fill="#F4F3EF" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="410" y="160"></rect><rect fill="#F4F3EF" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="474" y="160"></rect><path d="M 409 115 L 403 115 L 403 205 L 409 205" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><path d="M 539 115 L 545 115 L 545 205 L 539 205" fill="none" stroke="#C30B0A" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="442.0" y="144.1">0.160</text><text fill="#111" font-size="12" text-anchor="middle" x="506.0" y="144.1">−0.253</text><text fill="#111" font-size="12" text-anchor="middle" x="442.0" y="184.1">0.000</text><text fill="#111" font-size="12" text-anchor="middle" x="506.0" y="184.1">0.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="474.0" y="106">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="474.0" y="222">dW_q</text><text fill="#111" font-size="20" text-anchor="middle" x="589.0" y="165">=</text><rect fill="#E8F3DC" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="640" y="120"></rect><rect fill="#E8F3DC" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="704" y="120"></rect><rect fill="#E8F3DC" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="640" y="160"></rect><rect fill="#E8F3DC" height="40" stroke="#C9C2B8" stroke-width="1" width="64" x="704" y="160"></rect><path d="M 639 115 L 633 115 L 633 205 L 639 205" fill="none" stroke="#73B222" stroke-width="1.8"></path><path d="M 769 115 L 775 115 L 775 205 L 769 205" fill="none" stroke="#73B222" stroke-width="1.8"></path><text fill="#111" font-size="12" text-anchor="middle" x="672.0" y="144.1">0.920</text><text fill="#111" font-size="12" text-anchor="middle" x="736.0" y="144.1">0.627</text><text fill="#111" font-size="12" text-anchor="middle" x="672.0" y="184.1">−0.500</text><text fill="#111" font-size="12" text-anchor="middle" x="736.0" y="184.1">1.000</text><text fill="#5E5850" font-size="13" font-weight="700" text-anchor="middle" x="704.0" y="106">2 × 2</text><text fill="#111" font-size="14" font-weight="700" text-anchor="middle" x="704.0" y="222">W_q (стало)</text><text fill="#5E5850" font-size="13" text-anchor="start" x="782" y="145">коорд. 1</text><text fill="#5E5850" font-size="13" text-anchor="start" x="782" y="185">коорд. 2</text><rect class="formula-bg" height="90" rx="12" width="360" x="60" y="280"></rect><text class="v-small" text-anchor="middle" x="240" y="312">Loss до шага</text><text fill="#C30B0A" font-size="20" text-anchor="middle" x="240" y="342">L = 0.4548</text><path class="edge-green" d="M430 325 L470 325" marker-end="url(#gd-arrow2)"></path><rect class="formula-bg" height="90" rx="12" width="360" x="500" y="280"></rect><text class="v-small" text-anchor="middle" x="680" y="312">Loss после шага (тот же объект)</text><text fill="#73B222" font-size="20" text-anchor="middle" x="680" y="342">L = 0.1776</text></g>
<g data-key="gd-hl" data-only="1"><rect fill="#D83BB9" fill-opacity="0.3" height="40" stroke="#D83BB9" stroke-width="2.2" width="128" x="190" y="160"></rect><rect fill="#D83BB9" fill-opacity="0.3" height="40" stroke="#D83BB9" stroke-width="2.2" width="128" x="410" y="160"></rect><rect fill="#D83BB9" fill-opacity="0.3" height="40" stroke="#D83BB9" stroke-width="2.2" width="128" x="640" y="160"></rect></g>
</svg>
</div>
<div class="stage-bar"><button data-nav="prev" type="button">← Назад</button><button data-nav="next" type="button">Далее →</button><div class="stage-progress"></div><div class="stage-counter"></div></div>
<div class="stage-notes">
<div class="step-panel" data-focus="gd-base" data-on="gd-base"><div class="step-kicker">Шаг 1 · вся матрица</div><h4>W_q ← W_q − η·dW_q</h4><p>Каждая из четырёх клеток обновляется независимо: из старого веса вычитается <span class="math-inline" data-tex="\eta=0{,}5"></span> градиента. Loss на том же объекте падает с 0,4548 до 0,1776.</p></div>
<div class="step-panel" data-focus="gd-hl" data-on="gd-base gd-hl"><div class="step-kicker">Шаг 2 · одна строка</div><h4>Вторая строка не сдвинулась</h4><p><span class="math-inline" data-tex="-0{,}5-0{,}5\cdot0=-0{,}5"></span> и <span class="math-inline" data-tex="1-0{,}5\cdot0=1"></span>. Строка m матрицы <span class="math-inline" data-tex="W_q"></span> умножается на координату m токена, а у единственного токена с живым запросом — CLS — вторая координата нулевая.</p></div>
</div>
</div>
<p class="stage-hint">W_k, W_v, W_o и c обновляются точно так же — вычитанием η, умноженного на их градиент.</p>
<div class="callout">
<strong>Градиент верен, шаг работает.</strong> Мы провели фразу вперёд до loss,
  вернули производную назад через softmax внимания до каждой проекции, сверили её с
  численной и сделали шаг обучения. Это полный цикл обучения одной головы
  self-attention — в трансформере таких голов десятки, а токенов тысячи.
</div>
<hr/>

<h2 id="attention-part-16">Часть 16. Реализация 1: numpy и функции</h2>
<p>Теперь тот же расчёт кодом. Первая версия — две функции: прямой проход возвращает выход и кэш,
обратный проход берёт градиент по выходу и кэш и возвращает градиенты по входу и весам. Кэш — ровно таблица из части 12.
Каждая строка обратного прохода — одна формула из части 13, в том же порядке.</p>

```python
import numpy as np

def softmax(S):
    E = np.exp(S - S.max(axis=-1, keepdims=True))   # вычитаем максимум строки
    return E / E.sum(axis=-1, keepdims=True)

def attention_forward(X, Wq, Wk, Wv):
    Q, K, V = X @ Wq, X @ Wk, X @ Wv                # [T, d_k] каждая
    S = Q @ K.T / np.sqrt(Q.shape[-1])              # [T, T] оценки
    A = softmax(S)                                  # [T, T] строки суммируются в 1
    O = A @ V                                       # [T, d_v] смесь значений
    cache = (X, Q, K, V, A)
    return O, cache

def attention_backward(dO, cache, Wq, Wk, Wv):
    X, Q, K, V, A = cache
    dA = dO @ V.T                                   # ветка через веса
    dV = A.T @ dO                                   # ветка значений, мимо softmax
    dS = A * (dA - (A * dA).sum(axis=-1, keepdims=True))   # якобиан softmax по строке
    dQ = dS @ K / np.sqrt(Q.shape[-1])
    dK = dS.T @ Q / np.sqrt(Q.shape[-1])
    dWq, dWk, dWv = X.T @ dQ, X.T @ dK, X.T @ dV
    dX = dQ @ Wq.T + dK @ Wk.T + dV @ Wv.T
    return dX, dWq, dWk, dWv

def loss_and_grads(X, y, Wq, Wk, Wv, Wo, c):
    O, cache = attention_forward(X, Wq, Wk, Wv)
    z = O[0] @ Wo + c                               # берём только выход <CLS>
    p = softmax(z)
    L = -np.log(p[y])
    dz = p.copy(); dz[y] -= 1                       # p − y
    dWo, dc = np.outer(O[0], dz), dz
    dO = np.zeros_like(O); dO[0] = dz @ Wo.T        # остальные строки не видны потере
    dX, dWq, dWk, dWv = attention_backward(dO, cache, Wq, Wk, Wv)
    return L, cache[-1], dict(Wq=dWq, Wk=dWk, Wv=dWv, Wo=dWo, c=dc)

X  = np.array([[1., 0.], [0., 1.], [1., -1.]])      # <CLS>, фильм, хороший
y  = 1                                              # класс «позитив»
W  = dict(Wq=np.array([[1., .5], [-.5, 1.]]),
          Wk=np.array([[.5, 1.], [1., -.5]]),
          Wv=np.array([[1., 0.], [.5, 1.]]),
          Wo=np.array([[-.5, .5], [1., -.5]]),
          c =np.zeros(2))

L, A, G = loss_and_grads(X, y, **W)
np.set_printoptions(precision=4, suppress=True)
print("L =", round(L, 4))
print("A =\n", A)
print("dWq =\n", G["Wq"])

# сверка центральными разностями
eps, worst = 1e-6, 0.0
for name, P in W.items():
    for idx in np.ndindex(P.shape):
        old = P[idx]
        P[idx] = old + eps; Lp = loss_and_grads(X, y, **W)[0]
        P[idx] = old - eps; Lm = loss_and_grads(X, y, **W)[0]
        P[idx] = old
        worst = max(worst, abs((Lp - Lm) / (2 * eps) - G[name][idx]))
print(f"худшее расхождение: {worst:.1e}")
```

<div class="console"><span class="cmd">$ python impl_np.py</span>
L = 0.4548
A =
 [[0.4121 0.3454 0.2425]
 [0.3014 0.0874 0.6112]
 [0.2393 0.6912 0.0694]]
dWq =
 [[ 0.16   -0.2531]
 [ 0.      0.    ]]
худшее расхождение: 1.4e-10
</div>
<div class="callout-blue"><strong>Как это прочитать.</strong> Потеря и строка <code>A</code> совпали с числами части 11,
<code>dWq</code> — с частью 14: вторая строка нулевая, потому что единственный живой запрос принадлежит ⟨CLS⟩, а у его
эмбеддинга вторая координата ноль. Сверка по всем 18 параметрам — 1,4·10⁻¹⁰.</div>
<div class="callout"><strong>Главная мысль части:</strong> forward и backward внимания — по семь строк numpy; всё, что нужно для backward, — это Q, K, V, A и X, которые forward сохраняет в кэш.</div>

<hr/>

<h2 id="attention-part-17">Часть 17. Реализация 2: numpy и классы</h2>
<p>Функции неудобны, когда слоёв становится много: каждый кэш и каждый градиент приходится таскать руками.
Поэтому библиотеки устроены как модули с общим контрактом: <code>forward</code> сам запоминает нужное,
<code>backward</code> получает <span class="math-inline" data-tex="\partial L/\partial\text{выход}"></span>, копит градиенты своих
параметров через <code>+=</code> и возвращает <span class="math-inline" data-tex="\partial L/\partial\text{вход}"></span>.
Ниже семь классов: <code>Module</code>, <code>Linear</code>, <code>Softmax</code>, <code>SelfAttention</code>,
<code>CrossEntropyLoss</code>, <code>CLSClassifier</code> и <code>SGD</code>. Внимание работает с батчем
<code>[B, T, d]</code> и умеет причинную маску.</p>
<table class="shape-table"><thead><tr><th>Модуль</th><th>forward</th><th>backward</th><th>Запоминает</th></tr></thead><tbody>
<tr><td><code>Linear</code></td><td><code>X @ W (+ b)</code></td><td><code>dW += Xᵀ·dY</code>, вернуть <code>dY·Wᵀ</code></td><td><code>X</code></td></tr>
<tr><td><code>Softmax</code></td><td>по последней оси</td><td><code>A ⊙ (dA − Σ A⊙dA)</code></td><td><code>A</code></td></tr>
<tr><td><code>SelfAttention</code></td><td>три <code>Linear</code>, <code>S</code>, маска, <code>A @ V</code></td><td>развилка на <code>dA</code> и <code>dV</code>, обмен <code>dQ</code>/<code>dK</code>, сумма трёх <code>dX</code></td><td><code>Q, K, V, A</code></td></tr>
<tr><td><code>CrossEntropyLoss</code></td><td>среднее <code>−log p_y</code></td><td><code>(p − y)/B</code></td><td><code>p, y</code></td></tr>
</tbody></table>

```python
import numpy as np

class Module:
    """Контракт: forward запоминает нужное, backward получает dL/dвыход,
    копит градиенты параметров (+=) и возвращает dL/dвход."""
    def __init__(self):
        self.params, self.grads = {}, {}
    def zero_grad(self):
        for g in self.grads.values():
            g[...] = 0.0
    def modules(self):
        return [self]

class Linear(Module):
    def __init__(self, W, b=None):
        super().__init__()
        self.params["W"] = np.array(W, float)
        self.grads["W"] = np.zeros_like(self.params["W"])
        if b is not None:
            self.params["b"] = np.array(b, float)
            self.grads["b"] = np.zeros_like(self.params["b"])
    def forward(self, X):                           # X: [..., d_in]
        self.X = X
        out = X @ self.params["W"]
        return out + self.params["b"] if "b" in self.params else out
    def backward(self, dY):                         # dY: [..., d_out]
        X2, dY2 = self.X.reshape(-1, self.X.shape[-1]), dY.reshape(-1, dY.shape[-1])
        self.grads["W"] += X2.T @ dY2               # сумма по батчу и токенам
        if "b" in self.params:
            self.grads["b"] += dY2.sum(axis=0)
        return dY @ self.params["W"].T

class Softmax(Module):
    def forward(self, S):
        E = np.exp(S - S.max(axis=-1, keepdims=True))
        self.A = E / E.sum(axis=-1, keepdims=True)
        return self.A
    def backward(self, dA):
        A = self.A
        return A * (dA - (A * dA).sum(axis=-1, keepdims=True))

class SelfAttention(Module):
    def __init__(self, Wq, Wk, Wv, causal=False):
        super().__init__()
        self.q, self.k, self.v = Linear(Wq), Linear(Wk), Linear(Wv)
        self.softmax, self.causal = Softmax(), causal
    def modules(self):
        return [self.q, self.k, self.v]
    def forward(self, X):                           # X: [B, T, d]
        self.Q, self.K, self.V = self.q.forward(X), self.k.forward(X), self.v.forward(X)
        self.scale = 1.0 / np.sqrt(self.Q.shape[-1])
        S = self.Q @ self.K.swapaxes(-1, -2) * self.scale      # [B, T, T]
        if self.causal:
            T = S.shape[-1]
            S = np.where(np.triu(np.ones((T, T), bool), 1), -np.inf, S)
        self.A = self.softmax.forward(S)
        return self.A @ self.V                      # [B, T, d_v]
    def backward(self, dO):
        dA = dO @ self.V.swapaxes(-1, -2)
        dV = self.A.swapaxes(-1, -2) @ dO
        dS = self.softmax.backward(dA)              # под маской A=0 → dS=0
        dQ = dS @ self.K * self.scale
        dK = dS.swapaxes(-1, -2) @ self.Q * self.scale
        return self.q.backward(dQ) + self.k.backward(dK) + self.v.backward(dV)

class CrossEntropyLoss:
    def forward(self, z, y):                        # z: [B, C], y: [B]
        E = np.exp(z - z.max(axis=-1, keepdims=True))
        self.p, self.y = E / E.sum(axis=-1, keepdims=True), y
        return -np.log(self.p[np.arange(len(y)), y]).mean()
    def backward(self):
        d = self.p.copy()
        d[np.arange(len(self.y)), self.y] -= 1
        return d / len(self.y)                      # (p − y) / B

class CLSClassifier(Module):
    def __init__(self, attn, head):
        super().__init__()
        self.attn, self.head = attn, head
    def modules(self):
        return self.attn.modules() + self.head.modules()
    def forward(self, X):
        self.O = self.attn.forward(X)               # [B, T, d_v]
        return self.head.forward(self.O[:, 0])      # только <CLS>: [B, C]
    def backward(self, dz):
        dO = np.zeros_like(self.O)
        dO[:, 0] = self.head.backward(dz)
        return self.attn.backward(dO)

class SGD:
    def __init__(self, model, lr):
        self.model, self.lr = model, lr
    def step(self):
        for m in self.model.modules():
            for k in m.params:
                m.params[k] -= self.lr * m.grads[k]
    def zero_grad(self):
        for m in self.model.modules():
            m.zero_grad()

# ---------------- запуск на нашем примере ----------------
X = np.array([[[1., 0.], [0., 1.], [1., -1.]]])       # [B=1, T=3, d=2]
y = np.array([1])
model = CLSClassifier(
    SelfAttention(Wq=[[1, .5], [-.5, 1]], Wk=[[.5, 1], [1, -.5]], Wv=[[1, 0], [.5, 1]]),
    Linear(W=[[-.5, .5], [1, -.5]], b=[0, 0]))
loss_fn, opt = CrossEntropyLoss(), SGD(model, lr=0.5)

def loss_at():
    return loss_fn.forward(model.forward(X), y)

opt.zero_grad()
L = loss_at()
dX = model.backward(loss_fn.backward())
print("формы:", "X", X.shape, "Q", model.attn.Q.shape, "A", model.attn.A.shape, "z", model.head.forward(model.O[:, 0]).shape)
print(f"L = {L:.4f}")
np.set_printoptions(precision=4, suppress=True)
print("dWk =\n", model.attn.k.grads["W"])
print("dX  =\n", dX[0])

eps, worst = 1e-6, 0.0
for m in model.modules():
    for k, P in m.params.items():
        for idx in np.ndindex(P.shape):
            old = P[idx]
            P[idx] = old + eps; Lp = loss_at()
            P[idx] = old - eps; Lm = loss_at()
            P[idx] = old
            worst = max(worst, abs((Lp - Lm) / (2 * eps) - m.grads[k][idx]))
print(f"сверка параметров: {worst:.1e}")

opt.step()
print(f"L после шага η=0,5: {loss_at():.4f}")

# та же сеть с причинной маской: <CLS> видит только себя
causal = CLSClassifier(
    SelfAttention(Wq=[[1, .5], [-.5, 1]], Wk=[[.5, 1], [1, -.5]], Wv=[[1, 0], [.5, 1]], causal=True),
    Linear(W=[[-.5, .5], [1, -.5]], b=[0, 0]))
Lc = loss_fn.forward(causal.forward(X), y)
print("с маской: строка <CLS> в A =", causal.attn.A[0, 0].round(4), f" L = {Lc:.4f}")
```

<div class="console"><span class="cmd">$ python impl_oop.py</span>
формы: X (1, 3, 2) Q (1, 3, 2) A (1, 3, 3) z (1, 2)
L = 0.4548
dWk =
 [[-0.1385 -0.0692]
 [ 0.2292  0.1146]]
dX  =
 [[-0.1649 -0.2183]
 [ 0.0123  0.2301]
 [-0.1794  0.0206]]
сверка параметров: 1.4e-10
L после шага η=0,5: 0.1776
с маской: строка <CLS> в A = [1. 0. 0.]  L = 0.3133
</div>
<div class="callout-red"><strong>Три места, где такие классы обычно ломаются.</strong> Первое — <code>=</code> вместо <code>+=</code>
в <code>Linear.backward</code>: проекции <code>q</code>, <code>k</code>, <code>v</code> получают градиент один раз, но если модуль
вызвать дважды (общие веса), второй вызов затрёт первый. Второе — забытый <code>zero_grad</code>: без него градиенты
накапливаются между шагами. Третье — маска: в <code>S</code> ставится <code>−∞</code>, а не ноль; тогда <code>A</code> под маской
ровно 0, и формула softmax сама даёт нулевой <code>dS</code> в этих клетках, ничего отдельно маскировать в backward не нужно.</div>
<p>Последняя строка вывода — неожиданный побочный эффект. С причинной маской ⟨CLS⟩ видит только себя, его выход — это
<span class="math-inline" data-tex="v_1=(1;\ 0)"></span>, и на этих необученных весах потеря даже ниже: 0,3133 против 0,4548.
Это не довод в пользу маски: просто значение самого ⟨CLS⟩ случайно указывает в сторону «позитива». Маска меняет, какую
информацию модель вообще может использовать, а не качество.</p>
<div class="callout"><strong>Главная мысль части:</strong> модуль с контрактом forward/backward и накоплением градиентов превращает выкладку из частей 12–13 в переиспользуемый блок; численно классы дают те же 0,4548, 1,4·10⁻¹⁰ и 0,1776.</div>

<hr/>

<h2 id="attention-part-18">Часть 18. Реализация 3: PyTorch</h2>
<p>В PyTorch backward писать не нужно: autograd строит граф во время forward и сам проходит его назад.
Остаётся только прямой проход — ровно формула части 7. Чтобы сравнивать с numpy без потерь точности,
считаем в <code>float64</code>; веса копируем те же.</p>

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.set_default_dtype(torch.float64)          # float64 — чтобы сравнивать с numpy до 1e-12

class SelfAttention(nn.Module):
    def __init__(self, d, d_k, causal=False):
        super().__init__()
        self.q = nn.Linear(d, d_k, bias=False)
        self.k = nn.Linear(d, d_k, bias=False)
        self.v = nn.Linear(d, d_k, bias=False)
        self.causal = causal

    def forward(self, X):                       # X: [B, T, d]
        Q, K, V = self.q(X), self.k(X), self.v(X)
        S = Q @ K.transpose(-2, -1) / Q.shape[-1] ** 0.5
        if self.causal:
            T = S.shape[-1]
            S = S.masked_fill(torch.triu(torch.ones(T, T, dtype=torch.bool), 1), float("-inf"))
        self.A = S.softmax(dim=-1)
        return self.A @ V

class CLSClassifier(nn.Module):
    def __init__(self, d=2, d_k=2, n_classes=2):
        super().__init__()
        self.attn = SelfAttention(d, d_k)
        self.head = nn.Linear(d_k, n_classes)

    def forward(self, X):
        return self.head(self.attn(X)[:, 0])    # только выход <CLS>

model = CLSClassifier()
with torch.no_grad():                            # nn.Linear хранит W как [out, in] — отсюда .T
    model.attn.q.weight.copy_(torch.tensor([[1, .5], [-.5, 1]]).T)
    model.attn.k.weight.copy_(torch.tensor([[.5, 1], [1, -.5]]).T)
    model.attn.v.weight.copy_(torch.tensor([[1, 0], [.5, 1]]).T)
    model.head.weight.copy_(torch.tensor([[-.5, .5], [1, -.5]]).T)
    model.head.bias.zero_()

X = torch.tensor([[[1., 0.], [0., 1.], [1., -1.]]], requires_grad=True)
y = torch.tensor([1])

loss = F.cross_entropy(model(X), y)
loss.backward()                                  # весь backward из частей 12–13 — одной строкой

print(f"L = {loss.item():.4f}")                  # 0.4548
print(model.attn.A[0].detach())                  # строка <CLS>: 0.4121 0.3454 0.2425
print(model.attn.k.weight.grad.T)                # dW_k: [[-0.1385 -0.0692] [0.2292 0.1146]]
print(X.grad[0])                                 # dX:   [[-0.1649 -0.2183] [0.0123 0.2301] [-0.1794 0.0206]]

# встроенная функция считает то же самое
Q, K, V = model.attn.q(X), model.attn.k(X), model.attn.v(X)
Z_ref = F.scaled_dot_product_attention(Q, K, V)
print((Z_ref - model.attn(X)).abs().max().item())   # порядка 1e-16

# и автоматическая сверка центральными разностями
f = lambda X: F.cross_entropy(model(X), y)
print(torch.autograd.gradcheck(f, (X,)))            # True
```

<div class="callout-red"><strong>Главная ловушка — форма весов.</strong> <code>nn.Linear(d_in, d_out)</code> хранит
<code>weight</code> формы <code>[d_out, d_in]</code> и считает <code>X @ weight.T</code>. Поэтому матрицы из статьи
копируются с <code>.T</code>, а градиент <code>weight.grad</code> тоже транспонирован относительно нашего <code>dW</code>.
Для квадратных 2 × 2 ошибка не упадёт с исключением — она молча даст другие числа.</div>
<div class="callout-yellow"><strong>Про вывод.</strong> В среде, где собиралась статья, PyTorch не установлен, поэтому этот
код не запускался. Числа в комментариях — ожидаемые: это те же величины, что посчитаны на numpy в частях 16–17.
Если у вас получится иначе, первым делом проверьте транспонирование весов.</div>
<p>Встроенная <code>F.scaled_dot_product_attention</code> делает то же самое, что наша строчка
<code>softmax(QKᵀ/√d_k)V</code>, только быстрее: на GPU она не хранит матрицу <span class="math-inline" data-tex="A"></span>
целиком, а пересчитывает её в backward (тот самый приём из части 12). Многоголовый вариант — <code>nn.MultiheadAttention</code>:
внутри те же проекции, ось голов и <span class="math-inline" data-tex="W_O"></span>.</p>
<div class="callout"><strong>Главная мысль части:</strong> в PyTorch пишется только forward, backward даёт autograd; ручная реализация нужна, чтобы понимать, что именно он считает, — и сверять его с ней.</div>

<hr/>

<h2 id="attention-part-19">Часть 19. Что важно уметь восстановить по памяти</h2>
<ol class="end-list">
<li>Seq2seq на RNN упирается в один вектор фиксированной длины: вся фраза должна пройти через <span class="math-inline" data-tex="h_T"></span>.</li>
<li>Внимание на каждом шаге декодера строит свой контекст: оценки → softmax → <span class="math-inline" data-tex="c_t=\sum_i\alpha_{ti}h_i"></span>. Строки весов вместе — матрица выравнивания, которую никто не размечал.</li>
<li>Веса внимания параллельны; последовательной модель делает только рекуррентность. Само-внимание убирает её: запросы и ключи — слова одной фразы.</li>
<li>Внимание — мягкий поиск: запрос сравнивается со всеми ключами, softmax даёт доли, выход — смесь значений.</li>
<li><span class="math-inline" data-tex="Q=XW_Q,\ K=XW_K,\ V=XW_V"></span> — три линейные проекции одного эмбеддинга, обычно в <span class="math-inline" data-tex="d_k&lt;d"></span>.</li>
<li><span class="math-inline" data-tex="Z=\operatorname{softmax}(QK^{\top}/\sqrt{d_k})\,V"></span>: строка — один токен, два матричных умножения — все токены.</li>
<li>Без <span class="math-inline" data-tex="\sqrt{d_k}"></span> разброс оценок растёт как √d<sub>k</sub>, softmax насыщается и градиент к Q и K гаснет.</li>
<li>Головы: h проекций размера d/h, склейка и <span class="math-inline" data-tex="W_O"></span>; параметров по-прежнему <span class="math-inline" data-tex="4d^2"></span>.</li>
<li>Backward: <span class="math-inline" data-tex="dA=dO\,V^{\top},\ dV=A^{\top}dO,\ dS=A\odot(dA-\textstyle\sum A\odot dA),\ dQ=dS\,K/\sqrt{d_k},\ dK=dS^{\top}Q/\sqrt{d_k}"></span>.</li>
<li>Запрос получает градиент только от своего токена, ключи и значения — от всех, на кого он смотрел; forward обязан хранить матрицу A размера T × T.</li>
</ol>
<p>Держите в голове одну картину: строка весов, которая вперёд смешивает значения всех слов, а назад раздаёт им градиент.
Всё остальное — маски, головы, кросс-внимание энкодера и декодера — та же строка, повторённая и ограниченная.</p>
