export type Priority = 'high' | 'medium' | 'low';

export type TaskView = 
  | 'inbox' 
  | 'today' 
  | 'upcoming' 
  | 'completed' 
  | 'all';

export interface Category {
  id: string;
  name: string;
  color: string; // hex color for the tag
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string YYYY-MM-DD
  priority: Priority;
  categoryId?: string;
  completed: boolean;
  createdAt: string; // ISO timestamp
  order: number; // for drag and drop positioning
}

export interface TaskState {
  tasks: Task[];
  categories: Category[];
  currentView: TaskView;
  searchQuery: string;
  selectedPriorityFilter: Priority | 'all';
  selectedCategoryFilter: string | 'all';
}