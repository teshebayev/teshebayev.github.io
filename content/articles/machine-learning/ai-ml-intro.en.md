We often say “artificial intelligence,” but this term mixes several ideas at once: human intelligence, hand-written rules, machine learning, deep neural networks, computer vision, and large language models. In this article we go through them one at a time: from simple intuition to how a model learns from data and why LLMs can write text.

## Human intelligence

When we recognize friends by their voice, read between the lines, drive a car, or solve a new problem for the first time, we use intelligence. In simple terms, intelligence is the ability to learn from experience, notice patterns, and make decisions in situations where no instruction has been written in advance.

The key point is that we are not taught everything through explicit rules. Nobody gives a child an instruction on “how to recognize a cat.” The child sees a few cats, notices the features that repeat, and gradually learns to tell a cat from a dog, a toy, or a random blot in a picture.

## Why is this intelligence called artificial?

This kind of intelligence is created by people, not by nature. It is an attempt to reproduce intelligent behavior in a machine: seeing, hearing, speaking, reasoning, choosing an action, and adapting to new information.

The word “artificial” does not mean “fake.” It means “made by people,” as in “artificial satellite” or “artificial material.” The system's behavior may look intelligent, but it comes from a different source: not biological evolution, but mathematics, data, engineering, and computing power.

<style>
  .ai-live { margin: 26px 0 30px; }
  .ai-live-controls {
    display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px 24px;
    margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-soft);
  }
  .ai-live-btns { display: flex; flex-wrap: wrap; gap: 8px; }
  .ai-live-btns button {
    font-family: inherit; font-size: 14px; font-weight: 700; color: var(--text);
    background: var(--bg-elev); border: 1px solid var(--accent); border-radius: 9px;
    padding: 7px 14px; cursor: pointer;
  }
  .ai-live-btns button:hover,
  .ai-live-btns button[aria-pressed="true"] { background: var(--accent); color: var(--bg-elev); }
  .ai-live-btns button[disabled] { opacity: 0.35; cursor: default; }
  .ai-slider { flex: 1 1 170px; min-width: 160px; }
  .ai-slider label { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
  .ai-slider output { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--text); }
  .ai-slider input[type=range] { width: 100%; accent-color: #3576C0; }
  .ai-live .stage-notes { min-height: 0; }
</style>

<div class="stage" id="stageAiArtificial" tabindex="0">
  <div class="stage-figure">
<svg id="aiArtificial" viewBox="0 0 900 400" role="img" aria-label="Artificial means made by people: six skills of a machine, the Moon and an artificial satellite orbiting the Earth, two sources of skills">
  <style>
    .aa-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .aa-title { font: 800 20px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-big { font: 800 34px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-bold { font: 800 16px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .aa-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .aa-c { text-anchor: middle; dominant-baseline: middle; }
    .aa-grey { fill: #F7F5EF; stroke: #8E8A82; stroke-width: 1.4; }
    .aa-blue { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .aa-yellow { fill: #ffffff; stroke: #C29E08; stroke-width: 1.6; }
    .aa-link { stroke: #3576C0; stroke-width: 1.4; stroke-opacity: 0.45; fill: none; }
    .aa-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#aaArrow); }
    .aa-arrow-grey { stroke: #8E8A82; stroke-width: 2.2; fill: none; marker-end: url(#aaArrowGrey); }
    .aa-orbit { fill: none; stroke: #8E8A82; stroke-width: 1.2; stroke-dasharray: 5 5; }
    .aa-hl { fill: none; stroke: #C30B0A; stroke-width: 2.3; stroke-dasharray: 8 5; }
    .aa-strike { stroke: #C30B0A; stroke-width: 2.4; }
  </style>
  <defs>
    <marker id="aaArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="aaArrowGrey" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#8E8A82" />
    </marker>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="aa-panel" />

  <g data-key="who" data-only="1">
    <text x="450" y="62" class="aa-title aa-c">Who created intelligence?</text>
    <rect x="110" y="110" width="250" height="78" rx="12" class="aa-grey" />
    <text x="235" y="140" class="aa-bold aa-c">Nature</text>
    <text x="235" y="165" class="aa-small aa-c">evolution over millions of years</text>
    <path d="M235 196 L235 238" class="aa-arrow-grey" />
    <rect x="110" y="248" width="250" height="70" rx="12" class="aa-grey" />
    <text x="235" y="283" class="aa-bold aa-c">Human intelligence</text>
    <rect x="540" y="110" width="250" height="78" rx="12" class="aa-blue" />
    <text x="665" y="140" class="aa-bold aa-c">People</text>
    <text x="665" y="165" class="aa-small aa-c">engineers and programmers</text>
    <path d="M665 196 L665 238" class="aa-arrow" />
    <rect x="540" y="248" width="250" height="70" rx="12" class="aa-yellow" />
    <text x="665" y="283" class="aa-bold aa-c">Artificial intelligence</text>
    <text x="450" y="352" class="aa-text aa-c">People built AI: it is an attempt to reproduce intelligent behavior in a machine.</text>
  </g>

  <g data-key="skills" data-only="1">
    <text x="450" y="62" class="aa-title aa-c">What “intelligent behavior” means</text>
    <path d="M300 130 L380 200 M300 200 L380 200 M300 270 L380 200 M600 130 L520 200 M600 200 L520 200 M600 270 L520 200" class="aa-link" />
    <rect x="380" y="160" width="140" height="80" rx="12" class="aa-yellow" />
    <text x="450" y="200" class="aa-bold aa-c">Machine</text>
    <rect x="130" y="110" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="130" class="aa-text aa-c">see</text>
    <rect x="130" y="180" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="200" class="aa-text aa-c">hear</text>
    <rect x="130" y="250" width="170" height="40" rx="9" class="aa-blue" /><text x="215" y="270" class="aa-text aa-c">speak</text>
    <rect x="600" y="110" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="130" class="aa-text aa-c">reason</text>
    <rect x="600" y="180" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="200" class="aa-text aa-c">choose an action</text>
    <rect x="600" y="250" width="170" height="40" rx="9" class="aa-blue" /><text x="685" y="270" class="aa-text aa-c">adapt</text>
    <text x="450" y="340" class="aa-text aa-c">Each of the six skills can be checked on a task:</text>
    <text x="450" y="362" class="aa-text aa-c">did the machine recognize the object in a photo, understand a phrase, pick the right move?</text>
  </g>

  <g data-key="orbit" data-only="1">
    <circle cx="240" cy="200" r="130" class="aa-orbit" />
    <circle cx="240" cy="200" r="72" class="aa-orbit" />
    <circle cx="240" cy="200" r="34" fill="#3576C0" fill-opacity="0.85" />
    <text x="240" y="201" class="aa-small aa-c" style="fill:#ffffff;opacity:1">Earth</text>
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 240 200" to="360 240 200" dur="16s" repeatCount="indefinite" />
      <circle cx="370" cy="200" r="13" fill="#BDB8AE" stroke="#8E8A82" stroke-width="1.2" />
    </g>
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 240 200" to="360 240 200" dur="5s" repeatCount="indefinite" />
      <rect x="306" y="195" width="12" height="10" fill="#C29E08" />
      <rect x="292" y="198" width="12" height="4" fill="#3576C0" />
      <rect x="320" y="198" width="12" height="4" fill="#3576C0" />
    </g>
    <text x="440" y="62" class="aa-title">“Artificial” = made by people</text>
    <circle cx="452" cy="116" r="9" fill="#BDB8AE" stroke="#8E8A82" stroke-width="1.2" />
    <text x="472" y="121" class="aa-text"><tspan font-weight="800">Moon</tspan>: created by nature</text>
    <rect x="445" y="152" width="14" height="11" fill="#C29E08" />
    <text x="472" y="163" class="aa-text"><tspan font-weight="800">Satellite</tspan>: built by people</text>
    <text x="440" y="214" class="aa-text">Both bodies move along their orbits by the</text>
    <text x="440" y="236" class="aa-text">same laws of gravity. The satellite is real: it</text>
    <text x="440" y="258" class="aa-text">relays signals and takes pictures of the Earth.</text>
    <text x="440" y="314" class="aa-bold">artificial</text>
    <text x="522" y="314" class="aa-text">≠</text>
    <text x="546" y="314" class="aa-bold" textLength="34" lengthAdjust="spacingAndGlyphs">fake</text>
    <line x1="543" y1="309" x2="583" y2="309" class="aa-strike" />
    <text x="440" y="346" class="aa-small">Same with AI: the behavior is real, the origin is different.</text>
  </g>

  <g data-key="cols" data-only="1">
    <text x="450" y="58" class="aa-title aa-c">Where the skills come from</text>
    <rect x="100" y="86" width="300" height="222" rx="14" class="aa-grey" />
    <text x="250" y="118" class="aa-bold aa-c">Human</text>
    <rect x="135" y="146" width="230" height="44" rx="9" fill="#ffffff" stroke="#8E8A82" stroke-width="1.1" />
    <text x="250" y="168" class="aa-text aa-c">biological evolution</text>
    <rect x="135" y="204" width="230" height="44" rx="9" fill="#ffffff" stroke="#8E8A82" stroke-width="1.1" />
    <text x="250" y="226" class="aa-text aa-c">personal experience</text>
    <rect x="500" y="86" width="300" height="222" rx="14" style="fill:#F0F5FB" class="aa-blue" />
    <text x="650" y="118" style="fill:#3576C0" class="aa-bold aa-c">Artificial intelligence</text>
    <rect x="525" y="140" width="120" height="40" rx="9" class="aa-blue" /><text x="585" y="160" class="aa-text aa-c">mathematics</text>
    <rect x="655" y="140" width="120" height="40" rx="9" class="aa-blue" /><text x="715" y="160" class="aa-text aa-c">data</text>
    <rect x="525" y="194" width="120" height="40" rx="9" class="aa-blue" /><text x="585" y="214" class="aa-text aa-c">engineering</text>
    <rect x="655" y="194" width="120" height="40" rx="9" class="aa-blue" /><text x="715" y="214" class="aa-text aa-c">computing</text>
    <text x="650" y="270" class="aa-small aa-c">GPUs, data centers</text>
  </g>
  <g data-key="colsNote" data-only="1">
    <text x="450" y="346" class="aa-text aa-c">The skills can match: both recognize a cat in a photo. What differs is the source.</text>
  </g>
  <g data-key="hlRight" data-only="1">
    <rect x="490" y="76" width="320" height="242" rx="18" class="aa-hl" />
    <text x="450" y="346" class="aa-bold aa-c">Next in the article: what numbers the machine computes,</text>
    <text x="450" y="368" class="aa-bold aa-c">with which formulas, and how it tunes its parameters.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="who" data-focus="who">
      <div class="step-kicker">Step 1 · who created it</div>
      <h4>Nature grew human intelligence, people built AI</h4>
      <p>Human intelligence took shape over millions of years of evolution. Artificial intelligence
      is designed by engineers and programmers: it is an attempt to reproduce intelligent behavior in a machine.</p>
    </div>
    <div class="step-panel" data-on="skills" data-focus="skills">
      <div class="step-kicker">Step 2 · six skills</div>
      <h4>Intelligent behavior breaks down into skills</h4>
      <p>A machine needs to see, hear, speak, reason, choose an action, and adjust to
      new information. Each skill is checked on a concrete task: recognize an object in a photo,
      understand a phrase, choose a move in a game.</p>
    </div>
    <div class="step-panel" data-on="orbit" data-focus="orbit">
      <div class="step-kicker">Step 3 · artificial satellite</div>
      <h4>“Artificial” means “made by people”</h4>
      <p>The Moon and a satellite move around the Earth by the same laws of gravity. Nature created the Moon,
      people built the satellite. And the satellite is real: it relays signals and takes pictures of the Earth.
      Same with AI: the word “artificial” tells you where the behavior comes from, not that it is fake.</p>
    </div>
    <div class="step-panel" data-on="cols colsNote" data-focus="cols">
      <div class="step-kicker">Step 4 · source of skills</div>
      <h4>What differs is the source of the behavior</h4>
      <p>In humans, skills grew out of biological evolution and personal experience. In AI they come
      from mathematics, data, engineering, and computing power.</p>
    </div>
    <div class="step-panel" data-on="cols hlRight" data-focus="hlRight">
      <div class="step-kicker">Step 5 · what's next</div>
      <h4>Let's unpack the right column</h4>
      <p>Later in the article we will show what stands behind the words “mathematics” and “data”: what numbers
      the machine computes, with which formulas, and how it tunes its parameters.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## Areas of AI and why everyone talks about machine learning now

AI brings together different approaches. In older systems, programmers described the rules by hand: “if an object has four legs, a tail, and barks, it is a dog.” Such systems are called expert systems or rule-based systems.

But most real-world problems are too complex to describe by hand. You cannot list every possible face, voice, traffic situation, writing style, or cat photo. That is why modern AI relies mostly on machine learning: instead of writing all the rules ourselves, we show the machine data so that it finds the patterns.

Inside machine learning sits deep learning, which uses multi-layer neural networks. Deep learning is what powers large language models, computer vision, speech recognition, and many modern recommender systems.

<div class="stage" id="stageAiHierarchy" tabindex="0">
  <div class="stage-figure">
<svg id="aiHier" viewBox="0 90 900 390" role="img" aria-label="Nested rectangles: artificial intelligence contains machine learning, which contains deep learning and modern models">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.72;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      font-weight: 700;
      fill: #111111;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.25;
      rx: 18;
    }
    .ai-box {
      fill: #F7F5EF;
      stroke: #8E8A82;
      stroke-width: 1.3;
      rx: 18;
    }
    .ml-box {
      fill: #F0EEFF;
      stroke: #3576C0;
      stroke-width: 1.45;
      rx: 16;
    }
    .dl-box {
      fill: #EAF8F3;
      stroke: #73B222;
      stroke-width: 1.45;
      rx: 14;
    }
    .mini-box {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.25;
      rx: 9;
    }
    .side-box {
      fill: #ffffff;
      stroke: #8E8A82;
      stroke-width: 1.15;
      rx: 10;
    }
    .box-title-ai {
      font-size: 17px;
      font-weight: 800;
      fill: #4F4A44;
    }
    .box-sub-ai {
      font-size: 13px;
      fill: #5E5850;
    }
    .box-title-ml {
      font-size: 17px;
      font-weight: 800;
      fill: #3576C0;
    }
    .box-sub-ml {
      font-size: 13px;
      fill: #3576C0;
      opacity: 0.88;
    }
    .box-title-dl {
      font-size: 17px;
      font-weight: 800;
      fill: #145F53;
    }
    .box-sub-dl {
      font-size: 13px;
      fill: #145F53;
      opacity: 0.85;
    }
    .mini-title {
      font-size: 16px;
      font-weight: 800;
      fill: #145F53;
    }
    .mini-sub {
      font-size: 12px;
      fill: #145F53;
      opacity: 0.85;
    }
    .side-title {
      font-size: 15px;
      font-weight: 800;
      fill: #4F4A44;
    }
    .explain {
      font-size: 17px;
      font-weight: 800;
      fill: #111111;
    }
    .explain-small {
      font-size: 14px;
      fill: #111111;
      opacity: 0.76;
    }
    .highlight-ai {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 18;
      stroke-dasharray: 8 5;
    }
    .highlight-ml {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 16;
      stroke-dasharray: 8 5;
    }
    .highlight-dl {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 2.3;
      rx: 14;
      stroke-dasharray: 8 5;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <rect x="40" y="112" width="830" height="340" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="boxAI" data-only="1">
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">An umbrella for different approaches</text>
    </g>
    <g data-key="boxML" data-only="1">
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Machine learning</text>
      <text x="180" y="252" class="box-sub-ml">Learns from data, not from rules</text>
    </g>
    <g data-key="boxDL" data-only="1">
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Deep learning</text>
      <text x="232" y="307" class="box-sub-dl">Multi-layer neural networks</text>
    </g>
    <g data-key="boxMini" data-only="1">
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">text</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">vision</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Speech</text>
      <text x="503" y="350" class="mini-sub center">audio</text>
    </g>
    <g data-key="boxSide" data-only="1">
      <rect x="645" y="174" width="135" height="52" class="side-box" />
      <text x="712.5" y="194" class="side-title center">Expert</text>
      <text x="712.5" y="215" class="side-title center">systems</text>
      <rect x="645" y="246" width="135" height="52" class="side-box" />
      <text x="712.5" y="266" class="side-title center">Logic</text>
      <text x="712.5" y="287" class="side-title center">rules</text>
      <rect x="645" y="318" width="135" height="52" class="side-box" />
      <text x="712.5" y="338" class="side-title center">Search</text>
      <text x="712.5" y="359" class="side-title center">&amp; planning</text>
    </g>
    <g data-key="hlAI" data-only="1">
      <rect x="95" y="128" width="710" height="252" class="highlight-ai" />
    </g>
    <g data-key="hlML" data-only="1">
      <rect x="150" y="194" width="470" height="182" class="highlight-ml" />
    </g>
    <g data-key="hlDL" data-only="1">
      <rect x="202" y="258" width="370" height="105" class="highlight-dl" />
    </g>
    <g data-key="hlSide" data-only="1">
      <rect x="635" y="168" width="155" height="212" class="highlight-ai" />
    </g>
    <g data-key="exp1" data-only="1">
      <text x="450" y="398" class="explain center">AI: the broadest level.</text>
      <text x="450" y="416" class="explain-small center">It covers the different ways to make a system solve intelligent tasks.</text>
    </g>
    <g data-key="exp2" data-only="1">
      <text x="450" y="398" class="explain center">Machine learning is part of AI.</text>
      <text x="450" y="416" class="explain-small center">Instead of hand-written rules, the model looks for patterns in data.</text>
    </g>
    <g data-key="exp3" data-only="1">
      <text x="450" y="398" class="explain center">Deep learning is part of machine learning.</text>
      <text x="450" y="416" class="explain-small center">It uses neural networks with many layers.</text>
    </g>
    <g data-key="exp4" data-only="1">
      <text x="450" y="398" class="explain center">Different models solve different tasks.</text>
      <text x="450" y="416" class="explain-small center">LLMs for text, CNNs for vision, speech models for audio.</text>
    </g>
    <g data-key="exp5" data-only="1">
      <text x="450" y="398" class="explain center">Not all AI learns from data.</text>
      <text x="450" y="416" class="explain-small center">Expert systems can work by rules set in advance.</text>
    </g>
    <g data-key="exp6" data-only="1">
      <text x="450" y="392" class="explain center">AI ⊃ Machine learning ⊃ Deep learning ⊃ LLM / CNN / speech</text>
      <text x="450" y="414" class="explain-small center">LLMs are not all of AI, just one branch inside deep learning.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="boxAI hlAI exp1" data-focus="boxAI">
      <div class="step-kicker">Step 1 · artificial intelligence</div>
      <h4>AI: the broadest level</h4>
      <p>Artificial intelligence is the general class of systems that imitate intelligent behavior.
      It covers the different ways to make a system solve intelligent tasks: from hand-written
      rules to learning from data.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML hlML exp2" data-focus="boxML">
      <div class="step-kicker">Step 2 · machine learning</div>
      <h4>Machine learning appears inside AI</h4>
      <p>Machine learning is the part of AI where a system learns from data rather than from rules
      written in advance: instead of following hand-made instructions, the model looks for patterns itself.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL hlDL exp3" data-focus="boxDL">
      <div class="step-kicker">Step 3 · deep learning</div>
      <h4>Inside ML there is deep learning</h4>
      <p>Deep learning is part of machine learning and is built on multi-layer neural
      networks: the more layers, the more complex the patterns the model can find.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini exp4" data-focus="boxMini">
      <div class="step-kicker">Step 4 · different models</div>
      <h4>Inside deep learning there are different models</h4>
      <p>Different architectures solve different tasks: LLMs work with text, CNNs with images,
      and separate models with speech and audio.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini boxSide hlSide exp5" data-focus="boxSide">
      <div class="step-kicker">Step 5 · not only ML</div>
      <h4>AI includes more than machine learning</h4>
      <p>AI also includes rule-based systems, search, and planning. Not all AI learns from
      data: expert systems can work by logical rules set in advance.</p>
    </div>
    <div class="step-panel" data-on="boxAI boxML boxDL boxMini boxSide exp6" data-focus="">
      <div class="step-kicker">Step 6 · summary</div>
      <h4>The full hierarchy</h4>
      <p>Now the whole picture is visible: AI ⊃ machine learning ⊃ deep learning ⊃ LLM / CNN / speech.
      LLMs are not all of AI, just one branch inside deep learning.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## Explicit programming and machine learning

The difference is easiest to see on an ordinary problem. Say we need the distance a car has traveled. We know the speed and the time. This is the classic school formula:

$$S = v \cdot t$$

Here the relationship between the inputs and the output is fully known. We can simply write a program:

```python
def distance(velocity, time):
    return velocity * time
```

This is explicit programming: a person knows the rule and writes it into code. The machine does not need to learn, because all the logic has already been set by the programmer.

Now a different problem: decide from a photo whether it shows a cat or a dog. There is no formula for this. You cannot write a reliable rule like `if pixel[3][5] == "whiskers": return "cat"`. Pictures vary too much: the lighting, pose, background, angle, object size, and camera quality all change.

<div class="ai-live" id="aiPixel">
  <div class="stage-figure">
<svg id="aiPixelSvg" viewBox="0 0 900 400" role="img" aria-label="A 16 by 16 pixel cat: when the lighting changes or the cat shifts, the value of the same pixel changes and the pixel rule stops firing">
  <g data-pix="cat"></g>
  <g data-pix="side"></g>
</svg>
  </div>
  <div class="ai-live-controls">
    <div class="ai-live-btns" role="group" aria-label="Cat snapshot">
      <button type="button" data-preset="0" aria-pressed="true">Normal light</button>
      <button type="button" data-preset="1" aria-pressed="false">In the shade</button>
      <button type="button" data-preset="2" aria-pressed="false">Cat moved</button>
    </div>
    <div class="ai-slider"><label for="aiPixLight">Lighting <output id="aiPixLightOut">100 %</output></label>
      <input id="aiPixLight" type="range" min="0.2" max="1.3" step="0.05" value="1"></div>
    <div class="ai-slider"><label for="aiPixDx">Shift right <output id="aiPixDxOut">0</output></label>
      <input id="aiPixDx" type="range" min="-3" max="3" step="1" value="0"></div>
    <div class="ai-slider"><label for="aiPixDy">Shift down <output id="aiPixDyOut">0</output></label>
      <input id="aiPixDy" type="range" min="-3" max="3" step="1" value="0"></div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker">One pixel · three snapshots</div>
      <h4></h4>
      <p></p>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var root = document.getElementById('aiPixel');
  if (!root) return;
  var svg = root.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var PAL = {
    '.': [172, 203, 236], d: [58, 42, 34], o: [232, 142, 44], p: [238, 150, 162], w: [246, 244, 238],
    g: [96, 172, 64], k: [90, 90, 90], r: [195, 11, 10], y: [240, 200, 40]
  };
  var CAT = [
    '................', '..d..........d..', '..dd........dd..', '..dpd......dpd..',
    '..dppddddddppd..', '.dooooooooooood.', '.dooooooooooood.', '.doogdoooodgood.',
    '.doodgoooogdood.', '.dooooooooooood.', 'kdwwwwwppwwwwwdk', 'kdwwwwdwwdwwwwdk',
    '..dwwwwddwwwwd..', '...dddddddddd...', '....rrrrrrrr....', '....rrryyrrr....'
  ];
  var N = 16, CELL = 20, X0 = 50, Y0 = 34, R0 = 7, C0 = 4, RULE = 137;
  var PRESETS = [[1, 0, 0], [0.45, 0, 0], [1, 3, 2]];

  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function gray(c) { return Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]); }
  function hex(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }

  // frame: shift (the background fills the vacated cells), then the lighting multiplier
  function frame(light, dx, dy) {
    var out = [];
    for (var r = 0; r < N; r++) {
      var row = [];
      for (var c = 0; c < N; c++) {
        var sr = r - dy, sc = c - dx;
        var base = (sr >= 0 && sr < N && sc >= 0 && sc < N) ? PAL[CAT[sr][sc]] : PAL['.'];
        row.push(base.map(function (v) { return Math.min(255, Math.max(0, Math.round(v * light))); }));
      }
      out.push(row);
    }
    return out;
  }

  var gCat = svg.querySelector('[data-pix="cat"]');
  var gSide = svg.querySelector('[data-pix="side"]');
  var cells = [];
  for (var r = 0; r < N; r++) {
    cells.push([]);
    for (var c = 0; c < N; c++) {
      var rc = el('rect', { x: X0 + c * CELL, y: Y0 + r * CELL, width: CELL, height: CELL, stroke: '#ffffff', 'stroke-width': 0.6 }, gCat);
      rc.dataset.r = r; rc.dataset.c = c;
      cells[r].push(rc);
    }
  }
  el('rect', { x: X0 + C0 * CELL - 1.5, y: Y0 + R0 * CELL - 1.5, width: CELL + 3, height: CELL + 3,
               fill: 'none', stroke: '#C30B0A', 'stroke-width': 3.2 }, gCat);
  var hoverBox = el('rect', { width: CELL, height: CELL, fill: 'none', stroke: '#111111', 'stroke-width': 2, visibility: 'hidden' }, gCat);
  var hoverText = el('text', { x: X0, y: Y0 + N * CELL + 26, 'font-size': 13, fill: '#5E5850', 'font-family': 'Helvetica, Arial, sans-serif' }, gCat,
                     'Hover over any pixel to see its numbers');

  var F = 'Helvetica, Arial, sans-serif', MONO = 'Menlo, Consolas, "Courier New", monospace';
  el('text', { x: 430, y: 60, 'font-size': 18, 'font-weight': 800, fill: '#111111', 'font-family': F }, gSide, 'Pixel (7, 4): row 7, column 4');
  var zoom = el('rect', { x: 430, y: 84, width: 96, height: 96, rx: 6, stroke: '#C30B0A', 'stroke-width': 3 }, gSide);
  var bigNum = el('text', { x: 552, y: 146, 'font-size': 54, 'font-weight': 800, fill: '#111111', 'font-family': F }, gSide, '137');
  el('text', { x: 552, y: 172, 'font-size': 13, fill: '#5E5850', 'font-family': F }, gSide, 'brightness: 0 black, 255 white');
  var rgbText = el('text', { x: 430, y: 206, 'font-size': 14, fill: '#111111', 'font-family': MONO }, gSide, '');
  el('rect', { x: 430, y: 226, width: 420, height: 72, rx: 10, fill: '#ffffff', stroke: '#3576C0', 'stroke-width': 1.6 }, gSide);
  el('text', { x: 448, y: 256, 'font-size': 16, fill: '#3576C0', 'font-family': MONO }, gSide, 'if pixel[7][4] == 137:');
  el('text', { x: 448, y: 282, 'font-size': 16, fill: '#3576C0', 'font-family': MONO }, gSide, '    return "cat"');
  var verdict = el('text', { x: 430, y: 330, 'font-size': 17, 'font-weight': 800, 'font-family': F }, gSide, '');
  var verdict2 = el('text', { x: 430, y: 356, 'font-size': 14, fill: '#5E5850', 'font-family': F }, gSide, '');

  var lightIn = document.getElementById('aiPixLight');
  var dxIn = document.getElementById('aiPixDx');
  var dyIn = document.getElementById('aiPixDy');
  var presetBtns = Array.prototype.slice.call(root.querySelectorAll('[data-preset]'));
  var titleEl = root.querySelector('.step-live h4');
  var textEl = root.querySelector('.step-live p');
  var img = frame(1, 0, 0);

  function describe(light, dx, dy, v) {
    var hit = v === RULE;
    if (dx === 0 && dy === 0 && light === 1) {
      return ['The rule fires on this snapshot',
        'Pixel (7, 4) lands on the green eye, and its brightness is 137. The programmer sees this number and writes the rule “if 137, then cat.”'];
    }
    if (dx === 0 && dy === 0) {
      return [hit ? 'The rule still holds' : 'Same cat, different number',
        'Lighting ' + Math.round(light * 100) + ' %: each of the R, G, B channels was multiplied by ' + light.toFixed(2) +
        ', and the eye pixel became ' + v + '. The cat has not moved, the eye has not moved, but the rule checks an exact number.'];
    }
    var moves = [];
    if (dx) moves.push('by ' + Math.abs(dx) + ' ' + (Math.abs(dx) === 1 ? 'pixel' : 'pixels') + (dx > 0 ? ' to the right' : ' to the left'));
    if (dy) moves.push('by ' + Math.abs(dy) + ' ' + (Math.abs(dy) === 1 ? 'pixel' : 'pixels') + (dy > 0 ? ' down' : ' up'));
    return [hit ? 'The match is a coincidence' : 'The cat moved, and a different patch is where the eye was',
      'The cat shifted ' + moves.join(' and ') + '. Cell (7, 4) now falls on a different patch of the picture, with brightness ' + v +
      '. In real photos the pose, background, angle, size, and camera change too, and every number changes with them.'];
  }

  function update() {
    var light = +lightIn.value, dx = +dxIn.value, dy = +dyIn.value;
    document.getElementById('aiPixLightOut').textContent = Math.round(light * 100) + ' %';
    document.getElementById('aiPixDxOut').textContent = dx;
    document.getElementById('aiPixDyOut').textContent = dy;
    img = frame(light, dx, dy);
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) cells[r][c].setAttribute('fill', hex(img[r][c]));
    var px = img[R0][C0], v = gray(px), hit = v === RULE;
    zoom.setAttribute('fill', hex(px));
    bigNum.textContent = v;
    rgbText.textContent = 'R ' + px[0] + '   G ' + px[1] + '   B ' + px[2];
    verdict.textContent = hit ? '✓ the rule fired: “cat”' : '✗ the rule stays silent: ' + v + ' ≠ 137';
    verdict.setAttribute('fill', hit ? '#4E8A12' : '#C30B0A');
    verdict2.textContent = hit ? 'On this snapshot the number matched.' : 'The snapshot still shows a cat.';
    presetBtns.forEach(function (b, i) {
      var p = PRESETS[i];
      b.setAttribute('aria-pressed', String(p[0] === light && p[1] === dx && p[2] === dy));
    });
    var d = describe(light, dx, dy, v);
    titleEl.textContent = d[0];
    textEl.textContent = d[1];
  }

  function showHover(r, c) {
    var px = img[r][c];
    hoverBox.setAttribute('x', X0 + c * CELL); hoverBox.setAttribute('y', Y0 + r * CELL);
    hoverBox.setAttribute('visibility', 'visible');
    hoverText.textContent = 'pixel (' + r + ', ' + c + '): R ' + px[0] + ', G ' + px[1] + ', B ' + px[2] + ' → brightness ' + gray(px);
  }
  gCat.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.r !== undefined) showHover(+t.dataset.r, +t.dataset.c);
  });
  gCat.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.r !== undefined) showHover(+t.dataset.r, +t.dataset.c);
  });
  gCat.addEventListener('mouseleave', function () { hoverBox.setAttribute('visibility', 'hidden'); });

  presetBtns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      lightIn.value = PRESETS[i][0]; dxIn.value = PRESETS[i][1]; dyIn.value = PRESETS[i][2];
      update();
    });
  });
  [lightIn, dxIn, dyIn].forEach(function (inp) { inp.addEventListener('input', update); });
  update();
})();
</script>

