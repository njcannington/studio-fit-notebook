import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@studio-fit/design-tokens';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>@studio-fit/mobile</Text>
      <Text style={styles.subtitle}>
        Tokens import is live. Smoke test only — real screens come later.
      </Text>

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
  title: {
    color: colors.iron.stencil,
    fontSize: typography.displayLg.fontSize,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.ink.pencilFaded,
    marginTop: spacing[2],
    fontSize: 14,
  },
  grid: {
    marginTop: spacing[6],
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
    fontFamily: 'monospace',
    color: colors.paper.cream,
    fontSize: 13,
  },
  swatchHex: {
    fontFamily: 'monospace',
    color: colors.ink.pencilFaded,
    fontSize: 12,
    marginTop: 2,
  },
});
