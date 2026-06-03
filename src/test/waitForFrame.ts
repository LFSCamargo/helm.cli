/** Poll Ink output until `match` succeeds (async effects, navigation, data loads). */
export async function waitForFrame(
  lastFrame: () => string | undefined,
  match: RegExp | ((frame: string) => boolean),
  timeoutMs = 5000,
): Promise<string> {
  const start = Date.now();
  let last = '';

  while (Date.now() - start < timeoutMs) {
    last = lastFrame() ?? '';
    const ok = typeof match === 'function' ? match(last) : match.test(last);
    if (ok) return last;
    await new Promise((resolve) => setImmediate(resolve));
  }

  throw new Error(`Timed out after ${timeoutMs}ms waiting for frame.\nLast frame:\n${last}`);
}
