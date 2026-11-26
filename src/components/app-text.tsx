import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { Type, type ThemeColor, type TypeVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppTextProps = TextProps & {
  /** 글자 스타일 단계: display, title, body, bodyStrong, label, caption */
  variant?: TypeVariant;
  /** 글자 색 토큰 (기본: text) */
  color?: ThemeColor;
};

/** 한국어가 단어 중간에서 줄바꿈되지 않게 (웹: word-break, iOS: lineBreakStrategyIOS) */
const keepWords = Platform.OS === 'web' ? ({ wordBreak: 'keep-all' } as unknown as TextStyle) : null;

/** 앱의 모든 글자는 이 컴포넌트로 씁니다. 크기와 색이 디자인 토큰을 따라가요. */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return (
    <Text
      lineBreakStrategyIOS="hangul-word"
      style={[Type[variant], keepWords, { color: theme[color] }, style]}
      {...rest}
    />
  );
}
