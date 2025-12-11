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
        className="appearance-none min-w-[140px] rounded-xl border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-slate-50/80 pl-10 pr-10 py-3 text-sm font-semibold text-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_6px_20px_rgba(15,23,42,0.12)] hover:scale-[1.02] hover:border-slate-200/80 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
        aria-label="Select preview theme"
        title="Choose preview theme"
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-purple-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(139,92,246,0.3)]">
        <Palette className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-violet-500"
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

