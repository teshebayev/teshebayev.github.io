<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
</style>

<p class="lead">
  A fully connected network is a single operation, "multiply a row by a
  matrix", nested inside itself as many times as the network has layers. The
  forward pass nests the layers into one another, and the backward pass opens
  them again from the outside in.
</p>

<p>
  I will start not with neurons but with what the network receives and what it
  has to return. For now the inside of the network is empty: first we need to
  agree on the shape of the input and the output, and only then build what
  connects them.
</p>

<div class="semantic-key" aria-label="Color key used in this article">
  <span><i style="background:#3576C0"></i>data and structure</span>
  <span><i style="background:#C29E08"></i>operation and parameter</span>
  <span><i style="background:#73B222"></i>result</span>
  <span><i style="background:#C30B0A"></i>error and gradient</span>
  <span><i style="background:#E8590C"></i>layer 1</span>
  <span><i style="background:#7C3AED"></i>layer 2</span>
  <span><i style="background:#0D9488"></i>layer 3</span>
  <span><i style="background:#DB2777"></i>layer 4 (output)</span>
</div>

<div class="callout-blue">
  <strong>How to use the interactive scenes:</strong> press "Next" and look only
  at the bright part of the picture, not at the whole diagram. Objects stay in
  place, so from step to step only the meaning changes, not the map in front of
  you. The arrow keys work when a scene has focus.
</div>

<h2 id="part-1">Part 1. What goes into the network and what comes out</h2>

<p>
  The task: given a description of an apartment, decide which price class it
  belongs to — high, medium or low. The description is a row of a table where
  each column is a <strong>feature</strong>: area, number of rooms, floor and so
  on. The exact number of columns does not matter in advance, so I will call it
  <span class="math-inline" data-tex="m"></span>. There can be any number of
  classes too; their number is <span class="math-inline" data-tex="K"></span>.
</p>

<p>
  The network knows nothing about apartments. It sees only numbers, so an
  object becomes a <strong>row vector</strong> of length <span class="math-inline" data-tex="m"></span>, and the answer becomes
  a row of length <span class="math-inline" data-tex="K"></span>. Everything the network does fits into one line:
</p>

<div class="math-display" data-tex="f:\ \mathbb{R}^{1\times m} \;\longrightarrow\; \mathbb{R}^{1\times K}"></div>

<div class="callout-blue">
  <strong>Why a row and not a column:</strong> objects are stored in a table as
  rows. When a whole stack of apartments arrives at the input later, the rows
  simply sit one under another, and the formulas do not have to be rewritten.
</div>

<p>Let's see step by step how an apartment becomes the input and a class becomes the output.</p>

<div class="stage" id="stageObj" tabindex="0">
  <div class="stage-figure">
<svg id="ob" viewBox="0 0 960 560" role="img" aria-label="An apartment becomes an input of m features, the price class becomes an output of K neurons, and the network between them is still empty">
  <style>
    #ob { font-family: Helvetica, Arial, sans-serif; }
    #ob .bx   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ob .by   { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; stroke-dasharray: 6 5; }
    #ob .bg   { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ob .bn   { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.2; }
    #ob .card { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; }
    #ob .sep  { stroke: #E0DDD3; stroke-width: 1; }
    #ob .lbl  { font-size: 17px; fill: #111111; }
    #ob .row  { font-size: 15px; fill: #111111; }
    #ob .val  { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #ob .cap  { font-size: 14px; fill: #5E5850; }
    #ob .hdr  { font-size: 14px; fill: #5E5850; letter-spacing: .04em; }
    #ob .dots { font-size: 22px; fill: #5E5850; }
    #ob .q    { font-size: 44px; fill: #C29E08; font-weight: 700; }
    #ob .one  { font-size: 17px; fill: #5A8C1C; font-weight: 700; }
    #ob .edgeB{ stroke: #3576C0; stroke-width: 1.5; fill: none; }
    #ob .edgeY{ stroke: #C29E08; stroke-width: 1.5; fill: none; }
    #ob .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ob-arwB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
    </marker>
    <marker id="ob-arwY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
    </marker>
  </defs>
  <g data-key="flat">
    <text x="130" y="60" class="hdr" text-anchor="middle">OBJECT</text>
    <rect x="30" y="80" width="200" height="300" rx="10" class="card"/>
    <text x="46" y="116" class="row">area, m²</text>
    <text x="214" y="116" class="val" text-anchor="end">54</text>
    <line x1="42" y1="145" x2="218" y2="145" class="sep"/>
    <text x="46" y="186" class="row">rooms</text>
    <text x="214" y="186" class="val" text-anchor="end">2</text>
    <line x1="42" y1="215" x2="218" y2="215" class="sep"/>
    <text x="46" y="256" class="row">floor</text>
    <text x="214" y="256" class="val" text-anchor="end">7</text>
    <line x1="42" y1="280" x2="218" y2="280" class="sep"/>
  </g>
  <g data-key="feat3">
    <text x="330" y="60" class="hdr" text-anchor="middle">INPUT</text>
    <line x1="232" y1="110" x2="304" y2="110" class="edgeB" marker-end="url(#ob-arwB)"/>
    <line x1="232" y1="180" x2="304" y2="180" class="edgeB" marker-end="url(#ob-arwB)"/>
    <line x1="232" y1="250" x2="304" y2="250" class="edgeB" marker-end="url(#ob-arwB)"/>
    <circle cx="330" cy="110" r="22" class="bx"/>
    <foreignObject x="300" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="330" cy="180" r="22" class="bx"/>
    <foreignObject x="300" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="330" cy="250" r="22" class="bx"/>
    <foreignObject x="300" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
  </g>
  <g data-key="featm">
    <text x="130" y="306" class="dots" text-anchor="middle">⋮</text>
    <line x1="42" y1="325" x2="218" y2="325" class="sep"/>
    <foreignObject x="46" y="334.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>feature <span data-tex="m"></span></span></div></foreignObject>
    <text x="214" y="356" class="val" text-anchor="end">…</text>
    <text x="330" y="306" class="dots" text-anchor="middle">⋮</text>
    <line x1="232" y1="350" x2="304" y2="350" class="edgeB" marker-end="url(#ob-arwB)"/>
    <circle cx="330" cy="350" r="22" class="bx"/>
    <foreignObject x="300" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <foreignObject x="256.5" y="384.5" width="147" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="m"></span> features</span></div></foreignObject>
  </g>
  <g data-key="xvec">
    <foreignObject x="-11" y="421.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:17px;color:#111111;font-weight:400" data-tex="x ="></div></foreignObject>
    <rect x="70"  y="420" width="56" height="40" class="bx"/>
    <rect x="126" y="420" width="56" height="40" class="bx"/>
    <rect x="182" y="420" width="56" height="40" class="bx"/>
    <rect x="238" y="420" width="56" height="40" class="bx"/>
    <rect x="294" y="420" width="56" height="40" class="bx"/>
    <foreignObject x="68" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <foreignObject x="124" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <foreignObject x="180" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <text x="266" y="446" class="lbl" text-anchor="middle">…</text>
    <foreignObject x="292" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <foreignObject x="132.5" y="468.6" width="155" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#3576C0;font-weight:700"><span>shape <span data-tex="1 \times m"></span></span></div></foreignObject>
  </g>
  <g data-key="outs">
    <text x="680" y="60" class="hdr" text-anchor="middle">OUTPUT</text>
    <circle cx="680" cy="110" r="22" class="bg"/>
    <foreignObject x="650" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <text x="712" y="115" class="cap">high</text>
    <circle cx="680" cy="180" r="22" class="bg"/>
    <foreignObject x="650" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <text x="712" y="185" class="cap">medium</text>
    <circle cx="680" cy="250" r="22" class="bg"/>
    <foreignObject x="650" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <text x="712" y="255" class="cap">low</text>
    <text x="680" y="306" class="dots" text-anchor="middle">⋮</text>
    <circle cx="680" cy="350" r="22" class="bg"/>
    <foreignObject x="650" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <foreignObject x="712" y="335.5" width="107" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>class <span data-tex="K"></span></span></div></foreignObject>
    <foreignObject x="616.5" y="384.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="K"></span> classes</span></div></foreignObject>
    <foreignObject x="621" y="421.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:17px;color:#111111;font-weight:400" data-tex="y ="></div></foreignObject>
    <rect x="702" y="420" width="44" height="40" class="bg"/>
    <rect x="746" y="420" width="44" height="40" class="bg"/>
    <rect x="790" y="420" width="44" height="40" class="bg"/>
    <rect x="834" y="420" width="44" height="40" class="bg"/>
    <rect x="878" y="420" width="44" height="40" class="bg"/>
    <foreignObject x="694" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <foreignObject x="738" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <foreignObject x="782" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <text x="856" y="446" class="lbl" text-anchor="middle">…</text>
    <foreignObject x="870" y="421.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <foreignObject x="734.5" y="468.6" width="155" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5A8C1C;font-weight:700"><span>shape <span data-tex="1 \times K"></span></span></div></foreignObject>
  </g>
  <g data-key="target">
    <foreignObject x="826.5" y="40.5" width="107" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>ANSWER <span data-tex="t"></span></span></div></foreignObject>
    <rect x="862" y="93"  width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="116" class="lbl" text-anchor="middle">0</text>
    <rect x="862" y="163" width="36" height="34" rx="4" class="bg"/>
    <text x="880" y="186" class="one" text-anchor="middle">1</text>
    <rect x="862" y="233" width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="256" class="lbl" text-anchor="middle">0</text>
    <text x="880" y="306" class="dots" text-anchor="middle">⋮</text>
    <rect x="862" y="333" width="36" height="34" rx="4" class="bn"/>
    <text x="880" y="356" class="lbl" text-anchor="middle">0</text>
    <text x="880" y="404" class="cap" text-anchor="middle">medium</text>
  </g>
  <g data-key="net">
    <foreignObject x="472" y="40.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>NETWORK <span data-tex="f"></span></span></div></foreignObject>
    <line x1="354" y1="110" x2="436" y2="110" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="180" x2="436" y2="180" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="250" x2="436" y2="250" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="354" y1="350" x2="436" y2="350" class="edgeY" marker-end="url(#ob-arwY)"/>
    <rect x="440" y="80" width="160" height="300" rx="12" class="by"/>
    <text x="520" y="232" class="q" text-anchor="middle">?</text>
    <text x="520" y="268" class="cap" text-anchor="middle">built</text>
    <text x="520" y="288" class="cap" text-anchor="middle">layer by layer</text>
    <line x1="602" y1="110" x2="654" y2="110" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="180" x2="654" y2="180" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="250" x2="654" y2="250" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="602" y1="350" x2="654" y2="350" class="edgeY" marker-end="url(#ob-arwY)"/>
    <line x1="360" y1="440" x2="650" y2="440" class="edgeY" marker-end="url(#ob-arwY)"/>
    <foreignObject x="481.5" y="406.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#8C7106;font-weight:700" data-tex="f"></div></foreignObject>
    <foreignObject x="411.5" y="444.5" width="187" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="1\times m \;\to\; 1\times K"></div></foreignObject>
  </g>
  <text x="30" y="545" class="legend">blue — input · yellow — network (operation) · green — output and correct answer · numbers are illustrative</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="flat" data-focus="flat">
      <div class="step-kicker">Step 1 · object</div>
      <h4>An apartment is a row of a table</h4>
      <p>
        To the network an apartment is a set of numbers: area 54 m², 2 rooms,
        7th floor. Each number is a separate column of the table, that is, a
        feature.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3" data-focus="feat3">
      <div class="step-kicker">Step 2 · feature → neuron</div>
      <h4>Each feature gets its own input neuron</h4>
      <p>
        The input layer computes nothing: it just holds the feature values.
        Area goes into <span class="math-inline" data-tex="x_{1}"></span>, the number of rooms into <span class="math-inline" data-tex="x_{2}"></span>,
        the floor into <span class="math-inline" data-tex="x_{3}"></span>. One feature, one circle.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3 featm" data-focus="featm">
      <div class="step-kicker">Step 3 · any number of features</div>
      <h4>There are <span class="math-inline" data-tex="m"></span> features, not three</h4>
      <p>
        Three columns are only an example. Add distance to the metro, year of
        construction, parking — there will be more input neurons, but the
        diagram stays the same. That is why from now on I write the total number
        of features as <span class="math-inline" data-tex="m"></span>, and the last input as <span class="math-inline" data-tex="x_{m}"></span>.
      </p>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec" data-focus="xvec">
      <div class="step-kicker">Step 4 · data</div>
      <h4>The input is a row vector of length <span class="math-inline" data-tex="m"></span></h4>
      <p>
        A column of neurons is convenient to draw, but a row is more convenient
        to compute with: it is exactly how the object lies in the table. Its
        shape is <span class="math-inline" data-tex="1 \times m"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>In general</span>
            <div class="math-display worked-math" data-tex="x = [\,x_1,\ x_2,\ x_3,\ \dots,\ x_m\,] \in \mathbb{R}^{1\times m}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>For our apartment</span>
            <div class="math-display worked-math" data-tex="x = [\,54,\ 2,\ 7,\ \dots\,]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the position in
        the row is what gives a number its meaning. The network knows that 54 is
        the area only because the area always comes first.</p>
      </div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs" data-focus="outs">
      <div class="step-kicker">Step 5 · output</div>
      <h4>The output has one neuron per class</h4>
      <p>
        The example has three classes: high, medium, low. Their number is not
        fixed either — let it be <span class="math-inline" data-tex="K"></span>. The output is a row
        <span class="math-inline" data-tex="y"></span> of shape <span class="math-inline" data-tex="1 \times K"></span>: each number says how strongly the network
        "votes" for its class.
      </p>
      <div class="math-display" data-tex="y = [\,y_1,\ y_2,\ \dots,\ y_K\,] \in \mathbb{R}^{1\times K}"></div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs target" data-focus="target">
      <div class="step-kicker">Step 6 · correct answer</div>
      <h4>The answer is written in the same shape: one-hot</h4>
      <p>
        Our apartment is medium. To compare the answer with the network's
        output, I write it as a row of the same length <span class="math-inline" data-tex="K"></span>: a one in the place of
        the correct class, zeros everywhere else.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Class</span>
            <div class="math-display worked-math" data-tex="\text{medium} = \text{class } 2"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>One-hot</span>
            <div class="math-display worked-math" data-tex="t = [\,0,\ 1,\ 0,\ \dots,\ 0\,]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> <span class="math-inline" data-tex="t"></span> and <span class="math-inline" data-tex="y"></span>
        have the same shape <span class="math-inline" data-tex="1 \times K"></span>, so they can be compared element by element. A good network
        will output a <span class="math-inline" data-tex="y"></span> whose second number is clearly larger than the rest.</p>
      </div>
    </div>
    <div class="step-panel" data-on="flat feat3 featm xvec outs target net" data-focus="net">
      <div class="step-kicker">Step 7 · operation</div>
      <h4>The network is a function from <span class="math-inline" data-tex="1 \times m"></span> to <span class="math-inline" data-tex="1 \times K"></span></h4>
      <p>
        Between the input and the output there is still an empty box. Only one
        thing is known about it: it takes a row of length <span class="math-inline" data-tex="m"></span> and returns a row of length <span class="math-inline" data-tex="K"></span>.
        Next I will fill the box with layers — each new layer is nested around
        the previous one, like a doll in a matryoshka.
      </p>
      <div class="math-display" data-tex="y = f(x),\qquad f:\ \mathbb{R}^{1\times m} \to \mathbb{R}^{1\times K}"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout">
  <strong>Key idea of this part:</strong> the network sees an apartment as a row of <span class="math-inline" data-tex="m"></span> numbers
  and must return a row of <span class="math-inline" data-tex="K"></span> numbers. Everything else is a way to build a function
  that turns one into the other.
</div>

<hr>

<h2 id="part-2">Part 2. One layer is one matrix</h2>