This is where machine learning begins. We show the model many examples of the form “input → correct answer,” and it tunes its internal parameters so that it gives the correct answer on new, similar examples.

<div class="stage" id="stageExplicitVsML" tabindex="0">
  <div class="stage-figure">
<svg id="explicitMl" viewBox="262 70 638 390" role="img" aria-label="Explicit programming compared with machine learning on the example of computing travel time">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .subtitle {
      font-size: 14px;
      fill: #111111;
      opacity: 0.75;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlueEM);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedEM);
    }
    .route {
      stroke: #3576C0;
      stroke-width: 3.3;
      fill: none;
      stroke-linecap: round;
    }
    .dot {
      fill: #3576C0;
    }
    .code-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .code-title {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
    }
    .code {
      font-family: "Courier New", Courier, monospace;
      font-size: 14px;
      fill: #3576C0;
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 14px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 14px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlueEM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedEM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
      <text x="328" y="130" class="scene-title">The ideal case</text>
      <text x="328" y="154" class="small">Constant speed. A simple road.</text>
      <circle cx="350" cy="250" r="6" class="dot" />
      <path d="M350 250 C400 250, 430 214, 480 238 C535 263, 575 208, 628 238 C680 266, 725 250, 820 250" class="route" />
      <circle cx="820" cy="250" r="6" class="dot" />
      <text x="335" y="276" class="small">start</text>
      <text x="797" y="276" class="small">finish</text>
      <line x1="350" y1="318" x2="820" y2="318" stroke="#3576C0" stroke-width="1.5" stroke-opacity="0.7" />
      <line x1="350" y1="311" x2="350" y2="325" stroke="#3576C0" stroke-width="1.5" />
      <line x1="820" y1="311" x2="820" y2="325" stroke="#3576C0" stroke-width="1.5" />
      <text x="585" y="342" class="formula-small center">S = 10 km</text>
    </g>
    <g data-key="step2" data-only="1">
      <text x="328" y="130" class="scene-title">Explicit programming scheme</text>
      <rect x="328" y="205" width="112" height="66" class="node-blue" />
      <text x="384" y="230" class="node-bold center">Data</text>
      <text x="384" y="252" class="small center">S, v</text>
      <path d="M452 238 L502 238" class="arrow" />
      <rect x="514" y="205" width="136" height="66" class="node-yellow" />
      <text x="582" y="230" class="node-bold center">Rule</text>
      <text x="582" y="252" class="small center">t = S / v</text>
      <path d="M662 238 L712 238" class="arrow" />
      <rect x="724" y="205" width="96" height="66" class="node-green" />
      <text x="772" y="230" class="node-bold center">Answer</text>
      <text x="772" y="252" class="small center">t</text>
      <text x="584" y="345" class="formula-small center">Data + rule → answer</text>
    </g>
    <g data-key="step3" data-only="1">
      <text x="328" y="130" class="scene-title">What happens inside the program?</text>
      <rect x="328" y="226" width="118" height="74" class="node-blue" />
      <text x="387" y="252" class="node-bold center">Data</text>
      <text x="387" y="276" class="small center">S = 10, v = 1</text>
      <path d="M456 263 L486 263" class="arrow" />
      <rect x="532" y="158" width="160" height="42" class="node-yellow" />
      <text x="612" y="179" class="node-bold center">Computer</text>
      <rect x="498" y="218" width="250" height="122" class="code-box" />
      <text x="520" y="246" class="code-title">Python</text>
      <text x="520" y="280" class="code">def travel_time(S, v):</text>
      <text x="548" y="310" class="code">return S / v</text>
      <path d="M760 263 L790 263" class="arrow" />
      <rect x="802" y="226" width="58" height="74" class="node-green" />
      <text x="831" y="252" class="node-bold center">Answer</text>
      <text x="831" y="278" class="formula-small center">10 h</text>
      <text x="584" y="388" class="left-text center">There is no learning here. The computer just runs a function</text>
      <text x="584" y="418" class="left-text center">that a person wrote in advance.</text>
    </g>
    <g data-key="step4" data-only="1">
      <text x="584" y="195" class="title center">How do we make a computer learn?</text>
      <text x="584" y="250" class="formula-small center">Can it discover the rule by itself?</text>
      <text x="584" y="292" class="formula-small center">For example: t depends on S and v</text>
    </g>
    <g data-key="step5" data-only="1">
      <text x="584" y="195" class="title center">Let's give the computer examples</text>
      <text x="584" y="250" class="formula-small center">It will see the inputs and the correct answers.</text>
      <text x="584" y="292" class="formula-small center">Then it will try to find the pattern.</text>
    </g>
    <g data-key="step6" data-only="1">
      <text x="328" y="130" class="scene-title">Training data</text>
      <rect x="410" y="164" width="300" height="198" class="table-box" />
      <line x1="410" y1="206" x2="710" y2="206" class="table-line" />
      <line x1="410" y1="245" x2="710" y2="245" class="table-line" />
      <line x1="410" y1="284" x2="710" y2="284" class="table-line" />
      <line x1="410" y1="323" x2="710" y2="323" class="table-line" />
      <line x1="510" y1="164" x2="510" y2="362" class="table-line" />
      <line x1="610" y1="164" x2="610" y2="362" class="table-line" />
      <text x="460" y="186" class="table-head">S</text>
      <text x="560" y="186" class="table-head">v</text>
      <text x="660" y="186" class="table-head">t</text>
      <text x="460" y="226" class="table-cell">100</text>
      <text x="560" y="226" class="table-cell">5</text>
      <text x="660" y="226" class="table-cell">20</text>
      <text x="460" y="265" class="table-cell">10</text>
      <text x="560" y="265" class="table-cell">2</text>
      <text x="660" y="265" class="table-cell">5</text>
      <text x="460" y="304" class="table-cell">5</text>
      <text x="560" y="304" class="table-cell">1</text>
      <text x="660" y="304" class="table-cell">5</text>
      <text x="460" y="343" class="table-cell">20</text>
      <text x="560" y="343" class="table-cell">4</text>
      <text x="660" y="343" class="table-cell">5</text>
      <path d="M760 226 L715 226" class="arrow-red" />
      <text x="772" y="230" class="small">answer</text>
      <path d="M760 343 L715 343" class="arrow-red" />
      <text x="772" y="347" class="small">answer</text>
    </g>
    <g data-key="step7" data-only="1">
      <rect x="328" y="156" width="170" height="178" class="node-blue" />
      <text x="413" y="180" class="node-bold center">Data</text>
      <rect x="350" y="198" width="126" height="108" class="table-box" />
      <line x1="350" y1="225" x2="476" y2="225" class="table-line" />
      <line x1="350" y1="252" x2="476" y2="252" class="table-line" />
      <line x1="350" y1="279" x2="476" y2="279" class="table-line" />
      <line x1="392" y1="198" x2="392" y2="306" class="table-line" />
      <line x1="434" y1="198" x2="434" y2="306" class="table-line" />
      <text x="371" y="212" class="table-head">S</text>
      <text x="413" y="212" class="table-head">v</text>
      <text x="455" y="212" class="table-head">t</text>
      <text x="371" y="238" class="table-cell">100</text>
      <text x="413" y="238" class="table-cell">5</text>
      <text x="455" y="238" class="table-cell">20</text>
      <text x="371" y="265" class="table-cell">10</text>
      <text x="413" y="265" class="table-cell">2</text>
      <text x="455" y="265" class="table-cell">5</text>
      <text x="371" y="292" class="table-cell">20</text>
      <text x="413" y="292" class="table-cell">4</text>
      <text x="455" y="292" class="table-cell">5</text>
      <path d="M510 245 L560 245" class="arrow" />
      <rect x="572" y="196" width="130" height="98" class="node-yellow" />
      <text x="637" y="223" class="node-bold center">Model</text>
      <text x="637" y="253" class="small center">finds the link</text>
      <path d="M714 245 L760 245" class="arrow" />
      <rect x="772" y="196" width="44" height="98" class="node-green" />
      <text x="794" y="223" class="node-bold center">t</text>
      <text x="794" y="253" class="small center">answer</text>
      <text x="584" y="380" class="formula-small center">After training the model roughly knows:</text>
      <text x="584" y="410" class="formula center">t = f(S, v)</text>
    </g>
    <g data-key="step8" data-only="1">
      <text x="328" y="130" class="scene-title">A new example</text>
      <rect x="328" y="208" width="130" height="72" class="node-blue" />
      <text x="393" y="232" class="node-bold center">New data</text>
      <text x="393" y="256" class="small center">S = 10, v = 1</text>
      <path d="M470 244 L528 244" class="arrow" />
      <rect x="540" y="200" width="144" height="88" class="node-yellow" />
      <text x="612" y="228" class="node-bold center">Model</text>
      <text x="612" y="252" class="small center">already trained</text>
      <path d="M696 244 L750 244" class="arrow" />
      <rect x="762" y="208" width="60" height="72" class="node-green" />
      <text x="792" y="232" class="node-bold center">t</text>
      <text x="792" y="256" class="small center">?</text>
      <text x="584" y="370" class="formula-small center">The model has to predict the time.</text>
      <text x="584" y="406" class="formula center">t ≈ 10 h</text>
    </g>
    <g data-key="step9" data-only="1">
      <text x="430" y="146" class="scene-title center">Explicit programming</text>
      <rect x="332" y="172" width="196" height="112" class="node-blue" />
      <text x="430" y="206" class="formula-small center">Data + rule</text>
      <text x="430" y="236" class="formula-small center">→</text>
      <text x="430" y="264" class="formula-small center">Answer</text>
      <text x="430" y="330" class="small center">A person writes the rule in advance.</text>
      <line x1="584" y1="146" x2="584" y2="340" stroke="#3576C0" stroke-width="1.2" stroke-opacity="0.28" />
      <text x="738" y="146" class="scene-title center">Machine learning</text>
      <rect x="640" y="172" width="196" height="112" class="node-yellow" />
      <text x="738" y="206" class="formula-small center">Data + answers</text>
      <text x="738" y="236" class="formula-small center">→</text>
      <text x="738" y="264" class="formula-small center">Model</text>
      <text x="738" y="330" class="small center">The model learns the rule from examples.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Step 1 · the problem</div>
      <h4>A simple problem</h4>
      <p>We need the travel time, given the distance S = 10 km and the speed v = 1 km/h.
      Let's see how this relationship can be obtained in two different ways: with an ordinary
      formula or by learning.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Step 2 · explicit programming</div>
      <h4>The rule is known: we just write the formula</h4>
      <p>When the relationship between input and output is known in advance, a person writes
      it down as a rule: data plus the rule give the answer.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Step 3 · running the code</div>
      <h4>The computer runs a ready-made formula</h4>
      <p>The computer simply plugs S = 10 and v = 1 into the function <code>t = S / v</code>,
      which a person wrote in advance, and gets t = 10 h. There is no learning here, only
      computation with a ready-made formula.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Step 4 · the question</div>
      <h4>Can the computer find the rule by itself?</h4>
      <p>We move from a ready-made formula to the idea that a computer can discover the
      relationship between S, v, and t on its own, without being told it directly.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Step 5 · the idea of learning</div>
      <h4>Instead of a formula, we show many examples</h4>
      <p>We do not write the formula by hand. Instead, we show the computer many ready
      examples of “input → answer,” and it tries to find the pattern in them by itself.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Step 6 · training data</div>
      <h4>Each row of the table is one example</h4>
      <p>Now we have a set of examples instead of a single problem: for different S and v the correct
      answer t is known. These are the pairs the model will learn from.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Step 7 · the model looks for a pattern</div>
      <h4>The model fits the link between S, v, and t</h4>
      <p>The model looks at the training examples and tries to find the hidden rule. After
      training it roughly knows: t = f(S, v).</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Step 8 · prediction</div>
      <h4>The trained model gets a new example</h4>
      <p>After training, the model can be given data without a ready answer (S = 10, v = 1),
      and it will predict the result: t ≈ 10 h, without knowing the formula t = S / v explicitly.</p>
    </div>
    <div class="step-panel" data-on="step9" data-focus="step9">
      <div class="step-kicker">Step 9 · comparison</div>
      <h4>The main difference between the two approaches</h4>
      <p>In explicit programming a person writes the rule in advance, and the data plus the rule give
      the answer. In machine learning the data and the answers are given together, and the rule (the model)
      has to be learned.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## Why a single formula is often not enough

Even the trip problem is more complicated in reality than it looks. A formula lets us estimate the travel time:

$$t = \frac{S}{v}$$

But in real life the time depends on more than the distance and the average speed. There are traffic jams, weather, stops, road quality, traffic lights, the driver's style, and many other factors. Formally, we could write:

$$t = f(S, v, \text{traffic}, \text{weather}, \text{stops}, \ldots)$$

The problem is that the function `f` is usually hard to write by hand. But we can collect many real trips and let the model approximate this relationship by itself.

<div class="stage" id="stageRealFactorsQuestion" tabindex="0">
  <div class="stage-figure">
<svg id="realFactors" viewBox="0 80 900 320" role="img" aria-label="The question of whether the formula t = S / v is enough, and the list of real factors that actually affect travel time">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      fill: #111111;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 700;
      fill: #111111;
    }
    .text {
      font-size: 16px;
      fill: #111111;
    }
    .formula {
      font-size: 22px;
      font-weight: 700;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <rect x="32" y="100" width="826" height="280" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
      <text x="445" y="215" class="title center">But is the trip ideal?</text>
      <text x="445" y="265" class="text center">Is the formula t = S / v alone enough?</text>
    </g>
    <g data-key="step2" data-only="1">
      <text x="445" y="145" class="title center">No, reality is more complicated</text>
      <text x="445" y="190" class="text center">The time depends on more than distance and speed.</text>
      <rect x="120" y="230" width="120" height="54" class="node-red" />
      <text x="180" y="257" class="node-bold center">Traffic</text>
      <rect x="280" y="230" width="120" height="54" class="node-red" />
      <text x="340" y="257" class="node-bold center">Weather</text>
      <rect x="440" y="230" width="120" height="54" class="node-red" />
      <text x="500" y="257" class="node-bold center">Stops</text>
      <rect x="600" y="230" width="120" height="54" class="node-red" />
      <text x="660" y="257" class="node-bold center">Road</text>
      <text x="445" y="335" class="formula center">t = f(S, v, traffic, weather, ...)</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Step 1 · the question</div>
      <h4>But is the trip ideal?</h4>
      <p>The formula t = S / v assumes a constant speed and a simple road. Is that
      enough for a real trip?</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Step 2 · the answer</div>
      <h4>No, reality is more complicated</h4>
      <p>The time depends on more than distance and speed: there are traffic jams, weather, stops,
      and road quality. Formally this can be written as t = f(S, v, traffic, weather, ...),
      but such a function is already hard to write by hand.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## How does a machine learn?

A machine does not learn the way a person does in the full sense of the word. Still, “learning” has a precise mathematical meaning here: tuning the model's parameters so that the error on the training examples gets smaller.

A model has “adjustable knobs” called parameters. At first they can be random. The model makes a prediction, we compare it with the correct answer, compute the error, and change the parameters slightly in the direction that reduces the error. Then we repeat this again and again.

In simplified form, the loop looks like this:

1. give the model data;
2. get a prediction;
3. compute the error;
4. update the parameters;
5. repeat many times.

After thousands, millions, or billions of such steps, the model gets better at generalizing patterns from the data.

<div class="stage" id="stageTrainingLoop" tabindex="0">
  <div class="stage-figure">
<svg id="trainLoop" viewBox="262 70 638 390" role="img" aria-label="The model gets a trip example, makes a forecast, compares it with the real answer, and updates its parameters">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .formula {
      font-size: 24px;
      font-weight: 800;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlueTL);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedTL);
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 13px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 13px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlueTL" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedTL" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
      <text x="328" y="130" class="scene-title">Training data</text>
      <rect x="340" y="165" width="490" height="190" class="table-box" />
      <line x1="340" y1="205" x2="830" y2="205" class="table-line" />
      <line x1="340" y1="245" x2="830" y2="245" class="table-line" />
      <line x1="340" y1="285" x2="830" y2="285" class="table-line" />
      <line x1="340" y1="325" x2="830" y2="325" class="table-line" />
      <line x1="420" y1="165" x2="420" y2="355" class="table-line" />
      <line x1="500" y1="165" x2="500" y2="355" class="table-line" />
      <line x1="600" y1="165" x2="600" y2="355" class="table-line" />
      <line x1="710" y1="165" x2="710" y2="355" class="table-line" />
      <text x="380" y="185" class="table-head">S</text>
      <text x="460" y="185" class="table-head">v</text>
      <text x="550" y="185" class="table-head">traffic</text>
      <text x="655" y="185" class="table-head">weather</text>
      <text x="770" y="185" class="table-head">actual t</text>
      <text x="380" y="225" class="table-cell">10</text>
      <text x="460" y="225" class="table-cell">1</text>
      <text x="550" y="225" class="table-cell">no</text>
      <text x="655" y="225" class="table-cell">clear</text>
      <text x="770" y="225" class="table-cell">10</text>
      <text x="380" y="265" class="table-cell">10</text>
      <text x="460" y="265" class="table-cell">1</text>
      <text x="550" y="265" class="table-cell">yes</text>
      <text x="655" y="265" class="table-cell">clear</text>
      <text x="770" y="265" class="table-cell">12</text>
      <text x="380" y="305" class="table-cell">10</text>
      <text x="460" y="305" class="table-cell">1</text>
      <text x="550" y="305" class="table-cell">yes</text>
      <text x="655" y="305" class="table-cell">rain</text>
      <text x="770" y="305" class="table-cell">14</text>
      <text x="380" y="345" class="table-cell">8</text>
      <text x="460" y="345" class="table-cell">1</text>
      <text x="550" y="345" class="table-cell">no</text>
      <text x="655" y="345" class="table-cell">rain</text>
      <text x="770" y="345" class="table-cell">9</text>
      <text x="584" y="405" class="left-text center">Each row is an example: the trip conditions and the correct answer.</text>
    </g>
    <g data-key="step2" data-only="1">
      <text x="328" y="130" class="scene-title">Take one example from the table</text>
      <rect x="330" y="185" width="170" height="90" class="node-blue" />
      <text x="415" y="213" class="node-bold center">Example</text>
      <text x="415" y="238" class="small center">S=10, v=1</text>
      <text x="415" y="258" class="small center">traffic + rain</text>
      <path d="M512 230 L565 230" class="arrow" />
      <rect x="578" y="180" width="150" height="100" class="node-yellow" />
      <text x="653" y="210" class="node-bold center">Model</text>
      <text x="653" y="238" class="small center">does not know</text>
      <text x="653" y="258" class="small center">the exact link yet</text>
      <path d="M740 230 L790 230" class="arrow" />
      <rect x="802" y="185" width="50" height="90" class="node-green" />
      <text x="827" y="213" class="node-bold center">t</text>
      <text x="827" y="240" class="small center">?</text>
      <text x="584" y="360" class="formula-small center">The first forecast may be inaccurate</text>
      <text x="584" y="400" class="left-text center">For example, the model says t ≈ 11, while the correct answer is 14.</text>
    </g>
    <g data-key="step3" data-only="1">
      <text x="328" y="130" class="scene-title">The model tries to answer</text>
      <rect x="330" y="205" width="145" height="76" class="node-blue" />
      <text x="402.5" y="233" class="node-bold center">Factors</text>
      <text x="402.5" y="258" class="small center">S, v, traffic, rain</text>
      <path d="M488 243 L545 243" class="arrow" />
      <rect x="558" y="198" width="140" height="90" class="node-yellow" />
      <text x="628" y="230" class="node-bold center">Model</text>
      <text x="628" y="258" class="small center">makes a forecast</text>
      <path d="M710 243 L760 243" class="arrow" />
      <rect x="772" y="205" width="80" height="76" class="node-green" />
      <text x="812" y="233" class="node-bold center">Forecast</text>
      <text x="812" y="260" class="formula-small center">11</text>
      <text x="584" y="358" class="formula-small center">Model forecast: 11</text>
      <text x="584" y="398" class="left-text center">But in the training data the correct answer for this row is 14.</text>
    </g>
    <g data-key="step4" data-only="1">
      <text x="328" y="130" class="scene-title">Comparing the forecast with the correct answer</text>
      <rect x="350" y="195" width="170" height="90" class="node-green" />
      <text x="435" y="225" class="node-bold center">Forecast</text>
      <text x="435" y="255" class="formula-small center">11</text>
      <rect x="635" y="195" width="185" height="90" class="node-blue" />
      <text x="727.5" y="220" class="node-bold center">Correct</text>
      <text x="727.5" y="242" class="node-bold center">answer</text>
      <text x="727.5" y="267" class="formula-small center">14</text>
      <path d="M535 240 L620 240" class="arrow-red" />
      <text x="584" y="345" class="formula-small center">Error: the forecast is below the real answer</text>
      <text x="584" y="390" class="left-text center">The model learns the direction: for these conditions the time should go up.</text>
    </g>
    <g data-key="step5" data-only="1">
      <text x="328" y="130" class="scene-title">After the error, the model updates its rule</text>
      <rect x="330" y="200" width="145" height="86" class="node-red" />
      <text x="402.5" y="228" class="node-bold center">Error</text>
      <text x="402.5" y="255" class="small center">forecast too low</text>
      <path d="M488 243 L545 243" class="arrow-red" />
      <rect x="558" y="190" width="150" height="106" class="node-yellow" />
      <text x="633" y="220" class="node-bold center">Model</text>
      <text x="633" y="248" class="small center">slightly adjusts</text>
      <text x="633" y="270" class="small center">its rule</text>
      <path d="M720 243 L775 243" class="arrow" />
      <rect x="788" y="200" width="64" height="86" class="node-green" />
      <text x="820" y="228" class="node-bold center">Better</text>
      <text x="820" y="255" class="small center">forecast</text>
      <text x="584" y="365" class="formula-small center">Before: t ≈ 11 → after: t ≈ 12</text>
      <text x="584" y="405" class="left-text center">It is not perfect yet, but the error has become smaller.</text>
    </g>
    <g data-key="step6" data-only="1">
      <text x="328" y="130" class="scene-title">Training: repeating one loop</text>
      <rect x="330" y="200" width="120" height="70" class="node-blue" />
      <text x="390" y="226" class="node-bold center">Example</text>
      <text x="390" y="250" class="small center">from the data</text>
      <path d="M462 235 L510 235" class="arrow" />
      <rect x="522" y="200" width="120" height="70" class="node-yellow" />
      <text x="582" y="226" class="node-bold center">Forecast</text>
      <text x="582" y="250" class="small center">of the model</text>
      <path d="M654 235 L702 235" class="arrow" />
      <rect x="714" y="200" width="120" height="70" class="node-red" />
      <text x="774" y="226" class="node-bold center">Error</text>
      <text x="774" y="250" class="small center">comparison</text>
      <path d="M774 285 C750 330, 410 330, 390 285" class="arrow" />
      <text x="584" y="370" class="formula-small center">Example → forecast → error → correction</text>
      <text x="584" y="410" class="left-text center">The more good examples, the better the model finds the pattern.</text>
    </g>
    <g data-key="step7" data-only="1">
      <text x="328" y="130" class="scene-title">What has the model roughly understood?</text>
      <rect x="330" y="190" width="140" height="72" class="node-blue" />
      <text x="400" y="218" class="node-bold center">S and v</text>
      <text x="400" y="242" class="small center">base time</text>
      <rect x="510" y="190" width="140" height="72" class="node-red" />
      <text x="580" y="218" class="node-bold center">Traffic</text>
      <text x="580" y="242" class="small center">increases t</text>
      <rect x="690" y="190" width="140" height="72" class="node-red" />
      <text x="760" y="218" class="node-bold center">Rain</text>
      <text x="760" y="242" class="small center">matters too</text>
      <text x="584" y="330" class="formula-small center">The model learned a dependence, not a single formula</text>
      <text x="584" y="375" class="left-text center">It roughly knows that with traffic and rain the trip usually takes longer.</text>
      <text x="584" y="405" class="left-text center">This knowledge came from data, not from hand-written if-else.</text>
    </g>
    <g data-key="step8" data-only="1">
      <text x="328" y="130" class="scene-title">Using the trained model</text>
      <rect x="320" y="205" width="155" height="82" class="node-blue" />
      <text x="397.5" y="232" class="node-bold center">New trip</text>
      <text x="397.5" y="257" class="small center">S, v, traffic, weather</text>
      <path d="M488 246 L545 246" class="arrow" />
      <rect x="558" y="198" width="145" height="96" class="node-yellow" />
      <text x="630.5" y="228" class="node-bold center">Trained</text>
      <text x="630.5" y="253" class="node-bold center">model</text>
      <path d="M716 246 L775 246" class="arrow" />
      <rect x="788" y="205" width="64" height="82" class="node-green" />
      <text x="820" y="232" class="node-bold center">t</text>
      <text x="820" y="257" class="small center">forecast</text>
      <text x="584" y="360" class="formula-small center">New data + trained model → forecast</text>
      <text x="584" y="405" class="left-text center">This is how ML replaces a large number of hand-written rules.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Step 1 · data</div>
      <h4>The model has examples</h4>
      <p>The model learns from trips where the correct answer is already known: many rows with
      factors (S, v, traffic, weather) and the real time t. Each row
      serves as an example of “input → correct answer.”</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Step 2 · first guess</div>
      <h4>At first the model does not know the rule</h4>
      <p>Take one row of data: S = 10, v = 1, traffic and rain, correct answer t = 14.
      The model is not trained yet and starts with a rough guess.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Step 3 · forecast</div>
      <h4>The model makes a forecast</h4>
      <p>It tries to predict the answer for the chosen row and gets t ≈ 11. But in the
      training data the correct answer for this row is 14.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Step 4 · error</div>
      <h4>The model sees the error</h4>
      <p>It compares the forecast (11) with the correct answer (14) and sees that the forecast is below
      the real value. The model learns the direction: for these conditions the time should go up.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Step 5 · update</div>
      <h4>The model corrects itself a little</h4>
      <p>It changes its rule so that next time the error is smaller: the forecast
      moves from 11 to 12. It is not perfect yet, but the error has become smaller.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Step 6 · repetition</div>
      <h4>This repeats many times</h4>
      <p>The model goes through a large number of examples: example → forecast → error →
      correction. The more good examples, the better the model finds the pattern.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Step 7 · trained model</div>
      <h4>After training the model understands the link</h4>
      <p>Not perfectly, but well enough to be useful in new situations: the model learned a dependence
      rather than a single formula: with traffic and rain the trip usually takes longer. This knowledge came from
      data, not from hand-written if-else.</p>
    </div>
    <div class="step-panel" data-on="step8" data-focus="step8">
      <div class="step-kicker">Step 8 · application</div>
      <h4>Now we can make predictions</h4>
      <p>For a new trip the correct answer is not known in advance. The trained model gets
      the new factors and outputs a time forecast: new data + trained model → forecast.
      This is how ML replaces a large number of hand-written rules.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

