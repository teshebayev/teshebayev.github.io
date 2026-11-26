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
  @media (max-width: 820px) { .prose .dt-live-grid { grid-template-columns: 1fr; } .prose .dt-live { padding: 16px 14px; } }
</style>

<p class="lead">
  Дерево решений предсказывает ответ серией вопросов вида «признак не больше порога?».
  Разберём на десяти студентах, как такое дерево отвечает, как оно выбирает вопросы
  и почему одно дерево легко переобучается.
</p>

<p>
  Задача та же, что в статье про логистическую регрессию: по часам подготовки и числу пропусков
  предсказать, сдаст ли студент экзамен. Логистическая регрессия проводила через плоскость
  признаков одну прямую и считала вероятность по расстоянию до неё. Дерево делит ту же плоскость
  на прямоугольники, и в каждом ответ берётся по большинству обучающих студентов,
  попавших в этот прямоугольник.
</p>

<p>
  Все числа в статье можно пересчитать руками: студентов десять, признаков два,
  а из математики нужен только логарифм по основанию 2. Порядок такой: сначала готовое дерево
  и то, как оно отвечает, потом энтропия и прирост информации, по которым дерево выбирает
  вопросы, потом рекурсивное построение и индекс Gini. После этого две слабости одного дерева,
  переобучение и неустойчивость, и в конце код с нуля и на <code>sklearn</code>.
</p>

<div class="callout-blue">
  <strong>Как работать с интерактивами:</strong> в пошаговых схемах нажимайте «Далее»
  и смотрите на яркую часть, остальное приглушено. Каждый шаг разобран в тексте под схемой.
  Стрелки ← → на клавиатуре работают, когда схема в фокусе. В двух живых блоках
  (энтропия и перебор порогов) числа пересчитываются при каждом нажатии.
</div>

## Часть 1. Как дерево делит плоскость

<p>
  Вот данные. Часы и пропуски записаны как есть, без масштабирования: дерево сравнивает
  каждый признак только с его собственным порогом, поэтому единицы измерения на результат
  не влияют. Если поделить часы на 10, порог «13 часов» превратится в «1,3», а дерево
  останется тем же.
</p>

<div class="dt-table"><table class="shape-table">
  <tr><th>#</th><th>Часы подготовки</th><th>Пропуски</th><th>Сдал</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>0</td></tr>
  <tr><td>2</td><td>4</td><td>7</td><td>0</td></tr>
  <tr><td>3</td><td>6</td><td>4</td><td>0</td></tr>
  <tr><td>4</td><td>8</td><td>1</td><td>1</td></tr>
  <tr><td>5</td><td>10</td><td>8</td><td>0</td></tr>
  <tr><td>6</td><td>12</td><td>5</td><td>0</td></tr>
  <tr><td>7</td><td>14</td><td>2</td><td>1</td></tr>
  <tr><td>8</td><td>16</td><td>6</td><td>1</td></tr>
  <tr><td>9</td><td>18</td><td>3</td><td>1</td></tr>
  <tr><td>10</td><td>20</td><td>4</td><td>1</td></tr>
</table></div>

<p>
  Сдали пятеро из десяти. В целом чем больше часов, тем чаще сдают, но есть исключения:
  студент 4 готовился всего 8 часов и сдал, студент 6 готовился 12 часов и не сдал.
  Посмотрим, как дерево с ними справляется.
</p>

<div class="stage" id="stageBuild" tabindex="0">
  <div class="stage-figure">
<svg id="dtBuild" viewBox="0 0 960 500" role="img" aria-label="Построение дерева решений на десяти студентах: два порога делят плоскость на три прямоугольника"><style>#dtBuild { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="70" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">студенты на плоскости</text><text x="575" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">дерево, которое получается</text>
<g data-key="ax"><rect x="70" y="60" width="462" height="360" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="420" x2="70" y2="425" stroke="#5E5850" stroke-width="1"/><text x="70" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="154" y1="420" x2="154" y2="425" stroke="#5E5850" stroke-width="1"/><text x="154" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="238" y1="420" x2="238" y2="425" stroke="#5E5850" stroke-width="1"/><text x="238" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="322" y1="420" x2="322" y2="425" stroke="#5E5850" stroke-width="1"/><text x="322" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="406" y1="420" x2="406" y2="425" stroke="#5E5850" stroke-width="1"/><text x="406" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="490" y1="420" x2="490" y2="425" stroke="#5E5850" stroke-width="1"/><text x="490" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="65" y1="420" x2="70" y2="420" stroke="#5E5850" stroke-width="1"/><text x="61" y="425" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="65" y1="348" x2="70" y2="348" stroke="#5E5850" stroke-width="1"/><text x="61" y="353" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="65" y1="276" x2="70" y2="276" stroke="#5E5850" stroke-width="1"/><text x="61" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="65" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="61" y="209" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="65" y1="132" x2="70" y2="132" stroke="#5E5850" stroke-width="1"/><text x="61" y="137" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="65" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="61" y="65" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="301" y="464" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="36" y="240" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 240.0)">пропуски</text></g>
<g data-key="reg3" data-only="1"><rect x="343" y="60" width="189" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><circle cx="516" cy="76" r="11" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="516" y="80.5" font-size="12" fill="#73B222" text-anchor="middle" font-weight="700">3</text></g>
<g data-key="reg12" data-only="1"><rect x="70" y="348" width="273" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><circle cx="327" cy="364" r="11" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="327" y="368.5" font-size="12" fill="#73B222" text-anchor="middle" font-weight="700">1</text><rect x="70" y="60" width="273" height="288" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><circle cx="327" cy="76" r="11" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="327" y="80.5" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">2</text></g>
<g data-key="v1" data-only="1"><line x1="343" y1="60" x2="343" y2="420" stroke="#C29E08" stroke-width="2.4"/><text x="343" y="54" font-size="12" fill="#8F7406" text-anchor="middle" font-weight="700">часы = 13</text></g>
<g data-key="cnt" data-only="1"><text x="206.5" y="86" font-size="13" fill="#111111" text-anchor="middle" font-weight="400">слева 6: сдал 1, не сдали 5</text><text x="437.5" y="86" font-size="13" fill="#111111" text-anchor="middle" font-weight="400">справа 4: сдали 4</text></g>
<g data-key="h2" data-only="1"><line x1="70" y1="348" x2="343" y2="348" stroke="#C29E08" stroke-width="2.4"/><text x="337" y="341" font-size="12" fill="#8F7406" text-anchor="end" font-weight="700">пропуски = 2</text></g>
<g data-key="pts"><circle cx="112" cy="312" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="112" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="154" cy="168" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="154" y="172.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="196" cy="276" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="196" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="238" cy="384" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="238" y="388.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="280" cy="132" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="280" y="136.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="322" cy="240" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="322" y="244.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="364" cy="348" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="364" y="352.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="406" cy="204" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="406" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="448" cy="312" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="448" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="490" cy="276" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="490" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="ring4" data-only="1"><circle cx="238" cy="384" r="17" fill="none" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="4 3"/><text x="260" y="370" font-size="12" fill="#9C0908" text-anchor="start" font-weight="700">студент 4</text></g>
<g data-key="bnd" data-only="1"><path d="M 343 60 L 343 348 L 70 348" fill="none" stroke="#111111" stroke-width="3.4" stroke-linejoin="round"/><text x="351" y="120" font-size="12" fill="#111111" text-anchor="start" font-weight="700">граница:</text><text x="351" y="138" font-size="12" fill="#111111" text-anchor="start" font-weight="400">только вертикальные</text><text x="351" y="156" font-size="12" fill="#111111" text-anchor="start" font-weight="400">и горизонтальные куски</text></g>
<g data-key="root0" data-only="1"><rect x="650" y="64" width="220" height="62" rx="10" fill="#FFFFFF" stroke="#A8A296" stroke-width="1.6"/><text x="760" y="89" font-size="15" fill="#5E5850" text-anchor="middle" font-weight="700">все 10 студентов</text><circle cx="701.5" cy="109" r="5" fill="#73B222"/><circle cx="714.5" cy="109" r="5" fill="#73B222"/><circle cx="727.5" cy="109" r="5" fill="#73B222"/><circle cx="740.5" cy="109" r="5" fill="#73B222"/><circle cx="753.5" cy="109" r="5" fill="#73B222"/><circle cx="766.5" cy="109" r="5" fill="#C30B0A"/><circle cx="779.5" cy="109" r="5" fill="#C30B0A"/><circle cx="792.5" cy="109" r="5" fill="#C30B0A"/><circle cx="805.5" cy="109" r="5" fill="#C30B0A"/><circle cx="818.5" cy="109" r="5" fill="#C30B0A"/></g>
<g data-key="root1" data-only="1"><rect x="650" y="64" width="220" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="760" y="89" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13 ?</text><circle cx="701.5" cy="109" r="5" fill="#73B222"/><circle cx="714.5" cy="109" r="5" fill="#73B222"/><circle cx="727.5" cy="109" r="5" fill="#73B222"/><circle cx="740.5" cy="109" r="5" fill="#73B222"/><circle cx="753.5" cy="109" r="5" fill="#73B222"/><circle cx="766.5" cy="109" r="5" fill="#C30B0A"/><circle cx="779.5" cy="109" r="5" fill="#C30B0A"/><circle cx="792.5" cy="109" r="5" fill="#C30B0A"/><circle cx="805.5" cy="109" r="5" fill="#C30B0A"/><circle cx="818.5" cy="109" r="5" fill="#C30B0A"/></g>
<g data-key="e1" data-only="1"><line x1="760" y1="126" x2="680" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="704" y="169" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="760" y1="126" x2="883" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="837.5" y="169" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text></g>
<g data-key="L0" data-only="1"><rect x="585" y="204" width="190" height="62" rx="10" fill="#FFFFFF" stroke="#A8A296" stroke-width="1.6"/><text x="680" y="229" font-size="15" fill="#5E5850" text-anchor="middle" font-weight="700">6 студентов</text><circle cx="647.5" cy="249" r="5" fill="#73B222"/><circle cx="660.5" cy="249" r="5" fill="#C30B0A"/><circle cx="673.5" cy="249" r="5" fill="#C30B0A"/><circle cx="686.5" cy="249" r="5" fill="#C30B0A"/><circle cx="699.5" cy="249" r="5" fill="#C30B0A"/><circle cx="712.5" cy="249" r="5" fill="#C30B0A"/></g>
<g data-key="R0" data-only="1"><rect x="827" y="204" width="112" height="62" rx="10" fill="#FFFFFF" stroke="#A8A296" stroke-width="1.6"/><text x="883" y="229" font-size="15" fill="#5E5850" text-anchor="middle" font-weight="700">4 студента</text><circle cx="863.5" cy="249" r="5" fill="#73B222"/><circle cx="876.5" cy="249" r="5" fill="#73B222"/><circle cx="889.5" cy="249" r="5" fill="#73B222"/><circle cx="902.5" cy="249" r="5" fill="#73B222"/></g>
<g data-key="R1" data-only="1"><rect x="827" y="204" width="112" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="883" y="229" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист 3 · сдал</text><circle cx="863.5" cy="249" r="5" fill="#73B222"/><circle cx="876.5" cy="249" r="5" fill="#73B222"/><circle cx="889.5" cy="249" r="5" fill="#73B222"/><circle cx="902.5" cy="249" r="5" fill="#73B222"/></g>
<g data-key="L1" data-only="1"><rect x="585" y="204" width="190" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="680" y="229" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2 ?</text><circle cx="647.5" cy="249" r="5" fill="#73B222"/><circle cx="660.5" cy="249" r="5" fill="#C30B0A"/><circle cx="673.5" cy="249" r="5" fill="#C30B0A"/><circle cx="686.5" cy="249" r="5" fill="#C30B0A"/><circle cx="699.5" cy="249" r="5" fill="#C30B0A"/><circle cx="712.5" cy="249" r="5" fill="#C30B0A"/></g>
<g data-key="e2" data-only="1"><line x1="680" y1="266" x2="612" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="630" y="307.5" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="680" y1="266" x2="754" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="733" y="307.5" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text></g>
<g data-key="lv" data-only="1"><rect x="552" y="341" width="120" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="612" y="366" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист 1 · сдал</text><circle cx="612" cy="386" r="5" fill="#73B222"/><rect x="684" y="341" width="140" height="62" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="754" y="366" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">лист 2 · не сдал</text><circle cx="728" cy="386" r="5" fill="#C30B0A"/><circle cx="741" cy="386" r="5" fill="#C30B0A"/><circle cx="754" cy="386" r="5" fill="#C30B0A"/><circle cx="767" cy="386" r="5" fill="#C30B0A"/><circle cx="780" cy="386" r="5" fill="#C30B0A"/></g>
<g data-key="ok" data-only="1"><rect x="645" y="432" width="230" height="34" rx="17" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/><text x="760" y="454" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">верно 10 из 10</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">зелёные точки: сдали · красные: не сдали · жёлтые линии и вопросы: пороги, которые выбрало дерево</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax pts root0" data-focus="pts">
      <div class="step-kicker">Шаг 1 · данные на плоскости</div>
      <h4>Десять студентов, две оси</h4>
      <p>Каждый студент из таблицы нарисован точкой: по горизонтали часы подготовки, по вертикали пропуски. Цвет показывает, чем кончился экзамен: зелёные сдали, красные нет. Номер в точке совпадает с номером строки таблицы.</p>
<p>Справа будущее дерево. Пока у него один узел, и в нём все десять студентов: 5 зелёных и 5 красных. Если на этом остановиться, любому новому студенту придётся отвечать наугад.</p>
    </div>
    <div class="step-panel" data-on="ax pts root1 e1 L0 R0 v1 cnt" data-focus="v1 root1 cnt">
      <div class="step-kicker">Шаг 2 · первый вопрос</div>
      <h4>Делим студентов одним порогом</h4>
      <p>Дерево задаёт вопрос про один признак: «готовился не больше 13 часов?». На плоскости этот вопрос выглядит как вертикальная линия на отметке 13. Все, кто левее, отвечают «да», все, кто правее, «нет».</p>
<p>Слева оказались 6 студентов, из них сдал только один. Справа 4, и сдали все. Почему порог именно 13, а вопрос именно про часы, разберём в части 4: дерево перебирает все варианты и берёт тот, после которого группы получаются самыми однородными.</p>
    </div>
    <div class="step-panel" data-on="ax pts root1 e1 L0 R1 v1 reg3 ring4" data-focus="R1 reg3 ring4">
      <div class="step-kicker">Шаг 3 · правая группа готова</div>
      <h4>Однородная группа становится листом</h4>
      <p>Справа от линии все четверо сдали. Задавать им новые вопросы незачем: узел становится <strong>листом</strong>, и его ответ «сдал». Правая часть плоскости закрашена зелёным: так дерево ответит любому, кто готовился больше 13 часов.</p>
<p>Слева группа смешанная. Если ответить всем «не сдал», ошибка будет ровно одна: студент 4 готовился 8 часов, но сдал. У него почти нет пропусков, всего один.</p>
    </div>
    <div class="step-panel" data-on="ax pts root1 e1 L1 R1 e2 lv v1 h2 reg3 reg12" data-focus="h2 L1 lv reg12">
      <div class="step-kicker">Шаг 4 · второй вопрос</div>
      <h4>Левую группу делим по пропускам</h4>
      <p>Левому узлу дерево задаёт свой вопрос: «пропусков не больше двух?». На плоскости это горизонтальная линия, но только в левой части: правую часть она не трогает, потому что туда эти студенты не попадают.</p>
<p>Ниже линии остался один студент 4, он сдал. Выше пятеро, и никто из них не сдал. Обе группы однородные, оба узла становятся листами.</p>
    </div>
    <div class="step-panel" data-on="ax pts root1 e1 L1 R1 e2 lv v1 h2 reg3 reg12 ok" data-focus="lv R1 reg3 reg12 ok">
      <div class="step-kicker">Шаг 5 · готовое дерево</div>
      <h4>Три листа и три прямоугольника</h4>
      <p>У дерева два вопроса и три листа. Каждому листу соответствует прямоугольник плоскости с тем же номером: лист 1 это левый нижний угол, лист 2 левая верхняя часть, лист 3 вся правая.</p>
<p>Все десять студентов попали в листы своего цвета, ошибок на обучающих данных нет. Глубина дерева, то есть наибольшее число вопросов на пути от корня до листа, равна двум.</p>
    </div>
    <div class="step-panel" data-on="ax pts root1 e1 L1 R1 e2 lv reg3 reg12 bnd" data-focus="bnd">
      <div class="step-kicker">Шаг 6 · граница решений</div>
      <h4>Граница складывается из ступенек</h4>
      <p>Чёрная линия отделяет зону «сдаст» от зоны «не сдаст». Каждый вопрос дерева сравнивает один признак с порогом, поэтому каждый кусок границы параллелен одной из осей: вертикальный кусок дал вопрос про часы, горизонтальный вопрос про пропуски.</p>
<p>Логистическая регрессия на тех же осях провела бы одну наклонную прямую <span class="math-inline" data-tex="w_1 x_1 + w_2 x_2 + b = 0"></span>. Дерево наклонную линию провести не может, оно приближает её ступеньками, и чем больше вопросов, тем мельче ступеньки.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Итак, обученное дерево хранит две вещи: вопросы во внутренних узлах (какой признак
  и какой порог) и ответы в листах. Вопросы выбираются при обучении, это параметры модели,
  как веса <span class="math-inline" data-tex="w"></span> у регрессии. Только находят их
  не градиентным спуском, а перебором: от сдвига порога внутри промежутка между соседними
  студентами разбиение не меняется вообще, поэтому производная по порогу равна нулю почти
  везде и подсказать направление не может.
</p>

## Часть 2. Как дерево отвечает новому студенту

<p>
  Прогноз для нового объекта это спуск от корня к листу. В каждом узле объект отвечает
  на один вопрос и уходит в левую ветку («да») или в правую («нет»). Число вопросов не больше
  глубины дерева, у нашего их максимум два.
</p>

<div class="stage" id="stagePredict" tabindex="0">
  <div class="stage-figure">
