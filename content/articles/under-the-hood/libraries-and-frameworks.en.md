<style>
  .prose .stage-figure .is-focus .svg-math > span:not(.katex) { font-weight: 700; }
</style>
<p class="lead">
  A library is someone else's code that sits as an ordinary folder in <code>site-packages</code>
  and, after <code>import</code>, becomes an object with attributes and methods. A framework is
  the same kind of library that also takes over part of your program and calls your code itself.
  I will show this on a single operation, matrix multiplication, and go from three nested loops
  to <code>model.fit(X, y)</code> in scikit-learn.
</p>

<p>
  Behind the line <code>import sklearn</code> there are four things: files on disk, the rule for
  finding modules, objects with methods, and an agreement about who calls whom. I will go through
  them in order and show what happens at each step; speed is not measured here.
</p>

<p>
  The route is this. First I multiply two matrices in bare Python. Then I move the function into
  a separate file and look at what <code>import</code> does. Then I install NumPy and find where
  its code lives on disk. Then I take apart the <code>ndarray</code> object and the path the call
  <code>A @ B</code> travels. Finally I train a linear regression twice, by hand in NumPy and with
  a scikit-learn object, to see what work the library takes over and how its object is built.
</p>

<div class="semantic-key" aria-label="Color legend of the article">
  <span><i style="background:#3576C0"></i>data, files, your code</span>
  <span><i style="background:#C29E08"></i>operation and parameter</span>
  <span><i style="background:#73B222"></i>result, ready-made from the library</span>
  <span><i style="background:#C30B0A"></i>error and gradient</span>
</div>

<div class="callout-blue">
  <strong>How to use the interactive scenes:</strong> press "Next" and look only at the highlighted part.
  The layout of the blocks does not change from step to step. Each step is explained below the buttons. The ← → arrow keys
  work when a scene has focus.
</div>

<h2 id="part-1">Part 1. Matrix multiplication by hand</h2>

<p>
  I start with no library at all. There is only Python, lists and loops. I store a matrix as a
  list of rows: <code>A[i]</code> is a row, <code>A[i][k]</code> is the number in row
  <code>i</code> and column <code>k</code>.
</p>

<p>
  There is one rule: the result element in row <code>i</code> and column <code>j</code> equals
  the <strong>dot product</strong> of row <code>i</code> of the left matrix and column
  <code>j</code> of the right one. Multiply pairwise and add up:
</p>

<div class="math-display" data-tex="C_{ij} = \sum_{k=1}^{m} A_{ik}\,B_{kj}"></div>

<p>
  The shape rule follows from this: a row of <code>A</code> and a column of <code>B</code> must
  have the same length <code>m</code>. If <code>A</code> has shape <span class="math-inline" data-tex="n\times m"></span> and
  <code>B</code> has shape <span class="math-inline" data-tex="m\times p"></span>, the result is <span class="math-inline" data-tex="n\times p"></span>. My matrices:
</p>

<div class="math-display" data-tex="A = \begin{bmatrix} 1 &amp; 2 &amp; 0 \\ 3 &amp; -1 &amp; 2 \end{bmatrix}, \qquad B = \begin{bmatrix} 2 &amp; 1 \\ 0 &amp; 1 \\ 1 &amp; -1 \end{bmatrix}"></div>

<p>Let us see step by step how <code>C</code> comes out of them and how the rule turns into code.</p>

<div class="stage" id="stageMatmul" tabindex="0">
  <div class="stage-figure">
<svg id="mm" viewBox="0 0 960 500" role="img" aria-label="Multiplying a 2 by 3 matrix by a 3 by 2 matrix, and the code with three nested loops">
  <style>
    #mm { font-family: Helvetica, Arial, sans-serif; }
    #mm .cell { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .cellc { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.5; stroke-dasharray: 4 3; }
    #mm .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #mm .sgn { font-size: 30px; fill: #5E5850; }
    #mm .hl { fill: none; stroke: #C29E08; stroke-width: 3; }
    #mm .code { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #mm .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #mm .kbg { fill: #FFF3C4;  stroke: #C29E08; stroke-width: 1.2; }
    #mm .fbg { fill: #CDEBB0;  stroke: #73B222; stroke-width: 1.2; }
    #mm .gtx { font-size: 14px; fill: #5a8c1c; }
    #mm .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="mats">
    <foreignObject x="63" y="113.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="A \cdot  2\times 3"></div></foreignObject>
    <rect x="40" y="150" width="56" height="56" class="cell"/>
    <rect x="96" y="150" width="56" height="56" class="cell"/>
    <rect x="152" y="150" width="56" height="56" class="cell"/>
    <rect x="40" y="206" width="56" height="56" class="cell"/>
    <rect x="96" y="206" width="56" height="56" class="cell"/>
    <rect x="152" y="206" width="56" height="56" class="cell"/>
    <foreignObject x="43" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="99" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="155" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="43" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <foreignObject x="91.5" y="212.8" width="65" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <foreignObject x="155" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <text x="239" y="216" class="sgn" text-anchor="middle">·</text>
    <foreignObject x="265" y="85.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="B \cdot  3\times 2"></div></foreignObject>
    <rect x="270" y="122" width="56" height="56" class="cell"/>
    <rect x="326" y="122" width="56" height="56" class="cell"/>
    <rect x="270" y="178" width="56" height="56" class="cell"/>
    <rect x="326" y="178" width="56" height="56" class="cell"/>
    <rect x="270" y="234" width="56" height="56" class="cell"/>
    <rect x="326" y="234" width="56" height="56" class="cell"/>
    <foreignObject x="273" y="128.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="329" y="128.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="273" y="184.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="329" y="184.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="273" y="240.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="321.5" y="240.8" width="65" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <text x="414" y="216" class="sgn" text-anchor="middle">=</text>
    <foreignObject x="440" y="113.9" width="122" height="36"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:17px;color:#111111;font-weight:700" data-tex="C \cdot  2\times 2"></div></foreignObject>
    <rect x="445" y="150" width="56" height="56" class="cellc"/>
    <rect x="501" y="150" width="56" height="56" class="cellc"/>
    <rect x="445" y="206" width="56" height="56" class="cellc"/>
    <rect x="501" y="206" width="56" height="56" class="cellc"/>
  </g>
  <g data-key="shape" data-only="1">
    <foreignObject x="40" y="331.8" width="454" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="(2\times 3)\cdot(3\times 2) \;\to\; (2\times 2)"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="681" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>inner sizes must match: <span data-tex="3 = 3"></span>; outer sizes give the shape of <span data-tex="C"></span></span></div></foreignObject>
  </g>
  <g data-key="rc00" data-only="1">
    <rect x="37" y="147" width="174" height="62" rx="4" class="hl"/>
    <rect x="267" y="119" width="62" height="174" rx="4" class="hl"/>
  </g>
  <g data-key="f00" data-only="1">
    <foreignObject x="40" y="331.8" width="454" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="C[0][0] = 1\cdot 2 + 2\cdot 0 + 0\cdot 1 = 2"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="671" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>row <span data-tex="0"></span> of <span data-tex="A"></span> runs along column <span data-tex="0"></span> of <span data-tex="B"></span>: three products, one sum</span></div></foreignObject>
  </g>
  <g data-key="c00">
    <rect x="445" y="150" width="56" height="56" class="cg"/>
    <foreignObject x="448" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  </g>
  <g data-key="rc11" data-only="1">
    <rect x="37" y="203" width="174" height="62" rx="4" class="hl"/>
    <rect x="323" y="119" width="62" height="174" rx="4" class="hl"/>
  </g>
  <g data-key="f11" data-only="1">
    <foreignObject x="40" y="331.8" width="540" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:20px;color:#111111;font-weight:400" data-tex="C[1][1] = 3\cdot 1 + (-1)\cdot 1 + 2\cdot (-1) = 0"></div></foreignObject>
    <foreignObject x="40" y="370.5" width="590" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span>zero is not a mistake: the contributions <span data-tex="+3"></span>, <span data-tex="-1"></span> and <span data-tex="-2"></span> cancel out</span></div></foreignObject>
  </g>
  <g data-key="c11">
    <rect x="501" y="206" width="56" height="56" class="cg"/>
    <foreignObject x="504" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  </g>
  <g data-key="crest">
    <rect x="501" y="150" width="56" height="56" class="cg"/>
    <foreignObject x="504" y="156.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <rect x="445" y="206" width="56" height="56" class="cg"/>
    <foreignObject x="448" y="212.8" width="50" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:20px;color:#111111;font-weight:400" data-tex="8"></div></foreignObject>
    <foreignObject x="40" y="420.5" width="852" height="29"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:14px;color:#5E5850;font-weight:400"><span><span data-tex="n \cdot p \cdot m = 2 \cdot 2 \cdot 3 = 12"></span> products in total — three for each of the four cells of <span data-tex="C"></span></span></div></foreignObject>
  </g>
  <rect x="605" y="90" width="335" height="252" rx="8" class="codebox"/>
  <g data-key="kline" data-only="1">
    <rect x="612" y="251" width="321" height="42" rx="4" class="kbg"/>
  </g>
  <g data-key="fn" data-only="1">
    <rect x="612" y="102" width="321" height="22" rx="4" class="fbg"/>
    <text x="612" y="370" class="gtx">def gives it a name: now it can be called again</text>
  </g>
  <g data-key="code">
    <text x="620" y="118" class="code">def matmul(A, B):</text>
    <text x="620" y="139" class="code">    n, m = len(A), len(B)</text>
    <text x="620" y="160" class="code">    p = len(B[0])</text>
    <text x="620" y="181" class="code">    C = [[0]*p for _ in range(n)]</text>
    <text x="620" y="202" class="code">    for i in range(n):</text>
    <text x="620" y="223" class="code">        for j in range(p):</text>
    <text x="620" y="244" class="code">            s = 0</text>
    <text x="620" y="265" class="code">            for k in range(m):</text>
    <text x="620" y="286" class="code">                s += A[i][k]*B[k][j]</text>
    <text x="620" y="307" class="code">            C[i][j] = s</text>
    <text x="620" y="328" class="code">    return C</text>
  </g>
  <text x="40" y="486" class="legend">blue — data · yellow frame — the row and column being multiplied · green — a finished cell of C</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="mats" data-focus="mats">
      <div class="step-kicker">Step 1 · data</div>
      <h4>Two matrices are just lists of lists</h4>
      <p>Python has no built-in "matrix" type. <code>A = [[1, 2, 0], [3, -1, 2]]</code> is a
      list of two rows with three numbers each. The empty dashed <code>C</code> on the right is what we are about to fill.</p>
    </div>
    <div class="step-panel" data-on="mats shape" data-focus="shape">
      <div class="step-kicker">Step 2 · shape rule</div>
      <h4>The shape of the result is known in advance</h4>
      <p>A row of <code>A</code> of length 3 is multiplied by a column of <code>B</code> of length 3, so
      the inner sizes must match. The result has as many rows as <code>A</code> and as many
      columns as <code>B</code>: <span class="math-inline" data-tex="2\times 2"></span>.</p>
    </div>
    <div class="step-panel" data-on="mats rc00 f00 c00" data-focus="rc00 f00 c00">
      <div class="step-kicker">Step 3 · one cell</div>
      <h4>Cell <span class="math-inline" data-tex="C[0][0]"></span>: row 0 times column 0</h4>
      <p>Take the first row of <code>A</code> and the first column of <code>B</code>, multiply pairwise and add up.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same data throughout</div>
        <div class="worked-trace">
          <div class="worked-trace-title">Expanding the sum over k</div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 0</div>
            <div class="math-display worked-trace-math" data-tex="A_{00}B_{00} = 1\cdot 2 = 2"></div>
            <div class="worked-trace-note">running sum s = 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 1</div>
            <div class="math-display worked-trace-math" data-tex="A_{01}B_{10} = 2\cdot 0 = 0"></div>
            <div class="worked-trace-note">s = 2</div>
          </div>
          <div class="worked-trace-row">
            <div class="worked-trace-name">k = 2</div>
            <div class="math-display worked-trace-math" data-tex="A_{02}B_{20} = 0\cdot 1 = 0"></div>
            <div class="worked-trace-note">s = 2 → write into C[0][0]</div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> only the first term
        contributes in this cell; the zeros in the row of <code>A</code> and in the column of <code>B</code>
        switched the others off.</p>
      </div>
    </div>
    <div class="step-panel" data-on="mats c00 rc11 f11 c11" data-focus="rc11 f11 c11">
      <div class="step-kicker">Step 4 · another cell</div>
      <h4>Cell <span class="math-inline" data-tex="C[1][1] = 0"></span></h4>
      <p>The second row of <code>A</code> is <code>[3, −1, 2]</code>, the second column of <code>B</code> is
      <code>[1, 1, −1]</code>. The products 3, −1 and −2 add up to exactly zero.</p>
      <div class="callout-blue">
        <strong>Why this example:</strong> the zero will show up again in both implementations, the loops
        and NumPy. If it does not come out somewhere, the bug is in the code, not in the arithmetic.
      </div>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest" data-focus="crest">
      <div class="step-kicker">Step 5 · result</div>
      <h4>All four cells: C = [[2, 3], [8, 0]]</h4>
      <p>The remaining cells are computed the same way: <code>C[0][1] = 1·1 + 2·1 + 0·(−1) = 3</code>,
      <code>C[1][0] = 3·2 + (−1)·0 + 2·1 = 8</code>. Each cell took three products, as many as
      the length of a row.</p>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest code kline" data-focus="code kline">
      <div class="step-kicker">Step 6 · code</div>
      <h4>The rule becomes three nested loops</h4>
      <p>The outer loops over <code>i</code> and <code>j</code> pick a cell of <code>C</code>.
      The inner loop over <code>k</code> (yellow highlight) is the dot product from step 3: it
      walks along the row and the column and accumulates the sum in <code>s</code>.</p>
    </div>
    <div class="step-panel" data-on="mats c00 c11 crest code fn" data-focus="code fn">
      <div class="step-kicker">Step 7 · packaging</div>
      <h4>A function is the seed of a library</h4>
      <p>The line <code>def matmul(A, B):</code> gave all of this a name. Now you do not have to remember
      the three loops: writing <code>matmul(A, B)</code> is enough. A library is built the same way:
      a set of functions and classes whose names hide loops, shape checks and memory handling.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>The whole <code>matmul.py</code> file looks like this:</p>

<pre><code># C:\Users\work\proj\matmul.py
def matmul(A, B):
    n, m = len(A), len(B)
    p = len(B[0])
    C = [[0] * p for _ in range(n)]
    for i in range(n):
        for j in range(p):
            s = 0
            for k in range(m):
                s += A[i][k] * B[k][j]
            C[i][j] = s
    return C

A = [[1, 2, 0], [3, -1, 2]]
B = [[2, 1], [0, 1], [1, -1]]
print(matmul(A, B))</code></pre>

<p>
  Running it means asking the <code>python</code> interpreter to read the file and execute it
  from top to bottom:
</p>

<pre><code>C:\Users\work\proj&gt; python matmul.py
[[2, 3], [8, 0]]</code></pre>

<div class="callout-yellow">
  <strong>What is missing here:</strong> the function does not check shapes. If you pass a
  <code>B</code> with two rows instead of three, it fails with an <code>IndexError</code>
  somewhere inside the loops, and the message does not tell you what is wrong. Shape checks with a
  clear error are one of the boring things a library does for you.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> matrix multiplication is three nested loops,
  and everything else in the article is different ways of not writing them yourself.
</div>

<hr>

<h2 id="part-2">Part 2. A module: what import does</h2>

<p>
  The <code>matmul</code> function will be useful in more than one script. I move it into a
  separate file <code>mylinalg.py</code> and connect it to the main script with one line. The
  project folder now looks like this:
</p>

<pre><code>C:\Users\work\proj\
├── mylinalg.py     ← def matmul(A, B): ...   (the function only, no print)
└── main.py</code></pre>

<pre><code># main.py
import mylinalg

A = [[1, 2, 0], [3, -1, 2]]
B = [[2, 1], [0, 1], [1, -1]]
C = mylinalg.matmul(A, B)
print(C)                    # [[2, 3], [8, 0]]
print(type(mylinalg))       # &lt;class 'module'&gt;
print(mylinalg.__file__)    # C:\Users\work\proj\mylinalg.py</code></pre>

<p>
  A Python file that is connected with <code>import</code> is called a <strong>module</strong>.
  A folder with modules and an <code>__init__.py</code> file is a <strong>package</strong>.
  A <strong>library</strong> is not a separate language concept: it is simply a package written by
  someone else that solves some common task. For the interpreter there is no difference between
  my <code>mylinalg</code> and someone else's <code>numpy</code>.
</p>

<p>
  The line <code>import mylinalg</code> looks like a declaration, but it is actually an action in
  three steps: <em>find</em> the file, <em>execute</em> it and <em>bind</em> the result to a name.
  Let us go step by step.
</p>

<div class="stage" id="stageImport" tabindex="0">
  <div class="stage-figure">
