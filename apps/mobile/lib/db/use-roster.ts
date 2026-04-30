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
      // Today's roster = clients with a session time set, plus anyone who has
      // a program for today regardless of time (e.g. walk-ins added by trainer).
      setRows(
        clients
          .filter(c => c.time || programByClient.has(c.id))
          .map(client => ({
            client,
            program: programByClient.get(client.id) ?? null,
          })),
      );
    }, []),
  );

  return rows;
}
