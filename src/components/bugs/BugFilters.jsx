import { SEVERITIES, STATUSES, BUG_TYPES } from '../../constants/bugOptions';
import { Select } from '../ui/Input';

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
