import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ListScreen } from '@/components/list-screen';
import { TopBar } from '@/components/top-bar';
import { Spacing } from '@/constants/theme';
import { canSeeAccount, findPerson } from '@/data/sample-people';
import { PostCard } from '@/features/feed/post-card';
import { visiblePostsOf } from '@/features/feed/use-feed';
import { FollowButton } from '@/features/social/follow-button';
import { ProfileHeader } from '@/features/social/profile-header';
import { useFollowStatus } from '@/store/app-store';

/** 다른 사람 프로필: 비공개 계정은 팔로우가 수락되기 전까지 잠겨 있어요 */
export default function UserScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = findPerson(id);
  const status = useFollowStatus(id ?? '');
  const following = status === 'following';
  const posts = useMemo(() => (person ? visiblePostsOf(person, following) : []), [person, following]);

  if (!person) {
    return (
      <ListScreen
        data={[]}
        keyExtractor={() => ''}
        renderItem={() => <View />}
        header={<TopBar title="" />}
        empty={<EmptyState body={t('user.notFound')} />}
      />
    );
  }

  const locked = !canSeeAccount(person, following);

  return (
    <ListScreen
      divided
      gap={Spacing.xl}
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
            <View style={styles.follow}>
              <FollowButton person={person} />
            </View>
          </ProfileHeader>
          {locked ? (
            <View style={styles.locked}>
              <Icon name="lock" size={24} color="textMuted" />
              <AppText variant="bodyStrong">{t('user.lockedTitle')}</AppText>
              <AppText color="textMuted" style={styles.center}>
                {t('user.locked')}
              </AppText>
            </View>
          ) : null}
        </>
      }
      empty={locked ? undefined : <EmptyState body={t('profile.noPosts')} />}
    />
  );
}

const styles = StyleSheet.create({
  follow: { flexDirection: 'row' },
  locked: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xxl },
  center: { textAlign: 'center' },
});
