'use client';

import { useState } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';

const initialMarkdown = `# Welcome to Markdown Preview

This is a **real-time markdown editor and preview** application built with Next.js.

## Features

- ✅ Live preview as you type
- ✅ GitHub Flavored Markdown support
- ✅ Syntax highlighting for code blocks
- ✅ Dark mode support
- ✅ Responsive design

## Example Code Block

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Markdown Preview!\`;
}

greetUser('Developer');
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Markdown parsing | ✅ |
| Live preview | ✅ |
| Syntax highlighting | ✅ |

## Blockquote

> "The best way to predict the future is to create it." - Peter Drucker

## Lists

### Todo List
- [x] Set up Next.js project
- [x] Install markdown dependencies
- [x] Create editor component
- [x] Create preview component
- [ ] Add more features

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Start editing in the left panel to see your markdown rendered in real-time!
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Markdown Preview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Real-time markdown editor and preview
        </p>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor panel */}
        <div className="w-1/2 p-4 border-r border-gray-200 dark:border-gray-700">
          <div className="h-full">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Editor
              </h2>
            </div>
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </div>

        {/* Preview panel */}
        <div className="w-1/2 p-4">
          <div className="h-full">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Preview
              </h2>
            </div>
            <MarkdownPreview content={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
