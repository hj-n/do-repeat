import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** 가는 구분선 (상자 대신 이걸로 나눠요) */
export function Divider({ inset = 0 }: { inset?: number }) {
  const theme = useTheme();
  return <View style={[styles.line, { backgroundColor: theme.border, marginLeft: inset }]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth },
});
