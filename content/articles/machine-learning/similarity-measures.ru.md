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
  Метод ближайших соседей, кластеризация, поиск похожих товаров и текстов опираются на одно понятие: насколько два
  объекта похожи. Разберём основные меры близости на знакомых примерах и посмотрим, как от выбора меры меняется
  ответ.
</p>

<p>
  В <a href="article.html?slug=knn-full-cycle">статье про kNN</a> соседей искали по обычному евклидову расстоянию
  на плоскости «часы подготовки × пропуски». Здесь те же десять студентов и новые студенты А (11 часов, 1 пропуск)
  и Б (15 часов, 7 пропусков), а для мер, которым нужны другие данные, появятся профили подготовки, посещаемость
  лекций и слова.
</p>


## Часть 1. Расстояние и сходство

<p>
  Меры бывают двух видов. Расстояние <span class="math-inline" data-tex="d(x, y)"></span> тем больше, чем объекты различнее, у одинаковых оно ноль.
  Сходство <span class="math-inline" data-tex="s(x, y)"></span> наоборот: чем объекты похожее, тем оно больше, часто до 1 у одинаковых. Одно переводят
  в другое, например <span class="math-inline" data-tex="d = 1 - s"></span>, когда <span class="math-inline" data-tex="s"></span> лежит от 0 до 1.
</p>

<p>
  Расстояние называют метрикой, если выполнены четыре условия. Проверим их на студентах А, 4 и 7:
</p>

<ul>
  <li><b>Неотрицательность:</b> <span class="math-inline" data-tex="d(x, y) \ge 0"></span>. Расстояние от А до студента 4 равно 3.</li>
  <li><b>Ноль только у совпадающих:</b> <span class="math-inline" data-tex="d(x, y) = 0"></span> тогда и только тогда, когда <span class="math-inline" data-tex="x = y"></span>.</li>
  <li><b>Симметрия:</b> <span class="math-inline" data-tex="d(x, y) = d(y, x)"></span>. От 4 до А тоже 3.</li>
  <li><b>Неравенство треугольника:</b> <span class="math-inline" data-tex="d(x, z) \le d(x, y) + d(y, z)"></span>. Путь от А до 7 напрямую, 3,16,
    не длиннее пути через студента 4: <span class="math-inline" data-tex="3 + 6{,}08 = 9{,}08"></span>.</li>
</ul>

<p>
  Неравенство треугольника нарушается чаще, чем кажется. Квадрат евклидова расстояния, который удобно считать,
  метрикой не является: для точек 0, 1 и 2 на прямой <span class="math-inline" data-tex="d^2(0, 2) = 4"></span>, а <span class="math-inline" data-tex="d^2(0, 1) + d^2(1, 2) = 2"></span>. Для kNN это
  не важно: квадрат расставляет соседей в том же порядке. Но KD-дерево и ball tree из статьи про kNN отбрасывают
  заведомо далёкие точки именно с помощью неравенства треугольника, и с мерой, которая его нарушает, такой поиск
  может пропустить настоящего соседа.
</p>


## Часть 2. Семейство Минковского

<p>
  Евклидово и манхэттенское расстояния — частные случаи одной формулы с параметром <span class="math-inline" data-tex="p"></span>:
</p>

<div class="math-display" data-tex="d_p(x, y) = \Big(\sum_j |x_j - y_j|^p\Big)^{1/p}"></div>

<p>
  При <span class="math-inline" data-tex="p = 1"></span> получается манхэттенское расстояние, сумма модулей разниц. При <span class="math-inline" data-tex="p = 2"></span> — евклидово. Чем больше <span class="math-inline" data-tex="p"></span>,
  тем сильнее вклад самой большой разницы, и при <span class="math-inline" data-tex="p \to \infty"></span> остаётся только она: <span class="math-inline" data-tex="d_\infty = \max_j |x_j - y_j|"></span>,
  расстояние Чебышёва. Для А и студента 7 (разница 3 часа и 1 пропуск): <span class="math-inline" data-tex="3 + 1 = 4"></span>, <span class="math-inline" data-tex="\sqrt{9 + 1} \approx 3{,}16"></span>
  и <span class="math-inline" data-tex="\max(3, 1) = 3"></span>.
</p>

<p>
  Форму меры лучше всего видно по шару: множеству точек на расстоянии 1 от центра.
</p>


