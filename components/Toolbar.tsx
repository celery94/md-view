'use client';

import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, Link, Undo, Redo } from 'lucide-react';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onH1: () => void;
  onH2: () => void;
  onH3: () => void;
  onList: () => void;
  onLink: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export default function Toolbar({ onBold, onItalic, onStrikethrough, onH1, onH2, onH3, onList, onLink, onUndo, onRedo }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-200">
      <button onClick={onUndo} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Undo">
        <Undo className="h-4 w-4" />
      </button>
      <button onClick={onRedo} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Redo">
        <Redo className="h-4 w-4" />
      </button>
      <button onClick={onBold} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Bold">
        <Bold className="h-4 w-4" />
      </button>
      <button onClick={onItalic} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Italic">
        <Italic className="h-4 w-4" />
      </button>
      <button onClick={onStrikethrough} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </button>
      <button onClick={onH1} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </button>
      <button onClick={onH2} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button onClick={onH3} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </button>
      <button onClick={onList} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Bulleted List">
        <List className="h-4 w-4" />
      </button>
      <button onClick={onLink} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Link">
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
}
