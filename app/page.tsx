'use client';

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react';
import type React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import RichMarkdownEditor from '../components/RichMarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import ThemeSelector from '../components/ThemeSelector';
import CompactThemeSelector from '../components/CompactThemeSelector';
import ViewModeSelector from '../components/ViewModeSelector';
import Footer from '../components/Footer';
import { getTheme } from '../lib/themes';
import { replaceMermaidBlocksWithMarkdown } from '../lib/mermaid-utils';
import { stripLeadingYamlFrontmatter } from '../lib/markdown-frontmatter';
import { useDebouncedValue } from '../lib/use-debounced-value';
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
  MoreHorizontal,
  RotateCw,
  BookOpen,
  Github,
  Image as ImageIcon,
  ClipboardCopy,
  ChevronDown,
  Share2,
  ChevronUp,
} from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';
const SCROLL_TOP_THRESHOLD = 0.25;
const URL_IMPORT_QUERY_KEY = 'url';
const SCROLL_SYNC_EPSILON = 0.001;
const NAV_COMPACT_BREAKPOINT_PX = 1180;
const LOCAL_FILE_POLL_INTERVAL_MS = 1000;
const LARGE_DOCUMENT_CHAR_THRESHOLD = 12000;
const VERY_LARGE_DOCUMENT_CHAR_THRESHOLD = 24000;
const LARGE_DOCUMENT_LINE_THRESHOLD = 320;
const VERY_LARGE_DOCUMENT_LINE_THRESHOLD = 640;
const MODERATE_PREVIEW_DEBOUNCE_MS = 90;
const HEAVY_PREVIEW_DEBOUNCE_MS = 180;
const FAST_STATS_DEBOUNCE_MS = 120;
const HEAVY_STATS_DEBOUNCE_MS = 240;
const MARKDOWN_FILE_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.mdwn'];
const MARKDOWN_PICKER_TYPES = [
  {
    description: 'Markdown files',
    accept: {
      'text/markdown': MARKDOWN_FILE_EXTENSIONS,
      'text/plain': ['.txt'],
    },
  },
];
const LOCAL_FILE_WATCHING_MESSAGE = 'Watching this local file for changes on disk.';
const LOCAL_FILE_FALLBACK_MESSAGE =
  'Auto-reload is unavailable because this file was opened without a persistent local file handle.';
const LOCAL_FILE_KEEP_CURRENT_MESSAGE =
  'Keeping the current editor content. Newer disk changes will prompt again.';

interface ScrollMetrics {
  page: number;
  editor: number;
  preview: number;
}

type LocalFileWatchMode = 'observer' | 'polling' | 'none';
type LocalFileSource = 'launch' | 'picker' | 'input' | 'drop';
type LocalFileAccessState =
  | 'idle'
  | 'watching'
  | 'imported'
  | 'permission-lost'
  | 'deleted'
  | 'error';

interface LocalFileSession {
  handle: FileSystemFileHandle | null;
  fileName: string | null;
  source: LocalFileSource | null;
  diskBaselineMarkdown: string | null;
  lastModified: number | null;
  size: number | null;
  watchMode: LocalFileWatchMode;
  accessState: LocalFileAccessState;
  message: string | null;
  ignoredExternalSignature: string | null;
}

interface PendingExternalUpdate {
  fileName: string;
  markdown: string;
  lastModified: number;
  size: number;
  signature: string;
}

interface LocalFileStatusBanner {
  tone: 'info' | 'warning' | 'error' | 'neutral';
  role: 'status' | 'alert';
  title: string;
  detail: string;
}

interface FileSystemObserver {
  disconnect(): void;
  observe(handle: FileSystemFileHandle): Promise<void> | void;
  unobserve?(handle: FileSystemFileHandle): void;
}

interface FileSystemObserverConstructor {
  new (callback: (records: unknown[]) => void): FileSystemObserver;
}

declare global {
  interface Window {
    FileSystemObserver?: FileSystemObserverConstructor;
    showOpenFilePicker?: (options?: {
      excludeAcceptAllOption?: boolean;
      id?: string;
      multiple?: boolean;
      types?: Array<{
        accept: Record<string, string[]>;
        description?: string;
      }>;
    }) => Promise<FileSystemFileHandle[]>;
  }
}

const EMPTY_LOCAL_FILE_SESSION: LocalFileSession = {
  handle: null,
  fileName: null,
  source: null,
  diskBaselineMarkdown: null,
  lastModified: null,
  size: null,
  watchMode: 'none',
  accessState: 'idle',
  message: null,
  ignoredExternalSignature: null,
};

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

## Mermaid diagram

\`\`\`mermaid
flowchart LR
  Start([Start]) --> Write[Write Markdown]
  Write --> Preview[Preview Diagram]
  Preview --> Export[Export as HTML/DOCX]
\`\`\`

## Table

| Feature | Detail |
| --- | --- |
| Export | Markdown & HTML |
| Themes | Dark, GitHub, Notion, Paper |
| Shortcuts | Ctrl/Cmd + 1 / 2 / 3 |

![Preview](/image.png)
`;

const webAppStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MD-View',
  alternateName: 'Markdown Editor with Live Preview',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: 'https://www.md-view.com/',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.md-view.com/',
  },
  inLanguage: 'en',
  description:
    'Free online markdown editor with live preview. Edit, preview, and export markdown with GitHub Flavored Markdown support, syntax highlighting, and responsive themes.',
  image: 'https://www.md-view.com/og-image',
  screenshot: 'https://www.md-view.com/og-image',
  keywords: [
    'markdown editor',
    'live preview markdown',
    'online markdown editor',
    'github flavored markdown',
    'markdown to html',
    'markdown to pdf',
    'syntax highlighting',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  publisher: {
    '@type': 'Organization',
    name: 'MD-View',
    url: 'https://www.md-view.com/',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.md-view.com/md-view-icon.svg',
      width: 128,
      height: 128,
    },
    sameAs: ['https://github.com/celery94/md-view'],
  },
  featureList: [
    'Real-time markdown preview',
    'GitHub Flavored Markdown support',
    'Syntax highlighting',
    'Import markdown files',
    'Export HTML',
    'Responsive interface',
  ],
  potentialAction: [
    {
      '@type': 'ViewAction',
      target: 'https://www.md-view.com/',
      name: 'Launch the markdown editor',
    },
    {
      '@type': 'ReadAction',
      target: 'https://www.md-view.com/guide',
      name: 'Explore the MD-View guide',
    },
  ],
} as const;

