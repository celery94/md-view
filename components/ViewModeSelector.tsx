'use client';

import React, { useEffect, useState } from 'react';
import { Edit3, Eye, Columns } from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  showLabels?: boolean;
}

export default function ViewModeSelector({ currentMode, onModeChange, showLabels = true }: ViewModeSelectorProps) {
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
    { id: 'editor' as ViewMode, label: 'Editor Only', icon: Edit3, description: 'Edit markdown only (Ctrl/Cmd+1)', shortcut: '1' },
    { id: 'split' as ViewMode, label: 'Split View', icon: Columns, description: 'Editor and preview side by side (Ctrl/Cmd+2)', shortcut: '2' },
    { id: 'preview' as ViewMode, label: 'Preview Only', icon: Eye, description: 'Preview only (Ctrl/Cmd+3)', shortcut: '3' },
  ];

  // Filter modes based on screen size - only editor and preview for mobile
  const modes = allModes.filter(mode => {
    // On mobile, exclude split mode
    if (isMobile) {
      return mode.id !== 'split';
    }
    return true;
  });

  return (
    <div
      className="flex items-center gap-0.5 md:gap-1 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-1 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm"
      role="group"
      aria-label="View mode selector"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200
              ${currentMode === mode.id 
                ? 'bg-gradient-to-br from-sky-100 to-sky-50 text-sky-700 shadow-[0_2px_8px_rgba(14,165,233,0.2)] scale-105' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-50 hover:shadow-sm active:scale-95'
              }
              ${mode.id === 'split' ? 'view-mode-split' : ''}
            `}
            title={mode.description}
            aria-label={mode.label}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className={showLabels ? 'hidden sm:inline' : 'sr-only'}>{mode.label}</span>
            <kbd
              className={
                showLabels
                  ? 'hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] rounded border border-slate-200 bg-slate-100 text-slate-500'
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
