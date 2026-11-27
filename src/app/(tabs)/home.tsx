import { router } from 'expo-router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { HabitRow } from '@/features/habits/habit-row';
import { formatToday } from '@/lib/dates';
import { useAppStore } from '@/store/app-store';

/** 홈: 오늘 날짜와 반복 목록 */
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const habits = useAppStore((s) => s.habits);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <AppText variant="label" color="textMuted">
          {formatToday(i18n.language)}
        </AppText>
        <View style={styles.titleRow}>
          <AppText variant="display">Do Repeat</AppText>
          <AppText variant="display" color="accent" style={styles.count}>
            {habits.length}
          </AppText>
        </View>
      </View>

      <View>
        {habits.map((habit, i) => (
          <Fragment key={habit.id}>
            {i > 0 ? <Divider /> : null}
            <HabitRow habit={habit} />
          </Fragment>
        ))}
      </View>

      <Button kind="text" label={`+ ${t('home.addHabit')}`} onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.xs, paddingTop: Spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  count: { fontVariant: ['tabular-nums'] },
});
