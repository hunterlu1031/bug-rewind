export function BugRewindLogo({ className = 'h-12 w-12' }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Bug Rewind"
      className={`object-contain ${className}`}
      data-testid="app-logo-image"
    />
  );
}
