import { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, actionLabel, onAction, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!onAction) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, duration, onAction]);

  return (
    <div className="skeu-toast flex items-center justify-between gap-4 shadow-xl">
      <span className="text-sm">{message}</span>
      
      <div className="flex items-center gap-2">
        {actionLabel && onAction && (
          <button
            onClick={() => {
              onAction();
              onDismiss();
            }}
            className="text-sm font-medium px-3 py-1 rounded-xl hover:bg-[var(--surface-alt)] transition text-[var(--accent)]"
          >
            {actionLabel}
          </button>
        )}
        <button 
          onClick={onDismiss}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
