'use client';

import { forwardRef, useCallback, useEffect, useRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  function MarkdownEditor({ value, onChange, onScroll, scrollToPercentage }, ref) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const isScrollingSelfRef = useRef(false);

    // Use the forwarded ref or the internal ref
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const handleScroll = useCallback((e: Event) => {
      if (isScrollingSelfRef.current) return;
      
      const target = e.target as HTMLTextAreaElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      
      if (scrollHeight <= clientHeight) return;
      
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      onScroll?.(scrollPercentage);
    }, [onScroll]);

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

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your markdown here..."
        className="w-full flex-1 min-h-0 resize-none overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-800 shadow-inner outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        spellCheck={false}
        aria-label="Markdown editor textarea"
        aria-describedby="editor-description"
        role="textbox"
        aria-multiline="true"
      />
    );
  }
);

export default MarkdownEditor;
