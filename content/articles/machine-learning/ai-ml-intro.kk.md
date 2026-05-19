Біз «жасанды интеллект» деген сөзді жиі қолданамыз, бірақ оның ішінде бір ғана идея емес,  адамның интеллекті, ережеге негізделген бағдарламалау, машиналық оқыту, терең нейрондық желілер, компьютерлік көру және үлкен тілдік модельдер сияқты ұғымдар қатар жүреді. Бұл мақалада қарапайым интуициядан бастап модельдің деректерден қалай үйренетіндігін және LLM-дердің мәтінді қалай жазатындығын қарастыратын боламыз .

## Адам интеллекті

Біз досымызды дауысынан танығанда, мәтіндегі астарлы мағынаны түсінгенде, көлік жүргізгенде немесе бұрын кездеспеген есепті шешкенде — интеллектіні қолданамыз. Қарапайым тілмен айтқанда, интеллект — тәжірибеден үйрену, заңдылықтарды көру және алдын ала нақты нұсқаулық жазылмаған жағдайда шешім қабылдау қабілеті.

Мұндағы маңызды идея: біз барлық нәрсені дайын ережелер арқылы үйренбейміз. Балаға «мысықты қалай тану керек» деген нұсқаулық жазып бермейміз. Ол бірнеше мысықты көреді, қайталанатын белгілерді байқайды және біртіндеп мысықты иттен, ойыншықтан немесе суреттегі кездейсоқ дақтан ажырата бастайды.

## Жасанды интеллект — неге «жасанды»?

«Жасанды» дегеніміз — табиғаттан өздігінен пайда болмаған, адам жасаған деген сөз. Жасанды интеллект — машинада көру, есту, сөйлеу, пайымдау, әрекет таңдау және жаңа ақпаратқа бейімделу сияқты ақылды мінез-құлықты қайталауға тырысу.

Бұл сөз «жалған» дегенді білдірмейді. Ол «адам қолымен жасалған» деген мағынада қолданылады: жасанды жер серігі немесе жасанды материал сияқты. Компьютерлік үйенің әрекеті ақылды болып көрінуі мүмкін, бірақ оның келіп шығу көзі басқа: биологиялық эволюция емес, математика, деректер, инженерия және есептеу ресурстарының нәтижесі.

## ЖИ салалары және неге қазір бәрі машиналық оқыту туралы айтады

Жасанды интеллект — өте кең сала. Оның ішінде әртүрлі тәсілдер бар. Бұрынғы жүйелерде бағдарламашылар ережелерді қолмен сипаттайтын: «егер объектінің төрт аяғы, құйрығы болса және ол үретін болса — бұл ит». Мұндай жүйелерді эксперттік немесе rule-based жүйелер деп атайды.

Бірақ нақты өмірдегі көп есептерді қолмен сипаттау тым күрделі. Адамның бет-әлпеттерінің, дауыстардың, жол жағдайларының, жазу стильдерінің немесе мысық фотоларының барлық нұсқасын тізіп шығу мүмкін емес. Сондықтан қазіргі ЖИ көбіне машиналық оқытуға сүйенеді: біз барлық ережені өзіміз жазбаймыз, модельге деректерді көрсетеміз, ал ол заңдылықтарды өзі табады.

