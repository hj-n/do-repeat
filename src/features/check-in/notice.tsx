import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Spacing } from '@/constants/theme';

/** 실패 안내: 빨간 제목 한 줄과 짧은 설명 */
export function Notice({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="bodyStrong" color="danger">
        {title}
      </AppText>
      <AppText color="textMuted">{body}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
});
