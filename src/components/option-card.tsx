import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionCardProps = {
  title: string;
  description: string;
  /** 카드 왼쪽의 짧은 표시 (예: 위치, 사진) */
  badge: string;
  selected?: boolean;
  onPress?: () => void;
};

/** 큰 선택지 카드 (예: 위치 인증 / 사진 인증) */
export function OptionCard({ title, description, badge, selected, onPress }: OptionCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? theme.accentSoft : theme.surface,
          borderColor: selected ? theme.accent : theme.border,
        },
        pressed && styles.pressed,
      ]}>
      <View
        style={[styles.badge, { backgroundColor: selected ? theme.accent : theme.surfaceMuted }]}>
        <AppText variant="label" color={selected ? 'onAccent' : 'textMuted'}>
          {badge}
        </AppText>
      </View>
      <View style={styles.texts}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="label" color="textMuted" style={styles.description}>
          {description}
        </AppText>
      </View>
      <View
        style={[
          styles.radio,
          { borderColor: selected ? theme.accent : theme.border },
        ]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: theme.accent }]} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  pressed: { opacity: 0.9 },
  badge: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: 2 },
  description: { fontWeight: '400' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
