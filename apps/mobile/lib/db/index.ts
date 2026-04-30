import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { SCHEMA_SQL, SCHEMA_VERSION } from './schema';

let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('studio-fit.db');
  db.execSync('PRAGMA foreign_keys = ON;');

  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  const installed = row?.user_version ?? 0;

  if (installed !== SCHEMA_VERSION) {
    db.execSync(`
      DROP TABLE IF EXISTS sets;
      DROP TABLE IF EXISTS lifts;
      DROP TABLE IF EXISTS programs;
      DROP TABLE IF EXISTS settings;
    `);
    db.execSync(SCHEMA_SQL);
    db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  } else {
    db.execSync(SCHEMA_SQL);
  }

  return db;
}
