# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entrypoints (`page.tsx`, `layout.tsx`) and `globals.css`.
- `components/`: UI modules (e.g., `MarkdownEditor.tsx`, `MarkdownPreview.tsx`).
- `lib/`: Shared utilities/hooks (add `useXyz.ts` here).
- `public/`: Static assets (SVGs, icons).
- Root config: `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`.
- Tracking: `todo.md` is the single source of truth for tasks.
- Do not modify `.next/` or `node_modules/`.

## Build, Test, and Development Commands

- `npm ci`: Install dependencies (use `npm`; lockfile present).
- `npm run dev`: Start local dev with Turbopack at `http://localhost:3000`.
- `npm run build`: Create production build.
- `npm run start`: Serve the production build.
- Node 18.18+ (or 20+) required.

## Coding Style & Naming Conventions

- Language: TypeScript; prefer explicit types; avoid `any`.
- Components: PascalCase (e.g., `MarkdownPreview.tsx`).
- Hooks: camelCase starting with `use` (e.g., `useXyz.ts`).
- Indentation: 2 spaces; order imports external → internal.
- Styling: Tailwind CSS; prefer utilities; use `prose` for markdown content.
- Layout: keep pages full-width (avoid global `max-w-*` wrappers unless scoped to a specific component).
- Performance: keep syntax highlighting CSS local (no CDN fetches) and lazy-load highlight plugins.

## Testing Guidelines

- Not yet configured. When adding:
  - Unit: Jest + React Testing Library in `__tests__/**/*.test.tsx`.
  - E2E: Playwright in `e2e/**/*.spec.ts`.
  - Coverage: target ≥70% lines on changed code.
  - Commands: `npm test` and `npx playwright test`.

## Commit & Pull Request Guidelines

- Conventional Commits (e.g., `feat: add localStorage persistence`, `fix: sanitize HTML in preview`).
- PRs: concise description, linked issues, and screenshots/GIFs for UI changes.
- Keep PRs focused; update docs (`todo.md`, `README.md`) when behavior changes.

## Security & Configuration Tips

- Rendering: Avoid unsafe HTML. Use `rehype-sanitize` with a safe schema; pair `rehype-raw` only if necessary.
- Secrets: Do not commit `.env*`; respect `.gitignore`.
- Tailwind: Update `content` in `tailwind.config.ts` when adding paths.
