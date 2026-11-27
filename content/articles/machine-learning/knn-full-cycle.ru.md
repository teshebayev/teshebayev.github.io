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

<p class="lead">
  Метод ближайших соседей (kNN) отвечает на вопрос о новом объекте так: находит в данных самые похожие объекты
  и смотрит, какие ответы были у них. Разберём его на тех же десяти студентах: расстояния, голосование,
  выбор k, масштаб признаков, регрессию и то, почему метод плохо работает при многих признаках.
</p>

<p>
  Студенты те же, что в <a href="article.html?slug=decision-tree-full-cycle">статье про дерево решений</a>
  и <a href="article.html?slug=random-forest-full-cycle">про случайный лес</a>: часы подготовки, пропуски и итог экзамена.
  Баллы взяты из <a href="article.html?slug=regression-tree-full-cycle">статьи про дерево регрессии</a>. Новые студенты
  А и Б тоже оттуда: лес отвечал на них «сдаст».
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Часы подготовки</th><th>Пропуски</th><th>Сдал</th><th>Баллы</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>нет</td><td>30</td></tr>
  <tr><td>2</td><td>4</td><td>7</td><td>нет</td><td>22</td></tr>
  <tr><td>3</td><td>6</td><td>4</td><td>нет</td><td>41</td></tr>
  <tr><td>4</td><td>8</td><td>1</td><td>да</td><td>58</td></tr>
  <tr><td>5</td><td>10</td><td>8</td><td>нет</td><td>35</td></tr>
  <tr><td>6</td><td>12</td><td>5</td><td>нет</td><td>47</td></tr>
  <tr><td>7</td><td>14</td><td>2</td><td>да</td><td>72</td></tr>
  <tr><td>8</td><td>16</td><td>6</td><td>да</td><td>61</td></tr>
  <tr><td>9</td><td>18</td><td>3</td><td>да</td><td>80</td></tr>
  <tr><td>10</td><td>20</td><td>4</td><td>да</td><td>84</td></tr>
  <tr><td>А</td><td>11</td><td>1</td><td>?</td><td>?</td></tr>
  <tr><td>Б</td><td>15</td><td>7</td><td>?</td><td>?</td></tr>
</table></div>

## Часть 1. Идея: спросить у похожих


<div class="stage" id="stageIdea" tabindex="0">
  <div class="stage-figure">
