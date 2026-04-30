import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, tapTargetMin } from '@studio-fit/design-tokens';
import { WavyDivider } from '@/components/divider';
import { ChevronLeftIcon, PencilIcon } from '@/components/icons';
import { NumberPad } from '@/components/number-pad';
import { PaperCard } from '@/components/paper-card';
import { LiftRow, type EditTarget } from '@/components/program';
import { useTodayProgram } from '@/lib/db/use-today-program';
import type { Program } from '@/lib/mock-data/today-program';

export default function TodayScreen() {
  const { program, toggleSet, updateActualReps, updateLiftWeight, updateStatus } =
    useTodayProgram();
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
      {program.status === 'draft' ? (
        <EmptyState />
      ) : (
        <ProgramView
          program={program}
          editTarget={editTarget}
          onToggleSet={toggleSet}
          onPressReps={(liftId, setIndex) =>
            setEditTarget({ kind: 'reps', liftId, setIndex })
          }
          onPressWeight={liftId => setEditTarget({ kind: 'weight', liftId })}
          onComplete={() => updateStatus('completed')}
        />
      )}

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

type ProgramViewProps = {
  program: Program;
  editTarget: EditTarget | null;
  onToggleSet: (liftId: string, setIndex: number, next: boolean) => void;
  onPressReps: (liftId: string, setIndex: number) => void;
  onPressWeight: (liftId: string) => void;
  onComplete: () => void;
};

function ProgramView({
  program,
  editTarget,
  onToggleSet,
  onPressReps,
  onPressWeight,
  onComplete,
}: ProgramViewProps) {
  const allComplete = program.lifts.every(lift => lift.sets.every(s => s.completed));
  const isCompleted = program.status === 'completed';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <PaperCard ruled margin>
        {isCompleted ? <CompletedLabel dateLabel={program.dateShort} /> : null}
        {program.lifts.map(lift => (
          <LiftRow
            key={lift.id}
            lift={lift}
            activeTarget={editTarget}
            onToggleSet={onToggleSet}
            onPressReps={onPressReps}
            onPressWeight={onPressWeight}
          />
        ))}
        {allComplete && !isCompleted ? (
          <CompletionFooter dateLabel={program.dateShort} onComplete={onComplete} />
        ) : null}
      </PaperCard>
    </ScrollView>
  );
}

function CompletionFooter({
  dateLabel,
  onComplete,
}: {
  dateLabel: string;
  onComplete: () => void;
}) {
  return (
    <View style={styles.completionFooter}>
      <WavyDivider />
      <Text style={styles.niceWork}>Nice work — {dateLabel}</Text>
      <Pressable style={styles.completeButton} onPress={onComplete}>
        <Text style={styles.completeButtonText}>Mark session complete</Text>
      </Pressable>
    </View>
  );
}

function CompletedLabel({ dateLabel }: { dateLabel: string }) {
  return (
    <View style={styles.completedLabel}>
      <Text style={styles.completedText}>Completed · {dateLabel}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <PencilIcon size={96} color={colors.iron.light} />
      </View>
      <Text style={styles.emptyHeadline}>Your program isn't ready yet.</Text>
      <Text style={styles.emptyBody}>
        Hang tight — your trainer will share it soon.
      </Text>
    </View>
  );
}

function TopBar({ dateLabel }: { dateLabel: string }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.iconButton} hitSlop={8}>
        <ChevronLeftIcon size={28} color={colors.iron.stencil} />
      </Pressable>
      <Text style={styles.dateLabel} numberOfLines={1}>
        {dateLabel}
      </Text>
      <Pressable style={styles.iconButton} hitSlop={8}>
        <PencilIcon size={22} color={colors.paper.margin} />
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
  completionFooter: {
    marginTop: spacing[3],
    gap: spacing[3],
  },
  niceWork: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.ink.pencil,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: colors.rust.base,
    borderRadius: 8,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  completeButtonText: {
    fontFamily: fontFamilies.block,
    fontSize: 16,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  completedLabel: {
    alignSelf: 'flex-end',
    backgroundColor: colors.iron.base,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: spacing[3],
  },
  completedText: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing[5],
  },
  emptyHeadline: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.iron.stencil,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  emptyBody: {
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    color: colors.iron.stencil,
    textAlign: 'center',
    lineHeight: 26,
  },
});
