import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { OptionCard } from '@/components/option-card';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Spacing } from '@/constants/theme';
import { habitTitle, isPresetId, type VerifyMethod } from '@/lib/habits';

/** 온보딩 2단계: 인증 방법 고르기 */
export default function VerifyMethodScreen() {
  const { t } = useTranslation();
  const { preset, custom } = useLocalSearchParams<{ preset?: string; custom?: string }>();
  const [method, setMethod] = useState<VerifyMethod | null>(null);
  const name = habitTitle({ preset: isPresetId(preset) ? preset : undefined, customTitle: custom }, t);

  const next = () => {
    if (!method) return;
    const params = { ...(preset ? { preset } : {}), ...(custom ? { custom } : {}) };
    router.push({
      pathname: method === 'location' ? '/onboarding/place' : '/onboarding/ready',
      params,
    });
  };

  return (
    <Screen footer={<Button label={t('common.next')} disabled={!method} onPress={next} />}>
      <StepHeader step={2} total={3} />

      <View style={styles.heading}>
        <AppText variant="title">{t('onboarding.method.title')}</AppText>
        <AppText color="textMuted">{t('onboarding.method.subtitle', { habit: name })}</AppText>
      </View>

      <View style={styles.options}>
        <OptionCard
          badge={t('method.location')}
          title={t('onboarding.method.locationTitle')}
          description={t('onboarding.method.locationDescription')}
          selected={method === 'location'}
          onPress={() => setMethod('location')}
        />
        <OptionCard
          badge={t('method.photo')}
          title={t('onboarding.method.photoTitle')}
          description={t('onboarding.method.photoDescription')}
          selected={method === 'photo'}
          onPress={() => setMethod('photo')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  options: { gap: Spacing.md },
});
