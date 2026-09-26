'use client';

import { useEffect, useMemo, useState } from 'react';

type Supplier = { id:string; name:string; slug:string; location:string|null; website:string|null; instagram:string|null; whatsapp:string|null; verified:boolean; active:boolean; catalog_count:number; product_count:number };
type Catalog = { id:string; supplierId:string; supplierName:string; name:string; slug:string; description:string|null; coverImageUrl:string|null; active:boolean; product_count:number };
type Product = { id:string; name:string; slug:string; category:string; price:number|string; stock:number; active:boolean; sku:string|null; imageUrl:string|null; description:string|null; featured:boolean; supplierId:string|null; supplierName:string|null; catalogId:string|null; catalogName:string|null; images:{id:string;url:string;alt:string|null;sortOrder:number}[] };

const money = (value:number|string) => `$${Number(value).toLocaleString('es-AR',{maximumFractionDigits:0})}`;
const emptySupplier = { name:'', slug:'', location:'', website:'', instagram:'', whatsapp:'' };
const emptyCatalog = { supplierId:'', name:'', slug:'', description:'', coverImageUrl:'' };
const emptyProduct = { name:'', slug:'', category:'General', price:'', stock:'0', sku:'', supplierId:'', catalogId:'', imageUrl:'', description:'', featured:false, images:'' };

