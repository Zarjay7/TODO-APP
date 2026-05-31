import { Inbox, Calendar, CheckCircle2, Archive } from 'lucide-react';
import type { TaskView } from '../lib/types';

interface EmptyStateProps {
  view: TaskView;
  hasSearch: boolean;
}

export function EmptyState({ view, hasSearch }: EmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="skeu-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-6 opacity-60">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]">
            <circle cx="28" cy="28" r="16" />
            <path d="M40 40l14 14" />
            <path d="M22 22l12 12" />
          </svg>
        </div>
        <p className="text-[var(--text-muted)] text-sm">No tasks match your search.</p>
      </div>
    );
  }

  const config = getEmptyStateConfig(view);

  return (
    <div className="skeu-card p-12 flex flex-col items-center justify-center text-center">
      <div className="mb-6 text-[var(--text-muted)] opacity-70">
        {config.icon}
      </div>
      <p className="font-medium text-[var(--text-h)] tracking-[-0.2px] mb-1">
        {config.title}
      </p>
      <p className="text-sm text-[var(--text-muted)] max-w-[220px]">
        {config.description}
      </p>
    </div>
  );
}

function getEmptyStateConfig(view: TaskView) {
  switch (view) {
    case 'inbox':
      return {
        title: "Inbox is clear",
        description: "New tasks without a category will appear here.",
        icon: <Inbox size={56} strokeWidth={1.25} />,
      };
    case 'today':
      return {
        title: "Nothing due today",
        description: "Enjoy the breathing room. Add tasks with today's date to see them here.",
        icon: (
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-muted)]">
            <rect x="8" y="12" width="56" height="52" rx="6" fill="#2a2f38" opacity="0.3"/>
            <rect x="6" y="10" width="56" height="52" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
            <rect x="6" y="10" width="56" height="14" rx="6" fill="var(--surface-alt)"/>
            <rect x="14" y="4" width="6" height="12" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
            <rect x="52" y="4" width="6" height="12" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
            <line x1="14" y1="30" x2="58" y2="30" stroke="var(--border)" strokeWidth="1" opacity="0.5"/>
            <line x1="14" y1="42" x2="58" y2="42" stroke="var(--border)" strokeWidth="1" opacity="0.5"/>
            <line x1="14" y1="54" x2="58" y2="54" stroke="var(--border)" strokeWidth="1" opacity="0.5"/>
            <circle cx="22" cy="24" r="2" fill="var(--text-muted)" opacity="0.6"/>
            <circle cx="36" cy="24" r="2" fill="var(--text-muted)" opacity="0.6"/>
            <circle cx="50" cy="24" r="2" fill="var(--text-muted)" opacity="0.6"/>
          </svg>
        ),
      };
    case 'upcoming':
      return {
        title: "No upcoming tasks",
        description: "Tasks with future due dates will show up here.",
        icon: <Calendar size={56} strokeWidth={1.25} />,
      };
    case 'completed':
      return {
        title: "No completed tasks yet",
        description: "Tasks you finish will live here. Keep going.",
        icon: <CheckCircle2 size={56} strokeWidth={1.25} />,
      };
    case 'all':
    default:
      return {
        title: "All clear",
        description: "You have no tasks yet. Time to create something.",
        icon: <Archive size={56} strokeWidth={1.25} />,
      };
  }
}
