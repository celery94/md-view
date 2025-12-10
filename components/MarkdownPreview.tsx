'use client';

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createSlugger, getNodeText } from '../lib/slugify';
import { getTheme, type Theme } from '../lib/themes';

interface MarkdownPreviewProps {
  content: string;
  theme?: string;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
  variant?: 'app' | 'document';
  className?: string;
  contentClassName?: string;
}

function CodeBlock({ className, children, ...props }: React.ComponentProps<'code'>) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1]?.toLowerCase();
  const isInline = !language;
  const preRef = useRef<HTMLPreElement | null>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      const text = preRef.current?.innerText ?? '';
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  };

  // Inline code — keep default minimal rendering
  if (isInline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group mdv-code">
      {/* Top-right controls */}
      <div
        className="absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
        data-no-export="true"
      >
        {language ? (
          <span className="language-badge select-none rounded-full border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 shadow-[0_2px_8px_rgba(14,165,233,0.15)] backdrop-blur-sm">
            {language}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onCopy}
          className="copy-button inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.12)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
              <span className="font-semibold">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre ref={preRef}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

function createHeadingRenderer(
  Tag: React.ElementType,
  slugger: (value: string) => string
) {
  return function Heading({ children, ...props }: any) {
    const text = getNodeText(children);
    const id = slugger(text);
    const HeadingTag = Tag;

    return (
      <HeadingTag id={id} {...props}>
        {children}
      </HeadingTag>
    );
  };
}

const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(function MarkdownPreview(
  {
    content,
    theme = 'default',
    onScroll,
    scrollToPercentage,
    variant = 'app',
    className,
    contentClassName,
  },
  ref
) {
  const [hlPlugin, setHlPlugin] = useState<any>(null);
  const currentTheme = getTheme(theme);
  const needsHighlight = useMemo(() => /```|~~~|`[^`]+`/.test(content), [content]);
  const internalRef = useRef<HTMLDivElement>(null);
  const isScrollingSelfRef = useRef(false);

  // Use the forwarded ref or the internal ref
  const previewRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

  const handleScroll = useCallback(
    (e: Event) => {
      if (isScrollingSelfRef.current) return;

      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      if (scrollHeight <= clientHeight) return;

      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      onScroll?.(scrollPercentage);
    },
    [onScroll]
  );

  // Handle external scroll commands
  useEffect(() => {
    if (scrollToPercentage === undefined || !previewRef.current) return;

    const preview = previewRef.current;
    const scrollHeight = preview.scrollHeight;
    const clientHeight = preview.clientHeight;

    if (scrollHeight <= clientHeight) return;

    isScrollingSelfRef.current = true;
    preview.scrollTop = scrollToPercentage * (scrollHeight - clientHeight);

    // Reset flag after a short delay
    setTimeout(() => {
      isScrollingSelfRef.current = false;
    }, 100);
  }, [scrollToPercentage, previewRef]);

  // Add scroll event listener
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || !onScroll) return;

    preview.addEventListener('scroll', handleScroll);
    return () => preview.removeEventListener('scroll', handleScroll);
  }, [handleScroll, onScroll, previewRef]);

  useEffect(() => {
    if (!needsHighlight || hlPlugin) {
      return;
    }

    let active = true;
    import('rehype-highlight').then((m) => {
      if (active) setHlPlugin(() => (m as any).default ?? (m as any));
    });
    return () => {
      active = false;
    };
  }, [needsHighlight, hlPlugin]);

  const rehypePlugins = useMemo(
    () => (needsHighlight && hlPlugin ? [hlPlugin] : []),
    [hlPlugin, needsHighlight]
  );

  const components = useMemo<Components>(() => {
    const slugger = createSlugger();

    return {
      h1: createHeadingRenderer('h1', slugger),
      h2: createHeadingRenderer('h2', slugger),
      h3: createHeadingRenderer('h3', slugger),
      h4: createHeadingRenderer('h4', slugger),
      h5: createHeadingRenderer('h5', slugger),
      h6: createHeadingRenderer('h6', slugger),
      code: CodeBlock,
      img({ node: _node, ...props }) {
        const merged = [
          'mx-auto my-4 max-w-[480px] w-full h-auto rounded-lg border border-gray-200 shadow-sm',
          (props as any).className,
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <img
            {...(props as any)}
            className={merged}
            loading="lazy"
            decoding="async"
            alt={(props as any).alt ?? ''}
          />
        );
      },
    } satisfies Components;
  }, []);

  // Inject custom theme styles and syntax highlighting
  useEffect(() => {
    const styleId = 'theme-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = currentTheme.customStyles || '';

    return () => {
      // Keep the style element for theme switching, just update content
    };
  }, [currentTheme]);

  const containerClasses = [
    'markdown-preview',
    variant === 'app'
      ? `${currentTheme.classes.container} flex-1 min-h-0 overflow-auto`
      : 'document-preview w-full overflow-auto print:overflow-visible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const proseClasses = [currentTheme.classes.prose, contentClassName].filter(Boolean).join(' ');

  return (
    <div
      ref={previewRef}
      className={containerClasses}
      role="region"
      aria-label="Markdown preview area"
      aria-live="polite"
      aria-describedby="preview-description"
      data-theme={theme}
    >
      <div className={proseClasses}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypePlugins}
          skipHtml
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

export default MarkdownPreview;
