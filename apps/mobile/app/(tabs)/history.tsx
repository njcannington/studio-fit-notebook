import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { useClientPrograms } from '@/lib/db/use-all-programs';
import type { Program } from '@/lib/mock-data/today-program';

const DEFAULT_CLIENT_ID = 'nic';

const STATUS_COLORS = {
  draft: { bg: colors.iron.light, fg: colors.ink.pencilFaded },
  published: { bg: colors.paper.cream, fg: colors.ink.pencil },
  completed: { bg: colors.iron.base, fg: colors.ink.pencilLight },
} as const;

export default function HistoryScreen() {
  const programs = useClientPrograms(DEFAULT_CLIENT_ID);

  const open = (id: string) => {
    router.navigate({ pathname: '/(tabs)', params: { date: id } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headline}>History</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {programs.length === 0 ? (
          <Text style={styles.emptyBody}>No programs yet.</Text>
        ) : (
          programs.map((program, idx) => (
            <Pressable
              key={program.id}
              onPress={() => open(program.id)}
              style={({ pressed }) => [
                styles.row,
                idx > 0 && styles.rowDivider,
                pressed && styles.rowPressed,
              ]}
            >
              <View>
                <Text style={styles.date}>{program.dateShort}</Text>
                <Text style={styles.subtitle}>
                  {program.lifts.length} lift{program.lifts.length === 1 ? '' : 's'}
                </Text>
              </View>
              <StatusPill status={program.status} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  headline: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    color: colors.iron.stencil,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  emptyBody: {
    fontFamily: fontFamilies.pencil,
    fontSize: 16,
    color: colors.ink.pencilFaded,
    textAlign: 'center',
    marginTop: spacing[6],
  },
  row: {
    paddingVertical: spacing[4],
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
    fontSize: 24,
    color: colors.paper.cream,
  },
  subtitle: {
    fontFamily: fontFamilies.pencil,
    fontSize: 14,
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
});
