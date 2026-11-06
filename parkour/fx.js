// ===== PARKOUR RUSH — VFX =====
const FX={parts:[],waves:[],pool:null,count:400,head:0};
function initFX(){
 if(FX.pool)return;
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(FX.count*3),3));
 const mat=new THREE.PointsMaterial({size:.35,color:0xffffff,transparent:true,opacity:.9,depthWrite:false});
 FX.pool=new THREE.Points(geo,mat);
 FX.pool.frustumCulled=false;
}
function fxSpawn(x,y,z,col){
 FX.parts.push({i:FX.head,x:x,y:y,z:z,vx:rand(-2,2),vy:rand(2,5),vz:rand(-2,2),life:1,col:col});
 FX.head=(FX.head+1)%FX.count;
}
function fxBurst(x,y,z,col,n){
 n=n||12;
 for(let i=0;i<n;i++)fxSpawn(x+rand(-.3,.3),y+rand(0,.4),z+rand(-.3,.3),col);
}
function fxUpdate(dt){
 const a=FX.pool.geometry.attributes.position.array;
 for(let i=FX.parts.length-1;i>=0;i--){
  const p=FX.parts[i];
  p.life-=dt*1.6;p.vy-=9*dt;
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
  a[p.i*3]=p.x;a[p.i*3+1]=p.y;a[p.i*3+2]=p.z;
  if(p.life<=0){a[p.i*3+1]=-999;FX.parts.splice(i,1);}
 }
 FX.pool.geometry.setDrawRange(0,Math.max(FX.parts.length,1));
 FX.pool.geometry.attributes.position.needsUpdate=true;
}
function makeWave(x,y,z,col){
 const g=new THREE.Mesh(new THREE.RingGeometry(.4,.55,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,side:THREE.DoubleSide}));
 g.rotation.x=-Math.PI/2;g.position.set(x,y+.05,z);
 FX.waves.push(g);window.scene.add(g);
}
function wavesUpdate(dt){
 for(let i=FX.waves.length-1;i>=0;i--){
  const w=FX.waves[i];
  w.scale.x+=dt*3;w.scale.y+=dt*3;
  w.material.opacity-=dt*1.2;
  if(w.material.opacity<=0){scene.remove(w);w.geometry.dispose();w.material.dispose();FX.waves.splice(i,1);}
 }
}
let flashT=0;
function doFlash(col){
 const f=$('flash');
 f.style.background=col;
 f.style.opacity=.5;
 flashT=1;
}
function flashUpdate(dt){
 if(flashT>0){flashT-=dt*2;const f=$('flash');f.style.opacity=Math.max(0,flashT*.5);}
}
function makeClouds(scene){
 const group=new THREE.Group();
 const mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8});
 for(let i=0;i<12;i++){
  const c=new THREE.Group();
  const n=3+Math.floor(Math.random()*3);
  for(let k=0;k<n;k++){
   const b=new THREE.Mesh(new THREE.BoxGeometry(rand(2,4),rand(1,2),rand(2,3)),mat);
   b.position.set(rand(-2,2),rand(-.4,.4),rand(-1.5,1.5));
   c.add(b);
  }
  c.position.set(rand(-60,60),rand(12,26),rand(-60,20));
  c.userData.spd=rand(.3,.8);
  group.add(c);
 }
 scene.add(group);
 return group;
}
function cloudsUpdate(g,dt){
 g.children.forEach(c=>{c.position.x+=c.userData.spd*dt;if(c.position.x>70)c.position.x=-70;});
}
