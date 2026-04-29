import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { PaperCard } from '@/components/paper-card';
import { PencilStrikethrough } from '@/components/strikethrough';
import { TallyCheck, TallyRow } from '@/components/tally';

export default function HomeScreen() {
  const [singleChecked, setSingleChecked] = useState(false);
  const [completed, setCompleted] = useState(3);
  const total = 8;

  const toggleAt = (idx: number, next: boolean) => {
    setCompleted(next ? idx + 1 : idx);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.wordmark}>Studio Fit Notebook</Text>
      <Text style={styles.subtitle}>Mobile · Tally Components</Text>

      <SectionTitle>Single tally check</SectionTitle>
      <View style={styles.row}>
        <TallyCheck checked={singleChecked} onToggle={setSingleChecked} />
        <Text style={styles.helper}>{singleChecked ? 'Checked' : 'Tap to check'}</Text>
      </View>

      <SectionTitle>Tally row · {completed} / {total} sets</SectionTitle>
      <PaperCard style={styles.cardSpacing}>
        <TallyRow total={total} completed={completed} onToggle={toggleAt} />
      </PaperCard>

      <SectionTitle>Pencil strikethrough · ruled & margin</SectionTitle>
      <PaperCard ruled margin style={styles.cardSpacing}>
        <View style={styles.strikeRow}>
          <Text style={styles.liftName}>Bench Press</Text>
          <PencilStrikethrough prescribed="5" actual="4" fontSize={22} />
        </View>
        <View style={styles.strikeRow}>
          <Text style={styles.liftName}>Back Squat</Text>
          <PencilStrikethrough prescribed="135" actual="125" fontSize={22} />
        </View>
        <View style={styles.strikeRow}>
          <Text style={styles.liftName}>Deadlift</Text>
          <PencilStrikethrough prescribed="3 × 5" actual="3 × 4" fontSize={22} />
        </View>
      </PaperCard>

      <View style={styles.controlsRow}>
        <ControlButton label="Reset" onPress={() => setCompleted(0)} />
        <ControlButton label="Fill" onPress={() => setCompleted(total)} />
        <ControlButton
          label="− 1"
          onPress={() => setCompleted(c => Math.max(0, c - 1))}
        />
        <ControlButton
          label="+ 1"
          onPress={() => setCompleted(c => Math.min(total, c + 1))}
        />
      </View>
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function ControlButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  content: {
    padding: spacing[5],
    paddingTop: spacing[7],
  },
  wordmark: {
    fontFamily: fontFamilies.display,
    fontSize: 56,
    fontWeight: '700',
    color: colors.paper.cream,
    textShadowColor: colors.rust.base,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    paddingTop: 8,
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
    marginTop: spacing[2],
  },
  sectionTitle: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
    marginTop: spacing[6],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.iron.light,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  helper: {
    fontFamily: fontFamilies.pencil,
    fontSize: 16,
    color: colors.ink.pencilLight,
  },
  cardSpacing: {
    marginTop: spacing[4],
  },
  strikeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  liftName: {
    fontFamily: fontFamilies.pencil,
    fontSize: 22,
    color: colors.ink.pencil,
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[5],
  },
  button: {
    backgroundColor: colors.iron.base,
    borderWidth: 1,
    borderColor: colors.iron.light,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
});
