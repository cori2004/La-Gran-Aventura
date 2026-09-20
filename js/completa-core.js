'use strict';
const ArrangeCore=(()=>{
 const normalize=s=>s.toLocaleLowerCase('es').replace(/[^\p{L}\p{N}]/gu,'');
 const words=text=>text.trim().split(/\s+/);
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function order(text){const tokens=words(text),ids=shuffle(tokens.map((_,i)=>i));if(ids.length>1&&ids.every((id,i)=>id===i))ids.push(ids.shift());return ids;}
 function correct(text,selected){const tokens=words(text);return selected.length===tokens.length&&new Set(selected).size===selected.length&&selected.every((id,i)=>Number.isInteger(id)&&id>=0&&id<tokens.length&&normalize(tokens[id])===normalize(tokens[i]));}
 function round(s){return Math.floor(s.turn/s.teams.length)+1;}
 function team(s){return s.turn%s.teams.length;}
 function create(teams,pool){return {version:2,teams,seconds:120,pool:[...new Set(pool)],queue:shuffle([...new Set(pool)]),current:null,turn:0,phase:'ready',selected:[],tileOrder:[],scores:teams.map(()=>0),history:[],lastRound:null,deadline:null,pausedRemaining:null};}
 function prepare(s){if(!s.queue.length){s.phase='finished';return;}s.current=s.queue.shift();s.phase='ready';s.selected=[];s.tileOrder=[];s.deadline=null;s.pausedRemaining=null;}
 function begin(s,text,now){if(s.phase!=='ready')return false;s.tileOrder=order(text);s.deadline=now+s.seconds*1000;s.phase='playing';return true;}
 function add(s,id,text,now){if(s.phase!=='playing'||now>=s.deadline||s.selected.includes(id)||!Number.isInteger(id)||id<0||id>=words(text).length)return false;s.selected.push(id);return true;}
 function remove(s,id,now){if(s.phase!=='playing'||now>=s.deadline)return false;const index=s.selected.indexOf(id);if(index<0)return false;s.selected.splice(index,1);return true;}
 function finish(s,won){if(s.phase!=='playing')return false;s.phase=won?'won':'timeout';if(won)s.scores[team(s)]+=100;s.history.push({team:team(s),verse:s.current,won,round:round(s)});s.pausedRemaining=null;return true;}
 function check(s,text,now){if(s.phase!=='playing')return 'ignored';if(now>=s.deadline){finish(s,false);return 'timeout';}if(correct(text,s.selected)){finish(s,true);return 'won';}return 'wrong';}
 function markLast(s){s.lastRound=s.lastRound===round(s)?null:round(s);}
 function next(s){if(!['won','timeout'].includes(s.phase))return false;if((s.turn+1)%s.teams.length===0&&(s.lastRound===round(s)||s.queue.length<s.teams.length)){s.phase='finished';return true;}s.turn++;prepare(s);return true;}
 return {normalize,words,shuffle,order,correct,round,team,create,prepare,begin,add,remove,finish,check,markLast,next};
})();if(typeof module!=='undefined')module.exports=ArrangeCore;else window.ArrangeCore=ArrangeCore;