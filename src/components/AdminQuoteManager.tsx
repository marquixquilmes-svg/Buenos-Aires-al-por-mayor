'use client';
import { useEffect, useState } from 'react';
type Quote={id:string;email:string;phone:string;category:string;description:string;quantity:number;delivery_address:string;status:string;item_price:string|null;shipping_price:string|null;quote_note:string|null;tracking:string|null};
export default function AdminQuoteManager(){
const [quotes,setQuotes]=useState<Quote[]>([]),[error,setError]=useState('');
const [feedback,setFeedback]=useState<{id:string;text:string;ok:boolean}|null>(null);
const [saving,setSaving]=useState<string|null>(null);
async function load(){
 const r=await fetch('/api/admin/quotes',{cache:'no-store',signal:AbortSignal.timeout(20000)});
 const body=await r.json().catch(()=>null);
 if(!r.ok||!Array.isArray(body?.quotes))throw new Error(body?.error||'No se pudieron cargar los pedidos. Recargá el panel.');
 setQuotes(body.quotes);
}
useEffect(()=>{void load().catch(err=>setError(err.message))},[]);
async function save(e:React.FormEvent<HTMLFormElement>,id:string){
 e.preventDefault();if(saving)return;
 setError('');setFeedback(null);
 const form=e.currentTarget;
 if(!form.checkValidity()){
 const invalid=Array.from(form.elements).find(el=>el instanceof HTMLInputElement||el instanceof HTMLSelectElement? !el.validity.valid:false) as HTMLInputElement|HTMLSelectElement|undefined;
 setFeedback({id,text:invalid?.name==='expiresAt'?'Completá la fecha y hora de vigencia.':invalid?.name==='itemPrice'?'Ingresá el precio total de los productos, mayor a cero.':invalid?.name==='shippingPrice'?'Ingresá el costo de envío (puede ser 0).':'Completá los campos obligatorios con valores válidos.',ok:false});
 form.reportValidity();return;
 }
 const data=Object.fromEntries(new FormData(form));
 if(typeof data.expiresAt==='string'&&data.expiresAt){
 const expiry=new Date(data.expiresAt);
 if(!Number.isFinite(expiry.getTime())||expiry.getTime()<=Date.now()){setFeedback({id,text:'Elegí una fecha y hora de vigencia futura.',ok:false});return}
 data.expiresAt=expiry.toISOString();
 }
 setSaving(id);
 try{
 const r=await fetch('/api/admin/quotes',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,id}),signal:AbortSignal.timeout(20000)});
 const body=await r.json().catch(()=>null);
 if(!r.ok)throw new Error(body?.error||'No se pudo guardar. Recargá el panel y verificá que sigas conectado como administrador.');
 if(!body?.quote?.id)throw new Error('El servidor no confirmó el guardado. Recargá el panel para revisar el estado del pedido.');
 setQuotes(previous=>previous.map(q=>q.id===id?{...q,...body.quote}:q));
 setFeedback({id,text:data.status==='quoted'?'Cotización enviada. El cliente ya puede verla en sus pedidos.':'Pedido actualizado correctamente.',ok:true});
 }catch(err){setFeedback({id,text:err instanceof Error&&err.name!=='TimeoutError'&&err.name!=='TypeError'?err.message:'No se pudo confirmar el envío por un problema de conexión. Recargá el panel y revisá el pedido antes de volver a enviarlo.',ok:false})}
 finally{setSaving(null)}
}

return <section className="quoteAdmin"><h2>Solicitudes a cotizar</h2>{error&&<p role="alert" className="quoteError">{error}</p>}{quotes.length===0?<p>No hay solicitudes todavía.</p>:quotes.map(q=><article className="quoteCard" key={q.id}><div className="quoteTop"><strong>{q.category} · {q.quantity} unidad(es)</strong><span>{q.status}</span></div><p>{q.description}</p><p>{q.email} · {q.phone}<br />Entrega: {q.delivery_address}</p>{['requested','quoted'].includes(q.status)?<form noValidate onSubmit={e=>void save(e,q.id)}><input type="hidden" name="status" value="quoted" /><div className="quoteFields"><label>Productos (ARS)<input name="itemPrice" type="number" min="0.01" step="0.01" defaultValue={q.item_price||''} required /></label><label>Envío (ARS)<input name="shippingPrice" type="number" min="0" step="0.01" defaultValue={q.shipping_price||'0'} required /></label></div><label>Vigencia (tu hora local)<input name="expiresAt" type="datetime-local" required /></label><label>Nota<input name="note" maxLength={500} defaultValue={q.quote_note||''} /></label><button type="submit" disabled={saving!==null} className="button button-primary">{saving===q.id?'Enviando…':'Enviar cotización'}</button></form>:['paid','preparing','shipped'].includes(q.status)?<form noValidate onSubmit={e=>void save(e,q.id)}><label>Estado<select name="status" required><option value="">Seleccionar</option>{q.status==='paid'&&<option value="preparing">En preparación</option>}{['paid','preparing'].includes(q.status)&&<option value="shipped">Enviado</option>}{q.status==='shipped'&&<option value="delivered">Entregado</option>}</select></label><label>Seguimiento<input name="tracking" maxLength={300} defaultValue={q.tracking||''} /></label><button type="submit" disabled={saving!==null} className="button button-primary">{saving===q.id?'Guardando…':'Actualizar pedido'}</button></form>:null}{feedback?.id===q.id&&<p role={feedback.ok?'status':'alert'} className={feedback.ok?'':'quoteError'}>{feedback.text}</p>}</article>)}</section>}
