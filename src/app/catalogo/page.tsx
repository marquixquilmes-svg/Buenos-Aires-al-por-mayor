import { categories, products } from '@/lib/catalog';

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export default function CatalogoPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '40px 6%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 22 }}>Buenos Aires al por mayor</a>
        <a href="/" style={{ fontSize: 14 }}>← Inicio</a>
      </header>
      <div style={{ maxWidth: 900 }}><p style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}>Catálogo</p><h1 style={{ fontSize: 52, margin: '8px 0 14px' }}>Productos mayoristas</h1><p style={{ color: '#666', lineHeight: 1.6 }}>Precios de referencia de la V1. La conexión a stock y precios reales quedará desacoplada de la interfaz.</p></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '32px 0' }}>{categories.map(c => <button key={c} style={{ border: '1px solid #ddd', background: '#fff', padding: '10px 15px', borderRadius: 999 }}>{c}</button>)}</div>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>{products.map(p => <article key={p.id} style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 14, padding: 20 }}><div style={{ height: 150, background: '#eee', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#999' }}>Imagen</div><p style={{ fontSize: 12, color: '#777', marginBottom: 6 }}>{p.category}</p><h2 style={{ fontSize: 18, margin: '5px 0 10px' }}>{p.name}</h2><strong>{money.format(p.price)}</strong><span style={{ color: '#777', fontSize: 13 }}> / {p.unit}</span></article>)}</section>
    </main>
  );
}
