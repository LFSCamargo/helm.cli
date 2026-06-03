export interface PromptProject {
  /** Folder name on disk (already filesystem-safe). */
  name: string;
  /** How many .md prompts live inside the project. */
  count: number;
  updatedAt: Date;
  /** From helm.meta.json or a generated summary for the project list. */
  description: string;
}

export interface PromptMeta {
  project: string;
  slug: string;
  /** Display title, derived from the first H1 or the slug. */
  title: string;
  path: string;
  updatedAt: Date;
  bytes: number;
}
