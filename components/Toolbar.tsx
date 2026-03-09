'use client';

import { memo, useEffect, useId, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Table,
  Image as ImageIcon,
  Undo,
  Redo,
  MoreHorizontal,
} from 'lucide-react';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onH1: () => void;
  onH2: () => void;
  onH3: () => void;
  onList: () => void;
  onOrderedList: () => void;
  onLink: () => void;
  onCode: () => void;
  onQuote: () => void;
  onTable: () => void;
  onImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const buttonClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-all duration-200 hover:border-slate-300/70 hover:bg-white hover:text-slate-800 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-1';

const buttonGroupClass =
  'flex items-center gap-0.5 rounded-xl border border-slate-200/70 bg-white/80 p-1 shadow-sm shadow-slate-900/5';

const menuItemClass =
  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35';

function Toolbar({
  onBold,
  onItalic,
  onStrikethrough,
  onH1,
  onH2,
  onH3,
  onList,
  onOrderedList,
  onLink,
  onCode,
  onQuote,
  onTable,
  onImage,
  onUndo,
  onRedo,
}: ToolbarProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const moreMenuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuId = useId();
  const moreMenuTriggerId = useId();

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setIsMoreMenuOpen(false);
      moreMenuTriggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMoreMenuOpen]);

  const handleOverflowAction = (action: () => void) => {
    action();
    setIsMoreMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-2 border-b border-slate-200/65 bg-gradient-to-r from-slate-100/80 via-white to-slate-100/50 px-3 py-2">
      <div className={buttonGroupClass}>
        <button type="button" onClick={onUndo} className={buttonClass} title="Undo">
          <Undo className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRedo} className={buttonClass} title="Redo">
          <Redo className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={buttonGroupClass}>
          <button type="button" onClick={onBold} className={buttonClass} title="Bold">
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" onClick={onItalic} className={buttonClass} title="Italic">
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" onClick={onCode} className={buttonClass} title="Inline Code">
            <Code className="h-4 w-4" />
          </button>
        </div>

        <div className={buttonGroupClass}>
          <button type="button" onClick={onH1} className={buttonClass} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </button>
          <button type="button" onClick={onList} className={buttonClass} title="Bulleted List">
            <List className="h-4 w-4" />
          </button>
          <button type="button" onClick={onLink} className={buttonClass} title="Link">
            <Link className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={moreMenuRef} className="relative shrink-0">
        <button
          type="button"
          ref={moreMenuTriggerRef}
          id={moreMenuTriggerId}
          onClick={() => setIsMoreMenuOpen((prev) => !prev)}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/85 px-3 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-900/5 transition-colors duration-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-1"
          title="More formatting options"
          aria-label="More formatting options"
          aria-haspopup="menu"
          aria-expanded={isMoreMenuOpen}
          aria-controls={isMoreMenuOpen ? moreMenuId : undefined}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">More</span>
        </button>
        {isMoreMenuOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md"
            role="menu"
            id={moreMenuId}
            aria-labelledby={moreMenuTriggerId}
          >
            <button
              type="button"
              onClick={() => handleOverflowAction(onH2)}
              className={menuItemClass}
              role="menuitem"
            >
              <Heading2 className="h-4 w-4 text-slate-500" />
              <span>Heading 2</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onH3)}
              className={menuItemClass}
              role="menuitem"
            >
              <Heading3 className="h-4 w-4 text-slate-500" />
              <span>Heading 3</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onOrderedList)}
              className={menuItemClass}
              role="menuitem"
            >
              <ListOrdered className="h-4 w-4 text-slate-500" />
              <span>Numbered List</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onQuote)}
              className={menuItemClass}
              role="menuitem"
            >
              <Quote className="h-4 w-4 text-slate-500" />
              <span>Blockquote</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onStrikethrough)}
              className={menuItemClass}
              role="menuitem"
            >
              <Strikethrough className="h-4 w-4 text-slate-500" />
              <span>Strikethrough</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onImage)}
              className={menuItemClass}
              role="menuitem"
            >
              <ImageIcon className="h-4 w-4 text-slate-500" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => handleOverflowAction(onTable)}
              className={menuItemClass}
              role="menuitem"
            >
              <Table className="h-4 w-4 text-slate-500" />
              <span>Table</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Toolbar);
