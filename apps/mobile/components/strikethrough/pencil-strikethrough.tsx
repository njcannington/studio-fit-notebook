import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type TextStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fontFamilies } from '@studio-fit/design-tokens';

type Props = {
  prescribed: string | number;
  actual: string | number;
  fontSize?: number;
  textStyle?: TextStyle;
};

export function PencilStrikethrough({
  prescribed,
  actual,
  fontSize = 18,
  textStyle,
}: Props) {
  const [struckSize, setStruckSize] = useState({ width: 0, height: 0 });

  const onStruckLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setStruckSize({ width, height });
  };

  return (
    <View style={styles.row}>
      <View>
        <Text
          onLayout={onStruckLayout}
          style={[
            styles.prescribed,
            textStyle,
            { fontSize, color: colors.ink.pencilFaded },
          ]}
        >
          {prescribed}
        </Text>
        {struckSize.width > 0 ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: 'center' },
            ]}
          >
            <WavyStroke width={struckSize.width} height={struckSize.height} />
          </View>
        ) : null}
      </View>
      <Text style={[styles.actual, textStyle, { fontSize, color: colors.ink.pencil }]}>
        {actual}
      </Text>
    </View>
  );
}

function WavyStroke({ width, height }: { width: number; height: number }) {
  const y = height * 0.55;
  const amplitude = Math.max(0.6, height * 0.04);
  const points = 4;

  let d = `M 0 ${y}`;
  for (let i = 1; i <= points; i++) {
    const x = (width * i) / points;
    const direction = i % 2 === 0 ? 1 : -1;
    const cx = (width * (i - 0.5)) / points;
    const cy = y + amplitude * direction;
    d += ` Q ${cx} ${cy} ${x} ${y}`;
  }

  return (
    <Svg width={width} height={height}>
      <Path
        d={d}
        stroke={colors.ink.pencilLight}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  prescribed: {
    fontFamily: fontFamilies.pencil,
  },
  actual: {
    fontFamily: fontFamilies.pencil,
  },
});
