We often say “artificial intelligence,” but this term mixes several ideas at once: human intelligence, hand-written rules, machine learning, deep neural networks, computer vision, and large language models. In this article, we will move step by step from intuition to how a model learns from data and why LLMs can generate text.

## Human intelligence

When we recognize friends by their voice, read between the lines, drive a car, or solve a new problem for the first time, we use intelligence. In simple terms, intelligence is the ability to learn from experience, notice patterns, and make decisions in situations where there is no explicit instruction written in advance.

The important point is that we are not taught everything through formal rules. Nobody gives a child an instruction manual called “how to recognize a cat.” A child sees several cats, notices recurring features, and gradually learns to distinguish a cat from a dog, a toy, or a random patch in an image.

## Artificial intelligence — why “artificial”?

“Artificial” means created by humans, not by nature. It is an attempt to reproduce intelligent behavior in a machine: to see, hear, speak, reason, choose actions, and adapt to new information.

The word does not mean “fake.” It means “human-made,” like an artificial satellite or artificial material. The system’s behavior may look intelligent, but its source is different: not biological evolution, but mathematics, data, engineering, and computation.

## Areas of AI and why everyone talks about machine learning now

AI is a broad field. It includes different approaches. In older systems, programmers described rules manually: “if an object has four legs, a tail, and barks, then it is a dog.” Such systems are called expert systems or rule-based systems.

But most real-world tasks are too complex to describe manually. We cannot list every possible face, voice, road situation, writing style, or photo of a cat. This is why modern AI mostly relies on machine learning: instead of writing all rules ourselves, we show the machine data so it can find patterns.

Inside machine learning, there is deep learning — an approach based on multilayer neural networks. Deep learning is the foundation of large language models, computer vision, speech recognition, and many modern recommender systems.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <!-- Header -->
  <text id="mainTitle" x="32" y="36" class="title">Step 1. What is artificial intelligence?</text>
  <text id="mainSubtitle" x="32" y="64" class="subtitle">AI is a broad class of systems that imitate intelligent behavior</text>
  <rect x="640" y="20" width="230" height="58" class="step-pill" />
  <text id="stepCounter" x="660" y="43" class="step-top">Step 1 of 6</text>
  <text id="stepName" x="660" y="65" class="step-bottom">Artificial intelligence</text>
  <!-- Outer blue rectangle: increased vertically -->
  <rect x="40" y="112" width="830" height="340" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="555" y="474" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="606" y="493" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="715" y="494" class="title center">1 / 6</text>
  <rect id="nextBtn" x="768" y="474" width="102" height="38" class="btn" />
  <text x="819" y="493" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const aiOnly = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">Any system that tries to imitate intelligent behavior</text>
    `;
    const aiMl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">A broad umbrella for different approaches</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Machine learning</text>
      <text x="180" y="252" class="box-sub-ml">Learns from data, not from hand-written rules</text>
    `;
    const aiMlDl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">A broad umbrella for different approaches</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Machine learning</text>
      <text x="180" y="252" class="box-sub-ml">Learns from data, not from hand-written rules</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="287" class="box-title-dl">Deep learning</text>
      <text x="232" y="309" class="box-sub-dl">Multilayer neural networks</text>
    `;
    const aiMlDlModels = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">A broad umbrella for different approaches</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Machine learning</text>
      <text x="180" y="252" class="box-sub-ml">Learns from data, not from hand-written rules</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Deep learning</text>
      <text x="232" y="307" class="box-sub-dl">Multilayer neural networks</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">text</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">vision</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Speech</text>
      <text x="503" y="350" class="mini-sub center">audio</text>
    `;
    const fullDiagram = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Artificial intelligence</text>
      <text x="125" y="186" class="box-sub-ai">A broad umbrella for different approaches</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Machine learning</text>
      <text x="180" y="252" class="box-sub-ml">Learns from data, not from hand-written rules</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Deep learning</text>
      <text x="232" y="307" class="box-sub-dl">Multilayer neural networks</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">text</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">vision</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Speech</text>
      <text x="503" y="350" class="mini-sub center">audio</text>
      <rect x="645" y="174" width="135" height="52" class="side-box" />
      <text x="712.5" y="194" class="side-title center">Expert</text>
      <text x="712.5" y="215" class="side-title center">systems</text>
      <rect x="645" y="246" width="135" height="52" class="side-box" />
      <text x="712.5" y="266" class="side-title center">Logical</text>
      <text x="712.5" y="287" class="side-title center">rules</text>
      <rect x="645" y="318" width="135" height="52" class="side-box" />
      <text x="712.5" y="338" class="side-title center">Search</text>
      <text x="712.5" y="359" class="side-title center">and planning</text>
    `;
    const steps = [
      {
        title: "Step 1. What is artificial intelligence?",
        subtitle: "AI is a broad class of systems that imitate intelligent behavior",
        name: "Artificial intelligence",
        scene: `
          ${aiOnly}
          <rect x="95" y="128" width="710" height="252" class="highlight-ai" />
          <text x="450" y="398" class="explain center">AI is the broadest level.</text>
          <text x="450" y="416" class="explain-small center">It includes different ways to make systems solve intelligent tasks.</text>
        `
      },
      {
        title: "Step 2. Machine learning appears inside AI",
        subtitle: "This is an approach where a system learns from data",
        name: "Machine learning",
        scene: `
          ${aiMl}
          <rect x="150" y="194" width="470" height="182" class="highlight-ml" />
          <text x="450" y="398" class="explain center">Machine learning is part of AI.</text>
          <text x="450" y="416" class="explain-small center">Instead of hand-written rules, the model searches for patterns in data.</text>
        `
      },
      {
        title: "Step 3. Deep learning sits inside ML",
        subtitle: "This is machine learning based on multilayer neural networks",
        name: "Deep learning",
        scene: `
          ${aiMlDl}
          <rect x="202" y="258" width="370" height="105" class="highlight-dl" />
          <text x="450" y="398" class="explain center">Deep learning is part of machine learning.</text>
          <text x="450" y="416" class="explain-small center">It uses neural networks with many layers.</text>
        `
      },
      {
        title: "Step 4. Different models live inside deep learning",
        subtitle: "For example: models for text, images, and speech",
        name: "LLM / CNN / speech",
        scene: `
          ${aiMlDlModels}
          <text x="450" y="398" class="explain center">Different models solve different tasks.</text>
          <text x="450" y="416" class="explain-small center">LLMs handle text, CNNs handle vision, speech models handle audio.</text>
        `
      },
      {
        title: "Step 5. AI is not only ML",
        subtitle: "AI also includes rule-based systems, search, and planning",
        name: "Other approaches",
        scene: `
          ${fullDiagram}
          <rect x="635" y="168" width="155" height="212" class="highlight-ai" />
          <text x="450" y="398" class="explain center">Not all AI learns from data.</text>
          <text x="450" y="416" class="explain-small center">Expert systems can work with predefined rules.</text>
        `
      },
      {
        title: "Step 6. Final hierarchy",
        subtitle: "Now we can see where LLMs sit inside AI",
        name: "Summary",
        scene: `
          ${fullDiagram}
          <text x="450" y="392" class="explain center">AI ⊃ Machine learning ⊃ Deep learning ⊃ LLM / CNN / speech</text>
          <text x="450" y="414" class="explain-small center">An LLM is not all of AI; it is one branch inside deep learning.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive diagram: AI as an umbrella that contains machine learning, deep learning, and modern models.</figcaption>
</figure>

## Explicit programming and machine learning

The easiest way to understand the difference is through a simple task. Suppose we need to calculate the distance traveled by a car. We know speed and time. This is a classic school formula:

$$S = v \cdot t$$

Here the relationship between inputs and output is completely known. We can simply write a program:

```python
def distance(velocity, time):
    return velocity * time
```

This is explicit programming: a human knows the rule and writes it in code. The machine does not need to learn, because the logic is already defined by the programmer.

Now consider a different task: determine whether a photo contains a cat or a dog. There is no formula for this. We cannot write a reliable rule like `if pixel[3][5] == "whiskers": return "cat"`. Images vary too much: lighting, pose, background, angle, object size, and camera quality all change.

