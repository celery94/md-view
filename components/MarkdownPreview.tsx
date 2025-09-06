'use client';

import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;
    return !isInline ? (
      <pre className={className}>
        <code {...props}>{children}</code>
      </pre>
    ) : (
      <code className={className} {...props}>{children}</code>
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
