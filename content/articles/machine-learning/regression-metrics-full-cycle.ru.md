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
  @media (max-width: 820px) { .prose .cm-fig svg { min-width: 560px; } }
  .prose .dt-table, .prose .cm-fig, .prose .dt-formula, .prose .math-display, .prose pre { position: relative; }
  .prose .dt-table tr.hl td { background: #EEF4FB; }
  .prose .stage-figure .katex svg { height: inherit; }
  .prose .rm-modes { display: flex; flex-wrap: wrap; gap: 6px; }
  .prose .rm-modes button { flex: 1 1 auto; }
</style>

<p class="lead">
  Модель предсказывает число, например баллы за экзамен. Насколько хорошо? Разберём на тех же десяти студентах,
  какие метрики считают для регрессии, что каждая измеряет и какой прогноз она считает лучшим.
</p>

<p>
  Это продолжение <a href="article.html?slug=classification-metrics-full-cycle">статьи о метриках классификации</a>.
  Там ответ модели был классом, и ошибку можно было только посчитать: верно или нет. Здесь ответ — число,
  и важно, на сколько модель промахнулась. Баллы и дерево взяты из
  <a href="article.html?slug=regression-tree-full-cycle">статьи про дерево регрессии</a>.
</p>

<p>
  Модель для разбора — дерево регрессии глубины 2, то самое, что осталось после обрезки. Как и в прошлой статье,
  ответы честные: каждого студента предсказывает дерево, обученное на остальных девяти (leave-one-out).
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Часы</th><th>Пропуски</th><th>Баллы <span class="math-inline" data-tex="y"></span></th><th>Прогноз дерева <span class="math-inline" data-tex="\hat y"></span></th><th>Остаток <span class="math-inline" data-tex="e = y - \hat y"></span></th></tr>
  <tr><td>1</td><td>2.0</td><td>3.0</td><td>30.0</td><td>48,7</td><td>−18,7</td></tr>
  <tr><td>2</td><td>4.0</td><td>7.0</td><td>22.0</td><td>38,2</td><td>−16,2</td></tr>
  <tr><td>3</td><td>6.0</td><td>4.0</td><td>41.0</td><td>26,0</td><td>+15,0</td></tr>
  <tr><td>4</td><td>8.0</td><td>1.0</td><td>58.0</td><td>41,0</td><td>+17,0</td></tr>
  <tr><td>5</td><td>10.0</td><td>8.0</td><td>35.0</td><td>48,7</td><td>−13,7</td></tr>
  <tr><td>6</td><td>12.0</td><td>5.0</td><td>47.0</td><td>32,0</td><td>+15,0</td></tr>
  <tr><td>7</td><td>14.0</td><td>2.0</td><td>72.0</td><td>45,2</td><td>+26,8</td></tr>
  <tr><td>8</td><td>16.0</td><td>6.0</td><td>61.0</td><td>72,0</td><td>−11,0</td></tr>
  <tr><td>9</td><td>18.0</td><td>3.0</td><td>80.0</td><td>66,5</td><td>+13,5</td></tr>
  <tr><td>10</td><td>20.0</td><td>4.0</td><td>84.0</td><td>76,0</td><td>+8,0</td></tr>
</table></div>

## Часть 1. Остатки, MAE, MSE и RMSE

<p>
  Все метрики регрессии начинаются с остатков, разниц между настоящим ответом и прогнозом. Дальше их надо свернуть
  в одно число, и способ свёртки решает, какие промахи будут важнее.
</p>


<div class="stage" id="stageResid" tabindex="0">
  <div class="stage-figure">
<svg id="residSvg" viewBox="0 0 960 390" role="img" aria-label="Баллы десяти студентов, прогноз дерева и остатки"><style>#residSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="390" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="axes"><line x1="70" y1="300" x2="950" y2="300" stroke="#D8D4C8" stroke-width="1.2"/><line x1="64" y1="300" x2="70" y2="300" stroke="#5E5850" stroke-width="1"/><text x="58" y="304" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="64" y1="252" x2="70" y2="252" stroke="#5E5850" stroke-width="1"/><text x="58" y="256" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">20</text><line x1="70" y1="252" x2="950" y2="252" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="58" y="208" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">40</text><line x1="70" y1="204" x2="950" y2="204" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="156" x2="70" y2="156" stroke="#5E5850" stroke-width="1"/><text x="58" y="160" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">60</text><line x1="70" y1="156" x2="950" y2="156" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="108" x2="70" y2="108" stroke="#5E5850" stroke-width="1"/><text x="58" y="112" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">80</text><line x1="70" y1="108" x2="950" y2="108" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="58" y="64" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">100</text><line x1="70" y1="60" x2="950" y2="60" stroke="#F1EEE6" stroke-width="1"/><text x="24" y="180" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 24 180.0)">баллы</text></g>
<g data-key="sq" data-only="1"><rect x="110" y="183.2" width="44.8" height="44.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="132.4" y="209.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">348</text><rect x="194" y="208.2" width="39" height="39" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="213.5" y="231.7" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">264</text><rect x="278" y="201.6" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="296" y="223.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">225</text><rect x="362" y="160.8" width="40.8" height="40.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="382.4" y="185.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">289</text><rect x="446" y="183.2" width="32.8" height="32.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="462.4" y="203.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">187</text><rect x="530" y="187.2" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="548" y="209.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">225</text><rect x="614" y="127.2" width="64.2" height="64.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="646.1" y="163.3" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">716</text><rect x="698" y="127.2" width="26.4" height="26.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="32.4" height="32.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="798.2" y="128.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">182</text><rect x="866" y="98.4" width="19.2" height="19.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/></g>
<g data-key="dots"><circle cx="110" cy="228.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="110" y="232" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="194" cy="247.2" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="194" y="251.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="278" cy="201.6" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="278" y="205.6" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="362" cy="160.8" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="362" y="164.8" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="446" cy="216.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="446" y="220" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="530" cy="187.2" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="530" y="191.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="614" cy="127.2" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="614" y="131.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="698" cy="153.6" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="698" y="157.6" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="782" cy="108.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="782" y="112" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="866" cy="98.4" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="866" y="102.4" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="pred"><line x1="96" y1="183.2" x2="124" y2="183.2" stroke="#3576C0" stroke-width="3.4"/><line x1="180" y1="208.2" x2="208" y2="208.2" stroke="#3576C0" stroke-width="3.4"/><line x1="264" y1="237.6" x2="292" y2="237.6" stroke="#3576C0" stroke-width="3.4"/><line x1="348" y1="201.6" x2="376" y2="201.6" stroke="#3576C0" stroke-width="3.4"/><line x1="432" y1="183.2" x2="460" y2="183.2" stroke="#3576C0" stroke-width="3.4"/><line x1="516" y1="223.2" x2="544" y2="223.2" stroke="#3576C0" stroke-width="3.4"/><line x1="600" y1="191.4" x2="628" y2="191.4" stroke="#3576C0" stroke-width="3.4"/><line x1="684" y1="127.2" x2="712" y2="127.2" stroke="#3576C0" stroke-width="3.4"/><line x1="768" y1="140.4" x2="796" y2="140.4" stroke="#3576C0" stroke-width="3.4"/><line x1="852" y1="117.6" x2="880" y2="117.6" stroke="#3576C0" stroke-width="3.4"/></g>
<g data-key="seg"><line x1="110" y1="183.2" x2="110" y2="228" stroke="#C29E08" stroke-width="2.6"/><line x1="194" y1="208.2" x2="194" y2="247.2" stroke="#C29E08" stroke-width="2.6"/><line x1="278" y1="237.6" x2="278" y2="201.6" stroke="#C29E08" stroke-width="2.6"/><line x1="362" y1="201.6" x2="362" y2="160.8" stroke="#C29E08" stroke-width="2.6"/><line x1="446" y1="183.2" x2="446" y2="216" stroke="#C29E08" stroke-width="2.6"/><line x1="530" y1="223.2" x2="530" y2="187.2" stroke="#C29E08" stroke-width="2.6"/><line x1="614" y1="191.4" x2="614" y2="127.2" stroke="#C29E08" stroke-width="2.6"/><line x1="698" y1="127.2" x2="698" y2="153.6" stroke="#C29E08" stroke-width="2.6"/><line x1="782" y1="140.4" x2="782" y2="108" stroke="#C29E08" stroke-width="2.6"/><line x1="866" y1="117.6" x2="866" y2="98.4" stroke="#C29E08" stroke-width="2.6"/></g>
<g data-key="lab" data-only="1"><line x1="110" y1="183.2" x2="110" y2="228" stroke="#C29E08" stroke-width="2.6"/><line x1="194" y1="208.2" x2="194" y2="247.2" stroke="#C29E08" stroke-width="2.6"/><line x1="278" y1="237.6" x2="278" y2="201.6" stroke="#C29E08" stroke-width="2.6"/><line x1="362" y1="201.6" x2="362" y2="160.8" stroke="#C29E08" stroke-width="2.6"/><line x1="446" y1="183.2" x2="446" y2="216" stroke="#C29E08" stroke-width="2.6"/><line x1="530" y1="223.2" x2="530" y2="187.2" stroke="#C29E08" stroke-width="2.6"/><line x1="614" y1="191.4" x2="614" y2="127.2" stroke="#C29E08" stroke-width="2.6"/><line x1="698" y1="127.2" x2="698" y2="153.6" stroke="#C29E08" stroke-width="2.6"/><line x1="782" y1="140.4" x2="782" y2="108" stroke="#C29E08" stroke-width="2.6"/><line x1="866" y1="117.6" x2="866" y2="98.4" stroke="#C29E08" stroke-width="2.6"/><text x="119" y="209.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">−18,7</text><text x="203" y="231.7" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">−16,2</text><text x="287" y="223.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+15,0</text><text x="371" y="185.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+17,0</text><text x="455" y="203.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">−13,7</text><text x="539" y="209.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+15,0</text><text x="623" y="163.3" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+26,8</text><text x="707" y="144.4" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">−11,0</text><text x="791" y="128.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+13,5</text><text x="875" y="112" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">+8,0</text></g>
<g data-key="labs" data-only="1"><line x1="110" y1="183.2" x2="110" y2="228" stroke="#C29E08" stroke-width="2.6"/><line x1="194" y1="208.2" x2="194" y2="247.2" stroke="#C29E08" stroke-width="2.6"/><line x1="278" y1="237.6" x2="278" y2="201.6" stroke="#C29E08" stroke-width="2.6"/><line x1="362" y1="201.6" x2="362" y2="160.8" stroke="#C29E08" stroke-width="2.6"/><line x1="446" y1="183.2" x2="446" y2="216" stroke="#C29E08" stroke-width="2.6"/><line x1="530" y1="223.2" x2="530" y2="187.2" stroke="#C29E08" stroke-width="2.6"/><line x1="614" y1="191.4" x2="614" y2="127.2" stroke="#C29E08" stroke-width="2.6"/><line x1="698" y1="127.2" x2="698" y2="153.6" stroke="#C29E08" stroke-width="2.6"/><line x1="782" y1="140.4" x2="782" y2="108" stroke="#C29E08" stroke-width="2.6"/><line x1="866" y1="117.6" x2="866" y2="98.4" stroke="#C29E08" stroke-width="2.6"/><text x="119" y="209.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">18,7</text><text x="203" y="231.7" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">16,2</text><text x="287" y="223.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">15,0</text><text x="371" y="185.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">17,0</text><text x="455" y="203.6" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">13,7</text><text x="539" y="209.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">15,0</text><text x="623" y="163.3" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">26,8</text><text x="707" y="144.4" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">11,0</text><text x="791" y="128.2" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">13,5</text><text x="875" y="112" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">8,0</text></g>
<g data-key="f_bias" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\bar e = \tfrac{1}{10}\sum e_i = \tfrac{1}{10}\,(95{,}25 - 59{,}58) = 3{,}57"></div></foreignObject></g>
<g data-key="f_mae" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{MAE} = \tfrac{1}{10}\sum |e_i| = \tfrac{154{,}8}{10} = 15{,}5\ \text{балла}"></div></foreignObject></g>
<g data-key="f_mse" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{MSE} = \tfrac{1}{10}\sum e_i^2 = \tfrac{2621}{10} = 262{,}1\ \text{балла}^2"></div></foreignObject></g>
<g data-key="f_rmse" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{262{,}1} = 16{,}2\ \text{балла} \;\ge\; \text{MAE} = 15{,}5"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="axes dots" data-focus="dots">
      <div class="step-kicker">Шаг 1 · баллы</div>
      <h4>Настоящие баллы</h4>
      <p>Кружки — баллы десяти студентов за экзамен: зелёные набрали 50 и больше, красные меньше. Студенты стоят по номерам, по вертикали баллы.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred" data-focus="pred">
      <div class="step-kicker">Шаг 2 · прогноз</div>
      <h4>Прогноз дерева</h4>
      <p>Синие черточки — прогноз дерева регрессии глубины 2. Каждого студента предсказывает дерево, обученное на остальных девяти (leave-one-out), поэтому прогноз честный: этого студента дерево не видело.</p>
<p>У студента 3 прогноз <span class="math-inline" data-tex="26"></span> при настоящих <span class="math-inline" data-tex="41"></span>, у студента 8 прогноз <span class="math-inline" data-tex="72"></span> при <span class="math-inline" data-tex="61"></span>.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg lab" data-focus="seg lab">
      <div class="step-kicker">Шаг 3 · остатки</div>
      <h4>Остаток: правда минус прогноз</h4>
      <p>Остаток <span class="math-inline" data-tex="e_i = y_i - \hat y_i"></span> показывает, на сколько баллов промахнулась модель и в какую сторону. Плюс — дерево недооценило студента, минус — переоценило.</p>
<p>Самый большой промах у студента 7: <span class="math-inline" data-tex="72 - 45{,}25 = 26{,}75"></span>.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg lab f_bias" data-focus="f_bias">
      <div class="step-kicker">Шаг 4 · смещение</div>
      <h4>Среднее остатков почти ничего не говорит о точности</h4>
      <p>Плюсы в сумме дают <span class="math-inline" data-tex="95{,}25"></span>, минусы <span class="math-inline" data-tex="-59{,}58"></span>. Среднее остатков <span class="math-inline" data-tex="3{,}57"></span>: дерево в среднем недооценивает студентов на три с половиной балла. Это смещение (bias), полезная вещь: оно показывает систематический сдвиг.</p>
<p>Но о размере ошибок оно не говорит: положительные и отрицательные промахи гасят друг друга. Модель с остатками <span class="math-inline" data-tex="+30"></span> и <span class="math-inline" data-tex="-30"></span> имела бы нулевое смещение. Чтобы промахи не гасились, у остатка убирают знак: берут модуль или квадрат.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg labs f_mae" data-focus="labs f_mae">
      <div class="step-kicker">Шаг 5 · MAE</div>
      <h4>MAE: средний модуль остатка</h4>
      <p>Берём остатки без знака и усредняем. Получается MAE (mean absolute error): <span class="math-inline" data-tex="15{,}5"></span> балла.</p>
<p>MAE измеряется в тех же единицах, что и баллы, и читается напрямую: на новом студенте дерево в среднем промахивается на 15,5 балла. Каждый балл промаха весит одинаково, большой он или маленький.</p>
    </div>
    <div class="step-panel" data-on="axes sq dots pred seg f_mse" data-focus="sq f_mse">
      <div class="step-kicker">Шаг 6 · MSE</div>
      <h4>MSE: средний квадрат остатка</h4>
      <p>Теперь возведём каждый остаток в квадрат. На схеме это буквально квадраты со стороной <span class="math-inline" data-tex="|e_i|"></span>: число внутри — их площадь. Промах в 26,75 балла даёт 716, а промах в 8 баллов только 64.</p>
<p>Среднее этих площадей — MSE (mean squared error), <span class="math-inline" data-tex="262{,}1"></span>. Это та же величина, которую дерево уменьшало при выборе вопросов и которую минимизирует линейная регрессия. Единицы у неё — баллы в квадрате, поэтому само число трудно прочитать.</p>
    </div>
    <div class="step-panel" data-on="axes sq dots pred seg f_rmse" data-focus="f_rmse">
      <div class="step-kicker">Шаг 7 · RMSE</div>
      <h4>RMSE возвращает баллы</h4>
      <p>Корень из MSE снова в баллах: RMSE (root mean squared error) <span class="math-inline" data-tex="= 16{,}2"></span>. Это сторона квадрата, площадь которого равна средней площади всех десяти.</p>
<p>RMSE никогда не меньше MAE. Они равны, только если все промахи одного размера. Чем больше RMSE отрывается от MAE, тем неравномернее ошибки: у дерева <span class="math-inline" data-tex="16{,}2"></span> против <span class="math-inline" data-tex="15{,}5"></span>, промахи примерно одинаковые.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Кроме MAE и RMSE полезны ещё два числа.
</p>

<ul>
  <li><b>Медиана модулей остатков</b> (median absolute error): у дерева 15 баллов. Половина студентов предсказана
    точнее, половина хуже. Один огромный промах её почти не сдвигает.</li>
  <li><b>Максимальная ошибка</b> (max error): 26,75 балла на студенте 7. Нужна там, где важен худший случай,
    а не средний.</li>
</ul>


## Часть 2. MAE против RMSE: один выброс

<p>
  Пусть дерево уже обучено, а студент 10 на экзамен не пришёл и получил 0 баллов. Дерево по-прежнему
  предсказывает ему 76: остаток <span class="math-inline" data-tex="-76"></span> вместо <span class="math-inline" data-tex="+8"></span>.
</p>


<div class="dt-live" id="outLive">
  <div class="dt-live-head"><strong>Интерактив: один студент не пришёл на экзамен</strong>
    <p>Прогнозы дерева остаются прежними, меняется только настоящий балл студента 10. Сверху модули остатков, снизу их квадраты.</p></div>
  <div class="thr-fig"><svg id="outSvg" viewBox="0 0 600 360" role="img" aria-label="Модули и квадраты остатков десяти студентов"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="outR"><span>балл студента 10</span><output id="outV">84</output></label>
        <input id="outR" type="range" min="0" max="100" step="1" value="84"></div>
      <div class="dt-presets"><button type="button" data-v="84">84, как было</button><button type="button" data-v="0">не пришёл: 0</button></div>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>MAE</span><strong id="outMae">—</strong></div>
      <div class="dt-metric"><span>RMSE</span><strong id="outRmse">—</strong></div>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>RMSE / MAE</span><strong id="outRatio">—</strong></div>
      <div class="dt-metric"><span>доля студента 10 в сумме квадратов</span><strong id="outShare">—</strong></div>
    </div>
  </div>
  <div class="dt-formula" id="outF1"></div>
  <div class="dt-formula" id="outF2"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('outSvg');
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
  var D = {"y": [30.0, 22.0, 41.0, 58.0, 35.0, 47.0, 72.0, 61.0, 80.0, 84.0], "p": [48.667, 38.25, 26.0, 41.0, 48.667, 32.0, 45.25, 72.0, 66.5, 76.0]};
  var R = document.getElementById('outR');
  function cx(i) { return 70 + i * 52; }
  function update() {
    var y = D.y.slice(); y[9] = +R.value;
    var e = y.map(function (v, i) { return v - D.p[i]; });
    var a = e.map(Math.abs), q = e.map(function (v) { return v * v; });
    var sa = a.reduce(function (s, v) { return s + v; }, 0), sq = q.reduce(function (s, v) { return s + v; }, 0);
    var maeV = sa / 10, rmseV = Math.sqrt(sq / 10);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 360, fill: '#FFFFFF'}));
    var P1 = {top: 30, h: 120, max: 80}, P2 = {top: 200, h: 120, max: 6400};
    [[P1, '|e|, баллы', a, '#C29E08', '#F6EFD0'], [P2, 'e², баллы²', q, '#3576C0', '#DCE8F5']].forEach(function (r) {
      var P = r[0], vals = r[2], base = P.top + P.h;
      svg.appendChild(el('line', {x1: 40, y1: base, x2: 590, y2: base, stroke: '#D8D4C8'}));
      svg.appendChild(el('text', {x: 40, y: P.top - 12, 'font-size': 13, 'font-weight': 700, fill: '#111111'}, r[1]));
      vals.forEach(function (v, i) {
        var h = Math.min(v / P.max, 1) * P.h;
        svg.appendChild(el('rect', {x: cx(i) - 16, y: base - h, width: 32, height: h, fill: r[4], stroke: r[3], 'stroke-width': 1.4}));
        svg.appendChild(el('text', {x: cx(i), y: base - h - 5, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, v >= 1000 ? Math.round(v) : fmt(v, v < 100 ? 1 : 0)));
        svg.appendChild(el('text', {x: cx(i), y: base + 15, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: i === 9 ? '#2A5E9B' : '#5E5850'}, String(i + 1)));
      });
      var mv = P === P1 ? maeV : sq / 10, my = base - Math.min(mv / P.max, 1) * P.h;
      svg.appendChild(el('line', {x1: 44, y1: my, x2: 586, y2: my, stroke: r[3], 'stroke-width': 2, 'stroke-dasharray': '6 4'}));
      svg.appendChild(el('text', {x: 586, y: my - 5, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: r[3]}, (P === P1 ? 'MAE ' : 'MSE ') + fmt(mv, 1)));
    });
    document.getElementById('outV').textContent = y[9];
    document.getElementById('outMae').textContent = fmt(maeV, 2);
    document.getElementById('outRmse').textContent = fmt(rmseV, 2);
    document.getElementById('outRatio').textContent = fmt(rmseV / maeV, 2);
    document.getElementById('outShare').textContent = fmt(q[9] / sq * 100, 0) + ' %';
    var c = function (v, d) { return fmt(v, d).replace(',', '{,}'); };
    tex(document.getElementById('outF1'), '\\text{MAE} = \\dfrac{' + c(sa - a[9], 1) + ' + ' + c(a[9], 1) + '}{10} = ' + c(maeV, 2), 'MAE ' + fmt(maeV, 2));
    tex(document.getElementById('outF2'), '\\text{RMSE} = \\sqrt{\\dfrac{' + c(sq - q[9], 0) + ' + ' + c(q[9], 0) + '}{10}} = ' + c(rmseV, 2), 'RMSE ' + fmt(rmseV, 2));
  }
  R.addEventListener('input', update);
  document.querySelectorAll('#outLive [data-v]').forEach(function (b) { b.addEventListener('click', function () { R.value = b.getAttribute('data-v'); update(); }); });
  update();
})();
</script>


