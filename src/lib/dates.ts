import type { TFunction } from 'i18next';

import { localeTag } from '@/i18n';

import { fromDateKey, type DateKey } from './streak';

/** "Thursday, November 26" / "11월 26일 목요일" */
export function formatToday(language: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat(localeTag(language), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** "T" / "목" */
export function weekdayInitial(key: DateKey, language: string): string {
  return new Intl.DateTimeFormat(localeTag(language), { weekday: 'narrow' }).format(
    fromDateKey(key),
  );
}

export function dayOfMonth(key: DateKey): number {
  return fromDateKey(key).getDate();
}

/** "now", "5m", "3h", "2d" / "방금", "5분 전", "3시간 전", "2일 전"; older than a week → "Nov 12" */
export function timeAgo(iso: string, t: TFunction, language: string, now: number = Date.now()): string {
  const minutes = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return t('time.justNow');
  if (minutes < 60) return t('time.minutes', { n: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('time.hours', { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return t('time.days', { n: days });
  return new Intl.DateTimeFormat(localeTag(language), { month: 'short', day: 'numeric' }).format(new Date(iso));
}
