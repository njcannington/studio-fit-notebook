import { getDb } from './index';
import { seedClients, seedPrograms } from '@/lib/mock-data/today-program';
import type { Lift, Program, SetEntry } from '@/lib/mock-data/today-program';

type ProgramRow = {
  id: string;
  client_id: string;
  date: string;
  date_short: string;
  date_iso: string;
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
  note: string | null;
};

function rowToSet(s: SetRow): SetEntry {
  return {
    prescribedReps: s.prescribed_reps,
    actualReps: s.actual_reps ?? undefined,
    prescribedWeight: s.prescribed_weight ?? undefined,
    actualWeight: s.actual_weight ?? undefined,
    unit: (s.unit as SetEntry['unit']) ?? undefined,
    completed: s.completed === 1,
    note: s.note ?? undefined,
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

function rowToProgram(db: ReturnType<typeof getDb>, row: ProgramRow): Program {
  const liftRows = db.getAllSync<LiftRow>(
    'SELECT * FROM lifts WHERE program_id = ? ORDER BY sort_order',
    [row.id],
  );
  return {
    id: row.id,
    clientId: row.client_id,
    date: row.date,
    dateShort: row.date_short,
    dateIso: row.date_iso,
    status: row.status,
    lifts: liftRows.map(lift => rowToLift(db, lift)),
  };
}

export function loadProgram(programId: string): Program | null {
  const db = getDb();
  const row = db.getFirstSync<ProgramRow>(
    'SELECT * FROM programs WHERE id = ?',
    [programId],
  );
  if (!row) return null;
  return rowToProgram(db, row);
}

export function loadAllPrograms(): Program[] {
  const db = getDb();
  const rows = db.getAllSync<ProgramRow>(
    'SELECT * FROM programs ORDER BY date_iso DESC',
  );
  return rows.map(row => rowToProgram(db, row));
}

export function loadProgramsForDate(dateIso: string): Program[] {
  const db = getDb();
  const rows = db.getAllSync<ProgramRow>(
    'SELECT * FROM programs WHERE date_iso = ?',
    [dateIso],
  );
  return rows.map(row => rowToProgram(db, row));
}

export function loadProgramsForClient(clientId: string): Program[] {
  const db = getDb();
  const rows = db.getAllSync<ProgramRow>(
    'SELECT * FROM programs WHERE client_id = ? ORDER BY date_iso DESC',
    [clientId],
  );
  return rows.map(row => rowToProgram(db, row));
}

/**
 * Most recent prescribed weight for a lift with this name, for this client,
 * before currentDateIso. Used by the program-builder spec's "was X" annotation.
 * Matches by lift name because lift IDs are unique per program in our seed.
 */
export function loadPriorWeight(
  clientId: string,
  currentDateIso: string,
  liftName: string,
): string | null {
  const db = getDb();
  const row = db.getFirstSync<{ default_weight: string | null }>(
    `SELECT lifts.default_weight
     FROM lifts
     INNER JOIN programs ON lifts.program_id = programs.id
     WHERE programs.client_id = ?
       AND programs.date_iso < ?
       AND lifts.name = ?
     ORDER BY programs.date_iso DESC
     LIMIT 1`,
    [clientId, currentDateIso, liftName],
  );
  return row?.default_weight ?? null;
}

export function seedAllIfEmpty(): { programs: Program[] } {
  const db = getDb();
  const existing = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM clients',
  );
  if ((existing?.count ?? 0) > 0) {
    return { programs: loadAllPrograms() };
  }

  const clients = seedClients();
  const programs = seedPrograms();

  db.withTransactionSync(() => {
    clients.forEach(client => {
      db.runSync(
        'INSERT INTO clients (id, name, time) VALUES (?, ?, ?)',
        [client.id, client.name, client.time ?? null],
      );
    });
    programs.forEach(program => {
      db.runSync(
        `INSERT INTO programs (id, client_id, date, date_short, date_iso, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          program.id,
          program.clientId,
          program.date,
          program.dateShort,
          program.dateIso,
          program.status,
        ],
      );
      program.lifts.forEach((lift, liftIdx) => {
        db.runSync(
          'INSERT INTO lifts (id, program_id, name, default_weight, sort_order) VALUES (?, ?, ?, ?, ?)',
          [lift.id, program.id, lift.name, lift.defaultWeight ?? null, liftIdx],
        );
        lift.sets.forEach((set, setIdx) => {
          db.runSync(
            `INSERT INTO sets (id, lift_id, sort_order, prescribed_reps, actual_reps,
              prescribed_weight, actual_weight, unit, completed, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
              set.note ?? null,
            ],
          );
        });
      });
    });
  });

  return { programs: loadAllPrograms() };
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
            prescribed_weight, actual_weight, unit, completed, note)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            null,
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
      prescribed_weight, actual_weight, unit, completed, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      null,
    ],
  );
}

export function setSetNote(liftId: string, setIndex: number, note: string | null) {
  const db = getDb();
  db.runSync(
    'UPDATE sets SET note = ? WHERE lift_id = ? AND sort_order = ?',
    [note, liftId, setIndex],
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

export function addLiftToProgram(
  programId: string,
  template: {
    name: string;
    defaultWeight: string;
    defaultReps: number;
    defaultSetCount: number;
    unit?: 'reps' | 'sec';
  },
) {
  const db = getDb();
  const existing = db.getFirstSync<{ count: number; max_order: number | null }>(
    'SELECT COUNT(*) as count, MAX(sort_order) as max_order FROM lifts WHERE program_id = ?',
    [programId],
  );
  const sortOrder = (existing?.max_order ?? -1) + 1;
  const liftId = `${slugify(template.name)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  db.withTransactionSync(() => {
    db.runSync(
      'INSERT INTO lifts (id, program_id, name, default_weight, sort_order) VALUES (?, ?, ?, ?, ?)',
      [liftId, programId, template.name, template.defaultWeight, sortOrder],
    );
    for (let i = 0; i < template.defaultSetCount; i++) {
      db.runSync(
        `INSERT INTO sets (id, lift_id, sort_order, prescribed_reps, actual_reps,
          prescribed_weight, actual_weight, unit, completed, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${liftId}-${i}`,
          liftId,
          i,
          template.defaultReps,
          null,
          null,
          null,
          template.unit ?? null,
          0,
          null,
        ],
      );
    }
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