<p>
  MAE выросла с 15,5 до 22,3, на 44 %. RMSE — с 16,2 до 28,9, на 78 %. Студент 10 даёт 69 % всей суммы квадратов:
  при возведении в квадрат промах в 76 баллов весит как 90 промахов по 8. Отношение RMSE к MAE выросло с 1,05 до 1,30.
  По нему видно, что ошибки стали неравномерными.
</p>

<ul>
  <li>RMSE подходит, если большой промах действительно хуже нескольких маленьких той же суммы. Пример: по прогнозу
    решают, кого записать на дополнительные занятия, и ошибка на 40 баллов означает провал, а на 10 — почти ничего.</li>
  <li>MAE подходит, если каждый балл ошибки стоит одинаково, или если в данных есть мусор вроде неявки,
    который не хочется делать главным в оценке.</li>
</ul>


## Часть 3. Какой прогноз лучший для каждой метрики

<p>
  В <a href="article.html?slug=regression-tree-full-cycle">статье про дерево регрессии</a> было показано: если всем
  студентам дать одно и то же число <span class="math-inline" data-tex="c"></span>, сумму квадратов минимизирует среднее, а сумму модулей — медиана.
  Это не частность константного прогноза. Метрика сама решает, что считать правильным ответом.
</p>


<div class="dt-live" id="cLive">
  <div class="dt-live-head"><strong>Интерактив: лучший постоянный прогноз для MSE и MAE</strong>
    <p>Двигайте константу c — прогноз, одинаковый для всех десяти студентов. Кривая показывает метрику при каждом c, синяя точка — её минимум.</p></div>
  <div class="thr-fig"><svg id="cLiveSvg" viewBox="0 0 600 330" role="img" aria-label="Метрика константного прогноза в зависимости от c"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-m="mse" aria-pressed="true">MSE</button><button type="button" data-m="mae" aria-pressed="false">MAE</button></div>
      <div class="dt-control"><label for="cLiveC"><span>константа c</span><output id="cLiveCv">40</output></label>
        <input id="cLiveC" type="range" min="0" max="100" step="0.5" value="40"></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span id="cLiveName">—</span><strong id="cLiveVal">—</strong></div>
      <div class="dt-metric"><span>лучшее c</span><strong id="cLiveBest">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>среднее и медиана баллов</span><strong id="cLiveMm">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('cLiveSvg');
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
  var Y0 = [30.0, 22.0, 41.0, 58.0, 35.0, 47.0, 72.0, 61.0, 80.0, 84.0];
  var mode = 'mse', absent = false, tau = 0.9;
  var C = document.getElementById('cLiveC'), QR = null;
  var NAMES = {mse: 'MSE', mae: 'MAE', mape: 'MAPE', q: 'квантильная потеря'};
  function ys() { var y = Y0.slice(); if (absent) y[9] = 0; return y; }
  function metric(y, c) {
    var s = 0;
    for (var i = 0; i < y.length; i++) {
      var e = y[i] - c;
      if (mode === 'mse') s += e * e;
      else if (mode === 'mae') s += Math.abs(e);
      else if (mode === 'mape') { if (y[i] === 0) return Infinity; s += Math.abs(e) / y[i]; }
      else s += Math.max(tau * e, (tau - 1) * e);
    }
    return s / y.length;
  }
  function sx(c) { return 50 + c * 5.2; }
  function fmtv(v) { return mode === 'mape' ? fmt(v * 100, 1) + ' %' : fmt(v, mode === 'mse' ? 1 : 2); }
  function update() {
    var y = ys(), c = +C.value;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('line', {x1: sx(0), y1: 60, x2: sx(100), y2: 60, stroke: '#D8D4C8', 'stroke-width': 1.4}));
    [0, 20, 40, 60, 80, 100].forEach(function (v) {
      svg.appendChild(el('text', {x: sx(v), y: 316, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, String(v)));
      svg.appendChild(el('line', {x1: sx(v), y1: 296, x2: sx(v), y2: 302, stroke: '#5E5850'}));
    });
    svg.appendChild(el('text', {x: sx(100), y: 30, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'баллы студентов'));
    var pts = [], vals = [], best = Infinity;
    for (var k = 0; k <= 400; k++) { var cc = k / 4, v = metric(y, cc); vals.push(v); if (v < best) best = v; }
    var finite = isFinite(best);
    var lo = null, hi = null;
    if (finite) vals.forEach(function (v, k) { if (v <= best + 1e-9) { if (lo === null) lo = k / 4; hi = k / 4; } });
    if (finite) {
      var vmax = Math.max.apply(null, vals);
      var py = function (v) { return 296 - v / vmax * 190; };
      svg.appendChild(el('path', {d: vals.map(function (v, k) { return (k ? 'L' : 'M') + sx(k / 4).toFixed(1) + ' ' + py(v).toFixed(1); }).join(' '),
                                  fill: 'none', stroke: '#C29E08', 'stroke-width': 3}));
      svg.appendChild(el('line', {x1: sx(lo), y1: py(best), x2: sx(hi), y2: py(best), stroke: '#2A5E9B', 'stroke-width': 5}));
      svg.appendChild(el('circle', {cx: sx((lo + hi) / 2), cy: py(best), r: 6, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
      svg.appendChild(el('line', {x1: sx(c), y1: py(metric(y, c)), x2: sx(c), y2: 296, stroke: '#C29E08', 'stroke-dasharray': '3 3'}));
      svg.appendChild(el('circle', {cx: sx(c), cy: py(metric(y, c)), r: 6, fill: '#8F7406', stroke: '#FFFFFF', 'stroke-width': 2}));
    } else {
      svg.appendChild(el('text', {x: 300, y: 190, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#9C0908'}, 'MAPE не определена: у студента 10 ноль баллов'));
    }
    svg.appendChild(el('line', {x1: sx(c), y1: 40, x2: sx(c), y2: 80, stroke: '#C29E08', 'stroke-width': 3}));
    y.forEach(function (v, i) {
      svg.appendChild(el('circle', {cx: sx(v), cy: 60, r: 9, fill: v >= 50 ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: sx(v), y: 64, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    var srt = y.slice().sort(function (a, b) { return a - b; });
    var mean = y.reduce(function (s, v) { return s + v; }, 0) / 10, med = (srt[4] + srt[5]) / 2;
    document.getElementById('cLiveCv').textContent = fmt(c, 1);
    document.getElementById('cLiveName').textContent = NAMES[mode] + ' при этом c';
    document.getElementById('cLiveVal').textContent = finite ? fmtv(metric(y, c)) : '∞';
    document.getElementById('cLiveBest').textContent = !finite ? '—' : (hi - lo < 0.3 ? fmt((lo + hi) / 2, 1) : 'от ' + fmt(lo, 1) + ' до ' + fmt(hi, 1));
    document.getElementById('cLiveMm').textContent = 'среднее ' + fmt(mean, 1) + ', медиана ' + fmt(med, 1);
    var qb = document.querySelector('#cLive [data-qbox]'); if (qb) qb.style.display = mode === 'q' ? '' : 'none';
  }
  C.addEventListener('input', update);
  if (QR) QR.addEventListener('input', function () { tau = +QR.value; document.getElementById('QV').textContent = fmt(tau, 2); update(); });
  document.querySelectorAll('#cLive [data-m]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.getAttribute('data-m');
      document.querySelectorAll('#cLive [data-m]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  document.querySelectorAll('#cLive [data-abs]').forEach(function (b) {
    b.addEventListener('click', function () { absent = b.getAttribute('data-abs') === '1';
      document.querySelectorAll('#cLive [data-abs]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  update();
})();
</script>


<p>
  MSE минимальна при <span class="math-inline" data-tex="c = 53"></span>, среднем баллов: MSE 413,4, RMSE около 20,3. У MAE минимум плоский: любое <span class="math-inline" data-tex="c"></span> от 47 до 58
  даёт MAE 18. Пока <span class="math-inline" data-tex="c"></span> внутри этого отрезка, ниже него и выше остаётся по пять студентов, и при сдвиге <span class="math-inline" data-tex="c"></span> одни
  промахи растут ровно на столько, на сколько уменьшаются другие. Медиана 52,5 — середина отрезка по договорённости.
</p>

<p>
  То же верно и для настоящих моделей. Модель, обученная на квадрате ошибки, предсказывает среднее балла
  для студентов с такими часами и пропусками, а модель на модуле — медиану. Если обучать на MSE, а оценивать по MAE,
  модель целится в одно, а оценивают её за другое. На симметричных данных разница мала, на данных с выбросами
  она видна, это часть 8.
</p>


## Часть 4. Базовая модель и R²

<p>
  Само по себе MAE 15,5 балла не говорит, хорошо это или плохо. Нужен эталон, и самый простой эталон —
  модель, которая признаки не смотрит вовсе.
</p>


<div class="stage" id="stageR2" tabindex="0">
  <div class="stage-figure">
<svg id="r2Svg" viewBox="0 0 960 390" role="img" aria-label="Суммы квадратов от среднего и от прогноза модели"><style>#r2Svg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="390" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="axes"><line x1="70" y1="300" x2="950" y2="300" stroke="#D8D4C8" stroke-width="1.2"/><line x1="64" y1="300" x2="70" y2="300" stroke="#5E5850" stroke-width="1"/><text x="58" y="304" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="64" y1="252" x2="70" y2="252" stroke="#5E5850" stroke-width="1"/><text x="58" y="256" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">20</text><line x1="70" y1="252" x2="950" y2="252" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="58" y="208" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">40</text><line x1="70" y1="204" x2="950" y2="204" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="156" x2="70" y2="156" stroke="#5E5850" stroke-width="1"/><text x="58" y="160" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">60</text><line x1="70" y1="156" x2="950" y2="156" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="108" x2="70" y2="108" stroke="#5E5850" stroke-width="1"/><text x="58" y="112" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">80</text><line x1="70" y1="108" x2="950" y2="108" stroke="#F1EEE6" stroke-width="1"/><line x1="64" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="58" y="64" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">100</text><line x1="70" y1="60" x2="950" y2="60" stroke="#F1EEE6" stroke-width="1"/><text x="24" y="180" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 24 180.0)">баллы</text></g>
<g data-key="sq_m" data-only="1"><rect x="110" y="172.8" width="55.2" height="55.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="137.6" y="204.4" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">529</text><rect x="194" y="172.8" width="74.4" height="74.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="231.2" y="214" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">961</text><rect x="278" y="172.8" width="28.8" height="28.8" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="362" y="160.8" width="12" height="12" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="446" y="172.8" width="43.2" height="43.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="467.6" y="198.4" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">324</text><rect x="530" y="172.8" width="14.4" height="14.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="614" y="127.2" width="45.6" height="45.6" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="636.8" y="154" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">361</text><rect x="698" y="153.6" width="19.2" height="19.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="64.8" height="64.8" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="814.4" y="144.4" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">729</text><rect x="866" y="98.4" width="74.4" height="74.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="903.2" y="139.6" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">961</text></g>
<g data-key="sq_t" data-only="1"><rect x="110" y="183.2" width="44.8" height="44.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="132.4" y="209.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">348</text><rect x="194" y="208.2" width="39" height="39" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="213.5" y="231.7" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">264</text><rect x="278" y="201.6" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="296" y="223.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">225</text><rect x="362" y="160.8" width="40.8" height="40.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="382.4" y="185.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">289</text><rect x="446" y="183.2" width="32.8" height="32.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="462.4" y="203.6" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">187</text><rect x="530" y="187.2" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="548" y="209.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">225</text><rect x="614" y="127.2" width="64.2" height="64.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="646.1" y="163.3" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">716</text><rect x="698" y="127.2" width="26.4" height="26.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="32.4" height="32.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><text x="798.2" y="128.2" font-size="11" fill="#8F7406" text-anchor="middle" font-weight="700">182</text><rect x="866" y="98.4" width="19.2" height="19.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/></g>
<g data-key="sq_m0" data-only="1"><rect x="110" y="172.8" width="55.2" height="55.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="194" y="172.8" width="74.4" height="74.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="278" y="172.8" width="28.8" height="28.8" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="362" y="160.8" width="12" height="12" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="446" y="172.8" width="43.2" height="43.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="530" y="172.8" width="14.4" height="14.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="614" y="127.2" width="45.6" height="45.6" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="698" y="153.6" width="19.2" height="19.2" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="64.8" height="64.8" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="866" y="98.4" width="74.4" height="74.4" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/></g>
<g data-key="sq_t0" data-only="1"><rect x="110" y="183.2" width="44.8" height="44.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="194" y="208.2" width="39" height="39" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="278" y="201.6" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="362" y="160.8" width="40.8" height="40.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="446" y="183.2" width="32.8" height="32.8" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="530" y="187.2" width="36" height="36" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="614" y="127.2" width="64.2" height="64.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="698" y="127.2" width="26.4" height="26.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="32.4" height="32.4" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="866" y="98.4" width="19.2" height="19.2" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/></g>
<g data-key="sq_l" data-only="1"><rect x="110" y="224.25" width="3.75" height="3.75" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="194" y="247.2" width="6.65" height="6.65" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="278" y="201.6" width="5.92" height="5.92" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="362" y="160.8" width="1.41" height="1.41" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="446" y="216" width="2.18" height="2.18" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="530" y="170.58" width="16.62" height="16.62" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="614" y="127.2" width="0.67" height="0.67" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="698" y="153.07" width="0.53" height="0.53" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="0.57" height="0.57" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/><rect x="866" y="98.4" width="8.23" height="8.23" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.2" fill-opacity="0.85"/></g>
<g data-key="sq_o" data-only="1"><rect x="110" y="166.67" width="61.33" height="61.33" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="140.67" y="201.33" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">653</text><rect x="194" y="164.53" width="82.67" height="82.67" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="235.33" y="209.87" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">1186</text><rect x="278" y="169.6" width="32" height="32" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="294" y="189.6" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">178</text><rect x="362" y="160.8" width="13.33" height="13.33" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="446" y="168" width="48" height="48" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="470" y="196" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">400</text><rect x="530" y="171.2" width="16" height="16" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="614" y="127.2" width="50.67" height="50.67" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="639.33" y="156.53" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">446</text><rect x="698" y="153.6" width="21.33" height="21.33" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><rect x="782" y="108" width="72" height="72" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="818" y="148" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">900</text><rect x="866" y="98.4" width="82.67" height="82.67" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.2" fill-opacity="0.85"/><text x="907.33" y="143.73" font-size="11" fill="#2A5E9B" text-anchor="middle" font-weight="700">1186</text></g>
<g data-key="mline" data-only="1"><line x1="70" y1="172.8" x2="950" y2="172.8" stroke="#5E5850" stroke-width="2" stroke-dasharray="7 5"/><text x="74" y="166.8" font-size="12" fill="#5E5850" text-anchor="start" font-weight="700">среднее 53</text></g>
<g data-key="dots"><circle cx="110" cy="228.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="110" y="232" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="194" cy="247.2" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="194" y="251.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="278" cy="201.6" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="278" y="205.6" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="362" cy="160.8" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="362" y="164.8" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="446" cy="216.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="446" y="220" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="530" cy="187.2" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="530" y="191.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="614" cy="127.2" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="614" y="131.2" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="698" cy="153.6" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="698" y="157.6" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="782" cy="108.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="782" y="112" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="866" cy="98.4" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="866" y="102.4" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="p_t" data-only="1"><line x1="96" y1="183.2" x2="124" y2="183.2" stroke="#3576C0" stroke-width="3.4"/><line x1="180" y1="208.2" x2="208" y2="208.2" stroke="#3576C0" stroke-width="3.4"/><line x1="264" y1="237.6" x2="292" y2="237.6" stroke="#3576C0" stroke-width="3.4"/><line x1="348" y1="201.6" x2="376" y2="201.6" stroke="#3576C0" stroke-width="3.4"/><line x1="432" y1="183.2" x2="460" y2="183.2" stroke="#3576C0" stroke-width="3.4"/><line x1="516" y1="223.2" x2="544" y2="223.2" stroke="#3576C0" stroke-width="3.4"/><line x1="600" y1="191.4" x2="628" y2="191.4" stroke="#3576C0" stroke-width="3.4"/><line x1="684" y1="127.2" x2="712" y2="127.2" stroke="#3576C0" stroke-width="3.4"/><line x1="768" y1="140.4" x2="796" y2="140.4" stroke="#3576C0" stroke-width="3.4"/><line x1="852" y1="117.6" x2="880" y2="117.6" stroke="#3576C0" stroke-width="3.4"/></g>
<g data-key="p_l" data-only="1"><line x1="96" y1="224.25" x2="124" y2="224.25" stroke="#5F9420" stroke-width="3.4"/><line x1="180" y1="253.85" x2="208" y2="253.85" stroke="#5F9420" stroke-width="3.4"/><line x1="264" y1="207.52" x2="292" y2="207.52" stroke="#5F9420" stroke-width="3.4"/><line x1="348" y1="162.21" x2="376" y2="162.21" stroke="#5F9420" stroke-width="3.4"/><line x1="432" y1="218.18" x2="460" y2="218.18" stroke="#5F9420" stroke-width="3.4"/><line x1="516" y1="170.58" x2="544" y2="170.58" stroke="#5F9420" stroke-width="3.4"/><line x1="600" y1="127.87" x2="628" y2="127.87" stroke="#5F9420" stroke-width="3.4"/><line x1="684" y1="153.07" x2="712" y2="153.07" stroke="#5F9420" stroke-width="3.4"/><line x1="768" y1="108.57" x2="796" y2="108.57" stroke="#5F9420" stroke-width="3.4"/><line x1="852" y1="106.63" x2="880" y2="106.63" stroke="#5F9420" stroke-width="3.4"/></g>
<g data-key="p_o" data-only="1"><line x1="96" y1="166.67" x2="124" y2="166.67" stroke="#5E5850" stroke-width="3.4"/><line x1="180" y1="164.53" x2="208" y2="164.53" stroke="#5E5850" stroke-width="3.4"/><line x1="264" y1="169.6" x2="292" y2="169.6" stroke="#5E5850" stroke-width="3.4"/><line x1="348" y1="174.13" x2="376" y2="174.13" stroke="#5E5850" stroke-width="3.4"/><line x1="432" y1="168" x2="460" y2="168" stroke="#5E5850" stroke-width="3.4"/><line x1="516" y1="171.2" x2="544" y2="171.2" stroke="#5E5850" stroke-width="3.4"/><line x1="600" y1="177.87" x2="628" y2="177.87" stroke="#5E5850" stroke-width="3.4"/><line x1="684" y1="174.93" x2="712" y2="174.93" stroke="#5E5850" stroke-width="3.4"/><line x1="768" y1="180" x2="796" y2="180" stroke="#5E5850" stroke-width="3.4"/><line x1="852" y1="181.07" x2="880" y2="181.07" stroke="#5E5850" stroke-width="3.4"/></g>
<g data-key="f_sst" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{SST} = \sum (y_i - \bar y)^2 = 4134 \qquad \text{MSE константы} = 413{,}4"></div></foreignObject></g>
<g data-key="f_sse" data-only="1"><foreignObject x="50" y="326" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="\text{SSE}_{\text{дерево}} = \sum (y_i - \hat y_i)^2 = 2621"></div></foreignObject></g>
<g data-key="f_r2" data-only="1"><foreignObject x="50" y="324" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2 = 1 - \dfrac{\text{SSE}}{\text{SST}} = 1 - \dfrac{2621}{4134} = 0{,}366"></div></foreignObject></g>
<g data-key="f_lin" data-only="1"><foreignObject x="50" y="324" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2_{\text{лин. регрессия}} = 1 - \dfrac{77}{4134} = 0{,}981"></div></foreignObject></g>
<g data-key="f_loo" data-only="1"><foreignObject x="50" y="324" width="860" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2_{\text{среднее остальных}} = 1 - \dfrac{5104}{4134} = -0{,}235"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="axes dots mline sq_m f_sst" data-focus="sq_m f_sst">
      <div class="step-kicker">Шаг 1 · база</div>
      <h4>Сначала модель без признаков</h4>
      <p>Самая простая модель не смотрит ни на часы, ни на пропуски и всем отвечает средним, 53 балла. Синие квадраты — квадраты отклонений от среднего. Их сумма называется SST (total sum of squares): <span class="math-inline" data-tex="4134"></span>.</p>
<p>Это та же сумма, с которой начиналось дерево регрессии в корне. MSE такой константы <span class="math-inline" data-tex="413{,}4"></span>, RMSE около 20 баллов.</p>
    </div>
    <div class="step-panel" data-on="axes dots p_t sq_t f_sse" data-focus="sq_t f_sse">
      <div class="step-kicker">Шаг 2 · дерево</div>
      <h4>Квадраты остатков дерева</h4>
      <p>Те же квадраты для прогноза дерева из части 1 — сумма квадратов остатков, SSE: <span class="math-inline" data-tex="2621"></span>. Она меньше 4134: часы и пропуски помогли.</p>
    </div>
    <div class="step-panel" data-on="axes dots mline sq_m0 p_t sq_t0 f_r2" data-focus="f_r2">
      <div class="step-kicker">Шаг 3 · R²</div>
      <h4>R²: какую долю разброса модель убрала</h4>
      <p>Сравним две суммы: дерево оставило <span class="math-inline" data-tex="2621 / 4134 = 63{,}4\,\%"></span> квадратичного разброса, значит, убрало <span class="math-inline" data-tex="36{,}6\,\%"></span>.</p>
<p>Это коэффициент детерминации <span class="math-inline" data-tex="R^2"></span>. Он не зависит от единиц: баллы, рубли или градусы, <span class="math-inline" data-tex="R^2 = 0"></span> означает «не лучше среднего», <span class="math-inline" data-tex="R^2 = 1"></span> — прогноз без ошибок. Это удобно для сравнения задач, но цены ошибки в баллах <span class="math-inline" data-tex="R^2"></span> не показывает.</p>
    </div>
    <div class="step-panel" data-on="axes dots p_l sq_l f_lin" data-focus="sq_l f_lin">
      <div class="step-kicker">Шаг 4 · линейная регрессия</div>
      <h4>Почти без ошибок</h4>
      <p>Линейная регрессия на тех же студентах, тоже leave-one-out. Квадраты почти исчезли: <span class="math-inline" data-tex="\text{SSE} = 77"></span>, <span class="math-inline" data-tex="R^2 = 0{,}981"></span>, MAE 1,9 балла.</p>
<p>Баллы у наших студентов почти точно ложатся на плоскость <span class="math-inline" data-tex="37{,}4 + 3{,}06 \cdot \text{часы} - 4{,}18 \cdot \text{пропуски}"></span>, а дерево глубины 2 приближает её четырьмя ступеньками.</p>
    </div>
    <div class="step-panel" data-on="axes dots mline p_o sq_o f_loo" data-focus="sq_o f_loo">
      <div class="step-kicker">Шаг 5 · ниже нуля</div>
      <h4>R² бывает отрицательным</h4>
      <p>Серые черточки — «модель среднего», которой тоже не дали увидеть студента: каждому она отвечает средним по остальным девяти. Студенту 10 с 84 баллами — <span class="math-inline" data-tex="(530 - 84)/9 = 49{,}6"></span>, студенту 2 с 22 баллами — <span class="math-inline" data-tex="56{,}4"></span>. Прогноз каждый раз сдвигается от студента, и квадраты выходят больше синих из первого шага: <span class="math-inline" data-tex="5104"></span>.</p>
<p><span class="math-inline" data-tex="R^2 = -0{,}235"></span>: на новых данных модель хуже, чем среднее этих же данных. Отрицательный <span class="math-inline" data-tex="R^2"></span> на тесте не ошибка в расчёте: эталоном служит среднее теста, которого модель знать не может.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Три модели в одной таблице:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Модель (leave-one-out)</th><th>MAE</th><th>RMSE</th><th><span class="math-inline" data-tex="R^2"></span></th></tr>
  <tr><td>среднее остальных девяти</td><td>20,0</td><td>22,6</td><td>−0,235</td></tr>
  <tr><td>дерево глубины 2</td><td>15,5</td><td>16,2</td><td>0,366</td></tr>
  <tr><td>линейная регрессия</td><td>1,9</td><td>2,8</td><td>0,981</td></tr>
</table></div>


<p>
  Формулу <span class="math-inline" data-tex="R^2"></span> можно переписать через MSE: <span class="math-inline" data-tex="R^2 = 1 - \text{MSE} / \text{Var}(y)"></span>, где <span class="math-inline" data-tex="\text{Var}(y)"></span> — разброс
  настоящих ответов в тех данных, на которых считаем. Отсюда следует подвох: одна и та же модель с одним и тем же MSE
  получит разный <span class="math-inline" data-tex="R^2"></span> на разных тестах. При MSE 262 и дисперсии баллов 413 получаем <span class="math-inline" data-tex="R^2 = 0{,}37"></span>.
  Если взять группу, где баллы разбросаны меньше, с дисперсией 300, тот же MSE даст <span class="math-inline" data-tex="R^2 = 0{,}13"></span>.
  Поэтому <span class="math-inline" data-tex="R^2"></span> сравнивают только на одних и тех же данных.
</p>

<p>
  В sklearn <code>r2_score(y_true, y_pred)</code> не симметрична: сначала настоящие ответы, потом прогноз.
  Если перепутать порядок, эталоном станет среднее прогнозов, и число будет другим.
</p>


## Часть 5. Относительные ошибки: MAPE и WAPE

<p>
  Промах в 16 баллов у студента с 22 баллами и у студента с 84 баллами ощущается по-разному. Относительная ошибка
  делит модуль остатка на настоящий ответ:
</p>

<div class="math-display" data-tex="\text{MAPE} = \frac{1}{n}\sum_i \frac{|y_i - \hat y_i|}{|y_i|}"></div>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Баллы</th><th>Прогноз</th><th><span class="math-inline" data-tex="|e|"></span></th><th><span class="math-inline" data-tex="|e| / y"></span></th></tr>
  <tr><td>1</td><td>30.0</td><td>48,7</td><td>18,7</td><td>62,2 %</td></tr>
  <tr class="hl"><td>2</td><td>22.0</td><td>38,2</td><td>16,2</td><td>73,9 %</td></tr>
  <tr><td>3</td><td>41.0</td><td>26,0</td><td>15,0</td><td>36,6 %</td></tr>
  <tr><td>4</td><td>58.0</td><td>41,0</td><td>17,0</td><td>29,3 %</td></tr>
  <tr><td>5</td><td>35.0</td><td>48,7</td><td>13,7</td><td>39,0 %</td></tr>
  <tr><td>6</td><td>47.0</td><td>32,0</td><td>15,0</td><td>31,9 %</td></tr>
  <tr><td>7</td><td>72.0</td><td>45,2</td><td>26,8</td><td>37,2 %</td></tr>
  <tr><td>8</td><td>61.0</td><td>72,0</td><td>11,0</td><td>18,0 %</td></tr>
  <tr><td>9</td><td>80.0</td><td>66,5</td><td>13,5</td><td>16,9 %</td></tr>
  <tr class="hl"><td>10</td><td>84.0</td><td>76,0</td><td>8,0</td><td>9,5 %</td></tr>
  <tr><td>всего</td><td>530</td><td></td><td>154,8</td><td>среднее 35,5 %</td></tr>
</table></div>


<p>
  MAPE дерева 35,5 %. Больше всего в неё вносят студенты с низкими баллами: студент 2 промахом в 16,25 балла
  даёт 73,9 %, а студент 10 промахом в 8 баллов — 9,5 %. У MAPE три известные проблемы.
</p>

<ul>
  <li><b>Ноль в ответах.</b> Студент, который не пришёл и получил 0, делает MAPE бесконечной. В sklearn
    <code>mean_absolute_percentage_error</code> в этом случае делит на очень маленькое число и возвращает огромное значение.</li>
  <li><b>Несимметричность.</b> Недооценка не может стоить больше 100 % (прогноз 0), а переоценка не ограничена.
    Поэтому модель, обученная на MAPE, занижает прогнозы. Лучшая константа по MAPE для наших студентов — 41 балл,
    на 11,5 ниже медианы. Это видно в интерактиве части 6.</li>
  <li><b>Вес малых ответов.</b> MAPE считает студента с 22 баллами почти в четыре раза важнее студента с 84 баллами.
    Иногда так и нужно, но чаще это получается случайно.</li>
</ul>

<p>
  WAPE (weighted absolute percentage error) делит сумму модулей ошибок на сумму ответов:
  <span class="math-inline" data-tex="\text{WAPE} = \sum |e_i| / \sum |y_i| = 154{,}8 / 530 = 29{,}2\,\%"></span>. Это MAE, делённая на средний ответ.
  Её можно считать при нулевых ответах, и вклад каждого студента пропорционален его промаху в баллах.
  WAPE обычно берут, когда нужен процент для отчёта: на сколько процентов прогноз промахивается в сумме.
</p>


## Часть 6. Когда недооценка и переоценка стоят по-разному

<p>
  MAE и RMSE одинаково наказывают промах вверх и вниз. Иногда одна сторона дороже. Пусть по прогнозу баллов
  деканат решает, кого не звать на консультацию перед пересдачей. Переоценить слабого студента дорого: он останется
  без помощи. Недооценить сильного дёшево: он потратит час.
</p>

<p>
  Для этого есть квантильная потеря (pinball loss) с параметром <span class="math-inline" data-tex="\tau"></span> от 0 до 1:
</p>

<div class="math-display" data-tex="L_\tau(e) = \begin{cases} \tau \cdot e, &amp; e \ge 0 \ \text{(недооценка)} \\ (\tau - 1) \cdot e, &amp; e &lt; 0 \ \text{(переоценка)} \end{cases}"></div>

<p>
  При <span class="math-inline" data-tex="\tau = 0{,}1"></span> балл переоценки стоит <span class="math-inline" data-tex="0{,}9"></span>, а балл недооценки <span class="math-inline" data-tex="0{,}1"></span>, в девять раз дешевле.
  Лучшей константой оказывается 10-й процентиль: у наших студентов любое число от 22 до 30. Прогноз
  сдвигается вниз, и переоценка почти исчезает. При <span class="math-inline" data-tex="\tau = 0{,}9"></span> всё наоборот, лучшая константа от 80 до 84.
  При <span class="math-inline" data-tex="\tau = 0{,}5"></span> потеря равна половине модуля, и получается медиана.
</p>

<p>
  Модель, обученная на квантильной потере, предсказывает не средний балл, а балл, ниже которого окажется доля <span class="math-inline" data-tex="\tau"></span>
  похожих студентов. Две такие модели, с <span class="math-inline" data-tex="\tau = 0{,}1"></span> и <span class="math-inline" data-tex="\tau = 0{,}9"></span>, дают интервал, куда попадает 80 %
  студентов. В sklearn это <code>QuantileRegressor</code> и
  <code>GradientBoostingRegressor</code> с параметрами <code>loss="quantile"</code> и <code>alpha=0.9</code>, а оценивают такие модели функцией
  <code>mean_pinball_loss</code>.
</p>


<div class="dt-live" id="qLive">
  <div class="dt-live-head"><strong>Интерактив: MAPE и квантильная потеря сдвигают лучший прогноз</strong>
    <p>Двигайте константу c — прогноз, одинаковый для всех десяти студентов. Кривая показывает метрику при каждом c, синяя точка — её минимум.</p></div>
  <div class="thr-fig"><svg id="qLiveSvg" viewBox="0 0 600 330" role="img" aria-label="Метрика константного прогноза в зависимости от c"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-m="mae" aria-pressed="false">MAE</button><button type="button" data-m="mape" aria-pressed="true">MAPE</button><button type="button" data-m="q" aria-pressed="false">квантильная</button></div>
      <div class="dt-control" data-qbox><label for="qLiveQ"><span>квантиль τ</span><output id="qLiveQv">0,90</output></label>
        <input id="qLiveQ" type="range" min="0.05" max="0.95" step="0.05" value="0.9"></div>
      <div class="dt-control"><label for="qLiveC"><span>константа c</span><output id="qLiveCv">40</output></label>
        <input id="qLiveC" type="range" min="0" max="100" step="0.5" value="40"></div>
      <div class="dt-presets"><button type="button" data-abs="0" aria-pressed="true">баллы как есть</button><button type="button" data-abs="1" aria-pressed="false">студент 10 не пришёл: 0</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span id="qLiveName">—</span><strong id="qLiveVal">—</strong></div>
      <div class="dt-metric"><span>лучшее c</span><strong id="qLiveBest">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>среднее и медиана баллов</span><strong id="qLiveMm">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('qLiveSvg');
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
  var Y0 = [30.0, 22.0, 41.0, 58.0, 35.0, 47.0, 72.0, 61.0, 80.0, 84.0];
  var mode = 'mape', absent = false, tau = 0.9;
  var C = document.getElementById('qLiveC'), QR = document.getElementById('qLiveQ');
  var NAMES = {mse: 'MSE', mae: 'MAE', mape: 'MAPE', q: 'квантильная потеря'};
  function ys() { var y = Y0.slice(); if (absent) y[9] = 0; return y; }
  function metric(y, c) {
    var s = 0;
    for (var i = 0; i < y.length; i++) {
      var e = y[i] - c;
      if (mode === 'mse') s += e * e;
      else if (mode === 'mae') s += Math.abs(e);
      else if (mode === 'mape') { if (y[i] === 0) return Infinity; s += Math.abs(e) / y[i]; }
      else s += Math.max(tau * e, (tau - 1) * e);
    }
    return s / y.length;
  }
  function sx(c) { return 50 + c * 5.2; }
  function fmtv(v) { return mode === 'mape' ? fmt(v * 100, 1) + ' %' : fmt(v, mode === 'mse' ? 1 : 2); }
  function update() {
    var y = ys(), c = +C.value;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('line', {x1: sx(0), y1: 60, x2: sx(100), y2: 60, stroke: '#D8D4C8', 'stroke-width': 1.4}));
    [0, 20, 40, 60, 80, 100].forEach(function (v) {
      svg.appendChild(el('text', {x: sx(v), y: 316, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, String(v)));
      svg.appendChild(el('line', {x1: sx(v), y1: 296, x2: sx(v), y2: 302, stroke: '#5E5850'}));
    });
    svg.appendChild(el('text', {x: sx(100), y: 30, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'баллы студентов'));
    var pts = [], vals = [], best = Infinity;
    for (var k = 0; k <= 400; k++) { var cc = k / 4, v = metric(y, cc); vals.push(v); if (v < best) best = v; }
    var finite = isFinite(best);
    var lo = null, hi = null;
    if (finite) vals.forEach(function (v, k) { if (v <= best + 1e-9) { if (lo === null) lo = k / 4; hi = k / 4; } });
    if (finite) {
      var vmax = Math.max.apply(null, vals);
      var py = function (v) { return 296 - v / vmax * 190; };
      svg.appendChild(el('path', {d: vals.map(function (v, k) { return (k ? 'L' : 'M') + sx(k / 4).toFixed(1) + ' ' + py(v).toFixed(1); }).join(' '),
                                  fill: 'none', stroke: '#C29E08', 'stroke-width': 3}));
      svg.appendChild(el('line', {x1: sx(lo), y1: py(best), x2: sx(hi), y2: py(best), stroke: '#2A5E9B', 'stroke-width': 5}));
      svg.appendChild(el('circle', {cx: sx((lo + hi) / 2), cy: py(best), r: 6, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
      svg.appendChild(el('line', {x1: sx(c), y1: py(metric(y, c)), x2: sx(c), y2: 296, stroke: '#C29E08', 'stroke-dasharray': '3 3'}));
      svg.appendChild(el('circle', {cx: sx(c), cy: py(metric(y, c)), r: 6, fill: '#8F7406', stroke: '#FFFFFF', 'stroke-width': 2}));
    } else {
      svg.appendChild(el('text', {x: 300, y: 190, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#9C0908'}, 'MAPE не определена: у студента 10 ноль баллов'));
    }
    svg.appendChild(el('line', {x1: sx(c), y1: 40, x2: sx(c), y2: 80, stroke: '#C29E08', 'stroke-width': 3}));
    y.forEach(function (v, i) {
      svg.appendChild(el('circle', {cx: sx(v), cy: 60, r: 9, fill: v >= 50 ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: sx(v), y: 64, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    var srt = y.slice().sort(function (a, b) { return a - b; });
    var mean = y.reduce(function (s, v) { return s + v; }, 0) / 10, med = (srt[4] + srt[5]) / 2;
    document.getElementById('qLiveCv').textContent = fmt(c, 1);
    document.getElementById('qLiveName').textContent = NAMES[mode] + ' при этом c';
    document.getElementById('qLiveVal').textContent = finite ? fmtv(metric(y, c)) : '∞';
    document.getElementById('qLiveBest').textContent = !finite ? '—' : (hi - lo < 0.3 ? fmt((lo + hi) / 2, 1) : 'от ' + fmt(lo, 1) + ' до ' + fmt(hi, 1));
    document.getElementById('qLiveMm').textContent = 'среднее ' + fmt(mean, 1) + ', медиана ' + fmt(med, 1);
    var qb = document.querySelector('#qLive [data-qbox]'); if (qb) qb.style.display = mode === 'q' ? '' : 'none';
  }
  C.addEventListener('input', update);
  if (QR) QR.addEventListener('input', function () { tau = +QR.value; document.getElementById('qLiveQv').textContent = fmt(tau, 2); update(); });
  document.querySelectorAll('#qLive [data-m]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.getAttribute('data-m');
      document.querySelectorAll('#qLive [data-m]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  document.querySelectorAll('#qLive [data-abs]').forEach(function (b) {
    b.addEventListener('click', function () { absent = b.getAttribute('data-abs') === '1';
      document.querySelectorAll('#qLive [data-abs]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  update();
})();
</script>


<p>
  В режиме MAPE лучшая константа 41 балл, ниже медианы. Если переключить студента 10 на 0 баллов, MAPE перестаёт
  существовать, а MAE и квантильная потеря считаются как обычно.
</p>


## Часть 7. Графики остатков

<p>
  Одно число не показывает, где модель ошибается. Возьмём синтетических студентов, устроенных как в статье про дерево
  регрессии: балл растёт с часами, падает с пропусками, а с 13 часов подготовки прыгает на 12 баллов. Шум
  в баллах 8, поэтому RMSE ниже примерно 8 не получит ни одна модель. Обе модели обучены на 400 студентах
  и проверены на 20 000.
</p>


<div class="cm-fig"><svg viewBox="0 0 760 330" role="img" aria-label="Остатки двух моделей в зависимости от часов подготовки"><rect x="0" y="0" width="760" height="330" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><rect x="70" y="50" width="300" height="200" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="70" y="36" font-size="14" fill="#111111" text-anchor="start" font-weight="700">линейная регрессия</text><text x="370" y="36" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">MAE 6,7, RMSE 8,5</text><line x1="70" y1="150" x2="370" y2="150" stroke="#5E5850" stroke-width="1.2"/><line x1="247.27" y1="50" x2="247.27" y2="250" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 4"/><text x="251.27" y="64" font-size="11" fill="#5E5850" text-anchor="start" font-weight="400">13 ч</text><circle cx="251.4" cy="96.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="268.4" cy="146.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="246.3" cy="236.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="119.0" cy="120.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="346.1" cy="168.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="153.2" cy="145.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="217.7" cy="183.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="275.5" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="353.8" cy="150.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="173.6" cy="196.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="302.4" cy="79.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="356.2" cy="100.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="155.9" cy="187.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="173.4" cy="146.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="267.9" cy="186.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="210.3" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="140.0" cy="155.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="114.9" cy="110.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="337.5" cy="110.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="232.5" cy="172.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="167.4" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="183.3" cy="136.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="158.0" cy="162.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="209.2" cy="157.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="80.5" cy="144.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="357.3" cy="151.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="72.3" cy="132.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="259.5" cy="69.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="87.6" cy="159.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="227.1" cy="186.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="124.1" cy="184.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="178.5" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="344.4" cy="141.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="192.7" cy="139.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="205.8" cy="212.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="296.0" cy="157.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="359.8" cy="137.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="351.6" cy="142.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="332.9" cy="68.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="220.7" cy="166.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="100.1" cy="128.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="129.3" cy="177.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="206.0" cy="156.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="139.5" cy="146.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="222.7" cy="194.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="153.6" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="335.8" cy="155.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="321.2" cy="148.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="177.9" cy="156.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="343.5" cy="168.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="80.1" cy="161.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="154.4" cy="163.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="91.0" cy="132.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="112.8" cy="119.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="227.5" cy="188.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="191.6" cy="170.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="169.4" cy="126.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="222.3" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="303.3" cy="120.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="213.9" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="304.1" cy="159.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="252.3" cy="131.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="270.2" cy="105.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="95.6" cy="132.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="189.6" cy="127.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="229.0" cy="175.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="178.3" cy="131.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="252.2" cy="106.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="82.3" cy="107.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="150.2" cy="169.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="197.4" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="207.3" cy="198.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="82.1" cy="135.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="233.4" cy="152.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="276.6" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="326.5" cy="137.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="137.0" cy="160.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="329.0" cy="142.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="84.9" cy="112.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="224.0" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="192.6" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="180.7" cy="172.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="244.7" cy="202.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="190.7" cy="140.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="366.9" cy="126.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="255.9" cy="123.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="155.4" cy="120.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="180.7" cy="204.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="276.6" cy="147.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="118.7" cy="146.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="259.1" cy="161.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="81.6" cy="148.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="309.6" cy="91.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="152.2" cy="139.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="130.5" cy="116.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="356.0" cy="150.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="241.1" cy="165.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="347.9" cy="147.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="166.3" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="364.1" cy="110.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="163.0" cy="181.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="113.8" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="168.5" cy="129.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="360.9" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="197.4" cy="130.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="213.5" cy="94.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="339.3" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="136.3" cy="127.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="313.5" cy="148.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="193.4" cy="167.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="244.0" cy="167.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="341.6" cy="142.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="154.3" cy="181.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="176.2" cy="141.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="284.5" cy="109.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="251.0" cy="95.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="97.7" cy="130.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="122.8" cy="105.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="268.1" cy="110.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="109.8" cy="188.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="181.8" cy="108.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="364.8" cy="153.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="235.3" cy="168.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="79.3" cy="123.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="292.7" cy="198.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="164.5" cy="157.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="294.0" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="137.8" cy="128.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="160.0" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="265.8" cy="127.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="83.4" cy="158.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="364.8" cy="134.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="267.0" cy="135.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="233.0" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="177.7" cy="92.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="129.9" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="162.5" cy="185.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="113.2" cy="154.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="311.2" cy="186.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="270.0" cy="91.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="87.7" cy="136.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="136.7" cy="124.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="284.8" cy="170.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="143.0" cy="123.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="176.6" cy="170.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="184.1" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="227.5" cy="155.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="192.5" cy="147.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="222.7" cy="193.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="269.6" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="85.8" cy="100.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="367.8" cy="180.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="269.1" cy="103.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="211.3" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="184.0" cy="157.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="310.0" cy="154.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="95.9" cy="167.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="127.0" cy="175.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="117.9" cy="168.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="288.5" cy="100.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="328.5" cy="137.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="88.3" cy="144.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="196.1" cy="142.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="189.5" cy="173.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="168.9" cy="135.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="360.3" cy="189.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="173.8" cy="173.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="253.3" cy="87.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="367.3" cy="192.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="163.1" cy="163.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="362.1" cy="153.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="307.8" cy="125.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="115.0" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="166.5" cy="142.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="258.7" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="86.5" cy="118.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="87.0" cy="145.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="208.7" cy="190.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="237.6" cy="167.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="126.7" cy="125.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="179.5" cy="162.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="167.0" cy="111.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="78.9" cy="182.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="232.1" cy="156.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="98.1" cy="161.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="223.7" cy="164.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="334.5" cy="114.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="244.8" cy="208.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="180.2" cy="171.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="99.2" cy="184.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="241.3" cy="182.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="97.4" cy="171.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="102.6" cy="196.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="100.5" cy="128.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="342.9" cy="139.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="318.3" cy="205.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="132.6" cy="148.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="162.7" cy="144.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="361.7" cy="226.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="142.3" cy="175.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="337.0" cy="148.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="97.8" cy="142.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="163.3" cy="122.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="180.7" cy="174.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="303.6" cy="102.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="159.5" cy="202.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="208.8" cy="151.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="72.3" cy="166.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="90.7" cy="143.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="142.1" cy="191.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="113.0" cy="137.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="232.5" cy="186.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="122.4" cy="199.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="117.7" cy="211.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="189.7" cy="172.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="360.6" cy="101.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="344.5" cy="113.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="177.5" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="206.1" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="164.8" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="349.3" cy="188.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="285.3" cy="122.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="217.0" cy="235.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="211.3" cy="165.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="245.9" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="121.3" cy="152.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="173.4" cy="182.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="329.1" cy="138.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="183.7" cy="159.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="296.6" cy="134.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="269.9" cy="156.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="100.7" cy="157.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="168.3" cy="196.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="105.6" cy="156.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="79.0" cy="179.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="366.3" cy="183.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="232.5" cy="174.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="287.4" cy="169.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="103.5" cy="165.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="167.9" cy="144.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="122.0" cy="175.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="277.8" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="74.9" cy="152.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="144.5" cy="151.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="285.7" cy="184.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="239.0" cy="169.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="120.3" cy="172.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="201.5" cy="178.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="302.8" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="280.1" cy="150.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="342.6" cy="184.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="265.0" cy="171.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="85.8" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="301.7" cy="115.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="226.5" cy="163.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="260.1" cy="159.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="355.5" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="201.7" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="97.7" cy="124.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="70.0" cy="115.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><path d="M76.8 133.9 L90.5 137.1 L104.1 143.2 L117.7 145.0 L131.4 146.4 L145.0 150.8 L158.6 153.4 L172.3 155.8 L185.9 158.5 L199.5 161.8 L213.2 163.8 L226.8 169.1 L240.5 170.4 L254.1 134.6 L267.7 137.4 L281.4 139.6 L295.0 142.6 L308.6 144.6 L322.3 147.6 L335.9 151.2 L349.5 154.1 L363.2 155.5" fill="none" stroke="#3576C0" stroke-width="3.2"/><text x="64" y="254" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−30</text><text x="64" y="204" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−15</text><text x="64" y="154" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="64" y="104" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">15</text><text x="64" y="54" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">30</text><text x="70" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><text x="138.18" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">5</text><text x="206.36" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><text x="274.55" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">15</text><text x="342.73" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><text x="220" y="286" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><rect x="440" y="50" width="300" height="200" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="440" y="36" font-size="14" fill="#111111" text-anchor="start" font-weight="700">дерево глубины 4</text><text x="740" y="36" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">MAE 7,5, RMSE 9,4</text><line x1="440" y1="150" x2="740" y2="150" stroke="#5E5850" stroke-width="1.2"/><line x1="617.27" y1="50" x2="617.27" y2="250" stroke="#5E5850" stroke-width="1" stroke-dasharray="4 4"/><text x="621.27" y="64" font-size="11" fill="#5E5850" text-anchor="start" font-weight="400">13 ч</text><circle cx="621.4" cy="132.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="638.4" cy="174.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="489.0" cy="111.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="716.1" cy="161.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="523.2" cy="127.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="587.7" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="645.5" cy="170.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="723.8" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="543.6" cy="192.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="672.4" cy="63.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="726.2" cy="102.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="525.9" cy="203.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="543.4" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="637.9" cy="200.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="580.3" cy="120.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="510.0" cy="148.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="484.9" cy="110.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="707.5" cy="131.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="602.5" cy="144.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="537.4" cy="162.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="553.3" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="528.0" cy="166.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="579.2" cy="129.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="450.5" cy="186.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="727.3" cy="134.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="442.3" cy="121.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="629.5" cy="106.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="457.6" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="597.1" cy="164.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="494.1" cy="183.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="548.5" cy="168.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="714.4" cy="133.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="562.7" cy="111.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="575.8" cy="202.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="666.0" cy="144.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="729.8" cy="109.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="721.6" cy="142.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="702.9" cy="103.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="590.7" cy="147.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="470.1" cy="171.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="499.3" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="576.0" cy="143.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="509.5" cy="120.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="592.7" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="523.6" cy="137.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="705.8" cy="173.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="691.2" cy="118.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="547.9" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="713.5" cy="190.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="450.1" cy="129.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="524.4" cy="189.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="461.0" cy="185.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="482.8" cy="125.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="597.5" cy="158.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="561.6" cy="173.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="539.4" cy="118.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="592.3" cy="134.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="673.3" cy="109.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="583.9" cy="124.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="674.1" cy="201.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="622.3" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="640.2" cy="132.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="465.6" cy="163.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="559.6" cy="131.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="599.0" cy="142.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="548.3" cy="139.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="622.2" cy="135.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="452.3" cy="135.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="520.2" cy="205.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="567.4" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="577.3" cy="167.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="452.1" cy="176.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="603.4" cy="111.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="646.6" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="696.5" cy="148.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="507.0" cy="132.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="699.0" cy="151.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="454.9" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="594.0" cy="131.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="562.6" cy="138.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="550.7" cy="185.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="614.7" cy="160.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="560.7" cy="140.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="736.9" cy="104.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="625.9" cy="141.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="525.4" cy="124.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="550.7" cy="205.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="646.6" cy="143.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="488.7" cy="162.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="629.1" cy="189.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="451.6" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="679.6" cy="122.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="522.2" cy="113.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="500.5" cy="104.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="726.0" cy="156.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="611.1" cy="131.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="717.9" cy="139.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="536.3" cy="164.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="734.1" cy="99.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="533.0" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="483.8" cy="196.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="538.5" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="730.9" cy="140.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="567.4" cy="101.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="583.5" cy="85.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="709.3" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="506.3" cy="95.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="683.5" cy="135.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="563.4" cy="160.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="614.0" cy="137.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="711.6" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="524.3" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="546.2" cy="145.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="654.5" cy="119.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="621.0" cy="112.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="467.7" cy="174.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="492.8" cy="101.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="638.1" cy="139.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="479.8" cy="227.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="551.8" cy="94.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="734.8" cy="143.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="605.3" cy="130.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="449.3" cy="165.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="662.7" cy="184.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="534.5" cy="176.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="664.0" cy="125.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="507.8" cy="141.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="530.0" cy="128.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="635.8" cy="133.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="453.4" cy="181.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="734.8" cy="139.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="637.0" cy="153.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="603.0" cy="90.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="547.7" cy="97.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="499.9" cy="151.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="532.5" cy="200.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="483.2" cy="167.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="681.2" cy="163.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="640.0" cy="122.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="457.7" cy="149.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="506.7" cy="135.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="654.8" cy="180.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="513.0" cy="125.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="546.6" cy="179.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="554.1" cy="151.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="597.5" cy="116.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="562.5" cy="119.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="592.7" cy="156.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="639.6" cy="140.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="455.8" cy="57.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="737.8" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="639.1" cy="111.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="581.3" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="554.0" cy="138.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="680.0" cy="181.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="465.9" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="497.0" cy="166.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="487.9" cy="180.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="658.5" cy="85.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="698.5" cy="146.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="458.3" cy="169.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="566.1" cy="144.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="559.5" cy="167.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="538.9" cy="142.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="730.3" cy="188.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="543.8" cy="192.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="623.3" cy="102.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="737.3" cy="171.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="533.1" cy="136.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="732.1" cy="134.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="677.8" cy="129.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="485.0" cy="133.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="536.5" cy="150.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="628.7" cy="153.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="456.5" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="457.0" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="578.7" cy="158.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="607.6" cy="133.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="496.7" cy="134.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="549.5" cy="158.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="537.0" cy="112.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="448.9" cy="203.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="602.1" cy="125.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="468.1" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="593.7" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="704.5" cy="134.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="614.8" cy="172.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="550.2" cy="166.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="469.2" cy="193.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="611.3" cy="155.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="467.4" cy="203.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="472.6" cy="203.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="470.5" cy="128.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="712.9" cy="162.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="688.3" cy="177.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="502.6" cy="133.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="532.7" cy="116.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="731.7" cy="227.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="512.3" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="707.0" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="467.8" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="533.3" cy="90.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="550.7" cy="182.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="673.6" cy="79.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="529.5" cy="158.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="578.8" cy="139.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="442.3" cy="165.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="460.7" cy="185.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="512.1" cy="177.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="483.0" cy="150.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="602.5" cy="159.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="492.4" cy="211.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="487.7" cy="192.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="559.7" cy="174.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="730.6" cy="99.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="714.5" cy="123.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="547.5" cy="145.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="576.1" cy="153.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="534.8" cy="166.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="719.3" cy="196.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="655.3" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="587.0" cy="208.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="581.3" cy="144.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="615.9" cy="174.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="491.3" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="543.4" cy="183.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="699.1" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="553.7" cy="161.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="666.6" cy="135.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="639.9" cy="178.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="470.7" cy="181.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="538.3" cy="215.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="475.6" cy="159.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="449.0" cy="137.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="736.3" cy="154.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="602.5" cy="145.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="657.4" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="473.5" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="537.9" cy="143.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="492.0" cy="189.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="647.8" cy="156.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="444.9" cy="121.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="514.5" cy="141.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="655.7" cy="175.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="609.0" cy="136.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="490.3" cy="185.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="571.5" cy="173.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="672.8" cy="128.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="650.1" cy="152.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="712.6" cy="195.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="635.0" cy="181.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="455.8" cy="142.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="671.7" cy="104.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="596.5" cy="131.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="630.1" cy="181.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="725.5" cy="158.3" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="571.7" cy="127.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="467.7" cy="144.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="440.0" cy="103.7" r="2.2" fill="#A8A296" fill-opacity="0.55"/><path d="M446.8 142.1 L460.5 156.6 L474.1 157.3 L487.7 148.9 L501.4 139.2 L515.0 147.9 L528.6 149.0 L542.3 162.4 L555.9 155.5 L569.5 147.7 L583.2 140.0 L596.8 134.7 L610.5 137.1 L624.1 159.0 L637.7 152.6 L651.4 144.4 L665.0 137.0 L678.6 146.2 L692.3 150.8 L705.9 159.0 L719.5 152.0 L733.2 142.6" fill="none" stroke="#C29E08" stroke-width="3.2"/><text x="434" y="254" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−30</text><text x="434" y="204" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−15</text><text x="434" y="154" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="434" y="104" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">15</text><text x="434" y="54" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">30</text><text x="440" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><text x="508.18" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">5</text><text x="576.36" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><text x="644.55" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">15</text><text x="712.73" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><text x="590" y="286" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="22" y="150" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 22 150)">остаток, баллы</text><text x="380" y="318" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">Серые точки — отдельные студенты, линия — средний остаток при данном числе часов.</text></svg></div>


<p>
  По числам линейная регрессия лучше: MAE 6,7 против 7,5, <span class="math-inline" data-tex="R^2"></span> 0,857 против 0,825. График остатков от часов
  показывает, чего числа не видят. У прямой средний остаток идёт пилой: она переоценивает студентов перед 13 часами
  (до <span class="math-inline" data-tex="-6"></span> баллов) и недооценивает сразу после (до <span class="math-inline" data-tex="+5"></span>). Прыжок на 12 баллов прямая выразить не может и размазывает
  по всему диапазону. У дерева остатки тоже не нулевые, но без общего наклона: колебания на ±4 балла от ступенек.
</p>

<p>
  У модели без систематических ошибок средний остаток держится около нуля при любом значении признака. Если видна
  закономерность, её можно добавить в модель. Здесь достаточно дать линейной регрессии признак «13 часов и больше».
  Тот же график стоит строить по прогнозу (остаток против <span class="math-inline" data-tex="\hat y"></span>): если разброс растёт вместе с прогнозом,
  ошибки неоднородны, и RMSE по всей выборке смешивает точные и неточные области.
</p>


## Часть 8. Выбросы: метрика и функция потерь

<p>
  Добавим в синтетический поток неявки: около 5 % студентов не пришли и получили 0. Обучим три линейные модели
  на 400 студентах, которые отличаются только тем, что минимизируют: квадрат ошибки, модуль или Huber
  (квадрат для малых остатков и модуль для больших). Проверка на 20 000 студентах, из них не пришли 4,8 %.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Что минимизирует модель</th><th>MAE, все</th><th>RMSE, все</th><th>MAE, пришедшие</th><th>RMSE, пришедшие</th></tr>
  <tr><td>квадрат (обычная линейная регрессия)</td><td>8,93</td><td>13,06</td><td>7,45</td><td>9,38</td></tr>
  <tr><td>Huber</td><td>8,51</td><td>13,05</td><td>6,89</td><td>8,68</td></tr>
  <tr><td>модуль (медианная регрессия)</td><td>8,48</td><td>13,10</td><td>6,84</td><td>8,61</td></tr>
</table></div>


<p>
  На всех студентах по RMSE чуть лучше модель на квадрате, по MAE — модель на модуле. Каждая модель выигрывает
  по той метрике, которую минимизировала. На студентах, которые пришли, модель на модуле точнее заметно: MAE 6,84
  против 7,45. Нули неявок тянут плоскость наименьших квадратов вниз: коэффициент при часах у неё 2,73, у медианной регрессии 3,06.
  Медианная регрессия почти не замечает 5 % нулей.
</p>

<p>
  Отсюда два вывода. Обучать модель лучше на той потере, по которой её потом будут оценивать. И до выбора метрики
  надо решить, входят ли неявки в задачу. Если входят, это отдельный вопрос «придёт ли студент», и его лучше решать
  классификатором, а баллы предсказывать только для пришедших.
</p>


## Часть 9. Как выбрать метрику


<div class="dt-table"><table class="shape-table">
  <tr><th>Ситуация</th><th>На что смотреть</th></tr>
  <tr><td>каждая единица ошибки стоит одинаково, нужен понятный ответ «в среднем на сколько»</td><td>MAE</td></tr>
  <tr><td>крупный промах намного хуже нескольких мелких</td><td>RMSE</td></tr>
  <tr><td>в данных есть выбросы, которые не должны решать оценку</td><td>MAE, медиана модулей, Huber при обучении</td></tr>
  <tr><td>нужно сравнить задачи с разными единицами или объяснить долю разброса</td><td><span class="math-inline" data-tex="R^2"></span> рядом с MAE или RMSE</td></tr>
  <tr><td>ответы одного масштаба без нулей, важна относительная ошибка</td><td>MAPE, иначе WAPE</td></tr>
  <tr><td>недооценка и переоценка стоят по-разному, нужен интервал</td><td>квантильная потеря</td></tr>
  <tr><td>важен худший случай</td><td>максимальная ошибка</td></tr>
</table></div>


<p>
  Общие правила те же, что для классификации: считать метрики на данных, которых модель не видела, и указывать
  рядом значение у простой модели. Для регрессии это константа: среднее для RMSE и <span class="math-inline" data-tex="R^2"></span>, медиана для MAE.
</p>


## Часть 10. Код: метрики с нуля и в sklearn

### Метрики на чистом Python

<p>
  Прогнозы дерева округлены до трёх знаков.
</p>


```python
from math import sqrt

# настоящие баллы и прогноз дерева глубины 2 (leave-one-out)
y = [30, 22, 41, 58, 35, 47, 72, 61, 80, 84]
pred = [48.667, 38.25, 26.0, 41.0, 48.667, 32.0, 45.25, 72.0, 66.5, 76.0]
n = len(y)
e = [a - b for a, b in zip(y, pred)]                       # остатки


def mae(e):
    return sum(abs(v) for v in e) / len(e)


def mse(e):
    return sum(v * v for v in e) / len(e)


def r2(y, e):
    mean = sum(y) / len(y)
    sst = sum((v - mean) ** 2 for v in y)                  # разброс вокруг среднего
    return 1 - sum(v * v for v in e) / sst


def mape(y, e):
    return sum(abs(v) / t for v, t in zip(e, y)) / len(y)  # упадёт, если в y есть ноль


def wape(y, e):
    return sum(abs(v) for v in e) / sum(abs(t) for t in y)


def pinball(e, tau):
    """Квантильная потеря: недооценка стоит tau, переоценка 1 - tau за балл."""
    return sum(max(tau * v, (tau - 1) * v) for v in e) / len(e)


print('смещение', round(sum(e) / n, 2))
print('MAE', round(mae(e), 2), ' MSE', round(mse(e), 1), ' RMSE', round(sqrt(mse(e)), 2))
print('R2', round(r2(y, e), 3), ' MAPE', round(mape(y, e), 3), ' WAPE', round(wape(y, e), 3))
print('медиана |e|', sorted(abs(v) for v in e)[4:6], ' max |e|', round(max(abs(v) for v in e), 2))
print('pinball 0.9', round(pinball(e, 0.9), 2), ' pinball 0.5 = MAE / 2:', round(pinball(e, 0.5), 2))
```

```text
смещение 3.57
MAE 15.48  MSE 262.1  RMSE 16.19
R2 0.366  MAPE 0.355  WAPE 0.292
медиана |e| [15.0, 15.0]  max |e| 26.75
pinball 0.9 9.17  pinball 0.5 = MAE / 2: 7.74
```



### То же в sklearn

<p>
  <code>root_mean_squared_error</code> появилась в sklearn 1.4, раньше писали
  <code>mean_squared_error(..., squared=False)</code>. В <code>scoring</code> для <code>cross_val_score</code>
  и <code>GridSearchCV</code> метрики ошибок записаны со знаком минус (<code>neg_mean_absolute_error</code>,
  <code>neg_root_mean_squared_error</code>), потому что подбор всегда ищет максимум. Перед отчётом знак убирают.
</p>


```python
import numpy as np
from sklearn.metrics import (mean_absolute_error, mean_squared_error, root_mean_squared_error, r2_score,
                             mean_absolute_percentage_error, median_absolute_error, max_error, mean_pinball_loss)
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import cross_val_score, LeaveOneOut

y = [30, 22, 41, 58, 35, 47, 72, 61, 80, 84]
pred = [48.667, 38.25, 26.0, 41.0, 48.667, 32.0, 45.25, 72.0, 66.5, 76.0]

print(round(mean_absolute_error(y, pred), 2), round(mean_squared_error(y, pred), 1), round(root_mean_squared_error(y, pred), 2))
print(round(r2_score(y, pred), 3), round(mean_absolute_percentage_error(y, pred), 3))
print(median_absolute_error(y, pred), max_error(y, pred), round(mean_pinball_loss(y, pred, alpha=0.9), 2))

# в scoring метрики ошибок записаны со знаком минус: GridSearchCV всегда максимизирует
X = [[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]]
s = cross_val_score(DecisionTreeRegressor(max_depth=2, random_state=0), X, y, cv=LeaveOneOut(),
                    scoring='neg_mean_absolute_error')
print(np.round(s, 1), round(-s.mean(), 2))
```

```text
15.48 262.1 16.19
0.366 0.355
15.0 26.75 9.17
[-18.7 -16.2 -15.  -17.  -13.7 -15.  -26.8 -11.  -13.5  -8. ] 15.48
```



### Выбросы и функция потерь

<p>
  Эксперимент из части 8.
</p>


```python
import numpy as np
from sklearn.linear_model import LinearRegression, HuberRegressor, QuantileRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error


def stream(n, rng, absent=0.05):
    """Синтетические студенты; около 5 % не пришли на экзамен и получили 0."""
    h = rng.uniform(0, 22, n)
    a = rng.uniform(0, 10, n)
    mu = 28 + 2.2 * h - 3 * a + 12 * (h >= 13)
    y = np.clip(mu + rng.normal(0, 8, n), 0, 100)
    miss = rng.uniform(size=n) < absent
    y[miss] = 0
    return np.c_[h, a], y, miss


rng = np.random.default_rng(1)
X_train, y_train, _ = stream(400, rng)
X_test, y_test, miss = stream(20000, rng)
came = ~miss

models = {'квадрат (MSE)': LinearRegression(),
          'Huber': HuberRegressor(epsilon=1.35, max_iter=1000),
          'модуль (MAE)': QuantileRegressor(quantile=0.5, alpha=0, solver='highs')}
for name, model in models.items():
    p = model.fit(X_train, y_train).predict(X_test)
    print(f'{name:14s} все: MAE {mean_absolute_error(y_test, p):.2f}  RMSE {root_mean_squared_error(y_test, p):.2f}'
          f' | пришедшие: MAE {mean_absolute_error(y_test[came], p[came]):.2f}  RMSE {root_mean_squared_error(y_test[came], p[came]):.2f}')
```

```text
квадрат (MSE)  все: MAE 8.93  RMSE 13.06 | пришедшие: MAE 7.45  RMSE 9.38
Huber          все: MAE 8.51  RMSE 13.05 | пришедшие: MAE 6.89  RMSE 8.68
модуль (MAE)   все: MAE 8.48  RMSE 13.10 | пришедшие: MAE 6.84  RMSE 8.61
```


## Часть 11. Что получилось


<div class="dt-table"><table class="shape-table">
  <tr><th>Метрика</th><th>Что измеряет</th><th>У дерева на десяти студентах</th></tr>
  <tr><td>смещение</td><td>средний остаток со знаком</td><td>3,57</td></tr>
  <tr><td>MAE</td><td>средний модуль остатка</td><td>15,5 балла</td></tr>
  <tr><td>RMSE</td><td>корень из среднего квадрата</td><td>16,2 балла</td></tr>
  <tr><td>медиана модулей</td><td>типичный промах, нечувствительный к выбросам</td><td>15 баллов</td></tr>
  <tr><td><span class="math-inline" data-tex="R^2"></span></td><td>долю квадратичного разброса, которую убрала модель</td><td>0,366</td></tr>
  <tr><td>MAPE</td><td>средний относительный промах</td><td>35,5 %</td></tr>
  <tr><td>WAPE</td><td>сумма промахов к сумме ответов</td><td>29,2 %</td></tr>
  <tr><td>квантильная потеря, <span class="math-inline" data-tex="\tau = 0{,}9"></span></td><td>промахи с разной ценой вверх и вниз</td><td>9,17</td></tr>
</table></div>


### Что важно уметь восстановить по памяти

<ul>
  <li>Остаток <span class="math-inline" data-tex="e = y - \hat y"></span>; среднее остатков — смещение, оно не говорит о размере ошибок.</li>
  <li><span class="math-inline" data-tex="\text{MAE} = \frac{1}{n}\sum|e_i|"></span>, <span class="math-inline" data-tex="\text{RMSE} = \sqrt{\frac{1}{n}\sum e_i^2}"></span>; обе в единицах ответа,
    <span class="math-inline" data-tex="\text{RMSE} \ge \text{MAE}"></span>, и разрыв растёт с неравномерностью ошибок.</li>
  <li>Квадрат ошибки минимизирует среднее, модуль — медиана, квантильная потеря с <span class="math-inline" data-tex="\tau"></span> — <span class="math-inline" data-tex="\tau"></span>-квантиль.</li>
  <li><span class="math-inline" data-tex="R^2 = 1 - \text{SSE}/\text{SST} = 1 - \text{MSE}/\text{Var}(y)"></span>; на тесте бывает отрицательным
    и зависит от разброса ответов в тесте.</li>
  <li>MAPE не определена при нулевых ответах и тянет прогноз вниз; WAPE <span class="math-inline" data-tex="= \sum|e_i| / \sum|y_i|"></span> этих проблем не имеет.</li>
  <li>График остатков от признаков и от прогноза показывает систематические ошибки, которых не видно в одном числе.</li>
  <li>Модель обучают на той потере, которой её будут оценивать.</li>
</ul>

<p class="tiny">
  Источники: R. Hyndman, A. Koehler, «Another look at measures of forecast accuracy», International Journal
  of Forecasting, 2006; T. Gneiting, «Making and Evaluating Point Forecasts», Journal of the American Statistical
  Association, 2011; R. Koenker, G. Bassett, «Regression Quantiles», Econometrica, 1978; P. Huber, «Robust Estimation
  of a Location Parameter», Annals of Mathematical Statistics, 1964; документация scikit-learn, раздел «Regression metrics».
</p>

