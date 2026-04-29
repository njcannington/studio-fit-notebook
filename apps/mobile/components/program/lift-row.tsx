import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { PencilStrikethrough } from '@/components/strikethrough';
import { TallyCheck } from '@/components/tally';
import type { Lift, SetEntry } from '@/lib/mock-data/today-program';

type Props = {
  lift: Lift;
};

export function LiftRow({ lift }: Props) {
  return (
    <View style={styles.lift}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{lift.name}</Text>
        {lift.defaultWeight ? (
          <Text style={styles.weight}>{lift.defaultWeight}</Text>
        ) : null}
      </View>
      <View style={styles.setsRow}>
        {lift.sets.map((set, idx) => (
          <SetCell key={idx} set={set} />
        ))}
      </View>
    </View>
  );
}

function SetCell({ set }: { set: SetEntry }) {
  const showStrike = set.actualReps !== undefined && set.actualReps !== set.prescribedReps;
  const unitSuffix = set.unit === 'sec' ? ' sec' : '';

  return (
    <View style={styles.set}>
      <TallyCheck checked={set.completed} />
      {showStrike ? (
        <PencilStrikethrough
          prescribed={`${set.prescribedReps}${unitSuffix}`}
          actual={`${set.actualReps}${unitSuffix}`}
          fontSize={20}
        />
      ) : (
        <Text style={styles.reps}>
          {set.prescribedReps}
          {unitSuffix}
        </Text>
      )}
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
});
