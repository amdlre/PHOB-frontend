import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle } from 'lucide-react';
import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  Flex,
  Grid,
  Stack,
  Typography,
} from '@amdlre/design-system';
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
    <Card className="card-premium">
      <CardContent className="p-8">
        <Stack gap={6}>
          <Typography as="h3" variant="large" className="font-black text-brand-black">
            {t('title')}
          </Typography>

          <Grid gap={3} className="md:grid-cols-2">
            {checklist.map((c) => (
              <Flex
                key={c.key}
                align="center"
                gap={3}
                className="rounded-2xl border border-brand-border bg-brand-offwhite px-4 py-3"
              >
                {c.done ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <Circle size={18} className="text-brand-slate" />
                )}
                <Typography as="span" variant="small" className="font-bold text-brand-black">
                  {c.label}
                </Typography>
              </Flex>
            ))}
          </Grid>

          <ImageGrid title={t('beforeImages')} images={report.before_images} />
          <ImageGrid title={t('afterImages')} images={report.after_images} />

          {report.general_notes ? <NoteBlock title={t('generalNotes')} body={report.general_notes} /> : null}
          {report.damage_notes ? <NoteBlock title={t('damageNotes')} body={report.damage_notes} /> : null}
          {report.maintenance_notes ? (
            <NoteBlock title={t('maintenanceNotes')} body={report.maintenance_notes} />
          ) : null}

          {report.items_missing ? (
            <Box className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <Typography as="h4" variant="small" className="mb-2 font-black text-amber-700">
                {t('itemsMissing')}
              </Typography>
              {report.missing_description ? (
                <Typography
                  as="p"
                  variant="small"
                  className="text-xs font-bold text-amber-700"
                >
                  {report.missing_description}
                </Typography>
              ) : null}
              {report.missing_images && report.missing_images.length > 0 ? (
                <Box className="mt-3">
                  <ImageGrid title={t('missingImages')} images={report.missing_images} />
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ImageGrid({ title, images }: { title: string; images?: string[] }) {
  if (!images || images.length === 0) return null;
  return (
    <Stack gap={2}>
      <Typography
        as="h4"
        variant="small"
        className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
      >
        {title}
      </Typography>
      <Grid gap={3} className="grid-cols-3 md:grid-cols-4">
        {images.map((src, i) => (
          <Box
            key={i}
            className="overflow-hidden rounded-2xl border border-brand-border bg-brand-offwhite"
          >
            <AspectRatio ratio={1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="report" className="h-full w-full object-cover" />
            </AspectRatio>
          </Box>
        ))}
      </Grid>
    </Stack>
  );
}

function NoteBlock({ title, body }: { title: string; body: string }) {
  return (
    <Stack gap={1}>
      <Typography
        as="h4"
        variant="small"
        className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="small"
        className="rounded-2xl bg-brand-offwhite p-4 text-sm font-bold leading-relaxed text-brand-black"
      >
        {body}
      </Typography>
    </Stack>
  );
}
