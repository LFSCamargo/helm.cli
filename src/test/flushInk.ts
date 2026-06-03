/** Yield to Ink/React so `useInput` listeners and effects run before the next key. */
export async function flushInk(rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    await new Promise((resolve) => setImmediate(resolve));
  }
}
