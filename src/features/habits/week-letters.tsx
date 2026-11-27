import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { weekdayInitial } from '@/lib/dates';
import { thisWeek, toDateKey, type DateKey } from '@/lib/streak';
import { cn } from '@/lib/utils';

/** 이번 주 요일 글자: 한 날은 대표 색, 안 한 날은 회색, 아직 안 온 날은 더 옅게, 오늘은 밑줄 */
export function WeekLetters({ days }: { days: DateKey[] }) {
  const { t, i18n } = useTranslation();
  const done = new Set(days);
  const today = toDateKey();
  const week = thisWeek(today);

  return (
    <View
      className="flex-row items-center gap-1"
      accessible
      accessibilityLabel={t('home.thisWeekCount', { count: week.filter((d) => done.has(d)).length })}>
      <Text className="text-muted-foreground mr-1 shrink-0 text-xs font-medium" numberOfLines={1}>
        {t('home.thisWeek')}
      </Text>
      {week.map((day) => (
        <Text
          key={day}
          className={cn(
            'w-3 text-center text-xs font-medium',
            done.has(day) ? 'text-primary font-extrabold' : day > today ? 'text-subtle' : 'text-muted-foreground',
            day === today && 'underline'
          )}>
          {weekdayInitial(day, i18n.language)}
        </Text>
      ))}
    </View>
  );
}
