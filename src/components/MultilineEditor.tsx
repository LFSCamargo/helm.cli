import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors } from '../theme/theme.js';

interface MultilineEditorProps {
  initialValue: string;
  isActive?: boolean;
  /** Called on every change so the parent can track a dirty flag. */
  onChange?: (value: string) => void;
}

interface Cursor {
  row: number;
  col: number;
}

/**
 * A self-contained text area for editing markdown inline. Supports typing,
 * newlines, backspace (with line-join), and arrow navigation with a visible
 * block cursor. Save / cancel are owned by the parent screen via global keys
 * (Ctrl+S / Esc), so this component deliberately ignores Ctrl/Meta chords.
 */
export function MultilineEditor({ initialValue, isActive = true, onChange }: MultilineEditorProps) {
  const [lines, setLines] = useState<string[]>(() => initialValue.split('\n'));
  const [cursor, setCursor] = useState<Cursor>(() => {
    const init = initialValue.split('\n');
    return { row: init.length - 1, col: init[init.length - 1]?.length ?? 0 };
  });

  const commit = (nextLines: string[], nextCursor: Cursor) => {
    setLines(nextLines);
    setCursor(nextCursor);
    onChange?.(nextLines.join('\n'));
  };

  useInput(
    (input, key) => {
      const { row, col } = cursor;
      const line = lines[row] ?? '';

      if (key.return) {
        const before = line.slice(0, col);
        const after = line.slice(col);
        const next = [...lines.slice(0, row), before, after, ...lines.slice(row + 1)];
        commit(next, { row: row + 1, col: 0 });
        return;
      }

      if (key.backspace || key.delete) {
        if (col > 0) {
          const next = [...lines];
          next[row] = line.slice(0, col - 1) + line.slice(col);
          commit(next, { row, col: col - 1 });
        } else if (row > 0) {
          const prev = lines[row - 1];
          const merged = prev + line;
          const next = [...lines.slice(0, row - 1), merged, ...lines.slice(row + 1)];
          commit(next, { row: row - 1, col: prev.length });
        }
        return;
      }

      if (key.leftArrow) {
        if (col > 0) setCursor({ row, col: col - 1 });
        else if (row > 0) setCursor({ row: row - 1, col: lines[row - 1].length });
        return;
      }
      if (key.rightArrow) {
        if (col < line.length) setCursor({ row, col: col + 1 });
        else if (row < lines.length - 1) setCursor({ row: row + 1, col: 0 });
        return;
      }
      if (key.upArrow) {
        if (row > 0) setCursor({ row: row - 1, col: Math.min(col, lines[row - 1].length) });
        return;
      }
      if (key.downArrow) {
        if (row < lines.length - 1)
          setCursor({ row: row + 1, col: Math.min(col, lines[row + 1].length) });
        return;
      }

      // Plain printable input (ignore control / meta chords reserved by parent).
      if (input && !key.ctrl && !key.meta && !key.escape) {
        const sanitized = input.replace(/\r/g, '');
        const next = [...lines];
        next[row] = line.slice(0, col) + sanitized + line.slice(col);
        commit(next, { row, col: col + sanitized.length });
      }
    },
    { isActive },
  );

  return (
    <Box flexDirection="column">
      {lines.map((line, r) => {
        const isCursorRow = r === cursor.row && isActive;
        const gutter = String(r + 1).padStart(3, ' ');
        return (
          <Box key={r}>
            <Text color={colors.border}>{gutter} │ </Text>
            <Text>{isCursorRow ? renderWithCursor(line, cursor.col) : line || ' '}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

function renderWithCursor(line: string, col: number): React.ReactNode {
  const before = line.slice(0, col);
  const at = line.slice(col, col + 1) || ' ';
  const after = line.slice(col + 1);
  return (
    <Text>
      {before}
      <Text inverse>{at}</Text>
      {after}
    </Text>
  );
}
