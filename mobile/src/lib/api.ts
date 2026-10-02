export const API = (process.env.EXPO_PUBLIC_API_URL || 'https://www.buenosairesalpormayor.com').replace(/\/$/,'');
export type Quote = { id:string; category:string; description:string; quantity:number; status:string; item_price:string|null; shipping_price:string|null; quote_note:string|null; quote_expires_at:string|null; tracking:string|null; created_at:string };

export async function api<T>(path:string, token:string|null, options:RequestInit={}):Promise<T> {
  const response = await fetch(`${API}${path}`,{
    ...options,
    headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{}),...options.headers},
  });
  const body = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(body.error || 'No pudimos conectar. Intentá nuevamente.');
  return body as T;
}
export const statusLabel:Record<string,string>={requested:'Esperando cotización',quoted:'Cotización disponible',payment_pending:'Verificando pago',paid:'Pagado',preparing:'En preparación',shipped:'Enviado',delivered:'Entregado',cancelled:'Cancelado'};
export const money=(amount:number)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(amount);
