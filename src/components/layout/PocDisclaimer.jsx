const DISCLAIMER_TEXT =
  'Proof-of-concept demo only — not production-ready. May contain bugs or incomplete functionality. Showcases QA recording, replay, and AI-assisted bug analysis.';

export function PocDisclaimer({ className = '', variant = 'stripe' }) {
  const isPlayground = variant === 'playground';

  return (
    <div
      data-testid="poc-disclaimer"
      className={
        isPlayground
          ? `border-b border-pg-line/80 bg-pg-accent-soft/80 px-4 py-2.5 sm:px-6 ${className}`
          : `border-b border-stripe-border bg-stripe-accent-soft px-4 py-2.5 sm:px-6 ${className}`
      }
    >
      <p
        className={`mx-auto max-w-5xl text-center text-sm leading-relaxed ${
          isPlayground ? 'text-pg-muted' : 'text-stripe-muted'
        }`}
      >
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
