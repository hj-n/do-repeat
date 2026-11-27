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
  /** 글자 버튼을 가운데에 둘지 (기본: 왼쪽) */
  centered?: boolean;
};

export function Button({
  label,
  onPress,
  disabled,
  kind = 'primary',
  size = 'regular',
  accessibilityLabel,
  centered = false,
}: ButtonProps) {
  const theme = useTheme();
  const small = size === 'small';
  const color =
    kind === 'primary' ? (disabled ? 'textMuted' : 'onAccent') : kind === 'text' ? (disabled ? 'textMuted' : 'accent') : 'text';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={kind === 'text' ? 8 : undefined}
      style={({ pressed }) => [
        kind === 'text' ? [styles.text, centered && styles.centered] : [styles.base, small && styles.small],
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
  text: { alignSelf: 'flex-start', paddingVertical: Spacing.xs },
  centered: { alignSelf: 'center' },
  pressed: { opacity: 0.7 },
});
