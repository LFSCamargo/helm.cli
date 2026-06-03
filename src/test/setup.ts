import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = mkdtempSync(join(tmpdir(), 'helm-vitest-'));
process.env.HELM_DATA_DIR = join(root, 'data');
process.env.HELM_PROMPTS_DIR = join(root, 'prompts');
