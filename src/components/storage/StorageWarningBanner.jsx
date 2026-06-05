import { Link } from 'react-router-dom';
import { useBugsContext } from '../../context/BugsContext';
import { formatBytes } from '../../utils/storageSize';

const TIER_COPY = {
  warning: 'Storage warning',
  danger: 'Storage danger',
  critical: 'Storage critical',
};

export function StorageWarningBanner() {
  const { appStorageUsage } = useBugsContext();

  if (!appStorageUsage?.isWarning) return null;

  const tier = appStorageUsage.tier || 'warning';
  const styles = appStorageUsage.styles;
  const title = TIER_COPY[tier] || TIER_COPY.warning;

  return (
    <div
      data-testid="storage-warning-banner"
      className={`border-b px-4 py-2.5 sm:px-6 ${styles?.banner || 'border-amber-300 bg-amber-50'}`}
      role="alert"
    >
      <p className="mx-auto max-w-7xl text-center text-sm">
        <strong>{title}</strong> — {formatBytes(appStorageUsage.bytes)} used (
        {appStorageUsage.percent}% of estimated {formatBytes(appStorageUsage.limitBytes)}). Base64
        screenshots fill storage quickly.{' '}
        <Link to="/storage" className="font-medium underline">
          Manage storage
        </Link>
      </p>
    </div>
  );
}
