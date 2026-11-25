'use client';
import {useState} from 'react';
import type {Assessment} from '../lib/assessment';

type TestWeek = {id:string;date:string;assessment?:Assessment};
type Props = {
  week:TestWeek; weeks:TestWeek[]; loaded:boolean; records:any[]; drafts:Record<string,string>;
  onDraft:(id:string,value:string)=>void;
  onWriting:(id:string,value:string,context:string)=>Promise<void>;
  onFeedback:(value:string)=>Promise<void>;
  renderQuiz:(question:Assessment['grammar'][number],id:string)=>React.ReactNode;
};
export default function AssessmentPanel({week,weeks,loaded,records,drafts,onDraft,onWriting,onFeedback,renderQuiz}:Props) {
  const [mode,setMode]=useState('Týdenní test');
  const [notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false);
  const sorted=weeks.filter(item=>item.assessment).sort((a,b)=>b.id.localeCompare(a.id));
  const periods=[...new Set(sorted.map(item=>item.id.slice(0,7)))];
  const latest=sorted[0]?.id.slice(0,7);
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const ready=periods.filter(month=>{
    const [year,number]=month.split('-').map(Number);
    const lastFriday=new Date(Date.UTC(year,number,0));
    lastFriday.setUTCDate(lastFriday.getUTCDate()-(lastFriday.getUTCDay()+2)%7);
    return today>=lastFriday.toISOString().slice(0,10);
  });
  const [chosenMonth,setChosenMonth]=useState('');
  const month=ready.includes(chosenMonth)?chosenMonth:ready[0]||latest||'';
  const displayed=mode==='Týdenní test'?[week].filter(item=>item.assessment):mode==='Opakování'?sorted.filter(item=>item.id<week.id):sorted.filter(item=>item.id.startsWith(month));
  const feedbackId='study-feedback:'+week.id;
  const savedFeedback=records.find(item=>item.kind==='study-feedback'&&item.body.week===week.id);
  const feedback=drafts[feedbackId]??savedFeedback?.body.text??'';
  async function save(action:()=>Promise<void>,message:string) {
    setBusy(true);setNotice('');
    try {await action();setNotice(message);}
    catch {setNotice('Uložení se nezdařilo. Zkus to znovu.');}
    finally {setBusy(false);}
  }
  return <>
    <div className="segmented grammarStages">{['Týdenní test','Opakování','Měsíční test'].map(item=><button key={item} className={mode===item?'selected':''} onClick={()=>{setMode(item);setNotice('')}}>{item}</button>)}</div>
    {mode==='Měsíční test'&&ready.length>0&&<label className="practiceField"><span>Studijní měsíc</span><select value={month} onChange={e=>setChosenMonth(e.target.value)}>{ready.map(value=><option key={value} value={value}>{new Intl.DateTimeFormat('cs-CZ',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'-01T00:00Z'))}</option>)}</select></label>}
    {mode==='Měsíční test'&&!ready.length?<div className="card"><p>Měsíční souhrn se otevře poslední pátek v měsíci. Na konci listopadu zahrne úvodní týden.</p></div>:!displayed.length?<div className="card"><p>{mode==='Opakování'?'Po prvním týdnu tu najdeš testy ze všech předchozích týdnů.':'K tomuto týdnu zatím není k dispozici samostatný test.'}</p></div>:displayed.map(item=>{
      const test=item.assessment!;
      const prefix=mode==='Měsíční test'?'monthly:'+month+':'+item.id:mode==='Opakování'?'review:'+week.id+':'+item.id:'weekly:'+item.id;
      const panels=[['Gramatika',test.grammar],['Slovíčka',test.vocabulary],['Čtení',test.reading.quiz]] as const;
      const writing=records.find(record=>record.kind==='answer'&&record.id.endsWith(':'+prefix+':writing'));
      const renderBody=()=> <>
        {panels.map(([title,questions],section)=><section className="card" key={title}><h3>{title}</h3>{title==='Čtení'&&<p lang="it">{test.reading.text}</p>}{questions.map((question,index)=>renderQuiz(question,prefix+':'+section+':'+index))}</section>)}
        <section className="card"><h3>Psaní</h3><p>{test.writing.prompt}</p><p>{test.writing.criteria}</p>
          <label className="practiceField"><span>Moje odpověď v italštině</span><textarea disabled={!loaded} value={drafts[prefix]??writing?.body.text??''} onChange={event=>onDraft(prefix,event.target.value)}/></label>
          <button className="primary" disabled={!loaded||busy||!drafts[prefix]?.trim()} onClick={()=>save(()=>onWriting(prefix+':writing',drafts[prefix],test.writing.prompt+' '+test.writing.criteria),'Psaní je uložené ke kontrole.')}>Uložit ke kontrole</button>
          {writing?.body.feedback&&<p>Opravu najdeš v sekci Psaní.</p>}
        </section>
      </>;
      return mode==='Týdenní test'?<div className="assessmentGrid" key={prefix}>{renderBody()}</div>:<details className="card assessmentSet" key={prefix}><summary>{item.date} · gramatika, slovíčka, čtení a psaní</summary><div className="assessmentGrid">{renderBody()}</div>{notice&&<p role="status">{notice}</p>}</details>;
    })}
    <section className="card assessmentSet"><h3>Co chceš příští týden víc procvičit?</h3>
      <label className="practiceField"><span>Můj vzkaz k dalšímu balíčku</span><textarea value={feedback} disabled={!loaded} onChange={event=>onDraft(feedbackId,event.target.value)} placeholder="Třeba ještě jeden týden s imperfettem, nebo víc psaní."/></label>
      <button className="primary" disabled={!loaded||busy||!feedback.trim()} onClick={()=>save(()=>onFeedback(feedback.trim()),'Vzkaz je uložený pro další týden.')}>Uložit vzkaz</button>
      {notice&&<p role="status">{notice}</p>}
    </section>
  </>;
}
