import type { Theme } from './themes';

export type InlineThemeName = Theme['name'];

export interface InlineClipboardPayload {
  html: string;
  plainText: string;
}

interface ThemePalette {
  text: string;
  background: string;
  link: string;
  blockquoteBorder: string;
  blockquoteBackground: string;
  codeBackground: string;
  codeText: string;
  codeBorder: string;
  tableBorder: string;
  tableHeaderBackground: string;
}

const BODY_FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif";
const MONO_FONT_STACK = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace";

const THEME_PALETTES: Record<string, ThemePalette> = {
  default: {
    text: '#12263a',
    background: '#ffffff',
    link: '#0f766e',
    blockquoteBorder: '#0f766e',
    blockquoteBackground: '#f0fdfa',
    codeBackground: '#f8fafc',
    codeText: '#0f172a',
    codeBorder: '#d7e1e8',
    tableBorder: '#d7e1e8',
    tableHeaderBackground: '#eaf0f4',
  },
  dark: {
    text: '#e2e8f0',
    background: '#111827',
    link: '#67e8f9',
    blockquoteBorder: '#38bdf8',
    blockquoteBackground: '#1f2937',
    codeBackground: '#0f172a',
    codeText: '#e2e8f0',
    codeBorder: '#374151',
    tableBorder: '#374151',
    tableHeaderBackground: '#1f2937',
  },
  github: {
    text: '#24292f',
    background: '#ffffff',
    link: '#0969da',
    blockquoteBorder: '#d0d7de',
    blockquoteBackground: '#f6f8fa',
    codeBackground: '#f6f8fa',
    codeText: '#24292f',
    codeBorder: '#d0d7de',
    tableBorder: '#d0d7de',
    tableHeaderBackground: '#f6f8fa',
  },
  notion: {
    text: '#37352f',
    background: '#ffffff',
    link: '#0f766e',
    blockquoteBorder: '#dadada',
    blockquoteBackground: '#f7f6f3',
    codeBackground: '#f1f1ef',
    codeText: '#37352f',
    codeBorder: '#e6e6e4',
    tableBorder: '#e6e6e4',
    tableHeaderBackground: '#f7f6f3',
  },
  medium: {
    text: '#242424',
    background: '#ffffff',
    link: '#0f766e',
    blockquoteBorder: '#d1d5db',
    blockquoteBackground: '#f8fafc',
    codeBackground: '#f5f5f5',
    codeText: '#242424',
    codeBorder: '#e5e7eb',
    tableBorder: '#e5e7eb',
    tableHeaderBackground: '#f9fafb',
  },
  paper: {
    text: '#1f2937',
    background: '#fefbf5',
    link: '#1d4ed8',
    blockquoteBorder: '#c4b5a5',
    blockquoteBackground: '#f6efe3',
    codeBackground: '#f4efe6',
    codeText: '#111827',
    codeBorder: '#d6c8b5',
    tableBorder: '#d6c8b5',
    tableHeaderBackground: '#f3e9d8',
  },
  minimal: {
    text: '#111827',
    background: '#ffffff',
    link: '#0f766e',
    blockquoteBorder: '#cbd5e1',
    blockquoteBackground: '#f8fafc',
    codeBackground: '#f8fafc',
    codeText: '#1e293b',
    codeBorder: '#e2e8f0',
    tableBorder: '#e2e8f0',
    tableHeaderBackground: '#f8fafc',
  },
  terminal: {
    text: '#00ff00',
    background: '#000000',
    link: '#5aff5a',
    blockquoteBorder: '#00cc66',
    blockquoteBackground: '#0a0a0a',
    codeBackground: '#050505',
    codeText: '#00ff00',
    codeBorder: '#333333',
    tableBorder: '#333333',
    tableHeaderBackground: '#101010',
  },
};

const KEEP_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
  input: new Set(['type', 'checked', 'disabled']),
  ol: new Set(['start']),
};

function styleText(declarations: Record<string, string>): string {
  return Object.entries(declarations)
    .filter(([, value]) => value.length > 0)
    .map(([property, value]) => `${property}:${value}`)
    .join(';');
}

function applyStyle(element: HTMLElement, declarations: Record<string, string>): void {
  element.setAttribute('style', styleText(declarations));
}

function applyHeadingStyles(root: HTMLElement, tag: string, size: string): void {
  root.querySelectorAll(tag).forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '1.2em 0 0.6em',
      'font-size': size,
      'font-weight': '700',
      'line-height': '1.35',
    });
  });
}

