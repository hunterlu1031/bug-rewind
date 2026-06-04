const variants = {
  primary:
    'bg-stripe-accent text-white border border-stripe-accent hover:bg-stripe-accent-hover shadow-stripe',
  tonal:
    'bg-stripe-accent-soft text-stripe-accent border border-transparent hover:bg-stripe-accent/10',
  secondary:
    'bg-stripe-surface text-stripe-ink border border-stripe-border hover:border-stripe-faint shadow-sm',
  danger:
    'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  text: 'text-stripe-accent hover:bg-stripe-accent-soft border border-transparent',
  ghost: 'text-stripe-muted hover:text-stripe-ink border border-transparent',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-4 text-sm font-medium',
  lg: 'h-11 px-6',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  'data-testid': dataTestId,
  ...props
}) {
  return (
    <button
      type="button"
      data-testid={dataTestId}
      className={`inline-flex items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
