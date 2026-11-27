import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/empty-state';
import { ListScreen } from '@/components/list-screen';
import { Segmented } from '@/components/segmented';
import { TopBar } from '@/components/top-bar';
import { SAMPLE_PEOPLE } from '@/data/sample-people';
import { FollowButton } from '@/features/social/follow-button';
import { PersonRow } from '@/features/social/person-row';
import { useAppStore } from '@/store/app-store';

type Tab = 'followers' | 'following';

/** 내 팔로워 / 팔로잉 목록 */
export default function FollowsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(params.tab === 'following' ? 'following' : 'followers');
  const username = useAppStore((s) => s.profile.username);
  const ids = useAppStore((s) => (tab === 'followers' ? s.social.followers : s.social.following));
  const people = SAMPLE_PEOPLE.filter((p) => ids.includes(p.id));

  return (
    <ListScreen
      data={people}
      gap={0}
      keyExtractor={(p) => p.id}
      renderItem={(person) => <PersonRow person={person} right={<FollowButton person={person} />} />}
      header={
        <>
          <TopBar title={`@${username}`} fallback="/profile" />
          <Segmented<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'followers', label: t('profile.followers') },
              { value: 'following', label: t('profile.following') },
            ]}
          />
        </>
      }
      empty={
        <EmptyState body={tab === 'followers' ? t('follows.emptyFollowers') : t('follows.emptyFollowing')} />
      }
    />
  );
}
