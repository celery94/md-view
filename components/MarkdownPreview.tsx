'use client';

import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy as CopyIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderMermaidToSvg } from '../lib/mermaid-utils';
import { createSlugger, getNodeText } from '../lib/slugify';
import { getTheme } from '../lib/themes';
import { ui } from '../lib/ui-classes';

interface MarkdownPreviewProps {
  content: string;
  theme?: string;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
  variant?: 'app' | 'document';
  deferHeavyBlocks?: boolean;
  className?: string;
  contentClassName?: string;
}

const WECHAT_REFERENCE_HEADING_PATTERN = /^(参考|参考资料|references?|sources?)$/i;

interface MarkdownAstNode {
  type: string;
  url?: string;
  value?: string;
  depth?: number;
  ordered?: boolean;
  spread?: boolean;
  start?: number;
  children?: MarkdownAstNode[];
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

function getMarkdownAstText(node: MarkdownAstNode | undefined): string {
  if (!node) {
    return '';
  }
  if (typeof node.value === 'string') {
    return node.value;
  }
  if (!Array.isArray(node.children)) {
    return '';
  }
  return node.children.map((child) => getMarkdownAstText(child)).join('');
}

function appendNodeClass(node: MarkdownAstNode, className: string): void {
  const existingClassName = node.data?.hProperties?.className;
  const mergedClassName = [
    ...(typeof existingClassName === 'string'
      ? existingClassName.split(/\s+/)
      : Array.isArray(existingClassName)
        ? existingClassName
        : []),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  node.data = {
    ...(node.data ?? {}),
    hProperties: {
      ...(node.data?.hProperties ?? {}),
      className: mergedClassName,
    },
  };
}

function toReferenceMetaText(nodes: MarkdownAstNode[]): string {
  const raw = nodes.map((node) => getMarkdownAstText(node)).join('');
  return raw.replace(/^[\s\u00a0]*[—–\-:：|]+[\s\u00a0]*/, '').trim();
}

function shouldDisplayOriginalReferenceUrl(linkNode: MarkdownAstNode, url: string): boolean {
  const linkText = getMarkdownAstText(linkNode).trim();
  return linkText !== url;
}

function remarkWechatReferenceSection() {
  return (tree: MarkdownAstNode) => {
    if (!Array.isArray(tree.children)) {
      return;
    }

    for (let i = 0; i < tree.children.length; i += 1) {
      const node = tree.children[i];
      if (node.type !== 'heading') {
        continue;
      }

      const headingText = getMarkdownAstText(node).trim();
      if (!WECHAT_REFERENCE_HEADING_PATTERN.test(headingText)) {
        continue;
      }

      appendNodeClass(node, 'mdv-wechat-manual-reference-title');

      const nextNode = tree.children[i + 1];
      if (!nextNode || nextNode.type !== 'list') {
        continue;
      }

      appendNodeClass(nextNode, 'mdv-wechat-manual-reference-list');

      nextNode.children?.forEach((listItem) => {
        if (listItem.type !== 'listItem') {
          return;
        }

        appendNodeClass(listItem, 'mdv-wechat-manual-reference-item');

        const paragraph = listItem.children?.find((child) => child.type === 'paragraph');
        if (!paragraph || !Array.isArray(paragraph.children)) {
          return;
        }

        const linkIndex = paragraph.children.findIndex((child) => child.type === 'link');
        if (linkIndex < 0) {
          return;
        }

        const linkNode = paragraph.children[linkIndex];
        appendNodeClass(linkNode, 'mdv-wechat-manual-reference-link');
        const originalUrl = (linkNode.url ?? '').trim();

        const metaText = toReferenceMetaText(paragraph.children.slice(linkIndex + 1));
        const nextChildren: MarkdownAstNode[] = [linkNode];

        if (originalUrl && shouldDisplayOriginalReferenceUrl(linkNode, originalUrl)) {
          const urlNode: MarkdownAstNode = {
            type: 'link',
            url: originalUrl,
            data: {
              hProperties: {
                className: 'mdv-wechat-manual-reference-url',
              },
            },
            children: [{ type: 'text', value: originalUrl }],
          };
          nextChildren.push({ type: 'break' }, urlNode);
        }

        if (metaText) {
          const metaNode: MarkdownAstNode = {
            type: 'emphasis',
            children: [{ type: 'text', value: metaText }],
            data: {
              hProperties: {
                className: 'mdv-wechat-manual-reference-meta',
              },
            },
          };
          nextChildren.push({ type: 'break' }, metaNode);
        }

        paragraph.children = nextChildren;
      });
    }
  };
}

function extractChildrenText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractChildrenText).join('');
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractChildrenText(node.props.children);
  }
  return '';
}

