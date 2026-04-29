'use client';

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { APP_CONFIG } from '@/constants/config';

interface Props {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
}

const RIYADH = { lat: 24.7136, lng: 46.6753 };

export function GoogleMapPicker({ initialLat, initialLng, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!APP_CONFIG.maps.apiKey) {
      setError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY غير مضبوط');
      return;
    }

    const loader = new Loader({
      apiKey: APP_CONFIG.maps.apiKey,
      version: 'weekly',
      libraries: ['marker'],
    });

    let cancelled = false;

    loader
      .load()
      .then((google) => {
        if (cancelled || !mapRef.current) return;
        const center = {
          lat: initialLat ?? RIYADH.lat,
          lng: initialLng ?? RIYADH.lng,
        };
        const map = new google.maps.Map(mapRef.current, {
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
        markerRef.current = marker;
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
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="h-72 w-full overflow-hidden rounded-3xl border border-brand-border bg-brand-offwhite"
      />
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
      {!isReady && !error && (
        <p className="text-xs font-bold text-brand-slate">جاري تحميل الخريطة...</p>
      )}
    </div>
  );
}
