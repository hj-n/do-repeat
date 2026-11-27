/**
 * 색 값의 JS 사본.
 *
 * 화면의 색은 src/global.css의 CSS 변수(shadcn 방식: bg-primary, text-muted-foreground 등)가 기준이에요.
 * 여기 값은 className을 못 쓰는 곳(탭 막대, 내비게이션 테마, 움직이는 도장)에서만 씁니다.
 * global.css를 바꾸면 여기도 같은 값으로 맞춰 주세요.
 */

/**
 * 색은 Apple Human Interface Guidelines의 시스템 색을 기준으로 맞췄어요.
 * https://developer.apple.com/design/human-interface-guidelines/color
 * - 바탕·글자·구분선: iOS 시스템 회색 단계 (systemBackground, Gray 2~6, separator)
 * - 대표 색: 처음 정한 파란색 (라이트 #2F49D1 / 다크 #8496FF)
 * - 빨강: 오류와 좋아요에만, 덜 튀는 값
 * 대표 색을 바꾸려면 global.css의 --color-primary와 여기 accent / onAccent / accentSoft를 함께 바꿔요.
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