function HomeContent() {
  const searchParams = useSearchParams();
  const [markdown, setMarkdown] = useState(initialMarkdown);
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
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    page: 0,
    editor: 0,
    preview: 0,
  });
  const [urlToImport, setUrlToImport] = useState('');
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [urlImportError, setUrlImportError] = useState<string | null>(null);
  const [isDesktopExportMenuOpen, setIsDesktopExportMenuOpen] = useState(false);
  const [isMobileExportMenuOpen, setIsMobileExportMenuOpen] = useState(false);
  const [isDesktopUtilityMenuOpen, setIsDesktopUtilityMenuOpen] = useState(false);
  const [isMobileUtilityMenuOpen, setIsMobileUtilityMenuOpen] = useState(false);
  const [localFileSession, setLocalFileSession] = useState<LocalFileSession>(EMPTY_LOCAL_FILE_SESSION);
  const [pendingExternalUpdate, setPendingExternalUpdate] = useState<PendingExternalUpdate | null>(
    null
  );

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
  const desktopUtilityMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopUtilityMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileUtilityMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileUtilityMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const autoImportedFromQueryRef = useRef(false);
  const latestMarkdownRef = useRef(markdown);
  const localFileSessionRef = useRef(localFileSession);
  const pendingExternalUpdateRef = useRef(pendingExternalUpdate);
  const hasUnsavedDiskChangesRef = useRef(false);
  const pendingScrollMetricsRef = useRef<ScrollMetrics>({
    page: 0,
    editor: 0,
    preview: 0,
  });
  const scrollMetricsRafRef = useRef<number | null>(null);
  const desktopExportMenuId = useId();
  const desktopExportMenuTriggerId = useId();
  const mobileExportMenuId = useId();
  const mobileExportMenuTriggerId = useId();
  const desktopUtilityMenuId = useId();
  const desktopUtilityMenuTriggerId = useId();
  const mobileUtilityMenuId = useId();
  const mobileUtilityMenuTriggerId = useId();
  const hasUnsavedDiskChanges =
    localFileSession.diskBaselineMarkdown !== null && markdown !== localFileSession.diskBaselineMarkdown;

  const documentPerformance = useMemo(() => {
    const charCount = markdown.length;
    const lineCount = (markdown.match(/\n/g)?.length ?? 0) + 1;
    const mermaidBlockCount = markdown.match(/```mermaid\b/gi)?.length ?? 0;
    const codeFenceCount = Math.floor((markdown.match(/```|~~~/g)?.length ?? 0) / 2);
    const isVeryLargeDocument =
      charCount >= VERY_LARGE_DOCUMENT_CHAR_THRESHOLD ||
      lineCount >= VERY_LARGE_DOCUMENT_LINE_THRESHOLD;
    const isLargeDocument =
      isVeryLargeDocument ||
      charCount >= LARGE_DOCUMENT_CHAR_THRESHOLD ||
      lineCount >= LARGE_DOCUMENT_LINE_THRESHOLD;
    const hasHeavyPreviewBlocks = mermaidBlockCount > 0 || codeFenceCount >= 6;

    return {
      isLargeDocument,
      previewDebounceMs: isVeryLargeDocument
        ? HEAVY_PREVIEW_DEBOUNCE_MS
        : isLargeDocument || (hasHeavyPreviewBlocks && charCount >= 6000)
          ? MODERATE_PREVIEW_DEBOUNCE_MS
          : 0,
      statsDebounceMs: isVeryLargeDocument ? HEAVY_STATS_DEBOUNCE_MS : FAST_STATS_DEBOUNCE_MS,
      deferHeavyPreviewBlocks: isLargeDocument || hasHeavyPreviewBlocks,
    };
  }, [markdown]);

  const debouncedPreviewMarkdown = useDebouncedValue(markdown, documentPerformance.previewDebounceMs);
  const deferredPreviewMarkdown = useDeferredValue(debouncedPreviewMarkdown);
  const previewMarkdown = useMemo(
    () => stripLeadingYamlFrontmatter(deferredPreviewMarkdown),
    [deferredPreviewMarkdown]
  );
  const statsMarkdown = useDebouncedValue(markdown, documentPerformance.statsDebounceMs);

  const { wordCount, lineCount, fileSizeKb } = useMemo(() => {
    const nextWordCount = statsMarkdown.split(/\s+/).filter((word) => word.length > 0).length;
    const nextLineCount = statsMarkdown.split('\n').length;
    const nextFileSizeKb = Math.max(1, Math.round(new Blob([statsMarkdown]).size / 1024));
    return {
      wordCount: nextWordCount,
      lineCount: nextLineCount,
      fileSizeKb: nextFileSizeKb,
    };
  }, [statsMarkdown]);

  useEffect(() => {
    latestMarkdownRef.current = markdown;
  }, [markdown]);

  useEffect(() => {
    localFileSessionRef.current = localFileSession;
  }, [localFileSession]);

  useEffect(() => {
    pendingExternalUpdateRef.current = pendingExternalUpdate;
  }, [pendingExternalUpdate]);

  useEffect(() => {
    hasUnsavedDiskChangesRef.current = hasUnsavedDiskChanges;
  }, [hasUnsavedDiskChanges]);

  const clearLocalFileSession = useCallback(() => {
    setPendingExternalUpdate(null);
    setLocalFileSession(EMPTY_LOCAL_FILE_SESSION);
  }, []);

  const setLocalFileError = useCallback(
    (fileName: string | null, message: string, accessState: Extract<LocalFileAccessState, 'deleted' | 'permission-lost' | 'error'>) => {
      setPendingExternalUpdate(null);
      setLocalFileSession((prev) => ({
        ...EMPTY_LOCAL_FILE_SESSION,
        fileName: fileName ?? prev.fileName,
        accessState,
        message,
      }));
    },
    []
  );

  const setDiskBackedSession = useCallback(
    async ({
      file,
      handle,
      source,
      watchMode,
      accessState,
      message,
    }: {
      accessState: LocalFileAccessState;
      file: File;
      handle: FileSystemFileHandle | null;
      message: string | null;
      source: LocalFileSource;
      watchMode: LocalFileWatchMode;
    }) => {
      const nextMarkdown = await file.text();
      setUrlImportError(null);
      setPendingExternalUpdate(null);
      setMarkdown(nextMarkdown);
      setLocalFileSession({
        handle,
        fileName: file.name,
        source,
        diskBaselineMarkdown: nextMarkdown,
        lastModified: file.lastModified,
        size: file.size,
        watchMode,
        accessState,
        message,
        ignoredExternalSignature: null,
      });
    },
    []
  );

  const openImportedFile = useCallback(
    async (file?: File | null, source: Extract<LocalFileSource, 'input' | 'drop'> = 'input') => {
      if (!file) return;

      try {
        await setDiskBackedSession({
          file,
          handle: null,
          source,
          watchMode: 'none',
          accessState: 'imported',
          message: LOCAL_FILE_FALLBACK_MESSAGE,
        });
      } catch {
        setLocalFileError(file.name, 'Unable to read the selected file.', 'error');
      }
    },
    [setDiskBackedSession, setLocalFileError]
  );

  const openWatchedFile = useCallback(
    async (handle: FileSystemFileHandle, source: Extract<LocalFileSource, 'launch' | 'picker'>) => {
      try {
        const file = await handle.getFile();
        await setDiskBackedSession({
          file,
          handle,
          source,
          watchMode: typeof window.FileSystemObserver === 'function' ? 'observer' : 'polling',
          accessState: 'watching',
          message: LOCAL_FILE_WATCHING_MESSAGE,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setLocalFileError(handle.name, 'Read access to this file was denied.', 'permission-lost');
          return;
        }

        setLocalFileError(handle.name, 'Unable to open this local file.', 'error');
      }
    },
    [setDiskBackedSession, setLocalFileError]
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
    replaceMermaidBlocksWithMarkdown(clone);

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

  useEffect(() => {
    if (!isDesktopUtilityMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopUtilityMenuRef.current &&
        !desktopUtilityMenuRef.current.contains(event.target as Node)
      ) {
        setIsDesktopUtilityMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktopUtilityMenuOpen]);

  useEffect(() => {
    if (!isDesktopUtilityMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setIsDesktopUtilityMenuOpen(false);
      desktopUtilityMenuTriggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDesktopUtilityMenuOpen]);

  useEffect(() => {
    if (!isMobileUtilityMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileUtilityMenuRef.current &&
        !mobileUtilityMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileUtilityMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileUtilityMenuOpen]);

  useEffect(() => {
    if (!isMobileUtilityMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setIsMobileUtilityMenuOpen(false);
      mobileUtilityMenuTriggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileUtilityMenuOpen]);

  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      setIsNavCompact(width >= 768 && width < NAV_COMPACT_BREAKPOINT_PX);
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
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
    return () => {
      if (scrollMetricsRafRef.current !== null) {
        window.cancelAnimationFrame(scrollMetricsRafRef.current);
      }
    };
  }, []);

  const scheduleScrollMetricsCommit = useCallback(() => {
    if (scrollMetricsRafRef.current !== null) {
      return;
    }

    scrollMetricsRafRef.current = window.requestAnimationFrame(() => {
      scrollMetricsRafRef.current = null;
      const next = pendingScrollMetricsRef.current;
      setScrollMetrics((prev) => {
        if (
          Math.abs(prev.page - next.page) < SCROLL_SYNC_EPSILON &&
          Math.abs(prev.editor - next.editor) < SCROLL_SYNC_EPSILON &&
          Math.abs(prev.preview - next.preview) < SCROLL_SYNC_EPSILON
        ) {
          return prev;
        }

        return { ...next };
      });
    });
  }, []);

  const setPendingScrollMetric = useCallback(
    (key: keyof ScrollMetrics, value: number) => {
      const clamped = Math.min(1, Math.max(0, value));
      const pending = pendingScrollMetricsRef.current;
      if (Math.abs(pending[key] - clamped) < SCROLL_SYNC_EPSILON) {
        return;
      }
      pending[key] = clamped;
      scheduleScrollMetricsCommit();
    },
    [scheduleScrollMetricsCommit]
  );

  useEffect(() => {
    const getPageScrollProgress = () => {
      const doc = document.documentElement;
      const scrollableHeight = doc.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return 0;
      const progress = window.scrollY / scrollableHeight;
      return Math.min(1, Math.max(0, progress));
    };

    const handlePageScroll = () => {
      setPendingScrollMetric('page', getPageScrollProgress());
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [setPendingScrollMetric]);

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

  const onPickFile = useCallback(async () => {
    if (typeof window.showOpenFilePicker === 'function') {
      try {
        const [handle] = await window.showOpenFilePicker({
          excludeAcceptAllOption: false,
          id: 'md-view-markdown-open',
          multiple: false,
          types: MARKDOWN_PICKER_TYPES,
        });
        if (handle) {
          await openWatchedFile(handle, 'picker');
        }
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    fileInputRef.current?.click();
  }, [openWatchedFile]);

  const onFileChosen = useCallback(
    (file?: File | null) => {
      void openImportedFile(file, 'input');
    },
    [openImportedFile]
  );

  // Handle file launched via OS file association (PWA File Handling API)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.launchQueue) return;
    window.launchQueue.setConsumer(async (params) => {
      if (params.files.length === 0) return;
      await openWatchedFile(params.files[0], 'launch');
    });
  }, [openWatchedFile]);

  const reconcileExternalFileChange = useCallback(async (file: File) => {
    const session = localFileSessionRef.current;
    if (!session.fileName) {
      return;
    }

    const signature = `${file.lastModified}:${file.size}`;
    if (signature === session.ignoredExternalSignature) {
      return;
    }

    const nextMarkdown = await file.text();
    const currentMarkdown = latestMarkdownRef.current;

    if (nextMarkdown === currentMarkdown) {
      setPendingExternalUpdate(null);
      setLocalFileSession((prev) => {
        if (!prev.fileName || prev.fileName !== file.name) {
          return prev;
        }

        return {
          ...prev,
          diskBaselineMarkdown: nextMarkdown,
          lastModified: file.lastModified,
          size: file.size,
          accessState: prev.handle ? 'watching' : prev.accessState,
          message: prev.handle ? LOCAL_FILE_WATCHING_MESSAGE : prev.message,
          ignoredExternalSignature: null,
        };
      });
      return;
    }

    if (!localFileSessionRef.current.diskBaselineMarkdown || !hasUnsavedDiskChangesRef.current) {
      setPendingExternalUpdate(null);
      setMarkdown(nextMarkdown);
      setLocalFileSession((prev) => {
        if (!prev.fileName || prev.fileName !== file.name) {
          return prev;
        }

        return {
          ...prev,
          diskBaselineMarkdown: nextMarkdown,
          lastModified: file.lastModified,
          size: file.size,
          accessState: prev.handle ? 'watching' : prev.accessState,
          message: prev.handle ? LOCAL_FILE_WATCHING_MESSAGE : prev.message,
          ignoredExternalSignature: null,
        };
      });
      return;
    }

    if (pendingExternalUpdateRef.current?.signature === signature) {
      return;
    }

    setPendingExternalUpdate({
      fileName: file.name,
      markdown: nextMarkdown,
      lastModified: file.lastModified,
      size: file.size,
      signature,
    });
  }, []);

  const checkWatchedFileForChanges = useCallback(async () => {
    const session = localFileSessionRef.current;
    if (!session.handle || session.watchMode === 'none') {
      return;
    }

    try {
      const file = await session.handle.getFile();
      const fileChanged =
        file.lastModified !== session.lastModified || file.size !== session.size;

      if (!fileChanged) {
        return;
      }

      await reconcileExternalFileChange(file);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        setLocalFileError(
          session.fileName,
          'This file was moved or deleted, so auto-reload has stopped.',
          'deleted'
        );
        return;
      }

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setLocalFileError(
          session.fileName,
          'Read access to this file is no longer available.',
          'permission-lost'
        );
        return;
      }

      setLocalFileError(
        session.fileName,
        'Auto-reload stopped because the file could no longer be read.',
        'error'
      );
    }
  }, [reconcileExternalFileChange, setLocalFileError]);

  useEffect(() => {
    if (!localFileSession.handle || localFileSession.watchMode === 'none') {
      return;
    }

    let isCancelled = false;
    let isChecking = false;
    let observer: FileSystemObserver | null = null;

    const runCheck = async () => {
      if (isCancelled || isChecking) {
        return;
      }

      if (document.hidden || !document.hasFocus()) {
        return;
      }

      isChecking = true;
      try {
        await checkWatchedFileForChanges();
      } finally {
        isChecking = false;
      }
    };

    const intervalId = window.setInterval(() => {
      void runCheck();
    }, LOCAL_FILE_POLL_INTERVAL_MS);

    if (
      localFileSession.watchMode === 'observer' &&
      typeof window.FileSystemObserver === 'function'
    ) {
      observer = new window.FileSystemObserver(() => {
        void runCheck();
      });

      Promise.resolve(observer.observe(localFileSession.handle)).catch(() => {});
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void runCheck();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    void runCheck();

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [checkWatchedFileForChanges, localFileSession.handle, localFileSession.watchMode]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      void openImportedFile(f, 'drop');
    },
    [openImportedFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetSample = useCallback(() => {
    clearLocalFileSession();
    setMarkdown(initialMarkdown);
  }, [clearLocalFileSession]);

  const reloadFromDisk = useCallback(() => {
    const pending = pendingExternalUpdateRef.current;
    if (!pending) {
      return;
    }

    setPendingExternalUpdate(null);
    setMarkdown(pending.markdown);
    setLocalFileSession((prev) => {
      if (prev.fileName !== pending.fileName) {
        return prev;
      }

      return {
        ...prev,
        diskBaselineMarkdown: pending.markdown,
        lastModified: pending.lastModified,
        size: pending.size,
        accessState: prev.handle ? 'watching' : prev.accessState,
        message: prev.handle ? LOCAL_FILE_WATCHING_MESSAGE : prev.message,
        ignoredExternalSignature: null,
      };
    });
  }, []);

  const keepCurrentText = useCallback(() => {
    const pending = pendingExternalUpdateRef.current;
    if (!pending) {
      return;
    }

    setPendingExternalUpdate(null);
    setLocalFileSession((prev) => {
      if (prev.fileName !== pending.fileName) {
        return prev;
      }

      return {
        ...prev,
        lastModified: pending.lastModified,
        size: pending.size,
        accessState: prev.handle ? 'watching' : prev.accessState,
        message: LOCAL_FILE_KEEP_CURRENT_MESSAGE,
        ignoredExternalSignature: pending.signature,
      };
    });
  }, []);

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

        clearLocalFileSession();
        setMarkdown(payload.markdown);
        setUrlToImport(payload.sourceUrl || nextUrl);
      } catch {
        setUrlImportError('Network error while importing URL.');
      } finally {
        setIsImportingUrl(false);
      }
    },
    [clearLocalFileSession, urlToImport]
  );

  useEffect(() => {
    if (autoImportedFromQueryRef.current) {
      return;
    }

    const queryUrl = searchParams.get(URL_IMPORT_QUERY_KEY)?.trim();
    if (!queryUrl) {
      return;
    }

    autoImportedFromQueryRef.current = true;
    setUrlToImport(queryUrl);

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete(URL_IMPORT_QUERY_KEY);
    const nextQuery = nextSearchParams.toString();
    const nextLocation = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextLocation);

    void importFromUrl(queryUrl);
  }, [importFromUrl, searchParams]);

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

  const downloadBlob = useCallback((name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const getTimestampedFilename = useCallback((extension: 'md' | 'html' | 'docx' | 'png') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `document-${timestamp}.${extension}`;
  }, []);

  const exportMarkdown = useCallback(() => {
    download(getTimestampedFilename('md'), markdown, 'text/markdown;charset=utf-8');
  }, [download, getTimestampedFilename, markdown]);

  const exportHtml = useCallback(() => {
    const { theme, htmlContent, styles } = getSerializablePreview();

    const doc = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Markdown Export</title><style>${styles}</style></head><body><main class=\"${theme.classes.prose}\">${htmlContent}</main></body></html>`;
    download(getTimestampedFilename('html'), doc, 'text/html;charset=utf-8');
  }, [download, getSerializablePreview, getTimestampedFilename]);

  const exportDocx = useCallback(async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      const { buildDocxBlobFromPreview } = await import('../lib/docx-export');
      const blob = await buildDocxBlobFromPreview(previewElement);
      downloadBlob(getTimestampedFilename('docx'), blob);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
    }
  }, [downloadBlob, getTimestampedFilename]);

  const exportImage = useCallback(async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      const { snapdom } = await import('@zumer/snapdom');
      const result = await snapdom(previewElement);
      await result.download({
        type: 'png',
        filename: getTimestampedFilename('png'),
      });
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  }, [getTimestampedFilename]);

  const prewarmExportModules = useCallback(() => {
    void import('../lib/clipboard-inline-html');
    void import('../lib/docx-export');
    void import('@zumer/snapdom');
  }, []);

  const copyHtmlToClipboard = useCallback(async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      const { buildInlineClipboardPayload } = await import('../lib/clipboard-inline-html');
      const payload = await buildInlineClipboardPayload(previewElement, currentTheme);
      if (!payload.html) return;

      const htmlBlob = new Blob([payload.html], { type: 'text/html' });
      const textBlob = new Blob([payload.plainText], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
    } catch {
      try {
        const { buildInlineClipboardPayload } = await import('../lib/clipboard-inline-html');
        const payload = await buildInlineClipboardPayload(previewElement, currentTheme);
        if (!payload.html) return;
        await navigator.clipboard.writeText(payload.html);
      } catch (error) {
        console.error('Failed to copy inline HTML:', error);
      }
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

  const handleDesktopUtilityAction = useCallback((action: () => void) => {
    action();
    setIsDesktopUtilityMenuOpen(false);
  }, []);

  const handleMobileUtilityAction = useCallback((action: () => void) => {
    action();
    setIsMobileUtilityMenuOpen(false);
  }, []);

  // Scroll synchronization handlers
  const handleEditorScroll = useCallback(
    (scrollPercentage: number) => {
      setPendingScrollMetric('editor', scrollPercentage);
      if (viewMode === 'split') {
        setPreviewScrollPercentage((previous) => {
          if (
            typeof previous === 'number' &&
            Math.abs(previous - scrollPercentage) < SCROLL_SYNC_EPSILON
          ) {
            return previous;
          }
          return scrollPercentage;
        });
      }
    },
    [setPendingScrollMetric, viewMode]
  );

  const handlePreviewScroll = useCallback(
    (scrollPercentage: number) => {
      setPendingScrollMetric('preview', scrollPercentage);
      if (viewMode === 'split') {
        setEditorScrollPercentage((previous) => {
          if (
            typeof previous === 'number' &&
            Math.abs(previous - scrollPercentage) < SCROLL_SYNC_EPSILON
          ) {
            return previous;
          }
          return scrollPercentage;
        });
      }
    },
    [setPendingScrollMetric, viewMode]
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
    const reset: ScrollMetrics = { page: 0, editor: 0, preview: 0 };
    pendingScrollMetricsRef.current = { ...reset };
    if (scrollMetricsRafRef.current !== null) {
      window.cancelAnimationFrame(scrollMetricsRafRef.current);
      scrollMetricsRafRef.current = null;
    }
    setScrollMetrics(reset);
  }, []);

  const activePanelScrollProgress =
    viewMode === 'split'
      ? Math.max(scrollMetrics.editor, scrollMetrics.preview)
      : viewMode === 'editor'
        ? scrollMetrics.editor
        : scrollMetrics.preview;
  const showScrollToTop =
    Math.max(scrollMetrics.page, activePanelScrollProgress) >= SCROLL_TOP_THRESHOLD;

  const toggleDesktopExportMenu = useCallback(() => {
    setIsDesktopExportMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        prewarmExportModules();
      }
      return next;
    });
    setIsMobileExportMenuOpen(false);
    setIsDesktopUtilityMenuOpen(false);
    setIsMobileUtilityMenuOpen(false);
  }, [prewarmExportModules]);

  const toggleMobileExportMenu = useCallback(() => {
    setIsMobileExportMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        prewarmExportModules();
      }
      return next;
    });
    setIsDesktopExportMenuOpen(false);
    setIsDesktopUtilityMenuOpen(false);
    setIsMobileUtilityMenuOpen(false);
  }, [prewarmExportModules]);

  const toggleDesktopUtilityMenu = useCallback(() => {
    setIsDesktopUtilityMenuOpen((prev) => !prev);
    setIsDesktopExportMenuOpen(false);
    setIsMobileExportMenuOpen(false);
    setIsMobileUtilityMenuOpen(false);
  }, []);

  const toggleMobileUtilityMenu = useCallback(() => {
    setIsMobileUtilityMenuOpen((prev) => !prev);
    setIsDesktopExportMenuOpen(false);
    setIsMobileExportMenuOpen(false);
    setIsDesktopUtilityMenuOpen(false);
  }, []);

  const localFileStatusBanner = useMemo<LocalFileStatusBanner | null>(() => {
    if (pendingExternalUpdate && localFileSession.fileName) {
      return {
        tone: 'warning',
        role: 'alert',
        title: 'File changed on disk',
        detail: `${localFileSession.fileName} was updated outside the app. Reload from disk or keep your current edits.`,
      };
    }

    if (!localFileSession.fileName || localFileSession.accessState === 'idle') {
      return null;
    }

    switch (localFileSession.accessState) {
      case 'watching':
        return {
          tone: 'info',
          role: 'status',
          title: `Watching ${localFileSession.fileName}`,
          detail: localFileSession.message ?? LOCAL_FILE_WATCHING_MESSAGE,
        };
      case 'imported':
        return {
          tone: 'neutral',
          role: 'status',
          title: `Imported ${localFileSession.fileName}`,
          detail: localFileSession.message ?? LOCAL_FILE_FALLBACK_MESSAGE,
        };
      case 'permission-lost':
        return {
          tone: 'error',
          role: 'alert',
          title: 'Local file access lost',
          detail:
            localFileSession.message ??
            'Read access to this file is no longer available. Reopen it to resume auto-reload.',
        };
      case 'deleted':
        return {
          tone: 'error',
          role: 'alert',
          title: 'Local file unavailable',
          detail:
            localFileSession.message ??
            'This file was moved or deleted. Reopen it to resume auto-reload.',
        };
      case 'error':
        return {
          tone: 'error',
          role: 'alert',
          title: 'Local file watch stopped',
          detail:
            localFileSession.message ??
            'This file could not be monitored for external changes.',
        };
      default:
        return null;
    }
  }, [localFileSession, pendingExternalUpdate]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppStructuredData) }}
      />
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
                <div className="flex min-w-[19rem] max-w-[32rem] items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-sm shadow-slate-900/5">
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200/70 bg-cyan-50/90 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-all hover:border-cyan-300 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
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

                <div className="flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-sm shadow-slate-900/5">
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
                      onClick={toggleDesktopExportMenu}
                      className={ui.home.buttons.secondary}
                      aria-label="Export actions"
                      title="Export actions"
                      aria-haspopup="menu"
                      aria-expanded={isDesktopExportMenuOpen}
                      aria-controls={isDesktopExportMenuOpen ? desktopExportMenuId : undefined}
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                      <span className={`${isNavCompact ? 'sr-only' : 'hidden md:inline'}`}>
                        Share
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
                          onClick={() => handleDesktopExportAction(() => void copyHtmlToClipboard())}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <ClipboardCopy className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Copy rich HTML</span>
                        </button>
                        <div className="my-1 h-px bg-slate-200/80" />
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
                          onClick={() => handleDesktopExportAction(exportDocx)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Export as DOCX</span>
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
                </div>

                <div ref={desktopUtilityMenuRef} className="relative">
                  <button
                    type="button"
                    ref={desktopUtilityMenuTriggerRef}
                    id={desktopUtilityMenuTriggerId}
                    onClick={toggleDesktopUtilityMenu}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm shadow-slate-900/5 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2 md:px-3.5 md:text-sm"
                    aria-label="More workspace actions"
                    title="More workspace actions"
                    aria-haspopup="menu"
                    aria-expanded={isDesktopUtilityMenuOpen}
                    aria-controls={isDesktopUtilityMenuOpen ? desktopUtilityMenuId : undefined}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    <span className={`${isNavCompact ? 'sr-only' : 'hidden lg:inline'}`}>More</span>
                  </button>
                  {isDesktopUtilityMenuOpen && (
                    <div
                      className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
                      role="menu"
                      id={desktopUtilityMenuId}
                      aria-labelledby={desktopUtilityMenuTriggerId}
                    >
                      <Link
                        href="/guide"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                        role="menuitem"
                        onClick={() => setIsDesktopUtilityMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 text-slate-500" aria-hidden="true" />
                        <span>Open guide</span>
                      </Link>
                      <a
                        href="https://github.com/celery94/md-view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                        role="menuitem"
                        onClick={() => setIsDesktopUtilityMenuOpen(false)}
                      >
                        <Github className="h-4 w-4 text-slate-500" aria-hidden="true" />
                        <span>Open GitHub</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDesktopUtilityAction(resetSample)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                        role="menuitem"
                      >
                        <RotateCw className="h-4 w-4 text-slate-500" aria-hidden="true" />
                        <span>Reset sample</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 p-2.5 shadow-sm shadow-slate-900/5">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/75 p-2">
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                      <Link2 className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Import from URL</p>
                      <p className="text-[11px] text-slate-500">Fetch article content into markdown</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-2.5 py-2">
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
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      disabled={isImportingUrl}
                    />
                    <button
                      onClick={() => void importFromUrl()}
                      disabled={isImportingUrl}
                      className="inline-flex items-center gap-1 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-60"
                      aria-label="Import URL"
                    >
                      {isImportingUrl ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>Import</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={onPickFile}
                      className={cn(ui.home.mobileActionButton, 'px-3 py-2 text-xs')}
                      aria-label="Import markdown file"
                      title="Import .md file"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Import file</span>
                    </button>
                    <div ref={mobileExportMenuRef} className="relative">
                      <button
                        type="button"
                        ref={mobileExportMenuTriggerRef}
                        id={mobileExportMenuTriggerId}
                        onClick={toggleMobileExportMenu}
                        className={cn(ui.home.mobileActionButton, 'px-3 py-2 text-xs')}
                        aria-label="Share actions"
                        title="Share actions"
                        aria-haspopup="menu"
                        aria-expanded={isMobileExportMenuOpen}
                        aria-controls={isMobileExportMenuOpen ? mobileExportMenuId : undefined}
                      >
                        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Share</span>
                        <ChevronDown
                          className={cn('h-3.5 w-3.5 transition-transform', {
                            'rotate-180': isMobileExportMenuOpen,
                          })}
                          aria-hidden="true"
                        />
                      </button>
                      {isMobileExportMenuOpen && (
                        <div
                          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
                          role="menu"
                          id={mobileExportMenuId}
                          aria-labelledby={mobileExportMenuTriggerId}
                        >
                          <button
                            type="button"
                            onClick={() => handleMobileExportAction(() => void copyHtmlToClipboard())}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                            role="menuitem"
                          >
                            <ClipboardCopy className="h-4 w-4 text-slate-500" aria-hidden="true" />
                            <span>Copy rich HTML</span>
                          </button>
                          <div className="my-1 h-px bg-slate-200/80" />
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
                            onClick={() => handleMobileExportAction(exportDocx)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                            role="menuitem"
                          >
                            <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" />
                            <span>Export as DOCX</span>
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
                  </div>

                  <div ref={mobileUtilityMenuRef} className="relative">
                    <button
                      type="button"
                      ref={mobileUtilityMenuTriggerRef}
                      id={mobileUtilityMenuTriggerId}
                      onClick={toggleMobileUtilityMenu}
                      className={cn(ui.home.mobileActionButton, 'px-3 py-2 text-xs')}
                      aria-label="More workspace actions"
                      title="More workspace actions"
                      aria-haspopup="menu"
                      aria-expanded={isMobileUtilityMenuOpen}
                      aria-controls={isMobileUtilityMenuOpen ? mobileUtilityMenuId : undefined}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>More</span>
                    </button>
                    {isMobileUtilityMenuOpen && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
                        role="menu"
                        id={mobileUtilityMenuId}
                        aria-labelledby={mobileUtilityMenuTriggerId}
                      >
                        <Link
                          href="/guide"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                          onClick={() => setIsMobileUtilityMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Open guide</span>
                        </Link>
                        <a
                          href="https://github.com/celery94/md-view"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                          onClick={() => setIsMobileUtilityMenuOpen(false)}
                        >
                          <Github className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Open GitHub</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleMobileUtilityAction(resetSample)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                          role="menuitem"
                        >
                          <RotateCw className="h-4 w-4 text-slate-500" aria-hidden="true" />
                          <span>Reset sample</span>
                        </button>
                      </div>
                    )}
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

            {localFileStatusBanner && (
              <div
                className={cn(
                  'mt-2 rounded-2xl border px-3 py-3 text-sm shadow-sm shadow-slate-900/5',
                  localFileStatusBanner.tone === 'info' &&
                    'border-cyan-200/70 bg-cyan-50/90 text-cyan-900',
                  localFileStatusBanner.tone === 'warning' &&
                    'border-amber-200/70 bg-amber-50/95 text-amber-900',
                  localFileStatusBanner.tone === 'error' &&
                    'border-rose-200/70 bg-rose-50/95 text-rose-900',
                  localFileStatusBanner.tone === 'neutral' &&
                    'border-slate-200/70 bg-slate-50/90 text-slate-700'
                )}
                role={localFileStatusBanner.role}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold tracking-tight">{localFileStatusBanner.title}</p>
                    <p className="mt-1 text-xs leading-5 text-current/80">
                      {localFileStatusBanner.detail}
                    </p>
                    {localFileSession.handle && hasUnsavedDiskChanges && !pendingExternalUpdate && (
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-current/65">
                        Unsaved local edits are only stored in the browser until you export or save
                        elsewhere.
                      </p>
                    )}
                  </div>

                  {pendingExternalUpdate && (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={reloadFromDisk}
                        className="inline-flex items-center justify-center rounded-xl border border-amber-300/80 bg-white/90 px-3 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/45"
                      >
                        Reload from disk
                      </button>
                      <button
                        type="button"
                        onClick={keepCurrentText}
                        className="inline-flex items-center justify-center rounded-xl border border-amber-200/80 bg-amber-100/80 px-3 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/45"
                      >
                        Keep current text
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              className="hidden"
              onChange={(e) => {
                onFileChosen(e.target.files?.[0] ?? null);
                e.target.value = '';
              }}
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
                      deferHeavyBlocks={documentPerformance.deferHeavyPreviewBlocks}
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

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
  .mdv-mermaid { margin: 1.25rem 0; border: 1px solid #d1d5db; border-radius: 10px; background: #ffffff; }
  .mdv-mermaid .mdv-mermaid-diagram { padding: .75rem; }
  .mdv-mermaid .mdv-mermaid-diagram svg { display: block; width: 100%; height: auto; max-width: 100%; }
  .mdv-mermaid .mdv-mermaid-status { margin: 0; padding: .75rem 1rem 0; color: #475569; font-size: .85rem; }
  .mdv-mermaid .mdv-mermaid-error { margin: 0; padding: .75rem 1rem 0; color: #b91c1c; font-size: .85rem; }
  .mdv-mermaid .mdv-mermaid-fallback pre { margin: .75rem; }
`;
