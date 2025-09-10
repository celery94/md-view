'use client';

import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Link, Code, Quote, Table, Image, Undo, Redo } from 'lucide-react';

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
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-200">
      {/* Undo/Redo Group */}
      <button onClick={onUndo} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Undo">
        <Undo className="h-4 w-4" />
      </button>
      <button onClick={onRedo} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Redo">
        <Redo className="h-4 w-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Text Formatting Group */}
      <button onClick={onBold} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Bold">
        <Bold className="h-4 w-4" />
      </button>
      <button onClick={onItalic} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Italic">
        <Italic className="h-4 w-4" />
      </button>
      <button onClick={onStrikethrough} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </button>
      <button onClick={onCode} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Inline Code">
        <Code className="h-4 w-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Headings Group */}
      <button onClick={onH1} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </button>
      <button onClick={onH2} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button onClick={onH3} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Lists and Structure Group */}
      <button onClick={onList} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Bulleted List">
        <List className="h-4 w-4" />
      </button>
      <button onClick={onOrderedList} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </button>
      <button onClick={onQuote} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Blockquote">
        <Quote className="h-4 w-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Media and Links Group */}
      <button onClick={onLink} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Link">
        <Link className="h-4 w-4" />
      </button>
      <button onClick={onImage} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Image">
        <Image className="h-4 w-4" />
      </button>
      <button onClick={onTable} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Table">
        <Table className="h-4 w-4" />
      </button>
    </div>
  );
}
