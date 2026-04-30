import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@studio-fit/design-tokens';
import type { RosterRow } from '@/lib/db/use-roster';

type StatusKey = 'draft' | 'published' | 'completed' | 'none';

const STATUS_LABELS: Record<StatusKey, string> = {
  draft: 'Draft',
  published: 'Published',
  completed: 'Completed',
  none: 'No program',
};

const STATUS_COLORS: Record<StatusKey, { bg: string; fg: string }> = {
  draft: { bg: colors.iron.light, fg: colors.ink.pencilFaded },
  published: { bg: colors.paper.cream, fg: colors.ink.pencil },
  completed: { bg: colors.iron.base, fg: colors.ink.pencilLight },
  none: { bg: colors.iron.base, fg: colors.ink.pencilFaded },
};

type Props = {
  rows: RosterRow[];
  onPressClient: (rosterRow: RosterRow) => void;
  onPublishAll?: () => void;
  onPressAddClient?: () => void;
};

export function RosterView({ rows, onPressClient, onPublishAll, onPressAddClient }: Props) {
  const draftCount = rows.filter(r => r.program?.status === 'draft').length;
  const allPublished = rows.length > 0 && draftCount === 0;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>Today</Text>
        {onPublishAll && draftCount > 0 ? (
          <Pressable onPress={onPublishAll} hitSlop={8} style={styles.publishAll}>
            <Text style={styles.publishAllText}>Publish all</Text>
          </Pressable>
        ) : allPublished ? (
          <Text style={styles.allPublished}>All published</Text>
        ) : null}
      </View>

      <View style={styles.list}>
        {rows.map((row, idx) => (
          <Pressable
            key={row.client.id}
            onPress={() => onPressClient(row)}
            style={({ pressed }) => [
              styles.row,
              idx > 0 && styles.rowDivider,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.rowLeft}>
              {row.client.time ? (
                <Text style={styles.time}>{row.client.time}</Text>
              ) : null}
              <Text style={styles.name}>{row.client.name}</Text>
            </View>
            <StatusPill status={statusKey(row)} />
          </Pressable>
        ))}
      </View>

      {onPressAddClient ? (
        <Pressable
          onPress={onPressAddClient}
          style={({ pressed }) => [styles.addClient, pressed && styles.addClientPressed]}
        >
          <Text style={styles.addClientText}>+ Add client to today</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function statusKey(row: RosterRow): StatusKey {
  if (!row.program) return 'none';
  return row.program.status;
}

function StatusPill({ status }: { status: StatusKey }) {
  const palette = STATUS_COLORS[status];
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.pillText, { color: palette.fg }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    marginBottom: spacing[3],
  },
  sectionLabel: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink.pencilFaded,
  },
  publishAll: {
    backgroundColor: colors.rust.base,
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: 6,
  },
  publishAllText: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.paper.cream,
    fontWeight: '600',
  },
  allPublished: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink.pencilLight,
  },
  list: {
    backgroundColor: colors.iron.base,
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.iron.light,
  },
  rowPressed: {
    backgroundColor: colors.iron.light,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
    flex: 1,
  },
  time: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.ink.pencilLight,
    width: 72,
  },
  name: {
    fontFamily: fontFamilies.pencil,
    fontSize: 22,
    color: colors.paper.cream,
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
  addClient: {
    marginTop: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.iron.light,
    borderRadius: 8,
    alignItems: 'center',
  },
  addClientPressed: {
    backgroundColor: colors.iron.base,
  },
  addClientText: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.paper.cream,
  },
});
