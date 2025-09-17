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
    "rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {/* Undo/Redo Group */}
      <button type="button" onClick={onUndo} className={buttonClass} title="Undo">
        <Undo className="h-4 w-4" />
      </button>
      <button type="button" onClick={onRedo} className={buttonClass} title="Redo">
        <Redo className="h-4 w-4" />
      </button>
      
      <div className="mx-1 h-6 w-px bg-slate-200" />
      
      {/* Text Formatting Group */}
      <button type="button" onClick={onBold} className={buttonClass} title="Bold">
        <Bold className="h-4 w-4" />
      </button>
      <button type="button" onClick={onItalic} className={buttonClass} title="Italic">
        <Italic className="h-4 w-4" />
      </button>
      <button type="button" onClick={onStrikethrough} className={buttonClass} title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </button>
      <button type="button" onClick={onCode} className={buttonClass} title="Inline Code">
        <Code className="h-4 w-4" />
      </button>
      
      <div className="mx-1 h-6 w-px bg-slate-200" />
      
      {/* Headings Group */}
      <button type="button" onClick={onH1} className={buttonClass} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </button>
      <button type="button" onClick={onH2} className={buttonClass} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button type="button" onClick={onH3} className={buttonClass} title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </button>
      
      <div className="mx-1 h-6 w-px bg-slate-200" />
      
      {/* Lists and Structure Group */}
      <button type="button" onClick={onList} className={buttonClass} title="Bulleted List">
        <List className="h-4 w-4" />
      </button>
      <button type="button" onClick={onOrderedList} className={buttonClass} title="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </button>
      <button type="button" onClick={onQuote} className={buttonClass} title="Blockquote">
        <Quote className="h-4 w-4" />
      </button>
      
      <div className="mx-1 h-6 w-px bg-slate-200" />
      
      {/* Media and Links Group */}
      <button type="button" onClick={onLink} className={buttonClass} title="Link">
        <Link className="h-4 w-4" />
      </button>
      <button type="button" onClick={onImage} className={buttonClass} title="Image">
        <ImageIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={onTable} className={buttonClass} title="Table">
        <Table className="h-4 w-4" />
      </button>
    </div>
  );
}
