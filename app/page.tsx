"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";

const initialMarkdown = `# MD-View: Free Online Markdown Editor with Live Preview

Welcome to **MD-View**, the best free online markdown editor with real-time preview! This powerful web-based tool is perfect for developers, writers, and anyone who works with markdown documentation.

## 🚀 Key Features

- ✅ **Real-time Live Preview** - See your markdown rendered instantly as you type
- ✅ **GitHub Flavored Markdown** - Full support for GFM including tables, task lists, and more
- ✅ **Syntax Highlighting** - Beautiful code syntax highlighting for 100+ programming languages
- ✅ **Dark Mode Support** - Comfortable editing in both light and dark themes
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✅ **Import/Export** - Load markdown files and export to .md or .html formats
- ✅ **Free & Open Source** - No registration required, completely free to use

## 📝 Perfect for Documentation

MD-View is ideal for creating:
- Technical documentation
- README files for GitHub projects
- Blog posts and articles
- Notes and personal documentation
- API documentation
- Project wikis

## 💻 Example Code Block with Syntax Highlighting

\`\`\`javascript
// MD-View supports syntax highlighting for many languages
function createMarkdownEditor(options) {
  const editor = {
    content: '',
    preview: true,
    syntax: 'gfm'
  };
  
  return {
    write: (text) => editor.content = text,
    render: () => parseMarkdown(editor.content),
    export: (format) => download(editor.content, format)
  };
}

const mdEditor = createMarkdownEditor();
mdEditor.write('# Hello World!');
\`\`\`

## 📊 Feature Comparison Table

| Feature | MD-View | Other Editors |
|---------|---------|---------------|
| Real-time preview | ✅ | ❌/⚠️ |
| GitHub Flavored Markdown | ✅ | ⚠️ |
| Syntax highlighting | ✅ | ⚠️ |
| Free to use | ✅ | ❌ |
| No registration | ✅ | ❌ |
| Responsive design | ✅ | ⚠️ |

## 🎯 Getting Started

1. **Start typing** in the editor panel on the left
2. **See live preview** in the panel on the right  
3. **Import existing files** using the "Import .md" button
4. **Export your work** as markdown or HTML; use your browser's Print to PDF for a PDF copy

## 📋 Task Lists and Formatting

### Development Roadmap
- [x] Core markdown editor functionality
- [x] Real-time preview rendering
- [x] Syntax highlighting integration
- [x] Dark mode support
- [x] Responsive mobile design
- [ ] Plugin system for extensions
- [ ] Collaborative editing features
- [ ] Cloud save functionality

### Text Formatting Examples

**Bold text** and *italic text* work perfectly. You can also use ~~strikethrough~~ text and \`inline code\`.

> **Pro Tip:** MD-View automatically saves your work locally, so you won't lose your progress even if you refresh the page!

## 🌐 Why Choose MD-View?

MD-View stands out from other markdown editors because it's:

- **Completely Free** - No hidden costs or premium features
- **Privacy-Focused** - Your content stays in your browser
- **Fast & Lightweight** - Loads instantly with no bloat
- **Standards-Compliant** - Follows GitHub Flavored Markdown specifications
- **Accessible** - Works with screen readers and keyboard navigation

Start editing this text to see the magic happen! Your markdown will be rendered in real-time in the preview panel.

---

*Built with ❤️ using Next.js, React, and modern web technologies. Open source and available on [GitHub](https://github.com/celery94/md-view).*
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(initialMarkdown);
  const [ratio, setRatio] = useState<number>(0.5);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mdv:content");
      if (saved) setMarkdown(saved);
      const savedRatio = localStorage.getItem("mdv:ratio");
      if (savedRatio) setRatio(Math.min(0.8, Math.max(0.2, Number(savedRatio))));
    } catch {}
  }, []);

  // Persist with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("mdv:content", markdown);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [markdown]);

  // Debounce preview updates for performance
  useEffect(() => {
    const t = setTimeout(() => setDebouncedMarkdown(markdown), 200);
    return () => clearTimeout(t);
  }, [markdown]);

  // Persist split ratio
  useEffect(() => {
    try {
      localStorage.setItem("mdv:ratio", String(ratio));
    } catch {}
  }, [ratio]);

  const startDrag = useCallback(() => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newRatio = Math.min(0.8, Math.max(0.2, x / rect.width));
      setRatio(newRatio);
    }
    function onUp() {
      if (isDraggingRef.current) stopDrag();
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [stopDrag]);

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChosen = useCallback((file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setMarkdown(reader.result);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    onFileChosen(f);
  }, [onFileChosen]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetSample = useCallback(() => setMarkdown(initialMarkdown), []);

  const download = useCallback((name: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportMarkdown = useCallback(() => {
    download("document.md", markdown, "text/markdown;charset=utf-8");
  }, [download, markdown]);

  const exportHtml = useCallback(() => {
    const htmlContent = previewRef.current?.innerHTML ?? "";
    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${inlineStyles}</style></head><body><main class=\"prose prose-slate\">${htmlContent}</main></body></html>`;
    download("document.html", doc, "text/html;charset=utf-8");
  }, [download]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MD-View - Markdown Editor</h1>
            <p className="text-gray-600 text-sm">Real-time markdown editor with live preview. Edit markdown, export HTML, and print to PDF with syntax highlighting and GFM support.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2" role="navigation" aria-label="File operations">
            <Link 
              href="/guide"
              className="px-3 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
              title="Markdown guide and tips"
            >
              Guide
            </Link>
            <button 
              onClick={onPickFile} 
              className="px-3 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
              aria-label="Import markdown file"
              title="Import .md file"
            >
              Import .md
            </button>
            <button 
              onClick={exportMarkdown} 
              className="px-3 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
              aria-label="Export as markdown file"
              title="Export as .md file"
            >
              Export .md
            </button>
            <button 
              onClick={exportHtml} 
              className="px-3 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
              aria-label="Export as HTML file"
              title="Export as .html file"
            >
              Export .html
            </button>
            <button 
              onClick={resetSample} 
              className="px-3 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
              aria-label="Reset to sample content"
              title="Reset to sample markdown"
            >
              Reset sample
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              className="hidden"
              onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
              aria-label="File input for markdown files"
            />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main ref={containerRef} className="flex-1 flex flex-col md:flex-row overflow-hidden" role="main">
        {/* Editor panel */}
        <section
          className="w-full md:h-auto p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col"
          style={{ width: "100%", flexBasis: `${ratio * 100}%` }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          aria-label="Markdown editor section"
        >
          <div className="mb-3 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-700">Markdown Editor</h2>
            <p className="text-xs text-gray-500">Type your markdown here or drop a .md file to load it</p>
          </div>
          <div className="flex-1 min-h-0 h-64 md:h-auto">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </section>

        {/* Divider (desktop only) */}
        <div
          onMouseDown={startDrag}
          className="hidden md:block w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize"
          style={{ userSelect: "none" }}
          aria-label="Resize editor and preview panels"
          role="separator"
          aria-orientation="vertical"
          tabIndex={0}
          title="Drag to resize panels"
        />

        {/* Preview panel */}
        <section className="w-full p-4 flex flex-col" style={{ width: "100%", flexBasis: `${(1 - ratio) * 100}%` }} aria-label="Markdown preview section">
          <div className="mb-3 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
            <p className="text-xs text-gray-500">Real-time rendered markdown with syntax highlighting</p>
          </div>
          <div className="flex-1 min-h-0 h-64 md:h-auto">
            <MarkdownPreview ref={previewRef} content={debouncedMarkdown} />
          </div>
        </section>
      </main>
    </div>
  );
}

// Minimal inline CSS for HTML export; focuses on readability and code blocks.
const inlineStyles = `
  :root { color-scheme: light; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 2rem; }
  .prose { max-width: 72ch; }
  pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow: auto; }
  code { background: #f5f5f5; padding: .125rem .25rem; border-radius: 4px; font-size: .9em; }
  h1,h2,h3,h4,h5,h6 { margin: 1.5rem 0 .75rem; font-weight: 600; }
  blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th,td { border: 1px solid #d1d5db; padding: .5rem .75rem; }
  th { background: #f9fafb; }
`;
