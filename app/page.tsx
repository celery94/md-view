'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import RichMarkdownEditor from '../components/RichMarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import ThemeSelector from '../components/ThemeSelector';
import CompactThemeSelector from '../components/CompactThemeSelector';
import ViewModeSelector from '../components/ViewModeSelector';
import QuickActionsMenu from '../components/QuickActionsMenu';
import Footer from '../components/Footer';

import { themes, getTheme } from '../lib/themes';
import { cn } from '../lib/cn';
import { ui } from '../lib/ui-classes';
import { Upload, FileText, FileCode, RotateCw, BookOpen, Github, Image, ClipboardCopy } from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';

const initialMarkdown = `# MD-View: Focused Markdown workspace

Welcome to **MD-View** - a fast, free markdown workbench with live preview.

## Quick start

1) Switch view modes (Ctrl/Cmd+1, 2, 3) or use the buttons above.
2) Choose a theme that matches where you'll publish.
3) Drop a .md file or paste text to begin writing.

## Why people use it

- Fast, zero sign-in.
- Autosave in your browser.
- Safe rendering with sanitization.
- Export-ready HTML and Markdown.

## Example: Project brief

### Goals
- Keep writing in one split pane.
- See how it renders instantly.
- Ship docs faster.

### Milestones
- [x] Editor + preview sync
- [x] Syntax highlighting
- [ ] Collaboration

## Sample code

\`\`\`tsx
function greet(name: string) {
  return 'Hello, ' + name + '!';
}

export function Example() {
  return <p className=\"text-blue-600\">{greet('MD-View')}</p>;
}
\`\`\`

## Table

| Feature | Detail |
| --- | --- |
| Export | Markdown & HTML |
| Themes | Dark, GitHub, Notion, Paper |
| Shortcuts | Ctrl/Cmd + 1 / 2 / 3 |

![Preview](/image.png)
`;
export default function Home() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(initialMarkdown);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [ratio, setRatio] = useState<number>(0.5);
  // When top nav horizontal space is insufficient we collapse text labels and show icons only.
  const [isNavCompact, setIsNavCompact] = useState(false);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number | undefined>(
    undefined
  );
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState<number | undefined>(
    undefined
  );

  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const navRowRef = useRef<HTMLDivElement | null>(null);

  const wordCount = markdown.split(/\s+/).filter((word) => word.length > 0).length;
  const lineCount = markdown.split('\n').length;
  const fileSizeKb = Math.max(1, Math.round(new Blob([markdown]).size / 1024));

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
      const saved = localStorage.getItem('mdv:content');
      if (saved) setMarkdown(saved);
      const savedRatio = localStorage.getItem('mdv:ratio');
      if (savedRatio) setRatio(Math.min(0.8, Math.max(0.2, Number(savedRatio))));
      const savedTheme = localStorage.getItem('mdv:theme');
      if (savedTheme) setCurrentTheme(savedTheme);
      const savedViewMode = localStorage.getItem('mdv:viewMode') as ViewMode;
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
        localStorage.setItem('mdv:content', markdown);
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
      localStorage.setItem('mdv:ratio', String(ratio));
    } catch {}
  }, [ratio]);

  // Persist theme selection
  useEffect(() => {
    try {
      localStorage.setItem('mdv:theme', currentTheme);
    } catch {}
  }, [currentTheme]);

  // Persist view mode selection
  useEffect(() => {
    try {
      localStorage.setItem('mdv:viewMode', viewMode);
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
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'INPUT' ||
          e.target.contentEditable === 'true')
      ) {
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
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopDrag = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
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
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [stopDrag]);

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChosen = useCallback((file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setMarkdown(reader.result);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      onFileChosen(f);
    },
    [onFileChosen]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetSample = useCallback(() => setMarkdown(initialMarkdown), []);

  const download = useCallback((name: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportMarkdown = useCallback(() => {
    download('document.md', markdown, 'text/markdown;charset=utf-8');
  }, [download, markdown]);

  const exportHtml = useCallback(() => {
    const { theme, htmlContent, styles } = getSerializablePreview();

    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${styles}</style></head><body><main class=\"${theme.classes.prose}\">${htmlContent}</main></body></html>`;
    download('document.html', doc, 'text/html;charset=utf-8');
  }, [download, getSerializablePreview]);

  const exportImage = useCallback(async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      const { snapdom } = await import('@zumer/snapdom');
      const result = await snapdom(previewElement);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      await result.download({
        type: 'png',
        filename: `document-${timestamp}`,
      });
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  }, []);

  const copyHtmlToClipboard = useCallback(async () => {
    const { theme, htmlContent, styles } = getSerializablePreview();
    if (!htmlContent) return;

    // Build a complete HTML document for rich text pasting
    const fullHtml = `<!doctype html><html><head><meta charset="utf-8"/><style>${styles}</style></head><body><main class="${theme.classes.prose}">${htmlContent}</main></body></html>`;

    try {
      // Use ClipboardItem API to write both HTML and plain text
      const htmlBlob = new Blob([fullHtml], { type: 'text/html' });
      const { plainText } = getSerializablePreview();
      const textBlob = new Blob([plainText], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
    } catch {
      // Fallback: copy as plain HTML string
      await navigator.clipboard.writeText(fullHtml);
    }
  }, [getSerializablePreview]);

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
  const handleEditorScroll = useCallback(
    (scrollPercentage: number) => {
      if (viewMode === 'split') {
        setPreviewScrollPercentage(scrollPercentage);
      }
    },
    [viewMode]
  );

  const handlePreviewScroll = useCallback(
    (scrollPercentage: number) => {
      if (viewMode === 'split') {
        setEditorScrollPercentage(scrollPercentage);
      }
    },
    [viewMode]
  );

  // Reset scroll sync when switching view modes
  useEffect(() => {
    setEditorScrollPercentage(undefined);
    setPreviewScrollPercentage(undefined);
  }, [viewMode]);

  return (
    <>
      <div className={ui.home.root}>
        {/* Premium Header */}
        <header className={ui.home.header}>
          <div className={ui.home.headerInner}>
            <div ref={navRowRef} className={ui.home.navRow}>
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/"
                  className={ui.home.brandLink}
                  aria-label="MD-View Home"
                  title="MD-View Home"
                >
                  <div className="flex items-center justify-center">
                    <img src="/md-view-icon.svg" alt="MD-View logo" className="h-6 w-6" />
                  </div>
                  <div className={`${isNavCompact ? 'hidden lg:block' : 'block'} text-left`}>
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
                      MD-View
                    </h1>
                  </div>
                </Link>

                <div className="hidden md:block">
                  <ViewModeSelector
                    currentMode={viewMode}
                    onModeChange={setViewMode}
                    showLabels={false}
                  />
                </div>

                {!isNavCompact && (
                  <div className={ui.home.statPill}>
                    <span className="text-sky-600">{wordCount}</span>
                    <span className="text-slate-300">words</span>
                    <span className="mx-1 h-3 w-px bg-slate-200/60" />
                    <span className="text-indigo-600">{lineCount}</span>
                    <span className="text-slate-300">lines</span>
                    <span className="mx-1 h-3 w-px bg-slate-200/60" />
                    <span className="text-violet-600">{fileSizeKb}</span>
                    <span className="text-slate-300">KB</span>
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-2xl border border-slate-200/60 bg-gradient-to-b from-white/90 to-slate-50/80 p-1 shadow-sm backdrop-blur-xl">
                  <button
                    onClick={onPickFile}
                    className={ui.home.buttons.primary}
                    aria-label="Import markdown file"
                    title="Import .md file"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Import
                    </span>
                  </button>
                  <button
                    onClick={exportMarkdown}
                    className={ui.home.buttons.secondary}
                    aria-label="Export as markdown file"
                    title="Export as .md file"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Export MD
                    </span>
                  </button>
                  <button
                    onClick={exportHtml}
                    className={ui.home.buttons.secondary}
                    aria-label="Export as HTML file"
                    title="Export as .html file"
                  >
                    <FileCode className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Export HTML
                    </span>
                  </button>
                  <button
                    onClick={exportImage}
                    className={ui.home.buttons.secondary}
                    aria-label="Export as image"
                    title="Export as PNG image"
                  >
                    <Image className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Export Image
                    </span>
                  </button>
                  <button
                    onClick={copyHtmlToClipboard}
                    className={ui.home.buttons.secondary}
                    aria-label="Copy HTML to clipboard"
                    title="Copy formatted HTML for email or Word"
                  >
                    <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Copy HTML
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href="/guide"
                    className={ui.home.buttons.quietNav}
                    title="Markdown guide and tips"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Guide</span>
                  </Link>
                  <a
                    href="https://github.com/celery94/md-view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ui.home.buttons.quietNav}
                    aria-label="GitHub repository"
                    title="Open GitHub repository"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <button
                    onClick={resetSample}
                    className={ui.home.buttons.quietNav}
                    aria-label="Reset to sample content"
                    title="Reset to sample markdown"
                  >
                    <RotateCw className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Reset</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur">
                <QuickActionsMenu
                  onImport={onPickFile}
                  onExportMarkdown={exportMarkdown}
                  onExportHtml={exportHtml}
                  onExportImage={exportImage}
                  onCopyHtml={copyHtmlToClipboard}
                  onReset={resetSample}
                  onGuide={openGuide}
                  onGithub={openGithub}
                  triggerClassName={cn(ui.home.mobileActionButton, 'flex-none')}
                  triggerLabel="More"
                />
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
          </div>
        </header>

        <main className={ui.home.main} role="main">
          <div className="flex w-full flex-1 flex-col">
            <div
              ref={containerRef}
              className={cn(ui.home.container, {
                'md:flex-row md:items-stretch md:gap-0': viewMode === 'split',
              })}
            >
              {(viewMode === 'editor' || viewMode === 'split') && (
                <section
                  className={ui.home.panel}
                  style={
                    viewMode === 'split'
                      ? { width: '100%', flexBasis: `${ratio * 100}%` }
                      : undefined
                  }
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  aria-label="Markdown editor section"
                >
                  <div className="flex flex-shrink-0 items-start justify-between gap-3 p-4 border-b border-slate-100 hidden">
                    <div>
                      <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        Editor
                      </h2>
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
                  className="group hidden md:flex w-1 cursor-col-resize select-none items-stretch justify-center hover:bg-slate-200 transition-colors"
                  aria-label="Resize editor and preview panels"
                  role="separator"
                  aria-orientation="vertical"
                  tabIndex={0}
                  title="Drag to resize panels"
                >
                  <div className="h-full w-px bg-slate-200" aria-hidden="true" />
                </div>
              )}

              {(viewMode === 'preview' || viewMode === 'split') && (
                <section
                  className={ui.home.panel}
                  style={
                    viewMode === 'split'
                      ? { width: '100%', flexBasis: `${(1 - ratio) * 100}%` }
                      : undefined
                  }
                  aria-label="Markdown preview section"
                >
                  <div className="flex flex-shrink-0 items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30"></div>
                      <h2 className="text-sm font-semibold tracking-tight text-slate-700">
                        Preview
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden lg:block">
                        <CompactThemeSelector
                          currentTheme={currentTheme}
                          onThemeChange={setCurrentTheme}
                        />
                      </div>
                      <div className="lg:hidden">
                        <ThemeSelector
                          currentTheme={currentTheme}
                          onThemeChange={setCurrentTheme}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Wrapper must be a flex column so preview (flex-1) can stretch to available height. */}
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
          </div>
        </main>

        <Footer />
      </div>
    </>
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
