'use strict';(()=>{const $=id=>document.getElementById(id);
const zone=$('zona-personaje'),sprite=$('pato-cajas'),bubble=$('globo-dialogo'),text=$('frase-personaje');
// Original duck pixel illustration, assembled entirely from HTML boxes.
const pixels=new Map();
function box(x,y,w,h,c){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixels.set(i+','+j,c);}
function polygon(points,color){for(let y=0;y<48;y++)for(let x=0;x<48;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [a,b]=points[i],[c,d]=points[j];if((b>y+.5)!==(d>y+.5)&&x+.5<(c-a)*(y+.5-b)/(d-b)+a)inside=!inside;}if(inside)pixels.set(x+','+y,color);}}
const outline='#414e50',white='#fffefa',shadow='#c4d0d2',gold='#eeb446';
// Tiny adventure sword held in the bill.
polygon([[3,2],[5,2],[12,10],[12,13],[9,12],[3,6]],outline);
polygon([[4,3],[10,10],[10,11],[5,7]],'#e9f3f5');box(5,5,1,2,'#aabdbf');
polygon([[9,12],[12,9],[14,11],[11,15]],'#8d6827');box(12,13,2,4,gold);box(13,16,2,2,'#93702c');
// White head, curved neck, rounded belly and upturned tail.
polygon([[16,4],[21,4],[24,7],[25,11],[26,15],[30,18],[35,19],[38,18],[42,15],[44,15],[44,20],[42,24],[43,28],[41,35],[38,39],[33,40],[29,38],[26,40],[21,38],[17,34],[15,29],[16,24],[19,20],[19,17],[16,15],[13,13],[13,9]],outline);
polygon([[16,5],[21,5],[23,8],[24,12],[25,16],[29,19],[34,21],[38,20],[42,17],[43,17],[42,21],[40,24],[42,28],[40,34],[37,38],[33,39],[29,36],[26,39],[21,37],[18,33],[16,29],[17,25],[20,21],[20,17],[17,14],[14,12],[14,9]],white);
polygon([[21,6],[23,9],[24,14],[26,18],[30,21],[34,22],[38,21],[40,19],[40,22],[36,24],[29,23],[24,20],[22,15],[22,10]],shadow);
polygon([[17,27],[18,32],[22,35],[27,37],[29,35],[31,37],[35,38],[39,34],[38,38],[33,39],[29,37],[26,39],[21,37],[18,34],[16,29]],'#d7e0df');
// Wing outline and small feather highlights.
polygon([[25,25],[27,28],[34,29],[37,26],[36,31],[32,34],[27,33],[24,30]],'#c0cdd0');
polygon([[26,25],[28,28],[34,28],[36,27],[35,30],[31,32],[27,31],[25,29]],'#f1f5f3');
box(17,8,2,2,outline);box(17,8,1,1,'#172528');box(20,11,2,1,'#e5eceb');
polygon([[14,10],[16,12],[15,15],[10,15],[9,13],[11,11]],'#9c712a');polygon([[13,11],[15,12],[14,14],[10,14],[11,12]],gold);box(11,12,2,1,'#ffdb6a');
// Independently animated webbed feet.
const fragment=document.createDocumentFragment();pixels.forEach((color,key)=>{const [x,y]=key.split(',').map(Number);const div=document.createElement('div');div.className='pixel';div.style.cssText='left:'+x*4+'px;top:'+y*4+'px;background:'+color;fragment.appendChild(div);});
for(const side of ['left','right']){const leg=document.createElement('div');leg.className='duck-leg '+side;leg.innerHTML='<div class="duck-shin"></div><div class="duck-foot"></div>';fragment.appendChild(leg);}sprite.replaceChildren(fragment);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;try{paused=paused||localStorage.getItem('aventura-motion')==='paused';}catch(_){}
function motion(){if(paused)zone.classList.remove('walking');document.body.classList.toggle('paused',paused);$('motion').textContent=paused?'Activar animaciones':'Pausar animaciones';$('motion').setAttribute('aria-pressed',String(paused));}motion();$('motion').addEventListener('click',()=>{paused=!paused;motion();try{localStorage.setItem('aventura-motion',paused?'paused':'active');}catch(_){}});reduced.addEventListener('change',e=>{paused=e.matches;motion();});
const phrases=['¡Cuac! Toca las palabras en el orden del versículo.','¿Una ficha quedó fuera de lugar? Tócala para devolverla.','Lean el texto que van formando. ¡El equipo puede ayudar!','La referencia les da una pista. ¿Recuerdan cómo empieza?','Primero piensen la frase; después junten las palabras.','¡Cuac! No olviden pulsar Comprobar cuando esté listo.','Las fichas iguales pueden intercambiarse.','Si marcan último turno, todos conservan su oportunidad.'];let phrase=0;let last=0;let raf=0;let pointer={x:-999,y:-999};
function say(line){text.textContent=line;bubble.classList.remove('pop');void bubble.offsetWidth;bubble.classList.add('pop');}
let walkTimer;
function place(x,y){if(innerWidth<=650){const dock=document.getElementById('duck-dock');if(dock){const localX=Math.max(10,Math.min(dock.clientWidth-zone.offsetWidth-10,x));const previous=zone.offsetLeft;sprite.classList.toggle('facing-right',localX>previous);if(!paused&&Math.abs(localX-previous)>3){zone.classList.add('walking');clearTimeout(walkTimer);walkTimer=setTimeout(()=>zone.classList.remove('walking'),950);}zone.style.left=localX+'px';zone.style.top='110px';bubble.style.left=Math.max(8-localX,Math.min(-80,dock.clientWidth-localX-bubble.offsetWidth-8))+'px';return;}}const previousX=zone.offsetLeft;const px=Math.max(8,Math.min(innerWidth-zone.offsetWidth-8,x));const py=Math.max(Math.min(175,innerHeight-zone.offsetHeight-8),Math.min(innerHeight-zone.offsetHeight-8,y));if(!paused&&Math.abs(px-previousX)>3){sprite.classList.toggle('facing-right',px>previousX);zone.classList.add('walking');clearTimeout(walkTimer);walkTimer=setTimeout(()=>zone.classList.remove('walking'),950);}zone.style.left=px+'px';zone.style.top=py+'px';bubble.style.left=Math.max(8-px,Math.min(-170,innerWidth-px-bubble.offsetWidth-8))+'px';}
function home(){place(innerWidth-zone.offsetWidth-24,innerHeight-zone.offsetHeight-18);}home();window.addEventListener('resize',home);
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;pointer={x:e.clientX,y:e.clientY};if(raf)return;raf=requestAnimationFrame(now=>{raf=0;if(paused||document.hidden||document.querySelector('dialog[open]')||now-last<600)return;const r=sprite.getBoundingClientRect();const dx=r.left+r.width/2-pointer.x,dy=r.top+r.height/2-pointer.y;const d=Math.hypot(dx,dy);if(d>150)return;last=now;let x=zone.offsetLeft+dx/(d||1)*220,y=zone.offsetTop+dy/(d||1)*160;if(x<8||x>innerWidth-zone.offsetWidth-8)x=pointer.x<innerWidth/2?innerWidth-zone.offsetWidth-15:10;if(y<175||y>innerHeight-zone.offsetHeight-8)y=pointer.y<innerHeight/2?innerHeight-zone.offsetHeight-15:175;place(x,y);say('¡Cuac! Me hago a un lado para que puedas buscar.');});},{passive:true});
setInterval(()=>{if(paused||document.hidden||document.querySelector('dialog[open]'))return;phrase=(phrase+1)%phrases.length;say(phrases[phrase]);},11000);setInterval(()=>{if(paused||document.hidden||document.querySelector('dialog[open]'))return;zone.classList.add('saltando');setTimeout(()=>zone.classList.remove('saltando'),600);},17000);
// Occasional short walks; no wandering while the class uses a dialog.
setInterval(()=>{if(paused||document.hidden||document.querySelector('dialog[open]'))return;const nextX=zone.offsetLeft+(Math.random()>.5?110:-110);place(nextX,zone.offsetTop);},8000);
window.addEventListener('arrange-result',e=>say(e.detail==='won'?'¡Cuac! ¡El texto quedó perfecto!':e.detail==='timeout'?'Se acabó el tiempo. Aprendamos cómo se ordena.':'Revisen el orden, ¡todavía pueden intentarlo!'));
})();