import clipboard from 'clipboardy';

/** Copy text to the system clipboard. Returns false if it fails (e.g. no GUI). */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await clipboard.write(text);
    return true;
  } catch {
    return false;
  }
}
