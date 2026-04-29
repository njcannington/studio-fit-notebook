import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, tapTargetMin } from '@studio-fit/design-tokens';
import { PaperCard } from '@/components/paper-card';
import { LiftRow } from '@/components/program';
import { todayProgram, type Program } from '@/lib/mock-data/today-program';

export default function TodayScreen() {
  const [program, setProgram] = useState<Program>(todayProgram);

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

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <TopBar dateLabel={program.dateShort} />
      <ScrollView contentContainerStyle={styles.content}>
        <PaperCard ruled margin>
          {program.lifts.map(lift => (
            <LiftRow key={lift.id} lift={lift} onToggleSet={toggleSet} />
          ))}
        </PaperCard>
      </ScrollView>
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
