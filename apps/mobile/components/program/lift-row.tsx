import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { PencilStrikethrough } from '@/components/strikethrough';
import { TallyCheck } from '@/components/tally';
import type { Lift, SetEntry } from '@/lib/mock-data/today-program';

export type EditTarget =
  | { kind: 'reps'; liftId: string; setIndex: number }
  | { kind: 'weight'; liftId: string };

type Props = {
  lift: Lift;
  onToggleSet?: (liftId: string, setIndex: number, next: boolean) => void;
  onPressReps?: (liftId: string, setIndex: number) => void;
  onPressWeight?: (liftId: string) => void;
  activeTarget?: EditTarget | null;
};

export function LiftRow({
  lift,
  onToggleSet,
  onPressReps,
  onPressWeight,
  activeTarget,
}: Props) {
  const weightActive =
    activeTarget?.kind === 'weight' && activeTarget.liftId === lift.id;

  const homogeneous = isHomogeneous(lift.sets);
  const headerWeight = homogeneous
    ? formatCompactHeader(lift.defaultWeight, lift.sets)
    : lift.defaultWeight;

  return (
    <View style={styles.lift}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{lift.name}</Text>
        {headerWeight ? (
          <Pressable onPress={() => onPressWeight?.(lift.id)} hitSlop={8}>
            <Text style={[styles.weight, weightActive && styles.activeText]}>
              {headerWeight}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.setsRow}>
        {lift.sets.map((set, idx) => {
          const isActive =
            activeTarget?.kind === 'reps' &&
            activeTarget.liftId === lift.id &&
            activeTarget.setIndex === idx;
          const showReps = !homogeneous || set.actualReps !== undefined;
          return (
            <SetCell
              key={idx}
              set={set}
              active={isActive}
              showReps={showReps}
              onToggle={next => onToggleSet?.(lift.id, idx, next)}
              onPressReps={() => onPressReps?.(lift.id, idx)}
            />
          );
        })}
      </View>
    </View>
  );
}

function isHomogeneous(sets: SetEntry[]) {
  if (sets.length === 0) return false;
  const first = sets[0];
  return sets.every(
    s =>
      s.prescribedReps === first.prescribedReps &&
      s.unit === first.unit &&
      s.actualReps === undefined,
  );
}

function formatCompactHeader(weight: string | undefined, sets: SetEntry[]) {
  const reps = sets[0]?.prescribedReps;
  const count = sets.length;
  const unitSuffix = sets[0]?.unit === 'sec' ? ' sec' : '';
  const repsLabel = `${reps}${unitSuffix}`;
  if (!weight) {
    return `${repsLabel} × ${count}`;
  }
  return `${weight} × ${repsLabel} × ${count}`;
}

function SetCell({
  set,
  active,
  showReps,
  onToggle,
  onPressReps,
}: {
  set: SetEntry;
  active?: boolean;
  showReps: boolean;
  onToggle?: (next: boolean) => void;
  onPressReps?: () => void;
}) {
  const showStrike = set.actualReps !== undefined && set.actualReps !== set.prescribedReps;
  const unitSuffix = set.unit === 'sec' ? ' sec' : '';
  const displayValue = set.actualReps ?? set.prescribedReps;

  return (
    <View style={styles.set}>
      <TallyCheck checked={set.completed} onToggle={onToggle} />
      {showReps ? (
        <Pressable onPress={onPressReps} hitSlop={8}>
          {showStrike ? (
            <PencilStrikethrough
              prescribed={`${set.prescribedReps}${unitSuffix}`}
              actual={`${set.actualReps}${unitSuffix}`}
              fontSize={20}
            />
          ) : (
            <Text style={[styles.reps, active && styles.activeText]}>
              {displayValue}
              {unitSuffix}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  lift: {
    marginBottom: spacing[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  name: {
    fontFamily: fontFamilies.pencil,
    fontSize: 22,
    color: colors.ink.pencil,
  },
  weight: {
    fontFamily: fontFamilies.pencil,
    fontSize: 20,
    color: colors.ink.pencilLight,
  },
  setsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    rowGap: spacing[2],
  },
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reps: {
    fontFamily: fontFamilies.pencil,
    fontSize: 20,
    color: colors.ink.pencil,
  },
  activeText: {
    color: colors.rust.base,
  },
});
