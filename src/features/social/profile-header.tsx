import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Lock } from '@/lib/icons';

import { UserAvatar } from './user-avatar';

type Stat = { label: string; value: number; onPress?: () => void };

type ProfileHeaderProps = {
  displayName: string;
  username: string;
  isPrivate: boolean;
  privateLabel: string;
  stats: Stat[];
  /** 아래 줄 (팔로우 버튼, 편집 등) */
  children?: ReactNode;
};

/** 프로필 위쪽: 동그라미, 이름, @아이디, 숫자들을 한 줄로 */
export function ProfileHeader({ displayName, username, isPrivate, privateLabel, stats, children }: ProfileHeaderProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-4">
        <UserAvatar name={displayName} className="size-16" textClassName="text-2xl" />
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-1">
            <Text className="shrink text-2xl font-bold tracking-tight" numberOfLines={1}>
              {displayName}
            </Text>
            {isPrivate ? (
              <View accessible accessibilityLabel={privateLabel}>
                <Icon as={Lock} className="text-muted-foreground size-4" />
              </View>
            ) : null}
          </View>
          <Text className="text-muted-foreground" numberOfLines={1}>
            @{username}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-x-6 gap-y-1">
        {stats.map((stat) => (
          <Pressable
            key={stat.label}
            disabled={!stat.onPress}
            accessibilityRole={stat.onPress ? 'button' : undefined}
            hitSlop={6}
            onPress={stat.onPress}
            className="flex-row items-baseline gap-1">
            <Text className="font-semibold tabular-nums">{stat.value}</Text>
            <Text className="text-muted-foreground">{stat.label}</Text>
          </Pressable>
        ))}
      </View>
      {children}
    </View>
  );
}
