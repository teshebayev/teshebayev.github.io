<style>
  .prose pre { width: 0; min-width: 100%; box-sizing: border-box; }
  .prose .dt-table { overflow-x: auto; width: 0; min-width: 100%; margin: 1.5em 0; }
  .prose .dt-table table { margin: 0; }
  .prose .math-display, .prose .dt-formula { width: 0; min-width: 100%; box-sizing: border-box; }
  .prose .dt-live { border: 1px solid #E0DDD3; border-radius: 16px; padding: 20px 22px; margin: 26px 0;
                    background: #FFFFFF; color: #111111; }
  .prose .dt-live-head strong { font-size: 17px; color: #111111; }
  .prose .dt-live-head p { margin: 6px 0 0; font-size: 14px; color: #5E5850; }
  .prose .dt-live-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(220px, 1fr); gap: 22px;
                         margin-top: 16px; align-items: start; }
  .prose .dt-live svg { width: 100%; display: block; font-family: Helvetica, Arial, sans-serif; }
  .prose .dt-controls { display: flex; flex-direction: column; gap: 12px; }
  .prose .dt-counter { display: grid; grid-template-columns: 1fr 34px 42px 34px; align-items: center; gap: 6px;
                       font-size: 14px; color: #5E5850; }
  .prose .dt-counter output { text-align: center; font-weight: 700; font-size: 18px; color: #111111;
                              font-variant-numeric: tabular-nums; }
  .prose .dt-live button { font-family: inherit; font-size: 14px; color: #111111; background: #FFFFFF;
                           border: 1px solid #C9C3B6; border-radius: 8px; padding: 5px 9px; cursor: pointer; }
  .prose .dt-live button:hover { border-color: #3576C0; }
  .prose .dt-live button[aria-pressed="true"] { background: #3576C0; border-color: #3576C0; color: #FFFFFF; }
  .prose .dt-presets { display: flex; flex-wrap: wrap; gap: 6px; }
  .prose .dt-presets button { font-size: 13px; }
  .prose .dt-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .prose .dt-metric { border: 1px solid #E0DDD3; border-radius: 10px; padding: 7px 10px; }
  .prose .dt-metric span { display: block; font-size: 12px; color: #5E5850; }
  .prose .dt-metric strong { font-size: 17px; font-variant-numeric: tabular-nums; color: #111111; }
  .prose .dt-metric.is-main { grid-column: 1 / -1; border-color: #73B222; background: #F4FAEC; }
  .prose .dt-metric.is-main strong { font-size: 22px; color: #5F9420; }
  .prose .dt-control label { display: flex; justify-content: space-between; font-size: 14px; color: #5E5850; margin-bottom: 6px; }
  .prose .dt-control output { font-weight: 700; color: #111111; font-variant-numeric: tabular-nums; }
  .prose .dt-control input[type=range] { width: 100%; accent-color: #C29E08; }
  .prose .dt-seg { display: flex; gap: 6px; }
  .prose .dt-seg button { flex: 1; }
  .prose .dt-formula { margin-top: 14px; padding: 10px; border: 1px solid #E0DDD3; border-radius: 10px;
                       text-align: center; overflow-x: auto; color: #111111; font-size: 15px; }
  .prose .dt-note { font-size: 13px; color: #5E5850; margin: 10px 0 0; }
  .prose .dt-bars { margin-top: 14px; overflow-x: auto; width: 0; min-width: 100%; }
  @media (max-width: 820px) { .prose .dt-bars svg { min-width: 640px; } }
  .prose .dt-metric strong.two { white-space: pre-line; font-size: 16px; line-height: 1.35; }
  .prose .dt-bars rect.bar { cursor: pointer; }
  .prose .dt-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }
  .prose .dt-group { border: 1px solid #E0DDD3; border-radius: 12px; padding: 10px 12px; min-width: 0; }
  .prose .dt-group .dt-formula { margin-top: 8px; font-size: 12.5px; padding: 8px 4px; }
  @media (max-width: 820px) { .prose .dt-live-grid, .prose .dt-groups { grid-template-columns: 1fr; } .prose .dt-live { padding: 16px 14px; } }
</style>
<style>
  .prose .cm-grid { display: grid; grid-template-columns: auto 1fr 1fr; gap: 4px; font-size: 13px; }
  .prose .cm-grid > div { border-radius: 8px; padding: 6px 8px; text-align: center; color: #5E5850; }
  .prose .cm-grid .cm-cell { border: 1px solid #E0DDD3; background: #FFFFFF; }
  .prose .cm-grid .cm-cell b { display: block; font-size: 20px; color: #111111; font-variant-numeric: tabular-nums; }
  .prose .cm-grid .cm-cell.ok { background: #F4FAEC; border-color: #B9D98F; }
  .prose .cm-grid .cm-cell.bad { background: #FDF1F1; border-color: #E8B4B3; }
  .prose .cm-grid .cm-h { font-weight: 700; }
  .prose .cm-grid .cm-row { text-align: right; font-weight: 700; align-self: center; white-space: nowrap; padding: 0 2px; }
  .prose .cm-grid .cm-h { white-space: nowrap; font-size: 12px; padding: 4px 2px; }
  .prose .thr-fig { max-width: 640px; margin: 14px auto 0; }
  .prose .thr-panel { display: grid; grid-template-columns: 0.9fr 1.3fr 1.1fr; gap: 16px; margin-top: 14px; align-items: start; }
  .prose .thr-metrics strong small { display: block; font-size: 12px; font-weight: 400; color: #5E5850; }
  .prose .thr-formulas { display: flex; flex-wrap: wrap; gap: 10px; }
  .prose .thr-formulas .dt-formula { flex: 1 1 260px; width: auto; min-width: 0; }
  @media (max-width: 820px) { .prose .thr-panel { grid-template-columns: 1fr; } }
  .prose .dt-metric.is-bad { grid-column: 1 / -1; border-color: #C30B0A; background: #FDF1F1; }
  .prose .dt-metric.is-bad strong { font-size: 22px; color: #9C0908; }
</style>

<style>
  .prose .cm-fig { margin: 24px 0; overflow-x: auto; width: 0; min-width: 100%; }
  .prose .cm-fig svg { width: 100%; max-width: 680px; display: block; margin: 0 auto; font-family: Helvetica, Arial, sans-serif; }
  .prose .pr-fig { max-width: 720px; }
  .prose .pr-count { margin-top: 0; }
  .prose .pr-count strong { font-size: 15px; }
  @media (max-width: 820px) { .prose .cm-fig svg { min-width: 520px; } }
  .prose .dt-table, .prose .cm-fig, .prose .dt-formula, .prose .math-display, .prose pre { position: relative; }
  .prose .dt-table td.hl, .prose .dt-table tr.hl td { background: #EEF4FB; }
</style>

<p class="lead">
  Модель обучена и выдаёт ответы. Насколько она хороша? Разберём на тех же десяти студентах,
  какие числа считают для классификатора, что измеряет каждое из них и как выбрать нужное для своей задачи.
</p>

<p>
  В прошлых статьях модели оценивались одним числом, долей верных ответов:
  <a href="article.html?slug=random-forest-full-cycle">у случайного леса</a> OOB-точность 7 из 10,
  на синтетических студентах 0,870. Здесь разберём, что за этим числом стоит и чего оно не показывает.
  Матрица ошибок, precision и recall, порог, F1, ROC и PR-кривые, log loss и калибровка строятся
  на одних и тех же десяти ответах леса, поэтому каждую метрику можно пересчитать руками.
</p>

<p>
  Студенты те же, что в <a href="article.html?slug=decision-tree-full-cycle">статье про дерево решений</a>.
  В последнем столбце ответ леса: какая доля деревьев проголосовала за «сдаст». Голосуют только деревья,
  которые этого студента при обучении не видели. Откуда берутся эти доли, объясняет часть 1.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Часы подготовки</th><th>Пропуски</th><th>Сдал</th><th>Доля голосов леса за «сдаст» (OOB)</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>нет</td><td>0,52</td></tr>
  <tr><td>2</td><td>4</td><td>7</td><td>нет</td><td>0,20</td></tr>
  <tr><td>3</td><td>6</td><td>4</td><td>нет</td><td>0,40</td></tr>
  <tr><td>4</td><td>8</td><td>1</td><td>да</td><td>0,27</td></tr>
  <tr><td>5</td><td>10</td><td>8</td><td>нет</td><td>0,15</td></tr>
  <tr><td>6</td><td>12</td><td>5</td><td>нет</td><td>0,58</td></tr>
  <tr><td>7</td><td>14</td><td>2</td><td>да</td><td>0,82</td></tr>
  <tr><td>8</td><td>16</td><td>6</td><td>да</td><td>0,59</td></tr>
  <tr><td>9</td><td>18</td><td>3</td><td>да</td><td>0,94</td></tr>
  <tr><td>10</td><td>20</td><td>4</td><td>да</td><td>0,85</td></tr>
</table></div>

## Часть 1. На ком проверять

<p>
  Полное дерево из первой статьи на своих десяти студентах не ошибается ни разу: 10 из 10.
  Это число ничего не говорит о новых студентах. Дерево росло, пока в каждом листе не остались студенты
  одного класса, то есть подогнало ответы под эти же десять строк.
</p>

<p>
  Честная проверка требует ответов на студентах, которых модель не видела. Есть три обычных способа их получить.
</p>

<ul>
  <li><b>Отложенная выборка.</b> Часть данных при обучении не используется и нужна только для проверки.
    Так делали в статьях про лес и бустинг: обучали на 100 синтетических студентах, проверяли на 5000.</li>
  <li><b>Кросс-валидация.</b> Данные делятся на <span class="math-inline" data-tex="k"></span> частей, модель обучается <span class="math-inline" data-tex="k"></span> раз, каждый раз без одной части,
    и отвечает на ту часть, которую не видела. При <span class="math-inline" data-tex="k = 10"></span> на десяти студентах в каждой части один студент:
    это leave-one-out (LOO), «оставь одного».</li>
  <li><b>OOB-оценка.</b> Есть только у моделей на бутстрэп-выборках вроде леса: про каждого студента голосуют
    деревья, в чью выборку он не попал.</li>
</ul>


<div class="dt-table"><table class="shape-table">
  <tr><th>Как получены ответы</th><th>Модель</th><th>Верных ответов</th></tr>
  <tr><td>на тех же студентах, на которых училась</td><td>полное дерево</td><td>10 из 10</td></tr>
  <tr><td>leave-one-out</td><td>полное дерево</td><td>9 из 10</td></tr>
  <tr><td>leave-one-out</td><td>пень «часы ≤ 13»</td><td>8 из 10</td></tr>
  <tr><td>leave-one-out</td><td>логистическая регрессия</td><td>7 из 10</td></tr>
  <tr><td>OOB</td><td>лес из 100 деревьев</td><td>7 из 10</td></tr>
</table></div>


<p>
  Полное дерево в режиме leave-one-out ошибается только на студенте 4: без него в данных нет сдавшего
  с 8 часами подготовки, и дерево отправляет его к несдавшим. Пень «часы ≤ 13» ошибается дважды: на студенте 4
  и на студенте 7, потому что без студента 7 порог пня сдвигается.
</p>

<p>
  Все метрики дальше считаются по двум столбцам: правильный ответ и ответ модели на студенте, которого она не видела.
  Ответы берём у леса, у него кроме ответа есть доля голосов, а она понадобится для порогов и ROC-кривой.
</p>


## Часть 2. Accuracy и где она ломается

<p>
  Доля верных ответов называется accuracy:
</p>

<div class="math-display" data-tex="\text{accuracy} = \frac{\text{верных ответов}}{\text{всех ответов}}"></div>

<p>
  У леса <span class="math-inline" data-tex="7/10 = 0{,}7"></span>. Чтобы понять, хорошо это или плохо, сравним с моделью, которая ничего не считает
  и всем отвечает «сдаст». Из наших десяти студентов сдали пятеро, поэтому она угадает половину: <span class="math-inline" data-tex="0{,}5"></span>.
  Лес лучше.
</p>

<p>
  На настоящем курсе не сдают обычно немногие. Если из 1000 студентов не сдают 50, та же модель
  получает accuracy <span class="math-inline" data-tex="950/1000 = 0{,}95"></span>.
</p>


<div class="dt-live" id="accLive">
  <div class="dt-live-head"><strong>Интерактив: модель, которая всем говорит «сдаст»</strong>
    <p>На потоке 1000 студентов. Двигайте долю несдавших и смотрите на accuracy модели, которая ничего не считает.</p></div>
  <div class="dt-live-grid">
    <div><svg id="accSvg" viewBox="0 0 540 392" role="img" aria-label="1000 студентов, несдавшие отмечены красным"></svg></div>
    <div class="dt-controls">
      <div class="dt-control"><label for="accR"><span>не сдают</span><output id="accN">50</output></label>
        <input id="accR" type="range" min="0" max="500" step="1" value="50"></div>
      <div class="dt-presets">
        <button type="button" data-n="500">как у нас: половина</button>
        <button type="button" data-n="50">50 из 1000</button>
        <button type="button" data-n="10">10 из 1000</button>
      </div>
      <div class="dt-metrics">
        <div class="dt-metric is-main"><span>accuracy модели «все сдадут»</span><strong id="accA">—</strong></div>
        <div class="dt-metric is-bad"><span>найдено несдавших</span><strong id="accF">—</strong></div>
      </div>
      <p class="dt-note">Модель угадывает всех, кто сдаст, и не находит ни одного, кто не сдаст.</p>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('accSvg');
  if (!svg) return;
  function el(n, a, t) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (t !== undefined) e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function H(k, n) {
    if (n === 0) return 0;
    var p = k / n, s = 0;
    [p, 1 - p].forEach(function (q) { if (q > 0) s -= q * Math.log2(q); });
    return s;
  }
  function tex(node, src, plain) {
    if (window.katex) window.katex.render(src, node, {throwOnError: false, displayMode: false});
    else node.textContent = plain;
  }
  var order = [], seed = 7;
  for (var i = 0; i < 1000; i++) order.push(i);
  for (var j = 999; j > 0; j--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    var k = seed % (j + 1), tmp = order[j]; order[j] = order[k]; order[k] = tmp;
  }
  var rank = []; order.forEach(function (v, r) { rank[v] = r; });
  svg.appendChild(el('rect', {x: 0, y: 0, width: 540, height: 392, fill: '#FFFFFF'}));
  svg.appendChild(el('text', {x: 10, y: 20, 'font-size': 14, fill: '#5E5850'}, 'модель отвечает «сдаст» всем 1000'));
  var dots = [];
  for (var q = 0; q < 1000; q++) {
    var c = el('circle', {cx: 16 + (q % 40) * 13, cy: 44 + Math.floor(q / 40) * 13, r: 4.6});
    svg.appendChild(c); dots.push(c);
  }
  var leg = el('g', {});
  leg.appendChild(el('circle', {cx: 16, cy: 382 - 4, r: 5, fill: '#73B222'}));
  leg.appendChild(el('text', {x: 26, y: 382, 'font-size': 13, fill: '#5E5850'}, 'сдаст: модель права'));
  leg.appendChild(el('circle', {cx: 196, cy: 382 - 4, r: 5, fill: '#C30B0A'}));
  leg.appendChild(el('text', {x: 206, y: 382, 'font-size': 13, fill: '#5E5850'}, 'не сдаст: модель ошиблась'));
  svg.appendChild(leg);
  var R = document.getElementById('accR');
  function update() {
    var n = +R.value;
    dots.forEach(function (d, q) { d.setAttribute('fill', rank[q] < n ? '#C30B0A' : '#73B222'); });
    document.getElementById('accN').textContent = n + ' из 1000';
    document.getElementById('accA').textContent = fmt((1000 - n) / 10, 1) + ' %';
    document.getElementById('accF').textContent = '0 из ' + n;
  }
  R.addEventListener('input', update);
  document.querySelectorAll('#accLive [data-n]').forEach(function (b) {
    b.addEventListener('click', function () { R.value = b.getAttribute('data-n'); update(); });
  });
  update();
})();
</script>


<p>
  При 50 несдавших модель ошибается на 5 % студентов, и все её ошибки приходятся на тех, кого она должна была найти.
  Accuracy этого не видит: она складывает верные ответы по обоим классам, и большой класс перевешивает.
  Когда один класс встречается намного реже другого, accuracy показывает в основном, насколько он редкий.
</p>

<p>
  Нужно считать ошибки по отдельности: сколько сдавших модель назвала несдавшими и сколько несдавших
  назвала сдавшими. Для этого есть матрица ошибок.
</p>


## Часть 3. Матрица ошибок

<p>
  Разложим десять ответов леса по таблице 2 × 2: строка показывает правильный ответ, столбец ответ леса.
</p>


<div class="stage" id="stageMatrix" tabindex="0">
  <div class="stage-figure">
<svg id="cmSvg" viewBox="0 0 960 560" role="img" aria-label="Матрица ошибок леса на десяти студентах"><style>#cmSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="560" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<text x="30" y="26" font-size="15" fill="#5E5850" text-anchor="start" font-weight="400">OOB-голоса леса за «сдаст» и ответ при пороге 0,5</text>
<g data-key="cards_tp"><circle cx="618" cy="72" r="17" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="618" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="618" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,82</text><rect x="578" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="618" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><circle cx="710" cy="72" r="17" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="710" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="710" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,59</text><rect x="670" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="710" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><circle cx="802" cy="72" r="17" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="802" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="802" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,94</text><rect x="762" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="802" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><circle cx="894" cy="72" r="17" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="894" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="894" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,85</text><rect x="854" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="894" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text></g>
<g data-key="cards_fn"><circle cx="342" cy="72" r="17" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="342" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="342" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,27</text><rect x="302" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="342" y="146" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text></g>
<g data-key="cards_fp"><circle cx="66" cy="72" r="17" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="66" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="66" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,52</text><rect x="26" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="66" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><circle cx="526" cy="72" r="17" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="526" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="526" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,58</text><rect x="486" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="526" y="146" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text></g>
<g data-key="cards_tn"><circle cx="158" cy="72" r="17" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="158" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="158" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,20</text><rect x="118" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="158" y="146" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text><circle cx="250" cy="72" r="17" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="250" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="250" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,40</text><rect x="210" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="250" y="146" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text><circle cx="434" cy="72" r="17" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="434" y="77.5" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="434" y="116" font-size="15" fill="#111111" text-anchor="middle" font-weight="400">0,15</text><rect x="394" y="128" width="80" height="26" rx="13" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="434" y="146" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text></g>
<g data-key="frame"><text x="570" y="192" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">ответ леса</text><text x="430" y="220" font-size="16" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><text x="710" y="220" font-size="16" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text><text x="276" y="301" font-size="16" fill="#5F9420" text-anchor="end" font-weight="700">сдал</text><text x="276" y="421" font-size="16" fill="#9C0908" text-anchor="end" font-weight="700">не сдал</text><text x="196" y="356" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 196 356)">на самом деле</text><rect x="290" y="236" width="280" height="120" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><rect x="570" y="236" width="280" height="120" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><rect x="290" y="356" width="280" height="120" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><rect x="570" y="356" width="280" height="120" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/></g>
<g data-key="names" data-only="1"><text x="302" y="262" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TP</text><text x="336" y="262" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">верно назван сдавшим</text><text x="582" y="262" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FN</text><text x="616" y="262" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">сдавший пропущен</text><text x="302" y="382" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FP</text><text x="336" y="382" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">ложно назван сдавшим</text><text x="582" y="382" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TN</text><text x="616" y="382" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">верно назван несдавшим</text></g>
<g data-key="names2" data-only="1"><text x="302" y="262" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TN</text><text x="582" y="262" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FP</text><text x="302" y="382" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FN</text><text x="582" y="382" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TP</text></g>
<g data-key="tp"><circle cx="320" cy="308" r="15" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="313" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="358" cy="308" r="15" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="358" y="313" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="396" cy="308" r="15" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="396" y="313" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="434" cy="308" r="15" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="434" y="313" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="552" y="322" font-size="36" fill="#111111" text-anchor="end" font-weight="700">4</text></g>
<g data-key="hl_tp" data-only="1"><rect x="292" y="238" width="276" height="116" rx="4" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="574" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="666" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="758" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="850" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="fn"><circle cx="600" cy="308" r="15" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="600" y="313" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="832" y="322" font-size="36" fill="#111111" text-anchor="end" font-weight="700">1</text></g>
<g data-key="hl_fn" data-only="1"><rect x="572" y="238" width="276" height="116" rx="4" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="298" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="fp"><circle cx="320" cy="428" r="15" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="433" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="358" cy="428" r="15" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="358" y="433" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="552" y="442" font-size="36" fill="#111111" text-anchor="end" font-weight="700">2</text></g>
<g data-key="hl_fp" data-only="1"><rect x="292" y="358" width="276" height="116" rx="4" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="22" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="482" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="tn"><circle cx="600" cy="428" r="15" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="600" y="433" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="638" cy="428" r="15" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="638" y="433" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="676" cy="428" r="15" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="676" y="433" font-size="14" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="832" y="442" font-size="36" fill="#111111" text-anchor="end" font-weight="700">3</text></g>
<g data-key="hl_tn" data-only="1"><rect x="572" y="358" width="276" height="116" rx="4" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="114" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="206" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="390" y="44" width="88" height="118" rx="10" fill="none" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="diag" data-only="1"><rect x="292" y="238" width="276" height="116" rx="4" fill="none" stroke="#73B222" stroke-width="3"/><rect x="572" y="358" width="276" height="116" rx="4" fill="none" stroke="#73B222" stroke-width="3"/><foreignObject x="260" y="486" width="620" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{accuracy} = \dfrac{TP + TN}{\text{все}} = \dfrac{4 + 3}{10} = 0{,}7"></div></foreignObject></g>
<g data-key="flip" data-only="1"><text x="570" y="510" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="400">Положительный класс теперь «не сдал»: те же студенты, другие имена клеток</text><text x="570" y="534" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">TP = 3, FN = 2, FP = 1, TN = 4</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cards_tp cards_fn cards_fp cards_tn" data-focus="cards_tp cards_fn cards_fp cards_tn">
      <div class="step-kicker">Шаг 1 · ответы леса</div>
      <h4>Что лес сказал про каждого студента</h4>
      <p>Это лес из прошлой статьи. Про каждого студента голосуют только деревья, которые его не видели (OOB). Под кружком доля голосов «сдаст»: студента 1 так оценили 22 дерева из 42, отсюда <span class="math-inline" data-tex="0{,}52"></span>.</p>
<p>Цвет кружка показывает, сдал ли студент на самом деле. Ответ леса ниже: «сдаст», если доля больше <span class="math-inline" data-tex="0{,}5"></span>.</p>
    </div>
    <div class="step-panel" data-on="cards_tp cards_fn cards_fp cards_tn frame names" data-focus="frame">
      <div class="step-kicker">Шаг 2 · две оси</div>
      <h4>Таблица на четыре клетки</h4>
      <p>Строка таблицы — что было на самом деле, столбец — что ответил лес. Каждый студент попадает ровно в одну клетку.</p>
<p>Класс, который мы ищем, называют положительным (P), второй класс — отрицательным (N). Пока ищем сдавших. Первая буква клетки говорит, прав ли лес: T (true) — прав, F (false) — ошибся. Вторая буква — что он ответил.</p>
    </div>
    <div class="step-panel" data-on="cards_tp frame names tp hl_tp" data-focus="tp cards_tp">
      <div class="step-kicker">Шаг 3 · TP</div>
      <h4>Сдали, и лес сказал «сдаст»</h4>
      <p>Студенты 7, 8, 9 и 10. У всех доля голосов выше <span class="math-inline" data-tex="0{,}5"></span>, у студента 9 даже <span class="math-inline" data-tex="0{,}94"></span>.</p>
<p>Это true positive: лес назвал студента положительным и угадал. <span class="math-inline" data-tex="TP = 4"></span>.</p>
    </div>
    <div class="step-panel" data-on="cards_tn frame names tp tn hl_tn" data-focus="tn cards_tn">
      <div class="step-kicker">Шаг 4 · TN</div>
      <h4>Не сдали, и лес сказал «не сдаст»</h4>
      <p>Студенты 2, 3 и 5: доли <span class="math-inline" data-tex="0{,}20"></span>, <span class="math-inline" data-tex="0{,}40"></span> и <span class="math-inline" data-tex="0{,}15"></span>. Лес снова прав.</p>
<p>Это true negative, <span class="math-inline" data-tex="TN = 3"></span>.</p>
    </div>
    <div class="step-panel" data-on="cards_fp frame names tp tn fp hl_fp" data-focus="fp cards_fp">
      <div class="step-kicker">Шаг 5 · FP</div>
      <h4>Не сдали, а лес сказал «сдаст»</h4>
      <p>Студенты 1 и 6. За них проголосовало чуть больше половины деревьев: <span class="math-inline" data-tex="0{,}52"></span> и <span class="math-inline" data-tex="0{,}58"></span>. Если по ответу леса решать, кому нужна помощь перед экзаменом, этим двоим её не предложат.</p>
<p>Это false positive: лес назвал студента положительным и ошибся. <span class="math-inline" data-tex="FP = 2"></span>.</p>
    </div>
    <div class="step-panel" data-on="cards_fn frame names tp tn fp fn hl_fn" data-focus="fn cards_fn">
      <div class="step-kicker">Шаг 6 · FN</div>
      <h4>Сдал, а лес сказал «не сдаст»</h4>
      <p>Студент 4: всего 8 часов подготовки, но 1 пропуск, и он сдал. За «сдаст» проголосовали 10 деревьев из 37, доля <span class="math-inline" data-tex="0{,}27"></span>.</p>
<p>Это false negative: лес назвал студента отрицательным и ошибся. <span class="math-inline" data-tex="FN = 1"></span>.</p>
    </div>
    <div class="step-panel" data-on="cards_tp cards_fn cards_fp cards_tn frame names tp tn fp fn diag" data-focus="diag tp tn">
      <div class="step-kicker">Шаг 7 · сумма</div>
      <h4>Accuracy — это диагональ</h4>
      <p>Верные ответы лежат на диагонали: <span class="math-inline" data-tex="4 + 3 = 7"></span> из 10. Это та же OOB-точность <span class="math-inline" data-tex="0{,}7"></span>, что в статье про лес.</p>
<p>Accuracy складывает диагональ и не разбирает ошибки: два студента в FP и один в FN дают одно число 0,3. Следующие метрики считают клетки по отдельности.</p>
    </div>
    <div class="step-panel" data-on="cards_tp cards_fn cards_fp cards_tn frame names2 tp tn fp fn flip" data-focus="names2 flip">
      <div class="step-kicker">Шаг 8 · другой класс</div>
      <h4>Если искать тех, кто не сдаст</h4>
      <p>Деканату нужны те, кто может не сдать. Делаем положительным классом «не сдал». Студенты остаются в своих клетках, меняются только названия: TP и TN меняются местами, FP и FN тоже.</p>
<p>Accuracy от этого не меняется, она по-прежнему <span class="math-inline" data-tex="0{,}7"></span>. Precision и recall из следующей части поменяются, поэтому положительный класс называют до того, как считать метрики.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  В sklearn матрицу возвращает <code>confusion_matrix(y, pred)</code>. Строки там тоже соответствуют правильным
  ответам, а столбцы ответам модели, но классы идут по возрастанию метки: сначала 0 («не сдал»), потом 1.
  Поэтому первая строка выглядит как <code>[TN, FP]</code>, а вторая как <code>[FN, TP]</code>, то есть
  порядок клеток обратный по сравнению со схемой выше. Строка <code>confusion_matrix(y, pred).ravel()</code>
  даёт четыре числа в порядке TN, FP, FN, TP. Код целиком в части 12.
</p>


## Часть 4. Precision и recall

<p>
  Accuracy складывает обе ошибки. Метрики этой части считают их отдельно и отвечают на два разных вопроса о положительном классе.
</p>


<div class="stage" id="stagePR" tabindex="0">
  <div class="stage-figure">
<svg id="prSvg" viewBox="0 0 960 400" role="img" aria-label="Precision и recall на матрице ошибок леса"><style>#prSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="400" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="base"><text x="520" y="40" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">ответ леса</text><text x="395" y="74" font-size="16" fill="#5F9420" text-anchor="middle" font-weight="700">сдаст</text><text x="645" y="74" font-size="16" fill="#9C0908" text-anchor="middle" font-weight="700">не сдаст</text><text x="256" y="153" font-size="16" fill="#5F9420" text-anchor="end" font-weight="700">сдал</text><text x="256" y="257" font-size="16" fill="#9C0908" text-anchor="end" font-weight="700">не сдал</text><text x="176" y="200" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 176 200)">на самом деле</text><rect x="270" y="96" width="250" height="104" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><circle cx="300" cy="164" r="14" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="300" y="168.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="336" cy="164" r="14" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="336" y="168.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="372" cy="164" r="14" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="372" y="168.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="408" cy="164" r="14" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="408" y="168.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="502" y="176" font-size="34" fill="#111111" text-anchor="end" font-weight="700">4</text><rect x="520" y="96" width="250" height="104" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><circle cx="550" cy="164" r="14" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="550" y="168.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="752" y="176" font-size="34" fill="#111111" text-anchor="end" font-weight="700">1</text><rect x="270" y="200" width="250" height="104" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><circle cx="300" cy="268" r="14" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="300" y="272.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="336" cy="268" r="14" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="336" y="272.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="502" y="280" font-size="34" fill="#111111" text-anchor="end" font-weight="700">2</text><rect x="520" y="200" width="250" height="104" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.4"/><circle cx="550" cy="268" r="14" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="550" y="272.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="586" cy="268" r="14" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="586" y="272.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="622" cy="268" r="14" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="622" y="272.68" font-size="13" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="752" y="280" font-size="34" fill="#111111" text-anchor="end" font-weight="700">3</text></g>
<g data-key="names" data-only="1"><text x="282" y="122" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TP</text><text x="532" y="122" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FN</text><text x="282" y="226" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FP</text><text x="532" y="226" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TN</text></g>
<g data-key="names2" data-only="1"><text x="282" y="122" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TN</text><text x="532" y="122" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FP</text><text x="282" y="226" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">FN</text><text x="532" y="226" font-size="17" fill="#2A5E9B" text-anchor="start" font-weight="700">TP</text></g>
<g data-key="col_p" data-only="1"><rect x="267" y="93" width="256" height="214" rx="6" fill="none" stroke="#3576C0" stroke-width="3.2"/><foreignObject x="160" y="330" width="640" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{precision} = \dfrac{TP}{TP + FP} = \dfrac{4}{4 + 2} \approx 0{,}667"></div></foreignObject></g>
<g data-key="row_p" data-only="1"><rect x="267" y="93" width="506" height="110" rx="6" fill="none" stroke="#3576C0" stroke-width="3.2"/><foreignObject x="160" y="330" width="640" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{recall} = \dfrac{TP}{TP + FN} = \dfrac{4}{4 + 1} = 0{,}8"></div></foreignObject></g>
<g data-key="row_n" data-only="1"><rect x="267" y="197" width="506" height="110" rx="6" fill="none" stroke="#C29E08" stroke-width="3.2"/><foreignObject x="80" y="330" width="440" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{specificity} = \dfrac{TN}{TN + FP} = \dfrac{3}{5} = 0{,}6"></div></foreignObject><foreignObject x="500" y="330" width="400" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{FPR} = \dfrac{FP}{FP + TN} = \dfrac{2}{5} = 0{,}4"></div></foreignObject></g>
<g data-key="flip_p" data-only="1"><rect x="517" y="93" width="256" height="214" rx="6" fill="none" stroke="#3576C0" stroke-width="3.2"/><foreignObject x="160" y="330" width="640" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{precision} = \dfrac{TP}{TP + FP} = \dfrac{3}{3 + 1} = 0{,}75"></div></foreignObject></g>
<g data-key="flip_r" data-only="1"><rect x="267" y="197" width="506" height="110" rx="6" fill="none" stroke="#3576C0" stroke-width="3.2"/><foreignObject x="160" y="330" width="640" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{recall} = \dfrac{TP}{TP + FN} = \dfrac{3}{3 + 2} = 0{,}6"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="base names" data-focus="base">
      <div class="step-kicker">Шаг 1 · матрица</div>
      <h4>Та же матрица, положительный класс «сдал»</h4>
      <p>Accuracy смешала обе ошибки. Precision и recall смотрят на положительный класс с двух сторон: один считает по столбцу матрицы, другой по строке.</p>
    </div>
    <div class="step-panel" data-on="base names col_p" data-focus="col_p">
      <div class="step-kicker">Шаг 2 · precision</div>
      <h4>Precision: сколько из названных угадано</h4>
      <p>Берём столбец «сдаст»: всех, кому лес дал этот ответ. Их шесть, и сдали из них четверо. Студенты 1 и 6 попали в столбец по ошибке.</p>
<p>Precision отвечает на вопрос: если лес сказал «сдаст», насколько этому можно верить. Здесь <span class="math-inline" data-tex="4/6 \approx 0{,}667"></span>.</p>
<p>По-русски precision называют точностью, но точностью часто называют и accuracy, как OOB-точность в статье про лес. Поэтому здесь метрики называются по-английски.</p>
    </div>
    <div class="step-panel" data-on="base names row_p" data-focus="row_p">
      <div class="step-kicker">Шаг 3 · recall</div>
      <h4>Recall: сколько из положительных найдено</h4>
      <p>Теперь строка «сдал»: все, кто сдал на самом деле. Их пятеро, и лес назвал сдавшими четверых. Студента 4 он пропустил.</p>
<p>Recall, или полнота, отвечает на вопрос, какую долю положительных модель нашла. Здесь <span class="math-inline" data-tex="4/5 = 0{,}8"></span>. Recall ещё называют чувствительностью (sensitivity) и TPR, true positive rate.</p>
    </div>
    <div class="step-panel" data-on="base names row_n" data-focus="row_n">
      <div class="step-kicker">Шаг 4 · вторая строка</div>
      <h4>Та же доля для отрицательных</h4>
      <p>Нижняя строка — студенты, которые не сдали. Доля из них, кого лес правильно назвал несдавшими, — специфичность (specificity): <span class="math-inline" data-tex="3/5"></span>. Остаток <span class="math-inline" data-tex="2/5"></span> — доля ложных тревог, FPR (false positive rate).</p>
<p>TPR и FPR пригодятся в части 7: ROC-кривая строится в этих двух осях.</p>
    </div>
    <div class="step-panel" data-on="base names2 flip_p" data-focus="flip_p">
      <div class="step-kicker">Шаг 5 · другой класс</div>
      <h4>Precision, когда ищем несдавших</h4>
      <p>Сделаем положительным классом «не сдал», как в конце части 3. Клетки поменялись именами, и precision теперь считается по столбцу «не сдаст»: из четверых с этим ответом не сдали трое, студент 4 попал туда по ошибке.</p>
<p>Precision <span class="math-inline" data-tex="3/4 = 0{,}75"></span>, а не <span class="math-inline" data-tex="0{,}667"></span>: другой класс, другой столбец.</p>
    </div>
    <div class="step-panel" data-on="base names2 flip_r" data-focus="flip_r">
      <div class="step-kicker">Шаг 6 · другой класс</div>
      <h4>Recall, когда ищем несдавших</h4>
      <p>Recall теперь считается по строке «не сдал»: из пяти несдавших лес нашёл троих (2, 3, 5), а студентов 1 и 6 пропустил.</p>
<p>Получилось <span class="math-inline" data-tex="3/5 = 0{,}6"></span>: это та же специфичность из шага 4. Recall одного класса равен специфичности другого.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Какая из двух метрик важнее, зависит от того, что стоит за ошибками. Пусть деканат ищет студентов,
  которые не сдадут, то есть положительный класс «не сдал».
</p>

<ul>
  <li>Модель пропустила такого студента (FN). Ему не предложили помощь, и он завалил экзамен.</li>
  <li>Модель назвала отстающим сильного студента (FP). Он пришёл на консультацию, которая ему была не нужна,
    и занял час тьютора.</li>
</ul>

<p>
  Консультация стоит дёшево, провал дорого, поэтому деканату важнее recall: найти как можно больше
  несдавших, даже ценой лишних приглашений. Если бы по тому же ответу модели студента не допускали
  к экзамену, дорогой стала бы ошибка FP, и смотреть пришлось бы на precision.
</p>

<p>
  Одной из двух метрик мало, потому что каждую можно накрутить. Вернёмся к потоку из части 2:
  1000 студентов, 50 не сдают, положительный класс «не сдал».
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Модель на потоке</th><th>TP</th><th>FP</th><th>FN</th><th>recall</th><th>precision</th><th>accuracy</th></tr>
  <tr><td>все «сдаст»</td><td>0</td><td>0</td><td>50</td><td><span class="math-inline" data-tex="0/50 = 0"></span></td><td><span class="math-inline" data-tex="0/0"></span>, не определена</td><td><span class="math-inline" data-tex="0{,}95"></span></td></tr>
  <tr><td>все «не сдаст»</td><td>50</td><td>950</td><td>0</td><td><span class="math-inline" data-tex="50/50 = 1"></span></td><td><span class="math-inline" data-tex="50/1000 = 0{,}05"></span></td><td><span class="math-inline" data-tex="0{,}05"></span></td></tr>
</table></div>


<p>
  Модель «все сдадут» не называет несдавшим никого. Её recall равен нулю, а precision не определена:
  в столбце «не сдаст» никого нет, получается <span class="math-inline" data-tex="0/0"></span>. sklearn в таком случае возвращает 0 и выводит
  предупреждение; параметр <code>zero_division</code> задаёт, что возвращать.
  Модель «никто не сдаст» находит всех, но из её ответов «не сдаст» верны только 5 %.
  Хорошая модель должна держать обе метрики высокими.
</p>


## Часть 5. Порог

<p>
  Лес, логистическая регрессия и бустинг выдают не только ответ, но и оценку: долю голосов или вероятность.
  Ответ получается из оценки сравнением с порогом. Порог <span class="math-inline" data-tex="0{,}5"></span> стоит по умолчанию в <code>predict</code>,
  но это только договорённость, и его можно двигать.
</p>


<div class="dt-live" id="thrLive">
  <div class="dt-live-head"><strong>Интерактив: порог над голосами леса</strong>
    <p>Студент получает ответ «сдаст», если доля голосов больше порога. Двигайте порог или щёлкните по оси.</p></div>
  <div class="thr-fig"><svg id="thrSvg" viewBox="0 0 560 330" role="img" aria-label="Десять студентов на оси доли голосов и порог"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="thrR"><span>порог</span><output id="thrT">0,50</output></label>
        <input id="thrR" type="range" min="0" max="1" step="0.01" value="0.5"></div>
      <div class="dt-presets">
        <button type="button" data-t="0.5">0,5 как в лесу</button>
        <button type="button" data-t="0.25">0,25</button>
        <button type="button" data-t="0.6">0,6</button>
      </div>
    </div>
    <div class="cm-grid" id="thrCm"></div>
    <div class="dt-metrics thr-metrics">
      <div class="dt-metric"><span>precision</span><strong id="thrP">—</strong></div>
      <div class="dt-metric"><span>recall</span><strong id="thrRc">—</strong></div>
      <div class="dt-metric"><span>accuracy</span><strong id="thrA">—</strong></div>
      <div class="dt-metric"><span>ошибок</span><strong id="thrE">—</strong></div>
    </div>
  </div>
  <div class="thr-formulas"><div class="dt-formula" id="thrF1"></div><div class="dt-formula" id="thrF2"></div></div>
</div>
<script>
(function () {
  var svg = document.getElementById('thrSvg');
  if (!svg) return;
  function el(n, a, t) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (t !== undefined) e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function H(k, n) {
    if (n === 0) return 0;
    var p = k / n, s = 0;
    [p, 1 - p].forEach(function (q) { if (q > 0) s -= q * Math.log2(q); });
    return s;
  }
  function tex(node, src, plain) {
    if (window.katex) window.katex.render(src, node, {throwOnError: false, displayMode: false});
    else node.textContent = plain;
  }
  var D = [[0.524, 0], [0.2, 0], [0.4, 0], [0.27, 1], [0.154, 0], [0.581, 0], [0.816, 1], [0.594, 1], [0.938, 1], [0.848, 1]];
  var L = 80, W = 460, LANE = {1: 132, 0: 238}, UP = {1: 1, 9: 1};   // students 2 and 10 sit above their lane
  function sx(v) { return L + v * W; }
  var R = document.getElementById('thrR');
  function draw(t) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 560, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('rect', {x: L, y: 50, width: sx(t) - L, height: 240, fill: '#FCE9E9'}));
    svg.appendChild(el('rect', {x: sx(t), y: 50, width: L + W - sx(t), height: 240, fill: '#EEF6E2'}));
    if (t > 0.26) svg.appendChild(el('text', {x: L + 6, y: 66, 'font-size': 12, fill: '#9C0908'}, 'ответ «не сдаст»'));
    if (t < 0.72) svg.appendChild(el('text', {x: L + W - 6, y: 66, 'font-size': 12, fill: '#5F9420', 'text-anchor': 'end'}, 'ответ «сдаст»'));
    svg.appendChild(el('text', {x: 6, y: LANE[1] + 5, 'font-size': 13, 'font-weight': 700, fill: '#5F9420'}, 'сдали'));
    svg.appendChild(el('text', {x: 6, y: LANE[0] + 5, 'font-size': 13, 'font-weight': 700, fill: '#9C0908'}, 'не сдали'));
    svg.appendChild(el('line', {x1: L, y1: 185, x2: L + W, y2: 185, stroke: '#D8D4C8', 'stroke-width': 1.2}));
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      svg.appendChild(el('line', {x1: sx(v), y1: 290, x2: sx(v), y2: 296, stroke: '#5E5850'}));
      svg.appendChild(el('text', {x: sx(v), y: 311, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, v === 0 || v === 1 ? String(v) : fmt(v, 2).replace(/0$/, '')));
    });
    svg.appendChild(el('text', {x: L + W, y: 327, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, 'доля голосов «сдаст»'));
    svg.appendChild(el('line', {x1: sx(t), y1: 40, x2: sx(t), y2: 290, stroke: '#C29E08', 'stroke-width': 3}));
    var right = t > 0.8;
    svg.appendChild(el('text', {x: sx(t) + (right ? -6 : 6), y: 34, 'text-anchor': right ? 'end' : 'start', 'font-size': 14,
                                'font-weight': 700, fill: '#8F7406'}, 'порог ' + fmt(t, 2)));
    D.forEach(function (d, i) {
      var up = UP[i], x = sx(d[0]), y = LANE[d[1]] - (up ? 30 : 0), wrong = (d[0] > t ? 1 : 0) !== d[1];
      if (wrong) svg.appendChild(el('circle', {cx: x, cy: y, r: 18, fill: 'none', stroke: '#3576C0', 'stroke-width': 2.4, 'stroke-dasharray': '4 3'}));
      svg.appendChild(el('circle', {cx: x, cy: y, r: 13, fill: d[1] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: x, y: y + 4.5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
      svg.appendChild(el('text', {x: x, y: up ? y - 23 : y + 32, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, fmt(d[0], 2)));
    });
  }
  function ratio(a, b) { return b ? fmt(a / b, 3) + '<small>' + a + '/' + b + '</small>' : '—<small>0/0, не определена</small>'; }
  function texr(a, b) { return b ? '\\dfrac{' + a + '}{' + b + '} = ' + fmt(a / b, 3).replace(',', '{,}') : '\\dfrac{0}{0}'; }
  function update() {
    var t = +R.value, c = {TP: 0, FP: 0, FN: 0, TN: 0};
    D.forEach(function (d) { var p = d[0] > t ? 1 : 0; c[(p === d[1] ? 'T' : 'F') + (p ? 'P' : 'N')]++; });
    document.getElementById('thrT').textContent = fmt(t, 2);
    document.getElementById('thrCm').innerHTML =
      '<div></div><div class="cm-h">«сдаст»</div><div class="cm-h">«не сдаст»</div>' +
      '<div class="cm-row">сдал</div><div class="cm-cell ok">TP<b>' + c.TP + '</b></div><div class="cm-cell bad">FN<b>' + c.FN + '</b></div>' +
      '<div class="cm-row">не сдал</div><div class="cm-cell bad">FP<b>' + c.FP + '</b></div><div class="cm-cell ok">TN<b>' + c.TN + '</b></div>';
    document.getElementById('thrP').innerHTML = ratio(c.TP, c.TP + c.FP);
    document.getElementById('thrRc').innerHTML = ratio(c.TP, c.TP + c.FN);
    document.getElementById('thrA').innerHTML = ratio(c.TP + c.TN, 10);
    document.getElementById('thrE').innerHTML = (c.FP + c.FN) + '<small>FP ' + c.FP + ' + FN ' + c.FN + '</small>';
    tex(document.getElementById('thrF1'), '\\text{precision} = \\frac{TP}{TP + FP} = ' + texr(c.TP, c.TP + c.FP), 'precision');
    tex(document.getElementById('thrF2'), '\\text{recall} = \\frac{TP}{TP + FN} = ' + texr(c.TP, c.TP + c.FN), 'recall');
    draw(t);
  }
  R.addEventListener('input', update);
  svg.addEventListener('click', function (e) {
    var r = svg.getBoundingClientRect(), v = ((e.clientX - r.left) * 560 / r.width - L) / W;
    R.value = Math.max(0, Math.min(1, Math.round(v * 100) / 100)); update();
  });
  document.querySelectorAll('#thrLive [data-t]').forEach(function (b) {
    b.addEventListener('click', function () { R.value = b.getAttribute('data-t'); update(); });
  });
  update();
})();
</script>


<p>
  При пороге 0,25 лес находит всех пятерых сдавших (<span class="math-inline" data-tex="\text{recall} = 1"></span>), но трое из восьми студентов,
  которых он назвал сдавшими, на самом деле не сдали: <span class="math-inline" data-tex="\text{precision} = 5/8"></span>. При пороге 0,6 ошибочных
  «сдаст» нет совсем (<span class="math-inline" data-tex="\text{precision} = 1"></span>), зато двое сдавших, 4 и 8, получили «не сдаст».
</p>

<p>
  Удобно опускать порог через студентов по одному, от самой высокой доли голосов к самой низкой.
  Каждый студент, прошедший под порог, получает «сдаст» и добавляется в TP, если сдал, или в FP, если не сдал.
  Строка порога 0,5 выделена.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Сколько студентов получили «сдаст»</th><th>Кто добавился</th><th>TP</th><th>FP</th><th>precision</th><th>recall</th><th>FPR</th><th>F1</th></tr>
  <tr><td>0</td><td>—</td><td>0</td><td>0</td><td>—</td><td>0</td><td>0</td><td>—</td></tr>
  <tr><td>1</td><td>9 (сдал)</td><td>1</td><td>0</td><td>1,000</td><td>0,2</td><td>0,0</td><td>0,333</td></tr>
  <tr><td>2</td><td>10 (сдал)</td><td>2</td><td>0</td><td>1,000</td><td>0,4</td><td>0,0</td><td>0,571</td></tr>
  <tr><td>3</td><td>7 (сдал)</td><td>3</td><td>0</td><td>1,000</td><td>0,6</td><td>0,0</td><td>0,750</td></tr>
  <tr><td>4</td><td>8 (сдал)</td><td>4</td><td>0</td><td>1,000</td><td>0,8</td><td>0,0</td><td>0,889</td></tr>
  <tr><td>5</td><td>6 (не сдал)</td><td>4</td><td>1</td><td>0,800</td><td>0,8</td><td>0,2</td><td>0,800</td></tr>
  <tr class="hl"><td>6</td><td>1 (не сдал)</td><td>4</td><td>2</td><td>0,667</td><td>0,8</td><td>0,4</td><td>0,727</td></tr>
  <tr><td>7</td><td>3 (не сдал)</td><td>4</td><td>3</td><td>0,571</td><td>0,8</td><td>0,6</td><td>0,667</td></tr>
  <tr><td>8</td><td>4 (сдал)</td><td>5</td><td>3</td><td>0,625</td><td>1,0</td><td>0,6</td><td>0,769</td></tr>
  <tr><td>9</td><td>2 (не сдал)</td><td>5</td><td>4</td><td>0,556</td><td>1,0</td><td>0,8</td><td>0,714</td></tr>
  <tr><td>10</td><td>5 (не сдал)</td><td>5</td><td>5</td><td>0,500</td><td>1,0</td><td>1,0</td><td>0,667</td></tr>
</table></div>


<p>
  По этой таблице видно, что поднимать recall можно только вместе с ростом FP. Лучший F1 (о нём в части 6)
  получается после четырёх студентов, при пороге около 0,59: там лес не ошибается ни на одном несдавшем.
  Но порог 0,59 подобран на тех же десяти ответах, на которых мы его оцениваем, а это та же ошибка, что у дерева
  в части 1. Порог выбирают на отдельных данных (валидационной выборке или кросс-валидацией), а итоговые
  метрики сообщают на тесте, который в выборе порога не участвовал.
</p>

<p>
  На потоке, где не сдают около 5 %, порог 0,5 работает плохо. Логистическая регрессия, обученная
  на 3000 синтетических студентов, при пороге 0,5 находит только 26 % несдавших. Порог, подобранный
  кросс-валидацией по F1, равен 0,195, и при нём модель находит 57 %. Код подбора в части 12.
</p>


## Часть 6. F1 и F-бета

<p>
  Чтобы сравнивать модели или подбирать порог, удобно иметь одно число вместо двух. Простое среднее
  <span class="math-inline" data-tex="(P + R)/2"></span> для этого не годится. На потоке из части 4 модель «никто не сдаст» имеет
  <span class="math-inline" data-tex="P = 0{,}05"></span> и <span class="math-inline" data-tex="R = 1"></span>, среднее <span class="math-inline" data-tex="0{,}525"></span>. Логистическая регрессия с подобранным порогом находит 57 % несдавших
  при precision около <span class="math-inline" data-tex="0{,}37"></span>, её среднее <span class="math-inline" data-tex="0{,}47"></span>. Получается, что модель, которая не отличает
  одного студента от другого, по среднему обходит рабочую модель.
</p>

<p>
  F1 берёт вместо этого среднее гармоническое:
</p>

<div class="math-display" data-tex="F_1 = \frac{2}{\dfrac{1}{P} + \dfrac{1}{R}} = \frac{2PR}{P + R}"></div>

<p>
  Если одно из чисел близко к нулю, его обратная величина огромна, и F1 тоже падает почти до нуля.
  У модели «никто не сдаст» <span class="math-inline" data-tex="F_1 = 2 \cdot 0{,}05 \cdot 1 / 1{,}05 \approx 0{,}095"></span>, у логистической
  регрессии около <span class="math-inline" data-tex="0{,}45"></span>.
</p>

<p>
  Подставим <span class="math-inline" data-tex="1/P = (TP + FP)/TP"></span> и <span class="math-inline" data-tex="1/R = (TP + FN)/TP"></span>, и F1 запишется прямо через клетки матрицы:
</p>

<div class="math-display" data-tex="F_1 = \frac{2\,TP}{2\,TP + FP + FN}"></div>

<p>
  У леса при пороге 0,5 это <span class="math-inline" data-tex="8/(8 + 2 + 1) = 8/11 \approx 0{,}727"></span>. В формуле нет TN: F1 смотрит только
  на положительный класс и не замечает, сколько отрицательных модель распознала верно.
</p>

<p>
  Когда одна ошибка дороже другой, берут F-бета. Параметр <span class="math-inline" data-tex="\beta"></span> показывает, во сколько раз recall
  важнее precision:
</p>

<div class="math-display" data-tex="F_\beta = \frac{(1 + \beta^2)\,P\,R}{\beta^2 P + R}"></div>

<p>
  При <span class="math-inline" data-tex="\beta = 2"></span> важнее recall, у леса <span class="math-inline" data-tex="F_2 \approx 0{,}769"></span>. При <span class="math-inline" data-tex="\beta = 0{,}5"></span> важнее precision,
  <span class="math-inline" data-tex="F_{0{,}5} \approx 0{,}690"></span>. Recall у леса выше precision, поэтому <span class="math-inline" data-tex="F_2"></span> у него больше, чем <span class="math-inline" data-tex="F_{0{,}5}"></span>.
  Деканату из части 4 подошла бы <span class="math-inline" data-tex="F_2"></span>.
</p>


<div class="dt-live" id="f1Live">
  <div class="dt-live-head"><strong>Интерактив: precision, recall и их среднее</strong>
    <p>Двигайте precision и recall. Линии на квадрате — уровни F-меры, точка — текущая модель.</p></div>
  <div class="dt-live-grid">
    <div><svg id="f1Svg" viewBox="0 0 440 420" role="img" aria-label="Квадрат precision на recall с линиями уровня F-меры"></svg></div>
    <div class="dt-controls">
      <div class="dt-control"><label for="f1P"><span>precision</span><output id="f1Po">0,67</output></label>
        <input id="f1P" type="range" min="0.01" max="1" step="0.01" value="0.67"></div>
      <div class="dt-control"><label for="f1R"><span>recall</span><output id="f1Ro">0,80</output></label>
        <input id="f1R" type="range" min="0.01" max="1" step="0.01" value="0.8"></div>
      <div class="dt-seg"><button type="button" data-b="0.5" aria-pressed="false">β = 0,5</button><button type="button" data-b="1" aria-pressed="true">β = 1</button><button type="button" data-b="2" aria-pressed="false">β = 2</button></div>
      <div class="dt-presets">
        <button type="button" data-pr="0.67,0.8">лес при пороге 0,5</button>
        <button type="button" data-pr="0.05,1">все «не сдаст» на потоке</button>
        <button type="button" data-pr="0.4,0.5">модель на потоке</button>
      </div>
      <div class="dt-metrics">
        <div class="dt-metric"><span>среднее арифметическое</span><strong id="f1A">—</strong></div>
        <div class="dt-metric"><span id="f1Fc">F1</span><strong id="f1F">—</strong></div>
      </div>
    </div>
  </div>
  <div class="dt-formula" id="f1Formula"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('f1Svg');
  if (!svg) return;
  function el(n, a, t) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (t !== undefined) e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function H(k, n) {
    if (n === 0) return 0;
    var p = k / n, s = 0;
    [p, 1 - p].forEach(function (q) { if (q > 0) s -= q * Math.log2(q); });
    return s;
  }
  function tex(node, src, plain) {
    if (window.katex) window.katex.render(src, node, {throwOnError: false, displayMode: false});
    else node.textContent = plain;
  }
  var L = 60, T = 20, S = 340, beta = 1;
  function X(v) { return L + v * S; }
  function Yy(v) { return T + S - v * S; }
  function F(p, r, b) { var b2 = b * b; return (1 + b2) * p * r / (b2 * p + r); }
  var P = document.getElementById('f1P'), R = document.getElementById('f1R');
  function draw(p, r) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 440, height: 420, fill: '#FFFFFF'}));
    svg.appendChild(el('rect', {x: L, y: T, width: S, height: S, fill: '#FFFFFF', stroke: '#D8D4C8'}));
    var b2 = beta * beta;
    [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].forEach(function (c) {
      var d = [], first = true;
      for (var k = 0; k <= 400; k++) {
        var pp = k / 400, den = (1 + b2) * pp - c;
        if (den <= 0) continue;
        var rr = c * b2 * pp / den;
        if (rr > 1 || rr < 0) continue;
        d.push((first ? 'M' : 'L') + X(pp).toFixed(1) + ' ' + Yy(rr).toFixed(1)); first = false;
      }
      if (d.length) svg.appendChild(el('path', {d: d.join(' '), fill: 'none', stroke: '#C9C3B6', 'stroke-width': 1.2}));
      var lx = Math.min(1, c * (1 + b2) / (b2 + 1) + 0.0001);
      svg.appendChild(el('text', {x: X(1) + 4, y: Yy(c * b2 / ((1 + b2) - c)) + 4, 'font-size': 10, fill: '#8A8478'}, fmt(c, 1)));
    });
    svg.appendChild(el('line', {x1: X(0), y1: Yy(0), x2: X(1), y2: Yy(1), stroke: '#E5E1D6', 'stroke-dasharray': '4 4'}));
    [0, 0.5, 1].forEach(function (v) {
      var lab = v === 0.5 ? '0,5' : String(v);
      svg.appendChild(el('text', {x: X(v), y: T + S + 18, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, lab));
      svg.appendChild(el('text', {x: L - 8, y: Yy(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, lab));
    });
    svg.appendChild(el('text', {x: L + S / 2, y: T + S + 40, 'text-anchor': 'middle', 'font-size': 13, fill: '#5E5850'}, 'precision'));
    var ty = T + S / 2;
    svg.appendChild(el('text', {x: L - 38, y: ty, 'text-anchor': 'middle', 'font-size': 13, fill: '#5E5850', transform: 'rotate(-90 ' + (L - 38) + ' ' + ty + ')'}, 'recall'));
    svg.appendChild(el('line', {x1: X(p), y1: Yy(0), x2: X(p), y2: Yy(r), stroke: '#2A5E9B', 'stroke-dasharray': '3 3'}));
    svg.appendChild(el('line', {x1: X(0), y1: Yy(r), x2: X(p), y2: Yy(r), stroke: '#2A5E9B', 'stroke-dasharray': '3 3'}));
    svg.appendChild(el('circle', {cx: X(p), cy: Yy(r), r: 8, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
  }
  function update() {
    var p = +P.value, r = +R.value, f = F(p, r, beta), name = beta === 1 ? 'F1' : 'F' + String(beta).replace('.', ',');
    document.getElementById('f1Po').textContent = fmt(p, 2);
    document.getElementById('f1Ro').textContent = fmt(r, 2);
    document.getElementById('f1A').textContent = fmt((p + r) / 2, 3);
    document.getElementById('f1Fc').textContent = name;
    document.getElementById('f1F').textContent = fmt(f, 3);
    var b2 = beta * beta, B = beta === 1 ? '' : '_{' + String(beta).replace('.', '{,}') + '}';
    var c = function (v) { return fmt(v, 2).replace(',', '{,}'); };
    var src = beta === 1
      ? 'F_1 = \\frac{2 \\cdot P \\cdot R}{P + R} = \\frac{2 \\cdot ' + c(p) + ' \\cdot ' + c(r) + '}{' + c(p) + ' + ' + c(r) + '} = ' + fmt(f, 3).replace(',', '{,}')
      : 'F' + B + ' = \\frac{(1 + \\beta^2) \\cdot P \\cdot R}{\\beta^2 \\cdot P + R} = \\frac{' + fmt(1 + b2, 2).replace(/,?0+$/, '').replace(',', '{,}') + ' \\cdot ' + c(p) + ' \\cdot ' + c(r) + '}{' + fmt(b2, 2).replace(/,?0+$/, '').replace(',', '{,}') + ' \\cdot ' + c(p) + ' + ' + c(r) + '} = ' + fmt(f, 3).replace(',', '{,}');
    tex(document.getElementById('f1Formula'), src, name + ' = ' + fmt(f, 3));
    draw(p, r);
  }
  P.addEventListener('input', update); R.addEventListener('input', update);
  document.querySelectorAll('#f1Live [data-b]').forEach(function (b) {
    b.addEventListener('click', function () {
      beta = +b.getAttribute('data-b');
      document.querySelectorAll('#f1Live [data-b]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      update();
    });
  });
  document.querySelectorAll('#f1Live [data-pr]').forEach(function (b) {
    b.addEventListener('click', function () { var v = b.getAttribute('data-pr').split(','); P.value = v[0]; R.value = v[1]; update(); });
  });
  update();
})();
</script>


<p>
  Линии уровня F1 прижаты к осям: чтобы получить <span class="math-inline" data-tex="F_1 = 0{,}8"></span>, обе метрики должны быть не ниже <span class="math-inline" data-tex="0{,}67"></span>.
  Пунктирная диагональ — модели с <span class="math-inline" data-tex="P = R"></span>, на ней F1 совпадает со средним арифметическим. Чем дальше точка
  от диагонали, тем сильнее F1 отстаёт от среднего.
</p>


## Часть 7. ROC-кривая и AUC

<p>
  Precision, recall и F1 описывают модель при одном пороге. Порог часто выбирают уже потом, когда известна
  цена ошибок. Чтобы сравнить модели до этого, смотрят на все пороги сразу. Для этого нужна ROC-кривая.
</p>


<div class="stage" id="stageROC" tabindex="0">
  <div class="stage-figure">
<svg id="rocSvg" viewBox="0 0 960 510" role="img" aria-label="ROC-кривая леса на десяти студентах"><style>#rocSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="510" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="t6" data-only="1"><rect x="40" y="73" width="330" height="228" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="36" y1="301" x2="380" y2="301" stroke="#C29E08" stroke-width="3"/><text x="384" y="295" font-size="12" fill="#8F7406" text-anchor="start" font-weight="400">выше линии:</text><text x="384" y="311" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">«сдаст»</text></g>
<g data-key="t0" data-only="1"><line x1="36" y1="73" x2="380" y2="73" stroke="#C29E08" stroke-width="3"/><text x="384" y="78" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">порог выше всех</text></g>
<g data-key="t4" data-only="1"><rect x="40" y="73" width="330" height="152" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="36" y1="225" x2="380" y2="225" stroke="#C29E08" stroke-width="3"/><text x="384" y="219" font-size="12" fill="#8F7406" text-anchor="start" font-weight="400">выше линии:</text><text x="384" y="235" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">«сдаст»</text></g>
<g data-key="t8" data-only="1"><rect x="40" y="73" width="330" height="304" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="36" y1="377" x2="380" y2="377" stroke="#C29E08" stroke-width="3"/><text x="384" y="371" font-size="12" fill="#8F7406" text-anchor="start" font-weight="400">выше линии:</text><text x="384" y="387" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">«сдаст»</text></g>
<g data-key="t10" data-only="1"><rect x="40" y="73" width="330" height="380" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="36" y1="453" x2="380" y2="453" stroke="#C29E08" stroke-width="3"/><text x="384" y="447" font-size="12" fill="#8F7406" text-anchor="start" font-weight="400">выше линии:</text><text x="384" y="463" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">«сдаст»</text></g>
<g data-key="list" data-only="1"><text x="40" y="50" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">студенты по убыванию доли голосов</text><circle cx="70" cy="92" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="96.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><rect x="100" y="85" width="187.5" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="97" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,94</text><circle cx="70" cy="130" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="134.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><rect x="100" y="123" width="169.7" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="135" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,85</text><circle cx="70" cy="168" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="172.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><rect x="100" y="161" width="163.16" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="173" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,82</text><circle cx="70" cy="206" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="210.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><rect x="100" y="199" width="118.75" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="211" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,59</text><circle cx="70" cy="244" r="13" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="248.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><rect x="100" y="237" width="116.13" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="249" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,58</text><circle cx="70" cy="282" r="13" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="286.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><rect x="100" y="275" width="104.76" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="287" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,52</text><circle cx="70" cy="320" r="13" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="324.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><rect x="100" y="313" width="80" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="325" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,40</text><circle cx="70" cy="358" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="362.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><rect x="100" y="351" width="54.05" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="363" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,27</text><circle cx="70" cy="396" r="13" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="400.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><rect x="100" y="389" width="40" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="401" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,20</text><circle cx="70" cy="434" r="13" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="70" y="438.32" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><rect x="100" y="427" width="30.77" height="14" rx="3" fill="#E5E1D6" stroke="none" stroke-width="0"/><text x="310" y="439" font-size="14" fill="#111111" text-anchor="start" font-weight="400">0,15</text></g>
<g data-key="pairs" data-only="1"><text x="260" y="68" font-size="14" fill="#9C0908" text-anchor="middle" font-weight="700">не сдали</text><text x="88" y="230" font-size="14" fill="#5F9420" text-anchor="middle" font-weight="700" transform="rotate(-90 88 230.0)">сдали</text><circle cx="172.0" cy="98" r="12" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="172" y="101.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="216.0" cy="98" r="12" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="216" y="101.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="260.0" cy="98" r="12" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="260" y="101.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="304.0" cy="98" r="12" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="304" y="101.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="348.0" cy="98" r="12" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="348" y="101.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="126" cy="142.0" r="12" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="126" y="145.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><rect x="152" y="122" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="172" y="148" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="196" y="122" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="216" y="148" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="240" y="122" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="260" y="148" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="284" y="122" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="304" y="148" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="328" y="122" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="348" y="148" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><circle cx="126" cy="186.0" r="12" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="126" y="189.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><rect x="152" y="166" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="172" y="192" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="196" y="166" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="216" y="192" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="240" y="166" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="260" y="192" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="284" y="166" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="304" y="192" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="328" y="166" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="348" y="192" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><circle cx="126" cy="230.0" r="12" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="126" y="233.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><rect x="152" y="210" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="172" y="236" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="196" y="210" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="216" y="236" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="240" y="210" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="260" y="236" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="284" y="210" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="304" y="236" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="328" y="210" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="348" y="236" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><circle cx="126" cy="274.0" r="12" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="126" y="277.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><rect x="152" y="254" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="172" y="280" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="196" y="254" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="216" y="280" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="240" y="254" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="260" y="280" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="284" y="254" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="304" y="280" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="328" y="254" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="348" y="280" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><circle cx="126" cy="318.0" r="12" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="126" y="321.96" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><rect x="152" y="298" width="40" height="40" rx="4" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.4"/><text x="172" y="324" font-size="17" fill="#9C0908" text-anchor="middle" font-weight="700">✗</text><rect x="196" y="298" width="40" height="40" rx="4" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.4"/><text x="216" y="324" font-size="17" fill="#9C0908" text-anchor="middle" font-weight="700">✗</text><rect x="240" y="298" width="40" height="40" rx="4" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.4"/><text x="260" y="324" font-size="17" fill="#9C0908" text-anchor="middle" font-weight="700">✗</text><rect x="284" y="298" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="304" y="324" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><rect x="328" y="298" width="40" height="40" rx="4" fill="#EEF6E2" stroke="#73B222" stroke-width="1.4"/><text x="348" y="324" font-size="17" fill="#5F9420" text-anchor="middle" font-weight="700">✓</text><text x="260" y="374" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">22 пары из 25 упорядочены верно</text></g>
<g data-key="axes"><rect x="560" y="110" width="340" height="340" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="560" y1="450" x2="560" y2="455" stroke="#5E5850" stroke-width="1"/><text x="560" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="555" y1="450" x2="560" y2="450" stroke="#5E5850" stroke-width="1"/><text x="551" y="454" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="628" y1="450" x2="628" y2="455" stroke="#5E5850" stroke-width="1"/><text x="628" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,2</text><line x1="555" y1="382" x2="560" y2="382" stroke="#5E5850" stroke-width="1"/><text x="551" y="386" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,2</text><line x1="628" y1="450" x2="628" y2="110" stroke="#EFECE4" stroke-width="1"/><line x1="560" y1="382" x2="900" y2="382" stroke="#EFECE4" stroke-width="1"/><line x1="696" y1="450" x2="696" y2="455" stroke="#5E5850" stroke-width="1"/><text x="696" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,4</text><line x1="555" y1="314" x2="560" y2="314" stroke="#5E5850" stroke-width="1"/><text x="551" y="318" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,4</text><line x1="696" y1="450" x2="696" y2="110" stroke="#EFECE4" stroke-width="1"/><line x1="560" y1="314" x2="900" y2="314" stroke="#EFECE4" stroke-width="1"/><line x1="764" y1="450" x2="764" y2="455" stroke="#5E5850" stroke-width="1"/><text x="764" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,6</text><line x1="555" y1="246" x2="560" y2="246" stroke="#5E5850" stroke-width="1"/><text x="551" y="250" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,6</text><line x1="764" y1="450" x2="764" y2="110" stroke="#EFECE4" stroke-width="1"/><line x1="560" y1="246" x2="900" y2="246" stroke="#EFECE4" stroke-width="1"/><line x1="832" y1="450" x2="832" y2="455" stroke="#5E5850" stroke-width="1"/><text x="832" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,8</text><line x1="555" y1="178" x2="560" y2="178" stroke="#5E5850" stroke-width="1"/><text x="551" y="182" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,8</text><line x1="832" y1="450" x2="832" y2="110" stroke="#EFECE4" stroke-width="1"/><line x1="560" y1="178" x2="900" y2="178" stroke="#EFECE4" stroke-width="1"/><line x1="900" y1="450" x2="900" y2="455" stroke="#5E5850" stroke-width="1"/><text x="900" y="470" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><line x1="555" y1="110" x2="560" y2="110" stroke="#5E5850" stroke-width="1"/><text x="551" y="114" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><text x="730" y="492" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">FPR = FP / 5 — доля несдавших с ответом «сдаст»</text><text x="522" y="280" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 522 280.0)">TPR = recall = TP / 5</text></g>
<g data-key="area" data-only="1"><path d="M560 450 L560.0 450.0 L560.0 382.0 L560.0 314.0 L560.0 246.0 L560.0 178.0 L628.0 178.0 L696.0 178.0 L764.0 178.0 L764.0 110.0 L832.0 110.0 L900.0 110.0 L900 450 Z" fill="#DCE8F5" stroke="none"/><foreignObject x="670.8" y="294" width="200" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#2A5E9B;font-weight:700" data-tex="\text{AUC} = 0{,}88"></div></foreignObject></g>
<g data-key="diag" data-only="1"><line x1="560" y1="450" x2="900" y2="110" stroke="#5E5850" stroke-width="1.6" stroke-dasharray="6 5"/><text x="770.8" y="280" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400" transform="rotate(-45 770.8 280.0)">случайный порядок</text><circle cx="560" cy="110" r="7" fill="none" stroke="#5F9420" stroke-width="2.4"/><text x="574" y="132" font-size="13" fill="#5F9420" text-anchor="start" font-weight="700">идеал: все сдавшие выше всех несдавших</text></g>
<g data-key="s1"><path d="M560.0 450.0 L560.0 382.0 L560.0 314.0 L560.0 246.0 L560.0 178.0" fill="none" stroke="#3576C0" stroke-width="3.4" stroke-linejoin="round"/></g>
<g data-key="s2"><path d="M560.0 178.0 L628.0 178.0 L696.0 178.0" fill="none" stroke="#3576C0" stroke-width="3.4" stroke-linejoin="round"/></g>
<g data-key="s3"><path d="M696.0 178.0 L764.0 178.0 L764.0 110.0" fill="none" stroke="#3576C0" stroke-width="3.4" stroke-linejoin="round"/></g>
<g data-key="s4"><path d="M764.0 110.0 L832.0 110.0 L900.0 110.0" fill="none" stroke="#3576C0" stroke-width="3.4" stroke-linejoin="round"/></g>
<g data-key="p0" data-only="1"><circle cx="560.0" cy="450.0" r="7" fill="#2A5E9B" stroke="#FFFFFF" stroke-width="2"/><text x="572" y="440" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">(0; 0)</text></g>
<g data-key="p4" data-only="1"><circle cx="560.0" cy="178.0" r="7" fill="#2A5E9B" stroke="#FFFFFF" stroke-width="2"/><text x="572" y="182" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">(0; 0,8)</text></g>
<g data-key="p6" data-only="1"><circle cx="696.0" cy="178.0" r="7" fill="#2A5E9B" stroke="#FFFFFF" stroke-width="2"/><text x="702" y="204" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">порог 0,5: (0,4; 0,8)</text></g>
<g data-key="p8" data-only="1"><circle cx="764.0" cy="110.0" r="7" fill="#2A5E9B" stroke="#FFFFFF" stroke-width="2"/><text x="752" y="134" font-size="13" fill="#2A5E9B" text-anchor="end" font-weight="700">(0,6; 1)</text></g>
<g data-key="p10" data-only="1"><circle cx="900.0" cy="110.0" r="7" fill="#2A5E9B" stroke="#FFFFFF" stroke-width="2"/><text x="888" y="134" font-size="13" fill="#2A5E9B" text-anchor="end" font-weight="700">(1; 1)</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="list t6 axes p6" data-focus="p6 t6">
      <div class="step-kicker">Шаг 1 · одна точка</div>
      <h4>Каждый порог — точка на плоскости</h4>
      <p>Справа две оси из прошлой части: по вертикали TPR (recall), по горизонтали FPR. Порог <span class="math-inline" data-tex="0{,}5"></span> даёт <span class="math-inline" data-tex="TP = 4"></span> из 5 сдавших и <span class="math-inline" data-tex="FP = 2"></span> из 5 несдавших, то есть точку <span class="math-inline" data-tex="(0{,}4;\ 0{,}8)"></span>.</p>
<p>Другой порог даст другую точку. ROC-кривая (receiver operating characteristic) соединяет точки всех порогов.</p>
    </div>
    <div class="step-panel" data-on="list t0 axes p0" data-focus="p0 t0">
      <div class="step-kicker">Шаг 2 · порог 1</div>
      <h4>Порог выше всех: никто не «сдаст»</h4>
      <p>Если поднять порог выше <span class="math-inline" data-tex="0{,}94"></span>, ответ «сдаст» не получит никто: <span class="math-inline" data-tex="TP = FP = 0"></span>. Это точка <span class="math-inline" data-tex="(0;\ 0)"></span>.</p>
<p>Дальше будем опускать порог и пропускать через него студентов по одному, сверху вниз.</p>
    </div>
    <div class="step-panel" data-on="list t4 axes s1 p4" data-focus="s1 t4">
      <div class="step-kicker">Шаг 3 · вверх</div>
      <h4>Первые четверо сдали: кривая идёт вверх</h4>
      <p>Студенты 9, 10, 7 и 8 сдали. Каждый добавляет <span class="math-inline" data-tex="1/5"></span> к TPR, а FPR не меняется: четыре шага вверх до <span class="math-inline" data-tex="(0;\ 0{,}8)"></span>.</p>
<p>Пока выше порога только сдавшие, кривая прижимается к левой стенке. Так выглядит начало хорошей модели.</p>
    </div>
    <div class="step-panel" data-on="list t6 axes s1 s2 p6" data-focus="s2 t6">
      <div class="step-kicker">Шаг 4 · вправо</div>
      <h4>Студенты 6 и 1: два шага вправо</h4>
      <p>Следующие двое не сдали. Каждый несдавший добавляет <span class="math-inline" data-tex="1/5"></span> к FPR: два шага вправо. Пришли в точку <span class="math-inline" data-tex="(0{,}4;\ 0{,}8)"></span>, ту самую точку порога <span class="math-inline" data-tex="0{,}5"></span>.</p>
    </div>
    <div class="step-panel" data-on="list t8 axes s1 s2 s3 p8" data-focus="s3 t8">
      <div class="step-kicker">Шаг 5 · студент 4</div>
      <h4>Студент 3 вправо, студент 4 вверх</h4>
      <p>Студент 3 не сдал: ещё шаг вправо. Студент 4 сдал, но голосов у него всего <span class="math-inline" data-tex="0{,}27"></span>, поэтому его ступенька вверх появляется так поздно, на <span class="math-inline" data-tex="\text{FPR} = 0{,}6"></span>.</p>
    </div>
    <div class="step-panel" data-on="list t10 axes s1 s2 s3 s4 p10" data-focus="s4 t10">
      <div class="step-kicker">Шаг 6 · порог 0</div>
      <h4>Все получили «сдаст»</h4>
      <p>Студенты 2 и 5 не сдали: два последних шага вправо. При пороге ниже всех оценок <span class="math-inline" data-tex="TPR = FPR = 1"></span>: всех сдавших нашли, но и всех несдавших назвали сдавшими.</p>
<p>Кривая готова. Она зависит только от того, в каком порядке студенты выстроились по доле голосов.</p>
    </div>
    <div class="step-panel" data-on="list axes s1 s2 s3 s4 diag" data-focus="diag">
      <div class="step-kicker">Шаг 7 · с чем сравнивать</div>
      <h4>Диагональ и левый верхний угол</h4>
      <p>Если перемешать студентов случайно, сдавшие и несдавшие пойдут через порог вперемешку, и кривая в среднем пройдёт по диагонали.</p>
<p>Идеальная модель ставит всех сдавших выше всех несдавших: пять шагов вверх, потом пять вправо, через угол <span class="math-inline" data-tex="(0;\ 1)"></span>. Наша кривая проходит близко к этому углу, кроме ступеньки студента 4.</p>
    </div>
    <div class="step-panel" data-on="list axes s1 s2 s3 s4 diag area" data-focus="area">
      <div class="step-kicker">Шаг 8 · площадь</div>
      <h4>AUC — площадь под кривой</h4>
      <p>Площадь под ROC-кривой называют AUC (area under curve). Считаем по столбикам ширины <span class="math-inline" data-tex="0{,}2"></span>: три столбика высотой <span class="math-inline" data-tex="0{,}8"></span> и два высотой 1.</p>
<div class="math-display" data-tex="\text{AUC} = 0{,}2 \cdot (0{,}8 + 0{,}8 + 0{,}8 + 1 + 1) = 0{,}88"></div>
<p>У идеальной модели AUC = 1, у случайного порядка в среднем 0,5.</p>
    </div>
    <div class="step-panel" data-on="axes s1 s2 s3 s4 area pairs" data-focus="pairs">
      <div class="step-kicker">Шаг 9 · пары</div>
      <h4>Та же площадь, если считать пары</h4>
      <p>Составим все пары «сдавший — несдавший»: <span class="math-inline" data-tex="5 \cdot 5 = 25"></span>. В паре стоит галочка, если у сдавшего доля голосов выше. Неверных пар три, и во всех участвует студент 4: его <span class="math-inline" data-tex="0{,}27"></span> ниже, чем у студентов 6, 1 и 3.</p>
<p><span class="math-inline" data-tex="22/25 = 0{,}88"></span>: AUC равен вероятности, что случайно взятый сдавший получил оценку выше, чем случайно взятый несдавший. Каждая клетка сетки соответствует клетке под ступенчатой кривой.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Из того, как строится кривая, следуют свойства AUC.
</p>

<ul>
  <li><b>AUC зависит только от порядка студентов.</b> Если все доли голосов возвести в квадрат или пропустить
    через сигмоиду, порядок не изменится, и AUC тоже. У логистической регрессии в режиме leave-one-out
    вероятности совсем другие (студенту 9 она даёт 0,993), а AUC тоже <span class="math-inline" data-tex="0{,}88"></span>.</li>
  <li><b>AUC не зависит от порога.</b> Это оценка того, насколько хорошо модель ранжирует студентов, а не того,
    как хороши её ответы при каком-то пороге.</li>
  <li><b>AUC не зависит от доли классов.</b> TPR считается только по сдавшим, FPR только по несдавшим.
    Если несдавших станет в десять раз больше с тем же распределением оценок, кривая не изменится. Иногда
    это удобно, а иногда скрывает проблему; о ней часть 8.</li>
  <li>AUC меньше <span class="math-inline" data-tex="0{,}5"></span> значит, что модель ранжирует наоборот: если поменять её ответы местами,
    AUC станет больше <span class="math-inline" data-tex="0{,}5"></span>.</li>
</ul>

<p>
  В кредитном скоринге вместо AUC часто пишут коэффициент Джини: <span class="math-inline" data-tex="\text{Gini} = 2 \cdot \text{AUC} - 1"></span>.
  Он переводит ту же меру на шкалу от 0 (случайный порядок) до 1 (идеальный). У леса <span class="math-inline" data-tex="2 \cdot 0{,}88 - 1 = 0{,}76"></span>.
  Это не тот индекс Gini, которым дерево выбирает вопросы: оба названы в честь статистика Коррадо Джини,
  но считаются по-разному.
</p>


## Часть 8. Когда положительных мало: PR-кривая

<p>
  Если вместо FPR отложить по горизонтали recall, а по вертикали precision, получится PR-кривая.
  Её строят так же, опуская порог через студентов по одному: точки берутся прямо из таблицы части 5.
</p>


<div class="cm-fig"><svg viewBox="0 0 720 390" role="img" aria-label="PR-кривая леса на десяти студентах"><rect x="0" y="0" width="720" height="390" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><rect x="80" y="30" width="300" height="300" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><rect x="80" y="30" width="60" height="300" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1"/><rect x="140" y="30" width="60" height="300" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1"/><rect x="200" y="30" width="60" height="300" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1"/><rect x="260" y="30" width="60" height="300" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1"/><rect x="320" y="142.5" width="60" height="187.5" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1"/><text x="80" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><text x="72" y="334" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="140" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,2</text><text x="72" y="274" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,2</text><text x="200" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,4</text><text x="72" y="214" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,4</text><text x="260" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,6</text><text x="72" y="154" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,6</text><text x="320" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,8</text><text x="72" y="94" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,8</text><text x="380" y="348" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><text x="72" y="34" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><text x="230" y="370" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">recall</text><text x="36" y="180" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 180.0)">precision</text><path d="M140.0 30.0 L200.0 30.0 L260.0 30.0 L320.0 30.0 L320.0 90.0 L320.0 130.0 L320.0 158.6 L380.0 142.5 L380.0 163.3 L380.0 180.0" fill="none" stroke="#3576C0" stroke-width="2.4" stroke-dasharray="5 4"/><circle cx="140.0" cy="30.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="140" y="34" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="200.0" cy="30.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="200" y="34" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><circle cx="260.0" cy="30.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="260" y="34" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="320.0" cy="30.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="34" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="320.0" cy="90.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="94" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="320.0" cy="130.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="134" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="320.0" cy="158.6" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="320" y="162.57" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="380.0" cy="142.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="380" y="146.5" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="380.0" cy="163.3" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="380" y="167.33" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="380.0" cy="180.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="380" y="184" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="410" y="70" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">Точки — пороги, опущенные</text><text x="410" y="88" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">под очередного студента.</text><text x="410" y="118" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">Жёлтые прямоугольники:</text><text x="410" y="136" font-size="13" fill="#8F7406" text-anchor="start" font-weight="400">шаг recall 0,2 × precision</text><text x="410" y="154" font-size="13" fill="#8F7406" text-anchor="start" font-weight="400">в момент, когда находим</text><text x="410" y="172" font-size="13" fill="#8F7406" text-anchor="start" font-weight="400">очередного сдавшего.</text><foreignObject x="410" y="214" width="300" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\text{AP} = 0{,}2\,(1 + 1 + 1 + 1 + \tfrac{5}{8}) = 0{,}925"></div></foreignObject></svg></div>


<p>
  Площадь под PR-кривой обычно считают ступеньками и называют average precision (AP).
  Каждый раз, когда под порогом оказывается очередной сдавший, recall растёт на <span class="math-inline" data-tex="1/5"></span>; этот шаг умножают
  на precision в этот момент:
</p>

<div class="math-display" data-tex="\text{AP} = \sum_k (R_k - R_{k-1})\,P_k"></div>

<p>
  Первые четыре сдавших стоят выше всех несдавших, у них precision 1. Пятый, студент 4, появляется восьмым
  по счёту, когда precision уже <span class="math-inline" data-tex="5/8"></span>. Отсюда <span class="math-inline" data-tex="\text{AP} = 0{,}925"></span>. В sklearn это
  <code>average_precision_score</code>. Площадь под той же кривой по трапециям (<code>auc(recall, precision)</code>)
  даёт другое число и обычно завышает результат, потому что соединяет точки прямыми.
</p>

<p>
  На десяти студентах сдавших и несдавших поровну, и ROC с PR рассказывают похожее. Разница видна,
  когда положительный класс редкий. Возьмём синтетический поток: часы и пропуски устроены как у наших студентов,
  но не сдаёт около 5 %. Положительный класс теперь «не сдал». Логистическая регрессия обучена
  на 3000 студентах и проверена на 20 000, из которых не сдали 4,9 %.
</p>

<p>
  На проверке у неё <span class="math-inline" data-tex="\text{ROC-AUC} = 0{,}906"></span> и <span class="math-inline" data-tex="\text{AP} = 0{,}468"></span>. ROC-кривая выглядит хорошо.
  Но чтобы найти 80 % несдавших, модель отмечает почти каждого пятого студента, и большинство отмеченных сдали бы и так.
  Precision зависит от доли положительных <span class="math-inline" data-tex="\pi"></span>. Если TPR и FPR при пороге известны, то
</p>

<div class="math-display" data-tex="\text{precision} = \frac{\pi \cdot \text{TPR}}{\pi \cdot \text{TPR} + (1 - \pi) \cdot \text{FPR}}"></div>

<p>
  При <span class="math-inline" data-tex="\text{TPR} = 0{,}8"></span> модель называет несдавшими <span class="math-inline" data-tex="14{,}8\,\%"></span> сдающих. Если несдавших <span class="math-inline" data-tex="4{,}9\,\%"></span>,
  precision получается <span class="math-inline" data-tex="0{,}039 / (0{,}039 + 0{,}141) \approx 0{,}22"></span>. Если бы их была половина, при тех же
  TPR и FPR precision была бы <span class="math-inline" data-tex="0{,}84"></span>.
</p>


<div class="dt-live" id="prLive">
  <div class="dt-live-head"><strong>Интерактив: ROC и PR при разной доле несдавших</strong>
    <p>Модель и её оценки одни и те же. Меняется только доля несдавших на потоке и порог, заданный через recall.</p></div>
  <div class="thr-fig pr-fig"><svg id="prcSvg" viewBox="0 0 640 330" role="img" aria-label="ROC-кривая и PR-кривая одной модели"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="prPi"><span>не сдают</span><output id="prPio">4,9 %</output></label>
        <input id="prPi" type="range" min="1" max="50" step="0.1" value="4.9"></div>
      <div class="dt-control"><label for="prT"><span>нужный recall</span><output id="prTo">0,80</output></label>
        <input id="prT" type="range" min="0.02" max="1" step="0.01" value="0.8"></div>
      <div class="dt-presets"><button type="button" data-pi="4.9">4,9 %, как на потоке</button><button type="button" data-pi="50">50 %</button></div>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>ROC-AUC</span><strong>0,906</strong></div>
      <div class="dt-metric"><span>AP</span><strong id="prAP">—</strong></div>
      <div class="dt-metric"><span>precision</span><strong id="prP">—</strong></div>
      <div class="dt-metric"><span>FPR</span><strong id="prF">—</strong></div>
    </div>
    <div class="dt-metric pr-count"><span>на 1000 студентов</span><strong id="prN" class="two">—</strong></div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('prcSvg');
  if (!svg) return;
  function el(n, a, t) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (t !== undefined) e.textContent = t;
    return e;
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }
  function H(k, n) {
    if (n === 0) return 0;
    var p = k / n, s = 0;
    [p, 1 - p].forEach(function (q) { if (q > 0) s -= q * Math.log2(q); });
    return s;
  }
  function tex(node, src, plain) {
    if (window.katex) window.katex.render(src, node, {throwOnError: false, displayMode: false});
    else node.textContent = plain;
  }
  var Q = [[0.0, 0.0], [0.00102, 0.0], [0.00204, 0.0], [0.00306, 0.0], [0.00408, 0.0], [0.0051, 0.0], [0.00612, 0.0], [0.00714, 0.0], [0.00815, 0.0], [0.00917, 0.0], [0.01019, 5e-05], [0.01121, 5e-05], [0.01223, 5e-05], [0.01325, 5e-05], [0.01427, 5e-05], [0.01529, 0.00011], [0.01631, 0.00011], [0.01733, 0.00011], [0.01835, 0.00011], [0.01937, 0.00011], [0.02039, 0.00011], [0.02141, 0.00016], [0.02243, 0.00016], [0.02345, 0.00016], [0.02446, 0.00016], [0.02548, 0.00016], [0.0265, 0.00016], [0.02752, 0.00016], [0.02854, 0.00016], [0.02956, 0.00016], [0.03058, 0.00016], [0.0316, 0.00016], [0.03262, 0.00016], [0.03364, 0.00016], [0.03466, 0.00016], [0.03568, 0.00016], [0.0367, 0.00016], [0.03772, 0.00016], [0.03874, 0.00016], [0.03976, 0.00016], [0.04077, 0.00016], [0.04179, 0.00016], [0.04281, 0.00016], [0.04383, 0.00016], [0.04485, 0.00016], [0.04587, 0.00016], [0.04689, 0.00016], [0.04791, 0.00016], [0.04893, 0.00016], [0.04995, 0.00021], [0.05097, 0.00021], [0.05199, 0.00021], [0.05301, 0.00021], [0.05403, 0.00021], [0.05505, 0.00021], [0.05607, 0.00021], [0.05708, 0.00021], [0.0581, 0.00021], [0.05912, 0.00021], [0.06014, 0.00021], [0.06116, 0.00021], [0.06218, 0.00026], [0.0632, 0.00026], [0.06422, 0.00032], [0.06524, 0.00032], [0.06626, 0.00032], [0.06728, 0.00032], [0.0683, 0.00032], [0.06932, 0.00032], [0.07034, 0.00042], [0.07136, 0.00047], [0.07238, 0.00047], [0.07339, 0.00047], [0.07441, 0.00047], [0.07543, 0.00053], [0.07645, 0.00058], [0.07747, 0.00058], [0.07849, 0.00058], [0.07951, 0.00058], [0.08053, 0.00063], [0.08155, 0.00063], [0.08257, 0.00063], [0.08359, 0.00063], [0.08461, 0.00063], [0.08563, 0.00068], [0.08665, 0.00068], [0.08767, 0.00068], [0.08869, 0.00068], [0.0897, 0.00068], [0.09072, 0.00068], [0.09174, 0.00074], [0.09276, 0.00074], [0.09378, 0.00074], [0.0948, 0.00074], [0.09582, 0.00074], [0.09684, 0.00074], [0.09786, 0.00074], [0.09888, 0.00089], [0.0999, 0.00089], [0.10092, 0.00089], [0.10194, 0.00089], [0.10296, 0.00089], [0.10398, 0.00089], [0.10499, 0.00089], [0.10601, 0.00089], [0.10703, 0.00089], [0.10805, 0.00089], [0.10907, 0.00095], [0.11009, 0.00095], [0.11111, 0.00095], [0.11213, 0.00095], [0.11315, 0.00095], [0.11417, 0.00095], [0.11519, 0.001], [0.11621, 0.00105], [0.11723, 0.00105], [0.11825, 0.00105], [0.11927, 0.00105], [0.12029, 0.00105], [0.1213, 0.00105], [0.12232, 0.00105], [0.12334, 0.0011], [0.12436, 0.0011], [0.12538, 0.00121], [0.1264, 0.00137], [0.12742, 0.00137], [0.12844, 0.00137], [0.12946, 0.00142], [0.13048, 0.00147], [0.1315, 0.00152], [0.13252, 0.00163], [0.13354, 0.00179], [0.13456, 0.00179], [0.13558, 0.00184], [0.1366, 0.00184], [0.13761, 0.00184], [0.13863, 0.00184], [0.13965, 0.00184], [0.14067, 0.00184], [0.14169, 0.00184], [0.14271, 0.00195], [0.14373, 0.00195], [0.14475, 0.00195], [0.14577, 0.00195], [0.14679, 0.00195], [0.14781, 0.00195], [0.14883, 0.00195], [0.14985, 0.00195], [0.15087, 0.00205], [0.15189, 0.00205], [0.15291, 0.00205], [0.15392, 0.00205], [0.15494, 0.00205], [0.15596, 0.00216], [0.15698, 0.00216], [0.158, 0.00216], [0.15902, 0.00216], [0.16004, 0.00216], [0.16106, 0.00216], [0.16208, 0.00221], [0.1631, 0.00221], [0.16412, 0.00221], [0.16514, 0.00221], [0.16616, 0.00226], [0.16718, 0.00226], [0.1682, 0.00226], [0.16922, 0.00226], [0.17023, 0.00237], [0.17125, 0.00237], [0.17227, 0.00237], [0.17329, 0.00237], [0.17431, 0.00237], [0.17533, 0.00237], [0.17635, 0.00242], [0.17737, 0.00242], [0.17839, 0.00247], [0.17941, 0.00247], [0.18043, 0.00247], [0.18145, 0.00247], [0.18247, 0.00247], [0.18349, 0.00263], [0.18451, 0.00268], [0.18552, 0.00268], [0.18654, 0.00268], [0.18756, 0.00268], [0.18858, 0.00268], [0.1896, 0.00273], [0.19062, 0.00273], [0.19164, 0.00273], [0.19266, 0.003], [0.19368, 0.003], [0.1947, 0.003], [0.19572, 0.003], [0.19674, 0.003], [0.19776, 0.003], [0.19878, 0.003], [0.1998, 0.0031], [0.20082, 0.0031], [0.20183, 0.00326], [0.20285, 0.00326], [0.20387, 0.00331], [0.20489, 0.00358], [0.20591, 0.00358], [0.20693, 0.00358], [0.20795, 0.00373], [0.20897, 0.00373], [0.20999, 0.00389], [0.21101, 0.004], [0.21203, 0.00405], [0.21305, 0.00405], [0.21407, 0.00405], [0.21509, 0.00421], [0.21611, 0.00436], [0.21713, 0.00442], [0.21814, 0.00442], [0.21916, 0.00442], [0.22018, 0.00447], [0.2212, 0.00452], [0.22222, 0.00452], [0.22324, 0.00463], [0.22426, 0.00468], [0.22528, 0.00473], [0.2263, 0.00473], [0.22732, 0.00478], [0.22834, 0.00484], [0.22936, 0.005], [0.23038, 0.00505], [0.2314, 0.00505], [0.23242, 0.00505], [0.23344, 0.00505], [0.23445, 0.00505], [0.23547, 0.0051], [0.23649, 0.00515], [0.23751, 0.00526], [0.23853, 0.00536], [0.23955, 0.00536], [0.24057, 0.00547], [0.24159, 0.00547], [0.24261, 0.00547], [0.24363, 0.00557], [0.24465, 0.00557], [0.24567, 0.00557], [0.24669, 0.00563], [0.24771, 0.00563], [0.24873, 0.00563], [0.24975, 0.00563], [0.25076, 0.00568], [0.25178, 0.00568], [0.2528, 0.00573], [0.25382, 0.00573], [0.25484, 0.00578], [0.25586, 0.00578], [0.25688, 0.00578], [0.2579, 0.00578], [0.25892, 0.00584], [0.25994, 0.00589], [0.26096, 0.00631], [0.26198, 0.00641], [0.263, 0.00657], [0.26402, 0.00668], [0.26504, 0.00668], [0.26606, 0.00673], [0.26707, 0.00678], [0.26809, 0.00678], [0.26911, 0.00678], [0.27013, 0.00684], [0.27115, 0.00684], [0.27217, 0.00684], [0.27319, 0.00715], [0.27421, 0.00726], [0.27523, 0.00741], [0.27625, 0.00752], [0.27727, 0.00773], [0.27829, 0.00778], [0.27931, 0.00778], [0.28033, 0.00778], [0.28135, 0.00778], [0.28236, 0.00778], [0.28338, 0.00778], [0.2844, 0.00783], [0.28542, 0.00789], [0.28644, 0.00799], [0.28746, 0.0081], [0.28848, 0.00815], [0.2895, 0.00825], [0.29052, 0.00831], [0.29154, 0.00831], [0.29256, 0.00831], [0.29358, 0.00831], [0.2946, 0.00847], [0.29562, 0.00847], [0.29664, 0.00852], [0.29766, 0.00852], [0.29867, 0.00852], [0.29969, 0.00878], [0.30071, 0.00878], [0.30173, 0.00883], [0.30275, 0.00925], [0.30377, 0.00936], [0.30479, 0.00936], [0.30581, 0.00946], [0.30683, 0.00952], [0.30785, 0.00988], [0.30887, 0.01004], [0.30989, 0.01015], [0.31091, 0.0102], [0.31193, 0.0102], [0.31295, 0.0102], [0.31397, 0.01025], [0.31498, 0.01052], [0.316, 0.01083], [0.31702, 0.01099], [0.31804, 0.01115], [0.31906, 0.01125], [0.32008, 0.0113], [0.3211, 0.01146], [0.32212, 0.01146], [0.32314, 0.01188], [0.32416, 0.01225], [0.32518, 0.01225], [0.3262, 0.0123], [0.32722, 0.0123], [0.32824, 0.01251], [0.32926, 0.01288], [0.33028, 0.01288], [0.33129, 0.01288], [0.33231, 0.01288], [0.33333, 0.01299], [0.33435, 0.01299], [0.33537, 0.01309], [0.33639, 0.01314], [0.33741, 0.01325], [0.33843, 0.01351], [0.33945, 0.01367], [0.34047, 0.01372], [0.34149, 0.01399], [0.34251, 0.01399], [0.34353, 0.01409], [0.34455, 0.01409], [0.34557, 0.0142], [0.34659, 0.0142], [0.3476, 0.01446], [0.34862, 0.01446], [0.34964, 0.01451], [0.35066, 0.01456], [0.35168, 0.01467], [0.3527, 0.01483], [0.35372, 0.01483], [0.35474, 0.0152], [0.35576, 0.01535], [0.35678, 0.01541], [0.3578, 0.01556], [0.35882, 0.01556], [0.35984, 0.01556], [0.36086, 0.01562], [0.36188, 0.01583], [0.3629, 0.01583], [0.36391, 0.01593], [0.36493, 0.01604], [0.36595, 0.01619], [0.36697, 0.01619], [0.36799, 0.01619], [0.36901, 0.01625], [0.37003, 0.01625], [0.37105, 0.0163], [0.37207, 0.0163], [0.37309, 0.0163], [0.37411, 0.01667], [0.37513, 0.01683], [0.37615, 0.01719], [0.37717, 0.01725], [0.37819, 0.01735], [0.3792, 0.01746], [0.38022, 0.01746], [0.38124, 0.01777], [0.38226, 0.01782], [0.38328, 0.01782], [0.3843, 0.01793], [0.38532, 0.01793], [0.38634, 0.01793], [0.38736, 0.01793], [0.38838, 0.01803], [0.3894, 0.01803], [0.39042, 0.01803], [0.39144, 0.01809], [0.39246, 0.01809], [0.39348, 0.01819], [0.3945, 0.01819], [0.39551, 0.01819], [0.39653, 0.01835], [0.39755, 0.01846], [0.39857, 0.01867], [0.39959, 0.01888], [0.40061, 0.01903], [0.40163, 0.01903], [0.40265, 0.01903], [0.40367, 0.01919], [0.40469, 0.01935], [0.40571, 0.01945], [0.40673, 0.01951], [0.40775, 0.01987], [0.40877, 0.01993], [0.40979, 0.01993], [0.41081, 0.02014], [0.41182, 0.02024], [0.41284, 0.0203], [0.41386, 0.02035], [0.41488, 0.02035], [0.4159, 0.02035], [0.41692, 0.0204], [0.41794, 0.02045], [0.41896, 0.02061], [0.41998, 0.02087], [0.421, 0.02108], [0.42202, 0.02114], [0.42304, 0.02119], [0.42406, 0.02119], [0.42508, 0.02129], [0.4261, 0.02129], [0.42712, 0.02135], [0.42813, 0.02214], [0.42915, 0.0224], [0.43017, 0.0224], [0.43119, 0.0224], [0.43221, 0.02282], [0.43323, 0.02282], [0.43425, 0.02287], [0.43527, 0.02298], [0.43629, 0.02324], [0.43731, 0.0234], [0.43833, 0.02361], [0.43935, 0.02377], [0.44037, 0.02382], [0.44139, 0.02413], [0.44241, 0.02419], [0.44343, 0.02419], [0.44444, 0.02429], [0.44546, 0.02429], [0.44648, 0.02434], [0.4475, 0.0244], [0.44852, 0.02466], [0.44954, 0.02466], [0.45056, 0.02487], [0.45158, 0.02524], [0.4526, 0.02545], [0.45362, 0.02545], [0.45464, 0.02545], [0.45566, 0.02545], [0.45668, 0.02555], [0.4577, 0.02571], [0.45872, 0.02571], [0.45973, 0.02618], [0.46075, 0.02629], [0.46177, 0.02666], [0.46279, 0.02687], [0.46381, 0.02687], [0.46483, 0.02703], [0.46585, 0.02713], [0.46687, 0.0276], [0.46789, 0.02776], [0.46891, 0.02797], [0.46993, 0.02839], [0.47095, 0.02845], [0.47197, 0.02866], [0.47299, 0.02923], [0.47401, 0.02997], [0.47503, 0.03029], [0.47604, 0.03029], [0.47706, 0.03029], [0.47808, 0.03034], [0.4791, 0.0305], [0.48012, 0.0305], [0.48114, 0.03055], [0.48216, 0.0306], [0.48318, 0.03076], [0.4842, 0.03081], [0.48522, 0.03092], [0.48624, 0.03102], [0.48726, 0.03128], [0.48828, 0.03181], [0.4893, 0.03186], [0.49032, 0.03223], [0.49134, 0.03223], [0.49235, 0.03223], [0.49337, 0.03234], [0.49439, 0.03234], [0.49541, 0.03249], [0.49643, 0.03265], [0.49745, 0.03276], [0.49847, 0.03276], [0.49949, 0.03286], [0.50051, 0.03286], [0.50153, 0.03328], [0.50255, 0.03376], [0.50357, 0.03407], [0.50459, 0.03454], [0.50561, 0.03502], [0.50663, 0.03507], [0.50765, 0.03512], [0.50866, 0.03539], [0.50968, 0.03633], [0.5107, 0.03644], [0.51172, 0.03665], [0.51274, 0.03686], [0.51376, 0.03696], [0.51478, 0.03738], [0.5158, 0.03738], [0.51682, 0.0378], [0.51784, 0.03875], [0.51886, 0.03907], [0.51988, 0.03912], [0.5209, 0.03912], [0.52192, 0.03933], [0.52294, 0.03964], [0.52396, 0.0397], [0.52497, 0.0398], [0.52599, 0.04012], [0.52701, 0.04033], [0.52803, 0.04054], [0.52905, 0.04127], [0.53007, 0.04159], [0.53109, 0.04164], [0.53211, 0.04212], [0.53313, 0.04248], [0.53415, 0.04275], [0.53517, 0.04275], [0.53619, 0.0428], [0.53721, 0.04306], [0.53823, 0.04343], [0.53925, 0.04375], [0.54027, 0.04385], [0.54128, 0.04396], [0.5423, 0.04396], [0.54332, 0.04401], [0.54434, 0.04401], [0.54536, 0.04438], [0.54638, 0.04453], [0.5474, 0.04496], [0.54842, 0.04501], [0.54944, 0.04522], [0.55046, 0.04538], [0.55148, 0.04538], [0.5525, 0.04564], [0.55352, 0.04616], [0.55454, 0.04632], [0.55556, 0.04695], [0.55657, 0.04711], [0.55759, 0.04758], [0.55861, 0.04758], [0.55963, 0.04758], [0.56065, 0.04769], [0.56167, 0.0479], [0.56269, 0.04816], [0.56371, 0.04858], [0.56473, 0.04864], [0.56575, 0.04879], [0.56677, 0.04974], [0.56779, 0.05006], [0.56881, 0.05042], [0.56983, 0.05069], [0.57085, 0.05079], [0.57187, 0.05126], [0.57288, 0.05147], [0.5739, 0.05221], [0.57492, 0.05221], [0.57594, 0.05274], [0.57696, 0.05289], [0.57798, 0.05326], [0.579, 0.05332], [0.58002, 0.05332], [0.58104, 0.05342], [0.58206, 0.05368], [0.58308, 0.05479], [0.5841, 0.05479], [0.58512, 0.05484], [0.58614, 0.05531], [0.58716, 0.05563], [0.58818, 0.05573], [0.58919, 0.05579], [0.59021, 0.05615], [0.59123, 0.05642], [0.59225, 0.05652], [0.59327, 0.05668], [0.59429, 0.05673], [0.59531, 0.05952], [0.59633, 0.05978], [0.59735, 0.05989], [0.59837, 0.05989], [0.59939, 0.0602], [0.60041, 0.06031], [0.60143, 0.06052], [0.60245, 0.06099], [0.60347, 0.06104], [0.60449, 0.06104], [0.6055, 0.06131], [0.60652, 0.06152], [0.60754, 0.06152], [0.60856, 0.06157], [0.60958, 0.06215], [0.6106, 0.06241], [0.61162, 0.06299], [0.61264, 0.06299], [0.61366, 0.06331], [0.61468, 0.06357], [0.6157, 0.06357], [0.61672, 0.06357], [0.61774, 0.0642], [0.61876, 0.06441], [0.61978, 0.06467], [0.6208, 0.06467], [0.62181, 0.06483], [0.62283, 0.06494], [0.62385, 0.06494], [0.62487, 0.06494], [0.62589, 0.06515], [0.62691, 0.06593], [0.62793, 0.06641], [0.62895, 0.06646], [0.62997, 0.06646], [0.63099, 0.06646], [0.63201, 0.06741], [0.63303, 0.06741], [0.63405, 0.06751], [0.63507, 0.06756], [0.63609, 0.06777], [0.6371, 0.06798], [0.63812, 0.06841], [0.63914, 0.06925], [0.64016, 0.0694], [0.64118, 0.0694], [0.6422, 0.07004], [0.64322, 0.07114], [0.64424, 0.07119], [0.64526, 0.07124], [0.64628, 0.07161], [0.6473, 0.07177], [0.64832, 0.0723], [0.64934, 0.0723], [0.65036, 0.07261], [0.65138, 0.07266], [0.6524, 0.07298], [0.65341, 0.07324], [0.65443, 0.07345], [0.65545, 0.07351], [0.65647, 0.07408], [0.65749, 0.07435], [0.65851, 0.07529], [0.65953, 0.0754], [0.66055, 0.07561], [0.66157, 0.07603], [0.66259, 0.07645], [0.66361, 0.07666], [0.66463, 0.07677], [0.66565, 0.0774], [0.66667, 0.07766], [0.66769, 0.07782], [0.66871, 0.07876], [0.66972, 0.07892], [0.67074, 0.07913], [0.67176, 0.07987], [0.67278, 0.08013], [0.6738, 0.08039], [0.67482, 0.08039], [0.67584, 0.08081], [0.67686, 0.08108], [0.67788, 0.08129], [0.6789, 0.08144], [0.67992, 0.08144], [0.68094, 0.0815], [0.68196, 0.08166], [0.68298, 0.08181], [0.684, 0.08234], [0.68502, 0.08265], [0.68603, 0.08271], [0.68705, 0.08507], [0.68807, 0.08639], [0.68909, 0.08639], [0.69011, 0.08691], [0.69113, 0.08786], [0.69215, 0.08833], [0.69317, 0.08949], [0.69419, 0.08986], [0.69521, 0.09091], [0.69623, 0.09128], [0.69725, 0.09128], [0.69827, 0.09201], [0.69929, 0.09201], [0.70031, 0.09212], [0.70133, 0.09217], [0.70234, 0.09228], [0.70336, 0.09601], [0.70438, 0.0968], [0.7054, 0.09727], [0.70642, 0.09769], [0.70744, 0.09774], [0.70846, 0.0978], [0.70948, 0.09801], [0.7105, 0.09911], [0.71152, 0.09911], [0.71254, 0.09927], [0.71356, 0.09958], [0.71458, 0.09995], [0.7156, 0.10064], [0.71662, 0.10069], [0.71764, 0.10106], [0.71865, 0.10127], [0.71967, 0.10179], [0.72069, 0.10185], [0.72171, 0.10211], [0.72273, 0.10258], [0.72375, 0.10337], [0.72477, 0.10374], [0.72579, 0.10453], [0.72681, 0.10453], [0.72783, 0.10553], [0.72885, 0.10553], [0.72987, 0.107], [0.73089, 0.10737], [0.73191, 0.10768], [0.73293, 0.10847], [0.73394, 0.10852], [0.73496, 0.10873], [0.73598, 0.10947], [0.737, 0.10957], [0.73802, 0.10978], [0.73904, 0.1101], [0.74006, 0.11052], [0.74108, 0.11089], [0.7421, 0.11126], [0.74312, 0.11126], [0.74414, 0.11141], [0.74516, 0.11189], [0.74618, 0.11262], [0.7472, 0.11278], [0.74822, 0.1131], [0.74924, 0.11425], [0.75025, 0.11467], [0.75127, 0.11504], [0.75229, 0.11736], [0.75331, 0.11757], [0.75433, 0.11788], [0.75535, 0.11815], [0.75637, 0.11815], [0.75739, 0.11878], [0.75841, 0.11883], [0.75943, 0.11962], [0.76045, 0.11977], [0.76147, 0.11977], [0.76249, 0.11983], [0.76351, 0.12077], [0.76453, 0.12104], [0.76555, 0.12135], [0.76656, 0.12183], [0.76758, 0.12225], [0.7686, 0.12377], [0.76962, 0.12524], [0.77064, 0.12561], [0.77166, 0.12566], [0.77268, 0.12645], [0.7737, 0.12666], [0.77472, 0.12756], [0.77574, 0.12866], [0.77676, 0.13034], [0.77778, 0.13071], [0.7788, 0.13097], [0.77982, 0.13281], [0.78084, 0.13292], [0.78186, 0.13318], [0.78287, 0.13513], [0.78389, 0.13518], [0.78491, 0.13692], [0.78593, 0.13692], [0.78695, 0.13734], [0.78797, 0.13881], [0.78899, 0.13965], [0.79001, 0.14039], [0.79103, 0.14054], [0.79205, 0.14265], [0.79307, 0.14401], [0.79409, 0.1447], [0.79511, 0.14538], [0.79613, 0.14549], [0.79715, 0.14627], [0.79817, 0.14633], [0.79918, 0.14801], [0.8002, 0.14833], [0.80122, 0.14838], [0.80224, 0.15074], [0.80326, 0.15106], [0.80428, 0.15343], [0.8053, 0.1549], [0.80632, 0.15511], [0.80734, 0.15516], [0.80836, 0.15637], [0.80938, 0.15674], [0.8104, 0.15921], [0.81142, 0.15995], [0.81244, 0.16042], [0.81346, 0.16047], [0.81448, 0.16299], [0.81549, 0.1641], [0.81651, 0.16415], [0.81753, 0.16489], [0.81855, 0.16583], [0.81957, 0.16583], [0.82059, 0.1671], [0.82161, 0.16773], [0.82263, 0.16846], [0.82365, 0.16946], [0.82467, 0.16978], [0.82569, 0.17041], [0.82671, 0.1713], [0.82773, 0.17514], [0.82875, 0.17588], [0.82977, 0.17614], [0.83078, 0.1764], [0.8318, 0.17682], [0.83282, 0.17682], [0.83384, 0.17688], [0.83486, 0.17877], [0.83588, 0.18177], [0.8369, 0.18182], [0.83792, 0.18182], [0.83894, 0.18655], [0.83996, 0.18723], [0.84098, 0.18771], [0.842, 0.18776], [0.84302, 0.18808], [0.84404, 0.18918], [0.84506, 0.19249], [0.84608, 0.19312], [0.84709, 0.19396], [0.84811, 0.1997], [0.84913, 0.20101], [0.85015, 0.20101], [0.85117, 0.20238], [0.85219, 0.20253], [0.85321, 0.20311], [0.85423, 0.20453], [0.85525, 0.20522], [0.85627, 0.20527], [0.85729, 0.20674], [0.85831, 0.20737], [0.85933, 0.213], [0.86035, 0.2131], [0.86137, 0.21452], [0.86239, 0.21505], [0.8634, 0.21521], [0.86442, 0.21794], [0.86544, 0.21862], [0.86646, 0.22052], [0.86748, 0.22078], [0.8685, 0.22378], [0.86952, 0.22598], [0.87054, 0.2294], [0.87156, 0.23392], [0.87258, 0.23487], [0.8736, 0.23487], [0.87462, 0.23498], [0.87564, 0.23887], [0.87666, 0.23976], [0.87768, 0.23997], [0.8787, 0.24076], [0.87971, 0.24281], [0.88073, 0.24512], [0.88175, 0.2456], [0.88277, 0.25149], [0.88379, 0.25843], [0.88481, 0.25843], [0.88583, 0.25911], [0.88685, 0.26063], [0.88787, 0.26589], [0.88889, 0.266], [0.88991, 0.26747], [0.89093, 0.27425], [0.89195, 0.27509], [0.89297, 0.2752], [0.89399, 0.2772], [0.89501, 0.27856], [0.89602, 0.28025], [0.89704, 0.28156], [0.89806, 0.28545], [0.89908, 0.28703], [0.9001, 0.28755], [0.90112, 0.29775], [0.90214, 0.29797], [0.90316, 0.2987], [0.90418, 0.29923], [0.9052, 0.30165], [0.90622, 0.30312], [0.90724, 0.30506], [0.90826, 0.30522], [0.90928, 0.30522], [0.9103, 0.30638], [0.91131, 0.30927], [0.91233, 0.30943], [0.91335, 0.31032], [0.91437, 0.31179], [0.91539, 0.312], [0.91641, 0.31332], [0.91743, 0.31416], [0.91845, 0.31726], [0.91947, 0.32068], [0.92049, 0.32121], [0.92151, 0.32257], [0.92253, 0.32289], [0.92355, 0.3241], [0.92457, 0.32662], [0.92559, 0.32762], [0.92661, 0.32772], [0.92762, 0.33193], [0.92864, 0.33735], [0.92966, 0.33866], [0.93068, 0.3435], [0.9317, 0.34518], [0.93272, 0.34855], [0.93374, 0.35149], [0.93476, 0.35286], [0.93578, 0.3548], [0.9368, 0.35528], [0.93782, 0.35564], [0.93884, 0.35959], [0.93986, 0.3609], [0.94088, 0.36117], [0.9419, 0.37063], [0.94292, 0.37715], [0.94393, 0.37778], [0.94495, 0.37936], [0.94597, 0.3823], [0.94699, 0.38509], [0.94801, 0.38535], [0.94903, 0.38803], [0.95005, 0.39303], [0.95107, 0.39781], [0.95209, 0.40633], [0.95311, 0.40906], [0.95413, 0.4118], [0.95515, 0.41306], [0.95617, 0.41932], [0.95719, 0.42174], [0.95821, 0.42521], [0.95923, 0.43099], [0.96024, 0.43488], [0.96126, 0.43614], [0.96228, 0.43788], [0.9633, 0.43903], [0.96432, 0.44087], [0.96534, 0.44445], [0.96636, 0.45644], [0.96738, 0.46248], [0.9684, 0.47758], [0.96942, 0.47921], [0.97044, 0.48846], [0.97146, 0.50055], [0.97248, 0.51123], [0.9735, 0.51491], [0.97452, 0.52127], [0.97554, 0.52495], [0.97655, 0.56512], [0.97757, 0.58194], [0.97859, 0.59009], [0.97961, 0.59982], [0.98063, 0.61854], [0.98165, 0.62296], [0.98267, 0.62332], [0.98369, 0.64209], [0.98471, 0.64362], [0.98573, 0.65645], [0.98675, 0.65787], [0.98777, 0.6616], [0.98879, 0.67438], [0.98981, 0.67506], [0.99083, 0.67664], [0.99185, 0.6789], [0.99286, 0.68563], [0.99388, 0.70083], [0.9949, 0.70551], [0.99592, 0.71376], [0.99694, 0.72506], [0.99796, 0.83879], [0.99898, 0.84179], [1.0, 0.91787], [1.0, 1.0]];
  var S = 240, A = {x: 60, y: 30}, B = {x: 380, y: 30};
  var PI = document.getElementById('prPi'), TR = document.getElementById('prT');
  function axes(o, xl, yl, title) {
    svg.appendChild(el('rect', {x: o.x, y: o.y, width: S, height: S, fill: '#FFFFFF', stroke: '#D8D4C8'}));
    svg.appendChild(el('text', {x: o.x, y: o.y - 10, 'font-size': 14, 'font-weight': 700, fill: '#111111'}, title));
    [0, 0.5, 1].forEach(function (v) {
      var lab = v === 0.5 ? '0,5' : String(v);
      svg.appendChild(el('text', {x: o.x + v * S, y: o.y + S + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, lab));
      svg.appendChild(el('text', {x: o.x - 6, y: o.y + S - v * S + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, lab));
    });
    svg.appendChild(el('text', {x: o.x + S / 2, y: o.y + S + 34, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, xl));
    var cy = o.y + S / 2;
    svg.appendChild(el('text', {x: o.x - 32, y: cy, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850', transform: 'rotate(-90 ' + (o.x - 32) + ' ' + cy + ')'}, yl));
  }
  function poly(o, xy, color) {
    var d = xy.map(function (q, k) { return (k ? 'L' : 'M') + (o.x + q[0] * S).toFixed(1) + ' ' + (o.y + S - q[1] * S).toFixed(1); }).join(' ');
    svg.appendChild(el('path', {d: d, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linejoin': 'round'}));
  }
  function update() {
    var pi = +PI.value / 100, rt = +TR.value;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 640, height: 330, fill: '#FFFFFF'}));
    axes(A, 'FPR', 'TPR = recall', 'ROC');
    axes(B, 'recall', 'precision', 'PR');
    svg.appendChild(el('line', {x1: A.x, y1: A.y + S, x2: A.x + S, y2: A.y, stroke: '#C9C3B6', 'stroke-dasharray': '5 4'}));
    svg.appendChild(el('line', {x1: B.x, y1: B.y + S - pi * S, x2: B.x + S, y2: B.y + S - pi * S, stroke: '#C9C3B6', 'stroke-dasharray': '5 4'}));
    svg.appendChild(el('text', {x: B.x + 6, y: B.y + S - pi * S - 6, 'text-anchor': 'start', 'font-size': 11, fill: '#8A8478'}, 'случайная модель: ' + fmt(pi, 3)));
    var roc = Q.map(function (q) { return [q[1], q[0]]; });
    poly(A, roc, '#3576C0');
    var pr = [], ap = 0, prev = 0, cur = null;
    Q.forEach(function (q) {
      if (q[0] <= 0) return;
      var prec = pi * q[0] / (pi * q[0] + (1 - pi) * q[1]);
      pr.push([q[0], prec]);
      if (q[0] > prev) { ap += (q[0] - prev) * prec; prev = q[0]; }
      if (!cur && q[0] >= rt - 1e-9) cur = {tpr: q[0], fpr: q[1], p: prec};
    });
    poly(B, pr, '#C29E08');
    svg.appendChild(el('circle', {cx: A.x + cur.fpr * S, cy: A.y + S - cur.tpr * S, r: 7, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
    svg.appendChild(el('circle', {cx: B.x + cur.tpr * S, cy: B.y + S - cur.p * S, r: 7, fill: '#8F7406', stroke: '#FFFFFF', 'stroke-width': 2}));
    var npos = 1000 * pi, tp = cur.tpr * npos, fp = cur.fpr * (1000 - npos);
    document.getElementById('prPio').textContent = fmt(pi * 100, 1) + ' %';
    document.getElementById('prTo').textContent = fmt(rt, 2);
    document.getElementById('prAP').textContent = fmt(ap, 3);
    document.getElementById('prP').textContent = fmt(cur.p, 3);
    document.getElementById('prF').textContent = fmt(cur.fpr, 3);
    document.getElementById('prN').textContent = 'не сдают ' + Math.round(npos) + ', модель отмечает ' + Math.round(tp + fp) +
      '\nиз них не сдают ' + Math.round(tp) + ', ложных тревог ' + Math.round(fp);
  }
  PI.addEventListener('input', update); TR.addEventListener('input', update);
  document.querySelectorAll('#prLive [data-pi]').forEach(function (b) {
    b.addEventListener('click', function () { PI.value = b.getAttribute('data-pi'); update(); });
  });
  update();
})();
</script>


<p>
  При переходе от 4,9 % к 50 % несдавших ROC-кривая и ROC-AUC не меняются, а AP растёт с <span class="math-inline" data-tex="0{,}468"></span>
  до <span class="math-inline" data-tex="0{,}905"></span>. Поэтому AP сравнивают с базовым уровнем случайной модели, равным доле положительных <span class="math-inline" data-tex="\pi"></span>,
  а не с <span class="math-inline" data-tex="0{,}5"></span>. На потоке <span class="math-inline" data-tex="\text{AP} = 0{,}468"></span> почти в десять раз выше этого уровня.
</p>

<p>
  Лес с настройками по умолчанию на том же потоке уступает логистической регрессии по обеим метрикам:
  по ROC-AUC на 0,08, по AP на 0,14, почти треть результата регрессии.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Модель на потоке</th><th>ROC-AUC</th><th>AP</th></tr>
  <tr><td>случайный порядок</td><td>0,5</td><td>0,049</td></tr>
  <tr><td>логистическая регрессия</td><td>0,906</td><td>0,468</td></tr>
  <tr><td>лес, настройки по умолчанию</td><td>0,822</td><td>0,327</td></tr>
</table></div>


<p>
  Когда положительный класс редкий и важен (отстающие студенты, мошеннические платежи, редкие болезни),
  модели сравнивают по AP и PR-кривой: precision показывает, сколько ложных тревог придётся разбирать.
  ROC-AUC пригодна, когда важны оба класса или когда доля положительных в работе будет другой, чем в тесте.
</p>


## Часть 9. Качество самих вероятностей

<p>
  AUC зависит только от порядка. Но иногда вероятность нужна как число: деканат планирует, сколько
  консультаций провести, и складывает вероятности «не сдаст» по всем студентам. Тогда важно, чтобы из
  студентов с оценкой 0,3 не сдавали действительно около 30 %.
</p>

<p>
  На десяти студентах у леса и у логистической регрессии (leave-one-out) один и тот же AUC, <span class="math-inline" data-tex="0{,}88"></span>.
  Вероятности у них разные. Log loss из статьи про логистическую регрессию штрафует за уверенность
  в неправильном ответе:
</p>

<div class="math-display" data-tex="\text{log loss} = -\frac{1}{n}\sum_{i=1}^{n} \ln p_i^{\text{верный}}"></div>

<p>
  где <span class="math-inline" data-tex="p_i^{\text{верный}}"></span> — вероятность, которую модель дала правильному классу студента <span class="math-inline" data-tex="i"></span>.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Сдал</th><th>Лес: доля «сдаст»</th><th>Штраф леса</th><th>Регрессия: вероятность «сдаст»</th><th>Штраф регрессии</th></tr>
  <tr><td>1</td><td>нет</td><td>0,524</td><td>0,74</td><td>0,018</td><td>0,02</td></tr>
  <tr><td>2</td><td>нет</td><td>0,200</td><td>0,22</td><td>0,001</td><td>0,00</td></tr>
  <tr><td>3</td><td>нет</td><td>0,400</td><td>0,51</td><td>0,083</td><td>0,09</td></tr>
  <tr class="hl"><td>4</td><td>да</td><td>0,270</td><td>1,31</td><td>0,044</td><td>3,12</td></tr>
  <tr><td>5</td><td>нет</td><td>0,154</td><td>0,17</td><td>0,021</td><td>0,02</td></tr>
  <tr><td>6</td><td>нет</td><td>0,581</td><td>0,87</td><td>0,764</td><td>1,44</td></tr>
  <tr><td>7</td><td>да</td><td>0,816</td><td>0,20</td><td>0,969</td><td>0,03</td></tr>
  <tr><td>8</td><td>да</td><td>0,594</td><td>0,52</td><td>0,382</td><td>0,96</td></tr>
  <tr><td>9</td><td>да</td><td>0,938</td><td>0,06</td><td>0,993</td><td>0,01</td></tr>
  <tr><td>10</td><td>да</td><td>0,848</td><td>0,16</td><td>0,994</td><td>0,01</td></tr>
  <tr><td>среднее</td><td></td><td></td><td><b>0,478</b></td><td></td><td><b>0,570</b></td></tr>
</table></div>


<p>
  Логистическая регрессия почти везде увереннее леса и почти везде права, но студенту 4 она дала 0,044,
  а он сдал. Один этот студент стоит ей <span class="math-inline" data-tex="-\ln 0{,}044 \approx 3{,}12"></span>, больше, чем все остальные вместе.
  В среднем у леса <span class="math-inline" data-tex="0{,}478"></span>, у регрессии <span class="math-inline" data-tex="0{,}570"></span>: при одинаковом AUC вероятности леса лучше.
</p>

<p>
  Вторая обычная мера — Brier score, средний квадрат разности между вероятностью и ответом:
  <span class="math-inline" data-tex="\frac{1}{n}\sum (p_i - y_i)^2"></span>. Он штрафует мягче: за самую грубую ошибку не больше 1. У леса <span class="math-inline" data-tex="0{,}159"></span>,
  у регрессии <span class="math-inline" data-tex="0{,}189"></span>.
</p>

<p>
  На потоке из части 8 картина другая. Для сравнения есть константа: всем студентам вероятность 4,9 %.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Модель на потоке</th><th>ROC-AUC</th><th>log loss</th><th>Brier</th></tr>
  <tr><td>константа 4,9 %</td><td>0,5</td><td>0,196</td><td>0,047</td></tr>
  <tr><td>логистическая регрессия</td><td>0,906</td><td>0,127</td><td>0,034</td></tr>
  <tr><td>лес, настройки по умолчанию</td><td>0,822</td><td>0,263</td><td>0,048</td></tr>
  <tr><td>лес, <code>min_samples_leaf=30</code></td><td>0,895</td><td>0,135</td><td>0,036</td></tr>
  <tr><td>лес по умолчанию + изотоническая калибровка</td><td>0,844</td><td>0,149</td><td>0,038</td></tr>
</table></div>


<p>
  Лес с настройками по умолчанию ранжирует сносно (ROC-AUC 0,822), но по log loss и Brier проигрывает
  константе. Калибровочная кривая показывает почему. Студентов делят на группы по предсказанной вероятности
  (0–0,1, 0,1–0,2 и так далее) и в каждой группе сравнивают среднюю вероятность с долей тех, кто на самом деле
  не сдал. У хорошо откалиброванной модели точки лежат на диагонали.
</p>


<div class="cm-fig"><svg viewBox="0 0 660 410" role="img" aria-label="Калибровочные кривые двух моделей на потоке"><rect x="0" y="0" width="660" height="410" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><rect x="80" y="30" width="320" height="320" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="80" y1="350" x2="400" y2="30" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="6 5"/><text x="80" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><text x="72" y="354" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="144" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,2</text><text x="72" y="290" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,2</text><text x="208" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,4</text><text x="72" y="226" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,4</text><text x="272" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,6</text><text x="72" y="162" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,6</text><text x="336" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0,8</text><text x="72" y="98" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0,8</text><text x="400" y="368" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><text x="72" y="34" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><text x="240" y="390" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">средняя предсказанная вероятность «не сдаст»</text><text x="36" y="190" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 190.0)">доля несдавших на деле</text><path d="M85.7 345.3 L124.7 309.1 L159.0 287.4 L190.3 244.9 L223.8 236.5 L255.4 178.4 L287.1 127.6 L319.3 97.8 L348.9 50.4" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="85.7" cy="345.3" r="10.5" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="124.7" cy="309.1" r="9.1" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="159.0" cy="287.4" r="7.0" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="190.3" cy="244.9" r="6.1" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="223.8" cy="236.5" r="5.5" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="255.4" cy="178.4" r="5.0" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="287.1" cy="127.6" r="4.5" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="319.3" cy="97.8" r="4.5" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="348.9" cy="50.4" r="4.1" fill="#3576C0" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><path d="M81.6 342.2 L127.1 304.8 L157.6 296.2 L190.1 277.5 L222.7 266.5 L258.6 292.4 L287.7 290.2 L320.7 233.1 L349.2 178.8 L387.7 133.7" fill="none" stroke="#C29E08" stroke-width="2.6"/><circle cx="81.6" cy="342.2" r="10.5" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="127.1" cy="304.8" r="6.4" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="157.6" cy="296.2" r="6.6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="190.1" cy="277.5" r="4.7" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="222.7" cy="266.5" r="4.6" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="258.6" cy="292.4" r="5.9" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="287.7" cy="290.2" r="6.0" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="320.7" cy="233.1" r="5.2" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="349.2" cy="178.8" r="5.1" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><circle cx="387.7" cy="133.7" r="5.0" fill="#C29E08" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.2"/><line x1="430" y1="60" x2="460" y2="60" stroke="#3576C0" stroke-width="3"/><text x="468" y="65" font-size="13" fill="#111111" text-anchor="start" font-weight="400">логистическая регрессия</text><line x1="430" y1="86" x2="460" y2="86" stroke="#C29E08" stroke-width="3"/><text x="468" y="91" font-size="13" fill="#111111" text-anchor="start" font-weight="400">лес по умолчанию</text><line x1="430" y1="112" x2="460" y2="112" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="6 5"/><text x="468" y="117" font-size="13" fill="#111111" text-anchor="start" font-weight="400">идеальная калибровка</text><text x="430" y="150" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">Размер точки — сколько студентов</text><text x="430" y="166" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">получили такую вероятность.</text><text x="375.74" y="159.66" font-size="13" fill="#8F7406" text-anchor="end" font-weight="700">0,96 → 0,68</text></svg></div>


<p>
  Точки логистической регрессии идут вдоль диагонали. Лес слишком уверен: там, где он в среднем ставит
  0,96, не сдали 68 %. Деревья в лесу растут до чистых листьев и запоминают шумных студентов, поэтому
  доля голосов часто близка к 0 или 1.
</p>

<p>
  Есть два способа это исправить. Можно ограничить листья: с <code>min_samples_leaf=30</code> лес даёт log loss
  0,135 и Brier 0,036. Можно откалибровать готовую модель: <code>CalibratedClassifierCV</code> обучает на
  кросс-валидации монотонное преобразование оценок (сигмоиду или изотоническую регрессию). Порядок студентов
  оно почти не трогает, а числа подтягивает к частотам: с изотонической калибровкой у леса log loss 0,149.
</p>


## Часть 10. Больше двух классов

<p>
  В статье про дерево регрессии у студентов были баллы за экзамен. Разобьём их на три оценки:
  меньше 50 — «не сдал», от 50 до 74 — «сдал», от 75 — «отлично». Предсказывать будем деревом регрессии
  глубины 2, которое там осталось после обрезки, тоже в режиме leave-one-out: предсказанный балл переводим в оценку.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Баллы</th><th>Оценка</th><th>Прогноз дерева (LOO)</th><th>Оценка по прогнозу</th></tr>
  <tr><td>1</td><td>30</td><td>не сдал</td><td>48,7</td><td>не сдал</td></tr>
  <tr><td>2</td><td>22</td><td>не сдал</td><td>38,2</td><td>не сдал</td></tr>
  <tr><td>3</td><td>41</td><td>не сдал</td><td>26,0</td><td>не сдал</td></tr>
  <tr class="hl"><td>4</td><td>58</td><td>сдал</td><td>41,0</td><td>не сдал</td></tr>
  <tr><td>5</td><td>35</td><td>не сдал</td><td>48,7</td><td>не сдал</td></tr>
  <tr><td>6</td><td>47</td><td>не сдал</td><td>32,0</td><td>не сдал</td></tr>
  <tr class="hl"><td>7</td><td>72</td><td>сдал</td><td>45,2</td><td>не сдал</td></tr>
  <tr><td>8</td><td>61</td><td>сдал</td><td>72,0</td><td>сдал</td></tr>
  <tr class="hl"><td>9</td><td>80</td><td>отлично</td><td>66,5</td><td>сдал</td></tr>
  <tr><td>10</td><td>84</td><td>отлично</td><td>76,0</td><td>отлично</td></tr>
</table></div>


<p>
  Матрица ошибок теперь 3 × 3. Верные ответы по-прежнему на диагонали: <span class="math-inline" data-tex="5 + 1 + 1 = 7"></span> из 10.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>правда \ прогноз</th><th>не сдал</th><th>сдал</th><th>отлично</th></tr>
  <tr><th>не сдал</th><td class="hl"><b>5</b></td><td>0</td><td>0</td></tr>
  <tr><th>сдал</th><td>2</td><td class="hl"><b>1</b></td><td>0</td></tr>
  <tr><th>отлично</th><td>0</td><td>1</td><td class="hl"><b>1</b></td></tr>
</table></div>


<p>
  Precision и recall считаются для каждого класса отдельно, по схеме «этот класс против всех остальных».
  Для класса «сдал» в столбце «сдал» два студента (8 и 9), верен один: precision <span class="math-inline" data-tex="1/2"></span>. В строке «сдал»
  три студента (4, 7, 8), найден один: recall <span class="math-inline" data-tex="1/3"></span>.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Класс</th><th>precision</th><th>recall</th><th>F1</th><th>Студентов</th></tr>
  <tr><td>не сдал</td><td><span class="math-inline" data-tex="5/7 = 0{,}714"></span></td><td><span class="math-inline" data-tex="5/5 = 1"></span></td><td>0,833</td><td>5</td></tr>
  <tr><td>сдал</td><td><span class="math-inline" data-tex="1/2 = 0{,}5"></span></td><td><span class="math-inline" data-tex="1/3 = 0{,}333"></span></td><td>0,400</td><td>3</td></tr>
  <tr><td>отлично</td><td><span class="math-inline" data-tex="1/1 = 1"></span></td><td><span class="math-inline" data-tex="1/2 = 0{,}5"></span></td><td>0,667</td><td>2</td></tr>
</table></div>


<p>
  Три числа F1 сводят в одно тремя способами.
</p>

<ul>
  <li><b>Macro</b>: простое среднее по классам, <span class="math-inline" data-tex="(0{,}833 + 0{,}400 + 0{,}667)/3 = 0{,}633"></span>. Каждый класс
    весит одинаково, сколько бы в нём ни было студентов. Если редкий класс модель угадывает плохо, macro F1 это покажет.</li>
  <li><b>Weighted</b>: среднее с весами по числу студентов в классе (5, 3, 2): <span class="math-inline" data-tex="0{,}670"></span>. Здесь больше
    весит «не сдал», где модель хороша.</li>
  <li><b>Micro</b>: TP, FP и FN складываются по всем классам, потом считается одно F1. Когда у каждого объекта
    ровно один класс, каждая ошибка — одновременно FP для одного класса и FN для другого, и micro F1 совпадает
    с accuracy: <span class="math-inline" data-tex="0{,}7"></span>.</li>
</ul>

<p>
  В <code>classification_report</code> из sklearn есть все три строки; micro там подписана как accuracy.
  В <code>f1_score</code> способ задаёт параметр <code>average</code>.
</p>


## Часть 11. Как выбрать метрику

<p>
  Выбор начинается с вопроса, что будет происходить с ответами модели и сколько стоит каждая ошибка.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Ситуация</th><th>На что смотреть</th></tr>
  <tr><td>классы примерно поровну, ошибки стоят одинаково</td><td>accuracy</td></tr>
  <tr><td>пропуск дорог: отстающие студенты, болезнь, мошенничество</td><td>recall при допустимой precision, <span class="math-inline" data-tex="F_2"></span></td></tr>
  <tr><td>ложная тревога дорога: недопуск к экзамену, блокировка карты, спам-фильтр</td><td>precision при допустимом recall, <span class="math-inline" data-tex="F_{0{,}5}"></span></td></tr>
  <tr><td>нужен рейтинг, порог выберут потом</td><td>ROC-AUC</td></tr>
  <tr><td>положительный класс редкий и важен</td><td>AP и PR-кривая</td></tr>
  <tr><td>вероятность используется как число: планирование, расчёт риска</td><td>log loss, Brier, калибровочная кривая</td></tr>
  <tr><td>несколько классов, редкие важны</td><td>macro F1 и метрики по каждому классу</td></tr>
</table></div>


<p>
  Ещё три правила, которые не зависят от задачи.
</p>

<ul>
  <li>Метрики считаются на данных, которых модель не видела: на тесте, кросс-валидацией или OOB.</li>
  <li>Порог и гиперпараметры выбирают на валидации, итоговое число сообщают на тесте, который в выборе не участвовал.</li>
  <li>Рядом с метрикой полезно указать, сколько она у простой модели: константы или случайного порядка.
    Accuracy 0,95, AP 0,47 и log loss 0,13 сами по себе ничего не говорят, пока не видно, что у константы
    они 0,95, 0,05 и 0,20.</li>
</ul>


## Часть 12. Код: метрики с нуля и в sklearn

### Метрики на чистом Python

<p>
  Все метрики статьи на ответах леса. Доли голосов округлены до трёх знаков, как в таблице в начале.
</p>


```python
from math import log

# сдал (1) или нет (0) и доля OOB-голосов леса за «сдаст»
y = [0, 0, 0, 1, 0, 0, 1, 1, 1, 1]
score = [0.524, 0.2, 0.4, 0.27, 0.154, 0.581, 0.816, 0.594, 0.938, 0.848]


def confusion(y, pred):
    tp = sum(1 for t, p in zip(y, pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y, pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y, pred) if t == 1 and p == 0)
    tn = sum(1 for t, p in zip(y, pred) if t == 0 and p == 0)
    return tp, fp, fn, tn


def precision_recall_f1(y, pred):
    tp, fp, fn, tn = confusion(y, pred)
    precision = tp / (tp + fp) if tp + fp else 0.0     # 0/0 считаем нулём, как sklearn
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * tp / (2 * tp + fp + fn) if tp else 0.0
    return precision, recall, f1


def roc_points(y, score):
    """Опускаем порог через студентов по убыванию оценки: (FPR, TPR) после каждого."""
    pos, neg = sum(y), len(y) - sum(y)
    tp = fp = 0
    pts = [(0.0, 0.0)]
    for t, s in sorted(zip(y, score), key=lambda r: -r[1]):
        if t == 1:
            tp += 1
        else:
            fp += 1
        pts.append((fp / neg, tp / pos))
    return pts


def auc_area(pts):
    return sum((x2 - x1) * (y1 + y2) / 2 for (x1, y1), (x2, y2) in zip(pts, pts[1:]))


def auc_pairs(y, score):
    """Доля пар (сдал, не сдал), где у сдавшего оценка выше; ничья — половина."""
    p = [s for t, s in zip(y, score) if t == 1]
    n = [s for t, s in zip(y, score) if t == 0]
    good = sum((a > b) + 0.5 * (a == b) for a in p for b in n)
    return good / (len(p) * len(n))


def average_precision(y, score):
    """Сумма precision в точках, где добавляется очередной положительный, умноженная на шаг recall."""
    pos, tp, ap = sum(y), 0, 0.0
    for k, (t, s) in enumerate(sorted(zip(y, score), key=lambda r: -r[1]), start=1):
        if t == 1:
            tp += 1
            ap += (tp / k) / pos
    return ap


def log_loss(y, p):
    return -sum(log(q) if t == 1 else log(1 - q) for t, q in zip(y, p)) / len(y)


def brier(y, p):
    return sum((q - t) ** 2 for t, q in zip(y, p)) / len(y)


pred = [int(s > 0.5) for s in score]
print('TP, FP, FN, TN =', confusion(y, pred))
print('precision, recall, F1 =', [round(v, 3) for v in precision_recall_f1(y, pred)])
print('ROC:', [(round(a, 1), round(b, 1)) for a, b in roc_points(y, score)])
print('AUC площадью:', round(auc_area(roc_points(y, score)), 3), ' AUC парами:', auc_pairs(y, score))
print('AP:', round(average_precision(y, score), 3))
print('log loss:', round(log_loss(y, score), 3), ' Brier:', round(brier(y, score), 3))
```

```text
TP, FP, FN, TN = (4, 2, 1, 3)
precision, recall, F1 = [0.667, 0.8, 0.727]
ROC: [(0.0, 0.0), (0.0, 0.2), (0.0, 0.4), (0.0, 0.6), (0.0, 0.8), (0.2, 0.8), (0.4, 0.8), (0.6, 0.8), (0.6, 1.0), (0.8, 1.0), (1.0, 1.0)]
AUC площадью: 0.88  AUC парами: 0.88
AP: 0.925
log loss: 0.478  Brier: 0.159
```



### То же в sklearn

<p>
  Числа совпадают. Обратите внимание на порядок клеток в матрице и на <code>classification_report</code>:
  он считает метрики для обоих классов, и строка «не сдал» повторяет числа из шагов 5 и 6 части 4.
</p>


```python
from sklearn.metrics import (confusion_matrix, precision_score, recall_score, f1_score, roc_auc_score,
                             average_precision_score, log_loss, brier_score_loss, classification_report)

y = [0, 0, 0, 1, 0, 0, 1, 1, 1, 1]
score = [0.524, 0.2, 0.4, 0.27, 0.154, 0.581, 0.816, 0.594, 0.938, 0.848]
pred = [int(s > 0.5) for s in score]

print(confusion_matrix(y, pred))               # строки — правда, столбцы — ответ, классы по порядку 0, 1
print(confusion_matrix(y, pred).ravel())       # TN, FP, FN, TP
print(round(precision_score(y, pred), 3), recall_score(y, pred), round(f1_score(y, pred), 3))
print(roc_auc_score(y, score), round(average_precision_score(y, score), 3))
print(round(log_loss(y, score), 3), round(brier_score_loss(y, score), 3))
print(classification_report(y, pred, target_names=['не сдал', 'сдал'], digits=3))
```

```text
[[3 2]
 [1 4]]
[3 2 1 4]
0.667 0.8 0.727
0.88 0.925
0.478 0.159
              precision    recall  f1-score   support

     не сдал      0.750     0.600     0.667         5
        сдал      0.667     0.800     0.727         5

    accuracy                          0.700        10
   macro avg      0.708     0.700     0.697        10
weighted avg      0.708     0.700     0.697        10
```



### Подбор порога на кросс-валидации

<p>
  <code>TunedThresholdClassifierCV</code> (sklearn 1.5 и новее) подбирает порог по выбранной метрике
  на кросс-валидации внутри обучающих данных. Проверка на потоке из 20 000 студентов, положительный класс «не сдал».
  В последней строке AP той же модели на пяти фолдах кросс-валидации: параметр <code>scoring</code> так же
  передаётся в <code>GridSearchCV</code>, если гиперпараметры нужно подбирать по AP, а не по accuracy.
</p>


```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import TunedThresholdClassifierCV, cross_val_score
from sklearn.metrics import precision_score, recall_score, f1_score, average_precision_score


def stream(n, rng):
    """Синтетический поток: около 5 % не сдают; 1 — «не сдал»."""
    h = np.clip(rng.normal(12, 4.5, n), 0, 22)
    a = np.clip(rng.poisson(3, n), 0, 10).astype(float)
    p = 1 / (1 + np.exp(-(-4.75 - 0.45 * (h - 12) + 0.55 * (a - 3))))
    return np.c_[h, a], (rng.uniform(size=n) < p).astype(int)


rng = np.random.default_rng(0)
X_train, y_train = stream(3000, rng)
X_test, y_test = stream(20000, rng)

base = LogisticRegression().fit(X_train, y_train)
tuned = TunedThresholdClassifierCV(LogisticRegression(), scoring='f1', cv=5).fit(X_train, y_train)
print('порог', round(tuned.best_threshold_, 3))
for name, model in (('порог 0,5', base), ('подобранный', tuned)):
    pred = model.predict(X_test)
    print(name, 'precision', round(precision_score(y_test, pred), 3), 'recall', round(recall_score(y_test, pred), 3),
          'F1', round(f1_score(y_test, pred), 3))

ap = cross_val_score(LogisticRegression(), X_train, y_train, cv=5, scoring='average_precision')
print('AP по фолдам', np.round(ap, 3))
```

```text
порог 0.195
порог 0,5 precision 0.695 recall 0.258 F1 0.376
подобранный precision 0.365 recall 0.573 F1 0.446
AP по фолдам [0.495 0.462 0.393 0.454 0.573]
```


## Часть 13. Что получилось


<div class="dt-table"><table class="shape-table">
  <tr><th>Метрика</th><th>Что измеряет</th><th>У леса на десяти студентах</th></tr>
  <tr><td>accuracy</td><td>долю верных ответов</td><td>0,7</td></tr>
  <tr><td>precision</td><td>долю верных среди ответов «сдаст»</td><td><span class="math-inline" data-tex="4/6 \approx 0{,}667"></span></td></tr>
  <tr><td>recall (TPR)</td><td>долю найденных среди сдавших</td><td><span class="math-inline" data-tex="4/5 = 0{,}8"></span></td></tr>
  <tr><td>FPR</td><td>долю ложных тревог среди несдавших</td><td><span class="math-inline" data-tex="2/5 = 0{,}4"></span></td></tr>
  <tr><td>F1</td><td>среднее гармоническое precision и recall</td><td><span class="math-inline" data-tex="8/11 \approx 0{,}727"></span></td></tr>
  <tr><td>ROC-AUC</td><td>качество порядка: доля верно упорядоченных пар</td><td><span class="math-inline" data-tex="22/25 = 0{,}88"></span></td></tr>
  <tr><td>AP</td><td>площадь под PR-кривой ступеньками</td><td>0,925</td></tr>
  <tr><td>log loss</td><td>штраф за уверенность в неверном ответе</td><td>0,478</td></tr>
  <tr><td>Brier</td><td>средний квадрат ошибки вероятности</td><td>0,159</td></tr>
</table></div>


### Что важно уметь восстановить по памяти

<ul>
  <li>Матрица ошибок: строка — правда, столбец — ответ. TP и TN верны, FP — ложная тревога, FN — пропуск.
    Названия клеток зависят от того, какой класс назван положительным.</li>
  <li><span class="math-inline" data-tex="\text{precision} = TP/(TP + FP)"></span> — по столбцу ответа, <span class="math-inline" data-tex="\text{recall} = TP/(TP + FN)"></span> — по строке правды.</li>
  <li>Accuracy при редком классе близка к доле большого класса и почти ничего не говорит о модели.</li>
  <li>Снижение порога поднимает recall и добавляет FP. Порог выбирают на валидации.</li>
  <li><span class="math-inline" data-tex="F_1 = 2TP/(2TP + FP + FN)"></span>, среднее гармоническое; <span class="math-inline" data-tex="F_\beta"></span> при <span class="math-inline" data-tex="\beta > 1"></span> ставит recall выше precision.</li>
  <li>ROC-кривая: TPR против FPR по всем порогам. AUC — вероятность, что положительный получит оценку
    выше отрицательного; не зависит от порога и от доли классов.</li>
  <li>PR-кривая и AP зависят от доли положительных; базовый уровень AP равен этой доле.</li>
  <li>Log loss и Brier оценивают сами вероятности; калибровочная кривая показывает, где модель
    слишком уверена.</li>
  <li>Для нескольких классов: macro — среднее по классам, weighted — с весами, micro при одном классе на объект равна accuracy.</li>
</ul>

<p class="tiny">
  Источники: T. Fawcett, «An introduction to ROC analysis», Pattern Recognition Letters, 2006;
  J. Davis, M. Goadrich, «The Relationship Between Precision-Recall and ROC Curves», ICML 2006;
  T. Saito, M. Rehmsmeier, «The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating
  Binary Classifiers on Imbalanced Datasets», PLOS ONE, 2015; G. Brier, «Verification of forecasts expressed
  in terms of probability», Monthly Weather Review, 1950; документация scikit-learn, разделы
  «Metrics and scoring» и «Probability calibration».
</p>

