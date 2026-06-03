/** All navigable screens, modelled as a discriminated union for type-safety. */
export type Route =
  | { name: 'home' }
  | { name: 'prompt-projects' }
  | { name: 'prompt-list'; project: string }
  | { name: 'prompt-view'; project: string; slug: string }
  | { name: 'prompt-edit'; project: string; slug: string }
  | { name: 'prompt-create'; project: string }
  | { name: 'project-create' }
  | { name: 'todos' }
  | { name: 'todo-create' }
  | { name: 'todo-edit'; id: string };

export type RouteName = Route['name'];
