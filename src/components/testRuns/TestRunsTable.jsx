import { Link } from 'react-router-dom';
import { useTestRunsContext } from '../../context/TestRunsContext';
import { Button } from '../ui/Button';

export function TestRunsTable({ testRuns, bugId, onViewRun }) {
  const { addBugToTestRun } = useTestRunsContext();

  if (testRuns.length === 0) {
    return (
      <div
        data-testid="test-runs-empty"
        className="rounded-lg border border-dashed border-stripe-border py-12 text-center text-stripe-muted"
      >
        No test runs yet. Create one to group bugs from a QA session.
      </div>
    );
  }

  const bugKey = bugId != null ? String(bugId) : null;

  const handleLink = (runId) => {
    if (!bugKey) return;
    addBugToTestRun(runId, bugKey);
  };

  return (
    <div
      className="overflow-x-auto rounded-lg border border-stripe-border bg-stripe-surface shadow-stripe"
      data-testid="test-runs-table"
    >
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-stripe-border bg-stripe-bg text-xs font-medium uppercase tracking-wide text-stripe-muted">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Bugs</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stripe-border">
          {testRuns.map((run) => {
            const isLinked = bugKey ? run.bugIds.includes(bugKey) : false;

            return (
              <tr key={run.id} className="hover:bg-stripe-bg/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stripe-ink">{run.name}</p>
                  {run.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-stripe-muted">
                      {run.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-stripe-muted">{run.bugIds.length}</td>
                <td className="px-4 py-3 text-stripe-muted">
                  {new Date(run.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {bugKey && (
                      isLinked ? (
                        <span
                          className="text-xs font-medium text-success"
                          data-testid={`test-run-linked-${run.id}`}
                        >
                          Linked
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          data-testid={`test-run-link-bug-${run.id}`}
                          onClick={() => handleLink(run.id)}
                        >
                          Link bug
                        </Button>
                      )
                    )}
                    {onViewRun ? (
                      <Button
                        size="sm"
                        variant="text"
                        data-testid={`test-run-view-${run.id}`}
                        onClick={() => onViewRun(run.id)}
                      >
                        View
                      </Button>
                    ) : (
                      <Link
                        to={`/test-runs/${run.id}`}
                        data-testid={`test-run-view-${run.id}`}
                        className="text-sm text-stripe-accent hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
