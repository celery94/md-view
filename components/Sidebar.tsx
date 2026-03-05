'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FolderPlus, FilePlus, Loader2 } from 'lucide-react';
import {
  addNode,
  getTreeData,
  getNode,
  resolveUniqueName,
} from '../lib/space-db';
import type { SpaceNode } from '../types/space';
import { FileTree } from './FileTree';
import { ui } from '../lib/ui-classes';
import { cn } from '../lib/cn';

const SIDEBAR_OPEN_KEY = 'mdv:sidebarOpen';
const SIDEBAR_WIDTH_KEY = 'mdv:sidebarWidth';
const SIDEBAR_WIDTH_DEFAULT = 256;
const SIDEBAR_WIDTH_MIN = 200;
const SIDEBAR_WIDTH_MAX = 400;
/** Max wait for one create (file/folder); after this we clear loading state so UI does not stay stuck. */
const CREATE_GUARD_MS = 8000;
export interface SidebarProps {
  /** Controlled: when set, sidebar open state is controlled by parent (e.g. header toggle). */
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onFileOrFolderDeleted?: (id: string) => void;
  onSelectFile?: (id: string) => void;
  /** When set, the tree highlights this id (e.g. the active editor tab). */
  activeFileId?: string | null;
}

export default function Sidebar({
  expanded: expandedProp,
  onToggleExpanded,
  onFileOrFolderDeleted,
  onSelectFile: onSelectFileProp,
  activeFileId,
}: SidebarProps = {}) {
  const [expandedInternal, setExpandedInternal] = useState(true);
  const [sidebarWidthPx, setSidebarWidthPx] = useState(SIDEBAR_WIDTH_DEFAULT);
  const [nodes, setNodes] = useState<SpaceNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [isCreating, setCreating] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const resizeStartRef = useRef<{ x: number; w: number } | null>(null);
  const isCreatingRef = useRef(false);
  const createGuardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = expandedProp !== undefined && onToggleExpanded !== undefined;
  const isExpanded = isControlled ? expandedProp : expandedInternal;

  useEffect(() => {
    let mounted = true;
    getTreeData().then((tree) => {
      if (mounted) setNodes(tree);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isControlled) return;
    try {
      const stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
      if (stored !== null) setExpandedInternal(stored === 'true');
    } catch {
      // ignore
    }
  }, [isControlled]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (stored !== null) {
        const n = parseInt(stored, 10);
        if (!Number.isNaN(n))
          setSidebarWidthPx(Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, n)));
      }
    } catch {
      // ignore
    }
  }, []);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = asideRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    resizeStartRef.current = { x: e.clientX, w: rect.width };
    const onMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const delta = e.clientX - resizeStartRef.current.x;
      setSidebarWidthPx((prev) => {
        const next = Math.round(prev + delta);
        return Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, next));
      });
      resizeStartRef.current = { x: e.clientX, w: resizeStartRef.current.w + delta };
    };
    const onUp = () => {
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onUp);
      try {
        const el2 = asideRef.current;
        if (el2) {
          const w = el2.getBoundingClientRect().width;
          localStorage.setItem(SIDEBAR_WIDTH_KEY, String(Math.round(w)));
        }
      } catch {
        // ignore
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.addEventListener('mouseleave', onUp);
  }, []);

  const toggleExpanded = useCallback(() => {
    if (onToggleExpanded) {
      onToggleExpanded();
      return;
    }
    setExpandedInternal((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_OPEN_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [onToggleExpanded]);

  const onToggleOpen = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onSelectFile = useCallback(
    (id: string) => {
      setSelectedId(id);
      onSelectFileProp?.(id);
    },
    [onSelectFileProp]
  );

  const handleFileOrFolderDeleted = useCallback(
    (id: string) => {
      setSelectedId((prev) => (prev === id ? null : prev));
      onFileOrFolderDeleted?.(id);
    },
    [onFileOrFolderDeleted]
  );

  const refreshTree = useCallback(async () => {
    const tree = await getTreeData();
    setNodes(tree);
  }, []);

  /** Resolve parentId for creation: selected file's parent, selected folder's id, or null (root). */
  const getParentIdForCreate = useCallback(async (): Promise<string | null> => {
    if (!selectedId) return null;
    const node = await getNode(selectedId);
    if (!node) return null;
    if (node.type === 'folder') return node.id;
    return node.parentId;
  }, [selectedId]);

  /** Create file under parentId (null = root or derived from selection). */
  const createFileUnder = useCallback(
    async (parentIdOverride?: string | null) => {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;
      setCreating(true);
      createGuardTimeoutRef.current = setTimeout(() => {
        createGuardTimeoutRef.current = null;
        isCreatingRef.current = false;
        setCreating(false);
      }, CREATE_GUARD_MS);
      try {
        const parentId =
          parentIdOverride !== undefined ? parentIdOverride : await getParentIdForCreate();
        const name = await resolveUniqueName(parentId, '未命名文档', 'file');
        const id = crypto.randomUUID();
        await addNode({
          id,
          type: 'file',
          name,
          parentId,
          content: '',
          lastModified: Date.now(),
        });
        await refreshTree();
        setSelectedId(id);
        if (parentId != null) setOpenIds((prev) => new Set(prev).add(parentId));
      } finally {
        if (createGuardTimeoutRef.current != null) {
          clearTimeout(createGuardTimeoutRef.current);
          createGuardTimeoutRef.current = null;
        }
        isCreatingRef.current = false;
        setCreating(false);
      }
    },
    [getParentIdForCreate, refreshTree]
  );

  /** Create folder under parentId (null = root or derived from selection). */
  const createFolderUnder = useCallback(
    async (parentIdOverride?: string | null) => {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;
      setCreating(true);
      createGuardTimeoutRef.current = setTimeout(() => {
        createGuardTimeoutRef.current = null;
        isCreatingRef.current = false;
        setCreating(false);
      }, CREATE_GUARD_MS);
      try {
        const parentId =
          parentIdOverride !== undefined ? parentIdOverride : await getParentIdForCreate();
        const name = await resolveUniqueName(parentId, '未命名文件夹', 'folder');
        const id = crypto.randomUUID();
        await addNode({
          id,
          type: 'folder',
          name,
          parentId,
          content: '',
          lastModified: Date.now(),
        });
        await refreshTree();
        setOpenIds((prev) => {
          const next = new Set(prev).add(id);
          if (parentId != null) next.add(parentId);
          return next;
        });
      } finally {
        if (createGuardTimeoutRef.current != null) {
          clearTimeout(createGuardTimeoutRef.current);
          createGuardTimeoutRef.current = null;
        }
        isCreatingRef.current = false;
        setCreating(false);
      }
    },
    [getParentIdForCreate, refreshTree]
  );

  return (
    <aside
      ref={asideRef}
      className={cn(
        ui.sidebar.root,
        'relative rounded-2xl border-slate-300/55 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.65)] ring-1 ring-white/60 transition-[width] duration-200 ease-out overflow-hidden'
      )}
      style={{
        width: isExpanded ? sidebarWidthPx : 0,
        minWidth: isExpanded ? undefined : 0,
        overflow: isExpanded ? undefined : 'hidden',
      }}
      aria-label="Space sidebar"
    >
      {isExpanded ? (
        <>
          <header className={ui.sidebar.header}>
            <h2 className="text-sm font-semibold tracking-tight text-slate-800">
              Space
            </h2>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className={ui.home.buttons.quietNav}
                aria-label="New folder"
                title="New folder"
                aria-busy={isCreating}
                disabled={isCreating}
                onClick={() => void createFolderUnder()}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <FolderPlus className="h-4 w-4" aria-hidden />
                )}
              </button>
              <button
                type="button"
                className={ui.home.buttons.quietNav}
                aria-label="New document"
                title="New document"
                aria-busy={isCreating}
                disabled={isCreating}
                onClick={() => void createFileUnder()}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <FilePlus className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
          </header>

          <div className={ui.sidebar.body}>
            {nodes.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <span className={ui.sidebar.empty}>Empty</span>
              </div>
            ) : (
              <FileTree
                nodes={nodes}
                selectedId={activeFileId ?? selectedId}
                onSelectFile={onSelectFile}
                openIds={openIds}
                onToggleOpen={onToggleOpen}
                onRefresh={refreshTree}
                onFileOrFolderDeleted={handleFileOrFolderDeleted}
                onCreateFileInFolder={createFileUnder}
                onCreateFolderInFolder={createFolderUnder}
              />
            )}
          </div>

          <footer className={ui.sidebar.footer} />

          <div
            onMouseDown={startResize}
            className="group absolute right-0 top-0 bottom-0 flex w-2 cursor-col-resize select-none items-stretch justify-center rounded-r transition-colors hover:bg-cyan-100/60"
            aria-label="Resize sidebar"
            role="separator"
            aria-orientation="vertical"
            title="Drag to resize sidebar"
          >
            <div className="h-full w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent group-hover:via-cyan-400" />
          </div>
        </>
      ) : null}
    </aside>
  );
}