<svg id="im" viewBox="0 0 960 520" role="img" aria-label="How import finds a file via sys.path, executes it and creates a module object">
  <style>
    #im { font-family: Helvetica, Arial, sans-serif; }
    #im .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #im .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #im .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #im .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #im .code { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #im .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #im .row { fill: #FFFFFF; stroke: #C8C3B6; stroke-width: 1; }
    #im .cap { font-size: 13px; fill: #5E5850; }
    #im .elbl { font-size: 13px; fill: #5E5850; }
    #im .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #im .hitr { fill: #F0FAF0; stroke: #73B222; stroke-width: 2; }
    #im .spr { fill: none; stroke: #3576C0; stroke-width: 2.5; }
    #im .spt { font-size: 14px; fill: #2a5e9b; }
    #im .err { font-size: 14px; fill: #C30B0A; }
    #im .dot { fill: none; stroke: #C29E08; stroke-width: 2; }
    #im .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="im-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="main">
    <rect x="40" y="80" width="270" height="150" rx="8" class="bx"/>
    <text x="54" y="106" class="ttl">main.py</text>
    <text x="54" y="142" class="code">import mylinalg</text>
    <text x="54" y="170" class="code">C = mylinalg.matmul(A, B)</text>
    <text x="54" y="198" class="code">print(C)</text>
  </g>
  <g data-key="syspath">
    <rect x="370" y="80" width="260" height="210" rx="8" class="bx"/>
    <text x="384" y="106" class="ttl">sys.path — where to look</text>
    <rect x="378" y="122" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="158" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="194" width="244" height="30" rx="4" class="row"/>
    <rect x="378" y="230" width="244" height="30" rx="4" class="row"/>
    <text x="386" y="142" class="mono">[0] C:\Users\work\proj</text>
    <text x="386" y="178" class="mono">[1] …\Python312\DLLs</text>
    <text x="386" y="214" class="mono">[2] …\Python312\Lib</text>
    <text x="386" y="250" class="mono">[3] …\Lib\site-packages</text>
    <text x="384" y="280" class="cap">list shortened; order = priority</text>
  </g>
  <g data-key="a1">
    <line x1="310" y1="137" x2="366" y2="137" class="edge" marker-end="url(#im-arw)"/>
    <text x="338" y="128" class="elbl" text-anchor="middle">search</text>
  </g>
  <g data-key="hit">
    <rect x="378" y="122" width="244" height="30" rx="4" class="hitr"/>
    <text x="386" y="142" class="mono">[0] C:\Users\work\proj</text>
    <line x1="622" y1="137" x2="686" y2="137" class="edge" marker-end="url(#im-arw)"/>
    <text x="656" y="128" class="elbl" text-anchor="middle">found</text>
  </g>
  <g data-key="file">
    <rect x="690" y="80" width="240" height="110" rx="8" class="bx"/>
    <text x="704" y="106" class="ttl">mylinalg.py</text>
    <text x="704" y="142" class="mono">def matmul(A, B):</text>
    <text x="704" y="166" class="mono">    ...three loops...</text>
  </g>
  <g data-key="module">
    <line x1="810" y1="190" x2="810" y2="246" class="edge" marker-end="url(#im-arw)"/>
    <text x="820" y="224" class="elbl">executed</text>
    <rect x="690" y="250" width="240" height="140" rx="8" class="bg"/>
    <text x="704" y="276" class="ttl">module object</text>
    <text x="704" y="308" class="mono">.matmul   → function</text>
    <text x="704" y="334" class="mono">.__name__ → 'mylinalg'</text>
    <text x="704" y="360" class="mono">.__file__ → …\mylinalg.py</text>
  </g>
  <g data-key="bind">
    <path d="M 690 345 L 175 345 L 175 234" class="edge" marker-end="url(#im-arw)"/>
    <text x="190" y="336" class="elbl">name mylinalg → this object</text>
    <rect x="159" y="153" width="14" height="24" rx="3" class="dot"/>
  </g>
  <g data-key="cache">
    <rect x="370" y="380" width="260" height="80" rx="8" class="by"/>
    <text x="384" y="406" class="ttl">sys.modules — cache</text>
    <text x="384" y="438" class="mono">'mylinalg' → module object</text>
    <path d="M 760 390 L 760 420 L 634 420" class="edge" marker-end="url(#im-arw)"/>
    <text x="646" y="446" class="elbl">stored</text>
  </g>
  <g data-key="sp" data-only="1">
    <rect x="376" y="228" width="248" height="34" rx="5" class="spr"/>
    <text x="40" y="418" class="spt">[3] site-packages — this is where pip</text>
    <text x="40" y="440" class="spt">puts installed libraries</text>
  </g>
  <g data-key="err" data-only="1">
    <text x="188" y="272" class="err">not in any folder →</text>
    <text x="188" y="294" class="err">ModuleNotFoundError</text>
  </g>
  <text x="40" y="506" class="legend">blue — files and paths · green — the created object · yellow — the interpreter's internal table</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="main" data-focus="main">
      <div class="step-kicker">Step 1 · request</div>
      <h4>import is a command, not a declaration</h4>
      <p>The interpreter executes <code>main.py</code> from top to bottom. When it reaches
      <code>import mylinalg</code>, it stops: the next line will not run until the module is loaded.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1" data-focus="syspath a1">
      <div class="step-kicker">Step 2 · search</div>
      <h4>Python walks through the folders in sys.path in order</h4>
      <p><code>sys.path</code> is an ordinary list of strings. First comes the folder of the running
      script, then the Python standard library and <code>site-packages</code>.
      Each folder is searched for <code>mylinalg.py</code> or a package folder <code>mylinalg\</code>.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file" data-focus="hit file">
      <div class="step-kicker">Step 3 · found</div>
      <h4>The first match wins</h4>
      <p>The file is found already in folder <code>[0]</code>, next to the script. The search stops there.
      This rule will bite in part 3: a file named like someone else's library next to your script
      shadows the library itself.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module" data-focus="module">
      <div class="step-kicker">Step 4 · execution</div>
      <h4>The file is executed, and everything defined in it becomes an attribute</h4>
      <p>Python creates an empty object of type <code>module</code> and executes
      <code>mylinalg.py</code> inside it from top to bottom. The line <code>def matmul</code> creates a function
      object, and it ends up in the module as the attribute <code>.matmul</code>. The interpreter adds the
      service attributes <code>__name__</code> and <code>__file__</code> itself.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind" data-focus="bind main">
      <div class="step-kicker">Step 5 · binding</div>
      <h4>The name mylinalg in main.py points to the object</h4>
      <p>After the import, <code>mylinalg</code> is an ordinary variable, like <code>A</code> or <code>B</code>.
      The dot in <code>mylinalg.matmul</code> means "get an attribute of the object". The same
      mechanism will later give us <code>np.array</code>, <code>A.shape</code> and <code>model.fit</code>.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind cache" data-focus="cache">
      <div class="step-kicker">Step 6 · cache</div>
      <h4>A second import does not reread the file</h4>
      <p>The finished module is written into the dictionary <code>sys.modules</code>. If any other
      file of the program says <code>import mylinalg</code> again, Python hands back the object from
      the cache right away: a module's code runs once per program run.</p>
    </div>
    <div class="step-panel" data-on="main syspath a1 hit file module bind cache sp err" data-focus="sp err">
      <div class="step-kicker">Step 7 · someone else's code</div>
      <h4>If the file is not nearby, the search reaches site-packages</h4>
      <p>For <code>import numpy</code> nothing is found next to the script or in the standard
      library. The last hope is <code>site-packages</code>: that is exactly where
      <code>pip</code> puts installed packages. Not there either — <code>ModuleNotFoundError</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>
  You can see all of this with your own eyes instead of taking my word for it:
</p>

<pre><code>&gt;&gt;&gt; import sys, mylinalg
&gt;&gt;&gt; sys.path[0]
'C:\\Users\\work\\proj'
&gt;&gt;&gt; 'mylinalg' in sys.modules
True
&gt;&gt;&gt; [name for name in dir(mylinalg) if not name.startswith('_')]
['matmul']</code></pre>

<div class="callout-blue">
  <strong>Where the __pycache__ folder comes from:</strong> after the first import, the file
  <code>__pycache__\mylinalg.cpython-312.pyc</code> appears next to the module. It is not machine code but
  bytecode: already parsed Python text that the interpreter saves so it does not have to parse the file again
  on the next run. It is safe to delete.
</div>

<div class="callout-yellow">
  <strong>Why modules contain <code>if __name__ == "__main__":</code></strong> On import
  the whole file is executed. If you leave the line <code>print(matmul(A, B))</code> in
  <code>mylinalg.py</code>, it fires on every <code>import</code>. Code under this check runs only
  when the file is run directly: then <code>__name__</code> equals <code>"__main__"</code>, and on
  import it equals <code>"mylinalg"</code>.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> import finds a file through the <code>sys.path</code> list,
  executes it and hands back a module object; for the interpreter a library is exactly the same kind of
  module, only written by someone else and stored in <code>site-packages</code>.
</div>

<hr>

<h2 id="part-3">Part 3. pip install numpy: where the code comes from and where it lives</h2>

<p>
  Now someone else's library. First I create a <strong>virtual environment</strong> for the
  project, a separate copy of the <code>site-packages</code> folder so that this project's packages
  do not mix with others, and install NumPy into it:
</p>

<pre><code>C:\Users\work\proj&gt; python -m venv .venv
C:\Users\work\proj&gt; .venv\Scripts\activate
(.venv) C:\Users\work\proj&gt; pip install numpy
Collecting numpy
  Downloading numpy-2.3.3-cp312-cp312-win_amd64.whl
Installing collected packages: numpy
Successfully installed numpy-2.3.3</code></pre>

<p>
  There are three actors here. <strong>pip</strong> is the package installer; it is itself written
  in Python and lives in the same <code>site-packages</code>. <strong>PyPI</strong> (pypi.org) is the
  public index where authors publish their packages. A <strong>wheel</strong> (a
  <code>.whl</code> file) is the format a package arrives in: essentially a zip archive of ready
  files built for a specific Python version and operating system.
</p>

<div class="stage" id="stagePip" tabindex="0">
  <div class="stage-figure">
<svg id="pp" viewBox="0 0 960 560" role="img" aria-label="pip downloads the numpy wheel from PyPI and unpacks it into site-packages; what lies in the numpy folder">
  <style>
    #pp { font-family: Helvetica, Arial, sans-serif; }
    #pp .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #pp .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #pp .bw  { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; }
    #pp .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #pp .mono { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #pp .mono13 { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #pp .cap { font-size: 13px; fill: #5E5850; }
    #pp .elbl { font-size: 13px; fill: #5E5850; }
    #pp .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #pp .note { font-size: 13.5px; fill: #111111; }
    #pp .hg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.2; }
    #pp .hy { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.2; }
    #pp .hb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.2; }
    #pp .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="pp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="cmd">
    <rect x="30" y="80" width="220" height="90" rx="8" class="bx"/>
    <text x="44" y="106" class="ttl">terminal</text>
    <text x="44" y="142" class="mono">&gt; pip install numpy</text>
  </g>
  <g data-key="pypi">
    <line x1="250" y1="125" x2="296" y2="125" class="edge" marker-end="url(#pp-arw)"/>
    <rect x="300" y="80" width="200" height="90" rx="8" class="by"/>
    <text x="400" y="114" class="ttl" text-anchor="middle">PyPI</text>
    <text x="400" y="140" class="cap" text-anchor="middle">pypi.org · package index</text>
  </g>
  <g data-key="wheel">
    <line x1="500" y1="125" x2="546" y2="125" class="edge" marker-end="url(#pp-arw)"/>
    <rect x="550" y="80" width="380" height="90" rx="8" class="bw"/>
    <text x="564" y="106" class="ttl">.whl wheel = zip archive</text>
    <text x="564" y="134" class="mono13">numpy-2.3.3-cp312-cp312-win_amd64.whl</text>
    <text x="564" y="158" class="cap">cp312 — Python 3.12 · win_amd64 — Windows x64</text>
  </g>
  <g data-key="tree">
    <line x1="740" y1="170" x2="740" y2="221" class="edge" marker-end="url(#pp-arw)"/>
    <text x="750" y="202" class="elbl">unpacked</text>
    <rect x="30" y="225" width="900" height="295" rx="8" class="bx"/>
    <text x="44" y="252" class="ttl">C:\Users\work\proj\.venv\Lib\site-packages\</text>
  </g>
  <g data-key="imp">
    <rect x="38" y="274" width="500" height="50" rx="4" class="hg"/>
    <text x="560" y="290" class="note">← import numpy finds this package folder</text>
    <text x="560" y="316" class="note">← and runs its __init__.py</text>
  </g>
  <g data-key="py">
    <rect x="38" y="352" width="500" height="24" rx="4" class="hb"/>
    <text x="560" y="368" class="note">← plain Python: you can open and read it</text>
  </g>
  <g data-key="pyd">
    <rect x="38" y="378" width="500" height="24" rx="4" class="hy"/>
    <text x="560" y="394" class="note">← compiled C: machine code, not text</text>
  </g>
  <g data-key="blas">
    <rect x="38" y="456" width="500" height="24" rx="4" class="hy"/>
    <text x="560" y="472" class="note">← OpenBLAS: fast matrix operations</text>
  </g>
  <g data-key="meta">
    <rect x="38" y="482" width="500" height="24" rx="4" class="hb"/>
    <text x="560" y="498" class="note">← metadata for pip: version, file list</text>
  </g>
  <g data-key="lines">
    <text x="44" y="290" class="mono">numpy\</text>
    <text x="44" y="316" class="mono">  __init__.py</text>
    <text x="44" y="342" class="mono">  _core\</text>
    <text x="44" y="368" class="mono">    multiarray.py</text>
    <text x="44" y="394" class="mono">    _multiarray_umath.cp312-win_amd64.pyd</text>
    <text x="44" y="420" class="mono">  linalg\  random\  fft\  …</text>
    <text x="44" y="446" class="mono">numpy.libs\</text>
    <text x="44" y="472" class="mono">  libscipy_openblas64_-….dll</text>
    <text x="44" y="498" class="mono">numpy-2.3.3.dist-info\</text>
  </g>
  <text x="30" y="548" class="legend">blue — files and folders · yellow — external source and compiled code · green — what import finds</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="cmd" data-focus="cmd">
      <div class="step-kicker">Step 1 · command</div>
      <h4>pip is a Python program too</h4>
      <p>The command <code>pip install numpy</code> runs the <code>pip</code> package from the active
      environment. It is safer to write <code>python -m pip install numpy</code>: that way you get the pip
      of exactly the Python you will later run your script with.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi" data-focus="pypi">
      <div class="step-kicker">Step 2 · index</div>
      <h4>pip asks PyPI which versions of numpy exist</h4>
      <p>PyPI returns a list of files for each version. pip picks the newest version compatible with
      your Python and checks the dependencies, the packages this one cannot work without.
      NumPy has no required dependencies.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi wheel" data-focus="wheel">
      <div class="step-kicker">Step 3 · wheel</div>
      <h4>Out of dozens of files, one is chosen for your system</h4>
      <p>NumPy contains compiled code, and machine code differs between Windows and Linux.
      So a separate wheel is built for each "Python version × OS" pair, and the tags in the file
      name say which one fits. The downloaded wheel is an ordinary zip.</p>
    </div>
    <div class="step-panel" data-on="cmd pypi wheel tree lines" data-focus="tree">
      <div class="step-kicker">Step 4 · unpacking</div>
      <h4>Installing means unpacking the archive into site-packages</h4>
      <p>Neither the Windows installer nor the registry is involved: pip unpacks the wheel into the
      <code>site-packages</code> folder of the active environment. Delete the <code>numpy\</code> folder by hand
      and the library is gone.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp" data-focus="imp">
      <div class="step-kicker">Step 5 · import</div>
      <h4>import numpy takes the same route as in part 2</h4>
      <p>Walking through <code>sys.path</code>, Python reaches <code>site-packages</code> and finds the
      <code>numpy\</code> folder with an <code>__init__.py</code> in it, so it is a package. Python runs
      <code>__init__.py</code>, and that file imports the package's internal modules itself.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd" data-focus="py pyd">
      <div class="step-kicker">Step 6 · two kinds of code</div>
      <h4>Part of the code is Python, part is compiled</h4>
      <p>You can open <code>multiarray.py</code> in an editor. A <code>.pyd</code> on Windows is a
      DLL built from C sources: Python loads it into the process memory, and its functions look like
      ordinary Python functions. On Linux the same file has the extension <code>.so</code>.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd blas" data-focus="blas">
      <div class="step-kicker">Step 7 · a library under the library</div>
      <h4>NumPy itself relies on someone else's code: OpenBLAS</h4>
      <p>BLAS is a standard set of linear algebra routines that is several decades old.
      The NumPy wheel brings its own copy of OpenBLAS in the <code>numpy.libs\</code> folder. Libraries
      stack in layers: you call NumPy, NumPy calls BLAS.</p>
    </div>
    <div class="step-panel" data-on="tree lines imp py pyd blas meta" data-focus="meta">
      <div class="step-kicker">Step 8 · bookkeeping</div>
      <h4>dist-info is the passport of an installed package</h4>
      <p><code>numpy-2.3.3.dist-info\</code> holds the version, the license and a list of all
      unpacked files. This is where <code>pip show numpy</code>, <code>pip list</code> and
      <code>pip uninstall numpy</code> get their data; the last one simply deletes the files on
      that list.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>Two commands show where everything ended up:</p>

