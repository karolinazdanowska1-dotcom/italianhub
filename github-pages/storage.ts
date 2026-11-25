type RecordData = {id:string;kind:string;body:Record<string,unknown>;updated:string;file?:File};

function database():Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('italian-lab-pages',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('records',{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}

async function transaction<T>(mode:IDBTransactionMode, operation:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T> {
  const db=await database();
  try {
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction('records',mode);
      const request=operation(tx.objectStore('records'));
      tx.oncomplete=()=>resolve(request.result);
      tx.onabort=()=>reject(tx.error);
      tx.onerror=()=>reject(tx.error);
    });
  } finally {db.close();}
}

export async function browserApi(path:string,init?:RequestInit):Promise<Response> {
  try {
    if (path==='/api/data' && init?.method==='POST') {
      const {id,kind,body}=JSON.parse(String(init.body));
      const key=':'+id;
      const previous=await transaction<RecordData|undefined>('readonly',store=>store.get(key));
      const record={...previous,id:key,kind,body:{...previous?.body,...body},updated:new Date().toISOString()};
      await transaction('readwrite',store=>store.put(record));
      return Response.json({record});
    }
    if (path==='/api/data') {
      const rows=await transaction<RecordData[]>('readonly',store=>store.getAll());
      return Response.json({records:rows.map(({file,...record})=>record)});
    }
    if (path==='/api/preply' && init?.body instanceof FormData) {
      const form=init.body;
      const file=form.get('file');
      if (!(file instanceof File) || !file.size || file.size>5*1024*1024) throw new Error('Vyber soubor do 5 MB.');
      const id=':preply:'+crypto.randomUUID();
      const record={id,kind:'preply',updated:new Date().toISOString(),body:{
        filename:file.name,text:form.get('text'),words:JSON.parse(String(form.get('words'))),uploadedAt:new Date().toISOString()
      }};
      await transaction('readwrite',store=>store.put({...record,file}));
      return Response.json({record});
    }
    const id=new URL(path,location.origin).searchParams.get('id');
    const record=await transaction<RecordData|undefined>('readonly',store=>store.get(id||''));
    if (record?.file) return new Response(record.file);
    return new Response('Soubor nenalezen.',{status:404});
  } catch(error) {
    return Response.json({error:error instanceof Error?error.message:'Úložiště není dostupné.'},{status:500});
  }
}

export async function downloadBrowserFile(id:string,filename:string) {
  const response=await fetch('/api/preply?id='+encodeURIComponent(id));
  if (!response.ok) throw new Error('Původní soubor není dostupný.');
  const url=URL.createObjectURL(await response.blob());
  const link=document.createElement('a');
  link.href=url;
  link.download=filename;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

// Adapt the shared UI's existing data routes only in the static entry point.
export function enableBrowserStorage(handler=browserApi) {
  const original=window.fetch.bind(window);
  window.fetch=(input,init)=>typeof input==='string' && /^\/api\/(data|preply)(\?|$)/.test(input)
    ? handler(input,init) : original(input,init);
  return ()=>{window.fetch=original;};
}
