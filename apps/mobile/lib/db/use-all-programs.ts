import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { loadAllPrograms, loadProgramsForClient, seedAllIfEmpty } from './programs';
import type { Program } from '@/lib/mock-data/today-program';

export function useAllPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useFocusEffect(
    useCallback(() => {
      seedAllIfEmpty();
      setPrograms(loadAllPrograms());
    }, []),
  );

  return programs;
}

export function useClientPrograms(clientId: string) {
  const [programs, setPrograms] = useState<Program[]>([]);

  useFocusEffect(
    useCallback(() => {
      seedAllIfEmpty();
      setPrograms(loadProgramsForClient(clientId));
    }, [clientId]),
  );

  return programs;
}
