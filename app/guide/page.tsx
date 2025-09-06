import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Markdown Editor Guide & Tips | MD-View',
  description: 'Learn how to use MD-View markdown editor effectively. Tips, tricks, and guides for writing better markdown documentation.',
  keywords: [
    'markdown guide',
    'markdown tutorial',
    'markdown tips',
    'markdown editor guide',
    'github flavored markdown',
    'markdown syntax',
    'documentation writing',
  ],
}

const blogPosts = [
  {
    title: 'Complete Markdown Syntax Guide',
    excerpt: 'Learn all the essential markdown syntax from headers to tables, code blocks to task lists.',
    date: '2024-01-15',
    slug: 'markdown-syntax-guide',
  },
  {
    title: 'GitHub Flavored Markdown Features',
    excerpt: 'Discover the extended features of GitHub Flavored Markdown including tables, task lists, and more.',
    date: '2024-01-10',
    slug: 'github-flavored-markdown',
  },
  {
    title: 'Best Practices for Documentation',
    excerpt: 'Tips and best practices for writing clear, maintainable documentation using markdown.',
    date: '2024-01-05',
    slug: 'documentation-best-practices',
  },
]

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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Markdown Editor Guide & Tips
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn how to use MD-View effectively and master markdown syntax for better documentation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article key={post.slug} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <Link
                      href={`/guide/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Start with MD-View
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">1. Start Typing</h3>
                  <p className="text-blue-700 text-sm">
                    Begin writing your markdown in the left editor panel.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">2. Live Preview</h3>
                  <p className="text-green-700 text-sm">
                    See your content rendered in real-time on the right panel.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">3. Import Files</h3>
                  <p className="text-purple-700 text-sm">
                    Drag and drop or import existing .md files to edit.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">4. Export</h3>
                  <p className="text-orange-700 text-sm">
                    Export your work as .md or .html files when finished.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try MD-View Editor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
