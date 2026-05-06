'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CustomTextarea,
  Grid,
  Label,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { ImageUploader } from '@/components/shared/image-uploader';
import { uploadVisitReportAction } from '@/actions/reports';

interface Props {
  requestId: string;
}

export function VisitReportForm({ requestId }: Props) {
  const t = useTranslations('report');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [checks, setChecks] = useState({
    rooms_done: false,
    kitchen_done: false,
    bathrooms_done: false,
    linens_done: false,
  });
  const [before, setBefore] = useState<string[]>([]);
  const [after, setAfter] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [missingDesc, setMissingDesc] = useState('');
  const [hasMissing, setHasMissing] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');
  const [damage, setDamage] = useState('');
  const [maintenance, setMaintenance] = useState('');

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await uploadVisitReportAction(requestId, {
        ...checks,
        before_images: before,
        after_images: after,
        general_notes: generalNotes || undefined,
        damage_notes: damage || undefined,
        maintenance_notes: maintenance || undefined,
        items_missing: hasMissing,
        missing_description: hasMissing ? missingDesc : undefined,
        missing_images: hasMissing ? missing : undefined,
      });
      if (!res.success) {
        setError(res.message || 'حدث خطأ');
        return;
      }
      router.refresh();
    });
  };

  const checklistItems: Array<{ key: keyof typeof checks; label: string }> = [
    { key: 'rooms_done', label: t('rooms') },
    { key: 'kitchen_done', label: t('kitchen') },
    { key: 'bathrooms_done', label: t('bathrooms') },
    { key: 'linens_done', label: t('linens') },
  ];

  return (
    <Card className="card-premium p-8">
      <Stack gap={6}>
        <Typography as="h3" variant="large" className="font-black text-brand-black">
          {t('uploadReport')}
        </Typography>

        {error ? (
          <Box className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </Box>
        ) : null}

        <Stack gap={3}>
          <Typography
            as="h4"
            variant="small"
            className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
          >
            {t('checklist')}
          </Typography>
          <Grid gap={2} className="md:grid-cols-2">
            {checklistItems.map((item) => (
              <Label
                key={item.key}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-border bg-brand-offwhite px-4 py-3"
              >
                <Checkbox
                  checked={checks[item.key]}
                  onCheckedChange={(v: boolean | 'indeterminate') =>
                    setChecks((c) => ({ ...c, [item.key]: v === true }))
                  }
                />
                <Typography as="span" variant="small" className="font-bold text-brand-black">
                  {item.label}
                </Typography>
              </Label>
            ))}
          </Grid>
        </Stack>

        <ImageUploader value={before} onChange={setBefore} label={t('beforeImages')} />
        <ImageUploader value={after} onChange={setAfter} label={t('afterImages')} />

        <Grid gap={4} className="md:grid-cols-3">
          <CustomTextarea
            label={t('generalNotes')}
            rows={3}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            className="text-right"
          />
          <CustomTextarea
            label={t('damageNotes')}
            rows={3}
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            className="text-right"
          />
          <CustomTextarea
            label={t('maintenanceNotes')}
            rows={3}
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
            className="text-right"
          />
        </Grid>

        <Box className="rounded-3xl border border-brand-border bg-brand-offwhite p-5">
          <Stack gap={3}>
            <Label className="flex items-center gap-3">
              <Checkbox
                checked={hasMissing}
                onCheckedChange={(v: boolean | 'indeterminate') => setHasMissing(v === true)}
              />
              <Typography as="span" variant="small" className="font-black text-brand-black">
                {t('itemsMissing')}
              </Typography>
            </Label>
            {hasMissing ? (
              <Stack gap={3}>
                <CustomTextarea
                  value={missingDesc}
                  onChange={(e) => setMissingDesc(e.target.value)}
                  rows={3}
                  placeholder={t('missingDescription')}
                  className="text-right"
                />
                <ImageUploader value={missing} onChange={setMissing} label={t('missingImages')} />
              </Stack>
            ) : null}
          </Stack>
        </Box>

        <Button
          type="button"
          onClick={submit}
          disabled={pending}
          className="w-full rounded-2xl bg-brand-black py-4 text-sm font-black text-white shadow-lg hover:bg-brand-accent disabled:opacity-60"
        >
          {pending ? '...' : t('submitReport')}
        </Button>
      </Stack>
    </Card>
  );
}
