'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Upload, FileText, FileCode, RotateCw, BookOpen, Github, Copy } from 'lucide-react';

interface QuickActionsMenuProps {
  onImport: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onCopyPreview: () => void;
  onReset: () => void;
  onGuide: () => void;
  onGithub: () => void;
}

export default function QuickActionsMenu({ 
  onImport, 
  onExportMarkdown, 
  onExportHtml,
  onCopyPreview,
  onReset,
  onGuide,
  onGithub,
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
        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label="More actions"
        title="More actions"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            onClick={() => handleAction(onImport)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Upload className="h-4 w-4" />
            Import .md file
          </button>
          <button
            onClick={() => handleAction(onExportMarkdown)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <FileText className="h-4 w-4" />
            Export as Markdown
          </button>
          <button
            onClick={() => handleAction(onExportHtml)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <FileCode className="h-4 w-4" />
            Export as HTML
          </button>
          <button
            onClick={() => handleAction(onCopyPreview)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Copy className="h-4 w-4" />
            Copy preview HTML
          </button>
          <hr className="my-2 border-slate-200" />
          <button
            onClick={() => handleAction(onGuide)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <BookOpen className="h-4 w-4" />
            Markdown Guide
          </button>
          <button
            onClick={() => handleAction(onGithub)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </button>
          <button
            onClick={() => handleAction(onReset)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCw className="h-4 w-4" />
            Reset to Sample
          </button>
        </div>
      )}
    </div>
  );
}
