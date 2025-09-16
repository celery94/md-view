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
        className="appearance-none rounded-lg border border-white/70 bg-white/70 px-3 py-1.5 pl-8 pr-8 text-sm text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
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
        className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-sky-500"
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