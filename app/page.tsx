"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import RichMarkdownEditor from "../components/RichMarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import ThemeSelector from "../components/ThemeSelector";
import CompactThemeSelector from "../components/CompactThemeSelector";
import ViewModeSelector from "../components/ViewModeSelector";
import QuickActionsMenu from "../components/QuickActionsMenu";
import Footer from "../components/Footer";
import { themes, getTheme } from "../lib/themes";
import { Upload, FileText, FileCode, RotateCw, BookOpen, Github, Copy, Check, AlertCircle } from "lucide-react";

type ViewMode = 'split' | 'editor' | 'preview';
type CopyStatus = 'idle' | 'styled' | 'plain' | 'error';

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
  // When top nav horizontal space is insufficient we collapse text labels and show icons only.
  const [isNavCompact, setIsNavCompact] = useState(false);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number | undefined>(undefined);
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState<number | undefined>(undefined);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const navRowRef = useRef<HTMLDivElement | null>(null);
  const copyStatusResetRef = useRef<number | null>(null);

  const primaryActionButton =
    "inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3.5 md:text-sm";
  const secondaryActionButton =
    "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm";
  const quietNavButton =
    "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm";
  const statPillClass =
    "hidden xl:flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm";
  const wordCount = markdown.split(/\s+/).filter((word) => word.length > 0).length;
  const lineCount = markdown.split('\n').length;
  const fileSizeKb = Math.max(1, Math.round(new Blob([markdown]).size / 1024));
  const previewCopyButtonClass = [
    "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm",
    "hover:bg-slate-100",
    copyStatus === 'styled'
      ? "text-green-600 hover:text-green-600"
      : copyStatus === 'plain'
        ? "text-amber-600 hover:text-amber-600"
        : copyStatus === 'error'
          ? "text-red-600 hover:text-red-600"
          : "text-slate-600 hover:text-slate-900",
  ].join(" ");
  const mobileIconPrimaryButton =
    "inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const mobileIconButton =
    "inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const mobileCopyButtonClass = [
    mobileIconButton,
    copyStatus === 'styled'
      ? 'border-green-500/70 text-green-600 hover:bg-green-50'
      : copyStatus === 'plain'
        ? 'border-amber-500/70 text-amber-600 hover:bg-amber-50'
        : copyStatus === 'error'
          ? 'border-red-500/70 text-red-600 hover:bg-red-50'
          : '',
  ]
    .filter(Boolean)
    .join(' ');
  const copyButtonLabel =
    copyStatus === 'styled'
      ? 'Preview HTML copied'
      : copyStatus === 'plain'
        ? 'Preview text copied'
        : copyStatus === 'error'
          ? 'Copy failed'
          : 'Copy preview HTML';

  const updateCopyStatus = useCallback((status: CopyStatus) => {
    if (copyStatusResetRef.current) {
      window.clearTimeout(copyStatusResetRef.current);
      copyStatusResetRef.current = null;
    }

    setCopyStatus(status);

    if (status === 'idle') {
      return;
    }

    const delay = status === 'error' ? 2500 : 1800;

    copyStatusResetRef.current = window.setTimeout(() => {
      setCopyStatus('idle');
      copyStatusResetRef.current = null;
    }, delay);
  }, [copyStatusResetRef]);

  const getSerializablePreview = useCallback(() => {
    const theme = getTheme(currentTheme);
    const previewElement = previewRef.current;

    if (!previewElement || typeof document === 'undefined') {
      return {
        theme,
        htmlContent: '',
        plainText: '',
        styles: `${inlineStyles}${theme.customStyles || ''}`,
      };
    }

    const clone = previewElement.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[data-no-export]').forEach((el) => el.remove());

    const htmlContent = clone.innerHTML;
    const plainText = clone.innerText;

    const styleElement = document.getElementById('theme-custom-styles') as HTMLStyleElement | null;
    const dynamicStyles = styleElement?.textContent ?? '';
    const styles = `${inlineStyles}${dynamicStyles || theme.customStyles || ''}`;

    return {
      theme,
      htmlContent,
      plainText,
      styles,
    };
  }, [currentTheme]);

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

  // Observe nav row size to decide if we need to collapse text labels into icon-only.
  useEffect(() => {
    const el = navRowRef.current;
    if (!el) return;

    const measure = () => {
      if (!el) return;
      // Below md breakpoint we stack the navigation, so keep full labels visible
      if (window.innerWidth < 768) {
        setIsNavCompact(false);
        return;
      }
      // Between md and lg widths, collapse labels to keep layout tidy
      if (window.innerWidth < 1000) {
        setIsNavCompact(true);
        return;
      }
      // Otherwise rely on actual overflow detection
      const shouldCompact = el.scrollWidth > el.clientWidth + 4; // small tolerance
      setIsNavCompact(shouldCompact);
    };

    measure(); // initial

    let raf: number | null = null;
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
    const { theme, htmlContent, styles } = getSerializablePreview();

    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${styles}</style></head><body><main class=\"${theme.classes.prose}\">${htmlContent}</main></body></html>`;
    download("document.html", doc, "text/html;charset=utf-8");
  }, [download, getSerializablePreview]);

  const copyPreviewToClipboard = useCallback(async () => {
    if (typeof navigator === 'undefined') {
      updateCopyStatus('error');
      return;
    }

    try {
      const { theme, htmlContent, plainText, styles } = getSerializablePreview();
      const htmlDocument = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Preview</title><style>${styles}</style></head><body><main class=\"${theme.classes.prose}\">${htmlContent}</main></body></html>`;

      const clipboard = navigator.clipboard;

      if (clipboard && 'write' in clipboard && typeof ClipboardItem !== 'undefined') {
        const htmlBlob = new Blob([htmlDocument], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        await clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          }),
        ]);
        updateCopyStatus('styled');
        return;
      }

      if (clipboard && 'writeText' in clipboard) {
        await clipboard.writeText(plainText);
        updateCopyStatus('plain');
        return;
      }

      updateCopyStatus('error');
    } catch {
      updateCopyStatus('error');
    }
  }, [getSerializablePreview, updateCopyStatus]);

  const openGuide = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.open('/guide', '_blank');
  }, []);

  const openGithub = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.open('https://github.com/celery94/md-view', '_blank', 'noopener,noreferrer');
  }, []);

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

  useEffect(() => {
    return () => {
      if (copyStatusResetRef.current) {
        window.clearTimeout(copyStatusResetRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-gradient-to-b from-white/95 via-white/90 to-white/85 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="flex w-full flex-col gap-2.5 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-4 lg:px-10 xl:px-14">
          <div
            ref={navRowRef}
            className="flex flex-col gap-2 md:h-20 md:flex-row md:items-center md:justify-between md:gap-6"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/"
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="MD-View Home"
                title="MD-View Home"
              >
                <img
                  src="/md-view-icon.svg"
                  alt="MD-View logo"
                  className="h-8 w-8 rounded-xl bg-slate-100 p-1.5 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`${isNavCompact ? 'hidden lg:block' : 'block'} text-left`}>
                  <h1 className="text-lg font-semibold leading-tight text-slate-900">MD-View</h1>
                  <p className="text-xs font-medium text-slate-500">Markdown Editor</p>
                </div>
              </Link>

              <div className="hidden md:block">
                <ViewModeSelector currentMode={viewMode} onModeChange={setViewMode} showLabels={false} />
              </div>

              {!isNavCompact && (
                <div className={statPillClass}>
                  <span>{wordCount} words</span>
                  <span className="text-slate-300">•</span>
                  <span>{lineCount} lines</span>
                  <span className="text-slate-300">•</span>
                  <span>{fileSizeKb} KB</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/80 p-1.5 shadow-sm">
                <button
                  onClick={onPickFile}
                  className={primaryActionButton}
                  aria-label="Import markdown file"
                  title="Import .md file"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>Import</span>
                </button>
                <button
                  onClick={exportMarkdown}
                  className={secondaryActionButton}
                  aria-label="Export as markdown file"
                  title="Export as .md file"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>Export MD</span>
                </button>
                <button
                  onClick={exportHtml}
                  className={secondaryActionButton}
                  aria-label="Export as HTML file"
                  title="Export as .html file"
                >
                  <FileCode className="h-4 w-4" aria-hidden="true" />
                  <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>Export HTML</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Link
                  href="/guide"
                  className={quietNavButton}
                  title="Markdown guide and tips"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Guide</span>
                </Link>
                <a
                  href="https://github.com/celery94/md-view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={quietNavButton}
                  aria-label="GitHub repository"
                  title="Open GitHub repository"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">GitHub</span>
                </a>
                <button
                  onClick={resetSample}
                  className={quietNavButton}
                  aria-label="Reset to sample content"
                  title="Reset to sample markdown"
                >
                  <RotateCw className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Reset</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <ViewModeSelector currentMode={viewMode} onModeChange={setViewMode} showLabels={false} />
              <div className="flex flex-none items-center gap-1.5">
                <button
                  onClick={onPickFile}
                  className={mobileIconPrimaryButton}
                  aria-label="Import markdown file"
                  title="Import .md file"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Import markdown file</span>
                </button>
                <button
                  onClick={copyPreviewToClipboard}
                  className={mobileCopyButtonClass}
                  aria-label="Copy preview HTML to clipboard"
                  title={copyButtonLabel}
                >
                  {copyStatus === 'styled' ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : copyStatus === 'plain' ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : copyStatus === 'error' ? (
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only" aria-live="polite" role="status">
                    {copyButtonLabel}
                  </span>
                </button>
                <QuickActionsMenu
                  onImport={onPickFile}
                  onExportMarkdown={exportMarkdown}
                  onExportHtml={exportHtml}
                  onCopyPreview={copyPreviewToClipboard}
                  onReset={resetSample}
                  onGuide={openGuide}
                  onGithub={openGithub}
                  triggerClassName={`${mobileIconButton} justify-center`}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-slate-500">
              <span>{wordCount} words</span>
              <span className="text-slate-300">•</span>
              <span>{lineCount} lines</span>
              <span className="text-slate-300">•</span>
              <span>{fileSizeKb} KB</span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between border-t border-slate-200 py-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Real-time markdown editor with live preview
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 xl:hidden">
              <span>{wordCount} words</span>
              <span className="text-slate-300">•</span>
              <span>{lineCount} lines</span>
              <span className="text-slate-300">•</span>
              <span>{fileSizeKb} KB</span>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
          aria-label="File input for markdown files"
        />
      </header>

      <main className="relative flex flex-1 min-h-0 flex-col py-5 sm:py-8 lg:py-12" role="main">
        <div
          ref={containerRef}
          className={`flex w-full flex-1 flex-col gap-5 px-4 sm:px-6 lg:px-10 xl:px-14 min-h-0 ${
            viewMode === 'split' ? 'md:flex-row md:items-stretch md:gap-8' : ''
          }`}
        >
          {(viewMode === 'editor' || viewMode === 'split') && (
            <section
              className="relative flex w-full flex-1 min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 lg:p-6 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.15)]"
              style={viewMode === 'split' ? { width: '100%', flexBasis: `${ratio * 100}%` } : undefined}
              onDrop={onDrop}
              onDragOver={onDragOver}
              aria-label="Markdown editor section"
            >
              <div className="mb-3 flex flex-shrink-0 items-start justify-between gap-3 sm:mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Markdown Editor</h2>
                  <p className="text-xs text-slate-500">
                    Type your markdown or drop a .md file to load it instantly
                  </p>
                </div>
              </div>
              {/* Wrapper must be a flex container so nested editor (with flex-1) can stretch to available height. */}
              <div className="flex flex-col flex-1 min-h-0">
                <RichMarkdownEditor
                  ref={editorRef}
                  value={markdown}
                  onChange={setMarkdown}
                  onScroll={handleEditorScroll}
                  scrollToPercentage={editorScrollPercentage}
                />
              </div>
            </section>
          )}

          {viewMode === 'split' && (
            <div
              onMouseDown={startDrag}
              className="group hidden md:flex w-px cursor-col-resize select-none items-stretch justify-center"
              aria-label="Resize editor and preview panels"
              role="separator"
              aria-orientation="vertical"
              tabIndex={0}
              title="Drag to resize panels"
            >
              <div className="relative my-4 flex h-full w-full items-center">
                <span className="mx-auto h-full w-px bg-slate-200" aria-hidden="true" />
                <span
                  className="absolute left-1/2 top-1/2 h-12 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 transition-colors duration-200 group-hover:bg-sky-400/60"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <section
              className="relative flex w-full flex-1 min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 lg:p-6 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.15)]"
              style={viewMode === 'split' ? { width: '100%', flexBasis: `${(1 - ratio) * 100}%` } : undefined}
              aria-label="Markdown preview section"
            >
              <div className="mb-3 flex flex-shrink-0 items-center justify-between gap-3 sm:mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
                  <p className="text-xs text-slate-500">See the rendered markdown with your chosen theme</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyPreviewToClipboard}
                    className={previewCopyButtonClass}
                    aria-label="Copy preview HTML to clipboard"
                    title={copyButtonLabel}
                  >
                    {copyStatus === 'styled' ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : copyStatus === 'plain' ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Copied text</span>
                      </>
                    ) : copyStatus === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        <span>Copy failed</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Copy HTML</span>
                      </>
                    )}
                  </button>
                  <div className="hidden lg:block">
                    <CompactThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                  </div>
                  <div className="lg:hidden">
                    <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                  </div>
                </div>
              </div>
              {/* Wrapper must be flex so preview (flex-1) fills remaining vertical space. */}
              <div className="flex flex-col flex-1 min-h-0">
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
        </div>
      </main>

      <Footer />
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
