import { useMemo } from 'react';

export function SimpleBarChart({ items, emptyMessage = 'No data' }) {
  const maxValue = useMemo(
    () => Math.max(1, ...items.map((i) => i.value)),
    [items],
  );

  const hasData = items.some((i) => i.value > 0);

  if (!hasData) {
    return (
      <p className="py-6 text-center text-sm text-stripe-muted" data-testid="bar-chart-empty">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3" data-testid="simple-bar-chart">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-stripe-ink">{item.label}</span>
            <span className="tabular-nums text-stripe-muted">{item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-stripe-bg">
            <div
              className={`h-full rounded-full transition-all duration-300 ${item.barClass || 'bg-stripe-accent'}`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
              role="presentation"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
