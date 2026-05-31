import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, Category, TaskView } from '../lib/types';
import { loadFromStorage, saveTasks, saveCategories, generateId } from '../lib/storage';

const todayStr = () => new Date().toISOString().split('T')[0];

interface UseTasksReturn {
  // Data
  tasks: Task[];
  categories: Category[];
  currentView: TaskView;
  
  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTasks: Task[];
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (draggedId: string, targetId: string) => void;
  
  // View
  setCurrentView: (view: TaskView) => void;
  
  // Categories
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Utils
  getTaskById: (id: string) => Task | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<TaskView>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const { tasks: loadedTasks, categories: loadedCategories } = loadFromStorage();
    setTasks(loadedTasks);
    setCategories(loadedCategories);
  }, []);

  // Persist tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks-app:tasks')) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Persist categories
  useEffect(() => {
    if (categories.length > 0) {
      saveCategories(categories);
    }
  }, [categories]);

  // Smart view filtering logic (as per design plan)
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply view filter
    const today = todayStr();

    switch (currentView) {
      case 'inbox':
        result = result.filter(t => !t.completed && !t.categoryId);
        break;
      case 'today':
        result = result.filter(t => 
          !t.completed && 
          (t.dueDate === today || (t.dueDate && t.dueDate < today))
        );
        break;
      case 'upcoming':
        result = result.filter(t => 
          !t.completed && 
          t.dueDate && 
          t.dueDate > today
        );
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort: incomplete first, then by due date, then by order
    result.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (a.dueDate && b.dueDate) {
        if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      return a.order - b.order;
    });

    return result;
  }, [tasks, currentView, searchQuery]);

  // CRUD Operations
  const addTask = useCallback((newTask: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => {
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) : 0;

    const task: Task = {
      ...newTask,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completed: false,
      order: maxOrder + 1,
    };

    setTasks(prev => [...prev, task]);
  }, [tasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, []);

  // Drag and drop reordering (within current filtered list)
  const reorderTasks = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    setTasks(prev => {
      const newTasks = [...prev];
      const draggedIndex = newTasks.findIndex(t => t.id === draggedId);
      const targetIndex = newTasks.findIndex(t => t.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);

      // Reassign order values
      return newTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
    });
  }, []);

  // Category management
  const addCategory = useCallback((name: string, color: string) => {
    const newCategory: Category = {
      id: generateId(),
      name: name.trim(),
      color,
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Remove category from tasks
    setTasks(prev =>
      prev.map(task =>
        task.categoryId === id ? { ...task, categoryId: undefined } : task
      )
    );
  }, []);

  // Utils
  const getTaskById = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  return {
    tasks,
    categories,
    currentView,
    searchQuery,
    setSearchQuery,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    setCurrentView,
    addCategory,
    updateCategory,
    deleteCategory,
    getTaskById,
    getCategoryById,
  };
}
