import { onceSuppliers } from '@/lib/suppliers';

export default function ProveedoresOncePage() {
  return <main style={{minHeight:'100vh',padding:'40px 6%',background:'#f7f7f5'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:45}}><div><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:11}}>Directorio</p><h1 style={{fontSize:46,margin:'8px 0'}}>Proveedores de Once</h1><p style={{color:'#666'}}>Primera base de comercios y fuentes mayoristas verificadas.</p></div><a href="/" style={{fontSize:14}}>← Inicio</a></header>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>{onceSuppliers.map(s=><article key={s.id} style={{background:'#fff',border:'1px solid #e3e3e3',borderRadius:14,padding:22}}><div style={{fontSize:11,textTransform:'uppercase',letterSpacing:1,color:'#777'}}>{s.category}</div><h2 style={{fontSize:20,margin:'10px 0'}}>{s.name}</h2><p style={{margin:'7px 0',color:'#444'}}>📍 {s.address}</p>{s.phone && <p style={{margin:'7px 0',color:'#444'}}>☎ {s.phone}</p>}{s.website && <p style={{margin:'7px 0'}}><a href={s.website} target="_blank" rel="noreferrer"><u>Web oficial</u></a></p>}<p style={{fontSize:12,color:'#777',marginTop:16}}>Estado: {s.verification === 'verified_business_source' ? 'Verificado como comercio' : 'Verificado mediante fuente oficial'}</p>{s.notes && <p style={{fontSize:13,color:'#666'}}>{s.notes}</p>}</article>)}</section>
    <p style={{fontSize:12,color:'#777',marginTop:28}}>Los datos comerciales pueden cambiar. Antes de publicar una ficha como proveedor recomendado, conviene revalidar dirección, teléfono, condiciones y actividad mayorista.</p>
  </main>;
}
