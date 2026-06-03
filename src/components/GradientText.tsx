import { Text } from 'ink';
import Gradient from 'ink-gradient';

interface GradientTextProps {
  colors: readonly string[];
  bold?: boolean;
  children: string;
}

/** Thin wrapper so screens can apply a brand gradient to a single string. */
export function GradientText({ colors, bold, children }: GradientTextProps) {
  return (
    <Gradient colors={[...colors]}>
      <Text bold={bold}>{children}</Text>
    </Gradient>
  );
}
