/**
 * Do Repeat 디자인 토큰
 *
 * 색, 글자 크기, 간격, 모서리 둥글기를 여기 한 곳에서 관리합니다.
 * 디자인을 바꾸고 싶으면 이 파일의 값만 바꾸면 앱 전체에 반영돼요.
 */

/**
 * 색은 Apple Human Interface Guidelines의 시스템 색을 기준으로 맞췄어요.
 * https://developer.apple.com/design/human-interface-guidelines/color
 * - 바탕·글자·구분선: iOS 시스템 회색 단계 (systemBackground, Gray 2~6, separator)
 * - 대표 색: 처음 정한 파란색 (라이트 #2F49D1 / 다크 #8496FF)
 * - 빨강: 오류와 좋아요에만, 덜 튀는 값
 * 대표 색을 바꾸려면 accent / onAccent / accentSoft 세 값만 바꾸면 돼요.
 */
export const Colors = {
  light: {
    /** 화면 전체 바탕 (systemBackground) */
    background: '#FFFFFF',
    /** 탭 막대 같은 면 */
    surface: '#FFFFFF',
    /** 칩, 입력칸, 선택 막대의 바탕 (Gray 6) */
    surfaceMuted: '#F2F2F7',
    /** 구분선, 빈 체크 동그라미 (Gray 3) */
    border: '#C7C7CC',
    text: '#000000',
    /** 보조 글자 (Gray, 고대비) */
    textMuted: '#6C6C70',
    /** 대표 색: 주요 버튼, N일째, 이번 주에 한 날 */
    accent: '#2F49D1',
    /** 대표 색 위에 올라가는 글자 */
    onAccent: '#FFFFFF',
    /** 대표 색의 옅은 바탕 (프로필 동그라미) */
    accentSoft: '#E4E8FB',
    /** 오류, 좋아요 */
    danger: '#C93A40',
    dangerSoft: '#FBE7E8',
  },
  dark: {
    background: '#000000',
    /** (Gray 6) */
    surface: '#1C1C1E',
    /** (Gray 5) */
    surfaceMuted: '#2C2C2E',
    /** (separator) */
    border: '#38383A',
    text: '#FFFFFF',
    /** (Gray) */
    textMuted: '#8E8E93',
    accent: '#8496FF',
    onAccent: '#000000',
    accentSoft: '#1D2244',
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
