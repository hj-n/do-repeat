/**
 * Streak (연속 기록) calculation.
 * A day is the device's local calendar day, written as 'YYYY-MM-DD'.
 * No imports here so the logic can be tested on its own.
 */

export type DateKey = string;

export function toDateKey(date: Date = new Date()): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** The last `count` days ending with `today`, oldest first. */
export function lastDays(count: number, today: DateKey = toDateKey()): DateKey[] {
  return Array.from({ length: count }, (_, i) => addDays(today, i - (count - 1)));
}

/** This calendar week, Sunday to Saturday. */
export function thisWeek(today: DateKey = toDateKey()): DateKey[] {
  const start = addDays(today, -fromDateKey(today).getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export type StreakSummary = {
  /** Consecutive days up to today (or yesterday, if today isn't done yet). Shown as D+N. */
  current: number;
  /** Longest run ever */
  best: number;
  /** Number of distinct days checked in */
  total: number;
  doneToday: boolean;
  /** Has history, but the streak is 0 because a day was missed */
  broken: boolean;
};

export function summarizeStreak(
  checkInDays: Iterable<DateKey>,
  today: DateKey = toDateKey(),
): StreakSummary {
  const days = new Set([...checkInDays].filter((d) => d <= today));
  const doneToday = days.has(today);

  let current = 0;
  let cursor = doneToday ? today : addDays(today, -1);
  while (days.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let previous: DateKey | null = null;
  for (const day of [...days].sort()) {
    run = previous !== null && addDays(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }

  return { current, best, total: days.size, doneToday, broken: current === 0 && days.size > 0 };
}
