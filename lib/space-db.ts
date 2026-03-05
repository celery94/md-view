import Dexie, { type EntityTable } from 'dexie';
import type { SpaceNode, SpaceNodeRecord } from '../types/space';

const DB_NAME = 'md-view-space';
const TABLE_NODES = 'nodes';

class SpaceDatabase extends Dexie {
  nodes!: EntityTable<SpaceNodeRecord, 'id'>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      [TABLE_NODES]: 'id, parentId, lastModified',
    });
    this.version(2)
      .stores({
        [TABLE_NODES]: 'id, parentId, lastModified',
      })
      .upgrade(async (tx) => {
        const records = await tx.table(TABLE_NODES).toArray();
        const byParent = new Map<string | null, SpaceNodeRecord[]>();
        for (const r of records) {
          const key = r.parentId;
          if (!byParent.has(key)) byParent.set(key, []);
          byParent.get(key)!.push(r);
        }
        for (const arr of byParent.values()) {
          arr.sort((a, b) => a.lastModified - b.lastModified);
          arr.forEach((rec, i) => {
            (rec as SpaceNodeRecord).sortOrder = i;
          });
        }
        await tx.table(TABLE_NODES).bulkPut(records);
      });
  }
}

const db = new SpaceDatabase();

function recordToNode(record: SpaceNodeRecord, children: SpaceNode[]): SpaceNode {
  return {
    id: record.id,
    type: record.type,
    name: record.name,
    parentId: record.parentId,
    sortOrder: record.sortOrder ?? 0,
    children,
    content: record.content,
    lastModified: record.lastModified,
  };
}

function nodeToRecord(node: Omit<SpaceNode, 'children'>): SpaceNodeRecord {
  return {
    id: node.id,
    type: node.type,
    name: node.name,
    parentId: node.parentId,
    sortOrder: node.sortOrder ?? 0,
    content: node.content,
    lastModified: node.lastModified,
  };
}

/**
 * Get max sortOrder among siblings under parentId, or -1 if none.
 */
async function getMaxSortOrder(parentId: string | null): Promise<number> {
  const siblings = await getNodesByParentId(parentId);
  if (siblings.length === 0) return -1;
  return Math.max(...siblings.map((r) => r.sortOrder ?? 0));
}

/**
 * Add a new node. Id must be unique (e.g. UUID). sortOrder defaults to max(siblings)+1.
 */
export async function addNode(
  node: Omit<SpaceNode, 'children'> | SpaceNode
): Promise<void> {
  const sortOrder =
    node.sortOrder ?? (await getMaxSortOrder(node.parentId)) + 1;
  const record = nodeToRecord({
    id: node.id,
    type: node.type,
    name: node.name,
    parentId: node.parentId,
    sortOrder,
    content: node.content,
    lastModified: node.lastModified,
  });
  await db.nodes.add(record);
}

/**
 * Delete a node by id. Does not cascade to children (caller must delete children first or implement cascade).
 */
export async function deleteNode(id: string): Promise<void> {
  await db.nodes.delete(id);
}

/**
 * Update an existing node by id. Partial update: only provided fields are updated; lastModified is set to Date.now() if not provided.
 */
export async function updateNode(
  id: string,
  updates: Partial<
    Pick<SpaceNode, 'name' | 'parentId' | 'sortOrder' | 'content' | 'lastModified'>
  >
): Promise<void> {
  const existing = await db.nodes.get(id);
  if (!existing) return;
  const lastModified = updates.lastModified ?? Date.now();
  await db.nodes.update(id, { ...updates, lastModified });
}

/**
 * Get the full tree: all nodes with children populated. Roots are nodes with parentId === null.
 * Order: roots and siblings sorted by sortOrder ascending, then lastModified descending.
 */
export async function getTreeData(): Promise<SpaceNode[]> {
  const records = await db.nodes.toArray();
  const byParent = new Map<string | null, SpaceNodeRecord[]>();
  for (const r of records) {
    const key = r.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(r);
  }
  for (const arr of byParent.values()) {
    arr.sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
        b.lastModified - a.lastModified
    );
  }

  function buildTree(parentId: string | null): SpaceNode[] {
    const list = byParent.get(parentId) ?? [];
    return list.map((r) =>
      recordToNode(r, r.type === 'folder' ? buildTree(r.id) : [])
    );
  }

  return buildTree(null);
}

/**
 * Move a node to a new parent and index. Recomputes sortOrder for all siblings in the target parent and persists to IndexedDB.
 */
export async function moveNode(
  id: string,
  newParentId: string | null,
  newIndex: number
): Promise<void> {
  const node = await db.nodes.get(id);
  if (!node) return;
  const oldParentId = node.parentId;
  let list = await getNodesByParentId(newParentId);
  list = list.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const currentIdx = list.findIndex((r) => r.id === id);
  if (currentIdx !== -1) list.splice(currentIdx, 1);
  const inserted: SpaceNodeRecord[] = [...list];
  inserted.splice(Math.min(newIndex, inserted.length), 0, node);
  const now = Date.now();
  await db.transaction('rw', db.nodes, async () => {
    for (let i = 0; i < inserted.length; i++) {
      const rec = inserted[i];
      if (rec.id === id) {
        await db.nodes.update(id, {
          parentId: newParentId,
          sortOrder: i,
          lastModified: now,
        });
      } else {
        await db.nodes.update(rec.id, { sortOrder: i });
      }
    }
  });
}

/**
 * Get a single node record by id (flat, no children).
 */
export async function getNode(id: string): Promise<SpaceNodeRecord | undefined> {
  return db.nodes.get(id);
}

/**
 * Get all direct children of a parent (siblings for the purpose of name conflict check).
 * Use parentId === null for root-level nodes.
 */
export async function getNodesByParentId(
  parentId: string | null
): Promise<SpaceNodeRecord[]> {
  if (parentId === null) {
    const all = await db.nodes.toArray();
    return all.filter((r) => r.parentId === null);
  }
  return db.nodes.where('parentId').equals(parentId).toArray();
}

/**
 * Delete a node and all its descendants (depth-first: delete children first, then self).
 */
export async function deleteNodeCascade(id: string): Promise<void> {
  const children = await getNodesByParentId(id);
  for (const child of children) {
    await deleteNodeCascade(child.id);
  }
  await db.nodes.delete(id);
}

/**
 * For files: "readme.md" -> base "readme", ext ".md". For folders: no extension.
 */
function splitNameAndExt(
  name: string,
  type: 'file' | 'folder'
): { base: string; ext: string } {
  if (type === 'folder') return { base: name, ext: '' };
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0) return { base: name, ext: '' };
  return { base: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

/**
 * Resolve a unique name under the given parent. If baseName already exists among siblings,
 * use baseName 2, baseName 3, … (files: keep extension, e.g. readme.md -> readme 2.md).
 */
export async function resolveUniqueName(
  parentId: string | null,
  baseName: string,
  type: 'file' | 'folder'
): Promise<string> {
  const siblings = await getNodesByParentId(parentId);
  const existingNames = new Set(siblings.map((r) => r.name));
  if (!existingNames.has(baseName)) return baseName;
  const { base, ext } = splitNameAndExt(baseName, type);
  let counter = 2;
  let candidate = `${base} ${counter}${ext}`;
  while (existingNames.has(candidate)) {
    counter += 1;
    candidate = `${base} ${counter}${ext}`;
  }
  return candidate;
}
