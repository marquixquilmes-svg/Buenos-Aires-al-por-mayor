import AddToCart from '@/components/AddToCart';
import { listStoreProducts } from '@/lib/db/repositories';

type StoreProduct = { id:string; name:string; category:string; price:number|string; stock:number; imageUrl:string|null; supplierName:string|null; catalogName:string|null; sku:string|null };
const money = new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });

export const dynamic = 'force-dynamic';

type CatalogoPageProps = { searchParams: Promise<{ categoria?: string }> };

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const selectedCategory = params.categoria?.trim() || '';
  const rows = await listStoreProducts() as StoreProduct[];
  const products = rows.map(p => ({ id:p.id, name:p.name, category:p.category, price:Number(p.price), unit:'unidad', imageUrl:p.imageUrl, supplierName:p.supplierName, catalogName:p.catalogName, sku:p.sku }));
  const categories = [...new Set(products.map(p=>p.category))].sort((a,b)=>a.localeCompare(b,'es'));
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category.localeCompare(selectedCategory, 'es', { sensitivity:'base' }) === 0)
    : products;

  return <main style={{minHeight:'100vh',padding:'40px 6%'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:48,flexWrap:'wrap',gap:16}}><a href="/" style={{fontWeight:800,fontSize:22}}>Buenos Aires al por mayor</a><nav style={{display:'flex',gap:20}}><a href="/carrito">🛒 Carrito</a><a href="/">Inicio</a></nav></header>
    <div style={{maxWidth:900}}><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:12}}>Catálogo</p><h1 style={{fontSize:52,margin:'8px 0 14px'}}>{selectedCategory ? selectedCategory : 'Productos mayoristas'}</h1><p style={{color:'#666',lineHeight:1.6}}>{selectedCategory ? `Productos disponibles en la categoría ${selectedCategory}.` : 'Productos seleccionados de proveedores y catálogos verificados. Consultá disponibilidad antes de realizar compras grandes.'}</p></div>
    <div style={{display:'flex',flexWrap:'wrap',gap:10,margin:'32px 0'}}>
      <a href="/catalogo" style={{border:'1px solid #111',background:selectedCategory?'#fff':'#111',color:selectedCategory?'#111':'#fff',padding:'10px 15px',borderRadius:999,textDecoration:'none'}}>Todos</a>
      {categories.map(c=><a href={`/catalogo?categoria=${encodeURIComponent(c)}`} key={c} style={{border:'1px solid #ddd',background:c.localeCompare(selectedCategory,'es',{sensitivity:'base'})===0?'#111':'#fff',color:c.localeCompare(selectedCategory,'es',{sensitivity:'base'})===0?'#fff':'#111',padding:'10px 15px',borderRadius:999,textDecoration:'none'}}>{c}</a>)}
    </div>
    {filteredProducts.length===0 ? <div style={{padding:50,textAlign:'center',color:'#666',background:'#fff',border:'1px solid #e7e7e7',borderRadius:16}}>No hay productos publicados en esta categoría.</div> : <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:18}}>{filteredProducts.map(p=><article key={p.id} style={{background:'#fff',border:'1px solid #e7e7e7',borderRadius:16,padding:14,overflow:'hidden'}}><div style={{height:190,background:'#f3f4f6',borderRadius:12,display:'grid',placeItems:'center',overflow:'hidden'}}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{color:'#9ca3af'}}>Imagen próximamente</span>}</div><div style={{padding:'10px 6px 4px'}}><p style={{fontSize:11,color:'#777',marginBottom:6,textTransform:'uppercase',letterSpacing:.5}}>{p.category}</p><h2 style={{fontSize:18,margin:'5px 0 8px'}}>{p.name}</h2><p style={{color:'#6b7280',fontSize:12,margin:'0 0 8px'}}>{p.supplierName||'Proveedor por asignar'} · {p.catalogName||'Catálogo por asignar'}</p><p><strong>{money.format(p.price)}</strong> <span style={{color:'#777',fontSize:13}}>/ unidad</span></p><AddToCart product={p}/></div></article>)}</section>}
  </main>;
}
