export type Product = {
  id: string; name: string; category: string; price: number; unit: string;
  supplierId?: string; supplierCost?: number; supplierUrl?: string;
  priceStatus?: 'test' | 'verified'; featured?: boolean;
};

// Public supplier catalog snapshot. Supplier costs are sourced from public pages;
// storefront price starts with a 20% commercial margin and rounds to $100.
const sell = (cost: number) => Math.ceil((cost * 1.2) / 100) * 100;
const elCelu = 'https://www.elcelu.com.ar/';
const sara = 'https://saracellmayorista.mitiendanube.com/';
const raw = [
  ['Escurridor de silicona Aitech drenaje para canilla gris','Hogar',5864,'AITE26010100X',elCelu],
  ['Freidora de aire Aitech digital 1400W 7.5 litros','Freidoras',122615,'AIGH26010122B',elCelu],
  ['Proyector Smart WiFi Aitech Bluetooth 4K','Proyectores',119949,'AIPS26010100B',elCelu],
  ['Plancha a vapor Aitech 1400W cerámica','Planchas',31402,'AIHG254031V',elCelu],
  ['Secador de pelo Aitech 800W frío y calor negro','Secadores',15993,'AIHG26010102X',elCelu],
  ['Minipimer Mixer Aitech 2 velocidades blanca','Minipimer',26533,'AIHG253513N',elCelu],
  ['Freidora de aire Aitech digital 1400W 10 litros negra','Freidoras',130611,'AIHG251266N',elCelu],
  ['Soporte para monitor 15-33 universal negro','Soportes',46647,'EC100852',elCelu],
  ['Freidora de aire Aitech digital 1400W 6.5 litros negra','Freidoras',77301,'AIHG251262N',elCelu],
  ['Minipimer Mixer Aitech 2 velocidades negra','Minipimer',26533,'AIHG253826N',elCelu],
  ['Espejo LED Aitech recargable para auto','Espejos',18392,'AIEM26010100B',elCelu],
  ['Funda Aitech para notebook 14 pulgadas','Fundas Notebook',19992,'AIMP010101X',elCelu],
  ['Lámpara velador LED recargable USB táctil','Iluminación',15727,'EC100618',elCelu],
  ['Pizarra mágica LCD 8.5 pulgadas','Tablets',8520,'EC101293',elCelu],
  ['Espejo triple maquillaje Aitech LED USB','Espejos',19992,'AIEM010101B',elCelu],
  ['Masajeador eléctrico cervical y lumbar 8 rodillos','Masajeadores',41138,'EC100185',elCelu],
  ['Pizarra mágica LCD 8 pulgadas RGB','Tablets',3164,'EC100103',elCelu],
  ['Samsung A03','Módulos',8000,'SARA-SAM-A03',sara],
  ['Módulo A03 Core','Módulos',10500,'SARA-A03-CORE',sara],
  ['Módulo Samsung A10S','Módulos',9500,'SARA-A10S',sara],
  ['A01','Módulos',9500,'SARA-A01',sara],
  ['A01 Core','Módulos',9500,'SARA-A01-CORE',sara],
  ['Módulo E22 OLED sin marco','Módulos',10500,'SARA-E22-OLED',sara],
  ['Módulo Motorola E20','Módulos',9500,'SARA-MOTO-E20',sara],
  ['Módulo Motorola E7','Módulos',9000,'SARA-MOTO-E7',sara],
] as const;
const uuidFor = (index: number) => `8f7b7d7e-7d7e-4f8d-8a11-${String(index + 100).padStart(12, '0')}`;
export const products: Product[] = raw.map(([name, category, supplierCost, sku, supplierUrl], index) => ({
  id: uuidFor(index), name, category, price: sell(supplierCost), unit: 'unidad',
  supplierId: supplierUrl.includes('saracell') ? 'saracell' : 'elcelu', supplierCost, supplierUrl,
  priceStatus: 'verified', featured: index < 8,
}));
export const categories = [...new Set(products.map(product => product.category))];
