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
  .prose #resTab th, .prose #resTab td { padding: 6px 9px; font-size: 13px; text-align: right; white-space: nowrap; }
  .prose .rm-modes { display: flex; flex-wrap: wrap; gap: 6px; }
  .prose .rm-modes button { flex: 1 1 auto; }
</style>

<p class="lead">
  Модель предсказывает число, например цену квартиры. Насколько хорошо? Разберём на четырёх квартирах,
  какие метрики считают для регрессии, что каждая измеряет и какой прогноз она считает лучшим.
</p>

<p>
  Это продолжение <a href="article.html?slug=classification-metrics-full-cycle">статьи о метриках классификации</a>.
  Там ответ модели был классом, и ошибку можно было только посчитать: верно или нет. Здесь ответ — число,
  и важно, на сколько модель промахнулась.
</p>

<p>
  Данные и модель взяты из <a href="article.html?slug=linear-regression-by-shapes">статьи про линейную регрессию
  по формам матриц</a>: четыре квартиры, площадь в десятках квадратных метров, возраст дома в десятках лет,
  цена в миллионах. Нормальные уравнения дали там веса <span class="math-inline" data-tex="w = (27, -25)/23"></span> и <span class="math-inline" data-tex="b = 74/23"></span>. Все прогнозы и остатки —
  дроби со знаменателем 23, поэтому каждую метрику можно проверить руками.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Площадь, м²</th><th>Возраст дома, лет</th><th>Цена <span class="math-inline" data-tex="y"></span>, млн</th><th>Прогноз <span class="math-inline" data-tex="\hat y"></span></th><th>Остаток <span class="math-inline" data-tex="e = y - \hat y"></span></th></tr>
  <tr><td>1</td><td>20</td><td>10</td><td>5</td><td><span class="math-inline" data-tex="\tfrac{103}{23} \approx 4{,}478"></span></td><td><span class="math-inline" data-tex="\tfrac{12}{23} \approx 0{,}522"></span></td></tr>
  <tr><td>2</td><td>30</td><td>10</td><td>5</td><td><span class="math-inline" data-tex="\tfrac{130}{23} \approx 5{,}652"></span></td><td><span class="math-inline" data-tex="\tfrac{-15}{23} \approx -0{,}652"></span></td></tr>
  <tr><td>3</td><td>10</td><td>30</td><td>1</td><td><span class="math-inline" data-tex="\tfrac{26}{23} \approx 1{,}130"></span></td><td><span class="math-inline" data-tex="\tfrac{-3}{23} \approx -0{,}130"></span></td></tr>
  <tr><td>4</td><td>40</td><td>20</td><td>6</td><td><span class="math-inline" data-tex="\tfrac{132}{23} \approx 5{,}739"></span></td><td><span class="math-inline" data-tex="\tfrac{6}{23} \approx 0{,}261"></span></td></tr>
</table></div>


<p>
  В частях 1–4 метрики считаются на тех же квартирах, на которых модель обучалась, как в статье по формам.
  Так удобнее разбирать формулы. В части 5 станет видно, почему для оценки модели этого мало.
</p>


## Часть 1. Остатки, MAE, MSE и RMSE

<p>
  Все метрики регрессии начинаются с остатков, разниц между настоящим ответом и прогнозом. Дальше их надо свернуть
  в одно число, и способ свёртки решает, какие промахи будут важнее.
</p>


<div class="stage" id="stageResid" tabindex="0">
  <div class="stage-figure">
<svg id="residSvg" viewBox="0 0 960 640" role="img" aria-label="Цены четырёх квартир, прогноз линейной регрессии и остатки"><style>#residSvg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="640" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="axes"><line x1="110" y1="530" x2="950" y2="530" stroke="#D8D4C8" stroke-width="1.2"/><line x1="104" y1="530" x2="110" y2="530" stroke="#5E5850" stroke-width="1"/><text x="98" y="534" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="104" y1="460" x2="110" y2="460" stroke="#5E5850" stroke-width="1"/><text x="98" y="464" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><line x1="110" y1="460" x2="950" y2="460" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="390" x2="110" y2="390" stroke="#5E5850" stroke-width="1"/><text x="98" y="394" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="110" y1="390" x2="950" y2="390" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="320" x2="110" y2="320" stroke="#5E5850" stroke-width="1"/><text x="98" y="324" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">3</text><line x1="110" y1="320" x2="950" y2="320" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="250" x2="110" y2="250" stroke="#5E5850" stroke-width="1"/><text x="98" y="254" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="110" y1="250" x2="950" y2="250" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="180" x2="110" y2="180" stroke="#5E5850" stroke-width="1"/><text x="98" y="184" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">5</text><line x1="110" y1="180" x2="950" y2="180" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="110" x2="110" y2="110" stroke="#5E5850" stroke-width="1"/><text x="98" y="114" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="110" y1="110" x2="950" y2="110" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="40" x2="110" y2="40" stroke="#5E5850" stroke-width="1"/><text x="98" y="44" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">7</text><line x1="110" y1="40" x2="950" y2="40" stroke="#F1EEE6" stroke-width="1"/><text x="60" y="285" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 60 285.0)">цена, млн</text><text x="190" y="550" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 1: 20 м², 10 лет</text><text x="380" y="550" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 2: 30 м², 10 лет</text><text x="570" y="550" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 3: 10 м², 30 лет</text><text x="760" y="550" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 4: 40 м², 20 лет</text></g>
<g data-key="sq" data-only="1"><rect x="190" y="180" width="36.52" height="36.52" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="232.52" y="203.26" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,272</text><rect x="380" y="134.35" width="45.65" height="45.65" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="431.65" y="162.17" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,425</text><rect x="570" y="450.87" width="9.13" height="9.13" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="585.13" y="460.43" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,017</text><rect x="760" y="110" width="18.26" height="18.26" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="784.26" y="124.13" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,068</text></g>
<g data-key="dots"><circle cx="190" cy="180.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="176" y="185" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">1</text><circle cx="380" cy="180.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="366" y="185" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">2</text><circle cx="570" cy="460.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="556" y="465" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">3</text><circle cx="760" cy="110.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="746" y="115" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">4</text></g>
<g data-key="pred"><line x1="168" y1="216.52" x2="212" y2="216.52" stroke="#3576C0" stroke-width="4"/><line x1="358" y1="134.35" x2="402" y2="134.35" stroke="#3576C0" stroke-width="4"/><line x1="548" y1="450.87" x2="592" y2="450.87" stroke="#3576C0" stroke-width="4"/><line x1="738" y1="128.26" x2="782" y2="128.26" stroke="#3576C0" stroke-width="4"/></g>
<g data-key="seg"><line x1="190" y1="216.52" x2="190" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="380" y1="134.35" x2="380" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="570" y1="450.87" x2="570" y2="460" stroke="#C29E08" stroke-width="3"/><line x1="760" y1="128.26" x2="760" y2="110" stroke="#C29E08" stroke-width="3"/></g>
<g data-key="lab" data-only="1"><line x1="190" y1="216.52" x2="190" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="380" y1="134.35" x2="380" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="570" y1="450.87" x2="570" y2="460" stroke="#C29E08" stroke-width="3"/><line x1="760" y1="128.26" x2="760" y2="110" stroke="#C29E08" stroke-width="3"/><text x="216" y="203.26" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">+0,52</text><text x="406" y="162.17" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">−0,65</text><text x="596" y="460.43" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">−0,13</text><text x="786" y="124.13" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">+0,26</text></g>
<g data-key="labs" data-only="1"><line x1="190" y1="216.52" x2="190" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="380" y1="134.35" x2="380" y2="180" stroke="#C29E08" stroke-width="3"/><line x1="570" y1="450.87" x2="570" y2="460" stroke="#C29E08" stroke-width="3"/><line x1="760" y1="128.26" x2="760" y2="110" stroke="#C29E08" stroke-width="3"/><text x="216" y="203.26" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">0,52</text><text x="406" y="162.17" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">0,65</text><text x="596" y="460.43" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">0,13</text><text x="786" y="124.13" font-size="14" fill="#8F7406" text-anchor="start" font-weight="700">0,26</text></g>
<g data-key="f_pred" data-only="1"><foreignObject x="40" y="562" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\hat y = \tfrac{1}{23}\,(27 \cdot \text{площадь} - 25 \cdot \text{возраст} + 74)"></div></foreignObject></g>
<g data-key="f_bias" data-only="1"><foreignObject x="40" y="562" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\bar e = \tfrac14 \cdot \tfrac{12 - 15 - 3 + 6}{23} = 0"></div></foreignObject></g>
<g data-key="f_mae" data-only="1"><foreignObject x="40" y="562" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{MAE} = \tfrac14 \cdot \tfrac{12 + 15 + 3 + 6}{23} = \tfrac{9}{23} \approx 0{,}391\ \text{млн}"></div></foreignObject></g>
<g data-key="f_mse" data-only="1"><foreignObject x="40" y="562" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{MSE} = \tfrac14 \cdot \tfrac{144 + 225 + 9 + 36}{529} = \tfrac{9}{46} \approx 0{,}196\ \text{млн}^2"></div></foreignObject></g>
<g data-key="f_rmse" data-only="1"><foreignObject x="40" y="562" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{RMSE} = \sqrt{0{,}196} \approx 0{,}442\ \text{млн} \;\ge\; \text{MAE} \approx 0{,}391"></div></foreignObject></g>
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
      <div class="step-kicker">Шаг 1 · цены</div>
      <h4>Четыре квартиры</h4>
      <p>Кружки — цены четырёх квартир из статьи про линейную регрессию по формам, в миллионах. Под каждой подписаны площадь и возраст дома.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred f_pred" data-focus="pred f_pred">
      <div class="step-kicker">Шаг 2 · прогноз</div>
      <h4>Прогноз обученной регрессии</h4>
      <p>Синие черточки — прогноз линейной регрессии с весами из нормальных уравнений: <span class="math-inline" data-tex="w = (27, -25)/23"></span>, <span class="math-inline" data-tex="b = 74/23"></span>. Для первой квартиры <span class="math-inline" data-tex="(27 \cdot 2 - 25 \cdot 1 + 74)/23 = 103/23 \approx 4{,}48"></span> млн при настоящих 5.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg lab" data-focus="seg lab">
      <div class="step-kicker">Шаг 3 · остатки</div>
      <h4>Остаток: правда минус прогноз</h4>
      <p>Остаток <span class="math-inline" data-tex="e_i = y_i - \hat y_i"></span>. Плюс — модель недооценила квартиру, минус — переоценила. Все четыре остатка — дроби со знаменателем 23: <span class="math-inline" data-tex="(12,\ -15,\ -3,\ 6)/23"></span>.</p>
<p>В статье по формам остаток записан наоборот, <span class="math-inline" data-tex="R = \hat Y - Y"></span>. На MAE, MSE и RMSE знак не влияет, на смещение влияет.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg lab f_bias" data-focus="f_bias">
      <div class="step-kicker">Шаг 4 · смещение</div>
      <h4>Среднее остатков ровно ноль</h4>
      <p><span class="math-inline" data-tex="12 - 15 - 3 + 6 = 0"></span>: модель на этих квартирах не завышает и не занижает цены в среднем. Это не совпадение. У наименьших квадратов со свободным членом сумма остатков на обучающих данных всегда ноль: это условие <span class="math-inline" data-tex="\tilde X^\top R = 0"></span> для столбца единиц из части 7 статьи по формам.</p>
<p>Поэтому смещение обученной линейной регрессии имеет смысл проверять только на новых данных. О размере промахов оно в любом случае не говорит: плюсы и минусы гасят друг друга.</p>
    </div>
    <div class="step-panel" data-on="axes dots pred seg labs f_mae" data-focus="labs f_mae">
      <div class="step-kicker">Шаг 5 · MAE</div>
      <h4>MAE: средний модуль остатка</h4>
      <p>Убираем знак и усредняем: MAE (mean absolute error) <span class="math-inline" data-tex="= 9/23 \approx 0{,}391"></span> млн. Модель промахивается в среднем на 391 тысячу.</p>
<p>MAE в тех же единицах, что цены, и читается без пересчёта. Каждый рубль промаха весит одинаково.</p>
    </div>
    <div class="step-panel" data-on="axes sq dots pred seg f_mse" data-focus="sq f_mse">
      <div class="step-kicker">Шаг 6 · MSE</div>
      <h4>MSE: средний квадрат остатка</h4>
      <p>Теперь каждый остаток возведён в квадрат, на схеме это квадраты со стороной <span class="math-inline" data-tex="|e_i|"></span>. Число рядом — площадь. Вторая квартира с промахом 0,65 даёт 0,425, третья с промахом 0,13 — только 0,017.</p>
<p>Среднее площадей — MSE <span class="math-inline" data-tex="= 9/46 \approx 0{,}196"></span>. Это ровно <span class="math-inline" data-tex="L^* = 0{,}1957"></span> из статьи по формам: минимум, к которому сходится градиентный спуск. Единицы — миллионы в квадрате.</p>
    </div>
    <div class="step-panel" data-on="axes sq dots pred seg f_rmse" data-focus="f_rmse">
      <div class="step-kicker">Шаг 7 · RMSE</div>
      <h4>RMSE возвращает миллионы</h4>
      <p>Корень из MSE снова в миллионах: RMSE <span class="math-inline" data-tex="\approx 0{,}442"></span>. Это сторона квадрата, площадь которого равна средней площади четырёх квадратов.</p>
<p>RMSE не бывает меньше MAE. Разрыв тем больше, чем сильнее промахи различаются по размеру; ниже это разобрано подробно.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Сцена показала весь путь коротко. Теперь разберём каждый шаг подробно: что именно считается,
  как метрика реагирует на отдельные промахи и как метрики связаны между собой.
