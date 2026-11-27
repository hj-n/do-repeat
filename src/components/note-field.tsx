import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';

type NoteFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  max: number;
};

/** 글자 수가 보이는 짧은 글 입력칸 (예: 인증 한마디 23/100) */
export function NoteField({ label, value, onChangeText, placeholder, max }: NoteFieldProps) {
  return (
    <View style={styles.wrap}>
      <TextField
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={max}
        multiline
        style={styles.input}
      />
      <AppText
        variant="caption"
        color={value.length >= max ? 'danger' : 'textMuted'}
        style={styles.counter}>
        {value.length}/{max}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs, alignSelf: 'stretch' },
  input: { minHeight: 76, textAlignVertical: 'top' },
  counter: { textAlign: 'right', fontVariant: ['tabular-nums'] },
});
