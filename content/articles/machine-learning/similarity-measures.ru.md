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
  .prose .cm-fig svg { width: 100%; max-width: 760px; display: block; margin: 0 auto; font-family: Helvetica, Arial, sans-serif; }
  .prose .dt-table, .prose .cm-fig, .prose .dt-formula, .prose .math-display, .prose pre { position: relative; }
  .prose .dt-table tr.hl td { background: #EEF4FB; }
  .prose .stage-figure .katex svg { height: inherit; }
  .prose .rm-modes { display: flex; flex-wrap: wrap; gap: 6px; }
  .prose .rm-modes button { flex: 1 1 auto; }
  .prose .knn-list { font-size: 13px; color: #5E5850; line-height: 1.6; font-variant-numeric: tabular-nums; }
  .prose .knn-list b.p { color: #5F9420; } .prose .knn-list b.f { color: #9C0908; }
</style>

<style>
  .prose .lev-in { display: flex; gap: 8px; flex-wrap: wrap; }
  .prose .lev-in input { font: inherit; font-size: 15px; padding: 5px 8px; border: 1px solid #C9C3B6; border-radius: 8px; width: 8.5em; color: #111111; background: #FFFFFF; }
  .prose .lev-wrap { overflow-x: auto; width: 0; min-width: 100%; margin-top: 12px; position: relative; }
  .prose table.lev { border-collapse: separate; border-spacing: 3px; margin: 0 auto; }
  .prose table.lev td, .prose table.lev th { width: 34px; height: 34px; text-align: center; font-size: 15px; border-radius: 6px; padding: 0; }
  .prose table.lev th { color: #2A5E9B; font-weight: 700; background: none; }
  .prose table.lev th.r { color: #5F9420; }
  .prose table.lev td { border: 1px solid #E0DDD3; background: #FFFFFF; color: #111111; font-variant-numeric: tabular-nums; }
  .prose table.lev td.empty { color: transparent; }
  .prose table.lev td.cand { background: #EEF4FB; border-color: #3576C0; }
  .prose table.lev td.cur { background: #3576C0; color: #FFFFFF; font-weight: 700; }
  .prose table.lev td.path { background: #FFF4CC; border-color: #C29E08; font-weight: 700; }
  .prose .lev-note { font-size: 14px; color: #5E5850; margin-top: 10px; min-height: 2.6em; }
  .prose table.allm { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .prose table.allm td, .prose table.allm th { padding: 5px 6px; border-bottom: 1px solid #EFECE4; text-align: left; }
  .prose table.allm tr.sel td { background: #EEF4FB; }
  .prose table.allm tr { cursor: pointer; }
  .prose table.allm td.diff { color: #9C0908; font-weight: 700; }
</style>

<p class="lead">
  Метод ближайших соседей, кластеризация, поиск похожих товаров и текстов опираются на одно понятие: насколько два
  объекта похожи. Разберём основные меры близости и посмотрим, что каждая из них на самом деле делает
  и почему от её выбора меняется ответ.
</p>

<p>
  В <a href="article.html?slug=knn-full-cycle">статье про kNN</a> соседей искали по обычному расстоянию на плоскости
  «часы подготовки × пропуски». Здесь те же десять студентов и новые студенты А (11 часов, 1 пропуск) и Б (15 часов,
  7 пропусков). Для мер, которым нужны другие данные, появятся профили подготовки, тексты, посещаемость лекций и слова.
</p>


## Часть 1. Объект — это вектор

<p>
  Прежде чем сравнивать объекты, их нужно записать числами. Студент описан двумя числами, текст — частотами слов,
  товар — десятками признаков. Список чисел — это вектор, и все меры близости работают с векторами.
</p>


<div class="stage" id="stageVec" tabindex="0">
  <div class="stage-figure">
<svg id="vecSvg" viewBox="0 0 960 420" role="img" aria-label="Студенты как векторы и вектор разности"><style>#vecSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="420" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="plane"><rect x="64" y="97" width="561" height="255" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="64" y1="352" x2="64" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="115" y1="352" x2="115" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="115" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><line x1="166" y1="352" x2="166" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="166" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="217" y1="352" x2="217" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="217" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><line x1="268" y1="352" x2="268" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="268" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="319" y1="352" x2="319" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="319" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><line x1="370" y1="352" x2="370" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="370" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="421" y1="352" x2="421" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="421" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">14</text><line x1="472" y1="352" x2="472" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="472" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="523" y1="352" x2="523" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="523" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">18</text><line x1="574" y1="352" x2="574" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="574" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="625" y1="352" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="625" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">22</text><line x1="64" y1="352" x2="625" y2="352" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="356" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="64" y1="301" x2="625" y2="301" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="305" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="64" y1="250" x2="625" y2="250" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="254" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="64" y1="199" x2="625" y2="199" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="203" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="64" y1="148" x2="625" y2="148" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="152" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="64" y1="97" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="101" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="625" y="390" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы подготовки</text><text x="30" y="224.5" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 30.0 224.5)">пропуски</text></g>
<g data-key="pts"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="A"><circle cx="344.5" cy="326.5" r="12" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="344.5" cy="326.5" r="12" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="344.5" y="331.5" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text></g>
<g data-key="vA" data-only="1"><line x1="64" y1="352" x2="324.54" y2="328.49" stroke="#3576C0" stroke-width="3"/><polygon points="335.5,327.5 324.1,323.6 325.0,333.4" fill="#3576C0"/><text x="204.25" y="329.25" font-size="14" fill="#2A5E9B" text-anchor="middle" font-weight="700">А = (11; 1)</text></g>
<g data-key="v7" data-only="1"><line x1="64" y1="352" x2="402.1" y2="306.47" stroke="#5F9420" stroke-width="3"/><polygon points="413.0,305.0 401.4,301.6 402.8,311.4" fill="#5F9420"/><text x="268" y="283.9" font-size="14" fill="#5F9420" text-anchor="middle" font-weight="700">7 = (14; 2)</text></g>
<g data-key="d7" data-only="1"><line x1="344.5" y1="326.5" x2="401.56" y2="307.48" stroke="#C30B0A" stroke-width="3.4"/><polygon points="412.0,304.0 400.0,302.8 403.1,312.2" fill="#C30B0A"/></g>
<g data-key="c7" data-only="1"><line x1="344.5" y1="326.5" x2="421" y2="326.5" stroke="#C30B0A" stroke-width="2" stroke-dasharray="5 4"/><line x1="421" y1="326.5" x2="421" y2="301" stroke="#C30B0A" stroke-width="2" stroke-dasharray="5 4"/><text x="382.75" y="344.5" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">3</text><text x="435" y="318.75" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">1</text></g>
<g data-key="d4" data-only="1"><line x1="344.5" y1="326.5" x2="291" y2="326.5" stroke="#C30B0A" stroke-width="3.4"/><polygon points="280.0,326.5 291.0,331.4 291.0,321.6" fill="#C30B0A"/><text x="306.25" y="316.5" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">(−3; 0)</text></g>
<g data-key="d6" data-only="1"><line x1="344.5" y1="326.5" x2="364.36" y2="246.18" stroke="#C30B0A" stroke-width="3.4"/><polygon points="367.0,235.5 359.6,245.0 369.2,247.4" fill="#C30B0A"/><text x="386" y="270.4" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">(1; 4)</text></g>
<g data-key="b1" data-only="1"><rect x="660" y="70" width="280" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="665" y="72" width="270" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\text{студент} = (\text{часы};\ \text{пропуски})"></div></foreignObject></g>
<g data-key="b2" data-only="1"><rect x="660" y="70" width="280" height="110" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="665" y="72" width="270" height="106"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\begin{aligned}\text{А} &amp;= (11;\ 1)\\ \text{студент 7} &amp;= (14;\ 2)\end{aligned}"></div></foreignObject></g>
<g data-key="b3" data-only="1"><rect x="660" y="70" width="280" height="120" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="665" y="72" width="270" height="116"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#9C0908;font-weight:400" data-tex="\begin{aligned}7 - \text{А} &amp;= (14 - 11;\ 2 - 1)\\ &amp;= (3;\ 1)\end{aligned}"></div></foreignObject></g>
<g data-key="b4" data-only="1"><rect x="660" y="70" width="280" height="150" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="665" y="72" width="270" height="146"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#9C0908;font-weight:400" data-tex="\begin{aligned}4 - \text{А} &amp;= (-3;\ 0)\\ 6 - \text{А} &amp;= (1;\ 4)\\ 7 - \text{А} &amp;= (3;\ 1)\end{aligned}"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="plane pts A b1" data-focus="pts b1">
      <div class="step-kicker">Шаг 1 · точки</div>
      <h4>Каждый студент — точка</h4>
      <p>Студента описывают два числа: часы подготовки и пропуски. Пара чисел — это точка на плоскости. Студент А, 11 часов и 1 пропуск, — белый кружок.</p>
    </div>
    <div class="step-panel" data-on="plane pts A vA v7 b2" data-focus="vA v7 b2">
      <div class="step-kicker">Шаг 2 · векторы</div>
      <h4>Точка — это стрелка из начала координат</h4>
      <p>Ту же пару чисел можно нарисовать стрелкой из точки <span class="math-inline" data-tex="(0; 0)"></span>. Такую стрелку называют вектором. Синяя стрелка — студент А, зелёная — студент 7: 14 часов, 2 пропуска.</p>
<p>Со стрелками можно делать арифметику: складывать, вычитать, умножать на число. Каждое действие выполняется по каждой координате отдельно.</p>
    </div>
    <div class="step-panel" data-on="plane pts A vA v7 d7 b3" data-focus="d7 b3">
      <div class="step-kicker">Шаг 3 · разность</div>
      <h4>Разность двух студентов — тоже стрелка</h4>
      <p>Вычтем из вектора студента 7 вектор А: <span class="math-inline" data-tex="(14 - 11;\ 2 - 1) = (3;\ 1)"></span>. Красная стрелка ведёт от А к студенту 7: на 3 часа больше и на 1 пропуск больше.</p>
<p>Вектор разности — это всё, чем один студент отличается от другого. Чем он короче, тем студенты похожее.</p>
    </div>
    <div class="step-panel" data-on="plane pts A d7 c7 b3" data-focus="c7">
      <div class="step-kicker">Шаг 4 · составляющие</div>
      <h4>Разность раскладывается по признакам</h4>
      <p>Красная стрелка — гипотенуза прямоугольного треугольника. Его катеты — разницы по каждому признаку: 3 по часам и 1 по пропускам.</p>
<p>Любая мера близости из этой статьи берёт эти две разницы и сворачивает их в одно число. Меры отличаются только способом свёртки.</p>
    </div>
    <div class="step-panel" data-on="plane pts A d7 d4 d6 b4" data-focus="d4 d6 b4">
      <div class="step-kicker">Шаг 5 · другие соседи</div>
      <h4>Разности до других студентов</h4>
      <p>До студента 4 разница <span class="math-inline" data-tex="(-3;\ 0)"></span>: на 3 часа меньше, пропусков столько же. До студента 6 — <span class="math-inline" data-tex="(1;\ 4)"></span>: почти те же часы, но на 4 пропуска больше.</p>
<p>Кто из них ближе к А — 4, 6 или 7? Ответ зависит от того, как сворачивать разность, и это следующая часть.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Отсюда главная мысль статьи. Любая мера близости сначала смотрит на разницу двух векторов, а потом сворачивает
  её в одно число. Меры отличаются только способом свёртки, а он решает, кто окажется ближе.
</p>


## Часть 2. Три способа измерить одну разность

<p>
  Возьмём одну разность, от А до студента 7: 3 часа и 1 пропуск, и измерим её длину тремя способами.
</p>


<div class="stage" id="stageThree" tabindex="0">
  <div class="stage-figure">
<svg id="threeSvg" viewBox="0 0 960 400" role="img" aria-label="Одна разность и три способа её измерить"><style>#threeSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="400" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="grid"><rect x="80" y="67" width="546" height="273" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="80" y1="340" x2="80" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="80" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">9</text><line x1="158" y1="340" x2="158" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="158" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><line x1="236" y1="340" x2="236" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="236" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">11</text><line x1="314" y1="340" x2="314" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="314" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="392" y1="340" x2="392" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="392" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">13</text><line x1="470" y1="340" x2="470" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="470" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">14</text><line x1="548" y1="340" x2="548" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="548" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">15</text><line x1="626" y1="340" x2="626" y2="67" stroke="#ECE9E1" stroke-width="1"/><text x="626" y="358" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="80" y1="340" x2="626" y2="340" stroke="#ECE9E1" stroke-width="1"/><text x="72" y="344" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="80" y1="262" x2="626" y2="262" stroke="#ECE9E1" stroke-width="1"/><text x="72" y="266" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><line x1="80" y1="184" x2="626" y2="184" stroke="#ECE9E1" stroke-width="1"/><text x="72" y="188" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="80" y1="106" x2="626" y2="106" stroke="#ECE9E1" stroke-width="1"/><text x="72" y="110" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">3</text><text x="626" y="376" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы подготовки</text><text x="80" y="59" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">пропуски</text></g>
<g data-key="stair_alt" data-only="1"><line x1="236" y1="262" x2="236" y2="184" stroke="#8F7406" stroke-width="2" stroke-dasharray="6 4"/><line x1="236" y1="184" x2="470" y2="184" stroke="#8F7406" stroke-width="2" stroke-dasharray="6 4"/><line x1="236" y1="262" x2="314" y2="262" stroke="#8F7406" stroke-width="2" stroke-dasharray="3 4"/><line x1="314" y1="262" x2="314" y2="184" stroke="#8F7406" stroke-width="2" stroke-dasharray="3 4"/><line x1="314" y1="184" x2="470" y2="184" stroke="#8F7406" stroke-width="2" stroke-dasharray="3 4"/></g>
<g data-key="stair" data-only="1"><line x1="236" y1="262" x2="470" y2="262" stroke="#C29E08" stroke-width="5"/><line x1="470" y1="262" x2="470" y2="184" stroke="#C29E08" stroke-width="5"/><rect x="310" y="258" width="8" height="8" rx="0" fill="#C29E08" stroke="none" stroke-width="0"/><rect x="388" y="258" width="8" height="8" rx="0" fill="#C29E08" stroke="none" stroke-width="0"/></g>
<g data-key="hyp" data-only="1"><line x1="236" y1="262" x2="470" y2="184" stroke="#3576C0" stroke-width="5"/><rect x="456" y="248" width="14" height="14" rx="0" fill="none" stroke="#5E5850" stroke-width="1.2"/></g>
<g data-key="leg3" data-only="1"><line x1="236" y1="265" x2="470" y2="265" stroke="#73B222" stroke-width="7"/></g>
<g data-key="king" data-only="1"><rect x="298" y="168" width="32" height="32" rx="6" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="314" y="160" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">ход 1</text><rect x="376" y="168" width="32" height="32" rx="6" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="392" y="160" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">ход 2</text><rect x="454" y="168" width="32" height="32" rx="6" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="470" y="160" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">ход 3</text><line x1="236" y1="262" x2="314" y2="184" stroke="#5F9420" stroke-width="2.4" stroke-dasharray="4 3"/><line x1="314" y1="184" x2="470" y2="184" stroke="#5F9420" stroke-width="2.4" stroke-dasharray="4 3"/></g>
<g data-key="diff"><line x1="236" y1="262" x2="449.51" y2="191.15" stroke="#C30B0A" stroke-width="2.4" stroke-dasharray="5 4"/><polygon points="459.0,188.0 448.1,186.9 450.9,195.4" fill="#C30B0A"/></g>
<g data-key="legs"><text x="353" y="284" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">3 часа</text><text x="488" y="228" font-size="14" fill="#111111" text-anchor="start" font-weight="700">1 пропуск</text></g>
<g data-key="pts"><circle cx="236" cy="262" r="13" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="236" y="267" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text><circle cx="470.0" cy="184.0" r="13" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="470" y="188.18" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text></g>
<g data-key="fM" data-only="1"><rect x="690" y="70" width="250" height="80" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="695" y="72" width="240" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#8F7406;font-weight:400" data-tex="d_1 = |3| + |1| = 4"></div></foreignObject></g>
<g data-key="fE" data-only="1"><rect x="690" y="70" width="250" height="80" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="695" y="72" width="240" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#2A5E9B;font-weight:400" data-tex="d_2 = \sqrt{3^2 + 1^2} \approx 3{,}16"></div></foreignObject></g>
<g data-key="fC" data-only="1"><rect x="690" y="70" width="250" height="80" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="695" y="72" width="240" height="76"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#5F9420;font-weight:400" data-tex="d_\infty = \max(3,\ 1) = 3"></div></foreignObject></g>
<g data-key="fAll" data-only="1"><rect x="690" y="60" width="250" height="150" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="695" y="62" width="240" height="146"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="\begin{aligned}d_1 &amp;= 4\\ d_2 &amp;\approx 3{,}16\\ d_\infty &amp;= 3\end{aligned}"></div></foreignObject><rect x="690" y="230" width="250" height="90" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="695" y="232" width="240" height="86"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="d_p = \Big(\sum_j |\Delta_j|^p\Big)^{1/p}"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="grid diff legs pts" data-focus="diff legs">
      <div class="step-kicker">Шаг 1 · разность</div>
      <h4>Одна разность, крупно</h4>
      <p>Часть плоскости вокруг А и студента 7, увеличенная. Красный пунктир — вектор разности, его катеты — 3 часа и 1 пропуск. Измерим его длину тремя способами.</p>
    </div>
    <div class="step-panel" data-on="grid stair_alt stair diff legs pts fM" data-focus="stair fM">
      <div class="step-kicker">Шаг 2 · Манхэттен</div>
      <h4>Манхэттенское: путь по клеткам</h4>
      <p>Если ходить только вдоль осей, как такси по кварталам Манхэттена, путь от А до 7 — это 3 шага вправо и 1 вверх. Жёлтая лесенка — один такой путь, пунктирные — другие. Все кратчайшие лесенки одной длины: <span class="math-inline" data-tex="3 + 1 = 4"></span>.</p>
<p>Манхэттенское расстояние просто складывает разницы по признакам, без квадратов.</p>
    </div>
    <div class="step-panel" data-on="grid hyp diff legs pts fE" data-focus="hyp fE">
      <div class="step-kicker">Шаг 3 · Евклид</div>
      <h4>Евклидово: напрямую</h4>
      <p>Прямой путь — гипотенуза. По теореме Пифагора её длина <span class="math-inline" data-tex="\sqrt{3^2 + 1^2} = \sqrt{10} \approx 3{,}16"></span>. Это обычное расстояние «по линейке».</p>
<p>Квадрат делает большую разницу ещё больше: из суммы <span class="math-inline" data-tex="9 + 1"></span> девять десятых даёт разница по часам.</p>
    </div>
    <div class="step-panel" data-on="grid leg3 king diff legs pts fC" data-focus="leg3 king fC">
      <div class="step-kicker">Шаг 4 · Чебышёв</div>
      <h4>Чебышёва: самая большая разница</h4>
      <p>Шахматный король ходит на одну клетку в любую сторону, в том числе по диагонали. До клетки студента 7 ему нужно 3 хода: один по диагонали закрывает и часы, и пропуск, затем два вправо.</p>
<p>Число ходов короля — самая большая из разниц: <span class="math-inline" data-tex="\max(3, 1) = 3"></span>. Меньшая разница не добавляет ничего, пока не превысит большую.</p>
    </div>
    <div class="step-panel" data-on="grid stair hyp leg3 diff legs pts fAll" data-focus="fAll">
      <div class="step-kicker">Шаг 5 · семейство</div>
      <h4>Три меры — одна формула</h4>
      <p>Всегда <span class="math-inline" data-tex="d_1 \ge d_2 \ge d_\infty"></span>: лесенка не короче прямой, а прямая не короче самого длинного катета. Все три — частные случаи формулы Минковского с параметром <span class="math-inline" data-tex="p"></span>: при <span class="math-inline" data-tex="p = 1"></span> суммируются модули разниц, при <span class="math-inline" data-tex="p = 2"></span> квадраты, при <span class="math-inline" data-tex="p \to \infty"></span> остаётся только наибольшая.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Все три способа — частные случаи формулы Минковского:
</p>

<div class="math-display" data-tex="d_p(x, y) = \Big(\sum_j |x_j - y_j|^p\Big)^{1/p}"></div>

<p>
  Параметр <span class="math-inline" data-tex="p"></span> решает, насколько важна наибольшая разница по сравнению с остальными. Каждая разница сначала
  возводится в степень <span class="math-inline" data-tex="p"></span>, и при большом <span class="math-inline" data-tex="p"></span> маленькие разницы почти ничего не добавляют к сумме. У А и студента 7
  разница в 1 пропуск даёт 25 % суммы при <span class="math-inline" data-tex="p = 1"></span>, 10 % при <span class="math-inline" data-tex="p = 2"></span> и ничего при <span class="math-inline" data-tex="p = \infty"></span>.
</p>


<div class="dt-live" id="contribLive">
  <div class="dt-live-head"><strong>Интерактив: какой вклад вносит каждая разница</strong>
    <p>Задайте разницы по двум признакам. Справа видно, какую долю итоговой суммы даёт каждая разница при выбранном p и чему равны три расстояния.</p></div>
  <div class="thr-fig"><svg id="contribSvg" viewBox="0 0 620 300" role="img" aria-label="Треугольник разностей и вклады признаков"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="cbA"><span>разница по часам</span><output id="cbAv">3</output></label>
        <input id="cbA" type="range" min="0" max="10" step="0.5" value="3"></div>
      <div class="dt-control"><label for="cbB"><span>разница по пропускам</span><output id="cbBv">1</output></label>
        <input id="cbB" type="range" min="0" max="10" step="0.5" value="1"></div>
      <div class="dt-presets"><button type="button" data-ab="3,1">А и студент 7</button><button type="button" data-ab="3,3">поровну</button><button type="button" data-ab="6,1">6 и 1</button></div>
    </div>
    <div class="dt-controls" style="grid-column: span 2">
      <div class="rm-modes"><button type="button" data-p="1" aria-pressed="false">p = 1</button><button type="button" data-p="1.5" aria-pressed="false">p = 1,5</button><button type="button" data-p="2" aria-pressed="true">p = 2</button><button type="button" data-p="3" aria-pressed="false">p = 3</button><button type="button" data-p="5" aria-pressed="false">p = 5</button><button type="button" data-p="inf" aria-pressed="false">p = ∞</button></div>
      <div class="dt-metrics">
        <div class="dt-metric"><span>манхэттенское d₁</span><strong id="cb1">—</strong></div>
        <div class="dt-metric"><span>евклидово d₂</span><strong id="cb2">—</strong></div>
        <div class="dt-metric"><span>Чебышёва d∞</span><strong id="cbI">—</strong></div>
        <div class="dt-metric is-main"><span id="cbPn">d при p = 2</span><strong id="cbP">—</strong></div>
      </div>
    </div>
  </div>
  <div class="dt-formula" id="cbF"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('contribSvg');
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
  var A = document.getElementById('cbA'), B = document.getElementById('cbB'), p = '2';
  function dp(a, b) { if (p === 'inf') return Math.max(a, b); var q = +p; return Math.pow(Math.pow(a, q) + Math.pow(b, q), 1 / q); }
  function update() {
    var a = +A.value, b = +B.value, U = 22, x0 = 40, y0 = 270;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 300, fill: '#FFFFFF'}));
    for (var i = 0; i <= 10; i++) {
      svg.appendChild(el('line', {x1: x0 + i * U, y1: y0, x2: x0 + i * U, y2: y0 - 10 * U, stroke: '#F1EEE6'}));
      svg.appendChild(el('line', {x1: x0, y1: y0 - i * U, x2: x0 + 10 * U, y2: y0 - i * U, stroke: '#F1EEE6'}));
    }
    var X2 = x0 + a * U, Y2 = y0 - b * U;
    svg.appendChild(el('line', {x1: x0, y1: y0, x2: X2, y2: y0, stroke: '#C29E08', 'stroke-width': 5}));
    svg.appendChild(el('line', {x1: X2, y1: y0, x2: X2, y2: Y2, stroke: '#C29E08', 'stroke-width': 5}));
    svg.appendChild(el('line', {x1: x0, y1: y0, x2: X2, y2: Y2, stroke: '#3576C0', 'stroke-width': 4}));
    svg.appendChild(el('circle', {cx: x0, cy: y0, r: 6, fill: '#111111'}));
    svg.appendChild(el('circle', {cx: X2, cy: Y2, r: 6, fill: '#111111'}));
    svg.appendChild(el('text', {x: (x0 + X2) / 2, y: y0 + 20, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#8F7406'}, 'Δ₁ = ' + fmt(a, 1)));
    svg.appendChild(el('text', {x: X2 + 8, y: (y0 + Y2) / 2, 'font-size': 13, 'font-weight': 700, fill: '#8F7406'}, 'Δ₂ = ' + fmt(b, 1)));
    var L = 330, W = 220, T = 60;
    svg.appendChild(el('text', {x: L, y: T - 22, 'font-size': 13, 'font-weight': 700, fill: '#111111'}, p === 'inf' ? 'p = ∞: решает наибольшая разница' : 'доли в сумме |Δ|^p при p = ' + p.replace('.', ',')));
    var ta, tb;
    if (p === 'inf') { ta = a > b ? 1 : (a < b ? 0 : 0.5); tb = 1 - ta; }
    else { var q = +p, sa = Math.pow(a, q), sb = Math.pow(b, q), s = sa + sb || 1; ta = sa / s; tb = sb / s; }
    svg.appendChild(el('rect', {x: L, y: T, width: W * ta, height: 34, fill: '#F6EFD0', stroke: '#C29E08'}));
    svg.appendChild(el('rect', {x: L + W * ta, y: T, width: W * tb, height: 34, fill: '#DCE8F5', stroke: '#3576C0'}));
    svg.appendChild(el('text', {x: L, y: T + 56, 'font-size': 13, fill: '#8F7406', 'font-weight': 700}, 'часы ' + fmt(ta * 100, 0) + ' %'));
    svg.appendChild(el('text', {x: L + W, y: T + 56, 'text-anchor': 'end', 'font-size': 13, fill: '#2A5E9B', 'font-weight': 700}, 'пропуски ' + fmt(tb * 100, 0) + ' %'));
    var rows = [['1', a + b], ['2', Math.hypot(a, b)], ['inf', Math.max(a, b)]], mx = Math.max(a + b, 0.001);
    rows.forEach(function (r, i) {
      var y = T + 100 + i * 42, w = r[1] / mx * W, cur = r[0] === p;
      svg.appendChild(el('rect', {x: L, y: y, width: w, height: 22, fill: cur ? '#3576C0' : '#E5E1D6'}));
      svg.appendChild(el('text', {x: L - 6, y: y + 16, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, r[0] === 'inf' ? 'd∞' : 'd' + r[0]));
      svg.appendChild(el('text', {x: L + w + 6, y: y + 16, 'font-size': 13, 'font-weight': 700, fill: '#111111'}, fmt(r[1], 2)));
    });
    document.getElementById('cbAv').textContent = fmt(a, 1); document.getElementById('cbBv').textContent = fmt(b, 1);
    document.getElementById('cb1').textContent = fmt(a + b, 2); document.getElementById('cb2').textContent = fmt(Math.hypot(a, b), 2);
    document.getElementById('cbI').textContent = fmt(Math.max(a, b), 2);
    document.getElementById('cbPn').textContent = 'd при p = ' + (p === 'inf' ? '∞' : p.replace('.', ','));
    document.getElementById('cbP').textContent = fmt(dp(a, b), 2);
    var c = function (v) { return fmt(v, 1).replace(',', '{,}'); }, P = p.replace('.', '{,}');
    tex(document.getElementById('cbF'), p === 'inf' ? 'd_\\infty = \\max(' + c(a) + ',\\ ' + c(b) + ') = ' + fmt(dp(a, b), 2).replace(',', '{,}')
        : 'd_{' + P + '} = \\left(' + c(a) + '^{' + P + '} + ' + c(b) + '^{' + P + '}\\right)^{1/' + P + '} = ' + fmt(dp(a, b), 2).replace(',', '{,}'), 'd = ' + fmt(dp(a, b), 2));
  }
  A.addEventListener('input', update); B.addEventListener('input', update);
  document.querySelectorAll('#contribLive [data-p]').forEach(function (b) { b.addEventListener('click', function () { p = b.getAttribute('data-p');
    document.querySelectorAll('#contribLive [data-p]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); }); });
  document.querySelectorAll('#contribLive [data-ab]').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-ab').split(','); A.value = v[0]; B.value = v[1]; update(); }); });
  update();
})();
</script>


<p>
  Форму меры хорошо видно по шару — множеству точек на расстоянии 1 от центра. Ромб у манхэттенской меры появляется
  потому, что сумма <span class="math-inline" data-tex="|\Delta_1| + |\Delta_2| = 1"></span> — это четыре отрезка. Квадрат у меры Чебышёва — потому что
  <span class="math-inline" data-tex="\max(|\Delta_1|, |\Delta_2|) = 1"></span> выполняется на четырёх сторонах квадрата.
</p>


<div class="cm-fig"><svg viewBox="0 0 760 230" role="img" aria-label="Единичные шары расстояния Минковского"><rect x="0" y="0" width="760" height="230" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><line x1="14" y1="105" x2="146" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="80" y1="39" x2="80" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M135.0 105.0 L134.9 105.0 L134.7 105.0 L134.3 105.0 L133.8 105.0 L133.1 105.0 L132.3 105.0 L131.4 104.9 L130.3 104.9 L129.2 104.8 L127.9 104.8 L126.5 104.6 L125.0 104.5 L123.4 104.3 L121.8 104.1 L120.1 103.8 L118.3 103.5 L116.5 103.1 L114.7 102.7 L112.8 102.1 L110.9 101.6 L109.1 100.9 L107.2 100.2 L105.4 99.3 L103.6 98.4 L101.8 97.4 L100.1 96.4 L98.4 95.2 L96.8 94.0 L95.2 92.7 L93.8 91.2 L92.3 89.8 L91.0 88.2 L89.8 86.6 L88.6 84.9 L87.6 83.2 L86.6 81.4 L85.7 79.6 L84.8 77.8 L84.1 75.9 L83.4 74.1 L82.9 72.2 L82.3 70.3 L81.9 68.5 L81.5 66.7 L81.2 64.9 L80.9 63.2 L80.7 61.6 L80.5 60.0 L80.4 58.5 L80.2 57.1 L80.2 55.8 L80.1 54.7 L80.1 53.6 L80.0 52.7 L80.0 51.9 L80.0 51.2 L80.0 50.7 L80.0 50.3 L80.0 50.1 L80.0 50.0 L80.0 50.1 L80.0 50.3 L80.0 50.7 L80.0 51.2 L80.0 51.9 L80.0 52.7 L79.9 53.6 L79.9 54.7 L79.8 55.8 L79.8 57.1 L79.6 58.5 L79.5 60.0 L79.3 61.6 L79.1 63.2 L78.8 64.9 L78.5 66.7 L78.1 68.5 L77.7 70.3 L77.1 72.2 L76.6 74.1 L75.9 75.9 L75.2 77.8 L74.3 79.6 L73.4 81.4 L72.4 83.2 L71.4 84.9 L70.2 86.6 L69.0 88.2 L67.7 89.8 L66.2 91.2 L64.8 92.7 L63.2 94.0 L61.6 95.2 L59.9 96.4 L58.2 97.4 L56.4 98.4 L54.6 99.3 L52.8 100.2 L50.9 100.9 L49.1 101.6 L47.2 102.1 L45.3 102.7 L43.5 103.1 L41.7 103.5 L39.9 103.8 L38.2 104.1 L36.6 104.3 L35.0 104.5 L33.5 104.6 L32.1 104.8 L30.8 104.8 L29.7 104.9 L28.6 104.9 L27.7 105.0 L26.9 105.0 L26.2 105.0 L25.7 105.0 L25.3 105.0 L25.1 105.0 L25.0 105.0 L25.1 105.0 L25.3 105.0 L25.7 105.0 L26.2 105.0 L26.9 105.0 L27.7 105.0 L28.6 105.1 L29.7 105.1 L30.8 105.2 L32.1 105.2 L33.5 105.4 L35.0 105.5 L36.6 105.7 L38.2 105.9 L39.9 106.2 L41.7 106.5 L43.5 106.9 L45.3 107.3 L47.2 107.9 L49.1 108.4 L50.9 109.1 L52.8 109.8 L54.6 110.7 L56.4 111.6 L58.2 112.6 L59.9 113.6 L61.6 114.8 L63.2 116.0 L64.8 117.3 L66.2 118.8 L67.7 120.2 L69.0 121.8 L70.2 123.4 L71.4 125.1 L72.4 126.8 L73.4 128.6 L74.3 130.4 L75.2 132.2 L75.9 134.1 L76.6 135.9 L77.1 137.8 L77.7 139.7 L78.1 141.5 L78.5 143.3 L78.8 145.1 L79.1 146.8 L79.3 148.4 L79.5 150.0 L79.6 151.5 L79.8 152.9 L79.8 154.2 L79.9 155.3 L79.9 156.4 L80.0 157.3 L80.0 158.1 L80.0 158.8 L80.0 159.3 L80.0 159.7 L80.0 159.9 L80.0 160.0 L80.0 159.9 L80.0 159.7 L80.0 159.3 L80.0 158.8 L80.0 158.1 L80.0 157.3 L80.1 156.4 L80.1 155.3 L80.2 154.2 L80.2 152.9 L80.4 151.5 L80.5 150.0 L80.7 148.4 L80.9 146.8 L81.2 145.1 L81.5 143.3 L81.9 141.5 L82.3 139.7 L82.9 137.8 L83.4 135.9 L84.1 134.1 L84.8 132.2 L85.7 130.4 L86.6 128.6 L87.6 126.8 L88.6 125.1 L89.8 123.4 L91.0 121.8 L92.3 120.2 L93.7 118.8 L95.2 117.3 L96.8 116.0 L98.4 114.8 L100.1 113.6 L101.8 112.6 L103.6 111.6 L105.4 110.7 L107.2 109.8 L109.1 109.1 L110.9 108.4 L112.8 107.9 L114.7 107.3 L116.5 106.9 L118.3 106.5 L120.1 106.2 L121.8 105.9 L123.4 105.7 L125.0 105.5 L126.5 105.4 L127.9 105.2 L129.2 105.2 L130.3 105.1 L131.4 105.1 L132.3 105.0 L133.1 105.0 L133.8 105.0 L134.3 105.0 L134.7 105.0 L134.9 105.0 L135.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="80" cy="105" r="3.5" fill="#111111"/><text x="80" y="200" font-size="12.5" fill="#9C0908" text-anchor="middle" font-weight="700">p = 0,5</text><line x1="164" y1="105" x2="296" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="230" y1="39" x2="230" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M285.0 105.0 L285.0 105.0 L284.8 104.8 L284.7 104.7 L284.4 104.4 L284.1 104.1 L283.7 103.7 L283.2 103.2 L282.6 102.6 L282.0 102.0 L281.3 101.3 L280.6 100.6 L279.7 99.7 L278.9 98.9 L277.9 97.9 L276.9 96.9 L275.9 95.9 L274.8 94.8 L273.7 93.7 L272.5 92.5 L271.2 91.2 L270.0 90.0 L268.7 88.7 L267.4 87.4 L266.0 86.0 L264.6 84.6 L263.2 83.2 L261.8 81.8 L260.4 80.4 L258.9 78.9 L257.5 77.5 L256.1 76.1 L254.6 74.6 L253.2 73.2 L251.8 71.8 L250.4 70.4 L249.0 69.0 L247.6 67.6 L246.3 66.3 L245.0 65.0 L243.8 63.8 L242.5 62.5 L241.3 61.3 L240.2 60.2 L239.1 59.1 L238.1 58.1 L237.1 57.1 L236.1 56.1 L235.3 55.3 L234.4 54.4 L233.7 53.7 L233.0 53.0 L232.4 52.4 L231.8 51.8 L231.3 51.3 L230.9 50.9 L230.6 50.6 L230.3 50.3 L230.2 50.2 L230.0 50.0 L230.0 50.0 L230.0 50.0 L229.8 50.2 L229.7 50.3 L229.4 50.6 L229.1 50.9 L228.7 51.3 L228.2 51.8 L227.6 52.4 L227.0 53.0 L226.3 53.7 L225.6 54.4 L224.7 55.3 L223.9 56.1 L222.9 57.1 L221.9 58.1 L220.9 59.1 L219.8 60.2 L218.7 61.3 L217.5 62.5 L216.2 63.7 L215.0 65.0 L213.7 66.3 L212.4 67.6 L211.0 69.0 L209.6 70.4 L208.2 71.8 L206.8 73.2 L205.4 74.6 L203.9 76.1 L202.5 77.5 L201.1 78.9 L199.6 80.4 L198.2 81.8 L196.8 83.2 L195.4 84.6 L194.0 86.0 L192.6 87.4 L191.3 88.7 L190.0 90.0 L188.8 91.2 L187.5 92.5 L186.3 93.7 L185.2 94.8 L184.1 95.9 L183.1 96.9 L182.1 97.9 L181.1 98.9 L180.3 99.7 L179.4 100.6 L178.7 101.3 L178.0 102.0 L177.4 102.6 L176.8 103.2 L176.3 103.7 L175.9 104.1 L175.6 104.4 L175.3 104.7 L175.2 104.8 L175.0 105.0 L175.0 105.0 L175.0 105.0 L175.2 105.2 L175.3 105.3 L175.6 105.6 L175.9 105.9 L176.3 106.3 L176.8 106.8 L177.4 107.4 L178.0 108.0 L178.7 108.7 L179.4 109.4 L180.3 110.3 L181.1 111.1 L182.1 112.1 L183.1 113.1 L184.1 114.1 L185.2 115.2 L186.3 116.3 L187.5 117.5 L188.7 118.7 L190.0 120.0 L191.3 121.3 L192.6 122.6 L194.0 124.0 L195.4 125.4 L196.8 126.8 L198.2 128.2 L199.6 129.6 L201.1 131.1 L202.5 132.5 L203.9 133.9 L205.4 135.4 L206.8 136.8 L208.2 138.2 L209.6 139.6 L211.0 141.0 L212.4 142.4 L213.7 143.7 L215.0 145.0 L216.2 146.2 L217.5 147.5 L218.7 148.7 L219.8 149.8 L220.9 150.9 L221.9 151.9 L222.9 152.9 L223.9 153.9 L224.7 154.7 L225.6 155.6 L226.3 156.3 L227.0 157.0 L227.6 157.6 L228.2 158.2 L228.7 158.7 L229.1 159.1 L229.4 159.4 L229.7 159.7 L229.8 159.8 L230.0 160.0 L230.0 160.0 L230.0 160.0 L230.2 159.8 L230.3 159.7 L230.6 159.4 L230.9 159.1 L231.3 158.7 L231.8 158.2 L232.4 157.6 L233.0 157.0 L233.7 156.3 L234.4 155.6 L235.3 154.7 L236.1 153.9 L237.1 152.9 L238.1 151.9 L239.1 150.9 L240.2 149.8 L241.3 148.7 L242.5 147.5 L243.8 146.2 L245.0 145.0 L246.3 143.7 L247.6 142.4 L249.0 141.0 L250.4 139.6 L251.8 138.2 L253.2 136.8 L254.6 135.4 L256.1 133.9 L257.5 132.5 L258.9 131.1 L260.4 129.6 L261.8 128.2 L263.2 126.8 L264.6 125.4 L266.0 124.0 L267.4 122.6 L268.7 121.3 L270.0 120.0 L271.2 118.7 L272.5 117.5 L273.7 116.3 L274.8 115.2 L275.9 114.1 L276.9 113.1 L277.9 112.1 L278.9 111.1 L279.7 110.3 L280.6 109.4 L281.3 108.7 L282.0 108.0 L282.6 107.4 L283.2 106.8 L283.7 106.3 L284.1 105.9 L284.4 105.6 L284.7 105.3 L284.8 105.2 L285.0 105.0 L285.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="230" cy="105" r="3.5" fill="#111111"/><text x="230" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 1, манхэттенское</text><line x1="314" y1="105" x2="446" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="380" y1="39" x2="380" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M435.0 105.0 L435.0 103.6 L434.9 102.1 L434.8 100.7 L434.7 99.3 L434.5 97.8 L434.3 96.4 L434.1 95.0 L433.8 93.6 L433.5 92.2 L433.1 90.8 L432.7 89.4 L432.3 88.0 L431.8 86.6 L431.3 85.3 L430.8 84.0 L430.2 82.6 L429.6 81.3 L429.0 80.0 L428.3 78.8 L427.6 77.5 L426.9 76.3 L426.1 75.0 L425.3 73.8 L424.5 72.7 L423.6 71.5 L422.7 70.4 L421.8 69.3 L420.9 68.2 L419.9 67.1 L418.9 66.1 L417.9 65.1 L416.8 64.1 L415.7 63.2 L414.6 62.3 L413.5 61.4 L412.3 60.5 L411.2 59.7 L410.0 58.9 L408.7 58.1 L407.5 57.4 L406.2 56.7 L405.0 56.0 L403.7 55.4 L402.4 54.8 L401.0 54.2 L399.7 53.7 L398.4 53.2 L397.0 52.7 L395.6 52.3 L394.2 51.9 L392.8 51.5 L391.4 51.2 L390.0 50.9 L388.6 50.7 L387.2 50.5 L385.7 50.3 L384.3 50.2 L382.9 50.1 L381.4 50.0 L380.0 50.0 L378.6 50.0 L377.1 50.1 L375.7 50.2 L374.3 50.3 L372.8 50.5 L371.4 50.7 L370.0 50.9 L368.6 51.2 L367.2 51.5 L365.8 51.9 L364.4 52.3 L363.0 52.7 L361.6 53.2 L360.3 53.7 L359.0 54.2 L357.6 54.8 L356.3 55.4 L355.0 56.0 L353.8 56.7 L352.5 57.4 L351.3 58.1 L350.0 58.9 L348.8 59.7 L347.7 60.5 L346.5 61.4 L345.4 62.3 L344.3 63.2 L343.2 64.1 L342.1 65.1 L341.1 66.1 L340.1 67.1 L339.1 68.2 L338.2 69.3 L337.3 70.4 L336.4 71.5 L335.5 72.7 L334.7 73.8 L333.9 75.0 L333.1 76.3 L332.4 77.5 L331.7 78.8 L331.0 80.0 L330.4 81.3 L329.8 82.6 L329.2 84.0 L328.7 85.3 L328.2 86.6 L327.7 88.0 L327.3 89.4 L326.9 90.8 L326.5 92.2 L326.2 93.6 L325.9 95.0 L325.7 96.4 L325.5 97.8 L325.3 99.3 L325.2 100.7 L325.1 102.1 L325.0 103.6 L325.0 105.0 L325.0 106.4 L325.1 107.9 L325.2 109.3 L325.3 110.7 L325.5 112.2 L325.7 113.6 L325.9 115.0 L326.2 116.4 L326.5 117.8 L326.9 119.2 L327.3 120.6 L327.7 122.0 L328.2 123.4 L328.7 124.7 L329.2 126.0 L329.8 127.4 L330.4 128.7 L331.0 130.0 L331.7 131.2 L332.4 132.5 L333.1 133.7 L333.9 135.0 L334.7 136.2 L335.5 137.3 L336.4 138.5 L337.3 139.6 L338.2 140.7 L339.1 141.8 L340.1 142.9 L341.1 143.9 L342.1 144.9 L343.2 145.9 L344.3 146.8 L345.4 147.7 L346.5 148.6 L347.7 149.5 L348.8 150.3 L350.0 151.1 L351.3 151.9 L352.5 152.6 L353.8 153.3 L355.0 154.0 L356.3 154.6 L357.6 155.2 L359.0 155.8 L360.3 156.3 L361.6 156.8 L363.0 157.3 L364.4 157.7 L365.8 158.1 L367.2 158.5 L368.6 158.8 L370.0 159.1 L371.4 159.3 L372.8 159.5 L374.3 159.7 L375.7 159.8 L377.1 159.9 L378.6 160.0 L380.0 160.0 L381.4 160.0 L382.9 159.9 L384.3 159.8 L385.7 159.7 L387.2 159.5 L388.6 159.3 L390.0 159.1 L391.4 158.8 L392.8 158.5 L394.2 158.1 L395.6 157.7 L397.0 157.3 L398.4 156.8 L399.7 156.3 L401.0 155.8 L402.4 155.2 L403.7 154.6 L405.0 154.0 L406.2 153.3 L407.5 152.6 L408.7 151.9 L410.0 151.1 L411.2 150.3 L412.3 149.5 L413.5 148.6 L414.6 147.7 L415.7 146.8 L416.8 145.9 L417.9 144.9 L418.9 143.9 L419.9 142.9 L420.9 141.8 L421.8 140.7 L422.7 139.6 L423.6 138.5 L424.5 137.3 L425.3 136.2 L426.1 135.0 L426.9 133.7 L427.6 132.5 L428.3 131.2 L429.0 130.0 L429.6 128.7 L430.2 127.4 L430.8 126.0 L431.3 124.7 L431.8 123.4 L432.3 122.0 L432.7 120.6 L433.1 119.2 L433.5 117.8 L433.8 116.4 L434.1 115.0 L434.3 113.6 L434.5 112.2 L434.7 110.7 L434.8 109.3 L434.9 107.9 L435.0 106.4 L435.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="380" cy="105" r="3.5" fill="#111111"/><text x="380" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 2, евклидово</text><line x1="464" y1="105" x2="596" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="530" y1="39" x2="530" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M585.0 105.0 L585.0 96.1 L585.0 92.4 L584.9 89.6 L584.8 87.2 L584.8 85.1 L584.7 83.2 L584.5 81.5 L584.4 79.9 L584.2 78.4 L584.1 77.0 L583.9 75.7 L583.6 74.4 L583.4 73.2 L583.1 72.1 L582.9 71.0 L582.6 69.9 L582.3 68.9 L581.9 67.9 L581.6 67.0 L581.2 66.1 L580.8 65.2 L580.4 64.4 L579.9 63.6 L579.5 62.8 L579.0 62.1 L578.5 61.4 L578.0 60.7 L577.4 60.0 L576.8 59.4 L576.2 58.8 L575.6 58.2 L575.0 57.6 L574.3 57.0 L573.6 56.5 L572.9 56.0 L572.2 55.5 L571.4 55.1 L570.6 54.6 L569.8 54.2 L568.9 53.8 L568.0 53.4 L567.1 53.1 L566.1 52.7 L565.1 52.4 L564.0 52.1 L562.9 51.9 L561.8 51.6 L560.6 51.4 L559.3 51.1 L558.0 50.9 L556.6 50.8 L555.1 50.6 L553.5 50.5 L551.8 50.3 L549.9 50.2 L547.8 50.2 L545.4 50.1 L542.6 50.0 L538.9 50.0 L530.0 50.0 L521.1 50.0 L517.4 50.0 L514.6 50.1 L512.2 50.2 L510.1 50.2 L508.2 50.3 L506.5 50.5 L504.9 50.6 L503.4 50.8 L502.0 50.9 L500.7 51.1 L499.4 51.4 L498.2 51.6 L497.1 51.9 L496.0 52.1 L494.9 52.4 L493.9 52.7 L492.9 53.1 L492.0 53.4 L491.1 53.8 L490.2 54.2 L489.4 54.6 L488.6 55.1 L487.8 55.5 L487.1 56.0 L486.4 56.5 L485.7 57.0 L485.0 57.6 L484.4 58.2 L483.8 58.8 L483.2 59.4 L482.6 60.0 L482.0 60.7 L481.5 61.4 L481.0 62.1 L480.5 62.8 L480.1 63.6 L479.6 64.4 L479.2 65.2 L478.8 66.1 L478.4 67.0 L478.1 67.9 L477.7 68.9 L477.4 69.9 L477.1 71.0 L476.9 72.1 L476.6 73.2 L476.4 74.4 L476.1 75.7 L475.9 77.0 L475.8 78.4 L475.6 79.9 L475.5 81.5 L475.3 83.2 L475.2 85.1 L475.2 87.2 L475.1 89.6 L475.0 92.4 L475.0 96.1 L475.0 105.0 L475.0 113.9 L475.0 117.6 L475.1 120.4 L475.2 122.8 L475.2 124.9 L475.3 126.8 L475.5 128.5 L475.6 130.1 L475.8 131.6 L475.9 133.0 L476.1 134.3 L476.4 135.6 L476.6 136.8 L476.9 137.9 L477.1 139.0 L477.4 140.1 L477.7 141.1 L478.1 142.1 L478.4 143.0 L478.8 143.9 L479.2 144.8 L479.6 145.6 L480.1 146.4 L480.5 147.2 L481.0 147.9 L481.5 148.6 L482.0 149.3 L482.6 150.0 L483.2 150.6 L483.8 151.2 L484.4 151.8 L485.0 152.4 L485.7 153.0 L486.4 153.5 L487.1 154.0 L487.8 154.5 L488.6 154.9 L489.4 155.4 L490.2 155.8 L491.1 156.2 L492.0 156.6 L492.9 156.9 L493.9 157.3 L494.9 157.6 L496.0 157.9 L497.1 158.1 L498.2 158.4 L499.4 158.6 L500.7 158.9 L502.0 159.1 L503.4 159.2 L504.9 159.4 L506.5 159.5 L508.2 159.7 L510.1 159.8 L512.2 159.8 L514.6 159.9 L517.4 160.0 L521.1 160.0 L530.0 160.0 L538.9 160.0 L542.6 160.0 L545.4 159.9 L547.8 159.8 L549.9 159.8 L551.8 159.7 L553.5 159.5 L555.1 159.4 L556.6 159.2 L558.0 159.1 L559.3 158.9 L560.6 158.6 L561.8 158.4 L562.9 158.1 L564.0 157.9 L565.1 157.6 L566.1 157.3 L567.1 156.9 L568.0 156.6 L568.9 156.2 L569.8 155.8 L570.6 155.4 L571.4 154.9 L572.2 154.5 L572.9 154.0 L573.6 153.5 L574.3 153.0 L575.0 152.4 L575.6 151.8 L576.2 151.2 L576.8 150.6 L577.4 150.0 L578.0 149.3 L578.5 148.6 L579.0 147.9 L579.5 147.2 L579.9 146.4 L580.4 145.6 L580.8 144.8 L581.2 143.9 L581.6 143.0 L581.9 142.1 L582.3 141.1 L582.6 140.1 L582.9 139.0 L583.1 137.9 L583.4 136.8 L583.6 135.6 L583.9 134.3 L584.1 133.0 L584.2 131.6 L584.4 130.1 L584.5 128.5 L584.7 126.8 L584.8 124.9 L584.8 122.8 L584.9 120.4 L585.0 117.6 L585.0 113.9 L585.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="530" cy="105" r="3.5" fill="#111111"/><text x="530" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 4</text><line x1="614" y1="105" x2="746" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="680" y1="39" x2="680" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M625.0 50.0 L735.0 50.0 L735.0 160.0 L625.0 160.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="680" cy="105" r="3.5" fill="#111111"/><text x="680" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = ∞, Чебышёва</text><text x="380" y="224" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">Точки на расстоянии 1 от центра для разных p</text></svg></div>


<p>
  При <span class="math-inline" data-tex="p &lt; 1"></span> шар вогнутый, и такая мера уже не годится в расстояния: в следующей части видно почему.
</p>

<p>
  В интерактиве ниже шар растёт вокруг нового студента, пока не накроет k соседей. Переключайте p: у А соседи почти
  не меняются, а у Б при <span class="math-inline" data-tex="p = 1"></span> третье место делят студенты 5 и 7, оба на расстоянии 6, и ответ зависит от того,
  кто попадёт в тройку.
</p>


<div class="dt-live" id="minkLive">
  <div class="dt-live-head"><strong>Интерактив: шар Минковского вокруг нового студента</strong>
    <p>Щёлкните по плоскости, чтобы поставить студента. Пунктир — все точки на том же расстоянии, что k-й сосед: при p = 2 это круг, при p = 1 ромб, при p = ∞ квадрат.</p></div>
  <div class="thr-fig"><svg id="minkSvg" viewBox="0 0 620 330" role="img" aria-label="Соседи нового студента при разных p" style="touch-action: pan-y; cursor: crosshair; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-p="0.5" aria-pressed="false">p = 0,5</button><button type="button" data-p="1" aria-pressed="false">p = 1</button><button type="button" data-p="2" aria-pressed="true">p = 2</button><button type="button" data-p="4" aria-pressed="false">p = 4</button><button type="button" data-p="inf" aria-pressed="false">p = ∞</button></div>
      <div class="dt-control"><label for="minkK"><span>число соседей k</span><output id="minkKv">3</output></label>
        <input id="minkK" type="range" min="1" max="9" step="1" value="3"></div>
      <div class="dt-presets"><button type="button" data-q="11,1">студент А</button><button type="button" data-q="15,7">студент Б</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric is-main"><span>ответ kNN</span><strong id="minkAns">—</strong></div>
      <div class="dt-metric"><span>голоса «сдаст»</span><strong id="minkVotes">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>соседи по порядку</span><div class="knn-list" id="minkList">—</div></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('minkSvg');
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
  var OX = 50, OY = 290, U = 25;
  function px(h) { return OX + h * U; }
  function py(a) { return OY - a * U; }
  function plane(svg) {
    svg.appendChild(el('rect', {x: px(0), y: py(10), width: 22 * U, height: 10 * U, fill: 'none', stroke: '#D8D4C8', 'stroke-width': 1.2}));
    for (var h = 0; h <= 22; h += 2) svg.appendChild(el('text', {x: px(h), y: py(0) + 17, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(h)));
    for (var a = 0; a <= 10; a += 2) svg.appendChild(el('text', {x: px(0) - 7, y: py(a) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(a)));
    svg.appendChild(el('text', {x: px(22), y: py(0) + 34, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'часы подготовки'));
    svg.appendChild(el('text', {x: px(0), y: py(10) - 8, 'font-size': 12, fill: '#5E5850'}, 'пропуски'));
  }
  var D = {"X": [[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]], "y": [0, 0, 0, 1, 0, 0, 1, 1, 1, 1]};
  var q = [15, 7], k = 3, p = '2', drag = false;
  function dist(a, b) {
    var dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
    if (p === 'inf') return Math.max(dx, dy);
    var pp = +p; return Math.pow(Math.pow(dx, pp) + Math.pow(dy, pp), 1 / pp);
  }
  function neigh(c) {
    var o = D.X.map(function (x, i) { return [Math.round(dist(x, c) * 1e9) / 1e9, i]; });
    o.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return o.slice(0, k);
  }
  function ball(r) {
    var pts = [];
    if (p === 'inf') pts = [[-r, -r], [r, -r], [r, r], [-r, r]];
    else for (var i = 0; i <= 240; i++) {
      var t = 2 * Math.PI * i / 240, c = Math.cos(t), s = Math.sin(t), e = 2 / +p;
      pts.push([r * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e), r * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e)]);
    }
    return pts.map(function (v) { return (px(q[0] + v[0])).toFixed(1) + ',' + (py(q[1] + v[1])).toFixed(1); }).join(' ');
  }
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    for (var gx = 0; gx < 44; gx++) for (var gy = 0; gy < 20; gy++) {
      var nb0 = neigh([gx * 0.5 + 0.25, gy * 0.5 + 0.25]), v0 = 0; nb0.forEach(function (n) { v0 += D.y[n[1]]; });
      svg.appendChild(el('rect', {x: px(gx * 0.5), y: py(gy * 0.5 + 0.5), width: U * 0.5 + 0.4, height: U * 0.5 + 0.4, fill: 2 * v0 > k ? '#E3F0D2' : (2 * v0 < k ? '#F8DCDC' : '#ECEAE4')}));
    }
    plane(svg);
    var nb = neigh(q), r = nb[nb.length - 1][0];
    var clip = el('clipPath', {id: 'minkClip'}); clip.appendChild(el('rect', {x: px(0), y: py(10), width: 22 * U, height: 10 * U})); svg.appendChild(clip);
    var gg = el('g', {'clip-path': 'url(#minkClip)'});
    gg.appendChild(el('polygon', {points: ball(r), fill: '#3576C0', 'fill-opacity': 0.07, stroke: '#3576C0', 'stroke-width': 2, 'stroke-dasharray': '6 4'}));
    svg.appendChild(gg);
    nb.forEach(function (n) { var x = D.X[n[1]]; svg.appendChild(el('line', {x1: px(q[0]), y1: py(q[1]), x2: px(x[0]), y2: py(x[1]), stroke: '#2A5E9B', 'stroke-width': 2})); });
    D.X.forEach(function (x, i) {
      if (nb.some(function (n) { return n[1] === i; })) svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 15, fill: 'none', stroke: '#2A5E9B', 'stroke-width': 2.4}));
      svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 10.5, fill: D.y[i] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: px(x[0]), y: py(x[1]) + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    svg.appendChild(el('circle', {cx: px(q[0]), cy: py(q[1]), r: 9, fill: '#FFFFFF', stroke: '#3576C0', 'stroke-width': 3}));
    var v = 0; nb.forEach(function (n) { v += D.y[n[1]]; });
    document.getElementById('minkKv').textContent = k;
    document.getElementById('minkAns').textContent = 2 * v > k ? 'сдаст' : (2 * v < k ? 'не сдаст' : 'ничья');
    document.getElementById('minkVotes').textContent = v + ' из ' + k;
    document.getElementById('minkList').innerHTML = nb.map(function (n) {
      return 'студент ' + (n[1] + 1) + ' · ' + fmt(n[0], 2) + ' · ' + (D.y[n[1]] ? '<b class="p">сдал</b>' : '<b class="f">не сдал</b>');
    }).join('<br>');
  }
  function fromEvent(ev) {
    var b = svg.getBoundingClientRect(), x = (ev.clientX - b.left) * 620 / b.width, y = (ev.clientY - b.top) * 330 / b.height;
    q = [Math.max(0, Math.min(22, Math.round((x - OX) / U * 2) / 2)), Math.max(0, Math.min(10, Math.round((OY - y) / U * 2) / 2))]; update();
  }
  svg.addEventListener('pointerdown', function (ev) { drag = true; svg.setPointerCapture(ev.pointerId); fromEvent(ev); });
  svg.addEventListener('pointermove', function (ev) { if (drag) fromEvent(ev); });
  svg.addEventListener('pointerup', function () { drag = false; });
  svg.addEventListener('pointercancel', function () { drag = false; });
  document.getElementById('minkK').addEventListener('input', function () { k = +this.value; update(); });
  document.querySelectorAll('#minkLive [data-p]').forEach(function (b) { b.addEventListener('click', function () { p = b.getAttribute('data-p');
    document.querySelectorAll('#minkLive [data-p]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); }); });
  document.querySelectorAll('#minkLive [data-q]').forEach(function (b) { b.addEventListener('click', function () { q = b.getAttribute('data-q').split(',').map(Number); update(); }); });
  update();
})();
</script>


<p>
  Манхэттенская мера меньше реагирует на одну большую разницу: она входит в сумму как есть, без квадрата. Её берут,
  когда признаков много и отдельные из них могут сильно расходиться. Мера Чебышёва нужна там, где важен худший признак,
  например при проверке, что все размеры детали в пределах допуска. Евклидова — разумный выбор по умолчанию.
</p>


## Часть 3. Что такое метрика

<p>
  Расстояние <span class="math-inline" data-tex="d(x, y)"></span> тем больше, чем объекты различнее. Сходство <span class="math-inline" data-tex="s(x, y)"></span> наоборот, обычно от 0 до 1;
  одно переводят в другое, например <span class="math-inline" data-tex="d = 1 - s"></span>. Расстояние называют метрикой, если выполнены четыре условия:
</p>

<ul>
  <li><b>Неотрицательность:</b> <span class="math-inline" data-tex="d(x, y) \ge 0"></span>. От А до студента 4 расстояние 3.</li>
  <li><b>Ноль только у совпадающих:</b> <span class="math-inline" data-tex="d(x, y) = 0"></span> тогда и только тогда, когда <span class="math-inline" data-tex="x = y"></span>.</li>
  <li><b>Симметрия:</b> <span class="math-inline" data-tex="d(x, y) = d(y, x)"></span>. От 4 до А тоже 3.</li>
  <li><b>Неравенство треугольника:</b> <span class="math-inline" data-tex="d(x, z) \le d(x, y) + d(y, z)"></span>. Путь от А до 7 напрямую, 3,16, не длиннее
    пути через студента 4: <span class="math-inline" data-tex="3 + 6{,}08 = 9{,}08"></span>.</li>
</ul>

<p>
  Последнее условие нарушается чаще, чем кажется. Проверьте сами.
</p>


<div class="dt-live" id="triLive">
  <div class="dt-live-head"><strong>Интерактив: неравенство треугольника</strong>
    <p>Перетащите точки X, Y, Z. Синий отрезок — прямой путь от X до Z, жёлтый — путь через Y. У метрики прямой путь никогда не длиннее пути через третью точку.</p></div>
  <div class="thr-fig"><svg id="triSvg" viewBox="0 0 620 330" role="img" aria-label="Три точки и неравенство треугольника" style="touch-action: pan-y; cursor: move; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-m="0.5" aria-pressed="false">p = 0,5</button><button type="button" data-m="1" aria-pressed="false">p = 1</button><button type="button" data-m="2" aria-pressed="true">p = 2</button><button type="button" data-m="inf" aria-pressed="false">p = ∞</button><button type="button" data-m="sq" aria-pressed="false">квадрат евклидова</button></div>
      <div class="dt-presets"><button type="button" data-pre="ok">обычный треугольник</button><button type="button" data-pre="half">ломаем при p = 0,5</button><button type="button" data-pre="line">три точки на прямой</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span>прямо: d(X, Z)</span><strong id="triD">—</strong></div>
      <div class="dt-metric"><span>через Y: d(X, Y) + d(Y, Z)</span><strong id="triV">—</strong></div>
      <div class="dt-metric is-main" style="grid-column: 1 / -1" id="triBox"><span>неравенство треугольника</span><strong id="triOk">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('triSvg');
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
  var P = {X: [2, 2], Y: [6, 5], Z: [10, 2]}, mode = '2', drag = null, U = 44, OXp = 50, OYp = 300;
  var PRE = {ok: [{X: [2, 2], Y: [6, 5], Z: [10, 2]}, '2'], half: [{X: [2, 1], Y: [6, 1], Z: [6, 5]}, '0.5'], line: [{X: [1, 3], Y: [5, 3], Z: [9, 3]}, 'sq']};
  function sx(v) { return OXp + v * U; }
  function sy(v) { return OYp - v * U; }
  function d(a, b) {
    var dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
    if (mode === 'inf') return Math.max(dx, dy);
    if (mode === 'sq') return dx * dx + dy * dy;
    var q = +mode; return Math.pow(Math.pow(dx, q) + Math.pow(dy, q), 1 / q);
  }
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    for (var i = 0; i <= 12; i++) svg.appendChild(el('line', {x1: sx(i), y1: sy(0), x2: sx(i), y2: sy(6), stroke: '#F1EEE6'}));
    for (var j = 0; j <= 6; j++) svg.appendChild(el('line', {x1: sx(0), y1: sy(j), x2: sx(12), y2: sy(j), stroke: '#F1EEE6'}));
    svg.appendChild(el('polyline', {points: [P.X, P.Y, P.Z].map(function (p) { return sx(p[0]) + ',' + sy(p[1]); }).join(' '), fill: 'none', stroke: '#C29E08', 'stroke-width': 4}));
    svg.appendChild(el('line', {x1: sx(P.X[0]), y1: sy(P.X[1]), x2: sx(P.Z[0]), y2: sy(P.Z[1]), stroke: '#3576C0', 'stroke-width': 4}));
    var dxz = d(P.X, P.Z), dxy = d(P.X, P.Y), dyz = d(P.Y, P.Z);
    [['X', P.X], ['Y', P.Y], ['Z', P.Z]].forEach(function (q) {
      svg.appendChild(el('circle', {cx: sx(q[1][0]), cy: sy(q[1][1]), r: 13, fill: '#FFFFFF', stroke: '#111111', 'stroke-width': 2.4}));
      svg.appendChild(el('text', {x: sx(q[1][0]), y: sy(q[1][1]) + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#111111'}, q[0]));
    });
    function lab(a, b, v, c) { svg.appendChild(el('text', {x: (sx(a[0]) + sx(b[0])) / 2 + 8, y: (sy(a[1]) + sy(b[1])) / 2 - 8, 'font-size': 13, 'font-weight': 700, fill: c}, fmt(v, 2))); }
    lab(P.X, P.Z, dxz, '#2A5E9B'); lab(P.X, P.Y, dxy, '#8F7406'); lab(P.Y, P.Z, dyz, '#8F7406');
    var ok = dxz <= dxy + dyz + 1e-9;
    document.getElementById('triD').textContent = fmt(dxz, 2);
    document.getElementById('triV').textContent = fmt(dxy, 2) + ' + ' + fmt(dyz, 2) + ' = ' + fmt(dxy + dyz, 2);
    document.getElementById('triOk').textContent = ok ? 'выполнено: прямо не длиннее' : 'нарушено: через Y короче, чем прямо';
    var bx = document.getElementById('triBox'); bx.style.borderColor = ok ? '#73B222' : '#C30B0A'; bx.style.background = ok ? '#F4FAEC' : '#FDF1F1';
    document.getElementById('triOk').style.color = ok ? '#5F9420' : '#9C0908';
  }
  function pos(ev) { var b = svg.getBoundingClientRect(); return [((ev.clientX - b.left) * 620 / b.width - OXp) / U, (OYp - (ev.clientY - b.top) * 330 / b.height) / U]; }
  svg.addEventListener('pointerdown', function (ev) {
    var p = pos(ev), best = null, bd = 1e9;
    ['X', 'Y', 'Z'].forEach(function (k) { var dd = Math.hypot(P[k][0] - p[0], P[k][1] - p[1]); if (dd < bd) { bd = dd; best = k; } });
    drag = best; svg.setPointerCapture(ev.pointerId); move(ev);
  });
  function move(ev) { if (!drag) return; var p = pos(ev); P[drag] = [Math.max(0, Math.min(12, Math.round(p[0] * 2) / 2)), Math.max(0, Math.min(6, Math.round(p[1] * 2) / 2))]; update(); }
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', function () { drag = null; }); svg.addEventListener('pointercancel', function () { drag = null; });
  function setMode(mm) { mode = mm; document.querySelectorAll('#triLive [data-m]').forEach(function (o) { o.setAttribute('aria-pressed', String(o.getAttribute('data-m') === mm)); }); }
  document.querySelectorAll('#triLive [data-m]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-m')); update(); }); });
  document.querySelectorAll('#triLive [data-pre]').forEach(function (b) { b.addEventListener('click', function () {
    var pr = PRE[b.getAttribute('data-pre')]; P = JSON.parse(JSON.stringify(pr[0])); setMode(pr[1]); update(); }); });
  update();
})();
</script>


<p>
  При <span class="math-inline" data-tex="p = 0{,}5"></span> путь из <span class="math-inline" data-tex="(2; 1)"></span> в <span class="math-inline" data-tex="(6; 5)"></span> через <span class="math-inline" data-tex="(6; 1)"></span> стоит <span class="math-inline" data-tex="4 + 4 = 8"></span>, а напрямую — <span class="math-inline" data-tex="(2 + 2)^2 = 16"></span>:
  обход вдвое короче прямой дороги. Квадрат евклидова расстояния ломается на трёх точках одной прямой:
  <span class="math-inline" data-tex="8^2 = 64"></span> больше, чем <span class="math-inline" data-tex="4^2 + 4^2 = 32"></span>.
</p>

<p>
  Для kNN квадрат расстояния безвреден: он ставит соседей в том же порядке. Но KD-дерево и ball tree из статьи
  про kNN отбрасывают заведомо далёкие точки как раз с помощью неравенства треугольника, и с мерой, которая его
  нарушает, такой поиск может пропустить настоящего соседа.
</p>


## Часть 4. Масштаб признаков

<p>
  Вектор разности складывает разницы по разным признакам, как будто они в одних единицах. Посмотрим, что получается,
  когда это не так.
</p>


<div class="stage" id="stageUnits" tabindex="0">
  <div class="stage-figure">
<svg id="unitSvg" viewBox="0 0 960 400" role="img" aria-label="Одни и те же студенты в часах, в минутах и после стандартизации"><style>#unitSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="400" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<defs><clipPath id="unitClip"><rect x="64.0" y="97.0" width="561.0" height="255.0"/></clipPath></defs>
<g data-key="hours" data-only="1"><rect x="64" y="97" width="561" height="255" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="64" y1="352" x2="64" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="115" y1="352" x2="115" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="115" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><line x1="166" y1="352" x2="166" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="166" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="217" y1="352" x2="217" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="217" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><line x1="268" y1="352" x2="268" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="268" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="319" y1="352" x2="319" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="319" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><line x1="370" y1="352" x2="370" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="370" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="421" y1="352" x2="421" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="421" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">14</text><line x1="472" y1="352" x2="472" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="472" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="523" y1="352" x2="523" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="523" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">18</text><line x1="574" y1="352" x2="574" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="574" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="625" y1="352" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="625" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">22</text><line x1="64" y1="352" x2="625" y2="352" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="356" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="64" y1="301" x2="625" y2="301" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="305" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="64" y1="250" x2="625" y2="250" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="254" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="64" y1="199" x2="625" y2="199" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="203" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="64" y1="148" x2="625" y2="148" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="152" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="64" y1="97" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="101" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="625" y="390" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы подготовки</text><text x="30" y="224.5" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 30.0 224.5)">пропуски</text><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><line x1="344.5" y1="326.5" x2="291" y2="326.5" stroke="#C30B0A" stroke-width="3"/><polygon points="280.0,326.5 291.0,331.4 291.0,321.6" fill="#C30B0A"/><text x="306.25" y="316.5" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">3,00</text><line x1="344.5" y1="326.5" x2="364.36" y2="246.18" stroke="#C30B0A" stroke-width="3"/><polygon points="367.0,235.5 359.6,245.0 369.2,247.4" fill="#C30B0A"/><text x="386" y="265.3" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">4,12</text><circle cx="344.5" cy="326.5" r="105.1" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4" clip-path="url(#unitClip)"/><circle cx="344.5" cy="326.5" r="12" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="344.5" y="331.5" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text><text x="660" y="100" font-size="15" fill="#111111" text-anchor="start" font-weight="700">в часах:</text><text x="660" y="124" font-size="14" fill="#111111" text-anchor="start" font-weight="400">до 4 — 3,00, до 6 — 4,12</text><text x="660" y="148" font-size="14" fill="#5F9420" text-anchor="start" font-weight="700">соседи А: 4, 7, 6 → «сдаст»</text></g>
<g data-key="mins" data-only="1"><rect x="64" y="215.76" width="560" height="4.24" rx="0" fill="#F1EEE6" stroke="#5E5850" stroke-width="1"/><text x="624" y="242" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">минуты подготовки (0 … 1320)</text><text x="64" y="165.76" font-size="13" fill="#111111" text-anchor="start" font-weight="700">Минуты и пропуски в одном масштабе: вся плоскость — полоса высотой 4 пикселя</text><circle cx="114.9" cy="218.7" r="7" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1"/><text x="114.91" y="206.73" font-size="11" fill="#9C0908" text-anchor="middle" font-weight="700">1</text><circle cx="165.8" cy="217.0" r="7" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1"/><text x="165.82" y="193.03" font-size="11" fill="#9C0908" text-anchor="middle" font-weight="700">2</text><circle cx="216.7" cy="218.3" r="7" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1"/><text x="216.73" y="206.3" font-size="11" fill="#9C0908" text-anchor="middle" font-weight="700">3</text><circle cx="267.6" cy="219.6" r="7" fill="#73B222" stroke="#FFFFFF" stroke-width="1"/><text x="267.64" y="195.58" font-size="11" fill="#5F9420" text-anchor="middle" font-weight="700">4</text><circle cx="318.5" cy="216.6" r="7" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1"/><text x="318.55" y="204.61" font-size="11" fill="#9C0908" text-anchor="middle" font-weight="700">5</text><circle cx="369.5" cy="217.9" r="7" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1"/><text x="369.45" y="193.88" font-size="11" fill="#9C0908" text-anchor="middle" font-weight="700">6</text><circle cx="420.4" cy="219.2" r="7" fill="#73B222" stroke="#FFFFFF" stroke-width="1"/><text x="420.36" y="207.15" font-size="11" fill="#5F9420" text-anchor="middle" font-weight="700">7</text><circle cx="471.3" cy="217.5" r="7" fill="#73B222" stroke="#FFFFFF" stroke-width="1"/><text x="471.27" y="193.45" font-size="11" fill="#5F9420" text-anchor="middle" font-weight="700">8</text><circle cx="522.2" cy="218.7" r="7" fill="#73B222" stroke="#FFFFFF" stroke-width="1"/><text x="522.18" y="206.73" font-size="11" fill="#5F9420" text-anchor="middle" font-weight="700">9</text><circle cx="573.1" cy="218.3" r="7" fill="#73B222" stroke="#FFFFFF" stroke-width="1"/><text x="573.09" y="194.3" font-size="11" fill="#5F9420" text-anchor="middle" font-weight="700">10</text><circle cx="344.0" cy="219.6" r="76.4" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4"/><circle cx="344.0" cy="219.6" r="8" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="344" y="253.58" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text><text x="64" y="330" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">до 6: √(60² + 4²) ≈ 60,1 мин     до 5: √(60² + 7²) ≈ 60,4     до 4: 180     до 7: √(180² + 1²) ≈ 180,0</text></g>
<g data-key="std" data-only="1"><rect x="174" y="50.2" width="312" height="319.8" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="252" y1="370" x2="252" y2="50.2" stroke="#F1EEE6" stroke-width="1"/><text x="252" y="386" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">−1</text><line x1="174" y1="292" x2="486" y2="292" stroke="#F1EEE6" stroke-width="1"/><text x="168" y="296" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−1</text><line x1="330" y1="370" x2="330" y2="50.2" stroke="#F1EEE6" stroke-width="1"/><text x="330" y="386" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="174" y1="214" x2="486" y2="214" stroke="#F1EEE6" stroke-width="1"/><text x="168" y="218" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="408" y1="370" x2="408" y2="50.2" stroke="#F1EEE6" stroke-width="1"/><text x="408" y="386" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><line x1="174" y1="136" x2="486" y2="136" stroke="#F1EEE6" stroke-width="1"/><text x="168" y="140" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">1</text><text x="486" y="402" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">часы, в стандартных отклонениях</text><text x="174" y="42.2" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">пропуски, в стандартных отклонениях</text><text x="330" y="20" font-size="13" fill="#111111" text-anchor="middle" font-weight="700">Каждый признак: (x − среднее) / отклонение. Часы и минуты дают одну и ту же картину</text><circle cx="207.8" cy="262.3" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="207.8" y="266.47" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="235.0" cy="113.7" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="234.95" y="117.89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="262.1" cy="225.1" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="262.11" y="229.32" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="289.3" cy="336.6" r="15" fill="none" stroke="#3576C0" stroke-width="2.4"/><circle cx="289.3" cy="336.6" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="289.27" y="340.75" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="316.4" cy="76.6" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="316.42" y="80.75" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="343.6" cy="188.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="343.58" y="192.18" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="370.7" cy="299.4" r="15" fill="none" stroke="#3576C0" stroke-width="2.4"/><circle cx="370.7" cy="299.4" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="370.73" y="303.61" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="397.9" cy="150.9" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="397.89" y="155.04" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="425.0" cy="262.3" r="15" fill="none" stroke="#3576C0" stroke-width="2.4"/><circle cx="425.0" cy="262.3" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="425.05" y="266.47" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="452.2" cy="225.1" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="452.2" y="229.32" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><ellipse cx="330.0" cy="336.6" rx="120.9" ry="120.9" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4"/><circle cx="330.0" cy="336.6" r="12" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="330" y="341.57" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text><text x="700" y="120" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">соседи А: 4, 7, 9</text><text x="700" y="144" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">все трое сдали</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hours" data-focus="hours">
      <div class="step-kicker">Шаг 1 · часы</div>
      <h4>В часах</h4>
      <p>Плоскость в одном масштабе по обеим осям. Разность А и студента 4 — 3 часа, А и студента 6 — 1 час и 4 пропуска, длина <span class="math-inline" data-tex="\sqrt{1 + 16} \approx 4{,}12"></span>. Студент 4 ближе, три соседа А — 4, 7, 6, ответ «сдаст».</p>
    </div>
    <div class="step-panel" data-on="mins" data-focus="mins">
      <div class="step-kicker">Шаг 2 · минуты</div>
      <h4>В минутах</h4>
      <p>Запишем подготовку в минутах. Разница 3 часа становится 180 минутами, а 4 пропуска остаются четырьмя. Если нарисовать плоскость в одном масштабе по обеим осям, она сплющивается в полосу: все 10 пропусков занимают по высоте 4 пикселя.</p>
<p>Вертикальные составляющие разностей почти исчезают. Ближе всех к А теперь студенты 6 и 5: у одного на 60 минут больше, у другого на 60 меньше, а разница в 4 и 7 пропусков почти не видна. Оба не сдали, ответ меняется на «не сдаст».</p>
    </div>
    <div class="step-panel" data-on="std" data-focus="std">
      <div class="step-kicker">Шаг 3 · стандартизация</div>
      <h4>После стандартизации</h4>
      <p>Стандартизация переводит каждый признак в стандартные отклонения: <span class="math-inline" data-tex="z = (x - \bar x)/s"></span>. Часы делятся на 5,74 часа, минуты — на 344,7 минуты, и результат одинаковый: единицы измерения пропадают.</p>
<p>Теперь шаг в одно отклонение по часам и по пропускам весит одинаково. Ближайшие к А — студенты 4, 7 и 9. Пунктир — круг в новых единицах; на исходной плоскости он стал бы эллипсом.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Ответ зависит от единиц измерения, хотя сами студенты не изменились. Поэтому перед любой мерой из семейства
  Минковского признаки приводят к одному масштабу. В sklearn это <code>StandardScaler</code> в цепочке перед моделью.
</p>


## Часть 5. Корреляция: расстояние Махаланобиса

<p>
  Стандартизация уравнивает признаки по отдельности. Но признаки бывают ещё и связаны: студент, который много
  готовился, обычно и задач решил много. Тогда облако данных вытянуто, и круг вокруг центра плохо описывает,
  кто обычный, а кто нет.
</p>


<div class="stage" id="stageWhiten" tabindex="0">
  <div class="stage-figure">
<svg id="whitenSvg" viewBox="0 0 960 420" role="img" aria-label="Как облако становится круглым и что происходит с P и Q"><style>#whitenSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="420" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="raw" data-only="1"><rect x="44" y="29" width="572" height="352" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="66" y1="381" x2="66" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="154" y1="381" x2="154" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="242" y1="381" x2="242" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="418" y1="381" x2="418" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="506" y1="381" x2="506" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="594" y1="381" x2="594" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="381" x2="616" y2="381" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="293" x2="616" y2="293" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="117" x2="616" y2="117" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="29" x2="616" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#D8D4C8" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#D8D4C8" stroke-width="1"/><text x="616" y="399" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">часы →</text><text x="44" y="21" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">задачи ↑</text><text x="330" y="22" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">Исходные единицы: часы и решённые задачи</text><circle cx="277.8" cy="261.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.0" cy="224.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="463.0" cy="92.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="382.8" cy="173.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="198.6" cy="267.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.6" cy="205.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="280.2" cy="307.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="341.8" cy="210.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="201.4" cy="270.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="349.4" cy="195.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="348.8" cy="205.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="456.0" cy="135.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="355.4" cy="164.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.8" cy="159.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="210.6" cy="283.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="510.2" cy="68.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="176.8" cy="292.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="418.2" cy="128.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="303.6" cy="254.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="259.6" cy="245.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="277.4" cy="244.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="276.2" cy="251.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="360.4" cy="171.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="321.2" cy="215.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="448.6" cy="183.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="183.6" cy="285.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.8" cy="188.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="258.6" cy="264.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="392.0" cy="172.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="160.6" cy="329.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="302.6" cy="256.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="346.8" cy="191.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="211.2" cy="301.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="408.8" cy="159.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="344.2" cy="218.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="410.6" cy="164.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="406.8" cy="130.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="251.6" cy="240.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="266.2" cy="246.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.8" cy="222.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="389.8" cy="184.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="398.0" cy="145.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="273.2" cy="218.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="281.4" cy="278.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="266.2" cy="232.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="283.2" cy="288.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.0" cy="230.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.4" cy="209.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="494.6" cy="117.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.4" cy="270.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="307.0" cy="223.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.6" cy="165.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="253.8" cy="275.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="300.6" cy="203.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="331.0" cy="225.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="392.0" cy="128.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="224.8" cy="284.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="439.8" cy="124.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="301.8" cy="218.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="343.6" cy="193.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="397.8" cy="122.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="382.8" cy="125.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="414.8" cy="136.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="343.8" cy="203.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.4" cy="235.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="355.4" cy="206.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="250.4" cy="268.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="427.2" cy="140.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="268.0" cy="256.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="229.2" cy="283.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="494.6" cy="79.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.0" cy="245.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="235.6" cy="300.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="478.2" cy="78.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="303.6" cy="212.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="415.0" cy="158.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="263.6" cy="231.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="310.0" cy="238.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="195.0" cy="314.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="177.2" cy="359.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="251.8" cy="249.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.8" cy="214.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="393.8" cy="141.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="524.0" cy="53.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="247.4" cy="268.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="410.8" cy="147.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="281.6" cy="220.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.8" cy="222.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="211.6" cy="299.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="211.6" cy="295.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="267.8" cy="238.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="234.6" cy="260.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.8" cy="170.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="273.8" cy="252.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="430.0" cy="110.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.2" cy="213.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="343.2" cy="187.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="421.0" cy="139.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="371.4" cy="143.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="327.0" cy="198.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.8" cy="223.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.4" cy="204.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="416.2" cy="138.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="392.6" cy="169.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.2" cy="193.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="394.0" cy="181.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="286.4" cy="184.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.8" cy="176.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="217.0" cy="271.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="437.8" cy="153.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="337.2" cy="225.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="344.6" cy="201.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.0" cy="176.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.2" cy="193.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="309.6" cy="244.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="425.2" cy="128.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.2" cy="171.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="256.8" cy="281.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="365.2" cy="164.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="193.6" cy="328.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="462.4" cy="104.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.4" cy="211.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="333.6" cy="170.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="510.6" cy="90.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="502.2" cy="79.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.2" cy="180.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="380.0" cy="196.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="417.2" cy="145.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="464.6" cy="128.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.6" cy="231.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="340.8" cy="186.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="428.0" cy="122.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.6" cy="140.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="390.4" cy="136.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.8" cy="146.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="239.2" cy="278.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.2" cy="265.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="120.0" cy="360.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="309.2" cy="270.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="437.2" cy="96.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="241.2" cy="287.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="428.8" cy="158.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="410.0" cy="159.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="325.6" cy="194.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.4" cy="184.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.6" cy="212.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.2" cy="250.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="307.4" cy="226.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="326.2" cy="232.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="379.0" cy="169.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="393.4" cy="162.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="270.6" cy="284.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="396.0" cy="138.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="267.8" cy="287.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.4" cy="214.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.6" cy="209.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.2" cy="227.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.8" cy="231.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.6" cy="179.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="285.8" cy="267.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="490.0" cy="82.8" r="8" fill="#FFFFFF" stroke="#2A5E9B" stroke-width="3"/><text x="502" y="74.78" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">P</text><circle cx="490.0" cy="327.2" r="8" fill="#FFFFFF" stroke="#9C0908" stroke-width="3"/><text x="502" y="319.22" font-size="14" fill="#9C0908" text-anchor="start" font-weight="700">Q</text><text x="760" y="90" font-size="13" fill="#111111" text-anchor="start" font-weight="400">центр: 11,1 ч, 33,9 задачи</text><text x="760" y="112" font-size="13" fill="#111111" text-anchor="start" font-weight="400">корреляция 0,94</text></g>
<g data-key="z" data-only="1"><rect x="44" y="29" width="572" height="352" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="66" y1="381" x2="66" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="154" y1="381" x2="154" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="242" y1="381" x2="242" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="418" y1="381" x2="418" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="506" y1="381" x2="506" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="594" y1="381" x2="594" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="381" x2="616" y2="381" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="293" x2="616" y2="293" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="117" x2="616" y2="117" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="29" x2="616" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#D8D4C8" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#D8D4C8" stroke-width="1"/><text x="616" y="399" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">часы, отклонения</text><text x="44" y="21" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">задачи, отклонения</text><text x="330" y="22" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">Шаг 1: стандартизация</text><circle cx="299.2" cy="245.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.6" cy="218.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="403.1" cy="124.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="358.1" cy="182.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="254.8" cy="249.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.3" cy="205.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="300.6" cy="278.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.1" cy="208.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="256.3" cy="251.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.4" cy="198.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.1" cy="204.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="399.2" cy="155.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.8" cy="175.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.4" cy="172.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.5" cy="260.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="429.6" cy="107.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="242.5" cy="267.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.0" cy="150.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.7" cy="240.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.0" cy="233.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="299.0" cy="233.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="298.3" cy="238.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="345.6" cy="181.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.6" cy="212.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="395.1" cy="189.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="246.3" cy="262.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.4" cy="193.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="288.4" cy="247.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.3" cy="181.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="233.4" cy="293.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.1" cy="241.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="337.9" cy="194.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.8" cy="273.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="372.7" cy="172.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.5" cy="214.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="373.7" cy="176.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="371.6" cy="151.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="284.5" cy="229.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="292.7" cy="234.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.4" cy="217.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="362.1" cy="189.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.7" cy="162.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="296.6" cy="214.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="301.2" cy="257.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="292.7" cy="224.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="302.2" cy="264.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.8" cy="223.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.6" cy="208.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="420.9" cy="142.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="305.7" cy="251.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="315.6" cy="217.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="349.0" cy="176.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="285.7" cy="255.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="312.0" cy="204.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.1" cy="219.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.3" cy="150.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="269.5" cy="261.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="390.1" cy="147.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="312.7" cy="214.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.1" cy="196.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.6" cy="145.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="358.1" cy="148.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="376.1" cy="155.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.3" cy="203.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="327.6" cy="226.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.8" cy="206.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="283.8" cy="249.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="383.1" cy="158.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.7" cy="241.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="271.9" cy="261.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="420.9" cy="114.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.3" cy="233.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="275.5" cy="272.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="411.7" cy="114.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.7" cy="209.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="376.2" cy="171.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="291.2" cy="224.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.3" cy="228.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="252.7" cy="282.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="242.8" cy="315.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="284.6" cy="236.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="325.0" cy="211.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="364.3" cy="159.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="437.4" cy="96.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.1" cy="250.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="373.9" cy="163.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="301.3" cy="215.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="321.7" cy="216.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="262.1" cy="272.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="262.1" cy="269.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.6" cy="228.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="275.0" cy="244.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.4" cy="180.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="297.0" cy="238.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="384.6" cy="136.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.4" cy="211.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.9" cy="192.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="379.6" cy="158.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.7" cy="160.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="326.8" cy="200.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="324.5" cy="218.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.1" cy="204.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="376.9" cy="157.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.6" cy="179.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="344.9" cy="196.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="364.4" cy="187.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="304.0" cy="189.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.4" cy="184.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="265.1" cy="252.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="389.0" cy="168.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="332.5" cy="219.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.7" cy="202.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="355.4" cy="184.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.1" cy="196.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.1" cy="232.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="381.9" cy="149.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="333.7" cy="180.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="287.4" cy="259.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="348.3" cy="175.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="252.0" cy="293.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="402.8" cy="133.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.9" cy="209.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="330.5" cy="180.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="429.9" cy="123.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="425.1" cy="114.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="333.7" cy="187.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="356.6" cy="198.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="377.4" cy="161.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="404.0" cy="149.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.7" cy="223.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="334.6" cy="191.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="383.5" cy="145.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="340.6" cy="158.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="362.4" cy="155.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="355.9" cy="163.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="277.5" cy="257.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.9" cy="247.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="210.6" cy="315.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.8" cy="251.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="388.7" cy="127.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="278.7" cy="263.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="384.0" cy="171.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="373.4" cy="172.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="326.0" cy="197.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.2" cy="189.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="332.2" cy="209.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.9" cy="237.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="315.8" cy="220.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="326.4" cy="224.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="356.0" cy="179.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="364.1" cy="174.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="295.2" cy="261.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="365.5" cy="157.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.6" cy="263.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.9" cy="211.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="345.1" cy="207.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="327.5" cy="220.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.8" cy="223.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="340.6" cy="186.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="303.7" cy="249.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="330" cy="205" r="124.5" fill="none" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4"/><circle cx="418.3" cy="117.4" r="8" fill="#FFFFFF" stroke="#2A5E9B" stroke-width="3"/><text x="430.3" y="109.45" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">P</text><circle cx="418.3" cy="292.1" r="8" fill="#FFFFFF" stroke="#9C0908" stroke-width="3"/><text x="430.3" y="284.06" font-size="14" fill="#9C0908" text-anchor="start" font-weight="700">Q</text><text x="760" y="90" font-size="13" fill="#111111" text-anchor="start" font-weight="400">P и Q на одном</text><text x="760" y="110" font-size="13" fill="#111111" text-anchor="start" font-weight="400">расстоянии: 2,83</text></g>
<g data-key="rot" data-only="1"><rect x="44" y="29" width="572" height="352" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="66" y1="381" x2="66" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="154" y1="381" x2="154" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="242" y1="381" x2="242" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="418" y1="381" x2="418" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="506" y1="381" x2="506" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="594" y1="381" x2="594" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="381" x2="616" y2="381" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="293" x2="616" y2="293" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="117" x2="616" y2="117" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="29" x2="616" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#D8D4C8" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#D8D4C8" stroke-width="1"/><text x="616" y="399" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">вдоль облака</text><text x="44" y="21" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">поперёк облака</text><text x="330" y="22" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">Шаг 2: поворот на 45° к осям облака</text><circle cx="279.9" cy="211.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.8" cy="208.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="438.7" cy="199.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.1" cy="208.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="245.6" cy="183.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.6" cy="204.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="257.6" cy="235.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="331.2" cy="211.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="245.2" cy="185.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="341.6" cy="206.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.6" cy="211.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="414.3" cy="218.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.8" cy="193.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="368.4" cy="196.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="242.0" cy="196.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="469.4" cy="206.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="224.0" cy="187.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="402.8" cy="200.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.7" cy="218.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="280.6" cy="196.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="288.1" cy="203.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="284.2" cy="206.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="357.9" cy="199.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.2" cy="205.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="387.2" cy="239.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="230.5" cy="186.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="337.2" cy="195.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="270.6" cy="205.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.4" cy="211.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="199.0" cy="199.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="292.3" cy="218.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.7" cy="203.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="233.1" cy="205.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="383.5" cy="212.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.0" cy="216.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="381.4" cy="215.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="397.0" cy="196.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="280.3" cy="190.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.9" cy="199.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.7" cy="206.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.4" cy="216.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="386.3" cy="200.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="299.8" cy="188.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="272.6" cy="221.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.9" cy="192.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="268.3" cy="227.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="308.5" cy="209.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.5" cy="202.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="438.8" cy="224.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="279.8" cy="220.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="310.9" cy="203.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.9" cy="198.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="263.2" cy="209.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="318.0" cy="191.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.3" cy="214.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="392.4" cy="189.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="247.1" cy="202.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="413.3" cy="206.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.4" cy="199.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="340.4" cy="203.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="397.8" cy="188.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="390.1" cy="184.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="397.3" cy="202.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.5" cy="208.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.2" cy="218.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="338.3" cy="214.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="265.6" cy="204.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="400.1" cy="209.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="278.6" cy="205.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="249.4" cy="203.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="458.1" cy="205.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="304.2" cy="219.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="243.6" cy="214.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="452.0" cy="198.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="315.1" cy="196.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="386.3" cy="214.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="289.2" cy="191.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="304.3" cy="212.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="220.4" cy="205.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="190.5" cy="221.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="275.5" cy="195.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="321.8" cy="206.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="386.7" cy="196.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="482.9" cy="204.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="264.3" cy="203.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="390.3" cy="206.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="302.0" cy="192.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="315.7" cy="207.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="234.3" cy="204.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="236.7" cy="202.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="287.4" cy="196.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="263.2" cy="194.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="346.5" cy="186.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.9" cy="205.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="416.8" cy="195.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.5" cy="213.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="343.4" cy="200.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="398.1" cy="207.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="376.8" cy="188.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="331.1" cy="199.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.9" cy="210.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="325.7" cy="199.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="396.8" cy="204.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="371.9" cy="210.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="346.5" cy="209.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.4" cy="217.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.3" cy="176.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.9" cy="205.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="250.6" cy="192.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="397.8" cy="220.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="321.4" cy="217.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.8" cy="207.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="362.4" cy="208.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="334.9" cy="197.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="301.1" cy="215.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="405.8" cy="202.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="350.0" cy="190.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.5" cy="213.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.6" cy="197.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="212.6" cy="212.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="432.4" cy="205.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.5" cy="201.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="348.0" cy="187.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="458.6" cy="217.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="461.0" cy="208.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="345.1" cy="195.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="353.4" cy="219.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="394.0" cy="208.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="421.4" cy="218.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.9" cy="212.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.5" cy="198.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="409.6" cy="201.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.5" cy="179.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="387.8" cy="193.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.0" cy="193.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="255.8" cy="205.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="271.3" cy="207.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="167.4" cy="198.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="287.6" cy="228.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="426.6" cy="191.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="252.1" cy="210.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="391.9" cy="219.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="383.7" cy="212.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="332.8" cy="196.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.5" cy="192.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.2" cy="209.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="278.7" cy="199.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="309.1" cy="205.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="313.8" cy="216.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.3" cy="205.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="375.9" cy="207.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="265.4" cy="220.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="389.0" cy="196.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="262.9" cy="220.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.0" cy="203.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="338.7" cy="217.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.1" cy="214.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.8" cy="213.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="350.8" cy="199.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="280.0" cy="217.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="454.3" cy="205.5" r="8" fill="#FFFFFF" stroke="#2A5E9B" stroke-width="3"/><text x="466.35" y="197.53" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">P</text><circle cx="330.9" cy="329.0" r="8" fill="#FFFFFF" stroke="#9C0908" stroke-width="3"/><text x="342.88" y="321" font-size="14" fill="#9C0908" text-anchor="start" font-weight="700">Q</text><text x="760" y="90" font-size="13" fill="#111111" text-anchor="start" font-weight="400">разброс вдоль: √(1 + ρ) = 1,39</text><text x="760" y="110" font-size="13" fill="#111111" text-anchor="start" font-weight="400">поперёк: √(1 − ρ) = 0,25</text></g>
<g data-key="w" data-only="1"><rect x="44" y="29" width="572" height="352" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="66" y1="381" x2="66" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="154" y1="381" x2="154" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="242" y1="381" x2="242" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="418" y1="381" x2="418" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="506" y1="381" x2="506" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="594" y1="381" x2="594" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="381" x2="616" y2="381" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="293" x2="616" y2="293" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="117" x2="616" y2="117" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="29" x2="616" y2="29" stroke="#F1EEE6" stroke-width="1"/><line x1="44" y1="205" x2="616" y2="205" stroke="#D8D4C8" stroke-width="1"/><line x1="330" y1="381" x2="330" y2="29" stroke="#D8D4C8" stroke-width="1"/><text x="616" y="399" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">вдоль / 1,39</text><text x="44" y="21" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">поперёк / 0,25</text><text x="330" y="22" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">Шаг 3: делим каждую ось на её разброс</text><circle cx="294.0" cy="232.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="318.4" cy="217.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="408.0" cy="183.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="355.9" cy="220.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="269.4" cy="114.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.0" cy="200.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="278.0" cy="331.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="330.8" cy="229.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="269.1" cy="125.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="338.3" cy="212.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="334.7" cy="230.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="390.5" cy="260.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.4" cy="156.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="357.5" cy="171.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="266.8" cy="168.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="430.0" cy="211.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="253.9" cy="132.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="382.3" cy="184.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="303.9" cy="259.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="294.5" cy="169.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="299.9" cy="197.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="297.1" cy="208.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="350.0" cy="180.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.0" cy="207.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="371.1" cy="347.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="258.6" cy="128.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.2" cy="166.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="287.4" cy="207.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.0" cy="232.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="236.0" cy="182.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="302.9" cy="261.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.1" cy="198.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="260.5" cy="206.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="368.4" cy="233.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.6" cy="250.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="366.9" cy="247.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.1" cy="171.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="294.4" cy="144.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="296.2" cy="181.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="318.3" cy="210.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="354.0" cy="253.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.4" cy="186.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="308.3" cy="135.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="288.8" cy="273.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="301.2" cy="153.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="285.7" cy="297.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="314.6" cy="222.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="324.6" cy="192.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="408.1" cy="285.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="294.0" cy="270.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.3" cy="199.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="354.3" cy="176.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.1" cy="222.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="321.4" cy="149.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.3" cy="243.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="374.8" cy="142.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="270.5" cy="193.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="389.8" cy="212.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.6" cy="180.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="337.5" cy="198.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.7" cy="139.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="373.1" cy="121.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.3" cy="196.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="334.0" cy="218.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="318.0" cy="259.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="335.9" cy="245.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="283.8" cy="201.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="380.4" cy="225.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.1" cy="205.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="272.1" cy="199.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="421.9" cy="207.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.5" cy="266.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="268.0" cy="243.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="417.6" cy="178.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.3" cy="171.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.4" cy="242.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="300.7" cy="147.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="311.6" cy="236.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="251.3" cy="206.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="229.9" cy="270.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="290.8" cy="165.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="324.1" cy="209.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="370.7" cy="171.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="439.8" cy="200.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.9" cy="196.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="373.3" cy="211.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="309.9" cy="153.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="319.7" cy="215.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="261.3" cy="203.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="263.0" cy="193.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="299.4" cy="168.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="282.0" cy="160.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="341.9" cy="128.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="296.2" cy="206.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="392.3" cy="166.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="329.7" cy="237.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.6" cy="184.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.9" cy="213.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="363.6" cy="139.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="330.8" cy="182.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.6" cy="226.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="326.9" cy="182.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.0" cy="202.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="360.1" cy="228.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="341.8" cy="223.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="356.1" cy="255.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="324.5" cy="86.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="351.4" cy="206.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="273.0" cy="154.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="378.7" cy="269.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.8" cy="254.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="334.9" cy="216.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="353.3" cy="219.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="333.5" cy="173.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="309.3" cy="248.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="384.4" cy="195.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="344.3" cy="144.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="280.8" cy="239.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="354.1" cy="173.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="245.7" cy="234.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="403.5" cy="207.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="323.2" cy="191.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="342.9" cy="134.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="422.3" cy="256.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="424.1" cy="219.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="340.8" cy="164.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="346.8" cy="263.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="375.9" cy="217.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="395.6" cy="259.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="317.0" cy="236.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="339.0" cy="180.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="387.2" cy="188.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="359.0" cy="100.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="371.5" cy="156.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="364.4" cy="158.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="276.7" cy="205.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="287.9" cy="213.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="213.3" cy="179.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="299.6" cy="302.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="399.3" cy="149.3" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="274.1" cy="226.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="374.4" cy="264.1" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="368.6" cy="236.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="332.0" cy="170.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.8" cy="155.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="328.7" cy="225.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="293.2" cy="182.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="315.0" cy="208.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="318.4" cy="250.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="356.1" cy="206.9" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="362.9" cy="214.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="283.7" cy="267.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="372.4" cy="169.2" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="281.8" cy="269.0" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="322.1" cy="197.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="336.3" cy="256.8" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="320.7" cy="243.4" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="316.9" cy="237.7" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="344.9" cy="181.5" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="294.1" cy="257.6" r="3" fill="#A8A296" fill-opacity="0.7"/><circle cx="330" cy="205" r="89.3" fill="none" stroke="#C29E08" stroke-width="2.4"/><circle cx="419.3" cy="207.2" r="8" fill="#FFFFFF" stroke="#2A5E9B" stroke-width="3"/><text x="431.27" y="199.17" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">P</text><line x1="330.63" y1="319.4" x2="330.63" y2="366.6" stroke="#9C0908" stroke-width="3"/><polygon points="330.6,376.6 335.1,366.6 326.1,366.6" fill="#9C0908"/><text x="340.63" y="354.6" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">Q ушёл вниз: до него 11,55</text><text x="760" y="90" font-size="13" fill="#111111" text-anchor="start" font-weight="400">облако круглое</text><text x="760" y="110" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">P: 2,03</text><text x="760" y="130" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">Q: 11,55</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="raw" data-focus="raw">
      <div class="step-kicker">Шаг 1 · облако</div>
      <h4>Вытянутое облако</h4>
      <p>160 синтетических студентов: кто больше готовился, тот больше решил, корреляция 0,94. Облако вытянуто вдоль диагонали. Студент P (19 часов, 59 задач) лежит на продолжении облака, Q (19 часов, 9 задач) — далеко в стороне.</p>
    </div>
    <div class="step-panel" data-on="z" data-focus="z">
      <div class="step-kicker">Шаг 2 · стандартизация</div>
      <h4>После стандартизации P и Q неразличимы</h4>
      <p>Переводим оба признака в стандартные отклонения. По каждому признаку отдельно P и Q необычны одинаково: на 2 отклонения от среднего. Евклидово расстояние до центра у обоих <span class="math-inline" data-tex="2{,}83"></span>, пунктирный круг проходит через обоих.</p>
<p>Но облако по-прежнему вытянуто, и круг его форму не учитывает.</p>
    </div>
    <div class="step-panel" data-on="rot" data-focus="rot">
      <div class="step-kicker">Шаг 3 · поворот</div>
      <h4>Поворачиваем оси вдоль облака</h4>
      <p>Повернём систему координат на 45°, чтобы одна ось шла вдоль облака, а другая поперёк. P теперь лежит на оси «вдоль», Q — на оси «поперёк».</p>
<p>Вдоль облака студенты разбросаны широко, на <span class="math-inline" data-tex="\sqrt{1 + \rho} \approx 1{,}39"></span> отклонения, поперёк — очень узко, на <span class="math-inline" data-tex="\sqrt{1 - \rho} \approx 0{,}25"></span>. Шаг в 2,8 отклонения вдоль — обычное дело, поперёк — огромный.</p>
    </div>
    <div class="step-panel" data-on="w" data-focus="w">
      <div class="step-kicker">Шаг 4 · выпрямление</div>
      <h4>Облако круглое — меряем обычной линейкой</h4>
      <p>Разделим каждую ось на её разброс. Облако стало круглым, и все направления равноправны. P оказался на расстоянии <span class="math-inline" data-tex="2{,}83/1{,}39 = 2{,}03"></span>, внутри облака. Q улетел на <span class="math-inline" data-tex="2{,}83/0{,}25 \approx 11{,}55"></span>, далеко за его край.</p>
<p>Это и есть расстояние Махаланобиса: обычное евклидово расстояние после того, как облако данных сделали круглым. Формула <span class="math-inline" data-tex="\sqrt{(x - y)^\top \Sigma^{-1}(x - y)}"></span> делает все три шага разом.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Формула расстояния Махаланобиса использует ковариационную матрицу <span class="math-inline" data-tex="\Sigma"></span>:
</p>

<div class="math-display" data-tex="d_M(x, y) = \sqrt{(x - y)^\top \Sigma^{-1} (x - y)}"></div>

<p>
  Умножение на <span class="math-inline" data-tex="\Sigma^{-1}"></span> — это и есть стандартизация, поворот и сжатие из сцены, выполненные разом.
  Если <span class="math-inline" data-tex="\Sigma"></span> — единичная матрица, получается обычное евклидово расстояние, если диагональная — евклидово после
  стандартизации. У наших десяти студентов корреляция часов и пропусков всего <span class="math-inline" data-tex="-0{,}07"></span>, поэтому Махаланобис почти
  совпадает со стандартизацией. Для двух признаков с корреляцией <span class="math-inline" data-tex="\rho"></span> после стандартизации
</p>

<div class="math-display" data-tex="d_M^2 = \frac{z_1^2 - 2\rho z_1 z_2 + z_2^2}{1 - \rho^2}"></div>

<p>
  В интерактиве поставьте точку в любое место. Пунктирный круг — точки на том же евклидовом расстоянии от центра,
  жёлтый эллипс — на том же расстоянии Махаланобиса. Эллипс повторяет форму облака.
</p>


<div class="dt-live" id="mahaLive">
  <div class="dt-live-head"><strong>Интерактив: евклидово расстояние и расстояние Махаланобиса</strong>
    <p>160 синтетических студентов: часы подготовки и решённые задачи, корреляция 0,94. Оси в стандартных отклонениях от среднего. Щёлкните, чтобы поставить нового студента. Пунктирный круг — точки на том же евклидовом расстоянии от центра, жёлтый эллипс — на том же расстоянии Махаланобиса.</p></div>
  <div class="thr-fig"><svg id="mahaSvg" viewBox="0 0 620 400" role="img" aria-label="Облако студентов, круг и эллипс равных расстояний" style="touch-action: pan-y; cursor: crosshair; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-presets"><button type="button" data-pq="P">студент P: 19 ч, 59 задач</button><button type="button" data-pq="Q">студент Q: 19 ч, 9 задач</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span>евклидово (после стандартизации)</span><strong id="mahaE">—</strong></div>
      <div class="dt-metric is-main"><span>Махаланобиса</span><strong id="mahaM">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>студентов облака дальше от центра по Махаланобису</span><strong id="mahaShare">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('mahaSvg');
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
  var D = {"pts": [[8.39, 22.44], [10.3, 30.05], [17.65, 57.0], [13.64, 40.48], [4.43, 21.3], [10.98, 33.84], [8.51, 13.03], [11.59, 32.94], [4.57, 20.69], [11.97, 35.93], [11.94, 33.99], [17.3, 48.24], [12.27, 42.36], [13.04, 43.34], [5.03, 17.91], [20.01, 61.83], [3.34, 16.06], [15.41, 49.67], [9.68, 23.88], [7.48, 25.66], [8.37, 25.84], [8.31, 24.47], [12.52, 40.77], [10.56, 31.8], [16.93, 38.47], [3.68, 17.59], [10.99, 37.32], [7.43, 21.78], [14.1, 40.75], [2.53, 8.54], [9.63, 23.48], [11.84, 36.81], [5.06, 14.22], [14.94, 43.34], [11.71, 31.27], [15.03, 42.23], [14.84, 49.16], [7.08, 26.85], [7.81, 25.54], [10.19, 30.37], [13.99, 38.29], [14.4, 46.23], [8.16, 31.25], [8.57, 18.93], [7.81, 28.36], [8.66, 16.89], [10.05, 28.72], [10.47, 33.03], [19.23, 51.96], [8.97, 20.55], [9.85, 30.32], [12.83, 42.19], [7.19, 19.57], [9.53, 34.22], [11.05, 29.88], [14.1, 49.66], [5.74, 17.71], [16.49, 50.45], [9.59, 31.35], [11.68, 36.38], [14.39, 50.92], [13.64, 50.2], [15.24, 48.0], [11.69, 34.38], [10.92, 27.83], [12.27, 33.63], [7.02, 21.09], [15.86, 47.14], [7.9, 23.51], [5.96, 17.9], [19.23, 59.76], [10.45, 25.69], [6.28, 14.54], [18.41, 59.94], [9.68, 32.56], [15.25, 43.49], [7.68, 28.49], [10.0, 27.17], [4.25, 11.68], [3.36, 2.43], [7.09, 24.84], [10.69, 32.03], [14.19, 47.07], [20.7, 65.09], [6.87, 21.04], [15.04, 45.81], [8.58, 30.8], [10.39, 30.52], [5.08, 14.63], [5.08, 15.59], [7.89, 27.1], [6.23, 22.62], [10.99, 41.08], [8.19, 24.32], [16.0, 53.42], [11.61, 32.21], [11.66, 37.65], [15.55, 47.32], [13.07, 46.66], [10.85, 35.28], [10.64, 30.2], [10.52, 34.15], [15.31, 47.56], [14.13, 41.25], [12.46, 36.34], [14.2, 38.82], [8.82, 38.24], [13.04, 39.9], [5.35, 20.35], [16.39, 44.48], [11.36, 29.73], [11.73, 34.76], [13.4, 39.78], [10.96, 36.46], [9.98, 25.95], [15.76, 49.76], [11.46, 40.96], [7.34, 18.38], [12.76, 42.31], [4.18, 8.72], [17.62, 54.53], [10.32, 32.69], [11.18, 41.06], [20.03, 57.41], [19.61, 59.74], [11.46, 38.99], [13.5, 35.79], [15.36, 46.26], [17.73, 49.74], [10.48, 28.69], [11.54, 37.7], [15.9, 50.85], [12.08, 47.27], [14.02, 48.05], [13.44, 45.94], [6.46, 18.89], [7.56, 21.64], [0.5, 2.28], [9.96, 20.53], [16.36, 56.23], [6.56, 17.07], [15.94, 43.54], [15.0, 43.25], [10.78, 36.19], [10.97, 38.3], [11.33, 32.57], [7.56, 24.65], [9.87, 29.52], [10.81, 28.4], [13.45, 41.19], [14.17, 42.75], [8.03, 17.76], [14.3, 47.65], [7.89, 17.18], [10.32, 32.07], [12.48, 33.14], [10.91, 29.42], [10.49, 28.63], [12.08, 39.3], [8.79, 21.2]], "mu": [11.133085499995946, 33.92947123951385], "sd": [3.919989125352748, 12.598987662554304], "rho": 0.9404256522670836, "P": [19, 59], "Q": [19, 9]};
  var r = D.rho, CX = 310, CY = 195, S = 48, q = D.Q.slice(), drag = false;
  function z(p) { return [(p[0] - D.mu[0]) / D.sd[0], (p[1] - D.mu[1]) / D.sd[1]]; }
  function raw(zz) { return [D.mu[0] + zz[0] * D.sd[0], D.mu[1] + zz[1] * D.sd[1]]; }
  function sx(v) { return CX + v * S; }
  function sy(v) { return CY - v * S; }
  function dm(zz) { return Math.sqrt((zz[0] * zz[0] - 2 * r * zz[0] * zz[1] + zz[1] * zz[1]) / (1 - r * r)); }
  var DM = D.pts.map(function (p) { return dm(z(p)); });
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 400, fill: '#FFFFFF'}));
    for (var v = -3; v <= 3; v++) {
      svg.appendChild(el('line', {x1: sx(v), y1: sy(-3.6), x2: sx(v), y2: sy(3.6), stroke: v ? '#F1EEE6' : '#D8D4C8'}));
      svg.appendChild(el('line', {x1: sx(-5.6), y1: sy(v), x2: sx(5.6), y2: sy(v), stroke: v ? '#F1EEE6' : '#D8D4C8'}));
      svg.appendChild(el('text', {x: sx(v), y: sy(-3.6) + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, fmt(raw([v, 0])[0], 0)));
      svg.appendChild(el('text', {x: sx(-5.6) - 6, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, fmt(raw([0, v])[1], 0)));
    }
    svg.appendChild(el('text', {x: sx(5.6), y: sy(-3.6) + 32, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'часы подготовки'));
    svg.appendChild(el('text', {x: sx(-5.6), y: sy(3.6) - 6, 'font-size': 12, fill: '#5E5850'}, 'решённые задачи'));
    D.pts.forEach(function (p) { var zz = z(p); svg.appendChild(el('circle', {cx: sx(zz[0]), cy: sy(zz[1]), r: 3.2, fill: '#A8A296', 'fill-opacity': 0.7})); });
    var zq = z(q), de = Math.hypot(zq[0], zq[1]), m = dm(zq);
    var clip = el('clipPath', {id: 'mahaClip'}); clip.appendChild(el('rect', {x: sx(-5.6), y: sy(3.6), width: 11.2 * S, height: 7.2 * S})); svg.appendChild(clip);
    var gg = el('g', {'clip-path': 'url(#mahaClip)'}); svg.appendChild(gg);
    gg.appendChild(el('circle', {cx: CX, cy: CY, r: de * S, fill: 'none', stroke: '#3576C0', 'stroke-width': 2, 'stroke-dasharray': '6 4'}));
    gg.appendChild(el('ellipse', {cx: CX, cy: CY, rx: m * Math.sqrt(1 + r) * S, ry: m * Math.sqrt(1 - r) * S, transform: 'rotate(-45 ' + CX + ' ' + CY + ')',
                                   fill: '#C29E08', 'fill-opacity': 0.08, stroke: '#C29E08', 'stroke-width': 2.4}));
    svg.appendChild(el('circle', {cx: CX, cy: CY, r: 5, fill: '#111111'}));
    svg.appendChild(el('line', {x1: CX, y1: CY, x2: sx(zq[0]), y2: sy(zq[1]), stroke: '#2A5E9B', 'stroke-width': 1.6}));
    svg.appendChild(el('circle', {cx: sx(zq[0]), cy: sy(zq[1]), r: 8, fill: '#FFFFFF', stroke: '#3576C0', 'stroke-width': 3}));
    svg.appendChild(el('text', {x: sx(zq[0]) + 12, y: sy(zq[1]) - 8, 'font-size': 12, 'font-weight': 700, fill: '#2A5E9B'}, fmt(q[0], 1) + ' ч, ' + fmt(q[1], 0) + ' задач'));
    var far = DM.filter(function (d) { return d > m; }).length;
    document.getElementById('mahaE').textContent = fmt(de, 2);
    document.getElementById('mahaM').textContent = fmt(m, 2);
    document.getElementById('mahaShare').textContent = far + ' из ' + DM.length;
  }
  function fromEvent(ev) {
    var b = svg.getBoundingClientRect(), x = (ev.clientX - b.left) * 620 / b.width, y = (ev.clientY - b.top) * 400 / b.height;
    var zz = [Math.max(-5.5, Math.min(5.5, (x - CX) / S)), Math.max(-3.5, Math.min(3.5, (CY - y) / S))];
    var p = raw(zz); q = [Math.round(p[0] * 2) / 2, Math.round(p[1])]; update();
  }
  svg.addEventListener('pointerdown', function (ev) { drag = true; svg.setPointerCapture(ev.pointerId); fromEvent(ev); });
  svg.addEventListener('pointermove', function (ev) { if (drag) fromEvent(ev); });
  svg.addEventListener('pointerup', function () { drag = false; });
  svg.addEventListener('pointercancel', function () { drag = false; });
  document.querySelectorAll('#mahaLive [data-pq]').forEach(function (b) { b.addEventListener('click', function () { q = D[b.getAttribute('data-pq')].slice(); update(); }); });
  update();
})();
</script>


<p>
  Поэтому Махаланобис используют для поиска аномалий: точка с большим расстоянием до центра выбивается из формы
  данных, даже если по каждому признаку отдельно она обычная. Чтобы оценить <span class="math-inline" data-tex="\Sigma"></span>, нужно заметно больше объектов,
  чем признаков; на малой выборке матрица неустойчива.
</p>


## Часть 6. Косинусная мера

<p>
  До сих пор мерили длину вектора разности. Косинусная мера смотрит на другое: в одну ли сторону направлены сами
  векторы, независимо от их длины.
</p>


<div class="stage" id="stageCos" tabindex="0">
  <div class="stage-figure">
<svg id="cosSvg2" viewBox="0 0 960 420" role="img" aria-label="Скалярное произведение, проекция, угол и нормировка"><style>#cosSvg2 { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="420" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="grid"><rect x="70" y="52" width="308" height="308" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="360" x2="70" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="70" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="70" y1="360" x2="378" y2="360" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="364" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="114" y1="360" x2="114" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="114" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><line x1="70" y1="316" x2="378" y2="316" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="320" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="158" y1="360" x2="158" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="158" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="70" y1="272" x2="378" y2="272" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="276" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="202" y1="360" x2="202" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="202" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><line x1="70" y1="228" x2="378" y2="228" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="232" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="246" y1="360" x2="246" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="246" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="70" y1="184" x2="378" y2="184" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="188" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="290" y1="360" x2="290" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="290" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><line x1="70" y1="140" x2="378" y2="140" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="144" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">10</text><line x1="334" y1="360" x2="334" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="334" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="70" y1="96" x2="378" y2="96" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="100" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">12</text><line x1="378" y1="360" x2="378" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="378" y="376" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">14</text><line x1="70" y1="52" x2="378" y2="52" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="56" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">14</text><text x="378" y="392" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">часы на теорию</text><text x="70" y="44" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">часы на задачи</text></g>
<g data-key="eu" data-only="1"><line x1="114" y1="228" x2="202" y2="316" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="5 4"/><text x="166.8" y="258.8" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">5,66</text><line x1="114" y1="228" x2="158" y2="96" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="5 4"/><text x="142.6" y="153.2" font-size="13" fill="#9C0908" text-anchor="end" font-weight="700">6,32</text></g>
<g data-key="proj" data-only="1"><line x1="114" y1="228" x2="149.2" y2="333.6" stroke="#5E5850" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="70" y1="365" x2="149.2" y2="338.6" stroke="#3576C0" stroke-width="6"/><text x="155.2" y="357.6" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">проекция X на Z: 3,79</text></g>
<g data-key="arc" data-only="1"><path d="M117.4 344.2 A 50 50 0 0 0 85.8 312.6" fill="none" stroke="#C29E08" stroke-width="3"/><text x="128" y="326" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">53°</text></g>
<g data-key="vX"><line x1="70" y1="360" x2="110.52" y2="238.44" stroke="#3576C0" stroke-width="3.2"/><polygon points="114.0,228.0 105.8,236.9 115.2,240.0" fill="#3576C0"/><text x="122" y="220" font-size="14" fill="#3576C0" text-anchor="start" font-weight="700">X (2; 6)</text></g>
<g data-key="vZ"><line x1="70" y1="360" x2="191.56" y2="319.48" stroke="#8F7406" stroke-width="3.2"/><polygon points="202.0,316.0 190.0,314.8 193.1,324.2" fill="#8F7406"/><text x="210" y="322" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">Z (6; 2)</text></g>
<g data-key="vY" data-only="1"><line x1="70" y1="360" x2="154.52" y2="106.44" stroke="#5F9420" stroke-width="3.2"/><polygon points="158.0,96.0 149.8,104.9 159.2,108.0" fill="#5F9420"/><text x="166" y="100" font-size="14" fill="#5F9420" text-anchor="start" font-weight="700">Y (4; 12)</text></g>
<g data-key="unit" data-only="1"><circle cx="790" cy="220" r="120" fill="none" stroke="#C9C3B6" stroke-width="1.6"/><line x1="658" y1="220" x2="922" y2="220" stroke="#E5E1D6" stroke-width="1"/><line x1="790" y1="352" x2="790" y2="88" stroke="#E5E1D6" stroke-width="1"/><line x1="790" y1="220" x2="824.47" y2="116.59" stroke="#3576C0" stroke-width="3"/><polygon points="827.9,106.2 819.8,115.0 829.2,118.2" fill="#3576C0"/><line x1="790" y1="220" x2="893.41" y2="185.53" stroke="#8F7406" stroke-width="3"/><polygon points="903.8,182.1 891.8,180.8 895.0,190.2" fill="#8F7406"/><text x="835.95" y="100.16" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">X/‖X‖ = Y/‖Y‖</text><text x="911.84" y="186.05" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">Z/‖Z‖</text><line x1="827.95" y1="106.16" x2="903.84" y2="182.05" stroke="#C30B0A" stroke-width="2.6" stroke-dasharray="5 4"/><text x="876.4" y="137.6" font-size="13" fill="#9C0908" text-anchor="start" font-weight="700">хорда 0,894</text><text x="790" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">окружность радиуса 1</text></g>
<g data-key="f1" data-only="1"><rect x="620" y="40" width="320" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="625" y="42" width="310" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="X \cdot Z = 2 \cdot 6 + 6 \cdot 2 = 24"></div></foreignObject></g>
<g data-key="f2" data-only="1"><rect x="620" y="40" width="320" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="625" y="42" width="310" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="X \cdot Z = 3{,}79 \cdot \|Z\| = 3{,}79 \cdot 6{,}32 = 24"></div></foreignObject></g>
<g data-key="f3" data-only="1"><rect x="620" y="30" width="320" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="625" y="32" width="310" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\cos\theta = \dfrac{24}{6{,}32 \cdot 6{,}32} = 0{,}6"></div></foreignObject></g>
<g data-key="f4" data-only="1"><rect x="620" y="40" width="320" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="625" y="42" width="310" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\cos(X, Y) = 1, \quad \cos(X, Z) = 0{,}6"></div></foreignObject></g>
<g data-key="f5" data-only="1"><rect x="620" y="330" width="320" height="64" rx="8" fill="#FAFAF7" stroke="#E0DDD3" stroke-width="1"/><foreignObject x="625" y="332" width="310" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="\|\hat x - \hat z\| = \sqrt{2 - 2 \cdot 0{,}6} \approx 0{,}894"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="grid vX vZ f1" data-focus="vX vZ f1">
      <div class="step-kicker">Шаг 1 · векторы</div>
      <h4>Два профиля подготовки</h4>
      <p>X — 2 часа теории и 6 часов задач, Z — наоборот, 6 и 2. Скалярное произведение перемножает координаты и складывает: <span class="math-inline" data-tex="2 \cdot 6 + 6 \cdot 2 = 24"></span>.</p>
    </div>
    <div class="step-panel" data-on="grid vX vZ proj f2" data-focus="proj f2">
      <div class="step-kicker">Шаг 2 · проекция</div>
      <h4>Скалярное произведение через проекцию</h4>
      <p>Опустим перпендикуляр из конца X на направление Z. Синий отрезок — проекция X на Z: какая часть X идёт в сторону Z. Её длина <span class="math-inline" data-tex="24/\sqrt{40} \approx 3{,}79"></span>.</p>
<p>Скалярное произведение — длина проекции, умноженная на длину Z. Оно велико, когда векторы смотрят в одну сторону и оба длинные.</p>
    </div>
    <div class="step-panel" data-on="grid vX vZ arc f3" data-focus="arc f3">
      <div class="step-kicker">Шаг 3 · угол</div>
      <h4>Убираем длины — остаётся угол</h4>
      <p>Разделим скалярное произведение на обе длины. Длины сократятся, и останется косинус угла между стрелками: <span class="math-inline" data-tex="24/40 = 0{,}6"></span>, угол 53°. Косинус 1 — стрелки смотрят в одну сторону, 0 — под прямым углом.</p>
    </div>
    <div class="step-panel" data-on="grid vX vZ vY eu arc f4" data-focus="vY eu f4">
      <div class="step-kicker">Шаг 4 · длина не важна</div>
      <h4>Y смотрит туда же, куда X</h4>
      <p>Y = (4; 12): занимался вдвое дольше X в тех же пропорциях. Зелёная стрелка лежит на продолжении синей, угол 0, косинус 1.</p>
<p>Красный пунктир — евклидовы расстояния. По Евклиду X ближе к Z (5,66), чем к Y (6,32): Евклид видит, что Y занимался вдвое больше. Косинус этого не видит и считает X и Y одинаковыми по стилю.</p>
    </div>
    <div class="step-panel" data-on="grid vX vZ unit f5" data-focus="unit f5">
      <div class="step-kicker">Шаг 5 · нормировка</div>
      <h4>Все стрелки — на единичную окружность</h4>
      <p>Справа каждый вектор поделён на свою длину: все концы легли на окружность радиуса 1. X и Y попали в одну точку. Евклидово расстояние между концами — хорда — теперь зависит только от угла: <span class="math-inline" data-tex="\sqrt{2 - 2\cos\theta}"></span>.</p>
<p>Поэтому после нормировки евклидово расстояние и косинус ставят соседей в одном порядке. Так устроен поиск похожих текстов и эмбеддингов: векторы нормируют, а дальше пользуются обычной геометрией.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Формула собирает всё из сцены:
</p>

<div class="math-display" data-tex="\cos\theta = \frac{x \cdot y}{\|x\|\,\|y\|} = \frac{\sum_j x_j y_j}{\sqrt{\sum_j x_j^2}\,\sqrt{\sum_j y_j^2}}"></div>

<p>
  В интерактиве можно двигать концы стрелок, включать проекцию и единичную окружность. Последние две кнопки
  переключают на тексты: короткая заметка, где слово «экзамен» встречается 2 раза, а «оценка» 1 раз; длинная статья
  на ту же тему с частотами 6 и 3; текст про другое, где «экзамен» не встречается, а «оценка» встречается 1 раз.
</p>


<div class="dt-live" id="cosLive">
  <div class="dt-live-head"><strong>Интерактив: угол между векторами и расстояние между концами</strong>
    <p>Два студента описаны часами на теорию и на задачи. Перетащите конец любого вектора. Косинус меряет угол между стрелками, евклидово расстояние — красный пунктир между их концами.</p></div>
  <div class="thr-fig"><svg id="cosSvg" viewBox="0 0 620 360" role="img" aria-label="Два вектора, угол и расстояние" style="touch-action: pan-y; cursor: move; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-presets"><button type="button" data-pair="X,Y">X и Y: те же пропорции</button><button type="button" data-pair="X,Z">X и Z: та же сумма часов</button>
        <button type="button" data-pair="заметка,статья">заметка и статья на ту же тему</button><button type="button" data-pair="заметка,другой текст">заметка и текст про другое</button></div>
      <div class="rm-modes"><button type="button" id="cosUnit" aria-pressed="false">единичная окружность</button><button type="button" id="cosProj" aria-pressed="false">проекция</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric is-main"><span>косинус угла</span><strong id="cosC">—</strong></div>
      <div class="dt-metric"><span>угол</span><strong id="cosA">—</strong></div>
      <div class="dt-metric"><span>евклидово расстояние</span><strong id="cosE">—</strong></div>
      <div class="dt-metric"><span>скалярное произведение</span><strong id="cosD">—</strong></div>
    </div>
  </div>
  <div class="dt-formula" id="cosF"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('cosSvg');
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
  var P = {"X": [2, 6], "Y": [4, 12], "Z": [6, 2]};
  P['заметка'] = [2, 1]; P['статья'] = [6, 3]; P['другой текст'] = [0, 1];
  var DOCS = {'заметка': 1, 'статья': 1, 'другой текст': 1}, unitOn = false, projOn = false;
  var u = P.X.slice(), v = P.Y.slice(), nu = 'X', nv = 'Y', drag = null;
  var OX0 = 60, OY0 = 320, S = 21, XM = 26, YM = 14, ST = 2;
  function sx(a) { return OX0 + a * S; }
  function sy(b) { return OY0 - b * S; }
  function arrow(p, color, name) {
    svg.appendChild(el('line', {x1: sx(0), y1: sy(0), x2: sx(p[0]), y2: sy(p[1]), stroke: color, 'stroke-width': 3.4, 'marker-end': 'url(#cosArw' + name + ')'}));
    svg.appendChild(el('circle', {cx: sx(p[0]), cy: sy(p[1]), r: 9, fill: '#FFFFFF', stroke: color, 'stroke-width': 2.4}));
    svg.appendChild(el('text', {x: sx(p[0]) + 12, y: sy(p[1]) - 10, 'font-size': 13, 'font-weight': 700, fill: color}, name + ' (' + fmt(p[0], 1) + '; ' + fmt(p[1], 1) + ')'));
  }
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 360, fill: '#FFFFFF'}));
    var defs = el('defs', {});
    [['U', '#3576C0'], ['V', '#8F7406']].forEach(function (a) {
      var mk = el('marker', {id: 'cosArw' + a[0], viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto'});
      mk.appendChild(el('path', {d: 'M0 0 L10 5 L0 10 z', fill: a[1]})); defs.appendChild(mk);
    });
    svg.appendChild(defs);
    var docs = DOCS[nu] && DOCS[nv];
    S = docs ? 64 : 21; XM = docs ? 8 : 26; YM = docs ? 4 : 14; ST = docs ? 1 : 2;
    for (var i = 0; i <= XM; i += ST) {
      svg.appendChild(el('line', {x1: sx(i), y1: sy(0), x2: sx(i), y2: sy(YM), stroke: i ? '#F1EEE6' : '#5E5850'}));
      svg.appendChild(el('text', {x: sx(i), y: sy(0) + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(i)));
    }
    for (var j = 0; j <= YM; j += ST) {
      svg.appendChild(el('line', {x1: sx(0), y1: sy(j), x2: sx(XM), y2: sy(j), stroke: j ? '#F1EEE6' : '#5E5850'}));
      svg.appendChild(el('text', {x: sx(0) - 7, y: sy(j) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(j)));
    }
    svg.appendChild(el('text', {x: sx(XM), y: sy(0) + 32, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, docs ? 'сколько раз встречается слово «экзамен»' : 'часы на теорию'));
    svg.appendChild(el('text', {x: sx(0), y: sy(YM) - 8, 'font-size': 12, fill: '#5E5850'}, docs ? 'слово «оценка»' : 'часы на задачи'));
    var a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(v[1], v[0]), R = 46;
    var lo = Math.min(a1, a2), hi = Math.max(a1, a2);
    svg.appendChild(el('path', {d: 'M' + (sx(0) + R * Math.cos(lo)) + ' ' + (sy(0) - R * Math.sin(lo)) + ' A ' + R + ' ' + R + ' 0 0 0 ' + (sx(0) + R * Math.cos(hi)) + ' ' + (sy(0) - R * Math.sin(hi)),
                                fill: 'none', stroke: '#C29E08', 'stroke-width': 2.6}));
    svg.appendChild(el('line', {x1: sx(u[0]), y1: sy(u[1]), x2: sx(v[0]), y2: sy(v[1]), stroke: '#C30B0A', 'stroke-width': 2.2, 'stroke-dasharray': '5 4'}));
    var nu1 = Math.hypot(u[0], u[1]), nv1 = Math.hypot(v[0], v[1]), RR = docs ? 3 : 5;
    if (projOn && nv1) {
      var t = (u[0] * v[0] + u[1] * v[1]) / (nv1 * nv1), fx = t * v[0], fy = t * v[1];
      svg.appendChild(el('line', {x1: sx(u[0]), y1: sy(u[1]), x2: sx(fx), y2: sy(fy), stroke: '#5E5850', 'stroke-width': 1.6, 'stroke-dasharray': '4 3'}));
      svg.appendChild(el('line', {x1: sx(0), y1: sy(0) + 5, x2: sx(fx), y2: sy(fy) + 5, stroke: '#2A5E9B', 'stroke-width': 6, opacity: 0.6}));
      svg.appendChild(el('text', {x: sx(fx) + 6, y: sy(fy) + 22, 'font-size': 12, 'font-weight': 700, fill: '#2A5E9B'}, 'проекция: ' + fmt(t * nv1, 2)));
    }
    if (unitOn && nu1 && nv1) {
      svg.appendChild(el('path', {d: 'M' + sx(RR) + ' ' + sy(0) + ' A ' + RR * S + ' ' + RR * S + ' 0 0 0 ' + sx(0) + ' ' + sy(RR), fill: 'none', stroke: '#8A8478', 'stroke-width': 1.6, 'stroke-dasharray': '3 3'}));
      var ux2 = u[0] / nu1 * RR, uy2 = u[1] / nu1 * RR, vx2 = v[0] / nv1 * RR, vy2 = v[1] / nv1 * RR;
      svg.appendChild(el('line', {x1: sx(ux2), y1: sy(uy2), x2: sx(vx2), y2: sy(vy2), stroke: '#C29E08', 'stroke-width': 3}));
      [[ux2, uy2, '#3576C0'], [vx2, vy2, '#8F7406']].forEach(function (pt) { svg.appendChild(el('circle', {cx: sx(pt[0]), cy: sy(pt[1]), r: 5, fill: pt[2]})); });
      var cc = (u[0] * v[0] + u[1] * v[1]) / nu1 / nv1;
      svg.appendChild(el('text', {x: sx(RR) + 6, y: sy(0) - 6, 'font-size': 12, fill: '#5E5850'}, 'окружность «длины 1» (радиус ' + RR + ')'));
      svg.appendChild(el('text', {x: sx((ux2 + vx2) / 2) + 8, y: sy((uy2 + vy2) / 2) - 4, 'font-size': 12, 'font-weight': 700, fill: '#8F7406'}, 'хорда ' + fmt(Math.sqrt(Math.max(0, 2 - 2 * cc)), 3)));
    }
    arrow(u, '#3576C0', nu); arrow(v, '#8F7406', nv);
    var dot = u[0] * v[0] + u[1] * v[1], n1 = Math.hypot(u[0], u[1]), n2 = Math.hypot(v[0], v[1]);
    var c = n1 && n2 ? dot / n1 / n2 : 0, ang = Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
    document.getElementById('cosC').textContent = fmt(c, 3);
    document.getElementById('cosA').textContent = fmt(ang, 1) + '°';
    document.getElementById('cosE').textContent = fmt(Math.hypot(u[0] - v[0], u[1] - v[1]), 2);
    document.getElementById('cosD').textContent = fmt(dot, 1);
    var f = function (x) { return fmt(x, 1).replace(',', '{,}'); };
    tex(document.getElementById('cosF'), '\\cos\\theta = \\frac{u \\cdot v}{\\|u\\|\\,\\|v\\|} = \\frac{' + f(u[0]) + ' \\cdot ' + f(v[0]) + ' + ' + f(u[1]) + ' \\cdot ' + f(v[1]) + '}{' + fmt(n1, 2).replace(',', '{,}') + ' \\cdot ' + fmt(n2, 2).replace(',', '{,}') + '} = ' + fmt(c, 3).replace(',', '{,}'), 'cos ' + fmt(c, 3));
  }
  function pos(ev) { var b = svg.getBoundingClientRect(); return [((ev.clientX - b.left) * 620 / b.width - OX0) / S, (OY0 - (ev.clientY - b.top) * 360 / b.height) / S]; }
  svg.addEventListener('pointerdown', function (ev) {
    var p = pos(ev); drag = Math.hypot(p[0] - u[0], p[1] - u[1]) < Math.hypot(p[0] - v[0], p[1] - v[1]) ? 'u' : 'v';
    svg.setPointerCapture(ev.pointerId); move(ev);
  });
  function move(ev) {
    if (!drag) return;
    var p = pos(ev); p = [Math.max(0, Math.min(XM, Math.round(p[0] * 2) / 2)), Math.max(0, Math.min(YM, Math.round(p[1] * 2) / 2))];
    if (drag === 'u') u = p; else v = p; update();
  }
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', function () { drag = null; });
  svg.addEventListener('pointercancel', function () { drag = null; });
  document.querySelectorAll('#cosLive [data-pair]').forEach(function (b) { b.addEventListener('click', function () {
    var pr = b.getAttribute('data-pair').split(','); nu = pr[0]; nv = pr[1]; u = P[nu].slice(); v = P[nv].slice(); update(); }); });
  [['cosUnit', function (x) { unitOn = x; }], ['cosProj', function (x) { projOn = x; }]].forEach(function (t) {
    var b = document.getElementById(t[0]);
    b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); t[1](on); update(); });
  });
  update();
})();
</script>


<p>
  По Евклиду заметка ближе к тексту про другое (2,0), чем к статье на её тему (4,47): статья просто длиннее. По косинусу
  заметка и статья совпадают (<span class="math-inline" data-tex="\cos = 1"></span>), а с текстом про другое косинус 0,45. Поэтому тексты и эмбеддинги сравнивают
  косинусом или нормируют векторы и потом берут обычное расстояние: для единичных векторов
  <span class="math-inline" data-tex="\|u - v\|^2 = 2 - 2\cos\theta"></span>.
</p>

<p>
  Косинус подходит не везде. На плоскости часов и пропусков студент Б (<span class="math-inline" data-tex="15; 7"></span>) по углу ближе всего к студентам 6, 8 и 3.
  У студента 3 — 6 часов и 4 пропуска: соотношение похоже, но часов вдвое меньше. Двое из трёх соседей не сдали,
  ответ «не сдаст». Для часов и пропусков важна сама величина, а не пропорция, и косинус отбрасывает главное.
</p>

<p>
  Косинусное расстояние <span class="math-inline" data-tex="1 - \cos\theta"></span> не метрика: неравенство треугольника для него может нарушаться. Метрикой
  является сам угол <span class="math-inline" data-tex="\theta"></span>.
</p>


## Часть 7. Признаки «да или нет»: Хэмминг и Жаккар

<p>
  Когда объект описан признаками «есть или нет», вектор состоит из нулей и единиц. Разность таких векторов —
  это список позиций, где они не совпадают.
</p>


<div class="stage" id="stageBin" tabindex="0">
  <div class="stage-figure">
<svg id="binSvg" viewBox="0 0 960 360" role="img" aria-label="Посещаемость лекций двух пар студентов"><style>#binSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="360" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="pA"><text x="136" y="40" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">лекции</text><text x="168" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><text x="208" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><text x="248" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">3</text><text x="288" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><text x="328" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">5</text><text x="368" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><text x="408" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">7</text><text x="448" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><text x="488" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">9</text><text x="528" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><text x="568" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">11</text><text x="608" y="44" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><text x="136" y="78" font-size="14" fill="#111111" text-anchor="end" font-weight="700">студент 2</text><rect x="150" y="52" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="190" y="52" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="230" y="52" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="270" y="52" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="310" y="52" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="350" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="390" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="430" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="470" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="510" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="550" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="590" y="52" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><text x="136" y="120" font-size="14" fill="#111111" text-anchor="end" font-weight="700">студент 5</text><rect x="150" y="94" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="190" y="94" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="230" y="94" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="270" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="310" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="350" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="390" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="430" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="470" y="94" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="510" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="550" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="590" y="94" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/></g>
<g data-key="pB"><text x="136" y="220" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">лекции</text><text x="168" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><text x="208" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><text x="248" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">3</text><text x="288" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><text x="328" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">5</text><text x="368" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><text x="408" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">7</text><text x="448" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><text x="488" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">9</text><text x="528" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><text x="568" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">11</text><text x="608" y="224" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><text x="136" y="258" font-size="14" fill="#111111" text-anchor="end" font-weight="700">студент 1</text><rect x="150" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="190" y="232" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="230" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="270" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="310" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="350" y="232" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="390" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="430" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="470" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="510" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="550" y="232" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="590" y="232" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><text x="136" y="300" font-size="14" fill="#111111" text-anchor="end" font-weight="700">студент 9</text><rect x="150" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="190" y="274" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="230" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="270" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="310" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="350" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="390" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="430" y="274" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="470" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="510" y="274" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#C9C3B6" stroke-width="1.4"/><rect x="550" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/><rect x="590" y="274" width="36" height="36" rx="4" fill="#73B222" stroke="#73B222" stroke-width="1.4"/></g>
<g data-key="dA" data-only="1"><rect x="267" y="49" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/><rect x="307" y="49" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/><rect x="467" y="49" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/></g>
<g data-key="dB" data-only="1"><rect x="347" y="229" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/><rect x="427" y="229" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/><rect x="507" y="229" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/><rect x="547" y="229" width="42" height="82" rx="6" fill="none" stroke="#C30B0A" stroke-width="3"/></g>
<g data-key="nA" data-only="1"><rect x="347" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="387" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="427" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="507" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="547" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="587" y="49" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="nB" data-only="1"><rect x="187" y="229" width="42" height="82" rx="6" fill="none" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="bA" data-only="1"><rect x="147" y="49" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="187" y="49" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="227" y="49" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/></g>
<g data-key="bB" data-only="1"><rect x="147" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="227" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="267" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="307" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="387" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="467" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/><rect x="587" y="229" width="42" height="82" rx="6" fill="none" stroke="#3576C0" stroke-width="3"/></g>
<g data-key="hA" data-only="1"><text x="660" y="62" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">Хэмминг: 3 несовпадения</text><text x="660" y="84" font-size="15" fill="#111111" text-anchor="start" font-weight="400">совпадений 9 из 12 = 0,75</text></g>
<g data-key="hB" data-only="1"><text x="660" y="242" font-size="15" fill="#9C0908" text-anchor="start" font-weight="700">Хэмминг: 4 несовпадения</text><text x="660" y="264" font-size="15" fill="#111111" text-anchor="start" font-weight="400">совпадений 8 из 12 ≈ 0,67</text></g>
<g data-key="zA" data-only="1"><text x="660" y="62" font-size="15" fill="#8F7406" text-anchor="start" font-weight="700">оба не пришли: 6 лекций</text><text x="660" y="84" font-size="15" fill="#111111" text-anchor="start" font-weight="400">это половина совпадений</text></g>
<g data-key="zB" data-only="1"><text x="660" y="242" font-size="15" fill="#8F7406" text-anchor="start" font-weight="700">оба не пришли: 1 лекция</text></g>
<g data-key="jA" data-only="1"><text x="660" y="62" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">Жаккар: 3 / 6 = 0,5</text><text x="660" y="84" font-size="15" fill="#111111" text-anchor="start" font-weight="400">вместе были на 3 из 6</text></g>
<g data-key="jB" data-only="1"><text x="660" y="242" font-size="15" fill="#2A5E9B" text-anchor="start" font-weight="700">Жаккар: 7 / 11 ≈ 0,64</text><text x="660" y="264" font-size="15" fill="#111111" text-anchor="start" font-weight="400">вместе были на 7 из 11</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="pA pB" data-focus="pA pB">
      <div class="step-kicker">Шаг 1 · посещаемость</div>
      <h4>Признаки «да или нет»</h4>
      <p>Каждого студента опишем двенадцатью признаками: был ли он на лекции. Зелёная клетка — был. Число пропусков у каждого то же, что в таблице: у студентов 2 и 5 по 7 и 8 пропусков, у студентов 1 и 9 по 3.</p>
<p>Какая пара больше похожа: двое, которые почти не ходят, или двое, которые почти не пропускают?</p>
    </div>
    <div class="step-panel" data-on="pA pB dA dB hA hB" data-focus="dA dB hA hB">
      <div class="step-kicker">Шаг 2 · Хэмминг</div>
      <h4>Расстояние Хэмминга: сколько несовпадений</h4>
      <p>Расстояние Хэмминга — число позиций, где ответы разные (красные рамки). У первой пары 3, у второй 4. Доля совпадений (simple matching) — <span class="math-inline" data-tex="9/12 = 0{,}75"></span> против <span class="math-inline" data-tex="8/12 \approx 0{,}67"></span>.</p>
<p>По Хэммингу двое прогульщиков похожи сильнее, чем двое прилежных студентов.</p>
    </div>
    <div class="step-panel" data-on="pA pB nA nB zA zB" data-focus="nA nB zA zB">
      <div class="step-kicker">Шаг 3 · общие пропуски</div>
      <h4>Откуда у прогульщиков сходство</h4>
      <p>Жёлтые рамки — лекции, которые пропустили оба. У первой пары их 6: половина всех совпадений состоит из того, что оба не пришли. У второй пары такая лекция одна.</p>
<p>Общее отсутствие говорит о сходстве мало: на одной лекции двух студентов не было по разным причинам.</p>
    </div>
    <div class="step-panel" data-on="pA pB bA bB jA jB" data-focus="bA bB jA jB">
      <div class="step-kicker">Шаг 4 · Жаккар</div>
      <h4>Мера Жаккара: только то, что есть</h4>
      <p>Мера Жаккара сравнивает множества посещённых лекций: размер пересечения делится на размер объединения. Синие рамки — лекции, где были оба. Общие пропуски в формулу не входят.</p>
<div class="math-display" data-tex="J(A, B) = \frac{|A \cap B|}{|A \cup B|}"></div>
<p>У первой пары <span class="math-inline" data-tex="3/6 = 0{,}5"></span>, у второй <span class="math-inline" data-tex="7/11 \approx 0{,}64"></span>: теперь прилежные студенты похожи сильнее. Расстояние Жаккара — <span class="math-inline" data-tex="1 - J"></span>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="dt-live" id="attLive">
  <div class="dt-live-head"><strong>Интерактив: посещаемость, Хэмминг и Жаккар</strong>
    <p>Щёлкайте по клеткам, чтобы отметить, был ли студент на лекции. Круги показывают, на скольких лекциях был только первый, только второй и оба; число снаружи — лекции, которые оба пропустили.</p></div>
  <div class="thr-fig"><svg id="attSvg" viewBox="0 0 620 330" role="img" aria-label="Посещаемость двух студентов и круги Эйлера" style="cursor: pointer; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-presets"><button type="button" data-pr="2">студенты 2 и 5</button><button type="button" data-pr="1">студенты 1 и 9</button><button type="button" data-pr="z">почти не ходят</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span>Хэмминг: несовпадений</span><strong id="attH">—</strong></div>
      <div class="dt-metric"><span>доля совпадений</span><strong id="attS">—</strong></div>
      <div class="dt-metric is-main" style="grid-column: 1 / -1"><span>Жаккар: вместе / хотя бы один</span><strong id="attJ">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('attSvg');
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
  function set(list) { var r = []; for (var i = 1; i <= 12; i++) r.push(list.indexOf(i) >= 0); return r; }
  function inv(list) { var r = []; for (var i = 1; i <= 12; i++) if (list.indexOf(i) < 0) r.push(i); return r; }
  var PRE = {'2': [[1, 2, 3, 4, 5], [1, 2, 3, 9], 'студент 2', 'студент 5'], '1': [inv([2, 6, 11]), inv([2, 8, 10]), 'студент 1', 'студент 9'], 'z': [[1], [2], 'студент X', 'студент Y']};
  var A, B, na, nb;
  function load(k) { var p = PRE[k]; A = set(p[0]); B = set(p[1]); na = p[2]; nb = p[3]; }
  load('2');
  var C = 34, X0 = 110, Y0 = 40;
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    var both = 0, onlyA = 0, onlyB = 0, none = 0;
    for (var i = 0; i < 12; i++) {
      svg.appendChild(el('text', {x: X0 + i * C + C / 2 - 2, y: Y0 - 8, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(i + 1)));
      [[A, 0], [B, 1]].forEach(function (r) {
        var on = r[0][i];
        var c = el('rect', {x: X0 + i * C, y: Y0 + r[1] * (C + 2), width: C - 4, height: C - 4, rx: 4, fill: on ? '#73B222' : '#FFFFFF', stroke: on ? '#73B222' : '#C9C3B6', 'stroke-width': 1.4});
        c.setAttribute('data-c', r[1] + ',' + i); svg.appendChild(c);
      });
      var mis = A[i] !== B[i];
      svg.appendChild(el('rect', {x: X0 + i * C, y: Y0 + 2 * (C + 2) + 4, width: C - 4, height: 14, rx: 3, fill: mis ? '#C30B0A' : '#EFECE4'}));
      if (A[i] && B[i]) both++; else if (A[i]) onlyA++; else if (B[i]) onlyB++; else none++;
    }
    svg.appendChild(el('text', {x: X0 - 10, y: Y0 + C / 2 + 2, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 700, fill: '#111111'}, na));
    svg.appendChild(el('text', {x: X0 - 10, y: Y0 + C + 2 + C / 2 + 2, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 700, fill: '#111111'}, nb));
    svg.appendChild(el('text', {x: X0 - 10, y: Y0 + 2 * (C + 2) + 15, 'text-anchor': 'end', 'font-size': 12, fill: '#9C0908'}, 'разные'));
    var cy = 236, r = 62;
    svg.appendChild(el('rect', {x: 150, y: cy - 84, width: 330, height: 168, rx: 10, fill: '#FAFAF7', stroke: '#E0DDD3'}));
    svg.appendChild(el('circle', {cx: 268, cy: cy, r: r, fill: '#73B222', 'fill-opacity': 0.18, stroke: '#5F9420', 'stroke-width': 2}));
    svg.appendChild(el('circle', {cx: 362, cy: cy, r: r, fill: '#3576C0', 'fill-opacity': 0.18, stroke: '#2A5E9B', 'stroke-width': 2}));
    [[236, onlyA, '#5F9420'], [315, both, '#111111'], [394, onlyB, '#2A5E9B']].forEach(function (t) {
      svg.appendChild(el('text', {x: t[0], y: cy + 8, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: t[2]}, String(t[1])));
    });
    svg.appendChild(el('text', {x: 200, y: cy - 66, 'font-size': 12, fill: '#5F9420', 'font-weight': 700}, 'только ' + na));
    svg.appendChild(el('text', {x: 430, y: cy - 66, 'text-anchor': 'end', 'font-size': 12, fill: '#2A5E9B', 'font-weight': 700}, 'только ' + nb));
    svg.appendChild(el('text', {x: 315, y: cy + r + 14, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, 'оба'));
    svg.appendChild(el('text', {x: 470, y: cy + 72, 'text-anchor': 'end', 'font-size': 13, fill: '#8F7406', 'font-weight': 700}, 'оба пропустили: ' + none));
    var ham = onlyA + onlyB, uni = both + onlyA + onlyB;
    document.getElementById('attH').textContent = ham + ' из 12';
    document.getElementById('attS').textContent = (12 - ham) + '/12 = ' + fmt((12 - ham) / 12, 2);
    document.getElementById('attJ').textContent = uni ? both + '/' + uni + ' = ' + fmt(both / uni, 2) : '—';
  }
  svg.addEventListener('click', function (ev) {
    var t = ev.target.getAttribute && ev.target.getAttribute('data-c'); if (!t) return;
    var q = t.split(','), row = +q[0] ? B : A; row[+q[1]] = !row[+q[1]]; update();
  });
  document.querySelectorAll('#attLive [data-pr]').forEach(function (b) { b.addEventListener('click', function () { load(b.getAttribute('data-pr')); update(); }); });
  update();
})();
</script>


<p>
  В интерактиве можно менять посещаемость руками. Обратите внимание на число снаружи кругов: Хэмминг считает эти
  лекции совпадениями, Жаккар их не видит. Кнопка «почти не ходят» — крайний случай: два студента были на одной лекции
  каждый, и на разных. Хэмминг даёт им сходство 10/12, Жаккар — 0.
</p>



<p>
  Какую меру брать, зависит от смысла нулей. Если «нет» так же информативно, как «да» (коды одной длины, ответы
  «верно/неверно» на одни и те же вопросы), подходит Хэмминг. Если «нет» означает просто отсутствие (лекции, товары
  в корзине, слова в тексте), общих нулей всегда много и они только мешают: две корзины из тысячи возможных товаров
  совпадают почти во всех позициях, ведь обе не содержат почти ничего. Тогда берут Жаккара.
</p>


## Часть 8. Строки: расстояние Левенштейна

<p>
  Для строк естественная мера — сколько правок нужно, чтобы превратить одну в другую. Правка — вставка, удаление или
  замена одной буквы. «Экзамен» и «экзамены» — одна вставка, расстояние 1.
</p>

<p>
  Считают таблицей. Клетка <span class="math-inline" data-tex="(i, j)"></span> хранит расстояние между первыми <span class="math-inline" data-tex="i"></span> буквами одного слова и первыми <span class="math-inline" data-tex="j"></span> буквами
  другого, и каждая следующая клетка получается из трёх соседних:
</p>

<div class="math-display" data-tex="D_{i,j} = \min\big(D_{i-1,j} + 1,\; D_{i,j-1} + 1,\; D_{i-1,j-1} + [s_i \ne t_j]\big)"></div>


<div class="dt-live" id="levLive">
  <div class="dt-live-head"><strong>Интерактив: таблица Левенштейна по шагам</strong>
    <p>Впишите два слова и заполняйте таблицу по одной клетке. Для текущей клетки подсвечены три соседние, из которых берётся минимум.</p></div>
  <div class="dt-controls">
    <div class="lev-in"><input id="levS" maxlength="10" value="кошка" aria-label="первое слово"><input id="levT" maxlength="10" value="окошко" aria-label="второе слово"></div>
    <div class="dt-presets"><button type="button" data-step="1">следующая клетка</button><button type="button" data-step="all">заполнить всё</button><button type="button" data-step="0">сначала</button>
      <button type="button" data-w="кошка,окошко">кошка → окошко</button><button type="button" data-w="экзмен,экзамен">экзмен → экзамен</button><button type="button" data-w="пропуск,прорыв">пропуск → прорыв</button></div>
  </div>
  <div class="lev-wrap"><table class="lev" id="levTab"></table></div>
  <div class="lev-note" id="levNote"></div>
</div>
<script>
(function () {
  var tab = document.getElementById('levTab');
  if (!tab) return;
  var S = document.getElementById('levS'), T = document.getElementById('levT'), n = 0, D, s, t;
  function build() {
    s = Array.from(S.value.trim()); t = Array.from(T.value.trim());
    D = []; for (var i = 0; i <= s.length; i++) { D.push([]); for (var j = 0; j <= t.length; j++) D[i].push(i === 0 ? j : (j === 0 ? i : 0)); }
    for (i = 1; i <= s.length; i++) for (j = 1; j <= t.length; j++)
      D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1));
  }
  function total() { return s.length * t.length; }
  function path() {
    var i = s.length, j = t.length, cells = [[i, j]], ops = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1)) {
        if (s[i - 1] !== t[j - 1]) ops.push('заменить «' + s[i - 1] + '» на «' + t[j - 1] + '»'); i--; j--;
      } else if (j > 0 && D[i][j] === D[i][j - 1] + 1) { ops.push('вставить «' + t[j - 1] + '»'); j--; }
      else { ops.push('удалить «' + s[i - 1] + '»'); i--; }
      cells.push([i, j]);
    }
    return [cells, ops.reverse()];
  }
  function render() {
    var cur = n > 0 && n <= total() ? [Math.floor((n - 1) / t.length) + 1, (n - 1) % t.length + 1] : null;
    var done = n >= total(), pth = done ? path() : [[], []];
    var on = {}; pth[0].forEach(function (c) { on[c[0] + ',' + c[1]] = 1; });
    var h = '<tr><th></th><th>∅</th>' + t.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
    for (var i = 0; i <= s.length; i++) {
      h += '<tr><th class="r">' + (i ? s[i - 1] : '∅') + '</th>';
      for (var j = 0; j <= t.length; j++) {
        var k = i === 0 || j === 0 ? 0 : (i - 1) * t.length + j, filled = k <= n, cls = filled ? '' : 'empty';
        if (cur && i === cur[0] && j === cur[1]) cls = 'cur';
        else if (cur && ((i === cur[0] - 1 && j === cur[1]) || (i === cur[0] && j === cur[1] - 1) || (i === cur[0] - 1 && j === cur[1] - 1))) cls = 'cand';
        if (done && on[i + ',' + j]) cls = 'path';
        h += '<td class="' + cls + '">' + D[i][j] + '</td>';
      }
      h += '</tr>';
    }
    tab.innerHTML = h;
    var note = document.getElementById('levNote');
    if (done) note.innerHTML = '<b>Расстояние ' + D[s.length][t.length] + '.</b> Правки по жёлтому пути: ' + (pth[1].length ? pth[1].join(', ') : 'не нужны') + '.';
    else if (cur) {
      var i0 = cur[0], j0 = cur[1], same = s[i0 - 1] === t[j0 - 1];
      note.innerHTML = 'Клетка «' + s[i0 - 1] + '» × «' + t[j0 - 1] + '»: сверху ' + D[i0 - 1][j0] + ' + 1 (удалить), слева ' + D[i0][j0 - 1] + ' + 1 (вставить), по диагонали ' + D[i0 - 1][j0 - 1] + ' + ' + (same ? '0 (буквы совпали)' : '1 (заменить)') + ' → <b>' + D[i0][j0] + '</b>';
    } else note.textContent = 'Первая строка и первый столбец — расстояния от пустой строки: столько вставок или удалений.';
  }
  function reset() { build(); n = 0; render(); }
  document.querySelectorAll('#levLive [data-step]').forEach(function (b) { b.addEventListener('click', function () {
    var v = b.getAttribute('data-step'); if (v === '0') n = 0; else if (v === 'all') n = total(); else n = Math.min(total(), n + 1); render(); }); });
  document.querySelectorAll('#levLive [data-w]').forEach(function (b) { b.addEventListener('click', function () { var w = b.getAttribute('data-w').split(','); S.value = w[0]; T.value = w[1]; reset(); }); });
  [S, T].forEach(function (inp) { inp.addEventListener('input', reset); });
  reset();
})();
</script>


<p>
  Сверху — удалить букву из первого слова, слева — вставить букву второго, по диагонали — заменить, бесплатно, если
  буквы совпали. Таблица размером <span class="math-inline" data-tex="m \times n"></span>, поэтому подсчёт занимает <span class="math-inline" data-tex="m \cdot n"></span> шагов. Левенштейн исправляет
  опечатки, ищет нечётко («экзмен» находит «экзамен») и сравнивает последовательности ДНК. Хэмминг — его частный случай
  для строк одной длины, где разрешены только замены.
</p>


## Часть 9. Одна точка, все меры сразу


<div class="dt-live" id="allLive">
  <div class="dt-live-head"><strong>Интерактив: одна точка, все меры сразу</strong>
    <p>Перетащите нового студента. Таблица показывает трёх ближайших соседей и ответ kNN по каждой мере; красным — ответ, который расходится с евклидовым. Щёлкните по строке, чтобы нарисовать её соседей.</p></div>
  <div class="thr-fig"><svg id="allSvg" viewBox="0 0 620 330" role="img" aria-label="Студенты и соседи нового студента" style="touch-action: pan-y; cursor: crosshair; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="dt-controls" style="margin-top: 10px">
    <div class="dt-control" style="max-width: 320px"><label for="allK"><span>число соседей k</span><output id="allKv">3</output></label>
      <input id="allK" type="range" min="1" max="9" step="2" value="3"></div>
    <div class="dt-presets"><button type="button" data-q="11,1">студент А</button><button type="button" data-q="15,7">студент Б</button><button type="button" data-q="6,2">6 ч, 2 пропуска</button></div>
  </div>
  <div class="lev-wrap"><table class="allm" id="allTab"></table></div>
</div>
<script>
(function () {
  var svg = document.getElementById('allSvg');
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
  var OX = 50, OY = 290, U = 25;
  function px(h) { return OX + h * U; }
  function py(a) { return OY - a * U; }
  function plane(svg) {
    svg.appendChild(el('rect', {x: px(0), y: py(10), width: 22 * U, height: 10 * U, fill: 'none', stroke: '#D8D4C8', 'stroke-width': 1.2}));
    for (var h = 0; h <= 22; h += 2) svg.appendChild(el('text', {x: px(h), y: py(0) + 17, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(h)));
    for (var a = 0; a <= 10; a += 2) svg.appendChild(el('text', {x: px(0) - 7, y: py(a) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(a)));
    svg.appendChild(el('text', {x: px(22), y: py(0) + 34, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'часы подготовки'));
    svg.appendChild(el('text', {x: px(0), y: py(10) - 8, 'font-size': 12, fill: '#5E5850'}, 'пропуски'));
  }
  var D = {"X": [[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]], "y": [0, 0, 0, 1, 0, 0, 1, 1, 1, 1]};
  var q = [15, 7], k = 3, sel = 'euclid', drag = false;
  var C = [[33, -0.9], [-0.9, 4.41]], det = C[0][0] * C[1][1] - C[0][1] * C[1][0];
  var IV = [[C[1][1] / det, -C[0][1] / det], [-C[1][0] / det, C[0][0] / det]];
  var M = [
    ['manh', 'манхэттенское', function (a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }],
    ['euclid', 'евклидово', function (a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }],
    ['cheb', 'Чебышёва', function (a, b) { return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])); }],
    ['std', 'после стандартизации', function (a, b) { return Math.hypot((a[0] - b[0]) / 5.7446, (a[1] - b[1]) / 2.1); }],
    ['maha', 'Махаланобиса', function (a, b) { var x = a[0] - b[0], y = a[1] - b[1]; return Math.sqrt(x * (IV[0][0] * x + IV[0][1] * y) + y * (IV[1][0] * x + IV[1][1] * y)); }],
    ['cos', 'косинусное', function (a, b) { var n = Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]); return n ? 1 - (a[0] * b[0] + a[1] * b[1]) / n : 1; }]
  ];
  function neigh(f) {
    var o = D.X.map(function (x, i) { return [Math.round(f(x, q) * 1e9) / 1e9, i]; });
    o.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return o.slice(0, k);
  }
  function update() {
    var res = M.map(function (m) { var nb = neigh(m[2]), v = 0; nb.forEach(function (n) { v += D.y[n[1]]; }); return [m, nb, 2 * v > k]; });
    var base = res[1][2];
    var h = '<tr><th>мера</th><th>соседи (расстояние)</th><th>ответ</th></tr>';
    res.forEach(function (r) {
      h += '<tr data-m="' + r[0][0] + '" class="' + (r[0][0] === sel ? 'sel' : '') + '"><td>' + r[0][1] + '</td><td>' +
        r[1].map(function (n) { return (n[1] + 1) + ' (' + fmt(n[0], r[0][0] === 'cos' ? 4 : 2) + ')'; }).join(', ') +
        '</td><td class="' + (r[2] !== base ? 'diff' : '') + '">' + (r[2] ? 'сдаст' : 'не сдаст') + '</td></tr>';
    });
    var tb = document.getElementById('allTab'); tb.innerHTML = h;
    tb.querySelectorAll('tr[data-m]').forEach(function (tr) { tr.addEventListener('click', function () { sel = tr.getAttribute('data-m'); update(); }); });
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    plane(svg);
    var cur = res.filter(function (r) { return r[0][0] === sel; })[0];
    if (sel === 'cos') svg.appendChild(el('line', {x1: px(0), y1: py(0), x2: px(q[0] * 1.4), y2: py(q[1] * 1.4), stroke: '#C29E08', 'stroke-width': 1.6, 'stroke-dasharray': '6 4'}));
    cur[1].forEach(function (n) { var x = D.X[n[1]]; svg.appendChild(el('line', {x1: px(q[0]), y1: py(q[1]), x2: px(x[0]), y2: py(x[1]), stroke: '#2A5E9B', 'stroke-width': 2})); });
    D.X.forEach(function (x, i) {
      if (cur[1].some(function (n) { return n[1] === i; })) svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 15, fill: 'none', stroke: '#2A5E9B', 'stroke-width': 2.4}));
      svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 10.5, fill: D.y[i] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: px(x[0]), y: py(x[1]) + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    svg.appendChild(el('circle', {cx: px(q[0]), cy: py(q[1]), r: 9, fill: '#FFFFFF', stroke: '#3576C0', 'stroke-width': 3}));
    document.getElementById('allKv').textContent = k;
  }
  function fromEvent(ev) {
    var b = svg.getBoundingClientRect(), x = (ev.clientX - b.left) * 620 / b.width, y = (ev.clientY - b.top) * 330 / b.height;
    q = [Math.max(0.5, Math.min(22, Math.round((x - OX) / U * 2) / 2)), Math.max(0, Math.min(10, Math.round((OY - y) / U * 2) / 2))]; update();
  }
  svg.addEventListener('pointerdown', function (ev) { drag = true; svg.setPointerCapture(ev.pointerId); fromEvent(ev); });
  svg.addEventListener('pointermove', function (ev) { if (drag) fromEvent(ev); });
  svg.addEventListener('pointerup', function () { drag = false; }); svg.addEventListener('pointercancel', function () { drag = false; });
  document.getElementById('allK').addEventListener('input', function () { k = +this.value; update(); });
  document.querySelectorAll('#allLive [data-q]').forEach(function (b) { b.addEventListener('click', function () { q = b.getAttribute('data-q').split(',').map(Number); update(); }); });
  update();
})();
</script>


