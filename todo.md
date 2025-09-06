# md-view TO## Phase 2 — Core UX

- [x] Persist content to `localStorage` (key: `mdv:content`) with a 300ms debounce. Load at start; provide "Reset sample" action. (files: `app/page.tsx`)
- [x] Import `.md` via file input; read as text and load into editor. (files: `app/page.tsx`)
- [x] Support drag-and-drop of `.md` files into the editor area. (wrapper in `app/page.tsx`)
- [x] Export current content as `.md` file download. (files: `app/page.tsx`)
- [x] Export rendered preview as standalone `.html` (inline CSS). (files: `app/page.tsx`)
- [x] Resizable split panes with a draggable divider; persist ratio in `localStorage`. (files: `app/page.tsx`)
- [x] Multiple view modes: Editor-only, Preview-only, and Split view with keyboard shortcuts (Ctrl/Cmd+1/2/3). (files: `app/page.tsx`, `components/ViewModeSelector.tsx`)
- [x] Enhanced navigation bar with grouped actions, responsive design, document stats, and mobile quick actions menu. (files: `app/page.tsx`, `components/CompactThemeSelector.tsx`, `components/QuickActionsMenu.tsx`)
- [x] **Scroll synchronization**: Editor and preview panes sync scroll position in split view mode. (files: `components/MarkdownEditor.tsx`, `components/MarkdownPreview.tsx`, `app/page.tsx`)
- [x] **Improved responsive header**: Hide text labels on small screens, more compact mobile layout, better button spacing. (files: `app/page.tsx`, `components/ViewModeSelector.tsx`)
- [x] Sticky mobile toolbar for view mode switching. (files: `app/page.tsx`)
      us: tracking backlog for the markdown editor/preview app. Check items as they land; keep sections in roughly priority order.

## Phase 1 — Security & Essentials

- [x] Secure HTML handling: disable raw HTML rendering via `skipHtml` and remove `rehype-raw` to eliminate XSS risk. (files: `components/MarkdownPreview.tsx`)
- [x] Add a regression script for XSS payloads (verifies no `<img ... onerror>` is rendered). (files: `scripts/xss-check.mjs`)
- [x] Tighten types in markdown renderer; remove `any` and use `Components` typing from `react-markdown`. (files: `components/MarkdownPreview.tsx`)

Note: In offline environments without new deps, we use `skipHtml`. When dependency installs are allowed, switch to `rehype-sanitize` with a safe schema to allow limited inline HTML if needed.

## Phase 2 — Core UX

- [x] Persist content to `localStorage` (key: `mdv:content`) with a 300ms debounce. Load at start; provide “Reset sample” action. (files: `app/page.tsx`)
- [x] Import `.md` via file input; read as text and load into editor. (files: `app/page.tsx`)
- [x] Support drag-and-drop of `.md` files into the editor area. (wrapper in `app/page.tsx`)
- [x] Export current content as `.md` file download. (files: `app/page.tsx`)
- [x] Export rendered preview as standalone `.html` (inline CSS). (files: `app/page.tsx`)
- [x] Resizable split panes with a draggable divider; persist ratio in `localStorage`. (files: `app/page.tsx`)

## Phase 3 — Theming & Performance

- [x] Multiple preview themes: GitHub, Notion, Medium, Paper, Minimal, Terminal, Dark with theme selector. (files: `lib/themes.ts`, `components/ThemeSelector.tsx`, `components/MarkdownPreview.tsx`, `app/page.tsx`)
- [ ] Theme toggle: system/light/dark with `darkMode: 'class'`, persisted in `localStorage`, respects system changes. (files: `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`)
- [ ] Selectable code highlight theme (GitHub, GitHub Dark, Night Owl) using scoped CSS overrides; export honors selection. (files: `app/globals.css`, `app/page.tsx`)
- [x] Debounce preview updates (~200ms) to improve responsiveness on large docs. (files: `app/page.tsx`)
- [x] Dynamic import for `rehype-highlight` to reduce initial bundle. (files: `components/MarkdownPreview.tsx`)

## Phase 4 — DX, Quality, Docs

- [x] ESLint setup (Next/React/TS rules) and Prettier; add `lint`, `format` npm scripts. (files: root configs)
- [x] README with setup, features, security notes. (files: `README.md`)
- [x] Update Guide page to reflect features and include Markdown intro. (files: `app/guide/page.tsx`)
- [x] Add Google Analytics (gtag) with route-change tracking. (files: `app/layout.tsx`, `components/Analytics.tsx`, `lib/gtag.ts`)

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
- `components/MarkdownPreview.tsx` is typed via `Components` from `react-markdown`; keep strict typings.
- `lib/gtag.ts` added for GA helpers; consider adding shared storage/debounce utils under `lib/`.
- Tailwind v4 setup looks good; keep `@tailwindcss/typography` plugin. Consider ESM import style later if desired.

## Done

- [ ] Create and adopt `todo.md` as the single source of truth for task tracking.
