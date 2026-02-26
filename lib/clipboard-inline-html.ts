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
  bodyFont?: string;
  bodyFontSize?: string;
  bodyLineHeight?: string;
  inlineCodeColor?: string;
  inlineCodeBackground?: string;
  inlineCodeBorder?: string;
  inlineCodeBorderRadius?: string;
  inlineCodePadding?: string;
  inlineCodeFontSize?: string;
  preBackground?: string;
  preColor?: string;
  preBorder?: string;
  preBorderRadius?: string;
  prePadding?: string;
  preCodeFontSize?: string;
  blockquoteColor?: string;
  blockquotePadding?: string;
  blockquoteExtra?: Record<string, string>;
  pMargin?: string;
  pExtra?: Record<string, string>;
  listMargin?: string;
  tableCellPadding?: string;
  tableHeaderColor?: string;
  tableHeaderExtra?: Record<string, string>;
  linkExtra?: Record<string, string>;
  strongExtra?: Record<string, string>;
  emExtra?: Record<string, string>;
  hrBorder?: string;
}

const BODY_FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif";
const MONO_FONT_STACK = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace";

const THEME_PALETTES: Record<string, ThemePalette> = {
  default: {
    text: '#1f2937',
    background: '#ffffff',
    bodyFontSize: '1.04rem',
    link: '#0f766e',
    linkExtra: { 'text-decoration-thickness': '1.5px' },
    inlineCodeColor: '#0f172a',
    inlineCodeBackground: '#e2e8f0',
    inlineCodeBorder: '#cbd5e1',
    inlineCodeBorderRadius: '0.42rem',
    inlineCodePadding: '0.14rem 0.42rem',
    inlineCodeFontSize: '0.84rem',
    preBackground: '#0f172a',
    preColor: '#e2e8f0',
    preBorder: '#1e293b',
    preBorderRadius: '0.75rem',
    prePadding: '1rem 1.15rem',
    preCodeFontSize: '0.9rem',
    blockquoteBorder: '#0f766e',
    blockquoteBackground: '#f0f8f7',
    blockquoteColor: '#334155',
    blockquotePadding: '0.8rem 1rem',
    blockquoteExtra: { 'border-radius': '0 0.6rem 0.6rem 0' },
    codeBackground: '#f8fafc',
    codeText: '#0f172a',
    codeBorder: '#d7e1e8',
    tableBorder: '#dbe3ec',
    tableHeaderBackground: '#f1f5f9',
    tableHeaderColor: '#1e293b',
    tableHeaderExtra: { 'font-size': '0.78rem', 'letter-spacing': '0.05em', 'text-transform': 'uppercase' },
    tableCellPadding: '0.68rem 0.85rem',
    pMargin: '1rem 0',
    listMargin: '0.8rem 0 1rem 1.35rem',
    hrBorder: '#cbd5e1',
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
    bodyFont: '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC","Helvetica Neue",Arial,sans-serif',
    bodyFontSize: '15.5px',
    bodyLineHeight: '1.72',
    link: '#0f766e',
    linkExtra: { 'text-decoration': 'none', 'border-bottom': '1px solid rgba(15, 118, 110, 0.4)', 'padding-bottom': '1px' },
    inlineCodeColor: '#cf222e',
    inlineCodeBackground: '#ebedee',
    inlineCodeBorder: '#ced3d8',
    inlineCodeBorderRadius: '0.28rem',
    inlineCodePadding: '0.07rem 0.26rem',
    inlineCodeFontSize: '0.78rem',
    preBackground: '#f6f8fa',
    preColor: '#24292f',
    preBorder: '#d0d7de',
    preBorderRadius: '0.5rem',
    preCodeFontSize: '0.78rem',
    blockquoteBorder: '#10b981',
    blockquoteBackground: '#eefdf8',
    blockquoteColor: '#334155',
    blockquotePadding: '0.64rem 0.82rem',
    blockquoteExtra: { 'border-radius': '0 0.48rem 0.48rem 0' },
    codeBackground: '#f6f8fa',
    codeText: '#24292f',
    codeBorder: '#d0d7de',
    tableBorder: '#dce4ec',
    tableHeaderBackground: '#f0fdf4',
    tableHeaderColor: '#1e293b',
    tableHeaderExtra: { 'font-size': '0.78rem', 'letter-spacing': '0.02em', 'text-transform': 'uppercase' },
    tableCellPadding: '0.42rem 0.58rem',
    pMargin: '0.78em 0',
    pExtra: { 'text-align': 'justify' },
    listMargin: '0.65em 0 0.88em 1.2rem',
    strongExtra: { color: '#0f172a' },
    emExtra: { color: '#0f766e' },
    headingColor: '#1f2937',
    headingFontWeight: '700',
    headingLineHeight: '1.28',
    headingOverrides: {
      h1: {
        'margin-top': '0',
        'margin-bottom': '0.95em',
        'font-size': '1.72rem',
        'text-align': 'center',
        'letter-spacing': '0.015em',
        'padding-bottom': '0.45rem',
        'border-bottom': '2px solid #10b981',
      },
      h2: {
        'font-size': '1.28rem',
        padding: '0.15rem 0 0.15rem 0.6rem',
        'border-left': '3px solid #10b981',
        background: '#f0fdf4',
        'border-radius': '0 0.28rem 0.28rem 0',
      },
      h3: {
        'font-size': '1.12rem',
        color: '#065f46',
      },
    },
  },
  dark: {
    text: '#dbe7f4',
    background: '#111827',
    link: '#67e8f9',
    inlineCodeColor: '#cffafe',
    inlineCodeBackground: '#0f172a',
    inlineCodeBorder: '#475569',
    inlineCodeBorderRadius: '0.42rem',
    inlineCodePadding: '0.14rem 0.42rem',
    preBackground: '#0f172a',
    preColor: '#e5eef8',
    preBorder: '#475569',
    preBorderRadius: '0.78rem',
    blockquoteBorder: '#22d3ee',
    blockquoteBackground: '#0f172a',
    blockquoteColor: '#c9daed',
    blockquoteExtra: { 'border-radius': '0 0.6rem 0.6rem 0' },
    codeBackground: '#0f172a',
    codeText: '#e2e8f0',
    codeBorder: '#374151',
    tableBorder: '#475569',
    tableHeaderBackground: '#1e293b',
    tableHeaderColor: '#f8fafc',
    tableHeaderExtra: { 'font-size': '0.78rem', 'letter-spacing': '0.05em', 'text-transform': 'uppercase' },
    tableCellPadding: '0.68rem 0.85rem',
    pMargin: '1rem 0',
    pExtra: { color: '#d0deee' },
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
    inlineCodeColor: '#cf222e',
    inlineCodeBackground: '#ebedee',
    inlineCodeBorder: '#ced3d8',
    inlineCodeBorderRadius: '0.35rem',
    inlineCodePadding: '0.12rem 0.38rem',
    inlineCodeFontSize: '0.84rem',
    preBackground: '#f6f8fa',
    preColor: '#24292f',
    preBorder: '#d0d7de',
    preBorderRadius: '0.55rem',
    prePadding: '1rem',
    blockquoteBorder: '#d0d7de',
    blockquoteBackground: 'transparent',
    blockquoteColor: '#59636e',
    blockquotePadding: '0 1em',
    blockquoteExtra: { 'border-left': '0.25em solid #d0d7de' },
    codeBackground: '#f6f8fa',
    codeText: '#24292f',
    codeBorder: '#d0d7de',
    tableBorder: '#d0d7de',
    tableHeaderBackground: '#f6f8fa',
    tableCellPadding: '0.38rem 0.75rem',
    pMargin: '0.9rem 0',
    listMargin: '0.75rem 0 1rem 1.4rem',
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
    bodyFont: "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
    link: '#0b6e99',
    inlineCodeColor: '#3a3a3a',
    inlineCodeBackground: '#e4e3e0',
    inlineCodeBorder: '#d9d7d3',
    inlineCodeBorderRadius: '0.3rem',
    inlineCodePadding: '0.1rem 0.36rem',
    inlineCodeFontSize: '0.83rem',
    preBackground: '#f7f6f3',
    preBorder: '#e7e4de',
    preBorderRadius: '0.45rem',
    prePadding: '0.9rem 1rem',
    blockquoteBorder: '#d5d2cc',
    blockquoteBackground: 'transparent',
    blockquoteColor: '#65615a',
    blockquotePadding: '0 0 0 0.9rem',
    blockquoteExtra: { 'border-left': '3px solid #d5d2cc' },
    codeBackground: '#f1f1ef',
    codeText: '#37352f',
    codeBorder: '#e6e6e4',
    tableBorder: '#ebe8e3',
    tableHeaderBackground: '#f5f4f2',
    tableHeaderColor: '#4a4742',
    tableCellPadding: '0.55rem 0.72rem',
    pMargin: '0.9rem 0',
    listMargin: '0.72rem 0 1rem 1.3rem',
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
    bodyFont: "charter,Georgia,Cambria,'Times New Roman',Times,serif",
    bodyFontSize: '1.25rem',
    bodyLineHeight: '1.62',
    link: '#0f766e',
    linkExtra: { 'text-decoration-thickness': '2px' },
    inlineCodeColor: '#1f2937',
    inlineCodeBackground: '#f2f2f2',
    inlineCodeBorder: '#e6e6e6',
    inlineCodeBorderRadius: '0.35rem',
    inlineCodePadding: '0.1rem 0.35rem',
    inlineCodeFontSize: '0.88rem',
    preBackground: '#f8f8f8',
    preBorder: '#ececec',
    preBorderRadius: '0.5rem',
    prePadding: '1.1rem 1.2rem',
    preCodeFontSize: '0.95rem',
    blockquoteBorder: '#1f2937',
    blockquoteBackground: 'transparent',
    blockquoteColor: '#303030',
    blockquotePadding: '0 0 0 1.2rem',
    blockquoteExtra: { 'border-left': '3px solid #1f2937', 'font-size': '1.25rem', 'line-height': '1.5' },
    codeBackground: '#f5f5f5',
    codeText: '#242424',
    codeBorder: '#e5e7eb',
    tableBorder: '#e5e7eb',
    tableHeaderBackground: 'transparent',
    tableHeaderColor: '#2f2f2f',
    tableHeaderExtra: { 'font-family': "'Helvetica Neue',Arial,sans-serif", border: 'none', 'border-bottom': '1px solid #e5e7eb' },
    tableCellPadding: '0.6rem 0.5rem',
    pMargin: '1.55rem 0',
    listMargin: '1.25rem 0 1.5rem 1.4rem',
    hrBorder: '#e5e7eb',
    headingColor: '#1c1c1c',
    headingFontWeight: '700',
    headingLineHeight: '1.16',
    headingExtra: {
      'font-family': "'Helvetica Neue',Arial,sans-serif",
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
    text: '#111827',
    background: '#fffefb',
    bodyFont: "'Times New Roman',Times,serif",
    bodyLineHeight: '1.78',
    link: '#1d4ed8',
    inlineCodeColor: '#1f2937',
    inlineCodeBackground: '#f4f4f5',
    inlineCodeBorder: '#d4d4d8',
    inlineCodeBorderRadius: '0.28rem',
    inlineCodePadding: '0.08rem 0.3rem',
    inlineCodeFontSize: '0.82rem',
    preBackground: '#f9fafb',
    preBorder: '#d4d4d8',
    preBorderRadius: '0.35rem',
    prePadding: '0.8rem 0.9rem',
    preCodeFontSize: '0.84rem',
    blockquoteBorder: '#9ca3af',
    blockquoteBackground: 'transparent',
    blockquoteColor: '#374151',
    blockquotePadding: '0.2rem 0 0.2rem 1rem',
    blockquoteExtra: { 'border-left': '3px solid #9ca3af' },
    codeBackground: '#f4efe6',
    codeText: '#111827',
    codeBorder: '#d6c8b5',
    tableBorder: '#6b7280',
    tableHeaderBackground: '#f3f4f6',
    tableCellPadding: '0.35rem 0.55rem',
    pMargin: '0.85rem 0',
    pExtra: { 'text-align': 'justify' },
    listMargin: '0.7rem 0 1rem 1.4rem',
    headingColor: '#0f172a',
    headingFontWeight: '700',
    headingLineHeight: '1.26',
    headingExtra: {
      'font-family': "'Times New Roman',Times,serif",
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
    text: '#3a3a3a',
    background: '#ffffff',
    bodyFont: "'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    bodyLineHeight: '1.78',
    link: '#0f766e',
    inlineCodeColor: '#303030',
    inlineCodeBackground: '#f7f7f7',
    inlineCodeBorder: '#ebebeb',
    inlineCodeBorderRadius: '0.28rem',
    inlineCodePadding: '0.08rem 0.3rem',
    preBackground: '#fcfcfc',
    preBorder: '#e6e6e6',
    preBorderRadius: '0.4rem',
    prePadding: '0.9rem 1rem',
    blockquoteBorder: '#d4d4d4',
    blockquoteBackground: 'transparent',
    blockquoteColor: '#616161',
    blockquotePadding: '0 0 0 0.85rem',
    blockquoteExtra: { 'border-left': '2px solid #d4d4d4' },
    codeBackground: '#f8fafc',
    codeText: '#1e293b',
    codeBorder: '#e2e8f0',
    tableBorder: '#ececec',
    tableHeaderBackground: '#fafafa',
    tableHeaderColor: '#525252',
    tableCellPadding: '0.5rem 0.6rem',
    pMargin: '1.1rem 0',
    listMargin: '0.78rem 0 1.1rem 1.3rem',
    hrBorder: '#e7e7e7',
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
    text: '#6eff88',
    background: '#000000',
    bodyFont: "'IBM Plex Mono','Courier New',Courier,monospace",
    bodyFontSize: '0.95rem',
    bodyLineHeight: '1.6',
    link: '#67e8f9',
    inlineCodeColor: '#9efbb0',
    inlineCodeBackground: '#020803',
    inlineCodeBorder: '#1b3e26',
    inlineCodeBorderRadius: '0.25rem',
    inlineCodePadding: '0.08rem 0.28rem',
    preBackground: '#020b04',
    preColor: '#a9fbb9',
    preBorder: '#1f462c',
    preBorderRadius: '0.5rem',
    prePadding: '0.85rem 0.95rem',
    blockquoteBorder: '#7dff9d',
    blockquoteBackground: '#051408',
    blockquoteColor: '#8af5a5',
    blockquotePadding: '0.55rem 0.8rem',
    blockquoteExtra: { 'border-left': '3px solid #7dff9d', 'border-radius': '0 0.35rem 0.35rem 0' },
    codeBackground: '#050505',
    codeText: '#00ff00',
    codeBorder: '#333333',
    tableBorder: '#1f462c',
    tableHeaderBackground: '#062211',
    tableHeaderColor: '#7dff9d',
    tableCellPadding: '0.4rem 0.55rem',
    pMargin: '0.85rem 0',
    listMargin: '0.65rem 0 0.95rem 1.35rem',
    hrBorder: '#1f462c',
    headingColor: '#7dff9d',
    headingFontWeight: '700',
    headingLineHeight: '1.24',
    headingExtra: {
      'text-transform': 'uppercase',
      'font-family': "'IBM Plex Mono','Courier New',Courier,monospace",
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
    'font-family': palette.bodyFont || BODY_FONT_STACK,
    'font-size': palette.bodyFontSize || '16px',
    'line-height': palette.bodyLineHeight || '1.75',
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
    const pStyles: Record<string, string> = { margin: palette.pMargin || '0 0 1em' };
    if (palette.pExtra) Object.assign(pStyles, palette.pExtra);
    applyStyle(node, pStyles);
  });

  root.querySelectorAll('blockquote').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    const bqStyles: Record<string, string> = {
      margin: '1.2em 0',
      padding: palette.blockquotePadding || '0.8em 1em',
      'border-left': `4px solid ${palette.blockquoteBorder}`,
      'background-color': palette.blockquoteBackground,
    };
    if (palette.blockquoteColor) bqStyles.color = palette.blockquoteColor;
    if (palette.blockquoteExtra) Object.assign(bqStyles, palette.blockquoteExtra);
    applyStyle(node, bqStyles);
  });

  root.querySelectorAll('pre').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: '1.1em 0',
      padding: palette.prePadding || '14px 16px',
      'background-color': palette.preBackground || palette.codeBackground,
      color: palette.preColor || palette.codeText,
      border: `1px solid ${palette.preBorder || palette.codeBorder}`,
      'border-radius': palette.preBorderRadius || '8px',
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
      color: palette.preColor || palette.codeText,
      background: 'transparent',
      border: '0',
      'font-family': MONO_FONT_STACK,
      'font-size': palette.preCodeFontSize || '1em',
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
      'background-color': palette.inlineCodeBackground || palette.codeBackground,
      color: palette.inlineCodeColor || palette.codeText,
      border: `1px solid ${palette.inlineCodeBorder || palette.codeBorder}`,
      'border-radius': palette.inlineCodeBorderRadius || '4px',
      padding: palette.inlineCodePadding || '0.08em 0.35em',
      'font-family': MONO_FONT_STACK,
      'font-size': palette.inlineCodeFontSize || '0.9em',
    });
  });

  root.querySelectorAll('a').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    const linkStyles: Record<string, string> = {
      color: palette.link,
      'text-decoration': 'underline',
      'text-underline-offset': '2px',
    };
    if (palette.linkExtra) Object.assign(linkStyles, palette.linkExtra);
    applyStyle(node, linkStyles);
  });

  root.querySelectorAll('hr').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      border: '0',
      'border-top': `1px solid ${palette.hrBorder || palette.tableBorder}`,
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
    const thStyles: Record<string, string> = {
      border: `1px solid ${palette.tableBorder}`,
      'background-color': palette.tableHeaderBackground,
      padding: palette.tableCellPadding || '8px 10px',
      'text-align': 'left',
      'font-weight': '600',
    };
    if (palette.tableHeaderColor) thStyles.color = palette.tableHeaderColor;
    if (palette.tableHeaderExtra) Object.assign(thStyles, palette.tableHeaderExtra);
    applyStyle(node, thStyles);
  });

  root.querySelectorAll('td').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      border: `1px solid ${palette.tableBorder}`,
      padding: palette.tableCellPadding || '8px 10px',
    });
  });

  root.querySelectorAll('ul').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: palette.listMargin || '0.7em 0 1em 1.25em',
      padding: '0',
      'list-style-type': 'disc',
    });
  });

  root.querySelectorAll('ol').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    applyStyle(node, {
      margin: palette.listMargin || '0.7em 0 1em 1.25em',
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
    const strongStyles: Record<string, string> = { 'font-weight': '700' };
    if (palette.strongExtra) Object.assign(strongStyles, palette.strongExtra);
    applyStyle(node, strongStyles);
  });

  root.querySelectorAll('em').forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }
    const emStyles: Record<string, string> = { 'font-style': 'italic' };
    if (palette.emExtra) Object.assign(emStyles, palette.emExtra);
    applyStyle(node, emStyles);
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
