// ===== STEAL A BRAINROT — MOVEMENT & CHANNELS =====
function playerUpdate(p,dt){
  if(p.shieldT>0)p.shieldT-=dt;
  if(p.stealImmuneT>0)p.stealImmuneT-=dt;
  if(p.dashCd>0)p.dashCd-=dt;
  let ix=0,iy=0;
  if(!p.bot){
    if(keys.KeyW||keys.ArrowUp)iy-=1;
    if(keys.KeyS||keys.ArrowDown)iy+=1;
    if(keys.KeyA||keys.ArrowLeft)ix-=1;
    if(keys.KeyD||keys.ArrowRight)ix+=1;
    if(joy.active){ix=joy.dx;iy=joy.dy;}
  }else{
    botThink(p,dt);
    if(p.aiMove){ix=p.aiMove.x;iy=p.aiMove.y;}
  }
  const m=Math.hypot(ix,iy);
  if(m>0.01){ix/=m;iy/=m;p.ang=Math.atan2(iy,ix);}
  const spd=playerSpeed(p)*(p.channel?0.35:1);
  p.x=clamp(p.x+ix*spd*dt,20,5580);
  p.y=clamp(p.y+iy*spd*dt,20,4780);
}
function interact(){
  if(!G)return;
  const p=G.me;
  if(p.channel)return;
  const drop=G.drops.find(function(d){return dist2(d.x,d.y,p.x,p.y)<60*60;});
  if(drop){
    G.drops.splice(G.drops.indexOf(drop),1);
    p.train.push(drop.brainrot);
    burst(p.x,p.y,RARITY[drop.brainrot.r].color,14,160);
    SFX.pickup();toast('Picked up '+drop.brainrot.n+'! 🧠');buildTrainHud();
    return;
  }
  const egg=G.eggs.find(function(e){return !e.taken&&dist2(e.x,e.y,p.x,p.y)<60*60;});
  if(egg){startChannel(p,'pickup',2,egg);return;}
  if(dist2(p.x,p.y,2100,1860)<80*80){if(p.train.length)startChannel(p,'hatch',3,null);return;}
  if(dist2(p.x,p.y,2100,1980)<80*80){if(p.train.length)startChannel(p,'nest',0.6,null);return;}
}
function startChannel(p,kind,time,target){
  p.channel={kind:kind,t:0,dur:time,target:target};
  $('channelLbl').textContent=kind==='pickup'?'GRABBING EGG…':(kind==='hatch'?'HATCHING…':'NESTING…');
  $('channel').style.display='block';
}
function channelUpdate(p,dt){
  if(!p.channel)return;
  p.channel.t+=dt;
  $('channelFill').style.width=Math.min(100,p.channel.t/p.channel.dur*100)+'%';
  if(p.channel.t>=p.channel.dur)finishChannel(p);
}
function finishChannel(p){
  const c=p.channel;p.channel=null;$('channel').style.display='none';
  if(c.kind==='pickup'&&c.target&&!c.target.taken){
    c.target.taken=true;
    G.eggs.splice(G.eggs.indexOf(c.target),1);
    p.train.push(c.target.brainrot);
    burst(p.x,p.y,RARITY[c.target.brainrot.r].color,16,200);
    SFX.pickup();buildTrainHud();
    toast('🧠 '+c.target.brainrot.n+' joins your train! ('+RARITY[c.target.brainrot.r].name+')',RARITY[c.target.brainrot.r].color);
    if(c.target.golden){G.goldenDone=true;toast('🥇 GOLDEN EGG SECURED — NEST IT!','#ffd93d');}
  }else if(c.kind==='hatch'){
    p.coins+=10;toast('Hatched! +10 Shell Coins 🪙');SFX.hatch();
  }else if(c.kind==='nest'){
    while(p.train.length&&p.nest.length<p.nestSlots)p.nest.push(p.train.shift());
    SFX.nest();toast('🪺 Nested! Safe forever.');buildTrainHud();
    if(G.golden&&G.goldenDone&&nestVal(G.me)>=500)endGame(true);
  }
}
