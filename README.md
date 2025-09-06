# MD-View - Free Online Markdown Editor with Live Preview

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, free, and open-source real-time Markdown editor with live preview, built with modern web technologies. Perfect for developers, writers, and anyone who works with Markdown documentation.

🌐 **[Try it live](https://md-view.vercel.app)** | 📖 **[Documentation](#-features)** | 🐛 **[Report Issues](https://github.com/celery94/md-view/issues)**

## ✨ Features

- 🚀 **Real-time Live Preview** - See your markdown rendered instantly as you type
- 📝 **GitHub Flavored Markdown** - Full support for tables, task lists, strikethrough, and more
- 🎨 **Syntax Highlighting** - Beautiful code syntax highlighting for 100+ programming languages
- 🌓 **Dark Mode Support** - Comfortable editing in both light and dark themes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 📲 **Mobile Toolbar** - Sticky bottom view mode switch for quick access on small screens
- 📂 **Import/Export** - Load `.md` files and export to `.md` or `.html` formats
- 🔒 **Privacy-Focused** - Your content stays in your browser, no data sent to servers
- ⚡ **Fast & Lightweight** - Built with Next.js 15 and React 19 for optimal performance
- ♿ **Accessible** - Full keyboard navigation and screen reader support
- 🆓 **Completely Free** - No registration required, no premium features

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/celery94/md-view.git
cd md-view

# Install dependencies
npm install

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
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)
- **Icons**: SVG icons optimized for web

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run typecheck` - TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔒 Security

- Raw HTML in markdown is disabled by default (`skipHtml: true`) to prevent XSS attacks
- Content is sanitized and rendered safely
- No external data collection or tracking

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
