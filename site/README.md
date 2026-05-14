# Personal site — architecture & how to use

A static personal site for GitHub Pages: an **About** front page, a **Блог**
overview, **category** pages with search and tag filtering, and **article** pages
with a left article-list sidebar and a right table-of-contents. No build step —
open it locally with any static server.

---

## File layout

```
/
├── index.html              ← About Me (landing page)
├── blog.html               ← Blog overview — 5 latest per category
├── category.html           ← Full category page (?id=...) with search + tags
├── article.html            ← Article view (?slug=...)
├── 404.html
│
├── assets/
│   ├── css/
│   │   ├── main.css        ← Tokens, layout, sidebars, lists, search/chips
│   │   └── prose.css       ← Typography for rendered markdown
│   ├── js/
│   │   ├── shared.js       ← Manifest loader, sidebar, theme, utils
│   │   ├── about.js
│   │   ├── blog.js         ← Blog overview
│   │   ├── category.js     ← Full category list, search, tag filter
│   │   └── article.js      ← Article rendering, TOC, scrollspy
│   └── img/
│       └── avatar.svg
│
└── content/
    ├── manifest.json       ← SINGLE SOURCE OF TRUTH
    └── articles/
        ├── machine-learning/
        ├── deep-learning/
        └── statistics/
```

---

## How the three list pages scale

The site has three layers of "list" UI, each tuned for a different question.

| Page                      | Answers the question                              | UI                                                |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `blog.html`               | What direction am I working in? What's recent?    | 5 most-recent per category + "see all"            |
| `category.html?id=X`      | Give me everything in this category, I'll filter. | Full list, search, tag chips, grouped by year     |
| `article.html` sidebar    | I'm reading — what else is nearby?                | Flat list (≤10) or grouped by primary tag (>10)   |

The article sidebar **automatically switches** between a flat list and a grouped
collapsible list based on the number of siblings (threshold = 10 articles).
The currently-open article's tag group is expanded by default; a filter input
appears for fast jumping.

---

## Data model

Everything is driven by `content/manifest.json`. Three top-level entities:

### `categories[]`
| Field        | Type   | Notes                                                  |
| ------------ | ------ | ------------------------------------------------------ |
| `id`         | string | URL-safe slug. Referenced by articles.                 |
| `title`      | string | Display name.                                          |
| `description`| string | Shown on the blog overview and category page.          |
| `icon`       | string | `brain` `chart` `sigma` `database` — extend in `blog.js`. |
| `accent`     | string | CSS color — applied across the whole topic experience. |
| `tint`       | string | Soft background for the icon chip.                     |
| `order`      | number | Display order.                                         |

### `tags`
A flat **dictionary** mapping tag-id → human label. Tags act as
**sub-categories**: the first tag of an article is its primary tag and is used
to group it in the article sidebar.

```json
"tags": {
  "transformers": "Трансформеры",
  "cnn": "CNN",
  "...": "..."
}
```

If an article uses a tag missing from this dictionary, the raw id is shown.

### `articles[]`
| Field         | Type    | Notes                                                              |
| ------------- | ------- | ------------------------------------------------------------------ |
| `slug`        | string  | URL identifier — `article.html?slug=<slug>`. Must be unique.       |
| `category`    | string  | Must match an existing `category.id`.                              |
| `title`       | string  | Article title.                                                     |
| `description` | string  | One-line teaser, shown in lists and as the meta description.       |
| `date`        | string  | ISO `YYYY-MM-DD`. Used for sorting, display, and year grouping.    |
| `updated`     | string? | Optional. ISO date.                                                |
| `reading_time`| number  | Minutes.                                                           |
| `tags`        | array   | **First tag = primary tag** (used as a sub-category for grouping). |
| `draft`       | boolean | If true, hidden from indexes.                                      |
| `content`     | string  | Relative path to the `.md` file.                                   |

## Sorting & ordering — the full picture

Two completely separate axes:

| Axis             | Field                           | Affects                                                  |
| ---------------- | ------------------------------- | -------------------------------------------------------- |
| **Chronology**   | `article.date`                  | Year groups on category page, "5 latest" on blog index   |
| **Curriculum**   | `category.reading_order`        | Curriculum view on category page, sidebar groups, prev/next |

**Why both?** Publication date ≠ reading order. You might write the
Transformer article before the CNN one, but a reader benefits from seeing
neural-network basics first.

### Manual ordering via `reading_order`

Add an optional `reading_order` to any category. Define groups and the order
of articles within them — both are taken literally:

```json
{
  "id": "deep-learning",
  "title": "Глубокое обучение",
  "reading_order": [
    {
      "group": "neural-networks",
      "label": "Основы нейросетей",
      "articles": ["neural-networks-from-scratch", "dropout-explained"]
    },
    {
      "group": "transformers",
      "label": "Трансформеры",
      "articles": ["attention-mechanism", "positional-encoding", "transformer-from-scratch"]
    }
  ]
}
```

