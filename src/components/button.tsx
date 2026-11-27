import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /**
   * primary: 꽉 찬 대표 색 (화면의 주요 행동 하나)
   * secondary: 옅은 바탕
   * text: 글자만 (보조 행동)
   */
  kind?: 'primary' | 'secondary' | 'text';
  /** small: 목록 안의 작은 버튼 (팔로우, 수락 등) */
  size?: 'regular' | 'small';
  accessibilityLabel?: string;
  /** 글자 버튼 위치 (기본: 왼쪽) */
  align?: 'start' | 'center' | 'end';
  /** 글자 버튼 색: accent(대표 색) / neutral(기본 글자색, 설정 화면처럼 색이 필요 없는 곳) */
  tone?: 'accent' | 'neutral';
};

const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end' } as const;

export function Button({
  label,
  onPress,
  disabled,
  kind = 'primary',
  size = 'regular',
  accessibilityLabel,
  align = 'start',
  tone = 'accent',
}: ButtonProps) {
  const theme = useTheme();
  const small = size === 'small';
  const color =
    kind === 'primary' ? (disabled ? 'textMuted' : 'onAccent') : kind === 'text' ? (disabled ? 'textMuted' : tone === 'neutral' ? 'text' : 'accent') : 'text';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={kind === 'text' ? 8 : undefined}
      style={({ pressed }) => [
        kind === 'text' ? [styles.text, { alignSelf: ALIGN[align] }] : [styles.base, small && styles.small],
        kind === 'primary' && { backgroundColor: disabled ? theme.surfaceMuted : theme.accent },
        kind === 'secondary' && { backgroundColor: theme.surfaceMuted },
        pressed && !disabled && styles.pressed,
      ]}>
      <AppText variant={small || kind === 'text' ? 'label' : 'bodyStrong'} color={color}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  small: { minHeight: 34, borderRadius: Radius.pill, paddingHorizontal: Spacing.lg },
  text: { paddingVertical: Spacing.xs },
  pressed: { opacity: 0.7 },
});
