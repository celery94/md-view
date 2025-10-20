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

    const applyStyle = (
      style:
        | 'bold'
        | 'italic'
        | 'strikethrough'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'list'
        | 'orderedList'
        | 'link'
        | 'code'
        | 'quote'
        | 'table'
        | 'image'
    ) => {
      const textarea = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // For headings and blockquotes, work with the entire current line
      if (style === 'h1' || style === 'h2' || style === 'h3' || style === 'quote') {
        // Find the start and end of the current line
        const lines = value.split('\n');
        let currentLineIndex = 0;
        let charCount = 0;

        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length >= start) {
            currentLineIndex = i;
            break;
          }
          charCount += lines[i].length + 1; // +1 for newline
        }

        const currentLine = lines[currentLineIndex];
        const lineStart = charCount;

        let newLine;
        let newCursorPosition;

        if (style === 'quote') {
          // Toggle blockquote
          if (currentLine.startsWith('> ')) {
            newLine = currentLine.substring(2);
            newCursorPosition = lineStart + newLine.length;
          } else {
            newLine = `> ${currentLine}`;
            newCursorPosition = lineStart + newLine.length;
          }
        } else {
          // Handle headings
          const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
          const headingLevel = style === 'h1' ? '#' : style === 'h2' ? '##' : '###';
          newLine = `${headingLevel} ${cleanLine}`;
          newCursorPosition = lineStart + headingLevel.length + 1 + cleanLine.length;
        }

        // Replace the line
        const newLines = [...lines];
        newLines[currentLineIndex] = newLine;
        const newValue = newLines.join('\n');

        onChange(newValue);

        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
        }, 0);

        return;
      }

      // For other styles, work with selected text
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
        case 'code':
          markdown = `\`${selectedText}\``;
          cursorPosition += 1;
          break;
        case 'list':
          markdown = `- ${selectedText}`;
          cursorPosition += 2;
          break;
        case 'orderedList':
          markdown = `1. ${selectedText}`;
          cursorPosition += 3;
          break;
        case 'link':
          markdown = `[${selectedText}](url)`;
          cursorPosition += 1;
          break;
        case 'image':
          markdown = `![${selectedText}](url)`;
          cursorPosition += 2;
          break;
        case 'table':
          markdown =
            selectedText.length > 0
              ? `| ${selectedText} | Column 2 |\n|-----------|----------|\n| Row 1     | Data     |`
              : `| Column 1 | Column 2 |\n|-----------|----------|\n| Row 1     | Data     |`;
          cursorPosition += selectedText.length > 0 ? 2 : 0;
          break;
      }

      const newValue = `${value.substring(0, start)}${markdown}${value.substring(end)}`;
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + selectedText.length;
        if (style === 'link' && selectedText.length === 0) {
          textarea.selectionStart = textarea.selectionEnd =
            cursorPosition + selectedText.length + 4;
        }
      }, 0);
    };

    return (
      <div className="flex w-full flex-1 flex-col min-h-0">
        <Toolbar
          onBold={() => applyStyle('bold')}
          onItalic={() => applyStyle('italic')}
          onStrikethrough={() => applyStyle('strikethrough')}
          onH1={() => applyStyle('h1')}
          onH2={() => applyStyle('h2')}
          onH3={() => applyStyle('h3')}
          onList={() => applyStyle('list')}
          onOrderedList={() => applyStyle('orderedList')}
          onLink={() => applyStyle('link')}
          onCode={() => applyStyle('code')}
          onQuote={() => applyStyle('quote')}
          onTable={() => applyStyle('table')}
          onImage={() => applyStyle('image')}
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
  }
);

export default RichMarkdownEditor;
