export type VocabularyEntry = {it:string;cs:string;example?:string};
export function parseVocabulary(text:string): VocabularyEntry[] {
  const entries: VocabularyEntry[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const cleaned = line.replace(/^\s*(?:[•*]|\d+[.)])\s*/,'').trim();
    if (!cleaned || cleaned.length > 600) continue;
    const parts = cleaned.split(/\t+|\s+[–—-]\s+|\s*;\s*|\s*=\s*/);
    const it = parts[0]?.trim();
    if (!it || it.length > 200 || /^(italiano|italština|slovíčka|vocaboli)$/i.test(it)) continue;
    const key = it.toLocaleLowerCase('it');
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({it,cs:parts.slice(1).join(' — ').trim()});
    if (entries.length >= 400) break;
  }
  return entries;
}
export function validVocabulary(value:unknown): value is VocabularyEntry[] {
  return Array.isArray(value) && value.length <= 400 && value.every(v =>
    v && typeof v.it === 'string' && v.it.trim().length > 0 && v.it.length <= 200 &&
    typeof v.cs === 'string' && v.cs.length <= 500 &&
    (v.example === undefined || typeof v.example === 'string' && v.example.length <= 1000));
}

export function mergeVocabulary(entries:any[]) {
  const combined=new Map<string,any>();
  for (const entry of entries) {
    const existing=combined.get(entry.it);
    const sources=[...new Set([...(existing?.sources||[]),...(entry.source?[entry.source]:[])])];
    combined.set(entry.it,{...existing,...entry,cs:entry.cs||existing?.cs||'',sources});
  }
  return Array.from(combined.values());
}
