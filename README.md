# Personal site — architecture & how to use

A static personal site for GitHub Pages with **bilingual content**, search,
tag filtering, manual reading order, and an article view with a side TOC.
No build step.

---

## File layout

```
/
├── index.html              ← About Me
├── blog.html               ← Blog overview — 5 latest per category
├── category.html           ← Full category page (?id=...)
├── article.html            ← Article view (?slug=...)
├── 404.html
│
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── prose.css
│   ├── js/
│   │   ├── shared.js       ← Manifest, sidebar, theme, i18n
│   │   ├── about.js
│   │   ├── blog.js
│   │   ├── category.js
│   │   └── article.js
│   └── img/avatar.svg
│
└── content/
    ├── manifest.json
    └── articles/
        ├── machine-learning/
        │   ├── explicit-vs-ml.ru.md
        │   ├── explicit-vs-ml.en.md
        │   └── linear-regression.ru.md
        ├── deep-learning/
        │   ├── neural-networks-intro.ru.md
        │   ├── neural-networks-intro.en.md
        │   └── interactive-visuals.ru.md
        └── statistics/
            ├── bayes-theorem.ru.md
            └── bayes-theorem.en.md
```

Markdown filename convention: `<slug>.<lang>.md` (e.g. `linear-regression.ru.md`).
The mapping from slug to file is recorded in `manifest.json` — the convention is
just a habit, the manifest is the source of truth.

---

## Internationalisation

The site supports any number of languages, declared in `site.languages`. The
selected language affects three independent layers:

| Layer | What it covers |
|---|---|
| **UI strings** | Buttons, labels, placeholders — `manifest.i18n[lang]` |
| **Metadata** | Titles, descriptions, category labels, tag labels — `{ ru: "…", en: "…" }` |
| **Article body** | Per-language markdown files in `article.content[lang]` |

### Localising fields

Any field that should be translated becomes a `{ ru: ..., en: ... }` object:

```jsonc
{
  "title":       { "ru": "Линейная регрессия",       "en": "Linear regression" },
  "description": { "ru": "Что модель делает с весами…", "en": "What the model is doing…" }
}
```

A plain string is also accepted (treated as untranslated).

### Localising tags & categories

Tags use the same object form:

```json
"tags": {
  "transformers": { "ru": "Трансформеры", "en": "Transformers" }
}
```

Categories localise their `title`, `description`, and `reading_order[].label`
the same way.

### Localising articles

Each article's `content` is a map of language → file path:

```json
"content": {
  "ru": "content/articles/ml/linear-regression.ru.md",
  "en": "content/articles/ml/linear-regression.en.md"
}
```

If only `"ru"` is present, the article is "ru-only".

### Fallback behaviour

The site is designed so you don't have to translate everything at once.

| Where | Behaviour |
|---|---|
| List pages (blog, category, sidebar) | Articles **without content** in the current language are **hidden**. You won't accidentally link a reader to a missing translation. |
| Article page when content is missing | The article loads in whatever language is available, and a banner appears: *"This article is only available in Русский. View in Русский →"* |
| Metadata that has no translation | Falls back to the first available language so nothing renders as empty. |
| UI strings | Fall back to `site.defaultLanguage`, then to any defined language. |

### Choosing a language

There are three ways, in order of priority:

1. **URL** — `?lang=en` (highest priority; useful for sharing)
2. **localStorage** — set by clicking the language switch
3. **`site.defaultLanguage`** in the manifest

Clicking the language switch saves to localStorage and reloads the page.

### Language switch

Two appearances:

- In the **profile sidebar** (and mobile bar) — global language for the whole site.
- In the **article header** — only shows when an article has more than one
  translation. Clicking it switches the whole site to that language.

The article switch is intentionally not just a "show this article in language X"
button — it changes the global preference so the sidebar list and other links
become consistent.

---

## Sorting & ordering

Two completely separate axes:

| Axis | Field | Affects |
|---|---|---|
| **Chronology** | `article.date` | Year groups on category page, "5 latest" on blog index |
| **Curriculum** | `category.reading_order` | Curriculum view, sidebar groups, prev/next |

### Manual ordering via `reading_order`

Add an optional `reading_order` to any category. Define groups and the order
of articles within them — both are taken literally:

```json
{
  "id": "deep-learning",
  "reading_order": [
    {
      "group": "neural-networks",
      "label": { "ru": "Основы нейросетей", "en": "Neural network basics" },
      "articles": ["neural-networks-from-scratch", "dropout-explained"]
    }
  ]
}
```

When `reading_order` is set:

- Category page shows a **"Curriculum order"** / **"By date"** toggle, defaulting to curriculum
- Article sidebar uses the curated groups
- Article prev/next follows the curriculum
- Unlisted articles fall into an "Other" group

Articles still need a `date` (used for year grouping in chronological mode and
in "Other" leftover groups).

---

## Adding a new article

1. Create the markdown file(s):
   ```
   content/articles/<category>/<slug>.ru.md     # required if RU is default
   content/articles/<category>/<slug>.en.md     # optional
   ```

2. Add an entry to `manifest.json` → `articles`:

   ```json
   {
     "slug": "vision-transformers",
     "category": "deep-learning",
     "title": {
       "ru": "Vision Transformers объяснён",
       "en": "Vision Transformers explained"
     },
     "description": {
       "ru": "Как трансформер встретился со свёрткой и победил.",
       "en": "How the transformer met the convolution and won."
     },
     "date": "2026-05-15",
     "reading_time": 9,
     "tags": ["transformers", "cnn"],
     "draft": false,
     "content": {
       "ru": "content/articles/deep-learning/vision-transformers.ru.md",
       "en": "content/articles/deep-learning/vision-transformers.en.md"
     }
   }
   ```

3. If you used a new tag, register it in `manifest.json` → `tags`.

---

## Markdown conventions

- Headings: `##` (TOC top level) and `###` (nested).
- Math: `$inline$` and `$$display$$` (KaTeX).
- Code: triple backticks with a language tag (Prism autoload).
- Interactive content (SVG/JS/iframe demos): see
  `content/articles/deep-learning/interactive-visuals.ru.md`.

---

## URL parameters (deep-linkable)

- `?lang=en` — language (works on every page)
- `category.html?id=...` — open category
- `category.html?id=...&tag=transformers&q=attention&view=chronological` — filtered view
- `article.html?slug=...` — open article

---

## Theming

Light/dark theme stored in localStorage. Each category injects its own accent
via CSS variables, applied to the side stripe, active chip, search focus border,
TOC highlight, and prev/next hover.

---

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Or via SSH forwarding:

```bash
ssh -L 8000:localhost:8000 user@server
```

---

## Deploy to GitHub Pages

1. Create repo `<username>.github.io`.
2. Push to `main`.
3. Settings → Pages → source: `main` / `/ (root)`.
