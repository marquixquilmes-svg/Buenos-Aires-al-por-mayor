import { products } from '@/lib/catalog';

export default function AdminPage() {
  return <main style={{minHeight:'100vh',padding:'40px 6%',background:'#f7f7f5'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:11}}>Administración</p><h1 style={{margin:0,fontSize:42}}>Panel comercial</h1></div><a href="/" style={{fontSize:14}}>Ver tienda →</a></header>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,margin:'35px 0'}}>
      {[['Productos',products.length],['Pedidos','0'],['Clientes','0'],['Pendientes','0']].map(([label,value])=><div key={label} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:14,padding:22}}><div style={{color:'#777',fontSize:13}}>{label}</div><strong style={{display:'block',fontSize:30,marginTop:8}}>{value}</strong></div>)}
    </section>
    <section style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:14,padding:24}}><h2>Productos</h2><p style={{color:'#666'}}>La administración real quedará protegida por rol admin cuando conectemos la base de datos y middleware.</p>{products.map(p=><div key={p.id} style={{display:'flex',justifyContent:'space-between',padding:'14px 0',borderTop:'1px solid #eee'}}><span>{p.name}</span><strong>${p.price.toLocaleString('es-AR')}</strong></div>)}</section>
  </main>;
}
