'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import RichMarkdownEditor from '../components/RichMarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import ThemeSelector from '../components/ThemeSelector';
import CompactThemeSelector from '../components/CompactThemeSelector';
import ViewModeSelector from '../components/ViewModeSelector';
import Footer from '../components/Footer';

import { themes, getTheme } from '../lib/themes';
import { buildInlineClipboardPayload } from '../lib/clipboard-inline-html';
import { stripLeadingYamlFrontmatter } from '../lib/markdown-frontmatter';
import { cn } from '../lib/cn';
import { ui } from '../lib/ui-classes';
import type {
  UrlImportErrorResponse,
  UrlImportSuccessResponse,
} from '../lib/url-import-types';
import {
  Upload,
  Link2,
  Loader2,
  FileText,
  FileCode,
  RotateCw,
  BookOpen,
  Github,
  Image as ImageIcon,
  ClipboardCopy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';
const SCROLL_TOP_THRESHOLD = 0.25;

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
  const previewMarkdown = useMemo(
    () => stripLeadingYamlFrontmatter(debouncedMarkdown),
    [debouncedMarkdown]
  );
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
  const [pageScrollProgress, setPageScrollProgress] = useState(0);
  const [editorScrollProgress, setEditorScrollProgress] = useState(0);
  const [previewScrollProgress, setPreviewScrollProgress] = useState(0);
  const [urlToImport, setUrlToImport] = useState('');
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [urlImportError, setUrlImportError] = useState<string | null>(null);
  const [isDesktopExportMenuOpen, setIsDesktopExportMenuOpen] = useState(false);
  const [isMobileExportMenuOpen, setIsMobileExportMenuOpen] = useState(false);

  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const navRowRef = useRef<HTMLDivElement | null>(null);
  const desktopExportMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopExportMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileExportMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileExportMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const desktopExportMenuId = useId();
  const desktopExportMenuTriggerId = useId();
  const mobileExportMenuId = useId();
  const mobileExportMenuTriggerId = useId();

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

  useEffect(() => {
    if (!isDesktopExportMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopExportMenuRef.current &&
        !desktopExportMenuRef.current.contains(event.target as Node)
      ) {
        setIsDesktopExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktopExportMenuOpen]);

  useEffect(() => {
    if (!isDesktopExportMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setIsDesktopExportMenuOpen(false);
      desktopExportMenuTriggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDesktopExportMenuOpen]);

  useEffect(() => {
    if (!isMobileExportMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileExportMenuRef.current &&
        !mobileExportMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileExportMenuOpen]);

  useEffect(() => {
    if (!isMobileExportMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setIsMobileExportMenuOpen(false);
      mobileExportMenuTriggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileExportMenuOpen]);

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

  useEffect(() => {
    const getPageScrollProgress = () => {
      const doc = document.documentElement;
      const scrollableHeight = doc.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return 0;
      const progress = window.scrollY / scrollableHeight;
      return Math.min(1, Math.max(0, progress));
    };

    const handlePageScroll = () => {
      setPageScrollProgress(getPageScrollProgress());
    };

    handlePageScroll();
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    window.addEventListener('resize', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
      window.removeEventListener('resize', handlePageScroll);
    };
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
    setUrlImportError(null);
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

  const importFromUrl = useCallback(
    async (rawUrl?: string) => {
      const nextUrl = (rawUrl ?? urlToImport).trim();
      if (!nextUrl) {
        setUrlImportError('Please enter a URL to import.');
        return;
      }

      setIsImportingUrl(true);
      setUrlImportError(null);

      try {
        const response = await fetch('/api/import-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: nextUrl }),
        });

        const payload = (await response.json()) as UrlImportSuccessResponse | UrlImportErrorResponse;
        if (!response.ok) {
          const message =
            'error' in payload ? payload.error.message : 'Failed to import URL content.';
          setUrlImportError(message);
          return;
        }

        if (!('markdown' in payload) || typeof payload.markdown !== 'string') {
          setUrlImportError('Invalid response from server.');
          return;
        }

        setMarkdown(payload.markdown);
        setUrlToImport(payload.sourceUrl || nextUrl);
      } catch {
        setUrlImportError('Network error while importing URL.');
      } finally {
        setIsImportingUrl(false);
      }
    },
    [urlToImport]
  );

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
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const payload = buildInlineClipboardPayload(previewElement, currentTheme);
    if (!payload.html) return;

    try {
      const htmlBlob = new Blob([payload.html], { type: 'text/html' });
      const textBlob = new Blob([payload.plainText], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(payload.html);
    }
  }, [currentTheme]);

  const handleDesktopExportAction = useCallback((action: () => void) => {
    action();
    setIsDesktopExportMenuOpen(false);
  }, []);

  const handleMobileExportAction = useCallback((action: () => void) => {
    action();
    setIsMobileExportMenuOpen(false);
  }, []);

  // Scroll synchronization handlers
  const handleEditorScroll = useCallback(
    (scrollPercentage: number) => {
      setEditorScrollProgress(scrollPercentage);
      if (viewMode === 'split') {
        setPreviewScrollPercentage(scrollPercentage);
      }
    },
    [viewMode]
  );

  const handlePreviewScroll = useCallback(
    (scrollPercentage: number) => {
      setPreviewScrollProgress(scrollPercentage);
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

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditorScrollPercentage(0);
    setPreviewScrollPercentage(0);
    setPageScrollProgress(0);
    setEditorScrollProgress(0);
    setPreviewScrollProgress(0);
  }, []);

  const activePanelScrollProgress =
    viewMode === 'split'
      ? Math.max(editorScrollProgress, previewScrollProgress)
      : viewMode === 'editor'
        ? editorScrollProgress
        : previewScrollProgress;
  const showScrollToTop =
    Math.max(pageScrollProgress, activePanelScrollProgress) >= SCROLL_TOP_THRESHOLD;

  return (
    <>
      <div className={ui.home.root}>
        {/* Premium Header */}
        <header className={ui.home.header}>
          <div className={ui.home.headerInner}>
            <div ref={navRowRef} className={ui.home.navRow}>
              <div className="flex min-w-0 items-center gap-2 md:gap-3">
                <Link
                  href="/"
                  className={ui.home.brandLink}
                  aria-label="MD-View Home"
                  title="MD-View Home"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white">
                    <img src="/md-view-icon.svg" alt="MD-View logo" className="h-5 w-5" />
                  </div>
                  <div className={`${isNavCompact ? 'hidden lg:block' : 'block'} text-left`}>
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">MD-View</h1>
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
                    <span className="text-cyan-700">{wordCount}</span>
                    <span className="text-slate-400">words</span>
                    <span className="mx-1 h-3 w-px bg-slate-200/60" />
                    <span className="text-slate-700">{lineCount}</span>
                    <span className="text-slate-400">lines</span>
                    <span className="mx-1 h-3 w-px bg-slate-200/60" />
                    <span className="text-amber-700">{fileSizeKb}</span>
                    <span className="text-slate-400">KB</span>
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex min-w-[18rem] max-w-[30rem] items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
                  <input
                    type="url"
                    value={urlToImport}
                    onChange={(e) => setUrlToImport(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      void importFromUrl();
                    }}
                    placeholder="https://example.com/article"
                    aria-label="URL to import as markdown"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    disabled={isImportingUrl}
                  />
                  <button
                    onClick={() => void importFromUrl()}
                    disabled={isImportingUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200/70 bg-cyan-50/90 px-2.5 py-1.5 text-xs font-semibold text-cyan-700 transition-all hover:border-cyan-300 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Import URL content"
                    title="Fetch URL content and convert to markdown"
                  >
                    {isImportingUrl ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden lg:inline'}`}>
                      Import URL
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
                  <button
                    onClick={onPickFile}
                    className={ui.home.buttons.primary}
                    aria-label="Import markdown file"
                    title="Import .md file"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>Import</span>
                  </button>
                  <div ref={desktopExportMenuRef} className="relative">
                    <button
                      type="button"
                      ref={desktopExportMenuTriggerRef}
                      id={desktopExportMenuTriggerId}
                      onClick={() => {
                        setIsDesktopExportMenuOpen((prev) => !prev);
                        setIsMobileExportMenuOpen(false);
                      }}
                      className={ui.home.buttons.secondary}
                      aria-label="Export actions"
                      title="Export actions"
                      aria-haspopup="menu"
                      aria-expanded={isDesktopExportMenuOpen}
                      aria-controls={isDesktopExportMenuOpen ? desktopExportMenuId : undefined}
                    >
                      <FileCode className="h-4 w-4" aria-hidden="true" />
                      <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                        Export
                      </span>
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', {
                          'rotate-180': isDesktopExportMenuOpen,
                        })}
                        aria-hidden="true"
                      />
                    </button>
                    {isDesktopExportMenuOpen && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
                        role="menu"
                        id={desktopExportMenuId}
                        aria-labelledby={desktopExportMenuTriggerId}
                      >
                        <button
                          type="button"
                          onClick={() => handleDesktopExportAction(exportMarkdown)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as Markdown</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDesktopExportAction(exportHtml)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <FileCode className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as HTML</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDesktopExportAction(exportImage)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <ImageIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as Image</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={copyHtmlToClipboard}
                    className={ui.home.buttons.secondary}
                    aria-label="Copy inline HTML"
                    title="Copy inline HTML for rich text editors"
                  >
                    <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>Copy</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1">
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
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white px-2 py-1">
                  <input
                    type="url"
                    value={urlToImport}
                    onChange={(e) => setUrlToImport(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      void importFromUrl();
                    }}
                    placeholder="Paste URL"
                    aria-label="URL to import as markdown"
                    className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                    disabled={isImportingUrl}
                  />
                  <button
                    onClick={() => void importFromUrl()}
                    disabled={isImportingUrl}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700 disabled:opacity-60"
                    aria-label="Import URL"
                  >
                    {isImportingUrl ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      <Link2 className="h-3 w-3" aria-hidden="true" />
                    )}
                    URL
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onPickFile}
                    className={cn(ui.home.mobileActionButton, 'px-2.5 py-1.5 text-[11px]')}
                    aria-label="Import markdown file"
                    title="Import .md file"
                  >
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Import</span>
                  </button>
                  <div ref={mobileExportMenuRef} className="relative">
                    <button
                      type="button"
                      ref={mobileExportMenuTriggerRef}
                      id={mobileExportMenuTriggerId}
                      onClick={() => {
                        setIsMobileExportMenuOpen((prev) => !prev);
                        setIsDesktopExportMenuOpen(false);
                      }}
                      className={cn(ui.home.mobileActionButton, 'px-2.5 py-1.5 text-[11px]')}
                      aria-label="Export actions"
                      title="Export actions"
                      aria-haspopup="menu"
                      aria-expanded={isMobileExportMenuOpen}
                      aria-controls={isMobileExportMenuOpen ? mobileExportMenuId : undefined}
                    >
                      <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Export</span>
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', {
                          'rotate-180': isMobileExportMenuOpen,
                        })}
                        aria-hidden="true"
                      />
                    </button>
                    {isMobileExportMenuOpen && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
                        role="menu"
                        id={mobileExportMenuId}
                        aria-labelledby={mobileExportMenuTriggerId}
                      >
                        <button
                          type="button"
                          onClick={() => handleMobileExportAction(exportMarkdown)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as Markdown</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMobileExportAction(exportHtml)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <FileCode className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as HTML</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMobileExportAction(exportImage)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <ImageIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as Image</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={copyHtmlToClipboard}
                    className={cn(ui.home.mobileActionButton, 'px-2.5 py-1.5 text-[11px]')}
                    aria-label="Copy inline HTML"
                    title="Copy inline HTML for rich text editors"
                  >
                    <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </button>
                  <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
                    <Link href="/guide" className={cn(ui.home.buttons.quietNav, 'p-1.5')} title="Guide">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Guide</span>
                    </Link>
                    <a
                      href="https://github.com/celery94/md-view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(ui.home.buttons.quietNav, 'p-1.5')}
                      aria-label="GitHub repository"
                      title="GitHub"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">GitHub</span>
                    </a>
                    <button
                      type="button"
                      onClick={resetSample}
                      className={cn(ui.home.buttons.quietNav, 'p-1.5')}
                      aria-label="Reset to sample content"
                      title="Reset to sample markdown"
                    >
                      <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {urlImportError && (
              <p
                className="mt-2 rounded-xl border border-rose-200/70 bg-rose-50/90 px-3 py-2 text-xs text-rose-700"
                role="alert"
              >
                {urlImportError}
              </p>
            )}

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
                'md:flex-row md:items-stretch md:gap-2 lg:gap-3': viewMode === 'split',
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
                  <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200/65 bg-gradient-to-r from-white to-slate-100/60 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 shadow-sm shadow-cyan-500/30" />
                      <h2 className="text-sm font-semibold tracking-tight text-slate-800">Editor</h2>
                    </div>
                    <div className="hidden lg:inline text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      Shift + Alt + F to format
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
                  className="group hidden md:flex w-2 cursor-col-resize select-none items-stretch justify-center rounded-full transition-colors hover:bg-cyan-100/60"
                  aria-label="Resize editor and preview panels"
                  role="separator"
                  aria-orientation="vertical"
                  tabIndex={0}
                  title="Drag to resize panels"
                >
                  <div
                    className="h-full w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent group-hover:via-cyan-400"
                    aria-hidden="true"
                  />
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
                  <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200/65 bg-gradient-to-r from-white to-slate-100/60 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm shadow-amber-500/35"></div>
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
                      content={previewMarkdown}
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

        {showScrollToTop && (
          <button
            type="button"
            onClick={handleScrollToTop}
            className="fixed bottom-4 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300/80 bg-white/90 text-slate-700 shadow-[0_12px_28px_-16px_rgba(15,23,42,0.85)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/80 hover:bg-white hover:text-cyan-700 hover:shadow-[0_14px_32px_-16px_rgba(8,145,178,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

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
