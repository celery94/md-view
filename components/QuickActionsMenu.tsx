'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Upload, FileText, FileCode, RotateCw, BookOpen } from 'lucide-react';

interface QuickActionsMenuProps {
  onImport: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onReset: () => void;
  onGuide: () => void;
}

export default function QuickActionsMenu({ 
  onImport, 
  onExportMarkdown, 
  onExportHtml, 
  onReset, 
  onGuide 
}: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="More actions"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleAction(onImport)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import .md file
          </button>
          <button
            onClick={() => handleAction(onExportMarkdown)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as Markdown
          </button>
          <button
            onClick={() => handleAction(onExportHtml)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileCode className="h-4 w-4" />
            Export as HTML
          </button>
          <hr className="my-1" />
          <button
            onClick={() => handleAction(onGuide)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Markdown Guide
          </button>
          <button
            onClick={() => handleAction(onReset)}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Reset to Sample
          </button>
        </div>
      )}
    </div>
  );
}