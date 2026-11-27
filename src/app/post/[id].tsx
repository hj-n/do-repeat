import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { EmptyState } from '@/components/empty-state';
import { TopBar } from '@/components/top-bar';
import { MaxContentWidth, Radius, Spacing, Type } from '@/constants/theme';
import { CommentRow } from '@/features/comments/comment-row';
import { PostCard } from '@/features/feed/post-card';
import { usePost } from '@/features/feed/use-feed';
import { useComments } from '@/features/feed/use-reactions';
import { useTheme } from '@/hooks/use-theme';
import { COMMENT_MAX, useAppStore } from '@/store/app-store';

/** 게시물 하나와 댓글. 아래 입력칸에서 댓글을 남겨요 */
export default function PostScreen() {
  const theme = useTheme();
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
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={post ? comments : []}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.column}>
              <CommentRow comment={item} />
            </View>
          )}
          ListHeaderComponent={
            <View style={[styles.column, styles.header]}>
              <TopBar title={t('post.title')} fallback="/feed" />
              {post ? (
                <>
                  <PostCard post={post} linkComments={false} />
                  <AppText variant="label" color="textMuted">
                    {t('post.commentsTitle')}
                  </AppText>
                </>
              ) : (
                <EmptyState body={t('post.notFound')} />
              )}
            </View>
          }
          ListEmptyComponent={
            post ? (
              <View style={styles.column}>
                <AppText color="textMuted">{t('post.noComments')}</AppText>
              </View>
            ) : undefined
          }
        />

        {post ? (
          <View style={[styles.bar, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
            <View style={[styles.column, styles.barInner]}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={t('post.commentPlaceholder')}
                placeholderTextColor={theme.textMuted}
                accessibilityLabel={t('post.commentPlaceholder')}
                maxLength={COMMENT_MAX}
                returnKeyType="send"
                onSubmitEditing={send}
                style={[
                  styles.input,
                  Type.body,
                  { color: theme.text, backgroundColor: theme.surfaceMuted },
                ]}
              />
              <Pressable
                accessibilityRole="button"
                disabled={!canSend}
                onPress={send}
                hitSlop={8}
                style={styles.send}>
                <AppText variant="bodyStrong" color={canSend ? 'accent' : 'textMuted'}>
                  {t('post.send')}
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  column: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { gap: Spacing.lg, marginBottom: Spacing.sm },
  bar: { borderTopWidth: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  barInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  input: {
    flex: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  send: { paddingVertical: Spacing.sm },
});