<svg id="dtPredict" viewBox="0 0 960 500" role="img" aria-label="Новый студент спускается по дереву: на каждом узле сравнение одного признака с порогом"><style>#dtPredict { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="70" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">студенты на плоскости</text><text x="575" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">дерево, которое получается</text>
<g data-key="ax"><rect x="70" y="60" width="462" height="360" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="420" x2="70" y2="425" stroke="#5E5850" stroke-width="1"/><text x="70" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="154" y1="420" x2="154" y2="425" stroke="#5E5850" stroke-width="1"/><text x="154" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="238" y1="420" x2="238" y2="425" stroke="#5E5850" stroke-width="1"/><text x="238" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="322" y1="420" x2="322" y2="425" stroke="#5E5850" stroke-width="1"/><text x="322" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="406" y1="420" x2="406" y2="425" stroke="#5E5850" stroke-width="1"/><text x="406" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="490" y1="420" x2="490" y2="425" stroke="#5E5850" stroke-width="1"/><text x="490" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="65" y1="420" x2="70" y2="420" stroke="#5E5850" stroke-width="1"/><text x="61" y="425" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="65" y1="348" x2="70" y2="348" stroke="#5E5850" stroke-width="1"/><text x="61" y="353" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="65" y1="276" x2="70" y2="276" stroke="#5E5850" stroke-width="1"/><text x="61" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="65" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="61" y="209" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="65" y1="132" x2="70" y2="132" stroke="#5E5850" stroke-width="1"/><text x="61" y="137" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="65" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="61" y="65" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="301" y="464" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="36" y="240" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 240.0)">пропуски</text></g>
<g data-key="map"><rect x="343" y="60" width="189" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><circle cx="516" cy="76" r="11" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="516" y="80.5" font-size="12" fill="#73B222" text-anchor="middle" font-weight="700">3</text><rect x="70" y="348" width="273" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><circle cx="327" cy="364" r="11" fill="#FFFFFF" stroke="#73B222" stroke-width="1.6"/><text x="327" y="368.5" font-size="12" fill="#73B222" text-anchor="middle" font-weight="700">1</text><rect x="70" y="60" width="273" height="288" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><circle cx="327" cy="76" r="11" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.6"/><text x="327" y="80.5" font-size="12" fill="#C30B0A" text-anchor="middle" font-weight="700">2</text><line x1="343" y1="60" x2="343" y2="420" stroke="#C29E08" stroke-width="2"/><line x1="70" y1="348" x2="343" y2="348" stroke="#C29E08" stroke-width="2"/></g>
<g data-key="pts"><circle cx="112" cy="312" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="112" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="154" cy="168" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="154" y="172.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="196" cy="276" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="196" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="238" cy="384" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="238" y="388.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="280" cy="132" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="280" y="136.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="322" cy="240" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="322" y="244.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="364" cy="348" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="364" y="352.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="406" cy="204" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="406" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="448" cy="312" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="448" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="490" cy="276" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="490" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="tree"><line x1="760" y1="126" x2="680" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="704" y="169" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="760" y1="126" x2="883" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="837.5" y="169" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="680" y1="266" x2="612" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="630" y="307.5" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="680" y1="266" x2="754" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="733" y="307.5" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="650" y="64" width="220" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="760" y="89" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13 ?</text><circle cx="701.5" cy="109" r="5" fill="#73B222"/><circle cx="714.5" cy="109" r="5" fill="#73B222"/><circle cx="727.5" cy="109" r="5" fill="#73B222"/><circle cx="740.5" cy="109" r="5" fill="#73B222"/><circle cx="753.5" cy="109" r="5" fill="#73B222"/><circle cx="766.5" cy="109" r="5" fill="#C30B0A"/><circle cx="779.5" cy="109" r="5" fill="#C30B0A"/><circle cx="792.5" cy="109" r="5" fill="#C30B0A"/><circle cx="805.5" cy="109" r="5" fill="#C30B0A"/><circle cx="818.5" cy="109" r="5" fill="#C30B0A"/><rect x="585" y="204" width="190" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="680" y="229" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2 ?</text><circle cx="647.5" cy="249" r="5" fill="#73B222"/><circle cx="660.5" cy="249" r="5" fill="#C30B0A"/><circle cx="673.5" cy="249" r="5" fill="#C30B0A"/><circle cx="686.5" cy="249" r="5" fill="#C30B0A"/><circle cx="699.5" cy="249" r="5" fill="#C30B0A"/><circle cx="712.5" cy="249" r="5" fill="#C30B0A"/><rect x="827" y="204" width="112" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="883" y="229" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист 3 · сдал</text><circle cx="863.5" cy="249" r="5" fill="#73B222"/><circle cx="876.5" cy="249" r="5" fill="#73B222"/><circle cx="889.5" cy="249" r="5" fill="#73B222"/><circle cx="902.5" cy="249" r="5" fill="#73B222"/><rect x="552" y="341" width="120" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="612" y="366" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист 1 · сдал</text><circle cx="612" cy="386" r="5" fill="#73B222"/><rect x="684" y="341" width="140" height="62" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="754" y="366" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">лист 2 · не сдал</text><circle cx="728" cy="386" r="5" fill="#C30B0A"/><circle cx="741" cy="386" r="5" fill="#C30B0A"/><circle cx="754" cy="386" r="5" fill="#C30B0A"/><circle cx="767" cy="386" r="5" fill="#C30B0A"/><circle cx="780" cy="386" r="5" fill="#C30B0A"/></g>
<g data-key="a1" data-only="1"><line x1="301" y1="60" x2="301" y2="420" stroke="#3576C0" stroke-width="1.6" stroke-dasharray="5 4"/><rect x="645" y="59" width="230" height="72" rx="13" fill="none" stroke="#3576C0" stroke-width="2.4"/><line x1="760" y1="126" x2="680" y2="204" stroke="#3576C0" stroke-width="4.2" stroke-linecap="round"/><text x="575" y="448" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">А: часы 11 ≤ 13 → да, идём влево</text></g>
<g data-key="a2" data-only="1"><line x1="70" y1="384" x2="343" y2="384" stroke="#3576C0" stroke-width="1.6" stroke-dasharray="5 4"/><rect x="580" y="199" width="200" height="72" rx="13" fill="none" stroke="#3576C0" stroke-width="2.4"/><line x1="680" y1="266" x2="612" y2="341" stroke="#3576C0" stroke-width="4.2" stroke-linecap="round"/><rect x="547" y="336" width="130" height="72" rx="13" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="70" y="348" width="273" height="72" rx="0" fill="none" stroke="#3576C0" stroke-width="2.6"/><text x="575" y="470" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">пропуски 1 ≤ 2 → да → лист 1: сдаст</text></g>
<g data-key="b1" data-only="1"><line x1="385" y1="60" x2="385" y2="420" stroke="#3576C0" stroke-width="1.6" stroke-dasharray="5 4"/><rect x="645" y="59" width="230" height="72" rx="13" fill="none" stroke="#3576C0" stroke-width="2.4"/><line x1="760" y1="126" x2="883" y2="204" stroke="#3576C0" stroke-width="4.2" stroke-linecap="round"/><rect x="822" y="199" width="122" height="72" rx="13" fill="none" stroke="#3576C0" stroke-width="2.4"/><rect x="343" y="60" width="189" height="360" rx="0" fill="none" stroke="#3576C0" stroke-width="2.6"/><text x="575" y="448" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">Б: часы 15 > 13 → нет → лист 3: сдаст</text><text x="575" y="470" font-size="14" fill="#5E5850" text-anchor="start" font-weight="400">пропуски (7) дерево не спрашивало</text></g>
<g data-key="A" data-only="1"><circle cx="301" cy="384" r="12.5" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.8"/><text x="301" y="389" font-size="13" fill="#3576C0" text-anchor="middle" font-weight="700">А</text></g>
<g data-key="B" data-only="1"><circle cx="385" cy="168" r="12.5" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.8"/><text x="385" y="173" font-size="13" fill="#3576C0" text-anchor="middle" font-weight="700">Б</text></g>
<g data-key="lf" data-only="1"><rect x="550" y="408" width="124" height="28" rx="14" fill="#FFFFFF" stroke="#73B222" stroke-width="1.4"/><text x="612" y="427" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдали 1 из 1</text><rect x="698" y="408" width="124" height="28" rx="14" fill="#FFFFFF" stroke="#C30B0A" stroke-width="1.4"/><text x="760" y="427" font-size="13" fill="#9C0908" text-anchor="middle" font-weight="700">сдали 0 из 5</text><rect x="821" y="303" width="124" height="28" rx="14" fill="#FFFFFF" stroke="#73B222" stroke-width="1.4"/><text x="883" y="322" font-size="13" fill="#5F9420" text-anchor="middle" font-weight="700">сдали 4 из 4</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">синие кружки: новые студенты, которых в данных не было · синие линии: их путь по дереву</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax map pts tree A" data-focus="A">
      <div class="step-kicker">Шаг 1 · новый студент</div>
      <h4>Студент А: 11 часов, 1 пропуск</h4>
      <p>Дерево построено, теперь им можно пользоваться. Придёт студент А, которого в данных не было: он готовился 11 часов и пропустил одно занятие. Сдаст ли он?</p>
<p>На плоскости ответ виден сразу: синий кружок попал в зелёный прямоугольник. Но сама модель картинку не видит, у неё есть только дерево. Пройдём по нему так же, как это делает программа.</p>
    </div>
    <div class="step-panel" data-on="ax map pts tree A a1" data-focus="a1">
      <div class="step-kicker">Шаг 2 · вопрос корня</div>
      <h4>Корень спрашивает про часы</h4>
      <p>Корень сравнивает часы студента с порогом: <span class="math-inline" data-tex="11 \le 13"></span>, ответ «да», значит, идём по левой ветке. На плоскости это значит, что точка левее жёлтой вертикальной линии.</p>
<p>Пропуски корень не смотрит вовсе. Каждый узел задаёт ровно один вопрос про один признак.</p>
    </div>
    <div class="step-panel" data-on="ax map pts tree A a1 a2" data-focus="a2">
      <div class="step-kicker">Шаг 3 · вопрос второго узла</div>
      <h4>Второй вопрос приводит в лист</h4>
      <p>Левый узел сравнивает пропуски: <span class="math-inline" data-tex="1 \le 2"></span>, снова «да», и мы в листе 1. Вопросов больше нет, лист выдаёт свой ответ: «сдаст».</p>
<p>На плоскости путь по дереву сужает область шаг за шагом: сначала вся левая часть, потом только её нижняя полоса. Лист 1 и есть эта полоса.</p>
    </div>
    <div class="step-panel" data-on="ax map pts tree A B b1" data-focus="b1 B">
      <div class="step-kicker">Шаг 4 · второй студент</div>
      <h4>Студенту Б хватает одного вопроса</h4>
      <p>Студент Б готовился 15 часов и пропустил 7 занятий. Корень: <span class="math-inline" data-tex="15 > 13"></span>, ответ «нет», правая ветка, и это сразу лист 3 с ответом «сдаст».</p>
<p>Семь пропусков, больше, чем у любого сдавшего студента в таблице, на ответ не повлияли: в правой ветке дерево про пропуски не спрашивает. Так получилось потому, что среди наших четверых студентов с подготовкой больше 13 часов сдали все, и делить их дальше было не нужно.</p>
    </div>
    <div class="step-panel" data-on="ax map pts tree A B lf" data-focus="lf">
      <div class="step-kicker">Шаг 5 · что хранит лист</div>
      <h4>Лист помнит, кто в него попал при обучении</h4>
      <p>В каждом листе записано, сколько обучающих студентов туда попало и сколько из них сдало. Ответ листа берётся по большинству. Доля сдавших служит оценкой вероятности:</p>
<div class="math-display" data-tex="\hat p = \frac{\text{сдали в листе}}{\text{всего в листе}}"></div>
<p>Для листа 3 это <span class="math-inline" data-tex="4/4 = 1"></span>, для листа 1 тоже <span class="math-inline" data-tex="1/1 = 1"></span>. Но лист 1 держится на одном студенте, а лист 3 на четырёх. Дерево одинаково уверено в обоих ответах, хотя данных за ними разное количество. К этому вернёмся в части про переобучение.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<div class="callout-blue">
  <strong>Что нужно для прогноза:</strong> только сравнения чисел, без умножений
  и без функций активации. Поэтому дерево легко прочитать: путь до листа 1 записывается
  правилом «если часов не больше 13 и пропусков не больше 2, то сдаст».
</div>

## Часть 3. Насколько узел однородный: энтропия

<p>
  Чтобы выбирать вопросы, нужна мера, которая показывает, насколько перемешаны классы
  в узле. От неё требуется три вещи. Если все студенты в узле из одного класса, мера равна нулю.
  Наибольшее значение она принимает, когда классов поровну. И чем ближе доли классов друг
  к другу, тем она больше.
</p>

<p>
  Такая мера есть в теории информации, это энтропия Шеннона. Исход с вероятностью <span class="math-inline" data-tex="q"></span>
  несёт <span class="math-inline" data-tex="-\log_2 q"></span> бит информации: монетка с исходом 1/2 даёт 1 бит,
  событие с вероятностью 1/4 даёт 2 бита, а исход с вероятностью 1 не даёт ничего, его
  знали заранее. Энтропия узла равна среднему числу бит, которое мы получаем, узнав исход
  случайного студента из этого узла:
</p>

<div class="math-display" data-tex="H = -\sum_k p_k \log_2 p_k = -p\log_2 p - (1-p)\log_2(1-p)"></div>

<p>
  Здесь <span class="math-inline" data-tex="p_k"></span> доля класса <span class="math-inline" data-tex="k"></span> в узле; классов у нас два, поэтому
  справа записан вариант через одну долю сдавших <span class="math-inline" data-tex="p"></span>. Минус стоит потому, что
  логарифм доли меньше нуля, а энтропию удобно считать положительной.
</p>

<div class="dt-live" id="entLive">
  <div class="dt-live-head"><strong>Интерактив: энтропия одного узла</strong>
    <p>Добавляйте и убирайте студентов и следите за точкой на кривой. Кнопки ниже ставят состав наших узлов.</p></div>
  <div class="dt-live-grid">
    <div><svg id="entSvg" viewBox="0 0 560 330" role="img" aria-label="Студенты в узле и кривая энтропии"></svg></div>
    <div class="dt-controls">
      <div class="dt-counter"><span>сдали</span><button type="button" data-d="p-">−</button><output id="entP">5</output><button type="button" data-d="p+">+</button></div>
      <div class="dt-counter"><span>не сдали</span><button type="button" data-d="f-">−</button><output id="entF">5</output><button type="button" data-d="f+">+</button></div>
      <div class="dt-presets">
        <button type="button" data-preset="5,5">корень: 5 и 5</button>
        <button type="button" data-preset="1,5">левый узел: 1 и 5</button>
        <button type="button" data-preset="4,0">лист: 4 и 0</button>
        <button type="button" data-preset="1,9">1 и 9</button>
      </div>
      <div class="dt-metrics">
        <div class="dt-metric"><span>доля сдавших p</span><strong id="entShare">—</strong></div>
        <div class="dt-metric"><span>энтропия H</span><strong id="entH">—</strong></div>
      </div>
    </div>
  </div>
  <div class="dt-formula" id="entFormula"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('entSvg');
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
  var st = {p: 5, f: 5};
  var C = {l: 60, r: 540, t: 140, b: 296};
  function cx(p) { return C.l + p * (C.r - C.l); }
  function cy(v) { return C.b - v * (C.b - C.t); }
  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 560, height: 330, fill: '#FFFFFF'}));
    svg.appendChild(el('rect', {x: 20, y: 14, width: 520, height: 78, rx: 12, fill: '#FAFAF7', stroke: '#D8D4C8'}));
    var n = st.p + st.f, step = Math.min(26, 480 / Math.max(n, 1));
    var x0 = 280 - (n - 1) * step / 2;
    for (var i = 0; i < n; i++) {
      svg.appendChild(el('circle', {cx: x0 + i * step, cy: 53, r: Math.min(10, step / 2 - 1), fill: i < st.p ? '#73B222' : '#C30B0A',
                                    stroke: '#FFFFFF', 'stroke-width': 1.5}));
    }
    if (n === 0) svg.appendChild(el('text', {x: 280, y: 58, 'text-anchor': 'middle', 'font-size': 14, fill: '#5E5850'}, 'узел пуст'));
    svg.appendChild(el('rect', {x: C.l, y: C.t, width: C.r - C.l, height: C.b - C.t, fill: '#FFFFFF', stroke: '#D8D4C8'}));
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      svg.appendChild(el('text', {x: cx(v), y: C.b + 18, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, fmt(v, 2).replace(/,?0+$/, '') || '0'));
    });
    [0, 0.5, 1].forEach(function (v) {
      svg.appendChild(el('text', {x: C.l - 8, y: cy(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, v === 0.5 ? '0,5' : String(v)));
    });
    svg.appendChild(el('text', {x: C.r, y: C.b + 32, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'доля сдавших p'));
    svg.appendChild(el('text', {x: C.l, y: C.t - 10, 'font-size': 12, fill: '#5E5850'}, 'энтропия H'));
    var d = [];
    for (var t = 0; t <= 200; t++) d.push((t ? 'L' : 'M') + cx(t / 200) + ' ' + cy(H(t, 200)));
    svg.appendChild(el('path', {d: d.join(' '), fill: 'none', stroke: '#3576C0', 'stroke-width': 3}));
    if (n > 0) {
      var p = st.p / n, h = H(st.p, n);
      svg.appendChild(el('line', {x1: cx(p), y1: C.b, x2: cx(p), y2: cy(h), stroke: '#2A5E9B', 'stroke-dasharray': '4 3'}));
      svg.appendChild(el('circle', {cx: cx(p), cy: cy(h), r: 7, fill: '#2A5E9B', stroke: '#FFFFFF', 'stroke-width': 2}));
      var right = cx(p) > 420;
      svg.appendChild(el('text', {x: cx(p) + (right ? -12 : 12), y: cy(h) - 10, 'text-anchor': right ? 'end' : 'start',
                                  'font-size': 14, 'font-weight': 700, fill: '#2A5E9B'}, 'H = ' + fmt(h, 3)));
    }
  }
  function frac(k, n) { return '\\tfrac{' + k + '}{' + n + '}'; }
  function update() {
    var n = st.p + st.f;
    document.getElementById('entP').textContent = st.p;
    document.getElementById('entF').textContent = st.f;
    document.getElementById('entShare').textContent = n ? st.p + '/' + n + ' = ' + fmt(st.p / n, 3) : '—';
    document.getElementById('entH').textContent = n ? fmt(H(st.p, n), 3) : '—';
    var node = document.getElementById('entFormula');
    if (!n) { node.textContent = 'В пустом узле энтропия не определена.'; draw(); return; }
    var terms = [];
    if (st.p > 0) terms.push(frac(st.p, n) + '\\log_2' + frac(st.p, n));
    if (st.f > 0) terms.push(frac(st.f, n) + '\\log_2' + frac(st.f, n));
    var src = 'H = -\\left(' + terms.join(' + ') + '\\right) = ' + fmt(H(st.p, n), 3).replace(',', '{,}');
    tex(node, src, 'H = ' + fmt(H(st.p, n), 3));
    draw();
  }
  document.querySelectorAll('#entLive [data-d]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-d'), key = k[0], dv = k[1] === '+' ? 1 : -1;
      st[key] = Math.max(0, Math.min(12, st[key] + dv));
      update();
    });
  });
  document.querySelectorAll('#entLive [data-preset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-preset').split(',');
      st.p = +v[0]; st.f = +v[1];
      update();
    });
  });
  update();
})();
</script>

<p>
  Значения для узлов нашего дерева:
</p>

<div class="dt-table"><table class="shape-table">
  <tr><th>Узел</th><th>Сдали</th><th>Доля p</th><th>Энтропия H</th></tr>
  <tr><td>корень</td><td>5 из 10</td><td>1/2</td><td>1</td></tr>
  <tr><td>левый узел после «часы ≤ 13»</td><td>1 из 6</td><td>1/6</td><td>0,650</td></tr>
  <tr><td>любой лист</td><td>все или никто</td><td>1 или 0</td><td>0</td></tr>
  <tr><td>для сравнения</td><td>1 из 10</td><td>1/10</td><td>0,469</td></tr>
