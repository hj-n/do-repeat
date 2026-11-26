import type { Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { BackButton } from '@/components/back-button';
import { Spacing } from '@/constants/theme';

/** 화면 상단: 뒤로 가기 + 가운데 제목 */
export function TopBar({ title, fallback = '/home' }: { title: string; fallback?: Href }) {
  return (
    <View style={styles.row}>
      <BackButton fallback={fallback} />
      <AppText variant="bodyStrong" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 40, gap: Spacing.md },
  title: { flex: 1, textAlign: 'center' },
  spacer: { width: 28 },
});
