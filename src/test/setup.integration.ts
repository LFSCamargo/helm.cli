import { ensureTestDirs } from './helpers.js';
import { migrate } from '../core/db/migrate.js';

ensureTestDirs();
await migrate();
