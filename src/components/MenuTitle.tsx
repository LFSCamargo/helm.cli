import { Text } from 'ink';
import { AnimatedGradient } from './AnimatedGradient.js';
import { flow } from '../theme/theme.js';
import { menuPurple } from '../theme/menuColors.js';

interface MenuTitleProps {
  children: string;
  selected: boolean;
}

/**
 * Menu item title — selected state uses the same flowing brand gradient as the
 * HELM home banner (no extra padding, so the list does not shift on focus).
 */
export function MenuTitle({ children, selected }: MenuTitleProps) {
  if (selected) {
    return (
      <AnimatedGradient colors={flow.brand} speedMs={110} bold>
        {children}
      </AnimatedGradient>
    );
  }
  return (
    <Text color={menuPurple.label} bold>
      {children}
    </Text>
  );
}
