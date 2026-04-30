import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { loadAllPrograms, seedProgramsIfEmpty } from './programs';
import type { Program } from '@/lib/mock-data/today-program';

export function useAllPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useFocusEffect(
    useCallback(() => {
      seedProgramsIfEmpty();
      setPrograms(loadAllPrograms());
    }, []),
  );

  return programs;
}
