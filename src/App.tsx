import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, Archive, Inbox, Moon, Sun, Menu, Calendar, Clock } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TaskModal } from './components/TaskModal'
import { TaskCard } from './components/TaskCard'
import { Toast } from './components/Toast'
import { EmptyState } from './components/EmptyState'
import { TaskSkeleton } from './components/TaskSkeleton'
import { burstConfetti } from './lib/confetti'
import { ProgressRing } from './components/ProgressRing'
import { useTasks } from './hooks/useTasks'
import type { TaskView, Task } from './lib/types'

type Theme = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  // Simple toast system for undo
  const [toast, setToast] = useState<{ message: string; action?: () => void; actionLabel?: string } | null>(null)

  // PWA Install prompt handling (per the plan)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)

  // Loading state for skeleton (polish item from the plan)
  const [isLoading, setIsLoading] = useState(true)

  // View transition state for smooth changes (plan requirement)
  const [viewTransitionKey, setViewTransitionKey] = useState(0)

  // Real task management with persistence
  const {
    tasks,
    filteredTasks,
    categories,
    currentView,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete: originalToggleComplete,
    reorderTasks,
    addCategory,
  } = useTasks()

  // Wrapper to trigger confetti when completing the last pending task (plan item)
  const toggleComplete = (id: string) => {
    const wasLast = tasks.filter(t => !t.completed).length === 1;
    originalToggleComplete(id);

    if (wasLast) {
      setTimeout(() => {
        burstConfetti(110);
      }, 220);
    }
  }

  // Progress & Streak calculations (dynamic)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
  const dueTodayTasks = tasks.filter(t => !t.completed && t.dueDate === today).length;

  // Simple streak: consecutive days with at least one task completed
  const calculateStreak = () => {
    const completedDates = tasks
      .filter(t => t.completed && t.completedAt)
      .map(t => t.completedAt!.split('T')[0])
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // unique sorted dates

    if (completedDates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // Check if today has activity
    if (!completedDates.includes(currentDateStr)) {
      // Check yesterday instead for ongoing streak
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Theme handling
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  // Modal handlers
  const openNewTask = () => {
    setEditingTask(undefined)
    setIsModalOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  // Handle PWA install
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setCanInstall(false);
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Keyboard shortcuts (plan requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }
        return;
      }

      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openNewTask();
      }

      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search tasks..."]') as HTMLInputElement;
        searchInput?.focus();
      }

      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingTask(undefined);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // PWA beforeinstallprompt listener (from the plan)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Simulate initial data load for skeleton (polish from the plan)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  // Bump transition key when view changes for fade/slide effect
  useEffect(() => {
    setViewTransitionKey(prev => prev + 1);
  }, [currentView, searchQuery]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      // We use the existing reorderTasks from the hook
      // Note: reorderTasks expects draggedId and targetId
      reorderTasks(active.id as string, over.id as string)
    }
  }

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
    setIsModalOpen(false)
    setEditingTask(undefined)
  }

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    deleteTask(id);
    setIsModalOpen(false);
    setEditingTask(undefined);

    if (taskToDelete) {
      setToast({
        message: 'Task deleted',
        actionLabel: 'Undo',
        action: () => {
          // Re-add the task (simple restore)
          addTask({
            title: taskToDelete.title,
            description: taskToDelete.description,
            dueDate: taskToDelete.dueDate,
            priority: taskToDelete.priority,
            categoryId: taskToDelete.categoryId,
          });
          setToast(null);
        }
      });
    }
  }

  // View title
  const viewTitles: Record<TaskView, string> = {
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    completed: 'Completed',
    all: 'All Tasks'
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md sticky top-0 z-50 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-[var(--surface-alt)]"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white text-[13px] font-semibold tracking-[-0.5px]">
              T
            </div>
            <div>
              <div className="font-semibold tracking-[-0.2px] text-[17px]">Tasks</div>
              <div className="text-[10px] text-[var(--text-muted)] -mt-1">No name • Light skeuomorphism</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md mx-4 hidden md:block">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="skeu-input w-full pl-14 pr-4 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle (skeuomorphic style) */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:shadow transition active:scale-[0.985]"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Install App button - real PWA flow */}
          {canInstall && (
            <button 
              onClick={handleInstallClick}
              className="hidden md:flex items-center gap-2 px-4 h-10 rounded-2xl text-sm font-medium border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] active:bg-[var(--surface)] transition"
            >
              Install App
            </button>
          )}

          {/* Avatar stub */}
          <div className="w-9 h-9 rounded-2xl bg-[var(--accent-weak)] text-white flex items-center justify-center text-xs font-medium ring-2 ring-[var(--surface)]">
            AG
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-72 border-r border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-xl p-3 flex-shrink-0 hidden md:flex flex-col ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 md:hidden' : ''}`}>
          <nav className="space-y-1 mt-2">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox },
              { id: 'today', label: 'Today', icon: CheckCircle2 },
              { id: 'upcoming', label: 'Upcoming', icon: Calendar },
              { id: 'completed', label: 'Completed', icon: Archive },
              { id: 'all', label: 'All Tasks', icon: Clock },
            ].map((item) => {
              const Icon = item.icon
              const active = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id as TaskView); setIsMobileMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all active:scale-[0.985] ${
                    active 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium' 
                      : 'hover:bg-[var(--surface-alt)] text-[var(--text)]'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-[var(--accent)]' : ''} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-[var(--border)] mx-1">
            <div className="px-4 py-2 text-xs uppercase tracking-[0.5px] text-[var(--text-muted)] font-medium">Categories</div>
            <div className="space-y-px text-sm">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => {
                    // Quick testable behavior: filter current view to this category
                    // For simplicity we just set search to the category name for now
                    // Better: could add a categoryFilter state later
                    setSearchQuery(cat.name);
                  }}
                  className="w-full text-left px-4 py-2 rounded-2xl hover:bg-[var(--surface-alt)] flex items-center gap-2 text-[var(--text)]"
                >
                  <span 
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
              <button 
                onClick={() => {
                  const name = prompt('New category name:');
                  if (name && name.trim()) {
                    // Simple color for now
                    const colors = ['#5c6b7a', '#8a6f47', '#4a704f', '#7a5a7a', '#b85c38'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    addCategory(name.trim(), color);
                  }
                }}
                className="w-full text-left px-4 py-2 rounded-2xl hover:bg-[var(--surface-alt)] text-[var(--accent)] text-sm flex items-center gap-2"
              >
                + New Category
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          {/* View Header */}
          <div className="px-6 pt-8 pb-4 border-b border-[var(--border)] bg-[var(--surface)]/30">
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.6px] text-[var(--text-h)]">{viewTitles[currentView]}</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">{filteredTasks.length} tasks • Light skeuomorphic design</p>
              </div>
              <div className="text-xs px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hidden md:block">
                {completionPercent}% complete
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="px-6 pt-4 pb-2 flex gap-2 flex-wrap">
            {['All', 'High', 'Medium', 'Low'].map(f => (
              <button key={f} className="text-xs px-4 py-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] active:bg-[var(--surface)] transition">
                {f}
              </button>
            ))}
          </div>

          {/* Real Task List with DnD */}
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="px-4 md:px-6 pb-28 space-y-3">
              <div 
                key={viewTransitionKey}
                className="transition-all duration-200 ease-out"
                style={{ 
                  opacity: 0.6, 
                  animation: 'fadeInSlide 180ms ease-out forwards' 
                }}
              >
              {isLoading ? (
                <TaskSkeleton count={6} />
              ) : filteredTasks.length > 0 ? (
                <SortableContext 
                  items={filteredTasks.map(t => t.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTasks.map(task => {
                    const category = categories.find(c => c.id === task.categoryId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        category={category}
                        onToggleComplete={toggleComplete}
                        onEdit={openEditTask}
                      />
                    );
                  })}
                </SortableContext>
              ) : (
                <EmptyState 
                  view={currentView} 
                  hasSearch={!!searchQuery} 
                />
              )}
              </div>
            </div>
          </DndContext>
        </main>

        {/* Right panel - Dynamic Progress & Streak */}
        <div className="hidden xl:block w-80 border-l border-[var(--border)] p-6 bg-[var(--surface)]/30 flex-shrink-0">
          <div className="text-sm font-medium mb-3 text-[var(--text-h)]">Today’s Progress</div>
          <div className="skeu-card aspect-square flex flex-col items-center justify-center">
            <div className="relative">
              <ProgressRing percent={completionPercent} size={110} strokeWidth={9} />
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-light tracking-tighter text-[var(--accent)]">
                {completionPercent}<span className="text-lg align-super">%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 text-xs text-[var(--text-muted)] space-y-1">
            <div>{dueTodayTasks} tasks due today</div>
            <div>{overdueTasks} overdue</div>
            <div className="pt-1 text-[var(--accent)] font-medium">{currentStreak} day streak</div>
          </div>
        </div>
      </div>

      {/* FAB - Now functional with ripple + scale (plan micro-interaction) */}
      <button
        className="skeu-fab fixed bottom-3 right-[-4px] shadow-2xl z-50"
        aria-label="Add new task"
        onClick={(e) => {
          // Create ripple
          const rect = e.currentTarget.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
          e.currentTarget.appendChild(ripple);

          setTimeout(() => ripple.remove(), 600);

          openNewTask();
        }}
      >
        <Plus size={26} />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
        categories={categories}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200]">
          <Toast
            message={toast.message}
            actionLabel={toast.actionLabel}
            onAction={toast.action}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}

      {/* Mobile search bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 border-t border-[var(--border)] bg-[var(--surface)] z-40">
        <div className="relative">
          <Search size={16} className="absolute left-6 top-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="skeu-input w-full pl-14 text-sm py-3"
          />
        </div>
      </div>
    </div>
  )
}

export default App
