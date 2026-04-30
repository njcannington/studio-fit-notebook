import { getDb } from './index';

export type Role = 'client' | 'admin';

const ROLE_KEY = 'role';

export function getRole(): Role {
  const db = getDb();
  const row = db.getFirstSync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [ROLE_KEY],
  );
  return row?.value === 'admin' ? 'admin' : 'client';
}

export function setRole(role: Role) {
  const db = getDb();
  db.runSync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [ROLE_KEY, role],
  );
}
