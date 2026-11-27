import { View } from 'react-native';

import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type NoteInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  max: number;
};

/** 한마디 입력: shadcn Label + Textarea, 아래에 글자 수 (23/100) */
export function NoteInput({ label, value, onChangeText, placeholder, max }: NoteInputProps) {
  return (
    <View className="gap-2">
      <Label nativeID="note-label">{label}</Label>
      <Textarea
        aria-labelledby="note-label"
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={max}
        numberOfLines={3}
      />
      <Text className={cn('text-right text-xs tabular-nums', value.length >= max ? 'text-destructive' : 'text-muted-foreground')}>
        {value.length}/{max}
      </Text>
    </View>
  );
}
