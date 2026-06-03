import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/client.js';
import {
  createTodo,
  cyclePriority,
  deleteTodo,
  dueReminders,
  getTodo,
  listTodoProjects,
  listTodos,
  markReminded,
  toggleTodo,
  updateTodo,
} from '../todo.service.js';

describe('todo service integration', () => {
  beforeEach(async () => {
    await db.deleteFrom('todos').execute();
  });

  it('creates, lists, updates, toggles, and deletes todos', async () => {
    const created = await createTodo({
      title: 'Ship feature',
      project: 'helm-cli',
      priority: 2,
      dueAt: new Date('2026-06-10T17:00:00'),
    });
    expect(created.title).toBe('Ship feature');

    const listed = await listTodos();
    expect(listed).toHaveLength(1);

    await updateTodo(created.id, {
      title: 'Ship feature v2',
      notes: 'notes',
      project: 'helm-cli',
      priority: 2,
    });
    const updated = await getTodo(created.id);
    expect(updated?.title).toBe('Ship feature v2');

    await toggleTodo(created.id, true);
    expect((await getTodo(created.id))?.completed).toBe(true);

    await deleteTodo(created.id);
    expect(await getTodo(created.id)).toBeNull();
  });

  it('returns due reminders and marks reminded', async () => {
    const due = new Date('2020-01-01T10:00:00');
    const created = await createTodo({
      title: 'Remind me',
      remindAt: due,
    });
    const dueList = await dueReminders(new Date('2020-01-01T11:00:00'));
    expect(dueList.some((t) => t.id === created.id)).toBe(true);
    await markReminded(created.id);
    const after = await dueReminders(new Date('2020-01-01T11:00:00'));
    expect(after.some((t) => t.id === created.id)).toBe(false);
  });

  it('cycles priority and lists distinct projects', async () => {
    await createTodo({ title: 'A', project: 'alpha', priority: 4 });
    await createTodo({ title: 'B', project: 'beta', priority: 4 });
    const first = await createTodo({ title: 'C', project: 'alpha', priority: 1 });
    await cyclePriority(first.id, 1);
    const projects = await listTodoProjects();
    expect(projects).toEqual(['alpha', 'beta']);
  });
});