<p>
  У студента А все шесть мер отвечают «сдаст»: он похож на студентов 4 и 7 при любом способе сравнения. Студент Б —
  спорный случай: евклидова мера и мера Чебышёва говорят «сдаст», а манхэттенская, стандартизация, Махаланобис и косинус —
  «не сдаст». После стандартизации пропуски весят больше, и ближе оказывается студент 5 с 8 пропусками. У студента
  с 6 часами и 2 пропусками только косинус говорит «сдаст»: по углу он похож на студентов 8, 6 и 10, у которых часов
  втрое больше.
</p>

<p>
  Мера — часть модели, как k в kNN или глубина дерева. Если по смыслу данных неясно, какая лучше, её подбирают
  кросс-валидацией, перебирая <code>metric</code> в <code>GridSearchCV</code>.
</p>


## Часть 10. Как выбрать меру


<div class="dt-table"><table class="shape-table">
  <tr><th>Данные</th><th>Мера</th><th>Что она делает с вектором разности</th></tr>
  <tr><td>числа в одних единицах, признаков немного</td><td>евклидова</td><td>длина по линейке</td></tr>
  <tr><td>числа, бывают большие расхождения по одному признаку</td><td>манхэттенская</td><td>сумма разниц без квадратов</td></tr>
  <tr><td>важна худшая разница по любому признаку</td><td>Чебышёва</td><td>берёт наибольшую разницу</td></tr>
  <tr><td>числа в разных единицах</td><td>евклидова после стандартизации</td><td>сначала переводит разницы в стандартные отклонения</td></tr>
  <tr><td>коррелированные признаки, поиск аномалий</td><td>Махаланобиса</td><td>сначала делает облако данных круглым</td></tr>
  <tr><td>тексты, эмбеддинги, профили, где важна пропорция</td><td>косинусная</td><td>сравнивает направления, длину отбрасывает</td></tr>
  <tr><td>признаки «да или нет», общие нули ничего не значат</td><td>Жаккара</td><td>смотрит только на то, что есть хотя бы у одного</td></tr>
  <tr><td>двоичные коды одной длины</td><td>Хэмминга</td><td>считает несовпадающие позиции</td></tr>
  <tr><td>строки с опечатками</td><td>Левенштейна</td><td>считает правки</td></tr>
