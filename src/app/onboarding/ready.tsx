import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 온보딩 3단계: 고른 내용 확인 (홈 화면을 만들기 전 임시 마지막 화면) */
export default function ReadyScreen() {
  const theme = useTheme();
  const { habit = '운동', method = 'location' } = useLocalSearchParams<{
    habit?: string;
    method?: string;
  }>();
  const methodLabel = method === 'photo' ? '사진 인증' : '위치 인증';

  return (
    <Screen
      footer={<Button kind="secondary" label="처음부터 다시" onPress={() => router.dismissTo('/')} />}>
      <StepHeader step={3} total={3} />

      <View style={styles.heading}>
        <AppText variant="title">준비됐어요</AppText>
        <AppText color="textMuted">오늘 첫 인증을 하면 D+1부터 시작해요.</AppText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardTop}>
          <AppText variant="bodyStrong">{habit}</AppText>
          <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
            <AppText variant="caption" color="accent">
              {methodLabel}
            </AppText>
          </View>
        </View>
        <AppText variant="display" color="accent" style={styles.count}>
          D+0
        </AppText>
        <AppText variant="label" color="textMuted" style={styles.note}>
          아직 인증 기록이 없어요
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
  note: { fontWeight: '400' },
});
