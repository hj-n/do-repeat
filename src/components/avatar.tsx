import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { useTheme } from '@/hooks/use-theme';

/** 사람 사진 대신 이름 첫 글자를 넣은 동그라미 */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const theme = useTheme();
  const initial = (name.trim()[0] ?? '?').toUpperCase();
  return (
    <View
      accessible={false}
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.accentSoft },
      ]}>
      <AppText
        color="accent"
        style={{ fontSize: size * 0.42, lineHeight: size * 0.52, fontWeight: '700' }}>
        {initial}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
