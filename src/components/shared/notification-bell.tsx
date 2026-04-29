'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Notification } from '@/types/domain';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { APP_CONFIG } from '@/constants/config';

const POLL_INTERVAL = 30_000;

export function NotificationBell() {
  const t = useTranslations('notifications');
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

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

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border bg-white text-brand-black hover:border-brand-accent hover:text-brand-accent transition-all"
        aria-label="notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-black text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute end-0 z-50 mt-2 w-80 max-h-96 overflow-auto rounded-3xl border border-brand-border bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between px-2 pb-2">
            <h4 className="text-sm font-black text-brand-black">{t('title')}</h4>
          </div>
          {items.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs font-bold text-brand-slate">{t('empty')}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-2xl border p-3 text-xs ${
                    n.read ? 'border-brand-border bg-white' : 'border-brand-accent/30 bg-brand-accent/5'
                  }`}
                >
                  <p className="font-black text-brand-black">{n.title}</p>
                  {n.body && <p className="mt-1 text-brand-slate">{n.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
