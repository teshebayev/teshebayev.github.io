# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal educational blog about AI/ML topics, published via GitHub Pages. No build tools, no framework — pure HTML, CSS, and JavaScript. Pushing to `main` deploys automatically.

**Local development**: Open HTML files directly in a browser. There are no build or test commands.

## Architecture

### Single Source of Truth: `content/manifest.json`

All site configuration lives in `manifest.json`:
- Site metadata and social links
- i18n strings for all UI labels (Russian, English, Kazakh)
- Article metadata: slug, titles, descriptions, dates, tags, content paths, `reading_order`
- Category definitions with icons and colors

When adding or editing articles, always update `manifest.json` to register them.

### Page + JavaScript Module Pattern

Each HTML page (`index.html`, `blog.html`, `article.html`, `category.html`) is a static shell. The corresponding JS file in `assets/js/` fetches the manifest and renders content at runtime:

- **shared.js** — manifest loading/caching, i18n resolution, language detection, date helpers
- **article.js** — fetches markdown → renders with marked.js → syntax highlights with Prism.js → math with KaTeX → builds TOC + scrollspy → prev/next navigation
- **blog.js** — renders category preview cards
- **category.js** — full category view with search and tag filtering
- **about.js** — about/profile section

### Content Structure

Articles live in `content/articles/[category]/[slug].[lang].md`. The language suffix (`.en.md`, `.ru.md`, `.kk.md`) drives the i18n fallback system — if a translation is missing, the reader sees a "switch language" prompt rather than broken content.

Language selection priority: URL param → localStorage → manifest default.

### CDN Dependencies (no npm)

All third-party libraries are loaded from CDN:
- **marked.js v12** — Markdown parsing
- **Prism.js v1.29** — code syntax highlighting
- **KaTeX v0.16.9** — math rendering

### SVG Interactivity

Interactive diagrams are embedded with `<object>` tags (not `<img>`) so their internal JavaScript runs. `article.js` applies scoped CSS to SVG content to prevent style collisions with the page.

### Styling

`assets/css/main.css` uses CSS custom properties for theming. Light/dark mode toggles via `[data-theme="dark"]` on `<html>`. Content width is capped at 720px; the sidebar is 280px; the TOC panel is 240px.

## Adding Content

1. Create `content/articles/[category]/[slug].[lang].md`
2. Add the article entry to `content/manifest.json` under `articles` and reference it in the appropriate category
3. Embed interactive SVGs with `<object data="path/to.svg" type="image/svg+xml">` so their scripts execute
