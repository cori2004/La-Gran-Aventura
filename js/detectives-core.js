'use strict';
const DetectiveCore=(()=>{
const team=s=>s.turn%s.teams.length,round=s=>Math.floor(s.turn/s.teams.length)+1,current=s=>s.deck[s.turn];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(teams,bank){const deck=[...shuffle(bank.filter(c=>c.priority)),...shuffle(bank.filter(c=>!c.priority))];deck.length=Math.floor(deck.length/teams.length)*teams.length;return {version:1,teams,deck,turn:0,phase:'ready',deadline:null,remaining:null,marks:[false,false,false],scores:teams.map(()=>0),history:[],lastRound:null};}
function begin(s,now){if(s.phase!=='ready')return false;s.phase='playing';s.deadline=now+90000;return true;}
function expire(s,now){if(s.phase==='playing'&&now>=s.deadline){s.phase='waiting';return true;}return false;}
function reveal(s){if(!['playing','waiting'].includes(s.phase))return false;s.phase='review';return true;}
function mark(s,i,value){if(s.phase!=='review'||!Number.isInteger(i)||i<0||i>2)return false;s.marks[i]=!!value;return true;}
function award(s){if(s.phase!=='review')return false;const points=s.marks.filter(Boolean).length*10;s.scores[team(s)]+=points;s.history.push({caseId:current(s).id,team:team(s),points,marks:s.marks.slice()});s.phase='ended';return true;}
function markLast(s){s.lastRound=s.lastRound===round(s)?null:round(s);}
function next(s){if(s.phase!=='ended')return false;if(s.turn+1===s.deck.length||((s.turn+1)%s.teams.length===0&&s.lastRound===round(s))){s.phase='finished';return true;}s.turn++;s.phase='ready';s.marks=[false,false,false];s.deadline=null;return true;}
function pause(s,now){if(expire(s,now)||s.phase!=='playing')return false;s.remaining=s.deadline-now;s.phase='paused';return true;}
function resume(s,now){if(s.phase!=='paused')return false;s.deadline=now+s.remaining;s.phase='playing';return true;}
return {team,round,current,create,begin,expire,reveal,mark,award,markLast,next,pause,resume};
})();if(typeof module!=='undefined')module.exports=DetectiveCore;else window.DetectiveCore=DetectiveCore;