<div class="cm-fig"><svg viewBox="0 0 760 230" role="img" aria-label="Единичные шары расстояния Минковского"><rect x="0" y="0" width="760" height="230" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><line x1="14" y1="105" x2="146" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="80" y1="39" x2="80" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M135.0 105.0 L134.9 105.0 L134.7 105.0 L134.3 105.0 L133.8 105.0 L133.1 105.0 L132.3 105.0 L131.4 104.9 L130.3 104.9 L129.2 104.8 L127.9 104.8 L126.5 104.6 L125.0 104.5 L123.4 104.3 L121.8 104.1 L120.1 103.8 L118.3 103.5 L116.5 103.1 L114.7 102.7 L112.8 102.1 L110.9 101.6 L109.1 100.9 L107.2 100.2 L105.4 99.3 L103.6 98.4 L101.8 97.4 L100.1 96.4 L98.4 95.2 L96.8 94.0 L95.2 92.7 L93.8 91.2 L92.3 89.8 L91.0 88.2 L89.8 86.6 L88.6 84.9 L87.6 83.2 L86.6 81.4 L85.7 79.6 L84.8 77.8 L84.1 75.9 L83.4 74.1 L82.9 72.2 L82.3 70.3 L81.9 68.5 L81.5 66.7 L81.2 64.9 L80.9 63.2 L80.7 61.6 L80.5 60.0 L80.4 58.5 L80.2 57.1 L80.2 55.8 L80.1 54.7 L80.1 53.6 L80.0 52.7 L80.0 51.9 L80.0 51.2 L80.0 50.7 L80.0 50.3 L80.0 50.1 L80.0 50.0 L80.0 50.1 L80.0 50.3 L80.0 50.7 L80.0 51.2 L80.0 51.9 L80.0 52.7 L79.9 53.6 L79.9 54.7 L79.8 55.8 L79.8 57.1 L79.6 58.5 L79.5 60.0 L79.3 61.6 L79.1 63.2 L78.8 64.9 L78.5 66.7 L78.1 68.5 L77.7 70.3 L77.1 72.2 L76.6 74.1 L75.9 75.9 L75.2 77.8 L74.3 79.6 L73.4 81.4 L72.4 83.2 L71.4 84.9 L70.2 86.6 L69.0 88.2 L67.7 89.8 L66.2 91.2 L64.8 92.7 L63.2 94.0 L61.6 95.2 L59.9 96.4 L58.2 97.4 L56.4 98.4 L54.6 99.3 L52.8 100.2 L50.9 100.9 L49.1 101.6 L47.2 102.1 L45.3 102.7 L43.5 103.1 L41.7 103.5 L39.9 103.8 L38.2 104.1 L36.6 104.3 L35.0 104.5 L33.5 104.6 L32.1 104.8 L30.8 104.8 L29.7 104.9 L28.6 104.9 L27.7 105.0 L26.9 105.0 L26.2 105.0 L25.7 105.0 L25.3 105.0 L25.1 105.0 L25.0 105.0 L25.1 105.0 L25.3 105.0 L25.7 105.0 L26.2 105.0 L26.9 105.0 L27.7 105.0 L28.6 105.1 L29.7 105.1 L30.8 105.2 L32.1 105.2 L33.5 105.4 L35.0 105.5 L36.6 105.7 L38.2 105.9 L39.9 106.2 L41.7 106.5 L43.5 106.9 L45.3 107.3 L47.2 107.9 L49.1 108.4 L50.9 109.1 L52.8 109.8 L54.6 110.7 L56.4 111.6 L58.2 112.6 L59.9 113.6 L61.6 114.8 L63.2 116.0 L64.8 117.3 L66.2 118.8 L67.7 120.2 L69.0 121.8 L70.2 123.4 L71.4 125.1 L72.4 126.8 L73.4 128.6 L74.3 130.4 L75.2 132.2 L75.9 134.1 L76.6 135.9 L77.1 137.8 L77.7 139.7 L78.1 141.5 L78.5 143.3 L78.8 145.1 L79.1 146.8 L79.3 148.4 L79.5 150.0 L79.6 151.5 L79.8 152.9 L79.8 154.2 L79.9 155.3 L79.9 156.4 L80.0 157.3 L80.0 158.1 L80.0 158.8 L80.0 159.3 L80.0 159.7 L80.0 159.9 L80.0 160.0 L80.0 159.9 L80.0 159.7 L80.0 159.3 L80.0 158.8 L80.0 158.1 L80.0 157.3 L80.1 156.4 L80.1 155.3 L80.2 154.2 L80.2 152.9 L80.4 151.5 L80.5 150.0 L80.7 148.4 L80.9 146.8 L81.2 145.1 L81.5 143.3 L81.9 141.5 L82.3 139.7 L82.9 137.8 L83.4 135.9 L84.1 134.1 L84.8 132.2 L85.7 130.4 L86.6 128.6 L87.6 126.8 L88.6 125.1 L89.8 123.4 L91.0 121.8 L92.3 120.2 L93.7 118.8 L95.2 117.3 L96.8 116.0 L98.4 114.8 L100.1 113.6 L101.8 112.6 L103.6 111.6 L105.4 110.7 L107.2 109.8 L109.1 109.1 L110.9 108.4 L112.8 107.9 L114.7 107.3 L116.5 106.9 L118.3 106.5 L120.1 106.2 L121.8 105.9 L123.4 105.7 L125.0 105.5 L126.5 105.4 L127.9 105.2 L129.2 105.2 L130.3 105.1 L131.4 105.1 L132.3 105.0 L133.1 105.0 L133.8 105.0 L134.3 105.0 L134.7 105.0 L134.9 105.0 L135.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="80" cy="105" r="3.5" fill="#111111"/><text x="80" y="200" font-size="12.5" fill="#9C0908" text-anchor="middle" font-weight="700">p = 0,5</text><line x1="164" y1="105" x2="296" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="230" y1="39" x2="230" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M285.0 105.0 L285.0 105.0 L284.8 104.8 L284.7 104.7 L284.4 104.4 L284.1 104.1 L283.7 103.7 L283.2 103.2 L282.6 102.6 L282.0 102.0 L281.3 101.3 L280.6 100.6 L279.7 99.7 L278.9 98.9 L277.9 97.9 L276.9 96.9 L275.9 95.9 L274.8 94.8 L273.7 93.7 L272.5 92.5 L271.2 91.2 L270.0 90.0 L268.7 88.7 L267.4 87.4 L266.0 86.0 L264.6 84.6 L263.2 83.2 L261.8 81.8 L260.4 80.4 L258.9 78.9 L257.5 77.5 L256.1 76.1 L254.6 74.6 L253.2 73.2 L251.8 71.8 L250.4 70.4 L249.0 69.0 L247.6 67.6 L246.3 66.3 L245.0 65.0 L243.8 63.8 L242.5 62.5 L241.3 61.3 L240.2 60.2 L239.1 59.1 L238.1 58.1 L237.1 57.1 L236.1 56.1 L235.3 55.3 L234.4 54.4 L233.7 53.7 L233.0 53.0 L232.4 52.4 L231.8 51.8 L231.3 51.3 L230.9 50.9 L230.6 50.6 L230.3 50.3 L230.2 50.2 L230.0 50.0 L230.0 50.0 L230.0 50.0 L229.8 50.2 L229.7 50.3 L229.4 50.6 L229.1 50.9 L228.7 51.3 L228.2 51.8 L227.6 52.4 L227.0 53.0 L226.3 53.7 L225.6 54.4 L224.7 55.3 L223.9 56.1 L222.9 57.1 L221.9 58.1 L220.9 59.1 L219.8 60.2 L218.7 61.3 L217.5 62.5 L216.2 63.7 L215.0 65.0 L213.7 66.3 L212.4 67.6 L211.0 69.0 L209.6 70.4 L208.2 71.8 L206.8 73.2 L205.4 74.6 L203.9 76.1 L202.5 77.5 L201.1 78.9 L199.6 80.4 L198.2 81.8 L196.8 83.2 L195.4 84.6 L194.0 86.0 L192.6 87.4 L191.3 88.7 L190.0 90.0 L188.8 91.2 L187.5 92.5 L186.3 93.7 L185.2 94.8 L184.1 95.9 L183.1 96.9 L182.1 97.9 L181.1 98.9 L180.3 99.7 L179.4 100.6 L178.7 101.3 L178.0 102.0 L177.4 102.6 L176.8 103.2 L176.3 103.7 L175.9 104.1 L175.6 104.4 L175.3 104.7 L175.2 104.8 L175.0 105.0 L175.0 105.0 L175.0 105.0 L175.2 105.2 L175.3 105.3 L175.6 105.6 L175.9 105.9 L176.3 106.3 L176.8 106.8 L177.4 107.4 L178.0 108.0 L178.7 108.7 L179.4 109.4 L180.3 110.3 L181.1 111.1 L182.1 112.1 L183.1 113.1 L184.1 114.1 L185.2 115.2 L186.3 116.3 L187.5 117.5 L188.7 118.7 L190.0 120.0 L191.3 121.3 L192.6 122.6 L194.0 124.0 L195.4 125.4 L196.8 126.8 L198.2 128.2 L199.6 129.6 L201.1 131.1 L202.5 132.5 L203.9 133.9 L205.4 135.4 L206.8 136.8 L208.2 138.2 L209.6 139.6 L211.0 141.0 L212.4 142.4 L213.7 143.7 L215.0 145.0 L216.2 146.2 L217.5 147.5 L218.7 148.7 L219.8 149.8 L220.9 150.9 L221.9 151.9 L222.9 152.9 L223.9 153.9 L224.7 154.7 L225.6 155.6 L226.3 156.3 L227.0 157.0 L227.6 157.6 L228.2 158.2 L228.7 158.7 L229.1 159.1 L229.4 159.4 L229.7 159.7 L229.8 159.8 L230.0 160.0 L230.0 160.0 L230.0 160.0 L230.2 159.8 L230.3 159.7 L230.6 159.4 L230.9 159.1 L231.3 158.7 L231.8 158.2 L232.4 157.6 L233.0 157.0 L233.7 156.3 L234.4 155.6 L235.3 154.7 L236.1 153.9 L237.1 152.9 L238.1 151.9 L239.1 150.9 L240.2 149.8 L241.3 148.7 L242.5 147.5 L243.8 146.2 L245.0 145.0 L246.3 143.7 L247.6 142.4 L249.0 141.0 L250.4 139.6 L251.8 138.2 L253.2 136.8 L254.6 135.4 L256.1 133.9 L257.5 132.5 L258.9 131.1 L260.4 129.6 L261.8 128.2 L263.2 126.8 L264.6 125.4 L266.0 124.0 L267.4 122.6 L268.7 121.3 L270.0 120.0 L271.2 118.7 L272.5 117.5 L273.7 116.3 L274.8 115.2 L275.9 114.1 L276.9 113.1 L277.9 112.1 L278.9 111.1 L279.7 110.3 L280.6 109.4 L281.3 108.7 L282.0 108.0 L282.6 107.4 L283.2 106.8 L283.7 106.3 L284.1 105.9 L284.4 105.6 L284.7 105.3 L284.8 105.2 L285.0 105.0 L285.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="230" cy="105" r="3.5" fill="#111111"/><text x="230" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 1, манхэттенское</text><line x1="314" y1="105" x2="446" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="380" y1="39" x2="380" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M435.0 105.0 L435.0 103.6 L434.9 102.1 L434.8 100.7 L434.7 99.3 L434.5 97.8 L434.3 96.4 L434.1 95.0 L433.8 93.6 L433.5 92.2 L433.1 90.8 L432.7 89.4 L432.3 88.0 L431.8 86.6 L431.3 85.3 L430.8 84.0 L430.2 82.6 L429.6 81.3 L429.0 80.0 L428.3 78.8 L427.6 77.5 L426.9 76.3 L426.1 75.0 L425.3 73.8 L424.5 72.7 L423.6 71.5 L422.7 70.4 L421.8 69.3 L420.9 68.2 L419.9 67.1 L418.9 66.1 L417.9 65.1 L416.8 64.1 L415.7 63.2 L414.6 62.3 L413.5 61.4 L412.3 60.5 L411.2 59.7 L410.0 58.9 L408.7 58.1 L407.5 57.4 L406.2 56.7 L405.0 56.0 L403.7 55.4 L402.4 54.8 L401.0 54.2 L399.7 53.7 L398.4 53.2 L397.0 52.7 L395.6 52.3 L394.2 51.9 L392.8 51.5 L391.4 51.2 L390.0 50.9 L388.6 50.7 L387.2 50.5 L385.7 50.3 L384.3 50.2 L382.9 50.1 L381.4 50.0 L380.0 50.0 L378.6 50.0 L377.1 50.1 L375.7 50.2 L374.3 50.3 L372.8 50.5 L371.4 50.7 L370.0 50.9 L368.6 51.2 L367.2 51.5 L365.8 51.9 L364.4 52.3 L363.0 52.7 L361.6 53.2 L360.3 53.7 L359.0 54.2 L357.6 54.8 L356.3 55.4 L355.0 56.0 L353.8 56.7 L352.5 57.4 L351.3 58.1 L350.0 58.9 L348.8 59.7 L347.7 60.5 L346.5 61.4 L345.4 62.3 L344.3 63.2 L343.2 64.1 L342.1 65.1 L341.1 66.1 L340.1 67.1 L339.1 68.2 L338.2 69.3 L337.3 70.4 L336.4 71.5 L335.5 72.7 L334.7 73.8 L333.9 75.0 L333.1 76.3 L332.4 77.5 L331.7 78.8 L331.0 80.0 L330.4 81.3 L329.8 82.6 L329.2 84.0 L328.7 85.3 L328.2 86.6 L327.7 88.0 L327.3 89.4 L326.9 90.8 L326.5 92.2 L326.2 93.6 L325.9 95.0 L325.7 96.4 L325.5 97.8 L325.3 99.3 L325.2 100.7 L325.1 102.1 L325.0 103.6 L325.0 105.0 L325.0 106.4 L325.1 107.9 L325.2 109.3 L325.3 110.7 L325.5 112.2 L325.7 113.6 L325.9 115.0 L326.2 116.4 L326.5 117.8 L326.9 119.2 L327.3 120.6 L327.7 122.0 L328.2 123.4 L328.7 124.7 L329.2 126.0 L329.8 127.4 L330.4 128.7 L331.0 130.0 L331.7 131.2 L332.4 132.5 L333.1 133.7 L333.9 135.0 L334.7 136.2 L335.5 137.3 L336.4 138.5 L337.3 139.6 L338.2 140.7 L339.1 141.8 L340.1 142.9 L341.1 143.9 L342.1 144.9 L343.2 145.9 L344.3 146.8 L345.4 147.7 L346.5 148.6 L347.7 149.5 L348.8 150.3 L350.0 151.1 L351.3 151.9 L352.5 152.6 L353.8 153.3 L355.0 154.0 L356.3 154.6 L357.6 155.2 L359.0 155.8 L360.3 156.3 L361.6 156.8 L363.0 157.3 L364.4 157.7 L365.8 158.1 L367.2 158.5 L368.6 158.8 L370.0 159.1 L371.4 159.3 L372.8 159.5 L374.3 159.7 L375.7 159.8 L377.1 159.9 L378.6 160.0 L380.0 160.0 L381.4 160.0 L382.9 159.9 L384.3 159.8 L385.7 159.7 L387.2 159.5 L388.6 159.3 L390.0 159.1 L391.4 158.8 L392.8 158.5 L394.2 158.1 L395.6 157.7 L397.0 157.3 L398.4 156.8 L399.7 156.3 L401.0 155.8 L402.4 155.2 L403.7 154.6 L405.0 154.0 L406.2 153.3 L407.5 152.6 L408.7 151.9 L410.0 151.1 L411.2 150.3 L412.3 149.5 L413.5 148.6 L414.6 147.7 L415.7 146.8 L416.8 145.9 L417.9 144.9 L418.9 143.9 L419.9 142.9 L420.9 141.8 L421.8 140.7 L422.7 139.6 L423.6 138.5 L424.5 137.3 L425.3 136.2 L426.1 135.0 L426.9 133.7 L427.6 132.5 L428.3 131.2 L429.0 130.0 L429.6 128.7 L430.2 127.4 L430.8 126.0 L431.3 124.7 L431.8 123.4 L432.3 122.0 L432.7 120.6 L433.1 119.2 L433.5 117.8 L433.8 116.4 L434.1 115.0 L434.3 113.6 L434.5 112.2 L434.7 110.7 L434.8 109.3 L434.9 107.9 L435.0 106.4 L435.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="380" cy="105" r="3.5" fill="#111111"/><text x="380" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 2, евклидово</text><line x1="464" y1="105" x2="596" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="530" y1="39" x2="530" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M585.0 105.0 L585.0 96.1 L585.0 92.4 L584.9 89.6 L584.8 87.2 L584.8 85.1 L584.7 83.2 L584.5 81.5 L584.4 79.9 L584.2 78.4 L584.1 77.0 L583.9 75.7 L583.6 74.4 L583.4 73.2 L583.1 72.1 L582.9 71.0 L582.6 69.9 L582.3 68.9 L581.9 67.9 L581.6 67.0 L581.2 66.1 L580.8 65.2 L580.4 64.4 L579.9 63.6 L579.5 62.8 L579.0 62.1 L578.5 61.4 L578.0 60.7 L577.4 60.0 L576.8 59.4 L576.2 58.8 L575.6 58.2 L575.0 57.6 L574.3 57.0 L573.6 56.5 L572.9 56.0 L572.2 55.5 L571.4 55.1 L570.6 54.6 L569.8 54.2 L568.9 53.8 L568.0 53.4 L567.1 53.1 L566.1 52.7 L565.1 52.4 L564.0 52.1 L562.9 51.9 L561.8 51.6 L560.6 51.4 L559.3 51.1 L558.0 50.9 L556.6 50.8 L555.1 50.6 L553.5 50.5 L551.8 50.3 L549.9 50.2 L547.8 50.2 L545.4 50.1 L542.6 50.0 L538.9 50.0 L530.0 50.0 L521.1 50.0 L517.4 50.0 L514.6 50.1 L512.2 50.2 L510.1 50.2 L508.2 50.3 L506.5 50.5 L504.9 50.6 L503.4 50.8 L502.0 50.9 L500.7 51.1 L499.4 51.4 L498.2 51.6 L497.1 51.9 L496.0 52.1 L494.9 52.4 L493.9 52.7 L492.9 53.1 L492.0 53.4 L491.1 53.8 L490.2 54.2 L489.4 54.6 L488.6 55.1 L487.8 55.5 L487.1 56.0 L486.4 56.5 L485.7 57.0 L485.0 57.6 L484.4 58.2 L483.8 58.8 L483.2 59.4 L482.6 60.0 L482.0 60.7 L481.5 61.4 L481.0 62.1 L480.5 62.8 L480.1 63.6 L479.6 64.4 L479.2 65.2 L478.8 66.1 L478.4 67.0 L478.1 67.9 L477.7 68.9 L477.4 69.9 L477.1 71.0 L476.9 72.1 L476.6 73.2 L476.4 74.4 L476.1 75.7 L475.9 77.0 L475.8 78.4 L475.6 79.9 L475.5 81.5 L475.3 83.2 L475.2 85.1 L475.2 87.2 L475.1 89.6 L475.0 92.4 L475.0 96.1 L475.0 105.0 L475.0 113.9 L475.0 117.6 L475.1 120.4 L475.2 122.8 L475.2 124.9 L475.3 126.8 L475.5 128.5 L475.6 130.1 L475.8 131.6 L475.9 133.0 L476.1 134.3 L476.4 135.6 L476.6 136.8 L476.9 137.9 L477.1 139.0 L477.4 140.1 L477.7 141.1 L478.1 142.1 L478.4 143.0 L478.8 143.9 L479.2 144.8 L479.6 145.6 L480.1 146.4 L480.5 147.2 L481.0 147.9 L481.5 148.6 L482.0 149.3 L482.6 150.0 L483.2 150.6 L483.8 151.2 L484.4 151.8 L485.0 152.4 L485.7 153.0 L486.4 153.5 L487.1 154.0 L487.8 154.5 L488.6 154.9 L489.4 155.4 L490.2 155.8 L491.1 156.2 L492.0 156.6 L492.9 156.9 L493.9 157.3 L494.9 157.6 L496.0 157.9 L497.1 158.1 L498.2 158.4 L499.4 158.6 L500.7 158.9 L502.0 159.1 L503.4 159.2 L504.9 159.4 L506.5 159.5 L508.2 159.7 L510.1 159.8 L512.2 159.8 L514.6 159.9 L517.4 160.0 L521.1 160.0 L530.0 160.0 L538.9 160.0 L542.6 160.0 L545.4 159.9 L547.8 159.8 L549.9 159.8 L551.8 159.7 L553.5 159.5 L555.1 159.4 L556.6 159.2 L558.0 159.1 L559.3 158.9 L560.6 158.6 L561.8 158.4 L562.9 158.1 L564.0 157.9 L565.1 157.6 L566.1 157.3 L567.1 156.9 L568.0 156.6 L568.9 156.2 L569.8 155.8 L570.6 155.4 L571.4 154.9 L572.2 154.5 L572.9 154.0 L573.6 153.5 L574.3 153.0 L575.0 152.4 L575.6 151.8 L576.2 151.2 L576.8 150.6 L577.4 150.0 L578.0 149.3 L578.5 148.6 L579.0 147.9 L579.5 147.2 L579.9 146.4 L580.4 145.6 L580.8 144.8 L581.2 143.9 L581.6 143.0 L581.9 142.1 L582.3 141.1 L582.6 140.1 L582.9 139.0 L583.1 137.9 L583.4 136.8 L583.6 135.6 L583.9 134.3 L584.1 133.0 L584.2 131.6 L584.4 130.1 L584.5 128.5 L584.7 126.8 L584.8 124.9 L584.8 122.8 L584.9 120.4 L585.0 117.6 L585.0 113.9 L585.0 105.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="530" cy="105" r="3.5" fill="#111111"/><text x="530" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = 4</text><line x1="614" y1="105" x2="746" y2="105" stroke="#E5E1D6" stroke-width="1"/><line x1="680" y1="39" x2="680" y2="171" stroke="#E5E1D6" stroke-width="1"/><path d="M625.0 50.0 L735.0 50.0 L735.0 160.0 L625.0 160.0 Z" fill="#DCE8F5" fill-opacity="0.7" stroke="#3576C0" stroke-width="2.4"/><circle cx="680" cy="105" r="3.5" fill="#111111"/><text x="680" y="200" font-size="12.5" fill="#111111" text-anchor="middle" font-weight="700">p = ∞, Чебышёва</text><text x="380" y="224" font-size="12" fill="#5E5850" text-anchor="middle" font-weight="400">Точки на расстоянии 1 от центра для разных p</text></svg></div>


