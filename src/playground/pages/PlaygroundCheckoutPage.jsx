import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaygroundStore } from '../context/PlaygroundStoreContext';

export function PlaygroundCheckoutPage() {
  const { cart, cartTotal, clearCart, user } = usePlaygroundStore();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('123 QA Test Lane');
  const [card, setCard] = useState('4111 1111 1111 1111');
  const [placed, setPlaced] = useState(false);

  const handlePlace = (e) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (cart.length === 0 && placed) {
    return (
      <div
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
        data-testid="pg-checkout-success"
      >
        <h2 className="text-xl font-bold text-emerald-800">Order placed (mock)</h2>
        <p className="mt-2 text-emerald-700">No payment was processed. This is a QA simulation.</p>
        <Link
          to="/playground/products"
          data-testid="pg-checkout-continue"
          className="mt-4 inline-block text-pg-accent hover:underline"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div data-testid="pg-checkout-empty">
        <p className="text-pg-muted">Nothing to checkout.</p>
        <Link to="/playground/cart" data-testid="pg-checkout-go-cart" className="text-pg-accent hover:underline">
          Go to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-pg-line/80 bg-pg-surface p-6 shadow-pg">
      <h2 className="text-2xl font-bold text-pg-ink" data-testid="pg-checkout-title">
        Checkout
      </h2>
      <p className="mt-1 text-sm text-pg-muted">Order total: ${cartTotal.toFixed(2)} (mock)</p>
      <form onSubmit={handlePlace} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-pg-ink">
          Full name
          <input
            data-testid="pg-checkout-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pg-input mt-1"
            required
          />
        </label>
        <label className="block text-sm font-medium text-pg-ink">
          Shipping address
          <input
            data-testid="pg-checkout-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pg-input mt-1"
            required
          />
        </label>
        <label className="block text-sm font-medium text-pg-ink">
          Card number
          <input
            data-testid="pg-checkout-card"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className="pg-input mt-1"
            required
          />
        </label>
        <button
          type="submit"
          data-testid="pg-checkout-submit"
          className="w-full rounded-xl bg-pg-accent px-4 py-2.5 font-medium text-white hover:bg-pg-accent-hover"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