<pre><code>(.venv) C:\Users\work\proj&gt; pip show numpy
Name: numpy
Version: 2.3.3
Location: C:\Users\work\proj\.venv\Lib\site-packages
Requires:
...

(.venv) C:\Users\work\proj&gt; python -c "import numpy; print(numpy.__file__)"
C:\Users\work\proj\.venv\Lib\site-packages\numpy\__init__.py</code></pre>

<p>
  The <code>__file__</code> attribute is the same one my <code>mylinalg</code> had. Remember it
  as your first debugging tool: if a library behaves strangely, first make sure the copy that got
  imported is the one you think it is.
</p>

<div class="callout-red">
  <strong>A classic trap:</strong> name your practice script <code>numpy.py</code>,
  and <code>import numpy</code> in any file in that folder imports it instead of the library.
  The reason is the rule from part 2: the script's folder comes first in <code>sys.path</code>, and the first
  match wins. The symptom is errors like <code>module 'numpy' has no attribute 'array'</code>.
</div>

<div class="callout-yellow">
  <strong>If the environment is not activated,</strong> <code>pip</code> from the system Python installs the
  package into a different <code>site-packages</code>, and a script run from <code>.venv</code> will not
  see it. The command <code>python -c "import sys; print(sys.executable)"</code> shows which
  interpreter is actually running.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> installing a library means downloading an archive from PyPI
  and unpacking it into <code>site-packages</code>; inside are ordinary <code>.py</code> files and
  compiled code, and import finds them through the same <code>sys.path</code>.
</div>

<hr>

<h2 id="part-4">Part 4. The ndarray object: attributes, methods and the call path of A @ B</h2>

<p>
  I repeat the computation from part 1, this time with NumPy. The usual abbreviation
  <code>import numpy as np</code> is the same import; the module is simply bound to the name
  <code>np</code> instead of <code>numpy</code>:
</p>

<pre><code>import numpy as np

A = np.array([[1, 2, 0], [3, -1, 2]])
B = np.array([[2, 1], [0, 1], [1, -1]])

C = A @ B
print(C)
# [[2 3]
#  [8 0]]</code></pre>

<p>
  Same answer, including the zero in the bottom right corner. But now <code>A</code> is not a list
  of lists: it is an <strong>object</strong> of class <code>numpy.ndarray</code>. An object has
  <strong>attributes</strong>, ready values read with a dot and no parentheses, and
  <strong>methods</strong>, functions bound to the object that are called with parentheses.
</p>

<table class="shape-table">
  <tr><th>Expression</th><th>What it is</th><th>Result for A</th></tr>
  <tr><td><code>A.shape</code></td><td>attribute: shape</td><td><code>(2, 3)</code></td></tr>
  <tr><td><code>A.dtype</code></td><td>attribute: element type</td><td><code>int64</code></td></tr>
  <tr><td><code>A.ndim</code></td><td>attribute: number of axes</td><td><code>2</code></td></tr>
  <tr><td><code>A.T</code></td><td>attribute: transposed view</td><td>an array of shape <code>(3, 2)</code></td></tr>
  <tr><td><code>A.sum()</code></td><td>method: sum of all elements</td><td><code>7</code></td></tr>
  <tr><td><code>A.sum(axis=0)</code></td><td>method with an argument: column sums</td><td><code>[4, 1, 2]</code></td></tr>
  <tr><td><code>A.reshape(3, 2)</code></td><td>method: same memory, different shape</td><td><code>[[1, 2], [0, 3], [-1, 2]]</code></td></tr>
  <tr><td><code>A.dot(B)</code>, <code>np.matmul(A, B)</code></td><td>same as <code>A @ B</code></td><td><code>[[2, 3], [8, 0]]</code></td></tr>
</table>

<p>
  You can find out what an object can do right in the interpreter: <code>type(A)</code> tells you
  the class, <code>dir(A)</code> returns the list of all names (an <code>ndarray</code> in NumPy 2.x
  has more than a hundred and fifty of them, about seventy without underscores), and
  <code>help(A.sum)</code> shows the method's documentation. Nothing is hidden: everything the
  library "knows" is reachable through the same dots and parentheses.
</p>

<div class="callout-blue">
  <strong>How a method is called:</strong> <code>A.sum(axis=0)</code> is shorthand for
  <code>np.ndarray.sum(A, axis=0)</code>. Python finds the function <code>sum</code> in the object's class and
  passes the object itself as the first argument, the very <code>self</code> you write in your own
  classes. A method is an ordinary function that does not need its data passed separately: the data
  comes along with the object.
</div>

<p>Now let us look at what lies inside the object and where the call <code>A @ B</code> goes.</p>

<div class="stage" id="stageNdarray" tabindex="0">
  <div class="stage-figure">
<svg id="nd" viewBox="0 0 960 560" role="img" aria-label="Inside the ndarray object and the call chain of A @ B from Python to compiled code">
  <style>
    #nd { font-family: Helvetica, Arial, sans-serif; }
    #nd .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #nd .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #nd .bg  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #nd .cell { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.4; }
    #nd .ttl { font-size: 16px; fill: #111111; font-weight: 700; }
    #nd .lbl { font-size: 16px; fill: #111111; }
    #nd .mono { font-family: "Courier New", Courier, monospace; font-size: 14px; fill: #111111; }
    #nd .mono15 { font-family: "Courier New", Courier, monospace; font-size: 15px; fill: #111111; }
    #nd .cap { font-size: 13px; fill: #5E5850; }
    #nd .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #nd .bord { stroke: #5E5850; stroke-width: 1.3; stroke-dasharray: 6 4; fill: none; }
    #nd .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="nd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
    </marker>
  </defs>
  <g data-key="obj">
    <rect x="30" y="70" width="400" height="250" rx="8" class="bx"/>
    <text x="44" y="96" class="ttl">A — a numpy.ndarray object</text>
    <text x="44" y="132" class="mono">shape   (2, 3)</text>
    <text x="44" y="158" class="mono">dtype   int64</text>
    <text x="44" y="184" class="mono">strides (24, 8)</text>
    <text x="44" y="210" class="mono">ndim    2</text>
    <text x="250" y="158" class="cap">how to read memory</text>
  </g>
  <g data-key="buf">
    <rect x="46" y="236" width="56" height="44" class="cell"/>
    <rect x="102" y="236" width="56" height="44" class="cell"/>
    <rect x="158" y="236" width="56" height="44" class="cell"/>
    <rect x="214" y="236" width="56" height="44" class="cell"/>
    <rect x="270" y="236" width="56" height="44" class="cell"/>
    <rect x="326" y="236" width="56" height="44" class="cell"/>
    <foreignObject x="49.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <foreignObject x="105.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <foreignObject x="161.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <foreignObject x="217.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
    <foreignObject x="267" y="238.5" width="62" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="-1"></div></foreignObject>
    <foreignObject x="329.5" y="238.5" width="49" height="38"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:18px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
    <text x="44" y="304" class="cap">data: 6 numbers of 8 bytes in one block</text>
  </g>
  <g data-key="meth">
    <rect x="30" y="350" width="400" height="180" rx="8" class="bx"/>
    <text x="44" y="376" class="ttl">attributes without parentheses, methods with them</text>
    <text x="44" y="406" class="mono">A.T.shape       → (3, 2)</text>
    <text x="44" y="432" class="mono">A.sum()         → 7</text>
    <text x="44" y="458" class="mono">A.sum(axis=0)   → [4, 1, 2]</text>
    <text x="44" y="484" class="mono">A.reshape(3, 2) → [[1,2],[0,3],[-1,2]]</text>
    <text x="44" y="510" class="mono">A @ B           → ?</text>
  </g>
  <g data-key="c1">
    <rect x="480" y="70" width="450" height="50" rx="8" class="bx"/>
    <text x="705" y="101" class="mono15" text-anchor="middle">your code:  C = A @ B</text>
  </g>
  <g data-key="c2">
    <line x1="705" y1="120" x2="705" y2="146" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="150" width="450" height="50" rx="8" class="by"/>
    <text x="705" y="172" class="mono15" text-anchor="middle">A.__matmul__(B)</text>
    <text x="705" y="192" class="cap" text-anchor="middle">the @ operator is a method call on A</text>
  </g>
  <g data-key="c3">
    <line x1="705" y1="200" x2="705" y2="226" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="230" width="450" height="50" rx="8" class="by"/>
    <text x="705" y="252" class="mono15" text-anchor="middle">np.matmul(A, B)</text>
    <text x="705" y="272" class="cap" text-anchor="middle">shape check, loop chosen by dtype</text>
  </g>
  <g data-key="border">
    <line x1="470" y1="300" x2="940" y2="300" class="bord"/>
    <text x="935" y="293" class="cap" text-anchor="end">Python</text>
    <text x="935" y="316" class="cap" text-anchor="end">machine code</text>
  </g>
  <g data-key="c4a">
    <line x1="640" y1="280" x2="592" y2="321" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="325" width="215" height="60" rx="8" class="by"/>
    <text x="587" y="350" class="lbl" text-anchor="middle">NumPy C loop</text>
    <text x="587" y="372" class="cap" text-anchor="middle">int64 — our example</text>
  </g>
  <g data-key="c4b">
    <line x1="770" y1="280" x2="818" y2="321" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="715" y="325" width="215" height="60" rx="8" class="by"/>
    <text x="822" y="350" class="lbl" text-anchor="middle">OpenBLAS · dgemm</text>
    <text x="822" y="372" class="cap" text-anchor="middle">float64 / float32</text>
  </g>
  <g data-key="c5">
    <line x1="587" y1="385" x2="640" y2="416" class="edge" marker-end="url(#nd-arw)"/>
    <line x1="822" y1="385" x2="770" y2="416" class="edge" marker-end="url(#nd-arw)"/>
    <rect x="480" y="420" width="450" height="56" rx="8" class="bg"/>
    <text x="705" y="444" class="lbl" text-anchor="middle">new ndarray object</text>
    <text x="705" y="466" class="mono15" text-anchor="middle">[[2, 3], [8, 0]]</text>
  </g>
  <text x="30" y="548" class="legend">blue — data and your code · yellow — library operations · green — result · dashed — the Python/C boundary</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="obj" data-focus="obj">
      <div class="step-kicker">Step 1 · object</div>
      <h4>np.array creates an object that describes the data</h4>
      <p>The function <code>np.array</code> takes a list of lists and builds an <code>ndarray</code> object.
      Its header records how to interpret the data: shape <code>(2, 3)</code>, type
      <code>int64</code> (8-byte integers) and the steps along the axes.</p>
    </div>
    <div class="step-panel" data-on="obj buf" data-focus="buf">
      <div class="step-kicker">Step 2 · memory</div>
      <h4>The numbers themselves lie in one contiguous block</h4>
      <p>Unlike a list of lists, where every number is a separate Python object somewhere in
      memory, here the six numbers follow one another. <code>strides = (24, 8)</code> reads like this: to
      move to the next row, shift by 24 bytes (3 numbers × 8); to the next column, by 8.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth" data-focus="meth">
      <div class="step-kicker">Step 3 · interface</div>
      <h4>Attributes read the header, methods start work</h4>
      <p><code>A.T</code> and <code>A.reshape(3, 2)</code> do not copy the numbers: they create a new
      header with different <code>shape</code> and <code>strides</code> on top of the same memory block.
      The last line, <code>A @ B</code>, still has a question mark: let us see where it leads.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2" data-focus="c1 c2">
      <div class="step-kicker">Step 4 · operator</div>
      <h4>@ is a call to the __matmul__ method</h4>
      <p>When Python meets <code>A @ B</code>, it looks up the method <code>__matmul__</code> on
      object <code>A</code> and calls it with argument <code>B</code>. All operators work this way:
      <code>+</code> is <code>__add__</code>, <code>[i]</code> is <code>__getitem__</code>.
      The library simply defined these methods for its class.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3" data-focus="c3">
      <div class="step-kicker">Step 5 · dispatcher</div>
      <h4>np.matmul checks shapes and picks an implementation</h4>
      <p>This is where the things my function lacked happen: a check that the inner sizes
      match (otherwise a clear <code>ValueError</code>), computing the result shape and choosing a
      specific loop for the data type. <code>np.matmul</code> is a <em>ufunc</em>; it has a
      separate implementation for each <code>dtype</code>.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a" data-focus="border c4a">
      <div class="step-kicker">Step 6 · boundary</div>
      <h4>For integers, NumPy's own C loop does the work</h4>
      <p>We cross the dashed line: from here on it is machine code from the <code>.pyd</code>. In essence
      these are the same three nested loops from part 1, only written in C and working on raw bytes,
      with no Python object per number. Our <code>int64</code> example goes exactly here.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a c4b" data-focus="c4b">
      <div class="step-kicker">Step 7 · deeper still</div>
      <h4>For floats, the dgemm routine from OpenBLAS</h4>
      <p>If you do <code>A.astype(float) @ B.astype(float)</code>, the dispatcher hands the work
      to BLAS, the very <code>.dll</code> from <code>numpy.libs\</code>. The answer is the same,
      <code>[[2., 3.], [8., 0.]]</code>, but the call has passed through one more layer of someone else's code.</p>
    </div>
    <div class="step-panel" data-on="obj buf meth c1 c2 c3 border c4a c4b c5" data-focus="c5">
      <div class="step-kicker">Step 8 · return</div>
      <h4>A new object comes back to Python</h4>
      <p>The result is packed into a fresh <code>ndarray</code> of shape <code>(2, 2)</code> and
      becomes the value of the expression. For you the whole path is one line; the boundary between
      Python and C was crossed once on the way in and once on the way out.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout-blue">
  <strong>Why this is faster than loops if the same loops are inside:</strong> in part 1, for each
  of the 12 products the interpreter parsed indices, fetched the Python number objects and created
  new ones. Here the Python↔C boundary is crossed once for the whole operation, and inside the C code
  the numbers are just bytes in memory. There are still 12 products; what gets faster is walking through them,
  because the loop runs in machine code without the interpreter.
</div>


<h3>Inside the original: the source code of ndarray and matmul</h3>

<p>
  So far I have looked at <code>ndarray</code> from the outside, through dots and parentheses. But
  it is someone else's code, and it is open: NumPy is on GitHub, and you can read exactly the lines
  that run for <code>A @ B</code>. For a developer this beats any retelling: the source shows what
  a function takes, what it returns and where you can step into its work. The links below point to
  the <code>v2.5.3</code> tag so that the line numbers do not drift when the main branch changes.
</p>

<table class="shape-table">
  <tr><th>File in numpy/numpy</th><th>What is in it</th></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/include/numpy/ndarraytypes.h#L790-L839" target="_blank" rel="noopener"><code>include/numpy/ndarraytypes.h</code></a></td><td>the <code>PyArrayObject_fields</code> struct — what object <code>A</code> is in memory</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/arrayobject.c#L1263" target="_blank" rel="noopener"><code>src/multiarray/arrayobject.c</code></a></td><td>the <code>PyArray_Type</code> type: the name <code>"numpy.ndarray"</code> and slot tables, including those for operators</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/number.c#L290-L295" target="_blank" rel="noopener"><code>src/multiarray/number.c</code></a></td><td>the <code>array_matrix_multiply</code> function — what stands behind <code>@</code></td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/generate_umath.py#L1177-L1184" target="_blank" rel="noopener"><code>code_generators/generate_umath.py</code></a></td><td>the declaration of the <code>matmul</code> ufunc: two inputs, one output, a shape signature</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/ufunc_docstrings.py#L2764" target="_blank" rel="noopener"><code>code_generators/ufunc_docstrings.py</code></a></td><td>documentation: parameters and return value — the text <code>help(np.matmul)</code> prints</td></tr>
  <tr><td><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L447-L642" target="_blank" rel="noopener"><code>src/umath/matmul.c.src</code></a></td><td>inner loops: a template that generates a separate function for each type</td></tr>
</table>

<p>I will go through them in the order the call passes them, and at the end through the places where you can plug your own code into this path.</p>

<div class="stage" id="stageSource" tabindex="0">
  <div class="stage-figure">
<svg id="sc" viewBox="0 0 960 690" role="img" aria-label="NumPy source code behind the ndarray object and the A @ B call: the C struct, repository files, the np.matmul contract and four points where a developer can step in">
  <style>
    #sc { font-family: Helvetica, Arial, sans-serif; }
    #sc .bx  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #sc .by  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sc .bw  { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.3; }
    #sc .hk  { fill: #FFFFFF; stroke: #3576C0; stroke-width: 1.6; stroke-dasharray: 6 4; }
    #sc .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #sc .sub { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #sc .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #sc .mono12 { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #111111; white-space: pre; }
    #sc .mono15 { font-family: "Courier New", Courier, monospace; font-size: 15px; font-weight: 700; fill: #111111; }
    #sc .file { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #8c7106; }
    #sc .cap  { font-size: 13px; fill: #5E5850; }
    #sc .capr { font-size: 13px; fill: #C30B0A; }
    #sc .capg { font-size: 13px; font-weight: 700; fill: #5a8c1c; }
    #sc .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #sc .map  { stroke: #5E5850; stroke-width: 1; stroke-dasharray: 3 3; fill: none; }
    #sc .yed  { stroke: #C29E08; stroke-width: 1.5; stroke-dasharray: 5 4; fill: none; }
    #sc .hed  { stroke: #3576C0; stroke-width: 1.6; stroke-dasharray: 5 4; fill: none; }
    #sc .brk  { stroke: #5E5850; stroke-width: 1.2; fill: none; }
    #sc .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="sc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="sc-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/></marker>
    <marker id="sc-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/></marker>
  </defs>
  <g data-key="st">
