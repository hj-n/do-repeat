import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Animated, Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { NoteField } from '@/components/note-field';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { NOTE_MAX, useAppStore } from '@/store/app-store';

type SuccessViewProps = {
  habitName: string;
  streak: number;
  /** true면 "오늘은 이미 했어요" */
  already?: boolean;
  photoUri?: string;
  /** 방금 만든 인증 id. 있으면 한마디를 남기거나 고칠 수 있어요 */
  checkInId?: string;
};

/** 인증 성공: D+N 도장이 찍히는 화면 */
export function SuccessView({ habitName, streak, already, photoUri, checkInId }: SuccessViewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [scale] = useState(() => new Animated.Value(already ? 1 : 1.6));
  const [opacity] = useState(() => new Animated.Value(already ? 1 : 0));

  useEffect(() => {
    if (already) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          scale.setValue(1);
          opacity.setValue(1);
          return;
        }
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]).start();
      });
    return () => {
      cancelled = true;
    };
  }, [already, scale, opacity]);

  return (
    <View style={styles.wrap}>
      <View style={styles.center}>
        <Animated.View
          accessible
          accessibilityLabel={`${habitName} D+${streak}`}
          style={[
            styles.stamp,
            { backgroundColor: theme.accent, opacity, transform: [{ scale }, { rotate: '-8deg' }] },
          ]}>
          <AppText variant="caption" color="onAccent" style={styles.stampLabel}>
            {habitName}
          </AppText>
          <AppText variant="display" color="onAccent" style={styles.stampCount}>
            D+{streak}
          </AppText>
        </Animated.View>
        <AppText color="textMuted">
          {already ? t('success.alreadyTitle') : t('success.streak', { count: streak })}
        </AppText>
      </View>

      {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} accessibilityIgnoresInvertColors /> : null}
      {checkInId ? <NoteEditor checkInId={checkInId} /> : null}

      <Button label={t('common.backHome')} onPress={() => router.dismissTo('/home')} />
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
      <View style={styles.saveRow}>
        <Button
          kind="text"
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
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  stampLabel: { letterSpacing: 0.5, maxWidth: 130, textAlign: 'center' },
  stampCount: { fontSize: 46, lineHeight: 52, fontVariant: ['tabular-nums'] },
  photo: { width: 96, height: 128, borderRadius: Radius.md, alignSelf: 'center' },
  saved: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  flex: { flex: 1 },
  form: { gap: Spacing.xs },
  saveRow: { alignItems: 'flex-end' },
});