<p>
  При <span class="math-inline" data-tex="p = 1"></span> шар — ромб, при <span class="math-inline" data-tex="p = 2"></span> круг, при <span class="math-inline" data-tex="p = \infty"></span> квадрат. При <span class="math-inline" data-tex="p &lt; 1"></span> шар становится вогнутым,
  и неравенство треугольника нарушается: для <span class="math-inline" data-tex="p = 0{,}5"></span> расстояние от <span class="math-inline" data-tex="(0, 0)"></span> до <span class="math-inline" data-tex="(1, 1)"></span> равно
  <span class="math-inline" data-tex="(1 + 1)^2 = 4"></span>, а путь через <span class="math-inline" data-tex="(1, 0)"></span> — <span class="math-inline" data-tex="1 + 1 = 2"></span>. Поэтому метрикой Минковского считают только <span class="math-inline" data-tex="p \ge 1"></span>.
</p>

<p>
  Как меняются соседи А и Б, в числах:
</p>


<div class="dt-table"><table class="shape-table">
  <tr><th></th><th>p = 1 (манхэттенское)</th><th>p = 2 (евклидово)</th><th>p = ∞ (Чебышёва)</th></tr>
  <tr><td>А: три ближайших</td><td>4 (3), 7 (4), 6 (5)</td><td>4 (3), 7 (3,16), 6 (4,12)</td><td>4 (3), 7 (3), 6 (4)</td></tr>
  <tr><td>А: ответ при k = 3</td><td>сдаст</td><td>сдаст</td><td>сдаст</td></tr>
  <tr><td>Б: три ближайших</td><td>8 (2), 6 (5), 5 или 7 (6)</td><td>8 (1,41), 6 (3,61), 9 (5)</td><td>8 (1), 6 (3), 9 (4)</td></tr>
  <tr><td>Б: ответ при k = 3</td><td>зависит от ничьей</td><td>сдаст</td><td>сдаст</td></tr>
