import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { savePlaygroundReturn } from '../../constants/playground';
import { HelpDialog } from '../help/HelpDialog';
import { Button } from '../ui/Button';
import { PocDisclaimer } from './PocDisclaimer';
import { Footer } from './Footer';

const navItems = [
  { to: '/', label: 'Dashboard', testId: 'nav-dashboard' },
  { to: '/bugs/new', label: 'Create Bug', testId: 'nav-create-bug' },
  { to: '/playground/login', label: 'Test Playground', testId: 'nav-playground' },
];

export function AppLayout() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="app-stripe flex min-h-screen w-full flex-col">
      <PocDisclaimer />
      <header className="sticky top-0 z-40 w-full border-b border-stripe-border bg-stripe-surface/95 shadow-stripe backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 lg:px-10 xl:px-14">
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-3 text-stripe-ink"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-stripe-accent text-sm font-bold text-white shadow-stripe">
              BR
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-stripe-ink">
              Bug Rewind
              <span className="ml-2 hidden font-normal text-stripe-muted sm:inline">
                QA Bug Tracker
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.to === '/playground/login'
                  ? location.pathname.startsWith('/playground')
                  : location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  state={
                    item.to.startsWith('/playground')
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
      </header>
      <main className="w-full flex-1 px-6 py-8 lg:px-10 xl:px-14">
        <Outlet />
      </main>
      <Footer />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} tone="stripe" />
    </div>
  );
}
