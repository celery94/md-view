'use client';

import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
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
          <span className="px-2 py-0.5 text-[10px] leading-4 rounded bg-gray-800 text-gray-100 border border-gray-700 select-none">
            {language}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onCopy}
          className="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
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
  function MarkdownPreview({ content }, ref) {
    const [hlPlugin, setHlPlugin] = useState<any>(null);

    useEffect(() => {
      let active = true;
      import('rehype-highlight').then((m) => {
        if (active) setHlPlugin(() => (m as any).default ?? (m as any));
      });
      return () => { active = false };
    }, []);

    const rehypePlugins = useMemo(() => (hlPlugin ? [hlPlugin] : []), [hlPlugin]);

    return (
      <div 
        className="h-full overflow-auto p-4 bg-white border border-gray-200 rounded-lg"
        role="region"
        aria-label="Markdown preview area"
        aria-live="polite"
        aria-describedby="preview-description"
      >
        <div ref={ref} className="prose prose-slate max-w-none">
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