</table></div>

## Часть 11. Код

### Меры в scipy

<p>
  <code>scipy.spatial.distance.hamming</code> возвращает долю несовпадений, а не их число, поэтому результат умножается на 12.
</p>


```python
import numpy as np
from scipy.spatial import distance

a = np.array([11, 1])            # студент А: часы, пропуски
s4 = np.array([8, 1])            # студент 4
s7 = np.array([14, 2])           # студент 7

print('евклидово', distance.euclidean(a, s7).round(3))
print('манхэттенское', distance.cityblock(a, s7))
print('Чебышёва', distance.chebyshev(a, s7))
print('Минковского p=4', distance.minkowski(a, s7, p=4).round(3))

x, y, z = np.array([2, 6]), np.array([4, 12]), np.array([6, 2])      # часы на теорию и на задачи
print('косинусное расстояние X-Y', distance.cosine(x, y).round(6), ' X-Z', distance.cosine(x, z).round(3))

lectures = np.arange(1, 13)
s2 = np.isin(lectures, [1, 2, 3, 4, 5])          # на каких лекциях был студент 2
s5 = np.isin(lectures, [1, 2, 3, 9])
print('Хэмминг (доля несовпадений)', distance.hamming(s2, s5).round(3), '× 12 =', round(distance.hamming(s2, s5) * 12))
print('расстояние Жаккара', distance.jaccard(s2, s5).round(3))

X = np.array([[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]])
VI = np.linalg.inv(np.cov(X.T, bias=True))
print('Махаланобис А-4', distance.mahalanobis(a, s4, VI).round(3), ' А-7', distance.mahalanobis(a, s7, VI).round(3))
```

