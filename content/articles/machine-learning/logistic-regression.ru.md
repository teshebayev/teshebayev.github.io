<script>
window.kxFO = function (x, baselineY, tex, opts) {
  opts = opts || {};
  var px = opts.size || 14;
  var color = opts.color || '#5E5850';
  var align = opts.align || 'start';
  var display = !!opts.display;
  var boxW = opts.w || 360;
  var boxH = px * 3.0;
  var cY = baselineY - px * 0.32;
  var topY = cY - boxH / 2;
  var justify = align === 'middle' ? 'center' : (align === 'end' ? 'flex-end' : 'flex-start');
  var foX = align === 'middle' ? x - boxW / 2 : (align === 'end' ? x - boxW : x);
  var out;
  try { out = katex.renderToString(tex, { throwOnError: false, displayMode: display }); }
  catch (e) { out = tex; }
  return '<foreignObject x="' + foX + '" y="' + topY + '" width="' + boxW + '" height="' + boxH +
         '" style="overflow:visible;">' +
         '<div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;justify-content:' + justify +
         ';align-items:center;width:' + boxW + 'px;height:' + boxH + 'px;line-height:1.0;">' +
         '<span style="font-size:' + px + 'px;color:' + color + ';white-space:nowrap;">' + out + '</span>' +
         '</div></foreignObject>';
};
window.kxFOEl = function (x, baselineY, tex, opts) {
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.innerHTML = window.kxFO(x, baselineY, tex, opts);
  return g.firstChild;
};
</script>

Линейная регрессия предсказывает число. Логистическая регрессия решает другую задачу: она отвечает на вопрос «к какому классу относится объект?» — например, письмо спам или не спам, клиент уйдёт или останется, заявка рискованная или нормальная.

Название немного обманчивое: логистическая регрессия — это не регрессия в смысле предсказания непрерывного числа, а базовая модель **бинарной классификации**. Она берёт признаки, считает линейную комбинацию, пропускает её через сигмоиду и получает вероятность класса 1.

В этой статье мы пройдём тот же путь, что и для линейной регрессии: сначала интуиция и функция потерь, затем градиентный спуск, потом forward pass, backward pass и матричная форма для батча — и в конце соберём всё в работающий код на numpy и PyTorch.

---

## Часть 1. Логистическая регрессия

Представим задачу: нужно определить, является ли письмо спамом. Для простоты возьмём два признака: сколько в письме подозрительных слов и сколько ссылок. Метка `y` равна `1`, если письмо спам, и `0`, если не спам.

Линейная часть модели такая же, как в линейной регрессии:

$$z = w_1 x_1 + w_2 x_2 + b$$

Но дальше появляется важное отличие: значение `z` может быть любым числом от минус бесконечности до плюс бесконечности. А нам нужна вероятность от `0` до `1`. Поэтому применяем **сигмоиду**:

$$a = \sigma(z) = \dfrac{1}{1 + e^{-z}}$$

Здесь `a` — предсказанная вероятность класса 1. Например, `a = 0.82` означает: модель считает, что объект относится к классу 1 с вероятностью 82%.

> **Откуда берётся сигмоида.** Если предположить, что лог-шансы (`ln(a / (1 − a))` — «насколько правдоподобнее класс 1, чем класс 0, в логарифмической шкале») линейно зависят от признаков, то после обратного преобразования получается ровно сигмоида. Линейная регрессия моделирует *само значение*, а логистическая — *лог-шансы*.

> **Ключевая идея:** логистическая регрессия сначала строит линейную границу между классами, а затем превращает расстояние от этой границы в вероятность. Чем дальше объект по одну сторону границы, тем ближе вероятность к 1; чем дальше по другую — тем ближе к 0.

Посмотрим это пошагово — от данных до классификации нового письма:

<figure class="embedded-interactive" id="section-interactive-1">
  <div class="interactive-meta">Интерактив 1</div>
  <p class="interactive-desc">Логистическая регрессия: пошаговая интуиция</p>