<rect x="290" y="40" width="360" height="260" rx="8" class="bw"/>
<text x="304" y="64" class="ttl">The C struct behind object A</text>
<text x="304" y="84" class="file">numpy/_core/include/numpy/ndarraytypes.h</text>
<text x="304" y="112" class="mono">PyObject_HEAD</text>
<text x="490" y="112" class="cap">reference count and type</text>
<text x="304" y="134" class="mono">char *data;</text>
<text x="490" y="134" class="cap">buffer address</text>
<text x="304" y="156" class="mono">int nd;</text>
<text x="490" y="156" class="cap">number of axes</text>
<text x="304" y="178" class="mono">npy_intp *dimensions;</text>
<text x="490" y="178" class="cap">sizes along axes</text>
<text x="304" y="200" class="mono">npy_intp *strides;</text>
<text x="490" y="200" class="cap">byte steps along axes</text>
<text x="304" y="222" class="mono">PyObject *base;</text>
<text x="490" y="222" class="cap">whose buffer this is</text>
<text x="304" y="244" class="mono">PyArray_Descr *descr;</text>
<text x="490" y="244" class="cap">element type</text>
<text x="304" y="266" class="mono">int flags;</text>
<text x="490" y="266" class="cap">bits: order, writable</text>
<text x="304" y="288" class="cap">+ weakreflist, _buffer_info, mem_handler</text>
  </g>
  <g data-key="py">
<rect x="30" y="40" width="222" height="260" rx="8" class="bx"/>
<text x="44" y="64" class="ttl">A in Python</text>
<text x="44" y="84" class="cap">attribute → what it returns</text>
<text x="44" y="112" class="mono">type(A) → ndarray</text>
<line x1="254" y1="108" x2="288" y2="108" class="map"/>
<text x="44" y="134" class="mono">A.ctypes.data → address</text>
<line x1="254" y1="130" x2="288" y2="130" class="map"/>
<text x="44" y="156" class="mono">A.ndim → 2</text>
<line x1="254" y1="152" x2="288" y2="152" class="map"/>
<text x="44" y="178" class="mono">A.shape → (2, 3)</text>
<line x1="254" y1="174" x2="288" y2="174" class="map"/>
<text x="44" y="200" class="mono">A.strides → (24, 8)</text>
<line x1="254" y1="196" x2="288" y2="196" class="map"/>
<text x="44" y="222" class="mono">A.base → None</text>
<line x1="254" y1="218" x2="288" y2="218" class="map"/>
<text x="44" y="244" class="mono">A.dtype → int64</text>
<line x1="254" y1="240" x2="288" y2="240" class="map"/>
<text x="44" y="266" class="mono">A.flags → C_CONTIGUOUS</text>
<line x1="254" y1="262" x2="288" y2="262" class="map"/>
<text x="44" y="288" class="cap">not visible from Python</text>
  </g>
  <g data-key="ct">
<rect x="680" y="40" width="250" height="260" rx="8" class="by"/>
<text x="694" y="64" class="ttl">np.matmul: contract</text>
<text x="694" y="88" class="mono">(n?,k),(k,m?)-&gt;(n?,m?)</text>
<text x="694" y="112" class="sub">takes</text>
<text x="694" y="130" class="mono">x1, x2</text>
<text x="770" y="130" class="cap">two arrays</text>
<text x="694" y="148" class="mono">out=</text>
<text x="770" y="148" class="cap">ready buffer</text>
<text x="694" y="166" class="mono">dtype=</text>
<text x="770" y="166" class="cap">compute type</text>
<text x="694" y="184" class="mono">axes=</text>
<text x="770" y="184" class="cap">where matrix axes are</text>
<text x="694" y="202" class="cap">and casting, order, subok</text>
<text x="694" y="226" class="sub">returns</text>
<text x="694" y="244" class="cap">new ndarray (n, m)</text>
<text x="694" y="262" class="cap">or out itself if given</text>
<text x="694" y="280" class="cap">a scalar if both are 1-D</text>
<line x1="660" y1="338" x2="738" y2="304" class="yed" marker-end="url(#sc-arwy)"/>
  </g>
  <g data-key="c1">
<rect x="30" y="340" width="200" height="90" rx="8" class="bx"/>
<text x="130" y="366" class="mono15" text-anchor="middle">C = A @ B</text>
<text x="130" y="388" class="cap" text-anchor="middle">your Python code</text>
<text x="130" y="410" class="capg" text-anchor="middle">C — a new ndarray</text>
  </g>
  <g data-key="c2">
<line x1="230" y1="385" x2="259" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="263" y="340" width="200" height="90" rx="8" class="by"/>
<text x="363" y="366" class="mono" text-anchor="middle">array_matrix_multiply</text>
<text x="363" y="388" class="file" text-anchor="middle">multiarray/number.c</text>
<text x="363" y="410" class="cap" text-anchor="middle">nb_matrix_multiply slot</text>
<path d="M 263 334 L 263 326 L 929 326 L 929 334" class="brk"/>
<text x="470" y="319" class="cap" text-anchor="middle">these three blocks live in _multiarray_umath.pyd</text>
  </g>
  <g data-key="c3">
<line x1="463" y1="385" x2="492" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="496" y="340" width="200" height="90" rx="8" class="by"/>
<text x="596" y="366" class="mono" text-anchor="middle">ufunc np.matmul</text>
<text x="596" y="388" class="file" text-anchor="middle">generate_umath.py</text>
<text x="596" y="410" class="cap" text-anchor="middle">shapes, dtype, loop choice</text>
  </g>
  <g data-key="c4">
<line x1="696" y1="385" x2="725" y2="385" class="edge" marker-end="url(#sc-arw)"/>
<rect x="729" y="340" width="200" height="90" rx="8" class="by"/>
<text x="829" y="366" class="mono" text-anchor="middle">@TYPE@_matmul</text>
<text x="829" y="388" class="file" text-anchor="middle">umath/matmul.c.src</text>
<text x="829" y="410" class="cap" text-anchor="middle">3 loops or cblas_dgemm</text>
  </g>
  <g data-key="h1">
<rect x="30" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="130" y1="478" x2="130" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="40" y="504" class="ttl">① subclass</text>
<text x="40" y="528" class="mono12">class My(np.ndarray):</text>
<text x="40" y="546" class="mono12">  def __matmul__(s, o):</text>
<text x="40" y="564" class="mono12">    print(s.shape)</text>
<text x="40" y="582" class="mono12">    return super()…</text>
<text x="40" y="610" class="cap">changes @ only</text>
<text x="40" y="628" class="cap">for your objects</text>
  </g>
  <g data-key="h2">
<rect x="263" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="400" y1="478" x2="556" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="273" y="504" class="ttl">② function arguments</text>
<text x="273" y="528" class="mono12">np.matmul(A, B,</text>
<text x="273" y="546" class="mono12">    out=C,</text>
<text x="273" y="564" class="mono12">    dtype=np.float64)</text>
<text x="273" y="592" class="cap">the @ operator has</text>
<text x="273" y="610" class="cap">no such parameters</text>
<text x="273" y="628" class="cap">out: no new array</text>
  </g>
  <g data-key="h3">
<rect x="496" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="620" y1="478" x2="620" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="506" y="504" class="ttl">③ __array_ufunc__</text>
<text x="506" y="528" class="mono12">class Spy:</text>
<text x="506" y="546" class="mono12"> def __array_ufunc__(</text>
<text x="506" y="564" class="mono12">   s, uf, m, *a, **kw):</text>
<text x="506" y="592" class="cap">your object receives</text>
<text x="506" y="610" class="cap">the whole ufunc call</text>
<text x="506" y="628" class="cap">CuPy and Dask work this way</text>
  </g>
  <g data-key="h4">
<rect x="729" y="480" width="200" height="170" rx="8" class="hk"/>
<line x1="829" y1="478" x2="829" y2="436" class="hed" marker-end="url(#sc-arwb)"/>
<text x="739" y="504" class="ttl">④ editing the source</text>
<text x="739" y="528" class="mono12">git clone … numpy</text>
<text x="739" y="546" class="mono12"># edit matmul.c.src</text>
<text x="739" y="564" class="mono12">pip install .</text>
<text x="739" y="592" class="capr">needs a C compiler</text>
<text x="739" y="610" class="capr">and your own .pyd build</text>
<text x="739" y="628" class="cap">last resort</text>
  </g>
  <text x="30" y="676" class="legend">blue — your code and data · yellow — NumPy code · green — result · blue dashed — where a developer can step in</text>

</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="st" data-focus="st">
      <div class="step-kicker">Step 1 · struct</div>
      <h4>In the original, ndarray is a C struct</h4>
      <p>In memory, object <code>A</code> is an instance of <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/include/numpy/ndarraytypes.h#L790-L839" target="_blank" rel="noopener"><code>PyArrayObject_fields</code></a> from <code>ndarraytypes.h</code>.
      The numbers themselves are not in it: there is a pointer <code>data</code> to a separate buffer, the
      number of axes <code>nd</code>, two arrays of length <code>nd</code>, <code>dimensions</code> and <code>strides</code>,
      and a pointer <code>descr</code> to the type description. The "header" from the previous scene is exactly these fields.</p>
    </div>
    <div class="step-panel" data-on="st py" data-focus="py">
      <div class="step-kicker">Step 2 · Python ↔ C</div>
      <h4>Python attributes are field reads</h4>
      <p><code>A.shape</code> builds a tuple from <code>dimensions</code>, <code>A.dtype</code> returns the object at
      the <code>descr</code> pointer, <code>A.base</code> is the <code>base</code> field. That is why attributes are cheap:
      they compute nothing. <code>A.T</code> creates a new struct with swapped
      <code>dimensions</code> and <code>strides</code>, the same <code>data</code>, and <code>base</code> pointing to
      <code>A</code>: <code>A.T.base is A</code> gives <code>True</code>.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2" data-focus="c1 c2">
      <div class="step-kicker">Step 3 · operator</div>
      <h4>@ lands in the nb_matrix_multiply slot</h4>
      <p>The <code>ndarray</code> type is described in C by the <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/arrayobject.c#L1263" target="_blank" rel="noopener"><code>PyArray_Type</code></a> struct, which has a table of numeric
      operations. The <code>@</code> operator maps there to the function <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/multiarray/number.c#L290-L295" target="_blank" rel="noopener"><code>array_matrix_multiply</code></a> from <code>number.c</code>,
      just two lines: check whether the second operand wants to handle <code>@</code> itself, and call
      <code>np.matmul(A, B)</code>. From Python you can see it like this: <code>np.ndarray.__matmul__</code> prints as
      <code>&lt;slot wrapper '__matmul__'&gt;</code>.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct" data-focus="c3 ct">
      <div class="step-kicker">Step 4 · contract</div>
      <h4>What np.matmul takes and what it returns</h4>
      <p><code>np.matmul</code> itself is declared by a single entry in <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/generate_umath.py#L1177-L1184" target="_blank" rel="noopener"><code>generate_umath.py</code></a>: two inputs, one output and
      the signature <code>(n?,k),(k,m?)-&gt;(n?,m?)</code>. It reads like this: the last axes of the first array are
      <span class="math-inline" data-tex="n\times k"></span>, of the second <span class="math-inline" data-tex="k\times m"></span>, of the result <span class="math-inline" data-tex="n\times m"></span>; a question mark means
      the axis may be missing, which is how vectors are multiplied. Everything to the left of the last two axes works
      as a stack of matrices. The parameters and return value are described in <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/code_generators/ufunc_docstrings.py#L2764" target="_blank" rel="noopener"><code>ufunc_docstrings.py</code></a>.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the same A and B</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substituting</span>
            <div class="math-display worked-math" data-tex="(n\times k)\cdot(k\times m) = (2\times 3)\cdot(3\times 2)"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="n\times m = 2\times 2"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> if the inner sizes do not match,
        as in <code>A @ A</code>, the ufunc stops right here with a <code>ValueError</code> about a
        <em>mismatch in its core dimension</em>, before any multiplication.</p>
      </div>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4" data-focus="c4">
      <div class="step-kicker">Step 5 · inner loop</div>
      <h4>The inner loop is a C template</h4>
      <p><a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L447-L642" target="_blank" rel="noopener"><code>matmul.c.src</code></a> is not an ordinary C file but a template: at build time the <code>/**begin repeat</code> block multiplies
      the function <code>@TYPE@_matmul</code> into 19 copies, one per type; these are the 19 variants that
      <code>len(np.matmul.types)</code> shows. For <code>int64</code> (on Windows that is <code>LONGLONG_matmul</code>)
      <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L266-L320" target="_blank" rel="noopener"><code>@TYPE@_matmul_inner_noblas</code></a> does the work: the three nested loops from part 1, except that the memory step comes from
      <code>strides</code>. For <code>float32</code> and <code>float64</code>, if the arrays are contiguous in memory,
      the same function hands the work to <code>cblas_sgemm</code> / <a class="src" href="https://github.com/numpy/numpy/blob/v2.5.3/numpy/_core/src/umath/matmul.c.src#L236" target="_blank" rel="noopener"><code>cblas_dgemm</code></a> from OpenBLAS.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2" data-focus="h2">
      <div class="step-kicker">Step 6 · way 1</div>
      <h4>Pass what does not fit through @</h4>
      <p>The operator has exactly two operands, while the function has the whole contract from step 4. <code>out=C</code>
      writes the result into a preallocated array and returns that same array: <code>R is C</code> is <code>True</code>,
      no new object is created, which matters inside a training loop. <code>dtype=np.float64</code> converts integers
      to float and sends the call down the BLAS branch. <code>axes=</code> says which axes to treat as the matrix when
      they are not the last ones.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2 h1 h3" data-focus="h1 h3">
      <div class="step-kicker">Step 7 · ways 2 and 3</div>
      <h4>Change the behavior from outside without touching NumPy</h4>
      <p>A subclass of <code>ndarray</code> overrides <code>__matmul__</code> at the Python level and calls
      the parent through <code>super()</code>; this is how people log shapes or check units of measurement.
      The <code>__array_ufunc__</code> protocol goes deeper: if an operand has this method,
      <code>np.matmul</code> does not compute anything itself and hands it the whole call: the ufunc, the method and the arguments.
      CuPy and Dask are built on this: <code>np.matmul</code> on their arrays runs on a GPU or block by block.</p>
    </div>
    <div class="step-panel" data-on="st py c1 c2 c3 ct c4 h2 h1 h3 h4" data-focus="h4">
      <div class="step-kicker">Step 8 · way 4</div>
      <h4>Change NumPy itself and rebuild it</h4>
      <p>If you need different behavior inside the loop, you edit <code>matmul.c.src</code> in a clone of the
      repository and then build NumPy from source in your environment: <code>pip install .</code>
      invokes Meson and a C compiler. The output is your own <code>_multiarray_umath.pyd</code>.</p>
      <div class="callout-red">
        <strong>The cost:</strong> you will have to port every new NumPy version by hand, and your colleagues will have to install
        your build. That is why this path comes last: arguments, a subclass or the protocol first.
      </div>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>The three ways that do not require touching NumPy, in one file; the output was checked on NumPy 2.5.3:</p>

<pre><code>import numpy as np

A = np.array([[1, 2, 0], [3, -1, 2]])
B = np.array([[2, 1], [0, 1], [1, -1]])

# 1. Arguments the @ operator does not have
C = np.empty((2, 2), dtype=np.int64)
R = np.matmul(A, B, out=C)
print(R is C)                             # True — the result went into my buffer
print(np.matmul(A, B, dtype=np.float64))  # [[2. 3.]
                                          #  [8. 0.]] — the float/BLAS branch

# 2. Subclass: I change how @ behaves for my type
class LogArr(np.ndarray):
    def __matmul__(self, other):
        print(f"@: {self.shape} x {np.shape(other)}")
        return super().__matmul__(other)

L = A.view(LogArr)
L @ B                                     # @: (2, 3) x (3, 2)

# 3. Protocol: a foreign object intercepts the ufunc
class Spy:
    def __init__(self, a):
        self.a = np.asarray(a)
    def __array_ufunc__(self, ufunc, method, *inputs, **kwargs):
        print("intercepted:", ufunc.__name__, method)
        inputs = [x.a if isinstance(x, Spy) else x for x in inputs]
        return getattr(ufunc, method)(*inputs, **kwargs)

A @ Spy(B)                                # intercepted: matmul __call__</code></pre>

