import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { RequestStatus } from '@/types/domain';

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: 'bg-slate-100 text-slate-700 border-slate-200',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  awaiting_guest_confirmation: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export function RequestStatusBadge({
  status,
  className,
}: {
  status: RequestStatus;
  className?: string;
}) {
  const t = useTranslations('request.statuses');
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider',
        STATUS_STYLES[status] || STATUS_STYLES.pending,
        className,
      )}
    >
      {t(status)}
    </span>
  );
}
