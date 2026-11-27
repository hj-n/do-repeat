import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { timeAgo } from '@/lib/dates';
import { habitTitle } from '@/lib/habits';
import type { Post } from '@/lib/posts';

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
    <View style={styles.post}>
      <Pressable accessibilityRole="link" onPress={openAuthor} style={styles.header}>
        <Avatar name={post.author.displayName} size={32} />
        <AppText variant="label" numberOfLines={1} style={styles.name}>
          {post.author.displayName}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {timeAgo(post.at, t, i18n.language)}
        </AppText>
        {post.author.isMe && post.visibility === 'private' ? (
          <View accessible accessibilityLabel={t('feed.onlyMe')}>
            <Icon name="lock" size={14} color="textMuted" strokeWidth={2} />
          </View>
        ) : null}
      </Pressable>

      {post.kind === 'milestone' ? (
        <View>
          <AppText color="accent" style={styles.milestoneNumber}>
            {post.days}
          </AppText>
          <AppText variant="bodyStrong" style={styles.title}>
            {t('feed.milestone', { habit, days: post.days })}
          </AppText>
        </View>
      ) : (
        <>
          {post.photo ? (
            <Image source={post.photo} style={styles.photo} resizeMode="cover" accessibilityLabel={t('method.photo')} />
          ) : null}
          <View style={styles.texts}>
            <AppText variant="bodyStrong" style={styles.title}>
              {t('feed.streakCaption', { habit, days: post.days })}
            </AppText>
            {post.method === 'location' && post.placeName ? (
              <View style={styles.place}>
                <Icon name="pin" size={14} color="textMuted" strokeWidth={2} />
                <AppText variant="label" color="textMuted" style={styles.regular}>
                  {post.placeName}
                </AppText>
              </View>
            ) : null}
            {post.note ? <AppText style={styles.note}>{post.note}</AppText> : null}
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
    <View style={styles.reactions}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: like.liked }}
        accessibilityLabel={`${t('post.like')}, ${t('post.likes', { count: like.count })}`}
        hitSlop={8}
        onPress={like.toggle}
        style={styles.reaction}>
        <Icon name={like.liked ? 'heart-filled' : 'heart'} size={20} color={like.liked ? 'danger' : 'textMuted'} />
        {like.count > 0 ? (
          <AppText variant="label" color={like.liked ? 'danger' : 'textMuted'} style={styles.count}>
            {like.count}
          </AppText>
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('post.comments', { count: commentCount })}
        hitSlop={8}
        disabled={!linkComments}
        onPress={() => router.push({ pathname: '/post/[id]', params: { id: postId } })}
        style={styles.reaction}>
        <Icon name="comment" size={20} color="textMuted" />
        {commentCount > 0 ? (
          <AppText variant="label" color="textMuted" style={styles.count}>
            {commentCount}
          </AppText>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  post: { gap: Spacing.md, paddingVertical: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  name: { flexShrink: 1 },
  photo: { width: '100%', aspectRatio: 4 / 5, borderRadius: Radius.md },
  texts: { gap: 4 },
  title: { fontSize: 17 },
  place: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  regular: { fontWeight: '400' },
  note: { marginTop: 2 },
  milestoneNumber: { fontSize: 56, lineHeight: 62, fontWeight: '800', fontVariant: ['tabular-nums'] },
  reactions: { flexDirection: 'row', gap: Spacing.xl },
  reaction: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 28 },
  count: { fontVariant: ['tabular-nums'] },
});
