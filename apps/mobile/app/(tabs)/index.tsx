import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, tapTargetMin } from '@studio-fit/design-tokens';
import { NumberPad } from '@/components/number-pad';
import { PaperCard } from '@/components/paper-card';
import { LiftRow, type EditTarget } from '@/components/program';
import { todayProgram, type Program } from '@/lib/mock-data/today-program';

export default function TodayScreen() {
  const [program, setProgram] = useState<Program>(todayProgram);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const toggleSet = (liftId: string, setIndex: number, next: boolean) => {
    setProgram(current => ({
      ...current,
      lifts: current.lifts.map(lift =>
        lift.id === liftId
          ? {
              ...lift,
              sets: lift.sets.map((set, idx) =>
                idx === setIndex ? { ...set, completed: next } : set
              ),
            }
          : lift
      ),
    }));
  };

  const editContext = useMemo(() => {
    if (!editTarget) return null;
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
    if (!editTarget) return;
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) {
      setEditTarget(null);
      return;
    }
    setProgram(current => ({
      ...current,
      lifts: current.lifts.map(lift => {
        if (lift.id !== editTarget.liftId) return lift;
        if (editTarget.kind === 'weight') {
          const unit = weightUnitFromLabel(lift.defaultWeight) ?? 'lb';
          return { ...lift, defaultWeight: `${formatNumber(parsed)} ${unit}` };
        }
        return {
          ...lift,
          sets: lift.sets.map((set, idx) =>
            idx === editTarget.setIndex ? { ...set, actualReps: parsed } : set
          ),
        };
      }),
    }));
    setEditTarget(null);
  };

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