<svg id="knnIdea" viewBox="0 0 960 420" role="img" aria-label="Студенты на плоскости часов и пропусков и соседи нового студента"><style>#knnIdea { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="420" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<defs><clipPath id="ideaClip"><rect x="64.0" y="97.0" width="561.0" height="255.0"/></clipPath></defs>
<g data-key="plane"><rect x="64" y="97" width="561" height="255" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="64" y1="352" x2="64" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="64" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="115" y1="352" x2="115" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="115" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">2</text><line x1="166" y1="352" x2="166" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="166" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="217" y1="352" x2="217" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="217" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">6</text><line x1="268" y1="352" x2="268" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="268" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="319" y1="352" x2="319" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="319" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">10</text><line x1="370" y1="352" x2="370" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="370" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="421" y1="352" x2="421" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="421" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">14</text><line x1="472" y1="352" x2="472" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="472" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="523" y1="352" x2="523" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="523" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">18</text><line x1="574" y1="352" x2="574" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="574" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="625" y1="352" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="625" y="370" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">22</text><line x1="64" y1="352" x2="625" y2="352" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="356" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="64" y1="301" x2="625" y2="301" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="305" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="64" y1="250" x2="625" y2="250" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="254" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="64" y1="199" x2="625" y2="199" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="203" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="64" y1="148" x2="625" y2="148" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="152" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="64" y1="97" x2="625" y2="97" stroke="#F1EEE6" stroke-width="1"/><text x="56" y="101" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="625" y="390" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы подготовки</text><text x="30" y="224.5" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 30.0 224.5)">пропуски</text></g>
<g data-key="c1" data-only="1"><circle cx="344.5" cy="326.5" r="76.5" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4" clip-path="url(#ideaClip)"/></g>
<g data-key="c3" data-only="1"><circle cx="344.5" cy="326.5" r="105.1" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4" clip-path="url(#ideaClip)"/></g>
<g data-key="c7" data-only="1"><circle cx="344.5" cy="326.5" r="185.6" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4" clip-path="url(#ideaClip)"/></g>
<g data-key="cb" data-only="1"><circle cx="446.5" cy="173.5" r="127.5" fill="#3576C0" fill-opacity="0.06" stroke="#3576C0" stroke-width="2" stroke-dasharray="6 4" clip-path="url(#ideaClip)"/></g>
<g data-key="spA" data-only="1"><line x1="344.5" y1="326.5" x2="115" y2="275.5" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="166" y2="173.5" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="217" y2="250" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="268" y2="326.5" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="319" y2="148" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="370" y2="224.5" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="421" y2="301" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="472" y2="199" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="523" y2="275.5" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="344.5" y1="326.5" x2="574" y2="250" stroke="#5E5850" stroke-width="1.4" stroke-dasharray="4 4"/></g>
<g data-key="s1" data-only="1"><line x1="344.5" y1="326.5" x2="268" y2="326.5" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="s3" data-only="1"><line x1="344.5" y1="326.5" x2="268" y2="326.5" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="421" y2="301" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="370" y2="224.5" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="s7" data-only="1"><line x1="344.5" y1="326.5" x2="268" y2="326.5" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="421" y2="301" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="370" y2="224.5" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="217" y2="250" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="319" y2="148" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="472" y2="199" stroke="#3576C0" stroke-width="2.4"/><line x1="344.5" y1="326.5" x2="523" y2="275.5" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="sb" data-only="1"><line x1="446.5" y1="173.5" x2="472" y2="199" stroke="#3576C0" stroke-width="2.4"/><line x1="446.5" y1="173.5" x2="370" y2="224.5" stroke="#3576C0" stroke-width="2.4"/><line x1="446.5" y1="173.5" x2="523" y2="275.5" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="st"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="h1" data-only="1"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="h3" data-only="1"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="h7" data-only="1"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="hb" data-only="1"><circle cx="115.0" cy="275.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="115" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="166.0" cy="173.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="166" y="178" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="217.0" cy="250.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="217" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="268.0" cy="326.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="268" y="331" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="319.0" cy="148.0" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="319" y="152.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="370.0" cy="224.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="370.0" cy="224.5" r="11" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="370" y="229" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="421.0" cy="301.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="421" y="305.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="472.0" cy="199.0" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="472.0" cy="199.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="472" y="203.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="523.0" cy="275.5" r="16" fill="none" stroke="#3576C0" stroke-width="2.6"/><circle cx="523.0" cy="275.5" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="523" y="280" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="574.0" cy="250.0" r="11" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="574" y="254.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="A"><circle cx="344.5" cy="326.5" r="12" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="344.5" y="331.5" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">А</text></g>
<g data-key="B" data-only="1"><circle cx="446.5" cy="173.5" r="12" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><text x="446.5" y="178.5" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">Б</text></g>
<g data-key="tA" data-only="1"><text x="652" y="48" font-size="14" fill="#111111" text-anchor="start" font-weight="700">Расстояния до студента А</text><text x="652" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">#</text><text x="692" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">расстояние</text><text x="802" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">итог</text><circle cx="660" cy="85" r="9" fill="#73B222"/><text x="660" y="89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="692" y="90" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,00</text><text x="802" y="90" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="110" r="9" fill="#73B222"/><text x="660" y="114" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="692" y="115" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,16</text><text x="802" y="115" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="135" r="9" fill="#C30B0A"/><text x="660" y="139" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="692" y="140" font-size="14" fill="#111111" text-anchor="start" font-weight="400">4,12</text><text x="802" y="140" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="160" r="9" fill="#C30B0A"/><text x="660" y="164" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="692" y="165" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,83</text><text x="802" y="165" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="185" r="9" fill="#C30B0A"/><text x="660" y="189" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="692" y="190" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="190" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="210" r="9" fill="#73B222"/><text x="660" y="214" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="692" y="215" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="215" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="235" r="9" fill="#73B222"/><text x="660" y="239" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="692" y="240" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,28</text><text x="802" y="240" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="260" r="9" fill="#C30B0A"/><text x="660" y="264" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="692" y="265" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="265" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="285" r="9" fill="#C30B0A"/><text x="660" y="289" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="692" y="290" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="290" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="310" r="9" fill="#73B222"/><text x="660" y="314" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="692" y="315" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,49</text><text x="802" y="315" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text></g>
<g data-key="tA1" data-only="1"><text x="652" y="48" font-size="14" fill="#111111" text-anchor="start" font-weight="700">Расстояния до студента А</text><text x="652" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">#</text><text x="692" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">расстояние</text><text x="802" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">итог</text><rect x="644" y="74" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="85" r="9" fill="#73B222"/><text x="660" y="89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="692" y="90" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,00</text><text x="802" y="90" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="110" r="9" fill="#73B222"/><text x="660" y="114" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="692" y="115" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,16</text><text x="802" y="115" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="135" r="9" fill="#C30B0A"/><text x="660" y="139" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="692" y="140" font-size="14" fill="#111111" text-anchor="start" font-weight="400">4,12</text><text x="802" y="140" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="160" r="9" fill="#C30B0A"/><text x="660" y="164" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="692" y="165" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,83</text><text x="802" y="165" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="185" r="9" fill="#C30B0A"/><text x="660" y="189" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="692" y="190" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="190" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="210" r="9" fill="#73B222"/><text x="660" y="214" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="692" y="215" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="215" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="235" r="9" fill="#73B222"/><text x="660" y="239" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="692" y="240" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,28</text><text x="802" y="240" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="260" r="9" fill="#C30B0A"/><text x="660" y="264" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="692" y="265" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="265" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="285" r="9" fill="#C30B0A"/><text x="660" y="289" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="692" y="290" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="290" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="310" r="9" fill="#73B222"/><text x="660" y="314" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="692" y="315" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,49</text><text x="802" y="315" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text></g>
<g data-key="tA3" data-only="1"><text x="652" y="48" font-size="14" fill="#111111" text-anchor="start" font-weight="700">Расстояния до студента А</text><text x="652" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">#</text><text x="692" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">расстояние</text><text x="802" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">итог</text><rect x="644" y="74" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="85" r="9" fill="#73B222"/><text x="660" y="89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="692" y="90" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,00</text><text x="802" y="90" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="99" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="110" r="9" fill="#73B222"/><text x="660" y="114" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="692" y="115" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,16</text><text x="802" y="115" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="124" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="135" r="9" fill="#C30B0A"/><text x="660" y="139" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="692" y="140" font-size="14" fill="#111111" text-anchor="start" font-weight="400">4,12</text><text x="802" y="140" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="160" r="9" fill="#C30B0A"/><text x="660" y="164" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="692" y="165" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,83</text><text x="802" y="165" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="185" r="9" fill="#C30B0A"/><text x="660" y="189" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="692" y="190" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="190" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="210" r="9" fill="#73B222"/><text x="660" y="214" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="692" y="215" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="215" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="235" r="9" fill="#73B222"/><text x="660" y="239" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="692" y="240" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,28</text><text x="802" y="240" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="260" r="9" fill="#C30B0A"/><text x="660" y="264" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="692" y="265" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="265" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="285" r="9" fill="#C30B0A"/><text x="660" y="289" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="692" y="290" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="290" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="310" r="9" fill="#73B222"/><text x="660" y="314" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="692" y="315" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,49</text><text x="802" y="315" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text></g>
<g data-key="tA7" data-only="1"><text x="652" y="48" font-size="14" fill="#111111" text-anchor="start" font-weight="700">Расстояния до студента А</text><text x="652" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">#</text><text x="692" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">расстояние</text><text x="802" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">итог</text><rect x="644" y="74" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="85" r="9" fill="#73B222"/><text x="660" y="89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="692" y="90" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,00</text><text x="802" y="90" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="99" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="110" r="9" fill="#73B222"/><text x="660" y="114" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="692" y="115" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,16</text><text x="802" y="115" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="124" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="135" r="9" fill="#C30B0A"/><text x="660" y="139" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="692" y="140" font-size="14" fill="#111111" text-anchor="start" font-weight="400">4,12</text><text x="802" y="140" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><rect x="644" y="149" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="160" r="9" fill="#C30B0A"/><text x="660" y="164" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="692" y="165" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,83</text><text x="802" y="165" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><rect x="644" y="174" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="185" r="9" fill="#C30B0A"/><text x="660" y="189" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="692" y="190" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="190" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><rect x="644" y="199" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="210" r="9" fill="#73B222"/><text x="660" y="214" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="692" y="215" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,07</text><text x="802" y="215" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="224" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="235" r="9" fill="#73B222"/><text x="660" y="239" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="692" y="240" font-size="14" fill="#111111" text-anchor="start" font-weight="400">7,28</text><text x="802" y="240" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="260" r="9" fill="#C30B0A"/><text x="660" y="264" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="692" y="265" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="265" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="285" r="9" fill="#C30B0A"/><text x="660" y="289" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="692" y="290" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="290" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="310" r="9" fill="#73B222"/><text x="660" y="314" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="692" y="315" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,49</text><text x="802" y="315" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text></g>
<g data-key="tB3" data-only="1"><text x="652" y="48" font-size="14" fill="#111111" text-anchor="start" font-weight="700">Расстояния до студента Б</text><text x="652" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">#</text><text x="692" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">расстояние</text><text x="802" y="68" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">итог</text><rect x="644" y="74" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="85" r="9" fill="#73B222"/><text x="660" y="89" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><text x="692" y="90" font-size="14" fill="#111111" text-anchor="start" font-weight="400">1,41</text><text x="802" y="90" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><rect x="644" y="99" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="110" r="9" fill="#C30B0A"/><text x="660" y="114" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><text x="692" y="115" font-size="14" fill="#111111" text-anchor="start" font-weight="400">3,61</text><text x="802" y="115" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><rect x="644" y="124" width="290" height="23" rx="4" fill="#EEF4FB" stroke="none" stroke-width="0"/><circle cx="660" cy="135" r="9" fill="#73B222"/><text x="660" y="139" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><text x="692" y="140" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,00</text><text x="802" y="140" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="160" r="9" fill="#C30B0A"/><text x="660" y="164" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><text x="692" y="165" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,10</text><text x="802" y="165" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="185" r="9" fill="#73B222"/><text x="660" y="189" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><text x="692" y="190" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,10</text><text x="802" y="190" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="210" r="9" fill="#73B222"/><text x="660" y="214" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text><text x="692" y="215" font-size="14" fill="#111111" text-anchor="start" font-weight="400">5,83</text><text x="802" y="215" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="235" r="9" fill="#73B222"/><text x="660" y="239" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><text x="692" y="240" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,22</text><text x="802" y="240" font-size="14" fill="#5F9420" text-anchor="start" font-weight="400">сдал</text><circle cx="660" cy="260" r="9" fill="#C30B0A"/><text x="660" y="264" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><text x="692" y="265" font-size="14" fill="#111111" text-anchor="start" font-weight="400">9,49</text><text x="802" y="265" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="285" r="9" fill="#C30B0A"/><text x="660" y="289" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><text x="692" y="290" font-size="14" fill="#111111" text-anchor="start" font-weight="400">11,00</text><text x="802" y="290" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text><circle cx="660" cy="310" r="9" fill="#C30B0A"/><text x="660" y="314" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><text x="692" y="315" font-size="14" fill="#111111" text-anchor="start" font-weight="400">13,60</text><text x="802" y="315" font-size="14" fill="#9C0908" text-anchor="start" font-weight="400">не сдал</text></g>
<g data-key="v1" data-only="1"><text x="344.5" y="83" font-size="16" fill="#2A5E9B" text-anchor="middle" font-weight="700">k = 1: ближайший сдал → «сдаст»</text></g>
<g data-key="v3" data-only="1"><text x="344.5" y="83" font-size="16" fill="#2A5E9B" text-anchor="middle" font-weight="700">k = 3: сдали двое из трёх → «сдаст»</text></g>
<g data-key="v7" data-only="1"><text x="344.5" y="83" font-size="16" fill="#2A5E9B" text-anchor="middle" font-weight="700">k = 7: сдали четверо из семи → «сдаст»</text></g>
<g data-key="vb" data-only="1"><text x="344.5" y="83" font-size="16" fill="#2A5E9B" text-anchor="middle" font-weight="700">Б, k = 3: сдали двое из трёх → «сдаст»</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="plane st A" data-focus="A">
      <div class="step-kicker">Шаг 1 · новый студент</div>
      <h4>Кто такой студент А</h4>
      <p>Десять студентов из прошлых статей: по горизонтали часы подготовки, по вертикали пропуски, зелёные сдали, красные нет. Белый кружок — новый студент А: 11 часов подготовки, 1 пропуск.</p>
<p>Дерево решений задавало про такого студента вопросы. Метод ближайших соседей (k nearest neighbors, kNN) поступает проще: находит студентов, которые больше всего на него похожи, и смотрит, сдали ли они.</p>
    </div>
    <div class="step-panel" data-on="plane spA st A tA" data-focus="spA tA">
      <div class="step-kicker">Шаг 2 · расстояния</div>
      <h4>Похожесть — это расстояние</h4>
      <p>Похожесть меряют расстоянием на этой плоскости. До студента 4 (8 часов, 1 пропуск): <span class="math-inline" data-tex="\sqrt{(11 - 8)^2 + (1 - 1)^2} = 3"></span>. До студента 7 (14 часов, 2 пропуска): <span class="math-inline" data-tex="\sqrt{3^2 + 1^2} \approx 3{,}16"></span>.</p>
<p>Справа все десять расстояний по возрастанию. Плоскость нарисована в одном масштабе по обеим осям, поэтому расстояние на картинке совпадает с расстоянием в формуле.</p>
    </div>
    <div class="step-panel" data-on="plane c1 s1 st h1 A tA1 v1" data-focus="c1 h1 tA1 v1">
      <div class="step-kicker">Шаг 3 · k = 1</div>
      <h4>Один ближайший сосед</h4>
      <p>При <span class="math-inline" data-tex="k = 1"></span> ответ берётся у самого похожего студента. Это студент 4: при 8 часах и одном пропуске он сдал. Значит, «сдаст».</p>
<p>Пунктирный круг проходит через ближайшего соседа: внутри него никого больше нет.</p>
    </div>
    <div class="step-panel" data-on="plane c3 s3 st h3 A tA3 v3" data-focus="c3 h3 tA3 v3">
      <div class="step-kicker">Шаг 4 · k = 3</div>
      <h4>Три соседа голосуют</h4>
      <p>При <span class="math-inline" data-tex="k = 3"></span> круг расширяется до третьего соседа. Внутри студенты 4 и 7, которые сдали, и студент 6, который нет: 12 часов, но 5 пропусков. Два голоса против одного: «сдаст».</p>
<p>Один сосед может оказаться случайным исключением. Несколько соседей сглаживают такие случайности, и это главный рычаг метода.</p>
    </div>
    <div class="step-panel" data-on="plane c7 s7 st h7 A tA7 v7" data-focus="c7 h7 tA7 v7">
      <div class="step-kicker">Шаг 5 · k = 7</div>
      <h4>Семь соседей</h4>
      <p>При <span class="math-inline" data-tex="k = 7"></span> в круг попадают и студенты 3 и 9, у которых 6 и 18 часов подготовки, совсем не похожие на А. Счёт 4 : 3, всё ещё «сдаст», но перевес почти исчез.</p>
<p>Пятое и шестое места делят студенты 5 и 8: оба на расстоянии <span class="math-inline" data-tex="\sqrt{50} \approx 7{,}07"></span>. При <span class="math-inline" data-tex="k = 5"></span> пришлось бы выбирать между ними, а они из разных классов, так что от выбора зависит ответ. Какого из двух возьмёт sklearn, зависит от алгоритма поиска соседей: при равных расстояниях порядок не гарантирован.</p>
    </div>
    <div class="step-panel" data-on="plane cb sb st hb B tB3 vb" data-focus="cb hb tB3 vb">
      <div class="step-kicker">Шаг 6 · студент Б</div>
      <h4>Второй новый студент</h4>
      <p>Студент Б: 15 часов и 7 пропусков. Ближе всех студент 8 (16 часов, 6 пропусков, сдал), затем 6 (не сдал) и 9 (сдал). При <span class="math-inline" data-tex="k = 3"></span> — «сдаст».</p>
<p>Лес из прошлой статьи тоже сказал «сдаст» обоим: 70 и 66 голосов из 100. Здесь ответы получились без обучения: модель — это сами десять студентов и правило голосования.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  У kNN нет обучения в обычном смысле: модель не подбирает веса и не строит дерево, она просто хранит всех студентов.
  Вся работа происходит при прогнозе: посчитать расстояния, выбрать k ближайших, сосчитать голоса. Поэтому kNN
  называют ленивым методом.
</p>


## Часть 2. Расстояние

<p>
  Похожесть двух студентов меряют расстоянием между их точками. Обычное, евклидово расстояние — длина отрезка
  по теореме Пифагора:
</p>

<div class="math-display" data-tex="d(p, q) = \sqrt{(p_1 - q_1)^2 + (p_2 - q_2)^2}"></div>

<p>
  Манхэттенское расстояние складывает разницы по осям без квадратов, как путь по кварталам города:
  <span class="math-inline" data-tex="|p_1 - q_1| + |p_2 - q_2|"></span>. Расстояния от А до всех десяти:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Часы</th><th>Пропуски</th><th>Евклидово расстояние до А</th><th>Манхэттенское</th><th>Сдал</th></tr>
  <tr class="hl"><td>4</td><td>8</td><td>1</td><td><span class="math-inline" data-tex="\sqrt{9 + 0} = 3{,}00"></span></td><td>3</td><td>да</td></tr>
  <tr class="hl"><td>7</td><td>14</td><td>2</td><td><span class="math-inline" data-tex="\sqrt{9 + 1} = 3{,}16"></span></td><td>4</td><td>да</td></tr>
  <tr class="hl"><td>6</td><td>12</td><td>5</td><td><span class="math-inline" data-tex="\sqrt{1 + 16} = 4{,}12"></span></td><td>5</td><td>нет</td></tr>
  <tr><td>3</td><td>6</td><td>4</td><td><span class="math-inline" data-tex="\sqrt{25 + 9} = 5{,}83"></span></td><td>8</td><td>нет</td></tr>
  <tr><td>5</td><td>10</td><td>8</td><td><span class="math-inline" data-tex="\sqrt{1 + 49} = 7{,}07"></span></td><td>8</td><td>нет</td></tr>
  <tr><td>8</td><td>16</td><td>6</td><td><span class="math-inline" data-tex="\sqrt{25 + 25} = 7{,}07"></span></td><td>10</td><td>да</td></tr>
  <tr><td>9</td><td>18</td><td>3</td><td><span class="math-inline" data-tex="\sqrt{49 + 4} = 7{,}28"></span></td><td>9</td><td>да</td></tr>
  <tr><td>1</td><td>2</td><td>3</td><td><span class="math-inline" data-tex="\sqrt{81 + 4} = 9{,}22"></span></td><td>11</td><td>нет</td></tr>
  <tr><td>2</td><td>4</td><td>7</td><td><span class="math-inline" data-tex="\sqrt{49 + 36} = 9{,}22"></span></td><td>13</td><td>нет</td></tr>
  <tr><td>10</td><td>20</td><td>4</td><td><span class="math-inline" data-tex="\sqrt{81 + 9} = 9{,}49"></span></td><td>12</td><td>да</td></tr>
</table></div>


<p>
  Тройка ближайших у обоих расстояний одна: 4, 7, 6. Дальше порядок расходится: по Манхэттену студенты 3 и 5 стоят
  вровень, по Евклиду студент 3 заметно ближе. У студента Б разница уже видна в ответе: по Манхэттену третье место делят
  студенты 5 и 7, оба на расстоянии 6, и ответ зависит от того, кто из них попадёт в тройку. sklearn с настройками
  по умолчанию берёт студента 5, который не сдал, и при <span class="math-inline" data-tex="k = 3"></span> отвечает «не сдаст»; с <code>algorithm="brute"</code>
  берёт студента 7 и отвечает «сдаст». По Евклиду студент 9 ближе обоих, и ответ «сдаст» без вариантов.
  Бывают и другие меры: косинусная для текстов, Хэмминга и Жаккара для признаков «да или нет». Они разобраны
  в статье <a href="article.html?slug=similarity-measures">«Меры близости»</a>.
</p>

<p>
  В интерактиве можно поставить нового студента в любую точку. Фон показывает ответ модели для студента в каждой
  точке плоскости: так видна граница, которую kNN проводит между «сдаст» и «не сдаст». Кнопки масштаба понадобятся
  в части 4.
</p>


<div class="dt-live" id="knnLive">
  <div class="dt-live-head"><strong>Интерактив: соседи нового студента</strong>
    <p>Щёлкните или перетащите по плоскости, чтобы поставить нового студента. Фон показывает, что модель ответила бы студенту в каждой точке: зелёный — «сдаст», красный — «не сдаст».</p></div>
  <div class="thr-fig"><svg id="knnSvg" viewBox="0 0 620 330" role="img" aria-label="Плоскость часов и пропусков, соседи нового студента" style="touch-action: pan-y; cursor: crosshair; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="knnK"><span>число соседей k</span><output id="knnKv">3</output></label>
        <input id="knnK" type="range" min="1" max="9" step="1" value="3"></div>
      <div class="rm-modes" data-group="kind"><button type="button" data-kind="euclid" aria-pressed="true">евклидово</button><button type="button" data-kind="manh" aria-pressed="false">манхэттенское</button></div>
      <div class="rm-modes" data-group="scale"><button type="button" data-scale="raw" aria-pressed="true">часы</button><button type="button" data-scale="min" aria-pressed="false">минуты</button><button type="button" data-scale="std" aria-pressed="false">стандартизация</button></div>
      <div class="dt-presets"><button type="button" data-q="11,1">студент А</button><button type="button" data-q="15,7">студент Б</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric is-main"><span>ответ</span><strong id="knnAns">—</strong></div>
      <div class="dt-metric"><span>голоса «сдаст»</span><strong id="knnVotes">—</strong></div>
      <div class="dt-metric"><span>с весами 1/расстояние</span><strong id="knnW">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>соседи по порядку</span><div class="knn-list" id="knnList">—</div></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('knnSvg');
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
  var q = [11, 1], k = 3, kind = 'euclid', scale = 'raw', drag = false;
  var SC = {raw: [1, 1], min: [60, 1], std: [1 / 5.7446, 1 / 2.1]};
  function dist(a, b) {
    var s = SC[scale], dx = (a[0] - b[0]) * s[0], dy = (a[1] - b[1]) * s[1];
    return kind === 'euclid' ? Math.sqrt(dx * dx + dy * dy) : Math.abs(dx) + Math.abs(dy);
  }
  function neigh(p) {
    var o = D.X.map(function (x, i) { return [Math.round(dist(x, p) * 1e9) / 1e9, i]; });
    o.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return o.slice(0, k);
  }
  function vote(nb) { var s = 0; nb.forEach(function (n) { s += D.y[n[1]]; }); return s; }
  function update() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    for (var gx = 0; gx < 44; gx++) for (var gy = 0; gy < 20; gy++) {
      var c = [gx * 0.5 + 0.25, gy * 0.5 + 0.25], v = vote(neigh(c));
      var fill = 2 * v > k ? '#E3F0D2' : (2 * v < k ? '#F8DCDC' : '#ECEAE4');
      svg.appendChild(el('rect', {x: px(gx * 0.5), y: py(gy * 0.5 + 0.5), width: U * 0.5 + 0.4, height: U * 0.5 + 0.4, fill: fill}));
    }
    plane(svg);
    var nb = neigh(q), r = nb[nb.length - 1][0], s = SC[scale];
    var rx = r / s[0] * U, ry = r / s[1] * U;
    var shape = kind === 'euclid'
      ? el('ellipse', {cx: px(q[0]), cy: py(q[1]), rx: rx, ry: ry})
      : el('polygon', {points: [[px(q[0]) - rx, py(q[1])], [px(q[0]), py(q[1]) - ry], [px(q[0]) + rx, py(q[1])], [px(q[0]), py(q[1]) + ry]].map(function (p) { return p.join(','); }).join(' ')});
    shape.setAttribute('fill', '#3576C0'); shape.setAttribute('fill-opacity', '0.07'); shape.setAttribute('stroke', '#3576C0');
    shape.setAttribute('stroke-width', '2'); shape.setAttribute('stroke-dasharray', '6 4');
    var clip = el('clipPath', {id: 'knnClip'}); clip.appendChild(el('rect', {x: px(0), y: py(10), width: 22 * U, height: 10 * U}));
    svg.appendChild(clip); var gg = el('g', {'clip-path': 'url(#knnClip)'}); gg.appendChild(shape); svg.appendChild(gg);
    nb.forEach(function (n) { var x = D.X[n[1]]; svg.appendChild(el('line', {x1: px(q[0]), y1: py(q[1]), x2: px(x[0]), y2: py(x[1]), stroke: '#2A5E9B', 'stroke-width': 2})); });
    D.X.forEach(function (x, i) {
      if (nb.some(function (n) { return n[1] === i; })) svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 15, fill: 'none', stroke: '#2A5E9B', 'stroke-width': 2.4}));
      svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 10.5, fill: D.y[i] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: px(x[0]), y: py(x[1]) + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    svg.appendChild(el('circle', {cx: px(q[0]), cy: py(q[1]), r: 9, fill: '#FFFFFF', stroke: '#3576C0', 'stroke-width': 3}));
    var v = vote(nb), wp = 0, wt = 0, exact = nb.filter(function (n) { return n[0] === 0; });
    (exact.length ? exact : nb).forEach(function (n) { var w = exact.length ? 1 : 1 / n[0]; wt += w; wp += w * D.y[n[1]]; });
    document.getElementById('knnKv').textContent = k;
    var ans = 2 * v > k ? 'сдаст' : (2 * v < k ? 'не сдаст' : 'ничья');
    document.getElementById('knnAns').textContent = ans + (ans === 'ничья' ? ' (sklearn: «не сдаст»)' : '');
    document.getElementById('knnVotes').textContent = v + ' из ' + k + ' = ' + fmt(v / k, 2);
    document.getElementById('knnW').textContent = 'P(сдаст) = ' + fmt(wp / wt, 2);
    document.getElementById('knnList').innerHTML = nb.map(function (n) {
      return 'студент ' + (n[1] + 1) + ' · ' + fmt(n[0], scale === 'min' ? 1 : 2) + ' · ' + (D.y[n[1]] ? '<b class="p">сдал</b>' : '<b class="f">не сдал</b>');
    }).join('<br>') + '<br>новый студент: ' + fmt(q[0], 1) + ' ч, ' + fmt(q[1], 1) + ' пропусков';
  }
  function fromEvent(ev) {
    var r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) * 620 / r.width, y = (ev.clientY - r.top) * 330 / r.height;
    q = [Math.max(0, Math.min(22, Math.round((x - OX) / U * 2) / 2)), Math.max(0, Math.min(10, Math.round((OY - y) / U * 2) / 2))];
    update();
  }
  svg.addEventListener('pointerdown', function (ev) { drag = true; svg.setPointerCapture(ev.pointerId); fromEvent(ev); });
  svg.addEventListener('pointermove', function (ev) { if (drag) fromEvent(ev); });
  svg.addEventListener('pointerup', function () { drag = false; });
  svg.addEventListener('pointercancel', function () { drag = false; });
  document.getElementById('knnK').addEventListener('input', function () { k = +this.value; update(); });
  function seg(attr, set) {
    document.querySelectorAll('#knnLive [data-' + attr + ']').forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-' + attr));
        document.querySelectorAll('#knnLive [data-' + attr + ']').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
    });
  }
  seg('kind', function (v) { kind = v; }); seg('scale', function (v) { scale = v; });
  document.querySelectorAll('#knnLive [data-q]').forEach(function (b) { b.addEventListener('click', function () { q = b.getAttribute('data-q').split(',').map(Number); update(); }); });
  update();
})();
</script>


