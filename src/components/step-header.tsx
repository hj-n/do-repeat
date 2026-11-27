import { View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Progress } from '@/components/ui/progress';

type StepHeaderProps = {
  /** 지금 단계 (1부터) */
  step: number;
  total: number;
  /** 1단계에서도 뒤로 가기를 보여줄지 (홈에서 "추가"로 들어온 경우) */
  canGoBack?: boolean;
};

/** 온보딩 상단: 뒤로 가기 + 진행 막대 */
export function StepHeader({ step, total, canGoBack = false }: StepHeaderProps) {
  return (
    <View className="min-h-10 flex-row items-center gap-3">
      {step > 1 || canGoBack ? <BackButton /> : <View className="w-8" />}
      <Progress value={(step / total) * 100} className="h-1 flex-1" indicatorClassName="bg-primary" />
    </View>
  );
}
