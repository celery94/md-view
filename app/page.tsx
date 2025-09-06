"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";

const initialMarkdown = `# Welcome to Markdown Preview

This is a **real-time markdown editor and preview** application built with Next.js.

## Features

- ✅ Live preview as you type
- ✅ GitHub Flavored Markdown support
- ✅ Syntax highlighting for code blocks
- ✅ Dark mode support
- ✅ Responsive design

## Example Code Block

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Markdown Preview!\`;
}

greetUser('Developer');
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Markdown parsing | ✅ |
| Live preview | ✅ |
| Syntax highlighting | ✅ |

## Blockquote

> "The best way to predict the future is to create it." - Peter Drucker

## Lists

### Todo List
- [x] Set up Next.js project
- [x] Install markdown dependencies
- [x] Create editor component
- [x] Create preview component
- [ ] Add more features

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Start editing in the left panel to see your markdown rendered in real-time!
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(initialMarkdown);
  const [ratio, setRatio] = useState<number>(0.5);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [codeTheme, setCodeTheme] = useState<'github' | 'github-dark' | 'night-owl'>('github');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mdv:content");
      if (saved) setMarkdown(saved);
      const savedRatio = localStorage.getItem("mdv:ratio");
      if (savedRatio) setRatio(Math.min(0.8, Math.max(0.2, Number(savedRatio))));
      const savedTheme = localStorage.getItem('mdv:theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        setTheme(savedTheme);
      }
      const savedCodeTheme = localStorage.getItem('mdv:code-theme');
      if (savedCodeTheme === 'github' || savedCodeTheme === 'github-dark' || savedCodeTheme === 'night-owl') {
        setCodeTheme(savedCodeTheme as any);
      }
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

  // Apply theme (darkMode: 'class')
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = theme === 'dark' || (theme === 'system' && systemDark);
      root.classList.toggle('dark', dark);
    };
    apply();
    localStorage.setItem('mdv:theme', theme);
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => apply();
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [theme]);

  // Persist code theme
  useEffect(() => {
    try { localStorage.setItem('mdv:code-theme', codeTheme); } catch {}
  }, [codeTheme]);

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
    const codeThemeClass = `code-theme-${codeTheme}`;
    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${inlineStyles}</style></head><body><main class=\"prose prose-slate ${codeThemeClass}\">${htmlContent}</main></body></html>`;
    download("document.html", doc, "text/html;charset=utf-8");
  }, [download, codeTheme]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Markdown Preview</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Real-time markdown editor and preview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onPickFile} className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Import .md</button>
            <button onClick={exportMarkdown} className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Export .md</button>
            <button onClick={exportHtml} className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Export .html</button>
            <button onClick={resetSample} className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Reset sample</button>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="px-2 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              title="Theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <select
              value={codeTheme}
              onChange={(e) => setCodeTheme(e.target.value as any)}
              className="px-2 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              title="Code theme"
            >
              <option value="github">GitHub</option>
              <option value="github-dark">GitHub Dark</option>
              <option value="night-owl">Night Owl</option>
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,text/markdown,text/plain"
              className="hidden"
              onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div ref={containerRef} className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor panel */}
        <div
          className="w-full md:h-auto p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ width: "100%", flexBasis: `${ratio * 100}%` }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="mb-3 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Editor</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Drop a .md file here to load it</p>
          </div>
          <div className="flex-1 min-h-0 h-64 md:h-auto">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </div>

        {/* Divider (desktop only) */}
        <div
          onMouseDown={startDrag}
          className="hidden md:block w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize"
          style={{ userSelect: "none" }}
          aria-label="Resize panels"
          role="separator"
          aria-orientation="vertical"
        />

        {/* Preview panel */}
        <div className="w-full p-4 flex flex-col" style={{ width: "100%", flexBasis: `${(1 - ratio) * 100}%` }}>
          <div className="mb-3 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preview</h2>
          </div>
          <div className={`flex-1 min-h-0 h-64 md:h-auto code-theme-${codeTheme}`}>
            <MarkdownPreview ref={previewRef} content={debouncedMarkdown} />
          </div>
        </div>
      </div>
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
  .code-theme-github-dark .hljs { background-color: #0d1117; color: #c9d1d9; }
  .code-theme-github-dark .hljs-keyword { color: #ff7b72; }
  .code-theme-github-dark .hljs-string { color: #a5d6ff; }
  .code-theme-github-dark .hljs-title, .code-theme-github-dark .hljs-section { color: #d2a8ff; }
  .code-theme-github-dark .hljs-literal, .code-theme-github-dark .hljs-number { color: #79c0ff; }
  .code-theme-github-dark .hljs-comment { color: #8b949e; }
  .code-theme-night-owl .hljs { background-color: #011627; color: #d6deeb; }
  .code-theme-night-owl .hljs-keyword { color: #c792ea; }
  .code-theme-night-owl .hljs-string { color: #ecc48d; }
  .code-theme-night-owl .hljs-title, .code-theme-night-owl .hljs-section { color: #82aaff; }
  .code-theme-night-owl .hljs-literal, .code-theme-night-owl .hljs-number { color: #f78c6c; }
  .code-theme-night-owl .hljs-comment { color: #637777; }
`;
