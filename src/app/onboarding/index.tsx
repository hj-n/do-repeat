import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { LanguageSwitch } from '@/components/language-switch';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { PRESETS, type PresetId } from '@/lib/habits';
import { cn } from '@/lib/utils';
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

  const options: { value: PresetId | typeof CUSTOM; label: string }[] = [
    ...PRESETS.map((id) => ({ value: id, label: t(`presets.${id}`) })),
    { value: CUSTOM, label: t('onboarding.what.custom') },
  ];

  return (
    <Screen
      footer={
        <Button size="lg" disabled={!ready} onPress={next}>
          <Text>{t('common.next')}</Text>
        </Button>
      }>
      <View className="flex-row items-center gap-4">
        <View className="flex-1">
          <StepHeader step={1} total={3} canGoBack={hasHabits} />
        </View>
        <LanguageSwitch />
      </View>

      <View className="gap-2 pt-4">
        <Text className="text-4xl font-extrabold tracking-tight">{t('onboarding.what.title')}</Text>
        <Text className="text-muted-foreground">{t('onboarding.what.subtitle')}</Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = picked === option.value;
          return (
            <Toggle
              key={option.value}
              pressed={selected}
              onPressedChange={() => setPicked(option.value)}
              aria-label={option.label}
              className={cn(
                'rounded-full px-4',
                // hover/active colors too, so the web preview keeps the chosen chip blue under the mouse
                selected
                  ? 'bg-primary hover:bg-primary/90 active:bg-primary/90'
                  : 'bg-secondary hover:bg-secondary/80 active:bg-secondary/80'
              )}>
              <Text
                className={cn(
                  // Toggle passes its own classes to the text too; keep the text background clear
                  'bg-transparent px-0 font-semibold',
                  selected ? 'text-primary-foreground' : 'text-secondary-foreground'
                )}>
                {option.label}
              </Text>
            </Toggle>
          );
        })}
      </View>

      {picked === CUSTOM ? (
        <Input
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
