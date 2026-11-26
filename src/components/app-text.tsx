import { Text, type TextProps } from 'react-native';

import { Type, type ThemeColor, type TypeVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppTextProps = TextProps & {
  /** 글자 스타일 단계: display, title, body, bodyStrong, label, caption */
  variant?: TypeVariant;
  /** 글자 색 토큰 (기본: text) */
  color?: ThemeColor;
};

/** 앱의 모든 글자는 이 컴포넌트로 씁니다. 크기와 색이 디자인 토큰을 따라가요. */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return <Text style={[Type[variant], { color: theme[color] }, style]} {...rest} />;
}
