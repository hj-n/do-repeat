import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

/** 목록이 비었을 때: 짧은 안내와 다음 행동 */
export function EmptyState({ title, body, children }: { title?: string; body: string; children?: ReactNode }) {
  return (
    <View className="items-center gap-1 py-8">
      {title ? <Text className="text-center font-semibold">{title}</Text> : null}
      <Text className="text-muted-foreground text-center">{body}</Text>
      {children ? <View className="mt-2">{children}</View> : null}
    </View>
  );
}
