import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle } from 'lucide-react';
import type { VisitReport } from '@/types/domain';

interface Props {
  report: VisitReport;
}

export function VisitReportView({ report }: Props) {
  const t = useTranslations('report');

  const checklist = [
    { key: 'rooms_done', label: t('rooms'), done: report.rooms_done },
    { key: 'kitchen_done', label: t('kitchen'), done: report.kitchen_done },
    { key: 'bathrooms_done', label: t('bathrooms'), done: report.bathrooms_done },
    { key: 'linens_done', label: t('linens'), done: report.linens_done },
  ];

  return (
    <div className="card-premium space-y-6 p-8">
      <h3 className="text-lg font-black text-brand-black">{t('title')}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        {checklist.map((c) => (
          <div
            key={c.key}
            className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-offwhite px-4 py-3"
          >
            {c.done ? (
              <CheckCircle2 size={18} className="text-emerald-600" />
            ) : (
              <Circle size={18} className="text-brand-slate" />
            )}
            <span className="text-sm font-bold text-brand-black">{c.label}</span>
          </div>
        ))}
      </div>

      <ImageGrid title={t('beforeImages')} images={report.before_images} />
      <ImageGrid title={t('afterImages')} images={report.after_images} />

      {report.general_notes && <NoteBlock title={t('generalNotes')} body={report.general_notes} />}
      {report.damage_notes && <NoteBlock title={t('damageNotes')} body={report.damage_notes} />}
      {report.maintenance_notes && (
        <NoteBlock title={t('maintenanceNotes')} body={report.maintenance_notes} />
      )}

      {report.items_missing && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h4 className="mb-2 text-sm font-black text-amber-700">{t('itemsMissing')}</h4>
          {report.missing_description && (
            <p className="text-xs font-bold text-amber-700">{report.missing_description}</p>
          )}
          {report.missing_images && report.missing_images.length > 0 && (
            <div className="mt-3">
              <ImageGrid title={t('missingImages')} images={report.missing_images} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImageGrid({ title, images }: { title: string; images?: string[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-slate">{title}</h4>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-offwhite"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="report" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-slate">{title}</h4>
      <p className="rounded-2xl bg-brand-offwhite p-4 text-sm font-bold leading-relaxed text-brand-black">
        {body}
      </p>
    </div>
  );
}
