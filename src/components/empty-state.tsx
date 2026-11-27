import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Spacing } from '@/constants/theme';

/** 목록이 비었을 때: 짧은 안내와 다음 행동 */
export function EmptyState({ title, body, children }: { title?: string; body: string; children?: ReactNode }) {
  return (
    <View style={styles.wrap}>
      {title ? (
        <AppText variant="bodyStrong" style={styles.center}>
          {title}
        </AppText>
      ) : null}
      <AppText color="textMuted" style={styles.center}>
        {body}
      </AppText>
      {children ? <View style={styles.action}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: Spacing.xxl, gap: Spacing.xs, alignItems: 'center' },
  center: { textAlign: 'center' },
  action: { marginTop: Spacing.sm },
});
