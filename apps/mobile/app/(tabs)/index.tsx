import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, tapTargetMin } from '@studio-fit/design-tokens';
import { ActionSheet, type ActionItem } from '@/components/action-sheet';
import { ClientPickerSheet } from '@/components/client-picker';
import { DatePickerSheet } from '@/components/date-picker';
import { WavyDivider } from '@/components/divider';
import { ChevronLeftIcon, PencilIcon } from '@/components/icons';
import { NumberPad } from '@/components/number-pad';
import { PaperCard } from '@/components/paper-card';
import { NoteSheet } from '@/components/note-sheet';
import { LiftRow, type EditTarget } from '@/components/program';
import { RosterView } from '@/components/roster';
import { useClientPrograms } from '@/lib/db/use-all-programs';
import { useClients } from '@/lib/db/use-clients';
import { useRole } from '@/lib/db/use-role';
import { useTodayRoster } from '@/lib/db/use-roster';
import { useTodayProgram } from '@/lib/db/use-today-program';
import { programIdFor, todayIso, type Program } from '@/lib/mock-data/today-program';

const DEFAULT_CLIENT_ID = 'nic';
const todayProgramId = () => programIdFor(DEFAULT_CLIENT_ID, todayIso());

const LIFT_ACTIONS: ActionItem[] = [
  { id: 'add-set', label: 'Add set' },
  { id: 'remove-set', label: 'Remove set' },
  { id: 'remove-lift', label: 'Remove lift', destructive: true },
];

