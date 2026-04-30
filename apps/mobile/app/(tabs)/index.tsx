import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, tapTargetMin } from '@studio-fit/design-tokens';
import { NumberPad } from '@/components/number-pad';
import { PaperCard } from '@/components/paper-card';
import { LiftRow, type EditTarget } from '@/components/program';
import { useTodayProgram } from '@/lib/db/use-today-program';

export default function TodayScreen() {
  const { program, toggleSet, updateActualReps, updateLiftWeight } = useTodayProgram();
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const editContext = useMemo(() => {
    if (!editTarget || !program) return null;
    const lift = program.lifts.find(l => l.id === editTarget.liftId);
    if (!lift) return null;
    if (editTarget.kind === 'reps') {
      const set = lift.sets[editTarget.setIndex];
      const current = set.actualReps ?? set.prescribedReps;
      return {
        initialValue: String(current),
        allowDecimal: false,
        unitLabel: set.unit === 'sec' ? 'sec' : undefined,
      };
    }
    return {
      initialValue: stripNonNumeric(lift.defaultWeight ?? '0'),
      allowDecimal: true,
      unitLabel: weightUnitFromLabel(lift.defaultWeight),
    };
  }, [editTarget, program]);

  const commit = (raw: string) => {
    if (!editTarget || !program) return;
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) {
      setEditTarget(null);
      return;
    }
    if (editTarget.kind === 'weight') {
      const lift = program.lifts.find(l => l.id === editTarget.liftId);
      const unit = weightUnitFromLabel(lift?.defaultWeight) ?? 'lb';
      updateLiftWeight(editTarget.liftId, `${formatNumber(parsed)} ${unit}`);
    } else {
      updateActualReps(editTarget.liftId, editTarget.setIndex, parsed);
    }
    setEditTarget(null);
  };

  if (!program) {
    return <SafeAreaView style={styles.root} edges={['top', 'left', 'right']} />;
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <TopBar dateLabel={program.dateShort} />
      <ScrollView contentContainerStyle={styles.content}>
        <PaperCard ruled margin>
          {program.lifts.map(lift => (
            <LiftRow
              key={lift.id}
              lift={lift}
              activeTarget={editTarget}
              onToggleSet={toggleSet}
              onPressReps={(liftId, setIndex) =>
                setEditTarget({ kind: 'reps', liftId, setIndex })
              }
              onPressWeight={liftId => setEditTarget({ kind: 'weight', liftId })}
            />
          ))}
        </PaperCard>
      </ScrollView>

      <NumberPad
        visible={editTarget !== null}
        initialValue={editContext?.initialValue ?? '0'}
        allowDecimal={editContext?.allowDecimal}
        unitLabel={editContext?.unitLabel}
        onCancel={() => setEditTarget(null)}
        onCommit={commit}
      />
    </SafeAreaView>
  );
}

function TopBar({ dateLabel }: { dateLabel: string }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.iconButton} hitSlop={8}>
        <Text style={styles.iconText}>‹</Text>
      </Pressable>
      <Text style={styles.dateLabel} numberOfLines={1}>
        {dateLabel}
      </Text>
      <Pressable style={styles.iconButton} hitSlop={8}>
        <Text style={styles.syncText}>✎</Text>
      </Pressable>
    </View>
  );
}

function stripNonNumeric(weight: string) {
  const match = weight.match(/[\d.]+/);
  return match ? match[0] : '0';
}

function weightUnitFromLabel(weight: string | undefined) {
  if (!weight) return undefined;
  if (/lb/i.test(weight)) return 'lb';
  if (/kg/i.test(weight)) return 'kg';
  return undefined;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.iron.light,
  },
  iconButton: {
    width: tapTargetMin,
    height: tapTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.iron.stencil,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: fontFamilies.block,
  },
  syncText: {
    color: colors.paper.margin,
    fontSize: 18,
    fontFamily: fontFamilies.pencil,
  },
  dateLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.paper.cream,
  },
  content: {
    padding: spacing[4],
  },
});
