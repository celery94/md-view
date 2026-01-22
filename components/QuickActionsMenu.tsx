'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import {
  MoreHorizontal,
  Upload,
  FileText,
  FileCode,
  Image,
  ClipboardCopy,
  RotateCw,
  BookOpen,
  Github,
} from 'lucide-react';

interface QuickActionsMenuProps {
  onImport: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onExportImage: () => void;
  onCopyHtml: () => void;
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
  onExportImage,
  onCopyHtml,
  onReset,
  onGuide,
  onGithub,
  triggerClassName,
  triggerLabel,
}: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const triggerId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        ref={triggerRef}
        id={triggerId}
        className={`inline-flex items-center gap-2 rounded-xl border border-slate-200/50 bg-white/50 p-2.5 text-slate-500 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:text-slate-900 hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.1)] hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${triggerClassName ?? ''}`}
        aria-label={triggerLabel ? `${triggerLabel} actions` : 'More actions'}
        title={triggerLabel ? `${triggerLabel} actions` : 'More actions'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
      >
        <MoreHorizontal className="h-5 w-5" />
        {triggerLabel ? (
          <span className="text-xs font-bold text-current">{triggerLabel}</span>
        ) : null}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200/50 bg-white/80 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl animate-scale-in ring-1 ring-white/50"
          role="menu"
          id={menuId}
          aria-labelledby={triggerId}
        >
          {/* File actions group */}
          <div className="space-y-0.5">
            <button
              onClick={() => handleAction(onImport)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100/80 text-sky-600 transition-all duration-200 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(14,165,233,0.3)]">
                <Upload className="h-4 w-4" />
              </div>
              <span>Import .md file</span>
            </button>
            <button
              onClick={() => handleAction(onExportMarkdown)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 hover:text-indigo-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100/80 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                <FileText className="h-4 w-4" />
              </div>
              <span>Export as Markdown</span>
            </button>
            <button
              onClick={() => handleAction(onExportHtml)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100/80 text-violet-600 transition-all duration-200 group-hover:bg-violet-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(139,92,246,0.3)]">
                <FileCode className="h-4 w-4" />
              </div>
              <span>Export as HTML</span>
            </button>
            <button
              onClick={() => handleAction(onExportImage)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                <Image className="h-4 w-4" />
              </div>
              <span>Export as Image</span>
            </button>
            <button
              onClick={() => handleAction(onCopyHtml)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100/80 text-rose-600 transition-all duration-200 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(244,63,94,0.3)]">
                <ClipboardCopy className="h-4 w-4" />
              </div>
              <span>Copy HTML for Email/Word</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
          
          {/* Utility actions group */}
          <div className="space-y-0.5">
            <button
              onClick={() => handleAction(onGuide)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500 transition-all duration-200 group-hover:bg-slate-600 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(71,85,105,0.3)]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span>Markdown Guide</span>
            </button>
            <button
              onClick={() => handleAction(onGithub)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500 transition-all duration-200 group-hover:bg-slate-800 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(30,41,59,0.3)]">
                <Github className="h-4 w-4" />
              </div>
              <span>View on GitHub</span>
            </button>
            <button
              onClick={() => handleAction(onReset)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/80 text-amber-600 transition-all duration-200 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
                <RotateCw className="h-4 w-4" />
              </div>
              <span>Reset to Sample</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
