// ===== PARKOUR RUSH — MAIN GAME LOOP =====
'use strict';
const G={stage:0,deaths:0,coins:0,start:0,running:false,paused:false,world:null,checkpoint:null};
window.G=G;
let scene,camera,renderer,avatar,cloudGroup,prev=performance.now(),cameraShake=0;
function initGame(){
 scene=new THREE.Scene();window.scene=scene;
 camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,300);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 document.querySelector('#app').appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xdff5ff,0x536080,2));
 const sun=new THREE.DirectionalLight(0xfff2d6,2.2);sun.position.set(-8,18,9);sun.castShadow=true;scene.add(sun);
 initFX();scene.add(FX.pool);setupTouch();
 buildStage(0);avatar=makeAvatar(AVATAR_COLORS[SAVE.avatar]||AVATAR_COLORS[0]);scene.add(avatar);
 G.clouds=makeClouds(scene);G.running=false;buildStageGrid();setupButtons();resizeGame();requestAnimationFrame(tick);
}
function resizeGame(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
addEventListener('resize',resizeGame);
function toastMsg(msg,type){const e=$('#toast');if(!e)return;e.textContent=msg;e.style.color=type==='check'?'#67e6b2':'#fff';e.style.opacity='1';setTimeout(()=>e.style.opacity='0',1100)}
function shakeCam(v){cameraShake=Math.max(cameraShake,v||.15)}
function buildStageGrid(){
 const root=$('#stageGrid');root.innerHTML='';
 for(let w=0;w<10;w++){
  const title=document.createElement('div');title.className='wname';title.textContent=(w+1)+'. '+WORLDS[w].name;root.appendChild(title);
  for(let s=0;s<6;s++){
   const idx=w*6+s,b=document.createElement('button');
   b.className='sbtn'+(SAVE.done[idx]?' done':'')+(idx>SAVE.unlocked?' lock':'');
   b.textContent=(s+1)+(SAVE.done[idx]?' ✓':'');
   b.title=SAVE.done[idx]?'Best: '+(SAVE.best[idx]||'--')+'s':'Stage '+(idx+1);
   b.onclick=()=>startStage(idx);root.appendChild(b);
  }
 }
}
function startStage(idx){
 initAudio();G.stage=idx;G.deaths=0;G.coins=0;G.start=performance.now();G.running=true;G.paused=false;
 const spot=buildStage(idx);P.spawn=spot.spawn;resetPlayer(spot.spawn.x,spot.spawn.y,spot.spawn.z);
 P.onGround=false;
 $('#menu').classList.add('hidden');$('#win').classList.add('hidden');$('#pause').classList.add('hidden');
 $('#hud').classList.remove('hidden');$('#touchUI').classList.remove('hidden');
 $('#hudStage').textContent=(Math.floor(idx/6)+1)+'-'+(idx%6+1);$('#hudDeaths').textContent='0';$('#hudCoins').textContent='0';
 $('#banner').textContent=WORLDS[Math.floor(idx/6)].name+'  •  Stage '+(idx+1);$('#banner').style.opacity='1';setTimeout(()=>$('#banner').style.opacity='0',1800);
 G.clouds=makeClouds(scene);sound(660);
}
function restartStage(){if(G.running)startStage(G.stage)}
function togglePause(){if(!G.running)return;G.paused=!G.paused;$('#pause').classList.toggle('hidden',!G.paused)}
function stageWin(){
 if(!G.running)return;G.running=false;SFX.win();fxBurst(P.x,P.y+2,P.z,0xffd93d,45);makeWave(P.x,0,P.z,0xffd93d);
 const t=(performance.now()-G.start)/1000;SAVE.done[G.stage]=true;SAVE.best[G.stage]=Math.min(SAVE.best[G.stage]||999,t);SAVE.unlocked=Math.max(SAVE.unlocked,Math.min(59,G.stage+1));
 SAVE.coins[G.stage]=(SAVE.coins[G.stage]||0)+G.coins;persist();
 $('#winTitle').textContent='STAGE '+(G.stage+1)+' CLEAR!';$('#winTime').textContent=t.toFixed(2)+'s';
 $('#winBest').textContent='Best: '+SAVE.best[G.stage].toFixed(2)+'s';$('#winStats').textContent='Deaths: '+G.deaths+'   •   Coins: '+G.coins;
 $('#win').classList.remove('hidden');$('#hud').classList.add('hidden');$('#touchUI').classList.add('hidden');buildStageGrid();
}
window.stageWin=stageWin;
function setupButtons(){
 $('#btnJump').onclick=()=>{input.jumpPressed=true;input.jump=true;setTimeout(()=>input.jump=false,120)};
 $('#btnResume').onclick=()=>togglePause();$('#btnRestart').onclick=()=>restartStage();
 $('#btnMenu2').onclick=()=>backMenu();$('#btnMenu3').onclick=()=>backMenu();$('#btnNext').onclick=()=>startStage(Math.min(59,G.stage+1));$('#btnReplay').onclick=()=>startStage(G.stage);
 $('#btnFeatsClose').onclick=()=>$('#feats').classList.add('hidden');$('#btnFeats').onclick=()=>$('#feats').classList.remove('hidden');
 $('#btnMute').onclick=()=>{SAVE.muted=!SAVE.muted;$('#btnMute').textContent='Sound: '+(SAVE.muted?'OFF':'ON');if(!SAVE.muted)sound(700)};
 $('#btnAvatar').onclick=()=>{SAVE.avatar=(SAVE.avatar+1)%AVATAR_COLORS.length;if(avatar)avatar.traverse(o=>{if(o.isMesh&&o.material?.color&&o.material.color.getHex()===AVATAR_COLORS[(SAVE.avatar+AVATAR_COLORS.length-1)%AVATAR_COLORS.length])o.material.color.setHex(AVATAR_COLORS[SAVE.avatar])});persist();sound(720)};
 $('#btnReset').onclick=()=>{if(confirm('Reset all stage progress?')){SAVE={done:{},best:{},coins:{},avatar:0,unlocked:0,muted:SAVE.muted};persist();buildStageGrid();}};
}
function backMenu(){G.running=false;$('#pause').classList.add('hidden');$('#win').classList.add('hidden');$('#hud').classList.add('hidden');$('#touchUI').classList.add('hidden');$('#menu').classList.remove('hidden');buildStageGrid()}
G.coinGet=function(){G.coins++;$('#hudCoins').textContent=G.coins;SFX.coin();fxBurst(P.x,P.y+1,P.z,0xffd93d,9)};
function tick(now){
 requestAnimationFrame(tick);const dt=Math.min(.04,(now-prev)/1000||.016);prev=now;
 if(G.running&&!G.paused){
  P.lastVy=P.vy;playerUpdate(dt,avatar);collide();spinnersUpdate(dt);fxUpdate(dt);wavesUpdate(dt);cloudsUpdate(G.clouds,dt);
  const elapsed=(now-G.start)/1000;$('#hudTime').textContent=elapsed.toFixed(1)+'s';
 }
 flashUpdate(dt);
 const yaw=camDrag.yaw,pitch=camDrag.pitch,dist=10;
 const target=new THREE.Vector3(P.x,P.y+1.1,P.z);
 const cx=P.x+Math.sin(yaw)*Math.cos(pitch)*dist,cz=P.z+Math.cos(yaw)*Math.cos(pitch)*dist,cy=P.y+3.5+Math.sin(-pitch)*dist;
 camera.position.lerp(new THREE.Vector3(cx,cy,cz),.14);camera.lookAt(target);
 if(cameraShake>0){camera.position.x+=(Math.random()-.5)*cameraShake;camera.position.y+=(Math.random()-.5)*cameraShake;cameraShake*=.85;}
 if(avatar){const sp=Math.hypot(P.vx,P.vz);avatar.userData.runT+=dt*sp*3;const sw=Math.sin(avatar.userData.runT*6)*Math.min(sp/5,1)*.7;avatar.userData.legL.rotation.x=P.onGround?sw:0;avatar.userData.legR.rotation.x=P.onGround?-sw:0;avatar.userData.armL.rotation.x=P.onGround?-sw:-2.4;avatar.userData.armR.rotation.x=P.onGround?sw:-2.4;}
 renderer.render(scene,camera);
}
function buildFeatures(){$('#featList').innerHTML=FEATURES.map(x=>'<div>✦ '+x+'</div>').join('')}
initGame();buildFeatures();
