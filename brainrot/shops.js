// ===== STEAL A BRAINROT — IN-ROUND SHOPS =====
function nearStation(p){
  if(dist2(p.x,p.y,2100,1980)<8100)return 'nest';
  if(dist2(p.x,p.y,2100,1860)<8100)return 'hatch';
  if(dist2(p.x,p.y,1950,1920)<8100)return 'speed';
  if(dist2(p.x,p.y,2250,1920)<8100)return 'index';
  return null;
}
function openShop(kind){
  const p=G.me;
  let h='<div class="panel"><h1>'+(kind==='speed'?'&#9889; SPEED SHOP':'&#128214; INDEX SHOP')+'</h1>';
  h+='<p>You have <b style="color:#ffd93d">'+p.coins+' coins</b></p>';
  if(kind==='speed'){
    SPEED_SHOP.forEach(function(it){
      let off=(it.id==='dash'&&p.hasDash)||(it.id==='boots'&&p.boots>=it.max);
      h+='<button class="bigbtn" '+(off?'disabled style="opacity:.4"':'onclick="buySpeed(\''+it.id+'\')"')+'>'+it.name+' &mdash; '+it.cost+' coins<br><small style="font-weight:400;font-size:.65rem">'+it.desc+'</small></button>';
    });
    h+='<h2>Dumbbells ('+p.dumbbells+'/5)</h2>';
    h+='<button class="bigbtn" onclick="buyDumb()">Dumbbell &mdash; 50 coins<br><small style="font-weight:400;font-size:.65rem">Each cuts train slowdown by 20% (max 5)</small></button>';
  }else{
    h+='<p>Sell Brainrots from your TRAIN:</p>';
    if(!p.train.length)h+='<p style="color:#8f88c0">Train is empty &mdash; go grab eggs!</p>';
    p.train.forEach(function(b,i){
      h+='<button class="bigbtn" onclick="sellTrain('+i+')">'+b.n+' ('+RARITY[b.r].name+')<br><small style="font-weight:400;font-size:.65rem">Sell for '+eggValue(b)+'</small></button>';
    });
    h+='<h2>Nest Slots ('+p.nestSlots+'/10)</h2>';
    h+='<button class="bigbtn gold" onclick="buySlot()">Expand Nest &mdash; 80 coins</button>';
  }
  h+='<br><button class="bigbtn alt" onclick="closeShop()">CLOSE</button></div>';
  $('shop').innerHTML=h;
  $('shop').classList.remove('hidden');
  G.shopOpen=true;
}
function closeShop(){$('shop').classList.add('hidden');G.shopOpen=false;}
function buySpeed(id){
  const p=G.me;
  const it=SPEED_SHOP.find(function(x){return x.id===id;});
  if(!it)return;
  if(p.coins<it.cost){toast('Not enough coins!','#ff4757');SFX.deny();return;}
  p.coins-=it.cost;SFX.buy();
  if(it.id==='boots')p.boots++;
  if(it.id==='shield')p.shieldT=Math.max(p.shieldT,6);
  if(it.id==='dash')p.hasDash=true;
  if(it.id==='decoy')p.decoys++;
  toast('Bought '+it.name+'!');
  updateHUD();openShop('speed');
}
function sellTrain(i){
  const p=G.me;
  const b=p.train[i];
  if(!b)return;
  p.train.splice(i,1);
  p.coins+=eggValue(b);SFX.coin();
  burst(p.x,p.y,'#ffd93d',14,150);
  toast('Sold '+b.n+'!');
  updateHUD();buildTrainHud();openShop('index');
}
function buyDumb(){
  const p=G.me;
  if(p.dumbbells>=5){toast('Max 5 dumbbells!','#8f88c0');SFX.deny();return;}
  if(p.coins<DUMBELL_COST){toast('Not enough coins!','#ff4757');SFX.deny();return;}
  p.coins-=DUMBELL_COST;p.dumbbells++;SFX.buy();
  toast('Dumbbell! Train debuff reduced!');
  updateHUD();openShop('speed');
}
function buySlot(){
  const p=G.me;
  if(p.nestSlots>=10){toast('Nest MAXED (10)','#8f88c0');SFX.deny();return;}
  if(p.coins<NEST_SLOT_COST){toast('Not enough coins!','#ff4757');SFX.deny();return;}
  p.coins-=NEST_SLOT_COST;p.nestSlots++;SFX.buy();
  toast('Nest expanded to '+p.nestSlots+' slots!');
  updateHUD();openShop('index');
}
