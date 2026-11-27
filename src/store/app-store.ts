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
import type { Visibility } from '@/lib/posts';
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
  /** 인증과 함께 남긴 한마디 (100자 이내) */
  note?: string;
};

/** 한마디 최대 글자 수 */
export const NOTE_MAX = 100;
/** 댓글 최대 글자 수 */
export const COMMENT_MAX = 200;

/** 게시물에 단 댓글. authorId가 'me'면 내 댓글 */
export type Comment = { id: string; postId: string; authorId: string; text: string; at: string };

export type { Visibility };

/** 내 계정과 공개 범위 설정 */
export type MyProfile = {
  username: string;
  displayName: string;
  /** 비공개 계정: 승인한 팔로워만 내 게시물을 봄 */
  isPrivate: boolean;
  /** 인증 게시물 공개 여부 */
  checkInVisibility: Visibility;
  /** 달성 게시물(○일 연속 달성) 공개 여부 */
  milestoneVisibility: Visibility;
};

/** 팔로우 관계 (사람 id 목록) */
export type Social = {
  /** 내가 팔로우 중 */
  following: string[];
  /** 내가 보낸 요청 (상대가 비공개 계정) */
  outgoing: string[];
  /** 나를 팔로우 중 */
  followers: string[];
  /** 나에게 온 요청 (내가 비공개 계정일 때) */
  incoming: string[];
};

export type FollowStatus = 'following' | 'requested' | 'none';

