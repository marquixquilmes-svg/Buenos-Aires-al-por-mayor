export type SupplierStatus = 'verified' | 'pending' | 'needs-review';

export type Supplier = {
  id: string;
  name: string;
  categories: string[];
  zone: string;
  status: SupplierStatus;
  minimumOrder?: number;
  internalNotes?: string;
};

export type MarketplaceProduct = {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
};

export const SUPPLIER_CATEGORIES = [
  'fundas', 'vidrios', 'cables', 'cargadores', 'modulos', 'baterias',
  'flex', 'pines-de-carga', 'placas-de-carga', 'camaras', 'tapas',
  'auriculares', 'parlantes', 'soportes', 'herramientas', 'accesorios-pc',
  'adaptadores', 'memorias', 'smartwatches',
] as const;
