import { useState } from 'react';
import { MAX_BUG_IDS_PER_RUN } from '../../constants/testRuns';
import { Button } from '../ui/Button';

export function AddBugToTestRun({
  testRun,
  availableBugs,
  onAdd,
  error,
  onClearError,
}) {
  const [selectedBugId, setSelectedBugId] = useState('');
  const atLimit = testRun.bugIds.length >= MAX_BUG_IDS_PER_RUN;

  const handleAdd = () => {
    if (!selectedBugId) return;
    onAdd(selectedBugId);
    setSelectedBugId('');
  };

  if (availableBugs.length === 0) {
    return (
      <p className="text-sm text-stripe-muted" data-testid="add-bug-to-run-none">
        {atLimit
          ? `This test run has reached the maximum of ${MAX_BUG_IDS_PER_RUN} bugs.`
          : 'All existing bugs are already linked to this test run.'}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-3" data-testid="add-bug-to-run">
      <label className="min-w-[220px] flex-1">
        <span className="mb-1.5 block text-sm font-medium text-stripe-ink">Add bug</span>
        <select
          data-testid="add-bug-to-run-select"
          className="stripe-input w-full"
          value={selectedBugId}
          onChange={(e) => {
            onClearError?.();
            setSelectedBugId(e.target.value);
          }}
        >
          <option value="">Select a bug…</option>
          {availableBugs.map((bug) => (
            <option key={bug.id} value={String(bug.id)}>
              #{bug.id} — {bug.title}
            </option>
          ))}
        </select>
      </label>
      <Button
        data-testid="add-bug-to-run-submit"
        onClick={handleAdd}
        disabled={!selectedBugId || atLimit}
      >
        Add Bug
      </Button>
      {error && (
        <p className="w-full text-sm text-danger" data-testid="add-bug-to-run-error">
          {error}
        </p>
      )}
    </div>
  );
}