<p>
  При <span class="math-inline" data-tex="k = 1"></span> граница проходит ровно посередине между соседними студентами разных классов: каждая точка плоскости
  получает ответ ближайшего студента, и плоскость делится на области вокруг каждого из десяти (диаграмма Вороного).
  При манхэттенском расстоянии окрестность нового студента — ромб, при евклидовом — круг.
</p>


## Часть 3. Голосование, ничьи и вероятность

<p>
  Ответ kNN — большинство голосов среди k соседей. Доля голосов служит оценкой вероятности: у А при <span class="math-inline" data-tex="k = 3"></span> двое
  из трёх соседей сдали, <span class="math-inline" data-tex="P(\text{сдаст}) = 2/3"></span>. Это то, что возвращает <code>predict_proba</code> в sklearn.
</p>

<p>
  <b>Чётное k даёт ничьи.</b> При <span class="math-inline" data-tex="k = 2"></span> или <span class="math-inline" data-tex="k = 4"></span> голоса могут разделиться поровну. sklearn в этом случае выбирает
  класс с меньшей меткой, у нас «не сдал». Поэтому для двух классов обычно берут нечётное k.
</p>

<p>
  <b>Веса по расстоянию.</b> У А ближайшие студенты 4 и 7 стоят на расстоянии 3 и 3,16, а студент 6 — на 4,12.
  Естественно доверять близким больше. Если дать каждому соседу вес <span class="math-inline" data-tex="1/d"></span>, доля «сдаст» станет
