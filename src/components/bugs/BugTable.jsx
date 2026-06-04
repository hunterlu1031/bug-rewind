import { Link } from 'react-router-dom';
import { SeverityBadge, StatusBadge, TypeBadge } from '../ui/Badge';

export function BugTable({ bugs }) {
  if (bugs.length === 0) {
    return (
      <div
        data-testid="bugs-empty"
        className="rounded-lg border border-dashed border-stripe-border py-12 text-center text-stripe-muted"
      >
        No bugs yet. Create one or record a repro flow.
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border border-stripe-border bg-stripe-surface shadow-stripe"
      data-testid="bugs-table"
    >
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-stripe-border bg-stripe-bg text-xs font-medium uppercase tracking-wide text-stripe-muted">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Bug Type</th>
            <th className="px-4 py-3">Steps</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-stripe-border">
          {bugs.map((bug) => (
            <tr key={bug.id} className="transition hover:bg-stripe-accent-soft/40">
              <td className="px-4 py-3 font-mono text-stripe-muted">#{bug.id}</td>
              <td className="px-4 py-3 font-medium text-stripe-ink">{bug.title}</td>
              <td className="px-4 py-3">
                <SeverityBadge severity={bug.severity} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={bug.status} />
              </td>
              <td className="px-4 py-3">
                <TypeBadge type={bug.type} />
              </td>
              <td className="px-4 py-3 text-stripe-muted">{bug.replaySteps?.length || 0}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/bugs/${bug.id}`}
                  data-testid={`bug-view-${bug.id}`}
                  className="font-medium text-stripe-accent hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
