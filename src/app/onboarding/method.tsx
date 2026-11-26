import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { OptionCard } from '@/components/option-card';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Spacing } from '@/constants/theme';
import { withObjectParticle } from '@/lib/korean';

export type VerifyMethod = 'location' | 'photo';

const METHODS: { id: VerifyMethod; badge: string; title: string; description: string }[] = [
  {
    id: 'location',
    badge: '위치',
    title: '위치 인증',
    description: '정해둔 장소에서 앱을 열고 인증 버튼만 누르면 돼요.',
  },
  {
    id: 'photo',
    badge: '사진',
    title: '사진 인증',
    description: '그 자리에서 사진을 찍어 올리면 인증돼요.',
  },
];

/** 온보딩 2단계: 인증 방법 고르기 */
export default function VerifyMethodScreen() {
  const { habit = '운동' } = useLocalSearchParams<{ habit?: string }>();
  const [method, setMethod] = useState<VerifyMethod | null>(null);

  return (
    <Screen
      footer={
        <Button
          label="다음"
          disabled={!method}
          onPress={() =>
            method && router.push({ pathname: '/onboarding/ready', params: { habit, method } })
          }
        />
      }>
      <StepHeader step={2} total={3} />

      <View style={styles.heading}>
        <AppText variant="title">어떻게 인증할까요?</AppText>
        <AppText color="textMuted">
          {withObjectParticle(habit)} 했다는 걸 어떻게 보여줄지 정해주세요.
        </AppText>
      </View>

      <View style={styles.options}>
        {METHODS.map((m) => (
          <OptionCard
            key={m.id}
            badge={m.badge}
            title={m.title}
            description={m.description}
            selected={method === m.id}
            onPress={() => setMethod(m.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  options: { gap: Spacing.md },
});
