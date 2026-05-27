import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Zap, Code, Download, Upload, Shield, Smartphone } from 'lucide-react';
import Footer from '../../components/Footer';

const guideStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'MD-View User Guide',
  description:
    'Master MD-View features including live preview, GitHub Flavored Markdown support, Mermaid diagrams, syntax highlighting, import/export flows, and keyboard shortcuts.',
  image: 'https://www.md-view.com/guide/og-image',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.md-view.com/guide',
  },
  author: {
    '@type': 'Organization',
    name: 'MD-View',
    url: 'https://www.md-view.com/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'MD-View',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.md-view.com/md-view-icon.svg',
      width: 128,
      height: 128,
    },
  },
  datePublished: '2024-05-01T00:00:00.000Z',
  dateModified: '2025-09-26T00:00:00.000Z',
} as const;

export const metadata: Metadata = {
  title: 'Guide: Features & Markdown Basics',
  description:
    'Learn MD-View features (live preview, GFM, Mermaid diagrams, syntax highlighting, import/export, local persistence) and a quick Markdown introduction with examples.',
  keywords: [
    'markdown guide',
    'markdown basics',
    'gfm',
    'syntax highlighting',
    'mermaid diagrams',
    'markdown tables',
    'task lists',
    'import export markdown',
    'export html',
    'pdf',
  ],
  alternates: {
    canonical: '/guide',
  },
  openGraph: {
    title: 'Guide: Features & Markdown Basics',
    description:
      'Master MD-View features, Markdown syntax, GitHub Flavored Markdown, and export workflows in this comprehensive guide.',
    type: 'article',
    url: 'https://www.md-view.com/guide',
    publishedTime: '2024-05-01T00:00:00.000Z',
    modifiedTime: '2025-09-26T00:00:00.000Z',
    siteName: 'MD-View',
    images: [
      {
        url: 'https://www.md-view.com/guide/og-image',
        width: 1200,
        height: 630,
        alt: 'MD-View markdown editor guide preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide: Features & Markdown Basics',
    description:
      'Learn how to get the most out of MD-View with live preview tips, markdown basics, and export workflows.',
    images: ['https://www.md-view.com/guide/og-image'],
    creator: '@mdview',
  },
};

const guidePanelClass =
  'rounded-[14px] border border-[#dddddd] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]';

const guideCardClass =
  'rounded-[14px] border border-[#dddddd] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08),0_8px_16px_rgba(0,0,0,0.12)]';

export default function Guide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData) }}
      />
      <div className="flex h-screen flex-col bg-white">
        {/* Header - consistent with main page */}
        <header className="sticky top-0 z-30 border-b border-[#dddddd] bg-white">
          <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Left section - Logo and title */}
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/"
                  className="group flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 transition-colors duration-150 hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:ring-offset-2 md:gap-3 md:px-3 md:py-2"
                  aria-label="MD-View Home"
                  title="MD-View Home"
                >
                  <img
                    src="/md-view-icon.svg"
                    alt="MD-View logo"
                    className="h-7 w-7 md:h-8 md:w-8 rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="hidden sm:block">
                    <p className="text-lg md:text-xl font-bold text-[#222222]">MD-View</p>
                    <p className="text-xs text-[#929292] leading-tight">User Guide</p>
                  </div>
                </Link>

                {/* Breadcrumb for guide */}
                <div className="hidden md:flex items-center gap-2 text-sm text-[#929292]">
                  <span className="text-[#ebebeb]">/</span>
                  <BookOpen className="h-4 w-4" />
                  <span>Guide & Features</span>
                </div>
              </div>

              {/* Right section - Back to editor */}
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#ff385c] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#e00b41] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/35 focus:ring-offset-2 md:px-5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to</span>
                  <span>Editor</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main content with consistent styling */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Hero section */}
            <div className={`${guidePanelClass} mb-8 p-6 md:p-8`}>
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-[#222222] md:text-4xl">
                  MD-View User Guide
                </h1>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#6a6a6a]">
                  Master MD-View powerful features and learn Markdown fundamentals. From real-time
                  preview to advanced GitHub Flavored Markdown syntax.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <section id="key-features" className="mb-12" aria-labelledby="key-features-heading">
              <h2
                id="key-features-heading"
                className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2.5"
              >
                <div className="rounded-lg bg-[#ffd1da] p-1.5">
                  <Zap className="h-5 w-5 text-[#ff385c]" />
                </div>
                Key Features
              </h2>
              <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Zap className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">Real-time Preview</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    See your markdown rendered instantly as you type with synchronized scrolling.
                  </p>
                </div>

                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Code className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">GitHub Flavored Markdown</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    Full GFM support including tables, task lists, strikethrough, and code fencing.
                  </p>
                </div>

                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Code className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">Syntax Highlighting</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    Beautiful code syntax highlighting for 100+ programming languages plus Mermaid
                    diagram preview.
                  </p>
                </div>

                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Download className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">Import & Export</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    Import .md files and export to .md, .docx, or .html formats for sharing.
                  </p>
                </div>

                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Smartphone className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">Responsive Design</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    Optimized for desktop, tablet, and mobile devices with flexible view modes.
                  </p>
                </div>

                <div className={`${guideCardClass} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#ffd1da] p-2">
                      <Shield className="h-5 w-5 text-[#ff385c]" />
                    </div>
                    <h3 className="font-semibold text-[#222222]">Safe Rendering</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#6a6a6a]">
                    Raw HTML is sanitized to prevent XSS attacks while preserving functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Start Workflow */}
            <section className="mb-12">
              <div className={`${guidePanelClass} p-6 md:p-8`}>
                <h2 className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2.5">
                  <div className="rounded-lg bg-[#ffd1da] p-1.5">
                    <Upload className="h-5 w-5 text-[#ff385c]" />
                  </div>
                  Quick Start Workflow
                </h2>
                <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd1da]">
                      <span className="text-lg font-bold text-[#ff385c]">1</span>
                    </div>
                    <h3 className="mb-2 font-semibold text-[#222222]">Start Typing</h3>
                    <p className="text-sm text-[#6a6a6a]">Type markdown in the left editor panel</p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd1da]">
                      <span className="text-lg font-bold text-[#ff385c]">2</span>
                    </div>
                    <h3 className="mb-2 font-semibold text-[#222222]">Live Preview</h3>
                    <p className="text-sm text-[#6a6a6a]">Watch live preview update in real-time</p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd1da]">
                      <span className="text-lg font-bold text-[#ff385c]">3</span>
                    </div>
                    <h3 className="mb-2 font-semibold text-[#222222]">Import Files</h3>
                    <p className="text-sm text-[#6a6a6a]">Load existing .md files with one click</p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd1da]">
                      <span className="text-lg font-bold text-[#ff385c]">4</span>
                    </div>
                    <h3 className="mb-2 font-semibold text-[#222222]">Export & Share</h3>
                    <p className="text-sm text-[#6a6a6a]">
                      Export as .md, .docx, or .html for sharing
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Export Guide */}
            <section
              id="export-html-pdf"
              className="mb-12"
              aria-labelledby="export-html-pdf-heading"
            >
              <div className={`${guidePanelClass} p-6 md:p-8`}>
                <h2
                  id="export-html-pdf-heading"
                  className="text-2xl font-bold text-[#222222] mb-4 flex items-center gap-2.5"
                >
                  <div className="rounded-lg bg-[#ffd1da] p-1.5">
                    <Download className="h-5 w-5 text-[#ff385c]" />
                  </div>
                  Export to DOCX, HTML & PDF
                </h2>
                <div className="prose max-w-none prose-headings:text-[#222222] prose-p:text-[#3f3f3f] prose-strong:text-[#222222] prose-em:text-[#3f3f3f]">
                  <p className="mb-4 leading-relaxed text-[#3f3f3f]">
                    Use the toolbar to export your document as <strong>DOCX</strong> for Word-based
                    editing, or <strong>HTML</strong> for sharing and hosting. To create a{' '}
                    <strong>PDF</strong>, open the exported HTML in your
                    browser and use
                    <em>Print</em> → <em>Save as PDF</em>.
                  </p>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4">
                    <p className="mb-0 text-sm text-[#3f3f3f]">
                      💡 <strong>Pro Tip:</strong> The exported HTML preserves all formatting
                      including headings, code blocks, tables, and lists with beautiful styling.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Markdown Basics */}
            <section
              id="markdown-basics"
              className="mb-12"
              aria-labelledby="markdown-basics-heading"
            >
              <div className={`${guidePanelClass} p-6 md:p-8`}>
                <h2
                  id="markdown-basics-heading"
                  className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2.5"
                >
                  <div className="rounded-lg bg-[#ffd1da] p-1.5">
                    <Code className="h-5 w-5 text-[#ff385c]" />
                  </div>
                  Markdown Basics
                </h2>
                <div className="prose max-w-none prose-headings:text-[#222222] prose-p:text-[#3f3f3f] prose-strong:text-[#222222] prose-em:text-[#3f3f3f]">
                  <p className="mb-6 leading-relaxed text-[#3f3f3f]">
                    Get started with these essential Markdown syntax patterns:
                  </p>
                  <div className="overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-5 font-mono text-sm">
                    <pre className="whitespace-pre-wrap leading-relaxed text-[#3f3f3f]">{`# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text* and \`inline code\`

> Blockquote for tips, notes, or citations
> Can span multiple lines

- Bullet point item
- Another bullet item
  - Nested item (2 spaces)
  - Another nested item

1. Numbered list item
2. Second numbered item
3. Third item

[Link text](https://example.com)
![Image alt text](/path/to/image.png)

---

Horizontal rule above this line`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* GitHub Flavored Markdown */}
            <section id="github-flavored-markdown" className="mb-12" aria-labelledby="gfm-heading">
              <div className={`${guidePanelClass} p-6 md:p-8`}>
                <h2
                  id="gfm-heading"
                  className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2.5"
                >
                  <div className="rounded-lg bg-[#ffd1da] p-1.5">
                    <Code className="h-5 w-5 text-[#ff385c]" />
                  </div>
                  GitHub Flavored Markdown (GFM)
                </h2>

                <div className="space-y-8">
                  {/* Task Lists */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#222222]">✅ Task Lists</h3>
                    <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 font-mono text-sm">
                      <pre className="text-[#3f3f3f]">{`- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
  - [x] Nested completed task
  - [ ] Nested pending task`}</pre>
                    </div>
                  </div>

                  {/* Tables */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#222222]">📊 Tables</h3>
                    <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 font-mono text-sm">
                      <pre className="text-[#3f3f3f]">{`| Feature | MD-View | Others |
|---------|---------|--------|
| Real-time preview | ✅ | ❌ |
| GFM support | ✅ | ⚠️ |
| Free to use | ✅ | ❌ |
| Syntax highlighting | ✅ | ⚠️ |`}</pre>
                    </div>
                  </div>

                  {/* Strikethrough */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#222222]">❌ Strikethrough</h3>
                    <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 font-mono text-sm">
                      <pre className="text-[#3f3f3f]">{`This feature is ~~deprecated~~ now updated.
~~Old information~~ replaced with new content.`}</pre>
                    </div>
                  </div>

                  {/* Code Blocks */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#222222]">
                      💻 Code Blocks with Syntax Highlighting
                    </h3>
                    <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 font-mono text-sm">
                      <pre className="text-[#3f3f3f]">{`\`\`\`typescript
function greetUser(name: string): string {
  return \`Hello, \${name}! Welcome to MD-View.\`;
}

const user = "Developer";
console.log(greetUser(user));
\`\`\`

\`\`\`python
def calculate_words(text):
    return len(text.split())

markdown_content = "# Hello World"
word_count = calculate_words(markdown_content)
print(f"Word count: {word_count}")
\`\`\``}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#222222]">🧭 Mermaid Diagrams</h3>
                    <div className="rounded-[14px] border border-[#ebebeb] bg-[#f7f7f7] p-4 font-mono text-sm">
                      <pre className="text-[#3f3f3f]">{`\`\`\`mermaid
flowchart LR
  Start([Start]) --> Draft[Write Markdown]
  Draft --> Preview[Preview Diagram]
  Preview --> Export[Export HTML or DOCX]
\`\`\``}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips and Limitations */}
            <section
              id="tips-limitations"
              className="mb-12"
              aria-labelledby="tips-limitations-heading"
            >
              <div className={`${guidePanelClass} p-6 md:p-8`}>
                <h2
                  id="tips-limitations-heading"
                  className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2.5"
                >
                  <div className="rounded-lg bg-[#ffd1da] p-1.5">
                    <Shield className="h-5 w-5 text-[#ff385c]" />
                  </div>
                  Tips & Limitations
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[14px] border border-[#ebebeb] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    <h3 className="mb-2 font-semibold text-[#222222]">🔒 Security</h3>
                    <p className="text-sm leading-relaxed text-[#3f3f3f]">
                      Raw HTML in markdown is sanitized to prevent XSS attacks while preserving safe
                      formatting.
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    <h3 className="mb-2 font-semibold text-[#222222]">💾 Local Storage</h3>
                    <p className="text-sm leading-relaxed text-[#3f3f3f]">
                      Your content is saved locally in your browser. Clear browser data to reset
                      everything.
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    <h3 className="mb-2 font-semibold text-[#222222]">📱 Responsive</h3>
                    <p className="text-sm leading-relaxed text-[#3f3f3f]">
                      Switch between split, editor-only, and preview-only modes for optimal mobile
                      experience.
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[#ebebeb] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
                    <h3 className="mb-2 font-semibold text-[#222222]">⌨️ Keyboard Shortcuts</h3>
                    <p className="text-sm leading-relaxed text-[#3f3f3f]">
                      Use Cmd/Ctrl + 1, 2, 3 to quickly switch between editor, split, and preview
                      modes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to action */}
            <div className={`${guidePanelClass} p-8 text-center`}>
              <h2 className="mb-4 text-2xl font-bold text-[#222222]">Ready to Start Writing?</h2>
              <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-[#6a6a6a]">
                Now that you know the features and syntax, return to the editor and start creating
                amazing markdown content!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#ff385c] px-7 py-3 text-lg font-semibold text-white transition-colors duration-150 hover:bg-[#e00b41] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/35 focus:ring-offset-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Open MD-View Editor
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