</table></div>


<p>
  У А все три меры выбирают тех же соседей, только по Чебышёву студенты 4 и 7 оказываются на одинаковом расстоянии:
  для этой меры разница в один пропуск не значит ничего, пока разница в часах больше. У Б по Манхэттену третье место
  делят студенты 5 и 7, оба на расстоянии 6, и ответ зависит от того, кто попадёт в тройку. В интерактиве шар
  проходит через k-го соседа; переключайте p и смотрите, как меняется фон с ответами.
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
  Манхэттенское расстояние меньше реагирует на одну большую разницу: она входит в сумму как есть, а не в квадрате.
  Его берут, когда признаков много и отдельные из них могут сильно расходиться. Расстояние Чебышёва нужно там, где
  важен худший признак, например при проверке, что все размеры детали в пределах допуска. Евклидово — разумный
  выбор по умолчанию.
</p>


## Часть 3. Масштаб и корреляция: расстояние Махаланобиса

<p>
  В статье про kNN признаки стандартизовали: делили на стандартное отклонение, чтобы часы и пропуски весили одинаково.
  Но признаки бывают ещё и связаны между собой. Если два признака почти дублируют друг друга, евклидово расстояние
  учитывает одну и ту же информацию дважды.
</p>

<p>
  Расстояние Махаланобиса учитывает и масштаб, и связь признаков через ковариационную матрицу <span class="math-inline" data-tex="\Sigma"></span>:
