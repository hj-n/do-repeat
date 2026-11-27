import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** 고를 수 있는 작은 알약 (예: 운동, 독서). 테두리 없이 바탕색으로만 구분 */
export function Chip({ label, selected, onPress }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: selected ? theme.accent : theme.surfaceMuted },
        pressed && styles.pressed,
      ]}>
      <AppText variant="label" color={selected ? 'onAccent' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
  },
  pressed: { opacity: 0.8 },
});
