export type Example = { it: string; cs: string; note?: string };
export const phraseExamples: Record<string, Example[]> = {
  'Me la cavo.': [
    {it:'Con l’italiano me la cavo abbastanza bene.',cs:'Italština mi jde docela dobře.',note:'Přítomný čas · jak ti něco jde'},
    {it:'Ieri me la sono cavata bene al colloquio.',cs:'Včera jsem pohovor zvládla dobře.',note:'Passato prossimo · jak sis poradila'},
    {it:'Se dovessi partire da sola, me la caverei.',cs:'Kdybych měla vyrazit sama, poradila bych si.',note:'Condizionale · hypotetická situace'}
  ],
  'A dire il vero…': [
    {it:'A dire il vero, preferisco i posti tranquilli.',cs:'Popravdě dávám přednost klidným místům.',note:'Přítomnost · vyjádření preference'},
    {it:'A dire il vero, ieri non avevo molta voglia di uscire.',cs:'Popravdě se mi včera moc nechtělo ven.',note:'Imperfetto · nálada v minulosti'},
    {it:'A dire il vero, preferirei rimandare a domani.',cs:'Popravdě bych to raději odložila na zítra.',note:'Condizionale · jemnější návrh'}
  ],
  'Mi sa che…': [
    {it:'Mi sa che oggi arrivo un po’ tardi.',cs:'Asi dnes dorazím trochu pozdě.',note:'Přítomný čas s významem blízké budoucnosti'},
    {it:'Mi sa che ho lasciato il telefono a casa.',cs:'Mám pocit, že jsem nechala telefon doma.',note:'Passato prossimo · odhad o minulosti'},
    {it:'Mi sa che domani dovremo cambiare programma.',cs:'Asi budeme muset zítra změnit program.',note:'Budoucí čas · dovremo'}
  ],
  'Ci sta.': [
    {it:'— Prendiamo un caffè prima? — Sì, ci sta.',cs:'— Dáme si nejdřív kávu? — Jo, to beru.',note:'Přijetí návrhu v přítomnosti'},
    {it:'Hai lavorato fino a tardi ieri? Ci sta che oggi tu sia stanca.',cs:'Pracovala jsi včera dlouho? Je pochopitelné, že jsi dnes unavená.',note:'Ci sta che + congiuntivo · tu sia'},
    {it:'Un weekend al mare ci starebbe proprio bene.',cs:'Víkend u moře by se teď vážně hodil.',note:'Condizionale · ci starebbe; rozšíření stejné vazby'}
  ],
  'Figurati!': [
    {it:'— Grazie per il consiglio! — Figurati, mi fa piacere.',cs:'— Díky za radu! — Není zač, ráda pomůžu.',note:'Poděkování · přítomnost'},
    {it:'— Scusa, ieri mi sono dimenticata di chiamarti. — Figurati!',cs:'— Promiň, včera jsem ti zapomněla zavolat. — To je v pohodě!',note:'Reakce na omluvu · minulost v předchozí větě'},
    {it:'— Ti ringrazierò con una cena. — Ma figurati, non serve!',cs:'— Poděkuju ti za to večeří. — Ale prosím tě, to není potřeba!',note:'Budoucí čas v nabídce · ti ringrazierò'}
  ],
  'Dipende da…': [
    {it:'Dipende da quanto tempo abbiamo.',cs:'Záleží na tom, kolik máme času.',note:'Přítomnost · da + vedlejší věta'},
    {it:'La scelta del ristorante è dipesa dal budget.',cs:'Výběr restaurace závisel na rozpočtu.',note:'Passato prossimo · è dipesa; da + il = dal'},
    {it:'Il risultato dipenderà da come presenteremo l’idea.',cs:'Výsledek bude záviset na tom, jak představíme nápad.',note:'Budoucnost · dipenderà, presenteremo'}
  ],
  'Non vedo l’ora di…': [
    {it:'Non vedo l’ora di tornare in Italia.',cs:'Už se nemůžu dočkat návratu do Itálie.',note:'Přítomnost · di + infinitiv'},
    {it:'Non vedevo l’ora di raccontarti tutto.',cs:'Nemohla jsem se dočkat, až ti všechno povím.',note:'Imperfetto · očekávání v minulosti'},
    {it:'Quando prenoteremo il viaggio, non vedrò l’ora di partire.',cs:'Až si rezervujeme cestu, nebudu se moct dočkat odjezdu.',note:'Budoucnost · prenoteremo, vedrò'}
  ],
  'Come mai…?': [
    {it:'Come mai lavori da casa oggi?',cs:'Jak to, že dnes pracuješ z domova?',note:'Přítomnost · důvod aktuální situace'},
    {it:'Come mai hai scelto proprio questo corso?',cs:'Co tě vedlo k výběru právě tohoto kurzu?',note:'Passato prossimo · uskutečněná volba'},
    {it:'Come mai da piccola volevi vivere in Italia?',cs:'Jak to, že jsi jako malá chtěla žít v Itálii?',note:'Imperfetto · dřívější přání'}
  ],
  'E tu, come la vedi?': [
    {it:'Io preferisco lavorare in un piccolo team. E tu, come la vedi?',cs:'Já raději pracuju v malém týmu. A jak to vidíš ty?',note:'Přítomnost · otázka na názor'},
    {it:'Il cliente ha chiesto una nuova proposta. E tu, come la vedi?',cs:'Klient požádal o nový návrh. A jak to vidíš ty?',note:'Passato prossimo v kontextu; názor se ptáme teď'},
    {it:'Io investirei di più nei contenuti. E tu, come la vedi?',cs:'Já bych víc investovala do obsahu. A jak to vidíš ty?',note:'Condizionale · vlastní návrh před otázkou'}
  ],
  'Alla fine…': [
    {it:'Alla fine ho scelto il cappotto blu.',cs:'Nakonec jsem si vybrala modrý kabát.',note:'Passato prossimo · výsledek rozhodování'},
    {it:'Ogni volta cambiavamo idea, ma alla fine tornavamo nello stesso bar.',cs:'Pokaždé jsme měnili názor, ale nakonec jsme se vraceli do stejného baru.',note:'Imperfetto · opakující se situace'},
    {it:'Vedrai, alla fine troveremo una soluzione.',cs:'Uvidíš, nakonec najdeme řešení.',note:'Budoucnost · vedrai, troveremo'}
  ],
  'A proposito di…': [
    {it:'A proposito di viaggi, dove vai quest’estate?',cs:'Když už je řeč o cestování, kam jedeš letos v létě?',note:'Přítomný čas pro plán'},
    {it:'A proposito di lavoro, com’è andato il colloquio?',cs:'Když už je řeč o práci, jak dopadl pohovor?',note:'Passato prossimo · com’è andato'},
    {it:'A proposito di moda, ti piacerebbe andare a una sfilata?',cs:'Když už je řeč o módě, chtěla bys jít na přehlídku?',note:'Condizionale · ti piacerebbe'}
  ]
};