</p>

<div class="math-display" data-tex="P(\text{сдаст}) = \frac{1/3 + 1/3{,}16}{1/3 + 1/3{,}16 + 1/4{,}12} = \frac{0{,}650}{0{,}892} \approx 0{,}728"></div>

<p>
  У Б ближайший студент 8 стоит совсем рядом, на расстоянии 1,41, и с весами доля «сдаст» растёт с 0,667 до 0,766.
  В sklearn это <code>weights="distance"</code>. Взвешивание также почти убирает ничьи.
</p>


## Часть 4. Масштаб признаков

<p>
  Расстояние складывает разницы по разным признакам, как будто они измерены в одних единицах. Это не так.
  Запишем подготовку в минутах, а не в часах. Модель та же, данные те же, но разница в 3 часа превращается
  в 180 минут, а разница в 4 пропуска остаётся четырьмя. Пропуски почти перестают влиять на расстояние.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Как записаны признаки</th><th>Три ближайших к А</th><th>Голоса «сдаст»</th><th>Ответ</th></tr>
  <tr><td>часы и пропуски</td><td>4, 7, 6</td><td>2 из 3</td><td>сдаст</td></tr>
  <tr><td>минуты и пропуски</td><td>6, 5, 4</td><td>1 из 3</td><td>не сдаст</td></tr>
  <tr><td>минуты и пропуски после стандартизации</td><td>4, 7, 9</td><td>3 из 3</td><td>сдаст</td></tr>
