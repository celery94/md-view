# Copilot Instructions for md-view

## Project Overview

A real-time markdown editor and preview application built with Next.js 15, React 19, and Tailwind CSS. The app features a split-pane interface with live markdown preview, syntax highlighting, and responsive design.

## Architecture

### Core Components

- **`app/page.tsx`**: Main split-pane layout with responsive flex design (`flex-col md:flex-row`)
- **`components/MarkdownEditor.tsx`**: Controlled textarea with monospace font and auto-scrolling
- **`components/MarkdownPreview.tsx`**: React-markdown renderer with GitHub Flavored Markdown support

### Key Dependencies & Patterns

- **Markdown Processing**: `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-raw`
- **Styling**: Tailwind CSS with `@tailwindcss/typography` for prose styling
- **Syntax Highlighting**: `highlight.js` with GitHub theme
- **Layout Strategy**: Flexbox with `flex-1`, `min-h-0`, and responsive breakpoints

## Development Workflows

### Local Development

```bash
npm run dev        # Uses Turbopack for faster builds
npm run build      # Production build with Turbopack
npm run start      # Start production server
```

### Project-Specific Conventions

#### Component Structure

- All components use `'use client'` directive (client-side rendering)
- Props interfaces defined inline above component functions
- TypeScript with strict typing, using `any` only for react-markdown component props

#### Layout Patterns

```tsx
// Split-pane responsive pattern used throughout
<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
  <div className="w-full md:w-1/2 p-4 flex flex-col">
    <div className="mb-3 flex-shrink-0">Header</div>
    <div className="flex-1 min-h-0">Content</div>
  </div>
</div>
```

#### Styling Conventions

- Dark mode via CSS variables and `prefers-color-scheme`
- Custom scrollbar styling in `globals.css`
- Prose styling: `prose prose-slate dark:prose-invert max-w-none`
- Responsive utilities: `w-full md:w-1/2`, `flex-col md:flex-row`

#### Markdown Component Customization

```tsx
// Standard pattern for customizing code blocks
components={{
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match;
    return !isInline ? (/* block code */) : (/* inline code */);
  },
}}
```

## Critical Implementation Details

### Height Management

- Use `h-full overflow-auto` for scrollable containers
- Apply `flex-1 min-h-0` to make flex children respect container height
- Mobile: explicit heights like `h-64 md:h-auto` for proper mobile layout

### State Management

Simple `useState` for markdown content with direct prop passing. No external state management needed.

### CSS Integration

- Import order: `@import "tailwindcss"` then `@import "highlight.js/styles/github.css"`
- Custom CSS variables for theme colors in `:root` and dark mode media queries

## File Organization

```
app/
├── layout.tsx          # Root layout with fonts and metadata
├── page.tsx            # Main app with split-pane layout
└── globals.css         # Global styles, scrollbar, prose customization
components/
├── MarkdownEditor.tsx  # Textarea with markdown-specific styling
└── MarkdownPreview.tsx # React-markdown with plugins and custom renderers
```

When making changes, maintain the responsive flex layout pattern and ensure both editor and preview panels scroll independently.
