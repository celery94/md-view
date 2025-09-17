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
    <div className="relative inline-block">
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="appearance-none min-w-[140px] rounded-xl border border-slate-200 bg-white pl-8 pr-10 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label="Select preview theme"
        title="Choose preview theme"
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <Palette 
        className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" 
        aria-hidden="true" 
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
