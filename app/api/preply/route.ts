import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {list,put} from '../../../lib/store';
import {validVocabulary} from '../../../lib/preply';

export async function POST(request:Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Přihlášení je nutné.'},{status:401});
  if (!env.BUCKET) return Response.json({error:'Úložiště souborů není dostupné. Zkus to později.'},{status:503});
  if (Number(request.headers.get('content-length')) > 7*1024*1024) return Response.json({error:'Soubor je příliš velký.'},{status:413});
  try {
    const form = await request.formData();
    const file = form.get('file');
    const rawText = form.get('text');
    const words = JSON.parse(String(form.get('words') || '[]'));
    if (!(file instanceof File) || !/\.(docx|txt)$/i.test(file.name) || file.size > 5*1024*1024 || !file.size) {
      return Response.json({error:'Vyber soubor .docx nebo .txt do 5 MB.'},{status:400});
    }
    if (typeof rawText !== 'string' || !rawText.trim() || rawText.length > 100000 || !validVocabulary(words) || !words.length) {
      return Response.json({error:'Zkontroluj načtený text a seznam slovíček.'},{status:400});
    }
    const id = 'preply:'+crypto.randomUUID();
    const key = user.userId+'/'+id;
    await env.BUCKET.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type || 'application/octet-stream'}});
    const body = {filename:file.name.slice(0,200),fileKey:key,text:rawText,words,uploadedAt:new Date().toISOString()};
    try { await put(user.userId,id,'preply',body); }
    catch(error) { await env.BUCKET.delete(key); throw error; }
    return Response.json({record:{id:user.userId+':'+id,kind:'preply',body}});
  } catch {
    return Response.json({error:'Soubor se nepodařilo uložit. Zkontroluj obsah a zkus to znovu.'},{status:500});
  }
}
export async function GET(request:Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Přihlášení je nutné.'},{status:401});
  const id = new URL(request.url).searchParams.get('id');
  const record = (await list(user.userId,'preply')).find((r:any)=>r.id===id);
  if (!record || !record.body.fileKey?.startsWith(user.userId+'/')) return new Response('Soubor nenalezen.',{status:404});
  const file = await env.BUCKET?.get(record.body.fileKey);
  if (!file) return new Response('Soubor není dostupný.',{status:404});
  return new Response(file.body,{headers:{
    'Content-Type':'application/octet-stream',
    'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(record.body.filename)}`,
    'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'
  }});
}
