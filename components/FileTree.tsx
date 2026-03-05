'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  ChevronRight,
  Folder,
  FileText,
  FilePlus,
  FolderPlus,
  GripVertical,
} from 'lucide-react';
import type { SpaceNode } from '../types/space';
import { cn } from '../lib/cn';
import { ui } from '../lib/ui-classes';
import {
  updateNode,
  deleteNode,
  deleteNodeCascade,
  moveNode,
} from '../lib/space-db';
import { Modal } from './Modal';

function findNodeById(nodes: SpaceNode[], id: string): SpaceNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNodeById(n.children, id);
    if (found) return found;
  }
  return null;
}

function getDescendantIds(node: SpaceNode): Set<string> {
  const set = new Set<string>();
  function collect(n: SpaceNode) {
    set.add(n.id);
    n.children.forEach(collect);
  }
  node.children.forEach(collect);
  return set;
}

const CONTEXT_MENU_PADDING = 8;

export interface FileTreeProps {
  nodes: SpaceNode[];
  selectedId: string | null;
  onSelectFile: (id: string) => void;
  openIds: Set<string>;
  onToggleOpen: (id: string) => void;
  onRefresh: () => void | Promise<void>;
  onFileOrFolderDeleted?: (id: string) => void;
  onCreateFileInFolder?: (parentId: string) => void;
  onCreateFolderInFolder?: (parentId: string) => void;
}

