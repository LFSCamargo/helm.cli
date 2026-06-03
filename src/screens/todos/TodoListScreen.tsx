import { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import {
  cyclePriority,
  deleteTodo,
  listTodos,
  toggleTodo,
} from '../../core/todos/todo.service.js';
import type { Todo } from '../../core/todos/todo.types.js';
import { colors, gradients, priorityMeta, symbols } from '../../theme/theme.js';
import { formatRelative, isOverdue } from '../../core/util/datetime.js';

export function TodoListScreen() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    void listTodos().then(setTodos);
  }, [tick]);

  const reload = () => setTick((t) => t + 1);

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'todo-create' });
  });

  const open = todos.filter((t) => !t.completed).length;
  const done = todos.length - open;

  return (
    <Layout
      breadcrumb={['Todos']}
      title="Todos"
      subtitle={`${open} open · ${done} done — like Todoist, in your terminal`}
      accent={gradients.flame}
      message={toast}
      hints={[
        { key: '↑↓', label: 'navigate' },
        { key: '␣/⏎', label: 'toggle' },
        { key: 'n', label: 'new' },
        { key: 'e', label: 'edit' },
        { key: 'p', label: 'priority' },
        { key: 'd', label: 'delete' },
        { key: 'esc', label: 'back' },
      ]}
    >
      <SelectList
        items={todos}
        getKey={(t) => t.id}
        emptyText="Inbox zero ✦ Press n to add your first task."
        onSelect={(t) => {
          void toggleTodo(t.id, !t.completed).then(reload);
        }}
        actions={{
          ' ': (t) => void toggleTodo(t.id, !t.completed).then(reload),
          e: (t) => router.navigate({ name: 'todo-edit', id: t.id }),
          p: (t) => void cyclePriority(t.id, t.priority).then(reload),
          d: (t) => {
            void deleteTodo(t.id).then(() => {
              show(`Deleted "${t.title}"`, 'danger');
              reload();
            });
          },
        }}
        renderItem={(todo, selected) => <TodoRow todo={todo} selected={selected} />}
      />
    </Layout>
  );
}

function TodoRow({ todo, selected }: { todo: Todo; selected: boolean }) {
  const meta = priorityMeta[todo.priority];
  const overdue = todo.dueAt && !todo.completed && isOverdue(todo.dueAt);
  return (
    <Box>
      <Box width={3}>
        <Text color={todo.completed ? colors.success : colors.dim}>
          {todo.completed ? symbols.check : symbols.uncheck}
        </Text>
      </Box>
      <Box width={2}>
        <Text color={meta.color}>{meta.dot}</Text>
      </Box>
      <Box width={34}>
        <Text
          color={todo.completed ? colors.dim : selected ? colors.text : colors.muted}
          strikethrough={todo.completed}
          bold={selected && !todo.completed}
        >
          {todo.title}
        </Text>
      </Box>
      {todo.project ? (
        <Box marginRight={1}>
          <Text color={colors.accent}>#{todo.project}</Text>
        </Box>
      ) : null}
      {todo.dueAt ? (
        <Box marginRight={1}>
          <Text color={overdue ? colors.danger : colors.dim}>
            {symbols.clock} {formatRelative(todo.dueAt)}
          </Text>
        </Box>
      ) : null}
      {todo.remindAt && !todo.reminded && !todo.completed ? (
        <Text color={colors.warning}>{symbols.spark}</Text>
      ) : null}
    </Box>
  );
}
