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

const lightProseClass = 'prose prose-slate max-w-none mdv-prose';
const darkProseClass = 'prose prose-invert max-w-none mdv-prose';

export const themes: Theme[] = [
  {
    name: 'default',
    displayName: 'Default',
    description: 'Clean and detailed design',
    classes: {
      container: 'h-full overflow-auto bg-gradient-to-b from-white to-slate-50 p-6 sm:p-10',
      prose: `${lightProseClass} default-theme`,
    },
    customStyles: `
      .default-theme {
        color: #1f2937;
        font-size: 1.04rem;
        line-height: 1.75;
      }
      .default-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #0f172a;
        font-weight: 760;
        letter-spacing: -0.01em;
        line-height: 1.22;
        margin-top: 2.25rem;
        margin-bottom: 1rem;
      }
      .default-theme h1 {
        margin-top: 0;
        font-size: 2.15rem;
      }
      .default-theme h2 {
        font-size: 1.7rem;
      }
      .default-theme h3 {
        font-size: 1.35rem;
      }
      .default-theme p {
        margin: 1rem 0;
      }
      .default-theme :where(ul, ol) {
        margin: 0.8rem 0 1rem;
        padding-left: 1.35rem;
      }
      .default-theme li::marker {
        color: #64748b;
      }
      .default-theme a {
        color: #0f766e;
        text-decoration: underline;
        text-decoration-thickness: 1.5px;
        text-underline-offset: 2px;
      }
      .default-theme a:hover {
        color: #155e75;
      }
      .default-theme :not(pre) > code {
        font-size: 0.84rem;
        color: #0f172a;
        background: #e2e8f0;
        border: 1px solid #cbd5e1;
        border-radius: 0.42rem;
        padding: 0.14rem 0.42rem;
      }
      .default-theme .mdv-code {
        border: 1px solid #1e293b;
        border-radius: 0.75rem;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        box-shadow: 0 10px 20px -16px rgba(2, 6, 23, 0.55);
      }
      .default-theme .mdv-code .mdv-code-header {
        border-bottom-color: rgba(148, 163, 184, 0.18);
      }
      .default-theme .mdv-code .language-badge {
        color: #94a3b8;
      }
      .default-theme .mdv-code .copy-button {
        color: #94a3b8;
      }
      .default-theme .mdv-code .copy-button:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
      }
      .default-theme pre {
        margin: 1.25rem 0;
        padding: 1rem 1.15rem;
        border: 1px solid #1e293b;
        border-radius: 0.75rem;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        color: #e2e8f0;
        box-shadow: 0 10px 20px -16px rgba(2, 6, 23, 0.55);
      }
      .default-theme pre code {
        color: inherit;
        font-size: 0.9rem;
      }
      .default-theme blockquote {
        margin: 1.2rem 0;
        border-left: 4px solid #0f766e;
        border-radius: 0 0.6rem 0.6rem 0;
        padding: 0.8rem 1rem;
        background: linear-gradient(90deg, rgba(15, 118, 110, 0.08), rgba(148, 163, 184, 0.06));
        color: #334155;
      }
      .default-theme hr {
        margin: 1.8rem 0;
        border-color: #cbd5e1;
      }
      .default-theme table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 1.25rem 0;
        border: 1px solid #dbe3ec;
        border-radius: 0.75rem;
        overflow: hidden;
      }
      .default-theme th {
        background: #f1f5f9;
        color: #1e293b;
        font-size: 0.78rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .default-theme :where(th, td) {
        border-bottom: 1px solid #dbe3ec;
        padding: 0.68rem 0.85rem;
        text-align: left;
      }
      .default-theme tr:last-child td {
        border-bottom: 0;
      }
      .default-theme tbody tr:nth-child(even) {
        background: #f8fafc;
      }
      .default-theme .hljs {
        color: #e2e8f0;
      }
      .default-theme .hljs-comment,
      .default-theme .hljs-quote {
        color: #94a3b8;
      }
      .default-theme .hljs-keyword,
      .default-theme .hljs-selector-tag,
      .default-theme .hljs-subst,
      .default-theme .hljs-meta {
        color: #38bdf8;
      }
      .default-theme .hljs-string,
      .default-theme .hljs-doctag,
      .default-theme .hljs-addition,
      .default-theme .hljs-attribute,
      .default-theme .hljs-built_in {
        color: #5eead4;
      }
      .default-theme .hljs-number,
      .default-theme .hljs-literal,
      .default-theme .hljs-symbol,
      .default-theme .hljs-bullet {
        color: #fbbf24;
      }
      .default-theme .hljs-title,
      .default-theme .hljs-section,
      .default-theme .hljs-selector-id,
      .default-theme .hljs-selector-class {
        color: #93c5fd;
      }
      .default-theme .hljs-variable,
      .default-theme .hljs-template-variable,
      .default-theme .hljs-name {
        color: #c4b5fd;
      }
      .default-theme .hljs-function .hljs-title,
      .default-theme .hljs-title.function_,
      .default-theme .hljs-title.class_ {
        color: #bfdbfe;
      }
      .default-theme .hljs-params,
      .default-theme .hljs-attr,
      .default-theme .hljs-property {
        color: #cbd5e1;
      }
      .default-theme .hljs-regexp,
      .default-theme .hljs-deletion {
        color: #fda4af;
      }
    `,
  },
  {
    name: 'wechat-publish',
    displayName: 'WeChat',
    description: 'Optimized for WeChat Official Account publishing',
    classes: {
      container:
        'h-full overflow-auto border border-emerald-100/80 bg-gradient-to-b from-white to-emerald-50/30 p-5 sm:p-8 shadow-[0_18px_40px_-30px_rgba(6,95,70,0.35)]',
      prose: `${lightProseClass} wechat-theme`,
    },
    customStyles: `
      .wechat-theme {
        color: #374151;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
        font-size: 16.5px;
        line-height: 1.88;
        letter-spacing: 0.01em;
        max-width: 760px;
        margin: 0 auto;
      }
      .wechat-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #1f2937;
        line-height: 1.34;
        margin-top: 1.95em;
        margin-bottom: 0.72em;
        font-weight: 700;
      }
      .wechat-theme h1 {
        margin-top: 0;
        margin-bottom: 1.25em;
        font-size: 1.95rem;
        text-align: center;
        letter-spacing: 0.02em;
        padding-bottom: 0.6rem;
        border-bottom: 2px solid #10b981;
        background: linear-gradient(180deg, rgba(16, 185, 129, 0.06), transparent);
        padding-top: 0.4rem;
        border-radius: 0.35rem 0.35rem 0 0;
      }
      .wechat-theme h2 {
        font-size: 1.42rem;
        padding: 0.22rem 0 0.22rem 0.75rem;
        border-left: 4px solid #10b981;
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.08), transparent);
        border-radius: 0 0.35rem 0.35rem 0;
      }
      .wechat-theme h3 {
        font-size: 1.18rem;
        color: #065f46;
        padding-bottom: 0.18rem;
        border-bottom: 1px dashed rgba(16, 185, 129, 0.35);
      }
      .wechat-theme h4 {
        font-size: 1.06rem;
        color: #0f766e;
      }
      .wechat-theme p {
        margin: 1.05em 0;
        text-align: justify;
      }
      .wechat-theme strong {
        color: #0f172a;
        font-weight: 700;
      }
      .wechat-theme em {
        color: #0f766e;
        font-style: italic;
      }
      .wechat-theme :where(ul, ol) {
        margin: 0.82em 0 1.08em;
        padding-left: 1.35rem;
      }
      .wechat-theme li {
        margin: 0.32em 0;
      }
      .wechat-theme li::marker {
        color: #059669;
      }
      .wechat-theme a {
        color: #0f766e;
        text-decoration: none;
        border-bottom: 1px solid rgba(15, 118, 110, 0.4);
        padding-bottom: 1px;
        transition: color 0.15s, border-color 0.15s;
      }
      .wechat-theme a:hover {
        color: #047857;
        border-bottom-color: rgba(4, 120, 87, 0.65);
      }
      .wechat-theme :not(pre) > code {
        color: #b45309;
        background: rgba(251, 191, 36, 0.1);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 0.35rem;
        padding: 0.12rem 0.4rem;
        font-size: 0.83rem;
        font-weight: 500;
      }
      .wechat-theme .mdv-code {
        border: 1px solid #d8e1ea;
        border-radius: 0.72rem;
        background: #fafbfd;
        box-shadow: 0 2px 8px -4px rgba(15, 23, 42, 0.08);
      }
      .wechat-theme .mdv-code .mdv-code-header {
        border-bottom-color: #e8edf3;
      }
      .wechat-theme .mdv-code .language-badge {
        color: #475569;
      }
      .wechat-theme .mdv-code .copy-button {
        color: #475569;
      }
      .wechat-theme .mdv-code .copy-button:hover {
        background: rgba(16, 185, 129, 0.08);
        color: #1f2937;
      }
      .wechat-theme pre {
        margin: 1.2em 0 1.35em;
        border: 1px solid #d8e1ea;
        border-radius: 0.72rem;
        background: #fafbfd;
        padding: 1rem 1.08rem;
        box-shadow: 0 2px 8px -4px rgba(15, 23, 42, 0.08);
      }
      .wechat-theme pre code {
        font-size: 0.86rem;
        line-height: 1.72;
        color: #24292f;
      }
      .wechat-theme blockquote {
        margin: 1.25em 0;
        border-left: 4px solid #10b981;
        border-radius: 0 0.55rem 0.55rem 0;
        background: linear-gradient(135deg, #ecfdf5, #f0fdfa);
        color: #334155;
        padding: 0.82rem 1.05rem;
        box-shadow: 0 1px 4px -2px rgba(16, 185, 129, 0.12);
      }
      .wechat-theme blockquote p:first-child {
        margin-top: 0;
      }
      .wechat-theme blockquote p:last-child {
        margin-bottom: 0;
      }
      .wechat-theme hr {
        margin: 1.8em 0;
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #d1d5db 20%, #d1d5db 80%, transparent);
      }
      .wechat-theme table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 1.15em 0 1.35em;
        font-size: 0.93rem;
        overflow: hidden;
        border: 1px solid #dce4ec;
        border-radius: 0.6rem;
      }
      .wechat-theme :where(th, td) {
        border-bottom: 1px solid #dce4ec;
        padding: 0.55rem 0.72rem;
        text-align: left;
      }
      .wechat-theme th {
        background: linear-gradient(180deg, #f0fdf4, #ecfdf5);
        color: #1e293b;
        font-weight: 600;
        font-size: 0.82rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      .wechat-theme tr:last-child td {
        border-bottom: 0;
      }
      .wechat-theme tbody tr:nth-child(even) {
        background: #f9fefb;
      }
      .wechat-theme img {
        border-radius: 0.6rem;
        border: 1px solid #e5edf3;
        box-shadow: 0 8px 20px -18px rgba(15, 23, 42, 0.45);
      }
      .wechat-theme .hljs {
        color: #24292f;
      }
      .wechat-theme .hljs-comment,
      .wechat-theme .hljs-quote {
        color: #6a737d;
        font-style: italic;
      }
      .wechat-theme .hljs-keyword,
      .wechat-theme .hljs-selector-tag,
      .wechat-theme .hljs-subst,
      .wechat-theme .hljs-meta {
        color: #d73a49;
      }
      .wechat-theme .hljs-string,
      .wechat-theme .hljs-doctag,
      .wechat-theme .hljs-addition,
      .wechat-theme .hljs-attribute,
      .wechat-theme .hljs-built_in {
        color: #22863a;
      }
      .wechat-theme .hljs-number,
      .wechat-theme .hljs-literal,
      .wechat-theme .hljs-symbol,
      .wechat-theme .hljs-bullet {
        color: #005cc5;
      }
      .wechat-theme .hljs-title,
      .wechat-theme .hljs-section,
      .wechat-theme .hljs-selector-id,
      .wechat-theme .hljs-selector-class {
        color: #6f42c1;
      }
      .wechat-theme .hljs-variable,
      .wechat-theme .hljs-template-variable,
      .wechat-theme .hljs-name {
        color: #e36209;
      }
      .wechat-theme .hljs-function .hljs-title,
      .wechat-theme .hljs-title.function_,
      .wechat-theme .hljs-title.class_ {
        color: #6f42c1;
      }
      .wechat-theme .hljs-params,
      .wechat-theme .hljs-attr,
      .wechat-theme .hljs-property {
        color: #005cc5;
      }
      .wechat-theme .hljs-regexp,
      .wechat-theme .hljs-deletion {
        color: #b31d28;
        background: rgba(255, 220, 220, 0.5);
      }
    `,
  },
  {
    name: 'dark',
    displayName: 'Dark',
    description: 'Dark theme for low-light environments',
    classes: {
      container:
        'h-full overflow-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 p-6 sm:p-10',
      prose: `${darkProseClass} dark-theme`,
    },
    customStyles: `
      .dark-theme {
        color: #dbe7f4;
        font-size: 1.03rem;
        line-height: 1.72;
      }
      .dark-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #f8fafc;
        font-weight: 740;
        line-height: 1.22;
        margin-top: 2.15rem;
        margin-bottom: 0.95rem;
      }
      .dark-theme h1 {
        margin-top: 0;
        font-size: 2.05rem;
      }
      .dark-theme h2 {
        font-size: 1.65rem;
      }
      .dark-theme h3 {
        font-size: 1.3rem;
      }
      .dark-theme p {
        margin: 1rem 0;
        color: #d0deee;
      }
      .dark-theme :where(ul, ol) {
        margin: 0.8rem 0 1rem;
        padding-left: 1.3rem;
      }
      .dark-theme li::marker {
        color: #93a8bf;
      }
      .dark-theme a {
        color: #67e8f9;
        text-decoration-thickness: 1.6px;
      }
      .dark-theme a:hover {
        color: #a5f3fc;
      }
      .dark-theme :not(pre) > code {
        color: #cffafe;
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(71, 85, 105, 0.9);
        border-radius: 0.42rem;
        padding: 0.14rem 0.42rem;
      }
      .dark-theme .mdv-code {
        border: 1px solid rgba(71, 85, 105, 0.85);
        border-radius: 0.78rem;
        background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
      }
      .dark-theme .mdv-code .mdv-code-header {
        border-bottom-color: rgba(71, 85, 105, 0.5);
      }
      .dark-theme .mdv-code .language-badge {
        color: #94a3b8;
      }
      .dark-theme .mdv-code .copy-button {
        color: #94a3b8;
      }
      .dark-theme .mdv-code .copy-button:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #dbeafe;
      }
      .dark-theme pre {
        margin: 1.2rem 0;
        border: 1px solid rgba(71, 85, 105, 0.85);
        border-radius: 0.78rem;
        padding: 1rem 1.15rem;
        background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
        color: #e5eef8;
      }
      .dark-theme pre code {
        color: inherit;
      }
      .dark-theme blockquote {
        margin: 1.2rem 0;
        border-left: 4px solid #22d3ee;
        border-radius: 0 0.6rem 0.6rem 0;
        padding: 0.8rem 1rem;
        background: rgba(15, 23, 42, 0.7);
        color: #c9daed;
      }
      .dark-theme hr {
        margin: 1.8rem 0;
        border-color: rgba(71, 85, 105, 0.85);
      }
      .dark-theme table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 1.25rem 0;
        border: 1px solid rgba(71, 85, 105, 0.9);
        border-radius: 0.78rem;
        overflow: hidden;
        background: rgba(15, 23, 42, 0.6);
      }
      .dark-theme th {
        background: rgba(30, 41, 59, 0.92);
        color: #f8fafc;
        font-size: 0.78rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .dark-theme :where(th, td) {
        border-bottom: 1px solid rgba(71, 85, 105, 0.78);
        padding: 0.68rem 0.85rem;
      }
      .dark-theme tr:last-child td {
        border-bottom: 0;
      }
      .dark-theme tbody tr:nth-child(even) {
        background: rgba(30, 41, 59, 0.44);
      }
      .dark-theme .mdv-code .copy-button .text-green-600 {
        color: #34d399 !important;
      }
      .dark-theme .hljs {
        color: #d7e2ef;
      }
      .dark-theme .hljs-keyword,
      .dark-theme .hljs-selector-tag {
        color: #7dd3fc;
      }
      .dark-theme .hljs-string,
      .dark-theme .hljs-addition {
        color: #86efac;
      }
      .dark-theme .hljs-number,
      .dark-theme .hljs-literal {
        color: #fbbf24;
      }
      .dark-theme .hljs-comment,
      .dark-theme .hljs-quote {
        color: #94a3b8;
      }
      .dark-theme .hljs-variable,
      .dark-theme .hljs-template-variable,
      .dark-theme .hljs-name {
        color: #93c5fd;
      }
      .dark-theme .hljs-function .hljs-title,
      .dark-theme .hljs-title.function_,
      .dark-theme .hljs-title.class_ {
        color: #bfdbfe;
      }
      .dark-theme .hljs-params,
      .dark-theme .hljs-attr,
      .dark-theme .hljs-property {
        color: #cbd5e1;
      }
      .dark-theme .hljs-regexp,
      .dark-theme .hljs-deletion {
        color: #fda4af;
      }
    `,
  },
  {
    name: 'github',
    displayName: 'GitHub',
    description: 'GitHub-like styling',
    classes: {
      container:
        'h-full overflow-auto border border-slate-200/70 bg-white p-5 sm:p-8 shadow-sm',
      prose: `${lightProseClass} github-theme`,
    },
    customStyles: `
      .github-theme {
        color: #24292f;
        font-size: 1rem;
        line-height: 1.64;
      }
      .github-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #1f2328;
        margin-top: 1.8rem;
        margin-bottom: 0.95rem;
        font-weight: 600;
        line-height: 1.25;
      }
      .github-theme h1,
      .github-theme h2 {
        border-bottom: 1px solid #d0d7de;
        padding-bottom: 0.3em;
      }
      .github-theme h1 {
        margin-top: 0;
        font-size: 2rem;
      }
      .github-theme h2 {
        font-size: 1.5rem;
      }
      .github-theme h3 {
        font-size: 1.25rem;
      }
      .github-theme p {
        margin: 0.9rem 0;
      }
      .github-theme :where(ul, ol) {
        margin: 0.75rem 0 1rem;
        padding-left: 1.4rem;
      }
      .github-theme a {
        color: #0969da;
      }
      .github-theme a:hover {
        color: #0550ae;
      }
      .github-theme :not(pre) > code {
        color: #cf222e;
        background: rgba(175, 184, 193, 0.2);
        border: 1px solid rgba(175, 184, 193, 0.45);
        border-radius: 0.35rem;
        padding: 0.12rem 0.38rem;
        font-size: 0.84rem;
      }
      .github-theme .mdv-code {
        border: 1px solid #d0d7de;
        border-radius: 0.55rem;
        background: #f6f8fa;
      }
      .github-theme .mdv-code .mdv-code-header {
        border-bottom-color: #d0d7de;
      }
      .github-theme .mdv-code .language-badge {
        color: #57606a;
      }
      .github-theme .mdv-code .copy-button {
        color: #57606a;
      }
      .github-theme .mdv-code .copy-button:hover {
        background: rgba(208, 215, 222, 0.4);
        color: #24292f;
      }
      .github-theme pre {
        margin: 1rem 0 1.15rem;
        padding: 1rem;
        border-radius: 0.55rem;
        border: 1px solid #d0d7de;
        background: #f6f8fa;
      }
      .github-theme blockquote {
        margin: 1rem 0;
        color: #59636e;
        border-left: 0.25em solid #d0d7de;
        padding: 0 1em;
        background: transparent;
      }
      .github-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }
      .github-theme :where(th, td) {
        border: 1px solid #d0d7de;
        padding: 0.38rem 0.75rem;
      }
      .github-theme th {
        background: #f6f8fa;
        font-weight: 600;
      }
      .github-theme tr:nth-child(even) {
        background: #f6f8fa;
      }
      .github-theme hr {
        margin: 1.5rem 0;
        border-color: #d0d7de;
      }
    `,
  },
  {
    name: 'notion',
    displayName: 'Notion',
    description: 'Notion-inspired design',
    classes: {
      container: 'h-full overflow-auto border border-stone-200/80 bg-stone-50/85 p-5 sm:p-8',
      prose: `${lightProseClass} notion-theme`,
    },
    customStyles: `
      .notion-theme {
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        color: #37352f;
        font-size: 1.02rem;
        line-height: 1.67;
      }
      .notion-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #2f2d29;
        font-weight: 650;
        line-height: 1.25;
        margin-top: 2rem;
        margin-bottom: 0.58rem;
      }
      .notion-theme h1 {
        margin-top: 0;
        font-size: 2.1rem;
      }
      .notion-theme h2 {
        font-size: 1.7rem;
      }
      .notion-theme h3 {
        font-size: 1.38rem;
      }
      .notion-theme p {
        margin: 0.9rem 0;
      }
      .notion-theme :where(ul, ol) {
        margin: 0.72rem 0 1rem;
        padding-left: 1.3rem;
      }
      .notion-theme a {
        color: #0b6e99;
      }
      .notion-theme a:hover {
        color: #0c4f75;
      }
      .notion-theme :not(pre) > code {
        background: rgba(135, 131, 120, 0.2);
        border: 1px solid rgba(135, 131, 120, 0.28);
        border-radius: 0.3rem;
        color: #3a3a3a;
        padding: 0.1rem 0.36rem;
        font-size: 0.83rem;
      }
      .notion-theme .mdv-code {
        border: 1px solid #e7e4de;
        border-radius: 0.45rem;
        background: #f7f6f3;
      }
      .notion-theme .mdv-code .mdv-code-header {
        border-bottom-color: #e7e4de;
      }
      .notion-theme .mdv-code .language-badge {
        color: #80796e;
      }
      .notion-theme .mdv-code .copy-button {
        color: #80796e;
      }
      .notion-theme .mdv-code .copy-button:hover {
        background: rgba(135, 131, 120, 0.12);
        color: #37352f;
      }
      .notion-theme pre {
        margin: 1rem 0 1.2rem;
        border: 1px solid #e7e4de;
        border-radius: 0.45rem;
        padding: 0.9rem 1rem;
        background: #f7f6f3;
      }
      .notion-theme blockquote {
        margin: 1rem 0;
        border-left: 3px solid #d5d2cc;
        padding-left: 0.9rem;
        color: #65615a;
      }
      .notion-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        background: #ffffff;
      }
      .notion-theme :where(th, td) {
        border: 1px solid #ebe8e3;
        padding: 0.55rem 0.72rem;
      }
      .notion-theme th {
        background: #f5f4f2;
        color: #4a4742;
        font-weight: 600;
      }
      .notion-theme hr {
        margin: 1.5rem 0;
        border-color: #ebe8e3;
      }
    `,
  },
  {
    name: 'medium',
    displayName: 'Medium',
    description: 'Medium.com-style typography',
    classes: {
      container: 'h-full overflow-auto border border-zinc-200/70 bg-white p-6 sm:p-10',
      prose: `${lightProseClass} medium-theme`,
    },
    customStyles: `
      .medium-theme {
        font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
        color: #242424;
        font-size: 1.25rem;
        line-height: 1.62;
        letter-spacing: -0.003em;
      }
      .medium-theme :where(h1, h2, h3, h4, h5, h6) {
        font-family: var(--font-geist-sans), "Helvetica Neue", Arial, sans-serif;
        color: #1c1c1c;
        font-weight: 700;
        line-height: 1.16;
      }
      .medium-theme h1 {
        margin-top: 0;
        margin-bottom: 2rem;
        font-size: 2.45rem;
        letter-spacing: -0.02em;
      }
      .medium-theme h2 {
        margin-top: 2.6rem;
        margin-bottom: 0.65rem;
        font-size: 2rem;
      }
      .medium-theme h3 {
        margin-top: 2rem;
        margin-bottom: 0.45rem;
        font-size: 1.55rem;
      }
      .medium-theme p {
        margin: 1.55rem 0;
      }
      .medium-theme :where(ul, ol) {
        margin: 1.25rem 0 1.5rem;
        padding-left: 1.4rem;
      }
      .medium-theme li {
        margin: 0.25rem 0;
      }
      .medium-theme a {
        color: #0f766e;
        text-decoration-thickness: 2px;
      }
      .medium-theme a:hover {
        color: #115e59;
      }
      .medium-theme :not(pre) > code {
        font-family: var(--font-geist-mono), Menlo, Monaco, Consolas, monospace;
        font-size: 0.88rem;
        background: #f2f2f2;
        border: 1px solid #e6e6e6;
        color: #1f2937;
        border-radius: 0.35rem;
        padding: 0.1rem 0.35rem;
      }
      .medium-theme .mdv-code {
        border: 1px solid #ececec;
        border-radius: 0.5rem;
        background: #f8f8f8;
      }
      .medium-theme .mdv-code .mdv-code-header {
        border-bottom-color: #e5e5e5;
      }
      .medium-theme .mdv-code .language-badge {
        color: #6b7280;
      }
      .medium-theme .mdv-code .copy-button {
        color: #6b7280;
      }
      .medium-theme .mdv-code .copy-button:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #1f2937;
      }
      .medium-theme pre {
        margin: 1.9rem 0;
        background: #f8f8f8;
        border: 1px solid #ececec;
        border-radius: 0.5rem;
        padding: 1.1rem 1.2rem;
      }
      .medium-theme pre code {
        font-size: 0.95rem;
      }
      .medium-theme blockquote {
        margin: 1.9rem 0;
        border-left: 3px solid #1f2937;
        padding-left: 1.2rem;
        font-size: 1.25rem;
        line-height: 1.5;
        color: #303030;
      }
      .medium-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        font-size: 1rem;
      }
      .medium-theme :where(th, td) {
        border-bottom: 1px solid #e5e7eb;
        padding: 0.6rem 0.5rem;
        text-align: left;
      }
      .medium-theme th {
        font-family: var(--font-geist-sans), "Helvetica Neue", Arial, sans-serif;
        font-weight: 600;
        color: #2f2f2f;
      }
      .medium-theme hr {
        margin: 2.2rem 0;
        border-color: #e5e7eb;
      }
    `,
  },
  {
    name: 'paper',
    displayName: 'Paper',
    description: 'Academic paper style',
    classes: {
      container:
        'h-full overflow-auto border border-stone-300/70 bg-[#fffefb] p-6 sm:p-10 xl:p-12 shadow-[0_12px_36px_-22px_rgba(15,23,42,0.45)]',
      prose: `${lightProseClass} paper-theme`,
    },
    customStyles: `
      .paper-theme {
        font-family: "Times New Roman", Times, serif;
        color: #111827;
        font-size: 1.03rem;
        line-height: 1.78;
        max-width: 210mm;
        margin: 0 auto;
      }
      .paper-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #0f172a;
        font-weight: 700;
        line-height: 1.26;
        margin-top: 1.9rem;
        margin-bottom: 0.7rem;
      }
      .paper-theme h1 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
        font-size: 2rem;
      }
      .paper-theme h2 {
        font-size: 1.45rem;
      }
      .paper-theme h3 {
        font-size: 1.18rem;
      }
      .paper-theme p {
        margin: 0.85rem 0;
        text-align: justify;
      }
      .paper-theme :where(ul, ol) {
        margin: 0.7rem 0 1rem;
        padding-left: 1.4rem;
      }
      .paper-theme a {
        color: #1d4ed8;
      }
      .paper-theme :not(pre) > code {
        font-size: 0.82rem;
        background: #f4f4f5;
        border: 1px solid #d4d4d8;
        border-radius: 0.28rem;
        padding: 0.08rem 0.3rem;
        color: #1f2937;
      }
      .paper-theme .mdv-code {
        border: 1px solid #d4d4d8;
        border-radius: 0.35rem;
        background: #f9fafb;
      }
      .paper-theme .mdv-code .mdv-code-header {
        border-bottom-color: #d4d4d8;
      }
      .paper-theme .mdv-code .language-badge {
        color: #6b7280;
      }
      .paper-theme .mdv-code .copy-button {
        color: #6b7280;
      }
      .paper-theme .mdv-code .copy-button:hover {
        background: rgba(0, 0, 0, 0.04);
        color: #374151;
      }
      .paper-theme pre {
        margin: 1rem 0 1.25rem;
        border: 1px solid #d4d4d8;
        border-radius: 0.35rem;
        background: #f9fafb;
        padding: 0.8rem 0.9rem;
        page-break-inside: avoid;
      }
      .paper-theme pre code {
        font-size: 0.84rem;
      }
      .paper-theme blockquote {
        margin: 1rem 0;
        padding: 0.2rem 0 0.2rem 1rem;
        border-left: 3px solid #9ca3af;
        color: #374151;
      }
      .paper-theme hr {
        margin: 1.5rem 0;
        border-color: #d1d5db;
      }
      .paper-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.15rem 0;
      }
      .paper-theme :where(th, td) {
        border: 1px solid #6b7280;
        padding: 0.35rem 0.55rem;
        text-align: left;
      }
      .paper-theme th {
        background: #f3f4f6;
        font-weight: 700;
      }
    `,
  },
  {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Ultra-clean minimal design',
    classes: {
      container: 'h-full overflow-auto bg-white p-6 sm:p-10',
      prose: `${lightProseClass} minimal-theme`,
    },
    customStyles: `
      .minimal-theme {
        font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #3a3a3a;
        font-size: 1.03rem;
        line-height: 1.78;
      }
      .minimal-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #212121;
        font-weight: 500;
        line-height: 1.25;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
      }
      .minimal-theme h1 {
        margin-top: 0;
        font-size: 2.1rem;
        border-bottom: 1px solid #ececec;
        padding-bottom: 0.34rem;
      }
      .minimal-theme h2 {
        font-size: 1.55rem;
      }
      .minimal-theme h3 {
        font-size: 1.28rem;
      }
      .minimal-theme p {
        margin: 1.1rem 0;
      }
      .minimal-theme :where(ul, ol) {
        margin: 0.78rem 0 1.1rem;
        padding-left: 1.3rem;
      }
      .minimal-theme li::marker {
        color: #9ca3af;
      }
      .minimal-theme a {
        color: #0f766e;
      }
      .minimal-theme a:hover {
        color: #0f5f8c;
      }
      .minimal-theme :not(pre) > code {
        background: #f7f7f7;
        border: 1px solid #ebebeb;
        border-radius: 0.28rem;
        color: #303030;
        padding: 0.08rem 0.3rem;
      }
      .minimal-theme .mdv-code {
        border: 1px solid #e6e6e6;
        border-radius: 0.4rem;
        background: #fcfcfc;
      }
      .minimal-theme .mdv-code .mdv-code-header {
        border-bottom-color: #eeeeee;
      }
      .minimal-theme .mdv-code .language-badge {
        color: #9ca3af;
      }
      .minimal-theme .mdv-code .copy-button {
        color: #9ca3af;
      }
      .minimal-theme .mdv-code .copy-button:hover {
        background: rgba(0, 0, 0, 0.04);
        color: #4b5563;
      }
      .minimal-theme pre {
        margin: 1rem 0 1.2rem;
        border: 1px solid #e6e6e6;
        border-radius: 0.4rem;
        background: #fcfcfc;
        padding: 0.9rem 1rem;
      }
      .minimal-theme blockquote {
        margin: 1rem 0;
        border-left: 2px solid #d4d4d4;
        color: #616161;
        padding-left: 0.85rem;
        background: transparent;
      }
      .minimal-theme hr {
        margin: 1.5rem 0;
        border-color: #e7e7e7;
      }
      .minimal-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }
      .minimal-theme :where(th, td) {
        border-bottom: 1px solid #ececec;
        padding: 0.5rem 0.6rem;
      }
      .minimal-theme th {
        font-weight: 600;
        color: #525252;
        background: #fafafa;
      }
    `,
  },
  {
    name: 'terminal',
    displayName: 'Terminal',
    description: 'Retro terminal/console style',
    classes: {
      container:
        'h-full overflow-auto border border-emerald-500/70 bg-black p-5 sm:p-8 shadow-[0_16px_44px_-26px_rgba(16,185,129,0.6)]',
      prose: `${darkProseClass} terminal-theme`,
    },
    customStyles: `
      .terminal-theme {
        font-family: "IBM Plex Mono", "Courier New", Courier, monospace;
        color: #6eff88;
        font-size: 0.95rem;
        line-height: 1.6;
        text-shadow: 0 0 0.35px rgba(110, 255, 136, 0.45);
      }
      .terminal-theme :where(h1, h2, h3, h4, h5, h6) {
        color: #7dff9d;
        font-weight: 700;
        text-transform: uppercase;
        line-height: 1.24;
        margin-top: 1.8rem;
        margin-bottom: 0.7rem;
      }
      .terminal-theme h1 {
        margin-top: 0;
        font-size: 1.5rem;
        border-bottom: 1px solid rgba(110, 255, 136, 0.55);
        padding-bottom: 0.32rem;
      }
      .terminal-theme h2 {
        font-size: 1.25rem;
      }
      .terminal-theme h3 {
        font-size: 1.05rem;
      }
      .terminal-theme p {
        margin: 0.85rem 0;
      }
      .terminal-theme :where(ul, ol) {
        margin: 0.65rem 0 0.95rem;
        padding-left: 1.35rem;
      }
      .terminal-theme li::marker {
        color: #7dff9d;
      }
      .terminal-theme a {
        color: #67e8f9;
      }
      .terminal-theme a:hover {
        color: #fef08a;
      }
      .terminal-theme :not(pre) > code {
        color: #9efbb0;
        background: #020803;
        border: 1px solid #1b3e26;
        border-radius: 0.25rem;
        padding: 0.08rem 0.28rem;
      }
      .terminal-theme .mdv-code {
        border: 1px solid #1f462c;
        border-radius: 0.5rem;
        background: #020b04;
        box-shadow: inset 0 0 0 1px rgba(110, 255, 136, 0.08);
      }
      .terminal-theme .mdv-code .mdv-code-header {
        border-bottom-color: rgba(110, 255, 136, 0.15);
      }
      .terminal-theme .mdv-code .language-badge {
        color: #4ade80;
      }
      .terminal-theme .mdv-code .copy-button {
        color: #4ade80;
      }
      .terminal-theme .mdv-code .copy-button:hover {
        background: rgba(110, 255, 136, 0.08);
        color: #7dff9d;
      }
      .terminal-theme .mdv-code .copy-button .text-green-600 {
        color: #86efac !important;
      }
      .terminal-theme pre {
        margin: 1rem 0;
        border: 1px solid #1f462c;
        border-radius: 0.5rem;
        background: #020b04;
        box-shadow: inset 0 0 0 1px rgba(110, 255, 136, 0.08);
        padding: 0.85rem 0.95rem;
        color: #a9fbb9;
      }
      .terminal-theme pre code {
        color: inherit;
      }
      .terminal-theme blockquote {
        margin: 1rem 0;
        border-left: 3px solid #7dff9d;
        border-radius: 0 0.35rem 0.35rem 0;
        background: rgba(5, 20, 8, 0.85);
        color: #8af5a5;
        padding: 0.55rem 0.8rem;
      }
      .terminal-theme hr {
        margin: 1.3rem 0;
        border-color: #1f462c;
      }
      .terminal-theme table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        border: 1px solid #1f462c;
      }
      .terminal-theme :where(th, td) {
        border: 1px solid #1f462c;
        padding: 0.4rem 0.55rem;
      }
      .terminal-theme th {
        background: #062211;
        color: #7dff9d;
        font-weight: 700;
      }
      .terminal-theme .hljs {
        color: #8ef8a8;
      }
      .terminal-theme .hljs-keyword,
      .terminal-theme .hljs-selector-tag {
        color: #67e8f9;
      }
      .terminal-theme .hljs-string,
      .terminal-theme .hljs-addition {
        color: #bef264;
      }
      .terminal-theme .hljs-number,
      .terminal-theme .hljs-literal {
        color: #facc15;
      }
      .terminal-theme .hljs-comment,
      .terminal-theme .hljs-quote {
        color: #4ade80;
      }
      .terminal-theme .hljs-variable,
      .terminal-theme .hljs-template-variable,
      .terminal-theme .hljs-name {
        color: #67e8f9;
      }
      .terminal-theme .hljs-function .hljs-title,
      .terminal-theme .hljs-title.function_,
      .terminal-theme .hljs-title.class_ {
        color: #22d3ee;
      }
      .terminal-theme .hljs-params,
      .terminal-theme .hljs-attr,
      .terminal-theme .hljs-property {
        color: #bbf7d0;
      }
      .terminal-theme .hljs-regexp,
      .terminal-theme .hljs-deletion {
        color: #fb7185;
      }
    `,
  },
];

export function getTheme(themeName: string): Theme {
  return themes.find((theme) => theme.name === themeName) || themes[0];
}

export function getThemeNames(): string[] {
  return themes.map((theme) => theme.name);
}