export function FileTree({
  nodes,
  selectedId,
  onSelectFile,
  openIds,
  onToggleOpen,
  onRefresh,
  onFileOrFolderDeleted,
  onCreateFileInFolder,
  onCreateFolderInFolder,
}: FileTreeProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: SpaceNode;
    left?: number;
    top?: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [renameModalNode, setRenameModalNode] = useState<SpaceNode | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [deleteConfirmNode, setDeleteConfirmNode] = useState<SpaceNode | null>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const close = (e: MouseEvent) => {
      if (contextMenuRef.current?.contains(e.target as Node)) return;
      setContextMenu(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [contextMenu]);

  useLayoutEffect(() => {
    if (!contextMenu || !contextMenuRef.current) return;
    const el = contextMenuRef.current;
    const rect = el.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;
    let left = contextMenu.left ?? contextMenu.x;
    let top = contextMenu.top ?? contextMenu.y;
    if (rect.right > innerWidth - CONTEXT_MENU_PADDING) {
      left = innerWidth - rect.width - CONTEXT_MENU_PADDING;
    }
    if (rect.bottom > innerHeight - CONTEXT_MENU_PADDING) {
      top = innerHeight - rect.height - CONTEXT_MENU_PADDING;
    }
    if (left < CONTEXT_MENU_PADDING) left = CONTEXT_MENU_PADDING;
    if (top < CONTEXT_MENU_PADDING) top = CONTEXT_MENU_PADDING;
    if (left !== (contextMenu.left ?? contextMenu.x) || top !== (contextMenu.top ?? contextMenu.y)) {
      setContextMenu((prev) => (prev ? { ...prev, left, top } : null));
    }
  }, [contextMenu?.x, contextMenu?.y, contextMenu?.node?.id]);

  const onNodeContextMenu = useCallback((node: SpaceNode, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  }, []);

  const handleRenameConfirm = useCallback(async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenameError('名称不能为空');
      return;
    }
    if (!renameModalNode) return;
    setRenameError('');
    await updateNode(renameModalNode.id, { name: trimmed });
    await onRefresh();
    setRenameModalNode(null);
  }, [renameModalNode, renameValue, onRefresh]);

  const openRenameModal = useCallback((node: SpaceNode) => {
    setContextMenu(null);
    setRenameModalNode(node);
    setRenameValue(node.name);
    setRenameError('');
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmNode) return;
    const id = deleteConfirmNode.id;
    if (deleteConfirmNode.type === 'folder') {
      await deleteNodeCascade(id);
    } else {
      await deleteNode(id);
    }
    await onRefresh();
    onFileOrFolderDeleted?.(id);
    setDeleteConfirmNode(null);
  }, [deleteConfirmNode, onRefresh, onFileOrFolderDeleted]);

  const openDeleteConfirm = useCallback((node: SpaceNode) => {
    setContextMenu(null);
    setDeleteConfirmNode(node);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      const overData = over.data.current as
        | { type?: string; parentId?: string | null; indexInParent?: number }
        | undefined;
      const draggedNode = findNodeById(nodes, activeId);
      if (!draggedNode) return;
      if (overId === 'tree-root') {
        const index = overData?.indexInParent ?? nodes.length;
        await moveNode(activeId, null, index);
      } else if (overData?.type === 'folder') {
        const descendantIds = getDescendantIds(draggedNode);
        if (descendantIds.has(overId)) return;
        await moveNode(activeId, overId, 0);
      } else if (overData) {
        const parentId = overData.parentId ?? null;
        const index = overData.indexInParent ?? 0;
        const descendantIds = getDescendantIds(draggedNode);
        if (parentId && descendantIds.has(parentId)) return;
        await moveNode(activeId, parentId, index);
      }
      await onRefresh();
    },
    [nodes, onRefresh]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const { setNodeRef: setRootDropRef } = useDroppable({
    id: 'tree-root',
    data: { parentId: null, indexInParent: nodes.length },
  });

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <ul
          ref={setRootDropRef}
          className="py-1 min-h-[2rem]"
          role="tree"
          aria-label="Space file tree"
        >
          {nodes.map((node, indexInParent) => (
            <FileTreeNode
              key={node.id}
              node={node}
              depth={0}
              indexInParent={indexInParent}
              selectedId={selectedId}
              onSelectFile={onSelectFile}
              openIds={openIds}
              onToggleOpen={onToggleOpen}
              onNodeContextMenu={onNodeContextMenu}
              onCreateFileInFolder={onCreateFileInFolder}
              onCreateFolderInFolder={onCreateFolderInFolder}
            />
          ))}
        </ul>
      </DndContext>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 min-w-[10rem] rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-[0_16px_36px_-22px_rgba(15,23,42,0.8)] ring-1 ring-black/5 backdrop-blur-md"
          style={{
            left: contextMenu.left ?? contextMenu.x,
            top: contextMenu.top ?? contextMenu.y,
          }}
          role="menu"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
            role="menuitem"
            onClick={() => openRenameModal(contextMenu.node)}
          >
            重命名
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
            role="menuitem"
            onClick={() => openDeleteConfirm(contextMenu.node)}
          >
            {contextMenu.node.type === 'folder' ? '删除文件夹及其内容' : '删除'}
          </button>
        </div>
      )}

      <Modal
        open={!!renameModalNode}
        onClose={() => { setRenameModalNode(null); setRenameError(''); }}
        title="重命名"
        confirmLabel="确定"
        onConfirm={handleRenameConfirm}
      >
        <input
          type="text"
          value={renameValue}
          onChange={(e) => { setRenameValue(e.target.value); setRenameError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') void handleRenameConfirm(); }}
          className={ui.modal.input}
          aria-invalid={!!renameError}
          aria-describedby={renameError ? 'rename-error' : undefined}
        />
        {renameError && (
          <p id="rename-error" className="mt-1.5 text-sm text-rose-700" role="alert">
            {renameError}
          </p>
        )}
      </Modal>

      <Modal
        open={!!deleteConfirmNode}
        onClose={() => setDeleteConfirmNode(null)}
        title="确认删除"
        confirmLabel="删除"
        destructive
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-sm text-slate-700">
          {deleteConfirmNode?.type === 'folder'
            ? '将同时删除该文件夹及其下所有文件与子文件夹，且无法恢复。是否继续？'
            : '删除后无法恢复，是否继续？'}
        </p>
      </Modal>
    </>
  );
}

export interface FileTreeNodeProps {
  node: SpaceNode;
  depth: number;
  indexInParent: number;
  selectedId: string | null;
  onSelectFile: (id: string) => void;
  openIds: Set<string>;
  onToggleOpen: (id: string) => void;
  onNodeContextMenu?: (node: SpaceNode, e: React.MouseEvent) => void;
  onCreateFileInFolder?: (parentId: string) => void;
  onCreateFolderInFolder?: (parentId: string) => void;
}

