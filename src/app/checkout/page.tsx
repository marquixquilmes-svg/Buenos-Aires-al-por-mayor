'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { BUSINESS_CONTACT, buildWhatsAppMessage } from '@/lib/business';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return setError('El carrito está vacío.');
    setError(''); setLoading(true);
    const response = await fetch('/api/orders', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ items: items.map(item => ({ productId: item.id, quantity: item.quantity })) }) });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      if (response.status === 401) return setError('Necesitás iniciar sesión antes de confirmar el pedido.');
      return setError(data.error ?? 'No se pudo crear el pedido.');
    }
    const id = String(data.order?.id ?? '');
    setOrderId(id);
    clear();
  }

  const summary = items.map(item => `${item.quantity} x ${item.name}`).join('\n');
  const whatsapp = orderId ? buildWhatsAppMessage(`Hola, soy cliente de Buenos Aires al por mayor. Quiero informar el pedido ${orderId}.\n${summary}`) : BUSINESS_CONTACT.whatsappUrl;

  return <main style={{minHeight:'100vh',padding:'40px 6%',background:'#f7f7f5'}}>
    <a href="/carrito" style={{fontSize:14}}>← Volver al carrito</a>
    <div style={{maxWidth:760,margin:'40px auto'}}><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:11}}>Checkout</p><h1 style={{fontSize:48,margin:'8px 0'}}>Finalizar pedido</h1>
    {orderId ? <div style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}><h2>Pedido creado</h2><p>Tu número de pedido es <strong>{orderId}</strong>.</p><p style={{color:'#666'}}>El pedido quedó registrado en Buenos Aires al por mayor.</p><a href={whatsapp} target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:12,padding:'13px 18px',background:'#111',color:'#fff',borderRadius:8}}>Continuar por WhatsApp</a><p style={{fontSize:13,color:'#777',marginTop:18}}>WhatsApp central: {BUSINESS_CONTACT.whatsapp}</p></div> : <form onSubmit={submit} style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}>
      <label style={{display:'block',marginBottom:18}}>Nombre y apellido<input required name="name" autoComplete="name" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Email<input required name="email" type="email" autoComplete="email" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Teléfono<input required name="phone" type="tel" autoComplete="tel" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Dirección de entrega<input required name="address" autoComplete="street-address" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <div style={{padding:'14px 0',borderTop:'1px solid #eee',marginBottom:14}}><strong>Total del pedido: ${total.toLocaleString('es-AR')}</strong></div>
      {error && <p role="alert" style={{color:'#a33',fontSize:14}}>{error}</p>}
      <button disabled={loading} style={{width:'100%',padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700}}>{loading?'Creando pedido…':'Confirmar pedido'}</button>
      <p style={{fontSize:12,color:'#777',marginTop:12}}>Para confirmar necesitás tener una cuenta iniciada.</p>
    </form>}</div>
  </main>;
}
