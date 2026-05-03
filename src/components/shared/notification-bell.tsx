'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Card, Flex, Stack, Typography } from '@amdlre/design-system';
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
    <Box className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 rounded-2xl border-brand-border bg-white text-brand-black hover:border-brand-accent hover:text-brand-accent"
        aria-label="notifications"
      >
        <Bell size={18} />
        {unread > 0 ? (
          <Box
            as="span"
            className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-black text-white"
          >
            {unread}
          </Box>
        ) : null}
      </Button>
      {open ? (
        <Card className="absolute end-0 z-50 mt-2 w-80 max-h-96 overflow-auto rounded-3xl border-brand-border bg-white p-3 shadow-2xl">
          <Flex align="center" justify="between" className="px-2 pb-2">
            <Typography as="h4" variant="small" className="font-black text-brand-black">
              {t('title')}
            </Typography>
          </Flex>
          {items.length === 0 ? (
            <Typography
              as="p"
              variant="muted"
              className="px-2 py-6 text-center text-xs font-bold"
            >
              {t('empty')}
            </Typography>
          ) : (
            <Stack as="ul" gap={2} className="list-none">
              {items.map((n) => (
                <Box
                  key={n.id}
                  as="li"
                  className={`rounded-2xl border p-3 text-xs ${
                    n.read
                      ? 'border-brand-border bg-white'
                      : 'border-brand-accent/30 bg-brand-accent/5'
                  }`}
                >
                  <Typography as="p" variant="small" className="font-black text-brand-black">
                    {n.title}
                  </Typography>
                  {n.body ? (
                    <Typography as="p" variant="muted" className="mt-1">
                      {n.body}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          )}
        </Card>
      ) : null}
    </Box>
  );
}
