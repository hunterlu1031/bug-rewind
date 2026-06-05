import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

export function PlaygroundProductsPage() {
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-pg-ink" data-testid="pg-products-title">
          Product Catalog
        </h2>
        <p className="mt-2 text-pg-muted">
          Browse mock inventory — catalog, cart, and checkout.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-pg-line/80 bg-pg-surface shadow-pg transition hover:border-pg-accent/40 hover:shadow-pg-lg"
            data-testid={`pg-product-card-${product.id}`}
          >
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-pg-bg to-pg-accent-soft text-5xl">
              {product.image}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-pg-accent">
                {product.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-pg-ink">{product.name}</h3>
              <p className="mt-2 flex-1 text-sm text-pg-muted line-clamp-2">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-pg-accent">${product.price.toFixed(2)}</span>
                <Link
                  to={`/playground/products/${product.id}`}
                  data-testid={`pg-product-view-${product.id}`}
                  className="rounded-xl bg-pg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-pg-accent-hover"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
