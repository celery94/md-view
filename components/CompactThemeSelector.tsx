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
        className="appearance-none pl-8 pr-6 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[100px]"
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
        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
        aria-hidden="true" 
      />
      <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}