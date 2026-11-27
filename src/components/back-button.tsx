import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from '@/lib/icons';

/** 뒤로 가기. 돌아갈 화면이 없으면 `fallback`으로 이동합니다. */
export function BackButton({ fallback = '/' }: { fallback?: Href }) {
  const { t } = useTranslation();
  return (
    <Button
      variant="ghost"
      size="icon"
      accessibilityLabel={t('common.back')}
      className="-ml-2"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}>
      <Icon as={ChevronLeft} className="text-muted-foreground size-6" />
    </Button>
  );
}
