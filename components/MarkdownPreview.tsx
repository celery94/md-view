'use client';

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getNodeText, slugify } from '../lib/slugify';
import { getTheme, type Theme } from '../lib/themes';

interface MarkdownPreviewProps {
  content: string;
  theme?: string;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
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
        className="absolute right-2 top-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        data-no-export="true"
      >
        {language ? (
          <span className="language-badge px-2 py-0.5 text-[10px] leading-4 rounded bg-gray-800 text-gray-100 border border-gray-700 select-none">
            {language}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onCopy}
          className="copy-button px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
              <span>Copied</span>
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
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  );
}

const components: Components = {
  h1({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h1 id={id} {...(props as any)}>
        {children}
      </h1>
    );
  },
  h2({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h2 id={id} {...(props as any)}>
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h3 id={id} {...(props as any)}>
        {children}
      </h3>
    );
  },
  h4({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h4 id={id} {...(props as any)}>
        {children}
      </h4>
    );
  },
  h5({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h5 id={id} {...(props as any)}>
        {children}
      </h5>
    );
  },
  h6({ children, ...props }) {
    const text = getNodeText(children);
    const id = slugify(text);
    return (
      <h6 id={id} {...(props as any)}>
        {children}
      </h6>
    );
  },
  code: CodeBlock,
  img({ node, ...props }) {
    const merged = [
      'mx-auto my-4 max-w-[480px] w-full h-auto rounded-lg border border-gray-200 shadow-sm',
      (props as any).className,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...(props as any)}
        className={merged}
        loading="lazy"
        decoding="async"
        alt={(props as any).alt ?? ''}
      />
    );
  },
};

const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, theme = 'default', onScroll, scrollToPercentage }, ref) {
    const [hlPlugin, setHlPlugin] = useState<any>(null);
    const currentTheme = getTheme(theme);
    const internalRef = useRef<HTMLDivElement>(null);
    const isScrollingSelfRef = useRef(false);

    // Use the forwarded ref or the internal ref
    const previewRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

    const handleScroll = useCallback((e: Event) => {
      if (isScrollingSelfRef.current) return;
      
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      
      if (scrollHeight <= clientHeight) return;
      
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      onScroll?.(scrollPercentage);
    }, [onScroll]);

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
      let active = true;
      import('rehype-highlight').then((m) => {
        if (active) setHlPlugin(() => (m as any).default ?? (m as any));
      });
      return () => { active = false };
    }, []);

    const rehypePlugins = useMemo(() => (hlPlugin ? [hlPlugin] : []), [hlPlugin]);

    // Inject custom theme styles and syntax highlighting
    useEffect(() => {
      const styleId = 'theme-custom-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // Load appropriate syntax highlighting theme
      let syntaxTheme = '';
      if (theme === 'dark' || theme === 'terminal') {
        // Use dark syntax highlighting
        syntaxTheme = `
          @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');
        `;
      } else {
        // Use light syntax highlighting (default)
        syntaxTheme = `
          @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css');
        `;
      }
      
      styleElement.textContent = syntaxTheme + (currentTheme.customStyles || '');
      
      return () => {
        // Keep the style element for theme switching, just update content
      };
    }, [currentTheme, theme]);

    return (
      <div 
        ref={previewRef}
        className={`${currentTheme.classes.container} h-full overflow-auto`}
        role="region"
        aria-label="Markdown preview area"
        aria-live="polite"
        aria-describedby="preview-description"
        data-theme={theme}
      >
        <div className={currentTheme.classes.prose}>
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
  }
);

export default MarkdownPreview;
