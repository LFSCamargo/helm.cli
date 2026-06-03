/**
 * Kysely table definitions. Dates are stored as ISO-8601 strings and booleans
 * as 0/1 integers, which keeps the schema portable across SQLite tooling.
 */

export interface TodoTable {
  id: string;
  title: string;
  notes: string | null;
  project: string | null;
  priority: number;
  due_at: string | null;
  remind_at: string | null;
  reminded: number;
  completed: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HelmDatabase {
  todos: TodoTable;
}
