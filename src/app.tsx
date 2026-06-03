import { RouterProvider, useRouter } from './navigation/RouterContext.js';
import { useReminders } from './hooks/useReminders.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { PromptProjectsScreen } from './screens/prompts/PromptProjectsScreen.js';
import { ProjectCreateScreen } from './screens/prompts/ProjectCreateScreen.js';
import { PromptListScreen } from './screens/prompts/PromptListScreen.js';
import { PromptViewScreen } from './screens/prompts/PromptViewScreen.js';
import { PromptCreateScreen } from './screens/prompts/PromptCreateScreen.js';
import { PromptEditScreen } from './screens/prompts/PromptEditScreen.js';
import { TodoHubScreen } from './screens/todos/TodoHubScreen.js';
import { TodoListScreen } from './screens/todos/TodoListScreen.js';
import { TodoCreateScreen } from './screens/todos/TodoCreateScreen.js';
import { TodoEditScreen } from './screens/todos/TodoEditScreen.js';

function ScreenRouter() {
  const { route } = useRouter();
  // Re-mount each screen on route change so per-screen state stays isolated.
  switch (route.name) {
    case 'home':
      return <HomeScreen key="home" />;
    case 'prompt-projects':
      return <PromptProjectsScreen key="prompt-projects" />;
    case 'project-create':
      return <ProjectCreateScreen key="project-create" />;
    case 'prompt-list':
      return <PromptListScreen key={`pl-${route.project}`} project={route.project} />;
    case 'prompt-view':
      return (
        <PromptViewScreen
          key={`pv-${route.project}-${route.slug}`}
          project={route.project}
          slug={route.slug}
        />
      );
    case 'prompt-create':
      return <PromptCreateScreen key={`pc-${route.project}`} project={route.project} />;
    case 'prompt-edit':
      return (
        <PromptEditScreen
          key={`pe-${route.project}-${route.slug}`}
          project={route.project}
          slug={route.slug}
        />
      );
    case 'todos':
      return <TodoHubScreen key="todos" />;
    case 'todo-list':
      return <TodoListScreen key={`tl-${route.view}-${'project' in route ? route.project : ''}`} route={route} />;
    case 'todo-create':
      return (
        <TodoCreateScreen
          key={`tc-${route.project ?? ''}`}
          defaultProject={route.project}
        />
      );
    case 'todo-edit':
      return <TodoEditScreen key={`te-${route.id}`} id={route.id} />;
    default:
      return <HomeScreen key="home-fallback" />;
  }
}

export function App() {
  useReminders();
  return (
    <RouterProvider>
      <ScreenRouter />
    </RouterProvider>
  );
}
