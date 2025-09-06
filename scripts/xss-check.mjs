// Simple XSS regression check without a test framework.
// Renders markdown with the same options used by the app and asserts that
// dangerous HTML is not present in the output.

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const md = `Hello\n\n<img src=x onerror=alert(1)>\n\n\`\`\`js\nconsole.log('safe');\n\`\`\``;

const html = renderToStaticMarkup(
  React.createElement(ReactMarkdown, {
    children: md,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
    skipHtml: true,
  })
);

const hasImgTag = /<img\b/i.test(html);
const hasOnError = /onerror=/i.test(html);

if (hasImgTag || hasOnError) {
  console.error('XSS check FAILED: dangerous HTML made it into output');
  console.error(html);
  process.exit(1);
}

console.log('XSS check passed. Output length:', html.length);
