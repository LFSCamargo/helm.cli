import { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { AnimatedGradient } from './AnimatedGradient.js';
import type { Todo } from '../core/todos/todo.types.js';
import { colors, flow, priorityMeta, symbols } from '../theme/theme.js';
import { formatRelative, isOverdue } from '../core/util/datetime.js';
import { Badge } from './Badge.js';

interface PriorityTodoListProps {
  todos: Todo[];
  onSelect: (todo: Todo) => void;
  actions?: Record<string, (todo: Todo) => void>;
  isActive?: boolean;
  emptyText?: string;
  accent?: readonly string[];
  showProject?: boolean;
}

const PRIORITIES = [1, 2, 3, 4] as const;

/**
 * Task list grouped by priority with section headers. Navigation skips headers;
 * only todo rows are selectable.
 */
export function PriorityTodoList({
  todos,
  onSelect,
  actions,
  isActive = true,
  emptyText = 'Nothing here yet.',
  accent = flow.flame,
  showProject = false,
}: PriorityTodoListProps) {
  const groups = useMemo(() => {
    return PRIORITIES.map((p) => ({
      priority: p,
      items: todos.filter((t) => t.priority === p),
    })).filter((g) => g.items.length > 0);
  }, [todos]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > flat.length - 1) setIndex(Math.max(0, flat.length - 1));
  }, [flat.length, index]);

  useInput(
    (input, key) => {
      if (flat.length === 0) return;
      if (key.upArrow || input === 'k') {
        setIndex((i) => (i - 1 + flat.length) % flat.length);
      } else if (key.downArrow || input === 'j') {
        setIndex((i) => (i + 1) % flat.length);
      } else if (key.return) {
        onSelect(flat[index]);
      } else if (actions && input && actions[input]) {
        actions[input](flat[index]);
      }
    },
    { isActive },
  );

  if (flat.length === 0) {
    return (
      <Box paddingY={0} paddingLeft={1}>
        <Text color={colors.dim} italic>
          {symbols.spark} {emptyText}
        </Text>
      </Box>
    );
  }

  let cursor = 0;

  return (
    <Box flexDirection="column">
      {groups.map((group) => {
        const meta = priorityMeta[group.priority];
        const header = (
          <Box key={`section-${group.priority}`} marginTop={cursor > 0 ? 1 : 0}>
            <Text color={meta.color} bold>
              {meta.label} {meta.dot}
            </Text>
            <Text color={colors.border}> {'─'.repeat(Math.max(4, 28 - meta.label.length))}</Text>
          </Box>
        );
        const rows = group.items.map((todo) => {
          const selected = cursor === index && isActive;
          cursor += 1;
          return (
            <Box key={todo.id}>
              <Box width={2}>
                {selected ? (
                  <AnimatedGradient colors={accent} speedMs={110} bold>
                    {symbols.pointer}
                  </AnimatedGradient>
                ) : (
                  <Text> </Text>
                )}
              </Box>
              <TodoRow todo={todo} selected={selected} showProject={showProject} />
            </Box>
          );
        });
        return (
          <Box key={group.priority} flexDirection="column">
            {header}
            {rows}
          </Box>
        );
      })}
    </Box>
  );
}

function TodoRow({
  todo,
  selected,
  showProject,
}: {
  todo: Todo;
  selected: boolean;
  showProject: boolean;
}) {
  const meta = priorityMeta[todo.priority];
  const overdue = todo.dueAt && !todo.completed && isOverdue(todo.dueAt);
  return (
    <Box>
      <Box width={3}>
        <Text color={todo.completed ? colors.success : selected ? colors.accent : colors.dim} bold>
          {todo.completed ? symbols.check : symbols.uncheck}
        </Text>
      </Box>
      <Box width={2}>
        <Text color={todo.completed ? colors.dim : meta.color}>{meta.dot}</Text>
      </Box>
      <Box width={30}>
        <Text
          color={todo.completed ? colors.dim : selected ? colors.text : colors.muted}
          strikethrough={todo.completed}
          bold={selected && !todo.completed}
        >
          {todo.title}
        </Text>
      </Box>
      {showProject && todo.project ? (
        <Box marginRight={1}>
          <Badge label={`#${todo.project}`} color={colors.accent} />
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
