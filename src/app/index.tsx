import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/app-store';

/** 시작 화면: 반복이 하나라도 있으면 홈, 없으면 온보딩 */
export default function Index() {
  const hasHabits = useAppStore((s) => s.habits.length > 0);
  return <Redirect href={hasHabits ? '/home' : '/onboarding'} />;
}
