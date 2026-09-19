import type { Product } from './catalog';

export type CartLine = { productId: string; quantity: number };

export function calculateCartTotal(lines: CartLine[], catalog: Product[]) {
  return lines.reduce((total, line) => {
    const product = catalog.find(item => item.id === line.productId);
    if (!product) return total;
    return total + product.price * Math.max(1, Math.floor(line.quantity));
  }, 0);
}

export function validateCart(lines: CartLine[], catalog: Product[]) {
  return lines.every(line => {
    const product = catalog.find(item => item.id === line.productId);
    return Boolean(product) && Number.isInteger(line.quantity) && line.quantity > 0;
  });
}