<p>
  The first piece of the nesting doll is a <strong>hidden layer</strong> of <span class="math-inline" data-tex="H_{1}"></span> neurons. The number of
  inputs <span class="math-inline" data-tex="m"></span> is dictated by the data, while <span class="math-inline" data-tex="H_{1}"></span> is my choice: it is the width of the layer, an
  architecture setting. The layer is <strong>fully connected</strong>: every input is connected to every
  neuron, and every connection has its own weight.
</p>

<p>
  Which raises the question: how many weights are there and how do we store them? There are <span class="math-inline" data-tex="m \cdot H_1"></span> connections, and the most
  convenient way to store them is a table where a row corresponds to an input and a column to a
  neuron. This table is the <strong>weight matrix</strong> <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span> of shape <span class="math-inline" data-tex="m \times H_{1}"></span>.
  Then the whole layer is computed with a single multiplication:
</p>

<div class="math-display" data-tex="\mathbf h^{(1)} = x\,\textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1},\qquad [1\times m]\cdot[m\times H_1] = [1\times H_1]"></div>

<div class="callout-blue">
  <strong>About the indices:</strong> in
  <span class="math-inline" data-tex="w^{(1)}_{ij}"></span> the superscript is the layer
  number, and the subscripts read "from → to": from input <span class="math-inline" data-tex="x_{i}"></span> to neuron
  <span class="math-inline" data-tex="h_{j}"></span>. So <span class="math-inline" data-tex="i"></span> is the row number of <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, and <span class="math-inline" data-tex="j"></span> is the column number.
</div>

<p>Let's see step by step how the edges of the diagram become cells of the matrix.</p>

<div class="stage" id="stageLayer" tabindex="0">
  <div class="stage-figure">
