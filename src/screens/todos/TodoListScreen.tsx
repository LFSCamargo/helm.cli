import { useEffect, useMemo, useState } from 'react';
import { Box, useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { PriorityTodoList } from '../../components/PriorityTodoList.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { useToast } from '../../hooks/useToast.js';
import {
  cyclePriority,
  deleteTodo,
  listTodos,
  toggleTodo,
} from '../../core/todos/todo.service.js';
import { getProjectCustomDescription } from '../../core/prompts/prompt.service.js';
import type { Route } from '../../navigation/routes.js';
import { colors, flow, gradients } from '../../theme/theme.js';
import { isToday } from '../../core/util/datetime.js';

type TodoListRoute = Extract<Route, { name: 'todo-list' }>;

function filterTodos(
  todos: Awaited<ReturnType<typeof listTodos>>,
  route: TodoListRoute,
): Awaited<ReturnType<typeof listTodos>> {
  if (route.view === 'today') {
    return todos.filter((t) => !t.completed && t.dueAt && isToday(t.dueAt));
  }
  return todos.filter((t) => t.project === route.project);
}

function listSubtitle(route: TodoListRoute, open: number, done: number): string {
  if (route.view === 'today') {
    return `${open} due today across all projects`;
  }
  const custom = getProjectCustomDescription(route.project);
  const desc =
    custom ?? `Tasks in #${route.project} · ${open} open · ${done} done`;
  return custom ? `${desc} · ${open} open · ${done} done` : desc;
}

export function TodoListScreen({ route }: { route: TodoListRoute }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [todos, setTodos] = useState<Awaited<ReturnType<typeof listTodos>>>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    void listTodos().then(setTodos);
  }, [tick]);

  const filtered = useMemo(() => filterTodos(todos, route), [todos, route]);
  const reload = () => setTick((t) => t + 1);
  const open = filtered.filter((t) => !t.completed).length;
  const done = filtered.length - open;
  const showProject = route.view === 'today';
  const createProject = route.view === 'project' ? route.project : undefined;

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'todo-create', project: createProject });
  });

  const breadcrumb =
    route.view === 'today' ? ['Todos', 'Today'] : ['Todos', route.project];

  const title = route.view === 'today' ? 'Today' : route.project;

  return (
    <Layout
      breadcrumb={breadcrumb}
      title={title}
      subtitle={listSubtitle(route, open, done)}
      accent={gradients.flame}
      bodyBorder={false}
      contentPaddingX={0}
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
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.border}
        paddingX={1}
        paddingY={0}
      >
        <PriorityTodoList
          todos={filtered}
          showProject={showProject}
          accent={flow.flame}
          emptyText={
            route.view === 'today'
              ? 'Nothing due today — enjoy the calm.'
              : 'No tasks in this project. Press n to add one.'
          }
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
        />
      </Box>
    </Layout>
  );
}
