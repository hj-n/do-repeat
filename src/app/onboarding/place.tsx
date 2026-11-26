import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { TextField } from '@/components/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { Notice } from '@/features/check-in/notice';
import { useTheme } from '@/hooks/use-theme';
import type { Coordinates } from '@/lib/geo';
import { DEFAULT_RADIUS, isPresetId } from '@/lib/habits';
import { getCurrentPosition, isSimulatedLocation } from '@/lib/location';
import { useAppStore } from '@/store/app-store';

import { finishOnboarding } from '@/features/onboarding/finish';

type Spot = { coords: Coordinates; accuracy: number | null };

/** 온보딩 3단계 (위치 인증): 지금 있는 곳을 내 장소로 등록 */
export default function PlaceScreen() {
  const theme = useTheme();
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
      place: {
        name: name.trim() || t('onboarding.place.defaultName'),
        ...spot.coords,
        radius: DEFAULT_RADIUS,
      },
    });
    finishOnboarding();
  };

  return (
    <Screen footer={<Button label={t('common.start')} disabled={!spot} onPress={start} />}>
      <StepHeader step={3} total={3} />

      <View style={styles.heading}>
        <AppText variant="title">{t('onboarding.place.title')}</AppText>
        <AppText color="textMuted">{t('onboarding.place.subtitle')}</AppText>
      </View>

      <TextField
        label={t('onboarding.place.nameLabel')}
        value={name}
        onChangeText={setName}
        placeholder={t('onboarding.place.namePlaceholder')}
        maxLength={24}
      />

      <View style={[styles.spot, { backgroundColor: theme.surface, borderColor: spot ? theme.accent : theme.border }]}>
        {locating ? (
          <View style={styles.row}>
            <ActivityIndicator color={theme.accent} />
            <AppText color="textMuted">{t('onboarding.place.locating')}</AppText>
          </View>
        ) : spot ? (
          <View style={styles.saved}>
            <AppText variant="bodyStrong" color="accent">
              {t('onboarding.place.saved', { accuracy: Math.round(spot.accuracy ?? 0) })}
            </AppText>
            <AppText variant="label" color="textMuted" style={styles.regular}>
              {t('onboarding.place.radiusNote', { radius: DEFAULT_RADIUS })}
            </AppText>
          </View>
        ) : null}
        <Button
          kind={spot ? 'secondary' : 'primary'}
          label={spot ? t('onboarding.place.relocate') : t('onboarding.place.useCurrent')}
          disabled={locating}
          onPress={locate}
        />
      </View>

      {problem === 'denied' ? (
        <Notice title={t('checkIn.deniedTitle')} body={t('checkIn.denied')} />
      ) : null}
      {problem === 'unavailable' ? (
        <Notice title={t('checkIn.unavailableTitle')} body={t('checkIn.unavailable')} />
      ) : null}

      {isSimulatedLocation ? (
        <AppText variant="caption" color="textMuted">
          {t('settings.previewNote')}
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  spot: { borderWidth: 1.5, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  saved: { gap: Spacing.xs },
  regular: { fontWeight: '400' },
});
