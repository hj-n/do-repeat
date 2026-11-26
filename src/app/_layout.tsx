import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { resolveLanguage } from '@/i18n'; // also sets up translations
import { useAppStore, useStoreHydrated } from '@/store/app-store';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const hydrated = useStoreHydrated();
  const language = useAppStore((s) => s.language);
  const { i18n } = useTranslation();

  // 저장된 언어 설정(기기 언어 / English / 한국어)을 적용
  useEffect(() => {
    const next = resolveLanguage(language);
    if (i18n.language !== next) i18n.changeLanguage(next);
  }, [language, i18n]);

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={{
          ...base,
          colors: { ...base.colors, background: theme.background, primary: theme.accent },
        }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {hydrated ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.background },
              animation: 'slide_from_right',
            }}
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: theme.background }} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