</table></div>


<p>
  В минутах ближайшими к А становятся студенты 6 и 5: у них 12 и 10 часов, почти как у А, но 5 и 8 пропусков. Оба не сдали,
  и ответ меняется на «не сдаст». В интерактиве части 2 нажмите «минуты»: круг вытягивается в узкий вертикальный
  эллипс, а граница становится вертикальными полосами — модель смотрит только на часы.
</p>

<p>
  Лечится это стандартизацией: из каждого признака вычитают среднее и делят на стандартное отклонение,
</p>

<div class="math-display" data-tex="z = \frac{x - \bar x}{s}"></div>

<p>
  У наших студентов часы имеют среднее 11 и отклонение 5,74, пропуски — 4,3 и 2,1. После стандартизации единицы
  измерения не важны: часы и минуты дают одно и то же. Ближайшие к А — 4, 7 и 9, все трое сдали. На синтетических
  студентах при <span class="math-inline" data-tex="k = 15"></span> точность в минутах без стандартизации 0,81, со стандартизацией 0,867, как и в часах.
</p>

<p>
  В sklearn стандартизацию ставят в цепочку перед моделью: <code>make_pipeline(StandardScaler(), KNeighborsClassifier())</code>.
  Тогда среднее и отклонение считаются только по обучающим данным и одинаково применяются к новым студентам.
</p>


## Часть 5. Как выбрать k

<p>
  Проверим честно на десяти студентах: каждого предскажем по остальным девяти (leave-one-out). При <span class="math-inline" data-tex="k = 1"></span>, 3 и 5
  верны 8 ответов из 10. При <span class="math-inline" data-tex="k = 1"></span> ошибки на студентах 4 и 7, при больших k — на студентах 4 и 6: студент 4 сдал,
  хотя вокруг него в основном несдавшие, а студент 6 не сдал среди сдавших.
</p>

<p>
  При <span class="math-inline" data-tex="k = 9"></span> получается 0 из 10. Без проверяемого студента остаются девять: четверо из его класса и пятеро из другого.
  Девять соседей — это все оставшиеся, и большинство всегда за другой класс. Слишком большое k превращает kNN в ответ
  «как у большинства», а здесь ещё и в ответ «наоборот».
</p>

<p>
  На десяти студентах кривую не построить, поэтому возьмём сто синтетических, устроенных как наши, и будем проверять
  на пяти тысячах новых.
</p>


