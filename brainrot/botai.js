// ===== STEAL A BRAINROT — BOT AI (rival brains) =====
// Called by playerUpdate() for every bot each frame.
function botThink(p,dt){
  p.aiT-=dt;
  if(p.aiT<=0||!p.aiGoal){
    p.aiT=rand(1.5,4);
    if(p.train.length>=3||(p.train.length>0&&Math.random()<0.35)){
      p.aiGoal={x:2100+rand(-70,70),y:1980+rand(-70,70),act:'nest'};
    }else{
      const zs=unlockedZones();
      const z=Math.random()<0.6?pick(zs):ZONES[0];
      p.aiGoal={x:z.x+rand(150,z.w-150),y:z.y+rand(150,z.h-150),act:'farm'};
    }
  }
  const gx=p.aiGoal.x,gy=p.aiGoal.y;
  const d=Math.hypot(gx-p.x,gy-p.y);
  if(d>24){
    p.aiMove={x:(gx-p.x)/d,y:(gy-p.y)/d};
  }else{
    p.aiMove=null;
    if(p.aiGoal.act==='farm'){
      const near=G.eggs.find(function(e){return !e.taken&&dist2(e.x,e.y,p.x,p.y)<150*150;});
      if(near){
        near.taken=true;
        G.eggs.splice(G.eggs.indexOf(near),1);
        p.train.push(near.brainrot);
        burst(near.x,near.y,RARITY[near.brainrot.r].color,10,120);
      }
    }else{
      while(p.train.length&&p.nest.length<p.nestSlots)p.nest.push(p.train.shift());
    }
    p.aiGoal=null;p.aiT=rand(.3,1);
  }
  if(Math.random()<dt*0.5){
    G.players.forEach(function(v){
      if(v===p)return;
      if(G.mode==='crew'&&v.team===p.team)return;
      if(dist2(p.x,p.y,v.x,v.y)<46*46&&v.train.length)stealBrainrot(p,v);
    });
  }
}
