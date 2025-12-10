# Copilot Instructions for md-view

Fast orientation for AI agents working on this Next.js 15 + React 19 Markdown editor. Keep guidance concise and specific to this repo.

## Architecture map

- `app/page.tsx` is the orchestrator: owns global state (view mode, drag ratio, theme, debounce, `mdv:*` localStorage), wires import/export/download, clipboard copy, DocumentView overlay, mobile QuickActions, ToC toggle, and scroll sync.
- Editor stack: `RichMarkdownEditor` wraps `MarkdownEditor` (controlled `<textarea>` with custom context menu, scroll reporting, external scroll commands, Shift+Alt+F → `formatMarkdown`). Toolbar logic lives in `components/Toolbar.tsx`.
- Preview stack: `MarkdownPreview` renders via `react-markdown` + `remark-gfm`, lazy-loads `rehype-highlight`, injects theme CSS into `<style id="theme-custom-styles">`, and slugifies headings with `lib/slugify` for ToC/deep links.
- Surfaces: `DocumentView` (print/PDF overlay using preview variant), `TableOfContents` (active heading tracking), `QuickActionsMenu` (mobile utility sheet), `ViewModeSelector`, `ThemeSelector`/`CompactThemeSelector`, `Footer`, `Analytics` (gtag wiring).
- Themes and prose classes live in `lib/themes.ts`; SEO/structured data in `components/JsonLd.tsx` and `app/layout.tsx`.

## Invariants & interaction contracts

- Persisted keys: `mdv:content`, `mdv:ratio` (clamped 0.2–0.8), `mdv:theme`, `mdv:viewMode`. On mobile, default away from split view.
- Scroll sync: each pane emits scroll %, guarded by `isScrollingSelfRef`; switching view modes resets pending percentages.
- Layout stability: keep `flex-1 min-h-0` wrappers around panes; drag handle relies on `isDraggingRef` lifecycle and ratio clamps.
- ToC visibility: hidden until headings exist and the user toggles it; active heading updates via preview scroll + `requestAnimationFrame`.
- DocumentView: adds `document-view-open` on `<body>`, locks scroll, closes on Escape/backdrop; strip `[data-no-export]` elements during export/clipboard copy.
- Safety: `MarkdownPreview` uses `skipHtml`; if enabling raw HTML, also add `rehype-raw` + sanitization (see `AGENTS.md`).

## Markdown pipeline & styling

- Code blocks get copy buttons and language badges flagged with `data-no-export`; syntax highlighting theme switches via highlight.js CDN CSS (github vs github-dark) based on current theme.
- `getSerializablePreview` (in `app/page.tsx`) clones preview DOM, merges inline export styles with theme custom CSS, and feeds exports/clipboard/DocumentView.
- `lib/formatter.ts` is a lightweight formatter (skips code fences, normalizes lists/headings, wraps long paragraphs); keep selection restoration in toolbar actions.

## Developer workflows

- Node 18.18+ (or 20+). Install with `npm ci`; Turbopack backs `npm run dev`/`npm run build`; `npm run start` serves prod build.
- Quality gates: `npm run lint`, `npm run typecheck`, `npm run format` or `npm run format:check`. Optional: `node scripts/xss-check.mjs` when touching rendering/sanitization.

## Conventions & references

- TypeScript, 2-space indent, PascalCase components, `useX` hooks; Tailwind utilities + `@tailwindcss/typography` prose classes.
- Keep `[data-no-export]` on UI-only preview adornments; preserve slug generation for headings; respect `mdv:*` persistence contract.
- Keyboard shortcuts (Cmd/Ctrl+1/2/3) live in `app/page.tsx`; markdown tips in `app/guide/page.tsx`; ToC type `TocHeading` exported from `components/TableOfContents.tsx`.

When extending features, prefer reusing `MarkdownPreview`/`RichMarkdownEditor` plumbing, keep scroll sync intact, and leave `skipHtml` safeguards unless adding proper sanitization.
