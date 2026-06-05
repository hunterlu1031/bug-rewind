export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="app-footer"
      className="mt-auto w-full border-t border-stripe-border bg-stripe-surface py-8"
    >
      <div className="flex w-full flex-col items-center gap-2 px-6 text-center text-sm text-stripe-muted lg:px-10 xl:px-14">
        <p>
          © {year}{' '}
          <a
            href="https://hunterlu.net/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-author-link"
            className="font-medium text-stripe-accent hover:underline"
          >
            Hunter Lu
          </a>
        </p>
        <p>
          <a
            href="https://github.com/hunterlu1031/bug-rewind"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-github-link"
            className="font-medium text-stripe-accent hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
