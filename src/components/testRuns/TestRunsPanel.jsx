import { useState } from 'react';
import { TestRunsTable } from './TestRunsTable';
import { CreateTestRunForm } from './CreateTestRunForm';
import { Button } from '../ui/Button';
import { MAX_TEST_RUNS } from '../../constants/testRuns';
import { useTestRunsContext } from '../../context/TestRunsContext';

export function TestRunsPanel({
  bugId,
  onViewRun,
  showHeader = true,
  showCreateAction = true,
  embedded = false,
}) {
  const { testRuns } = useTestRunsContext();
  const [showCreate, setShowCreate] = useState(false);
  const atLimit = testRuns.length >= MAX_TEST_RUNS;

  const handleCreated = () => {
    setShowCreate(false);
  };

  const showTopBar = showHeader || (embedded && showCreateAction);

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-8'} data-testid="test-runs-panel">
      {showTopBar && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          {showHeader && (
            <div>
              <h1
                className="text-3xl font-semibold tracking-tight text-stripe-ink"
                data-testid="test-runs-title"
              >
                Test Runs
              </h1>
              <p className="mt-2 text-sm text-stripe-muted">
                {bugId
                  ? 'Group this bug into QA execution sessions or manage existing test runs.'
                  : 'Group bug recordings into QA execution sessions (e.g. checkout flow, catalog regression).'}
              </p>
            </div>
          )}
          {showCreateAction && !showCreate && (
            <Button
              data-testid="test-runs-create-toggle"
              disabled={atLimit}
              onClick={() => setShowCreate(true)}
              className={!showHeader ? 'ml-auto' : undefined}
            >
              Create Test Run
            </Button>
          )}
        </div>
      )}

      {atLimit && !showCreate && (
        <p className="text-sm text-amber-600" data-testid="test-runs-limit-warning">
          Maximum of {MAX_TEST_RUNS} test runs reached. Delete one to create another.
        </p>
      )}

      {showCreate && (
        <div
          className="rounded-lg border border-stripe-border bg-stripe-bg p-4"
          data-testid="test-runs-create-section"
        >
          <h3 className="mb-3 text-sm font-semibold text-stripe-ink">New test run</h3>
          <CreateTestRunForm
            compact
            linkBugId={bugId}
            onCreated={handleCreated}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      <div className={embedded ? '' : 'stripe-card'}>
        {!embedded && (
          <div className="stripe-card-header">
            <h2 className="text-lg font-semibold text-stripe-ink">All test runs</h2>
            <p className="mt-1 text-sm text-stripe-muted">
              {testRuns.length} session{testRuns.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        <div className={embedded ? '' : 'px-6 py-5'}>
          {embedded && (
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-stripe-muted">
              {testRuns.length} session{testRuns.length !== 1 ? 's' : ''}
            </p>
          )}
          <TestRunsTable
            testRuns={testRuns}
            bugId={bugId}
            onViewRun={onViewRun}
          />
        </div>
      </div>
    </div>
  );
}
