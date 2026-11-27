import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ListScreen } from '@/components/list-screen';
import { Spacing } from '@/constants/theme';
import { PostCard } from '@/features/feed/post-card';
import { useMe, useMyPosts } from '@/features/feed/use-feed';
import { ProfileHeader } from '@/features/social/profile-header';
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
      gap={Spacing.xl}
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <View style={styles.topRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('settings.title')}
              hitSlop={10}
              onPress={() => router.push('/settings')}>
              <Icon name="settings" />
            </Pressable>
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
            <View style={styles.actions}>
              <Button kind="secondary" size="small" label={t('profile.edit')} onPress={() => router.push('/profile-edit')} />
              {social.incoming.length > 0 ? (
                <Button
                  kind="text"
                  label={t('profile.requests', { count: social.incoming.length })}
                  onPress={() => router.push('/requests')}
                />
              ) : null}
            </View>
          </ProfileHeader>
        </>
      }
      empty={<EmptyState body={t('profile.noPosts')} />}
    />
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: Spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
});
