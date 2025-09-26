# Copilot Instructions for md-view

Fast orientation for AI agents working on this Next.js 15 + React 19 markdown editor.

## Architecture snapshot

- `app/page.tsx` owns global state (view mode, drag ratio, theme, debounce, localStorage `mdv:*` keys) and wires imports/exports, copy-to-clipboard, DocumentView overlay, mobile QuickActions, and floating ToC.
- `components/RichMarkdownEditor.tsx` wraps `<MarkdownEditor>` with toolbar actions, a 500 ms undo/redo history, and line-aware heading/quote transforms.
- `components/MarkdownEditor.tsx` is the controlled `<textarea>`; it reports scroll %, mirrors external scroll commands, shows a custom context menu, and runs `formatMarkdown` on Shift+Alt+F.
- `components/MarkdownPreview.tsx` renders markdown via `react-markdown` + `remark-gfm`, lazy-loads `rehype-highlight`, injects theme CSS into the `<style id="theme-custom-styles">` tag, and builds slug IDs with `slugify(getNodeText(...))` for ToC/deep links.
- Supporting surfaces: `DocumentView` (print/PDF panel using `MarkdownPreview` variant), `TableOfContents` (active heading tracking), `QuickActionsMenu` (mobile utilities), `ViewModeSelector`, `ThemeSelector`/`CompactThemeSelector`.
- Theme definitions live in `lib/themes.ts`; analytics wiring sits in `components/Analytics.tsx` + `lib/gtag.ts`.

## Interaction & state invariants

- Preserve localStorage keys (`mdv:content`, `mdv:ratio`, `mdv:theme`, `mdv:viewMode`) and mobile logic that avoids split mode by default.
- Scroll sync relies on each pane emitting percentages while guarding with `isScrollingSelfRef` flags; resetting view mode clears queued percentages.
- Split layout depends on `flex-1 min-h-0` wrappers and the drag handle clamping ratios between 0.2–0.8; don't break the `isDraggingRef` lifecycle.
- Table of contents stays hidden until headings exist and the user toggles it; active heading updates come from preview scroll events and `requestAnimationFrame`.
- Document view adds a `document-view-open` class to `<body>`, locks scrolling, and closes on Escape/backdrop clicks.

## Editing experience

- Toolbar actions in `RichMarkdownEditor` mutate the current selection/line; keep selection restoration logic when extending styles.
- The context menu (`ContextMenu.tsx`) is positioned at click coordinates and closes on outside click/Escape; formatting guard `isFormatting` prevents concurrent jobs.
- `lib/formatter.ts` is a lightweight markdown formatter (not Prettier) that skips code fences, normalizes lists/headings, and wraps long paragraphs.

## Markdown rendering, export, and safety

- `MarkdownPreview` sets `skipHtml`; if you ever enable raw HTML, also wire `rehype-raw` + sanitize (see `AGENTS.md`).
- Code block UI in `MarkdownPreview` adds copy buttons/language badges flagged with `data-no-export` so exports strip them.
- `getSerializablePreview` (in `app/page.tsx`) clones the preview DOM, removes `[data-no-export]`, combines inline defaults with theme custom CSS, and feeds exports, clipboard copy, and DocumentView.
- Theme switching swaps highlight.js CDN styles (`github.min.css` vs `github-dark.min.css`) depending on the active theme name.

## Developer workflows

- Use `npm ci` for installs; Turbopack powers `npm run dev`/`npm run build`, and `npm run start` serves the production build.
- Quality gates: `npm run lint`, `npm run typecheck`, `npm run format` or `npm run format:check`.
- `scripts/xss-check.mjs` is available for optional sanitization spot-checks when touching markdown rendering.

## Key references

- Keyboard view-mode shortcuts: see global keydown handler in `app/page.tsx`.
- Toolbar wiring lives in `components/Toolbar.tsx`; markdown tips live in `app/guide/page.tsx`.
- Table of contents item type exported as `TocHeading` from `components/TableOfContents.tsx` for reuse in new features.

When extending the app, keep scroll sync intact, maintain `[data-no-export]` on UI-only markup, respect the `mdv:*` persistence contract, and leave `skipHtml` safeguards in place.
