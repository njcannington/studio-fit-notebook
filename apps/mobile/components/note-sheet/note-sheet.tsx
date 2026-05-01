import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  title?: string;
  placeholder?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
};

export function NoteSheet({
  visible,
  initialValue,
  title,
  placeholder,
  onCommit,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(initialValue);
  const translateY = useSharedValue(0);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    if (visible) setDraft(initialValue);
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

  const commit = () => {
    onCommit(draft.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
          pointerEvents="box-none"
        >
          <Pressable onPress={e => e.stopPropagation()} style={styles.sheetWrapper}>
            <Animated.View
              style={[styles.sheet, sheetStyle]}
              onLayout={onSheetLayout}
            >
              <SafeAreaView edges={['bottom']}>
                {title ? <Text style={styles.title}>{title}</Text> : null}
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder={placeholder ?? 'Add a note'}
                  placeholderTextColor={colors.ink.pencilFaded}
                  style={styles.input}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                />
                <View style={styles.actions}>
                  {initialValue ? (
                    <Pressable
                      onPress={() => onCommit('')}
                      hitSlop={8}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  ) : null}
                  <View style={styles.flex} />
                  <Pressable onPress={onCancel} hitSlop={8} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={commit} hitSlop={8} style={styles.doneButton}>
                    <Text style={styles.doneText}>Done</Text>
                  </Pressable>
                </View>
              </SafeAreaView>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  input: {
    backgroundColor: colors.iron.base,
    color: colors.paper.cream,
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: 8,
    minHeight: 120,
    marginBottom: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  deleteButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  deleteText: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.rust.base,
  },
  cancelButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  cancelText: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
  },
  doneButton: {
    backgroundColor: colors.rust.base,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 6,
  },
  doneText: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.paper.cream,
    fontWeight: '600',
  },
});
