import React from 'react';
import { Box } from 'ink';

interface SelectListRowProps {
  selected: boolean;
  children: React.ReactNode;
}

/** One menu row with a little space before the next item. */
export function SelectListRow({ selected: _selected, children }: SelectListRowProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {children}
    </Box>
  );
}