export default function AdminCatalogManager() {
  const [tab,setTab] = useState<'suppliers'|'catalogs'|'products'>('suppliers');
  const [suppliers,setSuppliers] = useState<Supplier[]>([]);
  const [catalogs,setCatalogs] = useState<Catalog[]>([]);
  const [products,setProducts] = useState<Product[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [supplierForm,setSupplierForm] = useState(emptySupplier);
  const [catalogForm,setCatalogForm] = useState(emptyCatalog);
  const [productForm,setProductForm] = useState(emptyProduct);
  const [editingProduct,setEditingProduct] = useState<string|null>(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const [s,c,p] = await Promise.all([
        fetch('/api/admin/suppliers',{cache:'no-store'}),
        fetch('/api/admin/catalogs',{cache:'no-store'}),
        fetch('/api/admin/products',{cache:'no-store'}),
      ]);
      if ([s,c,p].some(r=>r.status===401)) throw new Error('Sesión de administrador no válida. Volvé a iniciar sesión.');
      if (![s,c,p].every(r=>r.ok)) throw new Error('No se pudieron cargar los datos de administración.');
      const [sj,cj,pj] = await Promise.all([s.json(),c.json(),p.json()]);
      setSuppliers(sj.suppliers||[]); setCatalogs(cj.catalogs||[]); setProducts(pj.products||[]);
    } catch (e) { setError(e instanceof Error?e.message:'Error inesperado.'); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  const categories = useMemo(()=>Array.from(new Set(products.map(p=>p.category).filter(Boolean))).sort(),[products]);
  const catalogsForSupplier = useMemo(()=>catalogs.filter(c=>!productForm.supplierId || c.supplierId===productForm.supplierId),[catalogs,productForm.supplierId]);

  async function save(url:string, method:'POST'|'PATCH', body:unknown) {
    setError(''); setNotice('');
    const response = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const data = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(data.error||'No se pudo guardar.');
    await load(); setNotice('Cambios guardados correctamente.');
  }

  async function createSupplier(e:React.FormEvent) { e.preventDefault(); try { await save('/api/admin/suppliers','POST',supplierForm); setSupplierForm(emptySupplier); } catch(e){setError(e instanceof Error?e.message:'Error');} }
  async function createCatalog(e:React.FormEvent) { e.preventDefault(); try { await save('/api/admin/catalogs','POST',catalogForm); setCatalogForm(emptyCatalog); } catch(e){setError(e instanceof Error?e.message:'Error');} }
  async function saveProduct(e:React.FormEvent) { e.preventDefault(); try {
    const images = productForm.images.split('\n').map(x=>x.trim()).filter(Boolean);
    await save('/api/admin/products',editingProduct?'PATCH':'POST',{...productForm,id:editingProduct||undefined,price:Number(productForm.price||0),stock:Number(productForm.stock||0),images});
    setProductForm(emptyProduct); setEditingProduct(null);
  } catch(e){setError(e instanceof Error?e.message:'Error');} }
  function editProduct(p:Product) {
    setEditingProduct(p.id);
    setProductForm({name:p.name,slug:p.slug,category:p.category,price:String(p.price),stock:String(p.stock),sku:p.sku||'',supplierId:p.supplierId||'',catalogId:p.catalogId||'',imageUrl:p.imageUrl||'',description:p.description||'',featured:p.featured,images:p.images.map(i=>i.url).join('\n')});
    window.scrollTo({top:0,behavior:'smooth'});
  }

  return <section style={{marginTop:28,background:'#fff',border:'1px solid #e5e7eb',borderRadius:20,overflow:'hidden',boxShadow:'0 12px 40px rgba(15,23,42,.06)'}}>
    <div style={{padding:'24px 26px',borderBottom:'1px solid #eef0f2',background:'linear-gradient(135deg,#0b1220,#13294b)',color:'#fff'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',flexWrap:'wrap'}}>
        <div><div style={{fontSize:11,letterSpacing:2,textTransform:'uppercase',opacity:.7}}>Back office</div><h2 style={{margin:'5px 0',fontSize:28}}>Catálogos y productos</h2><p style={{margin:0,opacity:.75}}>Administrá proveedores, catálogos, precios, stock y fotos sin tocar el código.</p></div>
        <button onClick={load} style={button('white')}>Actualizar</button>
      </div>
    </div>
    <div style={{display:'flex',gap:8,padding:'14px 20px',borderBottom:'1px solid #eee',background:'#fafafa'}}>
      {([['suppliers','Proveedores'],['catalogs','Catálogos'],['products','Productos']] as const).map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={tab===id?tabButton(true):tabButton(false)}>{label}</button>)}
    </div>
    <div style={{padding:24}}>
      {error && <div style={alert('#fff1f2','#be123c')}>{error}</div>}
      {notice && <div style={alert('#f0fdf4','#15803d')}>{notice}</div>}
      {loading ? <p style={{color:'#666'}}>Cargando administración…</p> : <>
        {tab==='suppliers' && <div style={grid}>
          <form onSubmit={createSupplier} style={card}><h3 style={h3}>Nuevo proveedor</h3><Field label="Nombre" value={supplierForm.name} onChange={v=>setSupplierForm({...supplierForm,name:v})}/><Field label="Slug" value={supplierForm.slug} placeholder="ej. mi-proveedor" onChange={v=>setSupplierForm({...supplierForm,slug:v})}/><Field label="Ubicación" value={supplierForm.location} onChange={v=>setSupplierForm({...supplierForm,location:v})}/><Field label="Web" value={supplierForm.website} onChange={v=>setSupplierForm({...supplierForm,website:v})}/><Field label="Instagram" value={supplierForm.instagram} onChange={v=>setSupplierForm({...supplierForm,instagram:v})}/><Field label="WhatsApp" value={supplierForm.whatsapp} onChange={v=>setSupplierForm({...supplierForm,whatsapp:v})}/><button style={primary}>Agregar proveedor</button></form>
          <div><h3 style={h3}>Proveedores registrados</h3>{suppliers.map(s=><div key={s.id} style={row}><div><strong>{s.name}</strong><div style={muted}>{s.location||'Sin ubicación'} · {s.product_count} productos · {s.catalog_count} catálogos</div></div><span style={badge(s.active)}>{s.active?'Activo':'Inactivo'}</span></div>)}</div>
        </div>}
        {tab==='catalogs' && <div style={grid}>
          <form onSubmit={createCatalog} style={card}><h3 style={h3}>Nuevo catálogo</h3><label style={label}>Proveedor<select value={catalogForm.supplierId} onChange={e=>setCatalogForm({...catalogForm,supplierId:e.target.value})} style={input}><option value="">Seleccionar…</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><Field label="Nombre" value={catalogForm.name} onChange={v=>setCatalogForm({...catalogForm,name:v})}/><Field label="Slug" value={catalogForm.slug} placeholder="ej. verano-2026" onChange={v=>setCatalogForm({...catalogForm,slug:v})}/><Field label="Descripción" value={catalogForm.description} onChange={v=>setCatalogForm({...catalogForm,description:v})}/><Field label="URL portada" value={catalogForm.coverImageUrl} onChange={v=>setCatalogForm({...catalogForm,coverImageUrl:v})}/><button style={primary}>Agregar catálogo</button></form>
          <div><h3 style={h3}>Catálogos</h3>{catalogs.map(c=><div key={c.id} style={row}><div><strong>{c.name}</strong><div style={muted}>{c.supplierName} · {c.product_count} productos</div></div><span style={badge(c.active)}>{c.active?'Activo':'Inactivo'}</span></div>)}</div>
        </div>}
        {tab==='products' && <div>
          <form onSubmit={saveProduct} style={card}><div style={{display:'flex',justifyContent:'space-between',gap:15,alignItems:'center'}}><h3 style={h3}>{editingProduct?'Editar producto':'Nuevo producto'}</h3>{editingProduct&&<button type="button" onClick={()=>{setEditingProduct(null);setProductForm(emptyProduct)}} style={button('gray')}>Cancelar edición</button>}</div>
            <div style={formGrid}><Field label="Nombre" value={productForm.name} onChange={v=>setProductForm({...productForm,name:v})}/><Field label="Slug" value={productForm.slug} onChange={v=>setProductForm({...productForm,slug:v})}/><Field label="Categoría" value={productForm.category} onChange={v=>setProductForm({...productForm,category:v})}/><Field label="SKU" value={productForm.sku} onChange={v=>setProductForm({...productForm,sku:v})}/><Field label="Precio" value={productForm.price} type="number" onChange={v=>setProductForm({...productForm,price:v})}/><Field label="Stock" value={productForm.stock} type="number" onChange={v=>setProductForm({...productForm,stock:v})}/><label style={label}>Proveedor<select value={productForm.supplierId} onChange={e=>setProductForm({...productForm,supplierId:e.target.value,catalogId:''})} style={input}><option value="">Sin proveedor</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label style={label}>Catálogo<select value={productForm.catalogId} onChange={e=>setProductForm({...productForm,catalogId:e.target.value})} style={input}><option value="">Sin catálogo</option>{catalogsForSupplier.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
            <Field label="URL de imagen principal" value={productForm.imageUrl} onChange={v=>setProductForm({...productForm,imageUrl:v})}/><label style={label}>URLs de fotos adicionales <span style={{fontWeight:400,color:'#777'}}>(una por línea)</span><textarea value={productForm.images} onChange={e=>setProductForm({...productForm,images:e.target.value})} style={{...input,minHeight:90}} placeholder="https://.../foto1.jpg\nhttps://.../foto2.jpg"/></label><Field label="Descripción" value={productForm.description} onChange={v=>setProductForm({...productForm,description:v})}/><label style={{display:'flex',gap:8,alignItems:'center',margin:'12px 0'}}><input type="checkbox" checked={productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})}/> Destacar producto</label><button style={primary}>{editingProduct?'Guardar cambios':'Crear producto'}</button>
          </form>
          <div style={{marginTop:24}}><h3 style={h3}>Productos ({products.length})</h3><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>{products.map(p=><article key={p.id} style={{border:'1px solid #e7e7e7',borderRadius:14,overflow:'hidden',background:'#fff'}}><div style={{height:150,background:'#f3f4f6',display:'grid',placeItems:'center'}}>{p.imageUrl||p.images[0]?.url?<img src={p.imageUrl||p.images[0]?.url} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{color:'#9ca3af'}}>Sin foto</span>}</div><div style={{padding:15}}><div style={{fontSize:11,color:'#6b7280'}}>{p.category} · {p.sku||'sin SKU'}</div><strong style={{display:'block',margin:'5px 0'}}>{p.name}</strong><div style={{color:'#4b5563',fontSize:13}}>{p.supplierName||'Sin proveedor'} · {p.catalogName||'Sin catálogo'}</div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}><strong>{money(p.price)}</strong><span style={badge(p.active)}>{p.active?`Stock ${p.stock}`:'Inactivo'}</span></div><button onClick={()=>editProduct(p)} style={{...button('gray'),width:'100%',marginTop:12}}>Editar producto</button></div></article>)}</div></div>
        </div>}
      </>}
    </div>
  </section>;
}

