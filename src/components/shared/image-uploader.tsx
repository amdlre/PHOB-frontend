'use client';

import { Upload, X } from 'lucide-react';
import { useRef } from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Grid,
  Label,
  Stack,
  Typography,
} from '@amdlre/design-system';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  multiple?: boolean;
}

export function ImageUploader({ value, onChange, label, multiple = true }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <Stack gap={3}>
      {label ? (
        <Label className="block text-[10px] font-black uppercase tracking-widest text-brand-slate">
          {label}
        </Label>
      ) : null}
      <Grid gap={3} className="grid-cols-3 md:grid-cols-4">
        {value.map((src, i) => (
          <Box
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-offwhite"
          >
            <AspectRatio ratio={1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="upload" className="h-full w-full object-cover" />
            </AspectRatio>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="absolute top-1 end-1 h-7 w-7 rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black/80 hover:text-white group-hover:opacity-100"
            >
              <X size={14} />
            </Button>
          </Box>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => ref.current?.click()}
          className="flex aspect-square h-auto flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-border bg-brand-offwhite text-brand-slate hover:border-brand-accent hover:text-brand-accent"
        >
          <Upload size={20} />
          <Typography
            as="span"
            variant="small"
            className="text-[10px] font-black uppercase tracking-widest"
          >
            رفع
          </Typography>
        </Button>
        {/* Native file input is required for browser file picker — kept by design. */}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </Grid>
    </Stack>
  );
}
