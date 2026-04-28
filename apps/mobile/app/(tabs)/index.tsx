import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing, typography } from '@studio-fit/design-tokens';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.wordmark}>Studio Fit Notebook</Text>
      <Text style={styles.subtitle}>Mobile · Tokens & Fonts Smoke Test</Text>

      <SectionTitle>Typography roles</SectionTitle>
      <SampleRow label="display · Caveat" fontFamily={fontFamilies.display} size={40}>
        Wednesday — April 27
      </SampleRow>
      <SampleRow label="block · Oswald" fontFamily={fontFamilies.block} size={18} upper letterSpacing={1.8}>
        Publish Program
      </SampleRow>
      <SampleRow label="pencil · Architects Daughter" fontFamily={fontFamilies.pencil} size={typography.pencilLg.fontSize}>
        Back Squat — 3 sets of 5
      </SampleRow>
      <SampleRow label="pencil-mono · Special Elite" fontFamily={fontFamilies.pencilMono} size={22}>
        5  5  5  4  3
      </SampleRow>

      <SectionTitle>Color palette</SectionTitle>
      <View style={styles.grid}>
        {Object.entries(colors.paper).map(([name, hex]) => (
          <Swatch key={`paper-${name}`} name={`paper.${name}`} hex={hex} />
        ))}
        {Object.entries(colors.ink).map(([name, hex]) => (
          <Swatch key={`ink-${name}`} name={`ink.${name}`} hex={hex} />
        ))}
        {Object.entries(colors.rust).map(([name, hex]) => (
          <Swatch key={`rust-${name}`} name={`rust.${name}`} hex={hex} />
        ))}
      </View>
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function SampleRow({
  label,
  fontFamily,
  size,
  upper,
  letterSpacing,
  children,
}: {
  label: string;
  fontFamily: string;
  size: number;
  upper?: boolean;
  letterSpacing?: number;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sampleRow}>
      <Text style={styles.sampleLabel}>{label}</Text>
      <Text
        style={{
          fontFamily,
          fontSize: size,
          color: colors.paper.cream,
          textTransform: upper ? 'uppercase' : undefined,
          letterSpacing,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.swatchColor, { backgroundColor: hex }]} />
      <View style={styles.swatchInfo}>
        <Text style={styles.swatchName}>{name}</Text>
        <Text style={styles.swatchHex}>{hex}</Text>
      </View>
    </View>
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
    lineHeight: 60,
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
  sampleRow: {
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.iron.light,
    borderStyle: 'dashed',
    gap: spacing[2],
  },
  sampleLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
  },
  grid: {
    marginTop: spacing[4],
    gap: spacing[3],
  },
  swatch: {
    backgroundColor: colors.iron.base,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.iron.light,
  },
  swatchColor: {
    height: 64,
  },
  swatchInfo: {
    padding: spacing[3],
  },
  swatchName: {
    fontFamily: fontFamilies.pencilMono,
    color: colors.paper.cream,
    fontSize: 13,
  },
  swatchHex: {
    fontFamily: fontFamilies.pencilMono,
    color: colors.ink.pencilFaded,
    fontSize: 12,
    marginTop: 2,
  },
});
