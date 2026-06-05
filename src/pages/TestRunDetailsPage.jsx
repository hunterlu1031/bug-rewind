import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AddBugToTestRun } from '../components/testRuns/AddBugToTestRun';
import { TestRunBugsList } from '../components/testRuns/TestRunBugsList';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { useBugsContext } from '../context/BugsContext';
import { useTestRunsContext } from '../context/TestRunsContext';

export function TestRunDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bugs } = useBugsContext();
  const {
    getTestRunById,
    updateTestRun,
    deleteTestRun,
    addBugToTestRun,
    removeBugFromTestRun,
  } = useTestRunsContext();

  const testRun = getTestRunById(id);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [addError, setAddError] = useState('');

  const linkedBugs = useMemo(() => {
    if (!testRun) return [];
    const bugMap = new Map(bugs.map((b) => [String(b.id), b]));
    return testRun.bugIds
      .map((bugId) => bugMap.get(bugId))
      .filter(Boolean);
  }, [testRun, bugs]);

  const missingBugIds = useMemo(() => {
    if (!testRun) return [];
    const bugMap = new Map(bugs.map((b) => [String(b.id), b]));
    return testRun.bugIds.filter((bugId) => !bugMap.has(bugId));
  }, [testRun, bugs]);

  const availableBugs = useMemo(() => {
    if (!testRun) return [];
    const linked = new Set(testRun.bugIds);
    return bugs.filter((b) => !linked.has(String(b.id)));
  }, [testRun, bugs]);

  if (!testRun) {
    return (
      <div className="py-12 text-center" data-testid="test-run-not-found">
        <p className="text-stripe-muted">Test run not found.</p>
        <Link
          to="/test-runs"
          className="mt-4 inline-block text-stripe-accent hover:underline"
          data-testid="test-runs-back"
        >
          Back to Test Runs
        </Link>
      </div>
    );
  }

  const startEdit = () => {
    setEditName(testRun.name);
    setEditDescription(testRun.description || '');
    setSaveError('');
    setEditing(true);
  };

  const handleSaveMeta = (e) => {
    e.preventDefault();
    const result = updateTestRun(testRun.id, {
      name: editName,
      description: editDescription,
    });
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    setEditing(false);
    setSaveError('');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete test run "${testRun.name}"?`)) {
      deleteTestRun(testRun.id);
      navigate('/test-runs');
    }
  };

  const handleAddBug = (bugId) => {
    const result = addBugToTestRun(testRun.id, bugId);
    if (!result.ok) {
      setAddError(result.error);
      return;
    }
    setAddError('');
  };

  const handleRemoveBug = (bugId) => {
    removeBugFromTestRun(testRun.id, bugId);
  };

  const headerSubtitle = [
    !editing && testRun.description ? testRun.description : null,
    `Created ${new Date(testRun.createdAt).toLocaleString()}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="page-section">
      <PageHeader
        eyebrow="Test Run"
        eyebrowMuted
        title={testRun.name}
        subtitle={headerSubtitle}
        data-testid="test-run-detail-title"
        action={
          <>
            <Button variant="secondary" data-testid="test-run-edit-toggle" onClick={startEdit}>
              Edit
            </Button>
            <Button variant="danger" data-testid="test-run-delete" onClick={handleDelete}>
              Delete
            </Button>
            <Link to="/test-runs" data-testid="test-run-back-list">
              <Button variant="ghost">All Test Runs</Button>
            </Link>
          </>
        }
      />

      {editing && (
        <Card data-testid="test-run-edit-card">
          <CardHeader title="Edit test run" />
          <CardBody>
            <form onSubmit={handleSaveMeta} className="space-y-4">
              <Input
                label="Name"
                data-testid="test-run-edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <Textarea
                label="Description"
                data-testid="test-run-edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
              {saveError && <p className="text-sm text-danger">{saveError}</p>}
              <div className="flex gap-2">
                <Button type="submit" data-testid="test-run-edit-save">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  data-testid="test-run-edit-cancel"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card data-testid="test-run-bugs-card">
        <CardHeader
          title="Linked bugs"
          subtitle={`${testRun.bugIds.length} bug ID${testRun.bugIds.length !== 1 ? 's' : ''} referenced (no bug data duplicated)`}
        />
        <CardBody className="space-y-6">
          <AddBugToTestRun
            testRun={testRun}
            availableBugs={availableBugs}
            onAdd={handleAddBug}
            error={addError}
            onClearError={() => setAddError('')}
          />
          <TestRunBugsList bugs={linkedBugs} onRemove={handleRemoveBug} />
          {missingBugIds.length > 0 && (
            <p className="text-xs text-stripe-muted" data-testid="test-run-missing-bugs">
              {missingBugIds.length} linked bug(s) no longer exist:{' '}
              {missingBugIds.join(', ')}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
