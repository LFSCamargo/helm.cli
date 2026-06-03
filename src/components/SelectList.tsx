import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, symbols } from '../theme/theme.js';

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
}

/**
 * Reusable vertical picker with arrow / vim navigation, an animated pointer,
 * and per-item action shortcuts. Owns its highlight index but clamps it when
 * the underlying list changes (e.g. after a delete).
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
      <Box paddingY={1}>
        <Text color={colors.dim} italic>
          {emptyText}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {items.map((item, i) => {
        const selected = i === index && isActive;
        return (
          <Box key={getKey(item)}>
            <Box width={2}>
              <Text color={colors.accent} bold>
                {selected ? symbols.pointer : ' '}
              </Text>
            </Box>
            {renderItem(item, selected)}
          </Box>
        );
      })}
    </Box>
  );
}
