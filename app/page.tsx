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
import DocumentView from '../components/DocumentView';
import TableOfContents, { type TocHeading } from '../components/TableOfContents';
import { themes, getTheme } from '../lib/themes';
import {
  Upload,
  FileText,
  FileCode,
  RotateCw,
  BookOpen,
  Github,
  Copy,
  Check,
  AlertCircle,
  Printer,
  ListTree,
} from 'lucide-react';

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
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number | undefined>(
    undefined
  );
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState<number | undefined>(
    undefined
  );
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TocHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [isTocVisible, setIsTocVisible] = useState(false);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const navRowRef = useRef<HTMLDivElement | null>(null);
  const copyStatusResetRef = useRef<number | null>(null);
  const activeHeadingRef = useRef<string | null>(null);
  const hasUserToggledTocRef = useRef(false);

  const primaryActionButton =
    'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm';
  const secondaryActionButton =
    'inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-sm active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-2.5 md:text-sm';
  const quietNavButton =
    'inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-sm active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-2.5 md:text-sm';
  const statPillClass =
    'hidden xl:flex items-center gap-2 rounded-full border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm';
  const wordCount = markdown.split(/\s+/).filter((word) => word.length > 0).length;
  const lineCount = markdown.split('\n').length;
  const fileSizeKb = Math.max(1, Math.round(new Blob([markdown]).size / 1024));
  const previewCopyButtonClass = [
    'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm',
    'hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-sm active:scale-95',
    copyStatus === 'styled'
      ? 'text-green-600 hover:text-green-600 bg-green-50/50'
      : copyStatus === 'plain'
        ? 'text-amber-600 hover:text-amber-600 bg-amber-50/50'
        : copyStatus === 'error'
          ? 'text-red-600 hover:text-red-600 bg-red-50/50'
          : 'text-slate-600 hover:text-slate-900',
  ].join(' ');
  const mobilePrimaryActionButton =
    'inline-flex flex-none items-center gap-1.5 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 px-3 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
  const mobileActionButton =
    'inline-flex flex-none items-center gap-1.5 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white/90 to-slate-50/80 px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
  const mobileCopyButtonClass = [
    mobileActionButton,
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
  const hasHeadings = tableOfContents.length > 0;
  const tocReopenButtonClass =
    'fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_6px_24px_rgba(14,165,233,0.35)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.45)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

  useEffect(() => {
    activeHeadingRef.current = activeHeadingId;
  }, [activeHeadingId]);

  const updateActiveHeading = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) {
      if (activeHeadingRef.current !== null) {
        activeHeadingRef.current = null;
        setActiveHeadingId(null);
      }
      return;
    }

    const headingElements = preview.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6');
    if (headingElements.length === 0) {
      if (activeHeadingRef.current !== null) {
        activeHeadingRef.current = null;
        setActiveHeadingId(null);
      }
      return;
    }

    const scrollTop = preview.scrollTop;
    const offset = 56;
    const containerTop = preview.getBoundingClientRect().top;

    let currentId = headingElements[0].id || null;

    for (let i = 0; i < headingElements.length; i += 1) {
      const heading = headingElements[i];
      if (!heading.id) continue;
      const elementTop = heading.getBoundingClientRect().top - containerTop + scrollTop;
      if (elementTop <= scrollTop + offset) {
        currentId = heading.id;
      } else {
        break;
      }
    }

    if (currentId && activeHeadingRef.current !== currentId) {
      activeHeadingRef.current = currentId;
      setActiveHeadingId(currentId);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const collectHeadings = () => {
      const preview = previewRef.current;
      if (!preview) {
        setTableOfContents([]);
        if (activeHeadingRef.current !== null) {
          activeHeadingRef.current = null;
          setActiveHeadingId(null);
        }
        return;
      }

      const headingElements = Array.from(
        preview.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );

      if (headingElements.length === 0) {
        setTableOfContents([]);
        if (activeHeadingRef.current !== null) {
          activeHeadingRef.current = null;
          setActiveHeadingId(null);
        }
        return;
      }

      const items: TocHeading[] = headingElements
        .map((heading) => ({
          id: heading.id,
          title: heading.textContent?.trim() ?? '',
          level: Number(heading.tagName.slice(1)),
        }))
        .filter((item) => Boolean(item.id) && Boolean(item.title));

      setTableOfContents(items);

      if (items.length > 0) {
        const existingActive = items.find((item) => item.id === activeHeadingRef.current);
        if (!existingActive) {
          const nextId = items[0]?.id ?? null;
          activeHeadingRef.current = nextId;
          setActiveHeadingId(nextId);
        }
      }

      updateActiveHeading();
    };

    const frame = window.requestAnimationFrame(collectHeadings);
    return () => window.cancelAnimationFrame(frame);
  }, [debouncedMarkdown, updateActiveHeading, viewMode]);

  useEffect(() => {
    if (!hasHeadings) {
      setIsTocVisible(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const isMd = window.matchMedia('(min-width: 768px)').matches;
      if (!isMd) {
        setIsTocVisible(false);
        return;
      }
    }

    // ToC remains hidden by default - only show if user explicitly toggles it
  }, [hasHeadings]);

  const updateCopyStatus = useCallback(
    (status: CopyStatus) => {
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
    },
    [copyStatusResetRef]
  );

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

  const openDocumentView = useCallback(() => {
    setIsDocumentViewOpen(true);
  }, []);

  const closeDocumentView = useCallback(() => {
    setIsDocumentViewOpen(false);
  }, []);

  const hideToc = useCallback(() => {
    hasUserToggledTocRef.current = true;
    setIsTocVisible(false);
  }, []);

  const showToc = useCallback(() => {
    if (!hasHeadings) {
      return;
    }
    if (typeof window !== 'undefined') {
      const isMd = window.matchMedia('(min-width: 768px)').matches;
      if (!isMd) {
        return;
      }
    }
    hasUserToggledTocRef.current = true;
    setIsTocVisible(true);
  }, [hasHeadings]);

  const scrollToHeading = useCallback(
    (headingId: string) => {
      const preview = previewRef.current;
      if (!preview) {
        return;
      }

      const escapeSelector = (value: string) =>
        value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');

      const target = preview.querySelector<HTMLElement>(`#${escapeSelector(headingId)}`);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

      activeHeadingRef.current = headingId;
      setActiveHeadingId(headingId);

      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          updateActiveHeading();
        });
      }
    },
    [updateActiveHeading]
  );

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
      updateActiveHeading();
    },
    [updateActiveHeading, viewMode]
  );

  useEffect(() => {
    if (previewScrollPercentage === undefined) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const frame = window.requestAnimationFrame(() => updateActiveHeading());
    return () => window.cancelAnimationFrame(frame);
  }, [previewScrollPercentage, updateActiveHeading]);

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
    <>
      <div
        className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 ${isDocumentViewOpen ? 'print:hidden' : ''}`}
      >
        <header className="sticky top-0 z-30 bg-gradient-to-b from-white/98 via-white/95 to-white/92 shadow-[0_1px_0_rgba(148,163,184,0.1),0_12px_32px_-16px_rgba(15,23,42,0.15)] backdrop-blur-xl border-b border-slate-100/50 supports-[backdrop-filter]:bg-white/80">
          <div className="flex w-full flex-col gap-1.5 px-4 py-2 sm:px-6 sm:py-3 lg:px-10 xl:px-14 animate-fade-in">
            <div
              ref={navRowRef}
              className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-3"
            >
              <div className="flex items-center gap-2 md:gap-2.5">
                <Link
                  href="/"
                  className="group flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 px-3 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.12)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="MD-View Home"
                  title="MD-View Home"
                >
                  <img
                    src="/md-view-icon.svg"
                    alt="MD-View logo"
                    className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-1.5 ring-1 ring-slate-200/80 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div className={`${isNavCompact ? 'hidden lg:block' : 'block'} text-left`}>
                    <h1 className="text-lg font-semibold leading-tight text-slate-900">MD-View</h1>
                    <p className="text-xs font-medium text-slate-500">Markdown Editor</p>
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
                  <div className={statPillClass}>
                    <span>{wordCount} words</span>
                    <span className="text-slate-300">•</span>
                    <span>{lineCount} lines</span>
                    <span className="text-slate-300">•</span>
                    <span>{fileSizeKb} KB</span>
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-sm">
                  <button
                    onClick={onPickFile}
                    className={primaryActionButton}
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
                    className={secondaryActionButton}
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
                    className={secondaryActionButton}
                    aria-label="Export as HTML file"
                    title="Export as .html file"
                  >
                    <FileCode className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Export HTML
                    </span>
                  </button>
                  <button
                    onClick={openDocumentView}
                    className={secondaryActionButton}
                    aria-label="Open document view"
                    title="Open print-friendly document view"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                      Document view
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link href="/guide" className={quietNavButton} title="Markdown guide and tips">
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
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 md:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openDocumentView}
                className={mobileActionButton}
                aria-label="Open document view"
                title="Open print-friendly document view"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>Document</span>
              </button>
              <button
                type="button"
                onClick={copyPreviewToClipboard}
                className={mobileCopyButtonClass}
                aria-label="Copy preview HTML to clipboard"
                title="Copy preview HTML to clipboard"
              >
                {copyStatus === 'styled' ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : copyStatus === 'plain' ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Text only</span>
                  </>
                ) : copyStatus === 'error' ? (
                  <>
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Failed</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>
            <QuickActionsMenu
              onImport={onPickFile}
              onExportMarkdown={exportMarkdown}
              onExportHtml={exportHtml}
              onCopyPreview={copyPreviewToClipboard}
              onReset={resetSample}
              onGuide={openGuide}
              onGithub={openGithub}
              triggerClassName={`${mobileActionButton} flex-none`}
              triggerLabel="More"
            />
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
                className="relative flex w-full flex-1 min-h-0 flex-col rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/30 p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm animate-scale-in"
                style={
                  viewMode === 'split' ? { width: '100%', flexBasis: `${ratio * 100}%` } : undefined
                }
                onDrop={onDrop}
                onDragOver={onDragOver}
                aria-label="Markdown editor section"
              >
                <div className="mb-4 flex flex-shrink-0 items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Markdown Editor</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
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
                className="relative flex w-full flex-1 min-h-0 flex-col rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/30 p-4 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm animate-scale-in"
                style={
                  viewMode === 'split'
                    ? { width: '100%', flexBasis: `${(1 - ratio) * 100}%` }
                    : undefined
                }
                aria-label="Markdown preview section"
              >
                <div className="mb-4 flex flex-shrink-0 items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Live Preview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      See the rendered markdown with your chosen theme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyPreviewToClipboard}
                      className={previewCopyButtonClass}
                      aria-label="Copy preview HTML to clipboard"
                      title="Copy preview HTML to clipboard"
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
                      <CompactThemeSelector
                        currentTheme={currentTheme}
                        onThemeChange={setCurrentTheme}
                      />
                    </div>
                    <div className="lg:hidden">
                      <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
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
        </main>

        <Footer />
      </div>
      {hasHeadings && isTocVisible && !isDocumentViewOpen ? (
        <div
          className="fixed bottom-6 right-4 z-30 hidden md:block w-[min(70vw,18rem)] drop-shadow-xl"
          role="complementary"
          aria-label="Floating table of contents"
        >
          <TableOfContents
            headings={tableOfContents}
            activeId={activeHeadingId}
            onNavigate={scrollToHeading}
            onClose={hideToc}
            className="h-full overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
            emptyHint="Add headings (e.g. # Title) to generate a table of contents."
          />
        </div>
      ) : null}
      {hasHeadings && !isTocVisible && !isDocumentViewOpen ? (
        <button
          type="button"
          onClick={showToc}
          className={`${tocReopenButtonClass} hidden md:inline-flex`}
          aria-label="Show table of contents"
          title="Show table of contents"
        >
          <ListTree className="h-4 w-4" aria-hidden="true" />
          <span>Show ToC</span>
        </button>
      ) : null}
      {isDocumentViewOpen ? (
        <DocumentView
          content={debouncedMarkdown}
          theme={currentTheme}
          onThemeChange={setCurrentTheme}
          onClose={closeDocumentView}
        />
      ) : null}
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
