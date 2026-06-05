import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RecentBugsList } from '../components/analytics/RecentBugsList';
import { SimpleBarChart } from '../components/analytics/SimpleBarChart';
import { SummaryCard } from '../components/analytics/SummaryCard';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { RECENT_BUGS_LIMIT } from '../constants/analytics';
import { useBugsContext } from '../context/BugsContext';
import {
  countsToChartItems,
  getBugStats,
  SEVERITY_BAR_COLORS,
  STATUS_BAR_COLORS,
  TYPE_BAR_COLORS,
} from '../utils/bugAnalytics';

export function AnalyticsPage() {
  const { bugs } = useBugsContext();

  const stats = useMemo(() => getBugStats(bugs), [bugs]);

  const severityChart = useMemo(
    () => countsToChartItems(stats.bySeverity, SEVERITY_BAR_COLORS),
    [stats.bySeverity],
  );

  const statusChart = useMemo(
    () => countsToChartItems(stats.byStatus, STATUS_BAR_COLORS),
    [stats.byStatus],
  );

  const typeChart = useMemo(
    () => countsToChartItems(stats.byType, TYPE_BAR_COLORS),
    [stats.byType],
  );

  return (
    <div className="page-section">
      <PageHeader
        title="Bug Analytics"
        subtitle="Insights computed from your stored bugs — updated live as data changes."
        data-testid="analytics-title"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total bugs"
          value={stats.total}
          testId="analytics-total-bugs"
        />
        <SummaryCard
          label="Open"
          value={stats.open}
          testId="analytics-open-bugs"
        />
        <SummaryCard
          label="In progress"
          value={stats.inProgress}
          testId="analytics-in-progress"
        />
        <SummaryCard
          label="With replay"
          value={stats.withReplay}
          sublabel="Recorded repro steps"
          testId="analytics-with-replay"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card data-testid="analytics-severity-card">
          <CardHeader title="By severity" subtitle="Low / Medium / High" />
          <CardBody>
            <SimpleBarChart items={severityChart} emptyMessage="No severity data" />
          </CardBody>
        </Card>

        <Card data-testid="analytics-status-card">
          <CardHeader title="By status" subtitle="Workflow distribution" />
          <CardBody>
            <SimpleBarChart items={statusChart} emptyMessage="No status data" />
          </CardBody>
        </Card>

        <Card data-testid="analytics-type-card">
          <CardHeader title="By type" subtitle="UI / API / Other" />
          <CardBody>
            <SimpleBarChart items={typeChart} emptyMessage="No type data" />
          </CardBody>
        </Card>
      </div>

      <Card data-testid="analytics-recent-card">
        <CardHeader
          title="Recent activity"
          subtitle={`Last ${RECENT_BUGS_LIMIT} bugs by created date`}
          action={
            stats.total > 0 ? (
              <Link
                to="/"
                className="text-sm font-medium text-stripe-accent hover:underline"
                data-testid="analytics-view-all-bugs"
              >
                View all bugs
              </Link>
            ) : null
          }
        />
        <CardBody>
          <RecentBugsList bugs={stats.recentBugs} />
        </CardBody>
      </Card>
    </div>
  );
}
