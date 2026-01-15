'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import ContextMenu from './ContextMenu';
import { formatMarkdown } from '../lib/formatter';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(function MarkdownEditor(
  { value, onChange, onScroll, scrollToPercentage },
  ref
) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const isScrollingSelfRef = useRef(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isVisible: boolean;
  }>({ x: 0, y: 0, isVisible: false });
  const [isFormatting, setIsFormatting] = useState(false);

  // Use the forwarded ref or the internal ref
  const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

  const handleScroll = useCallback(
    (e: Event) => {
      if (isScrollingSelfRef.current) return;

      const target = e.target as HTMLTextAreaElement;
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
    if (scrollToPercentage === undefined || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;

    if (scrollHeight <= clientHeight) return;

    isScrollingSelfRef.current = true;
    textarea.scrollTop = scrollToPercentage * (scrollHeight - clientHeight);

    // Reset flag after a short delay
    setTimeout(() => {
      isScrollingSelfRef.current = false;
    }, 100);
  }, [scrollToPercentage, textareaRef]);

  // Add scroll event listener
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !onScroll) return;

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, [handleScroll, onScroll, textareaRef]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isVisible: true,
    });
  }, []);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Format document using Prettier
  const handleFormatDocument = useCallback(async () => {
    if (isFormatting) return; // Prevent multiple concurrent formatting

    setIsFormatting(true);
    try {
      const formatted = await formatMarkdown(value);
      if (formatted !== value) {
        onChange(formatted);
      }
    } catch (error) {
      console.error('Failed to format document:', error);
    } finally {
      setIsFormatting(false);
    }
  }, [value, onChange, isFormatting]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Shift+Alt+F to format document (like VS Code)
      if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        handleFormatDocument();
      }
    },
    [handleFormatDocument]
  );

  return (
    <>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        placeholder="Start typing your markdown here..."
        className="w-full flex-1 min-h-[20rem] md:min-h-0 resize-none overflow-auto bg-transparent p-6 sm:p-8 font-mono text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
        spellCheck={false}
        aria-label="Markdown editor textarea"
        aria-describedby="editor-description"
        role="textbox"
        aria-multiline="true"
      />
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        isFormatting={isFormatting}
        onClose={closeContextMenu}
        onFormatDocument={handleFormatDocument}
      />
    </>
  );
});

export default MarkdownEditor;
