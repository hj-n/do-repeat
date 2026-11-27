import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';

type Stat = { label: string; value: number; onPress?: () => void };

type ProfileHeaderProps = {
  displayName: string;
  username: string;
  isPrivate: boolean;
  privateLabel: string;
  stats: Stat[];
  /** 아래 줄 (팔로우 버튼, 편집 등) */
  children?: ReactNode;
};

/** 프로필 위쪽: 동그라미, 이름, @아이디, 숫자들을 한 줄로 */
export function ProfileHeader({ displayName, username, isPrivate, privateLabel, stats, children }: ProfileHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Avatar name={displayName} size={64} />
        <View style={styles.names}>
          <View style={styles.nameLine}>
            <AppText variant="title" numberOfLines={1} style={styles.name}>
              {displayName}
            </AppText>
            {isPrivate ? (
              <View accessible accessibilityLabel={privateLabel}>
                <Icon name="lock" size={16} color="textMuted" strokeWidth={2} />
              </View>
            ) : null}
          </View>
          <AppText color="textMuted" numberOfLines={1}>
            @{username}
          </AppText>
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map((stat) => (
          <Pressable
            key={stat.label}
            disabled={!stat.onPress}
            accessibilityRole={stat.onPress ? 'button' : undefined}
            hitSlop={6}
            onPress={stat.onPress}
            style={styles.stat}>
            <AppText variant="bodyStrong" style={styles.number}>
              {stat.value}
            </AppText>
            <AppText color="textMuted">{stat.label}</AppText>
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
  names: { flex: 1, gap: 2 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  name: { flexShrink: 1 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Spacing.xl, rowGap: Spacing.xs },
  stat: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  number: { fontVariant: ['tabular-nums'] },
});
