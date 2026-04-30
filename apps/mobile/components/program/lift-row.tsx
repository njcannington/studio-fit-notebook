import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { PencilStrikethrough } from '@/components/strikethrough';
import { TallyCheck } from '@/components/tally';
import type { Lift, SetEntry } from '@/lib/mock-data/today-program';

export type EditTarget =
  | { kind: 'reps'; liftId: string; setIndex: number }
  | { kind: 'weight'; liftId: string }
  | { kind: 'lift-reps'; liftId: string }
  | { kind: 'set-count'; liftId: string };

type Props = {
  lift: Lift;
  onToggleSet?: (liftId: string, setIndex: number, next: boolean) => void;
  onPressReps?: (liftId: string, setIndex: number) => void;
  onPressWeight?: (liftId: string) => void;
  onPressLiftReps?: (liftId: string) => void;
  onPressSetCount?: (liftId: string) => void;
  onLongPress?: (liftId: string) => void;
  activeTarget?: EditTarget | null;
  hideCircles?: boolean;
  readOnly?: boolean;
  isAdmin?: boolean;
};

export function LiftRow({
  lift,
  onToggleSet,
  onPressReps,
  onPressWeight,
  onPressLiftReps,
  onPressSetCount,
  onLongPress,
  activeTarget,
  hideCircles,
  readOnly,
  isAdmin,
}: Props) {
  const weightActive =
    activeTarget?.kind === 'weight' && activeTarget.liftId === lift.id;
  const liftRepsActive =
    activeTarget?.kind === 'lift-reps' && activeTarget.liftId === lift.id;
  const setCountActive =
    activeTarget?.kind === 'set-count' && activeTarget.liftId === lift.id;

  const homogeneous = isHomogeneous(lift.sets);
  const showSetCells = !(hideCircles && homogeneous);
  const showSplitHeader = isAdmin && homogeneous && !readOnly;

  return (
    <Pressable
      onLongPress={onLongPress && !readOnly ? () => onLongPress(lift.id) : undefined}
      delayLongPress={400}
      style={styles.lift}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{lift.name}</Text>
        {showSplitHeader ? (
          <SplitHeader
            lift={lift}
            weightActive={weightActive}
            liftRepsActive={liftRepsActive}
            setCountActive={setCountActive}
            onPressWeight={() => onPressWeight?.(lift.id)}
            onPressLiftReps={() => onPressLiftReps?.(lift.id)}
            onPressSetCount={() => onPressSetCount?.(lift.id)}
          />
        ) : (
          <SingleHeader
            label={
              homogeneous
                ? formatCompactHeader(lift.defaultWeight, lift.sets)
                : lift.defaultWeight
            }
            active={weightActive}
            onPress={readOnly ? undefined : () => onPressWeight?.(lift.id)}
          />
        )}
      </View>
      {showSetCells ? (
        <View style={styles.setsRow}>
          {lift.sets.map((set, idx) => {
            const isActive =
              activeTarget?.kind === 'reps' &&
              activeTarget.liftId === lift.id &&
              activeTarget.setIndex === idx;
            return (
              <SetCell
                key={idx}
                set={set}
                active={isActive}
                hideCircle={hideCircles}
                readOnly={readOnly}
                onToggle={next => onToggleSet?.(lift.id, idx, next)}
                onPressReps={() => onPressReps?.(lift.id, idx)}
              />
            );
          })}
        </View>
      ) : null}
    </Pressable>
  );
}

function SingleHeader({
  label,
  active,
  onPress,
}: {
  label: string | undefined;
  active: boolean;
  onPress?: () => void;
}) {
  if (!label) return null;
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={[styles.weight, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

function SplitHeader({
  lift,
  weightActive,
  liftRepsActive,
  setCountActive,
  onPressWeight,
  onPressLiftReps,
  onPressSetCount,
}: {
  lift: Lift;
  weightActive: boolean;
  liftRepsActive: boolean;
  setCountActive: boolean;
  onPressWeight: () => void;
  onPressLiftReps: () => void;
  onPressSetCount: () => void;
}) {
  const reps = lift.sets[0]?.prescribedReps;
  const count = lift.sets.length;
  const unit = lift.sets[0]?.unit;
  const repsLabel = unit === 'sec' ? `${reps} sec` : String(reps);

  return (
    <View style={styles.splitHeaderRow}>
      {lift.defaultWeight ? (
        <>
          <Pressable onPress={onPressWeight} hitSlop={8}>
            <Text style={[styles.weight, weightActive && styles.activeText]}>
              {lift.defaultWeight}
            </Text>
          </Pressable>
          <Text style={styles.headerSeparator}>×</Text>
        </>
      ) : null}
      <Pressable onPress={onPressLiftReps} hitSlop={8}>
        <Text style={[styles.weight, liftRepsActive && styles.activeText]}>
          {repsLabel}
        </Text>
      </Pressable>
      <Text style={styles.headerSeparator}>×</Text>
      <Pressable onPress={onPressSetCount} hitSlop={8}>
        <Text style={[styles.weight, setCountActive && styles.activeText]}>
          {count}
        </Text>
      </Pressable>
    </View>
  );
}

function isHomogeneous(sets: SetEntry[]) {
  if (sets.length === 0) return false;
  const first = sets[0];
  return sets.every(
    s => s.prescribedReps === first.prescribedReps && s.unit === first.unit,
  );
}

function formatCompactHeader(weight: string | undefined, sets: SetEntry[]) {
  if (sets.length === 0) return weight;
  const first = sets[0];
  const allSameReps = sets.every(s => s.prescribedReps === first.prescribedReps);
  const allSameUnit = sets.every(s => s.unit === first.unit);
  if (!allSameReps || !allSameUnit) {
    return weight;
  }
  const unitSuffix = first.unit === 'sec' ? ' sec' : '';
  const repsLabel = `${first.prescribedReps}${unitSuffix}`;
  const count = sets.length;
  if (!weight) {
    return `${repsLabel} × ${count}`;
  }
  return `${weight} × ${repsLabel} × ${count}`;
}

function SetCell({
  set,
  active,
  hideCircle,
  readOnly,
  onToggle,
  onPressReps,
}: {
  set: SetEntry;
  active?: boolean;
  hideCircle?: boolean;
  readOnly?: boolean;
  onToggle?: (next: boolean) => void;
  onPressReps?: () => void;
}) {
  const showStrike = set.actualReps !== undefined && set.actualReps !== set.prescribedReps;
  const unitSuffix = set.unit === 'sec' ? ' sec' : '';
  const displayValue = set.actualReps ?? set.prescribedReps;

  return (
    <View style={styles.set}>
      {hideCircle ? null : (
        <TallyCheck
          checked={set.completed}
          onToggle={readOnly ? undefined : onToggle}
          disabled={readOnly}
        />
      )}
      <Pressable onPress={readOnly ? undefined : onPressReps} hitSlop={8}>
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
  splitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  headerSeparator: {
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    color: colors.ink.pencilLight,
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
