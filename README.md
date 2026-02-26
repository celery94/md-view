# MD-View

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MD-View is a free, open-source markdown workspace with real-time preview, publishing themes, export tools, and URL-to-markdown import.

- Live site: https://www.md-view.com/
- Guide page: https://www.md-view.com/guide
- Issues: https://github.com/celery94/md-view/issues

## Highlights

- Real-time markdown preview with `react-markdown` + `remark-gfm`
- Syntax-highlighted fenced code blocks with language badge and copy button
- 9 themes: `default`, `wechat-publish`, `dark`, `github`, `notion`, `medium`, `paper`, `minimal`, `terminal`
- Editor/preview/split modes with draggable split ratio and scroll sync
- Markdown formatting shortcuts and context menu formatter (`Shift+Alt+F`)
- Import markdown from:
  - local `.md/.markdown/.txt` files
  - public URLs via server-side readability extraction
- Export options:
  - `.md`
  - themed standalone `.html`
  - `.png` snapshot from preview
  - copy inline rich HTML + plain text to clipboard
- Local persistence: content, view mode, theme, split ratio
- Mobile-safe behavior: split mode is disabled on small screens
- Floating "scroll to top" action appears after 25% scroll

## Security Model

- Markdown render uses `skipHtml`, so raw HTML from markdown is not rendered.
- URL import blocks local/private targets and validates redirects.
- URL import constraints:
  - timeout: 12 seconds
  - max redirects: 3
  - max response size: 3 MB
  - content type: HTML/XHTML only
- App-wide security headers are set in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, etc.).

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS v4 + Typography plugin
- `react-markdown`, `remark-gfm`, lazy `rehype-highlight`
- `@mozilla/readability` + `jsdom` + `turndown` for URL import conversion
- `@zumer/snapdom` for preview image export

## Getting Started

### Requirements

- Node.js `>=20.9.0`
- npm (lockfile is present)

### Local Development

```bash
git clone https://github.com/celery94/md-view.git
cd md-view
npm ci
npm run dev
```

Open http://localhost:3000

### Production

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev`: start dev server with Turbopack
- `npm run build`: production build with Turbopack
- `npm run start`: run production server
- `npm run lint`: ESLint checks
- `npm run typecheck`: TypeScript checks (`tsc --noEmit`)
- `npm run format`: Prettier write
- `npm run format:check`: Prettier check
- `node scripts/xss-check.mjs`: lightweight XSS regression smoke test

## Repository Layout

- `app/`
  - `page.tsx`: main editor/preview workspace
  - `layout.tsx`: metadata, fonts, analytics bootstrap, structured data
  - `api/import-url/route.ts`: URL import API route
  - `guide/page.tsx`: product guide and markdown syntax reference
  - `globals.css`: shared visual system and markdown baseline styles
- `components/`
  - core UI: editor, preview, toolbar, view/theme selectors, footer
  - utility components are present for future use (`QuickActionsMenu`, `TableOfContents`, `JsonLd`)
- `lib/`
  - theme definitions and style payloads
  - clipboard inline-style exporter
  - URL import service and typed responses
  - formatter, class helper, slug helper, analytics helper
- `public/`
  - static site assets and PWA metadata
- `scripts/`
  - small standalone checks and tooling scripts

## Local Persistence Keys

Saved in browser `localStorage`:

- `mdv:content`
- `mdv:ratio`
- `mdv:theme`
- `mdv:viewMode`

## Environment Variables

- `NEXT_PUBLIC_GA_ID` (optional): overrides the default GA measurement ID used by the analytics helper.

## Contributing

1. Fork and branch from `main`
2. Make focused changes
3. Run checks:
   - `npm run lint`
   - `npm run typecheck`
4. Open a PR with a concise description and screenshots for UI changes

Use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`, etc.).

## License

MIT. See [LICENSE](LICENSE).