</table></div>

<div class="callout-blue">
  <strong>Почему в чистом узле получается ноль:</strong> одно слагаемое равно
  <span class="math-inline" data-tex="1 \cdot \log_2 1 = 0"></span>, а второе имеет вид
  <span class="math-inline" data-tex="0 \cdot \log_2 0"></span>. Логарифма нуля не существует,
  но произведение <span class="math-inline" data-tex="q\log_2 q"></span> стремится к нулю
  при <span class="math-inline" data-tex="q \to 0"></span>, поэтому такое слагаемое считают нулём.
  В коде это сделано условием <code>if q > 0</code>.
</div>

## Часть 4. Как выбрать вопрос: прирост информации

<p>
  Вопрос делит узел на две группы. Если в группах классы перемешаны меньше, чем в родителе,
  вопрос полезен. Насколько полезен, показывает прирост информации: энтропия родителя минус
  средняя энтропия детей, взвешенная по их размеру.
</p>

<div class="math-display" data-tex="IG = H(\text{родитель}) - \frac{n_L}{n}H_L - \frac{n_R}{n}H_R"></div>

<p>
  Посчитаем его для вопроса, который дерево выбрало в корне.
</p>

<div class="stage" id="stageGain" tabindex="0">
  <div class="stage-figure">
<svg id="dtGain" viewBox="0 0 960 500" role="img" aria-label="Прирост информации для порога часы не больше 13, посчитанный по шагам"><style>#dtGain { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="70" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">студенты на плоскости</text>
<text x="565" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">считаем прирост информации</text>
<g data-key="ax"><rect x="70" y="60" width="462" height="360" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="420" x2="70" y2="425" stroke="#5E5850" stroke-width="1"/><text x="70" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="154" y1="420" x2="154" y2="425" stroke="#5E5850" stroke-width="1"/><text x="154" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="238" y1="420" x2="238" y2="425" stroke="#5E5850" stroke-width="1"/><text x="238" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="322" y1="420" x2="322" y2="425" stroke="#5E5850" stroke-width="1"/><text x="322" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="406" y1="420" x2="406" y2="425" stroke="#5E5850" stroke-width="1"/><text x="406" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="490" y1="420" x2="490" y2="425" stroke="#5E5850" stroke-width="1"/><text x="490" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="65" y1="420" x2="70" y2="420" stroke="#5E5850" stroke-width="1"/><text x="61" y="425" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="65" y1="348" x2="70" y2="348" stroke="#5E5850" stroke-width="1"/><text x="61" y="353" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="65" y1="276" x2="70" y2="276" stroke="#5E5850" stroke-width="1"/><text x="61" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="65" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="61" y="209" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="65" y1="132" x2="70" y2="132" stroke="#5E5850" stroke-width="1"/><text x="61" y="137" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="65" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="61" y="65" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="301" y="464" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="36" y="240" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 240.0)">пропуски</text></g>
<g data-key="v13" data-only="1"><rect x="343" y="60" width="189" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="343" y1="60" x2="343" y2="420" stroke="#C29E08" stroke-width="2.4"/><text x="347" y="54" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">часы = 13</text></g>
<g data-key="c13" data-only="1"><text x="206.5" y="86" font-size="13" fill="#111111" text-anchor="middle" font-weight="400">слева 6: сдал 1</text><text x="437.5" y="86" font-size="13" fill="#111111" text-anchor="middle" font-weight="400">справа 4: сдали 4</text></g>
<g data-key="v11" data-only="1"><line x1="301" y1="60" x2="301" y2="420" stroke="#C29E08" stroke-width="2.4" stroke-dasharray="6 4"/><text x="297" y="54" font-size="12" fill="#8F7406" text-anchor="end" font-weight="700">часы = 11</text></g>
<g data-key="pts"><circle cx="112" cy="312" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="112" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="154" cy="168" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="154" y="172.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="196" cy="276" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="196" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="238" cy="384" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="238" y="388.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="280" cy="132" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="280" y="136.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="322" cy="240" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="322" y="244.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="364" cy="348" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="364" y="352.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="406" cy="204" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="406" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="448" cy="312" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="448" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="490" cy="276" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="490" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="r1" data-only="1"><text x="572" y="72" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">родитель: 10 студентов, сдали 5</text><foreignObject x="565" y="81" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="H = -\left(\tfrac{5}{10}\log_2\tfrac{5}{10} + \tfrac{5}{10}\log_2\tfrac{5}{10}\right) = 1"></div></foreignObject></g>
<g data-key="r2" data-only="1"><text x="572" y="142" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">левая группа: 6 студентов, сдал 1</text><foreignObject x="565" y="151" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="H_L = -\left(\tfrac{1}{6}\log_2\tfrac{1}{6} + \tfrac{5}{6}\log_2\tfrac{5}{6}\right) = 0{,}650"></div></foreignObject></g>
<g data-key="r3" data-only="1"><text x="572" y="212" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">правая группа: 4 студента, сдали 4</text><foreignObject x="565" y="221" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="H_R = -\tfrac{4}{4}\log_2\tfrac{4}{4} = 0"></div></foreignObject></g>
<g data-key="r4" data-only="1"><text x="572" y="282" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">взвешиваем по размеру групп</text><foreignObject x="565" y="291" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="\tfrac{6}{10}\cdot 0{,}650 + \tfrac{4}{10}\cdot 0 = 0{,}390"></div></foreignObject></g>
<g data-key="r5" data-only="1"><rect x="560" y="338" width="380" height="74" rx="12" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/><text x="572" y="360" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">прирост информации</text><foreignObject x="565" y="369" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5F9420;font-weight:400" data-tex="IG = 1 - 0{,}390 = 0{,}610"></div></foreignObject></g>
<g data-key="r6" data-only="1"><rect x="560" y="426" width="380" height="74" rx="12" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.5"/><text x="572" y="448" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">«часы ≤ 11»: слева сдал 1 из 5, справа 4 из 5</text><foreignObject x="565" y="457" width="370" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="H_L = H_R = 0{,}722,\quad IG = 1 - 0{,}722 = 0{,}278"></div></foreignObject></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax pts r1" data-focus="r1">
      <div class="step-kicker">Шаг 1 · энтропия родителя</div>
      <h4>До разбиения неопределённость максимальна</h4>
      <p>В корне 10 студентов, ровно половина сдала. Доли равны, поэтому энтропия равна единице: это наибольшее значение для двух классов.</p>
<p>Эту величину мы и будем уменьшать. Хороший вопрос делит студентов на группы, в каждой из которых энтропия ниже.</p>
    </div>
    <div class="step-panel" data-on="ax pts r1 v13 c13 r2 r3" data-focus="v13 c13 r2 r3">
      <div class="step-kicker">Шаг 2 · энтропия детей</div>
      <h4>Считаем энтропию каждой группы отдельно</h4>
      <p>Порог «часы ≤ 13» делит студентов на две группы. В левой шестеро, сдал один: доля сдавших <span class="math-inline" data-tex="1/6"></span>, энтропия 0,650. В правой все четверо сдали: доля равна единице, энтропия ноль.</p>
<p>Слагаемое <span class="math-inline" data-tex="0 \cdot \log_2 0"></span> в формуле считают равным нулю: при <span class="math-inline" data-tex="q \to 0"></span> произведение <span class="math-inline" data-tex="q\log_2 q"></span> стремится к нулю. Поэтому для чистой группы остаётся одно слагаемое <span class="math-inline" data-tex="1 \cdot \log_2 1 = 0"></span>.</p>
    </div>
    <div class="step-panel" data-on="ax pts r1 v13 c13 r2 r3 r4" data-focus="r4">
      <div class="step-kicker">Шаг 3 · взвешенное среднее</div>
      <h4>Большая группа весит больше</h4>
      <p>Энтропии двух групп складываем с весами, равными долям студентов: левая группа содержит 6 из 10, правая 4 из 10.</p>
<div class="math-display" data-tex="H_{\text{дети}} = \frac{n_L}{n}H_L + \frac{n_R}{n}H_R = 0{,}6 \cdot 0{,}650 + 0{,}4 \cdot 0 = 0{,}390"></div>
<p>Без весов порог, отрезающий одного студента в чистую группу, выглядел бы хорошим: одна из двух энтропий нулевая. С весами такая группа почти ничего не даёт, потому что её вес 1/10.</p>
    </div>
    <div class="step-panel" data-on="ax pts r1 v13 c13 r2 r3 r4 r5" data-focus="r5">
      <div class="step-kicker">Шаг 4 · прирост</div>
      <h4>Прирост информации: насколько упала энтропия</h4>
      <p>Прирост информации равен энтропии родителя минус взвешенная энтропия детей:</p>
<div class="math-display" data-tex="IG = H - \frac{n_L}{n}H_L - \frac{n_R}{n}H_R = 1 - 0{,}390 = 0{,}610"></div>
<p>Вопрос «часы ≤ 13» убрал 61 % неопределённости корня. Это и есть оценка порога: чем больше прирост, тем лучше вопрос.</p>
    </div>
    <div class="step-panel" data-on="ax pts r1 v13 r2 r3 r4 r5 v11 r6" data-focus="v11 r6">
      <div class="step-kicker">Шаг 5 · другой порог</div>
      <h4>Порог «часы ≤ 11» даёт меньше</h4>
      <p>Сдвинем порог на одного студента левее: студент 6 (12 часов, не сдал) переходит в правую группу. Теперь обе группы по пятеро, и в каждой один студент из другого класса: <span class="math-inline" data-tex="H_L = H_R = 0{,}722"></span>.</p>
<p>Взвешенная энтропия 0,722, прирост 0,278: меньше половины от 0,610 у порога 13. Дерево сравнивает так все возможные пороги и берёт тот, у которого прирост наибольший.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Какие пороги вообще пробовать? Между студентами с 12 и 14 часами любой порог, хоть 12,1,
  хоть 13,9, делит студентов одинаково. Поэтому достаточно взять по одному порогу в каждом
  промежутке между соседними различными значениями; принято брать середину, так делает
  и <code>sklearn</code>. Различных значений часов 10, промежутков 9. У пропусков различных
  значений 8 (тройка и четвёрка встречаются дважды), промежутков 7. Всего 16 кандидатов.
</p>

<div class="dt-live" id="splitLive">
  <div class="dt-live-head"><strong>Интерактив: перебор всех порогов в корне</strong>
    <p>Выберите признак и двигайте порог. Столбики внизу показывают прирост для всех 16 кандидатов, по столбику можно щёлкнуть.</p></div>
  <div class="dt-live-grid">
    <div><svg id="splitSvg" viewBox="0 0 520 450" role="img" aria-label="Студенты на плоскости и текущий порог"></svg></div>
    <div class="dt-controls">
      <div class="dt-seg"><button type="button" data-f="0" aria-pressed="true">часы</button><button type="button" data-f="1" aria-pressed="false">пропуски</button></div>
      <div class="dt-control"><label for="splitR"><span>порог</span><output id="splitT">—</output></label>
        <input id="splitR" type="range" min="0" max="8" step="1" value="5"></div>
      <div class="dt-metrics">
        <div class="dt-metric"><span id="splitLcap">левая группа</span><strong class="two" id="splitL">—</strong></div>
        <div class="dt-metric"><span id="splitRcap">правая группа</span><strong class="two" id="splitRt">—</strong></div>
        <div class="dt-metric"><span>взвешенная H детей</span><strong id="splitW">—</strong></div>
        <div class="dt-metric"><span>энтропия корня</span><strong>1,000</strong></div>
        <div class="dt-metric is-main"><span>прирост информации IG</span><strong id="splitG">—</strong></div>
      </div>
    </div>
  </div>
  <div class="dt-bars"><svg id="splitBars" viewBox="0 0 900 200" role="img" aria-label="Прирост информации для всех 16 порогов"></svg></div>
  <div class="dt-formula" id="splitFormula"></div>