export const weeklyGrammar = [{
  title:'Passato prossimo × imperfetto', level:'B1',
  explanation:'Tento týden se soustřeď na jeden okruh: jak vyprávět příběh v minulosti. Oba časy můžeš použít v jedné větě. Nejdřív si ujasni, co bylo pozadí a která událost příběh posunula.',
  sections:[
    {title:'Co bylo v tu chvíli v průběhu?',text:'Imperfetto popisuje, co zrovna probíhalo, jaká byla situace nebo jak ses cítila. Děj ukazuješ zevnitř, bez důrazu na začátek a konec. Například cercavo znamená „hledala jsem / právě jsem hledala“. V příběhu to často tvoří pozadí.'},
    {title:'Co se stalo jako konkrétní událost?',text:'Passato prossimo použij pro dokončenou událost, kterou vyprávění posuneš dál. Ho incontrato znamená „potkala jsem“. Může to být krátký okamžik i dlouhá práce, pokud ji podáváš jako uzavřený celek.'},
    {title:'Jak oba časy spojit?',text:'Mentre často uvede právě probíhající děj v imperfettu. Do něj vstoupí konkrétní událost v passato prossimo. Nemusíš ale po mentre vždy použít imperfetto automaticky. Nejdřív se rozhodni podle významu celé situace.'},
    {title:'Zvyk nebo jednorázový výsledek?',text:'Ogni estate andavo popisuje zvyk v minulosti. L’estate scorsa sono andata uvádí konkrétní minulou cestu. Samotná slova ieri nebo per due ore čas neurčují. Rozhoduje, jak děj vyprávíš.'},
    {title:'Malá změna času, jiný pohled',text:'Ero stanca popisuje stav. Ho lavorato otto ore uzavírá osmihodinovou práci jako celek. U delších dějů proto nepřepínej automaticky do imperfetta. Při vyprávění zkus nejdřív jednu větu s pozadím a jednu s událostí.'}
  ],
  examples:[
    {it:'Mentre cercavo un bar, ho incontrato Giulia.',cs:'Zatímco jsem hledala kavárnu, potkala jsem Giulii.',note:'cercavo = probíhající hledání; ho incontrato = konkrétní setkání'},
    {it:'Era una bella giornata e avevo voglia di uscire.',cs:'Byl krásný den a měla jsem chuť jít ven.',note:'era, avevo = popis situace a nálady'},
    {it:'Ho preso un caffè e poi sono tornata a casa.',cs:'Dala jsem si kávu a pak jsem se vrátila domů.',note:'Dvě dokončené události za sebou'},
    {it:'Da piccola andavo al mare ogni estate.',cs:'Jako malá jsem jezdila každé léto k moři.',note:'andavo = opakovaný zvyk'},
    {it:'L’estate scorsa sono andata al mare per una settimana.',cs:'Minulé léto jsem jela na týden k moři.',note:'sono andata = konkrétní uzavřená cesta'},
    {it:'Ieri ho lavorato per otto ore, anche se ero stanca.',cs:'Včera jsem pracovala osm hodin, i když jsem byla unavená.',note:'ho lavorato = uzavřený celek; ero = stav v jeho průběhu'}
  ],
  quiz:[
    {q:'Mentre ___, mi ha chiamato Luca.',options:['cucinavo','ho cucinato','cucino'],answer:0,why:'Vaření bylo právě probíhající pozadí telefonátu. Telefonát vstoupil do rozdělané činnosti.'},
    {q:'Ieri ___ tre e-mail e poi sono uscita.',options:['scrivevo','ho scritto','scrivo'],answer:1,why:'Tři odeslané nebo napsané e-maily tvoří uzavřený celek, po kterém následoval odchod.'},
    {q:'Da bambina ___ molto timida.',options:['sono stata','ero','sono'],answer:1,why:'Popisuješ dřívější vlastnost bez vymezeného začátku a konce.'},
    {q:'Ogni domenica ___ i miei nonni.',options:['visitavo','ho visitato','visito'],answer:0,why:'Ogni domenica v tomto vyprávění označuje pravidelný zvyk v minulosti.'},
    {q:'Ieri ___ per otto ore e poi ho spento il computer.',options:['lavoravo','ho lavorato','lavorerò'],answer:1,why:'Práci uzavíráš jako osmihodinový celek a pokračuješ další dokončenou událostí.'}
  ]
}];