export default function TodayScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const { role } = useRole();
  const isAdmin = role === 'admin';

  const defaultProgramId = isAdmin ? null : todayProgramId();
  const [viewedProgramId, setViewedProgramId] = useState<string | null>(defaultProgramId);

  useEffect(() => {
    if (params.date && params.date !== viewedProgramId) {
      setViewedProgramId(params.date);
    }
  }, [params.date, viewedProgramId]);

  const {
    program,
    toggleSet,
    updateActualReps,
    updateLiftWeight,
    updateStatus,
    addSet,
    removeSet,
    deleteLift,
    updateLiftPrescribedReps,
    updateSetPrescribedReps,
    updateLiftSetCount,
    updateSetNote,
  } = useTodayProgram(viewedProgramId ?? undefined);
  const allPrograms = useClientPrograms(DEFAULT_CLIENT_ID);
  const { rows: rosterRows, refresh: refreshRoster } = useTodayRoster();
  const { clients, setClientTime } = useClients();
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [actionLiftId, setActionLiftId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [noteTarget, setNoteTarget] = useState<{ liftId: string; setIndex: number } | null>(null);

  const noteInitialValue = useMemo(() => {
    if (!noteTarget || !program) return '';
    const lift = program.lifts.find(l => l.id === noteTarget.liftId);
    return lift?.sets[noteTarget.setIndex]?.note ?? '';
  }, [noteTarget, program]);

  const commitNote = (value: string) => {
    if (!noteTarget) return;
    const trimmed = value.trim();
    updateSetNote(noteTarget.liftId, noteTarget.setIndex, trimmed.length === 0 ? null : trimmed);
    setNoteTarget(null);
  };

  const handleAction = (id: string) => {
    if (!actionLiftId) return;
    if (id === 'add-set') addSet(actionLiftId);
    else if (id === 'remove-set') removeSet(actionLiftId);
    else if (id === 'remove-lift') deleteLift(actionLiftId);
    setActionLiftId(null);
  };

  const actionLiftName = actionLiftId
    ? program?.lifts.find(l => l.id === actionLiftId)?.name
    : undefined;

  const editContext = useMemo(() => {
    if (!editTarget || !program) return null;
    const lift = program.lifts.find(l => l.id === editTarget.liftId);
    if (!lift) return null;
    if (editTarget.kind === 'reps') {
      const set = lift.sets[editTarget.setIndex];
      const current = isAdmin
        ? set.prescribedReps
        : set.actualReps ?? set.prescribedReps;
      return {
        initialValue: String(current),
        allowDecimal: false,
        unitLabel: set.unit === 'sec' ? 'sec' : undefined,
      };
    }
    if (editTarget.kind === 'lift-reps') {
      const reps = lift.sets[0]?.prescribedReps ?? 0;
      const unit = lift.sets[0]?.unit;
      return {
        initialValue: String(reps),
        allowDecimal: false,
        unitLabel: unit === 'sec' ? 'sec' : undefined,
      };
    }
    if (editTarget.kind === 'set-count') {
      return {
        initialValue: String(lift.sets.length),
        allowDecimal: false,
        unitLabel: 'sets',
      };
    }
    return {
      initialValue: stripNonNumeric(lift.defaultWeight ?? '0'),
      allowDecimal: true,
      unitLabel: weightUnitFromLabel(lift.defaultWeight),
    };
  }, [editTarget, program, isAdmin]);

  const commit = (raw: string) => {
    if (!editTarget || !program) return;
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) {
      setEditTarget(null);
      return;
    }
    if (editTarget.kind === 'weight') {
      const lift = program.lifts.find(l => l.id === editTarget.liftId);
      const unit = weightUnitFromLabel(lift?.defaultWeight) ?? 'lb';
      updateLiftWeight(editTarget.liftId, `${formatNumber(parsed)} ${unit}`);
    } else if (editTarget.kind === 'lift-reps') {
      updateLiftPrescribedReps(editTarget.liftId, Math.max(1, Math.round(parsed)));
    } else if (editTarget.kind === 'set-count') {
      updateLiftSetCount(editTarget.liftId, Math.max(1, Math.round(parsed)));
    } else if (isAdmin) {
      updateSetPrescribedReps(
        editTarget.liftId,
        editTarget.setIndex,
        Math.max(0, Math.round(parsed)),
      );
    } else {
      updateActualReps(editTarget.liftId, editTarget.setIndex, parsed);
    }
    setEditTarget(null);
  };

  const showRoster = isAdmin && viewedProgramId === null;
  const clientName = program
    ? rosterRows.find(r => r.client.id === program.clientId)?.client.name
    : undefined;
  const dateLabelForBar = showRoster
    ? 'Today'
    : isAdmin && clientName && program
      ? `${clientName} — ${program.dateShort}`
      : program?.dateShort ?? viewedProgramId ?? 'Today';

  const handleRosterRowPress = (row: typeof rosterRows[number]) => {
    if (row.program) {
      setViewedProgramId(row.program.id);
    }
    // No-program rows are not navigable yet — TODO: new-program-from-scratch flow.
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <TopBar
        dateLabel={dateLabelForBar}
        isAdmin={isAdmin}
        showChevron={isAdmin && !showRoster}
        showTodayJump={!isAdmin && viewedProgramId !== todayProgramId()}
        onPressChevron={() => setViewedProgramId(null)}
        onPressDate={showRoster ? undefined : () => setPickerOpen(true)}
        onPressToday={() => setViewedProgramId(todayProgramId())}
      />
      {showRoster ? (
        <RosterView
          rows={rosterRows}
          onPressClient={handleRosterRowPress}
          onPressAddClient={() => setClientPickerOpen(true)}
        />
      ) : !program ? (
        <NoProgramForDate />
      ) : program.status === 'draft' && !isAdmin ? (
        <EmptyState />
      ) : (
        <ProgramView
          program={program}
          editTarget={editTarget}
          isAdmin={isAdmin}
          onToggleSet={toggleSet}
          onPressReps={(liftId, setIndex) =>
            setEditTarget({ kind: 'reps', liftId, setIndex })
          }
          onPressWeight={liftId => setEditTarget({ kind: 'weight', liftId })}
          onPressLiftReps={liftId => setEditTarget({ kind: 'lift-reps', liftId })}
          onPressSetCount={liftId => setEditTarget({ kind: 'set-count', liftId })}
          onPressNote={(liftId, setIndex) => setNoteTarget({ liftId, setIndex })}
          onComplete={() => updateStatus('completed')}
          onLongPressLift={isAdmin ? liftId => setActionLiftId(liftId) : undefined}
          onPublish={() => updateStatus('published')}
          onUnpublish={() => updateStatus('draft')}
        />
      )}

      <ActionSheet
        visible={actionLiftId !== null}
        title={actionLiftName ? `Lift · ${actionLiftName}` : undefined}
        actions={LIFT_ACTIONS}
        onSelect={handleAction}
        onCancel={() => setActionLiftId(null)}
      />

      <DatePickerSheet
        visible={pickerOpen}
        programs={allPrograms}
        selectedId={viewedProgramId}
        onSelect={id => {
          setViewedProgramId(id);
          setPickerOpen(false);
        }}
        onCancel={() => setPickerOpen(false)}
      />

      <ClientPickerSheet
        visible={clientPickerOpen}
        clients={clients}
        excludeIds={rosterRows.map(r => r.client.id)}
        onSelect={clientId => {
          setClientTime(clientId, defaultSessionTime());
          refreshRoster();
          setClientPickerOpen(false);
        }}
        onCancel={() => setClientPickerOpen(false)}
      />

      <NumberPad
        visible={editTarget !== null}
        initialValue={editContext?.initialValue ?? '0'}
        allowDecimal={editContext?.allowDecimal}
        unitLabel={editContext?.unitLabel}
        onCancel={() => setEditTarget(null)}
        onCommit={commit}
      />

      <NoteSheet
        visible={noteTarget !== null}
        initialValue={noteInitialValue}
        title="Note for this set"
        placeholder="What happened on this set?"
        onCommit={commitNote}
        onCancel={() => setNoteTarget(null)}
      />
    </SafeAreaView>
  );
}

