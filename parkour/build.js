// Stage layout / obstacle generators
let stageGroup,blocks=[],spins=[],pads=[],movers=[],coins=[],portal=null,flags=[];
function clearStage(){if(stageGroup)scene.remove(stageGroup);blocks=[];spins=[];pads=[];movers=[];coins=[];flags=[];portal=null;}
function addBlock(w,h,d,x,y,z,col,kill){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:col}));m.position.set(x,y,z);m.userData={w:w,h:h,d:d,kill:!!kill};m.castShadow=true;m.receiveShadow=true;stageGroup.add(m);blocks.push(m);return m;}
function addCoin(x,y,z){const m=new THREE.Mesh(new THREE.TorusGeometry(.28,.09,8,16),new THREE.MeshStandardMaterial({color:0xffd93d,emissive:0x8a5b00}));m.position.set(x,y,z);stageGroup.add(m);coins.push({mesh:m,got:false});}
function addPad(x,y,z){const m=new THREE.Mesh(new THREE.CylinderGeometry(.65,.8,.24,16),new THREE.MeshStandardMaterial({color:0x2ed573,emissive:0x07552a}));m.position.set(x,y,z);stageGroup.add(m);pads.push({x:x,y:y,z:z,r:1});}
function addSpinner(x,y,z,len){const m=new THREE.Mesh(new THREE.BoxGeometry(len,.22,.4),new THREE.MeshStandardMaterial({color:0xff4757,emissive:0x660000}));m.position.set(x,y,z);stageGroup.add(m);spins.push({mesh:m,x:x,y:y,z:z,len:len,a:0,spd:2});}
function addFlag(x,y,z){const pole=new THREE.Mesh(new THREE.BoxGeometry(.12,2,.12),new THREE.MeshStandardMaterial({color:0xffffff}));pole.position.set(x,y+1,z);const flag=new THREE.Mesh(new THREE.BoxGeometry(.65,.4,.08),new THREE.MeshStandardMaterial({color:0xff4757}));flag.position.set(x+.35,y+1.7,z);stageGroup.add(pole,flag);flags.push({x:x,y:y,z:z,mesh:flag,active:false});}
function addPortal(x,y,z){const m=new THREE.Mesh(new THREE.TorusGeometry(1,.17,10,28),new THREE.MeshStandardMaterial({color:0x2ed573,emissive:0x087044}));m.position.set(x,y+1,z);stageGroup.add(m);portal={x:x,y:y,z:z,mesh:m};}
function buildStage(idx){
 clearStage();const d=stageDef(idx),theme=WORLDS[d.world].theme;stageGroup=new THREE.Group();scene.add(stageGroup);
 scene.background.setHex(theme.sky);scene.fog.color.setHex(theme.fog);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshLambertMaterial({color:theme.ground}));floor.rotation.x=-Math.PI/2;floor.position.y=-2;stageGroup.add(floor);
 addBlock(6,1,6,0,-.5,0,theme.block);addFlag(1.5,0,-1.5);
 let z=-5.5;const n=8+Math.floor(idx/4)*2;
 for(let i=0;i<n;i++){
  const x=rand(-3.5,3.5),y=Math.sin(i*.9)*d.diff*1.1,g=d.gimmick;
  if(g==='s'&&i%2)addSpinner(x,y+.4,z,3.3);
  if(g==='p'&&i%2)addPad(x,y+.05,z);
  addBlock(g==='n'?1.1:2.7,.6,2.4,x,y-.3,z,theme.block);
  if(i%3===1)addCoin(x,y+1,z-.5);
  if(i===Math.floor(n/2))addFlag(x+1.5,y,z);
  z-=2.8+d.diff*.6;
 }
 const ez=z-1;addBlock(7,1,7,0,1.5,ez,theme.block);addPortal(0,2,ez);
 return {spawn:{x:0,y:.6,z:0}};
}