<div class="callout-yellow">
  <strong>How to find such a place yourself:</strong> <code>np.matmul.signature</code> prints the shape
  signature, <code>np.matmul.types</code> the list of inner loops (<code>'qq-&gt;q'</code>,
  <code>'dd-&gt;d'</code> and so on), and <code>np.ndarray.__matmul__</code> shows that it is a slot of a C type, not a
  Python function. Then you search for the name in the repository on GitHub. Editing it "in place" in
  <code>site-packages</code> will not work: what lies there is an already compiled <code>.pyd</code>, and the
  <code>matmul.c.src</code> source is not in the wheel.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> a library object is data plus methods,
  and <code>A @ B</code> is a method call that crosses from Python into compiled code once, runs
  the same three loops there and returns a new object. The code of this path is open, and you can hook
  into it: with function arguments, a subclass, the <code>__array_ufunc__</code> protocol or, as a last
  resort, a rebuild.
</div>

<hr>

<h2 id="part-5">Part 5. Linear regression by hand in NumPy</h2>

<p>
  Now I build a machine learning model out of the same multiplications: <strong>linear regression</strong>.
  There are <span class="math-inline" data-tex="N = 4"></span> samples, each with <span class="math-inline" data-tex="P = 2"></span>
  features and a correct answer. The model predicts the answer as a weighted sum of the features plus a bias:
</p>

<div class="math-display" data-tex="\hat y_i = w_1 x_{i1} + w_2 x_{i2} + b \qquad\Longleftrightarrow\qquad \hat{\mathbf y} = X\mathbf w + b"></div>

<p>
  Here <span class="math-inline" data-tex="X"></span> is the <span class="math-inline" data-tex="4\times 2"></span> feature matrix
  (one row per sample), <span class="math-inline" data-tex="\mathbf w"></span> holds two weights and
  <span class="math-inline" data-tex="b"></span> is a number. <span class="math-inline" data-tex="X\mathbf w"></span> is the same
  multiplication as in part 1, with a right-hand matrix that is a single column. My data:
</p>

<div class="math-display" data-tex="X = \begin{bmatrix} 1 &amp; 2 \\ 2 &amp; 0 \\ 0 &amp; 1 \\ 3 &amp; 1 \end{bmatrix}, \qquad \mathbf y = \begin{bmatrix} 4.3 \\ 4.3 \\ 1.6 \\ 7.6 \end{bmatrix}"></div>

<p>
  Training the model means finding the <span class="math-inline" data-tex="\mathbf w"></span> and <span class="math-inline" data-tex="b"></span>
  that minimize the mean squared error (MSE):
</p>

<div class="math-display" data-tex="L = \frac{1}{N}\sum_{i=1}^{N} (\hat y_i - y_i)^2"></div>

<p>
  I will search for them with gradient descent: compute the prediction, the error and the gradient, move the
  parameters against the gradient and repeat. For linear regression the gradient fits in one line; where it
  comes from is worked out in detail in the article
  <a href="article.html?slug=linear-regression-full-cycle">"Linear regression: the full training cycle on three numbers"</a> (in Russian):
</p>

<div class="math-display" data-tex="\frac{\partial L}{\partial \mathbf w} = \frac{2}{N}\,X^{\top}(\hat{\mathbf y} - \mathbf y), \qquad \frac{\partial L}{\partial b} = \frac{2}{N}\sum_{i=1}^{N}(\hat y_i - y_i)"></div>

<p>
  From NumPy we need only <code>@</code>, <code>.T</code>, <code>.sum()</code> and <code>.mean()</code>,
  all of which appeared in part 4. Let us go through the first iteration with numbers: on the left the table of
  samples, the parameters and the error, on the right the lines of code that compute them.
</p>

<div class="stage" id="stageLR" tabindex="0">
  <div class="stage-figure">
<svg id="lr" viewBox="0 0 960 600" role="img" aria-label="One iteration of gradient descent for linear regression in NumPy: data, prediction, error, gradient, step and 500 repetitions, with the code alongside">
  <style>
    #lr { font-family: Helvetica, Arial, sans-serif; }
    #lr .cb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.2; }
    #lr .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.2; }
    #lr .cr { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.2; }
    #lr .ce { fill: #FFFFFF; stroke: #B9B3A6; stroke-width: 1.2; stroke-dasharray: 4 3; }
    #lr .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #lr .br { fill: #FFF2F2; stroke: #C30B0A; stroke-width: 1.6; }
    #lr .tc { fill: #FFFFFF; stroke: #C8C3B6; stroke-width: 1; }
    #lr .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #lr .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #lr .cap { font-size: 13px; fill: #5E5850; }
    #lr .capr { font-size: 13px; fill: #C30B0A; }
    #lr .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #lr .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <text x="130" y="36" class="cap" text-anchor="middle">features X</text>
  <text x="270" y="36" class="cap" text-anchor="middle">prediction</text>
  <text x="365" y="36" class="cap" text-anchor="middle">targets</text>
  <text x="460" y="36" class="cap" text-anchor="middle">error</text>
  <foreignObject x="55" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x_1"></div></foreignObject>
  <foreignObject x="115" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="x_2"></div></foreignObject>
  <foreignObject x="225" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat y"></div></foreignObject>
  <foreignObject x="320" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="y"></div></foreignObject>
  <foreignObject x="415" y="46" width="90" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:15px;color:#111111;font-weight:700" data-tex="\hat y - y"></div></foreignObject>
  <foreignObject x="34" y="84.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="70" y="80" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="81" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="130" y="80" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="81" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="330" y="80" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="81" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.3"></div></foreignObject>
  <rect x="230" y="80" width="80" height="36" class="ce"/>
  <rect x="420" y="80" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="120.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="70" y="116" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="117" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="2"></div></foreignObject>
  <rect x="130" y="116" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="117" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  <rect x="330" y="116" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="117" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.3"></div></foreignObject>
  <rect x="230" y="116" width="80" height="36" class="ce"/>
  <rect x="420" y="116" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="156.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="3"></div></foreignObject>
  <rect x="70" y="152" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="153" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  <rect x="130" y="152" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="153" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="330" y="152" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="153" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.6"></div></foreignObject>
  <rect x="230" y="152" width="80" height="36" class="ce"/>
  <rect x="420" y="152" width="80" height="36" class="ce"/>
  <foreignObject x="34" y="192.5" width="28" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:13px;color:#5E5850;font-weight:400" data-tex="4"></div></foreignObject>
  <rect x="70" y="188" width="60" height="36" class="cb"/>
  <foreignObject x="72" y="189" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="3"></div></foreignObject>
  <rect x="130" y="188" width="60" height="36" class="cb"/>
  <foreignObject x="132" y="189" width="56" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
  <rect x="330" y="188" width="70" height="36" class="cb"/>
  <foreignObject x="332" y="189" width="66" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.6"></div></foreignObject>
  <rect x="230" y="188" width="80" height="36" class="ce"/>
  <rect x="420" y="188" width="80" height="36" class="ce"/>
  <rect x="30" y="246" width="260" height="80" rx="8" class="by"/>
  <text x="44" y="270" class="ttl">model parameters</text>
  <rect x="310" y="246" width="270" height="80" rx="8" class="br"/>
  <text x="324" y="270" class="ttl">MSE loss</text>
  <g data-key="yh0" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
  </g>
  <g data-key="er0" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-4.3"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-4.3"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-1.6"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-7.6"></div></foreignObject>
  </g>
  <g data-key="p0" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [0,\ 0],\quad b = 0"></div></foreignObject>
  </g>
  <g data-key="l0" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 24.325"></div></foreignObject>
  </g>
  <g data-key="yh1" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.455"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.46"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.78"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.135"></div></foreignObject>
  </g>
  <g data-key="er1" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.155"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.16"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.18"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.465"></div></foreignObject>
  </g>
  <g data-key="p1" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [1.785,\ 0.89],\quad b = 0.89"></div></foreignObject>
  </g>
  <g data-key="l1" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 0.0746"></div></foreignObject>
  </g>
  <g data-key="yh5" data-only="1">
    <rect x="230" y="80" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.45"></div></foreignObject>
    <rect x="230" y="116" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="4.45"></div></foreignObject>
    <rect x="230" y="152" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="1.45"></div></foreignObject>
    <rect x="230" y="188" width="80" height="36" class="cg"/>
    <foreignObject x="232" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="7.45"></div></foreignObject>
  </g>
  <g data-key="er5" data-only="1">
    <rect x="420" y="80" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="81" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.15"></div></foreignObject>
    <rect x="420" y="116" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="117" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="0.15"></div></foreignObject>
    <rect x="420" y="152" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="153" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.15"></div></foreignObject>
    <rect x="420" y="188" width="80" height="36" class="cr"/>
    <foreignObject x="422" y="189" width="76" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:16px;color:#111111;font-weight:400" data-tex="-0.15"></div></foreignObject>
  </g>
  <g data-key="p5" data-only="1">
    <foreignObject x="44" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\mathbf w = [2,\ 1],\quad b = 0.45"></div></foreignObject>
  </g>
  <g data-key="l5" data-only="1">
    <foreignObject x="324" y="285" width="240" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = 0.0225"></div></foreignObject>
  </g>
  <g data-key="d-pred" data-only="1">
    <foreignObject x="30" y="355" width="550" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\hat y_i = w_1 x_{i1} + w_2 x_{i2} + b"></div></foreignObject>
    <foreignObject x="30" y="394" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>all at once: <span data-tex="\hat{\mathbf y} = X\mathbf w + b"></span>, shapes <span data-tex="(4\times 2)\cdot(2\times 1) \to 4\times 1"></span></span></div></foreignObject>
    <foreignObject x="30" y="430" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>first row: <span data-tex="\hat y_1 = 0\cdot 1 + 0\cdot 2 + 0 = 0"></span></span></div></foreignObject>
    <text x="30" y="484" class="cap">the weights are still zero, so all four predictions equal 0</text>
  </g>
  <g data-key="d-loss" data-only="1">
    <foreignObject x="30" y="356" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="L = \dfrac{1}{N}\sum_{i=1}^{N} (\hat y_i - y_i)^2"></div></foreignObject>
    <foreignObject x="30" y="416" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="= \dfrac{4.3^2 + 4.3^2 + 1.6^2 + 7.6^2}{4} = \dfrac{97.3}{4} = 24.325"></div></foreignObject>
    <text x="30" y="498" class="cap">squaring makes every error positive and large errors more visible</text>
  </g>
  <g data-key="d-grad" data-only="1">
    <foreignObject x="30" y="354" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial L}{\partial \mathbf w} = \dfrac{2}{N}\,X^{\top}(\hat{\mathbf y} - \mathbf y) = [-17.85,\ -8.9]"></div></foreignObject>
    <foreignObject x="30" y="412" width="550" height="56"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\dfrac{\partial L}{\partial b} = \dfrac{2}{N}\sum_{i}(\hat y_i - y_i) = -8.9"></div></foreignObject>
    <foreignObject x="30" y="476.5" width="550" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>X.T @ err is again a matrix product: <span data-tex="(2\times 4)\cdot(4\times 1) \to 2\times 1"></span></span></div></foreignObject>
    <text x="30" y="526" class="cap">both gradients are negative: increasing w and b lowers the error</text>
  </g>
  <g data-key="d-step" data-only="1">
    <foreignObject x="30" y="362" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="\mathbf w \leftarrow [0,\ 0] - 0.1\cdot[-17.85,\ -8.9] = [1.785,\ 0.89]"></div></foreignObject>
    <foreignObject x="30" y="402" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400" data-tex="b \leftarrow 0 - 0.1\cdot(-8.9) = 0.89"></div></foreignObject>
    <foreignObject x="30" y="444" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:400"><span>loss after one step: <span data-tex="24.325 \to 0.0746"></span></span></div></foreignObject>
    <text x="30" y="498" class="cap">the first three predictions are slightly high, the fourth is 0.465 low</text>
  </g>
  <g data-key="d-loop" data-only="1">
    <text x="30" y="372" class="ttl">loss by step</text>
    <rect x="30" y="386" width="80" height="34" class="tc"/>
    <foreignObject x="32" y="387" width="76" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="\text{step}"></div></foreignObject>
    <rect x="110" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="112" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0"></div></foreignObject>
    <rect x="200" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="202" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="1"></div></foreignObject>
    <rect x="290" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="292" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="10"></div></foreignObject>
    <rect x="380" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="382" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="100"></div></foreignObject>
    <rect x="470" y="386" width="90" height="34" class="tc"/>
    <foreignObject x="472" y="387" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="500"></div></foreignObject>
    <rect x="30" y="420" width="80" height="34" class="tc"/>
    <foreignObject x="32" y="421" width="76" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:700" data-tex="L"></div></foreignObject>
    <rect x="110" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="112" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="24.325"></div></foreignObject>
    <rect x="200" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="202" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0746"></div></foreignObject>
    <rect x="290" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="292" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0407"></div></foreignObject>
    <rect x="380" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="382" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0227"></div></foreignObject>
    <rect x="470" y="420" width="90" height="34" class="tc"/>
    <foreignObject x="472" y="421" width="86" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit svg-math-center" style="font-size:14px;color:#111111;font-weight:400" data-tex="0.0225"></div></foreignObject>
    <text x="30" y="484" class="cap">after 200 steps the loss barely changes: the remaining 0.0225 is noise in the data</text>
    <foreignObject x="30" y="490.5" width="550" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>the plane <span data-tex="\hat y = 2x_1 + x_2 + 0.45"></span> misses the points: errors of <span data-tex="\pm 0.15"></span></span></div></foreignObject>
  </g>
  <g data-key="d-new" data-only="1">
    <foreignObject x="30" y="356" width="550" height="32"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:15px;color:#111111;font-weight:700"><span>new sample <span data-tex="\mathbf x = [1,\ 1]"></span></span></div></foreignObject>
    <foreignObject x="30" y="393" width="550" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:16px;color:#111111;font-weight:400" data-tex="\hat y = 2\cdot 1 + 1\cdot 1 + 0.45 = 3.45"></div></foreignObject>
    <text x="30" y="452" class="cap">predict(X_new, w, b): the trained w and b live in two variables,</text>
    <text x="30" y="472" class="cap">and you have to pass them to predict yourself</text>
  </g>
  <rect x="600" y="30" width="330" height="530" rx="8" class="codebox"/>
  <text x="614" y="56" class="ttl">NumPy code</text>
  <g data-key="k-def">
    <text x="614" y="88" class="code">def train(X, y, lr=0.1, steps=500):</text>
  </g>
  <g data-key="k-init">
    <text x="614" y="109" class="code">    n, m = X.shape</text>
    <text x="614" y="130" class="code">    w = np.zeros(m)</text>
    <text x="614" y="151" class="code">    b = 0.0</text>
  </g>
  <g data-key="k-loop">
    <text x="614" y="172" class="code">    for step in range(steps):</text>
    <text x="614" y="319" class="code">    return w, b</text>
  </g>
  <g data-key="k-pred">
    <text x="614" y="193" class="code">        y_hat = X @ w + b</text>
  </g>
  <g data-key="k-err">
    <text x="614" y="214" class="code">        err = y_hat - y</text>
  </g>
  <g data-key="k-grad">
    <text x="614" y="235" class="code">        dw = 2 / n * (X.T @ err)</text>
    <text x="614" y="256" class="code">        db = 2 / n * err.sum()</text>
  </g>
  <g data-key="k-step">
    <text x="614" y="277" class="code">        w -= lr * dw</text>
    <text x="614" y="298" class="code">        b -= lr * db</text>
  </g>
  <g data-key="k-new">
    <text x="614" y="361" class="code">def predict(X, w, b):</text>
    <text x="614" y="382" class="code">    return X @ w + b</text>
  </g>
  <g data-key="k-loss">
    <text x="614" y="424" class="code">def mse(y_hat, y):</text>
    <text x="614" y="445" class="code">    return ((y_hat - y) ** 2).mean()</text>
  </g>
  <text x="614" y="540" class="cap">I write every line myself</text>
  <text x="30" y="588" class="legend">blue — data · yellow — parameters · green — prediction · red — error and gradient</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="p0 k-def k-init" data-focus="p0 k-init">
      <div class="step-kicker">Step 1 · data</div>
      <h4>Four samples, two features, three parameters</h4>
      <p>Each row of the table is a sample: two features <span class="math-inline" data-tex="x_1, x_2"></span> and the correct answer
      <span class="math-inline" data-tex="y"></span>. The features form the matrix <code>X</code> of shape <code>(4, 2)</code>, the answers form the vector
      <code>y</code> of shape <code>(4,)</code>. The model is described by three numbers: two weights <code>w</code> and a bias <code>b</code>.
      I start from zeros: <code>w = np.zeros(m)</code>, where <code>m = 2</code> is the number of features.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 d-pred k-pred" data-focus="yh0 d-pred k-pred">
      <div class="step-kicker">Step 2 · prediction</div>
      <h4>A prediction is a matrix times a vector</h4>
      <p>The line <code>y_hat = X @ w + b</code> computes the prediction for all samples at once: each row of
      <code>X</code> is dotted with <code>w</code>, and <code>b</code> is added to the result. This is the multiplication from
      part 1 with a right-hand matrix that is a single column. While the weights are zero, all predictions are zero.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 er0 l0 d-loss k-err k-loss" data-focus="er0 l0 d-loss k-err k-loss">
      <div class="step-kicker">Step 3 · loss</div>
      <h4>The loss is the mean of squared differences</h4>
      <p><code>err = y_hat - y</code> is the difference for each sample: right now every prediction is below the answer,
      so the errors are negative. The <code>mse</code> function squares and averages them:
      <span class="math-inline" data-tex="L = 24.325"></span>. Training should make this number as small as possible.</p>
    </div>
    <div class="step-panel" data-on="p0 yh0 er0 l0 d-grad k-grad" data-focus="d-grad k-grad">
      <div class="step-kicker">Step 4 · gradient</div>
      <h4>The gradient shows which way to move the weights</h4>
      <p>The gradient is the vector of derivatives of the loss with respect to each parameter. For linear regression it
      takes two lines: <code>dw = 2 / n * (X.T @ err)</code> and <code>db = 2 / n * err.sum()</code>.
      The sign tells you in which direction the loss grows: both gradients are negative, so increasing the weights lowers the loss.</p>
      <div class="worked-example">
        <div class="worked-label">Worked example · the first weight</div>
        <div class="worked-grid">
          <div class="worked-cell">
            <span>Substituting</span>
            <div class="math-display worked-math" data-tex="\tfrac{2}{4}\,(1\cdot(-4.3) + 2\cdot(-4.3) + 0\cdot(-1.6) + 3\cdot(-7.6))"></div>
          </div>
          <div class="worked-cell worked-result">
            <span>Result</span>
            <div class="math-display worked-math" data-tex="\partial L/\partial w_1 = -17.85"></div>
          </div>
        </div>
        <p class="worked-reading"><strong>How to read it:</strong> the column of feature <span class="math-inline" data-tex="x_1"></span>
        is dotted with the column of errors; this is one row of the product <code>X.T @ err</code>.</p>
      </div>
    </div>
    <div class="step-panel" data-on="p1 yh1 er1 l1 d-step k-step" data-focus="p1 l1 d-step k-step">
      <div class="step-kicker">Step 5 · update</div>
      <h4>The parameters move against the gradient</h4>
      <p><code>w -= lr * dw</code>: each parameter loses its gradient multiplied by the step size
      <code>lr = 0.1</code>. The weights became <code>[1.785, 0.89]</code>, the bias <code>0.89</code>. With the new parameters
      the predictions almost match the answers, and the loss fell from 24.325 to 0.0746.</p>
    </div>
    <div class="step-panel" data-on="p5 yh5 er5 l5 d-loop k-loop" data-focus="p5 l5 d-loop k-loop">
      <div class="step-kicker">Step 6 · loop</div>
      <h4>500 repetitions, and the parameters stop changing</h4>
      <p>Steps 2–5 repeat in the loop <code>for step in range(steps)</code>. The first step removed almost all
      of the error; after that it shrinks slowly and by step 500 settles at 0.0225. By then the parameters
      are <code>w = [2, 1]</code>, <code>b = 0.45</code>: no smaller error is possible on this data.</p>
    </div>
    <div class="step-panel" data-on="p5 l5 d-new k-new" data-focus="d-new k-new">
      <div class="step-kicker">Step 7 · new sample</div>
      <h4>A trained model is two numbers and a formula</h4>
      <p>To predict the answer for a new sample you need only the formula <code>X @ w + b</code> and the learned
      <code>w</code> and <code>b</code>: for <code>[1, 1]</code> it gives 3.45. The trained parameters live in two
      variables, and you have to pass them to <code>predict</code> yourself.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>The whole file looks like this:</p>

