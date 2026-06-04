import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DRAFT_STORAGE_KEY, savePlaygroundReturn } from '../constants/playground';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import { DEFAULT_BUG, SEVERITIES, STATUSES, BUG_TYPES } from '../constants/bugOptions';
import { useBugsContext } from '../context/BugsContext';
import { useRecordingContext } from '../context/RecordingContext';

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? { ...DEFAULT_BUG, ...JSON.parse(raw) } : { ...DEFAULT_BUG };
  } catch {
    return { ...DEFAULT_BUG };
  }
}

export function CreateBugPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBug } = useBugsContext();
  const { isRecording, finalizedSteps, attachFinalizedToSteps, resetRecording } = useRecordingContext();
  const [form, setForm] = useState(loadDraft);
  const [error, setError] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const openPlayground = () => {
    savePlaygroundReturn(location.pathname);
    navigate('/playground/login', { state: { returnTo: location.pathname } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRecording) {
      setError('Stop recording in the Test Playground before saving.');
      return;
    }
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    const replaySteps = attachFinalizedToSteps();
    addBug({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      replaySteps: replaySteps.length ? replaySteps : [],
    });
    resetRecording();
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stripe-ink" data-testid="create-bug-title">
          Create Bug
        </h1>
        <p className="mt-2 text-sm text-stripe-muted">
          Bug Type defaults to UI. Record repro steps in the Test Playground, then save.
        </p>
      </div>

      <Card data-testid="test-playground-section">
        <CardHeader
          title="Test Playground"
          subtitle="ShopDemo — mock retail app used as the system under test (SUT)."
        />
        <CardBody className="space-y-3">
          <p className="text-sm text-stripe-muted">
            Recording is always available in the playground. Interact inside ShopDemo only — not this
            bug tracker UI.
          </p>
          <Button data-testid="open-test-playground" onClick={openPlayground}>
            Open Test Playground to Record
          </Button>
          {finalizedSteps.length > 0 && (
            <p className="text-sm text-emerald-700" data-testid="attach-recording-hint">
              {finalizedSteps.length} replay step(s) ready to attach on save.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Bug details" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="create-bug-form">
            <Input
              label="Title"
              data-testid="bug-title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Login form fails on submit"
              required
            />
            <Textarea
              label="Description"
              data-testid="bug-description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Steps to reproduce, expected vs actual behavior…"
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Severity"
                data-testid="bug-severity"
                options={SEVERITIES}
                value={form.severity}
                onChange={(e) => update('severity', e.target.value)}
              />
              <Select
                label="Status"
                data-testid="bug-status"
                options={STATUSES}
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              />
              <Select
                label="Bug Type"
                data-testid="bug-type"
                options={BUG_TYPES}
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" data-testid="create-bug-error">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" data-testid="bug-submit">
                Save Bug
              </Button>
              <Button
                type="button"
                variant="secondary"
                data-testid="bug-cancel"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
