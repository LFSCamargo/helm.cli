import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { PROMPTS_DIR, ensureDirs } from '../../config/paths.js';
import type { PromptMeta, PromptProject } from './prompt.types.js';

/** Convert arbitrary text into a safe, lowercase, hyphenated slug. */
export function slugify(input: string): string {
  return (
    input
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'untitled'
  );
}

function projectDir(project: string): string {
  return join(PROMPTS_DIR, project);
}

function promptPath(project: string, slug: string): string {
  return join(projectDir(project), `${slug}.md`);
}

const PROJECT_META = 'helm.meta.json';

interface ProjectMetaFile {
  description?: string;
}

function readMetaDescription(project: string): string | null {
  const path = join(projectDir(project), PROJECT_META);
  if (!existsSync(path)) return null;
  try {
    const data = JSON.parse(readFileSync(path, 'utf8')) as ProjectMetaFile;
    const text = data.description?.trim();
    return text || null;
  } catch {
    return null;
  }
}

function defaultProjectDescription(name: string, count: number): string {
  if (count === 0) {
    return 'Empty project — add prompts your agents can reuse.';
  }
  const label = name.replace(/-/g, ' ');
  return `${count} reusable prompt${count === 1 ? '' : 's'} for ${label}`;
}

/** Custom description from prompts/<project>/helm.meta.json, if set. */
export function getProjectCustomDescription(project: string): string | null {
  return readMetaDescription(project);
}

/** Human-readable blurb for a prompt project (meta file or generated). */
export function getProjectDescription(project: string, count?: number): string {
  const custom = readMetaDescription(project);
  if (custom) return custom;
  const dir = projectDir(project);
  if (!existsSync(dir)) {
    return defaultProjectDescription(project, 0);
  }
  const n =
    count ?? readdirSync(dir).filter((f) => f.endsWith('.md')).length;
  return defaultProjectDescription(project, n);
}

/** Pull a display title from the first markdown H1, falling back to the slug. */
function deriveTitle(content: string, slug: string): string {
  const heading = content.split('\n').find((line) => /^#\s+/.test(line.trim()));
  if (heading) return heading.replace(/^#\s+/, '').trim();
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function listProjects(): PromptProject[] {
  ensureDirs();
  return readdirSync(PROMPTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = join(PROMPTS_DIR, entry.name);
      const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
      const updatedAt = files.length
        ? new Date(Math.max(...files.map((f) => statSync(join(dir, f)).mtimeMs)))
        : statSync(dir).mtime;
      const name = entry.name;
      const count = files.length;
      return {
        name,
        count,
        updatedAt,
        description: getProjectDescription(name, count),
      };
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function createProject(name: string): string {
  const slug = slugify(name);
  const dir = projectDir(slug);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return slug;
}

/** Recently touched prompts across all projects (by file mtime). */
export function listRecentPrompts(limit = 5): PromptMeta[] {
  const all: PromptMeta[] = [];
  for (const project of listProjects()) {
    all.push(...listPrompts(project.name));
  }
  return all.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, limit);
}

export function listPrompts(project: string): PromptMeta[] {
  const dir = projectDir(project);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      const content = readFileSync(fullPath, 'utf8');
      return {
        project,
        slug,
        title: deriveTitle(content, slug),
        path: fullPath,
        updatedAt: stat.mtime,
        bytes: stat.size,
      };
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function readPrompt(project: string, slug: string): string {
  const path = promptPath(project, slug);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

export function writePrompt(project: string, slug: string, content: string): void {
  const dir = projectDir(project);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(promptPath(project, slug), content, 'utf8');
}

/** Create a new prompt seeded with a template; returns a unique slug. */
export function createPrompt(project: string, title: string): string {
  const dir = projectDir(project);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const base = slugify(title);
  let slug = base;
  let i = 2;
  while (existsSync(promptPath(project, slug))) {
    slug = `${base}-${i++}`;
  }
  const template = `# ${title}\n\n> Describe when to use this prompt.\n\n---\n\nWrite your reusable prompt here.\n`;
  writeFileSync(promptPath(project, slug), template, 'utf8');
  return slug;
}

export function deletePrompt(project: string, slug: string): void {
  const path = promptPath(project, slug);
  if (existsSync(path)) rmSync(path);
}
