export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Minimal hast node shape for rehype plugin (no @types/hast dependency). */
interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

/** Extract plain text from a hast node (for heading slug source). */
export function hastToString(node: HastNode | undefined): string {
  if (!node) return '';
  if (node.type === 'text' && typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(hastToString).join('');
}

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Rehype plugin that sets deterministic `id` on h1–h6 nodes.
 * Run during AST processing so IDs are stable and not affected by React Strict Mode double-invocation.
 */
export function rehypeHeadingIds() {
  const slugCounts = new Map<string, number>();

  return (tree: HastNode) => {
    if (!tree?.children) return;

    function visit(node: HastNode) {
      if (node.type === 'element' && node.tagName && HEADING_TAGS.has(node.tagName)) {
        const text = hastToString(node).trim();
        const baseSlug = slugify(text) || 'heading';
        const currentCount = slugCounts.get(baseSlug) ?? 0;
        slugCounts.set(baseSlug, currentCount + 1);
        const id = currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount}`;
        node.properties = node.properties ?? {};
        node.properties.id = id;
      }
      node.children?.forEach(visit);
    }

    tree.children.forEach(visit);
  };
}

export function createSlugger() {
  const slugCounts = new Map<string, number>();

  return (value: string): string => {
    const baseSlug = slugify(value) || 'heading';
    const currentCount = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, currentCount + 1);

    if (currentCount === 0) {
      return baseSlug;
    }

    return `${baseSlug}-${currentCount}`;
  };
}

export function getNodeText(node: React.ReactNode): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (typeof node === 'object' && (node as any)?.props)
    return getNodeText((node as any).props.children);
  return '';
}
