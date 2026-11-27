import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { NoteField } from '@/components/note-field';
import { Radius, Spacing } from '@/constants/theme';
import { habitTitle } from '@/lib/habits';
import { takeCheckInPhoto, usesFilePicker } from '@/lib/photo';
import { summarizeStreak } from '@/lib/streak';
import { NOTE_MAX, useAppStore, useStreak, type Habit } from '@/store/app-store';

import { Notice } from './notice';
import { SuccessView } from './success-view';

/** 사진 인증: 그 자리에서 찍고 → 확인하고 → 인증 */
export function PhotoCheckIn({ habit }: { habit: Habit }) {
  const { t } = useTranslation();
  const checkIn = useAppStore((s) => s.checkIn);
  const streak = useStreak(habit.id);
  // 화면을 열 때 이미 인증했는지 (이 화면에서 인증하면 바뀌지 않도록 처음 값만 기억)
  const [alreadyDone] = useState(streak.doneToday);
  const [photo, setPhoto] = useState<string | null>(null);
  const [problem, setProblem] = useState<'denied' | 'error' | null>(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState<{ streak: number; checkInId?: string } | null>(null);

  const shoot = async () => {
    const result = await takeCheckInPhoto();
    if (result.ok) {
      setPhoto(result.uri);
      setProblem(null);
    } else if (result.reason !== 'canceled') {
      setProblem(result.reason);
    }
  };

  const submit = () => {
    if (!photo) return;
    const entry = checkIn(habit.id, { photoUri: photo, note });
    const days = useAppStore
      .getState()
      .checkIns.filter((c) => c.habitId === habit.id)
      .map((c) => c.day);
    setDone({ streak: summarizeStreak(days).current, checkInId: entry?.id });
  };

  if (alreadyDone) {
    return <SuccessView habitName={habitTitle(habit, t)} streak={streak.current} already />;
  }
  if (done !== null) {
    return (
      <SuccessView
        habitName={habitTitle(habit, t)}
        streak={done.streak}
        photoUri={photo ?? undefined}
        checkInId={done.checkInId}
      />
    );
  }

  return (
    <View style={styles.wrap}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} accessibilityIgnoresInvertColors />
      ) : (
        <AppText color="textMuted" style={styles.hint}>
          {t('checkIn.photoHint')}
        </AppText>
      )}

      {problem === 'denied' ? (
        <Notice title={t('checkIn.cameraDeniedTitle')} body={t('checkIn.cameraDenied')}>
          <Button kind="text" label={t('common.openSettings')} onPress={() => Linking.openSettings()} />
        </Notice>
      ) : null}
      {problem === 'error' ? <Notice title={t('checkIn.photoTitle')} body={t('checkIn.photoError')} /> : null}

      {photo ? (
        <NoteField
          label={t('note.label')}
          value={note}
          onChangeText={setNote}
          placeholder={t('note.placeholder')}
          max={NOTE_MAX}
        />
      ) : null}

      <View style={styles.actions}>
        {photo ? (
          <>
            <Button label={t('checkIn.usePhoto')} onPress={submit} />
            <Button kind="text" centered label={t('checkIn.retake')} onPress={shoot} />
          </>
        ) : (
          <Button label={usesFilePicker ? t('checkIn.choosePhoto') : t('checkIn.takePhoto')} onPress={shoot} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: Spacing.xl, paddingTop: Spacing.lg },
  photo: { width: '100%', aspectRatio: 3 / 4, borderRadius: Radius.lg },
  hint: { textAlign: 'center', paddingVertical: Spacing.xxl },
  actions: { gap: Spacing.md, alignItems: 'stretch' },
});
