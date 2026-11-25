'use client';
import {downloadBrowserFile} from '../storage';
import {useRef,useState} from 'react';
import {Bookmark,Download,FileText,Plus,Upload,Volume2} from 'lucide-react';
import {phraseExamples,lookupTranslation} from '../lib/learning-content';
import {parseVocabulary,VocabularyEntry} from '../lib/preply';

export function Translation({text,label='Zobrazit český překlad'}:{text:string;label?:string}) {
  if (!text) return null;
  return <details className="translationReveal"><summary>{label}</summary><p lang="cs">{text}</p></details>;
}
export function Examples({examples}:{examples:any[]}) {
  return <div className="exampleList">{examples.map((example,index)=>{
    const item=typeof example==='string'?{it:example.split(' — ')[0],cs:example.split(' — ').slice(1).join(' — ')}:example;
    return <div className="exampleItem" key={index}>
      {item.note&&<span className="exampleNote">{item.note}</span>}
      <p lang="it">{item.it}</p><Translation text={item.cs}/>
    </div>;
  })}</div>;
}
export function PhraseCard({phrase,stored,loaded,onSave,onSpeak,drafts,onDraft,onSubmit}:{phrase:any;stored:boolean;loaded:boolean;onSave:()=>void;onSpeak:()=>void;drafts:any;onDraft:(key:string,value:string)=>void;onSubmit:(text:string)=>void}) {
  const examples=phrase.examples?.length?phrase.examples:phraseExamples[phrase.it]||[{it:phrase.example,cs:''}];
  const prompts=['Přítomnost — něco ze svého života','Minulost — co se stalo nebo jaká byla situace','Budoucnost — plán nebo očekávání','Přání nebo zdvořilý návrh','Otázka nebo krátký dialog','Vlastní situace podle tebe'];
  return <article className="card phrase">
    <div className="row between"><span className="tag">{phrase.topic} · {phrase.level}</span><button className="icon" aria-label={'Poslechnout '+phrase.it} onClick={onSpeak}><Volume2 size={19}/></button></div>
    <h3 lang="it">{phrase.it}</h3><Translation text={phrase.cs}/><p>{phrase.context}</p>
    <details className="examplesDisclosure"><summary>Tři příklady v kontextu</summary><Examples examples={examples}/></details>
    <details className="practiceDisclosure"><summary>Moje procvičení · šest vět</summary>
      <p>Výraz můžeš ponechat ve stejné podobě a změnit čas v okolní větě. U „Figurati!“ například změň situaci, na kterou reaguješ.</p>
      {prompts.map((prompt,index)=>{
        const key='phrase:'+phrase.it+':'+index;
        return <label className="practiceField" key={key}><span>{prompt}</span><textarea disabled={!loaded} rows={2} value={drafts[key]||''} onChange={event=>onDraft(key,event.target.value)} placeholder="La mia frase…"/></label>;
      })}
      <button className="primary" disabled={!loaded||!prompts.some((_,i)=>drafts['phrase:'+phrase.it+':'+i]?.trim())} onClick={()=>onSubmit(prompts.map((prompt,index)=>`${prompt}\n${drafts['phrase:'+phrase.it+':'+index]||'—'}`).join('\n\n'))}>Uložit šest vět ke kontrole</button>
    </details>
    <button className={stored?'saved':'textButton'} disabled={!loaded} onClick={onSave}><Bookmark size={16}/>{stored?'V mojí sbírce':'Uložit k opakování'}</button>
  </article>;
}

export function ReadingNotebook({week,records,loaded,onAdd,onPractice}:{week:any;records:any[];loaded:boolean;onAdd:(entry:VocabularyEntry)=>void;onPractice:()=>void}) {
  const [word,setWord]=useState('');
  const [manual,setManual]=useState('');
  const [notice,setNotice]=useState('');
  const found=lookupTranslation(word,week.reading.glossary);
  const own=records.filter(record=>record.kind==='vocabulary'&&record.body.week===week.id);
  return <section className="card readingNotebook">
    <h3>Můj slovníček ke čtení</h3>
    <p>Označ slovo nebo spojení v textu a použij tlačítko „Zapsat označený výraz“. Můžeš ho také napsat sem.</p>
    <button className="secondary" onClick={()=>{const selection=window.getSelection()?.toString().trim();if(selection&&selection.length<=200){setWord(selection);setManual('');setNotice('')}else setNotice('Nejdřív označ krátký výraz v textu.');}}>Zapsat označený výraz</button>
    <label className="practiceField"><span>Italské slovo nebo spojení</span><input value={word} onChange={event=>{setWord(event.target.value);setManual('');setNotice('')}} placeholder="např. eppure"/></label>
    {found?<Translation key={word} text={found}/>:word.trim()&&<details className="translationReveal"><summary>Doplnit překlad</summary><p>Pro tento výraz zatím nemáme překlad. Můžeš ho doplnit, nebo výraz uložit a požádat o překlad v ChatGPT.</p><input aria-label="Vlastní český překlad" value={manual} onChange={event=>setManual(event.target.value)} placeholder="Český význam (nepovinný)"/></details>}
    <button className="primary" disabled={!loaded||!word.trim()||word.length>200} onClick={()=>{onAdd({it:word.trim(),cs:found||manual.trim()});setNotice('Výraz je ve slovníčku a v kartičkách.');setWord('');setManual('')}}><Plus size={17}/>Uložit výraz</button>
    {notice&&<p className="inlineStatus" role="status">{notice}</p>}
    <div className="notebookEntries">{own.map(record=><div key={record.id}><strong lang="it">{record.body.it}</strong>{record.body.cs?<Translation text={record.body.cs}/>:<p className="muted">Čeká na doplnění překladu v ChatGPT</p>}</div>)}</div>
    {!!own.length&&<button className="textButton" onClick={onPractice}>Procvičit můj slovníček</button>}
  </section>;
}

