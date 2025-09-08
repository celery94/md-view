export interface Theme {
  name: string;
  displayName: string;
  description: string;
  classes: {
    container: string;
    prose: string;
  };
  customStyles?: string;
}

export const themes: Theme[] = [
  {
    name: 'default',
    displayName: 'Default',
    description: 'Clean and minimal design',
    classes: {
      container: 'h-full overflow-auto p-4 bg-white border border-gray-200 rounded-lg',
      prose: 'prose prose-slate max-w-none'
    }
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Dark theme for low-light environments',
    classes: {
      container: 'h-full overflow-auto p-4 bg-gray-900 border border-gray-700 rounded-lg',
      prose: 'prose prose-invert max-w-none dark-theme'
    },
    customStyles: `
      .dark-theme {
        color: #e5e7eb;
        background: #111827;
      }
      .dark-theme h1, .dark-theme h2, .dark-theme h3, .dark-theme h4, .dark-theme h5, .dark-theme h6 {
        color: #f9fafb;
        border-color: #374151;
      }
      .dark-theme pre {
        background: #1f2937;
        border: 1px solid #374151;
        color: #e5e7eb;
      }
      .dark-theme code {
        background: #1f2937;
        color: #e5e7eb;
        border: 1px solid #374151;
      }
      .dark-theme blockquote {
        border-left: 4px solid #3b82f6;
        background: #1f2937;
        color: #d1d5db;
      }
      .dark-theme table {
        background: #111827;
        border: 1px solid #374151;
      }
      .dark-theme th {
        background: #1f2937;
        border: 1px solid #374151;
        color: #f9fafb;
      }
      .dark-theme td {
        border: 1px solid #374151;
        color: #e5e7eb;
      }
      .dark-theme tr:nth-child(even) {
        background: #1f2937;
      }
      .dark-theme a {
        color: #60a5fa;
      }
      .dark-theme a:hover {
        color: #93c5fd;
      }
      .dark-theme hr {
        border-color: #374151;
      }
      .dark-theme li::marker {
        color: #9ca3af; /* gray-400 for contrast on dark */
        font-weight: 600;
      }
      /* Dark theme specific copy button and language badge styles */
      .dark-theme .mdv-code .copy-button {
        background: #1f2937;
        border: 1px solid #374151;
        color: #e5e7eb;
      }
      .dark-theme .mdv-code .copy-button:hover {
        background: #374151;
      }
      .dark-theme .mdv-code .language-badge {
        background: #1f2937;
        border: 1px solid #374151;
        color: #d1d5db;
      }
      
      /* Dark theme success state for copy button */
      .dark-theme .mdv-code .copy-button .text-green-600 {
        color: #10b981 !important;
      }
    `
  },
  {
    name: 'github',
    displayName: 'GitHub',
    description: 'GitHub-like styling',
    classes: {
      container: 'h-full overflow-auto p-6 bg-white border border-gray-300 rounded-lg',
      prose: 'prose prose-slate max-w-none github-theme'
    },
    customStyles: `
      .github-theme h1 { 
        border-bottom: 1px solid #e1e4e8; 
        padding-bottom: 0.3em; 
        font-size: 2em;
        margin-top: 0;
        margin-bottom: 16px;
      }
      .github-theme h2 { 
        border-bottom: 1px solid #e1e4e8; 
        padding-bottom: 0.3em; 
        font-size: 1.5em;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      .github-theme pre {
        background-color: #f6f8fa;
        border-radius: 6px;
        font-size: 85%;
        line-height: 1.45;
        overflow: auto;
        padding: 16px;
      }
      .github-theme blockquote {
        border-left: 0.25em solid #dfe2e5;
        color: #6a737d;
        padding: 0 1em;
        background: transparent;
      }
      .github-theme table {
        border-spacing: 0;
        border-collapse: collapse;
        display: block;
        width: max-content;
        max-width: 100%;
        overflow: auto;
      }
      .github-theme table th {
        font-weight: 600;
        background-color: #f6f8fa;
        border: 1px solid #d0d7de;
      }
      .github-theme table td {
        border: 1px solid #d0d7de;
      }
    `
  },
  {
    name: 'notion',
    displayName: 'Notion',
    description: 'Notion-inspired design',
    classes: {
      container: 'h-full overflow-auto p-6 bg-white border-0 rounded-lg',
      prose: 'prose prose-slate max-w-none notion-theme'
    },
    customStyles: `
      .notion-theme {
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
        line-height: 1.5;
        color: rgb(55, 53, 47);
      }
      .notion-theme h1, .notion-theme h2, .notion-theme h3 {
        font-weight: 700;
        line-height: 1.2;
        margin-top: 2em;
        margin-bottom: 4px;
      }
      .notion-theme h1 { font-size: 2.5em; }
      .notion-theme h2 { font-size: 1.875em; }
      .notion-theme h3 { font-size: 1.5em; }
      .notion-theme p { margin: 1em 0; }
      .notion-theme pre {
        background: rgb(247, 246, 243);
        border-radius: 3px;
        padding: 16px;
        font-family: "SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace;
        font-size: 14px;
        line-height: 1.4;
      }
      .notion-theme blockquote {
        border-left: 3px solid #dadada;
        background: none;
        padding-left: 14px;
        margin: 16px 0;
        font-style: normal;
      }
      .notion-theme code {
        background: rgba(135, 131, 120, 0.15);
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-size: 85%;
      }
    `
  },
  {
    name: 'medium',
    displayName: 'Medium',
    description: 'Medium.com-style typography',
    classes: {
      container: 'h-full overflow-auto p-8 bg-white border-0 rounded-lg',
      prose: 'prose prose-slate max-w-none medium-theme'
    },
    customStyles: `
      .medium-theme {
        font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
        font-size: 21px;
        line-height: 1.58;
        letter-spacing: -.003em;
        color: rgba(41, 41, 41, 1);
      }
      .medium-theme h1, .medium-theme h2, .medium-theme h3 {
        font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        color: rgba(41, 41, 41, 1);
      }
      .medium-theme h1 {
        font-size: 42px;
        line-height: 1.04;
        letter-spacing: -.015em;
        margin-top: 0;
        margin-bottom: 30px;
      }
      .medium-theme h2 {
        font-size: 34px;
        line-height: 1.15;
        letter-spacing: -.015em;
        margin-top: 56px;
        margin-bottom: 8px;
      }
      .medium-theme h3 {
        font-size: 26px;
        line-height: 1.22;
        letter-spacing: -.012em;
        margin-top: 40px;
        margin-bottom: 4px;
      }
      .medium-theme p {
        margin-top: 29px;
        margin-bottom: 29px;
      }
      .medium-theme pre {
        background: #f7f7f7;
        border: none;
        border-radius: 4px;
        padding: 20px;
        margin: 40px 0;
        font-family: Menlo, Monaco, "Courier New", Courier, monospace;
        font-size: 16px;
        line-height: 1.4;
      }
      .medium-theme blockquote {
        border-left: 3px solid rgba(41, 41, 41, 1);
        padding-left: 23px;
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
        font-size: 24px;
        line-height: 1.48;
        letter-spacing: -.014em;
        background: none;
      }
      .medium-theme code {
        background: #f2f2f2;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: Menlo, Monaco, "Courier New", Courier, monospace;
        font-size: 16px;
      }
    `
  },
  {
    name: 'paper',
    displayName: 'Paper',
    description: 'Academic paper style',
    classes: {
      container: 'h-full overflow-auto p-12 bg-white border border-gray-200 rounded-lg shadow-lg',
      prose: 'prose prose-slate max-w-none paper-theme'
    },
    customStyles: `
      .paper-theme {
        font-family: "Times New Roman", Times, serif;
        font-size: 16px;
        line-height: 1.6;
        color: #000;
        max-width: 210mm;
        margin: 0 auto;
      }
      .paper-theme h1 {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 24px;
        page-break-after: avoid;
      }
      .paper-theme h2 {
        font-size: 18px;
        font-weight: bold;
        margin-top: 24px;
        margin-bottom: 12px;
        page-break-after: avoid;
      }
      .paper-theme h3 {
        font-size: 16px;
        font-weight: bold;
        margin-top: 18px;
        margin-bottom: 9px;
        page-break-after: avoid;
      }
      .paper-theme p {
        text-align: justify;
        margin-bottom: 12px;
        text-indent: 0;
      }
      .paper-theme pre {
        background: #f5f5f5;
        border: 1px solid #ddd;
        font-family: "Courier New", Courier, monospace;
        font-size: 12px;
        padding: 12px;
        margin: 18px 0;
        page-break-inside: avoid;
      }
      .paper-theme blockquote {
        margin: 18px 40px;
        font-style: italic;
        border-left: none;
        background: none;
        padding-left: 0;
      }
      .paper-theme table {
        margin: 18px auto;
        border-collapse: collapse;
        page-break-inside: avoid;
      }
      .paper-theme th, .paper-theme td {
        border: 1px solid #000;
        padding: 6px 12px;
        text-align: left;
      }
      .paper-theme th {
        background: #f0f0f0;
        font-weight: bold;
      }
    `
  },
  {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Ultra-clean minimal design',
    classes: {
      container: 'h-full overflow-auto p-4 bg-gray-50 border-0 rounded-lg',
      prose: 'prose prose-gray max-w-none minimal-theme'
    },
    customStyles: `
      .minimal-theme {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 18px;
        line-height: 1.7;
        color: #333;
      }
      .minimal-theme h1, .minimal-theme h2, .minimal-theme h3 {
        font-weight: 300;
        color: #222;
        margin-top: 2em;
        margin-bottom: 0.5em;
      }
      .minimal-theme h1 { 
        font-size: 2.5em; 
        border-bottom: 1px solid #eee;
        padding-bottom: 0.3em;
      }
      .minimal-theme h2 { font-size: 1.8em; }
      .minimal-theme h3 { font-size: 1.3em; }
      .minimal-theme p { margin: 1.5em 0; }
      .minimal-theme pre {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 0;
        padding: 20px;
        font-family: "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace;
        font-size: 14px;
        line-height: 1.5;
      }
      .minimal-theme blockquote {
        border-left: 2px solid #ccc;
        padding-left: 20px;
        margin: 2em 0;
        background: none;
        font-style: normal;
        color: #666;
      }
      .minimal-theme code {
        background: #f8f8f8;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace;
        font-size: 0.9em;
      }
      .minimal-theme table {
        border: none;
        border-collapse: collapse;
        margin: 2em 0;
      }
      .minimal-theme th, .minimal-theme td {
        border-bottom: 1px solid #eee;
        border-left: none;
        border-right: none;
        padding: 8px 16px;
      }
      .minimal-theme th {
        background: none;
        font-weight: 600;
        color: #555;
      }
    `
  },
  {
    name: 'terminal',
    displayName: 'Terminal',
    description: 'Retro terminal/console style',
    classes: {
      container: 'h-full overflow-auto p-4 bg-black border border-green-500 rounded-lg',
      prose: 'prose prose-invert max-w-none terminal-theme'
    },
    customStyles: `
      .terminal-theme {
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
        line-height: 1.4;
        color: #00ff00;
        background: #000;
      }
      .terminal-theme h1, .terminal-theme h2, .terminal-theme h3 {
        color: #00ff00;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1px solid #00ff00;
        padding-bottom: 4px;
        margin-top: 2em;
        margin-bottom: 1em;
      }
      .terminal-theme h1 { font-size: 18px; }
      .terminal-theme h2 { font-size: 16px; }
      .terminal-theme h3 { font-size: 14px; }
      .terminal-theme p { margin: 1em 0; }
      .terminal-theme pre {
        background: #111;
        border: 1px solid #333;
        color: #fff;
        padding: 12px;
        margin: 1em 0;
      }
      .terminal-theme code {
        background: #111;
        color: #fff;
        padding: 2px 4px;
        border: 1px solid #333;
      }
      .terminal-theme blockquote {
        border-left: 3px solid #00ff00;
        background: #001100;
        padding: 8px 16px;
        margin: 1em 0;
        font-style: normal;
      }
      .terminal-theme a {
        color: #00ffff;
        text-decoration: underline;
      }
      .terminal-theme a:hover {
        color: #ffff00;
      }
      .terminal-theme table {
        border: 1px solid #00ff00;
        background: #000;
      }
      .terminal-theme li::marker {
        color: #00ff00;
        font-weight: 600;
      }
      .terminal-theme th, .terminal-theme td {
        border: 1px solid #333;
        padding: 8px;
        color: #00ff00;
      }
      .terminal-theme th {
        background: #003300;
        font-weight: bold;
      }
      /* Terminal theme specific copy button and language badge styles */
      .terminal-theme .mdv-code .copy-button {
        background: #111;
        border: 1px solid #333;
        color: #00ff00;
      }
      .terminal-theme .mdv-code .copy-button:hover {
        background: #222;
      }
      .terminal-theme .mdv-code .language-badge {
        background: #111;
        border: 1px solid #333;
        color: #00ff00;
      }
      
      /* Terminal theme success state for copy button */
      .terminal-theme .mdv-code .copy-button .text-green-600 {
        color: #00ff00 !important;
      }
    `
  }
];

export function getTheme(themeName: string): Theme {
  return themes.find(theme => theme.name === themeName) || themes[0];
}

export function getThemeNames(): string[] {
  return themes.map(theme => theme.name);
}