<svg id="ly" viewBox="0 0 960 600" role="img" aria-label="Fully connected layer: m inputs, H1 neurons and an m by H1 weight matrix W1">
  <style>
    #ly { font-family: Helvetica, Arial, sans-serif; }
    #ly .bx   { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ly .bg   { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ly .by   { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.6; }
    #ly .cell { fill: #FFFFFF; stroke: #D8D2C4; stroke-width: 1; }
    #ly .hlc  { fill: #FFD8B5; stroke: #E8590C; stroke-width: 2; }
    #ly .hlr  { fill: none; stroke: #E8590C; stroke-width: 3; }
    #ly .w    { font-size: 14px; fill: #5E5850; }
    #ly .cap  { font-size: 14px; fill: #5E5850; }
    #ly .capY { font-size: 14px; fill: #C2410C; font-weight: 700; }
    #ly .dots { font-size: 22px; fill: #5E5850; }
    #ly .op   { font-size: 24px; fill: #5E5850; }
    #ly .eg   { stroke: #B9B2A4; stroke-width: 1; fill: none; }
    #ly .ey   { stroke: #E8590C; stroke-width: 2.2; fill: none; }
    #ly .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ly-arwY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#E8590C"/>
    </marker>
  </defs>
  <g data-key="inp">
    <foreignObject x="51.5" y="30.5" width="117" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>INPUT · <span data-tex="m"></span></span></div></foreignObject>
    <circle cx="110" cy="110" r="22" class="bx"/>
    <foreignObject x="80" y="91.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="110" cy="180" r="22" class="bx"/>
    <foreignObject x="80" y="161.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="110" cy="250" r="22" class="bx"/>
    <foreignObject x="80" y="231.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <circle cx="110" cy="350" r="22" class="bx"/>
    <foreignObject x="80" y="331.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <text x="110" y="306" class="dots" text-anchor="middle">⋮</text>
  </g>
  <g data-key="hid">
    <foreignObject x="281" y="30.5" width="238" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>LAYER 1 · <span data-tex="H_1"></span> neurons</span></div></foreignObject>
    <circle cx="400" cy="90" r="22" class="bg"/>
    <foreignObject x="370" y="71.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="400" cy="150" r="22" class="bg"/>
    <foreignObject x="370" y="131.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="400" cy="210" r="22" class="bg"/>
    <foreignObject x="370" y="191.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="400" cy="270" r="22" class="bg"/>
    <foreignObject x="370" y="251.9" width="60" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <circle cx="400" cy="360" r="22" class="bg"/>
    <foreignObject x="363.5" y="341.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:400" data-tex="h_{H_{1}}"></div></foreignObject>
    <text x="400" y="322" class="dots" text-anchor="middle">⋮</text>
    <foreignObject x="301.5" y="390.5" width="197" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="H_1"></span> is our choice</span></div></foreignObject>
  </g>
  <g data-key="edges">
    <line x1="131.9" y1="108.5" x2="375.1" y2="91.7" class="eg"/>
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="eg"/>
    <line x1="130.8" y1="117.2" x2="376.4" y2="201.9" class="eg"/>
    <line x1="129.3" y1="120.6" x2="378.1" y2="257.9" class="eg"/>
    <line x1="126.7" y1="124.4" x2="381.1" y2="343.7" class="eg"/>
    <line x1="131.0" y1="173.5" x2="376.1" y2="97.4" class="eg"/>
    <line x1="131.9" y1="177.7" x2="375.1" y2="152.6" class="eg"/>
    <line x1="131.9" y1="182.3" x2="375.1" y2="207.4" class="eg"/>
    <line x1="131.0" y1="186.5" x2="376.1" y2="262.6" class="eg"/>
    <line x1="128.7" y1="191.6" x2="378.8" y2="346.8" class="eg"/>
    <line x1="129.3" y1="239.4" x2="378.1" y2="102.1" class="eg"/>
    <line x1="130.8" y1="242.8" x2="376.4" y2="158.1" class="eg"/>
    <line x1="131.8" y1="247.0" x2="375.2" y2="213.4" class="eg"/>
    <line x1="131.9" y1="251.5" x2="375.1" y2="268.3" class="eg"/>
    <line x1="130.6" y1="257.8" x2="376.6" y2="351.1" class="eg"/>
    <line x1="126.4" y1="335.3" x2="381.4" y2="106.7" class="eg"/>
    <line x1="128.1" y1="337.5" x2="379.4" y2="164.2" class="eg"/>
    <line x1="129.8" y1="340.4" x2="377.5" y2="220.9" class="eg"/>
    <line x1="131.2" y1="344.1" x2="375.9" y2="276.6" class="eg"/>
    <line x1="132.0" y1="350.8" x2="375.0" y2="359.1" class="eg"/>
    <foreignObject x="171.5" y="390.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="m \cdot H_1"></span> edges</span></div></foreignObject>
  </g>
  <g data-key="one" data-only="1">
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <rect x="226" y="104" width="62" height="22" rx="4" fill="#FFFFFF"/>
    <foreignObject x="206.5" y="99.6" width="101" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="w^{(1)}_{12}"></div></foreignObject>
  </g>
  <g data-key="row" data-only="1">
    <line x1="131.9" y1="108.5" x2="375.1" y2="91.7" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="130.8" y1="117.2" x2="376.4" y2="201.9" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="129.3" y1="120.6" x2="378.1" y2="257.9" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="126.7" y1="124.4" x2="381.1" y2="343.7" class="ey" marker-end="url(#ly-arwY)"/>
  </g>
  <g data-key="col" data-only="1">
    <line x1="131.8" y1="113.0" x2="375.2" y2="146.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="131.9" y1="177.7" x2="375.1" y2="152.6" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="130.8" y1="242.8" x2="376.4" y2="158.1" class="ey" marker-end="url(#ly-arwY)"/>
    <line x1="128.1" y1="337.5" x2="379.4" y2="164.2" class="ey" marker-end="url(#ly-arwY)"/>
  </g>
  <g data-key="grid">
    <foreignObject x="630.5" y="61.2" width="255" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700"><span><span data-tex="\textcolor{#C2410C}{W_1}"></span> — a matrix <span data-tex="m \times H_1"></span></span></div></foreignObject>
    <foreignObject x="590" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <foreignObject x="646" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <foreignObject x="702" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <foreignObject x="758" y="100.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <text x="842" y="120" class="cap" text-anchor="middle">…</text>
    <foreignObject x="865" y="100.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{H_{1}}"></div></foreignObject>
    <foreignObject x="544" y="135.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <rect x="590" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{11}"></div></foreignObject>
    <rect x="646" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{12}"></div></foreignObject>
    <rect x="702" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{13}"></div></foreignObject>
    <rect x="758" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{14}"></div></foreignObject>
    <rect x="814" y="130" width="56" height="40" class="cell"/>
    <text x="842" y="155" class="w" text-anchor="middle">…</text>
    <rect x="870" y="130" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="135.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{1,H_{1}}"></div></foreignObject>
    <foreignObject x="544" y="175.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <rect x="590" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{21}"></div></foreignObject>
    <rect x="646" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{22}"></div></foreignObject>
    <rect x="702" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{23}"></div></foreignObject>
    <rect x="758" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="175.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{24}"></div></foreignObject>
    <rect x="814" y="170" width="56" height="40" class="cell"/>
    <text x="842" y="195" class="w" text-anchor="middle">…</text>
    <rect x="870" y="170" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="175.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{2,H_{1}}"></div></foreignObject>
    <foreignObject x="544" y="215.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <rect x="590" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{31}"></div></foreignObject>
    <rect x="646" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{32}"></div></foreignObject>
    <rect x="702" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{33}"></div></foreignObject>
    <rect x="758" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="215.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{34}"></div></foreignObject>
    <rect x="814" y="210" width="56" height="40" class="cell"/>
    <text x="842" y="235" class="w" text-anchor="middle">…</text>
    <rect x="870" y="210" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="215.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{3,H_{1}}"></div></foreignObject>
    <text x="572" y="276" class="cap" text-anchor="middle">⋮</text>
    <rect x="590" y="250" width="56" height="40" class="cell"/>
    <text x="618" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="646" y="250" width="56" height="40" class="cell"/>
    <text x="674" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="702" y="250" width="56" height="40" class="cell"/>
    <text x="730" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="758" y="250" width="56" height="40" class="cell"/>
    <text x="786" y="275" class="w" text-anchor="middle">⋮</text>
    <rect x="814" y="250" width="56" height="40" class="cell"/>
    <text x="842" y="275" class="w" text-anchor="middle">⋱</text>
    <rect x="870" y="250" width="56" height="40" class="cell"/>
    <text x="898" y="275" class="w" text-anchor="middle">⋮</text>
    <foreignObject x="544" y="295.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <rect x="590" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="585" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m1}"></div></foreignObject>
    <rect x="646" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="641" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m2}"></div></foreignObject>
    <rect x="702" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="697" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m3}"></div></foreignObject>
    <rect x="758" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="753" y="295.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m4}"></div></foreignObject>
    <rect x="814" y="290" width="56" height="40" class="cell"/>
    <text x="842" y="315" class="w" text-anchor="middle">…</text>
    <rect x="870" y="290" width="56" height="40" class="cell"/>
    <foreignObject x="855" y="295.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="w_{m,H_{1}}"></div></foreignObject>
  </g>
  <g data-key="cell" data-only="1">
    <rect x="646" y="130" width="56" height="40" class="hlc"/>
    <foreignObject x="641" y="135.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="w_{12}"></div></foreignObject>
    <text x="758" y="366" class="capY" text-anchor="middle">one edge = one cell</text>
  </g>
  <g data-key="rowhl" data-only="1">
    <rect x="590" y="130" width="336" height="40" class="hlr"/>
    <foreignObject x="573.5" y="346.5" width="369" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700"><span>row <span data-tex="i"></span> — everything leaving <span data-tex="x_i"></span></span></div></foreignObject>
  </g>
  <g data-key="colhl" data-only="1">
    <rect x="646" y="130" width="56" height="200" class="hlr"/>
    <foreignObject x="578.5" y="346.5" width="359" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700"><span>column <span data-tex="j"></span> — everything entering <span data-tex="h_j"></span></span></div></foreignObject>
  </g>
  <g data-key="dot" data-only="1">
    <foreignObject x="40" y="440" width="880" height="56">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="h_2 = x_1 w_{12} + x_2 w_{22} + \dots + x_m w_{m2} = \sum_{i=1}^{m} x_i\, w_{i2}"></div>
    </foreignObject>
  </g>
  <g data-key="mat" data-only="1">
    <rect x="60" y="473" width="90" height="24" class="bx"/>
    <foreignObject x="62" y="495.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  m"></div></foreignObject>
    <text x="170" y="493" class="op" text-anchor="middle">·</text>
    <rect x="190" y="440" width="150" height="90" class="by"/>
    <foreignObject x="217" y="470.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="m \times  H_{1}"></div></foreignObject>
    <text x="555" y="493" class="op" text-anchor="middle">=</text>
    <rect x="580" y="473" width="150" height="24" class="bg"/>
    <foreignObject x="607" y="495.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  H_{1}"></div></foreignObject>
  </g>
  <g data-key="fmat" data-only="1">
    <foreignObject x="750" y="466" width="200" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\mathbf h^{(1)} = x\,\textcolor{#C2410C}{W_1}"></div>
    </foreignObject>
  </g>
  <g data-key="bias" data-only="1">
    <text x="360" y="493" class="op" text-anchor="middle">+</text>
    <rect x="380" y="473" width="150" height="24" class="by"/>
    <foreignObject x="407" y="495.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="1 \times  H_{1}"></div></foreignObject>
    <foreignObject x="750" y="466" width="200" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-md" data-tex="\mathbf h^{(1)} = x\,\textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1}"></div>
    </foreignObject>
    <foreignObject x="428" y="56.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="116.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="176.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="236.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
    <foreignObject x="428" y="326.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="+b"></div></foreignObject>
  </g>
  <text x="30" y="585" class="legend">blue — input · orange — weights and bias of layer 1 · green — layer output</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="inp hid edges" data-focus="edges">
      <div class="step-kicker">Step 1 · structure</div>
      <h4>Every input is connected to every neuron</h4>
      <p>
        On the left are <span class="math-inline" data-tex="m"></span> inputs, on the right <span class="math-inline" data-tex="H_{1}"></span> neurons of the first hidden layer. There are
        <span class="math-inline" data-tex="m \cdot H_1"></span> connections, one for each pair. The number <span class="math-inline" data-tex="m"></span> is set by the data, while <span class="math-inline" data-tex="H_{1}"></span> is my
        choice: the layer can be wider than the input or narrower.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges one grid cell" data-focus="one cell">
      <div class="step-kicker">Step 2 · parameter</div>
      <h4>One connection — one weight — one cell</h4>
      <p>
        The connection from <span class="math-inline" data-tex="x_{1}"></span> to <span class="math-inline" data-tex="h_{2}"></span> has its own weight
        <span class="math-inline" data-tex="w^{(1)}_{12}"></span>: layer 1,
        from input 1 to neuron 2. Let's put all the weights into a table so that the input number
        is the row number and the neuron number is the column number. This weight
        ends up in row 1, column 2.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges row grid rowhl" data-focus="row rowhl">
      <div class="step-kicker">Step 3 · row</div>
      <h4>Everything leaving one input is a row of <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Take the weights that go from <span class="math-inline" data-tex="x_{1}"></span> to all neurons of the layer.
        There are <span class="math-inline" data-tex="H_{1}"></span> of them, and they all sit in the first row of the matrix. This is not a layer yet,
        only the contribution of one feature to all neurons at once.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges col grid colhl" data-focus="col colhl">
      <div class="step-kicker">Step 4 · column</div>
      <h4>Everything entering one neuron is a column of <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Now look from the other side: which weights arrive at neuron
        <span class="math-inline" data-tex="h_{2}"></span>? One from each input, <span class="math-inline" data-tex="m"></span> in total. They sit in the
        second column. Computing a neuron needs exactly that column.
      </p>
    </div>
    <div class="step-panel" data-on="inp hid edges col grid colhl dot" data-focus="dot">
      <div class="step-kicker">Step 5 · operation</div>
      <h4>A neuron is the dot product of <span class="math-inline" data-tex="x"></span> with its column</h4>
      <p>
        A neuron multiplies each input by the weight of its connection and adds everything up. That is exactly
        the dot product of the row <span class="math-inline" data-tex="x"></span> with a column of <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · three features of the apartment</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Computing the second neuron for the apartment 54 · 2 · 7</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">area</div>
            <div class="math-display worked-trace-math" data-tex="54 \cdot (-0.01) = -0.54"></div>
            <div class="worked-trace-note">large number, small weight</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">rooms</div>
            <div class="math-display worked-trace-math" data-tex="2 \cdot 0.30 = 0.60"></div>
            <div class="worked-trace-note">contribution of the same order</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">floor</div>
            <div class="math-display worked-trace-math" data-tex="7 \cdot 0.20 = 1.40"></div>
            <div class="worked-trace-note">the largest contribution</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">sum</div>
            <div class="math-display worked-trace-math" data-tex="h_2 = -0.54 + 0.60 + 1.40 = 1.46"></div>
            <div class="worked-trace-note">one number per neuron</div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the contribution
        of a feature depends on both its value and its weight. The area 54 is many times larger than
        the floor 7, but because of the weight −0.01 its contribution is smaller.</p>
      </div>
    </div>
    <div class="step-panel" data-on="inp hid edges grid mat fmat" data-focus="mat fmat">
      <div class="step-kicker">Step 6 · result</div>
      <h4>All neurons at once — one multiplication <span class="math-inline" data-tex="x \cdot \textcolor{#EA580C}{W_1}"></span></h4>
      <p>
        Each neuron is <span class="math-inline" data-tex="x"></span> times its own column. Doing this for all <span class="math-inline" data-tex="H_{1}"></span>
        columns at once gives a row-by-matrix multiplication. The inner
        sizes match (<span class="math-inline" data-tex="m"></span> and <span class="math-inline" data-tex="m"></span>), and what remains outside is a row <span class="math-inline" data-tex="1 \times H_{1}"></span> — one number
        per neuron.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · 3 features, 4 neurons</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substitute</span>
            <div class="math-display worked-math" data-tex="[54,\ 2,\ 7]\begin{bmatrix}0.02 &amp; -0.01 &amp; 0.03 &amp; 0\\ 0.5 &amp; 0.3 &amp; -0.4 &amp; 0.1\\ -0.1 &amp; 0.2 &amp; 0.05 &amp; 0.3\end{bmatrix}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="x \textcolor{#EA580C}{W_1} = [1.38,\ 1.46,\ 1.17,\ 2.30]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the second
        number, 1.46, is the same <span class="math-inline" data-tex="h_{2}"></span> as in the previous step. Matrix multiplication computes the same
        four dot products, only all of them in one operation.</p>
      </div>
    </div>
    <div class="step-panel" data-on="inp hid edges grid mat bias" data-focus="bias">
      <div class="step-kicker">Step 7 · parameter</div>
      <h4>Bias: every neuron has its own offset</h4>
      <p>
        One more number is added to each neuron — the bias
        <span class="math-inline" data-tex="b"></span>. All biases of the layer form a row <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> of the same
        shape <span class="math-inline" data-tex="1 \times H_{1}"></span>. In total the layer has <span class="math-inline" data-tex="m \cdot H_1 + H_1"></span> parameters: with <span class="math-inline" data-tex="m = 3"></span> and <span class="math-inline" data-tex="H_1 = 4"></span>
        that is <span class="math-inline" data-tex="12 + 4 = 16"></span>.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · layer biases</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substitute</span>
            <div class="math-display worked-math" data-tex="[1.38,\ 1.46,\ 1.17,\ 2.30] + [0.1,\ -0.2,\ 0,\ -0.5]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(1)} = [1.48,\ 1.26,\ 1.17,\ 1.80]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the bias
        does not depend on the apartment. It shifts the neuron's "zero point": even with
        an all-zero input the neuron outputs its <span class="math-inline" data-tex="b"></span>.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout">
  <strong>Key idea of this part:</strong> a layer is an <span class="math-inline" data-tex="m \times H_{1}"></span> matrix whose rows are
  inputs and whose columns are neurons. The whole layer is computed by one formula,
  <span class="math-inline" data-tex="x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}"></span>, which turns a row of length <span class="math-inline" data-tex="m"></span> into a row of length <span class="math-inline" data-tex="H_{1}"></span>.
</div>

<hr>

<h2 id="part-3">Part 3. Layer by layer: assembling the nesting doll</h2>

<p>
  One layer turns a row of length <span class="math-inline" data-tex="m"></span> into a row of length <span class="math-inline" data-tex="H_{1}"></span>. But <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> is a row of numbers
  just like <span class="math-inline" data-tex="x"></span>, so it can be fed into the next layer. That layer
  does the same thing: multiplies by its own matrix <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> and adds its own bias <span class="math-inline" data-tex="\textcolor{#8B5CF6}{b_2}"></span>.
  Each new layer <strong>wraps</strong> everything computed before it.
</p>

<div class="math-display" data-tex="y = \Big(\big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big)\, \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>

<p>
  The sizes of the matrices are not arbitrary. How many rows <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> has is decided not by <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> but by the
  previous layer: there are as many rows as neurons coming in. The number of columns is
  the number of neurons in the new layer. The sizes match up like domino
  tiles.
</p>

<div class="callout-blue">
  <strong>Why three hidden layers:</strong> the number is not special. There can be
  any number of hidden layers; three is just enough to see the pattern
  without drowning in indices.
</div>

<p>Let's see step by step how each shell is added.</p>

<div class="stage" id="stageStack" tabindex="0">
  <div class="stage-figure">
<svg id="mt" viewBox="0 0 960 640" role="img" aria-label="A four-layer network is assembled like a nesting doll: weight matrix sizes match like dominoes">
  <style>
    #mt { font-family: Helvetica, Arial, sans-serif; }
    #mt .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mt .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #mt .tb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.8; }
    #mt .tr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 2; }
    #mt .div { stroke: #5E5850; stroke-width: 1; stroke-dasharray: 3 3; }
    #mt .dm { font-size: 18px; fill: #111111; font-weight: 700; }
    #mt .sec { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #mt .dots { font-size: 18px; fill: #5E5850; }
    #mt .inx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #mt .ok { stroke: #73B222; stroke-width: 2.2; fill: none; }
    #mt .okt { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #mt .bad { stroke: #C30B0A; stroke-width: 2.4; }
    #mt .num { font-size: 14px; fill: #111111; font-weight: 700; }
    #mt .legend { font-size: 13px; fill: #5E5850; }
    #mt .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #mt .l1e { stroke: #E8590C; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #mt .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #mt .l2e { stroke: #7C3AED; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #mt .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #mt .l3e { stroke: #0D9488; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #mt .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #mt .l4e { stroke: #DB2777; stroke-opacity: .5; stroke-width: 1; fill: none; }
    #mt .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <g data-key="inp">
    <foreignObject x="34.5" y="37.8" width="111" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400;letter-spacing:.04em"><span>INPUT · <span data-tex="m"></span></span></div></foreignObject>
    <circle cx="90" cy="96" r="16" class="bx"/>
    <foreignObject x="61" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{1}"></div></foreignObject>
    <circle cx="90" cy="140" r="16" class="bx"/>
    <foreignObject x="61" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{2}"></div></foreignObject>
    <circle cx="90" cy="184" r="16" class="bx"/>
    <foreignObject x="61" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{3}"></div></foreignObject>
    <circle cx="90" cy="242" r="16" class="bx"/>
    <foreignObject x="61" y="225.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="x_{m}"></div></foreignObject>
    <text x="90" y="222" class="dots" text-anchor="middle">⋮</text>
    <rect x="65" y="318" width="150" height="50" rx="8" class="tb"/>
    <line x1="140.0" y1="326" x2="140.0" y2="360" class="div"/>
    <text x="102.5" y="349" class="dm" text-anchor="middle">1</text>
    <foreignObject x="153" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="m"></div></foreignObject>
    <foreignObject x="116.5" y="368.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#5E5850;font-weight:400" data-tex="x"></div></foreignObject>
    <text x="30" y="300" class="sec">SHAPE DOMINOES</text>
    <text x="30" y="456" class="sec">NESTING DOLL</text>
    <rect x="291" y="502" width="50" height="36" rx="6" class="inx"/>
    <foreignObject x="292.5" y="504.6" width="47" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
  </g>
  <g data-key="L1">
    <foreignObject x="220.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#C2410C;font-weight:400;letter-spacing:.04em"><span>LAYER 1 · <span data-tex="H_1"></span></span></div></foreignObject>
    <circle cx="290" cy="96" r="16" class="l1"/>
    <foreignObject x="261" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="290" cy="140" r="16" class="l1"/>
    <foreignObject x="261" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="290" cy="184" r="16" class="l1"/>
    <foreignObject x="261" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="290" cy="242" r="16" class="l1"/>
    <foreignObject x="256" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{H_{1}}"></div></foreignObject>
    <text x="290" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="106.0" y1="96.0" x2="274.0" y2="96.0" class="l1e"/>
    <line x1="105.6" y1="99.4" x2="274.4" y2="136.6" class="l1e"/>
    <line x1="104.6" y1="102.4" x2="275.4" y2="177.6" class="l1e"/>
    <line x1="102.9" y1="105.4" x2="277.1" y2="232.6" class="l1e"/>
    <line x1="105.6" y1="136.6" x2="274.4" y2="99.4" class="l1e"/>
    <line x1="106.0" y1="140.0" x2="274.0" y2="140.0" class="l1e"/>
    <line x1="105.6" y1="143.4" x2="274.4" y2="180.6" class="l1e"/>
    <line x1="104.3" y1="147.3" x2="275.7" y2="234.7" class="l1e"/>
    <line x1="104.6" y1="177.6" x2="275.4" y2="102.4" class="l1e"/>
    <line x1="105.6" y1="180.6" x2="274.4" y2="143.4" class="l1e"/>
    <line x1="106.0" y1="184.0" x2="274.0" y2="184.0" class="l1e"/>
    <line x1="105.4" y1="188.5" x2="274.6" y2="237.5" class="l1e"/>
    <line x1="102.9" y1="232.6" x2="277.1" y2="105.4" class="l1e"/>
    <line x1="104.3" y1="234.7" x2="275.7" y2="147.3" class="l1e"/>
    <line x1="105.4" y1="237.5" x2="274.6" y2="188.5" class="l1e"/>
    <line x1="106.0" y1="242.0" x2="274.0" y2="242.0" class="l1e"/>
    <foreignObject x="160.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="235" y="318" width="150" height="50" rx="8" class="l1"/>
    <line x1="310.0" y1="326" x2="310.0" y2="360" class="div"/>
    <foreignObject x="248" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="m"></div></foreignObject>
    <foreignObject x="316.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{1}"></div></foreignObject>
    <foreignObject x="281" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#C2410C;font-weight:400" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="277" y="494" width="174" height="52" rx="10" class="l1s"/>
    <foreignObject x="351" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1}"></div></foreignObject>
  </g>
  <g data-key="L2">
    <foreignObject x="420.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#6D28D9;font-weight:400;letter-spacing:.04em"><span>LAYER 2 · <span data-tex="H_2"></span></span></div></foreignObject>
    <circle cx="490" cy="96" r="16" class="l2"/>
    <foreignObject x="461" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="490" cy="140" r="16" class="l2"/>
    <foreignObject x="461" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="490" cy="184" r="16" class="l2"/>
    <foreignObject x="461" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="490" cy="242" r="16" class="l2"/>
    <foreignObject x="456" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{H_{2}}"></div></foreignObject>
    <text x="490" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="306.0" y1="96.0" x2="474.0" y2="96.0" class="l2e"/>
    <line x1="305.6" y1="99.4" x2="474.4" y2="136.6" class="l2e"/>
    <line x1="304.6" y1="102.4" x2="475.4" y2="177.6" class="l2e"/>
    <line x1="302.9" y1="105.4" x2="477.1" y2="232.6" class="l2e"/>
    <line x1="305.6" y1="136.6" x2="474.4" y2="99.4" class="l2e"/>
    <line x1="306.0" y1="140.0" x2="474.0" y2="140.0" class="l2e"/>
    <line x1="305.6" y1="143.4" x2="474.4" y2="180.6" class="l2e"/>
    <line x1="304.3" y1="147.3" x2="475.7" y2="234.7" class="l2e"/>
    <line x1="304.6" y1="177.6" x2="475.4" y2="102.4" class="l2e"/>
    <line x1="305.6" y1="180.6" x2="474.4" y2="143.4" class="l2e"/>
    <line x1="306.0" y1="184.0" x2="474.0" y2="184.0" class="l2e"/>
    <line x1="305.4" y1="188.5" x2="474.6" y2="237.5" class="l2e"/>
    <line x1="302.9" y1="232.6" x2="477.1" y2="105.4" class="l2e"/>
    <line x1="304.3" y1="234.7" x2="475.7" y2="147.3" class="l2e"/>
    <line x1="305.4" y1="237.5" x2="474.6" y2="188.5" class="l2e"/>
    <line x1="306.0" y1="242.0" x2="474.0" y2="242.0" class="l2e"/>
    <foreignObject x="360.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="405" y="318" width="150" height="50" rx="8" class="l2"/>
    <line x1="480.0" y1="326" x2="480.0" y2="360" class="div"/>
    <foreignObject x="411.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{1}"></div></foreignObject>
    <foreignObject x="486.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{2}"></div></foreignObject>
    <foreignObject x="451" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#6D28D9;font-weight:400" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="263" y="486" width="298" height="68" rx="12" class="l2s"/>
    <foreignObject x="461" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2}"></div></foreignObject>
  </g>
  <g data-key="L3">
    <foreignObject x="620.5" y="37.8" width="139" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#0F766E;font-weight:400;letter-spacing:.04em"><span>LAYER 3 · <span data-tex="H_3"></span></span></div></foreignObject>
    <circle cx="690" cy="96" r="16" class="l3"/>
    <foreignObject x="661" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <circle cx="690" cy="140" r="16" class="l3"/>
    <foreignObject x="661" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <circle cx="690" cy="184" r="16" class="l3"/>
    <foreignObject x="661" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <circle cx="690" cy="242" r="16" class="l3"/>
    <foreignObject x="656" y="225.6" width="68" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="h_{H_{3}}"></div></foreignObject>
    <text x="690" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="506.0" y1="96.0" x2="674.0" y2="96.0" class="l3e"/>
    <line x1="505.6" y1="99.4" x2="674.4" y2="136.6" class="l3e"/>
    <line x1="504.6" y1="102.4" x2="675.4" y2="177.6" class="l3e"/>
    <line x1="502.9" y1="105.4" x2="677.1" y2="232.6" class="l3e"/>
    <line x1="505.6" y1="136.6" x2="674.4" y2="99.4" class="l3e"/>
    <line x1="506.0" y1="140.0" x2="674.0" y2="140.0" class="l3e"/>
    <line x1="505.6" y1="143.4" x2="674.4" y2="180.6" class="l3e"/>
    <line x1="504.3" y1="147.3" x2="675.7" y2="234.7" class="l3e"/>
    <line x1="504.6" y1="177.6" x2="675.4" y2="102.4" class="l3e"/>
    <line x1="505.6" y1="180.6" x2="674.4" y2="143.4" class="l3e"/>
    <line x1="506.0" y1="184.0" x2="674.0" y2="184.0" class="l3e"/>
    <line x1="505.4" y1="188.5" x2="674.6" y2="237.5" class="l3e"/>
    <line x1="502.9" y1="232.6" x2="677.1" y2="105.4" class="l3e"/>
    <line x1="504.3" y1="234.7" x2="675.7" y2="147.3" class="l3e"/>
    <line x1="505.4" y1="237.5" x2="674.6" y2="188.5" class="l3e"/>
    <line x1="506.0" y1="242.0" x2="674.0" y2="242.0" class="l3e"/>
    <foreignObject x="560.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="575" y="318" width="150" height="50" rx="8" class="l3"/>
    <line x1="650.0" y1="326" x2="650.0" y2="360" class="div"/>
    <foreignObject x="581.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{2}"></div></foreignObject>
    <foreignObject x="656.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{3}"></div></foreignObject>
    <foreignObject x="621" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#0F766E;font-weight:400" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="249" y="478" width="422" height="84" rx="14" class="l3s"/>
    <foreignObject x="571" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3}"></div></foreignObject>
  </g>
  <g data-key="L4">
    <foreignObject x="810" y="37.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#BE185D;font-weight:400;letter-spacing:.04em"><span>OUTPUT · <span data-tex="K"></span></span></div></foreignObject>
    <circle cx="870" cy="96" r="16" class="bg"/>
    <foreignObject x="841" y="79.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{1}"></div></foreignObject>
    <circle cx="870" cy="140" r="16" class="bg"/>
    <foreignObject x="841" y="123.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{2}"></div></foreignObject>
    <circle cx="870" cy="184" r="16" class="bg"/>
    <foreignObject x="841" y="167.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{3}"></div></foreignObject>
    <circle cx="870" cy="242" r="16" class="bg"/>
    <foreignObject x="841" y="225.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:400" data-tex="y_{K}"></div></foreignObject>
    <text x="870" y="222" class="dots" text-anchor="middle">⋮</text>
    <line x1="706.0" y1="96.0" x2="854.0" y2="96.0" class="l4e"/>
    <line x1="705.5" y1="99.8" x2="854.5" y2="136.2" class="l4e"/>
    <line x1="704.4" y1="103.0" x2="855.6" y2="177.0" class="l4e"/>
    <line x1="702.4" y1="106.1" x2="857.6" y2="231.9" class="l4e"/>
    <line x1="705.5" y1="136.2" x2="854.5" y2="99.8" class="l4e"/>
    <line x1="706.0" y1="140.0" x2="854.0" y2="140.0" class="l4e"/>
    <line x1="705.5" y1="143.8" x2="854.5" y2="180.2" class="l4e"/>
    <line x1="703.9" y1="147.9" x2="856.1" y2="234.1" class="l4e"/>
    <line x1="704.4" y1="177.0" x2="855.6" y2="103.0" class="l4e"/>
    <line x1="705.5" y1="180.2" x2="854.5" y2="143.8" class="l4e"/>
    <line x1="706.0" y1="184.0" x2="854.0" y2="184.0" class="l4e"/>
    <line x1="705.2" y1="188.9" x2="854.8" y2="237.1" class="l4e"/>
    <line x1="702.4" y1="231.9" x2="857.6" y2="106.1" class="l4e"/>
    <line x1="703.9" y1="234.1" x2="856.1" y2="147.9" class="l4e"/>
    <line x1="705.2" y1="237.1" x2="854.8" y2="188.9" class="l4e"/>
    <line x1="706.0" y1="242.0" x2="854.0" y2="242.0" class="l4e"/>
    <foreignObject x="750.5" y="61.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="745" y="318" width="150" height="50" rx="8" class="l4"/>
    <line x1="820.0" y1="326" x2="820.0" y2="360" class="div"/>
    <foreignObject x="751.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="H_{3}"></div></foreignObject>
    <foreignObject x="833" y="323.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:700" data-tex="K"></div></foreignObject>
    <foreignObject x="791" y="368.6" width="58" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#BE185D;font-weight:400" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="235" y="470" width="546" height="100" rx="16" class="l4s"/>
    <foreignObject x="681" y="504.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
    <foreignObject x="795" y="501.9" width="73" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:17px;color:#5A8C1C;font-weight:700" data-tex="= y"></div></foreignObject>
  </g>
  <g data-key="match" data-only="1">
    <path d="M 177.5 314 Q 225.0 292 272.5 314" class="ok"/>
    <path d="M 347.5 314 Q 395.0 292 442.5 314" class="ok"/>
    <path d="M 517.5 314 Q 565.0 292 612.5 314" class="ok"/>
    <path d="M 687.5 314 Q 735.0 292 782.5 314" class="ok"/>
    <text x="102.5" y="410" class="okt" text-anchor="middle">1</text>
    <foreignObject x="834.5" y="390.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="K"></div></foreignObject>
    <foreignObject x="190" y="390.5" width="580" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700"><span>inner sizes cancel, what remains is <span data-tex="1 \times K"></span></span></div></foreignObject>
  </g>
  <g data-key="bad" data-only="1">
    <rect x="405" y="318" width="150" height="50" rx="8" class="tr"/>
    <line x1="480.0" y1="326" x2="480.0" y2="360" class="div"/>
    <foreignObject x="411.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#C30B0A;font-weight:700" data-tex="H_{2}"></div></foreignObject>
    <foreignObject x="486.5" y="323.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#C30B0A;font-weight:700" data-tex="H_{1}"></div></foreignObject>
    <line x1="387.0" y1="300" x2="403.0" y2="316" class="bad"/><line x1="403.0" y1="300" x2="387.0" y2="316" class="bad"/>
    <foreignObject x="336" y="390.5" width="288" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700"><span><span data-tex="H_1 \ne H_2"></span> — cannot multiply</span></div></foreignObject>
  </g>
  <g data-key="nums" data-only="1">
    <rect x="68" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="90" y="284" class="num" text-anchor="middle">3</text>
    <rect x="268" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="290" y="284" class="num" text-anchor="middle">4</text>
    <rect x="468" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="490" y="284" class="num" text-anchor="middle">5</text>
    <rect x="668" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="690" y="284" class="num" text-anchor="middle">4</text>
    <rect x="848" y="268" width="44" height="22" rx="11" fill="#FFFFFF" stroke="#5E5850"/>
    <text x="870" y="284" class="num" text-anchor="middle">3</text>
  </g>
  <text x="30" y="626" class="legend">blue — input · layers: orange — 1 · purple — 2 · teal — 3 · pink — 4 (output) · green — output · red — error</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="inp L1" data-focus="L1">
      <div class="step-kicker">Step 1 · the first doll</div>
      <h4>Inside: <span class="math-inline" data-tex="x"></span> and the first layer</h4>
      <p>
        We start with what we already know: <span class="math-inline" data-tex="x"></span> is multiplied by <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, and <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> is added.
        In dominoes these are two tiles, <span class="math-inline" data-tex="1 \times m"></span> and <span class="math-inline" data-tex="m \times H_{1}"></span>. In the nesting doll it is the
        smallest shell around <span class="math-inline" data-tex="x"></span>.
      </p>
      <div class="math-display" data-tex="\mathbf h^{(1)} = x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1} \qquad [1\times m]\cdot[m\times H_1] \to [1\times H_1]"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2" data-focus="L2">
      <div class="step-kicker">Step 2 · the second doll</div>
      <h4>A layer's output is the next layer's input</h4>
      <p>
        The second layer receives <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> of length <span class="math-inline" data-tex="H_{1}"></span>. So <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> has exactly <span class="math-inline" data-tex="H_{1}"></span> rows — one
        for each neuron of the previous layer. It has <span class="math-inline" data-tex="H_{2}"></span> columns: the number of neurons
        I choose for the second layer. Substituting <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> reveals the second shell.
      </p>
      <div class="math-display" data-tex="\mathbf h^{(2)} = \mathbf h^{(1)} \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2} = (x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3" data-focus="L3">
      <div class="step-kicker">Step 3 · the third doll</div>
      <h4>The same move once more</h4>
      <p>
        The third layer works the same way: <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> has <span class="math-inline" data-tex="H_{2}"></span> rows and <span class="math-inline" data-tex="H_{3}"></span> columns. The new layer
        knows nothing about <span class="math-inline" data-tex="x"></span> directly — it sees only the output of the previous layer.
      </p>
      <div class="math-display" data-tex="\mathbf h^{(3)} = \big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4" data-focus="L4">
      <div class="step-kicker">Step 4 · the outer doll</div>
      <h4>The output layer closes the doll</h4>
      <p>
        The last matrix <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span> turns <span class="math-inline" data-tex="H_{3}"></span> numbers into <span class="math-inline" data-tex="K"></span> — one per class.
        Here the width is no longer my choice: the task has fixed it. The expanded formula
        is the whole network.
      </p>
      <div class="math-display" data-tex="y = \Big(\big((x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}) \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big) \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big) \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 match" data-focus="match">
      <div class="step-kicker">Step 5 · rule</div>
      <h4>Dominoes: neighbouring halves match</h4>
      <p>
        The right half of each tile equals the left half of the next one: <span class="math-inline" data-tex="m"></span> and
        <span class="math-inline" data-tex="m"></span>, <span class="math-inline" data-tex="H_{1}"></span> and <span class="math-inline" data-tex="H_{1}"></span>, <span class="math-inline" data-tex="H_{2}"></span> and <span class="math-inline" data-tex="H_{2}"></span>, <span class="math-inline" data-tex="H_{3}"></span> and <span class="math-inline" data-tex="H_{3}"></span>. These sizes "cancel", and only 1 and <span class="math-inline" data-tex="K"></span>
        remain outside. That is why the network's answer is a <span class="math-inline" data-tex="1 \times K"></span> row, however
        deep the doll is.
      </p>
      <div class="math-display" data-tex="[1\times m]\,[m\times H_1]\,[H_1\times H_2]\,[H_2\times H_3]\,[H_3\times K] \to [1\times K]"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 bad" data-focus="bad">
      <div class="step-kicker">Step 6 · what breaks</div>
      <h4>Mixed up rows and columns — the dominoes fall apart</h4>
      <p>
        Suppose <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> was written with shape <span class="math-inline" data-tex="H_{2} \times H_{1}"></span>, "to × from". Then
        <span class="math-inline" data-tex="H_{1}"></span> and <span class="math-inline" data-tex="H_{2}"></span> end up next to each other, and the product is undefined. This mistake happens
        when two conventions are mixed: <span class="math-inline" data-tex="x W"></span> (row on the left) and <span class="math-inline" data-tex="W x"></span> (column on the right).
        Pick one and stick to it throughout the network; this article uses <span class="math-inline" data-tex="x W"></span>.
      </p>
      <div class="math-display" data-tex="[1\times H_1]\cdot[H_2\times H_1] \quad \text{undefined when } H_1 \ne H_2"></div>
    </div>
    <div class="step-panel" data-on="inp L1 L2 L3 L4 nums" data-focus="nums L4">
      <div class="step-kicker">Step 7 · numbers</div>
      <h4>Running the apartment through the whole doll</h4>
      <p>
        Take widths 3 → 4 → 5 → 4 → 3 and continue the example from Part 2.
        Each layer takes the row returned by the previous one.
      </p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-trace">
          <div class="worked-trace-title">The row after each shell</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">layer 1</div>
            <div class="math-display worked-trace-math" data-tex="\mathbf h^{(1)} = [1.48,\ 1.26,\ 1.17,\ 1.80]"></div>
            <div class="worked-trace-note">from Part 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">layer 2</div>
            <div class="math-display worked-trace-math" data-tex="\mathbf h^{(2)} = [0.732,\ 0.011,\ 0.192,\ 0.691,\ 0.295]"></div>
            <div class="worked-trace-note">now 5 numbers</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">layer 3</div>
            <div class="math-display worked-trace-math" data-tex="\mathbf h^{(3)} = [0.5876,\ -0.0517,\ 0.118,\ 0.0878]"></div>
            <div class="worked-trace-note">4 again</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">output</div>
            <div class="math-display worked-trace-math" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div>
            <div class="worked-trace-note"><span class="math-inline" data-tex="K = 3"></span> scores</div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the network
        votes for high (0.3417), although the correct answer is medium. That is expected:
        the weights were picked at random, and the network has learned nothing. The forward pass only
        computes the answer; correcting it is the job of the backward pass.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>Each shell brings its own parameters. Here is how many there are in the example:</p>

