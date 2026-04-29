import { useState } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors, spacing } from '@studio-fit/design-tokens';

const RULE_SPACING = 24;
const MARGIN_OFFSET = 36;

type Props = {
  children: React.ReactNode;
  ruled?: boolean;
  margin?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PaperCard({ children, ruled, margin, style }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={[styles.card, style]} onLayout={onLayout}>
      {ruled && size.height > 0 ? <Rules width={size.width} height={size.height} /> : null}
      {margin && size.height > 0 ? <Margin height={size.height} /> : null}
      <View style={margin ? styles.contentWithMargin : null}>{children}</View>
    </View>
  );
}

function Rules({ width, height }: { width: number; height: number }) {
  const lines: number[] = [];
  for (let y = RULE_SPACING; y < height; y += RULE_SPACING) {
    lines.push(y);
  }
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {lines.map(y => (
        <Line
          key={y}
          x1={0}
          x2={width}
          y1={y}
          y2={y}
          stroke={colors.paper.rule}
          strokeWidth={0.75}
        />
      ))}
    </Svg>
  );
}

function Margin({ height }: { height: number }) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.marginLine,
        { height, backgroundColor: colors.paper.margin },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper.cream,
    borderRadius: 8,
    padding: spacing[5],
    shadowColor: '#1A1410',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  contentWithMargin: {
    paddingLeft: MARGIN_OFFSET - spacing[5],
  },
  marginLine: {
    position: 'absolute',
    top: 0,
    left: MARGIN_OFFSET,
    width: 1,
  },
});
