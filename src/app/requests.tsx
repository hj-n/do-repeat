import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PEOPLE } from '@/data/sample-people';
import { PersonRow } from '@/features/social/person-row';
import { useAppStore } from '@/store/app-store';

/** 받은 팔로우 요청 (내 계정이 비공개일 때) */
export default function RequestsScreen() {
  const { t } = useTranslation();
  const incoming = useAppStore((s) => s.social.incoming);
  const accept = useAppStore((s) => s.acceptRequest);
  const decline = useAppStore((s) => s.declineRequest);
  const people = SAMPLE_PEOPLE.filter((p) => incoming.includes(p.id));

  return (
    <ListScreen
      data={people}
      keyExtractor={(p) => p.id}
      renderItem={(person) => (
        <PersonRow
          person={person}
          right={
            <View className="flex-row gap-1">
              <Button size="sm" className="rounded-full px-4" onPress={() => accept(person.id)}>
                <Text>{t('requests.accept')}</Text>
              </Button>
              <Button size="sm" variant="secondary" className="rounded-full px-4" onPress={() => decline(person.id)}>
                <Text>{t('requests.decline')}</Text>
              </Button>
            </View>
          }
        />
      )}
      header={<TopBar title={t('requests.title')} fallback="/profile" />}
      empty={<EmptyState body={t('requests.empty')} />}
    />
  );
}
