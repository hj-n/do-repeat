import type { ReactElement } from 'react';
import { FlatList, View } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { SafeAreaView } from '@/components/safe-area-view';
import { Separator } from '@/components/ui/separator';

type ListScreenProps<T> = {
  data: T[];
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;
  /** 목록 위에 붙는 머리 부분 (제목, 프로필 등) */
  header?: ReactElement;
  /** 목록이 비었을 때 */
  empty?: ReactElement;
  edges?: Edge[];
  /** 항목 사이에 구분선을 그을지 */
  divided?: boolean;
};

/** 긴 목록 화면 (피드, 프로필). 보이는 부분만 그려서 항목이 많아도 가볍습니다. */
export function ListScreen<T>({ data, renderItem, keyExtractor, header, empty, edges, divided = false }: ListScreenProps<T>) {
  return (
    <SafeAreaView edges={edges} className="bg-background flex-1">
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        contentContainerClassName="px-6 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header ? <Column className="mb-6 gap-4">{header}</Column> : undefined}
        ListEmptyComponent={empty ? <Column>{empty}</Column> : undefined}
        ItemSeparatorComponent={() =>
          divided ? (
            <Column className="py-5">
              <Separator />
            </Column>
          ) : (
            <View className="h-2" />
          )
        }
        renderItem={({ item }) => <Column>{renderItem(item)}</Column>}
      />
    </SafeAreaView>
  );
}

function Column({ children, className }: { children: ReactElement | ReactElement[] | null; className?: string }) {
  return <View className={`w-full max-w-[480px] self-center ${className ?? ''}`}>{children}</View>;
}
