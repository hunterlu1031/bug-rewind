export function Footer() {
  return (
    <footer
      data-testid="app-footer"
      className="mt-auto w-full border-t border-stripe-border bg-stripe-surface py-8"
    >
      <div className="w-full px-6 text-center text-sm text-stripe-muted lg:px-10 xl:px-14">
        Built by <span className="font-medium text-stripe-accent">Hunter Lu</span>
      </div>
    </footer>
  );
}
