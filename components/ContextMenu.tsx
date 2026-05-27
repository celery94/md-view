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
      className="fixed z-50 min-w-[190px] rounded-[14px] border border-[#dddddd] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]"
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
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#222222] transition-colors hover:bg-[#f7f7f7] focus:bg-[#f7f7f7] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {isFormatting ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#ff385c]" />
            ) : (
              <FileText className="h-4 w-4 text-[#ff385c]" />
            )}
            {isFormatting ? 'Formatting...' : 'Format Document'}
          </div>
          {!isFormatting && <span className="text-xs text-[#929292]">Shift+Alt+F</span>}
        </button>
      </div>
    </div>
  );
}
