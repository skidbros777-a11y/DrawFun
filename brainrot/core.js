// ===== STEAL A BRAINROT — CORE: helpers, SFX, save, input, state =====
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rand=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rand(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const dist2=(ax,ay,bx,by)=>{const dx=ax-bx,dy=ay-by;return dx*dx+dy*dy;};
const TAU=Math.PI*2;

// ---------- audio ----------
let AC=null;
function initAudio(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } if(AC&&AC.state==='suspended')AC.resume(); }
function tone(f,dur,type,vol,slide){
  if(!AC)return; type=type||'sine'; vol=vol||.18;
  const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+dur+.02);
}
function noiseSfx(dur,vol){
  if(!AC)return; dur=dur||.2; vol=vol||.15;
  const t=AC.currentTime,len=Math.floor(AC.sampleRate*dur),buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  const s=AC.createBufferSource();s.buffer=buf;
  const g=AC.createGain();g.gain.value=vol;
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=900;
  s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);
}
const SFX={
  pickup:()=>{tone(520,.09,'sine',.2);tone(780,.12,'sine',.15);},
  coin:()=>{tone(988,.08,'square',.12);tone(1319,.14,'square',.12);},
  hatch:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.14,'triangle',.2),i*90));},
  nest:()=>{tone(660,.1,'triangle',.2);tone(880,.16,'triangle',.2);},
  steal:()=>{tone(300,.18,'sawtooth',.22,-180);noiseSfx(.15,.12);},
  stolen:()=>{tone(220,.3,'sawtooth',.2,-120);},
  alarm:()=>{tone(880,.12,'square',.14);tone(660,.12,'square',.14);},
  dash:()=>{noiseSfx(.18,.18);tone(200,.15,'sawtooth',.12,400);},
  buy:()=>{tone(784,.08,'square',.14);tone(1047,.12,'square',.14);},
  win:()=>{[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.2,'triangle',.22),i*110));},
  lose:()=>{[440,370,311,262].forEach((f,i)=>setTimeout(()=>tone(f,.25,'sawtooth',.16),i*140));},
  deny:()=>tone(160,.15,'square',.16)
};

// ---------- persistence ----------
const SAVE_KEY='stealabrainrot_v1';
let META={tokens:0,owned:['default'],trail:'default',dex:{}};
try{const s=localStorage.getItem(SAVE_KEY);if(s)META=Object.assign(META,JSON.parse(s));}catch(e){}
function saveMeta(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(META));}catch(e){}}

// ---------- input ----------
const keys={};
addEventListener('keydown',function(e){
  keys[e.code]=true;
  if(e.code==='KeyE')interact();
  if(e.code==='KeyX')bankAnywhere();
  if(e.code==='ShiftLeft'||e.code==='ShiftRight')tryDash();
  if(['ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
});
addEventListener('keyup',function(e){keys[e.code]=false;});
const IS_TOUCH=('ontouchstart' in window);
const joy={active:false,dx:0,dy:0};
function setupTouch(){
  const joyEl=$('joy'),k=$('joyK');
  joyEl.addEventListener('touchstart',function(){joy.active=true;},{passive:true});
  joyEl.addEventListener('touchmove',function(e){
    const t=e.touches[0],r=joyEl.getBoundingClientRect();
    let dx=t.clientX-(r.left+60),dy=t.clientY-(r.top+60);
    const m=Math.hypot(dx,dy)||1,c=Math.min(m,40);
    joy.dx=dx/m*c/40;joy.dy=dy/m*c/40;
    k.style.left=(38+joy.dx*36)+'px';k.style.top=(38+joy.dy*36)+'px';
  },{passive:true});
  joyEl.addEventListener('touchend',function(){joy.active=false;joy.dx=0;joy.dy=0;k.style.left='38px';k.style.top='38px';},{passive:true});
  $('btnE').addEventListener('touchstart',function(e){e.preventDefault();interact();});
  $('btnDash').addEventListener('touchstart',function(e){e.preventDefault();tryDash();});
  $('btnX').addEventListener('touchstart',function(e){e.preventDefault();bankAnywhere();});
}

// ---------- state ----------
let G=null;
const BASE_SPEED=260, DEBUFF=0.045, ROUND_TIME=300, HATCH_TIME=3, STEAL_CD=2, TRAIN_GAP=34;

function makePassive(p){
  p.passive=function(pass){return p.train.some(function(b){return b.p===pass;})||p.nest.some(function(b){return b.p===pass;});};
}
function newGame(mode){
  const players=[];
  const teams=(mode==='crew')?[0,0,0,1,1,1]:[0,1,2,3,4,5];
  teams.forEach(function(team,i){
    const p={
      id:i,name:i===0?'YOU':BOT_NAMES[(i-1)%BOT_NAMES.length]+' #'+i,team:team,
      x:2100+(i%3)*90,y:1830+Math.floor(i/3)*90,vx:0,vy:0,ang:0,
      train:[],nest:[],coins:80,score:0,
      nestSlots:6,boots:0,shieldT:0,stealImmuneT:0,dashCd:0,hasDash:false,
      decoys:0,dumbbells:0,instantUsed:false,aiT:0,aiGoal:null,channel:null,
      color:i===0?'#ffd93d':['#ff4757','#2ed573','#54a0ff','#ff9ff3','#ffa502'][i%5],
      bot:i!==0
    };
    makePassive(p); players.push(p);
  });
  G={
    mode:mode,t:ROUND_TIME,golden:mode==='golden',goldenSpawned:false,goldenDone:false,
    players:players,eggs:[],guards:[],parts:[],toasts:[],drops:[],
    me:players[0],shake:0,slowmoT:0,slowmoX:0,slowmoY:0,slowmoSrc:null,
    cam:{x:players[0].x,y:players[0].y}
  };
  ZONES.forEach(function(z){ if(z.guard){
    G.guards.push({zone:z.id,x:z.x+z.w/2,y:z.y+z.h/2,name:z.guard.name,spd:z.guard.spd,
      state:'patrol',target:null,wander:null,ang:0});
  }});
  spawnWave();
  if(G.golden)G.t=90;
  updateHUD();buildTrainHud();
}
function zoneAt(x,y){ return ZONES.find(function(z){return x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h;})||ZONES[0]; }
function scoreNow(p){ return nestVal(p)+carryVal(p); }
function unlockedZones(){ const s=scoreNow(G.me); return ZONES.filter(function(z){return s>=z.unlock;}); }
