// Web build does not use SQLite. Hooks call DAL functions in
// programs.web.ts / clients.web.ts / settings.web.ts, which read
// from the in-memory store in store.web.ts. This file exists so any
// stray import of `./index` from web code doesn't try to pull in
// expo-sqlite (which has no web target).

export function getDb(): never {
  throw new Error('getDb() is not available on web. Use the DAL helpers directly.');
}
