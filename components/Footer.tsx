'use client';

import Link from 'next/link';
import { Github, BookOpen, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/md-view-icon.svg"
                alt="MD-View"
                className="h-8 w-8 rounded-lg bg-slate-100 p-1.5 ring-1 ring-slate-200"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">MD-View</h3>
                <p className="text-xs text-slate-600">Markdown Editor</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Free online markdown editor with live preview. Write, edit, and preview markdown in real-time.
            </p>
          </div>

          {/* Features Section */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Real-time Preview</li>
              <li>GitHub Flavored Markdown</li>
              <li>Syntax Highlighting</li>
              <li>Multiple Themes</li>
              <li>Import/Export Files</li>
              <li>Responsive Design</li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/guide" 
                  className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <BookOpen className="h-3 w-3" />
                  Markdown Guide
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/celery94/md-view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Github className="h-3 w-3" />
                  GitHub Repository
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.github.com/gfm/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  GitHub Flavored Markdown
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.markdownguide.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Markdown Guide
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">About</h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                MD-View is a free, open-source markdown editor built with modern web technologies.
              </p>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500" fill="currentColor" />
                <span>using Next.js & React</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-slate-600">
              © {currentYear} MD-View. Free and open source.
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>No registration required</span>
              <span className="text-slate-300">•</span>
              <span>Privacy first</span>
              <span className="text-slate-300">•</span>
              <span>Always free</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}