function VocabularyEditor({words,onChange}:{words:VocabularyEntry[];onChange:(words:VocabularyEntry[])=>void}) {
  return <div className="vocabularyEditor">{words.map((entry,index)=><div className="wordEditor" key={index}>
    <label><span>Italsky</span><input aria-label={'Italsky '+(index+1)} value={entry.it} onChange={event=>onChange(words.map((word,i)=>i===index?{...word,it:event.target.value}:word))}/></label>
    <label><span>Český překlad</span><input aria-label={'Česky '+(index+1)} value={entry.cs} onChange={event=>onChange(words.map((word,i)=>i===index?{...word,cs:event.target.value}:word))}/></label>
    <button className="textButton" aria-label={'Odebrat řádek '+(index+1)} onClick={()=>onChange(words.filter((_,i)=>i!==index))}>Odebrat</button>
  </div>)}<button className="secondary" onClick={()=>onChange([...words,{it:'',cs:''}])}><Plus size={16}/>Přidat řádek</button></div>;
}

function PreplySet({record,loaded,onPractice,onUpdate,onSubmit}:{record:any;loaded:boolean;onPractice:(id:string)=>void;onUpdate:(record:any,words:VocabularyEntry[])=>void;onSubmit:(record:any,text:string)=>void}) {
  const [words,setWords]=useState<VocabularyEntry[]>(record.body.words||[]);
  const [sentence,setSentence]=useState('');
  const [selected,setSelected]=useState(0);
  const list=record.body.words||[];
  const current=list[selected%Math.max(list.length,1)];
  return <article className="card preplySet">
    <div className="row between wrap"><div><h3>{record.body.filename}</h3><p>{new Date(record.body.uploadedAt).toLocaleDateString('cs-CZ')} · {list.length} výrazů</p></div><button className="secondary" onClick={()=>void downloadBrowserFile(record.id,record.body.filename).catch(error=>alert(error.message))}><Download size={16}/>Původní soubor</button></div>
    <div className="row wrap"><button className="primary" disabled={!list.some((word:any)=>word.cs)} onClick={()=>onPractice(record.id)}>Procvičit tuto sadu</button><span className="muted">Kartičky · překlad do italštiny · opakování s rozestupy</span></div>
    <details className="preplyWords"><summary>Slovíčka z lekce · překlady odhalíš kliknutím</summary>{list.map((entry:any,index:number)=><div className="preplyWord" key={index}><strong lang="it">{entry.it}</strong>{entry.cs?<Translation text={entry.cs}/>:<p className="muted">Překlad čeká na doplnění.</p>}</div>)}</details>
    <details><summary>Moje věta ze slovíček učitelky</summary>{current&&<><p>Použij <strong lang="it">{current.it}</strong> v osobní větě.</p><textarea value={sentence} onChange={event=>setSentence(event.target.value)} placeholder="La mia frase…"/><div className="row wrap"><button className="primary" disabled={!loaded||!sentence.trim()} onClick={()=>{onSubmit(record,`Výraz: ${current.it}\nMoje věta: ${sentence}`);setSentence('')}}>Uložit větu ke kontrole</button><button className="secondary" onClick={()=>{setSelected(i=>i+1);setSentence('')}}>Další výraz</button></div></>}</details>
    <details><summary>Upravit rozpoznaná slovíčka</summary><VocabularyEditor words={words} onChange={setWords}/><button className="primary" disabled={!loaded||!words.length||words.some(word=>!word.it.trim())} onClick={()=>onUpdate(record,words)}>Uložit slovíčka</button></details>
  </article>;
}

