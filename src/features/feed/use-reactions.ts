import { useMemo } from 'react';

import { sampleComments, sampleLikeCount } from '@/data/sample-people';
import { useAppStore, type Comment } from '@/store/app-store';

/** 게시물의 댓글 (예시 사용자 댓글 + 내 댓글), 오래된 순 */
export function useComments(postId: string): Comment[] {
  const mine = useAppStore((s) => s.comments);
  return useMemo(
    () =>
      [...sampleComments().filter((c) => c.postId === postId), ...mine.filter((c) => c.postId === postId)].sort(
        (a, b) => a.at.localeCompare(b.at),
      ),
    [mine, postId],
  );
}

/** 좋아요 수와 내가 눌렀는지 */
export function useLike(postId: string): { liked: boolean; count: number; toggle: () => void } {
  const liked = useAppStore((s) => s.likes.includes(postId));
  const toggleLike = useAppStore((s) => s.toggleLike);
  return {
    liked,
    count: sampleLikeCount(postId) + (liked ? 1 : 0),
    toggle: () => toggleLike(postId),
  };
}
