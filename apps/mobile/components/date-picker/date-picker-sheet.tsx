import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
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
import type { Program } from '@/lib/mock-data/today-program';

type Props = {
  visible: boolean;
  programs: Program[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCancel: () => void;
};

export function DatePickerSheet({
  visible,
  programs,
  selectedId,
  onSelect,
  onCancel,
}: Props) {
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
              <Text style={styles.title}>Jump to date</Text>
              <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {programs.map((program, idx) => {
                  const active = program.id === selectedId;
                  return (
                    <Pressable
                      key={program.id}
                      onPress={() => onSelect(program.id)}
                      style={({ pressed }) => [
                        styles.row,
                        idx > 0 && styles.rowDivider,
                        pressed && styles.rowPressed,
                      ]}
                    >
                      <View>
                        <Text style={[styles.date, active && styles.dateActive]}>
                          {program.dateShort}
                        </Text>
                        <Text style={styles.subtitle}>
                          {program.lifts.length} lift{program.lifts.length === 1 ? '' : 's'}
                        </Text>
                      </View>
                      <StatusPill status={program.status} />
                    </Pressable>
                  );
                })}
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

function StatusPill({ status }: { status: Program['status'] }) {
  const palette = STATUS_COLORS[status];
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.pillText, { color: palette.fg }]}>{status}</Text>
    </View>
  );
}

const STATUS_COLORS = {
  draft: { bg: colors.iron.light, fg: colors.ink.pencilFaded },
  published: { bg: colors.paper.cream, fg: colors.ink.pencil },
  completed: { bg: colors.iron.base, fg: colors.ink.pencilLight },
} as const;

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
    maxHeight: '70%',
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
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: spacing[2],
  },
  row: {
    paddingVertical: spacing[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.iron.light,
  },
  rowPressed: {
    backgroundColor: colors.iron.base,
  },
  date: {
    fontFamily: fontFamilies.display,
    fontSize: 22,
    color: colors.paper.cream,
  },
  dateActive: {
    color: colors.rust.base,
  },
  subtitle: {
    fontFamily: fontFamilies.pencil,
    fontSize: 13,
    color: colors.ink.pencilFaded,
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
  },
  pillText: {
    fontFamily: fontFamilies.block,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
