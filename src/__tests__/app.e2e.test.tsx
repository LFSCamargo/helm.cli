import { afterEach, describe, expect, it } from 'vitest';
import { flushInk } from '../test/flushInk.js';
import { pressAsync } from '../test/inkInput.js';
import { renderApp, type AppInstance } from '../test/renderApp.js';
import { waitForFrame } from '../test/waitForFrame.js';

describe('helm app e2e', () => {
  let ui: AppInstance | undefined;

  afterEach(() => {
    ui?.unmount();
    ui = undefined;
  });

  it('renders the home menu', async () => {
    ui = renderApp();
    await flushInk();
    const frame = await waitForFrame(
      ui.lastFrame,
      (f) => f.includes('Prompts') && f.includes('Todos'),
    );
    expect(frame).toContain('Quit');
    expect(frame).toContain('browse your prompt library');
  });

  it('navigates home → Todos hub', async () => {
    ui = renderApp();
    await flushInk();
    await waitForFrame(ui.lastFrame, (f) => f.includes('Prompts'));

    await pressAsync(ui.stdin, 'down');
    await waitForFrame(ui.lastFrame, (f) => /❯\s*Todos/.test(f));

    await pressAsync(ui.stdin, 'enter');
    const frame = await waitForFrame(
      ui.lastFrame,
      (f) => f.includes('Today') && f.includes('cross-project digest'),
    );
    expect(frame).toContain('◆ helm');
  });

  it('navigates home → Prompts library', async () => {
    ui = renderApp();
    await flushInk();
    await waitForFrame(ui.lastFrame, (f) => f.includes('Prompts'));

    await pressAsync(ui.stdin, 'enter');
    const frame = await waitForFrame(
      ui.lastFrame,
      (f) => f.includes('Each folder is a project') || f.includes('No projects yet'),
    );
    expect(frame).toContain('◆ helm');
  });

  it('returns to home with esc from Todos hub', async () => {
    ui = renderApp();
    await flushInk();
    await waitForFrame(ui.lastFrame, (f) => f.includes('Prompts'));

    await pressAsync(ui.stdin, 'down');
    await waitForFrame(ui.lastFrame, (f) => /❯\s*Todos/.test(f));
    await pressAsync(ui.stdin, 'enter');
    await waitForFrame(ui.lastFrame, (f) => f.includes('Today'));

    await pressAsync(ui.stdin, 'esc');
    await waitForFrame(
      ui.lastFrame,
      (f) => f.includes('exit helm') && f.includes('browse your prompt library'),
    );
  });
});
