import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Stat = { label: string; value: number; onPress?: () => void };

type ProfileHeaderProps = {
  displayName: string;
  username: string;
  isPrivate: boolean;
  privateLabel: string;
  stats: Stat[];
  /** 이름 아래 버튼 자리 (팔로우, 프로필 편집) */
  children?: ReactNode;
};

/** 프로필 위쪽: 동그라미, 이름, @아이디, 반복/팔로워/팔로잉 수 */
export function ProfileHeader({ displayName, username, isPrivate, privateLabel, stats, children }: ProfileHeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Avatar name={displayName} size={72} />
        <View style={styles.names}>
          <AppText variant="title" numberOfLines={1}>
            {displayName}
          </AppText>
          <AppText color="textMuted" numberOfLines={1}>
            @{username}
          </AppText>
          {isPrivate ? (
            <View style={[styles.chip, { backgroundColor: theme.surfaceMuted }]}>
              <Icon name="lock" size={12} color="textMuted" strokeWidth={2} />
              <AppText variant="caption" color="textMuted">
                {privateLabel}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.stats, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {stats.map((stat, i) => (
          <Pressable
            key={stat.label}
            disabled={!stat.onPress}
            accessibilityRole={stat.onPress ? 'button' : undefined}
            onPress={stat.onPress}
            style={[styles.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.border }]}>
            <AppText variant="title" style={styles.number}>
              {stat.value}
            </AppText>
            <AppText variant="caption" color="textMuted">
              {stat.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  names: { flex: 1, gap: 2, alignItems: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: Spacing.xs,
  },
  stats: { flexDirection: 'row', borderWidth: 1, borderRadius: Radius.lg },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, gap: 2 },
  number: { fontVariant: ['tabular-nums'] },
});
