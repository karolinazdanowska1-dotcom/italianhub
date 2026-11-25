import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import type {Session,SupabaseClient} from '@supabase/supabase-js';
import Lab from './app/lab';
import './app/globals.css';
import {enableBrowserStorage} from './storage';
import {cloudApi,connect} from './cloud';

const configKey='italian-lab-supabase';
function savedClient() {
  try {
    const config=JSON.parse(localStorage.getItem(configKey)||'null');
    if(config) return connect(config.url,config.key);
  } catch {}
  return null;
}

function App() {
  const [client,setClient]=useState<SupabaseClient|null>(savedClient);
  const [session,setSession]=useState<Session|null>(null);
  const [local,setLocal]=useState(false);
  const [ready,setReady]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>{
    if(!client) return;
    const {data}=client.auth.onAuthStateChange((_event,session)=>setSession(session));
    return ()=>data.subscription.unsubscribe();
  },[client]);
  const userId=session?.user.id;
  useEffect(()=>{
    if(!local && (!client || !userId)) return;
    const cleanup=enableBrowserStorage(local?undefined:(path,init)=>cloudApi(client!,userId!,path,init));
    setReady(true);
    return ()=>{cleanup();setReady(false);};
  },[local,client,userId]);
  if(ready && (local||userId)) return <>
    <div style={{position:'fixed',bottom:12,right:16,zIndex:19}}>
      <button className="secondary" onClick={()=>{if(local){setReady(false);setLocal(false);}else void client?.auth.signOut();}}>
        {local?'Připojit cloudové ukládání':'Odhlásit se ze Supabase'}
      </button>
    </div>
    <Lab cloud={!local}/>
  </>;
  return <main style={{maxWidth:580,margin:'4rem auto'}}>
    <section className="card">
      <h1>ITALIAN LAB</h1>
      <p>Připoj si cloudové ukládání pokroku a podkladů.</p>
      {!client ? <form onSubmit={e=>{
        e.preventDefault();
        const data=new FormData(e.currentTarget);
        const url=String(data.get('url')).trim(),key=String(data.get('key')).trim();
        try{const next=connect(url,key);localStorage.setItem(configKey,JSON.stringify({url,key}));setClient(next);setMessage('');}
        catch(error){setMessage((error as Error).message);}
      }}>
        <label>URL projektu Supabase<input className="answerInput" type="url" name="url" required /></label>
        <label>Veřejný klíč Supabase<input className="answerInput" name="key" placeholder="sb_publishable_…" required /></label>
        <button className="primary">Připojit projekt</button>
      </form>:<form onSubmit={async e=>{
        e.preventDefault();
        const email=String(new FormData(e.currentTarget).get('email'));
        try{
          const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
          setMessage(error?error.message:'Otevři přihlašovací odkaz, který ti přijde e-mailem.');
        }catch(error){setMessage((error as Error).message);}
      }}>
        <label>E-mail<input className="answerInput" type="email" name="email" required /></label>
        <button className="primary">Poslat přihlašovací odkaz</button>
        <button className="textButton" type="button" onClick={()=>{localStorage.removeItem(configKey);setClient(null);setMessage('');}}>Změnit projekt</button>
      </form>}
      <p role="status">{message}</p>
      <button className="secondary" onClick={()=>setLocal(true)}>Pokračovat s ukládáním v prohlížeči</button>
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