```text
евклидово 3.162
манхэттенское 4
Чебышёва 3
Минковского p=4 3.009
косинусное расстояние X-Y 0.0  X-Z 0.4
Хэмминг (доля несовпадений) 0.25 × 12 = 3
расстояние Жаккара 0.5
Махаланобис А-4 0.524  А-7 0.735
```



### Мера в kNN

<p>
  В sklearn мера задаётся параметром <code>metric</code>. Для студента Б при <span class="math-inline" data-tex="k = 3"></span> косинус меняет ответ на «не сдаст».
  По Манхэттену третье место делят студенты 5 и 7; с настройками по умолчанию sklearn берёт студента 5, но при равных
  расстояниях выбор зависит от алгоритма поиска и не гарантирован.
</p>


```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

X = np.array([[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]])
y = np.array([0, 0, 0, 1, 0, 0, 1, 1, 1, 1])
b = np.array([[15, 7]])                                   # студент Б

for metric in ('euclidean', 'manhattan', 'chebyshev', 'cosine'):
    knn = KNeighborsClassifier(n_neighbors=3, metric=metric).fit(X, y)       # algorithm='auto'
    print(f'{metric:10s} соседи {knn.kneighbors(b)[1][0] + 1}  ответ {knn.predict(b)[0]}')
```

