export type TestQuestion = { q: string; options: string[]; answer: number; why: string };
export type Assessment = {
  grammar: TestQuestion[];
  vocabulary: TestQuestion[];
  reading: { text: string; quiz: TestQuestion[] };
  writing: { prompt: string; criteria: string };
};

export const firstAssessment: Assessment = {
  grammar: [
    {q:'Mentre ___ il treno, ho visto una vecchia amica.',options:['aspettavo','ho aspettato','aspetterò'],answer:0,why:'Čekání tvoří pozadí, do kterého vstoupilo setkání.'},
    {q:'Ieri ___ il progetto e poi sono uscita.',options:['finivo','ho finito','finirò'],answer:1,why:'Dokončení projektu je uzavřená událost v řadě dějů.'},
    {q:'Da bambina ___ spesso dai nonni.',options:['andrò','sono andata','andavo'],answer:2,why:'Da bambina a spesso tu uvádějí dřívější zvyk.'}
  ],
  vocabulary: [
    {q:'— Grazie per avermi aspettata! — ___',options:['Figurati!','Come mai?','Dipende.'],answer:0,why:'Figurati! přirozeně reaguje na poděkování.'},
    {q:'Chceš jemně říct svůj skutečný názor. Jak začneš?',options:['Alla fine…','A dire il vero…','A proposito di…'],answer:1,why:'A dire il vero znamená „popravdě“.'},
    {q:'— Ieri ho cambiato idea. — ___ hai cambiato idea?',options:['Dipende da','Alla fine','Come mai'],answer:2,why:'Come mai se ptá na důvod.'}
  ],
  reading:{
    text:'Sabato pioveva e non avevo voglia di uscire. Mentre preparavo il pranzo, mi ha chiamato Sara. Voleva andare a una mostra, ma aveva un biglietto in più. «A dire il vero, preferirei restare a casa», le ho detto. Poi mi ha spiegato che la mostra era a dieci minuti a piedi da me. Alla fine ci siamo andate insieme. Dopo la mostra abbiamo preso un caffè e abbiamo parlato dei nostri prossimi viaggi.',
    quiz:[
      {q:'Che cosa faceva la narratrice quando Sara ha chiamato?',options:['Preparava il pranzo.','Prendeva un caffè.','Era già alla mostra.'],answer:0,why:'Sara zavolala, když vypravěčka připravovala oběd.'},
      {q:'Che cosa ha aiutato la narratrice a cambiare idea?',options:['La mostra era lontana.','La mostra era vicino a casa sua.','Sara l’ha invitata a pranzo.'],answer:1,why:'Výstava byla jen deset minut pěšky od jejího bydliště.'}
    ]
  },
  writing:{
    prompt:'Napiš 70–100 slov o dni, kdy se ti nečekaně změnil plán. Popiš, jaká byla situace, co se stalo a jak to nakonec dopadlo.',
    criteria:'Použij imperfetto pro pozadí, passato prossimo pro události a alespoň dvě spojení z týdne, například a dire il vero, mi sa che nebo alla fine.'
  }
};

export function validAssessment(value: unknown): value is Assessment {
  if (!value || typeof value !== 'object') return false;
  const test=value as Assessment;
  const validText=(text:unknown)=>typeof text==='string'&&text.trim().length>0;
  const validQuestions=(questions:unknown)=>Array.isArray(questions)&&questions.length>=2&&questions.every(
    question=>question&&validText(question.q)&&validText(question.why)&&Array.isArray(question.options)&&
    question.options.length>=2&&question.options.every(validText)&&Number.isInteger(question.answer)&&
    question.answer>=0&&question.answer<question.options.length
  );
  return validQuestions(test.grammar)&&validQuestions(test.vocabulary)&&validText(test.reading?.text)&&
    validQuestions(test.reading?.quiz)&&validText(test.writing?.prompt)&&validText(test.writing?.criteria);
}
