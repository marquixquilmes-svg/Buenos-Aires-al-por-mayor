export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplierId?: string;
  priceStatus?: 'test' | 'verified';
  featured?: boolean;
};

// V1 catalog for testing the marketplace flow. Prices marked "test" are placeholders
// until BA al por mayor loads its negotiated supplier prices.
export const products: Product[] = [
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000001', name: 'Funda silicona para celular', category: 'Fundas', price: 3500, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test', featured: true },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000002', name: 'Vidrio templado universal', category: 'Vidrios', price: 1800, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test', featured: true },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000003', name: 'Cable USB-C de carga rápida', category: 'Cables', price: 4200, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test', featured: true },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000004', name: 'Cargador USB-C 20W', category: 'Cargadores', price: 7800, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000005', name: 'Módulo/pantalla para celular', category: 'Módulos', price: 28000, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test', featured: true },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000006', name: 'Batería para celular', category: 'Baterías', price: 14500, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000007', name: 'Flex de carga', category: 'Flex', price: 8500, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000008', name: 'Pin de carga', category: 'Pines de carga', price: 6500, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000009', name: 'Placa de carga', category: 'Placas de carga', price: 10500, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000010', name: 'Tapa trasera para celular', category: 'Tapas', price: 11000, unit: 'unidad', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000011', name: 'Auricular Bluetooth mayorista', category: 'Auriculares', price: 12000, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000012', name: 'Parlante portátil Bluetooth', category: 'Parlantes', price: 18500, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000013', name: 'Soporte para celular', category: 'Soportes', price: 5500, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000014', name: 'Kit de herramientas para reparación', category: 'Herramientas', price: 22000, unit: 'kit', supplierId: 'once-repuestos-celulares', priceStatus: 'test' },
  { id: '8f7b7d7e-7d7e-4f8d-8a11-000000000015', name: 'Adaptador USB-C', category: 'Adaptadores', price: 4800, unit: 'unidad', supplierId: 'once-accesorios-celulares', priceStatus: 'test' },
];

export const categories = ['Fundas', 'Vidrios', 'Cables', 'Cargadores', 'Módulos', 'Baterías', 'Flex', 'Pines de carga', 'Placas de carga', 'Tapas', 'Auriculares', 'Parlantes', 'Soportes', 'Herramientas', 'Adaptadores'];
