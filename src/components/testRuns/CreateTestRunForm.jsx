import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { MAX_TEST_RUNS } from '../../constants/testRuns';
import { useTestRunsContext } from '../../context/TestRunsContext';

export function CreateTestRunForm({
  onCreated,
  onCancel,
  linkBugId,
  compact = false,
}) {
  const { testRuns, createTestRun, addBugToTestRun } = useTestRunsContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const atLimit = testRuns.length >= MAX_TEST_RUNS;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = createTestRun({ name, description });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (linkBugId) {
      addBugToTestRun(result.run.id, linkBugId);
    }

    setName('');
    setDescription('');
    setError('');
    onCreated?.(result.run);
  };

  if (atLimit) {
    return (
      <p className="text-sm text-danger" data-testid="create-test-run-limit">
        Cannot create more than {MAX_TEST_RUNS} test runs.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${compact ? '' : ''}`}
      data-testid="create-test-run-form"
    >
      <Input
        label="Name"
        data-testid="test-run-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Checkout Flow Test"
        required
      />
      <Textarea
        label="Description (optional)"
        data-testid="test-run-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Session goals, environment, build version…"
        rows={compact ? 2 : 3}
      />
      {linkBugId && (
        <p className="text-xs text-stripe-muted">
          This bug will be linked to the new test run automatically.
        </p>
      )}
      {error && (
        <p className="text-sm text-danger" data-testid="create-test-run-error">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" data-testid="test-run-submit">
          Create
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" data-testid="test-run-cancel" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
