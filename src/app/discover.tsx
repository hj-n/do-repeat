import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { TopBar } from '@/components/top-bar';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { SAMPLE_PEOPLE } from '@/data/sample-people';
import { FollowButton } from '@/features/social/follow-button';
import { PersonRow } from '@/features/social/person-row';

/** 사람 찾기: 이름이나 @아이디로 검색해서 팔로우 */
export default function DiscoverScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const q = query.trim().replace(/^@/, '').toLowerCase();
  const people = SAMPLE_PEOPLE.filter((p) => !q || p.username.includes(q) || p.displayName.toLowerCase().includes(q));

  return (
    <ListScreen
      data={people}
      keyExtractor={(p) => p.id}
      renderItem={(person) => <PersonRow person={person} right={<FollowButton person={person} />} />}
      header={
        <>
          <TopBar title={t('discover.title')} fallback="/feed" />
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={t('discover.searchPlaceholder')}
            accessibilityLabel={t('discover.searchPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          <Text variant="muted" className="text-xs">
            {t('feed.sampleNote')}
          </Text>
        </>
      }
      empty={<EmptyState body={t('discover.noResults', { query: query.trim() })} />}
    />
  );
}
