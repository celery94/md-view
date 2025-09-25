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
      className={`flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm ${
        className ?? ''
      }`}
      aria-label="Table of contents"
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">Table of Contents</p>
          <p className="text-xs text-slate-500">Jump across document sections</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-transparent bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close table of contents"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {headings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
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
                  className={`w-full rounded-xl px-3 py-2 text-left transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isActive
                      ? 'bg-sky-100 font-semibold text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
