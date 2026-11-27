import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName =
  | 'home'
  | 'feed'
  | 'profile'
  | 'settings'
  | 'lock'
  | 'pin'
  | 'camera'
  | 'check'
  | 'plus'
  | 'search'
  | 'flag'
  | 'chevron-left';

type IconProps = { name: IconName; size?: number; color?: ThemeColor; strokeWidth?: number };

/** 선으로 그린 24×24 아이콘. 색은 디자인 토큰을 따릅니다. */
export function Icon({ name, size = 24, color = 'text', strokeWidth = 1.8 }: IconProps) {
  const theme = useTheme();
  const stroke = theme[color];
  const common = {
    stroke,
    strokeWidth,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'home' ? <Path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z" {...common} /> : null}
      {name === 'feed' ? (
        <>
          <Rect x={4} y={4} width={16} height={7} rx={2} {...common} />
          <Rect x={4} y={13} width={16} height={7} rx={2} {...common} />
        </>
      ) : null}
      {name === 'profile' ? (
        <>
          <Circle cx={12} cy={8} r={4} {...common} />
          <Path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" {...common} />
        </>
      ) : null}
      {name === 'settings' ? (
        <>
          <Path d="M4 7h10M18 7h2M4 17h2M10 17h10" {...common} />
          <Circle cx={16} cy={7} r={2} {...common} />
          <Circle cx={8} cy={17} r={2} {...common} />
        </>
      ) : null}
      {name === 'lock' ? (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...common} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...common} />
        </>
      ) : null}
      {name === 'pin' ? (
        <>
          <Path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" {...common} />
          <Circle cx={12} cy={10} r={2.3} {...common} />
        </>
      ) : null}
      {name === 'camera' ? (
        <>
          <Rect x={3} y={7} width={18} height={13} rx={2} {...common} />
          <Path d="M8.5 7 10 4.5h4L15.5 7" {...common} />
          <Circle cx={12} cy={13.5} r={3.3} {...common} />
        </>
      ) : null}
      {name === 'check' ? <Path d="m5 12.5 4.5 4.5L19 7.5" {...common} /> : null}
      {name === 'plus' ? <Path d="M12 5v14M5 12h14" {...common} /> : null}
      {name === 'search' ? (
        <>
          <Circle cx={11} cy={11} r={6.5} {...common} />
          <Path d="m16 16 4 4" {...common} />
        </>
      ) : null}
      {name === 'flag' ? <Path d="M5.5 21V4h11l-2 4 2 4h-11" {...common} /> : null}
      {name === 'chevron-left' ? <Path d="m15 5-7 7 7 7" {...common} /> : null}
    </Svg>
  );
}
