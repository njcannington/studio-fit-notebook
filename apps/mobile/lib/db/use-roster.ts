import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { loadClients } from './clients';
import { loadProgramsForDate, seedAllIfEmpty } from './programs';
import { todayIso, type Client, type Program } from '@/lib/mock-data/today-program';

export type RosterRow = {
  client: Client;
  program: Program | null;
};

export function useTodayRoster() {
  const [rows, setRows] = useState<RosterRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      seedAllIfEmpty();
      const clients = loadClients();
      const programs = loadProgramsForDate(todayIso());
      const programByClient = new Map(programs.map(p => [p.clientId, p]));
      setRows(
        clients.map(client => ({
          client,
          program: programByClient.get(client.id) ?? null,
        })),
      );
    }, []),
  );

  return rows;
}
