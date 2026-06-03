import { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Logo } from '../components/Logo.js';
import { SelectList } from '../components/SelectList.js';
import { StatusBar } from '../components/StatusBar.js';
import { useRouter } from '../navigation/RouterContext.js';
import { listProjects } from '../core/prompts/prompt.service.js';
import { listTodos } from '../core/todos/todo.service.js';
import { colors, gradients, symbols } from '../theme/theme.js';
import { isOverdue, isToday } from '../core/util/datetime.js';
import Gradient from 'ink-gradient';

interface MenuEntry {
  id: string;
  icon: string;
  label: string;
  hint: string;
  accent: readonly string[];
  go: () => void;
}

interface Stats {
  projects: number;
  prompts: number;
  openTodos: number;
  today: number;
  overdue: number;
}

export function HomeScreen() {
  const router = useRouter();
  const { exit } = useApp();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    prompts: 0,
    openTodos: 0,
    today: 0,
    overdue: 0,
  });

  useEffect(() => {
    const projects = listProjects();
    void listTodos().then((todos) => {
      const open = todos.filter((t) => !t.completed);
      setStats({
        projects: projects.length,
        prompts: projects.reduce((sum, p) => sum + p.count, 0),
        openTodos: open.length,
        today: open.filter((t) => t.dueAt && isToday(t.dueAt)).length,
        overdue: open.filter((t) => t.dueAt && isOverdue(t.dueAt)).length,
      });
    });
  }, []);

  const entries: MenuEntry[] = [
    {
      id: 'prompts',
      icon: '◈',
      label: 'Prompts',
      hint: `${stats.prompts} prompts · ${stats.projects} projects`,
      accent: gradients.ocean,
      go: () => router.navigate({ name: 'prompt-projects' }),
    },
    {
      id: 'todos',
      icon: '✦',
      label: 'Todos',
      hint: `${stats.openTodos} open · ${stats.today} today · ${stats.overdue} overdue`,
      accent: gradients.flame,
      go: () => router.navigate({ name: 'todos' }),
    },
    {
      id: 'quit',
      icon: '⏻',
      label: 'Quit',
      hint: 'exit helm',
      accent: ['#6b7280', '#9ca3af'],
      go: () => exit(),
    },
  ];

  useInput((input) => {
    if (input === 'q') exit();
  });

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Logo />

      <Box marginTop={1} marginBottom={1}>
        <Gradient colors={[...gradients.sunrise]}>
          <Text>
            {symbols.spark} {stats.openTodos} tasks waiting · {stats.overdue} overdue {symbols.dot}{' '}
            let&apos;s ship something
          </Text>
        </Gradient>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.border}
        paddingX={2}
        paddingY={1}
      >
        <SelectList
          items={entries}
          getKey={(e) => e.id}
          onSelect={(e) => e.go()}
          renderItem={(entry, selected) => (
            <Box>
              <Box width={3}>
                <Gradient colors={[...entry.accent]}>
                  <Text bold>{entry.icon}</Text>
                </Gradient>
              </Box>
              <Box width={12}>
                <Text bold color={selected ? colors.text : colors.muted}>
                  {entry.label}
                </Text>
              </Box>
              <Text color={colors.dim}>{entry.hint}</Text>
            </Box>
          )}
        />
      </Box>

      <StatusBar
        hints={[
          { key: '↑↓', label: 'navigate' },
          { key: '⏎', label: 'open' },
          { key: 'q', label: 'quit' },
        ]}
      />
    </Box>
  );
}
