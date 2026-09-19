'use client';

import { FormEvent, useState } from 'react';

export default function RegistroPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/register', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({email: form.get('email'), password: form.get('password')}) });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? 'Cuenta creada correctamente.' : (data.error ?? 'No se pudo crear la cuenta.'));
    setLoading(false);
  }

  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f7f7f5'}}><form onSubmit={submit} style={{width:'100%',maxWidth:420,background:'#fff',padding:36,borderRadius:16,border:'1px solid #e5e5e5'}}><a href="/" style={{fontSize:14}}>← Inicio</a><h1 style={{fontSize:38,margin:'28px 0 8px'}}>Crear cuenta</h1><p style={{color:'#666'}}>Registrate para comprar como mayorista.</p><label style={{display:'block',marginTop:24}}>Email<input name="email" type="email" required autoComplete="email" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label><label style={{display:'block',marginTop:16}}>Contraseña<input name="password" type="password" required minLength={8} autoComplete="new-password" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>{message && <p role="status" style={{marginTop:16}}>{message}</p>}<button disabled={loading} style={{width:'100%',marginTop:22,padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700}}>{loading?'Creando…':'Crear cuenta'}</button><p style={{fontSize:14,marginTop:18}}>¿Ya tenés cuenta? <a href="/login"><u>Ingresar</u></a></p></form></main>;
}
