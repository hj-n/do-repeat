import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import type { VerifyMethod } from '@/lib/habits';

/** 온보딩 2단계: 인증 방법 고르기 */
export default function VerifyMethodScreen() {
  const { t } = useTranslation();
  const { preset, custom } = useLocalSearchParams<{ preset?: string; custom?: string }>();
  const [method, setMethod] = useState<VerifyMethod | undefined>(undefined);

  const next = () => {
    if (!method) return;
    const params = { ...(preset ? { preset } : {}), ...(custom ? { custom } : {}) };
    router.push({ pathname: method === 'location' ? '/onboarding/place' : '/onboarding/ready', params });
  };

  const options: { value: VerifyMethod; title: string; description: string }[] = [
    { value: 'location', title: t('method.location'), description: t('onboarding.method.locationDescription') },
    { value: 'photo', title: t('method.photo'), description: t('onboarding.method.photoDescription') },
  ];

  return (
    <Screen
      footer={
        <Button size="lg" disabled={!method} onPress={next}>
          <Text>{t('common.next')}</Text>
        </Button>
      }>
      <StepHeader step={2} total={3} />
      <Text className="pt-4 text-2xl font-bold tracking-tight">{t('onboarding.method.title')}</Text>

      <RadioGroup value={method ?? ''} onValueChange={(v) => setMethod(v as VerifyMethod)} className="gap-0">
        {options.map((option, i) => (
          <Fragment key={option.value}>
            {i > 0 ? <Separator /> : null}
            <Pressable onPress={() => setMethod(option.value)} className="flex-row items-center gap-4 py-4">
              <View className="flex-1 gap-0.5">
                <Label nativeID={`method-${option.value}`} onPress={() => setMethod(option.value)} className="text-base font-semibold">
                  {option.title}
                </Label>
                <Text className="text-muted-foreground text-sm">{option.description}</Text>
              </View>
              <RadioGroupItem value={option.value} aria-labelledby={`method-${option.value}`} accessibilityLabel={option.title} />
            </Pressable>
          </Fragment>
        ))}
      </RadioGroup>
    </Screen>
  );
}
