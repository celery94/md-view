'use client';

import React, { useEffect, useState } from 'react';
import { Edit3, Eye, Columns } from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  showLabels?: boolean;
}

export default function ViewModeSelector({
  currentMode,
  onModeChange,
  showLabels = true,
}: ViewModeSelectorProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto-switch from split mode to editor mode when on mobile
  useEffect(() => {
    if (isMobile && currentMode === 'split') {
      onModeChange('editor');
    }
  }, [isMobile, currentMode, onModeChange]);

  const allModes = [
    {
      id: 'editor' as ViewMode,
      label: 'Editor Only',
      icon: Edit3,
      description: 'Edit markdown only (Ctrl/Cmd+1)',
      shortcut: '1',
    },
    {
      id: 'split' as ViewMode,
      label: 'Split View',
      icon: Columns,
      description: 'Editor and preview side by side (Ctrl/Cmd+2)',
      shortcut: '2',
    },
    {
      id: 'preview' as ViewMode,
      label: 'Preview Only',
      icon: Eye,
      description: 'Preview only (Ctrl/Cmd+3)',
      shortcut: '3',
    },
  ];

  // Filter modes based on screen size - only editor and preview for mobile
  const modes = allModes.filter((mode) => {
    // On mobile, exclude split mode
    if (isMobile) {
      return mode.id !== 'split';
    }
    return true;
  });

  return (
    <div
      className="flex items-center gap-1 md:gap-1.5 rounded-2xl border border-slate-200/50 bg-white/40 p-1.5 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] backdrop-blur-md ring-1 ring-white/50"
      role="group"
      aria-label="View mode selector"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              relative flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 text-xs font-semibold leading-none rounded-xl transition-all duration-300
              ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_4px_16px_-4px_rgba(14,165,233,0.3)] scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/70 hover:shadow-sm hover:scale-[1.02] active:scale-95'
              }
              ${mode.id === 'split' ? 'view-mode-split' : ''}
            `}
            title={mode.description}
            aria-label={mode.label}
          >
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-400/20 blur-sm" />
            )}
            <Icon
              className={`relative block flex-shrink-0 h-3.5 w-3.5 ${isActive ? 'drop-shadow-sm' : ''}`}
              aria-hidden="true"
            />
            <span className={`relative ${showLabels ? 'hidden sm:inline' : 'sr-only'}`}>{mode.label}</span>
            <kbd
              className={
                showLabels
                  ? `hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] rounded border ${isActive ? 'border-white/30 bg-white/10 text-white/80' : 'border-slate-200 bg-slate-100 text-slate-400'}`
                  : 'hidden'
              }
            >
              ⌘{mode.shortcut}
            </kbd>
          </button>
        );
      })}
    </div>
  );
}
