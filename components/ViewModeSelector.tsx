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
      className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1"
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
              relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium leading-none rounded-lg transition-all duration-200
              ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }
              ${mode.id === 'split' ? 'view-mode-split' : ''}
            `}
            title={mode.description}
            aria-label={mode.label}
          >
            <Icon
              className="relative block flex-shrink-0 h-3.5 w-3.5"
              aria-hidden="true"
            />
            <span className={`relative ${showLabels ? 'hidden sm:inline' : 'sr-only'}`}>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
