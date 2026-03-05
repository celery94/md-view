/**
 * Node in the space tree. Stored flat in IndexedDB (parentId reference).
 * `children` is populated when building the tree from flat list (getTreeData).
 */
export interface SpaceNode {
  id: string;
  type: 'folder' | 'file';
  name: string;
  parentId: string | null;
  /** Manual order among siblings; default 0 for legacy data. */
  sortOrder?: number;
  /** Populated only when building tree; not persisted in DB. */
  children: SpaceNode[];
  /** File content; only meaningful when type === 'file'. */
  content: string;
  lastModified: number;
}

/**
 * Flat record for IndexedDB storage (no children array).
 */
export interface SpaceNodeRecord {
  id: string;
  type: 'folder' | 'file';
  name: string;
  parentId: string | null;
  /** Manual order among siblings; default 0 for legacy data. */
  sortOrder?: number;
  content: string;
  lastModified: number;
}
