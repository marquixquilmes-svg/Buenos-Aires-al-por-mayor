'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/catalog';

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Agregar ${product.name} al carrito`}
      style={{ width:'100%', border:0, borderRadius:8, padding:'12px 14px', background: added ? '#198754' : '#111', color:'#fff', cursor:'pointer', fontWeight:700 }}
    >
      {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
    </button>
  );
}
