import { useMemo } from 'react';
import {
  ESTIMATED_STORAGE_LIMIT_BYTES,
  ESTIMATED_STORAGE_LIMIT_MAX_BYTES,
  STORAGE_PERCENT_CRITICAL,
  STORAGE_PERCENT_DANGER,
  STORAGE_PERCENT_WARNING,
} from '../../constants/storageManagement';
import { formatBytes } from '../../utils/storageSize';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function StorageUsagePanel({ usage }) {
  const styles = usage?.styles;

  const tierMessage = useMemo(() => {
    switch (usage?.tier) {
      case 'critical':
        return 'Critical — free space immediately or data may fail to save.';
      case 'danger':
        return 'Danger — remove screenshots or old bugs soon.';
      case 'warning':
        return 'Warning — storage is filling up.';
      default:
        return 'Storage usage is within normal range.';
    }
  }, [usage?.tier]);

  if (!usage) return null;

  return (
    <Card data-testid="storage-usage-panel">
      <CardHeader
        title="Storage usage"
        subtitle={`QA app keys only · estimated browser limit ${formatBytes(ESTIMATED_STORAGE_LIMIT_BYTES)}–${formatBytes(ESTIMATED_STORAGE_LIMIT_MAX_BYTES)}`}
      />
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-semibold tabular-nums text-stripe-ink" data-testid="storage-usage-mb">
              {formatBytes(usage.totalBytes)}
            </p>
            <p className="text-sm text-stripe-muted">
              of ~{formatBytes(usage.limitBytes)} tracked budget
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${styles?.text} ${styles?.banner}`}
            data-testid="storage-usage-tier"
          >
            {usage.tier}
          </span>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs font-medium text-stripe-muted">
            <span>{usage.percent}% used</span>
            <span>
              Warning {STORAGE_PERCENT_WARNING}% · Danger {STORAGE_PERCENT_DANGER}% · Critical{' '}
              {STORAGE_PERCENT_CRITICAL}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-stripe-bg" data-testid="storage-usage-bar-track">
            <div
              className={`h-full rounded-full transition-all duration-300 ${styles?.bar}`}
              style={{ width: `${usage.percent}%` }}
              data-testid="storage-usage-bar-fill"
            />
          </div>
        </div>

        <p className="text-sm text-stripe-muted">{tierMessage}</p>

        <ul className="space-y-1 text-sm text-stripe-muted" data-testid="storage-breakdown">
          {usage.breakdown.map((item) => (
            <li key={item.key} className="flex justify-between gap-4 font-mono text-xs">
              <span>{item.key}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
