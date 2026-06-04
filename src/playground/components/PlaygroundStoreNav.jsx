import { Link, useLocation } from 'react-router-dom';
import { usePlaygroundStore } from '../context/PlaygroundStoreContext';

function isCatalogPath(pathname) {
  return (
    pathname === '/playground/products' || pathname.startsWith('/playground/products/')
  );
}

function isCartPath(pathname) {
  return pathname === '/playground/cart';
}

export function PlaygroundStoreNav() {
  const location = useLocation();
  const { user, logout, cartCount } = usePlaygroundStore();
  const { pathname } = location;

  const catalogActive = isCatalogPath(pathname);
  const cartActive = isCartPath(pathname);

  return (
    <header
      data-testid="pg-store-nav"
      className="sticky top-0 z-10 -mx-6 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-pg-line/80 bg-pg-surface/95 px-6 py-4 backdrop-blur-md sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12"
    >
      <Link
        to={user ? '/playground/products' : '/playground/login'}
        data-testid="pg-store-logo"
        className="flex items-center gap-3"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pg-accent to-indigo-400 text-lg font-bold text-white shadow-lg shadow-pg-accent/30">
          S
        </span>
        <span className="text-xl font-bold tracking-tight text-pg-ink">ShopDemo</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/playground/products"
          data-testid="pg-nav-products"
          className={catalogActive ? 'pg-nav-link-active' : 'pg-nav-link'}
        >
          Catalog
        </Link>
        <Link
          to="/playground/cart"
          data-testid="pg-nav-cart"
          className={cartActive ? 'pg-nav-link-active' : 'pg-nav-link'}
        >
          Cart ({cartCount})
        </Link>
        {user ? (
          <button
            type="button"
            data-testid="pg-logout"
            onClick={logout}
            className="pg-nav-link"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/playground/login"
            data-testid="pg-nav-sign-in"
            className={
              pathname === '/playground/login' || pathname === '/playground'
                ? 'pg-nav-link-active'
                : 'pg-nav-link'
            }
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
