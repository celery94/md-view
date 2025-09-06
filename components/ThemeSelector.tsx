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
        className="appearance-none px-3 py-1.5 pl-8 pr-8 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
        aria-hidden="true" 
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}