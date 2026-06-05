import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';

export function CloseBugModal({ open, bugTitle, onConfirm, onCancel }) {
  const [resolution, setResolution] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setResolution('');
    setError('');
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = resolution.trim();
    if (!trimmed) {
      setError('Please enter the resolution.');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stripe-ink/25 p-4 backdrop-blur-sm"
      data-testid="close-bug-modal-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="stripe-card w-full max-w-lg overflow-hidden shadow-stripe-lg"
        data-testid="close-bug-modal"
        role="dialog"
        aria-labelledby="close-bug-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stripe-card-header">
          <h2 id="close-bug-modal-title" className="text-xl font-semibold tracking-tight text-stripe-ink">
            Close bug
          </h2>
          {bugTitle && (
            <p className="mt-1 text-sm text-stripe-muted">Closing: {bugTitle}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <Textarea
            label="What was the resolution?"
            data-testid="close-bug-resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="e.g. Fixed in build 1.2.3 — cart total updates correctly after quantity change."
            rows={5}
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600" data-testid="close-bug-error">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              data-testid="close-bug-cancel"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="close-bug-confirm">
              Close bug
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