<table class="shape-table">
  <tr><th>Layer</th><th><span class="math-inline" data-tex="W"></span></th><th><span class="math-inline" data-tex="b"></span></th><th>Parameters</th><th>In the example</th></tr>
  <tr><td>1</td><td><span class="math-inline" data-tex="m \times H_{1}"></span></td><td><span class="math-inline" data-tex="1 \times H_{1}"></span></td><td><span class="math-inline" data-tex="m \cdot H_1 + H_1"></span></td><td>3·4 + 4 = 16</td></tr>
  <tr><td>2</td><td><span class="math-inline" data-tex="H_{1} \times H_{2}"></span></td><td><span class="math-inline" data-tex="1 \times H_{2}"></span></td><td><span class="math-inline" data-tex="H_1 \cdot H_2 + H_2"></span></td><td>4·5 + 5 = 25</td></tr>
  <tr><td>3</td><td><span class="math-inline" data-tex="H_{2} \times H_{3}"></span></td><td><span class="math-inline" data-tex="1 \times H_{3}"></span></td><td><span class="math-inline" data-tex="H_2 \cdot H_3 + H_3"></span></td><td>5·4 + 4 = 24</td></tr>
  <tr><td>4 (output)</td><td><span class="math-inline" data-tex="H_{3} \times K"></span></td><td><span class="math-inline" data-tex="1 \times K"></span></td><td><span class="math-inline" data-tex="H_3 \cdot K + K"></span></td><td>4·3 + 3 = 15</td></tr>
  <tr><td colspan="3"><strong>Whole network</strong></td><td></td><td><strong>80</strong></td></tr>
</table>

<div class="callout">
  <strong>Key idea of this part:</strong> a network is a set of layers of the form
  <span class="math-inline" data-tex="(\cdot)\, W + b"></span> nested inside one another. The number of rows of each matrix is set by the previous layer,
  the number of columns by the next one, so the sizes match like dominoes, and what comes out
  is a <span class="math-inline" data-tex="1 \times K"></span> row.
</div>

<hr>

<h2 id="part-4">Part 4. Without activations the doll is empty</h2>

<p>
  The doll from Part 3 has an unpleasant property. Each shell is a
  multiplication by a matrix plus a vector, that is, a <strong>linear</strong>
  (strictly speaking, affine) transformation. And a composition of linear transformations
  is linear too. So no matter how many layers I nest inside each other, they can
  be "glued" into one in advance.
</p>

<div class="math-display" data-tex="x \textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4} = x\,W_{\text{eff}}, \qquad [3\times 4][4\times 5][5\times 4][4\times 3] = [3\times 3]"></div>

<p>Let's check this on the same numbers as in Part 3.</p>

<div class="stage" id="stageCollapse" tabindex="0">
  <div class="stage-figure">
