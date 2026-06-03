import { sql } from 'kysely';
import { db } from './client.js';

/**
 * Idempotent schema setup. Runs on every launch before the UI mounts so the
 * database is always ready. Kept intentionally simple (create-if-not-exists)
 * rather than a full versioned migration runner.
 */
export async function migrate(): Promise<void> {
  await db.schema
    .createTable('todos')
    .ifNotExists()
    .addColumn('id', 'text', (c) => c.primaryKey())
    .addColumn('title', 'text', (c) => c.notNull())
    .addColumn('notes', 'text')
    .addColumn('project', 'text')
    .addColumn('priority', 'integer', (c) => c.notNull().defaultTo(4))
    .addColumn('due_at', 'text')
    .addColumn('remind_at', 'text')
    .addColumn('reminded', 'integer', (c) => c.notNull().defaultTo(0))
    .addColumn('completed', 'integer', (c) => c.notNull().defaultTo(0))
    .addColumn('completed_at', 'text')
    .addColumn('created_at', 'text', (c) => c.notNull())
    .addColumn('updated_at', 'text', (c) => c.notNull())
    .execute();

  await db.schema
    .createIndex('idx_todos_completed')
    .ifNotExists()
    .on('todos')
    .columns(['completed', 'priority'])
    .execute();

  await sql`PRAGMA optimize`.execute(db);
}
