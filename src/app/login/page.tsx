'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    // Authentication provider will be connected in the next backend step.
    await new Promise(resolve => setTimeout(resolve, 350));
    setError('La autenticación todavía no está conectada al proveedor de usuarios.');
    setLoading(false);
  }

  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f7f7f5'}}>
    <form onSubmit={submit} style={{width:'100%',maxWidth:420,background:'#fff',padding:36,borderRadius:16,border:'1px solid #e5e5e5'}}>
      <a href="/" style={{fontSize:14}}>← Buenos Aires al por mayor</a>
      <h1 style={{fontSize:38,margin:'28px 0 8px'}}>Ingresar</h1>
      <p style={{color:'#666'}}>Accedé a tu cuenta mayorista.</p>
      <label style={{display:'block',marginTop:26,fontSize:14}}>Email<input name="email" type="email" required autoComplete="email" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      <label style={{display:'block',marginTop:16,fontSize:14}}>Contraseña<input name="password" type="password" required autoComplete="current-password" style={{display:'block',width:'100%',marginTop:8,padding:13,border:'1px solid #ccc',borderRadius:8}} /></label>
      {error && <p role="alert" style={{color:'#a33',fontSize:14,marginTop:16}}>{error}</p>}
      <button disabled={loading} style={{width:'100%',marginTop:22,padding:14,border:0,borderRadius:8,background:'#111',color:'#fff',fontWeight:700,cursor:'pointer'}}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  </main>;
}
