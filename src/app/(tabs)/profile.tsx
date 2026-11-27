import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PostCard } from '@/features/feed/post-card';
import { useMe, useMyPosts } from '@/features/feed/use-feed';
import { ProfileHeader } from '@/features/social/profile-header';
import { Settings } from '@/lib/icons';
import { useAppStore } from '@/store/app-store';

/** 내 프로필: 이름, 숫자, 내 기록 */
export default function ProfileScreen() {
  const { t } = useTranslation();
  const me = useMe();
  const posts = useMyPosts();
  const profile = useAppStore((s) => s.profile);
  const social = useAppStore((s) => s.social);
  const habitCount = useAppStore((s) => s.habits.length);

  return (
    <ListScreen
      edges={['top', 'left', 'right']}
      divided
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <View className="flex-row justify-end">
            <Button variant="ghost" size="icon" accessibilityLabel={t('settings.title')} onPress={() => router.push('/settings')}>
              <Icon as={Settings} className="size-6" />
            </Button>
          </View>
          <ProfileHeader
            displayName={me.displayName}
            username={me.username}
            isPrivate={profile.isPrivate}
            privateLabel={t('profile.privateAccount')}
            stats={[
              { label: t('profile.repeats'), value: habitCount, onPress: () => router.navigate('/home') },
              {
                label: t('profile.followers'),
                value: social.followers.length,
                onPress: () => router.push({ pathname: '/follows', params: { tab: 'followers' } }),
              },
              {
                label: t('profile.following'),
                value: social.following.length,
                onPress: () => router.push({ pathname: '/follows', params: { tab: 'following' } }),
              },
            ]}>
            <View className="flex-row items-center gap-4">
              <Button variant="secondary" size="sm" className="rounded-full px-4" onPress={() => router.push('/profile-edit')}>
                <Text>{t('profile.edit')}</Text>
              </Button>
              {social.incoming.length > 0 ? (
                <Button variant="link" size="sm" className="px-0" onPress={() => router.push('/requests')}>
                  <Text>{t('profile.requests', { count: social.incoming.length })}</Text>
                </Button>
              ) : null}
            </View>
          </ProfileHeader>
        </>
      }
      empty={<EmptyState body={t('profile.noPosts')} />}
    />
  );
}
