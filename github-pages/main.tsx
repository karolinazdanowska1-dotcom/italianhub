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
  const [passwordSetup,setPasswordSetup]=useState(false);
  const [passwordMessage,setPasswordMessage]=useState('');
  const [savingPassword,setSavingPassword]=useState(false);
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
    <Lab cloud={!local} accountActions={closeSettings=><>
      {!local&&<button className="secondary" onClick={()=>{closeSettings();setPasswordMessage('');setPasswordSetup(true);}}>Nastavit heslo</button>}
      <button className="secondary" onClick={()=>{closeSettings();if(local){setReady(false);setLocal(false);}else void client?.auth.signOut();}}>
        {local?'Připojit cloudové ukládání':'Odhlásit se ze Supabase'}
      </button>
    </>}/>
    {!local&&passwordSetup&&<div className="modalBackdrop"><section className="modal" role="dialog" aria-modal="true" aria-label="Nastavit heslo">
      <h2>Nastavit heslo k ITALIAN LAB</h2>
      <p>Pro příští přihlášení použij svůj e-mail a toto heslo. Zvol alespoň 12 znaků.</p>
      <form onSubmit={async event=>{
        event.preventDefault();
        const form=event.currentTarget;
        const fields=new FormData(form);
        const password=String(fields.get('newPassword'));
        if(password!==fields.get('confirmPassword')){setPasswordMessage('Hesla se neshodují.');return;}
        setSavingPassword(true);
        try {
          const {error}=await client!.auth.updateUser({password});
          if(error){setPasswordMessage('Heslo se nepodařilo uložit. '+error.message);return;}
          form.reset();
          setPasswordMessage('Heslo je nastavené. Příště se přihlas e-mailem a tímto heslem.');
        } catch {setPasswordMessage('Heslo se nepodařilo uložit. Zkontroluj připojení.');}
        finally {setSavingPassword(false);}
      }}>
        <label>Nové heslo<input className="answerInput" name="newPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
        <label>Heslo znovu<input className="answerInput" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
        <button className="primary" disabled={savingPassword}>Uložit heslo</button>
        <button className="secondary" type="button" onClick={()=>setPasswordSetup(false)}>Zavřít</button>
      </form>
      <p role="status">{passwordMessage}</p>
    </section></div>}
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
        const fields=new FormData(e.currentTarget);
        const email=String(fields.get('email')).trim(), password=String(fields.get('password'));
        try{
          const {error}=await client.auth.signInWithPassword({email,password});
          setMessage(error?(error.code==='invalid_credentials'?'E-mail nebo heslo nesouhlasí.':error.code==='email_not_confirmed'?'Účet musí nejprve aktivovat správce.':'Přihlášení se nezdařilo. Zkus to znovu.'):'');
        }catch(error){setMessage((error as Error).message);}
      }}>
        <label>E-mail<input className="answerInput" type="email" name="email" autoComplete="username" required /></label>
        <label>Heslo<input className="answerInput" type="password" name="password" autoComplete="current-password" required /></label>
        <button className="primary">Přihlásit se</button>
        <button className="textButton" type="button" onClick={()=>{localStorage.removeItem(configKey);setClient(null);setMessage('');}}>Změnit projekt</button>
      </form>}
      <p role="status">{message}</p>
      <button className="secondary" onClick={()=>setLocal(true)}>Pokračovat s ukládáním v prohlížeči</button>
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
