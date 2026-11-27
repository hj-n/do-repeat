import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { Person } from '@/data/sample-people';
import { useAppStore, useFollowStatus } from '@/store/app-store';

/** 팔로우 → (비공개 계정이면) 요청됨 → 팔로잉. 다시 누르면 취소/언팔로우 */
export function FollowButton({ person }: { person: Person }) {
  const { t } = useTranslation();
  const status = useFollowStatus(person.id);
  const follow = useAppStore((s) => s.follow);
  const unfollow = useAppStore((s) => s.unfollow);

  if (status === 'none') {
    return (
      <Button size="sm" className="rounded-full px-4" onPress={() => follow(person.id, person.isPrivate)}>
        <Text>{t('user.follow')}</Text>
      </Button>
    );
  }
  return (
    <Button size="sm" variant="secondary" className="rounded-full px-4" onPress={() => unfollow(person.id)}>
      <Text>{status === 'requested' ? t('user.requested') : t('user.following')}</Text>
    </Button>
  );
}
