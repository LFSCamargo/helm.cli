export interface Todo {
  id: string;
  title: string;
  notes: string | null;
  project: string | null;
  priority: number;
  dueAt: Date | null;
  remindAt: Date | null;
  reminded: boolean;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoInput {
  title: string;
  notes?: string | null;
  project?: string | null;
  priority?: number;
  dueAt?: Date | null;
  remindAt?: Date | null;
}
