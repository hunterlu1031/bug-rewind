const labelClass = 'mb-1.5 block text-sm font-medium text-stripe-ink';

export function Input({ label, id, 'data-testid': dataTestId, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className={labelClass}>{label}</span>}
      <input id={id} data-testid={dataTestId} className={`stripe-input ${className}`} {...props} />
    </label>
  );
}

export function Textarea({ label, id, 'data-testid': dataTestId, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className={labelClass}>{label}</span>}
      <textarea id={id} data-testid={dataTestId} className={`stripe-input ${className}`} {...props} />
    </label>
  );
}

export function Select({ label, id, 'data-testid': dataTestId, options, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className={labelClass}>{label}</span>}
      <select id={id} data-testid={dataTestId} className={`stripe-input ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
