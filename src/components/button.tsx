import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** primary: 꽉 찬 대표 색 / secondary: 테두리만 */
  kind?: 'primary' | 'secondary';
  /** small: 목록 안의 작은 버튼 (팔로우, 수락 등) */
  size?: 'regular' | 'small';
};

export function Button({ label, onPress, disabled, kind = 'primary', size = 'regular' }: ButtonProps) {
  const theme = useTheme();
  const primary = kind === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'small' && styles.small,
        primary
          ? { backgroundColor: disabled ? theme.surfaceMuted : theme.accent }
          : { borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface },
        pressed && !disabled && styles.pressed,
      ]}>
      <AppText
        variant={size === 'small' ? 'label' : 'bodyStrong'}
        color={primary ? (disabled ? 'textMuted' : 'onAccent') : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  small: { minHeight: 36, borderRadius: Radius.sm + 2, paddingHorizontal: Spacing.lg },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
