import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & { label?: string };

/** 입력칸: 테두리 없이 옅은 바탕 */
export function TextField({ label, style, ...rest }: TextFieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <AppText variant="label" color="textMuted">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={theme.textMuted}
        accessibilityLabel={label}
        style={[styles.input, Type.body, { color: theme.text, backgroundColor: theme.surfaceMuted }, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  input: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
