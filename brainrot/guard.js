// ===== STEAL A BRAINROT — EGGS, VALUES, PARTICLES, GUARDS =====
function rollRarity(tier){
  const w=TIER_WEIGHTS[Math.min(tier,5)],tot=w.reduce(function(a,b){return a+b;},0);
  let r=Math.random()*tot,i=0;
  for(;i<w.length-1;i++){ r-=w[i]; if(r<=0)break; }
  return ['COMMON','UNCOMMON','RARE','EPIC','LEGENDARY','MYTHIC'][i];
}
function spawnWave(){
  unlockedZones().forEach(function(z){
    const n=z.tier===0?4:(z.tier<=2?3:2);
    for(let i=0;i<n;i++)spawnEgg(z);
  });
}
function spawnEgg(z,forceMythic){
  let b;
  if(z.id==='void'&&Math.random()<0.01) b=pick(BRAINROTS.filter(function(x){return x.r==='SECRET';}));
  else b=pick(BRAINROTS.filter(function(x){return x.r===(forceMythic?'MYTHIC':rollRarity(z.tier));}));
  G.eggs.push({x:z.x+rand(120,z.w-120),y:z.y+rand(120,z.h-120),zone:z.id,brainrot:b,golden:!!forceMythic,taken:false,bob:rand(0,TAU)});
}
function eggValue(b){ const v=RARITY[b.r].value; return ri(v[0],v[1]); }
function nestVal(p){ return p.nest.reduce(function(a,b){return a+eggValue(b)*(b.p==='double'?2:1);},0); }
function carryVal(p){ return p.train.reduce(function(a,b){return a+Math.floor(eggValue(b)*0.5);},0); }

function burst(x,y,col,n,spd,life){
  n=n||18;spd=spd||180;life=life||.6;
  for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(spd*.3,spd);
    G.parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:life,max:life,col:col,sz:rand(2,5)});}
}
function toast(msg,col){G.toasts.push({msg:msg,col:col||'#ffd93d',t:2.2});}
function fmtT(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return m+':'+String(ss).padStart(2,'0');}

function playerSpeed(p){
  let s=BASE_SPEED;
  const dumb=p.dumbbells||0;
  const deb=p.train.length*Math.max(DEBUFF-dumb*0.008,0.01);
  s*=(1-Math.min(deb,0.6));
  s*=(1+p.boots*0.08);
  if(p.passive('spd'))s*=1.06;
  if(p.passive('teleport'))s*=1.03;
  if(p.passive('chase')&&G.guards.some(function(g){return g.target===p;}))s*=1.3;
  if(zoneAt(p.x,p.y).id==='frost')s*=1.1;
  if(G.slowmoT>0&&dist2(p.x,p.y,G.slowmoX,G.slowmoY)<260*260&&p!==G.slowmoSrc)s*=0.6;
  return s;
}

function dropPet(p){
  if(!p.train.length)return null;
  const b=p.train.pop();
  G.drops.push({x:p.x+rand(-30,30),y:p.y+rand(-30,30),brainrot:b,life:25});
  buildTrainHud();
  return b;
}
function guardUpdate(dt){
  G.guards.forEach(function(g){
    const z=ZONES.find(function(zz){return zz.id===g.zone;});
    let thief=null,best=1e18;
    G.players.forEach(function(p){
      if(zoneAt(p.x,p.y).id!==g.zone)return;
      if(p.channel){const d=dist2(p.x,p.y,g.x,g.y);if(d<best){best=d;thief=p;}}
      else if(p.train.length){const d=dist2(p.x,p.y,g.x,g.y);if(d<best&&d<340*340){best=d;thief=p;}}
    });
    if(thief){
      if(thief.passive('stealth')&&Math.random()<0.25){g.state='patrol';g.target=null;}
      else{g.state='chase';g.target=thief;}
    }
    if(g.state==='chase'&&(!g.target||zoneAt(g.target.x,g.target.y).id!==g.zone)){g.state='patrol';g.target=null;}
    let tx,ty;
    if(g.state==='chase'&&g.target){tx=g.target.x;ty=g.target.y;}
    else{
      if(!g.wander||dist2(g.x,g.y,g.wander.x,g.wander.y)<40*40)
        g.wander={x:z.x+rand(100,z.w-100),y:z.y+rand(100,z.h-100)};
      tx=g.wander.x;ty=g.wander.y;
    }
    const d=Math.hypot(tx-g.x,ty-g.y)||1;
    let spd=g.spd*(g.state==='chase'?1.15:0.7);
    if(G.slowmoT>0&&dist2(g.x,g.y,G.slowmoX,G.slowmoY)<260*260)spd*=0.4;
    g.x+=(tx-g.x)/d*spd*dt; g.y+=(ty-g.y)/d*spd*dt;
    g.x=clamp(g.x,z.x+20,z.x+z.w-20); g.y=clamp(g.y,z.y+20,z.y+z.h-20);
    g.ang=Math.atan2(ty-g.y,tx-g.x);
    if(g.state==='chase'&&g.target&&dist2(g.x,g.y,g.target.x,g.target.y)<34*34){
      const t=g.target;
      if(t.train.length&&t.shieldT<=0&&t.stealImmuneT<=0){
        const b=dropPet(t);
        if(b){
          burst(t.x,t.y,RARITY[b.r].color,22,220);
          toast('🚨 '+g.name+' tagged YOU! '+b.n+' dropped!','#ff4757');
          SFX.stolen();G.shake=8;
          if(t.passive('shield'))t.shieldT=3;
          t.stealImmuneT=2;g.state='patrol';g.target=null;
        }
      }
    }
  });
}