</p>

<div class="math-display" data-tex="d_M(x, y) = \sqrt{(x - y)^\top \Sigma^{-1} (x - y)}"></div>

<p>
  Если <span class="math-inline" data-tex="\Sigma"></span> — единичная матрица, это обычное евклидово расстояние. Если <span class="math-inline" data-tex="\Sigma"></span> диагональная, это евклидово
  расстояние после стандартизации. У наших десяти студентов корреляция часов и пропусков всего <span class="math-inline" data-tex="-0{,}07"></span>, поэтому
  Махаланобис почти совпадает со стандартизацией: ближайшие к А студенты 4, 7 и 9, как в части 4 статьи про kNN.
</p>

<p>
  Разница видна, когда признаки сильно связаны. Возьмём 160 синтетических студентов с двумя признаками: часы
  подготовки и решённые задачи, корреляция <span class="math-inline" data-tex="0{,}94"></span>. После стандартизации формула для двух признаков с корреляцией
  <span class="math-inline" data-tex="\rho"></span> становится такой:
</p>

<div class="math-display" data-tex="d_M^2 = \frac{z_1^2 - 2\rho z_1 z_2 + z_2^2}{1 - \rho^2}"></div>


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
  Студенты P (19 часов, 59 задач) и Q (19 часов, 9 задач) после стандартизации одинаково далеки от центра: <span class="math-inline" data-tex="2{,}83"></span>.
  Но P идёт вдоль облака: много готовился и много решил, такие студенты есть. Q много готовился и почти ничего
  не решил, таких в данных нет. По Махаланобису P на расстоянии <span class="math-inline" data-tex="2{,}03"></span>, и дальше него от центра 21 студент из 160.
  Q на расстоянии <span class="math-inline" data-tex="11{,}55"></span>, а у самого необычного студента облака всего <span class="math-inline" data-tex="3{,}37"></span>.
