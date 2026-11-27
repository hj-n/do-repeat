import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StepHeaderProps = {
  /** 지금 단계 (1부터) */
  step: number;
  total: number;
  /** 1단계에서도 뒤로 가기를 보여줄지 (홈에서 "새 반복 추가"로 들어온 경우) */
  canGoBack?: boolean;
};

/** 온보딩 상단: 뒤로 가기 + 진행 막대 */
export function StepHeader({ step, total, canGoBack = false }: StepHeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {step > 1 || canGoBack ? <BackButton /> : <View style={styles.spacer} />}
      <View style={styles.bars}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: i < step ? theme.accent : theme.surfaceMuted }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 40, paddingRight: 28 },
  spacer: { width: 28 },
  bars: { flex: 1, flexDirection: 'row', gap: Spacing.xs },
  bar: { flex: 1, height: 3, borderRadius: Radius.pill },
});
