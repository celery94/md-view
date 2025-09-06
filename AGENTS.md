# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entrypoints (`page.tsx`, `layout.tsx`) and global styles (`globals.css`).
- `components/`: UI modules like `MarkdownEditor.tsx`, `MarkdownPreview.tsx`.
- `public/`: Static assets (SVGs, icons).
- `lib/`: Shared utilities/hooks (add `useXyz` here).
- Root config: `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`.
- Tracking: `todo.md` is the single source of truth for tasks.

## Build, Test, and Development Commands

- `npm run dev`: Start local dev with Turbopack at `http://localhost:3000`.
- `npm run build`: Create production build.
- `npm run start`: Serve the production build.
- Node 18.18+ (or 20+) required. Use `npm` (lockfile present).

## Coding Style & Naming Conventions

- Language: TypeScript. Prefer explicit types; avoid `any`.
- Naming: Components PascalCase (`MyComponent.tsx`); hooks camelCase starting with `use` (`useXyz.ts`).
- Indentation: 2 spaces. Imports ordered external → internal.
- Styling: Tailwind CSS; prefer utilities over inline styles. Use `prose` for markdown content.
- Do not modify `.next/` or `node_modules/`.

## Testing Guidelines

- Not yet configured. When adding:
  - Unit: Jest + React Testing Library in `__tests__/**/*.test.tsx`.
  - E2E: Playwright in `e2e/**/*.spec.ts`.
  - Coverage: target ≥70% lines on changed code.
  - Commands: `npm test` and `npx playwright test`.

## Commit & Pull Request Guidelines

- Conventional Commits (e.g., `feat: add localStorage persistence`, `fix: sanitize HTML in preview`).
- PRs: concise description, linked issues, screenshots/GIFs for UI changes.
- Keep PRs focused; update docs (`todo.md`, `README.md`) when behavior changes.

## Security & Configuration Tips

- Rendering: Avoid unsafe HTML. Use `rehype-sanitize` with a safe schema; pair carefully with `rehype-raw` only if necessary.
- Secrets: Do not commit `.env*`. Respect `.gitignore`.
- Tailwind: Update `content` in `tailwind.config.ts` when adding paths.
