'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useConfirm } from '@amdlre/design-system';

import type { ActionResult } from '@/actions/auth';

interface Props {
  /** Optional URL to the detail/view page. Hides the eye icon when omitted. */
  viewHref?: string;
  /** Optional URL to the edit page. Hides the pencil when omitted. */
  editHref?: string;
  /** Server action that deletes the row. Hides the trash when omitted. */
  onDelete?: () => Promise<ActionResult>;
  /** Optional descriptor used in the confirm modal body, e.g. an entity name. */
  itemLabel?: string;
}

const ICON_BTN_CLASS =
  'rounded p-1.5 text-slate-500 transition-colors hover:bg-brand-offwhite hover:text-brand-accent';

/**
 * Compact view/edit/delete cluster for entity tables. View/edit are real
 * `<Link>`s — so the URL shows in the browser status bar and the user can
 * cmd-click / right-click to open in a new tab. Delete shows a DS confirm
 * modal before invoking the action and refreshing the route.
 */
export function RowActions({ viewHref, editHref, onDelete, itemLabel }: Props) {
  const t = useTranslations('common.rowActions');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const confirm = useConfirm();
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();

  async function handleDelete() {
    if (!onDelete) return;
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteConfirmTitle'),
      description: itemLabel
        ? `${t('deleteConfirmBody')} (${itemLabel})`
        : t('deleteConfirmBody'),
      confirmLabel: t('delete'),
      cancelLabel: tCommon('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    setPending(true);
    const res = await onDelete();
    setPending(false);
    if (res.success) {
      startTransition(() => router.refresh());
    } else {
      await confirm({
        iconVariant: 'danger',
        title: t('deleteFailed'),
        description: res.message ?? '',
        confirmLabel: tCommon('close'),
        cancelLabel: '',
      });
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {viewHref && (
        <Link
          href={viewHref}
          title={t('view')}
          aria-label={t('view')}
          onClick={(e) => e.stopPropagation()}
          className={ICON_BTN_CLASS}
        >
          <Eye className="h-4 w-4" />
        </Link>
      )}
      {editHref && (
        <Link
          href={editHref}
          title={t('edit')}
          aria-label={t('edit')}
          onClick={(e) => e.stopPropagation()}
          className={ICON_BTN_CLASS}
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={pending}
          title={t('delete')}
          aria-label={t('delete')}
          className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
