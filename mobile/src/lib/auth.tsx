import { createContext,useCallback,useContext,useEffect,useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

type AuthContextValue={token:string|null;email:string|null;ready:boolean;signIn:(email:string,password:string,register?:boolean)=>Promise<void>;signOut:()=>Promise<void>;removeAccount:(password:string)=>Promise<void>};
const AuthContext=createContext<AuthContextValue|null>(null);
const TOKEN_KEY='bam_session';
const EMAIL_KEY='bam_email';
export function AuthProvider({children}:{children:React.ReactNode}){
  const [token,setToken]=useState<string|null>(null),[email,setEmail]=useState<string|null>(null),[ready,setReady]=useState(false);
  useEffect(()=>{Promise.all([SecureStore.getItemAsync(TOKEN_KEY),SecureStore.getItemAsync(EMAIL_KEY)]).then(([t,e])=>{setToken(t);setEmail(e)}).finally(()=>setReady(true))},[]);
  const signIn=useCallback(async(mail:string,password:string,register=false)=>{
    const result=await api<{token:string;user:{email:string}}>(`/api/mobile/${register?'register':'login'}`,null,{method:'POST',body:JSON.stringify({email:mail,password})});
    await SecureStore.setItemAsync(TOKEN_KEY,result.token);await SecureStore.setItemAsync(EMAIL_KEY,result.user.email);
    setToken(result.token);setEmail(result.user.email);
  },[]);
  const clear=useCallback(async()=>{await SecureStore.deleteItemAsync(TOKEN_KEY);await SecureStore.deleteItemAsync(EMAIL_KEY);setToken(null);setEmail(null)},[]);
  const signOut=useCallback(async()=>{if(token)await api('/api/mobile/logout',token,{method:'POST'}).catch(()=>{});await clear()},[token,clear]);
  const removeAccount=useCallback(async(password:string)=>{if(!token)throw new Error('Ingresá a tu cuenta.');await api('/api/mobile/delete-account',token,{method:'POST',body:JSON.stringify({password})});await clear()},[token,clear]);
  return <AuthContext.Provider value={{token,email,ready,signIn,signOut,removeAccount}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider missing');return value}
