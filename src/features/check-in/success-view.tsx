import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Animated, Image, Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { NoteField } from '@/components/note-field';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { takeCheckInPhoto } from '@/lib/photo';
import { toDateKey } from '@/lib/streak';
import { NOTE_MAX, useAppStore } from '@/store/app-store';

import { Notice } from './notice';

type SuccessViewProps = {
  habitName: string;
  streak: number;
  /** true면 "오늘은 이미 했어요" */
  already?: boolean;
  /** 방금 만든 인증 id. 있으면 한마디(와 사진)를 남기거나 고칠 수 있어요 */
  checkInId?: string;
  /** 위치 인증: 사진은 선택이라 붙이고 뗄 수 있어요 */
  photoOptional?: boolean;
};

/** 인증 성공: N일째 도장이 찍히는 화면 */
export function SuccessView({ habitName, streak, already, checkInId, photoOptional }: SuccessViewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [scale] = useState(() => new Animated.Value(already ? 1 : 1.5));
  const [opacity] = useState(() => new Animated.Value(already ? 0.94 : 0));

  useEffect(() => {
    if (already) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          scale.setValue(1);
          opacity.setValue(0.94);
          return;
        }
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 6, tension: 160, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.94, duration: 140, useNativeDriver: true }),
        ]).start();
      });
    return () => {
      cancelled = true;
    };
  }, [already, scale, opacity]);

  return (
    <View style={styles.wrap}>
      <View style={styles.center}>
        {/* 도장: 바탕은 비우고 테두리와 글자만 대표 색 (찍힌 잉크처럼) */}
        <Animated.View
          accessible
          accessibilityLabel={`${habitName} ${t('streak.day', { count: streak })}`}
          style={[
            styles.stamp,
            { borderColor: theme.accent, opacity, transform: [{ scale }, { rotate: '-10deg' }] },
          ]}>
          <View style={[styles.stampInner, { borderColor: theme.accent }]}>
            <AppText color="accent" style={styles.stampLabel} numberOfLines={1}>
              {habitName}
            </AppText>
            <AppText color="accent" style={styles.stampCount} numberOfLines={1} adjustsFontSizeToFit>
              {t('streak.day', { count: streak })}
            </AppText>
            <View style={[styles.stampRule, { backgroundColor: theme.accent }]} />
            <AppText color="accent" style={styles.stampDate}>
              {toDateKey().replaceAll('-', '.')}
            </AppText>
          </View>
        </Animated.View>
        {already ? <AppText color="textMuted">{t('success.alreadyTitle')}</AppText> : null}
      </View>

      {checkInId ? <PhotoAttachment checkInId={checkInId} optional={!!photoOptional} /> : null}
      {checkInId ? <NoteEditor checkInId={checkInId} /> : null}

      <Button label={t('common.backHome')} onPress={() => router.dismissTo('/home')} />
    </View>
  );
}

/** 인증 사진: 사진 인증이면 보여주기만, 위치 인증이면 붙이거나 뗄 수 있어요 */
function PhotoAttachment({ checkInId, optional }: { checkInId: string; optional: boolean }) {
  const { t } = useTranslation();
  const photoUri = useAppStore((s) => s.checkIns.find((c) => c.id === checkInId)?.photoUri);
  const setCheckInPhoto = useAppStore((s) => s.setCheckInPhoto);
  const [problem, setProblem] = useState<'denied' | 'error' | null>(null);

  const add = async () => {
    const result = await takeCheckInPhoto();
    if (result.ok) {
      setCheckInPhoto(checkInId, result.uri);
      setProblem(null);
    } else if (result.reason !== 'canceled') {
      setProblem(result.reason);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.photoRow}>
        <Image source={{ uri: photoUri }} style={styles.photo} accessibilityIgnoresInvertColors />
        {optional ? (
          <Button kind="text" label={t('checkIn.removePhoto')} onPress={() => setCheckInPhoto(checkInId, undefined)} />
        ) : null}
      </View>
    );
  }
  if (!optional) return null;

  return (
    <View style={styles.photoAdd}>
      <Button kind="text" label={`+ ${t('checkIn.addPhoto')}`} onPress={add} />
      {problem === 'denied' ? (
        <Notice title={t('checkIn.cameraDeniedTitle')} body={t('checkIn.cameraDenied')}>
          <Button kind="text" label={t('common.openSettings')} onPress={() => Linking.openSettings()} />
        </Notice>
      ) : null}
      {problem === 'error' ? <Notice title={t('checkIn.photoTitle')} body={t('checkIn.photoError')} /> : null}
    </View>
  );
}

/** 인증 게시물에 한마디 남기기 / 고치기 */
function NoteEditor({ checkInId }: { checkInId: string }) {
  const { t } = useTranslation();
  const saved = useAppStore((s) => s.checkIns.find((c) => c.id === checkInId)?.note);
  const setCheckInNote = useAppStore((s) => s.setCheckInNote);
  const [editing, setEditing] = useState(!saved);
  const [draft, setDraft] = useState(saved ?? '');

  if (!editing && saved) {
    return (
      <View style={styles.saved}>
        <AppText style={styles.flex}>{saved}</AppText>
        <Button kind="text" label={t('note.edit')} onPress={() => setEditing(true)} />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <NoteField
        label={t('note.label')}
        value={draft}
        onChangeText={setDraft}
        placeholder={t('note.placeholder')}
        max={NOTE_MAX}
      />
      <View>
        <Button
          kind="text"
          align="end"
          label={t('note.save')}
          disabled={draft.trim().length === 0}
          onPress={() => {
            setCheckInNote(checkInId, draft);
            setEditing(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: Spacing.xl, paddingVertical: Spacing.xl },
  center: { alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing.lg },
  stamp: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 3.5,
    padding: 6,
  },
  stampInner: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 2,
  },
  stampLabel: { fontSize: 13, lineHeight: 16, fontWeight: '700', letterSpacing: 1.5, maxWidth: 120 },
  stampCount: { fontSize: 36, lineHeight: 42, fontWeight: '900', fontVariant: ['tabular-nums'] },
  stampRule: { width: 44, height: 1.5, marginVertical: 4, opacity: 0.8 },
  stampDate: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1, fontVariant: ['tabular-nums'] },
  photoRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.lg },
  photo: { width: 96, height: 128, borderRadius: Radius.md },
  photoAdd: { gap: Spacing.sm },
  saved: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  flex: { flex: 1 },
  form: { gap: Spacing.xs },
});
