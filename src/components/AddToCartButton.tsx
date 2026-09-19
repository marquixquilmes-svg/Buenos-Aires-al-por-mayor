'use client';

import { useState } from 'react';
import type { Product } from '@/lib/catalog';
import { useCart } from './CartProvider';

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Agregar ${product.name} al pedido`}
      style={{
        width: '100%',
        padding: 11,
        border: 0,
        borderRadius: 8,
        background: added ? '#198754' : '#111',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 700,
      }}
    >
      {added ? '✓ Agregado al pedido' : 'Agregar al pedido'}
    </button>
  );
}