</div>
<script>
(function () {
  var svg = document.getElementById('splitSvg');
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
  var D = [[2, 3, 0], [4, 7, 0], [6, 4, 0], [8, 1, 1], [10, 8, 0], [12, 5, 0], [14, 2, 1], [16, 6, 1], [18, 3, 1], [20, 4, 1]];
  var NAMES = ['часы', 'пропуски'];
  var cands = [];
  [0, 1].forEach(function (f) {
    var vals = Array.from(new Set(D.map(function (r) { return r[f]; }))).sort(function (a, b) { return a - b; });
    for (var i = 0; i + 1 < vals.length; i++) {
      var t = (vals[i] + vals[i + 1]) / 2;
      var L = D.filter(function (r) { return r[f] <= t; }), R = D.filter(function (r) { return r[f] > t; });
      var kL = L.filter(function (r) { return r[2]; }).length, kR = R.filter(function (r) { return r[2]; }).length;
      var hL = H(kL, L.length), hR = H(kR, R.length);
      var w = (L.length * hL + R.length * hR) / D.length;
      cands.push({f: f, t: t, nL: L.length, kL: kL, nR: R.length, kR: kR, hL: hL, hR: hR, w: w, g: 1 - w});
    }
  });
  var best = cands.reduce(function (a, c) { return c.g > a.g ? c : a; });
  var st = {f: 0, i: 5};
  var P = {x0: 60, y0: 390, kx: 20, ky: 32};
  function X(h) { return P.x0 + h * P.kx; }
  function Y(a) { return P.y0 - a * P.ky; }
  function num(v) { return String(v).replace('.', ','); }
  function list() { return cands.filter(function (c) { return c.f === st.f; }); }
  function drawPlane(c) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(el('rect', {x: 0, y: 0, width: 520, height: 450, fill: '#FFFFFF'}));
    var W = 22 * P.kx, Hh = 10 * P.ky;
    svg.appendChild(el('rect', {x: P.x0, y: Y(10), width: W, height: Hh, fill: '#FFFFFF', stroke: '#D8D4C8'}));
    var tint = function (k, n) { return n === 0 ? '#FFFFFF' : (k === n ? '#EEF6E2' : (k === 0 ? '#FCE9E9' : '#F7F4EC')); };
    if (c.f === 0) {
      svg.appendChild(el('rect', {x: P.x0, y: Y(10), width: X(c.t) - P.x0, height: Hh, fill: tint(c.kL, c.nL)}));
      svg.appendChild(el('rect', {x: X(c.t), y: Y(10), width: X(22) - X(c.t), height: Hh, fill: tint(c.kR, c.nR)}));
      svg.appendChild(el('line', {x1: X(c.t), y1: Y(10), x2: X(c.t), y2: P.y0, stroke: '#C29E08', 'stroke-width': 3}));
    } else {
      svg.appendChild(el('rect', {x: P.x0, y: Y(c.t), width: W, height: P.y0 - Y(c.t), fill: tint(c.kL, c.nL)}));
      svg.appendChild(el('rect', {x: P.x0, y: Y(10), width: W, height: Y(c.t) - Y(10), fill: tint(c.kR, c.nR)}));
      svg.appendChild(el('line', {x1: P.x0, y1: Y(c.t), x2: X(22), y2: Y(c.t), stroke: '#C29E08', 'stroke-width': 3}));
    }
    for (var h = 0; h <= 20; h += 4) svg.appendChild(el('text', {x: X(h), y: P.y0 + 20, 'text-anchor': 'middle', 'font-size': 13, fill: '#5E5850'}, String(h)));
    for (var a = 0; a <= 10; a += 2) svg.appendChild(el('text', {x: P.x0 - 9, y: Y(a) + 5, 'text-anchor': 'end', 'font-size': 13, fill: '#5E5850'}, String(a)));
    svg.appendChild(el('text', {x: X(11), y: P.y0 + 42, 'text-anchor': 'middle', 'font-size': 14, fill: '#5E5850'}, 'часы подготовки'));
    var lab = el('text', {x: 22, y: Y(5), 'text-anchor': 'middle', 'font-size': 14, fill: '#5E5850', transform: 'rotate(-90 22 ' + Y(5) + ')'}, 'пропуски');
    svg.appendChild(lab);
    D.forEach(function (r, i) {
      svg.appendChild(el('circle', {cx: X(r[0]), cy: Y(r[1]), r: 11.5, fill: r[2] ? '#73B222' : '#C30B0A', stroke: '#FFFFFF', 'stroke-width': 1.5}));
      svg.appendChild(el('text', {x: X(r[0]), y: Y(r[1]) + 4.5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#FFFFFF'}, String(i + 1)));
    });
    var lbl = NAMES[c.f] + ' = ' + num(c.t);
    if (c.f === 0) svg.appendChild(el('text', {x: X(c.t), y: Y(10) - 8, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#8F7406'}, lbl));
    else svg.appendChild(el('text', {x: X(22) - 6, y: Y(c.t) - 7, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 700, fill: '#8F7406'}, lbl));
  }
  var bars = document.getElementById('splitBars');
  function drawBars(c) {
    while (bars.firstChild) bars.removeChild(bars.firstChild);
    bars.appendChild(el('rect', {x: 0, y: 0, width: 900, height: 200, fill: '#FFFFFF'}));
    var base = 150, k = 175;
    bars.appendChild(el('line', {x1: 30, y1: base, x2: 890, y2: base, stroke: '#D8D4C8'}));
    cands.forEach(function (q, j) {
      var x = q.f === 0 ? 50 + j * 50 : 50 + 9 * 50 + 40 + (j - 9) * 50;
      var on = q === c, isBest = q === best;
      var r = el('rect', {x: x, y: base - q.g * k - 1, width: 34, height: q.g * k + 1, rx: 3, 'class': 'bar',
                          fill: on ? '#C29E08' : (isBest ? '#E2CF84' : '#D9D4C9')});
      r.addEventListener('click', function () { st.f = q.f; st.i = list().indexOf(q); sync(); });
      bars.appendChild(r);
      bars.appendChild(el('text', {x: x + 17, y: base - q.g * k - 7, 'text-anchor': 'middle', 'font-size': 11,
                                   'font-weight': on ? 700 : 400, fill: on ? '#8F7406' : '#5E5850'}, fmt(q.g, 3)));
      bars.appendChild(el('text', {x: x + 17, y: base + 16, 'text-anchor': 'middle', 'font-size': 12, fill: '#5E5850'}, num(q.t)));
    });
    bars.appendChild(el('text', {x: 50 + 4 * 50 + 17, y: base + 38, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#5E5850'}, 'пороги по часам'));
    bars.appendChild(el('text', {x: 540 + 3 * 50 + 17, y: base + 38, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#5E5850'}, 'пороги по пропускам'));
    bars.appendChild(el('text', {x: 30, y: 18, 'font-size': 13, fill: '#5E5850'}, 'прирост информации; бледно-жёлтый столбик: лучший порог'));
  }
  function sync() {
    var L = list();
    var range = document.getElementById('splitR');
    range.max = L.length - 1;
    st.i = Math.max(0, Math.min(L.length - 1, st.i));
    range.value = st.i;
    document.querySelectorAll('#splitLive [data-f]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-f') === st.f)); });
    var c = L[st.i];
    document.getElementById('splitT').textContent = NAMES[c.f] + ' ≤ ' + num(c.t);
    document.getElementById('splitL').textContent = c.kL + ' из ' + c.nL + '\nH = ' + fmt(c.hL, 3);
    document.getElementById('splitRt').textContent = c.kR + ' из ' + c.nR + '\nH = ' + fmt(c.hR, 3);
    document.getElementById('splitLcap').textContent = 'слева (≤): сдали';
    document.getElementById('splitRcap').textContent = 'справа (>): сдали';
    document.getElementById('splitW').textContent = fmt(c.w, 3);
    document.getElementById('splitG').textContent = fmt(c.g, 3) + (c === best ? '  ★ лучший' : '');
    var src = 'IG = 1 - \\tfrac{' + c.nL + '}{10}\\cdot ' + fmt(c.hL, 3).replace(',', '{,}') + ' - \\tfrac{' + c.nR + '}{10}\\cdot '
            + fmt(c.hR, 3).replace(',', '{,}') + ' = ' + fmt(c.g, 3).replace(',', '{,}');
    tex(document.getElementById('splitFormula'), src, 'IG = ' + fmt(c.g, 3));
    drawPlane(c);
    drawBars(c);
  }
  document.getElementById('splitR').addEventListener('input', function (ev) { st.i = +ev.target.value; sync(); });
  document.querySelectorAll('#splitLive [data-f]').forEach(function (b) {
    b.addEventListener('click', function () { var f = +b.getAttribute('data-f'); if (f !== st.f) { st.f = f; st.i = 0; } sync(); });
  });
  sync();
})();
</script>

<p>
  На столбиках видно, что пороги по часам в целом сильнее порогов по пропускам, а лучший
  из всех «часы ≤ 13». Второе место делят «часы ≤ 7» и «часы ≤ 15» с приростом 0,396:
  первый отделяет троих несдавших слева, второй троих сдавших справа. Самый слабый
  «пропуски ≤ 5,5», 0,035: по обе стороны от него классы перемешаны почти так же, как в корне.
</p>

## Часть 5. Дерево растёт рекурсивно

<p>
  После выбора вопроса в корне студенты расходятся по двум веткам, и каждая ветка становится
  новой задачей того же вида: есть группа студентов, нужно найти для неё лучший вопрос.
  Это рекурсия, и останавливается она, когда делить нечего или незачем.
</p>

<div class="stage" id="stageGrow" tabindex="0">
  <div class="stage-figure">
<svg id="dtGrow" viewBox="0 0 960 500" role="img" aria-label="Рекурсивное построение: перебор порогов в корне, затем в левом узле, затем остановка"><style>#dtGrow { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="40" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">прирост для каждого порога в узле</text>
<text x="575" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">дерево</text>
<g data-key="bars0" data-only="1"><text x="40" y="52" font-size="13" fill="#111111" text-anchor="start" font-weight="400">корень: 10 студентов, 16 порогов</text><text x="150" y="83" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 3</text><rect x="160" y="71" width="51.86" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="217.86" y="83" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,108</text><text x="150" y="105" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 5</text><rect x="160" y="93" width="113.5" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="279.5" y="105" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,236</text><text x="150" y="127" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 7</text><rect x="160" y="115" width="189.99" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="355.99" y="127" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,396</text><text x="150" y="149" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 9</text><rect x="160" y="137" width="59.77" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="225.77" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,125</text><text x="150" y="171" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 11</text><rect x="160" y="159" width="133.47" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="299.47" y="171" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,278</text><text x="150" y="193" font-size="13" fill="#111111" text-anchor="end" font-weight="700">часы ≤ 13</text><rect x="160" y="181" width="292.79" height="14" rx="2" fill="#C29E08" stroke="none" stroke-width="0"/><text x="458.79" y="193" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">0,610</text><text x="150" y="215" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 15</text><rect x="160" y="203" width="189.99" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="355.99" y="215" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,396</text><text x="150" y="237" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 17</text><rect x="160" y="225" width="113.5" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="279.5" y="237" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,236</text><text x="150" y="259" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 19</text><rect x="160" y="247" width="51.86" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="217.86" y="259" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,108</text><text x="150" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 1,5</text><rect x="160" y="269" width="51.86" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="217.86" y="281" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,108</text><text x="150" y="303" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 2,5</text><rect x="160" y="291" width="113.5" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="279.5" y="303" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,236</text><text x="150" y="325" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 3,5</text><rect x="160" y="313" width="59.77" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="225.77" y="325" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,125</text><text x="150" y="347" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 4,5</text><rect x="160" y="335" width="59.77" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="225.77" y="347" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,125</text><text x="150" y="369" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 5,5</text><rect x="160" y="357" width="16.73" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="182.73" y="369" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,035</text><text x="150" y="391" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 6,5</text><rect x="160" y="379" width="113.5" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="279.5" y="391" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,236</text><text x="150" y="413" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 7,5</text><rect x="160" y="401" width="51.86" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="217.86" y="413" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,108</text></g>
<g data-key="bars1" data-only="1"><text x="40" y="52" font-size="13" fill="#111111" text-anchor="start" font-weight="400">левый узел: 6 студентов, 10 порогов</text><text x="150" y="83" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 3</text><rect x="160" y="71" width="23.24" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="189.24" y="83" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,048</text><text x="150" y="105" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 5</text><rect x="160" y="93" width="52.4" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="218.4" y="105" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,109</text><text x="150" y="127" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 7</text><rect x="160" y="115" width="91.62" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="257.62" y="127" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,191</text><text x="150" y="149" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 9</text><rect x="160" y="137" width="52.4" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="218.4" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,109</text><text x="150" y="171" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">часы ≤ 11</text><rect x="160" y="159" width="23.24" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="189.24" y="171" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,048</text><text x="150" y="193" font-size="13" fill="#111111" text-anchor="end" font-weight="700">пропуски ≤ 2</text><rect x="160" y="181" width="312.01" height="14" rx="2" fill="#C29E08" stroke="none" stroke-width="0"/><text x="478.01" y="193" font-size="12" fill="#8F7406" text-anchor="start" font-weight="700">0,650</text><text x="150" y="215" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 3,5</text><rect x="160" y="203" width="152.01" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="318.01" y="215" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,317</text><text x="150" y="237" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 4,5</text><rect x="160" y="225" width="91.62" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="257.62" y="237" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,191</text><text x="150" y="259" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 6</text><rect x="160" y="247" width="52.4" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="218.4" y="259" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,109</text><text x="150" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">пропуски ≤ 7,5</text><rect x="160" y="269" width="23.24" height="14" rx="2" fill="#CFCAC0" stroke="none" stroke-width="0"/><text x="189.24" y="281" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">0,048</text></g>
<g data-key="rules" data-only="1"><rect x="40" y="80" width="470" height="74" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="58" y="110" font-size="15" fill="#111111" text-anchor="start" font-weight="700">узел чистый: энтропия равна нулю</text><text x="58" y="134" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">делить нечего</text><rect x="40" y="172" width="470" height="74" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="58" y="202" font-size="15" fill="#111111" text-anchor="start" font-weight="700">достигнута глубина max_depth</text><text x="58" y="226" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">дерево не растёт ниже</text><rect x="40" y="264" width="470" height="74" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="58" y="294" font-size="15" fill="#111111" text-anchor="start" font-weight="700">в узле меньше min_samples_split</text><text x="58" y="318" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">объектов слишком мало для вопроса</text><rect x="40" y="356" width="470" height="74" rx="10" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><text x="58" y="386" font-size="15" fill="#111111" text-anchor="start" font-weight="700">прирост меньше min_impurity_decrease</text><text x="58" y="410" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">лучший вопрос почти ничего не даёт</text></g>
<g data-key="root"><rect x="650" y="64" width="220" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="760" y="89" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13 ?</text><circle cx="701.5" cy="109" r="5" fill="#73B222"/><circle cx="714.5" cy="109" r="5" fill="#73B222"/><circle cx="727.5" cy="109" r="5" fill="#73B222"/><circle cx="740.5" cy="109" r="5" fill="#73B222"/><circle cx="753.5" cy="109" r="5" fill="#73B222"/><circle cx="766.5" cy="109" r="5" fill="#C30B0A"/><circle cx="779.5" cy="109" r="5" fill="#C30B0A"/><circle cx="792.5" cy="109" r="5" fill="#C30B0A"/><circle cx="805.5" cy="109" r="5" fill="#C30B0A"/><circle cx="818.5" cy="109" r="5" fill="#C30B0A"/><text x="642" y="100" font-size="13" fill="#5E5850" text-anchor="end" font-weight="700">H = 1</text></g>
<g data-key="e1" data-only="1"><line x1="760" y1="126" x2="680" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="704" y="169" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="760" y1="126" x2="883" y2="204" stroke="#A8A296" stroke-width="1.6"/><text x="837.5" y="169" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text></g>
<g data-key="R1" data-only="1"><rect x="827" y="204" width="112" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="883" y="229" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист · сдал</text><circle cx="863.5" cy="249" r="5" fill="#73B222"/><circle cx="876.5" cy="249" r="5" fill="#73B222"/><circle cx="889.5" cy="249" r="5" fill="#73B222"/><circle cx="902.5" cy="249" r="5" fill="#73B222"/><text x="883" y="285" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">H = 0</text></g>
<g data-key="L0" data-only="1"><rect x="585" y="204" width="190" height="62" rx="10" fill="#FFFFFF" stroke="#A8A296" stroke-width="1.6"/><text x="680" y="229" font-size="15" fill="#5E5850" text-anchor="middle" font-weight="700">6 студентов</text><circle cx="647.5" cy="249" r="5" fill="#73B222"/><circle cx="660.5" cy="249" r="5" fill="#C30B0A"/><circle cx="673.5" cy="249" r="5" fill="#C30B0A"/><circle cx="686.5" cy="249" r="5" fill="#C30B0A"/><circle cx="699.5" cy="249" r="5" fill="#C30B0A"/><circle cx="712.5" cy="249" r="5" fill="#C30B0A"/><text x="577" y="240" font-size="13" fill="#5E5850" text-anchor="end" font-weight="700">H = 0,650</text></g>
<g data-key="L1" data-only="1"><rect x="585" y="204" width="190" height="62" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="680" y="229" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2 ?</text><circle cx="647.5" cy="249" r="5" fill="#73B222"/><circle cx="660.5" cy="249" r="5" fill="#C30B0A"/><circle cx="673.5" cy="249" r="5" fill="#C30B0A"/><circle cx="686.5" cy="249" r="5" fill="#C30B0A"/><circle cx="699.5" cy="249" r="5" fill="#C30B0A"/><circle cx="712.5" cy="249" r="5" fill="#C30B0A"/><text x="577" y="240" font-size="13" fill="#5E5850" text-anchor="end" font-weight="700">H = 0,650</text></g>
<g data-key="e2" data-only="1"><line x1="680" y1="266" x2="612" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="630" y="307.5" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="680" y1="266" x2="754" y2="341" stroke="#A8A296" stroke-width="1.6"/><text x="733" y="307.5" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text></g>
<g data-key="lv" data-only="1"><rect x="552" y="341" width="120" height="62" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="612" y="366" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">лист · сдал</text><circle cx="612" cy="386" r="5" fill="#73B222"/><rect x="684" y="341" width="140" height="62" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="754" y="366" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">лист · не сдал</text><circle cx="728" cy="386" r="5" fill="#C30B0A"/><circle cx="741" cy="386" r="5" fill="#C30B0A"/><circle cx="754" cy="386" r="5" fill="#C30B0A"/><circle cx="767" cy="386" r="5" fill="#C30B0A"/><circle cx="780" cy="386" r="5" fill="#C30B0A"/><text x="612" y="422" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">H = 0</text><text x="754" y="422" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="700">H = 0</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">жёлтая полоса: лучший порог в узле · серые: остальные кандидаты</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bars0 root" data-focus="bars0 root">
      <div class="step-kicker">Шаг 1 · корень</div>
      <h4>В корне перебираем все 16 порогов</h4>
      <p>Слева прирост для каждого порога-кандидата: 9 порогов по часам и 7 по пропускам. Это те же числа, что в интерактиве выше. Лучший «часы ≤ 13» с приростом 0,610, следующие «часы ≤ 7» и «часы ≤ 15» дают по 0,396.</p>
<p>Корень получает вопрос-победитель, студенты расходятся по двум веткам, и дальше с каждой веткой поступаем так же, как с корнем.</p>
    </div>
    <div class="step-panel" data-on="root e1 L0 R1" data-focus="R1">
      <div class="step-kicker">Шаг 2 · правая ветка</div>
      <h4>Чистый узел сразу становится листом</h4>
      <p>В правую ветку попали четверо, все сдали. Энтропия равна нулю, и никакой вопрос её уже не уменьшит: прирост любого порога здесь равен нулю.</p>
<p>Узел становится листом с ответом «сдал». Это первое условие остановки: узел чистый.</p>
    </div>
    <div class="step-panel" data-on="bars1 root e1 L1 R1" data-focus="bars1 L1">
      <div class="step-kicker">Шаг 3 · левая ветка</div>
      <h4>Левый узел: та же процедура на шести студентах</h4>
      <p>В левой ветке шестеро, энтропия 0,650. Перебираем пороги заново, но только по этим студентам: по часам 5 кандидатов, по пропускам тоже 5.</p>
<p>Победил «пропуски ≤ 2» с приростом 0,650, то есть равным всей энтропии узла: обе получившиеся группы чистые. Пороги по часам здесь дают не больше 0,191: студент 4 со своими 8 часами стоит среди несдавших, и вертикальная линия его не отделит.</p>
    </div>
    <div class="step-panel" data-on="root e1 L1 R1 e2 lv" data-focus="lv">
      <div class="step-kicker">Шаг 4 · листья</div>
      <h4>Все листья чистые, рост окончен</h4>
      <p>Обе новые группы чистые, их энтропия равна нулю, и они становятся листьями. Рекурсия закончилась: ни в одном узле больше нечего делить.</p>
<p>Весь алгоритм умещается в три строки: найти лучший порог перебором, разделить студентов, повторить для каждой половины. Он жадный: в каждом узле выбирается лучший вопрос для этого узла, а не для дерева в целом. Перебрать все возможные деревья целиком было бы слишком долго.</p>
    </div>
    <div class="step-panel" data-on="root e1 L1 R1 e2 lv rules" data-focus="rules">
      <div class="step-kicker">Шаг 5 · когда останавливаться</div>
      <h4>Чистота узла не единственное условие</h4>
      <p>Если ждать, пока все листья станут чистыми, дерево будет расти, пока в листьях не останется по одному студенту. Поэтому в библиотеках есть ещё условия остановки, их задают заранее как гиперпараметры.</p>
<p>Названия слева взяты из <code>sklearn</code>. По умолчанию там <code>max_depth=None</code> и <code>min_samples_split=2</code>, то есть дерево растёт до чистых листьев. Зачем это ограничивать, покажет часть 7.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Записанный словами, алгоритм выглядит так. Схему с вопросами на две ветки называют CART,
  её реализует <code>sklearn</code>. Более ранний ID3 рассчитан на категориальные признаки
  и делит узел сразу на столько веток, сколько значений у признака.
</p>

<ol>
  <li>Если узел чистый или сработало другое условие остановки, сделать его листом с ответом по большинству.</li>
  <li>Иначе для каждого признака и каждого порога-кандидата посчитать прирост информации.</li>
  <li>Взять порог с наибольшим приростом, разделить объекты на две группы.</li>
  <li>Повторить всё с шага 1 для каждой группы.</li>
</ol>

<p>
  Сколько это стоит? В узле с <span class="math-inline" data-tex="n"></span> объектами и <span class="math-inline" data-tex="d"></span> признаками порогов не больше
  <span class="math-inline" data-tex="d(n-1)"></span>. Если объекты заранее отсортировать по каждому признаку, все пороги одного
  признака проверяются за один проход: при сдвиге порога на одну позицию один объект
  переходит из правой группы в левую, и счётчики классов меняются на единицу.
</p>

## Часть 6. Индекс Gini вместо энтропии

<p>
  Энтропия не единственная мера неоднородности. В <code>sklearn</code> по умолчанию стоит
  индекс Gini, и формула у него проще.
</p>

<div class="stage" id="stageGini" tabindex="0">
  <div class="stage-figure">
<svg id="dtGini" viewBox="0 0 960 500" role="img" aria-label="Энтропия и индекс Gini как функции доли сдавших в узле"><style>#dtGini { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="40" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">мера неоднородности узла как функция доли сдавших</text>
<g data-key="ax"><rect x="80" y="90" width="420" height="320" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="80" y1="410" x2="80" y2="415" stroke="#5E5850" stroke-width="1"/><text x="80" y="431" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="185" y1="410" x2="185" y2="415" stroke="#5E5850" stroke-width="1"/><text x="185" y="431" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0,25</text><line x1="290" y1="410" x2="290" y2="415" stroke="#5E5850" stroke-width="1"/><text x="290" y="431" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0,5</text><line x1="395" y1="410" x2="395" y2="415" stroke="#5E5850" stroke-width="1"/><text x="395" y="431" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0,75</text><line x1="500" y1="410" x2="500" y2="415" stroke="#5E5850" stroke-width="1"/><text x="500" y="431" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">1</text><line x1="75" y1="410" x2="80" y2="410" stroke="#5E5850" stroke-width="1"/><text x="71" y="415" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="75" y1="330" x2="80" y2="330" stroke="#5E5850" stroke-width="1"/><text x="71" y="335" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0,25</text><line x1="75" y1="250" x2="80" y2="250" stroke="#5E5850" stroke-width="1"/><text x="71" y="255" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0,5</text><line x1="75" y1="170" x2="80" y2="170" stroke="#5E5850" stroke-width="1"/><text x="71" y="175" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0,75</text><line x1="75" y1="90" x2="80" y2="90" stroke="#5E5850" stroke-width="1"/><text x="71" y="95" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">1</text><text x="290" y="454" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">доля сдавших в узле p</text></g>
<g data-key="cH"><path d="M 80 410 L 82.1 395.47 L 84.2 384.15 L 86.3 374.04 L 88.4 364.74 L 90.5 356.03 L 92.6 347.79 L 94.7 339.96 L 96.8 332.47 L 98.9 325.28 L 101 318.35 L 103.1 311.67 L 105.2 305.22 L 107.3 298.97 L 109.4 292.9 L 111.5 287.02 L 113.6 281.3 L 115.7 275.74 L 117.8 270.33 L 119.9 265.06 L 122 259.92 L 124.1 254.91 L 126.2 250.03 L 128.3 245.26 L 130.4 240.6 L 132.5 236.06 L 134.6 231.62 L 136.7 227.28 L 138.8 223.04 L 140.9 218.9 L 143 214.85 L 145.1 210.89 L 147.2 207.02 L 149.3 203.24 L 151.4 199.53 L 153.5 195.91 L 155.6 192.38 L 157.7 188.91 L 159.8 185.53 L 161.9 182.22 L 164 178.98 L 166.1 175.82 L 168.2 172.73 L 170.3 169.7 L 172.4 166.75 L 174.5 163.86 L 176.6 161.04 L 178.7 158.28 L 180.8 155.59 L 182.9 152.96 L 185 150.39 L 187.1 147.89 L 189.2 145.44 L 191.3 143.06 L 193.4 140.73 L 195.5 138.46 L 197.6 136.26 L 199.7 134.1 L 201.8 132.01 L 203.9 129.97 L 206 127.99 L 208.1 126.06 L 210.2 124.18 L 212.3 122.36 L 214.4 120.6 L 216.5 118.88 L 218.6 117.22 L 220.7 115.61 L 222.8 114.06 L 224.9 112.55 L 227 111.1 L 229.1 109.69 L 231.2 108.34 L 233.3 107.04 L 235.4 105.78 L 237.5 104.58 L 239.6 103.43 L 241.7 102.32 L 243.8 101.26 L 245.9 100.26 L 248 99.3 L 250.1 98.38 L 252.2 97.52 L 254.3 96.7 L 256.4 95.93 L 258.5 95.21 L 260.6 94.54 L 262.7 93.91 L 264.8 93.33 L 266.9 92.8 L 269 92.31 L 271.1 91.87 L 273.2 91.48 L 275.3 91.13 L 277.4 90.83 L 279.5 90.58 L 281.6 90.37 L 283.7 90.21 L 285.8 90.09 L 287.9 90.02 L 290 90 L 292.1 90.02 L 294.2 90.09 L 296.3 90.21 L 298.4 90.37 L 300.5 90.58 L 302.6 90.83 L 304.7 91.13 L 306.8 91.48 L 308.9 91.87 L 311 92.31 L 313.1 92.8 L 315.2 93.33 L 317.3 93.91 L 319.4 94.54 L 321.5 95.21 L 323.6 95.93 L 325.7 96.7 L 327.8 97.52 L 329.9 98.38 L 332 99.3 L 334.1 100.26 L 336.2 101.26 L 338.3 102.32 L 340.4 103.43 L 342.5 104.58 L 344.6 105.78 L 346.7 107.04 L 348.8 108.34 L 350.9 109.69 L 353 111.1 L 355.1 112.55 L 357.2 114.06 L 359.3 115.61 L 361.4 117.22 L 363.5 118.88 L 365.6 120.6 L 367.7 122.36 L 369.8 124.18 L 371.9 126.06 L 374 127.99 L 376.1 129.97 L 378.2 132.01 L 380.3 134.1 L 382.4 136.26 L 384.5 138.46 L 386.6 140.73 L 388.7 143.06 L 390.8 145.44 L 392.9 147.89 L 395 150.39 L 397.1 152.96 L 399.2 155.59 L 401.3 158.28 L 403.4 161.04 L 405.5 163.86 L 407.6 166.75 L 409.7 169.7 L 411.8 172.73 L 413.9 175.82 L 416 178.98 L 418.1 182.22 L 420.2 185.53 L 422.3 188.91 L 424.4 192.38 L 426.5 195.91 L 428.6 199.53 L 430.7 203.24 L 432.8 207.02 L 434.9 210.89 L 437 214.85 L 439.1 218.9 L 441.2 223.04 L 443.3 227.28 L 445.4 231.62 L 447.5 236.06 L 449.6 240.6 L 451.7 245.26 L 453.8 250.03 L 455.9 254.91 L 458 259.92 L 460.1 265.06 L 462.2 270.33 L 464.3 275.74 L 466.4 281.3 L 468.5 287.02 L 470.6 292.9 L 472.7 298.97 L 474.8 305.22 L 476.9 311.67 L 479 318.35 L 481.1 325.28 L 483.2 332.47 L 485.3 339.96 L 487.4 347.79 L 489.5 356.03 L 491.6 364.74 L 493.7 374.04 L 495.8 384.15 L 497.9 395.47 L 500 410" fill="none" stroke="#3576C0" stroke-width="3"/><circle cx="150" cy="201.99" r="6" fill="#3576C0" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="290" cy="90" r="6" fill="#3576C0" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="500" cy="410" r="6" fill="#3576C0" stroke="#FFFFFF" stroke-width="1.5"/><foreignObject x="250" y="58" width="80" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#2A5E9B;font-weight:700" data-tex="H(p)"></div></foreignObject><text x="140" y="191.99" font-size="13" fill="#2A5E9B" text-anchor="end" font-weight="700">0,650</text></g>
<g data-key="cG" data-only="1"><path d="M 80 410 L 82.1 406.82 L 84.2 403.66 L 86.3 400.54 L 88.4 397.46 L 90.5 394.4 L 92.6 391.38 L 94.7 388.38 L 96.8 385.42 L 98.9 382.5 L 101 379.6 L 103.1 376.74 L 105.2 373.9 L 107.3 371.1 L 109.4 368.34 L 111.5 365.6 L 113.6 362.9 L 115.7 360.22 L 117.8 357.58 L 119.9 354.98 L 122 352.4 L 124.1 349.86 L 126.2 347.34 L 128.3 344.86 L 130.4 342.42 L 132.5 340 L 134.6 337.62 L 136.7 335.26 L 138.8 332.94 L 140.9 330.66 L 143 328.4 L 145.1 326.18 L 147.2 323.98 L 149.3 321.82 L 151.4 319.7 L 153.5 317.6 L 155.6 315.54 L 157.7 313.5 L 159.8 311.5 L 161.9 309.54 L 164 307.6 L 166.1 305.7 L 168.2 303.82 L 170.3 301.98 L 172.4 300.18 L 174.5 298.4 L 176.6 296.66 L 178.7 294.94 L 180.8 293.26 L 182.9 291.62 L 185 290 L 187.1 288.42 L 189.2 286.86 L 191.3 285.34 L 193.4 283.86 L 195.5 282.4 L 197.6 280.98 L 199.7 279.58 L 201.8 278.22 L 203.9 276.9 L 206 275.6 L 208.1 274.34 L 210.2 273.1 L 212.3 271.9 L 214.4 270.74 L 216.5 269.6 L 218.6 268.5 L 220.7 267.42 L 222.8 266.38 L 224.9 265.38 L 227 264.4 L 229.1 263.46 L 231.2 262.54 L 233.3 261.66 L 235.4 260.82 L 237.5 260 L 239.6 259.22 L 241.7 258.46 L 243.8 257.74 L 245.9 257.06 L 248 256.4 L 250.1 255.78 L 252.2 255.18 L 254.3 254.62 L 256.4 254.1 L 258.5 253.6 L 260.6 253.14 L 262.7 252.7 L 264.8 252.3 L 266.9 251.94 L 269 251.6 L 271.1 251.3 L 273.2 251.02 L 275.3 250.78 L 277.4 250.58 L 279.5 250.4 L 281.6 250.26 L 283.7 250.14 L 285.8 250.06 L 287.9 250.02 L 290 250 L 292.1 250.02 L 294.2 250.06 L 296.3 250.14 L 298.4 250.26 L 300.5 250.4 L 302.6 250.58 L 304.7 250.78 L 306.8 251.02 L 308.9 251.3 L 311 251.6 L 313.1 251.94 L 315.2 252.3 L 317.3 252.7 L 319.4 253.14 L 321.5 253.6 L 323.6 254.1 L 325.7 254.62 L 327.8 255.18 L 329.9 255.78 L 332 256.4 L 334.1 257.06 L 336.2 257.74 L 338.3 258.46 L 340.4 259.22 L 342.5 260 L 344.6 260.82 L 346.7 261.66 L 348.8 262.54 L 350.9 263.46 L 353 264.4 L 355.1 265.38 L 357.2 266.38 L 359.3 267.42 L 361.4 268.5 L 363.5 269.6 L 365.6 270.74 L 367.7 271.9 L 369.8 273.1 L 371.9 274.34 L 374 275.6 L 376.1 276.9 L 378.2 278.22 L 380.3 279.58 L 382.4 280.98 L 384.5 282.4 L 386.6 283.86 L 388.7 285.34 L 390.8 286.86 L 392.9 288.42 L 395 290 L 397.1 291.62 L 399.2 293.26 L 401.3 294.94 L 403.4 296.66 L 405.5 298.4 L 407.6 300.18 L 409.7 301.98 L 411.8 303.82 L 413.9 305.7 L 416 307.6 L 418.1 309.54 L 420.2 311.5 L 422.3 313.5 L 424.4 315.54 L 426.5 317.6 L 428.6 319.7 L 430.7 321.82 L 432.8 323.98 L 434.9 326.18 L 437 328.4 L 439.1 330.66 L 441.2 332.94 L 443.3 335.26 L 445.4 337.62 L 447.5 340 L 449.6 342.42 L 451.7 344.86 L 453.8 347.34 L 455.9 349.86 L 458 352.4 L 460.1 354.98 L 462.2 357.58 L 464.3 360.22 L 466.4 362.9 L 468.5 365.6 L 470.6 368.34 L 472.7 371.1 L 474.8 373.9 L 476.9 376.74 L 479 379.6 L 481.1 382.5 L 483.2 385.42 L 485.3 388.38 L 487.4 391.38 L 489.5 394.4 L 491.6 397.46 L 493.7 400.54 L 495.8 403.66 L 497.9 406.82 L 500 410" fill="none" stroke="#8F7406" stroke-width="3"/><circle cx="150" cy="321.11" r="6" fill="#8F7406" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="290" cy="250" r="6" fill="#8F7406" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="500" cy="410" r="6" fill="#8F7406" stroke="#FFFFFF" stroke-width="1.5"/><foreignObject x="250" y="258" width="80" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8F7406;font-weight:700" data-tex="G(p)"></div></foreignObject><text x="162" y="339.11" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">0,278</text></g>
<g data-key="c2G" data-only="1"><path d="M 80 410 L 82.1 403.63 L 84.2 397.33 L 86.3 391.09 L 88.4 384.91 L 90.5 378.8 L 92.6 372.75 L 94.7 366.77 L 96.8 360.85 L 98.9 354.99 L 101 349.2 L 103.1 343.47 L 105.2 337.81 L 107.3 332.21 L 109.4 326.67 L 111.5 321.2 L 113.6 315.79 L 115.7 310.45 L 117.8 305.17 L 119.9 299.95 L 122 294.8 L 124.1 289.71 L 126.2 284.69 L 128.3 279.73 L 130.4 274.83 L 132.5 270 L 134.6 265.23 L 136.7 260.53 L 138.8 255.89 L 140.9 251.31 L 143 246.8 L 145.1 242.35 L 147.2 237.97 L 149.3 233.65 L 151.4 229.39 L 153.5 225.2 L 155.6 221.07 L 157.7 217.01 L 159.8 213.01 L 161.9 209.07 L 164 205.2 L 166.1 201.39 L 168.2 197.65 L 170.3 193.97 L 172.4 190.35 L 174.5 186.8 L 176.6 183.31 L 178.7 179.89 L 180.8 176.53 L 182.9 173.23 L 185 170 L 187.1 166.83 L 189.2 163.73 L 191.3 160.69 L 193.4 157.71 L 195.5 154.8 L 197.6 151.95 L 199.7 149.17 L 201.8 146.45 L 203.9 143.79 L 206 141.2 L 208.1 138.67 L 210.2 136.21 L 212.3 133.81 L 214.4 131.47 L 216.5 129.2 L 218.6 126.99 L 220.7 124.85 L 222.8 122.77 L 224.9 120.75 L 227 118.8 L 229.1 116.91 L 231.2 115.09 L 233.3 113.33 L 235.4 111.63 L 237.5 110 L 239.6 108.43 L 241.7 106.93 L 243.8 105.49 L 245.9 104.11 L 248 102.8 L 250.1 101.55 L 252.2 100.37 L 254.3 99.25 L 256.4 98.19 L 258.5 97.2 L 260.6 96.27 L 262.7 95.41 L 264.8 94.61 L 266.9 93.87 L 269 93.2 L 271.1 92.59 L 273.2 92.05 L 275.3 91.57 L 277.4 91.15 L 279.5 90.8 L 281.6 90.51 L 283.7 90.29 L 285.8 90.13 L 287.9 90.03 L 290 90 L 292.1 90.03 L 294.2 90.13 L 296.3 90.29 L 298.4 90.51 L 300.5 90.8 L 302.6 91.15 L 304.7 91.57 L 306.8 92.05 L 308.9 92.59 L 311 93.2 L 313.1 93.87 L 315.2 94.61 L 317.3 95.41 L 319.4 96.27 L 321.5 97.2 L 323.6 98.19 L 325.7 99.25 L 327.8 100.37 L 329.9 101.55 L 332 102.8 L 334.1 104.11 L 336.2 105.49 L 338.3 106.93 L 340.4 108.43 L 342.5 110 L 344.6 111.63 L 346.7 113.33 L 348.8 115.09 L 350.9 116.91 L 353 118.8 L 355.1 120.75 L 357.2 122.77 L 359.3 124.85 L 361.4 126.99 L 363.5 129.2 L 365.6 131.47 L 367.7 133.81 L 369.8 136.21 L 371.9 138.67 L 374 141.2 L 376.1 143.79 L 378.2 146.45 L 380.3 149.17 L 382.4 151.95 L 384.5 154.8 L 386.6 157.71 L 388.7 160.69 L 390.8 163.73 L 392.9 166.83 L 395 170 L 397.1 173.23 L 399.2 176.53 L 401.3 179.89 L 403.4 183.31 L 405.5 186.8 L 407.6 190.35 L 409.7 193.97 L 411.8 197.65 L 413.9 201.39 L 416 205.2 L 418.1 209.07 L 420.2 213.01 L 422.3 217.01 L 424.4 221.07 L 426.5 225.2 L 428.6 229.39 L 430.7 233.65 L 432.8 237.97 L 434.9 242.35 L 437 246.8 L 439.1 251.31 L 441.2 255.89 L 443.3 260.53 L 445.4 265.23 L 447.5 270 L 449.6 274.83 L 451.7 279.73 L 453.8 284.69 L 455.9 289.71 L 458 294.8 L 460.1 299.95 L 462.2 305.17 L 464.3 310.45 L 466.4 315.79 L 468.5 321.2 L 470.6 326.67 L 472.7 332.21 L 474.8 337.81 L 476.9 343.47 L 479 349.2 L 481.1 354.99 L 483.2 360.85 L 485.3 366.77 L 487.4 372.75 L 489.5 378.8 L 491.6 384.91 L 493.7 391.09 L 495.8 397.33 L 497.9 403.63 L 500 410" fill="none" stroke="#8F7406" stroke-width="2.2" stroke-dasharray="7 5"/><text x="441.2" y="243.89" font-size="13" fill="#8F7406" text-anchor="start" font-weight="700">2·G(p)</text></g>
<g data-key="tab" data-only="1"><text x="560" y="98" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">порог в корне</text><text x="800" y="98" font-size="13" fill="#2A5E9B" text-anchor="end" font-weight="700">IG</text><text x="910" y="98" font-size="13" fill="#8F7406" text-anchor="end" font-weight="700">по Gini</text><line x1="560" y1="108" x2="920" y2="108" stroke="#D8D4C8" stroke-width="1"/><text x="560" y="134" font-size="14" fill="#111111" text-anchor="start" font-weight="700">часы ≤ 13</text><text x="800" y="134" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="700">0,610</text><text x="910" y="134" font-size="14" fill="#8F7406" text-anchor="end" font-weight="700">0,333</text><text x="560" y="164" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 7</text><text x="800" y="164" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="400">0,396</text><text x="910" y="164" font-size="14" fill="#8F7406" text-anchor="end" font-weight="400">0,214</text><text x="560" y="194" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 15</text><text x="800" y="194" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="400">0,396</text><text x="910" y="194" font-size="14" fill="#8F7406" text-anchor="end" font-weight="400">0,214</text><text x="560" y="224" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 11</text><text x="800" y="224" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="400">0,278</text><text x="910" y="224" font-size="14" fill="#8F7406" text-anchor="end" font-weight="400">0,180</text><text x="560" y="254" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 5</text><text x="800" y="254" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="400">0,236</text><text x="910" y="254" font-size="14" fill="#8F7406" text-anchor="end" font-weight="400">0,125</text><text x="560" y="284" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 17</text><text x="800" y="284" font-size="14" fill="#2A5E9B" text-anchor="end" font-weight="400">0,236</text><text x="910" y="284" font-size="14" fill="#8F7406" text-anchor="end" font-weight="400">0,125</text><text x="560" y="318" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">и ещё 10 порогов, порядок тот же</text><rect x="555" y="345" width="370" height="60" rx="12" fill="#F4FAEC" stroke="#73B222" stroke-width="1.5"/><text x="740" y="370" font-size="14" fill="#111111" text-anchor="middle" font-weight="400">обе меры выбирают</text><text x="740" y="392" font-size="14" fill="#5F9420" text-anchor="middle" font-weight="700">одно и то же дерево</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">синяя кривая: энтропия · жёлтая: Gini · точки: доли сдавших 1/6, 1/2 и 1 в наших узлах</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax cH" data-focus="cH">
      <div class="step-kicker">Шаг 1 · энтропия</div>
      <h4>Энтропия как функция доли</h4>
      <p>Для двух классов энтропия зависит от одного числа, доли сдавших <span class="math-inline" data-tex="p"></span>. На краях, при <span class="math-inline" data-tex="p = 0"></span> и <span class="math-inline" data-tex="p = 1"></span>, она равна нулю, в середине достигает единицы.</p>
<p>Точки отмечают наши узлы: лист с долей 1, корень с долей 1/2 и левый узел с долей 1/6, где энтропия 0,650.</p>
    </div>
    <div class="step-panel" data-on="ax cH cG" data-focus="cG">
      <div class="step-kicker">Шаг 2 · индекс Gini</div>
      <h4>Gini считается без логарифма</h4>
      <p>Индекс Gini равен вероятности ошибиться, если взять из узла случайного студента и приписать ему метку другого случайного студента из того же узла:</p>
<div class="math-display" data-tex="G = 1 - \sum_k p_k^2 = 1 - p^2 - (1-p)^2"></div>
<p>Для левого узла <span class="math-inline" data-tex="G = 1 - (1/6)^2 - (5/6)^2 = 10/36 \approx 0{,}278"></span>. Кривая той же формы, что у энтропии, только максимум у неё 0,5, а не 1.</p>
    </div>
    <div class="step-panel" data-on="ax cH cG c2G" data-focus="c2G">
      <div class="step-kicker">Шаг 3 · сравниваем форму</div>
      <h4>Удвоенный Gini почти совпадает с энтропией</h4>
      <p>Пунктир показывает <span class="math-inline" data-tex="2G"></span>. На краях и в середине он совпадает с энтропией в точности, в промежутках отличается не больше чем на 0,11 (у энтропии бока круче).</p>
<p>Поэтому две меры почти всегда ранжируют пороги одинаково. Расходятся они в основном тогда, когда два порога и так дают почти равный прирост.</p>
    </div>
    <div class="step-panel" data-on="ax cH cG tab" data-focus="tab">
      <div class="step-kicker">Шаг 4 · выбор порога</div>
      <h4>На наших данных победитель один и тот же</h4>
      <p>Справа шесть лучших порогов в корне по приросту энтропии и тот же прирост, посчитанный через Gini. Числа другие, порядок тот же: «часы ≤ 13» лучший по обеим мерам, с приростом 0,610 и 1/3.</p>
<p>В левом узле тоже совпадение, «пропуски ≤ 2», так что дерево получается одно и то же. В <code>sklearn</code> по умолчанию стоит <code>criterion="gini"</code>: так не нужно считать логарифм.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Прирост по Gini считается по той же схеме, что и прирост информации, только вместо
  <span class="math-inline" data-tex="H"></span> подставляется <span class="math-inline" data-tex="G"></span>:
</p>

<div class="math-display" data-tex="\Delta G = G(\text{родитель}) - \frac{n_L}{n}G_L - \frac{n_R}{n}G_R = 0{,}5 - \frac{6}{10}\cdot\frac{10}{36} - \frac{4}{10}\cdot 0 = \frac{1}{3}"></div>

<p>
  На практике выбор меры редко меняет качество заметно. Gini немного быстрее, потому что
  вместо логарифма в нём квадраты. Энтропия сильнее штрафует узлы с маленькой долей одного
  из классов (бока кривой круче), поэтому её иногда предпочитают на несбалансированных данных.
</p>

## Часть 7. Переобучение: дерево запоминает шум

<p>
  Дерево без ограничений растёт, пока все листья не станут чистыми. На наших десяти
  студентах это случилось за два вопроса. Посмотрим, что происходит, если в данных есть
  студент, исход которого признаками не объясняется.
</p>

<div class="stage" id="stageOverfit" tabindex="0">
  <div class="stage-figure">
<svg id="dtOverfit" viewBox="0 0 960 500" role="img" aria-label="Переобучение: полное дерево вырезает угол под одного студента, дерево глубины 2 его игнорирует"><style>#dtOverfit { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="70" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">студенты на плоскости</text>
<text x="515" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">дерево</text>
<g data-key="ax"><rect x="70" y="60" width="418" height="360" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="420" x2="70" y2="425" stroke="#5E5850" stroke-width="1"/><text x="70" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="146" y1="420" x2="146" y2="425" stroke="#5E5850" stroke-width="1"/><text x="146" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="222" y1="420" x2="222" y2="425" stroke="#5E5850" stroke-width="1"/><text x="222" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="298" y1="420" x2="298" y2="425" stroke="#5E5850" stroke-width="1"/><text x="298" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="374" y1="420" x2="374" y2="425" stroke="#5E5850" stroke-width="1"/><text x="374" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="450" y1="420" x2="450" y2="425" stroke="#5E5850" stroke-width="1"/><text x="450" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="65" y1="420" x2="70" y2="420" stroke="#5E5850" stroke-width="1"/><text x="61" y="425" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="65" y1="348" x2="70" y2="348" stroke="#5E5850" stroke-width="1"/><text x="61" y="353" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="65" y1="276" x2="70" y2="276" stroke="#5E5850" stroke-width="1"/><text x="61" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="65" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="61" y="209" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="65" y1="132" x2="70" y2="132" stroke="#5E5850" stroke-width="1"/><text x="61" y="137" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="65" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="61" y="65" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="279" y="464" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="36" y="240" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 240)">пропуски</text></g>
<g data-key="reg0" data-only="1"><rect x="70" y="348" width="247" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><rect x="70" y="60" width="247" height="288" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><line x1="70" y1="348" x2="317" y2="348" stroke="#C29E08" stroke-width="2.2"/><rect x="317" y="60" width="171" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="317" y1="60" x2="317" y2="420" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="regF" data-only="1"><rect x="70" y="348" width="247" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><rect x="70" y="150" width="247" height="198" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><rect x="70" y="60" width="142.5" height="90" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><rect x="212.5" y="60" width="104.5" height="90" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><line x1="212.5" y1="60" x2="212.5" y2="150" stroke="#C29E08" stroke-width="2.2"/><line x1="70" y1="150" x2="317" y2="150" stroke="#C29E08" stroke-width="2.2"/><line x1="70" y1="348" x2="317" y2="348" stroke="#C29E08" stroke-width="2.2"/><rect x="317" y="60" width="171" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="317" y1="60" x2="317" y2="420" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="regM" data-only="1"><rect x="70" y="348" width="247" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><rect x="70" y="60" width="247" height="288" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><line x1="70" y1="348" x2="317" y2="348" stroke="#C29E08" stroke-width="2.2"/><rect x="317" y="60" width="171" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="317" y1="60" x2="317" y2="420" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="box" data-only="1"><rect x="70" y="60" width="142.5" height="90" rx="0" fill="none" stroke="#3576C0" stroke-width="2.6"/><text x="218.5" y="78" font-size="12" fill="#2A5E9B" text-anchor="start" font-weight="700">лист из одного</text><text x="218.5" y="94" font-size="12" fill="#2A5E9B" text-anchor="start" font-weight="700">студента</text></g>
<g data-key="pts"><circle cx="108" cy="312" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="108" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="146" cy="168" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="146" y="172.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="184" cy="276" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="184" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="222" cy="384" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="222" y="388.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text><circle cx="260" cy="132" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="260" y="136.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="298" cy="240" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="298" y="244.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="336" cy="348" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="336" y="352.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="374" cy="204" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="374" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text><circle cx="412" cy="312" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="412" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="450" cy="276" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="450" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="s11" data-only="1"><circle cx="165" cy="132" r="12.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="165" y="136.5" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="700">11</text><text x="183" y="162" font-size="12" fill="#5F9420" text-anchor="start" font-weight="700">студент 11</text></g>
<g data-key="r11" data-only="1"><circle cx="165" cy="132" r="19" fill="none" stroke="#3576C0" stroke-width="2.2" stroke-dasharray="4 3"/></g>
<g data-key="test" data-only="1"><rect x="117" y="86" width="20" height="20" rx="3" fill="#C30B0A" stroke="#3576C0" stroke-width="2.4"/><rect x="193" y="86" width="20" height="20" rx="3" fill="#C30B0A" stroke="#3576C0" stroke-width="2.4"/><rect x="250" y="374" width="20" height="20" rx="3" fill="#73B222" stroke="#3576C0" stroke-width="2.4"/><rect x="383" y="266" width="20" height="20" rx="3" fill="#73B222" stroke="#3576C0" stroke-width="2.4"/><rect x="269" y="266" width="20" height="20" rx="3" fill="#C30B0A" stroke="#3576C0" stroke-width="2.4"/><rect x="402" y="158" width="20" height="20" rx="3" fill="#73B222" stroke="#3576C0" stroke-width="2.4"/></g>
<g data-key="errF" data-only="1"><circle cx="127" cy="96" r="17" fill="none" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="4 3"/><circle cx="203" cy="96" r="17" fill="none" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="4 3"/></g>
<g data-key="errM" data-only="1"><circle cx="165" cy="132" r="19" fill="none" stroke="#C30B0A" stroke-width="2.2" stroke-dasharray="4 3"/></g>
<g data-key="tO" data-only="1"><line x1="771.67" y1="107" x2="661.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="700.67" y="149" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="588.33" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="609" y="279" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="735" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="714.33" y="279" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="771.67" y1="107" x2="881.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="842.67" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="543.33" y="313" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="588.33" y="334" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="588.33" cy="354" r="5" fill="#73B222"/><rect x="690" y="313" width="90" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="735" y="334" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="709" cy="354" r="5" fill="#C30B0A"/><circle cx="722" cy="354" r="5" fill="#C30B0A"/><circle cx="735" cy="354" r="5" fill="#C30B0A"/><circle cx="748" cy="354" r="5" fill="#C30B0A"/><circle cx="761" cy="354" r="5" fill="#C30B0A"/><rect x="586.67" y="183" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="661.67" y="204" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2</text><circle cx="629.17" cy="224" r="5" fill="#73B222"/><circle cx="642.17" cy="224" r="5" fill="#C30B0A"/><circle cx="655.17" cy="224" r="5" fill="#C30B0A"/><circle cx="668.17" cy="224" r="5" fill="#C30B0A"/><circle cx="681.17" cy="224" r="5" fill="#C30B0A"/><circle cx="694.17" cy="224" r="5" fill="#C30B0A"/><rect x="836.67" y="183" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="881.67" y="204" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="862.17" cy="224" r="5" fill="#73B222"/><circle cx="875.17" cy="224" r="5" fill="#73B222"/><circle cx="888.17" cy="224" r="5" fill="#73B222"/><circle cx="901.17" cy="224" r="5" fill="#73B222"/><rect x="696.67" y="53" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="771.67" y="74" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="713.17" cy="94" r="5" fill="#73B222"/><circle cx="726.17" cy="94" r="5" fill="#73B222"/><circle cx="739.17" cy="94" r="5" fill="#73B222"/><circle cx="752.17" cy="94" r="5" fill="#73B222"/><circle cx="765.17" cy="94" r="5" fill="#73B222"/><circle cx="778.17" cy="94" r="5" fill="#C30B0A"/><circle cx="791.17" cy="94" r="5" fill="#C30B0A"/><circle cx="804.17" cy="94" r="5" fill="#C30B0A"/><circle cx="817.17" cy="94" r="5" fill="#C30B0A"/><circle cx="830.17" cy="94" r="5" fill="#C30B0A"/></g>
<g data-key="tF" data-only="1"><line x1="773.5" y1="97" x2="636" y2="137" stroke="#A8A296" stroke-width="1.6"/><text x="688.75" y="121" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="636" y1="187" x2="559" y2="227" stroke="#A8A296" stroke-width="1.6"/><text x="581.5" y="211" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="636" y1="187" x2="713" y2="227" stroke="#A8A296" stroke-width="1.6"/><text x="690.5" y="211" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="713" y1="277" x2="647" y2="317" stroke="#A8A296" stroke-width="1.6"/><text x="664" y="301" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="713" y1="277" x2="779" y2="317" stroke="#A8A296" stroke-width="1.6"/><text x="762" y="301" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="779" y1="367" x2="735" y2="407" stroke="#A8A296" stroke-width="1.6"/><text x="741" y="391" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="779" y1="367" x2="823" y2="407" stroke="#A8A296" stroke-width="1.6"/><text x="817" y="391" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="773.5" y1="97" x2="911" y2="137" stroke="#A8A296" stroke-width="1.6"/><text x="858.25" y="121" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="519" y="227" width="80" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="559" y="246" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="559" cy="266" r="5" fill="#73B222"/><rect x="607" y="317" width="80" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="647" y="336" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="627.5" cy="356" r="5" fill="#C30B0A"/><circle cx="640.5" cy="356" r="5" fill="#C30B0A"/><circle cx="653.5" cy="356" r="5" fill="#C30B0A"/><circle cx="666.5" cy="356" r="5" fill="#C30B0A"/><rect x="695" y="407" width="80" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="735" y="426" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="735" cy="446" r="5" fill="#73B222"/><rect x="783" y="407" width="80" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="823" y="426" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="823" cy="446" r="5" fill="#C30B0A"/><rect x="717" y="317" width="124" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="779" y="336" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 7,5</text><circle cx="772.5" cy="356" r="5" fill="#73B222"/><circle cx="785.5" cy="356" r="5" fill="#C30B0A"/><rect x="651" y="227" width="124" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="713" y="246" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 7,5</text><circle cx="680.5" cy="266" r="5" fill="#73B222"/><circle cx="693.5" cy="266" r="5" fill="#C30B0A"/><circle cx="706.5" cy="266" r="5" fill="#C30B0A"/><circle cx="719.5" cy="266" r="5" fill="#C30B0A"/><circle cx="732.5" cy="266" r="5" fill="#C30B0A"/><circle cx="745.5" cy="266" r="5" fill="#C30B0A"/><rect x="574" y="137" width="124" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="636" y="156" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2</text><circle cx="597" cy="176" r="5" fill="#73B222"/><circle cx="610" cy="176" r="5" fill="#73B222"/><circle cx="623" cy="176" r="5" fill="#C30B0A"/><circle cx="636" cy="176" r="5" fill="#C30B0A"/><circle cx="649" cy="176" r="5" fill="#C30B0A"/><circle cx="662" cy="176" r="5" fill="#C30B0A"/><circle cx="675" cy="176" r="5" fill="#C30B0A"/><rect x="871" y="137" width="80" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="911" y="156" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="891.5" cy="176" r="5" fill="#73B222"/><circle cx="904.5" cy="176" r="5" fill="#73B222"/><circle cx="917.5" cy="176" r="5" fill="#73B222"/><circle cx="930.5" cy="176" r="5" fill="#73B222"/><rect x="698.5" y="47" width="150" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="773.5" y="66" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="708.5" cy="86" r="5" fill="#73B222"/><circle cx="721.5" cy="86" r="5" fill="#73B222"/><circle cx="734.5" cy="86" r="5" fill="#73B222"/><circle cx="747.5" cy="86" r="5" fill="#73B222"/><circle cx="760.5" cy="86" r="5" fill="#73B222"/><circle cx="773.5" cy="86" r="5" fill="#73B222"/><circle cx="786.5" cy="86" r="5" fill="#C30B0A"/><circle cx="799.5" cy="86" r="5" fill="#C30B0A"/><circle cx="812.5" cy="86" r="5" fill="#C30B0A"/><circle cx="825.5" cy="86" r="5" fill="#C30B0A"/><circle cx="838.5" cy="86" r="5" fill="#C30B0A"/></g>
<g data-key="tM" data-only="1"><line x1="771.67" y1="107" x2="661.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="700.67" y="149" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="588.33" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="609" y="279" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="735" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="714.33" y="279" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="771.67" y1="107" x2="881.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="842.67" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="543.33" y="313" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="588.33" y="334" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="588.33" cy="354" r="5" fill="#73B222"/><rect x="688" y="313" width="94" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="735" y="334" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="702.5" cy="354" r="5" fill="#73B222"/><circle cx="715.5" cy="354" r="5" fill="#C30B0A"/><circle cx="728.5" cy="354" r="5" fill="#C30B0A"/><circle cx="741.5" cy="354" r="5" fill="#C30B0A"/><circle cx="754.5" cy="354" r="5" fill="#C30B0A"/><circle cx="767.5" cy="354" r="5" fill="#C30B0A"/><rect x="586.67" y="183" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="661.67" y="204" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2</text><circle cx="622.67" cy="224" r="5" fill="#73B222"/><circle cx="635.67" cy="224" r="5" fill="#73B222"/><circle cx="648.67" cy="224" r="5" fill="#C30B0A"/><circle cx="661.67" cy="224" r="5" fill="#C30B0A"/><circle cx="674.67" cy="224" r="5" fill="#C30B0A"/><circle cx="687.67" cy="224" r="5" fill="#C30B0A"/><circle cx="700.67" cy="224" r="5" fill="#C30B0A"/><rect x="836.67" y="183" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="881.67" y="204" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="862.17" cy="224" r="5" fill="#73B222"/><circle cx="875.17" cy="224" r="5" fill="#73B222"/><circle cx="888.17" cy="224" r="5" fill="#73B222"/><circle cx="901.17" cy="224" r="5" fill="#73B222"/><rect x="696.67" y="53" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="771.67" y="74" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="706.67" cy="94" r="5" fill="#73B222"/><circle cx="719.67" cy="94" r="5" fill="#73B222"/><circle cx="732.67" cy="94" r="5" fill="#73B222"/><circle cx="745.67" cy="94" r="5" fill="#73B222"/><circle cx="758.67" cy="94" r="5" fill="#73B222"/><circle cx="771.67" cy="94" r="5" fill="#73B222"/><circle cx="784.67" cy="94" r="5" fill="#C30B0A"/><circle cx="797.67" cy="94" r="5" fill="#C30B0A"/><circle cx="810.67" cy="94" r="5" fill="#C30B0A"/><circle cx="823.67" cy="94" r="5" fill="#C30B0A"/><circle cx="836.67" cy="94" r="5" fill="#C30B0A"/></g>
<g data-key="sF0" data-only="1"><text x="955" y="30" font-size="13" fill="#5F9420" text-anchor="end" font-weight="700">верно на обучении: 11 из 11</text></g>
<g data-key="sF" data-only="1"><text x="955" y="30" font-size="13" fill="#9C0908" text-anchor="end" font-weight="700">обучение: 11 из 11 · новые: 4 из 6</text></g>
<g data-key="sM" data-only="1"><text x="955" y="30" font-size="13" fill="#5F9420" text-anchor="end" font-weight="700">обучение: 10 из 11 · новые: 6 из 6</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">кружки: студенты для обучения · квадраты: новые студенты, цвет показывает их настоящий исход</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax reg0 pts s11 r11 tO" data-focus="s11 r11">
      <div class="step-kicker">Шаг 1 · новый студент в данных</div>
      <h4>Студент 11: 5 часов, 8 пропусков, сдал</h4>
      <p>Добавим в обучающие данные одиннадцатого студента. Готовился он мало, пропустил почти все занятия, но экзамен сдал. Такие случаи бывают: угадал билет, списал, преподаватель был в хорошем настроении. Признаки этого не объясняют, для модели это шум.</p>
<p>Старое дерево ответило бы про него «не сдаст»: точка лежит в красной зоне. Обучим дерево заново на всех 11 студентах.</p>
    </div>
    <div class="step-panel" data-on="ax regF pts s11 tF box sF0" data-focus="tF box">
      <div class="step-kicker">Шаг 2 · полное дерево</div>
      <h4>Дерево вырезало угол под одного студента</h4>
      <p>Без ограничений дерево растёт, пока все листья не станут чистыми. Первые два вопроса прежние. Дальше левый верхний узел, где был один студент 11 среди пяти несдавших, делится ещё два раза: «пропуски ≤ 7,5», затем «часы ≤ 7,5».</p>
<p>Получились глубина 4 и пять листьев. Синяя рамка показывает лист, в котором один студент 11: по этому листу любой студент с подготовкой до 7,5 часов и больше чем 7,5 пропусками получит ответ «сдаст». На обучающих данных ошибок нет, 11 из 11.</p>
    </div>
    <div class="step-panel" data-on="ax regF pts s11 tF box test errF sF" data-focus="test errF sF">
      <div class="step-kicker">Шаг 3 · проверка на новых</div>
      <h4>На новых студентах угол даёт две ошибки</h4>
      <p>Возьмём шесть новых студентов, которых не было при обучении; квадраты закрашены по их настоящему исходу. Двое из них готовились 3 и 7 часов, пропустили по 9 занятий и не сдали. Оба попали в вырезанный угол, и дерево ответило им «сдаст».</p>
<p>Итог: 11 из 11 на обучении, 4 из 6 на новых. Дерево запомнило случайность одного студента и переносит её на всех, кто оказался рядом. Это и называется переобучением.</p>
    </div>
    <div class="step-panel" data-on="ax regM pts s11 tM test errM sM" data-focus="tM errM sM">
      <div class="step-kicker">Шаг 4 · глубина 2</div>
      <h4>Ограничение глубины убирает угол</h4>
      <p>Обучим дерево с <code>max_depth=2</code>. После двух вопросов рост останавливается, и левый верхний лист остаётся смешанным: в нём 6 студентов, сдал 1. Ответ листа по большинству «не сдал», и доля 1/6 честно показывает, что исключения там бывают.</p>
<p>Студент 11 теперь классифицирован неверно, 10 из 11 на обучении. Зато на новых 6 из 6. Небольшая ошибка на обучении здесь означает, что модель не стала подгонять свои ответы под одну случайную точку.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Ошибка на обучающих данных у полного дерева всегда нулевая, если нет двух объектов
  с одинаковыми признаками и разными метками. Поэтому по ней нельзя судить о качестве
  дерева: судить надо по данным, которых оно не видело. Новые студенты в сцене выше играют
  роль такой отложенной выборки.
</p>

<p>
  Рост дерева ограничивают гиперпараметрами. Самые употребительные в <code>sklearn</code>:
</p>

<ul>
  <li><code>max_depth</code>: наибольшее число вопросов от корня до листа;</li>
  <li><code>min_samples_leaf</code>: сколько объектов должно остаться в каждом листе;
      при значении 2 лист из одного студента 11 запрещён;</li>
  <li><code>min_samples_split</code>: сколько объектов нужно в узле, чтобы его вообще делить;</li>
  <li><code>ccp_alpha</code>: обрезка готового дерева. Ветку оставляют, только если она уменьшает
      суммарную неоднородность листьев хотя бы на <code>ccp_alpha</code> в расчёте на каждый
      добавленный лист.</li>
</ul>

<p>
  Значения подбирают по качеству на отложенной выборке или кросс-валидацией: дерево обучают
  с разными <code>max_depth</code> и берут то, у которого ошибка на невиденных данных меньше.
</p>

## Часть 8. Неустойчивость: одна метка меняет всё дерево

<p>
  У одного дерева есть и вторая слабость. Выбор в корне делается жадно, по максимуму прироста,
  и если два порога дают близкий прирост, небольшое изменение данных меняет победителя.
  А другой вопрос в корне означает другие группы во всех ветках ниже.
</p>

<div class="stage" id="stageUnstable" tabindex="0">
  <div class="stage-figure">
<svg id="dtUnstable" viewBox="0 0 960 500" role="img" aria-label="Нестабильность дерева: смена одной метки меняет корень, три дерева голосуют"><style>#dtUnstable { font-family: Helvetica, Arial, sans-serif; }</style>
<text x="70" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">студенты на плоскости</text>
<text x="515" y="30" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">дерево</text>
<g data-key="ax"><rect x="70" y="60" width="418" height="360" rx="0" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1.2"/><line x1="70" y1="420" x2="70" y2="425" stroke="#5E5850" stroke-width="1"/><text x="70" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">0</text><line x1="146" y1="420" x2="146" y2="425" stroke="#5E5850" stroke-width="1"/><text x="146" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">4</text><line x1="222" y1="420" x2="222" y2="425" stroke="#5E5850" stroke-width="1"/><text x="222" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">8</text><line x1="298" y1="420" x2="298" y2="425" stroke="#5E5850" stroke-width="1"/><text x="298" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">12</text><line x1="374" y1="420" x2="374" y2="425" stroke="#5E5850" stroke-width="1"/><text x="374" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">16</text><line x1="450" y1="420" x2="450" y2="425" stroke="#5E5850" stroke-width="1"/><text x="450" y="441" font-size="13" fill="#5E5850" text-anchor="middle" font-weight="400">20</text><line x1="65" y1="420" x2="70" y2="420" stroke="#5E5850" stroke-width="1"/><text x="61" y="425" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">0</text><line x1="65" y1="348" x2="70" y2="348" stroke="#5E5850" stroke-width="1"/><text x="61" y="353" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">2</text><line x1="65" y1="276" x2="70" y2="276" stroke="#5E5850" stroke-width="1"/><text x="61" y="281" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">4</text><line x1="65" y1="204" x2="70" y2="204" stroke="#5E5850" stroke-width="1"/><text x="61" y="209" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">6</text><line x1="65" y1="132" x2="70" y2="132" stroke="#5E5850" stroke-width="1"/><text x="61" y="137" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">8</text><line x1="65" y1="60" x2="70" y2="60" stroke="#5E5850" stroke-width="1"/><text x="61" y="65" font-size="13" fill="#5E5850" text-anchor="end" font-weight="400">10</text><text x="279" y="464" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400">часы подготовки</text><text x="36" y="240" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="400" transform="rotate(-90 36 240)">пропуски</text></g>
<g data-key="reg0" data-only="1"><rect x="70" y="348" width="247" height="72" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><rect x="70" y="60" width="247" height="288" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><line x1="70" y1="348" x2="317" y2="348" stroke="#C29E08" stroke-width="2.2"/><rect x="317" y="60" width="171" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="317" y1="60" x2="317" y2="420" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="regX" data-only="1"><rect x="70" y="258" width="133" height="162" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><rect x="203" y="258" width="285" height="162" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="203" y1="258" x2="203" y2="420" stroke="#C29E08" stroke-width="2.2"/><rect x="70" y="60" width="418" height="198" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><line x1="70" y1="258" x2="488" y2="258" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="regN" data-only="1"><rect x="70" y="60" width="247" height="360" rx="0" fill="#FCE9E9" stroke="none" stroke-width="0"/><rect x="317" y="60" width="171" height="360" rx="0" fill="#EEF6E2" stroke="none" stroke-width="0"/><line x1="317" y1="60" x2="317" y2="420" stroke="#C29E08" stroke-width="2.2"/></g>
<g data-key="pts"><circle cx="108" cy="312" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="108" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">1</text><circle cx="146" cy="168" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="146" y="172.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">2</text><circle cx="184" cy="276" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="184" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">3</text><circle cx="260" cy="132" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="260" y="136.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">5</text><circle cx="298" cy="240" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="298" y="244.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">6</text><circle cx="336" cy="348" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="336" y="352.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">7</text><circle cx="412" cy="312" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="412" y="316.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">9</text><circle cx="450" cy="276" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="450" y="280.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">10</text></g>
<g data-key="p8g" data-only="1"><circle cx="374" cy="204" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="374" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text></g>
<g data-key="p8r" data-only="1"><circle cx="374" cy="204" r="11.5" fill="#C30B0A" stroke="#FFFFFF" stroke-width="1.5"/><text x="374" y="208.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">8</text></g>
<g data-key="p4" data-only="1"><circle cx="222" cy="384" r="11.5" fill="#73B222" stroke="#FFFFFF" stroke-width="1.5"/><text x="222" y="388.5" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="700">4</text></g>
<g data-key="r8" data-only="1"><circle cx="374" cy="204" r="19" fill="none" stroke="#3576C0" stroke-width="2.2" stroke-dasharray="4 3"/><text x="374" y="178" font-size="12" fill="#2A5E9B" text-anchor="middle" font-weight="700">студент 8</text></g>
<g data-key="r4" data-only="1"><circle cx="222" cy="384" r="19" fill="none" stroke="#3576C0" stroke-width="2.2" stroke-dasharray="4 3"/><text x="246" y="389" font-size="12" fill="#2A5E9B" text-anchor="start" font-weight="700">студент 4 убран</text></g>
<g data-key="tO" data-only="1"><line x1="771.67" y1="107" x2="661.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="700.67" y="149" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="588.33" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="609" y="279" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="735" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="714.33" y="279" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="771.67" y1="107" x2="881.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="842.67" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="543.33" y="313" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="588.33" y="334" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="588.33" cy="354" r="5" fill="#73B222"/><rect x="690" y="313" width="90" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="735" y="334" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="709" cy="354" r="5" fill="#C30B0A"/><circle cx="722" cy="354" r="5" fill="#C30B0A"/><circle cx="735" cy="354" r="5" fill="#C30B0A"/><circle cx="748" cy="354" r="5" fill="#C30B0A"/><circle cx="761" cy="354" r="5" fill="#C30B0A"/><rect x="586.67" y="183" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="661.67" y="204" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2</text><circle cx="629.17" cy="224" r="5" fill="#73B222"/><circle cx="642.17" cy="224" r="5" fill="#C30B0A"/><circle cx="655.17" cy="224" r="5" fill="#C30B0A"/><circle cx="668.17" cy="224" r="5" fill="#C30B0A"/><circle cx="681.17" cy="224" r="5" fill="#C30B0A"/><circle cx="694.17" cy="224" r="5" fill="#C30B0A"/><rect x="836.67" y="183" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="881.67" y="204" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="862.17" cy="224" r="5" fill="#73B222"/><circle cx="875.17" cy="224" r="5" fill="#73B222"/><circle cx="888.17" cy="224" r="5" fill="#73B222"/><circle cx="901.17" cy="224" r="5" fill="#73B222"/><rect x="696.67" y="53" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="771.67" y="74" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="713.17" cy="94" r="5" fill="#73B222"/><circle cx="726.17" cy="94" r="5" fill="#73B222"/><circle cx="739.17" cy="94" r="5" fill="#73B222"/><circle cx="752.17" cy="94" r="5" fill="#73B222"/><circle cx="765.17" cy="94" r="5" fill="#73B222"/><circle cx="778.17" cy="94" r="5" fill="#C30B0A"/><circle cx="791.17" cy="94" r="5" fill="#C30B0A"/><circle cx="804.17" cy="94" r="5" fill="#C30B0A"/><circle cx="817.17" cy="94" r="5" fill="#C30B0A"/><circle cx="830.17" cy="94" r="5" fill="#C30B0A"/></g>
<g data-key="tX" data-only="1"><line x1="771.67" y1="107" x2="661.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="700.67" y="149" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="588.33" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="609" y="279" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="661.67" y1="237" x2="735" y2="313" stroke="#A8A296" stroke-width="1.6"/><text x="714.33" y="279" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="771.67" y1="107" x2="881.67" y2="183" stroke="#A8A296" stroke-width="1.6"/><text x="842.67" y="149" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="543.33" y="313" width="90" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="588.33" y="334" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="581.83" cy="354" r="5" fill="#C30B0A"/><circle cx="594.83" cy="354" r="5" fill="#C30B0A"/><rect x="690" y="313" width="90" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="735" y="334" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="715.5" cy="354" r="5" fill="#73B222"/><circle cx="728.5" cy="354" r="5" fill="#73B222"/><circle cx="741.5" cy="354" r="5" fill="#73B222"/><circle cx="754.5" cy="354" r="5" fill="#73B222"/><rect x="586.67" y="183" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="661.67" y="204" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 7</text><circle cx="629.17" cy="224" r="5" fill="#73B222"/><circle cx="642.17" cy="224" r="5" fill="#73B222"/><circle cx="655.17" cy="224" r="5" fill="#73B222"/><circle cx="668.17" cy="224" r="5" fill="#73B222"/><circle cx="681.17" cy="224" r="5" fill="#C30B0A"/><circle cx="694.17" cy="224" r="5" fill="#C30B0A"/><rect x="836.67" y="183" width="90" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="881.67" y="204" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="862.17" cy="224" r="5" fill="#C30B0A"/><circle cx="875.17" cy="224" r="5" fill="#C30B0A"/><circle cx="888.17" cy="224" r="5" fill="#C30B0A"/><circle cx="901.17" cy="224" r="5" fill="#C30B0A"/><rect x="696.67" y="53" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="771.67" y="74" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 4,5</text><circle cx="713.17" cy="94" r="5" fill="#73B222"/><circle cx="726.17" cy="94" r="5" fill="#73B222"/><circle cx="739.17" cy="94" r="5" fill="#73B222"/><circle cx="752.17" cy="94" r="5" fill="#73B222"/><circle cx="765.17" cy="94" r="5" fill="#C30B0A"/><circle cx="778.17" cy="94" r="5" fill="#C30B0A"/><circle cx="791.17" cy="94" r="5" fill="#C30B0A"/><circle cx="804.17" cy="94" r="5" fill="#C30B0A"/><circle cx="817.17" cy="94" r="5" fill="#C30B0A"/><circle cx="830.17" cy="94" r="5" fill="#C30B0A"/></g>
<g data-key="tN" data-only="1"><line x1="735" y1="107" x2="625" y2="203" stroke="#A8A296" stroke-width="1.6"/><text x="664" y="159" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="735" y1="107" x2="845" y2="203" stroke="#A8A296" stroke-width="1.6"/><text x="806" y="159" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="570" y="203" width="110" height="54" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="625" y="224" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="599" cy="244" r="5" fill="#C30B0A"/><circle cx="612" cy="244" r="5" fill="#C30B0A"/><circle cx="625" cy="244" r="5" fill="#C30B0A"/><circle cx="638" cy="244" r="5" fill="#C30B0A"/><circle cx="651" cy="244" r="5" fill="#C30B0A"/><rect x="790" y="203" width="110" height="54" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="845" y="224" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="825.5" cy="244" r="5" fill="#73B222"/><circle cx="838.5" cy="244" r="5" fill="#73B222"/><circle cx="851.5" cy="244" r="5" fill="#73B222"/><circle cx="864.5" cy="244" r="5" fill="#73B222"/><rect x="660" y="53" width="150" height="54" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="735" y="74" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="683" cy="94" r="5" fill="#73B222"/><circle cx="696" cy="94" r="5" fill="#73B222"/><circle cx="709" cy="94" r="5" fill="#73B222"/><circle cx="722" cy="94" r="5" fill="#73B222"/><circle cx="735" cy="94" r="5" fill="#C30B0A"/><circle cx="748" cy="94" r="5" fill="#C30B0A"/><circle cx="761" cy="94" r="5" fill="#C30B0A"/><circle cx="774" cy="94" r="5" fill="#C30B0A"/><circle cx="787" cy="94" r="5" fill="#C30B0A"/></g>
<g data-key="gtab" data-only="1"><text x="525" y="84" font-size="13" fill="#5E5850" text-anchor="start" font-weight="700">прирост в корне</text><text x="820" y="84" font-size="13" fill="#5E5850" text-anchor="end" font-weight="700">было</text><text x="930" y="84" font-size="13" fill="#5E5850" text-anchor="end" font-weight="700">стало</text><line x1="525" y1="94" x2="935" y2="94" stroke="#D8D4C8" stroke-width="1"/><text x="525" y="124" font-size="14" fill="#111111" text-anchor="start" font-weight="700">часы ≤ 13</text><text x="820" y="124" font-size="14" fill="#8F7406" text-anchor="end" font-weight="700">0,610</text><text x="930" y="124" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,256</text><text x="525" y="156" font-size="14" fill="#111111" text-anchor="start" font-weight="700">пропуски ≤ 4,5</text><text x="820" y="156" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,125</text><text x="930" y="156" font-size="14" fill="#8F7406" text-anchor="end" font-weight="700">0,420</text><text x="525" y="188" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 17</text><text x="820" y="188" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,236</text><text x="930" y="188" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,322</text><text x="525" y="220" font-size="14" fill="#111111" text-anchor="start" font-weight="400">пропуски ≤ 2,5</text><text x="820" y="220" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,236</text><text x="930" y="220" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,322</text><text x="525" y="252" font-size="14" fill="#111111" text-anchor="start" font-weight="400">часы ≤ 7</text><text x="820" y="252" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,396</text><text x="930" y="252" font-size="14" fill="#5E5850" text-anchor="end" font-weight="400">0,281</text><text x="525" y="300" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">жёлтым отмечен победитель до и после</text></g>
<g data-key="B" data-only="1"><circle cx="355" cy="168" r="12.5" fill="#FFFFFF" stroke="#3576C0" stroke-width="2.8"/><text x="355" y="173" font-size="13" fill="#3576C0" text-anchor="middle" font-weight="700">Б</text></g>
<g data-key="vX" data-only="1"><text x="525" y="470" font-size="14" fill="#2A5E9B" text-anchor="start" font-weight="700">Б (15 ч, 7 пропусков): раньше «сдаст», теперь «не сдаст»</text></g>
<g data-key="forest" data-only="1"><rect x="0" y="0" width="960" height="500" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><rect x="14" y="52" width="302" height="380" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="165" y="78" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">исходные данные</text><line x1="189.17" y1="135" x2="116.67" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="136.92" y="174" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="116.67" y1="255" x2="68.33" y2="325" stroke="#A8A296" stroke-width="1.6"/><text x="76.5" y="294" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="116.67" y1="255" x2="165" y2="325" stroke="#A8A296" stroke-width="1.6"/><text x="156.83" y="294" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="189.17" y1="135" x2="261.67" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="241.42" y="174" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="26.33" y="325" width="84" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="68.33" y="344" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="68.33" cy="364" r="5" fill="#73B222"/><rect x="123" y="325" width="84" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="165" y="344" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="139" cy="364" r="5" fill="#C30B0A"/><circle cx="152" cy="364" r="5" fill="#C30B0A"/><circle cx="165" cy="364" r="5" fill="#C30B0A"/><circle cx="178" cy="364" r="5" fill="#C30B0A"/><circle cx="191" cy="364" r="5" fill="#C30B0A"/><rect x="56.67" y="205" width="120" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="116.67" y="224" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 2</text><circle cx="84.17" cy="244" r="5" fill="#73B222"/><circle cx="97.17" cy="244" r="5" fill="#C30B0A"/><circle cx="110.17" cy="244" r="5" fill="#C30B0A"/><circle cx="123.17" cy="244" r="5" fill="#C30B0A"/><circle cx="136.17" cy="244" r="5" fill="#C30B0A"/><circle cx="149.17" cy="244" r="5" fill="#C30B0A"/><rect x="219.67" y="205" width="84" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="261.67" y="224" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="242.17" cy="244" r="5" fill="#73B222"/><circle cx="255.17" cy="244" r="5" fill="#73B222"/><circle cx="268.17" cy="244" r="5" fill="#73B222"/><circle cx="281.17" cy="244" r="5" fill="#73B222"/><rect x="120.17" y="85" width="138" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="189.17" y="104" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="130.67" cy="124" r="5" fill="#73B222"/><circle cx="143.67" cy="124" r="5" fill="#73B222"/><circle cx="156.67" cy="124" r="5" fill="#73B222"/><circle cx="169.67" cy="124" r="5" fill="#73B222"/><circle cx="182.67" cy="124" r="5" fill="#73B222"/><circle cx="195.67" cy="124" r="5" fill="#C30B0A"/><circle cx="208.67" cy="124" r="5" fill="#C30B0A"/><circle cx="221.67" cy="124" r="5" fill="#C30B0A"/><circle cx="234.67" cy="124" r="5" fill="#C30B0A"/><circle cx="247.67" cy="124" r="5" fill="#C30B0A"/><rect x="85" y="392" width="160" height="30" rx="15" fill="#EEF6E2" stroke="#73B222" stroke-width="1.5"/><text x="165" y="412" font-size="14" fill="#5F9420" text-anchor="middle" font-weight="700">Б: сдаст</text><rect x="329" y="52" width="302" height="380" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="480" y="78" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">у студента 8 другая метка</text><line x1="504.17" y1="135" x2="431.67" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="451.92" y="174" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="431.67" y1="255" x2="383.33" y2="325" stroke="#A8A296" stroke-width="1.6"/><text x="391.5" y="294" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="431.67" y1="255" x2="480" y2="325" stroke="#A8A296" stroke-width="1.6"/><text x="471.83" y="294" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><line x1="504.17" y1="135" x2="576.67" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="556.42" y="174" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="341.33" y="325" width="84" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="383.33" y="344" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="376.83" cy="364" r="5" fill="#C30B0A"/><circle cx="389.83" cy="364" r="5" fill="#C30B0A"/><rect x="438" y="325" width="84" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="480" y="344" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="460.5" cy="364" r="5" fill="#73B222"/><circle cx="473.5" cy="364" r="5" fill="#73B222"/><circle cx="486.5" cy="364" r="5" fill="#73B222"/><circle cx="499.5" cy="364" r="5" fill="#73B222"/><rect x="371.67" y="205" width="120" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="431.67" y="224" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 7</text><circle cx="399.17" cy="244" r="5" fill="#73B222"/><circle cx="412.17" cy="244" r="5" fill="#73B222"/><circle cx="425.17" cy="244" r="5" fill="#73B222"/><circle cx="438.17" cy="244" r="5" fill="#73B222"/><circle cx="451.17" cy="244" r="5" fill="#C30B0A"/><circle cx="464.17" cy="244" r="5" fill="#C30B0A"/><rect x="534.67" y="205" width="84" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="576.67" y="224" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="557.17" cy="244" r="5" fill="#C30B0A"/><circle cx="570.17" cy="244" r="5" fill="#C30B0A"/><circle cx="583.17" cy="244" r="5" fill="#C30B0A"/><circle cx="596.17" cy="244" r="5" fill="#C30B0A"/><rect x="435.17" y="85" width="138" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="504.17" y="104" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">пропуски ≤ 4,5</text><circle cx="445.67" cy="124" r="5" fill="#73B222"/><circle cx="458.67" cy="124" r="5" fill="#73B222"/><circle cx="471.67" cy="124" r="5" fill="#73B222"/><circle cx="484.67" cy="124" r="5" fill="#73B222"/><circle cx="497.67" cy="124" r="5" fill="#C30B0A"/><circle cx="510.67" cy="124" r="5" fill="#C30B0A"/><circle cx="523.67" cy="124" r="5" fill="#C30B0A"/><circle cx="536.67" cy="124" r="5" fill="#C30B0A"/><circle cx="549.67" cy="124" r="5" fill="#C30B0A"/><circle cx="562.67" cy="124" r="5" fill="#C30B0A"/><rect x="400" y="392" width="160" height="30" rx="15" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.5"/><text x="480" y="412" font-size="14" fill="#9C0908" text-anchor="middle" font-weight="700">Б: не сдаст</text><rect x="644" y="52" width="302" height="380" rx="12" fill="#FAFAF7" stroke="#D8D4C8" stroke-width="1.2"/><text x="795" y="78" font-size="14" fill="#111111" text-anchor="middle" font-weight="700">без студента 4</text><line x1="795" y1="135" x2="722.5" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="742.75" y="174" font-size="12" fill="#5E5850" text-anchor="end" font-weight="400">да</text><line x1="795" y1="135" x2="867.5" y2="205" stroke="#A8A296" stroke-width="1.6"/><text x="847.25" y="174" font-size="12" fill="#5E5850" text-anchor="start" font-weight="400">нет</text><rect x="680.5" y="205" width="84" height="50" rx="10" fill="#FCE9E9" stroke="#C30B0A" stroke-width="1.6"/><text x="722.5" y="224" font-size="15" fill="#9C0908" text-anchor="middle" font-weight="700">не сдал</text><circle cx="696.5" cy="244" r="5" fill="#C30B0A"/><circle cx="709.5" cy="244" r="5" fill="#C30B0A"/><circle cx="722.5" cy="244" r="5" fill="#C30B0A"/><circle cx="735.5" cy="244" r="5" fill="#C30B0A"/><circle cx="748.5" cy="244" r="5" fill="#C30B0A"/><rect x="825.5" y="205" width="84" height="50" rx="10" fill="#EEF6E2" stroke="#73B222" stroke-width="1.6"/><text x="867.5" y="224" font-size="15" fill="#5F9420" text-anchor="middle" font-weight="700">сдал</text><circle cx="848" cy="244" r="5" fill="#73B222"/><circle cx="861" cy="244" r="5" fill="#73B222"/><circle cx="874" cy="244" r="5" fill="#73B222"/><circle cx="887" cy="244" r="5" fill="#73B222"/><rect x="732" y="85" width="126" height="50" rx="10" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.6"/><text x="795" y="104" font-size="15" fill="#8F7406" text-anchor="middle" font-weight="700">часы ≤ 13</text><circle cx="743" cy="124" r="5" fill="#73B222"/><circle cx="756" cy="124" r="5" fill="#73B222"/><circle cx="769" cy="124" r="5" fill="#73B222"/><circle cx="782" cy="124" r="5" fill="#73B222"/><circle cx="795" cy="124" r="5" fill="#C30B0A"/><circle cx="808" cy="124" r="5" fill="#C30B0A"/><circle cx="821" cy="124" r="5" fill="#C30B0A"/><circle cx="834" cy="124" r="5" fill="#C30B0A"/><circle cx="847" cy="124" r="5" fill="#C30B0A"/><rect x="715" y="392" width="160" height="30" rx="15" fill="#EEF6E2" stroke="#73B222" stroke-width="1.5"/><text x="795" y="412" font-size="14" fill="#5F9420" text-anchor="middle" font-weight="700">Б: сдаст</text><text x="480" y="30" font-size="14" fill="#5E5850" text-anchor="middle" font-weight="700">три дерева на трёх чуть разных выборках</text><text x="480" y="466" font-size="15" fill="#111111" text-anchor="middle" font-weight="700">голосование для студента Б: 2 против 1, ответ «сдаст»</text></g>
<text x="40" y="490" font-size="13" fill="#5E5850" text-anchor="start" font-weight="400">одна смена метки или один убранный студент меняют дерево целиком</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="ax reg0 pts p8g p4 tO r8" data-focus="r8">
      <div class="step-kicker">Шаг 1 · исходное дерево</div>
      <h4>Возьмём наше дерево и студента 8</h4>
      <p>Это дерево из первых частей: в корне «часы ≤ 13», слева вопрос про пропуски. Студент 8 готовился 16 часов, пропустил 6 занятий и сдал.</p>
<p>Представим, что в ведомости ошибка и на самом деле студент 8 не сдал. Меняется одна метка из десяти, сами точки остаются на месте.</p>
    </div>
    <div class="step-panel" data-on="ax reg0 pts p8r p4 r8 gtab" data-focus="p8r gtab">
      <div class="step-kicker">Шаг 2 · пересчёт приростов</div>
      <h4>Одна метка меняет победителя в корне</h4>
      <p>Пересчитаем прирост в корне. У порога «часы ≤ 13» правая группа перестала быть чистой: в ней теперь 3 сдавших из 4, и прирост упал с 0,610 до 0,256.</p>
<p>Зато «пропуски ≤ 4,5» вырос с 0,125 до 0,420: все студенты с пятью и более пропусками теперь не сдали. Он и становится новым корнем.</p>
    </div>
    <div class="step-panel" data-on="ax regX pts p8r p4 tX" data-focus="tX regX">
      <div class="step-kicker">Шаг 3 · новое дерево</div>
      <h4>Дерево перестроилось целиком</h4>
      <p>Новое дерево сначала спрашивает про пропуски, и только потом про часы: «пропуски ≤ 4,5», затем «часы ≤ 7». На плоскости граница повернулась: раньше главная линия была вертикальной, теперь горизонтальная.</p>
<p>Изменение одной метки прошло через всю рекурсию. Другой вопрос в корне означает другие группы в ветках, а в них свои пороги-победители.</p>
    </div>
    <div class="step-panel" data-on="ax regX pts p8r p4 tX B vX" data-focus="B vX">
      <div class="step-kicker">Шаг 4 · другие ответы</div>
      <h4>Студент Б получает другой ответ</h4>
      <p>Студент Б из части 2 (15 часов, 7 пропусков) по старому дереву «сдаст», по новому «не сдаст»: у него больше 4,5 пропусков, и это сразу лист.</p>
<p>Ответ на вопрос про одного нового студента зависит от того, как записан исход одного из десяти старых. Это свойство одиночного дерева называют высокой дисперсией: модель сильно меняется от небольших изменений обучающей выборки.</p>
    </div>
    <div class="step-panel" data-on="ax regN pts p8g tN r4" data-focus="tN regN r4">
      <div class="step-kicker">Шаг 5 · без одного студента</div>
      <h4>Убираем студента 4, и второй вопрос исчезает</h4>
      <p>Вернём метку студенту 8, но уберём из данных студента 4 (8 часов, 1 пропуск, сдал). Без него одного порога «часы ≤ 13» хватает, чтобы обе группы стали чистыми.</p>
<p>Дерево вырождается в один вопрос, и пропуски перестают влиять на ответ совсем. Зона «сдаст» в левом нижнем углу пропала.</p>
    </div>
    <div class="step-panel" data-on="forest" data-focus="forest">
      <div class="step-kicker">Шаг 6 · выход: много деревьев</div>
      <h4>Деревья, обученные на разных выборках, голосуют</h4>
      <p>Здесь три дерева, полученные выше на трёх слегка разных версиях данных. Для студента Б два из них отвечают «сдаст», одно «не сдаст». Если взять ответ большинства, ошибка в одной метке на итог уже не влияет.</p>
<p>На этом устроен случайный лес: сотни деревьев обучают на случайных подвыборках объектов, в каждом узле разрешают выбирать порог только из случайной части признаков, и ответы усредняют. Каждое дерево по-прежнему неустойчиво, но среднее по многим меняется от изменения одной метки гораздо меньше.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Наведите фокус на сцену и листайте стрелками ← →.</p>

<p>
  Ограничение глубины от этой проблемы не спасает: дерево глубины 2 на данных со сменённой
  меткой и есть новое дерево из третьего шага. Неустойчивость лечат усреднением многих
  деревьев. В бэггинге и случайном лесе деревья обучают независимо на разных случайных
  выборках и голосуют. В градиентном бустинге неглубокие деревья строят по очереди,
  и каждое исправляет ошибки суммы предыдущих. Это темы отдельных статей.
</p>

## Часть 9. Код: дерево с нуля и проверка на sklearn

### Дерево на чистом Python

<p>
  Всё, что разобрано выше, умещается в четыре функции. <code>entropy</code> считает
  энтропию группы, <code>best_split</code> перебирает пороги-середины по обоим признакам,
  <code>build</code> рекурсивно строит дерево и хранит его во вложенных словарях,
  <code>predict</code> спускает объект от корня к листу.
</p>

```python
from math import log2

# часы подготовки, пропуски, сдал (1) или нет (0)
data = [(2, 3, 0), (4, 7, 0), (6, 4, 0), (8, 1, 1), (10, 8, 0),
        (12, 5, 0), (14, 2, 1), (16, 6, 1), (18, 3, 1), (20, 4, 1)]
names = ["часы", "пропуски"]


def entropy(rows):
    p = sum(r[2] for r in rows) / len(rows)          # доля сдавших
    return -sum(q * log2(q) for q in (p, 1 - p) if q > 0)


def best_split(rows):
    """Перебираем все пороги по обоим признакам, возвращаем лучший."""
    best = None
    for f in (0, 1):
        values = sorted({r[f] for r in rows})
        for a, b in zip(values, values[1:]):
            t = (a + b) / 2                            # порог посередине между соседями
            left = [r for r in rows if r[f] <= t]
            right = [r for r in rows if r[f] > t]
            child = (len(left) * entropy(left) + len(right) * entropy(right)) / len(rows)
            gain = entropy(rows) - child
            if best is None or gain > best[0]:
                best = (gain, f, t, left, right)
    return best


def build(rows, depth=0, max_depth=None):
    passed = sum(r[2] for r in rows)
    split = best_split(rows)
    if entropy(rows) == 0 or depth == max_depth or split is None:
        return {"leaf": int(passed * 2 > len(rows)), "passed": passed, "n": len(rows)}
    gain, f, t, left, right = split
    return {"feature": f, "threshold": t, "gain": gain,
            "left": build(left, depth + 1, max_depth),
            "right": build(right, depth + 1, max_depth)}


def predict(node, x):
    while "leaf" not in node:
        node = node["left"] if x[node["feature"]] <= node["threshold"] else node["right"]
    return node["leaf"]


def show(node, indent=""):
    if "leaf" in node:
        answer = "сдал" if node["leaf"] else "не сдал"
        print(f"{indent}лист: {answer} ({node['passed']} из {node['n']})")
        return
    print(f"{indent}{names[node['feature']]} <= {node['threshold']:g}  (прирост {node['gain']:.3f})")
    show(node["left"], indent + "  ")
    show(node["right"], indent + "  ")


tree = build(data)
show(tree)
print("студент А (11 ч, 1 пропуск):", predict(tree, (11, 1)))
print("студент Б (15 ч, 7 пропусков):", predict(tree, (15, 7)))
```

<p>Вывод совпадает с деревом из части 1 и с числами из частей 4 и 5:</p>

```text
часы <= 13  (прирост 0.610)
  пропуски <= 2  (прирост 0.650)
    лист: сдал (1 из 1)
    лист: не сдал (0 из 5)
  лист: сдал (4 из 4)
студент А (11 ч, 1 пропуск): 1
студент Б (15 ч, 7 пропусков): 1
```

### Переобучение в коде

<p>
  Добавим студента 11 и шесть новых студентов из части 7 и сравним дерево без ограничений
  с деревом глубины 2. Код продолжает предыдущий файл:
</p>

```python
train = data + [(5, 8, 1)]                     # студент 11: 5 часов, 8 пропусков, сдал
test = [(3, 9, 0), (7, 9, 0), (10, 1, 1), (17, 4, 1), (11, 4, 0), (18, 7, 1)]


def accuracy(tree, rows):
    return sum(predict(tree, r[:2]) == r[2] for r in rows)


for max_depth in (None, 2):
    tree = build(train, max_depth=max_depth)
    print(f"max_depth={max_depth}: обучение {accuracy(tree, train)} из {len(train)}, "
          f"новые {accuracy(tree, test)} из {len(test)}")
```

```text
max_depth=None: обучение 11 из 11, новые 4 из 6
max_depth=2: обучение 10 из 11, новые 6 из 6
```

### То же самое в sklearn

<p>
  <code>DecisionTreeClassifier</code> с <code>criterion="entropy"</code> строит то же дерево.
  Функция <code>export_text</code> печатает его по узлам, а <code>show_weights=True</code>
  добавляет число объектов каждого класса в листе: первое число относится к классу 0
  («не сдал»), второе к классу 1.
</p>

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from tree_scratch import data, names

X = np.array([r[:2] for r in data])
y = np.array([r[2] for r in data])

clf = DecisionTreeClassifier(criterion="entropy", random_state=0)
clf.fit(X, y)
print(export_text(clf, feature_names=names, show_weights=True))
print(clf.predict([[11, 1], [15, 7]]))
print(clf.predict_proba([[11, 1]]))
```

```text
|--- часы <= 13.00
|   |--- пропуски <= 2.00
|   |   |--- weights: [0.00, 1.00] class: 1
|   |--- пропуски >  2.00
|   |   |--- weights: [5.00, 0.00] class: 0
|--- часы >  13.00
|   |--- weights: [0.00, 4.00] class: 1

[1 1]
[[0. 1.]]
```

<p>
  <code>predict_proba</code> для студента А возвращает <span class="math-inline" data-tex="[0;\ 1]"></span>: это доли классов
  в его листе, где один студент, и он сдал. Та же уверенность на одном объекте, о которой
  шла речь в части 2. С 11-м студентом и <code>max_depth=2</code> библиотека тоже
  воспроизводит наши результаты: глубина 4 и 5 листьев без ограничения, 10 из 11 на обучении
  и 6 из 6 на новых с ограничением.
</p>

## Часть 10. Что получилось

<p>
  Сравним дерево с логистической регрессией, обученной на тех же признаках.
</p>

<div class="dt-table"><table class="shape-table">
  <tr><th></th><th>Логистическая регрессия</th><th>Дерево решений</th></tr>
  <tr><td>Граница классов</td><td>одна прямая</td><td>ступеньки из отрезков, параллельных осям</td></tr>
  <tr><td>Что выучено</td><td>веса и сдвиг</td><td>признак и порог в каждом узле, доли классов в листьях</td></tr>
  <tr><td>Как обучается</td><td>градиентный спуск по log loss</td><td>жадный перебор порогов по приросту информации</td></tr>
  <tr><td>Масштаб признаков</td><td>влияет на обучение</td><td>не влияет</td></tr>
  <tr><td>Вероятность</td><td>сигмоида от линейной комбинации</td><td>доля класса в листе</td></tr>
  <tr><td>Слабое место</td><td>граница может быть только прямой</td><td>переобучение и неустойчивость</td></tr>
</table></div>

### Что важно уметь восстановить по памяти

<ul>
  <li>Прогноз дерева: спуск от корня к листу, в каждом узле одно сравнение «признак ≤ порог».</li>
  <li>Ответ листа берётся по большинству обучающих объектов в нём, вероятность равна доле класса.</li>
  <li>Энтропия <span class="math-inline" data-tex="H = -\sum_k p_k\log_2 p_k"></span>: ноль для чистого узла, единица для двух классов поровну.</li>
  <li>Прирост информации <span class="math-inline" data-tex="IG = H - \frac{n_L}{n}H_L - \frac{n_R}{n}H_R"></span>; в корне нашего дерева он равен 0,610.</li>
  <li>Кандидаты в пороги: середины между соседними различными значениями признака.</li>
  <li>Построение жадное и рекурсивное, остановка по чистоте узла или по гиперпараметрам.</li>
  <li>Gini <span class="math-inline" data-tex="G = 1 - \sum_k p_k^2"></span> ранжирует пороги почти так же, как энтропия.</li>
  <li>Без ограничений дерево подгоняет листья под отдельные точки; <code>max_depth</code> и <code>min_samples_leaf</code> это предотвращают.</li>
  <li>Одна изменённая метка может поменять вопрос в корне, а с ним всё дерево; поэтому на практике деревья объединяют в ансамбли.</li>
</ul>

<p>
  За рамками статьи остались деревья регрессии (в листе хранится среднее значение целевой
  переменной, а вместо энтропии берётся дисперсия), категориальные признаки и пропуски
  в данных.
</p>

<p class="tiny">
  По мотивам интерактивной статьи <a href="https://mlu-explain.github.io/decision-tree/">Decision Trees</a>
  из MLU-Explain (Jared Wilber, Lucía Santamaría). Источники: C. Shannon, «A Mathematical Theory
  of Communication», 1948; L. Breiman, J. Friedman, R. Olshen, C. Stone, «Classification and Regression
  Trees», 1984; J. R. Quinlan, «Induction of Decision Trees», 1986.
</p>
