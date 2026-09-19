import type { Product } from './catalog';

export function hasStock(product: Pick<Product, 'id'> & { stock?: number }, quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) return false;
  return typeof product.stock !== 'number' || product.stock >= quantity;
}

export function reserveStock(stock: number, quantity: number) {
  if (!Number.isInteger(stock) || !Number.isInteger(quantity) || quantity < 0 || quantity > stock) {
    throw new Error('Insufficient stock');
  }
  return stock - quantity;
}
