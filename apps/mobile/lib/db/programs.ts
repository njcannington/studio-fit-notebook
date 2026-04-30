import { getDb } from './index';
import { todayProgram } from '@/lib/mock-data/today-program';
import type { Lift, Program, SetEntry } from '@/lib/mock-data/today-program';

const TODAY_PROGRAM_ID = 'today';

type ProgramRow = {
  id: string;
  date: string;
  date_short: string;
  status: 'draft' | 'published' | 'completed';
};

type LiftRow = {
  id: string;
  program_id: string;
  name: string;
  default_weight: string | null;
  sort_order: number;
};

type SetRow = {
  id: string;
  lift_id: string;
  sort_order: number;
  prescribed_reps: number;
  actual_reps: number | null;
  prescribed_weight: string | null;
  actual_weight: string | null;
  unit: string | null;
  completed: number;
};

export function loadTodayProgram(): Program | null {
  const db = getDb();
  const program = db.getFirstSync<ProgramRow>(
    'SELECT * FROM programs WHERE id = ?',
    [TODAY_PROGRAM_ID],
  );
  if (!program) return null;

  const liftRows = db.getAllSync<LiftRow>(
    'SELECT * FROM lifts WHERE program_id = ? ORDER BY sort_order',
    [program.id],
  );

  const lifts: Lift[] = liftRows.map(row => {
    const setRows = db.getAllSync<SetRow>(
      'SELECT * FROM sets WHERE lift_id = ? ORDER BY sort_order',
      [row.id],
    );
    const sets: SetEntry[] = setRows.map(s => ({
      prescribedReps: s.prescribed_reps,
      actualReps: s.actual_reps ?? undefined,
      prescribedWeight: s.prescribed_weight ?? undefined,
      actualWeight: s.actual_weight ?? undefined,
      unit: (s.unit as SetEntry['unit']) ?? undefined,
      completed: s.completed === 1,
    }));
    return {
      id: row.id,
      name: row.name,
      defaultWeight: row.default_weight ?? undefined,
      sets,
    };
  });

  return {
    date: program.date,
    dateShort: program.date_short,
    status: program.status,
    lifts,
  };
}

export function seedTodayProgramIfEmpty(): Program {
  const existing = loadTodayProgram();
  if (existing) return existing;

  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      'INSERT INTO programs (id, date, date_short, status) VALUES (?, ?, ?, ?)',
      [TODAY_PROGRAM_ID, todayProgram.date, todayProgram.dateShort, todayProgram.status],
    );
    todayProgram.lifts.forEach((lift, liftIdx) => {
      db.runSync(
        'INSERT INTO lifts (id, program_id, name, default_weight, sort_order) VALUES (?, ?, ?, ?, ?)',
        [lift.id, TODAY_PROGRAM_ID, lift.name, lift.defaultWeight ?? null, liftIdx],
      );
      lift.sets.forEach((set, setIdx) => {
        db.runSync(
          `INSERT INTO sets (id, lift_id, sort_order, prescribed_reps, actual_reps,
            prescribed_weight, actual_weight, unit, completed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `${lift.id}-${setIdx}`,
            lift.id,
            setIdx,
            set.prescribedReps,
            set.actualReps ?? null,
            set.prescribedWeight ?? null,
            set.actualWeight ?? null,
            set.unit ?? null,
            set.completed ? 1 : 0,
          ],
        );
      });
    });
  });

  const seeded = loadTodayProgram();
  if (!seeded) throw new Error('Failed to seed today program');
  return seeded;
}

export function setSetCompleted(liftId: string, setIndex: number, completed: boolean) {
  const db = getDb();
  db.runSync(
    `UPDATE sets SET completed = ?
     WHERE lift_id = ? AND sort_order = ?`,
    [completed ? 1 : 0, liftId, setIndex],
  );
}

export function setSetActualReps(liftId: string, setIndex: number, actualReps: number | null) {
  const db = getDb();
  db.runSync(
    `UPDATE sets SET actual_reps = ?
     WHERE lift_id = ? AND sort_order = ?`,
    [actualReps, liftId, setIndex],
  );
}

export function setLiftDefaultWeight(liftId: string, weight: string) {
  const db = getDb();
  db.runSync('UPDATE lifts SET default_weight = ? WHERE id = ?', [weight, liftId]);
}
