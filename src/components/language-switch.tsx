import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { useAppStore } from '@/store/app-store';

/** 다른 언어 이름을 보여주는 글자 버튼: 한국어 화면에서는 "English", 영어 화면에서는 "한국어" */
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const other = i18n.language === 'ko' ? 'en' : 'ko';
  return (
    <Button
      kind="text"
      label={t(`language.${other}`)}
      accessibilityLabel={t('settings.language')}
      onPress={() => setLanguage(other)}
    />
  );
}
