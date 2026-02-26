import type { Theme } from './themes';

export type InlineThemeName = Theme['name'];

export interface InlineClipboardPayload {
  html: string;
  plainText: string;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

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
  headingColor: string;
  headingFontWeight: string;
  headingLineHeight: string;
  headingLetterSpacing?: string;
  headingExtra?: Record<string, string>;
  headingOverrides?: Partial<Record<HeadingTag, Record<string, string>>>;
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
    headingColor: '#0f172a',
    headingFontWeight: '760',
    headingLineHeight: '1.22',
    headingLetterSpacing: '-0.01em',
    headingOverrides: {
      h1: { 'margin-top': '0', 'font-size': '2.15rem' },
      h2: { 'font-size': '1.7rem' },
      h3: { 'font-size': '1.35rem' },
    },
  },
  'wechat-publish': {
    text: '#374151',
    background: '#ffffff',
    link: '#0f766e',
    blockquoteBorder: '#0ea5a0',
    blockquoteBackground: '#ecfeff',
    codeBackground: '#f6f8fa',
    codeText: '#24292f',
    codeBorder: '#d0d7de',
    tableBorder: '#dce4ec',
    tableHeaderBackground: '#f3f8f6',
    headingColor: '#1f2937',
    headingFontWeight: '700',
    headingLineHeight: '1.34',
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'margin-bottom': '1.35em',
        'font-size': '2rem',
        'text-align': 'center',
        'letter-spacing': '0.03em',
        'padding-bottom': '0.55rem',
        'border-bottom': '1px solid #d1fae5',
      },
      h2: {
        'font-size': '1.45rem',
        padding: '0.14rem 0 0.14rem 0.7rem',
        'border-left': '4px solid #10b981',
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0))',
        'border-radius': '0 0.35rem 0.35rem 0',
      },
      h3: {
        'font-size': '1.2rem',
        color: '#065f46',
      },
    },
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
    headingColor: '#f8fafc',
    headingFontWeight: '740',
    headingLineHeight: '1.22',
    headingOverrides: {
      h1: { 'margin-top': '0', 'font-size': '2.05rem' },
      h2: { 'font-size': '1.65rem' },
      h3: { 'font-size': '1.3rem' },
    },
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
    headingColor: '#1f2328',
    headingFontWeight: '600',
    headingLineHeight: '1.25',
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'font-size': '2rem',
        'border-bottom': '1px solid #d0d7de',
        'padding-bottom': '0.3em',
      },
      h2: {
        'font-size': '1.5rem',
        'border-bottom': '1px solid #d0d7de',
        'padding-bottom': '0.3em',
      },
      h3: { 'font-size': '1.25rem' },
    },
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
    headingColor: '#2f2d29',
    headingFontWeight: '650',
    headingLineHeight: '1.25',
    headingOverrides: {
      h1: { 'margin-top': '0', 'font-size': '2.1rem' },
      h2: { 'font-size': '1.7rem' },
      h3: { 'font-size': '1.38rem' },
    },
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
    headingColor: '#1c1c1c',
    headingFontWeight: '700',
    headingLineHeight: '1.16',
    headingExtra: {
      'font-family': "var(--font-geist-sans), 'Helvetica Neue', Arial, sans-serif",
    },
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'margin-bottom': '2rem',
        'font-size': '2.45rem',
        'letter-spacing': '-0.02em',
      },
      h2: {
        'margin-top': '2.6rem',
        'margin-bottom': '0.65rem',
        'font-size': '2rem',
      },
      h3: {
        'margin-top': '2rem',
        'margin-bottom': '0.45rem',
        'font-size': '1.55rem',
      },
    },
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
    headingColor: '#0f172a',
    headingFontWeight: '700',
    headingLineHeight: '1.26',
    headingExtra: {
      'font-family': "'Times New Roman', Times, serif",
    },
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'margin-bottom': '1.5rem',
        'font-size': '2rem',
        'text-align': 'center',
      },
      h2: { 'font-size': '1.45rem' },
      h3: { 'font-size': '1.18rem' },
    },
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
    headingColor: '#212121',
    headingFontWeight: '500',
    headingLineHeight: '1.25',
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'font-size': '2.1rem',
        'border-bottom': '1px solid #ececec',
        'padding-bottom': '0.34rem',
      },
      h2: { 'font-size': '1.55rem' },
      h3: { 'font-size': '1.28rem' },
    },
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
    headingColor: '#7dff9d',
    headingFontWeight: '700',
    headingLineHeight: '1.24',
    headingExtra: {
      'text-transform': 'uppercase',
      'font-family': "'IBM Plex Mono', 'Courier New', Courier, monospace",
    },
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'font-size': '1.5rem',
        'border-bottom': '1px solid rgba(110, 255, 136, 0.55)',
        'padding-bottom': '0.32rem',
      },
      h2: { 'font-size': '1.25rem' },
      h3: { 'font-size': '1.05rem' },
    },
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

const DEFAULT_HEADING_SIZES: Record<HeadingTag, string> = {
  h1: '2em',
  h2: '1.6em',
  h3: '1.35em',
  h4: '1.2em',
  h5: '1.05em',
  h6: '1em',
};

function applyHeadingStyles(root: HTMLElement, tag: HeadingTag, palette: ThemePalette): void {
  const overrides = palette.headingOverrides?.[tag] ?? {};
  const base: Record<string, string> = {
    margin: '1.2em 0 0.6em',
    'font-size': DEFAULT_HEADING_SIZES[tag],
    'font-weight': palette.headingFontWeight,
    'line-height': palette.headingLineHeight,
    color: palette.headingColor,
  };
  if (palette.headingLetterSpacing) {
    base['letter-spacing'] = palette.headingLetterSpacing;
  }
  if (palette.headingExtra) {
    Object.assign(base, palette.headingExtra);
  }
  const merged = { ...base, ...overrides };
  root.querySelectorAll(tag).forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, merged);
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

  applyHeadingStyles(root, 'h1', palette);
  applyHeadingStyles(root, 'h2', palette);
  applyHeadingStyles(root, 'h3', palette);
  applyHeadingStyles(root, 'h4', palette);
  applyHeadingStyles(root, 'h5', palette);
  applyHeadingStyles(root, 'h6', palette);

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
