'use strict';
const TabooCore=(()=>{
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const team=s=>s.turn%s.teams.length,round=s=>Math.floor(s.turn/s.teams.length)+1;
function create(teams,bank){const unique=[...new Map(bank.map(c=>[c.title.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,''),c])).values()];const count=Math.floor(unique.length/teams.length);if(!count)throw Error('Faltan tarjetas');const cards=shuffle(unique);return {version:2,teams,decks:teams.map((_,i)=>cards.slice(i*count,(i+1)*count)),positions:teams.map(()=>0),active:null,turn:0,shown:0,phase:'ready',deadline:null,remaining:null,scores:teams.map(()=>0),history:[],lastRound:null,exhausted:false};}
const current=s=>s.active;
function end(s){s.phase='ended';if(s.positions[team(s)]>=s.decks[team(s)].length){s.exhausted=true;s.lastRound=round(s);}}
function draw(s){const t=team(s);if(s.positions[t]>=s.decks[t].length){s.active=null;end(s);return false;}s.active=s.decks[t][s.positions[t]++];s.shown++;return true;}
function begin(s,now){if(s.phase!=='ready')return false;s.phase='playing';s.deadline=now+90000;s.shown=0;draw(s);return true;}
function expire(s,now){if(s.phase==='playing'&&now>=s.deadline){end(s);return true;}return false;}
function answer(s,result,now){if(expire(s,now)||s.phase!=='playing'||!['hit','pass'].includes(result))return false;const points=result==='hit'?10:0;s.scores[team(s)]+=points;s.history.push({team:team(s),turn:s.turn,title:current(s).title,result,points});draw(s);return true;}
function pause(s,now){if(expire(s,now)||s.phase!=='playing')return false;s.remaining=s.deadline-now;s.phase='paused';return true;}
function resume(s,now){if(s.phase!=='paused')return false;s.deadline=now+s.remaining;s.phase='playing';s.remaining=null;return true;}
function markLast(s){if(s.exhausted)return;s.lastRound=s.lastRound===round(s)?null:round(s);}
function next(s){if(s.phase!=='ended')return false;if((s.turn+1)%s.teams.length===0&&s.lastRound===round(s)){s.phase='finished';s.active=null;return true;}s.turn++;s.phase='ready';s.deadline=null;s.active=null;return true;}
return {create,current,team,round,begin,expire,answer,pause,resume,markLast,next};
})();if(typeof module!=='undefined')module.exports=TabooCore;else window.TabooCore=TabooCore;
