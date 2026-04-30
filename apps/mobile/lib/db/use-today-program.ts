import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  addSetToLift,
  loadProgram,
  removeLastSetFromLift,
  removeLift,
  seedProgramsIfEmpty,
  setLiftDefaultWeight,
  setProgramStatus,
  setSetActualReps,
  setSetCompleted,
} from './programs';
import { todayProgramId, type Program } from '@/lib/mock-data/today-program';

export function useTodayProgram(programIdOverride?: string) {
  const programId = programIdOverride ?? todayProgramId();
  const [program, setProgram] = useState<Program | null>(null);

  useFocusEffect(
    useCallback(() => {
      seedProgramsIfEmpty();
      const loaded = loadProgram(programId);
      setProgram(loaded);
    }, [programId]),
  );

  const reload = () => {
    const fresh = loadProgram(programId);
    if (fresh) setProgram(fresh);
  };

  const toggleSet = (liftId: string, setIndex: number, next: boolean) => {
    setSetCompleted(liftId, setIndex, next);
    setProgram(current =>
      current
        ? {
            ...current,
            lifts: current.lifts.map(lift =>
              lift.id === liftId
                ? {
                    ...lift,
                    sets: lift.sets.map((set, idx) =>
                      idx === setIndex ? { ...set, completed: next } : set,
                    ),
                  }
                : lift,
            ),
          }
        : current,
    );
  };

  const updateActualReps = (liftId: string, setIndex: number, value: number) => {
    setSetActualReps(liftId, setIndex, value);
    setProgram(current =>
      current
        ? {
            ...current,
            lifts: current.lifts.map(lift =>
              lift.id === liftId
                ? {
                    ...lift,
                    sets: lift.sets.map((set, idx) =>
                      idx === setIndex ? { ...set, actualReps: value } : set,
                    ),
                  }
                : lift,
            ),
          }
        : current,
    );
  };

  const updateLiftWeight = (liftId: string, weight: string) => {
    setLiftDefaultWeight(liftId, weight);
    setProgram(current =>
      current
        ? {
            ...current,
            lifts: current.lifts.map(lift =>
              lift.id === liftId ? { ...lift, defaultWeight: weight } : lift,
            ),
          }
        : current,
    );
  };

  const updateStatus = (status: 'draft' | 'published' | 'completed') => {
    if (!program) return;
    setProgramStatus(program.id, status);
    setProgram(current => (current ? { ...current, status } : current));
  };

  const addSet = (liftId: string) => {
    addSetToLift(liftId);
    reload();
  };

  const removeSet = (liftId: string) => {
    removeLastSetFromLift(liftId);
    reload();
  };

  const deleteLift = (liftId: string) => {
    removeLift(liftId);
    reload();
  };

  return {
    program,
    toggleSet,
    updateActualReps,
    updateLiftWeight,
    updateStatus,
    addSet,
    removeSet,
    deleteLift,
  };
}
