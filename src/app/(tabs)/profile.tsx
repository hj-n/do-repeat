import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ListScreen } from '@/components/list-screen';
import { Spacing } from '@/constants/theme';
import { PostCard } from '@/features/feed/post-card';
import { useMe, useMyPosts } from '@/features/feed/use-feed';
import { LinkRow } from '@/features/social/link-row';
import { ProfileHeader } from '@/features/social/profile-header';
import { useAppStore } from '@/store/app-store';

/** 내 프로필: 정보, 팔로워/팔로잉, 공개 범위, 내 인증 기록 */
export default function ProfileScreen() {
  const { t } = useTranslation();
  const me = useMe();
  const posts = useMyPosts();
  const profile = useAppStore((s) => s.profile);
  const social = useAppStore((s) => s.social);
  const habitCount = useAppStore((s) => s.habits.length);
  const label = (v: 'public' | 'private') => (v === 'public' ? t('profile.public') : t('profile.private'));

  return (
    <ListScreen
      edges={['top', 'left', 'right']}
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={(post) => <PostCard post={post} />}
      header={
        <>
          <View style={styles.topRow}>
            <AppText variant="label" color="textMuted" style={styles.flex}>
              {t('profile.title')}
            </AppText>
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
            <Button kind="secondary" size="small" label={t('profile.edit')} onPress={() => router.push('/profile-edit')} />
          </ProfileHeader>

          {social.incoming.length > 0 ? (
            <LinkRow label={t('profile.requests')} badge={social.incoming.length} onPress={() => router.push('/requests')} />
          ) : null}
          <LinkRow
            label={t('settings.privacy')}
            value={t('profile.visibility', {
              checkIn: label(profile.checkInVisibility),
              milestone: label(profile.milestoneVisibility),
            })}
            onPress={() => router.push('/settings')}
          />

          <AppText variant="label" color="textMuted" style={styles.section}>
            {t('profile.posts')}
          </AppText>
        </>
      }
      empty={<EmptyState body={t('profile.noPosts')} />}
    />
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm },
  flex: { flex: 1 },
  section: { marginTop: Spacing.sm, marginBottom: -Spacing.sm },
});