```text
euclidean  соседи [8 6 9]  ответ 1
manhattan  соседи [8 6 5]  ответ 0
chebyshev  соседи [8 6 9]  ответ 1
cosine     соседи [6 8 3]  ответ 0
```



### Левенштейн с нуля

<p>
  Хранить всю таблицу не обязательно: каждая строка зависит только от предыдущей.
</p>


```python
def levenshtein(s, t):
    """Наименьшее число вставок, удалений и замен, которое превращает s в t."""
    prev = list(range(len(t) + 1))                  # строка таблицы для пустого префикса s
    for i, a in enumerate(s, start=1):
        cur = [i]
        for j, b in enumerate(t, start=1):
            cur.append(min(prev[j] + 1,              # удалить букву из s
                           cur[j - 1] + 1,           # вставить букву из t
                           prev[j - 1] + (a != b)))  # заменить (или совпало)
        prev = cur
    return prev[-1]


for s, t in (('кошка', 'окошко'), ('экзамен', 'экзамены'), ('пропуск', 'прорыв')):
    print(s, t, levenshtein(s, t))
```

```text
кошка окошко 2
экзамен экзамены 1
пропуск прорыв 4
```


## Часть 12. Что получилось

### Что важно уметь восстановить по памяти

<ul>
  <li>Объект — вектор; мера близости сворачивает вектор разности в число, и способ свёртки решает, кто ближе.</li>
  <li>Минковский: <span class="math-inline" data-tex="\big(\sum |\Delta_j|^p\big)^{1/p}"></span>; <span class="math-inline" data-tex="p = 1"></span> — лесенка по клеткам, <span class="math-inline" data-tex="p = 2"></span> — линейка,
    <span class="math-inline" data-tex="p = \infty"></span> — наибольшая разница. Шары: ромб, круг, квадрат.</li>
  <li>Метрика: <span class="math-inline" data-tex="d \ge 0"></span>, ноль только у совпадающих, симметрия, неравенство треугольника. Квадрат евклидова
    расстояния, <span class="math-inline" data-tex="p &lt; 1"></span> и косинусное расстояние метриками не являются.</li>
  <li>Без стандартизации ответ зависит от единиц измерения.</li>
  <li>Махаланобис: евклидово расстояние после того, как облако данных сделали круглым: <span class="math-inline" data-tex="\sqrt{(x - y)^\top \Sigma^{-1}(x - y)}"></span>.</li>
  <li>Косинус: скалярное произведение, делённое на длины; сравнивает направления. После нормировки <span class="math-inline" data-tex="\|u - v\|^2 = 2 - 2\cos\theta"></span>.</li>
  <li>Хэмминг считает все несовпадения, Жаккар <span class="math-inline" data-tex="|A \cap B| / |A \cup B|"></span> не видит общих нулей.</li>
  <li>Левенштейн: наименьшее число вставок, удалений и замен, таблица <span class="math-inline" data-tex="m \times n"></span>.</li>
</ul>

<p class="tiny">
  Источники: P. C. Mahalanobis, «On the generalised distance in statistics», 1936; P. Jaccard, «Étude comparative de la
  distribution florale dans une portion des Alpes et du Jura», 1901; R. Hamming, «Error detecting and error correcting
  codes», 1950; В. И. Левенштейн, «Двоичные коды с исправлением выпадений, вставок и замещений символов», 1965;
  C. Aggarwal, A. Hinneburg, D. Keim, «On the Surprising Behavior of Distance Metrics in High Dimensional Space», 2001;
  документация SciPy, модуль <code>scipy.spatial.distance</code>.
</p>

