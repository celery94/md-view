# md-view

A real-time Markdown editor and previewer built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Quick Start

- Install: `npm install`
- Dev: `npm run dev` → <http://localhost:3000>
- Build: `npm run build` then `npm run start`

## Features

- Live preview with GitHub Flavored Markdown and syntax highlighting.
- Secure rendering (HTML disabled by default to prevent XSS).
- Import `.md` via file picker or drag-and-drop.
- Export as `.md` or standalone `.html` (inline CSS).
- Resizable split panes; theme toggle (System/Light/Dark); selectable code theme.

## Commands

- `npm run typecheck`: TypeScript type checking (no emit).
- `npm run lint`: Lint code with ESLint (Next core-web-vitals rules).
- `npm run format`: Format code with Prettier.
- `npm run format:check`: Check formatting.

## Security Notes

- Raw HTML in markdown is not rendered (`skipHtml: true`).
- If enabling inline HTML in the future, add `rehype-sanitize` with a safe schema and keep `rehype-highlight` class allowances.

## Tips

- Tasks and roadmap: see `todo.md`.
- Code themes are scoped with classes like `code-theme-github`.
- Editor content and pane ratio persist in `localStorage` (`mdv:*`).
