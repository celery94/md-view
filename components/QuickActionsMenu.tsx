'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Upload,
  FileText,
  FileCode,
  RotateCw,
  BookOpen,
  Github,
  Copy,
} from 'lucide-react';

interface QuickActionsMenuProps {
  onImport: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onCopyPreview: () => void;
  onReset: () => void;
  onGuide: () => void;
  onGithub: () => void;
  triggerClassName?: string;
  triggerLabel?: string;
}

export default function QuickActionsMenu({
  onImport,
  onExportMarkdown,
  onExportHtml,
  onCopyPreview,
  onReset,
  onGuide,
  onGithub,
  triggerClassName,
  triggerLabel,
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
        className={`inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/30 to-white p-2.5 text-slate-600 shadow-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${triggerClassName ?? ''}`}
        aria-label={triggerLabel ? `${triggerLabel} actions` : 'More actions'}
        title={triggerLabel ? `${triggerLabel} actions` : 'More actions'}
      >
        <MoreHorizontal className="h-5 w-5" />
        {triggerLabel ? (
          <span className="text-xs font-bold text-current">{triggerLabel}</span>
        ) : null}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/20 to-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.15)] backdrop-blur-sm animate-scale-in ring-1 ring-slate-100/50">
          <button
            onClick={() => handleAction(onImport)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-sky-100 hover:via-sky-50 hover:to-blue-50 hover:text-sky-700 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <Upload className="h-4 w-4" />
            Import .md file
          </button>
          <button
            onClick={() => handleAction(onExportMarkdown)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-sky-100 hover:via-sky-50 hover:to-blue-50 hover:text-sky-700 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <FileText className="h-4 w-4" />
            Export as Markdown
          </button>
          <button
            onClick={() => handleAction(onExportHtml)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-sky-100 hover:via-sky-50 hover:to-blue-50 hover:text-sky-700 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <FileCode className="h-4 w-4" />
            Export as HTML
          </button>
          <button
            onClick={() => handleAction(onCopyPreview)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-sky-100 hover:via-sky-50 hover:to-blue-50 hover:text-sky-700 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <Copy className="h-4 w-4" />
            Copy preview HTML
          </button>
          <hr className="my-3 border-slate-200/70" />
          <button
            onClick={() => handleAction(onGuide)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-slate-100 hover:via-slate-50 hover:to-white hover:text-slate-900 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <BookOpen className="h-4 w-4" />
            Markdown Guide
          </button>
          <button
            onClick={() => handleAction(onGithub)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-slate-100 hover:via-slate-50 hover:to-white hover:text-slate-900 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </button>
          <button
            onClick={() => handleAction(onReset)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-gradient-to-br hover:from-slate-100 hover:via-slate-50 hover:to-white hover:text-slate-900 hover:shadow-md hover:scale-[1.02] active:scale-95"
          >
            <RotateCw className="h-4 w-4" />
            Reset to Sample
          </button>
        </div>
      )}
    </div>
  );
}