<pre><code>import numpy as np

X = np.array([[1, 2], [2, 0], [0, 1], [3, 1]], dtype=float)
y = np.array([4.3, 4.3, 1.6, 7.6])

def train(X, y, lr=0.1, steps=500):
    n, m = X.shape
    w = np.zeros(m)
    b = 0.0
    for step in range(steps):
        y_hat = X @ w + b              # prediction for all samples
        err = y_hat - y                # error on each sample
        dw = 2 / n * (X.T @ err)       # gradient for the weights
        db = 2 / n * err.sum()         # gradient for the bias
        w -= lr * dw                   # step against the gradient
        b -= lr * db
    return w, b

def predict(X, w, b):
    return X @ w + b

def mse(y_hat, y):
    return ((y_hat - y) ** 2).mean()

w, b = train(X, y)
print(w.round(4), round(b, 4))                    # [2. 1.] 0.45
print(mse(predict(X, w, b), y).round(4))          # 0.0225
print(predict(np.array([[1, 1]]), w, b).round(4)) # [3.45]</code></pre>

<div class="callout-yellow">
  <strong>What this implementation lacks:</strong> the trained <code>w</code> and <code>b</code> are two separate
  variables; you have to keep them yourself and pass them to <code>predict</code> in the right order. If you call
  <code>predict(X, None, None)</code> before training, Python fails with a <code>TypeError</code> inside <code>@</code>, and
  the message does not tell you that the model simply has not been trained. The settings <code>lr</code> and <code>steps</code> are
  not recorded anywhere next to the result. In the next part a single object solves all of this.
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> linear regression in NumPy is four lines in a loop:
  <code>X @ w + b</code>, the difference with <code>y</code>, <code>X.T @ err</code> and a step against the gradient. NumPy provides
  fast <code>@</code> and <code>.T</code>, while the model, the training and storing the parameters remain your code.
</div>

<hr>

<h2 id="part-6">Part 6. The same model in scikit-learn: an object with attributes and methods</h2>

<p>
  scikit-learn installs the same way as NumPy, with one trap for beginners: the package name for pip and
  the name for import are different.
</p>

<pre><code>(.venv) C:\Users\work\proj&gt; pip install scikit-learn
(.venv) C:\Users\work\proj&gt; python -c "import sklearn; print(sklearn.__version__)"
1.9.1</code></pre>

<p>
  NumPy had no required dependencies. scikit-learn does, and pip downloads the missing wheels itself:
  <code>pip show scikit-learn</code> prints the line <code>Requires: joblib, narwhals, numpy, scipy, threadpoolctl</code>.
  Several folders appear in <code>site-packages</code>:
</p>

<pre><code>C:\Users\work\proj\.venv\Lib\site-packages\
├── sklearn\                      ← import sklearn
│   ├── __init__.py
│   ├── base.py                   ← BaseEstimator, RegressorMixin — shared parents of models
│   ├── linear_model\_base.py     ← LinearRegression — plain Python
│   ├── model_selection\          ← cross_val_score, GridSearchCV
│   ├── utils\validation.py       ← check_is_fitted, validate_data
│   └── …                         ← compiled .pyd modules live here too
├── scipy\                        ← lstsq and LAPACK
├── joblib\  threadpoolctl\  narwhals\
└── scikit_learn-1.9.1.dist-info\</code></pre>

<p>The same task as in part 5, in four lines:</p>

<pre><code>from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X, y)
print(model.coef_, round(model.intercept_, 4))    # [2. 1.] 0.45
print(model.predict([[1, 1]]))                    # [3.45]</code></pre>

<p>
  The numbers match mine, but they were obtained differently: <code>fit</code> does not run 500 steps of gradient
  descent, it solves the least squares problem exactly in one call. More important is something else: instead of two
  functions and two variables there is now one <strong>object</strong>. Let us look at what it holds and where its methods come from.
</p>

<div class="stage" id="stageEstimator" tabindex="0">
  <div class="stage-figure">
<svg id="es" viewBox="0 0 960 600" role="img" aria-label="The LinearRegression object: settings from the constructor, attributes learned in fit and methods inherited from parent classes; console commands on the left">
  <style>
    #es { font-family: Helvetica, Arial, sans-serif; }
    #es .codebox { fill: #F4F2EC; stroke: #3576C0; stroke-width: 1.5; }
    #es .obj { fill: #FFFFFF; stroke: #5E5850; stroke-width: 1.3; }
    #es .sy { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.4; }
    #es .sg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.4; }
    #es .sb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.4; }
    #es .hl { fill: none; stroke: #3576C0; stroke-width: 2.5; }
    #es .ttl { font-size: 15px; font-weight: 700; fill: #111111; }
    #es .sub { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #es .cap { font-size: 13px; fill: #5E5850; }
    #es .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #es .out { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #5E5850; }
    #es .err { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #C30B0A; }
    #es .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #es .edger { stroke: #C30B0A; stroke-width: 1.8; fill: none; stroke-dasharray: 5 3; }
    #es .edgeg { stroke: #73B222; stroke-width: 2; fill: none; }
    #es .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="es-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="es-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="es-arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
  <rect x="30" y="30" width="420" height="480" rx="8" class="codebox"/>
  <text x="44" y="56" class="ttl">Python console</text>
  <g data-key="c1" data-only="1">
    <text x="44" y="90" class="code">&gt;&gt;&gt; model = LinearRegression()</text>
  </g>
  <g data-key="c2" data-only="1">
    <text x="44" y="128" class="code">&gt;&gt;&gt; model.get_params()</text>
    <text x="44" y="150" class="out">{'copy_X': True, 'fit_intercept': True,</text>
    <text x="44" y="168" class="out">'n_jobs': None, 'positive': False, 'tol': 1e-06}</text>
  </g>
  <g data-key="c3" data-only="1">
    <text x="44" y="206" class="code">&gt;&gt;&gt; model.predict([[1, 1]])</text>
    <text x="44" y="228" class="err">NotFittedError: This LinearRegression</text>
    <text x="44" y="246" class="err">instance is not fitted yet. ...</text>
  </g>
  <g data-key="c4" data-only="1">
    <text x="44" y="284" class="code">&gt;&gt;&gt; model.fit(X, y)</text>
    <text x="44" y="306" class="out">LinearRegression()</text>
  </g>
  <g data-key="c5" data-only="1">
    <text x="44" y="344" class="code">&gt;&gt;&gt; model.coef_, round(model.intercept_, 4)</text>
    <text x="44" y="366" class="out">(array([2., 1.]), 0.45)</text>
  </g>
  <g data-key="c6" data-only="1">
    <text x="44" y="404" class="code">&gt;&gt;&gt; model.predict([[1, 1]])</text>
    <text x="44" y="426" class="out">array([3.45])</text>
  </g>
  <g data-key="c7" data-only="1">
    <text x="44" y="464" class="code">&gt;&gt;&gt; model.score(X, y)</text>
    <text x="44" y="486" class="out">0.9950248756218906</text>
  </g>
  <rect x="480" y="30" width="450" height="530" rx="8" class="obj"/>
  <text x="494" y="56" class="ttl">model — an object of class LinearRegression</text>
  <rect x="494" y="72" width="422" height="150" rx="6" class="sy"/>
  <text x="506" y="94" class="sub">settings: from __init__, names without _</text>
  <rect x="494" y="234" width="422" height="150" rx="6" class="sg"/>
  <text x="506" y="256" class="sub">learned in fit: names ending in _</text>
  <rect x="494" y="396" width="422" height="150" rx="6" class="sb"/>
  <text x="506" y="418" class="sub">methods: where they are defined</text>
  <g data-key="hyp" data-only="1">
    <text x="506" y="118" class="code">fit_intercept</text>
    <text x="650" y="118" class="code">= True</text>
    <text x="506" y="138" class="code">copy_X</text>
    <text x="650" y="138" class="code">= True</text>
    <text x="506" y="158" class="code">tol</text>
    <text x="650" y="158" class="code">= 1e-06</text>
    <text x="506" y="178" class="code">n_jobs</text>
    <text x="650" y="178" class="code">= None</text>
    <text x="506" y="198" class="code">positive</text>
    <text x="650" y="198" class="code">= False</text>
  </g>
  <g data-key="empty" data-only="1">
    <text x="705" y="316" class="cap" text-anchor="middle">empty: fit has not been called yet</text>
  </g>
  <g data-key="learned" data-only="1">
    <text x="506" y="280" class="code">n_features_in_</text>
    <text x="650" y="280" class="code">= 2</text>
    <text x="506" y="300" class="code">coef_</text>
    <text x="650" y="300" class="code">= [2., 1.]</text>
    <text x="506" y="320" class="code">intercept_</text>
    <text x="650" y="320" class="code">= 0.45</text>
    <text x="506" y="340" class="code">rank_</text>
    <text x="650" y="340" class="code">= 2</text>
    <text x="506" y="360" class="code">singular_</text>
    <text x="650" y="360" class="code">= [2.303, 1.303]</text>
  </g>
  <g data-key="meth">
    <text x="506" y="444" class="code">fit(X, y)</text>
    <text x="650" y="444" class="cap">LinearRegression</text>
    <text x="506" y="470" class="code">predict(X)</text>
    <text x="650" y="470" class="cap">MultiOutputLinearModel</text>
    <text x="506" y="496" class="code">score(X, y)</text>
    <text x="650" y="496" class="cap">RegressorMixin</text>
    <text x="506" y="522" class="code">get_params()</text>
    <text x="650" y="522" class="cap">BaseEstimator</text>
  </g>
  <g data-key="hl-fit" data-only="1">
    <rect x="500" y="427" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-pred" data-only="1">
    <rect x="500" y="453" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-score" data-only="1">
    <rect x="500" y="479" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="hl-gp" data-only="1">
    <rect x="500" y="505" width="410" height="24" rx="5" class="hl"/>
  </g>
  <g data-key="a-gp" data-only="1">
    <path d="M 452 138 C 470 138, 470 150, 490 150" class="edge" marker-end="url(#es-arw)"/>
  </g>
  <g data-key="a-nf" data-only="1">
    <path d="M 452 216 C 472 216, 472 300, 490 300" class="edger" marker-end="url(#es-arwr)"/>
  </g>
  <g data-key="a-fit" data-only="1">
    <path d="M 452 292 C 470 292, 470 280, 490 280" class="edgeg" marker-end="url(#es-arwg)"/>
  </g>
  <g data-key="n1" data-only="1">
    <text x="30" y="540" class="cap">__init__ only stores its arguments on self</text>
  </g>
  <g data-key="n2" data-only="1">
    <text x="30" y="540" class="cap">get_params reads the argument names of __init__</text>
  </g>
  <g data-key="n3" data-only="1">
    <text x="30" y="540" class="cap">check_is_fitted found no names ending in _ in vars(model)</text>
  </g>
  <g data-key="n4" data-only="1">
    <text x="30" y="540" class="cap">fit stored the attributes and returned self: that is what got printed</text>
  </g>
  <g data-key="n5" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>the same <span data-tex="\mathbf w = [2,\ 1]"></span> and <span data-tex="b = 0.45"></span> as train from part 5</span></div></foreignObject>
  </g>
  <g data-key="n6" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>inside predict: <span data-tex="[1,\ 1]\cdot[2,\ 1] + 0.45 = 3.45"></span></span></div></foreignObject>
  </g>
  <g data-key="n7" data-only="1">
    <foreignObject x="30" y="522.5" width="440" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>score is <span data-tex="R^2 = 1 - 0.09/18.09 \approx 0.995"></span></span></div></foreignObject>
  </g>
  <g data-key="n8" data-only="1">
    <text x="30" y="540" class="cap">parents: RegressorMixin → … → LinearModel → BaseEstimator</text>
  </g>
  <text x="30" y="588" class="legend">yellow — settings · green — learned from data · blue — methods · red — error</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="c1 hyp empty meth n1" data-focus="c1 hyp n1">
      <div class="step-kicker">Step 1 · creation</div>
      <h4>The constructor stores the settings</h4>
      <p><code>LinearRegression()</code> creates an object and calls its <code>__init__</code>. All that method does is
      store its arguments in attributes with the same names: <code>self.fit_intercept = fit_intercept</code> and so on.
      I passed no arguments, so the defaults were used. The object has not seen any data yet.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 hyp empty meth hl-gp a-gp n2" data-focus="c2 hl-gp a-gp n2">
      <div class="step-kicker">Step 2 · get_params</div>
      <h4>The settings can be read with one method</h4>
      <p>The <code>LinearRegression</code> class has no <code>get_params</code> method of its own: it is inherited from the
      common parent of all sklearn models, <code>BaseEstimator</code>. The method looks at which arguments are listed in the
      signature of <code>__init__</code> and returns a dictionary with the current values of the attributes with those names.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 hyp empty meth a-nf n3" data-focus="c3 a-nf empty n3">
      <div class="step-kicker">Step 3 · before training</div>
      <h4>predict before fit: a clear error</h4>
      <p>There is nothing to predict with yet: there are no weights. Instead of a cryptic <code>AttributeError</code>, sklearn raises
      <code>NotFittedError</code> with a hint to call <code>fit</code>. The check is simple: the function
      <code>check_is_fitted</code> looks for attribute names on the object that end in <code>_</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 hyp meth learned hl-fit a-fit n4" data-focus="c4 learned a-fit n4">
      <div class="step-kicker">Step 4 · fit</div>
      <h4>fit writes what it learned into the object</h4>
      <p><code>model.fit(X, y)</code> checks the shapes of <code>X</code> and <code>y</code>, solves the least squares problem
      and writes the result into the object's attributes. The method itself returns <code>self</code>, the same object, which is why the console
      printed <code>LinearRegression()</code>, and you can chain calls: <code>LinearRegression().fit(X, y).predict(...)</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 hyp meth learned n5" data-focus="c5 learned n5">
      <div class="step-kicker">Step 5 · attributes</div>
      <h4>What is learned: attributes ending in an underscore</h4>
      <p><code>coef_</code> are the weights, <code>intercept_</code> is the bias; these are my <code>w</code> and <code>b</code> from part 5,
      with the same numbers. Next to them are service attributes: <code>n_features_in_</code> is how many features there were during training,
      <code>rank_</code> and <code>singular_</code> are by-products of the solver. The trailing underscore is an sklearn
      convention: it marks everything obtained from data rather than set by you.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 hyp meth learned hl-pred n6" data-focus="c6 hl-pred n6">
      <div class="step-kicker">Step 6 · predict</div>
      <h4>predict is the same formula as mine</h4>
      <p>Inside <code>predict</code> there is the line <code>return X @ coef_ + self.intercept_</code>, which is my function
      <code>predict</code> from part 5, except that the weights come from the object's attributes instead of arguments. You no longer
      need to pass them: the object carries them along.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 c7 hyp meth learned hl-score n7" data-focus="c7 hl-score n7">
      <div class="step-kicker">Step 7 · score</div>
      <h4>score comes from a parent</h4>
      <p><code>score</code> computes the coefficient of determination <span class="math-inline" data-tex="R^2"></span>: one minus
      the ratio of the sum of squared errors (0.09) to the spread of the answers around their mean (18.09). The method is written once in
      <code>RegressorMixin</code> and works for any regressor: it calls that regressor's <code>predict</code> and compares with <code>y</code>.</p>
    </div>
    <div class="step-panel" data-on="c1 c2 c3 c4 c5 c6 c7 hyp meth learned n8" data-focus="meth n8">
      <div class="step-kicker">Step 8 · summary</div>
      <h4>A model object: settings, learned values, methods</h4>
      <p>The object holds three kinds of content. Settings are given in the constructor and do not change after <code>fit</code>.
      Learned attributes appear in <code>fit</code> and are read in <code>predict</code>. Methods are collected from a chain of
      parent classes: <code>fit</code> is its own, <code>predict</code> comes from linear models, <code>score</code> from
      all regressors, <code>get_params</code> from all sklearn models.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>My version from part 5 and the sklearn object answer the same questions:</p>

