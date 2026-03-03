'use client';

import { forwardRef, memo, useCallback, useEffect, useRef } from 'react';
import MarkdownEditor from './MarkdownEditor';
import Toolbar from './Toolbar';

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollPercentage: number) => void;
  scrollToPercentage?: number;
}

type EditorStyle =
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
  | 'image';

const MAX_UNDO_HISTORY = 120;
const UNDO_SNAPSHOT_INTERVAL_MS = 500;

const RichMarkdownEditorInner = forwardRef<HTMLTextAreaElement, RichMarkdownEditorProps>(
  function RichMarkdownEditor({ value, onChange, onScroll, scrollToPercentage }, ref) {
    const historyRef = useRef<string[]>([value]);
    const redoStackRef = useRef<string[]>([]);
    const latestValueRef = useRef(value);

    useEffect(() => {
      latestValueRef.current = value;
    }, [value]);

    useEffect(() => {
      const timeout = window.setTimeout(() => {
        const history = historyRef.current;
        if (value !== history[history.length - 1]) {
          history.push(value);
          if (history.length > MAX_UNDO_HISTORY) {
            history.splice(0, history.length - MAX_UNDO_HISTORY);
          }
          redoStackRef.current = [];
        }
      }, UNDO_SNAPSHOT_INTERVAL_MS);
      return () => window.clearTimeout(timeout);
    }, [value]);

    const getTextarea = useCallback(() => {
      return (ref as React.RefObject<HTMLTextAreaElement>)?.current;
    }, [ref]);

    const handleUndo = useCallback(() => {
      const history = historyRef.current;
      if (history.length <= 1) return;

      const current = history.pop();
      if (typeof current === 'string') {
        redoStackRef.current.unshift(current);
        if (redoStackRef.current.length > MAX_UNDO_HISTORY) {
          redoStackRef.current = redoStackRef.current.slice(0, MAX_UNDO_HISTORY);
        }
      }

      const previous = history[history.length - 1] ?? '';
      latestValueRef.current = previous;
      onChange(previous);
    }, [onChange]);

    const handleRedo = useCallback(() => {
      const redoStack = redoStackRef.current;
      const history = historyRef.current;

      if (redoStack.length === 0) return;

      const nextValue = redoStack.shift();
      if (typeof nextValue !== 'string') return;

      history.push(nextValue);
      if (history.length > MAX_UNDO_HISTORY) {
        history.splice(0, history.length - MAX_UNDO_HISTORY);
      }

      latestValueRef.current = nextValue;
      onChange(nextValue);
    }, [onChange]);

    const applyStyle = useCallback(
      (style: EditorStyle) => {
        const textarea = getTextarea();
        if (!textarea) return;

        const content = latestValueRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // For headings and blockquotes, work with the entire current line.
        if (style === 'h1' || style === 'h2' || style === 'h3' || style === 'quote') {
          const lines = content.split('\n');
          let currentLineIndex = 0;
          let charCount = 0;

          for (let i = 0; i < lines.length; i++) {
            if (charCount + lines[i].length >= start) {
              currentLineIndex = i;
              break;
            }
            charCount += lines[i].length + 1;
          }

          const currentLine = lines[currentLineIndex];
          const lineStart = charCount;

          let newLine = currentLine;
          let newCursorPosition = lineStart + currentLine.length;

          if (style === 'quote') {
            if (currentLine.startsWith('> ')) {
              newLine = currentLine.substring(2);
            } else {
              newLine = `> ${currentLine}`;
            }
            newCursorPosition = lineStart + newLine.length;
          } else {
            const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
            const headingLevel = style === 'h1' ? '#' : style === 'h2' ? '##' : '###';
            newLine = `${headingLevel} ${cleanLine}`;
            newCursorPosition = lineStart + headingLevel.length + 1 + cleanLine.length;
          }

          const newLines = [...lines];
          newLines[currentLineIndex] = newLine;
          const newValue = newLines.join('\n');

          latestValueRef.current = newValue;
          onChange(newValue);

          window.setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
          }, 0);
          return;
        }

        // For other styles, work with selected text.
        const selectedText = content.substring(start, end);
        let replacement: string;
        let cursorPosition = start;

        switch (style) {
          case 'bold':
            replacement = `**${selectedText}**`;
            cursorPosition += 2;
            break;
          case 'italic':
            replacement = `*${selectedText}*`;
            cursorPosition += 1;
            break;
          case 'strikethrough':
            replacement = `~~${selectedText}~~`;
            cursorPosition += 2;
            break;
          case 'code':
            replacement = `\`${selectedText}\``;
            cursorPosition += 1;
            break;
          case 'list':
            replacement = `- ${selectedText}`;
            cursorPosition += 2;
            break;
          case 'orderedList':
            replacement = `1. ${selectedText}`;
            cursorPosition += 3;
            break;
          case 'link':
            replacement = `[${selectedText}](url)`;
            cursorPosition += 1;
            break;
          case 'image':
            replacement = `![${selectedText}](url)`;
            cursorPosition += 2;
            break;
          case 'table':
            replacement =
              selectedText.length > 0
                ? `| ${selectedText} | Column 2 |\n|-----------|----------|\n| Row 1     | Data     |`
                : `| Column 1 | Column 2 |\n|-----------|----------|\n| Row 1     | Data     |`;
            cursorPosition += selectedText.length > 0 ? 2 : 0;
            break;
          default:
            return;
        }

        const newValue = `${content.substring(0, start)}${replacement}${content.substring(end)}`;
        latestValueRef.current = newValue;
        onChange(newValue);

        window.setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = cursorPosition + selectedText.length;
          if (style === 'link' && selectedText.length === 0) {
            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 4;
          }
        }, 0);
      },
      [getTextarea, onChange]
    );

    const onBold = useCallback(() => applyStyle('bold'), [applyStyle]);
    const onItalic = useCallback(() => applyStyle('italic'), [applyStyle]);
    const onStrikethrough = useCallback(() => applyStyle('strikethrough'), [applyStyle]);
    const onH1 = useCallback(() => applyStyle('h1'), [applyStyle]);
    const onH2 = useCallback(() => applyStyle('h2'), [applyStyle]);
    const onH3 = useCallback(() => applyStyle('h3'), [applyStyle]);
    const onList = useCallback(() => applyStyle('list'), [applyStyle]);
    const onOrderedList = useCallback(() => applyStyle('orderedList'), [applyStyle]);
    const onLink = useCallback(() => applyStyle('link'), [applyStyle]);
    const onCode = useCallback(() => applyStyle('code'), [applyStyle]);
    const onQuote = useCallback(() => applyStyle('quote'), [applyStyle]);
    const onTable = useCallback(() => applyStyle('table'), [applyStyle]);
    const onImage = useCallback(() => applyStyle('image'), [applyStyle]);

    return (
      <div className="flex w-full min-h-0 flex-1 flex-col overflow-hidden border-t border-slate-200/55 bg-gradient-to-b from-white to-slate-50/35">
        <Toolbar
          onBold={onBold}
          onItalic={onItalic}
          onStrikethrough={onStrikethrough}
          onH1={onH1}
          onH2={onH2}
          onH3={onH3}
          onList={onList}
          onOrderedList={onOrderedList}
          onLink={onLink}
          onCode={onCode}
          onQuote={onQuote}
          onTable={onTable}
          onImage={onImage}
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

RichMarkdownEditorInner.displayName = 'RichMarkdownEditor';

const RichMarkdownEditor = memo(RichMarkdownEditorInner, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.onChange === next.onChange &&
    prev.onScroll === next.onScroll &&
    prev.scrollToPercentage === next.scrollToPercentage
  );
});

export default RichMarkdownEditor;
