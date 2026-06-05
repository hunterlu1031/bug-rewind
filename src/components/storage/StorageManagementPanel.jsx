import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CLEAR_OLD_DAYS } from '../../constants/storageManagement';
import { useBugsContext } from '../../context/BugsContext';
import { useTestRunsContext } from '../../context/TestRunsContext';
import {
  clearAllAppData,
  clearOldBugs,
  clearScreenshotsOnly,
  getAppStorageUsage,
} from '../../utils/storageManagement';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export function StorageManagementPanel({ onStorageChanged }) {
  const navigate = useNavigate();
  const { reloadFromStorage, refreshStorageMetrics } = useBugsContext();
  const { refreshTestRuns } = useTestRunsContext();

  const [oldDays, setOldDays] = useState(String(DEFAULT_CLEAR_OLD_DAYS));
  const [modal, setModal] = useState(null);
  const [lastResult, setLastResult] = useState('');

  const refreshAll = () => {
    refreshStorageMetrics();
    reloadFromStorage();
    refreshTestRuns();
    onStorageChanged?.(getAppStorageUsage());
  };

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  const handleClearAll = () => {
    clearAllAppData();
    refreshAll();
    setLastResult('All QA app data removed (bugs and test runs).');
    closeModal();
    navigate('/');
  };

  const handleClearOld = () => {
    const days = Math.max(1, Number(oldDays) || DEFAULT_CLEAR_OLD_DAYS);
    const result = clearOldBugs(days);
    refreshAll();
    setLastResult(`Removed ${result.removed} bug(s) older than ${days} days. ${result.remaining} remaining.`);
    closeModal();
  };

  const handleClearScreenshots = () => {
    const result = clearScreenshotsOnly();
    refreshAll();
    setLastResult(
      `Cleared attachments and replay screenshots from ${result.bugsUpdated} bug(s). Metadata kept.`,
    );
    closeModal();
  };

  return (
    <>
      <Card data-testid="storage-management-panel">
        <CardHeader
          title="Storage management"
          subtitle="Safe cleanup for QA data only — never wipes unrelated browser storage."
        />
        <CardBody className="space-y-6">
          <div className="space-y-3 rounded-lg border border-stripe-border bg-stripe-bg p-4">
            <h3 className="text-sm font-semibold text-stripe-ink">Clear all data</h3>
            <p className="text-sm text-stripe-muted">
              Removes <code className="text-xs">qa_bugs</code> / bug records and{' '}
              <code className="text-xs">qa_test_runs</code>. Cannot be undone.
            </p>
            <Button variant="danger" data-testid="storage-clear-all" onClick={() => openModal('all')}>
              Clear all QA data
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border border-stripe-border bg-stripe-bg p-4">
            <h3 className="text-sm font-semibold text-stripe-ink">Clear old bugs</h3>
            <p className="text-sm text-stripe-muted">
              Deletes bugs older than the threshold. Test runs are not removed (orphan IDs may remain).
            </p>
            <Input
              label="Older than (days)"
              type="number"
              min={1}
              data-testid="storage-old-days"
              value={oldDays}
              onChange={(e) => setOldDays(e.target.value)}
            />
            <Button variant="secondary" data-testid="storage-clear-old" onClick={() => openModal('old')}>
              Clear old bugs
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border border-stripe-border bg-stripe-bg p-4">
            <h3 className="text-sm font-semibold text-stripe-ink">Clear screenshots only</h3>
            <p className="text-sm text-stripe-muted">
              Strips image attachments and step screenshots from all bugs. Titles, replay steps, and
              metadata stay intact.
            </p>
            <Button
              variant="secondary"
              data-testid="storage-clear-screenshots"
              onClick={() => openModal('screenshots')}
            >
              Clear screenshots only
            </Button>
          </div>

          {lastResult && (
            <p className="text-sm text-emerald-700" data-testid="storage-action-result">
              {lastResult}
            </p>
          )}
        </CardBody>
      </Card>

      <ConfirmDeleteModal
        open={modal === 'all'}
        title="Clear all QA data?"
        description="This removes all bugs and test runs stored by Bug Rewind. Other websites' localStorage data is not affected."
        confirmLabel="Clear all"
        onConfirm={handleClearAll}
        onCancel={closeModal}
      />

      <ConfirmDeleteModal
        open={modal === 'old'}
        title="Clear old bugs?"
        description={`Bugs created more than ${Math.max(1, Number(oldDays) || DEFAULT_CLEAR_OLD_DAYS)} days ago will be permanently deleted.`}
        confirmLabel="Clear old bugs"
        onConfirm={handleClearOld}
        onCancel={closeModal}
      />

      <ConfirmDeleteModal
        open={modal === 'screenshots'}
        title="Clear all screenshots?"
        description="Removes Base64 images from bug attachments and recorded replay steps. This usually frees the most space."
        confirmLabel="Clear screenshots"
        onConfirm={handleClearScreenshots}
        onCancel={closeModal}
      />
    </>
  );
}
