import { useState } from 'react';
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

export function AppLayout() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const isPlayground = location.pathname.startsWith('/playground');

  return (
    <div className="app-stripe flex min-h-screen w-full flex-col">
      <PocDisclaimer />
      {!isPlayground && <StorageWarningBanner />}
      <header className="sticky top-0 z-40 w-full border-b border-stripe-border bg-stripe-surface/95 shadow-stripe backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 lg:px-10 xl:px-14">
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-4 text-stripe-ink"
          >
            <BugRewindLogo className="h-12 w-12 shrink-0" />
            <span className="flex flex-col">
              <span
                className="text-2xl font-bold tracking-tight text-stripe-ink sm:text-3xl"
                data-testid="app-title"
              >
                Bug Rewind
              </span>
              <span className="hidden text-sm font-normal text-stripe-muted sm:block">
                QA Bug Tracker
              </span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {!isPlayground && <StorageUsageIndicator className="hidden md:flex" />}
            <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.to === '/playground/products'
                  ? location.pathname.startsWith('/playground')
                  : item.prefixMatch
                    ? location.pathname.startsWith(item.to)
                    : location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  state={
                    item.to.startsWith('/playground') || item.to === '/bugs/new'
                      ? { returnTo: location.pathname }
                      : undefined
                  }
                  onClick={() => {
                    if (item.to.startsWith('/playground')) {
                      savePlaygroundReturn(location.pathname);
                    }
                  }}
                  data-testid={item.testId}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-stripe-accent text-white shadow-stripe'
                      : 'text-stripe-muted hover:text-stripe-ink'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="text"
              size="sm"
              data-testid="help-button"
              onClick={() => setHelpOpen(true)}
              className="ml-2"
            >
              Help
            </Button>
            </nav>
          </div>
        </div>
      </header>
      <main
        className={
          isPlayground
            ? 'w-full flex-1'
            : 'w-full flex-1 px-6 py-8 lg:px-10 xl:px-14'
        }
      >
        {!isPlayground && (
          <div className="mb-6 md:hidden">
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
