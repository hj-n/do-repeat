import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { habitTitle } from '@/lib/habits';
import { takeCheckInPhoto, usesFilePicker } from '@/lib/photo';
import { summarizeStreak } from '@/lib/streak';
import { NOTE_MAX, useAppStore, useStreak, type Habit } from '@/store/app-store';

import { NoteInput } from './note-input';
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
        checkInId={done.checkInId}
      />
    );
  }

  return (
    <View className="flex-1 gap-6 pt-4">
      {photo ? (
        <Image source={{ uri: photo }} className="aspect-[3/4] w-full rounded-xl" accessibilityIgnoresInvertColors />
      ) : (
        <Text className="text-muted-foreground py-8 text-center">{t('checkIn.photoHint')}</Text>
      )}

      {problem === 'denied' ? (
        <Notice title={t('checkIn.cameraDeniedTitle')} body={t('checkIn.cameraDenied')}>
          <Button variant="link" className="self-start px-0" onPress={() => Linking.openSettings()}>
            <Text>{t('common.openSettings')}</Text>
          </Button>
        </Notice>
      ) : null}
      {problem === 'error' ? <Notice title={t('checkIn.photoTitle')} body={t('checkIn.photoError')} /> : null}

      {photo ? (
        <NoteInput label={t('note.label')} value={note} onChangeText={setNote} placeholder={t('note.placeholder')} max={NOTE_MAX} />
      ) : null}

      <View className="gap-2">
        {photo ? (
          <>
            <Button size="lg" onPress={submit}>
              <Text>{t('checkIn.usePhoto')}</Text>
            </Button>
            <Button variant="link" onPress={shoot}>
              <Text>{t('checkIn.retake')}</Text>
            </Button>
          </>
        ) : (
          <Button size="lg" onPress={shoot}>
            <Text>{usesFilePicker ? t('checkIn.choosePhoto') : t('checkIn.takePhoto')}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
