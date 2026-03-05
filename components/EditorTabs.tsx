'use client';

import { useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

export interface EditorTabsProps {
  openFiles: string[];
  activeFileId: string | null;
  fileNamesById: Record<string, string>;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export function EditorTabs({
  openFiles,
  activeFileId,
  fileNamesById,
  onSelectTab,
  onCloseTab,
}: EditorTabsProps) {
  const handleClose = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onCloseTab(id);
    },
    [onCloseTab]
  );

  return (
    <div
      className="flex flex-shrink-0 items-center gap-0.5 overflow-x-auto border-b border-slate-200/65 bg-white/80 px-2 py-1.5"
      role="tablist"
      aria-label="Open files"
    >
      {openFiles.map((id) => {
        const isActive = id === activeFileId;
        const label = fileNamesById[id] ?? id;
        return (
          <div
            key={id}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              'flex min-w-0 max-w-[12rem] flex-shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors duration-150',
              'hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-1',
              isActive
                ? 'border-slate-200/80 bg-cyan-50 text-slate-900'
                : 'border-transparent bg-transparent text-slate-700'
            )}
            onClick={() => onSelectTab(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTab(id);
              }
            }}
          >
            <span className="min-w-0 truncate" title={label}>
              {label}
            </span>
            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded p-0.5 text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-0"
              aria-label={`Close ${label}`}
              onClick={(e) => handleClose(e, id)}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
