import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/app-text';

/** 뒤로 가기. 돌아갈 화면이 없으면 `fallback`으로 이동합니다. */
export function BackButton({ fallback = '/' }: { fallback?: Href }) {
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
      hitSlop={12}
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      style={styles.button}>
      <AppText variant="title" color="textMuted">
        ‹
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 28, alignItems: 'flex-start' },
});
