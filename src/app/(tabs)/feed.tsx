import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { TextTabs } from '@/components/text-tabs';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PostCard } from '@/features/feed/post-card';
import { useExploreFeed, useFollowingFeed } from '@/features/feed/use-feed';
import { Search } from '@/lib/icons';

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
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <View className="flex-row items-center pt-2">
            <Text className="flex-1 text-4xl font-extrabold tracking-tight">{t('feed.title')}</Text>
            <Button variant="ghost" size="icon" accessibilityLabel={t('feed.findPeople')} onPress={() => router.push('/discover')}>
              <Icon as={Search} className="size-6" />
            </Button>
          </View>
          <TextTabs<FeedTab> value={tab} onValueChange={setTab} options={[{ value: 'following', label: t('feed.following') }, { value: 'explore', label: t('feed.explore') }]} />
        </>
      }
      empty={
        tab === 'following' ? (
          <EmptyState title={t('feed.emptyFollowingTitle')} body={t('feed.emptyFollowing')}>
            <Button variant="link" onPress={() => router.push('/discover')}>
              <Text>{t('feed.findPeople')}</Text>
            </Button>
          </EmptyState>
        ) : (
          <EmptyState body={t('feed.emptyExplore')} />
        )
      }
    />
  );
}
