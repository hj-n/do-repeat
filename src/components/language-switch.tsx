import { useTranslation } from 'react-i18next';

import { Segmented } from '@/components/segmented';
import type { AppLanguage } from '@/i18n';
import { useAppStore } from '@/store/app-store';

/** EN | 한국어 전환. 고르면 기기 언어 대신 그 언어로 고정됩니다. */
export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const setLanguage = useAppStore((s) => s.setLanguage);
  return (
    <Segmented<AppLanguage>
      accessibilityLabel={t('settings.language')}
      value={i18n.language === 'ko' ? 'ko' : 'en'}
      onChange={setLanguage}
      options={[
        { value: 'en', label: 'EN' },
        { value: 'ko', label: '한국어' },
      ]}
    />
  );
}
