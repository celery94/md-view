'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Upload, FileText, FileCode, RotateCw, BookOpen, Github } from 'lucide-react';

interface QuickActionsMenuProps {
  onImport: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onReset: () => void;
  onGuide: () => void;
  onGithub: () => void;
}

export default function QuickActionsMenu({ 
  onImport, 
  onExportMarkdown, 
  onExportHtml, 
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
        className="rounded-full border border-white/70 bg-white/70 p-2 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
        aria-label="More actions"
        title="More actions"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-white/70 bg-white/80 p-2 shadow-2xl backdrop-blur-sm z-50">
          <button
            onClick={() => handleAction(onImport)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <Upload className="h-4 w-4" />
            Import .md file
          </button>
          <button
            onClick={() => handleAction(onExportMarkdown)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <FileText className="h-4 w-4" />
            Export as Markdown
          </button>
          <button
            onClick={() => handleAction(onExportHtml)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <FileCode className="h-4 w-4" />
            Export as HTML
          </button>
          <hr className="my-2 border-white/60" />
          <button
            onClick={() => handleAction(onGuide)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <BookOpen className="h-4 w-4" />
            Markdown Guide
          </button>
          <button
            onClick={() => handleAction(onGithub)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </button>
          <button
            onClick={() => handleAction(onReset)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <RotateCw className="h-4 w-4" />
            Reset to Sample
          </button>
        </div>
      )}
    </div>
  );
}
