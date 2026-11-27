import type { ReactElement } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Divider } from '@/components/divider';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ListScreenProps<T> = {
  data: T[];
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;
  /** 목록 위에 붙는 머리 부분 (제목, 프로필 등) */
  header?: ReactElement;
  /** 목록이 비었을 때 */
  empty?: ReactElement;
  edges?: Edge[];
  /** 항목 사이 간격 */
  gap?: number;
  /** 항목 사이에 가는 선을 그을지 (간격의 가운데) */
  divided?: boolean;
};

/** 긴 목록 화면 (피드, 프로필). 보이는 부분만 그려서 항목이 많아도 가볍습니다. */
export function ListScreen<T>({
  data,
  renderItem,
  keyExtractor,
  header,
  empty,
  edges,
  gap = Spacing.lg,
  divided = false,
}: ListScreenProps<T>) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header ? <View style={[styles.column, styles.header]}>{header}</View> : undefined}
        ListEmptyComponent={empty ? <View style={styles.column}>{empty}</View> : undefined}
        ItemSeparatorComponent={() =>
          divided ? (
            <View style={[styles.column, { paddingVertical: gap / 2 }]}>
              <Divider />
            </View>
          ) : (
            <View style={{ height: gap }} />
          )
        }
        renderItem={({ item }) => <View style={styles.column}>{renderItem(item)}</View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  column: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { gap: Spacing.lg, marginBottom: Spacing.xl },
});
