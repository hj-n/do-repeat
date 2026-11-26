import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 실패 안내 상자 (예: 장소가 아니에요, 권한이 꺼져 있어요) */
export function Notice({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: theme.dangerSoft }]}>
      <AppText variant="bodyStrong" color="danger">
        {title}
      </AppText>
      <AppText color="text">{body}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: Radius.lg, padding: Spacing.xl, gap: Spacing.sm },
});
