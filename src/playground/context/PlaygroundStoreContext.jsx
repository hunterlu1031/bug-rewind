import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const PlaygroundStoreContext = createContext(null);

export function PlaygroundStoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const login = useCallback((email) => {
    setUser({ email, name: email.split('@')[0] || 'Guest' });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );

  const value = {
    user,
    cart,
    cartTotal,
    cartCount,
    login,
    logout,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <PlaygroundStoreContext.Provider value={value}>
      {children}
    </PlaygroundStoreContext.Provider>
  );
}

export function usePlaygroundStore() {
  const ctx = useContext(PlaygroundStoreContext);
  if (!ctx) throw new Error('usePlaygroundStore must be used within PlaygroundStoreProvider');
  return ctx;
}
