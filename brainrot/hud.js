// ===== STEAL A BRAINROT — HUD =====
function updateHUD(){
  const p=G.me;
  $('hudCoins').textContent=p.coins;
  $('hudScore').textContent=scoreNow(p);
  $('hudTrain').textContent=p.train.length;
  $('hudNest').textContent=p.nest.length+'/'+p.nestSlots;
  $('hudTime').textContent=fmtT(Math.max(0,G.t));
}
function buildTrainHud(){
  const el=$('trainHud');
  el.innerHTML='';
  G.me.train.forEach(function(b){
    const d=document.createElement('div');
    d.className='trainDot';
    d.style.background=RARITY[b.r].color;
    d.style.color=RARITY[b.r].color;
    el.appendChild(d);
  });
}
function drawToasts(){
  const box=$('toasts');
  box.innerHTML='';
  G.toasts.forEach(function(t){
    const d=document.createElement('div');
    d.className='toast';
    d.style.borderColor=t.col;
    d.textContent=t.msg;
    box.appendChild(d);
  });
}
