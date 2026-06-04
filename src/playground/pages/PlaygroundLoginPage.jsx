import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaygroundStore } from '../context/PlaygroundStoreContext';

export function PlaygroundLoginPage() {
  const navigate = useNavigate();
  const { login } = usePlaygroundStore();
  const [email, setEmail] = useState('qa.tester@shopdemo.com');
  const [password, setPassword] = useState('demo-password');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    login(email.trim());
    navigate('/playground/products');
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-center">
      <div className="hidden lg:block">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-pg-accent">ShopDemo</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-pg-ink">Welcome back</h1>
        <p className="mt-4 text-lg text-pg-muted">
          Sign in to browse mock inventory, cart, and checkout — built for QA recording demos.
        </p>
      </div>

      <div className="rounded-2xl border border-pg-line/80 bg-gradient-to-br from-pg-surface to-pg-accent-soft/20 p-8 shadow-pg lg:p-10">
        <h2 className="text-2xl font-bold text-pg-ink" data-testid="pg-login-title">
          ShopDemo Sign In
        </h2>
        <p className="mt-1 text-sm text-pg-muted">Mock retail login — no real authentication.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-pg-ink">
            Email
            <input
              data-testid="pg-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pg-input mt-1"
            />
          </label>
          <label className="block text-sm font-medium text-pg-ink">
            Password
            <input
              data-testid="pg-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pg-input mt-1"
            />
          </label>
          {error && <p className="text-sm text-red-600" data-testid="pg-login-error">{error}</p>}
          <button
            type="submit"
            data-testid="pg-login-submit"
            className="w-full rounded-xl bg-pg-accent px-4 py-2.5 font-medium text-white shadow-md shadow-pg-accent/25 hover:bg-pg-accent-hover"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
