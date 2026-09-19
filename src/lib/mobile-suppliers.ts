export type MobileSupplier = {
  id: string;
  name: string;
  address: string;
  categories: string[];
  website: string;
  wholesale: boolean;
  verification: 'official-source' | 'directory' | 'needs-review';
  sourceNote: string;
};

export const mobileSuppliers: MobileSupplier[] = [
  { id: 'distriland', name: 'DistriLand', address: 'Av. Corrientes 2279, Once/Balvanera, CABA', categories: ['Módulos y pantallas','Baterías','Pines de carga','Flex','Placas de carga','Cámaras','Tapas y carcasas','Fundas','Vidrios templados','Cables','Cargadores','Soportes','Auriculares','Parlantes','Herramientas'], website: 'https://www.distriland.com.ar/', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: mayorista/importador; local y catálogo publicados.' },
  { id: 'wifix', name: 'Wifix', address: 'Larrea 747, Once/Balvanera, CABA', categories: ['Módulos y pantallas','Baterías','Pines de carga','Flex','Placas de carga','Cámaras','Tapas y carcasas','Herramientas'], website: 'https://www.wifixargentina.com.ar/mayorista-de-repuestos-de-celulares-en-once', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: mayorista de repuestos; compra mínima y ubicación publicadas.' },
  { id: 'star-mayorista', name: 'Star Mayorista', address: 'Larrea 148, Zona Once, CABA', categories: ['Fundas','Vidrios templados','Cables','Cargadores','Auriculares','Soportes','Parlantes','Baterías','Accesorios PC','Memorias y pendrives','Relojes inteligentes'], website: 'https://www.starmayorista.com.ar/', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: mayorista de accesorios para celulares e informática.' },
  { id: 'tecnoplay', name: 'TecnoPlay Mayorista', address: 'Larrea 330, Zona Once, CABA', categories: ['Cargadores','Cables','Adaptadores','Auriculares','Electrónica','Accesorios PC','Soportes'], website: 'https://www.tecnoplaymayorista.com.ar/', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: mayorista de accesorios para celulares e informática.' },
  { id: 'oestech', name: 'OESTECH', address: 'Pasteur 337, Once/Balvanera, CABA', categories: ['Cables','Cargadores','Auriculares','Soportes','Parlantes','Electrónica','Pilas y baterías'], website: 'https://oestech.com.ar/', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: mayorista/importador y local a la calle.' },
  { id: 'tiva', name: 'Tiva Mayorista', address: 'Retiro en Once, CABA', categories: ['Cargadores','Cables','Adaptadores','Auriculares','Electrónica','Accesorios PC'], website: 'https://tivamayorista.com/', wholesale: true, verification: 'official-source', sourceNote: 'Sitio oficial: retiro gratis en Once y condiciones mayoristas publicadas.' },
  { id: 'punto-cell-once', name: 'Punto Cell Once', address: 'Av. Corrientes 2239, Once, CABA', categories: ['Fundas','Accesorios para celulares'], website: '', wholesale: true, verification: 'directory', sourceNote: 'Directorio actualizado: informa venta mayorista e importación directa.' },
];
