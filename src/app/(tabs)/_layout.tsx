import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { useTheme } from '@/hooks/use-theme';

const TAB_ICONS: Record<string, IconName> = { home: 'home', feed: 'feed', profile: 'profile' };

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
        tabBarIcon: ({ focused }) => (
          <Icon
            name={TAB_ICONS[route.name] ?? 'home'}
            color={focused ? 'accent' : 'textMuted'}
            strokeWidth={focused ? 2.2 : 1.8}
          />
        ),
      })}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="feed" options={{ title: t('tabs.feed') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
