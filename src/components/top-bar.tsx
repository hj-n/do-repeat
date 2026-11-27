import type { Href } from 'expo-router';
import { View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Text } from '@/components/ui/text';

/** 화면 상단: 뒤로 가기 + 가운데 제목 (+ 아래 작은 부제) */
export function TopBar({ title, subtitle, fallback = '/home' }: { title: string; subtitle?: string; fallback?: Href }) {
  return (
    <View className="flex-row items-center">
      <BackButton fallback={fallback} />
      <View className="flex-1 items-center">
        <Text className="font-semibold" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View className="w-8" />
    </View>
  );
}
