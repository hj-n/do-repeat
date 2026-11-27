import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 목록이 비었을 때: 무엇이 들어올지와 다음 행동을 알려줍니다 */
export function EmptyState({ title, body, children }: { title?: string; body: string; children?: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.box, { borderColor: theme.border }]}>
      {title ? (
        <AppText variant="bodyStrong" style={styles.center}>
          {title}
        </AppText>
      ) : null}
      <AppText color="textMuted" style={styles.center}>
        {body}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'stretch',
  },
  center: { textAlign: 'center' },
});
