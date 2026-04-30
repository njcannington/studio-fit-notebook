import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.body}>
        <Text style={styles.headline}>History</Text>
        <Text style={styles.body_text}>Past sessions will live here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  headline: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    color: colors.iron.stencil,
  },
  body_text: {
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    color: colors.ink.pencilFaded,
    textAlign: 'center',
  },
});
