import {getChatGPTUser} from '../../chatgpt-auth';
import {list,put} from '../../../lib/store';
import {validVocabulary} from '../../../lib/preply';
export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Přihlas se přes ChatGPT.'},{status:401});
  return Response.json({records:[...await list(user.userId),...await list('shared','week')]});
}
export async function POST(request:Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Přihlášení je nutné.'},{status:401});
  try {
    const input:any = await request.json();
    if (!['state','writing','answer','vocabulary','preply','study-feedback'].includes(input.kind) || typeof input.id !== 'string' || !input.id || input.id.length>250 || !input.body || JSON.stringify(input.body).length>200000) {
      return Response.json({error:'Neplatná data.'},{status:400});
    }
    if (input.kind==='vocabulary' && !validVocabulary([input.body])) return Response.json({error:'Zkontroluj slovíčko.'},{status:400});
    if (input.kind==='preply') {
      const original=(await list(user.userId,'preply')).find((r:any)=>r.id===user.userId+':'+input.id);
      if (!original || !validVocabulary(input.body.words) || !input.body.words.length) return Response.json({error:'Podklad nebo slovíčka nejsou platná.'},{status:400});
      input.body={...original.body,words:input.body.words};
    }
    await put(user.userId,input.id,input.kind,input.body);
    return Response.json({ok:true});
  } catch {return Response.json({error:'Uložení selhalo.'},{status:500});}
}
