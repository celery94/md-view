'use client';

import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Link, Code, Quote, Table, Image as ImageIcon, Undo, Redo } from 'lucide-react';

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

export default function Toolbar({ onBold, onItalic, onStrikethrough, onH1, onH2, onH3, onList, onOrderedList, onLink, onCode, onQuote, onTable, onImage, onUndo, onRedo }: ToolbarProps) {
  const buttonClass =
    "rounded-xl p-2 text-slate-600 transition-colors duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-white/70 p-2 shadow-sm backdrop-blur">
      {/* Undo/Redo Group */}
      <button onClick={onUndo} className={buttonClass} title="Undo">
        <Undo className="h-4 w-4" />
      </button>
      <button onClick={onRedo} className={buttonClass} title="Redo">
        <Redo className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-white/70"></div>

      {/* Text Formatting Group */}
      <button onClick={onBold} className={buttonClass} title="Bold">
        <Bold className="h-4 w-4" />
      </button>
      <button onClick={onItalic} className={buttonClass} title="Italic">
        <Italic className="h-4 w-4" />
      </button>
      <button onClick={onStrikethrough} className={buttonClass} title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </button>
      <button onClick={onCode} className={buttonClass} title="Inline Code">
        <Code className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-white/70"></div>

      {/* Headings Group */}
      <button onClick={onH1} className={buttonClass} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </button>
      <button onClick={onH2} className={buttonClass} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button onClick={onH3} className={buttonClass} title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-white/70"></div>

      {/* Lists and Structure Group */}
      <button onClick={onList} className={buttonClass} title="Bulleted List">
        <List className="h-4 w-4" />
      </button>
      <button onClick={onOrderedList} className={buttonClass} title="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </button>
      <button onClick={onQuote} className={buttonClass} title="Blockquote">
        <Quote className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-white/70"></div>

      {/* Media and Links Group */}
      <button onClick={onLink} className={buttonClass} title="Link">
        <Link className="h-4 w-4" />
      </button>
      <button onClick={onImage} className={buttonClass} title="Image">
        <ImageIcon className="h-4 w-4" />
      </button>
      <button onClick={onTable} className={buttonClass} title="Table">
        <Table className="h-4 w-4" />
      </button>
    </div>
  );
}
