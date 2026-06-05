/**
 * Consistent page title block: optional eyebrow, h1, and lead paragraph.
 */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  eyebrowMuted = false,
  action,
  'data-testid': dataTestId,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow && (
          <p
            className={`text-sm font-medium ${
              eyebrowMuted ? 'font-mono text-stripe-muted' : 'text-stripe-accent'
            }`}
            data-testid="page-header-eyebrow"
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={`font-semibold tracking-tight text-stripe-ink ${
            eyebrow ? 'mt-1 text-3xl' : 'text-3xl'
          }`}
          data-testid={dataTestId}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-base leading-relaxed text-stripe-muted">{subtitle}</p>
        )}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}
