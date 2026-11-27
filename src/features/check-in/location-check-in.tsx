import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { distanceInMeters, formatDistance, isWithinPlace } from '@/lib/geo';
import { habitTitle } from '@/lib/habits';
import { getCurrentPosition } from '@/lib/location';
import { summarizeStreak } from '@/lib/streak';
import { useAppStore, useStreak, type Habit } from '@/store/app-store';

import { Notice } from './notice';
import { PreviewPositionControl } from './preview-position-control';
import { SuccessView } from './success-view';

type Phase =
  | { kind: 'checking' }
  | { kind: 'success'; streak: number; checkInId?: string }
  | { kind: 'tooFar'; distance: number }
  | { kind: 'denied' }
  | { kind: 'mocked' }
  | { kind: 'unavailable' };

/**
 * 위치 인증: 화면을 열면 바로 현재 위치를 확인하고,
 * 등록한 장소 반경 안이면 그 자리에서 인증됩니다.
 */
export function LocationCheckIn({ habit }: { habit: Habit }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const checkIn = useAppStore((s) => s.checkIn);
  const streak = useStreak(habit.id);
  // 화면을 열 때 이미 인증했는지 (이 화면에서 인증하면 바뀌지 않도록 처음 값만 기억)
  const [alreadyDone] = useState(streak.doneToday);
  const [phase, setPhase] = useState<Phase>({ kind: 'checking' });
  const place = habit.place;

  /** 현재 위치를 확인하고, 장소 안이면 인증을 기록한 뒤 결과를 돌려줍니다 */
  const evaluate = useCallback(async (): Promise<Phase> => {
    if (!place) return { kind: 'unavailable' };
    const result = await getCurrentPosition('verify');
    if (!result.ok) return { kind: result.reason };
    if (result.mocked) return { kind: 'mocked' };

    const distance = distanceInMeters(result.coords, place);
    if (!isWithinPlace(distance, place.radius, result.accuracy)) {
      return { kind: 'tooFar', distance };
    }
    const entry = checkIn(habit.id, { distance: Math.round(distance) });
    const days = useAppStore
      .getState()
      .checkIns.filter((c) => c.habitId === habit.id)
      .map((c) => c.day);
    return { kind: 'success', streak: summarizeStreak(days).current, checkInId: entry?.id };
  }, [checkIn, habit.id, place]);

  // 화면을 열면 바로 위치 확인
  useEffect(() => {
    if (alreadyDone) return;
    let active = true;
    evaluate().then((next) => active && setPhase(next));
    return () => {
      active = false;
    };
  }, [alreadyDone, evaluate]);

  const retry = () => {
    setPhase({ kind: 'checking' });
    evaluate().then(setPhase);
  };

  if (alreadyDone) {
    return <SuccessView habitName={habitTitle(habit, t)} streak={streak.current} already />;
  }
  if (phase.kind === 'success') {
    return (
      <SuccessView habitName={habitTitle(habit, t)} streak={phase.streak} checkInId={phase.checkInId} photoOptional />
    );
  }

  return (
    <View style={styles.wrap}>
      {phase.kind === 'checking' ? (
        <View style={styles.checking}>
          <ActivityIndicator size="large" color={theme.accent} />
          <AppText variant="bodyStrong">{t('checkIn.checking')}</AppText>
          {place ? <AppText color="textMuted">{place.name}</AppText> : null}
        </View>
      ) : (
        <View style={styles.failure}>
          {phase.kind === 'tooFar' && place ? (
            <Notice
              title={t('checkIn.tooFarTitle')}
              body={t('checkIn.tooFar', { distance: formatDistance(phase.distance), place: place.name })}
            />
          ) : null}
          {phase.kind === 'denied' ? (
            <Notice title={t('checkIn.deniedTitle')} body={t('checkIn.denied')} />
          ) : null}
          {phase.kind === 'mocked' ? (
            <Notice title={t('checkIn.mockedTitle')} body={t('checkIn.mocked')} />
          ) : null}
          {phase.kind === 'unavailable' ? (
            <Notice title={t('checkIn.unavailableTitle')} body={t('checkIn.unavailable')} />
          ) : null}

          <Button label={t('common.retry')} onPress={retry} />
          {phase.kind === 'denied' ? (
            <Button kind="text" align="center" label={t('common.openSettings')} onPress={() => Linking.openSettings()} />
          ) : null}
        </View>
      )}

      <PreviewPositionControl onChange={() => phase.kind !== 'checking' && retry()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: Spacing.xxl, justifyContent: 'space-between' },
  checking: { alignItems: 'center', gap: Spacing.md, paddingTop: 96 },
  failure: { gap: Spacing.md, paddingTop: Spacing.xl },
});
