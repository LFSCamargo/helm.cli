import { nanoid } from 'nanoid';
import { db } from '../db/client.js';
import type { TodoTable } from '../db/schema.js';
import type { Todo, TodoInput } from './todo.types.js';

const iso = (d: Date | null | undefined): string | null => (d ? d.toISOString() : null);
const toDate = (s: string | null): Date | null => (s ? new Date(s) : null);

function fromRow(row: TodoTable): Todo {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    project: row.project,
    priority: row.priority,
    dueAt: toDate(row.due_at),
    remindAt: toDate(row.remind_at),
    reminded: row.reminded === 1,
    completed: row.completed === 1,
    completedAt: toDate(row.completed_at),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/** Distinct non-empty project names from todos, sorted alphabetically. */
export async function listTodoProjects(): Promise<string[]> {
  const rows = await db
    .selectFrom('todos')
    .select('project')
    .where('project', 'is not', null)
    .execute();
  const names = new Set<string>();
  for (const row of rows) {
    const name = row.project?.trim();
    if (name) names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export async function listTodos(): Promise<Todo[]> {
  const rows = await db
    .selectFrom('todos')
    .selectAll()
    .orderBy('completed', 'asc')
    .orderBy('priority', 'asc')
    .orderBy('due_at', 'asc')
    .orderBy('created_at', 'desc')
    .execute();
  return rows.map(fromRow);
}

export async function getTodo(id: string): Promise<Todo | null> {
  const row = await db.selectFrom('todos').selectAll().where('id', '=', id).executeTakeFirst();
  return row ? fromRow(row) : null;
}

export async function createTodo(input: TodoInput): Promise<Todo> {
  const now = new Date().toISOString();
  const row: TodoTable = {
    id: nanoid(10),
    title: input.title.trim(),
    notes: input.notes?.trim() || null,
    project: input.project?.trim() || null,
    priority: input.priority ?? 4,
    due_at: iso(input.dueAt),
    remind_at: iso(input.remindAt),
    reminded: 0,
    completed: 0,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };
  await db.insertInto('todos').values(row).execute();
  return fromRow(row);
}

export async function updateTodo(id: string, input: TodoInput): Promise<void> {
  await db
    .updateTable('todos')
    .set({
      title: input.title.trim(),
      notes: input.notes?.trim() || null,
      project: input.project?.trim() || null,
      priority: input.priority ?? 4,
      due_at: iso(input.dueAt),
      remind_at: iso(input.remindAt),
      // Re-arm the reminder whenever the schedule is edited.
      reminded: 0,
      updated_at: new Date().toISOString(),
    })
    .where('id', '=', id)
    .execute();
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  const now = new Date().toISOString();
  await db
    .updateTable('todos')
    .set({
      completed: completed ? 1 : 0,
      completed_at: completed ? now : null,
      updated_at: now,
    })
    .where('id', '=', id)
    .execute();
}

export async function cyclePriority(id: string, current: number): Promise<void> {
  const next = current >= 4 ? 1 : current + 1;
  await db
    .updateTable('todos')
    .set({ priority: next, updated_at: new Date().toISOString() })
    .where('id', '=', id)
    .execute();
}

export async function deleteTodo(id: string): Promise<void> {
  await db.deleteFrom('todos').where('id', '=', id).execute();
}

/** Todos whose reminder time has passed and that haven't notified yet. */
export async function dueReminders(now = new Date()): Promise<Todo[]> {
  const rows = await db
    .selectFrom('todos')
    .selectAll()
    .where('completed', '=', 0)
    .where('reminded', '=', 0)
    .where('remind_at', 'is not', null)
    .where('remind_at', '<=', now.toISOString())
    .execute();
  return rows.map(fromRow);
}

export async function markReminded(id: string): Promise<void> {
  await db.updateTable('todos').set({ reminded: 1 }).where('id', '=', id).execute();
}
