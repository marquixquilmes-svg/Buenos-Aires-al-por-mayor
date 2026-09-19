const categories = ['Indumentaria', 'Calzado', 'Accesorios', 'Hogar'];

export default function Home() {
  return (
    <main>
      <header style={{padding:'22px 6%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', borderBottom:'1px solid #e8e8e8'}}>
        <strong style={{fontSize:24}}>Buenos Aires al por mayor</strong>
        <nav style={{display:'flex', gap:24, fontSize:14}}><a href="#catalogo">Catálogo</a><a href="#categorias">Categorías</a><a href="#contacto">Contacto</a><span>🛒</span></nav>
      </header>
      <section style={{padding:'90px 6% 80px', background:'#111', color:'#fff'}}>
        <div style={{maxWidth:760}}><p style={{textTransform:'uppercase', letterSpacing:3, fontSize:12}}>Mayorista · Buenos Aires</p><h1 style={{fontSize:'clamp(42px,7vw,78px)', lineHeight:1.02, margin:'18px 0'}}>Comprá al por mayor. Vendé mejor.</h1><p style={{fontSize:18, lineHeight:1.6, color:'#d5d5d5', maxWidth:620}}>Una nueva experiencia para encontrar productos mayoristas, comparar opciones y preparar tus pedidos.</p><a href="#catalogo" style={{display:'inline-block', marginTop:28, padding:'14px 22px', background:'#fff', color:'#111', borderRadius:8, fontWeight:700}}>Ver catálogo</a></div>
      </section>
      <section id="categorias" style={{padding:'55px 6%'}}><h2>Categorías</h2><div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginTop:22}}>{categories.map(c=><div key={c} style={{padding:28, background:'#fff', border:'1px solid #e5e5e5', borderRadius:12}}><strong>{c}</strong><p style={{color:'#666'}}>Ver productos →</p></div>)}</div></section>
      <section id="catalogo" style={{padding:'30px 6% 80px'}}><h2>Catálogo mayorista</h2><p style={{color:'#666'}}>La carga de productos, precios mayoristas, stock y filtros se incorporará en la siguiente etapa.</p></section>
      <footer id="contacto" style={{padding:'35px 6%', background:'#111', color:'#fff'}}><strong>Buenos Aires al por mayor</strong><p style={{color:'#bbb'}}>V1 comercial · arquitectura preparada para catálogo, cuentas y pedidos.</p></footer>
    </main>
  );
}
