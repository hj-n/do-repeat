import { Tabs } from 'expo-router/js-tabs';
import type { LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { House, Rows3, User } from '@/lib/icons';

const TAB_ICONS: Record<string, LucideIcon> = { home: House, feed: Rows3, profile: User };

/** 아래 탭: 홈 / 피드 / 프로필 */
export default function TabLayout() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        // 아이콘 + 글자가 잘리지 않게 높이를 직접 정합니다 (아래 안전 영역 포함)
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 64 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom + 4,
        },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
        sceneStyle: { backgroundColor: theme.background },
        tabBarIcon: ({ focused, color }) => {
          const TabIcon = TAB_ICONS[route.name] ?? House;
          return <TabIcon color={color} size={22} strokeWidth={focused ? 2.2 : 1.8} />;
        },
      })}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="feed" options={{ title: t('tabs.feed') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
