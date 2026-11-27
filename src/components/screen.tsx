import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { SafeAreaView } from '@/components/safe-area-view';

type ScreenProps = {
  children: ReactNode;
  /** 화면 아래에 고정되는 영역 (주로 "다음" 버튼) */
  footer?: ReactNode;
  /** 안전 영역을 적용할 가장자리 (탭 화면은 아래를 탭 막대가 처리) */
  edges?: Edge[];
};

/** 모든 화면의 바탕: 안전 영역, 좌우 여백, 아래 고정 버튼 자리 */
export function Screen({ children, footer, edges }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className="bg-background flex-1">
      <ScrollView
        contentContainerClassName="grow items-center px-6 pb-6 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[480px] gap-6">{children}</View>
      </ScrollView>
      {footer ? <View className="w-full max-w-[480px] self-center px-6 pb-4 pt-2">{footer}</View> : null}
    </SafeAreaView>
  );
}
