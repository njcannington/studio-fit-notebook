import { StyleSheet, View } from 'react-native';
import { spacing } from '@studio-fit/design-tokens';
import { TallyCheck } from './tally-check';

type Props = {
  total: number;
  completed: number;
  onToggle?: (index: number, next: boolean) => void;
};

export function TallyRow({ total, completed, onToggle }: Props) {
  const groups: number[][] = [];
  for (let i = 0; i < total; i += 5) {
    groups.push(Array.from({ length: Math.min(5, total - i) }, (_, j) => i + j));
  }

  return (
    <View style={styles.row}>
      {groups.map((group, gi) => (
        <View key={gi} style={styles.group}>
          {group.map(idx => (
            <TallyCheck
              key={idx}
              checked={idx < completed}
              onToggle={next => onToggle?.(idx, next)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[5],
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    gap: spacing[1],
  },
});
