import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { habitTitle } from '@/lib/habits';
import { Check } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useCheckInDays, useStreak, type Habit } from '@/store/app-store';

import { WeekLetters } from './week-letters';

/** 홈의 반복 한 줄: 이름 · 이번 주 · N일째 · 체크 버튼 */
export function HabitRow({ habit }: { habit: Habit }) {
  const { t } = useTranslation();
  const days = useCheckInDays(habit.id);
  const streak = useStreak(habit.id);
  const name = habitTitle(habit, t);
  const done = streak.doneToday;

  return (
    <View className="flex-row items-center gap-4 py-4">
      <View className="flex-1 gap-2">
        <View className="flex-row items-baseline gap-2">
          <Text className="shrink-0 text-[17px] font-semibold" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-muted-foreground shrink text-sm" numberOfLines={1}>
            {habit.place?.name ?? t(`method.${habit.method}`)}
          </Text>
        </View>
        <WeekLetters days={days} />
      </View>

      {streak.current > 0 ? (
        <Text className="text-primary text-2xl font-bold tabular-nums">{t('streak.day', { count: streak.current })}</Text>
      ) : (
        <Text className="text-muted-foreground text-sm font-semibold">{t('streak.start')}</Text>
      )}

      <Button
        size="icon"
        variant={done ? 'default' : 'outline'}
        accessibilityLabel={`${name}, ${done ? t('home.checkedIn') : t('home.checkIn')}`}
        accessibilityState={{ disabled: done }}
        className="size-11 rounded-full sm:size-11"
        onPress={() => {
          if (!done) router.push({ pathname: '/check-in/[id]', params: { id: habit.id } });
        }}>
        <Icon as={Check} strokeWidth={2.6} className={cn('size-5', done ? 'text-primary-foreground' : 'text-subtle')} />
      </Button>
    </View>
  );
}
