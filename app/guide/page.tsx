import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Zap, Code, Download, Upload, Shield, Smartphone } from 'lucide-react';
import Footer from '../../components/Footer';

const guideStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'MD-View User Guide',
  description:
    'Master MD-View features including live preview, GitHub Flavored Markdown support, syntax highlighting, import/export flows, and keyboard shortcuts.',
  image: 'https://www.md-view.com/og-image.png',
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
  title: 'Guide: Features & Markdown Basics | MD-View',
  description:
    'Learn MD-View features (live preview, GFM, syntax highlighting, import/export, local persistence) and a quick Markdown introduction with examples.',
  keywords: [
    'markdown guide',
    'markdown basics',
    'gfm',
    'syntax highlighting',
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
    title: 'Guide: Features & Markdown Basics | MD-View',
    description:
      'Master MD-View features, Markdown syntax, GitHub Flavored Markdown, and export workflows in this comprehensive guide.',
    type: 'article',
    url: 'https://www.md-view.com/guide',
    publishedTime: '2024-05-01T00:00:00.000Z',
    modifiedTime: '2025-09-26T00:00:00.000Z',
    siteName: 'MD-View',
    images: [
      {
        url: 'https://www.md-view.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MD-View markdown editor guide preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide: Features & Markdown Basics | MD-View',
    description:
      'Learn how to get the most out of MD-View with live preview tips, markdown basics, and export workflows.',
    images: ['https://www.md-view.com/og-image.png'],
    creator: '@mdview',
  },
};

export default function Guide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData) }}
      />
      <div className="h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
        {/* Header - consistent with main page */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgb(15_23_42/0.04)]">
          <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Left section - Logo and title */}
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 md:gap-3 group rounded-xl p-1.5 md:p-2 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  aria-label="MD-View Home"
                  title="MD-View Home"
                >
                  <img
                    src="/md-view-icon.svg"
                    alt="MD-View logo"
                    className="h-7 w-7 md:h-8 md:w-8 rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="hidden sm:block">
                    <h1 className="text-lg md:text-xl font-bold text-slate-800">MD-View</h1>
                    <p className="text-xs text-slate-400 leading-tight">User Guide</p>
                  </div>
                </Link>

                {/* Breadcrumb for guide */}
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-200">/</span>
                  <BookOpen className="h-4 w-4" />
                  <span>Guide & Features</span>
                </div>
              </div>

              {/* Right section - Back to editor */}
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 md:px-5 py-2 bg-gradient-to-b from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-md shadow-slate-900/10 hover:from-slate-700 hover:to-slate-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
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
            <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8 mb-8 border border-slate-200/60">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                  MD-View User Guide
                </h1>
                <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
                  Master MD-View powerful features and learn Markdown fundamentals. From real-time
                  preview to advanced GitHub Flavored Markdown syntax.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <section id="key-features" className="mb-12" aria-labelledby="key-features-heading">
              <h2
                id="key-features-heading"
                className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5"
              >
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <Zap className="h-5 w-5 text-sky-600" />
                </div>
                Key Features
              </h2>
              <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-sky-100 to-sky-50 rounded-lg shadow-sm">
                      <Zap className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Real-time Preview</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    See your markdown rendered instantly as you type with synchronized scrolling.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg shadow-sm">
                      <Code className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">GitHub Flavored Markdown</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Full GFM support including tables, task lists, strikethrough, and code fencing.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-violet-100 to-violet-50 rounded-lg shadow-sm">
                      <Code className="h-5 w-5 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Syntax Highlighting</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Beautiful code syntax highlighting for 100+ programming languages.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-sm">
                      <Download className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Import & Export</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Import .md files and export to .md or .html formats for sharing.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-sky-100 to-sky-50 rounded-lg shadow-sm">
                      <Smartphone className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Responsive Design</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Optimized for desktop, tablet, and mobile devices with flexible view modes.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-sm">
                      <Shield className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Safe Rendering</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Raw HTML is sanitized to prevent XSS attacks while preserving functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Start Workflow */}
            <section className="mb-12">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <Upload className="h-5 w-5 text-emerald-600" />
                  </div>
                  Quick Start Workflow
                </h2>
                <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <span className="text-sky-700 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Start Typing</h3>
                    <p className="text-sm text-slate-500">Type markdown in the left editor panel</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <span className="text-emerald-700 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Live Preview</h3>
                    <p className="text-sm text-slate-500">Watch live preview update in real-time</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <span className="text-violet-700 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Import Files</h3>
                    <p className="text-sm text-slate-500">Load existing .md files with one click</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <span className="text-amber-700 font-bold text-lg">4</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Export & Share</h3>
                    <p className="text-sm text-slate-500">Export as .md or .html for sharing</p>
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
              <div className="bg-gradient-to-r from-sky-50/80 to-indigo-50/80 rounded-2xl p-6 md:p-8 border border-sky-200/60 shadow-sm">
                <h2
                  id="export-html-pdf-heading"
                  className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2.5"
                >
                  <div className="p-1.5 bg-sky-100 rounded-lg">
                    <Download className="h-5 w-5 text-sky-600" />
                  </div>
                  Export to HTML & PDF
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Use the toolbar to export your document as <strong>HTML</strong> for sharing or
                    hosting. To create a <strong>PDF</strong>, open the exported HTML in your
                    browser and use
                    <em>Print</em> → <em>Save as PDF</em>.
                  </p>
                  <div className="bg-white rounded-xl p-4 border border-sky-200/80 shadow-sm">
                    <p className="text-sm text-slate-600 mb-0">
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
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                <h2
                  id="markdown-basics-heading"
                  className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5"
                >
                  <div className="p-1.5 bg-violet-100 rounded-lg">
                    <Code className="h-5 w-5 text-violet-600" />
                  </div>
                  Markdown Basics
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Get started with these essential Markdown syntax patterns:
                  </p>
                  <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl p-5 font-mono text-sm overflow-x-auto border border-slate-100">
                    <pre className="text-slate-700 whitespace-pre-wrap leading-relaxed">{`# Heading 1
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
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                <h2
                  id="gfm-heading"
                  className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5"
                >
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <Code className="h-5 w-5 text-emerald-600" />
                  </div>
                  GitHub Flavored Markdown (GFM)
                </h2>

                <div className="space-y-8">
                  {/* Task Lists */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">✅ Task Lists</h3>
                    <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl p-4 font-mono text-sm border border-slate-100">
                      <pre className="text-slate-700">{`- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
  - [x] Nested completed task
  - [ ] Nested pending task`}</pre>
                    </div>
                  </div>

                  {/* Tables */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">📊 Tables</h3>
                    <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl p-4 font-mono text-sm border border-slate-100">
                      <pre className="text-slate-700">{`| Feature | MD-View | Others |
|---------|---------|--------|
| Real-time preview | ✅ | ❌ |
| GFM support | ✅ | ⚠️ |
| Free to use | ✅ | ❌ |
| Syntax highlighting | ✅ | ⚠️ |`}</pre>
                    </div>
                  </div>

                  {/* Strikethrough */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">❌ Strikethrough</h3>
                    <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl p-4 font-mono text-sm border border-slate-100">
                      <pre className="text-slate-700">{`This feature is ~~deprecated~~ now updated.
~~Old information~~ replaced with new content.`}</pre>
                    </div>
                  </div>

                  {/* Code Blocks */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      💻 Code Blocks with Syntax Highlighting
                    </h3>
                    <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl p-4 font-mono text-sm border border-slate-100">
                      <pre className="text-slate-700">{`\`\`\`typescript
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
                </div>
              </div>
            </section>

            {/* Tips and Limitations */}
            <section
              id="tips-limitations"
              className="mb-12"
              aria-labelledby="tips-limitations-heading"
            >
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2
                  id="tips-limitations-heading"
                  className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2.5"
                >
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  Tips & Limitations
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-2">🔒 Security</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Raw HTML in markdown is sanitized to prevent XSS attacks while preserving safe
                      formatting.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-2">💾 Local Storage</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your content is saved locally in your browser. Clear browser data to reset
                      everything.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-2">📱 Responsive</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Switch between split, editor-only, and preview-only modes for optimal mobile
                      experience.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-2">⌨️ Keyboard Shortcuts</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Use Cmd/Ctrl + 1, 2, 3 to quickly switch between editor, split, and preview
                      modes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to action */}
            <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Ready to Start Writing?</h2>
              <p className="text-slate-500 mb-6 max-w-2xl mx-auto leading-relaxed">
                Now that you know the features and syntax, return to the editor and start creating
                amazing markdown content!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-b from-slate-800 to-slate-900 text-white text-lg font-semibold rounded-xl shadow-lg shadow-slate-900/15 hover:from-slate-700 hover:to-slate-800 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
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
