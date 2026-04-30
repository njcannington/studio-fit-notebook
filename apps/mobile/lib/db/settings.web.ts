import { getStore } from './store.web';

export type Role = 'client' | 'admin';

const ROLE_KEY = 'role';

export function getRole(): Role {
  const value = getStore().settings.get(ROLE_KEY);
  return value === 'admin' ? 'admin' : 'client';
}

export function setRole(role: Role) {
  getStore().settings.set(ROLE_KEY, role);
}
