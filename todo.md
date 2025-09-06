# md-view TODO

Status: tracking backlog for the markdown editor/preview app. Check items as they land; keep sections in roughly priority order.

## Phase 1 — Security & Essentials

- [x] Secure HTML handling: disable raw HTML rendering via `skipHtml` and remove `rehype-raw` to eliminate XSS risk. (files: `components/MarkdownPreview.tsx`)
- [x] Add a regression script for XSS payloads (verifies no `<img ... onerror>` is rendered). (files: `scripts/xss-check.mjs`)
- [x] Tighten types in markdown renderer; remove `any` and use `Components` typing from `react-markdown`. (files: `components/MarkdownPreview.tsx`)

Note: In offline environments without new deps, we use `skipHtml`. When dependency installs are allowed, switch to `rehype-sanitize` with a safe schema to allow limited inline HTML if needed.

## Phase 2 — Core UX

- [ ] Persist content to `localStorage` (key: `mdv:content`) with a 300ms debounce. Load at start; provide “Reset sample” action. (files: `app/page.tsx`)
- [ ] Import `.md` via file input; read as text and load into editor. (files: `app/page.tsx`)
- [ ] Support drag-and-drop of `.md` files into the editor area. (files: `components/MarkdownEditor.tsx` or wrapper)
- [ ] Export current content as `.md` file download. (files: `app/page.tsx`)
- [ ] Export rendered preview as standalone `.html` (inline CSS). (files: `app/page.tsx`)
- [ ] Resizable split panes with a draggable divider; persist ratio in `localStorage`. (files: `app/page.tsx`)

## Phase 3 — Theming & Performance

- [ ] Theme toggle: system/light/dark; store preference and respect `prefers-color-scheme` for “system”. (files: `app/layout.tsx`, `app/page.tsx`)
- [ ] Selectable code highlight theme (e.g., GitHub, Night Owl); lazy-load CSS for chosen theme. (files: `app/globals.css`, wiring in page)
- [ ] Debounce editor updates (200–300ms) and `useMemo` the rendered tree for large docs. (files: `app/page.tsx`, `components`)
- [ ] Dynamic import for heavy plugins (e.g., `rehype-highlight`) to cut initial bundle. (files: `components/MarkdownPreview.tsx`)

## Phase 4 — DX, Quality, Docs

- [ ] ESLint setup (Next/React/TS rules) and Prettier; add `lint`, `format` npm scripts. (files: root configs)
- [ ] README with setup, features, security notes, keyboard shortcuts. (files: `README.md`)
- [ ] CI via GitHub Actions: typecheck, lint, build, run tests on PRs. (files: `.github/workflows/ci.yml`)

## Testing

- [ ] Unit tests for Markdown components (Jest + RTL). (files: `components/**`)
- [ ] E2E smoke: type in editor, verify preview updates; import/export flows. (Playwright). (files: `e2e/**`)

## Stretch Goals

- [ ] Shareable URLs by compressing content into the hash (e.g., `lz-string`). (files: `app/page.tsx`)
- [ ] KaTeX math support (opt-in; lazy-load). (files: `components/MarkdownPreview.tsx`)
- [ ] Mermaid diagrams for flowcharts/sequence (opt-in; lazy-load). (files: `components/MarkdownPreview.tsx`)
- [ ] File System Access API for open/save on supported browsers. (files: `app/page.tsx`)
- [ ] PWA + offline support; cache highlight themes. (files: `public/manifest.json`, service worker)
- [ ] Print/PDF-friendly “document” view. (files: `app/page.tsx`, CSS)

## Notes / Observations

- `rehype-raw` without sanitization is a security risk; Phase 1 addresses this.
- `components/MarkdownPreview.tsx` uses `any` for the `code` component props; replace with typed props.
- `lib/` is empty; consider removing or using for shared hooks/utils (e.g., storage, debounce).
- Tailwind v4 setup looks good; keep `@tailwindcss/typography` plugin. Consider ESM import style later if desired.

## Done

- [ ] Create and adopt `todo.md` as the single source of truth for task tracking.
