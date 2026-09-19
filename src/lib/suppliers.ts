export type SupplierVerification = 'verified_business_source' | 'verified_official_web' | 'directory_lead';

export type Supplier = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  verification: SupplierVerification;
  sourceUrl: string;
  notes?: string;
};

// Initial Once supplier directory. Contact data is separated from product data.
// Re-verify before commercial publication because addresses, phones and conditions can change.
export const onceSuppliers: Supplier[] = [
  { id: 'once-deportes-01', name: 'Deportes Once', category: 'Deportivo / calzado / indumentaria', address: 'Tte. Gral. Juan Domingo Perón 2785, Once, CABA', phone: '+54 11 4862-9244', verification: 'verified_business_source', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Tte.+Gral.+Juan+Domingo+Peron+2785+Buenos+Aires' },
  { id: 'once-bijouterie-michelle', name: 'Bijouterie Michelle - Mayorista Once', category: 'Bijouterie / accesorios', address: 'Tte. Gral. Juan Domingo Perón 2550, Once, CABA', phone: '+54 11 3957-2468', verification: 'verified_business_source', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Tte.+Gral.+Juan+Domingo+Peron+2550+Buenos+Aires' },
  { id: 'once-queen-mayoristas', name: 'Queen mayoristas', category: 'Belleza', address: 'Bartolomé Mitre 2751, Once, CABA', phone: '+54 11 2871-0881', verification: 'verified_business_source', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Bartolome+Mitre+2751+Buenos+Aires' },
  { id: 'once-multiventas', name: 'Multiventas Once', category: 'Juguetes', address: 'Bartolomé Mitre 2320, Once, CABA', phone: '+54 11 2880-5957', verification: 'verified_business_source', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Bartolome+Mitre+2320+Buenos+Aires' },
  { id: 'once-feria-mayoristas', name: 'Feria Once Mayoristas', category: 'Mayoristas / feria', address: 'Castelli 109, Once, CABA', verification: 'verified_business_source', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Castelli+109+Buenos+Aires' },
  { id: 'once-galeria-central', name: 'Galería Central Once', category: 'Indumentaria / calzado / juguetes / lencería', address: 'Bartolomé Mitre 2734, Once, CABA', phone: '+54 11 3043-6314', verification: 'verified_official_web', sourceUrl: 'https://www.facebook.com/GALERIA.CENTRAL.ONCE.fabricantes.y.mayoristas/', notes: 'La fuente consultada identifica actividad de fabricantes y mayoristas y publica local 111.' },
  { id: 'once-mayorista-accesorios', name: 'Once Mayorista', category: 'Relojes / anteojos / gorras / billeteras / accesorios', address: 'Zona Once, Balvanera, CABA', phone: '+54 11 2254-3957', website: 'https://www.once.com.ar/', verification: 'verified_official_web', sourceUrl: 'https://www.once.com.ar/mayorista-en-once/', notes: 'Mayorista online con depósitos en la zona de Once; no atiende presencialmente según su sitio.' },
  { id: 'once-planeta-once', name: 'Planeta Once', category: 'Directorio de mayoristas e importadores', address: 'Buenos Aires / zona Once', website: 'https://www.planetaonce.com/tiendas', verification: 'verified_official_web', sourceUrl: 'https://www.planetaonce.com/tiendas', notes: 'Directorio/plataforma que agrupa múltiples tiendas mayoristas; no tratarlo como un local individual.' }
];
