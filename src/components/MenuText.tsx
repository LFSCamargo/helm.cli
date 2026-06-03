import { Text } from 'ink';
import { MenuTitle } from './MenuTitle.js';
import { menuColors } from '../theme/menuColors.js';

type MenuTextVariant = 'label' | 'description' | 'meta' | 'icon' | 'hint';

interface MenuTextProps {
  children: string;
  variant: MenuTextVariant;
  selected: boolean;
  bold?: boolean;
}

/** Menu line text; labels use the brand gradient when selected. */
export function MenuText({ children, variant, selected, bold }: MenuTextProps) {
  if (variant === 'label') {
    return <MenuTitle selected={selected}>{children}</MenuTitle>;
  }

  const c = menuColors(selected);
  const color = c[variant];
  return (
    <Text color={color} bold={bold ?? false}>
      {children}
    </Text>
  );
}