<div class="dt-live" id="bndLive">
  <div class="dt-live-head"><strong>Интерактив: число соседей и граница решений</strong>
    <p>Сто синтетических студентов, устроенных как наши. Двигайте k: фон показывает ответы модели, график под картой — точность на обучающих студентах и на новых.</p></div>
  <div class="thr-fig"><svg id="bndSvg" viewBox="0 0 620 330" role="img" aria-label="Граница решений kNN на синтетических студентах"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="bndK"><span>число соседей k</span><output id="bndKv">15</output></label>
        <input id="bndK" type="range" min="0" max="12" step="1" value="6"></div>
      <div class="dt-presets"><button type="button" data-i="0">k = 1</button><button type="button" data-i="6">k = 15</button><button type="button" data-i="12">k = 99</button></div>
      <div class="dt-metrics">
        <div class="dt-metric"><span>на обучении</span><strong id="bndTr">—</strong></div>
        <div class="dt-metric is-main"><span>на новых</span><strong id="bndTe">—</strong></div>
      </div>
    </div>
    <div style="grid-column: span 2"><div><svg id="bndCurve" viewBox="0 0 300 200" role="img" aria-label="Точность в зависимости от k"></svg></div>
      <p class="dt-note">Точности — среднее по 30 обучающим выборкам из 100 студентов, проверка на 5000 новых. Карта — для одной выборки. Признаки стандартизованы.</p></div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('bndSvg'), cv = document.getElementById('bndCurve');
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
  var D = {"X": [[14.01, 4.8], [5.94, 2.32], [0.9, 8.02], [0.36, 9.24], [17.89, 2.66], [20.08, 5.39], [13.35, 4.43], [16.05, 9.31], [11.96, 0.41], [20.57, 7.32], [17.95, 6.14], [0.06, 0.28], [18.86, 7.19], [0.74, 0.16], [16.05, 7.58], [3.86, 5.13], [18.99, 9.29], [11.91, 0.66], [6.59, 8.41], [9.3, 0.67], [0.62, 3.44], [2.73, 4.3], [14.75, 9.66], [14.24, 5.62], [13.54, 2.59], [8.44, 2.42], [21.94, 8.88], [21.58, 2.26], [15.08, 1.25], [14.31, 2.88], [15.15, 5.86], [8.56, 5.54], [2.97, 8.1], [15.87, 5.6], [11.56, 2.88], [6.83, 4.13], [10.69, 8.18], [19.57, 6.27], [20.55, 9.59], [7.87, 3.69], [12.57, 5.53], [7.08, 5.94], [13.07, 8.48], [7.43, 1.45], [8.62, 4.07], [19.59, 9.1], [5.0, 0.43], [13.71, 8.23], [1.85, 4.15], [18.32, 8.3], [17.32, 0.1], [5.27, 3.65], [19.28, 0.79], [1.29, 6.53], [7.39, 2.74], [3.31, 7.03], [9.91, 9.44], [17.52, 1.27], [5.07, 8.65], [1.14, 0.59], [8.9, 3.81], [4.37, 4.3], [2.0, 4.89], [12.77, 9.76], [6.57, 7.76], [14.78, 3.09], [4.39, 2.7], [20.73, 8.63], [8.03, 8.81], [2.32, 5.11], [13.84, 3.44], [20.4, 9.95], [9.69, 3.16], [21.0, 1.83], [11.0, 8.8], [9.36, 8.12], [13.64, 6.68], [21.89, 9.58], [20.88, 9.26], [10.12, 7.48], [16.67, 8.61], [10.94, 2.47], [11.64, 1.41], [17.29, 6.7], [9.12, 7.15], [16.16, 1.67], [15.65, 3.96], [20.51, 9.1], [2.53, 5.61], [16.04, 5.78], [20.4, 1.94], [21.29, 5.26], [0.32, 5.23], [19.0, 0.89], [21.59, 9.82], [21.06, 5.71], [3.27, 0.06], [21.4, 7.73], [19.58, 9.78], [18.09, 5.9]], "y": [1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1], "curve": [[1, 1.0, 0.828], [3, 0.921, 0.851], [5, 0.904, 0.86], [7, 0.894, 0.864], [9, 0.894, 0.865], [11, 0.894, 0.866], [15, 0.89, 0.867], [21, 0.887, 0.867], [31, 0.881, 0.862], [41, 0.875, 0.86], [51, 0.87, 0.854], [71, 0.844, 0.82], [99, 0.569, 0.531]], "bayes": 0.8822, "lr": 0.8751599999999998};
  var n = D.X.length, mh = 0, ma = 0, sh = 0, sa = 0;
  D.X.forEach(function (x) { mh += x[0] / n; ma += x[1] / n; });
  D.X.forEach(function (x) { sh += (x[0] - mh) * (x[0] - mh) / n; sa += (x[1] - ma) * (x[1] - ma) / n; });
  sh = Math.sqrt(sh); sa = Math.sqrt(sa);
  var KS = D.curve.map(function (c) { return c[0]; }), R = document.getElementById('bndK');
  function pred(p, k) {
    var d = D.X.map(function (x, i) { var dx = (x[0] - p[0]) / sh, dy = (x[1] - p[1]) / sa; return [dx * dx + dy * dy, i]; });
    d.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var v = 0; for (var j = 0; j < k; j++) v += D.y[d[j][1]];
    return v / k;
  }
  function curve(ix) {
    while (cv.firstChild) cv.removeChild(cv.firstChild);
    var L = 40, Rr = 290, T = 14, B = 170, ymin = 0.5, ymax = 1.0;
    function cx(i) { return L + i / (KS.length - 1) * (Rr - L); }
    function cy(v) { return B - (v - ymin) / (ymax - ymin) * (B - T); }
    cv.appendChild(el('rect', {x: 0, y: 0, width: 300, height: 200, fill: '#FFFFFF'}));
    [0.5, 0.75, 1].forEach(function (v) {
      cv.appendChild(el('line', {x1: L, y1: cy(v), x2: Rr, y2: cy(v), stroke: '#F1EEE6'}));
      cv.appendChild(el('text', {x: L - 5, y: cy(v) + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#5E5850'}, fmt(v, 2)));
    });
    cv.appendChild(el('line', {x1: L, y1: cy(D.bayes), x2: Rr, y2: cy(D.bayes), stroke: '#8A8478', 'stroke-dasharray': '4 3'}));
    cv.appendChild(el('text', {x: Rr, y: cy(D.bayes) - 4, 'text-anchor': 'end', 'font-size': 9, fill: '#8A8478'}, 'предел ' + fmt(D.bayes, 3)));
    [[1, '#A8A296', 'обучение'], [2, '#3576C0', 'новые']].forEach(function (s) {
      cv.appendChild(el('path', {d: D.curve.map(function (c, i) { return (i ? 'L' : 'M') + cx(i) + ' ' + cy(c[s[0]]); }).join(' '), fill: 'none', stroke: s[1], 'stroke-width': 2.4}));
    });
    cv.appendChild(el('text', {x: cx(0) + 4, y: cy(1) + 12, 'font-size': 10, fill: '#8A8478'}, 'обучение'));
    cv.appendChild(el('text', {x: cx(4), y: cy(D.curve[4][2]) + 16, 'font-size': 10, fill: '#2A5E9B', 'font-weight': 700}, 'новые студенты'));
    cv.appendChild(el('line', {x1: cx(ix), y1: T, x2: cx(ix), y2: B, stroke: '#C29E08', 'stroke-width': 2}));
    [1, 2].forEach(function (s) { cv.appendChild(el('circle', {cx: cx(ix), cy: cy(D.curve[ix][s]), r: 4.5, fill: s === 1 ? '#A8A296' : '#2A5E9B'})); });
    KS.forEach(function (k, i) { if ([1, 5, 15, 51, 99].indexOf(k) >= 0) cv.appendChild(el('text', {x: cx(i), y: B + 14, 'text-anchor': 'middle', 'font-size': 10, fill: '#5E5850'}, String(k))); });
    cv.appendChild(el('text', {x: Rr, y: B + 28, 'text-anchor': 'end', 'font-size': 10, fill: '#5E5850'}, 'k'));
  }
  function update() {
    var ix = +R.value, k = KS[ix];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    for (var gx = 0; gx < 44; gx++) for (var gy = 0; gy < 20; gy++) {
      var p = pred([gx * 0.5 + 0.25, gy * 0.5 + 0.25], k);
      svg.appendChild(el('rect', {x: px(gx * 0.5), y: py(gy * 0.5 + 0.5), width: U * 0.5 + 0.4, height: U * 0.5 + 0.4, fill: p > 0.5 ? '#E3F0D2' : (p < 0.5 ? '#F8DCDC' : '#ECEAE4')}));
    }
    plane(svg);
    D.X.forEach(function (x, i) { svg.appendChild(el('circle', {cx: px(x[0]), cy: py(x[1]), r: 4.2, fill: D.y[i] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1})); });
    document.getElementById('bndKv').textContent = k;
    document.getElementById('bndTr').textContent = fmt(D.curve[ix][1], 3);
    document.getElementById('bndTe').textContent = fmt(D.curve[ix][2], 3);
    curve(ix);
  }
  R.addEventListener('input', update);
  document.querySelectorAll('#bndLive [data-i]').forEach(function (b) { b.addEventListener('click', function () { R.value = b.getAttribute('data-i'); update(); }); });
  update();
})();
</script>


<p>
  При <span class="math-inline" data-tex="k = 1"></span> точность на обучающих студентах 1,000: ближайший сосед каждого студента — он сам. На новых студентах
  0,828, это переобучение: карта покрыта островками вокруг отдельных студентов, в том числе случайных исключений.
  С ростом k островки исчезают, граница сглаживается, и точность на новых растёт до 0,867 при <span class="math-inline" data-tex="k"></span> от 15 до 21.
  Дальше граница становится слишком грубой: при <span class="math-inline" data-tex="k = 99"></span> модель почти всем отвечает одинаково, точность 0,531.
</p>

<p>
  Для сравнения: логистическая регрессия на тех же выборках даёт 0,875, а теоретический предел для этих данных — 0,882.
  Граница в данных — прямая, и модель, которая сама рисует прямую, здесь немного точнее kNN.
</p>

<p>
  На практике k подбирают кросс-валидацией, как глубину дерева. На ста студентах это шумно: на одной выборке
  <code>GridSearchCV</code> выбрал <span class="math-inline" data-tex="k = 51"></span>, и на новых студентах вышло 0,851. Широкий диапазон k от 9 до 31
  даёт почти одинаковую точность, поэтому точное значение важно меньше, чем то, чтобы k было не 1 и не почти n.
</p>


## Часть 6. kNN для регрессии

<p>
  Если вместо «сдал или нет» нужен балл, соседи не голосуют, а их баллы усредняются. У А три ближайших соседа:
  студенты 4, 7 и 6 с баллами 58, 72 и 47, прогноз <span class="math-inline" data-tex="(58 + 72 + 47)/3 = 59"></span>. У Б — студенты 8, 6 и 9:
  <span class="math-inline" data-tex="(61 + 47 + 80)/3 \approx 62{,}7"></span>.
</p>

<p>
  Чтобы прогноз можно было нарисовать линией, оставим один признак — часы. Тогда прогноз для любого числа часов —
  среднее баллов k студентов, ближайших по часам.
</p>


<div class="dt-live" id="kregLive">
  <div class="dt-live-head"><strong>Интерактив: kNN предсказывает баллы</strong>
    <p>Баллы за экзамен в зависимости от часов подготовки. Синяя линия — прогноз kNN для студента с любым числом часов: среднее баллов k ближайших по часам. Красный пунктир — остатки.</p></div>
  <div class="thr-fig"><svg id="kregSvg" viewBox="0 0 620 330" role="img" aria-label="Баллы от часов и прогноз kNN"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="kregK"><span>число соседей k</span><output id="kregKv">3</output></label>
        <input id="kregK" type="range" min="1" max="10" step="1" value="3"></div>
      <div class="dt-presets"><button type="button" data-k="1">k = 1</button><button type="button" data-k="3">k = 3</button><button type="button" data-k="10">k = 10</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span>MAE на тех же студентах</span><strong id="kregTr">—</strong></div>
      <div class="dt-metric is-main"><span>MAE честно (каждый без себя)</span><strong id="kregTe">—</strong></div>
    </div>
  </div>
</div>
<script>
(function () {
  var svg = document.getElementById('kregSvg');
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
  var D = {"h": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], "s": [30, 22, 41, 58, 35, 47, 72, 61, 80, 84]};
  var R = document.getElementById('kregK');
  function sx(h) { return 60 + h / 22 * 520; }
  function sy(v) { return 290 - v / 100 * 260; }
  function predict(h, k, skip) {
    var o = [];
    D.h.forEach(function (x, i) { if (i !== skip) o.push([Math.round(Math.abs(x - h) * 1e9) / 1e9, i]); });
    o.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    if (o.length < k) return null;
    var s = 0; for (var j = 0; j < k; j++) s += D.s[o[j][1]];
    return s / k;
  }
  function update() {
    var k = +R.value;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 620, height: 330, fill: '#FFFFFF'}));
    for (var v = 0; v <= 100; v += 20) {
      svg.appendChild(el('line', {x1: 60, y1: sy(v), x2: 580, y2: sy(v), stroke: v ? '#F1EEE6' : '#5E5850', 'stroke-width': v ? 1 : 1.2}));
      svg.appendChild(el('text', {x: 52, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(v)));
    }
    svg.appendChild(el('line', {x1: 60, y1: sy(0), x2: 60, y2: sy(100), stroke: '#5E5850', 'stroke-width': 1.2}));
    for (var h = 0; h <= 22; h += 2) svg.appendChild(el('text', {x: sx(h), y: sy(0) + 17, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(h)));
    svg.appendChild(el('text', {x: 580, y: sy(0) + 34, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'часы подготовки'));
    svg.appendChild(el('text', {x: 56, y: sy(100) - 10, 'font-size': 12, fill: '#5E5850'}, 'баллы'));
    var pts = [];
    for (var x = 0; x <= 22.0001; x += 0.05) pts.push([x, predict(x, k, -1)]);
    svg.appendChild(el('path', {d: pts.map(function (p, i) { return (i ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1); }).join(' '), fill: 'none', stroke: '#3576C0', 'stroke-width': 3}));
    var tr = 0, te = 0, ok = true;
    D.h.forEach(function (h, i) {
      var p = predict(h, k, -1), l = predict(h, k, i);
      tr += Math.abs(D.s[i] - p) / 10;
      if (l === null) ok = false; else te += Math.abs(D.s[i] - l) / 10;
      svg.appendChild(el('line', {x1: sx(h), y1: sy(D.s[i]), x2: sx(h), y2: sy(p), stroke: '#C30B0A', 'stroke-width': 2.2, 'stroke-dasharray': '4 3'}));
      svg.appendChild(el('circle', {cx: sx(h), cy: sy(D.s[i]), r: 6.5, fill: '#C29E08', stroke: '#FFFFFF', 'stroke-width': 1.3}));
    });
    document.getElementById('kregKv').textContent = k;
    document.getElementById('kregTr').textContent = fmt(tr, 2);
    document.getElementById('kregTe').textContent = ok ? fmt(te, 2) : 'нужно больше студентов';
  }
  R.addEventListener('input', update);
  document.querySelectorAll('#kregLive [data-k]').forEach(function (b) { b.addEventListener('click', function () { R.value = b.getAttribute('data-k'); update(); }); });
  update();
})();
</script>


