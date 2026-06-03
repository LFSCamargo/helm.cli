import { useEffect, useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Logo } from '../components/Logo.js';
import { SelectList } from '../components/SelectList.js';
import { StatusBar } from '../components/StatusBar.js';
import { AnimatedGradient } from '../components/AnimatedGradient.js';
import { useRouter } from '../navigation/RouterContext.js';
import { listRecentPrompts } from '../core/prompts/prompt.service.js';
import { listTodos } from '../core/todos/todo.service.js';
import type { PromptMeta } from '../core/prompts/prompt.types.js';
import { colors, flow, symbols } from '../theme/theme.js';
import { MenuText } from '../components/MenuText.js';
import { isOverdue, isToday } from '../core/util/datetime.js';

interface MenuEntry {
  id: string;
  label: string;
  hint: string;
  accent: readonly string[];
  go: () => void;
}

interface TaskStats {
  open: number;
  today: number;
  overdue: number;
}

function StatTile({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={colors.border}
      paddingX={2}
      marginRight={1}
      alignItems="center"
    >
      <Text bold color={color}>
        {value}
      </Text>
      <Text color={colors.dim}>{label}</Text>
    </Box>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { exit } = useApp();
  const [stats, setStats] = useState<TaskStats>({ open: 0, today: 0, overdue: 0 });
  const [recentPrompts, setRecentPrompts] = useState<PromptMeta[]>([]);
  const [focus, setFocus] = useState<'recent' | 'main'>('main');

  useEffect(() => {
    const recent = listRecentPrompts(5);
    setRecentPrompts(recent);
    if (recent.length > 0) setFocus('recent');
    void listTodos().then((todos) => {
      const open = todos.filter((t) => !t.completed);
      setStats({
        open: open.length,
        today: open.filter((t) => t.dueAt && isToday(t.dueAt)).length,
        overdue: open.filter((t) => t.dueAt && isOverdue(t.dueAt)).length,
      });
    });
  }, []);

  const entries: MenuEntry[] = [
    {
      id: 'prompts',
      label: 'Prompts',
      hint: 'browse your prompt library',
      accent: flow.ocean,
      go: () => router.navigate({ name: 'prompt-projects' }),
    },
    {
      id: 'todos',
      label: 'Todos',
      hint: `${stats.open} open · ${stats.today} today · ${stats.overdue} overdue`,
      accent: flow.flame,
      go: () => router.navigate({ name: 'todos' }),
    },
    {
      id: 'quit',
      label: 'Quit',
      hint: 'exit helm',
      accent: ['#6b7280', '#9ca3af', '#6b7280'],
      go: () => exit(),
    },
  ];

  const toggleFocus = useCallback(() => {
    if (recentPrompts.length === 0) return;
    setFocus((f) => (f === 'recent' ? 'main' : 'recent'));
  }, [recentPrompts.length]);

  useInput((input, key) => {
    if (input === 'q') exit();
    else if (key.tab) toggleFocus();
  });

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Logo />

      <Box marginTop={1} marginBottom={1}>
        <AnimatedGradient colors={flow.sunrise} speedMs={140}>
          {`${symbols.spark} ${stats.open} tasks waiting · ${stats.overdue} overdue ${symbols.dot} let's ship something`}
        </AnimatedGradient>
      </Box>

      <Box marginBottom={1}>
        <StatTile
          value={stats.overdue}
          label="overdue"
          color={stats.overdue > 0 ? colors.danger : colors.dim}
        />
        <StatTile value={stats.open} label="open" color={colors.accent} />
        <StatTile value={stats.today} label="today" color={colors.success} />
      </Box>

      {recentPrompts.length > 0 ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text color={colors.dim} bold>
            Recent prompts
          </Text>
          <SelectList
            items={recentPrompts}
            getKey={(p) => `${p.project}-${p.slug}`}
            accent={flow.ocean}
            isActive={focus === 'recent'}
            onSelect={(p) =>
              router.navigate({ name: 'prompt-view', project: p.project, slug: p.slug })
            }
            renderItem={(prompt, selected) => (
              <Box flexDirection="column">
                <MenuText variant="label" selected={selected} bold>
                  {prompt.title}
                </MenuText>
                <MenuText variant="description" selected={selected}>
                  {`${prompt.project}/${prompt.slug}.md`}
                </MenuText>
              </Box>
            )}
          />
        </Box>
      ) : null}

      <Box flexDirection="column" paddingX={0} paddingY={0}>
        <SelectList
          items={entries}
          getKey={(e) => e.id}
          accent={flow.brand}
          isActive={focus === 'main'}
          onSelect={(e) => e.go()}
          renderItem={(entry, selected) => (
            <Box flexDirection="column">
              <MenuText variant="label" selected={selected} bold>
                {entry.label}
              </MenuText>
              <MenuText variant="hint" selected={selected}>
                {entry.hint}
              </MenuText>
            </Box>
          )}
        />
      </Box>

      <StatusBar
        hints={[
          { key: '↑↓', label: 'navigate' },
          { key: '⏎', label: 'open' },
          ...(recentPrompts.length > 0 ? [{ key: '⇥', label: 'switch list' }] : []),
          { key: 'q', label: 'quit' },
        ]}
      />
    </Box>
  );
}