</p>

### Остаток и его знак

<p>
  Остаток квартиры <span class="math-inline" data-tex="i"></span> — разность между настоящей ценой и прогнозом:
</p>

<div class="math-display" data-tex="e_i = y_i - \hat y_i"></div>

<p>
  Знак показывает направление промаха. Положительный остаток значит, что модель недооценила квартиру: первая стоит 5 млн,
  а регрессия дала <span class="math-inline" data-tex="103/23 \approx 4{,}478"></span>, остаток <span class="math-inline" data-tex="+0{,}522"></span>. Отрицательный — переоценила: вторую при цене 5 модель
  оценила в <span class="math-inline" data-tex="130/23 \approx 5{,}652"></span>, остаток <span class="math-inline" data-tex="-0{,}652"></span>.
</p>

<p>
  В статье по формам остаток записан с обратным знаком, <span class="math-inline" data-tex="R = \hat Y - Y"></span>: так удобнее выводить градиент.
  В метриках чаще пишут <span class="math-inline" data-tex="y - \hat y"></span>. На MAE, MSE и RMSE знак не влияет, на смещение влияет.
</p>

<p>
  В статистике различают остаток и ошибку. Ошибка — отклонение от настоящей закономерности, которую мы не знаем.
  Остаток — отклонение от прогноза модели, его можно посчитать. Метрики работают с остатками, хотя в их названиях
  стоит слово error.
</p>

<p>
  Все остатки и то, что из них получается, в одной таблице:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th><span class="math-inline" data-tex="y"></span></th><th><span class="math-inline" data-tex="\hat y"></span></th><th><span class="math-inline" data-tex="e = y - \hat y"></span></th><th><span class="math-inline" data-tex="|e|"></span></th><th><span class="math-inline" data-tex="e^2"></span></th></tr>
  <tr><td>1</td><td>5</td><td>4,478</td><td>+0,522 &nbsp;(12/23)</td><td>0,522</td><td>0,272 &nbsp;(144/529)</td></tr>
  <tr class="hl"><td>2</td><td>5</td><td>5,652</td><td>−0,652 &nbsp;(-15/23)</td><td>0,652</td><td>0,425 &nbsp;(225/529)</td></tr>
  <tr><td>3</td><td>1</td><td>1,130</td><td>−0,130 &nbsp;(-3/23)</td><td>0,130</td><td>0,017 &nbsp;(9/529)</td></tr>
  <tr><td>4</td><td>6</td><td>5,739</td><td>+0,261 &nbsp;(6/23)</td><td>0,261</td><td>0,068 &nbsp;(36/529)</td></tr>
  <tr><td><b>сумма</b></td><td><b>17</b></td><td><b>17</b></td><td><b>0</b></td><td><b>1,565</b> (36/23)</td><td><b>0,783</b> (414/529)</td></tr>
  <tr><td><b>среднее</b></td><td><b>4,25</b></td><td></td><td><b>0</b> (смещение)</td><td><b>0,391</b> (MAE)</td><td><b>0,196</b> (MSE)</td></tr>
</table></div>


### Смещение

<p>
  Среднее остатков со знаком называют смещением (bias):
</p>

<div class="math-display" data-tex="\bar e = \frac{1}{n}\sum_i e_i = \frac{1}{4}\cdot\frac{12 - 15 - 3 + 6}{23} = 0"></div>

<p>
  Ноль здесь не случайный. Наименьшие квадраты выбирают веса так, чтобы вектор остатков был перпендикулярен каждому
  столбцу <span class="math-inline" data-tex="\tilde X"></span>, в том числе столбцу единиц, который отвечает за свободный член <span class="math-inline" data-tex="b"></span>. Перпендикулярность столбцу
  единиц и означает <span class="math-inline" data-tex="\sum_i e_i = 0"></span>: это условие <span class="math-inline" data-tex="\tilde X^\top R = 0"></span> из части 7 статьи по формам. У любой
  линейной регрессии со свободным членом смещение на обучающих данных равно нулю, поэтому проверять его имеет смысл
  только на новых данных.
</p>

<p>
  Смещение связано с MSE точной формулой: средний квадрат остатков равен квадрату их среднего плюс их дисперсия.
</p>

<div class="math-display" data-tex="\text{MSE} = \bar e^{\,2} + \text{Var}(e)"></div>

<p>
  Это та же формула, что <span class="math-inline" data-tex="\text{Var}(x) = \overline{x^2} - \bar x^{\,2}"></span>, прочитанная в другую сторону. У обученной
  регрессии <span class="math-inline" data-tex="\bar e = 0"></span>, и вся MSE — разброс остатков: <span class="math-inline" data-tex="0{,}196 = 0 + 0{,}196"></span>. Если прибавить ко всем прогнозам 0,5 млн,
  остатки сдвинутся на <span class="math-inline" data-tex="-0{,}5"></span>, разброс останется тем же, а к MSE добавится квадрат смещения: <span class="math-inline" data-tex="0{,}25 + 0{,}196 = 0{,}446"></span>.
  Поэтому сдвиг всех прогнозов на одно число уже обученной регрессии может только навредить.
</p>

### MAE: средний модуль

<div class="math-display" data-tex="\text{MAE} = \frac{1}{n}\sum_i |e_i| = \frac{1}{4}\cdot\frac{12 + 15 + 3 + 6}{23} = \frac{9}{23} \approx 0{,}391"></div>

<p>
  MAE — среднее расстояние между прогнозом и ценой, в миллионах: модель промахивается в среднем на 391 тысячу.
  Для масштаба: цены лежат от 1 до 6 млн, их стандартное отклонение 1,92 млн.
</p>

<p>
  Главное свойство MAE: каждый рубль промаха стоит одинаково. Если приблизить прогноз к цене на 0,1 млн, MAE
  уменьшится на <span class="math-inline" data-tex="0{,}1/4 = 0{,}025"></span> у любой квартиры, будь её промах 0,13 или 0,65. Модель, которая минимизирует MAE,
  не тратит на крупные промахи больше сил, чем на мелкие. В части 3 видно, к чему это ведёт: лучший постоянный прогноз
  по MAE — медиана.
</p>

<p>
  Рядом с MAE полезно смотреть на максимальную ошибку (max error): у регрессии это 0,652 млн на второй квартире.
  Она нужна там, где важен худший случай, а не средний.
</p>

### MSE: средний квадрат

<div class="math-display" data-tex="\text{MSE} = \frac{1}{n}\sum_i e_i^2 = \frac{1}{4}\cdot\frac{144 + 225 + 9 + 36}{529} = \frac{9}{46} \approx 0{,}196"></div>

<p>
  Квадрат меняет вес промахов. Вторая квартира даёт 42 % суммы модулей (<span class="math-inline" data-tex="15/36"></span>), но 54 % суммы квадратов
  (<span class="math-inline" data-tex="225/414"></span>). Третья — 8 % модулей и только 2 % квадратов. Чем крупнее промах, тем большую долю MSE он занимает.
</p>

<p>
  Это видно и по реакции MSE на исправление одного прогноза. Приблизим прогноз на 0,1 млн к цене:
</p>

<ul>
  <li>второй квартире: квадрат падает с <span class="math-inline" data-tex="0{,}652^2 = 0{,}425"></span> до <span class="math-inline" data-tex="0{,}552^2 = 0{,}305"></span>, MSE уменьшается на 0,030;</li>
  <li>третьей: с <span class="math-inline" data-tex="0{,}130^2 = 0{,}017"></span> до <span class="math-inline" data-tex="0{,}030^2 = 0{,}001"></span>, MSE уменьшается на 0,004.</li>
</ul>

<p>
  MAE в обоих случаях уменьшилась бы на одни и те же 0,025. MSE за тот же шаг награждает исправление второй квартиры
  в 7,5 раза щедрее: выигрыш пропорционален размеру промаха, <span class="math-inline" data-tex="(e^2 - (e - \delta)^2)/n \approx 2e\delta/n"></span>.
  Поэтому модель на MSE в первую очередь борется с крупными промахами.
</p>

<p>
  Именно MSE минимизирует линейная регрессия: <span class="math-inline" data-tex="9/46"></span> — это <span class="math-inline" data-tex="L^* = 0{,}1957"></span> из статьи по формам, минимум, к которому
  сходится градиентный спуск и который нормальные уравнения дают одной формулой. Никакие другие веса не дадут на этих
  четырёх квартирах MSE меньше. По MAE это не так: другие веса могли бы дать MAE меньше 0,391, потому что регрессию
  обучали не на ней.
</p>

<p>
  У MSE неудобные единицы, миллионы в квадрате. Зато она связана с дисперсией: MSE постоянного прогноза средней ценой
  равна дисперсии цен, 3,6875. На этом построен <span class="math-inline" data-tex="R^2"></span> из части 4.
</p>

### RMSE: корень из MSE

<div class="math-display" data-tex="\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{0{,}196} \approx 0{,}442"></div>

<p>
  Корень возвращает миллионы, и RMSE можно ставить рядом с MAE. Это среднее квадратическое модулей остатков:
  сторона квадрата, площадь которого равна средней площади четырёх квадратов из сцены.
</p>

<p>
  RMSE никогда не меньше MAE. Применим ту же формулу «средний квадрат = квадрат среднего + дисперсия»
  к модулям остатков:
</p>

<div class="math-display" data-tex="\text{RMSE}^2 = \text{MAE}^2 + \text{Var}(|e|) = 0{,}391^2 + 0{,}043 = 0{,}153 + 0{,}043 = 0{,}196"></div>

<p>
  Дисперсия не бывает отрицательной, поэтому <span class="math-inline" data-tex="\text{RMSE} \ge \text{MAE}"></span>. Равенство только при
  <span class="math-inline" data-tex="\text{Var}(|e|) = 0"></span>, когда все промахи одного размера. Так было со стартовыми весами <span class="math-inline" data-tex="w = (2, -1)"></span>, <span class="math-inline" data-tex="b = 1"></span> из статьи
  по формам: все четыре промаха ровно по 1 млн, и MAE, MSE и RMSE равны 1.
</p>

<p>
  Сверху RMSE тоже ограничена: <span class="math-inline" data-tex="\text{RMSE} \le \sqrt{n}\cdot\text{MAE}"></span>. Граница достигается, когда весь промах
  приходится на одну квартиру. Для четырёх квартир отношение RMSE/MAE лежит между 1 и <span class="math-inline" data-tex="\sqrt{4} = 2"></span>;
  у обученной регрессии оно 1,13. Чем ближе отношение к верхней границе, тем сильнее промахи сосредоточены
  на немногих объектах.
</p>

<p>
  Поэтому RMSE нельзя читать как «типичный промах». Она отражает и типичные промахи, и то, насколько среди них
  выделяются крупные.
</p>

<p>
  В интерактиве все эти формулы пересчитываются при каждом движении прогноза. Кнопка «стартовые веса» делает
  все промахи по 1 и RMSE равной MAE. «Всем прогнозам +0,5» показывает, как смещение добавляется к MSE.
  «Ошибка только у квартиры 3» доводит отношение RMSE/MAE до 2.
</p>


