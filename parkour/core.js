// ===== PARKOUR RUSH — CORE: save, sfx, input =====
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rand=(a,b)=>a+Math.random()*(b-a);
// ---- save ----
const SKEY='parkourrush_v1';
let SAVE={done:{},best:{},coins:{},avatar:0,unlocked:0,muted:false};
try{const s=localStorage.getItem(SKEY);if(s)SAVE=Object.assign(SAVE,JSON.parse(s));}catch(e){}
function persist(){try{localStorage.setItem(SKEY,JSON.stringify(SAVE));}catch(e){}}
// ---- audio ----
let AC=null;
function initAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();}
function tone(f,d,type,v,slide){
 if(!AC||SAVE.muted)return;type=type||'sine';v=v===undefined?.15:v;
 const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();
 o.type=type;o.frequency.setValueAtTime(f,t);
 if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+d);
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);
}
const SFX={
 jump:()=>tone(340,.12,'square',.09,180),
 dbl:()=>tone(460,.12,'square',.09,220),
 land:()=>tone(140,.08,'sine',.12,-40),
 coin:()=>{tone(988,.07,'square',.08);tone(1319,.12,'square',.08);},
 die:()=>{tone(300,.25,'sawtooth',.16,-220);tone(150,.3,'sawtooth',.1,-100);},
 pad:()=>tone(220,.2,'sine',.16,500),
 check:()=>{tone(660,.09,'triangle',.14);tone(880,.14,'triangle',.14);},
 win:()=>{[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.18,'triangle',.16),i*100));},
 tick:()=>tone(1200,.04,'square',.05),
 ui:()=>tone(700,.06,'triangle',.1)
};
// ---- input ----
const keys={};
addEventListener('keydown',e=>{
 keys[e.code]=true;
 if(e.code==='Space')e.preventDefault();
 if(e.code==='KeyR'&&window.G&&window.G.running)restartStage();
 if(e.code==='Escape'&&window.G&&window.G.running)togglePause();
});
addEventListener('keyup',e=>keys[e.code]=false);
const IS_TOUCH='ontouchstart' in window;
const joy={x:0,y:0,on:false};
let camDrag={on:false,x:0,y:0,yaw:0,pitch:-.35};
const input={jump:false,jumpPressed:false};
addEventListener('keydown',e=>{if(e.code==='Space'){input.jump=true;input.jumpPressed=true;}});
addEventListener('keyup',e=>{if(e.code==='Space')input.jump=false;});
addEventListener('mousedown',e=>{if(e.target.closest('#joy,#btnJump'))return;camDrag.on=true;camDrag.x=e.clientX;camDrag.y=e.clientY;});
addEventListener('mousemove',e=>{
 if(!camDrag.on)return;
 camDrag.yaw+=(e.clientX-camDrag.x)*.006;
 camDrag.pitch=clamp(camDrag.pitch+(e.clientY-camDrag.y)*.005,-1.2,.5);
 camDrag.x=e.clientX;camDrag.y=e.clientY;
});
addEventListener('mouseup',()=>camDrag.on=false);
function setupTouch(){
 const j=$('joy'),k=$('joyK');
 j.addEventListener('touchstart',()=>{joy.on=true;},{passive:true});
 j.addEventListener('touchmove',e=>{
  const t=e.touches[0],r=j.getBoundingClientRect();
  let dx=(t.clientX-(r.left+60))/50,dy=(t.clientY-(r.top+60))/50;
  const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m;}
  joy.x=dx;joy.y=dy;
  k.style.left=(38+dx*38)+'px';k.style.top=(38+dy*38)+'px';
 },{passive:true});
 j.addEventListener('touchend',()=>{joy.on=false;joy.x=0;joy.y=0;k.style.left='38px';k.style.top='38px';},{passive:true});
 $('btnJump').addEventListener('touchstart',e=>{e.preventDefault();input.jump=true;input.jumpPressed=true;},{passive:false});
 $('btnJump').addEventListener('touchend',e=>{e.preventDefault();input.jump=false;},{passive:false});
 $('btnRetry').addEventListener('touchstart',e=>{e.preventDefault();restartStage();},{passive:false});
 $('btnPause').addEventListener('touchstart',e=>{e.preventDefault();togglePause();},{passive:false});
 const app=$('app');
 app.addEventListener('touchstart',e=>{if(e.target.closest('#joy,#btnJump,#btnRetry,#btnPause'))return;camDrag.on=true;camDrag.x=e.touches[0].clientX;camDrag.y=e.touches[0].clientY;},{passive:true});
 app.addEventListener('touchmove',e=>{
  if(!camDrag.on)return;
  camDrag.yaw+=(e.touches[0].clientX-camDrag.x)*.008;
  camDrag.pitch=clamp(camDrag.pitch+(e.touches[0].clientY-camDrag.y)*.006,-1.2,.5);
  camDrag.x=e.touches[0].clientX;camDrag.y=e.touches[0].clientY;
 },{passive:true});
 app.addEventListener('touchend',()=>{camDrag.on=false;},{passive:true});
}