<div class="interactive-svg-wrap">
<svg id="logRegIntuition" viewBox="0 0 960 680" width="100%" role="img" aria-label="Логистическая регрессия: пошаговая интуиция">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .text { font-size: 16px; fill: #111111; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .label { font-size: 13px; fill: #111111; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; }
    svg .grid { stroke: #ECECEC; stroke-width: 1; }
    svg .mono { font-family: 'Courier New', Courier, monospace; }
    svg .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    svg .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    svg .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="lgi-title" x="36" y="48" class="title"></text>
  <text id="lgi-subtitle" x="36" y="78" class="subtitle"></text>
  <g id="lgi-scene"></g>
  <text id="lgi-counter" x="36" y="635" class="text"></text>

  <g id="lgi-prevGroup">
    <rect id="lgi-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>
  <g id="lgi-nextGroup">
    <rect id="lgi-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="lgi-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const data = [
        {x:0.5,y:0.8,c:0},{x:1.0,y:1.2,c:0},{x:1.4,y:0.7,c:0},{x:1.8,y:1.6,c:0},
        {x:2.2,y:1.0,c:0},{x:2.6,y:1.4,c:0},{x:3.0,y:0.9,c:0},
        {x:2.5,y:3.7,c:1},{x:3.0,y:3.0,c:1},{x:3.5,y:3.6,c:1},{x:4.0,y:2.7,c:1},
        {x:4.2,y:4.4,c:1},{x:4.7,y:3.2,c:1},{x:5.0,y:4.7,c:1},{x:5.5,y:3.9,c:1}
      ];
      const examples = [
        {x1:0.5,x2:0.8,y:0,txt:'обычное письмо'},
        {x1:1.8,x2:1.6,y:0,txt:'обычное письмо'},
        {x1:3.0,x2:3.0,y:1,txt:'спам'},
        {x1:4.2,x2:4.4,y:1,txt:'спам'},
        {x1:5.0,x2:4.7,y:1,txt:'спам'}
      ];

      const w1 = 1.35, w2 = 1.15, b = -6.15;
      const z = (x,y) => w1*x + w2*y + b;
      const sig = (v) => 1/(1+Math.exp(-v));
      const newP = {x:3.4,y:2.8};
      const newZ = z(newP.x,newP.y);
      const newA = sig(newZ);

      const X0=460, X1=920, Y0=540, Y1=155, xMin=0, xMax=6, yMin=0, yMax=5.5;
      const xPx = (x) => X0 + (x-xMin)/(xMax-xMin)*(X1-X0);
      const yPx = (y) => Y0 - (y-yMin)/(yMax-yMin)*(Y0-Y1);

      function axes() {
        let s='';
        for(let x=0; x<=6; x+=1){
          const xp=xPx(x); s += `<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${x}</text>`;
        }
        for(let y=0; y<=5; y+=1){
          const yp=yPx(y); s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${y}</text>`;
        }
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+40}" text-anchor="middle" class="label">x₁: подозрительные слова</text>`;
        s += `<text x="${X0-45}" y="${Y1-8}" class="label">x₂: ссылки</text>`;
        return s;
      }
      function points(op=1){
        return data.map(d => {
          const color = d.c ? '#C30B0A' : '#73B222';
          const label = d.c ? '1' : '0';
          return `<circle cx="${xPx(d.x)}" cy="${yPx(d.y)}" r="7" fill="${color}" opacity="${op}" stroke="#fff" stroke-width="2"/>` +
                 `<text x="${xPx(d.x)}" y="${yPx(d.y)+4}" text-anchor="middle" style="font-size:10px;font-weight:800;fill:#fff;">${label}</text>`;
        }).join('');
      }
      function boundary(color='#3576C0', dash=''){
        // w1*x + w2*y + b = 0 => y = -(w1*x+b)/w2
        const xA=0.5, xB=5.8;
        const yA=-(w1*xA+b)/w2, yB=-(w1*xB+b)/w2;
        return `<line x1="${xPx(xA)}" y1="${yPx(yA)}" x2="${xPx(xB)}" y2="${yPx(yB)}" stroke="${color}" stroke-width="3" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
      }
      function badBoundary(){
        const xA=0.3,xB=5.8; const yA=1.5+0.15*xA, yB=1.5+0.15*xB;
        return `<line x1="${xPx(xA)}" y1="${yPx(yA)}" x2="${xPx(xB)}" y2="${yPx(yB)}" stroke="#C29E08" stroke-width="3" stroke-dasharray="8 6"/>`;
      }
      function dataTable(){
        let s=''; const x=500,y=152,rowH=34;
        s += `<text x="690" y="132" text-anchor="middle" class="small">фрагмент датасета</text>`;
        ['x₁ words','x₂ links','y'].forEach((h,i)=>{
          const colors=['#3576C0','#3576C0','#C30B0A'];
          s += `<rect x="${x+i*125}" y="${y}" width="115" height="30" fill="${colors[i]}" rx="8"/>`;
          s += `<text x="${x+i*125+57}" y="${y+20}" text-anchor="middle" style="font-size:13px;fill:#fff;font-weight:800;">${h}</text>`;
        });
        examples.forEach((r,i)=>{
          const yy=y+38+i*rowH; const bg=i%2?'#fff':'#F5F8FC';
          s += `<rect x="${x}" y="${yy}" width="365" height="${rowH-2}" fill="${bg}" stroke="#E1E5EA"/>`;
          s += `<text x="${x+57}" y="${yy+21}" text-anchor="middle" class="text">${r.x1}</text>`;
          s += `<text x="${x+182}" y="${yy+21}" text-anchor="middle" class="text">${r.x2}</text>`;
          s += `<text x="${x+307}" y="${yy+21}" text-anchor="middle" class="text" style="font-weight:800;fill:${r.y?'#C30B0A':'#73B222'};">${r.y}</text>`;
        });
        s += `<text x="690" y="${y+38+examples.length*rowH+20}" text-anchor="middle" class="small">y=1 — спам, y=0 — обычное письмо</text>`;
        return s;
      }
      function sigmoidPlot(zVal=0){
        const x0=505,x1=890,y0=505,y1=210;
        const zMin=-6,zMax=6;
        const xp=(z)=>x0+(z-zMin)/(zMax-zMin)*(x1-x0);
        const yp=(a)=>y0-a*(y0-y1);
        let path='';
        for(let t=zMin;t<=zMax;t+=0.15){
          const a=sig(t); path += `${path?'L':'M'} ${xp(t).toFixed(1)} ${yp(a).toFixed(1)} `;
        }
        let s='';
        s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="axis"/>`;
        s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" class="axis"/>`;
        s += `<line x1="${x0}" y1="${yp(0.5)}" x2="${x1}" y2="${yp(0.5)}" class="grid"/>`;
        s += `<line x1="${xp(0)}" y1="${y0}" x2="${xp(0)}" y2="${y1}" class="grid"/>`;
        s += `<path d="${path}" fill="none" stroke="#3576C0" stroke-width="3"/>`;
        s += `<text x="${x1}" y="${y0+30}" text-anchor="end" class="label">z</text>`;
        s += `<text x="${x0-28}" y="${y1-10}" class="label">a=σ(z)</text>`;
        [-6,0,6].forEach(t=>s+=`<text x="${xp(t)}" y="${y0+18}" text-anchor="middle" class="small">${t}</text>`);
        [0,0.5,1].forEach(a=>s+=`<text x="${x0-8}" y="${yp(a)+4}" text-anchor="end" class="small">${a}</text>`);
        const aVal=sig(zVal);
        s += `<line x1="${xp(zVal)}" y1="${y0}" x2="${xp(zVal)}" y2="${yp(aVal)}" stroke="#C29E08" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        s += `<line x1="${x0}" y1="${yp(aVal)}" x2="${xp(zVal)}" y2="${yp(aVal)}" stroke="#C29E08" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        s += `<circle cx="${xp(zVal)}" cy="${yp(aVal)}" r="7" fill="#C29E08" stroke="#fff" stroke-width="2"/>`;
        s += `<text x="${xp(zVal)+10}" y="${yp(aVal)-14}" class="small" style="fill:#C29E08;font-weight:800;">z=${zVal.toFixed(1)}, a=${aVal.toFixed(2)}</text>`;
        return s;
      }
      function probBar(a, x=520, y=270){
        const w=330,h=38;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F4F2EC" stroke="#DDD" rx="10"/>`+
               `<rect x="${x}" y="${y}" width="${w*a}" height="${h}" fill="${a>=0.5?'#C30B0A':'#73B222'}" rx="10"/>`+
               `<line x1="${x+w*0.5}" y1="${y-8}" x2="${x+w*0.5}" y2="${y+h+8}" stroke="#111" stroke-width="1.2" stroke-dasharray="3 3"/>`+
               `<text x="${x+w*0.5}" y="${y-14}" text-anchor="middle" class="small">порог 0.5</text>`+
               `<text x="${x+w/2}" y="${y+25}" text-anchor="middle" style="font-size:16px;font-weight:800;fill:#fff;">P(spam)=${a.toFixed(2)}</text>`;
      }

      const scene1 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Задача классификации</text>
          <text x="60" y="192" class="text">Есть письма. Для каждого знаем:</text>
          <text x="78" y="218" class="text">• x₁ — подозрительные слова</text>
          <text x="78" y="242" class="text">• x₂ — количество ссылок</text>
          <text x="78" y="266" class="text">• y — спам или нет</text>
          <rect x="60" y="300" width="340" height="62" class="box-blue"/>
          <text x="78" y="326" class="text mono">y ∈ {0, 1}</text>
          <text x="78" y="348" class="small">0 — обычное письмо, 1 — спам</text>
          <text x="60" y="404" class="text" style="font-weight:700;">Хотим выучить:</text>
          <text x="60" y="432" class="text mono">P(y=1 | x₁, x₂)</text>
          <text x="60" y="468" class="small">То есть вероятность того,</text>
          <text x="60" y="486" class="small">что письмо относится к классу 1.</text>
        </g>
        <g>${dataTable()}</g>`;

      const scene2 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Смотрим на точки</text>
          <text x="60" y="195" class="text">Каждая точка — одно письмо.</text>
          <text x="60" y="220" class="text"><tspan fill="#73B222" font-weight="800">Зелёные</tspan> — обычные.</text>
          <text x="60" y="245" class="text"><tspan fill="#C30B0A" font-weight="800">Красные</tspan> — спам.</text>
          <text x="60" y="300" class="text">Видна закономерность:</text>
          <text x="60" y="328" class="text" style="font-weight:700;fill:#3576C0;">чем больше ссылок и</text>
          <text x="60" y="350" class="text" style="font-weight:700;fill:#3576C0;">подозрительных слов,</text>
          <text x="60" y="372" class="text" style="font-weight:700;fill:#3576C0;">тем больше шанс спама.</text>
          <text x="60" y="432" class="small">Нам нужна граница, которая</text>
          <text x="60" y="450" class="small">разделяет два класса.</text>
        </g>
        <g>${axes()}${points()}</g>`;

      const scene3 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Линейная часть: logit z</text>
          <text x="60" y="192" class="text">Сначала модель считает</text>
          <text x="60" y="214" class="text">обычную линейную формулу:</text>
          <rect x="60" y="238" width="340" height="66" class="box-yellow"/>
          <text x="230" y="267" text-anchor="middle" class="text mono">z = w₁x₁ + w₂x₂ + b</text>
          <text x="230" y="288" text-anchor="middle" class="small">z называют логитом</text>
          <text x="60" y="342" class="text">Граница классов там,</text>
          <text x="60" y="364" class="text">где <tspan class="mono" font-weight="800">z = 0</tspan>.</text>
          <rect x="60" y="395" width="340" height="60" class="box-blue"/>
          <text x="78" y="420" class="small">z &gt; 0 → вероятность класса 1 выше 0.5</text>
          <text x="78" y="440" class="small">z &lt; 0 → вероятность класса 1 ниже 0.5</text>
        </g>
        <g>${axes()}${boundary()}${points()}
          <text x="${xPx(5.0)}" y="${yPx(0.2)}" text-anchor="middle" class="small" style="fill:#73B222;font-weight:800;">z &lt; 0</text>
          <text x="${xPx(4.9)}" y="${yPx(4.9)}" text-anchor="middle" class="small" style="fill:#C30B0A;font-weight:800;">z &gt; 0</text>
          <rect x="${X0+16}" y="${Y1+12}" width="245" height="42" fill="#fff" stroke="#3576C0" rx="10"/>
          <text x="${X0+138}" y="${Y1+38}" text-anchor="middle" class="small" style="fill:#3576C0;font-weight:800;">синяя линия: z = 0</text>
        </g>`;

      const scene4 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Сигмоида превращает z</text>
          <text x="60" y="180" class="text" style="font-weight:800;font-size:18px;">в вероятность</text>
          <rect x="60" y="215" width="340" height="64" class="box-blue"/>
          ${kxFO(230, 242, 'a = \\sigma(z) = \\frac{1}{1 + e^{-z}}', {align:'middle', size:15, color:'#111111', w:320})}
          <text x="230" y="264" text-anchor="middle" class="small">a всегда между 0 и 1</text>
          <text x="60" y="322" class="text">Если z = 0, то a = 0.5.</text>
          <text x="60" y="350" class="text">Если z сильно положительный,</text>
          <text x="60" y="372" class="text">a стремится к 1.</text>
          <text x="60" y="405" class="text">Если z сильно отрицательный,</text>
          <text x="60" y="427" class="text">a стремится к 0.</text>
          <text x="60" y="475" class="small" style="fill:#3576C0;font-weight:800;">Так линейная модель начинает</text>
          <text x="60" y="493" class="small" style="fill:#3576C0;font-weight:800;">выдавать вероятности.</text>
        </g>
        <g>${sigmoidPlot(0)}</g>`;

      const scene5 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-red"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Loss: binary cross-entropy</text>
          <text x="60" y="192" class="text">Теперь сравниваем вероятность</text>
          <text x="60" y="214" class="text">с настоящей меткой y.</text>
          <rect x="60" y="238" width="340" height="74" class="box-red"/>
          ${kxFO(230, 266, '\\ell = -\\bigl[\\, y\\ln(a) + (1-y)\\ln(1-a) \\,\\bigr]', {align:'middle', size:14, color:'#111111', w:332})}
          <text x="230" y="292" text-anchor="middle" class="small">для y=1: ℓ = −ln(a)</text>
          <text x="60" y="350" class="text">Если y=1, а модель дала</text>
          <text x="60" y="372" class="text">только a=0.5:</text>
          <text x="60" y="405" class="text mono" style="font-weight:800;fill:#C30B0A;">ℓ = −ln(0.5) ≈ 0.693</text>
          <text x="60" y="455" class="small">Чем ближе a к правильной метке,</text>
          <text x="60" y="473" class="small">тем меньше loss.</text>
        </g>
        <g>
          <rect x="505" y="170" width="360" height="96" class="box-red"/>
          <text x="685" y="202" text-anchor="middle" class="text" style="font-weight:800;fill:#C30B0A;">Пример одного письма</text>
          <text x="685" y="232" text-anchor="middle" class="text mono">y = 1,  a = 0.50</text>
          ${probBar(0.50,520,300)}
          <rect x="520" y="385" width="330" height="72" class="box-red"/>
          <text x="685" y="415" text-anchor="middle" class="text mono" style="font-weight:800;fill:#C30B0A;">loss = 0.693</text>
          <text x="685" y="440" text-anchor="middle" class="small">модель не уверена, но правильный класс — 1</text>
        </g>`;

      const scene6 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Обучение = подобрать границу</text>
          <text x="60" y="195" class="text">Параметры w₁, w₂ и b</text>
          <text x="60" y="217" class="text">задают положение границы.</text>
          <text x="60" y="260" class="text">Плохая граница даёт</text>
          <text x="60" y="282" class="text">большой BCE.</text>
          <text x="60" y="324" class="text">Хорошая граница делает</text>
          <text x="60" y="346" class="text">вероятности правильными:</text>
          <text x="78" y="374" class="small">• обычные письма → близко к 0</text>
          <text x="78" y="394" class="small">• спам → близко к 1</text>
          <rect x="60" y="425" width="340" height="54" class="box-green"/>
          <text x="230" y="450" text-anchor="middle" class="text" style="font-weight:800;fill:#73B222;">Цель: минимизировать BCE</text>
          <text x="230" y="470" text-anchor="middle" class="small">по w₁, w₂, b</text>
        </g>
        <g>${axes()}${badBoundary()}${boundary('#73B222')}${points()}
          <text x="${xPx(1.6)}" y="${yPx(1.95)}" text-anchor="middle" class="small" style="fill:#C29E08;font-weight:800;">плохая граница</text>
          <text x="${xPx(2.0)}" y="${yPx(3.6)}" text-anchor="middle" class="small" style="fill:#73B222;font-weight:800;">обученная граница</text>
        </g>`;

      const scene7 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-yellow"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Вероятность и порог</text>
          <text x="60" y="195" class="text">Логистическая регрессия</text>
          <text x="60" y="217" class="text">не просто говорит класс.</text>
          <text x="60" y="239" class="text">Она сначала выдаёт</text>
          <text x="60" y="261" class="text">вероятность.</text>
          <rect x="60" y="292" width="340" height="72" class="box-yellow"/>
          <text x="78" y="318" class="text mono">a = P(y=1 | x)</text>
          <text x="78" y="344" class="small">обычно: если a ≥ 0.5 → класс 1</text>
          <text x="60" y="405" class="text">Порог можно менять:</text>
          <text x="78" y="430" class="small">• меньше порог → чаще ловим спам</text>
          <text x="78" y="450" class="small">• выше порог → меньше ложных тревог</text>
        </g>
        <g>
          ${probBar(0.82,520,230)}
          <rect x="520" y="330" width="330" height="110" class="box-red"/>
          <text x="685" y="360" text-anchor="middle" class="text" style="font-weight:800;fill:#C30B0A;">a = 0.82 ≥ 0.5</text>
          <text x="685" y="392" text-anchor="middle" class="text">модель выбирает класс 1</text>
          <text x="685" y="418" text-anchor="middle" class="small">то есть письмо классифицируется как спам</text>
        </g>`;

      const scene8 = `
        <g>
          <rect x="40" y="120" width="380" height="380" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Предсказываем новое письмо</text>
          <text x="60" y="195" class="text">Возьмём новое письмо:</text>
          <rect x="60" y="220" width="340" height="84" class="box-green"/>
          <text x="78" y="248" class="text mono">x₁ = ${newP.x.toFixed(1)}</text>
          <text x="78" y="272" class="text mono">x₂ = ${newP.y.toFixed(1)}</text>
          <text x="78" y="296" class="small">подозрительных слов и ссылок довольно много</text>
          <text x="60" y="345" class="text mono">z = w₁x₁ + w₂x₂ + b</text>
          <text x="60" y="374" class="text mono">a = σ(z)</text>
          <rect x="60" y="405" width="340" height="58" class="box-green"/>
          <text x="230" y="430" text-anchor="middle" class="text mono" style="font-weight:800;fill:#73B222;">P(spam) ≈ ${newA.toFixed(2)}</text>
          <text x="230" y="452" text-anchor="middle" class="small">значит, класс 1 — спам</text>
        </g>
        <g>${axes()}${boundary('#73B222')}${points()}
          <line x1="${xPx(newP.x)}" y1="${Y0}" x2="${xPx(newP.x)}" y2="${yPx(newP.y)}" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
          <line x1="${X0}" y1="${yPx(newP.y)}" x2="${xPx(newP.x)}" y2="${yPx(newP.y)}" stroke="#5E5850" stroke-width="1.2" stroke-dasharray="4 4"/>
          <circle cx="${xPx(newP.x)}" cy="${yPx(newP.y)}" r="10" fill="#C30B0A" stroke="#fff" stroke-width="3"/>
          <rect x="${xPx(newP.x)-90}" y="${yPx(newP.y)-56}" width="180" height="36" fill="#fff" stroke="#C30B0A" rx="8"/>
          <text x="${xPx(newP.x)}" y="${yPx(newP.y)-33}" text-anchor="middle" class="small" style="fill:#C30B0A;font-weight:800;">P(spam)=${newA.toFixed(2)}</text>
        </g>`;

      const steps = [
        {title:'Шаг 1. Данные: признаки и метка', subtitle:'Бинарная классификация: y=0 или y=1', scene:scene1},
        {title:'Шаг 2. Смотрим на точки', subtitle:'Классы можно представить на плоскости признаков', scene:scene2},
        {title:'Шаг 3. Линейная граница', subtitle:'z = w₁x₁ + w₂x₂ + b; граница там, где z=0', scene:scene3},
        {title:'Шаг 4. Сигмоида', subtitle:'Превращаем logit z в вероятность класса 1', scene:scene4},
        {title:'Шаг 5. Binary cross-entropy', subtitle:'Наказываем модель за неправильные вероятности', scene:scene5},
        {title:'Шаг 6. Подбираем лучшую границу', subtitle:'Обучение — это минимизация BCE по w₁, w₂ и b', scene:scene6},
        {title:'Шаг 7. Вероятность → класс', subtitle:'Обычно используем порог 0.5, но его можно менять', scene:scene7},
        {title:'Шаг 8. Применяем модель', subtitle:'Новое письмо → вероятность спама → класс', scene:scene8}
      ];
      let currentStep=0;
      function renderStep(){
        const step=steps[currentStep];
        $('lgi-title').textContent=step.title;
        $('lgi-subtitle').textContent=step.subtitle;
        $('lgi-counter').textContent=`${currentStep+1} из ${steps.length}`;
        $('lgi-scene').innerHTML=step.scene;
        $('lgi-prevGroup').style.display=currentStep===0?'none':'block';
        $('lgi-nextText').textContent=currentStep===steps.length-1?'↻':'Далее';
      }
      function nextStep(){ currentStep = currentStep < steps.length-1 ? currentStep+1 : 0; renderStep(); }
      function prevStep(){ if(currentStep>0){ currentStep--; renderStep(); } }
      $('lgi-nextBtn').addEventListener('click', nextStep);
      $('lgi-prevBtn').addEventListener('click', prevStep);
      svg.tabIndex=0;
      svg.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight') nextStep(); if(e.key==='ArrowLeft') prevStep(); });
      renderStep();
    })();
  ]]></script>
</svg>
</div>
</figure>

> **Важно:** логистическая регрессия не пытается напрямую предсказать 0 или 1. Она предсказывает вероятность. Класс появляется уже после выбора порога: например, если вероятность выше 0.5 — относим к классу 1.

### Функция потерь — почему не MSE

Для регрессии мы брали MSE — средний квадрат ошибки. Для классификации хочется взять её же, но это плохая идея сразу по двум причинам.

1. **Несоразмерные штрафы.** Пусть правильный ответ `y = 1`, а модель уверенно выдала `a = 0.01`. MSE даст ошибку `(1 − 0.01)² ≈ 0.98` — много, но не «катастрофически». А ведь модель сейчас уверенно ошиблась в самом важном случае, и такие провалы хочется штрафовать почти **бесконечно сильно**.
2. **Плохая геометрия для спуска.** В паре с сигмоидой MSE даёт невыпуклую функцию потерь с плоскими участками — градиентный спуск там еле ползёт и легко застревает.

Правильная функция потерь для бинарной классификации — **binary cross-entropy** (BCE), она же лог-лосс:

$$\mathrm{BCE} = -\dfrac{1}{n}\sum_{i} \bigl[\, y_i \ln(a_i) + (1 - y_i)\ln(1 - a_i) \,\bigr]$$

Выглядит страшнее, чем есть. Для одного примера сумма распадается на два случая: если `y = 1`, остаётся `−ln(a)` — чем ближе `a` к единице, тем меньше потеря; если `y = 0`, остаётся `−ln(1 − a)`, всё зеркально. Когда модель уверенно ошибается, логарифм уносит потерю в бесконечность — ровно тот «бесконечный штраф», которого не хватало MSE. Посмотрим, как BCE дорастает до нужного поведения:

<figure class="embedded-interactive" id="section-interactive-2">
  <div class="interactive-meta">Интерактив 2</div>
  <p class="interactive-desc">Почему функция потерь — BCE, а не MSE</p>
<div class="interactive-svg-wrap">
<svg id="vizLoss" viewBox="0 0 960 680" width="100%" role="img" aria-label="Почему BCE, а не MSE">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    svg .tick { stroke: #5E5850; stroke-width: 1; }
    svg .tickLabel { font-size: 13px; fill: #5E5850; text-anchor: middle; }
    svg .tickLabelL { font-size: 13px; fill: #5E5850; text-anchor: end; dominant-baseline: middle; }
    svg .axisTitle { font-size: 14px; fill: #5E5850; text-anchor: middle; }
    svg .axisTitleV { font-size: 14px; fill: #5E5850; text-anchor: middle; }
    svg .grid { stroke: #E0DDD3; stroke-width: 0.6; stroke-dasharray: 3 3; }
    svg .curveMSE { fill: none; stroke: #C29E08; stroke-width: 2.5; stroke-dasharray: 5 4; }
    svg .curveBCE { fill: none; stroke: #73B222; stroke-width: 3; }
    svg .curveBCE0 { fill: none; stroke: #3576C0; stroke-width: 3; }
    svg .ptHL { fill: #C30B0A; stroke: #C30B0A; stroke-width: 1.5; }
    svg .ptOK { fill: #73B222; stroke: #73B222; stroke-width: 1.5; }
    svg .label { font-size: 14px; fill: #111111; }
    svg .labelMuted { font-size: 14px; fill: #5E5850; }
    svg .formula { font-family: 'Courier New', Courier, monospace; font-size: 17px; fill: #111111; }
    svg .formulaBig { font-family: 'Courier New', Courier, monospace; font-size: 20px; fill: #111111; font-weight: bold; }
    svg .calloutBox { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.5; rx: 10; }
    svg .calloutBoxOK { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.5; rx: 10; }
    svg .calloutBoxBlue { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; rx: 10; }
    svg .calloutBoxNeutral { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.2; rx: 10; }

    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                         text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                    text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .counter { font-size: 16px; fill: #5E5850; }
  </style>

  <text id="vl-title" x="36" y="48" class="title"></text>
  <text id="vl-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="vl-scene"></g>

  <text id="vl-counter" x="36" y="635" class="counter"></text>

  <g id="vl-prevGroup">
    <rect id="vl-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="vl-nextGroup">
    <rect id="vl-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="vl-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      // Cost plot: x in [180..760] for p̂ in [0..1], y in [150..540] for cost in [0..5]
      const AXES_COST = `
        <line class="axis" x1="180" y1="540" x2="760" y2="540"/>
        <line class="axis" x1="180" y1="150" x2="180" y2="540"/>
        <line class="tick" x1="180" y1="540" x2="180" y2="546"/>
        <line class="tick" x1="470" y1="540" x2="470" y2="546"/>
        <line class="tick" x1="760" y1="540" x2="760" y2="546"/>
        <text class="tickLabel" x="180" y="562">0</text>
        <text class="tickLabel" x="470" y="562">0.5</text>
        <text class="tickLabel" x="760" y="562">1</text>
        <line class="tick" x1="174" y1="540" x2="180" y2="540"/>
        <line class="tick" x1="174" y1="462" x2="180" y2="462"/>
        <line class="tick" x1="174" y1="384" x2="180" y2="384"/>
        <line class="tick" x1="174" y1="306" x2="180" y2="306"/>
        <line class="tick" x1="174" y1="228" x2="180" y2="228"/>
        <line class="tick" x1="174" y1="150" x2="180" y2="150"/>
        <text class="tickLabelL" x="168" y="540">0</text>
        <text class="tickLabelL" x="168" y="462">1</text>
        <text class="tickLabelL" x="168" y="384">2</text>
        <text class="tickLabelL" x="168" y="306">3</text>
        <text class="tickLabelL" x="168" y="228">4</text>
        <text class="tickLabelL" x="168" y="150">5</text>
        <text class="axisTitle" x="470" y="592">предсказанная вероятность p̂</text>
        <text class="axisTitleV" x="120" y="345" transform="rotate(-90 120 345)">штраф (loss)</text>
      `;

      // -log(p̂) path
      const NEGLOG_PATH = "M192,181 L209,235 L238,361 L296,415 L354,446 L470,486 L586,512 L702,532 L754,539 L760,540";
      // -log(1-p̂) path (mirror)
      const NEGLOG_REV  = "M180,540 L186,539 L238,532 L354,512 L470,486 L586,446 L644,415 L702,361 L731,306 L748,235 L754,181";
      // MSE (1-p̂)^2 for y=1: (0,1)->(1,0) — peak cost 1 → y_pixel = 540-78 = 462
      const MSE_Y1 = "M180,462 L238,470 L296,481 L354,495 L412,508 L470,520 L528,529 L586,535 L644,538 L702,540 L760,540";

      const steps = [
        // ---------- STEP 1: setup ----------
        {
          title: "Шаг 1. Что мы хотим измерять",
          subtitle: "Расстояние между предсказанием p̂ и истинной меткой y",
          scene: `
            <rect class="calloutBoxNeutral" x="120" y="140" width="720" height="100"/>
            <text class="label" x="140" y="170">Модель выдаёт <tspan font-family="Courier New, Courier, monospace">p̂ ∈ (0, 1)</tspan> — вероятность того, что класс = 1.</text>
            <text class="label" x="140" y="194">Реальная метка <tspan font-family="Courier New, Courier, monospace">y ∈ {0, 1}</tspan>.</text>
            <text class="label" x="140" y="222">Нужно <tspan font-weight="700">одно число</tspan>, говорящее «насколько модель ошиблась» — и градиент по нему.</text>

            <line class="axis" x1="160" y1="430" x2="800" y2="430"/>
            <line class="tick" x1="160" y1="430" x2="160" y2="438"/>
            <line class="tick" x1="480" y1="430" x2="480" y2="438"/>
            <line class="tick" x1="800" y1="430" x2="800" y2="438"/>
            <text class="tickLabel" x="160" y="456">0</text>
            <text class="tickLabel" x="480" y="456">0.5</text>
            <text class="tickLabel" x="800" y="456">1</text>

            <circle class="ptOK" cx="800" cy="430" r="11"/>
            <text class="label" x="770" y="408" fill="#5a8c1c">y = 1</text>

            <circle cx="380" cy="430" r="9" fill="#3576C0" stroke="#3576C0"/>
            <text class="label" x="345" y="412" fill="#2a5e9b">p̂ = 0.35</text>

            <path d="M395,430 L785,430" stroke="#C30B0A" stroke-width="2" stroke-dasharray="6 4" fill="none"/>
            <text class="label" x="555" y="488" fill="#C30B0A" text-anchor="middle">расстояние = ?</text>
          `
        },
        // ---------- STEP 2: MSE example ----------
        {
          title: "Шаг 2. Попробуем MSE",
          subtitle: "Считаем (y − p̂)² — как мы делали для регрессии",
          scene: `
            <rect class="calloutBoxNeutral" x="100" y="150" width="350" height="180"/>
            <text class="label" x="120" y="180"><tspan font-weight="700">Уверенно правильно:</tspan></text>
            <text class="formula" x="120" y="208">y = 1,  p̂ = 0.99</text>
            <text class="formula" x="120" y="232">(1 − 0.99)² = 0.0001</text>
            <text class="label" x="120" y="262" fill="#5a8c1c">✓ Маленький штраф — логично.</text>
            <circle class="ptOK" cx="395" cy="225" r="14"/>

            <rect class="calloutBox" x="510" y="150" width="350" height="180"/>
            <text class="label" x="530" y="180"><tspan font-weight="700">Уверенно неправильно:</tspan></text>
            <text class="formula" x="530" y="208">y = 1,  p̂ = 0.01</text>
            <text class="formula" x="530" y="232">(1 − 0.01)² = 0.98</text>
            <text class="label" x="530" y="262" fill="#C30B0A">⚠ Всего 0.98 — несоразмерно мало.</text>
            <circle class="ptHL" cx="805" cy="225" r="14"/>

            <rect class="calloutBoxNeutral" x="100" y="370" width="760" height="100"/>
            <text class="label" x="120" y="402">Модель уверенно ошиблась в самом важном случае,</text>
            <text class="label" x="120" y="426">а штраф меньше единицы. Хочется наказывать такие провалы</text>
            <text class="label" x="120" y="450"><tspan font-weight="700">бесконечно сильно</tspan> — чтобы спуск тащил их обратно агрессивно.</text>
          `
        },
        // ---------- STEP 3: desired vs MSE shape ----------
        {
          title: "Шаг 3. Какая форма штрафа нам нужна",
          subtitle: "MSE убывает мягко. Нужно — взрывной рост у нуля",
          scene: `
            ${AXES_COST}
            <path class="curveMSE" d="${MSE_Y1}"/>
            <text class="label" x="350" y="490" fill="#C29E08">MSE: (1 − p̂)²</text>
            <text class="labelMuted" x="350" y="510">«катастрофы» едва штрафует</text>

            <path class="curveBCE" d="${NEGLOG_PATH}"/>
            <text class="label" x="290" y="280" fill="#5a8c1c"><tspan font-weight="700">−log(p̂)</tspan> — то, что нам нужно</text>
            <text class="labelMuted" x="290" y="302">→ ∞ при p̂ → 0</text>

            <text class="labelMuted" x="380" y="610" text-anchor="middle">(оба графика для случая y = 1)</text>
          `
        },
        // ---------- STEP 4: y=1 case ----------
        {
          title: "Шаг 4. Случай y = 1",
          subtitle: "Штраф = −log(p̂)",
          scene: `
            ${AXES_COST}
            <path class="curveBCE" d="${NEGLOG_PATH}"/>

            <circle class="ptOK" cx="754" cy="539" r="7"/>
            <text class="labelMuted" x="710" y="528">p̂ = 1 → 0</text>

            <circle class="ptOK" cx="470" cy="486" r="7"/>
            <text class="labelMuted" x="480" y="478">p̂ = 0.5 → 0.69</text>

            <circle class="ptHL" cx="209" cy="235" r="7"/>
            <text class="label" x="220" y="240" fill="#C30B0A">p̂ → 0 → штраф → ∞</text>

            <rect class="calloutBoxOK" x="510" y="170" width="320" height="100"/>
            <text class="formulaBig" x="530" y="206">L = −log(p̂)</text>
            <text class="label" x="530" y="238">При y = 1: уверенно правильно — почти 0,</text>
            <text class="label" x="530" y="258">уверенно неправильно — бесконечность.</text>
          `
        },
        // ---------- STEP 5: y=0 case (mirror) ----------
        {
          title: "Шаг 5. Случай y = 0",
          subtitle: "Зеркальный штраф = −log(1 − p̂)",
          scene: `
            ${AXES_COST}
            <path class="curveBCE0" d="${NEGLOG_REV}"/>

            <circle class="ptOK" cx="186" cy="539" r="7"/>
            <text class="labelMuted" x="195" y="528">p̂ = 0 → 0</text>

            <circle class="ptOK" cx="470" cy="486" r="7"/>
            <text class="labelMuted" x="385" y="478">p̂ = 0.5 → 0.69</text>

            <circle class="ptHL" cx="731" cy="306" r="7"/>
            <text class="label" x="565" y="304" fill="#C30B0A" text-anchor="end">p̂ → 1 → штраф → ∞</text>

            <rect class="calloutBoxBlue" x="220" y="170" width="380" height="100"/>
            <text class="formulaBig" x="240" y="206">L = −log(1 − p̂)</text>
            <text class="label" x="240" y="238">При y = 0: всё то же самое, только</text>
            <text class="label" x="240" y="258">зеркально относительно p̂ = 0.5.</text>
          `
        },
        // ---------- STEP 6: BCE one formula ----------
        {
          title: "Шаг 6. Бинарная кросс-энтропия — одна формула",
          subtitle: "Один из двух случаев включается множителем",
          scene: `
            <rect class="calloutBoxOK" x="60" y="160" width="840" height="100"/>
            <text class="formulaBig" x="80" y="202">L = −[ y · log(p̂)  +  (1 − y) · log(1 − p̂) ]</text>
            <text class="label" x="80" y="232">y = 1: остаётся только −log(p̂). y = 0: остаётся только −log(1 − p̂).</text>
            <text class="label" x="80" y="252">Одна формула на оба случая — никаких if-ов.</text>

            <text class="label" x="60" y="320"><tspan font-weight="700">На батче из n примеров:</tspan></text>
            <rect class="calloutBoxBlue" x="60" y="340" width="840" height="80"/>
            <text class="formulaBig" x="80" y="382">BCE = −(1/n) · Σᵢ [ yᵢ·log(p̂ᵢ) + (1 − yᵢ)·log(1 − p̂ᵢ) ]</text>

            <text class="labelMuted" x="60" y="460">Это и есть лосс, который мы будем минимизировать градиентным спуском.</text>
            <text class="labelMuted" x="60" y="482">Выпуклая по параметрам, наказывает уверенные ошибки бесконечно.</text>
          `
        }
      ];

      let currentStep = 0;

      function renderStep() {
        const step = steps[currentStep];
        $("vl-title").textContent = step.title;
        $("vl-subtitle").textContent = step.subtitle;
        $("vl-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("vl-scene").innerHTML = step.scene;

        $("vl-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("vl-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
      }

      function nextStep() {
        if (currentStep < steps.length - 1) currentStep++;
        else currentStep = 0;
        renderStep();
      }

      function prevStep() {
        if (currentStep > 0) currentStep--;
        renderStep();
      }

      $("vl-nextBtn").addEventListener("click", nextStep);
      $("vl-prevBtn").addEventListener("click", prevStep);

      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  ]]></script>
</svg>
</div>
</figure>

---

## Часть 2. Как найти лучшую границу — градиентный спуск

Теперь вопрос такой же, как в линейной регрессии: как найти хорошие `w₁`, `w₂` и `b`? Только теперь мы минимизируем не MSE, а binary cross-entropy.

Интуиция не меняется. Параметры задают границу. Для каждого набора параметров можно посчитать loss. Если loss большой — граница плохая. Если loss маленький — граница хорошо разделяет классы и выдаёт правильные вероятности.

Градиентный спуск делает то же самое: смотрит, как loss меняется при небольшом изменении параметра, и сдвигает параметр в сторону уменьшения ошибки.

<figure class="embedded-interactive" id="section-interactive-3">
  <div class="interactive-meta">Интерактив 3</div>
  <p class="interactive-desc">Градиентный спуск для логистической регрессии</p>
<div class="interactive-svg-wrap">
<svg id="logRegGD" viewBox="0 0 960 680" width="100%" role="img" aria-label="Градиентный спуск для логистической регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .text { font-size: 16px; fill: #111111; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .label { font-size: 13px; fill: #111111; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; }
    svg .grid { stroke: #ECECEC; stroke-width: 1; }
    svg .mono { font-family: 'Courier New', Courier, monospace; }
    svg .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    svg .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    svg .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }
    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="lggd-title" x="36" y="48" class="title"></text>
  <text id="lggd-subtitle" x="36" y="78" class="subtitle"></text>
  <g id="lggd-scene"></g>
  <text id="lggd-counter" x="36" y="635" class="text"></text>

  <g id="lggd-prevGroup">
    <rect id="lggd-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>
  <g id="lggd-nextGroup">
    <rect id="lggd-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="lggd-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function(){
      const svg=svgRoot;
      const $=(id)=>svg.getElementById(id);
      const wStar=1.25;
      const L=(w)=>0.55*(w-wStar)**2 + 0.18;
      const dL=(w)=>1.10*(w-wStar);
      const X0=480,X1=900,Y0=540,Y1=170,wMin=-0.3,wMax=2.1,lMax=1.55;
      const xPx=(w)=>X0+(w-wMin)/(wMax-wMin)*(X1-X0);
      const yPx=(l)=>Y0-l/lMax*(Y0-Y1);
      const arrowDefs=`<defs>
        <marker id="lggd-arr-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/></marker>
        <marker id="lggd-arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#73B222"/></marker>
        <marker id="lggd-arr-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/></marker>
      </defs>`;
      function axes(){
        let s='';
        [0.2,0.6,1.0,1.4].forEach(l=>{ const yp=yPx(l); s+=`<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`; s+=`<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${l.toFixed(1)}</text>`; });
        [-0.2,0.5,1.25,2.0].forEach(w=>{ const xp=xPx(w); s+=`<line x1="${xp}" y1="${Y0}" x2="${xp}" y2="${Y1}" class="grid"/>`; s+=`<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${w.toFixed(w===1.25?2:1)}</text>`; });
        s+=`<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s+=`<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s+=`<text x="${(X0+X1)/2}" y="${Y0+38}" text-anchor="middle" class="label" style="font-weight:700;">w₁  (один параметр модели)</text>`;
        s+=`<text x="${X0-36}" y="${Y1-10}" class="label" style="font-weight:700;fill:#C30B0A;">BCE loss</text>`;
        return s;
      }
      function curve(color='#3576C0', sw=2.8){
        let p='';
        for(let w=wMin;w<=wMax+1e-9;w+=0.025){ const l=L(w); p+=`${p?'L':'M'} ${xPx(w).toFixed(1)} ${yPx(l).toFixed(1)} `; }
        return `<path d="${p}" fill="none" stroke="${color}" stroke-width="${sw}"/>`;
      }
      function point(w,color='#C29E08',r=8){ return `<circle cx="${xPx(w)}" cy="${yPx(L(w))}" r="${r}" fill="${color}" stroke="#fff" stroke-width="2"/>`; }
      function tangent(w,color='#C30B0A',span=0.35){
        const l=L(w), m=dL(w); const a=Math.max(w-span,wMin), b=Math.min(w+span,wMax);
        return `<line x1="${xPx(a)}" y1="${yPx(l+m*(a-w))}" x2="${xPx(b)}" y2="${yPx(l+m*(b-w))}" stroke="${color}" stroke-width="2.8"/>`;
      }
      const wInit=-0.10;
      const alpha=0.7;
      const wNext=wInit-alpha*dL(wInit);
      function trajectory(){
        let s='', w=wInit, arr=[]; for(let i=0;i<7;i++){ arr.push(w); w=w-0.65*dL(w); }
        for(let i=0;i<arr.length-1;i++) s+=`<line x1="${xPx(arr[i])+7}" y1="${yPx(L(arr[i]))}" x2="${xPx(arr[i+1])-7}" y2="${yPx(L(arr[i+1]))}" stroke="#C29E08" stroke-width="2.4" marker-end="url(#lggd-arr-yellow)"/>`;
        arr.forEach((w,i)=>{ const last=i===arr.length-1; s+=`<circle cx="${xPx(w)}" cy="${yPx(L(w))}" r="${last?8:6}" fill="${last?'#73B222':'#C29E08'}" stroke="#fff" stroke-width="2"/>`; });
        return s;
      }
      function mini(type){
        const mX0= type==='big'?490:740, mX1=type==='big'?670:920, mY0=530, mY1=240;
        const xp=(w)=>mX0+(w-wMin)/(wMax-wMin)*(mX1-mX0); const yp=(l)=>mY0-l/lMax*(mY0-mY1);
        let s=`<rect x="${mX0-30}" y="${mY1-50}" width="${mX1-mX0+50}" height="${mY0-mY1+85}" fill="#fff" stroke="${type==='big'?'#C30B0A':'#C29E08'}" rx="12"/>`;
        s+=`<text x="${(mX0+mX1)/2+10}" y="${mY1-30}" text-anchor="middle" class="text" style="font-size:14px;font-weight:800;fill:${type==='big'?'#C30B0A':'#C29E08'};">${type==='big'?'α слишком большое':'α слишком маленькое'}</text>`;
        s+=`<line x1="${mX0}" y1="${mY0}" x2="${mX1}" y2="${mY0}" class="axis"/><line x1="${mX0}" y1="${mY0}" x2="${mX0}" y2="${mY1}" class="axis"/>`;
        let p=''; for(let w=wMin;w<=wMax;w+=0.03){p+=`${p?'L':'M'} ${xp(w).toFixed(1)} ${yp(L(w)).toFixed(1)} `;} s+=`<path d="${p}" fill="none" stroke="#3576C0" stroke-width="2"/>`;
        let arr=[], w=wInit; const lr=type==='big'?1.6:0.09; for(let i=0;i<(type==='big'?5:6);i++){arr.push(w); w=w-lr*dL(w);}
        for(let i=0;i<arr.length-1;i++){ const a=Math.max(wMin,Math.min(wMax,arr[i])), b=Math.max(wMin,Math.min(wMax,arr[i+1])); s+=`<line x1="${xp(a)}" y1="${yp(Math.min(L(arr[i]),lMax))}" x2="${xp(b)}" y2="${yp(Math.min(L(arr[i+1]),lMax))}" stroke="${type==='big'?'#C30B0A':'#C29E08'}" stroke-width="2"/>`; }
        arr.forEach(w=>{ const c=Math.max(wMin,Math.min(wMax,w)); s+=`<circle cx="${xp(c)}" cy="${yp(Math.min(L(w),lMax))}" r="5" fill="${type==='big'?'#C30B0A':'#C29E08'}" stroke="#fff" stroke-width="1.5"/>`; });
        return s;
      }
      const scene1=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-blue"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Loss как функция параметра</text>
        <text x="60" y="192" class="text">У логистической регрессии</text>
        <text x="60" y="214" class="text">есть параметры w₁, w₂ и b.</text>
        <text x="60" y="252" class="text">Для картинки зафиксируем</text>
        <text x="60" y="274" class="text">w₂ и b, а меняем только w₁.</text>
        <rect x="60" y="305" width="340" height="72" class="box-blue"/>
        ${kxFO(230, 333, 'L(w_1) = \\operatorname{mean}\\,\\mathrm{BCE}\\bigl(\\sigma(w_1x_1 + w_2x_2 + b),\\, y\\bigr)', {align:'middle', size:12, color:'#111111', w:338})}
        <text x="230" y="358" text-anchor="middle" class="small">loss зависит от w₁</text>
        <text x="60" y="418" class="text">Цель — найти w₁,</text>
        <text x="60" y="440" class="text" style="font-weight:800;fill:#73B222;">где BCE минимальный.</text>
      </g><g>${axes()}${curve()}${point(wStar,'#73B222',9)}<line x1="${xPx(wStar)}" y1="${yPx(L(wStar))}" x2="${xPx(wStar)}" y2="${Y0}" stroke="#73B222" stroke-dasharray="4 4"/><text x="${xPx(wStar)}" y="${yPx(L(wStar))-16}" text-anchor="middle" class="label" style="fill:#73B222;font-weight:800;">минимум</text></g>`;
      const scene2=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-yellow"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Случайный старт</text>
        <text x="60" y="195" class="text">Изначально параметры</text>
        <text x="60" y="217" class="text">обычно неудачные.</text>
        <rect x="60" y="246" width="340" height="58" class="box-yellow"/>
        <text x="230" y="274" text-anchor="middle" class="text mono">w₁⁽⁰⁾ = −0.10</text>
        <text x="230" y="294" text-anchor="middle" class="small">стартовая точка</text>
        <text x="60" y="348" class="text">Loss большой:</text>
        <text x="60" y="376" class="text" style="font-weight:800;fill:#C30B0A;">граница пока плохо</text>
        <text x="60" y="398" class="text" style="font-weight:800;fill:#C30B0A;">разделяет классы.</text>
      </g><g>${axes()}${curve()}${point(wInit,'#C29E08',9)}<line x1="${xPx(wInit)}" y1="${yPx(L(wInit))}" x2="${xPx(wInit)}" y2="${Y0}" stroke="#C29E08" stroke-dasharray="4 4"/><text x="${xPx(wInit)}" y="${yPx(L(wInit))-14}" text-anchor="middle" class="label" style="fill:#C29E08;font-weight:800;">мы здесь</text></g>`;
      const scene3=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-red"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Slope — наклон loss</text>
        <text x="60" y="192" class="text">Производная показывает,</text>
        <text x="60" y="214" class="text">как loss изменится, если</text>
        <text x="60" y="236" class="text">чуть сдвинуть w₁.</text>
        <rect x="60" y="266" width="340" height="72" class="box-red"/>
        ${kxFO(230, 294, '\\mathrm{slope} = \\frac{\\partial L}{\\partial w_1}', {align:'middle', size:15, color:'#111111', w:280})}
        <text x="230" y="318" text-anchor="middle" class="small">в точке w₁=−0.10: slope &lt; 0</text>
        <text x="60" y="382" class="text">Минус означает:</text>
        <text x="60" y="410" class="text" style="font-weight:800;fill:#C30B0A;">если идти вправо,</text>
        <text x="60" y="432" class="text" style="font-weight:800;fill:#C30B0A;">loss будет падать.</text>
      </g><g>${axes()}${curve()}${tangent(wInit)}${point(wInit,'#C29E08',9)}<text x="${xPx(wInit)+95}" y="${yPx(L(wInit))-48}" class="small" style="fill:#C30B0A;font-weight:800;">касательная</text></g>`;
      const arrowY=Y0-38, xCur=xPx(wInit);
      const scene4=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-blue"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Градиент = куда loss растёт</text>
        <text x="60" y="195" class="text">Градиент указывает</text>
        <text x="60" y="217" class="text" style="font-weight:800;fill:#C30B0A;">в сторону роста loss.</text>
        <text x="60" y="260" class="text">Но нам нужно наоборот:</text>
        <text x="60" y="284" class="text" style="font-weight:800;fill:#73B222;">идти против градиента.</text>
        <rect x="60" y="320" width="340" height="72" class="box-green"/>
        ${kxFO(230, 350, 'w_1 \\leftarrow w_1 - \\alpha \\cdot \\frac{\\partial L}{\\partial w_1}', {align:'middle', size:15, color:'#5BA017', w:300})}
        <text x="230" y="374" text-anchor="middle" class="small">то же правило, что и в линейной регрессии</text>
      </g><g>${axes()}${curve()}${point(wInit,'#C29E08',9)}
        <line x1="${xCur-6}" y1="${arrowY}" x2="${xCur-86}" y2="${arrowY}" stroke="#C30B0A" stroke-width="3.2" marker-end="url(#lggd-arr-red)"/>
        <text x="${xCur-48}" y="${arrowY-12}" text-anchor="middle" class="label" style="fill:#C30B0A;font-weight:800;">градиент</text>
        <line x1="${xCur+6}" y1="${arrowY}" x2="${xCur+86}" y2="${arrowY}" stroke="#73B222" stroke-width="3.2" marker-end="url(#lggd-arr-green)"/>
        <text x="${xCur+48}" y="${arrowY-12}" text-anchor="middle" class="label" style="fill:#73B222;font-weight:800;">−градиент</text></g>`;
      const scene5=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-yellow"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Один шаг обновления</text>
        <text x="60" y="195" class="text">Берём текущий w₁,</text>
        <text x="60" y="217" class="text">вычитаем learning rate</text>
        <text x="60" y="239" class="text">умноженный на градиент.</text>
        <rect x="60" y="268" width="340" height="68" class="box-yellow"/>
        ${kxFO(230, 296, 'w_1 \\leftarrow w_1 - \\alpha \\cdot \\frac{\\partial L}{\\partial w_1}', {align:'middle', size:15, color:'#111111', w:300})}
        <text x="230" y="318" text-anchor="middle" class="small">α контролирует размер шага</text>
        <text x="60" y="382" class="text">После шага loss стал меньше.</text>
        <text x="60" y="410" class="text" style="font-weight:800;fill:#73B222;">Параметр стал лучше.</text>
      </g><g>${axes()}${curve()}${point(wInit,'#E2C77A',7)}<line x1="${xPx(wInit)+8}" y1="${yPx(L(wInit))}" x2="${xPx(wNext)-8}" y2="${yPx(L(wNext))}" stroke="#73B222" stroke-width="3" marker-end="url(#lggd-arr-green)"/>${point(wNext,'#73B222',9)}<text x="${xPx(wNext)}" y="${yPx(L(wNext))-14}" text-anchor="middle" class="label" style="fill:#73B222;font-weight:800;">шаг</text></g>`;
      const scene6=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-green"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Повторяем много раз</text>
        <text x="60" y="195" class="text">Каждый шаг немного</text>
        <text x="60" y="217" class="text">сдвигает границу.</text>
        <text x="60" y="260" class="text">Loss уменьшается,</text>
        <text x="60" y="282" class="text">потому что вероятности</text>
        <text x="60" y="304" class="text">становятся ближе к меткам.</text>
        <rect x="60" y="340" width="340" height="96" class="box-green"/>
        <text x="78" y="366" class="small">итерация 1: forward → loss → backward → update</text>
        <text x="78" y="390" class="small">итерация 2: снова то же самое</text>
        <text x="78" y="414" class="small">итерация N: пришли к минимуму</text>
        <text x="60" y="480" class="text" style="font-weight:800;fill:#73B222;">Так обучается классификатор.</text>
      </g><g>${axes()}${curve()}${trajectory()}</g>`;
      const scene7=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-red"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Learning rate α</text>
        <text x="60" y="195" class="text">α решает, насколько</text>
        <text x="60" y="217" class="text">большие шаги делать.</text>
        <rect x="60" y="252" width="340" height="62" class="box-red"/>
        <text x="78" y="278" class="text" style="font-weight:800;fill:#C30B0A;">слишком большое α</text>
        <text x="78" y="300" class="small">можем перепрыгнуть минимум</text>
        <rect x="60" y="334" width="340" height="62" class="box-yellow"/>
        <text x="78" y="360" class="text" style="font-weight:800;fill:#C29E08;">слишком маленькое α</text>
        <text x="78" y="382" class="small">будем учиться очень медленно</text>
        <rect x="60" y="416" width="340" height="62" class="box-green"/>
        <text x="78" y="442" class="text" style="font-weight:800;fill:#73B222;">нормальное α</text>
        <text x="78" y="464" class="small">loss плавно снижается</text>
      </g><g>${mini('big')}${mini('small')}</g>`;
      const scene8=`${arrowDefs}<g>
        <rect x="40" y="120" width="380" height="395" class="box-green"/>
        <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Минимум</text>
        <text x="60" y="195" class="text">В минимуме наклон</text>
        <text x="60" y="217" class="text">почти равен нулю.</text>
        <rect x="60" y="248" width="340" height="68" class="box-green"/>
        ${kxFO(230, 276, '\\frac{\\partial L}{\\partial w_1} \\approx 0', {align:'middle', size:15, color:'#5BA017', w:260})}
        <text x="230" y="300" text-anchor="middle" class="small">шаги становятся очень маленькими</text>
        <text x="60" y="365" class="text">Модель нашла параметры,</text>
        <text x="60" y="387" class="text">которые дают маленькую</text>
        <text x="60" y="409" class="text">cross-entropy на данных.</text>
        <text x="60" y="468" class="text" style="font-weight:800;fill:#73B222;">Граница обучена.</text>
      </g><g>${axes()}${curve()}<line x1="${xPx(wStar)-60}" y1="${yPx(L(wStar))}" x2="${xPx(wStar)+60}" y2="${yPx(L(wStar))}" stroke="#73B222" stroke-width="3"/>${point(wStar,'#73B222',10)}<line x1="${xPx(wStar)}" y1="${yPx(L(wStar))}" x2="${xPx(wStar)}" y2="${Y0}" stroke="#73B222" stroke-dasharray="4 4"/><text x="${xPx(wStar)}" y="${yPx(L(wStar))-18}" text-anchor="middle" class="label" style="fill:#73B222;font-weight:800;">минимум</text></g>`;
      const steps=[
        {title:'Шаг 1. BCE как функция параметра',subtitle:'Меняем один параметр w₁ и смотрим, как меняется loss',scene:scene1},
        {title:'Шаг 2. Случайный старт',subtitle:'Начальная граница обычно плохая — loss высокий',scene:scene2},
        {title:'Шаг 3. Считаем наклон',subtitle:'Производная показывает локальное направление изменения loss',scene:scene3},
        {title:'Шаг 4. Идём против градиента',subtitle:'Градиент показывает рост; для минимума идём в обратную сторону',scene:scene4},
        {title:'Шаг 5. Обновляем параметр',subtitle:'w₁ ← w₁ − α · ∂L/∂w₁',scene:scene5},
        {title:'Шаг 6. Повторяем',subtitle:'Каждая итерация делает границу чуть лучше',scene:scene6},
        {title:'Шаг 7. Размер шага α',subtitle:'Слишком большой шаг опасен, слишком маленький медленный',scene:scene7},
        {title:'Шаг 8. Пришли в минимум',subtitle:'Градиент почти ноль — параметры обучены',scene:scene8}
      ];
      let currentStep=0;
      function renderStep(){ const step=steps[currentStep]; $('lggd-title').textContent=step.title; $('lggd-subtitle').textContent=step.subtitle; $('lggd-counter').textContent=`${currentStep+1} из ${steps.length}`; $('lggd-scene').innerHTML=step.scene; $('lggd-prevGroup').style.display=currentStep===0?'none':'block'; $('lggd-nextText').textContent=currentStep===steps.length-1?'↻':'Далее'; }
      function nextStep(){ currentStep=currentStep<steps.length-1?currentStep+1:0; renderStep(); }
      function prevStep(){ if(currentStep>0){currentStep--; renderStep();} }
      $('lggd-nextBtn').addEventListener('click',nextStep); $('lggd-prevBtn').addEventListener('click',prevStep); svg.tabIndex=0; svg.addEventListener('keydown',(e)=>{ if(e.key==='ArrowRight') nextStep(); if(e.key==='ArrowLeft') prevStep(); }); renderStep();
    })();
  ]]></script>
