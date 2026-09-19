'use client';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/catalog';

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return <button onClick={() => add(product)} style={{ width:'100%', border:0, borderRadius:8, padding:'12px 14px', background:'#111', color:'#fff', cursor:'pointer', fontWeight:700 }}>Agregar al carrito</button>;
}
