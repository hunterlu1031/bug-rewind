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
        className={`w-full text-center text-sm ${
          isPlayground ? 'text-pg-muted' : 'text-stripe-muted'
        }`}
      >
        <span
          className={`font-semibold ${isPlayground ? 'text-pg-accent' : 'text-stripe-accent'}`}
        >
          Proof of concept
        </span>
        {' — '}
        Not fully tested; may be buggy. Showcases an innovative QA bug tracker with recording,
        replay, and AI-assisted analysis.
      </p>
    </div>
  );
}
