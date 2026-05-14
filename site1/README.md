# Personal site — architecture & how to use

A static personal site for GitHub Pages: an **About** front page, a **Блог** index
grouped by category, and **article** pages with a left article-list sidebar and a
right table-of-contents. No build step — open it locally with any static server.

---

## File layout

```
/
├── index.html              ← About Me (landing page)
├── blog.html               ← Blog index, grouped by category
├── article.html            ← Article view (uses ?slug=...)
├── 404.html
│
├── assets/
│   ├── css/
│   │   ├── main.css        ← Tokens, layout, sidebars, cards
│   │   └── prose.css       ← Typography for rendered markdown
│   ├── js/
│   │   ├── shared.js       ← Manifest loader, profile sidebar, theme
│   │   ├── about.js        ← Bootstrap for index.html
│   │   ├── blog.js         ← Renders category sections + cards
│   │   └── article.js      ← Loads MD, renders, builds TOC, scrollspy
│   └── img/
│       └── avatar.svg
│
└── content/
    ├── manifest.json       ← SINGLE SOURCE OF TRUTH (categories + articles)
    └── articles/
        ├── machine-learning/
        │   ├── explicit-vs-ml.md
        │   └── linear-regression.md
        ├── deep-learning/
        │   └── neural-networks-intro.md
        └── statistics/
            └── bayes-theorem.md
```

---

## Data model

Everything is driven by `content/manifest.json`. Two top-level entities:

### `categories[]`
| Field        | Type   | Notes                                                  |
| ------------ | ------ | ------------------------------------------------------ |
| `id`         | string | URL-safe slug. Referenced by articles.                 |
| `title`      | string | Display name (Russian).                                |
| `title_en`   | string | Optional English fallback.                             |
| `description`| string | Shown on the blog index under the category title.      |
| `icon`       | string | Maps to an SVG in `blog.js` (`brain`, `chart`, `sigma`)|
| `accent`     | string | CSS color — used as the category accent everywhere.    |
| `tint`       | string | Soft background for the icon chip.                     |
| `order`      | number | Display order on the blog index.                       |

### `articles[]`
| Field         | Type    | Notes                                                              |
| ------------- | ------- | ------------------------------------------------------------------ |
| `slug`        | string  | URL identifier — `article.html?slug=<slug>`. Must be globally unique. |
| `category`    | string  | Must match an existing `category.id`.                              |
| `title`       | string  | Article title.                                                     |
| `description` | string  | One-line teaser, shown on the blog cards.                          |
| `date`        | string  | ISO `YYYY-MM-DD`. Used for sorting and display.                    |
| `updated`     | string? | Optional. ISO date. Shown in meta if present.                      |
| `reading_time`| number  | Minutes. Shown in meta.                                            |
| `tags`        | array   | Reserved for future filtering / tag pages.                         |
| `draft`       | boolean | If true, hidden from the index.                                    |
| `content`     | string  | Relative path to the `.md` file.                                   |

### Entity relationships

```
Site (1) ──▶ (many) Category ──▶ (many) Article ──▶ (1) Markdown file
                                       │
                                       └── prev/next: derived from date order
                                                      within the same category
```

That is the only data Claude needs at runtime. Adding a new category or article
is just an edit to `manifest.json` plus a new `.md` file. **No HTML changes
required.**

---

## Pages & data flow

| Page         | What it does                                                                 |
| ------------ | ---------------------------------------------------------------------------- |
| `index.html` | Static about-me copy. Loads manifest only for the sidebar (name, bio, social). |
| `blog.html`  | Loads manifest → for each category renders a section with article cards.     |
| `article.html?slug=X` | Loads manifest → finds article + category → fetches MD → renders → builds TOC → scrollspy → renders prev/next within the same category. |
| `404.html`   | Static.                                                                      |

