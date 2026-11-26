import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { dayOfMonth, weekdayInitial } from '@/lib/dates';
import { lastDays, toDateKey, type DateKey } from '@/lib/streak';

/** 최근 7일: 인증한 날은 꽉 찬 도장, 오늘은 테두리, 빠진 날은 옅은 원 */
export function WeekStrip({ days }: { days: DateKey[] }) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const done = new Set(days);
  const today = toDateKey();

  return (
    <View style={styles.row}>
      {lastDays(7, today).map((day) => {
        const checked = done.has(day);
        const isToday = day === today;
        return (
          <View key={day} style={styles.cell}>
            <AppText variant="caption" color={isToday ? 'text' : 'textMuted'}>
              {weekdayInitial(day, i18n.language)}
            </AppText>
            <View
              accessibilityLabel={`${day}${checked ? ' ✓' : ''}`}
              style={[
                styles.dot,
                checked
                  ? { backgroundColor: theme.accent }
                  : isToday
                    ? { borderWidth: 2, borderColor: theme.accent }
                    : { backgroundColor: theme.surfaceMuted },
              ]}>
              <AppText
                variant="label"
                color={checked ? 'onAccent' : isToday ? 'accent' : 'textMuted'}
                style={styles.date}>
                {dayOfMonth(day)}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { alignItems: 'center', gap: Spacing.xs },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: { fontVariant: ['tabular-nums'] },
});