<svg id="cl" viewBox="0 0 960 600" role="img" aria-label="Without activations four layers multiply into a single matrix">
  <style>
    #cl { font-family: Helvetica, Arial, sans-serif; }
    #cl .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #cl .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #cl .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #cl .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #cl .lbl { font-size: 17px; fill: #111111; }
    #cl .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #cl .cap { font-size: 14px; fill: #5E5850; }
    #cl .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #cl .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #cl .capG { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #cl .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #cl .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #cl .legend { font-size: 13px; fill: #5E5850; }
    #cl .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #cl .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #cl .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #cl .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #cl .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #cl .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #cl .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #cl .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="cl-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="cl-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="cl-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="cl-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="cl-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <linearGradient id="cl-geff" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#E8590C"/><stop offset=".34" stop-color="#7C3AED"/><stop offset=".66" stop-color="#0D9488"/><stop offset="1" stop-color="#DB2777"/></linearGradient>
  </defs>
  <g data-key="nest">
    <text x="30" y="46" class="hdr">NESTING DOLL WITHOUT ACTIVATIONS</text>
    <rect x="326" y="100" width="44" height="36" rx="6" class="bx"/><foreignObject x="324" y="101.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="312" y="92" width="138" height="52" rx="10" class="l1s"/>
    <foreignObject x="380" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\cdot\, \textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="298" y="84" width="232" height="68" rx="12" class="l2s"/>
    <foreignObject x="460" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\cdot\, \textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="284" y="76" width="326" height="84" rx="14" class="l3s"/>
    <foreignObject x="540" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\cdot\, \textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="270" y="68" width="420" height="100" rx="16" class="l4s"/>
    <foreignObject x="620" y="101.6" width="79" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="704" y="103.5" width="66" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="= y"></div></foreignObject>
  </g>
  <g data-key="chain">
    <text x="30" y="212" class="hdr">THE SAME MATRICES IN A ROW</text>
    <rect x="40" y="240" width="70" height="50" rx="6" class="bx"/><foreignObject x="51" y="248.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject><foreignObject x="32" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="1 \times  3"></div></foreignObject>
    <rect x="150" y="240" width="90" height="50" rx="6" class="l1"/><foreignObject x="165.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject><foreignObject x="152" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="3 \times  4"></div></foreignObject>
    <rect x="260" y="240" width="90" height="50" rx="6" class="l2"/><foreignObject x="275.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject><foreignObject x="262" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="4 \times  5"></div></foreignObject>
    <rect x="370" y="240" width="90" height="50" rx="6" class="l3"/><foreignObject x="385.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject><foreignObject x="372" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="5 \times  4"></div></foreignObject>
    <rect x="480" y="240" width="90" height="50" rx="6" class="l4"/><foreignObject x="495.5" y="248.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject><foreignObject x="482" y="290.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="4 \times  3"></div></foreignObject>
    <text x="128" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="253" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="363" y="270" class="lbl" text-anchor="middle">·</text>
    <text x="473" y="270" class="lbl" text-anchor="middle">·</text>
  </g>
  <g data-key="merge">
    <path d="M 150 232 L 150 222 L 570 222 L 570 232" class="eY"/>
    <text x="360" y="214" class="capY" text-anchor="middle">multiply in advance</text>
    <line x1="585" y1="265" x2="686" y2="265" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="690" y="232" width="130" height="66" rx="8" fill="#FFFFFF" stroke="url(#cl-geff)" stroke-width="3"/>
    <foreignObject x="714" y="239.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="W_{\text{eff}}"></div></foreignObject><foreignObject x="712" y="264.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="3 \times  3"></div></foreignObject>
    <text x="755" y="318" class="capY" text-anchor="middle">just 9 numbers</text>
  </g>
  <g data-key="cmp">
    <text x="30" y="370" class="hdr">TWO PATHS TO ONE ANSWER</text>
    <rect x="40" y="390" width="60" height="44" rx="6" class="bx"/><foreignObject x="46" y="395.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <line x1="104" y1="412" x2="176" y2="412" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="180" y="390" width="200" height="44" rx="6" class="by"/><text x="280" y="410" class="lb" text-anchor="middle">4 layers</text><text x="280" y="427" class="cap" text-anchor="middle">80 parameters</text>
    <line x1="384" y1="412" x2="456" y2="412" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="460" y="390" width="300" height="44" rx="6" class="bg"/><foreignObject x="419" y="395.2" width="382" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div></foreignObject>
    <rect x="40" y="470" width="60" height="44" rx="6" class="bx"/><foreignObject x="46" y="475.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <line x1="104" y1="492" x2="176" y2="492" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="180" y="470" width="200" height="44" rx="6" class="by"/><text x="280" y="490" class="lb" text-anchor="middle">1 layer</text><text x="280" y="507" class="cap" text-anchor="middle">12 parameters</text>
    <line x1="384" y1="492" x2="456" y2="492" class="eY" marker-end="url(#cl-aY)"/>
    <rect x="460" y="470" width="300" height="44" rx="6" class="bg"/><foreignObject x="419" y="475.2" width="382" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div></foreignObject>
    <text x="810" y="462" class="capG" text-anchor="middle">identical</text><text x="810" y="480" class="capG" text-anchor="middle">to 4 decimals</text>
  </g>
  <g data-key="red" data-only="1">
    <rect x="40" y="532" width="880" height="36" rx="6" class="br"/>
    <text x="480" y="555" class="capR" text-anchor="middle">biases collapse too: 4 linear layers = 1 linear layer. Depth added nothing</text>
  </g>
  <text x="30" y="590" class="legend">blue — input · layers: orange — 1 · purple — 2 · teal — 3 · pink — 4 (output) · green — output · red — problem</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="nest" data-focus="nest">
      <div class="step-kicker">Step 1 · what we have</div>
      <h4>A doll made of multiplications only</h4>
      <p>I will drop the biases for now to make the main point visible. Without them the whole network is <span class="math-inline" data-tex="x"></span> multiplied by four matrices in turn. Each shell is one multiplication.</p>
      <div class="math-display" data-tex="y = \big(((x \textcolor{#EA580C}{W_1})\, \textcolor{#8B5CF6}{W_2})\, \textcolor{#0D9488}{W_3}\big)\, \textcolor{#DB2777}{W_4}"></div>
    </div>
    <div class="step-panel" data-on="nest chain" data-focus="chain">
      <div class="step-kicker">Step 2 · operation</div>
      <h4>The brackets can be moved</h4>
      <p>Matrix multiplication is associative: it does not matter where the brackets go, as long as the order of the matrices themselves stays the same. So we can first multiply all the <span class="math-inline" data-tex="W"></span> together and plug in <span class="math-inline" data-tex="x"></span> at the very end.</p>
      <div class="math-display" data-tex="\big(((x \textcolor{#EA580C}{W_1}) \textcolor{#8B5CF6}{W_2}) \textcolor{#0D9488}{W_3}\big) \textcolor{#DB2777}{W_4} = x\,(\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4})"></div>
    </div>
    <div class="step-panel" data-on="nest chain merge" data-focus="merge">
      <div class="step-kicker">Step 3 · result</div>
      <h4>Four matrices fold into one</h4>
      <p>The product <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4}"></span> is a single <span class="math-inline" data-tex="3 \times 3"></span> matrix: the inner sizes 4, 5, 4 cancel, as in dominoes. Nine numbers instead of 64 weights.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the weights from Part 3</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Multiply</span>
            <div class="math-display worked-math" data-tex="\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="W_{\text{eff}} = \begin{bmatrix}0.0081 &amp; -0.0039 &amp; -0.0032\\ 0.0461 &amp; -0.0731 &amp; 0.0788\\ -0.0229 &amp; 0.0164 &amp; 0.0124\end{bmatrix}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the equality is exact, not an approximation. This matrix maps any apartment to the same scores as the four layers do.</p>
      </div>
    </div>
    <div class="step-panel" data-on="nest chain merge cmp" data-focus="cmp">
      <div class="step-kicker">Step 4 · check</div>
      <h4>Four layers and one layer give the same result</h4>
      <p>Let's run our apartment two ways: through all four layers, as in Part 3, and through the single matrix <span class="math-inline" data-tex="W_{\text{eff}}"></span> with the folded bias <span class="math-inline" data-tex="b_{\text{eff}}"></span>. The answers match to the last digit.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>One layer</span>
            <div class="math-display worked-math" data-tex="x\,W_{\text{eff}} + b_{\text{eff}},\quad b_{\text{eff}} = [-0.0258,\ 0.1871,\ -0.1435]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="y = [0.3417,\ -0.0527,\ -0.0724]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the same <span class="math-inline" data-tex="y"></span> as in Part 3. The eighty parameters of four layers can do exactly what the twelve parameters of one layer can.</p>
      </div>
    </div>
    <div class="step-panel" data-on="nest chain merge cmp red" data-focus="red">
      <div class="step-kicker">Step 5 · what breaks</div>
      <h4>Depth without activations is an empty doll</h4>
      <p>With biases it is the same: substituting one into another again gives the form <span class="math-inline" data-tex="x W + b"></span>. However many layers you nest, from the outside it is one linear layer. There is nothing inside the doll except a single doll.</p>
      <div class="math-display" data-tex="b_{\text{eff}} = \big((\textcolor{#EA580C}{b_1} \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}) \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\big) \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout-red">
  <strong>Why this matters:</strong> a single linear layer can separate classes
  only with straight lines (hyperplanes). If the data cannot be separated that way, no number
  of linear layers will help — they still collapse into one.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> without a nonlinearity between the layers the whole
  doll collapses into one matrix <span class="math-inline" data-tex="W_{\text{eff}}"></span> and one bias <span class="math-inline" data-tex="b_{\text{eff}}"></span>. Depth
  appears only when something that cannot be multiplied out in advance stands between the
  multiplications.
</div>

<hr>

<h2 id="part-5">Part 5. Activation: what cannot be multiplied out in advance</h2>

<p>
  To keep the doll from collapsing, an <strong>activation function</strong>
  <span class="math-inline" data-tex="\sigma"></span> is placed after each hidden layer — a nonlinear function applied
  to each number of the row separately. The shell becomes:
</p>

<div class="math-display" data-tex="\mathbf h^{(k)} = \sigma\big(\mathbf h^{(k-1)} W_k + b_k\big), \qquad \mathbf h^{(0)} = x"></div>

<p>
  At the output, <strong>softmax</strong> is used instead of ReLU: it turns <span class="math-inline" data-tex="K"></span> scores into
  <span class="math-inline" data-tex="K"></span> probabilities. And to compare the probabilities with the correct answer <span class="math-inline" data-tex="t"></span>, we need a
  <strong>loss</strong> — a single number that shows how wrong the network is.
</p>

<div class="callout-blue">
  <strong>Sizes do not change:</strong> <span class="math-inline" data-tex="\sigma"></span> and softmax are applied element-wise or
  row-wise, so the dominoes from Part 3 stay the same. An activation adds
  nonlinearity but no parameters.
</div>

<p>Let's go step by step.</p>

<div class="stage" id="stageAct" tabindex="0">
  <div class="stage-figure">
