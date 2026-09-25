<p class="lead">
Языковая модель — это полезное упрощение языка, которое сохраняет от него одно
умение: по уже написанному тексту оценить, какое слово может идти дальше. Всё
остальное — и чат-бот, и обучение на половине интернета, и трансформер с
вниманием, и генерация длинного ответа — надстройки над этой одной операцией,
повторённой много раз.
</p>
<p>
Начнём не с нейросетей, а с вопроса, что вообще называют моделью и чем хорошая
модель отличается от плохой. Отсюда вырастет главный вопрос статьи — как
построить модель языка. Ответ на него пойдёт по понятному маршруту: сначала
увидим, что чат — это цикл дописывания по одному слову; потом разберёмся,
откуда у машины берётся умение угадывать это слово; затем заглянем внутрь
трансформера и в конце соберём всё обратно в авторегрессионный вывод — формулу
того самого цикла. Математики почти нет: нужны логарифм в паре мест и понимание,
что такое вероятность.
</p>
<div class="reading-contract">
<div class="contract-card">
<span>На входе</span>
<strong>Ничего специального</strong>
<p>Достаточно знать, что вероятности неотрицательны и в сумме дают единицу.</p>
</div>
<div class="contract-card">
<span>Сквозные примеры</span>
<strong>Поезд, оторванный диалог и одна фраза</strong>
<p>Игрушечный поезд объясняет, что такое модель; обрывок диалога с ассистентом —
как работает чат; фраза «Я добавил молоко в кофе.» — как текст рождается по токену.</p>
</div>
<div class="contract-card">
<span>На выходе</span>
<strong>Вы сможете объяснить</strong>
<p>Что именно моделирует языковая модель, почему один вопрос даёт разные ответы
и как из предсказания одного слова получается целый текст.</p>
</div>
</div>
<div class="semantic-key" aria-label="Цветовые обозначения статьи">
<span><i style="background:#3576C0"></i>текст и данные</span>
<span><i style="background:#C29E08"></i>модель, параметры, операция</span>
<span><i style="background:#73B222"></i>результат, предсказание</span>
<span><i style="background:#C30B0A"></i>ошибка и обратный проход</span>
</div>
<div class="callout-blue">
<strong>Как работать с интерактивами:</strong> нажимайте «Далее» и смотрите не
на всю схему сразу, а только на яркую часть. Положение объектов не меняется,
поэтому от шага к шагу меняется смысл, а не карта перед глазами. Стрелки на
клавиатуре работают, когда сцена в фокусе.
</div>
<h2 id="part-1">Часть 1. Что такое модель и какая модель хорошая</h2>
<p>
Слово «модель» часто звучит как название сложной нейросети. Но игрушечный поезд,
карта города и прогноз погоды — тоже модели. Во всех случаях мы берём сложный
объект и оставляем только те свойства, которые нужны для выбранной задачи.
</p>
<p>
Карта не обязана быть похожей на город во всех деталях. Ей достаточно сохранять
улицы, расстояния и связи между районами. <strong>Хорошая модель сохраняет те свойства объекта, которые нужны
для ответа на выбранный вопрос, и отбрасывает остальные.</strong>
Поэтому у одного и того же объекта может быть несколько хороших моделей — по одной
на каждый вопрос.
</p>
<p>Посмотрим пошагово, как идея модели доходит от игрушки до языка.</p>
<div class="stage" id="stageMd" tabindex="0">
<div class="stage-figure">
<svg id="md" viewBox="0 0 960 560" role="img" aria-label="Что такое модель: упрощение, выбор под задачу, эксперимент, вероятности исходов и переход к языку">
  <style>
    #md { font-family: Helvetica, Arial, sans-serif; }
    #md .title { font-size:24px; font-weight:700; fill:#111111; }
    #md .h { font-size:17px; font-weight:700; fill:#111111; }
    #md .text { font-size:16px; fill:#111111; }
    #md .cap { font-size:14px; fill:#111111; }
    #md .small { font-size:13px; fill:#5E5850; }
    #md .tiny { font-size:12px; fill:#5E5850; }
    #md .mid { text-anchor:middle; }
    #md .blue { fill:#3576C0; } #md .yellow { fill:#C29E08; } #md .green { fill:#73B222; } #md .red { fill:#C30B0A; }
    #md .box-blue { fill:#F0F6FC; stroke:#3576C0; stroke-width:1.6; }
    #md .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.6; }
    #md .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.6; }
    #md .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.6; }
    #md .box-gray { fill:#FAFAF9; stroke:#B9B4AB; stroke-width:1.3; }
    #md .bar-bg { fill:#ECEAE5; }
    #md .bar-blue { fill:#3576C0; } #md .bar-green { fill:#73B222; } #md .bar-red { fill:#C30B0A; }
    #md .arrow { fill:none; stroke:#C29E08; stroke-width:3; marker-end:url(#md-ay); }
    #md .arrow-blue { fill:none; stroke:#3576C0; stroke-width:2.5; marker-end:url(#md-ab); }
    #md .rail { stroke:#5E5850; stroke-width:2; fill:none; }
    #md .shape-gray { fill:#FFFFFF; stroke:#5E5850; stroke-width:2; }
    #md .shape-blue { fill:#FFFFFF; stroke:#3576C0; stroke-width:2; }
    #md .screen { fill:#F7FAFD; stroke:#3576C0; stroke-width:1.2; }
    #md .chip { fill:#FFFFFF; stroke:#D8D4CC; stroke-width:1.3; }
    #md .chip-on { fill:#FFFBEB; stroke:#C29E08; stroke-width:2.2; }
    #md .loop { fill:none; stroke:#5E5850; stroke-width:1.8; stroke-dasharray:6 4; marker-end:url(#md-ag); }
  </style>
<defs>
<marker id="md-ay" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#C29E08"/></marker>
<marker id="md-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#3576C0"/></marker>
<marker id="md-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#5E5850"/></marker>
<g id="mdt-all">
<defs>
<filter id="mdt-filter-remove-color" x="0%" y="0%" width="100%" height="100%">
<feColorMatrix color-interpolation-filters="sRGB" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
</filter>
<mask id="mdt-mask-0">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-0">
<path clip-rule="nonzero" d="M 0.808594 0.460938 L 12.46875 0.460938 L 12.46875 12.121094 L 0.808594 12.121094 Z M 0.808594 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-1">
<rect x="0" y="0" width="13" height="13"/>
</clipPath>
<g id="mdt-source-5" clip-path="url(#mdt-clip-1)">
<g clip-path="url(#mdt-clip-0)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.46875 0.460938 L 5.070312 0.460938 C 2.71875 0.460938 0.808594 2.367188 0.808594 4.726562 L 0.808594 12.121094 Z M 12.46875 0.460938 "/>
</g>
</g>
<mask id="mdt-mask-1">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-2">
<path clip-rule="nonzero" d="M 0.925781 0.460938 L 26.027344 0.460938 L 26.027344 22.273438 L 0.925781 22.273438 Z M 0.925781 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-3">
<rect x="0" y="0" width="27" height="23"/>
</clipPath>
<g id="mdt-source-8" clip-path="url(#mdt-clip-3)">
<g clip-path="url(#mdt-clip-2)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 4.214844 22.273438 C 11.484375 15.003906 18.757812 7.730469 26.027344 0.460938 L 19.539062 0.460938 L 0.925781 19.074219 C 1.300781 20.683594 2.589844 21.941406 4.214844 22.273438 "/>
</g>
</g>
<mask id="mdt-mask-2">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-4">
<path clip-rule="nonzero" d="M 0.191406 0.460938 L 30.675781 0.460938 L 30.675781 22.367188 L 0.191406 22.367188 Z M 0.191406 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-5">
<rect x="0" y="0" width="31" height="23"/>
</clipPath>
<g id="mdt-source-11" clip-path="url(#mdt-clip-5)">
<g clip-path="url(#mdt-clip-4)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 30.675781 2.285156 C 29.90625 1.183594 28.632812 0.460938 27.1875 0.460938 L 22.097656 0.460938 C 14.796875 7.765625 7.492188 15.066406 0.191406 22.371094 L 10.59375 22.371094 C 17.289062 15.675781 23.980469 8.980469 30.675781 2.285156 "/>
</g>
</g>
<mask id="mdt-mask-3">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-6">
<path clip-rule="nonzero" d="M 0.664062 0.582031 L 14.449219 0.582031 L 14.449219 14.367188 L 0.664062 14.367188 Z M 0.664062 0.582031 "/>
</clipPath>
<clipPath id="mdt-clip-7">
<rect x="0" y="0" width="15" height="15"/>
</clipPath>
<g id="mdt-source-14" clip-path="url(#mdt-clip-7)">
<g clip-path="url(#mdt-clip-6)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 11.199219 14.234375 C 12.238281 13.195312 13.277344 12.160156 14.316406 11.121094 C 14.394531 10.792969 14.449219 10.457031 14.449219 10.105469 L 14.449219 0.582031 C 9.855469 5.175781 5.257812 9.773438 0.664062 14.371094 L 10.1875 14.371094 C 10.539062 14.371094 10.875 14.3125 11.199219 14.234375 "/>
</g>
</g>
<mask id="mdt-mask-4">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-8">
<path clip-rule="nonzero" d="M 0.476562 0.460938 L 13.972656 0.460938 L 13.972656 13.960938 L 0.476562 13.960938 Z M 0.476562 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-9">
<rect x="0" y="0" width="14" height="14"/>
</clipPath>
<g id="mdt-source-17" clip-path="url(#mdt-clip-9)">
<g clip-path="url(#mdt-clip-8)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.972656 0.460938 L 4.738281 0.460938 C 4.234375 0.460938 3.757812 0.566406 3.308594 0.726562 L 0.738281 3.292969 C 0.578125 3.742188 0.472656 4.21875 0.472656 4.726562 L 0.472656 13.960938 C 4.972656 9.460938 9.472656 4.960938 13.972656 0.460938 "/>
</g>
</g>
<mask id="mdt-mask-5">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-10">
<path clip-rule="nonzero" d="M 0.0820312 0.335938 L 8.117188 0.335938 L 8.117188 8.367188 L 0.0820312 8.367188 Z M 0.0820312 0.335938 "/>
</clipPath>
<clipPath id="mdt-clip-11">
<rect x="0" y="0" width="9" height="9"/>
</clipPath>
<g id="mdt-source-20" clip-path="url(#mdt-clip-11)">
<g clip-path="url(#mdt-clip-10)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.0820312 8.367188 L 3.855469 8.367188 C 6.207031 8.367188 8.117188 6.460938 8.117188 4.105469 L 8.117188 0.335938 C 5.4375 3.011719 2.757812 5.691406 0.0820312 8.367188 "/>
</g>
</g>
<mask id="mdt-mask-6">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-12">
<path clip-rule="nonzero" d="M 0.871094 0.546875 L 26.117188 0.546875 L 26.117188 22.367188 L 0.871094 22.367188 Z M 0.871094 0.546875 "/>
</clipPath>
<clipPath id="mdt-clip-13">
<rect x="0" y="0" width="27" height="23"/>
</clipPath>
<g id="mdt-source-23" clip-path="url(#mdt-clip-13)">
<g clip-path="url(#mdt-clip-12)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 26.117188 7.265625 L 26.117188 4.726562 C 26.117188 2.65625 24.644531 0.9375 22.691406 0.546875 L 0.871094 22.367188 L 11.011719 22.367188 Z M 26.117188 7.265625 "/>
</g>
</g>
<mask id="mdt-mask-7">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-14">
<path clip-rule="nonzero" d="M 0.136719 0.460938 L 30.707031 0.460938 L 30.707031 22.367188 L 0.136719 22.367188 Z M 0.136719 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-15">
<rect x="0" y="0" width="31" height="23"/>
</clipPath>
<g id="mdt-source-26" clip-path="url(#mdt-clip-15)">
<g clip-path="url(#mdt-clip-14)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 30.707031 0.460938 L 20.042969 0.460938 C 13.40625 7.097656 6.773438 13.730469 0.136719 20.367188 C 0.890625 21.566406 2.214844 22.367188 3.738281 22.367188 L 8.800781 22.367188 C 16.101562 15.066406 23.402344 7.765625 30.707031 0.460938 "/>
</g>
</g>
<mask id="mdt-mask-8">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-16">
<path clip-rule="nonzero" d="M 0.378906 0.460938 L 31.386719 0.460938 L 31.386719 22.367188 L 0.378906 22.367188 Z M 0.378906 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-17">
<rect x="0" y="0" width="32" height="23"/>
</clipPath>
<g id="mdt-source-29" clip-path="url(#mdt-clip-17)">
<g clip-path="url(#mdt-clip-16)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 31.386719 0.460938 L 22.285156 0.460938 L 0.378906 22.367188 L 9.476562 22.367188 Z M 31.386719 0.460938 "/>
</g>
</g>
<mask id="mdt-mask-9">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-18">
<path clip-rule="nonzero" d="M 0.546875 0.371094 L 19.78125 0.371094 L 19.78125 19.367188 L 0.546875 19.367188 Z M 0.546875 0.371094 "/>
</clipPath>
<clipPath id="mdt-clip-19">
<rect x="0" y="0" width="20" height="20"/>
</clipPath>
<g id="mdt-source-32" clip-path="url(#mdt-clip-19)">
<g clip-path="url(#mdt-clip-18)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 19.78125 5.84375 L 19.78125 1.726562 C 19.78125 1.25 19.6875 0.800781 19.542969 0.371094 L 0.546875 19.367188 L 6.257812 19.367188 C 10.765625 14.859375 15.273438 10.351562 19.78125 5.84375 "/>
</g>
</g>
<mask id="mdt-mask-10">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-20">
<path clip-rule="nonzero" d="M 0.324219 0.910156 L 6.78125 0.910156 L 6.78125 7.367188 L 0.324219 7.367188 Z M 0.324219 0.910156 "/>
</clipPath>
<clipPath id="mdt-clip-21">
<rect x="0" y="0" width="7" height="8"/>
</clipPath>
<g id="mdt-source-35" clip-path="url(#mdt-clip-21)">
<g clip-path="url(#mdt-clip-20)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.328125 7.367188 L 2.519531 7.367188 C 4.875 7.367188 6.78125 5.460938 6.78125 3.105469 L 6.78125 0.910156 Z M 0.328125 7.367188 "/>
</g>
</g>
<mask id="mdt-mask-11">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-22">
<path clip-rule="nonzero" d="M 0.140625 0.460938 L 21.21875 0.460938 L 21.21875 20.664062 L 0.140625 20.664062 Z M 0.140625 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-23">
<rect x="0" y="0" width="22" height="21"/>
</clipPath>
<g id="mdt-source-38" clip-path="url(#mdt-clip-23)">
<g clip-path="url(#mdt-clip-22)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.21875 0.460938 L 8.988281 0.460938 L 0.140625 9.308594 L 0.140625 18.105469 C 0.140625 19.070312 0.472656 19.949219 1.011719 20.664062 C 7.746094 13.929688 14.484375 7.195312 21.21875 0.460938 "/>
</g>
</g>
<mask id="mdt-mask-12">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-24">
<path clip-rule="nonzero" d="M 0.859375 0.394531 L 14.191406 0.394531 L 14.191406 13.722656 L 0.859375 13.722656 Z M 0.859375 0.394531 "/>
</clipPath>
<clipPath id="mdt-clip-25">
<rect x="0" y="0" width="15" height="14"/>
</clipPath>
<g id="mdt-source-41" clip-path="url(#mdt-clip-25)">
<g clip-path="url(#mdt-clip-24)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.859375 13.722656 L 9.390625 13.722656 C 12.042969 13.722656 14.191406 11.570312 14.191406 8.921875 L 14.191406 0.390625 Z M 0.859375 13.722656 "/>
</g>
</g>
<mask id="mdt-mask-13">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-26">
<path clip-rule="nonzero" d="M 0.246094 0.460938 L 22.191406 0.460938 L 22.191406 26.011719 L 0.246094 26.011719 Z M 0.246094 0.460938 "/>
</clipPath>
<clipPath id="mdt-clip-27">
<rect x="0" y="0" width="23" height="27"/>
</clipPath>
<g id="mdt-source-44" clip-path="url(#mdt-clip-27)">
<g clip-path="url(#mdt-clip-26)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 2.5 26.011719 L 22.191406 6.320312 L 22.191406 0.460938 C 14.875 7.773438 7.5625 15.089844 0.246094 22.40625 C 0.402344 23.933594 1.265625 25.246094 2.5 26.011719 "/>
</g>
</g>
<mask id="mdt-mask-14">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-28">
<path clip-rule="nonzero" d="M 0.195312 0.00390625 L 8.3125 0.00390625 L 8.3125 8.121094 L 0.195312 8.121094 Z M 0.195312 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-29">
<rect x="0" y="0" width="9" height="9"/>
</clipPath>
<g id="mdt-source-47" clip-path="url(#mdt-clip-29)">
<g clip-path="url(#mdt-clip-28)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 8.3125 0.00390625 L 5 0.00390625 C 2.34375 0.00390625 0.195312 2.152344 0.195312 4.804688 L 0.195312 8.121094 Z M 8.3125 0.00390625 "/>
</g>
</g>
<mask id="mdt-mask-15">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-30">
<path clip-rule="nonzero" d="M 0.195312 0.00390625 L 19.867188 0.00390625 L 19.867188 20.382812 L 0.195312 20.382812 Z M 0.195312 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-31">
<rect x="0" y="0" width="20" height="21"/>
</clipPath>
<g id="mdt-source-50" clip-path="url(#mdt-clip-31)">
<g clip-path="url(#mdt-clip-30)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 15.382812 0.00390625 L 0.195312 15.191406 L 0.195312 20.382812 C 6.753906 13.828125 13.3125 7.269531 19.867188 0.710938 C 19.144531 0.269531 18.300781 0.00390625 17.390625 0.00390625 Z M 15.382812 0.00390625 "/>
</g>
</g>
<mask id="mdt-mask-16">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-32">
<path clip-rule="nonzero" d="M 0.390625 0.00390625 L 19.789062 0.00390625 L 19.789062 19.960938 L 0.390625 19.960938 Z M 0.390625 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-33">
<rect x="0" y="0" width="20" height="20"/>
</clipPath>
<g id="mdt-source-53" clip-path="url(#mdt-clip-33)">
<g clip-path="url(#mdt-clip-32)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 19.789062 0.5625 C 19.125 0.21875 18.382812 0.00390625 17.585938 0.00390625 L 9.582031 0.00390625 L 0.390625 9.195312 L 0.390625 19.960938 C 6.855469 13.496094 13.324219 7.03125 19.789062 0.5625 "/>
</g>
</g>
<mask id="mdt-mask-17">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-34">
<path clip-rule="nonzero" d="M 0.734375 0.0703125 L 17.386719 0.0703125 L 17.386719 16.722656 L 0.734375 16.722656 Z M 0.734375 0.0703125 "/>
</clipPath>
<clipPath id="mdt-clip-35">
<rect x="0" y="0" width="18" height="17"/>
</clipPath>
<g id="mdt-source-56" clip-path="url(#mdt-clip-35)">
<g clip-path="url(#mdt-clip-34)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 17.386719 8.609375 L 17.386719 0.0742188 C 11.835938 5.621094 6.285156 11.171875 0.734375 16.722656 L 9.273438 16.722656 C 11.976562 14.019531 14.683594 11.316406 17.386719 8.609375 "/>
</g>
</g>
<mask id="mdt-mask-18">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-36">
<path clip-rule="nonzero" d="M 0.398438 0.0390625 L 22.386719 0.0390625 L 22.386719 24.320312 L 0.398438 24.320312 Z M 0.398438 0.0390625 "/>
</clipPath>
<clipPath id="mdt-clip-37">
<rect x="0" y="0" width="23" height="25"/>
</clipPath>
<g id="mdt-source-59" clip-path="url(#mdt-clip-37)">
<g clip-path="url(#mdt-clip-36)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 22.386719 3.003906 L 22.386719 0.0390625 L 0.402344 22.023438 C 0.417969 22.863281 0.667969 23.640625 1.066406 24.320312 C 8.171875 17.214844 15.277344 10.109375 22.386719 3.003906 "/>
</g>
</g>
<mask id="mdt-mask-19">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-38">
<path clip-rule="nonzero" d="M 0.585938 0.00390625 L 14.992188 0.00390625 L 14.992188 14.410156 L 0.585938 14.410156 Z M 0.585938 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-39">
<rect x="0" y="0" width="15" height="15"/>
</clipPath>
<g id="mdt-source-62" clip-path="url(#mdt-clip-39)">
<g clip-path="url(#mdt-clip-38)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 14.992188 0.00390625 L 6.453125 0.00390625 C 4.5 1.960938 2.542969 3.914062 0.585938 5.871094 L 0.585938 14.410156 Z M 14.992188 0.00390625 "/>
</g>
</g>
<mask id="mdt-mask-20">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-40">
<path clip-rule="nonzero" d="M 0.585938 0.175781 L 22.578125 0.175781 L 22.578125 29.351562 L 0.585938 29.351562 Z M 0.585938 0.175781 "/>
</clipPath>
<clipPath id="mdt-clip-41">
<rect x="0" y="0" width="23" height="30"/>
</clipPath>
<g id="mdt-source-65" clip-path="url(#mdt-clip-41)">
<g clip-path="url(#mdt-clip-40)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 2.035156 29.351562 C 8.882812 22.503906 15.730469 15.65625 22.582031 8.808594 L 22.582031 3.804688 C 22.582031 2.347656 21.917969 1.054688 20.890625 0.175781 L 0.585938 20.480469 L 0.585938 25.921875 C 0.585938 27.265625 1.140625 28.480469 2.035156 29.351562 "/>
</g>
</g>
<mask id="mdt-mask-21">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-42">
<path clip-rule="nonzero" d="M 0.738281 0.878906 L 15.578125 0.878906 L 15.578125 15.722656 L 0.738281 15.722656 Z M 0.738281 0.878906 "/>
</clipPath>
<clipPath id="mdt-clip-43">
<rect x="0" y="0" width="16" height="16"/>
</clipPath>
<g id="mdt-source-68" clip-path="url(#mdt-clip-43)">
<g clip-path="url(#mdt-clip-42)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.738281 15.722656 L 10.777344 15.722656 C 13.429688 15.722656 15.582031 13.570312 15.582031 10.921875 L 15.582031 0.878906 C 10.632812 5.828125 5.683594 10.773438 0.738281 15.722656 "/>
</g>
</g>
<mask id="mdt-mask-22">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-44">
<path clip-rule="nonzero" d="M 0.777344 0.00390625 L 21.679688 0.00390625 L 21.679688 22.683594 L 0.777344 22.683594 Z M 0.777344 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-45">
<rect x="0" y="0" width="22" height="23"/>
</clipPath>
<g id="mdt-source-71" clip-path="url(#mdt-clip-45)">
<g clip-path="url(#mdt-clip-44)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.679688 1.785156 C 20.796875 0.707031 19.476562 0.00390625 17.972656 0.00390625 L 8.457031 0.00390625 C 5.898438 2.5625 3.335938 5.121094 0.78125 7.679688 L 0.78125 22.683594 C 7.746094 15.71875 14.710938 8.75 21.679688 1.785156 "/>
</g>
</g>
<mask id="mdt-mask-23">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-46">
<path clip-rule="nonzero" d="M 0.859375 0.808594 L 10.773438 0.808594 L 10.773438 10.722656 L 0.859375 10.722656 Z M 0.859375 0.808594 "/>
</clipPath>
<clipPath id="mdt-clip-47">
<rect x="0" y="0" width="11" height="11"/>
</clipPath>
<g id="mdt-source-74" clip-path="url(#mdt-clip-47)">
<g clip-path="url(#mdt-clip-46)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.859375 10.722656 L 5.972656 10.722656 C 8.625 10.722656 10.777344 8.570312 10.777344 5.921875 L 10.777344 0.808594 C 7.46875 4.113281 4.167969 7.417969 0.859375 10.722656 "/>
</g>
</g>
<mask id="mdt-mask-24">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-48">
<path clip-rule="nonzero" d="M 0.363281 0.757812 L 21.773438 0.757812 L 21.773438 24.722656 L 0.363281 24.722656 Z M 0.363281 0.757812 "/>
</clipPath>
<clipPath id="mdt-clip-49">
<rect x="0" y="0" width="22" height="25"/>
</clipPath>
<g id="mdt-source-77" clip-path="url(#mdt-clip-49)">
<g clip-path="url(#mdt-clip-48)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 4.582031 24.722656 L 4.789062 24.722656 C 10.453125 19.058594 16.113281 13.398438 21.773438 7.738281 L 21.773438 0.757812 C 14.640625 7.894531 7.5 15.035156 0.363281 22.171875 C 1.171875 23.683594 2.746094 24.722656 4.582031 24.722656 "/>
</g>
</g>
<mask id="mdt-mask-25">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-50">
<path clip-rule="nonzero" d="M 0.976562 0.00390625 L 6.511719 0.00390625 L 6.511719 5.539062 L 0.976562 5.539062 Z M 0.976562 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-51">
<rect x="0" y="0" width="7" height="6"/>
</clipPath>
<g id="mdt-source-80" clip-path="url(#mdt-clip-51)">
<g clip-path="url(#mdt-clip-50)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 6.511719 0.00390625 L 5.777344 0.00390625 C 3.125 0.00390625 0.976562 2.152344 0.976562 4.804688 L 0.976562 5.539062 Z M 6.511719 0.00390625 "/>
</g>
</g>
<mask id="mdt-mask-26">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-52">
<path clip-rule="nonzero" d="M 0.976562 0.00390625 L 21.683594 0.00390625 L 21.683594 22.261719 L 0.976562 22.261719 Z M 0.976562 0.00390625 "/>
</clipPath>
<clipPath id="mdt-clip-53">
<rect x="0" y="0" width="22" height="23"/>
</clipPath>
<g id="mdt-source-83" clip-path="url(#mdt-clip-53)">
<g clip-path="url(#mdt-clip-52)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.683594 1.554688 C 20.804688 0.605469 19.5625 0.00390625 18.167969 0.00390625 L 13.578125 0.00390625 C 9.378906 4.203125 5.175781 8.40625 0.972656 12.609375 L 0.972656 22.261719 C 7.875 15.359375 14.78125 8.457031 21.683594 1.554688 "/>
</g>
</g>
<mask id="mdt-mask-27">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-54">
<path clip-rule="nonzero" d="M 0.410156 0.335938 L 21.96875 0.335938 L 21.96875 24.722656 L 0.410156 24.722656 Z M 0.410156 0.335938 "/>
</clipPath>
<clipPath id="mdt-clip-55">
<rect x="0" y="0" width="22" height="25"/>
</clipPath>
<g id="mdt-source-86" clip-path="url(#mdt-clip-55)">
<g clip-path="url(#mdt-clip-54)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 4.777344 24.722656 L 6.570312 24.722656 C 11.703125 19.589844 16.835938 14.457031 21.96875 9.320312 L 21.96875 0.335938 L 0.410156 21.894531 C 1.164062 23.558594 2.832031 24.722656 4.777344 24.722656 "/>
</g>
</g>
<mask id="mdt-mask-28">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-56">
<path clip-rule="nonzero" d="M 0.640625 0.390625 L 8.96875 0.390625 L 8.96875 8.722656 L 0.640625 8.722656 Z M 0.640625 0.390625 "/>
</clipPath>
<clipPath id="mdt-clip-57">
<rect x="0" y="0" width="9" height="9"/>
</clipPath>
<g id="mdt-source-89" clip-path="url(#mdt-clip-57)">
<g clip-path="url(#mdt-clip-56)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.640625 8.722656 L 4.167969 8.722656 C 6.820312 8.722656 8.96875 6.570312 8.96875 3.921875 L 8.96875 0.390625 C 6.195312 3.167969 3.414062 5.945312 0.640625 8.722656 "/>
</g>
</g>
<mask id="mdt-mask-29">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-58">
<path clip-rule="nonzero" d="M 0.742188 0.902344 L 21.820312 0.902344 L 21.820312 24.519531 L 0.742188 24.519531 Z M 0.742188 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-59">
<rect x="0" y="0" width="22" height="25"/>
</clipPath>
<g id="mdt-source-92" clip-path="url(#mdt-clip-59)">
<g clip-path="url(#mdt-clip-58)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.742188 11.003906 L 0.742188 24.519531 C 7.769531 17.492188 14.792969 10.464844 21.820312 3.441406 L 21.820312 0.902344 L 10.839844 0.902344 C 7.476562 4.273438 4.109375 7.636719 0.742188 11.003906 "/>
</g>
</g>
<mask id="mdt-mask-30">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-60">
<path clip-rule="nonzero" d="M 0.742188 0.902344 L 3.773438 0.902344 L 3.773438 3.933594 L 0.742188 3.933594 Z M 0.742188 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-61">
<rect x="0" y="0" width="4" height="4"/>
</clipPath>
<g id="mdt-source-95" clip-path="url(#mdt-clip-61)">
<g clip-path="url(#mdt-clip-60)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 3.773438 0.90625 L 0.742188 0.90625 L 0.742188 3.933594 C 1.75 2.925781 2.761719 1.914062 3.773438 0.90625 "/>
</g>
</g>
<mask id="mdt-mask-31">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-62">
<path clip-rule="nonzero" d="M 0.257812 0.511719 L 20.820312 0.511719 L 20.820312 21.074219 L 0.257812 21.074219 Z M 0.257812 0.511719 "/>
</clipPath>
<clipPath id="mdt-clip-63">
<rect x="0" y="0" width="21" height="22"/>
</clipPath>
<g id="mdt-source-98" clip-path="url(#mdt-clip-63)">
<g clip-path="url(#mdt-clip-62)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 20.820312 12.589844 L 20.820312 0.511719 C 13.964844 7.363281 7.113281 14.21875 0.257812 21.070312 L 12.335938 21.070312 C 15.164062 18.242188 17.992188 15.414062 20.820312 12.589844 "/>
</g>
</g>
<mask id="mdt-mask-32">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-64">
<path clip-rule="nonzero" d="M 0.332031 0.902344 L 21.40625 0.902344 L 21.40625 31.074219 L 0.332031 31.074219 Z M 0.332031 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-65">
<rect x="0" y="0" width="22" height="32"/>
</clipPath>
<g id="mdt-source-101" clip-path="url(#mdt-clip-65)">
<g clip-path="url(#mdt-clip-64)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.40625 11.191406 L 21.40625 0.90625 L 20.574219 0.90625 C 13.828125 7.652344 7.078125 14.398438 0.332031 21.148438 L 0.332031 31.074219 L 1.527344 31.074219 C 8.152344 24.445312 14.78125 17.816406 21.40625 11.191406 "/>
</g>
</g>
<mask id="mdt-mask-33">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-66">
<path clip-rule="nonzero" d="M 0.597656 0.261719 L 13.40625 0.261719 L 13.40625 13.074219 L 0.597656 13.074219 Z M 0.597656 0.261719 "/>
</clipPath>
<clipPath id="mdt-clip-67">
<rect x="0" y="0" width="14" height="14"/>
</clipPath>
<g id="mdt-source-104" clip-path="url(#mdt-clip-67)">
<g clip-path="url(#mdt-clip-66)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.40625 7.550781 L 13.40625 0.261719 L 0.597656 13.074219 L 7.886719 13.074219 C 9.726562 11.234375 11.566406 9.390625 13.40625 7.550781 "/>
</g>
</g>
<mask id="mdt-mask-34">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-68">
<path clip-rule="nonzero" d="M 0.332031 0.902344 L 13.503906 0.902344 L 13.503906 14.078125 L 0.332031 14.078125 Z M 0.332031 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-69">
<rect x="0" y="0" width="14" height="15"/>
</clipPath>
<g id="mdt-source-107" clip-path="url(#mdt-clip-69)">
<g clip-path="url(#mdt-clip-68)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.503906 0.90625 L 1.425781 0.90625 C 1.058594 1.269531 0.695312 1.632812 0.332031 2 L 0.332031 14.078125 C 4.722656 9.683594 9.113281 5.296875 13.503906 0.90625 "/>
</g>
</g>
<mask id="mdt-mask-35">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-70">
<path clip-rule="nonzero" d="M 0.078125 0.902344 L 16.054688 0.902344 L 16.054688 16.882812 L 0.078125 16.882812 Z M 0.078125 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-71">
<rect x="0" y="0" width="17" height="17"/>
</clipPath>
<g id="mdt-source-110" clip-path="url(#mdt-clip-71)">
<g clip-path="url(#mdt-clip-70)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 16.054688 0.90625 L 8.765625 0.90625 C 5.867188 3.800781 2.972656 6.695312 0.078125 9.589844 L 0.078125 16.882812 C 5.402344 11.554688 10.730469 6.230469 16.054688 0.90625 "/>
</g>
</g>
<mask id="mdt-mask-36">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-72">
<path clip-rule="nonzero" d="M 0.078125 0.875 L 21.15625 0.875 L 21.15625 29.074219 L 0.078125 29.074219 Z M 0.078125 0.875 "/>
</clipPath>
<clipPath id="mdt-clip-73">
<rect x="0" y="0" width="22" height="30"/>
</clipPath>
<g id="mdt-source-113" clip-path="url(#mdt-clip-73)">
<g clip-path="url(#mdt-clip-72)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.15625 11.035156 L 21.15625 0.875 C 14.128906 7.898438 7.105469 14.925781 0.078125 21.953125 L 0.078125 29.070312 L 3.121094 29.070312 C 9.132812 23.058594 15.144531 17.046875 21.15625 11.035156 "/>
</g>
</g>
<mask id="mdt-mask-37">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-74">
<path clip-rule="nonzero" d="M 0.191406 0.105469 L 11.15625 0.105469 L 11.15625 11.074219 L 0.191406 11.074219 Z M 0.191406 0.105469 "/>
</clipPath>
<clipPath id="mdt-clip-75">
<rect x="0" y="0" width="12" height="12"/>
</clipPath>
<g id="mdt-source-116" clip-path="url(#mdt-clip-75)">
<g clip-path="url(#mdt-clip-74)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.191406 11.074219 L 11.15625 11.074219 L 11.15625 0.105469 Z M 0.191406 11.074219 "/>
</g>
</g>
<mask id="mdt-mask-38">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-76">
<path clip-rule="nonzero" d="M 0.667969 0.902344 L 4.289062 0.902344 L 4.289062 4.523438 L 0.667969 4.523438 Z M 0.667969 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-77">
<rect x="0" y="0" width="5" height="5"/>
</clipPath>
<g id="mdt-source-119" clip-path="url(#mdt-clip-77)">
<g clip-path="url(#mdt-clip-76)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 4.289062 0.90625 L 0.667969 0.90625 L 0.667969 4.523438 Z M 4.289062 0.90625 "/>
</g>
</g>
<mask id="mdt-mask-39">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-78">
<path clip-rule="nonzero" d="M 0.527344 0.855469 L 3.746094 0.855469 L 3.746094 4.074219 L 0.527344 4.074219 Z M 0.527344 0.855469 "/>
</clipPath>
<clipPath id="mdt-clip-79">
<rect x="0" y="0" width="4" height="5"/>
</clipPath>
<g id="mdt-source-122" clip-path="url(#mdt-clip-79)">
<g clip-path="url(#mdt-clip-78)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.527344 4.074219 L 3.746094 4.074219 L 3.746094 0.855469 C 2.671875 1.925781 1.601562 3 0.527344 4.074219 "/>
</g>
</g>
<mask id="mdt-mask-40">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-80">
<path clip-rule="nonzero" d="M 0.773438 0.101562 L 20.746094 0.101562 L 20.746094 20.074219 L 0.773438 20.074219 Z M 0.773438 0.101562 "/>
</clipPath>
<clipPath id="mdt-clip-81">
<rect x="0" y="0" width="21" height="21"/>
</clipPath>
<g id="mdt-source-125" clip-path="url(#mdt-clip-81)">
<g clip-path="url(#mdt-clip-80)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 20.746094 9.785156 L 20.746094 0.101562 C 14.085938 6.757812 7.429688 13.417969 0.773438 20.070312 L 10.457031 20.070312 C 13.886719 16.644531 17.316406 13.214844 20.746094 9.785156 "/>
</g>
</g>
<mask id="mdt-mask-41">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-82">
<path clip-rule="nonzero" d="M 0.667969 0.902344 L 21.746094 0.902344 L 21.746094 25.109375 L 0.667969 25.109375 Z M 0.667969 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-83">
<rect x="0" y="0" width="22" height="26"/>
</clipPath>
<g id="mdt-source-128" clip-path="url(#mdt-clip-83)">
<g clip-path="url(#mdt-clip-82)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.746094 4.03125 L 21.746094 0.902344 L 11.359375 0.902344 C 7.792969 4.46875 4.230469 8.03125 0.667969 11.59375 L 0.667969 25.109375 C 7.691406 18.082031 14.71875 11.058594 21.746094 4.03125 "/>
</g>
</g>
<mask id="mdt-mask-42">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-84">
<path clip-rule="nonzero" d="M 0.335938 0.902344 L 11.625 0.902344 L 11.625 12.195312 L 0.335938 12.195312 Z M 0.335938 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-85">
<rect x="0" y="0" width="12" height="13"/>
</clipPath>
<g id="mdt-source-131" clip-path="url(#mdt-clip-85)">
<g clip-path="url(#mdt-clip-84)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 11.625 0.90625 L 1.941406 0.90625 C 1.40625 1.441406 0.871094 1.976562 0.335938 2.511719 L 0.335938 12.195312 Z M 11.625 0.90625 "/>
</g>
</g>
<mask id="mdt-mask-43">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-86">
<path clip-rule="nonzero" d="M 0.113281 0.769531 L 12.414062 0.769531 L 12.414062 13.074219 L 0.113281 13.074219 Z M 0.113281 0.769531 "/>
</clipPath>
<clipPath id="mdt-clip-87">
<rect x="0" y="0" width="13" height="14"/>
</clipPath>
<g id="mdt-source-134" clip-path="url(#mdt-clip-87)">
<g clip-path="url(#mdt-clip-86)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.113281 13.074219 L 12.414062 13.074219 L 12.414062 0.769531 C 8.3125 4.871094 4.210938 8.972656 0.113281 13.074219 "/>
</g>
</g>
<mask id="mdt-mask-44">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-88">
<path clip-rule="nonzero" d="M 0.335938 0.902344 L 21.414062 0.902344 L 21.414062 31.074219 L 0.335938 31.074219 Z M 0.335938 0.902344 "/>
</clipPath>
<clipPath id="mdt-clip-89">
<rect x="0" y="0" width="22" height="32"/>
</clipPath>
<g id="mdt-source-137" clip-path="url(#mdt-clip-89)">
<g clip-path="url(#mdt-clip-88)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 21.414062 11.703125 L 21.414062 0.902344 L 18.695312 0.902344 C 12.574219 7.023438 6.457031 13.144531 0.335938 19.265625 L 0.335938 31.070312 L 2.042969 31.070312 C 8.5 24.613281 14.957031 18.15625 21.414062 11.703125 "/>
</g>
</g>
<mask id="mdt-mask-45">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-90">
<path clip-rule="nonzero" d="M 0.394531 0.0429688 L 19.660156 0.0429688 L 19.660156 19.308594 L 0.394531 19.308594 Z M 0.394531 0.0429688 "/>
</clipPath>
<clipPath id="mdt-clip-91">
<rect x="0" y="0" width="20" height="20"/>
</clipPath>
<g id="mdt-source-140" clip-path="url(#mdt-clip-91)">
<g clip-path="url(#mdt-clip-90)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 19.660156 0.0429688 L 6.527344 0.0429688 L 0.394531 6.175781 L 0.394531 19.308594 C 6.816406 12.886719 13.238281 6.464844 19.660156 0.0429688 "/>
</g>
</g>
<mask id="mdt-mask-46">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-92">
<path clip-rule="nonzero" d="M 0.730469 0.414062 L 17.640625 0.414062 L 17.640625 15.113281 L 0.730469 15.113281 Z M 0.730469 0.414062 "/>
</clipPath>
<clipPath id="mdt-clip-93">
<rect x="0" y="0" width="18" height="16"/>
</clipPath>
<g id="mdt-source-143" clip-path="url(#mdt-clip-93)">
<g clip-path="url(#mdt-clip-92)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.730469 15.113281 L 17.640625 15.113281 L 15.429688 0.414062 C 10.53125 5.316406 5.628906 10.214844 0.730469 15.113281 "/>
</g>
</g>
<mask id="mdt-mask-47">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-94">
<path clip-rule="nonzero" d="M 0.160156 0.0429688 L 14.867188 0.0429688 L 14.867188 14.75 L 0.160156 14.75 Z M 0.160156 0.0429688 "/>
</clipPath>
<clipPath id="mdt-clip-95">
<rect x="0" y="0" width="15" height="15"/>
</clipPath>
<g id="mdt-source-146" clip-path="url(#mdt-clip-95)">
<g clip-path="url(#mdt-clip-94)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 14.867188 0.0429688 L 0.160156 0.0429688 L 0.160156 14.75 Z M 14.867188 0.0429688 "/>
</g>
</g>
<mask id="mdt-mask-48">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-96">
<path clip-rule="nonzero" d="M 0.9375 0.816406 L 19.234375 0.816406 L 19.234375 19.113281 L 0.9375 19.113281 Z M 0.9375 0.816406 "/>
</clipPath>
<clipPath id="mdt-clip-97">
<rect x="0" y="0" width="20" height="20"/>
</clipPath>
<g id="mdt-source-149" clip-path="url(#mdt-clip-97)">
<g clip-path="url(#mdt-clip-96)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 19.234375 9.273438 L 19.234375 0.816406 C 13.136719 6.914062 7.039062 13.015625 0.9375 19.113281 L 9.394531 19.113281 C 12.675781 15.835938 15.957031 12.554688 19.234375 9.273438 "/>
</g>
</g>
<mask id="mdt-mask-49">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-98">
<path clip-rule="nonzero" d="M 0.867188 0.0429688 L 9.785156 0.0429688 L 9.785156 21.113281 L 0.867188 21.113281 Z M 0.867188 0.0429688 "/>
</clipPath>
<clipPath id="mdt-clip-99">
<rect x="0" y="0" width="10" height="22"/>
</clipPath>
<g id="mdt-source-152" clip-path="url(#mdt-clip-99)">
<g clip-path="url(#mdt-clip-98)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 6.507812 0.0429688 L 1.554688 0.0429688 C 1.367188 0.355469 1.140625 0.664062 0.867188 0.960938 L 3.898438 21.113281 L 9.785156 21.113281 Z M 6.507812 0.0429688 "/>
</g>
</g>
<mask id="mdt-mask-50">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-100">
<path clip-rule="nonzero" d="M 0.644531 0.710938 L 18.679688 0.710938 L 18.679688 18.742188 L 0.644531 18.742188 Z M 0.644531 0.710938 "/>
</clipPath>
<clipPath id="mdt-clip-101">
<rect x="0" y="0" width="19" height="19"/>
</clipPath>
<g id="mdt-source-155" clip-path="url(#mdt-clip-101)">
<g clip-path="url(#mdt-clip-100)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 11.195312 18.371094 L 18.308594 11.257812 C 18.542969 10.402344 18.675781 9.507812 18.675781 8.578125 C 18.675781 5.40625 17.222656 2.574219 14.945312 0.707031 L 0.644531 15.003906 C 2.507812 17.285156 5.339844 18.742188 8.515625 18.742188 C 9.445312 18.742188 10.339844 18.605469 11.195312 18.371094 "/>
</g>
</g>
<mask id="mdt-mask-51">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-102">
<path clip-rule="nonzero" d="M 0.753906 0.242188 L 12.003906 0.242188 L 12.003906 12.679688 L 0.753906 12.679688 Z M 0.753906 0.242188 "/>
</clipPath>
<clipPath id="mdt-clip-103">
<rect x="0" y="0" width="13" height="13"/>
</clipPath>
<g id="mdt-source-158" clip-path="url(#mdt-clip-103)">
<g clip-path="url(#mdt-clip-102)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.003906 1.433594 C 11.160156 0.699219 10.074219 0.242188 8.871094 0.242188 L 5.554688 0.242188 C 2.902344 0.242188 0.753906 2.390625 0.753906 5.042969 L 0.753906 12.679688 Z M 12.003906 1.433594 "/>
</g>
</g>
<mask id="mdt-mask-52">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-104">
<path clip-rule="nonzero" d="M 0.753906 0.835938 L 13.671875 0.835938 L 13.671875 17.839844 L 0.753906 17.839844 Z M 0.753906 0.835938 "/>
</clipPath>
<clipPath id="mdt-clip-105">
<rect x="0" y="0" width="14" height="18"/>
</clipPath>
<g id="mdt-source-161" clip-path="url(#mdt-clip-105)">
<g clip-path="url(#mdt-clip-104)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.671875 5.015625 L 13.671875 0.832031 L 0.753906 13.75 L 0.753906 16.945312 C 0.753906 17.25 0.789062 17.546875 0.84375 17.839844 C 5.121094 13.566406 9.394531 9.289062 13.671875 5.015625 "/>
</g>
</g>
<mask id="mdt-mask-53">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-106">
<path clip-rule="nonzero" d="M 0.222656 0.0859375 L 9.671875 0.0859375 L 9.671875 9.746094 L 0.222656 9.746094 Z M 0.222656 0.0859375 "/>
</clipPath>
<clipPath id="mdt-clip-107">
<rect x="0" y="0" width="10" height="10"/>
</clipPath>
<g id="mdt-source-164" clip-path="url(#mdt-clip-107)">
<g clip-path="url(#mdt-clip-106)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 2.941406 9.746094 L 9.671875 3.015625 L 9.671875 0.0859375 L 0.222656 9.535156 C 0.648438 9.65625 1.089844 9.746094 1.554688 9.746094 Z M 2.941406 9.746094 "/>
</g>
</g>
<mask id="mdt-mask-54">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-108">
<path clip-rule="nonzero" d="M 0.546875 0.242188 L 6.441406 0.242188 L 6.441406 6.136719 L 0.546875 6.136719 Z M 0.546875 0.242188 "/>
</clipPath>
<clipPath id="mdt-clip-109">
<rect x="0" y="0" width="7" height="7"/>
</clipPath>
<g id="mdt-source-167" clip-path="url(#mdt-clip-109)">
<g clip-path="url(#mdt-clip-108)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 6.441406 0.242188 L 5.347656 0.242188 C 2.699219 0.242188 0.546875 2.390625 0.546875 5.042969 L 0.546875 6.136719 Z M 6.441406 0.242188 "/>
</g>
</g>
<mask id="mdt-mask-55">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-110">
<path clip-rule="nonzero" d="M 0.546875 0.675781 L 13.1875 0.675781 L 13.1875 15.136719 L 0.546875 15.136719 Z M 0.546875 0.675781 "/>
</clipPath>
<clipPath id="mdt-clip-111">
<rect x="0" y="0" width="14" height="16"/>
</clipPath>
<g id="mdt-source-170" clip-path="url(#mdt-clip-111)">
<g clip-path="url(#mdt-clip-110)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.1875 2.496094 C 12.953125 1.808594 12.582031 1.183594 12.082031 0.675781 L 0.546875 12.207031 L 0.546875 15.136719 Z M 13.1875 2.496094 "/>
</g>
</g>
<mask id="mdt-mask-56">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-112">
<path clip-rule="nonzero" d="M 0.570312 0.289062 L 13.464844 0.289062 L 13.464844 17.390625 L 0.570312 17.390625 Z M 0.570312 0.289062 "/>
</clipPath>
<clipPath id="mdt-clip-113">
<rect x="0" y="0" width="14" height="18"/>
</clipPath>
<g id="mdt-source-173" clip-path="url(#mdt-clip-113)">
<g clip-path="url(#mdt-clip-112)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 3.542969 17.390625 L 13.464844 7.46875 L 13.464844 0.289062 L 0.570312 13.183594 C 0.667969 15.089844 1.863281 16.703125 3.542969 17.390625 "/>
</g>
</g>
<mask id="mdt-mask-57">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-114">
<path clip-rule="nonzero" d="M 0.339844 0.242188 L 11.542969 0.242188 L 11.542969 12.59375 L 0.339844 12.59375 Z M 0.339844 0.242188 "/>
</clipPath>
<clipPath id="mdt-clip-115">
<rect x="0" y="0" width="12" height="13"/>
</clipPath>
<g id="mdt-source-176" clip-path="url(#mdt-clip-115)">
<g clip-path="url(#mdt-clip-114)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 11.542969 1.390625 C 10.707031 0.683594 9.636719 0.242188 8.457031 0.242188 L 5.511719 0.242188 L 0.339844 5.414062 L 0.339844 12.59375 Z M 11.542969 1.390625 "/>
</g>
</g>
<mask id="mdt-mask-58">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-116">
<path clip-rule="nonzero" d="M 0.339844 0.746094 L 13.257812 0.746094 L 13.257812 19.558594 L 0.339844 19.558594 Z M 0.339844 0.746094 "/>
</clipPath>
<clipPath id="mdt-clip-117">
<rect x="0" y="0" width="14" height="20"/>
</clipPath>
<g id="mdt-source-179" clip-path="url(#mdt-clip-117)">
<g clip-path="url(#mdt-clip-116)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 13.257812 7.425781 L 13.257812 0.746094 L 0.34375 13.664062 L 0.34375 16.945312 C 0.34375 17.910156 0.632812 18.808594 1.125 19.558594 C 5.167969 15.515625 9.214844 11.472656 13.257812 7.425781 "/>
</g>
</g>
<mask id="mdt-mask-59">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-118">
<path clip-rule="nonzero" d="M 0.0117188 0.496094 L 7.257812 0.496094 L 7.257812 7.746094 L 0.0117188 7.746094 Z M 0.0117188 0.496094 "/>
</clipPath>
<clipPath id="mdt-clip-119">
<rect x="0" y="0" width="8" height="8"/>
</clipPath>
<g id="mdt-source-182" clip-path="url(#mdt-clip-119)">
<g clip-path="url(#mdt-clip-118)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.0117188 7.746094 L 2.457031 7.746094 C 5.109375 7.746094 7.257812 5.59375 7.257812 2.941406 L 7.257812 0.496094 C 4.84375 2.910156 2.425781 5.328125 0.0117188 7.746094 "/>
</g>
</g>
<mask id="mdt-mask-60">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-120">
<path clip-rule="nonzero" d="M 0.941406 0.464844 L 10.667969 0.464844 L 10.667969 12.742188 L 0.941406 12.742188 Z M 0.941406 0.464844 "/>
</clipPath>
<clipPath id="mdt-clip-121">
<rect x="0" y="0" width="11" height="13"/>
</clipPath>
<g id="mdt-source-185" clip-path="url(#mdt-clip-121)">
<g clip-path="url(#mdt-clip-120)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 10.667969 3.015625 L 10.667969 2.800781 C 10.667969 1.90625 10.332031 1.09375 9.792969 0.464844 L 0.945312 9.3125 L 0.945312 12.742188 Z M 10.667969 3.015625 "/>
</g>
</g>
<mask id="mdt-mask-61">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-122">
<path clip-rule="nonzero" d="M 0.964844 0.0859375 L 9.667969 0.0859375 L 9.667969 9.894531 L 0.964844 9.894531 Z M 0.964844 0.0859375 "/>
</clipPath>
<clipPath id="mdt-clip-123">
<rect x="0" y="0" width="10" height="10"/>
</clipPath>
<g id="mdt-source-188" clip-path="url(#mdt-clip-123)">
<g clip-path="url(#mdt-clip-122)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.964844 8.789062 C 1.621094 9.46875 2.539062 9.894531 3.558594 9.894531 L 6.054688 9.894531 C 8.050781 9.894531 9.667969 8.273438 9.667969 6.277344 L 9.667969 0.0859375 Z M 0.964844 8.789062 "/>
</g>
</g>
<mask id="mdt-mask-62">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-124">
<path clip-rule="nonzero" d="M 0.128906 0.625 L 16.652344 0.625 L 16.652344 9.550781 L 0.128906 9.550781 Z M 0.128906 0.625 "/>
</clipPath>
<clipPath id="mdt-clip-125">
<rect x="0" y="0" width="17" height="10"/>
</clipPath>
<g id="mdt-source-191" clip-path="url(#mdt-clip-125)">
<g clip-path="url(#mdt-clip-124)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 16.65625 3.699219 C 10.433594 2.179688 4.777344 1.222656 0.128906 0.625 C 3.160156 3.570312 6.757812 6.582031 10.800781 9.550781 Z M 16.65625 3.699219 "/>
</g>
</g>
<mask id="mdt-mask-63">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-126">
<path clip-rule="nonzero" d="M 0.953125 0.183594 L 17.011719 0.183594 L 17.011719 11.964844 L 0.953125 11.964844 Z M 0.953125 0.183594 "/>
</clipPath>
<clipPath id="mdt-clip-127">
<rect x="0" y="0" width="18" height="12"/>
</clipPath>
<g id="mdt-source-194" clip-path="url(#mdt-clip-127)">
<g clip-path="url(#mdt-clip-126)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 17.011719 3.011719 C 14.03125 1.9375 11.09375 0.996094 8.242188 0.183594 L 0.953125 7.472656 C 3.210938 8.996094 5.585938 10.496094 8.058594 11.960938 Z M 17.011719 3.011719 "/>
</g>
</g>
<mask id="mdt-mask-64">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-128">
<path clip-rule="nonzero" d="M 0.558594 0.976562 L 12.550781 0.976562 L 12.550781 11.730469 L 0.558594 11.730469 Z M 0.558594 0.976562 "/>
</clipPath>
<clipPath id="mdt-clip-129">
<rect x="0" y="0" width="13" height="12"/>
</clipPath>
<g id="mdt-source-197" clip-path="url(#mdt-clip-129)">
<g clip-path="url(#mdt-clip-128)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.550781 2.003906 C 11.738281 1.652344 10.925781 1.308594 10.117188 0.976562 L 0.558594 10.535156 C 1.316406 10.945312 2.070312 11.335938 2.824219 11.730469 Z M 12.550781 2.003906 "/>
</g>
</g>
<mask id="mdt-mask-65">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-130">
<path clip-rule="nonzero" d="M 0.175781 0.164062 L 12.078125 0.164062 L 12.078125 9.941406 L 0.175781 9.941406 Z M 0.175781 0.164062 "/>
</clipPath>
<clipPath id="mdt-clip-131">
<rect x="0" y="0" width="13" height="10"/>
</clipPath>
<g id="mdt-source-200" clip-path="url(#mdt-clip-131)">
<g clip-path="url(#mdt-clip-130)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.082031 2.546875 C 10.933594 1.726562 9.773438 0.929688 8.605469 0.164062 C 5.796875 2.976562 2.988281 5.785156 0.175781 8.59375 C 1.71875 9.101562 3.222656 9.546875 4.683594 9.941406 Z M 12.082031 2.546875 "/>
</g>
</g>
<mask id="mdt-mask-66">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-132">
<path clip-rule="nonzero" d="M 0.445312 0.589844 L 12.742188 0.589844 L 12.742188 6.96875 L 0.445312 6.96875 Z M 0.445312 0.589844 "/>
</clipPath>
<clipPath id="mdt-clip-133">
<rect x="0" y="0" width="13" height="7"/>
</clipPath>
<g id="mdt-source-203" clip-path="url(#mdt-clip-133)">
<g clip-path="url(#mdt-clip-132)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.445312 6.25 C 5.402344 7.136719 9.628906 7.21875 12.742188 6.402344 C 10.597656 4.328125 8.378906 2.398438 6.109375 0.589844 Z M 0.445312 6.25 "/>
</g>
</g>
<mask id="mdt-mask-67">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-134">
<path clip-rule="nonzero" d="M 0.535156 0.230469 L 18.246094 0.230469 L 18.246094 13.726562 L 0.535156 13.726562 Z M 0.535156 0.230469 "/>
</clipPath>
<clipPath id="mdt-clip-135">
<rect x="0" y="0" width="19" height="14"/>
</clipPath>
<g id="mdt-source-206" clip-path="url(#mdt-clip-135)">
<g clip-path="url(#mdt-clip-134)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 18.246094 4.453125 C 15.644531 2.925781 13.023438 1.511719 10.394531 0.230469 C 7.109375 3.515625 3.824219 6.800781 0.535156 10.085938 C 3.40625 11.449219 6.230469 12.664062 8.972656 13.726562 Z M 18.246094 4.453125 "/>
</g>
</g>
<mask id="mdt-mask-68">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-136">
<path clip-rule="nonzero" d="M 0.894531 0.679688 L 12.390625 0.679688 L 12.390625 14.863281 L 0.894531 14.863281 Z M 0.894531 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-137">
<rect x="0" y="0" width="13" height="15"/>
</clipPath>
<g id="mdt-source-209" clip-path="url(#mdt-clip-137)">
<g clip-path="url(#mdt-clip-136)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.390625 3.371094 L 12.390625 0.679688 L 3.480469 0.679688 L 0.894531 3.265625 L 0.894531 14.863281 Z M 12.390625 3.371094 "/>
</g>
</g>
<mask id="mdt-mask-69">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-138">
<path clip-rule="nonzero" d="M 0.773438 0.441406 L 6.390625 0.441406 L 6.390625 6.058594 L 0.773438 6.058594 Z M 0.773438 0.441406 "/>
</clipPath>
<clipPath id="mdt-clip-139">
<rect x="0" y="0" width="7" height="7"/>
</clipPath>
<g id="mdt-source-212" clip-path="url(#mdt-clip-139)">
<g clip-path="url(#mdt-clip-138)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.773438 6.054688 L 6.386719 6.054688 L 6.386719 0.441406 C 4.515625 2.3125 2.644531 4.183594 0.773438 6.054688 "/>
</g>
</g>
<mask id="mdt-mask-70">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-140">
<path clip-rule="nonzero" d="M 0.195312 0.679688 L 18.742188 0.679688 L 18.742188 16.058594 L 0.195312 16.058594 Z M 0.195312 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-141">
<rect x="0" y="0" width="19" height="17"/>
</clipPath>
<g id="mdt-source-215" clip-path="url(#mdt-clip-141)">
<g clip-path="url(#mdt-clip-140)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 18.742188 0.679688 L 2.835938 0.679688 L 0.195312 3.320312 L 0.195312 16.058594 L 3.363281 16.058594 C 8.488281 10.929688 13.613281 5.804688 18.742188 0.679688 "/>
</g>
</g>
<mask id="mdt-mask-71">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-142">
<path clip-rule="nonzero" d="M 0.433594 0.679688 L 25.121094 0.679688 L 25.121094 16.058594 L 0.433594 16.058594 Z M 0.433594 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-143">
<rect x="0" y="0" width="26" height="17"/>
</clipPath>
<g id="mdt-source-218" clip-path="url(#mdt-clip-143)">
<g clip-path="url(#mdt-clip-142)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 25.121094 2.96875 L 25.121094 0.679688 L 15.8125 0.679688 C 10.683594 5.804688 5.558594 10.929688 0.433594 16.058594 L 12.03125 16.058594 Z M 25.121094 2.96875 "/>
</g>
</g>
<mask id="mdt-mask-72">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-144">
<path clip-rule="nonzero" d="M 0.105469 0.0390625 L 6.121094 0.0390625 L 6.121094 6.058594 L 0.105469 6.058594 Z M 0.105469 0.0390625 "/>
</clipPath>
<clipPath id="mdt-clip-145">
<rect x="0" y="0" width="7" height="7"/>
</clipPath>
<g id="mdt-source-221" clip-path="url(#mdt-clip-145)">
<g clip-path="url(#mdt-clip-144)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.101562 6.054688 L 6.121094 6.054688 L 6.121094 0.0390625 Z M 0.101562 6.054688 "/>
</g>
</g>
<mask id="mdt-mask-73">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-146">
<path clip-rule="nonzero" d="M 0.507812 0.679688 L 17.53125 0.679688 L 17.53125 16.058594 L 0.507812 16.058594 Z M 0.507812 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-147">
<rect x="0" y="0" width="18" height="17"/>
</clipPath>
<g id="mdt-source-224" clip-path="url(#mdt-clip-147)">
<g clip-path="url(#mdt-clip-146)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 17.53125 0.679688 L 10.242188 0.679688 L 0.507812 10.414062 L 0.507812 16.058594 L 2.152344 16.058594 Z M 17.53125 0.679688 "/>
</g>
</g>
<mask id="mdt-mask-74">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-148">
<path clip-rule="nonzero" d="M 0.222656 0.679688 L 25.765625 0.679688 L 25.765625 16.058594 L 0.222656 16.058594 Z M 0.222656 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-149">
<rect x="0" y="0" width="26" height="17"/>
</clipPath>
<g id="mdt-source-227" clip-path="url(#mdt-clip-149)">
<g clip-path="url(#mdt-clip-148)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 25.765625 0.679688 L 15.601562 0.679688 L 0.222656 16.058594 L 10.386719 16.058594 Z M 25.765625 0.679688 "/>
</g>
</g>
<mask id="mdt-mask-75">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-150">
<path clip-rule="nonzero" d="M 0.457031 0.0820312 L 9.433594 0.0820312 L 9.433594 9.058594 L 0.457031 9.058594 Z M 0.457031 0.0820312 "/>
</clipPath>
<clipPath id="mdt-clip-151">
<rect x="0" y="0" width="10" height="10"/>
</clipPath>
<g id="mdt-source-230" clip-path="url(#mdt-clip-151)">
<g clip-path="url(#mdt-clip-150)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 0.457031 9.054688 L 9.433594 9.054688 L 9.433594 0.0820312 Z M 0.457031 9.054688 "/>
</g>
</g>
<mask id="mdt-mask-76">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-152">
<path clip-rule="nonzero" d="M 0.816406 0.679688 L 12.488281 0.679688 L 12.488281 12.351562 L 0.816406 12.351562 Z M 0.816406 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-153">
<rect x="0" y="0" width="13" height="13"/>
</clipPath>
<g id="mdt-source-233" clip-path="url(#mdt-clip-153)">
<g clip-path="url(#mdt-clip-152)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 12.488281 0.679688 L 0.816406 0.679688 L 0.816406 12.351562 C 4.707031 8.460938 8.597656 4.570312 12.488281 0.679688 "/>
</g>
</g>
<mask id="mdt-mask-77">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-154">
<path clip-rule="nonzero" d="M 0.183594 0.679688 L 19.980469 0.679688 L 19.980469 16.058594 L 0.183594 16.058594 Z M 0.183594 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-155">
<rect x="0" y="0" width="20" height="17"/>
</clipPath>
<g id="mdt-source-236" clip-path="url(#mdt-clip-155)">
<g clip-path="url(#mdt-clip-154)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 19.976562 0.679688 L 15.558594 0.679688 C 10.433594 5.804688 5.308594 10.929688 0.183594 16.058594 L 4.601562 16.058594 C 9.726562 10.929688 14.851562 5.804688 19.976562 0.679688 "/>
</g>
</g>
<mask id="mdt-mask-78">
<g filter="url(#mdt-filter-remove-color)">
<rect x="0" y="0" width="500" height="500" fill="rgb(0%, 0%, 0%)" fill-opacity="0.300003"/>
</g>
</mask>
<clipPath id="mdt-clip-156">
<path clip-rule="nonzero" d="M 0.671875 0.679688 L 20.742188 0.679688 L 20.742188 16.058594 L 0.671875 16.058594 Z M 0.671875 0.679688 "/>
</clipPath>
<clipPath id="mdt-clip-157">
<rect x="0" y="0" width="21" height="17"/>
</clipPath>
<g id="mdt-source-239" clip-path="url(#mdt-clip-157)">
<g clip-path="url(#mdt-clip-156)">
<path fill-rule="nonzero" fill="rgb(80.000305%, 88.627625%, 100%)" fill-opacity="1" d="M 20.742188 7.105469 L 20.742188 0.679688 L 16.050781 0.679688 C 10.925781 5.804688 5.796875 10.929688 0.671875 16.054688 L 11.792969 16.054688 Z M 20.742188 7.105469 "/>
</g>
</g>
</defs>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 177.121094 481.546875 C 177.121094 481.988281 177.1875 482.363281 177.324219 482.671875 C 177.460938 482.980469 177.648438 483.210938 177.886719 483.367188 C 178.121094 483.523438 178.382812 483.605469 178.664062 483.605469 C 178.949219 483.605469 179.207031 483.527344 179.445312 483.378906 C 179.679688 483.234375 179.867188 483.003906 180.007812 482.695312 C 180.148438 482.390625 180.21875 482.007812 180.21875 481.546875 C 180.21875 481.117188 180.148438 480.746094 180.007812 480.433594 C 179.867188 480.125 179.675781 479.886719 179.4375 479.722656 C 179.199219 479.558594 178.9375 479.476562 178.652344 479.476562 C 178.355469 479.476562 178.089844 479.5625 177.855469 479.730469 C 177.621094 479.898438 177.441406 480.136719 177.3125 480.453125 C 177.183594 480.769531 177.121094 481.132812 177.121094 481.546875 M 180.308594 483.929688 L 180.308594 483.769531 C 180.089844 484.019531 179.875 484.222656 179.664062 484.375 C 179.453125 484.53125 179.222656 484.652344 178.972656 484.734375 C 178.726562 484.816406 178.457031 484.855469 178.164062 484.855469 C 177.777344 484.855469 177.417969 484.773438 177.085938 484.609375 C 176.757812 484.445312 176.46875 484.210938 176.230469 483.90625 C 175.988281 483.601562 175.804688 483.242188 175.679688 482.832031 C 175.554688 482.417969 175.492188 481.972656 175.492188 481.496094 C 175.492188 480.484375 175.742188 479.691406 176.234375 479.125 C 176.730469 478.5625 177.378906 478.277344 178.1875 478.277344 C 178.65625 478.277344 179.046875 478.359375 179.371094 478.519531 C 179.691406 478.679688 180.003906 478.925781 180.308594 479.257812 L 180.308594 476.863281 C 180.308594 476.53125 180.375 476.28125 180.507812 476.113281 C 180.640625 475.941406 180.828125 475.855469 181.074219 475.855469 C 181.320312 475.855469 181.507812 475.933594 181.640625 476.089844 C 181.773438 476.246094 181.839844 476.476562 181.839844 476.78125 L 181.839844 483.929688 C 181.839844 484.238281 181.769531 484.46875 181.625 484.625 C 181.484375 484.777344 181.300781 484.855469 181.074219 484.855469 C 180.851562 484.855469 180.667969 484.777344 180.523438 484.613281 C 180.378906 484.453125 180.308594 484.226562 180.308594 483.929688 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 184.285156 481.039062 L 187.222656 481.039062 C 187.183594 480.484375 187.03125 480.070312 186.773438 479.796875 C 186.515625 479.519531 186.175781 479.382812 185.75 479.382812 C 185.347656 479.382812 185.015625 479.519531 184.757812 479.800781 C 184.496094 480.078125 184.339844 480.492188 184.285156 481.039062 M 187.453125 481.960938 L 184.285156 481.960938 C 184.289062 482.324219 184.363281 482.652344 184.507812 482.933594 C 184.652344 483.214844 184.84375 483.425781 185.082031 483.566406 C 185.320312 483.710938 185.585938 483.78125 185.875 483.78125 C 186.070312 483.78125 186.246094 483.757812 186.40625 483.714844 C 186.566406 483.667969 186.722656 483.597656 186.871094 483.5 C 187.023438 483.402344 187.160156 483.300781 187.289062 483.1875 C 187.414062 483.074219 187.578125 482.925781 187.78125 482.734375 C 187.863281 482.664062 187.984375 482.628906 188.136719 482.628906 C 188.304688 482.628906 188.4375 482.675781 188.539062 482.765625 C 188.644531 482.855469 188.695312 482.984375 188.695312 483.152344 C 188.695312 483.300781 188.636719 483.46875 188.523438 483.664062 C 188.40625 483.859375 188.234375 484.050781 188.003906 484.226562 C 187.769531 484.410156 187.480469 484.558594 187.128906 484.675781 C 186.78125 484.796875 186.378906 484.855469 185.921875 484.855469 C 184.882812 484.855469 184.070312 484.558594 183.496094 483.964844 C 182.917969 483.371094 182.628906 482.566406 182.628906 481.550781 C 182.628906 481.070312 182.699219 480.625 182.84375 480.214844 C 182.984375 479.804688 183.191406 479.457031 183.464844 479.160156 C 183.738281 478.867188 184.074219 478.644531 184.472656 478.488281 C 184.875 478.332031 185.316406 478.253906 185.804688 478.253906 C 186.4375 478.253906 186.980469 478.386719 187.433594 478.652344 C 187.886719 478.921875 188.226562 479.269531 188.453125 479.6875 C 188.675781 480.113281 188.789062 480.546875 188.789062 480.984375 C 188.789062 481.394531 188.671875 481.65625 188.441406 481.777344 C 188.207031 481.898438 187.878906 481.960938 187.453125 481.960938 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 194.839844 482.734375 C 194.839844 483.183594 194.730469 483.566406 194.511719 483.882812 C 194.292969 484.203125 193.972656 484.445312 193.546875 484.609375 C 193.121094 484.773438 192.605469 484.855469 191.996094 484.855469 C 191.414062 484.855469 190.914062 484.765625 190.5 484.589844 C 190.082031 484.410156 189.777344 484.1875 189.578125 483.921875 C 189.378906 483.652344 189.28125 483.382812 189.28125 483.117188 C 189.28125 482.9375 189.34375 482.785156 189.472656 482.660156 C 189.597656 482.535156 189.757812 482.46875 189.953125 482.46875 C 190.121094 482.46875 190.253906 482.511719 190.34375 482.59375 C 190.433594 482.675781 190.523438 482.792969 190.605469 482.945312 C 190.769531 483.234375 190.972656 483.449219 191.203125 483.589844 C 191.433594 483.730469 191.75 483.804688 192.148438 483.804688 C 192.472656 483.804688 192.738281 483.730469 192.949219 483.589844 C 193.15625 483.441406 193.257812 483.277344 193.257812 483.089844 C 193.257812 482.804688 193.152344 482.597656 192.933594 482.46875 C 192.71875 482.339844 192.363281 482.214844 191.871094 482.09375 C 191.3125 481.957031 190.859375 481.808594 190.507812 481.660156 C 190.15625 481.507812 189.878906 481.304688 189.667969 481.054688 C 189.457031 480.804688 189.351562 480.5 189.351562 480.136719 C 189.351562 479.8125 189.449219 479.503906 189.644531 479.214844 C 189.839844 478.925781 190.125 478.695312 190.503906 478.523438 C 190.878906 478.351562 191.335938 478.265625 191.871094 478.265625 C 192.289062 478.265625 192.667969 478.308594 193 478.398438 C 193.335938 478.480469 193.617188 478.601562 193.839844 478.75 C 194.0625 478.890625 194.230469 479.054688 194.347656 479.234375 C 194.464844 479.414062 194.523438 479.585938 194.523438 479.757812 C 194.523438 479.941406 194.460938 480.09375 194.335938 480.214844 C 194.210938 480.332031 194.035156 480.390625 193.804688 480.390625 C 193.636719 480.390625 193.496094 480.34375 193.378906 480.25 C 193.265625 480.15625 193.128906 480.011719 192.980469 479.824219 C 192.855469 479.664062 192.714844 479.535156 192.546875 479.441406 C 192.378906 479.34375 192.15625 479.296875 191.871094 479.296875 C 191.578125 479.296875 191.335938 479.359375 191.140625 479.488281 C 190.945312 479.609375 190.847656 479.765625 190.847656 479.953125 C 190.847656 480.121094 190.921875 480.261719 191.0625 480.371094 C 191.207031 480.480469 191.398438 480.570312 191.636719 480.640625 C 191.878906 480.710938 192.210938 480.796875 192.636719 480.902344 C 193.136719 481.023438 193.546875 481.171875 193.867188 481.339844 C 194.183594 481.507812 194.425781 481.710938 194.59375 481.945312 C 194.757812 482.175781 194.839844 482.4375 194.839844 482.734375 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 197.296875 479.183594 L 197.296875 483.871094 C 197.296875 484.195312 197.21875 484.441406 197.0625 484.605469 C 196.910156 484.773438 196.714844 484.855469 196.476562 484.855469 C 196.238281 484.855469 196.046875 484.769531 195.898438 484.597656 C 195.75 484.429688 195.675781 484.183594 195.675781 483.871094 L 195.675781 479.234375 C 195.675781 478.914062 195.75 478.671875 195.898438 478.507812 C 196.046875 478.347656 196.238281 478.265625 196.476562 478.265625 C 196.714844 478.265625 196.910156 478.347656 197.0625 478.507812 C 197.21875 478.671875 197.296875 478.898438 197.296875 479.183594 M 196.492188 477.511719 C 196.269531 477.511719 196.074219 477.441406 195.914062 477.304688 C 195.753906 477.167969 195.675781 476.96875 195.675781 476.714844 C 195.675781 476.488281 195.757812 476.296875 195.921875 476.152344 C 196.085938 476 196.277344 475.925781 196.492188 475.925781 C 196.703125 475.925781 196.890625 475.996094 197.050781 476.128906 C 197.214844 476.261719 197.296875 476.457031 197.296875 476.714844 C 197.296875 476.964844 197.214844 477.160156 197.058594 477.300781 C 196.898438 477.441406 196.710938 477.511719 196.492188 477.511719 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 199.699219 481.507812 C 199.699219 482.164062 199.84375 482.660156 200.128906 482.996094 C 200.414062 483.332031 200.789062 483.5 201.242188 483.5 C 201.511719 483.5 201.765625 483.429688 202.003906 483.285156 C 202.246094 483.140625 202.4375 482.921875 202.589844 482.632812 C 202.738281 482.34375 202.816406 481.988281 202.816406 481.570312 C 202.816406 480.910156 202.671875 480.398438 202.378906 480.027344 C 202.089844 479.660156 201.707031 479.476562 201.230469 479.476562 C 200.765625 479.476562 200.394531 479.652344 200.117188 480.003906 C 199.839844 480.359375 199.699219 480.859375 199.699219 481.507812 M 204.394531 479.453125 L 204.394531 484.160156 C 204.394531 484.699219 204.335938 485.160156 204.222656 485.550781 C 204.105469 485.9375 203.921875 486.257812 203.671875 486.511719 C 203.417969 486.765625 203.085938 486.953125 202.675781 487.074219 C 202.265625 487.199219 201.757812 487.261719 201.148438 487.261719 C 200.589844 487.261719 200.089844 487.183594 199.652344 487.027344 C 199.210938 486.867188 198.875 486.664062 198.636719 486.417969 C 198.398438 486.171875 198.277344 485.917969 198.277344 485.65625 C 198.277344 485.457031 198.347656 485.296875 198.480469 485.171875 C 198.617188 485.046875 198.777344 484.984375 198.96875 484.984375 C 199.207031 484.984375 199.414062 485.089844 199.59375 485.300781 C 199.679688 485.40625 199.769531 485.515625 199.859375 485.625 C 199.957031 485.734375 200.058594 485.824219 200.171875 485.902344 C 200.28125 485.980469 200.417969 486.035156 200.578125 486.074219 C 200.734375 486.113281 200.917969 486.132812 201.125 486.132812 C 201.542969 486.132812 201.867188 486.074219 202.101562 485.957031 C 202.332031 485.839844 202.496094 485.675781 202.585938 485.46875 C 202.679688 485.257812 202.734375 485.03125 202.75 484.792969 C 202.765625 484.554688 202.777344 484.167969 202.785156 483.636719 C 202.535156 483.988281 202.25 484.25 201.921875 484.433594 C 201.59375 484.613281 201.207031 484.707031 200.757812 484.707031 C 200.214844 484.707031 199.738281 484.570312 199.332031 484.289062 C 198.929688 484.015625 198.617188 483.625 198.398438 483.125 C 198.179688 482.628906 198.070312 482.054688 198.070312 481.402344 C 198.070312 480.914062 198.136719 480.472656 198.269531 480.082031 C 198.402344 479.691406 198.59375 479.359375 198.839844 479.089844 C 199.082031 478.820312 199.367188 478.617188 199.6875 478.484375 C 200.007812 478.347656 200.359375 478.277344 200.742188 478.277344 C 201.203125 478.277344 201.601562 478.367188 201.9375 478.539062 C 202.273438 478.71875 202.585938 478.992188 202.875 479.371094 L 202.875 479.152344 C 202.875 478.867188 202.945312 478.652344 203.082031 478.496094 C 203.21875 478.34375 203.398438 478.265625 203.617188 478.265625 C 203.929688 478.265625 204.136719 478.367188 204.238281 478.570312 C 204.34375 478.777344 204.394531 479.070312 204.394531 479.453125 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 206.96875 479.160156 L 206.96875 479.355469 C 207.253906 478.980469 207.566406 478.707031 207.90625 478.53125 C 208.242188 478.355469 208.632812 478.265625 209.070312 478.265625 C 209.5 478.265625 209.878906 478.359375 210.21875 478.546875 C 210.554688 478.730469 210.804688 478.992188 210.96875 479.335938 C 211.078125 479.53125 211.148438 479.746094 211.179688 479.976562 C 211.210938 480.207031 211.226562 480.5 211.226562 480.855469 L 211.226562 483.867188 C 211.226562 484.195312 211.152344 484.4375 211.003906 484.605469 C 210.855469 484.769531 210.664062 484.855469 210.425781 484.855469 C 210.183594 484.855469 209.988281 484.769531 209.835938 484.597656 C 209.6875 484.429688 209.613281 484.183594 209.613281 483.867188 L 209.613281 481.167969 C 209.613281 480.636719 209.539062 480.226562 209.390625 479.941406 C 209.238281 479.660156 208.945312 479.515625 208.5 479.515625 C 208.214844 479.515625 207.949219 479.605469 207.710938 479.777344 C 207.472656 479.949219 207.300781 480.183594 207.1875 480.484375 C 207.109375 480.726562 207.070312 481.179688 207.070312 481.839844 L 207.070312 483.867188 C 207.070312 484.199219 206.996094 484.445312 206.84375 484.609375 C 206.691406 484.773438 206.492188 484.855469 206.253906 484.855469 C 206.019531 484.855469 205.828125 484.769531 205.675781 484.597656 C 205.523438 484.429688 205.449219 484.183594 205.449219 483.867188 L 205.449219 479.183594 C 205.449219 478.878906 205.515625 478.644531 205.652344 478.492188 C 205.785156 478.34375 205.96875 478.265625 206.203125 478.265625 C 206.347656 478.265625 206.476562 478.300781 206.589844 478.367188 C 206.703125 478.433594 206.796875 478.535156 206.867188 478.671875 C 206.933594 478.804688 206.96875 478.96875 206.96875 479.160156 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 213.660156 481.039062 L 216.597656 481.039062 C 216.558594 480.484375 216.410156 480.070312 216.148438 479.796875 C 215.890625 479.519531 215.550781 479.382812 215.125 479.382812 C 214.722656 479.382812 214.390625 479.519531 214.128906 479.800781 C 213.871094 480.078125 213.714844 480.492188 213.660156 481.039062 M 216.828125 481.960938 L 213.660156 481.960938 C 213.664062 482.324219 213.738281 482.652344 213.882812 482.933594 C 214.027344 483.214844 214.21875 483.425781 214.457031 483.566406 C 214.695312 483.710938 214.960938 483.78125 215.25 483.78125 C 215.445312 483.78125 215.621094 483.757812 215.78125 483.714844 C 215.941406 483.667969 216.097656 483.597656 216.246094 483.5 C 216.398438 483.402344 216.535156 483.300781 216.664062 483.1875 C 216.789062 483.074219 216.953125 482.925781 217.15625 482.734375 C 217.238281 482.664062 217.359375 482.628906 217.511719 482.628906 C 217.679688 482.628906 217.8125 482.675781 217.914062 482.765625 C 218.019531 482.855469 218.070312 482.984375 218.070312 483.152344 C 218.070312 483.300781 218.011719 483.46875 217.898438 483.664062 C 217.78125 483.859375 217.609375 484.050781 217.378906 484.226562 C 217.148438 484.410156 216.855469 484.558594 216.503906 484.675781 C 216.15625 484.796875 215.753906 484.855469 215.296875 484.855469 C 214.257812 484.855469 213.449219 484.558594 212.867188 483.964844 C 212.292969 483.371094 212.003906 482.566406 212.003906 481.550781 C 212.003906 481.070312 212.074219 480.625 212.214844 480.214844 C 212.359375 479.804688 212.566406 479.457031 212.839844 479.160156 C 213.113281 478.867188 213.449219 478.644531 213.851562 478.488281 C 214.25 478.332031 214.691406 478.253906 215.179688 478.253906 C 215.8125 478.253906 216.355469 478.386719 216.808594 478.652344 C 217.261719 478.921875 217.601562 479.269531 217.828125 479.6875 C 218.050781 480.113281 218.164062 480.546875 218.164062 480.984375 C 218.164062 481.394531 218.046875 481.65625 217.816406 481.777344 C 217.582031 481.898438 217.253906 481.960938 216.828125 481.960938 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 220.246094 481.546875 C 220.246094 481.988281 220.316406 482.363281 220.453125 482.671875 C 220.589844 482.980469 220.777344 483.210938 221.015625 483.367188 C 221.25 483.523438 221.511719 483.605469 221.789062 483.605469 C 222.074219 483.605469 222.335938 483.527344 222.570312 483.378906 C 222.808594 483.234375 222.996094 483.003906 223.136719 482.695312 C 223.277344 482.390625 223.347656 482.007812 223.347656 481.546875 C 223.347656 481.117188 223.277344 480.746094 223.136719 480.433594 C 222.996094 480.125 222.804688 479.886719 222.566406 479.722656 C 222.324219 479.558594 222.0625 479.476562 221.777344 479.476562 C 221.480469 479.476562 221.21875 479.5625 220.984375 479.730469 C 220.75 479.898438 220.570312 480.136719 220.441406 480.453125 C 220.3125 480.769531 220.246094 481.132812 220.246094 481.546875 M 223.433594 483.929688 L 223.433594 483.769531 C 223.21875 484.019531 223.003906 484.222656 222.789062 484.375 C 222.578125 484.53125 222.351562 484.652344 222.101562 484.734375 C 221.855469 484.816406 221.585938 484.855469 221.292969 484.855469 C 220.902344 484.855469 220.546875 484.773438 220.214844 484.609375 C 219.886719 484.445312 219.597656 484.210938 219.355469 483.90625 C 219.117188 483.601562 218.933594 483.242188 218.808594 482.832031 C 218.683594 482.417969 218.621094 481.972656 218.621094 481.496094 C 218.621094 480.484375 218.867188 479.691406 219.363281 479.125 C 219.859375 478.5625 220.507812 478.277344 221.316406 478.277344 C 221.78125 478.277344 222.175781 478.359375 222.496094 478.519531 C 222.816406 478.679688 223.132812 478.925781 223.433594 479.257812 L 223.433594 476.863281 C 223.433594 476.53125 223.5 476.28125 223.636719 476.113281 C 223.765625 475.941406 223.957031 475.855469 224.203125 475.855469 C 224.445312 475.855469 224.636719 475.933594 224.769531 476.089844 C 224.898438 476.246094 224.96875 476.476562 224.96875 476.78125 L 224.96875 483.929688 C 224.96875 484.238281 224.894531 484.46875 224.753906 484.625 C 224.609375 484.777344 224.429688 484.855469 224.203125 484.855469 C 223.980469 484.855469 223.796875 484.777344 223.652344 484.613281 C 223.507812 484.453125 223.433594 484.226562 223.433594 483.929688 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 230.136719 481.597656 C 230.136719 482.242188 230.28125 482.738281 230.578125 483.082031 C 230.875 483.429688 231.261719 483.605469 231.738281 483.605469 C 232.144531 483.605469 232.5 483.425781 232.792969 483.070312 C 233.085938 482.714844 233.234375 482.207031 233.234375 481.546875 C 233.234375 481.121094 233.175781 480.753906 233.050781 480.445312 C 232.929688 480.136719 232.753906 479.898438 232.527344 479.730469 C 232.304688 479.5625 232.039062 479.476562 231.738281 479.476562 C 231.429688 479.476562 231.15625 479.5625 230.914062 479.730469 C 230.671875 479.898438 230.484375 480.140625 230.34375 480.457031 C 230.207031 480.777344 230.136719 481.15625 230.136719 481.597656 M 230.058594 476.78125 L 230.058594 479.257812 C 230.363281 478.941406 230.675781 478.699219 230.992188 478.53125 C 231.308594 478.363281 231.699219 478.277344 232.167969 478.277344 C 232.707031 478.277344 233.175781 478.40625 233.582031 478.660156 C 233.988281 478.914062 234.300781 479.285156 234.527344 479.769531 C 234.75 480.253906 234.863281 480.828125 234.863281 481.496094 C 234.863281 481.988281 234.800781 482.4375 234.675781 482.84375 C 234.550781 483.253906 234.371094 483.613281 234.132812 483.910156 C 233.894531 484.210938 233.605469 484.445312 233.265625 484.609375 C 232.929688 484.773438 232.554688 484.855469 232.148438 484.855469 C 231.898438 484.855469 231.664062 484.824219 231.445312 484.765625 C 231.226562 484.707031 231.039062 484.628906 230.882812 484.53125 C 230.730469 484.433594 230.597656 484.335938 230.488281 484.234375 C 230.382812 484.128906 230.238281 483.976562 230.058594 483.769531 L 230.058594 483.929688 C 230.058594 484.234375 229.984375 484.464844 229.839844 484.621094 C 229.691406 484.777344 229.507812 484.855469 229.28125 484.855469 C 229.050781 484.855469 228.871094 484.777344 228.730469 484.621094 C 228.59375 484.464844 228.527344 484.234375 228.527344 483.929688 L 228.527344 476.855469 C 228.527344 476.523438 228.59375 476.277344 228.726562 476.109375 C 228.859375 475.941406 229.042969 475.855469 229.28125 475.855469 C 229.53125 475.855469 229.722656 475.9375 229.855469 476.09375 C 229.992188 476.257812 230.058594 476.484375 230.058594 476.78125 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 236.964844 485.058594 L 237.109375 484.695312 L 235.117188 479.671875 C 234.992188 479.382812 234.933594 479.171875 234.933594 479.042969 C 234.933594 478.90625 234.96875 478.777344 235.039062 478.660156 C 235.109375 478.539062 235.207031 478.445312 235.332031 478.371094 C 235.457031 478.300781 235.585938 478.265625 235.722656 478.265625 C 235.953125 478.265625 236.132812 478.339844 236.25 478.488281 C 236.371094 478.636719 236.472656 478.847656 236.566406 479.125 L 237.9375 483.117188 L 239.234375 479.40625 C 239.339844 479.105469 239.433594 478.871094 239.515625 478.699219 C 239.597656 478.53125 239.6875 478.414062 239.777344 478.355469 C 239.871094 478.296875 240.003906 478.265625 240.175781 478.265625 C 240.296875 478.265625 240.414062 478.296875 240.527344 478.363281 C 240.640625 478.429688 240.726562 478.515625 240.789062 478.628906 C 240.851562 478.738281 240.882812 478.855469 240.882812 478.980469 C 240.863281 479.050781 240.839844 479.160156 240.804688 479.296875 C 240.765625 479.4375 240.726562 479.578125 240.671875 479.71875 L 238.558594 485.253906 C 238.375 485.742188 238.199219 486.121094 238.023438 486.398438 C 237.851562 486.675781 237.621094 486.886719 237.332031 487.035156 C 237.046875 487.1875 236.660156 487.257812 236.171875 487.257812 C 235.699219 487.257812 235.34375 487.207031 235.105469 487.105469 C 234.867188 487 234.75 486.816406 234.75 486.539062 C 234.75 486.355469 234.804688 486.210938 234.917969 486.113281 C 235.03125 486.007812 235.199219 485.957031 235.417969 485.957031 C 235.507812 485.957031 235.589844 485.96875 235.675781 485.996094 C 235.777344 486.019531 235.867188 486.03125 235.941406 486.03125 C 236.128906 486.03125 236.273438 486.003906 236.382812 485.949219 C 236.488281 485.894531 236.582031 485.796875 236.667969 485.660156 C 236.753906 485.523438 236.851562 485.324219 236.964844 485.058594 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 260.441406 478.40625 L 260.828125 478.40625 L 260.828125 477.921875 C 260.828125 477.410156 260.886719 477.011719 261.015625 476.710938 C 261.144531 476.410156 261.367188 476.191406 261.671875 476.054688 C 261.976562 475.921875 262.398438 475.851562 262.929688 475.851562 C 263.882812 475.851562 264.351562 476.082031 264.351562 476.546875 C 264.351562 476.695312 264.300781 476.828125 264.203125 476.933594 C 264.105469 477.039062 263.988281 477.09375 263.851562 477.09375 C 263.792969 477.09375 263.679688 477.082031 263.523438 477.054688 C 263.378906 477.035156 263.242188 477.019531 263.132812 477.019531 C 262.84375 477.019531 262.65625 477.109375 262.570312 477.28125 C 262.492188 477.453125 262.449219 477.695312 262.449219 478.019531 L 262.449219 478.40625 L 262.84375 478.40625 C 263.460938 478.40625 263.769531 478.59375 263.769531 478.964844 C 263.769531 479.226562 263.691406 479.394531 263.523438 479.46875 C 263.359375 479.539062 263.132812 479.574219 262.84375 479.574219 L 262.449219 479.574219 L 262.449219 483.871094 C 262.449219 484.1875 262.371094 484.433594 262.214844 484.597656 C 262.066406 484.769531 261.871094 484.851562 261.625 484.851562 C 261.398438 484.851562 261.210938 484.769531 261.054688 484.597656 C 260.902344 484.433594 260.828125 484.1875 260.828125 483.871094 L 260.828125 479.574219 L 260.378906 479.574219 C 260.136719 479.574219 259.953125 479.523438 259.824219 479.414062 C 259.691406 479.304688 259.625 479.164062 259.625 478.988281 C 259.625 478.597656 259.898438 478.40625 260.441406 478.40625 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 265.746094 482.515625 L 265.746094 483.867188 C 265.746094 484.199219 265.664062 484.445312 265.511719 484.609375 C 265.355469 484.773438 265.160156 484.855469 264.925781 484.855469 C 264.6875 484.855469 264.496094 484.773438 264.347656 484.605469 C 264.199219 484.4375 264.121094 484.195312 264.121094 483.867188 L 264.121094 479.355469 C 264.121094 478.625 264.382812 478.261719 264.910156 478.261719 C 265.179688 478.261719 265.375 478.347656 265.492188 478.519531 C 265.609375 478.691406 265.679688 478.941406 265.691406 479.273438 C 265.882812 478.941406 266.082031 478.691406 266.285156 478.519531 C 266.492188 478.347656 266.761719 478.261719 267.101562 478.261719 C 267.445312 478.261719 267.773438 478.347656 268.09375 478.519531 C 268.417969 478.691406 268.574219 478.914062 268.574219 479.195312 C 268.574219 479.394531 268.507812 479.558594 268.371094 479.683594 C 268.234375 479.816406 268.085938 479.878906 267.929688 479.878906 C 267.867188 479.878906 267.722656 479.839844 267.5 479.765625 C 267.269531 479.695312 267.066406 479.660156 266.894531 479.660156 C 266.65625 479.660156 266.464844 479.722656 266.3125 479.84375 C 266.160156 479.972656 266.042969 480.15625 265.960938 480.398438 C 265.878906 480.644531 265.824219 480.941406 265.789062 481.277344 C 265.761719 481.617188 265.746094 482.03125 265.746094 482.515625 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 270.023438 481.035156 L 272.960938 481.035156 C 272.921875 480.480469 272.777344 480.066406 272.515625 479.792969 C 272.253906 479.515625 271.917969 479.382812 271.492188 479.382812 C 271.085938 479.382812 270.753906 479.519531 270.496094 479.800781 C 270.238281 480.078125 270.078125 480.488281 270.023438 481.035156 M 273.195312 481.957031 L 270.023438 481.957031 C 270.03125 482.324219 270.101562 482.652344 270.246094 482.929688 C 270.390625 483.210938 270.585938 483.421875 270.824219 483.566406 C 271.0625 483.710938 271.328125 483.777344 271.617188 483.777344 C 271.8125 483.777344 271.988281 483.757812 272.148438 483.710938 C 272.304688 483.667969 272.460938 483.59375 272.613281 483.496094 C 272.765625 483.398438 272.902344 483.296875 273.027344 483.183594 C 273.15625 483.074219 273.320312 482.925781 273.523438 482.734375 C 273.605469 482.664062 273.726562 482.625 273.878906 482.625 C 274.046875 482.625 274.179688 482.671875 274.285156 482.765625 C 274.386719 482.855469 274.433594 482.984375 274.433594 483.148438 C 274.433594 483.296875 274.378906 483.46875 274.269531 483.664062 C 274.152344 483.859375 273.980469 484.046875 273.746094 484.226562 C 273.511719 484.40625 273.222656 484.558594 272.871094 484.675781 C 272.523438 484.792969 272.121094 484.851562 271.664062 484.851562 C 270.621094 484.851562 269.8125 484.558594 269.238281 483.964844 C 268.660156 483.371094 268.367188 482.5625 268.367188 481.546875 C 268.367188 481.066406 268.4375 480.625 268.585938 480.214844 C 268.722656 479.804688 268.929688 479.453125 269.207031 479.160156 C 269.480469 478.863281 269.8125 478.640625 270.214844 478.484375 C 270.613281 478.328125 271.054688 478.25 271.546875 478.25 C 272.175781 478.25 272.71875 478.386719 273.175781 478.652344 C 273.628906 478.917969 273.96875 479.265625 274.195312 479.6875 C 274.417969 480.113281 274.53125 480.542969 274.53125 480.984375 C 274.53125 481.390625 274.414062 481.652344 274.179688 481.777344 C 273.949219 481.894531 273.621094 481.957031 273.195312 481.957031 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 276.769531 481.035156 L 279.707031 481.035156 C 279.664062 480.480469 279.515625 480.066406 279.257812 479.792969 C 278.996094 479.515625 278.65625 479.382812 278.234375 479.382812 C 277.828125 479.382812 277.496094 479.519531 277.238281 479.800781 C 276.980469 480.078125 276.820312 480.488281 276.769531 481.035156 M 279.9375 481.957031 L 276.769531 481.957031 C 276.773438 482.324219 276.84375 482.652344 276.988281 482.929688 C 277.132812 483.210938 277.324219 483.421875 277.566406 483.566406 C 277.804688 483.710938 278.066406 483.777344 278.359375 483.777344 C 278.550781 483.777344 278.730469 483.757812 278.886719 483.710938 C 279.046875 483.667969 279.203125 483.59375 279.355469 483.496094 C 279.507812 483.398438 279.644531 483.296875 279.769531 483.183594 C 279.894531 483.074219 280.0625 482.925781 280.261719 482.734375 C 280.347656 482.664062 280.46875 482.625 280.621094 482.625 C 280.785156 482.625 280.917969 482.671875 281.027344 482.765625 C 281.128906 482.855469 281.175781 482.984375 281.175781 483.148438 C 281.175781 483.296875 281.121094 483.46875 281.003906 483.664062 C 280.894531 483.859375 280.71875 484.046875 280.488281 484.226562 C 280.253906 484.40625 279.960938 484.558594 279.613281 484.675781 C 279.265625 484.792969 278.859375 484.851562 278.40625 484.851562 C 277.363281 484.851562 276.554688 484.558594 275.976562 483.964844 C 275.398438 483.371094 275.109375 482.5625 275.109375 481.546875 C 275.109375 481.066406 275.179688 480.625 275.324219 480.214844 C 275.464844 479.804688 275.671875 479.453125 275.949219 479.160156 C 276.21875 478.863281 276.554688 478.640625 276.953125 478.484375 C 277.355469 478.328125 277.800781 478.25 278.285156 478.25 C 278.917969 478.25 279.460938 478.386719 279.917969 478.652344 C 280.371094 478.917969 280.710938 479.265625 280.933594 479.6875 C 281.15625 480.113281 281.273438 480.542969 281.273438 480.984375 C 281.273438 481.390625 281.152344 481.652344 280.921875 481.777344 C 280.6875 481.894531 280.359375 481.957031 279.9375 481.957031 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 286.664062 481.53125 C 286.664062 481.101562 286.601562 480.734375 286.46875 480.425781 C 286.339844 480.121094 286.15625 479.882812 285.929688 479.722656 C 285.699219 479.558594 285.4375 479.472656 285.15625 479.472656 C 284.710938 479.472656 284.335938 479.652344 284.027344 480.003906 C 283.71875 480.355469 283.5625 480.875 283.5625 481.558594 C 283.5625 482.203125 283.71875 482.707031 284.023438 483.0625 C 284.328125 483.421875 284.703125 483.601562 285.15625 483.601562 C 285.425781 483.601562 285.675781 483.519531 285.90625 483.367188 C 286.136719 483.210938 286.320312 482.976562 286.457031 482.664062 C 286.597656 482.347656 286.664062 481.972656 286.664062 481.53125 M 283.488281 479.175781 L 283.488281 479.371094 C 283.789062 478.992188 284.109375 478.714844 284.441406 478.542969 C 284.765625 478.363281 285.140625 478.273438 285.554688 478.273438 C 286.050781 478.273438 286.515625 478.40625 286.933594 478.660156 C 287.351562 478.917969 287.683594 479.296875 287.929688 479.789062 C 288.171875 480.285156 288.292969 480.871094 288.292969 481.546875 C 288.292969 482.046875 288.222656 482.503906 288.085938 482.925781 C 287.941406 483.339844 287.746094 483.691406 287.503906 483.972656 C 287.257812 484.253906 286.96875 484.472656 286.636719 484.628906 C 286.296875 484.777344 285.9375 484.851562 285.554688 484.851562 C 285.09375 484.851562 284.703125 484.761719 284.390625 484.574219 C 284.074219 484.390625 283.773438 484.117188 283.488281 483.757812 L 283.488281 486.191406 C 283.488281 486.898438 283.226562 487.257812 282.710938 487.257812 C 282.402344 487.257812 282.203125 487.167969 282.101562 486.984375 C 282.007812 486.796875 281.957031 486.535156 281.957031 486.175781 L 281.957031 479.179688 C 281.957031 478.875 282.023438 478.644531 282.15625 478.492188 C 282.289062 478.339844 282.476562 478.261719 282.710938 478.261719 C 282.941406 478.261719 283.125 478.339844 283.269531 478.496094 C 283.417969 478.65625 283.488281 478.878906 283.488281 479.175781 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 290.726562 479.179688 L 290.726562 483.871094 C 290.726562 484.195312 290.652344 484.4375 290.496094 484.605469 C 290.339844 484.773438 290.148438 484.855469 289.910156 484.855469 C 289.667969 484.855469 289.480469 484.769531 289.328125 484.597656 C 289.179688 484.425781 289.105469 484.183594 289.105469 483.871094 L 289.105469 479.230469 C 289.105469 478.910156 289.179688 478.667969 289.328125 478.507812 C 289.480469 478.339844 289.667969 478.261719 289.910156 478.261719 C 290.148438 478.261719 290.339844 478.339844 290.496094 478.507812 C 290.652344 478.667969 290.726562 478.898438 290.726562 479.179688 M 289.925781 477.507812 C 289.699219 477.507812 289.507812 477.4375 289.347656 477.296875 C 289.183594 477.160156 289.105469 476.964844 289.105469 476.714844 C 289.105469 476.484375 289.1875 476.292969 289.355469 476.144531 C 289.515625 475.996094 289.707031 475.921875 289.925781 475.921875 C 290.136719 475.921875 290.324219 475.988281 290.484375 476.121094 C 290.644531 476.257812 290.726562 476.457031 290.726562 476.714844 C 290.726562 476.960938 290.648438 477.160156 290.492188 477.296875 C 290.332031 477.4375 290.144531 477.507812 289.925781 477.507812 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 295.953125 484.113281 L 294.523438 481.757812 L 293.644531 482.589844 L 293.644531 483.882812 C 293.644531 484.191406 293.5625 484.433594 293.398438 484.597656 C 293.234375 484.769531 293.042969 484.851562 292.832031 484.851562 C 292.582031 484.851562 292.382812 484.769531 292.242188 484.601562 C 292.101562 484.4375 292.027344 484.191406 292.027344 483.871094 L 292.027344 476.957031 C 292.027344 476.597656 292.097656 476.324219 292.234375 476.132812 C 292.375 475.941406 292.574219 475.851562 292.832031 475.851562 C 293.082031 475.851562 293.277344 475.9375 293.425781 476.109375 C 293.570312 476.277344 293.644531 476.53125 293.644531 476.859375 L 293.644531 480.792969 L 295.46875 478.878906 C 295.691406 478.644531 295.863281 478.476562 295.984375 478.390625 C 296.101562 478.304688 296.246094 478.261719 296.414062 478.261719 C 296.617188 478.261719 296.785156 478.328125 296.925781 478.457031 C 297.054688 478.585938 297.125 478.746094 297.125 478.9375 C 297.125 479.175781 296.902344 479.496094 296.464844 479.890625 L 295.605469 480.679688 L 297.265625 483.292969 C 297.386719 483.488281 297.480469 483.632812 297.53125 483.734375 C 297.585938 483.835938 297.613281 483.933594 297.613281 484.023438 C 297.613281 484.28125 297.542969 484.480469 297.398438 484.632812 C 297.261719 484.78125 297.070312 484.851562 296.847656 484.851562 C 296.648438 484.851562 296.492188 484.804688 296.386719 484.691406 C 296.28125 484.585938 296.132812 484.390625 295.953125 484.113281 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 299.472656 484.851562 C 299.230469 484.851562 299.019531 484.777344 298.839844 484.617188 C 298.664062 484.460938 298.574219 484.238281 298.574219 483.949219 C 298.574219 483.710938 298.660156 483.5 298.828125 483.328125 C 299 483.15625 299.207031 483.066406 299.457031 483.066406 C 299.707031 483.066406 299.917969 483.15625 300.097656 483.324219 C 300.273438 483.496094 300.363281 483.707031 300.363281 483.949219 C 300.363281 484.234375 300.273438 484.457031 300.097656 484.613281 C 299.917969 484.777344 299.710938 484.851562 299.472656 484.851562 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 307.535156 482.847656 C 307.535156 483.046875 307.476562 483.265625 307.355469 483.492188 C 307.234375 483.726562 307.050781 483.945312 306.800781 484.152344 C 306.554688 484.359375 306.242188 484.527344 305.867188 484.652344 C 305.488281 484.78125 305.066406 484.84375 304.597656 484.84375 C 303.59375 484.84375 302.8125 484.550781 302.25 483.96875 C 301.6875 483.382812 301.40625 482.601562 301.40625 481.617188 C 301.40625 480.953125 301.535156 480.367188 301.796875 479.855469 C 302.050781 479.34375 302.421875 478.949219 302.90625 478.667969 C 303.394531 478.390625 303.980469 478.25 304.652344 478.25 C 305.074219 478.25 305.460938 478.3125 305.8125 478.4375 C 306.160156 478.558594 306.457031 478.714844 306.703125 478.910156 C 306.945312 479.105469 307.132812 479.3125 307.257812 479.53125 C 307.386719 479.75 307.449219 479.953125 307.449219 480.148438 C 307.449219 480.339844 307.382812 480.503906 307.234375 480.640625 C 307.089844 480.773438 306.914062 480.839844 306.714844 480.839844 C 306.574219 480.839844 306.464844 480.804688 306.375 480.738281 C 306.285156 480.667969 306.183594 480.558594 306.074219 480.398438 C 305.878906 480.101562 305.671875 479.871094 305.453125 479.726562 C 305.238281 479.574219 304.964844 479.496094 304.632812 479.496094 C 304.15625 479.496094 303.765625 479.683594 303.472656 480.058594 C 303.183594 480.429688 303.03125 480.945312 303.03125 481.59375 C 303.03125 481.898438 303.070312 482.179688 303.148438 482.4375 C 303.222656 482.691406 303.332031 482.910156 303.472656 483.085938 C 303.617188 483.265625 303.789062 483.402344 303.988281 483.496094 C 304.191406 483.59375 304.414062 483.636719 304.652344 483.636719 C 304.980469 483.636719 305.257812 483.5625 305.488281 483.410156 C 305.726562 483.261719 305.929688 483.03125 306.105469 482.722656 C 306.207031 482.539062 306.308594 482.402344 306.425781 482.296875 C 306.539062 482.195312 306.679688 482.140625 306.847656 482.140625 C 307.046875 482.140625 307.210938 482.214844 307.339844 482.367188 C 307.46875 482.519531 307.535156 482.675781 307.535156 482.847656 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 312.902344 481.558594 C 312.902344 480.898438 312.757812 480.382812 312.464844 480.015625 C 312.175781 479.644531 311.785156 479.460938 311.296875 479.460938 C 310.976562 479.460938 310.699219 479.542969 310.457031 479.707031 C 310.214844 479.871094 310.03125 480.113281 309.898438 480.433594 C 309.769531 480.757812 309.703125 481.132812 309.703125 481.558594 C 309.703125 481.984375 309.765625 482.351562 309.894531 482.667969 C 310.027344 482.988281 310.210938 483.226562 310.449219 483.398438 C 310.691406 483.5625 310.972656 483.652344 311.296875 483.652344 C 311.785156 483.652344 312.175781 483.464844 312.464844 483.089844 C 312.757812 482.722656 312.902344 482.210938 312.902344 481.558594 M 314.53125 481.558594 C 314.53125 482.039062 314.453125 482.488281 314.308594 482.898438 C 314.15625 483.304688 313.9375 483.65625 313.652344 483.945312 C 313.367188 484.238281 313.027344 484.460938 312.632812 484.621094 C 312.230469 484.777344 311.789062 484.855469 311.296875 484.855469 C 310.804688 484.855469 310.363281 484.777344 309.96875 484.617188 C 309.582031 484.460938 309.238281 484.234375 308.953125 483.941406 C 308.667969 483.640625 308.449219 483.292969 308.296875 482.890625 C 308.152344 482.488281 308.078125 482.042969 308.078125 481.558594 C 308.078125 481.070312 308.15625 480.621094 308.300781 480.210938 C 308.453125 479.800781 308.671875 479.453125 308.949219 479.164062 C 309.230469 478.875 309.570312 478.65625 309.96875 478.496094 C 310.371094 478.339844 310.8125 478.261719 311.296875 478.261719 C 311.785156 478.261719 312.230469 478.339844 312.632812 478.5 C 313.03125 478.660156 313.371094 478.886719 313.660156 479.175781 C 313.945312 479.472656 314.160156 479.820312 314.308594 480.21875 C 314.457031 480.625 314.53125 481.070312 314.53125 481.558594 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 320.714844 481.679688 L 320.714844 483.832031 C 320.714844 484.175781 320.636719 484.425781 320.484375 484.601562 C 320.324219 484.769531 320.125 484.855469 319.871094 484.855469 C 319.625 484.855469 319.425781 484.769531 319.277344 484.601562 C 319.121094 484.425781 319.042969 484.175781 319.042969 483.832031 L 319.042969 481.25 C 319.042969 480.839844 319.03125 480.527344 319.003906 480.296875 C 318.976562 480.078125 318.898438 479.890625 318.777344 479.746094 C 318.652344 479.601562 318.457031 479.527344 318.195312 479.527344 C 317.664062 479.527344 317.316406 479.707031 317.148438 480.078125 C 316.980469 480.4375 316.894531 480.960938 316.894531 481.644531 L 316.894531 483.832031 C 316.894531 484.167969 316.816406 484.421875 316.667969 484.597656 C 316.511719 484.769531 316.3125 484.855469 316.066406 484.855469 C 315.816406 484.855469 315.617188 484.769531 315.460938 484.597656 C 315.304688 484.421875 315.226562 484.167969 315.226562 483.832031 L 315.226562 479.195312 C 315.226562 478.890625 315.292969 478.65625 315.4375 478.5 C 315.578125 478.339844 315.765625 478.261719 315.992188 478.261719 C 316.214844 478.261719 316.398438 478.339844 316.550781 478.484375 C 316.695312 478.632812 316.769531 478.839844 316.769531 479.101562 L 316.769531 479.253906 C 317.054688 478.917969 317.355469 478.671875 317.675781 478.515625 C 317.996094 478.355469 318.351562 478.273438 318.742188 478.273438 C 319.152344 478.273438 319.5 478.355469 319.792969 478.519531 C 320.085938 478.679688 320.324219 478.925781 320.519531 479.253906 C 320.792969 478.921875 321.085938 478.675781 321.398438 478.515625 C 321.710938 478.355469 322.058594 478.273438 322.4375 478.273438 C 322.878906 478.273438 323.261719 478.363281 323.582031 478.535156 C 323.902344 478.710938 324.140625 478.960938 324.300781 479.28125 C 324.4375 479.578125 324.507812 480.039062 324.507812 480.667969 L 324.507812 483.832031 C 324.507812 484.175781 324.433594 484.425781 324.277344 484.601562 C 324.121094 484.769531 323.917969 484.855469 323.664062 484.855469 C 323.417969 484.855469 323.21875 484.769531 323.0625 484.597656 C 322.90625 484.421875 322.828125 484.167969 322.828125 483.832031 L 322.828125 481.109375 C 322.828125 480.757812 322.8125 480.480469 322.785156 480.273438 C 322.753906 480.058594 322.675781 479.882812 322.542969 479.742188 C 322.410156 479.601562 322.214844 479.527344 321.949219 479.527344 C 321.734375 479.527344 321.53125 479.59375 321.339844 479.71875 C 321.148438 479.84375 320.996094 480.019531 320.890625 480.226562 C 320.773438 480.5 320.714844 480.984375 320.714844 481.679688 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 245.355469 481.683594 C 245.324219 481.539062 245.300781 481.390625 245.28125 481.246094 C 245.300781 481.390625 245.324219 481.539062 245.355469 481.683594 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 245.890625 483.191406 C 245.886719 483.183594 245.882812 483.175781 245.878906 483.167969 C 245.882812 483.175781 245.886719 483.183594 245.890625 483.191406 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 245.839844 483.089844 C 245.824219 483.0625 245.8125 483.03125 245.796875 483.003906 C 245.8125 483.035156 245.824219 483.0625 245.839844 483.089844 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 245.503906 482.265625 C 245.582031 482.515625 245.679688 482.757812 245.789062 482.988281 C 245.679688 482.753906 245.582031 482.507812 245.507812 482.265625 Z M 245.503906 482.265625 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 251.542969 474.957031 C 251.859375 474.957031 252.089844 474.980469 252.355469 475.027344 L 252.429688 474.550781 C 252.429688 474.550781 251.699219 474.324219 250.734375 474.402344 L 250.660156 474.144531 C 250.960938 474.082031 251.183594 473.8125 251.183594 473.496094 C 251.183594 473.132812 250.886719 472.839844 250.523438 472.839844 C 250.160156 472.839844 249.863281 473.132812 249.863281 473.496094 C 249.863281 473.8125 250.085938 474.082031 250.386719 474.144531 L 250.46875 474.433594 C 249.449219 474.574219 248.636719 474.972656 248.636719 474.972656 L 248.777344 475.410156 C 249.398438 475.207031 249.933594 475.082031 250.417969 475.027344 C 250.894531 474.980469 251.253906 474.957031 251.542969 474.957031 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 245.878906 477.367188 L 245.882812 477.363281 C 245.90625 477.332031 245.929688 477.304688 245.953125 477.273438 L 245.757812 477.132812 L 245.453125 476.910156 C 245.433594 476.933594 244.957031 477.375 244.578125 478.191406 C 244.558594 478.164062 244.542969 478.140625 244.519531 478.117188 C 244.40625 477.992188 244.25 477.929688 244.046875 477.929688 L 244.039062 477.929688 C 243.914062 477.929688 243.828125 477.890625 243.769531 477.839844 C 243.828125 477.769531 243.859375 477.679688 243.859375 477.582031 C 243.859375 477.351562 243.671875 477.164062 243.441406 477.164062 C 243.210938 477.164062 243.023438 477.351562 243.023438 477.582031 C 243.023438 477.8125 243.210938 478 243.441406 478 C 243.476562 478 243.511719 477.996094 243.546875 477.988281 C 243.648438 478.101562 243.8125 478.203125 244.050781 478.195312 C 244.171875 478.195312 244.261719 478.226562 244.324219 478.292969 C 244.394531 478.371094 244.417969 478.476562 244.421875 478.558594 C 244.421875 478.558594 244.421875 478.5625 244.421875 478.5625 C 244.148438 479.304688 244.226562 480.230469 244.226562 480.230469 L 244.886719 480.257812 C 244.902344 479.921875 244.949219 479.332031 245.121094 478.863281 C 245.449219 477.960938 245.863281 477.390625 245.878906 477.367188 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 257.292969 475.507812 C 257.066406 475.507812 256.875 475.695312 256.875 475.929688 C 256.875 475.960938 256.882812 475.996094 256.894531 476.03125 C 256.777344 476.132812 256.679688 476.296875 256.679688 476.535156 C 256.683594 476.660156 256.652344 476.75 256.582031 476.8125 C 256.53125 476.855469 256.464844 476.882812 256.398438 476.898438 C 255.90625 476.207031 255.304688 475.789062 255.304688 475.789062 L 254.828125 476.296875 C 255.1875 476.621094 255.554688 477.03125 255.90625 477.539062 C 256.152344 477.894531 256.40625 478.347656 256.617188 478.800781 L 257.257812 478.496094 C 257.257812 478.496094 256.96875 477.773438 256.554688 477.125 C 256.625 477.101562 256.699219 477.0625 256.761719 477.003906 C 256.886719 476.894531 256.949219 476.734375 256.945312 476.53125 C 256.941406 476.402344 256.984375 476.316406 257.035156 476.253906 C 257.109375 476.3125 257.199219 476.347656 257.292969 476.347656 C 257.527344 476.347656 257.714844 476.15625 257.714844 475.929688 C 257.714844 475.695312 257.527344 475.507812 257.292969 475.507812 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 255.636719 481.261719 C 254.753906 481.691406 253.304688 482.257812 251.394531 482.523438 C 250.648438 482.625 249.921875 482.664062 249.253906 482.664062 C 248.386719 482.664062 247.617188 482.601562 247.027344 482.527344 C 246.355469 482.441406 245.828125 482.335938 245.507812 482.265625 C 245.582031 482.507812 245.679688 482.753906 245.789062 482.988281 C 245.792969 482.992188 245.796875 483 245.796875 483.003906 C 245.8125 483.03125 245.824219 483.0625 245.839844 483.089844 C 245.851562 483.117188 245.867188 483.144531 245.878906 483.167969 C 245.882812 483.175781 245.886719 483.183594 245.890625 483.191406 C 246.078125 483.546875 246.308594 483.871094 246.566406 484.15625 C 247.464844 485.140625 248.382812 485.296875 248.390625 485.296875 L 248.40625 485.300781 L 248.417969 485.304688 C 248.425781 485.308594 249.238281 485.570312 250.476562 485.570312 C 251.691406 485.570312 252.886719 485.324219 254.023438 484.839844 C 254.863281 484.410156 255.660156 483.753906 256.054688 483.171875 C 256.363281 482.71875 256.582031 482.238281 256.710938 481.738281 C 256.78125 481.472656 256.835938 481.046875 256.804688 480.597656 C 256.558594 480.765625 256.164062 481 255.636719 481.261719 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 248.679688 477.117188 C 249.652344 477.117188 250.4375 477.90625 250.4375 478.878906 C 250.4375 479.847656 249.652344 480.636719 248.679688 480.636719 C 247.707031 480.636719 246.917969 479.847656 246.917969 478.878906 C 246.917969 477.90625 247.707031 477.117188 248.679688 477.117188 M 253.828125 477.160156 C 254.429688 477.160156 254.917969 477.648438 254.917969 478.25 C 254.917969 478.851562 254.429688 479.339844 253.828125 479.339844 C 253.230469 479.339844 252.742188 478.851562 252.742188 478.25 C 252.742188 477.648438 253.230469 477.160156 253.828125 477.160156 M 246.160156 477.578125 C 246.136719 477.613281 245.753906 478.15625 245.453125 478.984375 C 245.226562 479.605469 245.234375 480.511719 245.234375 480.523438 C 245.234375 480.738281 245.246094 480.945312 245.269531 481.15625 C 245.269531 481.160156 245.269531 481.164062 245.273438 481.167969 C 245.273438 481.191406 245.277344 481.21875 245.28125 481.246094 C 245.300781 481.390625 245.324219 481.539062 245.355469 481.683594 C 245.792969 481.796875 248.40625 482.40625 251.324219 482 C 253.152344 481.746094 254.542969 481.203125 255.386719 480.796875 C 256.085938 480.457031 256.535156 480.148438 256.710938 480.019531 C 256.535156 479.378906 256.058594 478.371094 255.621094 477.742188 C 254.367188 475.953125 253.015625 475.492188 252.324219 475.378906 C 252.058594 475.335938 251.84375 475.308594 251.542969 475.308594 C 251.265625 475.308594 250.917969 475.332031 250.457031 475.382812 C 249.992188 475.429688 249.472656 475.550781 248.871094 475.753906 C 248.03125 476.035156 247.269531 476.476562 246.667969 477.03125 L 246.648438 477.050781 C 246.558594 477.132812 246.375 477.304688 246.160156 477.578125 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 217.285156 126.085938 C 217.285156 128.214844 215.558594 129.941406 213.429688 129.941406 L 47.816406 129.941406 C 45.6875 129.941406 43.960938 128.214844 43.960938 126.085938 C 43.960938 123.957031 45.6875 122.230469 47.816406 122.230469 L 213.429688 122.230469 C 215.558594 122.230469 217.285156 123.957031 217.285156 126.085938 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 226.964844 95.820312 L 213.152344 95.820312 L 213.152344 89.527344 L 226.964844 89.527344 Z M 226.964844 95.820312 "/>
<path fill-rule="nonzero" fill="rgb(62.353516%, 39.99939%, 30.195618%)" fill-opacity="1" d="M 229.363281 98.648438 L 224.5625 98.648438 L 224.5625 86.695312 L 229.363281 86.695312 Z M 229.363281 98.648438 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 35.046875 89.527344 L 48.855469 89.527344 L 48.855469 95.820312 L 35.046875 95.820312 Z M 35.046875 89.527344 "/>
<path fill-rule="nonzero" fill="rgb(62.353516%, 39.99939%, 30.195618%)" fill-opacity="1" d="M 32.644531 86.695312 L 37.445312 86.695312 L 37.445312 98.648438 L 32.644531 98.648438 Z M 32.644531 86.695312 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 216.859375 108.570312 L 44.066406 108.570312 L 44.066406 26.601562 L 216.859375 26.601562 Z M 216.859375 108.570312 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 19.215393%, 11.764526%)" fill-opacity="1" d="M 214.800781 108.570312 L 46.449219 108.570312 L 46.449219 30.019531 L 214.800781 30.019531 Z M 214.800781 108.570312 "/>
<path fill-rule="nonzero" fill="rgb(62.353516%, 39.99939%, 30.195618%)" fill-opacity="1" d="M 210.417969 111.898438 L 50.507812 111.898438 L 50.507812 34.28125 L 210.417969 34.28125 Z M 210.417969 111.898438 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 65.597656 101.738281 C 65.597656 104.390625 63.449219 106.539062 60.796875 106.539062 L 60.550781 106.539062 C 57.898438 106.539062 55.746094 104.390625 55.746094 101.738281 L 55.746094 43.808594 C 55.746094 41.160156 57.898438 39.007812 60.550781 39.007812 L 60.796875 39.007812 C 63.449219 39.007812 65.597656 41.160156 65.597656 43.808594 Z M 65.597656 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 83.046875 101.738281 C 83.046875 104.390625 80.894531 106.539062 78.242188 106.539062 L 77.996094 106.539062 C 75.34375 106.539062 73.195312 104.390625 73.195312 101.738281 L 73.195312 43.808594 C 73.195312 41.160156 75.34375 39.007812 77.996094 39.007812 L 78.242188 39.007812 C 80.894531 39.007812 83.046875 41.160156 83.046875 43.808594 Z M 83.046875 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 100.492188 101.738281 C 100.492188 104.390625 98.34375 106.539062 95.691406 106.539062 L 95.445312 106.539062 C 92.792969 106.539062 90.644531 104.390625 90.644531 101.738281 L 90.644531 43.808594 C 90.644531 41.160156 92.792969 39.007812 95.445312 39.007812 L 95.691406 39.007812 C 98.34375 39.007812 100.492188 41.160156 100.492188 43.808594 Z M 100.492188 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 117.941406 101.738281 C 117.941406 104.390625 115.789062 106.539062 113.140625 106.539062 L 112.890625 106.539062 C 110.238281 106.539062 108.089844 104.390625 108.089844 101.738281 L 108.089844 43.808594 C 108.089844 41.160156 110.238281 39.007812 112.890625 39.007812 L 113.140625 39.007812 C 115.789062 39.007812 117.941406 41.160156 117.941406 43.808594 Z M 117.941406 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 135.390625 101.738281 C 135.390625 104.390625 133.238281 106.539062 130.585938 106.539062 L 130.339844 106.539062 C 127.6875 106.539062 125.539062 104.390625 125.539062 101.738281 L 125.539062 43.808594 C 125.539062 41.160156 127.6875 39.007812 130.339844 39.007812 L 130.585938 39.007812 C 133.238281 39.007812 135.390625 41.160156 135.390625 43.808594 Z M 135.390625 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 152.835938 101.738281 C 152.835938 104.390625 150.6875 106.539062 148.035156 106.539062 L 147.789062 106.539062 C 145.136719 106.539062 142.984375 104.390625 142.984375 101.738281 L 142.984375 43.808594 C 142.984375 41.160156 145.136719 39.007812 147.789062 39.007812 L 148.035156 39.007812 C 150.6875 39.007812 152.835938 41.160156 152.835938 43.808594 Z M 152.835938 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 170.285156 101.738281 C 170.285156 104.390625 168.132812 106.539062 165.480469 106.539062 L 165.234375 106.539062 C 162.582031 106.539062 160.433594 104.390625 160.433594 101.738281 L 160.433594 43.808594 C 160.433594 41.160156 162.582031 39.007812 165.234375 39.007812 L 165.480469 39.007812 C 168.132812 39.007812 170.285156 41.160156 170.285156 43.808594 Z M 170.285156 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 187.730469 101.738281 C 187.730469 104.390625 185.582031 106.539062 182.929688 106.539062 L 182.683594 106.539062 C 180.03125 106.539062 177.878906 104.390625 177.878906 101.738281 L 177.878906 43.808594 C 177.878906 41.160156 180.03125 39.007812 182.683594 39.007812 L 182.929688 39.007812 C 185.582031 39.007812 187.730469 41.160156 187.730469 43.808594 Z M 187.730469 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 205.179688 101.738281 C 205.179688 104.390625 203.03125 106.539062 200.375 106.539062 L 200.128906 106.539062 C 197.480469 106.539062 195.328125 104.390625 195.328125 101.738281 L 195.328125 43.808594 C 195.328125 41.160156 197.480469 39.007812 200.128906 39.007812 L 200.375 39.007812 C 203.03125 39.007812 205.179688 41.160156 205.179688 43.808594 Z M 205.179688 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(62.353516%, 39.99939%, 30.195618%)" fill-opacity="1" d="M 220.175781 111.375 L 40.75 111.375 L 40.75 98.726562 L 220.175781 98.726562 Z M 220.175781 111.375 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 19.215393%, 11.764526%)" fill-opacity="1" d="M 220.175781 101.738281 L 40.75 101.738281 L 40.75 98.726562 L 220.175781 98.726562 Z M 220.175781 101.738281 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 220.175781 111.375 L 40.75 111.375 L 47.679688 119.578125 L 213.246094 119.578125 Z M 220.175781 111.375 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 66.945312 120.382812 C 66.945312 124.195312 63.851562 127.289062 60.035156 127.289062 C 56.21875 127.289062 53.125 124.195312 53.125 120.382812 C 53.125 116.566406 56.21875 113.472656 60.035156 113.472656 C 63.851562 113.472656 66.945312 116.566406 66.945312 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 64.914062 120.382812 C 64.914062 123.074219 62.730469 125.257812 60.035156 125.257812 C 57.34375 125.257812 55.160156 123.074219 55.160156 120.382812 C 55.160156 117.6875 57.34375 115.503906 60.035156 115.503906 C 62.730469 115.503906 64.914062 117.6875 64.914062 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 102.367188 120.382812 C 102.367188 124.195312 99.273438 127.289062 95.457031 127.289062 C 91.640625 127.289062 88.546875 124.195312 88.546875 120.382812 C 88.546875 116.566406 91.640625 113.472656 95.457031 113.472656 C 99.273438 113.472656 102.367188 116.566406 102.367188 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 100.335938 120.382812 C 100.335938 123.074219 98.152344 125.257812 95.457031 125.257812 C 92.761719 125.257812 90.582031 123.074219 90.582031 120.382812 C 90.582031 117.6875 92.761719 115.503906 95.457031 115.503906 C 98.152344 115.503906 100.335938 117.6875 100.335938 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 86.113281 120.382812 C 86.113281 123.074219 83.929688 125.257812 81.234375 125.257812 L 74.257812 125.257812 C 71.566406 125.257812 69.382812 123.074219 69.382812 120.382812 C 69.382812 117.6875 71.566406 115.503906 74.257812 115.503906 L 81.234375 115.503906 C 83.929688 115.503906 86.113281 117.6875 86.113281 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 172.378906 120.382812 C 172.378906 124.195312 169.285156 127.289062 165.46875 127.289062 C 161.652344 127.289062 158.558594 124.195312 158.558594 120.382812 C 158.558594 116.566406 161.652344 113.472656 165.46875 113.472656 C 169.285156 113.472656 172.378906 116.566406 172.378906 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 170.34375 120.382812 C 170.34375 123.074219 168.160156 125.257812 165.46875 125.257812 C 162.773438 125.257812 160.589844 123.074219 160.589844 120.382812 C 160.589844 117.6875 162.773438 115.503906 165.46875 115.503906 C 168.160156 115.503906 170.34375 117.6875 170.34375 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 207.796875 120.382812 C 207.796875 124.195312 204.707031 127.289062 200.890625 127.289062 C 197.074219 127.289062 193.980469 124.195312 193.980469 120.382812 C 193.980469 116.566406 197.074219 113.472656 200.890625 113.472656 C 204.707031 113.472656 207.796875 116.566406 207.796875 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 205.765625 120.382812 C 205.765625 123.074219 203.582031 125.257812 200.890625 125.257812 C 198.195312 125.257812 196.011719 123.074219 196.011719 120.382812 C 196.011719 117.6875 198.195312 115.503906 200.890625 115.503906 C 203.582031 115.503906 205.765625 117.6875 205.765625 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 191.542969 120.382812 C 191.542969 123.074219 189.359375 125.257812 186.667969 125.257812 L 179.691406 125.257812 C 176.996094 125.257812 174.8125 123.074219 174.8125 120.382812 C 174.8125 117.6875 176.996094 115.503906 179.691406 115.503906 L 186.667969 115.503906 C 189.359375 115.503906 191.542969 117.6875 191.542969 120.382812 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 29.019165%, 19.999695%)" fill-opacity="1" d="M 223.96875 105.050781 C 223.96875 105.871094 223.34375 106.539062 222.574219 106.539062 L 38.351562 106.539062 C 37.582031 106.539062 36.957031 105.871094 36.957031 105.050781 C 36.957031 104.226562 37.582031 103.5625 38.351562 103.5625 L 222.574219 103.5625 C 223.34375 103.5625 223.96875 104.226562 223.96875 105.050781 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 205.113281 351.019531 C 205.113281 353.148438 203.386719 354.871094 201.261719 354.871094 L 42.078125 354.871094 C 39.949219 354.871094 38.222656 353.148438 38.222656 351.019531 C 38.222656 348.886719 39.949219 347.164062 42.078125 347.164062 L 201.261719 347.164062 C 203.386719 347.164062 205.113281 348.886719 205.113281 351.019531 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 210.160156 334.464844 L 196.347656 334.464844 L 196.347656 328.171875 L 210.160156 328.171875 Z M 210.160156 334.464844 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 212.5625 337.292969 L 207.757812 337.292969 L 207.757812 325.339844 L 212.5625 325.339844 Z M 212.5625 337.292969 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 33.3125 328.167969 L 47.121094 328.167969 L 47.121094 334.464844 L 33.3125 334.464844 Z M 33.3125 328.167969 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 30.910156 325.339844 L 35.710938 325.339844 L 35.710938 337.292969 L 30.910156 337.292969 Z M 30.910156 325.339844 "/>
<path fill-rule="nonzero" fill="rgb(9.411621%, 38.038635%, 23.136902%)" fill-opacity="1" d="M 199.582031 334.507812 L 43.007812 334.507812 L 43.007812 260.234375 L 199.582031 260.234375 Z M 199.582031 334.507812 "/>
<path fill-rule="nonzero" fill="rgb(20.783997%, 47.058105%, 33.332825%)" fill-opacity="1" d="M 193.746094 337.523438 L 48.847656 337.523438 L 48.847656 267.191406 L 193.746094 267.191406 Z M 193.746094 337.523438 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 72.941589%, 61.569214%)" fill-opacity="1" d="M 199.621094 306.878906 L 43.007812 306.878906 L 43.007812 303.695312 L 199.621094 303.695312 Z M 199.621094 306.878906 "/>
<path fill-rule="nonzero" fill="rgb(50.196838%, 72.941589%, 61.569214%)" fill-opacity="1" d="M 199.621094 318.90625 L 43.007812 318.90625 L 43.007812 312.640625 L 199.621094 312.640625 Z M 199.621094 318.90625 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 95.449219 293.105469 C 95.449219 295.460938 93.539062 297.371094 91.1875 297.371094 L 58.070312 297.371094 C 55.714844 297.371094 53.808594 295.460938 53.808594 293.105469 L 53.808594 279.722656 C 53.808594 277.371094 55.714844 275.460938 58.070312 275.460938 L 91.1875 275.460938 C 93.539062 275.460938 95.449219 277.371094 95.449219 279.722656 Z M 95.449219 293.105469 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 142.117188 293.105469 C 142.117188 295.460938 140.207031 297.371094 137.855469 297.371094 L 104.738281 297.371094 C 102.382812 297.371094 100.472656 295.460938 100.472656 293.105469 L 100.472656 279.722656 C 100.472656 277.371094 102.382812 275.460938 104.738281 275.460938 L 137.855469 275.460938 C 140.207031 275.460938 142.117188 277.371094 142.117188 279.722656 Z M 142.117188 293.105469 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 188.78125 293.105469 C 188.78125 295.460938 186.875 297.371094 184.519531 297.371094 L 151.402344 297.371094 C 149.050781 297.371094 147.140625 295.460938 147.140625 293.105469 L 147.140625 279.722656 C 147.140625 277.371094 149.050781 275.460938 151.402344 275.460938 L 184.519531 275.460938 C 186.875 275.460938 188.78125 277.371094 188.78125 279.722656 Z M 188.78125 293.105469 "/>
<g mask="url(#mdt-mask-0)">
<use href="#mdt-source-5" transform="matrix(1, 0, 0, 1, 53, 275)"/>
</g>
<g mask="url(#mdt-mask-1)">
<use href="#mdt-source-8" transform="matrix(1, 0, 0, 1, 53, 275)"/>
</g>
<g mask="url(#mdt-mask-2)">
<use href="#mdt-source-11" transform="matrix(1, 0, 0, 1, 64, 275)"/>
</g>
<g mask="url(#mdt-mask-3)">
<use href="#mdt-source-14" transform="matrix(1, 0, 0, 1, 81, 283)"/>
</g>
<g mask="url(#mdt-mask-4)">
<use href="#mdt-source-17" transform="matrix(1, 0, 0, 1, 100, 275)"/>
</g>
<g mask="url(#mdt-mask-5)">
<use href="#mdt-source-20" transform="matrix(1, 0, 0, 1, 134, 289)"/>
</g>
<g mask="url(#mdt-mask-6)">
<use href="#mdt-source-23" transform="matrix(1, 0, 0, 1, 116, 275)"/>
</g>
<g mask="url(#mdt-mask-7)">
<use href="#mdt-source-26" transform="matrix(1, 0, 0, 1, 101, 275)"/>
</g>
<g mask="url(#mdt-mask-8)">
<use href="#mdt-source-29" transform="matrix(1, 0, 0, 1, 153, 275)"/>
</g>
<g mask="url(#mdt-mask-9)">
<use href="#mdt-source-32" transform="matrix(1, 0, 0, 1, 169, 278)"/>
</g>
<g mask="url(#mdt-mask-10)">
<use href="#mdt-source-35" transform="matrix(1, 0, 0, 1, 182, 290)"/>
</g>
<g mask="url(#mdt-mask-11)">
<use href="#mdt-source-38" transform="matrix(1, 0, 0, 1, 147, 275)"/>
</g>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 202.585938 337.046875 L 40.007812 337.046875 L 40.007812 325.585938 L 202.585938 325.585938 Z M 202.585938 337.046875 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 202.585938 337.046875 L 40.007812 337.046875 L 46.285156 344.484375 L 196.308594 344.484375 Z M 202.585938 337.046875 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 63.742188 345.210938 C 63.742188 348.664062 60.9375 351.46875 57.480469 351.46875 C 54.023438 351.46875 51.21875 348.664062 51.21875 345.210938 C 51.21875 341.75 54.023438 338.945312 57.480469 338.945312 C 60.9375 338.945312 63.742188 341.75 63.742188 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 61.898438 345.210938 C 61.898438 347.648438 59.917969 349.628906 57.480469 349.628906 C 55.039062 349.628906 53.058594 347.648438 53.058594 345.210938 C 53.058594 342.769531 55.039062 340.789062 57.480469 340.789062 C 59.917969 340.789062 61.898438 342.769531 61.898438 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 95.839844 345.210938 C 95.839844 348.664062 93.035156 351.46875 89.574219 351.46875 C 86.117188 351.46875 83.316406 348.664062 83.316406 345.210938 C 83.316406 341.75 86.117188 338.945312 89.574219 338.945312 C 93.035156 338.945312 95.839844 341.75 95.839844 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 93.996094 345.210938 C 93.996094 347.648438 92.015625 349.628906 89.574219 349.628906 C 87.136719 349.628906 85.15625 347.648438 85.15625 345.210938 C 85.15625 342.769531 87.136719 340.789062 89.574219 340.789062 C 92.015625 340.789062 93.996094 342.769531 93.996094 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 81.109375 345.210938 C 81.109375 347.648438 79.128906 349.628906 76.6875 349.628906 L 70.367188 349.628906 C 67.925781 349.628906 65.949219 347.648438 65.949219 345.210938 C 65.949219 342.769531 67.925781 340.789062 70.367188 340.789062 L 76.6875 340.789062 C 79.128906 340.789062 81.109375 342.769531 81.109375 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 159.277344 345.210938 C 159.277344 348.664062 156.472656 351.46875 153.015625 351.46875 C 149.558594 351.46875 146.753906 348.664062 146.753906 345.210938 C 146.753906 341.75 149.558594 338.945312 153.015625 338.945312 C 156.472656 338.945312 159.277344 341.75 159.277344 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 157.433594 345.210938 C 157.433594 347.648438 155.457031 349.628906 153.015625 349.628906 C 150.574219 349.628906 148.59375 347.648438 148.59375 345.210938 C 148.59375 342.769531 150.574219 340.789062 153.015625 340.789062 C 155.457031 340.789062 157.433594 342.769531 157.433594 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 191.371094 345.210938 C 191.371094 348.664062 188.570312 351.46875 185.109375 351.46875 C 181.652344 351.46875 178.851562 348.664062 178.851562 345.210938 C 178.851562 341.75 181.652344 338.945312 185.109375 338.945312 C 188.570312 338.945312 191.371094 341.75 191.371094 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 189.53125 345.210938 C 189.53125 347.648438 187.550781 349.628906 185.109375 349.628906 C 182.671875 349.628906 180.691406 347.648438 180.691406 345.210938 C 180.691406 342.769531 182.671875 340.789062 185.109375 340.789062 C 187.550781 340.789062 189.53125 342.769531 189.53125 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 176.644531 345.210938 C 176.644531 347.648438 174.664062 349.628906 172.222656 349.628906 L 165.902344 349.628906 C 163.460938 349.628906 161.484375 347.648438 161.484375 345.210938 C 161.484375 342.769531 163.460938 340.789062 165.902344 340.789062 L 172.222656 340.789062 C 174.664062 340.789062 176.644531 342.769531 176.644531 345.210938 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 198.03125 259.53125 C 198.03125 261.984375 196.042969 263.96875 193.59375 263.96875 L 48.996094 263.96875 C 46.546875 263.96875 44.558594 261.984375 44.558594 259.53125 L 44.558594 257.015625 C 44.558594 254.566406 46.546875 252.582031 48.996094 252.582031 L 193.59375 252.582031 C 196.042969 252.582031 198.03125 254.566406 198.03125 257.015625 Z M 198.03125 259.53125 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 40.007812 332.664062 L 202.585938 332.664062 L 202.585938 329.96875 L 40.007812 329.96875 Z M 40.007812 332.664062 "/>
<path fill-rule="nonzero" fill="rgb(9.411621%, 38.038635%, 23.136902%)" fill-opacity="1" d="M 205.59375 266.109375 C 205.59375 268.875 203.355469 271.109375 200.59375 271.109375 L 41.996094 271.109375 C 39.234375 271.109375 36.996094 268.875 36.996094 266.109375 L 36.996094 263.273438 C 36.996094 260.511719 39.234375 258.273438 41.996094 258.273438 L 200.59375 258.273438 C 203.355469 258.273438 205.59375 260.511719 205.59375 263.273438 Z M 205.59375 266.109375 "/>
<path fill-rule="nonzero" fill="rgb(5.490112%, 21.960449%, 13.33313%)" fill-opacity="1" d="M 200.59375 264.695312 L 41.996094 264.695312 C 39.867188 264.695312 38.0625 263.359375 37.339844 261.484375 C 37.125 262.042969 36.996094 262.640625 36.996094 263.277344 L 36.996094 266.113281 C 36.996094 268.875 39.234375 271.113281 41.996094 271.113281 L 200.59375 271.113281 C 203.355469 271.113281 205.59375 268.875 205.59375 266.113281 L 205.59375 263.277344 C 205.59375 262.640625 205.464844 262.042969 205.25 261.484375 C 204.527344 263.359375 202.722656 264.695312 200.59375 264.695312 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 436.175781 462.160156 C 436.175781 464.292969 434.449219 466.015625 432.324219 466.015625 L 261.882812 466.015625 C 259.753906 466.015625 258.03125 464.292969 258.03125 462.160156 C 258.03125 460.03125 259.753906 458.308594 261.882812 458.308594 L 432.324219 458.308594 C 434.449219 458.308594 436.175781 460.03125 436.175781 462.160156 "/>
<path fill-rule="nonzero" fill="rgb(13.33313%, 29.411316%, 52.941895%)" fill-opacity="1" d="M 261.648438 441.660156 C 261.261719 441.660156 260.871094 441.566406 260.515625 441.375 C 259.585938 440.878906 259.089844 439.835938 259.289062 438.804688 L 265.59375 406.570312 C 265.847656 405.265625 267.105469 404.425781 268.40625 404.667969 C 269.710938 404.921875 270.5625 406.179688 270.308594 407.480469 L 265.472656 432.105469 L 273.921875 423.765625 C 274.867188 422.835938 276.386719 422.84375 277.316406 423.785156 C 278.25 424.726562 278.238281 426.25 277.296875 427.179688 L 263.335938 440.96875 C 262.875 441.421875 262.265625 441.660156 261.648438 441.660156 "/>
<path fill-rule="nonzero" fill="rgb(13.33313%, 29.411316%, 52.941895%)" fill-opacity="1" d="M 428.890625 441.660156 C 429.273438 441.660156 429.664062 441.566406 430.019531 441.375 C 430.949219 440.878906 431.445312 439.835938 431.246094 438.804688 L 424.941406 406.570312 C 424.691406 405.265625 423.429688 404.425781 422.128906 404.667969 C 420.828125 404.921875 419.976562 406.179688 420.226562 407.480469 L 425.0625 432.105469 L 416.617188 423.765625 C 415.671875 422.835938 414.152344 422.84375 413.21875 423.785156 C 412.289062 424.726562 412.296875 426.25 413.242188 427.179688 L 427.203125 440.96875 C 427.660156 441.421875 428.273438 441.660156 428.890625 441.660156 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 412.605469 393.195312 C 411.828125 386.882812 406.457031 382 399.941406 382 C 399.84375 382 399.753906 382.007812 399.660156 382.011719 C 398.53125 376.695312 394.09375 372.601562 388.605469 371.988281 C 387.402344 366.183594 382.261719 361.824219 376.101562 361.824219 C 373.816406 361.824219 371.675781 362.429688 369.820312 363.484375 C 368.25 358.203125 363.367188 354.347656 357.582031 354.347656 C 352.183594 354.347656 347.582031 357.699219 345.710938 362.425781 C 343.449219 360.382812 340.457031 359.128906 337.167969 359.128906 C 334.421875 359.128906 331.886719 360.003906 329.804688 361.476562 C 328.597656 361.101562 327.320312 360.894531 325.988281 360.894531 C 323.273438 360.894531 320.761719 361.75 318.695312 363.195312 C 316.964844 362.324219 315.023438 361.824219 312.957031 361.824219 C 309.484375 361.824219 306.339844 363.214844 304.035156 365.464844 C 299.4375 367.394531 296.207031 371.941406 296.207031 377.242188 C 296.207031 377.421875 296.226562 377.597656 296.234375 377.777344 C 296.207031 377.777344 296.183594 377.773438 296.160156 377.773438 C 291.011719 377.773438 286.585938 380.824219 284.566406 385.210938 C 283.292969 385.589844 282.101562 386.164062 281.027344 386.894531 C 279.960938 386.605469 278.847656 386.4375 277.691406 386.4375 C 270.636719 386.4375 264.921875 392.15625 264.921875 399.210938 C 264.921875 406.261719 270.636719 411.980469 277.691406 411.980469 C 280.363281 411.980469 282.835938 411.160156 284.886719 409.757812 C 285.953125 410.046875 287.070312 410.214844 288.222656 410.214844 C 292.457031 410.214844 296.199219 408.144531 298.523438 404.972656 C 299.335938 411.242188 304.6875 416.085938 311.175781 416.085938 C 315.617188 416.085938 319.523438 413.820312 321.808594 410.382812 C 323.640625 411.402344 325.75 411.980469 327.992188 411.980469 C 332.273438 411.980469 336.054688 409.867188 338.371094 406.632812 C 340.40625 410.988281 344.8125 414.011719 349.9375 414.011719 C 355.0625 414.011719 359.464844 410.992188 361.5 406.636719 C 363.796875 408.847656 366.914062 410.214844 370.351562 410.214844 C 373.585938 410.214844 376.535156 409.003906 378.78125 407.019531 C 381.121094 410.035156 384.765625 411.980469 388.875 411.980469 C 391.664062 411.980469 394.238281 411.078125 396.335938 409.558594 C 398.117188 414.472656 402.808594 417.988281 408.335938 417.988281 C 415.386719 417.988281 421.105469 412.269531 421.105469 405.214844 C 421.105469 399.664062 417.554688 394.953125 412.605469 393.195312 "/>
<path fill-rule="nonzero" fill="rgb(23.921204%, 23.921204%, 23.921204%)" fill-opacity="1" d="M 397.558594 396.15625 C 396.949219 391.214844 392.742188 387.386719 387.632812 387.386719 C 387.558594 387.386719 387.484375 387.394531 387.414062 387.394531 C 386.527344 383.226562 383.050781 380.019531 378.75 379.539062 C 377.804688 374.988281 373.777344 371.570312 368.949219 371.570312 C 367.15625 371.570312 365.476562 372.046875 364.023438 372.875 C 362.792969 368.734375 358.964844 365.714844 354.429688 365.714844 C 350.203125 365.714844 346.59375 368.339844 345.128906 372.046875 C 343.355469 370.441406 341.007812 369.460938 338.429688 369.460938 C 336.28125 369.460938 334.292969 370.144531 332.660156 371.300781 C 331.714844 371.003906 330.710938 370.84375 329.667969 370.84375 C 327.542969 370.84375 325.574219 371.511719 323.953125 372.644531 C 322.597656 371.964844 321.074219 371.570312 319.457031 371.570312 C 316.734375 371.570312 314.269531 372.660156 312.464844 374.425781 C 308.859375 375.9375 306.328125 379.5 306.328125 383.65625 C 306.328125 383.796875 306.34375 383.933594 306.347656 384.078125 C 306.328125 384.078125 306.308594 384.070312 306.289062 384.070312 C 302.253906 384.070312 298.789062 386.464844 297.203125 389.902344 C 296.203125 390.203125 295.269531 390.644531 294.429688 391.222656 C 293.59375 390.996094 292.71875 390.863281 291.816406 390.863281 C 286.289062 390.863281 281.804688 395.347656 281.804688 400.875 C 281.804688 406.402344 286.289062 410.886719 291.816406 410.886719 C 293.90625 410.886719 295.847656 410.238281 297.453125 409.140625 C 298.289062 409.371094 299.164062 409.5 300.070312 409.5 C 303.390625 409.5 306.324219 407.878906 308.144531 405.390625 C 308.78125 410.304688 312.972656 414.101562 318.058594 414.101562 C 321.539062 414.101562 324.601562 412.324219 326.394531 409.632812 C 327.832031 410.429688 329.480469 410.886719 331.242188 410.886719 C 334.597656 410.886719 337.558594 409.226562 339.375 406.691406 C 340.96875 410.105469 344.421875 412.476562 348.441406 412.476562 C 352.457031 412.476562 355.910156 410.109375 357.503906 406.695312 C 359.304688 408.429688 361.746094 409.5 364.441406 409.5 C 366.976562 409.5 369.285156 408.550781 371.050781 406.996094 C 372.878906 409.355469 375.738281 410.886719 378.957031 410.886719 C 381.144531 410.886719 383.160156 410.175781 384.808594 408.984375 C 386.203125 412.835938 389.878906 415.59375 394.210938 415.59375 C 399.738281 415.59375 404.222656 411.109375 404.222656 405.585938 C 404.222656 401.230469 401.4375 397.539062 397.558594 396.15625 "/>
<path fill-rule="nonzero" fill="rgb(29.019165%, 29.019165%, 29.019165%)" fill-opacity="1" d="M 289.753906 407.300781 C 290.363281 402.359375 294.570312 398.527344 299.679688 398.527344 C 299.757812 398.527344 299.828125 398.539062 299.902344 398.539062 C 300.785156 394.371094 304.261719 391.164062 308.566406 390.679688 C 309.507812 386.132812 313.535156 382.714844 318.363281 382.714844 C 320.15625 382.714844 321.835938 383.191406 323.289062 384.015625 C 324.519531 379.878906 328.347656 376.855469 332.882812 376.855469 C 337.109375 376.855469 340.71875 379.480469 342.1875 383.1875 C 343.960938 381.585938 346.304688 380.605469 348.882812 380.605469 C 351.03125 380.605469 353.023438 381.289062 354.652344 382.441406 C 355.597656 382.148438 356.601562 381.988281 357.644531 381.988281 C 359.773438 381.988281 361.738281 382.65625 363.359375 383.789062 C 364.714844 383.105469 366.238281 382.714844 367.859375 382.714844 C 370.578125 382.714844 373.042969 383.804688 374.851562 385.566406 C 378.453125 387.082031 380.984375 390.644531 380.984375 394.800781 C 380.984375 394.941406 380.972656 395.078125 380.964844 395.21875 C 380.984375 395.21875 381.003906 395.214844 381.023438 395.214844 C 385.058594 395.214844 388.527344 397.605469 390.109375 401.046875 C 391.109375 401.34375 392.042969 401.789062 392.882812 402.367188 C 393.71875 402.140625 394.59375 402.007812 395.5 402.007812 C 401.027344 402.007812 405.507812 406.488281 405.507812 412.019531 C 405.507812 417.546875 401.027344 422.027344 395.5 422.027344 C 393.40625 422.027344 391.464844 421.382812 389.859375 420.285156 C 389.023438 420.511719 388.148438 420.644531 387.242188 420.644531 C 383.925781 420.644531 380.992188 419.023438 379.171875 416.535156 C 378.53125 421.449219 374.339844 425.246094 369.253906 425.246094 C 365.773438 425.246094 362.710938 423.46875 360.917969 420.773438 C 359.484375 421.574219 357.832031 422.027344 356.074219 422.027344 C 352.71875 422.027344 349.753906 420.371094 347.9375 417.835938 C 346.34375 421.25 342.890625 423.621094 338.871094 423.621094 C 334.855469 423.621094 331.402344 421.253906 329.808594 417.839844 C 328.011719 419.574219 325.566406 420.644531 322.871094 420.644531 C 320.335938 420.644531 318.027344 419.691406 316.265625 418.136719 C 314.433594 420.5 311.574219 422.027344 308.355469 422.027344 C 306.167969 422.027344 304.152344 421.320312 302.507812 420.128906 C 301.109375 423.980469 297.433594 426.734375 293.101562 426.734375 C 287.574219 426.734375 283.09375 422.253906 283.09375 416.726562 C 283.09375 412.375 285.875 408.679688 289.753906 407.300781 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 408.414062 439.261719 L 284.246094 439.261719 L 250.984375 386.167969 L 441.679688 386.167969 Z M 408.414062 439.261719 "/>
<path fill-rule="nonzero" fill="rgb(18.431091%, 36.862183%, 63.922119%)" fill-opacity="1" d="M 402.984375 440.644531 L 289.675781 440.644531 L 262.308594 393.445312 L 430.351562 393.445312 Z M 402.984375 440.644531 "/>
<path fill-rule="nonzero" fill="rgb(13.33313%, 29.411316%, 52.941895%)" fill-opacity="1" d="M 408.414062 431.613281 L 284.246094 431.613281 L 250.984375 386.171875 L 284.246094 439.261719 L 408.414062 439.261719 L 441.679688 386.171875 Z M 408.414062 431.613281 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 436.042969 446.96875 L 256.617188 446.96875 L 256.617188 434.320312 L 436.042969 434.320312 Z M 436.042969 446.96875 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 436.042969 446.96875 L 256.617188 446.96875 L 263.546875 455.171875 L 429.113281 455.171875 Z M 436.042969 446.96875 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 282.8125 455.972656 C 282.8125 459.789062 279.71875 462.882812 275.90625 462.882812 C 272.085938 462.882812 268.996094 459.789062 268.996094 455.972656 C 268.996094 452.160156 272.085938 449.066406 275.90625 449.066406 C 279.71875 449.066406 282.8125 452.160156 282.8125 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 280.78125 455.972656 C 280.78125 458.667969 278.597656 460.851562 275.902344 460.851562 C 273.210938 460.851562 271.027344 458.667969 271.027344 455.972656 C 271.027344 453.28125 273.210938 451.097656 275.902344 451.097656 C 278.597656 451.097656 280.78125 453.28125 280.78125 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 318.234375 455.972656 C 318.234375 459.789062 315.140625 462.882812 311.324219 462.882812 C 307.507812 462.882812 304.417969 459.789062 304.417969 455.972656 C 304.417969 452.160156 307.507812 449.066406 311.324219 449.066406 C 315.140625 449.066406 318.234375 452.160156 318.234375 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 316.203125 455.972656 C 316.203125 458.667969 314.019531 460.851562 311.324219 460.851562 C 308.632812 460.851562 306.449219 458.667969 306.449219 455.972656 C 306.449219 453.28125 308.632812 451.097656 311.324219 451.097656 C 314.019531 451.097656 316.203125 453.28125 316.203125 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 301.980469 455.972656 C 301.980469 458.667969 299.796875 460.851562 297.101562 460.851562 L 290.125 460.851562 C 287.433594 460.851562 285.25 458.667969 285.25 455.972656 C 285.25 453.28125 287.433594 451.09375 290.125 451.09375 L 297.101562 451.09375 C 299.796875 451.09375 301.980469 453.28125 301.980469 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 388.246094 455.972656 C 388.246094 459.789062 385.152344 462.882812 381.335938 462.882812 C 377.519531 462.882812 374.429688 459.789062 374.429688 455.972656 C 374.429688 452.160156 377.519531 449.066406 381.335938 449.066406 C 385.152344 449.066406 388.246094 452.160156 388.246094 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 386.214844 455.972656 C 386.214844 458.667969 384.03125 460.851562 381.335938 460.851562 C 378.644531 460.851562 376.460938 458.667969 376.460938 455.972656 C 376.460938 453.28125 378.644531 451.097656 381.335938 451.097656 C 384.03125 451.097656 386.214844 453.28125 386.214844 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 423.667969 455.972656 C 423.667969 459.789062 420.574219 462.882812 416.757812 462.882812 C 412.941406 462.882812 409.847656 459.789062 409.847656 455.972656 C 409.847656 452.160156 412.941406 449.066406 416.757812 449.066406 C 420.574219 449.066406 423.667969 452.160156 423.667969 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 421.636719 455.972656 C 421.636719 458.667969 419.453125 460.851562 416.757812 460.851562 C 414.066406 460.851562 411.878906 458.667969 411.878906 455.972656 C 411.878906 453.28125 414.066406 451.097656 416.757812 451.097656 C 419.453125 451.097656 421.636719 453.28125 421.636719 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 407.410156 455.972656 C 407.410156 458.667969 405.226562 460.851562 402.535156 460.851562 L 395.558594 460.851562 C 392.867188 460.851562 390.683594 458.667969 390.683594 455.972656 C 390.683594 453.28125 392.867188 451.09375 395.558594 451.09375 L 402.535156 451.09375 C 405.226562 451.09375 407.410156 453.28125 407.410156 455.972656 "/>
<path fill-rule="nonzero" fill="rgb(13.33313%, 29.411316%, 52.941895%)" fill-opacity="1" d="M 439.839844 440.644531 C 439.839844 441.464844 439.214844 442.132812 438.441406 442.132812 L 254.222656 442.132812 C 253.449219 442.132812 252.824219 441.464844 252.824219 440.644531 C 252.824219 439.820312 253.449219 439.15625 254.222656 439.15625 L 438.441406 439.15625 C 439.214844 439.15625 439.839844 439.820312 439.839844 440.644531 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 466 244.609375 C 466 246.738281 464.273438 248.464844 462.144531 248.464844 L 287.3125 248.464844 C 285.183594 248.464844 283.457031 246.738281 283.457031 244.609375 C 283.457031 242.480469 285.183594 240.753906 287.3125 240.753906 L 462.144531 240.753906 C 464.273438 240.753906 466 242.480469 466 244.609375 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 473.214844 214.253906 L 459.402344 214.253906 L 459.402344 207.960938 L 473.214844 207.960938 Z M 473.214844 214.253906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 475.613281 217.082031 L 470.8125 217.082031 L 470.8125 205.128906 L 475.613281 205.128906 Z M 475.613281 217.082031 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 276.316406 207.960938 L 290.128906 207.960938 L 290.128906 214.253906 L 276.316406 214.253906 Z M 276.316406 207.960938 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 273.914062 205.128906 L 278.71875 205.128906 L 278.71875 217.082031 L 273.914062 217.082031 Z M 273.914062 205.128906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 457.257812 146.039062 C 457.257812 148.667969 455.128906 150.796875 452.503906 150.796875 L 296.351562 150.796875 C 293.726562 150.796875 291.597656 148.667969 291.597656 146.039062 C 291.597656 143.414062 293.726562 141.285156 296.351562 141.285156 L 452.503906 141.285156 C 455.128906 141.285156 457.257812 143.414062 457.257812 146.039062 "/>
<path fill-rule="nonzero" fill="rgb(100%, 57.255554%, 15.293884%)" fill-opacity="1" d="M 460.824219 227.378906 L 288.03125 227.378906 L 288.03125 145.410156 L 460.824219 145.410156 Z M 460.824219 227.378906 "/>
<path fill-rule="nonzero" fill="rgb(74.902344%, 41.175842%, 9.01947%)" fill-opacity="1" d="M 454.382812 230.710938 L 294.472656 230.710938 L 294.472656 153.089844 L 454.382812 153.089844 Z M 454.382812 230.710938 "/>
<path fill-rule="nonzero" fill="rgb(100%, 57.255554%, 15.293884%)" fill-opacity="1" d="M 464.140625 227.378906 L 284.714844 227.378906 L 284.714844 193.773438 L 464.140625 193.773438 Z M 464.140625 227.378906 "/>
<path fill-rule="nonzero" fill="rgb(100%, 69.804382%, 39.99939%)" fill-opacity="1" d="M 464.140625 199.214844 L 284.714844 199.214844 L 284.714844 193.773438 L 464.140625 193.773438 Z M 464.140625 199.214844 "/>
<path fill-rule="nonzero" fill="rgb(74.902344%, 41.175842%, 9.01947%)" fill-opacity="1" d="M 465.851562 223.859375 L 283.003906 223.859375 L 283.003906 217.535156 L 465.851562 217.535156 Z M 465.851562 223.859375 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 464.140625 223.859375 L 284.714844 223.859375 L 284.714844 230.183594 L 464.140625 230.183594 Z M 464.140625 223.859375 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 464.140625 230.183594 L 284.714844 230.183594 L 291.644531 238.390625 L 457.210938 238.390625 Z M 464.140625 230.183594 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 310.910156 239.191406 C 310.910156 243.007812 307.816406 246.097656 304 246.097656 C 300.183594 246.097656 297.09375 243.007812 297.09375 239.191406 C 297.09375 235.375 300.183594 232.28125 304 232.28125 C 307.816406 232.28125 310.910156 235.375 310.910156 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 308.878906 239.191406 C 308.878906 241.882812 306.695312 244.066406 304 244.066406 C 301.308594 244.066406 299.121094 241.882812 299.121094 239.191406 C 299.121094 236.496094 301.308594 234.3125 304 234.3125 C 306.695312 234.3125 308.878906 236.496094 308.878906 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 346.332031 239.191406 C 346.332031 243.007812 343.238281 246.097656 339.421875 246.097656 C 335.605469 246.097656 332.515625 243.007812 332.515625 239.191406 C 332.515625 235.375 335.605469 232.28125 339.421875 232.28125 C 343.238281 232.28125 346.332031 235.375 346.332031 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 344.300781 239.191406 C 344.300781 241.882812 342.117188 244.066406 339.421875 244.066406 C 336.730469 244.066406 334.542969 241.882812 334.542969 239.191406 C 334.542969 236.496094 336.730469 234.3125 339.421875 234.3125 C 342.117188 234.3125 344.300781 236.496094 344.300781 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 330.078125 239.191406 C 330.078125 241.882812 327.894531 244.066406 325.199219 244.066406 L 318.222656 244.066406 C 315.53125 244.066406 313.347656 241.882812 313.347656 239.191406 C 313.347656 236.496094 315.53125 234.3125 318.222656 234.3125 L 325.199219 234.3125 C 327.894531 234.3125 330.078125 236.496094 330.078125 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 416.34375 239.191406 C 416.34375 243.007812 413.246094 246.097656 409.433594 246.097656 C 405.617188 246.097656 402.523438 243.007812 402.523438 239.191406 C 402.523438 235.375 405.617188 232.28125 409.433594 232.28125 C 413.246094 232.28125 416.34375 235.375 416.34375 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 414.308594 239.191406 C 414.308594 241.882812 412.125 244.066406 409.433594 244.066406 C 406.742188 244.066406 404.554688 241.882812 404.554688 239.191406 C 404.554688 236.496094 406.742188 234.3125 409.433594 234.3125 C 412.125 234.3125 414.308594 236.496094 414.308594 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 451.765625 239.191406 C 451.765625 243.007812 448.671875 246.097656 444.855469 246.097656 C 441.039062 246.097656 437.945312 243.007812 437.945312 239.191406 C 437.945312 235.375 441.039062 232.28125 444.855469 232.28125 C 448.671875 232.28125 451.765625 235.375 451.765625 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 449.730469 239.191406 C 449.730469 241.882812 447.546875 244.066406 444.855469 244.066406 C 442.164062 244.066406 439.976562 241.882812 439.976562 239.191406 C 439.976562 236.496094 442.164062 234.3125 444.855469 234.3125 C 447.546875 234.3125 449.730469 236.496094 449.730469 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 435.507812 239.191406 C 435.507812 241.882812 433.324219 244.066406 430.632812 244.066406 L 423.65625 244.066406 C 420.960938 244.066406 418.78125 241.882812 418.78125 239.191406 C 418.78125 236.496094 420.960938 234.3125 423.65625 234.3125 L 430.632812 234.3125 C 433.324219 234.3125 435.507812 236.496094 435.507812 239.191406 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 467.933594 223.859375 C 467.933594 224.679688 467.308594 225.347656 466.539062 225.347656 L 282.316406 225.347656 C 281.546875 225.347656 280.921875 224.679688 280.921875 223.859375 C 280.921875 223.035156 281.546875 222.371094 282.316406 222.371094 L 466.539062 222.371094 C 467.308594 222.371094 467.933594 223.035156 467.933594 223.859375 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 323.191406 184.921875 C 323.191406 187.574219 321.042969 189.722656 318.390625 189.722656 L 306 189.722656 C 303.34375 189.722656 301.195312 187.574219 301.195312 184.921875 L 301.195312 162.804688 C 301.195312 160.152344 303.34375 158.003906 306 158.003906 L 318.390625 158.003906 C 321.042969 158.003906 323.191406 160.152344 323.191406 162.804688 Z M 323.191406 184.921875 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 354.386719 184.921875 C 354.386719 187.574219 352.234375 189.722656 349.582031 189.722656 L 337.191406 189.722656 C 334.539062 189.722656 332.390625 187.574219 332.390625 184.921875 L 332.390625 162.804688 C 332.390625 160.152344 334.539062 158.003906 337.191406 158.003906 L 349.582031 158.003906 C 352.234375 158.003906 354.386719 160.152344 354.386719 162.804688 Z M 354.386719 184.921875 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 385.582031 184.921875 C 385.582031 187.574219 383.429688 189.722656 380.777344 189.722656 L 368.386719 189.722656 C 365.734375 189.722656 363.585938 187.574219 363.585938 184.921875 L 363.585938 162.804688 C 363.585938 160.152344 365.734375 158.003906 368.386719 158.003906 L 380.777344 158.003906 C 383.429688 158.003906 385.582031 160.152344 385.582031 162.804688 Z M 385.582031 184.921875 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 416.777344 184.921875 C 416.777344 187.574219 414.625 189.722656 411.972656 189.722656 L 399.582031 189.722656 C 396.929688 189.722656 394.78125 187.574219 394.78125 184.921875 L 394.78125 162.804688 C 394.78125 160.152344 396.929688 158.003906 399.582031 158.003906 L 411.972656 158.003906 C 414.625 158.003906 416.777344 160.152344 416.777344 162.804688 Z M 416.777344 184.921875 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 447.96875 184.921875 C 447.96875 187.574219 445.820312 189.722656 443.167969 189.722656 L 430.777344 189.722656 C 428.125 189.722656 425.976562 187.574219 425.976562 184.921875 L 425.976562 162.804688 C 425.976562 160.152344 428.125 158.003906 430.777344 158.003906 L 443.167969 158.003906 C 445.820312 158.003906 447.96875 160.152344 447.96875 162.804688 Z M 447.96875 184.921875 "/>
<g mask="url(#mdt-mask-12)">
<use href="#mdt-source-41" transform="matrix(1, 0, 0, 1, 309, 176)"/>
</g>
<g mask="url(#mdt-mask-13)">
<use href="#mdt-source-44" transform="matrix(1, 0, 0, 1, 301, 163)"/>
</g>
<g mask="url(#mdt-mask-14)">
<use href="#mdt-source-47" transform="matrix(1, 0, 0, 1, 301, 158)"/>
</g>
<g mask="url(#mdt-mask-15)">
<use href="#mdt-source-50" transform="matrix(1, 0, 0, 1, 301, 158)"/>
</g>
<g mask="url(#mdt-mask-16)">
<use href="#mdt-source-53" transform="matrix(1, 0, 0, 1, 332, 158)"/>
</g>
<g mask="url(#mdt-mask-17)">
<use href="#mdt-source-56" transform="matrix(1, 0, 0, 1, 337, 173)"/>
</g>
<g mask="url(#mdt-mask-18)">
<use href="#mdt-source-59" transform="matrix(1, 0, 0, 1, 332, 163)"/>
</g>
<g mask="url(#mdt-mask-19)">
<use href="#mdt-source-62" transform="matrix(1, 0, 0, 1, 363, 158)"/>
</g>
<g mask="url(#mdt-mask-20)">
<use href="#mdt-source-65" transform="matrix(1, 0, 0, 1, 363, 159)"/>
</g>
<g mask="url(#mdt-mask-21)">
<use href="#mdt-source-68" transform="matrix(1, 0, 0, 1, 370, 174)"/>
</g>
<g mask="url(#mdt-mask-22)">
<use href="#mdt-source-71" transform="matrix(1, 0, 0, 1, 394, 158)"/>
</g>
<g mask="url(#mdt-mask-23)">
<use href="#mdt-source-74" transform="matrix(1, 0, 0, 1, 406, 179)"/>
</g>
<g mask="url(#mdt-mask-24)">
<use href="#mdt-source-77" transform="matrix(1, 0, 0, 1, 395, 165)"/>
</g>
<g mask="url(#mdt-mask-25)">
<use href="#mdt-source-80" transform="matrix(1, 0, 0, 1, 425, 158)"/>
</g>
<g mask="url(#mdt-mask-26)">
<use href="#mdt-source-83" transform="matrix(1, 0, 0, 1, 425, 158)"/>
</g>
<g mask="url(#mdt-mask-27)">
<use href="#mdt-source-86" transform="matrix(1, 0, 0, 1, 426, 165)"/>
</g>
<g mask="url(#mdt-mask-28)">
<use href="#mdt-source-89" transform="matrix(1, 0, 0, 1, 439, 181)"/>
</g>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 219.0625 463.410156 C 219.0625 465.539062 217.335938 467.265625 215.210938 467.265625 L 56.027344 467.265625 C 53.898438 467.265625 52.171875 465.539062 52.171875 463.410156 C 52.171875 461.28125 53.898438 459.558594 56.027344 459.558594 L 215.210938 459.558594 C 217.335938 459.558594 219.0625 461.28125 219.0625 463.410156 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 154.882812 460.453125 L 116.191406 460.453125 L 104.65625 452.265625 L 166.417969 452.265625 Z M 154.882812 460.453125 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 214.164062 368.527344 C 214.164062 371.023438 212.140625 373.050781 209.640625 373.050781 L 61.132812 373.050781 C 58.636719 373.050781 56.609375 371.023438 56.609375 368.527344 C 56.609375 366.03125 58.636719 364.003906 61.132812 364.003906 L 209.640625 364.003906 C 212.140625 364.003906 214.164062 366.03125 214.164062 368.527344 "/>
<path fill-rule="nonzero" fill="rgb(74.118042%, 51.765442%, 6.666565%)" fill-opacity="1" d="M 217.558594 445.886719 L 53.21875 445.886719 L 53.21875 367.929688 L 217.558594 367.929688 Z M 217.558594 445.886719 "/>
<path fill-rule="nonzero" fill="rgb(85.882568%, 61.177063%, 10.980225%)" fill-opacity="1" d="M 211.429688 449.054688 L 59.34375 449.054688 L 59.34375 375.234375 L 211.429688 375.234375 Z M 211.429688 449.054688 "/>
<path fill-rule="nonzero" fill="rgb(100%, 71.765137%, 15.293884%)" fill-opacity="1" d="M 151.132812 448.386719 C 151.132812 450.90625 149.085938 452.949219 146.566406 452.949219 L 124.667969 452.949219 C 122.148438 452.949219 120.101562 450.90625 120.101562 448.386719 L 120.101562 379.464844 C 120.101562 376.945312 122.148438 374.898438 124.667969 374.898438 L 146.566406 374.898438 C 149.085938 374.898438 151.132812 376.945312 151.132812 379.464844 Z M 151.132812 448.386719 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 86.820312 410.070312 L 65.742188 410.070312 L 65.742188 379.902344 L 86.820312 379.902344 Z M 86.820312 410.070312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 116.40625 410.070312 L 95.328125 410.070312 L 95.328125 379.902344 L 116.40625 379.902344 Z M 116.40625 410.070312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 146.15625 410.070312 L 125.078125 410.070312 L 125.078125 379.902344 L 146.15625 379.902344 Z M 146.15625 410.070312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 175.746094 410.070312 L 154.667969 410.070312 L 154.667969 379.902344 L 175.746094 379.902344 Z M 175.746094 410.070312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 205.414062 410.070312 L 184.335938 410.070312 L 184.335938 379.902344 L 205.414062 379.902344 Z M 205.414062 410.070312 "/>
<g mask="url(#mdt-mask-29)">
<use href="#mdt-source-92" transform="matrix(1, 0, 0, 1, 65, 379)"/>
</g>
<g mask="url(#mdt-mask-30)">
<use href="#mdt-source-95" transform="matrix(1, 0, 0, 1, 65, 379)"/>
</g>
<g mask="url(#mdt-mask-31)">
<use href="#mdt-source-98" transform="matrix(1, 0, 0, 1, 66, 389)"/>
</g>
<g mask="url(#mdt-mask-32)">
<use href="#mdt-source-101" transform="matrix(1, 0, 0, 1, 95, 379)"/>
</g>
<g mask="url(#mdt-mask-33)">
<use href="#mdt-source-104" transform="matrix(1, 0, 0, 1, 103, 397)"/>
</g>
<g mask="url(#mdt-mask-34)">
<use href="#mdt-source-107" transform="matrix(1, 0, 0, 1, 95, 379)"/>
</g>
<g mask="url(#mdt-mask-35)">
<use href="#mdt-source-110" transform="matrix(1, 0, 0, 1, 125, 379)"/>
</g>
<g mask="url(#mdt-mask-36)">
<use href="#mdt-source-113" transform="matrix(1, 0, 0, 1, 125, 381)"/>
</g>
<g mask="url(#mdt-mask-37)">
<use href="#mdt-source-116" transform="matrix(1, 0, 0, 1, 135, 399)"/>
</g>
<g mask="url(#mdt-mask-38)">
<use href="#mdt-source-119" transform="matrix(1, 0, 0, 1, 154, 379)"/>
</g>
<g mask="url(#mdt-mask-39)">
<use href="#mdt-source-122" transform="matrix(1, 0, 0, 1, 172, 406)"/>
</g>
<g mask="url(#mdt-mask-40)">
<use href="#mdt-source-125" transform="matrix(1, 0, 0, 1, 155, 390)"/>
</g>
<g mask="url(#mdt-mask-41)">
<use href="#mdt-source-128" transform="matrix(1, 0, 0, 1, 154, 379)"/>
</g>
<g mask="url(#mdt-mask-42)">
<use href="#mdt-source-131" transform="matrix(1, 0, 0, 1, 184, 379)"/>
</g>
<g mask="url(#mdt-mask-43)">
<use href="#mdt-source-134" transform="matrix(1, 0, 0, 1, 193, 397)"/>
</g>
<g mask="url(#mdt-mask-44)">
<use href="#mdt-source-137" transform="matrix(1, 0, 0, 1, 184, 379)"/>
</g>
<path fill-rule="nonzero" fill="rgb(100%, 83.921814%, 52.157593%)" fill-opacity="1" d="M 116.40625 445.886719 L 50.066406 445.886719 L 50.066406 413.925781 L 116.40625 413.925781 Z M 116.40625 445.886719 "/>
<path fill-rule="nonzero" fill="rgb(100%, 71.765137%, 15.293884%)" fill-opacity="1" d="M 116.40625 419.097656 L 50.066406 419.097656 L 50.066406 413.925781 L 116.40625 413.925781 Z M 116.40625 419.097656 "/>
<path fill-rule="nonzero" fill="rgb(100%, 83.921814%, 52.157593%)" fill-opacity="1" d="M 221.476562 445.886719 L 155.136719 445.886719 L 155.136719 413.925781 L 221.476562 413.925781 Z M 221.476562 445.886719 "/>
<path fill-rule="nonzero" fill="rgb(100%, 71.765137%, 15.293884%)" fill-opacity="1" d="M 221.476562 419.097656 L 155.136719 419.097656 L 155.136719 413.925781 L 221.476562 413.925781 Z M 221.476562 419.097656 "/>
<path fill-rule="nonzero" fill="rgb(100%, 71.765137%, 15.293884%)" fill-opacity="1" d="M 222.339844 442.539062 L 48.4375 442.539062 L 48.4375 436.523438 L 222.339844 436.523438 Z M 222.339844 442.539062 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 220.710938 442.539062 L 50.066406 442.539062 L 50.066406 448.554688 L 220.710938 448.554688 Z M 220.710938 442.539062 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 220.710938 448.550781 L 50.066406 448.550781 L 56.65625 456.359375 L 214.121094 456.359375 Z M 220.710938 448.550781 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 74.976562 457.117188 C 74.976562 460.75 72.035156 463.6875 68.40625 463.6875 C 64.777344 463.6875 61.835938 460.75 61.835938 457.117188 C 61.835938 453.488281 64.777344 450.546875 68.40625 450.546875 C 72.035156 450.546875 74.976562 453.488281 74.976562 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 73.046875 457.117188 C 73.046875 459.683594 70.96875 461.757812 68.40625 461.757812 C 65.84375 461.757812 63.769531 459.683594 63.769531 457.117188 C 63.769531 454.558594 65.84375 452.480469 68.40625 452.480469 C 70.96875 452.480469 73.046875 454.558594 73.046875 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 108.667969 457.117188 C 108.667969 460.75 105.726562 463.6875 102.09375 463.6875 C 98.46875 463.6875 95.523438 460.75 95.523438 457.117188 C 95.523438 453.488281 98.46875 450.546875 102.09375 450.546875 C 105.726562 450.546875 108.667969 453.488281 108.667969 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 106.734375 457.117188 C 106.734375 459.683594 104.65625 461.757812 102.09375 461.757812 C 99.53125 461.757812 97.457031 459.683594 97.457031 457.117188 C 97.457031 454.558594 99.53125 452.480469 102.09375 452.480469 C 104.65625 452.480469 106.734375 454.558594 106.734375 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 93.207031 457.117188 C 93.207031 459.683594 91.132812 461.757812 88.570312 461.757812 L 81.933594 461.757812 C 79.371094 461.757812 77.296875 459.683594 77.296875 457.117188 C 77.296875 454.554688 79.371094 452.480469 81.933594 452.480469 L 88.570312 452.480469 C 91.132812 452.480469 93.207031 454.554688 93.207031 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 175.25 457.117188 C 175.25 460.75 172.308594 463.6875 168.679688 463.6875 C 165.050781 463.6875 162.109375 460.75 162.109375 457.117188 C 162.109375 453.488281 165.050781 450.546875 168.679688 450.546875 C 172.308594 450.546875 175.25 453.488281 175.25 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 173.316406 457.117188 C 173.316406 459.683594 171.242188 461.757812 168.679688 461.757812 C 166.117188 461.757812 164.042969 459.683594 164.042969 457.117188 C 164.042969 454.558594 166.117188 452.480469 168.679688 452.480469 C 171.242188 452.480469 173.316406 454.558594 173.316406 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 208.9375 457.117188 C 208.9375 460.75 205.996094 463.6875 202.367188 463.6875 C 198.738281 463.6875 195.796875 460.75 195.796875 457.117188 C 195.796875 453.488281 198.738281 450.546875 202.367188 450.546875 C 205.996094 450.546875 208.9375 453.488281 208.9375 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 207.007812 457.117188 C 207.007812 459.683594 204.929688 461.757812 202.367188 461.757812 C 199.808594 461.757812 197.730469 459.683594 197.730469 457.117188 C 197.730469 454.558594 199.808594 452.480469 202.367188 452.480469 C 204.929688 452.480469 207.007812 454.558594 207.007812 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 193.480469 457.117188 C 193.480469 459.683594 191.402344 461.757812 188.839844 461.757812 L 182.207031 461.757812 C 179.644531 461.757812 177.570312 459.683594 177.570312 457.117188 C 177.570312 454.554688 179.644531 452.480469 182.207031 452.480469 L 188.839844 452.480469 C 191.402344 452.480469 193.480469 454.554688 193.480469 457.117188 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 224.320312 442.539062 C 224.320312 443.320312 223.726562 443.957031 222.992188 443.957031 L 47.785156 443.957031 C 47.050781 443.957031 46.457031 443.320312 46.457031 442.539062 C 46.457031 441.757812 47.050781 441.121094 47.785156 441.121094 L 222.992188 441.121094 C 223.726562 441.121094 224.320312 441.757812 224.320312 442.539062 "/>
<path fill-rule="nonzero" fill="rgb(74.118042%, 51.765442%, 6.666565%)" fill-opacity="1" d="M 157.132812 439.53125 C 157.132812 441.972656 155.152344 443.957031 152.707031 443.957031 L 118.070312 443.957031 C 115.625 443.957031 113.644531 441.972656 113.644531 439.53125 C 113.644531 437.089844 115.625 435.105469 118.070312 435.105469 L 152.707031 435.105469 C 155.152344 435.105469 157.132812 437.089844 157.132812 439.53125 "/>
<path fill-rule="nonzero" fill="rgb(63.137817%, 43.920898%, 5.490112%)" fill-opacity="1" d="M 152.707031 439.53125 L 118.070312 439.53125 C 116.4375 439.53125 115.023438 438.636719 114.257812 437.320312 C 113.878906 437.972656 113.644531 438.722656 113.644531 439.53125 C 113.644531 441.972656 115.625 443.957031 118.070312 443.957031 L 152.707031 443.957031 C 155.148438 443.957031 157.132812 441.972656 157.132812 439.53125 C 157.132812 438.722656 156.898438 437.972656 156.519531 437.320312 C 155.75 438.636719 154.339844 439.53125 152.707031 439.53125 "/>
<path fill-rule="nonzero" fill="rgb(58.824158%, 41.175842%, 5.097961%)" fill-opacity="1" d="M 150.609375 447.050781 C 150.609375 448.761719 149.222656 450.148438 147.515625 450.148438 L 123.261719 450.148438 C 121.550781 450.148438 120.164062 448.761719 120.164062 447.050781 C 120.164062 445.339844 121.550781 443.953125 123.261719 443.953125 L 147.515625 443.953125 C 149.222656 443.953125 150.609375 445.339844 150.609375 447.050781 "/>
<path fill-rule="nonzero" fill="rgb(50.98114%, 35.293579%, 4.31366%)" fill-opacity="1" d="M 147.515625 447.050781 L 123.261719 447.050781 C 122.117188 447.050781 121.128906 446.425781 120.59375 445.503906 C 120.328125 445.960938 120.164062 446.484375 120.164062 447.050781 C 120.164062 448.761719 121.550781 450.148438 123.261719 450.148438 L 147.515625 450.148438 C 149.222656 450.148438 150.609375 448.761719 150.609375 447.050781 C 150.609375 446.484375 150.449219 445.960938 150.183594 445.503906 C 149.644531 446.425781 148.65625 447.050781 147.515625 447.050781 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 429.65625 121.929688 C 429.65625 124.058594 427.925781 125.785156 425.800781 125.785156 L 260.183594 125.785156 C 258.054688 125.785156 256.332031 124.058594 256.332031 121.929688 C 256.332031 119.800781 258.054688 118.078125 260.183594 118.078125 L 425.800781 118.078125 C 427.925781 118.078125 429.65625 119.800781 429.65625 121.929688 "/>
<path fill-rule="nonzero" fill="rgb(11.372375%, 19.999695%, 32.156372%)" fill-opacity="1" d="M 439.382812 109.855469 L 425.570312 109.855469 L 425.570312 103.5625 L 439.382812 103.5625 Z M 439.382812 109.855469 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 441.78125 112.683594 L 436.980469 112.683594 L 436.980469 100.730469 L 441.78125 100.730469 Z M 441.78125 112.683594 "/>
<path fill-rule="nonzero" fill="rgb(18.03894%, 18.03894%, 17.254639%)" fill-opacity="1" d="M 430.699219 108.570312 L 257.902344 108.570312 L 257.902344 26.601562 L 417.949219 26.601562 Z M 430.699219 108.570312 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 432.015625 115.503906 L 255.835938 115.503906 L 255.835938 67.585938 L 426.148438 67.585938 Z M 432.015625 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 427.644531 115.476562 L 259.191406 115.476562 L 259.191406 105.050781 L 425.570312 105.050781 Z M 427.644531 115.476562 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 280.78125 115.503906 C 280.78125 119.320312 277.691406 122.414062 273.875 122.414062 C 270.058594 122.414062 266.964844 119.320312 266.964844 115.503906 C 266.964844 111.6875 270.058594 108.59375 273.875 108.59375 C 277.691406 108.59375 280.78125 111.6875 280.78125 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 278.753906 115.503906 C 278.753906 118.199219 276.566406 120.378906 273.875 120.378906 C 271.179688 120.378906 268.996094 118.199219 268.996094 115.503906 C 268.996094 112.808594 271.179688 110.628906 273.875 110.628906 C 276.566406 110.628906 278.753906 112.808594 278.753906 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 316.207031 115.503906 C 316.207031 119.320312 313.113281 122.414062 309.296875 122.414062 C 305.480469 122.414062 302.386719 119.320312 302.386719 115.503906 C 302.386719 111.6875 305.480469 108.59375 309.296875 108.59375 C 313.113281 108.59375 316.207031 111.6875 316.207031 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 314.171875 115.503906 C 314.171875 118.199219 311.988281 120.378906 309.292969 120.378906 C 306.601562 120.378906 304.417969 118.199219 304.417969 115.503906 C 304.417969 112.808594 306.601562 110.628906 309.292969 110.628906 C 311.988281 110.628906 314.171875 112.808594 314.171875 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 299.949219 115.503906 C 299.949219 118.199219 297.765625 120.378906 295.070312 120.378906 L 288.097656 120.378906 C 285.402344 120.378906 283.21875 118.199219 283.21875 115.503906 C 283.21875 112.808594 285.402344 110.625 288.097656 110.625 L 295.070312 110.625 C 297.765625 110.625 299.949219 112.808594 299.949219 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 386.214844 115.503906 C 386.214844 119.320312 383.121094 122.414062 379.308594 122.414062 C 375.488281 122.414062 372.398438 119.320312 372.398438 115.503906 C 372.398438 111.6875 375.488281 108.59375 379.308594 108.59375 C 383.121094 108.59375 386.214844 111.6875 386.214844 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 384.183594 115.503906 C 384.183594 118.199219 382 120.378906 379.304688 120.378906 C 376.613281 120.378906 374.429688 118.199219 374.429688 115.503906 C 374.429688 112.808594 376.613281 110.628906 379.304688 110.628906 C 382 110.628906 384.183594 112.808594 384.183594 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 421.636719 115.503906 C 421.636719 119.320312 418.542969 122.414062 414.726562 122.414062 C 410.910156 122.414062 407.820312 119.320312 407.820312 115.503906 C 407.820312 111.6875 410.910156 108.59375 414.726562 108.59375 C 418.542969 108.59375 421.636719 111.6875 421.636719 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 419.605469 115.503906 C 419.605469 118.199219 417.421875 120.378906 414.726562 120.378906 C 412.035156 120.378906 409.851562 118.199219 409.851562 115.503906 C 409.851562 112.808594 412.035156 110.628906 414.726562 110.628906 C 417.421875 110.628906 419.605469 112.808594 419.605469 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 405.382812 115.503906 C 405.382812 118.199219 403.199219 120.378906 400.503906 120.378906 L 393.527344 120.378906 C 390.835938 120.378906 388.652344 118.199219 388.652344 115.503906 C 388.652344 112.808594 390.835938 110.625 393.527344 110.625 L 400.503906 110.625 C 403.199219 110.625 405.382812 112.808594 405.382812 115.503906 "/>
<path fill-rule="nonzero" fill="rgb(5.882263%, 5.882263%, 5.882263%)" fill-opacity="1" d="M 425.574219 34.207031 C 425.574219 36.859375 423.421875 39.007812 420.769531 39.007812 L 256.03125 39.007812 C 253.378906 39.007812 251.226562 36.859375 251.226562 34.207031 L 251.226562 31.402344 C 251.226562 28.75 253.378906 26.601562 256.03125 26.601562 L 420.769531 26.601562 C 423.421875 26.601562 425.574219 28.75 425.574219 31.402344 Z M 425.574219 34.207031 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 411.640625 64.113281 L 382.394531 64.113281 L 382.394531 43.042969 L 408.46875 43.042969 Z M 411.640625 64.113281 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 292.234375 64.113281 L 266.160156 64.113281 L 266.160156 43.039062 L 292.234375 43.039062 Z M 292.234375 64.113281 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 420.507812 43.042969 L 414.726562 43.042969 L 417.898438 64.113281 L 423.785156 64.113281 Z M 420.507812 43.042969 "/>
<path fill-rule="nonzero" fill="rgb(26.274109%, 46.273804%, 74.118042%)" fill-opacity="1" d="M 255.835938 84.832031 L 428.261719 84.832031 L 427.414062 77.925781 L 255.835938 77.925781 Z M 255.835938 84.832031 "/>
<path fill-rule="nonzero" fill="rgb(26.274109%, 46.273804%, 74.118042%)" fill-opacity="1" d="M 255.835938 92.671875 L 429.222656 92.671875 L 428.746094 88.789062 L 255.835938 88.789062 Z M 255.835938 92.671875 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 366.484375 105.050781 L 327.574219 105.050781 L 327.574219 39.007812 L 366.484375 39.007812 Z M 366.484375 105.050781 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 347.855469 105.050781 L 346.210938 105.050781 L 346.210938 39.007812 L 347.855469 39.007812 Z M 347.855469 105.050781 "/>
<path fill-rule="nonzero" fill="rgb(18.03894%, 18.03894%, 17.254639%)" fill-opacity="1" d="M 366.484375 39.007812 L 327.574219 39.007812 L 327.574219 26.601562 L 366.484375 26.601562 Z M 366.484375 39.007812 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 318.675781 53.578125 C 318.675781 59.191406 314.128906 63.742188 308.515625 63.742188 C 302.902344 63.742188 298.355469 59.191406 298.355469 53.578125 C 298.355469 47.964844 302.902344 43.414062 308.515625 43.414062 C 314.128906 43.414062 318.675781 47.964844 318.675781 53.578125 "/>
<g mask="url(#mdt-mask-45)">
<use href="#mdt-source-140" transform="matrix(1, 0, 0, 1, 382, 43)"/>
</g>
<g mask="url(#mdt-mask-46)">
<use href="#mdt-source-143" transform="matrix(1, 0, 0, 1, 394, 49)"/>
</g>
<g mask="url(#mdt-mask-47)">
<use href="#mdt-source-146" transform="matrix(1, 0, 0, 1, 266, 43)"/>
</g>
<g mask="url(#mdt-mask-48)">
<use href="#mdt-source-149" transform="matrix(1, 0, 0, 1, 273, 45)"/>
</g>
<g mask="url(#mdt-mask-49)">
<use href="#mdt-source-152" transform="matrix(1, 0, 0, 1, 414, 43)"/>
</g>
<g mask="url(#mdt-mask-50)">
<use href="#mdt-source-155" transform="matrix(1, 0, 0, 1, 300, 45)"/>
</g>
<path fill-rule="nonzero" fill="rgb(26.274109%, 46.273804%, 74.118042%)" fill-opacity="1" d="M 366.484375 119.578125 L 320.347656 119.578125 L 320.347656 100.945312 L 366.484375 100.945312 Z M 366.484375 119.578125 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 366.484375 119.578125 L 320.347656 119.578125 L 320.347656 115.503906 L 366.484375 115.503906 Z M 366.484375 119.578125 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 362.421875 113.410156 L 324.410156 113.410156 L 324.410156 112.511719 L 362.421875 112.511719 Z M 362.421875 113.410156 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 362.421875 110.3125 L 324.410156 110.3125 L 324.410156 109.410156 L 362.421875 109.410156 Z M 362.421875 110.3125 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 362.421875 107.210938 L 324.410156 107.210938 L 324.410156 106.308594 L 362.421875 106.308594 Z M 362.421875 107.210938 "/>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 362.421875 104.109375 L 324.410156 104.109375 L 324.410156 103.210938 L 362.421875 103.210938 Z M 362.421875 104.109375 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 251.328125 240.535156 C 251.328125 242.667969 249.597656 244.390625 247.472656 244.390625 L 46.0625 244.390625 C 43.933594 244.390625 42.207031 242.667969 42.207031 240.535156 C 42.207031 238.40625 43.933594 236.683594 46.0625 236.683594 L 247.472656 236.683594 C 249.597656 236.683594 251.328125 238.40625 251.328125 240.535156 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 262.8125 216.699219 L 249 216.699219 L 249 210.40625 L 262.8125 210.40625 Z M 262.8125 216.699219 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 265.210938 219.53125 L 260.410156 219.53125 L 260.410156 207.578125 L 265.210938 207.578125 Z M 265.210938 219.53125 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 154.511719 159.238281 L 48.207031 159.238281 L 53.863281 150.980469 L 148.859375 150.980469 Z M 154.511719 159.238281 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 104.410156 232.527344 L 46.875 232.527344 L 43.03125 213.839844 L 108.25 213.839844 Z M 104.410156 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 66.484375 232.527344 C 66.484375 237.25 62.65625 241.078125 57.929688 241.078125 C 53.207031 241.078125 49.378906 237.25 49.378906 232.527344 C 49.378906 227.804688 53.207031 223.976562 57.929688 223.976562 C 62.65625 223.976562 66.484375 227.804688 66.484375 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 63.96875 232.527344 C 63.96875 235.859375 61.265625 238.5625 57.929688 238.5625 C 54.597656 238.5625 51.894531 235.859375 51.894531 232.527344 C 51.894531 229.191406 54.597656 226.488281 57.929688 226.488281 C 61.265625 226.488281 63.96875 229.191406 63.96875 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 60.722656 232.527344 C 60.722656 234.070312 59.472656 235.320312 57.929688 235.320312 C 56.386719 235.320312 55.136719 234.070312 55.136719 232.527344 C 55.136719 230.984375 56.386719 229.734375 57.929688 229.734375 C 59.472656 229.734375 60.722656 230.984375 60.722656 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 101.90625 232.527344 C 101.90625 237.25 98.074219 241.078125 93.351562 241.078125 C 88.628906 241.078125 84.800781 237.25 84.800781 232.527344 C 84.800781 227.804688 88.628906 223.976562 93.351562 223.976562 C 98.074219 223.976562 101.90625 227.804688 101.90625 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 99.390625 232.527344 C 99.390625 235.859375 96.6875 238.5625 93.351562 238.5625 C 90.019531 238.5625 87.316406 235.859375 87.316406 232.527344 C 87.316406 229.191406 90.019531 226.488281 93.351562 226.488281 C 96.6875 226.488281 99.390625 229.191406 99.390625 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 96.144531 232.527344 C 96.144531 234.070312 94.894531 235.320312 93.351562 235.320312 C 91.808594 235.320312 90.558594 234.070312 90.558594 232.527344 C 90.558594 230.984375 91.808594 229.734375 93.351562 229.734375 C 94.894531 229.734375 96.144531 230.984375 96.144531 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 242.382812 232.527344 L 184.84375 232.527344 L 181.003906 213.839844 L 246.222656 213.839844 Z M 242.382812 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 204.453125 232.527344 C 204.453125 237.25 200.625 241.078125 195.902344 241.078125 C 191.179688 241.078125 187.351562 237.25 187.351562 232.527344 C 187.351562 227.804688 191.179688 223.976562 195.902344 223.976562 C 200.625 223.976562 204.453125 227.804688 204.453125 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 201.9375 232.527344 C 201.9375 235.859375 199.234375 238.5625 195.902344 238.5625 C 192.570312 238.5625 189.867188 235.859375 189.867188 232.527344 C 189.867188 229.191406 192.570312 226.488281 195.902344 226.488281 C 199.234375 226.488281 201.9375 229.191406 201.9375 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 198.695312 232.527344 C 198.695312 234.070312 197.445312 235.320312 195.902344 235.320312 C 194.359375 235.320312 193.109375 234.070312 193.109375 232.527344 C 193.109375 230.984375 194.359375 229.734375 195.902344 229.734375 C 197.445312 229.734375 198.695312 230.984375 198.695312 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 239.875 232.527344 C 239.875 237.25 236.046875 241.078125 231.324219 241.078125 C 226.601562 241.078125 222.773438 237.25 222.773438 232.527344 C 222.773438 227.804688 226.601562 223.976562 231.324219 223.976562 C 236.046875 223.976562 239.875 227.804688 239.875 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 237.359375 232.527344 C 237.359375 235.859375 234.65625 238.5625 231.324219 238.5625 C 227.988281 238.5625 225.285156 235.859375 225.285156 232.527344 C 225.285156 229.191406 227.988281 226.488281 231.324219 226.488281 C 234.65625 226.488281 237.359375 229.191406 237.359375 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 234.117188 232.527344 C 234.117188 234.070312 232.867188 235.320312 231.324219 235.320312 C 229.78125 235.320312 228.53125 234.070312 228.53125 232.527344 C 228.53125 230.984375 229.78125 229.734375 231.324219 229.734375 C 232.867188 229.734375 234.117188 230.984375 234.117188 232.527344 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 180.3125 223.910156 C 180.3125 226.5625 178.164062 228.710938 175.511719 228.710938 L 113.054688 228.710938 C 110.402344 228.710938 108.25 226.5625 108.25 223.910156 L 108.25 219.589844 C 108.25 216.9375 110.402344 214.789062 113.054688 214.789062 L 175.511719 214.789062 C 178.164062 214.789062 180.3125 216.9375 180.3125 219.589844 Z M 180.3125 223.910156 "/>
<path fill-rule="nonzero" fill="rgb(56.079102%, 7.843018%, 0.784302%)" fill-opacity="1" d="M 252.589844 221.75 L 40.816406 221.75 L 40.816406 156 L 252.589844 156 Z M 252.589844 221.75 "/>
<path fill-rule="nonzero" fill="rgb(74.902344%, 41.175842%, 35.68573%)" fill-opacity="1" d="M 163.417969 193.753906 L 40.816406 193.753906 L 40.816406 183.996094 L 163.417969 183.996094 Z M 163.417969 193.753906 "/>
<path fill-rule="nonzero" fill="rgb(74.902344%, 41.175842%, 35.68573%)" fill-opacity="1" d="M 163.417969 202.433594 L 40.816406 202.433594 L 40.816406 199.992188 L 163.417969 199.992188 Z M 163.417969 202.433594 "/>
<path fill-rule="nonzero" fill="rgb(67.059326%, 23.529053%, 17.254639%)" fill-opacity="1" d="M 226.796875 221.75 L 167.214844 221.75 L 167.214844 144.039062 L 226.796875 144.039062 Z M 226.796875 221.75 "/>
<path fill-rule="nonzero" fill="rgb(18.823242%, 2.745056%, 0.392151%)" fill-opacity="1" d="M 226.796875 221.75 L 167.214844 221.75 L 167.214844 210.40625 L 226.796875 210.40625 Z M 226.796875 221.75 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 252.589844 221.75 L 226.800781 221.75 L 226.800781 210.40625 L 252.589844 210.40625 Z M 252.589844 221.75 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 226.796875 210.253906 L 167.214844 210.253906 L 180.355469 198.605469 L 213.660156 198.605469 Z M 226.796875 210.253906 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 230.59375 139.410156 L 163.421875 139.410156 L 163.421875 144.039062 L 230.59375 144.039062 Z M 230.59375 139.410156 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 260.796875 201.214844 L 252.589844 213.554688 L 252.589844 188.875 L 260.796875 188.875 Z M 260.796875 201.214844 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 185.671875 174.945312 C 185.671875 177.59375 183.519531 179.746094 180.871094 179.746094 L 177.554688 179.746094 C 174.902344 179.746094 172.753906 177.59375 172.753906 174.945312 L 172.753906 157.042969 C 172.753906 154.390625 174.902344 152.242188 177.554688 152.242188 L 180.871094 152.242188 C 183.519531 152.242188 185.671875 154.390625 185.671875 157.042969 Z M 185.671875 174.945312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 203.464844 174.945312 C 203.464844 177.59375 201.3125 179.746094 198.664062 179.746094 L 195.347656 179.746094 C 192.699219 179.746094 190.546875 177.59375 190.546875 174.945312 L 190.546875 157.042969 C 190.546875 154.390625 192.699219 152.242188 195.347656 152.242188 L 198.664062 152.242188 C 201.3125 152.242188 203.464844 154.390625 203.464844 157.042969 Z M 203.464844 174.945312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 221.257812 174.945312 C 221.257812 177.59375 219.109375 179.746094 216.457031 179.746094 L 213.144531 179.746094 C 210.492188 179.746094 208.34375 177.59375 208.34375 174.945312 L 208.34375 157.042969 C 208.34375 154.390625 210.492188 152.242188 213.144531 152.242188 L 216.457031 152.242188 C 219.109375 152.242188 221.257812 154.390625 221.257812 157.042969 Z M 221.257812 174.945312 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 244.667969 179.277344 C 244.667969 181.277344 243.050781 182.894531 241.054688 182.894531 L 238.558594 182.894531 C 236.5625 182.894531 234.945312 181.277344 234.945312 179.277344 L 234.945312 165.800781 C 234.945312 163.804688 236.5625 162.1875 238.558594 162.1875 L 241.054688 162.1875 C 243.050781 162.1875 244.667969 163.804688 244.667969 165.800781 Z M 244.667969 179.277344 "/>
<g mask="url(#mdt-mask-51)">
<use href="#mdt-source-158" transform="matrix(1, 0, 0, 1, 172, 152)"/>
</g>
<g mask="url(#mdt-mask-52)">
<use href="#mdt-source-161" transform="matrix(1, 0, 0, 1, 172, 158)"/>
</g>
<g mask="url(#mdt-mask-53)">
<use href="#mdt-source-164" transform="matrix(1, 0, 0, 1, 176, 170)"/>
</g>
<g mask="url(#mdt-mask-54)">
<use href="#mdt-source-167" transform="matrix(1, 0, 0, 1, 190, 152)"/>
</g>
<g mask="url(#mdt-mask-55)">
<use href="#mdt-source-170" transform="matrix(1, 0, 0, 1, 190, 153)"/>
</g>
<g mask="url(#mdt-mask-56)">
<use href="#mdt-source-173" transform="matrix(1, 0, 0, 1, 190, 162)"/>
</g>
<g mask="url(#mdt-mask-57)">
<use href="#mdt-source-176" transform="matrix(1, 0, 0, 1, 208, 152)"/>
</g>
<g mask="url(#mdt-mask-58)">
<use href="#mdt-source-179" transform="matrix(1, 0, 0, 1, 208, 158)"/>
</g>
<g mask="url(#mdt-mask-59)">
<use href="#mdt-source-182" transform="matrix(1, 0, 0, 1, 214, 172)"/>
</g>
<g mask="url(#mdt-mask-60)">
<use href="#mdt-source-185" transform="matrix(1, 0, 0, 1, 234, 163)"/>
</g>
<g mask="url(#mdt-mask-61)">
<use href="#mdt-source-188" transform="matrix(1, 0, 0, 1, 235, 173)"/>
</g>
<path fill-rule="nonzero" fill="rgb(67.059326%, 23.529053%, 17.254639%)" fill-opacity="1" d="M 40.816406 165.992188 L 167.214844 165.992188 L 167.214844 155.070312 L 40.816406 155.070312 Z M 40.816406 165.992188 "/>
<path fill-rule="nonzero" fill="rgb(56.079102%, 7.843018%, 0.784302%)" fill-opacity="1" d="M 163.417969 165.992188 L 167.214844 165.992188 L 167.214844 155.070312 L 163.417969 155.070312 Z M 163.417969 165.992188 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 79.796875 214.789062 L 55.136719 214.789062 L 55.136719 172.539062 L 79.796875 172.539062 Z M 79.796875 214.789062 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 109.578125 214.789062 L 84.914062 214.789062 L 84.914062 172.539062 L 109.578125 172.539062 Z M 109.578125 214.789062 "/>
<path fill-rule="nonzero" fill="rgb(36.862183%, 5.097961%, 0.392151%)" fill-opacity="1" d="M 167.214844 210.40625 L 40.816406 210.40625 L 40.816406 221.75 L 167.214844 221.75 Z M 167.214844 210.40625 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 260.796875 181.238281 L 252.589844 181.238281 L 252.589844 179.746094 L 260.796875 179.746094 Z M 260.796875 181.238281 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 259.304688 181.054688 L 260.796875 181.054688 L 260.796875 188.875 L 259.304688 188.875 Z M 259.304688 181.054688 "/>
<path fill-rule="nonzero" fill="rgb(87.451172%, 89.411926%, 92.156982%)" fill-opacity="1" d="M 482.984375 340.1875 C 482.984375 342.316406 481.257812 344.042969 479.128906 344.042969 L 234.953125 344.042969 C 232.824219 344.042969 231.097656 342.316406 231.097656 340.1875 C 231.097656 338.058594 232.824219 336.332031 234.953125 336.332031 L 479.128906 336.332031 C 481.257812 336.332031 482.984375 338.058594 482.984375 340.1875 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 235.289062 324.898438 C 235.289062 327.015625 233.589844 328.730469 231.492188 328.730469 C 229.398438 328.730469 227.699219 327.015625 227.699219 324.898438 L 227.699219 274.945312 C 227.699219 272.828125 229.398438 271.113281 231.492188 271.113281 C 233.589844 271.113281 235.289062 272.828125 235.289062 274.945312 Z M 235.289062 324.898438 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 382.269531 332.230469 L 231.492188 332.230469 L 231.492188 267.609375 L 382.269531 267.609375 Z M 382.269531 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(38.038635%, 39.215088%, 41.175842%)" fill-opacity="1" d="M 378.195312 291.753906 C 378.195312 294.40625 376.046875 296.554688 373.394531 296.554688 L 239.945312 296.554688 C 237.292969 296.554688 235.144531 294.40625 235.144531 291.753906 L 235.144531 279.023438 C 235.144531 276.371094 237.292969 274.222656 239.945312 274.222656 L 373.394531 274.222656 C 376.046875 274.222656 378.195312 276.371094 378.195312 279.023438 Z M 378.195312 291.753906 "/>
<path fill-rule="nonzero" fill="rgb(80.784607%, 83.529663%, 87.059021%)" fill-opacity="1" d="M 382.269531 267.609375 C 382.269531 267.609375 444.007812 267.609375 475.320312 311.699219 C 489.4375 331.570312 473.78125 332.175781 468.414062 332.230469 C 446.875 332.464844 382.269531 332.230469 382.269531 332.230469 Z M 382.269531 267.609375 "/>
<path fill-rule="nonzero" fill="rgb(61.177063%, 63.137817%, 65.882874%)" fill-opacity="1" d="M 231.492188 332.230469 L 382.269531 332.230469 C 382.269531 332.230469 446.875 332.460938 468.410156 332.230469 C 473.414062 332.175781 487.355469 331.640625 477.777344 315.460938 L 231.492188 315.460938 Z M 231.492188 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(38.038635%, 39.215088%, 41.175842%)" fill-opacity="1" d="M 231.492188 332.230469 L 382.269531 332.230469 C 382.269531 332.230469 446.875 332.460938 468.410156 332.230469 C 472.335938 332.1875 481.753906 331.847656 481.015625 323.898438 L 231.492188 323.898438 Z M 231.492188 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 266.640625 318.851562 C 251.570312 318.851562 239.351562 324.84375 239.351562 332.234375 L 293.929688 332.234375 C 293.929688 324.84375 281.710938 318.851562 266.640625 318.851562 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 263.125 332.230469 C 263.125 336.957031 259.296875 340.785156 254.574219 340.785156 C 249.851562 340.785156 246.023438 336.957031 246.023438 332.230469 C 246.023438 327.507812 249.851562 323.679688 254.574219 323.679688 C 259.296875 323.679688 263.125 327.507812 263.125 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 260.609375 332.230469 C 260.609375 335.5625 257.90625 338.265625 254.574219 338.265625 C 251.242188 338.265625 248.539062 335.5625 248.539062 332.230469 C 248.539062 328.894531 251.242188 326.195312 254.574219 326.195312 C 257.90625 326.195312 260.609375 328.894531 260.609375 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 257.367188 332.230469 C 257.367188 333.773438 256.117188 335.027344 254.574219 335.027344 C 253.03125 335.027344 251.78125 333.773438 251.78125 332.230469 C 251.78125 330.6875 253.03125 329.4375 254.574219 329.4375 C 256.117188 329.4375 257.367188 330.6875 257.367188 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 286.136719 332.230469 C 286.136719 336.957031 282.304688 340.785156 277.582031 340.785156 C 272.859375 340.785156 269.03125 336.957031 269.03125 332.230469 C 269.03125 327.507812 272.859375 323.679688 277.582031 323.679688 C 282.304688 323.679688 286.136719 327.507812 286.136719 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 283.617188 332.230469 C 283.617188 335.5625 280.917969 338.265625 277.582031 338.265625 C 274.25 338.265625 271.546875 335.5625 271.546875 332.230469 C 271.546875 328.894531 274.25 326.195312 277.582031 326.195312 C 280.917969 326.195312 283.617188 328.894531 283.617188 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 280.375 332.230469 C 280.375 333.773438 279.125 335.027344 277.582031 335.027344 C 276.039062 335.027344 274.789062 333.773438 274.789062 332.230469 C 274.789062 330.6875 276.039062 329.4375 277.582031 329.4375 C 279.125 329.4375 280.375 330.6875 280.375 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 382.269531 318.851562 C 367.199219 318.851562 354.980469 324.84375 354.980469 332.234375 L 409.558594 332.234375 C 409.558594 324.84375 397.339844 318.851562 382.269531 318.851562 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 378.753906 332.230469 C 378.753906 336.957031 374.925781 340.785156 370.199219 340.785156 C 365.480469 340.785156 361.648438 336.957031 361.648438 332.230469 C 361.648438 327.507812 365.480469 323.679688 370.199219 323.679688 C 374.925781 323.679688 378.753906 327.507812 378.753906 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 376.238281 332.230469 C 376.238281 335.5625 373.535156 338.265625 370.199219 338.265625 C 366.867188 338.265625 364.164062 335.5625 364.164062 332.230469 C 364.164062 328.894531 366.867188 326.195312 370.199219 326.195312 C 373.535156 326.195312 376.238281 328.894531 376.238281 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 372.996094 332.230469 C 372.996094 333.773438 371.742188 335.027344 370.199219 335.027344 C 368.65625 335.027344 367.40625 333.773438 367.40625 332.230469 C 367.40625 330.6875 368.65625 329.4375 370.199219 329.4375 C 371.742188 329.4375 372.996094 330.6875 372.996094 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 401.761719 332.230469 C 401.761719 336.957031 397.933594 340.785156 393.210938 340.785156 C 388.488281 340.785156 384.660156 336.957031 384.660156 332.230469 C 384.660156 327.507812 388.488281 323.679688 393.210938 323.679688 C 397.933594 323.679688 401.761719 327.507812 401.761719 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(14.901733%, 14.901733%, 14.901733%)" fill-opacity="1" d="M 399.246094 332.230469 C 399.246094 335.5625 396.542969 338.265625 393.210938 338.265625 C 389.878906 338.265625 387.175781 335.5625 387.175781 332.230469 C 387.175781 328.894531 389.878906 326.195312 393.210938 326.195312 C 396.542969 326.195312 399.246094 328.894531 399.246094 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(30.587769%, 30.587769%, 30.587769%)" fill-opacity="1" d="M 396.003906 332.230469 C 396.003906 333.773438 394.753906 335.027344 393.210938 335.027344 C 391.667969 335.027344 390.417969 333.773438 390.417969 332.230469 C 390.417969 330.6875 391.667969 329.4375 393.210938 329.4375 C 394.753906 329.4375 396.003906 330.6875 396.003906 332.230469 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 464.742188 299.40625 C 442.316406 277.695312 412.0625 270.804688 395.128906 268.625 C 400.925781 274.253906 408.738281 280.132812 417.898438 285.472656 C 436.792969 296.484375 455.566406 301.804688 464.742188 299.40625 "/>
<g mask="url(#mdt-mask-62)">
<use href="#mdt-source-191" transform="matrix(1, 0, 0, 1, 395, 268)"/>
</g>
<g mask="url(#mdt-mask-63)">
<use href="#mdt-source-194" transform="matrix(1, 0, 0, 1, 409, 273)"/>
</g>
<g mask="url(#mdt-mask-64)">
<use href="#mdt-source-197" transform="matrix(1, 0, 0, 1, 421, 277)"/>
</g>
<g mask="url(#mdt-mask-65)">
<use href="#mdt-source-200" transform="matrix(1, 0, 0, 1, 442, 288)"/>
</g>
<g mask="url(#mdt-mask-66)">
<use href="#mdt-source-203" transform="matrix(1, 0, 0, 1, 452, 293)"/>
</g>
<g mask="url(#mdt-mask-67)">
<use href="#mdt-source-206" transform="matrix(1, 0, 0, 1, 428, 281)"/>
</g>
<path fill-rule="nonzero" fill="rgb(16.862488%, 29.803467%, 47.450256%)" fill-opacity="1" d="M 475.320312 311.699219 C 473.476562 309.101562 471.527344 306.667969 469.496094 304.371094 C 466.53125 310.496094 464.867188 317.3125 464.867188 324.511719 C 464.867188 327.148438 465.101562 329.734375 465.53125 332.257812 C 466.554688 332.25 467.523438 332.242188 468.414062 332.230469 C 473.78125 332.175781 489.4375 331.570312 475.320312 311.699219 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 371.390625 293.058594 L 359.894531 293.058594 L 359.894531 277.679688 L 371.390625 277.679688 Z M 371.390625 293.058594 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 353.121094 293.058594 L 318.195312 293.058594 L 318.195312 277.679688 L 353.121094 277.679688 Z M 353.121094 293.058594 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 314.433594 293.058594 L 279.507812 293.058594 L 279.507812 277.679688 L 314.433594 277.679688 Z M 314.433594 293.058594 "/>
<path fill-rule="nonzero" fill="rgb(24.705505%, 43.528748%, 70.196533%)" fill-opacity="1" d="M 275.742188 293.058594 L 240.816406 293.058594 L 240.816406 277.679688 L 275.742188 277.679688 Z M 275.742188 293.058594 "/>
<g mask="url(#mdt-mask-68)">
<use href="#mdt-source-209" transform="matrix(1, 0, 0, 1, 359, 277)"/>
</g>
<g mask="url(#mdt-mask-69)">
<use href="#mdt-source-212" transform="matrix(1, 0, 0, 1, 365, 287)"/>
</g>
<g mask="url(#mdt-mask-70)">
<use href="#mdt-source-215" transform="matrix(1, 0, 0, 1, 318, 277)"/>
</g>
<g mask="url(#mdt-mask-71)">
<use href="#mdt-source-218" transform="matrix(1, 0, 0, 1, 328, 277)"/>
</g>
<g mask="url(#mdt-mask-72)">
<use href="#mdt-source-221" transform="matrix(1, 0, 0, 1, 347, 287)"/>
</g>
<g mask="url(#mdt-mask-73)">
<use href="#mdt-source-224" transform="matrix(1, 0, 0, 1, 279, 277)"/>
</g>
<g mask="url(#mdt-mask-74)">
<use href="#mdt-source-227" transform="matrix(1, 0, 0, 1, 288, 277)"/>
</g>
<g mask="url(#mdt-mask-75)">
<use href="#mdt-source-230" transform="matrix(1, 0, 0, 1, 305, 284)"/>
</g>
<g mask="url(#mdt-mask-76)">
<use href="#mdt-source-233" transform="matrix(1, 0, 0, 1, 240, 277)"/>
</g>
<g mask="url(#mdt-mask-77)">
<use href="#mdt-source-236" transform="matrix(1, 0, 0, 1, 244, 277)"/>
</g>
<g mask="url(#mdt-mask-78)">
<use href="#mdt-source-239" transform="matrix(1, 0, 0, 1, 255, 277)"/>
</g>
</g><clipPath id="md-crop0"><rect x="69" y="226" width="176" height="85"/></clipPath><clipPath id="md-crop1"><rect x="241" y="224" width="159" height="87"/></clipPath></defs>
<rect x="36" y="20" width="168" height="40" rx="10" class="chip"/><text text-anchor="middle" x="120" y="45" class="small mid">1 · упрощение</text>
<rect x="216" y="20" width="168" height="40" rx="10" class="chip"/><text text-anchor="middle" x="300" y="45" class="small mid">2 · цель</text>
<rect x="396" y="20" width="168" height="40" rx="10" class="chip"/><text text-anchor="middle" x="480" y="45" class="small mid">3 · эксперимент</text>
<rect x="576" y="20" width="168" height="40" rx="10" class="chip"/><text text-anchor="middle" x="660" y="45" class="small mid">4 · исходы</text>
<rect x="756" y="20" width="168" height="40" rx="10" class="chip"/><text text-anchor="middle" x="840" y="45" class="small mid">5 · язык</text>
<g data-key="r1" data-only="1"><rect x="36" y="20" width="168" height="40" rx="10" class="chip-on"/><text text-anchor="middle" x="120" y="45" class="cap mid yellow" font-weight="700">1 · упрощение</text></g>
<g data-key="r2" data-only="1"><rect x="216" y="20" width="168" height="40" rx="10" class="chip-on"/><text text-anchor="middle" x="300" y="45" class="cap mid yellow" font-weight="700">2 · цель</text></g>
<g data-key="r3" data-only="1"><rect x="396" y="20" width="168" height="40" rx="10" class="chip-on"/><text text-anchor="middle" x="480" y="45" class="cap mid yellow" font-weight="700">3 · эксперимент</text></g>
<g data-key="r4" data-only="1"><rect x="576" y="20" width="168" height="40" rx="10" class="chip-on"/><text text-anchor="middle" x="660" y="45" class="cap mid yellow" font-weight="700">4 · исходы</text></g>
<g data-key="r5" data-only="1"><rect x="756" y="20" width="168" height="40" rx="10" class="chip-on"/><text text-anchor="middle" x="840" y="45" class="cap mid yellow" font-weight="700">5 · язык</text></g>
<g data-key="p1" data-only="1"><text x="60" y="122" class="small">Реальный объект</text><rect x="60" y="136" width="350" height="235" rx="14" class="box-gray"/><g clip-path="url(#md-crop0)"><use href="#mdt-all" transform="translate(69 226) scale(0.7586) translate(-37 -136)"/></g><g clip-path="url(#md-crop1)"><use href="#mdt-all" transform="translate(241 224) scale(0.7608) translate(-270 -138)"/></g><text text-anchor="middle" x="235" y="352" class="small mid">настоящий поезд: сотни деталей</text><path d="M420 252 L520 252" class="arrow"/><text text-anchor="middle" x="470" y="230" class="small mid yellow">упрощаем</text><text x="540" y="122" class="small">Модель</text><rect x="540" y="136" width="350" height="235" rx="14" class="box-blue"/><rect x="575" y="302" width="285" height="7" rx="3.5" fill="#E1E5EB"/><rect x="565" y="268" width="155" height="14" rx="4" fill="#3576C0"/><rect x="565" y="232" width="98" height="36" rx="16" fill="#DCE8F6" stroke="#3576C0" stroke-width="2"/><rect x="585" y="206" width="20" height="26" fill="#3576C0"/><rect x="580" y="199" width="30" height="9" rx="3" fill="#3576C0"/><rect x="655" y="200" width="65" height="68" rx="6" fill="#DCE8F6" stroke="#3576C0" stroke-width="2"/><rect x="648" y="192" width="79" height="12" rx="4" fill="#3576C0"/><rect x="670" y="214" width="35" height="24" rx="4" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><line x1="720" y1="275" x2="732" y2="275" stroke="#3576C0" stroke-width="4" stroke-linecap="round"/><rect x="730" y="268" width="140" height="14" rx="4" fill="#3576C0"/><rect x="735" y="216" width="130" height="52" rx="8" fill="#DCE8F6" stroke="#3576C0" stroke-width="2"/><rect x="730" y="206" width="140" height="12" rx="4" fill="#3576C0"/><rect x="748" y="228" width="30" height="24" rx="4" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><rect x="785" y="228" width="30" height="24" rx="4" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><rect x="822" y="228" width="30" height="24" rx="4" fill="#FFFFFF" stroke="#3576C0" stroke-width="2"/><circle cx="590" cy="285" r="15" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><circle cx="590" cy="285" r="4.5" fill="#3576C0"/><circle cx="635" cy="285" r="15" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><circle cx="635" cy="285" r="4.5" fill="#3576C0"/><circle cx="695" cy="285" r="15" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><circle cx="695" cy="285" r="4.5" fill="#3576C0"/><circle cx="760" cy="285" r="15" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><circle cx="760" cy="285" r="4.5" fill="#3576C0"/><circle cx="840" cy="285" r="15" fill="#FFFFFF" stroke="#3576C0" stroke-width="3"/><circle cx="840" cy="285" r="4.5" fill="#3576C0"/><text text-anchor="middle" x="715" y="352" class="small mid">деревянная игрушка: только главное</text><rect x="60" y="414" width="400" height="110" rx="12" class="box-green"/><text x="82" y="449" class="h green">Сохранилось</text><text x="82" y="480" class="cap">форма, вагоны, колёса, узнаваемость</text><rect x="500" y="414" width="390" height="110" rx="12" class="box-red"/><text x="522" y="449" class="h red">Потерялось</text><text x="522" y="480" class="cap">двигатель, пассажиры, масса, физика</text></g>
<g data-key="p2" data-only="1"><rect x="55" y="135" width="260" height="300" rx="14" class="box-blue"/><text x="80" y="178" class="h blue">Игрушка</text><text x="80" y="213" class="cap">✓ узнаваемая форма</text><text x="80" y="246" class="cap">✓ можно катить рукой</text><text x="80" y="279" class="cap">× не считает движение</text><rect x="80" y="340" width="210" height="62" rx="10" class="box-gray"/><text text-anchor="middle" x="185" y="366" class="small mid">Вопрос</text><text text-anchor="middle" x="185" y="389" class="cap mid">«Как выглядит поезд?»</text><rect x="350" y="135" width="260" height="300" rx="14" class="box-yellow"/><text x="375" y="178" class="h yellow">Макет на рельсах</text><text x="375" y="213" class="cap">✓ движется сам</text><text x="375" y="246" class="cap">✓ держится колеи</text><text x="375" y="279" class="cap">× физика приблизительна</text><rect x="375" y="340" width="210" height="62" rx="10" class="box-gray"/><text text-anchor="middle" x="480" y="366" class="small mid">Вопрос</text><text text-anchor="middle" x="480" y="389" class="cap mid">«Как он едет?»</text><rect x="645" y="135" width="260" height="300" rx="14" class="box-green"/><text x="670" y="178" class="h green">Симулятор</text><text x="670" y="213" class="cap">✓ учитывает массу</text><text x="670" y="246" class="cap">✓ трение и инерцию</text><text x="670" y="279" class="cap">✓ сравнивает сценарии</text><rect x="670" y="340" width="210" height="62" rx="10" class="box-gray"/><text text-anchor="middle" x="775" y="366" class="small mid">Вопрос</text><text text-anchor="middle" x="775" y="389" class="cap mid">«Где он остановится?»</text><rect x="55" y="476" width="850" height="64" rx="11" class="box-green"/><text text-anchor="middle" x="480" y="515" class="cap mid">Сначала выбираем вопрос — потом решаем, какие свойства должна сохранить модель.</text></g>
<g data-key="p3" data-only="1"><text x="60" y="118" class="small">Реальный опыт</text><rect x="60" y="132" width="390" height="300" rx="14" class="box-gray"/><line x1="95" y1="382" x2="415" y2="382" class="rail"/><rect x="215" y="350" width="85" height="30" rx="4" class="shape-gray"/><rect x="224" y="318" width="67" height="30" rx="4" class="shape-gray"/><rect x="212" y="286" width="79" height="30" rx="4" class="shape-gray"/><rect x="232" y="254" width="53" height="30" rx="4" class="shape-gray"/><path d="M125 365 L200 365" class="arrow"/><text text-anchor="middle" x="250" y="188" class="h mid">1 попытка</text><text text-anchor="middle" x="250" y="216" class="small mid">потом всё собирать заново</text><text x="510" y="118" class="small">Опыт в модели</text><rect x="510" y="132" width="390" height="300" rx="14" class="box-blue"/><rect x="532" y="154" width="346" height="250" rx="10" class="screen"/><line x1="555" y1="375" x2="855" y2="375" class="rail"/><rect x="675" y="345" width="85" height="28" rx="4" class="shape-blue"/><rect x="684" y="315" width="67" height="28" rx="4" class="shape-blue"/><rect x="672" y="285" width="79" height="28" rx="4" class="shape-blue"/><rect x="692" y="255" width="53" height="28" rx="4" class="shape-blue"/><path d="M580 358 L658 358" class="arrow"/><text text-anchor="middle" x="705" y="188" class="h mid blue">1000 попыток</text><text text-anchor="middle" x="705" y="216" class="small mid">с разной силой толчка</text><rect x="60" y="466" width="840" height="72" rx="12" class="box-green"/><text text-anchor="middle" x="480" y="509" class="cap mid">Один и тот же вопрос можно проверить много раз, меняя начальные условия.</text></g>
<g data-key="p4" data-only="1"><rect x="55" y="145" width="300" height="250" rx="14" class="box-blue"/><text x="80" y="185" class="h blue">Известные условия</text><text x="80" y="225" class="cap">башня из четырёх кубиков</text><text x="80" y="258" class="cap">толкаем нижний вправо</text><text x="80" y="291" class="cap">сила средняя</text><path d="M365 270 L430 270" class="arrow"/><rect x="440" y="215" width="125" height="105" rx="14" class="box-yellow"/><text text-anchor="middle" x="502" y="260" class="h mid yellow">Модель</text><text text-anchor="middle" x="502" y="290" class="small mid">сравнивает</text><path d="M575 270 L635 270" class="arrow"/><rect x="645" y="125" width="260" height="310" rx="14" class="box-green"/><text x="670" y="167" class="h green">Возможные исходы</text><text x="670" y="214" class="cap">вправо</text><rect x="750" y="198" width="120" height="18" rx="7" class="bar-bg"/><rect x="750" y="198" width="94" height="18" rx="7" class="bar-green"/><text x="878" y="213" class="small">0,78</text><text x="670" y="276" class="cap">устоит</text><rect x="750" y="260" width="120" height="18" rx="7" class="bar-bg"/><rect x="750" y="260" width="26" height="18" rx="7" class="bar-blue"/><text x="878" y="275" class="small">0,22</text><rect x="55" y="475" width="850" height="65" rx="11" class="box-blue"/><text text-anchor="middle" x="480" y="515" class="cap mid">Выход модели — распределение правдоподобия между возможными продолжениями ситуации.</text></g>
<g data-key="p5" data-only="1"><rect x="45" y="155" width="325" height="230" rx="14" class="box-blue"/><text x="70" y="198" class="h blue">Текст слева</text><text x="70" y="250" class="text">Я добавил молоко в</text><text x="70" y="291" class="small">что может идти дальше?</text><path d="M380 270 L435 270" class="arrow"/><rect x="445" y="220" width="120" height="100" rx="14" class="box-yellow"/><text text-anchor="middle" x="505" y="261" class="h mid yellow">Модель</text><text text-anchor="middle" x="505" y="291" class="small mid">языка</text><path d="M575 270 L630 270" class="arrow"/><rect x="640" y="125" width="270" height="310" rx="14" class="box-green"/><text x="665" y="165" class="h green">Продолжения</text><text x="665" y="211" class="cap">кофе</text><rect x="742" y="195" width="120" height="18" rx="7" class="bar-bg"/><rect x="742" y="195" width="110" height="18" rx="7" class="bar-green"/><text x="870" y="210" class="small">0,46</text><text x="665" y="267" class="cap">чашку</text><rect x="742" y="251" width="120" height="18" rx="7" class="bar-bg"/><rect x="742" y="251" width="53" height="18" rx="7" class="bar-blue"/><text x="870" y="266" class="small">0,22</text><text x="665" y="323" class="cap">кашу</text><rect x="742" y="307" width="120" height="18" rx="7" class="bar-bg"/><rect x="742" y="307" width="29" height="18" rx="7" class="bar-blue"/><text x="870" y="322" class="small">0,12</text><text x="665" y="379" class="cap">слона</text><rect x="742" y="363" width="120" height="18" rx="7" class="bar-bg"/><rect x="742" y="363" width="2" height="18" rx="7" class="bar-red"/><text x="870" y="378" class="small">≈0</text><rect x="45" y="475" width="865" height="65" rx="11" class="box-green"/><text text-anchor="middle" x="477" y="515" class="cap mid">Теперь можно забыть про поезд: дальше вся статья исследует именно эту связь.</text></g>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="r1 p1" data-focus="p1">
<div class="step-kicker">Шаг 1 · идея модели</div>
<h4>Игрушечный поезд — уже модель настоящего поезда</h4>
<p>Игрушка не перевозит грузы и не повторяет настоящую физику. Но мы узнаём в ней поезд: сохранились форма, вагоны и колёса. Модель всегда что-то сохраняет, а что-то намеренно отбрасывает.</p>
<div class="math-display" data-tex="\text{сложный объект} \longrightarrow \text{полезное упрощение}"></div>
</div>
<div class="step-panel" data-on="r2 p2" data-focus="p2">
<div class="step-kicker">Шаг 2 · цель</div>
<h4>Больше деталей не всегда означает лучше</h4>
<p>Чтобы показать ребёнку форму поезда, достаточно игрушки. Чтобы рассчитать тормозной путь, нужен физический симулятор. Качество модели оценивают относительно задачи, а не по количеству деталей само по себе.</p>
<div class="math-display" data-tex="\text{хорошая модель} = \text{подходящая модель для задачи}"></div>
</div>
<div class="step-panel" data-on="r3 p3" data-focus="p3">
<div class="step-kicker">Шаг 3 · эксперимент</div>
<h4>Модель позволяет безопасно и дёшево сравнивать возможные будущие</h4>
<p>В реальности один эксперимент даёт один исход и требует заново подготовить условия. В модели можно менять параметры и повторять опыт тысячи раз. Так модель становится инструментом для предсказаний.</p>
<div class="math-display" data-tex="\text{условия сейчас} \longrightarrow \text{возможный результат}"></div>
</div>
<div class="step-panel" data-on="r4 p4" data-focus="p4">
<div class="step-kicker">Шаг 4 · вероятности</div>
<h4>Полезнее получить карту вариантов, чем один уверенный ответ</h4>
<p>Башня может упасть вправо или устоять. Модель распределяет между этими исходами вероятность: 0,78 и 0,22. Самый высокий столбец показывает наиболее ожидаемый вариант, но второй не исчезает — и вместе они дают единицу.</p>
<div class="math-display" data-tex="p_\theta(\text{исход} \mid \text{известные условия})"></div>
</div>
<div class="step-panel" data-on="r5 p5" data-focus="p5">
<div class="step-kicker">Шаг 5 · переход к языку</div>
<h4>Языковая модель — та же идея, применённая к тексту</h4>
<p>Контекстом служит уже написанная часть фразы. Возможными исходами — все токены словаря. Модель должна дать естественным продолжениям большую вероятность, а странным — маленькую.</p>
<div class="math-display" data-tex="p_\theta(y_t \mid y_{&lt;t})"></div>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> модель хранит не сам мир, а закономерности,
полезные для ответа на выбранный вопрос, и часто отвечает не одним исходом, а
распределением вероятностей между возможными исходами.
</div>
<h3>Как построить модель языка?</h3>
<p>
Применим ту же логику к языку. Язык — объект куда сложнее поезда: в нём есть
грамматика, смысл, стиль, факты о мире. Что из этого должна сохранить модель,
зависит от вопроса, на который мы хотим отвечать. Выберем вопрос предельно узкий:
<strong>по тексту слева — какое слово может идти следующим?</strong> Ответом, как и
для башни из кубиков, будет не одно слово, а вероятности всех вариантов:
</p>
<div class="math-display" data-tex="p_\theta(y_t \mid y_{<t}), \qquad y_{<t} = \text{уже написанный текст}"></div>
<p>
Кажется, что такого умения мало для чего-то полезного. Следующие части показывают
обратное: из машины, которая умеет только продолжать текст, собирается
собеседник, а чтобы продолжать хорошо, ей приходится выучить очень многое.
Начнём с того, как такой машиной пользоваться, — с оторванного сценария.
</p>
<hr>
<h2 id="part-2">Часть 2. Оторванный сценарий</h2>
<p>
Представьте, что вам в руки попал обрывок сценария. В нём человек задаёт
вопрос ИИ-ассистенту, но ответ ассистента оторван — на листе осталось только
начало реплики. Восстановить его неоткуда: продолжения физически нет.
</p>
<p>
А теперь допустим, что у вас есть машина, которая умеет ровно одну вещь: взять
любой текст и разумно предсказать, какое слово идёт следующим. Тогда обрывок
восстанавливается механически. Вы подаёте машине то, что есть, получаете одно
слово, приписываете его в конец, подаёте всё заново — и так до тех пор, пока
реплика не соберётся целиком.
</p>
<p>
Ровно это происходит, когда вы пишете в окно чата: <strong>текст дописывается по одному слову, и каждое слово
— отдельный запуск одной и той же функции</strong>.
</p>
<p>Посмотрим на цикл пошагово.</p>
<div class="stage" id="stageSc" tabindex="0">
<div class="stage-figure">
<svg id="sc" viewBox="0 0 960 470" role="img" aria-label="Обрывок сценария подаётся в модель, та предсказывает следующее слово, слово приписывается к ответу, цикл повторяется">
  <style>
    #sc { font-family: Helvetica, Arial, sans-serif; }
    #sc .pp   { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #sc .hl   { font-size: 15px; fill: #3576C0; font-weight: 700; }
    #sc .al   { font-size: 15px; fill: #73B222; font-weight: 700; }
    #sc .tx   { font-size: 15px; fill: #111111; }
    #sc .pl   { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #sc .plf  { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #sc .gb   { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.8; }
    #sc .strip{ fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.4; }
    #sc .lbl  { font-size: 18px; fill: #111111; }
    #sc .big  { font-size: 21px; fill: #111111; }
    #sc .cap  { font-size: 13px; fill: #5E5850; }
    #sc .red  { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #sc .edge { stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #sc .redge{ stroke: #C30B0A; stroke-width: 1.4; fill: none; stroke-dasharray: 4 3; }
    #sc .dedge{ stroke: #3576C0; stroke-width: 1.6; fill: none; stroke-dasharray: 6 4; }
    #sc .legend { font-size: 13px; fill: #5E5850; }
    #sc .ans  { font-size: 17px; fill: #5E5850; }
    #sc .new  { font-size: 17px; fill: #73B222; font-weight: 700; }
  </style>
<defs>
<marker id="sc-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
<marker id="sc-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
</marker>
<marker id="sc-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
</marker>
</defs>
<g data-key="sheet">
<path class="pp" d="M 40 54 L 380 54 L 380 270 L 360 292 L 340 270 L 320 292 L 300 270 L 280 292
L 260 270 L 240 292 L 220 270 L 200 292 L 180 270 L 160 292 L 140 270 L 120 292 L 100 270
L 80 292 L 60 270 L 40 292 Z"/>
<text x="58" y="86" class="hl">Human:</text>
<text x="58" y="112" class="tx">Can you explain the history of</text>
<text x="58" y="134" class="tx">transistors and how they&apos;re</text>
<text x="58" y="156" class="tx">relevant to computers?</text>
<text x="58" y="202" class="al">AI assistant:</text>
</g>
<g data-key="tear">
<line x1="210" y1="330" x2="210" y2="300" class="redge" marker-end="url(#sc-arwr)"/>
<text x="210" y="348" class="red" text-anchor="middle">ответ оторван — продолжения нет</text>
</g>
<g data-key="machine">
<rect x="422" y="122" width="210" height="140" rx="3" class="pl"/>
<rect x="428" y="128" width="210" height="140" rx="3" class="pl"/>
<rect x="434" y="134" width="210" height="140" rx="3" class="pl"/>
<rect x="440" y="140" width="210" height="140" rx="3" class="pl"/>
<rect x="446" y="146" width="210" height="140" rx="3" class="pl"/>
<rect x="452" y="152" width="210" height="140" rx="3" class="pl"/>
<rect x="458" y="158" width="210" height="140" rx="3" class="pl"/>
<rect x="464" y="164" width="210" height="140" rx="3" class="pl"/>
<rect x="470" y="170" width="210" height="140" rx="3" class="plf"/>
<text x="575" y="247" class="lbl" text-anchor="middle">Модель</text>
</g>
<g data-key="feed">
<line x1="386" y1="240" x2="460" y2="240" class="edge" marker-end="url(#sc-arw)"/>
<text x="423" y="228" class="cap" text-anchor="middle">весь текст</text>
</g>
<g data-key="pred">
<line x1="686" y1="240" x2="752" y2="240" class="edge" marker-end="url(#sc-arw)"/>
<rect x="760" y="212" width="160" height="56" rx="8" class="gb"/>
<text x="840" y="292" class="cap" text-anchor="middle">одно следующее слово</text>
</g>
<g data-key="pw1" data-only="1"><text x="840" y="248" class="big" text-anchor="middle">used</text></g>
<g data-key="pw2" data-only="1"><text x="840" y="248" class="big" text-anchor="middle">to</text></g>
<g data-key="strip">
<text x="40" y="352" class="cap">ответ, который собирается слово за словом</text>
<rect x="40" y="362" width="880" height="60" rx="8" class="strip"/>
<text x="60" y="399" class="ans">A transistor is a semiconductor device</text>
</g>
<g data-key="w1" data-only="1"><text x="427" y="399" class="new">used</text></g>
<g data-key="w2" data-only="1"><text x="476" y="399" class="new">to</text></g>
<g data-key="loop">
<line x1="575" y1="358" x2="575" y2="318" class="dedge" marker-end="url(#sc-arwb)"/>
<text x="596" y="344" class="cap">и всё это снова на вход</text>
</g>
<text x="40" y="452" class="legend">жёлтый — исходный текст и модель · зелёный — то, что модель добавила · красный — чего не хватает</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="sheet" data-focus="sheet">
<div class="step-kicker">Шаг 1 · что дано</div>
<h4>Обрывок диалога</h4>
<p>На листе есть вопрос человека и подпись «AI assistant:». Дальше лист
оборван. Никакой базы готовых ответов у нас нет — только этот текст.</p>
</div>
<div class="step-panel" data-on="sheet tear" data-focus="tear">
<div class="step-kicker">Шаг 2 · задача</div>
<h4>Задачу можно сформулировать как продолжение текста</h4>
<p>Заметьте, что «ответить на вопрос» и «дописать оборванный текст» — это,
с точки зрения листа бумаги, одно и то же. Вторая формулировка удобнее:
под неё существует машина.</p>
</div>
<div class="step-panel" data-on="sheet tear machine" data-focus="machine">
<div class="step-kicker">Шаг 3 · инструмент</div>
<h4>Машина, предсказывающая одно слово</h4>
<p>Она умеет ровно одно: принять любой текст и сказать, какое слово идёт
следующим. Не абзац, не мысль, не ответ — одно слово.</p>
</div>
<div class="step-panel" data-on="sheet tear machine feed pred pw1" data-focus="pred">
<div class="step-kicker">Шаг 4 · первый запуск</div>
<h4>Подаём весь текст и получаем слово</h4>
<p>На вход идёт всё сразу: вопрос человека, подпись ассистента и то, что
уже успело появиться в ответе. На выходе — <code>used</code>.</p>
</div>
<div class="step-panel" data-on="sheet tear machine feed pred pw1 strip w1" data-focus="w1">
<div class="step-kicker">Шаг 5 · приписываем</div>
<h4>Слово уходит в конец ответа</h4>
<p>Теперь ответ на одно слово длиннее. Больше на этом шаге
ничего не произошло: текст стал длиннее ровно на одно слово.</p>
</div>
<div class="step-panel" data-on="sheet tear machine feed pred pw1 strip w1 loop" data-focus="loop">
<div class="step-kicker">Шаг 6 · цикл</div>
<h4>Удлинившийся текст возвращается на вход</h4>
<p>Это и есть весь механизм. Модель не помнит предыдущий запуск: единственное,
что связывает шаги, — растущая строка текста, которую ей подают заново.</p>
</div>
<div class="step-panel" data-on="sheet tear machine feed pred pw2 strip w1 w2 loop" data-focus="pred">
<div class="step-kicker">Шаг 7 · и снова</div>
<h4>Второе слово получается тем же способом</h4>
<p>Теперь на входе строка, оканчивающаяся на <code>device used</code>, и
модель предсказывает <code>to</code>. Ответ длиной в сто слов — это сто
таких запусков подряд.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> ответ чат-бота собирается циклом:
предсказать одно слово, приписать его к тексту, запустить всё заново.
</div>
<hr>
<h2 id="part-3">Часть 3. Модель выдаёт не слово, а распределение</h2>
<p>
<strong>Большая языковая модель</strong> — это функция, которая по куску текста
выдаёт вероятность каждого возможного следующего слова. Не одно слово с
уверенностью, а число для каждой строки словаря:
</p>
<div class="math-display" data-tex="p(w \mid \text{контекст}), \qquad \sum_{w \in V} p(w \mid \text{контекст}) = 1"></div>
<p>
Словарь <span class="math-inline" data-tex="V"></span> у современных моделей — это десятки тысяч
элементов (у GPT-3 их 50 257). Значит, на каждом запуске модель выдаёт
пятьдесят тысяч чисел, а не одно слово. Слово выбирается уже потом, отдельным
решением, и это решение — не часть самой модели.
</p>
<p>
Разберём одно такое распределение целиком.
</p>
<div class="stage" id="stagePr" tabindex="0">
<div class="stage-figure">
<svg id="pr" viewBox="0 0 960 560" role="img" aria-label="Фраза с пропуском подаётся в модель, на выходе список слов с вероятностями">
  <style>
    #pr { font-family: Helvetica, Arial, sans-serif; }
    #pr .sb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #pr .st  { font-size: 20px; fill: #3576C0; }
    #pr .pl  { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #pr .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #pr .lbl { font-size: 17px; fill: #111111; }
    #pr .wl  { font-size: 14px; fill: #111111; }
    #pr .bar { fill: #73B222; fill-opacity: .62; stroke: #73B222; stroke-width: 1; }
    #pr .pv  { font-size: 13px; fill: #5E5850; }
    #pr .cap { font-size: 13px; fill: #5E5850; }
    #pr .ring{ fill: none; stroke: #73B222; stroke-width: 2.2; }
    #pr .ringy{ fill: none; stroke: #C29E08; stroke-width: 2.2; }
    #pr .yl  { font-size: 13px; fill: #8C7106; font-weight: 700; }
    #pr .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #pr .dots{ font-size: 22px; fill: #5E5850; }
    #pr .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="pr-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
</defs>
<g data-key="sent">
<rect x="40" y="30" width="470" height="52" rx="8" class="sb"/>
<text x="60" y="64" class="st">Paris is a city in ______</text>
</g>
<g data-key="model">
<rect x="22" y="152" width="250" height="160" rx="3" class="pl"/>
<rect x="28" y="158" width="250" height="160" rx="3" class="pl"/>
<rect x="34" y="164" width="250" height="160" rx="3" class="pl"/>
<rect x="40" y="170" width="250" height="160" rx="3" class="pl"/>
<rect x="46" y="176" width="250" height="160" rx="3" class="pl"/>
<rect x="52" y="182" width="250" height="160" rx="3" class="pl"/>
<rect x="58" y="188" width="250" height="160" rx="3" class="pl"/>
<rect x="64" y="194" width="250" height="160" rx="3" class="pl"/>
<rect x="70" y="200" width="250" height="160" rx="3" class="plf"/>
<text x="195" y="288" class="lbl" text-anchor="middle">Языковая модель</text>
</g>
<g data-key="arrow">
<line x1="326" y1="280" x2="408" y2="280" class="edge" marker-end="url(#pr-arw)"/>
<text x="367" y="268" class="cap" text-anchor="middle">50 257 чисел</text>
</g>
<g data-key="bars">
<text x="560" y="105" class="wl" text-anchor="end">France</text>
<rect x="572" y="90" width="136" height="20" rx="2" class="bar"/>
<text x="716" y="105" class="pv">17%</text>
<text x="560" y="137" class="wl" text-anchor="end">and</text>
<rect x="572" y="122" width="120" height="20" rx="2" class="bar"/>
<text x="700" y="137" class="pv">15%</text>
<text x="560" y="169" class="wl" text-anchor="end">the</text>
<rect x="572" y="154" width="72" height="20" rx="2" class="bar"/>
<text x="652" y="169" class="pv">9%</text>
<text x="560" y="201" class="wl" text-anchor="end">Logan</text>
<rect x="572" y="186" width="56" height="20" rx="2" class="bar"/>
<text x="636" y="201" class="pv">7%</text>
<text x="560" y="233" class="wl" text-anchor="end">which</text>
<rect x="572" y="218" width="32" height="20" rx="2" class="bar"/>
<text x="612" y="233" class="pv">4%</text>
<text x="560" y="265" class="wl" text-anchor="end">Henry</text>
<rect x="572" y="250" width="24" height="20" rx="2" class="bar"/>
<text x="604" y="265" class="pv">3%</text>
<text x="560" y="297" class="wl" text-anchor="end">northern</text>
<rect x="572" y="282" width="24" height="20" rx="2" class="bar"/>
<text x="604" y="297" class="pv">3%</text>
<text x="560" y="329" class="wl" text-anchor="end">central</text>
<rect x="572" y="314" width="16" height="20" rx="2" class="bar"/>
<text x="596" y="329" class="pv">2%</text>
<text x="560" y="361" class="wl" text-anchor="end">northeastern</text>
<rect x="572" y="346" width="16" height="20" rx="2" class="bar"/>
<text x="596" y="361" class="pv">2%</text>
<text x="560" y="393" class="wl" text-anchor="end">Paris</text>
<rect x="572" y="378" width="8" height="20" rx="2" class="bar"/>
<text x="588" y="393" class="pv">1%</text>
<text x="560" y="425" class="wl" text-anchor="end">Texas</text>
<rect x="572" y="410" width="8" height="20" rx="2" class="bar"/>
<text x="588" y="425" class="pv">1%</text>
</g>
<g data-key="top1">
<rect x="464" y="84" width="300" height="30" rx="6" class="ring"/>
</g>
<g data-key="tail">
<text x="566" y="442" class="dots" text-anchor="middle">⋮</text>
<text x="572" y="470" class="cap">остальные слова словаря — вместе 36 %</text>
</g>
<g data-key="sum">
<text x="40" y="424" class="cap">все 50 257 чисел неотрицательны</text>
<text x="40" y="446" class="cap">и в сумме дают ровно 1</text>
</g>
<g data-key="sample">
<rect x="464" y="148" width="300" height="30" rx="6" class="ringy"/>
<text x="774" y="168" class="yl">а выбрано может быть это</text>
</g>
<text x="40" y="540" class="legend">синий — вход · зелёный — вероятности, которые выдала модель · жёлтый — то, что выбрал сэмплер</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="sent" data-focus="sent">
<div class="step-kicker">Шаг 1 · вход</div>
<h4>Кусок текста с пропуском в конце</h4>
<p>Никаких вопросов и заданий: модель видит просто последовательность слов
и должна сказать, что идёт дальше.</p>
</div>
<div class="step-panel" data-on="sent model" data-focus="model">
<div class="step-kicker">Шаг 2 · функция</div>
<h4>Модель — это функция, а не поиск</h4>
<p>Внутри нет таблицы фактов и нет обращения к интернету. Есть только
арифметика над числами, и она одинакова для любого входа.</p>
</div>
<div class="step-panel" data-on="sent model arrow bars" data-focus="bars">
<div class="step-kicker">Шаг 3 · выход</div>
<h4>На выходе — число для каждого слова словаря</h4>
<p>Здесь показаны одиннадцать самых вероятных вариантов. Остальные
пятьдесят тысяч тоже получили свои числа, просто маленькие.</p>
</div>
<div class="step-panel" data-on="sent model arrow bars top1" data-focus="top1">
<div class="step-kicker">Шаг 4 · лидер</div>
<h4>Даже лидер не выглядит уверенным</h4>
<p>У <code>France</code> всего 17 %. Модель не «знает ответ» — она
распределяет уверенность, и большая её часть уходит на служебные
продолжения вроде <code>and</code> и <code>the</code>.</p>
</div>
<div class="step-panel" data-on="sent model arrow bars top1 tail" data-focus="tail">
<div class="step-kicker">Шаг 5 · хвост</div>
<h4>Хвост длинный, но не пустой</h4>
<p>Одиннадцать показанных слов набирают 64 %. Оставшиеся 36 % размазаны по
десяткам тысяч слов — у каждого доля близка к нулю, но не ноль.</p>
</div>
<div class="step-panel" data-on="sent model arrow bars top1 tail sum" data-focus="sum">
<div class="step-kicker">Шаг 6 · нормировка</div>
<h4>Это настоящее распределение вероятностей</h4>
<p>Числа неотрицательны и в сумме равны единице — это гарантирует последняя
операция модели, softmax. Поэтому «поднять» одно слово можно только за
счёт остальных.</p>
<div class="worked-example">
<div class="worked-label">Насколько распределение размазано</div>
<div class="worked-grid">
<div class="worked-cell">
<span>Считаем энтропию по показанным словам</span>
<div class="math-display worked-math" data-tex="H = -\sum_i p_i \log_2 p_i = 2{,}2743\ \text{бита}"></div>
</div>
<div class="worked-cell worked-result">
<span>Эффективное число вариантов</span>
<div class="math-display worked-math" data-tex="2^{H} = 4{,}84"></div>
</div>
</div>
<p class="worked-reading"><strong>Как это прочитать:</strong> хотя вариантов
формально пятьдесят тысяч, распределение ведёт себя примерно как честный
выбор из пяти равновероятных слов.</p>
</div>
</div>
<div class="step-panel" data-on="sent model arrow bars top1 tail sum sample" data-focus="sample">
<div class="step-kicker">Шаг 7 · выбор</div>
<h4>Берут не всегда самое вероятное</h4>
<p>Если всегда брать максимум, текст получается вялым и зацикливается.
Поэтому слово выбирают случайно, с вероятностями из этого списка. Модель
остаётся детерминированной — случайность живёт в сэмплере.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout-blue">
<strong>Отсюда следует одна практическая вещь.</strong> Один и тот же запрос
даёт разные ответы не потому, что модель «в настроении», и не потому, что она
меняется между запусками. Функция та же и числа те же — разным оказывается
результат броска кости на каждом из сотни шагов. При эффективных ~4,84
вариантах на шаг ответ из двадцати слов имеет порядка
<span class="math-inline" data-tex="4{,}84^{20} \approx 4{,}9\cdot10^{13}"></span>
правдоподобных вариантов.
</div>
<div class="callout">
<strong>Главная мысль части:</strong> модель отвечает не словом, а полным
распределением по словарю; выбор конкретного слова — отдельный и случайный шаг
снаружи модели.
</div>
<hr>
<h2 id="part-4">Часть 4. Как из предсказателя получается собеседник</h2>
<p>
Машина умеет дописывать текст. Чтобы получился ассистент, текст нужно
подготовить так, чтобы его естественным продолжением оказался полезный ответ.
Делается это в три слоя.
</p>
<p>
Сначала пишется <strong>системный текст</strong> — описание сцены вроде «далее
идёт разговор пользователя с полезным и очень знающим ИИ-ассистентом».
Пользователь его не видит. Потом подставляется то, что ввёл пользователь.
И дальше модель раз за разом дописывает реплику воображаемого ассистента.
</p>
<div class="callout-blue">
<strong>Почему это работает.</strong> Модель не «понимает роль». Она
продолжает текст так, как продолжались похожие тексты в обучающих данных.
Абзац, начинающийся словами «полезный и очень знающий ассистент ответил»,
статистически продолжается полезным и знающим ответом — этого достаточно.
</div>
<div class="stage" id="stageCh" tabindex="0">
<div class="stage-figure">
<svg id="ch" viewBox="0 0 960 460" role="img" aria-label="Системный текст, реплика пользователя и начало ответа подаются в модель, та выдаёт распределение по следующему слову">
  <style>
    #ch { font-family: Helvetica, Arial, sans-serif; }
    #ch .gb  { fill: #F0FAF0; stroke: #73B222; stroke-width: 1.6; }
    #ch .bb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #ch .yb  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #ch .tx  { font-size: 13px; fill: #111111; }
    #ch .tg  { font-size: 13px; fill: #5A8C1C; }
    #ch .tb  { font-size: 13px; fill: #2A5E9B; }
    #ch .ty  { font-size: 13px; fill: #8C7106; }
    #ch .pl  { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #ch .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #ch .lbl { font-size: 17px; fill: #111111; }
    #ch .wl  { font-size: 13px; fill: #111111; }
    #ch .bar { fill: #73B222; fill-opacity: .62; stroke: #73B222; stroke-width: 1; }
    #ch .pv  { font-size: 13px; fill: #5E5850; }
    #ch .cap { font-size: 13px; fill: #5E5850; }
    #ch .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #ch .comb{ stroke: #5E5850; stroke-width: 1.4; fill: none; }
    #ch .dedge{ stroke: #3576C0; stroke-width: 1.6; fill: none; stroke-dasharray: 6 4; }
    #ch .ringy{ fill: none; stroke: #C29E08; stroke-width: 2.2; }
    #ch .red { font-size: 13px; fill: #C30B0A; }
    #ch .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="ch-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
<marker id="ch-arwb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#3576C0"/>
</marker>
</defs>
<g data-key="sys">
<rect x="30" y="44" width="344" height="80" rx="8" class="gb"/>
<text x="44" y="68" class="tg">What follows is a conversation between a</text>
<text x="44" y="88" class="tg">user and a helpful, very knowledgeable</text>
<text x="44" y="108" class="tg">AI assistant.</text>
</g>
<g data-key="usr">
<rect x="30" y="136" width="344" height="62" rx="8" class="bb"/>
<text x="44" y="160" class="tb">User: Give me some ideas for what to do</text>
<text x="44" y="180" class="tb">when visiting Santiago.</text>
</g>
<g data-key="ai">
<rect x="30" y="210" width="344" height="84" rx="8" class="yb"/>
<text x="44" y="234" class="ty">AI Assistant: Sure, there are plenty of</text>
<text x="44" y="254" class="ty">things to do in Santiago!</text>
<text x="44" y="278" class="ty">One ___________</text>
</g>
<g data-key="comb">
<path class="comb" d="M 378 84 L 392 84 M 378 167 L 392 167 M 378 252 L 392 252 M 392 84 L 392 252"/>
<line x1="392" y1="167" x2="424" y2="167" class="edge" marker-end="url(#ch-arw)"/>
</g>
<g data-key="model">
<rect x="400" y="80" width="160" height="120" rx="3" class="pl"/>
<rect x="405" y="85" width="160" height="120" rx="3" class="pl"/>
<rect x="410" y="90" width="160" height="120" rx="3" class="pl"/>
<rect x="415" y="95" width="160" height="120" rx="3" class="pl"/>
<rect x="420" y="100" width="160" height="120" rx="3" class="pl"/>
<rect x="425" y="105" width="160" height="120" rx="3" class="pl"/>
<rect x="430" y="110" width="160" height="120" rx="3" class="plf"/>
<text x="510" y="176" class="lbl" text-anchor="middle">Модель</text>
</g>
<g data-key="out">
<line x1="596" y1="170" x2="638" y2="170" class="edge" marker-end="url(#ch-arw)"/>
</g>
<g data-key="bars">
<text x="720" y="77" class="wl" text-anchor="end">popular</text>
<rect x="732" y="60" width="180" height="22" rx="2" class="bar"/>
<text x="920" y="77" class="pv">45%</text>
<text x="720" y="111" class="wl" text-anchor="end">idea</text>
<rect x="732" y="94" width="120" height="22" rx="2" class="bar"/>
<text x="860" y="111" class="pv">30%</text>
<text x="720" y="145" class="wl" text-anchor="end">option</text>
<rect x="732" y="128" width="76" height="22" rx="2" class="bar"/>
<text x="816" y="145" class="pv">19%</text>
<text x="720" y="179" class="wl" text-anchor="end">of</text>
<rect x="732" y="162" width="4" height="22" rx="2" class="bar"/>
<text x="744" y="179" class="pv">1%</text>
<text x="720" y="213" class="wl" text-anchor="end">suggestion</text>
<rect x="732" y="196" width="3" height="22" rx="2" class="bar"/>
<text x="743" y="213" class="pv">0%</text>
<text x="720" y="247" class="wl" text-anchor="end">great</text>
<rect x="732" y="230" width="3" height="22" rx="2" class="bar"/>
<text x="743" y="247" class="pv">0%</text>
<text x="720" y="281" class="wl" text-anchor="end">must</text>
<rect x="732" y="264" width="3" height="22" rx="2" class="bar"/>
<text x="743" y="281" class="pv">0%</text>
<text x="720" y="315" class="wl" text-anchor="end">fun</text>
<rect x="732" y="298" width="3" height="22" rx="2" class="bar"/>
<text x="743" y="315" class="pv">0%</text>
</g>
<g data-key="pick">
<rect x="636" y="124" width="310" height="30" rx="6" class="ringy"/>
</g>
<g data-key="note" data-only="1">
<text x="30" y="400" class="red">Для модели это одна строка: границы между системным текстом, репликой пользователя и своим ответом она не видит.</text>
</g>
<g data-key="loop">
<path class="dedge" d="M 790 332 L 790 360 L 200 360 L 200 298" marker-end="url(#ch-arwb)"/>
<text x="300" y="352" class="cap">выбранное слово приписывается к ответу — и всё заново</text>
</g>
<text x="30" y="440" class="legend">зелёный — системный текст · синий — то, что ввёл пользователь · жёлтый — ответ, который собирает модель</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="sys" data-focus="sys">
<div class="step-kicker">Шаг 1 · декорация</div>
<h4>Системный текст описывает сцену</h4>
<p>Он написан заранее и подставляется перед каждым диалогом. Пользователь
его не видит, а модель воспринимает как обычное начало текста.</p>
</div>
<div class="step-panel" data-on="sys usr" data-focus="usr">
<div class="step-kicker">Шаг 2 · реплика</div>
<h4>Ввод пользователя вклеивается следом</h4>
<p>Никакого разбора вопроса не происходит: текст просто дописывается к
предыдущему как ещё одна строка сценария.</p>
</div>
<div class="step-panel" data-on="sys usr ai" data-focus="ai">
<div class="step-kicker">Шаг 3 · начало ответа</div>
<h4>Всё, что уже сгенерировано, тоже часть входа</h4>
<p>Ответ обрывается на слове <code>One</code> — дальше пропуск. Именно этот
пропуск модель и заполняет.</p>
</div>
<div class="step-panel" data-on="sys usr ai comb model out bars" data-focus="bars">
<div class="step-kicker">Шаг 4 · запуск</div>
<h4>Три куска склеиваются и идут на вход целиком</h4>
<p>На выходе — снова распределение. Здесь три кандидата делят почти всё:
<code>popular</code> 45 %, <code>idea</code> 30 %, <code>option</code> 19 %.</p>
</div>
<div class="step-panel" data-on="sys usr ai comb model out bars pick" data-focus="pick">
<div class="step-kicker">Шаг 5 · выбор</div>
<h4>Выбрано третье по вероятности слово</h4>
<p>Сэмплер взял <code>option</code> с его 19 %, а не лидера. Ничего не
сломалось: так и задумано, иначе ответы получались бы одинаковыми и
плоскими.</p>
</div>
<div class="step-panel" data-on="sys usr ai comb model out bars pick note" data-focus="note">
<div class="step-kicker">Шаг 6 · важная оговорка</div>
<h4>Ролей внутри нет, есть только текст</h4>
<p>Разделение на «систему», «пользователя» и «ассистента» существует в
обёртке вокруг модели. Для самой функции это одна длинная строка — и
поэтому её можно сбить, вписав в реплику пользователя текст, похожий на системную инструкцию.</p>
</div>
<div class="step-panel" data-on="sys usr ai comb model out bars pick note loop" data-focus="loop">
<div class="step-kicker">Шаг 7 · цикл</div>
<h4>И снова всё сначала</h4>
<p>Жёлтый блок стал на слово длиннее, модель запускается заново. Текст,
который вы читаете в окне чата, собирается именно так — по одному слову.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> роль ассистента задаётся только текстом:
системная инструкция, реплика пользователя и начало ответа склеиваются в одну
строку, а модель решает над ней всё ту же задачу дописывания.
</div>
<hr>
<h2 id="part-5">Часть 5. Откуда берётся умение: текст</h2>
<p>
Никто не пишет правила, по которым выбирается следующее слово. Модель учится
предсказывать его, прочитав огромное количество текста — как правило, собранного
из интернета и оцифрованных книг.
</p>
<p>
Величину этого корпуса трудно ощутить в цифрах, поэтому переведём её во время
чтения. Возьмём объём обучающего текста GPT-3 — порядка 300 миллиардов слов — и
разделим на скорость чтения 220 слов в минуту:
</p>
<div class="math-display" data-tex="\frac{3\cdot10^{11}}{220 \cdot 60 \cdot 24 \cdot 365} \approx 2\,595\ \text{лет}"></div>
<div class="stage" id="stageDt" tabindex="0">
<div class="stage-figure">
<svg id="dt" viewBox="0 0 960 490" role="img" aria-label="Разрозненные куски текста стекаются в модель, логарифмическая шкала показывает объём корпуса">
  <style>
    #dt { font-family: Helvetica, Arial, sans-serif; }
    #dt .fr  { font-size: 13px; fill: #7A756C; }
    #dt .pl  { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #dt .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #dt .lbl { font-size: 17px; fill: #111111; }
    #dt .ax  { stroke: #3576C0; stroke-width: 2; fill: none; }
    #dt .tick{ stroke: #3576C0; stroke-width: 1.6; }
    #dt .cap { font-size: 13px; fill: #5E5850; }
    #dt .capg{ font-size: 13px; fill: #5A8C1C; font-weight: 700; }
    #dt .num { font-size: 15px; fill: #111111; }
    #dt .big { font-size: 20px; fill: #5A8C1C; font-weight: 700; }
    #dt .red { font-size: 13px; fill: #C30B0A; }
    #dt .edge{ stroke: #A9A399; stroke-width: 1.3; fill: none; }
    #dt .body{ fill: #C6C2B8; }
    #dt .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="dt-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#A9A399"/>
</marker>
</defs>
<g data-key="frags">
<text x="40"  y="60"  class="fr">In 1912, the Titanic sank after hitting an iceberg.</text>
<text x="430" y="52"  class="fr">The recipe said it would take 30 minutes.</text>
<text x="740" y="78"  class="fr">Call me Ishmael.</text>
<text x="40"  y="96"  class="fr">The Hubble Space Telescope has provided detailed images of galaxies.</text>
<text x="560" y="104" class="fr">I think, therefore I am.</text>
<text x="40"  y="132" class="fr">World War II began in 1939 and ended in 1945.</text>
<text x="420" y="130" class="fr">The Galapagos Islands were studied by Charles Darwin.</text>
<text x="60"  y="168" class="fr">All animals are equal, but some animals are more equal than others.</text>
<text x="620" y="166" class="fr">To infinity and beyond!</text>
</g>
<g data-key="feed">
<path class="edge" d="M 200 178 L 370 212" marker-end="url(#dt-arw)"/>
<path class="edge" d="M 700 178 L 592 212" marker-end="url(#dt-arw)"/>
<path class="edge" d="M 480 180 L 480 204" marker-end="url(#dt-arw)"/>
</g>
<g data-key="model">
<rect x="350" y="180" width="200" height="90" rx="3" class="pl"/>
<rect x="355" y="185" width="200" height="90" rx="3" class="pl"/>
<rect x="360" y="190" width="200" height="90" rx="3" class="pl"/>
<rect x="365" y="195" width="200" height="90" rx="3" class="pl"/>
<rect x="370" y="200" width="200" height="90" rx="3" class="pl"/>
<rect x="375" y="205" width="200" height="90" rx="3" class="pl"/>
<rect x="380" y="210" width="200" height="90" rx="3" class="plf"/>
<text x="480" y="262" class="lbl" text-anchor="middle">Модель</text>
</g>
<g data-key="scale">
<line x1="60" y1="340" x2="920" y2="340" class="ax"/>
<line x1="80"  y1="332" x2="80"  y2="348" class="tick"/>
<line x1="273" y1="332" x2="273" y2="348" class="tick"/>
<line x1="466" y1="332" x2="466" y2="348" class="tick"/>
<line x1="659" y1="332" x2="659" y2="348" class="tick"/>
<line x1="898" y1="310" x2="898" y2="348" class="tick"/>
<text x="80"  y="366" class="cap" text-anchor="middle">страница, 1 000 слов</text>
<text x="273" y="366" class="cap" text-anchor="middle">книга, 100 000</text>
<text x="466" y="366" class="cap" text-anchor="middle">100 книг</text>
<text x="659" y="366" class="cap" text-anchor="middle">10 000 книг</text>
<text x="898" y="300" class="capg" text-anchor="end">300 млрд слов — корпус GPT-3</text>
<text x="60"  y="322" class="cap">шкала логарифмическая: шаг вправо — это ×100</text>
</g>
<g data-key="calc">
<text x="60" y="404" class="num">300 000 000 000 слов ÷ (220 слов/мин × 60 × 24 × 365)</text>
<text x="60" y="428" class="num">= 2 595 лет чтения без единого перерыва</text>
</g>
<g data-key="human">
<circle cx="742" cy="392" r="14" class="body"/>
<path class="body" d="M 714 432 Q 714 410 742 410 Q 770 410 770 432 Z"/>
<text x="786" y="404" class="big">2 595 лет</text>
<text x="786" y="426" class="cap">24 часа в сутки, без сна</text>
</g>
<g data-key="note" data-only="1">
<text x="60" y="458" class="red">Это только GPT-3. У следующих поколений корпус во много раз больше.</text>
</g>
<text x="60" y="478" class="legend">серый — обучающий текст · синий — шкала объёма · зелёный — то, что получилось</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="frags" data-focus="frags">
<div class="step-kicker">Шаг 1 · сырьё</div>
<h4>Обучающие данные — это просто текст</h4>
<p>Романы, статьи, документация, форумы, рецепты. Ни разметки, ни правильных
ответов: каждое слово в каждом фрагменте само себе задание.</p>
</div>
<div class="step-panel" data-on="frags feed model" data-focus="model">
<div class="step-kicker">Шаг 2 · что с ним делают</div>
<h4>Весь этот текст проходит через модель</h4>
<p>Фрагмент за фрагментом, кусками от нескольких слов до тысяч. Никакого
отбора «полезных фактов» на этом этапе нет.</p>
</div>
<div class="step-panel" data-on="frags feed model scale" data-focus="scale">
<div class="step-kicker">Шаг 3 · масштаб</div>
<h4>Линейная шкала здесь бесполезна</h4>
<p>От страницы до корпуса GPT-3 — восемь с половиной порядков. На линейной
оси первые четыре отметки слились бы в точку у левого края.</p>
</div>
<div class="step-panel" data-on="frags feed model scale calc" data-focus="calc">
<div class="step-kicker">Шаг 4 · перевод в время</div>
<h4>Переводим объём в часы чтения</h4>
<p>Средний темп чтения — около 220 слов в минуту. Делим объём корпуса на
этот темп и получаем время, которое понадобилось бы человеку.</p>
</div>
<div class="step-panel" data-on="frags feed model scale calc human" data-focus="human">
<div class="step-kicker">Шаг 5 · результат</div>
<h4>Двадцать шесть веков подряд</h4>
<p>2 595 лет непрерывного чтения — это дольше, чем существует письменная
история большинства стран. И это разовый проход по данным.</p>
</div>
<div class="step-panel" data-on="frags feed model scale calc human note" data-focus="note">
<div class="step-kicker">Шаг 6 · оговорка</div>
<h4>И это ещё скромная оценка</h4>
<p>Цифра относится к GPT-3 (2020 год). Более поздние модели обучались на
кратно большем объёме, и точные числа компании не публикуют.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> обучающих данных столько, что человек
физически не смог бы их прочитать; при этом никакой разметки в них нет —
правильный ответ каждый раз просто следующее слово самого текста.
</div>
<hr>
<h2 id="part-6">Часть 6. Параметры — это ручки настройки</h2>
<p>
Внутри модели нет ни правил, ни фраз, ни фактов в привычном виде. Есть длинный
список чисел — <strong>параметров</strong>, или <strong>весов</strong>. Всё
поведение модели определяется только ими: вход, арифметика и эти числа.
</p>
<p>
Удобно представлять каждый параметр как ручку на исполинском пульте. Поворот
одной ручки чуть-чуть меняет все вероятности, которые модель выдаёт на любой
вход. Именно из-за количества этих ручек модели и называются
<em>большими</em>: у GPT-3 их 175 миллиардов.
</p>
<div class="stage" id="stagePm" tabindex="0">
<div class="stage-figure">
<svg id="pm" viewBox="0 0 960 520" role="img" aria-label="Пластина с ручками-параметрами, увеличенная одна ручка и влияние её поворота на распределение">
  <style>
    #pm { font-family: Helvetica, Arial, sans-serif; }
    #pm .pl  { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #pm .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #pm .kn  { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.3; }
    #pm .knn { stroke: #3576C0; stroke-width: 2; stroke-linecap: round; }
    #pm .gc  { fill: none; stroke: #C29E08; stroke-width: 2.4; }
    #pm .gt  { stroke: #C29E08; stroke-width: 2; }
    #pm .gn  { stroke: #3576C0; stroke-width: 4; stroke-linecap: round; }
    #pm .sel { fill: none; stroke: #3576C0; stroke-width: 2; }
    #pm .lead{ stroke: #3576C0; stroke-width: 1.2; fill: none; }
    #pm .cap { font-size: 13px; fill: #5E5850; }
    #pm .num { font-size: 17px; fill: #111111; }
    #pm .big { font-size: 22px; fill: #111111; font-weight: 700; }
    #pm .ml  { font-size: 13px; fill: #111111; }
    #pm .mb  { fill: #C6C2B8; }
    #pm .mg  { fill: none; stroke: #73B222; stroke-width: 2.2; }
    #pm .red { font-size: 14px; fill: #C30B0A; font-weight: 700; }
    #pm .legend { font-size: 13px; fill: #5E5850; }
  </style>
<g data-key="stack">
<rect x="54" y="64" width="380" height="250" rx="4" class="pl"/>
<rect x="61" y="71" width="380" height="250" rx="4" class="pl"/>
<rect x="68" y="78" width="380" height="250" rx="4" class="pl"/>
<rect x="75" y="85" width="380" height="250" rx="4" class="pl"/>
<rect x="82" y="92" width="380" height="250" rx="4" class="pl"/>
<rect x="89" y="99" width="380" height="250" rx="4" class="pl"/>
<rect x="96" y="106" width="380" height="250" rx="4" class="pl"/>
<rect x="103" y="113" width="380" height="250" rx="4" class="pl"/>
</g>
<g data-key="plate">
<rect x="110" y="120" width="380" height="250" rx="4" class="plf"/>
<circle cx="140" cy="150" r="11" class="kn"/>
<line x1="140" y1="150" x2="136.3" y2="141.8" class="knn"/>
<circle cx="176" cy="150" r="11" class="kn"/>
<line x1="176" y1="150" x2="169.4" y2="143.9" class="knn"/>
<circle cx="212" cy="150" r="11" class="kn"/>
<line x1="212" y1="150" x2="215.1" y2="141.5" class="knn"/>
<circle cx="248" cy="150" r="11" class="kn"/>
<line x1="248" y1="150" x2="240.4" y2="145.2" class="knn"/>
<circle cx="284" cy="150" r="11" class="kn"/>
<line x1="284" y1="150" x2="284.7" y2="141.0" class="knn"/>
<circle cx="320" cy="150" r="11" class="kn"/>
<line x1="320" y1="150" x2="317.2" y2="141.4" class="knn"/>
<circle cx="356" cy="150" r="11" class="kn"/>
<line x1="356" y1="150" x2="348.2" y2="145.5" class="knn"/>
<circle cx="392" cy="150" r="11" class="kn"/>
<line x1="392" y1="150" x2="392.1" y2="141.0" class="knn"/>
<circle cx="428" cy="150" r="11" class="kn"/>
<line x1="428" y1="150" x2="420.0" y2="145.8" class="knn"/>
<circle cx="464" cy="150" r="11" class="kn"/>
<line x1="464" y1="150" x2="462.6" y2="141.1" class="knn"/>
<circle cx="140" cy="186" r="11" class="kn"/>
<line x1="140" y1="186" x2="132.3" y2="181.2" class="knn"/>
<circle cx="176" cy="186" r="11" class="kn"/>
<line x1="176" y1="186" x2="168.6" y2="180.9" class="knn"/>
<circle cx="212" cy="186" r="11" class="kn"/>
<line x1="212" y1="186" x2="210.4" y2="177.1" class="knn"/>
<circle cx="248" cy="186" r="11" class="kn"/>
<line x1="248" y1="186" x2="254.2" y2="179.5" class="knn"/>
<circle cx="284" cy="186" r="11" class="kn"/>
<line x1="284" y1="186" x2="277.0" y2="180.3" class="knn"/>
<circle cx="320" cy="186" r="11" class="kn"/>
<line x1="320" y1="186" x2="314.5" y2="178.8" class="knn"/>
<circle cx="356" cy="186" r="11" class="kn"/>
<line x1="356" y1="186" x2="358.6" y2="177.4" class="knn"/>
<circle cx="392" cy="186" r="11" class="kn"/>
<line x1="392" y1="186" x2="399.8" y2="181.5" class="knn"/>
<circle cx="428" cy="186" r="11" class="kn"/>
<line x1="428" y1="186" x2="429.6" y2="177.1" class="knn"/>
<circle cx="464" cy="186" r="11" class="kn"/>
<line x1="464" y1="186" x2="461.8" y2="177.3" class="knn"/>
<circle cx="140" cy="222" r="11" class="kn"/>
<line x1="140" y1="222" x2="148.1" y2="218.0" class="knn"/>
<circle cx="176" cy="222" r="11" class="kn"/>
<line x1="176" y1="222" x2="168.1" y2="217.7" class="knn"/>
<circle cx="212" cy="222" r="11" class="kn"/>
<line x1="212" y1="222" x2="218.7" y2="216.0" class="knn"/>
<circle cx="248" cy="222" r="11" class="kn"/>
<line x1="248" y1="222" x2="243.7" y2="214.1" class="knn"/>
<circle cx="284" cy="222" r="11" class="kn"/>
<line x1="284" y1="222" x2="277.3" y2="216.0" class="knn"/>
<circle cx="320" cy="222" r="11" class="kn"/>
<line x1="320" y1="222" x2="312.9" y2="216.4" class="knn"/>
<circle cx="356" cy="222" r="11" class="kn"/>
<line x1="356" y1="222" x2="352.0" y2="213.9" class="knn"/>
<circle cx="392" cy="222" r="11" class="kn"/>
<line x1="392" y1="222" x2="398.1" y2="215.3" class="knn"/>
<circle cx="428" cy="222" r="11" class="kn"/>
<line x1="428" y1="222" x2="421.8" y2="215.4" class="knn"/>
<circle cx="464" cy="222" r="11" class="kn"/>
<line x1="464" y1="222" x2="465.7" y2="213.1" class="knn"/>
<circle cx="140" cy="258" r="11" class="kn"/>
<line x1="140" y1="258" x2="142.9" y2="249.4" class="knn"/>
<circle cx="176" cy="258" r="11" class="kn"/>
<line x1="176" y1="258" x2="173.3" y2="249.4" class="knn"/>
<circle cx="212" cy="258" r="11" class="kn"/>
<line x1="212" y1="258" x2="213.0" y2="249.0" class="knn"/>
<circle cx="248" cy="258" r="11" class="kn"/>
<line x1="248" y1="258" x2="240.3" y2="253.4" class="knn"/>
<circle cx="284" cy="258" r="11" class="kn"/>
<line x1="284" y1="258" x2="276.2" y2="253.4" class="knn"/>
<circle cx="320" cy="258" r="11" class="kn"/>
<line x1="320" y1="258" x2="314.2" y2="251.1" class="knn"/>
<circle cx="356" cy="258" r="11" class="kn"/>
<line x1="356" y1="258" x2="359.7" y2="249.8" class="knn"/>
<circle cx="392" cy="258" r="11" class="kn"/>
<line x1="392" y1="258" x2="390.4" y2="249.1" class="knn"/>
<circle cx="428" cy="258" r="11" class="kn"/>
<line x1="428" y1="258" x2="424.2" y2="249.8" class="knn"/>
<circle cx="464" cy="258" r="11" class="kn"/>
<line x1="464" y1="258" x2="465.8" y2="249.2" class="knn"/>
<circle cx="140" cy="294" r="11" class="kn"/>
<line x1="140" y1="294" x2="139.0" y2="285.0" class="knn"/>
<circle cx="176" cy="294" r="11" class="kn"/>
<line x1="176" y1="294" x2="171.9" y2="286.0" class="knn"/>
<circle cx="212" cy="294" r="11" class="kn"/>
<line x1="212" y1="294" x2="217.7" y2="287.0" class="knn"/>
<circle cx="248" cy="294" r="11" class="kn"/>
<line x1="248" y1="294" x2="252.0" y2="285.9" class="knn"/>
<circle cx="284" cy="294" r="11" class="kn"/>
<line x1="284" y1="294" x2="278.9" y2="286.6" class="knn"/>
<circle cx="320" cy="294" r="11" class="kn"/>
<line x1="320" y1="294" x2="321.5" y2="285.1" class="knn"/>
<circle cx="356" cy="294" r="11" class="kn"/>
<line x1="356" y1="294" x2="356.5" y2="285.0" class="knn"/>
<circle cx="392" cy="294" r="11" class="kn"/>
<line x1="392" y1="294" x2="398.9" y2="288.2" class="knn"/>
<circle cx="428" cy="294" r="11" class="kn"/>
<line x1="428" y1="294" x2="432.6" y2="286.2" class="knn"/>
<circle cx="464" cy="294" r="11" class="kn"/>
<line x1="464" y1="294" x2="459.7" y2="286.1" class="knn"/>
<circle cx="140" cy="330" r="11" class="kn"/>
<line x1="140" y1="330" x2="148.1" y2="326.1" class="knn"/>
<circle cx="176" cy="330" r="11" class="kn"/>
<line x1="176" y1="330" x2="168.9" y2="324.4" class="knn"/>
<circle cx="212" cy="330" r="11" class="kn"/>
<line x1="212" y1="330" x2="210.2" y2="321.2" class="knn"/>
<circle cx="248" cy="330" r="11" class="kn"/>
<line x1="248" y1="330" x2="253.1" y2="322.6" class="knn"/>
<circle cx="284" cy="330" r="11" class="kn"/>
<line x1="284" y1="330" x2="277.4" y2="323.9" class="knn"/>
<circle cx="320" cy="330" r="11" class="kn"/>
<line x1="320" y1="330" x2="319.7" y2="321.0" class="knn"/>
<circle cx="356" cy="330" r="11" class="kn"/>
<line x1="356" y1="330" x2="348.0" y2="325.8" class="knn"/>
<circle cx="392" cy="330" r="11" class="kn"/>
<line x1="392" y1="330" x2="395.4" y2="321.7" class="knn"/>
<circle cx="428" cy="330" r="11" class="kn"/>
<line x1="428" y1="330" x2="433.2" y2="322.6" class="knn"/>
<circle cx="464" cy="330" r="11" class="kn"/>
<line x1="464" y1="330" x2="465.5" y2="321.1" class="knn"/>
</g>
<g data-key="zoom">
<rect x="126" y="136" width="28" height="28" rx="4" class="sel"/>
<path class="lead" d="M 154 139 L 648 128"/>
<path class="lead" d="M 154 163 L 648 232"/>
<line x1="662.8" y1="201.5" x2="655.0" y2="206.0" class="gt"/>
<line x1="657.7" y1="187.5" x2="648.8" y2="189.0" class="gt"/>
<line x1="657.7" y1="172.5" x2="648.8" y2="171.0" class="gt"/>
<line x1="662.8" y1="158.5" x2="655.0" y2="154.0" class="gt"/>
<line x1="672.4" y1="147.1" x2="666.6" y2="140.2" class="gt"/>
<line x1="685.3" y1="139.6" x2="682.2" y2="131.1" class="gt"/>
<line x1="700.0" y1="137.0" x2="700.0" y2="128.0" class="gt"/>
<line x1="714.7" y1="139.6" x2="717.8" y2="131.1" class="gt"/>
<line x1="727.6" y1="147.1" x2="733.4" y2="140.2" class="gt"/>
<line x1="737.2" y1="158.5" x2="745.0" y2="154.0" class="gt"/>
<line x1="742.3" y1="172.5" x2="751.2" y2="171.0" class="gt"/>
<line x1="742.3" y1="187.5" x2="751.2" y2="189.0" class="gt"/>
<line x1="737.2" y1="201.5" x2="745.0" y2="206.0" class="gt"/>
<circle cx="700" cy="180" r="52" class="gc"/>
<line x1="700" y1="180" x2="718.8" y2="145.8" class="gn"/>
<text x="700" y="262" class="cap" text-anchor="middle">один параметр — одно число</text>
</g>
<g data-key="effect">
<text x="620" y="300" class="cap">поворот сдвигает вероятности на любом входе</text>
<text x="700" y="327" class="ml" text-anchor="end">France</text>
<rect x="712" y="312" width="136" height="20" rx="2" class="mb"/>
<rect x="712" y="312" width="152" height="20" rx="2" class="mg"/>
<text x="700" y="357" class="ml" text-anchor="end">and</text>
<rect x="712" y="342" width="120" height="20" rx="2" class="mb"/>
<rect x="712" y="342" width="104" height="20" rx="2" class="mg"/>
<text x="700" y="387" class="ml" text-anchor="end">the</text>
<rect x="712" y="372" width="72" height="20" rx="2" class="mb"/>
<rect x="712" y="372" width="58" height="20" rx="2" class="mg"/>
<text x="700" y="417" class="ml" text-anchor="end">Logan</text>
<rect x="712" y="402" width="56" height="20" rx="2" class="mb"/>
<rect x="712" y="402" width="50" height="20" rx="2" class="mg"/>
</g>
<g data-key="count">
<text x="110" y="404" class="big">175 000 000 000 таких ручек</text>
<text x="110" y="430" class="num">крутить по одной в секунду — 5 549 лет</text>
</g>
<g data-key="nobody">
<text x="110" y="462" class="red">Ни одну из них человек не выставляет: в начале это просто случайные числа.</text>
</g>
<text x="110" y="502" class="legend">жёлтый — параметры · синий — их текущие значения · зелёный — распределение после поворота</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="plate" data-focus="plate">
<div class="step-kicker">Шаг 1 · что внутри</div>
<h4>Модель — это таблица чисел</h4>
<p>Плюс фиксированная схема, по которой эти числа перемножаются со входом.
Схему придумал человек, а вот сами числа — нет.</p>
</div>
<div class="step-panel" data-on="plate zoom" data-focus="zoom">
<div class="step-kicker">Шаг 2 · единица измерения</div>
<h4>Один параметр — одно вещественное число</h4>
<p>Никакого смысла у отдельного числа нет: нельзя показать пальцем на ручку
и сказать, что она отвечает за вежливость или за грамматику.</p>
</div>
<div class="step-panel" data-on="plate zoom effect" data-focus="effect">
<div class="step-kicker">Шаг 3 · что делает поворот</div>
<h4>Поворот меняет всё распределение сразу</h4>
<p>Сдвинув одну ручку, вы чуть-чуть измените вероятности следующего слова —
и на этом входе, и на любом другом. Локальных правок здесь не бывает.</p>
</div>
<div class="step-panel" data-on="plate zoom effect stack" data-focus="stack">
<div class="step-kicker">Шаг 4 · их много</div>
<h4>Пластина не одна</h4>
<p>Реальная модель — это десятки слоёв, в каждом несколько больших матриц.
Показанная сетка — условность: настоящих ручек здесь не хватит на
миллиардную долю процента.</p>
</div>
<div class="step-panel" data-on="plate zoom effect stack count" data-focus="count">
<div class="step-kicker">Шаг 5 · сколько именно</div>
<h4>175 миллиардов — это «large» в названии</h4>
<p>Если крутить по одной ручке в секунду без остановки, уйдёт 5 549 лет.
В памяти при двух байтах на число это 350 гигабайт.</p>
</div>
<div class="step-panel" data-on="plate zoom effect stack count nobody" data-focus="nobody">
<div class="step-kicker">Шаг 6 · откуда берутся значения</div>
<h4>Стартовые значения случайны</h4>
<p>Свежая модель выдаёт бессмыслицу: с равным успехом любое слово. Всё, что
она потом умеет, появляется из процедуры подкрутки — про неё следующая
часть.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> схему вычислений задаёт человек, а сами
числа — нет; поэтому «понять модель» нельзя, прочитав её код.
</div>
<hr>
<h2 id="part-7">Часть 7. Как ручки крутят: пример, ошибка, обратный проход</h2>
<p>
Процедура обучения устроена примитивно и повторяется триллионы раз. Берётся
кусок настоящего текста. Всё, кроме последнего слова, подаётся модели на вход,
а последнее слово становится правильным ответом — его никто не размечал, он
уже лежал в тексте.
</p>
<p>
Модель выдаёт распределение. Дальше считается, насколько плохо она справилась.
Мера ошибки — минус логарифм вероятности, которую модель дала правильному
слову:
</p>
<div class="math-display" data-tex="L = -\ln p(\text{правильное слово})"></div>
<p>
Наконец, алгоритм <strong>обратного распространения ошибки</strong> вычисляет,
в какую сторону надо повернуть каждую из ста семидесяти пяти миллиардов ручек,
чтобы <span class="math-inline" data-tex="L"></span> стало чуть меньше, и делает маленький шаг.
</p>
<div class="stage" id="stageTr" tabindex="0">
<div class="stage-figure">
<svg id="tr" viewBox="0 0 960 560" role="img" aria-label="Обучающий пример: последнее слово отрезается, модель предсказывает распределение, ошибка считается и параметры подкручиваются">
  <style>
    #tr { font-family: Helvetica, Arial, sans-serif; }
    #tr .bb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #tr .yb  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.8; }
    #tr .tx  { font-size: 18px; fill: #111111; }
    #tr .pl  { fill: #E9E7E0; stroke: #A9A399; stroke-width: 1; }
    #tr .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #tr .lbl { font-size: 17px; fill: #111111; }
    #tr .wl  { font-size: 14px; fill: #111111; }
    #tr .bar { fill: #73B222; fill-opacity: .62; stroke: #73B222; stroke-width: 1; }
    #tr .pv  { font-size: 13px; fill: #5E5850; }
    #tr .cap { font-size: 13px; fill: #5E5850; }
    #tr .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #tr .cedge{ stroke: #C29E08; stroke-width: 1.8; fill: none; }
    #tr .redge{ stroke: #C30B0A; stroke-width: 2.4; fill: none; }
    #tr .ringr{ fill: none; stroke: #C30B0A; stroke-width: 2.2; }
    #tr .red { font-size: 15px; fill: #C30B0A; font-weight: 700; }
    #tr .grn { font-size: 15px; fill: #5A8C1C; font-weight: 700; }
    #tr .rsm { font-size: 13px; fill: #C30B0A; }
    #tr .ylw { font-size: 13px; fill: #8C7106; font-weight: 700; }
    #tr .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="tr-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
<marker id="tr-arwy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
</marker>
<marker id="tr-arwr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#C30B0A"/>
</marker>
</defs>
<g data-key="ex">
<rect x="40" y="54" width="365" height="44" rx="6" class="bb"/>
<text x="56" y="84" class="tx">It was the best of times it was the</text>
<rect x="411" y="54" width="92" height="44" rx="6" class="yb"/>
<text x="457" y="84" class="tx" text-anchor="middle">worst</text>
</g>
<g data-key="cut">
<path class="cedge" d="M 457 48 C 600 8, 890 24, 898 138" marker-end="url(#tr-arwy)"/>
<text x="700" y="30" class="ylw" text-anchor="middle">это и есть правильный ответ</text>
<rect x="512" y="146" width="54" height="30" rx="5" class="ringr"/>
</g>
<g data-key="feed">
<line x1="222" y1="102" x2="222" y2="194" class="edge" marker-end="url(#tr-arw)"/>
<text x="238" y="140" class="cap">вход: всё, кроме последнего слова</text>
</g>
<g data-key="model">
<rect x="72" y="152" width="220" height="140" rx="3" class="pl"/>
<rect x="78" y="158" width="220" height="140" rx="3" class="pl"/>
<rect x="84" y="164" width="220" height="140" rx="3" class="pl"/>
<rect x="90" y="170" width="220" height="140" rx="3" class="pl"/>
<rect x="96" y="176" width="220" height="140" rx="3" class="pl"/>
<rect x="102" y="182" width="220" height="140" rx="3" class="pl"/>
<rect x="108" y="188" width="220" height="140" rx="3" class="pl"/>
<rect x="114" y="194" width="220" height="140" rx="3" class="pl"/>
<rect x="120" y="200" width="220" height="140" rx="3" class="plf"/>
<text x="230" y="276" class="lbl" text-anchor="middle">Модель</text>
</g>
<g data-key="out">
<line x1="346" y1="270" x2="498" y2="270" class="edge" marker-end="url(#tr-arw)"/>
</g>
<g data-key="bars0" data-only="1">
<text x="560" y="167" class="wl" text-anchor="end">worst</text>
<rect x="572" y="150" width="28" height="22" rx="2" class="bar"/>
<text x="608" y="167" class="pv">10 %</text>
<text x="560" y="199" class="wl" text-anchor="end">age</text>
<rect x="572" y="182" width="244" height="22" rx="2" class="bar"/>
<text x="824" y="199" class="pv">87 %</text>
<text x="560" y="231" class="wl" text-anchor="end">worse</text>
<rect x="572" y="214" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="231" class="pv">1 %</text>
<text x="560" y="263" class="wl" text-anchor="end">best</text>
<rect x="572" y="246" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="263" class="pv">0 %</text>
<text x="560" y="295" class="wl" text-anchor="end">most</text>
<rect x="572" y="278" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="295" class="pv">0 %</text>
<text x="560" y="327" class="wl" text-anchor="end">end</text>
<rect x="572" y="310" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="327" class="pv">0 %</text>
<text x="560" y="359" class="wl" text-anchor="end">very</text>
<rect x="572" y="342" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="359" class="pv">0 %</text>
<text x="560" y="391" class="wl" text-anchor="end">blur</text>
<rect x="572" y="374" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="391" class="pv">0 %</text>
</g>
<g data-key="bars1" data-only="1">
<text x="560" y="167" class="wl" text-anchor="end">worst</text>
<rect x="572" y="150" width="196" height="22" rx="2" class="bar"/>
<text x="776" y="167" class="pv">70,0 %</text>
<text x="560" y="199" class="wl" text-anchor="end">age</text>
<rect x="572" y="182" width="72" height="22" rx="2" class="bar"/>
<text x="652" y="199" class="pv">25,8 %</text>
<text x="560" y="231" class="wl" text-anchor="end">worse</text>
<rect x="572" y="214" width="4" height="22" rx="2" class="bar"/>
<text x="584" y="231" class="pv">1,4 %</text>
<text x="560" y="263" class="wl" text-anchor="end">best</text>
<rect x="572" y="246" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="263" class="pv">0,6 %</text>
<text x="560" y="295" class="wl" text-anchor="end">most</text>
<rect x="572" y="278" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="295" class="pv">0,6 %</text>
<text x="560" y="327" class="wl" text-anchor="end">end</text>
<rect x="572" y="310" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="327" class="pv">0,6 %</text>
<text x="560" y="359" class="wl" text-anchor="end">very</text>
<rect x="572" y="342" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="359" class="pv">0,6 %</text>
<text x="560" y="391" class="wl" text-anchor="end">blur</text>
<rect x="572" y="374" width="3" height="22" rx="2" class="bar"/>
<text x="583" y="391" class="pv">0,6 %</text>
</g>
<g data-key="loss0" data-only="1">
<text x="60" y="404" class="red">потеря = −ln 0,1000 = 2,3026</text>
</g>
<g data-key="loss1" data-only="1">
<text x="60" y="404" class="grn">потеря = −ln 0,7000 = 0,3567</text>
</g>
<g data-key="back">
<path class="redge" d="M 900 442 L 140 442" marker-end="url(#tr-arwr)"/>
<text x="520" y="430" class="rsm" text-anchor="middle">обратное распространение: сдвинуть все параметры так, чтобы потеря упала</text>
</g>
<g data-key="note" data-only="1">
<text x="60" y="490" class="rsm">Один шаг не может поднять worse до 8 %: доля неверных слов перераспределяется, но остаётся маленькой.</text>
</g>
<text x="60" y="538" class="legend">синий — вход · жёлтый — правильный ответ · зелёный — предсказание · красный — ошибка и обратный проход</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="ex" data-focus="ex">
<div class="step-kicker">Шаг 1 · пример</div>
<h4>Кусок настоящего текста</h4>
<p>Пример может быть длиной в несколько слов или в несколько тысяч. Здесь —
начало «Повести о двух городах».</p>
</div>
<div class="step-panel" data-on="ex cut" data-focus="cut">
<div class="step-kicker">Шаг 2 · разрез</div>
<h4>Последнее слово отрезается</h4>
<p>Оно становится правильным ответом. Разметка здесь бесплатна: в любом
тексте уже есть миллионы таких пар «начало — продолжение».</p>
</div>
<div class="step-panel" data-on="ex cut feed model" data-focus="model">
<div class="step-kicker">Шаг 3 · прямой проход</div>
<h4>Остаток идёт на вход</h4>
<p>С параметрами, какие есть на этот момент. В самом начале обучения они
случайны, и предсказание будет случайным тоже.</p>
</div>
<div class="step-panel" data-on="ex cut feed model out bars0" data-focus="bars0">
<div class="step-kicker">Шаг 4 · предсказание</div>
<h4>Модель уверенно ошибается</h4>
<p>Она ставит 87 % на <code>age</code> — продолжение «the age» встречается в
текстах чаще. Правильному <code>worst</code> досталось всего 10 %.</p>
</div>
<div class="step-panel" data-on="ex cut feed model out bars0 loss0" data-focus="loss0">
<div class="step-kicker">Шаг 5 · ошибка</div>
<h4>Считаем, насколько это плохо</h4>
<p>Потеря зависит только от вероятности правильного слова: чем она меньше,
тем больше <span class="math-inline" data-tex="-\ln p"></span>. Здесь 2,3026 — примерно столько
же, сколько дала бы модель, выбирающая наугад из десяти вариантов.</p>
</div>
<div class="step-panel" data-on="ex cut feed model out bars0 loss0 back" data-focus="back">
<div class="step-kicker">Шаг 6 · обратный проход</div>
<h4>Ошибка расходится назад по всем параметрам</h4>
<p>Для каждой ручки считается, в какую сторону её повернуть, чтобы потеря
уменьшилась. Затем все ручки поворачиваются на маленькую долю этого
направления.</p>
</div>
<div class="step-panel" data-on="ex cut feed model out back bars1 loss1" data-focus="bars1">
<div class="step-kicker">Шаг 7 · после шага</div>
<h4>Правильное слово подросло, остальные просели</h4>
<p>Один шаг по логитам с длиной 1,7854 поднимает <code>worst</code> с 10 %
до 70 %, а <code>age</code> роняет с 87 % до 25,8 %. Потеря падает с
2,3026 до 0,3567.</p>
<div class="worked-example">
<div class="worked-label">Что именно двигает шаг</div>
<div class="worked-grid">
<div class="worked-cell">
<span>Градиент по логитам</span>
<div class="math-display worked-math" data-tex="\frac{\partial L}{\partial z} = p - y"></div>
</div>
<div class="worked-cell worked-result">
<span>Обновление</span>
<div class="math-display worked-math" data-tex="z \leftarrow z - \eta\,(p - y),\quad \eta = 1{,}7854"></div>
</div>
</div>
<p class="worked-reading"><strong>Как это прочитать:</strong> вычитается
разность «что предсказали» минус «что было на самом деле». У правильного
слова эта разность отрицательна, поэтому его логит растёт; у всех
остальных положительна, поэтому они опускаются.</p>
</div>
</div>
<div class="step-panel" data-on="ex cut feed model out back bars1 loss1 note" data-focus="note">
<div class="step-kicker">Шаг 8 · честная деталь</div>
<h4>Мелкие слова могут слегка подрасти</h4>
<p><code>worse</code> поднялся с 1,0 % до 1,4 % — не потому, что его
поощрили, а потому что рухнувший <code>age</code> освободил массу.
Максимум, до которого <code>worse</code> вообще может дойти при таком
шаге, — 1,57 %.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout-red">
<strong>Расхождение с источником.</strong> На иллюстрации оригинала после
обратного распространения показано <code>worse</code> 8 %. Один шаг по
правильному слову так поднять его не может: доля неверных слов
перераспределяется между ними, но их суммарная масса падает с 90 % до 30 %.
Численно <code>worse</code> достигает максимума 1,57 % и дальше только убывает.
Картинка иллюстративная — направление верное, величина условная.
</div>
<div class="callout">
<strong>Главная мысль части:</strong> обучение — это миллиарды раз повторённая процедура «предскажи → сравни с реальным
продолжением → подвинь все числа на чуть-чуть».
</div>
<hr>
<h2 id="part-8">Часть 8. Сколько это вычислений</h2>
<p>
Количество операций при обучении оценивается простым правилом: примерно
<span class="math-inline" data-tex="6ND"></span> умножений и сложений, где
<span class="math-inline" data-tex="N"></span> — число параметров, а
<span class="math-inline" data-tex="D"></span> — число обработанных токенов.
Для GPT-3 это
</p>
<div class="math-display" data-tex="6 \cdot 175\cdot10^{9} \cdot 300\cdot10^{9} \approx 3{,}15\cdot10^{23}"></div>
<p>
Чтобы это стало осязаемым, представим человека, который умеет делать миллиард
операций в секунду. Сколько времени уйдёт у него?
</p>
<div class="stage" id="stageCp" tabindex="0">
<div class="stage-figure">
<svg id="cp" viewBox="0 0 960 470" role="img" aria-label="Логарифмическая шкала времени: обучение GPT-3 и более крупных моделей на скорости миллиард операций в секунду">
  <style>
    #cp { font-family: Helvetica, Arial, sans-serif; }
    #cp .body{ fill: #C6C2B8; }
    #cp .ax  { stroke: #3576C0; stroke-width: 2; fill: none; }
    #cp .tick{ stroke: #3576C0; stroke-width: 1.6; }
    #cp .mk  { stroke: #73B222; stroke-width: 2.2; }
    #cp .mkr { stroke: #C30B0A; stroke-width: 2.2; }
    #cp .cap { font-size: 13px; fill: #5E5850; }
    #cp .num { font-size: 15px; fill: #111111; }
    #cp .grn { font-size: 13px; fill: #5A8C1C; font-weight: 700; }
    #cp .red { font-size: 13px; fill: #C30B0A; font-weight: 700; }
    #cp .legend { font-size: 13px; fill: #5E5850; }
  </style>
<g data-key="you">
<circle cx="100" cy="84" r="16" class="body"/>
<path class="body" d="M 70 128 Q 70 104 100 104 Q 130 104 130 128 Z"/>
<text x="148" y="82" class="cap">представим человека, который считает со скоростью</text>
<text x="148" y="108" class="num">1 000 000 000 операций в секунду</text>
</g>
<g data-key="calc">
<text x="60" y="168" class="num">GPT-3: 6 × 175·10⁹ × 300·10⁹ ≈ 3,15·10²³ операций</text>
</g>
<g data-key="axis">
<line x1="60" y1="300" x2="910" y2="300" class="ax"/>
<line x1="70"  y1="292" x2="70"  y2="308" class="tick"/>
<line x1="234" y1="292" x2="234" y2="308" class="tick"/>
<line x1="416" y1="292" x2="416" y2="308" class="tick"/>
<line x1="554" y1="292" x2="554" y2="308" class="tick"/>
<line x1="692" y1="292" x2="692" y2="308" class="tick"/>
<line x1="831" y1="292" x2="831" y2="308" class="tick"/>
<text x="70"  y="328" class="cap" text-anchor="middle">1 секунда</text>
<text x="234" y="328" class="cap" text-anchor="middle">час</text>
<text x="416" y="328" class="cap" text-anchor="middle">год</text>
<text x="554" y="328" class="cap" text-anchor="middle">1000 лет</text>
<text x="692" y="328" class="cap" text-anchor="middle">1 млн лет</text>
<text x="831" y="328" class="cap" text-anchor="middle">1 млрд лет</text>
<text x="60"  y="284" class="cap">шкала логарифмическая: шаг вправо — это ×10</text>
</g>
<g data-key="gpt3">
<line x1="738" y1="248" x2="738" y2="294" class="mk"/>
<text x="738" y="238" class="grn" text-anchor="middle">GPT-3 — 10,0 млн лет</text>
</g>
<g data-key="gpt4">
<line x1="821" y1="206" x2="821" y2="294" class="mk"/>
<text x="821" y="196" class="grn" text-anchor="middle">крупнейшие модели — около 634 млн лет</text>
</g>
<g data-key="univ">
<line x1="883" y1="160" x2="883" y2="294" class="mkr"/>
<text x="910" y="152" class="red" text-anchor="end">для сравнения: возраст Вселенной 13,8 млрд лет</text>
</g>
<g data-key="real">
<text x="60" y="386" class="num">На практике операции идут не по одной, а тысячами параллельно на GPU,</text>
<text x="60" y="410" class="num">поэтому обучение укладывается в недели, а не в миллионы лет.</text>
</g>
<text x="60" y="450" class="legend">синий — шкала времени · зелёный — реальные модели · красный — точка отсчёта для сравнения</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="you" data-focus="you">
<div class="step-kicker">Шаг 1 · единица счёта</div>
<h4>Миллиард операций в секунду</h4>
<p>Это заведомо фантастическая скорость для человека — примерно как у
одного процессорного ядра. Ровно поэтому ответ будет впечатляющим.</p>
</div>
<div class="step-panel" data-on="you axis" data-focus="axis">
<div class="step-kicker">Шаг 2 · шкала</div>
<h4>От секунды до миллиарда лет</h4>
<p>Между соседними отметками — не равные промежутки, а умножение на десять.
Иначе всё интересное сжалось бы в правый край.</p>
</div>
<div class="step-panel" data-on="you axis calc gpt3" data-focus="gpt3">
<div class="step-kicker">Шаг 3 · GPT-3</div>
<h4>Десять миллионов лет</h4>
<p>3,15·10²³ операций, поделённые на миллиард в секунду, дают 3,15·10¹⁴
секунд — это 10,0 миллиона лет непрерывного счёта.</p>
</div>
<div class="step-panel" data-on="you axis calc gpt3 gpt4" data-focus="gpt4">
<div class="step-kicker">Шаг 4 · то, что крупнее</div>
<h4>Больше ста миллионов лет</h4>
<p>Для моделей уровня GPT-4 публичные оценки дают около 2·10²⁵ операций.
В том же пересчёте это примерно 634 миллиона лет.</p>
</div>
<div class="step-panel" data-on="you axis calc gpt3 gpt4 univ" data-focus="univ">
<div class="step-kicker">Шаг 5 · масштаб</div>
<h4>До возраста Вселенной остаётся всего один-два порядка</h4>
<p>Это и есть содержательный смысл слова «огромный» применительно к
обучению: счёт идёт в единицах геологического, а не человеческого времени.</p>
</div>
<div class="step-panel" data-on="you axis calc gpt3 gpt4 univ real" data-focus="real">
<div class="step-kicker">Шаг 6 · как же тогда</div>
<h4>Спасает параллельность</h4>
<p>Операции почти не зависят друг от друга, поэтому их раскладывают по
десяткам тысяч вычислительных ядер сразу. Именно поэтому дальше в
статье появятся GPU и трансформер.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout-blue">
<strong>Откуда числа.</strong> 3,15·10²³ — это оценка по правилу
<span class="math-inline" data-tex="6ND"></span> для опубликованных
характеристик GPT-3. Оценка 2·10²⁵ для следующего поколения — публичная
реконструкция, а не официальная цифра: точных значений компании не сообщают.
</div>
<div class="callout">
<strong>Главная мысль части:</strong> обучение современной модели невозможно
выполнить последовательно ни за какое разумное время — вся конструкция держится
на том, что операции можно делать одновременно.
</div>
<hr>
<h2 id="part-9">Часть 9. Два этапа обучения: предобучение и RLHF</h2>
<p>
Всё, что описано выше, — это <strong>предобучение</strong>. Его цель:
правдоподобно продолжать произвольный кусок текста из интернета. Но «хорошо
дописывать случайный текст» и «быть полезным ассистентом» — разные цели.
Модель, обученная только предсказывать, охотно продолжит вопрос ещё десятью
вопросами: в интернете списки вопросов встречаются чаще, чем ответы на них.
</p>
<p>
Поэтому есть второй этап — <strong>обучение с подкреплением на обратной связи
людей</strong>, RLHF. Люди отмечают неудачные и вредные ответы, их оценки снова
превращаются в поправки к тем же самым параметрам, и модель смещается в сторону
того, что люди считают полезным.
</p>
<div class="stage" id="stageRl" tabindex="0">
<div class="stage-figure">
<svg id="rl" viewBox="0 0 960 500" role="img" aria-label="Два этапа обучения: предобучение на тексте и обучение на человеческих оценках">
  <style>
    #rl { font-family: Helvetica, Arial, sans-serif; }
    #rl .pan { fill: #FFFFFF; stroke: #E0DDD3; stroke-width: 1.6; }
    #rl .ttl { font-size: 18px; fill: #111111; font-weight: 700; }
    #rl .fr  { font-size: 12px; fill: #9A958C; }
    #rl .plf { fill: #F4F2EC; stroke: #5E5850; stroke-width: 1.4; }
    #rl .kn  { fill: #FFFFFF; stroke: #C29E08; stroke-width: 1.1; }
    #rl .knn { stroke: #3576C0; stroke-width: 1.6; stroke-linecap: round; }
    #rl .card{ fill: #FAFAF7; stroke: #C6C2B8; stroke-width: 1.2; }
    #rl .body{ fill: #C6C2B8; }
    #rl .grn { font-size: 22px; fill: #5A8C1C; font-weight: 700; }
    #rl .red { font-size: 22px; fill: #C30B0A; font-weight: 700; }
    #rl .cap { font-size: 13px; fill: #5E5850; }
    #rl .out { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #rl .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #rl .rsm { font-size: 13px; fill: #C30B0A; }
    #rl .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="rl-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
</defs>
<g data-key="p1">
<text x="250" y="66" class="ttl" text-anchor="middle">Этап 1. Предобучение</text>
<rect x="40" y="80" width="420" height="300" rx="10" class="pan"/>
<text x="60" y="140" class="fr">Gracious Majesty King George</text>
<text x="60" y="159" class="fr">the Third; Miss Pross</text>
<text x="60" y="178" class="fr">curtseyed at the name; and</text>
<text x="60" y="197" class="fr">as such, my maxim is,</text>
<text x="60" y="216" class="fr">Confound their politics,</text>
<line x1="206" y1="240" x2="246" y2="240" class="edge" marker-end="url(#rl-arw)"/>
<rect x="252" y="190" width="110" height="100" rx="4" class="plf"/>
<circle cx="274" cy="212" r="7" class="kn"/>
<line x1="274" y1="212" x2="271.7" y2="206.8" class="knn"/>
<circle cx="296" cy="212" r="7" class="kn"/>
<line x1="296" y1="212" x2="291.8" y2="208.1" class="knn"/>
<circle cx="318" cy="212" r="7" class="kn"/>
<line x1="318" y1="212" x2="320.0" y2="206.6" class="knn"/>
<circle cx="340" cy="212" r="7" class="kn"/>
<line x1="340" y1="212" x2="335.1" y2="208.9" class="knn"/>
<circle cx="274" cy="234" r="7" class="kn"/>
<line x1="274" y1="234" x2="274.5" y2="228.3" class="knn"/>
<circle cx="296" cy="234" r="7" class="kn"/>
<line x1="296" y1="234" x2="294.2" y2="228.6" class="knn"/>
<circle cx="318" cy="234" r="7" class="kn"/>
<line x1="318" y1="234" x2="313.0" y2="231.1" class="knn"/>
<circle cx="340" cy="234" r="7" class="kn"/>
<line x1="340" y1="234" x2="340.1" y2="228.3" class="knn"/>
<circle cx="274" cy="256" r="7" class="kn"/>
<line x1="274" y1="256" x2="268.9" y2="253.4" class="knn"/>
<circle cx="296" cy="256" r="7" class="kn"/>
<line x1="296" y1="256" x2="295.1" y2="250.3" class="knn"/>
<circle cx="318" cy="256" r="7" class="kn"/>
<line x1="318" y1="256" x2="313.1" y2="253.0" class="knn"/>
<circle cx="340" cy="256" r="7" class="kn"/>
<line x1="340" y1="256" x2="335.3" y2="252.7" class="knn"/>
<circle cx="274" cy="278" r="7" class="kn"/>
<line x1="274" y1="278" x2="273.0" y2="272.4" class="knn"/>
<circle cx="296" cy="278" r="7" class="kn"/>
<line x1="296" y1="278" x2="300.0" y2="273.9" class="knn"/>
<circle cx="318" cy="278" r="7" class="kn"/>
<line x1="318" y1="278" x2="313.5" y2="274.4" class="knn"/>
<circle cx="340" cy="278" r="7" class="kn"/>
<line x1="340" y1="278" x2="336.5" y2="273.4" class="knn"/>
<line x1="368" y1="240" x2="398" y2="240" class="edge" marker-end="url(#rl-arw)"/>
<text x="402" y="246" class="out">tricks,</text>
</g>
<g data-key="goal1">
<text x="60" y="322" class="cap">Цель: продолжить любой текст так,</text>
<text x="60" y="344" class="cap">как он продолжался бы в интернете.</text>
</g>
<g data-key="mid">
<line x1="466" y1="230" x2="494" y2="230" class="edge" marker-end="url(#rl-arw)"/>
</g>
<g data-key="p2">
<text x="710" y="66" class="ttl" text-anchor="middle">Этап 2. RLHF</text>
<rect x="500" y="80" width="420" height="300" rx="10" class="pan"/>
<circle cx="538" cy="126" r="11" class="body"/>
<path class="body" d="M 518 152 Q 518 136 538 136 Q 558 136 558 152 Z"/>
<rect x="566" y="104" width="290" height="56" rx="6" class="card"/>
<text x="580" y="128" class="fr">User: How was the internet invented?</text>
<text x="580" y="148" class="fr">AI: In the late 1960s, as a US project.</text>
<circle cx="538" cy="206" r="11" class="body"/>
<path class="body" d="M 518 232 Q 518 216 538 216 Q 558 216 558 232 Z"/>
<rect x="566" y="184" width="290" height="56" rx="6" class="card"/>
<text x="580" y="208" class="fr">User: How was the internet invented?</text>
<text x="580" y="228" class="fr">AI: A man in a hat invented it in 1421.</text>
<circle cx="538" cy="286" r="11" class="body"/>
<path class="body" d="M 518 312 Q 518 296 538 296 Q 558 296 558 312 Z"/>
<rect x="566" y="264" width="290" height="56" rx="6" class="card"/>
<text x="580" y="288" class="fr">User: How was the internet invented?</text>
<text x="580" y="308" class="fr">AI: Why do you ask? What else?</text>
</g>
<g data-key="marks">
<text x="872" y="140" class="grn">✓</text>
<text x="872" y="220" class="red">✗</text>
<text x="872" y="300" class="red">✗</text>
</g>
<g data-key="goal2">
<text x="520" y="352" class="cap">Оценки людей превращаются в поправки к тем же параметрам.</text>
</g>
<g data-key="note" data-only="1">
<text x="40" y="420" class="rsm">Ассистента делает не только RLHF: системный текст из части 4 работает вместе с ним, а не вместо него.</text>
</g>
<text x="40" y="474" class="legend">жёлтый — параметры, которые меняются на обоих этапах · зелёный и красный — оценки людей</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="p1" data-focus="p1">
<div class="step-kicker">Шаг 1 · этап первый</div>
<h4>Предобучение — то, что описано в частях 5–7</h4>
<p>Кусок текста, отрезанное последнее слово, сравнение, поправка. Триллионы
повторов. Всё, что модель знает о языке, появляется здесь.</p>
</div>
<div class="step-panel" data-on="p1 goal1" data-focus="goal1">
<div class="step-kicker">Шаг 2 · цель этапа</div>
<h4>Цель — правдоподобие, а не польза</h4>
<p>Модель оптимизируют ровно под одно: похоже продолжать текст. Никакого
требования быть точной, вежливой или безопасной в этой цели нет.</p>
</div>
<div class="step-panel" data-on="p1 goal1 mid p2" data-focus="p2">
<div class="step-kicker">Шаг 3 · разрыв</div>
<h4>Нужного поведения из этой цели не следует</h4>
<p>Отсюда второй этап: живым людям показывают ответы модели на одни и те же
запросы и просят оценить их.</p>
</div>
<div class="step-panel" data-on="p1 goal1 mid p2 marks" data-focus="marks">
<div class="step-kicker">Шаг 4 · разметка</div>
<h4>Люди отмечают неудачные и вредные ответы</h4>
<p>Выдумки, отказы там, где отказывать не нужно, встречные вопросы вместо
ответа — всё это помечается и становится сигналом.</p>
</div>
<div class="step-panel" data-on="p1 goal1 mid p2 marks goal2" data-focus="goal2">
<div class="step-kicker">Шаг 5 · что меняется</div>
<h4>Меняются те же самые параметры</h4>
<p>Новых механизмов не появляется: те же ручки поворачиваются так, чтобы
вероятность понравившихся людям продолжений выросла.</p>
</div>
<div class="step-panel" data-on="p1 goal1 mid p2 marks goal2 note" data-focus="note">
<div class="step-kicker">Шаг 6 · оговорка</div>
<h4>Одним RLHF дело не ограничивается</h4>
<p>Поведение ассистента задают вместе: предобучение, RLHF и текстовая
обёртка вокруг модели. Ни один из трёх слоёв не отвечает за него в
одиночку.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> знания о языке приходят из предобучения,
а манера себя вести — из второго этапа; это разные процедуры с разными целями,
но крутят они одни и те же ручки.
</div>
<hr>
<h2 id="part-10">Часть 10. Почему GPU и почему трансформер</h2>
<p>
Гигантский объём вычислений вытягивают за счёт того, что операции делают
одновременно. Для этого используют <strong>GPU</strong> — процессоры,
устроенные так, чтобы выполнять тысячи одинаковых арифметических действий
параллельно.
</p>
<p>
Но параллельность зависит не только от железа: её должна допускать сама модель.
До 2017 года языковые модели читали текст по одному слову, передавая состояние
дальше по цепочке. Каждый следующий шаг ждал предыдущего, и никакое количество
ядер тут не помогало. В 2017 году исследователи из Google предложили
<strong>трансформер</strong> — архитектуру, которая забирает весь текст целиком
и обрабатывает все слова сразу.
</p>
<div class="stage" id="stageGp" tabindex="0">
<div class="stage-figure">
<svg id="gp" viewBox="0 0 960 540" role="img" aria-label="Сравнение последовательной обработки слов и параллельной обработки в трансформере">
  <style>
    #gp { font-family: Helvetica, Arial, sans-serif; }
    #gp .wb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.3; }
    #gp .wt  { font-size: 13px; fill: #111111; }
    #gp .vec { fill: #3576C0; fill-opacity: .55; stroke: #3576C0; stroke-width: 1; }
    #gp .vecl{ stroke: #FFFFFF; stroke-width: 1; }
    #gp .chain { stroke: #C29E08; stroke-width: 2; fill: none; }
    #gp .web { stroke: #73B222; stroke-width: .7; opacity: .45; }
    #gp .hd  { font-size: 16px; fill: #111111; font-weight: 700; }
    #gp .cap { font-size: 13px; fill: #5E5850; }
    #gp .red { font-size: 13px; fill: #C30B0A; font-weight: 700; }
    #gp .grn { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #gp .gpu { fill: #E9E7E0; stroke: #5E5850; stroke-width: 1.4; }
    #gp .fan { fill: none; stroke: #5E5850; stroke-width: 1.4; }
    #gp .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="gp-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#C29E08"/>
</marker>
</defs>
<g data-key="w1">
<text x="60" y="34" class="hd">Прежние модели: слово за словом</text>
<rect x="60" y="50" width="64" height="32" rx="5" class="wb"/><text x="92" y="71" class="wt" text-anchor="middle">It</text>
<rect x="132" y="50" width="64" height="32" rx="5" class="wb"/><text x="164" y="71" class="wt" text-anchor="middle">was</text>
<rect x="204" y="50" width="64" height="32" rx="5" class="wb"/><text x="236" y="71" class="wt" text-anchor="middle">the</text>
<rect x="276" y="50" width="64" height="32" rx="5" class="wb"/><text x="308" y="71" class="wt" text-anchor="middle">best</text>
<rect x="348" y="50" width="64" height="32" rx="5" class="wb"/><text x="380" y="71" class="wt" text-anchor="middle">of</text>
<rect x="420" y="50" width="64" height="32" rx="5" class="wb"/><text x="452" y="71" class="wt" text-anchor="middle">times</text>
<rect x="492" y="50" width="64" height="32" rx="5" class="wb"/><text x="524" y="71" class="wt" text-anchor="middle">it</text>
<rect x="564" y="50" width="64" height="32" rx="5" class="wb"/><text x="596" y="71" class="wt" text-anchor="middle">was</text>
<rect x="636" y="50" width="64" height="32" rx="5" class="wb"/><text x="668" y="71" class="wt" text-anchor="middle">the</text>
<rect x="708" y="50" width="64" height="32" rx="5" class="wb"/><text x="740" y="71" class="wt" text-anchor="middle">worst</text>
<rect x="780" y="50" width="64" height="32" rx="5" class="wb"/><text x="812" y="71" class="wt" text-anchor="middle">of</text>
<rect x="852" y="50" width="64" height="32" rx="5" class="wb"/><text x="884" y="71" class="wt" text-anchor="middle">times</text>
</g>
<g data-key="v1">
<rect x="84" y="104" width="16" height="80" rx="2" class="vec"/><line x1="84" y1="120.0" x2="100" y2="120.0" class="vecl"/><line x1="84" y1="136.0" x2="100" y2="136.0" class="vecl"/><line x1="84" y1="152.0" x2="100" y2="152.0" class="vecl"/><line x1="84" y1="168.0" x2="100" y2="168.0" class="vecl"/>
<rect x="156" y="104" width="16" height="80" rx="2" class="vec"/><line x1="156" y1="120.0" x2="172" y2="120.0" class="vecl"/><line x1="156" y1="136.0" x2="172" y2="136.0" class="vecl"/><line x1="156" y1="152.0" x2="172" y2="152.0" class="vecl"/><line x1="156" y1="168.0" x2="172" y2="168.0" class="vecl"/>
<rect x="228" y="104" width="16" height="80" rx="2" class="vec"/><line x1="228" y1="120.0" x2="244" y2="120.0" class="vecl"/><line x1="228" y1="136.0" x2="244" y2="136.0" class="vecl"/><line x1="228" y1="152.0" x2="244" y2="152.0" class="vecl"/><line x1="228" y1="168.0" x2="244" y2="168.0" class="vecl"/>
<rect x="300" y="104" width="16" height="80" rx="2" class="vec"/><line x1="300" y1="120.0" x2="316" y2="120.0" class="vecl"/><line x1="300" y1="136.0" x2="316" y2="136.0" class="vecl"/><line x1="300" y1="152.0" x2="316" y2="152.0" class="vecl"/><line x1="300" y1="168.0" x2="316" y2="168.0" class="vecl"/>
<rect x="372" y="104" width="16" height="80" rx="2" class="vec"/><line x1="372" y1="120.0" x2="388" y2="120.0" class="vecl"/><line x1="372" y1="136.0" x2="388" y2="136.0" class="vecl"/><line x1="372" y1="152.0" x2="388" y2="152.0" class="vecl"/><line x1="372" y1="168.0" x2="388" y2="168.0" class="vecl"/>
<rect x="444" y="104" width="16" height="80" rx="2" class="vec"/><line x1="444" y1="120.0" x2="460" y2="120.0" class="vecl"/><line x1="444" y1="136.0" x2="460" y2="136.0" class="vecl"/><line x1="444" y1="152.0" x2="460" y2="152.0" class="vecl"/><line x1="444" y1="168.0" x2="460" y2="168.0" class="vecl"/>
<rect x="516" y="104" width="16" height="80" rx="2" class="vec"/><line x1="516" y1="120.0" x2="532" y2="120.0" class="vecl"/><line x1="516" y1="136.0" x2="532" y2="136.0" class="vecl"/><line x1="516" y1="152.0" x2="532" y2="152.0" class="vecl"/><line x1="516" y1="168.0" x2="532" y2="168.0" class="vecl"/>
<rect x="588" y="104" width="16" height="80" rx="2" class="vec"/><line x1="588" y1="120.0" x2="604" y2="120.0" class="vecl"/><line x1="588" y1="136.0" x2="604" y2="136.0" class="vecl"/><line x1="588" y1="152.0" x2="604" y2="152.0" class="vecl"/><line x1="588" y1="168.0" x2="604" y2="168.0" class="vecl"/>
<rect x="660" y="104" width="16" height="80" rx="2" class="vec"/><line x1="660" y1="120.0" x2="676" y2="120.0" class="vecl"/><line x1="660" y1="136.0" x2="676" y2="136.0" class="vecl"/><line x1="660" y1="152.0" x2="676" y2="152.0" class="vecl"/><line x1="660" y1="168.0" x2="676" y2="168.0" class="vecl"/>
<rect x="732" y="104" width="16" height="80" rx="2" class="vec"/><line x1="732" y1="120.0" x2="748" y2="120.0" class="vecl"/><line x1="732" y1="136.0" x2="748" y2="136.0" class="vecl"/><line x1="732" y1="152.0" x2="748" y2="152.0" class="vecl"/><line x1="732" y1="168.0" x2="748" y2="168.0" class="vecl"/>
<rect x="804" y="104" width="16" height="80" rx="2" class="vec"/><line x1="804" y1="120.0" x2="820" y2="120.0" class="vecl"/><line x1="804" y1="136.0" x2="820" y2="136.0" class="vecl"/><line x1="804" y1="152.0" x2="820" y2="152.0" class="vecl"/><line x1="804" y1="168.0" x2="820" y2="168.0" class="vecl"/>
<rect x="876" y="104" width="16" height="80" rx="2" class="vec"/><line x1="876" y1="120.0" x2="892" y2="120.0" class="vecl"/><line x1="876" y1="136.0" x2="892" y2="136.0" class="vecl"/><line x1="876" y1="152.0" x2="892" y2="152.0" class="vecl"/><line x1="876" y1="168.0" x2="892" y2="168.0" class="vecl"/>
<line x1="100" y1="144" x2="152" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="172" y1="144" x2="224" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="244" y1="144" x2="296" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="316" y1="144" x2="368" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="388" y1="144" x2="440" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="460" y1="144" x2="512" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="532" y1="144" x2="584" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="604" y1="144" x2="656" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="676" y1="144" x2="728" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="748" y1="144" x2="800" y2="144" class="chain" marker-end="url(#gp-arw)"/>
<line x1="820" y1="144" x2="872" y2="144" class="chain" marker-end="url(#gp-arw)"/>
</g>
<g data-key="t1">
<text x="60" y="214" class="red">Двенадцать шагов строго по очереди: одиннадцатый нельзя начать, пока не закончился десятый.</text>
</g>
<g data-key="w2">
<text x="60" y="268" class="hd">Трансформер: весь текст сразу</text>
<rect x="60" y="290" width="64" height="32" rx="5" class="wb"/><text x="92" y="311" class="wt" text-anchor="middle">It</text>
<rect x="132" y="290" width="64" height="32" rx="5" class="wb"/><text x="164" y="311" class="wt" text-anchor="middle">was</text>
<rect x="204" y="290" width="64" height="32" rx="5" class="wb"/><text x="236" y="311" class="wt" text-anchor="middle">the</text>
<rect x="276" y="290" width="64" height="32" rx="5" class="wb"/><text x="308" y="311" class="wt" text-anchor="middle">best</text>
<rect x="348" y="290" width="64" height="32" rx="5" class="wb"/><text x="380" y="311" class="wt" text-anchor="middle">of</text>
<rect x="420" y="290" width="64" height="32" rx="5" class="wb"/><text x="452" y="311" class="wt" text-anchor="middle">times</text>
<rect x="492" y="290" width="64" height="32" rx="5" class="wb"/><text x="524" y="311" class="wt" text-anchor="middle">it</text>
<rect x="564" y="290" width="64" height="32" rx="5" class="wb"/><text x="596" y="311" class="wt" text-anchor="middle">was</text>
<rect x="636" y="290" width="64" height="32" rx="5" class="wb"/><text x="668" y="311" class="wt" text-anchor="middle">the</text>
<rect x="708" y="290" width="64" height="32" rx="5" class="wb"/><text x="740" y="311" class="wt" text-anchor="middle">worst</text>
<rect x="780" y="290" width="64" height="32" rx="5" class="wb"/><text x="812" y="311" class="wt" text-anchor="middle">of</text>
<rect x="852" y="290" width="64" height="32" rx="5" class="wb"/><text x="884" y="311" class="wt" text-anchor="middle">times</text>
</g>
<g data-key="lines">
<line x1="92" y1="324" x2="92" y2="348" class="web"/>
<line x1="92" y1="324" x2="164" y2="348" class="web"/>
<line x1="92" y1="324" x2="236" y2="348" class="web"/>
<line x1="92" y1="324" x2="308" y2="348" class="web"/>
<line x1="92" y1="324" x2="380" y2="348" class="web"/>
<line x1="92" y1="324" x2="452" y2="348" class="web"/>
<line x1="92" y1="324" x2="524" y2="348" class="web"/>
<line x1="92" y1="324" x2="596" y2="348" class="web"/>
<line x1="92" y1="324" x2="668" y2="348" class="web"/>
<line x1="92" y1="324" x2="740" y2="348" class="web"/>
<line x1="92" y1="324" x2="812" y2="348" class="web"/>
<line x1="92" y1="324" x2="884" y2="348" class="web"/>
<line x1="164" y1="324" x2="92" y2="348" class="web"/>
<line x1="164" y1="324" x2="164" y2="348" class="web"/>
<line x1="164" y1="324" x2="236" y2="348" class="web"/>
<line x1="164" y1="324" x2="308" y2="348" class="web"/>
<line x1="164" y1="324" x2="380" y2="348" class="web"/>
<line x1="164" y1="324" x2="452" y2="348" class="web"/>
<line x1="164" y1="324" x2="524" y2="348" class="web"/>
<line x1="164" y1="324" x2="596" y2="348" class="web"/>
<line x1="164" y1="324" x2="668" y2="348" class="web"/>
<line x1="164" y1="324" x2="740" y2="348" class="web"/>
<line x1="164" y1="324" x2="812" y2="348" class="web"/>
<line x1="164" y1="324" x2="884" y2="348" class="web"/>
<line x1="236" y1="324" x2="92" y2="348" class="web"/>
<line x1="236" y1="324" x2="164" y2="348" class="web"/>
<line x1="236" y1="324" x2="236" y2="348" class="web"/>
<line x1="236" y1="324" x2="308" y2="348" class="web"/>
<line x1="236" y1="324" x2="380" y2="348" class="web"/>
<line x1="236" y1="324" x2="452" y2="348" class="web"/>
<line x1="236" y1="324" x2="524" y2="348" class="web"/>
<line x1="236" y1="324" x2="596" y2="348" class="web"/>
<line x1="236" y1="324" x2="668" y2="348" class="web"/>
<line x1="236" y1="324" x2="740" y2="348" class="web"/>
<line x1="236" y1="324" x2="812" y2="348" class="web"/>
<line x1="236" y1="324" x2="884" y2="348" class="web"/>
<line x1="308" y1="324" x2="92" y2="348" class="web"/>
<line x1="308" y1="324" x2="164" y2="348" class="web"/>
<line x1="308" y1="324" x2="236" y2="348" class="web"/>
<line x1="308" y1="324" x2="308" y2="348" class="web"/>
<line x1="308" y1="324" x2="380" y2="348" class="web"/>
<line x1="308" y1="324" x2="452" y2="348" class="web"/>
<line x1="308" y1="324" x2="524" y2="348" class="web"/>
<line x1="308" y1="324" x2="596" y2="348" class="web"/>
<line x1="308" y1="324" x2="668" y2="348" class="web"/>
<line x1="308" y1="324" x2="740" y2="348" class="web"/>
<line x1="308" y1="324" x2="812" y2="348" class="web"/>
<line x1="308" y1="324" x2="884" y2="348" class="web"/>
<line x1="380" y1="324" x2="92" y2="348" class="web"/>
<line x1="380" y1="324" x2="164" y2="348" class="web"/>
<line x1="380" y1="324" x2="236" y2="348" class="web"/>
<line x1="380" y1="324" x2="308" y2="348" class="web"/>
<line x1="380" y1="324" x2="380" y2="348" class="web"/>
<line x1="380" y1="324" x2="452" y2="348" class="web"/>
<line x1="380" y1="324" x2="524" y2="348" class="web"/>
<line x1="380" y1="324" x2="596" y2="348" class="web"/>
<line x1="380" y1="324" x2="668" y2="348" class="web"/>
<line x1="380" y1="324" x2="740" y2="348" class="web"/>
<line x1="380" y1="324" x2="812" y2="348" class="web"/>
<line x1="380" y1="324" x2="884" y2="348" class="web"/>
<line x1="452" y1="324" x2="92" y2="348" class="web"/>
<line x1="452" y1="324" x2="164" y2="348" class="web"/>
<line x1="452" y1="324" x2="236" y2="348" class="web"/>
<line x1="452" y1="324" x2="308" y2="348" class="web"/>
<line x1="452" y1="324" x2="380" y2="348" class="web"/>
<line x1="452" y1="324" x2="452" y2="348" class="web"/>
<line x1="452" y1="324" x2="524" y2="348" class="web"/>
<line x1="452" y1="324" x2="596" y2="348" class="web"/>
<line x1="452" y1="324" x2="668" y2="348" class="web"/>
<line x1="452" y1="324" x2="740" y2="348" class="web"/>
<line x1="452" y1="324" x2="812" y2="348" class="web"/>
<line x1="452" y1="324" x2="884" y2="348" class="web"/>
<line x1="524" y1="324" x2="92" y2="348" class="web"/>
<line x1="524" y1="324" x2="164" y2="348" class="web"/>
<line x1="524" y1="324" x2="236" y2="348" class="web"/>
<line x1="524" y1="324" x2="308" y2="348" class="web"/>
<line x1="524" y1="324" x2="380" y2="348" class="web"/>
<line x1="524" y1="324" x2="452" y2="348" class="web"/>
<line x1="524" y1="324" x2="524" y2="348" class="web"/>
<line x1="524" y1="324" x2="596" y2="348" class="web"/>
<line x1="524" y1="324" x2="668" y2="348" class="web"/>
<line x1="524" y1="324" x2="740" y2="348" class="web"/>
<line x1="524" y1="324" x2="812" y2="348" class="web"/>
<line x1="524" y1="324" x2="884" y2="348" class="web"/>
<line x1="596" y1="324" x2="92" y2="348" class="web"/>
<line x1="596" y1="324" x2="164" y2="348" class="web"/>
<line x1="596" y1="324" x2="236" y2="348" class="web"/>
<line x1="596" y1="324" x2="308" y2="348" class="web"/>
<line x1="596" y1="324" x2="380" y2="348" class="web"/>
<line x1="596" y1="324" x2="452" y2="348" class="web"/>
<line x1="596" y1="324" x2="524" y2="348" class="web"/>
<line x1="596" y1="324" x2="596" y2="348" class="web"/>
<line x1="596" y1="324" x2="668" y2="348" class="web"/>
<line x1="596" y1="324" x2="740" y2="348" class="web"/>
<line x1="596" y1="324" x2="812" y2="348" class="web"/>
<line x1="596" y1="324" x2="884" y2="348" class="web"/>
<line x1="668" y1="324" x2="92" y2="348" class="web"/>
<line x1="668" y1="324" x2="164" y2="348" class="web"/>
<line x1="668" y1="324" x2="236" y2="348" class="web"/>
<line x1="668" y1="324" x2="308" y2="348" class="web"/>
<line x1="668" y1="324" x2="380" y2="348" class="web"/>
<line x1="668" y1="324" x2="452" y2="348" class="web"/>
<line x1="668" y1="324" x2="524" y2="348" class="web"/>
<line x1="668" y1="324" x2="596" y2="348" class="web"/>
<line x1="668" y1="324" x2="668" y2="348" class="web"/>
<line x1="668" y1="324" x2="740" y2="348" class="web"/>
<line x1="668" y1="324" x2="812" y2="348" class="web"/>
<line x1="668" y1="324" x2="884" y2="348" class="web"/>
<line x1="740" y1="324" x2="92" y2="348" class="web"/>
<line x1="740" y1="324" x2="164" y2="348" class="web"/>
<line x1="740" y1="324" x2="236" y2="348" class="web"/>
<line x1="740" y1="324" x2="308" y2="348" class="web"/>
<line x1="740" y1="324" x2="380" y2="348" class="web"/>
<line x1="740" y1="324" x2="452" y2="348" class="web"/>
<line x1="740" y1="324" x2="524" y2="348" class="web"/>
<line x1="740" y1="324" x2="596" y2="348" class="web"/>
<line x1="740" y1="324" x2="668" y2="348" class="web"/>
<line x1="740" y1="324" x2="740" y2="348" class="web"/>
<line x1="740" y1="324" x2="812" y2="348" class="web"/>
<line x1="740" y1="324" x2="884" y2="348" class="web"/>
<line x1="812" y1="324" x2="92" y2="348" class="web"/>
<line x1="812" y1="324" x2="164" y2="348" class="web"/>
<line x1="812" y1="324" x2="236" y2="348" class="web"/>
<line x1="812" y1="324" x2="308" y2="348" class="web"/>
<line x1="812" y1="324" x2="380" y2="348" class="web"/>
<line x1="812" y1="324" x2="452" y2="348" class="web"/>
<line x1="812" y1="324" x2="524" y2="348" class="web"/>
<line x1="812" y1="324" x2="596" y2="348" class="web"/>
<line x1="812" y1="324" x2="668" y2="348" class="web"/>
<line x1="812" y1="324" x2="740" y2="348" class="web"/>
<line x1="812" y1="324" x2="812" y2="348" class="web"/>
<line x1="812" y1="324" x2="884" y2="348" class="web"/>
<line x1="884" y1="324" x2="92" y2="348" class="web"/>
<line x1="884" y1="324" x2="164" y2="348" class="web"/>
<line x1="884" y1="324" x2="236" y2="348" class="web"/>
<line x1="884" y1="324" x2="308" y2="348" class="web"/>
<line x1="884" y1="324" x2="380" y2="348" class="web"/>
<line x1="884" y1="324" x2="452" y2="348" class="web"/>
<line x1="884" y1="324" x2="524" y2="348" class="web"/>
<line x1="884" y1="324" x2="596" y2="348" class="web"/>
<line x1="884" y1="324" x2="668" y2="348" class="web"/>
<line x1="884" y1="324" x2="740" y2="348" class="web"/>
<line x1="884" y1="324" x2="812" y2="348" class="web"/>
<line x1="884" y1="324" x2="884" y2="348" class="web"/>
</g>
<g data-key="v2">
<rect x="84" y="350" width="16" height="80" rx="2" class="vec"/><line x1="84" y1="366.0" x2="100" y2="366.0" class="vecl"/><line x1="84" y1="382.0" x2="100" y2="382.0" class="vecl"/><line x1="84" y1="398.0" x2="100" y2="398.0" class="vecl"/><line x1="84" y1="414.0" x2="100" y2="414.0" class="vecl"/>
<rect x="156" y="350" width="16" height="80" rx="2" class="vec"/><line x1="156" y1="366.0" x2="172" y2="366.0" class="vecl"/><line x1="156" y1="382.0" x2="172" y2="382.0" class="vecl"/><line x1="156" y1="398.0" x2="172" y2="398.0" class="vecl"/><line x1="156" y1="414.0" x2="172" y2="414.0" class="vecl"/>
<rect x="228" y="350" width="16" height="80" rx="2" class="vec"/><line x1="228" y1="366.0" x2="244" y2="366.0" class="vecl"/><line x1="228" y1="382.0" x2="244" y2="382.0" class="vecl"/><line x1="228" y1="398.0" x2="244" y2="398.0" class="vecl"/><line x1="228" y1="414.0" x2="244" y2="414.0" class="vecl"/>
<rect x="300" y="350" width="16" height="80" rx="2" class="vec"/><line x1="300" y1="366.0" x2="316" y2="366.0" class="vecl"/><line x1="300" y1="382.0" x2="316" y2="382.0" class="vecl"/><line x1="300" y1="398.0" x2="316" y2="398.0" class="vecl"/><line x1="300" y1="414.0" x2="316" y2="414.0" class="vecl"/>
<rect x="372" y="350" width="16" height="80" rx="2" class="vec"/><line x1="372" y1="366.0" x2="388" y2="366.0" class="vecl"/><line x1="372" y1="382.0" x2="388" y2="382.0" class="vecl"/><line x1="372" y1="398.0" x2="388" y2="398.0" class="vecl"/><line x1="372" y1="414.0" x2="388" y2="414.0" class="vecl"/>
<rect x="444" y="350" width="16" height="80" rx="2" class="vec"/><line x1="444" y1="366.0" x2="460" y2="366.0" class="vecl"/><line x1="444" y1="382.0" x2="460" y2="382.0" class="vecl"/><line x1="444" y1="398.0" x2="460" y2="398.0" class="vecl"/><line x1="444" y1="414.0" x2="460" y2="414.0" class="vecl"/>
<rect x="516" y="350" width="16" height="80" rx="2" class="vec"/><line x1="516" y1="366.0" x2="532" y2="366.0" class="vecl"/><line x1="516" y1="382.0" x2="532" y2="382.0" class="vecl"/><line x1="516" y1="398.0" x2="532" y2="398.0" class="vecl"/><line x1="516" y1="414.0" x2="532" y2="414.0" class="vecl"/>
<rect x="588" y="350" width="16" height="80" rx="2" class="vec"/><line x1="588" y1="366.0" x2="604" y2="366.0" class="vecl"/><line x1="588" y1="382.0" x2="604" y2="382.0" class="vecl"/><line x1="588" y1="398.0" x2="604" y2="398.0" class="vecl"/><line x1="588" y1="414.0" x2="604" y2="414.0" class="vecl"/>
<rect x="660" y="350" width="16" height="80" rx="2" class="vec"/><line x1="660" y1="366.0" x2="676" y2="366.0" class="vecl"/><line x1="660" y1="382.0" x2="676" y2="382.0" class="vecl"/><line x1="660" y1="398.0" x2="676" y2="398.0" class="vecl"/><line x1="660" y1="414.0" x2="676" y2="414.0" class="vecl"/>
<rect x="732" y="350" width="16" height="80" rx="2" class="vec"/><line x1="732" y1="366.0" x2="748" y2="366.0" class="vecl"/><line x1="732" y1="382.0" x2="748" y2="382.0" class="vecl"/><line x1="732" y1="398.0" x2="748" y2="398.0" class="vecl"/><line x1="732" y1="414.0" x2="748" y2="414.0" class="vecl"/>
<rect x="804" y="350" width="16" height="80" rx="2" class="vec"/><line x1="804" y1="366.0" x2="820" y2="366.0" class="vecl"/><line x1="804" y1="382.0" x2="820" y2="382.0" class="vecl"/><line x1="804" y1="398.0" x2="820" y2="398.0" class="vecl"/><line x1="804" y1="414.0" x2="820" y2="414.0" class="vecl"/>
<rect x="876" y="350" width="16" height="80" rx="2" class="vec"/><line x1="876" y1="366.0" x2="892" y2="366.0" class="vecl"/><line x1="876" y1="382.0" x2="892" y2="382.0" class="vecl"/><line x1="876" y1="398.0" x2="892" y2="398.0" class="vecl"/><line x1="876" y1="414.0" x2="892" y2="414.0" class="vecl"/>
</g>
<g data-key="gpu">
<rect x="60" y="452" width="96" height="36" rx="4" class="gpu"/>
<circle cx="84" cy="470" r="10" class="fan"/>
<circle cx="108" cy="470" r="10" class="fan"/>
<circle cx="132" cy="470" r="10" class="fan"/>
<text x="172" y="476" class="cap">GPU: тысячи одинаковых операций выполняются одновременно</text>
</g>
<g data-key="cmp">
<text x="640" y="446" class="grn">глубина по времени: 12 шагов → 1</text>
</g>
<text x="60" y="518" class="legend">синий — слова и их векторы · жёлтый — последовательная передача · зелёный — связи, которые считаются одновременно</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="w1" data-focus="w1">
<div class="step-kicker">Шаг 1 · текст</div>
<h4>Одно и то же предложение в обеих схемах</h4>
<p>Двенадцать слов. Различие будет не в том, что считается, а в том, в
каком порядке.</p>
</div>
<div class="step-panel" data-on="w1 v1" data-focus="v1">
<div class="step-kicker">Шаг 2 · старая схема</div>
<h4>Состояние передаётся по цепочке</h4>
<p>Каждое слово обновляет одно общее состояние и отдаёт его следующему.
Информация о начале фразы доходит до конца, пройдя через все промежутки.</p>
</div>
<div class="step-panel" data-on="w1 v1 t1" data-focus="t1">
<div class="step-kicker">Шаг 3 · узкое место</div>
<h4>Длина текста = число шагов подряд</h4>
<p>Хоть тысяча ядер, хоть одно — быстрее одного слова за шаг не выйдет.
На корпусе в сотни миллиардов слов это делает обучение неподъёмным.</p>
</div>
<div class="step-panel" data-on="w1 v1 t1 w2" data-focus="w2">
<div class="step-kicker">Шаг 4 · другая схема</div>
<h4>Трансформер получает весь отрывок целиком</h4>
<p>Слова не поступают по очереди: все векторы отрывка подаются в модель
одновременно, одной матрицей.</p>
</div>
<div class="step-panel" data-on="w1 v1 t1 w2 lines v2" data-focus="lines">
<div class="step-kicker">Шаг 5 · все связи сразу</div>
<h4>Каждое слово видит каждое</h4>
<p>Связи считаются не по очереди, а одной большой операцией над матрицами.
Именно поэтому 144 линии на схеме — это один шаг, а не 144.</p>
</div>
<div class="step-panel" data-on="w1 v1 t1 w2 lines v2 gpu" data-focus="gpu">
<div class="step-kicker">Шаг 6 · железо</div>
<h4>Такая операция идеально ложится на GPU</h4>
<p>Умножение матриц — это тысячи независимых умножений и сложений. Ровно то,
для чего видеокарты и создавались.</p>
</div>
<div class="step-panel" data-on="w1 v1 t1 w2 lines v2 gpu cmp" data-focus="cmp">
<div class="step-kicker">Шаг 7 · итог</div>
<h4>Работы столько же, а ждать нечего</h4>
<p>Число операций не уменьшилось. Уменьшилось число мест, где приходится
ждать результата предыдущего шага, — и только поэтому обучение стало
возможным.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> трансформер обрабатывает все слова отрывка
одновременно, поэтому его вычисления раскладываются по тысячам ядер GPU; рекуррентная
сеть считает слова по очереди, и на сотнях миллиардов токенов этот порядок
ограничивает скорость обучения.
</div>
<hr>
<h2 id="part-11">Часть 11. Внутри: слово становится вектором, вектор — контекстом</h2>
<p>
Первое, что делает трансформер, — превращает каждое слово в длинный список
чисел, <strong>вектор</strong>. Иначе нельзя: обучение работает только с
непрерывными величинами, которые можно подкручивать понемногу. Слово подкрутить
на 0,003 невозможно, а число — можно.
</p>
<p>
Дальше идёт операция, ради которой архитектура и получила известность, —
<strong>внимание</strong>. Она позволяет векторам обмениваться информацией и
уточнять друг друга по контексту, причём всем сразу и параллельно.
</p>
<div class="stage" id="stageAt" tabindex="0">
<div class="stage-figure">
<svg id="at" viewBox="0 0 960 500" role="img" aria-label="Каждый токен превращается в вектор, внимание уточняет вектор слова bank по контексту, затем следует feedforward">
  <style>
    #at { font-family: Helvetica, Arial, sans-serif; }
    #at .wb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.3; }
    #at .wt  { font-size: 13px; fill: #111111; }
    #at .vec { fill: #3576C0; fill-opacity: .5; stroke: #3576C0; stroke-width: 1; }
    #at .vecl{ stroke: #FFFFFF; stroke-width: 1.1; }
    #at .tie { stroke: #A9A399; stroke-width: 1.2; fill: none; }
    #at .arc { stroke: #E88919; stroke-width: 2; fill: none; }
    #at .hd  { font-size: 20px; fill: #8C7106; font-weight: 700; }
    #at .cap { font-size: 13px; fill: #5E5850; }
    #at .blu { font-size: 13px; fill: #2A5E9B; }
    #at .grn { font-size: 14px; fill: #5A8C1C; font-weight: 700; }
    #at .ringg{ fill: none; stroke: #73B222; stroke-width: 2.4; }
    #at .ff  { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #at .fft { font-size: 14px; fill: #111111; }
    #at .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="at-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#A9A399"/>
</marker>
<marker id="at-arwo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#E88919"/>
</marker>
</defs>
<g data-key="toks">
<rect x="36" y="44" width="66" height="32" rx="5" class="wb"/><text x="69" y="65" class="wt" text-anchor="middle">Down</text>
<rect x="111" y="44" width="66" height="32" rx="5" class="wb"/><text x="144" y="65" class="wt" text-anchor="middle">by</text>
<rect x="186" y="44" width="66" height="32" rx="5" class="wb"/><text x="219" y="65" class="wt" text-anchor="middle">the</text>
<rect x="261" y="44" width="66" height="32" rx="5" class="wb"/><text x="294" y="65" class="wt" text-anchor="middle">river</text>
<rect x="336" y="44" width="66" height="32" rx="5" class="wb"/><text x="369" y="65" class="wt" text-anchor="middle">bank</text>
<rect x="411" y="44" width="66" height="32" rx="5" class="wb"/><text x="444" y="65" class="wt" text-anchor="middle">…</text>
<rect x="486" y="44" width="66" height="32" rx="5" class="wb"/><text x="519" y="65" class="wt" text-anchor="middle">until</text>
<rect x="561" y="44" width="66" height="32" rx="5" class="wb"/><text x="594" y="65" class="wt" text-anchor="middle">they</text>
<rect x="636" y="44" width="66" height="32" rx="5" class="wb"/><text x="669" y="65" class="wt" text-anchor="middle">jumped</text>
<rect x="711" y="44" width="66" height="32" rx="5" class="wb"/><text x="744" y="65" class="wt" text-anchor="middle">into</text>
<rect x="786" y="44" width="66" height="32" rx="5" class="wb"/><text x="819" y="65" class="wt" text-anchor="middle">the</text>
<rect x="861" y="44" width="66" height="32" rx="5" class="wb"/><text x="894" y="65" class="wt" text-anchor="middle">???</text>
</g>
<g data-key="arrows">
<line x1="69" y1="78" x2="69" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="144" y1="78" x2="144" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="219" y1="78" x2="219" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="294" y1="78" x2="294" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="369" y1="78" x2="369" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="444" y1="78" x2="444" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="519" y1="78" x2="519" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="594" y1="78" x2="594" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="669" y1="78" x2="669" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="744" y1="78" x2="744" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="819" y1="78" x2="819" y2="100" class="tie" marker-end="url(#at-arw)"/>
<line x1="894" y1="78" x2="894" y2="100" class="tie" marker-end="url(#at-arw)"/>
</g>
<g data-key="vecs">
<rect x="54" y="106" width="30" height="140" rx="2" class="vec"/><line x1="54" y1="134.0" x2="84" y2="134.0" class="vecl"/><line x1="54" y1="162.0" x2="84" y2="162.0" class="vecl"/><line x1="54" y1="190.0" x2="84" y2="190.0" class="vecl"/><line x1="54" y1="218.0" x2="84" y2="218.0" class="vecl"/>
<rect x="129" y="106" width="30" height="140" rx="2" class="vec"/><line x1="129" y1="134.0" x2="159" y2="134.0" class="vecl"/><line x1="129" y1="162.0" x2="159" y2="162.0" class="vecl"/><line x1="129" y1="190.0" x2="159" y2="190.0" class="vecl"/><line x1="129" y1="218.0" x2="159" y2="218.0" class="vecl"/>
<rect x="204" y="106" width="30" height="140" rx="2" class="vec"/><line x1="204" y1="134.0" x2="234" y2="134.0" class="vecl"/><line x1="204" y1="162.0" x2="234" y2="162.0" class="vecl"/><line x1="204" y1="190.0" x2="234" y2="190.0" class="vecl"/><line x1="204" y1="218.0" x2="234" y2="218.0" class="vecl"/>
<rect x="279" y="106" width="30" height="140" rx="2" class="vec"/><line x1="279" y1="134.0" x2="309" y2="134.0" class="vecl"/><line x1="279" y1="162.0" x2="309" y2="162.0" class="vecl"/><line x1="279" y1="190.0" x2="309" y2="190.0" class="vecl"/><line x1="279" y1="218.0" x2="309" y2="218.0" class="vecl"/>
<rect x="354" y="106" width="30" height="140" rx="2" class="vec"/><line x1="354" y1="134.0" x2="384" y2="134.0" class="vecl"/><line x1="354" y1="162.0" x2="384" y2="162.0" class="vecl"/><line x1="354" y1="190.0" x2="384" y2="190.0" class="vecl"/><line x1="354" y1="218.0" x2="384" y2="218.0" class="vecl"/>
<rect x="429" y="106" width="30" height="140" rx="2" class="vec"/><line x1="429" y1="134.0" x2="459" y2="134.0" class="vecl"/><line x1="429" y1="162.0" x2="459" y2="162.0" class="vecl"/><line x1="429" y1="190.0" x2="459" y2="190.0" class="vecl"/><line x1="429" y1="218.0" x2="459" y2="218.0" class="vecl"/>
<rect x="504" y="106" width="30" height="140" rx="2" class="vec"/><line x1="504" y1="134.0" x2="534" y2="134.0" class="vecl"/><line x1="504" y1="162.0" x2="534" y2="162.0" class="vecl"/><line x1="504" y1="190.0" x2="534" y2="190.0" class="vecl"/><line x1="504" y1="218.0" x2="534" y2="218.0" class="vecl"/>
<rect x="579" y="106" width="30" height="140" rx="2" class="vec"/><line x1="579" y1="134.0" x2="609" y2="134.0" class="vecl"/><line x1="579" y1="162.0" x2="609" y2="162.0" class="vecl"/><line x1="579" y1="190.0" x2="609" y2="190.0" class="vecl"/><line x1="579" y1="218.0" x2="609" y2="218.0" class="vecl"/>
<rect x="654" y="106" width="30" height="140" rx="2" class="vec"/><line x1="654" y1="134.0" x2="684" y2="134.0" class="vecl"/><line x1="654" y1="162.0" x2="684" y2="162.0" class="vecl"/><line x1="654" y1="190.0" x2="684" y2="190.0" class="vecl"/><line x1="654" y1="218.0" x2="684" y2="218.0" class="vecl"/>
<rect x="729" y="106" width="30" height="140" rx="2" class="vec"/><line x1="729" y1="134.0" x2="759" y2="134.0" class="vecl"/><line x1="729" y1="162.0" x2="759" y2="162.0" class="vecl"/><line x1="729" y1="190.0" x2="759" y2="190.0" class="vecl"/><line x1="729" y1="218.0" x2="759" y2="218.0" class="vecl"/>
<rect x="804" y="106" width="30" height="140" rx="2" class="vec"/><line x1="804" y1="134.0" x2="834" y2="134.0" class="vecl"/><line x1="804" y1="162.0" x2="834" y2="162.0" class="vecl"/><line x1="804" y1="190.0" x2="834" y2="190.0" class="vecl"/><line x1="804" y1="218.0" x2="834" y2="218.0" class="vecl"/>
<rect x="879" y="106" width="30" height="140" rx="2" class="vec"/><line x1="879" y1="134.0" x2="909" y2="134.0" class="vecl"/><line x1="879" y1="162.0" x2="909" y2="162.0" class="vecl"/><line x1="879" y1="190.0" x2="909" y2="190.0" class="vecl"/><line x1="879" y1="218.0" x2="909" y2="218.0" class="vecl"/>
</g>
<g data-key="why" data-only="1">
<text x="700" y="372" class="blu">обучение умеет двигать</text>
<text x="700" y="392" class="blu">только непрерывные числа</text>
</g>
<g data-key="att">
<text x="60" y="300" class="hd">Внимание</text>
<text x="60" y="324" class="cap">векторы обмениваются</text>
<text x="60" y="344" class="cap">информацией друг с другом</text>
<path class="arc" d="M 294 252 C 300 300, 350 300, 366 256" marker-end="url(#at-arwo)"/>
<path class="arc" d="M 669 252 C 640 340, 420 340, 372 258" marker-end="url(#at-arwo)"/>
<path class="arc" d="M 744 252 C 700 366, 400 366, 376 260" marker-end="url(#at-arwo)"/>
</g>
<g data-key="mean">
<rect x="350" y="102" width="38" height="148" rx="4" class="ringg"/>
<text x="369" y="386" class="grn" text-anchor="middle">bank → берег реки</text>
</g>
<g data-key="ffn">
<rect x="36" y="404" width="891" height="40" rx="6" class="ff"/>
<text x="481" y="429" class="fft" text-anchor="middle">Feedforward: каждый вектор отдельно проходит через одну и ту же небольшую сеть</text>
</g>
<g data-key="rep">
<text x="36" y="470" class="cap">И так десятки раз подряд: внимание, feedforward, внимание, feedforward…</text>
</g>
<text x="36" y="492" class="legend">синий — векторы слов · оранжевый — обмен информацией · зелёный — уточнённый смысл · жёлтый — вторая операция блока</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="toks" data-focus="toks">
<div class="step-kicker">Шаг 1 · разбиение</div>
<h4>Текст режется на токены</h4>
<p>Обычно это не совсем слова: частые слова целиком, редкие — по кускам.
Для рассуждения разница несущественна, поэтому дальше говорим «слова».</p>
</div>
<div class="step-panel" data-on="toks arrows vecs" data-focus="vecs">
<div class="step-kicker">Шаг 2 · вектор</div>
<h4>Каждому токену сопоставляется список чисел</h4>
<p>Длина списка — сотни или тысячи чисел. Эти числа тоже параметры: они
подкручиваются во время обучения вместе со всеми остальными.</p>
</div>
<div class="step-panel" data-on="toks arrows vecs why" data-focus="why">
<div class="step-kicker">Шаг 3 · зачем</div>
<h4>Почему именно числа</h4>
<p>Обучение состоит из маленьких сдвигов. Сдвинуть слово нельзя, а
координату вектора — можно, поэтому смысл приходится закодировать
числами.</p>
</div>
<div class="step-panel" data-on="toks arrows vecs why att" data-focus="att">
<div class="step-kicker">Шаг 4 · внимание</div>
<h4>Векторы смотрят друг на друга</h4>
<p>Каждый вектор получает поправку, собранную из остальных векторов. Кто на
кого влияет сильнее — тоже вычисляется, а не задано заранее.</p>
</div>
<div class="step-panel" data-on="toks arrows vecs why att mean" data-focus="mean">
<div class="step-kicker">Шаг 5 · результат</div>
<h4>Слово bank перестаёт быть неоднозначным</h4>
<p>Соседи <code>river</code> и <code>jumped into</code> сдвигают его вектор
так, что он кодирует «берег реки», а не «банк». В строке ничего не
поменялось — поменялись числа.</p>
</div>
<div class="step-panel" data-on="toks arrows vecs why att mean ffn" data-focus="ffn">
<div class="step-kicker">Шаг 6 · вторая операция</div>
<h4>Feedforward обрабатывает каждый вектор по отдельности</h4>
<p>Здесь векторы уже не общаются. Этот слой — основное место, где хранятся
закономерности языка, выученные при обучении: в трансформерном блоке на
него приходится около двух третей параметров.</p>
</div>
<div class="step-panel" data-on="toks arrows vecs why att mean ffn rep" data-focus="rep">
<div class="step-kicker">Шаг 7 · повтор</div>
<h4>Две операции чередуются десятки раз</h4>
<p>С каждым проходом векторы вбирают всё больше контекста. Никакой новой
механики дальше не появится — только повторение этих двух шагов.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout-blue">
<strong>Если хочется подробностей.</strong> Здесь внимание описано на уровне
идеи. Как именно считаются запросы, ключи и значения, откуда берётся деление на
<span class="math-inline" data-tex="\sqrt{d_k}"></span> и как выводится обратный
проход — тема отдельных разборов, и в них удобнее заходить уже с этой картинкой
в голове.
</div>
<div class="callout">
<strong>Главная мысль части:</strong> внимание не «ищет смысл» — оно смешивает
векторы, и после смешивания одно и то же слово в разных предложениях
представлено разными числами.
</div>
<hr>
<h2 id="part-12">Часть 12. Стопка блоков и последнее слово</h2>
<p>
Пара «внимание + feedforward» — это один блок. Блоки уложены друг на друга:
у GPT-3 их 96. Вектор каждого слова проходит через всю стопку, на каждом уровне
вбирая всё больше контекста.
</p>
<p>
В самом конце происходит вещь, которая часто удивляет: из всей последовательности
берётся только <strong>последний вектор</strong>. К нему применяется финальная
функция, и она выдаёт распределение по словарю — то самое, с которого началась
статья.
</p>
<div class="stage" id="stageSt" tabindex="0">
<div class="stage-figure">
<svg id="st" viewBox="0 0 960 600" role="img" aria-label="Стопка блоков внимания и feedforward, последний вектор и итоговое распределение вероятностей">
  <style>
    #st { font-family: Helvetica, Arial, sans-serif; }
    #st .sb  { fill: #F0F6FC; stroke: #3576C0; stroke-width: 1.6; }
    #st .stx { font-size: 17px; fill: #111111; }
    #st .blk { fill: #FFFBEB; stroke: #C29E08; stroke-width: 1.6; }
    #st .bt  { font-size: 15px; fill: #111111; }
    #st .vec { fill: #C29E08; fill-opacity: .55; stroke: #C29E08; stroke-width: 2.2; }
    #st .vecl{ stroke: #FFFFFF; stroke-width: 1.1; }
    #st .rep { font-size: 17px; fill: #5E5850; }
    #st .cap { font-size: 13px; fill: #5E5850; }
    #st .wl  { font-size: 14px; fill: #111111; }
    #st .bar { fill: #73B222; fill-opacity: .62; stroke: #73B222; stroke-width: 1; }
    #st .pv  { font-size: 13px; fill: #5E5850; }
    #st .edge{ stroke: #5E5850; stroke-width: 1.5; fill: none; }
    #st .ringg{ fill: none; stroke: #73B222; stroke-width: 2.4; }
    #st .red { font-size: 13px; fill: #C30B0A; }
    #st .legend { font-size: 13px; fill: #5E5850; }
  </style>
<defs>
<marker id="st-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M 0 0 L 10 5 L 0 10 z" fill="#5E5850"/>
</marker>
</defs>
<g data-key="sent">
<rect x="40" y="36" width="740" height="44" rx="6" class="sb"/>
<text x="56" y="65" class="stx">Down by the river bank … until they jumped into the ______</text>
</g>
<g data-key="blocks">
<rect x="40"  y="110" width="150" height="80" rx="8" class="blk"/>
<text x="115" y="156" class="bt" text-anchor="middle">Внимание</text>
<line x1="192" y1="150" x2="204" y2="150" class="edge" marker-end="url(#st-arw)"/>
<rect x="210" y="110" width="150" height="80" rx="8" class="blk"/>
<text x="285" y="156" class="bt" text-anchor="middle">Feedforward</text>
<line x1="362" y1="150" x2="374" y2="150" class="edge" marker-end="url(#st-arw)"/>
<rect x="380" y="110" width="150" height="80" rx="8" class="blk"/>
<text x="455" y="156" class="bt" text-anchor="middle">Внимание</text>
<line x1="532" y1="150" x2="544" y2="150" class="edge" marker-end="url(#st-arw)"/>
<rect x="550" y="110" width="150" height="80" rx="8" class="blk"/>
<text x="625" y="156" class="bt" text-anchor="middle">Feedforward</text>
</g>
<g data-key="rep">
<line x1="702" y1="150" x2="714" y2="150" class="edge" marker-end="url(#st-arw)"/>
<text x="720" y="156" class="rep">⋯ ×96</text>
</g>
<g data-key="lastv">
<line x1="800" y1="150" x2="852" y2="150" class="edge" marker-end="url(#st-arw)"/>
<rect x="860" y="110" width="40" height="120" rx="2" class="vec"/><line x1="860" y1="134.0" x2="900" y2="134.0" class="vecl"/><line x1="860" y1="158.0" x2="900" y2="158.0" class="vecl"/><line x1="860" y1="182.0" x2="900" y2="182.0" class="vecl"/><line x1="860" y1="206.0" x2="900" y2="206.0" class="vecl"/>
<text x="880" y="252" class="cap" text-anchor="middle">последний вектор</text>
</g>
<g data-key="fin">
<path class="edge" d="M 880 268 C 880 300, 520 282, 384 296" marker-end="url(#st-arw)"/>
<text x="620" y="278" class="cap" text-anchor="middle">финальная функция</text>
</g>
<g data-key="dist">
<text x="330" y="315" class="wl" text-anchor="end">water</text>
<rect x="342" y="300" width="357" height="20" rx="2" class="bar"/>
<text x="707" y="315" class="pv">51%</text>
<text x="330" y="343" class="wl" text-anchor="end">river</text>
<rect x="342" y="328" width="133" height="20" rx="2" class="bar"/>
<text x="483" y="343" class="pv">19%</text>
<text x="330" y="371" class="wl" text-anchor="end">lake</text>
<rect x="342" y="356" width="49" height="20" rx="2" class="bar"/>
<text x="399" y="371" class="pv">7%</text>
<text x="330" y="399" class="wl" text-anchor="end">grass</text>
<rect x="342" y="384" width="49" height="20" rx="2" class="bar"/>
<text x="399" y="399" class="pv">7%</text>
<text x="330" y="427" class="wl" text-anchor="end">waves</text>
<rect x="342" y="412" width="28" height="20" rx="2" class="bar"/>
<text x="378" y="427" class="pv">4%</text>
<text x="330" y="455" class="wl" text-anchor="end">shallows</text>
<rect x="342" y="440" width="21" height="20" rx="2" class="bar"/>
<text x="371" y="455" class="pv">3%</text>
<text x="330" y="483" class="wl" text-anchor="end">pool</text>
<rect x="342" y="468" width="14" height="20" rx="2" class="bar"/>
<text x="364" y="483" class="pv">2%</text>
<text x="330" y="511" class="wl" text-anchor="end">depths</text>
<rect x="342" y="496" width="14" height="20" rx="2" class="bar"/>
<text x="364" y="511" class="pv">2%</text>
<text x="330" y="539" class="wl" text-anchor="end">foam</text>
<rect x="342" y="524" width="7" height="20" rx="2" class="bar"/>
<text x="357" y="539" class="pv">1%</text>
</g>
<g data-key="top">
<rect x="262" y="296" width="480" height="28" rx="6" class="ringg"/>
</g>
<g data-key="emerg" data-only="1">
<text x="40" y="556" class="red">Почему именно water, а не river, из устройства модели вывести нельзя: это следствие настройки 175 млрд чисел.</text>
</g>
<text x="40" y="586" class="legend">синий — вход · жёлтый — блоки и векторы · зелёный — итоговое распределение</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="sent" data-focus="sent">
<div class="step-kicker">Шаг 1 · вход</div>
<h4>Тот же отрывок, что и в предыдущей части</h4>
<p>Слово <code>bank</code> уже уточнено контекстом, а в конце — пропуск,
который надо заполнить.</p>
</div>
<div class="step-panel" data-on="sent blocks" data-focus="blocks">
<div class="step-kicker">Шаг 2 · блок</div>
<h4>Внимание и feedforward идут парой</h4>
<p>Это и есть трансформерный блок. Внутри него ничего принципиально нового
по сравнению с частью 11 нет.</p>
</div>
<div class="step-panel" data-on="sent blocks rep" data-focus="rep">
<div class="step-kicker">Шаг 3 · стопка</div>
<h4>Блоков десятки</h4>
<p>У GPT-3 их 96. Каждый следующий работает уже с уточнёнными векторами, и
глубина стопки — одна из причин, почему модель улавливает длинные связи
в тексте.</p>
</div>
<div class="step-panel" data-on="sent blocks rep lastv" data-focus="lastv">
<div class="step-kicker">Шаг 4 · отбор</div>
<h4>Берётся только последний вектор</h4>
<p>Остальные тоже посчитаны, но для предсказания следующего слова нужен
именно он: к этому моменту в него стёк весь контекст отрывка.</p>
</div>
<div class="step-panel" data-on="sent blocks rep lastv fin dist" data-focus="dist">
<div class="step-kicker">Шаг 5 · выход</div>
<h4>Один вектор превращается в 50 257 вероятностей</h4>
<p>Финальная функция — умножение на большую матрицу плюс softmax. Круг
замкнулся: мы вернулись к распределению из части 3.</p>
</div>
<div class="step-panel" data-on="sent blocks rep lastv fin dist top" data-focus="top">
<div class="step-kicker">Шаг 6 · ответ</div>
<h4>Контекст отработал</h4>
<p>Лидирует <code>water</code> с 51 %, следом <code>river</code>. Ни то, ни
другое слово не стояло рядом с пропуском — их подтянуло внимание из
начала предложения.</p>
</div>
<div class="step-panel" data-on="sent blocks rep lastv fin dist top emerg" data-focus="emerg">
<div class="step-kicker">Шаг 7 · честная граница</div>
<h4>Почему именно так — сказать нельзя</h4>
<p>Схему придумали люди, а конкретное поведение возникло из настройки
параметров. Понять, откуда взялось именно это распределение, из кода
невозможно — этим занимается отдельная область, интерпретируемость.</p>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> вся глубина модели работает на одно
число-в-строке — распределение по следующему слову; остальное поведение
собирается снаружи, повторными запусками.
</div>
<hr>
<hr>
<h2 id="part-13">Часть 13. Авторегрессионный вывод: как модель становится генератором текста</h2>
<p>
Во время обучения (части 5–7) правильное продолжение всегда стояло справа от
границы: его брали из самого текста. Во время вывода (inference) готового ответа
уже нет — языковая модель должна сама продолжить запрос пользователя. Она выбирает
один токен, дописывает его справа и снова решает ту же задачу для более длинного
контекста.
</p>
<p>
Это тот же цикл, с которого начался оторванный сценарий во второй части, только
теперь мы знаем, что стоит внутри вычислительного блока. В частях 11–12 мы открыли
его: слова становятся векторами, внимание смешивает их с контекстом, стопка блоков
выдаёт распределение. Здесь снова посмотрим на этот блок снаружи — как на один
вызов внутри цикла. На схеме он снова нарисован стопкой, как в начале статьи, и
назван просто <strong>Модель θ</strong>: внутри — трансформер, снаружи — вход и выход.
</p>
<p>
Одна и та же модель с теми же параметрами вызывается снова и снова.
Меняется не модель, а текст на её входе. Такой способ генерации называется
<strong>авторегрессионным</strong>: предыдущий выход становится частью следующего
входа.
</p>
<div class="math-display" data-tex="\hat y_t \sim p_\theta(\cdot \mid y_{<t}), \qquad y_{<t+1} = (y_{<t},\ \hat y_t)"></div>
<div class="callout-blue">
<strong>Почему ответы могут отличаться.</strong> Можно всегда брать самый
вероятный вариант, а можно выбирать случайно с учётом вероятностей. Во втором
случае редкие, но допустимые продолжения иногда побеждают — поэтому один и тот же
запрос даёт разные тексты. Сама функция при этом одна и та же, как мы видели в
части 3.
</div>
<p>Проследим три последовательных вызова на фразе «Я добавил молоко в кофе.»</p>
<div class="stage" id="stageAg" tabindex="0">
<div class="stage-figure">
<svg id="ag" viewBox="0 0 960 790" role="img" aria-label="Три последовательных вызова одной модели: выход каждого вызова дописывается к входу следующего">
  <style>
    #ag { font-family: Helvetica, Arial, sans-serif; }
    #ag .title { font-size:24px; font-weight:700; fill:#111111; }
    #ag .h { font-size:17px; font-weight:700; fill:#111111; }
    #ag .text { font-size:16px; fill:#111111; }
    #ag .cap { font-size:14px; fill:#111111; }
    #ag .small { font-size:13px; fill:#5E5850; }
    #ag .tiny { font-size:12px; fill:#5E5850; }
    #ag .mid { text-anchor:middle; }
    #ag .blue { fill:#3576C0; } #ag .yellow { fill:#C29E08; } #ag .green { fill:#73B222; } #ag .red { fill:#C30B0A; }
    #ag .box-blue { fill:#F0F6FC; stroke:#3576C0; stroke-width:1.6; }
    #ag .box-yellow { fill:#FFFBEB; stroke:#C29E08; stroke-width:1.6; }
    #ag .box-green { fill:#F0FAF0; stroke:#73B222; stroke-width:1.6; }
    #ag .box-red { fill:#FFF2F2; stroke:#C30B0A; stroke-width:1.6; }
    #ag .box-gray { fill:#FAFAF9; stroke:#B9B4AB; stroke-width:1.3; }
    #ag .bar-bg { fill:#ECEAE5; }
    #ag .bar-blue { fill:#3576C0; } #ag .bar-green { fill:#73B222; } #ag .bar-red { fill:#C30B0A; }
    #ag .arrow { fill:none; stroke:#C29E08; stroke-width:3; marker-end:url(#ag-ay); }
    #ag .arrow-blue { fill:none; stroke:#3576C0; stroke-width:2.5; marker-end:url(#ag-ab); }
    #ag .rail { stroke:#5E5850; stroke-width:2; fill:none; }
    #ag .shape-gray { fill:#FFFFFF; stroke:#5E5850; stroke-width:2; }
    #ag .shape-blue { fill:#FFFFFF; stroke:#3576C0; stroke-width:2; }
    #ag .screen { fill:#F7FAFD; stroke:#3576C0; stroke-width:1.2; }
    #ag .chip { fill:#FFFFFF; stroke:#D8D4CC; stroke-width:1.3; }
    #ag .chip-on { fill:#FFFBEB; stroke:#C29E08; stroke-width:2.2; }
    #ag .loop { fill:none; stroke:#5E5850; stroke-width:1.8; stroke-dasharray:6 4; marker-end:url(#ag-ag); }
    #ag .lbl { font-size:18px; fill:#111111; }
    #ag .big { font-size:21px; font-weight:700; }
    #ag .cap { font-size:13px; fill:#5E5850; }
    #ag .pl { fill:#E9E7E0; stroke:#A9A399; stroke-width:1; }
    #ag .plf { fill:#F4F2EC; stroke:#5E5850; stroke-width:1.4; }
    #ag .legend { font-size:13px; fill:#5E5850; }
    #ag .blue { fill:#3576C0; } #ag .yellow { fill:#C29E08; } #ag .green { fill:#73B222; }
  </style>
<defs>
<marker id="ag-ay" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#C29E08"/></marker>
<marker id="ag-ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#3576C0"/></marker>
<marker id="ag-ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#5E5850"/></marker>
</defs>
<text text-anchor="middle" x="480" y="44" class="lbl mid" font-weight="700">Три вызова одной и той же модели: θ не меняется, растёт только вход</text>
<g data-key="in1"><rect x="20" y="406" width="236" height="80" rx="10" class="box-blue"/><text text-anchor="middle" x="138" y="432" class="cap mid">вход — весь текст слева</text><text text-anchor="middle" x="138" y="465" class="lbl mid blue" font-weight="700">Я</text></g>
<g data-key="tf1"><path d="M138 400 L138 340" class="arrow-blue"/><rect x="8" y="200" width="190" height="96" rx="3" class="pl"/><rect x="13" y="205" width="190" height="96" rx="3" class="pl"/><rect x="18" y="210" width="190" height="96" rx="3" class="pl"/><rect x="23" y="215" width="190" height="96" rx="3" class="pl"/><rect x="28" y="220" width="190" height="96" rx="3" class="pl"/><rect x="33" y="225" width="190" height="96" rx="3" class="pl"/><rect x="38" y="230" width="190" height="96" rx="3" class="pl"/><rect x="43" y="235" width="190" height="96" rx="3" class="plf"/><text text-anchor="middle" x="138" y="283" class="lbl mid" font-weight="700">Модель θ</text><text text-anchor="middle" x="138" y="307" class="cap mid">те же параметры</text></g>
<g data-key="out1"><text text-anchor="middle" x="138" y="88" class="cap mid" font-weight="700">ВЫЗОВ 1</text><path d="M138 196 L138 168" class="arrow-blue"/><rect x="38" y="100" width="200" height="60" rx="8" class="box-green"/><text text-anchor="middle" x="138" y="138" class="big mid green">добавил</text></g>
<g data-key="in2"><rect x="362" y="406" width="236" height="80" rx="10" class="box-blue"/><text text-anchor="middle" x="480" y="432" class="cap mid">вход — весь текст слева</text><text text-anchor="middle" x="480" y="465" class="lbl mid blue" font-weight="700">Я добавил</text></g>
<g data-key="tf2"><path d="M480 400 L480 340" class="arrow-blue"/><rect x="350" y="200" width="190" height="96" rx="3" class="pl"/><rect x="355" y="205" width="190" height="96" rx="3" class="pl"/><rect x="360" y="210" width="190" height="96" rx="3" class="pl"/><rect x="365" y="215" width="190" height="96" rx="3" class="pl"/><rect x="370" y="220" width="190" height="96" rx="3" class="pl"/><rect x="375" y="225" width="190" height="96" rx="3" class="pl"/><rect x="380" y="230" width="190" height="96" rx="3" class="pl"/><rect x="385" y="235" width="190" height="96" rx="3" class="plf"/><text text-anchor="middle" x="480" y="283" class="lbl mid" font-weight="700">Модель θ</text><text text-anchor="middle" x="480" y="307" class="cap mid">те же параметры</text></g>
<g data-key="out2"><text text-anchor="middle" x="480" y="88" class="cap mid" font-weight="700">ВЫЗОВ 2</text><path d="M480 196 L480 168" class="arrow-blue"/><rect x="380" y="100" width="200" height="60" rx="8" class="box-green"/><text text-anchor="middle" x="480" y="138" class="big mid green">молоко</text></g>
<g data-key="in3"><rect x="704" y="406" width="236" height="80" rx="10" class="box-blue"/><text text-anchor="middle" x="822" y="432" class="cap mid">вход — весь текст слева</text><text text-anchor="middle" x="822" y="465" class="lbl mid blue" font-weight="700">Я добавил молоко</text></g>
<g data-key="tf3"><path d="M822 400 L822 340" class="arrow-blue"/><rect x="692" y="200" width="190" height="96" rx="3" class="pl"/><rect x="697" y="205" width="190" height="96" rx="3" class="pl"/><rect x="702" y="210" width="190" height="96" rx="3" class="pl"/><rect x="707" y="215" width="190" height="96" rx="3" class="pl"/><rect x="712" y="220" width="190" height="96" rx="3" class="pl"/><rect x="717" y="225" width="190" height="96" rx="3" class="pl"/><rect x="722" y="230" width="190" height="96" rx="3" class="pl"/><rect x="727" y="235" width="190" height="96" rx="3" class="plf"/><text text-anchor="middle" x="822" y="283" class="lbl mid" font-weight="700">Модель θ</text><text text-anchor="middle" x="822" y="307" class="cap mid">те же параметры</text></g>
<g data-key="out3"><text text-anchor="middle" x="822" y="88" class="cap mid" font-weight="700">ВЫЗОВ 3</text><path d="M822 196 L822 168" class="arrow-blue"/><rect x="722" y="100" width="200" height="60" rx="8" class="box-green"/><text text-anchor="middle" x="822" y="138" class="big mid green">в</text></g>
<g data-key="ar1"><path d="M242 130 H309 V446 H358" class="arrow"/><rect x="271" y="350" width="76" height="26" rx="8" fill="#FFFFFF"/><text text-anchor="middle" x="309" y="368" class="cap mid yellow" font-weight="700">дописать</text></g>
<g data-key="ar2"><path d="M584 130 H651 V446 H700" class="arrow"/><rect x="613" y="350" width="76" height="26" rx="8" fill="#FFFFFF"/><text text-anchor="middle" x="651" y="368" class="cap mid yellow" font-weight="700">дописать</text></g>
<g data-key="phrase"><text text-anchor="middle" x="480" y="526" class="cap mid">ещё два вызова дают «кофе» и «.» — фраза готова</text><rect x="171" y="540" width="90" height="50" rx="9" class="box-blue"/><text text-anchor="middle" x="216" y="572" class="lbl mid blue" font-weight="700">Я</text><rect x="273" y="540" width="124" height="50" rx="9" class="box-green"/><text text-anchor="middle" x="335" y="572" class="lbl mid green" font-weight="700">добавил</text><rect x="409" y="540" width="130" height="50" rx="9" class="box-green"/><text text-anchor="middle" x="474" y="572" class="lbl mid green" font-weight="700">молоко</text><rect x="551" y="540" width="64" height="50" rx="9" class="box-green"/><text text-anchor="middle" x="583" y="572" class="lbl mid green" font-weight="700">в</text><rect x="627" y="540" width="100" height="50" rx="9" class="box-green"/><text text-anchor="middle" x="677" y="572" class="lbl mid green" font-weight="700">кофе</text><rect x="739" y="540" width="50" height="50" rx="9" class="box-green"/><text text-anchor="middle" x="764" y="572" class="lbl mid green" font-weight="700">.</text></g>
<g data-key="ph1"><rect x="60" y="620" width="250" height="70" rx="10" class="box-blue"/><text text-anchor="middle" x="185" y="650" class="lbl mid blue" font-weight="700">1. Распределение</text><text text-anchor="middle" x="185" y="674" class="cap mid">какие токены возможны?</text></g>
<g data-key="ph2"><path d="M313 655 L347 655" class="arrow"/><rect x="355" y="620" width="250" height="70" rx="10" class="box-yellow"/><text text-anchor="middle" x="480" y="650" class="lbl mid yellow" font-weight="700">2. Выбор</text><text text-anchor="middle" x="480" y="674" class="cap mid">какой токен берём?</text></g>
<g data-key="ph3"><path d="M608 655 L642 655" class="arrow"/><rect x="650" y="620" width="250" height="70" rx="10" class="box-green"/><text text-anchor="middle" x="775" y="650" class="lbl mid green" font-weight="700">3. Дописывание</text><text text-anchor="middle" x="775" y="674" class="cap mid">контекст стал длиннее</text></g>
<g data-key="back"><path d="M775 692 V716 H185 V698" class="loop"/><text text-anchor="middle" x="480" y="738" class="cap mid">повторить с более длинным контекстом — до токена конца или лимита длины</text></g>
<text x="40" y="774" class="legend">синий — запрос · серая стопка — модель · зелёный — то, что модель дописала · жёлтые стрелки — перенос на вход</text>
</svg>
</div>
<div class="stage-bar">
<button type="button" data-nav="prev">← Назад</button>
<button type="button" data-nav="next">Далее →</button>
<div class="stage-progress"></div>
<div class="stage-counter"></div>
</div>
<div class="stage-notes">
<div class="step-panel" data-on="in1 tf1 out1" data-focus="tf1">
<div class="step-kicker">Шаг 1 · первый вызов</div>
<h4>Модель получает запрос и выдаёт одно слово</h4>
<p>На входе — только «Я». Модель строит распределение продолжений, правило выбора берёт из него «добавил». Внутри этой стопки — трансформер, который мы разобрали в частях 11–12; здесь он снова виден снаружи: вход и выход.</p>
<div class="math-display" data-tex="\text{Я} \;\to\; \text{Модель}_\theta \;\to\; p_\theta(\cdot \mid \text{Я}) \;\to\; \text{добавил}"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2" data-focus="ar1 in2">
<div class="step-kicker">Шаг 2 · обратная связь</div>
<h4>Выход дописывается к следующему входу</h4>
<p>Во второй вызов идёт не одно слово «добавил», а весь текст слева: «Я добавил». Поэтому новое предсказание учитывает и запрос, и собственный предыдущий выбор модели.</p>
<div class="math-display" data-tex="y_{&lt;t+1} = (y_{&lt;t},\ \hat y_t)"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2 out2" data-focus="out2">
<div class="step-kicker">Шаг 3 · второе слово</div>
<h4>Тот же механизм даёт следующее слово</h4>
<p>По контексту «Я добавил» модель выбирает «молоко». Ничего нового не произошло: снова распределение, снова выбор одного токена.</p>
<div class="math-display" data-tex="\hat y_2 \sim p_\theta(\cdot \mid \text{Я добавил})"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2 out2 ar2 in3 tf3 out3" data-focus="ar2 in3 out3">
<div class="step-kicker">Шаг 4 · третий вызов</div>
<h4>Вход растёт на одно слово за вызов</h4>
<p>Теперь вход — «Я добавил молоко», и в нём уже два токена, которые модель сгенерировала сама. На выходе — «в».</p>
<div class="math-display" data-tex="\hat y_3 \sim p_\theta(\cdot \mid \text{Я добавил молоко})"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2 out2 ar2 in3 tf3 out3" data-focus="tf1 tf2 tf3">
<div class="step-kicker">Шаг 5 · тот же θ</div>
<h4>Три стопки — одна и та же модель</h4>
<p>Это не три разные нейросети, а три последовательных вызова одной обученной модели с одинаковыми параметрами θ. Меняется не модель, а текст на её входе. Именно это и называется авторегрессией: предыдущий выход становится частью следующего входа.</p>
<div class="math-display" data-tex="p_\theta(y_t \mid y_{&lt;t}) \quad \text{с тем же } \theta \text{ на каждом шаге}"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2 out2 ar2 in3 tf3 out3 phrase" data-focus="phrase">
<div class="step-kicker">Шаг 6 · целая фраза</div>
<h4>Предложение ни разу не создавалось целиком</h4>
<p>Ещё два вызова дают «кофе» и точку. Каждое слово появилось отдельным запуском: фраза «Я добавил молоко в кофе.» — это пять таких вызовов подряд.</p>
<div class="math-display" data-tex="\text{Я} \to \text{добавил} \to \text{молоко} \to \text{в} \to \text{кофе} \to \text{.}"></div>
</div>
<div class="step-panel" data-on="in1 tf1 out1 ar1 in2 tf2 out2 ar2 in3 tf3 out3 phrase ph1 ph2 ph3 back" data-focus="ph1 ph2 ph3 back">
<div class="step-kicker">Шаг 7 · цикл</div>
<h4>Предложить → выбрать → дописать → повторить</h4>
<p>Каждый токен проходит три фазы. Модель отвечает только за первую — распределение. Выбор делает отдельное правило: всегда брать максимум или бросать кость по вероятностям (поэтому одинаковый запрос даёт разные тексты, как в части 3). Цикл останавливается на токене конца, по лимиту длины или другой команде остановки.</p>
<div class="math-display" data-tex="\hat y_t \sim p_\theta(\cdot \mid y_{&lt;t}), \qquad y_{&lt;t+1} = (y_{&lt;t},\ \hat y_t)"></div>
</div>
</div>
</div>
<p class="stage-hint">Наведите фокус на сцену и используйте стрелки ← → для навигации.</p>
<div class="callout">
<strong>Главная мысль части:</strong> авторегрессия — это внешний цикл
«контекст → распределение → выбор → более длинный контекст»; модель
отвечает только за один проход внутри этого цикла, и его параметры θ между
вызовами не меняются.
</div>
<hr>
<h2 id="part-14">Часть 14. Что важно уметь восстановить по памяти</h2>
<ol class="end-list">
<li><strong>Модель — полезное упрощение.</strong> Она сохраняет от объекта только
то, что нужно для выбранного вопроса; остальные свойства она отбрасывает.</li>
<li><strong>Модель языка отвечает на один вопрос.</strong> По тексту слева —
какое слово идёт следующим:
<span class="math-inline" data-tex="p_\theta(y_t \mid y_{<t})"></span>.</li>
<li><strong>Выход — распределение, слово выбирает сэмплер.</strong> Число для
каждого элемента словаря, в сумме единица; поэтому один запрос даёт разные
ответы, хотя функция детерминирована.</li>
<li><strong>Чат-бот — это текстовая обёртка.</strong> Системный текст, реплика
пользователя и уже сгенерированный ответ склеиваются в одну строку.</li>
<li><strong>Разметка бесплатна.</strong> Правильный ответ — следующее слово
самого текста, поэтому обучающих примеров столько же, сколько слов.</li>
<li><strong>Параметры — это всё, что есть.</strong> Схему задал человек, числа
получены процедурой; у отдельного числа смысла нет.</li>
<li><strong>Обучение — это повторяемый шаг.</strong> Предсказать, измерить
<span class="math-inline" data-tex="-\ln p"></span>, распространить ошибку назад, сдвинуть все
параметры на чуть-чуть; масштаб держится на параллельных вычислениях.</li>
<li><strong>Трансформер обрабатывает весь текст сразу.</strong> Внимание
смешивает векторы, feedforward обрабатывает каждый отдельно, и так десятки
раз; распределение строится по последнему вектору.</li>
<li><strong>Генерация — авторегрессионный цикл.</strong>
<span class="math-inline" data-tex="\hat y_t \sim p_\theta(\cdot \mid y_{<t})"></span>,
токен дописывается к входу, и тот же трансформер с тем же θ запускается заново.</li>
<li><strong>Поведение эмерджентно.</strong> Почему модель выдала конкретный
ответ, из устройства вывести нельзя.</li>
</ol>
<p>
Если оставить в голове одну картину, пусть это будет такая: длинная строка
текста, в конце которой машина каждый раз дорисовывает одно слово, и делает это
на основании ста семидесяти пяти миллиардов чисел, которые никто не выставлял
вручную. Эта машина — модель языка в самом прямом смысле первой части: она
сохранила от языка одно умение, и всё, что выглядит как понимание, разговор и
намерение, снаружи собирается из этого одного действия, повторённого много раз.
</p>
<p class="tiny">
О числах. Вероятности в первой части (башня 0,78 / 0,22; «кофе» 0,46, «чашку» 0,22,
«кашу» 0,12) и фраза «Я добавил молоко в кофе.» — иллюстративные, взяты из
статьи «Что такое языковая модель и как она учится продолжать текст».
Распределения вероятностей («Paris is a city in…», Santiago, «It was
the best of times…», «jumped into the…») взяты из разбираемого источника и
иллюстративны — это не выход конкретной модели. Числа после обратного
распространения посчитаны здесь: логиты восстановлены как
<span class="math-inline" data-tex="z = \ln p"></span>, сделан один шаг
<span class="math-inline" data-tex="z \leftarrow z - \eta(p-y)"></span> с
<span class="math-inline" data-tex="\eta = 1{,}7854"></span>, подобранным так, чтобы
вероятность правильного слова стала ровно 70 %. Оценка 2 595 лет чтения получена
делением 3·10¹¹ слов на темп 220 слов в минуту. Оценки вычислений — по правилу
<span class="math-inline" data-tex="6ND"></span> для опубликованных характеристик
GPT-3 (175 млрд параметров, 300 млрд токенов) и по публичной реконструкции
2·10²⁵ операций для следующего поколения. Округление везде до четырёх знаков,
проценты — до одного. Иллюстрации настоящего поезда в первой части —
<a href="http://www.freepik.com">Designed by Freepik</a>.
</p>
