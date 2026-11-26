/**
 * Do Repeat 디자인 토큰
 *
 * 색, 글자 크기, 간격, 모서리 둥글기를 여기 한 곳에서 관리합니다.
 * 디자인을 바꾸고 싶으면 이 파일의 값만 바꾸면 앱 전체에 반영돼요.
 */

export const Colors = {
  light: {
    /** 화면 전체 바탕 */
    background: '#F4F5F7',
    /** 카드, 입력창 같은 면 */
    surface: '#FFFFFF',
    /** 선택 안 된 칩, 비활성 버튼 바탕 */
    surfaceMuted: '#E9EBEF',
    border: '#DCDFE5',
    text: '#14161B',
    textMuted: '#5E6472',
    /** 대표 색: 버튼, 선택 표시, 연속 일수 */
    accent: '#2F49D1',
    /** 대표 색 위에 올라가는 글자 */
    onAccent: '#FFFFFF',
    /** 선택된 카드의 옅은 바탕 */
    accentSoft: '#E4E8FB',
    /** 오류, 실패 안내 */
    danger: '#C93A40',
    dangerSoft: '#FBE7E8',
  },
  dark: {
    background: '#0F1115',
    surface: '#181B21',
    surfaceMuted: '#22262E',
    border: '#2C313A',
    text: '#F1F2F5',
    textMuted: '#9AA1AE',
    accent: '#8496FF',
    onAccent: '#0F1115',
    accentSoft: '#212849',
    danger: '#FF7B81',
    dangerSoft: '#3A1E21',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

/** 글자 스타일 단계 (크기 / 줄 높이 / 굵기) */
export const Type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
} as const;

export type TypeVariant = keyof typeof Type;

/** 간격 (4의 배수) */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/** 태블릿이나 웹에서 화면이 너무 넓어지지 않게 하는 최대 폭 */
export const MaxContentWidth = 480;
