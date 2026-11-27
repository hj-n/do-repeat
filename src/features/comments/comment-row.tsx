import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Spacing } from '@/constants/theme';
import { findPerson } from '@/data/sample-people';
import { useMe } from '@/features/feed/use-feed';
import { timeAgo } from '@/lib/dates';
import { useAppStore, type Comment } from '@/store/app-store';

/** 댓글 한 줄: 동그라미, 이름, 시간, 내용. 내 댓글에는 삭제 */
export function CommentRow({ comment }: { comment: Comment }) {
  const { t, i18n } = useTranslation();
  const me = useMe();
  const deleteComment = useAppStore((s) => s.deleteComment);
  const isMine = comment.authorId === 'me';
  const person = isMine ? undefined : findPerson(comment.authorId);
  const name = isMine ? me.displayName : (person?.displayName ?? '');

  const openAuthor = () =>
    isMine
      ? router.navigate('/profile')
      : router.push({ pathname: '/user/[id]', params: { id: comment.authorId } });

  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="link" accessibilityLabel={name} onPress={openAuthor}>
        <Avatar name={name} size={32} />
      </Pressable>
      <View style={styles.body}>
        <View style={styles.meta}>
          <AppText variant="label" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {timeAgo(comment.at, t, i18n.language)}
          </AppText>
          {isMine ? (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => deleteComment(comment.id)}>
              <AppText variant="caption" color="textMuted" style={styles.delete}>
                {t('post.deleteComment')}
              </AppText>
            </Pressable>
          ) : null}
        </View>
        <AppText>{comment.text}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.sm },
  body: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  name: { flexShrink: 1 },
  delete: { textDecorationLine: 'underline' },
});
