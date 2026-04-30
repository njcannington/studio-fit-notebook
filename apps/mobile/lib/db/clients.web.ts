import { getStore } from './store.web';
import type { Client } from '@/lib/mock-data/today-program';

export function loadClients(): Client[] {
  return getStore().clients.slice().sort((a, b) => {
    const at = a.time ?? '';
    const bt = b.time ?? '';
    if (at !== bt) return at.localeCompare(bt);
    return a.name.localeCompare(b.name);
  });
}

export function loadClient(id: string): Client | null {
  return getStore().clients.find(c => c.id === id) ?? null;
}

export function insertClient(client: Client) {
  getStore().clients.push({ ...client });
}

export function setClientTime(clientId: string, time: string | null) {
  const client = getStore().clients.find(c => c.id === clientId);
  if (client) client.time = time ?? undefined;
}
