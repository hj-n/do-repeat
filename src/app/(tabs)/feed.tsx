import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ListScreen } from '@/components/list-screen';
import { TextTabs } from '@/components/text-tabs';
import { Spacing } from '@/constants/theme';
import { PostCard } from '@/features/feed/post-card';
import { useExploreFeed, useFollowingFeed } from '@/features/feed/use-feed';

type FeedTab = 'following' | 'explore';

/** 피드: 팔로잉(나 + 팔로우한 사람) / 둘러보기(공개 게시물) */
export default function FeedScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<FeedTab>('following');
  const following = useFollowingFeed();
  const explore = useExploreFeed();
  const posts = tab === 'following' ? following : explore;

  return (
    <ListScreen
      edges={['top', 'left', 'right']}
      divided
      gap={Spacing.xl}
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <View style={styles.titleRow}>
            <AppText variant="display" style={styles.title}>
              {t('feed.title')}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('feed.findPeople')}
              hitSlop={10}
              onPress={() => router.push('/discover')}>
              <Icon name="search" color="text" />
            </Pressable>
          </View>
          <TextTabs<FeedTab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'following', label: t('feed.following') },
              { value: 'explore', label: t('feed.explore') },
            ]}
          />
        </>
      }
      empty={
        tab === 'following' ? (
          <EmptyState title={t('feed.emptyFollowingTitle')} body={t('feed.emptyFollowing')}>
            <Button kind="text" label={t('feed.findPeople')} onPress={() => router.push('/discover')} />
          </EmptyState>
        ) : (
          <EmptyState body={t('feed.emptyExplore')} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm },
  title: { flex: 1 },
});
