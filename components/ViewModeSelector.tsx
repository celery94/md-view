'use client';

import React, { useEffect, useState } from 'react';
import { Edit3, Eye, Columns } from 'lucide-react';

type ViewMode = 'split' | 'editor' | 'preview';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export default function ViewModeSelector({ currentMode, onModeChange }: ViewModeSelectorProps) {
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
    <div className="flex items-center gap-0.5 md:gap-1 bg-gray-100 rounded-lg p-0.5 md:p-1" role="group" aria-label="View mode selector">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              px-2 md:px-3 py-1 md:py-1.5 text-xs rounded-md transition-all duration-200 inline-flex items-center gap-1 md:gap-1.5 relative
              ${currentMode === mode.id 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
              ${mode.id === 'split' ? 'view-mode-split' : ''}
            `}
            title={mode.description}
            aria-label={mode.label}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{mode.label}</span>
            <kbd className="hidden lg:inline-block ml-1 px-1 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded text-gray-500">
              ⌘{mode.shortcut}
            </kbd>
          </button>
        );
      })}
    </div>
  );
}