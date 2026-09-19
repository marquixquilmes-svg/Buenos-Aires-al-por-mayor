export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  featured?: boolean;
};

export const products: Product[] = [
  { id: 'cam-001', name: 'Remera básica mayorista', category: 'Indumentaria', price: 8500, unit: 'unidad', featured: true },
  { id: 'cam-002', name: 'Buzo urbano', category: 'Indumentaria', price: 18500, unit: 'unidad', featured: true },
  { id: 'cal-001', name: 'Zapatilla urbana', category: 'Calzado', price: 32000, unit: 'par', featured: true },
  { id: 'acc-001', name: 'Riñonera urbana', category: 'Accesorios', price: 9200, unit: 'unidad' },
  { id: 'hog-001', name: 'Organizador multiuso', category: 'Hogar', price: 6900, unit: 'unidad' },
];

export const categories = ['Indumentaria', 'Calzado', 'Accesorios', 'Hogar'];