The simplest example is linear regression. There are points on a plot, and the model tries to draw a line through them. The line is defined by two parameters: the slope and the offset.

$$\hat y = w \cdot x + b$$

At first the line sits almost at random, so the error is large. Then the model changes `w` and `b`, and the line gradually turns and shifts closer to the points. This is learning in its simplest form.

<div class="ai-live" id="aiLinreg">
  <div class="stage-figure">
<svg id="aiLinregSvg" viewBox="0 0 900 400" role="img" aria-label="Twenty points and the line y = w x + b: the w and b knobs move the line, red segments show the errors, gradient descent picks w and b by itself">
  <defs>
    <clipPath id="aiLrClip"><rect x="60" y="24" width="500" height="326" /></clipPath>
  </defs>
  <g data-lr="axes"></g>
  <g data-lr="plot" clip-path="url(#aiLrClip)"></g>
  <g data-lr="side"></g>
</svg>
  </div>
  <div class="ai-live-controls">
    <div class="ai-slider"><label for="aiLrW">Knob w (slope) <output id="aiLrWOut">−0.40</output></label>
      <input id="aiLrW" type="range" min="-1.5" max="2.5" step="0.01" value="-0.4"></div>
    <div class="ai-slider"><label for="aiLrB">Knob b (offset) <output id="aiLrBOut">7.00</output></label>
      <input id="aiLrB" type="range" min="-3" max="9" step="0.01" value="7"></div>
    <div class="ai-live-btns">
      <button type="button" data-lr-act="step">1 descent step</button>
      <button type="button" data-lr-act="run">Train: 1500 steps</button>
      <button type="button" data-lr-act="reset">Start over</button>
    </div>
  </div>
  <div class="stage-notes">
    <div class="step-live">
      <div class="step-kicker">Training · fitting two parameters</div>
      <h4></h4>
      <p></p>
    </div>
  </div>
