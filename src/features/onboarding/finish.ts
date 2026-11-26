import { router } from 'expo-router';

/** 온보딩을 마치고 홈으로 (온보딩 화면들은 뒤로 가기 기록에서 지웁니다) */
export function finishOnboarding() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/home');
}