</p>

<p>
  Поэтому Махаланобис используют для поиска аномалий: точка с большим расстоянием до центра данных выбивается из их
  формы, даже если по каждому признаку отдельно она обычная. Чтобы оценить <span class="math-inline" data-tex="\Sigma"></span>, нужно заметно больше объектов,
  чем признаков; при малой выборке матрица получается неустойчивой.
</p>


## Часть 4. Косинусная мера

<p>
  Пусть студенты описаны тем, как они распределили время: часы на теорию и часы на задачи. Студент X: 2 часа
  теории и 6 часов задач. Студент Y занимался вдвое дольше в тех же пропорциях: 4 и 12. Студент Z потратил столько же,
  сколько X, но наоборот: 6 и 2.
</p>

<p>
  По Евклиду X ближе к Z (5,66), чем к Y (6,32). Но по стилю подготовки X и Y одинаковы, а Z другой. Косинусная мера
  смотрит на угол между векторами и не замечает их длину:
</p>

<div class="math-display" data-tex="\cos\theta = \frac{x \cdot y}{\|x\|\,\|y\|} = \frac{\sum_j x_j y_j}{\sqrt{\sum_j x_j^2}\,\sqrt{\sum_j y_j^2}}"></div>

<p>
  У X и Y косинус равен 1: векторы смотрят в одну сторону. У X и Z — <span class="math-inline" data-tex="(12 + 12)/(\sqrt{40} \cdot \sqrt{40}) = 0{,}6"></span>,
  угол 53°.
</p>


