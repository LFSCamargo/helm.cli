import { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Layout } from '../../components/Layout.js';
import { TodoForm, type TodoFormValues } from '../../components/TodoForm.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import { getTodo, updateTodo } from '../../core/todos/todo.service.js';
import { formatInput, parseDueDate, parseReminder } from '../../core/util/datetime.js';
import { colors, gradients } from '../../theme/theme.js';

export function TodoEditScreen({ id }: { id: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [initial, setInitial] = useState<TodoFormValues | null>(null);

  useEffect(() => {
    void getTodo(id).then((todo) => {
      if (!todo) {
        router.back();
        return;
      }
      setInitial({
        title: todo.title,
        notes: todo.notes ?? '',
        project: todo.project ?? '',
        priority: todo.priority,
        due: todo.dueAt ? formatInput(todo.dueAt) : '',
        reminder: todo.remindAt ? formatInput(todo.remindAt) : '',
      });
    });
  }, [id, router]);

  useInput((_input, key) => {
    if (key.escape) router.back();
  });

  const handleSubmit = (values: TodoFormValues) => {
    const dueAt = parseDueDate(values.due);
    void updateTodo(id, {
      title: values.title,
      notes: values.notes,
      project: values.project,
      priority: values.priority,
      dueAt,
      remindAt: parseReminder(values.reminder, dueAt),
    }).then(() => router.back());
  };

  return (
    <Layout
      breadcrumb={['Todos', 'Edit']}
      title="Edit task"
      accent={gradients.flame}
      message={toast}
      hints={[
        { key: '↑↓/⇥', label: 'fields' },
        { key: '←→', label: 'priority' },
        { key: '^S/⏎', label: 'save' },
        { key: 'esc', label: 'cancel' },
      ]}
    >
      {initial ? (
        <TodoForm initial={initial} onSubmit={handleSubmit} onError={(m) => show(m, 'danger')} />
      ) : (
        <Box>
          <Text color={colors.accent}>
            <Spinner type="dots" />
          </Text>
          <Text color={colors.dim}> loading…</Text>
        </Box>
      )}
    </Layout>
  );
}
