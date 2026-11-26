import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { habitTitle, isPresetId } from '@/lib/habits';
import { useAppStore } from '@/store/app-store';

import { finishOnboarding } from '@/features/onboarding/finish';

/** 온보딩 3단계 (사진 인증): 확인하고 시작 */
export default function ReadyScreen() {
  const theme = useTheme();
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

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardTop}>
          <AppText variant="bodyStrong">{habitTitle(draft, t)}</AppText>
          <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
            <AppText variant="caption" color="accent">
              {t('onboarding.method.photoTitle')}
            </AppText>
          </View>
        </View>
        <AppText variant="display" color="accent" style={styles.count}>
          D+0
        </AppText>
        <AppText variant="label" color="textMuted" style={styles.regular}>
          {t('onboarding.ready.noHistory')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.xl, gap: Spacing.sm },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  count: { fontSize: 56, lineHeight: 64, fontVariant: ['tabular-nums'] },
  regular: { fontWeight: '400' },
});