This is where machine learning begins. We show the model many examples of “input → correct answer,” and it adjusts its internal parameters so that it can produce the right answer on new, similar examples.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
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
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
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
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Step 1. There is a simple task</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">We need to find travel time from distance and speed</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Step 1 of 9</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Simple task</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Given</text>
  <text id="dataLine1" x="50" y="152" class="left-text">S = 10 km</text>
  <text id="dataLine2" x="50" y="178" class="left-text">v = 1 km/h</text>
  <text id="dataLine3" x="50" y="204" class="left-text">t = ?</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Goal</text>
  <text id="goalLine1" x="50" y="318" class="left-text">Understand how to get</text>
  <text id="goalLine2" x="50" y="346" class="left-text">the answer: with a formula</text>
  <text id="goalLine3" x="50" y="374" class="left-text">or through learning</text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 9</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Step 1. There is a simple task",
        subtitle: "We need to find travel time from distance and speed",
        name: "Simple task",
        goal: [
          "Understand how to get",
          "the answer: with a formula",
          "or through learning"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Ideal case</text>
          <text x="328" y="154" class="small">Speed is constant. The road is simple.</text>
          <circle cx="350" cy="250" r="6" class="dot" />
          <path d="M350 250 C400 250, 430 214, 480 238 C535 263, 575 208, 628 238 C680 266, 725 250, 820 250" class="route" />
          <circle cx="820" cy="250" r="6" class="dot" />
          <text x="335" y="276" class="small">start</text>
          <text x="797" y="276" class="small">finish</text>
          <line x1="350" y1="318" x2="820" y2="318" stroke="#3576C0" stroke-width="1.5" stroke-opacity="0.7" />
          <line x1="350" y1="311" x2="350" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <line x1="820" y1="311" x2="820" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <text x="585" y="342" class="formula-small center">S = 10 km</text>
        `
      },
      {
        title: "Step 2. In traditional programming",
        subtitle: "We know the rule and give it to the computer",
        name: "Explicit programming",
        goal: [
          "If the rule is known,",
          "a human writes",
          "the formula"
        ],
        scene: `
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
        `
      },
      {
        title: "Step 3. The computer runs the code",
        subtitle: "It runs the formula written by a human",
        name: "Code",
        goal: [
          "A human",
          "writes the formula",
          "in code"
        ],
        scene: `
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
          <text x="584" y="388" class="left-text center">There is no learning here. The computer simply executes a function,</text>
          <text x="584" y="418" class="left-text center">written by a human in advance.</text>
        `
      },
      {
        title: "Step 4. Question",
        subtitle: "Could the computer discover this dependency itself?",
        name: "Question",
        goal: [
          "We move from",
          "a ready-made formula",
          "to learning"
        ],
        scene: `
          <text x="584" y="195" class="title center">How can we make a computer learn?</text>
          <text x="584" y="250" class="formula-small center">Can it discover the rule by itself?</text>
          <text x="584" y="292" class="formula-small center">For example: t depends on S and v</text>
        `
      },
      {
        title: "Step 5. The idea of machine learning",
        subtitle: "Instead of a formula, we give many examples",
        name: "Many examples",
        goal: [
          "We do not write the formula.",
          "We show many",
          "ready examples"
        ],
        scene: `
          <text x="584" y="195" class="title center">We give the computer examples</text>
          <text x="584" y="250" class="formula-small center">It sees inputs and correct answers.</text>
          <text x="584" y="292" class="formula-small center">Then it tries to find a pattern.</text>
        `
      },
      {
        title: "Step 6. Training data",
        subtitle: "Each row is an example the model learns from",
        name: "Training data",
        goal: [
          "Now we have",
          "not one task,",
          "but a set of examples"
        ],
        scene: `
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
        `
      },
      {
        title: "Step 7. The model learns from examples",
        subtitle: "It searches for a dependency between S, v, and t",
        name: "Training",
        goal: [
          "The model tries",
          "to find the hidden",
          "rule"
        ],
        scene: `
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
          <text x="637" y="253" class="small center">searches for a relationship</text>
          <path d="M714 245 L760 245" class="arrow" />
          <rect x="772" y="196" width="44" height="98" class="node-green" />
          <text x="794" y="223" class="node-bold center">t</text>
          <text x="794" y="253" class="small center">answer</text>
          <text x="584" y="380" class="formula-small center">After training, the model roughly understands:</text>
          <text x="584" y="410" class="formula center">t = f(S, v)</text>
        `
      },
      {
        title: "Step 8. Using the trained model",
        subtitle: "Now we can give a new example without a ready answer",
        name: "Prediction",
        goal: [
          "After training",
          "the model receives",
          "new data"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">New example</text>
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
          <text x="584" y="370" class="formula-small center">The model should predict the time.</text>
          <text x="584" y="406" class="formula center">t ≈ 10 h</text>
        `
      },
      {
        title: "Step 9. Main difference",
        subtitle: "In one case a human writes the formula; in the other, the model finds it from data",
        name: "Comparison",
        goal: [
          "Now we can",
          "compare two",
          "approaches"
        ],
        scene: `
          <text x="430" y="146" class="scene-title center">Explicit programming</text>
          <rect x="332" y="172" width="196" height="112" class="node-blue" />
          <text x="430" y="206" class="formula-small center">Data + rule</text>
          <text x="430" y="236" class="formula-small center">→</text>
          <text x="430" y="264" class="formula-small center">Answer</text>
          <text x="430" y="330" class="small center">A human writes the rule in advance.</text>
          <line x1="584" y1="146" x2="584" y2="340" stroke="#3576C0" stroke-width="1.2" stroke-opacity="0.28" />
          <text x="738" y="146" class="scene-title center">Machine learning</text>
          <rect x="640" y="172" width="196" height="112" class="node-yellow" />
          <text x="738" y="206" class="formula-small center">Data + answers</text>
          <text x="738" y="236" class="formula-small center">→</text>
          <text x="738" y="264" class="formula-small center">Model</text>
          <text x="738" y="330" class="small center">The model learns the rule from examples.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("goalLine1").textContent = step.goal[0];
      $("goalLine2").textContent = step.goal[1];
      $("goalLine3").textContent = step.goal[2];
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive visualization: when the rule is known, we program explicitly; when the rule is too complex, we learn from examples.</figcaption>
</figure>

## Why a single formula is often not enough

Even the driving example is more complicated in real life than it first appears. We can estimate travel time with a formula:

$$t = rac{S}{v}$$

But in reality, time depends not only on distance and average speed. There are traffic jams, weather, stops, road quality, traffic lights, driving style, and many other factors. Formally, we could write:

$$t = f(S, v, 	ext{traffic}, 	ext{weather}, 	ext{stops}, \ldots)$$

The problem is that the function `f` is usually hard to write by hand. But we can collect many real trips and let a model approximate this dependency from data.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="480" viewBox="0 0 900 480">
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
    .subtitle {
      font-size: 15px;
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
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
      rx: 14;
    }
    .step-top {
      font-size: 14px;
      font-weight: 700;
      fill: #3576C0;
    }
    .step-bottom {
      font-size: 13px;
      fill: #111111;
    }
    .node-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.6;
      rx: 10;
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
    .node-bold {
      font-size: 15px;
      font-weight: 700;
      fill: #111111;
    }
    .text {
      font-size: 16px;
      fill: #111111;
    }
    .small {
      font-size: 13px;
      fill: #111111;
      opacity: 0.78;
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
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 700;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 700;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <!-- Header -->
  <text id="mainTitle" x="32" y="42" class="title">Oops, Houston, we have a problem</text>
  <text id="mainSubtitle" x="32" y="70" class="subtitle"></text>
  <rect x="668" y="20" width="190" height="58" class="step-pill" />
  <text id="stepCounter" x="688" y="43" class="step-top">Step 1</text>
  <text id="stepName" x="688" y="65" class="step-bottom">Question</text>
  <!-- Scene -->
  <rect x="32" y="100" width="826" height="280" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="542" y="415" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="593" y="434" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="696" y="435" class="formula center">1 / 2</text>
  <rect id="nextBtn" x="756" y="415" width="102" height="38" class="btn" />
  <text x="807" y="434" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Oops, Houston, we have a problem",
        subtitle: "",
        counter: "Step 1",
        name: "Question",
        scene: `
          <text x="445" y="215" class="title center">But is the movement ideal?</text>
          <text x="445" y="265" class="text center">Is the formula t = S / v enough?</text>
        `
      },
      {
        title: "Step 2. Real-world task",
        subtitle: "In real life, there are usually more factors than S and v",
        counter: "Step 2 of 2",
        name: "Answer",
        scene: `
          <text x="445" y="145" class="title center">No, reality is more complex</text>
          <text x="445" y="190" class="text center">Time depends on more than distance and speed.</text>
          <rect x="120" y="230" width="120" height="54" class="node-red" />
          <text x="180" y="257" class="node-bold center">Traffic</text>
          <rect x="280" y="230" width="120" height="54" class="node-red" />
          <text x="340" y="257" class="node-bold center">Weather</text>
          <rect x="440" y="230" width="120" height="54" class="node-red" />
          <text x="500" y="257" class="node-bold center">Stops</text>
          <rect x="600" y="230" width="120" height="54" class="node-red" />
          <text x="660" y="257" class="node-bold center">Road</text>
          <text x="445" y="335" class="formula center">t = f(S, v, traffic, weather, ...)</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = step.counter;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive block: why a simple formula breaks when real-world factors appear.</figcaption>
</figure>

## How does a machine learn?

The word “learning” is not just a metaphor, but it is important to be precise: a machine does not learn exactly like a human. Mathematically, learning means adjusting the parameters of a model so that the error on training examples becomes smaller.

A model has “knobs” — parameters. At the beginning, they may be random. The model makes a prediction, we compare it with the correct answer, calculate the error, and slightly change the parameters in the direction that reduces the error. Then we repeat the process again and again.

In simplified form, the loop looks like this:

1. give data to the model;
2. get a prediction;
3. calculate the error;
4. update the parameters;
5. repeat many times.

After thousands, millions, or billions of such steps, the model becomes better at generalizing patterns from data.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
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
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
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
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Step 1. The model has examples</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">The model learns from trips where the correct answer is known</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Step 1 of 8</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Data</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Given</text>
  <text id="dataLine1" x="50" y="150" class="left-text">many trips</text>
  <text id="dataLine2" x="50" y="176" class="left-text">there are factors</text>
  <text id="dataLine3" x="50" y="202" class="left-text">real t is known</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Goal</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Show how</text>
  <text id="goalLine2" x="50" y="344" class="left-text">the model learns</text>
  <text id="goalLine3" x="50" y="372" class="left-text">step by step</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 8</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Step 1. The model has examples",
        subtitle: "The model learns from trips where the correct answer is known",
        name: "Data",
        data: [
          "many trips",
          "there are factors",
          "real t is known"
        ],
        goal: [
          "Show how",
          "the model learns",
          "step by step",
          ""
        ],
        scene: `
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
          <text x="770" y="185" class="table-head">real t</text>
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
          <text x="584" y="405" class="left-text center">Each row is an example: trip conditions and the correct answer.</text>
        `
      },
      {
        title: "Step 2. The model does not know the rule at first",
        subtitle: "It starts with a rough guess",
        name: "First guess",
        data: [
          "there is a data row",
          "correct t = 14",
          "the model is not trained yet"
        ],
        goal: [
          "Show that",
          "the model initially",
          "makes mistakes",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">We take one example from the table</text>
          <rect x="330" y="185" width="170" height="90" class="node-blue" />
          <text x="415" y="213" class="node-bold center">Example</text>
          <text x="415" y="238" class="small center">S=10, v=1</text>
          <text x="415" y="258" class="small center">traffic + rain</text>
          <path d="M512 230 L565 230" class="arrow" />
          <rect x="578" y="180" width="150" height="100" class="node-yellow" />
          <text x="653" y="210" class="node-bold center">Model</text>
          <text x="653" y="238" class="small center">does not yet know</text>
          <text x="653" y="258" class="small center">the exact relationship</text>
          <path d="M740 230 L790 230" class="arrow" />
          <rect x="802" y="185" width="50" height="90" class="node-green" />
          <text x="827" y="213" class="node-bold center">t</text>
          <text x="827" y="240" class="small center">?</text>
          <text x="584" y="360" class="formula-small center">The first prediction may be inaccurate</text>
          <text x="584" y="400" class="left-text center">For example, the model says t ≈ 11, but the correct answer is 14.</text>
        `
      },
      {
        title: "Step 3. The model makes a prediction",
        subtitle: "It tries to predict the answer for the selected row",
        name: "Prediction",
        data: [
          "example: traffic + rain",
          "real t = 14",
          "prediction t ≈ 11"
        ],
        goal: [
          "Compare",
          "the model prediction",
          "with the real answer",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The model tries to answer</text>
          <rect x="330" y="205" width="145" height="76" class="node-blue" />
          <text x="402.5" y="233" class="node-bold center">Factors</text>
          <text x="402.5" y="258" class="small center">S, v, traffic, rain</text>
          <path d="M488 243 L545 243" class="arrow" />
          <rect x="558" y="198" width="140" height="90" class="node-yellow" />
          <text x="628" y="230" class="node-bold center">Model</text>
          <text x="628" y="258" class="small center">makes a prediction</text>
          <path d="M710 243 L760 243" class="arrow" />
          <rect x="772" y="205" width="80" height="76" class="node-green" />
          <text x="812" y="233" class="node-bold center">Prediction</text>
          <text x="812" y="260" class="formula-small center">11</text>
          <text x="584" y="358" class="formula-small center">Model prediction: 11</text>
          <text x="584" y="398" class="left-text center">But in the training data, the correct answer for this row is 14.</text>
        `
      },
      {
        title: "Step 4. The model sees the error",
        subtitle: "It compares the prediction with the correct answer",
        name: "Error",
        data: [
          "prediction t ≈ 11",
          "real t = 14",
          "there is an error"
        ],
        goal: [
          "Show the idea",
          "of error without",
          "complex math",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">Comparing prediction and correct answer</text>
  <rect x="350" y="195" width="170" height="90" class="node-green" />
  <text x="435" y="225" class="node-bold center">Prediction</text>
  <text x="435" y="255" class="formula-small center">11</text>
  <rect x="635" y="195" width="185" height="90" class="node-blue" />
  <text x="727.5" y="220" class="node-bold center">Correct</text>
  <text x="727.5" y="242" class="node-bold center">answer</text>
  <text x="727.5" y="267" class="formula-small center">14</text>
  <path d="M535 240 L620 240" class="arrow-red" />
  <text x="584" y="345" class="formula-small center">Error: the prediction is below the real answer</text>
  <text x="584" y="390" class="left-text center">The model understands the direction: for these conditions, time should be increased.</text>
`
      },
      {
        title: "Step 5. The model corrects itself a little",
        subtitle: "It changes its rule to make a smaller mistake next time",
        name: "Update",
        data: [
          "error found",
          "the model changes",
          "prediction gets better"
        ],
        goal: [
          "Show that",
          "learning is",
          "gradual correction",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">After the error, the model updates its rule</text>
          <rect x="330" y="200" width="145" height="86" class="node-red" />
          <text x="402.5" y="228" class="node-bold center">Error</text>
          <text x="402.5" y="255" class="small center">prediction was too low</text>
          <path d="M488 243 L545 243" class="arrow-red" />
          <rect x="558" y="190" width="150" height="106" class="node-yellow" />
          <text x="633" y="220" class="node-bold center">Model</text>
          <text x="633" y="248" class="small center">slightly changes</text>
          <text x="633" y="270" class="small center">its rule</text>
          <path d="M720 243 L775 243" class="arrow" />
          <rect x="788" y="200" width="64" height="86" class="node-green" />
          <text x="820" y="228" class="node-bold center">Better</text>
          <text x="820" y="255" class="small center">prediction</text>
          <text x="584" y="365" class="formula-small center">Before: t ≈ 11 → after: t ≈ 12</text>
          <text x="584" y="405" class="left-text center">It is not perfect yet, but the error is smaller.</text>
        `
      },
      {
        title: "Step 6. This repeats many times",
        subtitle: "The model goes through many examples",
        name: "Repetition",
        data: [
          "example after example",
          "error after error",
          "the model improves"
        ],
        goal: [
          "Show the loop",
          "of model training",
          "on many rows",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Training is repetition of one loop</text>
          <rect x="330" y="200" width="120" height="70" class="node-blue" />
          <text x="390" y="226" class="node-bold center">Example</text>
          <text x="390" y="250" class="small center">from data</text>
          <path d="M462 235 L510 235" class="arrow" />
          <rect x="522" y="200" width="120" height="70" class="node-yellow" />
          <text x="582" y="226" class="node-bold center">Prediction</text>
          <text x="582" y="250" class="small center">model</text>
          <path d="M654 235 L702 235" class="arrow" />
          <rect x="714" y="200" width="120" height="70" class="node-red" />
          <text x="774" y="226" class="node-bold center">Error</text>
          <text x="774" y="250" class="small center">comparison</text>
          <path d="M774 285 C750 330, 410 330, 390 285" class="arrow" />
          <text x="584" y="370" class="formula-small center">Example → prediction → error → correction</text>
          <text x="584" y="410" class="left-text center">The more good examples there are, the better the model finds the pattern.</text>
        `
      },
      {
        title: "Step 7. After training, the model understands the relationship",
        subtitle: "Not perfectly, but usefully for new situations",
        name: "Trained model",
        data: [
          "many examples",
          "errors reduced",
          "model trained"
        ],
        goal: [
          "Show the result",
          "of training without",
          "going too deep",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">What did the model roughly understand?</text>
          <rect x="330" y="190" width="140" height="72" class="node-blue" />
          <text x="400" y="218" class="node-bold center">S and v</text>
          <text x="400" y="242" class="small center">base time</text>
          <rect x="510" y="190" width="140" height="72" class="node-red" />
          <text x="580" y="218" class="node-bold center">Traffic</text>
          <text x="580" y="242" class="small center">increase t</text>
          <rect x="690" y="190" width="140" height="72" class="node-red" />
          <text x="760" y="218" class="node-bold center">Rain</text>
          <text x="760" y="242" class="small center">also matters</text>
          <text x="584" y="330" class="formula-small center">The model learned not one formula, but a relationship</text>
          <text x="584" y="375" class="left-text center">It roughly understands: with traffic and rain, time is usually longer.</text>
          <text x="584" y="405" class="left-text center">This knowledge came from data, not from hand-written if-else rules.</text>
        `
      },
      {
        title: "Step 8. Now we can predict",
        subtitle: "For a new trip, the model predicts travel time",
        name: "Application",
        data: [
          "new trip",
          "answer unknown",
          "the model gives a prediction"
        ],
        goal: [
          "Complete the loop",
          "training →",
          "use",
          ""
        ],
        scene: `
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
          <text x="820" y="257" class="small center">prediction</text>
          <text x="584" y="360" class="formula-small center">New data + trained model → prediction</text>
          <text x="584" y="405" class="left-text center">This is how ML replaces many hand-written rules.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive visualization: the model receives examples, makes mistakes, adjusts parameters, and gradually improves its prediction.</figcaption>
</figure>

The simplest example is linear regression. We have points on a graph, and the model tries to draw a line through them. The line is controlled by two parameters: slope and intercept.

$$\hat y = w \cdot x + b$$

At first, the line is almost random, so the error is large. Then the model changes `w` and `b`, and the line gradually rotates and shifts closer to the points. This is learning in its simplest form.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
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
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
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
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Step 1. The real task is more complex</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Time depends on more than distance and speed</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Step 1 of 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Additional factors</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Given</text>
  <text id="dataLine1" x="50" y="150" class="left-text">S = 10 km</text>
  <text id="dataLine2" x="50" y="176" class="left-text">v = 1 km/h</text>
  <text id="dataLine3" x="50" y="202" class="left-text">there are extra factors</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Goal</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Understand why</text>
  <text id="goalLine2" x="50" y="344" class="left-text">ordinary rules</text>
  <text id="goalLine3" x="50" y="372" class="left-text">are not enough</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Step 1. The real task is more complex",
        subtitle: "Time depends on more than distance and speed",
        name: "Additional factors",
        data: [
          "S = 10 km",
          "v = 1 km/h",
          "there are extra factors"
        ],
        goal: [
          "Understand why",
          "ordinary rules",
          "are not enough",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">In reality, the formula t = S / v is not enough</text>
          <rect x="340" y="190" width="110" height="54" class="node-blue" />
          <text x="395" y="217" class="node-bold center">S, v</text>
          <rect x="480" y="190" width="110" height="54" class="node-red" />
          <text x="535" y="217" class="node-bold center">Traffic</text>
          <rect x="620" y="190" width="110" height="54" class="node-red" />
          <text x="675" y="217" class="node-bold center">Weather</text>
          <rect x="760" y="190" width="90" height="54" class="node-red" />
          <text x="805" y="217" class="node-bold center">Road</text>
          <text x="584" y="310" class="formula-small center">t = f(S, v, traffic, weather, road, ...)</text>
          <text x="584" y="360" class="left-text center">The more factors there are, the harder it is to describe all cases manually.</text>
        `
      },
      {
        title: "Step 2. We can write rules manually",
        subtitle: "But the number of conditions grows quickly",
        name: "Many if-else rules",
        data: [
          "S = 10 km",
          "v = 1 km/h",
          "traffic, rain, road"
        ],
        goal: [
          "Show that",
          "manual rules",
          "quickly become complex",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Let’s try to solve it with explicit programming</text>
          <rect x="350" y="175" width="460" height="170" class="node-blue" />
          <text x="380" y="215" class="small">if traffic is heavy → add 40 minutes</text>
          <text x="380" y="245" class="small">if it rains → add 15 minutes</text>
          <text x="380" y="275" class="small">if the road is bad → add 20 minutes</text>
          <text x="380" y="305" class="small">if rush hour and rain → add even more ...</text>
          <text x="584" y="390" class="formula-small center">The number of rules keeps growing</text>
        `
      },
      {
        title: "Step 3. Rules start to conflict",
        subtitle: "One factor can strengthen or weaken another",
        name: "Complex combinations",
        data: [
          "S = 10 km",
          "v = 1 km/h",
          "many combinations"
        ],
        goal: [
          "Understand the problem",
          "of combinations between",
          "factors",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The problem is not only the number of factors</text>
          <rect x="330" y="185" width="130" height="58" class="node-red" />
          <text x="395" y="214" class="node-bold center">Rain</text>
          <rect x="515" y="185" width="130" height="58" class="node-red" />
          <text x="580" y="214" class="node-bold center">Rush hour</text>
          <rect x="700" y="185" width="130" height="58" class="node-red" />
          <text x="765" y="214" class="node-bold center">Roadwork</text>
          <path d="M462 214 L503 214" class="arrow-red" />
          <path d="M647 214 L688 214" class="arrow-red" />
          <text x="584" y="310" class="left-text center">Factors do not work separately; they interact.</text>
          <text x="584" y="345" class="left-text center">For example, rain + rush hour can increase travel time more,</text>
          <text x="584" y="380" class="left-text center">than each factor separately.</text>
        `
      },
      {
        title: "Step 4. Instead of rules, we can collect data",
        subtitle: "Each trip becomes a training example",
        name: "Historical data",
        data: [
          "many trips",
          "factors are known",
          "real t is known"
        ],
        goal: [
          "Replace manual",
          "rules with a large",
          "set of examples",
          ""
        ],
        scene: `
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
          <text x="584" y="400" class="left-text center">Now the answer comes from real experience, not manual rules.</text>
        `
      },
      {
        title: "Step 5. The model searches for patterns",
        subtitle: "It learns from examples where the correct answer is known",
        name: "Training",
        data: [
          "trip factors",
          "real time",
          "many examples"
        ],
        goal: [
          "Show that",
          "the model learns",
          "not a formula, but a relationship",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The model trains on historical data</text>
          <rect x="330" y="210" width="150" height="76" class="node-blue" />
          <text x="405" y="238" class="node-bold center">Data</text>
          <text x="405" y="264" class="small center">S, v, factors, t</text>
          <path d="M492 248 L550 248" class="arrow" />
          <rect x="562" y="200" width="150" height="96" class="node-yellow" />
          <text x="637" y="230" class="node-bold center">Model</text>
          <text x="637" y="258" class="small center">searches for a relationship</text>
          <text x="637" y="278" class="small center">between factors</text>
          <path d="M724 248 L780 248" class="arrow" />
          <rect x="792" y="210" width="60" height="76" class="node-green" />
          <text x="822" y="238" class="node-bold center">t</text>
          <text x="822" y="264" class="small center">answer</text>
          <text x="584" y="360" class="formula-small center">ML: data + answers → model</text>
          <text x="584" y="400" class="left-text center">The model fits the dependency from examples.</text>
        `
      },
      {
        title: "Step 6. Then the model makes a prediction",
        subtitle: "For a new trip, the correct answer is not known in advance",
        name: "Prediction",
        data: [
          "new trip",
          "there are factors",
          "t unknown"
        ],
        goal: [
          "Show how",
          "trained model",
          "is used later",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Using the model on a new situation</text>
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
          <text x="822" y="264" class="small center">prediction</text>
          <text x="584" y="360" class="formula-small center">New data + model → prediction</text>
          <text x="584" y="400" class="left-text center">The model does not know the future, but estimates it from past experience.</text>
        `
      },
      {
        title: "Step 7. Why ML is needed here",
        subtitle: "ML is useful when the dependency is complex, but there are many examples",
        name: "Takeaway",
        data: [
          "many factors",
          "many examples",
          "prediction needed"
        ],
        goal: [
          "Formulate",
          "the main reason",
          "for using ML",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">When is ML better than manual rules?</text>
          <rect x="330" y="180" width="150" height="70" class="node-red" />
          <text x="405" y="210" class="node-bold center">Many</text>
          <text x="405" y="233" class="small center">factors</text>
          <rect x="505" y="180" width="150" height="70" class="node-yellow" />
          <text x="580" y="210" class="node-bold center">Complex</text>
          <text x="580" y="233" class="small center">dependency</text>
          <rect x="680" y="180" width="150" height="70" class="node-green" />
          <text x="755" y="210" class="node-bold center">There is</text>
          <text x="755" y="233" class="small center">data history</text>
          <text x="584" y="320" class="formula-small center">ML is needed when the rule is hard to write manually,</text>
          <text x="584" y="360" class="formula-small center">but we can show many examples.</text>
          <text x="584" y="410" class="left-text center">The model learns from the past and predicts new cases.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive visualization: how a model adjusts line parameters step by step and reduces error.</figcaption>
</figure>

## How does a computer see the world?

A computer has no eyes in the human sense. For it, an image is a table of numbers. In a grayscale image, each pixel can be represented by one number: 0 is black, 255 is white, and values in between are shades of gray.

A color image usually has three channels: R, G, and B. Each pixel stores three numbers: how much red, green, and blue it contains.

A computer does not see a “cat” immediately. At the input, it only has a grid of numbers. The task of computer vision is to train a model to find combinations of pixels that correspond to meaningful objects: faces, cars, letters, medical images, or cats.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
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
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .pixel {
      stroke: #ffffff;
      stroke-width: 0.7;
    }
    .shape {
      fill: none;
      stroke: #3576C0;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .shape-green {
      fill: none;
      stroke: #73B222;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .shape-red {
      fill: none;
      stroke: #C30B0A;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .bar-blue {
      fill: #3576C0;
      opacity: 0.82;
    }
    .bar-green {
      fill: #73B222;
      opacity: 0.82;
    }
    .bar-yellow {
      fill: #C29E08;
      opacity: 0.82;
    }
    .bar-red {
      fill: #C30B0A;
      opacity: 0.82;
    }
    .num {
      font-family: "Courier New", Courier, monospace;
      font-size: 12px;
      fill: #111111;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Step 1. The computer receives an image</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">For a computer, an image is not an object, but a set of numbers</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Step 1 of 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Pixels</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Given</text>
  <text id="dataLine1" x="50" y="150" class="left-text">image</text>
  <text id="dataLine2" x="50" y="176" class="left-text">pixel grid</text>
  <text id="dataLine3" x="50" y="202" class="left-text">numbers 0–255</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Goal</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Understand how</text>
  <text id="goalLine2" x="50" y="344" class="left-text">computer</text>
  <text id="goalLine3" x="50" y="372" class="left-text">sees an image</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Step 1. The computer receives an image",
        subtitle: "For a computer, an image is not an object, but a set of numbers",
        name: "Pixels",
        data: [
  "image",
  "RGB pixels",
  "numbers 0–255"
],
      goal: [
  "Understand that",
  "an image for",
  "a computer is numbers",
  ""
],
        scene: `
  <text x="328" y="130" class="scene-title">For a computer, a color image is three channels</text>
  <!-- RGB pixel image -->
  <g transform="translate(325,175)">
    <rect x="0" y="0" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="24" y="0" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="48" y="0" width="24" height="24" class="pixel" fill="#E9D86A"/>
    <rect x="72" y="0" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="96" y="0" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="0" y="24" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="24" y="24" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="48" y="24" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="72" y="24" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="96" y="24" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="0" y="48" width="24" height="24" class="pixel" fill="#3576C0"/>
    <rect x="24" y="48" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="48" y="48" width="24" height="24" class="pixel" fill="#C30B0A"/>
    <rect x="72" y="48" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="96" y="48" width="24" height="24" class="pixel" fill="#3576C0"/>
    <rect x="0" y="72" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="24" y="72" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="48" y="72" width="24" height="24" class="pixel" fill="#73B222"/>
    <rect x="72" y="72" width="24" height="24" class="pixel" fill="#C29E08"/>
    <rect x="96" y="72" width="24" height="24" class="pixel" fill="#D98A62"/>
    <rect x="0" y="96" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="24" y="96" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="48" y="96" width="24" height="24" class="pixel" fill="#E9D86A"/>
    <rect x="72" y="96" width="24" height="24" class="pixel" fill="#F0C86A"/>
    <rect x="96" y="96" width="24" height="24" class="pixel" fill="#F4B6A6"/>
    <rect x="0" y="0" width="120" height="120" fill="none" stroke="#3576C0" stroke-width="2"/>
  </g>
  <text x="470" y="240" class="formula center">=</text>
  <!-- R -->
  <rect x="520" y="170" width="95" height="60" class="node-red" />
  <text x="567.5" y="194" class="node-bold center">R</text>
  <text x="567.5" y="216" class="small center">red</text>
  <!-- G -->
  <rect x="640" y="170" width="95" height="60" class="node-green" />
  <text x="687.5" y="194" class="node-bold center">G</text>
  <text x="687.5" y="216" class="small center">green</text>
  <!-- B -->
  <rect x="760" y="170" width="95" height="60" class="node-blue" />
  <text x="807.5" y="194" class="node-bold center">B</text>
  <text x="807.5" y="216" class="small center">blue</text>
  <text x="687.5" y="285" class="formula-small center">each pixel = [R, G, B]</text>
  <text x="584" y="350" class="left-text center">A computer sees a color image as three numerical layers.</text>
  <text x="584" y="380" class="left-text center">For example, one pixel can be written as [195, 11, 10].</text>
  <text x="584" y="410" class="left-text center">So at first, the image is not a “cat”; it is numbers.</text>
`
      },
      {
        title: "Step 2. A color image has several channels",
        subtitle: "Each pixel stores three numbers: R, G, and B",
        name: "RGB",
        data: [
          "color pixel",
          "R + G + B",
          "three matrices"
        ],
        goal: [
          "Show that",
          "color is also",
          "numbers",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">A color image is built from three channels</text>
  <text x="584" y="170" class="formula-small center">R + G + B = image</text>
  <!-- Top row -->
  <rect x="335" y="195" width="90" height="54" class="node-red" />
  <text x="380" y="218" class="node-bold center">R</text>
  <text x="380" y="238" class="small center">red</text>
  <text x="447" y="224" class="formula-small center">+</text>
  <rect x="470" y="195" width="90" height="54" class="node-green" />
  <text x="515" y="218" class="node-bold center">G</text>
  <text x="515" y="238" class="small center">green</text>
  <text x="582" y="224" class="formula-small center">+</text>
  <rect x="605" y="195" width="90" height="54" class="node-blue" />
  <text x="650" y="218" class="node-bold center">B</text>
  <text x="650" y="238" class="small center">blue</text>
  <text x="717" y="224" class="formula-small center">=</text>
  <!-- Summarycolor image -->
  <g transform="translate(750,190)">
    <rect x="0" y="0" width="22" height="22" class="pixel" fill="#F4B6A6"/>
    <rect x="22" y="0" width="22" height="22" class="pixel" fill="#F0C86A"/>
    <rect x="44" y="0" width="22" height="22" class="pixel" fill="#E9D86A"/>
    <rect x="0" y="22" width="22" height="22" class="pixel" fill="#3576C0"/>
    <rect x="22" y="22" width="22" height="22" class="pixel" fill="#73B222"/>
    <rect x="44" y="22" width="22" height="22" class="pixel" fill="#C30B0A"/>
    <rect x="0" y="44" width="22" height="22" class="pixel" fill="#D98A62"/>
    <rect x="22" y="44" width="22" height="22" class="pixel" fill="#C29E08"/>
    <rect x="44" y="44" width="22" height="22" class="pixel" fill="#73B222"/>
    <rect x="0" y="0" width="66" height="66" fill="none" stroke="#3576C0" stroke-width="2"/>
  </g>
  <!-- Lower matrices -->
  <!-- R matrix -->
  <text x="380" y="292" class="node-bold center">R</text>
  <rect x="330" y="305" width="100" height="85" class="node-red" />
  <text x="380" y="330" class="num center">195 240 233</text>
  <text x="380" y="352" class="num center">53 115 195</text>
  <text x="380" y="374" class="num center">217 194 115</text>
  <!-- G matrix -->
  <text x="515" y="292" class="node-bold center">G</text>
  <rect x="465" y="305" width="100" height="85" class="node-green" />
  <text x="515" y="330" class="num center">11 40 56</text>
  <text x="515" y="352" class="num center">118 178 11</text>
  <text x="515" y="374" class="num center">102 158 178</text>
  <!-- B matrix -->
  <text x="650" y="292" class="node-bold center">B</text>
  <rect x="600" y="305" width="100" height="85" class="node-blue" />
  <text x="650" y="330" class="num center">10 22 44</text>
  <text x="650" y="352" class="num center">192 34 10</text>
  <text x="650" y="374" class="num center">98 45 34</text>
  <text x="584" y="418" class="left-text center">Each channel is a separate matrix of numbers.</text>
`
      },
      {
        title: "Step 3. Early layers look for simple features",
        subtitle: "For example, edges, lines, and contrasts",
        name: "Edges",
        data: [
          "pixels",
          "contrasts",
          "edges and lines"
        ],
        goal: [
          "Show that",
          "the model initially",
          "looks for simple shapes",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">In early layers, the model looks for edges</text>
          <rect x="335" y="185" width="100" height="90" class="node-blue" />
          <line x1="355" y1="215" x2="415" y2="215" class="shape" />
          <line x1="355" y1="240" x2="415" y2="240" class="shape" />
          <text x="385" y="305" class="small center">horizontal</text>
          <rect x="470" y="185" width="100" height="90" class="node-blue" />
          <line x1="500" y1="205" x2="500" y2="255" class="shape" />
          <line x1="540" y1="205" x2="540" y2="255" class="shape" />
          <text x="520" y="305" class="small center">vertical</text>
          <rect x="605" y="185" width="100" height="90" class="node-blue" />
          <line x1="625" y1="255" x2="685" y2="205" class="shape" />
          <text x="655" y="305" class="small center">diagonal</text>
          <rect x="740" y="185" width="100" height="90" class="node-blue" />
          <line x1="760" y1="205" x2="820" y2="255" class="shape" />
          <line x1="820" y1="205" x2="760" y2="255" class="shape" />
          <text x="790" y="305" class="small center">angle</text>
          <text x="584" y="375" class="left-text center">The model does not understand “cat” yet. It sees simple visual signals:</text>
          <text x="584" y="405" class="left-text center">boundaries, color transitions, lines, and angles.</text>
        `
      },
      {
        title: "Step 4. Simple features combine into shapes",
        subtitle: "Lines and edges start forming more meaningful figures",
        name: "Shapes",
        data: [
          "edges and lines",
          "combine",
          "shapes appear"
        ],
        goal: [
          "Show the transition",
          "from edges",
          "to shapes",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The next layers assemble shapes</text>
          <rect x="340" y="185" width="105" height="90" class="node-yellow" />
          <circle cx="392.5" cy="230" r="26" class="shape" />
          <text x="392.5" y="305" class="small center">circle</text>
          <rect x="485" y="185" width="105" height="90" class="node-yellow" />
          <rect x="515" y="205" width="45" height="45" class="shape" />
          <text x="537.5" y="305" class="small center">square</text>
          <rect x="630" y="185" width="105" height="90" class="node-yellow" />
          <path d="M657 250 L682 205 L707 250 Z" class="shape" />
          <text x="682.5" y="305" class="small center">triangle</text>
          <text x="584" y="370" class="formula-small center">edges → shapes</text>
          <text x="584" y="410" class="left-text center">The model gradually moves from separate lines to simple parts of the image.</text>
        `
      },
      {
        title: "Step 5. Shapes combine into object parts",
        subtitle: "For example: eyes, ears, nose, paws",
        name: "Parts",
        data: [
          "simple shapes",
          "patterns",
          "object parts"
        ],
        goal: [
          "Show how",
          "shapes become",
          "object parts",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Deeper layers look for object parts</text>
          <rect x="330" y="185" width="105" height="90" class="node-green" />
          <path d="M382 203 L410 255 L354 255 Z" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="382.5" y="305" class="small center">ear</text>
          <rect x="465" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="517.5" cy="230" rx="28" ry="18" class="shape-green" />
          <circle cx="517.5" cy="230" r="7" fill="#73B222" />
          <text x="517.5" y="305" class="small center">eye</text>
          <rect x="600" y="185" width="105" height="90" class="node-green" />
          <circle cx="652.5" cy="225" r="6" fill="#73B222" />
          <line x1="652.5" y1="225" x2="620" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="620" y2="240" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="240" class="shape-green" />
          <text x="652.5" y="305" class="small center">whiskers</text>
          <rect x="735" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="787.5" cy="245" rx="26" ry="14" class="shape-green" />
          <circle cx="767" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="787" cy="214" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="807" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="787.5" y="305" class="small center">paw</text>
          <text x="584" y="375" class="left-text center">Nobody manually tells the model: “this is an ear.”</text>
          <text x="584" y="405" class="left-text center">During training, it finds useful recognition features itself.</text>
        `
      },
      {
        title: "Step 6. Object parts produce the final answer",
        subtitle: "The model combines features and estimates what is shown in the image",
        name: "Classification",
        data: [
          "object parts",
          "combined together",
          "the model gives an answer"
        ],
        goal: [
          "Show the final step:",
          "from features",
          "we get a class",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The final layer gives class probabilities</text>
          <rect x="340" y="170" width="170" height="160" class="node-green" />
          <path d="M395 220 L410 190 L425 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <path d="M430 220 L445 190 L460 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <ellipse cx="427.5" cy="240" rx="45" ry="35" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="410" cy="235" r="4" fill="#111111"/>
          <circle cx="445" cy="235" r="4" fill="#111111"/>
          <path d="M420 252 Q428 260 436 252" fill="none" stroke="#73B222" stroke-width="2"/>
          <text x="425" y="305" class="node-bold center">cat features</text>
          <text x="570" y="190" class="left-text">cat</text>
          <rect x="630" y="176" width="190" height="18" rx="4" class="bar-green"/>
          <text x="830" y="190" class="small">0.93</text>
          <text x="570" y="230" class="left-text">dog</text>
          <rect x="630" y="216" width="36" height="18" rx="4" class="bar-blue"/>
          <text x="680" y="230" class="small">0.04</text>
          <text x="570" y="270" class="left-text">fox</text>
          <rect x="630" y="256" width="20" height="18" rx="4" class="bar-yellow"/>
          <text x="660" y="270" class="small">0.02</text>
          <text x="570" y="310" class="left-text">other</text>
          <rect x="630" y="296" width="10" height="18" rx="4" class="bar-red"/>
          <text x="650" y="310" class="small">0.01</text>
          <text x="584" y="390" class="formula-small center">Model answer: it looks like a cat</text>
          <text x="584" y="420" class="left-text center">The model selects the class with the highest probability.</text>
        `
      },
      {
        title: "Step 7. The full logic of machine vision",
        subtitle: "From numbers to features, from features to an object",
        name: "Full diagram",
        data: [
          "pixels",
          "features",
          "object"
        ],
        goal: [
          "Put the whole",
          "logic into one",
          "simple diagram",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">How a computer “sees” an image</text>
          <rect x="320" y="190" width="90" height="70" class="node-blue" />
          <text x="365" y="215" class="node-bold center">Pixels</text>
          <text x="365" y="240" class="small center">numbers</text>
          <path d="M420 225 L460 225" class="arrow" />
          <rect x="472" y="190" width="90" height="70" class="node-yellow" />
          <text x="517" y="215" class="node-bold center">Edges</text>
          <text x="517" y="240" class="small center">lines</text>
          <path d="M572 225 L612 225" class="arrow" />
          <rect x="624" y="190" width="90" height="70" class="node-yellow" />
          <text x="669" y="215" class="node-bold center">Parts</text>
          <text x="669" y="240" class="small center">eye, ear</text>
          <path d="M724 225 L764 225" class="arrow" />
          <rect x="776" y="190" width="80" height="70" class="node-green" />
          <text x="816" y="215" class="node-bold center">Object</text>
          <text x="816" y="240" class="small center">cat</text>
          <text x="584" y="335" class="formula-small center">pixels → edges → shapes → parts → object</text>
          <text x="584" y="385" class="left-text center">The computer does not see a “cat” immediately.</text>
          <text x="584" y="415" class="left-text center">It gradually builds a more and more complex description of the image.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive visualization: an image turns into a numerical matrix, and then the model searches for patterns in it.</figcaption>
</figure>

## How does a computer write text?

For a model, text is also numbers. First, a phrase is split into tokens: words, word pieces, punctuation marks, or individual characters. Then each token is assigned a numerical identifier.

A large language model is trained on huge amounts of text. Its basic training task is very simple: predict the next token from the previous tokens.

For example, if the model sees the beginning of a phrase:

> The cat is sitting on ...

it should estimate which token is most likely to come next: “chair,” “sofa,” “window,” “floor,” and so on.

By doing this billions of times, the model learns grammar, style, facts, common reasoning patterns, and the structure of language. When we ask it to write an answer, it continues the same process: it estimates probabilities for the next token and generates text step by step.

Important: an LLM does not retrieve a ready-made answer from a database like a search engine. It builds a continuation of the text based on probabilities. This is why such models can sound convincing but still be wrong. They must be checked, especially for facts, numbers, law, medicine, and technical details.

<figure class="interactive-figure">
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
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
    .panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.35;
      rx: 14;
    }
    .goal-panel {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.3;
      rx: 14;
    }
    .scene-panel {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.3;
      stroke-opacity: 0.28;
      rx: 16;
    }
    .step-pill {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.2;
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
    .left-title {
      font-size: 15px;
      font-weight: 800;
      fill: #3576C0;
    }
    .left-text {
      font-size: 15px;
      fill: #111111;
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
      marker-end: url(#arrowHeadBlue);
    }
    .arrow-red {
      stroke: #C30B0A;
      stroke-width: 2;
      fill: none;
      marker-end: url(#arrowHeadRed);
    }
    .token-blue {
      fill: #ffffff;
      stroke: #3576C0;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-yellow {
      fill: #ffffff;
      stroke: #C29E08;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-green {
      fill: #ffffff;
      stroke: #73B222;
      stroke-width: 1.5;
      rx: 7;
    }
    .token-red {
      fill: #ffffff;
      stroke: #C30B0A;
      stroke-width: 1.5;
      rx: 7;
    }
    .bar-blue {
      fill: #3576C0;
      opacity: 0.82;
    }
    .bar-yellow {
      fill: #C29E08;
      opacity: 0.82;
    }
    .bar-red {
      fill: #C30B0A;
      opacity: 0.82;
    }
    .bar-green {
      fill: #73B222;
      opacity: 0.82;
    }
    .btn {
      fill: #3576C0;
      rx: 10;
      cursor: pointer;
    }
    .btn-disabled {
      fill: #3576C0;
      opacity: 0.25;
      rx: 10;
      cursor: default;
    }
    .btn-text {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .btn-text-disabled {
      font-size: 13px;
      font-weight: 800;
      fill: #ffffff;
      opacity: 0.8;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
  </style>
  <defs>
    <marker id="arrowHeadBlue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#3576C0" />
    </marker>
    <marker id="arrowHeadRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L8,3 z" fill="#C30B0A" />
    </marker>
  </defs>
  <!-- Header -->
  <text id="mainTitle" x="24" y="34" class="title">Step 1. The user enters text</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">The LLM receives the beginning of a phrase and must continue it</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">Step 1 of 7</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Input</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Given</text>
  <text id="dataLine1" x="50" y="150" class="left-text">text prompt</text>
  <text id="dataLine2" x="50" y="176" class="left-text">part of a phrase</text>
  <text id="dataLine3" x="50" y="202" class="left-text">the answer is not ready yet</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Goal</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Understand how</text>
  <text id="goalLine2" x="50" y="344" class="left-text">the LLM generates</text>
  <text id="goalLine3" x="50" y="372" class="left-text">text step by step</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Back</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Next →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Step 1. The user enters text",
        subtitle: "The LLM receives the beginning of a phrase and must continue it",
        name: "Input",
        data: [
          "text prompt",
          "part of a phrase",
          "the answer is not ready yet"
        ],
        goal: [
          "Understand how",
          "the LLM generates",
          "text step by step",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The user gives the model the beginning of a text</text>
          <rect x="355" y="195" width="460" height="78" class="node-yellow" />
          <text x="585" y="225" class="node-bold center">Input text</text>
          <text x="585" y="252" class="formula-small center">"The cat is sitting on ..."</text>
          <text x="584" y="340" class="left-text center">At this stage, the model simply receives a sequence of characters.</text>
          <text x="584" y="375" class="left-text center">It still needs to determine what parts the text consists of.</text>
        `
      },
      {
        title: "Step 2. The text is split into tokens",
        subtitle: "The model works not with the whole phrase at once, but with small pieces",
        name: "Tokens",
        data: [
          "input text",
          "is split into parts",
          "tokens appear"
        ],
        goal: [
          "Show that",
          "the LLM reads text",
          "through tokens",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Splitting text into tokens</text>
          <rect x="335" y="205" width="86" height="50" class="token-blue" />
          <text x="378" y="230" class="node-bold center">Cat</text>
          <rect x="440" y="205" width="86" height="50" class="token-yellow" />
          <text x="483" y="230" class="node-bold center">is sitting</text>
          <rect x="545" y="205" width="68" height="50" class="token-blue" />
          <text x="579" y="230" class="node-bold center">on</text>
          <rect x="632" y="205" width="68" height="50" class="token-red" />
          <text x="666" y="230" class="node-bold center">...</text>
          <text x="584" y="330" class="formula-small center">Text → tokens</text>
          <text x="584" y="370" class="left-text center">Tokens are small pieces of text that the model works with next.</text>
        `
      },
      {
        title: "Step 3. The model looks at context",
        subtitle: "To continue the text, what came before matters",
        name: "Context",
        data: [
          "there are tokens",
          "context matters",
          "the model looks back"
        ],
        goal: [
          "Show that",
          "the next word",
          "depends on context",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Before predicting, the model uses context</text>
          <rect x="330" y="205" width="86" height="50" class="token-blue" />
          <text x="373" y="230" class="node-bold center">Cat</text>
          <rect x="438" y="205" width="86" height="50" class="token-yellow" />
          <text x="481" y="230" class="node-bold center">is sitting</text>
          <rect x="546" y="205" width="60" height="50" class="token-blue" />
          <text x="576" y="230" class="node-bold center">on</text>
          <rect x="650" y="195" width="120" height="70" class="node-red" />
          <text x="710" y="223" class="node-bold center">Next</text>
          <text x="710" y="245" class="node-bold center">token?</text>
          <path d="M373 255 Q520 320 690 265" class="arrow-red" />
          <path d="M481 255 Q565 310 700 265" class="arrow-red" />
          <path d="M576 255 Q615 295 707 265" class="arrow-red" />
          <text x="584" y="340" class="left-text center">The model looks at previous tokens and tries to understand,</text>
          <text x="584" y="375" class="left-text center">which continuation fits this context best.</text>
        `
      },
      {
        title: "Step 4. The model scores options",
        subtitle: "It does not choose a word immediately; it first scores several candidates",
        name: "Probabilities",
        data: [
          "context is known",
          "there are options",
          "probabilities estimated"
        ],
        goal: [
          "Show that",
          "the model compares",
          "several continuations",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The model scores possible continuations</text>
          <text x="400" y="195" class="left-text">"chair"</text>
          <rect x="470" y="182" width="240" height="20" rx="4" class="bar-blue" />
          <text x="725" y="197" class="small">0.45</text>
          <text x="400" y="235" class="left-text">"sofa"</text>
          <rect x="470" y="222" width="160" height="20" rx="4" class="bar-yellow" />
          <text x="645" y="237" class="small">0.30</text>
          <text x="400" y="275" class="left-text">"roof"</text>
          <rect x="470" y="262" width="92" height="20" rx="4" class="bar-red" />
          <text x="577" y="277" class="small">0.17</text>
          <text x="400" y="315" class="left-text">"floor"</text>
          <rect x="470" y="302" width="50" height="20" rx="4" class="bar-green" />
          <text x="535" y="317" class="small">0.08</text>
          <text x="584" y="375" class="left-text center">At this step, the model decides which next token is most likely.</text>
        `
      },
      {
        title: "Step 5. One token is selected",
        subtitle: "From the options, the model takes the next text fragment",
        name: "Token selection",
        data: [
          "options scored",
          "best one selected",
          "new token appears"
        ],
        goal: [
          "Show that",
          "generation proceeds",
          "one token at a time",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The next token is selected</text>
          <rect x="350" y="205" width="150" height="68" class="node-blue" />
          <text x="425" y="232" class="node-bold center">Context</text>
          <text x="425" y="255" class="small center">"The cat is sitting on"</text>
          <path d="M513 239 L580 239" class="arrow" />
          <rect x="595" y="195" width="160" height="88" class="node-green" />
          <text x="675" y="223" class="node-bold center">New token</text>
          <text x="675" y="253" class="formula-small center">"chair"</text>
          <text x="584" y="350" class="formula-small center">The model adds one token at a time</text>
          <text x="584" y="390" class="left-text center">It has not written the whole answer yet; it has only chosen the next continuation.</text>
        `
      },
      {
        title: "Step 6. The new token is added to the input",
        subtitle: "After that, the model repeats the same process",
        name: "Repetition",
        data: [
          "new token added",
          "context expanded",
          "the loop repeats"
        ],
        goal: [
          "Show the loop",
          "prediction →",
          "addition → repeat",
          ""
        ],
 scene: `
  <text x="328" y="130" class="scene-title">Autoregression: the model repeats the same loop</text>
  <rect x="360" y="180" width="190" height="60" class="node-blue" />
  <text x="455" y="210" class="node-bold center">"The cat is sitting on"</text>
  <path d="M563 210 L605 210" class="arrow" />
  <rect x="620" y="180" width="110" height="60" class="node-green" />
  <text x="675" y="210" class="node-bold center">"chair"</text>
  <path d="M675 250 C675 300, 450 300, 450 252" class="arrow" />
  <rect x="360" y="310" width="410" height="60" class="node-yellow" />
  <text x="565" y="340" class="node-bold center">New input: "The cat is sitting on chair ..."</text>
  <text x="584" y="395" class="left-text center">Now the model scores the next token again:</text>
  <text x="584" y="420" class="left-text center">for example, "and", "nearby", "by the window" etc.</text>
`
      },
      {
        title: "Step 7. This is how the full answer is built",
        subtitle: "The text grows token by token until the model finishes the phrase",
        name: "Completed text",
        data: [
          "the loop repeated many times",
          "text gradually assembled",
          "answer ready"
        ],
        goal: [
          "Show the result:",
          "the LLM builds text",
          "one step at a time",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">The result appears gradually</text>
          <rect x="340" y="175" width="440" height="165" class="node-yellow" />
          <text x="370" y="210" class="small">step 1  →  "The cat is sitting on <tspan font-weight="800">chair</tspan>"</text>
          <text x="370" y="245" class="small">step 2  →  "The cat is sitting on chair <tspan font-weight="800">and</tspan>"</text>
          <text x="370" y="280" class="small">step 3  →  "The cat is sitting on chair and <tspan font-weight="800">looks</tspan>"</text>
          <text x="370" y="315" class="small">step 4  →  "The cat is sitting on chair and looks <tspan font-weight="800">out the window.</tspan>"</text>
          <text x="584" y="380" class="formula-small center">The LLM generates text token by token</text>
          <text x="584" y="412" class="left-text center">It does not write the whole answer at once; it repeats the same loop many times.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `Step ${currentStep + 1} of ${steps.length}`;
      $("stepName").textContent = step.name;
      $("bottomCounter").textContent = `${currentStep + 1} / ${steps.length}`;
      $("dataLine1").textContent = step.data[0] || "";
      $("dataLine2").textContent = step.data[1] || "";
      $("dataLine3").textContent = step.data[2] || "";
      $("goalLine1").textContent = step.goal[0] || "";
      $("goalLine2").textContent = step.goal[1] || "";
      $("goalLine3").textContent = step.goal[2] || "";
      $("goalLine4").textContent = step.goal[3] || "";
      $("sceneContent").innerHTML = step.scene;
      const prevBtn = $("prevBtn");
      const prevText = $("prevText");
      const nextBtn = $("nextBtn");
      if (currentStep === 0) {
        prevBtn.setAttribute("class", "btn-disabled");
        prevText.setAttribute("class", "btn-text-disabled");
      } else {
        prevBtn.setAttribute("class", "btn");
        prevText.setAttribute("class", "btn-text");
      }
      if (currentStep === steps.length - 1) {
        nextBtn.setAttribute("class", "btn-disabled");
      } else {
        nextBtn.setAttribute("class", "btn");
      }
    }
    function nextStep() {
      if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
      }
    }
    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep();
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });
    $("prevBtn").addEventListener("click", prevStep);
      $("nextBtn").addEventListener("click", nextStep);
      renderStep();
    })();
  </script>
</svg>
<figcaption>Interactive visualization: an LLM receives text, splits it into tokens, and chooses the next token by probabilities.</figcaption>
</figure>

## Deep learning — why “deep”?

“Depth” here is almost literal: it means the number of layers in a neural network. A simple network may have one or a few layers. A deep network has dozens, hundreds, and sometimes even more computational blocks.

Each layer transforms the data into a new representation. In computer vision, early layers may react to simple elements: edges, corners, and color patches. Later layers combine them into shapes. Deeper layers recognize parts of objects. Only near the output do we get high-level representations such as “looks like a cat,” “looks like a car,” or “looks like a face.”

With text, the idea is similar: early levels work with tokens and local relationships, while deeper blocks help the model build more complex dependencies between words, phrases, and semantic parts of the text.

This hierarchy of representations is what makes deep learning so powerful. The model does not receive all features manually. It gradually builds them itself — from simple to more abstract.

## Summary

Putting everything together:

- artificial intelligence is an attempt to reproduce intelligent behavior in a machine;
- machine learning is a modern approach inside AI where the machine learns from data instead of relying on hand-written rules;
- deep learning is a part of machine learning based on multilayer neural networks;
- computer vision trains models to understand images as numerical matrices;
- large language models work with text as a sequence of tokens and learn to predict the next token.

The main idea is simple: modern AI is powerful not because a programmer wrote every rule in advance. It is powerful because a model can find complex patterns in data and apply them to new situations.
