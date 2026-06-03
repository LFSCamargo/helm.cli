import { render } from 'ink-testing-library';
import { App } from '../app.js';

export type AppInstance = ReturnType<typeof render>;

/** Render the full Helm app tree (not `cli.tsx`) for Ink e2e tests. */
export function renderApp(): AppInstance {
  return render(<App />);
}
