'use client';

import { FormEvent, useState } from 'react';

export default function CheckoutPage() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return <main style={{minHeight:'100vh',padding:'40px 6%',background:'#f7f7f5'}}>
    <a href="/carrito" style={{fontSize:14}}>← Volver al carrito</a>
    <div style={{maxWidth:760,margin:'40px auto'}}><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:11}}>Checkout</p><h1 style={{fontSize:48,margin:'8px 0'}}>Finalizar pedido</h1>
    {submitted ? <div style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}><h2>Pedido preparado</h2><p style={{color:'#666'}}>La creación persistente del pedido se activará al conectar la base de datos y la sesión del cliente.</p></div> : <form onSubmit={submit} style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}>
      <label style={{display:'block',marginBottom:18}}>Nombre y apellido<input required autoComplete="name" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Email<input required type="email" autoComplete="email" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Teléfono<input required type="tel" autoComplete="tel" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Dirección de entrega<input required autoComplete="street-address" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <button style={{width:'100%',padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700}}>Confirmar pedido</button>
    </form>}</div>
  </main>;
}