<div class="dt-live" id="cosLive">
  <div class="dt-live-head"><strong>Интерактив: угол между векторами и расстояние между концами</strong>
    <p>Два студента описаны часами на теорию и на задачи. Перетащите конец любого вектора. Косинус меряет угол между стрелками, евклидово расстояние — красный пунктир между их концами.</p></div>
  <div class="thr-fig"><svg id="cosSvg" viewBox="0 0 620 360" role="img" aria-label="Два вектора, угол и расстояние" style="touch-action: pan-y; cursor: move; user-select: none; -webkit-user-select: none"></svg></div>
  <div class="thr-panel">
    <div class="dt-controls">
      <div class="dt-presets"><button type="button" data-pair="X,Y">X и Y: те же пропорции</button><button type="button" data-pair="X,Z">X и Z: та же сумма часов</button></div>
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
  var u = P.X.slice(), v = P.Y.slice(), nu = 'X', nv = 'Y', drag = null;
  var OX0 = 60, OY0 = 320, S = 21;
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
    for (var i = 0; i <= 14; i += 2) {
      svg.appendChild(el('line', {x1: sx(i), y1: sy(0), x2: sx(i), y2: sy(14), stroke: i ? '#F1EEE6' : '#5E5850'}));
      svg.appendChild(el('line', {x1: sx(0), y1: sy(i), x2: sx(26), y2: sy(i), stroke: i ? '#F1EEE6' : '#5E5850'}));
      svg.appendChild(el('text', {x: sx(i), y: sy(0) + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(i)));
      svg.appendChild(el('text', {x: sx(0) - 7, y: sy(i) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5E5850'}, String(i)));
    }
    for (var j = 16; j <= 26; j += 2) svg.appendChild(el('text', {x: sx(j), y: sy(0) + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#5E5850'}, String(j)));
    svg.appendChild(el('text', {x: sx(26), y: sy(0) + 32, 'text-anchor': 'end', 'font-size': 12, fill: '#5E5850'}, 'часы на теорию'));
    svg.appendChild(el('text', {x: sx(0), y: sy(14) - 8, 'font-size': 12, fill: '#5E5850'}, 'часы на задачи'));
    var a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(v[1], v[0]), R = 46;
    var lo = Math.min(a1, a2), hi = Math.max(a1, a2);
    svg.appendChild(el('path', {d: 'M' + (sx(0) + R * Math.cos(lo)) + ' ' + (sy(0) - R * Math.sin(lo)) + ' A ' + R + ' ' + R + ' 0 0 0 ' + (sx(0) + R * Math.cos(hi)) + ' ' + (sy(0) - R * Math.sin(hi)),
                                fill: 'none', stroke: '#C29E08', 'stroke-width': 2.6}));
    svg.appendChild(el('line', {x1: sx(u[0]), y1: sy(u[1]), x2: sx(v[0]), y2: sy(v[1]), stroke: '#C30B0A', 'stroke-width': 2.2, 'stroke-dasharray': '5 4'}));
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
    var p = pos(ev); p = [Math.max(0, Math.min(26, Math.round(p[0] * 2) / 2)), Math.max(0, Math.min(14, Math.round(p[1] * 2) / 2))];
    if (drag === 'u') u = p; else v = p; update();
  }
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', function () { drag = null; });
  svg.addEventListener('pointercancel', function () { drag = null; });
  document.querySelectorAll('#cosLive [data-pair]').forEach(function (b) { b.addEventListener('click', function () {
    var pr = b.getAttribute('data-pair').split(','); nu = pr[0]; nv = pr[1]; u = P[nu].slice(); v = P[nv].slice(); update(); }); });
  update();
})();
</script>


<p>
  Для векторов единичной длины косинус и евклидово расстояние связаны напрямую: <span class="math-inline" data-tex="\|u - v\|^2 = 2 - 2\cos\theta"></span>.
  Поэтому часто векторы сначала нормируют на длину 1 и дальше пользуются обычным евклидовым расстоянием или скалярным
  произведением. Так ищут похожие тексты: документ описывают вектором частот слов или эмбеддингом, и длинная статья
  на ту же тему, что и короткая заметка, оказывается рядом с ней по косинусу, хотя по Евклиду далеко.
</p>

<p>
  Косинус подходит не везде. Применим его к студенту Б на плоскости часов и пропусков. Ближайшими по углу окажутся
  студенты 6, 8 и 3: у студента 3 соотношение пропусков к часам похоже на Б, хотя часов у него 6 против 15.
  Двое из трёх не сдали, и ответ — «не сдаст». Для часов и пропусков важна сама величина, а не пропорция, и косинус
  здесь отбрасывает главное.
</p>

<p>
  Косинусное расстояние <span class="math-inline" data-tex="1 - \cos\theta"></span> не является метрикой: неравенство треугольника для него может нарушаться.
  Метрикой является сам угол <span class="math-inline" data-tex="\theta"></span>.
</p>


## Часть 5. Признаки «да или нет»: Хэмминг и Жаккар

<p>
  Когда объект описан набором признаков «есть или нет», расстояния между числами не нужны. Достаточно сравнить
  совпадения.
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


<p>
  Какую из двух мер брать, зависит от смысла нулей. Если «нет» так же информативно, как «да» (два кода одной длины,
  ответы «верно/неверно» на одни и те же вопросы), подходит Хэмминг. Если «нет» означает просто отсутствие
  (лекции, товары в корзине, слова в тексте), то общих нулей всегда много и они только мешают: две корзины из
  тысячи возможных товаров совпадают почти во всех позициях, ведь обе не содержат почти ничего. Тогда берут Жаккара.
</p>


## Часть 6. Строки: расстояние Левенштейна

<p>
  Для строк естественная мера — сколько правок нужно, чтобы превратить одну в другую. Правка — вставка, удаление
  или замена одной буквы. Расстояние Левенштейна — наименьшее число таких правок. «Экзамен» и «экзамены»: одна вставка,
  расстояние 1. «Кошка» и «окошко»: вставить «о» в начало и заменить «а» на «о» — расстояние 2.
</p>

<p>
  Считают его таблицей. Клетка <span class="math-inline" data-tex="(i, j)"></span> хранит расстояние между первыми <span class="math-inline" data-tex="i"></span> буквами одного слова и первыми <span class="math-inline" data-tex="j"></span>
  буквами другого. Первая строка и первый столбец — это вставки и удаления от пустой строки, остальные клетки
  заполняются по правилу
</p>

<div class="math-display" data-tex="D_{i,j} = \min\big(D_{i-1,j} + 1,\; D_{i,j-1} + 1,\; D_{i-1,j-1} + [s_i \ne t_j]\big)"></div>

<p>
  Три варианта — удалить букву, вставить букву или заменить (бесплатно, если буквы совпали). Ответ в правом нижнем
  углу. Жёлтые клетки — путь, который даёт ответ: вставка «о», четыре совпадения, замена «а» на «о».
</p>


<div class="cm-fig"><svg viewBox="0 0 520 380" role="img" aria-label="Таблица расстояния Левенштейна для слов кошка и окошко"><rect x="0" y="0" width="520" height="380" rx="0" fill="#FFFFFF" stroke="none" stroke-width="0"/><text x="143" y="56" font-size="17" fill="#5E5850" text-anchor="middle" font-weight="700">∅</text><text x="189" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">о</text><text x="235" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">к</text><text x="281" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">о</text><text x="327" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">ш</text><text x="373" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">к</text><text x="419" y="56" font-size="17" fill="#2A5E9B" text-anchor="middle" font-weight="700">о</text><text x="104" y="99" font-size="17" fill="#5E5850" text-anchor="end" font-weight="700">∅</text><text x="104" y="145" font-size="17" fill="#5F9420" text-anchor="end" font-weight="700">к</text><text x="104" y="191" font-size="17" fill="#5F9420" text-anchor="end" font-weight="700">о</text><text x="104" y="237" font-size="17" fill="#5F9420" text-anchor="end" font-weight="700">ш</text><text x="104" y="283" font-size="17" fill="#5F9420" text-anchor="end" font-weight="700">к</text><text x="104" y="329" font-size="17" fill="#5F9420" text-anchor="end" font-weight="700">а</text><rect x="120" y="70" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="141.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">0</text><rect x="166" y="70" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="187.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">1</text><rect x="212" y="70" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="233.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="258" y="70" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="279.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="304" y="70" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="325.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">4</text><rect x="350" y="70" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="371.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">5</text><rect x="396" y="70" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="417.5" y="97.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">6</text><rect x="120" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="141.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">1</text><rect x="166" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="187.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">1</text><rect x="212" y="116" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="233.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">1</text><rect x="258" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="279.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="304" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="325.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="350" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="371.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">4</text><rect x="396" y="116" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="417.5" y="143.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">5</text><rect x="120" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="141.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="166" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="187.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">1</text><rect x="212" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="233.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="258" y="162" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="279.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">1</text><rect x="304" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="325.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="350" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="371.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="396" y="162" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="417.5" y="189.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">4</text><rect x="120" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="141.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="166" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="187.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="212" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="233.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="258" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="279.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="304" y="208" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="325.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">1</text><rect x="350" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="371.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="396" y="208" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="417.5" y="235.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="120" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="141.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">4</text><rect x="166" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="187.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="212" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="233.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="258" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="279.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="304" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="325.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="350" y="254" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="371.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">1</text><rect x="396" y="254" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="417.5" y="281.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="120" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="141.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">5</text><rect x="166" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="187.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">4</text><rect x="212" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="233.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="258" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="279.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="304" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="325.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">3</text><rect x="350" y="300" width="43" height="43" rx="5" fill="#FFFFFF" stroke="#D8D4C8" stroke-width="1"/><text x="371.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="400">2</text><rect x="396" y="300" width="43" height="43" rx="5" fill="#FFF4CC" stroke="#C29E08" stroke-width="2"/><text x="417.5" y="327.5" font-size="16" fill="#111111" text-anchor="middle" font-weight="700">2</text><text x="439" y="372" font-size="15" fill="#8F7406" text-anchor="end" font-weight="700">расстояние = 2</text></svg></div>


<p>
  Таблица размером <span class="math-inline" data-tex="m \times n"></span>, поэтому подсчёт занимает <span class="math-inline" data-tex="m \cdot n"></span> шагов. Расстояние Левенштейна используют для
  исправления опечаток, нечёткого поиска («экзмен» находит «экзамен») и сравнения последовательностей ДНК. Расстояние
  Хэмминга — его частный случай для строк одной длины, где разрешены только замены.
</p>


## Часть 7. Как выбрать меру


<div class="dt-table"><table class="shape-table">
  <tr><th>Данные</th><th>Мера</th><th>Почему</th></tr>
  <tr><td>числа в одних единицах, признаков немного</td><td>евклидово</td><td>обычное расстояние, работает по умолчанию</td></tr>
  <tr><td>числа, бывают большие расхождения по одному признаку</td><td>манхэттенское</td><td>не возводит разницы в квадрат</td></tr>
  <tr><td>важна худшая разница по любому признаку</td><td>Чебышёва</td><td>берёт максимум по признакам</td></tr>
  <tr><td>числа в разных единицах</td><td>евклидово после стандартизации</td><td>уравнивает вклад признаков</td></tr>
  <tr><td>коррелированные признаки, поиск аномалий</td><td>Махаланобиса</td><td>учитывает форму облака данных</td></tr>
  <tr><td>тексты, эмбеддинги, профили, где важна пропорция</td><td>косинусная</td><td>не зависит от длины вектора</td></tr>
  <tr><td>признаки «да или нет», общие нули ничего не значат</td><td>Жаккара</td><td>смотрит только на то, что есть</td></tr>
  <tr><td>двоичные коды одной длины</td><td>Хэмминга</td><td>считает несовпадающие позиции</td></tr>
  <tr><td>строки с опечатками</td><td>Левенштейна</td><td>считает правки</td></tr>
</table></div>


<p>
  Мера близости — часть модели, как k в kNN или глубина дерева. Если неясно, какая лучше, её подбирают так же:
  кросс-валидацией, перебирая <code>metric</code> в <code>GridSearchCV</code>.
</p>


## Часть 8. Код

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


## Часть 9. Что получилось

### Что важно уметь восстановить по памяти

<ul>
  <li>Метрика: <span class="math-inline" data-tex="d \ge 0"></span>, ноль только у совпадающих, симметрия, неравенство треугольника. Квадрат евклидова
    расстояния и косинусное расстояние метриками не являются.</li>
  <li>Минковский: <span class="math-inline" data-tex="\big(\sum |x_j - y_j|^p\big)^{1/p}"></span>; <span class="math-inline" data-tex="p = 1"></span> — ромб, <span class="math-inline" data-tex="p = 2"></span> — круг, <span class="math-inline" data-tex="p = \infty"></span> — квадрат и максимум разниц.</li>
  <li>Махаланобис: <span class="math-inline" data-tex="\sqrt{(x - y)^\top \Sigma^{-1}(x - y)}"></span>; учитывает масштаб и корреляцию, при диагональной <span class="math-inline" data-tex="\Sigma"></span> — стандартизация.</li>
  <li>Косинус: угол между векторами, длина не важна; для единичных векторов <span class="math-inline" data-tex="\|u - v\|^2 = 2 - 2\cos\theta"></span>.</li>
  <li>Хэмминг считает все несовпадения, Жаккар <span class="math-inline" data-tex="|A \cap B| / |A \cup B|"></span> не учитывает общие нули.</li>
  <li>Левенштейн: наименьшее число вставок, удалений и замен; таблица <span class="math-inline" data-tex="m \times n"></span>.</li>
  <li>Мера — часть модели: от неё зависят соседи и ответ, её выбирают по смыслу данных или кросс-валидацией.</li>
</ul>

<p class="tiny">
  Источники: P. C. Mahalanobis, «On the generalised distance in statistics», 1936; P. Jaccard, «Étude comparative de la
  distribution florale dans une portion des Alpes et du Jura», 1901; R. Hamming, «Error detecting and error correcting
  codes», 1950; В. И. Левенштейн, «Двоичные коды с исправлением выпадений, вставок и замещений символов», 1965;
  C. Aggarwal, A. Hinneburg, D. Keim, «On the Surprising Behavior of Distance Metrics in High Dimensional Space», 2001;
  документация SciPy, модуль <code>scipy.spatial.distance</code>.
</p>

