'use client';

import type { Product } from '@/lib/catalog';
import { useCart } from './CartProvider';

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return <button onClick={() => add(product)} style={{width:'100%',padding:11,border:0,borderRadius:8,background:'#111',color:'#fff',cursor:'pointer'}}>Agregar al pedido</button>;
}