What this changes:

| Where                          | Effect                                                              |
| ------------------------------ | ------------------------------------------------------------------- |
| Category page                  | A new **"Учебный порядок"** view becomes default; toggle to **"По дате"** for the old chronological mode |
| Article sidebar                | Groups appear in the order you wrote, articles within a group too   |
| Article prev/next              | Follows the curriculum, not the calendar                            |
| Articles not in `reading_order`| Land in a "Прочее" group at the end, sorted by date                 |

**Add a new article to a series** — just insert its slug into the `articles`
array at the right position. No renumbering, no `order: 1, 2, 3, ...`.

**Drop the field** to revert to date-based ordering for that category. The
toggle disappears, and everything goes back to the auto-grouped-by-tag layout.

You don't have to define `reading_order` for every category — only for ones
with real pedagogical structure.

---

## Relationships

```
Site (1) → many Categories → many Articles → 1 Markdown file
                │                 │
                │                 ├── many Tags (first = primary)
                │                 └── prev/next derived from date order
                │                     within the same category
                │
                └── (optional) reading_order: curated groups & sequence
                    → overrides primary-tag grouping in sidebar
                    → overrides date order in prev/next
```

Tags don't have to be declared up front — adding a new tag to an article and
to the `tags` dictionary is enough. The chips, groups, and counts update from
the manifest automatically.

---

## How to add an article

1. Create the markdown file under `content/articles/<category-id>/`.
2. Add an entry to `manifest.json` → `articles`. **Put the most descriptive tag
   first** — that's how the article will be grouped in the sidebar.
3. If you used a new tag, add a label for it in `manifest.json` → `tags`.

Example:

```json
{
  "slug": "vision-transformers",
  "category": "deep-learning",
  "title": "Vision Transformers объяснён",
  "description": "Как трансформер встретился со свёрткой и победил.",
  "date": "2026-05-15",
  "reading_time": 9,
  "tags": ["transformers", "cnn"],
  "draft": false,
  "content": "content/articles/deep-learning/vision-transformers.md"
}
```

That's the entire workflow. No HTML edits, no rebuild.

---

## How to add a category

1. Add an entry to `manifest.json` → `categories`.
2. Create the folder under `content/articles/`.
3. (Optional) add a new icon in the `ICONS` map in `assets/js/blog.js`.

---

## Conventions inside markdown

- Headings: use `##` and `###`. `##` is the TOC's top level, `###` is nested.
- Math: `$inline$` and `$$display$$` (KaTeX).
- Code: triple backticks with a language tag — Prism auto-loads the grammar.
- Tables, blockquotes, lists: standard GFM.

### Interactive content

Three options:

1. **Static SVG / SMIL / CSS animations.** Paste `<svg>` into markdown — it works.
2. **SVG + JS.** Paste both. The article renderer re-creates `<script>` tags so
   they actually execute. Wrap your code in an IIFE.
3. **Heavy demos (D3, Three.js).** Drop a standalone HTML file in
   `content/articles/<category>/demos/<name>.html` and reference it:
   ```html
   <demo src="content/articles/deep-learning/demos/my-demo.html" height="500"></demo>
   ```
   It becomes a sandboxed iframe.

See `content/articles/deep-learning/interactive-visuals.md` for live examples.

---

## URL parameters (deep-linkable)

- `category.html?id=deep-learning` — open a specific category
- `category.html?id=deep-learning&tag=transformers` — pre-select a tag filter
- `category.html?id=deep-learning&q=attention` — pre-fill the search
- `article.html?slug=my-post` — open an article

Both `q` and `tag` survive browser back/forward. Sharing a filtered category
URL works as you'd expect.

---

## Theming

Light/dark theme is built in (`localStorage`; honours OS preference on first
visit). Each category injects its own accent via CSS variables
(`--cat-accent`, `--cat-tint`), so the side stripe on cards, the active chip,
the search-input focus border, the TOC highlight, and prev/next hover state
all match the topic colour.

---

## Running locally

The pages use `fetch()` to load the manifest and markdown, so opening
`index.html` directly with `file://` won't work — browsers block it. Run any
static server:

```bash
# Python
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

---

## Deploying to GitHub Pages

1. Create a repo named `<your-username>.github.io`.
2. Push the contents of this folder to the `main` branch.
3. Settings → Pages → source: `main` / `/ (root)`.

No build step. No Jekyll. Just static files.

---

## Things you can add later

- **RSS feed** — a tiny build script that reads `manifest.json` and emits `feed.xml`.
- **Tag pages** (e.g. all articles tagged `transformers` across categories) — the
  manifest already supports this; just add `tag.html`.
- **Full-text search** — with ≲100 articles, a client-side index (lunr.js or MiniSearch).
- **Drafts preview** — `?preview=1` to show drafts.
- **Reading progress bar.**
