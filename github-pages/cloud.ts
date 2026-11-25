import {createClient, type SupabaseClient} from '@supabase/supabase-js';

export function connect(url:string,key:string) {
  const address=new URL(url);
  if (address.protocol!=='https:' || !address.hostname.endsWith('.supabase.co') || address.pathname!=='/' ||
      address.search || address.hash || !key.startsWith('sb_publishable_')) {
    throw new Error('Zadej HTTPS adresu projektu Supabase a veřejný klíč začínající sb_publishable_.');
  }
  return createClient(address.origin,key);
}

export async function cloudApi(client:SupabaseClient,userId:string,path:string,init?:RequestInit):Promise<Response> {
  try {
    const table=client.from('study_records');
    const bucket=client.storage.from('preply-private');
    async function save(id:string,kind:string,body:Record<string,unknown>) {
      const {error}=await table.upsert({user_id:userId,id,kind,body,updated:new Date().toISOString()});
      if(error) throw error;
      return {id,kind,body};
    }
    if(path==='/api/data' && init?.method==='POST') {
      const {id,kind,body}=JSON.parse(String(init.body));
      const key=':'+id;
      const {data,error}=await table.select('body').eq('id',key).maybeSingle();
      if(error) throw error;
      return Response.json({record:await save(key,kind,{...data?.body,...body})});
    }
    if(path==='/api/data') {
      const records=[];
      for(let start=0;;start+=500) {
        const {data,error}=await table.select('id,kind,body,updated').order('id').range(start,start+499);
        if(error) throw error;
        records.push(...data);
        if(data.length<500) break;
      }
      return Response.json({records});
    }
    if(path==='/api/preply' && init?.body instanceof FormData) {
      const form=init.body;
      const file=form.get('file');
      if(!(file instanceof File) || !/\.(docx|txt)$/i.test(file.name) || !file.size || file.size>5242880)
        throw new Error('Vyber soubor .docx nebo .txt do 5 MB.');
      const uuid=crypto.randomUUID();
      const fileKey=userId+'/'+uuid;
      const {error}=await bucket.upload(fileKey,file);
      if(error) throw error;
      try {
        return Response.json({record:await save(':preply:'+uuid,'preply',{
          filename:file.name,fileKey,text:form.get('text'),words:JSON.parse(String(form.get('words'))),
          uploadedAt:new Date().toISOString()
        })});
      } catch(error) {
        await bucket.remove([fileKey]);
        throw error;
      }
    }
    const id=new URL(path,location.origin).searchParams.get('id');
    const {data,error}=await table.select('body').eq('id',id||'').eq('kind','preply').maybeSingle();
    if(error) throw error;
    if(!data?.body.fileKey) return new Response('Soubor nenalezen.',{status:404});
    const downloaded=await bucket.download(data.body.fileKey);
    if(downloaded.error) throw downloaded.error;
    return new Response(downloaded.data);
  } catch(error) {
    return Response.json({error:(error as Error)?.message||'Uložení v Supabase selhalo.'},{status:500});
  }
}
