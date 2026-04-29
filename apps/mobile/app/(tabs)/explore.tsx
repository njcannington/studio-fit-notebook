import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { NumberPad } from '@/components/number-pad';

type EditTarget = {
  label: string;
  initialValue: string;
  allowDecimal: boolean;
  unitLabel?: string;
};

const TARGETS: EditTarget[] = [
  { label: 'Reps', initialValue: '7', allowDecimal: false },
  { label: 'Weight (lb)', initialValue: '35', allowDecimal: true, unitLabel: 'lb' },
  { label: 'Duration', initialValue: '20', allowDecimal: false, unitLabel: 'sec' },
];

export default function NumberPadDemoScreen() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [values, setValues] = useState(TARGETS.map(t => t.initialValue));

  const active = activeIndex !== null ? TARGETS[activeIndex] : null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.title}>Number pad demo</Text>
        <Text style={styles.subtitle}>Tap a value to open the keypad.</Text>

        {TARGETS.map((target, idx) => (
          <Pressable
            key={target.label}
            style={styles.row}
            onPress={() => setActiveIndex(idx)}
          >
            <Text style={styles.rowLabel}>{target.label}</Text>
            <Text style={styles.rowValue}>
              {values[idx]}
              {target.unitLabel ? ` ${target.unitLabel}` : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      <NumberPad
        visible={activeIndex !== null}
        initialValue={active?.initialValue ?? '0'}
        allowDecimal={active?.allowDecimal}
        unitLabel={active?.unitLabel}
        onCancel={() => setActiveIndex(null)}
        onCommit={value => {
          if (activeIndex !== null) {
            setValues(current => current.map((v, i) => (i === activeIndex ? value : v)));
          }
          setActiveIndex(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  content: {
    padding: spacing[5],
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    color: colors.paper.cream,
    textShadowColor: colors.rust.base,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.iron.base,
    borderRadius: 8,
    marginBottom: spacing[3],
  },
  rowLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
  },
  rowValue: {
    fontFamily: fontFamilies.pencil,
    fontSize: 22,
    color: colors.paper.cream,
  },
});
