import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { TopBar } from '@/components/top-bar';
import { Spacing } from '@/constants/theme';
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
      gap={0}
      keyExtractor={(p) => p.id}
      renderItem={(person) => (
        <PersonRow
          person={person}
          right={
            <View style={styles.actions}>
              <Button size="small" label={t('requests.accept')} onPress={() => accept(person.id)} />
              <Button size="small" kind="secondary" label={t('requests.decline')} onPress={() => decline(person.id)} />
            </View>
          }
        />
      )}
      header={<TopBar title={t('requests.title')} fallback="/profile" />}
      empty={<EmptyState body={t('requests.empty')} />}
    />
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: Spacing.xs },
});
