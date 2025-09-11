# Copilot Instructions for md-view

Concise guidance for AI agents working on this Next.js Markdown editor. Focus on the concrete patterns and files used here.

## What this app is

- Real‑time Markdown editor with live preview, built on Next.js 15 (App Router), React 19, TypeScript, and Tailwind.
- Features: split/resize panes, scroll sync, themes, syntax highlighting, import/export, and keyboard view‑mode shortcuts.

## Architecture and key modules

- `app/page.tsx`: Orchestrates the UI and state. Manages view mode ('split' | 'editor' | 'preview'), pane ratio drag/resize, imports/exports, scroll sync, and persistence in localStorage (`mdv:content`, `mdv:ratio`, `mdv:theme`, `mdv:viewMode`).
- `components/RichMarkdownEditor.tsx`: Toolbar + `MarkdownEditor` wrapper. Implements editing commands (bold/italic/headers/quote/etc.) and simple undo/redo stacks.
- `components/MarkdownEditor.tsx`: Controlled `<textarea>` with `forwardRef`, independent scrolling, and scroll percentage reporting.
- `components/MarkdownPreview.tsx`: `react-markdown` renderer with `remark-gfm`, custom heading slug IDs (`lib/slugify.ts`), code block UI (copy button, language badge), and independent scrolling. Syntax highlighting via dynamic `rehype-highlight` import; theme CSS injected at runtime.
- `lib/themes.ts`: Theme registry returning CSS class sets and custom CSS used by preview; referenced via `getTheme(currentTheme)`.
- `lib/seo-utils.ts`, `components/JsonLd.tsx`, `app/sitemap.ts`: SEO utilities.

## Rendering + security

- Markdown: `react-markdown` with `remark-gfm` only; HTML is disabled (`skipHtml`). If enabling raw HTML later, pair `rehype-raw` with `rehype-sanitize` and a safe schema (see AGENTS.md security tips).
- Code blocks: UI controls are marked with `data-no-export` so export can strip them.

## Layout and interaction patterns

- Split layout: `flex-1 flex flex-col md:flex-row overflow-hidden` with each pane using `flex-1 min-h-0` and scrollable content (`h-full overflow-auto`). Mobile (< md) prefers single‑column and avoids split mode by default.
- Pane resize: draggable vertical separator in split mode; ratio persisted to localStorage.
- Scroll sync: editor and preview emit scroll percentages; the counterpart consumes them while guarding with an `isScrollingSelfRef` flag to avoid feedback loops.
- Keyboard: Ctrl/Cmd+1/2/3 toggles view modes (global handler in `app/page.tsx`).

## Import/Export

- Import: hidden file input accepts `.md` and reads text via FileReader.
- Export MD: download current source as `document.md`.
- Export HTML: clones preview DOM, removes `[data-no-export]`, wraps in minimal printable HTML with theme styles from `lib/themes.ts` and inline defaults from `app/page.tsx` (`inlineStyles`).

## Styling and themes

- Tailwind + `@tailwindcss/typography` for prose; preview applies theme classes from `getTheme(theme)` to container/prose.
- Syntax highlight CSS is loaded via CDN (`github.min.css` or `github-dark.min.css`) based on current theme, then concatenated with theme custom CSS into an injected `<style>` tag.

## Conventions

- TypeScript everywhere; components use `forwardRef` where refs are exposed. Avoid `any` except where required by `react-markdown` component typing.
- Imports ordered external → internal; components PascalCase; hooks in `lib/` as `useXyz.ts` if added.
- Accessibility: meaningful `aria-*` roles/labels on editor, preview, and controls.

## Dev workflows

- Node 18.18+ (or 20+). Commands:
  - `npm ci` — install
  - `npm run dev` — start dev server (Turbopack) at http://localhost:3000
  - `npm run build` — production build
  - `npm run start` — serve prod build
  - `npm run typecheck` / `npm run lint` / `npm run format`

## Examples to follow

- Heading IDs in preview: see `components/MarkdownPreview.tsx` using `slugify(getNodeText(children))`.
- Scroll sync wiring: `onScroll`/`scrollToPercentage` props across editor/preview with guard flags.
- Toolbar editing commands: `components/RichMarkdownEditor.tsx` `applyStyle` for bold/italic/headers/quote/etc.

When adding features, preserve: independent scrolling of panes, `min-h-0` in flex children, localStorage keys (`mdv:*`), and `skipHtml` safety.