<svg id="ac" viewBox="0 0 960 700" role="img" aria-label="ReLU activation between layers and softmax at the output">
  <style>
    #ac { font-family: Helvetica, Arial, sans-serif; }
    #ac .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ac .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ac .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ac .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #ac .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #ac .lb { font-size: 16px; fill: #111111; font-weight: 700; }
    #ac .v { font-size: 13px; fill: #111111; }
    #ac .cap { font-size: 14px; fill: #5E5850; }
    #ac .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #ac .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #ac .capR { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #ac .eY { stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #ac .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #ac .eN { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #ac .dash { stroke-dasharray: 5 4; }
    #ac .legend { font-size: 13px; fill: #5E5850; }
    #ac .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #ac .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #ac .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #ac .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #ac .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #ac .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="ac-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="ac-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="ac-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="ac-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="ac-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
  </defs>
  <g data-key="relu">
    <text x="30" y="46" class="hdr">ReLU ACTIVATION</text>
    <rect x="40" y="60" width="270" height="190" rx="8" class="bn"/>
    <line x1="60" y1="210" x2="292" y2="210" class="eN" marker-end="url(#ac-aN)"/>
    <line x1="175" y1="232" x2="175" y2="76" class="eN" marker-end="url(#ac-aN)"/>
    <path d="M 65 210 L 175 210 L 275 110" class="eY" stroke-width="3.2"/>
    <foreignObject x="240" y="210.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:14px;color:#5E5850;font-weight:400" data-tex="z"></div></foreignObject>
    <foreignObject x="186" y="70.5" width="197" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#8C7106;font-weight:700" data-tex="\sigma(z)"></div></foreignObject>
    <foreignObject x="46.5" y="180.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z &lt; 0 \;\to\; 0"></div></foreignObject>
    <foreignObject x="171" y="172.5" width="127" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:14px;color:#5E5850;font-weight:400" data-tex="z &gt; 0 \;\to\; z"></div></foreignObject>
  </g>
  <g data-key="l3">
    <text x="360" y="46" class="hdr">LAYER 3 OF OUR APARTMENT</text>
    <line x1="360" y1="210" x2="610" y2="210" class="eN"/><line x1="690" y1="210" x2="930" y2="210" class="eN"/>
    <rect x="380" y="121.9" width="40" height="88.1" class="by"/>
    <text x="400" y="115.9" class="v" text-anchor="middle">0.5876</text>
    <foreignObject x="372" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{1}"></div></foreignObject>
    <rect x="710" y="121.9" width="40" height="88.1" class="bg"/>
    <text x="730" y="115.9" class="v" text-anchor="middle">0.5876</text>
    <foreignObject x="702" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{1}"></div></foreignObject>
    <rect x="440" y="210" width="40" height="7.8" class="br"/>
    <text x="460" y="233.8" class="v" text-anchor="middle" fill="#C30B0A">−0.0517</text>
    <foreignObject x="432" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{2}"></div></foreignObject>
    <text x="790" y="204" class="capR" text-anchor="middle">0</text>
    <foreignObject x="762" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{2}"></div></foreignObject>
    <rect x="500" y="192.3" width="40" height="17.7" class="by"/>
    <text x="520" y="186.3" class="v" text-anchor="middle">0.1180</text>
    <foreignObject x="492" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{3}"></div></foreignObject>
    <rect x="830" y="192.3" width="40" height="17.7" class="bg"/>
    <text x="850" y="186.3" class="v" text-anchor="middle">0.1180</text>
    <foreignObject x="822" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{3}"></div></foreignObject>
    <rect x="560" y="196.8" width="40" height="13.2" class="by"/>
    <text x="580" y="190.8" class="v" text-anchor="middle">0.0878</text>
    <foreignObject x="552" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="z_{4}"></div></foreignObject>
    <rect x="890" y="196.8" width="40" height="13.2" class="bg"/>
    <text x="910" y="190.8" class="v" text-anchor="middle">0.0878</text>
    <foreignObject x="882" y="228.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400" data-tex="h_{4}"></div></foreignObject>
    <line x1="618" y1="150" x2="682" y2="150" class="eY" marker-end="url(#ac-aY)"/><text x="650" y="140" class="capY" text-anchor="middle">ReLU</text>
  </g>
  <g data-key="block">
    <text x="30" y="290" class="hdr">CANNOT MULTIPLY IN ADVANCE</text>
    <rect x="300" y="300" width="90" height="40" rx="6" class="l2"/><foreignObject x="315.5" y="303.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <circle cx="440" cy="320" r="20" class="br"/><foreignObject x="416" y="303.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="\sigma"></div></foreignObject>
    <rect x="490" y="300" width="90" height="40" rx="6" class="l3"/><foreignObject x="505.5" y="303.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <line x1="394" y1="320" x2="416" y2="320" class="eN" marker-end="url(#ac-aN)"/><line x1="462" y1="320" x2="486" y2="320" class="eN" marker-end="url(#ac-aN)"/>
    <line x1="600" y1="306" x2="620" y2="334" class="eR"/><line x1="620" y1="306" x2="600" y2="334" class="eR"/>
    <foreignObject x="634" y="306.5" width="258" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#C30B0A;font-weight:700"><span><span data-tex="\textcolor{#6D28D9}{W_2} \cdot \textcolor{#0F766E}{W_3}"></span> can no longer be merged</span></div></foreignObject>
  </g>
  <g data-key="shells">
    <text x="30" y="372" class="hdr">A REAL NESTING DOLL</text>
    <rect x="256" y="400" width="40" height="36" rx="6" class="bx"/><foreignObject x="252" y="401.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="242" y="392" width="170" height="52" rx="10" class="l1s"/>
    <foreignObject x="306" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1})"></div></foreignObject>
    <rect x="228" y="384" width="300" height="68" rx="12" class="l2s"/>
    <foreignObject x="422" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2})"></div></foreignObject>
    <rect x="214" y="376" width="430" height="84" rx="14" class="l3s"/>
    <foreignObject x="538" y="401.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3})"></div></foreignObject>
    <rect x="200" y="368" width="560" height="100" rx="16" class="l4s"/>
    <foreignObject x="654" y="401.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
    <foreignObject x="772" y="403.5" width="167" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5A8C1C;font-weight:700"><span><span data-tex="\to"></span> softmax <span data-tex="\to p"></span></span></div></foreignObject>
  </g>
  <g data-key="soft">
    <text x="30" y="506" class="hdr">OUTPUT: SCORES → PROBABILITIES</text>
    <line x1="80" y1="630" x2="320" y2="630" class="eN"/><line x1="440" y1="630" x2="680" y2="630" class="eN"/>
    <rect x="100" y="581.1" width="44" height="48.9" class="by"/><text x="122" y="575.1" class="v" text-anchor="middle">0.3262</text>
    <text x="122" y="664" class="cap" text-anchor="middle">high</text>
    <rect x="460" y="566.9" width="44" height="63.1" class="bg"/><text x="482" y="560.9" class="v" text-anchor="middle">0.4207</text>
    <text x="482" y="664" class="cap" text-anchor="middle">high</text>
    <rect x="170" y="630" width="44" height="4.8" class="by"/><text x="192" y="624" class="v" text-anchor="middle">−0.0321</text>
    <text x="192" y="664" class="cap" text-anchor="middle">medium</text>
    <rect x="530" y="585.9" width="44" height="44.1" class="bg"/><text x="552" y="579.9" class="v" text-anchor="middle">0.2940</text>
    <text x="552" y="664" class="cap" text-anchor="middle">medium</text>
    <rect x="240" y="630" width="44" height="9.3" class="by"/><text x="262" y="624" class="v" text-anchor="middle">−0.0621</text>
    <text x="262" y="664" class="cap" text-anchor="middle">low</text>
    <rect x="600" y="587.2" width="44" height="42.8" class="bg"/><text x="622" y="581.2" class="v" text-anchor="middle">0.2853</text>
    <text x="622" y="664" class="cap" text-anchor="middle">low</text>
    <line x1="336" y1="590" x2="424" y2="590" class="eY" marker-end="url(#ac-aY)"/><text x="380" y="580" class="capY" text-anchor="middle">softmax</text>
    <foreignObject x="131.5" y="510.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="y"></span> — scores</span></div></foreignObject><foreignObject x="426" y="510.5" width="278" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="p"></span> — probabilities, sum 1</span></div></foreignObject>
  </g>
  <g data-key="loss">
    <foreignObject x="706.5" y="510.5" width="217" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>correct answer <span data-tex="t"></span></span></div></foreignObject>
    <rect x="745" y="560" width="40" height="34" rx="4" class="bn"/><text x="765" y="583" class="lb" text-anchor="middle">0</text>
    <rect x="795" y="560" width="40" height="34" rx="4" class="bg"/><text x="815" y="583" class="lb" text-anchor="middle">1</text>
    <rect x="845" y="560" width="40" height="34" rx="4" class="bn"/><text x="865" y="583" class="lb" text-anchor="middle">0</text>
    <foreignObject x="726.5" y="602.5" width="177" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="L = -\ln 0.2940"></div></foreignObject><text x="815" y="642" class="capR" text-anchor="middle">= 1.2241</text>
    <path d="M 552 566 Q 650 510 742 570" class="eR dash" marker-end="url(#ac-aR)"/>
  </g>
  <text x="30" y="688" class="legend">blue — input · yellow — operation · shell color — layer number · green — result · red — clipped values and error</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="relu" data-focus="relu">
      <div class="step-kicker">Step 1 · operation</div>
      <h4>ReLU: negatives become zero</h4>
      <p>The simplest nonlinearity is ReLU. It passes positive numbers through unchanged and replaces negative ones with zero. It is applied to each number of the row separately.</p>
      <div class="math-display" data-tex="\sigma(z) = \max(0,\ z)"></div>
    </div>
    <div class="step-panel" data-on="relu l3" data-focus="l3">
      <div class="step-kicker">Step 2 · numbers</div>
      <h4>ReLU on the third layer of our apartment</h4>
      <p>Let <span class="math-inline" data-tex="z"></span> denote the row before the activation and <span class="math-inline" data-tex="\mathbf h = \sigma(z)"></span> the row after it. On the third layer our apartment has one negative number: −0.0517. ReLU turns it into zero; the rest pass through unchanged.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Before activation</span>
            <div class="math-display worked-math" data-tex="z^{(3)} = [0.5876,\ -0.0517,\ 0.118,\ 0.0878]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>After ReLU</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(3)} = [0.5876,\ 0,\ 0.118,\ 0.0878]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> on the first two layers all numbers of this apartment are positive, so ReLU changes nothing there. For another apartment the zeros land in other places — and that is why the network stops being a single matrix.</p>
      </div>
    </div>
    <div class="step-panel" data-on="relu l3 block" data-focus="block">
      <div class="step-kicker">Step 3 · why it works</div>
      <h4><span class="math-inline" data-tex="\sigma"></span> now stands between the matrices</h4>
      <p>Between <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2}"></span> and <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> there is now a function that depends on the numbers themselves: which ones to zero out is decided only after the multiplication. <span class="math-inline" data-tex="\textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3}"></span> can no longer be multiplied in advance, and the doll stops collapsing.</p>
      <div class="math-display" data-tex="\sigma(\mathbf h \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2})\, \textcolor{#0D9488}{W_3} \ne \mathbf h\,(\textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3}) + \dots"></div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells" data-focus="shells">
      <div class="step-kicker">Step 4 · structure</div>
      <h4>A real nesting doll</h4>
      <p>Each hidden shell is now "multiply, add, pass through <span class="math-inline" data-tex="\sigma"></span>". The outer shell has no ReLU: the output needs scores of any sign.</p>
      <div class="math-display" data-tex="y = \sigma\Big(\sigma\big(\sigma(x \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1})\, \textcolor{#8B5CF6}{W_2} + \textcolor{#8B5CF6}{b_2}\big)\, \textcolor{#0D9488}{W_3} + \textcolor{#0D9488}{b_3}\Big)\, \textcolor{#DB2777}{W_4} + \textcolor{#DB2777}{b_4}"></div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells soft" data-focus="soft">
      <div class="step-kicker">Step 5 · result</div>
      <h4>Softmax turns scores into probabilities</h4>
      <p>The scores <span class="math-inline" data-tex="y"></span> can be anything, including negative. Softmax takes the exponent of each and divides by the sum, which gives positive numbers that add up to 1.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Scores (with ReLU)</span>
            <div class="math-display worked-math" data-tex="y = [0.3262,\ -0.0321,\ -0.0621]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Softmax</span>
            <div class="math-display worked-math" data-tex="\begin{gathered}p_k = \frac{e^{y_k}}{\sum_j e^{y_j}} \\ p = [0.4207,\ 0.2940,\ 0.2853]\end{gathered}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the scores differ from Part 3 because of ReLU on the third layer. The network still believes most in high: the weights are not trained yet.</p>
      </div>
    </div>
    <div class="step-panel" data-on="relu l3 block shells soft loss" data-focus="loss">
      <div class="step-kicker">Step 6 · error</div>
      <h4>Loss: how wrong the network is</h4>
      <p>The correct answer is medium. Cross-entropy looks only at the probability of the correct class: the closer it is to 1, the smaller the loss. This is the number the backward pass will reduce.</p>
      <div class="math-display" data-tex="L = -\sum_k t_k \ln p_k = -\ln p_{\text{medium}} = -\ln 0.2940 = 1.2241"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout">
  <strong>Key idea of this part:</strong> the activation between layers is what
  keeps the doll from collapsing into a single matrix. Each hidden shell is <span class="math-inline" data-tex="\sigma(\cdot\, W + b)"></span>,
  the outer one is <span class="math-inline" data-tex="\cdot\, W + b"></span>, and softmax and the loss turn the output into probabilities and one
  error number.
</div>

<hr>

<h2 id="part-6">Part 6. Batch: from a row to a matrix</h2>

<p>
  So far one apartment has gone through the network. In practice the network receives a whole
  <strong>batch</strong> of <span class="math-inline" data-tex="B"></span> objects at once. This is where writing objects as rows from
  Part 1 pays off: the objects simply become rows of the matrix <span class="math-inline" data-tex="X"></span>, and the formulas stay the same.
</p>

<div class="math-display" data-tex="x \in \mathbb{R}^{1\times m} \;\longrightarrow\; X \in \mathbb{R}^{B\times m}, \qquad \mathbf H^{(1)} = \sigma(X \textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}) \in \mathbb{R}^{B\times H_1}"></div>

<div class="stage" id="stageBatch" tabindex="0">
  <div class="stage-figure">