export function FileTreeNode({
  node,
  depth,
  indexInParent,
  selectedId,
  onSelectFile,
  openIds,
  onToggleOpen,
  onNodeContextMenu,
  onCreateFileInFolder,
  onCreateFolderInFolder,
}: FileTreeNodeProps) {
  const isFolder = node.type === 'folder';
  const isOpen = openIds.has(node.id);
  const isSelected = !isFolder && node.id === selectedId;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: node.id,
    data: { type: node.type, parentId: node.parentId },
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
    data: {
      type: node.type,
      parentId: node.parentId,
      indexInParent,
    },
  });
  const setRef = useCallback(
    (el: HTMLLIElement | null) => {
      setDragRef(el);
      setDropRef(el);
    },
    [setDragRef, setDropRef]
  );

  const indentStyle = { paddingLeft: depth * 12 + 8 };
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => onNodeContextMenu?.(node, e),
    [node, onNodeContextMenu]
  );

  if (isFolder) {
    return (
      <li
        ref={setRef}
        role="treeitem"
        aria-expanded={isOpen}
        aria-selected={false}
        className={cn(
          'group list-none',
          isDragging && 'opacity-50',
          isOver && 'ring-2 ring-cyan-500/50 ring-inset rounded-lg'
        )}
      >
        <div className="flex items-center">
          <span
            className="flex h-6 w-6 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded text-slate-400 hover:text-slate-600 touch-none"
            {...listeners}
            {...attributes}
            aria-label="Drag to move"
          >
            <GripVertical className="h-3.5 w-3.5" aria-hidden />
          </span>
          <button
            type="button"
            onClick={() => onToggleOpen(node.id)}
            onContextMenu={handleContextMenu}
            className={cn(ui.sidebar.treeRow, 'min-w-0 flex-1')}
            style={indentStyle}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} folder ${node.name}`}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-500 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </span>
            <Folder className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <span className="min-w-0 truncate text-slate-700">{node.name}</span>
          </button>
          {(onCreateFileInFolder || onCreateFolderInFolder) && (
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {onCreateFileInFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFileInFolder(node.id);
                  }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                  aria-label={`在此文件夹内新建文档`}
                  title="在此文件夹内新建文档"
                >
                  <FilePlus className="h-3.5 w-3.5" aria-hidden />
                </button>
              )}
              {onCreateFolderInFolder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolderInFolder(node.id);
                  }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
                  aria-label={`在此文件夹内新建文件夹`}
                  title="在此文件夹内新建文件夹"
                >
                  <FolderPlus className="h-3.5 w-3.5" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className="grid transition-[grid-template-rows] duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]"
          style={{ gridTemplateRows: isOpen && node.children.length > 0 ? '1fr' : '0fr' }}
        >
          <div className="min-h-0 overflow-hidden">
            <ul role="group" className="list-none py-0">
            {node.children.map((child, idx) => (
              <FileTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                indexInParent={idx}
                selectedId={selectedId}
                onSelectFile={onSelectFile}
                openIds={openIds}
                onToggleOpen={onToggleOpen}
                onNodeContextMenu={onNodeContextMenu}
                onCreateFileInFolder={onCreateFileInFolder}
                onCreateFolderInFolder={onCreateFolderInFolder}
              />
            ))}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={setRef}
      role="treeitem"
      aria-selected={isSelected}
      className={cn('list-none', isDragging && 'opacity-50')}
    >
      <div className="flex items-center">
        <span
          className="flex h-6 w-6 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded text-slate-400 hover:text-slate-600 touch-none"
          {...listeners}
          {...attributes}
          aria-label="Drag to move"
        >
          <GripVertical className="h-3.5 w-3.5" aria-hidden />
        </span>
        <button
          type="button"
          onClick={() => onSelectFile(node.id)}
          onContextMenu={handleContextMenu}
          className={cn(ui.sidebar.treeRow, 'min-w-0 flex-1', isSelected && ui.sidebar.treeRowSelected)}
          style={indentStyle}
          aria-label={`Open file ${node.name}`}
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <FileText
            className={cn('h-4 w-4', isSelected ? 'text-cyan-700' : 'text-slate-500')}
            aria-hidden
          />
        </span>
          <span className={cn(
            'min-w-0 truncate',
            isSelected ? 'text-slate-900' : 'text-slate-700'
          )}>
            {node.name}
          </span>
        </button>
      </div>
    </li>
  );
}