export const readingDictionary: Record<string,string> = {
  'sabato':'sobota / v sobotu','pomeriggio':'odpoledne','sabato pomeriggio':'v sobotu odpoledne',
  'avevo voglia di':'měla jsem chuť / chtělo se mi','voglia':'chuť, přání','uscire':'jít ven',
  'organizzato':'zorganizovala / naplánovala','non avevo organizzato niente':'neměla jsem nic naplánovaného',
  'mentre':'zatímco','cercavo':'hledala jsem','posto':'místo','ho incontrato':'potkala jsem','incontrato':'potkala',
  'collega':'kolegyně / kolega','non vedevo da mesi':'neviděla jsem už měsíce','mesi':'měsíce',
  'ma dai':'ale jdi! / no vážně!','coincidenza':'náhoda','che coincidenza':'to je ale náhoda',
  'ci siamo sedute':'sedly jsme si','sedute':'posazené / sedly (ženský rod množného čísla)',
  'vicino':'blízko','vicino alla libreria':'blízko knihkupectví','libreria':'knihkupectví',
  'all’inizio':'na začátku / zpočátku','parlavamo':'mluvily jsme','lavoro':'práce',
  'le ho chiesto':'zeptala jsem se jí','come si trovava':'jak se jí dařilo / jak se cítila v novém prostředí',
  'quartiere':'čtvrť','nuovo quartiere':'nová čtvrť','mi ha raccontato':'vyprávěla mi',
  'aveva iniziato':'začala (ještě před vyprávěným okamžikem)','corso':'kurz','ceramica':'keramika',
  'a dire il vero':'popravdě','non l’avrei mai immaginato':'to bych si nikdy nepomyslela',
  'immaginato':'představila / pomyslela','la conoscevo':'znala jsem ji','conoscevo':'znala jsem',
  'sempre di corsa':'pořád ve spěchu','di corsa':'ve spěchu','come mai':'jak to, že / proč vlastně',
  'proprio':'právě / zrovna','perché':'protože / proč','guardo':'dívám se','ridendo':'se smíchem',
  'alla fine':'nakonec','siamo rimaste':'zůstaly jsme','rimaste':'zůstaly','quasi':'téměř / skoro',
  'niente di straordinario':'nic mimořádného','straordinario':'mimořádný','eppure':'a přesto',
  'sono tornata':'vrátila jsem se','di buon umore':'v dobré náladě','umore':'nálada',
  'mi sa che':'mám pocit, že / asi','a volte':'někdy','basta':'stačí','una domanda in più':'jedna další otázka',
  'domanda':'otázka','conoscere':'poznat / znát','davvero':'opravdu','qualcuno':'někdo / někoho',
  'avevo':'měla jsem','niente':'nic','ho':'mám / pomocné sloveso pro minulý čas','incontrare':'potkat',
  'vedere':'vidět','sedersi':'sednout si','raccontare':'vyprávět','tornare':'vrátit se',
  'ha detto':'řekla / řekl','detto':'řečeno / řekl','ho chiesto':'zeptala jsem se','chiesto':'zeptala / požádala',
  'caffè':'káva','bar':'kavárna / bar','telefono':'telefon','giornata':'den (jeho průběh)',
  'stanca':'unavená','tranquillo':'klidný','cappotto':'kabát','sfilata':'módní přehlídka'
};

export function lookupTranslation(word:string, glossary:any[] = []) {
  const key = word.toLocaleLowerCase('it').replace(/'/g,'’').replace(/^[\s«»“”.,!?;:]+|[\s«»“”.,!?;:]+$/g,'').trim();
  const entry=glossary.find(([it]:any)=>it.toLocaleLowerCase('it')===key);
  return entry?.[1] || readingDictionary[key] || '';
}
