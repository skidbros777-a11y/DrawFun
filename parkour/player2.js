// PLAYER PHYSICS
function killPlayer(){
 if(!P.alive)return;
 P.alive=false;
 fxBurst(P.x,P.y+1,P.z,AVATAR_COLORS[SAVE.avatar],20);
 doFlash('#ff4757');
 SFX.die();
 G.deaths++;
 $('hudDeaths').textContent=G.deaths;
 setTimeout(function(){
  P.alive=true;P.x=P.spawn.x;P.y=P.spawn.y;P.z=P.spawn.z;
  P.vx=0;P.vy=0;P.vz=0;P.jumps=0;
 },700);
}
function playerUpdate(dt,avatar){
 if(!P.alive)return;
 let ix=0,iz=0;
 if(keys.KeyW||keys.ArrowUp)iz-=1;
 if(keys.KeyS||keys.ArrowDown)iz+=1;
 if(keys.KeyA||keys.ArrowLeft)ix-=1;
 if(keys.KeyD||keys.ArrowRight)ix+=1;
 if(joy.on){ix=joy.x;iz=joy.y;}
 const sprint=(keys.ShiftLeft||keys.ShiftRight)?SPRINT:SPEED;
 const m=Math.hypot(ix,iz);
 let wx=0,wz=0;
 if(m>.01){
  ix/=m;iz/=m;
  const cy=Math.cos(camDrag.yaw),sy=Math.sin(camDrag.yaw);
  wx=ix*cy-iz*sy;wz=ix*sy+iz*cy;
  P.ay=Math.atan2(wx,wz);
 }
 const accel=P.onGround?30:12;
 P.vx+=((wx*sprint)-P.vx)*Math.min(1,accel*dt);
 P.vz+=((wz*sprint)-P.vz)*Math.min(1,accel*dt);
 if(P.onGround){P.coyote=.12;P.jumps=0;}else P.coyote-=dt;
 if(input.jumpPressed){P.buffer=.12;input.jumpPressed=false;}else P.buffer-=dt;
 if(P.buffer>0&&(P.coyote>0||P.jumps<2)){
  P.buffer=0;
  if(P.coyote>0){P.vy=JUMP_V;P.jumps=1;SFX.jump();}
  else{P.vy=DBL_V;P.jumps=2;SFX.dbl();fxBurst(P.x,P.y+.2,P.z,0x54a0ff,10);}
  P.coyote=0;
 }
 P.vy-=GRAV*dt;
 if(!input.jump&&P.vy>3)P.vy=3;
 P.x+=P.vx*dt;P.z+=P.vz*dt;P.y+=P.vy*dt;
 if(P.y<-8)killPlayer();
 avatar.position.set(P.x,P.y,P.z);avatar.rotation.y=P.ay;
 const ud=avatar.userData,spd=Math.hypot(P.vx,P.vz);
 ud.runT+=dt*(1+spd*2.2);
 const sw=Math.sin(ud.runT*6)*(P.onGround?Math.min(spd/5,1)*.8:0);
 ud.legL.rotation.x=sw;ud.legR.rotation.x=-sw;
 ud.armL.rotation.x=-sw;ud.armR.rotation.x=sw;
 if(!P.onGround){ud.armL.rotation.x=-2.6;ud.armR.rotation.x=-2.6;}
}
