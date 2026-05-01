import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
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
import type { LiftTemplate } from '@/lib/mock-data/lifts';

type Props = {
  visible: boolean;
  lifts: LiftTemplate[];
  onSelect: (lift: LiftTemplate) => void;
  onCancel: () => void;
};

export function LiftPickerSheet({ visible, lifts, onSelect, onCancel }: Props) {
  const [query, setQuery] = useState('');
  const translateY = useSharedValue(0);
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lifts
      .filter(l => (q ? l.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [lifts, query]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable onPress={e => e.stopPropagation()} style={styles.sheetWrapper}>
          <Animated.View
            style={[styles.sheet, sheetStyle]}
            onLayout={onSheetLayout}
          >
            <SafeAreaView edges={['bottom']}>
              <Text style={styles.title}>Add a lift</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search lifts"
                placeholderTextColor={colors.ink.pencilFaded}
                style={styles.search}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
              >
                {filtered.length === 0 ? (
                  <Text style={styles.empty}>No lifts match "{query}"</Text>
                ) : (
                  filtered.map((lift, idx) => (
                    <Pressable
                      key={lift.name}
                      onPress={() => onSelect(lift)}
                      style={({ pressed }) => [
                        styles.row,
                        idx > 0 && styles.rowDivider,
                        pressed && styles.rowPressed,
                      ]}
                    >
                      <Text style={styles.name}>{lift.name}</Text>
                      <Text style={styles.detail}>
                        {lift.defaultWeight} × {lift.defaultReps}
                        {lift.unit === 'sec' ? ' sec' : ''} × {lift.defaultSetCount}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
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
    maxHeight: '75%',
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
  search: {
    backgroundColor: colors.iron.base,
    color: colors.paper.cream,
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[3],
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: spacing[2],
  },
  empty: {
    fontFamily: fontFamilies.pencil,
    fontSize: 16,
    color: colors.ink.pencilFaded,
    textAlign: 'center',
    paddingVertical: spacing[5],
  },
  row: {
    paddingVertical: spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.iron.light,
  },
  rowPressed: {
    backgroundColor: colors.iron.base,
  },
  name: {
    fontFamily: fontFamilies.pencil,
    fontSize: 22,
    color: colors.paper.cream,
  },
  detail: {
    fontFamily: fontFamilies.pencil,
    fontSize: 13,
    color: colors.ink.pencilFaded,
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
