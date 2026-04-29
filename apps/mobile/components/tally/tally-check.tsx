import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, tapTargetMin } from '@studio-fit/design-tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const VISUAL_SIZE = 28;
const STROKE = 1.5;
const TICK_LENGTH = 38;

const tickPath = `M ${VISUAL_SIZE * 0.2} ${VISUAL_SIZE * 0.78} L ${VISUAL_SIZE * 0.85} ${VISUAL_SIZE * 0.18}`;

type Props = {
  checked: boolean;
  onToggle?: (next: boolean) => void;
  disabled?: boolean;
  hapticsEnabled?: boolean;
};

export function TallyCheck({
  checked,
  onToggle,
  disabled,
  hapticsEnabled = true,
}: Props) {
  const drawn = useSharedValue(checked ? 0 : TICK_LENGTH);

  useEffect(() => {
    drawn.value = withTiming(checked ? 0 : TICK_LENGTH, { duration: 200 });
  }, [checked, drawn]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: drawn.value,
  }));

  const handlePress = () => {
    if (disabled) return;
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggle?.(!checked);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={(tapTargetMin - VISUAL_SIZE) / 2}
      style={styles.target}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={styles.visual}>
        <Svg width={VISUAL_SIZE} height={VISUAL_SIZE} viewBox={`0 0 ${VISUAL_SIZE} ${VISUAL_SIZE}`}>
          <Circle
            cx={VISUAL_SIZE / 2}
            cy={VISUAL_SIZE / 2}
            r={VISUAL_SIZE / 2 - STROKE}
            fill={checked ? colors.paper.creamDeep : 'transparent'}
            stroke={colors.ink.pencilLight}
            strokeWidth={STROKE}
          />
          <AnimatedPath
            d={tickPath}
            stroke={colors.ink.tally}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={TICK_LENGTH}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: tapTargetMin,
    height: tapTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visual: {
    width: VISUAL_SIZE,
    height: VISUAL_SIZE,
  },
});
