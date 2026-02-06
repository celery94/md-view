'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { themes } from '../lib/themes';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="relative inline-block group">
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="min-w-[130px] appearance-none cursor-pointer rounded-xl border border-slate-300/65 bg-white/90 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-cyan-300/55 hover:bg-white hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-1"
        aria-label="Select preview theme"
        title="Choose preview theme"
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-cyan-700/70">
        <Palette className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400"
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
