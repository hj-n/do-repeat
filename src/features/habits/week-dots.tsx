import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { lastDays, toDateKey, type DateKey } from '@/lib/streak';

/** 최근 7일을 작은 점으로: 한 날은 진한 점, 안 한 날은 옅은 점 */
export function WeekDots({ days }: { days: DateKey[] }) {
  const theme = useTheme();
  const done = new Set(days);
  return (
    <View style={styles.row} accessible={false}>
      {lastDays(7, toDateKey()).map((day) => (
        <View
          key={day}
          style={[styles.dot, { backgroundColor: done.has(day) ? theme.accent : theme.surfaceMuted }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
