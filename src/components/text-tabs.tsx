import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Spacing } from '@/constants/theme';

type TextTabsProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** 글자로만 된 탭 (예: 팔로잉  둘러보기). 고른 쪽만 진하게 */
export function TextTabs<T extends string>({ options, value, onChange }: TextTabsProps<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            hitSlop={8}
            onPress={() => onChange(option.value)}>
            <AppText variant="bodyStrong" color={selected ? 'text' : 'textMuted'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.xl },
});
