import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color: string;
};

export function ChevronLeftIcon({ size = 24, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M15 18 L9 12 L15 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function PencilIcon({ size = 24, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 20 L8 19 L20 7 L17 4 L5 16 L4 20 Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M14 7 L17 10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PenIcon({ size = 24, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 20 L8 19 L19 8 L16 5 L5 16 L4 20 Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.15}
      />
      <Path
        d="M13 8 L16 11"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