<svg id="bt" viewBox="0 0 960 520" role="img" aria-label="A batch of two apartments: matrix X is multiplied by the same W1">
  <style>
    #bt { font-family: Helvetica, Arial, sans-serif; }
    #bt .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bt .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bt .lbl { font-size: 17px; fill: #111111; }
    #bt .v { font-size: 13px; fill: #111111; }
    #bt .cap { font-size: 14px; fill: #5E5850; }
    #bt .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #bt .capY { font-size: 14px; fill: #8C7106; font-weight: 700; }
    #bt .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #bt .dash { stroke-dasharray: 5 4; }
    #bt .legend { font-size: 13px; fill: #5E5850; }
    #bt .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #bt .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #bt .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
  </style>
  <defs>
    <marker id="bt-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="bt-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="bt-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bt-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="bt-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="bt-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#E8590C"/></marker>
    <marker id="bt-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED"/></marker>
    <marker id="bt-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0D9488"/></marker>
    <marker id="bt-l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#DB2777"/></marker>
  </defs>
  <g data-key="w">
    <foreignObject x="243.5" y="60.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1} \cdot 3 \times 4"></div></foreignObject>
    <rect x="216" y="123" width="48" height="34" class="l1"/><text x="240.0" y="145" class="v" text-anchor="middle">0.02</text>
    <rect x="264" y="123" width="48" height="34" class="l1"/><text x="288.0" y="145" class="v" text-anchor="middle">−0.01</text>
    <rect x="312" y="123" width="48" height="34" class="l1"/><text x="336.0" y="145" class="v" text-anchor="middle">0.03</text>
    <rect x="360" y="123" width="48" height="34" class="l1"/><text x="384.0" y="145" class="v" text-anchor="middle">0</text>
    <rect x="216" y="157" width="48" height="34" class="l1"/><text x="240.0" y="179" class="v" text-anchor="middle">0.5</text>
    <rect x="264" y="157" width="48" height="34" class="l1"/><text x="288.0" y="179" class="v" text-anchor="middle">0.3</text>
    <rect x="312" y="157" width="48" height="34" class="l1"/><text x="336.0" y="179" class="v" text-anchor="middle">−0.4</text>
    <rect x="360" y="157" width="48" height="34" class="l1"/><text x="384.0" y="179" class="v" text-anchor="middle">0.1</text>
    <rect x="216" y="191" width="48" height="34" class="l1"/><text x="240.0" y="213" class="v" text-anchor="middle">−0.1</text>
    <rect x="264" y="191" width="48" height="34" class="l1"/><text x="288.0" y="213" class="v" text-anchor="middle">0.2</text>
    <rect x="312" y="191" width="48" height="34" class="l1"/><text x="336.0" y="213" class="v" text-anchor="middle">0.05</text>
    <rect x="360" y="191" width="48" height="34" class="l1"/><text x="384.0" y="213" class="v" text-anchor="middle">0.3</text>
    <text x="200" y="163" class="lbl" text-anchor="middle">·</text>
  </g>
  <g data-key="x1">
    <foreignObject x="89" y="60.5" width="46" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700" data-tex="X"></div></foreignObject>
    <text x="30" y="162" class="cap">apt 1</text>
    <rect x="64" y="140" width="48" height="34" class="bx"/><text x="88.0" y="162" class="v" text-anchor="middle">54</text>
    <rect x="112" y="140" width="48" height="34" class="bx"/><text x="136.0" y="162" class="v" text-anchor="middle">2</text>
    <rect x="160" y="140" width="48" height="34" class="bx"/><text x="184.0" y="162" class="v" text-anchor="middle">7</text>
  </g>
  <g data-key="x2">
    <text x="30" y="196" class="cap">apt 2</text>
    <rect x="64" y="174" width="48" height="34" class="bx"/><text x="88.0" y="196" class="v" text-anchor="middle">38</text>
    <rect x="112" y="174" width="48" height="34" class="bx"/><text x="136.0" y="196" class="v" text-anchor="middle">1</text>
    <rect x="160" y="174" width="48" height="34" class="bx"/><text x="184.0" y="196" class="v" text-anchor="middle">2</text>
  </g>
  <g data-key="b">
    <text x="426" y="163" class="lbl" text-anchor="middle">+</text>
    <foreignObject x="471.5" y="60.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{b_1} \cdot 1 \times 4"></div></foreignObject>
    <rect x="444" y="140" width="48" height="34" class="l1"/><text x="468.0" y="162" class="v" text-anchor="middle">0.1</text>
    <rect x="492" y="140" width="48" height="34" class="l1"/><text x="516.0" y="162" class="v" text-anchor="middle">−0.2</text>
    <rect x="540" y="140" width="48" height="34" class="l1"/><text x="564.0" y="162" class="v" text-anchor="middle">0</text>
    <rect x="588" y="140" width="48" height="34" class="l1"/><text x="612.0" y="162" class="v" text-anchor="middle">−0.5</text>
  </g>
  <g data-key="bc" data-only="1">
    <rect x="444" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="468.0" y="196" class="v" text-anchor="middle">0.1</text>
    <rect x="492" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="516.0" y="196" class="v" text-anchor="middle">−0.2</text>
    <rect x="540" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="564.0" y="196" class="v" text-anchor="middle">0</text>
    <rect x="588" y="174" width="48" height="34" class="l1" stroke-dasharray="4 3"/><text x="612.0" y="196" class="v" text-anchor="middle">−0.5</text>
    <text fill="#C2410C" x="540" y="232" class="capY" text-anchor="middle">the same row for every apartment</text>
  </g>
  <g data-key="h1r">
    <text x="654" y="163" class="lbl" text-anchor="middle">=</text>
    <foreignObject x="730" y="60.5" width="76" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="\mathbf H^{(1)}"></div></foreignObject>
    <rect x="672" y="140" width="48" height="34" class="bg"/><text x="696.0" y="162" class="v" text-anchor="middle">1.48</text>
    <rect x="720" y="140" width="48" height="34" class="bg"/><text x="744.0" y="162" class="v" text-anchor="middle">1.26</text>
    <rect x="768" y="140" width="48" height="34" class="bg"/><text x="792.0" y="162" class="v" text-anchor="middle">1.17</text>
    <rect x="816" y="140" width="48" height="34" class="bg"/><text x="840.0" y="162" class="v" text-anchor="middle">1.80</text>
  </g>
  <g data-key="h2r">
    <rect x="672" y="174" width="48" height="34" class="bg"/><text x="696.0" y="196" class="v" text-anchor="middle">1.16</text>
    <rect x="720" y="174" width="48" height="34" class="bg"/><text x="744.0" y="196" class="v" text-anchor="middle">0.12</text>
    <rect x="768" y="174" width="48" height="34" class="bg"/><text x="792.0" y="196" class="v" text-anchor="middle">0.84</text>
    <rect x="816" y="174" width="48" height="34" class="bg"/><text x="840.0" y="196" class="v" text-anchor="middle">0.20</text>
  </g>
  <g data-key="rows" data-only="1">
    <path d="M 112 136 Q 112 102 216 104" class="eB dash" marker-end="url(#bt-aB)"/>
    <path d="M 112 212 Q 112 250 216 232" class="eB dash" marker-end="url(#bt-aB)"/>
    <foreignObject x="107.5" y="232.5" width="409" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700"><span>both rows go through the same <span data-tex="\textcolor{#C2410C}{W_1}"></span></span></div></foreignObject>
  </g>
  <g data-key="shape">
    <foreignObject x="93" y="262.5" width="86" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#2A5E9B;font-weight:700" data-tex="B \times  m"></div></foreignObject>
    <foreignObject x="264" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="m \times  H_{1}"></div></foreignObject>
    <foreignObject x="492" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="1 \times  H_{1}"></div></foreignObject>
    <foreignObject x="720" y="262.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700" data-tex="B \times  H_{1}"></div></foreignObject>
    <foreignObject x="265.5" y="286.5" width="429" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="B"></span> — number of objects in the batch, here <span data-tex="B = 2"></span></span></div></foreignObject>
  </g>
  <g data-key="chain">
    <text x="30" y="352" class="hdr">THE WHOLE DOLL WITH A BATCH</text>
    <rect x="40" y="370" width="120" height="44" rx="6" class="bx"/><foreignObject x="53" y="375.2" width="94" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  m"></div></foreignObject>
    <line x1="164" y1="392" x2="220" y2="392" stroke="#E8590C" stroke-width="2" fill="none" marker-end="url(#bt-l1)"/><foreignObject x="164" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="224" y="370" width="120" height="44" rx="6" class="l1"/><foreignObject x="231.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  H_{1}"></div></foreignObject>
    <line x1="348" y1="392" x2="404" y2="392" stroke="#7C3AED" stroke-width="2" fill="none" marker-end="url(#bt-l2)"/><foreignObject x="348" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="408" y="370" width="120" height="44" rx="6" class="l2"/><foreignObject x="415.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  H_{2}"></div></foreignObject>
    <line x1="532" y1="392" x2="588" y2="392" stroke="#0D9488" stroke-width="2" fill="none" marker-end="url(#bt-l3)"/><foreignObject x="532" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="592" y="370" width="120" height="44" rx="6" class="l3"/><foreignObject x="599.5" y="375.2" width="105" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  H_{3}"></div></foreignObject>
    <line x1="716" y1="392" x2="772" y2="392" stroke="#DB2777" stroke-width="2" fill="none" marker-end="url(#bt-l4)"/><foreignObject x="716" y="362.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <rect x="776" y="370" width="120" height="44" rx="6" class="bg"/><foreignObject x="789" y="375.2" width="94" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="B \times  K"></div></foreignObject>
    <foreignObject x="225" y="430.5" width="510" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5A8C1C;font-weight:700"><span>still 80 parameters: the weights do not depend on <span data-tex="B"></span></span></div></foreignObject>
    <text x="480" y="474" class="cap" text-anchor="middle">softmax and ReLU are applied to each row separately</text>
  </g>
  <text x="30" y="508" class="legend">blue — objects · layers: orange — 1 · purple — 2 · teal — 3 · pink — 4 (output) · green — output</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="w x1 b h1r" data-focus="x1 h1r">
      <div class="step-kicker">Step 1 · data</div>
      <h4>One apartment — one row</h4>
      <p>Let's start with what we already had: the row <span class="math-inline" data-tex="x"></span> of the first apartment is multiplied by <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>, <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> is added, and we get the row <span class="math-inline" data-tex="\mathbf h^{(1)}"></span> of four numbers.</p>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r" data-focus="x2">
      <div class="step-kicker">Step 2 · data</div>
      <h4>A second apartment — a second row</h4>
      <p>Add a second apartment: 38 m², 1 room, 2nd floor. It goes into the table as a row under the first one. This is how <span class="math-inline" data-tex="x"></span> turns into a matrix <span class="math-inline" data-tex="X"></span> of shape <span class="math-inline" data-tex="B \times m"></span>, where <span class="math-inline" data-tex="B"></span> is the number of apartments in the batch.</p>
      <div class="math-display" data-tex="X = \begin{bmatrix}54 &amp; 2 &amp; 7\\ 38 &amp; 1 &amp; 2\end{bmatrix} \in \mathbb{R}^{2\times 3}"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r rows" data-focus="rows h2r">
      <div class="step-kicker">Step 3 · operation</div>
      <h4>Each row goes through the same <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span></h4>
      <p>Matrix multiplication handles each row of <span class="math-inline" data-tex="X"></span> separately: row <span class="math-inline" data-tex="i"></span> of the result is row <span class="math-inline" data-tex="i"></span> of <span class="math-inline" data-tex="X"></span> multiplied by <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>. The apartments do not affect each other, but they share the weights.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the second apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substitute</span>
            <div class="math-display worked-math" data-tex="[38,\ 1,\ 2]\,\textcolor{#EA580C}{W_1} + \textcolor{#EA580C}{b_1}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="\mathbf h^{(1)}_2 = [1.16,\ 0.12,\ 0.84,\ 0.20]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the first row of <span class="math-inline" data-tex="\mathbf H^{(1)}"></span> is unchanged — [1.48, 1.26, 1.17, 1.80]. Adding the second apartment did not change it.</p>
      </div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape" data-focus="shape">
      <div class="step-kicker">Step 4 · shapes</div>
      <h4>Dominoes with a batch</h4>
      <p>The shapes match exactly as before, only the 1 on the left is replaced by <span class="math-inline" data-tex="B"></span>. The inner size <span class="math-inline" data-tex="m"></span> still cancels.</p>
      <div class="math-display" data-tex="[B\times m]\cdot[m\times H_1] = [B\times H_1]"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape bc" data-focus="bc">
      <div class="step-kicker">Step 5 · bias</div>
      <h4>The bias is copied into every row</h4>
      <p><span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> has shape <span class="math-inline" data-tex="1 \times H_{1}"></span>, while <span class="math-inline" data-tex="X \textcolor{#EA580C}{W_1}"></span> has shape <span class="math-inline" data-tex="B \times H_{1}"></span>. The row <span class="math-inline" data-tex="\textcolor{#EA580C}{b_1}"></span> is added to every row: each apartment gets the same offset. In NumPy and PyTorch broadcasting does this automatically.</p>
      <div class="math-display" data-tex="\mathbf H^{(1)} = \sigma\big(X \textcolor{#EA580C}{W_1} + \mathbf{1}\, \textcolor{#EA580C}{b_1}\big), \qquad \mathbf{1} \in \mathbb{R}^{B\times 1}"></div>
    </div>
    <div class="step-panel" data-on="w x1 x2 b h1r h2r shape chain" data-focus="chain">
      <div class="step-kicker">Step 6 · the whole network</div>
      <h4>The batch goes through the whole doll</h4>
      <p>All the formulas of Parts 3–5 stay the same, only the rows become matrices with <span class="math-inline" data-tex="B"></span> rows. The number of parameters does not depend on <span class="math-inline" data-tex="B"></span>: the same 80 weights process one apartment or a thousand.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · both apartments</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Input</span>
            <div class="math-display worked-math" data-tex="X \in \mathbb{R}^{2\times 3}"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Output</span>
            <div class="math-display worked-math" data-tex="P = \begin{bmatrix}0.4207 &amp; 0.2940 &amp; 0.2853\\ 0.3997 &amp; 0.3184 &amp; 0.2818\end{bmatrix}"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the first row of <span class="math-inline" data-tex="P"></span> is the same as in Part 5. The network assigns the second apartment to high as well — the weights are not trained yet.</p>
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout-yellow">
  <strong>In practice:</strong> in PyTorch <code>nn.Linear(m, H_1)</code> stores
  its weights with shape <span class="math-inline" data-tex="H_1 \times m"></span> and computes <code>X @ W.T + b</code>. This is the same <span class="math-inline" data-tex="x W"></span> convention,
  only the matrix is stored transposed.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> a batch is the same rows stacked into a
  matrix. Each row passes through the same weights independently of the
  others, shapes change from <span class="math-inline" data-tex="1 \times H_k"></span> to <span class="math-inline" data-tex="B \times H_k"></span>, and the number of parameters stays
  the same.
</div>

<hr>

<h2 id="part-7">Part 7. Backward pass: opening the doll from the outside in</h2>

<p>
  The forward pass assembles the doll from the inside out: <span class="math-inline" data-tex="x"></span>, then the first layer, then the
  second. The backward pass goes in the opposite order: first the loss, then the
  outer shell, and so on down to the innermost one. On each shell two
  things are computed: the <strong>gradient with respect to the weights</strong> of that layer and
  the <strong>error <span class="math-inline" data-tex="\delta"></span></strong> that has to be passed on to the next, more inner
  shell.
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial W_k} = \mathbf h^{(k-1)\top}\,\delta_k, \qquad \delta_{k-1} = \big(\delta_k W_k^{\top}\big) \odot \sigma^{\prime}(z_{k-1})"></div>

<div class="callout-blue">
  <strong>Check:</strong> all gradients below were compared with numerical ones (finite
  differences for each of the 64 weights). The largest discrepancy is <span class="math-inline" data-tex="2\cdot 10^{-10}"></span>.
</div>

<p>Let's open the doll step by step.</p>

<div class="stage" id="stageBack" tabindex="0">
  <div class="stage-figure">
