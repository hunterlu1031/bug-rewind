import { useEffect, useState } from 'react';
import { DELETE_CONFIRM_TEXT } from '../../constants/storageManagement';
import { Button } from '../ui/Button';

export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  requireTypedConfirm = true,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!open) {
      setTyped('');
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  const canConfirm = !requireTypedConfirm || typed === DELETE_CONFIRM_TEXT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stripe-ink/30 p-4 backdrop-blur-sm"
      data-testid="confirm-delete-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="stripe-card w-full max-w-md shadow-stripe-lg"
        data-testid="confirm-delete-modal"
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stripe-card-header">
          <h2 className="text-lg font-semibold text-stripe-ink">{title}</h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-stripe-muted">{description}</p>
          {requireTypedConfirm && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stripe-ink">
                Type <strong>{DELETE_CONFIRM_TEXT}</strong> to confirm
              </span>
              <input
                type="text"
                data-testid="confirm-delete-input"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                className="stripe-input w-full"
                autoComplete="off"
              />
            </label>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" data-testid="confirm-delete-cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="danger"
              data-testid="confirm-delete-submit"
              disabled={!canConfirm}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
