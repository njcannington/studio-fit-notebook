import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';

let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('studio-fit.db');
  db.execSync('PRAGMA foreign_keys = ON;');
  db.execSync(SCHEMA_SQL);
  return db;
}
