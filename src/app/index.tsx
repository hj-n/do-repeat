import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Screen } from '@/components/screen';
import { StepHeader } from '@/components/step-header';
import { Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRESETS = ['운동', '독서', '공부', '물 마시기', '산책', '명상', '일기'];
const CUSTOM = '직접 입력';

/** 온보딩 1단계: 무엇을 반복할지 고르기 */
export default function WhatDoYouRepeat() {
  const theme = useTheme();
  const [picked, setPicked] = useState<string | null>(null);
  const [custom, setCustom] = useState('');

  const habit = picked === CUSTOM ? custom.trim() : picked;

  return (
    <Screen
      footer={
        <Button
          label="다음"
          disabled={!habit}
          onPress={() => habit && router.push({ pathname: '/onboarding/method', params: { habit } })}
        />
      }>
      <StepHeader step={1} total={3} canGoBack={false} />

      <View style={styles.heading}>
        <AppText variant="caption" color="accent" style={styles.eyebrow}>
          DO REPEAT
        </AppText>
        <AppText variant="display">What do you repeat?</AppText>
        <AppText color="textMuted">매일 반복하고 싶은 걸 하나 골라주세요.</AppText>
      </View>

      <View style={styles.chips}>
        {[...PRESETS, CUSTOM].map((label) => (
          <Chip
            key={label}
            label={label}
            selected={picked === label}
            onPress={() => setPicked(label)}
          />
        ))}
      </View>

      {picked === CUSTOM ? (
        <TextInput
          autoFocus
          value={custom}
          onChangeText={setCustom}
          placeholder="예: 영어 단어 20개 외우기"
          placeholderTextColor={theme.textMuted}
          maxLength={30}
          returnKeyType="next"
          style={[
            styles.input,
            Type.body,
            { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: Spacing.sm, paddingTop: Spacing.lg },
  eyebrow: { letterSpacing: 1.5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
