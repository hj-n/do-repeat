import { useMemo } from 'react';

import { canSeeAccount, findPerson, samplePosts, SAMPLE_PEOPLE, type Person } from '@/data/sample-people';
import { myPosts, sortPosts, type Post, type PostAuthor } from '@/lib/posts';
import { useAppStore } from '@/store/app-store';

export function useMe(): PostAuthor {
  const profile = useAppStore((s) => s.profile);
  return useMemo(
    () => ({
      id: 'me',
      username: profile.username,
      displayName: profile.displayName || profile.username,
      isMe: true,
    }),
    [profile.username, profile.displayName],
  );
}

/** 내 게시물 (비공개 게시물도 나에게는 보여요) */
export function useMyPosts(): Post[] {
  const me = useMe();
  const habits = useAppStore((s) => s.habits);
  const checkIns = useAppStore((s) => s.checkIns);
  const profile = useAppStore((s) => s.profile);
  return useMemo(
    () =>
      sortPosts(
        myPosts(me, habits, checkIns, {
          checkIn: profile.checkInVisibility,
          milestone: profile.milestoneVisibility,
        }),
      ),
    [me, habits, checkIns, profile.checkInVisibility, profile.milestoneVisibility],
  );
}

/** 다른 사람의 게시물 중 내가 볼 수 있는 것 */
export function visiblePostsOf(person: Person, following: boolean): Post[] {
  if (!canSeeAccount(person, following)) return [];
  return sortPosts(
    samplePosts().filter((p) => p.author.id === person.id && p.visibility === 'public'),
  );
}

/** 팔로잉 피드: 나 + 내가 팔로우하는 사람 */
export function useFollowingFeed(): Post[] {
  const mine = useMyPosts();
  const following = useAppStore((s) => s.social.following);
  return useMemo(() => {
    const others = SAMPLE_PEOPLE.filter((p) => following.includes(p.id)).flatMap((p) =>
      visiblePostsOf(p, true),
    );
    return sortPosts([...mine, ...others]);
  }, [mine, following]);
}

/** 둘러보기: 공개 계정의 공개 게시물 */
export function useExploreFeed(): Post[] {
  return useMemo(
    () => sortPosts(SAMPLE_PEOPLE.filter((p) => !p.isPrivate).flatMap((p) => visiblePostsOf(p, false))),
    [],
  );
}

/** id로 게시물 찾기 (내가 볼 수 없는 게시물이면 undefined) */
export function usePost(id: string | undefined): Post | undefined {
  const mine = useMyPosts();
  const following = useAppStore((s) => s.social.following);
  return useMemo(() => {
    if (!id) return undefined;
    const own = mine.find((p) => p.id === id);
    if (own) return own;
    const author = findPerson(samplePosts().find((p) => p.id === id)?.author.id);
    if (!author) return undefined;
    return visiblePostsOf(author, following.includes(author.id)).find((p) => p.id === id);
  }, [id, mine, following]);
}
