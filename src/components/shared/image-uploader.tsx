'use client';

import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

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
    <div className="space-y-3">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-slate">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {value.map((src, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-offwhite"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="upload" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 end-1 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-border bg-brand-offwhite text-brand-slate transition-all hover:border-brand-accent hover:text-brand-accent"
        >
          <Upload size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">رفع</span>
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
