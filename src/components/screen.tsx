import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** 화면 아래에 고정되는 영역 (주로 "다음" 버튼) */
  footer?: ReactNode;
  /** 안전 영역을 적용할 가장자리 (탭 화면은 아래를 탭 막대가 처리) */
  edges?: Edge[];
};

/** 모든 화면의 바탕: 안전 영역, 좌우 여백, 아래 고정 버튼 자리를 잡아줍니다. */
export function Screen({ children, footer, edges }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.xl },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
});
