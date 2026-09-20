'use strict';
const WhoCore=(()=>{
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const team=s=>s.turn%s.teams.length,round=s=>Math.floor(s.turn/s.teams.length)+1,current=s=>s.deck[s.turn*5+s.question];
function prepare(s){s.options=shuffle([current(s).speaker,current(s).other]);s.answer=null;}
function create(teams,bank){const size=Math.floor(bank.length/(teams.length*5))*teams.length*5;if(!size)throw Error('Faltan frases');const s={version:1,teams,deck:shuffle(bank.slice()).slice(0,size),turn:0,question:0,phase:'ready',scores:teams.map(()=>0),history:[],lastRound:null,deadline:null,remaining:null};prepare(s);return s;}
function begin(s,now){if(s.phase!=='ready')return false;s.phase='playing';s.deadline=now+20000;return true;}
function answer(s,choice,now){if(s.phase!=='playing')return false;const expired=now>=s.deadline;if(!expired&&!s.options.includes(choice))return false;s.answer=expired?null:choice;const hit=!expired&&choice===current(s).speaker;s.scores[team(s)]+=hit?10:0;s.history.push({team:team(s),turn:s.turn,id:current(s).id,answer:s.answer,result:expired?'timeout':hit?'hit':'miss'});s.phase='feedback';s.revealUntil=now+3500;return true;}
function advance(s,now){if(s.phase!=='feedback'||now<s.revealUntil)return false;if(s.question===4){s.phase='ended';return true;}s.question++;prepare(s);s.phase='playing';s.deadline=now+20000;return true;}
function markLast(s){s.lastRound=s.lastRound===round(s)?null:round(s);}
function next(s){if(s.phase!=='ended')return false;if((s.turn+1)*5===s.deck.length||((s.turn+1)%s.teams.length===0&&s.lastRound===round(s))){s.phase='finished';return true;}s.turn++;s.question=0;s.phase='ready';prepare(s);return true;}
function pause(s,now){if(s.phase!=='playing')return false;if(now>=s.deadline){answer(s,null,now);return false;}s.remaining=s.deadline-now;s.phase='paused';return true;}
function resume(s,now){if(s.phase!=='paused')return false;s.phase='playing';s.deadline=now+s.remaining;return true;}
return {team,round,current,create,begin,answer,advance,markLast,next,pause,resume};
})();if(typeof module!=='undefined')module.exports=WhoCore;else window.WhoCore=WhoCore;