type ProgramViewProps = {
  program: Program;
  editTarget: EditTarget | null;
  isAdmin: boolean;
  onToggleSet: (liftId: string, setIndex: number, next: boolean) => void;
  onPressReps: (liftId: string, setIndex: number) => void;
  onPressWeight: (liftId: string) => void;
  onPressLiftReps: (liftId: string) => void;
  onPressSetCount: (liftId: string) => void;
  onPressNote: (liftId: string, setIndex: number) => void;
  onComplete: () => void;
  onLongPressLift?: (liftId: string) => void;
  onPublish: () => void;
  onUnpublish: () => void;
};

function ProgramView({
  program,
  editTarget,
  isAdmin,
  onToggleSet,
  onPressReps,
  onPressWeight,
  onPressLiftReps,
  onPressSetCount,
  onPressNote,
  onComplete,
  onLongPressLift,
  onPublish,
  onUnpublish,
}: ProgramViewProps) {
  const allComplete = program.lifts.every(lift => lift.sets.every(s => s.completed));
  const isCompleted = program.status === 'completed';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <PaperCard ruled margin>
        {isCompleted ? <CompletedLabel dateLabel={program.dateShort} /> : null}
        {program.lifts.map(lift => (
          <LiftRow
            key={lift.id}
            lift={lift}
            activeTarget={editTarget}
            onToggleSet={onToggleSet}
            onPressReps={onPressReps}
            onPressWeight={onPressWeight}
            onPressLiftReps={onPressLiftReps}
            onPressSetCount={onPressSetCount}
            onPressNote={onPressNote}
            onLongPress={onLongPressLift}
            hideCircles={isAdmin}
            readOnly={isCompleted}
            isAdmin={isAdmin}
          />
        ))}
        {allComplete && !isCompleted ? (
          <CompletionFooter dateLabel={program.dateShort} onComplete={onComplete} />
        ) : null}
      </PaperCard>
      {isAdmin && program.status === 'draft' ? (
        <Pressable style={styles.publishButton} onPress={onPublish}>
          <Text style={styles.publishText}>Publish</Text>
        </Pressable>
      ) : null}
      {isAdmin && program.status === 'published' ? (
        <Pressable style={styles.unpublishLink} onPress={onUnpublish} hitSlop={8}>
          <Text style={styles.unpublishText}>Unpublish</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function CompletionFooter({
  dateLabel,
  onComplete,
}: {
  dateLabel: string;
  onComplete: () => void;
}) {
  return (
    <View style={styles.completionFooter}>
      <WavyDivider />
      <Text style={styles.niceWork}>Nice work — {dateLabel}</Text>
      <Pressable style={styles.completeButton} onPress={onComplete}>
        <Text style={styles.completeButtonText}>Mark session complete</Text>
      </Pressable>
    </View>
  );
}

function CompletedLabel({ dateLabel }: { dateLabel: string }) {
  return (
    <View style={styles.completedLabel}>
      <Text style={styles.completedText}>Completed · {dateLabel}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <PencilIcon size={96} color={colors.iron.light} />
      </View>
      <Text style={styles.emptyHeadline}>Your program isn't ready yet.</Text>
      <Text style={styles.emptyBody}>
        Hang tight — your trainer will share it soon.
      </Text>
    </View>
  );
}

function NoProgramForDate() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyHeadline}>No program for this date.</Text>
      <Text style={styles.emptyBody}>
        Tap the date above to jump to a different day.
      </Text>
    </View>
  );
}