</div>

<script>
(function () {
  'use strict';
  var root = document.getElementById('aiLinreg');
  if (!root) return;
  var svg = root.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var F = 'Helvetica, Arial, sans-serif';
  var X = [0.758, 1.134, 1.657, 1.668, 1.742, 1.831, 2.978, 3.821, 4.994, 5.103,
           5.106, 5.442, 5.907, 6.098, 6.473, 6.532, 7.594, 7.851, 8.849, 9.033];
  var Y = [1.501, 1.348, 3.103, 2.362, 1.546, 2.396, 3.552, 3.719, 4.453, 5.611,
           6.222, 5.689, 5.713, 6.648, 7.172, 6.521, 7.964, 8.509, 8.436, 8.164];
  var W0 = -0.4, B0 = 7, LR = 0.02, STEPS = 1500, W_BEST = 0.907, B_BEST = 0.740;
  var P = { l: 60, r: 560, t: 24, b: 350, x0: 0, x1: 10, y0: -1, y1: 11 };
  function sx(v) { return P.l + (v - P.x0) / (P.x1 - P.x0) * (P.r - P.l); }
  function sy(v) { return P.b - (v - P.y0) / (P.y1 - P.y0) * (P.b - P.t); }
  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function f2(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
  function mse(w, b) {
    var s = 0;
    for (var i = 0; i < X.length; i++) { var r = w * X[i] + b - Y[i]; s += r * r; }
    return s / X.length;
  }
  function gradStep(w, b) {
    var gw = 0, gb = 0;
    for (var i = 0; i < X.length; i++) { var r = w * X[i] + b - Y[i]; gw += r * X[i]; gb += r; }
    return [w - LR * 2 * gw / X.length, b - LR * 2 * gb / X.length];
  }

  // axes and grid
  var axes = svg.querySelector('[data-lr="axes"]');
  for (var gx = 0; gx <= 10; gx += 2) {
    el('line', { x1: sx(gx), y1: P.t, x2: sx(gx), y2: P.b, stroke: '#ECECEC' }, axes);
    el('text', { x: sx(gx), y: P.b + 18, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'middle', 'font-family': F }, axes, gx);
  }
  for (var gy = 0; gy <= 10; gy += 2) {
    el('line', { x1: P.l, y1: sy(gy), x2: P.r, y2: sy(gy), stroke: '#ECECEC' }, axes);
    el('text', { x: P.l - 8, y: sy(gy) + 4, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, axes, gy);
  }
  el('line', { x1: P.l, y1: sy(0), x2: P.r, y2: sy(0), stroke: '#8E8A82', 'stroke-width': 1.2 }, axes);
  el('line', { x1: sx(0), y1: P.t, x2: sx(0), y2: P.b, stroke: '#8E8A82', 'stroke-width': 1.2 }, axes);
  el('text', { x: P.r, y: P.b + 40, 'font-size': 13, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, axes, 'x');
  el('text', { x: P.l + 6, y: P.t + 12, 'font-size': 13, fill: '#5E5850', 'font-family': F }, axes, 'y');

  var plot = svg.querySelector('[data-lr="plot"]');
  var best = el('line', { stroke: '#8E8A82', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', visibility: 'hidden' }, plot);
  best.setAttribute('x1', sx(P.x0)); best.setAttribute('y1', sy(W_BEST * P.x0 + B_BEST));
  best.setAttribute('x2', sx(P.x1)); best.setAttribute('y2', sy(W_BEST * P.x1 + B_BEST));
  var resid = X.map(function () { return el('line', { stroke: '#C30B0A', 'stroke-width': 1.8, opacity: 0.85 }, plot); });
  var line = el('line', { stroke: '#73B222', 'stroke-width': 3.2 }, plot);
  X.forEach(function (x, i) {
    el('circle', { cx: sx(x), cy: sy(Y[i]), r: 5.5, fill: '#3576C0', stroke: '#ffffff', 'stroke-width': 1.3 }, plot);
  });

  // right column: formula, error, learning curve
  var side = svg.querySelector('[data-lr="side"]');
  var formula = el('text', { x: 600, y: 52, 'font-size': 21, 'font-weight': 800, fill: '#111111', 'font-family': F }, side, '');
  el('text', { x: 600, y: 90, 'font-size': 13, fill: '#5E5850', 'font-family': F }, side, 'mean squared error (MSE)');
  var mseText = el('text', { x: 600, y: 130, 'font-size': 38, 'font-weight': 800, fill: '#C30B0A', 'font-family': F }, side, '');
  var stepText = el('text', { x: 600, y: 160, 'font-size': 14, fill: '#5E5850', 'font-family': F }, side, '');
  var C = { l: 610, r: 860, t: 200, b: 330 };
  el('rect', { x: C.l, y: C.t, width: C.r - C.l, height: C.b - C.t, fill: '#FAFAF7', stroke: '#E0DDD3', rx: 6 }, side);
  el('text', { x: C.l, y: C.t - 10, 'font-size': 13, fill: '#5E5850', 'font-family': F }, side, 'MSE over descent steps');
  el('text', { x: C.l, y: C.b + 18, 'font-size': 12, fill: '#5E5850', 'font-family': F }, side, '0');
  el('text', { x: C.r, y: C.b + 18, 'font-size': 12, fill: '#5E5850', 'text-anchor': 'end', 'font-family': F }, side, '1500');
  var curve = el('path', { fill: 'none', stroke: '#C30B0A', 'stroke-width': 2.2 }, side);
  var bestNote = el('text', { x: 600, y: 376, 'font-size': 13, fill: '#5E5850', 'font-family': F, visibility: 'hidden' }, side,
                    'dashed: exact least squares, w = 0.91, b = 0.74');

  var wIn = document.getElementById('aiLrW');
  var bIn = document.getElementById('aiLrB');
  var runBtn = root.querySelector('[data-lr-act="run"]');
  var stepBtn = root.querySelector('[data-lr-act="step"]');
  var titleEl = root.querySelector('.step-live h4');
  var textEl = root.querySelector('.step-live p');

  var w = W0, b = B0, step = 0, hist = [], timer = null, manual = false;
  var M0 = mse(W0, B0);

  function drawCurve() {
    if (!hist.length) { curve.setAttribute('d', ''); return; }
    var top = Math.log(Math.max(hist[0], 0.3)), bot = Math.log(0.2);
    var d = hist.map(function (m, i) {
      var cx = C.l + i / STEPS * (C.r - C.l);
      var cy = C.t + (top - Math.log(Math.max(m, 0.2))) / (top - bot) * (C.b - C.t);
      return (i ? 'L' : 'M') + cx.toFixed(1) + ' ' + Math.max(C.t, cy).toFixed(1);
    });
    curve.setAttribute('d', d.join(' '));
  }

  function note() {
    var m = mse(w, b);
    if (manual) {
      return ['You are turning the knobs yourself',
        'Each position of the knobs gives its own line and its own error: right now MSE = ' + m.toFixed(2) +
        '. Try to get it below 0.30 by hand, then press “Train,” and descent will continue from your line.'];
    }
    if (step === 0) {
      return ['At first the line sits almost at random',
        'w = −0.4, b = 7: the line goes down, while the points go up. The red segments show the error at each point; ' +
        'their mean square is ' + M0.toFixed(1) + '.'];
    }
    if (step < STEPS) {
      return ['A descent step moves both knobs',
        'At each step w and b shift slightly toward where the mean squared error is smaller. After ' + step +
        (step === 1 ? ' step' : ' steps') + ': w = ' + f2(w) + ', b = ' + f2(b) + ', MSE = ' + m.toFixed(2) + '.'];
    }
    return ['The line is fitted',
      'After 1500 steps w = ' + f2(w) + ', b = ' + f2(b) + ', MSE = ' + m.toFixed(2) +
      '. The exact least squares formula gives the same line (dashed). A neural network learns the same way, it just has millions or billions of knobs.'];
  }

  function render() {
    line.setAttribute('x1', sx(P.x0)); line.setAttribute('y1', sy(w * P.x0 + b));
    line.setAttribute('x2', sx(P.x1)); line.setAttribute('y2', sy(w * P.x1 + b));
    X.forEach(function (x, i) {
      resid[i].setAttribute('x1', sx(x)); resid[i].setAttribute('x2', sx(x));
      resid[i].setAttribute('y1', sy(Y[i])); resid[i].setAttribute('y2', sy(w * x + b));
    });
    var m = mse(w, b);
    formula.textContent = 'ŷ = ' + f2(w) + '·x ' + (b < 0 ? '− ' : '+ ') + Math.abs(b).toFixed(2);
    mseText.textContent = m.toFixed(2);
    mseText.setAttribute('fill', m < 0.3 ? '#4E8A12' : '#C30B0A');
    stepText.textContent = manual ? 'knobs set by hand' : 'descent steps: ' + step;
    var done = step >= STEPS;
    best.setAttribute('visibility', done ? 'visible' : 'hidden');
    bestNote.setAttribute('visibility', done ? 'visible' : 'hidden');
    wIn.value = w; bIn.value = b;
    document.getElementById('aiLrWOut').textContent = f2(w);
    document.getElementById('aiLrBOut').textContent = f2(b);
    runBtn.disabled = done; stepBtn.disabled = done;
    drawCurve();
    var n = note();
    titleEl.textContent = n[0];
    textEl.textContent = n[1];
  }

  function stop() { if (timer) { cancelAnimationFrame(timer); timer = null; } }
  function doStep() {
    if (manual) { manual = false; step = 0; hist = [mse(w, b)]; }
    if (!hist.length) hist.push(mse(w, b));
    var nb = gradStep(w, b); w = nb[0]; b = nb[1]; step += 1;
    hist.push(mse(w, b));
  }
  function run() {
    stop();
    function frame() {
      var k = Math.max(1, Math.floor(step / 25));
      for (var i = 0; i < k && step < STEPS; i++) doStep();
      render();
      if (step < STEPS) timer = requestAnimationFrame(frame); else timer = null;
    }
    timer = requestAnimationFrame(frame);
  }

  stepBtn.addEventListener('click', function () { stop(); if (step < STEPS) doStep(); render(); });
  runBtn.addEventListener('click', run);
  root.querySelector('[data-lr-act="reset"]').addEventListener('click', function () {
    stop(); w = W0; b = B0; step = 0; hist = []; manual = false; render();
  });
  [wIn, bIn].forEach(function (inp) {
    inp.addEventListener('input', function () {
      stop(); w = +wIn.value; b = +bIn.value; manual = true; step = 0; hist = []; render();
    });
  });
  render();
})();
</script>

<div class="stage" id="stageWhyMlNeeded" tabindex="0">
  <div class="stage-figure">
<svg id="whyMl" viewBox="262 70 638 390" role="img" aria-label="From many factors and a growing pile of if-else rules to historical data and a model that learns from it">
  <style>
    svg {
      background: #ffffff;
      font-family: Helvetica, Arial, sans-serif;
    }
    .title {
      font-size: 21px;
      font-weight: 800;
      fill: #111111;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .scene-title {
      font-size: 16px;
      font-weight: 800;
      fill: #111111;
    }
    .node-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
    }
    .node-bold {
      font-size: 15px;
      font-weight: 800;
      fill: #111111;
    }
    .small {
      font-size: 12px;
      fill: #111111;
      opacity: 0.78;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
    }
    .formula-small {
      font-size: 18px;
      font-weight: 800;
      fill: #111111;
    }
    .center {
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .arrow {
      stroke: #3576C0;
      stroke-width: 2.2;
      fill: none;
      marker-end: url(#arrowHeadBlueWM);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRedWM);
    }
    .table-box {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      rx: 8;
    }
    .table-line {
      stroke: #3576C0;
      stroke-width: 1.1;
      stroke-opacity: 0.35;
    }
    .table-head {
      font-size: 13px;
      font-weight: 800;
      fill: #3576C0;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .table-cell {
      font-size: 13px;
      fill: #111111;
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlueWM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRedWM" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent">
    <g data-key="step1" data-only="1">
      <text x="328" y="130" class="scene-title">In reality t = S / v is no longer enough</text>
      <rect x="340" y="190" width="110" height="54" class="node-blue" />
      <text x="395" y="217" class="node-bold center">S, v</text>
      <rect x="480" y="190" width="110" height="54" class="node-red" />
      <text x="535" y="217" class="node-bold center">Traffic</text>
      <rect x="620" y="190" width="110" height="54" class="node-red" />
      <text x="675" y="217" class="node-bold center">Weather</text>
      <rect x="760" y="190" width="90" height="54" class="node-red" />
      <text x="805" y="217" class="node-bold center">Road</text>
      <text x="584" y="310" class="formula-small center">t = f(S, v, traffic, weather, road, ...)</text>
      <text x="584" y="360" class="left-text center">The more factors, the harder it is to describe every case by hand.</text>
    </g>
    <g data-key="step2" data-only="1">
      <text x="328" y="130" class="scene-title">Let's try explicit programming</text>
      <rect x="350" y="175" width="460" height="170" class="node-blue" />
      <text x="380" y="215" class="small">if traffic is heavy → add 40 minutes</text>
      <text x="380" y="245" class="small">if it rains → add 15 minutes</text>
      <text x="380" y="275" class="small">if the road is bad → add 20 minutes</text>
      <text x="380" y="305" class="small">if rush hour and rain → add another ...</text>
      <text x="584" y="390" class="formula-small center">The rules keep multiplying</text>
    </g>
    <g data-key="step3" data-only="1">
      <text x="328" y="130" class="scene-title">The problem is not just the number of factors</text>
      <rect x="330" y="185" width="130" height="58" class="node-red" />
      <text x="395" y="214" class="node-bold center">Rain</text>
      <rect x="515" y="185" width="130" height="58" class="node-red" />
      <text x="580" y="214" class="node-bold center">Rush hour</text>
      <rect x="700" y="185" width="130" height="58" class="node-red" />
      <text x="765" y="214" class="node-bold center">Roadworks</text>
      <path d="M462 214 L503 214" class="arrow-red" />
      <path d="M647 214 L688 214" class="arrow-red" />
      <text x="584" y="310" class="left-text center">The factors act together, not separately.</text>
      <text x="584" y="345" class="left-text center">For example, rain + rush hour can add more time</text>
      <text x="584" y="380" class="left-text center">than each factor would on its own.</text>
    </g>
    <g data-key="step4" data-only="1">
      <text x="328" y="130" class="scene-title">Collecting real examples</text>
      <rect x="340" y="165" width="480" height="190" class="table-box" />
      <line x1="340" y1="205" x2="820" y2="205" class="table-line" />
      <line x1="340" y1="245" x2="820" y2="245" class="table-line" />
      <line x1="340" y1="285" x2="820" y2="285" class="table-line" />
      <line x1="340" y1="325" x2="820" y2="325" class="table-line" />
      <line x1="430" y1="165" x2="430" y2="355" class="table-line" />
      <line x1="520" y1="165" x2="520" y2="355" class="table-line" />
      <line x1="620" y1="165" x2="620" y2="355" class="table-line" />
      <line x1="720" y1="165" x2="720" y2="355" class="table-line" />
      <text x="385" y="185" class="table-head">S</text>
      <text x="475" y="185" class="table-head">v</text>
      <text x="570" y="185" class="table-head">traffic</text>
      <text x="670" y="185" class="table-head">weather</text>
      <text x="770" y="185" class="table-head">t</text>
      <text x="385" y="225" class="table-cell">10</text>
      <text x="475" y="225" class="table-cell">1</text>
      <text x="570" y="225" class="table-cell">no</text>
      <text x="670" y="225" class="table-cell">clear</text>
      <text x="770" y="225" class="table-cell">10</text>
      <text x="385" y="265" class="table-cell">10</text>
      <text x="475" y="265" class="table-cell">1</text>
      <text x="570" y="265" class="table-cell">yes</text>
      <text x="670" y="265" class="table-cell">clear</text>
      <text x="770" y="265" class="table-cell">12</text>
      <text x="385" y="305" class="table-cell">10</text>
      <text x="475" y="305" class="table-cell">1</text>
      <text x="570" y="305" class="table-cell">yes</text>
      <text x="670" y="305" class="table-cell">rain</text>
      <text x="770" y="305" class="table-cell">14</text>
      <text x="385" y="345" class="table-cell">8</text>
      <text x="475" y="345" class="table-cell">1</text>
      <text x="570" y="345" class="table-cell">no</text>
      <text x="670" y="345" class="table-cell">rain</text>
      <text x="770" y="345" class="table-cell">9</text>
      <text x="584" y="400" class="left-text center">Now the answer comes from real experience, not from hand-written rules.</text>
    </g>
    <g data-key="step5" data-only="1">
      <text x="328" y="130" class="scene-title">The model learns from historical data</text>
      <rect x="330" y="210" width="150" height="76" class="node-blue" />
      <text x="405" y="238" class="node-bold center">Data</text>
      <text x="405" y="264" class="small center">S, v, factors, t</text>
      <path d="M492 248 L550 248" class="arrow" />
      <rect x="562" y="200" width="150" height="96" class="node-yellow" />
      <text x="637" y="230" class="node-bold center">Model</text>
      <text x="637" y="258" class="small center">finds the link</text>
      <text x="637" y="278" class="small center">between factors</text>
      <path d="M724 248 L780 248" class="arrow" />
      <rect x="792" y="210" width="60" height="76" class="node-green" />
      <text x="822" y="238" class="node-bold center">t</text>
      <text x="822" y="264" class="small center">answer</text>
      <text x="584" y="360" class="formula-small center">ML: data + answers → model</text>
      <text x="584" y="400" class="left-text center">The model fits the dependence from examples by itself.</text>
    </g>
    <g data-key="step6" data-only="1">
      <text x="328" y="130" class="scene-title">Using the model in a new situation</text>
      <rect x="320" y="210" width="160" height="76" class="node-blue" />
      <text x="400" y="238" class="node-bold center">New data</text>
      <text x="400" y="264" class="small center">S, v, traffic, weather</text>
      <path d="M492 248 L550 248" class="arrow" />
      <rect x="562" y="200" width="150" height="96" class="node-yellow" />
      <text x="637" y="230" class="node-bold center">Model</text>
      <text x="637" y="258" class="small center">already trained</text>
      <path d="M724 248 L780 248" class="arrow" />
      <rect x="792" y="210" width="60" height="76" class="node-green" />
      <text x="822" y="238" class="node-bold center">t</text>
      <text x="822" y="264" class="small center">forecast</text>
      <text x="584" y="360" class="formula-small center">New data + model → forecast</text>
      <text x="584" y="400" class="left-text center">The model does not know the future, but estimates it from past experience.</text>
    </g>
    <g data-key="step7" data-only="1">
      <text x="328" y="130" class="scene-title">When is ML better than hand-written rules?</text>
      <rect x="330" y="180" width="150" height="70" class="node-red" />
      <text x="405" y="210" class="node-bold center">Many</text>
      <text x="405" y="233" class="small center">factors</text>
      <rect x="505" y="180" width="150" height="70" class="node-yellow" />
      <text x="580" y="210" class="node-bold center">Complex</text>
      <text x="580" y="233" class="small center">dependence</text>
      <rect x="680" y="180" width="150" height="70" class="node-green" />
      <text x="755" y="210" class="node-bold center">Data</text>
      <text x="755" y="233" class="small center">history available</text>
      <text x="584" y="320" class="formula-small center">ML is needed when the rule is hard to write by hand,</text>
      <text x="584" y="360" class="formula-small center">but many examples can be shown.</text>
      <text x="584" y="410" class="left-text center">The model learns from the past and makes forecasts for new cases.</text>
    </g>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="step1" data-focus="step1">
      <div class="step-kicker">Step 1 · extra factors</div>
      <h4>The real problem is more complex</h4>
      <p>The time depends on the distance and the speed (S = 10 km, v = 1 km/h), but there are
      also traffic, weather, and the road. The more factors, the harder it is to describe every
      case by hand.</p>
    </div>
    <div class="step-panel" data-on="step2" data-focus="step2">
      <div class="step-kicker">Step 2 · lots of if-else</div>
      <h4>We could write the rules by hand</h4>
      <p>But the number of conditions grows fast: if traffic → add 40 minutes, if rain →
      15, if the road is bad → 20, and so on for every new combination.</p>
    </div>
    <div class="step-panel" data-on="step3" data-focus="step3">
      <div class="step-kicker">Step 3 · complex combinations</div>
      <h4>The rules start to conflict</h4>
      <p>The problem is not just the number of factors: they act together, not separately.
      Rain and rush hour together can add more time than each factor would
      on its own: one factor amplifies the other.</p>
    </div>
    <div class="step-panel" data-on="step4" data-focus="step4">
      <div class="step-kicker">Step 4 · historical data</div>
      <h4>Instead of rules, we can collect data</h4>
      <p>Each trip becomes a training example: the trip factors and the real time t
      are known. Now the answer comes from real experience, not from hand-written rules.</p>
    </div>
    <div class="step-panel" data-on="step5" data-focus="step5">
      <div class="step-kicker">Step 5 · training</div>
      <h4>The model looks for patterns</h4>
      <p>It learns from examples where the correct answer is already known and fits the
      dependence between the factors and the time by itself: data and answers give a model.</p>
    </div>
    <div class="step-panel" data-on="step6" data-focus="step6">
      <div class="step-kicker">Step 6 · prediction</div>
      <h4>Then the model makes a forecast</h4>
      <p>For a new trip the correct answer is not known in advance. The model does not know the future,
      but estimates it from past experience: new data plus the model give a forecast.</p>
    </div>
    <div class="step-panel" data-on="step7" data-focus="step7">
      <div class="step-kicker">Step 7 · conclusion</div>
      <h4>Why ML is needed here</h4>
      <p>ML is useful when there are many factors, the dependence between them is complex, but there is a history
      of data. Then it is easier to show the model examples than to write out all the rules by hand.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## How does a computer see the world?

A computer has no eyes in the human sense. For it, a picture is stored as a table of numbers. In a black-and-white image, each pixel can be represented by a single number: 0 means black, 255 means white, and the values in between give different shades of gray.

A color picture usually has three channels: R, G, and B. So each pixel stores three numbers: how much red, green, and blue it contains.

A computer does not see a “cat” right away. All it gets as input is a grid of numbers. Computer vision teaches a model to find combinations of pixels in that grid that correspond to meaningful objects: faces, cars, letters, medical scans, or kittens.

Let's work through this on the same 16 × 16 cat on which the single-pixel rule broke in the section on explicit programming.

<div class="stage" id="stageComputerVision" tabindex="0">
  <div class="stage-figure">
<svg id="cvPipeline" viewBox="0 0 900 400" role="img" aria-label="The same 16 by 16 pixel cat: pixel brightness, the numbers around the eye, three RGB channels, a 3 by 3 window drawing an edge map, cat parts and class probabilities">
  <style>
    .cv-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .cv-title { font: 800 19px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-bold { font: 800 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .cv-big { font: 800 30px Helvetica, Arial, sans-serif; fill: #111111; }
    .cv-c { text-anchor: middle; dominant-baseline: middle; }
    .cv-frame { fill: none; stroke: #C30B0A; stroke-width: 3; }
    .cv-link { stroke: #C30B0A; stroke-width: 1.3; stroke-opacity: 0.6; }
    .cv-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#cvArrow); }
  </style>
  <defs>
    <marker id="cvArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <linearGradient id="cvGrayScale" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000000" />
      <stop offset="1" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="cv-panel" />

  <!-- 1. the same cat -->
  <g data-key="s1" data-only="1">
    <g data-cv="color"></g>
    <rect x="144" y="181" width="19" height="19" class="cv-frame" />
    <text x="430" y="72" class="cv-title">For a computer, a picture is numbers</text>
    <text x="430" y="116" class="cv-text">This is the same 16 × 16 cat on which, above,</text>
    <text x="430" y="140" class="cv-text">the rule pixel[7][4] == 137 broke.</text>
    <text x="430" y="184" class="cv-text">16 rows × 16 columns = 256 pixels.</text>
    <text x="430" y="208" class="cv-text">Red frame: pixel (7, 4), the green eye.</text>
    <text x="430" y="252" class="cv-text">A person sees ears, eyes, and whiskers.</text>
    <text x="430" y="276" class="cv-text">The computer's memory holds only numbers.</text>
  </g>

  <!-- 2. brightness -->
  <g data-key="s2" data-only="1">
    <g data-cv="gray"></g>
    <rect x="144" y="181" width="19" height="19" class="cv-frame" />
    <text x="430" y="72" class="cv-title">Grayscale picture: one number per pixel</text>
    <rect x="430" y="130" width="400" height="34" rx="4" fill="url(#cvGrayScale)" stroke="#8E8A82" />
    <text x="430" y="186" class="cv-small">0 · black</text>
    <text x="830" y="186" class="cv-small" text-anchor="end">255 · white</text>
    <path d="M502 124 L502 112" stroke="#111111" />
    <text x="502" y="104" class="cv-small cv-c">46 · outline</text>
    <path d="M678 124 L678 112" stroke="#111111" />
    <text x="678" y="104" class="cv-small cv-c">158 · fur</text>
    <path d="M645 170 L645 214" stroke="#C30B0A" stroke-width="2" />
    <text x="645" y="232" class="cv-bold cv-c" style="fill:#C30B0A">137 · eye (7, 4)</text>
    <text x="430" y="290" class="cv-text">A pixel's color comes down to one number from 0 to 255:</text>
    <text x="430" y="314" class="cv-text">the lighter the point, the larger the number.</text>
  </g>

  <!-- 3. numbers around the eye -->
  <g data-key="s3" data-only="1">
    <g data-cv="gray2"></g>
    <rect x="87" y="143" width="114" height="95" class="cv-frame" />
    <line x1="201" y1="143" x2="470" y2="52" class="cv-link" />
    <line x1="201" y1="238" x2="470" y2="322" class="cv-link" />
    <g data-cv="zoom"></g>
    <text x="626" y="356" class="cv-text cv-c">Rows 5–9, columns 1–6. No word “eye” here, only 46, 158, 137.</text>
  </g>

  <!-- 4. RGB of one pixel -->
  <g data-key="s4" data-only="1">
    <g data-cv="color2"></g>
    <rect x="161.5" y="312.5" width="22" height="22" class="cv-frame" style="stroke:#111111;stroke-width:3.5" />
    <text x="430" y="72" class="cv-title">A color pixel stores three numbers</text>
    <rect x="430" y="98" width="96" height="96" rx="6" style="fill:#C30B0A" stroke="#111111" stroke-width="3" />
    <text x="546" y="132" class="cv-bold">pixel (14, 5): collar</text>
    <text x="546" y="160" class="cv-text">[195, 11, 10]</text>
    <text x="430" y="238" class="cv-bold">R</text>
    <rect x="456" y="224" width="306" height="20" rx="4" fill="#C30B0A" /><text x="772" y="239" class="cv-bold">195</text>
    <text x="430" y="274" class="cv-bold">G</text>
    <rect x="456" y="260" width="17" height="20" rx="4" fill="#73B222" /><text x="483" y="275" class="cv-bold">11</text>
    <text x="430" y="310" class="cv-bold">B</text>
    <rect x="456" y="296" width="16" height="20" rx="4" fill="#3576C0" /><text x="482" y="311" class="cv-bold">10</text>
    <text x="430" y="352" class="cv-text">Lots of red, almost no green or blue.</text>
  </g>

  <!-- 5. three channels -->
  <g data-key="s5" data-only="1">
    <text x="450" y="56" class="cv-title cv-c">Picture = three tables: R, G, and B</text>
    <g data-cv="channels"></g>
    <text x="207" y="160" class="cv-big cv-c">=</text>
    <text x="388" y="160" class="cv-big cv-c">+</text>
    <text x="569" y="160" class="cv-big cv-c">+</text>
    <text x="117" y="256" class="cv-small cv-c">picture</text>
    <text x="298" y="256" class="cv-small cv-c">R: how much red</text>
    <text x="479" y="256" class="cv-small cv-c">G: how much green</text>
    <text x="660" y="256" class="cv-small cv-c">B: how much blue</text>
    <text x="450" y="306" class="cv-bold cv-c">16 × 16 × 3 = 768 numbers at the model's input</text>
    <text x="450" y="336" class="cv-text cv-c">A 4000 × 3000 photo has 4000 × 3000 × 3 = 36 million such numbers.</text>
  </g>

  <!-- 6. the window runs over the cat -->
  <g data-key="s6" data-only="1">
    <text x="196" y="44" class="cv-small cv-c">brightness</text>
    <text x="616" y="44" class="cv-small cv-c">edge map</text>
    <g data-cv="scanGray"></g>
    <g data-cv="scanEdge"></g>
    <path d="M350 192 L462 192" class="cv-arrow" />
    <text x="406" y="178" class="cv-small cv-c">3 × 3 window</text>
    <text x="196" y="354" class="cv-text cv-c" data-cv="readout"></text>
    <text x="616" y="354" class="cv-small cv-c">dark cell: a sharp change in brightness</text>
  </g>

  <!-- 7. parts -->
  <g data-key="s7" data-only="1">
    <g data-cv="edgeParts"></g>
    <rect x="77" y="73" width="85" height="68" fill="none" stroke="#3576C0" stroke-width="3" />
    <rect x="94" y="158" width="85" height="68" fill="none" stroke="#73B222" stroke-width="3" />
    <rect x="60" y="209" width="102" height="68" fill="none" stroke="#C29E08" stroke-width="3" stroke-dasharray="7 4" />
    <text x="400" y="72" class="cv-title">Edges add up to parts</text>
    <rect x="400" y="102" width="16" height="16" fill="none" stroke="#3576C0" stroke-width="3" />
    <text x="428" y="115" class="cv-text"><tspan font-weight="800">ear</tspan>: two slanted edges meet at a corner</text>
    <rect x="400" y="140" width="16" height="16" fill="none" stroke="#73B222" stroke-width="3" />
    <text x="428" y="153" class="cv-text"><tspan font-weight="800">eye</tspan>: a small spot framed by edges</text>
    <rect x="400" y="178" width="16" height="16" fill="none" stroke="#C29E08" stroke-width="3" stroke-dasharray="5 3" />
    <text x="428" y="191" class="cv-text"><tspan font-weight="800">whiskers</tspan>: short edges on the sides of the face</text>
    <text x="400" y="250" class="cv-text">Edges, lines, and corners combine into shapes,</text>
    <text x="400" y="274" class="cv-text">and shapes into parts. Nobody labels these combinations:</text>
    <text x="400" y="298" class="cv-text">deep layers find them on their own during training.</text>
  </g>

  <!-- 8. classes -->
  <g data-key="s8" data-only="1">
    <g data-cv="color3"></g>
    <path d="M276 196 L330 196" class="cv-arrow" />
    <text x="360" y="72" class="cv-title">The last layer outputs class probabilities</text>
    <text x="440" y="130" class="cv-bold" text-anchor="end">cat</text>
    <rect x="452" y="114" width="335" height="24" rx="5" fill="#73B222" /><text x="797" y="131" class="cv-bold">0.93</text>
    <text x="440" y="176" class="cv-bold" text-anchor="end">dog</text>
    <rect x="452" y="160" width="14" height="24" rx="5" fill="#3576C0" /><text x="476" y="177" class="cv-bold">0.04</text>
    <text x="440" y="222" class="cv-bold" text-anchor="end">fox</text>
    <rect x="452" y="206" width="7" height="24" rx="5" fill="#C29E08" /><text x="469" y="223" class="cv-bold">0.02</text>
    <text x="440" y="268" class="cv-bold" text-anchor="end">other</text>
    <rect x="452" y="252" width="4" height="24" rx="2" fill="#8E8A82" /><text x="466" y="269" class="cv-bold">0.01</text>
    <text x="360" y="330" class="cv-text">Answer: the class with the highest probability, “cat.”</text>
  </g>

  <!-- 9. the whole chain -->
  <g data-key="s9" data-only="1">
    <text x="450" y="60" class="cv-title cv-c">From numbers to “cat”</text>
    <g data-cv="chain"></g>
    <path d="M160 176 L192 176 M330 176 L362 176 M500 176 L532 176 M670 176 L702 176" class="cv-arrow" />
    <rect x="712" y="132" width="130" height="88" rx="12" style="fill:#EEF6E4" stroke="#73B222" stroke-width="1.8" />
    <text x="777" y="164" class="cv-bold cv-c">cat</text>
    <text x="777" y="192" class="cv-big cv-c">0.93</text>
    <text x="96" y="256" class="cv-small cv-c">pixels</text>
    <text x="266" y="256" class="cv-small cv-c">brightness</text>
    <text x="436" y="256" class="cv-small cv-c">edges</text>
    <text x="606" y="256" class="cv-small cv-c">parts</text>
    <text x="777" y="256" class="cv-small cv-c">answer</text>
    <text x="450" y="310" class="cv-bold cv-c">pixels → edges → shapes and parts → object</text>
    <text x="450" y="340" class="cv-text cv-c">Each stage builds a more complex description of the same picture from the previous one.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="s1" data-focus="s1">
      <div class="step-kicker">Step 1 · the picture</div>
      <h4>The same cat, now through the computer's eyes</h4>
      <p>Take the 16 × 16 cat from the section on explicit programming. On it, the rule
      “if pixel (7, 4) equals 137, then cat” broke from a shadow and a shift. Now let's see what
      a model does with this picture. For the computer, the cat is stored as a table of 256 pixels.</p>
    </div>
    <div class="step-panel" data-on="s2" data-focus="s2">
      <div class="step-kicker">Step 2 · brightness</div>
      <h4>In a black-and-white picture a pixel is one number</h4>
      <p>0 means black, 255 white, and the values in between give shades of gray. The cat's dark outline
      is 46, the ginger fur 158, and the green eye in cell (7, 4) is 137.</p>
    </div>
    <div class="step-panel" data-on="s3" data-focus="s3">
      <div class="step-kicker">Step 3 · numbers around the eye</div>
      <h4>This is what the computer actually gets</h4>
      <p>Let's zoom into a 5 × 6 patch at the left eye. The cells hold only numbers: 46 where the outline is, 158 on the
      fur, 137 on the eye. There is no “this is an eye” feature in the table; it still has to be found.</p>
    </div>
    <div class="step-panel" data-on="s4" data-focus="s4">
      <div class="step-kicker">Step 4 · RGB</div>
      <h4>A color pixel stores three numbers</h4>
      <p>A color picture has three channels: R, G, and B. Each pixel stores how much red,
      green, and blue it contains. The collar pixel is [195, 11, 10]: lots of red, almost no green
      or blue.</p>
    </div>
    <div class="step-panel" data-on="s5" data-focus="s5">
      <div class="step-kicker">Step 5 · three channels</div>
      <h4>The picture splits into three tables</h4>
      <p>Each channel is stored as a separate 16 × 16 matrix. Together that is 16 × 16 × 3 = 768 numbers, and
      these are what the model gets as input. A 4000 × 3000 photo has 36 million such numbers.</p>
    </div>
    <div class="step-panel" data-on="s6" data-focus="s6">
      <div class="step-kicker">Step 6 · edges</div>
      <h4>The first layers look for edges</h4>
      <p>A 3 × 3 window moves across the whole picture and at each point compares the brightness on the left and right,
      above and below. Where the change is sharp, a dark cell appears on the map. At the left ear, in cell
      (3, 2), the brightness drops from 197 to 46, and the window gives a strong edge. Here the window is set by hand
      (a Sobel filter); in a real network the numbers in such windows are learned during training.</p>
    </div>
    <div class="step-panel" data-on="s7" data-focus="s7">
      <div class="step-kicker">Step 7 · shapes and parts</div>
      <h4>Edges add up to parts of the object</h4>
      <p>The next layers assemble edges into shapes, and shapes into parts: two slanted edges meeting
      at a corner give an ear, a small spot framed by edges gives an eye, short edges on the sides of the face
      give whiskers. Nobody tells the model “this is an ear” by hand: it finds such features during training.</p>
    </div>
    <div class="step-panel" data-on="s8" data-focus="s8">
      <div class="step-kicker">Step 8 · classification</div>
      <h4>The parts of the object give an overall answer</h4>
      <p>The last layer estimates what the picture shows: cat 0.93, dog 0.04, fox 0.02,
      other 0.01. The model picks the class with the highest probability.</p>
    </div>
    <div class="step-panel" data-on="s9" data-focus="s9">
      <div class="step-kicker">Step 9 · the whole chain</div>
      <h4>From numbers to “cat”</h4>
      <p>Pixels → edges → shapes and parts → object. 768 numbers go in, and the probability of
      “cat,” 0.93, comes out. The hand-written single-pixel rule broke from a shadow and a shift. The model relies on
      combinations of edges and parts: in the shade the brightness changes are weaker but follow the same boundaries, and
      after a shift an ear is still an ear, just in a different place in the picture.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

<script>
(function () {
  'use strict';
  var stage = document.getElementById('stageComputerVision');
  if (!stage) return;
  var svg = stage.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var PAL = {
    '.': [172, 203, 236], d: [58, 42, 34], o: [232, 142, 44], p: [238, 150, 162], w: [246, 244, 238],
    g: [96, 172, 64], k: [90, 90, 90], r: [195, 11, 10], y: [240, 200, 40]
  };
  var CAT = [
    '................', '..d..........d..', '..dd........dd..', '..dpd......dpd..',
    '..dppddddddppd..', '.dooooooooooood.', '.dooooooooooood.', '.doogdoooodgood.',
    '.doodgoooogdood.', '.dooooooooooood.', 'kdwwwwwppwwwwwdk', 'kdwwwwdwwdwwwwdk',
    '..dwwwwddwwwwd..', '...dddddddddd...', '....rrrrrrrr....', '....rrryyrrr....'
  ];
  var N = 16;
  var RGB = CAT.map(function (row) { return row.split('').map(function (ch) { return PAL[ch]; }); });
  var GRAY = RGB.map(function (row) {
    return row.map(function (c) { return Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]); });
  });
  // Sobel filter on brightness, borders padded with the neighboring value (as in the video)
  function g(r, c) { return GRAY[Math.min(N - 1, Math.max(0, r))][Math.min(N - 1, Math.max(0, c))]; }
  var MAG = [], MAX = 0;
  for (var r = 0; r < N; r++) {
    MAG.push([]);
    for (var c = 0; c < N; c++) {
      var gx = -g(r - 1, c - 1) + g(r - 1, c + 1) - 2 * g(r, c - 1) + 2 * g(r, c + 1) - g(r + 1, c - 1) + g(r + 1, c + 1);
      var gy = -g(r - 1, c - 1) - 2 * g(r - 1, c) - g(r - 1, c + 1) + g(r + 1, c - 1) + 2 * g(r + 1, c) + g(r + 1, c + 1);
      var m = Math.sqrt(gx * gx + gy * gy);
      MAG[r].push(m);
      if (m > MAX) MAX = m;
    }
  }

  function el(name, attrs, parent, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rgb(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function gray(v) { return rgb([v, v, v]); }
  function edge(m) { var v = Math.round(255 - 225 * m / MAX); return gray(v); }
  function slot(name) { return svg.querySelector('[data-cv="' + name + '"]'); }
  function grid(parent, x, y, cell, fill, line) {
    var cells = [];
    for (var r = 0; r < N; r++) {
      cells.push([]);
      for (var c = 0; c < N; c++) {
        cells[r].push(el('rect', { x: x + c * cell, y: y + r * cell, width: cell, height: cell, fill: fill(r, c),
                                   stroke: '#ffffff', 'stroke-width': line === undefined ? 0.6 : line }, parent));
      }
    }
    return cells;
  }
  var colorAt = function (r, c) { return rgb(RGB[r][c]); };
  var grayAt = function (r, c) { return gray(GRAY[r][c]); };
  var edgeAt = function (r, c) { return edge(MAG[r][c]); };

  // large cats: top-left corner (68, 48), cell 19
  grid(slot('color'), 68, 48, 19, colorAt);
  grid(slot('gray'), 68, 48, 19, grayAt);
  grid(slot('gray2'), 68, 48, 19, grayAt);
  grid(slot('color2'), 68, 48, 19, colorAt);

  // zoomed patch at the eye: rows 5–9, columns 1–6
  var zoom = slot('zoom'), Z = 52;
  for (var zr = 5; zr <= 9; zr++) {
    for (var zc = 1; zc <= 6; zc++) {
      var v = GRAY[zr][zc], zx = 470 + (zc - 1) * Z, zy = 52 + (zr - 5) * Z;
      var eye = zr === 7 && zc === 4;
      el('rect', { x: zx, y: zy, width: Z, height: Z, fill: gray(v), stroke: eye ? '#C30B0A' : '#ffffff', 'stroke-width': eye ? 3 : 1 }, zoom);
      el('text', { x: zx + Z / 2, y: zy + Z / 2 + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800,
                   'font-family': 'Helvetica, Arial, sans-serif', fill: v < 110 ? '#ffffff' : '#111111' }, zoom, v);
    }
  }

  // three channels, cell 9
  var ch = slot('channels');
  grid(ch, 45, 88, 9, colorAt, 0);
  grid(ch, 226, 88, 9, function (r, c) { return rgb([RGB[r][c][0], 0, 0]); }, 0);
  grid(ch, 407, 88, 9, function (r, c) { return rgb([0, RGB[r][c][1], 0]); }, 0);
  grid(ch, 588, 88, 9, function (r, c) { return rgb([0, 0, RGB[r][c][2]]); }, 0);

  // parts on the edge map, cell 17
  grid(slot('edgeParts'), 60, 56, 17, edgeAt, 0.5);
  grid(slot('color3'), 70, 100, 12, colorAt, 0.4);

  // chain: pixels, brightness, edges, parts; cell 7
  var chain = slot('chain');
  grid(chain, 40, 120, 7, colorAt, 0);
  grid(chain, 210, 120, 7, grayAt, 0);
  grid(chain, 380, 120, 7, edgeAt, 0);
  grid(chain, 550, 120, 7, edgeAt, 0);
  [[1, 4, 1, 5, '#3576C0'], [6, 9, 2, 6, '#73B222'], [9, 12, 0, 5, '#C29E08']].forEach(function (p) {
    el('rect', { x: 550 + p[2] * 7, y: 120 + p[0] * 7, width: (p[3] - p[2] + 1) * 7, height: (p[1] - p[0] + 1) * 7,
                 fill: 'none', stroke: p[4], 'stroke-width': 2 }, chain);
  });

  // step 6: a 3 × 3 window runs over the cat and fills in the edge map
  var S = 17, GX = 60, GY = 56, EX = 480;
  var scanGray = slot('scanGray'), scanEdge = slot('scanEdge'), readout = slot('readout');
  grid(scanGray, GX, GY, S, grayAt, 0.5);
  var edgeCells = grid(scanEdge, EX, GY, S, function () { return '#ffffff'; }, 0.5);
  el('rect', { x: EX, y: GY, width: N * S, height: N * S, fill: 'none', stroke: '#E0DDD3' }, scanEdge);
  var win = el('rect', { width: 3 * S, height: 3 * S, fill: 'none', stroke: '#C30B0A', 'stroke-width': 3 }, scanGray);
  var mark = el('rect', { width: S, height: S, fill: 'none', stroke: '#C30B0A', 'stroke-width': 2.5 }, scanEdge);
  var group = svg.querySelector('[data-key="s6"]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var k = 0, shown = false;

  function place(i) {
    var r = Math.floor(i / N), c = i % N;
    win.setAttribute('x', GX + (c - 1) * S); win.setAttribute('y', GY + (r - 1) * S);
    mark.setAttribute('x', EX + c * S); mark.setAttribute('y', GY + r * S);
    edgeCells[r][c].setAttribute('fill', edgeAt(r, c));
    readout.textContent = 'window at (' + r + ', ' + c + '): edge strength ' + Math.round(MAG[r][c]);
  }
  function reset() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) edgeCells[r][c].setAttribute('fill', '#ffffff');
    k = 0;
  }
  function finish() {
    for (var i = 0; i < N * N; i++) place(i);
    place(3 * N + 2);
    k = N * N;
  }
  setInterval(function () {
    var visible = !group.classList.contains('is-hidden');
    if (!visible) { shown = false; return; }
    if (!shown) { shown = true; reset(); if (still) { finish(); return; } }
    if (k < N * N) { place(k); k += 1; if (k === N * N) place(3 * N + 2); }
  }, 32);
})();
</script>

## How does a computer write text?

For a model, text also turns into numbers. First the phrase is split into tokens: words, parts of words, punctuation marks, or individual characters. Then each token gets a numeric ID.

A large language model is trained on a huge amount of text. Its basic training task is very simple: predict the next token from the previous ones.

For example, if the model sees the beginning of a phrase:

> Kittens sit on ...

it has to estimate which token is most likely to come next: “chairs,” “sofas,” “roofs,” “floors,” and so on.

By doing this billions of times, the model learns grammar, style, facts, typical reasoning, and the structure of language. When we ask it to write an answer, it continues the same process: it estimates the probabilities of the next tokens and generates text step by step. The next token is not necessarily the most likely one: it is often picked at random, with the probabilities the model computed. That is why the model can answer the same question in different ways.

An LLM does not pull a ready answer out of a database the way a search engine does. It builds a continuation of the text from probabilities. That is why such models can sound convincing and still be wrong at times. They need to be checked, especially on facts, numbers, laws, medicine, and technical details.

<div class="stage" id="stageLlmGeneration" tabindex="0">
  <div class="stage-figure">
<svg id="llmGen" viewBox="0 0 900 400" role="img" aria-label="An LLM splits text into numbered tokens, learns to guess the next token, estimates the probabilities of continuations, generates text token by token, and picks tokens at random with those probabilities">
  <style>
    .lg-panel { fill: #ffffff; stroke: #3576C0; stroke-width: 1.3; stroke-opacity: 0.25; }
    .lg-title { font: 800 20px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-bold { font: 800 16px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-big { font: 800 24px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-text { font: 15px Helvetica, Arial, sans-serif; fill: #111111; }
    .lg-small { font: 13px Helvetica, Arial, sans-serif; fill: #111111; opacity: 0.75; }
    .lg-id { font: 700 15px Menlo, Consolas, "Courier New", monospace; fill: #3576C0; }
    .lg-c { text-anchor: middle; dominant-baseline: middle; }
    .lg-tok { fill: #ffffff; stroke: #3576C0; stroke-width: 1.6; }
    .lg-tok-y { fill: #ffffff; stroke: #C29E08; stroke-width: 1.6; }
    .lg-tok-r { fill: #ffffff; stroke: #C30B0A; stroke-width: 1.8; }
    .lg-tok-g { fill: #EEF6E4; stroke: #73B222; stroke-width: 1.8; }
    .lg-grey { fill: #F7F5EF; stroke: #8E8A82; stroke-width: 1.4; }
    .lg-arrow { stroke: #3576C0; stroke-width: 2.2; fill: none; marker-end: url(#lgArrow); }
    .lg-arc { stroke: #C30B0A; stroke-width: 1.8; fill: none; marker-end: url(#lgArrowRed); }
  </style>
  <defs>
    <marker id="lgArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="lgArrowRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <rect x="30" y="16" width="840" height="368" rx="18" class="lg-panel" />

  <!-- step titles -->
  <g data-key="t1" data-only="1"><text x="450" y="58" class="lg-title lg-c">The model gets the beginning of a text</text></g>
  <g data-key="t2" data-only="1"><text x="450" y="58" class="lg-title lg-c">Text → tokens</text></g>
  <g data-key="t3" data-only="1"><text x="450" y="58" class="lg-title lg-c">Tokens → numbers</text></g>
  <g data-key="t5" data-only="1"><text x="450" y="58" class="lg-title lg-c">The model looks at all previous tokens</text></g>
  <g data-key="t7" data-only="1"><text x="450" y="58" class="lg-title lg-c">The chosen token is added to the text</text></g>

  <!-- 1. the whole phrase -->
  <g data-key="phrase" data-only="1">
    <rect x="230" y="140" width="440" height="80" rx="14" class="lg-tok-y" />
    <text x="450" y="180" class="lg-big lg-c">Kittens sit on …</text>
    <text x="450" y="290" class="lg-text lg-c">For now this is just a string of characters. The model computes only with numbers,</text>
    <text x="450" y="314" class="lg-text lg-c">so the text first has to be cut up and numbered.</text>
  </g>

  <!-- 2–3, 5, 7. row of tokens -->
  <g data-key="tokens" data-only="1">
    <rect x="170" y="130" width="90" height="54" rx="9" class="lg-tok" /><text x="215" y="157" class="lg-bold lg-c">Kit</text>
    <rect x="270" y="130" width="70" height="54" rx="9" class="lg-tok" /><text x="305" y="157" class="lg-bold lg-c">tens</text>
    <rect x="350" y="130" width="110" height="54" rx="9" class="lg-tok" /><text x="405" y="157" class="lg-bold lg-c">sit</text>
    <rect x="470" y="130" width="70" height="54" rx="9" class="lg-tok" /><text x="505" y="157" class="lg-bold lg-c">on</text>
  </g>
  <g data-key="tokNote" data-only="1">
    <text x="450" y="270" class="lg-text lg-c">A token is a word, part of a word, or a punctuation mark.</text>
    <text x="450" y="296" class="lg-text lg-c">A word can be cut into pieces: “Kittens” → “Kit” + “tens”.</text>
  </g>
  <g data-key="ids" data-only="1">
    <text x="215" y="212" class="lg-id lg-c">48213</text>
    <text x="305" y="212" class="lg-id lg-c">1023</text>
    <text x="405" y="212" class="lg-id lg-c">27591</text>
    <text x="505" y="212" class="lg-id lg-c">1186</text>
    <text x="580" y="212" class="lg-small">← ID in the vocabulary</text>
    <text x="450" y="280" class="lg-text lg-c">Each token has its own ID in the model's vocabulary. The IDs here are made up:</text>
    <text x="450" y="306" class="lg-text lg-c">a real model's vocabulary holds tens or hundreds of thousands of tokens.</text>
  </g>

  <!-- 4. training tasks from one phrase -->
  <g data-key="tasks" data-only="1">
    <text x="450" y="50" class="lg-title lg-c">Training task: guess the next token</text>
    <text x="450" y="78" class="lg-small lg-c">a line from the training texts: “Kittens sit on chairs”</text>
    <rect x="150" y="98" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="118" class="lg-text" dominant-baseline="middle">Kit</text>
    <path d="M492 118 L560 118" class="lg-arrow" />
    <rect x="572" y="98" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="118" class="lg-bold lg-c">tens</text>
    <rect x="150" y="148" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="168" class="lg-text" dominant-baseline="middle">Kit | tens</text>
    <path d="M492 168 L560 168" class="lg-arrow" />
    <rect x="572" y="148" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="168" class="lg-bold lg-c">sit</text>
    <rect x="150" y="198" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="218" class="lg-text" dominant-baseline="middle">Kit | tens | sit</text>
    <path d="M492 218 L560 218" class="lg-arrow" />
    <rect x="572" y="198" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="218" class="lg-bold lg-c">on</text>
    <rect x="150" y="248" width="330" height="40" rx="8" class="lg-tok" /><text x="166" y="268" class="lg-text" dominant-baseline="middle">Kit | tens | sit | on</text>
    <path d="M492 268 L560 268" class="lg-arrow" />
    <rect x="572" y="248" width="130" height="40" rx="8" class="lg-tok-g" /><text x="637" y="268" class="lg-bold lg-c">chairs</text>
    <text x="315" y="312" class="lg-small lg-c">what the model sees</text>
    <text x="637" y="312" class="lg-small lg-c">correct answer</text>
    <text x="450" y="352" class="lg-text lg-c">One line gives four tasks at once. The answer is already in the text itself.</text>
  </g>

  <!-- 5. context -->
  <g data-key="ask" data-only="1">
    <rect x="600" y="124" width="120" height="66" rx="10" class="lg-tok-r" />
    <text x="660" y="157" style="fill:#C30B0A" class="lg-big lg-c">?</text>
  </g>
  <g data-key="arcs" data-only="1">
    <path d="M215 186 Q430 300 640 194" class="lg-arc" />
    <path d="M305 186 Q470 280 650 194" class="lg-arc" />
    <path d="M405 186 Q530 262 658 194" class="lg-arc" />
    <path d="M505 186 Q580 240 666 194" class="lg-arc" />
    <text x="450" y="318" class="lg-text lg-c">To choose a continuation, the model takes into account all tokens on the left,</text>
    <text x="450" y="344" class="lg-text lg-c">not only the last word “on”.</text>
  </g>

  <!-- 6. probabilities -->
  <g data-key="probs" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">The model estimates possible continuations</text>
    <text x="450" y="86" class="lg-text lg-c">“Kittens sit on …”</text>
    <text x="250" y="132" class="lg-bold" text-anchor="end">chairs</text>
    <rect x="265" y="114" width="300" height="26" rx="5" fill="#73B222" fill-opacity="0.85" />
    <text x="575" y="132" class="lg-bold">0.45</text>
    <text x="250" y="178" class="lg-bold" text-anchor="end">sofas</text>
    <rect x="265" y="160" width="200" height="26" rx="5" fill="#3576C0" fill-opacity="0.85" />
    <text x="475" y="178" class="lg-bold">0.30</text>
    <text x="250" y="224" class="lg-bold" text-anchor="end">roofs</text>
    <rect x="265" y="206" width="113" height="26" rx="5" fill="#C29E08" fill-opacity="0.85" />
    <text x="388" y="224" class="lg-bold">0.17</text>
    <text x="250" y="270" class="lg-bold" text-anchor="end">floors</text>
    <rect x="265" y="252" width="53" height="26" rx="5" fill="#8E8A82" fill-opacity="0.85" />
    <text x="328" y="270" class="lg-bold">0.08</text>
    <text x="450" y="330" class="lg-text lg-c">For every token in the vocabulary the model outputs a probability. Shown here are</text>
    <text x="450" y="354" class="lg-text lg-c">the four most likely ones; together they add up to 1.</text>
  </g>

  <!-- 7. choice -->
  <g data-key="picked" data-only="1">
    <rect x="550" y="130" width="100" height="54" rx="9" class="lg-tok-g" />
    <text x="600" y="157" class="lg-bold lg-c">chairs</text>
    <rect x="660" y="130" width="60" height="54" rx="9" class="lg-tok-r" />
    <text x="690" y="157" style="fill:#C30B0A" class="lg-bold lg-c">?</text>
    <text x="450" y="252" class="lg-text lg-c">New input: “Kittens sit on chairs”.</text>
    <text x="450" y="280" class="lg-text lg-c">The model computes the probabilities again, now for the next token.</text>
  </g>

  <!-- 8. loop -->
  <g data-key="loop" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">The answer grows one token at a time</text>
    <rect x="130" y="80" width="640" height="200" rx="12" class="lg-tok-y" />
    <text x="160" y="116" class="lg-small">step 1</text>
    <text x="240" y="116" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#4E8A12">chairs</tspan></text>
    <text x="160" y="160" class="lg-small">step 2</text>
    <text x="240" y="160" class="lg-text">Kittens sit on chairs <tspan font-weight="800" fill="#4E8A12">near</tspan></text>
    <text x="160" y="204" class="lg-small">step 3</text>
    <text x="240" y="204" class="lg-text">Kittens sit on chairs near <tspan font-weight="800" fill="#4E8A12">windows</tspan></text>
    <text x="160" y="248" class="lg-small">step 4</text>
    <text x="240" y="248" class="lg-text">Kittens sit on chairs near windows<tspan font-weight="800" fill="#4E8A12">.</tspan></text>
    <text x="620" y="248" class="lg-small">period: end of answer</text>
    <text x="450" y="322" class="lg-bold lg-c">predict → append → repeat</text>
    <text x="450" y="350" class="lg-text lg-c">The model does not write the whole answer at once: each token needs a new pass.</text>
  </g>

  <!-- 9. sampling -->
  <g data-key="sample" data-only="1">
    <text x="450" y="54" class="lg-title lg-c">Six runs on the same beginning</text>
    <text x="110" y="100" class="lg-small">run 1</text><text x="190" y="100" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#4E8A12">chairs</tspan></text>
    <text x="110" y="134" class="lg-small">run 2</text><text x="190" y="134" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#4E8A12">chairs</tspan></text>
    <text x="110" y="168" class="lg-small">run 3</text><text x="190" y="168" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#A38404">roofs</tspan></text>
    <text x="110" y="202" class="lg-small">run 4</text><text x="190" y="202" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#4E8A12">chairs</tspan></text>
    <text x="110" y="236" class="lg-small">run 5</text><text x="190" y="236" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#3576C0">sofas</tspan></text>
    <text x="110" y="270" class="lg-small">run 6</text><text x="190" y="270" class="lg-text">Kittens sit on <tspan font-weight="800" fill="#3576C0">sofas</tspan></text>
    <line x1="470" y1="82" x2="470" y2="282" stroke="#3576C0" stroke-opacity="0.25" />
    <text x="500" y="100" class="lg-small">word</text><text x="640" y="100" class="lg-small">count</text><text x="740" y="100" class="lg-small">probability</text>
    <text x="500" y="140" class="lg-bold">chairs</text><rect x="590" y="126" width="45" height="20" rx="4" fill="#73B222" /><text x="645" y="141" class="lg-bold">3</text><text x="740" y="140" class="lg-text">0.45</text>
    <text x="500" y="180" class="lg-bold">sofas</text><rect x="590" y="166" width="30" height="20" rx="4" fill="#3576C0" /><text x="630" y="181" class="lg-bold">2</text><text x="740" y="180" class="lg-text">0.30</text>
    <text x="500" y="220" class="lg-bold">roofs</text><rect x="590" y="206" width="15" height="20" rx="4" fill="#C29E08" /><text x="615" y="221" class="lg-bold">1</text><text x="740" y="220" class="lg-text">0.17</text>
    <text x="500" y="260" class="lg-bold">floors</text><text x="600" y="261" class="lg-bold">0</text><text x="740" y="260" class="lg-text">0.08</text>
    <text x="450" y="326" class="lg-text lg-c">The token is picked at random with the model's probabilities: “chairs” comes up</text>
    <text x="450" y="350" class="lg-text lg-c">in about 45 runs out of 100, “floors” in 8. That is why the answers differ.</text>
  </g>

  <!-- 10. search engine vs LLM -->
  <g data-key="search" data-only="1">
    <text x="450" y="50" class="lg-title lg-c">A search engine and an LLM work differently</text>
    <rect x="80" y="76" width="350" height="200" rx="14" class="lg-grey" />
    <text x="255" y="104" class="lg-bold lg-c">Search engine</text>
    <text x="255" y="140" class="lg-text lg-c">query</text>
    <path d="M255 152 L255 172" class="lg-arrow" />
    <text x="255" y="190" class="lg-text lg-c">index of existing pages</text>
    <path d="M255 202 L255 222" class="lg-arrow" />
    <text x="255" y="242" class="lg-text lg-c">a page written by a person,</text>
    <text x="255" y="262" class="lg-small lg-c">with a link to the source</text>
    <rect x="470" y="76" width="350" height="200" rx="14" style="fill:#F0F5FB" class="lg-tok" />
    <text x="645" y="104" style="fill:#3576C0" class="lg-bold lg-c">LLM</text>
    <text x="645" y="140" class="lg-text lg-c">beginning of a text</text>
    <path d="M645 152 L645 172" class="lg-arrow" />
    <text x="645" y="190" class="lg-text lg-c">probabilities of the next token</text>
    <path d="M645 202 L645 222" class="lg-arrow" />
    <text x="645" y="242" class="lg-text lg-c">new text, token by token;</text>
    <text x="645" y="262" class="lg-small lg-c">no ready answer in a database</text>
    <rect x="80" y="300" width="740" height="62" rx="12" fill="#FBEDEC" stroke="#C30B0A" stroke-width="1.4" />
    <text x="450" y="322" style="fill:#C30B0A" class="lg-bold lg-c">Likely text can sound convincing and still contain an error.</text>
    <text x="450" y="346" class="lg-text lg-c">Check facts, numbers, laws, medicine, and technical details.</text>
  </g>
</svg>
  </div>

  <div class="stage-bar">
    <button type="button" data-nav="prev">← Back</button>
    <button type="button" data-nav="next">Next →</button>
    <div class="stage-progress"></div>
    <div class="stage-counter"></div>
  </div>

  <div class="stage-notes">
    <div class="step-panel" data-on="t1 phrase" data-focus="phrase">
      <div class="step-kicker">Step 1 · beginning of a text</div>
      <h4>The model gets the phrase “Kittens sit on …”</h4>
      <p>It has to be continued. But the model works only with numbers, so the string of characters
      first has to be turned into numbers.</p>
    </div>
    <div class="step-panel" data-on="t2 tokens tokNote" data-focus="tokens">
      <div class="step-kicker">Step 2 · tokens</div>
      <h4>The phrase is split into tokens</h4>
      <p>A token can be a word, part of a word, or a punctuation mark. Here “Kittens” fell apart into
      two pieces, “Kit” and “tens,” while “sit” and “on” stayed whole words.</p>
    </div>
    <div class="step-panel" data-on="t3 tokens ids" data-focus="ids">
      <div class="step-kicker">Step 3 · IDs</div>
      <h4>Each token gets an ID</h4>
      <p>The ID comes from the model's vocabulary: “Kit” → 48213, “tens” → 1023, “sit” → 27591, “on” → 1186.
      The IDs are made up; in a real model they depend on its vocabulary of tens or hundreds
      of thousands of tokens. From here on the model works with these numbers.</p>
    </div>
    <div class="step-panel" data-on="tasks" data-focus="tasks">
      <div class="step-kicker">Step 4 · training task</div>
      <h4>Predict the next token from the previous ones</h4>
      <p>The model is trained on a huge amount of text. Each line turns into a set of tasks:
      from “Kit” guess “tens,” from “Kit tens” guess “sit,” and so on. The correct answer is always
      the next token of the same text, so there is no need to label the data by hand.</p>
    </div>
    <div class="step-panel" data-on="t5 tokens ask arcs" data-focus="arcs">
      <div class="step-kicker">Step 5 · context</div>
      <h4>The model looks at all previous tokens</h4>
      <p>To estimate the next token, the model takes the whole context on the left into account. After “on” anything
      could follow, but “Kittens sit on” narrows the choice to places where cats sit.</p>
    </div>
    <div class="step-panel" data-on="probs" data-focus="probs">
      <div class="step-kicker">Step 6 · probabilities</div>
      <h4>The model estimates possible continuations</h4>
      <p>At the output it gives a probability for every token in the vocabulary: “chairs” 0.45, “sofas” 0.30,
      “roofs” 0.17, “floors” 0.08. These are exactly the probabilities the model was trained on in step 4: the correct
      answer from the text should get a high probability.</p>
    </div>
    <div class="step-panel" data-on="t7 tokens picked" data-focus="picked">
      <div class="step-kicker">Step 7 · choosing a token</div>
      <h4>One token is added to the text</h4>
      <p>One of the options is chosen, for example “chairs,” and goes to the end of the phrase. Now the input is
      “Kittens sit on chairs,” and the model estimates the probabilities for the next token again.</p>
    </div>
    <div class="step-panel" data-on="loop" data-focus="loop">
      <div class="step-kicker">Step 8 · generation</div>
      <h4>The answer is assembled token by token</h4>
      <p>Predict, append, repeat: this is how “near,” “windows,” and the period appear. The loop runs until
      the model outputs an end-of-answer token. Each new token requires a new pass over the whole
      text.</p>
    </div>
    <div class="step-panel" data-on="sample" data-focus="sample">
      <div class="step-kicker">Step 9 · random choice</div>
      <h4>The same question, different answers</h4>
      <p>The model does not have to take the most likely token every time. Often the token is picked at random,
      with the model's probabilities. Six runs on the same beginning gave: “chairs” 3 times, “sofas”
      2 times, “roofs” once. That is why the model can answer the same question in different ways.</p>
    </div>
    <div class="step-panel" data-on="search" data-focus="search">
      <div class="step-kicker">Step 10 · not a search engine</div>
      <h4>An LLM builds text instead of fetching it from a database</h4>
      <p>A search engine finds a page that someone has already written and shows the source. An LLM assembles
      new text from token probabilities. A likely continuation can sound convincing and still
      contain an error, so facts, numbers, laws, medicine, and technical details need to be
      checked.</p>
    </div>
  </div>
</div>
<p class="stage-hint">Focus the scene and use the ← → arrow keys to step through it.</p>

## Why is the learning called deep?

“Depth” here is almost literal: it is the number of layers in a neural network. A simple network may have one or a few layers. A deep network has dozens, hundreds, or sometimes even more computational blocks.

Each layer turns the data into a new representation. In computer vision, the first layers may respond to simple elements: edges, corners, color blobs. The next layers assemble shapes from them. Deeper layers recognize parts of objects. And only closer to the output does a high-level representation appear: “looks like a cat,” “looks like a car,” “looks like a face.”

With text the idea is similar: early levels work with tokens and local connections, while deeper blocks help the model build more complex dependencies between words, phrases, and units of meaning in the text.

This hierarchy of representations is what makes deep learning so powerful. The model is not given its features entirely by hand. It builds them gradually by itself, from simple to more abstract.

## Summary

Putting it all together:

- artificial intelligence: an attempt to reproduce intelligent behavior in a machine;
- machine learning: the modern approach within AI, where the machine learns from data instead of having its rules listed by hand;
- deep learning: the part of machine learning based on multi-layer neural networks;
- computer vision teaches a model to understand images as numeric matrices;
- large language models work with text as a sequence of tokens and learn to predict the next token.

Modern AI is strong not because a programmer wrote all the rules in advance, but because a model can find complex patterns in data and apply them to new situations.
