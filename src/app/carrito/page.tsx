'use client';
import { useCart } from '@/components/CartProvider';

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export default function CarritoPage() {
  const { items, total, remove, clear } = useCart();
  return <main style={{minHeight:'100vh', padding:'40px 6%', maxWidth:1000, margin:'auto'}}>
    <header style={{display:'flex',justifyContent:'space-between',marginBottom:40}}><a href="/" style={{fontWeight:800,fontSize:22}}>Buenos Aires al por mayor</a><a href="/catalogo">← Catálogo</a></header>
    <h1 style={{fontSize:48}}>Tu carrito</h1>
    {items.length === 0 ? <section style={{padding:'50px 0',color:'#666'}}>Tu carrito está vacío. <a href="/catalogo" style={{textDecoration:'underline'}}>Ver catálogo</a>.</section> : <>
      <section style={{display:'grid',gap:12,margin:'30px 0'}}>{items.map(item => <article key={item.id} style={{background:'#fff',border:'1px solid #e5e5e5',borderRadius:12,padding:18,display:'flex',justifyContent:'space-between',gap:20}}><div><strong>{item.name}</strong><p style={{margin:'7px 0',color:'#666'}}>Cantidad: {item.quantity} · {money.format(item.price)} c/u</p></div><button onClick={() => remove(item.id)} style={{border:0,background:'transparent',textDecoration:'underline',cursor:'pointer'}}>Quitar</button></article>)}</section>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:20,borderTop:'1px solid #ddd'}}><strong>Total: {money.format(total)}</strong><div style={{display:'flex',gap:10}}><button onClick={clear} style={{padding:'12px 16px',background:'#fff',border:'1px solid #ddd',borderRadius:8}}>Vaciar</button><button style={{padding:'12px 18px',background:'#111',color:'#fff',border:0,borderRadius:8}}>Continuar al checkout</button></div></div>
    </>}
  </main>;
}
