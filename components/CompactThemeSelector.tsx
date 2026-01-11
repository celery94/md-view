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
        className="appearance-none min-w-[120px] cursor-pointer rounded-xl border border-slate-200/50 bg-white/50 py-2.5 pl-10 pr-9 text-sm font-semibold text-slate-700 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_20px_-4px_rgba(139,92,246,0.15)] hover:scale-[1.02] hover:border-violet-200/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label="Select preview theme"
        title={`Current theme: ${currentThemeObj.displayName}`}
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-purple-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(139,92,246,0.3)]">
        <Palette className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-violet-500"
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

