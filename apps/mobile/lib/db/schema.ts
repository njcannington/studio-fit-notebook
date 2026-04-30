export const SCHEMA_VERSION = 3;

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  time TEXT
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  date_short TEXT NOT NULL,
  date_iso TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_programs_client_id ON programs(client_id);
CREATE INDEX IF NOT EXISTS idx_programs_date_iso ON programs(date_iso);

CREATE TABLE IF NOT EXISTS lifts (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  default_weight TEXT,
  sort_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lifts_program_id ON lifts(program_id);

CREATE TABLE IF NOT EXISTS sets (
  id TEXT PRIMARY KEY,
  lift_id TEXT NOT NULL REFERENCES lifts(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL,
  prescribed_reps INTEGER NOT NULL,
  actual_reps INTEGER,
  prescribed_weight TEXT,
  actual_weight TEXT,
  unit TEXT,
  completed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sets_lift_id ON sets(lift_id);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;