function MermaidBlock({
  source,
  theme,
  deferRendering = false,
  className,
}: {
  source: string;
  theme: string;
  deferRendering?: boolean;
  className?: string;
}) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const normalizedSource = useMemo(() => source.replace(/\r\n/g, '\n'), [source]);
  const renderSource = useMemo(() => normalizedSource.trimEnd(), [normalizedSource]);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const render = async () => {
      if (!renderSource) {
        if (active) {
          setSvgMarkup(null);
          setErrorMessage('Mermaid diagram is empty.');
          setIsRendering(false);
        }
        return;
      }

      setIsRendering(true);
      setErrorMessage(null);
      setSvgMarkup(null);

      try {
        const svg = await renderMermaidToSvg(renderSource, theme);
        if (!active) return;
        setSvgMarkup(svg);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Failed to render Mermaid diagram.';
        setErrorMessage(message);
      } finally {
        if (active) {
          setIsRendering(false);
        }
      }
    };

    const scheduleRender = () => {
      if (deferRendering) {
        if (typeof idleWindow.requestIdleCallback === 'function') {
          idleId = idleWindow.requestIdleCallback(() => {
            void render();
          }, { timeout: 400 });
          return;
        }

        timeoutId = globalThis.setTimeout(() => {
          void render();
        }, 120);
        return;
      }

      void render();
    };

    scheduleRender();
    return () => {
      active = false;
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleId);
      }
    };
  }, [deferRendering, renderSource, theme]);

  return (
    <div
      className="mdv-mermaid"
      data-mdv-mermaid="true"
      data-mdv-mermaid-source={renderSource}
    >
      {svgMarkup ? (
        <div
          className="mdv-mermaid-diagram"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <div className="mdv-mermaid-fallback">
          {isRendering && <p className="mdv-mermaid-status">Rendering Mermaid diagram...</p>}
          {errorMessage && (
            <p className="mdv-mermaid-error" role="alert">
              Mermaid render error: {errorMessage}
            </p>
          )}
          <pre>
            <code className={className}>
              {renderSource}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  className,
  children,
  theme,
  deferHeavyBlocks = false,
  ...props
}: React.ComponentProps<'code'> & { theme: string; deferHeavyBlocks?: boolean }) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1]?.toLowerCase();
  const isInline = !language;
  const preRef = useRef<HTMLPreElement | null>(null);
  const [copied, setCopied] = useState(false);
  const source = useMemo(() => extractChildrenText(children), [children]);

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

  if (language === 'mermaid') {
    return (
      <MermaidBlock
        source={source}
        theme={theme}
        deferRendering={deferHeavyBlocks}
        className={className}
      />
    );
  }

  return (
    <div className={ui.preview.code.wrapper}>
      {/* Header bar with language + copy */}
      <div
        className={ui.preview.code.header}
        data-no-export="true"
      >
        <span className={ui.preview.code.languageBadge}>
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={ui.preview.code.copyButton}
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

const MarkdownPreviewInner = forwardRef<HTMLDivElement, MarkdownPreviewProps>(function MarkdownPreview(
  {
    content,
    theme = 'default',
    onScroll,
    scrollToPercentage,
    variant = 'app',
    deferHeavyBlocks = false,
    className,
    contentClassName,
  },
  ref
) {
  const [hlPlugin, setHlPlugin] = useState<any>(null);
  const currentTheme = getTheme(theme);
  const needsHighlight = useMemo(() => /```|~~~|`[^`]+`/.test(content), [content]);
  const internalRef = useRef<HTMLDivElement | null>(null);
  const isScrollingSelfRef = useRef(false);
  const scrollResetTimeoutRef = useRef<number | null>(null);

  const setPreviewRefs = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

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
    if (scrollToPercentage === undefined) return;

    const preview = internalRef.current;
    if (!preview) return;
    const scrollHeight = preview.scrollHeight;
    const clientHeight = preview.clientHeight;

    if (scrollHeight <= clientHeight) return;

    const nextScrollTop = scrollToPercentage * (scrollHeight - clientHeight);
    if (Math.abs(preview.scrollTop - nextScrollTop) < 1) return;

    isScrollingSelfRef.current = true;
    preview.scrollTop = nextScrollTop;

    if (scrollResetTimeoutRef.current !== null) {
      window.clearTimeout(scrollResetTimeoutRef.current);
    }
    scrollResetTimeoutRef.current = window.setTimeout(() => {
      isScrollingSelfRef.current = false;
      scrollResetTimeoutRef.current = null;
    }, 80);
  }, [scrollToPercentage]);

  // Add scroll event listener
  useEffect(() => {
    const preview = internalRef.current;
    if (!preview || !onScroll) return;

    preview.addEventListener('scroll', handleScroll);
    return () => preview.removeEventListener('scroll', handleScroll);
  }, [handleScroll, onScroll]);

  useEffect(() => {
    return () => {
      if (scrollResetTimeoutRef.current !== null) {
        window.clearTimeout(scrollResetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!needsHighlight || hlPlugin) {
      return;
    }

    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const loadHighlight = () => {
      import('rehype-highlight').then((m) => {
        if (active) setHlPlugin(() => (m as any).default ?? (m as any));
      });
    };

    if (deferHeavyBlocks) {
      if (typeof idleWindow.requestIdleCallback === 'function') {
        idleId = idleWindow.requestIdleCallback(loadHighlight, { timeout: 500 });
      } else {
        timeoutId = globalThis.setTimeout(loadHighlight, 120);
      }
    } else {
      loadHighlight();
    }

    return () => {
      active = false;
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleId);
      }
    };
  }, [deferHeavyBlocks, needsHighlight, hlPlugin]);

  const rehypePlugins = useMemo(
    () => (needsHighlight && hlPlugin ? [hlPlugin] : []),
    [hlPlugin, needsHighlight]
  );
  const remarkPlugins = useMemo(
    () => (theme === 'wechat-publish' ? [remarkGfm, remarkWechatReferenceSection] : [remarkGfm]),
    [theme]
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
      code({ node: _node, ...props }) {
        return <CodeBlock {...props} theme={theme} deferHeavyBlocks={deferHeavyBlocks} />;
      },
      img({ node: _node, ...props }) {
        const merged = [
          'mx-auto my-4 max-w-[480px] w-full h-auto border border-gray-200 shadow-sm',
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
  }, [deferHeavyBlocks, theme]);

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
      ref={setPreviewRefs}
      className={containerClasses}
      role="region"
      aria-label="Markdown preview area"
      aria-live="polite"
      aria-describedby="preview-description"
      data-theme={theme}
    >
      <div className={proseClasses}>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
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

MarkdownPreviewInner.displayName = 'MarkdownPreview';

const MarkdownPreview = memo(MarkdownPreviewInner, (prev, next) => {
  return (
    prev.content === next.content &&
    prev.theme === next.theme &&
    prev.onScroll === next.onScroll &&
    prev.scrollToPercentage === next.scrollToPercentage &&
    prev.variant === next.variant &&
    prev.deferHeavyBlocks === next.deferHeavyBlocks &&
    prev.className === next.className &&
    prev.contentClassName === next.contentClassName
  );
});

export default MarkdownPreview;
