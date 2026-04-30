import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import { useRole } from '@/lib/db/use-role';
import { useTodayProgram } from '@/lib/db/use-today-program';
import type { Role } from '@/lib/db/settings';

const STATUSES: Array<'draft' | 'published' | 'completed'> = [
  'draft',
  'published',
  'completed',
];

const ROLES: Role[] = ['client', 'admin'];

export default function MeScreen() {
  const { program, updateStatus } = useTodayProgram();
  const { role, updateRole } = useRole();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headline}>Me</Text>
        <Text style={styles.body}>Profile and settings will live here.</Text>

        <Text style={styles.sectionTitle}>Dev · Role</Text>
        <Text style={styles.helper}>Current: {role}</Text>
        <View style={styles.row}>
          {ROLES.map(r => {
            const active = role === r;
            return (
              <Pressable
                key={r}
                onPress={() => updateRole(r)}
                style={[styles.button, active && styles.buttonActive]}
              >
                <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Dev · Today's program status</Text>
        <Text style={styles.helper}>
          Current: {program?.status ?? 'loading…'}
        </Text>
        <View style={styles.row}>
          {STATUSES.map(status => {
            const active = program?.status === status;
            return (
              <Pressable
                key={status}
                onPress={() => updateStatus(status)}
                style={[styles.button, active && styles.buttonActive]}
              >
                <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.iron.deep,
  },
  content: {
    padding: spacing[5],
    gap: spacing[2],
  },
  headline: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    color: colors.iron.stencil,
  },
  body: {
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    color: colors.ink.pencilFaded,
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
    marginTop: spacing[4],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.iron.light,
  },
  helper: {
    fontFamily: fontFamilies.pencil,
    fontSize: 14,
    color: colors.iron.stencil,
    marginTop: spacing[2],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[3],
  },
  button: {
    backgroundColor: colors.iron.base,
    borderWidth: 1,
    borderColor: colors.iron.light,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 6,
  },
  buttonActive: {
    backgroundColor: colors.rust.base,
    borderColor: colors.rust.deep,
  },
  buttonText: {
    fontFamily: fontFamilies.block,
    fontSize: 14,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  buttonTextActive: {
    fontWeight: '600',
  },
});
