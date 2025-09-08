# MD-View — Free Online Markdown Editor with Live Preview

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fast, free, and open‑source Markdown editor with a beautiful live preview. Built with modern web tech, perfect for docs, READMEs, notes, and blogs.

🌐 Live: https://md-view.vercel.app • Repo: https://github.com/celery94/md-view • Issues: https://github.com/celery94/md-view/issues

## ✨ Features

- Real‑time preview powered by `react-markdown` + GFM
- Eight themes: default, Dark, GitHub, Notion, Medium, Paper, Minimal, Terminal
- Syntax highlighting (highlight.js) with copy‑code buttons and language badges
- GFM extras: tables, task lists, strikethrough, autolinks
- Import `.md`, export `.md`/`.html` (print to PDF via browser)
- View modes: Editor, Preview, or Split with draggable resize
- Keyboard: Cmd/Ctrl+1/2/3 to switch view modes
- Mobile‑friendly, accessible roles/labels, localStorage persistence
- Safe by default: raw HTML rendering disabled

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/celery94/md-view.git
cd md-view

# Install dependencies (uses lockfile)
npm ci

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `@tailwindcss/typography`
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)
- **Icons**: [lucide-react](https://lucide.dev/icons)

## 🧭 App Structure

- `app/` — Next.js App Router entries (`page.tsx`, `layout.tsx`) and `globals.css`
- `components/` — UI modules (`MarkdownEditor.tsx`, `MarkdownPreview.tsx`, selectors, menus)
- `lib/` — Shared utilities, themes, SEO helpers
- `public/` — Static assets (icons, images)

Requires Node 18.18+ (or 20+).

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🧰 Usage Tips

- Switch themes from the preview header; state persists across reloads.
- Split view is resizable and sync‑scrolls between editor and preview.
- Use browser Print to save PDF (export HTML is also available).
- Headings receive stable IDs for deep links; visible “#” anchor icons are disabled by default for a cleaner look.

## 🔒 Security

- Raw HTML in markdown is disabled (`skipHtml: true`) to prevent XSS.
- Code highlighting uses `rehype-highlight`; HTML injection is not allowed.
- No external data collection; analytics (if enabled) is anonymized pageview only.

## 🎨 Styling & Markdown Details

- Typography via Tailwind `prose`; custom styles for code, tables, blockquotes.
- Lists are tuned for readability: dot bullets, consistent indent, improved markers; task lists align checkboxes with text.
- Images are lazy‑loaded and styled with borders/shadows.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Why MD-View?

- **No Vendor Lock-in**: Your content stays with you
- **Open Source**: Transparent, auditable, and free forever
- **Modern Tech**: Built with the latest web technologies
- **Performance First**: Optimized for speed and efficiency
- **User-Centric**: Designed with the user experience in mind

## 🔗 Links

- **Live Demo**: [https://md-view.vercel.app](https://md-view.vercel.app)
- **GitHub**: [https://github.com/celery94/md-view](https://github.com/celery94/md-view)
- **Issues**: [https://github.com/celery94/md-view/issues](https://github.com/celery94/md-view/issues)

---

Made with ❤️ by the MD-View team. Star ⭐ this repository if you find it useful!

## Tips

- Tasks and roadmap: see `todo.md`.
- Code themes are scoped with classes like `code-theme-github`.
- Editor content and pane ratio persist in `localStorage` (`mdv:*`).
