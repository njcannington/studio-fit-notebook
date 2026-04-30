import { clone, findLift, findProgram, getStore, mutateLift, mutateProgram, mutateSet } from './store.web';
import type { Program, SetEntry } from '@/lib/mock-data/today-program';

export function loadProgram(programId: string): Program | null {
  const program = findProgram(programId);
  return program ? clone(program) : null;
}

export function loadAllPrograms(): Program[] {
  return clone(
    getStore().programs.slice().sort((a, b) => b.dateIso.localeCompare(a.dateIso)),
  );
}

export function loadProgramsForDate(dateIso: string): Program[] {
  return clone(getStore().programs.filter(p => p.dateIso === dateIso));
}

export function loadProgramsForClient(clientId: string): Program[] {
  return clone(
    getStore()
      .programs.filter(p => p.clientId === clientId)
      .sort((a, b) => b.dateIso.localeCompare(a.dateIso)),
  );
}

export function seedAllIfEmpty(): { programs: Program[] } {
  // Seed runs eagerly inside getStore on web; this is just a no-op handle.
  return { programs: loadAllPrograms() };
}

export function setSetCompleted(liftId: string, setIndex: number, completed: boolean) {
  mutateSet(liftId, setIndex, set => {
    set.completed = completed;
  });
}

export function setSetActualReps(liftId: string, setIndex: number, actualReps: number | null) {
  mutateSet(liftId, setIndex, set => {
    set.actualReps = actualReps ?? undefined;
  });
}

export function setLiftPrescribedReps(liftId: string, prescribedReps: number) {
  mutateLift(liftId, lift => {
    lift.sets = lift.sets.map(s => ({ ...s, prescribedReps }));
  });
}

export function setSetPrescribedReps(liftId: string, setIndex: number, prescribedReps: number) {
  mutateSet(liftId, setIndex, set => {
    set.prescribedReps = prescribedReps;
  });
}

export function setLiftSetCount(liftId: string, targetCount: number) {
  const found = findLift(liftId);
  if (!found) return;
  const { lift } = found;
  const currentCount = lift.sets.length;
  if (targetCount === currentCount) return;
  if (targetCount > currentCount) {
    const last = lift.sets[currentCount - 1];
    const template: SetEntry = last
      ? { ...last, completed: false, actualReps: undefined }
      : { prescribedReps: 5, completed: false };
    for (let i = currentCount; i < targetCount; i++) {
      lift.sets.push({ ...template });
    }
  } else {
    lift.sets = lift.sets.slice(0, targetCount);
  }
}

export function setLiftDefaultWeight(liftId: string, weight: string) {
  mutateLift(liftId, lift => {
    lift.defaultWeight = weight;
  });
}

export function setProgramStatus(programId: string, status: 'draft' | 'published' | 'completed') {
  mutateProgram(programId, program => {
    program.status = status;
  });
}

export function addSetToLift(liftId: string) {
  mutateLift(liftId, lift => {
    const last = lift.sets[lift.sets.length - 1];
    const next: SetEntry = last
      ? { ...last, completed: false, actualReps: undefined }
      : { prescribedReps: 5, completed: false };
    lift.sets.push({ ...next });
  });
}

export function removeLastSetFromLift(liftId: string) {
  mutateLift(liftId, lift => {
    lift.sets.pop();
  });
}

export function removeLift(liftId: string) {
  const found = findLift(liftId);
  if (!found) return;
  found.program.lifts = found.program.lifts.filter(l => l.id !== liftId);
}
