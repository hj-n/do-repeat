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
