import type { render } from 'ink-testing-library';
import { flushInk } from './flushInk.js';

type InkInstance = ReturnType<typeof render>;

const KEYS = {
  down: '\u001b[B',
  up: '\u001b[A',
  enter: '\r',
  esc: '\u001b',
  tab: '\t',
  /** Vim-style aliases (SelectList also accepts j/k). */
  downVim: 'j',
  upVim: 'k',
} as const;

export type InkKey = keyof typeof KEYS;

/** Simulate keyboard input understood by Ink `useInput` / `parseKeypress`. */
export function press(stdin: InkInstance['stdin'], key: InkKey): void {
  stdin.write(KEYS[key]);
}

/** Send a key and wait for Ink to process stdin. */
export async function pressAsync(stdin: InkInstance['stdin'], key: InkKey): Promise<void> {
  press(stdin, key);
  await flushInk();
}
