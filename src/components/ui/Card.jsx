export function Card({ children, className = '', 'data-testid': dataTestId }) {
  return (
    <div data-testid={dataTestId} className={`stripe-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="stripe-card-header flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-stripe-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-stripe-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
