import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/features/social/user-avatar';
import { timeAgo } from '@/lib/dates';
import { habitTitle } from '@/lib/habits';
import { Heart, Lock, MapPin, MessageCircle } from '@/lib/icons';
import type { Post } from '@/lib/posts';
import { cn } from '@/lib/utils';

import { useComments, useLike } from './use-reactions';

/** 피드 게시물 한 개 (상자 없이): 누가 · 무엇 · N일째 · 한마디 · 좋아요/댓글 */
export function PostCard({ post, linkComments = true }: { post: Post; linkComments?: boolean }) {
  const { t, i18n } = useTranslation();
  const habit = habitTitle(post.habit, t);
  const openAuthor = () =>
    post.author.isMe
      ? router.navigate('/profile')
      : router.push({ pathname: '/user/[id]', params: { id: post.author.id } });

  return (
    <View className="gap-3 py-1">
      <Pressable accessibilityRole="link" onPress={openAuthor} className="flex-row items-center gap-2">
        <UserAvatar name={post.author.displayName} className="size-8" textClassName="text-xs" />
        <Text className="shrink text-sm font-semibold" numberOfLines={1}>
          {post.author.displayName}
        </Text>
        <Text className="text-muted-foreground text-xs">{timeAgo(post.at, t, i18n.language)}</Text>
        {post.author.isMe && post.visibility === 'private' ? (
          <View accessible accessibilityLabel={t('feed.onlyMe')}>
            <Icon as={Lock} className="text-muted-foreground size-3.5" />
          </View>
        ) : null}
      </Pressable>

      {post.kind === 'milestone' ? (
        <View>
          <Text className="text-primary text-6xl font-extrabold tabular-nums">{post.days}</Text>
          <Text className="text-[17px] font-semibold">{t('feed.milestone', { habit, days: post.days })}</Text>
        </View>
      ) : (
        <>
          {post.photo ? (
            <Image source={post.photo} className="aspect-[4/5] w-full rounded-lg" resizeMode="cover" accessibilityLabel={t('method.photo')} />
          ) : null}
          <View className="gap-1">
            <Text className="text-[17px] font-semibold">{t('feed.streakCaption', { habit, days: post.days })}</Text>
            {post.method === 'location' && post.placeName ? (
              <View className="flex-row items-center gap-1">
                <Icon as={MapPin} className="text-muted-foreground size-3.5" />
                <Text className="text-muted-foreground text-sm">{post.placeName}</Text>
              </View>
            ) : null}
            {post.note ? <Text className="mt-0.5">{post.note}</Text> : null}
          </View>
        </>
      )}

      <Reactions postId={post.id} linkComments={linkComments} />
    </View>
  );
}

/** 좋아요 / 댓글 */
function Reactions({ postId, linkComments }: { postId: string; linkComments: boolean }) {
  const { t } = useTranslation();
  const like = useLike(postId);
  const commentCount = useComments(postId).length;

  return (
    <View className="-ml-2 flex-row">
      <Button
        variant="ghost"
        size="sm"
        accessibilityState={{ selected: like.liked }}
        accessibilityLabel={`${t('post.like')}, ${t('post.likes', { count: like.count })}`}
        onPress={like.toggle}>
        <Icon
          as={Heart}
          className={cn('size-5', like.liked ? 'text-destructive fill-destructive' : 'text-muted-foreground')}
          fill={like.liked ? 'currentColor' : 'none'}
        />
        {like.count > 0 ? (
          <Text className={cn('tabular-nums', like.liked ? 'text-destructive' : 'text-muted-foreground')}>{like.count}</Text>
        ) : null}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        accessibilityLabel={t('post.comments', { count: commentCount })}
        disabled={!linkComments}
        className={cn(!linkComments && 'opacity-100')}
        onPress={() => router.push({ pathname: '/post/[id]', params: { id: postId } })}>
        <Icon as={MessageCircle} className="text-muted-foreground size-5" />
        {commentCount > 0 ? <Text className="text-muted-foreground tabular-nums">{commentCount}</Text> : null}
      </Button>
    </View>
  );
}
