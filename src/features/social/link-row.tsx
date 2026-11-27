import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 눌러서 다른 화면으로 가는 한 줄 (예: 팔로우 요청 2 ›) */
export function LinkRow({ label, value, badge, onPress }: { label: string; value?: string; badge?: number; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <AppText variant="bodyStrong" style={styles.label}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="label" color="textMuted" style={styles.value} numberOfLines={1}>
          {value}
        </AppText>
      ) : null}
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <AppText variant="caption" color="onAccent">
            {badge}
          </AppText>
        </View>
      ) : null}
      <AppText variant="title" color="textMuted" style={styles.chevron}>
        ›
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  label: { flexShrink: 0 },
  value: { flex: 1, textAlign: 'right', fontWeight: '400' },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  chevron: { lineHeight: 26 },
});