</svg>
</div>
</figure>

> **Разница с линейной регрессией:** в линейной регрессии мы часто минимизируем MSE по непрерывному таргету. В логистической регрессии мы минимизируем BCE по бинарной метке, а производная для пары sigmoid + BCE красиво упрощается до `a − y`.

---

## Часть 3. Backpropagation — градиент для каждого параметра

Теперь разложим один объект на вычислительный граф. Это полезно, потому что именно так устроен backpropagation: сначала идём слева направо и сохраняем промежуточные значения, затем идём справа налево и считаем градиенты.

Возьмём один пример: `x₁=2`, `x₂=3`, `y=1`; стартовые веса `w₁=0.5`, `w₂=−0.5`, `b=0.5`. Модель: `z = w₁x₁ + w₂x₂ + b`, `a = σ(z)`, loss: `BCE(a, y)`.

### Forward pass

<figure class="embedded-interactive" id="section-interactive-4">
  <div class="interactive-meta">Интерактив 4</div>
  <p class="interactive-desc">Forward pass: вычислительный граф</p>
<div class="interactive-svg-wrap">
<svg id="lrForward" viewBox="0 0 960 680" width="100%" role="img" aria-label="Forward pass логистической регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .counter { font-size: 15px; fill: #5E5850; }
    svg .node-label { font-size: 17px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .op-label   { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    svg .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    svg .desc       { font-size: 15px; fill: #111111; }
    svg .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    svg .param-circle { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    svg .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 6; }
    svg .op-box-active{ fill: #FFE7A3; stroke: #C29E08; stroke-width: 3.5; rx: 6; }
    svg .arrow        { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    svg .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrF" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
  </defs>

  <text id="fTitle" x="36" y="48" class="title"></text>
  <text id="fSubtitle" x="36" y="76" class="subtitle"></text>

  <g id="fScene"></g>

  <text id="fCounter" x="36" y="635" class="counter"></text>

  <g id="fPrevGroup">
    <rect id="fPrevBtn" x="640" y="600" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="624" class="btn-text-secondary">←</text>
  </g>

  <g id="fNextGroup">
    <rect id="fNextBtn" x="712" y="600" width="208" height="48" class="btn"/>
    <text id="fNextText" x="816" y="624" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      function graphSVG(state) {
        const active = state.active || "";
        const v = state.values || {};
        const show = (val) => (val === undefined || val === null) ? "" : val;
        const opCls = (id) => (active === id) ? "op-box-active" : "op-box";

        return `
          <line x1="104" y1="170" x2="166" y2="170" class="arrow" marker-end="url(#arrF)"/>
          <polyline points="232,170 360,170 360,241" class="arrow" fill="none" marker-end="url(#arrF)"/>
          <line x1="104" y1="270" x2="166" y2="270" class="arrow" marker-end="url(#arrF)"/>
          <line x1="232" y1="270" x2="331" y2="270" class="arrow" marker-end="url(#arrF)"/>
          <line x1="360" y1="386" x2="360" y2="299" class="arrow" marker-end="url(#arrF)"/>
          <line x1="387" y1="270" x2="436" y2="270" class="arrow" marker-end="url(#arrF)"/>
          <line x1="502" y1="270" x2="541" y2="270" class="arrow" marker-end="url(#arrF)"/>
          <line x1="580" y1="386" x2="580" y2="299" class="arrow" marker-end="url(#arrF)"/>
          <line x1="617" y1="270" x2="685" y2="270" class="arrow" marker-end="url(#arrF)"/>
          <text x="700" y="276" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          <circle cx="80"  cy="170" r="24" class="input-circle"/>
          <text   x="80"   y="170" class="node-label">x₁</text>
          <circle cx="80"  cy="270" r="24" class="input-circle"/>
          <text   x="80"   y="270" class="node-label">x₂</text>
          <circle cx="360" cy="410" r="24" class="param-circle"/>
          <text   x="360"  y="410" class="node-label">b</text>
          <circle cx="580" cy="410" r="24" class="input-circle"/>
          <text   x="580"  y="410" class="node-label">y</text>

          <rect x="168" y="150" width="64" height="40" class="${opCls('mw1')}"/>
          <text x="200" y="170" class="op-label">×w₁</text>
          <rect x="168" y="250" width="64" height="40" class="${opCls('mw2')}"/>
          <text x="200" y="270" class="op-label">×w₂</text>
          <rect x="333" y="243" width="54" height="54" class="${opCls('add')}"/>
          <text x="360" y="270" class="op-label" style="font-size:22px;">+</text>
          <rect x="438" y="243" width="64" height="54" class="${opCls('sig')}"/>
          <text x="470" y="270" class="op-label" style="font-size:20px;">σ</text>
          <rect x="543" y="243" width="74" height="54" class="${opCls('bce')}"/>
          <text x="580" y="270" class="op-label" style="font-size:15px;">BCE</text>

          <text x="80"  y="130" class="green">${show(v.x1)}</text>
          <text x="80"  y="230" class="green">${show(v.x2)}</text>
          <text x="360" y="463" class="green">${show(v.b)}</text>
          <text x="580" y="463" class="green">${show(v.y)}</text>
          <text x="200" y="135" class="green">${show(v.m1)}</text>
          <text x="200" y="235" class="green">${show(v.m2)}</text>
          <text x="360" y="230" class="green">${show(v.z)}</text>
          <text x="470" y="230" class="green">${show(v.a)}</text>
          <text x="580" y="230" class="green">${show(v.ell)}</text>

          <text x="305" y="162" class="edge-label">m₁</text>
          <text x="282" y="263" class="edge-label">m₂</text>
          <text x="412" y="263" class="edge-label">z</text>
          <text x="522" y="263" class="edge-label">a</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Постановка задачи",
          subtitle: "Логистическая регрессия с двумя признаками",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "1", b: "0.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="516" class="desc"><tspan font-weight="700">Модель:</tspan> z = w₁·x₁ + w₂·x₂ + b,  a = σ(z),  ℓ = −[y·ln(a) + (1−y)·ln(1−a)]</text>
              <text x="56" y="540" class="desc"><tspan font-weight="700">Данные:</tspan> x₁=2, x₂=3, y=1 (бинарная метка «положительный класс»)</text>
              <text x="56" y="564" class="desc"><tspan font-weight="700">Параметры:</tspan> w₁=0.5, w₂=−0.5, b=0.5 (синяя b — параметр, серые x₁/x₂/y — фиксированные данные)</text>
            `
          }
        },
        {
          title: "Шаг 1. Считаем m₁ = w₁ · x₁",
          subtitle: "Первый признак умножается на свой вес",
          state: {
            active: "mw1",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> для каждого признака — отдельная линейная «весовая» операция.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">m₁ = w₁ · x₁ = 0.5 · 2 = <tspan fill="#73B222" font-weight="800">1.0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 2. Считаем m₂ = w₂ · x₂",
          subtitle: "Второй признак умножается на свой вес",
          state: {
            active: "mw2",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0", m2: "−1.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> то же самое для второго признака.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">m₂ = w₂ · x₂ = (−0.5) · 3 = <tspan fill="#73B222" font-weight="800">−1.5</tspan></text>
            `
          }
        },
        {
          title: "Шаг 3. Считаем z = m₁ + m₂ + b",
          subtitle: "Суммируем взвешенные признаки и сдвиг — это линейная часть",
          state: {
            active: "add",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0", m2: "−1.5", z: "0" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> складываем все слагаемые в одно число — это «логит» z.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">z = m₁ + m₂ + b = 1.0 + (−1.5) + 0.5 = <tspan fill="#73B222" font-weight="800">0</tspan></text>
            `
          }
        },
        {
          title: "Шаг 4. Применяем сигмоиду: a = σ(z)",
          subtitle: "Превращаем логит в вероятность класса 1",
          state: {
            active: "sig",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0", m2: "−1.5", z: "0", a: "0.5" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Что делаем:</tspan> σ(z) = 1 / (1 + e⁻ᶻ) — сжимаем число в интервал (0, 1).</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">a = σ(0) = 1/(1+1) = <tspan fill="#73B222" font-weight="800">0.5</tspan>  — модель уверена ровно на 50%.</text>
            `
          }
        },
        {
          title: "Шаг 5. Считаем потерю: ℓ = BCE(a, y)",
          subtitle: "Binary cross-entropy — насколько предсказание далеко от метки",
          state: {
            active: "bce",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0", m2: "−1.5", z: "0", a: "0.5", ell: "0.693" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">ℓ = −[ y·ln(a) + (1−y)·ln(1−a) ]. При y=1 упрощается до ℓ = −ln(a).</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">ℓ = −ln(0.5) ≈ <tspan fill="#73B222" font-weight="800">0.693</tspan>  — ошибка есть, надо обновлять веса.</text>
            `
          }
        },
        {
          title: "Шаг 6. Forward pass завершён",
          subtitle: "Все промежуточные значения сохранены — они понадобятся для backward",
          state: {
            active: "",
            values: { x1: "2", x2: "3", y: "1", b: "0.5", m1: "1.0", m2: "−1.5", z: "0", a: "0.5", ell: "0.693" },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="518" class="desc"><tspan font-weight="700">Итог:</tspan> предсказание a = 0.5 при истинной метке y = 1, потеря ℓ ≈ 0.693.</text>
              <text x="56" y="546" class="desc">Каждый зелёный промежуточный результат хранится в памяти — на backward pass</text>
              <text x="56" y="568" class="desc">они нужны для подсчёта производных по цепному правилу.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("fTitle").textContent = s.title;
        $("fSubtitle").textContent = s.subtitle;
        $("fCounter").textContent = `${i + 1} из ${steps.length}`;
        $("fScene").innerHTML = graphSVG(s.state);
        $("fPrevGroup").style.display = i === 0 ? "none" : "block";
        $("fNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("fNextBtn").addEventListener("click", next);
      $("fPrevBtn").addEventListener("click", prev);
      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft")  prev();
      });
      render();
    })();
  ]]></script>
</svg>
</div>
</figure>

### Backward pass

<figure class="embedded-interactive" id="section-interactive-5">
  <div class="interactive-meta">Интерактив 5</div>
  <p class="interactive-desc">Backward pass: обратное распространение</p>
<div class="interactive-svg-wrap">
<svg id="lrBackward" viewBox="0 0 960 680" width="100%" role="img" aria-label="Backward pass логистической регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .counter { font-size: 15px; fill: #5E5850; }
    svg .node-label { font-size: 17px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .op-label   { font-size: 16px; font-weight: 700; fill: #111111; text-anchor: middle; dominant-baseline: middle; }
    svg .green      { font-size: 15px; font-weight: 800; fill: #73B222; text-anchor: middle; }
    svg .red        { font-size: 15px; font-weight: 800; fill: #C30B0A; text-anchor: middle; }
    svg .edge-label { font-size: 12px; fill: #5E5850; text-anchor: middle; }
    svg .desc       { font-size: 15px; fill: #111111; }
    svg .input-circle { fill: #ffffff; stroke: #5E5850; stroke-width: 1.6; }
    svg .param-circle { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    svg .op-box       { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; rx: 6; }
    svg .op-box-active{ fill: #FFE9E9; stroke: #C30B0A; stroke-width: 3.5; rx: 6; }
    svg .arrow        { stroke: #5E5850; stroke-width: 1.6; fill: none; }
    svg .arrow-back   { stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    svg .btn          { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary{ fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text     { font-size: 17px; font-weight: 800; fill: #ffffff; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <defs>
    <marker id="arrB" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#5E5850"/>
    </marker>
    <marker id="arrBR" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 z" fill="#C30B0A"/>
    </marker>
  </defs>

  <text id="bTitle" x="36" y="48" class="title"></text>
  <text id="bSubtitle" x="36" y="76" class="subtitle"></text>

  <g id="bScene"></g>

  <text id="bCounter" x="36" y="635" class="counter"></text>

  <g id="bPrevGroup">
    <rect id="bPrevBtn" x="640" y="600" width="56" height="48" class="btn-secondary"/>
    <text x="668" y="624" class="btn-text-secondary">←</text>
  </g>

  <g id="bNextGroup">
    <rect id="bNextBtn" x="712" y="600" width="208" height="48" class="btn"/>
    <text id="bNextText" x="816" y="624" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      function graphSVG(state) {
        const active = state.active || "";
        const g = state.grads || {};
        const show = (val) => (val === undefined || val === null) ? "" : val;
        const flow = state.flow || {};
        const opCls = (id) => (active === id) ? "op-box-active" : "op-box";

        const back = (id, x1, y1, x2, y2) => flow[id]
          ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="arrow-back" marker-end="url(#arrBR)"/>`
          : "";
        const backPoly = (id, pts) => flow[id]
          ? `<polyline points="${pts}" class="arrow-back" fill="none" marker-end="url(#arrBR)"/>`
          : "";

        return `
          <line x1="104" y1="170" x2="166" y2="170" class="arrow" marker-end="url(#arrB)"/>
          <polyline points="232,170 360,170 360,241" class="arrow" fill="none" marker-end="url(#arrB)"/>
          <line x1="104" y1="270" x2="166" y2="270" class="arrow" marker-end="url(#arrB)"/>
          <line x1="232" y1="270" x2="331" y2="270" class="arrow" marker-end="url(#arrB)"/>
          <line x1="360" y1="386" x2="360" y2="299" class="arrow" marker-end="url(#arrB)"/>
          <line x1="387" y1="270" x2="436" y2="270" class="arrow" marker-end="url(#arrB)"/>
          <line x1="502" y1="270" x2="541" y2="270" class="arrow" marker-end="url(#arrB)"/>
          <line x1="580" y1="386" x2="580" y2="299" class="arrow" marker-end="url(#arrB)"/>
          <line x1="617" y1="270" x2="685" y2="270" class="arrow" marker-end="url(#arrB)"/>
          <text x="700" y="276" style="font-size:20px; font-style:italic; fill:#111;">ℓ</text>

          ${back('bce_in', 690, 285, 619, 285)}
          ${back('sig_in', 545, 285, 504, 285)}
          ${back('add_in', 440, 285, 389, 285)}
          ${back('mw2_in', 333, 285, 234, 285)}
          ${backPoly('mw1_in', '370,243 370,160 234,160')}
          ${back('b_in',   370, 299, 370, 388)}

          <circle cx="80"  cy="170" r="24" class="input-circle"/>
          <text   x="80"   y="170" class="node-label">x₁</text>
          <circle cx="80"  cy="270" r="24" class="input-circle"/>
          <text   x="80"   y="270" class="node-label">x₂</text>
          <circle cx="360" cy="410" r="24" class="param-circle"/>
          <text   x="360"  y="410" class="node-label">b</text>
          <circle cx="580" cy="410" r="24" class="input-circle"/>
          <text   x="580"  y="410" class="node-label">y</text>

          <rect x="168" y="150" width="64" height="40" class="${opCls('mw1')}"/>
          <text x="200" y="170" class="op-label">×w₁</text>
          <rect x="168" y="250" width="64" height="40" class="${opCls('mw2')}"/>
          <text x="200" y="270" class="op-label">×w₂</text>
          <rect x="333" y="243" width="54" height="54" class="${opCls('add')}"/>
          <text x="360" y="270" class="op-label" style="font-size:22px;">+</text>
          <rect x="438" y="243" width="64" height="54" class="${opCls('sig')}"/>
          <text x="470" y="270" class="op-label" style="font-size:20px;">σ</text>
          <rect x="543" y="243" width="74" height="54" class="${opCls('bce')}"/>
          <text x="580" y="270" class="op-label" style="font-size:15px;">BCE</text>

          <text x="80"  y="130" class="green">2</text>
          <text x="80"  y="230" class="green">3</text>
          <text x="360" y="463" class="green">0.5</text>
          <text x="580" y="463" class="green">1</text>
          <text x="200" y="135" class="green">1.0</text>
          <text x="200" y="235" class="green">−1.5</text>
          <text x="344" y="225" class="green">0</text>
          <text x="470" y="230" class="green">0.5</text>
          <text x="580" y="230" class="green">0.693</text>

          <text x="650" y="306" class="red">${show(g.dL)}</text>
          <text x="523" y="306" class="red">${show(g.da)}</text>
          <text x="412" y="306" class="red">${show(g.dz)}</text>
          <text x="282" y="306" class="red">${show(g.dm2)}</text>
          <text x="305" y="195" class="red">${show(g.dm1)}</text>
          <text x="395" y="345" class="red" text-anchor="start">${show(g.db)}</text>
          <text x="200" y="212" class="red">${show(g.dw1)}</text>
          <text x="200" y="312" class="red">${show(g.dw2)}</text>

          <text x="305" y="143" class="edge-label">m₁</text>
          <text x="282" y="263" class="edge-label">m₂</text>
          <text x="412" y="263" class="edge-label">z</text>
          <text x="522" y="263" class="edge-label">a</text>

          ${state.descSVG || ""}
        `;
      }

      const steps = [
        {
          title: "Шаг 0. Зачем нужен backward pass",
          subtitle: "Хотим знать, как меняется потеря при шевелении каждого параметра",
          state: {
            active: "",
            grads: {},
            flow: {},
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="516" class="desc"><tspan font-weight="700">Цель:</tspan> найти ∂ℓ/∂w₁, ∂ℓ/∂w₂, ∂ℓ/∂b — градиенты по обучаемым параметрам.</text>
              <text x="56" y="540" class="desc"><tspan font-weight="700">Инструмент:</tspan> цепное правило. Идём от выхода ℓ к входам и накапливаем производные.</text>
              <text x="56" y="564" class="desc">Зелёные числа сверху — то, что мы посчитали на forward pass; они нам понадобятся.</text>
            `
          }
        },
        {
          title: "Шаг 1. Старт: ∂ℓ/∂ℓ = 1",
          subtitle: "Производная выхода по самому себе тривиально равна единице",
          state: {
            active: "",
            grads: { dL: "1" },
            flow: { bce_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="520" class="desc"><tspan font-weight="700">Идея:</tspan> backward pass всегда стартует с градиента «1» на выходе.</text>
              <text x="56" y="552" class="desc">Эта единица — затравка, которая дальше будет умножаться на локальные производные каждой операции.</text>
            `
          }
        },
        {
          title: "Шаг 2. Через BCE: ∂ℓ/∂a",
          subtitle: "Берём производную бинарной кросс-энтропии по предсказанию a",
          state: {
            active: "bce",
            grads: { dL: "1", da: "−2" },
            flow: { bce_in: true, sig_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">∂ℓ/∂a = −y/a + (1−y)/(1−a). При y = 1: ∂ℓ/∂a = −1/a.</text>
              <text x="56" y="552" class="desc" style="font-size:19px;">∂ℓ/∂a = −1 / 0.5 = <tspan fill="#C30B0A" font-weight="800">−2</tspan></text>
            `
          }
        },
        {
          title: "Шаг 3. Через сигмоиду: ∂ℓ/∂z",
          subtitle: "Локальная производная σ'(z) = a·(1−a) — и появляется красивое сокращение",
          state: {
            active: "sig",
            grads: { dL: "1", da: "−2", dz: "−0.5" },
            flow: { bce_in: true, sig_in: true, add_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">∂ℓ/∂z = ∂ℓ/∂a · σ'(z) = (−2) · a(1−a) = (−2) · 0.5 · 0.5 = <tspan fill="#C30B0A" font-weight="800">−0.5</tspan></text>
              <text x="56" y="552" class="desc"><tspan font-weight="700">Сокращение:</tspan> при паре σ + BCE всегда получается просто ∂ℓ/∂z = a − y = 0.5 − 1 = −0.5.</text>
            `
          }
        },
        {
          title: "Шаг 4. Через «+»: градиент копируется",
          subtitle: "Сложение пропускает градиент во все три входа без изменения",
          state: {
            active: "add",
            grads: { dL: "1", da: "−2", dz: "−0.5", dm1: "−0.5", dm2: "−0.5", db: "−0.5" },
            flow: { bce_in: true, sig_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">z = m₁ + m₂ + b ⇒ ∂z/∂m₁ = ∂z/∂m₂ = ∂z/∂b = 1.</text>
              <text x="56" y="552" class="desc">Поэтому ∂ℓ/∂m₁ = ∂ℓ/∂m₂ = ∂ℓ/∂b = <tspan fill="#C30B0A" font-weight="800">−0.5</tspan>. Один из трёх искомых градиентов (по b) уже найден.</text>
            `
          }
        },
        {
          title: "Шаг 5. Через «×»: градиенты по w₁ и w₂",
          subtitle: "В умножении локальная производная по одному входу равна второму входу",
          state: {
            active: "mw1",
            grads: { dL: "1", da: "−2", dz: "−0.5", dm1: "−0.5", dm2: "−0.5", db: "−0.5", dw1: "−1.0", dw2: "−1.5" },
            flow: { bce_in: true, sig_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#FAFAF7" stroke="#5E5850" stroke-opacity="0.25" rx="8"/>
              <text x="56" y="518" class="desc">m₁ = w₁·x₁ ⇒ ∂m₁/∂w₁ = x₁. Значит ∂ℓ/∂w₁ = (−0.5) · 2 = <tspan fill="#C30B0A" font-weight="800">−1.0</tspan>.</text>
              <text x="56" y="552" class="desc">Аналогично ∂ℓ/∂w₂ = (−0.5) · 3 = <tspan fill="#C30B0A" font-weight="800">−1.5</tspan>. Все три градиента найдены — backward pass окончен.</text>
            `
          }
        },
        {
          title: "Шаг 6. Обновляем параметры (шаг градиентного спуска)",
          subtitle: "Идём в сторону, противоположную градиенту: θ ← θ − η · ∇θ",
          state: {
            active: "",
            grads: { dL: "1", da: "−2", dz: "−0.5", dm1: "−0.5", dm2: "−0.5", db: "−0.5", dw1: "−1.0", dw2: "−1.5" },
            flow: { bce_in: true, sig_in: true, add_in: true, mw1_in: true, mw2_in: true, b_in: true },
            descSVG: `
              <rect x="36" y="490" width="888" height="92" fill="#F0FAF0" stroke="#73B222" stroke-width="1.4" rx="8"/>
              <text x="56" y="514" class="desc">С learning rate η = 0.1 обновляем:</text>
              <text x="56" y="538" class="desc">w₁ ← 0.5 − 0.1·(−1.0) = <tspan fill="#73B222" font-weight="800">0.6</tspan>; w₂ ← −0.5 − 0.1·(−1.5) = <tspan fill="#73B222" font-weight="800">−0.35</tspan>; b ← 0.5 − 0.1·(−0.5) = <tspan fill="#73B222" font-weight="800">0.55</tspan></text>
              <text x="56" y="568" class="desc">Новое предсказание: z' = 0.7, a' ≈ 0.668, ℓ' ≈ 0.40 — потеря упала с 0.693. Так учится модель.</text>
            `
          }
        }
      ];

      let i = 0;
      function render() {
        const s = steps[i];
        $("bTitle").textContent = s.title;
        $("bSubtitle").textContent = s.subtitle;
        $("bCounter").textContent = `${i + 1} из ${steps.length}`;
        $("bScene").innerHTML = graphSVG(s.state);
        $("bPrevGroup").style.display = i === 0 ? "none" : "block";
        $("bNextText").textContent = i === steps.length - 1 ? "↻" : "Далее";
      }
      function next(){ i = (i < steps.length - 1) ? i + 1 : 0; render(); }
      function prev(){ if (i > 0) { i--; render(); } }
      $("bNextBtn").addEventListener("click", next);
      $("bPrevBtn").addEventListener("click", prev);
      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft")  prev();
      });
      render();
    })();
  ]]></script>
</svg>
</div>
</figure>

### Та же идея в матричной форме

На практике модель почти никогда не обучается на одном объекте за раз. Обычно мы берём батч: сразу несколько строк данных. Тогда формулы становятся матричными.

Если `X` — матрица размера `N × d`, `w` — вектор `d × 1`, а `y` — вектор меток, то forward pass записывается так:

$$\begin{aligned} z &= Xw + b \\[2pt] a &= \sigma(z) \\[2pt] L &= \operatorname{mean}\bigl(\mathrm{BCE}(a, y)\bigr) \end{aligned}$$

Backward pass в компактной форме:

$$\begin{aligned} dz &= \tfrac{1}{N}\,(a - y) \\[2pt] dw &= X^{\mathsf{T}} \cdot dz \\[2pt] db &= \operatorname{sum}(dz) \end{aligned}$$

<figure class="embedded-interactive" id="section-interactive-6">
  <div class="interactive-meta">Интерактив 6</div>
  <p class="interactive-desc">Та же идея в матричной форме (батч)</p>
<div class="interactive-svg-wrap">
<svg id="lrMat" viewBox="0 0 960 680" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif">
  <style>
    svg .data-cell  { fill: #F3F1EE; stroke: #5E5850; stroke-width: 1; }
    svg .param-cell { fill: #E8F0F7; stroke: #3576C0; stroke-width: 1.2; }
    svg .fwd-cell   { fill: #EDF7DD; stroke: #73B222; stroke-width: 1.2; }
    svg .bwd-cell   { fill: #FDE6E6; stroke: #C30B0A; stroke-width: 1.2; }
    svg .empty-cell { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; stroke-dasharray: 3,2; }

    svg .active-fwd { fill: #DBF0AE; stroke: #5C8E1B; stroke-width: 2; }
    svg .active-bwd { fill: #FBD0D0; stroke: #A1090A; stroke-width: 2; }

    svg .data-text  { fill: #5E5850; font-size: 14px; font-weight: 500; }
    svg .param-text { fill: #3576C0; font-size: 14px; font-weight: 600; }
    svg .fwd-text   { fill: #4C8316; font-size: 14px; font-weight: 600; }
    svg .bwd-text   { fill: #A1090A; font-size: 14px; font-weight: 600; }
    svg .empty-text { fill: #C9C2B8; font-size: 14px; }

    svg .label   { fill: #5E5850; font-size: 13px; }
    svg .formula { fill: #5E5850; font-size: 14px; font-weight: 500; }
    svg .formula-active { fill: #B08F00; font-size: 14px; font-weight: 700; }
    svg .header  { fill: #5E5850; font-size: 15px; font-weight: 700; }
    svg .title   { fill: #5E5850; font-size: 16px; font-weight: 700; }
    svg .shape   { fill: #968F85; font-size: 11px; }

    svg .desc-bg { fill: #FAFAF8; stroke: #C9C2B8; stroke-width: 1; }
    svg .desc-text { fill: #5E5850; font-size: 13px; }

    svg .col-sep { stroke: #E5E1DA; stroke-width: 1; }

    svg .nav-btn  { cursor: pointer; }
    svg .nav-btn rect { fill: #C29E08; stroke: #C29E08; }
    svg .nav-btn:hover rect { fill: #A88800; }
    svg .nav-btn text { fill: #fff; font-size: 14px; font-weight: 600; pointer-events: none; }
    svg .nav-prev rect { fill: #fff; stroke: #5E5850; stroke-width: 1.2; }
    svg .nav-prev text { fill: #5E5850; font-size: 16px; }
    svg .counter { fill: #5E5850; font-size: 13px; }
  </style>

  <g id="lrMat-scene"></g>
  <g id="lrMat-nav"></g>
</svg>
</div>

<script>
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const sceneEl = document.getElementById('lrMat-scene');
  const navEl   = document.getElementById('lrMat-nav');

  // ============ Values (verified) ============
  const X      = [[2, 3], [1, 2], [3, 1]];
  const y_vec  = [1, 0, 1];
  const w_vec  = [0.5, -0.5];
  const b      = 0.5;

  const z_vec  = [0, 0, 1.5];
  const a_vec  = [0.5, 0.5, 0.818];
  const loss_v = 0.529;

  const dz_vec = [-0.167, 0.167, -0.061];
  const dw_vec = [-0.349, -0.227];
  const db_v   = -0.061;

  const w_new  = [0.535, -0.477];
  const b_new  = 0.506;

  // ============ SVG helpers ============
  function el(tag, attrs, ...kids) {
    const e = document.createElementNS(NS, tag);
    if (attrs) {
      for (const k in attrs) {
        if (attrs[k] != null) e.setAttribute(k, attrs[k]);
      }
    }
    for (const c of kids) {
      if (c == null) continue;
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    }
    return e;
  }
  function rect(x, y, w, h, cls) {
    return el('rect', { x, y, width: w, height: h, class: cls, rx: 2, ry: 2 });
  }
  function txt(x, y, content, cls, anchor) {
    return el('text', { x, y, class: cls, 'text-anchor': anchor || 'middle' }, String(content));
  }

  function brackets(x, y, w, h) {
    const s = '#5E5850', sw = 1.4;
    return [
      el('path', { d: `M ${x-3} ${y-2} L ${x-7} ${y-2} L ${x-7} ${y+h+2} L ${x-3} ${y+h+2}`,
                   fill: 'none', stroke: s, 'stroke-width': sw }),
      el('path', { d: `M ${x+w+3} ${y-2} L ${x+w+7} ${y-2} L ${x+w+7} ${y+h+2} L ${x+w+3} ${y+h+2}`,
                   fill: 'none', stroke: s, 'stroke-width': sw })
    ];
  }

  function fmt(v, d) {
    if (v === 0) return '0';
    if (Number.isInteger(v) && Math.abs(v) < 100) return String(v);
    let s = v.toFixed(d);
    s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    return s;
  }

  const CW = 38, CH = 28;

  function drawMatrix(g, x, y, rows, cols, values, fillCls, textCls, active, decimals) {
    decimals = decimals == null ? 3 : decimals;
    const empty = values == null;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cx = x + j * CW, cy = y + i * CH;
        const cls = empty ? 'empty-cell' : (active ? (active === 'fwd' ? 'active-fwd' : 'active-bwd') : fillCls);
        g.appendChild(rect(cx, cy, CW, CH, cls));
        if (!empty) {
          const v = values[i * cols + j];
          g.appendChild(txt(cx + CW/2, cy + CH/2 + 5, fmt(v, decimals), textCls));
        } else {
          g.appendChild(txt(cx + CW/2, cy + CH/2 + 5, '?', 'empty-text'));
        }
      }
    }
    brackets(x, y, cols * CW, rows * CH).forEach(b => g.appendChild(b));
  }

  function drawScalar(g, x, y, value, fillCls, textCls, active, decimals) {
    decimals = decimals == null ? 3 : decimals;
    const empty = value == null;
    const cw = 56, ch = 30;
    const cls = empty ? 'empty-cell' : (active ? (active === 'fwd' ? 'active-fwd' : 'active-bwd') : fillCls);
    g.appendChild(rect(x, y, cw, ch, cls));
    if (!empty) {
      g.appendChild(txt(x + cw/2, y + ch/2 + 5, fmt(value, decimals), textCls));
    } else {
      g.appendChild(txt(x + cw/2, y + ch/2 + 5, '?', 'empty-text'));
    }
  }

  // ============ Steps ============
  const steps = [
    {
      title: 'Постановка: батч N = 3, признаков d = 2',
      active: null,
      fwd: { z: false, a: false, loss: false },
      bwd: { dz: false, dw: false, db: false, upd: false },
      desc: [
        'X — матрица батча (3 примера × 2 признака), y — метки (3×1).',
        'w (2×1) и b (скаляр) — обучаемые параметры. Цель: за один проход',
        'посчитать loss и градиенты по всем N примерам сразу.'
      ]
    },
    {
      title: 'Линейный слой: z = X · w + b',
      active: 'z',
      fwd: { z: true, a: false, loss: false },
      bwd: { dz: false, dw: false, db: false, upd: false },
      desc: [
        'Одно матричное умножение даёт логиты для всех примеров сразу.',
        'z = X w + b = [2·0.5 + 3·(−0.5),  1·0.5 + 2·(−0.5),  3·0.5 + 1·(−0.5)]ᵀ + 0.5',
        '   = [−0.5,  −0.5,  1]ᵀ + 0.5  =  [0,  0,  1.5]ᵀ. Скаляр b прибавляется через broadcasting.'
      ]
    },
    {
      title: 'Активация: a = σ(z) — поэлементно',
      active: 'a',
      fwd: { z: true, a: true, loss: false },
      bwd: { dz: false, dw: false, db: false, upd: false },
      desc: [
        'Сигмоида работает покомпонентно: σ(0) = 0.5,  σ(1.5) ≈ 0.818.',
        'a — вероятности класса 1 для каждого примера батча, форма та же 3×1.'
      ]
    },
    {
      title: 'Loss: ℓ = (1/N) Σᵢ BCE(aᵢ, yᵢ)',
      active: 'loss',
      fwd: { z: true, a: true, loss: true },
      bwd: { dz: false, dw: false, db: false, upd: false },
      desc: [
        'BCE по каждому примеру: −ln(0.5), −ln(0.5), −ln(0.818)  ≈  0.693, 0.693, 0.201.',
        'Усредняем по батчу: ℓ = (0.693 + 0.693 + 0.201) / 3  ≈  0.529. Это один скаляр.'
      ]
    },
    {
      title: 'Backward, шаг 1: ∂ℓ/∂z = (1/N)(a − y)',
      active: 'dz',
      fwd: { z: true, a: true, loss: true },
      bwd: { dz: true, dw: false, db: false, upd: false },
      desc: [
        'Та же связка «σ + BCE  →  a − y» работает поэлементно, плюс множитель 1/N из-за',
        'усреднения в loss. dz = (1/3) · [0.5 − 1,  0.5 − 0,  0.818 − 1]ᵀ',
        '     = (1/3) · [−0.5,  0.5,  −0.182]ᵀ  ≈  [−0.167,  0.167,  −0.061]ᵀ.'
      ]
    },
    {
      title: 'Backward, шаг 2: ∂ℓ/∂w = Xᵀ · ∂ℓ/∂z',
      active: 'dw',
      fwd: { z: true, a: true, loss: true },
      bwd: { dz: true, dw: true, db: false, upd: false },
      desc: [
        'Xᵀ (2×3) «перегоняет» градиент с N примеров обратно на d параметров — это chain rule в матричной форме.',
        'dw[0] = 2·(−0.167) + 1·(0.167) + 3·(−0.061)  ≈  −0.349',
        'dw[1] = 3·(−0.167) + 2·(0.167) + 1·(−0.061)  ≈  −0.227.   Каждый вес j суммирует вклад по всем примерам.'
      ]
    },
    {
      title: 'Backward, шаг 3: ∂ℓ/∂b = Σᵢ (∂ℓ/∂z)ᵢ',
      active: 'db',
      fwd: { z: true, a: true, loss: true },
      bwd: { dz: true, dw: true, db: true, upd: false },
      desc: [
        'b одинаков для всех примеров (broadcast в forward), значит на backward он получает',
        'сумму градиентов по батчу: db = −0.167 + 0.167 + (−0.061) = −0.061.'
      ]
    },
    {
      title: 'Шаг градиентного спуска (η = 0.1)',
      active: 'upd',
      fwd: { z: true, a: true, loss: true },
      bwd: { dz: true, dw: true, db: true, upd: true },
      desc: [
        'w ← w − η · dw = [0.5, −0.5] − 0.1 · [−0.349, −0.227] = [0.535, −0.477].',
        'b ← b − η · db = 0.5 − 0.1 · (−0.061) = 0.506.',
        'Новый loss ≈ 0.513 (был 0.529) — потеря уменьшилась. В NumPy/PyTorch это буквально 5 строк кода.'
      ]
    }
  ];

  // ============ Layout ============
  // Column 1: data/params (x ~ 40-200)
  // Column 2: forward    (x ~ 260-540)
  // Column 3: backward   (x ~ 580-880)

  let i = 0;

  function render() {
    while (sceneEl.firstChild) sceneEl.removeChild(sceneEl.firstChild);
    while (navEl.firstChild)   navEl.removeChild(navEl.firstChild);

    const s = steps[i];

    // === Step title ===
    sceneEl.appendChild(txt(480, 32, s.title, 'title'));

    // === Column separators ===
    sceneEl.appendChild(el('line', { x1: 230, y1: 60, x2: 230, y2: 470, class: 'col-sep' }));
    sceneEl.appendChild(el('line', { x1: 560, y1: 60, x2: 560, y2: 470, class: 'col-sep' }));

    // === Column headers ===
    sceneEl.appendChild(txt(135, 78, 'Данные и параметры', 'header'));
    sceneEl.appendChild(txt(395, 78, 'Forward pass',       'header'));
    sceneEl.appendChild(txt(720, 78, 'Backward pass',      'header'));

    // ===== Column 1: data and params =====
    // X (3x2)
    sceneEl.appendChild(txt(60, 118, 'X =', 'label', 'end'));
    drawMatrix(sceneEl, 70, 100, 3, 2, [2,3,1,2,3,1], 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(108, 196, '(3 × 2) — батч', 'shape'));

    // y (3x1)
    sceneEl.appendChild(txt(60, 230, 'y =', 'label', 'end'));
    drawMatrix(sceneEl, 70, 212, 3, 1, [1,0,1], 'data-cell', 'data-text', null, 0);
    sceneEl.appendChild(txt(89, 308, '(3 × 1) — метки', 'shape'));

    // w (2x1)  - shows updated values on last step
    sceneEl.appendChild(txt(60, 342, 'w =', 'label', 'end'));
    const wActive = s.active === 'upd';
    drawMatrix(sceneEl, 70, 324, 2, 1, s.bwd.upd ? w_new : w_vec,
               'param-cell', 'param-text', wActive ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(89, 392, '(2 × 1)', 'shape'));

    // b (scalar)
    sceneEl.appendChild(txt(60, 420, 'b =', 'label', 'end'));
    drawScalar(sceneEl, 70, 405, s.bwd.upd ? b_new : b,
               'param-cell', 'param-text', wActive ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(98, 454, '(scalar)', 'shape'));

    // ===== Column 2: Forward =====
    // z
    const zHl = s.active === 'z';
    sceneEl.appendChild(kxFOEl(260, 110, 'z = X \\cdot w + b', { size: 15, color: zHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(280, 138, 'z =', 'label', 'end'));
    drawMatrix(sceneEl, 290, 120, 3, 1, s.fwd.z ? z_vec : null,
               'fwd-cell', 'fwd-text', zHl ? 'fwd' : null, 2);
    sceneEl.appendChild(txt(309, 216, '(3 × 1)', 'shape'));

    // a
    const aHl = s.active === 'a';
    sceneEl.appendChild(kxFOEl(260, 250, 'a = \\sigma(z)', { size: 15, color: aHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(280, 278, 'a =', 'label', 'end'));
    drawMatrix(sceneEl, 290, 260, 3, 1, s.fwd.a ? a_vec : null,
               'fwd-cell', 'fwd-text', aHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(309, 356, '(3 × 1)', 'shape'));

    // loss
    const lHl = s.active === 'loss';
    sceneEl.appendChild(kxFOEl(260, 390, '\\ell = \\dfrac{1}{N}\\,\\textstyle\\sum_i \\mathrm{BCE}(a_i, y_i)', { size: 14, color: lHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(280, 423, 'ℓ =', 'label', 'end'));
    drawScalar(sceneEl, 290, 408, s.fwd.loss ? loss_v : null,
               'fwd-cell', 'fwd-text', lHl ? 'fwd' : null, 3);
    sceneEl.appendChild(txt(318, 457, '(scalar)', 'shape'));

    // ===== Column 3: Backward =====
    // dz
    const dzHl = s.active === 'dz';
    sceneEl.appendChild(kxFOEl(580, 110, '\\dfrac{\\partial \\ell}{\\partial z} = \\dfrac{1}{N}(a - y)', { size: 15, color: dzHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(620, 138, '∂ℓ/∂z =', 'label', 'end'));
    drawMatrix(sceneEl, 630, 120, 3, 1, s.bwd.dz ? dz_vec : null,
               'bwd-cell', 'bwd-text', dzHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 216, '(3 × 1)', 'shape'));

    // dw
    const dwHl = s.active === 'dw';
    sceneEl.appendChild(kxFOEl(580, 250, '\\dfrac{\\partial \\ell}{\\partial w} = X^{\\mathsf{T}} \\cdot \\dfrac{\\partial \\ell}{\\partial z}', { size: 15, color: dwHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(620, 278, '∂ℓ/∂w =', 'label', 'end'));
    drawMatrix(sceneEl, 630, 260, 2, 1, s.bwd.dw ? dw_vec : null,
               'bwd-cell', 'bwd-text', dwHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(649, 328, '(2 × 1)', 'shape'));

    // db
    const dbHl = s.active === 'db';
    sceneEl.appendChild(kxFOEl(580, 362, '\\dfrac{\\partial \\ell}{\\partial b} = \\textstyle\\sum_i \\left(\\dfrac{\\partial \\ell}{\\partial z}\\right)_i', { size: 15, color: dbHl ? '#B08F00' : '#5E5850' }));
    sceneEl.appendChild(txt(620, 395, '∂ℓ/∂b =', 'label', 'end'));
    drawScalar(sceneEl, 630, 380, s.bwd.db ? db_v : null,
               'bwd-cell', 'bwd-text', dbHl ? 'bwd' : null, 3);
    sceneEl.appendChild(txt(658, 429, '(scalar)', 'shape'));

    // Update note appears when the update step is active
    if (s.bwd.upd) {
      sceneEl.appendChild(txt(580, 454, '↳ w, b обновлены слева (η = 0.1)',
                              'formula-active', 'start'));
    }

    // ===== Description box =====
    sceneEl.appendChild(rect(40, 490, 880, 95, 'desc-bg'));
    let dy = 511;
    for (const line of s.desc) {
      sceneEl.appendChild(txt(56, dy, line, 'desc-text', 'start'));
      dy += 20;
    }

    // ===== Navigation =====
    navEl.appendChild(txt(50, 645, `${i + 1} из ${steps.length}`, 'counter', 'start'));

    if (i > 0) {
      const prev = el('g', { class: 'nav-btn nav-prev' });
      prev.appendChild(rect(720, 622, 60, 36, ''));
      prev.appendChild(txt(750, 647, '←', '', 'middle'));
      prev.addEventListener('click', () => { i--; render(); });
      navEl.appendChild(prev);
    }

    const last = i === steps.length - 1;
    const next = el('g', { class: 'nav-btn' });
    next.appendChild(rect(790, 622, last ? 60 : 110, 36, ''));
    next.appendChild(txt(last ? 820 : 845, 646, last ? '↻' : 'Далее', '', 'middle'));
    next.addEventListener('click', () => { i = last ? 0 : i + 1; render(); });
    navEl.appendChild(next);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; render(); }
    else if (e.key === 'ArrowLeft' && i > 0)            { i--; render(); }
  });

  render();
})();
</script>
</figure>

> **Самая важная формула:** для логистической регрессии с sigmoid и BCE градиент по логиту получается очень простым: `dz = a − y`. Для батча добавляется усреднение: `dz = (1/N)(a − y)`. Дальше `dw = Xᵀdz` и `db = sum(dz)`.

---

## Часть 4. От таблицы к PyTorch — три версии одного и того же

Теперь соберём всё в код. Оговорка та же, что и для линейной регрессии: в реальных проектах данные не пишут руками — их читают из CSV или базы. Здесь мы **для наглядности** впишем маленький датасет писем прямо в код, чтобы было видно каждое число; путь от таблицы к numpy при этом ровно тот же, что и с настоящим файлом.

### Данные: список → pandas → numpy

Два признака — сколько в письме подозрительных слов и сколько ссылок — и бинарная метка `is_spam`. Кладём в pandas, а в numpy переводим только нужное: матрицу признаков `X` и вектор меток `y`.

```python
import numpy as np
import pandas as pd

# Шаг 1. Сырые данные. На практике сюда легли бы письма из CSV/БД.
emails = [
    {"spam_words": 0, "links": 0, "is_spam": 0},
    {"spam_words": 1, "links": 0, "is_spam": 0},
    {"spam_words": 0, "links": 1, "is_spam": 0},
    {"spam_words": 1, "links": 1, "is_spam": 0},
    {"spam_words": 2, "links": 0, "is_spam": 0},
    {"spam_words": 1, "links": 2, "is_spam": 0},
    {"spam_words": 2, "links": 1, "is_spam": 0},
    {"spam_words": 4, "links": 1, "is_spam": 0},   # выглядит спамно, но не спам
    {"spam_words": 2, "links": 2, "is_spam": 1},   # выглядит безобидно, но спам
    {"spam_words": 3, "links": 1, "is_spam": 1},
    {"spam_words": 2, "links": 3, "is_spam": 1},
    {"spam_words": 4, "links": 2, "is_spam": 1},
    {"spam_words": 3, "links": 3, "is_spam": 1},
    {"spam_words": 5, "links": 2, "is_spam": 1},
    {"spam_words": 4, "links": 4, "is_spam": 1},
    {"spam_words": 6, "links": 3, "is_spam": 1},
]

# Шаг 2. pandas-таблица — на неё удобно смотреть.
df = pd.DataFrame(emails)

# Шаг 3. В numpy достаём матрицу признаков X и вектор меток y.
X = df[["spam_words", "links"]].to_numpy(dtype=float)   # (n, 2)
y = df[["is_spam"]].to_numpy(dtype=float)               # (n, 1)
n = len(y)

# Признаки разного масштаба стандартизуем (метку 0/1 НЕ трогаем).
mu, sigma = X.mean(0), X.std(0)
Xs = (X - mu) / sigma
```

### Версия 1. Просто функции на numpy

«Голая» математика из Частей 1–3: `forward` прогоняет признаки через линейную часть и сигмоиду, BCE измеряет ошибку, а градиент, выведенный вручную, красиво сворачивается до `Xᵀ(a − y)`. Столбец единиц добавляем, чтобы свободный член `b` стал ещё одним весом.

```python
# Столбец единиц: предсказание = ОДНО матричное умножение + сигмоида.
Xb = np.hstack([Xs, np.ones((n, 1))])     # (n, 3); веса = [w₁, w₂, b]

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(Xb, w):                        # FORWARD: a = σ(X·w)
    return sigmoid(Xb @ w)

def bce(a, y):                             # LOSS: binary cross-entropy
    eps = 1e-9                             # чтобы не было log(0)
    return -np.mean(y * np.log(a + eps) + (1 - y) * np.log(1 - a + eps))

def gradient(Xb, y, w):                    # BACKWARD: ∂BCE/∂w = Xᵀ(a − y)/n
    a = forward(Xb, w)
    return Xb.T @ (a - y) / len(y)

# Тот самый цикл: forward -> loss -> backward -> update
w = np.zeros((3, 1))                       # старт из нуля
lr = 0.5                                   # learning rate — размер шага
for epoch in range(5000):
    w -= lr * gradient(Xb, y, w)           # UPDATE: w <- w − α · ∂L/∂w

proba = forward(Xb, w)                     # вероятности
pred = (proba > 0.5).astype(int)           # порог 0.5 -> класс
print(f"loss: {bce(proba, y):.3f}")        # 0.201
print(f"точность: {(pred == y).mean():.0%}")  # 88%  (2 спорных письма из 16)
```

> **Формулы «в одну строку» здесь нет.** У линейной регрессии минимум MSE можно было найти аналитически — нормальным уравнением `w = (XᵀX)⁻¹Xᵀy`. У логистической регрессии замкнутого решения *не существует*: из-за сигмоиды минимум BCE ищут только итеративно, градиентным спуском. Это первый момент в нашем пути, где «посчитать сразу» уже не выходит — и именно поэтому градиентный спуск так важен.

### Версия 2. Тот же код, но в объектном виде

Математика не меняется — складываем те же четыре шага в класс. Это мостик к PyTorch: там модель устроена точно так же (`forward`, параметры внутри объекта, цикл обучения снаружи).

```python
class LogisticRegression:
    def __init__(self, n_features):
        self.w = np.zeros((n_features, 1))   # вес по каждому признаку
        self.b = 0.0                         # свободный член

    def forward(self, X):                    # FORWARD: a = σ(X·w + b)
        return 1 / (1 + np.exp(-(X @ self.w + self.b)))

    def loss(self, a, y):                    # LOSS: BCE
        eps = 1e-9
        return -np.mean(y * np.log(a + eps) + (1 - y) * np.log(1 - a + eps))

    def backward(self, X, y, a):             # BACKWARD: всё через dz = a − y
        dz = a - y
        self.dw = X.T @ dz / len(y)          # ∂L/∂w
        self.db = float(dz.mean())           # ∂L/∂b

    def step(self, lr):                      # UPDATE: шаг против градиента
        self.w -= lr * self.dw
        self.b -= lr * self.db

    def fit(self, X, y, lr=0.5, epochs=5000):
        for _ in range(epochs):              # тот же цикл из 4 шагов
            a = self.forward(X)
            self.backward(X, y, a)
            self.step(lr)

model = LogisticRegression(n_features=2)
model.fit(Xs, y)
acc = ((model.forward(Xs) > 0.5) == y).mean()
print(f"точность: {acc:.0%}")                # 88%
```

### Версия 3. PyTorch — и почему он «решает быстро»

Цикл остаётся буквально тем же: forward → loss → backward → update. Но градиент больше не выводим руками — весь блок `backward` заменяется одной строкой `loss.backward()`. Один тонкий момент: `BCEWithLogitsLoss` ждёт **логиты** `z`, а не вероятности — сигмоиду она применяет внутри себя (так численно устойчивее). Поэтому модель выдаёт `z`, а сигмоиду мы навешиваем уже при предсказании.

```python
import torch
import torch.nn as nn

# Те же стандартизованные данные, только тензорами
Xt = torch.tensor(Xs, dtype=torch.float32)
yt = torch.tensor(y,  dtype=torch.float32)

model = nn.Linear(2, 1)                             # MODEL: логит z = X·w + b
loss_fn = nn.BCEWithLogitsLoss()                    # LOSS: сигмоида + BCE вместе
optimizer = torch.optim.SGD(model.parameters(), lr=0.5)  # правило UPDATE

for epoch in range(5000):
    optimizer.zero_grad()      # обнуляем градиенты прошлого шага
    z = model(Xt)              # FORWARD: логиты (без сигмоиды!)
    loss = loss_fn(z, yt)      # LOSS
    loss.backward()            # BACKWARD: ВСЕ градиенты автоматически (autograd)
    optimizer.step()           # UPDATE: w <- w − α · ∂L/∂w

proba = torch.sigmoid(model(Xt))                    # вероятности — сигмоида вручную
acc = ((proba > 0.5).float() == yt).float().mean()
print(f"точность: {acc:.0%}")                       # 88%
```

Все три версии сходятся к одной и той же границе: веса около **w₁ ≈ 2.4**, **w₂ ≈ 3.9**, **b ≈ 0.3** (в стандартизованном пространстве) и точность **88%**. Два спорных письма, которые мы специально посадили по «чужую» сторону, попадают в ошибки — это честный результат: данные не идеально разделимы, и так и должно быть. Разница между версиями не в ответе, а в том, сколько математики мы пишем руками: numpy — выводим градиент сами; PyTorch — описываем только *что* считаем (модель и loss), а *как* брать производные, autograd берёт на себя.

Два практических урока всплыли тут сами собой: данные приходят таблицей и проходят путь список → pandas → numpy, а признаки разного масштаба приходится стандартизовать, иначе градиентный спуск разлетается.

---

## Часть 5. Та же логика — для любой классификационной модели

Логистическая регрессия — это мост между простой линейной моделью и нейросетями. Она уже содержит почти все ключевые идеи классификации:

1. **Линейная часть** считает логит: `z = wᵀx + b`.
2. **Активация** превращает логит в вероятность: `a = σ(z)`.
3. **Loss** сравнивает вероятность с меткой: `BCE(a, y)`.
4. **Backward pass** считает, как изменить параметры, чтобы loss уменьшился.
5. **Update** делает шаг: `w ← w − α · dw`, `b ← b − α · db`.

Собранный в петлю, этот цикл и есть обучение логистической регрессии — нажми «Далее» и пройди его по шагам:

<figure class="embedded-interactive" id="section-interactive-7">
  <div class="interactive-meta">Интерактив 7</div>
  <p class="interactive-desc">Цикл обучения логистической регрессии</p>
<div class="interactive-svg-wrap">
<svg id="trainingLoopLogReg" viewBox="0 0 960 680" width="100%" role="img" aria-label="Цикл обучения логистической регрессии">
  <style>
    svg { background: #ffffff; font-family: Helvetica, Arial, sans-serif; }
    svg .title { font-size: 24px; font-weight: 800; fill: #111111; }
    svg .subtitle { font-size: 15px; fill: #5E5850; }
    svg .text { font-size: 16px; fill: #111111; }
    svg .small { font-size: 13px; fill: #5E5850; }
    svg .label { font-size: 13px; fill: #111111; }
    svg .mono { font-family: 'Courier New', Courier, monospace; }
    svg .axis { stroke: #5E5850; stroke-width: 1.2; }
    svg .grid { stroke: #ECECEC; stroke-width: 1; }

    svg .box-blue   { fill: #ffffff; stroke: #3576C0; stroke-width: 1.45; rx: 14; }
    svg .box-yellow { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.45; rx: 14; }
    svg .box-green  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.45; rx: 14; }
    svg .box-red    { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.45; rx: 14; }

    svg .btn { fill: #1b1d26; rx: 12; cursor: pointer; }
    svg .btn-secondary { fill: #ffffff; stroke: #1b1d26; stroke-width: 1.2; rx: 12; cursor: pointer; }
    svg .btn-text { font-size: 18px; font-weight: 800; fill: #ffffff;
                                     text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    svg .btn-text-secondary { font-size: 22px; font-weight: 800; fill: #1b1d26;
                                               text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  </style>

  <text id="tlog-title" x="36" y="48" class="title"></text>
  <text id="tlog-subtitle" x="36" y="78" class="subtitle"></text>

  <g id="tlog-scene"></g>

  <text id="tlog-counter" x="36" y="635" class="text"></text>

  <g id="tlog-prevGroup">
    <rect id="tlog-prevBtn" x="610" y="594" width="64" height="64" class="btn-secondary"/>
    <text x="642" y="627" class="btn-text-secondary">←</text>
  </g>

  <g id="tlog-nextGroup">
    <rect id="tlog-nextBtn" x="700" y="594" width="220" height="64" class="btn"/>
    <text id="tlog-nextText" x="810" y="627" class="btn-text">Далее</text>
  </g>

  <script><![CDATA[
    (function () {
      const svg = svgRoot;
      const $ = (id) => svg.getElementById(id);

      const arrowDefs = `
        <defs>
          <marker id="tlog-ar-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#3576C0"/>
          </marker>
          <marker id="tlog-ar-yellow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C29E08"/>
          </marker>
          <marker id="tlog-ar-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#C30B0A"/>
          </marker>
          <marker id="tlog-ar-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#5E5850"/>
          </marker>
        </defs>
      `;

      // --- BCE loss curve: starts at ln 2 ≈ 0.69 (веса = 0), падает к ≈0.20 ---
      // Плато на 0.20, а не на 0: в данных есть 2 противоречивых письма,
      // поэтому идеальная разделимость невозможна (реальный результат примера).
      function lossCurve() {
        const X0 = 510, X1 = 905, Y0 = 540, Y1 = 205;
        const LMAX = 0.7;
        const xpx = (i) => X0 + i / 5000 * (X1 - X0);
        const ypx = (l) => Y0 - Math.min(l, LMAX) / LMAX * (Y0 - Y1);
        let s = '';
        [0, 1250, 2500, 3750, 5000].forEach(i => {
          const xp = xpx(i);
          s += `<line x1="${xp}" y1="${Y1}" x2="${xp}" y2="${Y0}" class="grid"/>`;
          s += `<text x="${xp}" y="${Y0+18}" text-anchor="middle" class="small">${i}</text>`;
        });
        [0, 0.2, 0.4, 0.6].forEach(l => {
          const yp = ypx(l);
          s += `<line x1="${X0}" y1="${yp}" x2="${X1}" y2="${yp}" class="grid"/>`;
          s += `<text x="${X0-8}" y="${yp+4}" text-anchor="end" class="small">${l.toFixed(2)}</text>`;
        });
        s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="axis"/>`;
        s += `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" class="axis"/>`;
        s += `<text x="${(X0+X1)/2}" y="${Y0+40}" text-anchor="middle" class="label" style="font-weight:700;">эпохи обучения</text>`;
        s += `<text x="${X0-30}" y="${Y1-12}" class="label" style="font-weight:700;fill:#C30B0A;">BCE</text>`;
        let path = '';
        for (let i = 0; i <= 5000; i += 40) {
          const L = 0.20 + 0.49 * Math.exp(-i / 380);
          path += (path === '' ? 'M' : 'L') + ' ' + xpx(i).toFixed(1) + ' ' + ypx(L).toFixed(1) + ' ';
        }
        s += `<path d="${path}" fill="none" stroke="#C30B0A" stroke-width="2.6"/>`;
        // плато 0.20
        s += `<line x1="${X0}" y1="${ypx(0.20)}" x2="${X1}" y2="${ypx(0.20)}" stroke="#73B222" stroke-width="1.4" stroke-dasharray="5 4"/>`;
        s += `<text x="${xpx(2600)}" y="${ypx(0.20)-7}" text-anchor="middle" class="small" style="fill:#73B222;font-weight:700;">плато ≈ 0.20</text>`;
        const pts = [
          {i: 0,    L: 0.69, t: 'старт 0.69', c: '#C30B0A', a: 'start'},
          {i: 5000, L: 0.20, t: 'обучено 0.20', c: '#73B222', a: 'end'}
        ];
        pts.forEach(p => {
          s += `<circle cx="${xpx(p.i)}" cy="${ypx(p.L)}" r="6" fill="${p.c}" stroke="#fff" stroke-width="2"/>`;
          s += `<text x="${xpx(p.i) + (p.a==='start'?10:-10)}" y="${ypx(p.L)-12}" text-anchor="${p.a}" class="small" style="font-weight:700;fill:${p.c};">${p.t}</text>`;
        });
        return s;
      }

      // --- 2-классовый scatter: ham=зелёные кружки(0), spam=красные квадраты(1) ---
      // 16 писем (упрощённый фрагмент примера из статьи). 2 «спорных» —
      // противоречивые письма, которые любая прямая граница неизбежно путает.
      const SX0 = 510, SX1 = 905, SY0 = 540, SY1 = 205, sxMax = 6, syMax = 5;
      const sx = (x) => SX0 + x / sxMax * (SX1 - SX0);
      const sy = (y) => SY0 - y / syMax * (SY0 - SY1);
      const ham  = [[0.6,0.9],[1.1,1.3],[1.5,0.8],[2.0,1.7],[1.3,2.0],[2.4,1.1],[0.9,1.5]];
      const spam = [[3.2,3.1],[3.7,3.7],[4.2,2.8],[4.6,4.4],[4.0,4.0],[5.0,3.4],[5.4,4.0]];
      const missHam  = [4.0,1.0];  // письмо-ham, но много слов → попадает на сторону «спам»
      const missSpam = [2.2,1.9];  // письмо-spam, но признаки скромные → сторона «не спам»

      function scatterAxes() {
        let s = '';
        for (let g = 0; g <= sxMax; g += 1) {
          s += `<line x1="${sx(g)}" y1="${sy(0)}" x2="${sx(g)}" y2="${sy(syMax)}" class="grid"/>`;
          s += `<text x="${sx(g)}" y="${sy(0)+18}" text-anchor="middle" class="small">${g}</text>`;
        }
        for (let g = 0; g <= syMax; g += 1) {
          s += `<line x1="${sx(0)}" y1="${sy(g)}" x2="${sx(sxMax)}" y2="${sy(g)}" class="grid"/>`;
          s += `<text x="${sx(0)-8}" y="${sy(g)+4}" text-anchor="end" class="small">${g}</text>`;
        }
        s += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(sxMax)}" y2="${sy(0)}" class="axis"/>`;
        s += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(0)}" y2="${sy(syMax)}" class="axis"/>`;
        s += `<text x="${(sx(0)+sx(sxMax))/2}" y="${sy(0)+38}" text-anchor="middle" class="label">x₁: подозрительные слова</text>`;
        s += `<text x="${sx(0)-44}" y="${sy(syMax)-6}" class="label">x₂: ссылки</text>`;
        return s;
      }
      function hamMark(x, y, op) {
        return `<circle cx="${sx(x)}" cy="${sy(y)}" r="7" fill="#73B222" opacity="${op}" stroke="#fff" stroke-width="2"/>` +
               `<text x="${sx(x)}" y="${sy(y)+4}" text-anchor="middle" style="font-size:10px;font-weight:800;fill:#fff;">0</text>`;
      }
      function spamMark(x, y, op) {
        const w = 13;
        return `<rect x="${sx(x)-w/2}" y="${sy(y)-w/2}" width="${w}" height="${w}" rx="2" fill="#C30B0A" opacity="${op}" stroke="#fff" stroke-width="2"/>` +
               `<text x="${sx(x)}" y="${sy(y)+4}" text-anchor="middle" style="font-size:10px;font-weight:800;fill:#fff;">1</text>`;
      }
      function boundaryLine() {
        // прямая σ(z)=0.5 ⇔ z=0: от (0.8, 3.0) до (4.5, 0.5)
        return `<line x1="${sx(0.8)}" y1="${sy(3.0)}" x2="${sx(4.5)}" y2="${sy(0.5)}" stroke="#3576C0" stroke-width="3"/>` +
               `<text x="${sx(3.6)}" y="${sy(2.15)}" class="small" style="fill:#3576C0;font-weight:700;">σ(z)=0.5</text>`;
      }
      function scatter(withBoundary) {
        let s = scatterAxes();
        if (withBoundary) s += boundaryLine();
        ham.forEach(p => s += hamMark(p[0], p[1], 1));
        spam.forEach(p => s += spamMark(p[0], p[1], 1));
        // спорные письма
        s += hamMark(missHam[0], missHam[1], 1);
        s += spamMark(missSpam[0], missSpam[1], 1);
        if (withBoundary) {
          [missHam, missSpam].forEach(p => {
            s += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="14" fill="none" stroke="#111111" stroke-width="1.6" stroke-dasharray="3 3"/>`;
          });
          s += `<text x="${sx(missHam[0])+18}" y="${sy(missHam[1])+4}" class="small" style="font-weight:700;">спорное</text>`;
          s += `<text x="${sx(missSpam[0])-18}" y="${sy(missSpam[1])+4}" text-anchor="end" class="small" style="font-weight:700;">спорное</text>`;
        }
        return s;
      }

      // ============================= STEP 1 =============================
      const scene1 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Один цикл — четыре шага</text>
          <text x="60" y="190" class="text">Обучение логистической</text>
          <text x="60" y="212" class="text">регрессии — это повторение</text>
          <text x="60" y="234" class="text">одного цикла:</text>
          <text x="78" y="268" class="text"><tspan style="font-weight:700;fill:#C29E08;">forward</tspan> — считаем вероятность a=σ(z)</text>
          <text x="78" y="292" class="text"><tspan style="font-weight:700;fill:#C30B0A;">loss</tspan> — BCE: насколько ошиблись</text>
          <text x="78" y="316" class="text"><tspan style="font-weight:700;fill:#C30B0A;">backward</tspan> — градиент по w и b</text>
          <text x="78" y="340" class="text"><tspan style="font-weight:700;fill:#73B222;">update</tspan> — шаг против градиента</text>
          <text x="60" y="380" class="text">Это ровно те шаги из Частей</text>
          <text x="60" y="402" class="text">2 и 3 — здесь они собраны</text>
          <text x="60" y="424" class="text">в петлю.</text>
          <rect x="60" y="444" width="352" height="60" class="box-blue"/>
          ${kxFO(236, 472, 'w \\leftarrow w - \\alpha \\cdot \\frac{\\partial L}{\\partial w}', {align:'middle', size:15, color:'#111111', w:300})}
          <text x="236" y="493" text-anchor="middle" class="small">одно правило для всех параметров</text>
        </g>
        <g>
          <rect x="600" y="148" width="244" height="62" class="box-yellow"/>
          <text x="722" y="174" text-anchor="middle" class="text" style="font-weight:700;fill:#C29E08;">FORWARD</text>
          <text x="722" y="196" text-anchor="middle" class="small mono">a = σ(w·x + b)</text>

          <rect x="600" y="242" width="244" height="62" class="box-red"/>
          <text x="722" y="268" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">LOSS (BCE)</text>
          <text x="722" y="290" text-anchor="middle" class="small mono">−[y·ln a +(1−y)·ln(1−a)]</text>

          <rect x="600" y="336" width="244" height="62" class="box-red"/>
          <text x="722" y="362" text-anchor="middle" class="text" style="font-weight:700;fill:#C30B0A;">BACKWARD</text>
          <text x="722" y="384" text-anchor="middle" class="small mono">dz = a − y → ∂L/∂w, ∂L/∂b</text>

          <rect x="600" y="430" width="244" height="62" class="box-green"/>
          <text x="722" y="456" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">UPDATE</text>
          <text x="722" y="478" text-anchor="middle" class="small mono">w ← w − α·∂L/∂w</text>

          <line x1="722" y1="210" x2="722" y2="240" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>
          <line x1="722" y1="304" x2="722" y2="334" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>
          <line x1="722" y1="398" x2="722" y2="428" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>

          <path d="M 846 461 C 916 461 916 179 848 179" fill="none" stroke="#3576C0" stroke-width="2.2" marker-end="url(#tlog-ar-blue)"/>
          <text x="909" y="320" text-anchor="middle" class="small" style="fill:#3576C0;font-weight:700;" transform="rotate(90 909 320)">повторяем тысячи раз</text>
        </g>
      `;

      // ============================= STEP 2 =============================
      const scene2 = `
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Повторяем — тысячи раз</text>
          <text x="60" y="192" class="text">Один проход цикла почти</text>
          <text x="60" y="214" class="text">ничего не меняет. Но мы</text>
          <text x="60" y="236" class="text">повторяем его снова и снова.</text>
          <rect x="60" y="258" width="352" height="92" class="box-blue"/>
          <text x="78" y="284" class="small">• одно письмо → <tspan style="font-weight:700;">step</tspan></text>
          <text x="78" y="308" class="small">• пачка писем → <tspan style="font-weight:700;">batch</tspan></text>
          <text x="78" y="332" class="small">• весь датасет 1 раз → <tspan style="font-weight:700;">epoch</tspan></text>
          <text x="60" y="386" class="text" style="font-weight:700;fill:#73B222;">BCE падает с каждой</text>
          <text x="60" y="408" class="text" style="font-weight:700;fill:#73B222;">эпохой — модель учится.</text>
          <text x="60" y="448" class="small">Здесь BCE не доходит до нуля,</text>
          <text x="60" y="466" class="small">а замирает на ≈0.20: в данных</text>
          <text x="60" y="484" class="small">есть 2 противоречивых письма.</text>
        </g>
        <g>${lossCurve()}</g>
      `;

      // ============================= STEP 3 =============================
      const scene3 = `
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-green"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Обученный классификатор</text>
          <text x="60" y="192" class="text">После 5000 эпох веса нашли</text>
          <text x="60" y="214" class="text">значения, при которых BCE</text>
          <text x="60" y="236" class="text">минимальна.</text>
          <rect x="60" y="256" width="352" height="64" class="box-green"/>
          <text x="78" y="282" class="text mono" style="font-size:14px;">w₁≈2.4,  w₂≈3.9,  b≈0.3</text>
          <text x="78" y="304" class="small">(на стандартизованных признаках)</text>
          <text x="60" y="350" class="text">Синяя граница — это σ(z)=0.5:</text>
          <text x="60" y="372" class="text">слева «не спам», справа «спам».</text>
          <text x="60" y="408" class="text" style="font-weight:700;fill:#73B222;">Точность 88% (14 из 16).</text>
          <text x="60" y="446" class="small">2 «спорных» письма любая прямая</text>
          <text x="60" y="464" class="small">граница путает: их признаки</text>
          <text x="60" y="482" class="small">противоречат метке.</text>
        </g>
        <g>${scatter(true)}</g>
      `;

      // ============================= STEP 4 =============================
      const scene4 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">Та же анатомия — у любой модели</text>
          <text x="60" y="192" class="text">Обучение устроено из одних</text>
          <text x="60" y="214" class="text">и тех же блоков:</text>
          <text x="78" y="246" class="text"><tspan style="font-weight:700;fill:#3576C0;">Task</tspan> — что предсказываем (класс)</text>
          <text x="78" y="268" class="text"><tspan style="font-weight:700;fill:#3576C0;">Data</tspan> — примеры (x, y)</text>
          <text x="78" y="290" class="text"><tspan style="font-weight:700;fill:#3576C0;">Model</tspan> — то, что обучаем</text>
          <text x="78" y="312" class="text"><tspan style="font-weight:700;fill:#C30B0A;">Loss</tspan> — насколько ошибается</text>
          <text x="60" y="350" class="text">Тип задачи задаёт Loss:</text>
          <text x="60" y="372" class="text">классификация → BCE / кросс-</text>
          <text x="60" y="394" class="text">энтропия.</text>
          <rect x="60" y="414" width="352" height="86" class="box-green"/>
          <text x="236" y="442" text-anchor="middle" class="text" style="font-weight:700;fill:#73B222;">Логистическая регрессия —</text>
          <text x="236" y="464" text-anchor="middle" class="small">это тот же каркас в самом</text>
          <text x="236" y="482" text-anchor="middle" class="small">простом виде.</text>
        </g>
        <g>
          <rect x="600" y="150" width="244" height="62" class="box-blue"/>
          <text x="722" y="178" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Task</text>
          <text x="722" y="199" text-anchor="middle" class="small">классификация → BCE</text>

          <rect x="784" y="278" width="138" height="120" class="box-blue"/>
          <text x="853" y="308" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Data</text>
          <text x="853" y="334" text-anchor="middle" class="small">(x, y)</text>
          <text x="853" y="356" text-anchor="middle" class="small">письмо —</text>
          <text x="853" y="374" text-anchor="middle" class="small">метка</text>

          <rect x="560" y="278" width="200" height="120" class="box-red"/>
          <text x="660" y="308" text-anchor="middle" class="text" style="font-weight:800;fill:#C30B0A;">Loss</text>
          <text x="660" y="334" text-anchor="middle" class="small">«насколько</text>
          <text x="660" y="352" text-anchor="middle" class="small">ошиблись»</text>
          <text x="660" y="382" text-anchor="middle" class="small mono" style="fill:#C30B0A;">→ одно число</text>

          <rect x="600" y="462" width="244" height="62" class="box-blue"/>
          <text x="722" y="490" text-anchor="middle" class="text" style="font-weight:800;fill:#3576C0;">Model</text>
          <text x="722" y="511" text-anchor="middle" class="small">x → вероятность a=σ(z)</text>

          <line x1="722" y1="212" x2="722" y2="276" stroke="#3576C0" stroke-width="2" marker-end="url(#tlog-ar-blue)"/>
          <line x1="782" y1="338" x2="762" y2="338" stroke="#3576C0" stroke-width="2" marker-end="url(#tlog-ar-blue)"/>
          <line x1="702" y1="460" x2="664" y2="400" stroke="#C29E08" stroke-width="2" marker-end="url(#tlog-ar-yellow)"/>
          <line x1="660" y1="400" x2="700" y2="458" stroke="#C30B0A" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#tlog-ar-red)"/>
          <text x="610" y="438" class="small" style="fill:#C29E08;font-weight:700;">a</text>
          <text x="690" y="440" class="small" style="fill:#C30B0A;font-weight:700;">градиенты</text>
        </g>
      `;

      // ============================= STEP 5 =============================
      const scene5 = `
        ${arrowDefs}
        <g>
          <rect x="40" y="120" width="392" height="400" class="box-blue"/>
          <text x="60" y="158" class="text" style="font-weight:800;font-size:18px;">От регрессии к нейросети</text>
          <text x="60" y="192" class="text">Логистическая регрессия —</text>
          <text x="60" y="214" class="text">это нейросеть без скрытых</text>
          <text x="60" y="236" class="text">слоёв: вход → один нейрон</text>
          <text x="60" y="258" class="text">с сигмоидой.</text>
          <text x="60" y="294" class="text">Добавь скрытые слои — и тот</text>
          <text x="60" y="316" class="text">же цикл обучает нейросеть.</text>
          <text x="60" y="356" class="text" style="font-weight:700;">Последний слой решает задачу:</text>
          <rect x="60" y="372" width="352" height="58" class="box-green"/>
          <text x="78" y="396" class="small"><tspan style="font-weight:700;fill:#73B222;">2 класса</tspan> → 1 нейрон + sigmoid + BCE</text>
          <text x="78" y="416" class="small"><tspan style="font-weight:700;fill:#3576C0;">K классов</tspan> → K нейронов + softmax + CE</text>
          <text x="60" y="462" class="text">Архитектура и Loss меняются —</text>
          <text x="60" y="484" class="text" style="font-weight:700;fill:#73B222;">цикл forward→loss→backward→update нет.</text>
        </g>
        <g>
          <!-- стек слоёв нейросети -->
          <text x="710" y="150" text-anchor="middle" class="small" style="font-weight:700;">нейросеть</text>

          <rect x="560" y="170" width="300" height="56" class="box-blue"/>
          <text x="710" y="198" text-anchor="middle" class="text" style="fill:#3576C0;font-weight:700;">вход x</text>
          <text x="710" y="216" text-anchor="middle" class="small">признаки письма</text>

          <rect x="560" y="252" width="300" height="56" class="box-yellow"/>
          <text x="710" y="280" text-anchor="middle" class="text" style="fill:#C29E08;font-weight:700;">скрытый слой</text>
          <text x="710" y="298" text-anchor="middle" class="small">линейно + нелинейность</text>

          <rect x="560" y="334" width="300" height="56" class="box-yellow"/>
          <text x="710" y="362" text-anchor="middle" class="text" style="fill:#C29E08;font-weight:700;">скрытый слой</text>
          <text x="710" y="380" text-anchor="middle" class="small">линейно + нелинейность</text>

          <rect x="560" y="416" width="300" height="64" class="box-green"/>
          <text x="710" y="442" text-anchor="middle" class="text" style="fill:#73B222;font-weight:700;">выходной слой</text>
          <text x="710" y="463" text-anchor="middle" class="small">sigmoid+BCE  /  softmax+CE</text>

          <line x1="710" y1="226" x2="710" y2="250" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>
          <line x1="710" y1="308" x2="710" y2="332" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>
          <line x1="710" y1="390" x2="710" y2="414" stroke="#5E5850" stroke-width="2" marker-end="url(#tlog-ar-gray)"/>

          <rect x="476" y="416" width="70" height="64" class="box-green"/>
          <text x="511" y="453" text-anchor="middle" class="small" style="fill:#73B222;font-weight:700;">= лог-</text>
          <text x="511" y="470" text-anchor="middle" class="small" style="fill:#73B222;font-weight:700;">регр.</text>
        </g>
      `;

      const steps = [
        { title: "Шаг 1. Цикл обучения: четыре шага",
          subtitle: "forward → loss → backward → update — одна петля",
          scene: scene1 },
        { title: "Шаг 2. Повторяем — тысячи раз",
          subtitle: "BCE падает с каждой эпохой — модель учится",
          scene: scene2 },
        { title: "Шаг 3. Обученный классификатор",
          subtitle: "Веса найдены — граница σ(z)=0.5 разделяет письма",
          scene: scene3 },
        { title: "Шаг 4. Анатомия обучения",
          subtitle: "Task — Data — Model — Loss: один каркас для любой ML-модели",
          scene: scene4 },
        { title: "Шаг 5. От регрессии к нейросети",
          subtitle: "Добавь слои — цикл обучения остаётся тем же",
          scene: scene5 }
      ];

      let currentStep = 0;
      function renderStep() {
        const step = steps[currentStep];
        $("tlog-title").textContent = step.title;
        $("tlog-subtitle").textContent = step.subtitle;
        $("tlog-counter").textContent = `${currentStep + 1} из ${steps.length}`;
        $("tlog-scene").innerHTML = step.scene;
        $("tlog-prevGroup").style.display = currentStep === 0 ? "none" : "block";
        $("tlog-nextText").textContent = currentStep === steps.length - 1 ? "↻" : "Далее";
      }
      function nextStep() {
        if (currentStep < steps.length - 1) currentStep++;
        else currentStep = 0;
        renderStep();
      }
      function prevStep() {
        if (currentStep > 0) currentStep--;
        renderStep();
      }
      $("tlog-nextBtn").addEventListener("click", nextStep);
      $("tlog-prevBtn").addEventListener("click", prevStep);
      svg.tabIndex = 0;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      });

      renderStep();
    })();
  ]]></script>
</svg>
</div>
</figure>

В нейросетях всё то же самое, только вместо одной линейной формулы появляется много слоёв. Для бинарной классификации последний слой часто всё ещё заканчивается сигмоидой и binary cross-entropy. Для многоклассовой классификации вместо сигмоиды используют softmax, а вместо BCE — cross-entropy.

Поэтому логистическая регрессия — это не просто «простая модель». Это минимальная версия классификационного нейронного пайплайна: forward, loss, backward, update.

## Что важно вынести

1. **Логистическая регрессия решает классификацию**, хотя в названии есть слово «регрессия».
2. **Модель сначала считает logit** `z = wᵀx + b`, а потом превращает его в вероятность через сигмоиду.
3. **Граница классов** находится там, где `z = 0`, то есть `σ(z)=0.5`.
4. **Binary cross-entropy** наказывает модель за неправильные вероятности.
5. **Backpropagation** для sigmoid + BCE даёт красивое упрощение: `dz = a − y`.
6. **Матричная форма** позволяет обучаться сразу на батче: `dw = Xᵀdz`, `db = sum(dz)`.

Если линейная регрессия объясняет базовую идею «модель → ошибка → градиент → обновление», то логистическая регрессия показывает, как эта же идея работает для классификации и вероятностей.
