import { useSyncExternalStore } from 'react';

type Scheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * 웹에서는 OS 설정(prefers-color-scheme)과 함께,
 * 미리보기 페이지가 <html data-theme="dark|light">로 지정한 테마도 따릅니다.
 */
function getScheme(): Scheme {
  if (typeof document === 'undefined') return 'light';
  const forced = document.documentElement.getAttribute('data-theme');
  if (forced === 'dark' || forced === 'light') return forced;
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia?.(DARK_QUERY);
  media?.addEventListener('change', onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => {
    media?.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

export function useColorScheme(): Scheme {
  return useSyncExternalStore(subscribe, getScheme, () => 'light');
}
