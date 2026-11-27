import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { LanguageSwitch } from '@/components/language-switch';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';
import { PRESETS, type PresetId } from '@/lib/habits';
import { useAppStore } from '@/store/app-store';

const CUSTOM = 'custom';

/** 온보딩 1단계: 무엇을 반복할지 고르기 */
export default function WhatDoYouRepeat() {
  const { t } = useTranslation();
  const [picked, setPicked] = useState<PresetId | typeof CUSTOM | null>(null);
  const [custom, setCustom] = useState('');
  const hasHabits = useAppStore((s) => s.habits.length > 0);

  const ready = picked !== null && (picked !== CUSTOM || custom.trim().length > 0);
  const next = () => {
    if (!ready) return;
    const params = picked === CUSTOM ? { custom: custom.trim() } : { preset: picked };
    router.push({ pathname: '/onboarding/method', params });
  };

  return (
    <Screen footer={<Button label={t('common.next')} disabled={!ready} onPress={next} />}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <StepHeader step={1} total={3} canGoBack={hasHabits} />
        </View>
        <LanguageSwitch />
      </View>

      <View style={styles.heading}>
        <AppText variant="display">{t('onboarding.what.title')}</AppText>
        <AppText color="textMuted">{t('onboarding.what.subtitle')}</AppText>
      </View>

      <View style={styles.chips}>
        {PRESETS.map((id) => (
          <Chip
            key={id}
            label={t(`presets.${id}`)}
            selected={picked === id}
            onPress={() => setPicked(id)}
          />
        ))}
        <Chip
          label={t('onboarding.what.custom')}
          selected={picked === CUSTOM}
          onPress={() => setPicked(CUSTOM)}
        />
      </View>

      {picked === CUSTOM ? (
        <TextField
          autoFocus
          value={custom}
          onChangeText={setCustom}
          placeholder={t('onboarding.what.customPlaceholder')}
          maxLength={30}
          returnKeyType="next"
          onSubmitEditing={next}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  flex: { flex: 1 },
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
