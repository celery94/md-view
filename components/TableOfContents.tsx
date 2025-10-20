'use client';

import type React from 'react';
import { X } from 'lucide-react';

export interface TocHeading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocHeading[];
  activeId?: string | null;
  onNavigate: (id: string) => void;
  onClose?: () => void;
  className?: string;
  emptyHint?: string;
  style?: React.CSSProperties;
}

export default function TableOfContents({
  headings,
  activeId,
  onNavigate,
  onClose,
  className,
  emptyHint = 'Add headings to build a table of contents.',
  style,
}: TableOfContentsProps) {
  const handleSelect = (id: string) => () => onNavigate(id);

  return (
    <nav
      className={`flex h-full flex-col gap-4 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/30 to-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.15)] backdrop-blur-xl animate-slide-in ring-1 ring-slate-100/50 ${
        className ?? ''
      }`}
      aria-label="Table of contents"
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-base font-bold text-slate-900 tracking-tight">Table of Contents</p>
          <p className="text-xs text-slate-600 mt-1 font-medium">Jump across document sections</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 text-slate-500 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 hover:scale-110 hover:shadow-md active:scale-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close table of contents"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {headings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-500 shadow-inner">
          {emptyHint}
        </p>
      ) : (
        <ol className="flex-1 overflow-y-auto pr-1 text-sm text-slate-600">
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            const padding = Math.max(0, heading.level - 1) * 0.75;
            return (
              <li key={heading.id} className="py-0.5">
                <button
                  type="button"
                  onClick={handleSelect(heading.id)}
                  className={`w-full rounded-xl px-3.5 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isActive
                      ? 'bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 font-bold text-sky-700 shadow-[0_4px_12px_rgba(14,165,233,0.25)] scale-[1.02] ring-1 ring-sky-200/50'
                      : 'text-slate-600 hover:bg-gradient-to-br hover:from-slate-100 hover:via-slate-50 hover:to-white hover:text-slate-900 hover:shadow-md hover:scale-[1.02] active:scale-95'
                  }`}
                  style={{ paddingLeft: `${padding + 0.75}rem` }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="block text-xs leading-snug sm:text-sm" title={heading.title}>
                    {heading.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
