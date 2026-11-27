/**
 * Sample people for the feed until a server exists.
 * Their posts are generated relative to "now" so the feed always looks fresh.
 */
import type { ImageSourcePropType } from 'react-native';

import type { PresetId, VerifyMethod } from '@/lib/habits';
import { isMilestone, type Post, type Visibility } from '@/lib/posts';

const photos = {
  books: require('@/assets/sample/books.png'),
  dumbbell: require('@/assets/sample/dumbbell.png'),
  water: require('@/assets/sample/water.png'),
  notebook: require('@/assets/sample/notebook.png'),
} satisfies Record<string, ImageSourcePropType>;

type SampleHabit = {
  preset: PresetId;
  method: VerifyMethod;
  placeName?: string;
  photo?: ImageSourcePropType;
  /** Streak as of the latest check-in */
  streak: number;
  /** Latest check-in was this many hours ago */
  hoursAgo: number;
};

export type Person = {
  id: string;
  username: string;
  displayName: string;
  isPrivate: boolean;
  checkInVisibility: Visibility;
  milestoneVisibility: Visibility;
  /** Counts shown on their profile */
  followerCount: number;
  followingCount: number;
  habits: SampleHabit[];
};

export const SAMPLE_PEOPLE: Person[] = [
  {
    id: 'u_mina', username: 'mina.runs', displayName: 'Mina',
    isPrivate: false, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 214, followingCount: 180,
    habits: [
      { preset: 'exercise', method: 'location', placeName: 'Han River Park', streak: 30, hoursAgo: 1.5 },
      { preset: 'reading', method: 'photo', photo: photos.books, streak: 12, hoursAgo: 9 },
    ],
  },
  {
    id: 'u_jun', username: 'jun_reads', displayName: '준',
    isPrivate: true, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 88, followingCount: 102,
    habits: [{ preset: 'reading', method: 'photo', photo: photos.books, streak: 45, hoursAgo: 3 }],
  },
  {
    id: 'u_alex', username: 'alex.lifts', displayName: 'Alex',
    isPrivate: false, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 530, followingCount: 211,
    habits: [
      { preset: 'exercise', method: 'location', placeName: 'Iron Works Gym', streak: 100, hoursAgo: 4 },
      { preset: 'water', method: 'photo', photo: photos.water, streak: 7, hoursAgo: 6 },
    ],
  },
  {
    id: 'u_sora', username: 'sora', displayName: '소라',
    isPrivate: true, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 41, followingCount: 63,
    habits: [{ preset: 'journal', method: 'photo', photo: photos.notebook, streak: 21, hoursAgo: 13 }],
  },
  {
    id: 'u_leo', username: 'leo.walks', displayName: 'Leo',
    isPrivate: false, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 152, followingCount: 149,
    habits: [{ preset: 'walk', method: 'location', placeName: 'Riverside Trail', streak: 50, hoursAgo: 2.5 }],
  },
  {
    id: 'u_hana', username: 'hana_daily', displayName: '하나',
    isPrivate: false, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 97, followingCount: 120,
    habits: [
      { preset: 'water', method: 'photo', photo: photos.water, streak: 9, hoursAgo: 0.4 },
      { preset: 'study', method: 'photo', photo: photos.notebook, streak: 3, hoursAgo: 7 },
    ],
  },
  {
    id: 'u_daniel', username: 'daniel.k', displayName: 'Daniel',
    isPrivate: false, checkInVisibility: 'private', milestoneVisibility: 'public',
    followerCount: 305, followingCount: 98,
    habits: [{ preset: 'exercise', method: 'photo', photo: photos.dumbbell, streak: 30, hoursAgo: 11 }],
  },
  {
    id: 'u_yuna', username: 'yuna.studies', displayName: '유나',
    isPrivate: true, checkInVisibility: 'public', milestoneVisibility: 'public',
    followerCount: 66, followingCount: 70,
    habits: [{ preset: 'study', method: 'location', placeName: '중앙도서관', streak: 200, hoursAgo: 5 }],
  },
];

/** People who follow me / ask to, from the developer tool in Settings */
export const SAMPLE_FOLLOWER_IDS = ['u_sora', 'u_leo', 'u_hana'];

export function findPerson(id: string | undefined): Person | undefined {
  return SAMPLE_PEOPLE.find((p) => p.id === id);
}

const HOUR = 60 * 60 * 1000;
let cache: { builtAt: number; posts: Post[] } | null = null;

/** The last 3 days of each sample habit, plus milestones. */
export function samplePosts(now = Date.now()): Post[] {
  if (cache && now - cache.builtAt < HOUR) return cache.posts;
  const posts: Post[] = [];
  for (const person of SAMPLE_PEOPLE) {
    const author = { id: person.id, username: person.username, displayName: person.displayName, isMe: false };
    person.habits.forEach((habit, h) => {
      for (let k = 0; k < 3; k++) {
        const days = habit.streak - k;
        if (days < 1) break;
        const at = new Date(now - (habit.hoursAgo + 24 * k) * HOUR).toISOString();
        const base = { author, habit: { preset: habit.preset }, days, at };
        posts.push({
          ...base,
          kind: 'checkIn',
          id: `${person.id}-${h}-${k}`,
          visibility: person.checkInVisibility,
          method: habit.method,
          placeName: habit.placeName,
          photo: habit.photo,
        });
        if (isMilestone(days)) {
          posts.push({ ...base, kind: 'milestone', id: `${person.id}-${h}-${k}-m`, visibility: person.milestoneVisibility });
        }
      }
    });
  }
  cache = { builtAt: now, posts };
  return posts;
}

/** Can I see this person's posts at all? */
export function canSeeAccount(person: Person, following: boolean): boolean {
  return !person.isPrivate || following;
}