function applyInlineStyles(root: HTMLElement, palette: ThemePalette): void {
  applyStyle(root, {
    margin: '0',
    padding: '0',
    color: palette.text,
    'background-color': palette.background,
    'font-family': BODY_FONT_STACK,
    'font-size': '16px',
    'line-height': '1.75',
    'word-break': 'break-word',
    'overflow-wrap': 'anywhere',
  });

  applyHeadingStyles(root, 'h1', '2em');
  applyHeadingStyles(root, 'h2', '1.6em');
  applyHeadingStyles(root, 'h3', '1.35em');
  applyHeadingStyles(root, 'h4', '1.2em');
  applyHeadingStyles(root, 'h5', '1.05em');
  applyHeadingStyles(root, 'h6', '1em');

  root.querySelectorAll('p').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, { margin: '0 0 1em' });
  });

  root.querySelectorAll('blockquote').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '1.2em 0',
      padding: '0.8em 1em',
      'border-left': `4px solid ${palette.blockquoteBorder}`,
      'background-color': palette.blockquoteBackground,
    });
  });

  root.querySelectorAll('pre').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '1.1em 0',
      padding: '14px 16px',
      'background-color': palette.codeBackground,
      color: palette.codeText,
      border: `1px solid ${palette.codeBorder}`,
      'border-radius': '8px',
      'font-family': MONO_FONT_STACK,
      'font-size': '14px',
      'line-height': '1.6',
      'white-space': 'pre',
      'overflow-x': 'auto',
    });
  });

  root.querySelectorAll('pre code').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0',
      padding: '0',
      color: palette.codeText,
      background: 'transparent',
      border: '0',
      'font-family': MONO_FONT_STACK,
      'font-size': '1em',
      'line-height': '1.6',
      display: 'block',
      'white-space': 'pre',
    });
  });

  root.querySelectorAll('code').forEach((node) => {
    if (!(node instanceof HTMLElement) || node.closest('pre')) {
      return;
    }
    applyStyle(node, {
      'background-color': palette.codeBackground,
      color: palette.codeText,
      border: `1px solid ${palette.codeBorder}`,
      'border-radius': '4px',
      padding: '0.08em 0.35em',
      'font-family': MONO_FONT_STACK,
      'font-size': '0.9em',
    });
  });

  root.querySelectorAll('a').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      color: palette.link,
      'text-decoration': 'underline',
      'text-underline-offset': '2px',
    });
  });

  root.querySelectorAll('hr').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      border: '0',
      'border-top': `1px solid ${palette.tableBorder}`,
      margin: '1.5em 0',
    });
  });

  root.querySelectorAll('table').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      width: '100%',
      'border-collapse': 'collapse',
      margin: '1em 0',
    });
  });

  root.querySelectorAll('th').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      border: `1px solid ${palette.tableBorder}`,
      'background-color': palette.tableHeaderBackground,
      padding: '8px 10px',
      'text-align': 'left',
      'font-weight': '600',
    });
  });

  root.querySelectorAll('td').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      border: `1px solid ${palette.tableBorder}`,
      padding: '8px 10px',
    });
  });

  root.querySelectorAll('ul').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0.7em 0 1em 1.25em',
      padding: '0',
      'list-style-type': 'disc',
    });
  });

  root.querySelectorAll('ol').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0.7em 0 1em 1.25em',
      padding: '0',
      'list-style-type': 'decimal',
    });
  });

  root.querySelectorAll('li').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0.25em 0',
    });
  });

  root.querySelectorAll('ul.contains-task-list, ol.contains-task-list').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0.7em 0 1em',
      padding: '0',
      'list-style': 'none',
    });
  });

  root.querySelectorAll('li.task-list-item').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '0.3em 0',
      'list-style': 'none',
      display: 'flex',
      'align-items': 'flex-start',
      gap: '8px',
    });
  });

  root.querySelectorAll('input[type="checkbox"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      width: '16px',
      height: '16px',
      margin: '4px 8px 0 0',
      'vertical-align': 'middle',
    });
    if (!node.hasAttribute('disabled')) {
      node.setAttribute('disabled', '');
    }
  });

  root.querySelectorAll('img').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      display: 'block',
      'max-width': '100%',
      height: 'auto',
      margin: '1em auto',
      border: `1px solid ${palette.tableBorder}`,
      'border-radius': '8px',
    });
  });

  root.querySelectorAll('strong').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, { 'font-weight': '700' });
  });

  root.querySelectorAll('em').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, { 'font-style': 'italic' });
  });

  root.querySelectorAll('kbd').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      'font-family': MONO_FONT_STACK,
      'background-color': palette.codeBackground,
      border: `1px solid ${palette.codeBorder}`,
      'border-radius': '4px',
      padding: '0.1em 0.35em',
      'font-size': '0.85em',
    });
  });
}

function cleanupAttributes(root: HTMLElement): void {
  root.querySelectorAll('*').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    Array.from(node.attributes).forEach((attribute) => {
      const attrName = attribute.name.toLowerCase();

      if (attrName === 'style') {
        return;
      }

      if (attrName === 'class' || attrName === 'id' || attrName.startsWith('data-')) {
        node.removeAttribute(attribute.name);
        return;
      }

      const allowedTagAttributes = KEEP_ATTRS_BY_TAG[node.tagName.toLowerCase()];
      if (allowedTagAttributes?.has(attrName)) {
        return;
      }

      node.removeAttribute(attribute.name);
    });
  });
}

function normalizePlainText(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function getThemePalette(themeName: InlineThemeName): ThemePalette {
  return THEME_PALETTES[themeName] ?? THEME_PALETTES.default;
}

export function buildInlineClipboardPayload(
  previewRoot: HTMLElement,
  themeName: InlineThemeName
): InlineClipboardPayload {
  const clone = previewRoot.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-no-export]').forEach((node) => node.remove());

  const proseRoot = clone.querySelector('.prose');
  const contentRoot = proseRoot instanceof HTMLElement ? proseRoot : clone;

  const fragmentRoot = document.createElement('section');

  Array.from(contentRoot.childNodes).forEach((node) => {
    fragmentRoot.appendChild(node.cloneNode(true));
  });

  const plainText = normalizePlainText(contentRoot.innerText || contentRoot.textContent || '');

  applyInlineStyles(fragmentRoot, getThemePalette(themeName));
  cleanupAttributes(fragmentRoot);

  return {
    html: fragmentRoot.outerHTML,
    plainText,
  };
}