<table class="shape-table">
  <tr><th></th><th>NumPy, part 5</th><th>scikit-learn</th></tr>
  <tr><td>Settings</td><td>arguments <code>lr</code>, <code>steps</code> of the <code>train</code> function</td><td>constructor arguments: <code>LinearRegression(fit_intercept=True)</code></td></tr>
  <tr><td>Training</td><td><code>w, b = train(X, y)</code></td><td><code>model.fit(X, y)</code></td></tr>
  <tr><td>Where the parameters live</td><td>variables <code>w</code>, <code>b</code></td><td>attributes <code>model.coef_</code>, <code>model.intercept_</code></td></tr>
  <tr><td>Prediction</td><td><code>predict(X, w, b)</code></td><td><code>model.predict(X)</code></td></tr>
  <tr><td>Evaluation</td><td><code>mse(predict(X, w, b), y)</code></td><td><code>model.score(X, y)</code> is <span class="math-inline" data-tex="R^2"></span>, not MSE</td></tr>
  <tr><td>Call before training</td><td><code>TypeError</code> somewhere inside <code>@</code></td><td><code>NotFittedError</code> with a hint</td></tr>
</table>

<div class="callout-blue">
  <strong>Why some names end in an underscore and others do not:</strong> this is a convention of all
  sklearn models. Constructor arguments are stored under their own names unchanged: <code>fit_intercept</code>,
  <code>tol</code>. Everything computed from data in <code>fit</code> gets a trailing <code>_</code>:
  <code>coef_</code>, <code>intercept_</code>, <code>n_features_in_</code>. The "is the model fitted?" check relies on this
  convention: <code>check_is_fitted</code> simply looks for such names in <code>vars(model)</code>.
</div>

<h3>Inside the original: the source code of LinearRegression</h3>

<p>
  Unlike <code>matmul</code> in NumPy, the code of <code>LinearRegression</code> is written in Python, and you do not need to
  look for it on GitHub: it lives in <code>site-packages\sklearn\linear_model\_base.py</code>, and you can open it in an
  editor or print it right from the interpreter with
  <code>import inspect; print(inspect.getsource(LinearRegression.fit))</code>. The links below point to the
  <code>1.9.1</code> tag so that the line numbers do not drift.
</p>

<table class="shape-table">
  <tr><th>File in scikit-learn</th><th>What is in it</th></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L638-L652" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearRegression.__init__</code>: five assignments <code>self.name = name</code> and nothing else</td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L654-L760" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearRegression.fit</code>: data checks, centering, <code>linalg.lstsq</code>, bias, <code>return self</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/linear_model/_base.py#L291-L299" target="_blank" rel="noopener"><code>linear_model/_base.py</code></a></td><td><code>LinearModel._decision_function</code> — what <code>predict</code> runs</td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/base.py#L219-L270" target="_blank" rel="noopener"><code>base.py</code></a></td><td><code>BaseEstimator.get_params</code>: the names come from the signature of <code>__init__</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/base.py#L672-L716" target="_blank" rel="noopener"><code>base.py</code></a></td><td><code>RegressorMixin.score</code>: <code>predict</code> plus <code>r2_score</code></td></tr>
  <tr><td><a class="src" href="https://github.com/scikit-learn/scikit-learn/blob/1.9.1/sklearn/utils/validation.py#L1599-L1634" target="_blank" rel="noopener"><code>utils/validation.py</code></a></td><td><code>_is_fitted</code>: searching for attributes ending in <code>_</code></td></tr>
</table>

<p>The whole <code>predict</code> of a linear model is nine lines, and you can read them without any preparation:</p>

<pre><code># sklearn/linear_model/_base.py, class LinearModel
def _decision_function(self, X):
    check_is_fitted(self)

    X = validate_data(self, X, accept_sparse=["csr", "csc", "coo"], reset=False)
    coef_ = self.coef_
    if coef_.ndim == 1:
        return X @ coef_ + self.intercept_
    else:
        return X @ coef_.T + self.intercept_</code></pre>

<p>
  The line <code>return X @ coef_ + self.intercept_</code> is my <code>predict</code> function from part 5. The
  <code>else</code> branch is needed when the model predicts several answers at once and <code>coef_</code> is a matrix.
  Let us follow the whole call path from my code down to machine code.
</p>

<div class="stage" id="stageSkSource" tabindex="0">
  <div class="stage-figure">
<svg id="ss" viewBox="0 0 960 580" role="img" aria-label="The call path of fit, predict and score through the source code of scikit-learn, SciPy and NumPy down to machine code">
  <style>
    #ss { font-family: Helvetica, Arial, sans-serif; }
    #ss .bx { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ss .by { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ss .bm { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; stroke-dasharray: 6 3; }
    #ss .band { stroke: #C8C3B6; stroke-width: 1; stroke-dasharray: 5 4; }
    #ss .band-t { font-size: 13px; font-weight: 700; fill: #5E5850; }
    #ss .ttl { font-size: 14px; font-weight: 700; fill: #111111; }
    #ss .mono { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #ss .file { font-family: "Courier New", Courier, monospace; font-size: 12px; fill: #8c7106; }
    #ss .cap { font-size: 12.5px; fill: #5E5850; }
    #ss .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ss .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <defs>
    <marker id="ss-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/></marker>
    <marker id="ss-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/></marker>
    <marker id="ss-arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#73B222"/></marker>
  </defs>
  <text x="24" y="28" class="band-t">your code</text>
  <line x1="20" y1="106" x2="940" y2="106" class="band"/>
  <text x="24" y="120" class="band-t">scikit-learn — plain Python</text>
  <line x1="20" y1="358" x2="940" y2="358" class="band"/>
  <text x="24" y="372" class="band-t">SciPy and NumPy</text>
  <line x1="20" y1="448" x2="940" y2="448" class="band"/>
  <text x="24" y="462" class="band-t">machine code</text>
  <g data-key="u">
    <rect x="30" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="42" y="74" class="mono">model.fit(X, y)</text>
    <rect x="335" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="347" y="74" class="mono">model.predict(X_new)</text>
    <rect x="640" y="40" width="290" height="56" rx="8" class="bx"/>
    <text x="652" y="64" class="mono">model.score(X, y)</text>
    <text x="652" y="84" class="mono">model.get_params()</text>
  </g>
  <g data-key="f-sk" data-only="1">
    <rect x="30" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="42" y="156" class="ttl">LinearRegression.fit</text>
    <text x="42" y="174" class="file">sklearn/linear_model/_base.py</text>
    <text x="42" y="200" class="mono">validate_data(self, X, y)</text>
    <text x="42" y="218" class="cap">shapes and types, n_features_in_</text>
    <text x="42" y="244" class="mono">_preprocess_data(...)</text>
    <text x="42" y="288" class="mono">linalg.lstsq(X, y)</text>
    <text x="42" y="306" class="cap">weights on centered data</text>
    <text x="42" y="332" class="mono">_set_intercept(...)</text>
    <foreignObject x="42" y="244.5" width="266" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span>subtract the means <span data-tex="\bar{\mathbf x}"></span> and <span data-tex="\bar y"></span></span></div></foreignObject>
    <foreignObject x="42" y="332.5" width="266" height="27"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math svg-math-fit" style="font-size:13px;color:#5E5850;font-weight:400"><span><span data-tex="b = \bar y - \bar{\mathbf x}\cdot\mathbf w"></span></span></div></foreignObject>
    <line x1="270" y1="96" x2="270" y2="128" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="f-low" data-only="1">
    <rect x="30" y="384" width="290" height="56" rx="8" class="by"/>
    <text x="42" y="406" class="mono">scipy.linalg.lstsq</text>
    <text x="42" y="426" class="cap">least squares</text>
    <rect x="30" y="474" width="290" height="56" rx="8" class="bm"/>
    <text x="42" y="496" class="mono">LAPACK · gelsd</text>
    <text x="42" y="516" class="cap">from the SciPy wheel</text>
    <line x1="175" y1="360" x2="175" y2="380" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="175" y1="440" x2="175" y2="470" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="p-sk" data-only="1">
    <rect x="335" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="347" y="156" class="ttl">LinearModel._decision_function</text>
    <text x="347" y="174" class="file">sklearn/linear_model/_base.py</text>
    <text x="347" y="204" class="mono">check_is_fitted(self)</text>
    <text x="347" y="222" class="cap">are there attributes ending in _</text>
    <text x="347" y="250" class="mono">validate_data(self, X,</text>
    <text x="347" y="268" class="mono">              reset=False)</text>
    <text x="347" y="286" class="cap">as many features as in fit</text>
    <text x="347" y="322" class="mono">return X @ coef_ + self.intercept_</text>
    <line x1="480" y1="96" x2="480" y2="128" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="p-low" data-only="1">
    <rect x="335" y="384" width="290" height="56" rx="8" class="by"/>
    <text x="347" y="406" class="mono">ndarray.__matmul__ → np.matmul</text>
    <text x="347" y="426" class="cap">part 4</text>
    <rect x="335" y="474" width="290" height="56" rx="8" class="bm"/>
    <text x="347" y="496" class="mono">NumPy C loop or BLAS</text>
    <text x="347" y="516" class="cap">float64 → dgemm/dgemv</text>
    <line x1="480" y1="360" x2="480" y2="380" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="480" y1="440" x2="480" y2="470" class="edge" marker-end="url(#ss-arw)"/>
  </g>
  <g data-key="b-sk" data-only="1">
    <rect x="640" y="132" width="290" height="228" rx="8" class="by"/>
    <text x="652" y="156" class="ttl">shared parents</text>
    <text x="652" y="174" class="file">sklearn/base.py</text>
    <text x="652" y="204" class="mono">BaseEstimator.get_params</text>
    <text x="652" y="222" class="cap">inspect.signature(__init__)</text>
    <text x="652" y="258" class="mono">RegressorMixin.score</text>
    <text x="652" y="276" class="mono">y_pred = self.predict(X)</text>
    <text x="652" y="294" class="mono">r2_score(y, y_pred)</text>
    <line x1="785" y1="96" x2="785" y2="128" class="edge" marker-end="url(#ss-arw)"/>
    <line x1="640" y1="276" x2="629" y2="276" class="edge" marker-end="url(#ss-arw)"/>
    <text x="652" y="316" class="cap">score calls predict</text>
    <text x="652" y="334" class="cap">of the same model, on the left</text>
  </g>
  <text x="30" y="566" class="legend">blue — your code · yellow — library code · dashed — compiled code</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="u" data-focus="u">
      <div class="step-kicker">Step 1 · calls</div>
      <h4>Three calls on one object</h4>
      <p>At the top is what I write: <code>fit</code>, <code>predict</code> and <code>score</code>. Each dot is a method lookup
      in the object's class and its parents, as in part 4. Next we see where each call leads.</p>
    </div>
    <div class="step-panel" data-on="u f-sk" data-focus="f-sk">
      <div class="step-kicker">Step 2 · fit in sklearn</div>
      <h4>fit: check, center, solve</h4>
      <p><code>validate_data</code> checks that <code>X</code> is two-dimensional and that <code>X</code> and <code>y</code> have the same number of rows,
      and records <code>n_features_in_</code>. Then the mean is subtracted from each column:
      <span class="math-inline" data-tex="\bar{\mathbf x} = [1.5,\ 1]"></span>, <span class="math-inline" data-tex="\bar y = 4.45"></span>.
      On the centered data <code>lstsq</code> finds the weights <code>[2, 1]</code>, and the bias is computed separately:
      <span class="math-inline" data-tex="b = \bar y - \bar{\mathbf x}\cdot\mathbf w = 4.45 - (1.5\cdot 2 + 1\cdot 1) = 0.45"></span>.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low" data-focus="f-low">
      <div class="step-kicker">Step 3 · fit further down</div>
      <h4>The solving happens in someone else's library: SciPy</h4>
      <p>sklearn does not solve the system itself: <code>linalg.lstsq</code> is a SciPy function that pip installed as a dependency.
      SciPy in turn calls the <code>gelsd</code> routine from LAPACK, a compiled linear algebra library
      related to BLAS from part 3. The answer is exact, in one call, with no 500 steps of gradient descent.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk" data-focus="p-sk">
      <div class="step-kicker">Step 4 · predict in sklearn</div>
      <h4>predict: two checks and one line</h4>
      <p><code>check_is_fitted</code> raises <code>NotFittedError</code> if <code>fit</code> has not been called yet.
      <code>validate_data(..., reset=False)</code> compares the number of features with the stored <code>n_features_in_</code>:
      pass <code>X</code> with three columns and you get a clear <code>ValueError</code>. The prediction itself is one line,
      <code>X @ coef_ + self.intercept_</code>.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk p-low" data-focus="p-low">
      <div class="step-kicker">Step 5 · predict further down</div>
      <h4>The @ operator leads into NumPy</h4>
      <p>From here the path is familiar from part 4: <code>@</code> is <code>ndarray.__matmul__</code>, which calls the
      <code>np.matmul</code> ufunc, and for <code>float64</code> arrays that ufunc hands the work to BLAS. The layers stack:
      sklearn calls NumPy, NumPy calls BLAS.</p>
    </div>
    <div class="step-panel" data-on="u f-sk f-low p-sk p-low b-sk" data-focus="b-sk">
      <div class="step-kicker">Step 6 · parents</div>
      <h4>Shared methods live in base.py</h4>
      <p><code>get_params</code> and <code>score</code> are written once in <code>sklearn/base.py</code> for all models.
      <code>score</code> does not train anything itself: it calls <code>self.predict(X)</code>, the one on the left,
      and compares the answers with <code>r2_score</code>. That is why <code>score</code> works for any class that
      inherits <code>RegressorMixin</code> and writes its own <code>predict</code>.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<div class="callout">
  <strong>Key idea of this part:</strong> an sklearn model is an object that holds the settings from the constructor and
  the attributes learned in <code>fit</code> that end in <code>_</code>, while its methods are collected from a chain of parent
  classes. Inside <code>predict</code> there is the same <code>X @ coef_ + intercept_</code>, and <code>fit</code>
  hands the solving to SciPy and LAPACK.
</div>

<hr>

<h2 id="part-7">Part 7. Library and framework: who calls whom</h2>

<p>
  Let us compare three implementations of one model line by line: what you write in each and what the library does.
</p>

<div class="stage" id="stageLevels" tabindex="0">
  <div class="stage-figure">
