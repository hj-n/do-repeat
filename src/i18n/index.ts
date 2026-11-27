import 'intl-pluralrules';

import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import ko from './locales/ko';

export const SUPPORTED_LANGUAGES = ['en', 'ko'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
/** 설정 값: 기기 언어를 따르거나, 직접 고른 언어 */
export type LanguageSetting = 'system' | AppLanguage;

/** 기기 언어가 한국어면 ko, 그 외에는 모두 en */
export function deviceLanguage(): AppLanguage {
  try {
    return getLocales()[0]?.languageCode === 'ko' ? 'ko' : 'en';
  } catch {
    return 'en';
  }
}

export function resolveLanguage(setting: LanguageSetting): AppLanguage {
  return setting === 'system' ? deviceLanguage() : setting;
}

/** 날짜·숫자 포맷에 쓰는 지역 코드 */
export function localeTag(language: string): string {
  return language === 'ko' ? 'ko-KR' : 'en-US';
}

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ko: { translation: ko } },
  lng: deviceLanguage(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
  initAsync: false,
});

export default i18n;
