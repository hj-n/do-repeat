import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Notice } from '@/features/check-in/notice';
import { finishOnboarding } from '@/features/onboarding/finish';
import type { Coordinates } from '@/lib/geo';
import { DEFAULT_RADIUS, isPresetId } from '@/lib/habits';
import { MapPin } from '@/lib/icons';
import { getCurrentPosition, isSimulatedLocation } from '@/lib/location';
import { useAppStore } from '@/store/app-store';

type Spot = { coords: Coordinates; accuracy: number | null };

/** 온보딩 3단계 (위치 인증): 지금 있는 곳을 내 장소로 저장 */
export default function PlaceScreen() {
  const { t } = useTranslation();
  const { preset, custom } = useLocalSearchParams<{ preset?: string; custom?: string }>();
  const addHabit = useAppStore((s) => s.addHabit);
  const [name, setName] = useState('');
  const [spot, setSpot] = useState<Spot | null>(null);
  const [locating, setLocating] = useState(false);
  const [problem, setProblem] = useState<'denied' | 'unavailable' | null>(null);

  const locate = async () => {
    setLocating(true);
    setProblem(null);
    const result = await getCurrentPosition('register');
    setLocating(false);
    if (result.ok) setSpot({ coords: result.coords, accuracy: result.accuracy });
    else setProblem(result.reason);
  };

  const start = () => {
    if (!spot) return;
    addHabit({
      preset: isPresetId(preset) ? preset : undefined,
      customTitle: custom,
      method: 'location',
      place: { name: name.trim() || t('onboarding.place.defaultName'), ...spot.coords, radius: DEFAULT_RADIUS },
    });
    finishOnboarding();
  };

  const radiusNote = t('onboarding.place.radiusNote', { radius: DEFAULT_RADIUS });

  return (
    <Screen
      footer={
        <Button size="lg" disabled={!spot} onPress={start}>
          <Text>{t('common.start')}</Text>
        </Button>
      }>
      <StepHeader step={3} total={3} />

      <View className="gap-2 pt-4">
        <Text className="text-2xl font-bold tracking-tight">{t('onboarding.place.title')}</Text>
        <Text className="text-muted-foreground">{t('onboarding.place.subtitle')}</Text>
      </View>

      <View className="gap-2">
        <Label nativeID="place-name">{t('onboarding.place.nameLabel')}</Label>
        <Input
          aria-labelledby="place-name"
          accessibilityLabel={t('onboarding.place.nameLabel')}
          value={name}
          onChangeText={setName}
          placeholder={t('onboarding.place.namePlaceholder')}
          maxLength={24}
        />
      </View>

      <View className="gap-2">
        {locating ? (
          <View className="min-h-11 flex-row items-center gap-2">
            <ActivityIndicator colorClassName="accent-primary" />
            <Text className="text-muted-foreground">{t('onboarding.place.locating')}</Text>
          </View>
        ) : spot ? (
          <View className="min-h-11 flex-row items-center gap-2">
            <Icon as={MapPin} className="text-primary size-5" />
            <Text className="text-primary flex-1 font-semibold">
              {t('onboarding.place.saved', { accuracy: Math.round(spot.accuracy ?? 0) })}
            </Text>
            <Button variant="link" className="px-0" onPress={locate}>
              <Text>{t('onboarding.place.relocate')}</Text>
            </Button>
          </View>
        ) : (
          <Button size="lg" variant="secondary" onPress={locate}>
            <Text>{t('onboarding.place.useCurrent')}</Text>
          </Button>
        )}
        <Text className="text-muted-foreground text-xs">
          {isSimulatedLocation ? `${radiusNote} · ${t('settings.previewNote')}` : radiusNote}
        </Text>
      </View>

      {problem === 'denied' ? <Notice title={t('checkIn.deniedTitle')} body={t('checkIn.denied')} /> : null}
      {problem === 'unavailable' ? <Notice title={t('checkIn.unavailableTitle')} body={t('checkIn.unavailable')} /> : null}
    </Screen>
  );
}
