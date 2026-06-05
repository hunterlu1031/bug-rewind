import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { savePlaygroundReturn } from '../constants/playground';
import { BugFilters, filterBugs, sortBugs } from '../components/bugs/BugFilters';
import { BugTable } from '../components/bugs/BugTable';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { DEMO_USER_NAME } from '../constants/user';
import { useBugsContext } from '../context/BugsContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bugs, clearBugs, deleteBugs } = useBugsContext();
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    type: 'All',
  });
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortKey === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(column);
      setSortDirection('asc');
    }
  };

  const filtered = useMemo(
    () => sortBugs(filterBugs(bugs, filters), sortKey, sortDirection),
    [bugs, filters, sortKey, sortDirection],
  );

  const stats = useMemo(() => ({
    total: bugs.length,
    open: bugs.filter((b) => b.status === 'Open').length,
    withReplay: bugs.filter((b) => b.replaySteps?.length > 0).length,
  }), [bugs]);

  const selectedCount = selectedIds.size;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleToggleSelectAll = (visibleIds) => {
    const visible = visibleIds.map(String);
    const allVisibleSelected =
      visible.length > 0 && visible.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visible.forEach((id) => next.delete(id));
      } else {
        visible.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    if (
      window.confirm(
        `Delete ${selectedCount} selected bug${selectedCount !== 1 ? 's' : ''}? This cannot be undone.`,
      )
    ) {
      deleteBugs([...selectedIds]);
      setSelectedIds(new Set());
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all bugs from local storage?')) {
      clearBugs();
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="page-section">
      <PageHeader
        eyebrow={`Welcome, ${DEMO_USER_NAME}`}
        title="Dashboard"
        subtitle="Turn bugs into replayable sessions — capture real interactions, visualize failures step-by-step, and streamline debugging with AI-assisted analysis."
        data-testid="dashboard-title"
        action={
          <Link
            to="/bugs/new"
            state={{ returnTo: location.pathname }}
            data-testid="dashboard-create-bug"
          >
            <Button>Create Bug</Button>
          </Link>
        }
      />
      <p className="sr-only" data-testid="dashboard-welcome">
        Welcome, {DEMO_USER_NAME}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total bugs" value={stats.total} testId="stat-total" />
        <StatCard label="Open" value={stats.open} testId="stat-open" />
        <StatCard label="With replay" value={stats.withReplay} testId="stat-replay" />
      </div>

      <Card data-testid="dashboard-playground-card">
        <CardHeader
          title="Test Playground"
          subtitle="ShopDemo retail test environment with catalog, cart, and checkout flows powered by static mock data."
        />
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-stripe-muted">
            Record interactions anytime — replay persists for inspection until you exit.
          </p>
          <Button
            variant="primary"
            size="lg"
            data-testid="dashboard-open-playground"
            className="shadow-stripe-lg ring-2 ring-stripe-accent/20"
            onClick={() => {
              savePlaygroundReturn(location.pathname);
              navigate('/playground/products', { state: { returnTo: location.pathname } });
            }}
          >
            Open Test Playground
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Bugs"
          subtitle={`${filtered.length} shown`}
          action={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="danger"
                size="sm"
                data-testid="delete-selected-bugs"
                onClick={handleDeleteSelected}
                disabled={selectedCount === 0}
              >
                Delete selected{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </Button>
              <Button
                variant="danger"
                size="sm"
                data-testid="clear-all-bugs"
                onClick={handleClearAll}
                disabled={bugs.length === 0}
              >
                Clear All
              </Button>
            </div>
          }
        />
        <CardBody className="space-y-4">
          <BugFilters filters={filters} onChange={setFilters} />
          <BugTable
            bugs={filtered}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectable
            selectedIds={[...selectedIds]}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({ label, value, testId }) {
  return (
    <div data-testid={testId} className="stripe-card px-5 py-5">
      <p className="text-xs font-medium uppercase tracking-wide text-stripe-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-stripe-accent">
        {value}
      </p>
    </div>
  );
}
