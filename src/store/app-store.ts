/**
 * App data, stored on the device for now.
 *
 * When a server is added later, this is the file to swap: screens only use
 * the hooks and actions below, so they won't need to change much.
 */
import { useMemo, useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { LanguageSetting } from '@/i18n';
import type { PresetId, VerifyMethod } from '@/lib/habits';
import { addDays, summarizeStreak, toDateKey, type DateKey } from '@/lib/streak';

import { appStorage } from './storage';

export type Place = { name: string; latitude: number; longitude: number; radius: number };

/** One thing the user repeats (예: 운동) */
export type Habit = {
  id: string;
  preset?: PresetId;
  customTitle?: string;
  method: VerifyMethod;
  place?: Place;
  createdAt: string;
};

/** One day's proof for a habit */
export type CheckIn = {
  id: string;
  habitId: string;
  day: DateKey;
  at: string;
  photoUri?: string;
  /** Meters from the saved spot, for location check-ins */
  distance?: number;
};

type AppState = {
  habits: Habit[];
  checkIns: CheckIn[];
  language: LanguageSetting;
  addHabit: (input: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  /** Records today's check-in. Returns false if today was already done. */
  checkIn: (habitId: string, details?: { photoUri?: string; distance?: number }) => boolean;
  setLanguage: (language: LanguageSetting) => void;
  /** Developer tool: add check-ins for the `days` days before today */
  fillSampleHistory: (days: number) => void;
  resetAll: () => void;
};

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      habits: [],
      checkIns: [],
      language: 'system',

      addHabit: (input) => {
        const habit: Habit = { ...input, id: newId(), createdAt: new Date().toISOString() };
        set((s) => ({ habits: [...s.habits, habit] }));
        return habit;
      },

      checkIn: (habitId, details) => {
        const today = toDateKey();
        if (get().checkIns.some((c) => c.habitId === habitId && c.day === today)) return false;
        const entry: CheckIn = {
          id: newId(),
          habitId,
          day: today,
          at: new Date().toISOString(),
          ...details,
        };
        set((s) => ({ checkIns: [...s.checkIns, entry] }));
        return true;
      },

      setLanguage: (language) => set({ language }),

      fillSampleHistory: (days) => {
        const today = toDateKey();
        const { habits, checkIns } = get();
        const existing = new Set(checkIns.map((c) => `${c.habitId}:${c.day}`));
        const added: CheckIn[] = [];
        for (const habit of habits) {
          for (let i = 1; i <= days; i++) {
            const day = addDays(today, -i);
            if (existing.has(`${habit.id}:${day}`)) continue;
            added.push({ id: newId(), habitId: habit.id, day, at: `${day}T19:00:00` });
          }
        }
        set({ checkIns: [...checkIns, ...added] });
      },

      resetAll: () => set({ habits: [], checkIns: [] }),
    }),
    {
      name: 'do-repeat',
      version: 1,
      storage: appStorage,
      partialize: (s) => ({
        habits: s.habits,
        language: s.language,
        // Web photos are temporary blob/data URLs; don't fill browser storage with them.
        checkIns: s.checkIns.map(({ photoUri, ...rest }) =>
          photoUri && !/^(blob|data):/.test(photoUri) ? { ...rest, photoUri } : rest,
        ),
      }),
    },
  ),
);

/** True once saved data has been loaded from the device. */
export function useStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}

export function useHabit(id: string | undefined): Habit | undefined {
  return useAppStore((s) => s.habits.find((h) => h.id === id));
}

/** Days this habit was checked in */
export function useCheckInDays(habitId: string): DateKey[] {
  const checkIns = useAppStore((s) => s.checkIns);
  return useMemo(
    () => checkIns.filter((c) => c.habitId === habitId).map((c) => c.day),
    [checkIns, habitId],
  );
}

export function useStreak(habitId: string) {
  const days = useCheckInDays(habitId);
  return useMemo(() => summarizeStreak(days), [days]);
}
