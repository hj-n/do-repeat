import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Spacing } from '@/constants/theme';
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
    <Screen footer={<Button label={t('common.start')} onPress={start} />}>
      <StepHeader step={3} total={3} />

      <View style={styles.heading}>
        <AppText variant="title">{t('onboarding.ready.title')}</AppText>
        <AppText color="textMuted">{t('onboarding.ready.subtitle')}</AppText>
      </View>

      <View style={styles.summary}>
        <AppText variant="display">{habitTitle(draft, t)}</AppText>
        <AppText color="textMuted">{t('onboarding.method.photoDescription')}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  summary: { paddingTop: Spacing.xl, gap: Spacing.xs },
});
