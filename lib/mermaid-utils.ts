type MermaidTheme = 'default' | 'dark' | 'neutral';

const DARK_THEMES = new Set(['dark', 'terminal']);
const NEUTRAL_THEMES = new Set(['paper']);
const MERMAID_BLOCK_SELECTOR = '.mdv-mermaid[data-mdv-mermaid-source]';
const MAX_CACHED_DIAGRAMS = 50;

let mermaidPromise: Promise<(typeof import('mermaid'))['default']> | null = null;
let initializedTheme: MermaidTheme | null = null;
let renderCounter = 0;
const mermaidSvgCache = new Map<string, Promise<string>>();

function toMermaidTheme(theme: string): MermaidTheme {
  if (DARK_THEMES.has(theme)) return 'dark';
  if (NEUTRAL_THEMES.has(theme)) return 'neutral';
  return 'default';
}

async function getMermaid(theme: MermaidTheme): Promise<(typeof import('mermaid'))['default']> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default);
  }

  const mermaid = await mermaidPromise;
  if (initializedTheme !== theme) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme,
    });
    initializedTheme = theme;
  }
  return mermaid;
}

function nextRenderId(): string {
  renderCounter += 1;
  return `mdv-mermaid-${Date.now()}-${renderCounter}`;
}

function buildMermaidFence(source: string): string {
  return `\`\`\`mermaid\n${source}\n\`\`\``;
}

export async function renderMermaidToSvg(source: string, themeName: string): Promise<string> {
  const theme = toMermaidTheme(themeName);
  const cacheKey = `${theme}::${source}`;
  const cachedSvg = mermaidSvgCache.get(cacheKey);

  if (cachedSvg) {
    return cachedSvg;
  }

  const renderPromise = (async () => {
    const mermaid = await getMermaid(theme);
    const { svg } = await mermaid.render(nextRenderId(), source);
    return svg;
  })();

  mermaidSvgCache.set(cacheKey, renderPromise);

  if (mermaidSvgCache.size > MAX_CACHED_DIAGRAMS) {
    const oldestKey = mermaidSvgCache.keys().next().value;
    if (typeof oldestKey === 'string') {
      mermaidSvgCache.delete(oldestKey);
    }
  }

  try {
    return await renderPromise;
  } catch (error) {
    mermaidSvgCache.delete(cacheKey);
    throw error;
  }
}

export function replaceMermaidBlocksWithMarkdown(root: ParentNode): void {
  const blocks = Array.from(root.querySelectorAll(MERMAID_BLOCK_SELECTOR));

  for (const block of blocks) {
    if (!(block instanceof HTMLElement)) {
      continue;
    }

    const source = block.dataset.mdvMermaidSource;
    if (!source) {
      continue;
    }

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-mermaid';
    code.textContent = buildMermaidFence(source);
    pre.appendChild(code);
    block.replaceWith(pre);
  }
}
