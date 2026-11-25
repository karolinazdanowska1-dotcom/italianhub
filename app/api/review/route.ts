import {getChatGPTUser} from '../../chatgpt-auth';
export async function POST(){if(!await getChatGPTUser())return Response.json({error:'Přihlášení je nutné.'},{status:401});return Response.json({error:'Přímý AI korektor zatím není propojený. Text lze uložit do fronty pro kontrolu v ChatGPT. Automatické hodnocení není aktivní.'},{status:503});}
