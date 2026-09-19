'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/catalog';

type CartLine = Product & { quantity: number };
type CartContextValue = { items: CartLine[]; count: number; total: number; add: (product: Product) => void; remove: (id: string) => void; clear: () => void };

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = 'buenos-aires-al-por-mayor-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved) as CartLine[]);
    } catch {
      // Ignore invalid or unavailable local storage and keep an empty cart.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart still works for the current session if storage is unavailable.
    }
  }, [items, hydrated]);

  const add = (product: Product) => setItems(current => {
    const found = current.find(x => x.id === product.id);
    return found
      ? current.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x)
      : [...current, { ...product, quantity: 1 }];
  });

  const remove = (id: string) => setItems(current => current.flatMap(x =>
    x.id !== id ? [x] : x.quantity > 1 ? [{ ...x, quantity: x.quantity - 1 }] : []
  ));

  const clear = () => setItems([]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((n, x) => n + x.quantity, 0),
    total: items.reduce((n, x) => n + x.price * x.quantity, 0),
    add,
    remove,
    clear,
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
