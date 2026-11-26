import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { habitTitle } from '@/lib/habits';
import { useCheckInDays, useStreak, type Habit } from '@/store/app-store';

import { WeekStrip } from './week-strip';

/** 홈 화면의 반복 카드: D+N, 최근 7일, 오늘 인증 버튼 */
export function HabitCard({ habit }: { habit: Habit }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const days = useCheckInDays(habit.id);
  const streak = useStreak(habit.id);

  const status = streak.doneToday
    ? null
    : streak.broken
      ? t('home.statusBroken')
      : streak.total === 0
        ? t('home.statusNew')
        : t('home.statusPending');

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.top}>
        <View style={styles.titles}>
          <AppText variant="title" numberOfLines={1}>
            {habitTitle(habit, t)}
          </AppText>
          {habit.place ? (
            <AppText variant="label" color="textMuted" numberOfLines={1} style={styles.regular}>
              {t('home.atPlace', { place: habit.place.name })}
            </AppText>
          ) : null}
        </View>
        <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
          <AppText variant="caption" color="accent">
            {t(`method.${habit.method}`)}
          </AppText>
        </View>
      </View>

      <View>
        <AppText variant="display" color="accent" style={styles.count}>
          D+{streak.current}
        </AppText>
        <AppText variant="label" color="textMuted" style={styles.regular}>
          {t('home.best', { count: streak.best })} · {t('home.total', { count: streak.total })}
        </AppText>
      </View>

      <WeekStrip days={days} />

      <View style={styles.footer}>
        {status ? (
          <AppText variant="label" color={streak.broken ? 'danger' : 'textMuted'} style={styles.regular}>
            {status}
          </AppText>
        ) : null}
        <Button
          label={streak.doneToday ? t('home.checkedIn') : t('home.checkIn')}
          disabled={streak.doneToday}
          onPress={() => router.push({ pathname: '/check-in/[id]', params: { id: habit.id } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.xl, gap: Spacing.xl },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  titles: { flex: 1, gap: 2 },
  pill: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  count: { fontSize: 64, lineHeight: 72, fontVariant: ['tabular-nums'] },
  regular: { fontWeight: '400' },
  footer: { gap: Spacing.md },
});