<p>
  При <span class="math-inline" data-tex="k = 1"></span> линия проходит через каждую точку ступенькой, и ошибка на тех же студентах нулевая, но честная MAE 14,6
  балла. Лучшая честная ошибка при <span class="math-inline" data-tex="k = 2"></span>: 11,4. При <span class="math-inline" data-tex="k = 10"></span> все студенты — соседи всех, и линия превращается
  в горизонтальную прямую на уровне среднего балла 53.
</p>

<p>
  Линия kNN состоит из ступенек: прогноз меняется, только когда меняется набор соседей. Продолжать тренд за пределы
  данных kNN не умеет: студенту с 30 часами подготовки он даст средний балл трёх студентов с наибольшим числом часов,
  а не больше, как сделала бы прямая.
</p>

<p>
  С двумя признаками, часами и пропусками, честная MAE при <span class="math-inline" data-tex="k = 3"></span> — 7,9 балла против 13,3 по одним часам:
  пропуски заметно влияют на балл. В sklearn регрессия соседями — <code>KNeighborsRegressor</code>.
</p>


## Часть 7. Когда признаков много

<p>
  kNN доверяет расстоянию целиком: все признаки входят в него с одинаковым весом. Добавим к часам и пропускам
  признаки, которые на экзамен не влияют, например случайные числа. Каждый такой признак добавляет к расстоянию
  шум, и ближайшие соседи становятся похожими по шуму, а не по часам и пропускам. Сто синтетических студентов,
  стандартизация, <span class="math-inline" data-tex="k = 15"></span>:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Бесполезных признаков</th><th>0</th><th>2</th><th>5</th><th>10</th><th>20</th><th>50</th></tr>
  <tr><td>Точность на новых, k = 15</td><td>0,867</td><td>0,840</td><td>0,807</td><td>0,774</td><td>0,733</td><td>0,663</td></tr>
</table></div>


<p>
  Пятьдесят лишних признаков опускают точность с 0,867 до 0,663. Дерево такие признаки почти не замечает:
  оно выбирает вопросы и бесполезный признак просто не спрашивает. kNN выбирать не умеет.
</p>

<p>
  Вторая беда — проклятие размерности (curse of dimensionality). В многомерном пространстве расстояния выравниваются:
  ближайшая точка оказывается почти так же далеко, как самая дальняя. Пятьсот случайных точек в единичном кубе
  и одна точка запроса:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Измерений</th><th>Ближайшая точка</th><th>Самая дальняя</th><th>Во сколько раз дальше</th></tr>
  <tr><td>2</td><td>0,030</td><td>1,272</td><td>41,73</td></tr>
  <tr><td>10</td><td>0,272</td><td>1,817</td><td>6,68</td></tr>
  <tr><td>100</td><td>3,277</td><td>4,609</td><td>1,41</td></tr>
  <tr><td>1000</td><td>12,077</td><td>13,505</td><td>1,12</td></tr>
</table></div>


<p>
  На плоскости самая дальняя точка в 42 раза дальше ближайшей, и «ближайший сосед» значит много. В тысяче измерений —
  только в 1,12 раза: все точки почти одинаково далеко, и слово «ближайший» теряет смысл. Поэтому перед kNN
  при многих признаках отбирают важные признаки или сжимают их, например методом главных компонент.
</p>


## Часть 8. Скорость и память

<p>
  Обучение kNN мгновенно, зато прогноз дорогой: чтобы ответить про одного студента, нужно посчитать расстояния
  до всех <span class="math-inline" data-tex="n"></span> студентов по всем <span class="math-inline" data-tex="d"></span> признакам, это <span class="math-inline" data-tex="n \cdot d"></span> операций. Для миллиона объектов со ста признаками —
  сто миллионов операций на каждый прогноз. И модель весит столько же, сколько данные: хранить нужно всё.
</p>

