'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { BUSINESS_CONTACT, buildWhatsAppMessage } from '@/lib/business';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderSummary, setOrderSummary] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return setError('El carrito está vacío.');
    setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    const customer = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      address: String(form.get('address') || '').trim(),
    };
    const acceptedTerms = form.get('terms') === 'on';
    if (!acceptedTerms) {
      setLoading(false);
      setError('Debés aceptar los Términos y Condiciones para confirmar el pedido.');
      return;
    }
    const summary = items.map(item => `${item.quantity} x ${item.name}`).join('\n');
    try {
      const response = await fetch('/api/orders', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({ items: items.map(item => ({ productId: item.id, quantity: item.quantity })), customer, acceptedTerms }),
      });
      const data = await response.json().catch(() => ({}));
      setLoading(false);
      if (!response.ok) {
        setError(data.error ?? 'No se pudo crear el pedido.');
        return;
      }
      const id = String(data.order?.id ?? '');
      setOrderId(id);
      setOrderSummary(summary);
      clear();
    } catch {
      setLoading(false);
      setError('No se pudo conectar con el servidor. Intentá nuevamente.');
    }
  }

  const whatsapp = orderId ? buildWhatsAppMessage(`Hola, soy cliente de Buenos Aires al por mayor. Quiero informar el pedido ${orderId}.\n${orderSummary}`) : BUSINESS_CONTACT.whatsappUrl;

  return <main style={{minHeight:'100vh',padding:'40px 6%',background:'#f7f7f5'}}>
    <a href="/carrito" style={{fontSize:14}}>← Volver al carrito</a>
    <div style={{maxWidth:760,margin:'40px auto'}}><p style={{textTransform:'uppercase',letterSpacing:2,fontSize:11}}>Checkout</p><h1 style={{fontSize:48,margin:'8px 0'}}>Finalizar pedido</h1>
    {orderId ? <div style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}><h2>Pedido creado</h2><p>Tu número de pedido es <strong>{orderId}</strong>.</p><p style={{color:'#666'}}>El pedido quedó registrado en Buenos Aires al por mayor.</p><a href={whatsapp} target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:12,padding:'13px 18px',background:'#111',color:'#fff',borderRadius:8}}>Continuar por WhatsApp</a><p style={{fontSize:13,color:'#777',marginTop:18}}>WhatsApp central: {BUSINESS_CONTACT.whatsappNumber}</p></div> : <form onSubmit={submit} style={{background:'#fff',border:'1px solid #ddd',borderRadius:14,padding:28}}>
      <div style={{padding:16,background:'#f7f7f5',borderRadius:10,marginBottom:22}}><strong>Compra como invitado</strong><p style={{margin:'7px 0 0',color:'#666',fontSize:14}}>No necesitás crear una cuenta. Para validar y coordinar el pedido solicitamos teléfono, email y dirección.</p></div>
      <label style={{display:'block',marginBottom:18}}>Nombre y apellido<input required name="name" autoComplete="name" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Email<input required name="email" type="email" autoComplete="email" style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Teléfono / WhatsApp<input required name="phone" type="tel" autoComplete="tel" minLength={8} style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginBottom:18}}>Dirección de entrega<input required name="address" autoComplete="street-address" minLength={8} style={{display:'block',width:'100%',marginTop:7,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'flex',gap:10,alignItems:'flex-start',margin:'8px 0 18px',fontSize:14,lineHeight:1.5}}><input required type="checkbox" name="terms" style={{marginTop:4,width:18,height:18}} /><span>Acepto los <a href="/terminos-y-condiciones" target="_blank" rel="noreferrer">Términos y Condiciones</a> y la <a href="/privacidad" target="_blank" rel="noreferrer">Política de Privacidad</a> de Buenos Aires al por mayor.</span></label>
      <div style={{padding:'14px 0',borderTop:'1px solid #eee',marginBottom:14}}><strong>Total del pedido: ${total.toLocaleString('es-AR')}</strong></div>
      {error && <p role="alert" style={{color:'#a33',fontSize:14}}>{error}</p>}
      <button type="submit" disabled={loading} style={{width:'100%',padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700}}>{loading?'Creando pedido…':'Confirmar pedido como invitado'}</button>
      <p style={{fontSize:12,color:'#777',marginTop:12}}>Tus datos se utilizan para validar y coordinar este pedido. No necesitás registrarte.</p>
    </form>}</div>
  </main>;
}
