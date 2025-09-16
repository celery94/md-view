'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { themes } from '../lib/themes';

interface CompactThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function CompactThemeSelector({ currentTheme, onThemeChange }: CompactThemeSelectorProps) {
  const currentThemeObj = themes.find(t => t.name === currentTheme) || themes[0];

  return (
    <div className="relative">
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="min-w-[110px] appearance-none rounded-lg border border-white/70 bg-white/70 pl-8 pr-6 py-1.5 text-sm text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
        aria-label="Select preview theme"
        title={`Current theme: ${currentThemeObj.displayName}`}
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
      <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 transform">
        <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}