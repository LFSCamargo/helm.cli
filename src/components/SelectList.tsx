import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { SelectListRow } from './SelectListRow.js';
import { menuColors } from '../theme/menuColors.js';
import { colors, flow, symbols } from '../theme/theme.js';
import { AnimatedGradient } from './AnimatedGradient.js';

function ListPointer({ active }: { active: boolean }) {
  const c = menuColors(active);
  if (active) {
    return (
      <AnimatedGradient colors={flow.brand} speedMs={110} bold>
        {symbols.pointer}
      </AnimatedGradient>
    );
  }
  return <Text color={c.pointer}> </Text>;
}

interface SelectListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  onSelect: (item: T) => void;
  onHighlight?: (item: T, index: number) => void;
  /** Single-key shortcuts scoped to the highlighted item, e.g. { d: onDelete }. */
  actions?: Record<string, (item: T) => void>;
  isActive?: boolean;
  emptyText?: string;
  /** @deprecated Accent bar replaced by purple selection row; kept for API compat. */
  accent?: readonly string[];
}

/**
 * Reusable vertical picker with arrow / vim navigation, purple animated
 * selection background, and per-item action shortcuts.
 */
export function SelectList<T>({
  items,
  getKey,
  renderItem,
  onSelect,
  onHighlight,
  actions,
  isActive = true,
  emptyText = 'Nothing here yet.',
}: SelectListProps<T>) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > items.length - 1) setIndex(Math.max(0, items.length - 1));
  }, [items.length, index]);

  useInput(
    (input, key) => {
      if (items.length === 0) return;
      if (key.upArrow || input === 'k') {
        const next = (index - 1 + items.length) % items.length;
        setIndex(next);
        onHighlight?.(items[next], next);
      } else if (key.downArrow || input === 'j') {
        const next = (index + 1) % items.length;
        setIndex(next);
        onHighlight?.(items[next], next);
      } else if (key.return) {
        onSelect(items[index]);
      } else if (actions && input && actions[input]) {
        actions[input](items[index]);
      }
    },
    { isActive },
  );

  if (items.length === 0) {
    return (
      <Box paddingY={0} paddingLeft={1}>
        <Text color={colors.dim} italic>
          {symbols.spark} {emptyText}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {items.map((item, i) => {
        const selected = i === index && isActive;
        return (
          <SelectListRow key={getKey(item)} selected={selected}>
            <Box flexDirection="row">
              <Box width={2}>
                <ListPointer active={selected} />
              </Box>
              <Box flexGrow={1}>{renderItem(item, selected)}</Box>
            </Box>
          </SelectListRow>
        );
      })}
    </Box>
  );
}
