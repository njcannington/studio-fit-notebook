import { getDb } from './index';
import type { Client } from '@/lib/mock-data/today-program';

type ClientRow = {
  id: string;
  name: string;
  time: string | null;
};

export function loadClients(): Client[] {
  const db = getDb();
  const rows = db.getAllSync<ClientRow>(
    'SELECT * FROM clients ORDER BY time, name',
  );
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    time: r.time ?? undefined,
  }));
}

export function loadClient(id: string): Client | null {
  const db = getDb();
  const row = db.getFirstSync<ClientRow>('SELECT * FROM clients WHERE id = ?', [id]);
  if (!row) return null;
  return { id: row.id, name: row.name, time: row.time ?? undefined };
}

export function insertClient(client: Client) {
  const db = getDb();
  db.runSync(
    'INSERT INTO clients (id, name, time) VALUES (?, ?, ?)',
    [client.id, client.name, client.time ?? null],
  );
}

export function setClientTime(clientId: string, time: string | null) {
  const db = getDb();
  db.runSync('UPDATE clients SET time = ? WHERE id = ?', [time, clientId]);
}
