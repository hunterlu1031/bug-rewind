import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import { usePlaygroundStore } from '../context/PlaygroundStoreContext';

export function PlaygroundProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = usePlaygroundStore();
  const product = getProductById(productId);

  if (!product) {
    return (
      <div data-testid="pg-product-not-found">
        <p className="text-pg-muted">Product not found.</p>
        <Link to="/playground/products" data-testid="pg-back-to-products" className="text-pg-accent hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, 1);
    navigate('/playground/cart');
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br from-pg-bg via-pg-surface to-pg-accent-soft text-8xl shadow-inner ring-1 ring-pg-line/50">
        {product.image}
      </div>
      <div>
        <Link to="/playground/products" data-testid="pg-product-back" className="text-sm text-pg-accent hover:underline">
          ← Back to catalog
        </Link>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-pg-ink" data-testid="pg-product-detail-title">
          {product.name}
        </h2>
        <p className="mt-4 text-lg text-pg-muted" data-testid="pg-product-detail-desc">
          {product.description}
        </p>
        <p className="mt-8 text-3xl font-bold text-pg-accent" data-testid="pg-product-detail-price">
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          data-testid="pg-add-to-cart"
          onClick={handleAdd}
          className="mt-8 rounded-xl bg-pg-accent px-6 py-3 font-medium text-white shadow-md shadow-pg-accent/25 hover:bg-pg-accent-hover"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