Markdown rendering uses [`marked`](https://marked.js.org/) (CDN), syntax
highlighting via [Prism](https://prismjs.com/) (CDN autoloader), and math via
[KaTeX](https://katex.org/) (CDN). All three are loaded only on `article.html`.

---

## How to add a new article (the only workflow you need)

1. Create the markdown file:
   ```
   content/articles/<category-id>/my-new-post.md
   ```
2. Add an entry to `manifest.json` → `articles`:
   ```json
   {
     "slug": "my-new-post",
     "category": "deep-learning",
     "title": "My new post",
     "description": "One-line teaser.",
     "date": "2026-05-15",
     "reading_time": 7,
     "tags": ["transformer"],
     "draft": false,
     "content": "content/articles/deep-learning/my-new-post.md"
   }
   ```
3. Commit & push. That's it.

## How to add a new category

1. Add an entry to `manifest.json` → `categories`.
2. Create the corresponding folder under `content/articles/`.
3. Optionally add a new icon SVG inside the `ICONS` map in `assets/js/blog.js`,
   then reference it via the `icon` field.

---

## Conventions inside markdown

- Headings: use `##` and `###`. `##` shows in the right TOC at the top level,
  `###` is indented under it. `#` is reserved (the article title comes from the manifest).
- Math: `$inline$` and `$$display$$` (KaTeX delimiters).
- Code: triple backticks with a language tag — Prism auto-loads grammars.
- Tables, blockquotes, lists: standard GFM. Styled in `prose.css`.
- Callouts (optional):
  ```html
  <div class="callout"><strong>Note</strong> A short aside.</div>
  ```

## Interactive content (SVG, JS demos, iframes)

Three options, depending on complexity. See
`content/articles/deep-learning/interactive-visuals.md` for live examples.

1. **Static SVG / SMIL / CSS animations.** Just paste `<svg>` into markdown.
   `marked` passes HTML through unchanged.

2. **Interactive SVG with JavaScript.** Paste `<svg>` and a `<script>` block.
   The article renderer re-creates `<script>` elements after `innerHTML` so the
   browser actually executes them (innerHTML alone never does). Wrap your code
   in an IIFE — `(function(){ ... })()` — to avoid polluting the global scope.

3. **Heavy demos (D3, Three.js, Plotly).** Put a standalone HTML file in
   `content/articles/<category>/demos/<name>.html` and reference it from
   markdown:
   ```html
   <demo src="content/articles/deep-learning/demos/my-demo.html" height="500"></demo>
   ```
   It becomes a sandboxed `<iframe>` — your demo can use any libs without
   touching the page's CSS or globals.

Tips:
- Inside SVG, use CSS variables (`var(--text)`, `var(--cat-accent)`) so colours
  follow light/dark theme.
- Give your SVG and control elements unique IDs — multiple demos on one page
  must not collide.

---

## Theming

Light/dark theme is built in. Toggle is in the sidebar; preference is stored in
`localStorage`. Each category injects its own accent via CSS variables
(`--cat-accent`, `--cat-tint`), so links, active TOC items, card hover borders,
and the side stripe all match the topic colour automatically.

---

## Running locally

The pages use `fetch()` to load the manifest and markdown, so opening
`index.html` directly with `file://` won't work — browsers block it. Run any
static server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000>.

---

## Deploying to GitHub Pages

1. Create a repo named `<your-username>.github.io`.
2. Push the contents of this folder to the `main` branch.
3. In repo Settings → Pages, set source to `main` / `/ (root)`.
4. Site is live at `https://<your-username>.github.io`.

No build step. No Jekyll. Just static files.

---

## Things you might want to add later

- **RSS feed.** Add a small build script that reads `manifest.json` and emits
  `feed.xml`. Easy because manifest already has dates and descriptions.
- **Tag pages.** `tags` already exists in the manifest — just add `tag.html?name=...`.
- **Search.** With ~50 articles you can index everything client-side
  (lunr.js or MiniSearch).
- **Drafts preview.** Currently `draft: true` hides articles. Add `?preview=1` to bypass.
- **Reading progress bar.** A 2-line addition on top of the article page.
- **Image optimisation.** Drop images in `assets/img/<slug>/` and reference them
  with relative paths in markdown.

---

## Pieces you may not have considered (and how I handled them)

- **404 fallback.** Bad `?slug=` shows a 404 view instead of a blank page.
- **Prev / next navigation.** Auto-derived from publication order within a category.
- **Anchor links on headings.** Hover a heading on an article — the `#` link appears.
- **Scroll-spy.** Right-side TOC highlights the section currently in view.
- **Mobile.** Below 960px the sidebars collapse into a top bar; TOC hides.
- **Theme.** Respects OS preference on first load.
- **i18n posture.** Russian UI, but the data model has `title_en` so adding an
  English switch later is mechanical.
- **Static-only.** Works on GitHub Pages out of the box — no Jekyll, no Actions.
