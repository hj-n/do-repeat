import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { SafeAreaView } from '@/components/safe-area-view';
import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CommentRow } from '@/features/comments/comment-row';
import { PostCard } from '@/features/feed/post-card';
import { usePost } from '@/features/feed/use-feed';
import { useComments } from '@/features/feed/use-reactions';
import { COMMENT_MAX, useAppStore } from '@/store/app-store';

/** 게시물 하나와 댓글. 아래 입력칸에서 댓글을 남겨요 */
export default function PostScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePost(id);
  const comments = useComments(id ?? '');
  const addComment = useAppStore((s) => s.addComment);
  const [text, setText] = useState('');
  const canSend = !!post && text.trim().length > 0;

  const send = () => {
    if (!post || !canSend) return;
    addComment(post.id, text);
    setText('');
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={post ? comments : []}
          keyExtractor={(c) => c.id}
          contentContainerClassName="px-6 pb-6 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="w-full max-w-[480px] self-center">
              <CommentRow comment={item} />
            </View>
          )}
          ListHeaderComponent={
            <View className="mb-2 w-full max-w-[480px] gap-4 self-center">
              <TopBar title={t('post.title')} fallback="/feed" />
              {post ? (
                <>
                  <PostCard post={post} linkComments={false} />
                  <Text variant="muted" className="font-medium">
                    {t('post.commentsTitle')}
                  </Text>
                </>
              ) : (
                <EmptyState body={t('post.notFound')} />
              )}
            </View>
          }
          ListEmptyComponent={
            post ? (
              <View className="w-full max-w-[480px] self-center">
                <Text className="text-muted-foreground">{t('post.noComments')}</Text>
              </View>
            ) : undefined
          }
        />

        {post ? (
          <View className="border-border bg-background border-t px-4 py-2">
            <View className="w-full max-w-[480px] flex-row items-center gap-2 self-center">
              <Input
                value={text}
                onChangeText={setText}
                placeholder={t('post.commentPlaceholder')}
                accessibilityLabel={t('post.commentPlaceholder')}
                maxLength={COMMENT_MAX}
                returnKeyType="send"
                onSubmitEditing={send}
                className="flex-1 rounded-full"
              />
              <Button variant="link" disabled={!canSend} onPress={send} className="px-2">
                <Text>{t('post.send')}</Text>
              </Button>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
