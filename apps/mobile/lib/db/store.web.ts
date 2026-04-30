// In-memory data store for the web demo build.
// Backed by the same seed data the SQLite path uses on native.
// Mutations persist for the lifetime of the page (resets on refresh).

import {
  seedClients,
  seedPrograms,
  type Client,
  type Lift,
  type Program,
  type SetEntry,
} from '@/lib/mock-data/today-program';

type Store = {
  clients: Client[];
  programs: Program[];
  settings: Map<string, string>;
};

let store: Store | null = null;

export function getStore(): Store {
  if (store) return store;
  store = {
    clients: seedClients(),
    programs: clone(seedPrograms()),
    settings: new Map(),
  };
  return store;
}

export function findProgram(id: string): Program | undefined {
  return getStore().programs.find(p => p.id === id);
}

export function findLift(liftId: string):
  | { program: Program; lift: Lift }
  | undefined {
  const programs = getStore().programs;
  for (const program of programs) {
    const lift = program.lifts.find(l => l.id === liftId);
    if (lift) return { program, lift };
  }
  return undefined;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function mutateProgram(id: string, fn: (p: Program) => void) {
  const program = findProgram(id);
  if (program) fn(program);
}

export function mutateLift(liftId: string, fn: (l: Lift) => void) {
  const found = findLift(liftId);
  if (found) fn(found.lift);
}

export function mutateSet(
  liftId: string,
  setIndex: number,
  fn: (s: SetEntry) => void,
) {
  const found = findLift(liftId);
  if (!found) return;
  const set = found.lift.sets[setIndex];
  if (set) fn(set);
}
