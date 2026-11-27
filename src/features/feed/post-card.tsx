import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { timeAgo } from '@/lib/dates';
import { habitTitle } from '@/lib/habits';
import type { CheckInPost, MilestonePost, Post } from '@/lib/posts';

/** 피드 게시물 한 개: 인증 카드 또는 달성 카드 */
export function PostCard({ post }: { post: Post }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const openAuthor = () =>
    post.author.isMe
      ? router.navigate('/profile')
      : router.push({ pathname: '/user/[id]', params: { id: post.author.id } });

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable accessibilityRole="link" onPress={openAuthor} style={styles.header}>
        <Avatar name={post.author.displayName} size={36} />
        <View style={styles.names}>
          <AppText variant="label" numberOfLines={1}>
            {post.author.displayName}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            @{post.author.username} · {timeAgo(post.at, t, i18n.language)}
          </AppText>
        </View>
        {post.author.isMe && post.visibility === 'private' ? (
          <View style={[styles.chip, { backgroundColor: theme.surfaceMuted }]}>
            <Icon name="lock" size={12} color="textMuted" strokeWidth={2} />
            <AppText variant="caption" color="textMuted">
              {t('feed.onlyMe')}
            </AppText>
          </View>
        ) : null}
      </Pressable>

      {post.kind === 'checkIn' ? <CheckInBody post={post} /> : <MilestoneBody post={post} />}
    </View>
  );
}

function CheckInBody({ post }: { post: CheckInPost }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const habit = habitTitle(post.habit, t);

  return (
    <View style={styles.body}>
      {post.method === 'photo' && post.photo ? (
        <Image
          source={post.photo}
          style={styles.photo}
          resizeMode="cover"
          accessibilityLabel={t('feed.photoCheckIn')}
        />
      ) : (
        <View style={[styles.panel, { backgroundColor: theme.accentSoft }]}>
          {post.method === 'location' ? (
            <>
              <View style={[styles.ring, styles.ringOuter, { borderColor: theme.accent }]} />
              <View style={[styles.ring, styles.ringInner, { borderColor: theme.accent }]} />
              <View style={[styles.pin, { backgroundColor: theme.accent }]}>
                <Icon name="pin" size={22} color="onAccent" strokeWidth={2} />
              </View>
            </>
          ) : (
            <Icon name="camera" size={32} color="accent" />
          )}
        </View>
      )}
      <View style={styles.caption}>
        <AppText variant="bodyStrong">{t('feed.streakCaption', { habit, days: post.days })}</AppText>
        <AppText variant="label" color="textMuted" style={styles.regular}>
          {post.method === 'location' && post.placeName
            ? t('feed.checkInAt', { place: post.placeName })
            : t('feed.photoCheckIn')}
        </AppText>
      </View>
    </View>
  );
}

function MilestoneBody({ post }: { post: MilestonePost }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const habit = habitTitle(post.habit, t);

  return (
    <View style={styles.body}>
      <View style={[styles.milestone, { backgroundColor: theme.accent }]}>
        <Icon name="flag" size={22} color="onAccent" strokeWidth={2} />
        <AppText color="onAccent" style={styles.milestoneNumber}>
          {post.days}
        </AppText>
        <AppText variant="label" color="onAccent">
          {t('feed.milestoneUnit')}
        </AppText>
      </View>
      <AppText variant="bodyStrong" style={styles.caption}>
        {post.author.isMe
          ? t('feed.milestoneMine', { habit, days: post.days })
          : t('feed.milestone', { name: post.author.displayName, habit, days: post.days })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  names: { flex: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  body: { gap: Spacing.md },
  photo: { width: '100%', aspectRatio: 4 / 5, borderRadius: Radius.md },
  panel: {
    height: 168,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: { position: 'absolute', borderWidth: 1, opacity: 0.25 },
  ringOuter: { width: 220, height: 220, borderRadius: 110 },
  ringInner: { width: 130, height: 130, borderRadius: 65 },
  pin: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  caption: { gap: 2 },
  regular: { fontWeight: '400' },
  milestone: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  milestoneNumber: { fontSize: 64, lineHeight: 70, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
