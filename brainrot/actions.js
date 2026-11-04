// ===== STEAL A BRAINROT — STEAL, DASH, BANK (actions) =====
function stealBrainrot(from,victim){
  if(!from||!victim||from===victim)return false;
  if(victim.shieldT>0||victim.stealImmuneT>0||from.stealImmuneT>0)return false;
  if(!victim.train.length)return false;
  if(victim.passive('camo')&&Math.random()<0.5){if(from===G.me)toast('Missed! Train camouflaged 🦎','#8f88c0');return false;}
  const b=victim.train.pop();
  from.train.push(b);
  from.stealImmuneT=STEAL_CD;
  victim.stealImmuneT=STEAL_CD;
  burst(victim.x,victim.y,RARITY[b.r].color,26,260);
  if(victim.passive('shield'))victim.shieldT=3;
  if(from===G.me){toast('💀 You stole '+b.n+' off '+victim.name+'!',RARITY[b.r].color);SFX.steal();G.shake=6;}
  else if(victim===G.me){toast('💀 '+from.name+' stole '+b.n+' from you!','#ff4757');SFX.stolen();G.shake=10;}
  buildTrainHud();
  return true;
}
function doDash(p){
  const range=p.passive('teleport')?260:140;
  p.x=clamp(p.x+Math.cos(p.ang)*range,20,5580);
  p.y=clamp(p.y+Math.sin(p.ang)*range,20,4780);
  p.dashCd=p.passive('dash')?2.5:4;
  burst(p.x,p.y,'#54d1ff',20,300,.5);
  SFX.dash();G.shake=4;
  G.players.forEach(function(v){if(v!==p&&dist2(v.x,v.y,p.x,p.y)<50*50)stealBrainrot(p,v);});
}
function tryDash(){
  if(!G)return;
  const p=G.me;
  if(!p.hasDash){toast('Buy DASH at the Speed Shop!','#8f88c0');SFX.deny();return;}
  if(p.dashCd>0)return;
  doDash(p);
}
function bankAnywhere(){
  if(!G)return;
  const p=G.me;
  if(!p.passive('instant')||p.instantUsed){toast('Needs Nest Ninja (Mythic, 1/round)','#8f88c0');SFX.deny();return;}
  p.instantUsed=true;
  while(p.train.length&&p.nest.length<p.nestSlots)p.nest.push(p.train.shift());
  toast('Nest Ninja! Banked from ANYWHERE! 🥷');SFX.nest();buildTrainHud();
}