<svg id="lv" viewBox="0 0 960 600" role="img" aria-label="Table: which stages of working with linear regression you write yourself and which the library takes over, in plain Python, NumPy and scikit-learn">
  <style>
    #lv { font-family: Helvetica, Arial, sans-serif; }
    #lv .cb { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.5; }
    #lv .cg { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #lv .ttl { font-size: 17px; fill: #111111; font-weight: 700; }
    #lv .rlbl { font-size: 14px; fill: #111111; font-weight: 700; }
    #lv .code { font-family: "Courier New", Courier, monospace; font-size: 13px; fill: #111111; }
    #lv .cap { font-size: 12.5px; fill: #5E5850; }
    #lv .iocr { fill: none; stroke: #73B222; stroke-width: 3; stroke-dasharray: 7 4; }
    #lv .ioct { font-size: 13px; fill: #5a8c1c; font-weight: 700; }
    #lv .legend { font-size: 13px; fill: #5E5850; }
  </style>
  <g data-key="hdr">
    <text x="322" y="80" class="ttl" text-anchor="middle">plain Python</text>
    <text x="572" y="80" class="ttl" text-anchor="middle">NumPy</text>
    <text x="822" y="80" class="ttl" text-anchor="middle">scikit-learn</text>
    <text x="24" y="136" class="rlbl">multiplication</text>
    <text x="24" y="206" class="rlbl">prediction</text>
    <text x="24" y="276" class="rlbl">error</text>
    <text x="24" y="346" class="rlbl">training</text>
    <text x="24" y="416" class="rlbl">parameters</text>
    <text x="24" y="486" class="rlbl">validation</text>
  </g>
  <g data-key="cpy">
    <rect x="205" y="100" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="126" class="code" text-anchor="middle">for i, j, k: s += …</text>
    <text x="322" y="147" class="cap" text-anchor="middle">you — part 1</text>
    <rect x="205" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="196" class="code" text-anchor="middle">loops over samples</text>
    <text x="322" y="217" class="cap" text-anchor="middle">you</text>
    <rect x="205" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="266" class="code" text-anchor="middle">sum((yh - y)**2) / n</text>
    <text x="322" y="287" class="cap" text-anchor="middle">you</text>
    <rect x="205" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="336" class="code" text-anchor="middle">derivatives in loops</text>
    <text x="322" y="357" class="cap" text-anchor="middle">you</text>
    <rect x="205" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="406" class="code" text-anchor="middle">variables w, b</text>
    <text x="322" y="427" class="cap" text-anchor="middle">you</text>
    <rect x="205" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="322" y="476" class="code" text-anchor="middle">loop over data splits</text>
    <text x="322" y="497" class="cap" text-anchor="middle">you</text>
  </g>
  <g data-key="np1">
    <rect x="455" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="572" y="126" class="code" text-anchor="middle">X @ w</text>
    <text x="572" y="147" class="cap" text-anchor="middle">library: C and BLAS</text>
  </g>
  <g data-key="cnp">
    <rect x="455" y="170" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="196" class="code" text-anchor="middle">predict(X, w, b)</text>
    <text x="572" y="217" class="cap" text-anchor="middle">you</text>
    <rect x="455" y="240" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="266" class="code" text-anchor="middle">mse(y_hat, y)</text>
    <text x="572" y="287" class="cap" text-anchor="middle">you</text>
    <rect x="455" y="310" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="336" class="code" text-anchor="middle">dw = 2/n*(X.T @ err)</text>
    <text x="572" y="357" class="cap" text-anchor="middle">every formula — you</text>
    <rect x="455" y="380" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="406" class="code" text-anchor="middle">w, b = train(X, y)</text>
    <text x="572" y="427" class="cap" text-anchor="middle">you store and pass them</text>
    <rect x="455" y="450" width="235" height="60" rx="8" class="cb"/>
    <text x="572" y="476" class="code" text-anchor="middle">loop over data splits</text>
    <text x="572" y="497" class="cap" text-anchor="middle">you</text>
  </g>
  <g data-key="s14">
    <rect x="705" y="100" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="126" class="code" text-anchor="middle">X @ coef_</text>
    <text x="822" y="147" class="cap" text-anchor="middle">inside predict</text>
    <rect x="705" y="170" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="196" class="code" text-anchor="middle">model.predict(X)</text>
    <text x="822" y="217" class="cap" text-anchor="middle">object method</text>
    <rect x="705" y="240" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="266" class="code" text-anchor="middle">model.score(X, y)</text>
    <text x="822" y="287" class="cap" text-anchor="middle">method from RegressorMixin</text>
    <rect x="705" y="310" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="336" class="code" text-anchor="middle">model.fit(X, y)</text>
    <text x="822" y="357" class="cap" text-anchor="middle">exact lstsq solution</text>
  </g>
  <g data-key="s5">
    <rect x="705" y="380" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="406" class="code" text-anchor="middle">coef_, intercept_</text>
    <text x="822" y="427" class="cap" text-anchor="middle">the object stores them</text>
  </g>
  <g data-key="s6">
    <rect x="705" y="450" width="235" height="60" rx="8" class="cg"/>
    <text x="822" y="476" class="code" text-anchor="middle">cross_val_score(model, X, y)</text>
    <text x="822" y="497" class="cap" text-anchor="middle">calls fit and predict</text>
  </g>
  <g data-key="ioc" data-only="1">
    <rect x="700" y="445" width="245" height="70" rx="10" class="iocr"/>
    <text x="205" y="545" class="ioct">cross_val_score calls fit and predict of your model itself: here sklearn acts as a framework</text>
  </g>
  <text x="24" y="588" class="legend">blue — you write this code · green — the library does it · rows — stages from parts 5 and 6</text>
</svg>
  </div>
  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>
  <div class="stage-notes">
    <div class="step-panel" data-on="hdr" data-focus="hdr">
      <div class="step-kicker">Step 1 · setup</div>
      <h4>One model, six stages, three implementations</h4>
      <p>The rows are the stages of working with linear regression from parts 5 and 6, the columns are three levels of tools.
      For each cell we ask one question: who writes this code, you or the library?</p>
    </div>
    <div class="step-panel" data-on="hdr cpy" data-focus="cpy">
      <div class="step-kicker">Step 2 · plain Python</div>
      <h4>Without libraries everything is blue</h4>
      <p>Multiplication is the three loops from part 1, prediction and error are loops over samples, the gradient is more loops,
      and validation on different parts of the data also has to be written by hand. It works, but every line is your responsibility.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp" data-focus="np1 cnp">
      <div class="step-kicker">Step 3 · NumPy</div>
      <h4>NumPy takes over only the computations</h4>
      <p>One cell turned green: <code>@</code> and the other array operations. Prediction, error,
      gradient and keeping <code>w</code> and <code>b</code> are still your code, just written more briefly.
      NumPy is a classic library: you call it when you need it.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14" data-focus="s14">
      <div class="step-kicker">Step 4 · scikit-learn</div>
      <h4>Model and training are ready-made methods</h4>
      <p>In sklearn the formulas for prediction, error and training are already written: <code>predict</code>, <code>score</code>,
      <code>fit</code>. You do not derive the gradient or choose a step size: <code>fit</code> solves the problem exactly with
      <code>lstsq</code>. The multiplication inside is the same <code>@</code> from NumPy.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5" data-focus="s5">
      <div class="step-kicker">Step 5 · object</div>
      <h4>The object keeps the parameters</h4>
      <p>In the NumPy version <code>w</code> and <code>b</code> are two variables you must not lose and must pass to
      <code>predict</code>. In sklearn they are stored in the attributes <code>coef_</code> and <code>intercept_</code> of the same
      object whose <code>predict</code> you call.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5 s6" data-focus="s6">
      <div class="step-kicker">Step 6 · validation</div>
      <h4>Validation on data splits in one function</h4>
      <p>To evaluate a model honestly, you train it on one part of the data and test it on another, several times over.
      <code>cross_val_score(model, X, y, cv=5)</code> does this itself: it splits the data, trains copies of the model and collects
      the <code>score</code> values.</p>
    </div>
    <div class="step-panel" data-on="hdr cpy np1 cnp s14 s5 s6 ioc" data-focus="s6 ioc">
      <div class="step-kicker">Step 7 · who calls whom</div>
      <h4>Here control is inverted</h4>
      <p>In all the cells above you call the library. In the last one it is the other way round: you hand over the model, and
      <code>cross_val_score</code> decides when to call its <code>fit</code> and <code>predict</code>.
      Any object with these methods will do, including one you wrote yourself.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<p>
  Now we can give a definition that does not depend on the size of a package or on what it calls itself.
  <strong>You call a library</strong>: your code controls the order of actions, and the library carries out
  individual tasks: multiply, sort, read a file. <strong>A framework calls you</strong>: it sets the order of
  actions, and you fill in the slots left for you. This reversal is called <em>inversion of control</em>.
</p>

<p>
  In sklearn both roles show up in one example. As long as you write <code>model.fit(X, y)</code>, sklearn is a
  library. But <code>cross_val_score</code>, <code>GridSearchCV</code> and <code>Pipeline</code> take a model and decide
  themselves when to call its <code>fit</code> and <code>predict</code>. Any object with these methods suits them,
  including my gradient descent from part 5 once it is wrapped in a class:
</p>

<pre><code>from sklearn.base import BaseEstimator, RegressorMixin
from sklearn.model_selection import cross_val_score

class GDRegressor(RegressorMixin, BaseEstimator):
    def __init__(self, lr=0.1, steps=500):
        self.lr = lr                    # only store the settings
        self.steps = steps

    def fit(self, X, y):
        print("fit on", len(X), "samples")
        self.coef_, self.intercept_ = train(X, y, self.lr, self.steps)   # function from part 5
        return self

    def predict(self, X):
        return X @ self.coef_ + self.intercept_

model = GDRegressor().fit(X, y)          # fit on 4 samples
print(model.coef_.round(4))              # [2. 1.]
print(model.get_params())                # {'lr': 0.1, 'steps': 500}
print(round(model.score(X, y), 4))       # 0.995

scores = cross_val_score(GDRegressor(), X, y, cv=2)
# fit on 2 samples
# fit on 2 samples</code></pre>

<p>
  I wrote only <code>__init__</code>, <code>fit</code> and <code>predict</code>. <code>get_params</code> came
  from <code>BaseEstimator</code>, <code>score</code> from <code>RegressorMixin</code>, and it works through my
  <code>predict</code>. The line "fit on 2 samples" was printed twice, although I never called <code>fit</code> that way myself:
  <code>cross_val_score</code> split the four samples into two parts (<code>cv=2</code>), created a fresh copy of the model
  for each, trained it on one part and evaluated it on the other. It builds the copy from <code>get_params</code>,
  so <code>__init__</code> must only store its arguments under the same names: any other logic in the constructor
  will not make it into the copy.
</p>

<div class="callout-yellow">
  <strong>Where my class falls short of LinearRegression:</strong> my <code>predict</code> does not call
  <code>check_is_fitted</code>, so before <code>fit</code> it fails with <code>AttributeError: 'GDRegressor' object
  has no attribute 'coef_'</code> instead of a clear <code>NotFittedError</code>. Ready-made sklearn models add
  such checks to every method.
</div>

<p>
  Deep learning has the same split. In PyTorch a model is described by a subclass of
  <code>nn.Module</code> with a <code>forward</code> method, but it is called as <code>model(x)</code>: the method
  <code>nn.Module.__call__</code> from the framework's code does some housekeeping and then calls your
  <code>forward</code> itself. The PyTorch Lightning add-on takes over the training loop as well: you write
  <code>training_step</code> for a single step, and <code>trainer.fit</code> decides when to call it. How such a
  network learns inside is covered in the articles
  <a href="article.html?slug=mlp-full-cycle">"A fully connected network from scratch"</a> and
  <a href="article.html?slug=how-network-learns">"How a neural network learns"</a> (both in Russian).
</p>

<table class="shape-table">
  <tr><th></th><th>Library</th><th>Framework</th></tr>
  <tr><td>Who controls the order</td><td>your code</td><td>the framework</td></tr>
  <tr><td>How you work with it</td><td>you call functions and methods</td><td>you inherit classes, override methods, hand over your objects</td></tr>
  <tr><td>What you hand over</td><td>individual computations</td><td>a whole workflow</td></tr>
  <tr><td>Examples from the article</td><td><code>numpy</code>, <code>model.fit(X, y)</code></td><td><code>cross_val_score</code>, <code>GridSearchCV</code>, <code>Pipeline</code>; in PyTorch, <code>nn.Module.__call__</code> and Lightning's <code>Trainer</code></td></tr>
  <tr><td>Outside ML</td><td><code>requests</code>, <code>json</code></td><td>Django, FastAPI: you write a handler, and the server decides when to call it</td></tr>
</table>

<div class="callout-blue">
  <strong>The line is blurry, and that is fine:</strong> scikit-learn is usually called a library, although
  <code>cross_val_score</code> and <code>Pipeline</code> work like a small framework; PyTorch is called a
  framework, although half of it is a tensor library you can use like NumPy. Instead of arguing about the
  name, it is more useful to ask the question from the scene above: what part of my program does this tool take over, and who
  decides there what to call next?
</div>

<div class="callout">
  <strong>Key idea of this part:</strong> the hierarchy of tools is a list of what you stop writing
  yourself: NumPy takes over the multiplication loops, the sklearn object takes training, storing parameters and evaluation, and
  <code>cross_val_score</code> takes the order of calls as well: from then on it calls the <code>fit</code> and
  <code>predict</code> of your model itself.
</div>

<hr>

<h2 id="part-8">Part 8. What to be able to rebuild from memory</h2>

<ol class="end-list">
  <li><strong>Matrix multiplication is three loops.</strong> <code>C[i][j]</code> is the dot product
  of row <code>i</code> and column <code>j</code>; shapes <span class="math-inline" data-tex="(n\times m)\cdot(m\times p) \to n\times p"></span>.</li>
  <li><strong>A module is a file, a library is someone else's package.</strong> For the interpreter
  <code>mylinalg</code> and <code>numpy</code> are built the same way.</li>
  <li><strong>import = find, execute, bind.</strong> The search goes through <code>sys.path</code>,
  the first match wins, the result is cached in <code>sys.modules</code>.</li>
  <li><strong>pip install = download a wheel and unpack it.</strong> A wheel is a zip from PyPI built for your
  Python version and OS; its contents land in the <code>site-packages</code> of the active environment.</li>
  <li><strong><code>__file__</code> answers the question "where did this come from".</strong> The first step
  when something behaves strangely is to check that the right copy was imported; do not name your files
  after libraries.</li>
  <li><strong>Inside libraries: Python on top, machine code underneath.</strong> <code>.pyd</code>/<code>.so</code>
  is compiled C/C++, and under NumPy there is BLAS as well.</li>
  <li><strong>An attribute has no parentheses, a method has them.</strong> <code>A.sum(axis=0)</code> is
  <code>np.ndarray.sum(A, axis=0)</code>, and <code>A @ B</code> is <code>A.__matmul__(B)</code>.</li>
  <li><strong>Someone else's code is open and can be extended from outside.</strong> Behind <code>ndarray</code> there is
  a C struct, behind <code>@</code> the <code>np.matmul</code> ufunc with its contract; you step in with arguments,
  a subclass or <code>__array_ufunc__</code>, and rebuilding is the last resort.</li>
  <li><strong>Training is prediction, error, gradient, step, repeat.</strong> For linear regression that is
  <code>X @ w + b</code>, <code>y_hat - y</code>, <code>2 / n * (X.T @ err)</code> and <code>w -= lr * dw</code>; in NumPy
  you write every line, in sklearn all of it is <code>model.fit(X, y)</code>.</li>
  <li><strong>An sklearn model is an object with three parts.</strong> Settings from <code>__init__</code>
  (<code>fit_intercept</code>), attributes learned in <code>fit</code> that end in <code>_</code> (<code>coef_</code>,
  <code>intercept_</code>) and methods, some of them inherited: <code>score</code> from <code>RegressorMixin</code>,
  <code>get_params</code> from <code>BaseEstimator</code>.</li>
  <li><strong>You call a library, a framework calls you.</strong> The sign of a framework:
  you write <code>fit</code> or <code>forward</code>, and <code>cross_val_score</code> or <code>Trainer</code> calls them.</li>
</ol>

<p>
  If you take away one picture, let it be this: at the bottom there are always the same three nested loops from
  part 1. Each next level takes over one more piece of the program that used to be written by hand: NumPy takes the
  loops themselves, the sklearn object takes training, storing parameters and evaluation, <code>cross_val_score</code>
  takes the order of calls. Whatever you hand over you no longer write, but the order of those actions is then set
  by the library's code.
</p>

<p class="tiny">
  All numbers in the article were computed with a Python script: multiplication with loops and with <code>@</code> gives the same
  <code>[[2, 3], [8, 0]]</code>; gradient descent in NumPy over 500 steps and <code>LinearRegression</code> from
  scikit-learn 1.9.1 give the same <code>w = [2, 1]</code>, <code>b = 0.45</code> (to four decimal places), and
  <code>score</code> is 0.995. Paths like <code>C:\Users\work\…</code>, package versions and file names with hashes
  will differ slightly on your machine. Links to the NumPy sources point to the <code>v2.5.3</code> tag, links to the
  scikit-learn sources to the <code>1.9.1</code> tag; the behavior of <code>out=</code>, the subclass and <code>__array_ufunc__</code>
  was checked on NumPy 2.5.3.
</p>
