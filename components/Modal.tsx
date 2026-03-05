'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ui } from '../lib/ui-classes';
import { cn } from '../lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** If provided, footer shows Cancel + Confirm. */
  confirmLabel?: string;
  onConfirm?: () => void;
  /** Confirm button destructive style (e.g. for delete). */
  destructive?: boolean;
  /** Optional cancel label; default "取消". */
  cancelLabel?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  destructive,
  cancelLabel = '取消',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const content = (
    <div
      className={ui.modal.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={ui.modal.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={ui.modal.title}>
          {title}
        </h2>
        <div className="mt-3">{children}</div>
        {(confirmLabel ?? onConfirm) && (
          <div className={ui.modal.footer}>
            <button
              type="button"
              onClick={onClose}
              className={ui.home.buttons.secondary}
            >
              {cancelLabel}
            </button>
            {confirmLabel && onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  destructive ? ui.modal.dangerButton : ui.home.buttons.primary
                )}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
