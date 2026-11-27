import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import type { Person } from '@/data/sample-people';
import { useAppStore, useFollowStatus } from '@/store/app-store';

/** 팔로우 → (비공개 계정이면) 요청됨 → 팔로잉. 다시 누르면 취소/언팔로우 */
export function FollowButton({ person, size = 'small' }: { person: Person; size?: 'small' | 'regular' }) {
  const { t } = useTranslation();
  const status = useFollowStatus(person.id);
  const follow = useAppStore((s) => s.follow);
  const unfollow = useAppStore((s) => s.unfollow);

  if (status === 'none') {
    return <Button size={size} label={t('user.follow')} onPress={() => follow(person.id, person.isPrivate)} />;
  }
  return (
    <Button
      size={size}
      kind="secondary"
      label={status === 'requested' ? t('user.requested') : t('user.following')}
      onPress={() => unfollow(person.id)}
    />
  );
}
