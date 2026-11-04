function drawStation(ctx,x,y,label,col){
  ctx.save();
  ctx.translate(x,y);
  ctx.fillStyle=col;
  ctx.fillRect(-38,-38,76,76);
  ctx.fillStyle='#fff';
  ctx.font='900 11px sans-serif';
  ctx.textAlign='center';
  ctx.fillText(label,0,0);
  ctx.restore();
}

function drawWorld(ctx){
  const sc=scoreNow(G.me);
  ZONES.forEach(function(zz){
    ctx.fillStyle=sc>=zz.unlock?zz.col:'#2a2a35';
    ctx.fillRect(zz.x,zz.y,zz.w,zz.h);
    ctx.lineWidth=4;
    ctx.strokeStyle='rgba(255,255,255,0.25)';
    ctx.strokeRect(zz.x,zz.y,zz.w,zz.h);
  });
  drawStation(ctx,2100,1860,'HATCH','#ffdd57');
  drawStation(ctx,2100,1980,'NEST','#ff6b9d');
  drawStation(ctx,1950,1920,'SPEED','#22d3ee');
  drawStation(ctx,2250,1920,'INDEX','#a78bfa');
}

function drawEggs(ctx){
  const now=performance.now()/500;
  G.eggs.forEach(function(e){
    const c=RARITY[e.brainrot.r].color;
    ctx.save();
    ctx.translate(e.x,e.y+Math.sin(now+e.bob)*4);
    ctx.shadowColor=c;
    ctx.shadowBlur=16;
    ctx.fillStyle=e.golden?'#ffd93d':c;
    ctx.beginPath();
    ctx.ellipse(0,0,12,16,0,0,TAU);
    ctx.fill();
    ctx.restore();
  });
}

function drawDrops(ctx){
  const now=performance.now()/300;
  G.drops.forEach(function(d){
    const c=RARITY[d.brainrot.r].color;
    ctx.save();
    ctx.translate(d.x,d.y+Math.sin(now)*3);
    ctx.shadowColor=c;
    ctx.shadowBlur=20;
    ctx.fillStyle=c;
    ctx.beginPath();
    ctx.arc(0,0,10,0,TAU);
    ctx.fill();
    ctx.restore();
  });
}
