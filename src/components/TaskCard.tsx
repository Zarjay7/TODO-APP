import type { Task, Category } from '../lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
}

function getDueBadgeInfo(dueDate?: string) {
  if (!dueDate) return null;

  const today = new Date().toISOString().split('T')[0];
  const isOverdue = dueDate < today;

  if (isOverdue) {
    return { label: 'Overdue', className: 'overdue' };
  }
  if (dueDate === today) {
    return { label: 'Today', className: 'today' };
  }
  return {
    label: new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    className: 'future'
  };
}

export function TaskCard({ task, category, onToggleComplete, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const dueInfo = getDueBadgeInfo(task.dueDate);
  const isCompleted = task.completed;

  const priorityBorderColor = 
    task.priority === 'high' ? '#c24141' :
    task.priority === 'medium' ? '#b7791f' : '#4a704f';

  const priorityBadgeClass = 
    task.priority === 'high' ? 'bg-red-100/70 text-red-700 dark:bg-red-950/70 dark:text-red-300' :
    task.priority === 'medium' ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300' :
    'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300';

  const priorityDotClass = 
    task.priority === 'high' ? 'bg-red-500' :
    task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="skeu-card TaskCard p-4 md:p-5 flex gap-4 group relative overflow-hidden cursor-grab active:cursor-grabbing active:scale-[0.995] transition-transform"
      style={{ 
        borderLeft: `4px solid ${priorityBorderColor}`,
        ...style 
      }}
      onClick={() => {
        // Prevent opening edit modal while dragging
        if (!isDragging) onEdit(task);
      }}
    >
      {/* Checkbox */}
      <button 
        className="skeu-checkbox mt-1" 
        data-checked={isCompleted ? "true" : "false"}
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleComplete(task.id); 
        }}
      >
        {isCompleted && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
            <polyline points="5 12 10 17 19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className={`font-medium text-[15.5px] tracking-[-0.1px] ${isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-h)]'}`}>
          {task.title}
        </div>

        {dueInfo && (
          <div className="mt-1.5">
            <span className={`due-badge ${dueInfo.className}`}>
              {dueInfo.label}
            </span>
          </div>
        )}

        {category && (
          <div className="inline-flex mt-2 text-[10px] px-2.5 py-px rounded-full border border-[var(--border)] text-[var(--text-muted)] items-center gap-1.5">
            <span 
              className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </div>
        )}
      </div>

      {/* Right side meta */}
      <div className="flex flex-col items-end justify-between text-xs">
        <div className={`px-3 py-0.5 rounded-full font-medium tracking-[0.3px] text-[10px] uppercase flex items-center gap-1.5 ${priorityBadgeClass}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${priorityDotClass}`} />
          {task.priority}
        </div>

        <button 
          className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text)] transition text-xs mt-1"
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