<div class="dt-live" id="resLive">
  <div class="dt-live-head"><strong>Интерактив: двигайте прогнозы и смотрите на метрики</strong>
    <p>Перетащите синюю черточку любой квартиры вверх или вниз, или выберите квартиру кнопкой и двигайте ползунок. Кнопки справа ставят готовые наборы прогнозов.</p></div>
  <div class="thr-fig"><svg id="resSvg" viewBox="0 0 640 330" role="img" aria-label="Цены, прогнозы и остатки четырёх квартир" style="touch-action: pan-y; cursor: ns-resize; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes" id="resPick"><button type="button" data-k="0" aria-pressed="false">кв. 1</button><button type="button" data-k="1" aria-pressed="true">кв. 2</button><button type="button" data-k="2" aria-pressed="false">кв. 3</button><button type="button" data-k="3" aria-pressed="false">кв. 4</button></div>
      <div class="dt-control"><label for="resR"><span id="resLab">прогноз для квартиры 2</span><output id="resV">—</output></label>
        <input id="resR" type="range" min="0" max="8" step="0.05" value="5.65"></div>
      <div class="dt-seg"><button type="button" id="resSq" aria-pressed="false">показать квадраты</button></div>
    </div>
    <div class="dt-presets" style="align-content: start">
      <button type="button" data-preset="fit">обученная регрессия</button>
      <button type="button" data-preset="start">стартовые веса: все промахи по 1</button>
      <button type="button" data-preset="shift">всем прогнозам +0,5</button>
      <button type="button" data-preset="one">ошибка только у квартиры 3</button>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>смещение</span><strong id="resB">—</strong></div>
      <div class="dt-metric"><span>MAE</span><strong id="resMae">—</strong></div>
      <div class="dt-metric"><span>MSE</span><strong id="resMse">—</strong></div>
      <div class="dt-metric"><span>RMSE</span><strong id="resRmse">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>RMSE / MAE (от 1 до √4 = 2)</span><strong id="resRatio">—</strong></div>
    </div>
  </div>
  <div class="dt-table"><table class="shape-table" id="resTab"><tr><th></th><th>кв. 1</th><th>кв. 2</th><th>кв. 3</th><th>кв. 4</th><th>сумма</th></tr></table></div>
  <div class="dt-formula" id="resF1"></div>
  <div class="dt-formula" id="resF2"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('resSvg');
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
  var D = {"y": [5, 5, 1, 6], "p": [4.4783, 5.6522, 1.1304, 5.7391], "s": [4, 6, 0, 7]};
  var n = D.y.length, p = D.p.slice(), sel = 1, squares = false, drag = false;
  var R = document.getElementById('resR');
  function cx(i) { return 130 + i * 140; }
  function sy(v) { return 290 - v * 30; }
  function vy(py) { return Math.max(0, Math.min(8, Math.round((290 - py) / 30 * 20) / 20)); }
  function f3(v) { return fmt(v, 3).replace('-', '−'); }
  function draw(e) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 640, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('rect', {x: cx(sel) - 55, y: 40, width: 110, height: 252, fill: '#EEF4FB'}));
    for (var v = 0; v <= 8; v++) {
      svg.appendChild(el('line', {x1: 50, y1: sy(v), x2: 630, y2: sy(v), stroke: v ? '#F1EEE6' : '#D8D4C8'}));
      svg.appendChild(el('text', {x: 44, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(v)));
    }
    svg.appendChild(el('text', {x: 52, y: 32, 'font-size': 11, fill: '#5E5850'}, 'цена, млн'));
    for (var i = 0; i < n; i++) {
      var s = Math.abs(e[i]) * 30, top = Math.min(sy(D.y[i]), sy(p[i]));
      if (squares && s > 0.5) svg.appendChild(el('rect', {x: cx(i), y: top, width: s, height: s, fill: '#F6EFD0', 'fill-opacity': 0.7, stroke: '#C29E08', 'stroke-width': 1}));
    }
    for (var j = 0; j < n; j++) {
      svg.appendChild(el('line', {x1: cx(j), y1: sy(p[j]), x2: cx(j), y2: sy(D.y[j]), stroke: '#C29E08', 'stroke-width': 3}));
      svg.appendChild(el('circle', {cx: cx(j), cy: sy(D.y[j]), r: 12, fill: '#3F3A33', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: cx(j), y: sy(D.y[j]) + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#FFFFFF'}, String(j + 1)));
      svg.appendChild(el('line', {x1: cx(j) - 24, y1: sy(p[j]), x2: cx(j) + 24, y2: sy(p[j]), stroke: j === sel ? '#2A5E9B' : '#3576C0', 'stroke-width': j === sel ? 6 : 4}));
      svg.appendChild(el('text', {x: cx(j), y: 312, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#8F7406'}, (e[j] > 0 ? '+' : '') + f3(e[j])));
    }
    svg.appendChild(el('text', {x: 630, y: 328, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, 'остаток e = y − ŷ'));
  }
  function update() {
    var e = D.y.map(function (v, i) { return v - p[i]; });
    var se = 0, sa = 0, sq = 0;
    e.forEach(function (v) { se += v; sa += Math.abs(v); sq += v * v; });
    var b = se / n, mae = sa / n, mse = sq / n, rmse = Math.sqrt(mse);
    document.getElementById('resB').textContent = f3(b);
    document.getElementById('resMae').textContent = fmt(mae, 3);
    document.getElementById('resMse').textContent = fmt(mse, 3);
    document.getElementById('resRmse').textContent = fmt(rmse, 3);
    document.getElementById('resRatio').textContent = mae > 1e-9 ? fmt(rmse / mae, 2) : '—';
    document.getElementById('resLab').textContent = 'прогноз для квартиры ' + (sel + 1);
    document.getElementById('resV').textContent = fmt(p[sel], 2);
    R.value = p[sel];
    var rows = [['e', e, se], ['|e|', e.map(Math.abs), sa], ['e²', e.map(function (v) { return v * v; }), sq]];
    var tab = document.getElementById('resTab');
    while (tab.rows.length > 1) tab.deleteRow(1);
    rows.forEach(function (r) {
      var tr = tab.insertRow();
      tr.insertCell().innerHTML = '<b>' + r[0] + '</b>';
      r[1].forEach(function (v, i) { var c = tr.insertCell(); c.textContent = f3(v); if (i === sel) c.className = 'hl'; });
      tr.insertCell().innerHTML = '<b>' + f3(r[2]) + '</b>';
    });
    var c = function (v) { return fmt(v, 3).replace(',', '{,}'); };
    tex(document.getElementById('resF1'), '\\text{MSE} = \\bar e^{\\,2} + \\text{Var}(e):\\quad ' + c(mse) + ' = ' + c(b * b) + ' + ' + c(mse - b * b), 'MSE = bias² + Var(e)');
    tex(document.getElementById('resF2'), '\\text{RMSE}^2 = \\text{MAE}^2 + \\text{Var}(|e|):\\quad ' + c(mse) + ' = ' + c(mae * mae) + ' + ' + c(mse - mae * mae), 'RMSE² = MAE² + Var(|e|)');
    draw(e);
  }
  function pick(k) {
    sel = k;
    document.querySelectorAll('#resPick [data-k]').forEach(function (o) { o.setAttribute('aria-pressed', String(+o.getAttribute('data-k') === k)); });
  }
  function fromEvent(ev, start) {
    var r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) * 640 / r.width, y = (ev.clientY - r.top) * 330 / r.height;
    if (start) pick(Math.max(0, Math.min(n - 1, Math.round((x - 130) / 140))));
    p[sel] = vy(y); update();
  }
  svg.addEventListener('pointerdown', function (ev) { drag = true; svg.setPointerCapture(ev.pointerId); fromEvent(ev, true); });
  svg.addEventListener('pointermove', function (ev) { if (drag) fromEvent(ev, false); });
  svg.addEventListener('pointerup', function () { drag = false; });
  svg.addEventListener('pointercancel', function () { drag = false; });
  R.addEventListener('input', function () { p[sel] = +R.value; update(); });
  document.querySelectorAll('#resPick [data-k]').forEach(function (b) { b.addEventListener('click', function () { pick(+b.getAttribute('data-k')); update(); }); });
  document.getElementById('resSq').addEventListener('click', function () {
    squares = !squares; this.setAttribute('aria-pressed', String(squares)); this.textContent = squares ? 'скрыть квадраты' : 'показать квадраты'; update();
  });
  document.querySelectorAll('#resLive [data-preset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-preset');
      if (k === 'fit') p = D.p.slice();
      if (k === 'start') p = D.s.slice();
      if (k === 'shift') p = D.p.map(function (v) { return v + 0.5; });
      if (k === 'one') { p = D.y.slice(); p[2] = D.y[2] + 2; pick(2); }
      update();
    });
  });
  update();
})();
</script>

## Часть 2. MAE против RMSE: один выброс

<p>
  Пусть регрессия уже обучена, а в базе цену четвёртой квартиры записали с лишним нулём: 60 млн вместо 6.
  Прогноз остаётся прежним, <span class="math-inline" data-tex="5{,}739"></span>, а остаток становится <span class="math-inline" data-tex="+54{,}26"></span> вместо <span class="math-inline" data-tex="+0{,}26"></span>.
</p>


<div class="dt-live" id="outLive">
  <div class="dt-live-head"><strong>Интерактив: опечатка в цене одной квартиры</strong>
    <p>Прогнозы регрессии остаются прежними, меняется только записанная цена квартиры 4. Сверху модули остатков, снизу их квадраты.</p></div>
  <div class="thr-fig"><svg id="outSvg" viewBox="0 0 600 360" role="img" aria-label="Модули и квадраты остатков четырёх квартир"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-control"><label for="outR"><span>цена квартиры 4, млн</span><output id="outV">6</output></label>
        <input id="outR" type="range" min="0" max="60" step="0.5" value="6"></div>
      <div class="dt-presets"><button type="button" data-v="6">6, как было</button><button type="button" data-v="60">лишний ноль: 60</button></div>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>MAE</span><strong id="outMae">—</strong></div>
      <div class="dt-metric"><span>RMSE</span><strong id="outRmse">—</strong></div>
    </div>
    <div class="dt-metrics">
      <div class="dt-metric"><span>RMSE / MAE</span><strong id="outRatio">—</strong></div>
      <div class="dt-metric"><span>доля квартиры 4 в сумме квадратов</span><strong id="outShare">—</strong></div>
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
  var D = {"y": [5, 5, 1, 6], "p": [4.4783, 5.6522, 1.1304, 5.7391]};
  var R = document.getElementById('outR');
  function cx(i) { return 120 + i * 130; }
  function lab(v) { return v >= 100 ? String(Math.round(v)) : fmt(v, v < 10 ? 3 : 1); }
  function update() {
    var y = D.y.slice(); y[3] = +R.value;
    var e = y.map(function (v, i) { return v - D.p[i]; });
    var a = e.map(Math.abs), q = e.map(function (v) { return v * v; });
    var sa = a.reduce(function (s, v) { return s + v; }, 0), sq = q.reduce(function (s, v) { return s + v; }, 0);
    var maeV = sa / 4, rmseV = Math.sqrt(sq / 4);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 360, fill: '#FFFFFF'}));
    var P1 = {top: 34, h: 120, max: Math.max(1, Math.max.apply(null, a))}, P2 = {top: 204, h: 120, max: Math.max(1, Math.max.apply(null, q))};
    [[P1, '|e|, млн', a, '#C29E08', '#F6EFD0', maeV, 'MAE '], [P2, 'e², млн²', q, '#3576C0', '#DCE8F5', sq / 4, 'MSE ']].forEach(function (r) {
      var P = r[0], vals = r[2], base = P.top + P.h;
      svg.appendChild(el('line', {x1: 40, y1: base, x2: 590, y2: base, stroke: '#D8D4C8'}));
      svg.appendChild(el('text', {x: 40, y: P.top - 14, 'font-size': 13, 'font-weight': 700, fill: '#111111'}, r[1] + ' (шкала до ' + lab(P.max) + ')'));
      vals.forEach(function (v, i) {
        var h = v / P.max * P.h;
        svg.appendChild(el('rect', {x: cx(i) - 30, y: base - h, width: 60, height: h, fill: r[4], stroke: r[3], 'stroke-width': 1.4}));
        svg.appendChild(el('text', {x: cx(i), y: base - h - 5, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, lab(v)));
        svg.appendChild(el('text', {x: cx(i), y: base + 15, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: i === 3 ? '#2A5E9B' : '#5E5850'}, 'кв. ' + (i + 1)));
      });
      var my = base - r[5] / P.max * P.h;
      svg.appendChild(el('line', {x1: 44, y1: my, x2: 586, y2: my, stroke: r[3], 'stroke-width': 2, 'stroke-dasharray': '6 4'}));
      svg.appendChild(el('text', {x: 586, y: my - 5, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: r[3]}, r[6] + lab(r[5])));
    });
    document.getElementById('outV').textContent = fmt(y[3], y[3] % 1 ? 1 : 0);
    document.getElementById('outMae').textContent = fmt(maeV, 3);
    document.getElementById('outRmse').textContent = fmt(rmseV, 3);
    document.getElementById('outRatio').textContent = fmt(rmseV / maeV, 2);
    document.getElementById('outShare').textContent = fmt(q[3] / sq * 100, q[3] / sq > 0.995 ? 2 : 0) + ' %';
    var c = function (v, d) { return fmt(v, d).replace(',', '{,}'); };
    tex(document.getElementById('outF1'), '\\text{MAE} = \\dfrac{' + c(sa - a[3], 3) + ' + ' + c(a[3], 3) + '}{4} = ' + c(maeV, 3), 'MAE ' + fmt(maeV, 3));
    tex(document.getElementById('outF2'), '\\text{RMSE} = \\sqrt{\\dfrac{' + c(sq - q[3], 3) + ' + ' + c(q[3], q[3] >= 100 ? 1 : 3) + '}{4}} = ' + c(rmseV, 3), 'RMSE ' + fmt(rmseV, 3));
  }
  R.addEventListener('input', update);
  document.querySelectorAll('#outLive [data-v]').forEach(function (b) { b.addEventListener('click', function () { R.value = b.getAttribute('data-v'); update(); }); });
  update();
})();
</script>


<p>
  MAE выросла с 0,391 до 13,89, в 35 раз. RMSE — с 0,442 до 27,13, в 61 раз. Четвёртая квартира даёт 99,98 % суммы
  квадратов, и отношение RMSE/MAE подходит к верхней границе 2: почти весь промах приходится на один объект.
  Одна опечатка сделала RMSE числом про эту опечатку, а не про модель.
</p>

<ul>
  <li>RMSE подходит, если большой промах действительно хуже нескольких маленьких той же суммы. Банк, который оценивает
    квартиру как залог, переживёт много промахов по 200 тысяч, а один промах на 5 млн означает невозвратный кредит.</li>
  <li>MAE подходит, если каждый рубль ошибки стоит одинаково, или если в данных есть мусор вроде опечаток,
    который не должен решать оценку.</li>
</ul>

<p>
  Резкий рост RMSE при спокойной MAE — повод посмотреть на данные: часто там опечатка, а не плохая модель.
</p>


## Часть 3. Какой прогноз лучший для каждой метрики

<p>
  Пусть модель не смотрит на признаки и всем квартирам называет одно число <span class="math-inline" data-tex="c"></span>. Какое <span class="math-inline" data-tex="c"></span> лучше? Ответ зависит
  от метрики: сумму квадратов минимизирует среднее, сумму модулей — медиана. Это не частность постоянного прогноза:
  метрика сама решает, что считать правильным ответом.
</p>


