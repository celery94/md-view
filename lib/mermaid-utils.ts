type MermaidTheme = 'default' | 'dark' | 'neutral';

const DARK_THEMES = new Set(['dark', 'terminal']);
const NEUTRAL_THEMES = new Set(['paper']);
const MERMAID_SELECTOR = '.mdv-mermaid svg';
const MAX_RASTER_DIMENSION = 4096;

let mermaidPromise: Promise<(typeof import('mermaid'))['default']> | null = null;
let initializedTheme: MermaidTheme | null = null;
let renderCounter = 0;

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

function parseNumericSize(value: string | null | undefined): number | null {
  if (!value) return null;
  if (value.includes('%')) return null;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function getSvgDimensions(svg: SVGSVGElement): { width: number; height: number } {
  const widthAttr = parseNumericSize(svg.getAttribute('width'));
  const heightAttr = parseNumericSize(svg.getAttribute('height'));
  const viewBox = svg.getAttribute('viewBox');
  const [vbX, vbY, vbWidth, vbHeight] = (viewBox ?? '')
    .trim()
    .split(/\s+|,/)
    .map((part) => Number.parseFloat(part));
  const hasValidViewBox =
    Number.isFinite(vbX) &&
    Number.isFinite(vbY) &&
    Number.isFinite(vbWidth) &&
    Number.isFinite(vbHeight) &&
    vbWidth > 0 &&
    vbHeight > 0;

  if (widthAttr && heightAttr) {
    return { width: widthAttr, height: heightAttr };
  }

  if (hasValidViewBox) {
    if (widthAttr && !heightAttr) {
      const ratio = vbHeight / vbWidth;
      return { width: widthAttr, height: widthAttr * ratio };
    }
    if (heightAttr && !widthAttr) {
      const ratio = vbWidth / vbHeight;
      return { width: heightAttr * ratio, height: heightAttr };
    }
    return { width: vbWidth, height: vbHeight };
  }

  const fallbackRect = svg.getBoundingClientRect();
  if (fallbackRect.width > 0 && fallbackRect.height > 0) {
    return { width: fallbackRect.width, height: fallbackRect.height };
  }

  return { width: 900, height: 500 };
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load Mermaid SVG image.'));
    image.src = url;
  });
}

async function svgToPngDataUrl(svg: SVGSVGElement): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  const { width, height } = getSvgDimensions(svg);
  const safeWidth = Math.min(Math.max(1, Math.round(width)), MAX_RASTER_DIMENSION);
  const safeHeight = Math.min(Math.max(1, Math.round(height)), MAX_RASTER_DIMENSION);

  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }
  clone.setAttribute('width', String(safeWidth));
  clone.setAttribute('height', String(safeHeight));
  if (!clone.getAttribute('viewBox')) {
    clone.setAttribute('viewBox', `0 0 ${safeWidth} ${safeHeight}`);
  }

  const serialized = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const image = await loadImage(blobUrl);
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(MAX_RASTER_DIMENSION, safeWidth * scale);
    canvas.height = Math.min(MAX_RASTER_DIMENSION, safeHeight * scale);

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context.');
    }

    context.scale(scale, scale);
    context.drawImage(image, 0, 0, safeWidth, safeHeight);
    const dataUrl = canvas.toDataURL('image/png');
    return {
      dataUrl,
      width: safeWidth,
      height: safeHeight,
    };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export async function renderMermaidToSvg(source: string, themeName: string): Promise<string> {
  const mermaid = await getMermaid(toMermaidTheme(themeName));
  const { svg } = await mermaid.render(nextRenderId(), source);
  return svg;
}

export async function replaceMermaidSvgWithPngImages(root: ParentNode): Promise<void> {
  const diagrams = Array.from(root.querySelectorAll(MERMAID_SELECTOR));
  for (const svg of diagrams) {
    if (!(svg instanceof SVGSVGElement)) {
      continue;
    }

    try {
      const { dataUrl, width, height } = await svgToPngDataUrl(svg);
      const image = document.createElement('img');
      image.src = dataUrl;
      image.alt = 'Mermaid diagram';
      image.setAttribute('width', String(width));
      image.setAttribute('height', String(height));
      image.style.display = 'block';
      image.style.width = '100%';
      image.style.maxWidth = `${width}px`;
      image.style.height = 'auto';
      svg.replaceWith(image);
    } catch {
      // Keep the original SVG if conversion fails.
    }
  }
}
