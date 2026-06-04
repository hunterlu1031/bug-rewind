import { Link, useNavigate } from 'react-router-dom';
import { usePlaygroundStore } from '../context/PlaygroundStoreContext';

export function PlaygroundCartPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart } = usePlaygroundStore();

  if (cart.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-pg-line py-24 text-center"
        data-testid="pg-cart-empty"
      >
        <p className="text-xl font-medium text-pg-ink">Your cart is empty</p>
        <Link
          to="/playground/products"
          data-testid="pg-cart-shop"
          className="mt-6 rounded-xl bg-pg-accent px-6 py-3 text-sm font-medium text-white hover:bg-pg-accent-hover"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight text-pg-ink" data-testid="pg-cart-title">
        Shopping Cart
      </h2>
      <ul className="mt-8 divide-y divide-pg-line">
        {cart.map((item) => (
          <li key={item.product.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <span className="text-2xl">{item.product.image}</span>
              <p className="font-medium text-pg-ink">{item.product.name}</p>
              <p className="text-sm text-pg-muted">${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                data-testid={`pg-cart-qty-${item.product.id}`}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, Number(e.target.value) || 1)}
                className="pg-input w-16 py-1"
              />
              <button
                type="button"
                data-testid={`pg-cart-remove-${item.product.id}`}
                onClick={() => removeFromCart(item.product.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-lg font-semibold text-pg-ink" data-testid="pg-cart-total">
        Total: ${cartTotal.toFixed(2)}
      </p>
      <button
        type="button"
        data-testid="pg-cart-checkout"
        onClick={() => navigate('/playground/checkout')}
        className="mt-4 rounded-xl bg-pg-accent px-5 py-2.5 font-medium text-white hover:bg-pg-accent-hover"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