function Field({label,value,onChange,type='text',placeholder}:{label:string;value:string;onChange:(v:string)=>void;type?:string;placeholder?:string}) { return <label style={labelStyle}>{label}<input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={input}/></label> }
const labelStyle:React.CSSProperties={display:'grid',gap:6,fontSize:12,fontWeight:700,color:'#374151',marginBottom:12};
const label:React.CSSProperties={...labelStyle};
const input:React.CSSProperties={width:'100%',border:'1px solid #d9dde3',borderRadius:10,padding:'11px 12px',fontSize:14,background:'#fff',boxSizing:'border-box'};
const card:React.CSSProperties={border:'1px solid #e7e9ed',borderRadius:14,padding:18,background:'#fbfbfc'};
const row:React.CSSProperties={display:'flex',justifyContent:'space-between',alignItems:'center',gap:15,padding:'14px 0',borderBottom:'1px solid #eee'};
const muted:React.CSSProperties={color:'#6b7280',fontSize:12,marginTop:4};
const h3:React.CSSProperties={margin:'0 0 14px',fontSize:18};
const grid:React.CSSProperties={display:'grid',gridTemplateColumns:'minmax(280px,380px) 1fr',gap:28};
const formGrid:React.CSSProperties={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'0 14px'};
const primary:React.CSSProperties={border:0,borderRadius:10,padding:'11px 16px',background:'#111827',color:'#fff',fontWeight:700,cursor:'pointer'};
function button(kind:'white'|'gray'):React.CSSProperties{return {border:'1px solid '+(kind==='white'?'rgba(255,255,255,.3)':'#d1d5db'),borderRadius:10,padding:'9px 13px',background:kind==='white'?'rgba(255,255,255,.08)':'#fff',color:kind==='white'?'#fff':'#374151',fontWeight:700,cursor:'pointer'}}
function tabButton(active:boolean):React.CSSProperties{return {border:0,borderRadius:9,padding:'9px 14px',background:active?'#111827':'transparent',color:active?'#fff':'#4b5563',fontWeight:700,cursor:'pointer'}}
function badge(active:boolean):React.CSSProperties{return {fontSize:11,fontWeight:700,borderRadius:999,padding:'5px 9px',background:active?'#ecfdf5':'#f3f4f6',color:active?'#047857':'#6b7280',whiteSpace:'nowrap'}}
function alert(background:string,color:string):React.CSSProperties{return {padding:12,borderRadius:10,background,color,fontSize:13,marginBottom:16}}
