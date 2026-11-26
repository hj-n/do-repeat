import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StepHeaderProps = {
  /** 지금 단계 (1부터) */
  step: number;
  total: number;
  /** 뒤로 가기 버튼 표시 여부 */
  canGoBack?: boolean;
};

/** 온보딩 상단: 뒤로 가기 + 진행 막대 */
export function StepHeader({ step, total, canGoBack = true }: StepHeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {canGoBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          hitSlop={12}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={styles.back}>
          <AppText variant="title" color="textMuted">
            ‹
          </AppText>
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}
      <View style={styles.bars}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              { backgroundColor: i < step ? theme.accent : theme.surfaceMuted },
            ]}
          />
        ))}
      </View>
      <AppText variant="caption" color="textMuted" style={styles.count}>
        {step} / {total}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 40 },
  back: { width: 28, alignItems: 'flex-start' },
  bars: { flex: 1, flexDirection: 'row', gap: Spacing.xs },
  bar: { flex: 1, height: 4, borderRadius: Radius.pill },
  count: { width: 32, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
