import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { HelmDatabase } from './schema.js';
import { DB_PATH, ensureDirs } from '../../config/paths.js';

ensureDirs();

const sqlite = new BetterSqlite3(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = new Kysely<HelmDatabase>({
  dialect: new SqliteDialect({ database: sqlite }),
});
