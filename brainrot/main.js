// ===== STEAL A BRAINROT — MAIN LOOP (JUICED) =====
const baseInteract=interact;
interact=function(){
  if(!G||G.shopOpen)return;
  const st=nearStation(G.me);
  if(st==='speed'){openShop('speed');return;}
  if(st==='index'){openShop('index');return;}
  baseInteract();
};
const cv=$('cv'),ctx=cv.getContext('2d');
let running=false,last=0,eggTimer=0,curZone='',chasedBy=0;
function resize(){cv.width=innerWidth;cv.height=innerHeight;}
addEventListener('resize',resize);resize();

function startRound(mode){
  initAudio();newGame(mode);
  if(G.golden){
    const zs=unlockedZones().slice(-1)[0]||ZONES[0];
    spawnEgg(zs,true);
    toast('A GOLDEN EGG spawned in '+zs.name+'!','#ffd93d');
  }
  $('menu').classList.add('hidden');
  ['hud','zoneBanner','trainHud'].forEach(function(i){$(i).classList.remove('hidden');});
  if(IS_TOUCH){$('joy').classList.remove('hidden');$('btns').classList.remove('hidden');}
  running=true;last=performance.now();
}
function endGame(won){
  running=false;
  const sorted=G.players.slice().sort(function(a,b){return scoreNow(b)-scoreNow(a);});
  const myRank=sorted.indexOf(G.me)+1;
  const tokens=Math.floor(scoreNow(G.me)/50)+(won?50:0);
  META.tokens+=tokens;
  G.me.nest.concat(G.me.train).forEach(function(b){META.dex[b.n]=1;});
  saveMeta();
  let h='';
  sorted.forEach(function(p,i){
    h+='<div class="rankRow'+(p===G.me?' me':'')+'"><span>#'+(i+1)+' '+p.name+'</span><span>'+scoreNow(p)+'</span></div>';
  });
  $('ranks').innerHTML=h;
  $('endTitle').textContent=won?'GOLDEN EGG VICTORY!':(myRank===1?'YOU WIN THE ROUND!':'ROUND OVER!');
  $('tokensEarned').textContent='+'+tokens+' Nest Tokens earned! (Total: '+META.tokens+')';
  $('end').classList.remove('hidden');
  ['hud','zoneBanner','trainHud','joy','btns'].forEach(function(i){$(i).classList.add('hidden');});
  if(won||myRank===1){SFX.win();victoryBurst();}else SFX.lose();
}
function victoryBurst(){
  for(let k=0;k<5;k++){
    setTimeout(function(){
      burst(cv.width/2+(Math.random()-.5)*300,120+Math.random()*300,pick(['#ff4757','#ffa502','#2ed573','#54a0ff','#a55eea','#ff9ff3']),40,320,1.2);
    },k*220);
  }
}
$('mSolo').onclick=function(){startRound('solo');};
$('mCrew').onclick=function(){startRound('crew');};
$('mGolden').onclick=function(){startRound('golden');};
$('btnAgain').onclick=function(){$('end').classList.add('hidden');$('menu').classList.remove('hidden');};

function buildMetaShop(){
  $('tokCount').textContent=META.tokens;
  $('trailShop').innerHTML=TRAILS.map(function(t){
    const own=META.owned.includes(t.id);
    const use=META.trail===t.id;
    return '<div class="card" onclick="pickTrail(\''+t.id+'\')">'+t.name+(use?' (ACTIVE)':'')+'<small>'+(use?'Tap to switch':own?'Tap to use':'Cost '+t.cost+' tokens')+'</small></div>';
  }).join('');
}
function pickTrail(id){
  const t=TRAILS.find(function(x){return x.id===id;});
  if(!t)return;
  if(META.owned.includes(id)){META.trail=id;saveMeta();buildMetaShop();SFX.buy();return;}
  if(META.tokens>=t.cost){META.tokens-=t.cost;META.owned.push(id);META.trail=id;saveMeta();buildMetaShop();SFX.buy();}
  else SFX.deny();
}
buildMetaShop();

function loop(ts){
  requestAnimationFrame(loop);
  if(!running)return;
  const dt=Math.min(.05,(ts-last)/1000);last=ts;
  G.t-=dt;
  if(G.t<=0){endGame(false);return;}
  G.players.forEach(function(p){playerUpdate(p,dt);channelUpdate(p,dt);});
  guardUpdate(dt);
  // chase heartbeat + danger vignette
  chasedBy=G.guards.filter(function(g){return g.target===G.me;}).length;
  if(chasedBy>0){
    G.danger=(G.danger||0)+dt;
    if(G.danger>0.55){G.danger=0;tone(140,.09,'sawtooth',.09);}
  }else G.danger=0;
  eggTimer-=dt;
  if(eggTimer<=0){eggTimer=12;if(G.eggs.length<26)spawnWave();}
  for(let i=G.drops.length-1;i>=0;i--){G.drops[i].life-=dt;if(G.drops[i].life<=0)G.drops.splice(i,1);}
  for(let i=G.parts.length-1;i>=0;i--){
    const q=G.parts[i];
    q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=60*dt;
    if(q.life<=0)G.parts.splice(i,1);
  }
  for(let i=G.toasts.length-1;i>=0;i--){G.toasts[i].t-=dt;if(G.toasts[i].t<=0)G.toasts.splice(i,1);}
  if(G.slowmoT>0)G.slowmoT-=dt;
  const z=zoneAt(G.me.x,G.me.y);
  if(z.id!==curZone){curZone=z.id;toast('Entered '+z.name,'#54d1ff');SFX.alarm();}
  G.cam.x+=(G.me.x-G.cam.x)*.1;
  G.cam.y+=(G.me.y-G.cam.y)*.1;
  // ===== render =====
  ctx.fillStyle='#0d0b14';
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.save();
  const sx=G.shake>0?rand(-G.shake,G.shake):0,sy=G.shake>0?rand(-G.shake,G.shake):0;
  G.shake=Math.max(0,G.shake-40*dt);
  ctx.translate(cv.width/2-G.cam.x+sx,cv.height/2-G.cam.y+sy);
  drawWorld(ctx);
  drawDrops(ctx);
  drawEggs(ctx);
  drawGuards(ctx);
  G.players.forEach(function(p){drawPlayer(ctx,p);drawTrain(ctx,p);});
  drawParts(ctx);
  ctx.restore();
  // dark zone fog
  if(z.id==='cave'||z.id==='void'||z.id==='haunt'){
    ctx.fillStyle='rgba(5,5,25,.6)';
    ctx.fillRect(0,0,cv.width,cv.height);
  }
  // danger vignette when chased
  if(chasedBy>0){
    const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.3,cv.width/2,cv.height/2,cv.height*.75);
    g.addColorStop(0,'rgba(255,0,40,0)');
    g.addColorStop(1,'rgba(255,0,40,.28)');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,cv.width,cv.height);
  }
  $('zoneBanner').textContent=z.name+' — '+z.gimmick;
  drawToasts();updateHUD();
}
requestAnimationFrame(loop);
