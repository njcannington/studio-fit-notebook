import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { loadClients, setClientTime as persistClientTime } from './clients';
import { seedAllIfEmpty } from './programs';
import type { Client } from '@/lib/mock-data/today-program';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useFocusEffect(
    useCallback(() => {
      seedAllIfEmpty();
      setClients(loadClients());
    }, []),
  );

  const setClientTime = (clientId: string, time: string | null) => {
    persistClientTime(clientId, time);
    setClients(current =>
      current.map(c => (c.id === clientId ? { ...c, time: time ?? undefined } : c)),
    );
  };

  return { clients, setClientTime };
}
