// ===== PARKOUR RUSH — COLLISION & OBJECT LOGIC =====
function collide(){
 P.onGround=false;
 if(P.y<=-1.9){P.y=-1.9;P.vy=0;P.onGround=true;}
 for(const b of blocks){
  const u=b.userData;
  const hw=u.w/2+.45,hd=u.d/2+.45;
  if(Math.abs(P.x-b.position.x)<hw&&Math.abs(P.z-b.position.z)<hd){
   const top=b.position.y+u.h/2;
   if(P.y>=top-.65&&P.vy<=0){
    P.y=top;P.vy=0;
    if(!P.wasGround){SFX.land();}
    P.onGround=true;
   }
  }
 }
 P.wasGround=P.onGround;
 for(const s of spins){
  const dx=P.x-s.x,dz=P.z-s.z;
  const dist=Math.hypot(dx,dz);
  const ang=Math.atan2(dz,dx)-s.a;
  const along=Math.abs(Math.cos(ang))*dist;
  if(along<s.len/2&&Math.abs(Math.sin(ang))*dist<.5&&Math.abs(P.y+1-s.y)<1){killPlayer();return;}
 }
 for(const p of pads){
  if(Math.hypot(P.x-p.x,P.z-p.z)<p.r&&P.y<=p.y+.5&&P.vy<=0){
   P.vy=13.5;P.jumps=1;SFX.pad();makeWave(p.x,p.y,p.z,0x2ed573);
  }
 }
 for(const c of coins){
  if(!c.got&&Math.hypot(P.x-c.mesh.position.x,P.z-c.mesh.position.z)<.9&&Math.abs(P.y+1-c.mesh.position.y)<1.4){
   c.got=true;c.mesh.visible=false;window.G.coinGet();
  }
 }
 for(const f of flags){
  if(!f.active&&Math.hypot(P.x-f.x,P.z-f.z)<1.7){
   f.active=true;f.mesh.material.color.setHex(0x2ed573);
   P.spawn={x:f.x,y:f.y+.6,z:f.z};
   SFX.check();toastMsg('CHECKPOINT!','check');
  }
 }
 if(portal&&Math.hypot(P.x-portal.x,P.z-portal.z)<1.1)window.stageWin();
}
function spinnersUpdate(dt){
 for(const s of spins){s.a+=s.spd*dt;s.mesh.rotation.y=s.a;}
 if(portal){portal.mesh.rotation.z+=dt*1.5;}
 for(const c of coins){if(!c.got){c.mesh.rotation.y+=dt*4;}}
}