function TopBar({
  dateLabel,
  isAdmin,
  showChevron,
  showTodayJump,
  onPressChevron,
  onPressDate,
  onPressToday,
}: {
  dateLabel: string;
  isAdmin: boolean;
  showChevron?: boolean;
  showTodayJump?: boolean;
  onPressChevron?: () => void;
  onPressDate?: () => void;
  onPressToday?: () => void;
}) {
  return (
    <View style={styles.topBar}>
      {showChevron ? (
        <Pressable onPress={onPressChevron} style={styles.iconButton} hitSlop={8}>
          <ChevronLeftIcon size={28} color={colors.iron.stencil} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      <Pressable
        onPress={onPressDate}
        hitSlop={8}
        style={styles.dateLabelWrapper}
        disabled={!onPressDate}
      >
        <Text style={styles.dateLabel} numberOfLines={1}>
          {dateLabel}
        </Text>
      </Pressable>
      {showTodayJump ? (
        <Pressable onPress={onPressToday} hitSlop={8} style={styles.todayPill}>
          <Text style={styles.todayPillText}>Today</Text>
        </Pressable>
      ) : null}
      {isAdmin ? (
        <View style={styles.editingPill}>
          <Text style={styles.editingPillText}>Editing</Text>
        </View>
      ) : null}
      <Pressable style={styles.iconButton} hitSlop={8}>
        <PencilIcon size={22} color={colors.paper.margin} />
      </Pressable>
    </View>
  );
}

function stripNonNumeric(weight: string) {
  const match = weight.match(/[\d.]+/);
  return match ? match[0] : '0';
}

function weightUnitFromLabel(weight: string | undefined) {
  if (!weight) return undefined;
  if (/lb/i.test(weight)) return 'lb';
  if (/kg/i.test(weight)) return 'kg';
  return undefined;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function defaultSessionTime(): string {
  const now = new Date();
  const hour = now.getHours();
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'am' : 'pm';
  return `${display}:00 ${ampm}`;
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
  dateLabelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.paper.cream,
  },
  content: {
    padding: spacing[4],
  },
  completionFooter: {
    marginTop: spacing[3],
    gap: spacing[3],
  },
  niceWork: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.ink.pencil,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: colors.rust.base,
    borderRadius: 8,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  completeButtonText: {
    fontFamily: fontFamilies.block,
    fontSize: 16,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  completedLabel: {
    alignSelf: 'flex-end',
    backgroundColor: colors.iron.base,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: spacing[3],
  },
  completedText: {
    fontFamily: fontFamilies.block,
    fontSize: 11,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing[5],
  },
  editingPill: {
    backgroundColor: colors.rust.base,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: spacing[2],
  },
  editingPillText: {
    fontFamily: fontFamilies.block,
    fontSize: 10,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  todayPill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.iron.light,
    marginRight: spacing[2],
  },
  todayPillText: {
    fontFamily: fontFamilies.block,
    fontSize: 10,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  publishButton: {
    backgroundColor: colors.rust.base,
    borderRadius: 8,
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[5],
  },
  publishText: {
    fontFamily: fontFamilies.block,
    fontSize: 18,
    color: colors.paper.cream,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  unpublishLink: {
    alignSelf: 'center',
    marginTop: spacing[4],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  unpublishText: {
    fontFamily: fontFamilies.block,
    fontSize: 12,
    color: colors.ink.pencilLight,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  emptyHeadline: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.iron.stencil,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  emptyBody: {
    fontFamily: fontFamilies.pencil,
    fontSize: 18,
    color: colors.iron.stencil,
    textAlign: 'center',
    lineHeight: 26,
  },
});
