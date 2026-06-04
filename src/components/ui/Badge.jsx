const severityStyles = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-800 border-amber-200',
  High: 'bg-red-50 text-red-700 border-red-200',
};

const statusStyles = {
  Open: 'bg-stripe-accent-soft text-stripe-accent border-stripe-border',
  'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
  Closed: 'bg-slate-100 text-stripe-muted border-stripe-border',
};

export function SeverityBadge({ severity }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${severityStyles[severity] || severityStyles.Medium}`}
    >
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || statusStyles.Open}`}
    >
      {status}
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span className="inline-flex rounded-full border border-stripe-border bg-stripe-bg px-2.5 py-0.5 text-xs font-medium text-stripe-muted">
      {type}
    </span>
  );
}
