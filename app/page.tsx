"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import ThemeSelector from "../components/ThemeSelector";
import CompactThemeSelector from "../components/CompactThemeSelector";
import ViewModeSelector from "../components/ViewModeSelector";
import QuickActionsMenu from "../components/QuickActionsMenu";
import { themes, getTheme } from "../lib/themes";
import { Upload, FileText, FileCode, RotateCw, BookOpen, Edit3, Eye, Columns, Settings, MoreHorizontal } from "lucide-react";

type ViewMode = 'split' | 'editor' | 'preview';

const initialMarkdown = `# MD-View: Free Online Markdown Editor with Live Preview

Welcome to **MD-View**, the best free online markdown editor with real-time preview! This powerful web-based tool is perfect for developers, writers, and anyone who works with markdown documentation.

## 🚀 Key Features

- ✅ **Real-time Live Preview** - See your markdown rendered instantly as you type
- ✅ **Multiple View Modes** - Switch between editor-only, preview-only, or split view
- ✅ **8 Beautiful Themes** - Choose from GitHub, Dark, Notion, Medium, Paper, Terminal, and more
- ✅ **GitHub Flavored Markdown** - Full support for GFM including tables, task lists, and more
- ✅ **Syntax Highlighting** - Beautiful code syntax highlighting for 100+ programming languages
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✅ **Import/Export** - Load markdown files and export to .md or .html formats
- ✅ **Free & Open Source** - No registration required, completely free to use

## 📱 View Modes

MD-View offers three flexible viewing modes:

### 📝 Editor Only Mode
Perfect for focused writing without distractions. Use this mode when you want to concentrate purely on writing markdown content.

### 👁️ Preview Only Mode  
Ideal for reviewing and reading your rendered markdown. Great for presentations or when you want to see the final output in full width.

### 🔄 Split View Mode (Default)
The classic side-by-side experience with editor on the left and live preview on the right. Perfect for real-time editing with immediate visual feedback.

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

## 🖼️ Image Example

You can embed images easily:

![Demo image](/image.png)

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
  const [currentTheme, setCurrentTheme] = useState('default');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [ratio, setRatio] = useState<number>(0.5);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number | undefined>(undefined);
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState<number | undefined>(undefined);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mdv:content");
      if (saved) setMarkdown(saved);
      const savedRatio = localStorage.getItem("mdv:ratio");
      if (savedRatio) setRatio(Math.min(0.8, Math.max(0.2, Number(savedRatio))));
      const savedTheme = localStorage.getItem("mdv:theme");
      if (savedTheme) setCurrentTheme(savedTheme);
      const savedViewMode = localStorage.getItem("mdv:viewMode") as ViewMode;
      if (savedViewMode && ['split', 'editor', 'preview'].includes(savedViewMode)) {
        // Check if we're on mobile and the saved mode is split
        const isMobile = window.innerWidth < 768;
        if (isMobile && savedViewMode === 'split') {
          // Default to editor mode on mobile instead of split
          setViewMode('editor');
        } else {
          setViewMode(savedViewMode);
        }
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

  // Persist theme selection
  useEffect(() => {
    try {
      localStorage.setItem("mdv:theme", currentTheme);
    } catch {}
  }, [currentTheme]);

  // Persist view mode selection
  useEffect(() => {
    try {
      localStorage.setItem("mdv:viewMode", viewMode);
    } catch {}
  }, [viewMode]);

  // Keyboard shortcuts for view modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      if (e.target instanceof HTMLElement && (
        e.target.tagName === 'TEXTAREA' || 
        e.target.tagName === 'INPUT' || 
        e.target.contentEditable === 'true'
      )) {
        return;
      }

      // Check if we're on mobile (below md breakpoint)
      const isMobile = window.innerWidth < 768;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setViewMode('editor');
            break;
          case '2':
            e.preventDefault();
            // Don't allow split mode on mobile
            if (!isMobile) {
              setViewMode('split');
            }
            break;
          case '3':
            e.preventDefault();
            setViewMode('preview');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    // Clone preview DOM and strip non-exportable UI (e.g., copy buttons)
    let htmlContent = "";
    if (previewRef.current) {
      const clone = previewRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[data-no-export]')?.forEach((el) => el.remove());
      htmlContent = clone.innerHTML;
    }
    
    // Get current theme for export
    const theme = getTheme(currentTheme);
    const themeStyles = theme.customStyles || '';
    
    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${inlineStyles}${themeStyles}</style></head><body><main class=\"${theme.classes.prose}\">${htmlContent}</main></body></html>`;
    download("document.html", doc, "text/html;charset=utf-8");
  }, [download, currentTheme]);

  // Scroll synchronization handlers
  const handleEditorScroll = useCallback((scrollPercentage: number) => {
    if (viewMode === 'split') {
      setPreviewScrollPercentage(scrollPercentage);
    }
  }, [viewMode]);

  const handlePreviewScroll = useCallback((scrollPercentage: number) => {
    if (viewMode === 'split') {
      setEditorScrollPercentage(scrollPercentage);
    }
  }, [viewMode]);

  // Reset scroll sync when switching view modes
  useEffect(() => {
    setEditorScrollPercentage(undefined);
    setPreviewScrollPercentage(undefined);
  }, [viewMode]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6">
          {/* Main navigation bar */}
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left section - Logo and title */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 md:gap-3 group rounded-lg p-1.5 md:p-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="MD-View Home"
                title="MD-View Home"
              >
                <img
                  src="/md-view-icon.svg"
                  alt="MD-View logo"
                  className="h-7 w-7 md:h-8 md:w-8 rounded group-hover:scale-105 transition-transform"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">MD-View</h1>
                  <p className="text-xs text-gray-500 leading-tight">Markdown Editor</p>
                </div>
              </Link>
              
              {/* View mode selector */}
              <div className="hidden md:block">
                <ViewModeSelector currentMode={viewMode} onModeChange={setViewMode} />
              </div>

              {/* Document stats */}
              <div className="hidden xl:flex items-center gap-3 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span>
                  {markdown.split(/\s+/).filter(word => word.length > 0).length} words
                </span>
                <span>•</span>
                <span>
                  {markdown.split('\n').length} lines
                </span>
                <span>•</span>
                <span>
                  {Math.round(new Blob([markdown]).size / 1024)}KB
                </span>
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile view mode selector */}
              <div className="md:hidden">
                <ViewModeSelector currentMode={viewMode} onModeChange={setViewMode} />
              </div>
              
              {/* Action buttons grouped */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* File operations group */}
                <div className="flex items-center gap-0.5 md:gap-1 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={onPickFile} 
                    className="px-2 md:px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all inline-flex items-center gap-1.5"
                    aria-label="Import markdown file"
                    title="Import .md file"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden md:inline">Import</span>
                  </button>
                  <button 
                    onClick={exportMarkdown} 
                    className="px-2 md:px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all inline-flex items-center gap-1.5"
                    aria-label="Export as markdown file"
                    title="Export as .md file"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden md:inline">Export MD</span>
                  </button>
                  <button 
                    onClick={exportHtml} 
                    className="px-2 md:px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all inline-flex items-center gap-1.5"
                    aria-label="Export as HTML file"
                    title="Export as .html file"
                  >
                    <FileCode className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden md:inline">Export HTML</span>
                  </button>
                </div>

                {/* Theme selector moved to Live Preview header (desktop) */}

                {/* Additional actions */}
                <div className="hidden md:flex items-center gap-1">
                  <Link 
                    href="/guide"
                    className="px-2 lg:px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
                    title="Markdown guide and tips"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden lg:inline">Guide</span>
                  </Link>
                  <button 
                    onClick={resetSample} 
                    className="px-2 lg:px-2.5 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
                    aria-label="Reset to sample content"
                    title="Reset to sample markdown"
                  >
                    <RotateCw className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden lg:inline">Reset</span>
                  </button>
                </div>

                {/* Mobile actions menu */}
                <div className="md:hidden">
                  <QuickActionsMenu
                    onImport={onPickFile}
                    onExportMarkdown={exportMarkdown}
                    onExportHtml={exportHtml}
                    onReset={resetSample}
                    onGuide={() => window.open('/guide', '_blank')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary bar for mobile description and stats */}
          <div className="border-t border-gray-100 py-1.5 md:py-2">
            <div className="sm:hidden">
              <p className="text-xs text-gray-500 text-center">
                Real-time markdown editor with live preview
              </p>
            </div>
            <div className="hidden sm:block xl:hidden">
              <div className="flex justify-center items-center gap-2 md:gap-3 text-xs text-gray-500">
                <span>{markdown.split(/\s+/).filter(word => word.length > 0).length} words</span>
                <span>•</span>
                <span>{markdown.split('\n').length} lines</span>
                <span>•</span>
                <span>{Math.round(new Blob([markdown]).size / 1024)}KB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
          aria-label="File input for markdown files"
        />
      </header>

      {/* Main content */}
      <main ref={containerRef} className="flex-1 flex flex-col md:flex-row overflow-hidden" role="main">
        {/* Editor panel */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <section
            className={`
              w-full p-4 flex flex-col
              ${viewMode === 'split' ? 'md:h-auto border-b md:border-b-0 md:border-r border-gray-200' : 'h-full'}
            `}
            style={viewMode === 'split' ? { width: "100%", flexBasis: `${ratio * 100}%` } : undefined}
            onDrop={onDrop}
            onDragOver={onDragOver}
            aria-label="Markdown editor section"
          >
            <div className="mb-3 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-700">Markdown Editor</h2>
              <p className="text-xs text-gray-500">Type your markdown here or drop a .md file to load it</p>
            </div>
            <div className="flex-1 min-h-0 h-64 md:h-auto">
              <MarkdownEditor 
                ref={editorRef}
                value={markdown} 
                onChange={setMarkdown}
                onScroll={handleEditorScroll}
                scrollToPercentage={editorScrollPercentage}
              />
            </div>
          </section>
        )}

        {/* Divider (split mode only) */}
        {viewMode === 'split' && (
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
        )}

        {/* Preview panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <section 
            className={`
              w-full p-4 flex flex-col
              ${viewMode === 'split' ? '' : 'h-full'}
            `}
            style={viewMode === 'split' ? { width: "100%", flexBasis: `${(1 - ratio) * 100}%` } : undefined} 
            aria-label="Markdown preview section"
          >
            <div className="mb-3 flex-shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
                <p className="text-xs text-gray-500">Real-time rendered markdown with syntax highlighting</p>
              </div>
              {/* Theme selector on the right side of Live Preview header */}
              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <CompactThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                </div>
                <div className="lg:hidden">
                  <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 h-64 md:h-auto">
              <MarkdownPreview 
                ref={previewRef} 
                content={debouncedMarkdown} 
                theme={currentTheme}
                onScroll={handlePreviewScroll}
                scrollToPercentage={previewScrollPercentage}
              />
            </div>
          </section>
        )}
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
  img { display:block; max-width: 480px; width: 100%; height: auto; margin: 1rem auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
`;
