'use client';

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@amdlre/design-system';
import { APP_CONFIG } from '@/constants/config';

interface Props {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
}

const RIYADH = { lat: 24.7136, lng: 46.6753 };

export function GoogleMapPicker({ initialLat, initialLng, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!APP_CONFIG.maps.apiKey) {
      setError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY غير مضبوط');
      return;
    }

    let cancelled = false;

    setOptions({ key: APP_CONFIG.maps.apiKey, v: 'weekly' });

    Promise.all([importLibrary('maps'), importLibrary('marker')])
      .then(([mapsLib]) => {
        if (cancelled || !mapRef.current) return;
        const center = {
          lat: initialLat ?? RIYADH.lat,
          lng: initialLng ?? RIYADH.lng,
        };
        const Map = mapsLib.Map;
        const map = new Map(mapRef.current, {
          center,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
        });
        const marker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });
        marker.addListener('dragend', () => {
          const pos = marker.getPosition();
          if (pos) onChange(pos.lat(), pos.lng());
        });
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          marker.setPosition(e.latLng);
          onChange(e.latLng.lat(), e.latLng.lng());
        });
        setIsReady(true);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'فشل تحميل الخريطة');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={2}>
      <Box
        ref={mapRef}
        className="h-72 w-full overflow-hidden rounded-3xl border border-brand-border bg-brand-offwhite"
      />
      {error ? (
        <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
          {error}
        </Typography>
      ) : null}
      {!isReady && !error ? (
        <Typography as="p" variant="small" className="text-xs font-bold text-brand-slate">
          جاري تحميل الخريطة...
        </Typography>
      ) : null}
    </Stack>
  );
}
