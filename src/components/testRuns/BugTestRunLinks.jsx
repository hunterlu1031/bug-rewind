import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTestRunsContext } from '../../context/TestRunsContext';
import { TestRunsModal } from './TestRunsModal';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

export function BugTestRunLinks({ bugId }) {
  const { testRuns, getTestRunsForBug, addBugToTestRun } = useTestRunsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [error, setError] = useState('');

  const linkedRuns = getTestRunsForBug(bugId);
  const availableRuns = useMemo(
    () => testRuns.filter((run) => !run.bugIds.includes(String(bugId))),
    [testRuns, bugId],
  );

  const handleAdd = () => {
    if (!selectedRunId) return;
    const result = addBugToTestRun(selectedRunId, bugId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    setSelectedRunId('');
  };

  if (testRuns.length === 0) {
    return (
      <>
        <Card data-testid="bug-test-run-links">
          <CardHeader
            title="Test Runs"
            subtitle="Link this bug to QA execution sessions"
            action={
              <Button
                size="sm"
                data-testid="bug-open-test-runs-modal"
                onClick={() => setModalOpen(true)}
              >
                Manage Test Runs
              </Button>
            }
          />
          <CardBody>
            <p className="text-sm text-stripe-muted">
              No test runs yet. Open the manager to create one and link this bug.
            </p>
          </CardBody>
        </Card>
        <TestRunsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          bugId={bugId}
        />
      </>
    );
  }

  return (
    <>
      <Card data-testid="bug-test-run-links">
        <CardHeader
          title="Test Runs"
          subtitle="Link this bug to QA execution sessions"
          action={
            <Button
              size="sm"
              data-testid="bug-open-test-runs-modal"
              onClick={() => setModalOpen(true)}
            >
              Manage Test Runs
            </Button>
          }
        />
        <CardBody className="space-y-4">
          {linkedRuns.length === 0 ? (
            <p className="text-sm text-stripe-muted">Not linked to any test run.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {linkedRuns.map((run) => (
                <li key={run.id}>
                  <Link
                    to={`/test-runs/${run.id}`}
                    data-testid={`bug-linked-run-${run.id}`}
                    className="text-stripe-accent hover:underline"
                  >
                    {run.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {availableRuns.length > 0 && (
            <div className="flex flex-wrap items-end gap-3 border-t border-stripe-border pt-4">
              <label className="min-w-[180px] flex-1">
                <span className="mb-1.5 block text-sm font-medium text-stripe-ink">
                  Quick link
                </span>
                <select
                  data-testid="bug-add-to-run-select"
                  className="stripe-input w-full"
                  value={selectedRunId}
                  onChange={(e) => {
                    setError('');
                    setSelectedRunId(e.target.value);
                  }}
                >
                  <option value="">Select test run…</option>
                  {availableRuns.map((run) => (
                    <option key={run.id} value={run.id}>
                      {run.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                size="sm"
                data-testid="bug-add-to-run-submit"
                onClick={handleAdd}
                disabled={!selectedRunId}
              >
                Link
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </CardBody>
      </Card>

      <TestRunsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bugId={bugId}
      />
    </>
  );
}
