import { Link } from 'react-router-dom';
import { DEMO_USER_NAME } from '../../constants/user';
import { SeverityBadge, StatusBadge, TypeBadge } from '../ui/Badge';

function SortableHeader({ label, column, sortKey, sortDirection, onSort }) {
  const active = sortKey === column;

  return (
    <th className="px-4 py-3" scope="col">
      <button
        type="button"
        data-testid={`bugs-sort-${column}`}
        onClick={() => onSort(column)}
        aria-sort={active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition-colors ${
          active
            ? 'text-stripe-accent'
            : 'text-stripe-muted hover:text-stripe-ink'
        }`}
      >
        <span>{label}</span>
        {active && (
          <span className="text-[10px] leading-none" aria-hidden>
            {sortDirection === 'asc' ? '▲' : '▼'}
          </span>
        )}
      </button>
    </th>
  );
}

export function BugTable({
  bugs,
  sortKey,
  sortDirection,
  onSort,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) {
  const selectedSet = new Set(selectedIds.map(String));
  const allSelected = bugs.length > 0 && bugs.every((b) => selectedSet.has(String(b.id)));
  const someSelected = bugs.some((b) => selectedSet.has(String(b.id)));

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
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-stripe-border bg-stripe-bg text-xs font-medium">
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3" scope="col">
                <input
                  type="checkbox"
                  data-testid="bugs-select-all"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={() => onToggleSelectAll?.(bugs.map((b) => b.id))}
                  aria-label="Select all bugs on this page"
                  className="h-4 w-4 rounded border-stripe-border text-stripe-accent focus:ring-stripe-accent"
                />
              </th>
            )}
            <SortableHeader
              label="ID"
              column="id"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Title"
              column="title"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Created"
              column="createdAt"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <th
              className="px-4 py-3 text-left uppercase tracking-wide text-stripe-muted"
              scope="col"
            >
              Created by
            </th>
            <SortableHeader
              label="Severity"
              column="severity"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Status"
              column="status"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="Bug Type"
              column="type"
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <th className="px-4 py-3 text-left uppercase tracking-wide text-stripe-muted" scope="col">
              Steps
            </th>
            <th className="px-4 py-3" scope="col" />
          </tr>
        </thead>
        <tbody className="divide-y divide-stripe-border">
          {bugs.map((bug) => {
            const isSelected = selectedSet.has(String(bug.id));
            return (
            <tr
              key={bug.id}
              className={`transition hover:bg-stripe-accent-soft/40 ${
                isSelected ? 'bg-stripe-accent-soft/60' : ''
              }`}
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    data-testid={`bug-select-${bug.id}`}
                    checked={isSelected}
                    onChange={() => onToggleSelect?.(bug.id)}
                    aria-label={`Select bug #${bug.id}`}
                    className="h-4 w-4 rounded border-stripe-border text-stripe-accent focus:ring-stripe-accent"
                  />
                </td>
              )}
              <td className="px-4 py-3 font-mono text-stripe-muted">#{bug.id}</td>
              <td className="px-4 py-3 font-medium text-stripe-ink">{bug.title}</td>
              <td className="whitespace-nowrap px-4 py-3 text-stripe-muted">
                {bug.createdAt
                  ? new Date(bug.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </td>
              <td className="px-4 py-3 text-stripe-muted" data-testid={`bug-created-by-${bug.id}`}>
                {bug.createdBy || DEMO_USER_NAME}
              </td>
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
          );
          })}
        </tbody>
      </table>
    </div>
  );
}
