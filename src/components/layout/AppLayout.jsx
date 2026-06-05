import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { savePlaygroundReturn } from '../../constants/playground';
import { HelpDialog } from '../help/HelpDialog';
import { Button } from '../ui/Button';
import { BugRewindLogo } from './BugRewindLogo';
import { PocDisclaimer } from './PocDisclaimer';
import { Footer } from './Footer';
import { StorageUsageIndicator } from '../storage/StorageUsageIndicator';
import { StorageWarningBanner } from '../storage/StorageWarningBanner';

const navItems = [
  { to: '/', label: 'Dashboard', testId: 'nav-dashboard' },
  { to: '/analytics', label: 'Analytics', testId: 'nav-analytics' },
  { to: '/bugs/new', label: 'Create Bug', testId: 'nav-create-bug' },
  { to: '/test-runs', label: 'Test Runs', testId: 'nav-test-runs', prefixMatch: true },
  { to: '/playground/products', label: 'Test Playground', testId: 'nav-playground' },
  { to: '/storage', label: 'Storage', testId: 'nav-storage' },
  { to: '/about', label: 'About', testId: 'nav-about' },
];

function isNavItemActive(item, pathname) {
  if (item.to === '/playground/products') {
    return pathname.startsWith('/playground');
  }
  if (item.prefixMatch) {
    return pathname.startsWith(item.to);
  }
  return pathname === item.to;
}

function NavLink({ item, pathname, layout, onNavigate }) {
  const active = isNavItemActive(item, pathname);

  return (
    <Link
      to={item.to}
      state={
        item.to.startsWith('/playground') || item.to === '/bugs/new'
          ? { returnTo: pathname }
          : undefined
      }
      onClick={() => {
        if (item.to.startsWith('/playground')) {
          savePlaygroundReturn(pathname);
        }
        onNavigate?.();
      }}
      data-testid={item.testId}
      className={
        layout === 'mobile'
          ? `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-stripe-accent text-white shadow-stripe'
                : 'text-stripe-ink hover:bg-stripe-bg'
            }`
          : `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-stripe-accent text-white shadow-stripe'
                : 'text-stripe-muted hover:text-stripe-ink'
            }`
      }
    >
      {item.label}
    </Link>
  );
}

export function AppLayout() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isPlayground = location.pathname.startsWith('/playground');

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-stripe flex min-h-screen w-full flex-col">
      <PocDisclaimer />
      {!isPlayground && <StorageWarningBanner />}
      <header className="sticky top-0 z-40 w-full border-b border-stripe-border bg-stripe-surface/95 shadow-stripe backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 xl:px-14">
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex min-w-0 items-center gap-2.5 text-stripe-ink sm:gap-4"
          >
            <BugRewindLogo className="h-9 w-9 shrink-0 sm:h-12 sm:w-12" />
            <span className="flex min-w-0 flex-col">
              <span
                className="truncate text-lg font-bold tracking-tight text-stripe-ink sm:text-2xl lg:text-3xl"
                data-testid="app-title"
              >
                Bug Rewind
              </span>
              <span className="hidden text-sm font-normal text-stripe-muted sm:block">
                QA Bug Tracker
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stripe-border text-stripe-ink hover:bg-stripe-bg lg:hidden"
            data-testid="nav-mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            {!isPlayground && <StorageUsageIndicator />}
            <nav className="flex flex-wrap items-center gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} item={item} pathname={location.pathname} layout="desktop" />
              ))}
              <Button
                variant="text"
                size="sm"
                data-testid="help-button"
                onClick={() => setHelpOpen(true)}
                className="ml-1"
              >
                Help
              </Button>
            </nav>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="border-t border-stripe-border bg-stripe-surface px-4 py-3 sm:px-6 lg:hidden"
            data-testid="nav-mobile-menu"
          >
            {!isPlayground && (
              <div className="mb-3">
                <StorageUsageIndicator className="w-full justify-between" />
              </div>
            )}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  item={item}
                  pathname={location.pathname}
                  layout="mobile"
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
              <Button
                variant="text"
                size="sm"
                data-testid="help-button-mobile"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpOpen(true);
                }}
                className="mt-1 w-full justify-start px-3"
              >
                Help
              </Button>
            </nav>
          </div>
        )}
      </header>
      <main
        className={
          isPlayground
            ? 'w-full flex-1'
            : 'w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14'
        }
      >
        {!isPlayground && !mobileMenuOpen && (
          <div className="mb-6 lg:hidden">
            <StorageUsageIndicator className="w-full justify-between" />
          </div>
        )}
        <Outlet />
      </main>
      {!isPlayground && <Footer />}
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} tone="stripe" />
    </div>
  );
}