type AppState = {
  habits: Habit[];
  checkIns: CheckIn[];
  language: LanguageSetting;
  profile: MyProfile;
  social: Social;
  /** 내가 쓴 댓글 (예시 사용자의 댓글은 data/sample-people.ts에 있어요) */
  comments: Comment[];
  /** 내가 좋아요한 게시물 id */
  likes: string[];
  addHabit: (input: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  /** Records today's check-in. Returns null if today was already done. */
  checkIn: (
    habitId: string,
    details?: { photoUri?: string; distance?: number; note?: string },
  ) => CheckIn | null;
  /** 인증에 한마디를 붙이거나 고칩니다 (빈 글이면 지움) */
  setCheckInNote: (checkInId: string, note: string) => void;
  /** 인증에 사진을 붙이거나 뗍니다 (위치 인증에도 사진을 남길 수 있어요) */
  setCheckInPhoto: (checkInId: string, photoUri: string | undefined) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  toggleLike: (postId: string) => void;
  setLanguage: (language: LanguageSetting) => void;
  /** 공개로 바꾸면 대기 중인 요청은 모두 수락됩니다 */
  updateProfile: (patch: Partial<MyProfile>) => void;
  /** 비공개 계정이면 요청, 공개 계정이면 바로 팔로우 */
  follow: (personId: string, personIsPrivate: boolean) => void;
  /** 팔로우 끊기 또는 보낸 요청 취소 */
  unfollow: (personId: string) => void;
  acceptRequest: (personId: string) => void;
  declineRequest: (personId: string) => void;
  /** Developer tool: sample people answer my sent requests */
  acceptOutgoingRequests: () => void;
  /** Developer tool: sample people follow me (or ask to, if I'm private) */
  receiveSampleFollows: (personIds: string[]) => void;
  /** Developer tool: add check-ins for the `days` days before today */
  fillSampleHistory: (days: number) => void;
  resetAll: () => void;
};

const without = (list: string[], id: string) => list.filter((x) => x !== id);
const withId = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      habits: [],
      checkIns: [],
      language: 'system',
      profile: {
        username: `repeater${Math.floor(1000 + Math.random() * 9000)}`,
        displayName: '',
        isPrivate: false,
        checkInVisibility: 'public',
        milestoneVisibility: 'public',
      },
      social: { following: [], outgoing: [], followers: [], incoming: [] },
      comments: [],
      likes: [],

      addHabit: (input) => {
        const habit: Habit = { ...input, id: newId(), createdAt: new Date().toISOString() };
        set((s) => ({ habits: [...s.habits, habit] }));
        return habit;
      },

      checkIn: (habitId, details) => {
        const today = toDateKey();
        if (get().checkIns.some((c) => c.habitId === habitId && c.day === today)) return null;
        const note = details?.note?.trim().slice(0, NOTE_MAX);
        const entry: CheckIn = {
          id: newId(),
          habitId,
          day: today,
          at: new Date().toISOString(),
          ...details,
          note: note || undefined,
        };
        set((s) => ({ checkIns: [...s.checkIns, entry] }));
        return entry;
      },

      setCheckInNote: (checkInId, note) => {
        const clean = note.trim().slice(0, NOTE_MAX);
        set((s) => ({
          checkIns: s.checkIns.map((c) => (c.id === checkInId ? { ...c, note: clean || undefined } : c)),
        }));
      },

      setCheckInPhoto: (checkInId, photoUri) =>
        set((s) => ({
          checkIns: s.checkIns.map((c) => (c.id === checkInId ? { ...c, photoUri } : c)),
        })),

      addComment: (postId, text) => {
        const clean = text.trim().slice(0, COMMENT_MAX);
        if (!clean) return;
        const comment: Comment = { id: newId(), postId, authorId: 'me', text: clean, at: new Date().toISOString() };
        set((s) => ({ comments: [...s.comments, comment] }));
      },

      deleteComment: (commentId) =>
        set((s) => ({ comments: s.comments.filter((c) => c.id !== commentId) })),

      toggleLike: (postId) =>
        set((s) => ({ likes: s.likes.includes(postId) ? without(s.likes, postId) : [...s.likes, postId] })),

      setLanguage: (language) => set({ language }),

      updateProfile: (patch) =>
        set((s) => {
          const profile = { ...s.profile, ...patch };
          const goingPublic = s.profile.isPrivate && !profile.isPrivate;
          const social = goingPublic
            ? { ...s.social, followers: [...new Set([...s.social.followers, ...s.social.incoming])], incoming: [] }
            : s.social;
          return { profile, social };
        }),

      follow: (personId, personIsPrivate) =>
        set((s) => ({
          social: personIsPrivate
            ? { ...s.social, outgoing: withId(s.social.outgoing, personId) }
            : { ...s.social, following: withId(s.social.following, personId) },
        })),

      unfollow: (personId) =>
        set((s) => ({
          social: {
            ...s.social,
            following: without(s.social.following, personId),
            outgoing: without(s.social.outgoing, personId),
          },
        })),

      acceptRequest: (personId) =>
        set((s) => ({
          social: {
            ...s.social,
            incoming: without(s.social.incoming, personId),
            followers: withId(s.social.followers, personId),
          },
        })),

      declineRequest: (personId) =>
        set((s) => ({ social: { ...s.social, incoming: without(s.social.incoming, personId) } })),

      acceptOutgoingRequests: () =>
        set((s) => ({
          social: {
            ...s.social,
            following: [...new Set([...s.social.following, ...s.social.outgoing])],
            outgoing: [],
          },
        })),

      receiveSampleFollows: (personIds) =>
        set((s) => {
          const fresh = personIds.filter(
            (id) => !s.social.followers.includes(id) && !s.social.incoming.includes(id),
          );
          return {
            social: s.profile.isPrivate
              ? { ...s.social, incoming: [...s.social.incoming, ...fresh] }
              : { ...s.social, followers: [...s.social.followers, ...fresh] },
          };
        }),

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

      resetAll: () =>
        set({
          habits: [],
          checkIns: [],
          comments: [],
          likes: [],
          social: { following: [], outgoing: [], followers: [], incoming: [] },
        }),
    }),
    {
      name: 'do-repeat',
      version: 1,
      storage: appStorage,
      partialize: (s) => ({
        habits: s.habits,
        language: s.language,
        profile: s.profile,
        social: s.social,
        comments: s.comments,
        likes: s.likes,
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

export function useFollowStatus(personId: string): FollowStatus {
  return useAppStore((s) =>
    s.social.following.includes(personId)
      ? 'following'
      : s.social.outgoing.includes(personId)
        ? 'requested'
        : 'none',
  );
}

export function useStreak(habitId: string) {
  const days = useCheckInDays(habitId);
  return useMemo(() => summarizeStreak(days), [days]);
}
