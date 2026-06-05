import { SEVERITIES, STATUSES, BUG_TYPES } from '../../constants/bugOptions';
import { Select } from '../ui/Input';

const SEVERITY_RANK = Object.fromEntries(SEVERITIES.map((s, i) => [s, i]));
const STATUS_RANK = Object.fromEntries(STATUSES.map((s, i) => [s, i]));
const TYPE_RANK = Object.fromEntries(BUG_TYPES.map((t, i) => [t, i]));

export function BugFilters({ filters, onChange }) {
  return (
    <div
      data-testid="bug-filters"
      className="grid gap-3 sm:grid-cols-3"
    >
      <Select
        label="Severity"
        data-testid="filter-severity"
        options={['All', ...SEVERITIES]}
        value={filters.severity}
        onChange={(e) => onChange({ ...filters, severity: e.target.value })}
      />
      <Select
        label="Status"
        data-testid="filter-status"
        options={['All', ...STATUSES]}
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      />
      <Select
        label="Bug Type"
        data-testid="filter-type"
        options={['All', ...BUG_TYPES]}
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      />
    </div>
  );
}

export function filterBugs(bugs, filters) {
  return bugs.filter((bug) => {
    if (filters.severity !== 'All' && bug.severity !== filters.severity) return false;
    if (filters.status !== 'All' && bug.status !== filters.status) return false;
    if (filters.type !== 'All' && bug.type !== filters.type) return false;
    return true;
  });
}

export function sortBugs(bugs, sortKey, sortDirection = 'asc') {
  const list = [...bugs];
  const dir = sortDirection === 'desc' ? -1 : 1;

  const compare = (a, b) => {
    switch (sortKey) {
      case 'severity':
        return (
          (SEVERITY_RANK[a.severity] ?? 0) - (SEVERITY_RANK[b.severity] ?? 0)
        );
      case 'status':
        return (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
      case 'type':
        return (TYPE_RANK[a.type] ?? 0) - (TYPE_RANK[b.type] ?? 0);
      case 'id':
        return (Number(a.id) || 0) - (Number(b.id) || 0);
      case 'createdAt':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'title':
      default:
        return (a.title || '').localeCompare(b.title || '', undefined, {
          sensitivity: 'base',
        });
    }
  };

  return list.sort((a, b) => compare(a, b) * dir);
}
