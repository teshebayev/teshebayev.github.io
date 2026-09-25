<style>
  .prose .stage-notes { min-height: 150px; }
  .prose .stage-progress { visibility: hidden; }
  .stage-figure .katex svg { height: inherit; min-width: 0; }
</style>

<style>
  .console {
    background: #1D1B17; color: #E8E4DA; border-radius: 12px;
    padding: 15px 18px; margin: 22px 0; overflow-x: auto;
    font-family: Menlo, Consolas, "Courier New", monospace;
    font-size: 13.5px; line-height: 1.6; white-space: pre;
  }
</style>

<p class="lead">Полный путь через классический encoder–decoder Transformer: как токены превращаются в векторы, получают позиции, проходят энкодер и несколько видов attention, а затем декодер переводит итоговые векторы в распределение по словарю.</p>

<p>Transformer удобно читать как одну длинную трубу. С самого низа и до самого верха по ней течёт <strong>последовательность векторов одинаковой ширины</strong>: столько же строк, сколько токенов, и ровно <code>d_model</code> чисел в каждой строке. Всё, что делают блоки архитектуры, — это по-разному перемешивают эти строки между собой и пересчитывают числа внутри них, ни разу не меняя саму форму потока.</p>

<p>Именно постоянство формы и позволяет собирать модель из повторяющихся кубиков: слой энкодера можно поставить шесть раз подряд, потому что его выход неотличим по форме от входа. Поэтому в каждой главе полезно задавать себе три одинаковых вопроса: <em>что вошло</em>, <em>что с этим сделали</em> и <em>какой формы вышло</em>. Если на них есть ответ — блок понят, даже если внутри него стоит незнакомая формула.</p>

<p>Сквозной пример один на всю статью: <strong>You are welcome → Добро пожаловать</strong>. Для наглядности считаем слова отдельными токенами; &lt;START&gt; и &lt;END&gt; отмечают начало и конец, PAD используется только в примерах с дополнением длины. Размерности намеренно игрушечные — <code>d_model = 4</code> в большинстве глав и <code>d_model = 8</code> там, где нужно разделить вектор между головами внимания. Это те же формулы, что и в реальной модели, просто числа помещаются на экран целиком.</p>

<table class="shape-table">
  <tr><th>Обозначение</th><th>Что это</th><th>В примерах статьи</th></tr>
  <tr><td><code>B</code></td><td>размер батча — сколько фраз считаем одновременно</td><td>1, в главе про размерности — 5</td></tr>
  <tr><td><code>L</code>, <code>T</code></td><td>длина входной и целевой последовательности в токенах</td><td>3 на входе (4 с PAD), 3 на выходе с &lt;END&gt;</td></tr>
  <tr><td><code>d_model</code></td><td>ширина основного потока, она же длина вектора токена</td><td>4, в главе про multi-head — 8</td></tr>
  <tr><td><code>|V|</code></td><td>размер словаря</td><td>4 слова в главе 10</td></tr>
  <tr><td><code>h</code>, <code>d_k</code></td><td>число голов внимания и ширина одной головы, <code>d_k = d_model / h</code></td><td>2 головы по 4 координаты</td></tr>
</table>

<div class="reading-contract">
  <div class="contract-card"><span>Маршрут</span><strong>Идём снизу вверх по архитектуре</strong><p>От ID и embedding до памяти энкодера, декодера и финального softmax.</p></div>
  <div class="contract-card"><span>Attention</span><strong>Один механизм — три применения</strong><p>Сравниваем источники Q, K, V, multi-head расчёт и ограничения масками.</p></div>
  <div class="contract-card"><span>Формы</span><strong>Следим за размерностями</strong><p>От [B, L] к [B, L, d], затем к выходным logits по целевому словарю.</p></div>
</div>

<div class="semantic-key">
  <span><i class="sk-blue"></i>векторы и основной поток</span>
  <span><i class="sk-yellow"></i>позиция и промежуточные преобразования</span>
  <span><i class="sk-red"></i>attention, связи и маски</span>
  <span><i class="sk-green"></i>результат и выход</span>
</div>

<div class="callout-blue"><strong>Как работать с интерактивами:</strong> в главах первый шаг каждой сцены показывает весь трансформер и подсвечивает блок, о котором идёт речь. Со второго шага схема уходит, и на экране остаётся только сам блок — по одной идее на шаг. Стрелки ← → работают, когда сцена в фокусе.</div>

<h2 id="overview">Обзор. Энкодер, декодер и путь перевода</h2>

<p>Снаружи трансформер для перевода — чёрный ящик: на входе «You are welcome», на выходе «Добро пожаловать». Внутри он разделён на две половины с очень разными ролями. Их полезно понять до всех формул: дальше каждая глава будет разбирать кусок одной из них.</p>

<h3>Что делает энкодер</h3>

<p><strong>Энкодер читает.</strong> Он получает исходную фразу целиком и сразу, без всякого порядка чтения слева направо, и выдаёт по одному вектору на каждый исходный токен. Число векторов не меняется: три токена на входе — три вектора на выходе. Меняется содержание: после энкодера вектор «welcome» знает, что стоит в конструкции «You are welcome», и отличается от вектора того же слова в «a warm welcome». Каждый токен как бы получает примечание о своём контексте.</p>

<p>Для этого энкодер повторяет N одинаковых по устройству слоёв. В каждом слое self-attention даёт токенам посмотреть друг на друга, а Feed Forward пересчитывает каждый вектор по отдельности. Ограничений на связи почти нет: любое слово может смотреть на любое, закрыт только служебный PAD. Результат — <strong>память энкодера</strong> <code>H<sup>N</sup></code>, матрица <code>[L, d]</code>. Энкодер никогда не выдаёт слов: его выход существует только для того, чтобы им пользовался декодер. И считается он один раз на всю фразу, сколько бы токенов ни пришлось потом сгенерировать.</p>

<h3>Что делает декодер</h3>

<p><strong>Декодер пишет.</strong> У него два входа: память энкодера и та часть перевода, которая уже написана — начиная со служебного <code>&lt;START&gt;</code>. На выходе — вектор для каждой позиции, из которого Linear и softmax делают распределение по словарю следующего токена.</p>

<p>Каждый слой декодера задаёт три вопроса подряд. <em>Что я уже сказал?</em> — masked self-attention смотрит на свой префикс, но никогда вперёд. <em>Что было в оригинале?</em> — cross-attention строит запросы из своего состояния, а ключи и значения берёт из памяти энкодера; это единственное место, где встречаются два языка. <em>Как это переработать?</em> — Feed Forward, как и в энкодере. На инференсе декодер работает по кругу: выбранное слово дописывается к его входу, и он запускается снова, пока не выдаст <code>&lt;END&gt;</code>. На обучении правильный перевод подают сразу целиком, сдвинув вправо, и причинная маска не даёт позициям подсмотреть ответ.</p>

<table class="shape-table">
  <tr><th></th><th>Энкодер</th><th>Декодер</th></tr>
  <tr><td>что получает</td><td>исходную фразу целиком</td><td>память энкодера и уже написанный префикс</td></tr>
  <tr><td>на что смотрит</td><td>на все токены оригинала</td><td>на свои прошлые токены и на весь оригинал</td></tr>
  <tr><td>подслоёв в слое</td><td>2: self-attention, Feed Forward</td><td>3: masked self-attention, cross-attention, Feed Forward</td></tr>
  <tr><td>маски</td><td>только PAD</td><td>PAD и причинная (будущее)</td></tr>
  <tr><td>выход</td><td>память <code>H<sup>N</sup></code>, <code>[L, d]</code></td><td><code>[T, d]</code> → Linear → вероятности слов</td></tr>
  <tr><td>сколько раз работает</td><td>один раз на фразу</td><td>на инференсе — один раз на каждый новый токен</td></tr>
</table>

<div class="callout-yellow"><strong>Не единственная схема:</strong> encoder–decoder — классическая форма из статьи «Attention Is All You Need». Модели вроде BERT оставили только стек энкодеров (понимание текста), модели семейства GPT — только декодер без cross-attention (генерация). Разобравшись в полной схеме, обе половинки читаются сами.</div>

<p>Посмотрим, как эти две половины собираются в одну модель.</p>

<div class="stage" id="stageOv" tabindex="0">
  <div class="stage-figure">
<svg id="ov" viewBox="0 0 960 560" role="img" aria-label="Обзор: трансформер снаружи, затем энкодер, память, декодер, выход и генерация">
  <style>
    #ov { font-family: Helvetica, Arial, sans-serif; }
    #ov text { fill: #111111; }
    #ov .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #ov .offt { fill: #A29C92; font-size: 14px; }
    #ov .offs { fill: #A29C92; font-size: 12px; }
    #ov .is-focus .offt, #ov .is-focus .offs { font-weight: 400; }
    #ov .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #ov .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #ov .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #ov .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ov .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #ov .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #ov .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #ov .lbl { font-size: 15px; }
    #ov .lbl-b { font-size: 15px; font-weight: 700; }
    #ov .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #ov .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #ov .cap { font-size: 13px; fill: #5E5850; }
    #ov .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ov .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #ov .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #ov .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ov .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #ov .band-y { fill: #FFF3C4; }
    #ov .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="ov-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="ov-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="ov-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="ov-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#ov-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#ov-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="h_enc" data-only="1">
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="h_mem" data-only="1">
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#ov-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="h_dec" data-only="1">
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#ov-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="h_out" data-only="1">
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#ov-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="bg"/><text x="630.0" y="63.0" class="lbl-b" text-anchor="middle">Linear + Softmax</text>

  </g>
  <g data-key="bb" data-only="1"><rect x="80" y="230" width="220" height="60" rx="10" class="chip"/><text x="190" y="266" class="lbl-b" text-anchor="middle">You are welcome</text><text x="190" y="316" class="cap" text-anchor="middle">3 токена на входе</text><path d="M306 260 H372" class="edge" marker-end="url(#ov-arw)"/><rect x="380" y="190" width="200" height="140" rx="16" fill="#F7F6F2" stroke="#5E5850" stroke-width="2"/><text x="480" y="266" class="lbl-b" text-anchor="middle" style="font-size:18px">Transformer</text><path d="M586 260 H652" class="edge" marker-end="url(#ov-arw)"/><rect x="660" y="230" width="220" height="60" rx="10" class="bg"/><text x="770" y="266" class="lbl-b" text-anchor="middle">Добро пожаловать</text><text x="770" y="316" class="cap" text-anchor="middle">2 токена + &lt;END&gt;: длина своя</text><text x="480" y="420" class="cap" text-anchor="middle">снаружи — обычная seq2seq-модель: последовательность на входе, последовательность на выходе</text></g>
  <g data-key="loop" data-only="1"><text x="80" y="90" class="ttl">генерация: декодер запускается заново после каждого токена</text><text x="80" y="130" class="cap">шаг</text><text x="180" y="130" class="cap">вход декодера</text><text x="620" y="130" class="cap">предсказано</text><text x="80" y="180" class="lbl-b">1</text><rect x="180" y="150" width="130" height="44" rx="8" class="chip"/><text x="245" y="178" class="lbl" text-anchor="middle">&lt;START&gt;</text><path d="M320 172 H612" class="edge" marker-end="url(#ov-arw)"/><rect x="620" y="150" width="200" height="44" rx="8" class="bg"/><text x="720" y="178" class="lbl-b" text-anchor="middle">Добро</text><path d="M720 198 C 720 216, 320 210, 385 228" class="edge-y" marker-end="url(#ov-arwy)"/><text x="80" y="260" class="lbl-b">2</text><rect x="180" y="230" width="130" height="44" rx="8" class="chip"/><text x="245" y="258" class="lbl" text-anchor="middle">&lt;START&gt;</text><rect x="320" y="230" width="130" height="44" rx="8" class="by"/><text x="385" y="258" class="lbl" text-anchor="middle">Добро</text><path d="M460 252 H612" class="edge" marker-end="url(#ov-arw)"/><rect x="620" y="230" width="200" height="44" rx="8" class="bg"/><text x="720" y="258" class="lbl-b" text-anchor="middle">пожаловать</text><path d="M720 278 C 720 296, 460 290, 525 308" class="edge-y" marker-end="url(#ov-arwy)"/><text x="80" y="340" class="lbl-b">3</text><rect x="180" y="310" width="130" height="44" rx="8" class="chip"/><text x="245" y="338" class="lbl" text-anchor="middle">&lt;START&gt;</text><rect x="320" y="310" width="130" height="44" rx="8" class="chip"/><text x="385" y="338" class="lbl" text-anchor="middle">Добро</text><rect x="460" y="310" width="130" height="44" rx="8" class="by"/><text x="525" y="338" class="lbl" text-anchor="middle">пожаловать</text><path d="M600 332 H612" class="edge" marker-end="url(#ov-arw)"/><rect x="620" y="310" width="200" height="44" rx="8" class="bg"/><text x="720" y="338" class="lbl-b" text-anchor="middle">&lt;END&gt; — стоп</text><text x="80" y="420" class="cap">энкодер при этом работает один раз: память Hᴺ посчитана заранее и одна на все шаги</text><text x="80" y="440" class="cap">на обучении все три строки считаются за один проход — это обеспечивают сдвиг и причинная маска</text></g>
  <g data-key="same" data-only="1"><text x="80" y="90" class="ttl">одинаковое устройство — независимые веса</text><rect x="120" y="440" width="260" height="42" rx="8" class="bx"/><text x="250" y="467" class="lbl" text-anchor="middle">Encoder 1 · веса θ₁</text><rect x="560" y="440" width="260" height="42" rx="8" class="bx"/><text x="690" y="467" class="lbl" text-anchor="middle">Decoder 1 · веса φ₁</text><path d="M250 440 V426" class="edge" marker-end="url(#ov-arw)"/><path d="M690 440 V426" class="edge" marker-end="url(#ov-arw)"/><rect x="120" y="382" width="260" height="42" rx="8" class="bx"/><text x="250" y="409" class="lbl" text-anchor="middle">Encoder 2 · веса θ₂</text><rect x="560" y="382" width="260" height="42" rx="8" class="bx"/><text x="690" y="409" class="lbl" text-anchor="middle">Decoder 2 · веса φ₂</text><path d="M250 382 V368" class="edge" marker-end="url(#ov-arw)"/><path d="M690 382 V368" class="edge" marker-end="url(#ov-arw)"/><rect x="120" y="324" width="260" height="42" rx="8" class="bx"/><text x="250" y="351" class="lbl" text-anchor="middle">Encoder 3 · веса θ₃</text><rect x="560" y="324" width="260" height="42" rx="8" class="bx"/><text x="690" y="351" class="lbl" text-anchor="middle">Decoder 3 · веса φ₃</text><path d="M250 324 V310" class="edge" marker-end="url(#ov-arw)"/><path d="M690 324 V310" class="edge" marker-end="url(#ov-arw)"/><rect x="120" y="266" width="260" height="42" rx="8" class="bx"/><text x="250" y="293" class="lbl" text-anchor="middle">Encoder 4 · веса θ₄</text><rect x="560" y="266" width="260" height="42" rx="8" class="bx"/><text x="690" y="293" class="lbl" text-anchor="middle">Decoder 4 · веса φ₄</text><path d="M250 266 V252" class="edge" marker-end="url(#ov-arw)"/><path d="M690 266 V252" class="edge" marker-end="url(#ov-arw)"/><rect x="120" y="208" width="260" height="42" rx="8" class="bx"/><text x="250" y="235" class="lbl" text-anchor="middle">Encoder 5 · веса θ₅</text><rect x="560" y="208" width="260" height="42" rx="8" class="bx"/><text x="690" y="235" class="lbl" text-anchor="middle">Decoder 5 · веса φ₅</text><path d="M250 208 V194" class="edge" marker-end="url(#ov-arw)"/><path d="M690 208 V194" class="edge" marker-end="url(#ov-arw)"/><rect x="120" y="150" width="260" height="42" rx="8" class="bx"/><text x="250" y="177" class="lbl" text-anchor="middle">Encoder 6 · веса θ₆</text><rect x="560" y="150" width="260" height="42" rx="8" class="bx"/><text x="690" y="177" class="lbl" text-anchor="middle">Decoder 6 · веса φ₆</text><text x="420" y="300" class="cap">N = 6</text><text x="420" y="318" class="cap">в оригинале</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="bb" data-focus="bb">
      <div class="step-kicker">Шаг 1 · что видно снаружи</div>
      <h4>Последовательность на входе, последовательность на выходе</h4>
      <p>Английская фраза на входе, русская на выходе. Длина выхода заранее неизвестна и не обязана совпадать с длиной входа: модель сама решает, когда остановиться, выдав <code>&lt;END&gt;</code>.</p>
    </div>
    <div class="step-panel" data-on="arch h_enc" data-focus="h_enc">
      <div class="step-kicker">Шаг 2 · левая половина</div>
      <h4>Энкодер читает исходную фразу</h4>
      <p>ID токенов становятся векторами, к ним прибавляется позиция, затем N слоёв энкодера переписывают каждый вектор с учётом всей фразы. Сколько токенов вошло — столько векторов вышло.</p>
    </div>
    <div class="step-panel" data-on="arch h_mem" data-focus="h_mem">
      <div class="step-kicker">Шаг 3 · мост</div>
      <h4>Выход верхнего энкодера — память для декодера</h4>
      <p>Энкодер отдаёт по вектору на каждый исходный токен. Это единственное, что декодер знает об оригинале. Память приходит из <em>верхнего</em> энкодера в <em>каждый</em> слой декодера, а не «слой в слой».</p>
    </div>
    <div class="step-panel" data-on="arch h_dec" data-focus="h_dec">
      <div class="step-kicker">Шаг 4 · правая половина</div>
      <h4>Декодер пишет ответ</h4>
      <p>У декодера два входа: память энкодера и уже написанная часть перевода, начиная с <code>&lt;START&gt;</code>. Каждый его слой смотрит назад на свой префикс и в память оригинала.</p>
    </div>
    <div class="step-panel" data-on="arch h_out" data-focus="h_out">
      <div class="step-kicker">Шаг 5 · выходной слой</div>
      <h4>Из векторов — в вероятности слов</h4>
      <p>Linear растягивает вектор каждой позиции до размера словаря, softmax превращает числа в распределение. Из него берут следующее слово.</p>
    </div>
    <div class="step-panel" data-on="loop" data-focus="loop">
      <div class="step-kicker">Шаг 6 · генерация</div>
      <h4>Перевод пишется по одному токену</h4>
      <p>Выбранное слово дописывается ко входу декодера, и он запускается снова — пока не выдаст <code>&lt;END&gt;</code>. Энкодер за это время работает один раз.</p>
    </div>
    <div class="step-panel" data-on="same" data-focus="same">
      <div class="step-kicker">Шаг 7 · оговорка</div>
      <h4>Одинаковое устройство, разные веса</h4>
      <p>Encoder 1 и Encoder 6 устроены одинаково и имеют одни формы тензоров, но веса у каждого свои. Поэтому глубина стека — настоящая глубина, а не повтор одной функции.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> энкодер один раз превращает оригинал в память — по вектору на токен, — а декодер шаг за шагом пишет перевод, сверяясь с этой памятью и со своим собственным префиксом.</div>

<hr>

<h2 id="layer-overview">Обзор 2. Внутри слоя энкодера и декодера</h2>

<p>Раскроем по одному слою каждой половины. Слой энкодера — это два подслоя: self-attention, где токены обмениваются информацией, и Feed Forward, где каждый токен обрабатывается сам по себе. Каждый подслой обёрнут в Add &amp; Norm: вход прибавляется к выходу, и сумма нормализуется. Слой декодера устроен так же, но подслоёв три — между его вниманием и Feed Forward вставлен cross-attention к памяти энкодера, а собственное внимание декодера закрыто причинной маской.</p>

<div class="stage" id="stageLy" tabindex="0">
  <div class="stage-figure">
<svg id="ly" viewBox="0 0 960 560" role="img" aria-label="Слой энкодера и слой декодера: подслои, residual-связи и память">
  <style>
    #ly { font-family: Helvetica, Arial, sans-serif; }
    #ly text { fill: #111111; }
    #ly .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #ly .offt { fill: #A29C92; font-size: 14px; }
    #ly .offs { fill: #A29C92; font-size: 12px; }
    #ly .is-focus .offt, #ly .is-focus .offs { font-weight: 400; }
    #ly .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #ly .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #ly .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #ly .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ly .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #ly .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #ly .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #ly .lbl { font-size: 15px; }
    #ly .lbl-b { font-size: 15px; font-weight: 700; }
    #ly .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #ly .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #ly .cap { font-size: 13px; fill: #5E5850; }
    #ly .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ly .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #ly .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #ly .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ly .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #ly .band-y { fill: #FFF3C4; }
    #ly .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="ly-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="ly-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="ly-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="ly-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#ly-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#ly-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#ly-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="erow" data-only="1"><text x="40" y="96" class="lbl-b">Слой энкодера × N</text><path d="M40 175 H640" stroke="#5E5850" stroke-width="2" fill="none"/><text x="40" y="205" class="cap">X · [L, d]</text><rect x="150" y="130" width="130" height="90" rx="8" class="br"/><text x="215.0" y="172" class="lbl-b" text-anchor="middle" style="font-size:14px">Multi-Head</text><text x="215.0" y="190" class="lbl-b" text-anchor="middle" style="font-size:14px">Attention</text><rect x="300" y="130" width="56" height="90" rx="8" class="bx"/><text x="328.0" y="172" class="lbl-b" text-anchor="middle" style="font-size:14px">Add &amp;</text><text x="328.0" y="190" class="lbl-b" text-anchor="middle" style="font-size:14px">Norm</text><rect x="380" y="130" width="130" height="90" rx="8" class="by"/><text x="445.0" y="180" class="lbl-b" text-anchor="middle" style="font-size:14px">Feed Forward</text><rect x="530" y="130" width="56" height="90" rx="8" class="bx"/><text x="558.0" y="172" class="lbl-b" text-anchor="middle" style="font-size:14px">Add &amp;</text><text x="558.0" y="190" class="lbl-b" text-anchor="middle" style="font-size:14px">Norm</text><path d="M130 175 C 120 90, 328 90, 328 126" fill="none" stroke="#C29E08" stroke-width="2" marker-end="url(#ly-arwy)"/><path d="M365 175 C 355 90, 558 90, 558 126" fill="none" stroke="#C29E08" stroke-width="2" marker-end="url(#ly-arwy)"/><path d="M640 175 H668" class="edge" marker-end="url(#ly-arw)"/><text x="676" y="172" class="lbl-b">Hᴺ · [L, d]</text><text x="676" y="192" class="cap">память оригинала</text></g>
  <g data-key="drow" data-only="1"><text x="40" y="346" class="lbl-b">Слой декодера × N</text><path d="M40 425 H860" stroke="#5E5850" stroke-width="2" fill="none"/><text x="40" y="455" class="cap">Y · [T, d]</text><rect x="120" y="380" width="110" height="90" rx="8" class="br"/><text x="175.0" y="422" class="lbl-b" text-anchor="middle" style="font-size:14px">Masked</text><text x="175.0" y="440" class="lbl-b" text-anchor="middle" style="font-size:14px">Attention</text><rect x="246" y="380" width="50" height="90" rx="8" class="bx"/><text x="271.0" y="422" class="lbl-b" text-anchor="middle" style="font-size:14px">Add &amp;</text><text x="271.0" y="440" class="lbl-b" text-anchor="middle" style="font-size:14px">Norm</text><rect x="312" y="380" width="110" height="90" rx="8" class="br"/><text x="367.0" y="422" class="lbl-b" text-anchor="middle" style="font-size:14px">Cross-</text><text x="367.0" y="440" class="lbl-b" text-anchor="middle" style="font-size:14px">Attention</text><rect x="438" y="380" width="50" height="90" rx="8" class="bx"/><text x="463.0" y="422" class="lbl-b" text-anchor="middle" style="font-size:14px">Add &amp;</text><text x="463.0" y="440" class="lbl-b" text-anchor="middle" style="font-size:14px">Norm</text><rect x="504" y="380" width="110" height="90" rx="8" class="by"/><text x="559.0" y="430" class="lbl-b" text-anchor="middle" style="font-size:14px">Feed Forward</text><rect x="630" y="380" width="50" height="90" rx="8" class="bx"/><text x="655.0" y="422" class="lbl-b" text-anchor="middle" style="font-size:14px">Add &amp;</text><text x="655.0" y="440" class="lbl-b" text-anchor="middle" style="font-size:14px">Norm</text><path d="M100 425 C 90 340, 270 340, 270 376" fill="none" stroke="#C29E08" stroke-width="2" marker-end="url(#ly-arwy)"/><path d="M302 425 C 292 340, 462 340, 462 376" fill="none" stroke="#C29E08" stroke-width="2" marker-end="url(#ly-arwy)"/><path d="M494 425 C 484 340, 654 340, 654 376" fill="none" stroke="#C29E08" stroke-width="2" marker-end="url(#ly-arwy)"/><path d="M860 425 H888" class="edge" marker-end="url(#ly-arw)"/><text x="892" y="420" class="cap">Linear</text><text x="892" y="436" class="cap">+ Softmax</text><path d="M720 200 V300 H367 V376" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#ly-arwr)"/><text x="560" y="292" class="cap" style="fill:#a30908;font-weight:700">K, V ← Hᴺ</text></g>
  <g data-key="r_in" data-only="1"><rect x="144" y="124" width="448" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_att" data-only="1"><rect x="144" y="124" width="142" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_ff" data-only="1"><rect x="374" y="124" width="142" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_an" data-only="1"><rect x="294" y="124" width="68" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/><rect x="524" y="124" width="68" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_mask" data-only="1"><rect x="114" y="374" width="122" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_cross" data-only="1"><rect x="306" y="374" width="122" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r_dff" data-only="1"><rect x="498" y="374" width="188" height="102" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Два стека из одинаковых слоёв</h4>
      <p>Подсвечены слой энкодера и слой декодера. Раскроем оба и сравним: у энкодера два подслоя, у декодера три, и один из них соединяет две половины модели.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_in" data-focus="r_in">
      <div class="step-kicker">Шаг 2 · форма</div>
      <h4>Слой ничего не меняет в формах</h4>
      <p>На входе слоя энкодера матрица «токены × d_model», на выходе — матрица той же формы. Поэтому слои складываются в стек любой глубины. В примере это <code>[3, 4]</code>.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_att" data-focus="r_att">
      <div class="step-kicker">Шаг 3 · self-attention</div>
      <h4>Единственное место, где токены общаются</h4>
      <p>Вектор каждого токена пересобирается как взвешенная сумма векторов всех токенов фразы, включая себя. Так «welcome» в «You are welcome» отличается от «welcome» как существительного.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_ff" data-focus="r_ff">
      <div class="step-kicker">Шаг 4 · Feed Forward</div>
      <h4>Каждый токен обрабатывается отдельно</h4>
      <p>Двухслойная сеть с ReLU: расширяет вектор (обычно вчетверо) и сжимает обратно. Одна на все позиции, но применяется к каждой независимо.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_an" data-focus="r_an">
      <div class="step-kicker">Шаг 5 · Add &amp; Norm</div>
      <h4>Короткий путь и нормировка</h4>
      <p>Жёлтые дуги — residual: подслой вносит поправку, а не заменяет вектор. LayerNorm выравнивает масштаб каждой строки. Подробно — в разделе Add &amp; Norm главы 5.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_mask" data-focus="r_mask">
      <div class="step-kicker">Шаг 6 · masked self-attention</div>
      <h4>Декодер смотрит только назад</h4>
      <p>Первый подслой декодера — то же внимание, но с причинной маской: позиция <code>i</code> видит только позиции до себя. Иначе на обучении модель подсмотрела бы ответ.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_cross" data-focus="r_cross">
      <div class="step-kicker">Шаг 7 · cross-attention</div>
      <h4>Запросы свои, ключи чужие</h4>
      <p>Запросы идут из декодера, ключи и значения — из памяти энкодера. Здесь перевод «сверяется» с оригиналом; будущего в оригинале нет, поэтому причинная маска не нужна.</p>
    </div>
    <div class="step-panel" data-on="erow drow r_dff" data-focus="r_dff">
      <div class="step-kicker">Шаг 8 · выход</div>
      <h4>Feed Forward и следующий токен</h4>
      <p>Дальше тот же Feed Forward и Add &amp; Norm. Выход последнего слоя декодера идёт в Linear + Softmax, а выход энкодера никогда не превращается в слова — он только память.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> общая схема теперь знакома. Дальше пройдём её снизу вверх на том же переводе — от ID токенов до вероятностей выходных слов, по одному блоку за главу.</div>

<hr>
<h2 id="embedding">Глава 1. Embedding: как токен становится вектором</h2>

<p>Энкодер и декодер начинают не со слов, а с числовых представлений. Сначала токены получают ID, затем ID выбирает строку из обучаемой таблицы эмбеддингов. У входной и выходной последовательности — свои таблицы.</p>

<p>Шагов здесь ровно два, и их полезно не смешивать. Первый — <strong>токенизация</strong>: текст режется на токены и каждый токен заменяется целым числом по фиксированному словарю. Никакого обучения на этом шаге нет, это обычный поиск в таблице соответствий; число <code>62</code> само по себе ничего не значит и не больше и не меньше числа <code>17</code>.</p>

<p>Второй шаг — собственно <strong>embedding</strong>. Есть обучаемая матрица <code>E</code> размера <code>|V| × d_model</code>: по строке на каждое слово словаря. ID работает как номер строки, и токен превращается в вектор из <code>d_model</code> чисел. Именно эти числа и учатся: градиент правит строки таблицы, так что слова, которые ведут себя в текстах похоже, со временем получают близкие векторы.</p>

<div class="math-display" data-tex="x_j = E[\mathrm{id}_j] = \mathrm{onehot}(\mathrm{id}_j)\, E, \qquad E \in \mathbb{R}^{|V| \times d_{model}}"></div>

<div class="callout-blue"><strong>Почему это записывают как умножение:</strong> выбор строки по индексу и умножение one-hot вектора на матрицу дают один и тот же результат. Реализации просто берут строку по индексу — это быстрее. Но запись через умножение объясняет, почему embedding обучается как обычный линейный слой: на шаге обучения правится ровно та строка, чей токен встретился во входе.</div>

<p>Важная деталь классического Transformer: таблиц две. <strong>Input Embedding</strong> обслуживает исходный язык, <strong>Output Embedding</strong> — целевой. Вторая таблица работает не с готовым переводом, а с переводом, <strong>сдвинутым вправо</strong>: на первую позицию ставится служебный <code>&lt;START&gt;</code>, а последний токен цели отбрасывается. Так на каждой позиции декодер видит только то, что уже «сказано», и никогда — слово, которое ему предстоит предсказать.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · те же данные на всём пути</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Подставляем</span>
      <div class="math-display worked-math" data-tex="\text{are} \rightarrow \mathrm{id} = 62 \rightarrow E[62]"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Получаем</span>
      <div class="math-display worked-math" data-tex="x_1 = (-0.3,\; 0.5,\; 0.2,\; 0.8)"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> у отдельных координат нет отдельного смысла — не бывает «оси вежливости». Значение имеет только то, что один и тот же ID всегда достаёт одну и ту же строку, а близость строк между собой модель настраивает сама.</p>
</div>

<p>Посмотрим пошагово, как фраза проходит обе таблицы.</p>

<div class="stage" id="stageEm" tabindex="0">
  <div class="stage-figure">
<svg id="em" viewBox="0 0 960 560" role="img" aria-label="Embedding: схема трансформера, затем токены, ID и таблицы эмбеддингов">
  <style>
    #em { font-family: Helvetica, Arial, sans-serif; }
    #em text { fill: #111111; }
    #em .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #em .offt { fill: #A29C92; font-size: 14px; }
    #em .offs { fill: #A29C92; font-size: 12px; }
    #em .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #em .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #em .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #em .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #em .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #em .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #em .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #em .lbl { font-size: 15px; }
    #em .lbl-b { font-size: 15px; font-weight: 700; }
    #em .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #em .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #em .cap { font-size: 13px; fill: #5E5850; }
    #em .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #em .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #em .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #em .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #em .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #em .band-y { fill: #FFF3C4; }
    #em .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="em-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="em-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="em-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V160 H480 V240 H533" class="line" marker-end="url(#em-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#em-arwo)"/>
<path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text>
<text x="754" y="236" class="offs">× N</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text><circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text>
<rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text>
<text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text>
<text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330" y="447" class="lbl-b" text-anchor="middle">Input Embedding</text><rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630" y="447" class="lbl-b" text-anchor="middle">Output Embedding</text>
  </g>
  <g data-key="tok" data-only="1"><text x="40" y="95" class="ttl">токены</text><rect x="200" y="70" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="95.0" class="lbl" text-anchor="middle">You</text><rect x="350" y="70" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="95.0" class="lbl" text-anchor="middle">are</text><rect x="500" y="70" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="95.0" class="lbl" text-anchor="middle">welcome</text><rect x="650" y="70" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="95.0" class="cap" text-anchor="middle">PAD</text></g>
  <g data-key="ids" data-only="1"><text x="40" y="185" class="ttl">ID словаря</text><path d="M260 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M410 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M560 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M710 114 V152" class="edge" marker-end="url(#em-arw)"/><rect x="200" y="160" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="185.0" class="id" text-anchor="middle">57</text><rect x="350" y="160" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="185.0" class="id" text-anchor="middle">62</text><rect x="500" y="160" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="185.0" class="id" text-anchor="middle">17</text><rect x="650" y="160" width="120" height="40" rx="8" class="chip"/><text x="710.0" y="185.0" class="id" text-anchor="middle">1</text></g>
  <g data-key="tbl" data-only="1"><text x="400" y="260" class="ttl">таблица Eᵢₙ (фрагмент)</text><text x="442.0" y="282" class="cap" text-anchor="middle">x1</text><text x="532.0" y="282" class="cap" text-anchor="middle">x2</text><text x="622.0" y="282" class="cap" text-anchor="middle">x3</text><text x="712.0" y="282" class="cap" text-anchor="middle">x4</text><text x="388" y="312.0" class="lbl" text-anchor="end">57 · You</text><rect x="400" y="290" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="312.0" class="num" text-anchor="middle">0.2</text><rect x="490" y="290" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="312.0" class="num" text-anchor="middle">−0.4</text><rect x="580" y="290" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="312.0" class="num" text-anchor="middle">0.7</text><rect x="670" y="290" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="312.0" class="num" text-anchor="middle">0.1</text><text x="388" y="352.0" class="lbl" text-anchor="end">62 · are</text><rect x="400" y="330" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="352.0" class="num" text-anchor="middle">−0.3</text><rect x="490" y="330" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="352.0" class="num" text-anchor="middle">0.5</text><rect x="580" y="330" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="352.0" class="num" text-anchor="middle">0.2</text><rect x="670" y="330" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="352.0" class="num" text-anchor="middle">0.8</text><text x="388" y="392.0" class="lbl" text-anchor="end">17 · welcome</text><rect x="400" y="370" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="392.0" class="num" text-anchor="middle">0.9</text><rect x="490" y="370" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="392.0" class="num" text-anchor="middle">0.1</text><rect x="580" y="370" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="392.0" class="num" text-anchor="middle">−0.2</text><rect x="670" y="370" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="392.0" class="num" text-anchor="middle">0.4</text><text x="388" y="432.0" class="lbl" text-anchor="end">1 · PAD</text><rect x="400" y="410" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="432.0" class="num" text-anchor="middle">0.0</text><rect x="490" y="410" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="432.0" class="num" text-anchor="middle">0.0</text><rect x="580" y="410" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="432.0" class="num" text-anchor="middle">0.0</text><rect x="670" y="410" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="432.0" class="num" text-anchor="middle">0.0</text></g>
  <g data-key="sel" data-only="1"><rect x="347" y="67" width="126" height="46" rx="10" fill="none" stroke="#C29E08" stroke-width="2.2"/><rect x="347" y="157" width="126" height="46" rx="10" fill="none" stroke="#C29E08" stroke-width="2.2"/><path d="M410 206 V238 H170 V347 H286" class="edge-y" marker-end="url(#em-arwy)"/><rect x="396" y="326" width="362" height="42" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><text x="400" y="500" class="cap" style="fill:#8C7106">ID 62 — это просто номер строки: поиск, а не вычисление</text></g>
  <g data-key="shape" data-only="1"><text x="790" y="355" class="shape">4 × 4</text><text x="790" y="378" class="cap">4 токена × d = 4</text><text x="400" y="500" class="cap">один и тот же токен всегда достаёт одну и ту же строку — позиции здесь ещё нет</text></g>
  <g data-key="shift" data-only="1"><text x="40" y="115" class="ttl">цель перевода</text><rect x="200" y="90" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="115.0" class="lbl" text-anchor="middle">Добро</text><rect x="350" y="90" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="115.0" class="lbl" text-anchor="middle">пожаловать</text><rect x="500" y="90" width="120" height="40" rx="8" class="chip-sp"/><text x="560.0" y="115.0" class="cap" text-anchor="middle">&lt;END&gt;</text><rect x="650" y="90" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="115.0" class="cap" text-anchor="middle">PAD</text><text x="40" y="275" class="ttl">вход декодера</text><rect x="200" y="250" width="120" height="40" rx="8" class="by"/><text x="260.0" y="275.0" class="cap" text-anchor="middle">&lt;START&gt;</text><rect x="350" y="250" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="275.0" class="lbl" text-anchor="middle">Добро</text><rect x="500" y="250" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="275.0" class="lbl" text-anchor="middle">пожаловать</text><rect x="650" y="250" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="275.0" class="cap" text-anchor="middle">&lt;END&gt;</text><path d="M260 134 L410 244" class="edge" marker-end="url(#em-arw)"/><path d="M410 134 L560 244" class="edge" marker-end="url(#em-arw)"/><path d="M560 134 L710 244" class="edge" marker-end="url(#em-arw)"/><path d="M670 100 L750 120" stroke="#C30B0A" stroke-width="2"/><text x="710" y="160" class="cap" style="fill:#C30B0A" text-anchor="middle">выпадает</text><text x="260" y="315" class="cap" style="fill:#8C7106" text-anchor="middle">добавлен в начало</text><text x="260" y="80" class="cap" text-anchor="middle">позиция 1</text><text x="410" y="80" class="cap" text-anchor="middle">позиция 2</text><text x="560" y="80" class="cap" text-anchor="middle">позиция 3</text><text x="710" y="80" class="cap" text-anchor="middle">позиция 4</text><text x="200" y="380" class="cap">на каждой позиции декодер видит только уже «сказанное» — и никогда слово, которое должен предсказать</text></g>
  <g data-key="dtok" data-only="1"><text x="40" y="95" class="ttl">вход декодера</text><rect x="200" y="70" width="120" height="40" rx="8" class="chip-sp"/><text x="260.0" y="95.0" class="cap" text-anchor="middle">&lt;START&gt;</text><rect x="350" y="70" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="95.0" class="lbl" text-anchor="middle">Добро</text><rect x="500" y="70" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="95.0" class="lbl" text-anchor="middle">пожаловать</text><rect x="650" y="70" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="95.0" class="cap" text-anchor="middle">&lt;END&gt;</text></g>
  <g data-key="dids" data-only="1"><text x="40" y="185" class="ttl">ID словаря</text><path d="M260 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M410 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M560 114 V152" class="edge" marker-end="url(#em-arw)"/><path d="M710 114 V152" class="edge" marker-end="url(#em-arw)"/><rect x="200" y="160" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="185.0" class="id" text-anchor="middle">2</text><rect x="350" y="160" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="185.0" class="id" text-anchor="middle">81</text><rect x="500" y="160" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="185.0" class="id" text-anchor="middle">93</text><rect x="650" y="160" width="120" height="40" rx="8" class="chip"/><text x="710.0" y="185.0" class="id" text-anchor="middle">3</text></g>
  <g data-key="dtbl" data-only="1"><text x="400" y="260" class="ttl">таблица Eₒᵤₜ (другая, своя)</text><text x="442.0" y="282" class="cap" text-anchor="middle">x1</text><text x="532.0" y="282" class="cap" text-anchor="middle">x2</text><text x="622.0" y="282" class="cap" text-anchor="middle">x3</text><text x="712.0" y="282" class="cap" text-anchor="middle">x4</text><text x="388" y="312.0" class="lbl" text-anchor="end">2 · &lt;START&gt;</text><rect x="400" y="290" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="312.0" class="num" text-anchor="middle">0.1</text><rect x="490" y="290" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="312.0" class="num" text-anchor="middle">0.7</text><rect x="580" y="290" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="312.0" class="num" text-anchor="middle">−0.1</text><rect x="670" y="290" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="312.0" class="num" text-anchor="middle">0.4</text><text x="388" y="352.0" class="lbl" text-anchor="end">81 · Добро</text><rect x="400" y="330" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="352.0" class="num" text-anchor="middle">0.6</text><rect x="490" y="330" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="352.0" class="num" text-anchor="middle">−0.2</text><rect x="580" y="330" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="352.0" class="num" text-anchor="middle">0.3</text><rect x="670" y="330" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="352.0" class="num" text-anchor="middle">0.5</text><text x="388" y="392.0" class="lbl" text-anchor="end">93 · пожаловать</text><rect x="400" y="370" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="392.0" class="num" text-anchor="middle">−0.4</text><rect x="490" y="370" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="392.0" class="num" text-anchor="middle">0.8</text><rect x="580" y="370" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="392.0" class="num" text-anchor="middle">0.2</text><rect x="670" y="370" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="392.0" class="num" text-anchor="middle">0.1</text><text x="388" y="432.0" class="lbl" text-anchor="end">3 · &lt;END&gt;</text><rect x="400" y="410" width="84" height="34" rx="4" class="cell"/><text x="442.0" y="432.0" class="num" text-anchor="middle">0.3</text><rect x="490" y="410" width="84" height="34" rx="4" class="cell"/><text x="532.0" y="432.0" class="num" text-anchor="middle">0.1</text><rect x="580" y="410" width="84" height="34" rx="4" class="cell"/><text x="622.0" y="432.0" class="num" text-anchor="middle">−0.5</text><rect x="670" y="410" width="84" height="34" rx="4" class="cell"/><text x="712.0" y="432.0" class="num" text-anchor="middle">0.6</text></g>
  <g data-key="fin" data-only="1"><text x="180" y="120" class="ttl">Input Embedding → энкодер</text><text x="211.0" y="142" class="cap" text-anchor="middle">x1</text><text x="279.0" y="142" class="cap" text-anchor="middle">x2</text><text x="347.0" y="142" class="cap" text-anchor="middle">x3</text><text x="415.0" y="142" class="cap" text-anchor="middle">x4</text><text x="168" y="172.0" class="lbl" text-anchor="end">You</text><rect x="180" y="150" width="62" height="34" rx="4" class="cell"/><text x="211.0" y="172.0" class="num" text-anchor="middle">0.2</text><rect x="248" y="150" width="62" height="34" rx="4" class="cell"/><text x="279.0" y="172.0" class="num" text-anchor="middle">−0.4</text><rect x="316" y="150" width="62" height="34" rx="4" class="cell"/><text x="347.0" y="172.0" class="num" text-anchor="middle">0.7</text><rect x="384" y="150" width="62" height="34" rx="4" class="cell"/><text x="415.0" y="172.0" class="num" text-anchor="middle">0.1</text><text x="168" y="212.0" class="lbl" text-anchor="end">are</text><rect x="180" y="190" width="62" height="34" rx="4" class="cell"/><text x="211.0" y="212.0" class="num" text-anchor="middle">−0.3</text><rect x="248" y="190" width="62" height="34" rx="4" class="cell"/><text x="279.0" y="212.0" class="num" text-anchor="middle">0.5</text><rect x="316" y="190" width="62" height="34" rx="4" class="cell"/><text x="347.0" y="212.0" class="num" text-anchor="middle">0.2</text><rect x="384" y="190" width="62" height="34" rx="4" class="cell"/><text x="415.0" y="212.0" class="num" text-anchor="middle">0.8</text><text x="168" y="252.0" class="lbl" text-anchor="end">welcome</text><rect x="180" y="230" width="62" height="34" rx="4" class="cell"/><text x="211.0" y="252.0" class="num" text-anchor="middle">0.9</text><rect x="248" y="230" width="62" height="34" rx="4" class="cell"/><text x="279.0" y="252.0" class="num" text-anchor="middle">0.1</text><rect x="316" y="230" width="62" height="34" rx="4" class="cell"/><text x="347.0" y="252.0" class="num" text-anchor="middle">−0.2</text><rect x="384" y="230" width="62" height="34" rx="4" class="cell"/><text x="415.0" y="252.0" class="num" text-anchor="middle">0.4</text><text x="168" y="292.0" class="lbl" text-anchor="end">PAD</text><rect x="180" y="270" width="62" height="34" rx="4" class="cell"/><text x="211.0" y="292.0" class="num" text-anchor="middle">0.0</text><rect x="248" y="270" width="62" height="34" rx="4" class="cell"/><text x="279.0" y="292.0" class="num" text-anchor="middle">0.0</text><rect x="316" y="270" width="62" height="34" rx="4" class="cell"/><text x="347.0" y="292.0" class="num" text-anchor="middle">0.0</text><rect x="384" y="270" width="62" height="34" rx="4" class="cell"/><text x="415.0" y="292.0" class="num" text-anchor="middle">0.0</text><text x="650" y="120" class="ttl">Output Embedding → декодер</text><text x="681.0" y="142" class="cap" text-anchor="middle">x1</text><text x="749.0" y="142" class="cap" text-anchor="middle">x2</text><text x="817.0" y="142" class="cap" text-anchor="middle">x3</text><text x="885.0" y="142" class="cap" text-anchor="middle">x4</text><text x="638" y="172.0" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="650" y="150" width="62" height="34" rx="4" class="cell"/><text x="681.0" y="172.0" class="num" text-anchor="middle">0.1</text><rect x="718" y="150" width="62" height="34" rx="4" class="cell"/><text x="749.0" y="172.0" class="num" text-anchor="middle">0.7</text><rect x="786" y="150" width="62" height="34" rx="4" class="cell"/><text x="817.0" y="172.0" class="num" text-anchor="middle">−0.1</text><rect x="854" y="150" width="62" height="34" rx="4" class="cell"/><text x="885.0" y="172.0" class="num" text-anchor="middle">0.4</text><text x="638" y="212.0" class="lbl" text-anchor="end">Добро</text><rect x="650" y="190" width="62" height="34" rx="4" class="cell"/><text x="681.0" y="212.0" class="num" text-anchor="middle">0.6</text><rect x="718" y="190" width="62" height="34" rx="4" class="cell"/><text x="749.0" y="212.0" class="num" text-anchor="middle">−0.2</text><rect x="786" y="190" width="62" height="34" rx="4" class="cell"/><text x="817.0" y="212.0" class="num" text-anchor="middle">0.3</text><rect x="854" y="190" width="62" height="34" rx="4" class="cell"/><text x="885.0" y="212.0" class="num" text-anchor="middle">0.5</text><text x="638" y="252.0" class="lbl" text-anchor="end">пожаловать</text><rect x="650" y="230" width="62" height="34" rx="4" class="cell"/><text x="681.0" y="252.0" class="num" text-anchor="middle">−0.4</text><rect x="718" y="230" width="62" height="34" rx="4" class="cell"/><text x="749.0" y="252.0" class="num" text-anchor="middle">0.8</text><rect x="786" y="230" width="62" height="34" rx="4" class="cell"/><text x="817.0" y="252.0" class="num" text-anchor="middle">0.2</text><rect x="854" y="230" width="62" height="34" rx="4" class="cell"/><text x="885.0" y="252.0" class="num" text-anchor="middle">0.1</text><text x="638" y="292.0" class="lbl" text-anchor="end">&lt;END&gt;</text><rect x="650" y="270" width="62" height="34" rx="4" class="cell"/><text x="681.0" y="292.0" class="num" text-anchor="middle">0.3</text><rect x="718" y="270" width="62" height="34" rx="4" class="cell"/><text x="749.0" y="292.0" class="num" text-anchor="middle">0.1</text><rect x="786" y="270" width="62" height="34" rx="4" class="cell"/><text x="817.0" y="292.0" class="num" text-anchor="middle">−0.5</text><rect x="854" y="270" width="62" height="34" rx="4" class="cell"/><text x="885.0" y="292.0" class="num" text-anchor="middle">0.6</text><text x="180" y="340" class="shape" style="fill:#245A98">[4, 4]</text><text x="650" y="340" class="shape" style="fill:#245A98">[4, 4]</text><path d="M430 420 H530" class="edge-y" marker-end="url(#em-arwy)"/><text x="480" y="405" class="cap" style="fill:#8C7106" text-anchor="middle">дальше</text><text x="545" y="425" class="lbl-b" style="fill:#8C7106">+ Position Encoding</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Два входа — два блока Embedding</h4>
      <p>Подсвечены <strong>Input Embedding</strong> под энкодером и <strong>Output Embedding</strong> под декодером. Слева исходная фраза, справа уже известная часть перевода. Всё, что выше, в этой главе не работает.</p>
    </div>
    <div class="step-panel" data-on="tok ids" data-focus="ids">
      <div class="step-kicker">Шаг 2 · токенизация</div>
      <h4>Сначала токены получают ID</h4>
      <p>Словарь сопоставляет каждому токену целое число: You → 57, are → 62, welcome → 17, PAD → 1. Обучения здесь нет, и само число ничего не значит: 62 не «больше» 17.</p>
    </div>
    <div class="step-panel" data-on="tok ids tbl sel" data-focus="sel">
      <div class="step-kicker">Шаг 3 · поиск строки</div>
      <h4>ID выбирает строку таблицы</h4>
      <p>ID работает как номер строки в обучаемой таблице <code>Eᵢₙ</code>. Токен «are» с ID 62 достаёт строку <code>(−0.3, 0.5, 0.2, 0.8)</code> — это и есть его вектор.</p>
    </div>
    <div class="step-panel" data-on="tok ids tbl shape" data-focus="shape">
      <div class="step-kicker">Шаг 4 · результат</div>
      <h4>Каждый токен стал вектором</h4>
      <p>Входной слой выдаёт по вектору одинаковой длины на каждый токен: 4 токена × 4 числа. Строки идут в порядке токенов, но сами векторы порядка не кодируют.</p>
    </div>
    <div class="step-panel" data-on="shift" data-focus="shift">
      <div class="step-kicker">Шаг 5 · вход декодера</div>
      <h4>Перевод сдвигают вправо</h4>
      <p>При обучении в начало цели ставится <code>&lt;START&gt;</code>, а последний токен выпадает. Декодер получает <code>&lt;START&gt; → Добро → пожаловать → &lt;END&gt;</code>.</p>
    </div>
    <div class="step-panel" data-on="dtok dids dtbl" data-focus="dtbl">
      <div class="step-kicker">Шаг 6 · таблица декодера</div>
      <h4>У декодера своя таблица</h4>
      <p>Сдвинутый ряд тоже превращается в ID, но строки берутся из другой обучаемой таблицы <code>Eₒᵤₜ</code> — словарь целевого языка свой.</p>
    </div>
    <div class="step-panel" data-on="fin" data-focus="fin">
      <div class="step-kicker">Шаг 7 · что идёт дальше</div>
      <h4>Две матрицы 4 × 4 перед добавлением позиций</h4>
      <p>Обе ветки выдали последовательности векторов размерности 4. Следующий блок прибавит к ним информацию о позиции — это глава 2.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> после этого шага каждый токен представлен вектором одинаковой размерности. Порядок слов пока не добавлен — он появится в следующей главе.</div>

<hr>

<h2 id="position">Глава 2. Position Encoding: как добавить порядок</h2>

<p>Self-attention обрабатывает позиции параллельно, поэтому к эмбеддингу отдельно добавляется код позиции.</p>

<p>Стоит остановиться на том, почему без этого нельзя. Attention считает связь каждого токена с каждым через скалярные произведения — операцию, которой всё равно, в каком порядке лежат строки. Переставьте слова во входе, и выход переставится точно так же, но не изменится по содержанию. Порядок нужно внести в сами числа.</p>

<p>Классическое решение — <strong>синусоидальный код</strong>: для каждой позиции <code>pos</code> заранее вычисляется вектор той же длины <code>d_model</code>, чётные координаты берут синус, нечётные — косинус, а частота убывает по геометрической прогрессии с индексом координаты.</p>

<div class="math-display" data-tex="PE(pos,\,2i) = \sin\!\left(\frac{pos}{10000^{2i/d_{model}}}\right), \qquad PE(pos,\,2i{+}1) = \cos\!\left(\frac{pos}{10000^{2i/d_{model}}}\right)"></div>

<p>Знаменатель <code>10000^(2i/d)</code> и делает эту конструкцию полезной. Первые пары координат колеблются быстро и хорошо различают соседние позиции; последние меняются так медленно, что на длине предложения почти постоянны и задают грубое «начало — середина — конец». Вместе получается что-то вроде двоичной записи позиции, только непрерывной.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · d = 4, позиция 1</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Считаем строку PE(1) по формуле</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">i = 0</div>
      <div class="math-display worked-trace-math" data-tex="\sin(1) = 0.841,\quad \cos(1) = 0.540"></div>
      <div class="worked-trace-note">быстрая пара: между соседними позициями меняется заметно</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">i = 1</div>
      <div class="math-display worked-trace-math" data-tex="\sin(0.01) = 0.010,\quad \cos(0.01) = 1.000"></div>
      <div class="worked-trace-note">медленная пара: на коротких фразах почти не двигается</div>
    </div>
  </div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Складываем</span>
      <div class="math-display worked-math" data-tex="(-0.3,\,0.5,\,0.2,\,0.8) + (0.841,\,0.540,\,0.010,\,1.000)"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Получаем</span>
      <div class="math-display worked-math" data-tex="x_1 = (0.541,\; 1.040,\; 0.210,\; 1.800)"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> одна и та же добавка распределилась по координатам крайне неравномерно — первая сдвинулась на 0.841, третья всего на 0.010. Информация о позиции легла в «быстрые» координаты, а «медленные» почти целиком остались за содержанием токена.</p>
</div>

<div class="callout-blue"><strong>Почему складывают, а не приписывают сбоку:</strong> конкатенация увеличила бы ширину потока, а её обязаны сохранять residual-связи в каждом блоке. Сложение оставляет форму <code>[L, d]</code> неизменной, а разделить вклад позиции и вклад слова сеть при необходимости может сама — линейные проекции внутри attention на это способны.</div>

<div class="callout-yellow"><strong>Деталь реализации:</strong> синусоидальный код не единственный. В оригинальной статье его сравнили с обучаемой таблицей позиций и получили практически одинаковое качество; в современных моделях чаще встречаются обучаемые векторы позиций или RoPE, который поворачивает Q и K вместо сложения с входом. Идея «позиция вносится в числа явно» при этом не меняется.</div>

<p>Посмотрим пошагово: проблема, код позиций, одна строка по формуле и сложение в обеих ветках.</p>

<div class="stage" id="stagePs" tabindex="0">
  <div class="stage-figure">
<svg id="ps" viewBox="0 0 960 560" role="img" aria-label="Position Encoding: схема трансформера, затем код позиций и сложение с эмбеддингом">
  <style>
    #ps { font-family: Helvetica, Arial, sans-serif; }
    #ps text { fill: #111111; }
    #ps .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #ps .offt { fill: #A29C92; font-size: 14px; }
    #ps .offs { fill: #A29C92; font-size: 12px; }
    #ps .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #ps .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #ps .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #ps .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ps .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #ps .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #ps .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #ps .lbl { font-size: 15px; }
    #ps .lbl-b { font-size: 15px; font-weight: 700; }
    #ps .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #ps .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #ps .cap { font-size: 13px; fill: #5E5850; }
    #ps .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ps .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #ps .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #ps .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ps .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #ps .band-y { fill: #FFF3C4; }
    #ps .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="ps-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="ps-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="ps-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V160 H480 V240 H533" class="line" marker-end="url(#ps-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#ps-arwo)"/>
<path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text>
<text x="754" y="236" class="offs">× N</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330" y="447" class="offt" text-anchor="middle">Input Embedding</text><rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630" y="447" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text>
<rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text>
<text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text>
<text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text><circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
  </g>
  <g data-key="prob" data-only="1"><text x="40" y="115" class="ttl">порядок А</text><rect x="200" y="90" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="115.0" class="lbl" text-anchor="middle">You</text><rect x="350" y="90" width="120" height="40" rx="8" class="by"/><text x="410.0" y="115.0" class="lbl" text-anchor="middle">are</text><rect x="500" y="90" width="120" height="40" rx="8" class="chip"/><text x="560.0" y="115.0" class="lbl" text-anchor="middle">welcome</text><rect x="650" y="90" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="115.0" class="cap" text-anchor="middle">PAD</text><text x="40" y="215" class="ttl">порядок Б</text><rect x="200" y="190" width="120" height="40" rx="8" class="chip"/><text x="260.0" y="215.0" class="lbl" text-anchor="middle">welcome</text><rect x="350" y="190" width="120" height="40" rx="8" class="chip"/><text x="410.0" y="215.0" class="lbl" text-anchor="middle">You</text><rect x="500" y="190" width="120" height="40" rx="8" class="by"/><text x="560.0" y="215.0" class="lbl" text-anchor="middle">are</text><rect x="650" y="190" width="120" height="40" rx="8" class="chip-sp"/><text x="710.0" y="215.0" class="cap" text-anchor="middle">PAD</text><text x="200" y="300" class="lbl">E(are) = (−0.3, 0.5, 0.2, 0.8) в обоих порядках</text><rect x="196" y="330" width="560" height="44" rx="8" class="br"/><text x="214" y="358" class="lbl" style="fill:#a30908">attention сравнивает всех со всеми и не видит, где кто стоит</text></g>
  <g data-key="pem" data-only="1"><text x="190" y="120" class="ttl">PE: 4 позиции × 4 координаты</text><text x="229.0" y="142" class="cap" text-anchor="middle">x1</text><text x="313.0" y="142" class="cap" text-anchor="middle">x2</text><text x="397.0" y="142" class="cap" text-anchor="middle">x3</text><text x="481.0" y="142" class="cap" text-anchor="middle">x4</text><text x="178" y="172.0" class="lbl" text-anchor="end">pos 0</text><rect x="190" y="150" width="78" height="34" rx="4" class="cell"/><text x="229.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="274" y="150" width="78" height="34" rx="4" class="cell"/><text x="313.0" y="172.0" class="num" text-anchor="middle">1.000</text><rect x="358" y="150" width="78" height="34" rx="4" class="cell"/><text x="397.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="442" y="150" width="78" height="34" rx="4" class="cell"/><text x="481.0" y="172.0" class="num" text-anchor="middle">1.000</text><text x="178" y="212.0" class="lbl" text-anchor="end">pos 1</text><rect x="190" y="190" width="78" height="34" rx="4" class="cell"/><text x="229.0" y="212.0" class="num" text-anchor="middle">0.841</text><rect x="274" y="190" width="78" height="34" rx="4" class="cell"/><text x="313.0" y="212.0" class="num" text-anchor="middle">0.540</text><rect x="358" y="190" width="78" height="34" rx="4" class="cell"/><text x="397.0" y="212.0" class="num" text-anchor="middle">0.010</text><rect x="442" y="190" width="78" height="34" rx="4" class="cell"/><text x="481.0" y="212.0" class="num" text-anchor="middle">1.000</text><text x="178" y="252.0" class="lbl" text-anchor="end">pos 2</text><rect x="190" y="230" width="78" height="34" rx="4" class="cell"/><text x="229.0" y="252.0" class="num" text-anchor="middle">0.909</text><rect x="274" y="230" width="78" height="34" rx="4" class="cell"/><text x="313.0" y="252.0" class="num" text-anchor="middle">−0.416</text><rect x="358" y="230" width="78" height="34" rx="4" class="cell"/><text x="397.0" y="252.0" class="num" text-anchor="middle">0.020</text><rect x="442" y="230" width="78" height="34" rx="4" class="cell"/><text x="481.0" y="252.0" class="num" text-anchor="middle">1.000</text><text x="178" y="292.0" class="lbl" text-anchor="end">pos 3</text><rect x="190" y="270" width="78" height="34" rx="4" class="cell"/><text x="229.0" y="292.0" class="num" text-anchor="middle">0.141</text><rect x="274" y="270" width="78" height="34" rx="4" class="cell"/><text x="313.0" y="292.0" class="num" text-anchor="middle">−0.990</text><rect x="358" y="270" width="78" height="34" rx="4" class="cell"/><text x="397.0" y="292.0" class="num" text-anchor="middle">0.030</text><rect x="442" y="270" width="78" height="34" rx="4" class="cell"/><text x="481.0" y="292.0" class="num" text-anchor="middle">1.000</text><text x="190" y="340" class="cap">числа зависят только от номера позиции — не от слова</text></g>
  <g data-key="curves" data-only="1"><rect x="80" y="160" width="360" height="170" fill="#fff" stroke="#E4E1D7"/><text x="80" y="148" class="ttl">координаты 1–2 · быстрые</text><line x1="80" x2="440" y1="321.5" y2="321.5" stroke="#EEEBE3"/><text x="72" y="325.5" class="cap" text-anchor="end">-1</text><line x1="80" x2="440" y1="245.0" y2="245.0" stroke="#EEEBE3"/><text x="72" y="249.0" class="cap" text-anchor="end">0</text><line x1="80" x2="440" y1="168.5" y2="168.5" stroke="#EEEBE3"/><text x="72" y="172.5" class="cap" text-anchor="end">1</text><text x="80.0" y="348" class="cap" text-anchor="middle">0</text><text x="172.3" y="348" class="cap" text-anchor="middle">10</text><text x="264.6" y="348" class="cap" text-anchor="middle">20</text><text x="356.9" y="348" class="cap" text-anchor="middle">30</text><text x="440.0" y="348" class="cap" text-anchor="middle">39</text><polyline points="80.0,245.0 82.3,226.1 84.6,208.3 86.9,192.9 89.2,180.6 91.5,172.4 93.8,168.7 96.2,169.7 98.5,175.4 100.8,185.5 103.1,199.2 105.4,215.8 107.7,234.2 110.0,253.3 112.3,271.8 114.6,288.7 116.9,302.9 119.2,313.5 121.5,319.8 123.8,321.4 126.2,318.4 128.5,310.7 130.8,299.0 133.1,283.9 135.4,266.4 137.7,247.5 140.0,228.5 142.3,210.6 144.6,194.7 146.9,182.0 149.2,173.2 151.5,168.9 153.8,169.3 156.2,174.4 158.5,183.9 160.8,197.2 163.1,213.5 165.4,231.7 167.7,250.7 170.0,269.4 172.3,286.6 174.6,301.2 176.9,312.3 179.2,319.2 181.5,321.5 183.8,319.0 186.2,312.0 188.5,300.7 190.8,286.0 193.1,268.8 195.4,250.1 197.7,231.0 200.0,212.9 202.3,196.7 204.6,183.5 206.9,174.2 209.2,169.2 211.5,169.0 213.8,173.5 216.2,182.4 218.5,195.3 220.8,211.2 223.1,229.2 225.4,248.2 227.7,267.0 230.0,284.5 232.3,299.5 234.6,311.1 236.9,318.5 239.2,321.5 241.5,319.6 243.8,313.2 246.2,302.5 248.5,288.2 250.8,271.2 253.1,252.6 255.4,233.5 257.7,215.2 260.0,198.7 262.3,185.1 264.6,175.2 266.9,169.6 269.2,168.7 271.5,172.6 273.8,181.0 276.2,193.4 278.5,208.9 280.8,226.7 283.1,245.7 285.4,264.6 287.7,282.3 290.0,297.6 292.3,309.7 294.6,317.8 296.9,321.4 299.2,320.2 301.5,314.3 303.8,304.1 306.2,290.2 308.5,273.6 310.8,255.1 313.1,236.1 315.4,217.5 317.7,200.7 320.0,186.7 322.3,176.2 324.6,170.1 326.9,168.6 329.2,171.8 331.5,179.6 333.8,191.5 336.2,206.7 338.5,224.3 340.8,243.1 343.1,262.1 345.4,280.0 347.7,295.8 350.0,308.3 352.3,317.0 354.6,321.2 356.9,320.6 359.2,315.3 361.5,305.7 363.8,292.3 366.2,275.9 368.5,257.6 370.8,238.6 373.1,219.9 375.4,202.8 377.7,188.3 380.0,177.4 382.3,170.6 384.6,168.5 386.9,171.1 389.2,178.4 391.5,189.7 393.8,204.5 396.2,221.8 398.5,240.6 400.8,259.6 403.1,277.8 405.4,293.8 407.7,306.9 410.0,316.1 412.3,320.9 414.6,320.9 416.9,316.3 419.2,307.2 421.5,294.2 423.8,278.2 426.2,260.1 428.5,241.1 430.8,222.3 433.1,205.0 435.4,190.1 437.7,178.6 440.0,171.3" fill="none" stroke="#3576C0" stroke-width="2.4"/><polyline points="80.0,168.5 82.3,170.9 84.6,177.9 86.9,189.0 89.2,203.7 91.5,220.9 93.8,239.6 96.2,258.6 98.5,276.8 100.8,293.1 103.1,306.3 105.4,315.7 107.7,320.7 110.0,321.1 112.3,316.6 114.6,307.8 116.9,295.0 119.2,279.1 121.5,261.1 123.8,242.1 126.2,223.3 128.5,205.8 130.8,190.8 133.1,179.1 135.4,171.5 137.7,168.5 140.0,170.3 142.3,176.7 144.6,187.3 146.9,201.6 149.2,218.5 151.5,237.1 153.8,256.1 156.2,274.5 158.5,291.1 160.8,304.7 163.1,314.7 165.4,320.3 167.7,321.3 170.0,317.5 172.3,309.2 174.6,296.9 176.9,281.4 179.2,263.6 181.5,244.7 183.8,225.7 186.2,208.0 188.5,192.6 190.8,180.4 193.1,172.3 195.4,168.7 197.7,169.8 200.0,175.6 202.3,185.7 204.6,199.5 206.9,216.1 209.2,234.5 211.5,253.6 213.8,272.2 216.2,289.0 218.5,303.1 220.8,313.6 223.1,319.9 225.4,321.4 227.7,318.3 230.0,310.5 232.3,298.7 234.6,283.6 236.9,266.0 239.2,247.2 241.5,228.2 243.8,210.3 246.2,194.5 248.5,181.8 250.8,173.1 253.1,168.9 255.4,169.4 257.7,174.6 260.0,184.1 262.3,197.5 264.6,213.8 266.9,232.0 269.2,251.1 271.5,269.8 273.8,286.9 276.2,301.4 278.5,312.5 280.8,319.3 283.1,321.5 285.4,319.0 287.7,311.8 290.0,300.5 292.3,285.8 294.6,268.5 296.9,249.7 299.2,230.7 301.5,212.6 303.8,196.4 306.2,183.3 308.5,174.0 310.8,169.2 313.1,169.0 315.4,173.6 317.7,182.6 320.0,195.5 322.3,211.5 324.6,229.5 326.9,248.6 329.2,267.3 331.5,284.8 333.8,299.7 336.2,311.2 338.5,318.6 340.8,321.5 343.1,319.6 345.4,313.0 347.7,302.2 350.0,287.9 352.3,270.9 354.6,252.3 356.9,233.2 359.2,214.9 361.5,198.4 363.8,184.8 366.2,175.0 368.5,169.6 370.8,168.8 373.1,172.7 375.4,181.2 377.7,193.6 380.0,209.2 382.3,227.1 384.6,246.0 386.9,264.9 389.2,282.6 391.5,297.9 393.8,309.9 396.2,317.9 398.5,321.4 400.8,320.1 403.1,314.1 405.4,303.9 407.7,290.0 410.0,273.3 412.3,254.8 414.6,235.7 416.9,217.2 419.2,200.4 421.5,186.4 423.8,176.1 426.2,170.0 428.5,168.6 430.8,171.9 433.1,179.8 435.4,191.8 437.7,207.0 440.0,224.6" fill="none" stroke="#C29E08" stroke-width="2.4"/><rect x="540" y="160" width="360" height="170" fill="#fff" stroke="#E4E1D7"/><text x="540" y="148" class="ttl">координаты 3–4 · медленные</text><line x1="540" x2="900" y1="321.5" y2="321.5" stroke="#EEEBE3"/><text x="532" y="325.5" class="cap" text-anchor="end">-1</text><line x1="540" x2="900" y1="245.0" y2="245.0" stroke="#EEEBE3"/><text x="532" y="249.0" class="cap" text-anchor="end">0</text><line x1="540" x2="900" y1="168.5" y2="168.5" stroke="#EEEBE3"/><text x="532" y="172.5" class="cap" text-anchor="end">1</text><text x="540.0" y="348" class="cap" text-anchor="middle">0</text><text x="632.3" y="348" class="cap" text-anchor="middle">10</text><text x="724.6" y="348" class="cap" text-anchor="middle">20</text><text x="816.9" y="348" class="cap" text-anchor="middle">30</text><text x="900.0" y="348" class="cap" text-anchor="middle">39</text><polyline points="540.0,245.0 542.3,244.8 544.6,244.6 546.9,244.4 549.2,244.2 551.5,244.0 553.8,243.9 556.2,243.7 558.5,243.5 560.8,243.3 563.1,243.1 565.4,242.9 567.7,242.7 570.0,242.5 572.3,242.3 574.6,242.1 576.9,241.9 579.2,241.7 581.5,241.6 583.8,241.4 586.2,241.2 588.5,241.0 590.8,240.8 593.1,240.6 595.4,240.4 597.7,240.2 600.0,240.0 602.3,239.8 604.6,239.6 606.9,239.5 609.2,239.3 611.5,239.1 613.8,238.9 616.2,238.7 618.5,238.5 620.8,238.3 623.1,238.1 625.4,237.9 627.7,237.7 630.0,237.6 632.3,237.4 634.6,237.2 636.9,237.0 639.2,236.8 641.5,236.6 643.8,236.4 646.2,236.2 648.5,236.0 650.8,235.8 653.1,235.7 655.4,235.5 657.7,235.3 660.0,235.1 662.3,234.9 664.6,234.7 666.9,234.5 669.2,234.3 671.5,234.1 673.8,233.9 676.2,233.8 678.5,233.6 680.8,233.4 683.1,233.2 685.4,233.0 687.7,232.8 690.0,232.6 692.3,232.4 694.6,232.2 696.9,232.1 699.2,231.9 701.5,231.7 703.8,231.5 706.2,231.3 708.5,231.1 710.8,230.9 713.1,230.7 715.4,230.6 717.7,230.4 720.0,230.2 722.3,230.0 724.6,229.8 726.9,229.6 729.2,229.4 731.5,229.2 733.8,229.1 736.2,228.9 738.5,228.7 740.8,228.5 743.1,228.3 745.4,228.1 747.7,227.9 750.0,227.7 752.3,227.6 754.6,227.4 756.9,227.2 759.2,227.0 761.5,226.8 763.8,226.6 766.2,226.4 768.5,226.3 770.8,226.1 773.1,225.9 775.4,225.7 777.7,225.5 780.0,225.3 782.3,225.1 784.6,225.0 786.9,224.8 789.2,224.6 791.5,224.4 793.8,224.2 796.2,224.0 798.5,223.9 800.8,223.7 803.1,223.5 805.4,223.3 807.7,223.1 810.0,222.9 812.3,222.8 814.6,222.6 816.9,222.4 819.2,222.2 821.5,222.0 823.8,221.8 826.2,221.7 828.5,221.5 830.8,221.3 833.1,221.1 835.4,220.9 837.7,220.8 840.0,220.6 842.3,220.4 844.6,220.2 846.9,220.0 849.2,219.8 851.5,219.7 853.8,219.5 856.2,219.3 858.5,219.1 860.8,218.9 863.1,218.8 865.4,218.6 867.7,218.4 870.0,218.2 872.3,218.1 874.6,217.9 876.9,217.7 879.2,217.5 881.5,217.3 883.8,217.2 886.2,217.0 888.5,216.8 890.8,216.6 893.1,216.4 895.4,216.3 897.7,216.1 900.0,215.9" fill="none" stroke="#3576C0" stroke-width="2.4"/><polyline points="540.0,168.5 542.3,168.5 544.6,168.5 546.9,168.5 549.2,168.5 551.5,168.5 553.8,168.5 556.2,168.5 558.5,168.5 560.8,168.5 563.1,168.5 565.4,168.5 567.7,168.5 570.0,168.5 572.3,168.5 574.6,168.6 576.9,168.6 579.2,168.6 581.5,168.6 583.8,168.6 586.2,168.6 588.5,168.6 590.8,168.6 593.1,168.6 595.4,168.6 597.7,168.6 600.0,168.7 602.3,168.7 604.6,168.7 606.9,168.7 609.2,168.7 611.5,168.7 613.8,168.7 616.2,168.8 618.5,168.8 620.8,168.8 623.1,168.8 625.4,168.8 627.7,168.8 630.0,168.9 632.3,168.9 634.6,168.9 636.9,168.9 639.2,168.9 641.5,169.0 643.8,169.0 646.2,169.0 648.5,169.0 650.8,169.1 653.1,169.1 655.4,169.1 657.7,169.1 660.0,169.1 662.3,169.2 664.6,169.2 666.9,169.2 669.2,169.2 671.5,169.3 673.8,169.3 676.2,169.3 678.5,169.4 680.8,169.4 683.1,169.4 685.4,169.4 687.7,169.5 690.0,169.5 692.3,169.5 694.6,169.6 696.9,169.6 699.2,169.6 701.5,169.7 703.8,169.7 706.2,169.7 708.5,169.8 710.8,169.8 713.1,169.8 715.4,169.9 717.7,169.9 720.0,169.9 722.3,170.0 724.6,170.0 726.9,170.1 729.2,170.1 731.5,170.1 733.8,170.2 736.2,170.2 738.5,170.3 740.8,170.3 743.1,170.3 745.4,170.4 747.7,170.4 750.0,170.5 752.3,170.5 754.6,170.6 756.9,170.6 759.2,170.6 761.5,170.7 763.8,170.7 766.2,170.8 768.5,170.8 770.8,170.9 773.1,170.9 775.4,171.0 777.7,171.0 780.0,171.1 782.3,171.1 784.6,171.2 786.9,171.2 789.2,171.3 791.5,171.3 793.8,171.4 796.2,171.4 798.5,171.5 800.8,171.5 803.1,171.6 805.4,171.6 807.7,171.7 810.0,171.7 812.3,171.8 814.6,171.9 816.9,171.9 819.2,172.0 821.5,172.0 823.8,172.1 826.2,172.1 828.5,172.2 830.8,172.3 833.1,172.3 835.4,172.4 837.7,172.4 840.0,172.5 842.3,172.6 844.6,172.6 846.9,172.7 849.2,172.8 851.5,172.8 853.8,172.9 856.2,172.9 858.5,173.0 860.8,173.1 863.1,173.1 865.4,173.2 867.7,173.3 870.0,173.3 872.3,173.4 874.6,173.5 876.9,173.5 879.2,173.6 881.5,173.7 883.8,173.7 886.2,173.8 888.5,173.9 890.8,174.0 893.1,174.0 895.4,174.1 897.7,174.2 900.0,174.2" fill="none" stroke="#C29E08" stroke-width="2.4"/><text x="480" y="385" class="cap" text-anchor="middle">по горизонтали — позиция 0…39 · синий — sin (чётный индекс), жёлтый — cos (нечётный)</text><foreignObject x="80" y="40" width="820" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="PE(pos,2i)=\sin\frac{pos}{10000^{2i/d}},\qquad PE(pos,2i{+}1)=\cos\frac{pos}{10000^{2i/d}}"></div></foreignObject></g>
  <g data-key="row" data-only="1"><rect x="186" y="186" width="338" height="42" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><path d="M530 207 H600" class="edge-y" marker-end="url(#ps-arwy)"/></g>
  <g data-key="calc" data-only="1"><text x="620" y="120" class="ttl">строка pos = 1</text><text x="620" y="172" class="lbl">sin(1)</text><text x="780" y="172" class="num" style="font-weight:700">= 0.841</text><text x="620" y="212" class="lbl">cos(1)</text><text x="780" y="212" class="num" style="font-weight:700">= 0.540</text><text x="620" y="252" class="lbl">sin(1/100)</text><text x="780" y="252" class="num" style="font-weight:700">= 0.010</text><text x="620" y="292" class="lbl">cos(1/100)</text><text x="780" y="292" class="num" style="font-weight:700">= 1.000</text><text x="620" y="340" class="cap">первая пара меняется быстро,</text><text x="620" y="358" class="cap">вторая — почти стоит на месте</text></g>
  <g data-key="enc" data-only="1"><text x="170" y="120" class="ttl">Embedding</text><text x="197.0" y="142" class="cap" text-anchor="middle">x1</text><text x="256.0" y="142" class="cap" text-anchor="middle">x2</text><text x="315.0" y="142" class="cap" text-anchor="middle">x3</text><text x="374.0" y="142" class="cap" text-anchor="middle">x4</text><text x="158" y="172.0" class="lbl" text-anchor="end">You</text><rect x="170" y="150" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="172.0" class="num" text-anchor="middle">0.2</text><rect x="229" y="150" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="172.0" class="num" text-anchor="middle">−0.4</text><rect x="288" y="150" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="172.0" class="num" text-anchor="middle">0.7</text><rect x="347" y="150" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="172.0" class="num" text-anchor="middle">0.1</text><rect x="166" y="185" width="239" height="42" rx="6" class="band-y"/><text x="158" y="211.0" class="lbl" text-anchor="end">are</text><rect x="170" y="189" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="211.0" class="num" text-anchor="middle">−0.3</text><rect x="229" y="189" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="211.0" class="num" text-anchor="middle">0.5</text><rect x="288" y="189" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="211.0" class="num" text-anchor="middle">0.2</text><rect x="347" y="189" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="211.0" class="num" text-anchor="middle">0.8</text><text x="158" y="250.0" class="lbl" text-anchor="end">welcome</text><rect x="170" y="228" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="250.0" class="num" text-anchor="middle">0.9</text><rect x="229" y="228" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="250.0" class="num" text-anchor="middle">0.1</text><rect x="288" y="228" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="250.0" class="num" text-anchor="middle">−0.2</text><rect x="347" y="228" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="250.0" class="num" text-anchor="middle">0.4</text><text x="158" y="289.0" class="lbl" text-anchor="end">PAD</text><rect x="170" y="267" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="289.0" class="num" text-anchor="middle">0.0</text><rect x="229" y="267" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="289.0" class="num" text-anchor="middle">0.0</text><rect x="288" y="267" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="289.0" class="num" text-anchor="middle">0.0</text><rect x="347" y="267" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="289.0" class="num" text-anchor="middle">0.0</text><text x="420" y="245" class="shape" text-anchor="middle">+</text><text x="450" y="120" class="ttl">PE</text><text x="477.0" y="142" class="cap" text-anchor="middle">x1</text><text x="536.0" y="142" class="cap" text-anchor="middle">x2</text><text x="595.0" y="142" class="cap" text-anchor="middle">x3</text><text x="654.0" y="142" class="cap" text-anchor="middle">x4</text><rect x="450" y="150" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="509" y="150" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="172.0" class="num" text-anchor="middle">1.000</text><rect x="568" y="150" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="627" y="150" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="172.0" class="num" text-anchor="middle">1.000</text><rect x="446" y="185" width="239" height="42" rx="6" class="band-y"/><rect x="450" y="189" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="211.0" class="num" text-anchor="middle">0.841</text><rect x="509" y="189" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="211.0" class="num" text-anchor="middle">0.540</text><rect x="568" y="189" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="211.0" class="num" text-anchor="middle">0.010</text><rect x="627" y="189" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="211.0" class="num" text-anchor="middle">1.000</text><rect x="450" y="228" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="250.0" class="num" text-anchor="middle">0.909</text><rect x="509" y="228" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="250.0" class="num" text-anchor="middle">−0.416</text><rect x="568" y="228" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="250.0" class="num" text-anchor="middle">0.020</text><rect x="627" y="228" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="250.0" class="num" text-anchor="middle">1.000</text><rect x="450" y="267" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="289.0" class="num" text-anchor="middle">0.141</text><rect x="509" y="267" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="289.0" class="num" text-anchor="middle">−0.990</text><rect x="568" y="267" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="289.0" class="num" text-anchor="middle">0.030</text><rect x="627" y="267" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="289.0" class="num" text-anchor="middle">1.000</text><text x="700" y="245" class="shape" text-anchor="middle">=</text><text x="725" y="120" class="ttl">вход следующего блока</text><text x="752.0" y="142" class="cap" text-anchor="middle">x1</text><text x="811.0" y="142" class="cap" text-anchor="middle">x2</text><text x="870.0" y="142" class="cap" text-anchor="middle">x3</text><text x="929.0" y="142" class="cap" text-anchor="middle">x4</text><rect x="725" y="150" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="172.0" class="num" text-anchor="middle">0.200</text><rect x="784" y="150" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="172.0" class="num" text-anchor="middle">0.600</text><rect x="843" y="150" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="172.0" class="num" text-anchor="middle">0.700</text><rect x="902" y="150" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="172.0" class="num" text-anchor="middle">1.100</text><rect x="721" y="185" width="239" height="42" rx="6" class="band-g"/><rect x="725" y="189" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="211.0" class="num" text-anchor="middle">0.541</text><rect x="784" y="189" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="211.0" class="num" text-anchor="middle">1.040</text><rect x="843" y="189" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="211.0" class="num" text-anchor="middle">0.210</text><rect x="902" y="189" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="211.0" class="num" text-anchor="middle">1.800</text><rect x="725" y="228" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="250.0" class="num" text-anchor="middle">1.809</text><rect x="784" y="228" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="250.0" class="num" text-anchor="middle">−0.316</text><rect x="843" y="228" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="250.0" class="num" text-anchor="middle">−0.180</text><rect x="902" y="228" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="250.0" class="num" text-anchor="middle">1.400</text><rect x="725" y="267" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="289.0" class="num" text-anchor="middle">0.141</text><rect x="784" y="267" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="289.0" class="num" text-anchor="middle">−0.990</text><rect x="843" y="267" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="289.0" class="num" text-anchor="middle">0.030</text><rect x="902" y="267" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="289.0" class="num" text-anchor="middle">1.000</text><text x="170" y="350" class="cap">are на позиции 1: (−0.3, 0.5, 0.2, 0.8) + (0.841, 0.540, 0.010, 1.000) = (0.541, 1.040, 0.210, 1.800)</text><text x="170" y="372" class="cap">форма не меняется: [4, 4] + [4, 4] = [4, 4]</text></g>
  <g data-key="dec" data-only="1"><text x="170" y="120" class="ttl">Embedding</text><text x="197.0" y="142" class="cap" text-anchor="middle">x1</text><text x="256.0" y="142" class="cap" text-anchor="middle">x2</text><text x="315.0" y="142" class="cap" text-anchor="middle">x3</text><text x="374.0" y="142" class="cap" text-anchor="middle">x4</text><rect x="166" y="146" width="239" height="42" rx="6" class="band-y"/><text x="158" y="172.0" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="170" y="150" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="172.0" class="num" text-anchor="middle">0.1</text><rect x="229" y="150" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="172.0" class="num" text-anchor="middle">0.7</text><rect x="288" y="150" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="172.0" class="num" text-anchor="middle">−0.1</text><rect x="347" y="150" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="172.0" class="num" text-anchor="middle">0.4</text><text x="158" y="211.0" class="lbl" text-anchor="end">Добро</text><rect x="170" y="189" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="211.0" class="num" text-anchor="middle">0.6</text><rect x="229" y="189" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="211.0" class="num" text-anchor="middle">−0.2</text><rect x="288" y="189" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="211.0" class="num" text-anchor="middle">0.3</text><rect x="347" y="189" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="211.0" class="num" text-anchor="middle">0.5</text><text x="158" y="250.0" class="lbl" text-anchor="end">пожаловать</text><rect x="170" y="228" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="250.0" class="num" text-anchor="middle">−0.4</text><rect x="229" y="228" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="250.0" class="num" text-anchor="middle">0.8</text><rect x="288" y="228" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="250.0" class="num" text-anchor="middle">0.2</text><rect x="347" y="228" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="250.0" class="num" text-anchor="middle">0.1</text><text x="158" y="289.0" class="lbl" text-anchor="end">&lt;END&gt;</text><rect x="170" y="267" width="54" height="34" rx="4" class="cell"/><text x="197.0" y="289.0" class="num" text-anchor="middle">0.3</text><rect x="229" y="267" width="54" height="34" rx="4" class="cell"/><text x="256.0" y="289.0" class="num" text-anchor="middle">0.1</text><rect x="288" y="267" width="54" height="34" rx="4" class="cell"/><text x="315.0" y="289.0" class="num" text-anchor="middle">−0.5</text><rect x="347" y="267" width="54" height="34" rx="4" class="cell"/><text x="374.0" y="289.0" class="num" text-anchor="middle">0.6</text><text x="420" y="245" class="shape" text-anchor="middle">+</text><text x="450" y="120" class="ttl">PE</text><text x="477.0" y="142" class="cap" text-anchor="middle">x1</text><text x="536.0" y="142" class="cap" text-anchor="middle">x2</text><text x="595.0" y="142" class="cap" text-anchor="middle">x3</text><text x="654.0" y="142" class="cap" text-anchor="middle">x4</text><rect x="446" y="146" width="239" height="42" rx="6" class="band-y"/><rect x="450" y="150" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="509" y="150" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="172.0" class="num" text-anchor="middle">1.000</text><rect x="568" y="150" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="172.0" class="num" text-anchor="middle">0.000</text><rect x="627" y="150" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="172.0" class="num" text-anchor="middle">1.000</text><rect x="450" y="189" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="211.0" class="num" text-anchor="middle">0.841</text><rect x="509" y="189" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="211.0" class="num" text-anchor="middle">0.540</text><rect x="568" y="189" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="211.0" class="num" text-anchor="middle">0.010</text><rect x="627" y="189" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="211.0" class="num" text-anchor="middle">1.000</text><rect x="450" y="228" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="250.0" class="num" text-anchor="middle">0.909</text><rect x="509" y="228" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="250.0" class="num" text-anchor="middle">−0.416</text><rect x="568" y="228" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="250.0" class="num" text-anchor="middle">0.020</text><rect x="627" y="228" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="250.0" class="num" text-anchor="middle">1.000</text><rect x="450" y="267" width="54" height="34" rx="4" class="cell"/><text x="477.0" y="289.0" class="num" text-anchor="middle">0.141</text><rect x="509" y="267" width="54" height="34" rx="4" class="cell"/><text x="536.0" y="289.0" class="num" text-anchor="middle">−0.990</text><rect x="568" y="267" width="54" height="34" rx="4" class="cell"/><text x="595.0" y="289.0" class="num" text-anchor="middle">0.030</text><rect x="627" y="267" width="54" height="34" rx="4" class="cell"/><text x="654.0" y="289.0" class="num" text-anchor="middle">1.000</text><text x="700" y="245" class="shape" text-anchor="middle">=</text><text x="725" y="120" class="ttl">вход следующего блока</text><text x="752.0" y="142" class="cap" text-anchor="middle">x1</text><text x="811.0" y="142" class="cap" text-anchor="middle">x2</text><text x="870.0" y="142" class="cap" text-anchor="middle">x3</text><text x="929.0" y="142" class="cap" text-anchor="middle">x4</text><rect x="721" y="146" width="239" height="42" rx="6" class="band-g"/><rect x="725" y="150" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="172.0" class="num" text-anchor="middle">0.100</text><rect x="784" y="150" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="172.0" class="num" text-anchor="middle">1.700</text><rect x="843" y="150" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="172.0" class="num" text-anchor="middle">−0.100</text><rect x="902" y="150" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="172.0" class="num" text-anchor="middle">1.400</text><rect x="725" y="189" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="211.0" class="num" text-anchor="middle">1.441</text><rect x="784" y="189" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="211.0" class="num" text-anchor="middle">0.340</text><rect x="843" y="189" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="211.0" class="num" text-anchor="middle">0.310</text><rect x="902" y="189" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="211.0" class="num" text-anchor="middle">1.500</text><rect x="725" y="228" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="250.0" class="num" text-anchor="middle">0.509</text><rect x="784" y="228" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="250.0" class="num" text-anchor="middle">0.384</text><rect x="843" y="228" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="250.0" class="num" text-anchor="middle">0.220</text><rect x="902" y="228" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="250.0" class="num" text-anchor="middle">1.100</text><rect x="725" y="267" width="54" height="34" rx="4" class="cell"/><text x="752.0" y="289.0" class="num" text-anchor="middle">0.441</text><rect x="784" y="267" width="54" height="34" rx="4" class="cell"/><text x="811.0" y="289.0" class="num" text-anchor="middle">−0.890</text><rect x="843" y="267" width="54" height="34" rx="4" class="cell"/><text x="870.0" y="289.0" class="num" text-anchor="middle">−0.470</text><rect x="902" y="267" width="54" height="34" rx="4" class="cell"/><text x="929.0" y="289.0" class="num" text-anchor="middle">1.600</text><text x="170" y="350" class="cap">&lt;START&gt; получает тот же PE(0), что и You у энкодера: нумерация позиций начинается заново</text><text x="170" y="372" class="cap">форма не меняется: [4, 4] + [4, 4] = [4, 4]</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Узел «+» над каждым Embedding</h4>
      <p>Подсвечены оба узла <strong>Position Encoding</strong>: к выходу Input Embedding и Output Embedding прибавляется код позиции. Дальше векторы уходят в блоки внимания.</p>
    </div>
    <div class="step-panel" data-on="prob" data-focus="prob">
      <div class="step-kicker">Шаг 2 · проблема</div>
      <h4>Одних эмбеддингов недостаточно</h4>
      <p>Токен «are» получает одну и ту же строку таблицы, где бы он ни стоял. Attention обрабатывает позиции параллельно, и перестановка слов лишь переставит выходные строки. Порядок нужно внести в сами числа.</p>
    </div>
    <div class="step-panel" data-on="pem" data-focus="pem">
      <div class="step-kicker">Шаг 3 · код позиции</div>
      <h4>У каждой позиции свой вектор</h4>
      <p>Для каждой позиции заранее вычисляется вектор той же длины d = 4. Код для pos 0 одинаков для любого токена, стоящего первым.</p>
    </div>
    <div class="step-panel" data-on="curves" data-focus="curves">
      <div class="step-kicker">Шаг 4 · sin и cos</div>
      <h4>Чередуем синус и косинус с разной частотой</h4>
      <p>Чётные координаты берут sin, нечётные — cos. Знаменатель <code>10000^(2i/d)</code> замедляет каждую следующую пару: первая пара различает соседей, последняя задаёт грубое «начало — середина — конец».</p>
    </div>
    <div class="step-panel" data-on="pem row calc" data-focus="calc">
      <div class="step-kicker">Шаг 5 · одна строка</div>
      <h4>Считаем PE(1) по формуле</h4>
      <p>При d = 4 первые две координаты — <code>sin(pos)</code> и <code>cos(pos)</code>, следующие — <code>sin(pos/100)</code> и <code>cos(pos/100)</code>. Для pos = 1 это (0.841, 0.540, 0.010, 1.000).</p>
    </div>
    <div class="step-panel" data-on="enc" data-focus="enc">
      <div class="step-kicker">Шаг 6 · энкодер</div>
      <h4>Складываем с эмбеддингом покоординатно</h4>
      <p>К вектору каждого токена прибавляется строка PE с тем же номером позиции. Сумма несёт и содержание токена, и его место, а форма остаётся прежней.</p>
    </div>
    <div class="step-panel" data-on="dec" data-focus="dec">
      <div class="step-kicker">Шаг 7 · декодер</div>
      <h4>Та же операция в ветке декодера</h4>
      <p>У декодера свои эмбеддинги, но формула кода та же, и позиции снова считаются с нуля. В обеих ветках перед вниманием стоят векторы Embedding + PE.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> позиционный код не заменяет эмбеддинг. В следующий блок идёт их сумма: содержание токена плюс информация о его месте в последовательности.</div>

<hr>

<h2 id="dimensions">Глава 3. Размерности матриц и батчей</h2>

<p>Теперь тот же путь рассмотрим не для одного слова, а для батча: матрица ID, тензор эмбеддингов, позиционный код и двумерный срез одной фразы.</p>

<p>На практике модель никогда не обрабатывает одну фразу: их собирают в <strong>батч</strong> из <code>B</code> примеров. Чтобы данные легли в прямоугольный тензор, все последовательности приводят к одной длине <code>L</code> — короткие добивают служебным токеном <code>PAD</code>. Отсюда первая форма конвейера: <code>[B, L]</code>, матрица целых ID.</p>

<p>Embedding добавляет к этой матрице ось координат — каждое целое становится вектором длины <code>d_model</code>. Дальше форма <code>[B, L, d]</code> держится неизменной до самого выходного слоя; ни attention, ни Feed Forward её не меняют.</p>

<table class="shape-table">
  <tr><th>Объект</th><th>Форма</th><th>В примере</th></tr>
  <tr><td>матрица ID</td><td><code>[B, L]</code></td><td><code>[5, 4]</code> — 20 чисел</td></tr>
  <tr><td>выход Embedding</td><td><code>[B, L, d]</code></td><td><code>[5, 4, 4]</code> — 80 чисел</td></tr>
  <tr><td>позиционный код</td><td><code>[L, d]</code></td><td><code>[4, 4]</code> — 16 чисел на весь батч</td></tr>
  <tr><td>вход первого блока</td><td><code>[B, L, d]</code></td><td><code>[5, 4, 4]</code></td></tr>
  <tr><td>срез одного примера</td><td><code>[L, d]</code></td><td><code>[4, 4]</code></td></tr>
</table>

<p>Позиционный код от номера примера не зависит: позиция 2 — это позиция 2 в любой фразе батча. Поэтому его хранят как матрицу <code>[L, d]</code> и <strong>размножают по батчу</strong> при сложении. Это обычный broadcast: 16 чисел применяются ко всем пяти примерам.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · арифметика форм</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Складываем</span>
      <div class="math-display worked-math" data-tex="[5,\,4,\,4] \;+\; [4,\,4] \;\rightarrow\; \text{broadcast по оси } B"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Получаем</span>
      <div class="math-display worked-math" data-tex="[5,\,4,\,4]"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> 80 чисел эмбеддингов и всего 16 чисел позиционного кода. Сложение не создаёт новой оси и не расходует память под пять копий — форма выхода в точности совпадает с формой входа.</p>
</div>

<div class="callout-blue"><strong>Зачем такая дисциплина с формами:</strong> внутри блоков стоят residual-связи вида <code>x + f(x)</code>. Сложить два тензора можно только при совпадающих формах, поэтому <code>d_model</code> — не свободный параметр отдельного слоя, а общая ширина всего основного пути. Feed Forward внутри себя расширяется до <code>d_ff</code>, но обязан вернуться к <code>d_model</code> до выхода.</div>

<p>Дальше батч мысленно фиксируют: берут один индекс <code>b</code> и работают со срезом <code>[L, d]</code>. Так удобнее смотреть на матрицы внимания — но в реальном прогоне такой срез существует в <code>B</code> экземплярах одновременно.</p>

<div class="stage" id="stageDm" tabindex="0">
  <div class="stage-figure">
<svg id="dm" viewBox="0 0 960 560" role="img" aria-label="Размерности: схема трансформера, затем путь от [B, L] к [B, L, d]">
  <style>
    #dm { font-family: Helvetica, Arial, sans-serif; }
    #dm text { fill: #111111; }
    #dm .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #dm .offt { fill: #A29C92; font-size: 14px; }
    #dm .offs { fill: #A29C92; font-size: 12px; }
    #dm .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #dm .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #dm .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #dm .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #dm .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #dm .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #dm .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #dm .lbl { font-size: 15px; }
    #dm .lbl-b { font-size: 15px; font-weight: 700; }
    #dm .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #dm .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #dm .cap { font-size: 13px; fill: #5E5850; }
    #dm .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #dm .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #dm .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #dm .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #dm .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #dm .band-y { fill: #FFF3C4; }
    #dm .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="dm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="dm-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="dm-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V160 H480 V240 H533" class="line" marker-end="url(#dm-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#dm-arwo)"/>
<path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text>
<text x="754" y="236" class="offs">× N</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text>
<rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/>
<text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text>
<text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text>
<text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text><circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330" y="447" class="lbl-b" text-anchor="middle">Input Embedding</text><rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630" y="447" class="lbl-b" text-anchor="middle">Output Embedding</text>
<text x="342" y="482" class="cap" style="fill:#245A98;font-weight:700">[B, L]</text>
<text x="342" y="416" class="cap" style="fill:#245A98;font-weight:700">[B, L, d]</text>
<text x="342" y="364" class="cap" style="fill:#245A98;font-weight:700">[B, L, d]</text>
<text x="312" y="407" class="cap" style="fill:#8C7106;font-weight:700" text-anchor="end">[L, d]</text>
  </g>
  <g data-key="tokg" data-only="1"><text x="60" y="100" class="ttl">токены · B = 5 фраз</text><text x="50" y="140" class="cap" text-anchor="end">1</text><rect x="60" y="120" width="64" height="30" rx="4" class="cell"/><text x="92.0" y="140" class="lbl" text-anchor="middle" style="font-size:13px">You</text><rect x="128" y="120" width="64" height="30" rx="4" class="cell"/><text x="160.0" y="140" class="lbl" text-anchor="middle" style="font-size:13px">are</text><rect x="196" y="120" width="64" height="30" rx="4" class="cell"/><text x="228.0" y="140" class="lbl" text-anchor="middle" style="font-size:13px">welcome</text><rect x="264" y="120" width="64" height="30" rx="4" class="chip-sp"/><text x="296.0" y="140" class="lbl" text-anchor="middle" style="font-size:13px">PAD</text><text x="50" y="174" class="cap" text-anchor="end">2</text><rect x="60" y="154" width="64" height="30" rx="4" class="cell"/><text x="92.0" y="174" class="lbl" text-anchor="middle" style="font-size:13px">You</text><rect x="128" y="154" width="64" height="30" rx="4" class="cell"/><text x="160.0" y="174" class="lbl" text-anchor="middle" style="font-size:13px">are</text><rect x="196" y="154" width="64" height="30" rx="4" class="cell"/><text x="228.0" y="174" class="lbl" text-anchor="middle" style="font-size:13px">welcome</text><rect x="264" y="154" width="64" height="30" rx="4" class="chip-sp"/><text x="296.0" y="174" class="lbl" text-anchor="middle" style="font-size:13px">PAD</text><text x="50" y="208" class="cap" text-anchor="end">3</text><rect x="60" y="188" width="64" height="30" rx="4" class="cell"/><text x="92.0" y="208" class="lbl" text-anchor="middle" style="font-size:13px">You</text><rect x="128" y="188" width="64" height="30" rx="4" class="cell"/><text x="160.0" y="208" class="lbl" text-anchor="middle" style="font-size:13px">are</text><rect x="196" y="188" width="64" height="30" rx="4" class="cell"/><text x="228.0" y="208" class="lbl" text-anchor="middle" style="font-size:13px">welcome</text><rect x="264" y="188" width="64" height="30" rx="4" class="chip-sp"/><text x="296.0" y="208" class="lbl" text-anchor="middle" style="font-size:13px">PAD</text><text x="50" y="242" class="cap" text-anchor="end">4</text><rect x="60" y="222" width="64" height="30" rx="4" class="cell"/><text x="92.0" y="242" class="lbl" text-anchor="middle" style="font-size:13px">You</text><rect x="128" y="222" width="64" height="30" rx="4" class="cell"/><text x="160.0" y="242" class="lbl" text-anchor="middle" style="font-size:13px">are</text><rect x="196" y="222" width="64" height="30" rx="4" class="cell"/><text x="228.0" y="242" class="lbl" text-anchor="middle" style="font-size:13px">welcome</text><rect x="264" y="222" width="64" height="30" rx="4" class="chip-sp"/><text x="296.0" y="242" class="lbl" text-anchor="middle" style="font-size:13px">PAD</text><text x="50" y="276" class="cap" text-anchor="end">5</text><rect x="60" y="256" width="64" height="30" rx="4" class="cell"/><text x="92.0" y="276" class="lbl" text-anchor="middle" style="font-size:13px">You</text><rect x="128" y="256" width="64" height="30" rx="4" class="cell"/><text x="160.0" y="276" class="lbl" text-anchor="middle" style="font-size:13px">are</text><rect x="196" y="256" width="64" height="30" rx="4" class="cell"/><text x="228.0" y="276" class="lbl" text-anchor="middle" style="font-size:13px">welcome</text><rect x="264" y="256" width="64" height="30" rx="4" class="chip-sp"/><text x="296.0" y="276" class="lbl" text-anchor="middle" style="font-size:13px">PAD</text><text x="60" y="310" class="shape">[5, 4]</text></g>
  <g data-key="idg" data-only="1"><path d="M338 205 H370" class="edge" marker-end="url(#dm-arw)"/><text x="400" y="100" class="ttl">ID · целые числа</text><text x="390" y="140" class="cap" text-anchor="end">1</text><rect x="400" y="120" width="64" height="30" rx="4" class="cell"/><text x="432.0" y="140" class="id" text-anchor="middle" style="font-size:13px">57</text><rect x="468" y="120" width="64" height="30" rx="4" class="cell"/><text x="500.0" y="140" class="id" text-anchor="middle" style="font-size:13px">62</text><rect x="536" y="120" width="64" height="30" rx="4" class="cell"/><text x="568.0" y="140" class="id" text-anchor="middle" style="font-size:13px">17</text><rect x="604" y="120" width="64" height="30" rx="4" class="cell"/><text x="636.0" y="140" class="id" text-anchor="middle" style="font-size:13px">1</text><text x="390" y="174" class="cap" text-anchor="end">2</text><rect x="400" y="154" width="64" height="30" rx="4" class="cell"/><text x="432.0" y="174" class="id" text-anchor="middle" style="font-size:13px">57</text><rect x="468" y="154" width="64" height="30" rx="4" class="cell"/><text x="500.0" y="174" class="id" text-anchor="middle" style="font-size:13px">62</text><rect x="536" y="154" width="64" height="30" rx="4" class="cell"/><text x="568.0" y="174" class="id" text-anchor="middle" style="font-size:13px">17</text><rect x="604" y="154" width="64" height="30" rx="4" class="cell"/><text x="636.0" y="174" class="id" text-anchor="middle" style="font-size:13px">1</text><text x="390" y="208" class="cap" text-anchor="end">3</text><rect x="400" y="188" width="64" height="30" rx="4" class="cell"/><text x="432.0" y="208" class="id" text-anchor="middle" style="font-size:13px">57</text><rect x="468" y="188" width="64" height="30" rx="4" class="cell"/><text x="500.0" y="208" class="id" text-anchor="middle" style="font-size:13px">62</text><rect x="536" y="188" width="64" height="30" rx="4" class="cell"/><text x="568.0" y="208" class="id" text-anchor="middle" style="font-size:13px">17</text><rect x="604" y="188" width="64" height="30" rx="4" class="cell"/><text x="636.0" y="208" class="id" text-anchor="middle" style="font-size:13px">1</text><text x="390" y="242" class="cap" text-anchor="end">4</text><rect x="400" y="222" width="64" height="30" rx="4" class="cell"/><text x="432.0" y="242" class="id" text-anchor="middle" style="font-size:13px">57</text><rect x="468" y="222" width="64" height="30" rx="4" class="cell"/><text x="500.0" y="242" class="id" text-anchor="middle" style="font-size:13px">62</text><rect x="536" y="222" width="64" height="30" rx="4" class="cell"/><text x="568.0" y="242" class="id" text-anchor="middle" style="font-size:13px">17</text><rect x="604" y="222" width="64" height="30" rx="4" class="cell"/><text x="636.0" y="242" class="id" text-anchor="middle" style="font-size:13px">1</text><text x="390" y="276" class="cap" text-anchor="end">5</text><rect x="400" y="256" width="64" height="30" rx="4" class="cell"/><text x="432.0" y="276" class="id" text-anchor="middle" style="font-size:13px">57</text><rect x="468" y="256" width="64" height="30" rx="4" class="cell"/><text x="500.0" y="276" class="id" text-anchor="middle" style="font-size:13px">62</text><rect x="536" y="256" width="64" height="30" rx="4" class="cell"/><text x="568.0" y="276" class="id" text-anchor="middle" style="font-size:13px">17</text><rect x="604" y="256" width="64" height="30" rx="4" class="cell"/><text x="636.0" y="276" class="id" text-anchor="middle" style="font-size:13px">1</text><text x="400" y="310" class="shape" style="fill:#245A98">[B, L] = [5, 4]</text></g>
  <g data-key="emb" data-only="1"><path d="M678 205 H706" class="edge" marker-end="url(#dm-arw)"/><text x="716" y="100" class="ttl">Embedding · + ось d</text><rect x="768" y="118" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="755" y="131" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="742" y="144" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="729" y="157" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="716" y="170" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="728" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><text x="791.0" y="308" class="cap" text-anchor="middle">пример 1 спереди, 5 — сзади</text><text x="716" y="340" class="shape" style="fill:#245A98">[B, L, d] = [5, 4, 4]</text></g>
  <g data-key="pe" data-only="1"><text x="610" y="380" class="ttl">PE: [L, d] = [4, 4]</text><text x="598" y="432.0" class="lbl" text-anchor="end">pos 0</text><rect x="610" y="410" width="62" height="34" rx="4" class="cell"/><text x="641.0" y="432.0" class="num" text-anchor="middle">0.000</text><rect x="676" y="410" width="62" height="34" rx="4" class="cell"/><text x="707.0" y="432.0" class="num" text-anchor="middle">1.000</text><rect x="742" y="410" width="62" height="34" rx="4" class="cell"/><text x="773.0" y="432.0" class="num" text-anchor="middle">0.000</text><rect x="808" y="410" width="62" height="34" rx="4" class="cell"/><text x="839.0" y="432.0" class="num" text-anchor="middle">1.000</text><text x="598" y="470.0" class="lbl" text-anchor="end">pos 1</text><rect x="610" y="448" width="62" height="34" rx="4" class="cell"/><text x="641.0" y="470.0" class="num" text-anchor="middle">0.841</text><rect x="676" y="448" width="62" height="34" rx="4" class="cell"/><text x="707.0" y="470.0" class="num" text-anchor="middle">0.540</text><rect x="742" y="448" width="62" height="34" rx="4" class="cell"/><text x="773.0" y="470.0" class="num" text-anchor="middle">0.010</text><rect x="808" y="448" width="62" height="34" rx="4" class="cell"/><text x="839.0" y="470.0" class="num" text-anchor="middle">1.000</text><text x="598" y="508.0" class="lbl" text-anchor="end">pos 2</text><rect x="610" y="486" width="62" height="34" rx="4" class="cell"/><text x="641.0" y="508.0" class="num" text-anchor="middle">0.909</text><rect x="676" y="486" width="62" height="34" rx="4" class="cell"/><text x="707.0" y="508.0" class="num" text-anchor="middle">−0.416</text><rect x="742" y="486" width="62" height="34" rx="4" class="cell"/><text x="773.0" y="508.0" class="num" text-anchor="middle">0.020</text><rect x="808" y="486" width="62" height="34" rx="4" class="cell"/><text x="839.0" y="508.0" class="num" text-anchor="middle">1.000</text><text x="598" y="546.0" class="lbl" text-anchor="end">pos 3</text><rect x="610" y="524" width="62" height="34" rx="4" class="cell"/><text x="641.0" y="546.0" class="num" text-anchor="middle">0.141</text><rect x="676" y="524" width="62" height="34" rx="4" class="cell"/><text x="707.0" y="546.0" class="num" text-anchor="middle">−0.990</text><rect x="742" y="524" width="62" height="34" rx="4" class="cell"/><text x="773.0" y="546.0" class="num" text-anchor="middle">0.030</text><rect x="808" y="524" width="62" height="34" rx="4" class="cell"/><text x="839.0" y="546.0" class="num" text-anchor="middle">1.000</text><path d="M940 400 V300" class="edge-y" marker-end="url(#dm-arwy)"/><text x="932" y="380" class="cap" style="fill:#8C7106" text-anchor="end">× 5</text></g>
  <g data-key="peq" data-only="1"><text x="60" y="440" class="shape">[5, 4, 4] + [4, 4] → [5, 4, 4]</text><text x="60" y="466" class="cap">одна и та же матрица PE прибавляется к каждому примеру (broadcast);</text><text x="60" y="484" class="cap">16 чисел на весь батч, новой оси и пяти копий нет</text></g>
  <g data-key="slice" data-only="1"><rect x="768" y="118" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="755" y="131" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="742" y="144" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="729" y="157" width="150" height="118" rx="6" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.3"/><rect x="716" y="170" width="150" height="118" rx="6" fill="#F0FAF0" stroke="#73B222" stroke-width="2.4"/><rect x="728" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="182" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="207" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="232" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="728" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="760" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="792" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><rect x="824" y="257" width="28" height="20" rx="3" fill="#fff" stroke="#CAD7E5"/><text x="791.0" y="308" class="cap" text-anchor="middle">пример 1 спереди, 5 — сзади</text><text x="150" y="380" class="ttl">срез примера b = 1: [L, d] = [4, 4]</text><text x="138" y="432.0" class="lbl" text-anchor="end">You</text><rect x="150" y="410" width="62" height="34" rx="4" class="cell"/><text x="181.0" y="432.0" class="num" text-anchor="middle">0.200</text><rect x="216" y="410" width="62" height="34" rx="4" class="cell"/><text x="247.0" y="432.0" class="num" text-anchor="middle">0.600</text><rect x="282" y="410" width="62" height="34" rx="4" class="cell"/><text x="313.0" y="432.0" class="num" text-anchor="middle">0.700</text><rect x="348" y="410" width="62" height="34" rx="4" class="cell"/><text x="379.0" y="432.0" class="num" text-anchor="middle">1.100</text><text x="138" y="470.0" class="lbl" text-anchor="end">are</text><rect x="150" y="448" width="62" height="34" rx="4" class="cell"/><text x="181.0" y="470.0" class="num" text-anchor="middle">0.541</text><rect x="216" y="448" width="62" height="34" rx="4" class="cell"/><text x="247.0" y="470.0" class="num" text-anchor="middle">1.040</text><rect x="282" y="448" width="62" height="34" rx="4" class="cell"/><text x="313.0" y="470.0" class="num" text-anchor="middle">0.210</text><rect x="348" y="448" width="62" height="34" rx="4" class="cell"/><text x="379.0" y="470.0" class="num" text-anchor="middle">1.800</text><text x="138" y="508.0" class="lbl" text-anchor="end">welcome</text><rect x="150" y="486" width="62" height="34" rx="4" class="cell"/><text x="181.0" y="508.0" class="num" text-anchor="middle">1.809</text><rect x="216" y="486" width="62" height="34" rx="4" class="cell"/><text x="247.0" y="508.0" class="num" text-anchor="middle">−0.316</text><rect x="282" y="486" width="62" height="34" rx="4" class="cell"/><text x="313.0" y="508.0" class="num" text-anchor="middle">−0.180</text><rect x="348" y="486" width="62" height="34" rx="4" class="cell"/><text x="379.0" y="508.0" class="num" text-anchor="middle">1.400</text><text x="138" y="546.0" class="lbl" text-anchor="end">PAD</text><rect x="150" y="524" width="62" height="34" rx="4" class="cell"/><text x="181.0" y="546.0" class="num" text-anchor="middle">0.141</text><rect x="216" y="524" width="62" height="34" rx="4" class="cell"/><text x="247.0" y="546.0" class="num" text-anchor="middle">−0.990</text><rect x="282" y="524" width="62" height="34" rx="4" class="cell"/><text x="313.0" y="546.0" class="num" text-anchor="middle">0.030</text><rect x="348" y="524" width="62" height="34" rx="4" class="cell"/><text x="379.0" y="546.0" class="num" text-anchor="middle">1.000</text></g>
  <g data-key="flow" data-only="1"><text x="90" y="200" class="shape" text-anchor="middle">[5, 4, 4]</text><text x="90" y="222" class="cap" text-anchor="middle">B, L, d</text><path d="M150 194 H226" class="edge" marker-end="url(#dm-arw)"/><rect x="230" y="170" width="200" height="48" rx="8" class="bx"/><text x="330" y="200" class="lbl-b" text-anchor="middle">Энкодер × N</text><path d="M430 194 H506" class="edge" marker-end="url(#dm-arw)"/><text x="570" y="200" class="shape" text-anchor="middle">[5, 4, 4]</text><text x="570" y="222" class="cap" text-anchor="middle">память энкодера</text><path d="M570 234 V282 H330 V322" class="edge" marker-end="url(#dm-arw)"/><text x="590" y="274" class="cap">keys и values для cross-attention</text><text x="90" y="360" class="shape" text-anchor="middle">[5, 3, 4]</text><text x="90" y="382" class="cap" text-anchor="middle">B, T, d</text><path d="M150 354 H226" class="edge" marker-end="url(#dm-arw)"/><rect x="230" y="330" width="200" height="48" rx="8" class="bx"/><text x="330" y="360" class="lbl-b" text-anchor="middle">Декодер × N</text><path d="M430 354 H506" class="edge" marker-end="url(#dm-arw)"/><text x="570" y="360" class="shape" text-anchor="middle">[5, 3, 4]</text><path d="M632 354 H686" class="edge" marker-end="url(#dm-arw)"/><rect x="690" y="330" width="100" height="48" rx="8" class="bg"/><text x="740" y="360" class="lbl-b" text-anchor="middle">Linear</text><path d="M790 354 H822" class="edge" marker-end="url(#dm-arw)"/><text x="880" y="360" class="shape" text-anchor="middle" style="fill:#4d7a14">[5, 3, |V|]</text><text x="880" y="382" class="cap" text-anchor="middle">logits по словарю</text><text x="90" y="470" class="cap">внутри блоков формы временно меняются (Q, K, V, d_ff), но перед residual-сложением</text><text x="90" y="490" class="cap">возвращаются к d — иначе x + f(x) не сложить</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Тот же вход, но с формами</h4>
      <p>Подсвечены Embedding и Position Encoding — блоки двух прошлых глав. Теперь следим не за числами, а за формой: снизу приходит <code>[B, L]</code>, выше уходит <code>[B, L, d]</code>.</p>
    </div>
    <div class="step-panel" data-on="tokg" data-focus="tokg">
      <div class="step-kicker">Шаг 2 · батч</div>
      <h4>Батч — это B фраз одной длины</h4>
      <p>Для наглядности повторим одну фразу пять раз. Все последовательности приведены к длине L = 4, короткие добиты токеном PAD.</p>
    </div>
    <div class="step-panel" data-on="tokg idg" data-focus="idg">
      <div class="step-kicker">Шаг 3 · матрица ID</div>
      <h4>Токены превращаются в матрицу [B, L]</h4>
      <p>Словарь меняет содержимое ячеек, но не число строк и позиций. На вход Embedding поступает матрица целых ID формы <code>[5, 4]</code> — 20 чисел.</p>
    </div>
    <div class="step-panel" data-on="tokg idg emb" data-focus="emb">
      <div class="step-kicker">Шаг 4 · Embedding</div>
      <h4>Embedding добавляет ось координат</h4>
      <p>Каждый ID заменяется вектором из d = 4 чисел. Каждая строка ID становится матрицей 4 × 4, а пять таких матриц — тензором <code>[5, 4, 4]</code>, 80 чисел.</p>
    </div>
    <div class="step-panel" data-on="tokg idg emb pe peq" data-focus="pe">
      <div class="step-kicker">Шаг 5 · позиции</div>
      <h4>Позиционный код размножается по батчу</h4>
      <p>Позиция 2 — это позиция 2 в любой фразе, поэтому код хранят как <code>[L, d]</code> и прибавляют ко всем пяти примерам. Форма после сложения не меняется.</p>
    </div>
    <div class="step-panel" data-on="tokg idg slice pe" data-focus="slice">
      <div class="step-kicker">Шаг 6 · срез</div>
      <h4>Один пример — это двумерная матрица [L, d]</h4>
      <p>Чтобы разбирать трансформер на одной фразе, фиксируем индекс b. Остаётся матрица <code>[4, 4]</code>: строка — позиция, столбец — координата. Остальные четыре примера никуда не делись, мы их просто не рисуем.</p>
    </div>
    <div class="step-panel" data-on="flow" data-focus="flow">
      <div class="step-kicker">Шаг 7 · основной поток</div>
      <h4>Ширина d держится до самого выхода</h4>
      <p>Энкодер возвращает <code>[5, 4, 4]</code>, декодер с тремя токенами — <code>[5, 3, 4]</code>: длина T может отличаться от L. Только финальный Linear меняет d на размер словаря.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> главная размерность основного потока — <code>d_model</code>. Подслои могут временно менять внутреннюю ширину, но перед residual-сложением возвращаются к совместимой форме.</div>

<hr>

<h2 id="input-summary">Глава 4. Полный вход: Embedding + Position</h2>

<p>Соберём предыдущие шаги в одну цепочку на фразе «You are welcome»: от ID слова до готового вектора на его позиции.</p>

<p>Вход любого блока Transformer описывается одной строчкой: для токена на позиции <code>j</code> берём его строку из таблицы эмбеддингов и прибавляем код позиции.</p>

<div class="math-display" data-tex="X[j] = E[\mathrm{token}_j] + PE(j)"></div>

<p>Проследим слово <code>are</code> на позиции 1. Словарь даёт ID 62, таблица — вектор из четырёх чисел, а код позиции прибавляется к нему покоординатно.</p>

<div class="worked-example"><div class="worked-label">Числовой пример · are на позиции 1</div><div class="worked-trace"><div class="worked-trace-title">Содержание слова + его место</div>
<div class="worked-trace-row"><div class="worked-trace-name">Embedding</div><div class="math-display worked-trace-math" data-tex="E[62] = (-0.3,\;0.5,\;0.2,\;0.8)"></div><div class="worked-trace-note">строка токена are</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">PE(1)</div><div class="math-display worked-trace-math" data-tex="PE(1) = (0.841,\;0.540,\;0.010,\;1.000)"></div><div class="worked-trace-note">код второй позиции, нумерация с 0</div></div>
<div class="worked-trace-row"><div class="worked-trace-name">X[1]</div><div class="math-display worked-trace-math" data-tex="X[1] = (0.541,\;1.040,\;0.210,\;1.800)"></div><div class="worked-trace-note">покоординатная сумма без изменения ширины</div></div>
</div><p class="worked-reading"><strong>Как это прочитать:</strong> для You и welcome выполняется та же операция, но со своими строками E и позициями 0 и 2. Вместе три вектора образуют матрицу <code>[3, 4]</code>.</p></div>

<div class="callout-blue"><strong>Что здесь ещё не произошло:</strong> вектор are пока не использует соседние слова You и welcome. Их влияние появится в self-attention следующего блока.</div>

<p>Посмотрим пошагово всю цепочку — от текста до готового входа энкодера.</p>

<div class="stage" id="stageFi" tabindex="0">
  <div class="stage-figure">
<svg id="fi" viewBox="0 0 960 560" role="img" aria-label="Полный вход: схема трансформера, затем токены, эмбеддинги, позиции и их сумма">
  <style>
    #fi { font-family: Helvetica, Arial, sans-serif; }
    #fi text { fill: #111111; }
    #fi .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #fi .offt { fill: #A29C92; font-size: 14px; }
    #fi .offs { fill: #A29C92; font-size: 12px; }
    #fi .is-focus .offt, #fi .is-focus .offs { font-weight: 400; }
    #fi .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #fi .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #fi .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #fi .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #fi .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #fi .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #fi .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #fi .lbl { font-size: 15px; }
    #fi .lbl-b { font-size: 15px; font-weight: 700; }
    #fi .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #fi .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #fi .cap { font-size: 13px; fill: #5E5850; }
    #fi .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #fi .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #fi .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #fi .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #fi .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #fi .band-y { fill: #FFF3C4; }
    #fi .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="fi-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="fi-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="fi-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="fi-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#fi-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#fi-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>

  </g>
  <g data-key="tok" data-only="1"><text x="305" y="70" class="cap" text-anchor="middle">pos 0</text><text x="475" y="70" class="cap" text-anchor="middle">pos 1</text><text x="645" y="70" class="cap" text-anchor="middle">pos 2</text><text x="40" y="105" class="ttl">токены</text><rect x="240" y="80" width="130" height="40" rx="8" class="chip"/><text x="305.0" y="105.0" class="lbl" text-anchor="middle">You</text><rect x="410" y="80" width="130" height="40" rx="8" class="chip"/><text x="475.0" y="105.0" class="lbl" text-anchor="middle">are</text><rect x="580" y="80" width="130" height="40" rx="8" class="chip"/><text x="645.0" y="105.0" class="lbl" text-anchor="middle">welcome</text></g>
  <g data-key="ids" data-only="1"><text x="40" y="195" class="ttl">ID словаря</text><path d="M305 124 V162" class="edge" marker-end="url(#fi-arw)"/><path d="M475 124 V162" class="edge" marker-end="url(#fi-arw)"/><path d="M645 124 V162" class="edge" marker-end="url(#fi-arw)"/><rect x="240" y="170" width="130" height="40" rx="8" class="chip"/><text x="305.0" y="195.0" class="id" text-anchor="middle">57</text><rect x="410" y="170" width="130" height="40" rx="8" class="chip"/><text x="475.0" y="195.0" class="id" text-anchor="middle">62</text><rect x="580" y="170" width="130" height="40" rx="8" class="chip"/><text x="645.0" y="195.0" class="id" text-anchor="middle">17</text></g>
  <g data-key="emb" data-only="1"><text x="150" y="270" class="ttl">E[token] · слово</text><text x="177.0" y="292" class="cap" text-anchor="middle">x1</text><text x="236.0" y="292" class="cap" text-anchor="middle">x2</text><text x="295.0" y="292" class="cap" text-anchor="middle">x3</text><text x="354.0" y="292" class="cap" text-anchor="middle">x4</text><text x="138" y="322.0" class="lbl" text-anchor="end">You</text><rect x="150" y="300" width="54" height="34" rx="4" class="cell" /><text x="177.0" y="322.0" class="num" text-anchor="middle">0.2</text><rect x="209" y="300" width="54" height="34" rx="4" class="cell" /><text x="236.0" y="322.0" class="num" text-anchor="middle">−0.4</text><rect x="268" y="300" width="54" height="34" rx="4" class="cell" /><text x="295.0" y="322.0" class="num" text-anchor="middle">0.7</text><rect x="327" y="300" width="54" height="34" rx="4" class="cell" /><text x="354.0" y="322.0" class="num" text-anchor="middle">0.1</text><rect x="146" y="335" width="239" height="42" rx="6" class="band-y"/><text x="138" y="361.0" class="lbl" text-anchor="end">are</text><rect x="150" y="339" width="54" height="34" rx="4" class="cell" /><text x="177.0" y="361.0" class="num" text-anchor="middle">−0.3</text><rect x="209" y="339" width="54" height="34" rx="4" class="cell" /><text x="236.0" y="361.0" class="num" text-anchor="middle">0.5</text><rect x="268" y="339" width="54" height="34" rx="4" class="cell" /><text x="295.0" y="361.0" class="num" text-anchor="middle">0.2</text><rect x="327" y="339" width="54" height="34" rx="4" class="cell" /><text x="354.0" y="361.0" class="num" text-anchor="middle">0.8</text><text x="138" y="400.0" class="lbl" text-anchor="end">welcome</text><rect x="150" y="378" width="54" height="34" rx="4" class="cell" /><text x="177.0" y="400.0" class="num" text-anchor="middle">0.9</text><rect x="209" y="378" width="54" height="34" rx="4" class="cell" /><text x="236.0" y="400.0" class="num" text-anchor="middle">0.1</text><rect x="268" y="378" width="54" height="34" rx="4" class="cell" /><text x="295.0" y="400.0" class="num" text-anchor="middle">−0.2</text><rect x="327" y="378" width="54" height="34" rx="4" class="cell" /><text x="354.0" y="400.0" class="num" text-anchor="middle">0.4</text></g>
  <g data-key="pe" data-only="1"><text x="405" y="362" class="shape" text-anchor="middle">+</text><text x="430" y="270" class="ttl">PE(pos) · место</text><text x="457.0" y="292" class="cap" text-anchor="middle">x1</text><text x="516.0" y="292" class="cap" text-anchor="middle">x2</text><text x="575.0" y="292" class="cap" text-anchor="middle">x3</text><text x="634.0" y="292" class="cap" text-anchor="middle">x4</text><rect x="430" y="300" width="54" height="34" rx="4" class="cell" /><text x="457.0" y="322.0" class="num" text-anchor="middle">0.000</text><rect x="489" y="300" width="54" height="34" rx="4" class="cell" /><text x="516.0" y="322.0" class="num" text-anchor="middle">1.000</text><rect x="548" y="300" width="54" height="34" rx="4" class="cell" /><text x="575.0" y="322.0" class="num" text-anchor="middle">0.000</text><rect x="607" y="300" width="54" height="34" rx="4" class="cell" /><text x="634.0" y="322.0" class="num" text-anchor="middle">1.000</text><rect x="426" y="335" width="239" height="42" rx="6" class="band-y"/><rect x="430" y="339" width="54" height="34" rx="4" class="cell" /><text x="457.0" y="361.0" class="num" text-anchor="middle">0.841</text><rect x="489" y="339" width="54" height="34" rx="4" class="cell" /><text x="516.0" y="361.0" class="num" text-anchor="middle">0.540</text><rect x="548" y="339" width="54" height="34" rx="4" class="cell" /><text x="575.0" y="361.0" class="num" text-anchor="middle">0.010</text><rect x="607" y="339" width="54" height="34" rx="4" class="cell" /><text x="634.0" y="361.0" class="num" text-anchor="middle">1.000</text><rect x="430" y="378" width="54" height="34" rx="4" class="cell" /><text x="457.0" y="400.0" class="num" text-anchor="middle">0.909</text><rect x="489" y="378" width="54" height="34" rx="4" class="cell" /><text x="516.0" y="400.0" class="num" text-anchor="middle">−0.416</text><rect x="548" y="378" width="54" height="34" rx="4" class="cell" /><text x="575.0" y="400.0" class="num" text-anchor="middle">0.020</text><rect x="607" y="378" width="54" height="34" rx="4" class="cell" /><text x="634.0" y="400.0" class="num" text-anchor="middle">1.000</text></g>
  <g data-key="sum" data-only="1"><text x="685" y="362" class="shape" text-anchor="middle">=</text><text x="710" y="270" class="ttl">X · вход энкодера</text><text x="737.0" y="292" class="cap" text-anchor="middle">x1</text><text x="796.0" y="292" class="cap" text-anchor="middle">x2</text><text x="855.0" y="292" class="cap" text-anchor="middle">x3</text><text x="914.0" y="292" class="cap" text-anchor="middle">x4</text><rect x="710" y="300" width="54" height="34" rx="4" class="cell" /><text x="737.0" y="322.0" class="num" text-anchor="middle">0.200</text><rect x="769" y="300" width="54" height="34" rx="4" class="cell" /><text x="796.0" y="322.0" class="num" text-anchor="middle">0.600</text><rect x="828" y="300" width="54" height="34" rx="4" class="cell" /><text x="855.0" y="322.0" class="num" text-anchor="middle">0.700</text><rect x="887" y="300" width="54" height="34" rx="4" class="cell" /><text x="914.0" y="322.0" class="num" text-anchor="middle">1.100</text><rect x="706" y="335" width="239" height="42" rx="6" class="band-g"/><rect x="710" y="339" width="54" height="34" rx="4" class="cell" /><text x="737.0" y="361.0" class="num" text-anchor="middle">0.541</text><rect x="769" y="339" width="54" height="34" rx="4" class="cell" /><text x="796.0" y="361.0" class="num" text-anchor="middle">1.040</text><rect x="828" y="339" width="54" height="34" rx="4" class="cell" /><text x="855.0" y="361.0" class="num" text-anchor="middle">0.210</text><rect x="887" y="339" width="54" height="34" rx="4" class="cell" /><text x="914.0" y="361.0" class="num" text-anchor="middle">1.800</text><rect x="710" y="378" width="54" height="34" rx="4" class="cell" /><text x="737.0" y="400.0" class="num" text-anchor="middle">1.809</text><rect x="769" y="378" width="54" height="34" rx="4" class="cell" /><text x="796.0" y="400.0" class="num" text-anchor="middle">−0.316</text><rect x="828" y="378" width="54" height="34" rx="4" class="cell" /><text x="855.0" y="400.0" class="num" text-anchor="middle">−0.180</text><rect x="887" y="378" width="54" height="34" rx="4" class="cell" /><text x="914.0" y="400.0" class="num" text-anchor="middle">1.400</text><text x="150" y="470" class="cap">are на позиции 1: (−0.3, 0.5, 0.2, 0.8) + (0.841, 0.540, 0.010, 1.000) = (0.541, 1.040, 0.210, 1.800)</text><text x="150" y="494" class="shape" style="fill:#4d7a14">X: [L, d] = [3, 4]</text></g>
  <g data-key="cmp" data-only="1"><line x1="180" x2="800" y1="330" y2="330" stroke="#9A948A"/><text x="170" y="334" class="cap" text-anchor="end">0</text><rect x="224" y="330.0" width="40" height="33.0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><text x="244" y="381.0" class="cap" text-anchor="middle">−0.3</text><rect x="276" y="270.4" width="40" height="59.6" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/><text x="296" y="262.4" class="cap" text-anchor="middle">0.541</text><text x="270" y="400" class="cap" text-anchor="middle">x1</text><rect x="369" y="275.0" width="40" height="55.0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><text x="389" y="267.0" class="cap" text-anchor="middle">0.5</text><rect x="421" y="215.6" width="40" height="114.4" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/><text x="441" y="207.6" class="cap" text-anchor="middle">1.040</text><text x="415" y="400" class="cap" text-anchor="middle">x2</text><rect x="514" y="308.0" width="40" height="22.0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><text x="534" y="300.0" class="cap" text-anchor="middle">0.2</text><rect x="566" y="306.9" width="40" height="23.1" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/><text x="586" y="298.9" class="cap" text-anchor="middle">0.210</text><text x="560" y="400" class="cap" text-anchor="middle">x3</text><rect x="659" y="242.0" width="40" height="88.0" fill="#F0F6FC" stroke="#3576C0" stroke-width="1.6"/><text x="679" y="234.0" class="cap" text-anchor="middle">0.8</text><rect x="711" y="132.0" width="40" height="198.0" fill="#F0FAF0" stroke="#73B222" stroke-width="1.6"/><text x="731" y="124.0" class="cap" text-anchor="middle">1.800</text><text x="705" y="400" class="cap" text-anchor="middle">x4</text><rect x="180" y="430" width="14" height="14" fill="#F0F6FC" stroke="#3576C0"/><text x="202" y="442" class="cap">E[are] — только слово</text><rect x="420" y="430" width="14" height="14" fill="#F0FAF0" stroke="#73B222"/><text x="442" y="442" class="cap">X[1] = E[are] + PE(1) — слово и место</text><rect x="176" y="470" width="610" height="40" rx="8" class="br"/><text x="192" y="495" class="lbl" style="fill:#a30908">соседи You и welcome в X[1] ещё не участвуют — их добавит self-attention</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Вход энкодера: Embedding + Position Encoding</h4>
      <p>Подсвечены Input Embedding и узел «+» над ним. Глава собирает обе предыдущие операции в одну цепочку и доводит фразу «You are welcome» до готового входа энкодера.</p>
    </div>
    <div class="step-panel" data-on="tok ids" data-focus="ids">
      <div class="step-kicker">Шаг 2 · текст</div>
      <h4>Три токена, три позиции, три ID</h4>
      <p>You, are и welcome стоят на позициях 0, 1, 2. Словарь даёт им ID 57, 62, 17 — ID указывает на строку таблицы и ничего не знает о позиции.</p>
    </div>
    <div class="step-panel" data-on="tok ids emb" data-focus="emb">
      <div class="step-kicker">Шаг 3 · Embedding</div>
      <h4>ID выбирает строку таблицы E</h4>
      <p>Каждый ID достаёт вектор длины 4. Три токена дают матрицу <code>[3, 4]</code>, где строка «are» одинакова в любой фразе.</p>
    </div>
    <div class="step-panel" data-on="tok ids emb pe" data-focus="pe">
      <div class="step-kicker">Шаг 4 · Position Encoding</div>
      <h4>Для каждой позиции свой код</h4>
      <p>Для позиций 0, 1, 2 берём строки синусоидального кода. Они зависят только от номера места, не от слова, и тоже образуют матрицу <code>[3, 4]</code>.</p>
    </div>
    <div class="step-panel" data-on="tok ids emb pe sum" data-focus="sum">
      <div class="step-kicker">Шаг 5 · сумма</div>
      <h4>X[j] = E[token_j] + PE(j)</h4>
      <p>Складываем покоординатно, строка к строке. Ширина остаётся 4, и на вход энкодера уходит матрица <code>X</code> формы <code>[3, 4]</code>.</p>
    </div>
    <div class="step-panel" data-on="cmp" data-focus="cmp">
      <div class="step-kicker">Шаг 6 · до и после</div>
      <h4>Что добавила позиция к «are»</h4>
      <p>Сильнее всего сдвинулись «быстрые» координаты x1 и x2, а x3 почти не изменилась. Но вектор по-прежнему описывает только сам токен и его место: контекста фразы в нём ещё нет.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> на вход энкодера и декодера поступает уже не «чистый» embedding, а вектор токена с добавленной позицией — но ещё без контекста фразы.</div>

<hr>

<h2 id="encoder">Глава 5. Encoder: как обрабатывается входная фраза</h2>

<p>Один слой энкодера последовательно применяет self-attention, residual-связь с LayerNorm, Feed Forward и вторую residual-связь с LayerNorm. Затем такие слои образуют стек.</p>

<p>Слой энкодера состоит всего из двух подслоёв, и каждый обёрнут в одинаковую конструкцию «прибавить вход обратно и нормализовать». В классической (Post-LN) записи это выглядит так:</p>

<div class="math-display" data-tex="y = \mathrm{LayerNorm}\big(x + \mathrm{SelfAttention}(x)\big), \qquad z = \mathrm{LayerNorm}\big(y + \mathrm{FFN}(y)\big)"></div>

<p>У двух подслоёв разные роли, и их стоит развести. <strong>Self-attention смешивает позиции</strong>: строка на выходе — взвешенная сумма строк со всей фразы, поэтому только здесь токены вообще узнают о существовании друг друга. <strong>Feed Forward, наоборот, не смешивает ничего</strong>: одна и та же двухслойная сеть применяется к каждой строке отдельно.</p>

<div class="math-display" data-tex="\mathrm{FFN}(y) = \max(0,\; y W_1 + b_1)\, W_2 + b_2"></div>

<p>Внутри Feed Forward вектор временно расширяется: в примере с 4 до 8 координат, в оригинальной модели — с 512 до 2048. Расширение с ReLU посередине даёт нелинейность, без которой стек слоёв схлопывался бы в одно линейное преобразование. Наружу ширина обязательно возвращается к <code>d_model</code>.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · токен are на позиции 1</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Один проход через первый подслой</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">веса</div>
      <div class="math-display worked-trace-math" data-tex="\alpha = (0.132,\;0.736,\;0.132)"></div>
      <div class="worked-trace-note">больше половины веса токен отдал самому себе</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">A[1]</div>
      <div class="math-display worked-trace-math" data-tex="\textstyle\sum_k \alpha_k X[k] = (0.664,\;0.803,\;0.223,\;1.655)"></div>
      <div class="worked-trace-note">смесь трёх строк: You, are, welcome</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">residual</div>
      <div class="math-display worked-trace-math" data-tex="X[1] + A[1] = (1.205,\;1.844,\;0.433,\;3.455)"></div>
      <div class="worked-trace-note">масштаб вырос — сумма двух векторов</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">LayerNorm</div>
      <div class="math-display worked-trace-math" data-tex="y = (-0.476,\;0.098,\;-1.170,\;1.547)"></div>
      <div class="worked-trace-note">среднее 0, стандартное отклонение 1</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> residual складывает исходный вектор с поправкой внимания. В этом учебном LayerNorm γ = 1 и β = 0: нормализация даёт среднее около нуля и дисперсию около единицы, сохраняя четыре координаты.</p>
</div>

<p>Посмотрим пошагово один слой целиком, а затем — как из слоёв собирается стек и что из него уходит в декодер.</p>

<div class="stage" id="stageEn" tabindex="0">
  <div class="stage-figure">
<svg id="en" viewBox="0 0 960 560" role="img" aria-label="Encoder: схема трансформера, затем один слой по шагам и стек">
  <style>
    #en { font-family: Helvetica, Arial, sans-serif; }
    #en text { fill: #111111; }
    #en .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #en .offt { fill: #A29C92; font-size: 14px; }
    #en .offs { fill: #A29C92; font-size: 12px; }
    #en .is-focus .offt, #en .is-focus .offs { font-weight: 400; }
    #en .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #en .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #en .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #en .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #en .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #en .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #en .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #en .lbl { font-size: 15px; }
    #en .lbl-b { font-size: 15px; font-weight: 700; }
    #en .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #en .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #en .cap { font-size: 13px; fill: #5E5850; }
    #en .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #en .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #en .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #en .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #en .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #en .band-y { fill: #FFF3C4; }
    #en .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="en-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="en-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="en-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="en-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#en-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#en-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="x" data-only="1"><text x="300" y="120" class="ttl">X = Embedding + PE</text><text x="342.0" y="142" class="cap" text-anchor="middle">x1</text><text x="432.0" y="142" class="cap" text-anchor="middle">x2</text><text x="522.0" y="142" class="cap" text-anchor="middle">x3</text><text x="612.0" y="142" class="cap" text-anchor="middle">x4</text><text x="288" y="172.0" class="lbl" text-anchor="end">You</text><rect x="300" y="150" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="172.0" class="num" text-anchor="middle">0.200</text><rect x="390" y="150" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="172.0" class="num" text-anchor="middle">0.600</text><rect x="480" y="150" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="172.0" class="num" text-anchor="middle">0.700</text><rect x="570" y="150" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="172.0" class="num" text-anchor="middle">1.100</text><rect x="296" y="186" width="362" height="42" rx="6" class="band-y"/><text x="288" y="212.0" class="lbl" text-anchor="end">are</text><rect x="300" y="190" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="212.0" class="num" text-anchor="middle">0.541</text><rect x="390" y="190" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="212.0" class="num" text-anchor="middle">1.040</text><rect x="480" y="190" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="212.0" class="num" text-anchor="middle">0.210</text><rect x="570" y="190" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="212.0" class="num" text-anchor="middle">1.800</text><text x="288" y="252.0" class="lbl" text-anchor="end">welcome</text><rect x="300" y="230" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="252.0" class="num" text-anchor="middle">1.809</text><rect x="390" y="230" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="252.0" class="num" text-anchor="middle">−0.316</text><rect x="480" y="230" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="252.0" class="num" text-anchor="middle">−0.180</text><rect x="570" y="230" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="252.0" class="num" text-anchor="middle">1.400</text><text x="300" y="320" class="shape" style="fill:#245A98">[L, d] = [3, 4]</text><text x="300" y="344" class="cap">в батче — [B, 3, 4]; энкодер получает все строки сразу</text></g>
  <g data-key="att" data-only="1"><text x="260" y="100" class="ttl">веса внимания для запроса «are»</text><text x="246" y="142" class="lbl" text-anchor="end">You</text><rect x="260" y="120" width="500" height="32" rx="4" fill="#F4F2EC"/><rect x="260" y="120" width="65.9" height="32" rx="4" class="br"/><text x="335.9" y="142" class="lbl-b">13.2%</text><text x="246" y="192" class="lbl" text-anchor="end">are</text><rect x="260" y="170" width="500" height="32" rx="4" fill="#F4F2EC"/><rect x="260" y="170" width="368.2" height="32" rx="4" class="br"/><text x="638.2" y="192" class="lbl-b">73.6%</text><text x="246" y="242" class="lbl" text-anchor="end">welcome</text><rect x="260" y="220" width="500" height="32" rx="4" fill="#F4F2EC"/><rect x="260" y="220" width="65.9" height="32" rx="4" class="br"/><text x="335.9" y="242" class="lbl-b">13.2%</text><text x="286" y="352" class="lbl" text-anchor="end">A[1] = Σ αₖ X[k]</text><rect x="300" y="330" width="84" height="34" rx="4" class="br"/><text x="342.0" y="352" class="num" text-anchor="middle">0.664</text><rect x="390" y="330" width="84" height="34" rx="4" class="br"/><text x="432.0" y="352" class="num" text-anchor="middle">0.803</text><rect x="480" y="330" width="84" height="34" rx="4" class="br"/><text x="522.0" y="352" class="num" text-anchor="middle">0.223</text><rect x="570" y="330" width="84" height="34" rx="4" class="br"/><text x="612.0" y="352" class="num" text-anchor="middle">1.655</text><text x="300" y="400" class="cap">одна учебная голова, V = X: выход — смесь всех трёх строк</text></g>
  <g data-key="an1" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">X[1] · вход</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">0.541</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">1.040</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">0.210</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.800</text><text x="346" y="202" class="lbl" text-anchor="end">+ A[1] · внимание</text><rect x="360" y="180" width="84" height="34" rx="4" class="br"/><text x="402.0" y="202" class="num" text-anchor="middle">0.664</text><rect x="450" y="180" width="84" height="34" rx="4" class="br"/><text x="492.0" y="202" class="num" text-anchor="middle">0.803</text><rect x="540" y="180" width="84" height="34" rx="4" class="br"/><text x="582.0" y="202" class="num" text-anchor="middle">0.223</text><rect x="630" y="180" width="84" height="34" rx="4" class="br"/><text x="672.0" y="202" class="num" text-anchor="middle">1.655</text><text x="346" y="272" class="lbl" text-anchor="end">= сумма</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">1.205</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">1.844</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">0.433</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">3.455</text><path d="M540 290 V330" class="edge" marker-end="url(#en-arw)"/><text x="552" y="316" class="cap">LayerNorm</text><text x="346" y="362" class="lbl-b" text-anchor="end">Y[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">−0.476</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">0.098</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.170</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.547</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#en-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">короткий путь</text><text x="360" y="420" class="cap">LayerNorm: среднее ≈ 0, стандартное отклонение ≈ 1 (γ = 1, β = 0)</text></g>
  <g data-key="ffn" data-only="1"><text x="289" y="112" class="lbl" text-anchor="end">Y[1] · d = 4</text><rect x="303" y="90" width="84" height="34" rx="4" class="bg"/><text x="345.0" y="112" class="num" text-anchor="middle">−0.476</text><rect x="393" y="90" width="84" height="34" rx="4" class="bg"/><text x="435.0" y="112" class="num" text-anchor="middle">0.098</text><rect x="483" y="90" width="84" height="34" rx="4" class="bg"/><text x="525.0" y="112" class="num" text-anchor="middle">−1.170</text><rect x="573" y="90" width="84" height="34" rx="4" class="bg"/><text x="615.0" y="112" class="num" text-anchor="middle">1.547</text><path d="M480 130 V180" class="edge" marker-end="url(#en-arw)"/><text x="492" y="160" class="cap">W₁, ReLU</text><text x="189" y="212" class="lbl" text-anchor="end">скрыто · 8</text><rect x="203" y="190" width="64" height="34" rx="4" class="by"/><text x="235.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="273" y="190" width="64" height="34" rx="4" class="by"/><text x="305.0" y="212" class="num" text-anchor="middle">0.230</text><rect x="343" y="190" width="64" height="34" rx="4" class="by"/><text x="375.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="413" y="190" width="64" height="34" rx="4" class="by"/><text x="445.0" y="212" class="num" text-anchor="middle">0.904</text><rect x="483" y="190" width="64" height="34" rx="4" class="by"/><text x="515.0" y="212" class="num" text-anchor="middle">0.470</text><rect x="553" y="190" width="64" height="34" rx="4" class="by"/><text x="585.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="623" y="190" width="64" height="34" rx="4" class="by"/><text x="655.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="693" y="190" width="64" height="34" rx="4" class="by"/><text x="725.0" y="212" class="num" text-anchor="middle">0.288</text><path d="M480 230 V280" class="edge" marker-end="url(#en-arw)"/><text x="492" y="260" class="cap">W₂</text><text x="289" y="312" class="lbl" text-anchor="end">F[1] · d = 4</text><rect x="303" y="290" width="84" height="34" rx="4" class="bg"/><text x="345.0" y="312" class="num" text-anchor="middle">0.072</text><rect x="393" y="290" width="84" height="34" rx="4" class="bg"/><text x="435.0" y="312" class="num" text-anchor="middle">0.116</text><rect x="483" y="290" width="84" height="34" rx="4" class="bg"/><text x="525.0" y="312" class="num" text-anchor="middle">0.028</text><rect x="573" y="290" width="84" height="34" rx="4" class="bg"/><text x="615.0" y="312" class="num" text-anchor="middle">0.168</text><text x="203" y="370" class="cap">расширяемся до d_ff = 8, ReLU обнуляет половину, возвращаемся к d = 4</text><text x="203" y="392" class="cap">одна и та же сеть на каждой позиции — соседи здесь не участвуют</text></g>
  <g data-key="an2" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">Y[1] · до FFN</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">−0.476</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">0.098</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">−1.170</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.547</text><text x="346" y="202" class="lbl" text-anchor="end">+ F[1] · Feed Forward</text><rect x="360" y="180" width="84" height="34" rx="4" class="by"/><text x="402.0" y="202" class="num" text-anchor="middle">0.072</text><rect x="450" y="180" width="84" height="34" rx="4" class="by"/><text x="492.0" y="202" class="num" text-anchor="middle">0.116</text><rect x="540" y="180" width="84" height="34" rx="4" class="by"/><text x="582.0" y="202" class="num" text-anchor="middle">0.028</text><rect x="630" y="180" width="84" height="34" rx="4" class="by"/><text x="672.0" y="202" class="num" text-anchor="middle">0.168</text><text x="346" y="272" class="lbl" text-anchor="end">= сумма</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">−0.404</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">0.214</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">−1.142</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">1.715</text><path d="M540 290 V330" class="edge" marker-end="url(#en-arw)"/><text x="552" y="316" class="cap">LayerNorm</text><text x="346" y="362" class="lbl-b" text-anchor="end">H¹[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">−0.476</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">0.113</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.178</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.541</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#en-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">короткий путь</text><text x="360" y="420" class="cap">LayerNorm: среднее ≈ 0, стандартное отклонение ≈ 1 (γ = 1, β = 0)</text></g>
  <g data-key="stack" data-only="1"><text x="320" y="540" class="lbl" text-anchor="middle">X · [3, 4]</text><path d="M320 522 V494" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="450" width="240" height="40" rx="8" class="bx"/><text x="320" y="476" class="lbl" text-anchor="middle">Encoder 1</text><path d="M320 450 V432" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="390" width="240" height="40" rx="8" class="bx"/><text x="320" y="416" class="lbl" text-anchor="middle">Encoder 2</text><path d="M320 390 V372" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="330" width="240" height="40" rx="8" class="bx"/><text x="320" y="356" class="lbl" text-anchor="middle">Encoder 3</text><path d="M320 330 V312" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="270" width="240" height="40" rx="8" class="bx"/><text x="320" y="296" class="lbl" text-anchor="middle">Encoder 4</text><path d="M320 270 V252" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="210" width="240" height="40" rx="8" class="bx"/><text x="320" y="236" class="lbl" text-anchor="middle">Encoder 5</text><path d="M320 210 V192" class="edge" marker-end="url(#en-arw)"/><rect x="200" y="150" width="240" height="40" rx="8" class="bx"/><text x="320" y="176" class="lbl" text-anchor="middle">Encoder 6</text><path d="M320 150 V124" class="edge" marker-end="url(#en-arw)"/><text x="320" y="112" class="lbl-b" text-anchor="middle">Hᴺ · [3, 4]</text><text x="40" y="300" class="cap">N = 6 в оригинале;</text><text x="40" y="318" class="cap">у каждого слоя</text><text x="40" y="336" class="cap">свои веса</text></g>
  <g data-key="mem" data-only="1"><path d="M392 106 H540 V470" fill="none" stroke="#C30B0A" stroke-width="2"/><path d="M540 470 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="450" width="240" height="40" rx="8" class="off"/><text x="740" y="476" class="lbl" text-anchor="middle">Decoder 1 · cross-attn</text><path d="M540 410 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="390" width="240" height="40" rx="8" class="off"/><text x="740" y="416" class="lbl" text-anchor="middle">Decoder 2 · cross-attn</text><path d="M540 350 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="330" width="240" height="40" rx="8" class="off"/><text x="740" y="356" class="lbl" text-anchor="middle">Decoder 3 · cross-attn</text><path d="M540 290 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="270" width="240" height="40" rx="8" class="off"/><text x="740" y="296" class="lbl" text-anchor="middle">Decoder 4 · cross-attn</text><path d="M540 230 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="210" width="240" height="40" rx="8" class="off"/><text x="740" y="236" class="lbl" text-anchor="middle">Decoder 5 · cross-attn</text><path d="M540 170 H616" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#en-arwr)"/><rect x="620" y="150" width="240" height="40" rx="8" class="off"/><text x="740" y="176" class="lbl" text-anchor="middle">Decoder 6 · cross-attn</text><text x="552" y="96" class="cap" style="fill:#a30908;font-weight:700">K, V ← Hᴺ для каждого слоя декодера</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Один слой энкодера: четыре блока</h4>
      <p>Подсвечен слой энкодера: Multi-Head Attention, Add &amp; Norm, Feed Forward и снова Add &amp; Norm. Рамка «× N» напоминает, что таких слоёв несколько.</p>
    </div>
    <div class="step-panel" data-on="x" data-focus="x">
      <div class="step-kicker">Шаг 2 · вход</div>
      <h4>Слой получает всю матрицу X</h4>
      <p>Вход первого слоя — <code>X = Embedding + PE</code> формы <code>[3, 4]</code>. Дальше проследим строку «are».</p>
    </div>
    <div class="step-panel" data-on="att" data-focus="att">
      <div class="step-kicker">Шаг 3 · self-attention</div>
      <h4>Внимание смешивает позиции</h4>
      <p>Запрос «are» распределяет вес по всем трём позициям; больше половины он оставил себе. Выход <code>A[1]</code> — взвешенная сумма строк. Только здесь токены узнают друг о друге.</p>
    </div>
    <div class="step-panel" data-on="an1" data-focus="an1">
      <div class="step-kicker">Шаг 4 · Add &amp; Norm</div>
      <h4>Прибавляем вход обратно и нормализуем</h4>
      <p>Исходный <code>X[1]</code> идёт в обход внимания и складывается с <code>A[1]</code>. Масштаб суммы вырос, LayerNorm возвращает его к среднему 0 и разбросу 1. Подробно — в отдельном интерактиве ниже.</p>
    </div>
    <div class="step-panel" data-on="ffn" data-focus="ffn">
      <div class="step-kicker">Шаг 5 · Feed Forward</div>
      <h4>Одна маленькая сеть для каждой позиции</h4>
      <p><code>FFN(y) = max(0, yW₁ + b₁)W₂ + b₂</code>: вектор расширяется до 8 координат, проходит ReLU и сжимается обратно до 4. Позиции здесь не смешиваются.</p>
    </div>
    <div class="step-panel" data-on="an2" data-focus="an2">
      <div class="step-kicker">Шаг 6 · второе Add &amp; Norm</div>
      <h4>Тот же приём вокруг Feed Forward</h4>
      <p><code>Y[1]</code> обходит Feed Forward, складывается с его выходом и снова нормализуется. Получаем <code>H¹[1]</code> — строку выхода первого слоя той же ширины 4.</p>
    </div>
    <div class="step-panel" data-on="stack" data-focus="stack">
      <div class="step-kicker">Шаг 7 · стек</div>
      <h4>Слои повторяются N раз</h4>
      <p>Выход Encoder 1 становится входом Encoder 2 и так далее. Устройство одно, параметры у каждого слоя свои, форма <code>[3, 4]</code> сохраняется на всём пути.</p>
    </div>
    <div class="step-panel" data-on="stack mem" data-focus="mem">
      <div class="step-kicker">Шаг 8 · память</div>
      <h4>Последний выход уходит во все декодеры</h4>
      <p>Выход последнего энкодера <code>Hᴺ</code> — память исходной фразы. Каждый слой декодера строит из неё ключи и значения для cross-attention; запросы приходят из самого декодера.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<h3 id="add-norm">Add &amp; Norm подробно</h3>

<p>В схеме слоя Add &amp; Norm выглядит скромной полоской между большими блоками, но без неё стек из шести слоёв просто не обучился бы. Внутри две независимые идеи. <strong>Add</strong> — residual-связь: вход подслоя прибавляется к его выходу, и у сигнала появляется короткий путь в обход. <strong>Norm</strong> — LayerNorm: каждая строка приводится к нулевому среднему и единичному разбросу, а затем масштабируется обучаемыми γ и β.</p>

<div class="math-display" data-tex="y = \mathrm{LayerNorm}\big(x + \mathrm{Sublayer}(x)\big), \qquad \mathrm{LayerNorm}(s) = \gamma \odot \frac{s - \mu}{\sqrt{\sigma^2 + \varepsilon}} + \beta"></div>

<p>Residual решает проблему глубины. Подслою не нужно заново воспроизводить вектор — достаточно выучить к нему поправку, а градиент по короткому пути доходит до нижних слоёв, не затухая в каждом блоке. LayerNorm решает проблему масштаба: после каждого сложения числа растут, и без нормировки через несколько слоёв softmax и ReLU работали бы в невыгодных режимах. Статистика <code>μ</code> и <code>σ</code> считается по координатам одного токена — поэтому ей всё равно, сколько токенов во фразе и сколько фраз в батче.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · первое Add &amp; Norm для «are»</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Сложение и нормировка одной строки</div>
    <div class="worked-trace-row"><div class="worked-trace-name">сумма</div><div class="math-display worked-trace-math" data-tex="s = (1.205,\;1.844,\;0.433,\;3.455)"></div><div class="worked-trace-note">X[1] + A[1]</div></div>
    <div class="worked-trace-row"><div class="worked-trace-name">μ, σ</div><div class="math-display worked-trace-math" data-tex="\mu = 1.734,\quad \sigma = 1.112"></div><div class="worked-trace-note">по четырём координатам строки</div></div>
    <div class="worked-trace-row"><div class="worked-trace-name">LN</div><div class="math-display worked-trace-math" data-tex="(s-\mu)/\sigma = (-0.476,\;0.098,\;-1.170,\;1.547)"></div><div class="worked-trace-note">γ = 1, β = 0</div></div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> порядок координат сохранился — самая большая осталась самой большой, — но масштаб вернулся к единичному. Следующий подслой получит числа той же величины, что и первый, сколько бы слоёв ни было ниже.</p>
</div>

<div class="callout-blue"><strong>Порядок, который потом изменили:</strong> в оригинальной статье нормализация стоит <em>после</em> сложения — это Post-LN, и именно он показан во всех интерактивах. Почти все современные реализации используют Pre-LN: <code>x + f(LayerNorm(x))</code>. Причина практическая — Post-LN требует аккуратного разогрева learning rate, иначе глубокий стек плохо сходится. Набор блоков при этом тот же.</div>

<p>Посмотрим пошагово: где стоит блок, что делает сложение, по какой оси считается нормировка и как числа меняются на каждом шаге.</p>

<div class="stage" id="stageAn" tabindex="0">
  <div class="stage-figure">
<svg id="an" viewBox="0 0 960 560" role="img" aria-label="Add и Norm: схема трансформера, затем residual, LayerNorm по шагам и Pre-LN">
  <style>
    #an { font-family: Helvetica, Arial, sans-serif; }
    #an text { fill: #111111; }
    #an .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #an .offt { fill: #A29C92; font-size: 14px; }
    #an .offs { fill: #A29C92; font-size: 12px; }
    #an .is-focus .offt, #an .is-focus .offs { font-weight: 400; }
    #an .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #an .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #an .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #an .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #an .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #an .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #an .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #an .lbl { font-size: 15px; }
    #an .lbl-b { font-size: 15px; font-weight: 700; }
    #an .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #an .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #an .cap { font-size: 13px; fill: #5E5850; }
    #an .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #an .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #an .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #an .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #an .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #an .band-y { fill: #FFF3C4; }
    #an .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="an-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="an-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="an-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="an-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#an-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#an-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="layer" data-only="1"><text x="550" y="100" class="lbl-b" text-anchor="middle">N × Encoder Layer</text><rect x="210" y="150" width="680" height="250" rx="12" fill="#F7F6F2" stroke="#D9D5CC" stroke-width="1.4"/><path d="M40 300 H930" stroke="#5E5850" stroke-width="2.4" fill="none"/><path d="M930 300 H945" class="edge" marker-end="url(#an-arw)"/><rect x="70" y="262" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="96" y="262" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="122" y="262" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="148" y="262" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="70" y="288" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="96" y="288" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="122" y="288" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="148" y="288" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="70" y="314" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="96" y="314" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="122" y="314" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><rect x="148" y="314" width="24" height="24" fill="#F0F6FC" stroke="#CAD7E5"/><text x="122" y="360" class="cap" text-anchor="middle">X · [L, d]</text><rect x="260" y="230" width="130" height="140" rx="8" class="br"/><text x="325" y="296" class="lbl-b" text-anchor="middle">Multi-Head</text><text x="325" y="316" class="lbl-b" text-anchor="middle">Attention</text><rect x="415" y="230" width="70" height="140" rx="8" class="bx" style="stroke-width:2.6"/><text x="450" y="296" class="lbl-b" text-anchor="middle">Add &amp;</text><text x="450" y="316" class="lbl-b" text-anchor="middle">Norm</text><rect x="530" y="230" width="130" height="140" rx="8" class="by"/><text x="595" y="306" class="lbl-b" text-anchor="middle">Feed Forward</text><rect x="685" y="230" width="70" height="140" rx="8" class="bx" style="stroke-width:2.6"/><text x="720" y="296" class="lbl-b" text-anchor="middle">Add &amp;</text><text x="720" y="316" class="lbl-b" text-anchor="middle">Norm</text><path d="M232 300 C 200 140, 420 140, 446 226" fill="none" stroke="#C29E08" stroke-width="2.4" marker-end="url(#an-arwy)"/><path d="M505 300 C 480 140, 690 140, 716 226" fill="none" stroke="#C29E08" stroke-width="2.4" marker-end="url(#an-arwy)"/><text x="560" y="136" class="cap" style="fill:#8C7106" text-anchor="middle">жёлтые дуги — короткий путь: x в обход подслоя</text><text x="780" y="340" class="cap">в следующий слой</text><text x="780" y="358" class="cap">[L, d]</text><text x="210" y="440" class="cap">у каждого подслоя своя обёртка: y = LayerNorm(x + Sublayer(x)); в энкодере их две, в декодере — три</text></g>
  <g data-key="add" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">x = X[1]</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">0.541</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">1.040</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">0.210</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.800</text><text x="346" y="202" class="lbl" text-anchor="end">+ Sublayer(x) = A[1]</text><rect x="360" y="180" width="84" height="34" rx="4" class="br"/><text x="402.0" y="202" class="num" text-anchor="middle">0.664</text><rect x="450" y="180" width="84" height="34" rx="4" class="br"/><text x="492.0" y="202" class="num" text-anchor="middle">0.803</text><rect x="540" y="180" width="84" height="34" rx="4" class="br"/><text x="582.0" y="202" class="num" text-anchor="middle">0.223</text><rect x="630" y="180" width="84" height="34" rx="4" class="br"/><text x="672.0" y="202" class="num" text-anchor="middle">1.655</text><text x="346" y="272" class="lbl" text-anchor="end">= x + A[1]</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">1.205</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">1.844</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">0.433</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">3.455</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#an-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">x без изменений</text><text x="200" y="350" class="lbl">подслой учит только поправку к x, а не весь вектор заново;</text><text x="200" y="376" class="lbl">градиент по короткому пути проходит к нижним слоям без затухания</text></g>
  <g data-key="shape" data-only="1"><text x="120" y="110" class="ttl">сложение требует одинаковой формы</text><rect x="120" y="140" width="24" height="24" class="bx"/><rect x="146" y="140" width="24" height="24" class="bx"/><rect x="172" y="140" width="24" height="24" class="bx"/><rect x="198" y="140" width="24" height="24" class="bx"/><rect x="120" y="166" width="24" height="24" class="bx"/><rect x="146" y="166" width="24" height="24" class="bx"/><rect x="172" y="166" width="24" height="24" class="bx"/><rect x="198" y="166" width="24" height="24" class="bx"/><rect x="120" y="192" width="24" height="24" class="bx"/><rect x="146" y="192" width="24" height="24" class="bx"/><rect x="172" y="192" width="24" height="24" class="bx"/><rect x="198" y="192" width="24" height="24" class="bx"/><text x="252" y="182" class="shape">+</text><rect x="280" y="140" width="24" height="24" class="br"/><rect x="306" y="140" width="24" height="24" class="br"/><rect x="332" y="140" width="24" height="24" class="br"/><rect x="358" y="140" width="24" height="24" class="br"/><rect x="280" y="166" width="24" height="24" class="br"/><rect x="306" y="166" width="24" height="24" class="br"/><rect x="332" y="166" width="24" height="24" class="br"/><rect x="358" y="166" width="24" height="24" class="br"/><rect x="280" y="192" width="24" height="24" class="br"/><rect x="306" y="192" width="24" height="24" class="br"/><rect x="332" y="192" width="24" height="24" class="br"/><rect x="358" y="192" width="24" height="24" class="br"/><text x="412" y="182" class="shape">=</text><rect x="440" y="140" width="24" height="24" class="by"/><rect x="466" y="140" width="24" height="24" class="by"/><rect x="492" y="140" width="24" height="24" class="by"/><rect x="518" y="140" width="24" height="24" class="by"/><rect x="440" y="166" width="24" height="24" class="by"/><rect x="466" y="166" width="24" height="24" class="by"/><rect x="492" y="166" width="24" height="24" class="by"/><rect x="518" y="166" width="24" height="24" class="by"/><rect x="440" y="192" width="24" height="24" class="by"/><rect x="466" y="192" width="24" height="24" class="by"/><rect x="492" y="192" width="24" height="24" class="by"/><rect x="518" y="192" width="24" height="24" class="by"/><text x="560" y="182" class="lbl-b" style="fill:#4d7a14">✓ [3, 4] + [3, 4]</text><rect x="120" y="280" width="24" height="24" class="bx"/><rect x="146" y="280" width="24" height="24" class="bx"/><rect x="172" y="280" width="24" height="24" class="bx"/><rect x="198" y="280" width="24" height="24" class="bx"/><rect x="120" y="306" width="24" height="24" class="bx"/><rect x="146" y="306" width="24" height="24" class="bx"/><rect x="172" y="306" width="24" height="24" class="bx"/><rect x="198" y="306" width="24" height="24" class="bx"/><rect x="120" y="332" width="24" height="24" class="bx"/><rect x="146" y="332" width="24" height="24" class="bx"/><rect x="172" y="332" width="24" height="24" class="bx"/><rect x="198" y="332" width="24" height="24" class="bx"/><text x="252" y="322" class="shape">+</text><rect x="280" y="280" width="24" height="24" class="br"/><rect x="306" y="280" width="24" height="24" class="br"/><rect x="332" y="280" width="24" height="24" class="br"/><rect x="358" y="280" width="24" height="24" class="br"/><rect x="384" y="280" width="24" height="24" class="br"/><rect x="410" y="280" width="24" height="24" class="br"/><rect x="436" y="280" width="24" height="24" class="br"/><rect x="462" y="280" width="24" height="24" class="br"/><rect x="280" y="306" width="24" height="24" class="br"/><rect x="306" y="306" width="24" height="24" class="br"/><rect x="332" y="306" width="24" height="24" class="br"/><rect x="358" y="306" width="24" height="24" class="br"/><rect x="384" y="306" width="24" height="24" class="br"/><rect x="410" y="306" width="24" height="24" class="br"/><rect x="436" y="306" width="24" height="24" class="br"/><rect x="462" y="306" width="24" height="24" class="br"/><rect x="280" y="332" width="24" height="24" class="br"/><rect x="306" y="332" width="24" height="24" class="br"/><rect x="332" y="332" width="24" height="24" class="br"/><rect x="358" y="332" width="24" height="24" class="br"/><rect x="384" y="332" width="24" height="24" class="br"/><rect x="410" y="332" width="24" height="24" class="br"/><rect x="436" y="332" width="24" height="24" class="br"/><rect x="462" y="332" width="24" height="24" class="br"/><text x="500" y="322" class="lbl-b" style="fill:#C30B0A">× [3, 4] + [3, 8] — не сложить</text><text x="120" y="420" class="cap">поэтому каждый подслой обязан вернуть ширину d_model: FFN расширяется до d_ff и сжимается обратно,</text><text x="120" y="440" class="cap">головы внимания склеиваются и проходят Wᴼ — d_model общая ширина всего основного пути</text></g>
  <g data-key="axis" data-only="1"><text x="300" y="120" class="ttl">x + Sublayer(x) для всех токенов · [3, 4]</text><text x="342.0" y="142" class="cap" text-anchor="middle">x1</text><text x="432.0" y="142" class="cap" text-anchor="middle">x2</text><text x="522.0" y="142" class="cap" text-anchor="middle">x3</text><text x="612.0" y="142" class="cap" text-anchor="middle">x4</text><text x="288" y="172.0" class="lbl" text-anchor="end">You</text><rect x="300" y="150" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="172.0" class="num" text-anchor="middle">0.637</text><rect x="390" y="150" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="172.0" class="num" text-anchor="middle">1.150</text><rect x="480" y="150" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="172.0" class="num" text-anchor="middle">1.230</text><rect x="570" y="150" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="172.0" class="num" text-anchor="middle">2.329</text><rect x="296" y="186" width="362" height="42" rx="6" class="band-y"/><text x="288" y="212.0" class="lbl" text-anchor="end">are</text><rect x="300" y="190" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="212.0" class="num" text-anchor="middle">1.205</text><rect x="390" y="190" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="212.0" class="num" text-anchor="middle">1.844</text><rect x="480" y="190" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="212.0" class="num" text-anchor="middle">0.433</text><rect x="570" y="190" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="212.0" class="num" text-anchor="middle">3.455</text><text x="288" y="252.0" class="lbl" text-anchor="end">welcome</text><rect x="300" y="230" width="84" height="34" rx="4" class="cell" /><text x="342.0" y="252.0" class="num" text-anchor="middle">3.258</text><rect x="390" y="230" width="84" height="34" rx="4" class="cell" /><text x="432.0" y="252.0" class="num" text-anchor="middle">−0.342</text><rect x="480" y="230" width="84" height="34" rx="4" class="cell" /><text x="522.0" y="252.0" class="num" text-anchor="middle">−0.203</text><rect x="570" y="230" width="84" height="34" rx="4" class="cell" /><text x="612.0" y="252.0" class="num" text-anchor="middle">2.818</text><rect x="296" y="146" width="87" height="120" rx="6" fill="none" stroke="#9A948A" stroke-width="1.6" stroke-dasharray="5 4"/><path d="M660 207 H700" class="edge-y" marker-end="url(#an-arwy)"/><text x="710" y="202" class="lbl-b" style="fill:#8C7106">LayerNorm</text><text x="710" y="222" class="cap">по строке: 4 координаты</text><text x="710" y="240" class="cap">одного токена</text><text x="300" y="300" class="cap">пунктир — BatchNorm считал бы по столбцу, через токены и батч; трансформер так не делает:</text><text x="300" y="320" class="cap">статистика не зависит ни от длины фразы, ни от соседних примеров, ни от PAD</text></g>
  <g data-key="mean" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">x + A[1]</text><rect x="360" y="110" width="84" height="34" rx="4" class="by"/><text x="402.0" y="132" class="num" text-anchor="middle">1.205</text><rect x="450" y="110" width="84" height="34" rx="4" class="by"/><text x="492.0" y="132" class="num" text-anchor="middle">1.844</text><rect x="540" y="110" width="84" height="34" rx="4" class="by"/><text x="582.0" y="132" class="num" text-anchor="middle">0.433</text><rect x="630" y="110" width="84" height="34" rx="4" class="by"/><text x="672.0" y="132" class="num" text-anchor="middle">3.455</text><text x="360" y="196" class="lbl">μ = (1.205 + 1.844 + 0.433 + 3.455) / 4 = 1.734</text><text x="346" y="252" class="lbl" text-anchor="end">x − μ</text><rect x="360" y="230" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="252" class="num" text-anchor="middle">−0.529</text><rect x="450" y="230" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="252" class="num" text-anchor="middle">0.110</text><rect x="540" y="230" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="252" class="num" text-anchor="middle">−1.301</text><rect x="630" y="230" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="252" class="num" text-anchor="middle">1.721</text><text x="360" y="310" class="cap">после вычитания среднее строки равно нулю; разброс пока прежний</text></g>
  <g data-key="std" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">x − μ</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">−0.529</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">0.110</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">−1.301</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.721</text><text x="360" y="196" class="lbl">σ = √(mean((x − μ)²) + ε) = √1.236 = 1.112</text><text x="346" y="252" class="lbl-b" text-anchor="end">(x − μ) / σ</text><rect x="360" y="230" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="252" class="num" text-anchor="middle">−0.476</text><rect x="450" y="230" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="252" class="num" text-anchor="middle">0.098</text><rect x="540" y="230" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="252" class="num" text-anchor="middle">−1.170</text><rect x="630" y="230" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="252" class="num" text-anchor="middle">1.547</text><text x="360" y="304" class="cap">теперь среднее 0 и отклонение 1:</text><text x="360" y="322" class="cap">координата 3.455 превратилась в 1.547</text><line x1="360" x2="900" y1="470" y2="470" stroke="#9A948A"/><rect x="386" y="424.2" width="30" height="45.8" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><rect x="424" y="470.0" width="30" height="18.1" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><rect x="516" y="399.9" width="30" height="70.1" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><rect x="554" y="466.3" width="30" height="3.7" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><rect x="646" y="453.5" width="30" height="16.5" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><rect x="684" y="470.0" width="30" height="44.5" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><rect x="776" y="338.7" width="30" height="131.3" fill="#FFFBEB" stroke="#C29E08" stroke-width="1.4"/><rect x="814" y="411.2" width="30" height="58.8" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4"/><text x="200" y="440" class="cap">жёлтый — до,</text><text x="200" y="458" class="cap">зелёный — после</text></g>
  <g data-key="gb" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">ŷ</text><rect x="360" y="110" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="132" class="num" text-anchor="middle">−0.476</text><rect x="450" y="110" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="132" class="num" text-anchor="middle">0.098</text><rect x="540" y="110" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="132" class="num" text-anchor="middle">−1.170</text><rect x="630" y="110" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="132" class="num" text-anchor="middle">1.547</text><text x="346" y="202" class="lbl" text-anchor="end">× γ</text><rect x="360" y="180" width="84" height="34" rx="4" class="by"/><text x="402.0" y="202" class="num" text-anchor="middle">1.0</text><rect x="450" y="180" width="84" height="34" rx="4" class="by"/><text x="492.0" y="202" class="num" text-anchor="middle">1.0</text><rect x="540" y="180" width="84" height="34" rx="4" class="by"/><text x="582.0" y="202" class="num" text-anchor="middle">1.0</text><rect x="630" y="180" width="84" height="34" rx="4" class="by"/><text x="672.0" y="202" class="num" text-anchor="middle">1.0</text><text x="346" y="272" class="lbl" text-anchor="end">+ β</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">0.0</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">0.0</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">0.0</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">0.0</text><text x="346" y="362" class="lbl-b" text-anchor="end">Y[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">−0.476</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">0.098</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.170</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.547</text><text x="360" y="420" class="cap">γ и β — обучаемые векторы длины d; здесь γ = 1, β = 0, и ŷ не меняется.</text><text x="360" y="440" class="cap">Обученная сеть может вернуть координате нужный масштаб и сдвиг.</text></g>
  <g data-key="pre" data-only="1"><text x="60" y="90" class="lbl-b">Post-LN · оригинальная статья: LN(x + Sublayer(x))</text><path d="M60 170 H880" stroke="#5E5850" stroke-width="2" fill="none"/><path d="M880 170 H900" class="edge" marker-end="url(#an-arw)"/><text x="70" y="196" class="cap">x</text><rect x="250" y="146" width="170" height="48" rx="8" class="br"/><text x="335.0" y="175" class="lbl-b" text-anchor="middle">Sublayer</text><circle cx="520" cy="170" r="16" fill="#fff" stroke="#C29E08" stroke-width="2"/><text x="520" y="176" class="lbl-b" text-anchor="middle">+</text><rect x="600" y="146" width="150" height="48" rx="8" class="bx"/><text x="675.0" y="175" class="lbl-b" text-anchor="middle">LayerNorm</text><path d="M150 170 C 150 110, 520 110, 520 152" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#an-arwy)"/><text x="60" y="280" class="lbl-b">Pre-LN · современные модели: x + Sublayer(LN(x))</text><path d="M60 360 H880" stroke="#5E5850" stroke-width="2" fill="none"/><path d="M880 360 H900" class="edge" marker-end="url(#an-arw)"/><text x="70" y="386" class="cap">x</text><rect x="220" y="336" width="150" height="48" rx="8" class="bx"/><text x="295.0" y="365" class="lbl-b" text-anchor="middle">LayerNorm</text><rect x="420" y="336" width="170" height="48" rx="8" class="br"/><text x="505.0" y="365" class="lbl-b" text-anchor="middle">Sublayer</text><circle cx="680" cy="360" r="16" fill="#fff" stroke="#C29E08" stroke-width="2"/><text x="680" y="366" class="lbl-b" text-anchor="middle">+</text><path d="M150 360 C 150 300, 680 300, 680 342" fill="none" stroke="#C29E08" stroke-width="2.2" marker-end="url(#an-arwy)"/><text x="60" y="450" class="cap">в Pre-LN короткий путь не проходит через нормализацию вообще — градиент течёт по чистой сумме,</text><text x="60" y="470" class="cap">и глубокий стек сходится без долгого разогрева learning rate; набор блоков тот же</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Add &amp; Norm стоит после каждого подслоя</h4>
      <p>Подсвечены все Add &amp; Norm: два в слое энкодера и три в слое декодера. Это одна и та же конструкция, которая оборачивает внимание и Feed Forward.</p>
    </div>
    <div class="step-panel" data-on="layer" data-focus="layer">
      <div class="step-kicker">Шаг 2 · слой целиком</div>
      <h4>Короткий путь в обход каждого подслоя</h4>
      <p>Вход подслоя идёт двумя дорогами: через сам подслой и по дуге в обход. В блоке Add &amp; Norm они встречаются: сначала складываются, потом нормализуются. Форма <code>[L, d]</code> сохраняется.</p>
    </div>
    <div class="step-panel" data-on="add" data-focus="add">
      <div class="step-kicker">Шаг 3 · Add</div>
      <h4>Residual: x + Sublayer(x)</h4>
      <p>Подслою не нужно заново строить весь вектор — достаточно выучить поправку. Если поправка не нужна, подслою проще выдать почти ноль, чем воспроизвести x.</p>
    </div>
    <div class="step-panel" data-on="shape" data-focus="shape">
      <div class="step-kicker">Шаг 4 · условие</div>
      <h4>Складывать можно только одинаковые формы</h4>
      <p>Residual — это покоординатная сумма. Отсюда требование ко всем подслоям: на выходе та же ширина <code>d_model</code>, что и на входе.</p>
    </div>
    <div class="step-panel" data-on="axis" data-focus="axis">
      <div class="step-kicker">Шаг 5 · Norm: по какой оси</div>
      <h4>LayerNorm нормирует каждый токен отдельно</h4>
      <p>Среднее и разброс считаются по четырём координатам одной строки. Токены и примеры батча друг на друга не влияют.</p>
    </div>
    <div class="step-panel" data-on="mean" data-focus="mean">
      <div class="step-kicker">Шаг 6 · центрирование</div>
      <h4>Вычитаем среднее строки</h4>
      <p>Среднее четырёх координат суммы — 1.734. После вычитания координаты распределены вокруг нуля.</p>
    </div>
    <div class="step-panel" data-on="std" data-focus="std">
      <div class="step-kicker">Шаг 7 · масштаб</div>
      <h4>Делим на стандартное отклонение</h4>
      <p>σ = 1.112, и после деления у строки единичный разброс. Масштаб, который вырос после сложения, возвращается к норме, и следующий подслой получает числа привычной величины.</p>
    </div>
    <div class="step-panel" data-on="gb" data-focus="gb">
      <div class="step-kicker">Шаг 8 · γ и β</div>
      <h4>Обучаемый масштаб и сдвиг</h4>
      <p>Последний шаг — <code>ŷ ⊙ γ + β</code>. Нормировка не навязывается сети насильно: при необходимости она выучит γ и β и вернёт координатам нужный диапазон.</p>
    </div>
    <div class="step-panel" data-on="pre" data-focus="pre">
      <div class="step-kicker">Шаг 9 · Post-LN и Pre-LN</div>
      <h4>Где стоит нормализация</h4>
      <p>В оригинальной статье LayerNorm после суммы — это и показано во всех интерактивах. Современные модели нормируют вход подслоя, а сумму оставляют чистой.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<h3 id="ffn">Feed Forward подробно</h3>

<p>Self-attention — единственное место слоя, где токены обмениваются информацией. Feed Forward отвечает за вторую половину работы: когда каждый токен уже собрал нужное от соседей, его вектор нужно <strong>переработать</strong> — распознать в нём признаки и дописать поправку. Этим и занят второй подслой энкодера (и третий подслой декодера).</p>

<p>Главное свойство FFN — он <strong>позиционный</strong> (position-wise). На вход приходит матрица <code>Y</code> формы <code>[L, d_model]</code>, но строки между собой не смешиваются: одна и та же маленькая сеть с одними и теми же весами применяется к каждой строке отдельно. Можно представить, что над каждым токеном стоит своя копия сети — три копии для «You are welcome», — и все копии одинаковые.</p>

<p>Сама сеть — два линейных слоя с ReLU между ними. Первый расширяет вектор с <code>d_model</code> до <code>d_ff</code> координат (здесь с 4 до 8, в оригинальной модели с 512 до 2048), ReLU обнуляет отрицательные, второй сжимает обратно до <code>d_model</code>:</p>

<div class="math-display" data-tex="\mathrm{FFN}(y) = \max(0,\; y W_1 + b_1)\, W_2 + b_2, \qquad W_1 \in \mathbb{R}^{d_{\text{model}} \times d_{\text{ff}}},\;\; W_2 \in \mathbb{R}^{d_{\text{ff}} \times d_{\text{model}}}"></div>

<p>Матричная запись прячет, что происходит внутри. Прочитаем её по нейронам. У каждого из <code>d_ff</code> скрытых нейронов есть свой столбец <code>W₁[:, j]</code> — шаблон, с которым нейрон сравнивает вход через скалярное произведение. Если отклик после смещения положительный, нейрон включается и дописывает в выход свою строку <code>W₂[j, :]</code>, умноженную на силу отклика. Если отрицательный — ReLU превращает его в ноль, и нейрон молчит. Выход FFN — это сумма строк включившихся нейронов:</p>

<div class="math-display" data-tex="\mathrm{FFN}(y) = \sum_{j=1}^{d_{\text{ff}}} \underbrace{\max\big(0,\; y \cdot W_1[:, j] + b_{1,j}\big)}_{h_j \text{ — отклик нейрона } j}\; W_2[j, :] \;+\; b_2"></div>

<p>Отсюда понятно, зачем расширение: <code>d_ff</code> — это число шаблонов, которые слой умеет распознавать, и число поправок, которые он умеет записывать. Поэтому в работах по интерпретируемости FFN описывают как память «ключ — значение»: столбцы <code>W₁</code> играют роль ключей, строки <code>W₂</code> — значений. И это самый тяжёлый подслой: в оригинальной модели у FFN 2.10 млн весов на слой против 1.05 млн у multi-head attention.</p>

<div class="callout-blue"><strong>Позиционный — не значит «без контекста»:</strong> FFN не видит соседних токенов, но к его входу строка уже прошла через self-attention и несёт в себе смесь всей фразы. Разделение труда такое: внимание переносит информацию между позициями, Feed Forward перерабатывает её внутри позиции. Поэтому слои и чередуются — обмен, переработка, снова обмен.</div>

<div class="callout-red"><strong>Без ReLU расширение ничего бы не дало:</strong> два линейных слоя подряд — это один линейный слой. Без нелинейности <code>(yW₁ + b₁)W₂ + b₂ = y(W₁W₂) + (b₁W₂ + b₂)</code>, где <code>W₁W₂</code> — обычная матрица 4 × 4, и восемь скрытых координат превратились бы в лишние вычисления. Именно ReLU, выключая часть нейронов, делает ответ зависящим от того, <em>какой</em> пришёл вход.</div>

<div class="worked-example">
  <div class="worked-label">Числовой пример · FFN для токена are</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Один проход через второй подслой</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">вход y</div>
      <div class="math-display worked-trace-math" data-tex="y = (-0.476,\;0.098,\;-1.170,\;1.547)"></div>
      <div class="worked-trace-note">строка «are» после первого Add &amp; Norm</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">yW₁ + b₁</div>
      <div class="math-display worked-trace-math" data-tex="z = (-1.031,\;0.230,\;-1.049,\;0.904,\;0.470,\;-1.295,\;-1.038,\;0.288)"></div>
      <div class="worked-trace-note">восемь откликов, половина отрицательные</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">ReLU</div>
      <div class="math-display worked-trace-math" data-tex="h = (0,\;0.230,\;0,\;0.904,\;0.470,\;0,\;0,\;0.288)"></div>
      <div class="worked-trace-note">включились нейроны 2, 4, 5 и 8</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">hW₂ + b₂</div>
      <div class="math-display worked-trace-math" data-tex="F = (0.072,\;0.116,\;0.028,\;0.168)"></div>
      <div class="worked-trace-note">снова 4 координаты — можно складывать с y</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> вектор «are» сравнили с восемью шаблонами, откликнулись четыре. Выход — это их четыре строки <code>W₂</code> с весами 0.230, 0.904, 0.470 и 0.288 плюс <code>b₂</code>. Вклады во многом гасят друг друга, и длина <code>F</code> — 0.22 против 2.00 у <code>y</code>, почти вдесятеро меньше: FFN вносит поправку, а не переписывает вектор. После сложения с <code>y</code> и LayerNorm из этой поправки получается <code>H¹[1] = (−0.476, 0.113, −1.178, 1.541)</code>.</p>
</div>

<p>Посмотрим пошагово: где стоит блок, как он размножается по токенам, что происходит внутри одного нейрона, как ReLU выбирает включившиеся и как из них собирается выход.</p>

<div class="stage" id="stageFf" tabindex="0">
  <div class="stage-figure">
<svg id="ff" viewBox="0 0 960 580" role="img" aria-label="Feed Forward: место в трансформере, отдельная копия сети на каждый токен, нейроны, ReLU, сборка выхода и размеры">
  <style>
    #ff { font-family: Helvetica, Arial, sans-serif; }
    #ff text { fill: #111111; }
    #ff .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #ff .offt { fill: #A29C92; font-size: 14px; }
    #ff .offs { fill: #A29C92; font-size: 12px; }
    #ff .is-focus .offt, #ff .is-focus .offs { font-weight: 400; }
    #ff .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #ff .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #ff .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #ff .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ff .lbl { font-size: 15px; }
    #ff .lbl-b { font-size: 15px; font-weight: 700; }
    #ff .nums { font-size: 12px; font-family: "Courier New", Courier, monospace; }
    #ff .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #ff .idx { font-size: 12px; fill: #5E5850; }
    #ff .cap { font-size: 13px; fill: #5E5850; }
    #ff .capy { font-size: 13px; fill: #8C7106; }
    #ff .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ff .muted { fill: #A29C92; }
    #ff .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #ff .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #ff .wire { stroke: #E4E1D7; stroke-width: 1; fill: none; }
    #ff .wire-y { stroke: #C29E08; stroke-width: 2; fill: none; }
    #ff .mix { stroke: #C30B0A; stroke-width: 1.1; fill: none; opacity: .55; }
    #ff .zoom { stroke: #9A948A; stroke-width: 1.4; fill: none; stroke-dasharray: 6 4; }
    #ff .nin { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ff .nh { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.4; }
    #ff .non { fill: #FFF3C4; stroke: #C29E08; stroke-width: 2.4; }
    #ff .nof { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 3 2; }
    #ff .nout { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ff .nout-on { fill: #E5F4D6; stroke: #73B222; stroke-width: 2.4; }
    #ff .pad { fill: #FFFFFF; }
    #ff .card.is-focus text { font-weight: 400; }
    #ff .card.is-focus .lbl-b { font-weight: 700; }
  </style>
  <defs>
    <marker id="ff-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="ff-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
  </defs>
  <g data-key="net" class="card">
<rect x="30" y="40" width="520" height="500" rx="12" fill="#FFFFFF" stroke="#D9D5CC" stroke-width="1.4"/>
<text x="46" y="64" class="ttl">FFN токена «are» крупно</text>
<path d="M160 446 L120.0 304" class="wire"/>
<path d="M160 446 L174.3 304" class="wire"/>
<path d="M160 446 L228.6 304" class="wire"/>
<path d="M160 446 L282.9 304" class="wire"/>
<path d="M160 446 L337.1 304" class="wire"/>
<path d="M160 446 L391.4 304" class="wire"/>
<path d="M160 446 L445.7 304" class="wire"/>
<path d="M160 446 L500.0 304" class="wire"/>
<path d="M260 446 L120.0 304" class="wire"/>
<path d="M260 446 L174.3 304" class="wire"/>
<path d="M260 446 L228.6 304" class="wire"/>
<path d="M260 446 L282.9 304" class="wire"/>
<path d="M260 446 L337.1 304" class="wire"/>
<path d="M260 446 L391.4 304" class="wire"/>
<path d="M260 446 L445.7 304" class="wire"/>
<path d="M260 446 L500.0 304" class="wire"/>
<path d="M360 446 L120.0 304" class="wire"/>
<path d="M360 446 L174.3 304" class="wire"/>
<path d="M360 446 L228.6 304" class="wire"/>
<path d="M360 446 L282.9 304" class="wire"/>
<path d="M360 446 L337.1 304" class="wire"/>
<path d="M360 446 L391.4 304" class="wire"/>
<path d="M360 446 L445.7 304" class="wire"/>
<path d="M360 446 L500.0 304" class="wire"/>
<path d="M460 446 L120.0 304" class="wire"/>
<path d="M460 446 L174.3 304" class="wire"/>
<path d="M460 446 L228.6 304" class="wire"/>
<path d="M460 446 L282.9 304" class="wire"/>
<path d="M460 446 L337.1 304" class="wire"/>
<path d="M460 446 L391.4 304" class="wire"/>
<path d="M460 446 L445.7 304" class="wire"/>
<path d="M460 446 L500.0 304" class="wire"/>
<path d="M120.0 276 L160 134" class="wire"/>
<path d="M120.0 276 L260 134" class="wire"/>
<path d="M120.0 276 L360 134" class="wire"/>
<path d="M120.0 276 L460 134" class="wire"/>
<path d="M174.3 276 L160 134" class="wire"/>
<path d="M174.3 276 L260 134" class="wire"/>
<path d="M174.3 276 L360 134" class="wire"/>
<path d="M174.3 276 L460 134" class="wire"/>
<path d="M228.6 276 L160 134" class="wire"/>
<path d="M228.6 276 L260 134" class="wire"/>
<path d="M228.6 276 L360 134" class="wire"/>
<path d="M228.6 276 L460 134" class="wire"/>
<path d="M282.9 276 L160 134" class="wire"/>
<path d="M282.9 276 L260 134" class="wire"/>
<path d="M282.9 276 L360 134" class="wire"/>
<path d="M282.9 276 L460 134" class="wire"/>
<path d="M337.1 276 L160 134" class="wire"/>
<path d="M337.1 276 L260 134" class="wire"/>
<path d="M337.1 276 L360 134" class="wire"/>
<path d="M337.1 276 L460 134" class="wire"/>
<path d="M391.4 276 L160 134" class="wire"/>
<path d="M391.4 276 L260 134" class="wire"/>
<path d="M391.4 276 L360 134" class="wire"/>
<path d="M391.4 276 L460 134" class="wire"/>
<path d="M445.7 276 L160 134" class="wire"/>
<path d="M445.7 276 L260 134" class="wire"/>
<path d="M445.7 276 L360 134" class="wire"/>
<path d="M445.7 276 L460 134" class="wire"/>
<path d="M500.0 276 L160 134" class="wire"/>
<path d="M500.0 276 L260 134" class="wire"/>
<path d="M500.0 276 L360 134" class="wire"/>
<path d="M500.0 276 L460 134" class="wire"/>
<circle cx="160" cy="460" r="14" class="nin"/>
<circle cx="260" cy="460" r="14" class="nin"/>
<circle cx="360" cy="460" r="14" class="nin"/>
<circle cx="460" cy="460" r="14" class="nin"/>
<circle cx="120.0" cy="290" r="14" class="nh"/><text x="120" y="294" class="idx" text-anchor="middle">1</text>
<circle cx="174.3" cy="290" r="14" class="nh"/><text x="174.3" y="294" class="idx" text-anchor="middle">2</text>
<circle cx="228.6" cy="290" r="14" class="nh"/><text x="228.6" y="294" class="idx" text-anchor="middle">3</text>
<circle cx="282.9" cy="290" r="14" class="nh"/><text x="282.9" y="294" class="idx" text-anchor="middle">4</text>
<circle cx="337.1" cy="290" r="14" class="nh"/><text x="337.1" y="294" class="idx" text-anchor="middle">5</text>
<circle cx="391.4" cy="290" r="14" class="nh"/><text x="391.4" y="294" class="idx" text-anchor="middle">6</text>
<circle cx="445.7" cy="290" r="14" class="nh"/><text x="445.7" y="294" class="idx" text-anchor="middle">7</text>
<circle cx="500.0" cy="290" r="14" class="nh"/><text x="500" y="294" class="idx" text-anchor="middle">8</text>
<circle cx="160" cy="120" r="14" class="nout"/>
<circle cx="260" cy="120" r="14" class="nout"/>
<circle cx="360" cy="120" r="14" class="nout"/>
<circle cx="460" cy="120" r="14" class="nout"/>
<text x="44" y="465" class="lbl-b">y</text><text x="44" y="295" class="lbl-b">h</text><text x="44" y="125" class="lbl-b">F</text>
<text x="490" y="465" class="cap">ℝ⁴</text><text x="522" y="295" class="cap">ℝ⁸</text><text x="490" y="125" class="cap">ℝ⁴</text>
<text x="40" y="382" class="cap">W₁, b₁</text><text x="40" y="212" class="cap">W₂, b₂</text>
<text x="290" y="566" class="cap" text-anchor="middle">в оригинале те же три слоя шириной 512 → 2048 → 512</text>
  </g>
  <g data-key="arch" data-only="1">
<rect x="0" y="0" width="960" height="580" fill="#FFFFFF"/>
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#ff-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#ff-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#C29E08" stroke-width="2"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#C29E08" stroke-width="2"/>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330" y="319" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330" y="284" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330" y="212" class="offs" text-anchor="middle">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330" y="248" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630" y="172" class="lbl-b" text-anchor="middle">Feed Forward</text>
  </g>
  <g data-key="layer" data-only="1" class="card">
<text x="606" y="40" class="ttl">один слой энкодера, три токена</text>
<text x="670" y="74" class="lbl" text-anchor="middle">F[0]</text>
<path d="M670 140 V84" class="edge" marker-end="url(#ff-arw)"/>
<text x="765" y="74" class="lbl" text-anchor="middle">F[1]</text>
<path d="M765 140 V84" class="edge" marker-end="url(#ff-arw)"/>
<text x="860" y="74" class="lbl" text-anchor="middle">F[2]</text>
<path d="M860 140 V84" class="edge" marker-end="url(#ff-arw)"/>
<rect x="606" y="124" width="318" height="152" rx="14" fill="#F7F6F2" stroke="#D9D5CC" stroke-width="1.4"/>
<rect x="628" y="142" width="84" height="48" rx="6" class="by"/>
<text x="670" y="164" class="lbl-b" text-anchor="middle">FFN</text>
<text x="670" y="181" class="cap" text-anchor="middle">W₁, W₂</text>
<path d="M670 240 V194" class="edge" marker-end="url(#ff-arw)"/>
<rect x="723" y="142" width="84" height="48" rx="6" class="by"/>
<text x="765" y="164" class="lbl-b" text-anchor="middle">FFN</text>
<text x="765" y="181" class="cap" text-anchor="middle">W₁, W₂</text>
<path d="M765 240 V194" class="edge" marker-end="url(#ff-arw)"/>
<rect x="818" y="142" width="84" height="48" rx="6" class="by"/>
<text x="860" y="164" class="lbl-b" text-anchor="middle">FFN</text>
<text x="860" y="181" class="cap" text-anchor="middle">W₁, W₂</text>
<path d="M860 240 V194" class="edge" marker-end="url(#ff-arw)"/>
<rect x="622" y="240" width="286" height="26" rx="5" class="br"/>
<text x="765" y="258" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<path d="M670 302 L765 270" class="mix"/>
<path d="M670 302 L860 270" class="mix"/>
<path d="M670 302 V272" class="edge" marker-end="url(#ff-arw)"/>
<text x="670" y="320" class="lbl" text-anchor="middle">You</text>
<path d="M765 302 L670 270" class="mix"/>
<path d="M765 302 L860 270" class="mix"/>
<path d="M765 302 V272" class="edge" marker-end="url(#ff-arw)"/>
<text x="765" y="320" class="lbl" text-anchor="middle">are</text>
<path d="M860 302 L670 270" class="mix"/>
<path d="M860 302 L765 270" class="mix"/>
<path d="M860 302 V272" class="edge" marker-end="url(#ff-arw)"/>
<text x="860" y="320" class="lbl" text-anchor="middle">welcome</text>
<text x="765" y="344" class="cap" text-anchor="middle">внимание смешивает столбцы, FFN — нет</text>
<text x="765" y="362" class="cap" text-anchor="middle">у трёх копий FFN одни и те же W₁, b₁, W₂, b₂</text>
  </g>
  <g data-key="zoom" data-only="1">
<path d="M550 40 L723 142" class="zoom"/><path d="M550 256 L723 190" class="zoom"/>
<rect x="720" y="139" width="90" height="54" rx="8" fill="none" stroke="#C29E08" stroke-width="3"/>
  </g>
  <g data-key="vin" data-only="1">
<text x="160" y="496" class="num" text-anchor="middle">−0.476</text>
<text x="260" y="496" class="num" text-anchor="middle">0.098</text>
<text x="360" y="496" class="num" text-anchor="middle">−1.170</text>
<text x="460" y="496" class="num" text-anchor="middle">1.547</text>
<text x="290" y="522" class="cap" text-anchor="middle">строка «are» после первого Add &amp; Norm</text>
  </g>
  <g data-key="n4" data-only="1">
<path d="M160 446 L282.9 304" class="wire-y"/>
<path d="M260 446 L282.9 304" class="wire-y"/>
<path d="M360 446 L282.9 304" class="wire-y"/>
<path d="M460 446 L282.9 304" class="wire-y"/>
<circle cx="282.9" cy="290" r="14" class="non"/><text x="282.9" y="294" class="idx" text-anchor="middle">4</text>
<rect x="177.9" y="390.4" width="38" height="18" rx="3" class="pad"/><text x="196.9" y="404.4" class="capy" text-anchor="middle">0.5</text>
<rect x="247.9" y="390.4" width="38" height="18" rx="3" class="pad"/><text x="266.9" y="404.4" class="capy" text-anchor="middle">−0.5</text>
<rect x="317.9" y="390.4" width="38" height="18" rx="3" class="pad"/><text x="336.9" y="404.4" class="capy" text-anchor="middle">−0.1</text>
<rect x="387.9" y="390.4" width="38" height="18" rx="3" class="pad"/><text x="406.9" y="404.4" class="capy" text-anchor="middle">1.0</text>
<rect x="259.9" y="317" width="46" height="17" class="pad"/><text x="282.9" y="330" class="nums" text-anchor="middle" style="font-weight:700">0.904</text>
  </g>
  <g data-key="relu" data-only="1" class="card">
<circle cx="120.0" cy="290" r="14" class="nof"/><text x="120" y="294" class="idx" text-anchor="middle">1</text>
<circle cx="174.3" cy="290" r="14" class="non"/><text x="174.3" y="294" class="idx" text-anchor="middle">2</text>
<circle cx="228.6" cy="290" r="14" class="nof"/><text x="228.6" y="294" class="idx" text-anchor="middle">3</text>
<circle cx="282.9" cy="290" r="14" class="non"/><text x="282.9" y="294" class="idx" text-anchor="middle">4</text>
<circle cx="337.1" cy="290" r="14" class="non"/><text x="337.1" y="294" class="idx" text-anchor="middle">5</text>
<circle cx="391.4" cy="290" r="14" class="nof"/><text x="391.4" y="294" class="idx" text-anchor="middle">6</text>
<circle cx="445.7" cy="290" r="14" class="nof"/><text x="445.7" y="294" class="idx" text-anchor="middle">7</text>
<circle cx="500.0" cy="290" r="14" class="non"/><text x="500" y="294" class="idx" text-anchor="middle">8</text>
<text x="44" y="263" class="lbl-b">z</text>
<rect x="97" y="245" width="46" height="17" class="pad"/><text x="120" y="258" class="nums muted" text-anchor="middle">−1.031</text>
<rect x="151.3" y="245" width="46" height="17" class="pad"/><text x="174.3" y="258" class="nums" text-anchor="middle">0.230</text>
<rect x="205.6" y="245" width="46" height="17" class="pad"/><text x="228.6" y="258" class="nums muted" text-anchor="middle">−1.049</text>
<rect x="259.9" y="245" width="46" height="17" class="pad"/><text x="282.9" y="258" class="nums" text-anchor="middle">0.904</text>
<rect x="314.1" y="245" width="46" height="17" class="pad"/><text x="337.1" y="258" class="nums" text-anchor="middle">0.470</text>
<rect x="368.4" y="245" width="46" height="17" class="pad"/><text x="391.4" y="258" class="nums muted" text-anchor="middle">−1.295</text>
<rect x="422.7" y="245" width="46" height="17" class="pad"/><text x="445.7" y="258" class="nums muted" text-anchor="middle">−1.038</text>
<rect x="477" y="245" width="46" height="17" class="pad"/><text x="500" y="258" class="nums" text-anchor="middle">0.288</text>
  </g>
  <g data-key="hv" data-only="1" class="card">
<rect x="97" y="317" width="46" height="17" class="pad"/><text x="120" y="330" class="nums muted" text-anchor="middle">0.000</text>
<rect x="151.3" y="317" width="46" height="17" class="pad"/><text x="174.3" y="330" class="nums" text-anchor="middle">0.230</text>
<rect x="205.6" y="317" width="46" height="17" class="pad"/><text x="228.6" y="330" class="nums muted" text-anchor="middle">0.000</text>
<rect x="259.9" y="317" width="46" height="17" class="pad"/><text x="282.9" y="330" class="nums" text-anchor="middle">0.904</text>
<rect x="314.1" y="317" width="46" height="17" class="pad"/><text x="337.1" y="330" class="nums" text-anchor="middle">0.470</text>
<rect x="368.4" y="317" width="46" height="17" class="pad"/><text x="391.4" y="330" class="nums muted" text-anchor="middle">0.000</text>
<rect x="422.7" y="317" width="46" height="17" class="pad"/><text x="445.7" y="330" class="nums muted" text-anchor="middle">0.000</text>
<rect x="477" y="317" width="46" height="17" class="pad"/><text x="500" y="330" class="nums" text-anchor="middle">0.288</text>
  </g>
  <g data-key="w2" data-only="1">
<path d="M174.3 276 L160 134" class="wire-y"/>
<path d="M174.3 276 L260 134" class="wire-y"/>
<path d="M174.3 276 L360 134" class="wire-y"/>
<path d="M174.3 276 L460 134" class="wire-y"/>
<path d="M282.9 276 L160 134" class="wire-y"/>
<path d="M282.9 276 L260 134" class="wire-y"/>
<path d="M282.9 276 L360 134" class="wire-y"/>
<path d="M282.9 276 L460 134" class="wire-y"/>
<path d="M337.1 276 L160 134" class="wire-y"/>
<path d="M337.1 276 L260 134" class="wire-y"/>
<path d="M337.1 276 L360 134" class="wire-y"/>
<path d="M337.1 276 L460 134" class="wire-y"/>
<path d="M500.0 276 L160 134" class="wire-y"/>
<path d="M500.0 276 L260 134" class="wire-y"/>
<path d="M500.0 276 L360 134" class="wire-y"/>
<path d="M500.0 276 L460 134" class="wire-y"/>
<circle cx="120.0" cy="290" r="14" class="nof"/><text x="120" y="294" class="idx" text-anchor="middle">1</text>
<circle cx="174.3" cy="290" r="14" class="non"/><text x="174.3" y="294" class="idx" text-anchor="middle">2</text>
<circle cx="228.6" cy="290" r="14" class="nof"/><text x="228.6" y="294" class="idx" text-anchor="middle">3</text>
<circle cx="282.9" cy="290" r="14" class="non"/><text x="282.9" y="294" class="idx" text-anchor="middle">4</text>
<circle cx="337.1" cy="290" r="14" class="non"/><text x="337.1" y="294" class="idx" text-anchor="middle">5</text>
<circle cx="391.4" cy="290" r="14" class="nof"/><text x="391.4" y="294" class="idx" text-anchor="middle">6</text>
<circle cx="445.7" cy="290" r="14" class="nof"/><text x="445.7" y="294" class="idx" text-anchor="middle">7</text>
<circle cx="500.0" cy="290" r="14" class="non"/><text x="500" y="294" class="idx" text-anchor="middle">8</text>
<circle cx="160" cy="120" r="14" class="nout-on"/>
<circle cx="260" cy="120" r="14" class="nout-on"/>
<circle cx="360" cy="120" r="14" class="nout-on"/>
<circle cx="460" cy="120" r="14" class="nout-on"/>
  </g>
  <g data-key="vout" data-only="1">
<text x="160" y="94" class="num" text-anchor="middle" style="font-weight:700">0.072</text>
<text x="260" y="94" class="num" text-anchor="middle" style="font-weight:700">0.116</text>
<text x="360" y="94" class="num" text-anchor="middle" style="font-weight:700">0.028</text>
<text x="460" y="94" class="num" text-anchor="middle" style="font-weight:700">0.168</text>
  </g>
  <g data-key="c1" data-only="1" class="card">
<text x="600" y="78" class="ttl">нейрон 4, токен «are»</text>
<text x="600" y="108" class="lbl-b">z₄ = y · W₁[:, 4] + b₁[4]</text>
<text x="612" y="146" class="cap" text-anchor="middle">i</text><text x="680" y="146" class="cap" text-anchor="middle">yᵢ</text><text x="770" y="146" class="cap" text-anchor="middle">W₁[i, 4]</text><text x="875" y="146" class="cap" text-anchor="middle">yᵢ · W₁[i, 4]</text>
<text x="612" y="176" class="cap" text-anchor="middle">1</text><text x="680" y="176" class="num" text-anchor="middle">−0.476</text><text x="770" y="176" class="num" text-anchor="middle">0.5</text><text x="875" y="176" class="num" text-anchor="middle">−0.238</text>
<text x="612" y="204" class="cap" text-anchor="middle">2</text><text x="680" y="204" class="num" text-anchor="middle">0.098</text><text x="770" y="204" class="num" text-anchor="middle">−0.5</text><text x="875" y="204" class="num" text-anchor="middle">−0.049</text>
<text x="612" y="232" class="cap" text-anchor="middle">3</text><text x="680" y="232" class="num" text-anchor="middle">−1.170</text><text x="770" y="232" class="num" text-anchor="middle">−0.1</text><text x="875" y="232" class="num" text-anchor="middle">0.117</text>
<text x="612" y="260" class="cap" text-anchor="middle">4</text><text x="680" y="260" class="num" text-anchor="middle">1.547</text><text x="770" y="260" class="num" text-anchor="middle">1.0</text><text x="875" y="260" class="num" text-anchor="middle">1.547</text>
<path d="M600 276 H930" class="line"/>
<text x="600" y="302" class="lbl">сумма</text><text x="875" y="302" class="num" text-anchor="middle">1.377</text>
<text x="600" y="330" class="lbl">+ b₁[4]</text><text x="875" y="330" class="num" text-anchor="middle">−0.473</text>
<text x="600" y="362" class="lbl-b">z₄</text><text x="875" y="362" class="num" text-anchor="middle" style="font-weight:700">0.904</text>
<text x="600" y="392" class="lbl-b">h₄ = ReLU(z₄)</text><text x="875" y="392" class="num" text-anchor="middle" style="font-weight:700">0.904</text>
<text x="600" y="432" class="cap">столбец W₁[:, 4] — шаблон нейрона: отклик</text>
<text x="600" y="450" class="cap">большой, когда вход на него похож</text>
<text x="600" y="476" class="cap">больше всех даёт y₄: 1.547 × 1.0</text>
  </g>
  <g data-key="c2" data-only="1" class="card">
<text x="600" y="78" class="ttl">ReLU = max(0, z)</text>
<path d="M612 210 H800" class="edge" marker-end="url(#ff-arw)"/><path d="M705 222 V112" class="edge" marker-end="url(#ff-arw)"/>
<path d="M616 210 H705 L786 129" fill="none" stroke="#C29E08" stroke-width="2.6"/>
<text x="808" y="214" class="cap">z</text><text x="714" y="116" class="cap">h</text><text x="705" y="236" class="cap" text-anchor="middle">0</text>
<text x="820" y="158" class="lbl">z &lt; 0 → 0</text><text x="820" y="184" class="lbl">z &gt; 0 → z</text>
<text x="600" y="276" class="lbl-b">включились 4 из 8: № 2, 4, 5, 8</text>
<text x="600" y="306" class="lbl">нейрон 1: z₁ = −1.031 → h₁ = 0</text>
<text x="600" y="342" class="cap">выключенный нейрон ничего не пишет в выход</text>
<text x="600" y="360" class="cap">и не получает градиента на этом токене</text>
<text x="600" y="392" class="cap">на другом токене включатся другие нейроны</text>
  </g>
  <g data-key="c3" data-only="1" class="card">
<text x="600" y="78" class="ttl">выход = сумма строк W₂</text>
<text x="600" y="106" class="lbl-b">F = Σ hⱼ · W₂[j, :] + b₂</text>
<text x="720" y="140" class="cap" text-anchor="middle">F₁</text>
<text x="780" y="140" class="cap" text-anchor="middle">F₂</text>
<text x="840" y="140" class="cap" text-anchor="middle">F₃</text>
<text x="900" y="140" class="cap" text-anchor="middle">F₄</text>
<text x="600" y="168" class="cap">0.230 · W₂[2]</text><text x="720" y="168" class="num" text-anchor="middle">−0.207</text><text x="780" y="168" class="num" text-anchor="middle">−0.138</text><text x="840" y="168" class="num" text-anchor="middle">−0.046</text><text x="900" y="168" class="num" text-anchor="middle">0.069</text>
<text x="600" y="194" class="cap">0.904 · W₂[4]</text><text x="720" y="194" class="num" text-anchor="middle">0.904</text><text x="780" y="194" class="num" text-anchor="middle">0.452</text><text x="840" y="194" class="num" text-anchor="middle">0.000</text><text x="900" y="194" class="num" text-anchor="middle">−0.452</text>
<text x="600" y="220" class="cap">0.470 · W₂[5]</text><text x="720" y="220" class="num" text-anchor="middle">−0.141</text><text x="780" y="220" class="num" text-anchor="middle">−0.235</text><text x="840" y="220" class="num" text-anchor="middle">0.188</text><text x="900" y="220" class="num" text-anchor="middle">0.235</text>
<text x="600" y="246" class="cap">0.288 · W₂[8]</text><text x="720" y="246" class="num" text-anchor="middle">−0.288</text><text x="780" y="246" class="num" text-anchor="middle">−0.144</text><text x="840" y="246" class="num" text-anchor="middle">−0.288</text><text x="900" y="246" class="num" text-anchor="middle">0.288</text>
<text x="600" y="272" class="cap">b₂</text><text x="720" y="272" class="num" text-anchor="middle">−0.196</text><text x="780" y="272" class="num" text-anchor="middle">0.181</text><text x="840" y="272" class="num" text-anchor="middle">0.174</text><text x="900" y="272" class="num" text-anchor="middle">0.028</text>
<path d="M600 284 H930" class="line"/>
<text x="600" y="310" class="lbl-b">F</text><text x="720" y="310" class="num" text-anchor="middle" style="font-weight:700">0.072</text><text x="780" y="310" class="num" text-anchor="middle" style="font-weight:700">0.116</text><text x="840" y="310" class="num" text-anchor="middle" style="font-weight:700">0.028</text><text x="900" y="310" class="num" text-anchor="middle" style="font-weight:700">0.168</text>
<text x="600" y="346" class="cap">четыре включённых нейрона — четыре строки W₂;</text>
<text x="600" y="364" class="cap">строки 1, 3, 6, 7 в этот раз не участвуют</text>
<text x="600" y="398" class="cap">вклады частично гасят друг друга: F — небольшая</text>
<text x="600" y="416" class="cap">поправка к y, основу сохранит residual</text>
  </g>
  <g data-key="c4" data-only="1" class="card">
<text x="600" y="404" class="ttl">какие скрытые нейроны включились</text>
<text x="700" y="428" class="idx" text-anchor="middle">1</text>
<text x="722" y="428" class="idx" text-anchor="middle">2</text>
<text x="744" y="428" class="idx" text-anchor="middle">3</text>
<text x="766" y="428" class="idx" text-anchor="middle">4</text>
<text x="788" y="428" class="idx" text-anchor="middle">5</text>
<text x="810" y="428" class="idx" text-anchor="middle">6</text>
<text x="832" y="428" class="idx" text-anchor="middle">7</text>
<text x="854" y="428" class="idx" text-anchor="middle">8</text>
<text x="600" y="454" class="lbl">You</text>
<rect x="692" y="440" width="16" height="16" rx="2" class="off"/>
<rect x="714" y="440" width="16" height="16" rx="2" class="off"/>
<rect x="736" y="440" width="16" height="16" rx="2" class="off"/>
<rect x="758" y="440" width="16" height="16" rx="2" class="non"/>
<rect x="780" y="440" width="16" height="16" rx="2" class="non"/>
<rect x="802" y="440" width="16" height="16" rx="2" class="off"/>
<rect x="824" y="440" width="16" height="16" rx="2" class="off"/>
<rect x="846" y="440" width="16" height="16" rx="2" class="off"/>
<text x="872" y="454" class="cap">2 из 8</text>
<text x="600" y="480" class="lbl-b">are</text>
<rect x="692" y="466" width="16" height="16" rx="2" class="off"/>
<rect x="714" y="466" width="16" height="16" rx="2" class="non"/>
<rect x="736" y="466" width="16" height="16" rx="2" class="off"/>
<rect x="758" y="466" width="16" height="16" rx="2" class="non"/>
<rect x="780" y="466" width="16" height="16" rx="2" class="non"/>
<rect x="802" y="466" width="16" height="16" rx="2" class="off"/>
<rect x="824" y="466" width="16" height="16" rx="2" class="off"/>
<rect x="846" y="466" width="16" height="16" rx="2" class="non"/>
<text x="872" y="480" class="cap">4 из 8</text>
<text x="600" y="506" class="lbl">welcome</text>
<rect x="692" y="492" width="16" height="16" rx="2" class="off"/>
<rect x="714" y="492" width="16" height="16" rx="2" class="non"/>
<rect x="736" y="492" width="16" height="16" rx="2" class="non"/>
<rect x="758" y="492" width="16" height="16" rx="2" class="non"/>
<rect x="780" y="492" width="16" height="16" rx="2" class="off"/>
<rect x="802" y="492" width="16" height="16" rx="2" class="non"/>
<rect x="824" y="492" width="16" height="16" rx="2" class="non"/>
<rect x="846" y="492" width="16" height="16" rx="2" class="off"/>
<text x="872" y="506" class="cap">5 из 8</text>
<text x="600" y="536" class="cap">нейрон 4 горит у всех, нейрон 1 — ни у кого;</text>
<text x="600" y="554" class="cap">8 — только у are; 3, 6, 7 — только у welcome</text>
  </g>
  <g data-key="c5" data-only="1" class="card">
<text x="600" y="404" class="ttl">размеры в оригинальной модели</text>
<text x="600" y="432" class="lbl-b">d_model = 512 → d_ff = 2048 → 512</text>
<text x="600" y="468" class="cap">attention</text><rect x="690" y="455" width="85" height="18" rx="3" class="br"/><text x="783" y="469" class="num">1.05 млн</text>
<text x="600" y="498" class="cap">FFN</text><rect x="690" y="485" width="170" height="18" rx="3" class="by"/><text x="868" y="499" class="num">2.10 млн</text>
<text x="600" y="532" class="cap">FFN — около 2/3 весов слоя энкодера</text>
<text x="600" y="550" class="cap">в игрушке 4 → 8 → 4 — всего 76 чисел</text>
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
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Feed Forward есть в каждом слое</h4>
      <p>Подсвечены оба блока: второй подслой энкодера и третий подслой декодера. Устройство у них одинаковое, веса — свои в каждом слое. Вход — матрица после Add &amp; Norm, выход той же формы.</p>
    </div>
    <div class="step-panel" data-on="layer" data-focus="layer">
      <div class="step-kicker">Шаг 2 · по позициям</div>
      <h4>Своя копия сети над каждым токеном</h4>
      <p>Внимание связывает все позиции — красные линии идут крест-накрест. Над ним стоят три копии FFN, по одной на токен, и каждая видит только свой столбец. Копии одинаковые: веса <code>W₁, b₁, W₂, b₂</code> общие.</p>
    </div>
    <div class="step-panel" data-on="layer zoom net vin" data-focus="net">
      <div class="step-kicker">Шаг 3 · заглядываем внутрь</div>
      <h4>4 → 8 → 4: расширение и сжатие</h4>
      <p>Раскроем копию над «are». Четыре координаты входа соединены со всеми восемью скрытыми нейронами, а те — со всеми четырьмя выходами. Это обычные полносвязные слои, в оригинале 512 → 2048 → 512.</p>
    </div>
    <div class="step-panel" data-on="net vin n4 c1" data-focus="n4 c1">
      <div class="step-kicker">Шаг 4 · один нейрон</div>
      <h4>Нейрон сравнивает вход со своим шаблоном</h4>
      <p>Нейрон 4 берёт скалярное произведение <code>y</code> со столбцом <code>W₁[:, 4] = (0.5, −0.5, −0.1, 1.0)</code> и прибавляет смещение: 1.377 − 0.473 = 0.904. Сильнее всего он реагирует на четвёртую координату входа.</p>
    </div>
    <div class="step-panel" data-on="net vin relu hv c2" data-focus="relu c2">
      <div class="step-kicker">Шаг 5 · ReLU</div>
      <h4>Отрицательные отклики обнуляются</h4>
      <p>Все восемь нейронов считают свой отклик <code>z</code>, но дальше проходят только положительные. Для «are» включились четыре нейрона из восьми, остальные молчат — их вклад в выход ровно ноль.</p>
    </div>
    <div class="step-panel" data-on="net vin hv w2 vout c3" data-focus="w2 c3">
      <div class="step-kicker">Шаг 6 · W₂</div>
      <h4>Выход — сумма строк включившихся нейронов</h4>
      <p>Каждый включённый нейрон дописывает в выход свою строку <code>W₂</code>, умноженную на силу отклика. Четыре строки плюс <code>b₂</code> дают <code>F[1] = (0.072, 0.116, 0.028, 0.168)</code> — снова четыре числа.</p>
    </div>
    <div class="step-panel" data-on="layer c4" data-focus="c4">
      <div class="step-kicker">Шаг 7 · другие токены</div>
      <h4>Одна сеть, разные включённые нейроны</h4>
      <p>Те же веса для «You» и «welcome» включают другие наборы нейронов. Нейрон 4 горит у всех трёх: его шаблон опирается на четвёртую координату, а она положительна во всех строках. Так одна сеть по-разному обрабатывает разные токены.</p>
    </div>
    <div class="step-panel" data-on="net layer c5" data-focus="c5">
      <div class="step-kicker">Шаг 8 · масштаб</div>
      <h4>Самый тяжёлый блок слоя</h4>
      <p>В оригинале <code>d_ff = 2048</code> — вчетверо шире <code>d_model</code>. Две матрицы 512 × 2048 дают 2.10 млн весов на слой, вдвое больше, чем у multi-head attention. В слое энкодера это около двух третей всех весов.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout-blue"><strong>Что изменилось в современных моделях:</strong> схема «расширить — нелинейность — сжать» осталась, меняется функция посередине. BERT и GPT используют GELU — гладкий вариант ReLU. В LLaMA и многих других моделях стоит SwiGLU: первый слой разбит на две проекции, и одна из них поэлементно управляет другой, как вентиль. Роль блока от этого не меняется.</div>

<div class="callout"><strong>Главная мысль:</strong> в каждом слое внимание обменивает информацию между позициями, Feed Forward перерабатывает её внутри каждой позиции, а Add &amp; Norm после каждого подслоя держит поток одной ширины и одного масштаба. Выход последнего слоя становится памятью исходной последовательности.</div>

<hr>

<h2 id="three-attentions">Глава 6. Три места Attention и источники Q, K, V</h2>

<p>В классическом encoder–decoder Transformer механизм attention используется в трёх местах: self-attention энкодера, masked self-attention декодера и cross-attention. Формула одна и та же, различаются источники query, key и value.</p>

<p>Сам механизм удобно описывать через поиск. Каждая позиция выпускает <strong>запрос</strong> <code>Q</code> — «какая информация мне нужна». Каждая позиция выставляет <strong>ключ</strong> <code>K</code> — «какую информацию я предлагаю» — и <strong>значение</strong> <code>V</code> — собственно содержимое, которое заберут. Скалярное произведение запроса с ключом даёт оценку совпадения, softmax превращает оценки в веса, а веса собирают значения в один вектор.</p>

<div class="math-display" data-tex="\mathrm{Attention}(Q,K,V) = \mathrm{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right) V"></div>

<p>Q, K и V — это три линейные проекции входа, каждая со своей обучаемой матрицей. Поэтому одна и та же строка может выглядеть по-разному в роли запроса и в роли ключа: спрашивать и предлагать — разные задачи.</p>

<div class="callout-blue"><strong>Откуда берётся <code>√d_k</code>:</strong> скалярное произведение двух случайных векторов длины <code>d_k</code> имеет разброс порядка <code>d_k</code>. Чем шире вектор, тем больше по модулю оценки, а softmax от больших чисел вырождается: один вес почти 1, остальные почти 0, и градиент практически исчезает. Деление на <code>√d_k</code> возвращает оценки в разумный диапазон независимо от ширины головы.</div>

<h3 id="sdpa">Scaled Dot-Product Attention по шагам</h3>

<p>Прежде чем сравнивать три блока, разберём сам расчёт — он одинаков для каждой головы каждого блока. Формулу удобно читать как цепочку из пяти операций: <strong>MatMul</strong> <code>QKᵀ</code> → <strong>Scale</strong> на <code>1/√d_k</code> → <strong>Mask</strong> (необязательно) → <strong>SoftMax</strong> по строкам → <strong>MatMul</strong> с <code>V</code>. Удобнее всего следить за формой тензора <code>(B, h, L, d_k)</code>: в примере это <code>(2, 2, 3, 4)</code> — две фразы, две головы, три токена, четыре координаты на голову. Первые две оси просто переносятся, вся работа идёт по двум последним.</p>

<div class="callout-blue"><strong>Подробнее о самом механизме:</strong> откуда берётся идея запросов, ключей и значений и как self-attention устроен без привязки к трансформеру — в отдельной статье <a href="article.html?slug=self-attention">Self-Attention</a>. Здесь — только то, что нужно для чтения схемы.</div>

<div class="stage" id="stageSd" tabindex="0">
  <div class="stage-figure">
<svg id="sd" viewBox="0 0 960 570" role="img" aria-label="Scaled Dot-Product Attention: схема трансформера, затем операции MatMul, Scale, Mask, SoftMax, MatMul с формами">
  <style>
    #sd { font-family: Helvetica, Arial, sans-serif; }
    #sd text { fill: #111111; }
    #sd .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #sd .offt { fill: #A29C92; font-size: 14px; }
    #sd .offs { fill: #A29C92; font-size: 12px; }
    #sd .is-focus .offt, #sd .is-focus .offs { font-weight: 400; }
    #sd .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #sd .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #sd .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #sd .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #sd .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #sd .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #sd .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #sd .lbl { font-size: 15px; }
    #sd .lbl-b { font-size: 15px; font-weight: 700; }
    #sd .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #sd .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #sd .cap { font-size: 13px; fill: #5E5850; }
    #sd .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #sd .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #sd .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #sd .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #sd .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #sd .band-y { fill: #FFF3C4; }
    #sd .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="sd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="sd-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="sd-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="sd-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#sd-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#sd-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>

  </g>
  <g data-key="qkv" data-only="1"><text x="95" y="535" class="lbl-b" text-anchor="middle" style="font-size:20px">Q</text><text x="175" y="535" class="lbl-b" text-anchor="middle" style="font-size:20px">K</text><text x="285" y="535" class="lbl-b" text-anchor="middle" style="font-size:20px">V</text><path d="M95 512 V484" class="edge" marker-end="url(#sd-arw)"/><path d="M175 512 V484" class="edge" marker-end="url(#sd-arw)"/><path d="M285 512 V196" stroke="#111" stroke-width="2" fill="none" marker-end="url(#sd-arw)"/><text x="40" y="556" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,4)</text><text x="142" y="556" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,4)</text><text x="252" y="556" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,4)</text></g>
  <g data-key="mm1" data-only="1"><rect x="50" y="440" width="170" height="42" rx="8" fill="#D6D0EA" stroke="#111" stroke-width="2"/><text x="135.0" y="467.0" class="lbl-b" text-anchor="middle" style="font-size:17px">MatMul</text><text x="158" y="426" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,3)</text></g>
  <g data-key="a1" data-only="1"><path d="M135 440 V410" class="edge" marker-end="url(#sd-arw)"/></g>
  <g data-key="sc" data-only="1"><rect x="70" y="370" width="130" height="38" rx="8" fill="#FFF3B0" stroke="#111" stroke-width="2"/><text x="135.0" y="395.0" class="lbl-b" text-anchor="middle" style="font-size:17px">Scale</text><text x="158" y="356" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,3)</text></g>
  <g data-key="a2" data-only="1"><path d="M135 370 V342" class="edge" marker-end="url(#sd-arw)"/></g>
  <g data-key="mk" data-only="1"><rect x="50" y="300" width="170" height="40" rx="8" fill="#F8C9DD" stroke="#111" stroke-width="2"/><text x="135.0" y="326.0" class="lbl-b" text-anchor="middle" style="font-size:17px">Mask (opt.)</text><text x="158" y="286" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,3)</text></g>
  <g data-key="a3" data-only="1"><path d="M135 300 V270" class="edge" marker-end="url(#sd-arw)"/></g>
  <g data-key="sm" data-only="1"><rect x="60" y="228" width="150" height="40" rx="8" fill="#CDE8D0" stroke="#111" stroke-width="2"/><text x="135.0" y="254.0" class="lbl-b" text-anchor="middle" style="font-size:17px">SoftMax</text><text x="158" y="214" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,3)</text></g>
  <g data-key="a4" data-only="1"><path d="M135 228 V200" class="edge" marker-end="url(#sd-arw)"/></g>
  <g data-key="mm2" data-only="1"><rect x="50" y="150" width="270" height="44" rx="8" fill="#D6D0EA" stroke="#111" stroke-width="2"/><text x="185.0" y="178.0" class="lbl-b" text-anchor="middle" style="font-size:17px">MatMul</text><text x="158" y="0" class="cap" style="fill:#245A98;font-weight:700"></text></g>
  <g data-key="a5" data-only="1"><path d="M185 150 V110" class="edge" marker-end="url(#sd-arw)"/><text x="196" y="126" class="cap" style="fill:#245A98;font-weight:700">(2,2,3,4)</text></g>
  <g data-key="r0" data-only="1"><rect x="24" y="506" width="302" height="62" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r1" data-only="1"><rect x="44" y="434" width="182" height="54" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r2" data-only="1"><rect x="64" y="364" width="142" height="50" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r3" data-only="1"><rect x="44" y="294" width="182" height="52" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r4" data-only="1"><rect x="54" y="222" width="162" height="52" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="r5" data-only="1"><rect x="44" y="144" width="282" height="56" rx="11" fill="none" stroke="#C29E08" stroke-width="3"/></g>
  <g data-key="n0" data-only="1"><text x="400" y="70" class="lbl-b">(B, h, L, dₖ) = (2, 2, 3, 4)</text><text x="400" y="92" class="cap">2 фразы · 2 головы · 3 токена · 4 координаты на голову</text><text x="400" y="110" class="cap">ниже один срез: фраза 0, голова 0</text><text x="420" y="200" class="lbl-b" style="font-size:24px">Q</text><text x="498" y="160.0" class="cap" text-anchor="end">You</text><rect x="510" y="140" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="160.0" class="num" text-anchor="middle">0.236</text><rect x="580" y="140" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="160.0" class="num" text-anchor="middle">0.551</text><rect x="650" y="140" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="160.0" class="num" text-anchor="middle">0.576</text><rect x="720" y="140" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="160.0" class="num" text-anchor="middle">0.682</text><text x="498" y="196.0" class="cap" text-anchor="end">are</text><rect x="510" y="176" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="196.0" class="num" text-anchor="middle">0.637</text><rect x="580" y="176" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="196.0" class="num" text-anchor="middle">0.756</text><rect x="650" y="176" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="196.0" class="num" text-anchor="middle">0.237</text><rect x="720" y="176" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="196.0" class="num" text-anchor="middle">1.238</text><text x="498" y="232.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="212" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="232.0" class="num" text-anchor="middle">1.473</text><rect x="580" y="212" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="232.0" class="num" text-anchor="middle">−0.350</text><rect x="650" y="212" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="232.0" class="num" text-anchor="middle">0.094</text><rect x="720" y="212" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="232.0" class="num" text-anchor="middle">1.118</text><text x="420" y="322" class="lbl-b" style="font-size:24px">K</text><text x="498" y="282.0" class="cap" text-anchor="end">You</text><rect x="510" y="262" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="282.0" class="num" text-anchor="middle">0.262</text><rect x="580" y="262" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="282.0" class="num" text-anchor="middle">0.472</text><rect x="650" y="262" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="282.0" class="num" text-anchor="middle">0.572</text><rect x="720" y="262" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="282.0" class="num" text-anchor="middle">0.861</text><text x="498" y="318.0" class="cap" text-anchor="end">are</text><rect x="510" y="298" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="318.0" class="num" text-anchor="middle">0.454</text><rect x="580" y="298" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="318.0" class="num" text-anchor="middle">0.910</text><rect x="650" y="298" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="318.0" class="num" text-anchor="middle">0.241</text><rect x="720" y="298" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="318.0" class="num" text-anchor="middle">1.376</text><text x="498" y="354.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="334" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="354.0" class="num" text-anchor="middle">1.248</text><rect x="580" y="334" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="354.0" class="num" text-anchor="middle">0.086</text><rect x="650" y="334" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="354.0" class="num" text-anchor="middle">−0.316</text><rect x="720" y="334" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="354.0" class="num" text-anchor="middle">0.959</text><text x="420" y="444" class="lbl-b" style="font-size:24px">V</text><text x="498" y="404.0" class="cap" text-anchor="end">You</text><rect x="510" y="384" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="404.0" class="num" text-anchor="middle">0.299</text><rect x="580" y="384" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="404.0" class="num" text-anchor="middle">0.508</text><rect x="650" y="384" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="404.0" class="num" text-anchor="middle">0.508</text><rect x="720" y="384" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="404.0" class="num" text-anchor="middle">0.766</text><text x="498" y="440.0" class="cap" text-anchor="end">are</text><rect x="510" y="420" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="440.0" class="num" text-anchor="middle">0.643</text><rect x="580" y="420" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="440.0" class="num" text-anchor="middle">0.730</text><rect x="650" y="420" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="440.0" class="num" text-anchor="middle">0.304</text><rect x="720" y="420" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="440.0" class="num" text-anchor="middle">1.247</text><text x="498" y="476.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="456" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="476.0" class="num" text-anchor="middle">1.127</text><rect x="580" y="456" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="476.0" class="num" text-anchor="middle">−0.219</text><rect x="650" y="456" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="476.0" class="num" text-anchor="middle">0.193</text><rect x="720" y="456" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="476.0" class="num" text-anchor="middle">1.021</text></g>
  <g data-key="n1" data-only="1"><text x="400" y="80" class="lbl-b">S = Q · Kᵀ</text><text x="400" y="104" class="cap">(2,2,3,4) × (2,2,4,3) → (2,2,3,3): каждая пара «запрос → ключ»</text><text x="550.0" y="162" class="cap" text-anchor="middle">You</text><text x="636.0" y="162" class="cap" text-anchor="middle">are</text><text x="722.0" y="162" class="cap" text-anchor="middle">welcome</text><text x="498" y="190.0" class="cap" text-anchor="end">You</text><rect x="510" y="170" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="190.0" class="num" text-anchor="middle">1.239</text><rect x="596" y="170" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="190.0" class="num" text-anchor="middle">1.685</text><rect x="682" y="170" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="190.0" class="num" text-anchor="middle">0.814</text><rect x="506" y="202" width="260" height="38" rx="6" class="band-y"/><text x="498" y="226.0" class="cap" text-anchor="end">are</text><rect x="510" y="206" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="226.0" class="num" text-anchor="middle">1.725</text><rect x="596" y="206" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="226.0" class="num" text-anchor="middle">2.736</text><rect x="682" y="206" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="226.0" class="num" text-anchor="middle">1.972</text><text x="498" y="262.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="242" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="262.0" class="num" text-anchor="middle">1.237</text><rect x="596" y="242" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="262.0" class="num" text-anchor="middle">1.911</text><rect x="682" y="242" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="262.0" class="num" text-anchor="middle">2.851</text><text x="400" y="330" class="cap">S[are, are] = q_are · k_are = 2.736 — самая высокая оценка в строке</text></g>
  <g data-key="n2" data-only="1"><text x="400" y="80" class="lbl-b">S / √dₖ = S / √4 = S / 2</text><text x="400" y="104" class="cap">форма не меняется; без деления оценки росли бы с dₖ,</text><text x="400" y="122" class="cap">и softmax вырождался бы в one-hot</text><text x="550.0" y="162" class="cap" text-anchor="middle">You</text><text x="636.0" y="162" class="cap" text-anchor="middle">are</text><text x="722.0" y="162" class="cap" text-anchor="middle">welcome</text><text x="498" y="190.0" class="cap" text-anchor="end">You</text><rect x="510" y="170" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="190.0" class="num" text-anchor="middle">0.619</text><rect x="596" y="170" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="190.0" class="num" text-anchor="middle">0.843</text><rect x="682" y="170" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="190.0" class="num" text-anchor="middle">0.407</text><rect x="506" y="202" width="260" height="38" rx="6" class="band-y"/><text x="498" y="226.0" class="cap" text-anchor="end">are</text><rect x="510" y="206" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="226.0" class="num" text-anchor="middle">0.862</text><rect x="596" y="206" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="226.0" class="num" text-anchor="middle">1.368</text><rect x="682" y="206" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="226.0" class="num" text-anchor="middle">0.986</text><text x="498" y="262.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="242" width="80" height="30" rx="4" class="cell" /><text x="550.0" y="262.0" class="num" text-anchor="middle">0.619</text><rect x="596" y="242" width="80" height="30" rx="4" class="cell" /><text x="636.0" y="262.0" class="num" text-anchor="middle">0.956</text><rect x="682" y="242" width="80" height="30" rx="4" class="cell" /><text x="722.0" y="262.0" class="num" text-anchor="middle">1.425</text></g>
  <g data-key="n3" data-only="1"><text x="400" y="80" class="lbl-b">+ M: 0 или −∞</text><text x="490" y="140" class="ttl">энкодер: M = 0</text><text x="518.0" y="162" class="cap" text-anchor="middle">You</text><text x="580.0" y="162" class="cap" text-anchor="middle">are</text><text x="642.0" y="162" class="cap" text-anchor="middle">welcome</text><text x="478" y="190.0" class="cap" text-anchor="end">You</text><rect x="490" y="170" width="56" height="30" rx="4" class="cell" /><text x="518.0" y="190.0" class="num" text-anchor="middle">0</text><rect x="552" y="170" width="56" height="30" rx="4" class="cell" /><text x="580.0" y="190.0" class="num" text-anchor="middle">0</text><rect x="614" y="170" width="56" height="30" rx="4" class="cell" /><text x="642.0" y="190.0" class="num" text-anchor="middle">0</text><text x="478" y="226.0" class="cap" text-anchor="end">are</text><rect x="490" y="206" width="56" height="30" rx="4" class="cell" /><text x="518.0" y="226.0" class="num" text-anchor="middle">0</text><rect x="552" y="206" width="56" height="30" rx="4" class="cell" /><text x="580.0" y="226.0" class="num" text-anchor="middle">0</text><rect x="614" y="206" width="56" height="30" rx="4" class="cell" /><text x="642.0" y="226.0" class="num" text-anchor="middle">0</text><text x="478" y="262.0" class="cap" text-anchor="end">welcome</text><rect x="490" y="242" width="56" height="30" rx="4" class="cell" /><text x="518.0" y="262.0" class="num" text-anchor="middle">0</text><rect x="552" y="242" width="56" height="30" rx="4" class="cell" /><text x="580.0" y="262.0" class="num" text-anchor="middle">0</text><rect x="614" y="242" width="56" height="30" rx="4" class="cell" /><text x="642.0" y="262.0" class="num" text-anchor="middle">0</text><text x="720" y="140" class="ttl">декодер: причинная</text><text x="748.0" y="162" class="cap" text-anchor="middle">1</text><text x="810.0" y="162" class="cap" text-anchor="middle">2</text><text x="872.0" y="162" class="cap" text-anchor="middle">3</text><rect x="720" y="170" width="56" height="30" rx="4" class="cell" /><text x="748.0" y="190.0" class="num" text-anchor="middle">0</text><rect x="782" y="170" width="56" height="30" rx="4" class="cell" style="fill:#FFF2F2"/><text x="810.0" y="190.0" class="num" text-anchor="middle">−∞</text><rect x="844" y="170" width="56" height="30" rx="4" class="cell" style="fill:#FFF2F2"/><text x="872.0" y="190.0" class="num" text-anchor="middle">−∞</text><rect x="720" y="206" width="56" height="30" rx="4" class="cell" /><text x="748.0" y="226.0" class="num" text-anchor="middle">0</text><rect x="782" y="206" width="56" height="30" rx="4" class="cell" /><text x="810.0" y="226.0" class="num" text-anchor="middle">0</text><rect x="844" y="206" width="56" height="30" rx="4" class="cell" style="fill:#FFF2F2"/><text x="872.0" y="226.0" class="num" text-anchor="middle">−∞</text><rect x="720" y="242" width="56" height="30" rx="4" class="cell" /><text x="748.0" y="262.0" class="num" text-anchor="middle">0</text><rect x="782" y="242" width="56" height="30" rx="4" class="cell" /><text x="810.0" y="262.0" class="num" text-anchor="middle">0</text><rect x="844" y="242" width="56" height="30" rx="4" class="cell" /><text x="872.0" y="262.0" class="num" text-anchor="middle">0</text><text x="400" y="330" class="cap">маска optional: в нашей фразе без PAD энкодеру нечего закрывать;</text><text x="400" y="348" class="cap">в декодере −∞ стоит над диагональю — подробно в главе 8</text></g>
  <g data-key="n4" data-only="1"><text x="400" y="80" class="lbl-b">A = softmax(S / √dₖ + M) по строкам</text><text x="550.0" y="162" class="cap" text-anchor="middle">You</text><text x="636.0" y="162" class="cap" text-anchor="middle">are</text><text x="722.0" y="162" class="cap" text-anchor="middle">welcome</text><text x="498" y="190.0" class="cap" text-anchor="end">You</text><rect x="510" y="170" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.34"/><text x="550.0" y="190.0" class="num" text-anchor="middle">32.7%</text><rect x="596" y="170" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.41"/><text x="636.0" y="190.0" class="num" text-anchor="middle">40.9%</text><rect x="682" y="170" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.29"/><text x="722.0" y="190.0" class="num" text-anchor="middle">26.4%</text><rect x="506" y="202" width="260" height="38" rx="6" class="band-y"/><text x="498" y="226.0" class="cap" text-anchor="end">are</text><rect x="510" y="206" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.29"/><text x="550.0" y="226.0" class="num" text-anchor="middle">26.4%</text><rect x="596" y="206" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.43"/><text x="636.0" y="226.0" class="num" text-anchor="middle">43.8%</text><rect x="682" y="206" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.32"/><text x="722.0" y="226.0" class="num" text-anchor="middle">29.9%</text><text x="498" y="262.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="242" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.25"/><text x="550.0" y="262.0" class="num" text-anchor="middle">21.5%</text><rect x="596" y="242" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.32"/><text x="636.0" y="262.0" class="num" text-anchor="middle">30.2%</text><rect x="682" y="242" width="80" height="30" rx="4" class="cell" style="fill:#C30B0A;fill-opacity:0.47"/><text x="722.0" y="262.0" class="num" text-anchor="middle">48.3%</text><text x="400" y="330" class="cap">каждая строка — распределение: неотрицательные веса с суммой 1</text></g>
  <g data-key="n5" data-only="1"><text x="400" y="80" class="lbl-b">Output = A · V</text><text x="400" y="104" class="cap">(2,2,3,3) × (2,2,3,4) → (2,2,3,4): форма снова как у Q</text><text x="542.0" y="162" class="cap" text-anchor="middle">x1</text><text x="612.0" y="162" class="cap" text-anchor="middle">x2</text><text x="682.0" y="162" class="cap" text-anchor="middle">x3</text><text x="752.0" y="162" class="cap" text-anchor="middle">x4</text><text x="498" y="190.0" class="cap" text-anchor="end">You</text><rect x="510" y="170" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="190.0" class="num" text-anchor="middle">0.659</text><rect x="580" y="170" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="190.0" class="num" text-anchor="middle">0.406</text><rect x="650" y="170" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="190.0" class="num" text-anchor="middle">0.341</text><rect x="720" y="170" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="190.0" class="num" text-anchor="middle">1.030</text><rect x="506" y="202" width="282" height="38" rx="6" class="band-g"/><text x="498" y="226.0" class="cap" text-anchor="end">are</text><rect x="510" y="206" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="226.0" class="num" text-anchor="middle">0.697</text><rect x="580" y="206" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="226.0" class="num" text-anchor="middle">0.388</text><rect x="650" y="206" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="226.0" class="num" text-anchor="middle">0.324</text><rect x="720" y="206" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="226.0" class="num" text-anchor="middle">1.053</text><text x="498" y="262.0" class="cap" text-anchor="end">welcome</text><rect x="510" y="242" width="64" height="30" rx="4" class="cell" /><text x="542.0" y="262.0" class="num" text-anchor="middle">0.803</text><rect x="580" y="242" width="64" height="30" rx="4" class="cell" /><text x="612.0" y="262.0" class="num" text-anchor="middle">0.224</text><rect x="650" y="242" width="64" height="30" rx="4" class="cell" /><text x="682.0" y="262.0" class="num" text-anchor="middle">0.294</text><rect x="720" y="242" width="64" height="30" rx="4" class="cell" /><text x="752.0" y="262.0" class="num" text-anchor="middle">1.034</text><text x="400" y="310" class="cap">are = 26.4% · V[You] + 43.8% · V[are] + 29.9% · V[welcome]</text><text x="400" y="330" class="cap">дальше головы склеиваются и проходят Wᴼ — это глава 7</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Этот расчёт внутри каждого красного блока</h4>
      <p>Все три блока внимания и каждая их голова считают одно и то же: scaled dot-product attention. Разберём его по операциям, следя за формой тензора.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r0 n0" data-focus="n0">
      <div class="step-kicker">Шаг 2 · входы</div>
      <h4>Q, K и V одной формы</h4>
      <p>Четыре оси: батч B, головы h, длина L и ширина головы dₖ. Все операции ниже идут по двум последним осям, отдельно для каждой фразы и каждой головы.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r1 n1" data-focus="n1">
      <div class="step-kicker">Шаг 3 · MatMul</div>
      <h4>Каждый запрос сравнивается с каждым ключом</h4>
      <p>Произведение <code>QKᵀ</code> даёт матрицу L × L: строка — запрос, столбец — ключ. Последняя ось dₖ «съедается» скалярным произведением.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r2 n2" data-focus="n2">
      <div class="step-kicker">Шаг 4 · Scale</div>
      <h4>Делим на √dₖ</h4>
      <p>Разброс скалярного произведения растёт с шириной вектора. Деление на √dₖ держит оценки в диапазоне, где softmax ещё различает варианты и даёт градиент.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r3 n3" data-focus="n3">
      <div class="step-kicker">Шаг 5 · Mask (opt.)</div>
      <h4>Запрещённым парам — минус бесконечность</h4>
      <p>Маска прибавляется до softmax. В энкодере она закрывает только PAD, в декодере ещё и будущие позиции.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r4 n4" data-focus="n4">
      <div class="step-kicker">Шаг 6 · SoftMax</div>
      <h4>Оценки превращаются в веса</h4>
      <p>Softmax по каждой строке: «are» отдаёт 43.8% себе и остальное соседям. Форма (2,2,3,3) не меняется.</p>
    </div>
    <div class="step-panel" data-on="qkv mm1 a1 sc a2 mk a3 sm a4 mm2 a5 r5 n5" data-focus="n5">
      <div class="step-kicker">Шаг 7 · MatMul с V</div>
      <h4>Веса собирают значения</h4>
      <p>Каждая строка результата — взвешенная сумма строк V. Ось L ключей схлопывается, возвращается dₖ: выход (2,2,3,4).</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<p>Дальше вся разница между тремя блоками сводится к двум вопросам: откуда взялись <code>Q</code> и откуда взялись <code>K</code> и <code>V</code>.</p>

<table class="shape-table">
  <tr><th>Блок</th><th>Q берётся из</th><th>K и V берутся из</th><th>Что запрещено</th></tr>
  <tr><td>Self-attention энкодера</td><td>входной последовательности</td><td>той же входной последовательности</td><td>только <code>PAD</code></td></tr>
  <tr><td>Masked self-attention декодера</td><td>состояния декодера</td><td>того же состояния декодера</td><td><code>PAD</code> и все будущие позиции</td></tr>
  <tr><td>Cross-attention</td><td>состояния декодера</td><td>памяти энкодера <code>H<sup>N</sup></code></td><td><code>PAD</code> источника</td></tr>
</table>

<p>Обратите внимание на асимметрию cross-attention: строки его матрицы весов нумеруются позициями перевода, а столбцы — позициями оригинала. Матрица получается прямоугольной, <code>T × L</code>, и именно она ближе всего к интуитивному «выравниванию» слов между языками.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · masked self-attention, позиция «Добро»</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Оценки до и после маски</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">QKᵀ/√d</div>
      <div class="math-display worked-trace-math" data-tex="(0.860,\;1.338,\;-\infty)"></div>
      <div class="worked-trace-note">будущий ключ «пожаловать» закрыт маской до softmax</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">softmax</div>
      <div class="math-display worked-trace-math" data-tex="(0.383,\;0.617,\;0.000)"></div>
      <div class="worked-trace-note">вес будущего строго ноль, остальные два в сумме дают 1</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> без маски будущий ключ получил бы оценку 0.782 и заметный вес 26.1% — связь вовсе не пренебрежимая. Её убрали не потому, что она слабая, а потому что правило запрещает смотреть вперёд. Маска работает до softmax и по позиции, а не по значению.</p>
</div>

<p>Посмотрим пошагово на все три блока: откуда берутся входы и какие ключи доступны запросу.</p>

<div class="stage" id="stageAt" tabindex="0">
  <div class="stage-figure">
<svg id="at" viewBox="0 0 960 560" role="img" aria-label="Три места attention: схема трансформера, затем источники Q, K, V и веса">
  <style>
    #at { font-family: Helvetica, Arial, sans-serif; }
    #at text { fill: #111111; }
    #at .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #at .offt { fill: #A29C92; font-size: 14px; }
    #at .offs { fill: #A29C92; font-size: 12px; }
    #at .is-focus .offt, #at .is-focus .offs { font-weight: 400; }
    #at .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #at .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #at .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #at .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #at .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #at .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #at .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #at .lbl { font-size: 15px; }
    #at .lbl-b { font-size: 15px; font-weight: 700; }
    #at .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #at .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #at .cap { font-size: 13px; fill: #5E5850; }
    #at .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #at .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #at .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #at .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #at .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #at .band-y { fill: #FFF3C4; }
    #at .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="at-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="at-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="at-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="at-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#at-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#at-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#at-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>

  </g>
  <g data-key="fx" data-only="1"><text x="480" y="60" class="shape" text-anchor="middle" style="font-family:Helvetica,Arial,sans-serif;font-size:20px">Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V</text></g>
  <g data-key="enc" data-only="1"><rect x="300" y="150" width="90" height="44" rx="8" class="br"/><text x="345" y="178" class="lbl-b" text-anchor="middle">Q</text><rect x="300" y="230" width="90" height="44" rx="8" class="br"/><text x="345" y="258" class="lbl-b" text-anchor="middle">K</text><rect x="300" y="310" width="90" height="44" rx="8" class="br"/><text x="345" y="338" class="lbl-b" text-anchor="middle">V</text><rect x="40" y="150" width="190" height="204" rx="8" class="bx"/><text x="135" y="250.0" class="lbl-b" text-anchor="middle">Xₑ</text><text x="135" y="270.0" class="cap" text-anchor="middle">вход энкодера</text><path d="M230 172 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="166" class="cap" text-anchor="middle">WQ</text><path d="M230 252 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="246" class="cap" text-anchor="middle">WK</text><path d="M230 332 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="326" class="cap" text-anchor="middle">WV</text><text x="600" y="112" class="ttl">веса: строка — запрос, столбец — ключ</text><text x="643.0" y="140" class="cap" text-anchor="middle">You</text><text x="735.0" y="140" class="cap" text-anchor="middle">are</text><text x="827.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="586" y="181" class="lbl" text-anchor="end">You</text><rect x="600" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.34" stroke="#E4E1D7"/><text x="643.0" y="182" class="num" text-anchor="middle" style="fill:#111">32.7%</text><rect x="692" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.41" stroke="#E4E1D7"/><text x="735.0" y="182" class="num" text-anchor="middle" style="fill:#111">40.9%</text><rect x="784" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.29" stroke="#E4E1D7"/><text x="827.0" y="182" class="num" text-anchor="middle" style="fill:#111">26.4%</text><rect x="596" y="204" width="278" height="60" rx="6" class="band-y"/><text x="586" y="239" class="lbl" text-anchor="end">are</text><rect x="600" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.29" stroke="#E4E1D7"/><text x="643.0" y="240" class="num" text-anchor="middle" style="fill:#111">26.4%</text><rect x="692" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.43" stroke="#E4E1D7"/><text x="735.0" y="240" class="num" text-anchor="middle" style="fill:#111">43.8%</text><rect x="784" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.32" stroke="#E4E1D7"/><text x="827.0" y="240" class="num" text-anchor="middle" style="fill:#111">29.9%</text><text x="586" y="297" class="lbl" text-anchor="end">welcome</text><rect x="600" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.25" stroke="#E4E1D7"/><text x="643.0" y="298" class="num" text-anchor="middle" style="fill:#111">21.5%</text><rect x="692" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.32" stroke="#E4E1D7"/><text x="735.0" y="298" class="num" text-anchor="middle" style="fill:#111">30.2%</text><rect x="784" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.47" stroke="#E4E1D7"/><text x="827.0" y="298" class="num" text-anchor="middle" style="fill:#111">48.3%</text><text x="40" y="410" class="lbl">выход для «are»: (0.697, 0.388, 0.324, 1.053)</text></g>
  <g data-key="dec" data-only="1"><rect x="300" y="150" width="90" height="44" rx="8" class="br"/><text x="345" y="178" class="lbl-b" text-anchor="middle">Q</text><rect x="300" y="230" width="90" height="44" rx="8" class="br"/><text x="345" y="258" class="lbl-b" text-anchor="middle">K</text><rect x="300" y="310" width="90" height="44" rx="8" class="br"/><text x="345" y="338" class="lbl-b" text-anchor="middle">V</text><rect x="40" y="150" width="190" height="204" rx="8" class="bx"/><text x="135" y="250.0" class="lbl-b" text-anchor="middle">Xᵈ</text><text x="135" y="270.0" class="cap" text-anchor="middle">вход декодера</text><path d="M230 172 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="166" class="cap" text-anchor="middle">WQ</text><path d="M230 252 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="246" class="cap" text-anchor="middle">WK</text><path d="M230 332 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="326" class="cap" text-anchor="middle">WV</text><text x="600" y="112" class="ttl">веса: строка — запрос, столбец — ключ</text><text x="643.0" y="140" class="cap" text-anchor="middle">&lt;START&gt;</text><text x="735.0" y="140" class="cap" text-anchor="middle">Добро</text><text x="827.0" y="140" class="cap" text-anchor="middle">пожаловать</text><text x="586" y="181" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="600" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.88" stroke="#E4E1D7"/><text x="643.0" y="182" class="num" text-anchor="middle" style="fill:#fff">100.0%</text><rect x="692" y="150" width="86" height="52" rx="4" class="chip-sp"/><text x="735.0" y="182" class="lbl" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="784" y="150" width="86" height="52" rx="4" class="chip-sp"/><text x="827.0" y="182" class="lbl" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="596" y="204" width="278" height="60" rx="6" class="band-y"/><text x="586" y="239" class="lbl" text-anchor="end">Добро</text><rect x="600" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.39" stroke="#E4E1D7"/><text x="643.0" y="240" class="num" text-anchor="middle" style="fill:#111">38.3%</text><rect x="692" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.57" stroke="#E4E1D7"/><text x="735.0" y="240" class="num" text-anchor="middle" style="fill:#fff">61.7%</text><rect x="784" y="208" width="86" height="52" rx="4" class="chip-sp"/><text x="827.0" y="240" class="lbl" style="fill:#C30B0A" text-anchor="middle">×</text><text x="586" y="297" class="lbl" text-anchor="end">пожаловать</text><rect x="600" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.35" stroke="#E4E1D7"/><text x="643.0" y="298" class="num" text-anchor="middle" style="fill:#111">33.9%</text><rect x="692" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.38" stroke="#E4E1D7"/><text x="735.0" y="298" class="num" text-anchor="middle" style="fill:#111">37.7%</text><rect x="784" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.31" stroke="#E4E1D7"/><text x="827.0" y="298" class="num" text-anchor="middle" style="fill:#111">28.5%</text><text x="40" y="410" class="lbl">«Добро»: 0.860 и 1.338 → 38.3% и 61.7%; будущее = −∞ → 0</text></g>
  <g data-key="cross" data-only="1"><rect x="300" y="150" width="90" height="44" rx="8" class="br"/><text x="345" y="178" class="lbl-b" text-anchor="middle">Q</text><rect x="300" y="230" width="90" height="44" rx="8" class="br"/><text x="345" y="258" class="lbl-b" text-anchor="middle">K</text><rect x="300" y="310" width="90" height="44" rx="8" class="br"/><text x="345" y="338" class="lbl-b" text-anchor="middle">V</text><rect x="40" y="140" width="190" height="54" rx="8" class="by"/><text x="135" y="165.0" class="lbl-b" text-anchor="middle">U</text><text x="135" y="185.0" class="cap" text-anchor="middle">состояние декодера</text><path d="M230 172 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="166" class="cap" text-anchor="middle">WQ</text><rect x="40" y="222" width="190" height="132" rx="8" class="bx"/><text x="135" y="286.0" class="lbl-b" text-anchor="middle">Hᴺ</text><text x="135" y="306.0" class="cap" text-anchor="middle">память энкодера</text><path d="M230 252 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="246" class="cap" text-anchor="middle">WK</text><path d="M230 332 H296" class="edge" marker-end="url(#at-arw)"/><text x="263" y="326" class="cap" text-anchor="middle">WV</text><text x="600" y="112" class="ttl">веса: строка — запрос, столбец — ключ</text><text x="643.0" y="140" class="cap" text-anchor="middle">You</text><text x="735.0" y="140" class="cap" text-anchor="middle">are</text><text x="827.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="586" y="181" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="600" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.31" stroke="#E4E1D7"/><text x="643.0" y="182" class="num" text-anchor="middle" style="fill:#111">29.3%</text><rect x="692" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.42" stroke="#E4E1D7"/><text x="735.0" y="182" class="num" text-anchor="middle" style="fill:#111">42.5%</text><rect x="784" y="150" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.31" stroke="#E4E1D7"/><text x="827.0" y="182" class="num" text-anchor="middle" style="fill:#111">28.2%</text><rect x="596" y="204" width="278" height="60" rx="6" class="band-y"/><text x="586" y="239" class="lbl" text-anchor="end">Добро</text><rect x="600" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.29" stroke="#E4E1D7"/><text x="643.0" y="240" class="num" text-anchor="middle" style="fill:#111">26.8%</text><rect x="692" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.32" stroke="#E4E1D7"/><text x="735.0" y="240" class="num" text-anchor="middle" style="fill:#111">29.6%</text><rect x="784" y="208" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.43" stroke="#E4E1D7"/><text x="827.0" y="240" class="num" text-anchor="middle" style="fill:#111">43.6%</text><text x="586" y="297" class="lbl" text-anchor="end">пожаловать</text><rect x="600" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.32" stroke="#E4E1D7"/><text x="643.0" y="298" class="num" text-anchor="middle" style="fill:#111">30.3%</text><rect x="692" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.36" stroke="#E4E1D7"/><text x="735.0" y="298" class="num" text-anchor="middle" style="fill:#111">34.5%</text><rect x="784" y="266" width="86" height="52" rx="4" fill="#C30B0A" fill-opacity="0.36" stroke="#E4E1D7"/><text x="827.0" y="298" class="num" text-anchor="middle" style="fill:#111">35.2%</text><text x="40" y="410" class="lbl">строки — перевод, столбцы — оригинал: матрица T × L</text></g>
  <g data-key="tbl" data-only="1"><text x="60" y="130" class="ttl">Блок</text><text x="340" y="130" class="ttl">Q из</text><text x="560" y="130" class="ttl">K и V из</text><text x="760" y="130" class="ttl">закрыто</text><line x1="60" x2="920" y1="160" y2="160" stroke="#E4E1D7"/><text x="60" y="194" class="lbl-b">Self-attention энкодера</text><text x="340" y="194" class="lbl">вход энкодера</text><text x="560" y="194" class="lbl">тот же вход</text><text x="760" y="194" class="lbl">только PAD</text><line x1="60" x2="920" y1="224" y2="224" stroke="#E4E1D7"/><text x="60" y="258" class="lbl-b">Masked self-attention</text><text x="340" y="258" class="lbl">вход декодера</text><text x="560" y="258" class="lbl">тот же вход</text><text x="760" y="258" class="lbl">PAD и будущее</text><line x1="60" x2="920" y1="288" y2="288" stroke="#E4E1D7"/><text x="60" y="322" class="lbl-b">Cross-attention</text><text x="340" y="322" class="lbl">декодер (U)</text><text x="560" y="322" class="lbl">память Hᴺ</text><text x="760" y="322" class="lbl">PAD источника</text><rect x="328" y="298" width="340" height="36" rx="6" fill="none" stroke="#C29E08" stroke-width="2"/><text x="60" y="400" class="cap">расчёт один и тот же; меняются только источники Q, K, V и маска</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Attention стоит в трёх местах</h4>
      <p>Подсвечены три блока: self-attention энкодера, masked self-attention декодера и cross-attention, куда приходит память энкодера. Формула у всех одна — различаются входы.</p>
    </div>
    <div class="step-panel" data-on="fx enc" data-focus="enc">
      <div class="step-kicker">Шаг 2 · self-attention энкодера</div>
      <h4>Q, K и V из одной последовательности</h4>
      <p>Вход энкодера проходит три разные проекции. Каждый запрос видит все позиции фразы; веса в строке дают в сумме 100%.</p>
    </div>
    <div class="step-panel" data-on="fx dec" data-focus="dec">
      <div class="step-kicker">Шаг 3 · masked self-attention</div>
      <h4>Декодеру закрыто будущее</h4>
      <p>Q, K, V снова из одной последовательности — входа декодера. Причинная маска ставит −∞ будущим ключам до softmax: каждой позиции доступны она сама и предыдущие.</p>
    </div>
    <div class="step-panel" data-on="fx cross" data-focus="cross">
      <div class="step-kicker">Шаг 4 · cross-attention</div>
      <h4>Перевод обращается к оригиналу</h4>
      <p>Запросы берутся из декодера, ключи и значения — из памяти энкодера <code>Hᴺ</code>. Матрица весов прямоугольная: строки — позиции перевода, столбцы — позиции оригинала.</p>
    </div>
    <div class="step-panel" data-on="tbl" data-focus="tbl">
      <div class="step-kicker">Шаг 5 · сводка</div>
      <h4>Три вопроса к любому блоку внимания</h4>
      <p>Откуда пришёл Q, откуда пришли K и V и какие ключи запросу разрешено видеть. Ответы на них полностью различают три блока.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> чтобы понимать блок внимания, достаточно каждый раз спросить: откуда пришёл Q, откуда пришли K и V и какие ключи разрешено видеть текущему запросу.</div>

<hr>

<h2 id="multihead">Глава 7. Multi-Head Attention: несколько взглядов одновременно</h2>

<p>Вместо одной проекции attention использует несколько голов. Каждая голова получает свои Q, K и V, независимо считает веса и результат, после чего результаты объединяются и снова проецируются в <code>d_model</code>.</p>

<p>Причина в устройстве softmax. Одна голова выдаёт <em>одно</em> распределение весов на строку, то есть вынуждена выбрать, какую связь считать главной. Но у слова в предложении связей обычно несколько сразу: с его определением, с глаголом, с концом фразы. Чтобы не заставлять их конкурировать за один и тот же вес, внимание считают несколько раз параллельно.</p>

<div class="math-display" data-tex="\mathrm{head}_i = \mathrm{Attention}(XW_i^Q,\; XW_i^K,\; XW_i^V), \qquad \mathrm{MHA}(X) = \mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)\,W^O"></div>

<p>Ключевая деталь — головы не добавляют вычислений, а делят имеющиеся. Ширина одной головы <code>d_k = d_model / h</code>, и после конкатенации ширина возвращается ровно к <code>d_model</code>. Восемь голов по 64 координаты и одна голова на 512 стоят примерно одинаково; разница в том, что первый вариант даёт восемь независимых распределений внимания вместо одного.</p>

<table class="shape-table">
  <tr><th>Шаг</th><th>Форма</th><th>В примере (d_model = 8, h = 2)</th></tr>
  <tr><td>вход блока</td><td><code>[L, d_model]</code></td><td><code>[4, 8]</code></td></tr>
  <tr><td>Q, K, V одной головы</td><td><code>[L, d_k]</code></td><td><code>[4, 4]</code></td></tr>
  <tr><td>веса внимания одной головы</td><td><code>[L, L]</code></td><td><code>[4, 4]</code></td></tr>
  <tr><td>выход одной головы</td><td><code>[L, d_k]</code></td><td><code>[4, 4]</code></td></tr>
  <tr><td>после Concat</td><td><code>[L, h · d_k]</code></td><td><code>[4, 8]</code></td></tr>
  <tr><td>после <code>W<sup>O</sup></code></td><td><code>[L, d_model]</code></td><td><code>[4, 8]</code></td></tr>
</table>

<div class="worked-example">
  <div class="worked-label">Числовой пример · деление ширины между головами</div>
  <div class="worked-grid">
    <div class="worked-cell">
      <span>Делим</span>
      <div class="math-display worked-math" data-tex="d_k = \frac{d_{model}}{h} = \frac{8}{2} = 4"></div>
    </div>
    <div class="worked-cell worked-result">
      <span>Собираем обратно</span>
      <div class="math-display worked-math" data-tex="2 \times 4 = 8 = d_{model}"></div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> ни одна голова не видит проекцию целиком — каждая работает со своими четырьмя координатами. Целостность восстанавливает финальная проекция <code>W<sup>O</sup></code>: она перемешивает конкатенированные куски, поэтому следующий блок снова получает связный вектор ширины <code>d_model</code>, а не два склеенных фрагмента.</p>
</div>

<div class="callout-yellow"><strong>Осторожно с интерпретацией:</strong> заманчиво говорить «эта голова отвечает за синтаксис, а та — за кореференцию». Иногда у обученных моделей действительно находят головы с понятным поведением, но никакой механизм этого не гарантирует: роли распределяются стихийно, многие головы дублируют друг друга, а часть можно удалить почти без потери качества. Multi-head даёт <em>возможность</em> разных взглядов, а не их разметку.</div>

<p>Посмотрим пошагово: устройство блока, проекции, оценки, маска, смешивание значений и сборка результата.</p>

<div class="stage" id="stageMh" tabindex="0">
  <div class="stage-figure">
<svg id="mh" viewBox="0 0 960 560" role="img" aria-label="Multi-Head Attention: схема трансформера, затем устройство блока и расчёт голов">
  <style>
    #mh { font-family: Helvetica, Arial, sans-serif; }
    #mh text { fill: #111111; }
    #mh .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #mh .offt { fill: #A29C92; font-size: 14px; }
    #mh .offs { fill: #A29C92; font-size: 12px; }
    #mh .is-focus .offt, #mh .is-focus .offs { font-weight: 400; }
    #mh .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #mh .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #mh .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #mh .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #mh .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #mh .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #mh .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #mh .lbl { font-size: 15px; }
    #mh .lbl-b { font-size: 15px; font-weight: 700; }
    #mh .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #mh .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #mh .cap { font-size: 13px; fill: #5E5850; }
    #mh .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #mh .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #mh .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #mh .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #mh .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #mh .band-y { fill: #FFF3C4; }
    #mh .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="mh-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="mh-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="mh-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="mh-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#mh-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#mh-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>

  </g>
  <g data-key="blk" data-only="1"><rect x="180" y="30" width="600" height="500" rx="40" fill="#FFF8F8" stroke="#C30B0A" stroke-width="1.4"/><text x="216" y="64" class="ttl" style="fill:#a30908">MULTI-HEAD ATTENTION · h = 2</text><rect x="230" y="470" width="100" height="36" rx="6" class="chip"/><text x="280" y="493" class="lbl" text-anchor="middle">Query</text><path d="M280 470 V432" class="edge" marker-end="url(#mh-arw)"/><rect x="245" y="380" width="90" height="38" rx="6" class="by"/><rect x="235" y="390" width="90" height="38" rx="6" class="by"/><text x="280" y="414" class="lbl-b" text-anchor="middle">WQ</text><path d="M280 380 L420 322" class="edge" marker-end="url(#mh-arw)"/><rect x="430" y="470" width="100" height="36" rx="6" class="chip"/><text x="480" y="493" class="lbl" text-anchor="middle">Key</text><path d="M480 470 V432" class="edge" marker-end="url(#mh-arw)"/><rect x="445" y="380" width="90" height="38" rx="6" class="by"/><rect x="435" y="390" width="90" height="38" rx="6" class="by"/><text x="480" y="414" class="lbl-b" text-anchor="middle">WK</text><path d="M480 380 L480 322" class="edge" marker-end="url(#mh-arw)"/><rect x="630" y="470" width="100" height="36" rx="6" class="chip"/><text x="680" y="493" class="lbl" text-anchor="middle">Value</text><path d="M680 470 V432" class="edge" marker-end="url(#mh-arw)"/><rect x="645" y="380" width="90" height="38" rx="6" class="by"/><rect x="635" y="390" width="90" height="38" rx="6" class="by"/><text x="680" y="414" class="lbl-b" text-anchor="middle">WV</text><path d="M680 380 L540 322" class="edge" marker-end="url(#mh-arw)"/><rect x="344" y="236" width="300" height="70" rx="10" class="br"/><rect x="330" y="250" width="300" height="70" rx="10" class="br"/><text x="480" y="280" class="lbl-b" text-anchor="middle">Scaled Dot-Product Attention</text><text x="480" y="302" class="cap" text-anchor="middle">QKᵀ/√dₖ → mask → softmax → ·V</text><text x="660" y="250" class="cap">× h голов,</text><text x="660" y="268" class="cap">у каждой свои W</text><path d="M480 236 V202" class="edge" marker-end="url(#mh-arw)"/><rect x="380" y="160" width="200" height="40" rx="8" class="bx"/><text x="480" y="186" class="lbl-b" text-anchor="middle">Concat</text><path d="M480 160 V132" class="edge" marker-end="url(#mh-arw)"/><rect x="380" y="90" width="200" height="40" rx="8" class="bg"/><text x="480" y="116" class="lbl-b" text-anchor="middle">Linear Wᴼ</text><path d="M480 90 V40" class="edge" marker-end="url(#mh-arw)"/></g>
  <g data-key="proj" data-only="1"><text x="300" y="90" class="ttl">X · [4, 8] · d_model = 8</text><text x="288" y="140.0" class="cap" text-anchor="end">You</text><rect x="300" y="120" width="46" height="30" rx="4" class="cell" /><text x="323.0" y="140.0" class="num" text-anchor="middle">0.20</text><rect x="350" y="120" width="46" height="30" rx="4" class="cell" /><text x="373.0" y="140.0" class="num" text-anchor="middle">0.70</text><rect x="400" y="120" width="46" height="30" rx="4" class="cell" /><text x="423.0" y="140.0" class="num" text-anchor="middle">0.40</text><rect x="450" y="120" width="46" height="30" rx="4" class="cell" /><text x="473.0" y="140.0" class="num" text-anchor="middle">1.10</text><rect x="500" y="120" width="46" height="30" rx="4" class="cell" /><text x="523.0" y="140.0" class="num" text-anchor="middle">0.20</text><rect x="550" y="120" width="46" height="30" rx="4" class="cell" /><text x="573.0" y="140.0" class="num" text-anchor="middle">0.90</text><rect x="600" y="120" width="46" height="30" rx="4" class="cell" /><text x="623.0" y="140.0" class="num" text-anchor="middle">0.30</text><rect x="650" y="120" width="46" height="30" rx="4" class="cell" /><text x="673.0" y="140.0" class="num" text-anchor="middle">1.20</text><rect x="296" y="150" width="404" height="38" rx="6" class="band-y"/><text x="288" y="174.0" class="cap" text-anchor="end">are</text><rect x="300" y="154" width="46" height="30" rx="4" class="cell" /><text x="323.0" y="174.0" class="num" text-anchor="middle">1.24</text><rect x="350" y="154" width="46" height="30" rx="4" class="cell" /><text x="373.0" y="174.0" class="num" text-anchor="middle">0.64</text><rect x="400" y="154" width="46" height="30" rx="4" class="cell" /><text x="423.0" y="174.0" class="num" text-anchor="middle">−0.10</text><rect x="450" y="154" width="46" height="30" rx="4" class="cell" /><text x="473.0" y="174.0" class="num" text-anchor="middle">1.30</text><rect x="500" y="154" width="46" height="30" rx="4" class="cell" /><text x="523.0" y="174.0" class="num" text-anchor="middle">0.21</text><rect x="550" y="154" width="46" height="30" rx="4" class="cell" /><text x="573.0" y="174.0" class="num" text-anchor="middle">1.10</text><rect x="600" y="154" width="46" height="30" rx="4" class="cell" /><text x="623.0" y="174.0" class="num" text-anchor="middle">−0.20</text><rect x="650" y="154" width="46" height="30" rx="4" class="cell" /><text x="673.0" y="174.0" class="num" text-anchor="middle">1.30</text><text x="288" y="208.0" class="cap" text-anchor="end">welcome</text><rect x="300" y="188" width="46" height="30" rx="4" class="cell" /><text x="323.0" y="208.0" class="num" text-anchor="middle">0.81</text><rect x="350" y="188" width="46" height="30" rx="4" class="cell" /><text x="373.0" y="208.0" class="num" text-anchor="middle">−0.12</text><rect x="400" y="188" width="46" height="30" rx="4" class="cell" /><text x="423.0" y="208.0" class="num" text-anchor="middle">0.50</text><rect x="450" y="188" width="46" height="30" rx="4" class="cell" /><text x="473.0" y="208.0" class="num" text-anchor="middle">1.18</text><rect x="500" y="188" width="46" height="30" rx="4" class="cell" /><text x="523.0" y="208.0" class="num" text-anchor="middle">−0.18</text><rect x="550" y="188" width="46" height="30" rx="4" class="cell" /><text x="573.0" y="208.0" class="num" text-anchor="middle">1.40</text><rect x="600" y="188" width="46" height="30" rx="4" class="cell" /><text x="623.0" y="208.0" class="num" text-anchor="middle">0.10</text><rect x="650" y="188" width="46" height="30" rx="4" class="cell" /><text x="673.0" y="208.0" class="num" text-anchor="middle">0.90</text><text x="288" y="242.0" class="cap" text-anchor="end">PAD</text><rect x="300" y="222" width="46" height="30" rx="4" class="cell" /><text x="323.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="350" y="222" width="46" height="30" rx="4" class="cell" /><text x="373.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="400" y="222" width="46" height="30" rx="4" class="cell" /><text x="423.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="450" y="222" width="46" height="30" rx="4" class="cell" /><text x="473.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="500" y="222" width="46" height="30" rx="4" class="cell" /><text x="523.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="550" y="222" width="46" height="30" rx="4" class="cell" /><text x="573.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="600" y="222" width="46" height="30" rx="4" class="cell" /><text x="623.0" y="242.0" class="num" text-anchor="middle">0.00</text><rect x="650" y="222" width="46" height="30" rx="4" class="cell" /><text x="673.0" y="242.0" class="num" text-anchor="middle">0.00</text><path d="M440 262 L205 340" class="edge-y" marker-end="url(#mh-arwy)"/><text x="185" y="310" class="cap" style="fill:#8C7106">WQ₁</text><text x="110" y="340" class="ttl">Q₁ · [4, 4]</text><text x="98" y="390.0" class="cap" text-anchor="end">You</text><rect x="110" y="370" width="46" height="30" rx="4" class="cell" /><text x="133.0" y="390.0" class="num" text-anchor="middle">−0.28</text><rect x="160" y="370" width="46" height="30" rx="4" class="cell" /><text x="183.0" y="390.0" class="num" text-anchor="middle">−0.17</text><rect x="210" y="370" width="46" height="30" rx="4" class="cell" /><text x="233.0" y="390.0" class="num" text-anchor="middle">−0.10</text><rect x="260" y="370" width="46" height="30" rx="4" class="cell" /><text x="283.0" y="390.0" class="num" text-anchor="middle">0.49</text><rect x="106" y="400" width="204" height="38" rx="6" class="band-y"/><text x="98" y="424.0" class="cap" text-anchor="end">are</text><rect x="110" y="404" width="46" height="30" rx="4" class="cell" /><text x="133.0" y="424.0" class="num" text-anchor="middle">0.45</text><rect x="160" y="404" width="46" height="30" rx="4" class="cell" /><text x="183.0" y="424.0" class="num" text-anchor="middle">−0.06</text><rect x="210" y="404" width="46" height="30" rx="4" class="cell" /><text x="233.0" y="424.0" class="num" text-anchor="middle">−0.44</text><rect x="260" y="404" width="46" height="30" rx="4" class="cell" /><text x="283.0" y="424.0" class="num" text-anchor="middle">0.21</text><text x="98" y="458.0" class="cap" text-anchor="end">welcome</text><rect x="110" y="438" width="46" height="30" rx="4" class="cell" /><text x="133.0" y="458.0" class="num" text-anchor="middle">0.32</text><rect x="160" y="438" width="46" height="30" rx="4" class="cell" /><text x="183.0" y="458.0" class="num" text-anchor="middle">−0.19</text><rect x="210" y="438" width="46" height="30" rx="4" class="cell" /><text x="233.0" y="458.0" class="num" text-anchor="middle">−0.03</text><rect x="260" y="438" width="46" height="30" rx="4" class="cell" /><text x="283.0" y="458.0" class="num" text-anchor="middle">0.28</text><text x="98" y="492.0" class="cap" text-anchor="end">PAD</text><rect x="110" y="472" width="46" height="30" rx="4" class="cell" /><text x="133.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="160" y="472" width="46" height="30" rx="4" class="cell" /><text x="183.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="210" y="472" width="46" height="30" rx="4" class="cell" /><text x="233.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="260" y="472" width="46" height="30" rx="4" class="cell" /><text x="283.0" y="492.0" class="num" text-anchor="middle">0.00</text><path d="M500 262 L505 340" class="edge-y" marker-end="url(#mh-arwy)"/><text x="505" y="310" class="cap" style="fill:#8C7106">WK₁</text><text x="410" y="340" class="ttl">K₁ · [4, 4]</text><rect x="410" y="370" width="46" height="30" rx="4" class="cell" /><text x="433.0" y="390.0" class="num" text-anchor="middle">−0.24</text><rect x="460" y="370" width="46" height="30" rx="4" class="cell" /><text x="483.0" y="390.0" class="num" text-anchor="middle">0.26</text><rect x="510" y="370" width="46" height="30" rx="4" class="cell" /><text x="533.0" y="390.0" class="num" text-anchor="middle">0.46</text><rect x="560" y="370" width="46" height="30" rx="4" class="cell" /><text x="583.0" y="390.0" class="num" text-anchor="middle">0.84</text><rect x="410" y="404" width="46" height="30" rx="4" class="cell" /><text x="433.0" y="424.0" class="num" text-anchor="middle">0.06</text><rect x="460" y="404" width="46" height="30" rx="4" class="cell" /><text x="483.0" y="424.0" class="num" text-anchor="middle">−0.09</text><rect x="510" y="404" width="46" height="30" rx="4" class="cell" /><text x="533.0" y="424.0" class="num" text-anchor="middle">−0.08</text><rect x="560" y="404" width="46" height="30" rx="4" class="cell" /><text x="583.0" y="424.0" class="num" text-anchor="middle">0.74</text><rect x="410" y="438" width="46" height="30" rx="4" class="cell" /><text x="433.0" y="458.0" class="num" text-anchor="middle">0.09</text><rect x="460" y="438" width="46" height="30" rx="4" class="cell" /><text x="483.0" y="458.0" class="num" text-anchor="middle">−0.23</text><rect x="510" y="438" width="46" height="30" rx="4" class="cell" /><text x="533.0" y="458.0" class="num" text-anchor="middle">0.14</text><rect x="560" y="438" width="46" height="30" rx="4" class="cell" /><text x="583.0" y="458.0" class="num" text-anchor="middle">0.55</text><rect x="410" y="472" width="46" height="30" rx="4" class="cell" /><text x="433.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="460" y="472" width="46" height="30" rx="4" class="cell" /><text x="483.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="510" y="472" width="46" height="30" rx="4" class="cell" /><text x="533.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="560" y="472" width="46" height="30" rx="4" class="cell" /><text x="583.0" y="492.0" class="num" text-anchor="middle">0.00</text><path d="M560 262 L805 340" class="edge-y" marker-end="url(#mh-arwy)"/><text x="825" y="310" class="cap" style="fill:#8C7106">WV₁</text><text x="710" y="340" class="ttl">V₁ · [4, 4]</text><rect x="710" y="370" width="46" height="30" rx="4" class="cell" /><text x="733.0" y="390.0" class="num" text-anchor="middle">0.35</text><rect x="760" y="370" width="46" height="30" rx="4" class="cell" /><text x="783.0" y="390.0" class="num" text-anchor="middle">0.70</text><rect x="810" y="370" width="46" height="30" rx="4" class="cell" /><text x="833.0" y="390.0" class="num" text-anchor="middle">0.48</text><rect x="860" y="370" width="46" height="30" rx="4" class="cell" /><text x="883.0" y="390.0" class="num" text-anchor="middle">0.43</text><rect x="710" y="404" width="46" height="30" rx="4" class="cell" /><text x="733.0" y="424.0" class="num" text-anchor="middle">0.37</text><rect x="760" y="404" width="46" height="30" rx="4" class="cell" /><text x="783.0" y="424.0" class="num" text-anchor="middle">0.46</text><rect x="810" y="404" width="46" height="30" rx="4" class="cell" /><text x="833.0" y="424.0" class="num" text-anchor="middle">0.36</text><rect x="860" y="404" width="46" height="30" rx="4" class="cell" /><text x="883.0" y="424.0" class="num" text-anchor="middle">0.81</text><rect x="710" y="438" width="46" height="30" rx="4" class="cell" /><text x="733.0" y="458.0" class="num" text-anchor="middle">0.23</text><rect x="760" y="438" width="46" height="30" rx="4" class="cell" /><text x="783.0" y="458.0" class="num" text-anchor="middle">0.06</text><rect x="810" y="438" width="46" height="30" rx="4" class="cell" /><text x="833.0" y="458.0" class="num" text-anchor="middle">0.39</text><rect x="860" y="438" width="46" height="30" rx="4" class="cell" /><text x="883.0" y="458.0" class="num" text-anchor="middle">0.63</text><rect x="710" y="472" width="46" height="30" rx="4" class="cell" /><text x="733.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="760" y="472" width="46" height="30" rx="4" class="cell" /><text x="783.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="810" y="472" width="46" height="30" rx="4" class="cell" /><text x="833.0" y="492.0" class="num" text-anchor="middle">0.00</text><rect x="860" y="472" width="46" height="30" rx="4" class="cell" /><text x="883.0" y="492.0" class="num" text-anchor="middle">0.00</text><text x="110" y="545" class="cap">голова 1 проецирует 8 координат в dₖ = 4; у головы 2 свои W и свои Q₂, K₂, V₂</text></g>
  <g data-key="score" data-only="1"><text x="170" y="130" class="ttl">S = Q₁K₁ᵀ / √4 · [4, 4]</text><text x="202.0" y="152" class="cap" text-anchor="middle">You</text><text x="272.0" y="152" class="cap" text-anchor="middle">are</text><text x="342.0" y="152" class="cap" text-anchor="middle">welcome</text><text x="412.0" y="152" class="cap" text-anchor="middle">PAD</text><text x="158" y="185.0" class="lbl" text-anchor="end">You</text><rect x="170" y="160" width="64" height="40" rx="4" class="cell" /><text x="202.0" y="185.0" class="num" text-anchor="middle">0.20</text><rect x="240" y="160" width="64" height="40" rx="4" class="cell" /><text x="272.0" y="185.0" class="num" text-anchor="middle">0.19</text><rect x="310" y="160" width="64" height="40" rx="4" class="cell" /><text x="342.0" y="185.0" class="num" text-anchor="middle">0.14</text><rect x="380" y="160" width="64" height="40" rx="4" class="cell" /><text x="412.0" y="185.0" class="num" text-anchor="middle">0.00</text><rect x="166" y="202" width="282" height="48" rx="6" class="band-y"/><text x="158" y="231.0" class="lbl" text-anchor="end">are</text><rect x="170" y="206" width="64" height="40" rx="4" class="cell" /><text x="202.0" y="231.0" class="num" text-anchor="middle">−0.07</text><rect x="240" y="206" width="64" height="40" rx="4" class="cell" /><text x="272.0" y="231.0" class="num" text-anchor="middle">0.11</text><rect x="310" y="206" width="64" height="40" rx="4" class="cell" /><text x="342.0" y="231.0" class="num" text-anchor="middle">0.06</text><rect x="380" y="206" width="64" height="40" rx="4" class="cell" /><text x="412.0" y="231.0" class="num" text-anchor="middle">0.00</text><text x="158" y="277.0" class="lbl" text-anchor="end">welcome</text><rect x="170" y="252" width="64" height="40" rx="4" class="cell" /><text x="202.0" y="277.0" class="num" text-anchor="middle">0.05</text><rect x="240" y="252" width="64" height="40" rx="4" class="cell" /><text x="272.0" y="277.0" class="num" text-anchor="middle">0.12</text><rect x="310" y="252" width="64" height="40" rx="4" class="cell" /><text x="342.0" y="277.0" class="num" text-anchor="middle">0.11</text><rect x="380" y="252" width="64" height="40" rx="4" class="cell" /><text x="412.0" y="277.0" class="num" text-anchor="middle">0.00</text><text x="158" y="323.0" class="lbl" text-anchor="end">PAD</text><rect x="170" y="298" width="64" height="40" rx="4" class="cell" /><text x="202.0" y="323.0" class="num" text-anchor="middle">0.00</text><rect x="240" y="298" width="64" height="40" rx="4" class="cell" /><text x="272.0" y="323.0" class="num" text-anchor="middle">0.00</text><rect x="310" y="298" width="64" height="40" rx="4" class="cell" /><text x="342.0" y="323.0" class="num" text-anchor="middle">0.00</text><rect x="380" y="298" width="64" height="40" rx="4" class="cell" /><text x="412.0" y="323.0" class="num" text-anchor="middle">0.00</text><text x="170" y="380" class="cap">строка — запрос, столбец — ключ</text></g>
  <g data-key="mask" data-only="1"><rect x="380" y="160" width="64" height="40" rx="4" fill="#FFF2F2" stroke="#C30B0A"/><text x="412" y="185" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><rect x="380" y="206" width="64" height="40" rx="4" fill="#FFF2F2" stroke="#C30B0A"/><text x="412" y="231" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><rect x="380" y="252" width="64" height="40" rx="4" fill="#FFF2F2" stroke="#C30B0A"/><text x="412" y="277" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><rect x="380" y="298" width="64" height="40" rx="4" fill="#FFF2F2" stroke="#C30B0A"/><text x="412" y="323" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><path d="M470 240 H560" class="edge" marker-end="url(#mh-arw)"/><text x="515" y="228" class="cap" text-anchor="middle">softmax</text><text x="620" y="130" class="ttl">A₁ · веса</text><text x="652.0" y="152" class="cap" text-anchor="middle">You</text><text x="722.0" y="152" class="cap" text-anchor="middle">are</text><text x="792.0" y="152" class="cap" text-anchor="middle">welcome</text><text x="862.0" y="152" class="cap" text-anchor="middle">PAD</text><text x="608" y="185.0" class="lbl" text-anchor="end">You</text><rect x="620" y="160" width="64" height="40" rx="4" class="cell" /><text x="652.0" y="185.0" class="num" text-anchor="middle">34.1%</text><rect x="690" y="160" width="64" height="40" rx="4" class="cell" /><text x="722.0" y="185.0" class="num" text-anchor="middle">33.8%</text><rect x="760" y="160" width="64" height="40" rx="4" class="cell" /><text x="792.0" y="185.0" class="num" text-anchor="middle">32.1%</text><rect x="830" y="160" width="64" height="40" rx="4" class="cell" style="fill:#F4F2EC"/><text x="862.0" y="185.0" class="num" text-anchor="middle">0</text><rect x="616" y="202" width="282" height="48" rx="6" class="band-g"/><text x="608" y="231.0" class="lbl" text-anchor="end">are</text><rect x="620" y="206" width="64" height="40" rx="4" class="cell" /><text x="652.0" y="231.0" class="num" text-anchor="middle">29.9%</text><rect x="690" y="206" width="64" height="40" rx="4" class="cell" /><text x="722.0" y="231.0" class="num" text-anchor="middle">36.0%</text><rect x="760" y="206" width="64" height="40" rx="4" class="cell" /><text x="792.0" y="231.0" class="num" text-anchor="middle">34.1%</text><rect x="830" y="206" width="64" height="40" rx="4" class="cell" style="fill:#F4F2EC"/><text x="862.0" y="231.0" class="num" text-anchor="middle">0</text><text x="608" y="277.0" class="lbl" text-anchor="end">welcome</text><rect x="620" y="252" width="64" height="40" rx="4" class="cell" /><text x="652.0" y="277.0" class="num" text-anchor="middle">31.8%</text><rect x="690" y="252" width="64" height="40" rx="4" class="cell" /><text x="722.0" y="277.0" class="num" text-anchor="middle">34.3%</text><rect x="760" y="252" width="64" height="40" rx="4" class="cell" /><text x="792.0" y="277.0" class="num" text-anchor="middle">33.9%</text><rect x="830" y="252" width="64" height="40" rx="4" class="cell" style="fill:#F4F2EC"/><text x="862.0" y="277.0" class="num" text-anchor="middle">0</text><text x="608" y="323.0" class="lbl" text-anchor="end">PAD</text><rect x="620" y="298" width="64" height="40" rx="4" class="cell" /><text x="652.0" y="323.0" class="num" text-anchor="middle">33.3%</text><rect x="690" y="298" width="64" height="40" rx="4" class="cell" /><text x="722.0" y="323.0" class="num" text-anchor="middle">33.3%</text><rect x="760" y="298" width="64" height="40" rx="4" class="cell" /><text x="792.0" y="323.0" class="num" text-anchor="middle">33.3%</text><rect x="830" y="298" width="64" height="40" rx="4" class="cell" style="fill:#F4F2EC"/><text x="862.0" y="323.0" class="num" text-anchor="middle">0</text><text x="170" y="400" class="cap" style="fill:#a30908">PAD закрыт как ключ: −∞ до softmax, вес ровно 0 в каждой строке</text></g>
  <g data-key="mix" data-only="1"><text x="260" y="110" class="ttl">V₁ и веса запроса «are»</text><text x="292.0" y="132" class="cap" text-anchor="middle">v1</text><text x="362.0" y="132" class="cap" text-anchor="middle">v2</text><text x="432.0" y="132" class="cap" text-anchor="middle">v3</text><text x="502.0" y="132" class="cap" text-anchor="middle">v4</text><text x="248" y="165.0" class="lbl" text-anchor="end">You · 29.9%</text><rect x="260" y="140" width="64" height="40" rx="4" class="cell" /><text x="292.0" y="165.0" class="num" text-anchor="middle">0.35</text><rect x="330" y="140" width="64" height="40" rx="4" class="cell" /><text x="362.0" y="165.0" class="num" text-anchor="middle">0.70</text><rect x="400" y="140" width="64" height="40" rx="4" class="cell" /><text x="432.0" y="165.0" class="num" text-anchor="middle">0.48</text><rect x="470" y="140" width="64" height="40" rx="4" class="cell" /><text x="502.0" y="165.0" class="num" text-anchor="middle">0.43</text><text x="248" y="211.0" class="lbl" text-anchor="end">are · 36.0%</text><rect x="260" y="186" width="64" height="40" rx="4" class="cell" /><text x="292.0" y="211.0" class="num" text-anchor="middle">0.37</text><rect x="330" y="186" width="64" height="40" rx="4" class="cell" /><text x="362.0" y="211.0" class="num" text-anchor="middle">0.46</text><rect x="400" y="186" width="64" height="40" rx="4" class="cell" /><text x="432.0" y="211.0" class="num" text-anchor="middle">0.36</text><rect x="470" y="186" width="64" height="40" rx="4" class="cell" /><text x="502.0" y="211.0" class="num" text-anchor="middle">0.81</text><text x="248" y="257.0" class="lbl" text-anchor="end">welcome · 34.1%</text><rect x="260" y="232" width="64" height="40" rx="4" class="cell" /><text x="292.0" y="257.0" class="num" text-anchor="middle">0.23</text><rect x="330" y="232" width="64" height="40" rx="4" class="cell" /><text x="362.0" y="257.0" class="num" text-anchor="middle">0.06</text><rect x="400" y="232" width="64" height="40" rx="4" class="cell" /><text x="432.0" y="257.0" class="num" text-anchor="middle">0.39</text><rect x="470" y="232" width="64" height="40" rx="4" class="cell" /><text x="502.0" y="257.0" class="num" text-anchor="middle">0.63</text><text x="248" y="303.0" class="lbl" text-anchor="end">PAD · 0%</text><rect x="260" y="278" width="64" height="40" rx="4" class="cell" /><text x="292.0" y="303.0" class="num" text-anchor="middle">0.00</text><rect x="330" y="278" width="64" height="40" rx="4" class="cell" /><text x="362.0" y="303.0" class="num" text-anchor="middle">0.00</text><rect x="400" y="278" width="64" height="40" rx="4" class="cell" /><text x="432.0" y="303.0" class="num" text-anchor="middle">0.00</text><rect x="470" y="278" width="64" height="40" rx="4" class="cell" /><text x="502.0" y="303.0" class="num" text-anchor="middle">0.00</text><path d="M560 240 H620" class="edge" marker-end="url(#mh-arw)"/><text x="590" y="228" class="cap" text-anchor="middle">Σ α·V</text><text x="626" y="172" class="lbl" text-anchor="end"></text><rect x="640" y="150" width="64" height="34" rx="4" class="bg"/><text x="672.0" y="172" class="num" text-anchor="middle">0.32</text><rect x="710" y="150" width="64" height="34" rx="4" class="bg"/><text x="742.0" y="172" class="num" text-anchor="middle">0.39</text><rect x="780" y="150" width="64" height="34" rx="4" class="bg"/><text x="812.0" y="172" class="num" text-anchor="middle">0.41</text><rect x="850" y="150" width="64" height="34" rx="4" class="bg"/><text x="882.0" y="172" class="num" text-anchor="middle">0.63</text><text x="640" y="140" class="ttl">z₁ · голова 1</text><text x="626" y="312" class="lbl" text-anchor="end"></text><rect x="640" y="290" width="64" height="34" rx="4" class="by"/><text x="672.0" y="312" class="num" text-anchor="middle">0.49</text><rect x="710" y="290" width="64" height="34" rx="4" class="by"/><text x="742.0" y="312" class="num" text-anchor="middle">0.46</text><rect x="780" y="290" width="64" height="34" rx="4" class="by"/><text x="812.0" y="312" class="num" text-anchor="middle">0.33</text><rect x="850" y="290" width="64" height="34" rx="4" class="by"/><text x="882.0" y="312" class="num" text-anchor="middle">0.45</text><text x="640" y="280" class="ttl">z₂ · голова 2, свои W</text><text x="260" y="400" class="cap">выход головы — взвешенная сумма строк V, длина dₖ = 4</text></g>
  <g data-key="cat" data-only="1"><text x="120" y="120" class="ttl">Concat(z₁, z₂) · 8</text><rect x="120" y="130" width="82" height="36" rx="4" class="bg"/><text x="161" y="153" class="num" text-anchor="middle">0.32</text><rect x="208" y="130" width="82" height="36" rx="4" class="bg"/><text x="249" y="153" class="num" text-anchor="middle">0.39</text><rect x="296" y="130" width="82" height="36" rx="4" class="bg"/><text x="337" y="153" class="num" text-anchor="middle">0.41</text><rect x="384" y="130" width="82" height="36" rx="4" class="bg"/><text x="425" y="153" class="num" text-anchor="middle">0.63</text><rect x="472" y="130" width="82" height="36" rx="4" class="by"/><text x="513" y="153" class="num" text-anchor="middle">0.49</text><rect x="560" y="130" width="82" height="36" rx="4" class="by"/><text x="601" y="153" class="num" text-anchor="middle">0.46</text><rect x="648" y="130" width="82" height="36" rx="4" class="by"/><text x="689" y="153" class="num" text-anchor="middle">0.33</text><rect x="736" y="130" width="82" height="36" rx="4" class="by"/><text x="777" y="153" class="num" text-anchor="middle">0.45</text><path d="M470 172 V222" class="edge" marker-end="url(#mh-arw)"/><rect x="380" y="226" width="180" height="44" rx="8" class="bg"/><text x="470" y="254" class="lbl-b" text-anchor="middle">Wᴼ · [8 × 8]</text><path d="M470 274 V314" class="edge" marker-end="url(#mh-arw)"/><text x="120" y="310" class="ttl">выход MHA для «are» · d_model = 8</text><rect x="120" y="320" width="82" height="36" rx="4" class="bx"/><text x="161" y="343" class="num" text-anchor="middle">0.25</text><rect x="208" y="320" width="82" height="36" rx="4" class="bx"/><text x="249" y="343" class="num" text-anchor="middle">0.32</text><rect x="296" y="320" width="82" height="36" rx="4" class="bx"/><text x="337" y="343" class="num" text-anchor="middle">0.31</text><rect x="384" y="320" width="82" height="36" rx="4" class="bx"/><text x="425" y="343" class="num" text-anchor="middle">0.50</text><rect x="472" y="320" width="82" height="36" rx="4" class="bx"/><text x="513" y="343" class="num" text-anchor="middle">0.42</text><rect x="560" y="320" width="82" height="36" rx="4" class="bx"/><text x="601" y="343" class="num" text-anchor="middle">0.37</text><rect x="648" y="320" width="82" height="36" rx="4" class="bx"/><text x="689" y="343" class="num" text-anchor="middle">0.27</text><rect x="736" y="320" width="82" height="36" rx="4" class="bx"/><text x="777" y="343" class="num" text-anchor="middle">0.36</text><text x="120" y="410" class="cap">2 × 4 = 8: ширина вернулась к d_model, Wᴼ перемешивает куски голов в один вектор</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Внутрь каждого красного блока</h4>
      <p>Все три блока внимания из прошлой главы устроены одинаково — как Multi-Head Attention. Теперь раскрываем один такой блок; пример — self-attention энкодера.</p>
    </div>
    <div class="step-panel" data-on="blk" data-focus="blk">
      <div class="step-kicker">Шаг 2 · устройство</div>
      <h4>Несколько голов считают внимание параллельно</h4>
      <p>У каждой головы свои проекции W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> и свой расчёт внимания. Выходы голов склеиваются (Concat) и проходят общую проекцию Wᴼ.</p>
    </div>
    <div class="step-panel" data-on="proj" data-focus="proj">
      <div class="step-kicker">Шаг 3 · проекции</div>
      <h4>Каждая голова получает свои Q, K, V</h4>
      <p>Вход <code>[4, 8]</code> умножается на матрицы головы и даёт Q₁, K₁, V₁ формы <code>[4, 4]</code>: ширина делится между головами, <code>dₖ = 8 / 2 = 4</code>.</p>
    </div>
    <div class="step-panel" data-on="score" data-focus="score">
      <div class="step-kicker">Шаг 4 · оценки</div>
      <h4>Каждый Q сравнивается с каждым K</h4>
      <p><code>S = QKᵀ / √dₖ</code> — матрица <code>[4, 4]</code>: строка на запрос, столбец на ключ. Деление на √4 держит оценки в разумном диапазоне.</p>
    </div>
    <div class="step-panel" data-on="score mask" data-focus="mask">
      <div class="step-kicker">Шаг 5 · маска и softmax</div>
      <h4>Маска — до softmax</h4>
      <p>Запрещённым парам прибавляется −∞, и softmax даёт им ровно 0. В энкодере закрыт ключ PAD; в декодере добавились бы ещё будущие позиции.</p>
    </div>
    <div class="step-panel" data-on="mix" data-focus="mix">
      <div class="step-kicker">Шаг 6 · смешивание</div>
      <h4>Веса собирают значения V</h4>
      <p>Для «are» веса умножают строки V₁, сумма даёт выход головы <code>z₁</code>. Голова 2 делает то же со своими проекциями и получает другой <code>z₂</code>.</p>
    </div>
    <div class="step-panel" data-on="cat" data-focus="cat">
      <div class="step-kicker">Шаг 7 · сборка</div>
      <h4>Concat и Wᴼ возвращают ширину d_model</h4>
      <p>Два куска по 4 склеиваются в 8, Wᴼ перемешивает их в один связный вектор. Следующий блок получает ту же ширину, что была на входе.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> Multi-Head Attention не меняет принцип внимания: меняется число параллельных представлений, через которые модель ищет разные типы связей, а ширина потока остаётся прежней.</div>

<hr>

<h2 id="masks">Глава 8. Attention Masks: какие связи запрещены</h2>

<p>Маска меняет не сами токены, а допустимые пары «query → key». В энкодере и cross-attention она скрывает padding, а в decoder self-attention дополнительно запрещает смотреть в будущее.</p>

<p>Технически маска — это матрица слагаемых, которую прибавляют к оценкам прямо перед softmax: ноль для разрешённой пары и минус бесконечность для запрещённой. После экспоненты запрещённый вес обращается в ноль точно, а не приблизительно.</p>

<div class="math-display" data-tex="\mathrm{score}'_{jk} = \frac{q_j k_k^{\top}}{\sqrt{d_k}} + M_{jk}, \qquad M_{jk} \in \{0,\; -\infty\}"></div>

<p>Причин для запрета ровно две, и их полезно различать. <strong>Padding-маска</strong> убирает искусственные токены, которыми выравнивали длины в батче: <code>PAD</code> не несёт содержания, и если позволить ему участвовать в весах, он начнёт красть внимание у настоящих слов. <strong>Причинная (causal) маска</strong> живёт только в self-attention декодера и запрещает позиции смотреть на более поздние.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · строка запроса «welcome», ключи [You, are, welcome, PAD]</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Что делает маска с распределением</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">без маски</div>
      <div class="math-display worked-trace-math" data-tex="(0.269,\; 0.081,\; 0.541,\; 0.109)"></div>
      <div class="worked-trace-note">почти 11% внимания уходит на пустой токен</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">с маской</div>
      <div class="math-display worked-trace-math" data-tex="(0.302,\; 0.091,\; 0.607,\; 0)"></div>
      <div class="worked-trace-note">освободившийся вес разошёлся по трём оставшимся ключам</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> маска не просто обнулила четвёртый столбец — она изменила <em>все</em> веса строки. Softmax нормирует на сумму, поэтому убрать один вариант значит перераспределить его долю между остальными. Отсюда практическое следствие: забытая padding-маска портит не только колонку <code>PAD</code>, а всю матрицу внимания.</p>
</div>

<p>Причинная маска отвечает на другой вопрос — как вообще возможно обучать декодер параллельно. При обучении применяют <strong>teacher forcing</strong>: правильный перевод целиком подают на вход декодера, сдвинув его вправо. Все позиции считаются за один проход, и без запрета позиция 2 просто прочитала бы в своём входе тот самый токен, который должна предсказать.</p>

<div class="callout-red"><strong>Что ломается без причинной маски:</strong> на обучении loss падает подозрительно быстро, и модель выглядит отличной — она научилась не переводить, а копировать ответ из собственного входа. На инференсе будущих токенов не существует, копировать нечего, и качество рушится. Сдвиг входа и треугольная маска нужны вместе: сдвиг задаёт, что позиция предсказывает, маска гарантирует, что она этого ещё не видела.</div>

<p>Посмотрим пошагово обе маски на матрицах оценок и весов.</p>

<div class="stage" id="stageMk" tabindex="0">
  <div class="stage-figure">
<svg id="mk" viewBox="0 0 960 560" role="img" aria-label="Маски: схема трансформера, затем padding, причинная маска и teacher forcing">
  <style>
    #mk { font-family: Helvetica, Arial, sans-serif; }
    #mk text { fill: #111111; }
    #mk .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #mk .offt { fill: #A29C92; font-size: 14px; }
    #mk .offs { fill: #A29C92; font-size: 12px; }
    #mk .is-focus .offt, #mk .is-focus .offs { font-weight: 400; }
    #mk .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #mk .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #mk .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #mk .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #mk .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #mk .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #mk .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #mk .lbl { font-size: 15px; }
    #mk .lbl-b { font-size: 15px; font-weight: 700; }
    #mk .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #mk .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #mk .cap { font-size: 13px; fill: #5E5850; }
    #mk .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #mk .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #mk .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #mk .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #mk .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #mk .band-y { fill: #FFF3C4; }
    #mk .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="mk-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="mk-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="mk-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="mk-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#mk-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#mk-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#mk-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>

  </g>
  <g data-key="sc" data-only="1"><text x="150" y="116" class="ttl">оценки S = QKᵀ/√dₖ · энкодер</text><text x="189.0" y="140" class="cap" text-anchor="middle">You</text><text x="273.0" y="140" class="cap" text-anchor="middle">are</text><text x="357.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="441.0" y="140" class="cap" text-anchor="middle">PAD</text><text x="138" y="178.0" class="lbl" text-anchor="end">You</text><rect x="150" y="150" width="78" height="46" rx="4" class="cell"/><text x="189.0" y="178.0" class="num" text-anchor="middle">2.10</text><rect x="234" y="150" width="78" height="46" rx="4" class="cell"/><text x="273.0" y="178.0" class="num" text-anchor="middle">0.60</text><rect x="318" y="150" width="78" height="46" rx="4" class="cell"/><text x="357.0" y="178.0" class="num" text-anchor="middle">1.20</text><rect x="402" y="150" width="78" height="46" rx="4" class="cell"/><text x="441.0" y="178.0" class="num" text-anchor="middle">0.20</text><text x="138" y="230.0" class="lbl" text-anchor="end">are</text><rect x="150" y="202" width="78" height="46" rx="4" class="cell"/><text x="189.0" y="230.0" class="num" text-anchor="middle">0.40</text><rect x="234" y="202" width="78" height="46" rx="4" class="cell"/><text x="273.0" y="230.0" class="num" text-anchor="middle">2.00</text><rect x="318" y="202" width="78" height="46" rx="4" class="cell"/><text x="357.0" y="230.0" class="num" text-anchor="middle">0.60</text><rect x="402" y="202" width="78" height="46" rx="4" class="cell"/><text x="441.0" y="230.0" class="num" text-anchor="middle">1.10</text><text x="138" y="282.0" class="lbl" text-anchor="end">welcome</text><rect x="150" y="254" width="78" height="46" rx="4" class="cell"/><text x="189.0" y="282.0" class="num" text-anchor="middle">1.40</text><rect x="234" y="254" width="78" height="46" rx="4" class="cell"/><text x="273.0" y="282.0" class="num" text-anchor="middle">0.20</text><rect x="318" y="254" width="78" height="46" rx="4" class="cell"/><text x="357.0" y="282.0" class="num" text-anchor="middle">2.10</text><rect x="402" y="254" width="78" height="46" rx="4" class="cell"/><text x="441.0" y="282.0" class="num" text-anchor="middle">0.50</text></g>
  <g data-key="m" data-only="1"><text x="590" y="116" class="ttl">маска M: 0 или −∞</text><text x="629.0" y="140" class="cap" text-anchor="middle">You</text><text x="713.0" y="140" class="cap" text-anchor="middle">are</text><text x="797.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="881.0" y="140" class="cap" text-anchor="middle">PAD</text><rect x="590" y="150" width="78" height="46" rx="4" class="cell"/><text x="629.0" y="178.0" class="num" text-anchor="middle">0</text><rect x="674" y="150" width="78" height="46" rx="4" class="cell"/><text x="713.0" y="178.0" class="num" text-anchor="middle">0</text><rect x="758" y="150" width="78" height="46" rx="4" class="cell"/><text x="797.0" y="178.0" class="num" text-anchor="middle">0</text><rect x="842" y="150" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="178.0" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><rect x="590" y="202" width="78" height="46" rx="4" class="cell"/><text x="629.0" y="230.0" class="num" text-anchor="middle">0</text><rect x="674" y="202" width="78" height="46" rx="4" class="cell"/><text x="713.0" y="230.0" class="num" text-anchor="middle">0</text><rect x="758" y="202" width="78" height="46" rx="4" class="cell"/><text x="797.0" y="230.0" class="num" text-anchor="middle">0</text><rect x="842" y="202" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="230.0" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><rect x="590" y="254" width="78" height="46" rx="4" class="cell"/><text x="629.0" y="282.0" class="num" text-anchor="middle">0</text><rect x="674" y="254" width="78" height="46" rx="4" class="cell"/><text x="713.0" y="282.0" class="num" text-anchor="middle">0</text><rect x="758" y="254" width="78" height="46" rx="4" class="cell"/><text x="797.0" y="282.0" class="num" text-anchor="middle">0</text><rect x="842" y="254" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="282.0" class="num" style="fill:#C30B0A" text-anchor="middle">−∞</text><text x="548" y="232" class="shape" text-anchor="middle">+</text><text x="150" y="360" class="cap">M прибавляется к оценкам прямо перед softmax: столбец PAD закрыт для каждого запроса</text><text x="150" y="382" class="cap">строка-запрос PAD в результат не идёт и здесь не показана</text></g>
  <g data-key="wb" data-only="1"><text x="150" y="116" class="ttl">веса без маски</text><text x="189.0" y="140" class="cap" text-anchor="middle">You</text><text x="273.0" y="140" class="cap" text-anchor="middle">are</text><text x="357.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="441.0" y="140" class="cap" text-anchor="middle">PAD</text><text x="138" y="178.0" class="lbl" text-anchor="end">You</text><rect x="150" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.51" stroke="#E4E1D7"/><text x="189.0" y="178.0" class="num" text-anchor="middle" style="fill:#fff">56.2%</text><rect x="234" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.16" stroke="#E4E1D7"/><text x="273.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">12.5%</text><rect x="318" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.24" stroke="#E4E1D7"/><text x="357.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">22.9%</text><rect x="402" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.13" stroke="#E4E1D7"/><text x="441.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">8.4%</text><text x="138" y="230.0" class="lbl" text-anchor="end">are</text><rect x="150" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.15" stroke="#E4E1D7"/><text x="189.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">10.9%</text><rect x="234" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.49" stroke="#E4E1D7"/><text x="273.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">53.9%</text><rect x="318" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.17" stroke="#E4E1D7"/><text x="357.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">13.3%</text><rect x="402" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.24" stroke="#E4E1D7"/><text x="441.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">21.9%</text><rect x="146" y="250" width="338" height="54" rx="6" class="band-y"/><text x="138" y="282.0" class="lbl" text-anchor="end">welcome</text><rect x="150" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.27" stroke="#E4E1D7"/><text x="189.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">26.9%</text><rect x="234" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.12" stroke="#E4E1D7"/><text x="273.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">8.1%</text><rect x="318" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.49" stroke="#E4E1D7"/><text x="357.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">54.1%</text><rect x="402" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.15" stroke="#E4E1D7"/><text x="441.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">10.9%</text></g>
  <g data-key="wa" data-only="1"><text x="590" y="116" class="ttl">веса с маской</text><text x="629.0" y="140" class="cap" text-anchor="middle">You</text><text x="713.0" y="140" class="cap" text-anchor="middle">are</text><text x="797.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="881.0" y="140" class="cap" text-anchor="middle">PAD</text><rect x="590" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.55" stroke="#E4E1D7"/><text x="629.0" y="178.0" class="num" text-anchor="middle" style="fill:#fff">61.4%</text><rect x="674" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.17" stroke="#E4E1D7"/><text x="713.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">13.7%</text><rect x="758" y="150" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.26" stroke="#E4E1D7"/><text x="797.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">24.9%</text><rect x="842" y="150" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="178.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="590" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.17" stroke="#E4E1D7"/><text x="629.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">13.9%</text><rect x="674" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.61" stroke="#E4E1D7"/><text x="713.0" y="230.0" class="num" text-anchor="middle" style="fill:#fff">69.0%</text><rect x="758" y="202" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.20" stroke="#E4E1D7"/><text x="797.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">17.0%</text><rect x="842" y="202" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="230.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="586" y="250" width="338" height="54" rx="6" class="band-y"/><rect x="590" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.30" stroke="#E4E1D7"/><text x="629.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">30.2%</text><rect x="674" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.13" stroke="#E4E1D7"/><text x="713.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">9.1%</text><rect x="758" y="254" width="78" height="46" rx="4" fill="#C30B0A" fill-opacity="0.55" stroke="#E4E1D7"/><text x="797.0" y="282.0" class="num" text-anchor="middle" style="fill:#fff">60.7%</text><rect x="842" y="254" width="78" height="46" rx="4" class="chip-sp"/><text x="881.0" y="282.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><path d="M516 228 H574" class="edge" marker-end="url(#mk-arw)"/><text x="150" y="360" class="lbl">welcome: 10.9% уходило на PAD → после маски 0,</text><text x="150" y="384" class="lbl">а 26.9 / 8.1 / 54.1 стали 30.2 / 9.1 / 60.7 — поменялась вся строка</text></g>
  <g data-key="cr" data-only="1"><text x="300" y="116" class="ttl">cross-attention: строки — перевод, столбцы — оригинал</text><text x="343.0" y="140" class="cap" text-anchor="middle">You</text><text x="435.0" y="140" class="cap" text-anchor="middle">are</text><text x="527.0" y="140" class="cap" text-anchor="middle">welcome</text><text x="619.0" y="140" class="cap" text-anchor="middle">PAD</text><text x="288" y="178.0" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="300" y="150" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.28" stroke="#E4E1D7"/><text x="343.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">27.5%</text><rect x="392" y="150" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.46" stroke="#E4E1D7"/><text x="435.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">50.0%</text><rect x="484" y="150" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.24" stroke="#E4E1D7"/><text x="527.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">22.5%</text><rect x="576" y="150" width="86" height="46" rx="4" class="chip-sp"/><text x="619.0" y="178.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><text x="288" y="230.0" class="lbl" text-anchor="end">Добро</text><rect x="300" y="202" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.43" stroke="#E4E1D7"/><text x="343.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">46.1%</text><rect x="392" y="202" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.24" stroke="#E4E1D7"/><text x="435.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">22.9%</text><rect x="484" y="202" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.31" stroke="#E4E1D7"/><text x="527.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">30.9%</text><rect x="576" y="202" width="86" height="46" rx="4" class="chip-sp"/><text x="619.0" y="230.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><text x="288" y="282.0" class="lbl" text-anchor="end">пожаловать</text><rect x="300" y="254" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.27" stroke="#E4E1D7"/><text x="343.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">26.5%</text><rect x="392" y="254" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.18" stroke="#E4E1D7"/><text x="435.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">14.5%</text><rect x="484" y="254" width="86" height="46" rx="4" fill="#C30B0A" fill-opacity="0.53" stroke="#E4E1D7"/><text x="527.0" y="282.0" class="num" text-anchor="middle" style="fill:#fff">59.0%</text><rect x="576" y="254" width="86" height="46" rx="4" class="chip-sp"/><text x="619.0" y="282.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><text x="300" y="360" class="cap">запросы из декодера, ключи из энкодера: закрыт PAD источника, будущего здесь нет</text></g>
  <g data-key="cz" data-only="1"><text x="300" y="116" class="ttl">masked self-attention декодера</text><text x="355.0" y="140" class="cap" text-anchor="middle">&lt;START&gt;</text><text x="471.0" y="140" class="cap" text-anchor="middle">Добро</text><text x="587.0" y="140" class="cap" text-anchor="middle">пожаловать</text><text x="288" y="178.0" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="300" y="150" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.86" stroke="#E4E1D7"/><text x="355.0" y="178.0" class="num" text-anchor="middle" style="fill:#fff">100.0%</text><rect x="416" y="150" width="110" height="46" rx="4" class="chip-sp"/><text x="471.0" y="178.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="532" y="150" width="110" height="46" rx="4" class="chip-sp"/><text x="587.0" y="178.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><rect x="296" y="198" width="350" height="54" rx="6" class="band-y"/><text x="288" y="230.0" class="lbl" text-anchor="end">Добро</text><rect x="300" y="202" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.19" stroke="#E4E1D7"/><text x="355.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">16.8%</text><rect x="416" y="202" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.73" stroke="#E4E1D7"/><text x="471.0" y="230.0" class="num" text-anchor="middle" style="fill:#fff">83.2%</text><rect x="532" y="202" width="110" height="46" rx="4" class="chip-sp"/><text x="587.0" y="230.0" class="num" style="fill:#C30B0A" text-anchor="middle">×</text><text x="288" y="282.0" class="lbl" text-anchor="end">пожаловать</text><rect x="300" y="254" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.30" stroke="#E4E1D7"/><text x="355.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">30.2%</text><rect x="416" y="254" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.13" stroke="#E4E1D7"/><text x="471.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">9.1%</text><rect x="532" y="254" width="110" height="46" rx="4" fill="#C30B0A" fill-opacity="0.55" stroke="#E4E1D7"/><text x="587.0" y="282.0" class="num" text-anchor="middle" style="fill:#fff">60.7%</text><text x="300" y="360" class="cap">в каждой следующей строке открывается ровно один новый ключ — нижний треугольник</text></g>
  <g data-key="tf" data-only="1"><text x="40" y="95" class="ttl">цель</text><text x="40" y="405" class="ttl">вход</text><rect x="200" y="70" width="140" height="40" rx="8" class="chip"/><text x="270" y="95" class="lbl" text-anchor="middle">Добро</text><rect x="420" y="70" width="140" height="40" rx="8" class="bg"/><text x="490" y="95" class="lbl" text-anchor="middle">пожаловать</text><rect x="640" y="70" width="140" height="40" rx="8" class="chip"/><text x="710" y="95" class="lbl" text-anchor="middle">&lt;END&gt;</text><rect x="200" y="380" width="140" height="40" rx="8" class="chip"/><text x="270" y="405" class="lbl" text-anchor="middle">&lt;START&gt;</text><path d="M270 378 Q 380.0 240 490 114" fill="none" stroke="#73B222" stroke-width="2.2" marker-end="url(#mk-arw)"/><rect x="420" y="380" width="140" height="40" rx="8" class="chip"/><text x="490" y="405" class="lbl" text-anchor="middle">Добро</text><path d="M490 378 Q 490.0 240 490 114" fill="none" stroke="#73B222" stroke-width="2.2" marker-end="url(#mk-arw)"/><rect x="640" y="380" width="140" height="40" rx="8" class="chip"/><text x="710" y="405" class="lbl" text-anchor="middle">пожаловать</text><path d="M710 378 Q 600.0 240 500 114" fill="none" stroke="#C30B0A" stroke-width="2" stroke-dasharray="6 5"/><text x="730" y="250" class="lbl-b" style="fill:#C30B0A">× маска</text><rect x="200" y="460" width="580" height="42" rx="8" class="br"/><text x="216" y="486" class="lbl" style="fill:#a30908">без маски позиция прочитала бы «пожаловать» прямо из своего входа</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Маска живёт во всех трёх блоках внимания</h4>
      <p>Подсвечены три блока attention. Маска не меняет токены — она запрещает отдельные пары «запрос → ключ». Padding-маска нужна всем трём, причинная — только masked self-attention декодера.</p>
    </div>
    <div class="step-panel" data-on="sc m" data-focus="m">
      <div class="step-kicker">Шаг 2 · как устроена маска</div>
      <h4>Маска — это слагаемое к оценкам</h4>
      <p>К матрице оценок прибавляют M: 0 для разрешённой пары и −∞ для запрещённой. После экспоненты запрещённый вес становится нулём точно, а не приблизительно.</p>
    </div>
    <div class="step-panel" data-on="wb wa" data-focus="wa">
      <div class="step-kicker">Шаг 3 · padding в энкодере</div>
      <h4>Убрать PAD — значит перераспределить всю строку</h4>
      <p>Без маски пустой токен забирал почти 11% внимания «welcome». Softmax нормирует на сумму, поэтому освободившийся вес расходится по трём настоящим ключам.</p>
    </div>
    <div class="step-panel" data-on="cr" data-focus="cr">
      <div class="step-kicker">Шаг 4 · cross-attention</div>
      <h4>PAD источника закрыт и здесь</h4>
      <p>Строки — запросы перевода, столбцы — ключи оригинала. Закрыт тот же PAD исходной фразы; к будущему перевода cross-attention вообще не обращается.</p>
    </div>
    <div class="step-panel" data-on="cz" data-focus="cz">
      <div class="step-kicker">Шаг 5 · причинная маска</div>
      <h4>Декодер не смотрит вперёд</h4>
      <p>Позиции доступны она сама и все предыдущие. Треугольная маска ставит −∞ справа от диагонали, и эти веса строго равны нулю.</p>
    </div>
    <div class="step-panel" data-on="tf" data-focus="tf">
      <div class="step-kicker">Шаг 6 · teacher forcing</div>
      <h4>Сдвиг и маска работают вместе</h4>
      <p>На обучении весь сдвинутый перевод подают сразу. Чтобы предсказать «пожаловать», позиции доступны &lt;START&gt; и «Добро»; маска закрывает всё, что правее, иначе модель научится копировать ответ.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> запрещённые оценки исключаются до softmax, поэтому их итоговый вес становится нулевым. Причинная маска и сдвинутый вход вместе предотвращают утечку будущего ответа.</div>

<hr>

<h2 id="decoder">Глава 9. Decoder: как формируется перевод</h2>

<p>Декодер начинает со сдвинутой целевой последовательности. В каждом слое сначала работает masked self-attention, затем cross-attention к памяти энкодера, затем Feed Forward; между подслоями стоят residual-связи и нормализация.</p>

<p>Слой декодера отличается от слоя энкодера ровно одним добавленным подслоем. Вместо двух блоков с residual-связями их три, и средний — единственное место во всей архитектуре, где встречаются две последовательности.</p>

<div class="math-display" data-tex="u = \mathrm{LN}\big(x + \mathrm{MaskedSelfAttn}(x)\big), \quad v = \mathrm{LN}\big(u + \mathrm{CrossAttn}(u,\, H^{N})\big), \quad z = \mathrm{LN}\big(v + \mathrm{FFN}(v)\big)"></div>

<p>Разделение обязанностей здесь очень чёткое. Masked self-attention отвечает на вопрос «что я уже сказал» и работает только внутри перевода. Cross-attention отвечает на вопрос «что было в оригинале» и обращается к памяти энкодера <code>H<sup>N</sup></code> — выходу <em>последнего</em> слоя энкодера. Эту память считают один раз и переиспользуют во всех слоях декодера.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · позиция «Добро» в первом слое декодера</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Первый подслой: посмотреть на уже сказанное</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">веса</div>
      <div class="math-display worked-trace-math" data-tex="(0.294,\;\; 0.706,\;\; 0)"></div>
      <div class="worked-trace-note">доступны &lt;START&gt; и сама позиция</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">выход</div>
      <div class="math-display worked-trace-math" data-tex="(1.047,\;0.741,\;0.189,\;1.471)"></div>
      <div class="worked-trace-note">смесь двух разрешённых строк</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">Add &amp; Norm</div>
      <div class="math-display worked-trace-math" data-tex="u = (0.724,\;-0.675,\;-1.253,\;1.204)"></div>
      <div class="worked-trace-note">этот вектор и станет запросом для cross-attention</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> ничто в этих числах не пришло из английской фразы — первый подслой работает исключительно с переводом. Оригинал войдёт в расчёт на следующем шаге, когда <code>u</code> превратится в запрос <code>Q</code>, а ключи и значения построятся из памяти энкодера.</p>
</div>

<div class="callout-blue"><strong>Обучение и генерация идут по-разному:</strong> в интерактиве показан режим обучения — весь сдвинутый перевод подан сразу, все позиции считаются одним проходом. На инференсе будущего нет: декодер запускается заново после каждого токена, добавляя его к своему входу, и так до <code>&lt;END&gt;</code>. Чтобы не пересчитывать одно и то же, реализации кэшируют ключи и значения уже посчитанных позиций — это и есть KV-cache.</div>

<p>Посмотрим пошагово один слой декодера: три подслоя, три residual-связи и переход к стеку.</p>

<div class="stage" id="stageDc" tabindex="0">
  <div class="stage-figure">
<svg id="dc" viewBox="0 0 960 560" role="img" aria-label="Decoder: схема трансформера, затем три подслоя и стек">
  <style>
    #dc { font-family: Helvetica, Arial, sans-serif; }
    #dc text { fill: #111111; }
    #dc .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #dc .offt { fill: #A29C92; font-size: 14px; }
    #dc .offs { fill: #A29C92; font-size: 12px; }
    #dc .is-focus .offt, #dc .is-focus .offs { font-weight: 400; }
    #dc .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #dc .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #dc .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #dc .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #dc .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #dc .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #dc .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #dc .lbl { font-size: 15px; }
    #dc .lbl-b { font-size: 15px; font-weight: 700; }
    #dc .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #dc .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #dc .cap { font-size: 13px; fill: #5E5850; }
    #dc .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #dc .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #dc .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #dc .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #dc .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #dc .band-y { fill: #FFF3C4; }
    #dc .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="dc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="dc-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="dc-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="dc-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#dc-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#dc-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#dc-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="sh" data-only="1"><text x="40" y="115" class="ttl">предсказать</text><text x="40" y="275" class="ttl">вход декодера</text><rect x="240" y="90" width="150" height="40" rx="8" class="chip"/><text x="315" y="115" class="lbl" text-anchor="middle">Добро</text><rect x="240" y="250" width="150" height="40" rx="8" class="chip"/><text x="315" y="275" class="lbl" text-anchor="middle">&lt;START&gt;</text><path d="M315 246 V136" class="edge" marker-end="url(#dc-arw)"/><text x="315" y="310" class="cap" text-anchor="middle">pos 0</text><rect x="440" y="90" width="150" height="40" rx="8" class="bg"/><text x="515" y="115" class="lbl" text-anchor="middle">пожаловать</text><rect x="440" y="250" width="150" height="40" rx="8" class="by"/><text x="515" y="275" class="lbl" text-anchor="middle">Добро</text><path d="M515 246 V136" class="edge" marker-end="url(#dc-arw)"/><text x="515" y="310" class="cap" text-anchor="middle">pos 1</text><rect x="640" y="90" width="150" height="40" rx="8" class="chip"/><text x="715" y="115" class="lbl" text-anchor="middle">&lt;END&gt;</text><rect x="640" y="250" width="150" height="40" rx="8" class="chip"/><text x="715" y="275" class="lbl" text-anchor="middle">пожаловать</text><path d="M715 246 V136" class="edge" marker-end="url(#dc-arw)"/><text x="715" y="310" class="cap" text-anchor="middle">pos 2</text><text x="346" y="382" class="lbl" text-anchor="end">X_dec[1] · Добро</text><rect x="360" y="360" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="382" class="num" text-anchor="middle">1.441</text><rect x="450" y="360" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="382" class="num" text-anchor="middle">0.340</text><rect x="540" y="360" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="382" class="num" text-anchor="middle">0.310</text><rect x="630" y="360" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="382" class="num" text-anchor="middle">1.500</text><text x="360" y="424" class="cap">Output Embedding + PE; дальше следим за позицией 1</text></g>
  <g data-key="ms" data-only="1"><text x="300" y="94" class="ttl">masked self-attention · запрос «Добро»</text><text x="286" y="131" class="lbl" text-anchor="end">&lt;START&gt;</text><rect x="300" y="110" width="440" height="30" rx="4" fill="#F4F2EC"/><rect x="300" y="110" width="129.5" height="30" rx="4" class="br"/><text x="439.5" y="131" class="lbl-b">29.4%</text><text x="286" y="177" class="lbl" text-anchor="end">Добро</text><rect x="300" y="156" width="440" height="30" rx="4" fill="#F4F2EC"/><rect x="300" y="156" width="310.5" height="30" rx="4" class="br"/><text x="620.5" y="177" class="lbl-b">70.6%</text><text x="286" y="223" class="lbl" text-anchor="end">пожаловать</text><rect x="300" y="202" width="440" height="30" rx="4" fill="#F4F2EC"/><text x="310" y="223" class="lbl-b" style="fill:#C30B0A">× закрыто маской · 0%</text><text x="286" y="312" class="lbl" text-anchor="end">выход</text><rect x="300" y="290" width="84" height="34" rx="4" class="br"/><text x="342.0" y="312" class="num" text-anchor="middle">1.047</text><rect x="390" y="290" width="84" height="34" rx="4" class="br"/><text x="432.0" y="312" class="num" text-anchor="middle">0.741</text><rect x="480" y="290" width="84" height="34" rx="4" class="br"/><text x="522.0" y="312" class="num" text-anchor="middle">0.189</text><rect x="570" y="290" width="84" height="34" rx="4" class="br"/><text x="612.0" y="312" class="num" text-anchor="middle">1.471</text><text x="300" y="360" class="cap">смесь двух разрешённых строк; английская фраза пока не участвует</text></g>
  <g data-key="n1" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">X_dec[1]</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">1.441</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">0.340</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">0.310</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.500</text><text x="346" y="202" class="lbl" text-anchor="end">+ masked attn</text><rect x="360" y="180" width="84" height="34" rx="4" class="br"/><text x="402.0" y="202" class="num" text-anchor="middle">1.047</text><rect x="450" y="180" width="84" height="34" rx="4" class="br"/><text x="492.0" y="202" class="num" text-anchor="middle">0.741</text><rect x="540" y="180" width="84" height="34" rx="4" class="br"/><text x="582.0" y="202" class="num" text-anchor="middle">0.189</text><rect x="630" y="180" width="84" height="34" rx="4" class="br"/><text x="672.0" y="202" class="num" text-anchor="middle">1.471</text><text x="346" y="272" class="lbl" text-anchor="end">= сумма</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">2.488</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">1.081</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">0.499</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">2.970</text><path d="M540 290 V330" class="edge" marker-end="url(#dc-arw)"/><text x="552" y="316" class="cap">LayerNorm</text><text x="346" y="362" class="lbl-b" text-anchor="end">U[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">0.724</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">−0.675</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.253</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.204</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#dc-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">короткий путь</text></g>
  <g data-key="cr" data-only="1"><rect x="40" y="90" width="200" height="50" rx="8" class="by"/><text x="140" y="112" class="lbl-b" text-anchor="middle">Q ← U[1]</text><text x="140" y="130" class="cap" text-anchor="middle">состояние декодера</text><rect x="40" y="170" width="200" height="50" rx="8" class="bx"/><text x="140" y="192" class="lbl-b" text-anchor="middle">K, V ← H¹</text><text x="140" y="210" class="cap" text-anchor="middle">память энкодера</text><text x="420" y="94" class="ttl">веса по словам оригинала</text><text x="406" y="131" class="lbl" text-anchor="end">You</text><rect x="420" y="110" width="440" height="30" rx="4" fill="#F4F2EC"/><rect x="420" y="110" width="71.1" height="30" rx="4" class="br"/><text x="501.1" y="131" class="lbl-b">16.2%</text><text x="406" y="177" class="lbl" text-anchor="end">are</text><rect x="420" y="156" width="440" height="30" rx="4" fill="#F4F2EC"/><rect x="420" y="156" width="145.6" height="30" rx="4" class="br"/><text x="575.6" y="177" class="lbl-b">33.1%</text><text x="406" y="223" class="lbl" text-anchor="end">welcome</text><rect x="420" y="202" width="440" height="30" rx="4" fill="#F4F2EC"/><rect x="420" y="202" width="223.3" height="30" rx="4" class="br"/><text x="653.3" y="223" class="lbl-b">50.7%</text><text x="406" y="312" class="lbl" text-anchor="end">выход</text><rect x="420" y="290" width="84" height="34" rx="4" class="br"/><text x="462.0" y="312" class="num" text-anchor="middle">0.223</text><rect x="510" y="290" width="84" height="34" rx="4" class="br"/><text x="552.0" y="312" class="num" text-anchor="middle">−0.533</text><rect x="600" y="290" width="84" height="34" rx="4" class="br"/><text x="642.0" y="312" class="num" text-anchor="middle">−0.903</text><rect x="690" y="290" width="84" height="34" rx="4" class="br"/><text x="732.0" y="312" class="num" text-anchor="middle">1.213</text><text x="420" y="360" class="cap">доступны все позиции источника — маски будущего здесь нет</text></g>
  <g data-key="n2" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">U[1]</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">0.724</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">−0.675</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">−1.253</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.204</text><text x="346" y="202" class="lbl" text-anchor="end">+ cross-attn</text><rect x="360" y="180" width="84" height="34" rx="4" class="br"/><text x="402.0" y="202" class="num" text-anchor="middle">0.223</text><rect x="450" y="180" width="84" height="34" rx="4" class="br"/><text x="492.0" y="202" class="num" text-anchor="middle">−0.533</text><rect x="540" y="180" width="84" height="34" rx="4" class="br"/><text x="582.0" y="202" class="num" text-anchor="middle">−0.903</text><rect x="630" y="180" width="84" height="34" rx="4" class="br"/><text x="672.0" y="202" class="num" text-anchor="middle">1.213</text><text x="346" y="272" class="lbl" text-anchor="end">= сумма</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">0.947</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">−1.208</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">−2.156</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">2.417</text><path d="M540 290 V330" class="edge" marker-end="url(#dc-arw)"/><text x="552" y="316" class="cap">LayerNorm</text><text x="346" y="362" class="lbl-b" text-anchor="end">V[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">0.528</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">−0.674</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.203</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.349</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#dc-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">короткий путь</text></g>
  <g data-key="ff" data-only="1"><text x="289" y="112" class="lbl" text-anchor="end">V[1] · d = 4</text><rect x="303" y="90" width="84" height="34" rx="4" class="bg"/><text x="345.0" y="112" class="num" text-anchor="middle">0.528</text><rect x="393" y="90" width="84" height="34" rx="4" class="bg"/><text x="435.0" y="112" class="num" text-anchor="middle">−0.674</text><rect x="483" y="90" width="84" height="34" rx="4" class="bg"/><text x="525.0" y="112" class="num" text-anchor="middle">−1.203</text><rect x="573" y="90" width="84" height="34" rx="4" class="bg"/><text x="615.0" y="112" class="num" text-anchor="middle">1.349</text><path d="M480 130 V180" class="edge" marker-end="url(#dc-arw)"/><text x="492" y="160" class="cap">W₁, ReLU</text><text x="189" y="212" class="lbl" text-anchor="end">скрыто · 8</text><rect x="203" y="190" width="64" height="34" rx="4" class="by"/><text x="235.0" y="212" class="num" text-anchor="middle">0.684</text><rect x="273" y="190" width="64" height="34" rx="4" class="by"/><text x="305.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="343" y="190" width="64" height="34" rx="4" class="by"/><text x="375.0" y="212" class="num" text-anchor="middle">0.443</text><rect x="413" y="190" width="64" height="34" rx="4" class="by"/><text x="445.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="483" y="190" width="64" height="34" rx="4" class="by"/><text x="515.0" y="212" class="num" text-anchor="middle">0.000</text><rect x="553" y="190" width="64" height="34" rx="4" class="by"/><text x="585.0" y="212" class="num" text-anchor="middle">0.419</text><rect x="623" y="190" width="64" height="34" rx="4" class="by"/><text x="655.0" y="212" class="num" text-anchor="middle">0.534</text><rect x="693" y="190" width="64" height="34" rx="4" class="by"/><text x="725.0" y="212" class="num" text-anchor="middle">0.232</text><path d="M480 230 V280" class="edge" marker-end="url(#dc-arw)"/><text x="492" y="260" class="cap">W₂</text><text x="289" y="312" class="lbl" text-anchor="end">F[1] · d = 4</text><rect x="303" y="290" width="84" height="34" rx="4" class="bg"/><text x="345.0" y="312" class="num" text-anchor="middle">0.161</text><rect x="393" y="290" width="84" height="34" rx="4" class="bg"/><text x="435.0" y="312" class="num" text-anchor="middle">0.092</text><rect x="483" y="290" width="84" height="34" rx="4" class="bg"/><text x="525.0" y="312" class="num" text-anchor="middle">0.054</text><rect x="573" y="290" width="84" height="34" rx="4" class="bg"/><text x="615.0" y="312" class="num" text-anchor="middle">0.149</text><text x="203" y="370" class="cap">те же d → d_ff → d, но собственные веса декодера</text></g>
  <g data-key="n3" data-only="1"><text x="346" y="132" class="lbl" text-anchor="end">V[1]</text><rect x="360" y="110" width="84" height="34" rx="4" class="cell"/><text x="402.0" y="132" class="num" text-anchor="middle">0.528</text><rect x="450" y="110" width="84" height="34" rx="4" class="cell"/><text x="492.0" y="132" class="num" text-anchor="middle">−0.674</text><rect x="540" y="110" width="84" height="34" rx="4" class="cell"/><text x="582.0" y="132" class="num" text-anchor="middle">−1.203</text><rect x="630" y="110" width="84" height="34" rx="4" class="cell"/><text x="672.0" y="132" class="num" text-anchor="middle">1.349</text><text x="346" y="202" class="lbl" text-anchor="end">+ Feed Forward</text><rect x="360" y="180" width="84" height="34" rx="4" class="by"/><text x="402.0" y="202" class="num" text-anchor="middle">0.161</text><rect x="450" y="180" width="84" height="34" rx="4" class="by"/><text x="492.0" y="202" class="num" text-anchor="middle">0.092</text><rect x="540" y="180" width="84" height="34" rx="4" class="by"/><text x="582.0" y="202" class="num" text-anchor="middle">0.054</text><rect x="630" y="180" width="84" height="34" rx="4" class="by"/><text x="672.0" y="202" class="num" text-anchor="middle">0.149</text><text x="346" y="272" class="lbl" text-anchor="end">= сумма</text><rect x="360" y="250" width="84" height="34" rx="4" class="by"/><text x="402.0" y="272" class="num" text-anchor="middle">0.690</text><rect x="450" y="250" width="84" height="34" rx="4" class="by"/><text x="492.0" y="272" class="num" text-anchor="middle">−0.582</text><rect x="540" y="250" width="84" height="34" rx="4" class="by"/><text x="582.0" y="272" class="num" text-anchor="middle">−1.149</text><rect x="630" y="250" width="84" height="34" rx="4" class="by"/><text x="672.0" y="272" class="num" text-anchor="middle">1.498</text><path d="M540 290 V330" class="edge" marker-end="url(#dc-arw)"/><text x="552" y="316" class="cap">LayerNorm</text><text x="346" y="362" class="lbl-b" text-anchor="end">D¹[1]</text><rect x="360" y="340" width="84" height="34" rx="4" class="bg"/><text x="402.0" y="362" class="num" text-anchor="middle">0.553</text><rect x="450" y="340" width="84" height="34" rx="4" class="bg"/><text x="492.0" y="362" class="num" text-anchor="middle">−0.669</text><rect x="540" y="340" width="84" height="34" rx="4" class="bg"/><text x="582.0" y="362" class="num" text-anchor="middle">−1.215</text><rect x="630" y="340" width="84" height="34" rx="4" class="bg"/><text x="672.0" y="362" class="num" text-anchor="middle">1.331</text><path d="M718 127 C 790 127, 790 267, 728 267" class="edge-y" marker-end="url(#dc-arwy)"/><text x="796" y="202" class="cap" style="fill:#8C7106">короткий путь</text></g>
  <g data-key="st" data-only="1"><text x="330" y="540" class="lbl" text-anchor="middle">сдвинутый перевод · [3, 4]</text><path d="M330 522 V494" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="450" width="240" height="40" rx="8" class="bx"/><text x="330" y="476" class="lbl" text-anchor="middle">Decoder 1</text><path d="M620 470 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M330 450 V432" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="390" width="240" height="40" rx="8" class="bx"/><text x="330" y="416" class="lbl" text-anchor="middle">Decoder 2</text><path d="M620 410 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M330 390 V372" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="330" width="240" height="40" rx="8" class="bx"/><text x="330" y="356" class="lbl" text-anchor="middle">Decoder 3</text><path d="M620 350 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M330 330 V312" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="270" width="240" height="40" rx="8" class="bx"/><text x="330" y="296" class="lbl" text-anchor="middle">Decoder 4</text><path d="M620 290 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M330 270 V252" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="210" width="240" height="40" rx="8" class="bx"/><text x="330" y="236" class="lbl" text-anchor="middle">Decoder 5</text><path d="M620 230 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M330 210 V192" class="edge" marker-end="url(#dc-arw)"/><rect x="210" y="150" width="240" height="40" rx="8" class="bx"/><text x="330" y="176" class="lbl" text-anchor="middle">Decoder 6</text><path d="M620 170 H458" fill="none" stroke="#C30B0A" stroke-width="1.6" marker-end="url(#dc-arwr)"/><path d="M620 470 V170" stroke="#C30B0A" stroke-width="2" fill="none"/><text x="632" y="330" class="lbl-b" style="fill:#a30908">Hᴺ энкодера</text><text x="632" y="350" class="cap">одна и та же память</text><text x="632" y="368" class="cap">для каждого слоя</text><path d="M330 150 V124" class="edge" marker-end="url(#dc-arw)"/><rect x="250" y="80" width="160" height="40" rx="8" class="bg"/><text x="330" y="106" class="lbl-b" text-anchor="middle">Linear + Softmax</text><text x="430" y="106" class="cap">→ следующий токен</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Слой декодера: три подслоя</h4>
      <p>Подсвечены masked self-attention, cross-attention и Feed Forward, каждый со своим Add &amp; Norm. Красная линия — память энкодера, которая входит в cross-attention.</p>
    </div>
    <div class="step-panel" data-on="sh" data-focus="sh">
      <div class="step-kicker">Шаг 2 · вход</div>
      <h4>Декодер получает сдвинутый перевод</h4>
      <p>Чтобы на позиции j предсказать j-е слово цели, на вход подаётся то, что стоит на одну позицию левее. Первый слой получает Output Embedding + PE.</p>
    </div>
    <div class="step-panel" data-on="ms" data-focus="ms">
      <div class="step-kicker">Шаг 3 · masked self-attention</div>
      <h4>«Что я уже сказал»</h4>
      <p>Позиция «Добро» смотрит на &lt;START&gt; и на себя, будущее закрыто маской. Первый подслой работает исключительно с переводом.</p>
    </div>
    <div class="step-panel" data-on="n1" data-focus="n1">
      <div class="step-kicker">Шаг 4 · Add &amp; Norm</div>
      <h4>Первый короткий путь</h4>
      <p>Вход обходит внимание, складывается с его выходом и нормализуется. Получаем <code>U[1]</code> — он и станет запросом для cross-attention.</p>
    </div>
    <div class="step-panel" data-on="cr" data-focus="cr">
      <div class="step-kicker">Шаг 5 · cross-attention</div>
      <h4>«Что было в оригинале»</h4>
      <p>Запрос строится из <code>U[1]</code>, ключи и значения — из памяти энкодера. Единственное место в модели, где встречаются две последовательности.</p>
    </div>
    <div class="step-panel" data-on="n2" data-focus="n2">
      <div class="step-kicker">Шаг 6 · Add &amp; Norm</div>
      <h4>Второй короткий путь</h4>
      <p>Выход cross-attention складывается со своим входом. Residual сохраняет то, что декодер знал о собственном переводе, а оригинал добавляется поверх.</p>
    </div>
    <div class="step-panel" data-on="ff" data-focus="ff">
      <div class="step-kicker">Шаг 7 · Feed Forward</div>
      <h4>Позиционная сеть декодера</h4>
      <p>Каждая позиция независимо проходит d = 4 → 8 → 4. Соседи уже учтены двумя блоками внимания.</p>
    </div>
    <div class="step-panel" data-on="n3" data-focus="n3">
      <div class="step-kicker">Шаг 8 · Add &amp; Norm</div>
      <h4>Третий короткий путь и выход слоя</h4>
      <p>После третьего сложения и LayerNorm получаем <code>D¹[1]</code>. Для трёх позиций выход слоя снова <code>[3, 4]</code> — его получит следующий декодер.</p>
    </div>
    <div class="step-panel" data-on="st" data-focus="st">
      <div class="step-kicker">Шаг 9 · стек</div>
      <h4>N слоёв, одна память</h4>
      <p>Каждый следующий декодер берёт выход предыдущего и ту же память <code>Hᴺ</code>. Выход последнего проецируется на словарь — это глава 10.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> masked self-attention отвечает за уже известную часть выхода, а cross-attention связывает текущую генерацию с исходной последовательностью энкодера.</div>

<hr>

<h2 id="output">Глава 10. Generate Output: Linear, Softmax и Cross-Entropy</h2>

<p>Последний декодер выдаёт по одному вектору на позицию. Linear превращает каждый такой вектор в оценки словаря, softmax — в распределение вероятностей, а при обучении cross-entropy сравнивает его с целевым токеном.</p>

<p>До этого момента весь путь шёл в пространстве размерности <code>d_model</code>. Последний шаг переводит его обратно в пространство слов: матрица <code>W_out</code> формы <code>[d_model, |V|]</code> даёт по одному числу на каждое слово словаря. Эти числа называют <strong>логитами</strong> — они вещественные, могут быть отрицательными и вероятностями ещё не являются.</p>

<div class="math-display" data-tex="\ell_j = z_j W_{out} + b, \qquad p_j = \mathrm{softmax}(\ell_j), \qquad \mathcal{L} = -\frac{1}{T}\sum_{j=1}^{T} \ln p_j[y_j]"></div>

<p>Softmax делает из логитов распределение: все значения неотрицательны и в сумме дают единицу. Дальше пути обучения и генерации расходятся. На инференсе из распределения выбирают токен — argmax, сэмплирование или beam search. На обучении распределение сравнивают с известным правильным ответом, и мерой расхождения служит <strong>cross-entropy</strong>: для one-hot цели она сводится к минус логарифму вероятности, назначенной правильному слову.</p>

<div class="worked-example">
  <div class="worked-label">Числовой пример · словарь из 4 слов, цель «Добро пожаловать END»</div>
  <div class="worked-trace">
    <div class="worked-trace-title">Три позиции: вероятность правильного токена и её вклад в loss</div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">поз. 0</div>
      <div class="math-display worked-trace-math" data-tex="p(\text{Добро}) = 0.579 \;\Rightarrow\; -\ln p = 0.546"></div>
      <div class="worked-trace-note">argmax уже верный, но уверенность около 58%</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">поз. 1</div>
      <div class="math-display worked-trace-math" data-tex="p(\text{пожаловать}) = 0.470 \;\Rightarrow\; -\ln p = 0.755"></div>
      <div class="worked-trace-note">верному токену назначена наибольшая вероятность</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">поз. 2</div>
      <div class="math-display worked-trace-math" data-tex="p(\text{END}) = 0.377 \;\Rightarrow\; -\ln p = 0.976"></div>
      <div class="worked-trace-note">самая слабая из трёх позиций</div>
    </div>
    <div class="worked-trace-row">
      <div class="worked-trace-name">итог</div>
      <div class="math-display worked-trace-math" data-tex="\mathcal{L} = \tfrac{1}{3}(0.546 + 0.755 + 0.976) \approx 0.759"></div>
      <div class="worked-trace-note">средняя по трём позициям</div>
    </div>
  </div>
  <p class="worked-reading"><strong>Как это прочитать:</strong> модель уже угадывает все три слова — argmax совпадает с целью везде. Но loss далёк от нуля, потому что cross-entropy оценивает не правильность выбора, а <em>уверенность</em>: вероятность 0.579 для верного токена по-прежнему даёт заметный штраф и заметный градиент. Метрика «угадал/не угадал» здесь остановилась бы, а обучение — нет.</p>
</div>

<div class="callout-blue"><strong>Почему нельзя обойтись argmax при обучении:</strong> выбор максимума — ступенчатая функция, её производная равна нулю почти всюду, и градиенту неоткуда взяться. Softmax с cross-entropy даёт гладкую замену: градиент по логитам равен <code>p − y</code>, то есть просто «предсказанное распределение минус правильное». Эта разность и разъезжается обратно через декодер, cross-attention и энкодер до самых таблиц эмбеддингов.</div>

<div class="callout-yellow"><strong>Деталь реализации:</strong> матрицу <code>W_out</code> часто связывают с таблицей выходных эмбеддингов — это одни и те же веса, только транспонированные (weight tying). Логика прямая: и там и там речь о соответствии между словами словаря и векторами. Приём экономит заметную долю параметров модели и обычно слегка улучшает качество.</div>

<p>Посмотрим пошагово последний участок: логиты, softmax, выбор токена, loss и шаги градиента.</p>

<div class="stage" id="stageOu" tabindex="0">
  <div class="stage-figure">
<svg id="ou" viewBox="0 0 960 560" role="img" aria-label="Выход: схема трансформера, затем логиты, softmax, выбор токена и loss">
  <style>
    #ou { font-family: Helvetica, Arial, sans-serif; }
    #ou text { fill: #111111; }
    #ou .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #ou .offt { fill: #A29C92; font-size: 14px; }
    #ou .offs { fill: #A29C92; font-size: 12px; }
    #ou .is-focus .offt, #ou .is-focus .offs { font-weight: 400; }
    #ou .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #ou .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #ou .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #ou .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #ou .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #ou .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #ou .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #ou .lbl { font-size: 15px; }
    #ou .lbl-b { font-size: 15px; font-weight: 700; }
    #ou .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #ou .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #ou .cap { font-size: 13px; fill: #5E5850; }
    #ou .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ou .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #ou .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #ou .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ou .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #ou .band-y { fill: #FFF3C4; }
    #ou .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="ou-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="ou-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="ou-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="ou-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#ou-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#ou-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="here" data-only="1">
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="540" y="40" width="180" height="36" rx="6" class="bg"/><text x="630.0" y="63.0" class="lbl-b" text-anchor="middle">Linear + Softmax</text>

  </g>
  <g data-key="dz" data-only="1"><text x="260" y="120" class="ttl">выход последнего декодера · [3, 4]</text><text x="302.0" y="142" class="cap" text-anchor="middle">x1</text><text x="392.0" y="142" class="cap" text-anchor="middle">x2</text><text x="482.0" y="142" class="cap" text-anchor="middle">x3</text><text x="572.0" y="142" class="cap" text-anchor="middle">x4</text><text x="248" y="172.0" class="lbl" text-anchor="end">pos 0</text><rect x="260" y="150" width="84" height="34" rx="4" class="cell" /><text x="302.0" y="172.0" class="num" text-anchor="middle">−0.760</text><rect x="350" y="150" width="84" height="34" rx="4" class="cell" /><text x="392.0" y="172.0" class="num" text-anchor="middle">0.587</text><rect x="440" y="150" width="84" height="34" rx="4" class="cell" /><text x="482.0" y="172.0" class="num" text-anchor="middle">−1.151</text><rect x="530" y="150" width="84" height="34" rx="4" class="cell" /><text x="572.0" y="172.0" class="num" text-anchor="middle">1.324</text><text x="248" y="212.0" class="lbl" text-anchor="end">pos 1</text><rect x="260" y="190" width="84" height="34" rx="4" class="cell" /><text x="302.0" y="212.0" class="num" text-anchor="middle">0.553</text><rect x="350" y="190" width="84" height="34" rx="4" class="cell" /><text x="392.0" y="212.0" class="num" text-anchor="middle">−0.669</text><rect x="440" y="190" width="84" height="34" rx="4" class="cell" /><text x="482.0" y="212.0" class="num" text-anchor="middle">−1.215</text><rect x="530" y="190" width="84" height="34" rx="4" class="cell" /><text x="572.0" y="212.0" class="num" text-anchor="middle">1.331</text><text x="248" y="252.0" class="lbl" text-anchor="end">pos 2</text><rect x="260" y="230" width="84" height="34" rx="4" class="cell" /><text x="302.0" y="252.0" class="num" text-anchor="middle">−0.129</text><rect x="350" y="230" width="84" height="34" rx="4" class="cell" /><text x="392.0" y="252.0" class="num" text-anchor="middle">−0.253</text><rect x="440" y="230" width="84" height="34" rx="4" class="cell" /><text x="482.0" y="252.0" class="num" text-anchor="middle">−1.196</text><rect x="530" y="230" width="84" height="34" rx="4" class="cell" /><text x="572.0" y="252.0" class="num" text-anchor="middle">1.578</text><text x="260" y="320" class="shape">[T, d] = [3, 4]  →  Linear  →  [T, |V|] = [3, 4]</text><text x="260" y="346" class="cap">словарь учебный: Привет, пожаловать, Добро, END</text></g>
  <g data-key="lg" data-only="1"><text x="260" y="116" class="ttl">logits = z · W_out + b</text><text x="315.0" y="140" class="cap" text-anchor="middle">Привет</text><text x="431.0" y="140" class="cap" text-anchor="middle">пожаловать</text><text x="547.0" y="140" class="cap" text-anchor="middle">Добро</text><text x="663.0" y="140" class="cap" text-anchor="middle">END</text><text x="248" y="178.0" class="lbl" text-anchor="end">pos 0</text><rect x="260" y="150" width="110" height="46" rx="4" class="cell"/><text x="315.0" y="178.0" class="num" text-anchor="middle">0.000</text><rect x="376" y="150" width="110" height="46" rx="4" class="cell"/><text x="431.0" y="178.0" class="num" text-anchor="middle">−0.743</text><rect x="492" y="150" width="110" height="46" rx="4" class="cell"/><text x="547.0" y="178.0" class="num" text-anchor="middle">1.271</text><rect x="608" y="150" width="110" height="46" rx="4" class="cell"/><text x="663.0" y="178.0" class="num" text-anchor="middle">0.107</text><text x="248" y="230.0" class="lbl" text-anchor="end">pos 1</text><rect x="260" y="202" width="110" height="46" rx="4" class="cell"/><text x="315.0" y="230.0" class="num" text-anchor="middle">0.000</text><rect x="376" y="202" width="110" height="46" rx="4" class="cell"/><text x="431.0" y="230.0" class="num" text-anchor="middle">1.056</text><rect x="492" y="202" width="110" height="46" rx="4" class="cell"/><text x="547.0" y="230.0" class="num" text-anchor="middle">−0.922</text><rect x="608" y="202" width="110" height="46" rx="4" class="cell"/><text x="663.0" y="230.0" class="num" text-anchor="middle">0.610</text><text x="248" y="282.0" class="lbl" text-anchor="end">pos 2</text><rect x="260" y="254" width="110" height="46" rx="4" class="cell"/><text x="315.0" y="282.0" class="num" text-anchor="middle">0.000</text><rect x="376" y="254" width="110" height="46" rx="4" class="cell"/><text x="431.0" y="282.0" class="num" text-anchor="middle">0.287</text><rect x="492" y="254" width="110" height="46" rx="4" class="cell"/><text x="547.0" y="282.0" class="num" text-anchor="middle">0.052</text><rect x="608" y="254" width="110" height="46" rx="4" class="cell"/><text x="663.0" y="282.0" class="num" text-anchor="middle">0.717</text><rect x="489" y="147" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><rect x="373" y="199" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><rect x="605" y="251" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><text x="260" y="330" class="cap">вещественные оценки: бывают отрицательными, это ещё не вероятности · жёлтая рамка — цель</text></g>
  <g data-key="pr" data-only="1"><text x="260" y="116" class="ttl">softmax по каждой строке · сумма = 1</text><text x="315.0" y="140" class="cap" text-anchor="middle">Привет</text><text x="431.0" y="140" class="cap" text-anchor="middle">пожаловать</text><text x="547.0" y="140" class="cap" text-anchor="middle">Добро</text><text x="663.0" y="140" class="cap" text-anchor="middle">END</text><text x="248" y="178.0" class="lbl" text-anchor="end">pos 0</text><rect x="260" y="150" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.19" stroke="#E4E1D7"/><text x="315.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">16.3%</text><rect x="376" y="150" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.12" stroke="#E4E1D7"/><text x="431.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">7.7%</text><rect x="492" y="150" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.52" stroke="#E4E1D7"/><text x="547.0" y="178.0" class="num" text-anchor="middle" style="fill:#fff">57.9%</text><rect x="608" y="150" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.20" stroke="#E4E1D7"/><text x="663.0" y="178.0" class="num" text-anchor="middle" style="fill:#111">18.1%</text><text x="248" y="230.0" class="lbl" text-anchor="end">pos 1</text><rect x="260" y="202" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.19" stroke="#E4E1D7"/><text x="315.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">16.4%</text><rect x="376" y="202" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.44" stroke="#E4E1D7"/><text x="431.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">47.0%</text><rect x="492" y="202" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.11" stroke="#E4E1D7"/><text x="547.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">6.5%</text><rect x="608" y="202" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.30" stroke="#E4E1D7"/><text x="663.0" y="230.0" class="num" text-anchor="middle" style="fill:#111">30.1%</text><text x="248" y="282.0" class="lbl" text-anchor="end">pos 2</text><rect x="260" y="254" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.21" stroke="#E4E1D7"/><text x="315.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">18.4%</text><rect x="376" y="254" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.26" stroke="#E4E1D7"/><text x="431.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">24.5%</text><rect x="492" y="254" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.22" stroke="#E4E1D7"/><text x="547.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">19.4%</text><rect x="608" y="254" width="110" height="46" rx="4" fill="#73B222" fill-opacity="0.36" stroke="#E4E1D7"/><text x="663.0" y="282.0" class="num" text-anchor="middle" style="fill:#111">37.7%</text><rect x="489" y="147" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><rect x="373" y="199" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/><rect x="605" y="251" width="116" height="52" rx="6" fill="none" stroke="#C29E08" stroke-width="2.2"/></g>
  <g data-key="pk" data-only="1"><text x="200" y="360" class="ttl">argmax каждой строки → слово</text><rect x="200" y="376" width="190" height="54" rx="8" class="bg"/><text x="295" y="400" class="lbl-b" text-anchor="middle">pos 0: Добро</text><text x="295" y="420" class="cap" text-anchor="middle">57.9% · совпало с целью</text><rect x="410" y="376" width="190" height="54" rx="8" class="bg"/><text x="505" y="400" class="lbl-b" text-anchor="middle">pos 1: пожаловать</text><text x="505" y="420" class="cap" text-anchor="middle">47.0% · совпало с целью</text><rect x="620" y="376" width="190" height="54" rx="8" class="bg"/><text x="715" y="400" class="lbl-b" text-anchor="middle">pos 2: END</text><text x="715" y="420" class="cap" text-anchor="middle">37.7% · совпало с целью</text><text x="200" y="466" class="cap">на инференсе выбранный токен добавляется к входу декодера, и шаг повторяется до END</text></g>
  <g data-key="ce" data-only="1"><text x="170" y="100" class="ttl">вероятность правильного слова и её штраф −ln p</text><text x="156" y="145" class="lbl" text-anchor="end">Добро</text><rect x="170" y="120" width="400" height="36" rx="4" fill="#F4F2EC"/><rect x="170" y="120" width="231.7" height="36" rx="4" class="bg"/><text x="411.7" y="144" class="lbl-b">57.9%</text><text x="600" y="144" class="num">−ln p = 0.546</text><text x="156" y="205" class="lbl" text-anchor="end">пожаловать</text><rect x="170" y="180" width="400" height="36" rx="4" fill="#F4F2EC"/><rect x="170" y="180" width="188.1" height="36" rx="4" class="bg"/><text x="368.1" y="204" class="lbl-b">47.0%</text><text x="600" y="204" class="num">−ln p = 0.755</text><text x="156" y="265" class="lbl" text-anchor="end">END</text><rect x="170" y="240" width="400" height="36" rx="4" fill="#F4F2EC"/><rect x="170" y="240" width="150.8" height="36" rx="4" class="bg"/><text x="330.8" y="264" class="lbl-b">37.7%</text><text x="600" y="264" class="num">−ln p = 0.976</text><text x="170" y="340" class="shape">L = (0.546 + 0.755 + 0.976) / 3 = 0.759</text><text x="170" y="370" class="cap">все три argmax верны, но loss далёк от нуля: cross-entropy штрафует неуверенность</text></g>
  <g data-key="tr" data-only="1"><text x="120" y="100" class="ttl">градиент по логитам: p − y · шаг 0.25 обновляет только W_out и b</text><text x="120" y="140" class="cap">шагов</text><text x="250" y="140" class="cap">loss</text><text x="400" y="140" class="cap">p(Добро)</text><text x="560" y="140" class="cap">p(пожаловать)</text><text x="740" y="140" class="cap">p(END)</text><line x1="120" x2="880" y1="150" y2="150" stroke="#E4E1D7"/><text x="120" y="176" class="num">0</text><text x="250" y="176" class="num" style="font-weight:700">0.759</text><text x="400" y="176" class="num">57.9%</text><text x="560" y="176" class="num">47.0%</text><text x="740" y="176" class="num">37.7%</text><line x1="120" x2="880" y1="194" y2="194" stroke="#E4E1D7"/><text x="120" y="220" class="num">1</text><text x="250" y="220" class="num" style="font-weight:700">0.706</text><text x="400" y="220" class="num">60.7%</text><text x="560" y="220" class="num">49.9%</text><text x="740" y="220" class="num">39.7%</text><line x1="120" x2="880" y1="238" y2="238" stroke="#E4E1D7"/><text x="120" y="264" class="num">10</text><text x="250" y="264" class="num" style="font-weight:700">0.527</text><text x="400" y="264" class="num">70.9%</text><text x="560" y="264" class="num">61.1%</text><text x="740" y="264" class="num">47.6%</text><line x1="120" x2="880" y1="282" y2="282" stroke="#E4E1D7"/><text x="120" y="308" class="num">50</text><text x="250" y="308" class="num" style="font-weight:700">0.323</text><text x="400" y="308" class="num">82.3%</text><text x="560" y="308" class="num">74.6%</text><text x="740" y="308" class="num">61.9%</text><text x="120" y="380" class="cap">в полной модели тот же сигнал p − y уходит назад через декодер, cross-attention и энкодер до таблиц эмбеддингов</text></g>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Назад</button>
    <button type="button" data-nav="next">Далее →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="arch here" data-focus="here">
      <div class="step-kicker">Шаг 1 · где мы в трансформере</div>
      <h4>Последний шаг — проекция на словарь</h4>
      <p>Подсвечен Linear + Softmax над стеком декодеров. Здесь поток ширины <code>d_model</code> впервые снова превращается в слова.</p>
    </div>
    <div class="step-panel" data-on="dz" data-focus="dz">
      <div class="step-kicker">Шаг 2 · вход</div>
      <h4>По вектору на каждую позицию перевода</h4>
      <p>Последний декодер выдал матрицу <code>[3, 4]</code>. Одна и та же матрица W_out превратит каждую строку в |V| оценок.</p>
    </div>
    <div class="step-panel" data-on="lg" data-focus="lg">
      <div class="step-kicker">Шаг 3 · Linear</div>
      <h4>Логиты: по числу на каждое слово</h4>
      <p>Для каждой позиции получаем четыре оценки. Они могут быть отрицательными и не складываются в 1 — вероятностями их делает только softmax.</p>
    </div>
    <div class="step-panel" data-on="pr" data-focus="pr">
      <div class="step-kicker">Шаг 4 · Softmax</div>
      <h4>Три независимых распределения</h4>
      <p>Softmax применяется к каждой строке отдельно: значения неотрицательны и в сумме дают 1.</p>
    </div>
    <div class="step-panel" data-on="pr pk" data-focus="pk">
      <div class="step-kicker">Шаг 5 · выбор токена</div>
      <h4>argmax превращает распределение в слово</h4>
      <p>Во всех трёх позициях максимум приходится на правильное слово. На инференсе выбор делают по одному токену за шаг: argmax, сэмплирование или beam search.</p>
    </div>
    <div class="step-panel" data-on="ce" data-focus="ce">
      <div class="step-kicker">Шаг 6 · cross-entropy</div>
      <h4>Штраф за неуверенность</h4>
      <p>Для one-hot цели loss позиции — <code>−ln p</code> правильного слова. Средний loss 0.759: выбор уже верный, но вероятности 58%, 47% и 38% ещё далеки от единицы.</p>
    </div>
    <div class="step-panel" data-on="tr" data-focus="tr">
      <div class="step-kicker">Шаг 7 · шаг обучения</div>
      <h4>Градиент p − y двигает веса</h4>
      <p>Градиент по логитам равен «предсказанное минус правильное». Уже один шаг снижает loss до 0.706, а 50 шагов — до 0.323: вероятности правильных слов растут.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Главная мысль:</strong> на инференсе распределение используется для выбора следующего токена. На обучении loss даёт градиент выходному слою и, в полной модели, всем предшествующим блокам.</div>

<hr>

<h2 id="summary">Глава 11. Вся архитектура в одной цепочке</h2>

<p>После десяти глав весь маршрут можно свернуть в пять крупных этапов: Token IDs → Embedding, + Position Encoding, Encoder + Attention, Decoder + Cross-Attention и Linear → Softmax → Token. В интерактиве ниже схема не исчезает — она загорается по этим этапам.</p>

<p>Форма данных на этом пути меняется всего дважды: на входе, когда целые ID превращаются в векторы ширины <code>d_model</code>, и на самом выходе, когда вектор проецируется на словарь. Между этими двумя точками поток держит одну и ту же форму <code>[B, L, d]</code> — и именно поэтому блоки можно складывать в стек любой глубины.</p>

<div class="stage" id="stageSm" tabindex="0">
  <div class="stage-figure">
<svg id="sm" viewBox="0 0 960 560" role="img" aria-label="Вся архитектура: блоки трансформера подсвечиваются по этапам">
  <style>
    #sm { font-family: Helvetica, Arial, sans-serif; }
    #sm text { fill: #111111; }
    #sm .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #sm .offt { fill: #A29C92; font-size: 14px; }
    #sm .offs { fill: #A29C92; font-size: 12px; }
    #sm .is-focus .offt, #sm .is-focus .offs { font-weight: 400; }
    #sm .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #sm .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #sm .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #sm .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #sm .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #sm .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #sm .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #sm .lbl { font-size: 15px; }
    #sm .lbl-b { font-size: 15px; font-weight: 700; }
    #sm .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #sm .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #sm .cap { font-size: 13px; fill: #5E5850; }
    #sm .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #sm .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #sm .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #sm .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #sm .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #sm .band-y { fill: #FFF3C4; }
    #sm .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="sm-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="sm-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="sm-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="sm-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#sm-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#sm-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="h1" data-only="1">
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>

  </g>
  <g data-key="h2" data-only="1">
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>

  </g>
  <g data-key="h3" data-only="1">
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="h4" data-only="1">
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#sm-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>

  </g>
  <g data-key="h5" data-only="1">
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#sm-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="bg"/><text x="630.0" y="63.0" class="lbl-b" text-anchor="middle">Linear + Softmax</text>

  </g>
  <g data-key="h6" data-only="1">
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#sm-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="bg"/><text x="630.0" y="63.0" class="lbl-b" text-anchor="middle">Linear + Softmax</text>
<text x="228" y="482" class="cap" style="fill:#245A98;font-weight:700" text-anchor="end">[B, L]</text><text x="228" y="416" class="cap" style="fill:#245A98;font-weight:700" text-anchor="end">[B, L, d]</text><text x="228" y="170" class="cap" style="fill:#245A98;font-weight:700" text-anchor="end">[B, L, d]</text><text x="760" y="482" class="cap" style="fill:#245A98;font-weight:700">[B, T]</text><text x="760" y="92" class="cap" style="fill:#245A98;font-weight:700">[B, T, d]</text><text x="742" y="30" class="cap" style="fill:#4d7a14;font-weight:700">[B, T, |V|]</text>
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
    <div class="step-panel" data-on="arch h1" data-focus="h1">
      <div class="step-kicker">Этап 1 · главы 1, 3</div>
      <h4>Token IDs → Embedding</h4>
      <p>Целые ID выбирают строки двух таблиц: исходного языка для энкодера и целевого — для сдвинутого перевода. Форма меняется впервые: <code>[B, L]</code> → <code>[B, L, d]</code>.</p>
    </div>
    <div class="step-panel" data-on="arch h2" data-focus="h2">
      <div class="step-kicker">Этап 2 · главы 2, 4</div>
      <h4>+ Position Encoding</h4>
      <p>К каждому вектору прибавляется код его позиции. Ширина не меняется, в числах появился порядок.</p>
    </div>
    <div class="step-panel" data-on="arch h3" data-focus="h3">
      <div class="step-kicker">Этап 3 · главы 5–7</div>
      <h4>Encoder + Attention</h4>
      <p>Self-attention смешивает позиции оригинала, Feed Forward пересчитывает каждую отдельно; N слоёв дают память <code>Hᴺ</code>.</p>
    </div>
    <div class="step-panel" data-on="arch h4" data-focus="h4">
      <div class="step-kicker">Этап 4 · главы 8, 9</div>
      <h4>Decoder + Cross-Attention</h4>
      <p>Masked self-attention смотрит на уже сказанное, cross-attention — на память энкодера. Маски решают, кому с кем разрешено смешиваться.</p>
    </div>
    <div class="step-panel" data-on="arch h5" data-focus="h5">
      <div class="step-kicker">Этап 5 · глава 10</div>
      <h4>Linear → Softmax → Token</h4>
      <p>Вектор декодера проецируется на словарь, softmax даёт распределение, на обучении cross-entropy даёт градиент <code>p − y</code>.</p>
    </div>
    <div class="step-panel" data-on="arch h6" data-focus="h6">
      <div class="step-kicker">Итог · формы</div>
      <h4>Форма меняется только дважды</h4>
      <p>На входе ID становятся векторами, на выходе векторы — оценками словаря. Между этими точками поток держит одну форму <code>[B, L, d]</code>, поэтому блоки складываются в стек любой глубины.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout"><strong>Итог:</strong> Transformer сохраняет последовательность векторов на всём основном пути. Attention смешивает информацию между позициями, маски ограничивают допустимые связи, а финальный Linear + Softmax переводит внутреннее представление обратно в пространство словаря.</div>

<hr>

<h2 id="pytorch">Глава 12. Реализация на PyTorch</h2>

<p>Теперь соберём ту же архитектуру в код. Без <code>nn.Transformer</code> и без готового <code>F.scaled_dot_product_attention</code>: каждый блок схемы — отдельный класс в несколько строк, и каждую строку можно сопоставить с главой статьи. Весь код — один файл <code>transformer.py</code> примерно на 250 строк. Рядом лежат три скрипта: учебное обучение, сверка чисел со статьёй и проверки свойств архитектуры.</p>

<p>Главное правило чтения — то же, что и в прошлых главах: следить за формой тензора. В комментариях к коду она подписана везде: <code>B</code> — батч, <code>L</code> и <code>T</code> — длины источника и перевода, <code>d</code> — <code>d_model</code>, <code>h</code> — число голов, <code>V</code> — словарь. Сначала — какой класс за какой блок схемы отвечает.</p>

<div class="stage" id="stagePt" tabindex="0">
  <div class="stage-figure">
<svg id="pt" viewBox="0 0 960 560" role="img" aria-label="Реализация: какие классы PyTorch соответствуют блокам трансформера">
  <style>
    #pt { font-family: Helvetica, Arial, sans-serif; }
    #pt text { fill: #111111; }
    #pt .off { fill: #FFFFFF; stroke: #D9D5CC; stroke-width: 1.2; }
    #pt .offt { fill: #A29C92; font-size: 14px; }
    #pt .offs { fill: #A29C92; font-size: 12px; }
    #pt .is-focus .offt, #pt .is-focus .offs { font-weight: 400; }
    #pt .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #pt .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #pt .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #pt .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #pt .chip { fill: #FFFFFF; stroke: #CAD7E5; stroke-width: 1.3; }
    #pt .chip-sp { fill: #F4F2EC; stroke: #BDB7AC; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #pt .cell { fill: #FFFFFF; stroke: #E4E1D7; stroke-width: 1; }
    #pt .lbl { font-size: 15px; }
    #pt .lbl-b { font-size: 15px; font-weight: 700; }
    #pt .num { font-size: 14px; font-family: "Courier New", Courier, monospace; }
    #pt .id { font-size: 15px; font-family: "Courier New", Courier, monospace; fill: #245A98; }
    #pt .cap { font-size: 13px; fill: #5E5850; }
    #pt .ttl { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #pt .shape { font-size: 17px; font-weight: 700; font-family: "Courier New", Courier, monospace; }
    #pt .edge { stroke: #9A948A; stroke-width: 1.4; fill: none; }
    #pt .edge-y { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #pt .line { stroke: #D9D5CC; stroke-width: 1.4; fill: none; }
    #pt .band-y { fill: #FFF3C4; }
    #pt .band-g { fill: #E5F4D6; }
  </style>
  <defs>
    <marker id="pt-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9A948A"/>
    </marker>
    <marker id="pt-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
    <marker id="pt-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9C4BA"/>
    </marker>
    <marker id="pt-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
    </marker>
  </defs>
  <g data-key="arch" data-only="1">
<path d="M330 496 V180" class="line"/><path d="M330 180 V160 H480 V240 H533" class="line" marker-end="url(#pt-arwo)"/>
<path d="M630 496 V78" class="line" marker-end="url(#pt-arwo)"/><path d="M630 40 V22" class="line"/>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#E4E1D7"/>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#E4E1D7"/>
<text x="206" y="258" class="offt" text-anchor="end">Энкодер</text>
<text x="206" y="276" class="offs" text-anchor="end">× N</text>
<text x="754" y="218" class="offt">Декодер</text><text x="754" y="236" class="offs">× N</text>
<text x="630" y="16" class="offs" text-anchor="middle">вероятности следующего токена</text>
<rect x="250" y="490" width="160" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="330" y="510" class="lbl" text-anchor="middle">You are welcome</text><rect x="520" y="490" width="220" height="30" rx="7" fill="#FAFAF7" stroke="#E4E1D7"/><text x="630" y="510" class="lbl" text-anchor="middle">&lt;START&gt; Добро пожаловать</text><text x="330" y="540" class="cap" text-anchor="middle">исходная фраза</text><text x="630" y="540" class="cap" text-anchor="middle">перевод, сдвинутый вправо</text>
  </g>
  <g data-key="c1" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="bx"/><text x="330.0" y="447.0" class="lbl-b" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="bx"/><text x="630.0" y="447.0" class="lbl-b" text-anchor="middle">Output Embedding</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">TokenEmbedding</text><text x="40" y="66" class="cap">nn.Embedding × √d</text>
  </g>
  <g data-key="c2" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="330" cy="384" r="13" class="by"/><text x="330" y="389" class="lbl-b" text-anchor="middle">+</text><text x="312" y="389" class="lbl-b" text-anchor="end">Position Encoding</text>
<circle cx="630" cy="384" r="13" class="by"/><text x="630" y="389" class="lbl-b" text-anchor="middle">+</text><text x="648" y="389" class="lbl-b" text-anchor="start">Position Encoding</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">PositionalEncoding</text><text x="40" y="66" class="cap">register_buffer("pe")</text>
  </g>
  <g data-key="c3" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">MultiHeadAttention</text><text x="40" y="66" class="cap">scaled_dot_product_attention внутри</text>
  </g>
  <g data-key="c4" data-only="1">
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">FeedForward</text><text x="40" y="66" class="cap">Linear → ReLU → Linear</text>
  </g>
  <g data-key="c5" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">AddNorm</text><text x="40" y="66" class="cap">LayerNorm(x + sublayer(x))</text>
  </g>
  <g data-key="c6" data-only="1">
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="220" y="180" width="220" height="164" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<rect x="235" y="296" width="190" height="36" rx="6" class="br"/><text x="330.0" y="319.0" class="lbl-b" text-anchor="middle">Multi-Head Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="235" y="226" width="190" height="34" rx="6" class="by"/><text x="330.0" y="248.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="bx"/><text x="330.0" y="212.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">EncoderLayer × N = Encoder</text><text x="40" y="66" class="cap">nn.ModuleList</text>
  </g>
  <g data-key="c7" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="off"/><text x="630.0" y="63.0" class="offt" text-anchor="middle">Linear + Softmax</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="520" y="100" width="220" height="244" rx="10" fill="none" stroke="#3576C0" stroke-width="2"/>
<path d="M330 180 V160 H480 V240 H533" fill="none" stroke="#C30B0A" stroke-width="2.2" marker-end="url(#pt-arwr)"/><text x="344" y="152" class="cap" style="fill:#a30908;font-weight:700">память Hᴺ</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="br"/><text x="630.0" y="319.0" class="lbl-b" text-anchor="middle" style="font-size:13px">Masked Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="284.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="br"/><text x="630.0" y="245.0" class="lbl-b" text-anchor="middle">Cross-Attention</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="210.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="by"/><text x="630.0" y="172.0" class="lbl-b" text-anchor="middle">Feed Forward</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="bx"/><text x="630.0" y="136.0" class="lbl-b" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">DecoderLayer × N = Decoder</text><text x="40" y="66" class="cap">self_attn, cross_attn, ff</text>
  </g>
  <g data-key="c8" data-only="1">
<rect x="235" y="226" width="190" height="34" rx="6" class="off"/><text x="330.0" y="248.0" class="offt" text-anchor="middle">Feed Forward</text>
<circle cx="330" cy="384" r="13" class="off"/><text x="330" y="389" class="offt" text-anchor="middle">+</text><text x="312" y="389" class="offt" text-anchor="end">Position Encoding</text>
<rect x="550" y="124" width="160" height="16" rx="6" class="off"/><text x="630.0" y="136.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="535" y="150" width="190" height="34" rx="6" class="off"/><text x="630.0" y="172.0" class="offt" text-anchor="middle">Feed Forward</text>
<rect x="550" y="198" width="160" height="16" rx="6" class="off"/><text x="630.0" y="210.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<circle cx="630" cy="384" r="13" class="off"/><text x="630" y="389" class="offt" text-anchor="middle">+</text><text x="648" y="389" class="offt" text-anchor="start">Position Encoding</text>
<rect x="535" y="296" width="190" height="36" rx="6" class="off"/><text x="630.0" y="319.0" class="offt" text-anchor="middle">Masked Multi-Head Attention</text>
<rect x="235" y="296" width="190" height="36" rx="6" class="off"/><text x="330.0" y="319.0" class="offt" text-anchor="middle">Multi-Head Attention</text>
<rect x="550" y="272" width="160" height="16" rx="6" class="off"/><text x="630.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="220" y="424" width="220" height="36" rx="8" class="off"/><text x="330.0" y="447.0" class="offt" text-anchor="middle">Input Embedding</text>
<rect x="520" y="424" width="220" height="36" rx="8" class="off"/><text x="630.0" y="447.0" class="offt" text-anchor="middle">Output Embedding</text>
<rect x="535" y="222" width="190" height="36" rx="6" class="off"/><text x="630.0" y="245.0" class="offt" text-anchor="middle">Cross-Attention</text>
<rect x="250" y="272" width="160" height="16" rx="6" class="off"/><text x="330.0" y="284.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="250" y="200" width="160" height="16" rx="6" class="off"/><text x="330.0" y="212.0" class="offs" text-anchor="middle" style="font-size:12px">Add &amp; Norm</text>
<rect x="540" y="40" width="180" height="36" rx="6" class="bg"/><text x="630.0" y="63.0" class="lbl-b" text-anchor="middle">Linear + Softmax</text>
<text x="40" y="44" class="lbl-b" style="font-family:'Courier New',monospace;font-size:18px;fill:#245A98">Transformer.generator</text><text x="40" y="66" class="cap">nn.Linear(d, V), weight tying</text>
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
    <div class="step-panel" data-on="arch c1" data-focus="c1">
      <div class="step-kicker">Шаг 1 · гл. 1</div>
      <h4>Две таблицы эмбеддингов</h4>
      <p>Один класс, два экземпляра: <code>src_embed</code> и <code>tgt_embed</code>. Форма <code>[B, L] → [B, L, d]</code>.</p>
    </div>
    <div class="step-panel" data-on="arch c2" data-focus="c2">
      <div class="step-kicker">Шаг 2 · гл. 2</div>
      <h4>Позиционный код — буфер, а не параметр</h4>
      <p>Матрица PE считается один раз в конструкторе и хранится как buffer: сохраняется с моделью, но не обучается.</p>
    </div>
    <div class="step-panel" data-on="arch c3" data-focus="c3">
      <div class="step-kicker">Шаг 3 · гл. 6–7</div>
      <h4>Один класс на три блока внимания</h4>
      <p>Self-attention, masked self-attention и cross-attention — три экземпляра одного <code>MultiHeadAttention</code>. Различаются только аргументы <code>query, key, value, mask</code>.</p>
    </div>
    <div class="step-panel" data-on="arch c4" data-focus="c4">
      <div class="step-kicker">Шаг 4 · гл. 5</div>
      <h4>Позиционная сеть</h4>
      <p>Два <code>nn.Linear</code> с ReLU. Применяется к тензору <code>[B, L, d]</code> целиком — по последней оси, то есть к каждой позиции отдельно.</p>
    </div>
    <div class="step-panel" data-on="arch c5" data-focus="c5">
      <div class="step-kicker">Шаг 5 · гл. 5</div>
      <h4>Обёртка каждого подслоя</h4>
      <p><code>AddNorm</code> принимает подслой как функцию и делает residual плюс LayerNorm. Флаг <code>pre_ln</code> переключает на современный порядок.</p>
    </div>
    <div class="step-panel" data-on="arch c6" data-focus="c6">
      <div class="step-kicker">Шаг 6 · гл. 5</div>
      <h4>Слой энкодера и стек</h4>
      <p>Слой — два подслоя в двух <code>AddNorm</code>. Стек — <code>nn.ModuleList</code> из N слоёв с независимыми весами.</p>
    </div>
    <div class="step-panel" data-on="arch c7" data-focus="c7">
      <div class="step-kicker">Шаг 7 · гл. 8–9</div>
      <h4>Слой декодера и стек</h4>
      <p>Три подслоя; в cross-attention передаётся память энкодера. Маски собираются в <code>Transformer.decode</code>.</p>
    </div>
    <div class="step-panel" data-on="arch c8" data-focus="c8">
      <div class="step-kicker">Шаг 8 · гл. 10</div>
      <h4>Проекция на словарь</h4>
      <p>Один <code>nn.Linear</code>; softmax не нужен в модели — его делает <code>F.cross_entropy</code> на обучении и argmax на инференсе.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Первый шаг показывает, где блок стоит в трансформере. Стрелки ← → работают, когда сцена в фокусе.</p>

<div class="callout-blue"><strong>Почему кирпичей так мало:</strong> все блоки схемы собраны из пяти классов-кирпичей — <code>TokenEmbedding</code>, <code>PositionalEncoding</code>, <code>MultiHeadAttention</code>, <code>FeedForward</code>, <code>AddNorm</code>; остальные классы только соединяют их. Так получается потому, что внимание во всех трёх местах — один и тот же <code>MultiHeadAttention</code>, а Add &amp; Norm — одна и та же обёртка. Трансформер собран из немногих деталей, повторённых много раз; код это просто делает видимым.</div>

<h3>Вход: эмбеддинги и позиционный код</h3>

<p>Эмбеддинг — обычный <code>nn.Embedding</code>, то есть таблица <code>[V, d]</code> с поиском строки по ID. В оригинальной статье её выход умножают на <code>√d_model</code>, чтобы масштаб эмбеддингов был сопоставим с позиционным кодом (в учебных числах глав 1–4 этого множителя не было). Позиционный код считается один раз и регистрируется как buffer.</p>

```python
class TokenEmbedding(nn.Module):
    """ID → строка обучаемой таблицы E формы [V, d]."""

    def __init__(self, vocab_size: int, d_model: int, scale: bool = True):
        super().__init__()
        self.table = nn.Embedding(vocab_size, d_model)
        # В оригинальной статье эмбеддинги умножают на √d_model, чтобы их масштаб
        # был сопоставим с позиционным кодом. В учебных числах статьи этого нет.
        self.scale = math.sqrt(d_model) if scale else 1.0

    def forward(self, ids: torch.Tensor) -> torch.Tensor:  # [B, L] -> [B, L, d]
        return self.table(ids) * self.scale
```

```python
class PositionalEncoding(nn.Module):
    """Синусоидальный код: PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(...)."""

    def __init__(self, d_model: int, max_len: int = 512, dropout: float = 0.0):
        super().__init__()
        pos = torch.arange(max_len).unsqueeze(1)                        # [max_len, 1]
        freq = torch.pow(10000.0, -torch.arange(0, d_model, 2) / d_model)  # [d/2]
        pe = torch.zeros(max_len, d_model)
        pe[:, 0::2] = torch.sin(pos * freq)
        pe[:, 1::2] = torch.cos(pos * freq)
        # buffer: сохраняется вместе с моделью, но не обучается
        self.register_buffer("pe", pe)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:  # [B, L, d] -> [B, L, d]
        # PE[:L] имеет форму [L, d] и размножается по батчу (broadcast, гл. 3)
        return self.dropout(x + self.pe[: x.size(1)])
```

<h3>Scaled Dot-Product Attention</h3>

<p>Пять операций со схемы главы 6 — пять строк. Маска булева: <code>True</code> — пара разрешена; <code>masked_fill</code> ставит −∞ в запрещённые клетки до softmax. Благодаря broadcast одна функция работает и с маской <code>[B, 1, 1, L]</code> (PAD), и с <code>[1, 1, T, T]</code> (причинная).</p>

```python
def scaled_dot_product_attention(q, k, v, mask=None):
    """
    q: [B, h, Lq, d_k]   k, v: [B, h, Lk, d_k]
    mask: bool, broadcast до [B, h, Lq, Lk]; True — связь разрешена
    """
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1)          # MatMul   -> [B, h, Lq, Lk]
    scores = scores / math.sqrt(d_k)          # Scale
    if mask is not None:                      # Mask (opt.): −∞ до softmax
        scores = scores.masked_fill(~mask, float("-inf"))
    weights = scores.softmax(dim=-1)          # SoftMax по ключам, строки суммируются в 1
    return weights @ v, weights               # MatMul с V -> [B, h, Lq, d_k]
```

<h3>Multi-Head Attention</h3>

<p>Главный трюк реализации: h проекций <code>[d, d_k]</code> хранятся как один <code>nn.Linear(d, d)</code>, а головы получаются перестановкой осей <code>[B, L, d] → [B, L, h, d_k] → [B, h, L, d_k]</code>. Все головы считаются одним матричным умножением — параллельно, как и обещала глава 7. Concat — обратная перестановка, после неё <code>W_o</code>.</p>

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.0):
        super().__init__()
        assert d_model % n_heads == 0, "d_model должен делиться на число голов"
        self.h, self.d_k = n_heads, d_model // n_heads
        # Один Linear [d, d] = h проекций [d, d_k], склеенных по выходу
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)
        self.weights = None  # последние веса внимания — для визуализации

    def _split(self, x):  # [B, L, d] -> [B, h, L, d_k]
        B, L, _ = x.shape
        return x.view(B, L, self.h, self.d_k).transpose(1, 2)

    def forward(self, query, key, value, mask=None):
        # self-attention: query = key = value = x;  cross: query = декодер, key = value = память
        q = self._split(self.w_q(query))
        k = self._split(self.w_k(key))
        v = self._split(self.w_v(value))
        z, self.weights = scaled_dot_product_attention(q, k, v, mask)  # [B, h, Lq, d_k]
        B, _, Lq, _ = z.shape
        z = z.transpose(1, 2).contiguous().view(B, Lq, self.h * self.d_k)  # Concat -> [B, Lq, d]
        return self.dropout(self.w_o(z))                                    # Wᴼ     -> [B, Lq, d]
```

<h3>Feed Forward и Add &amp; Norm</h3>

<p><code>nn.Linear</code> в PyTorch действует на последнюю ось, поэтому Feed Forward сам собой применяется к каждой позиции отдельно — ни цикла, ни перестановок. <code>AddNorm</code> получает подслой как функцию: так одна обёртка годится и для внимания с его масками, и для Feed Forward.</p>

```python
class FeedForward(nn.Module):
    """FFN(y) = max(0, yW₁ + b₁)W₂ + b₂ — отдельно для каждой позиции, d -> d_ff -> d."""

    def __init__(self, d_model: int, d_ff: int, dropout: float = 0.0):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.ReLU(), nn.Dropout(dropout), nn.Linear(d_ff, d_model)
        )

    def forward(self, x):  # [B, L, d] -> [B, L, d]
        return self.net(x)
```

```python
class AddNorm(nn.Module):
    """Post-LN, как в оригинале: LayerNorm(x + Sublayer(x)).
    pre_ln=True даёт современный вариант: x + Sublayer(LayerNorm(x))."""

    def __init__(self, d_model: int, dropout: float = 0.0, pre_ln: bool = False):
        super().__init__()
        self.norm = nn.LayerNorm(d_model)  # γ, β — обучаемые векторы длины d
        self.dropout = nn.Dropout(dropout)
        self.pre_ln = pre_ln

    def forward(self, x, sublayer):
        if self.pre_ln:
            return x + self.dropout(sublayer(self.norm(x)))
        return self.norm(x + self.dropout(sublayer(x)))
```

<h3>Слои и стеки</h3>

<p>Слой энкодера — два <code>AddNorm</code> подряд. Слой декодера — три, и во втором запрос идёт из декодера, а ключи и значения — из <code>memory</code>. Стек — <code>nn.ModuleList</code>: каждый слой создаётся заново, поэтому веса у всех свои.</p>

```python
class EncoderLayer(nn.Module):
    """Два подслоя: self-attention и Feed Forward, каждый в Add & Norm."""

    def __init__(self, d_model, n_heads, d_ff, dropout=0.0, pre_ln=False):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, n_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.add_norm1 = AddNorm(d_model, dropout, pre_ln)
        self.add_norm2 = AddNorm(d_model, dropout, pre_ln)

    def forward(self, x, src_mask):  # [B, L, d] -> [B, L, d]
        x = self.add_norm1(x, lambda y: self.self_attn(y, y, y, src_mask))
        return self.add_norm2(x, self.ff)
```

```python
class DecoderLayer(nn.Module):
    """Три подслоя: masked self-attention, cross-attention к памяти, Feed Forward."""

    def __init__(self, d_model, n_heads, d_ff, dropout=0.0, pre_ln=False):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, n_heads, dropout)
        self.cross_attn = MultiHeadAttention(d_model, n_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.add_norm1 = AddNorm(d_model, dropout, pre_ln)
        self.add_norm2 = AddNorm(d_model, dropout, pre_ln)
        self.add_norm3 = AddNorm(d_model, dropout, pre_ln)

    def forward(self, y, memory, tgt_mask, src_mask):  # y: [B, T, d], memory: [B, L, d]
        # «что я уже сказал»: Q, K, V из перевода, будущее закрыто
        y = self.add_norm1(y, lambda t: self.self_attn(t, t, t, tgt_mask))
        # «что было в оригинале»: Q из декодера, K и V из памяти энкодера
        y = self.add_norm2(y, lambda t: self.cross_attn(t, memory, memory, src_mask))
        return self.add_norm3(y, self.ff)  # -> [B, T, d]
```

```python
class Encoder(nn.Module):
    def __init__(self, n_layers, d_model, n_heads, d_ff, dropout=0.0, pre_ln=False):
        super().__init__()
        # N слоёв одного устройства, но с независимыми весами
        self.layers = nn.ModuleList(
            EncoderLayer(d_model, n_heads, d_ff, dropout, pre_ln) for _ in range(n_layers)
        )
        # В Pre-LN после стека нужна финальная нормализация
        self.final_norm = nn.LayerNorm(d_model) if pre_ln else nn.Identity()

    def forward(self, x, src_mask):  # -> память Hᴺ: [B, L, d]
        for layer in self.layers:
            x = layer(x, src_mask)
        return self.final_norm(x)
```

<h3>Маски</h3>

<p>Две функции из главы 8. Формы подобраны так, чтобы маска расширялась до <code>[B, h, T, L]</code> без копирования. Для masked self-attention декодера обе маски объединяются через <code>&amp;</code>: пара разрешена, только если ключ не PAD <em>и</em> не из будущего.</p>

```python
def make_pad_mask(ids: torch.Tensor, pad_id: int) -> torch.Tensor:
    """[B, L] -> [B, 1, 1, L]: True там, где ключ — настоящий токен, а не PAD."""
    return (ids != pad_id)[:, None, None, :]
```

```python
def make_causal_mask(T: int, device=None) -> torch.Tensor:
    """[1, 1, T, T]: нижний треугольник — позиция видит себя и всё, что левее."""
    return torch.tril(torch.ones(T, T, dtype=torch.bool, device=device))[None, None]
```

<h3>Модель целиком</h3>

<p><code>encode</code> и <code>decode</code> разделены не случайно: на инференсе энкодер вызывается один раз, а декодер — на каждом шаге генерации. <code>generator</code> возвращает логиты; softmax внутри модели не нужен — его сделает <code>F.cross_entropy</code>. Флаг <code>tie_weights</code> включает weight tying из главы 10: <code>W_out</code> и таблица Output Embedding — один и тот же тензор.</p>

```python
class Transformer(nn.Module):
    def __init__(self, src_vocab, tgt_vocab, d_model=512, n_heads=8, n_layers=6, d_ff=2048,
                 dropout=0.1, pad_id=0, max_len=512, pre_ln=False, tie_weights=True):
        super().__init__()
        self.pad_id = pad_id
        self.src_embed = TokenEmbedding(src_vocab, d_model)   # Input Embedding
        self.tgt_embed = TokenEmbedding(tgt_vocab, d_model)   # Output Embedding
        self.pos = PositionalEncoding(d_model, max_len, dropout)
        self.encoder = Encoder(n_layers, d_model, n_heads, d_ff, dropout, pre_ln)
        self.decoder = Decoder(n_layers, d_model, n_heads, d_ff, dropout, pre_ln)
        self.generator = nn.Linear(d_model, tgt_vocab)         # W_out: [d, V]
        if tie_weights:  # weight tying: W_out — это транспонированная таблица Output Embedding
            self.generator.weight = self.tgt_embed.table.weight
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)

    def encode(self, src):                                    # [B, L] -> [B, L, d]
        src_mask = make_pad_mask(src, self.pad_id)
        return self.encoder(self.pos(self.src_embed(src)), src_mask), src_mask

    def decode(self, tgt_in, memory, src_mask):               # [B, T] -> [B, T, V]
        T = tgt_in.size(1)
        tgt_mask = make_pad_mask(tgt_in, self.pad_id) & make_causal_mask(T, tgt_in.device)
        y = self.decoder(self.pos(self.tgt_embed(tgt_in)), memory, tgt_mask, src_mask)
        return self.generator(y)                              # логиты, softmax — в loss

    def forward(self, src, tgt_in):
        memory, src_mask = self.encode(src)
        return self.decode(tgt_in, memory, src_mask)
```

<h3>Обучение и генерация</h3>

<p>Teacher forcing — это одна строка: <code>shift_right</code> ставит <code>&lt;START&gt;</code> в начало цели и отбрасывает последний токен. Loss — cross-entropy по всем позициям сразу, <code>ignore_index</code> выключает PAD из цели. Генерация — цикл, в котором к входу декодера каждый раз дописывается argmax последней позиции.</p>

```python
def shift_right(tgt: torch.Tensor, start_id: int):
    """Teacher forcing: цель «Добро пожаловать <END>» -> вход «<START> Добро пожаловать»."""
    return torch.cat([torch.full_like(tgt[:, :1], start_id), tgt[:, :-1]], dim=1)
```

```python
def translation_loss(logits, tgt, pad_id, label_smoothing=0.0):
    """Cross-entropy по всем позициям перевода, PAD в цели не учитывается."""
    return F.cross_entropy(logits.reshape(-1, logits.size(-1)), tgt.reshape(-1),
                           ignore_index=pad_id, label_smoothing=label_smoothing)
```

```python
@torch.no_grad()
def greedy_decode(model, src, start_id, end_id, max_len=20):
    """Инференс: энкодер один раз, декодер — по токену за шаг до <END>."""
    model.eval()
    memory, src_mask = model.encode(src)
    out = torch.full((src.size(0), 1), start_id, dtype=torch.long, device=src.device)
    for _ in range(max_len):
        logits = model.decode(out, memory, src_mask)          # [B, t, V]
        next_id = logits[:, -1].argmax(-1, keepdim=True)      # берём только последнюю позицию
        out = torch.cat([out, next_id], dim=1)
        if (next_id == end_id).all():
            break
    return out[:, 1:]
```

<p>Учебный запуск: десять пар фраз, <code>d_model = 32</code>, 4 головы, 2 слоя, 44 тысячи параметров, 300 шагов Adam на CPU — несколько секунд.</p>

```python
model = Transformer(len(src_vocab), len(tgt_vocab), d_model=32, n_heads=4, n_layers=2,
                    d_ff=64, dropout=0.1, pad_id=PAD)
print("параметров:", sum(p.numel() for p in model.parameters()))
optimizer = torch.optim.Adam(model.parameters(), lr=2e-3, betas=(0.9, 0.98))

for step in range(1, 301):
    model.train()
    logits = model(src, tgt_in)                  # [B, T, V] — все позиции за один проход
    loss = translation_loss(logits, tgt, PAD, label_smoothing=0.05)
    optimizer.zero_grad()
    loss.backward()                              # градиент p − y уходит до эмбеддингов
    optimizer.step()
    if step in (1, 50, 100, 200, 300):
        print(f"шаг {step:3d}  loss {loss.item():.3f}")
```

<div class="console">форма батча: src (10, 4) tgt (10, 5)
параметров: 43989
шаг   1  loss 3.677
шаг  50  loss 0.991
шаг 100  loss 0.502
шаг 200  loss 0.383
шаг 300  loss 0.387

you are welcome          -&gt; добро пожаловать
good morning my friend   -&gt; доброе утро мой друг
thank you                -&gt; спасибо

cross-attention (строки: &lt;START&gt; добро пожаловать; столбцы: you are welcome)
[[0.39 0.28 0.33]
 [0.36 0.34 0.31]
 [0.25 0.45 0.3 ]]</div>

<div class="worked-example">
  <div class="worked-label">Как это прочитать</div>
  <p class="worked-reading">Loss останавливается около 0.38, а не у нуля — это цена label smoothing: цель «размазана» на 5%, и модель не должна быть уверена на 100%. Перевод «you are welcome» правильный, хотя слово «welcome» в корпусе встречается и в другой фразе — модель различает его по контексту. На таком корпусе модель, конечно, запоминает, а не обобщает; это проверка, что все блоки соединены правильно.</p>
</div>

<h3>Сверка со статьёй</h3>

<p>Код должен давать ровно те числа, что считались в главах. Скрипт <code>check_article_numbers.py</code> подставляет учебные данные — эмбеддинги «You are welcome», матрицы W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> из главы 6, оценки из главы 8, логиты из главы 10 — и сравнивает результат с числами из текста.</p>

<div class="console">OK  PE(1): [0.841, 0.54, 0.01, 1.0]
OK  X[1] = E[are] + PE(1): [0.541, 1.04, 0.21, 1.8]
OK  LayerNorm(X[1] + A[1]): [-0.475, 0.098, -1.17, 1.548]
OK  веса внимания для «are»: [0.264, 0.438, 0.299]
OK  выход головы для «are»: [0.697, 0.388, 0.324, 1.053]
OK  softmax без маски: [0.269, 0.081, 0.541, 0.109]
OK  softmax с маской: [0.302, 0.091, 0.607, 0.0]
причинная маска T = 3:
 tensor([[1, 0, 0],
        [1, 1, 0],
        [1, 1, 1]], dtype=torch.int32)
OK  cross-entropy: 0.759

все числа совпали со статьёй</div>

<p>Второй скрипт, <code>test_properties.py</code>, проверяет не числа, а поведение, о котором говорилось словами: лишние PAD не меняют перевод, позиция декодера не видит будущих, а в энкодере каждое слово влияет на все позиции.</p>

<div class="console">формы: логиты (2, 4, 12) · память (2, 4, 16)
PAD в источнике не влияет на результат: True
позиции 0–2 не видят позицию 3: True · сама позиция 3 изменилась: True
в энкодере последнее слово влияет на все позиции: True
все проверки пройдены</div>

<div class="callout-yellow"><strong>Что изменить для настоящей задачи:</strong> токенизатор подслов (BPE или SentencePiece) вместо слов, батчи с сортировкой по длине, расписание learning rate с разогревом из оригинальной статьи, <code>pre_ln=True</code> для глубоких моделей, KV-cache в <code>greedy_decode</code> и beam search вместо argmax. В PyTorch есть и готовые кирпичи — <code>nn.MultiheadAttention</code>, <code>F.scaled_dot_product_attention</code> с быстрыми ядрами, <code>nn.Transformer</code>; после этой главы видно, что внутри каждого из них.</div>

<div class="callout"><strong>Главная мысль:</strong> вся архитектура — пять небольших классов-кирпичей и их сборка. Три блока внимания — один класс с разными аргументами, Add &amp; Norm — одна обёртка, а стек — список одинаковых слоёв с разными весами.</div>

<hr>

<h2 id="recall">Что важно уметь восстановить по памяти</h2>

<ol class="end-list">
  <li><strong>Две таблицы эмбеддингов.</strong> Input Embedding для исходного языка, Output Embedding для целевого; вторая всегда работает со сдвинутой вправо последовательностью.</li>
  <li><strong>Позиция добавляется, а не приписывается.</strong> <code>X[j] = E[token_j] + PE(j)</code>: сумма сохраняет ширину потока, которую требуют residual-связи.</li>
  <li><strong>Форма основного пути постоянна.</strong> <code>[B, L, d]</code> от первого блока до последнего; Feed Forward расширяется внутри себя, но наружу возвращает <code>d_model</code>.</li>
  <li><strong>Слой энкодера — два подслоя.</strong> Self-attention смешивает позиции, Feed Forward обрабатывает каждую позицию отдельно; оба обёрнуты в <code>Add &amp; Norm</code>.</li>
  <li><strong>Формула внимания одна на всю модель.</strong> <code>softmax(QKᵀ/√d_k)V</code>; различаются только источники Q, K, V и набор разрешённых ключей.</li>
  <li><strong>Головы делят ширину, а не умножают работу.</strong> <code>d_k = d_model / h</code>, конкатенация плюс <code>W_O</code> возвращают вектор к <code>d_model</code>.</li>
  <li><strong>Маска применяется до softmax.</strong> Запрещённой паре прибавляется <code>−∞</code>; padding-маска убирает <code>PAD</code>, причинная — будущие позиции.</li>
  <li><strong>Слой декодера — три подслоя.</strong> Masked self-attention смотрит на уже сказанное, cross-attention — на память энкодера <code>H<sup>N</sup></code>, затем Feed Forward.</li>
  <li><strong>Выход — это проекция на словарь.</strong> Linear даёт логиты, softmax — распределение, cross-entropy на обучении даёт градиент <code>p − y</code>.</li>
  <li><strong>В коде это пять кирпичей.</strong> <code>TokenEmbedding</code>, <code>PositionalEncoding</code>, <code>MultiHeadAttention</code>, <code>FeedForward</code>, <code>AddNorm</code>; головы — это <code>view</code> и <code>transpose</code>, маски — булевы тензоры, которые broadcast растягивает до <code>[B, h, T, L]</code>.</li>
</ol>

<p>Если держать в голове одну картину, пусть это будет труба постоянной ширины. Внутри неё всего два типа движения: вдоль потока, когда каждая позиция пересчитывается сама по себе, и поперёк, когда attention смешивает позиции между собой. Всё остальное в архитектуре — это правила о том, кому с кем разрешено смешиваться.</p>

<p class="tiny">Числа в примерах: эмбеддинги, ID и веса (W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>, W₁, W₂, Wᴼ, W_out) заданы для иллюстрации и не взяты из обученной модели. Позиционный код, веса внимания, LayerNorm, выходы голов, softmax и cross-entropy вычислены скриптом по тем же формулам и на тех же данных, что в исходных интерактивах. Веса Feed Forward в главе 5 подобраны так, чтобы воспроизвести скрытый слой и выход FFN для «are»; строки You и welcome получены тем же LayerNorm. Оценки в главе 8 учебные. Память энкодера в главах 6 и 9 получена после одного учебного слоя вместо полного стека; шаги обучения в главе 10 меняют только W_out и bias. Значения округлены до трёх знаков, в главе 7 — до двух; размерности уменьшены: <code>d_model</code> = 4 или 8 вместо 512, <code>d_ff</code> = 8 вместо 2048.</p>
