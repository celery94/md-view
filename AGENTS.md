# Repository Guidelines

## Purpose

MD-View is a Next.js App Router markdown workspace with:

- live editor/preview panes
- multiple publish-style themes
- markdown/html/image export
- URL-to-markdown import API
- local persistence in browser storage

Use this file as the implementation-accurate guide for contributors and coding agents.

## Runtime and Stack

- Node: `>=20.9.0` (from `next@16` engine requirement)
- Framework: Next.js 16 + React 19 + TypeScript 5
- Styling: Tailwind CSS v4 (`@tailwindcss/postcss`, typography plugin)
- Markdown render: `react-markdown` + `remark-gfm` + lazy `rehype-highlight`
- URL import pipeline: `fetch` + `jsdom` + `@mozilla/readability` + `turndown`

## Project Structure

- `app/`
  - `page.tsx`: primary editor/preview app shell
  - `api/import-url/route.ts`: server URL import endpoint
  - `guide/page.tsx`: feature and markdown usage guide page
  - `layout.tsx`: metadata, GA bootstrapping, fonts, global scripts
  - `globals.css`: global styles, markdown baseline styles, animations
- `components/`
  - Active in app shell: `MarkdownEditor`, `RichMarkdownEditor`, `MarkdownPreview`, `Toolbar`, theme/view selectors, `Footer`
  - Utility but currently not wired into routes: `QuickActionsMenu`, `TableOfContents`, `JsonLd`
- `lib/`
  - `themes.ts`: preview theme registry and CSS payloads
  - `clipboard-inline-html.ts`: inline-style clipboard/export HTML builder
  - `url-import.ts`: URL validation/fetch/extract/convert pipeline
  - `formatter.ts`: built-in markdown formatter used by editor shortcut/context menu
  - misc helpers: `cn.ts`, `slugify.ts`, `gtag.ts`, `seo-utils.ts`
- `scripts/xss-check.mjs`: standalone XSS regression check (no test framework required)
- `public/`: static assets and metadata files (`manifest.json`, `robots.txt`, etc.)

Do not modify `.next/` or `node_modules/`.

## Current Product Behavior (Source of Truth)

- View modes: `editor | split | preview` with `Ctrl/Cmd + 1/2/3`
- Mobile behavior: split mode hidden/disabled; auto-fallback to editor mode
- Scroll sync in split mode between editor and preview
- Floating "scroll to top" appears once any tracked scroll area reaches 25%
- Persistence keys in `localStorage`:
  - `mdv:content`
  - `mdv:ratio`
  - `mdv:theme`
  - `mdv:viewMode`
- Export options:
  - markdown file
  - themed HTML
  - PNG snapshot via `@zumer/snapdom`
  - copy inline HTML/plain text clipboard payload
- Themes (9): `default`, `wechat-publish`, `dark`, `github`, `notion`, `medium`, `paper`, `minimal`, `terminal`

## URL Import API Constraints

From `lib/url-import.ts` and `app/api/import-url/route.ts`:

- only `http(s)` URLs
- blocks localhost/private/internal hosts (with DNS resolution checks)
- manual redirect handling (max 3 redirects)
- timeout: 12 seconds
- response size cap: 3 MB
- only HTML/XHTML content types accepted
- non-OK and parse failures return typed API errors

## Build, Run, and Validation

- Install: `npm ci`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Optional security smoke check: `node scripts/xss-check.mjs`

## Coding Conventions

- TypeScript strict mode; avoid introducing `any` unless unavoidable.
- Keep component names PascalCase and utility names descriptive.
- Keep imports ordered: external first, then internal.
- Prefer Tailwind utilities and existing `ui` class maps in `lib/ui-classes.ts`.
- Keep syntax highlighting styles local; do not add CDN style dependencies.
- When adding UI behavior, keep desktop/mobile parity explicit.

## Security and Privacy Rules

- Markdown rendering in-app currently uses `skipHtml` (raw HTML is ignored).
- Do not weaken URL import SSRF protections in `lib/url-import.ts`.
- Keep security headers and redirects in `next.config.ts` intact unless intentionally changed.
- Do not commit secrets (`.env*`) or new tracking identifiers without explicit approval.

## Pull Request Expectations

- Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).
- Keep PR scope focused and include screenshots/GIFs for UI changes.
- Run lint + typecheck before opening/merging.
- Update `README.md` and this `AGENTS.md` when behavior, scripts, architecture, or constraints change.
