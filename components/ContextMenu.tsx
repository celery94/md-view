'use client';

import { useEffect, useRef } from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onFormatDocument: () => void;
  isVisible: boolean;
  isFormatting?: boolean;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onFormatDocument,
  isVisible,
  isFormatting = false,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleFormatClick = () => {
    onFormatDocument();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[190px] rounded-xl border border-slate-300/65 bg-white/90 shadow-[0_16px_36px_-22px_rgba(15,23,42,0.8)] ring-1 ring-white/70 backdrop-blur"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="py-1">
        <button
          type="button"
          onClick={handleFormatClick}
          disabled={isFormatting}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-cyan-50 focus:bg-cyan-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {isFormatting ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-700" />
            ) : (
              <FileText className="h-4 w-4 text-cyan-700" />
            )}
            {isFormatting ? 'Formatting...' : 'Format Document'}
          </div>
          {!isFormatting && <span className="text-xs text-slate-400">Shift+Alt+F</span>}
        </button>
      </div>
    </div>
  );
}
