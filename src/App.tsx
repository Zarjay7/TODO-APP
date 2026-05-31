import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, Clock, Archive, Inbox, Moon, Sun, Menu, Calendar } from 'lucide-react'
import { TaskModal } from './components/TaskModal'
import { useTasks } from './hooks/useTasks'
import type { TaskView, Task } from './lib/types'

type Theme = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  // Real task management with persistence
  const {
    filteredTasks,
    categories,
    currentView,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks()

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
    deleteTask(id)
    setIsModalOpen(false)
    setEditingTask(undefined)
  }

  // View title
  const viewTitles: Record<TaskView, string> = {
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    completed: 'Completed',
    all: 'All Tasks'
  }

  // Get category name for display
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return null
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="skeu-input w-full pl-10 pr-4 py-2 text-sm"
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

          {/* Install stub */}
          <button className="hidden md:flex items-center gap-2 px-4 h-10 rounded-2xl text-sm font-medium border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] active:bg-[var(--surface)] transition">
            Install App
          </button>

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
              {['Work', 'Home', 'Health', 'Errands'].map(cat => (
                <button key={cat} className="w-full text-left px-4 py-2 rounded-2xl hover:bg-[var(--surface-alt)] flex items-center gap-2 text-[var(--text)]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-weak)]" />
                  {cat}
                </button>
              ))}
              <button className="w-full text-left px-4 py-2 rounded-2xl hover:bg-[var(--surface-alt)] text-[var(--accent)] text-sm flex items-center gap-2">
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
                68% complete this week
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

          {/* Real Task List */}
          <div className="px-4 md:px-6 pb-28 space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const categoryName = getCategoryName(task.categoryId);
                const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && !task.completed;

                return (
                  <div 
                    key={task.id} 
                    className="skeu-card p-4 md:p-5 flex gap-4 group relative overflow-hidden cursor-pointer"
                    style={{
                      borderLeft: task.priority === 'high' 
                        ? '4px solid #c24141' 
                        : task.priority === 'medium' 
                          ? '4px solid #b7791f' 
                          : '4px solid #4a704f'
                    }}
                    onClick={() => openEditTask(task)}
                  >
                    <button 
                      className="skeu-checkbox mt-1" 
                      data-checked={task.completed ? "true" : "false"}
                      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                      onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="5 12 10 17 19 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className={`font-medium text-[15.5px] tracking-[-0.1px] ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-h)]'}`}>
                        {task.title}
                      </div>

                      {task.dueDate && (
                        <div className="mt-1.5">
                          <span className={`due-badge ${isOverdue ? 'overdue' : task.dueDate === new Date().toISOString().split('T')[0] ? 'today' : 'future'}`}>
                            {isOverdue ? 'Overdue' : new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}

                      {categoryName && (
                        <div className="inline-flex mt-2 text-[10px] px-2.5 py-px rounded-full border border-[var(--border)] text-[var(--text-muted)]">
                          {categoryName}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between text-xs">
                      <div className={`px-3 py-0.5 rounded-full font-medium tracking-[0.3px] text-[10px] uppercase flex items-center gap-1.5 ${
                        task.priority === 'high' ? 'bg-red-100/70 text-red-700 dark:bg-red-950/70 dark:text-red-300' :
                        task.priority === 'medium' ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300' :
                        'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                      }`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        {task.priority}
                      </div>
                      <button 
                        className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text)] transition text-xs mt-1"
                        onClick={(e) => { e.stopPropagation(); openEditTask(task); }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="skeu-card p-10 text-center text-[var(--text-muted)]">
                {searchQuery ? 'No tasks match your search.' : 'No tasks here yet.'}
              </div>
            )}
          </div>
        </main>

        {/* Right panel stub (desktop) */}
        <div className="hidden xl:block w-80 border-l border-[var(--border)] p-6 bg-[var(--surface)]/30 flex-shrink-0">
          <div className="text-sm font-medium mb-3 text-[var(--text-h)]">Today’s Progress</div>
          <div className="skeu-card aspect-square flex items-center justify-center text-6xl font-light tracking-tighter text-[var(--accent)]">
            68<span className="text-2xl align-super">%</span>
          </div>
          <div className="mt-6 text-xs text-[var(--text-muted)]">3 tasks due • 1 overdue</div>
        </div>
      </div>

      {/* FAB - Now functional */}
      <button
        className="skeu-fab fixed bottom-8 right-6 md:right-8 shadow-2xl z-50"
        aria-label="Add new task"
        onClick={openNewTask}
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

      {/* Mobile search bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 border-t border-[var(--border)] bg-[var(--surface)] z-40">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="skeu-input w-full pl-10 text-sm py-3"
          />
        </div>
      </div>
    </div>
  )
}

export default App
