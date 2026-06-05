import { Link } from 'react-router-dom';
import { SeverityBadge, StatusBadge, TypeBadge } from '../ui/Badge';

export function RecentBugsList({ bugs }) {
  if (bugs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-stripe-muted" data-testid="recent-bugs-empty">
        No bugs recorded yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stripe-border" data-testid="recent-bugs-list">
      {bugs.map((bug) => (
        <li key={bug.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="min-w-0 flex-1">
            <Link
              to={`/bugs/${bug.id}`}
              data-testid={`recent-bug-link-${bug.id}`}
              className="font-medium text-stripe-accent hover:underline"
            >
              #{bug.id} — {bug.title || 'Untitled'}
            </Link>
            <p className="mt-1 text-xs text-stripe-muted">
              {bug.createdAt
                ? new Date(bug.createdAt).toLocaleString()
                : 'Unknown date'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={bug.severity} />
            <StatusBadge status={bug.status} />
            <TypeBadge type={bug.type} />
          </div>
        </li>
      ))}
    </ul>
  );
}
