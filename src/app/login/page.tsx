'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({email:form.get('email'),password:form.get('password')}) });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) return setError(data.error ?? 'No se pudo iniciar sesión.');
    window.location.href = new URLSearchParams(window.location.search).get('next') || '/';
  }

  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f7f7f5'}}><form onSubmit={submit} style={{width:'100%',maxWidth:420,background:'#fff',padding:36,borderRadius:16,border:'1px solid #e5e5e5'}}><a href="/" style={{fontSize:14}}>← Buenos Aires al por mayor</a><h1 style={{fontSize:38,margin:'28px 0 8px'}}>Ingresar</h1><p style={{color:'#666'}}>Accedé a tu cuenta mayorista.</p><label style={{display:'block',marginTop:26,fontSize:14}}>Email<input name="email" type="email" required autoComplete="email" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label><label style={{display:'block',marginTop:16,fontSize:14}}>Contraseña<input name="password" type="password" required autoComplete="current-password" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>{error && <p role="alert" style={{color:'#a33',fontSize:14,marginTop:16}}>{error}</p>}<button disabled={loading} style={{width:'100%',marginTop:22,padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700}}>{loading?'Ingresando…':'Ingresar'}</button><p style={{fontSize:14,marginTop:18}}>¿No tenés cuenta? <a href="/registro"><u>Crear cuenta</u></a></p></form></main>;
}
