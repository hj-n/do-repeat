import { router } from 'expo-router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { HabitRow } from '@/features/habits/habit-row';
import { formatToday } from '@/lib/dates';
import { Plus } from '@/lib/icons';
import { useAppStore } from '@/store/app-store';

/** 홈: Do Repeat + 반복 개수, 반복 목록 */
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const habits = useAppStore((s) => s.habits);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View className="gap-1 pt-2">
        <Text className="text-muted-foreground text-sm font-semibold">{formatToday(i18n.language)}</Text>
        <View className="flex-row items-baseline gap-2">
          <Text className="text-4xl font-extrabold tracking-tight">Do Repeat</Text>
          <Text className="text-primary text-4xl font-extrabold tabular-nums">{habits.length}</Text>
        </View>
      </View>

      <View>
        {habits.map((habit, i) => (
          <Fragment key={habit.id}>
            {i > 0 ? <Separator /> : null}
            <HabitRow habit={habit} />
          </Fragment>
        ))}
      </View>

      <Button variant="link" className="self-start px-0" onPress={() => router.push('/onboarding')}>
        <Icon as={Plus} className="text-primary size-4" />
        <Text>{t('home.addHabit')}</Text>
      </Button>
    </Screen>
  );
}
