import { Box, Text } from 'ink';
import { MenuTitle } from './MenuTitle.js';
import { menuColors } from '../theme/menuColors.js';

interface MenuRowProps {
  label: string;
  description?: string;
  meta?: string;
  selected: boolean;
  icon?: string;
}

/** Two-line menu item: label on top, muted description underneath. */
export function MenuRow({ label, description, meta, selected, icon }: MenuRowProps) {
  const c = menuColors(selected);

  return (
    <Box flexDirection="column" marginBottom={0}>
      <Box>
        {icon ? (
          <Box width={3}>
            <Text color={c.icon} bold={selected}>
              {icon}
            </Text>
          </Box>
        ) : null}
        <MenuTitle selected={selected}>{label}</MenuTitle>
        {meta ? (
          <Box marginLeft={1}>
            <Text color={c.meta}>{meta}</Text>
          </Box>
        ) : null}
      </Box>
      {description ? (
        <Box marginLeft={icon ? 3 : 0}>
          <Text color={c.description}>{description}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
