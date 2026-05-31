import { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag } from 'lucide-react';
import type { Task, Priority, Category } from '../lib/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => void;
  onDelete?: (id: string) => void;
  initialTask?: Task;
  categories: Category[];
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: '#c24141' },
  { value: 'medium', label: 'Medium', color: '#b7791f' },
  { value: 'low', label: 'Low', color: '#4a704f' },
];

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  categories,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  // Populate form when editing
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate || '');
      setPriority(initialTask.priority);
      setCategoryId(initialTask.categoryId);
    } else {
      // Reset for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategoryId(undefined);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      categoryId,
    });

    onClose();
  };

  const handleDelete = () => {
    if (initialTask && onDelete) {
      onDelete(initialTask.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-lg skeu-card p-6 md:p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-[-0.4px] text-[var(--text-h)]">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="skeu-input w-full text-lg"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="skeu-input w-full resize-y min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)] flex items-center gap-2">
                <Calendar size={15} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="skeu-input w-full"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)] flex items-center gap-2">
                <Flag size={15} /> Priority
              </label>
              <div className="flex gap-2">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                      priority === p.value 
                        ? 'border-[var(--accent)] bg-[var(--surface-alt)]' 
                        : 'border-[var(--border)] hover:bg-[var(--surface-alt)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-muted)] flex items-center gap-2">
              <Tag size={15} /> Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId(undefined)}
                className={`px-4 py-1.5 rounded-2xl text-sm border transition ${
                  !categoryId 
                    ? 'border-[var(--accent)] bg-[var(--surface-alt)]' 
                    : 'border-[var(--border)] hover:bg-[var(--surface-alt)]'
                }`}
              >
                None
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-1.5 rounded-2xl text-sm border flex items-center gap-2 transition ${
                    categoryId === cat.id 
                      ? 'border-[var(--accent)] bg-[var(--surface-alt)]' 
                      : 'border-[var(--border)] hover:bg-[var(--surface-alt)]'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-[var(--border)]">
            <div>
              {initialTask && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl font-medium transition"
                >
                  Delete Task
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface-alt)] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-2xl text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-weak)] transition shadow-sm"
              >
                {initialTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
