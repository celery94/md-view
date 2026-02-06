'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { themes } from '../lib/themes';

interface CompactThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function CompactThemeSelector({
  currentTheme,
  onThemeChange,
}: CompactThemeSelectorProps) {
  const currentThemeObj = themes.find((t) => t.name === currentTheme) || themes[0];

  return (
    <div className="relative group">
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="min-w-[120px] appearance-none cursor-pointer rounded-lg border border-slate-300/70 bg-white/90 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-cyan-300/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2"
        aria-label="Select preview theme"
        title={`Current theme: ${currentThemeObj.displayName}`}
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-cyan-700/75">
        <Palette className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
