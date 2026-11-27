import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { TopBar } from '@/components/top-bar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { canSeeAccount, findPerson } from '@/data/sample-people';
import { PostCard } from '@/features/feed/post-card';
import { visiblePostsOf } from '@/features/feed/use-feed';
import { FollowButton } from '@/features/social/follow-button';
import { ProfileHeader } from '@/features/social/profile-header';
import { Lock } from '@/lib/icons';
import { useFollowStatus } from '@/store/app-store';

/** 다른 사람 프로필: 비공개 계정은 팔로우가 수락되기 전까지 잠겨 있어요 */
export default function UserScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = findPerson(id);
  const following = useFollowStatus(id ?? '') === 'following';
  const posts = useMemo(() => (person ? visiblePostsOf(person, following) : []), [person, following]);

  if (!person) {
    return (
      <ListScreen
        data={[]}
        keyExtractor={() => ''}
        renderItem={() => <View />}
        header={<TopBar title="" fallback="/feed" />}
        empty={<EmptyState body={t('user.notFound')} />}
      />
    );
  }

  const locked = !canSeeAccount(person, following);

  return (
    <ListScreen
      divided
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <TopBar title={`@${person.username}`} fallback="/feed" />
          <ProfileHeader
            displayName={person.displayName}
            username={person.username}
            isPrivate={person.isPrivate}
            privateLabel={t('profile.privateAccount')}
            stats={[
              { label: t('profile.repeats'), value: person.habits.length },
              { label: t('profile.followers'), value: person.followerCount + (following ? 1 : 0) },
              { label: t('profile.following'), value: person.followingCount },
            ]}>
            <View className="flex-row">
              <FollowButton person={person} />
            </View>
          </ProfileHeader>
          {locked ? (
            <View className="items-center gap-2 py-8">
              <Icon as={Lock} className="text-muted-foreground size-6" />
              <Text className="font-semibold">{t('user.lockedTitle')}</Text>
              <Text className="text-muted-foreground text-center">{t('user.locked')}</Text>
            </View>
          ) : null}
        </>
      }
      empty={locked ? undefined : <EmptyState body={t('profile.noPosts')} />}
    />
  );
}
