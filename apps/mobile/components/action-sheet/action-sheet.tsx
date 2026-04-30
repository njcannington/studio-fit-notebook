import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';

export type ActionItem = {
  id: string;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
};

type Props = {
  visible: boolean;
  title?: string;
  actions: ActionItem[];
  onSelect: (id: string) => void;
  onCancel: () => void;
};

export function ActionSheet({ visible, title, actions, onSelect, onCancel }: Props) {
  const translateY = useSharedValue(0);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : sheetHeight, { duration: 200 });
  }, [visible, sheetHeight, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const onSheetLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setSheetHeight(height);
    if (!visible) {
      translateY.value = height;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable onPress={e => e.stopPropagation()} style={styles.sheetWrapper}>
          <Animated.View
            style={[styles.sheet, sheetStyle]}
            onLayout={onSheetLayout}
          >
            <SafeAreaView edges={['bottom']}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {actions.map((action, idx) => (
                <Pressable
                  key={action.id}
                  onPress={() => onSelect(action.id)}
                  disabled={action.disabled}
                  style={({ pressed }) => [
                    styles.action,
                    idx > 0 && styles.actionDivider,
                    pressed && !action.disabled && styles.actionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionLabel,
                      action.destructive && styles.actionDestructive,
                      action.disabled && styles.actionDisabled,
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
              <Pressable onPress={onCancel} style={styles.cancel}>
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    backgroundColor: colors.iron.deep,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  title: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  action: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  actionDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.iron.light,
  },
  actionPressed: {
    backgroundColor: colors.iron.base,
  },
  actionLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 16,
    color: colors.paper.cream,
    letterSpacing: 0.5,
  },
  actionDestructive: {
    color: colors.rust.base,
  },
  actionDisabled: {
    color: colors.iron.light,
  },
  cancel: {
    marginTop: spacing[3],
    paddingVertical: spacing[3],
    alignItems: 'center',
    backgroundColor: colors.iron.base,
    borderRadius: 8,
  },
  cancelLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 16,
    color: colors.ink.pencilFaded,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
