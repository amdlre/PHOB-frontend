'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { NotificationsPopover, type NotificationItem } from '@amdlre/design-system';
import type { Notification } from '@/types/domain';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { APP_CONFIG } from '@/constants/config';

const POLL_INTERVAL = 30_000;

function formatRelative(iso: string, locale: string = 'ar'): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (sec < 60) return rtf.format(-sec, 'second');
  if (min < 60) return rtf.format(-min, 'minute');
  if (hr < 24) return rtf.format(-hr, 'hour');
  return rtf.format(-day, 'day');
}

export function NotificationBell() {
  const t = useTranslations('notifications');
  const [items, setItems] = useState<Notification[]>([]);

  async function fetchNotifications() {
    try {
      const res = await fetch(`${APP_CONFIG.api.baseUrl}${ENDPOINTS.notifications.list}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const json = await res.json();
      const list: Notification[] = Array.isArray(json) ? json : (json.data ?? []);
      setItems(list);
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const dsItems: NotificationItem[] = useMemo(
    () =>
      items.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.body,
        unread: !n.read,
        timestamp: formatRelative(n.created_at),
      })),
    [items],
  );

  return (
    <NotificationsPopover
      notifications={dsItems}
      labels={{
        title: t('title'),
        empty: t('empty'),
        ariaLabel: t('title'),
      }}
    />
  );
}
