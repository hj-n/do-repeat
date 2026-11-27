import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionRowProps = {
  title: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  /** accent: 고르면 대표 색 / neutral: 고르면 굵은 글씨와 체크만 (설정 화면) */
  tone?: 'accent' | 'neutral';
};

/** 고르는 한 줄: 제목, 짧은 설명, 고르면 오른쪽에 체크 */
export function OptionRow({ title, description, selected, onPress, tone = 'accent' }: OptionRowProps) {
  const theme = useTheme();
  const neutral = tone === 'neutral';
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.texts}>
        <AppText
          variant={neutral && !selected ? 'body' : 'bodyStrong'}
          color={selected && !neutral ? 'accent' : 'text'}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="label" color="textMuted" style={styles.regular}>
            {description}
          </AppText>
        ) : null}
      </View>
      {neutral ? (
        <View style={styles.mark}>{selected ? <Icon name="check" size={20} color="text" strokeWidth={2.4} /> : null}</View>
      ) : (
        <View
          style={[
            styles.mark,
            selected ? { backgroundColor: theme.accent } : { borderWidth: 1.5, borderColor: theme.border },
          ]}>
          {selected ? <Icon name="check" size={14} color="onAccent" strokeWidth={2.6} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing.lg },
  pressed: { opacity: 0.7 },
  texts: { flex: 1, gap: 2 },
  regular: { fontWeight: '400' },
  mark: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
