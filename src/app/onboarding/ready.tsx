import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { finishOnboarding } from '@/features/onboarding/finish';
import { habitTitle, isPresetId } from '@/lib/habits';
import { useAppStore } from '@/store/app-store';

/** 온보딩 3단계 (사진 인증): 확인하고 시작 */
export default function ReadyScreen() {
  const { t } = useTranslation();
  const { preset, custom } = useLocalSearchParams<{ preset?: string; custom?: string }>();
  const addHabit = useAppStore((s) => s.addHabit);
  const draft = { preset: isPresetId(preset) ? preset : undefined, customTitle: custom };

  const start = () => {
    addHabit({ ...draft, method: 'photo' });
    finishOnboarding();
  };

  return (
    <Screen
      footer={
        <Button size="lg" onPress={start}>
          <Text>{t('common.start')}</Text>
        </Button>
      }>
      <StepHeader step={3} total={3} />
      <View className="gap-2 pt-4">
        <Text className="text-2xl font-bold tracking-tight">{t('onboarding.ready.title')}</Text>
        <Text className="text-muted-foreground">{t('onboarding.ready.subtitle')}</Text>
      </View>
      <View className="gap-1 pt-6">
        <Text className="text-4xl font-extrabold tracking-tight">{habitTitle(draft, t)}</Text>
        <Text className="text-muted-foreground">{t('onboarding.method.photoDescription')}</Text>
      </View>
    </Screen>
  );
}
