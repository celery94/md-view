'use client';

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Printer, X } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import CompactThemeSelector from './CompactThemeSelector';
import ThemeSelector from './ThemeSelector';

interface DocumentViewProps {
  content: string;
  theme: string;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}

export default function DocumentView({
  content,
  theme,
  onThemeChange,
  onClose,
}: DocumentViewProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('document-view-open');

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('document-view-open');
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.print();
  }, []);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="document-view-overlay fixed inset-0 z-50 flex flex-col print:static print:h-auto print:w-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Document view"
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm print:hidden"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 print:p-0 print:overflow-visible">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="document-view-panel relative flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/70 focus:outline-none print:max-w-none print:flex-auto print:rounded-none print:shadow-none print:ring-0"
        >
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-4 sm:px-7 print:hidden">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Document View</h2>
              <p className="text-sm text-slate-600 mt-0.5 font-medium">
                Clean layout for printing or saving to PDF
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden sm:block">
                <CompactThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />
              </div>
              <div className="sm:hidden">
                <ThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/30 to-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-slate-300/70 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Print / PDF</span>
                <span className="sm:hidden">Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-2.5 text-slate-500 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 hover:scale-110 hover:shadow-md active:scale-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Close document view"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="document-view-body flex-1 overflow-hidden bg-white px-3 py-4 sm:px-8 sm:py-8 print:bg-transparent print:px-0 print:py-0">
            <MarkdownPreview
              content={content}
              theme={theme}
              variant="document"
              className="mx-auto h-full max-w-3xl bg-white px-2 pb-12 pt-4 text-slate-900 print:h-auto print:max-w-[7.25in] print:bg-transparent print:px-0 print:pb-0 print:pt-0"
              contentClassName="prose-lg print:prose-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