<svg id="bw" viewBox="0 0 960 600" role="img" aria-label="Backward pass: the gradient flows from the loss to the weights, the doll opens from the outside in">
  <style>
    #bw { font-family: Helvetica, Arial, sans-serif; }
    #bw .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #bw .bg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #bw .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.8; }
    #bw .bn { fill: #FFFFFF; stroke: #B9B2A4; stroke-width: 1.2; }
    #bw .hdr { font-size: 13px; fill: #5E5850; letter-spacing: .04em; }
    #bw .eB { stroke: #3576C0; stroke-width: 1.8; fill: none; }
    #bw .eR { stroke: #C30B0A; stroke-width: 2; fill: none; }
    #bw .dash { stroke-dasharray: 5 4; }
    #bw .legend { font-size: 13px; fill: #5E5850; }
    #bw .l1  { fill: #FFF0E3; stroke: #E8590C; stroke-width: 1.8; }
    #bw .l1s { fill: none; stroke: #E8590C; stroke-width: 2.2; }
    #bw .l2  { fill: #F1EBFE; stroke: #7C3AED; stroke-width: 1.8; }
    #bw .l2s { fill: none; stroke: #7C3AED; stroke-width: 2.2; }
    #bw .l3  { fill: #E0F7F4; stroke: #0D9488; stroke-width: 1.8; }
    #bw .l3s { fill: none; stroke: #0D9488; stroke-width: 2.2; }
    #bw .l4  { fill: #FDEBF4; stroke: #DB2777; stroke-width: 1.8; }
    #bw .l4s { fill: none; stroke: #DB2777; stroke-width: 2.2; }
  </style>
  <defs>
    <marker id="bw-aB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="bw-aY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
    <marker id="bw-aR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="bw-aG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
    <marker id="bw-aN" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
  </defs>
  <g data-key="fwd">
    <text x="30" y="50" class="hdr">FORWARD PASS AND LOSS</text>
    <rect x="22.0" y="90" width="76" height="46" rx="8" class="bx"/><foreignObject x="36" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="192.0" y="90" width="76" height="46" rx="8" class="l1"/><foreignObject x="189" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="\mathbf h^{(1)}"></div></foreignObject>
    <rect x="362.0" y="90" width="76" height="46" rx="8" class="l2"/><foreignObject x="359" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="\mathbf h^{(2)}"></div></foreignObject>
    <rect x="532.0" y="90" width="76" height="46" rx="8" class="l3"/><foreignObject x="529" y="96.2" width="82" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="\mathbf h^{(3)}"></div></foreignObject>
    <rect x="702.0" y="90" width="76" height="46" rx="8" class="bg"/><foreignObject x="716" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="p"></div></foreignObject>
    <rect x="842.0" y="90" width="76" height="46" rx="8" class="br"/><foreignObject x="856" y="96.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject>
    <line x1="100.0" y1="102" x2="189.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="270.0" y1="102" x2="359.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="440.0" y1="102" x2="529.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="610.0" y1="102" x2="699.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <line x1="780.0" y1="102" x2="839.0" y2="102" class="eB" marker-end="url(#bw-aB)"/>
    <rect x="115.0" y="200" width="60" height="34" rx="6" class="l1"/><foreignObject x="115.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#C2410C;font-weight:700" data-tex="\textcolor{#C2410C}{W_1}"></div></foreignObject>
    <rect x="285.0" y="200" width="60" height="34" rx="6" class="l2"/><foreignObject x="285.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#6D28D9;font-weight:700" data-tex="\textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <rect x="455.0" y="200" width="60" height="34" rx="6" class="l3"/><foreignObject x="455.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#0F766E;font-weight:700" data-tex="\textcolor{#0F766E}{W_3}"></div></foreignObject>
    <rect x="625.0" y="200" width="60" height="34" rx="6" class="l4"/><foreignObject x="625.5" y="200.2" width="59" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#BE185D;font-weight:700" data-tex="\textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="721.5" y="60.5" width="177" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>softmax + loss</span></div></foreignObject>
    <text x="30" y="296" class="hdr">NESTING DOLL</text>
    <rect x="256" y="340" width="40" height="36" rx="6" class="bx"/><foreignObject x="252" y="341.2" width="48" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:700" data-tex="x"></div></foreignObject>
    <rect x="242" y="332" width="170" height="52" rx="10" class="l1s"/>
    <foreignObject x="306" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#C2410C;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#C2410C}{W_1} + \textcolor{#C2410C}{b_1})"></div></foreignObject>
    <rect x="228" y="324" width="300" height="68" rx="12" class="l2s"/>
    <foreignObject x="422" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#6D28D9;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#6D28D9}{W_2} + \textcolor{#6D28D9}{b_2})"></div></foreignObject>
    <rect x="214" y="316" width="430" height="84" rx="14" class="l3s"/>
    <foreignObject x="538" y="341.6" width="166" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#0F766E;font-weight:700" data-tex="\sigma(\cdot\, \textcolor{#0F766E}{W_3} + \textcolor{#0F766E}{b_3})"></div></foreignObject>
    <rect x="200" y="308" width="560" height="100" rx="16" class="l4s"/>
    <foreignObject x="654" y="341.6" width="133" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#BE185D;font-weight:700" data-tex="\cdot\, \textcolor{#BE185D}{W_4} + \textcolor{#BE185D}{b_4}"></div></foreignObject>
  </g>
  <g data-key="d4">
    <line x1="840.0" y1="126" x2="781.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="671.5" y="140.5" width="137" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_4 = p - t"></div></foreignObject>
    <rect x="200" y="308" width="560" height="100" rx="16" class="eR dash" stroke-width="3"/>
  </g>
  <g data-key="g4">
    <line x1="667.0" y1="128" x2="667.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="607" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#BE185D}{W_4}"></div></foreignObject>
    <foreignObject x="567" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(3)\top}\delta_4 \;\cdot\; 4 \times 3"></div></foreignObject>
  </g>
  <g data-key="d3">
    <line x1="700.0" y1="126" x2="611.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="542" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{3}"></div></foreignObject>
    <rect x="214" y="316" width="430" height="84" rx="14" class="eR dash" stroke-width="3"/>
    <foreignObject x="539" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#BE185D}{W_4}^{\top} \odot \sigma&#x27;"></div></foreignObject>
  </g>
  <g data-key="g3">
    <line x1="497.0" y1="128" x2="497.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="437" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#0F766E}{W_3}"></div></foreignObject>
    <foreignObject x="397" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(2)\top}\delta_3 \;\cdot\; 5 \times 4"></div></foreignObject>
  </g>
  <g data-key="rest">
    <line x1="530.0" y1="126" x2="441.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="372" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{2}"></div></foreignObject>
    <rect x="228" y="324" width="300" height="68" rx="12" class="eR dash" stroke-width="3"/>
    <foreignObject x="369" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#0F766E}{W_3}^{\top} \odot \sigma&#x27;"></div></foreignObject>
    <line x1="360.0" y1="126" x2="271.0" y2="126" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="202" y="140.5" width="56" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\delta_{1}"></div></foreignObject>
    <rect x="242" y="332" width="170" height="52" rx="10" class="eR dash" stroke-width="3"/>
    <foreignObject x="199" y="137.8" width="120" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="justify-content:flex-end;font-size:13px;color:#C30B0A;font-weight:400" data-tex="\cdot\, \textcolor{#6D28D9}{W_2}^{\top} \odot \sigma&#x27;"></div></foreignObject>
    <line x1="327.0" y1="128" x2="327.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="267" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#6D28D9}{W_2}"></div></foreignObject>
    <foreignObject x="227" y="253.8" width="176" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="\mathbf h^{(1)\top}\delta_2 \;\cdot\; 4 \times 5"></div></foreignObject>
    <line x1="157.0" y1="128" x2="157.0" y2="196" class="eR" marker-end="url(#bw-aR)"/>
    <foreignObject x="97" y="234.5" width="96" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#C30B0A;font-weight:700" data-tex="\partial L / \partial \textcolor{#C2410C}{W_1}"></div></foreignObject>
    <foreignObject x="71" y="253.8" width="148" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#111111;font-weight:400" data-tex="x^{\top}\delta_1 \;\cdot\; 3 \times 4"></div></foreignObject>
  </g>
  <g data-key="chain" data-only="1">
    <rect x="40" y="440" width="880" height="56" rx="6" class="br"/>
    <foreignObject x="60" y="444" width="840" height="52"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="\frac{\partial L}{\partial \textcolor{#C2410C}{W_1}} \ne \frac{\partial L}{\partial y}\cdot\frac{\partial y}{\partial \textcolor{#0F766E}{W_3}}\cdot\frac{\partial \mathbf h^{(3)}}{\partial \textcolor{#0F766E}{W_3}}\cdots"></div></foreignObject>
    <rect x="40" y="506" width="880" height="60" rx="6" class="bg"/>
    <foreignObject x="60" y="508" width="840" height="58"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="\frac{\partial L}{\partial \textcolor{#C2410C}{W_1}} = \frac{\partial L}{\partial y}\cdot\frac{\partial y}{\partial \mathbf h^{(3)}}\cdot\frac{\partial \mathbf h^{(3)}}{\partial \mathbf h^{(2)}}\cdot\frac{\partial \mathbf h^{(2)}}{\partial \mathbf h^{(1)}}\cdot\frac{\partial \mathbf h^{(1)}}{\partial \textcolor{#C2410C}{W_1}}"></div></foreignObject>
  </g>
  <g data-key="upd" data-only="1">
    <rect x="40" y="446" width="880" height="110" rx="6" class="bn"/>
    <foreignObject x="60" y="456" width="840" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-lg svg-math-center" data-tex="W_k \leftarrow W_k - \eta\,\frac{\partial L}{\partial W_k}"></div></foreignObject>
    <foreignObject x="84" y="510.5" width="792" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#5E5850;font-weight:400"><span>with a batch <span data-tex="\mathbf h^{\top}\delta"></span> sums the contributions of all <span data-tex="B"></span> rows: the gradient has the same shape as <span data-tex="W"></span></span></div></foreignObject>
  </g>
  <text x="30" y="588" class="legend">blue — forward pass · color — layer number · red — gradient and loss · dashed — opened shell</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="fwd" data-focus="fwd">
      <div class="step-kicker">Step 1 · what is given</div>
      <h4>We differentiate the loss, not the output</h4>
      <p>The forward pass assembled the doll and produced the loss <span class="math-inline" data-tex="L = 1.2241"></span>. The goal of training is to find out how <span class="math-inline" data-tex="L"></span> changes with each weight, that is, to find <span class="math-inline" data-tex="\partial L/\partial W_{k}"></span> for every <span class="math-inline" data-tex="k"></span>. It is <span class="math-inline" data-tex="L"></span> that has to be differentiated: the output <span class="math-inline" data-tex="y"></span> has no "right direction" of its own, it appears only in comparison with the answer.</p>
    </div>
    <div class="step-panel" data-on="fwd d4" data-focus="d4">
      <div class="step-kicker">Step 2 · gradient</div>
      <h4>The outer shell: <span class="math-inline" data-tex="\delta_4 = p - t"></span></h4>
      <p>We start with the outermost shell. Let <span class="math-inline" data-tex="\delta_k = \partial L/\partial z_k"></span> be the gradient with respect to the row of layer <span class="math-inline" data-tex="k"></span> before the activation. For softmax combined with cross-entropy it turns out remarkably simple: the probabilities minus the correct answer.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substitute</span>
            <div class="math-display worked-math" data-tex="p - t = [0.4207,\ 0.2940,\ 0.2853] - [0,\ 1,\ 0]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="\delta_4 = [0.4207,\ -0.7060,\ 0.2853]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the sign tells which way to move a score: medium has −0.706, so it must go up; high and low must go down.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4" data-focus="g4">
      <div class="step-kicker">Step 3 · weights</div>
      <h4>The gradient for <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span> is the layer's input times its <span class="math-inline" data-tex="\delta"></span></h4>
      <p>The weight <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}[i, j]"></span> multiplied <span class="math-inline" data-tex="h^{(3)}_i"></span> and went into score <span class="math-inline" data-tex="j"></span>. So its gradient is the product of what came in at the input and what came back from behind. For the whole matrix this is an outer product, and its shape matches <span class="math-inline" data-tex="\textcolor{#DB2777}{W_4}"></span>.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial \textcolor{#DB2777}{W_4}} = \mathbf h^{(3)\top}\,\delta_4 \quad [4\times 1]\cdot[1\times 3] = [4\times 3]"></div>
      <div class="worked-example">
        <div class="worked-label">Worked example · the second row</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Input <span class="math-inline" data-tex="h^{(3)}_2"></span></span>
            <div class="math-display worked-math" data-tex="h^{(3)}_2 = 0"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Gradient row</span>
            <div class="math-display worked-math" data-tex="\frac{\partial L}{\partial \textcolor{#DB2777}{W_4}}[2,:] = [0,\ 0,\ 0]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> ReLU zeroed out the second neuron of the third layer. Since it passed nothing forward, its outgoing weights did not affect the loss — and their gradient is zero.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3" data-focus="d3">
      <div class="step-kicker">Step 4 · gradient</div>
      <h4>Passing the error inward</h4>
      <p>To remove the next shell we need <span class="math-inline" data-tex="\delta_{3}"></span>. The error goes back through the same weights, transposed, and then through the derivative of ReLU: 1 where <span class="math-inline" data-tex="z"></span> was positive and 0 where the neuron was zeroed out.</p>
      <div class="math-display" data-tex="\delta_3 = \big(\delta_4\, \textcolor{#DB2777}{W_4}^{\top}\big) \odot \sigma^{\prime}(z_3)"></div>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Before the mask <span class="math-inline" data-tex="\sigma&#x27;"></span></span>
            <div class="math-display worked-math" data-tex="\delta_4 \textcolor{#DB2777}{W_4}^{\top} = [0.3801,\ -0.3515,\ -0.1006,\ 0.3395]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>After the mask</span>
            <div class="math-display worked-math" data-tex="\delta_3 = [0.3801,\ 0,\ -0.1006,\ 0.3395]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> ReLU blocks the path both forward and backward: the signal −0.3515 reached the zeroed neuron and went no further.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3" data-focus="g3">
      <div class="step-kicker">Step 5 · weights</div>
      <h4>The gradient for <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> and a dead column</h4>
      <p>Same pattern: the layer's input times its <span class="math-inline" data-tex="\delta"></span>. The shape is <span class="math-inline" data-tex="5 \times 4"></span>, like <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span>.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial \textcolor{#0D9488}{W_3}} = \mathbf h^{(2)\top}\,\delta_3 \quad [5\times 1]\cdot[1\times 4] = [5\times 4]"></div>
      <div class="worked-example">
        <div class="worked-label">Worked example · the first row of the gradient</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span><span class="math-inline" data-tex="h^{(2)}_1 \cdot \delta_3"></span></span>
            <div class="math-display worked-math" data-tex="0.732\cdot[0.3801,\ 0,\ -0.1006,\ 0.3395]"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="[0.2782,\ 0,\ -0.0736,\ 0.2485]"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the entire second column of <span class="math-inline" data-tex="\partial L/\partial \textcolor{#0D9488}{W_3}"></span> is zero. These are the incoming weights of that same zeroed neuron: for this apartment they are not trained.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest" data-focus="rest">
      <div class="step-kicker">Step 6 · repetition</div>
      <h4>The remaining shells follow the same pattern</h4>
      <p>The two remaining shells are computed with the same two formulas: <span class="math-inline" data-tex="\delta_2 = (\delta_3 \textcolor{#0D9488}{W_3}^{\top}) \odot \sigma&#x27;(z_2)"></span>, <span class="math-inline" data-tex="\delta_1 = (\delta_2 \textcolor{#8B5CF6}{W_2}^{\top}) \odot \sigma&#x27;(z_1)"></span>, and the gradient of each layer is its input, transposed, times its <span class="math-inline" data-tex="\delta"></span>.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same apartment</div>
        <div class="worked-trace">
          <div class="worked-trace-title">The error moves inward</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\delta_{2}"></span></div>
            <div class="math-display worked-trace-math" data-tex="[0.1659,\ -0.2219,\ 0.1361,\ 0.1379,\ -0.1600]"></div>
            <div class="worked-trace-note">5 numbers, like layer 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\delta_{1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="[0.1789,\ -0.1737,\ -0.0776,\ 0.1699]"></div>
            <div class="worked-trace-note">4 numbers, like layer 1</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name"><span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span></div>
            <div class="math-display worked-trace-math" data-tex="x^{\top}\delta_1,\ \text{row 1} = [9.6603,\ -9.3778,\ -4.1927,\ 9.1763]"></div>
            <div class="worked-trace-note">27 times larger than row 2</div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the first row of <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> is huge because <span class="math-inline" data-tex="x_1 = 54"></span> is the area. The gradient for a weight is proportional to its input, which is why features are brought to a common scale before training.</p>
      </div>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest chain" data-focus="chain">
      <div class="step-kicker">Step 7 · rule</div>
      <h4>The chain runs through <span class="math-inline" data-tex="\mathbf h"></span>, not through neighbouring <span class="math-inline" data-tex="W"></span></h4>
      <p>A common mistake is to run the chain rule from weight to weight. But <span class="math-inline" data-tex="\textcolor{#0D9488}{W_3}"></span> does not depend on <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span>: layers are connected only through the rows <span class="math-inline" data-tex="\mathbf h"></span>. The correct chain passes through all shells from the outside in and turns towards <span class="math-inline" data-tex="\textcolor{#EA580C}{W_1}"></span> only at the very end.</p>
    </div>
    <div class="step-panel" data-on="fwd d4 g4 d3 g3 rest upd" data-focus="upd">
      <div class="step-kicker">Step 8 · training</div>
      <h4>A gradient descent step and the batch</h4>
      <p>With all <span class="math-inline" data-tex="\partial L/\partial W_{k}"></span> in hand, each weight is moved against its gradient with step size <span class="math-inline" data-tex="\eta"></span>. With a batch the formulas are the same, only <span class="math-inline" data-tex="\mathbf h"></span> and <span class="math-inline" data-tex="\delta"></span> become matrices with <span class="math-inline" data-tex="B"></span> rows: the product <span class="math-inline" data-tex="\mathbf h^{\top}\delta"></span> itself sums the contributions of all objects.</p>
      <div class="math-display" data-tex="\frac{\partial L}{\partial W_k} = \mathbf H^{(k-1)\top}\,\Delta_k \quad [H_{k-1}\times B]\cdot[B\times H_k] = [H_{k-1}\times H_k]"></div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout-yellow">
  <strong>Pitfall:</strong> the huge first row of <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> is not a computational
  error: it comes from the area being measured in square metres, while the
  number of rooms is a count. Without feature normalization, a learning rate that suits
  some weights will be too large for others.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> the backward pass opens the doll in
  reverse order. On each shell the weight gradient is the layer's input,
  transposed, times its <span class="math-inline" data-tex="\delta"></span>, and <span class="math-inline" data-tex="\delta"></span> is passed inward through <span class="math-inline" data-tex="W^{\top}"></span> and the derivative of the
  activation.
</div>

<hr>

<h2 id="part-8">Part 8. What you should be able to rebuild from memory</h2>

<ol class="end-list">
  <li><strong>An object is a row:</strong> <span class="math-inline" data-tex="x \in \mathbb{R}^{1\times m}"></span>, the answer is a row of length <span class="math-inline" data-tex="K"></span>, the correct answer is written one-hot.</li>
  <li><strong>A layer is a matrix:</strong> <span class="math-inline" data-tex="W"></span> of shape "inputs × neurons"; a row is everything leaving one input, a column is everything entering one neuron.</li>
  <li><strong>Indices <span class="math-inline" data-tex="w^{(k)}_{ij}"></span>:</strong> layer <span class="math-inline" data-tex="k"></span>, from input <span class="math-inline" data-tex="i"></span> to neuron <span class="math-inline" data-tex="j"></span>.</li>
  <li><strong>Shape dominoes:</strong> <span class="math-inline" data-tex="[1\times m][m\times H_1][H_1\times H_2]\dots[H_3\times K] \to [1\times K]"></span>; <span class="math-inline" data-tex="W"></span> has as many rows as there are neurons in the previous layer.</li>
  <li><strong>One convention for the whole network:</strong> either <span class="math-inline" data-tex="x W"></span> or <span class="math-inline" data-tex="W x"></span>. Mix them and the dominoes fall apart.</li>
  <li><strong>Without activations</strong> any number of layers collapse into one: <span class="math-inline" data-tex="x\,\textcolor{#EA580C}{W_1} \textcolor{#8B5CF6}{W_2} \textcolor{#0D9488}{W_3} \textcolor{#DB2777}{W_4} = x\,W_{\text{eff}}"></span>.</li>
  <li><strong>A network shell:</strong> <span class="math-inline" data-tex="\mathbf h^{(k)} = \sigma(\mathbf h^{(k-1)} W_k + b_k)"></span>, with softmax and cross-entropy at the output.</li>
  <li><strong>Batch:</strong> <span class="math-inline" data-tex="X \in \mathbb{R}^{B\times m}"></span>, shapes <span class="math-inline" data-tex="B \times H_k"></span>, the parameters do not depend on <span class="math-inline" data-tex="B"></span>.</li>
  <li><strong>Backward pass:</strong> <span class="math-inline" data-tex="\delta_4 = p - t"></span>, <span class="math-inline" data-tex="\partial L/\partial W_k = \mathbf h^{(k-1)\top}\,\delta_k"></span>, <span class="math-inline" data-tex="\delta_{k-1} = (\delta_k W_k^{\top}) \odot \sigma&#x27;(z_{k-1})"></span>.</li>
  <li><strong>The chain runs through <span class="math-inline" data-tex="\mathbf h"></span>:</strong> <span class="math-inline" data-tex="\partial L/\partial \textcolor{#EA580C}{W_1}"></span> passes through every shell <span class="math-inline" data-tex="\partial \mathbf h^{(k)}/\partial \mathbf h^{(k-1)}"></span>, not through neighbouring weights.</li>
</ol>

<p>
  The picture to take away: a network is a nesting doll of identical shells
  <span class="math-inline" data-tex="\sigma(\cdot\, W + b)"></span>. The forward pass nests them into one another from the inside out,
  the activation keeps them from sticking together into a single doll, and the backward pass opens
  them from the outside in, leaving on each shell the gradient for its weights.
</p>

<p class="tiny">The apartment parameters, weights and biases in the examples are illustrative. All numbers were computed with a NumPy script and rounded to 4 decimals; the gradients were checked against finite differences.</p>
