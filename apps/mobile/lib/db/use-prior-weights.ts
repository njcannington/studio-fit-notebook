import { useMemo } from 'react';
import { loadPriorWeight } from './programs';
import type { Program } from '@/lib/mock-data/today-program';

/**
 * For each lift in the current program, look up the most recent prescribed
 * weight for a lift of the same name, on the same client, on a prior date.
 * Returns a map keyed by lift.id; entries omitted when there is no prior.
 */
export function usePriorWeights(program: Program | null): Map<string, string> {
  return useMemo(() => {
    const out = new Map<string, string>();
    if (!program) return out;
    program.lifts.forEach(lift => {
      const prior = loadPriorWeight(program.clientId, program.dateIso, lift.name);
      if (prior && prior !== lift.defaultWeight) {
        out.set(lift.id, prior);
      }
    });
    return out;
  }, [program]);
}
