/**
 * Feed posts. There are two kinds (no free-form posts, no selfies):
 * - checkIn: one day's proof (a place name or a photo) with D+N
 * - milestone: "○○ hit a 30-day streak"
 */
import type { ImageSourcePropType } from 'react-native';

import type { PresetId, VerifyMethod } from './habits';
import { addDays, type DateKey } from './streak';

export type Visibility = 'public' | 'private';

export type PostAuthor = {
  id: string;
  username: string;
  displayName: string;
  isMe: boolean;
};

export type HabitRef = { preset?: PresetId; customTitle?: string };

type PostBase = {
  id: string;
  author: PostAuthor;
  habit: HabitRef;
  /** Streak count on that day (D+N) */
  days: number;
  at: string;
  visibility: Visibility;
};

export type CheckInPost = PostBase & {
  kind: 'checkIn';
  method: VerifyMethod;
  placeName?: string;
  photo?: ImageSourcePropType;
};

export type MilestonePost = PostBase & { kind: 'milestone' };

export type Post = CheckInPost | MilestonePost;

/** Streak lengths that get a milestone post */
export function isMilestone(days: number): boolean {
  return [7, 30, 50, 100, 200, 365].includes(days) || (days > 365 && days % 100 === 0);
}

type MyHabit = HabitRef & { id: string; method: VerifyMethod; place?: { name: string } };
type MyCheckIn = { id: string; habitId: string; day: DateKey; at: string; photoUri?: string };

/** Builds my posts from my check-ins: one per check-in, plus milestones. */
export function myPosts(
  author: PostAuthor,
  habits: MyHabit[],
  checkIns: MyCheckIn[],
  visibility: { checkIn: Visibility; milestone: Visibility },
): Post[] {
  const posts: Post[] = [];
  for (const habit of habits) {
    const mine = checkIns.filter((c) => c.habitId === habit.id).sort((a, b) => a.day.localeCompare(b.day));
    let run = 0;
    let previous: DateKey | null = null;
    for (const c of mine) {
      run = previous !== null && addDays(previous, 1) === c.day ? run + 1 : 1;
      previous = c.day;
      const ref = { preset: habit.preset, customTitle: habit.customTitle };
      posts.push({
        kind: 'checkIn',
        id: `c-${c.id}`,
        author,
        habit: ref,
        days: run,
        at: c.at,
        visibility: visibility.checkIn,
        method: habit.method,
        placeName: habit.place?.name,
        photo: c.photoUri ? { uri: c.photoUri } : undefined,
      });
      if (isMilestone(run)) {
        posts.push({
          kind: 'milestone',
          id: `m-${c.id}`,
          author,
          habit: ref,
          days: run,
          at: c.at,
          visibility: visibility.milestone,
        });
      }
    }
  }
  return posts;
}

/** Newest first; a milestone sits above the check-in that earned it. */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const byTime = b.at.localeCompare(a.at);
    if (byTime !== 0) return byTime;
    return a.kind === b.kind ? 0 : a.kind === 'milestone' ? -1 : 1;
  });
}
