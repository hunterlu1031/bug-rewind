import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestRunsPanel } from './TestRunsPanel';
import { Button } from '../ui/Button';

export function TestRunsModal({ open, onClose, bugId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleViewRun = (runId) => {
    onClose();
    navigate(`/test-runs/${runId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stripe-ink/25 p-4 backdrop-blur-sm"
      data-testid="test-runs-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="stripe-card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden shadow-stripe-lg"
        data-testid="test-runs-modal"
        role="dialog"
        aria-labelledby="test-runs-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stripe-card-header flex shrink-0 items-start justify-between gap-3">
          <div>
            <h2
              id="test-runs-modal-title"
              className="text-xl font-semibold tracking-tight text-stripe-ink"
            >
              Test Runs
            </h2>
            <p className="mt-1 text-sm text-stripe-muted">
              {bugId
                ? `Manage QA sessions for bug #${bugId}`
                : 'QA execution sessions'}
            </p>
          </div>
          <button
            type="button"
            data-testid="test-runs-modal-close-x"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-stripe-muted hover:bg-stripe-bg hover:text-stripe-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <TestRunsPanel
            bugId={bugId}
            embedded
            showHeader={false}
            showCreateAction
            onViewRun={handleViewRun}
          />
        </div>

        <div className="flex shrink-0 justify-end border-t border-stripe-border px-6 py-4">
          <Button data-testid="test-runs-modal-close" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