<div class="dt-live" id="cLive">
  <div class="dt-live-head"><strong>Интерактив: лучший постоянный прогноз для MSE и MAE</strong>
    <p>Двигайте константу c — прогноз, одинаковый для всех четырёх квартир. Кривая показывает метрику при каждом c, синяя точка — её минимум.</p></div>
  <div class="thr-fig"><svg id="cLiveSvg" viewBox="0 0 600 330" role="img" aria-label="Метрика постоянного прогноза в зависимости от c"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-m="mse" aria-pressed="true">MSE</button><button type="button" data-m="mae" aria-pressed="false">MAE</button></div>
      <div class="dt-control"><label for="cLiveC"><span>константа c, млн</span><output id="cLiveCv">3</output></label>
        <input id="cLiveC" type="range" min="0" max="8" step="0.05" value="3"></div>
      <div class="dt-presets"><button type="button" data-alt="0" aria-pressed="true">цены как есть</button><button type="button" data-alt="1" aria-pressed="false">кв. 4 с лишним нулём: 60</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span id="cLiveName">—</span><strong id="cLiveVal">—</strong></div>
      <div class="dt-metric"><span>лучшее c</span><strong id="cLiveBest">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>среднее и медиана цен</span><strong id="cLiveMm">—</strong></div>
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
  var Y0 = [5, 5, 1, 6], ALT = [3, 60];
  var mode = 'mse', useAlt = false, tau = 0.9;
  var C = document.getElementById('cLiveC'), QR = document.getElementById('cLiveQ');
  var NAMES = {mse: 'MSE', mae: 'MAE', mape: 'MAPE', q: 'квантильная потеря'};
  function ys() { var y = Y0.slice(); if (useAlt) y[ALT[0]] = ALT[1]; return y; }
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
  function fmtv(v) { return mode === 'mape' ? fmt(v * 100, 1) + ' %' : fmt(v, 3); }
  function update() {
    var y = ys(), top = Math.max(8, Math.ceil(Math.max.apply(null, y) + 2));
    C.max = top; var c = Math.min(+C.value, top);
    var sx = function (v) { return 50 + v * 520 / top; };
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('line', {x1: sx(0), y1: 60, x2: sx(top), y2: 60, stroke: '#D8D4C8', 'stroke-width': 1.4}));
    var stepT = top <= 10 ? 1 : 10;
    for (var t = 0; t <= top; t += stepT) {
      svg.appendChild(el('text', {x: sx(t), y: 316, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, String(t)));
      svg.appendChild(el('line', {x1: sx(t), y1: 296, x2: sx(t), y2: 302, stroke: '#5E5850'}));
    }
    svg.appendChild(el('text', {x: sx(top), y: 30, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'цены квартир, млн'));
    var vals = [], best = Infinity, K = Math.round(top * 100);
    for (var k = 0; k <= K; k++) { var v = metric(y, k * top / K); vals.push(v); if (v < best) best = v; }
    var finite = isFinite(best), lo = null, hi = null;
    if (finite) vals.forEach(function (v, k) { if (v <= best + 1e-9 * Math.max(1, best)) { if (lo === null) lo = k * top / K; hi = k * top / K; } });
    if (finite) {
      var vmax = Math.max.apply(null, vals), py = function (v) { return 296 - v / vmax * 190; };
      svg.appendChild(el('path', {d: vals.map(function (v, k) { return (k ? 'L' : 'M') + sx(k * top / K).toFixed(1) + ' ' + py(v).toFixed(1); }).join(' '), fill: 'none', stroke: '#C29E08', 'stroke-width': 3}));
      svg.appendChild(el('line', {x1: sx(lo), y1: py(best), x2: sx(hi), y2: py(best), stroke: '#2A5E9B', 'stroke-width': 5}));
      svg.appendChild(el('circle', {cx: sx((lo + hi) / 2), cy: py(best), r: 6, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
      svg.appendChild(el('line', {x1: sx(c), y1: py(metric(y, c)), x2: sx(c), y2: 296, stroke: '#C29E08', 'stroke-dasharray': '3 3'}));
      svg.appendChild(el('circle', {cx: sx(c), cy: py(metric(y, c)), r: 6, fill: '#8F7406', stroke: '#FFFFFF', 'stroke-width': 2}));
    } else {
      svg.appendChild(el('text', {x: 300, y: 190, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#9C0908'}, 'MAPE не определена: в ценах есть ноль'));
    }
    svg.appendChild(el('line', {x1: sx(c), y1: 40, x2: sx(c), y2: 80, stroke: '#C29E08', 'stroke-width': 3}));
    var seen = {};
    y.forEach(function (v, i) {
      var dy = (seen[v] = (seen[v] || 0) + 1) > 1 ? -18 : 0;
      svg.appendChild(el('circle', {cx: sx(v), cy: 60 + dy, r: 9, fill: '#3F3A33', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: sx(v), y: 64 + dy, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    var srt = y.slice().sort(function (a, b) { return a - b; });
    var mean = y.reduce(function (s, v) { return s + v; }, 0) / y.length, med = (srt[1] + srt[2]) / 2;
    document.getElementById('cLiveCv').textContent = fmt(c, 2);
    document.getElementById('cLiveName').textContent = NAMES[mode] + ' при этом c';
    document.getElementById('cLiveVal').textContent = finite ? fmtv(metric(y, c)) : '∞';
    document.getElementById('cLiveBest').textContent = !finite ? '—' : (hi - lo < 0.05 ? fmt((lo + hi) / 2, 2) : 'от ' + fmt(lo, 2) + ' до ' + fmt(hi, 2));
    document.getElementById('cLiveMm').textContent = 'среднее ' + fmt(mean, 2) + ', медиана ' + fmt(med, 2);
    var qb = document.querySelector('#cLive [data-qbox]'); if (qb) qb.style.display = mode === 'q' ? '' : 'none';
  }
  C.addEventListener('input', update);
  if (QR) QR.addEventListener('input', function () { tau = +QR.value; document.getElementById('cLiveQv').textContent = fmt(tau, 2); update(); });
  document.querySelectorAll('#cLive [data-m]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.getAttribute('data-m');
      document.querySelectorAll('#cLive [data-m]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  document.querySelectorAll('#cLive [data-alt]').forEach(function (b) {
    b.addEventListener('click', function () { useAlt = b.getAttribute('data-alt') === '1';
      document.querySelectorAll('#cLive [data-alt]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  update();
})();
</script>


<p>
  MSE минимальна при <span class="math-inline" data-tex="c = 4{,}25"></span>, средней цене: MSE 3,6875, RMSE 1,92. MAE минимальна при <span class="math-inline" data-tex="c = 5"></span>, медиане
  цен 1, 5, 5, 6: MAE 1,25. Среднее ниже медианы, потому что его тянет вниз дешёвая третья квартира. Средняя цена
  ошибается по модулю сильнее медианы, 1,625 против 1,25, зато по квадрату лучше.
</p>

<p>
  Кнопка «лишний ноль» показывает, как это работает при выбросе. Среднее прыгает с 4,25 до 17,75: такой прогноз
  не подходит ни одной квартире. Медиана остаётся 5.
</p>

<p>
  То же верно и для настоящих моделей. Регрессия, обученная на квадрате ошибки, предсказывает среднюю цену квартир
  с такими площадью и возрастом, а регрессия на модуле — медианную. Если обучать на MSE, а оценивать по MAE, модель
  целится в одно, а оценивают её за другое. На симметричных данных разница мала, на данных с выбросами она видна,
  это часть 9.
</p>


## Часть 4. Базовая модель и R²

<p>
  Само по себе MAE 0,391 млн не говорит, хорошо это или плохо. Нужен эталон, и самый простой эталон — модель,
  которая на признаки не смотрит вовсе.
</p>


<div class="stage" id="stageR2" tabindex="0">
  <div class="stage-figure">
<svg id="r2Svg" viewBox="0 0 960 440" role="img" aria-label="Суммы квадратов от среднего и от прогноза модели"><style>#r2Svg { font-family: Helvetica, Arial, sans-serif; }</style>
<rect x="0" y="0" width="960" height="440" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/>
<g data-key="axes"><line x1="110" y1="340" x2="950" y2="340" stroke="#D8D4C8" stroke-width="1.2"/><line x1="104" y1="340" x2="110" y2="340" stroke="#5E5850" stroke-width="1"/><text x="98" y="344" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="104" y1="297" x2="110" y2="297" stroke="#5E5850" stroke-width="1"/><text x="98" y="301" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">1</text><line x1="110" y1="297" x2="950" y2="297" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="254" x2="110" y2="254" stroke="#5E5850" stroke-width="1"/><text x="98" y="258" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="110" y1="254" x2="950" y2="254" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="211" x2="110" y2="211" stroke="#5E5850" stroke-width="1"/><text x="98" y="215" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">3</text><line x1="110" y1="211" x2="950" y2="211" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="168" x2="110" y2="168" stroke="#5E5850" stroke-width="1"/><text x="98" y="172" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="110" y1="168" x2="950" y2="168" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="125" x2="110" y2="125" stroke="#5E5850" stroke-width="1"/><text x="98" y="129" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">5</text><line x1="110" y1="125" x2="950" y2="125" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="82" x2="110" y2="82" stroke="#5E5850" stroke-width="1"/><text x="98" y="86" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="110" y1="82" x2="950" y2="82" stroke="#F1EEE6" stroke-width="1"/><line x1="104" y1="39" x2="110" y2="39" stroke="#5E5850" stroke-width="1"/><text x="98" y="43" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">7</text><line x1="110" y1="39" x2="950" y2="39" stroke="#F1EEE6" stroke-width="1"/><text x="60" y="189.5" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 60 189.5)">цена, млн</text><text x="190" y="360" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 1: 20 м², 10 лет</text><text x="380" y="360" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 2: 30 м², 10 лет</text><text x="570" y="360" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 3: 10 м², 30 лет</text><text x="760" y="360" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">кв. 4: 40 м², 20 лет</text></g>
<g data-key="sq_m" data-only="1"><rect x="190" y="125" width="32.25" height="32.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="228.25" y="146.12" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">0,562</text><rect x="380" y="125" width="32.25" height="32.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="418.25" y="146.12" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">0,562</text><rect x="570" y="157.25" width="139.75" height="139.75" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="639.88" y="232.12" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">10,56</text><rect x="760" y="82" width="75.25" height="75.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="797.62" y="124.62" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">3,06</text></g>
<g data-key="sq_t" data-only="1"><rect x="190" y="125" width="22.43" height="22.43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="218.43" y="141.22" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,272</text><rect x="380" y="96.96" width="28.04" height="28.04" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="414.04" y="115.98" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,425</text><rect x="570" y="291.39" width="5.61" height="5.61" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="581.61" y="299.2" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,017</text><rect x="760" y="82" width="11.22" height="11.22" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="777.22" y="92.61" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,068</text></g>
<g data-key="sq_s" data-only="1"><rect x="190" y="125" width="43" height="43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="239" y="151.5" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">1,00</text><rect x="380" y="82" width="43" height="43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="429" y="108.5" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">1,00</text><rect x="570" y="297" width="43" height="43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="619" y="323.5" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">1,00</text><rect x="760" y="39" width="43" height="43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><text x="809" y="65.5" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">1,00</text></g>
<g data-key="sq_o" data-only="1"><rect x="190" y="125" width="43" height="43" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="239" y="151.5" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">1,00</text><rect x="380" y="125" width="43" height="43" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="429" y="151.5" font-size="13" fill="#2A5E9B" text-anchor="start" font-weight="700">1,00</text><rect x="570" y="110.67" width="186.33" height="186.33" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="663.17" y="208.83" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">18,78</text><rect x="760" y="82" width="100.33" height="100.33" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><text x="810.17" y="137.17" font-size="13" fill="#2A5E9B" text-anchor="middle" font-weight="700">5,44</text></g>
<g data-key="sq_m0" data-only="1"><rect x="190" y="125" width="32.25" height="32.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><rect x="380" y="125" width="32.25" height="32.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><rect x="570" y="157.25" width="139.75" height="139.75" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/><rect x="760" y="82" width="75.25" height="75.25" rx="0" fill="#DCE8F5" stroke="#3576C0" stroke-width="1.3" fill-opacity="0.85"/></g>
<g data-key="sq_t0" data-only="1"><rect x="190" y="125" width="22.43" height="22.43" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><rect x="380" y="96.96" width="28.04" height="28.04" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><rect x="570" y="291.39" width="5.61" height="5.61" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/><rect x="760" y="82" width="11.22" height="11.22" rx="0" fill="#F6EFD0" stroke="#C29E08" stroke-width="1.3" fill-opacity="0.85"/></g>
<g data-key="mline" data-only="1"><line x1="110" y1="157.25" x2="950" y2="157.25" stroke="#5E5850" stroke-width="2" stroke-dasharray="7 5"/><text x="946" y="151.25" font-size="12" fill="#5E5850" text-anchor="end" font-weight="700">среднее 4,25</text></g>
<g data-key="dots"><circle cx="190" cy="125.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="176" y="130" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">1</text><circle cx="380" cy="125.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="366" y="130" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">2</text><circle cx="570" cy="297.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="556" y="302" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">3</text><circle cx="760" cy="82.0" r="7" fill="#3F3A33" stroke="#FFFFFF" stroke-width="1.5"/><text x="746" y="87" font-size="14" fill="#3F3A33" text-anchor="end" font-weight="700">4</text></g>
<g data-key="p_t" data-only="1"><line x1="168" y1="147.43" x2="212" y2="147.43" stroke="#3576C0" stroke-width="4"/><line x1="358" y1="96.96" x2="402" y2="96.96" stroke="#3576C0" stroke-width="4"/><line x1="548" y1="291.39" x2="592" y2="291.39" stroke="#3576C0" stroke-width="4"/><line x1="738" y1="93.22" x2="782" y2="93.22" stroke="#3576C0" stroke-width="4"/></g>
<g data-key="p_s" data-only="1"><line x1="168" y1="168" x2="212" y2="168" stroke="#5F9420" stroke-width="4"/><line x1="358" y1="82" x2="402" y2="82" stroke="#5F9420" stroke-width="4"/><line x1="548" y1="340" x2="592" y2="340" stroke="#5F9420" stroke-width="4"/><line x1="738" y1="39" x2="782" y2="39" stroke="#5F9420" stroke-width="4"/></g>
<g data-key="p_o" data-only="1"><line x1="168" y1="168" x2="212" y2="168" stroke="#5E5850" stroke-width="4"/><line x1="358" y1="168" x2="402" y2="168" stroke="#5E5850" stroke-width="4"/><line x1="548" y1="110.67" x2="592" y2="110.67" stroke="#5E5850" stroke-width="4"/><line x1="738" y1="182.33" x2="782" y2="182.33" stroke="#5E5850" stroke-width="4"/></g>
<g data-key="f_sst" data-only="1"><foreignObject x="40" y="372" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{SST} = 0{,}75^2 + 0{,}75^2 + 3{,}25^2 + 1{,}75^2 = 14{,}75 \qquad \text{MSE константы} = 3{,}6875"></div></foreignObject></g>
<g data-key="f_sse" data-only="1"><foreignObject x="40" y="372" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="\text{SSE} = \tfrac{144 + 225 + 9 + 36}{529} = \tfrac{18}{23} \approx 0{,}783"></div></foreignObject></g>
<g data-key="f_r2" data-only="1"><foreignObject x="40" y="372" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2 = 1 - \dfrac{\text{SSE}}{\text{SST}} = 1 - \dfrac{0{,}783}{14{,}75} = 0{,}947"></div></foreignObject></g>
<g data-key="f_s" data-only="1"><foreignObject x="40" y="372" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2_{\text{старт}} = 1 - \dfrac{4}{14{,}75} = 0{,}729"></div></foreignObject></g>
<g data-key="f_o" data-only="1"><foreignObject x="40" y="372" width="880" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:19px;color:#111111;font-weight:400" data-tex="R^2_{\text{среднее остальных}} = 1 - \dfrac{26{,}22}{14{,}75} = -0{,}778"></div></foreignObject></g>
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
      <p>Самая простая модель не смотрит ни на площадь, ни на возраст и всем отвечает средней ценой, 4,25 млн. Синие квадраты — квадраты отклонений от среднего, их сумма SST (total sum of squares) <span class="math-inline" data-tex="= 14{,}75"></span>.</p>
<p>Почти три четверти суммы даёт третья квартира: она стоит 1 млн, на 3,25 дешевле среднего. MSE такой константы <span class="math-inline" data-tex="3{,}6875"></span> — это дисперсия цен.</p>
    </div>
    <div class="step-panel" data-on="axes dots p_t sq_t f_sse" data-focus="sq_t f_sse">
      <div class="step-kicker">Шаг 2 · регрессия</div>
      <h4>Квадраты остатков регрессии</h4>
      <p>Те же квадраты для обученной регрессии, их сумма SSE <span class="math-inline" data-tex="= 18/23 \approx 0{,}783"></span>. Рядом с синими квадратами они почти не видны.</p>
    </div>
    <div class="step-panel" data-on="axes dots mline sq_m0 p_t sq_t0 f_r2" data-focus="f_r2">
      <div class="step-kicker">Шаг 3 · R²</div>
      <h4>R²: какую долю разброса модель убрала</h4>
      <p>Регрессия оставила <span class="math-inline" data-tex="0{,}783 / 14{,}75 = 5{,}3\,\%"></span> квадратичного разброса, значит, убрала <span class="math-inline" data-tex="94{,}7\,\%"></span>. Это коэффициент детерминации <span class="math-inline" data-tex="R^2"></span>.</p>
<p><span class="math-inline" data-tex="R^2"></span> не зависит от единиц: в миллионах или в рублях получится то же число. <span class="math-inline" data-tex="R^2 = 0"></span> значит «не лучше средней цены», <span class="math-inline" data-tex="R^2 = 1"></span> — прогноз без ошибок. Насколько ошибка велика в рублях, <span class="math-inline" data-tex="R^2"></span> не показывает.</p>
    </div>
    <div class="step-panel" data-on="axes dots p_s sq_s f_s" data-focus="sq_s f_s">
      <div class="step-kicker">Шаг 4 · старт</div>
      <h4>Модель со стартовыми весами</h4>
      <p>Зелёные черточки — прогноз со стартовыми весами <span class="math-inline" data-tex="w = (2, -1)"></span>, <span class="math-inline" data-tex="b = 1"></span>, с которых в статье по формам начинался градиентный спуск. Все четыре промаха по 1 млн, SSE <span class="math-inline" data-tex="= 4"></span>.</p>
<p><span class="math-inline" data-tex="R^2 = 0{,}729"></span>, то же число, что в статье по формам: даже веса, выбранные наугад, убирают почти три четверти разброса. После обучения <span class="math-inline" data-tex="R^2"></span> вырос до 0,947.</p>
    </div>
    <div class="step-panel" data-on="axes dots mline p_o sq_o f_o" data-focus="sq_o f_o">
      <div class="step-kicker">Шаг 5 · ниже нуля</div>
      <h4>R² бывает отрицательным</h4>
      <p>Серые черточки — «модель средней цены», которой не дали увидеть квартиру: каждой она отвечает средним по остальным трём. Третьей квартире — <span class="math-inline" data-tex="(5 + 5 + 6)/3 = 5{,}33"></span>, хотя та стоит 1. Прогноз сдвигается от каждой квартиры, и квадраты выходят больше синих из первого шага: <span class="math-inline" data-tex="26{,}22"></span>.</p>
<p><span class="math-inline" data-tex="R^2 = -0{,}778"></span>. На новых данных модель может быть хуже среднего этих данных: эталоном служит среднее, которое модель знать не может. С самой регрессией та же история, это часть 5.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>


<p>
  Все модели в одной таблице. Средняя цена остальных трёх и стартовые веса посчитаны на тех же квартирах:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Модель</th><th>MAE</th><th>RMSE</th><th><span class="math-inline" data-tex="R^2"></span></th></tr>
  <tr><td>средняя цена остальных трёх</td><td>2,167</td><td>2,560</td><td>−0,778</td></tr>
  <tr><td>стартовые веса <span class="math-inline" data-tex="w = (2, -1)"></span>, <span class="math-inline" data-tex="b = 1"></span></td><td>1,000</td><td>1,000</td><td>0,729</td></tr>
  <tr><td>обученная регрессия</td><td>0,391</td><td>0,442</td><td>0,947</td></tr>
</table></div>


<p>
  Формулу <span class="math-inline" data-tex="R^2"></span> можно переписать через MSE: <span class="math-inline" data-tex="R^2 = 1 - \text{MSE} / \text{Var}(y)"></span>, где <span class="math-inline" data-tex="\text{Var}(y)"></span> — разброс
  настоящих ответов в данных, на которых считаем. Отсюда следует подвох: одна и та же модель с одним и тем же MSE получит
  разный <span class="math-inline" data-tex="R^2"></span> на разных данных. При MSE 0,196 и дисперсии цен 3,69 получаем 0,947. Если бы цены в выборке были
  разбросаны меньше, с дисперсией 0,5, тот же MSE дал бы 0,61. Поэтому <span class="math-inline" data-tex="R^2"></span> сравнивают только на одних и тех же данных.
</p>

<p>
  В sklearn <code>r2_score(y_true, y_pred)</code> не симметрична: сначала настоящие ответы, потом прогноз.
  Если перепутать порядок, эталоном станет среднее прогнозов, и число будет другим.
</p>


## Часть 5. Честная проверка

<p>
  Все числа выше посчитаны на тех же четырёх квартирах, на которых регрессия подбирала веса. Проверим её честно,
  как в статье о метриках классификации: каждую квартиру предсказывает регрессия, обученная на трёх остальных
  (leave-one-out).
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Плоскость по трём остальным (<span class="math-inline" data-tex="a"></span> — площадь, <span class="math-inline" data-tex="g"></span> — возраст)</th><th>Цена</th><th>Прогноз без неё</th><th>Остаток</th><th>Прогноз, если её видели</th></tr>
  <tr><td>1</td><td><span class="math-inline" data-tex="1{,}5 \cdot a - 0{,}5 \cdot g + 1"></span></td><td>5</td><td>3,5</td><td>+1,5</td><td>4,478</td></tr>
  <tr><td>2</td><td><span class="math-inline" data-tex="1{,}2 \cdot a - 1{,}4 \cdot g + 4"></span></td><td>5</td><td>6,2</td><td>−1,2</td><td>5,652</td></tr>
  <tr class="hl"><td>3</td><td><span class="math-inline" data-tex="0 \cdot a + 1 \cdot g + 4"></span></td><td>1</td><td>7,0</td><td>−6,0</td><td>1,130</td></tr>
  <tr><td>4</td><td><span class="math-inline" data-tex="0 \cdot a - 2 \cdot g + 7"></span></td><td>6</td><td>3,0</td><td>+3,0</td><td>5,739</td></tr>
</table></div>


<p>
  У модели три параметра: два веса и свободный член. Через три точки плоскость проходит точно, поэтому каждая
  регрессия из таблицы на своих трёх квартирах не ошибается ни на рубль. На четвёртой всё иначе. Без третьей квартиры,
  единственной в старом доме, все оставшиеся дома моложе, и по ним выходит «чем старше дом, тем дороже»: <span class="math-inline" data-tex="+1"></span> млн
  за десять лет. Третьей квартире такая плоскость даёт 7 млн при цене 1.
</p>

<p>
  Честные метрики: MAE 2,925, RMSE 3,49, <span class="math-inline" data-tex="R^2 = -2{,}30"></span>. Это хуже, чем средняя цена остальных трёх (<span class="math-inline" data-tex="R^2 = -0{,}78"></span>).
  На обучении было <span class="math-inline" data-tex="R^2 = 0{,}947"></span>. Разница показывает, насколько хорошо плоскость легла на эти четыре точки,
  а не то, как она предскажет пятую.
</p>

<p>
  На четырёх квартирах это крайний случай, но разрыв между обучением и новыми данными есть всегда, и он тем больше,
  чем меньше объектов приходится на параметр. Синтетические квартиры, устроенные как наши, плюс шум 0,8 млн;
  средние по 200 повторам:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Квартир в обучении</th><th><span class="math-inline" data-tex="R^2"></span> на них же</th><th><span class="math-inline" data-tex="R^2"></span> на новых</th><th>MAE на них же</th><th>MAE на новых</th></tr>
  <tr><td>4</td><td>0,932</td><td>0,495</td><td>0,284</td><td>1,205</td></tr>
  <tr><td>10</td><td>0,907</td><td>0,844</td><td>0,527</td><td>0,754</td></tr>
  <tr><td>40</td><td>0,894</td><td>0,881</td><td>0,610</td><td>0,662</td></tr>
  <tr><td>400</td><td>0,890</td><td>0,889</td><td>0,635</td><td>0,641</td></tr>
</table></div>


<p>
  На 400 квартирах метрики на обучении и на новых данных почти совпадают, на четырёх расходятся в разы.
  Для линейной регрессии иногда считают скорректированный <span class="math-inline" data-tex="R^2"></span>, который штрафует за число признаков <span class="math-inline" data-tex="p"></span>:
  <span class="math-inline" data-tex="1 - (1 - R^2)\frac{n - 1}{n - p - 1}"></span>. У нас <span class="math-inline" data-tex="1 - 0{,}053 \cdot 3/1 = 0{,}84"></span>. Это поправка, а не замена
  проверке: честный <span class="math-inline" data-tex="R^2"></span> здесь отрицательный.
</p>


## Часть 6. Относительные ошибки: MAPE и WAPE

<p>
  Промах в 1 млн для квартиры за 1 млн и для квартиры за 6 млн ощущается по-разному. Относительная ошибка
  делит модуль остатка на настоящий ответ:
</p>

<div class="math-display" data-tex="\text{MAPE} = \frac{1}{n}\sum_i \frac{|y_i - \hat y_i|}{|y_i|}"></div>


<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Цена</th><th><span class="math-inline" data-tex="|e|"></span> обученной</th><th><span class="math-inline" data-tex="|e| / y"></span></th><th><span class="math-inline" data-tex="|e|"></span> стартовой</th><th><span class="math-inline" data-tex="|e| / y"></span></th></tr>
  <tr><td>1</td><td>5</td><td>0,522</td><td>10,4 %</td><td>1</td><td>20,0 %</td></tr>
  <tr><td>2</td><td>5</td><td>0,652</td><td>13,0 %</td><td>1</td><td>20,0 %</td></tr>
  <tr class="hl"><td>3</td><td>1</td><td>0,130</td><td>13,0 %</td><td>1</td><td>100,0 %</td></tr>
  <tr><td>4</td><td>6</td><td>0,261</td><td>4,3 %</td><td>1</td><td>16,7 %</td></tr>
  <tr><td><b>MAPE</b></td><td></td><td></td><td><b>10,2 %</b></td><td></td><td><b>39,2 %</b></td></tr>
  <tr><td><b>WAPE</b></td><td>17</td><td>1,565</td><td><b>9,2 %</b></td><td>4</td><td><b>23,5 %</b></td></tr>
</table></div>


<p>
  У обученной регрессии MAPE 10,2 %. У стартовых весов все промахи по 1 млн, но MAPE 39,2 %: третья квартира
  за 1 млн с прогнозом 0 даёт 100 %, остальные по 17–20 %. У MAPE три известные проблемы.
</p>

<ul>
  <li><b>Ноль в ответах.</b> Если цена не указана и записана как 0, MAPE становится бесконечной. В sklearn
    <code>mean_absolute_percentage_error</code> в этом случае делит на очень маленькое число и возвращает огромное значение.</li>
  <li><b>Вес дешёвых объектов.</b> MAPE считает квартиру за 1 млн в шесть раз важнее квартиры за 6 млн. Лучший
    постоянный прогноз по MAPE для наших цен — 1 млн, цена самой дешёвой квартиры: остальные три промаха в процентах
    обходятся дешевле, чем промах на ней. Это видно в интерактиве части 7.</li>
  <li><b>Несимметричность.</b> Недооценка не может стоить больше 100 % (прогноз 0), а переоценка не ограничена.
    Поэтому модель, обученная на MAPE, занижает прогнозы.</li>
</ul>

<p>
  WAPE (weighted absolute percentage error) делит сумму модулей ошибок на сумму ответов:
  <span class="math-inline" data-tex="\text{WAPE} = \sum |e_i| / \sum |y_i| = 1{,}565 / 17 = 9{,}2\,\%"></span>. Это MAE, делённая на среднюю цену.
  Её можно считать при нулевых ответах, и вклад каждой квартиры пропорционален промаху в рублях. WAPE обычно берут,
  когда нужен процент для отчёта: на сколько процентов оценка промахивается в сумме.
</p>


## Часть 7. Когда недооценка и переоценка стоят по-разному

<p>
  MAE и RMSE одинаково наказывают промах вверх и вниз. Иногда одна сторона дороже. Банк оценивает квартиру как залог:
  если оценка выше настоящей цены, при продаже залога деньги не вернутся, а если ниже — клиент получит кредит поменьше.
  Переоценка здесь намного дороже.
</p>

<p>
  Для этого есть квантильная потеря (pinball loss) с параметром <span class="math-inline" data-tex="\tau"></span> от 0 до 1:
</p>

<div class="math-display" data-tex="L_\tau(e) = \begin{cases} \tau \cdot e, &amp; e \ge 0 \ \text{(недооценка)} \\ (\tau - 1) \cdot e, &amp; e &lt; 0 \ \text{(переоценка)} \end{cases}"></div>

<p>
  При <span class="math-inline" data-tex="\tau = 0{,}1"></span> миллион переоценки стоит <span class="math-inline" data-tex="0{,}9"></span>, а миллион недооценки <span class="math-inline" data-tex="0{,}1"></span>, в девять раз дешевле. Лучшей
  константой становится 10-й процентиль цен: у наших четырёх квартир это 1 млн. При <span class="math-inline" data-tex="\tau = 0{,}75"></span> — любое число
  от 5 до 6, при <span class="math-inline" data-tex="\tau = 0{,}9"></span> — 6. При <span class="math-inline" data-tex="\tau = 0{,}5"></span> потеря равна половине модуля, и получается медиана.
</p>

<p>
  Модель, обученная на квантильной потере, предсказывает не среднюю цену, а цену, ниже которой окажется доля <span class="math-inline" data-tex="\tau"></span>
  похожих квартир. Две такие модели, с <span class="math-inline" data-tex="\tau = 0{,}1"></span> и <span class="math-inline" data-tex="\tau = 0{,}9"></span>, дают интервал, куда попадает 80 % цен.
  В sklearn это <code>QuantileRegressor</code> и <code>GradientBoostingRegressor</code> с параметрами
  <code>loss="quantile"</code> и <code>alpha=0.9</code>, а оценивают такие модели функцией <code>mean_pinball_loss</code>.
</p>


<div class="dt-live" id="qLive">
  <div class="dt-live-head"><strong>Интерактив: MAPE и квантильная потеря сдвигают лучший прогноз</strong>
    <p>Двигайте константу c — прогноз, одинаковый для всех четырёх квартир. Кривая показывает метрику при каждом c, синяя точка — её минимум.</p></div>
  <div class="thr-fig"><svg id="qLiveSvg" viewBox="0 0 600 330" role="img" aria-label="Метрика постоянного прогноза в зависимости от c"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="rm-modes"><button type="button" data-m="mae" aria-pressed="false">MAE</button><button type="button" data-m="mape" aria-pressed="true">MAPE</button><button type="button" data-m="q" aria-pressed="false">квантильная</button></div>
      <div class="dt-control" data-qbox><label for="qLiveQ"><span>квантиль τ</span><output id="qLiveQv">0,90</output></label>
        <input id="qLiveQ" type="range" min="0.05" max="0.95" step="0.05" value="0.9"></div>
      <div class="dt-control"><label for="qLiveC"><span>константа c, млн</span><output id="qLiveCv">3</output></label>
        <input id="qLiveC" type="range" min="0" max="8" step="0.05" value="3"></div>
      <div class="dt-presets"><button type="button" data-alt="0" aria-pressed="true">цены как есть</button><button type="button" data-alt="1" aria-pressed="false">цена кв. 3 не указана: 0</button></div>
    </div>
    <div class="dt-metrics" style="grid-column: span 2">
      <div class="dt-metric"><span id="qLiveName">—</span><strong id="qLiveVal">—</strong></div>
      <div class="dt-metric"><span>лучшее c</span><strong id="qLiveBest">—</strong></div>
      <div class="dt-metric" style="grid-column: 1 / -1"><span>среднее и медиана цен</span><strong id="qLiveMm">—</strong></div>
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
  var Y0 = [5, 5, 1, 6], ALT = [2, 0];
  var mode = 'mape', useAlt = false, tau = 0.9;
  var C = document.getElementById('qLiveC'), QR = document.getElementById('qLiveQ');
  var NAMES = {mse: 'MSE', mae: 'MAE', mape: 'MAPE', q: 'квантильная потеря'};
  function ys() { var y = Y0.slice(); if (useAlt) y[ALT[0]] = ALT[1]; return y; }
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
  function fmtv(v) { return mode === 'mape' ? fmt(v * 100, 1) + ' %' : fmt(v, 3); }
  function update() {
    var y = ys(), top = Math.max(8, Math.ceil(Math.max.apply(null, y) + 2));
    C.max = top; var c = Math.min(+C.value, top);
    var sx = function (v) { return 50 + v * 520 / top; };
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 600, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('line', {x1: sx(0), y1: 60, x2: sx(top), y2: 60, stroke: '#D8D4C8', 'stroke-width': 1.4}));
    var stepT = top <= 10 ? 1 : 10;
    for (var t = 0; t <= top; t += stepT) {
      svg.appendChild(el('text', {x: sx(t), y: 316, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, String(t)));
      svg.appendChild(el('line', {x1: sx(t), y1: 296, x2: sx(t), y2: 302, stroke: '#5E5850'}));
    }
    svg.appendChild(el('text', {x: sx(top), y: 30, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'цены квартир, млн'));
    var vals = [], best = Infinity, K = Math.round(top * 100);
    for (var k = 0; k <= K; k++) { var v = metric(y, k * top / K); vals.push(v); if (v < best) best = v; }
    var finite = isFinite(best), lo = null, hi = null;
    if (finite) vals.forEach(function (v, k) { if (v <= best + 1e-9 * Math.max(1, best)) { if (lo === null) lo = k * top / K; hi = k * top / K; } });
    if (finite) {
      var vmax = Math.max.apply(null, vals), py = function (v) { return 296 - v / vmax * 190; };
      svg.appendChild(el('path', {d: vals.map(function (v, k) { return (k ? 'L' : 'M') + sx(k * top / K).toFixed(1) + ' ' + py(v).toFixed(1); }).join(' '), fill: 'none', stroke: '#C29E08', 'stroke-width': 3}));
      svg.appendChild(el('line', {x1: sx(lo), y1: py(best), x2: sx(hi), y2: py(best), stroke: '#2A5E9B', 'stroke-width': 5}));
      svg.appendChild(el('circle', {cx: sx((lo + hi) / 2), cy: py(best), r: 6, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
      svg.appendChild(el('line', {x1: sx(c), y1: py(metric(y, c)), x2: sx(c), y2: 296, stroke: '#C29E08', 'stroke-dasharray': '3 3'}));
      svg.appendChild(el('circle', {cx: sx(c), cy: py(metric(y, c)), r: 6, fill: '#8F7406', stroke: '#FFFFFF', 'stroke-width': 2}));
    } else {
      svg.appendChild(el('text', {x: 300, y: 190, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#9C0908'}, 'MAPE не определена: в ценах есть ноль'));
    }
    svg.appendChild(el('line', {x1: sx(c), y1: 40, x2: sx(c), y2: 80, stroke: '#C29E08', 'stroke-width': 3}));
    var seen = {};
    y.forEach(function (v, i) {
      var dy = (seen[v] = (seen[v] || 0) + 1) > 1 ? -18 : 0;
      svg.appendChild(el('circle', {cx: sx(v), cy: 60 + dy, r: 9, fill: '#3F3A33', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: sx(v), y: 64 + dy, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    var srt = y.slice().sort(function (a, b) { return a - b; });
    var mean = y.reduce(function (s, v) { return s + v; }, 0) / y.length, med = (srt[1] + srt[2]) / 2;
    document.getElementById('qLiveCv').textContent = fmt(c, 2);
    document.getElementById('qLiveName').textContent = NAMES[mode] + ' при этом c';
    document.getElementById('qLiveVal').textContent = finite ? fmtv(metric(y, c)) : '∞';
    document.getElementById('qLiveBest').textContent = !finite ? '—' : (hi - lo < 0.05 ? fmt((lo + hi) / 2, 2) : 'от ' + fmt(lo, 2) + ' до ' + fmt(hi, 2));
    document.getElementById('qLiveMm').textContent = 'среднее ' + fmt(mean, 2) + ', медиана ' + fmt(med, 2);
    var qb = document.querySelector('#qLive [data-qbox]'); if (qb) qb.style.display = mode === 'q' ? '' : 'none';
  }
  C.addEventListener('input', update);
  if (QR) QR.addEventListener('input', function () { tau = +QR.value; document.getElementById('qLiveQv').textContent = fmt(tau, 2); update(); });
  document.querySelectorAll('#qLive [data-m]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.getAttribute('data-m');
      document.querySelectorAll('#qLive [data-m]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  document.querySelectorAll('#qLive [data-alt]').forEach(function (b) {
    b.addEventListener('click', function () { useAlt = b.getAttribute('data-alt') === '1';
      document.querySelectorAll('#qLive [data-alt]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); update(); });
  });
  update();
})();
</script>


<p>
  В режиме MAPE лучшая константа 1 млн, цена самой дешёвой квартиры. Кнопка «цена не указана» ставит третьей
  квартире 0: MAPE перестаёт существовать, а MAE и квантильная потеря считаются как обычно.
</p>


## Часть 8. Графики остатков

<p>
  Одно число не показывает, где модель ошибается. Возьмём синтетические квартиры от 20 до 100 м². Цена в них
  зависит от площади не по прямой: маленькие студии и большие квартиры дороже, чем предсказала бы прямая. Шум 0,8 млн,
  поэтому RMSE ниже примерно 0,8 не получит ни одна модель. Обе регрессии обучены на 300 квартирах и проверены
  на 20 000.
</p>


<div class="cm-fig"><svg viewBox="0 0 760 330" role="img" aria-label="Остатки линейной регрессии в зависимости от площади"><rect x="0" y="0" width="760" height="330" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><rect x="70" y="50" width="300" height="200" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="70" y="36" font-size="14" fill="#111111" text-anchor="start" font-weight="700">площадь и возраст</text><text x="370" y="36" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">MAE 1,18, R² 0,71</text><line x1="70" y1="150" x2="370" y2="150" stroke="#5E5850" stroke-width="1.2"/><circle cx="193.0" cy="189.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="125.1" cy="144.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="209.9" cy="147.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="281.1" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="263.5" cy="144.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="108.2" cy="75.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="359.9" cy="91.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="285.6" cy="207.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="247.4" cy="201.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="344.1" cy="102.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="344.5" cy="102.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="159.2" cy="174.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="165.6" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="313.4" cy="122.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="297.2" cy="147.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="119.5" cy="128.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="350.9" cy="85.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="255.6" cy="157.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="171.6" cy="180.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="161.9" cy="143.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="321.6" cy="160.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="119.1" cy="101.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="224.9" cy="177.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="157.4" cy="156.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="325.0" cy="148.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="289.0" cy="175.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="184.8" cy="162.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="114.6" cy="159.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="125.1" cy="133.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="344.5" cy="85.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="331.0" cy="110.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="219.6" cy="168.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="148.4" cy="168.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="116.9" cy="124.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="276.6" cy="185.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="199.8" cy="183.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="157.0" cy="194.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="256.8" cy="161.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="287.5" cy="196.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="305.5" cy="159.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="255.6" cy="149.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="320.1" cy="105.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="201.2" cy="179.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="302.9" cy="137.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="309.6" cy="131.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="286.8" cy="129.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="175.0" cy="170.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="200.5" cy="143.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="132.6" cy="152.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="148.8" cy="135.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="170.9" cy="182.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="310.8" cy="97.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="332.9" cy="110.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="101.9" cy="96.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="249.6" cy="169.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="365.9" cy="67.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="254.5" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="301.4" cy="151.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="359.5" cy="101.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="124.4" cy="101.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="144.2" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="212.9" cy="164.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="117.6" cy="133.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="252.6" cy="195.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="201.6" cy="165.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="328.4" cy="113.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="240.2" cy="166.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="172.0" cy="142.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="106.8" cy="130.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="303.6" cy="148.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="167.1" cy="153.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="193.8" cy="172.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="205.4" cy="186.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="334.0" cy="126.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="107.5" cy="120.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="184.8" cy="189.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="279.2" cy="171.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="240.2" cy="180.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="109.4" cy="127.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="224.1" cy="183.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="266.9" cy="153.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="166.0" cy="182.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="338.1" cy="134.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="137.1" cy="160.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="304.0" cy="170.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="247.4" cy="166.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="85.0" cy="95.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="214.8" cy="166.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="140.9" cy="143.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="157.0" cy="197.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="92.9" cy="103.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="251.9" cy="143.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="115.4" cy="187.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="196.4" cy="165.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="115.8" cy="153.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="188.1" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="209.5" cy="206.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="159.2" cy="139.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="83.1" cy="99.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="155.5" cy="135.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="219.6" cy="179.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="146.5" cy="144.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="238.4" cy="166.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="87.6" cy="63.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="266.1" cy="200.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="221.5" cy="144.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="276.6" cy="138.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="280.4" cy="185.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="101.5" cy="124.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="348.6" cy="141.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="126.2" cy="146.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="286.4" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="82.0" cy="88.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="95.5" cy="112.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="239.9" cy="179.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="249.6" cy="186.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="202.8" cy="169.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="302.5" cy="164.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="151.0" cy="172.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="94.8" cy="107.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="311.1" cy="125.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="178.8" cy="123.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="285.6" cy="143.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="129.2" cy="144.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="350.9" cy="125.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="325.0" cy="106.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="175.4" cy="187.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="221.1" cy="188.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="289.4" cy="178.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="348.2" cy="79.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="184.4" cy="162.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="161.5" cy="168.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="297.6" cy="147.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="191.5" cy="178.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="332.9" cy="119.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="234.2" cy="189.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="201.2" cy="143.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="216.6" cy="169.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="113.5" cy="138.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="244.8" cy="193.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="340.8" cy="155.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="303.2" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="225.2" cy="186.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="208.4" cy="180.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="221.5" cy="161.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="251.1" cy="192.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="237.6" cy="187.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="143.9" cy="146.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="263.5" cy="183.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="218.1" cy="177.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="131.5" cy="150.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="353.9" cy="91.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="173.9" cy="195.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="330.6" cy="134.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="191.5" cy="150.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="239.5" cy="177.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="156.2" cy="176.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="270.6" cy="159.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="320.9" cy="137.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="282.2" cy="157.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="307.8" cy="147.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="361.4" cy="84.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="114.2" cy="174.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="141.6" cy="178.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="108.6" cy="74.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="321.2" cy="171.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="120.6" cy="108.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="170.1" cy="144.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="316.8" cy="111.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="161.5" cy="181.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="336.6" cy="121.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="99.2" cy="121.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="205.4" cy="178.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="286.4" cy="170.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="112.4" cy="97.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="95.5" cy="117.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="102.6" cy="69.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="294.6" cy="165.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="163.4" cy="142.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="199.8" cy="137.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="338.9" cy="102.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="130.4" cy="159.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="84.2" cy="77.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="276.2" cy="169.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="272.1" cy="170.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="354.6" cy="131.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="352.4" cy="97.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="367.0" cy="79.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="73.0" cy="59.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="107.1" cy="114.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="176.5" cy="179.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="84.2" cy="109.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="76.8" cy="94.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="149.5" cy="139.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="122.5" cy="122.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="302.1" cy="180.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="316.4" cy="94.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="355.4" cy="92.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="174.6" cy="164.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="255.3" cy="202.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="88.4" cy="105.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="254.5" cy="189.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="110.5" cy="97.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="262.4" cy="172.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="294.6" cy="127.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="335.5" cy="129.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="243.2" cy="169.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="190.0" cy="171.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="180.6" cy="170.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="113.5" cy="134.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="102.2" cy="76.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="97.8" cy="126.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="105.6" cy="113.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="320.9" cy="112.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="289.4" cy="173.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="140.1" cy="127.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="213.2" cy="149.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="93.6" cy="116.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="250.8" cy="187.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="240.6" cy="170.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="301.0" cy="156.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="259.0" cy="185.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="348.6" cy="85.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="313.8" cy="134.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="88.0" cy="121.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="122.1" cy="116.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="127.8" cy="126.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="283.4" cy="191.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="334.0" cy="134.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="181.0" cy="191.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="71.1" cy="90.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="106.8" cy="105.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="160.8" cy="173.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="204.6" cy="163.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="331.4" cy="129.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="166.8" cy="160.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="354.2" cy="84.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="89.1" cy="87.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="70.4" cy="78.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="82.8" cy="90.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="237.6" cy="194.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="254.5" cy="146.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="242.5" cy="183.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="131.1" cy="131.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="190.8" cy="166.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="96.6" cy="89.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="74.1" cy="109.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="273.2" cy="151.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="238.8" cy="174.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="227.1" cy="185.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="284.1" cy="173.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="263.5" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="102.6" cy="108.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="135.6" cy="131.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="159.6" cy="173.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="290.9" cy="182.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="118.8" cy="146.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="301.8" cy="166.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="158.9" cy="159.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><path d="M79.4 91.1 L98.1 111.4 L116.9 131.8 L135.6 146.1 L154.4 160.4 L173.1 169.0 L191.9 175.3 L210.6 178.6 L229.4 179.3 L248.1 175.9 L266.9 169.0 L285.6 160.4 L304.4 146.7 L323.1 130.6 L341.9 113.2 L360.6 90.9" fill="none" stroke="#3576C0" stroke-width="3.2"/><text x="64" y="254" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−4</text><text x="64" y="204" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−2</text><text x="64" y="154" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="64" y="104" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">2</text><text x="64" y="54" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">4</text><text x="70" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><text x="145" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">40</text><text x="220" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">60</text><text x="295" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">80</text><text x="370" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">100</text><text x="220" y="286" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">площадь, м²</text><rect x="440" y="50" width="300" height="200" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="440" y="36" font-size="14" fill="#111111" text-anchor="start" font-weight="700">плюс площадь²</text><text x="740" y="36" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">MAE 0,64, R² 0,91</text><line x1="440" y1="150" x2="740" y2="150" stroke="#5E5850" stroke-width="1.2"/><circle cx="563.0" cy="164.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="495.1" cy="154.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="579.9" cy="120.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="651.1" cy="134.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="633.5" cy="125.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="478.2" cy="99.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="729.9" cy="144.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="655.6" cy="197.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="617.4" cy="177.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="714.1" cy="138.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="714.5" cy="138.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="529.2" cy="163.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="535.6" cy="168.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="683.4" cy="131.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="667.2" cy="144.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="489.5" cy="143.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="720.9" cy="128.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="625.6" cy="134.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="541.6" cy="162.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="531.9" cy="130.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="691.6" cy="175.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="489.1" cy="116.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="594.9" cy="150.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="527.4" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="695.0" cy="166.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="659.0" cy="167.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="554.8" cy="139.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="484.6" cy="177.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="495.1" cy="143.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="714.5" cy="121.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="701.0" cy="133.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="589.6" cy="141.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="518.4" cy="163.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="486.9" cy="140.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="646.6" cy="170.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="569.8" cy="158.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="527.0" cy="183.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="626.8" cy="140.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="657.5" cy="187.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="675.5" cy="161.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="625.6" cy="127.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="690.1" cy="119.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="571.2" cy="153.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="672.9" cy="138.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="679.6" cy="136.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="656.8" cy="120.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="545.0" cy="151.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="570.5" cy="118.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="502.6" cy="156.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="518.8" cy="130.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="540.9" cy="165.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="680.8" cy="104.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="702.9" cy="135.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="471.9" cy="126.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="619.6" cy="146.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="735.9" cy="126.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="624.5" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="671.4" cy="151.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="729.5" cy="153.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="494.4" cy="111.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="514.2" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="582.9" cy="137.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="487.6" cy="148.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="622.6" cy="172.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="571.6" cy="139.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="698.4" cy="134.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="610.2" cy="140.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="542.0" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="476.8" cy="155.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="673.6" cy="149.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="537.1" cy="137.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="563.8" cy="148.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="575.4" cy="161.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="704.0" cy="152.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="477.5" cy="145.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="554.8" cy="168.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="649.2" cy="158.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="610.2" cy="154.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="479.4" cy="150.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="594.1" cy="156.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="636.9" cy="135.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="536.0" cy="166.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="708.1" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="507.1" cy="161.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="674.0" cy="171.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="617.4" cy="142.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="455.0" cy="143.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="584.8" cy="139.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="510.9" cy="141.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="527.0" cy="186.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="462.9" cy="143.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="621.9" cy="120.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="485.4" cy="204.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="566.4" cy="140.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="485.8" cy="170.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="558.1" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="579.5" cy="180.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="529.2" cy="128.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="453.1" cy="148.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="525.5" cy="125.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="589.6" cy="152.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="516.5" cy="139.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="608.4" cy="140.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="457.6" cy="107.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="636.1" cy="182.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="591.5" cy="116.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="646.6" cy="124.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="650.4" cy="173.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="471.5" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="718.6" cy="181.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="496.2" cy="154.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="656.4" cy="127.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="452.0" cy="138.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="465.5" cy="148.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="609.9" cy="154.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="619.6" cy="162.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="572.8" cy="143.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="672.5" cy="165.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="521.0" cy="164.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="464.8" cy="144.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="681.1" cy="132.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="548.8" cy="103.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="655.6" cy="134.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="499.2" cy="151.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="720.9" cy="167.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="695.0" cy="124.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="545.4" cy="167.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="591.1" cy="161.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="659.4" cy="171.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="718.2" cy="119.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="554.4" cy="140.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="531.5" cy="155.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="667.6" cy="144.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="561.5" cy="154.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="702.9" cy="144.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="604.2" cy="162.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="571.2" cy="117.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="586.6" cy="141.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="483.5" cy="158.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="614.8" cy="169.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="710.8" cy="187.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="673.2" cy="159.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="595.2" cy="159.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="578.4" cy="153.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="591.5" cy="133.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="621.1" cy="170.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="607.6" cy="161.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="513.9" cy="143.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="633.5" cy="163.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="588.1" cy="149.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="501.5" cy="155.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="723.9" cy="137.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="543.9" cy="176.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="700.6" cy="157.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="561.5" cy="126.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="609.5" cy="151.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="526.2" cy="165.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="640.6" cy="142.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="690.9" cy="151.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="652.2" cy="146.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="677.8" cy="151.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="731.4" cy="138.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="484.2" cy="193.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="511.6" cy="175.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="478.6" cy="97.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="691.2" cy="187.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="490.6" cy="121.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="540.1" cy="126.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="686.8" cy="122.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="531.5" cy="168.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="706.6" cy="149.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="469.2" cy="153.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="575.4" cy="152.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="656.4" cy="161.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="482.4" cy="118.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="465.5" cy="152.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="472.6" cy="98.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="664.6" cy="162.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="533.4" cy="129.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="569.8" cy="112.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="708.9" cy="132.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="500.4" cy="165.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="454.2" cy="125.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="646.2" cy="155.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="642.1" cy="154.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="724.6" cy="178.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="722.4" cy="141.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="737.0" cy="140.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="443.0" cy="121.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="477.1" cy="139.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="546.5" cy="160.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="454.2" cy="157.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="738.5" cy="103.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="446.8" cy="150.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="519.5" cy="132.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="492.5" cy="134.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="672.1" cy="180.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="686.4" cy="105.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="725.4" cy="140.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="544.6" cy="146.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="625.2" cy="180.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="458.4" cy="149.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="624.5" cy="166.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="480.5" cy="119.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="632.4" cy="152.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="664.6" cy="122.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="705.5" cy="155.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="613.2" cy="144.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="560.0" cy="148.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="550.6" cy="150.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="483.5" cy="154.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="472.2" cy="105.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="467.8" cy="159.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="475.6" cy="140.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="690.9" cy="126.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="659.4" cy="165.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="510.1" cy="126.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="583.2" cy="122.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="463.6" cy="154.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="620.8" cy="164.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="610.6" cy="145.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="671.0" cy="156.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="629.0" cy="164.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="718.6" cy="125.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="683.8" cy="142.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="458.0" cy="165.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="492.1" cy="128.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="497.8" cy="134.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="653.4" cy="181.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="704.0" cy="160.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="551.0" cy="169.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="441.1" cy="153.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="476.8" cy="130.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="530.8" cy="160.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="574.6" cy="137.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="701.4" cy="151.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="536.8" cy="144.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="724.2" cy="130.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="459.1" cy="130.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="440.4" cy="142.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="452.8" cy="139.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="607.6" cy="169.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="624.5" cy="123.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="612.5" cy="157.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="501.1" cy="135.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="560.8" cy="142.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="466.6" cy="124.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="444.1" cy="169.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="643.2" cy="135.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="608.8" cy="148.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="597.1" cy="159.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="654.1" cy="162.2" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="633.5" cy="136.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="472.6" cy="137.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="505.6" cy="133.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="529.6" cy="161.8" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="660.9" cy="176.0" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="488.8" cy="161.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="671.8" cy="167.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><circle cx="528.9" cy="147.5" r="2.2" fill="#A8A296" fill-opacity="0.55"/><path d="M449.4 144.9 L468.1 145.1 L486.9 148.3 L505.6 148.4 L524.4 151.1 L543.1 151.1 L561.9 151.7 L580.6 152.1 L599.4 152.7 L618.1 152.2 L636.9 150.9 L655.6 150.8 L674.4 148.7 L693.1 146.8 L711.9 146.6 L730.6 144.2" fill="none" stroke="#C29E08" stroke-width="3.2"/><text x="434" y="254" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−4</text><text x="434" y="204" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">−2</text><text x="434" y="154" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">0</text><text x="434" y="104" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">2</text><text x="434" y="54" font-size="11" fill="#5E5850" text-anchor="end" font-weight="400">4</text><text x="440" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><text x="515" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">40</text><text x="590" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">60</text><text x="665" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">80</text><text x="740" y="266" font-size="11" fill="#5E5850" text-anchor="middle" font-weight="400">100</text><text x="590" y="286" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">площадь, м²</text><text x="22" y="150" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 22 150)">остаток, млн</text><text x="380" y="318" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">Серые точки — отдельные квартиры, линия — средний остаток при данной площади.</text></svg></div>


<p>
  Обычная регрессия по площади и возрасту даёт <span class="math-inline" data-tex="R^2 = 0{,}705"></span>, и это не выглядит провалом. График остатков от площади
  показывает, чего число не видит. Средний остаток идёт дугой: у студий около <span class="math-inline" data-tex="+2{,}4"></span> млн (модель их недооценивает),
  около 60 м² около <span class="math-inline" data-tex="-1{,}2"></span> (переоценивает), у больших квартир снова <span class="math-inline" data-tex="+2{,}4"></span>. Прямая не может изогнуться и промахивается
  систематически.
</p>

<p>
  Если добавить признак «площадь в квадрате», регрессия остаётся линейной по весам, но может описать дугу. Средний
  остаток прижимается к нулю, MAE падает с 1,18 до 0,64, <span class="math-inline" data-tex="R^2"></span> растёт до 0,91, RMSE 0,805 упирается в шум.
</p>

<p>
  У модели без систематических ошибок средний остаток держится около нуля при любом значении признака. Если видна
  закономерность, её можно добавить в модель. Тот же график стоит строить по прогнозу (остаток против <span class="math-inline" data-tex="\hat y"></span>):
  если разброс растёт вместе с прогнозом, дорогие квартиры оцениваются менее точно, и одна RMSE по всей выборке смешивает
  точные и неточные области.
</p>


## Часть 9. Выбросы: метрика и функция потерь

<p>
  Вернёмся к опечатке из части 2, но теперь в данных для обучения. В синтетических объявлениях примерно в 5 % цен
  записан лишний ноль. Обучим три линейные регрессии на 400 квартирах, которые отличаются только тем, что минимизируют:
  квадрат ошибки, модуль или Huber (квадрат для малых остатков и модуль для больших). Проверка на 20 000 квартирах,
  из них с опечаткой 4,8 %. Настоящие веса: 0,9 за 10 м² и <span class="math-inline" data-tex="-0{,}7"></span> за 10 лет.
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th>Что минимизирует модель</th><th>Веса площади и возраста</th><th>MAE, все</th><th>RMSE, все</th><th>MAE, без опечаток</th><th>RMSE, без опечаток</th></tr>
  <tr><td>квадрат (обычная линейная регрессия)</td><td>1,88; −0,97</td><td>4,70</td><td>9,84</td><td>3,06</td><td>3,72</td></tr>
  <tr><td>Huber</td><td>0,94; −0,59</td><td>2,54</td><td>9,89</td><td>0,65</td><td>0,82</td></tr>
  <tr><td>модуль (медианная регрессия)</td><td>0,93; −0,56</td><td>2,54</td><td>9,90</td><td>0,65</td><td>0,82</td></tr>
</table></div>


<p>
  Обычная регрессия подстраивается под опечатки: вес площади вырос до 1,88, вдвое больше настоящего. На квартирах
  с правильными ценами она ошибается в среднем на 3,06 млн, Huber и медианная регрессия — на 0,65, почти на уровне шума.
</p>

<p>
  Но по RMSE на всех квартирах обычная регрессия формально лучшая: 9,84 против 9,89 и 9,90. RMSE на грязных данных
  измеряет в основном опечатки, а их квадраты подогнала именно та модель, которая минимизировала квадраты. По MAE на всех
  квартирах побеждает медианная регрессия. Каждая модель выигрывает по той метрике, которую минимизировала.
</p>

<p>
  Отсюда два вывода. Обучать модель лучше на той потере, по которой её потом будут оценивать. И до выбора метрики надо
  решить, что делать с мусором: чистить данные, брать устойчивую потерю или считать метрики отдельно на чистых объектах.
</p>


## Часть 10. Как выбрать метрику


<div class="dt-table"><table class="shape-table">
  <tr><th>Ситуация</th><th>На что смотреть</th></tr>
  <tr><td>каждый рубль ошибки стоит одинаково, нужен понятный ответ «в среднем на сколько»</td><td>MAE</td></tr>
  <tr><td>крупный промах намного хуже нескольких мелких: оценка залога, планирование бюджета</td><td>RMSE</td></tr>
  <tr><td>в данных есть опечатки и выбросы, которые не должны решать оценку</td><td>MAE; при обучении Huber или модуль</td></tr>
  <tr><td>нужно сравнить задачи с разными единицами или объяснить долю разброса</td><td><span class="math-inline" data-tex="R^2"></span> рядом с MAE или RMSE</td></tr>
  <tr><td>ответы одного масштаба без нулей, важна относительная ошибка</td><td>MAPE, иначе WAPE</td></tr>
  <tr><td>недооценка и переоценка стоят по-разному, нужен интервал</td><td>квантильная потеря</td></tr>
  <tr><td>важен худший случай</td><td>максимальная ошибка</td></tr>
</table></div>


<p>
  Общие правила те же, что для классификации: считать метрики на данных, которых модель не видела, и указывать рядом
  значение у простой модели. Для регрессии это константа: средняя цена для RMSE и <span class="math-inline" data-tex="R^2"></span>, медиана для MAE.
</p>


## Часть 11. Код: метрики с нуля и в sklearn

### Метрики на чистом Python


```python
from math import sqrt

# четыре квартиры: площадь (десятки м²), возраст дома (десятки лет), цена (млн)
X = [[2, 1], [3, 1], [1, 3], [4, 2]]
y = [5, 5, 1, 6]
w, b = [27 / 23, -25 / 23], 74 / 23                    # веса из нормальных уравнений
pred = [w[0] * a + w[1] * g + b for a, g in X]
e = [t - p for t, p in zip(y, pred)]                    # остатки y - ŷ
n = len(y)


def mae(e):
    return sum(abs(v) for v in e) / len(e)


def mse(e):
    return sum(v * v for v in e) / len(e)


def r2(y, e):
    mean = sum(y) / len(y)
    sst = sum((t - mean) ** 2 for t in y)               # разброс цен вокруг средней
    return 1 - sum(v * v for v in e) / sst


def mape(y, e):
    return sum(abs(v) / t for v, t in zip(e, y)) / len(y)   # упадёт, если есть нулевая цена


def wape(y, e):
    return sum(abs(v) for v in e) / sum(abs(t) for t in y)


print('остатки × 23:', [round(v * 23) for v in e])
print('смещение', round(sum(e) / n, 12) + 0.0)
print('MAE', round(mae(e), 4), ' MSE', round(mse(e), 4), ' RMSE', round(sqrt(mse(e)), 4))
print('R2', round(r2(y, e), 4), ' MAPE', round(mape(y, e), 4), ' WAPE', round(wape(y, e), 4))
```

```text
остатки × 23: [12, -15, -3, 6]
смещение 0.0
MAE 0.3913  MSE 0.1957  RMSE 0.4423
R2 0.9469  MAPE 0.1022  WAPE 0.0921
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
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (mean_absolute_error, mean_squared_error, root_mean_squared_error, r2_score,
                             mean_absolute_percentage_error, max_error)
from sklearn.model_selection import cross_val_predict, cross_val_score, LeaveOneOut

X = np.array([[2, 1], [3, 1], [1, 3], [4, 2]])
y = np.array([5, 5, 1, 6])

model = LinearRegression().fit(X, y)
pred = model.predict(X)
print(np.round(model.coef_ * 23, 6), round(model.intercept_ * 23, 6))
print(round(mean_absolute_error(y, pred), 4), round(mean_squared_error(y, pred), 4), round(root_mean_squared_error(y, pred), 4))
print(round(r2_score(y, pred), 4), round(mean_absolute_percentage_error(y, pred), 4), round(max_error(y, pred), 4))

# честная проверка: каждую квартиру предсказывает модель, обученная на трёх остальных
loo = cross_val_predict(LinearRegression(), X, y, cv=LeaveOneOut())
print(loo, round(mean_absolute_error(y, loo), 4), round(r2_score(y, loo), 4))

# в scoring метрики ошибок записаны со знаком минус: подбор всегда ищет максимум
s = cross_val_score(LinearRegression(), X, y, cv=LeaveOneOut(), scoring='neg_mean_absolute_error')
print(s, -s.mean())
```

```text
[ 27. -25.] 74.0
0.3913 0.1957 0.4423
0.9469 0.1022 0.6522
[3.5 6.2 7.  3. ] 2.925 -2.301
[-1.5 -1.2 -6.  -3. ] 2.925
```



### Опечатки и функция потерь

<p>
  Эксперимент из части 9.
</p>


```python
import numpy as np
from sklearn.linear_model import LinearRegression, HuberRegressor, QuantileRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error


def flats(n, rng, typo=0.05):
    """Синтетические квартиры; примерно в 5 % объявлений цена записана с лишним нулём."""
    area = rng.uniform(2, 10, n)                # десятки м²
    age = rng.uniform(0.5, 5, n)                # десятки лет
    y = 1 + 0.9 * area - 0.7 * age + rng.normal(0, 0.8, n)
    bad = rng.uniform(size=n) < typo
    y[bad] *= 10
    return np.c_[area, age], y, bad


rng = np.random.default_rng(1)
X_train, y_train, _ = flats(400, rng)
X_test, y_test, bad = flats(20000, rng)
ok = ~bad

models = {'квадрат (MSE)': LinearRegression(),
          'Huber': HuberRegressor(epsilon=1.35, max_iter=2000),
          'модуль (MAE)': QuantileRegressor(quantile=0.5, alpha=0, solver='highs')}
for name, model in models.items():
    p = model.fit(X_train, y_train).predict(X_test)
    print(f'{name:14s} веса {np.round(model.coef_, 2)}  все: MAE {mean_absolute_error(y_test, p):.2f}'
          f'  RMSE {root_mean_squared_error(y_test, p):.2f} | без опечаток: MAE {mean_absolute_error(y_test[ok], p[ok]):.2f}'
          f'  RMSE {root_mean_squared_error(y_test[ok], p[ok]):.2f}')
```

```text
квадрат (MSE)  веса [ 1.88 -0.97]  все: MAE 4.70  RMSE 9.84 | без опечаток: MAE 3.06  RMSE 3.72
Huber          веса [ 0.94 -0.59]  все: MAE 2.54  RMSE 9.89 | без опечаток: MAE 0.65  RMSE 0.82
модуль (MAE)   веса [ 0.93 -0.56]  все: MAE 2.54  RMSE 9.90 | без опечаток: MAE 0.65  RMSE 0.82
```


## Часть 12. Что получилось


<div class="dt-table"><table class="shape-table">
  <tr><th>Метрика</th><th>Что измеряет</th><th>У регрессии на четырёх квартирах</th></tr>
  <tr><td>смещение</td><td>средний остаток со знаком</td><td>0</td></tr>
  <tr><td>MAE</td><td>средний модуль остатка</td><td><span class="math-inline" data-tex="9/23 \approx 0{,}391"></span> млн</td></tr>
  <tr><td>MSE</td><td>средний квадрат остатка</td><td><span class="math-inline" data-tex="9/46 \approx 0{,}196"></span> млн²</td></tr>
  <tr><td>RMSE</td><td>корень из среднего квадрата</td><td>0,442 млн</td></tr>
  <tr><td><span class="math-inline" data-tex="R^2"></span></td><td>долю квадратичного разброса, которую убрала модель</td><td>0,947 на обучении, −2,30 честно</td></tr>
  <tr><td>MAPE</td><td>средний относительный промах</td><td>10,2 %</td></tr>
  <tr><td>WAPE</td><td>сумма промахов к сумме ответов</td><td>9,2 %</td></tr>
  <tr><td>максимальная ошибка</td><td>худший промах</td><td>0,652 млн</td></tr>
</table></div>


### Что важно уметь восстановить по памяти

<ul>
  <li>Остаток <span class="math-inline" data-tex="e = y - \hat y"></span>; среднее остатков — смещение. У линейной регрессии со свободным членом на обучающих
    данных оно равно нулю.</li>
  <li><span class="math-inline" data-tex="\text{MAE} = \frac{1}{n}\sum|e_i|"></span>, <span class="math-inline" data-tex="\text{RMSE} = \sqrt{\frac{1}{n}\sum e_i^2}"></span>; обе в единицах ответа,
    <span class="math-inline" data-tex="\text{RMSE}^2 = \text{MAE}^2 + \text{Var}(|e|)"></span>, поэтому <span class="math-inline" data-tex="\text{RMSE} \ge \text{MAE}"></span>.</li>
  <li><span class="math-inline" data-tex="\text{MSE} = \bar e^{\,2} + \text{Var}(e)"></span>: смещение добавляется к MSE в квадрате.</li>
  <li>Квадрат ошибки минимизирует среднее, модуль — медиана, квантильная потеря с <span class="math-inline" data-tex="\tau"></span> — <span class="math-inline" data-tex="\tau"></span>-квантиль.</li>
  <li><span class="math-inline" data-tex="R^2 = 1 - \text{SSE}/\text{SST} = 1 - \text{MSE}/\text{Var}(y)"></span>; на новых данных бывает отрицательным
    и зависит от разброса ответов.</li>
  <li>Метрики на обучающих данных оптимистичны тем сильнее, чем меньше объектов на параметр.</li>
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

