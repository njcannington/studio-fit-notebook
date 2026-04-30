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
  onLongPress?: (liftId: string) => void;
  activeTarget?: EditTarget | null;
  hideCircles?: boolean;
  readOnly?: boolean;
};

export function LiftRow({
  lift,
  onToggleSet,
  onPressReps,
  onPressWeight,
  onLongPress,
  activeTarget,
  hideCircles,
  readOnly,
}: Props) {
  const weightActive =
    activeTarget?.kind === 'weight' && activeTarget.liftId === lift.id;

  const headerLabel = formatCompactHeader(lift.defaultWeight, lift.sets);

  return (
    <Pressable
      onLongPress={onLongPress && !readOnly ? () => onLongPress(lift.id) : undefined}
      delayLongPress={400}
      style={styles.lift}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{lift.name}</Text>
        {headerLabel ? (
          <Pressable
            onPress={readOnly ? undefined : () => onPressWeight?.(lift.id)}
            hitSlop={8}
          >
            <Text style={[styles.weight, weightActive && styles.activeText]}>
              {headerLabel}
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
    </Pressable>
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
