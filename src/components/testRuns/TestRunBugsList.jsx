import { Link } from 'react-router-dom';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function TestRunBugsList({ bugs, onRemove }) {
  if (bugs.length === 0) {
    return (
      <p className="text-sm text-stripe-muted" data-testid="test-run-bugs-empty">
        No bugs linked to this test run yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stripe-border rounded-lg border border-stripe-border" data-testid="test-run-bugs-list">
      {bugs.map((bug) => (
        <li
          key={bug.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          data-testid={`test-run-bug-${bug.id}`}
        >
          <div className="min-w-0 flex-1">
            <Link
              to={`/bugs/${bug.id}`}
              data-testid={`test-run-bug-link-${bug.id}`}
              className="font-medium text-stripe-accent hover:underline"
            >
              #{bug.id} — {bug.title}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              <SeverityBadge severity={bug.severity} />
              <StatusBadge status={bug.status} />
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            data-testid={`test-run-remove-bug-${bug.id}`}
            onClick={() => onRemove(bug.id)}
          >
            Remove
          </Button>
        </li>
      ))}
    </ul>
  );
}
