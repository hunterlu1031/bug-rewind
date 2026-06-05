import { useMemo } from 'react';
import { useBugsContext } from '../../context/BugsContext';

export function StorageUsageIndicator({ className = '' }) {
  const { appStorageUsage } = useBugsContext();

  const usage = useMemo(
    () => appStorageUsage,
    [appStorageUsage?.bytes, appStorageUsage?.tier, appStorageUsage?.percent],
  );

  if (!usage) return null;

  const { styles, label, percent } = usage;

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-stripe-border bg-stripe-bg px-3 py-1.5 ${className}`}
      data-testid="storage-usage-indicator"
      title="QA app storage (bugs + test runs)"
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
        data-testid="storage-usage-dot"
        aria-hidden
      />
      <span className={`text-xs font-medium tabular-nums ${styles.text}`} data-testid="storage-usage-label">
        {label}
      </span>
      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-stripe-border sm:block">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${percent}%` }}
          data-testid="storage-usage-bar"
        />
      </div>
    </div>
  );
}
