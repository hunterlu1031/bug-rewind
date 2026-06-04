import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiInsightsPanel } from '../components/ai/AiInsightsPanel';
import { ReplayPanel } from '../components/replay/ReplayPanel';
import { SeverityBadge, StatusBadge, TypeBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { SEVERITIES, STATUSES, BUG_TYPES } from '../constants/bugOptions';
import { useBugsContext } from '../context/BugsContext';
import { downloadJson, exportBugAsJson } from '../services/bugStorage';
import { labelForStep } from '../utils/selectors';

export function BugDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBugById, updateBug, deleteBug } = useBugsContext();
  const bug = getBugById(id);

  if (!bug) {
    return (
      <div className="text-center py-12" data-testid="bug-not-found">
        <p className="text-stripe-muted">Bug #{id} not found.</p>
        <Link to="/" className="mt-4 inline-block text-stripe-accent hover:underline" data-testid="back-dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleExport = () => {
    downloadJson(`bug-${bug.id}.json`, exportBugAsJson(bug));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete bug #${bug.id}?`)) {
      deleteBug(bug.id);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-stripe-muted">Bug #{bug.id}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stripe-ink" data-testid="bug-detail-title">
            {bug.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <SeverityBadge severity={bug.severity} />
            <StatusBadge status={bug.status} />
            <TypeBadge type={bug.type} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" data-testid="bug-export-json" onClick={handleExport}>
            Export JSON
          </Button>
          <Button variant="danger" data-testid="bug-delete" onClick={handleDelete}>
            Delete
          </Button>
          <Link to="/" data-testid="bug-back-link">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card data-testid="bug-description-card">
            <CardHeader title="Description" />
            <CardBody>
              <p className="whitespace-pre-wrap text-sm text-stripe-ink">
                {bug.description || 'No description.'}
              </p>
              <p className="mt-4 text-xs text-stripe-muted">
                Created {new Date(bug.createdAt).toLocaleString()}
              </p>
            </CardBody>
          </Card>

          <Card data-testid="bug-edit-card">
            <CardHeader title="Update status" />
            <CardBody className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Severity"
                data-testid="bug-edit-severity"
                options={SEVERITIES}
                value={bug.severity}
                onChange={(e) => updateBug(bug.id, { severity: e.target.value })}
              />
              <Select
                label="Status"
                data-testid="bug-edit-status"
                options={STATUSES}
                value={bug.status}
                onChange={(e) => updateBug(bug.id, { status: e.target.value })}
              />
              <Select
                label="Bug Type"
                data-testid="bug-edit-type"
                options={BUG_TYPES}
                value={bug.type}
                onChange={(e) => updateBug(bug.id, { type: e.target.value })}
              />
            </CardBody>
          </Card>

          <Card data-testid="bug-steps-card">
            <CardHeader
              title="Recorded steps"
              subtitle={`${bug.replaySteps?.length || 0} steps`}
            />
            <CardBody>
              {!bug.replaySteps?.length ? (
                <p className="text-sm text-stripe-muted">No recording attached.</p>
              ) : (
                <ol className="space-y-2 text-sm text-stripe-muted">
                  {bug.replaySteps.map((step, i) => (
                    <li key={`${step.timestamp}-${i}`} className="font-mono text-xs">
                      {i + 1}. {step.label || labelForStep(step)}
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <ReplayPanel bug={bug} />
          <AiInsightsPanel bug={bug} />
        </div>
      </div>
    </div>
  );
}
