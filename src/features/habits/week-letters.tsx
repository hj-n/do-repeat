import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Spacing } from '@/constants/theme';
import { weekdayInitial } from '@/lib/dates';
import { thisWeek, toDateKey, type DateKey } from '@/lib/streak';

/** 이번 주 요일 글자: 한 날은 대표 색, 안 한 날은 회색, 아직 안 온 날은 더 옅게 */
export function WeekLetters({ days }: { days: DateKey[] }) {
  const { t, i18n } = useTranslation();
  const done = new Set(days);
  const today = toDateKey();
  const week = thisWeek(today);
  const doneCount = week.filter((d) => done.has(d)).length;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={t('home.thisWeekCount', { count: doneCount })}>
      <AppText variant="caption" color="textMuted" style={styles.label} numberOfLines={1}>
        {t('home.thisWeek')}
      </AppText>
      {week.map((day) => {
        const checked = done.has(day);
        const future = day > today;
        return (
          <AppText
            key={day}
            variant="caption"
            color={checked ? 'accent' : future ? 'border' : 'textMuted'}
            style={[styles.letter, checked && styles.checked, day === today && styles.today]}>
            {weekdayInitial(day, i18n.language)}
          </AppText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { marginRight: Spacing.xs, flexShrink: 0 },
  letter: { width: 12, textAlign: 'center' },
  checked: { fontWeight: '800' },
  today: { textDecorationLine: 'underline' },
});
