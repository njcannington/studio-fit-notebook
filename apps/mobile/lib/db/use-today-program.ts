import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  loadTodayProgram,
  seedTodayProgramIfEmpty,
  setLiftDefaultWeight,
  setProgramStatus,
  setSetActualReps,
  setSetCompleted,
} from './programs';
import type { Program } from '@/lib/mock-data/today-program';

export function useTodayProgram() {
  const [program, setProgram] = useState<Program | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fresh = seedTodayProgramIfEmpty();
      setProgram(fresh);
    }, []),
  );

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
    setProgramStatus(status);
    setProgram(current => (current ? { ...current, status } : current));
  };

  return { program, toggleSet, updateActualReps, updateLiftWeight, updateStatus };
}
