export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
