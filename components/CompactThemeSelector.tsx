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
    <div className="relative group">
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="appearance-none min-w-[110px] cursor-pointer rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
        className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" 
        aria-hidden="true" 
      />
      <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
