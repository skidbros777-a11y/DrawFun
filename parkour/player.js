// ===== PARKOUR RUSH — PLAYER (avatar + physics) =====
const AVATAR_COLORS=[0xffd93d,0xff4757,0x2ed573,0x54a0ff,0xa55eea,0xff9ff3,0xffa502,0x00d2d3,0xffffff,0x2f3542];
function makeAvatar(col){
 const g=new THREE.Group();
 const mat=new THREE.MeshLambertMaterial({color:col});
 const skin=new THREE.MeshLambertMaterial({color:0xffd1a3});
 const face=new THREE.MeshBasicMaterial({color:0x1b1b2f});
 const torso=new THREE.Mesh(new THREE.BoxGeometry(.9,.95,.5),mat);
 torso.position.y=1.05;
 g.add(torso);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.62,.6,.62),skin);
 head.position.y=1.85;
 g.add(head);
 const eye1=new THREE.Mesh(new THREE.BoxGeometry(.1,.14,.05),face);
 eye1.position.set(-.13,1.9,.32);
 const eye2=eye1.clone();eye2.position.x=.13;
 const mouth=new THREE.Mesh(new THREE.BoxGeometry(.2,.05,.05),face);
 mouth.position.set(0,1.72,.32);
 g.add(eye1);g.add(eye2);g.add(mouth);
 const armL=new THREE.Mesh(new THREE.BoxGeometry(.24,.8,.24),mat);
 armL.position.set(-.58,1.45,0);
 const armR=armL.clone();armR.position.x=.58;
 g.add(armL);g.add(armR);
 const legL=new THREE.Mesh(new THREE.BoxGeometry(.3,.8,.3),new THREE.MeshLambertMaterial({color:0x2f3542}));
 legL.position.set(-.22,.25,0);
 const legR=legL.clone();legR.position.x=.22;
 g.add(legL);g.add(legR);
 g.userData={armL:armL,armR:armR,legL:legL,legR:legR,runT:0};
 return g;
}
const GRAV=22,JUMP_V=8.5,DBL_V=7.5,SPEED=5.2,SPRINT=7.5;
const P={x:0,y:0,z:0,vx:0,vy:0,vz:0,ay:0,onGround:false,jumps:0,coyote:0,buffer:0,alive:true,spawn:{x:0,y:1,z:0}};
function resetPlayer(x,y,z){
 P.x=x;P.y=y;P.z=z;P.vx=0;P.vy=0;P.vz=0;
 P.jumps=0;P.alive=true;P.coyote=0;P.buffer=0;
}
