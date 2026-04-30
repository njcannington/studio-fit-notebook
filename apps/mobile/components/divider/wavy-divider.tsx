import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@studio-fit/design-tokens';

type Props = {
  color?: string;
  height?: number;
};

export function WavyDivider({ color = colors.ink.pencilLight, height = 12 }: Props) {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Path
            d={buildPath(width, height)}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
        </Svg>
      ) : null}
    </View>
  );
}

function buildPath(width: number, height: number) {
  const y = height / 2;
  const amplitude = Math.max(1.5, height * 0.25);
  const waves = Math.max(4, Math.floor(width / 28));
  let d = `M 0 ${y}`;
  for (let i = 1; i <= waves; i++) {
    const x = (width * i) / waves;
    const cx = (width * (i - 0.5)) / waves;
    const direction = i % 2 === 0 ? 1 : -1;
    const cy = y + amplitude * direction;
    d += ` Q ${cx} ${cy} ${x} ${y}`;
  }
  return d;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
