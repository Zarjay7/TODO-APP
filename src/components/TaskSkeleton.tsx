export function TaskSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="skeu-card p-4 md:p-5 flex gap-4 animate-pulse"
          style={{ 
            borderLeft: `4px solid #d1d0c8`,
            animationDelay: `${i * 80}ms` 
          }}
        >
          {/* Checkbox skeleton */}
          <div className="w-7 h-7 rounded-[10px] bg-[var(--surface-alt)] flex-shrink-0 mt-0.5" />

          {/* Content skeleton */}
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-4 bg-[var(--surface-alt)] rounded w-3/4" />
            <div className="h-3 bg-[var(--surface-alt)] rounded w-1/2" />
          </div>

          {/* Priority skeleton */}
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-16 bg-[var(--surface-alt)] rounded-full" />
            <div className="h-3 w-8 bg-[var(--surface-alt)] rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
