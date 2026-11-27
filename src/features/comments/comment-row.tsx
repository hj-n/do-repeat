import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { findPerson } from '@/data/sample-people';
import { useMe } from '@/features/feed/use-feed';
import { UserAvatar } from '@/features/social/user-avatar';
import { timeAgo } from '@/lib/dates';
import { useAppStore, type Comment } from '@/store/app-store';

/** 댓글 한 줄: 동그라미, 이름, 시간, 내용. 내 댓글에는 삭제 */
export function CommentRow({ comment }: { comment: Comment }) {
  const { t, i18n } = useTranslation();
  const me = useMe();
  const deleteComment = useAppStore((s) => s.deleteComment);
  const isMine = comment.authorId === 'me';
  const name = isMine ? me.displayName : (findPerson(comment.authorId)?.displayName ?? '');

  return (
    <View className="flex-row gap-3 py-2">
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={name}
        onPress={() =>
          isMine ? router.navigate('/profile') : router.push({ pathname: '/user/[id]', params: { id: comment.authorId } })
        }>
        <UserAvatar name={name} className="size-8" textClassName="text-xs" />
      </Pressable>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="shrink text-sm font-semibold" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-muted-foreground text-xs">{timeAgo(comment.at, t, i18n.language)}</Text>
          {isMine ? (
            <Button variant="link" size="sm" className="h-auto px-0" onPress={() => deleteComment(comment.id)}>
              <Text className="text-muted-foreground text-xs">{t('post.deleteComment')}</Text>
            </Button>
          ) : null}
        </View>
        <Text>{comment.text}</Text>
      </View>
    </View>
  );
}
