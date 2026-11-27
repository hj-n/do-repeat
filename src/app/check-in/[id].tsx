import { Redirect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/screen';
import { TopBar } from '@/components/top-bar';
import { LocationCheckIn } from '@/features/check-in/location-check-in';
import { PhotoCheckIn } from '@/features/check-in/photo-check-in';
import { habitTitle } from '@/lib/habits';
import { useHabit } from '@/store/app-store';

/** 오늘 인증하기: 반복의 인증 방법에 맞는 화면을 보여줍니다 */
export default function CheckInScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = useHabit(id);
  if (!habit) return <Redirect href="/home" />;

  return (
    <Screen>
      <TopBar
        title={habit.method === 'location' ? t('checkIn.locationTitle') : t('checkIn.photoTitle')}
        subtitle={habitTitle(habit, t)}
      />
      {habit.method === 'location' ? <LocationCheckIn habit={habit} /> : <PhotoCheckIn habit={habit} />}
    </Screen>
  );
}
