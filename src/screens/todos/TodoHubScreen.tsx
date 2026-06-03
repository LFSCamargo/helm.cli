import { useEffect, useState } from 'react';
import { useInput } from 'ink';
import { Layout } from '../../components/Layout.js';
import { SelectList } from '../../components/SelectList.js';
import { MenuRow } from '../../components/MenuRow.js';
import { useRouter } from '../../navigation/RouterContext.js';
import { getProjectCustomDescription } from '../../core/prompts/prompt.service.js';
import { listTodoProjects, listTodos } from '../../core/todos/todo.service.js';
import { flow, gradients } from '../../theme/theme.js';
import { isOverdue, isToday } from '../../core/util/datetime.js';

interface HubEntry {
  id: string;
  label: string;
  description: string;
  meta?: string;
  go: () => void;
}

export function TodoHubScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<HubEntry[]>([]);

  useEffect(() => {
    void Promise.all([listTodos(), listTodoProjects()]).then(([todos, projects]) => {
      const open = todos.filter((t) => !t.completed);
      const todayCount = open.filter((t) => t.dueAt && isToday(t.dueAt)).length;
      const overdueCount = open.filter((t) => t.dueAt && isOverdue(t.dueAt)).length;

      const menu: HubEntry[] = [
        {
          id: 'today',
          label: 'Today',
          description: 'All open tasks due today, combined from every project.',
          meta: `${todayCount} due · ${overdueCount} overdue`,
          go: () => router.navigate({ name: 'todo-list', view: 'today' }),
        },
        ...projects.map((project) => {
          const count = open.filter((t) => t.project === project).length;
          const custom = getProjectCustomDescription(project);
          return {
            id: `project-${project}`,
            label: project,
            description:
              custom ?? `Tasks tagged #${project} — ${count} open right now.`,
            meta: `${count} open`,
            go: () => router.navigate({ name: 'todo-list', view: 'project', project }),
          };
        }),
      ];
      setEntries(menu);
    });
  }, []);

  useInput((input, key) => {
    if (key.escape) router.back();
    else if (input === 'n') router.navigate({ name: 'todo-create' });
  });

  return (
    <Layout
      breadcrumb={['Todos']}
      subtitle="Open Today for a cross-project digest, or drill into a project."
      accent={gradients.flame}
      bodyBorder={false}
      contentPaddingX={0}
      hints={[
        { key: '↑↓', label: 'navigate' },
        { key: '⏎', label: 'open' },
        { key: 'n', label: 'new' },
        { key: 'esc', label: 'back' },
      ]}
    >
      <SelectList
        items={entries}
        getKey={(e) => e.id}
        accent={flow.flame}
        emptyText="No projects yet. Press n to add a task with a project name."
        onSelect={(e) => e.go()}
        renderItem={(entry, selected) => (
          <MenuRow
            label={entry.label}
            description={entry.description}
            meta={entry.meta}
            selected={selected}
          />
        )}
      />
    </Layout>
  );
}
