export function SummaryCard({ label, value, sublabel, testId }) {
  return (
    <div data-testid={testId} className="stripe-card px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stripe-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-stripe-accent">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-stripe-muted">{sublabel}</p>}
    </div>
  );
}
