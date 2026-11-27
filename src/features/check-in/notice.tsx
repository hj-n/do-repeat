import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

/** 실패 안내: 빨간 제목 한 줄과 짧은 설명 */
export function Notice({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <View className="gap-1">
      <Text className="text-destructive font-semibold">{title}</Text>
      <Text className="text-muted-foreground">{body}</Text>
      {children}
    </View>
  );
}
