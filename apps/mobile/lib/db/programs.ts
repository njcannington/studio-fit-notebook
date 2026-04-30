import { getDb } from './index';
import { seedPrograms } from '@/lib/mock-data/today-program';
import type { Lift, Program, SetEntry } from '@/lib/mock-data/today-program';

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

function rowToSet(s: SetRow): SetEntry {
  return {
    prescribedReps: s.prescribed_reps,
    actualReps: s.actual_reps ?? undefined,
    prescribedWeight: s.prescribed_weight ?? undefined,
    actualWeight: s.actual_weight ?? undefined,
    unit: (s.unit as SetEntry['unit']) ?? undefined,
    completed: s.completed === 1,
  };
}

function rowToLift(db: ReturnType<typeof getDb>, row: LiftRow): Lift {
  const setRows = db.getAllSync<SetRow>(
    'SELECT * FROM sets WHERE lift_id = ? ORDER BY sort_order',
    [row.id],
  );
  return {
    id: row.id,
    name: row.name,
    defaultWeight: row.default_weight ?? undefined,
    sets: setRows.map(rowToSet),
  };
}

export function loadProgram(programId: string): Program | null {
  const db = getDb();
  const row = db.getFirstSync<ProgramRow>(
    'SELECT * FROM programs WHERE id = ?',
    [programId],
  );
  if (!row) return null;

  const liftRows = db.getAllSync<LiftRow>(
    'SELECT * FROM lifts WHERE program_id = ? ORDER BY sort_order',
    [row.id],
  );

  return {
    id: row.id,
    date: row.date,
    dateShort: row.date_short,
    status: row.status,
    lifts: liftRows.map(lift => rowToLift(db, lift)),
  };
}

export function loadAllPrograms(): Program[] {
  const db = getDb();
  const rows = db.getAllSync<ProgramRow>(
    'SELECT * FROM programs ORDER BY id DESC',
  );
  return rows.map(row => {
    const liftRows = db.getAllSync<LiftRow>(
      'SELECT * FROM lifts WHERE program_id = ? ORDER BY sort_order',
      [row.id],
    );
    return {
      id: row.id,
      date: row.date,
      dateShort: row.date_short,
      status: row.status,
      lifts: liftRows.map(lift => rowToLift(db, lift)),
    };
  });
}

export function seedProgramsIfEmpty(): Program[] {
  const db = getDb();
  const existing = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM programs',
  );
  if ((existing?.count ?? 0) > 0) {
    return loadAllPrograms();
  }

  const programs = seedPrograms();
  db.withTransactionSync(() => {
    programs.forEach(program => {
      db.runSync(
        'INSERT INTO programs (id, date, date_short, status) VALUES (?, ?, ?, ?)',
        [program.id, program.date, program.dateShort, program.status],
      );
      program.lifts.forEach((lift, liftIdx) => {
        db.runSync(
          'INSERT INTO lifts (id, program_id, name, default_weight, sort_order) VALUES (?, ?, ?, ?, ?)',
          [lift.id, program.id, lift.name, lift.defaultWeight ?? null, liftIdx],
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
  });

  return loadAllPrograms();
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

export function setLiftPrescribedReps(liftId: string, prescribedReps: number) {
  const db = getDb();
  db.runSync(
    'UPDATE sets SET prescribed_reps = ? WHERE lift_id = ?',
    [prescribedReps, liftId],
  );
}

export function setSetPrescribedReps(liftId: string, setIndex: number, prescribedReps: number) {
  const db = getDb();
  db.runSync(
    'UPDATE sets SET prescribed_reps = ? WHERE lift_id = ? AND sort_order = ?',
    [prescribedReps, liftId, setIndex],
  );
}

export function setLiftSetCount(liftId: string, targetCount: number) {
  const db = getDb();
  const current = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sets WHERE lift_id = ?',
    [liftId],
  );
  const currentCount = current?.count ?? 0;
  if (targetCount === currentCount) return;

  if (targetCount > currentCount) {
    const last = db.getFirstSync<SetRow>(
      'SELECT * FROM sets WHERE lift_id = ? ORDER BY sort_order DESC LIMIT 1',
      [liftId],
    );
    db.withTransactionSync(() => {
      for (let i = currentCount; i < targetCount; i++) {
        db.runSync(
          `INSERT INTO sets (id, lift_id, sort_order, prescribed_reps, actual_reps,
            prescribed_weight, actual_weight, unit, completed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `${liftId}-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            liftId,
            i,
            last?.prescribed_reps ?? 5,
            null,
            last?.prescribed_weight ?? null,
            null,
            last?.unit ?? null,
            0,
          ],
        );
      }
    });
  } else {
    db.withTransactionSync(() => {
      for (let i = currentCount - 1; i >= targetCount; i--) {
        db.runSync(
          'DELETE FROM sets WHERE lift_id = ? AND sort_order = ?',
          [liftId, i],
        );
      }
    });
  }
}

export function setLiftDefaultWeight(liftId: string, weight: string) {
  const db = getDb();
  db.runSync('UPDATE lifts SET default_weight = ? WHERE id = ?', [weight, liftId]);
}

export function setProgramStatus(programId: string, status: 'draft' | 'published' | 'completed') {
  const db = getDb();
  db.runSync('UPDATE programs SET status = ? WHERE id = ?', [status, programId]);
}

export function addSetToLift(liftId: string) {
  const db = getDb();
  const last = db.getFirstSync<SetRow>(
    'SELECT * FROM sets WHERE lift_id = ? ORDER BY sort_order DESC LIMIT 1',
    [liftId],
  );
  const sortOrder = last ? last.sort_order + 1 : 0;
  const id = `${liftId}-${sortOrder}-${Date.now()}`;
  db.runSync(
    `INSERT INTO sets (id, lift_id, sort_order, prescribed_reps, actual_reps,
      prescribed_weight, actual_weight, unit, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      liftId,
      sortOrder,
      last?.prescribed_reps ?? 5,
      null,
      last?.prescribed_weight ?? null,
      null,
      last?.unit ?? null,
      0,
    ],
  );
}

export function removeLastSetFromLift(liftId: string) {
  const db = getDb();
  const last = db.getFirstSync<{ id: string }>(
    'SELECT id FROM sets WHERE lift_id = ? ORDER BY sort_order DESC LIMIT 1',
    [liftId],
  );
  if (!last) return;
  db.runSync('DELETE FROM sets WHERE id = ?', [last.id]);
}

export function removeLift(liftId: string) {
  const db = getDb();
  db.runSync('DELETE FROM lifts WHERE id = ?', [liftId]);
}
