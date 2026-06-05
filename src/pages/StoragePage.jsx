import { useMemo, useState } from 'react';
import { getAppStorageUsage } from '../utils/storageManagement';
import { StorageManagementPanel } from '../components/storage/StorageManagementPanel';
import { StorageUsagePanel } from '../components/storage/StorageUsagePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { useBugsContext } from '../context/BugsContext';

export function StoragePage() {
  const { refreshStorageMetrics } = useBugsContext();
  const [usageSnapshot, setUsageSnapshot] = useState(() => getAppStorageUsage());

  const usage = useMemo(() => usageSnapshot, [usageSnapshot]);

  const handleStorageChanged = (next) => {
    setUsageSnapshot(next);
    refreshStorageMetrics();
  };

  return (
    <div className="mx-auto max-w-3xl page-section">
      <PageHeader
        title="Storage"
        subtitle="Monitor localStorage usage and run safe cleanup actions for QA bug data."
        data-testid="storage-page-title"
      />

      <StorageUsagePanel usage={usage} />
      <StorageManagementPanel onStorageChanged={handleStorageChanged} />
    </div>
  );
}
