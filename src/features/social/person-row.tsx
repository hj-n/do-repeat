import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Person } from '@/data/sample-people';
import { Lock } from '@/lib/icons';

import { UserAvatar } from './user-avatar';

/** 사람 한 줄: 동그라미, 이름, @아이디, 오른쪽에 버튼 */
export function PersonRow({ person, right }: { person: Person; right?: ReactNode }) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push({ pathname: '/user/[id]', params: { id: person.id } })}
        className="flex-1 flex-row items-center gap-3">
        <UserAvatar name={person.displayName} className="size-10" />
        <View className="flex-1">
          <View className="flex-row items-center gap-1">
            <Text className="font-semibold" numberOfLines={1}>
              {person.displayName}
            </Text>
            {person.isPrivate ? <Icon as={Lock} className="text-muted-foreground size-3.5" /> : null}
          </View>
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            @{person.username}
          </Text>
        </View>
      </Pressable>
      {right}
    </View>
  );
}
