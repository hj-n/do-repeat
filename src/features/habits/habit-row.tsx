import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { habitTitle } from '@/lib/habits';
import { useCheckInDays, useStreak, type Habit } from '@/store/app-store';

import { WeekDots } from './week-dots';

/** 홈의 반복 한 줄: 이름 · 최근 7일 · D+N · 체크 버튼 */
export function HabitRow({ habit }: { habit: Habit }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const days = useCheckInDays(habit.id);
  const streak = useStreak(habit.id);
  const name = habitTitle(habit, t);
  const done = streak.doneToday;

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <AppText variant="bodyStrong" style={styles.name} numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="label" color="textMuted" numberOfLines={1} style={styles.regular}>
          {habit.place?.name ?? t(`method.${habit.method}`)}
        </AppText>
        <WeekDots days={days} />
      </View>

      <AppText variant="title" color={streak.current > 0 ? 'accent' : 'textMuted'} style={styles.count}>
        D+{streak.current}
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${done ? t('home.checkedIn') : t('home.checkIn')}`}
        accessibilityState={{ disabled: done }}
        disabled={done}
        hitSlop={6}
        onPress={() => router.push({ pathname: '/check-in/[id]', params: { id: habit.id } })}
        style={({ pressed }) => [
          styles.check,
          done ? { backgroundColor: theme.accent } : { borderWidth: 1.5, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <Icon
          name="check"
          size={20}
          color={done ? 'onAccent' : 'border'}
          strokeWidth={done ? 2.6 : 2.2}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing.lg },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 17 },
  regular: { fontWeight: '400' },
  count: { fontVariant: ['tabular-nums'] },
  check: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
