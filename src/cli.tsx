#!/usr/bin/env node
import { render } from 'ink';
import { App } from './app.js';
import { migrate } from './core/db/migrate.js';
import { ensureDirs } from './config/paths.js';

async function main() {
  ensureDirs();
  await migrate();

  // Clear the scrollback for a clean, app-like canvas.
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');

  const { waitUntilExit } = render(<App />, { exitOnCtrlC: true });
  await waitUntilExit();
}

main().catch((error) => {
  console.error('helm failed to start:', error);
  process.exit(1);
});