Машиналық оқытудың ішінде терең оқыту бар — бұл көпқабатты нейрондық желілер қолданылатын тәсіл. Дәл осы терең оқыту үлкен тілдік модельдердің, компьютерлік көрудің, сөйлеуді танудың және көптеген заманауи ұсыным жүйелерінің негізінде жатыр.


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
  <text id="mainTitle" x="32" y="36" class="title">Қадам 1. Жасанды интеллект деген не?</text>
  <text id="mainSubtitle" x="32" y="64" class="subtitle">ЖИ — ақылды мінез-құлықты имитациялайтын жүйелердің жалпы класы</text>
  <rect x="640" y="20" width="230" height="58" class="step-pill" />
  <text id="stepCounter" x="660" y="43" class="step-top">1 / 6 қадам</text>
  <text id="stepName" x="660" y="65" class="step-bottom">Жасанды интеллект</text>
  <!-- Сыртқы көк тікбұрыш: биіктігі ұлғайтылды -->
  <rect x="40" y="112" width="830" height="340" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="555" y="474" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="606" y="493" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="715" y="494" class="title center">1 / 6</text>
  <rect id="nextBtn" x="768" y="474" width="102" height="38" class="btn" />
  <text x="819" y="493" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const aiOnly = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Жасанды интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Ақылды мінез-құлықты имитациялауға тырысатын кез келген жүйе</text>
    `;
    const aiMl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Жасанды интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Әртүрлі тәсілдерге арналған жалпы «қолшатыр»</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машиналық оқыту</text>
      <text x="180" y="252" class="box-sub-ml">Ережелерден емес, деректерден үйренеді</text>
    `;
    const aiMlDl = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Жасанды интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Әртүрлі тәсілдерге арналған жалпы «қолшатыр»</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машиналық оқыту</text>
      <text x="180" y="252" class="box-sub-ml">Ережелерден емес, деректерден үйренеді</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="287" class="box-title-dl">Терең оқыту</text>
      <text x="232" y="309" class="box-sub-dl">Көпқабатты нейрондық желілер</text>
    `;
    const aiMlDlModels = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Жасанды интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Әртүрлі тәсілдерге арналған жалпы «қолшатыр»</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машиналық оқыту</text>
      <text x="180" y="252" class="box-sub-ml">Ережелерден емес, деректерден үйренеді</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Терең оқыту</text>
      <text x="232" y="307" class="box-sub-dl">Көпқабатты нейрондық желілер</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">мәтіндер</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">көру</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Сөйлеу</text>
      <text x="503" y="350" class="mini-sub center">аудио</text>
    `;
    const fullDiagram = `
      <rect x="95" y="128" width="710" height="252" class="ai-box" />
      <text x="125" y="163" class="box-title-ai">Жасанды интеллект</text>
      <text x="125" y="186" class="box-sub-ai">Әртүрлі тәсілдерге арналған жалпы «қолшатыр»</text>
      <rect x="150" y="194" width="470" height="182" class="ml-box" />
      <text x="180" y="229" class="box-title-ml">Машиналық оқыту</text>
      <text x="180" y="252" class="box-sub-ml">Ережелерден емес, деректерден үйренеді</text>
      <rect x="202" y="258" width="370" height="105" class="dl-box" />
      <text x="232" y="286" class="box-title-dl">Терең оқыту</text>
      <text x="232" y="307" class="box-sub-dl">Көпқабатты нейрондық желілер</text>
      <rect x="225" y="317" width="96" height="42" class="mini-box" />
      <text x="273" y="334" class="mini-title center">LLM</text>
      <text x="273" y="350" class="mini-sub center">мәтіндер</text>
      <rect x="340" y="317" width="96" height="42" class="mini-box" />
      <text x="388" y="334" class="mini-title center">CNN</text>
      <text x="388" y="350" class="mini-sub center">көру</text>
      <rect x="455" y="317" width="96" height="42" class="mini-box" />
      <text x="503" y="334" class="mini-title center">Сөйлеу</text>
      <text x="503" y="350" class="mini-sub center">аудио</text>
      <rect x="645" y="174" width="135" height="52" class="side-box" />
      <text x="712.5" y="194" class="side-title center">Эксперттік</text>
      <text x="712.5" y="215" class="side-title center">жүйелер</text>
      <rect x="645" y="246" width="135" height="52" class="side-box" />
      <text x="712.5" y="266" class="side-title center">Логикалық</text>
      <text x="712.5" y="287" class="side-title center">ережелер</text>
      <rect x="645" y="318" width="135" height="52" class="side-box" />
      <text x="712.5" y="338" class="side-title center">Іздеу</text>
      <text x="712.5" y="359" class="side-title center">және жоспар.</text>
    `;
    const steps = [
      {
        title: "Қадам 1. Жасанды интеллект деген не?",
        subtitle: "ЖИ — ақылды мінез-құлықты имитациялайтын жүйелердің жалпы класы",
        name: "Жасанды интеллект",
        scene: `
          ${aiOnly}
          <rect x="95" y="128" width="710" height="252" class="highlight-ai" />
          <text x="450" y="398" class="explain center">ЖИ — ең кең деңгей.</text>
          <text x="450" y="416" class="explain-small center">Бұған жүйені интеллектуалды есептерді шешуге мәжбүр ететін әртүрлі тәсілдер кіреді.</text>
        `
      },
      {
        title: "Қадам 2. ЖИ ішінде машиналық оқыту пайда болады",
        subtitle: "Бұл тәсілде жүйе деректер арқылы үйренеді",
        name: "Машиналық оқыту",
        scene: `
          ${aiMl}
          <rect x="150" y="194" width="470" height="182" class="highlight-ml" />
          <text x="450" y="398" class="explain center">Машиналық оқыту — ЖИ-дің бөлігі.</text>
          <text x="450" y="416" class="explain-small center">Қолмен жазылған ережелердің орнына модель деректерден заңдылық іздейді.</text>
        `
      },
      {
        title: "Қадам 3. ML ішінде терең оқыту бар",
        subtitle: "Бұл көпқабатты нейрондық желілерге негізделген машиналық оқыту",
        name: "Терең оқыту",
        scene: `
          ${aiMlDl}
          <rect x="202" y="258" width="370" height="105" class="highlight-dl" />
          <text x="450" y="398" class="explain center">Терең оқыту — машиналық оқытудың бөлігі.</text>
          <text x="450" y="416" class="explain-small center">Ол қабаттары көп нейрондық желілерді қолданады.</text>
        `
      },
      {
        title: "Қадам 4. Терең оқыту ішінде әртүрлі модельдер бар",
        subtitle: "Мысалы: мәтінге, суретке және сөйлеуге арналған модельдер",
        name: "LLM / CNN / речь",
        scene: `
          ${aiMlDlModels}
          <text x="450" y="398" class="explain center">Әртүрлі модельдер әртүрлі есептерді шешеді.</text>
          <text x="450" y="416" class="explain-small center">LLM — мәтін, CNN — көру, сөйлеу модельдері — аудио.</text>
        `
      },
      {
        title: "Қадам 5. ЖИ тек ML ғана емес",
        subtitle: "ЖИ-ге ережеге негізделген жүйелер, іздеу және жоспарлау да кіреді",
        name: "Басқа тәсілдер",
        scene: `
          ${fullDiagram}
          <rect x="635" y="168" width="155" height="212" class="highlight-ai" />
          <text x="450" y="398" class="explain center">ЖИ-дің бәрі деректерден оқытылмайды.</text>
          <text x="450" y="416" class="explain-small center">Эксперттік жүйелер алдын ала берілген ережелермен жұмыс істей алады.</text>
        `
      },
      {
        title: "Қадам 6. Қорытынды иерархия",
        subtitle: "Енді LLM-нің ЖИ саласындағы орны көрінеді",
        name: "Қорытынды",
        scene: `
          ${fullDiagram}
          <text x="450" y="392" class="explain center">ИИ ⊃ Машиналық оқыту ⊃ Терең оқыту ⊃ LLM / CNN / речь</text>
          <text x="450" y="414" class="explain-small center">LLM — бүкіл ЖИ емес, терең оқыту ішіндегі бір тармақ.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті схема: ЖИ — ішінде машиналық оқыту, терең оқыту және заманауи модельдер орналасқан жалпы «қолшатыр».</figcaption>
</figure>

## Айқын бағдарламалау және машиналық оқыту

Айырмашылықты қарапайым есеп арқылы түсінген оңай. Мысалы, көліктің жүрген қашықтығын табу керек делік. Бізде жылдамдық пен уақыт бар. Есеп жауабын мектептен белгілі формула арқылы таба аламыз :

$$S = v \cdot t$$

Мұнда кіріс пен шығыс арасындағы байланыс толық белгілі. Бағдарлама өте қарапайым жазылады:

```python
def distance(velocity, time):
    return velocity * time
```

Бұл — айқын бағдарламалау: адам ережені біледі және оны кодқа айқын түрде жазады. Машинаға ештеңені үйренудің қажеті жоқ, өйткені бүкіл логика бағдарламашы арқылы алдын ала берілген.

Енді басқа есепті алайық: фотода мысық па, әлде ит пе — соны анықтау қажет  делік. Мұндай есепке дайын формула жоқ. `if pixel[3][5] == "мұрт": return "cat"` сияқты сенімді ереже жазу мүмкін емес. Себебі суреттер әртүрлі болады: жарық, поза, фон, ракурс, объект өлшемі және камера сапасы өзгеріп отырады.

Осы жерде машиналық оқыту басталады. Біз модельге «кіріс → дұрыс жауап» түріндегі көптеген мысалдарды көрсетеміз, ал модель жаңа ұқсас мысалдарда дұрыс жауап беру үшін ішкі параметрлерін өзі баптап үйренеді.
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
  <text id="mainTitle" x="24" y="34" class="title">Қадам 1. Қарапайым есеп бар</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Қашықтық пен жылдамдық бойынша қозғалыс уақытын табу керек</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">1 / 9 қадам</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Қарапайым есеп</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Берілгені</text>
  <text id="dataLine1" x="50" y="152" class="left-text">S = 10 км</text>
  <text id="dataLine2" x="50" y="178" class="left-text">v = 1 км/ч</text>
  <text id="dataLine3" x="50" y="204" class="left-text">t = ?</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Мақсат</text>
  <text id="goalLine1" x="50" y="318" class="left-text">Түсіну: уақытты қалай анықтаймыз</text>
  <text id="goalLine2" x="50" y="346" class="left-text">жауап: қарапайым формуламен</text>
  <text id="goalLine3" x="50" y="374" class="left-text">немесе оқыту арқылы</text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 9</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Қадам 1. Қарапайым есеп бар",
        subtitle: "Қашықтық пен жылдамдық бойынша қозғалыс уақытын табу керек",
        name: "Қарапайым есеп",
        goal: [
          "Түсіну: уақытты қалай анықтаймыз",
          "жауап: қарапайым формуламен",
          "немесе оқыту арқылы"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Идеал жағдай</text>
          <text x="328" y="154" class="small">Жылдамдық тұрақты. Жол қарапайым.</text>
          <circle cx="350" cy="250" r="6" class="dot" />
          <path d="M350 250 C400 250, 430 214, 480 238 C535 263, 575 208, 628 238 C680 266, 725 250, 820 250" class="route" />
          <circle cx="820" cy="250" r="6" class="dot" />
          <text x="335" y="276" class="small">start</text>
          <text x="797" y="276" class="small">finish</text>
          <line x1="350" y1="318" x2="820" y2="318" stroke="#3576C0" stroke-width="1.5" stroke-opacity="0.7" />
          <line x1="350" y1="311" x2="350" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <line x1="820" y1="311" x2="820" y2="325" stroke="#3576C0" stroke-width="1.5" />
          <text x="585" y="342" class="formula-small center">S = 10 км</text>
        `
      },
      {
        title: "Қадам 2. Айқын  бағдарламалауда",
        subtitle: "Ережені өзіміз білеміз және оны компьютерге береміз",
        name: "Explicit programming",
        goal: [
          "Егер ереже белгілі болса,",
          "адам оны өзі жазады",
          "формулу"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Схема explicit programming</text>
          <rect x="328" y="205" width="112" height="66" class="node-blue" />
          <text x="384" y="230" class="node-bold center">Деректер</text>
          <text x="384" y="252" class="small center">S, v</text>
          <path d="M452 238 L502 238" class="arrow" />
          <rect x="514" y="205" width="136" height="66" class="node-yellow" />
          <text x="582" y="230" class="node-bold center">Ереже</text>
          <text x="582" y="252" class="small center">t = S / v</text>
          <path d="M662 238 L712 238" class="arrow" />
          <rect x="724" y="205" width="96" height="66" class="node-green" />
          <text x="772" y="230" class="node-bold center">Жауап</text>
          <text x="772" y="252" class="small center">t</text>
          <text x="584" y="345" class="formula-small center">Деректер + ереже → жауап</text>
        `
      },
      {
        title: "Қадам 3. Компьютер кодты орындайды",
        subtitle: "Ол адам жазған формуланы орындайды",
        name: "Код",
        goal: [
          "Адам өзі",
          "формуланы жазады"
          ],
        scene: `
          <text x="328" y="130" class="scene-title">Бағдарлама ішінде не болады?</text>
          <rect x="328" y="226" width="118" height="74" class="node-blue" />
          <text x="387" y="252" class="node-bold center">Деректер</text>
          <text x="387" y="276" class="small center">S = 10, v = 1</text>
          <path d="M456 263 L486 263" class="arrow" />
          <rect x="532" y="158" width="160" height="42" class="node-yellow" />
          <text x="612" y="179" class="node-bold center">Компьютер</text>
          <rect x="498" y="218" width="250" height="122" class="code-box" />
          <text x="520" y="246" class="code-title">Python</text>
          <text x="520" y="280" class="code">def travel_time(S, v):</text>
          <text x="548" y="310" class="code">return S / v</text>
          <path d="M760 263 L790 263" class="arrow" />
          <rect x="802" y="226" width="58" height="74" class="node-green" />
          <text x="831" y="252" class="node-bold center">Жауап</text>
          <text x="831" y="278" class="formula-small center">10 ч</text>
          <text x="584" y="388" class="left-text center">Мұнда оқыту жоқ. Компьютер тек функцияны орындайды,</text>
          <text x="584" y="418" class="left-text center">оны адам алдын ала жазған.</text>
        `
      },
      {
        title: "Қадам 4. Сұрақ",
        subtitle: "Компьютер бұл тәуелділікті өзі таба ала ма?",
        name: "Сұрақ",
        goal: [
          "Дайын формуладан",
          "оқытуға көшеміз"        ],
        scene: `
          <text x="584" y="195" class="title center">Компьютерді қалай үйретеміз?</text>
          <text x="584" y="250" class="formula-small center">Ол ережені өзі таба ала ма?</text>
          <text x="584" y="292" class="formula-small center">Мысалы: t мәні S және v мәндеріне тәуелді</text>
        `
      },
      {
        title: "Қадам 5. Машиналық оқыту идеясы",
        subtitle: "Формуланың орнына көп мысал береміз",
        name: "Көп мысал",
        goal: [
          "Формула жазбаймыз.",
          "дайын мысалдар",
          "көрсетеміз",
        ],
        scene: `
          <text x="584" y="195" class="title center">Компьютерге мысалдар береміз</text>
          <text x="584" y="250" class="formula-small center">Ол кіріс деректерді және дұрыс жауаптарды көреді.</text>
          <text x="584" y="292" class="formula-small center">Содан кейін заңдылықты табуға тырысады.</text>
        `
      },
      {
        title: "Қадам 6. Оқытуға арналған деректер",
        subtitle: "Әр жол — модель үйренетін мысал",
        name: "Оқыту деректері",
        goal: [
          "Енді бізде",
          "мысалдар жиыны",
          "бар"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Оқыту деректері</text>
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
          <text x="772" y="230" class="small">жауап</text>
          <path d="M760 343 L715 343" class="arrow-red" />
          <text x="772" y="347" class="small">жауап</text>
        `
      },
      {
        title: "Қадам 7. Модель мысалдар арқылы үйренеді",
        subtitle: "Ол S, v және t арасындағы тәуелділікті іздейді",
        name: "Оқыту",
        goal: [
          "Модель жасырын",
          "ережелерді іздейді"        ],
        scene: `
          <rect x="328" y="156" width="170" height="178" class="node-blue" />
          <text x="413" y="180" class="node-bold center">Деректер</text>
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
          <text x="637" y="223" class="node-bold center">Модель</text>
          <text x="637" y="253" class="small center">байланыс іздейді</text>
          <path d="M714 245 L760 245" class="arrow" />
          <rect x="772" y="196" width="44" height="98" class="node-green" />
          <text x="794" y="223" class="node-bold center">t</text>
          <text x="794" y="253" class="small center">жауап</text>
          <text x="584" y="380" class="formula-small center">Оқытудан кейін модель шамамен түсінеді:</text>
          <text x="584" y="410" class="formula center">t = f(S, v)</text>
        `
      },
      {
        title: "Қадам 8. Оқытылған модельді қолданамыз",
        subtitle: "Енді дайын жауабы жоқ жаңа мысал беруге болады",
        name: "Болжам",
        goal: [
          "Оқытудан кейін",
          "модель жаңа",
          "деректер болжайды"
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Жаңа мысал</text>
          <rect x="328" y="208" width="130" height="72" class="node-blue" />
          <text x="393" y="232" class="node-bold center">Жаңа деректер</text>
          <text x="393" y="256" class="small center">S = 10, v = 1</text>
          <path d="M470 244 L528 244" class="arrow" />
          <rect x="540" y="200" width="144" height="88" class="node-yellow" />
          <text x="612" y="228" class="node-bold center">Модель</text>
          <text x="612" y="252" class="small center">оқытылған</text>
          <path d="M696 244 L750 244" class="arrow" />
          <rect x="762" y="208" width="60" height="72" class="node-green" />
          <text x="792" y="232" class="node-bold center">t</text>
          <text x="792" y="256" class="small center">?</text>
          <text x="584" y="370" class="formula-small center">Модель уақытты болжауы керек.</text>
          <text x="584" y="406" class="formula center">t ≈ 10 ч</text>
        `
      },
      {
        title: "Қадам 9. Негізгі айырмашылық",
        subtitle: "Бір жағдайда формуланы адам жазады, екіншісінде модель оны деректерден іздейді",
        name: "Салыстыру",
        goal: [
          "Енді екі тәсілді",
          "салыстыру"
        ],
        scene: `
          <text x="430" y="146" class="scene-title center">Explicit programming</text>
          <rect x="332" y="172" width="196" height="112" class="node-blue" />
          <text x="430" y="206" class="formula-small center">Деректер + ереже</text>
          <text x="430" y="236" class="formula-small center">→</text>
          <text x="430" y="264" class="formula-small center">Жауап</text>
          <text x="430" y="330" class="small center">Адам ережені алдын ала жазады.</text>
          <line x1="584" y1="146" x2="584" y2="340" stroke="#3576C0" stroke-width="1.2" stroke-opacity="0.28" />
          <text x="738" y="146" class="scene-title center">Machine learning</text>
          <rect x="640" y="172" width="196" height="112" class="node-yellow" />
          <text x="738" y="206" class="formula-small center">Деректер + жауаптар</text>
          <text x="738" y="236" class="formula-small center">→</text>
          <text x="738" y="264" class="formula-small center">Модель</text>
          <text x="738" y="330" class="small center">Модель ережені мысалдардан үйренеді.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті визуализация: ереже белгілі болса, біз оны тікелей бағдарламалаймыз; ереже тым күрделі болса, мысалдар арқылы оқытуға көшеміз.</figcaption>
</figure>

## Неге бір формула жеткіліксіз

Тіпті сапар уақыты сияқты қарапайым есеп те шынайы өмірде күрделірек. Формула арқылы қозғалыс уақытын бағалауға болады:

$$t = \frac{S}{v}$$

Бірақ нақты өмірде уақыт тек қашықтық пен орташа жылдамдыққа тәуелді емес. Кептеліс, ауа райы, аялдаулар, жол сапасы, бағдаршамдар, жүргізуші стилі және басқа да көптеген факторлар әсер етеді. Формалды түрде былай жазуға болады:

$$t = f(S, v, \text{кептеліс}, \text{ауа райы}, \text{аялдаулар}, \ldots)$$

`f` функциясын әдетте қолмен жазу қиын. Бірақ көптеген нақты сапарларды жинап, модельге осы тәуелділікті өзі жуықтауға мүмкіндік беруге болады.
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
  <text id="mainTitle" x="32" y="42" class="title">Ой, Хьюстон, бізде мәселе бар</text>
  <text id="mainSubtitle" x="32" y="70" class="subtitle"></text>
  <rect x="668" y="20" width="190" height="58" class="step-pill" />
  <text id="stepCounter" x="688" y="43" class="step-top">Қадам 1</text>
  <text id="stepName" x="688" y="65" class="step-bottom">Сұрақ</text>
  <!-- Scene -->
  <rect x="32" y="100" width="826" height="280" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="542" y="415" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="593" y="434" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="696" y="435" class="formula center">1 / 2</text>
  <rect id="nextBtn" x="756" y="415" width="102" height="38" class="btn" />
  <text x="807" y="434" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Ой, Хьюстон, бізде мәселе бар",
        subtitle: "",
        counter: "Қадам 1",
        name: "Сұрақ",
        scene: `
          <text x="445" y="215" class="title center">Қозғалыс шынымен идеалды ма?</text>
          <text x="445" y="265" class="text center">Тек t = S / v формуласы жеткілікті ме?</text>
        `
      },
      {
        title: "Қадам 2. Нақты есеп",
        subtitle: "Нақты өмірде факторлар әдетте S пен v-ден көп",
        counter: "2 / 2 қадам",
        name: "Жауап",
        scene: `
          <text x="445" y="145" class="title center">Жоқ, нақты өмірде бәрі күрделірек</text>
          <text x="445" y="190" class="text center">Уақыт тек қашықтық пен жылдамдыққа ғана тәуелді емес.</text>
          <rect x="120" y="230" width="120" height="54" class="node-red" />
          <text x="180" y="257" class="node-bold center">Кептеліс</text>
          <rect x="280" y="230" width="120" height="54" class="node-red" />
          <text x="340" y="257" class="node-bold center">Ауа райы</text>
          <rect x="440" y="230" width="120" height="54" class="node-red" />
          <text x="500" y="257" class="node-bold center">Аялдаулар</text>
          <rect x="600" y="230" width="120" height="54" class="node-red" />
          <text x="660" y="257" class="node-bold center">Жол</text>
          <text x="445" y="335" class="formula center">t = f(S, v, кептеліс, ауа райы, ...)</text>
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
<figcaption>Интерактивті блок: есепке нақты өмір факторлары қосылғанда қарапайым формуланың неге жеткіліксіз болатыны.</figcaption>
</figure>

## Машина қалай үйренеді?

«Оқыту» сөзі бұл жерде жай ғана метафора емес, бірақ машина адам сияқты толық мағынада үйренбейді. Математикалық тұрғыдан оқыту — модель параметрлерін оқыту мысалдарындағы қате азаятындай етіп таңдау.

Модельде «бапталатын тұтқалар» бар — олар параметрлер деп аталады. Басында олар кездейсоқ болуы мүмкін. Модель болжам жасайды, біз оны дұрыс жауаппен салыстырамыз, қатені есептейміз және параметрлерді қатені азайтатын бағытқа қарай аздап өзгертеміз. Кейін бұл цикл қайта-қайта қайталанады.

Қарапайым түрде цикл былай көрінеді:

1. модельге деректерді беру;
2. болжам алу;
3. қатені есептеу;
4. параметрлерді жаңарту;
5. мұны көп рет қайталау.

Мыңдаған, миллиондаған немесе миллиардтаған осындай қадамнан кейін модель деректердегі заңдылықтарды жақсырақ жалпылай бастайды.
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
  <text id="mainTitle" x="24" y="34" class="title">Қадам 1. Модельде мысалдар бар</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Модель дұрыс жауабы белгілі сапарлар арқылы үйренеді</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">1 / 8 қадам</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Деректер</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Берілгені</text>
  <text id="dataLine1" x="50" y="150" class="left-text">көп сапар</text>
  <text id="dataLine2" x="50" y="176" class="left-text">факторлар бар</text>
  <text id="dataLine3" x="50" y="202" class="left-text">нақты t белгілі</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Мақсат</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Көрсету:</text>
  <text id="goalLine2" x="50" y="344" class="left-text">модель үйренеді</text>
  <text id="goalLine3" x="50" y="372" class="left-text">қадам-қадаммен</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 8</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Қадам 1. Модельде мысалдар бар",
        subtitle: "Модель дұрыс жауабы белгілі сапарлар арқылы үйренеді",
        name: "Деректер",
        data: [
          "көп сапар",
          "факторлар бар",
          "нақты t белгілі"
        ],
        goal: [
          "Көрсету:",
          "модель үйренеді",
          "қадам-қадаммен",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Оқыту деректері</text>
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
          <text x="550" y="185" class="table-head">кептеліс</text>
          <text x="655" y="185" class="table-head">ауа райы</text>
          <text x="770" y="185" class="table-head">нақты t</text>
          <text x="380" y="225" class="table-cell">10</text>
          <text x="460" y="225" class="table-cell">1</text>
          <text x="550" y="225" class="table-cell">жоқ</text>
          <text x="655" y="225" class="table-cell">ашық</text>
          <text x="770" y="225" class="table-cell">10</text>
          <text x="380" y="265" class="table-cell">10</text>
          <text x="460" y="265" class="table-cell">1</text>
          <text x="550" y="265" class="table-cell">иә</text>
          <text x="655" y="265" class="table-cell">ашық</text>
          <text x="770" y="265" class="table-cell">12</text>
          <text x="380" y="305" class="table-cell">10</text>
          <text x="460" y="305" class="table-cell">1</text>
          <text x="550" y="305" class="table-cell">иә</text>
          <text x="655" y="305" class="table-cell">жаңбыр</text>
          <text x="770" y="305" class="table-cell">14</text>
          <text x="380" y="345" class="table-cell">8</text>
          <text x="460" y="345" class="table-cell">1</text>
          <text x="550" y="345" class="table-cell">жоқ</text>
          <text x="655" y="345" class="table-cell">жаңбыр</text>
          <text x="770" y="345" class="table-cell">9</text>
          <text x="584" y="405" class="left-text center">Әр жол — бір мысал: сапар шарттары және дұрыс жауап.</text>
        `
      },
      {
        title: "Қадам 2. Модель басында ережені білмейді",
        subtitle: "Ол бастапқыда өте жуық болжамнан бастайды",
        name: "Алғашқы болжам",
        data: [
          "деректер жолы бар",
          "дұрыс t = 14",
          "модель ещё не оқытыла"
        ],
        goal: [
          "Көрсету:",
          "модель бастапқыда",
          "қателеседі",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Кестеден бір мысал аламыз</text>
          <rect x="330" y="185" width="170" height="90" class="node-blue" />
          <text x="415" y="213" class="node-bold center">Мысал</text>
          <text x="415" y="238" class="small center">S=10, v=1</text>
          <text x="415" y="258" class="small center">кептеліс + жаңбыр</text>
          <path d="M512 230 L565 230" class="arrow" />
          <rect x="578" y="180" width="150" height="100" class="node-yellow" />
          <text x="653" y="210" class="node-bold center">Модель</text>
          <text x="653" y="238" class="small center">пока не знает</text>
          <text x="653" y="258" class="small center">точную связь</text>
          <path d="M740 230 L790 230" class="arrow" />
          <rect x="802" y="185" width="50" height="90" class="node-green" />
          <text x="827" y="213" class="node-bold center">t</text>
          <text x="827" y="240" class="small center">?</text>
          <text x="584" y="360" class="formula-small center">Алғашқы болжам дәл болмауы мүмкін</text>
          <text x="584" y="400" class="left-text center">Мысалы, модель t ≈ 11 дейді, ал дұрыс жауап — 14.</text>
        `
      },
      {
        title: "Қадам 3. Модель болжам жасайды",
        subtitle: "Ол таңдалған жол үшін жауапты болжауға тырысады",
        name: "Болжам",
        data: [
          "мысал: кептеліс + жаңбыр",
          "нақты t = 14",
          "болжам t ≈ 11"
        ],
        goal: [
          "Сравнить",
          "болжам модели",
          "нақты жауаппен",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель жауап беруге тырысады</text>
          <rect x="330" y="205" width="145" height="76" class="node-blue" />
          <text x="402.5" y="233" class="node-bold center">Факторлар</text>
          <text x="402.5" y="258" class="small center">S, v, кептеліс, жаңбыр</text>
          <path d="M488 243 L545 243" class="arrow" />
          <rect x="558" y="198" width="140" height="90" class="node-yellow" />
          <text x="628" y="230" class="node-bold center">Модель</text>
          <text x="628" y="258" class="small center">болжам жасайды</text>
          <path d="M710 243 L760 243" class="arrow" />
          <rect x="772" y="205" width="80" height="76" class="node-green" />
          <text x="812" y="233" class="node-bold center">Болжам</text>
          <text x="812" y="260" class="formula-small center">11</text>
          <text x="584" y="358" class="formula-small center">Болжам модели: 11</text>
          <text x="584" y="398" class="left-text center">Бірақ оқыту деректерінде бұл жолдың дұрыс жауабы: 14.</text>
        `
      },
      {
        title: "Қадам 4. Модель қатені көреді",
        subtitle: "Ол болжамды дұрыс жауаппен салыстырады",
        name: "Қате",
        data: [
          "болжам t ≈ 11",
          "нақты t = 14",
          "есть қате"
        ],
        goal: [
          "Идеяны көрсету",
          "қатені күрделі",
          "математикасыз түсіндіру",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">Болжам мен дұрыс жауапты салыстыру</text>
  <rect x="350" y="195" width="170" height="90" class="node-green" />
  <text x="435" y="225" class="node-bold center">Болжам</text>
  <text x="435" y="255" class="formula-small center">11</text>
  <rect x="635" y="195" width="185" height="90" class="node-blue" />
  <text x="727.5" y="220" class="node-bold center">Дұрыс</text>
  <text x="727.5" y="242" class="node-bold center">жауап</text>
  <text x="727.5" y="267" class="formula-small center">14</text>
  <path d="M535 240 L620 240" class="arrow-red" />
  <text x="584" y="345" class="formula-small center">Қате: болжам нақты жауаптан төмен</text>
  <text x="584" y="390" class="left-text center">Модель бағытты түсінеді: мұндай жағдайда уақытты үлкейту керек.</text>
`
      },
      {
        title: "Қадам 5. Модель аздап түзеледі",
        subtitle: "Келесі жолы аз қателесу үшін ол ішкі ережесін өзгертеді",
        name: "Жаңарту",
        data: [
          "қате найдена",
          "модель меняется",
          "болжам становится лучше"
        ],
        goal: [
          "Көрсету:",
          "оқыту — бұл",
          "постепенная правка",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Қатеден кейін модель ішкі ережесін жаңартады</text>
          <rect x="330" y="200" width="145" height="86" class="node-red" />
          <text x="402.5" y="228" class="node-bold center">Қате</text>
          <text x="402.5" y="255" class="small center">болжам төмен болды</text>
          <path d="M488 243 L545 243" class="arrow-red" />
          <rect x="558" y="190" width="150" height="106" class="node-yellow" />
          <text x="633" y="220" class="node-bold center">Модель</text>
          <text x="633" y="248" class="small center">аздап өзгертеді</text>
          <text x="633" y="270" class="small center">ішкі ережесін</text>
          <path d="M720 243 L775 243" class="arrow" />
          <rect x="788" y="200" width="64" height="86" class="node-green" />
          <text x="820" y="228" class="node-bold center">Жақсырақ</text>
          <text x="820" y="255" class="small center">болжам</text>
          <text x="584" y="365" class="formula-small center">Было: t ≈ 11 → стало: t ≈ 12</text>
          <text x="584" y="405" class="left-text center">Бұл әлі мінсіз емес, бірақ қате азайды.</text>
        `
      },
      {
        title: "Қадам 6. Бұл көп рет қайталанады",
        subtitle: "Модель көптеген мысалдан өтеді",
        name: "Қайталау",
        data: [
          "мысалдан мысалға",
          "қатеден қатеге",
          "модель жақсарады"
        ],
        goal: [
          "Циклді көрсету",
          "модельді оқыту",
          "көптеген жолдарда",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Оқыту — бір циклді қайталау</text>
          <rect x="330" y="200" width="120" height="70" class="node-blue" />
          <text x="390" y="226" class="node-bold center">Мысал</text>
          <text x="390" y="250" class="small center">деректерден</text>
          <path d="M462 235 L510 235" class="arrow" />
          <rect x="522" y="200" width="120" height="70" class="node-yellow" />
          <text x="582" y="226" class="node-bold center">Болжам</text>
          <text x="582" y="250" class="small center">модели</text>
          <path d="M654 235 L702 235" class="arrow" />
          <rect x="714" y="200" width="120" height="70" class="node-red" />
          <text x="774" y="226" class="node-bold center">Қате</text>
          <text x="774" y="250" class="small center">салыстыру</text>
          <path d="M774 285 C750 330, 410 330, 390 285" class="arrow" />
          <text x="584" y="370" class="formula-small center">Мысал → болжам → қате → түзету</text>
          <text x="584" y="410" class="left-text center">Жақсы мысалдар неғұрлым көп болса, модель заңдылықты соғұрлым жақсы табады.</text>
        `
      },
      {
        title: "Қадам 7. Оқытудан кейін модель байланысты түсінеді",
        subtitle: "Мінсіз емес, бірақ жаңа жағдайларда пайдалы",
        name: "Оқытылған модель",
        data: [
          "көп мысал",
          "қателер азайды",
          "модель оқытыла"
        ],
        goal: [
          "Нәтижені көрсету",
          "оқытуды",
          "углубления внутрь",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель шамамен нені түсінді?</text>
          <rect x="330" y="190" width="140" height="72" class="node-blue" />
          <text x="400" y="218" class="node-bold center">S және v</text>
          <text x="400" y="242" class="small center">базалық уақыт</text>
          <rect x="510" y="190" width="140" height="72" class="node-red" />
          <text x="580" y="218" class="node-bold center">Кептеліс</text>
          <text x="580" y="242" class="small center">t мәнін арттырады</text>
          <rect x="690" y="190" width="140" height="72" class="node-red" />
          <text x="760" y="218" class="node-bold center">Жаңбыр</text>
          <text x="760" y="242" class="small center">ол да әсер етеді</text>
          <text x="584" y="330" class="formula-small center">Модель бір формуланы емес, тәуелділікті үйренді</text>
          <text x="584" y="375" class="left-text center">Ол шамамен мынаны түсінеді: кептеліс пен жаңбыр кезінде уақыт әдетте ұзарады.</text>
          <text x="584" y="405" class="left-text center">Бұл білім қолмен жазылған if-else ережелерінен емес, деректерден пайда болды.</text>
        `
      },
      {
        title: "Қадам 8. Енді болжауға болады",
        subtitle: "Жаңа сапар үшін модель уақыт болжамын береді",
        name: "Қолдану",
        data: [
          "жаңа сапар",
          "жауап неизвестен",
          "модель даёт болжам"
        ],
        goal: [
          "Завершить цикл",
          "оқыту →",
          "использование",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Оқытылған модельді қолданамыз</text>
          <rect x="320" y="205" width="155" height="82" class="node-blue" />
          <text x="397.5" y="232" class="node-bold center">Жаңа сапар</text>
          <text x="397.5" y="257" class="small center">S, v, кептеліс, ауа райы</text>
          <path d="M488 246 L545 246" class="arrow" />
          <rect x="558" y="198" width="145" height="96" class="node-yellow" />
          <text x="630.5" y="228" class="node-bold center">Оқытылған</text>
          <text x="630.5" y="253" class="node-bold center">модель</text>
          <path d="M716 246 L775 246" class="arrow" />
          <rect x="788" y="205" width="64" height="82" class="node-green" />
          <text x="820" y="232" class="node-bold center">t</text>
          <text x="820" y="257" class="small center">болжам</text>
          <text x="584" y="360" class="formula-small center">Жаңа деректер + оқытылған модель → болжам</text>
          <text x="584" y="405" class="left-text center">Осылайша ML көптеген қолмен жазылатын ережелердің орнын басады.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті визуализация: модель мысалдар алады, қателеседі, параметрлерін түзетеді және болжамын біртіндеп жақсартады.</figcaption>
</figure>

Ең қарапайым мысал — сызықтық регрессия. Графикте нүктелер бар, ал модель сол нүктелердің арасынан сызық өткізуге тырысады. Сызық екі параметрмен беріледі: көлбеулік және ығысу.

$$\hat y = w \cdot x + b$$

Басында сызық кездейсоқ орналасады, сондықтан қате үлкен болады. Кейін модель `w` және `b` мәндерін өзгертеді, сызық біртіндеп бұрылып, нүктелерге жақындайды. Бұл — оқытудың ең қарапайым түрі.

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
  <text id="mainTitle" x="24" y="34" class="title">Қадам 1. Нақты есеп күрделірек</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Уақыт тек қашықтық пен жылдамдыққа ғана тәуелді емес</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">1 / 7 қадам</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Қосымша факторлар</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Берілгені</text>
  <text id="dataLine1" x="50" y="150" class="left-text">S = 10 км</text>
  <text id="dataLine2" x="50" y="176" class="left-text">v = 1 км/ч</text>
  <text id="dataLine3" x="50" y="202" class="left-text">есть доп. факторлар</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Мақсат</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Неліктен</text>
  <text id="goalLine2" x="50" y="344" class="left-text">қарапайым ережелердің</text>
  <text id="goalLine3" x="50" y="372" class="left-text">жеткіліксіз болатынын</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Қадам 1. Нақты есеп күрделірек",
        subtitle: "Уақыт тек қашықтық пен жылдамдыққа ғана тәуелді емес",
        name: "Қосымша факторлар",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "есть доп. факторлар"
        ],
        goal: [
          "Неліктен",
          "қарапайым ережелердің",
          "жеткіліксіз болатынын",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Шынайы өмірде t = S / v формуласы жеткіліксіз</text>
          <rect x="340" y="190" width="110" height="54" class="node-blue" />
          <text x="395" y="217" class="node-bold center">S, v</text>
          <rect x="480" y="190" width="110" height="54" class="node-red" />
          <text x="535" y="217" class="node-bold center">Кептеліс</text>
          <rect x="620" y="190" width="110" height="54" class="node-red" />
          <text x="675" y="217" class="node-bold center">Ауа райы</text>
          <rect x="760" y="190" width="90" height="54" class="node-red" />
          <text x="805" y="217" class="node-bold center">Жол</text>
          <text x="584" y="310" class="formula-small center">t = f(S, v, кептеліс, ауа райы, жол, ...)</text>
          <text x="584" y="360" class="left-text center">Факторлар көбейген сайын барлық жағдайды қолмен сипаттау қиындайды.</text>
        `
      },
      {
        title: "Қадам 2. Ережелерді қолмен жазуға болады",
        subtitle: "Бірақ шарттар саны тез өседі",
        name: "Көп if-else",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "кептеліс, жаңбыр, жол"
        ],
        goal: [
          "Көрсету:",
          "қолмен жазылған ережелер",
          "тез күрделенеді",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Попробуем решить через explicit programming</text>
          <rect x="350" y="175" width="460" height="170" class="node-blue" />
          <text x="380" y="215" class="small">егер кептеліс қатты болса → 40 минут қосу</text>
          <text x="380" y="245" class="small">егер жаңбыр болса → 15 минут қосу</text>
          <text x="380" y="275" class="small">егер жол нашар болса → 20 минут қосу</text>
          <text x="380" y="305" class="small">егер қарбалас уақыт және жаңбыр болса → тағы қосу ...</text>
          <text x="584" y="390" class="formula-small center">Ережелер көбейе береді</text>
        `
      },
      {
        title: "Қадам 3. Ережелер бір-бірімен қайшы келе бастайды",
        subtitle: "Бір фактор екіншісінің әсерін күшейтуі немесе әлсіретуі мүмкін",
        name: "Күрделі комбинациялар",
        data: [
          "S = 10 км",
          "v = 1 км/ч",
          "көп комбинация"
        ],
        goal: [
          "Мәселені түсіну",
          "факторлар арасындағы",
          "комбинацияларды",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Мәселе тек факторлар санында емес</text>
          <rect x="330" y="185" width="130" height="58" class="node-red" />
          <text x="395" y="214" class="node-bold center">Жаңбыр</text>
          <rect x="515" y="185" width="130" height="58" class="node-red" />
          <text x="580" y="214" class="node-bold center">Қарбалас уақыт</text>
          <rect x="700" y="185" width="130" height="58" class="node-red" />
          <text x="765" y="214" class="node-bold center">Жөндеу жұмысы</text>
          <path d="M462 214 L503 214" class="arrow-red" />
          <path d="M647 214 L688 214" class="arrow-red" />
          <text x="584" y="310" class="left-text center">Факторлар жеке-жеке емес, бірге әсер етеді.</text>
          <text x="584" y="345" class="left-text center">Мысалы, жаңбыр + қарбалас уақыт жол уақытын көбірек ұзартуы мүмкін,</text>
          <text x="584" y="380" class="left-text center">әр фактор жеке әсер еткеннен гөрі.</text>
        `
      },
      {
        title: "Қадам 4. Ережелердің орнына деректер жинауға болады",
        subtitle: "Әр сапар оқытуға арналған мысалға айналады",
        name: "Тарихи деректер",
        data: [
          "көп сапар",
          "факторлар белгілі",
          "нақты t белгілі"
        ],
        goal: [
          "Қолмен жазылған",
          "ережелерді үлкен",
          "мысалдар жиынымен алмастыру",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Нақты мысалдарды жинаймыз</text>
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
          <text x="570" y="185" class="table-head">кептеліс</text>
          <text x="670" y="185" class="table-head">ауа райы</text>
          <text x="770" y="185" class="table-head">t</text>
          <text x="385" y="225" class="table-cell">10</text>
          <text x="475" y="225" class="table-cell">1</text>
          <text x="570" y="225" class="table-cell">жоқ</text>
          <text x="670" y="225" class="table-cell">ашық</text>
          <text x="770" y="225" class="table-cell">10</text>
          <text x="385" y="265" class="table-cell">10</text>
          <text x="475" y="265" class="table-cell">1</text>
          <text x="570" y="265" class="table-cell">иә</text>
          <text x="670" y="265" class="table-cell">ашық</text>
          <text x="770" y="265" class="table-cell">12</text>
          <text x="385" y="305" class="table-cell">10</text>
          <text x="475" y="305" class="table-cell">1</text>
          <text x="570" y="305" class="table-cell">иә</text>
          <text x="670" y="305" class="table-cell">жаңбыр</text>
          <text x="770" y="305" class="table-cell">14</text>
          <text x="385" y="345" class="table-cell">8</text>
          <text x="475" y="345" class="table-cell">1</text>
          <text x="570" y="345" class="table-cell">жоқ</text>
          <text x="670" y="345" class="table-cell">жаңбыр</text>
          <text x="770" y="345" class="table-cell">9</text>
          <text x="584" y="400" class="left-text center">Енді жауап қолмен жазылған ережеден емес, нақты тәжірибеден алынады.</text>
        `
      },
      {
        title: "Қадам 5. Модель заңдылықтарды іздейді",
        subtitle: "Ол дұрыс жауабы белгілі мысалдар арқылы үйренеді",
        name: "Оқыту",
        data: [
          "факторлар сапарлар",
          "нақты уақыт",
          "көп мысал"
        ],
        goal: [
          "Көрсету:",
          "модель үйренеді",
          "формуладан емес, байланыстан",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель тарихи деректер арқылы оқытылады</text>
          <rect x="330" y="210" width="150" height="76" class="node-blue" />
          <text x="405" y="238" class="node-bold center">Деректер</text>
          <text x="405" y="264" class="small center">S, v, факторлар, t</text>
          <path d="M492 248 L550 248" class="arrow" />
          <rect x="562" y="200" width="150" height="96" class="node-yellow" />
          <text x="637" y="230" class="node-bold center">Модель</text>
          <text x="637" y="258" class="small center">байланыс іздейді</text>
          <text x="637" y="278" class="small center">факторлар арасында</text>
          <path d="M724 248 L780 248" class="arrow" />
          <rect x="792" y="210" width="60" height="76" class="node-green" />
          <text x="822" y="238" class="node-bold center">t</text>
          <text x="822" y="264" class="small center">жауап</text>
          <text x="584" y="360" class="formula-small center">ML: деректер + жауаптар → модель</text>
          <text x="584" y="400" class="left-text center">Модель тәуелділікті мысалдар арқылы өзі табады.</text>
        `
      },
      {
        title: "Қадам 6. Кейін модель болжам жасайды",
        subtitle: "Жаңа сапар үшін дұрыс жауап алдын ала белгісіз",
        name: "Болжам",
        data: [
          "жаңа сапар",
          "факторлар бар",
          "t белгісіз"
        ],
        goal: [
          "Көрсету:",
          "оқытылған модель",
          "әрі қарай қолданылады",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модельді жаңа жағдайда қолданамыз</text>
          <rect x="320" y="210" width="160" height="76" class="node-blue" />
          <text x="400" y="238" class="node-bold center">Жаңа деректер</text>
          <text x="400" y="264" class="small center">S, v, кептеліс, ауа райы</text>
          <path d="M492 248 L550 248" class="arrow" />
          <rect x="562" y="200" width="150" height="96" class="node-yellow" />
          <text x="637" y="230" class="node-bold center">Модель</text>
          <text x="637" y="258" class="small center">оқытылған</text>
          <path d="M724 248 L780 248" class="arrow" />
          <rect x="792" y="210" width="60" height="76" class="node-green" />
          <text x="822" y="238" class="node-bold center">t</text>
          <text x="822" y="264" class="small center">болжам</text>
          <text x="584" y="360" class="formula-small center">Жаңа деректер + модель → болжам</text>
          <text x="584" y="400" class="left-text center">Модель болашақты білмейді, бірақ оны өткен тәжірибе бойынша бағалайды.</text>
        `
      },
      {
        title: "Қадам 7. Неге мұнда ML керек",
        subtitle: "Тәуелділік күрделі, бірақ мысал көп болса, ML пайдалы",
        name: "Түйін",
        data: [
          "көп фактор",
          "көп мысал",
          "болжам керек"
        ],
        goal: [
          "Сформулировать",
          "негізгі себебін",
          "тұжырымдау",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">ML қашан қолмен жазылған ережелерден тиімді?</text>
          <rect x="330" y="180" width="150" height="70" class="node-red" />
          <text x="405" y="210" class="node-bold center">Много</text>
          <text x="405" y="233" class="small center">факторлар</text>
          <rect x="505" y="180" width="150" height="70" class="node-yellow" />
          <text x="580" y="210" class="node-bold center">Күрделі</text>
          <text x="580" y="233" class="small center">тәуелділік</text>
          <rect x="680" y="180" width="150" height="70" class="node-green" />
          <text x="755" y="210" class="node-bold center">Бар</text>
          <text x="755" y="233" class="small center">деректер тарихы</text>
          <text x="584" y="320" class="formula-small center">ML ережені қолмен жазу қиын болғанда қажет,</text>
          <text x="584" y="360" class="formula-small center">бірақ көп мысал көрсетуге болады.</text>
          <text x="584" y="410" class="left-text center">Модель өткен деректерден үйреніп, жаңа жағдайларға болжам жасайды.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті визуализация: модель сызық параметрлерін қадам-қадаммен таңдап, қатені қалай азайтады.</figcaption>
</figure>

## Компьютер әлемді қалай көреді?

Компьютерде адамдағыдай көз жоқ. Ол үшін сурет — сандар кестесі. Қара-ақ суретте әр пиксельді бір санмен көрсетуге болады: 0 — қара, 255 — ақ, ал аралық мәндер — сұрдың әртүрлі реңктері.

Түсті суретте әдетте үш канал болады: R, G және B. Яғни әр пиксель үш сан сақтайды: қызыл, жасыл және көк түстің мөлшері.

Компьютер бірден «мысықты» көрмейді. Кірісте оның алдында тек сандар торы бар. Компьютерлік көрудің мақсаты — модельді осы сандар торынан мағыналы объектілерге сәйкес келетін комбинацияларды табуға үйрету: беттер, көліктер, әріптер, медициналық суреттер немесе мысықтар.
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
  <text id="mainTitle" x="24" y="34" class="title">Қадам 1. Компьютер сурет алады</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">Компьютер үшін сурет — объект емес, сандар жиыны</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">1 / 7 қадам</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Пиксельдер</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Берілгені</text>
  <text id="dataLine1" x="50" y="150" class="left-text">сурет</text>
  <text id="dataLine2" x="50" y="176" class="left-text">пиксельдер торы</text>
  <text id="dataLine3" x="50" y="202" class="left-text">0–255 сандары</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Мақсат</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Түсіну:</text>
  <text id="goalLine2" x="50" y="344" class="left-text">компьютер</text>
  <text id="goalLine3" x="50" y="372" class="left-text">суретті қалай көреді</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Қадам 1. Компьютер сурет алады",
        subtitle: "Компьютер үшін сурет — объект емес, сандар жиыны",
        name: "Пиксельдер",
        data: [
  "сурет",
  "пиксельдер RGB",
  "0–255 сандары"
],
      goal: [
  "Түсіну, суреттің",
  "суреттің",
  "компьютер үшін — сандар",
  ""
],
        scene: `
  <text x="328" y="130" class="scene-title">Компьютер үшін түсті сурет — үш канал</text>
  <!-- RGB пиксельная сурет -->
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
  <text x="567.5" y="216" class="small center">қызыл</text>
  <!-- G -->
  <rect x="640" y="170" width="95" height="60" class="node-green" />
  <text x="687.5" y="194" class="node-bold center">G</text>
  <text x="687.5" y="216" class="small center">жасыл</text>
  <!-- B -->
  <rect x="760" y="170" width="95" height="60" class="node-blue" />
  <text x="807.5" y="194" class="node-bold center">B</text>
  <text x="807.5" y="216" class="small center">көк</text>
  <text x="687.5" y="285" class="formula-small center">әр пиксель = [R, G, B]</text>
  <text x="584" y="350" class="left-text center">Компьютер түсті суретті үш сандық қабат ретінде көреді.</text>
  <text x="584" y="380" class="left-text center">Мысалы, бір пиксель [195, 11, 10] түрінде жазылуы мүмкін.</text>
  <text x="584" y="410" class="left-text center">Демек, бастапқыда сурет “мысық” емес, сандар ғана.</text>
`
      },
      {
        title: "Қадам 2. Түсті сурет — бірнеше каналдан тұрады",
        subtitle: "Әр пиксель үш сан сақтайды: R, G және B",
        name: "RGB",
        data: [
          "түсті пиксель",
          "R + G + B",
          "үш матрица"
        ],
        goal: [
          "Көрсету:",
          "түс те",
          "сандар",
          ""
        ],
  scene: `
  <text x="328" y="130" class="scene-title">Түсті сурет үш каналдан құралады</text>
  <text x="584" y="170" class="formula-small center">R + G + B = сурет</text>
  <!-- Верхний ряд -->
  <rect x="335" y="195" width="90" height="54" class="node-red" />
  <text x="380" y="218" class="node-bold center">R</text>
  <text x="380" y="238" class="small center">қызыл</text>
  <text x="447" y="224" class="formula-small center">+</text>
  <rect x="470" y="195" width="90" height="54" class="node-green" />
  <text x="515" y="218" class="node-bold center">G</text>
  <text x="515" y="238" class="small center">жасыл</text>
  <text x="582" y="224" class="formula-small center">+</text>
  <rect x="605" y="195" width="90" height="54" class="node-blue" />
  <text x="650" y="218" class="node-bold center">B</text>
  <text x="650" y="238" class="small center">көк</text>
  <text x="717" y="224" class="formula-small center">=</text>
  <!-- Қорытынды сурет -->
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
  <!-- Нижние матрицы -->
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
  <text x="584" y="418" class="left-text center">Әр канал — сандардан тұратын жеке матрица.</text>
`
      },
      {
        title: "Қадам 3. Алғашқы қабаттар қарапайым белгілерді іздейді",
        subtitle: "Мысалы: шеттер, сызықтар және контрасттар",
        name: "Шеттер",
        data: [
          "пиксельдер",
          "контрасты",
          "шеттер және сызықтар"
        ],
        goal: [
          "Көрсету:",
          "модель бастапқыда",
          "ищет қарапайым пішіндер",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Алғашқы қабаттарда модель шеттерді іздейді</text>
          <rect x="335" y="185" width="100" height="90" class="node-blue" />
          <line x1="355" y1="215" x2="415" y2="215" class="shape" />
          <line x1="355" y1="240" x2="415" y2="240" class="shape" />
          <text x="385" y="305" class="small center">көлденең</text>
          <rect x="470" y="185" width="100" height="90" class="node-blue" />
          <line x1="500" y1="205" x2="500" y2="255" class="shape" />
          <line x1="540" y1="205" x2="540" y2="255" class="shape" />
          <text x="520" y="305" class="small center">тік</text>
          <rect x="605" y="185" width="100" height="90" class="node-blue" />
          <line x1="625" y1="255" x2="685" y2="205" class="shape" />
          <text x="655" y="305" class="small center">көлбеу</text>
          <rect x="740" y="185" width="100" height="90" class="node-blue" />
          <line x1="760" y1="205" x2="820" y2="255" class="shape" />
          <line x1="820" y1="205" x2="760" y2="255" class="shape" />
          <text x="790" y="305" class="small center">бұрыш</text>
          <text x="584" y="375" class="left-text center">Модель әлі “мысықты” түсінбейді. Ол қарапайым визуалды сигналдарды көреді:</text>
          <text x="584" y="405" class="left-text center">шекаралар, түс ауысулары, сызықтар және бұрыштар.</text>
        `
      },
      {
        title: "Қадам 4. Қарапайым белгілер пішіндерге бірігеді",
        subtitle: "Сызықтар мен шеттер түсініктірек фигураларға жинала бастайды",
        name: "Пішіндер",
        data: [
          "шеттер және сызықтар",
          "объединяются",
          "едендечаются пішіндер"
        ],
        goal: [
          "Өтуді көрсету",
          "шеттерден",
          "пішіндерге өтуді",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Келесі қабаттар пішіндерді жинайды</text>
          <rect x="340" y="185" width="105" height="90" class="node-yellow" />
          <circle cx="392.5" cy="230" r="26" class="shape" />
          <text x="392.5" y="305" class="small center">шеңбер</text>
          <rect x="485" y="185" width="105" height="90" class="node-yellow" />
          <rect x="515" y="205" width="45" height="45" class="shape" />
          <text x="537.5" y="305" class="small center">шаршы</text>
          <rect x="630" y="185" width="105" height="90" class="node-yellow" />
          <path d="M657 250 L682 205 L707 250 Z" class="shape" />
          <text x="682.5" y="305" class="small center">үшбұрыш</text>
          <text x="584" y="370" class="formula-small center">шеттер → пішіндер</text>
          <text x="584" y="410" class="left-text center">Модель біртіндеп жеке сызықтардан суреттің қарапайым бөліктеріне өтеді.</text>
        `
      },
      {
        title: "Қадам 5. Пішіндер объект бөліктеріне бірігеді",
        subtitle: "Мысалы: көз, құлақ, мұрын, табан",
        name: "Бөліктер",
        data: [
          "қарапайым пішіндер",
          "узоры",
          "объект бөліктері"
        ],
        goal: [
          "Көрсету:",
          "пішіндерден пайда болады",
          "объект бөліктері",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Тереңірек қабаттар объект бөліктерін іздейді</text>
          <rect x="330" y="185" width="105" height="90" class="node-green" />
          <path d="M382 203 L410 255 L354 255 Z" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="382.5" y="305" class="small center">құлақ</text>
          <rect x="465" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="517.5" cy="230" rx="28" ry="18" class="shape-green" />
          <circle cx="517.5" cy="230" r="7" fill="#73B222" />
          <text x="517.5" y="305" class="small center">көз</text>
          <rect x="600" y="185" width="105" height="90" class="node-green" />
          <circle cx="652.5" cy="225" r="6" fill="#73B222" />
          <line x1="652.5" y1="225" x2="620" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="620" y2="240" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="210" class="shape-green" />
          <line x1="652.5" y1="225" x2="685" y2="240" class="shape-green" />
          <text x="652.5" y="305" class="small center">мұрт</text>
          <rect x="735" y="185" width="105" height="90" class="node-green" />
          <ellipse cx="787.5" cy="245" rx="26" ry="14" class="shape-green" />
          <circle cx="767" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="787" cy="214" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="807" cy="220" r="6" fill="none" stroke="#73B222" stroke-width="3"/>
          <text x="787.5" y="305" class="small center">табан</text>
          <text x="584" y="375" class="left-text center">Модельге ешкім қолмен “мынау құлақ” деп айтпайды.</text>
          <text x="584" y="405" class="left-text center">Оқыту кезінде ол тануға пайдалы белгілерді өзі табады.</text>
        `
      },
      {
        title: "Қадам 6. Объект бөліктері жалпы жауап береді",
        subtitle: "Модель белгілерді жинап, суретте не бейнеленгенін бағалайды",
        name: "Классификация",
        data: [
          "объект бөліктері",
          "собраны вместе",
          "модель даёт жауап"
        ],
        goal: [
          "Соңғы нәтижені көрсету:",
          "белгілерден",
          "едендечается класс",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Соңғы қабат кластардың ықтималдықтарын береді</text>
          <rect x="340" y="170" width="170" height="160" class="node-green" />
          <path d="M395 220 L410 190 L425 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <path d="M430 220 L445 190 L460 220" fill="none" stroke="#73B222" stroke-width="3"/>
          <ellipse cx="427.5" cy="240" rx="45" ry="35" fill="none" stroke="#73B222" stroke-width="3"/>
          <circle cx="410" cy="235" r="4" fill="#111111"/>
          <circle cx="445" cy="235" r="4" fill="#111111"/>
          <path d="M420 252 Q428 260 436 252" fill="none" stroke="#73B222" stroke-width="2"/>
          <text x="425" y="305" class="node-bold center">мысық белгілері</text>
          <text x="570" y="190" class="left-text">кот</text>
          <rect x="630" y="176" width="190" height="18" rx="4" class="bar-green"/>
          <text x="830" y="190" class="small">0.93</text>
          <text x="570" y="230" class="left-text">ит</text>
          <rect x="630" y="216" width="36" height="18" rx="4" class="bar-blue"/>
          <text x="680" y="230" class="small">0.04</text>
          <text x="570" y="270" class="left-text">түлкі</text>
          <rect x="630" y="256" width="20" height="18" rx="4" class="bar-yellow"/>
          <text x="660" y="270" class="small">0.02</text>
          <text x="570" y="310" class="left-text">басқа</text>
          <rect x="630" y="296" width="10" height="18" rx="4" class="bar-red"/>
          <text x="650" y="310" class="small">0.01</text>
          <text x="584" y="390" class="formula-small center">Модель жауабы: бұл мысыққа ұқсайды</text>
          <text x="584" y="420" class="left-text center">Модель ықтималдығы ең жоғары класты таңдайды.</text>
        `
      },
      {
        title: "Қадам 7. Модель көруінің толық логикасы",
        subtitle: "Сандардан белгілерге, белгілерден объектіге",
        name: "Толық схема",
        data: [
          "пиксельдер",
          "белгілер",
          "объект"
        ],
        goal: [
          "Барлық",
          "логику в одну",
          "простую схему",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Компьютер суретті қалай “көреді”</text>
          <rect x="320" y="190" width="90" height="70" class="node-blue" />
          <text x="365" y="215" class="node-bold center">Пиксельдер</text>
          <text x="365" y="240" class="small center">сандар</text>
          <path d="M420 225 L460 225" class="arrow" />
          <rect x="472" y="190" width="90" height="70" class="node-yellow" />
          <text x="517" y="215" class="node-bold center">Шеттер</text>
          <text x="517" y="240" class="small center">сызықтар</text>
          <path d="M572 225 L612 225" class="arrow" />
          <rect x="624" y="190" width="90" height="70" class="node-yellow" />
          <text x="669" y="215" class="node-bold center">Бөліктер</text>
          <text x="669" y="240" class="small center">көз, құлақ</text>
          <path d="M724 225 L764 225" class="arrow" />
          <rect x="776" y="190" width="80" height="70" class="node-green" />
          <text x="816" y="215" class="node-bold center">Объект</text>
          <text x="816" y="240" class="small center">кот</text>
          <text x="584" y="335" class="formula-small center">пиксельдер → шеттер → пішіндер → бөліктер → объект</text>
          <text x="584" y="385" class="left-text center">Компьютер “мысықты” бірден көрмейді.</text>
          <text x="584" y="415" class="left-text center">Ол суреттің барған сайын күрделі сипаттамасын біртіндеп құрады.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті визуализация: сурет сандық матрицаға айналады, кейін модель сол матрицадан заңдылықтар іздейді.</figcaption>
</figure>

## Компьютер мәтінді қалай жазады?

Мәтін де модель үшін сандардан тұрады. Алдымен сөйлем токендерге бөлінеді: сөздер, сөз бөліктері, тыныс белгілері немесе жеке символдар. Кейін әр токенге сандық идентификатор беріледі.

Үлкен тілдік модель өте көп мәтіндерде оқытылады. Оның негізгі оқу мақсаты өте қарапайым: алдыңғы токендерге қарап келесі токенді болжау.

Мысалы, модель мына фразаның басын көрсе:

> Мысық ... үстінде отыр

ол келесі токеннің қайсысы ықтималырақ екенін бағалауы керек: «диван», «терезе», «орындық», «еден» және т.б.

Осыны миллиардтаған рет қайталай отырып, модель грамматиканы, стильді, фактілерді, типтік пайымдау үлгілерін және тіл құрылымын үйренеді. Біз одан жауап жазуды сұрағанда, ол сол процесті жалғастырады: келесі токендердің ықтималдығын бағалап, мәтінді қадам-қадаммен генерациялайды.

Маңыздысы: LLM дайын жауапты іздеу жүйесі сияқты дерекқордан алып шықпайды. Ол мәтін жалғасын ықтималдықтар негізінде құрастырады. Сондықтан мұндай модельдер сенімді естілгенімен, кейде қателесуі мүмкін. Әсіресе фактілер, сандар, заңдар, медицина және техникалық детальдарда оларды міндетті түрде тексеру керек.
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
  <text id="mainTitle" x="24" y="34" class="title">Қадам 1. Пайдаланушы мәтін енгізеді</text>
  <text id="mainSubtitle" x="24" y="60" class="subtitle">LLM фразаның басын қабылдап, оны жалғастыруы керек</text>
  <rect x="666" y="16" width="210" height="58" class="step-pill" />
  <text id="stepCounter" x="686" y="39" class="step-top">1 / 7 қадам</text>
  <text id="stepName" x="686" y="61" class="step-bottom">Кіріс</text>
  <!-- Left column -->
  <rect x="24" y="90" width="250" height="140" class="panel" />
  <text x="50" y="122" class="left-title">Берілгені</text>
  <text id="dataLine1" x="50" y="150" class="left-text">мәтіндік сұраныс</text>
  <text id="dataLine2" x="50" y="176" class="left-text">фразаның бөлігі</text>
  <text id="dataLine3" x="50" y="202" class="left-text">жауап әлі дайын емес</text>
  <rect x="24" y="252" width="250" height="188" class="goal-panel" />
  <text x="50" y="286" class="left-title">Мақсат</text>
  <text id="goalLine1" x="50" y="316" class="left-text">Түсіну:</text>
  <text id="goalLine2" x="50" y="344" class="left-text">LLM қалай генерациялайды</text>
  <text id="goalLine3" x="50" y="372" class="left-text">мәтінді қадам-қадаммен</text>
  <text id="goalLine4" x="50" y="400" class="left-text"></text>
  <!-- Scene -->
  <rect x="292" y="90" width="584" height="350" class="scene-panel" />
  <g id="sceneContent"></g>
  <!-- Navigation -->
  <rect id="prevBtn" x="560" y="468" width="102" height="38" class="btn-disabled" />
  <text id="prevText" x="611" y="487" class="btn-text-disabled">← Артқа</text>
  <text id="bottomCounter" x="719" y="488" class="formula-small center">1 / 7</text>
  <rect id="nextBtn" x="774" y="468" width="102" height="38" class="btn" />
  <text x="825" y="487" class="btn-text">Алға →</text>
  <script>
    (function () {
      const $ = (id) => svgRoot.getElementById(id);
    const steps = [
      {
        title: "Қадам 1. Пайдаланушы мәтін енгізеді",
        subtitle: "LLM фразаның басын қабылдап, оны жалғастыруы керек",
        name: "Кіріс",
        data: [
          "мәтіндік сұраныс",
          "фразаның бөлігі",
          "жауап әлі дайын емес"
        ],
        goal: [
          "Түсіну:",
          "LLM қалай генерациялайды",
          "мәтінді қадам-қадаммен",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Пайдаланушы модельге мәтіннің басын береді</text>
          <rect x="355" y="195" width="460" height="78" class="node-yellow" />
          <text x="585" y="225" class="node-bold center">Кіріс мәтін</text>
          <text x="585" y="252" class="formula-small center">"Мысық ... отыр ..."</text>
          <text x="584" y="340" class="left-text center">Бұл кезеңде модель таңбалар тізбегін қабылдайды.</text>
          <text x="584" y="375" class="left-text center">Енді ол мәтін қандай бөліктерден тұратынын анықтауы керек.</text>
        `
      },
      {
        title: "Қадам 2. Мәтін токендерге бөлінеді",
        subtitle: "Модель тұтас фразамен емес, оның шағын бөліктерімен жұмыс істейді",
        name: "Токендер",
        data: [
          "кіріс мәтін",
          "бөліктерге бөлінеді",
          "токендер анықталады"
        ],
        goal: [
          "Көрсету:",
          "LLM мәтінді оқиды",
          "токендер арқылы",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Мәтінді токендерге бөлу</text>
          <rect x="335" y="205" width="86" height="50" class="token-blue" />
          <text x="378" y="230" class="node-bold center">Мысық</text>
          <rect x="440" y="205" width="86" height="50" class="token-yellow" />
          <text x="483" y="230" class="node-bold center">отыр</text>
          <rect x="545" y="205" width="68" height="50" class="token-blue" />
          <text x="579" y="230" class="node-bold center">...</text>
          <rect x="632" y="205" width="68" height="50" class="token-red" />
          <text x="666" y="230" class="node-bold center">...</text>
          <text x="584" y="330" class="formula-small center">Мәтін → токендер</text>
          <text x="584" y="370" class="left-text center">Токендер — модель әрі қарай жұмыс істейтін мәтіннің шағын бөліктері.</text>
        `
      },
      {
        title: "Қадам 3. Модель контекстке қарайды",
        subtitle: "Мәтінді жалғастыру үшін бұрын не жазылғаны маңызды",
        name: "Контекст",
        data: [
          "есть токендер",
          "контекст маңызды",
          "модель артқа қарайды"
        ],
        goal: [
          "Көрсету:",
          "келесі сөздің",
          "контекстке тәуелді екенін",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Болжау алдында модель контекстті ескереді</text>
          <rect x="330" y="205" width="86" height="50" class="token-blue" />
          <text x="373" y="230" class="node-bold center">Мысық</text>
          <rect x="438" y="205" width="86" height="50" class="token-yellow" />
          <text x="481" y="230" class="node-bold center">отыр</text>
          <rect x="546" y="205" width="60" height="50" class="token-blue" />
          <text x="576" y="230" class="node-bold center">...</text>
          <rect x="650" y="195" width="120" height="70" class="node-red" />
          <text x="710" y="223" class="node-bold center">Келесі</text>
          <text x="710" y="245" class="node-bold center">токен ?</text>
          <path d="M373 255 Q520 320 690 265" class="arrow-red" />
          <path d="M481 255 Q565 310 700 265" class="arrow-red" />
          <path d="M576 255 Q615 295 707 265" class="arrow-red" />
          <text x="584" y="340" class="left-text center">Модель алдыңғы токендерге қарап, түсінуге тырысады,</text>
          <text x="584" y="375" class="left-text center">осы контексте қандай жалғасы ең орынды екенін.</text>
        `
      },
      {
        title: "Қадам 4. Модель нұсқаларды бағалайды",
        subtitle: "Ол сөзді бірден таңдамайды, алдымен бірнеше үміткерді бағалайды",
        name: "Ықтималдықтар",
        data: [
          "контекст белгілі",
          "есть нұсқалар",
          "ықтималдықтар бағаланған"
        ],
        goal: [
          "Көрсету:",
          "модель салыстырады",
          "бірнеше жалғасын",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Модель мүмкін жалғастарды бағалайды</text>
          <text x="400" y="195" class="left-text">"орындықта"</text>
          <rect x="470" y="182" width="240" height="20" rx="4" class="bar-blue" />
          <text x="725" y="197" class="small">0.45</text>
          <text x="400" y="235" class="left-text">"диванда"</text>
          <rect x="470" y="222" width="160" height="20" rx="4" class="bar-yellow" />
          <text x="645" y="237" class="small">0.30</text>
          <text x="400" y="275" class="left-text">"шатырда"</text>
          <rect x="470" y="262" width="92" height="20" rx="4" class="bar-red" />
          <text x="577" y="277" class="small">0.17</text>
          <text x="400" y="315" class="left-text">"еденде"</text>
          <rect x="470" y="302" width="50" height="20" rx="4" class="bar-green" />
          <text x="535" y="317" class="small">0.08</text>
          <text x="584" y="375" class="left-text center">Бұл қадамда модель келесі токеннің қайсысы ықтималырақ екенін шешеді.</text>
        `
      },
      {
        title: "Қадам 5. Бір токен таңдалады",
        subtitle: "Нұсқалардың ішінен модель мәтіннің келесі фрагментін таңдайды",
        name: "Токен таңдау",
        data: [
          "нұсқалар оценены",
          "ең жақсысы таңдалды",
          "жаңа токен пайда болды"
        ],
        goal: [
          "Көрсету:",
          "генерация жүреді",
          "бір токеннен",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Келесі токен таңдалды</text>
          <rect x="350" y="205" width="150" height="68" class="node-blue" />
          <text x="425" y="232" class="node-bold center">Контекст</text>
          <text x="425" y="255" class="small center">"Мысық ... отыр"</text>
          <path d="M513 239 L580 239" class="arrow" />
          <rect x="595" y="195" width="160" height="88" class="node-green" />
          <text x="675" y="223" class="node-bold center">Жаңа токен</text>
          <text x="675" y="253" class="formula-small center">"орындықта"</text>
          <text x="584" y="350" class="formula-small center">Модель әр жолы бір токен қосады</text>
          <text x="584" y="390" class="left-text center">Ол әлі бүкіл жауапты жазған жоқ — тек келесі жалғасын таңдады.</text>
        `
      },
      {
        title: "Қадам 6. Жаңа токен кіріске қосылады",
        subtitle: "Осыдан кейін модель сол процесті қайтадан қайталайды",
        name: "Қайталау",
        data: [
          "жаңа токен қосылды",
          "контекст кеңейді",
          "цикл қайталанады"
        ],
        goal: [
          "Циклді көрсету",
          "болжау →",
          "қосу → қайталау",
          ""
        ],
 scene: `
  <text x="328" y="130" class="scene-title">Авторегрессия: модель бір циклді қайта-қайта орындайды</text>
  <rect x="360" y="180" width="190" height="60" class="node-blue" />
  <text x="455" y="210" class="node-bold center">"Мысық ... отыр"</text>
  <path d="M563 210 L605 210" class="arrow" />
  <rect x="620" y="180" width="110" height="60" class="node-green" />
  <text x="675" y="210" class="node-bold center">"орындықта"</text>
  <path d="M675 250 C675 300, 450 300, 450 252" class="arrow" />
  <rect x="360" y="310" width="410" height="60" class="node-yellow" />
  <text x="565" y="340" class="node-bold center">Жаңа кіріс: "Мысық ... отыр орындықта ..."</text>
  <text x="584" y="395" class="left-text center">Енді модель келесі токенді қайта бағалайды:</text>
  <text x="584" y="420" class="left-text center">мысалы, "және", "жанында", "терезе жанында" және т.б.</text>
`
      },
      {
        title: "Қадам 7. Осылайша толық жауап жиналады",
        subtitle: "Мәтін модель фразаны аяқтағанға дейін токен сайын өседі",
        name: "Дайын мәтін",
        data: [
          "цикл көп рет қайталанды",
          "мәтін постепенно собран",
          "жауап дайын"
        ],
        goal: [
          "Нәтижені көрсету:",
          "LLM мәтінді құрады",
          "қадам-қадаммен",
          ""
        ],
        scene: `
          <text x="328" y="130" class="scene-title">Нәтиже біртіндеп пайда болады</text>
          <rect x="340" y="175" width="440" height="165" class="node-yellow" />
          <text x="370" y="210" class="small">қадам 1  →  "Мысық ... отыр <tspan font-weight="800">орындықта</tspan>"</text>
          <text x="370" y="245" class="small">қадам 2  →  "Мысық ... отыр орындықта <tspan font-weight="800">және</tspan>"</text>
          <text x="370" y="280" class="small">қадам 3  →  "Мысық ... отыр орындықта және <tspan font-weight="800">қарап отыр</tspan>"</text>
          <text x="370" y="315" class="small">қадам 4  →  "Мысық ... отыр орындықта және қарап отыр <tspan font-weight="800">терезеге.</tspan>"</text>
          <text x="584" y="380" class="formula-small center">LLM мәтінді токен сайын генерациялайды</text>
          <text x="584" y="412" class="left-text center">Ол бүкіл жауапты бірден жазбайды — бір циклді көп рет қайталайды.</text>
        `
      }
    ];
    let currentStep = 0;
    function renderStep() {
      const step = steps[currentStep];
      $("mainTitle").textContent = step.title;
      $("mainSubtitle").textContent = step.subtitle;
      $("stepCounter").textContent = `${currentStep + 1} / ${steps.length} қадам`;
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
<figcaption>Интерактивті визуализация: LLM мәтінді алады, оны токендерге бөледі және келесі токенді ықтималдықтар бойынша таңдайды.</figcaption>
</figure>

## Терең оқыту — неге «терең»?

«Тереңдік»  нейрондық желідегі қабаттар саны мағынасында қолданылады. Қарапайым желіде бір немесе бірнеше қабат болуы мүмкін. Терең желіде ондаған, жүздеген, кейде одан да көп есептеу блоктары болады.

Әр қабат деректерді жаңа көрініске айналдырады. Компьютерлік көруде алғашқы қабаттар қарапайым элементтерге жауап беруі мүмкін: шекаралар, бұрыштар, түсті дақтар. Келесі қабаттар олардан пішіндер жинайды. Тереңірек қабаттар объект бөліктерін таниды. Тек шығысқа жақындағанда жоғары деңгейлі көрініс пайда болады: «мысыққа ұқсайды», «көлікке ұқсайды», «бетке ұқсайды».

Мәтінде идея ұқсас: ерте деңгейлер токендермен және жергілікті байланыстармен жұмыс істейді, ал тереңірек блоктар сөздер, фразалар және мағыналық бөліктер арасындағы күрделі тәуелділіктерді құруға көмектеседі.

Дәл осы көріністер иерархиясы терең оқытуды қуатты етеді. Модель белгілерді толығымен қолмен алмайды. Ол оларды өзі біртіндеп құрады — қарапайымнан абстрактіліге қарай.

## Қорытынды

Барлығын жинақтасақ:

- жасанды интеллект — машинада ақылды мінез-құлықты қайталауға тырысу;
- машиналық оқыту — ЖИ ішіндегі заманауи тәсіл, мұнда машина қолмен жазылған ережелердің орнына деректерден үйренеді;
- терең оқыту — көпқабатты нейрондық желілерге негізделген машиналық оқытудың бөлігі;
- компьютерлік көру модельге суреттерді сандық матрицалар ретінде түсінуді үйретеді;
- үлкен тілдік модельдер мәтінмен токендер тізбегі ретінде жұмыс істейді және келесі токенді болжауға үйренеді.

Негізгі идея қарапайым: қазіргі ЖИ қуатты, себебі бағдарламашы барлық ережені алдын ала жазып қойған жоқ. Ол қуатты, себебі модель деректерден күрделі заңдылықтарды тауып, оларды жаңа жағдайларға қолдана алады.
