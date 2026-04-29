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

type Props = {
  visible: boolean;
  initialValue: string;
  allowDecimal?: boolean;
  unitLabel?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
};

const KEY_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function NumberPad({
  visible,
  initialValue,
  allowDecimal,
  unitLabel,
  onCommit,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(initialValue);
  const [replaceOnNextKey, setReplaceOnNextKey] = useState(true);
  const translateY = useSharedValue(0);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      setDraft(initialValue);
      setReplaceOnNextKey(true);
    }
  }, [visible, initialValue]);

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

  const pressDigit = (digit: string) => {
    if (replaceOnNextKey) {
      setDraft(digit);
      setReplaceOnNextKey(false);
    } else {
      setDraft(prev => (prev === '0' ? digit : prev + digit));
    }
  };

  const pressDecimal = () => {
    if (replaceOnNextKey) {
      setDraft('0.');
      setReplaceOnNextKey(false);
      return;
    }
    if (!draft.includes('.')) {
      setDraft(prev => (prev.length === 0 ? '0.' : prev + '.'));
    }
  };

  const pressBackspace = () => {
    setReplaceOnNextKey(false);
    setDraft(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const commit = () => {
    onCommit(draft);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          onPress={e => e.stopPropagation()}
          style={styles.sheetWrapper}
        >
          <Animated.View
            style={[styles.sheet, sheetStyle]}
            onLayout={onSheetLayout}
          >
            <SafeAreaView edges={['bottom']}>
              <View style={styles.preview}>
                <Text style={styles.previewValue}>{draft || '0'}</Text>
                {unitLabel ? <Text style={styles.previewUnit}>{unitLabel}</Text> : null}
              </View>

              {KEY_LAYOUT.map(row => (
                <View key={row.join('')} style={styles.row}>
                  {row.map(digit => (
                    <KeypadKey key={digit} label={digit} onPress={() => pressDigit(digit)} />
                  ))}
                </View>
              ))}

              <View style={styles.row}>
                <KeypadKey
                  label="."
                  onPress={pressDecimal}
                  disabled={!allowDecimal}
                />
                <KeypadKey label="0" onPress={() => pressDigit('0')} />
                <KeypadKey label="⌫" onPress={pressBackspace} />
              </View>

              <Pressable style={styles.doneButton} onPress={commit}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function KeypadKey({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.key,
        pressed && !disabled ? styles.keyPressed : null,
        disabled ? styles.keyDisabled : null,
      ]}
    >
      <Text style={[styles.keyLabel, disabled ? styles.keyLabelDisabled : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
  preview: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  previewValue: {
    fontFamily: fontFamilies.pencil,
    fontSize: 36,
    color: colors.paper.cream,
  },
  previewUnit: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    color: colors.ink.pencilFaded,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  key: {
    flex: 1,
    height: 56,
    backgroundColor: colors.iron.base,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: colors.iron.light,
  },
  keyDisabled: {
    backgroundColor: 'transparent',
  },
  keyLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 22,
    color: colors.iron.stencil,
  },
  keyLabelDisabled: {
    color: colors.iron.light,
  },
  doneButton: {
    height: 52,
    backgroundColor: colors.rust.base,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  doneText: {
    fontFamily: fontFamilies.block,
    fontSize: 18,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
});
