import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DRAFT_STORAGE_KEY, savePlaygroundReturn } from '../constants/playground';
import { BugImageAttachments } from '../components/bugs/BugImageAttachments';
import { RecordingPreview } from '../components/replay/RecordingPreview';
import { Button } from '../components/ui/Button';
import { MAX_BUG_IMAGES } from '../constants/attachments';
import { fileToBugAttachment } from '../utils/imageAttachments';
import { useReplayContext } from '../context/ReplayContext';
import { launchRecordingPreviewReplay } from '../utils/recordingPreviewReplay';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import { DEFAULT_BUG, SEVERITIES, STATUSES, BUG_TYPES } from '../constants/bugOptions';
import { DEMO_USER_NAME } from '../constants/user';
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
  const { queueReplay } = useReplayContext();
  const [form, setForm] = useState(loadDraft);
  const [error, setError] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleAddImage = async (file) => {
    const attachment = await fileToBugAttachment(file);
    setForm((f) => {
      const existing = f.attachments || [];
      if (existing.length >= MAX_BUG_IMAGES) return f;
      return { ...f, attachments: [...existing, attachment] };
    });
  };

  const handleReplaceImage = async (imageId, file) => {
    const attachment = await fileToBugAttachment(file);
    setForm((f) => ({
      ...f,
      attachments: (f.attachments || []).map((img) =>
        img.id === imageId ? { ...attachment, id: imageId } : img,
      ),
    }));
  };

  const handleDeleteImage = (imageId) => {
    setForm((f) => ({
      ...f,
      attachments: (f.attachments || []).filter((img) => img.id !== imageId),
    }));
  };

  useEffect(() => {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const openPlayground = () => {
    savePlaygroundReturn(location.pathname);
    navigate('/playground/products', { state: { returnTo: location.pathname } });
  };

  const backPath = location.state?.returnTo || '/';

  const previewRecordingInPlayground = () => {
    if (!finalizedSteps.length || isRecording) return;
    launchRecordingPreviewReplay({
      steps: finalizedSteps,
      returnPath: location.pathname,
      navigate,
      queueReplay,
    });
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
      createdBy: DEMO_USER_NAME,
    });
    resetRecording();
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className="page-section">
      <PageHeader
        title="Create Bug"
        subtitle="Bug Type defaults to UI. Record repro steps in the Test Playground, then save."
        data-testid="create-bug-title"
        action={
          <Button
            type="button"
            variant="secondary"
            data-testid="create-bug-back"
            onClick={() => navigate(backPath)}
          >
            ← Back
          </Button>
        }
      />

      <Card data-testid="test-playground-section">
        <CardHeader
          title="Test Playground"
          subtitle="ShopDemo — mock retail app used as the system under test (SUT)."
        />
        <CardBody className="space-y-4">
          <p className="text-sm leading-relaxed text-stripe-muted">
            Recording is always available in the playground. Interact inside ShopDemo only — not
            this bug tracker UI.
          </p>
          <Button data-testid="open-test-playground" onClick={openPlayground}>
            Open Test Playground to Record
          </Button>
          {finalizedSteps.length > 0 && (
            <div
              className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4"
              data-testid="attach-recording-preview"
            >
              <p className="mb-3 text-sm font-medium text-emerald-800">
                Recording ready — will attach when you save this bug
              </p>
              <RecordingPreview steps={finalizedSteps} defaultExpanded />
              <Button
                type="button"
                data-testid="preview-recording-playground"
                onClick={previewRecordingInPlayground}
                disabled={isRecording}
                className="mt-4 w-full sm:w-auto"
              >
                Preview recorded steps in Test Playground
              </Button>
              <p className="mt-2 text-xs text-emerald-700/90">
                Live simulation in ShopDemo — same replay you will get after saving this bug.
              </p>
            </div>
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
              placeholder="e.g. Checkout button fails on submit"
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
                onClick={() => navigate(backPath)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <BugImageAttachments
        attachments={form.attachments}
        onAdd={handleAddImage}
        onReplace={handleReplaceImage}
        onDelete={handleDeleteImage}
      />
    </div>
  );
}
