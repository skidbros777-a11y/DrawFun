// ===== STEAL A BRAINROT — ACTOR RENDERING (JUICED) =====
function drawPlayer(ctx,p){
  const t=performance.now()/1000;
  ctx.save();
  ctx.translate(p.x,p.y);
  // shadow
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.beginPath();ctx.ellipse(0,13,12,5,0,0,TAU);ctx.fill();
  // immunity blink
  if(p.stealImmuneT>0)ctx.globalAlpha=.5+Math.sin(performance.now()/70)*.25;
  // outer aura ring (bigger with train)
  if(p.train.length){
    ctx.strokeStyle='rgba(255,255,255,.18)';
    ctx.lineWidth=2+Math.sin(t*4)*1;
    ctx.beginPath();ctx.arc(0,0,17+p.train.length*2.2,0,TAU);ctx.stroke();
  }
  // body with squash-stretch bob
  const bob=Math.sin(t*7)*1.5;
  ctx.shadowColor=p.color;ctx.shadowBlur=18;
  ctx.fillStyle=p.color;
  ctx.beginPath();ctx.ellipse(0,bob,13,15,0,0,TAU);ctx.fill();
  // face
  ctx.shadowBlur=0;
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-4.5,bob-3,3.4,0,TAU);ctx.arc(4.5,bob-3,3.4,0,TAU);ctx.fill();
  ctx.fillStyle='#1b1b2f';
  const look=Math.cos(p.ang)*1.6;
  ctx.beginPath();ctx.arc(-4.5+look,bob-3,1.7,0,TAU);ctx.arc(4.5+look,bob-3,1.7,0,TAU);ctx.fill();
  ctx.strokeStyle='#1b1b2f';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.arc(0,bob+3,3.4,0,Math.PI);ctx.stroke();
  ctx.restore();
  // shield bubble
  if(p.shieldT>0){
    ctx.save();
    ctx.strokeStyle='rgba(84,160,255,.9)';
    ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(p.x,p.y,24+Math.sin(t*6)*2,0,TAU);ctx.stroke();
    ctx.strokeStyle='rgba(84,160,255,.35)';
    ctx.lineWidth=7;
    ctx.stroke();
    ctx.restore();
  }
  // name tag
  ctx.fillStyle=p===G.me?'#ffd93d':'rgba(255,255,255,.9)';
  ctx.font='900 12px sans-serif';
  ctx.textAlign='center';
  ctx.fillText(p.name+' ['+p.train.length+']',p.x,p.y-30);
}
function drawTrain(ctx,p){
  const now=performance.now()/300;
  for(let i=0;i<p.train.length;i++){
    const b=p.train[i];
    const ang=p.ang+Math.PI;
    const wob=now-i*0.7;
    const tx=p.x+Math.cos(ang)*30*(i+1)+Math.cos(wob)*4;
    const ty=p.y+Math.sin(ang)*30*(i+1)+Math.sin(wob*1.3)*4;
    const c=RARITY[b.r].color;
    const gl=RARITY[b.r].glow;
    ctx.save();
    ctx.translate(tx,ty);
    // glow halo
    ctx.shadowColor=c;ctx.shadowBlur=gl+Math.sin(now*2+i)*6;
    ctx.fillStyle=c;
    ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();
    // shine
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.beginPath();ctx.arc(-3,-3,2.6,0,TAU);ctx.fill();
    // eyes
    ctx.fillStyle='#1b1b2f';
    ctx.beginPath();ctx.arc(-2.4,1,1.1,0,TAU);ctx.arc(2.4,1,1.1,0,TAU);ctx.fill();
    ctx.restore();
  }
}
function drawGuards(ctx){
  const t=performance.now()/1000;
  G.guards.forEach(function(g){
    const ch=g.state==='chase';
    ctx.save();
    ctx.translate(g.x,g.y);
    ctx.fillStyle='rgba(0,0,0,.3)';
    ctx.beginPath();ctx.ellipse(0,15,15,5,0,0,TAU);ctx.fill();
    if(g.stealImmuneT>0)0;
    const bob=Math.sin(t*8)*2;
    ctx.shadowColor=ch?'#ff4757':'#8395a7';
    ctx.shadowBlur=ch?30+Math.sin(t*10)*10:12;
    ctx.fillStyle=ch?'#c0392b':'#576574';
    ctx.beginPath();ctx.ellipse(0,bob,15,17,0,0,TAU);ctx.fill();
    ctx.shadowBlur=0;
    // angry eyes
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(-5,bob-4,4,0,TAU);ctx.arc(5,bob-4,4,0,TAU);ctx.fill();
    ctx.fillStyle='#c0392b';
    ctx.beginPath();ctx.arc(-5,bob-4,2,0,TAU);ctx.arc(5,bob-4,2,0,TAU);ctx.fill();
    // angry brows
    ctx.strokeStyle='#2f3542';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-9,bob-11);ctx.lineTo(-2,bob-8);ctx.moveTo(9,bob-11);ctx.lineTo(2,bob-8);ctx.stroke();
    ctx.restore();
    // chase laser
    if(ch&&g.target){
      ctx.save();
      ctx.strokeStyle='rgba(255,71,87,.4)';
      ctx.lineWidth=2.5;
      ctx.setLineDash([8,6]);
      ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(g.target.x,g.target.y);ctx.stroke();
      ctx.restore();
    }
    // name
    ctx.fillStyle=ch?'#ff6b81':'rgba(255,255,255,.7)';
    ctx.font='900 11px sans-serif';
    ctx.textAlign='center';
    ctx.fillText((ch?'ALARM! ':'')+g.name,g.x,g.y-28);
  });
}
function drawParts(ctx){
  for(let i=G.parts.length-1;i>=0;i--){
    const q=G.parts[i];
    ctx.save();
    ctx.globalAlpha=Math.max(0,q.life/q.max);
    ctx.shadowColor=q.col;ctx.shadowBlur=8;
    ctx.fillStyle=q.col;
    ctx.beginPath();ctx.arc(q.x,q.y,q.sz,0,TAU);ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha=1;
}