<p>
  Ускоряют поиск специальные структуры: KD-дерево и ball tree делят пространство на области и не проверяют
  заведомо далёкие точки. В sklearn их выбирает параметр <code>algorithm</code>; по умолчанию <code>"auto"</code>
  решает сам. При многих признаках эти деревья почти не помогают по той же причине, что в части 7, и тогда
  используют приближённый поиск соседей (библиотеки FAISS, Annoy, HNSW): он иногда пропускает настоящего соседа,
  но работает в сотни раз быстрее. Так устроен поиск похожих векторов в рекомендательных системах и в поиске
  по смыслу текстов.
</p>


## Часть 9. Код: kNN с нуля и в sklearn

### С нуля


```python
from math import sqrt

# часы подготовки, пропуски, сдал (1) или нет (0); баллы за экзамен
data = [(2, 3, 0), (4, 7, 0), (6, 4, 0), (8, 1, 1), (10, 8, 0),
        (12, 5, 0), (14, 2, 1), (16, 6, 1), (18, 3, 1), (20, 4, 1)]
scores = [30, 22, 41, 58, 35, 47, 72, 61, 80, 84]


def distance(p, q):
    return sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2)


def neighbours(q, k):
    """Номера k ближайших студентов; при равных расстояниях раньше тот, кто раньше в данных."""
    order = sorted(range(len(data)), key=lambda i: (distance(data[i], q), i))
    return order[:k]


def classify(q, k, weighted=False):
    idx = neighbours(q, k)
    w = [1 / distance(data[i], q) if weighted else 1 for i in idx]
    p = sum(wi * data[i][2] for wi, i in zip(w, idx)) / sum(w)       # доля голосов «сдал»
    return p, int(p > 0.5)


def regress(q, k):
    return sum(scores[i] for i in neighbours(q, k)) / k


for name, q in (('А', (11, 1)), ('Б', (15, 7))):
    print(name, 'соседи', [i + 1 for i in neighbours(q, 3)],
          'доля «сдал»', round(classify(q, 3)[0], 3),
          'с весами', round(classify(q, 3, weighted=True)[0], 3),
          'баллы', round(regress(q, 3), 1))

# честная проверка: каждого студента предсказываем без него самого
for k in (1, 3, 5, 9):
    right = 0
    for j, (h, a, y) in enumerate(data):
        rest = data[:j] + data[j + 1:]
        idx = sorted(range(9), key=lambda i: (distance(rest[i], (h, a)), i))[:k]
        right += int(sum(rest[i][2] for i in idx) * 2 > k) == y
    print('k =', k, 'верно', right, 'из 10')
```

```text
А соседи [4, 7, 6] доля «сдал» 0.667 с весами 0.728 баллы 59.0
Б соседи [8, 6, 9] доля «сдал» 0.667 с весами 0.766 баллы 62.7
k = 1 верно 8 из 10
k = 3 верно 8 из 10
k = 5 верно 8 из 10
k = 9 верно 0 из 10
```



### То же в sklearn

<p>
  Соседи, доли голосов и прогноз баллов совпадают с кодом выше. Две строки посередине показывают часы в минутах:
  без масштабирования соседи 6, 5, 4, в цепочке со <code>StandardScaler</code> — снова 4, 7, 9. Последняя строка —
  подбор k кросс-валидацией на ста синтетических студентах.
</p>


```python
import numpy as np
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV

X = np.array([[2, 3], [4, 7], [6, 4], [8, 1], [10, 8], [12, 5], [14, 2], [16, 6], [18, 3], [20, 4]])
y = np.array([0, 0, 0, 1, 0, 0, 1, 1, 1, 1])
scores = np.array([30, 22, 41, 58, 35, 47, 72, 61, 80, 84])
new = np.array([[11, 1], [15, 7]])

knn = KNeighborsClassifier(n_neighbors=3).fit(X, y)
dist, idx = knn.kneighbors(new)
print(idx + 1, np.round(dist, 2))
print(knn.predict_proba(new)[:, 1].round(3), knn.predict(new))
print(KNeighborsClassifier(3, weights='distance').fit(X, y).predict_proba(new)[:, 1].round(3))
print(KNeighborsRegressor(3).fit(X, scores).predict(new).round(1))

# часы в минутах: без масштабирования соседи меняются, со стандартизацией нет
Xm, newm = X * [60, 1], new * [60, 1]
print(KNeighborsClassifier(3).fit(Xm, y).kneighbors(newm[:1])[1] + 1)
print(make_pipeline(StandardScaler(), KNeighborsClassifier(3)).fit(Xm, y)[-1].kneighbors(
    StandardScaler().fit(Xm).transform(newm[:1]))[1] + 1)


def stream(n, rng):
    h, a = rng.uniform(0, 22, n), rng.uniform(0, 10, n)
    p = 1 / (1 + np.exp(-(0.55 * (h - 11) - 0.7 * (a - 4.5))))
    return np.c_[h, a], (rng.uniform(size=n) < p).astype(int)


X_train, y_train = stream(100, np.random.default_rng(0))
X_test, y_test = stream(5000, np.random.default_rng(999))
search = GridSearchCV(make_pipeline(StandardScaler(), KNeighborsClassifier()),
                      {'kneighborsclassifier__n_neighbors': [1, 3, 5, 9, 15, 21, 31, 51]}, cv=5)
search.fit(X_train, y_train)
print(search.best_params_, round(search.best_score_, 3), round(search.score(X_test, y_test), 3))
```

```text
[[4 7 6]
 [8 6 9]] [[3.   3.16 4.12]
 [1.41 3.61 5.  ]]
[0.667 0.667] [1 1]
[0.728 0.766]
[59.  62.7]
[[6 5 4]]
[[4 7 9]]
{'kneighborsclassifier__n_neighbors': 51} 0.89 0.851
```


## Часть 10. Что получилось


<div class="dt-table"><table class="shape-table">
  <tr><th></th><th>kNN</th><th>Дерево решений</th><th>Логистическая регрессия</th></tr>
  <tr><td>Обучение</td><td>нет: модель — сами данные</td><td>перебор вопросов</td><td>градиентный спуск</td></tr>
  <tr><td>Прогноз для одного объекта</td><td>расстояния до всех объектов</td><td>несколько вопросов</td><td>одна формула</td></tr>
  <tr><td>Нужно ли масштабировать признаки</td><td>обязательно</td><td>нет</td><td>желательно</td></tr>
  <tr><td>Форма границы</td><td>любая, сглаживается с ростом k</td><td>ступеньки</td><td>прямая</td></tr>
  <tr><td>Главная настройка</td><td>k и расстояние</td><td>глубина</td><td>регуляризация</td></tr>
  <tr><td>Плохо переносит</td><td>много признаков, лишние признаки</td><td>малые изменения данных</td><td>нелинейные границы</td></tr>
</table></div>


### Что важно уметь восстановить по памяти

<ul>
  <li>kNN не обучается: прогноз — большинство голосов (или среднее ответов) среди k ближайших объектов.</li>
  <li>Расстояние: евклидово <span class="math-inline" data-tex="\sqrt{\sum (p_j - q_j)^2}"></span> или манхэттенское <span class="math-inline" data-tex="\sum |p_j - q_j|"></span>.</li>
  <li>Признаки обязательно приводят к одному масштабу: <span class="math-inline" data-tex="z = (x - \bar x)/s"></span>, иначе решает признак с большими числами.</li>
  <li><span class="math-inline" data-tex="k = 1"></span>: ноль ошибок на обучении и переобучение; k близко к n: ответ «как у большинства». k подбирают кросс-валидацией.</li>
  <li>Доля голосов — оценка вероятности; веса <span class="math-inline" data-tex="1/d"></span> дают близким соседям больше голоса.</li>
  <li>Для двух классов k берут нечётным, чтобы не было ничьих.</li>
  <li>Лишние признаки и большая размерность портят расстояния; прогноз стоит <span class="math-inline" data-tex="n \cdot d"></span> операций.</li>
</ul>

<p class="tiny">
  Источники: T. Cover, P. Hart, «Nearest neighbor pattern classification», IEEE Transactions on Information Theory, 1967;
  T. Hastie, R. Tibshirani, J. Friedman, «The Elements of Statistical Learning», разделы 2.3 и 13.3, 2009;
  K. Beyer и др., «When Is “Nearest Neighbor” Meaningful?», ICDT 1999; документация scikit-learn, раздел «Nearest Neighbors».
</p>

