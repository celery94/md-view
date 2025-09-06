# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entrypoints (`page.tsx`, `layout.tsx`) and global styles (`globals.css`).
- `components/`: UI modules (`MarkdownEditor.tsx`, `MarkdownPreview.tsx`).
- `public/`: Static assets (SVGs, icons).
- `lib/`: Shared utilities (currently empty; add hooks/helpers here).
- Root config: `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`.
- Tracking: `todo.md` is the single source of truth for tasks.

## Build, Test, and Development Commands

- `npm run dev`: Start local dev server with Turbopack (http://localhost:3000).
- `npm run build`: Production build.
- `npm run start`: Serve the production build.
- Node 18.18+ (or 20+) recommended. Use `npm` (repo includes `package-lock.json`).

## Coding Style & Naming Conventions

- Language: TypeScript. Prefer explicit types; avoid `any`.
- Components: PascalCase file names (`MyComponent.tsx`). Hooks: `useXyz` in camelCase.
- Indentation: 2 spaces; keep imports ordered (external → internal).
- Styling: Tailwind CSS; prefer utility classes over inline styles. Use `prose` for markdown content.
- Do not modify files in `.next/` or `node_modules/`.

## Testing Guidelines

- Tests not yet configured. When adding:
  - Unit: Jest + React Testing Library (`__tests__/**/*.test.tsx`).
  - E2E: Playwright (`e2e/**/*.spec.ts`).
  - Aim for ≥70% line coverage on changed code.
  - Add `npm test` and CI workflow in a follow-up PR.

## Commit & Pull Request Guidelines

- Commit style: Conventional Commits (observed `feat:` in history). Examples:
  - `feat: add localStorage persistence`
  - `fix: sanitize HTML in preview`
- PRs: concise description, linked issues, and screenshots/GIFs for UI changes.
- Keep PRs focused and update docs (`todo.md`, `README.md`) when behavior changes.

## Security & Configuration Tips

- Rendering: Avoid unsafe HTML. Use `rehype-sanitize` with a safe schema; pair carefully with `rehype-raw` only if necessary.
- Secrets: Do not commit `.env*`. Respect `.gitignore`.
- Tailwind: If adding paths, update `content` in `tailwind.config.ts`.