export function PreplyMaterials({records,loaded,onSaved,onPractice,onUpdate,onSubmit}:{records:any[];loaded:boolean;onSaved:(record:any)=>void;onPractice:(id:string)=>void;onUpdate:(record:any,words:VocabularyEntry[])=>void;onSubmit:(record:any,text:string)=>void}) {
  const [file,setFile]=useState<File|null>(null);
  const [rawText,setRawText]=useState('');
  const [words,setWords]=useState<VocabularyEntry[]>([]);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const picker=useRef<HTMLInputElement>(null);
  async function readFile(value:File|undefined) {
    if (!value) return;
    setNotice('');setFile(null);setWords([]);setRawText('');
    if (/\.doc$/i.test(value.name)) {setNotice('Starší soubor .doc otevři ve Wordu a ulož jako .docx.');return;}
    if (!/\.(docx|txt)$/i.test(value.name)||value.size>5*1024*1024) {setNotice('Vyber Word .docx nebo textový .txt soubor do 5 MB.');return;}
    setBusy(true);
    try {
      let text='';
      let tableText='';
      if (/\.docx$/i.test(value.name)) {
        const mammoth=(await import('mammoth/mammoth.browser')).default;
        const extracted=await mammoth.extractRawText({arrayBuffer:await value.arrayBuffer()});
        text=extracted.value;
        const html=await mammoth.convertToHtml({arrayBuffer:await value.arrayBuffer()});
        const document=new DOMParser().parseFromString(html.value,'text/html');
        const rows=Array.from(document.querySelectorAll('tr')).map(row=>Array.from(row.querySelectorAll('td,th')).map(cell=>cell.textContent?.trim()||'')).filter(cells=>cells.length>=2&&cells[0]);
        if(rows.length) tableText=rows.map(cells=>cells.join('\t')).join('\n');
      } else text=await value.text();
      if (!text.trim()||text.length>100000) throw Error('Soubor musí obsahovat čitelný text do 100 000 znaků. Obrázky se jako slovíčka nenačtou.');
      // Word table cells are separate paragraphs. Pair only obvious consecutive IT/CZ cells.
      const lines=(tableText||text).split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
      const paired:string[]=[];
      for(let i=0;i<lines.length;i++) {
        if (i+1<lines.length && !/[\t;=]|\s[–—-]\s/.test(lines[i]) && /[ěščřžýáíéůúďťň]/i.test(lines[i+1]) && !/[ěščřžůř]/i.test(lines[i])) {paired.push(lines[i]+' — '+lines[i+1]);i++;}
        else paired.push(lines[i]);
      }
      setFile(value);setRawText(text);setWords(parseVocabulary(paired.join('\n')));
    } catch(error:any) {setNotice(error.message||'Dokument se nepodařilo přečíst. Zkus jej znovu uložit ve Wordu jako .docx.');}
    finally {setBusy(false);}
  }
  async function upload() {
    if (!file) return;
    setBusy(true);setNotice('');
    try {
      const data=new FormData();data.append('file',file);data.append('text',rawText);data.append('words',JSON.stringify(words));
      const response=await fetch('/api/preply',{method:'POST',body:data});
      const result:any=await response.json();
      if (!response.ok) throw Error(result.error);
      onSaved(result.record);setFile(null);setWords([]);setRawText('');
      if(picker.current) picker.current.value='';
      setNotice('Podklad je uložený. Můžeš rovnou procvičovat slovíčka.');
    } catch(error:any) {setNotice(error.message||'Uložení se nezdařilo.');}
    finally {setBusy(false);}
  }
  const materials=records.filter(record=>record.kind==='preply');
  return <>
    <section className="card uploadPanel"><Upload size={28}/><h2>Slovíčka z Preply</h2><p>Nahraj Word (.docx) nebo text (.txt). Nejlépe funguje jeden výraz a překlad na řádku, oddělené pomlčkou, tabulátorem nebo středníkem. Po načtení můžeš seznam upravit.</p>
      <label className="filePicker"><span>Vybrat soubor · maximálně 5 MB</span><input ref={picker} type="file" accept=".docx,.doc,.txt" disabled={busy||!loaded} onChange={event=>readFile(event.target.files?.[0])}/></label>
      {busy&&<p role="status">Zpracovávám dokument…</p>}
      {notice&&<p className="inlineStatus" role="status">{notice}</p>}
    </section>
    {file&&<section className="card importPreview"><h3>Zkontroluj načtená slovíčka</h3><p>{file.name} · {words.length} rozpoznaných řádků. Prázdné překlady lze doplnit později přes ChatGPT.</p><VocabularyEditor words={words} onChange={setWords}/><details><summary>Text načtený ze souboru</summary><p className="preserve">{rawText}</p></details><button className="primary" disabled={busy||!words.length||words.some(word=>!word.it.trim())} onClick={upload}>Uložit podklad a vytvořit sadu</button></section>}
    <div className="sectionTitle"><h2>Moje podklady z Preply</h2><span>{materials.length} uložených souborů</span></div>
    {materials.map(record=><PreplySet key={record.id+record.updated} record={record} loaded={loaded} onPractice={onPractice} onUpdate={onUpdate} onSubmit={onSubmit}/>)}
    {!materials.length&&<div className="empty"><FileText size={32}/><p>Po nahrání souboru tu najdeš původní dokument, slovíčka a procvičování.</p></div>}
  </>;
}
