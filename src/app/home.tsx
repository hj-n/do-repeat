import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { HabitCard } from '@/features/habits/habit-card';
import { formatToday } from '@/lib/dates';
import { useAppStore } from '@/store/app-store';

/** 홈: 오늘 날짜와 나의 반복 카드들 */
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const habits = useAppStore((s) => s.habits);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="label" color="textMuted">
            {formatToday(i18n.language)}
          </AppText>
          <AppText variant="display">{t('home.title')}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={styles.settings}>
          <AppText variant="label" color="textMuted">
            {t('home.settings')}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.list}>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </View>

      <Button kind="secondary" label={t('home.addHabit')} onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: Spacing.sm },
  headerText: { flex: 1, gap: Spacing.xs },
  settings: { paddingVertical: Spacing.xs, paddingLeft: Spacing.md },
  list: { gap: Spacing.lg },
});
