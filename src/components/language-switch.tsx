import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppStore } from '@/store/app-store';

/** 다른 언어 이름을 보여주는 링크: 한국어 화면에서는 "English", 영어 화면에서는 "한국어" */
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const other = i18n.language === 'ko' ? 'en' : 'ko';
  return (
    <Button variant="link" size="sm" className="px-0" accessibilityLabel={t('settings.language')} onPress={() => setLanguage(other)}>
      <Text>{t(`language.${other}`)}</Text>
    </Button>
  );
}
