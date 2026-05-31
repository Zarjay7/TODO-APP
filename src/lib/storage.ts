import type { Task, Category } from './types';

const TASKS_KEY = 'tasks-app:tasks';
const CATEGORIES_KEY = 'tasks-app:categories';

export function loadFromStorage(): { tasks: Task[]; categories: Category[] } {
  try {
    const rawTasks = localStorage.getItem(TASKS_KEY);
    const rawCategories = localStorage.getItem(CATEGORIES_KEY);

    let tasks: Task[] = [];
    let categories: Category[] = [];

    if (rawTasks) {
      const parsed = JSON.parse(rawTasks);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      }
    }

    if (rawCategories) {
      const parsed = JSON.parse(rawCategories);
      if (Array.isArray(parsed)) {
        categories = parsed;
      }
    }

    // Seed default categories if none exist
    if (categories.length === 0) {
      categories = getDefaultCategories();
      saveCategories(categories);
    }

    return { tasks, categories };
  } catch (error) {
    console.error('Failed to load from storage', error);
    return {
      tasks: [],
      categories: getDefaultCategories(),
    };
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks', error);
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories', error);
  }
}

function getDefaultCategories(): Category[] {
  return [
    { id: 'work', name: 'Work', color: '#5c6b7a' },
    { id: 'personal', name: 'Personal', color: '#8a6f47' },
    { id: 'health', name: 'Health', color: '#4a704f' },
    { id: 'errands', name: 'Errands', color: '#7a5a7a' },
  ];
}

export function generateId(): string {
  return crypto.randomUUID();
}