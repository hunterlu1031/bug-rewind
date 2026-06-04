import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { savePlaygroundReturn } from '../constants/playground';
import { BugFilters, filterBugs } from '../components/bugs/BugFilters';
import { BugTable } from '../components/bugs/BugTable';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { useBugsContext } from '../context/BugsContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bugs, clearBugs } = useBugsContext();
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    type: 'All',
  });

  const filtered = useMemo(() => filterBugs(bugs, filters), [bugs, filters]);

  const stats = useMemo(() => ({
    total: bugs.length,
    open: bugs.filter((b) => b.status === 'Open').length,
    withReplay: bugs.filter((b) => b.replaySteps?.length > 0).length,
  }), [bugs]);

  const handleClearAll = () => {
    if (window.confirm('Clear all bugs from local storage?')) {
      clearBugs();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-stripe-ink"
            data-testid="dashboard-title"
          >
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-stripe-muted">
            QA bug tracker with Test Playground recording, replay, and AI-assisted analysis.
          </p>
        </div>
        <Link to="/bugs/new" data-testid="dashboard-create-bug">
          <Button>Create Bug</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total bugs" value={stats.total} testId="stat-total" />
        <StatCard label="Open" value={stats.open} testId="stat-open" />
        <StatCard label="With replay" value={stats.withReplay} testId="stat-replay" />
      </div>

      <Card data-testid="dashboard-playground-card">
        <CardHeader
          title="Test Playground"
          subtitle="ShopDemo retail SUT — login, products, cart, and checkout (static mock data)."
        />
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stripe-muted">
            Record inside the Test Playground (always enabled). Replay stays until you choose to leave.
          </p>
          <Button
            variant="secondary"
            data-testid="dashboard-open-playground"
            onClick={() => {
              savePlaygroundReturn(location.pathname);
              navigate('/playground/login', { state: { returnTo: location.pathname } });
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
            <Button
              variant="danger"
              size="sm"
              data-testid="clear-all-bugs"
              onClick={handleClearAll}
              disabled={bugs.length === 0}
            >
              Clear All
            </Button>
          }
        />
        <CardBody className="space-y-4">
          <BugFilters filters={filters} onChange={setFilters} />
          <BugTable bugs={filtered} />
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({ label, value, testId }) {
  return (
    <div data-testid={testId} className="stripe-card px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stripe-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-stripe-accent">{value}</p>
    </div>
  );
}
