import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiInsightsPanel } from '../components/ai/AiInsightsPanel';
import { BugCommentsSection } from '../components/bugs/BugCommentsSection';
import { BugImageAttachments } from '../components/bugs/BugImageAttachments';
import { CloseBugModal } from '../components/bugs/CloseBugModal';
import { ReplayPanel } from '../components/replay/ReplayPanel';
import { SeverityBadge, StatusBadge, TypeBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { ASSIGNEE_OPTIONS, UNASSIGNED } from '../constants/assignees';
import { SEVERITIES, STATUSES, BUG_TYPES } from '../constants/bugOptions';
import { DEMO_USER_NAME } from '../constants/user';
import { useBugsContext } from '../context/BugsContext';
import { downloadJson, exportBugAsJson } from '../services/bugStorage';
import { RecordingPreview } from '../components/replay/RecordingPreview';
import { BugTestRunLinks } from '../components/testRuns/BugTestRunLinks';

export function BugDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getBugById,
    updateBug,
    deleteBug,
    addBugComment,
    updateBugComment,
    deleteBugComment,
    addBugImage,
    replaceBugImage,
    deleteBugImage,
  } = useBugsContext();
  const bug = getBugById(id);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

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

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === 'Closed' && bug.status !== 'Closed') {
      setCloseModalOpen(true);
      return;
    }
    updateBug(bug.id, { status: newStatus });
  };

  const handleCloseConfirm = (resolution) => {
    updateBug(bug.id, {
      status: 'Closed',
      closeResolution: resolution,
      closedAt: new Date().toISOString(),
    });
    setCloseModalOpen(false);
  };

  const handleCloseCancel = () => {
    setCloseModalOpen(false);
  };

  const handleAssigneeChange = (e) => {
    const value = e.target.value;
    updateBug(bug.id, {
      assignee: value === UNASSIGNED ? '' : value,
    });
  };

  const assigneeValue = bug.assignee || UNASSIGNED;

  return (
    <div className="page-section">
      <CloseBugModal
        open={closeModalOpen}
        bugTitle={bug.title}
        onConfirm={handleCloseConfirm}
        onCancel={handleCloseCancel}
      />

      <PageHeader
        eyebrow={`Bug #${bug.id}`}
        eyebrowMuted
        title={bug.title}
        data-testid="bug-detail-title"
        action={
          <>
            <Button variant="secondary" data-testid="bug-export-json" onClick={handleExport}>
              Export JSON
            </Button>
            <Button variant="danger" data-testid="bug-delete" onClick={handleDelete}>
              Delete
            </Button>
            <Link to="/" data-testid="bug-back-link">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </>
        }
      />
      <div className="flex flex-wrap gap-2">
        <SeverityBadge severity={bug.severity} />
        <StatusBadge status={bug.status} />
        <TypeBadge type={bug.type} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card data-testid="bug-description-card">
            <CardHeader title="Description" />
            <CardBody className="space-y-5">
              <p className="whitespace-pre-wrap text-body">
                {bug.description || 'No description.'}
              </p>
              <dl className="meta-list border-t border-stripe-border pt-4">
                <dt>Created by</dt>
                <dd data-testid="bug-created-by">{bug.createdBy || DEMO_USER_NAME}</dd>
                <dt>Assigned to</dt>
                <dd data-testid="bug-assignee-display">{bug.assignee || UNASSIGNED}</dd>
                <dt>Created at</dt>
                <dd className="text-stripe-muted">{new Date(bug.createdAt).toLocaleString()}</dd>
                {bug.status === 'Closed' && bug.closedAt && (
                  <>
                    <dt>Closed at</dt>
                    <dd className="text-stripe-muted">
                      {new Date(bug.closedAt).toLocaleString()}
                    </dd>
                  </>
                )}
              </dl>
            </CardBody>
          </Card>

          {bug.status === 'Closed' && bug.closeResolution && (
            <Card data-testid="bug-close-resolution-card">
              <CardHeader title="Close resolution" />
              <CardBody>
                <p
                  className="whitespace-pre-wrap text-body"
                  data-testid="bug-close-resolution"
                >
                  {bug.closeResolution}
                </p>
              </CardBody>
            </Card>
          )}

          <Card data-testid="bug-edit-card">
            <CardHeader title="Details" subtitle="Severity, status, type, and assignment" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
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
                onChange={handleStatusChange}
              />
              <Select
                label="Bug Type"
                data-testid="bug-edit-type"
                options={BUG_TYPES}
                value={bug.type}
                onChange={(e) => updateBug(bug.id, { type: e.target.value })}
              />
              <Select
                label="Assign to"
                data-testid="bug-edit-assignee"
                options={ASSIGNEE_OPTIONS}
                value={assigneeValue}
                onChange={handleAssigneeChange}
              />
            </CardBody>
          </Card>

          <BugImageAttachments
            attachments={bug.attachments}
            onAdd={(file) => addBugImage(bug.id, file)}
            onReplace={(imageId, file) => replaceBugImage(bug.id, imageId, file)}
            onDelete={(imageId) => deleteBugImage(bug.id, imageId)}
          />

          <BugCommentsSection
            comments={bug.comments}
            onAddComment={(text) => addBugComment(bug.id, text)}
            onEditComment={(commentId, text) => updateBugComment(bug.id, commentId, text)}
            onDeleteComment={(commentId) => deleteBugComment(bug.id, commentId)}
          />

          <Card data-testid="bug-steps-card">
            <CardHeader
              title="Recording preview"
              subtitle={
                bug.replaySteps?.length
                  ? 'Review captured steps before running replay'
                  : 'No steps yet'
              }
            />
            <CardBody>
              <RecordingPreview steps={bug.replaySteps || []} defaultExpanded />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <BugTestRunLinks bugId={bug.id} />
          <ReplayPanel bug={bug} />
          <AiInsightsPanel bug={bug} />
        </div>
      </div>
    </div>
  );
}
