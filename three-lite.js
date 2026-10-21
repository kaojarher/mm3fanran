/* three-lite：只實作遊戲用到的 three.js 介面，改用 Canvas 2D 繪製（不需 WebGL，iOS 12 / iPhone 6 可用） */
(function(){
var P=Math.PI,cl=function(v,a,b){return v<a?a:v>b?b:v};
function V3(x,y,z){this.x=x||0;this.y=y||0;this.z=z||0}
V3.prototype={set:function(x,y,z){this.x=x;this.y=y;this.z=z;return this},clone:function(){return new V3(this.x,this.y,this.z)},copy:function(v){this.x=v.x;this.y=v.y;this.z=v.z;return this},
addScaledVector:function(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}};
function V2(x,y){this.x=x||0;this.y=y||0}V2.prototype.set=function(x,y){this.x=x;this.y=y;return this};
function Q(){this.x=0;this.y=0;this.z=0;this.w=1}
Q.prototype={identity:function(){this.x=this.y=this.z=0;this.w=1;return this},copy:function(q){this.x=q.x;this.y=q.y;this.z=q.z;this.w=q.w;return this},
setFromAxisAngle:function(a,t){var s=Math.sin(t/2);this.x=a.x*s;this.y=a.y*s;this.z=a.z*s;this.w=Math.cos(t/2);return this},
multiply:function(b){var a=this,x=a.x*b.w+a.w*b.x+a.y*b.z-a.z*b.y,y=a.y*b.w+a.w*b.y+a.z*b.x-a.x*b.z,z=a.z*b.w+a.w*b.z+a.x*b.y-a.y*b.x,w=a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z;a.x=x;a.y=y;a.z=z;a.w=w;return a},
rot:function(v,inv){var s=inv?-1:1,qx=this.x*s,qy=this.y*s,qz=this.z*s,qw=this.w,ix=qw*v.x+qy*v.z-qz*v.y,iy=qw*v.y+qz*v.x-qx*v.z,iz=qw*v.z+qx*v.y-qy*v.x,iw=-qx*v.x-qy*v.y-qz*v.z;
return new V3(ix*qw+iw*-qx+iy*-qz-iz*-qy,iy*qw+iw*-qy+iz*-qx-ix*-qz,iz*qw+iw*-qz+ix*-qy-iy*-qx)}};
function Col(v){var r=0,g=0,b=0;if(typeof v==='number'){r=v>>16&255;g=v>>8&255;b=v&255}else if(typeof v==='string'&&v[0]==='#'){var h=v.length===4?v.replace(/#(.)(.)(.)/,'#$1$1$2$2$3$3'):v;r=parseInt(h.substr(1,2),16);g=parseInt(h.substr(3,2),16);b=parseInt(h.substr(5,2),16)}
this.r=r/255;this.g=g/255;this.b=b/255;this.R=r;this.G=g;this.B=b}
function O3(){this.position=new V3();this.quaternion=new Q();this.rotation={x:0,y:0,z:0,order:'XYZ'};this.scale=new V3(1,1,1);this.visible=true;this.userData={};this.children=[];this.parent=null}
O3.prototype.add=function(){for(var i=0;i<arguments.length;i++){var c=arguments[i];c.parent=this;this.children.push(c)}return this};
O3.prototype.remove=function(c){var i=this.children.indexOf(c);if(i>=0)this.children.splice(i,1);c.parent=null};
O3.prototype.worldToLocal=function(p){return this.quaternion.rot(p,true)};
function Grp(){O3.call(this)}Grp.prototype=Object.create(O3.prototype);
function Msh(g,m){O3.call(this);this.geometry=g;this.material=m;this.isMesh=true}Msh.prototype=Object.create(O3.prototype);
function Spr(m){O3.call(this);this.material=m;this.isSprite=true}Spr.prototype=Object.create(O3.prototype);
function Tex(c){this.image=c;this.repeat=new V2();this.repeat.set=function(){return this}}
function Geo(t,o){this.type=t;this.attributes={position:{count:1,getX:function(){return 0},getY:function(){return 0},getZ:function(){return 0}}};for(var k in o)this[k]=o[k]}
Geo.prototype.rotateX=function(r){this.rotX=r;return this};Geo.prototype.setAttribute=function(n,a){this.attributes[n]=a};
var T={Vector3:V3,Vector2:V2,Quaternion:Q,Color:Col,Group:Grp,Mesh:Msh,Sprite:Spr,Scene:function(){O3.call(this);this.background=new Col(0);this.fog=null},
PerspectiveCamera:function(fov){O3.call(this);this.fov=fov;this.aspect=1;this.updateProjectionMatrix=function(){}},
AmbientLight:function(){this.intensity=1},PointLight:function(){this.intensity=1;this.position=new V3()},
SpriteMaterial:function(o){this.map=o.map},MeshLambertMaterial:function(o){for(var k in o)this[k]=o[k]},
BoxGeometry:function(){return new Geo('box')},PlaneGeometry:function(w,h){return new Geo('plane',{w:w,h:h})},SphereGeometry:function(r){return new Geo('sphere',{radius:r})},
Float32BufferAttribute:function(a){this.array=a;this.count=a.length/3},CanvasTexture:Tex,Fog:function(c,n,f){this.color=new Col(c);this.near=n;this.far=f},
NearestFilter:1,RepeatWrapping:2};
T.Scene.prototype=Object.create(O3.prototype);T.PerspectiveCamera.prototype=Object.create(O3.prototype);
var col2=function(c){return 'rgb('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+')'};
function sample(t){if(t._c)return t._c;try{var d=t.image.getContext('2d').getImageData(2,2,1,1).data;t._c=[d[0],d[1],d[2]]}catch(e){t._c=[90,90,90]}return t._c}
function matCol(m){if(m.map)return sample(m.map);var c=new Col(m.color||0);return [c.R,c.G,c.B]}
/* 相機：世界座標 → 相機座標（x 右、y 上、-z 前） */
function camOf(cam){var cy=Math.cos(cam.rotation.y),sy=Math.sin(cam.rotation.y),cx=Math.cos(cam.rotation.x),sx=Math.sin(cam.rotation.x),p=cam.position;
return function(x,y,z){x-=p.x;y-=p.y;z-=p.z;var a=x*cy-z*sy,b=x*sy+z*cy;return [a,y*cx-b*sx,y*sx+b*cx]}}
function pre(w){if(w._p&&w._n===w.children.length)return w._p;var p={fl:null,ce:null,sp:null,walls:[]};
w.children.forEach(function(o){if(!o.isMesh)return;var t=o.geometry.type;if(t==='plane'){if(o.geometry.rotX<0)p.fl=matCol(o.material);else p.ce=matCol(o.material)}
else if(t==='sphere'){var a=o.geometry.attributes.color,s=[0,0,0],n=0;if(a)for(var i=0;i<Math.min(a.array.length,300);i+=3){s[0]+=a.array[i];s[1]+=a.array[i+1];s[2]+=a.array[i+2];n++}p.sp={r:o.geometry.radius,c:n?[s[0]/n*255,s[1]/n*255,s[2]/n*255]:[90,140,60]}}
else if(t==='box')p.walls.push({x:o.position.x,y:o.position.y,z:o.position.z,c:matCol(o.material),t:o.material.map})});
w._p=p;w._n=w.children.length;return p}
function Rend(o){this.domElement=o.canvas;this.ctx=o.canvas.getContext('2d');this.pr=1;this.cw=300;this.ch=300;this.lastCam=null}
Rend.prototype.setPixelRatio=function(r){this.pr=Math.min(r,1.5)};
Rend.prototype.setSize=function(w,h){this.cw=w;this.ch=h;this.domElement.width=Math.round(w*this.pr);this.domElement.height=Math.round(h*this.pr)};
Rend.prototype.render=function(scene,cam){var c=this.ctx,W=this.domElement.width,H=this.domElement.height,k=this.pr,f=H/2/Math.tan(cam.fov*P/360),mx=W/2,my=H/2,fog=scene.fog,bg=scene.background,fc=[bg.R,bg.G,bg.B];
var world=null;for(var i=0;i<scene.children.length;i++)if(scene.children[i] instanceof Grp)world=scene.children[i];
c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle=col2(fc);c.fillRect(0,0,W,H);if(!world)return;
var pr=pre(world),to=camOf(cam),q=world.quaternion,cp=cam.position,list=[],near=fog?fog.near:1,far=fog?fog.far:20;
var fg=function(d){return fog?cl((d-near)/(far-near),0,1):0};
/* 地面與天空 */
if(pr.sp){var D=Math.sqrt(cp.x*cp.x+cp.y*cp.y+cp.z*cp.z),al=Math.asin(Math.min(.999,pr.sp.r/D)),kk=Math.cos(al),cc=to(0,0,0),m=Math.sqrt(cc[0]*cc[0]+cc[1]*cc[1]+cc[2]*cc[2]);cc=[cc[0]/m,cc[1]/m,cc[2]/m];
var A=cc[1]*cc[1]-kk*kk,pts=[],u,v,N=24;for(var i=0;i<=N;i++){u=(i/N-.5)*W;var t=u*cc[0]-f*cc[2],B=2*cc[1]*t,C=t*t-kk*kk*(u*u+f*f),ds=B*B-4*A*C,vy;
if(ds<0||Math.abs(A)<1e-6)vy=-t/(cc[1]||-1e-6);else{var s=Math.sqrt(ds),r1=(-B-s)/(2*A),r2=(-B+s)/(2*A);vy=A>0?Math.min(r1,r2):Math.max(r1,r2)}pts.push([mx+u,my-vy])}
var g=c.createLinearGradient(0,0,0,H);c.fillStyle=col2([pr.sp.c[0]*.92,pr.sp.c[1]*.92,pr.sp.c[2]*.92]);c.beginPath();c.moveTo(0,H);pts.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(W,H);c.closePath();c.fill()}
else{var hy=my+f*Math.tan(-cam.rotation.x)*-1;hy=my+f*Math.tan(cam.rotation.x);
if(pr.ce){c.fillStyle=col2(pr.ce);c.fillRect(0,0,W,hy)}
if(pr.fl){var g2=c.createLinearGradient(0,hy,0,H);g2.addColorStop(0,col2(fc));g2.addColorStop(1,col2(pr.fl));c.fillStyle=g2;c.fillRect(0,hy,W,H-hy)}}
/* 收集：精靈與牆面 */
world.children.forEach(function(o){if(!o.isSprite){o._sr=null;return}o._sr=null;if(!o.visible)return;var wp=q.rot(o.position),p=to(wp.x,wp.y,wp.z),z=-p[2];if(z<.12||z>far*1.2)return;list.push({d:z,s:o,p:p})});
pr.walls.forEach(function(w){var p0=to(w.x,w.y,w.z),dd=Math.sqrt(p0[0]*p0[0]+p0[2]*p0[2]);if(dd>far*1.1||p0[2]>1.5)return;
[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(n){if((cp.x-w.x)*n[0]+(cp.z-w.z)*n[1]<=.5)return;var fx=w.x+n[0]*.5,fz=w.z+n[1]*.5,ax=n[1]?.5:0,az=n[0]?.5:0,
cs=[[fx-ax,0,fz-az],[fx+ax,0,fz+az],[fx+ax,1,fz+az],[fx-ax,1,fz-az]].map(function(a){return to(a[0],a[1],a[2])}),ps=[],j,a,b;
for(j=0;j<4;j++){a=cs[j];b=cs[(j+1)%4];if(a[2]<-.05)ps.push(a);if((a[2]<-.05)!==(b[2]<-.05)){var tt=(-.05-a[2])/(b[2]-a[2]);ps.push([a[0]+(b[0]-a[0])*tt,a[1]+(b[1]-a[1])*tt,-.05])}}
if(ps.length<3)return;list.push({d:Math.sqrt(Math.pow(fx-cp.x,2)+Math.pow(fz-cp.z,2)),w:w,ps:ps,sh:n[0]?.78:1})})});
list.sort(function(a,b){return b.d-a.d});
var ttl=0;list.forEach(function(it){var t=fg(it.d);if(it.w){c.globalAlpha=1;var b=it.w.c,s=it.sh*(1-t*.97);c.fillStyle=col2([b[0]*s+fc[0]*t,b[1]*s+fc[1]*t,b[2]*s+fc[2]*t]);c.beginPath();
it.ps.forEach(function(p,i){var x=mx+f*p[0]/-p[2],y=my-f*p[1]/-p[2];i?c.lineTo(x,y):c.moveTo(x,y)});c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke()}
else{var o=it.s,tx=o.material.map;if(!tx)return;var sz=Math.abs(o.scale.x)*f/it.d,sy=o.scale.y*f/it.d,x=mx+f*it.p[0]/it.d,y=my-f*it.p[1]/it.d;if(x+sz<0||x-sz>W||y+sy<0||y-sy>H)return;
c.globalAlpha=1-t*.92;c.drawImage(tx.image,x-sz/2,y-sy/2,sz,sy);o._sr={x:x/k,y:y/k,w:sz/k,h:sy/k,d:it.d}}});
c.globalAlpha=1;this.lastCam=cam};
/* 點擊：射線命中精靈、牆、地面 */
function Ray(){this.ray={origin:new V3(),direction:new V3()};this.n=new V2()}
Ray.prototype.setFromCamera=function(n,cam){this.n=n;this.cam=cam;var r=T._r,t=Math.tan(cam.fov*P/360),a=r.cw/r.ch,v=[n.x*a*t,n.y*t,-1],m=Math.sqrt(v[0]*v[0]+v[1]*v[1]+1),x=v[0]/m,y=v[1]/m,z=-1/m,cx=Math.cos(cam.rotation.x),sx=Math.sin(cam.rotation.x),cy=Math.cos(cam.rotation.y),sy=Math.sin(cam.rotation.y),y2=y*cx-z*sx,z2=y*sx+z*cx;
this.ray.origin=cam.position.clone();this.ray.direction=new V3(x*cy+z2*sy,y2,-x*sy+z2*cy)};
Ray.prototype.intersectObjects=function(ch){var r=T._r,hits=[],o0=this.ray.origin,d=this.ray.direction,px=(this.n.x+1)/2*r.cw,py=(1-this.n.y)/2*r.ch,world=ch.length?ch[0].parent:null;
ch.forEach(function(o){var s=o._sr;if(o.isSprite&&o.visible&&s&&Math.abs(px-s.x)<s.w/2&&Math.abs(py-s.y)<s.h/2)hits.push({object:o,distance:s.d})});
if(world){var p=pre(world),best=1e9,pt=null;
if(p.sp){var L=o0,b=L.x*d.x+L.y*d.y+L.z*d.z,c=L.x*L.x+L.y*L.y+L.z*L.z-p.sp.r*p.sp.r,ds=b*b-c;if(ds>=0){var t=-b-Math.sqrt(ds);if(t>0){best=t;pt=new V3(L.x+d.x*t,L.y+d.y*t,L.z+d.z*t)}}}
else{if(d.y<-1e-4){var t2=-o0.y/d.y;best=t2;pt=new V3(o0.x+d.x*t2,0,o0.z+d.z*t2)}
p.walls.forEach(function(w){var lo=[w.x-.5,0,w.z-.5],hi=[w.x+.5,1,w.z+.5],oo=[o0.x,o0.y,o0.z],dd=[d.x,d.y,d.z],t0=0,t1=best,ok=true;for(var i=0;i<3;i++){if(Math.abs(dd[i])<1e-6){if(oo[i]<lo[i]||oo[i]>hi[i])ok=false}else{var a=(lo[i]-oo[i])/dd[i],b2=(hi[i]-oo[i])/dd[i];if(a>b2){var tm=a;a=b2;b2=tm}t0=Math.max(t0,a);t1=Math.min(t1,b2)}}
if(ok&&t0<t1&&t0<best){best=t0;pt=new V3(o0.x+d.x*t0,o0.y+d.y*t0,o0.z+d.z*t0)}})}
if(pt)hits.push({object:{isMesh:true},point:pt,distance:best})}
hits.sort(function(a,b){return a.distance-b.distance});return hits};
T.WebGLRenderer=function(o){var r=new Rend(o);T._r=r;return r};T.Raycaster=Ray;
window.THREE=T})();
