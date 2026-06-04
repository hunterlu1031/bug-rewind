import { useEffect } from 'react';
import { Button } from '../ui/Button';

const SECTIONS = [
  {
    title: 'What is Bug Rewind?',
    body: 'A proof-of-concept QA bug tracker with in-app recording, visual replay in a mock retail app, and rule-based AI insights — all in the browser with no backend.',
  },
  {
    title: '1. Create a bug',
    body: 'Go to Create Bug (Bug Type defaults to UI). Fill in title, description, severity, and status.',
  },
  {
    title: '2. Record repro steps',
    body: 'Open the Test Playground and click Start Recording. Only actions inside the ShopDemo box are captured. Stop recording when done, then save the bug from Create Bug.',
  },
  {
    title: '3. Replay a bug',
    body: 'On a bug’s detail page, click Replay in Test Playground. Adjust step delay in the replay panel, use Replay again when finished, and Return to previous screen when ready.',
  },
  {
    title: '4. AI insights',
    body: 'Each bug shows suggested severity, possible root cause, rewritten summary, and duplicate hints from a local rule engine.',
  },
];

const toneStyles = {
  stripe: {
    overlay: 'bg-stripe-ink/25',
    card: 'stripe-card max-h-[85vh] w-full max-w-lg overflow-hidden shadow-stripe-lg',
    header: 'stripe-card-header',
    title: 'text-xl font-semibold tracking-tight text-stripe-ink',
    subtitle: 'text-sm text-stripe-muted',
    sectionTitle: 'text-sm font-medium text-stripe-ink',
    sectionBody: 'text-sm leading-relaxed text-stripe-muted',
    footer: 'border-t border-stripe-border',
  },
  playground: {
    overlay: 'bg-pg-ink/20',
    card: 'pg-card max-h-[85vh] w-full max-w-lg overflow-hidden shadow-pg-lg',
    header: 'border-b border-pg-line px-6 py-4',
    title: 'text-xl font-semibold text-pg-ink',
    subtitle: 'text-sm text-pg-muted',
    sectionTitle: 'text-sm font-medium text-pg-ink',
    sectionBody: 'text-sm leading-relaxed text-pg-muted',
    footer: 'border-t border-pg-line',
  },
};

export function HelpDialog({ open, onClose, tone = 'stripe' }) {
  const styles = toneStyles[tone] || toneStyles.stripe;

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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${styles.overlay}`}
      data-testid="help-dialog-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.card}
        data-testid="help-dialog"
        role="dialog"
        aria-labelledby="help-dialog-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="help-dialog-title" className={styles.title}>
            How to use Bug Rewind
          </h2>
          <p className={`mt-1 ${styles.subtitle}`}>
            Quick guide for QA recording, replay, and AI triage
          </p>
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          <ol className="space-y-5">
            {SECTIONS.map((section) => (
              <li key={section.title}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <p className={`mt-1 ${styles.sectionBody}`}>{section.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className={`flex justify-end px-6 py-4 ${styles.footer}`}>
          {tone === 'playground' ? (
            <button
              type="button"
              data-testid="help-dialog-close"
              onClick={onClose}
              className="rounded-xl bg-pg-accent px-4 py-2 text-sm font-medium text-white hover:bg-pg-accent-hover"
            >
              Got it
            </button>
          ) : (
            <Button data-testid="help-dialog-close" onClick={onClose}>
              Got it
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
