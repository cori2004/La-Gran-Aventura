'use strict';
const HangmanCore = (()=>{
 const normalize=s=>s.toLocaleUpperCase('es').replaceAll('Ñ','~').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('~','Ñ').replace(/\s+/g,' ').trim();
 function create(teams,words){const total=Math.floor(words.length/teams.length)*teams.length;if(total<teams.length)throw Error('No hay suficientes palabras para una ronda completa.');return {version:1,teams,deck:words.slice(0,total),turn:0,guesses:[],errors:0,status:'playing',scores:teams.map(()=>0),history:[],lastRound:null};}
 const round=s=>Math.floor(s.turn/s.teams.length)+1;
 const team=s=>s.turn%s.teams.length;
 const target=s=>normalize(s.deck[s.turn].word);
 function guess(s,letter){letter=normalize(letter);if(s.status!=='playing'||!/^[A-ZÑ]$/.test(letter)||s.guesses.includes(letter))return 'ignored';s.guesses.push(letter);const hit=target(s).includes(letter);if(!hit)s.errors++;if([...target(s)].every(c=>c===' '||s.guesses.includes(c))){s.status='won';s.scores[team(s)]+=100;}else if(s.errors>=6)s.status='lost';if(s.status!=='playing')s.history.push({team:team(s),word:s.deck[s.turn].word,reference:s.deck[s.turn].reference,won:s.status==='won',errors:s.errors,round:round(s)});return s.status==='playing'?(hit?'hit':'miss'):s.status;}
 function markLast(s){s.lastRound=s.lastRound===round(s)?null:round(s);}
 function next(s){if(!['won','lost'].includes(s.status))return false;const endRound=(s.turn+1)%s.teams.length===0;if((endRound&&s.lastRound===round(s))||s.turn+1>=s.deck.length){s.status='finished';return true;}s.turn++;s.guesses=[];s.errors=0;s.status='playing';return true;}
 return {normalize,create,round,team,target,guess,markLast,next};
})();
if(typeof module!=='undefined')module.exports=HangmanCore;else window.HangmanCore=HangmanCore;