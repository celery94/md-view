'use client';

import { forwardRef, useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './Toolbar';

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
}

const RichMarkdownEditor = forwardRef<HTMLTextAreaElement, RichMarkdownEditorProps>(
  function RichMarkdownEditor({ value, onChange, onScroll, scrollToPercentage }, ref) {
    const [history, setHistory] = useState<string[]>([value]);
    const [redoStack, setRedoStack] = useState<string[]>([]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (value !== history[history.length - 1]) {
          setHistory([...history, value]);
          setRedoStack([]);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }, [value, history]);

    const handleUndo = () => {
      if (history.length > 1) {
        const lastValue = history[history.length - 1];
        setRedoStack([lastValue, ...redoStack]);
        setHistory(history.slice(0, history.length - 1));
        onChange(history[history.length - 2]);
      }
    };

    const handleRedo = () => {
      if (redoStack.length > 0) {
        const nextValue = redoStack[0];
        setHistory([...history, nextValue]);
        setRedoStack(redoStack.slice(1));
        onChange(nextValue);
      }
    };

  const applyStyle = (style: 'bold' | 'italic' | 'strikethrough' | 'heading' | 'list' | 'link') => {
    const textarea = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let markdown;
    let cursorPosition = start;

    switch (style) {
      case 'bold':
        markdown = `**${selectedText}**`;
        cursorPosition += 2;
        break;
      case 'italic':
        markdown = `*${selectedText}*`;
        cursorPosition += 1;
        break;
      case 'strikethrough':
        markdown = `~~${selectedText}~~`;
        cursorPosition += 2;
        break;
      case 'heading':
        markdown = `## ${selectedText}`;
        cursorPosition += 3;
        break;
      case 'list':
        markdown = `- ${selectedText}`;
        cursorPosition += 2;
        break;
      case 'link':
        markdown = `[${selectedText}](url)`;
        cursorPosition += 1;
        break;
    }

    const newValue = `${value.substring(0, start)}${markdown}${value.substring(end)}`;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = cursorPosition + selectedText.length;
      if (style === 'link' && selectedText.length === 0) {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + selectedText.length + 4;
      }
    }, 0);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toolbar
        onBold={() => applyStyle('bold')}
        onItalic={() => applyStyle('italic')}
        onStrikethrough={() => applyStyle('strikethrough')}
        onHeading={() => applyStyle('heading')}
        onList={() => applyStyle('list')}
        onLink={() => applyStyle('link')}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <MarkdownEditor 
        ref={ref} 
        value={value} 
        onChange={onChange} 
        onScroll={onScroll}
        scrollToPercentage={scrollToPercentage}
      />
    </div>
  );
});

export default RichMarkdownEditor;
