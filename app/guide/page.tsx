import { Metadata } from 'next'
import Link from 'next/link'

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
}

export default function Guide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to MD-View Editor
          </Link>
        </nav>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <header className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                MD-View Guide: Features & Markdown Intro
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A quick walkthrough of what MD-View can do today and a concise
                introduction to Markdown (including GitHub Flavored Markdown).
              </p>
            </header>

            <section aria-labelledby="features" className="mb-10">
              <h2 id="features" className="text-2xl font-semibold text-gray-900 mb-4">
                Current Features
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Real-time Preview</h3>
                  <p className="text-gray-600 text-sm">Live rendering as you type.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">GitHub Flavored Markdown</h3>
                  <p className="text-gray-600 text-sm">Tables, task lists, strikethrough, and more.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Syntax Highlighting</h3>
                  <p className="text-gray-600 text-sm">Code blocks highlighted via highlight.js.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Import & Export</h3>
                  <p className="text-gray-600 text-sm">Import .md; export to .md or .html.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Resizable Split View</h3>
                  <p className="text-gray-600 text-sm">Drag the divider to adjust editor/preview.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Local Persistence</h3>
                  <p className="text-gray-600 text-sm">Content and pane ratio saved in your browser.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Safe Rendering</h3>
                  <p className="text-gray-600 text-sm">Raw HTML is disabled to avoid XSS.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Responsive UI</h3>
                  <p className="text-gray-600 text-sm">Works well on desktop and mobile.</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="export" className="mb-10">
              <h2 id="export" className="text-2xl font-semibold text-gray-900 mb-4">
                Export to HTML & PDF
              </h2>
              <div className="prose prose-slate max-w-none">
                <p>
                  Use the toolbar to export your document as <strong>.html</strong> for sharing or hosting. To create a
                  <strong> PDF</strong>, open the preview and use your browser&apos;s <em>Print</em> → <em>Save as PDF</em>.
                  The exported HTML and the print layout preserve headings, code blocks, tables, and lists.
                </p>
              </div>
            </section>

            <section aria-labelledby="workflow" className="mb-10">
              <h2 id="workflow" className="text-2xl font-semibold text-gray-900 mb-4">
                Quick Workflow
              </h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Type in the left editor; see preview on the right.</li>
                <li>Drag the vertical bar to resize panels.</li>
                <li>Use “Import .md” to load a local file.</li>
                <li>Use “Export .md” or “Export .html” to save your work.</li>
              </ol>
            </section>

            <section aria-labelledby="markdown-basics" className="mb-10">
              <h2 id="markdown-basics" className="text-2xl font-semibold text-gray-900 mb-4">
                Markdown Basics
              </h2>
              <div className="prose prose-slate max-w-none">
                <p>Common syntax you can use right away:</p>
                <pre><code>{`# Heading 1\n## Heading 2\n\n**Bold** and *italic* and \`inline code\`\n\n> Blockquote with a tip or note\n\n- Bullet item\n- Another item\n  - Nested item\n\n1. Ordered item\n2. Second item\n\n[Link text](https://example.com) and images: ![Demo image](/image.png)`}</code></pre>
              </div>
            </section>

            <section aria-labelledby="gfm" className="mb-10">
              <h2 id="gfm" className="text-2xl font-semibold text-gray-900 mb-4">
                GitHub Flavored Markdown (GFM)
              </h2>
              <div className="prose prose-slate max-w-none">
                <p>MD-View supports popular GFM extensions:</p>
                <h3>Task lists</h3>
                <pre><code>{`- [x] Write docs\n- [ ] Add more examples`}</code></pre>

                <h3>Tables</h3>
                <pre><code>{`| Feature | Support |\n|--------|---------|\n| Tables | ✅ |\n| Tasks  | ✅ |\n| Strike | ✅ |`}</code></pre>

                <h3>Strikethrough</h3>
                <pre><code>{`This is ~~deprecated~~ now updated.`}</code></pre>

                <h3>Code blocks with highlighting</h3>
                <pre><code>{`\`\`\`ts\nfunction greet(name: string) {\n  return \'Hello \' + name\n}\n\`\`\``}</code></pre>
              </div>
            </section>

            <section aria-labelledby="security" className="mb-10">
              <h2 id="security" className="text-2xl font-semibold text-gray-900 mb-2">
                Notes & Limitations
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Raw HTML in markdown is not rendered for safety.</li>
                <li>Local persistence uses your browser storage; clear to reset.</li>
              </ul>
            </section>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Open MD-View Editor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
