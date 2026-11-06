var ii={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},si={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Vc=0,ll=1,Gc=2;var cl=1,ra=2,Cn=3,zn=0,Lt=1,vt=2,Rt=0,_i=1,hl=2,ul=3,dl=4,oa=5,gn=100,Wc=101,Xc=102,qc=103,Yc=104,Pr=200,Zc=201,Kc=202,Jc=203,Co=204,Po=205,aa=206,$c=207,la=208,jc=209,Qc=210,eh=211,th=212,nh=213,ih=214,ca=0,ha=1,ua=2,xi=3,da=4,fa=5,pa=6,ma=7,ga=0,sh=1,rh=2,Vn=0,_a=1,xa=2,va=3,Ms=4,ya=5,Ma=6,ba=7;var fl=300,Ii=301,Di=302,Sa=303,Ea=304,Ir=306,vi=1e3,$n=1001,Io=1002,Pt=1003,oh=1004;var Dr=1005;var _n=1006,Ta=1007;var ri=1008;var vn=1009,pl=1010,ml=1011,bs=1012,wa=1013,oi=1014,en=1015,yn=1016,Aa=1017,Ra=1018,ai=1020,gl=35902,_l=35899,xl=1021,vl=1022,cn=1023,rs=1026,li=1027,Ss=1028,Ca=1029,yl=1030,Pa=1031;var Ia=1033,Lr=33776,Nr=33777,Ur=33778,Or=33779,Da=35840,La=35841,Na=35842,Ua=35843,Oa=36196,Fa=37492,Ba=37496,za=37808,ka=37809,Ha=37810,Va=37811,Ga=37812,Wa=37813,Xa=37814,qa=37815,Ya=37816,Za=37817,Ka=37818,Ja=37819,$a=37820,ja=37821,Qa=36492,e0=36494,t0=36495,n0=36283,i0=36284,s0=36285,r0=36286;var Zs=2300,Do=2301,Ro=2302,$0=2400,j0=2401,Q0=2402;var ah=3200,lh=3201;var Fr=0,ch=1,Gn="",St="srgb",yi="srgb-linear",Ks="linear",et="srgb";var gi=7680;var el=519,hh=512,uh=513,dh=514,Ml=515,fh=516,ph=517,mh=518,gh=519,Lo=35044;var bl="300 es",mn=2e3,Js=2001;var An=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ac=1234567,is=Math.PI/180,os=180/Math.PI;function wn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Nt[i&255]+Nt[i>>8&255]+Nt[i>>16&255]+Nt[i>>24&255]+"-"+Nt[e&255]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[t&63|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[n&255]+Nt[n>>8&255]+Nt[n>>16&255]+Nt[n>>24&255]).toLowerCase()}function Ye(i,e,t){return Math.max(e,Math.min(t,i))}function Sl(i,e){return(i%e+e)%e}function yu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Mu(i,e,t){return i!==e?(t-i)/(e-i):0}function Xs(i,e,t){return(1-t)*i+t*e}function bu(i,e,t,n){return Xs(i,e,1-Math.exp(-t*n))}function Su(i,e=1){return e-Math.abs(Sl(i,e*2)-e)}function Eu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Tu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function wu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Au(i,e){return i+Math.random()*(e-i)}function Ru(i){return i*(.5-Math.random())}function Cu(i){i!==void 0&&(ac=i);let e=ac+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Pu(i){return i*is}function Iu(i){return i*os}function Du(i){return(i&i-1)===0&&i!==0}function Lu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Nu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Uu(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var hn={DEG2RAD:is,RAD2DEG:os,generateUUID:wn,clamp:Ye,euclideanModulo:Sl,mapLinear:yu,inverseLerp:Mu,lerp:Xs,damp:bu,pingpong:Su,smoothstep:Eu,smootherstep:Tu,randInt:wu,randFloat:Au,randFloatSpread:Ru,seededRandom:Cu,degToRad:Pu,radToDeg:Iu,isPowerOfTwo:Du,ceilPowerOfTwo:Lu,floorPowerOfTwo:Nu,setQuaternionFromProperEuler:Uu,normalize:st,denormalize:pn},$=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},an=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let m=1-a,p=l*f+c*d+h*g+u*x,E=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){let w=Math.sqrt(M),A=Math.atan2(w,p*E);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}let _=a*E;if(l=l*m+f*_,c=c*m+d*_,h=h*m+g*_,u=u*m+x*_,m===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-a*d,e[t+2]=c*g+h*d+a*f-l*u,e[t+3]=h*g-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(lc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(lc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return b0.copy(this).projectOnVector(e),this.sub(b0)}reflect(e){return this.sub(b0.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},b0=new R,lc=new an,qe=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],x=s[0],m=s[3],p=s[6],E=s[1],M=s[4],_=s[7],w=s[2],A=s[5],P=s[8];return r[0]=o*x+a*E+l*w,r[3]=o*m+a*M+l*A,r[6]=o*p+a*_+l*P,r[1]=c*x+h*E+u*w,r[4]=c*m+h*M+u*A,r[7]=c*p+h*_+u*P,r[2]=f*x+d*E+g*w,r[5]=f*m+d*M+g*A,r[8]=f*p+d*_+g*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=t*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(a*n-s*o)*x,e[3]=f*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=d*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(S0.makeScale(e,t)),this}rotate(e){return this.premultiply(S0.makeRotation(-e)),this}translate(e,t){return this.premultiply(S0.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},S0=new qe;function El(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $s(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _h(){let i=$s("canvas");return i.style.display="block",i}var cc={};function as(i){i in cc||(cc[i]=!0,console.warn(i))}function xh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var hc=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),uc=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ou(){let i={enabled:!0,workingColorSpace:yi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===et&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===et&&(s.r=ss(s.r),s.g=ss(s.g),s.b=ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gn?Ks:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return as("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return as("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[yi]:{primaries:e,whitePoint:n,transfer:Ks,toXYZ:hc,fromXYZ:uc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:e,whitePoint:n,transfer:et,toXYZ:hc,fromXYZ:uc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:St}}}),i}var $e=Ou();function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ss(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ki,No=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ki===void 0&&(ki=$s("canvas")),ki.width=e.width,ki.height=e.height;let s=ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ki}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=$s("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Bn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Bn(t[n]/255)*255):t[n]=Bn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Fu=0,ls=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=wn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(E0(s[o].image)):r.push(E0(s[o]))}else r=E0(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function E0(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?No.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Bu=0,T0=new R,Ht=class i extends An{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=$n,s=$n,r=_n,o=ri,a=cn,l=vn,c=i.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=wn(),this.name="",this.source=new ls(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new $(0,0),this.repeat=new $(1,1),this.center=new $(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(T0).x}get height(){return this.source.getSize(T0).y}get depth(){return this.source.getSize(T0).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vi:e.x=e.x-Math.floor(e.x);break;case $n:e.x=e.x<0?0:1;break;case Io:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vi:e.y=e.y-Math.floor(e.y);break;case $n:e.y=e.y<0?0:1;break;case Io:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=fl;Ht.DEFAULT_ANISOTROPY=1;var rt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,_=(d+1)/2,w=(p+1)/2,A=(h+f)/4,P=(u+x)/4,N=(g+m)/4;return M>_&&M>w?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=P/n):_>w?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=A/s,r=N/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=P/r,s=N/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-x)/E,this.z=(f-h)/E,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Uo=class extends An{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Ht(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:_n,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ls(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vt=class extends Uo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},js=class extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Oo=class extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var xt=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,un):un.fromBufferAttribute(r,o),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$r.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$r.copy(n.boundingBox)),$r.applyMatrix4(e.matrixWorld),this.union($r)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ls),jr.subVectors(this.max,Ls),Hi.subVectors(e.a,Ls),Vi.subVectors(e.b,Ls),Gi.subVectors(e.c,Ls),Xn.subVectors(Vi,Hi),qn.subVectors(Gi,Vi),di.subVectors(Hi,Gi);let t=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-di.z,di.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,di.z,0,-di.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-di.y,di.x,0];return!w0(t,Hi,Vi,Gi,jr)||(t=[1,0,0,0,1,0,0,0,1],!w0(t,Hi,Vi,Gi,jr))?!1:(Qr.crossVectors(Xn,qn),t=[Qr.x,Qr.y,Qr.z],w0(t,Hi,Vi,Gi,jr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ln=[new R,new R,new R,new R,new R,new R,new R,new R],un=new R,$r=new xt,Hi=new R,Vi=new R,Gi=new R,Xn=new R,qn=new R,di=new R,Ls=new R,jr=new R,Qr=new R,fi=new R;function w0(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){fi.fromArray(i,r);let a=s.x*Math.abs(fi.x)+s.y*Math.abs(fi.y)+s.z*Math.abs(fi.z),l=e.dot(fi),c=t.dot(fi),h=n.dot(fi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var zu=new xt,Ns=new R,A0=new R,kn=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):zu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ns.subVectors(e,this.center);let t=Ns.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ns,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(A0.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ns.copy(e.center).add(A0)),this.expandByPoint(Ns.copy(e.center).sub(A0))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Nn=new R,R0=new R,eo=new R,Yn=new R,C0=new R,to=new R,P0=new R,jn=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){R0.copy(e).add(t).multiplyScalar(.5),eo.copy(t).sub(e).normalize(),Yn.copy(this.origin).sub(R0);let r=e.distanceTo(t)*.5,o=-this.direction.dot(eo),a=Yn.dot(this.direction),l=-Yn.dot(eo),c=Yn.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(R0).addScaledVector(eo,f),d}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);let n=Nn.dot(this.direction),s=Nn.dot(Nn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,n,s,r){C0.subVectors(t,e),to.subVectors(n,e),P0.crossVectors(C0,to);let o=this.direction.dot(P0),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Yn.subVectors(this.origin,e);let l=a*this.direction.dot(to.crossVectors(Yn,to));if(l<0)return null;let c=a*this.direction.dot(C0.cross(Yn));if(c<0||l+c>o)return null;let h=-a*Yn.dot(P0);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Qe=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,f,d,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,f,d,g,x,m)}set(e,t,n,s,r,o,a,l,c,h,u,f,d,g,x,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Wi.setFromMatrixColumn(e,0).length(),r=1/Wi.setFromMatrixColumn(e,1).length(),o=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=g+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f+x*a,t[4]=g*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,g=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,d=o*u,g=a*h,x=a*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=d*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-x*u}else if(e.order==="XZY"){let f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ku,e,Hu)}lookAt(e,t,n){let s=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Zn.crossVectors(n,Zt),Zn.lengthSq()===0&&(Math.abs(n.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Zn.crossVectors(n,Zt)),Zn.normalize(),no.crossVectors(Zt,Zn),s[0]=Zn.x,s[4]=no.x,s[8]=Zt.x,s[1]=Zn.y,s[5]=no.y,s[9]=Zt.y,s[2]=Zn.z,s[6]=no.z,s[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],x=n[6],m=n[10],p=n[14],E=n[3],M=n[7],_=n[11],w=n[15],A=s[0],P=s[4],N=s[8],b=s[12],y=s[1],C=s[5],L=s[9],F=s[13],H=s[2],V=s[6],D=s[10],G=s[14],B=s[3],X=s[7],K=s[11],re=s[15];return r[0]=o*A+a*y+l*H+c*B,r[4]=o*P+a*C+l*V+c*X,r[8]=o*N+a*L+l*D+c*K,r[12]=o*b+a*F+l*G+c*re,r[1]=h*A+u*y+f*H+d*B,r[5]=h*P+u*C+f*V+d*X,r[9]=h*N+u*L+f*D+d*K,r[13]=h*b+u*F+f*G+d*re,r[2]=g*A+x*y+m*H+p*B,r[6]=g*P+x*C+m*V+p*X,r[10]=g*N+x*L+m*D+p*K,r[14]=g*b+x*F+m*G+p*re,r[3]=E*A+M*y+_*H+w*B,r[7]=E*P+M*C+_*V+w*X,r[11]=E*N+M*L+_*D+w*K,r[15]=E*b+M*F+_*G+w*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*d-n*l*d)+x*(+t*l*d-t*c*f+r*o*f-s*o*d+s*c*h-r*l*h)+m*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+p*(-s*a*h-t*l*u+t*a*f+s*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],x=e[13],m=e[14],p=e[15],E=u*m*c-x*f*c+x*l*d-a*m*d-u*l*p+a*f*p,M=g*f*c-h*m*c-g*l*d+o*m*d+h*l*p-o*f*p,_=h*x*c-g*u*c+g*a*d-o*x*d-h*a*p+o*u*p,w=g*u*l-h*x*l-g*a*f+o*x*f+h*a*m-o*u*m,A=t*E+n*M+s*_+r*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/A;return e[0]=E*P,e[1]=(x*f*r-u*m*r-x*s*d+n*m*d+u*s*p-n*f*p)*P,e[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*p+n*l*p)*P,e[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*d-n*l*d)*P,e[4]=M*P,e[5]=(h*m*r-g*f*r+g*s*d-t*m*d-h*s*p+t*f*p)*P,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*P,e[7]=(o*f*r-h*l*r+h*s*c-t*f*c-o*s*d+t*l*d)*P,e[8]=_*P,e[9]=(g*u*r-h*x*r-g*n*d+t*x*d+h*n*p-t*u*p)*P,e[10]=(o*x*r-g*a*r+g*n*c-t*x*c-o*n*p+t*a*p)*P,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*P,e[12]=w*P,e[13]=(h*x*s-g*u*s+g*n*f-t*x*f-h*n*m+t*u*m)*P,e[14]=(g*a*s-o*x*s-g*n*l+t*x*l+o*n*m-t*a*m)*P,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*f+t*a*f)*P,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,x=o*h,m=o*u,p=a*u,E=l*c,M=l*h,_=l*u,w=n.x,A=n.y,P=n.z;return s[0]=(1-(x+p))*w,s[1]=(d+_)*w,s[2]=(g-M)*w,s[3]=0,s[4]=(d-_)*A,s[5]=(1-(f+p))*A,s[6]=(m+E)*A,s[7]=0,s[8]=(g+M)*P,s[9]=(m-E)*P,s[10]=(1-(f+x))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Wi.set(s[0],s[1],s[2]).length(),o=Wi.set(s[4],s[5],s[6]).length(),a=Wi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],dn.copy(this);let c=1/r,h=1/o,u=1/a;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,t.setFromRotationMatrix(dn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=mn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===mn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Js)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=mn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),d=-(n+s)/(n-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===mn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Js)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Wi=new R,dn=new Qe,ku=new R(0,0,0),Hu=new R(1,1,1),Zn=new R,no=new R,Zt=new R,dc=new Qe,fc=new an,ln=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fc.setFromEuler(this),this.setFromQuaternion(fc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";var cs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Vu=0,pc=new R,Xi=new an,Un=new Qe,io=new R,Us=new R,Gu=new R,Wu=new an,mc=new R(1,0,0),gc=new R(0,1,0),_c=new R(0,0,1),xc={type:"added"},Xu={type:"removed"},qi={type:"childadded",child:null},I0={type:"childremoved",child:null},Mt=class i extends An{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=wn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new R,t=new ln,n=new an,s=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qe},normalMatrix:{value:new qe}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(mc,e)}rotateY(e){return this.rotateOnAxis(gc,e)}rotateZ(e){return this.rotateOnAxis(_c,e)}translateOnAxis(e,t){return pc.copy(e).applyQuaternion(this.quaternion),this.position.add(pc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mc,e)}translateY(e){return this.translateOnAxis(gc,e)}translateZ(e){return this.translateOnAxis(_c,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?io.copy(e):io.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(Us,io,this.up):Un.lookAt(io,Us,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Xi.setFromRotationMatrix(Un),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xc),qi.child=e,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Xu),I0.child=e,this.dispatchEvent(I0),I0.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Un.multiply(e.parent.matrixWorld)),e.applyMatrix4(Un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xc),qi.child=e,this.dispatchEvent(qi),qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,e,Gu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,Wu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Mt.DEFAULT_UP=new R(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var fn=new R,On=new R,D0=new R,Fn=new R,Yi=new R,Zi=new R,vc=new R,L0=new R,N0=new R,U0=new R,O0=new rt,F0=new rt,B0=new rt,En=class i{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),fn.subVectors(e,t),s.cross(fn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){fn.subVectors(s,t),On.subVectors(n,t),D0.subVectors(e,t);let o=fn.dot(fn),a=fn.dot(On),l=fn.dot(D0),c=On.dot(On),h=On.dot(D0),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Fn)===null?!1:Fn.x>=0&&Fn.y>=0&&Fn.x+Fn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Fn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Fn.x),l.addScaledVector(o,Fn.y),l.addScaledVector(a,Fn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return O0.setScalar(0),F0.setScalar(0),B0.setScalar(0),O0.fromBufferAttribute(e,t),F0.fromBufferAttribute(e,n),B0.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(O0,r.x),o.addScaledVector(F0,r.y),o.addScaledVector(B0,r.z),o}static isFrontFacing(e,t,n,s){return fn.subVectors(n,t),On.subVectors(e,t),fn.cross(On).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),fn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Yi.subVectors(s,n),Zi.subVectors(r,n),L0.subVectors(e,n);let l=Yi.dot(L0),c=Zi.dot(L0);if(l<=0&&c<=0)return t.copy(n);N0.subVectors(e,s);let h=Yi.dot(N0),u=Zi.dot(N0);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Yi,o);U0.subVectors(e,r);let d=Yi.dot(U0),g=Zi.dot(U0);if(g>=0&&d<=g)return t.copy(r);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Zi,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return vc.subVectors(r,s),a=(u-h)/(u-h+(d-g)),t.copy(s).addScaledVector(vc,a);let p=1/(m+x+f);return o=x*p,a=f*p,t.copy(n).addScaledVector(Yi,o).addScaledVector(Zi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},so={h:0,s:0,l:0};function z0(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ue=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=$e.workingColorSpace){if(e=Sl(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=z0(o,r,e+1/3),this.g=z0(o,r,e),this.b=z0(o,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=St){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){let n=vh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return $e.workingToColorSpace(Ut.copy(this),e),Math.round(Ye(Ut.r*255,0,255))*65536+Math.round(Ye(Ut.g*255,0,255))*256+Math.round(Ye(Ut.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Ut.copy(this),t);let n=Ut.r,s=Ut.g,r=Ut.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=St){$e.workingToColorSpace(Ut.copy(this),e);let t=Ut.r,n=Ut.g,s=Ut.b;return e!==St?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(so);let n=Xs(Kn.h,so.h,t),s=Xs(Kn.s,so.s,t),r=Xs(Kn.l,so.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ut=new Ue;Ue.NAMES=vh;var qu=0,Jt=class extends An{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=wn(),this.name="",this.type="Material",this.blending=_i,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Co,this.blendDst=Po,this.blendEquation=gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_i&&(n.blending=this.blending),this.side!==zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Co&&(n.blendSrc=this.blendSrc),this.blendDst!==Po&&(n.blendDst=this.blendDst),this.blendEquation!==gn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ot=class extends Jt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ga,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var yt=new R,ro=new $,Yu=0,Ct=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Lo,this.updateRanges=[],this.gpuType=en,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.applyMatrix3(e),this.setXY(t,ro.x,ro.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Lo&&(e.usage=this.usage),e}};var Qs=class extends Ct{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var er=class extends Ct{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var We=class extends Ct{constructor(e,t,n){super(new Float32Array(e),t,n)}},Zu=0,rn=new Qe,k0=new Mt,Ki=new R,Kt=new xt,Os=new xt,At=new R,it=class i extends An{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=wn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(El(e)?er:Qs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,n){return rn.makeTranslation(e,t,n),this.applyMatrix4(rn),this}scale(e,t,n){return rn.makeScale(e,t,n),this.applyMatrix4(rn),this}lookAt(e){return k0.lookAt(e),k0.updateMatrix(),this.applyMatrix4(k0.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ki).negate(),this.translate(Ki.x,Ki.y,Ki.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new We(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Os.setFromBufferAttribute(a),this.morphTargetsRelative?(At.addVectors(Kt.min,Os.min),Kt.expandByPoint(At),At.addVectors(Kt.max,Os.max),Kt.expandByPoint(At)):(Kt.expandByPoint(Os.min),Kt.expandByPoint(Os.max))}Kt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)At.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(At));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)At.fromBufferAttribute(a,c),l&&(Ki.fromBufferAttribute(e,c),At.add(Ki)),s=Math.max(s,n.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ct(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new R,l[N]=new R;let c=new R,h=new R,u=new R,f=new $,d=new $,g=new $,x=new R,m=new R;function p(N,b,y){c.fromBufferAttribute(n,N),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,y),f.fromBufferAttribute(r,N),d.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),h.sub(c),u.sub(c),d.sub(f),g.sub(f);let C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(C),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(C),a[N].add(x),a[b].add(x),a[y].add(x),l[N].add(m),l[b].add(m),l[y].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let N=0,b=E.length;N<b;++N){let y=E[N],C=y.start,L=y.count;for(let F=C,H=C+L;F<H;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let M=new R,_=new R,w=new R,A=new R;function P(N){w.fromBufferAttribute(s,N),A.copy(w);let b=a[N];M.copy(b),M.sub(w.multiplyScalar(w.dot(b))).normalize(),_.crossVectors(A,b);let C=_.dot(l[N])<0?-1:1;o.setXYZW(N,M.x,M.y,M.z,C)}for(let N=0,b=E.length;N<b;++N){let y=E[N],C=y.start,L=y.count;for(let F=C,H=C+L;F<H;F+=3)P(e.getX(F+0)),P(e.getX(F+1)),P(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ct(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new Ct(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},yc=new Qe,pi=new jn,oo=new kn,Mc=new R,ao=new R,lo=new R,co=new R,H0=new R,ho=new R,bc=new R,uo=new R,He=class extends Mt{constructor(e=new it,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ho.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(H0.fromBufferAttribute(u,e),o?ho.addScaledVector(H0,h):ho.addScaledVector(H0.sub(t),h))}t.add(ho)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(r),pi.copy(e.ray).recast(e.near),!(oo.containsPoint(pi.origin)===!1&&(pi.intersectSphere(oo,Mc)===null||pi.origin.distanceToSquared(Mc)>(e.far-e.near)**2))&&(yc.copy(r).invert(),pi.copy(e.ray).applyMatrix4(yc),!(n.boundingBox!==null&&pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,pi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,d.start),M=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let _=E,w=M;_<w;_+=3){let A=a.getX(_),P=a.getX(_+1),N=a.getX(_+2);s=fo(this,p,e,n,c,h,u,A,P,N),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let E=a.getX(m),M=a.getX(m+1),_=a.getX(m+2);s=fo(this,o,e,n,c,h,u,E,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,d.start),M=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let _=E,w=M;_<w;_+=3){let A=_,P=_+1,N=_+2;s=fo(this,p,e,n,c,h,u,A,P,N),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let E=m,M=m+1,_=m+2;s=fo(this,o,e,n,c,h,u,E,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Ku(i,e,t,n,s,r,o,a){let l;if(e.side===Lt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===zn,a),l===null)return null;uo.copy(a),uo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(uo);return c<t.near||c>t.far?null:{distance:c,point:uo.clone(),object:i}}function fo(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ao),i.getVertexPosition(l,lo),i.getVertexPosition(c,co);let h=Ku(i,e,t,n,ao,lo,co,bc);if(h){let u=new R;En.getBarycoord(bc,ao,lo,co,u),s&&(h.uv=En.getInterpolatedAttribute(s,a,l,c,u,new $)),r&&(h.uv1=En.getInterpolatedAttribute(r,a,l,c,u,new $)),o&&(h.normal=En.getInterpolatedAttribute(o,a,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new R,materialIndex:0};En.getNormal(ao,lo,co,f.normal),h.face=f,h.barycoord=u}return h}var It=class i extends it{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new We(c,3)),this.setAttribute("normal",new We(h,3)),this.setAttribute("uv",new We(u,2));function g(x,m,p,E,M,_,w,A,P,N,b){let y=_/P,C=w/N,L=_/2,F=w/2,H=A/2,V=P+1,D=N+1,G=0,B=0,X=new R;for(let K=0;K<D;K++){let re=K*C-F;for(let ye=0;ye<V;ye++){let Ie=ye*y-L;X[x]=Ie*E,X[m]=re*M,X[p]=H,c.push(X.x,X.y,X.z),X[x]=0,X[m]=0,X[p]=A>0?1:-1,h.push(X.x,X.y,X.z),u.push(ye/P),u.push(1-K/N),G+=1}}for(let K=0;K<N;K++)for(let re=0;re<P;re++){let ye=f+re+V*K,Ie=f+re+V*(K+1),Ve=f+(re+1)+V*(K+1),Xe=f+(re+1)+V*K;l.push(ye,Ie,Xe),l.push(Ie,Ve,Xe),B+=6}a.addGroup(d,B,b),d+=B,f+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Li(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ft(i){let e={};for(let t=0;t<i.length;t++){let n=Li(i[t]);for(let s in n)e[s]=n[s]}return e}function Ju(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Tl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}var Mn={clone:Li,merge:Ft},$u=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ju=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bt=class extends Jt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$u,this.fragmentShader=ju,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Li(e.uniforms),this.uniformsGroups=Ju(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},tr=class extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Jn=new R,Sc=new $,Ec=new $,kt=class extends tr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(is*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return os*2*Math.atan(Math.tan(is*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z)}getViewSize(e,t){return this.getViewBounds(e,Sc,Ec),t.subVectors(Ec,Sc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(is*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ji=-90,$i=1,Fo=class extends Mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new kt(Ji,$i,e,t);s.layers=this.layers,this.add(s);let r=new kt(Ji,$i,e,t);r.layers=this.layers,this.add(r);let o=new kt(Ji,$i,e,t);o.layers=this.layers,this.add(o);let a=new kt(Ji,$i,e,t);a.layers=this.layers,this.add(a);let l=new kt(Ji,$i,e,t);l.layers=this.layers,this.add(l);let c=new kt(Ji,$i,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Js)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},nr=class extends Ht{constructor(e=[],t=Ii,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Bo=class extends Vt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new nr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new It(5,5,5),r=new bt({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Lt,blending:Rt});r.uniforms.tEquirect.value=t;let o=new He(s,r),a=t.minFilter;return t.minFilter===ri&&(t.minFilter=_n),new Fo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},gt=class extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Qu={type:"move"},hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Qu)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new gt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Mi=class extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ir=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Lo,this.updateRanges=[],this.version=0,this.uuid=wn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},zt=new R,us=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ct(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ds=class extends Jt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ji,Fs=new R,Qi=new R,es=new R,ts=new $,Bs=new $,yh=new Qe,po=new R,zs=new R,mo=new R,Tc=new $,V0=new $,wc=new $,sr=class extends Mt{constructor(e=new ds){if(super(),this.isSprite=!0,this.type="Sprite",ji===void 0){ji=new it;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ir(t,5);ji.setIndex([0,1,2,0,2,3]),ji.setAttribute("position",new us(n,3,0,!1)),ji.setAttribute("uv",new us(n,2,3,!1))}this.geometry=ji,this.material=e,this.center=new $(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Qi.setFromMatrixScale(this.matrixWorld),yh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),es.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Qi.multiplyScalar(-es.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;go(po.set(-.5,-.5,0),es,o,Qi,s,r),go(zs.set(.5,-.5,0),es,o,Qi,s,r),go(mo.set(.5,.5,0),es,o,Qi,s,r),Tc.set(0,0),V0.set(1,0),wc.set(1,1);let a=e.ray.intersectTriangle(po,zs,mo,!1,Fs);if(a===null&&(go(zs.set(-.5,.5,0),es,o,Qi,s,r),V0.set(0,1),a=e.ray.intersectTriangle(po,mo,zs,!1,Fs),a===null))return;let l=e.ray.origin.distanceTo(Fs);l<e.near||l>e.far||t.push({distance:l,point:Fs.clone(),uv:En.getInterpolation(Fs,po,zs,mo,Tc,V0,wc,new $),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function go(i,e,t,n,s,r){ts.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Bs.x=r*ts.x-s*ts.y,Bs.y=s*ts.x+r*ts.y):Bs.copy(ts),i.copy(e),i.x+=Bs.x,i.y+=Bs.y,i.applyMatrix4(yh)}var fs=class extends Ht{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Pt,h=Pt,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ps=class extends Ct{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ns=new Qe,Ac=new Qe,_o=[],Rc=new xt,e4=new Qe,ks=new He,Hs=new kn,rr=class extends He{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ps(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,e4)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new xt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ns),Rc.copy(e.boundingBox).applyMatrix4(ns),this.boundingBox.union(Rc)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ns),Hs.copy(e.boundingSphere).applyMatrix4(ns),this.boundingSphere.union(Hs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ks.geometry=this.geometry,ks.material=this.material,ks.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hs.copy(this.boundingSphere),Hs.applyMatrix4(n),e.ray.intersectsSphere(Hs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ns),Ac.multiplyMatrices(n,ns),ks.matrixWorld=Ac,ks.raycast(e,_o);for(let o=0,a=_o.length;o<a;o++){let l=_o[o];l.instanceId=r,l.object=this,t.push(l)}_o.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ps(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new fs(new Float32Array(s*this.count),s,this.count,Ss,en));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},G0=new R,t4=new R,n4=new qe,on=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=G0.subVectors(n,t).cross(t4.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(G0),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||n4.getNormalMatrix(e),s=this.coplanarPoint(G0).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},mi=new kn,i4=new $(.5,.5),xo=new R,ms=class{constructor(e=new on,t=new on,n=new on,s=new on,r=new on,o=new on){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=mn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],x=r[9],m=r[10],p=r[11],E=r[12],M=r[13],_=r[14],w=r[15];if(s[0].setComponents(c-o,d-h,p-g,w-E).normalize(),s[1].setComponents(c+o,d+h,p+g,w+E).normalize(),s[2].setComponents(c+a,d+u,p+x,w+M).normalize(),s[3].setComponents(c-a,d-u,p-x,w-M).normalize(),n)s[4].setComponents(l,f,m,_).normalize(),s[5].setComponents(c-l,d-f,p-m,w-_).normalize();else if(s[4].setComponents(c-l,d-f,p-m,w-_).normalize(),t===mn)s[5].setComponents(c+l,d+f,p+m,w+_).normalize();else if(t===Js)s[5].setComponents(l,f,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(e){mi.center.set(0,0,0);let t=i4.distanceTo(e.center);return mi.radius=.7071067811865476+t,mi.applyMatrix4(e.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(xo.x=s.normal.x>0?e.max.x:e.min.x,xo.y=s.normal.y>0?e.max.y:e.min.y,xo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Dt=class extends Jt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},zo=new R,ko=new R,Cc=new Qe,Vs=new jn,vo=new kn,W0=new R,Pc=new R,or=class extends Mt{constructor(e=new it,t=new Dt){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)zo.fromBufferAttribute(t,s-1),ko.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=zo.distanceTo(ko);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(s),vo.radius+=r,e.ray.intersectsSphere(vo)===!1)return;Cc.copy(s).invert(),Vs.copy(e.ray).applyMatrix4(Cc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=h.getX(x),E=h.getX(x+1),M=yo(this,e,Vs,l,p,E,x);M&&t.push(M)}if(this.isLineLoop){let x=h.getX(g-1),m=h.getX(d),p=yo(this,e,Vs,l,x,m,g-1);p&&t.push(p)}}else{let d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){let p=yo(this,e,Vs,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=yo(this,e,Vs,l,g-1,d,g-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function yo(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(zo.fromBufferAttribute(a,s),ko.fromBufferAttribute(a,r),t.distanceSqToSegment(zo,ko,W0,Pc)>n)return;W0.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(W0);if(!(c<e.near||c>e.far))return{distance:c,point:Pc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Ic=new R,Dc=new R,Gt=class extends or{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ic.fromBufferAttribute(t,s),Dc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ic.distanceTo(Dc);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ar=class extends or{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}};var Qn=class extends Ht{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},bi=class extends Ht{constructor(e,t,n=oi,s,r,o,a=Pt,l=Pt,c,h=rs,u=1){if(h!==rs&&h!==li)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ls(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},lr=class extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Si=class i extends it{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,x=[],m=n/2,p=0;E(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new We(u,3)),this.setAttribute("normal",new We(f,3)),this.setAttribute("uv",new We(d,2));function E(){let _=new R,w=new R,A=0,P=(t-e)/n;for(let N=0;N<=r;N++){let b=[],y=N/r,C=y*(t-e)+e;for(let L=0;L<=s;L++){let F=L/s,H=F*l+a,V=Math.sin(H),D=Math.cos(H);w.x=C*V,w.y=-y*n+m,w.z=C*D,u.push(w.x,w.y,w.z),_.set(V,P,D).normalize(),f.push(_.x,_.y,_.z),d.push(F,1-y),b.push(g++)}x.push(b)}for(let N=0;N<s;N++)for(let b=0;b<r;b++){let y=x[b][N],C=x[b+1][N],L=x[b+1][N+1],F=x[b][N+1];(e>0||b!==0)&&(h.push(y,C,F),A+=3),(t>0||b!==r-1)&&(h.push(C,L,F),A+=3)}c.addGroup(p,A,0),p+=A}function M(_){let w=g,A=new $,P=new R,N=0,b=_===!0?e:t,y=_===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,m*y,0),f.push(0,y,0),d.push(.5,.5),g++;let C=g;for(let L=0;L<=s;L++){let H=L/s*l+a,V=Math.cos(H),D=Math.sin(H);P.x=b*D,P.y=m*y,P.z=b*V,u.push(P.x,P.y,P.z),f.push(0,y,0),A.x=V*.5+.5,A.y=D*.5*y+.5,d.push(A.x,A.y),g++}for(let L=0;L<s;L++){let F=w+L,H=C+L;_===!0?h.push(H,H+1,F):h.push(H+1,H,F),N+=3}c.addGroup(p,N,_===!0?1:2),p+=N}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Mo=new R,bo=new R,X0=new R,So=new En,Rn=class extends it{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(is*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:x,b:m,c:p}=So;if(x.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),So.getNormal(X0),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){let M=(E+1)%3,_=u[E],w=u[M],A=So[h[E]],P=So[h[M]],N=`${_}_${w}`,b=`${w}_${_}`;b in f&&f[b]?(X0.dot(f[b].normal)<=r&&(d.push(A.x,A.y,A.z),d.push(P.x,P.y,P.z)),f[b]=null):N in f||(f[N]={index0:c[E],index1:c[M],normal:X0.clone()})}}for(let g in f)if(f[g]){let{index0:x,index1:m}=f[g];Mo.fromBufferAttribute(a,x),bo.fromBufferAttribute(a,m),d.push(Mo.x,Mo.y,Mo.z),d.push(bo.x,bo.y,bo.z)}this.setAttribute("position",new We(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},$t=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new $:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new R,s=[],r=[],o=[],a=new R,l=new Qe;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Ye(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(Ye(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},gs=class extends $t{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new $){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ho=class extends gs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function wl(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Eo=new R,q0=new wl,Y0=new wl,Z0=new wl,_s=class extends $t{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new R){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Eo.subVectors(s[0],s[1]).add(s[0]),c=Eo);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Eo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Eo),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),q0.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,x,m),Y0.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,x,m),Z0.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(q0.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Y0.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Z0.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(q0.calc(l),Y0.calc(l),Z0.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new R().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Lc(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function s4(i,e){let t=1-i;return t*t*e}function r4(i,e){return 2*(1-i)*i*e}function o4(i,e){return i*i*e}function qs(i,e,t,n){return s4(i,e)+r4(i,t)+o4(i,n)}function a4(i,e){let t=1-i;return t*t*t*e}function l4(i,e){let t=1-i;return 3*t*t*i*e}function c4(i,e){return 3*(1-i)*i*i*e}function h4(i,e){return i*i*i*e}function Ys(i,e,t,n,s){return a4(i,e)+l4(i,t)+c4(i,n)+h4(i,s)}var cr=class extends $t{constructor(e=new $,t=new $,n=new $,s=new $){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new $){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ys(e,s.x,r.x,o.x,a.x),Ys(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Vo=class extends $t{constructor(e=new R,t=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ys(e,s.x,r.x,o.x,a.x),Ys(e,s.y,r.y,o.y,a.y),Ys(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},hr=class extends $t{constructor(e=new $,t=new $){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new $){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new $){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Go=class extends $t{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ur=class extends $t{constructor(e=new $,t=new $,n=new $){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new $){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(qs(e,s.x,r.x,o.x),qs(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},dr=class extends $t{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(qs(e,s.x,r.x,o.x),qs(e,s.y,r.y,o.y),qs(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fr=class extends $t{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new $){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Lc(a,l.x,c.x,h.x,u.x),Lc(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new $().fromArray(s))}return this}},Wo=Object.freeze({__proto__:null,ArcCurve:Ho,CatmullRomCurve3:_s,CubicBezierCurve:cr,CubicBezierCurve3:Vo,EllipseCurve:gs,LineCurve:hr,LineCurve3:Go,QuadraticBezierCurve:ur,QuadraticBezierCurve3:dr,SplineCurve:fr}),Xo=class extends $t{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Wo[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Wo[s.type]().fromJSON(s))}return this}},Ei=class extends Xo{constructor(e){super(),this.type="Path",this.currentPoint=new $,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new hr(this.currentPoint.clone(),new $(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ur(this.currentPoint.clone(),new $(e,t),new $(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new cr(this.currentPoint.clone(),new $(e,t),new $(n,s),new $(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new fr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new gs(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},xn=class extends Ei{constructor(e){super(e),this.uuid=wn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Ei().fromJSON(s))}return this}};function u4(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Mh(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=g4(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let d=i[f],g=i[f+1];d<a&&(a=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return pr(r,o,t,a,l,c,0),o}function Mh(i,e,t,n,s){let r;if(s===A4(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Nc(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Nc(o/n|0,i[o],i[o+1],r);return r&&xs(r,r.next)&&(gr(r),r=r.next),r}function Ti(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(xs(t,t.next)||mt(t.prev,t,t.next)===0)){if(gr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function pr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&M4(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?f4(i,n,s,r):d4(i)){e.push(l.i,i.i,c.i),gr(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=p4(Ti(i),e),pr(i,e,t,n,s,r,2)):o===2&&m4(i,e,t,n,s,r):pr(Ti(i),e,t,n,s,r,1);break}}}function d4(i){let e=i.prev,t=i,n=i.next;if(mt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),f=Math.max(s,r,o),d=Math.max(a,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Ws(s,a,r,l,o,c,g.x,g.y)&&mt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function f4(i,e,t,n){let s=i.prev,r=i,o=i.next;if(mt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,l,c),g=Math.min(h,u,f),x=Math.max(a,l,c),m=Math.max(h,u,f),p=tl(d,g,e,t,n),E=tl(x,m,e,t,n),M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=E;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ws(a,h,l,u,c,f,M.x,M.y)&&mt(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=d&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Ws(a,h,l,u,c,f,_.x,_.y)&&mt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=d&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ws(a,h,l,u,c,f,M.x,M.y)&&mt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=E;){if(_.x>=d&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Ws(a,h,l,u,c,f,_.x,_.y)&&mt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function p4(i,e){let t=i;do{let n=t.prev,s=t.next.next;!xs(n,s)&&Sh(n,t,t.next,s)&&mr(n,s)&&mr(s,n)&&(e.push(n.i,t.i,s.i),gr(t),gr(t.next),t=i=s),t=t.next}while(t!==i);return Ti(t)}function m4(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&E4(o,a)){let l=Eh(o,a);o=Ti(o,o.next),l=Ti(l,l.next),pr(o,e,t,n,s,r,0),pr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function g4(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Mh(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(S4(c))}s.sort(_4);for(let r=0;r<s.length;r++)t=x4(s[r],t);return t}function _4(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function x4(i,e){let t=v4(i,e);if(!t)return e;let n=Eh(t,i);return Ti(n,n.next),Ti(t,t.next)}function v4(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(xs(i,t))return t;do{if(xs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&bh(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);mr(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&y4(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function y4(i,e){return mt(i.prev,i,e.prev)<0&&mt(e.next,i,i.next)<0}function M4(i,e,t,n){let s=i;do s.z===0&&(s.z=tl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,b4(s)}function b4(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function tl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function S4(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function bh(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Ws(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&bh(i,e,t,n,s,r,o,a)}function E4(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!T4(i,e)&&(mr(i,e)&&mr(e,i)&&w4(i,e)&&(mt(i.prev,i,e.prev)||mt(i,e.prev,e))||xs(i,e)&&mt(i.prev,i,i.next)>0&&mt(e.prev,e,e.next)>0)}function mt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function xs(i,e){return i.x===e.x&&i.y===e.y}function Sh(i,e,t,n){let s=wo(mt(i,e,t)),r=wo(mt(i,e,n)),o=wo(mt(t,n,i)),a=wo(mt(t,n,e));return!!(s!==r&&o!==a||s===0&&To(i,t,e)||r===0&&To(i,n,e)||o===0&&To(t,i,n)||a===0&&To(t,e,n))}function To(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function wo(i){return i>0?1:i<0?-1:0}function T4(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Sh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function mr(i,e){return mt(i.prev,i,i.next)<0?mt(i,e,i.next)>=0&&mt(i,i.prev,e)>=0:mt(i,e,i.prev)<0||mt(i,i.next,e)<0}function w4(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Eh(i,e){let t=nl(i.i,i.x,i.y),n=nl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Nc(i,e,t,n){let s=nl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function gr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function nl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function A4(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var il=class{static triangulate(e,t,n=2){return u4(e,t,n)}},Tn=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Uc(e),Oc(n,e);let o=e.length;t.forEach(Uc);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Oc(n,t[l]);let a=il.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Uc(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Oc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var wi=class i extends it{constructor(e=new xn([new $(.5,.5),new $(-.5,.5),new $(-.5,-.5),new $(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new We(s,3)),this.setAttribute("uv",new We(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:R4,M,_=!1,w,A,P,N;p&&(M=p.getSpacedPoints(h),_=!0,f=!1,w=p.computeFrenetFrames(h,!1),A=new R,P=new R,N=new R),f||(m=0,d=0,g=0,x=0);let b=a.extractPoints(c),y=b.shape,C=b.holes;if(!Tn.isClockWise(y)){y=y.reverse();for(let se=0,ee=C.length;se<ee;se++){let Q=C[se];Tn.isClockWise(Q)&&(C[se]=Q.reverse())}}function F(se){let Q=10000000000000001e-36,j=se[0];for(let fe=1;fe<=se.length;fe++){let oe=fe%se.length,pe=se[oe],Be=pe.x-j.x,Oe=pe.y-j.y,T=Be*Be+Oe*Oe,v=Math.max(Math.abs(pe.x),Math.abs(pe.y),Math.abs(j.x),Math.abs(j.y)),k=Q*v*v;if(T<=k){se.splice(oe,1),fe--;continue}j=pe}}F(y),C.forEach(F);let H=C.length,V=y;for(let se=0;se<H;se++){let ee=C[se];y=y.concat(ee)}function D(se,ee,Q){return ee||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(ee,Q)}let G=y.length;function B(se,ee,Q){let j,fe,oe,pe=se.x-ee.x,Be=se.y-ee.y,Oe=Q.x-se.x,T=Q.y-se.y,v=pe*pe+Be*Be,k=pe*T-Be*Oe;if(Math.abs(k)>Number.EPSILON){let Y=Math.sqrt(v),ie=Math.sqrt(Oe*Oe+T*T),Z=ee.x-Be/Y,Se=ee.y+pe/Y,he=Q.x-T/ie,be=Q.y+Oe/ie,Ae=((he-Z)*T-(be-Se)*Oe)/(pe*T-Be*Oe);j=Z+pe*Ae-se.x,fe=Se+Be*Ae-se.y;let le=j*j+fe*fe;if(le<=2)return new $(j,fe);oe=Math.sqrt(le/2)}else{let Y=!1;pe>Number.EPSILON?Oe>Number.EPSILON&&(Y=!0):pe<-Number.EPSILON?Oe<-Number.EPSILON&&(Y=!0):Math.sign(Be)===Math.sign(T)&&(Y=!0),Y?(j=-Be,fe=pe,oe=Math.sqrt(v)):(j=pe,fe=Be,oe=Math.sqrt(v/2))}return new $(j/oe,fe/oe)}let X=[];for(let se=0,ee=V.length,Q=ee-1,j=se+1;se<ee;se++,Q++,j++)Q===ee&&(Q=0),j===ee&&(j=0),X[se]=B(V[se],V[Q],V[j]);let K=[],re,ye=X.concat();for(let se=0,ee=H;se<ee;se++){let Q=C[se];re=[];for(let j=0,fe=Q.length,oe=fe-1,pe=j+1;j<fe;j++,oe++,pe++)oe===fe&&(oe=0),pe===fe&&(pe=0),re[j]=B(Q[j],Q[oe],Q[pe]);K.push(re),ye=ye.concat(re)}let Ie;if(m===0)Ie=Tn.triangulateShape(V,C);else{let se=[],ee=[];for(let Q=0;Q<m;Q++){let j=Q/m,fe=d*Math.cos(j*Math.PI/2),oe=g*Math.sin(j*Math.PI/2)+x;for(let pe=0,Be=V.length;pe<Be;pe++){let Oe=D(V[pe],X[pe],oe);Te(Oe.x,Oe.y,-fe),j===0&&se.push(Oe)}for(let pe=0,Be=H;pe<Be;pe++){let Oe=C[pe];re=K[pe];let T=[];for(let v=0,k=Oe.length;v<k;v++){let Y=D(Oe[v],re[v],oe);Te(Y.x,Y.y,-fe),j===0&&T.push(Y)}j===0&&ee.push(T)}}Ie=Tn.triangulateShape(se,ee)}let Ve=Ie.length,Xe=g+x;for(let se=0;se<G;se++){let ee=f?D(y[se],ye[se],Xe):y[se];_?(P.copy(w.normals[0]).multiplyScalar(ee.x),A.copy(w.binormals[0]).multiplyScalar(ee.y),N.copy(M[0]).add(P).add(A),Te(N.x,N.y,N.z)):Te(ee.x,ee.y,0)}for(let se=1;se<=h;se++)for(let ee=0;ee<G;ee++){let Q=f?D(y[ee],ye[ee],Xe):y[ee];_?(P.copy(w.normals[se]).multiplyScalar(Q.x),A.copy(w.binormals[se]).multiplyScalar(Q.y),N.copy(M[se]).add(P).add(A),Te(N.x,N.y,N.z)):Te(Q.x,Q.y,u/h*se)}for(let se=m-1;se>=0;se--){let ee=se/m,Q=d*Math.cos(ee*Math.PI/2),j=g*Math.sin(ee*Math.PI/2)+x;for(let fe=0,oe=V.length;fe<oe;fe++){let pe=D(V[fe],X[fe],j);Te(pe.x,pe.y,u+Q)}for(let fe=0,oe=C.length;fe<oe;fe++){let pe=C[fe];re=K[fe];for(let Be=0,Oe=pe.length;Be<Oe;Be++){let T=D(pe[Be],re[Be],j);_?Te(T.x,T.y+M[h-1].y,M[h-1].x+Q):Te(T.x,T.y,u+Q)}}}J(),te();function J(){let se=s.length/3;if(f){let ee=0,Q=G*ee;for(let j=0;j<Ve;j++){let fe=Ie[j];Me(fe[2]+Q,fe[1]+Q,fe[0]+Q)}ee=h+m*2,Q=G*ee;for(let j=0;j<Ve;j++){let fe=Ie[j];Me(fe[0]+Q,fe[1]+Q,fe[2]+Q)}}else{for(let ee=0;ee<Ve;ee++){let Q=Ie[ee];Me(Q[2],Q[1],Q[0])}for(let ee=0;ee<Ve;ee++){let Q=Ie[ee];Me(Q[0]+G*h,Q[1]+G*h,Q[2]+G*h)}}n.addGroup(se,s.length/3-se,0)}function te(){let se=s.length/3,ee=0;_e(V,ee),ee+=V.length;for(let Q=0,j=C.length;Q<j;Q++){let fe=C[Q];_e(fe,ee),ee+=fe.length}n.addGroup(se,s.length/3-se,1)}function _e(se,ee){let Q=se.length;for(;--Q>=0;){let j=Q,fe=Q-1;fe<0&&(fe=se.length-1);for(let oe=0,pe=h+m*2;oe<pe;oe++){let Be=G*oe,Oe=G*(oe+1),T=ee+j+Be,v=ee+fe+Be,k=ee+fe+Oe,Y=ee+j+Oe;Ke(T,v,k,Y)}}}function Te(se,ee,Q){l.push(se),l.push(ee),l.push(Q)}function Me(se,ee,Q){tt(se),tt(ee),tt(Q);let j=s.length/3,fe=E.generateTopUV(n,s,j-3,j-2,j-1);I(fe[0]),I(fe[1]),I(fe[2])}function Ke(se,ee,Q,j){tt(se),tt(ee),tt(j),tt(ee),tt(Q),tt(j);let fe=s.length/3,oe=E.generateSideWallUV(n,s,fe-6,fe-3,fe-2,fe-1);I(oe[0]),I(oe[1]),I(oe[3]),I(oe[1]),I(oe[2]),I(oe[3])}function tt(se){s.push(l[se*3+0]),s.push(l[se*3+1]),s.push(l[se*3+2])}function I(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return C4(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Wo[s.type]().fromJSON(s)),new i(n,e.options)}},R4={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new $(r,o),new $(a,l),new $(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[s*3],d=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new $(o,1-l),new $(c,1-u),new $(f,1-g),new $(x,1-p)]:[new $(a,1-l),new $(h,1-u),new $(d,1-g),new $(m,1-p)]}};function C4(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var jt=class i extends it{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,f=t/l,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let E=p*f-o;for(let M=0;M<c;M++){let _=M*u-r;g.push(_,-E,0),x.push(0,0,1),m.push(M/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<a;E++){let M=E+c*p,_=E+c*(p+1),w=E+1+c*(p+1),A=E+1+c*p;d.push(M,_,A),d.push(_,w,A)}this.setIndex(d),this.setAttribute("position",new We(g,3)),this.setAttribute("normal",new We(x,3)),this.setAttribute("uv",new We(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var ei=class i extends it{constructor(e=new xn([new $(0,.5),new $(-.5,-.5),new $(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new We(s,3)),this.setAttribute("normal",new We(r,3)),this.setAttribute("uv",new We(o,2));function c(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,g=f.holes;Tn.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){let E=g[m];Tn.isClockWise(E)===!0&&(g[m]=E.reverse())}let x=Tn.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){let E=g[m];d=d.concat(E)}for(let m=0,p=d.length;m<p;m++){let E=d[m];s.push(E.x,E.y,0),r.push(0,0,1),o.push(E.x,E.y)}for(let m=0,p=x.length;m<p;m++){let E=x[m],M=E[0]+u,_=E[1]+u,w=E[2]+u;n.push(M,_,w),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return P4(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function P4(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Ai=class i extends it{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new R,f=new R,d=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let E=[],M=p/n,_=0;p===0&&o===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let w=0;w<=t;w++){let A=w/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+M*a),u.y=e*Math.cos(o+M*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(A+_,1-M),E.push(c++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){let M=h[p][E+1],_=h[p][E],w=h[p+1][E],A=h[p+1][E+1];(p!==0||o>0)&&d.push(M,_,A),(p!==n-1||l<Math.PI)&&d.push(_,w,A)}this.setIndex(d),this.setAttribute("position",new We(g,3)),this.setAttribute("normal",new We(x,3)),this.setAttribute("uv",new We(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _r=class i extends it{constructor(e=new dr(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new R,l=new R,c=new $,h=new R,u=[],f=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new We(u,3)),this.setAttribute("normal",new We(f,3)),this.setAttribute("uv",new We(d,2));function x(){for(let M=0;M<t;M++)m(M);m(r===!1?t:0),E(),p()}function m(M){h=e.getPointAt(M/t,h);let _=o.normals[M],w=o.binormals[M];for(let A=0;A<=s;A++){let P=A/s*Math.PI*2,N=Math.sin(P),b=-Math.cos(P);l.x=b*_.x+N*w.x,l.y=b*_.y+N*w.y,l.z=b*_.z+N*w.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let M=1;M<=t;M++)for(let _=1;_<=s;_++){let w=(s+1)*(M-1)+(_-1),A=(s+1)*M+(_-1),P=(s+1)*M+_,N=(s+1)*(M-1)+_;g.push(w,A,N),g.push(A,P,N)}}function E(){for(let M=0;M<=t;M++)for(let _=0;_<=s;_++)c.x=M/t,c.y=_/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Wo[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var xr=class extends Jt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ue(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}},vr=class extends bt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ht=class extends Jt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fr,this.normalScale=new $(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ri=class extends ht{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new $(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ye(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var yr=class extends Jt{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fr,this.normalScale=new $(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},Mr=class extends Jt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fr,this.normalScale=new $(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ga,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},qo=class extends Jt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ah,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Yo=class extends Jt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var br=class extends Dt{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Ao(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function I4(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ci=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Zo=class extends Ci{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$0,endingEnd:$0}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case j0:r=e,a=2*t-n;break;case Q0:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case j0:o=e,l=2*n-t;break;case Q0:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(s-t),x=g*g,m=x*g,p=-f*m+2*f*x-f*g,E=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,M=(-1-d)*m+(1.5+d)*x+.5*g,_=d*m-d*x;for(let w=0;w!==a;++w)r[w]=p*o[h+w]+E*o[c+w]+M*o[l+w]+_*o[u+w];return r}},Ko=class extends Ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},Jo=class extends Ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Qt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ao(t,this.TimeBufferType),this.values=Ao(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ao(e.times,Array),values:Ao(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Jo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ko(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Zo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Zs:t=this.InterpolantFactoryMethodDiscrete;break;case Do:t=this.InterpolantFactoryMethodLinear;break;case Ro:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zs;case this.InterpolantFactoryMethodLinear:return Do;case this.InterpolantFactoryMethodSmooth:return Ro}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&I4(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ro,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let x=t[u+g];if(x!==t[f+g]||x!==t[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Qt.prototype.ValueTypeName="";Qt.prototype.TimeBufferType=Float32Array;Qt.prototype.ValueBufferType=Float32Array;Qt.prototype.DefaultInterpolation=Do;var ti=class extends Qt{constructor(e,t,n){super(e,t,n)}};ti.prototype.ValueTypeName="bool";ti.prototype.ValueBufferType=Array;ti.prototype.DefaultInterpolation=Zs;ti.prototype.InterpolantFactoryMethodLinear=void 0;ti.prototype.InterpolantFactoryMethodSmooth=void 0;var $o=class extends Qt{constructor(e,t,n,s){super(e,t,n,s)}};$o.prototype.ValueTypeName="color";var jo=class extends Qt{constructor(e,t,n,s){super(e,t,n,s)}};jo.prototype.ValueTypeName="number";var Qo=class extends Ci{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)an.slerpFlat(r,0,o,c-a,o,c,l);return r}},Sr=class extends Qt{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Qo(this.times,this.values,this.getValueSize(),e)}};Sr.prototype.ValueTypeName="quaternion";Sr.prototype.InterpolantFactoryMethodSmooth=void 0;var ni=class extends Qt{constructor(e,t,n){super(e,t,n)}};ni.prototype.ValueTypeName="string";ni.prototype.ValueBufferType=Array;ni.prototype.DefaultInterpolation=Zs;ni.prototype.InterpolantFactoryMethodLinear=void 0;ni.prototype.InterpolantFactoryMethodSmooth=void 0;var ea=class extends Qt{constructor(e,t,n,s){super(e,t,n,s)}};ea.prototype.ValueTypeName="vector";var ta=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Th=new ta,na=class{constructor(e){this.manager=e!==void 0?e:Th,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};na.DEFAULT_MATERIAL_NAME="__DEFAULT";var Pi=class extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Er=class extends Pi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},K0=new Qe,Fc=new R,Bc=new R,ia=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ms,this._frameExtents=new $(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Fc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fc),Bc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Bc),t.updateMatrixWorld(),K0.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(K0,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(K0)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var zc=new Qe,Gs=new R,J0=new R,sl=class extends ia{constructor(){super(new kt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new $(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Gs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Gs),J0.copy(n.position),J0.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(J0),n.updateMatrixWorld(),s.makeTranslation(-Gs.x,-Gs.y,-Gs.z),zc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zc,n.coordinateSystem,n.reversedDepth)}},Tr=class extends Pi{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new sl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Hn=class extends tr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},rl=class extends ia{constructor(){super(new Hn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},vs=class extends Pi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new rl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},wr=class extends Pi{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var sa=class extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ar=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var Al="\\[\\]\\.:\\/",D4=new RegExp("["+Al+"]","g"),Rl="[^"+Al+"]",L4="[^"+Al.replace("\\.","")+"]",N4=/((?:WC+[\/:])*)/.source.replace("WC",Rl),U4=/(WCOD+)?/.source.replace("WCOD",L4),O4=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Rl),F4=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Rl),B4=new RegExp("^"+N4+U4+O4+F4+"$"),z4=["material","materials","bones","map"],ol=class{constructor(e,t,n){let s=n||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},dt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(D4,"")}static parseTrackName(e){let t=B4.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);z4.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};dt.Composite=ol;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var B3=new Float32Array(1);var kc=new Qe,Rr=class{constructor(e,t,n=0,s=1/0){this.ray=new jn(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new cs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return kc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(kc),this}intersectObject(e,t=!0,n=[]){return al(e,this,n,t),n.sort(Hc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)al(e[s],this,n,t);return n.sort(Hc),n}};function Hc(i,e){return i.distance-e.distance}function al(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)al(r[o],e,t,!0)}}var ys=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ye(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ye(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Cr=class extends An{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Cl(i,e,t,n){let s=k4(n);switch(t){case xl:return i*e;case Ss:return i*e/s.components*s.byteLength;case Ca:return i*e/s.components*s.byteLength;case yl:return i*e*2/s.components*s.byteLength;case Pa:return i*e*2/s.components*s.byteLength;case vl:return i*e*3/s.components*s.byteLength;case cn:return i*e*4/s.components*s.byteLength;case Ia:return i*e*4/s.components*s.byteLength;case Lr:case Nr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ur:case Or:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case La:case Ua:return Math.max(i,16)*Math.max(e,8)/4;case Da:case Na:return Math.max(i,8)*Math.max(e,8)/2;case Oa:case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ka:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Va:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ga:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Wa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ya:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case $a:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ja:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qa:case e0:case t0:return Math.ceil(i/4)*Math.ceil(e/4)*16;case n0:case i0:return Math.ceil(i/4)*Math.ceil(e/4)*8;case s0:case r0:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function k4(i){switch(i){case vn:case pl:return{byteLength:1,components:1};case bs:case ml:case yn:return{byteLength:2,components:1};case Aa:case Ra:return{byteLength:2,components:4};case oi:case wa:case en:return{byteLength:4,components:1};case gl:case _l:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Kh(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function W4(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],x=u[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let x=u[d];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var X4=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,q4=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Y4=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Z4=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,K4=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,J4=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$4=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,j4=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Q4=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ed=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,td=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,id=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ud=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,fd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,md=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_d=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Md="gl_FragColor = linearToOutputTexel( gl_FragColor );",bd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ed=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Td=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ad=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Id=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Dd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ld=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ud=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Od=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Fd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$d=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ef=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,of=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,af=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,df=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ff=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_f=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ef=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Af=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Rf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,If=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Df=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Uf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Of=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ff=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Xf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,e1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,t1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,n1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,r1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,o1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,l1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,h1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,d1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,f1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,g1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,x1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,y1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,S1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,E1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:X4,alphahash_pars_fragment:q4,alphamap_fragment:Y4,alphamap_pars_fragment:Z4,alphatest_fragment:K4,alphatest_pars_fragment:J4,aomap_fragment:$4,aomap_pars_fragment:j4,batching_pars_vertex:Q4,batching_vertex:ed,begin_vertex:td,beginnormal_vertex:nd,bsdfs:id,iridescence_fragment:sd,bumpmap_pars_fragment:rd,clipping_planes_fragment:od,clipping_planes_pars_fragment:ad,clipping_planes_pars_vertex:ld,clipping_planes_vertex:cd,color_fragment:hd,color_pars_fragment:ud,color_pars_vertex:dd,color_vertex:fd,common:pd,cube_uv_reflection_fragment:md,defaultnormal_vertex:gd,displacementmap_pars_vertex:_d,displacementmap_vertex:xd,emissivemap_fragment:vd,emissivemap_pars_fragment:yd,colorspace_fragment:Md,colorspace_pars_fragment:bd,envmap_fragment:Sd,envmap_common_pars_fragment:Ed,envmap_pars_fragment:Td,envmap_pars_vertex:wd,envmap_physical_pars_fragment:Fd,envmap_vertex:Ad,fog_vertex:Rd,fog_pars_vertex:Cd,fog_fragment:Pd,fog_pars_fragment:Id,gradientmap_pars_fragment:Dd,lightmap_pars_fragment:Ld,lights_lambert_fragment:Nd,lights_lambert_pars_fragment:Ud,lights_pars_begin:Od,lights_toon_fragment:Bd,lights_toon_pars_fragment:zd,lights_phong_fragment:kd,lights_phong_pars_fragment:Hd,lights_physical_fragment:Vd,lights_physical_pars_fragment:Gd,lights_fragment_begin:Wd,lights_fragment_maps:Xd,lights_fragment_end:qd,logdepthbuf_fragment:Yd,logdepthbuf_pars_fragment:Zd,logdepthbuf_pars_vertex:Kd,logdepthbuf_vertex:Jd,map_fragment:$d,map_pars_fragment:jd,map_particle_fragment:Qd,map_particle_pars_fragment:ef,metalnessmap_fragment:tf,metalnessmap_pars_fragment:nf,morphinstance_vertex:sf,morphcolor_vertex:rf,morphnormal_vertex:of,morphtarget_pars_vertex:af,morphtarget_vertex:lf,normal_fragment_begin:cf,normal_fragment_maps:hf,normal_pars_fragment:uf,normal_pars_vertex:df,normal_vertex:ff,normalmap_pars_fragment:pf,clearcoat_normal_fragment_begin:mf,clearcoat_normal_fragment_maps:gf,clearcoat_pars_fragment:_f,iridescence_pars_fragment:xf,opaque_fragment:vf,packing:yf,premultiplied_alpha_fragment:Mf,project_vertex:bf,dithering_fragment:Sf,dithering_pars_fragment:Ef,roughnessmap_fragment:Tf,roughnessmap_pars_fragment:wf,shadowmap_pars_fragment:Af,shadowmap_pars_vertex:Rf,shadowmap_vertex:Cf,shadowmask_pars_fragment:Pf,skinbase_vertex:If,skinning_pars_vertex:Df,skinning_vertex:Lf,skinnormal_vertex:Nf,specularmap_fragment:Uf,specularmap_pars_fragment:Of,tonemapping_fragment:Ff,tonemapping_pars_fragment:Bf,transmission_fragment:zf,transmission_pars_fragment:kf,uv_pars_fragment:Hf,uv_pars_vertex:Vf,uv_vertex:Gf,worldpos_vertex:Wf,background_vert:Xf,background_frag:qf,backgroundCube_vert:Yf,backgroundCube_frag:Zf,cube_vert:Kf,cube_frag:Jf,depth_vert:$f,depth_frag:jf,distanceRGBA_vert:Qf,distanceRGBA_frag:e1,equirect_vert:t1,equirect_frag:n1,linedashed_vert:i1,linedashed_frag:s1,meshbasic_vert:r1,meshbasic_frag:o1,meshlambert_vert:a1,meshlambert_frag:l1,meshmatcap_vert:c1,meshmatcap_frag:h1,meshnormal_vert:u1,meshnormal_frag:d1,meshphong_vert:f1,meshphong_frag:p1,meshphysical_vert:m1,meshphysical_frag:g1,meshtoon_vert:_1,meshtoon_frag:x1,points_vert:v1,points_frag:y1,shadow_vert:M1,shadow_frag:b1,sprite_vert:S1,sprite_frag:E1},ge={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new $(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new $(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Pn={basic:{uniforms:Ft([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Ft([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Ft([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Ft([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Ft([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Ft([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Ft([ge.points,ge.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Ft([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Ft([ge.common,ge.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Ft([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Ft([ge.sprite,ge.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Ft([ge.common,ge.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Ft([ge.lights,ge.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Pn.physical={uniforms:Ft([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new $(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new $},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new $},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var o0={r:0,b:0,g:0},Ni=new ln,T1=new Qe;function w1(i,e,t,n,s,r,o){let a=new Ue(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?t:e).get(_)),_}function x(M){let _=!1,w=g(M);w===null?p(a,l):w&&w.isColor&&(p(w,1),_=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){let w=g(_);w&&(w.isCubeTexture||w.mapping===Ir)?(h===void 0&&(h=new He(new It(1,1,1),new bt({name:"BackgroundCubeMaterial",uniforms:Li(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,P,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ni.copy(_.backgroundRotation),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(T1.makeRotationFromEuler(Ni)),h.material.toneMapped=$e.getTransfer(w.colorSpace)!==et,(u!==w||f!==w.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new He(new jt(2,2),new bt({name:"BackgroundMaterial",uniforms:Li(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=$e.getTransfer(w.colorSpace)!==et,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=w,f=w.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,_){M.getRGB(o0,Tl(i)),n.buffers.color.setClear(o0.r,o0.g,o0.b,_,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(a,l)},render:x,addToRenderList:m,dispose:E}}function A1(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(y,C,L,F,H){let V=!1,D=u(F,L,C);r!==D&&(r=D,c(r.object)),V=d(y,F,L,H),V&&g(y,F,L,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,_(y,C,L,F),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function u(y,C,L){let F=L.wireframe===!0,H=n[y.id];H===void 0&&(H={},n[y.id]=H);let V=H[C.id];V===void 0&&(V={},H[C.id]=V);let D=V[F];return D===void 0&&(D=f(l()),V[F]=D),D}function f(y){let C=[],L=[],F=[];for(let H=0;H<t;H++)C[H]=0,L[H]=0,F[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:L,attributeDivisors:F,object:y,attributes:{},index:null}}function d(y,C,L,F){let H=r.attributes,V=C.attributes,D=0,G=L.getAttributes();for(let B in G)if(G[B].location>=0){let K=H[B],re=V[B];if(re===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(re=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(re=y.instanceColor)),K===void 0||K.attribute!==re||re&&K.data!==re.data)return!0;D++}return r.attributesNum!==D||r.index!==F}function g(y,C,L,F){let H={},V=C.attributes,D=0,G=L.getAttributes();for(let B in G)if(G[B].location>=0){let K=V[B];K===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(K=y.instanceColor));let re={};re.attribute=K,K&&K.data&&(re.data=K.data),H[B]=re,D++}r.attributes=H,r.attributesNum=D,r.index=F}function x(){let y=r.newAttributes;for(let C=0,L=y.length;C<L;C++)y[C]=0}function m(y){p(y,0)}function p(y,C){let L=r.newAttributes,F=r.enabledAttributes,H=r.attributeDivisors;L[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),H[y]!==C&&(i.vertexAttribDivisor(y,C),H[y]=C)}function E(){let y=r.newAttributes,C=r.enabledAttributes;for(let L=0,F=C.length;L<F;L++)C[L]!==y[L]&&(i.disableVertexAttribArray(L),C[L]=0)}function M(y,C,L,F,H,V,D){D===!0?i.vertexAttribIPointer(y,C,L,H,V):i.vertexAttribPointer(y,C,L,F,H,V)}function _(y,C,L,F){x();let H=F.attributes,V=L.getAttributes(),D=C.defaultAttributeValues;for(let G in V){let B=V[G];if(B.location>=0){let X=H[G];if(X===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(X=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(X=y.instanceColor)),X!==void 0){let K=X.normalized,re=X.itemSize,ye=e.get(X);if(ye===void 0)continue;let Ie=ye.buffer,Ve=ye.type,Xe=ye.bytesPerElement,J=Ve===i.INT||Ve===i.UNSIGNED_INT||X.gpuType===wa;if(X.isInterleavedBufferAttribute){let te=X.data,_e=te.stride,Te=X.offset;if(te.isInstancedInterleavedBuffer){for(let Me=0;Me<B.locationSize;Me++)p(B.location+Me,te.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Me=0;Me<B.locationSize;Me++)m(B.location+Me);i.bindBuffer(i.ARRAY_BUFFER,Ie);for(let Me=0;Me<B.locationSize;Me++)M(B.location+Me,re/B.locationSize,Ve,K,_e*Xe,(Te+re/B.locationSize*Me)*Xe,J)}else{if(X.isInstancedBufferAttribute){for(let te=0;te<B.locationSize;te++)p(B.location+te,X.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let te=0;te<B.locationSize;te++)m(B.location+te);i.bindBuffer(i.ARRAY_BUFFER,Ie);for(let te=0;te<B.locationSize;te++)M(B.location+te,re/B.locationSize,Ve,K,re*Xe,re/B.locationSize*te*Xe,J)}}else if(D!==void 0){let K=D[G];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(B.location,K);break;case 3:i.vertexAttrib3fv(B.location,K);break;case 4:i.vertexAttrib4fv(B.location,K);break;default:i.vertexAttrib1fv(B.location,K)}}}}E()}function w(){N();for(let y in n){let C=n[y];for(let L in C){let F=C[L];for(let H in F)h(F[H].object),delete F[H];delete C[L]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;let C=n[y.id];for(let L in C){let F=C[L];for(let H in F)h(F[H].object),delete F[H];delete C[L]}delete n[y.id]}function P(y){for(let C in n){let L=n[C];if(L[y.id]===void 0)continue;let F=L[y.id];for(let H in F)h(F[H].object),delete F[H];delete L[y.id]}}function N(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:N,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function R1(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,n,1)}function l(c,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function C1(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==cn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let N=P===yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==vn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==en&&!N)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:w,maxSamples:A}}function P1(i){let e=this,t=null,n=0,s=!1,r=!1,o=new on,a=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let E=r?0:n,M=E*4,_=p.clippingState||null;l.value=_,_=h(g,f,M,d);for(let w=0;w!==M;++w)_[w]=t[w];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=d+x*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,_=d;M!==x;++M,_+=4)o.copy(u[M]).applyMatrix4(E,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function I1(i){let e=new WeakMap;function t(o,a){return a===Sa?o.mapping=Ii:a===Ea&&(o.mapping=Di),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Sa||a===Ea)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Bo(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ts=4,wh=[.125,.215,.35,.446,.526,.582],Fi=20,Pl=new Hn,Ah=new Ue,Il=null,Dl=0,Ll=0,Nl=!1,Oi=(1+Math.sqrt(5))/2,Es=1/Oi,Rh=[new R(-Oi,Es,0),new R(Oi,Es,0),new R(-Es,0,Oi),new R(Es,0,Oi),new R(0,Oi,-Es),new R(0,Oi,Es),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],D1=new R,As=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=D1}=r;Il=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Ll=this._renderer.getActiveMipmapLevel(),Nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Il,Dl,Ll),this._renderer.xr.enabled=Nl,e.scissorTest=!1,a0(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ii||e.mapping===Di?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Il=this._renderer.getRenderTarget(),Dl=this._renderer.getActiveCubeFace(),Ll=this._renderer.getActiveMipmapLevel(),Nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:_n,minFilter:_n,generateMipmaps:!1,type:yn,format:cn,colorSpace:yi,depthBuffer:!1},s=Ch(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ch(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=L1(r)),this._blurMaterial=N1(r,e,t)}return s}_compileMaterial(e){let t=new He(this._lodPlanes[0],e);this._renderer.compile(t,Pl)}_sceneToCubeUV(e,t,n,s,r){let l=new kt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Ah),u.toneMapping=Vn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new Ot({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),m=new He(new It,x),p=!1,E=e.background;E?E.isColor&&(x.color.copy(E),e.background=null,p=!0):(x.color.copy(Ah),p=!0);for(let M=0;M<6;M++){let _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let w=this._cubeSize;a0(s,_*w,M>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=E}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ii||e.mapping===Di;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ph());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new He(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;a0(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Pl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Rh[(s-r-1)%Rh.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new He(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Fi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):Fi;m>Fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Fi}`);let p=[],E=0;for(let P=0;P<Fi;++P){let N=P/x,b=Math.exp(-N*N/2);p.push(b),P===0?E+=b:P<m&&(E+=2*b)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;let _=this._sizeLods[s],w=3*_*(s>M-Ts?s-M+Ts:0),A=4*(this._cubeSize-_);a0(t,w,A,3*_,2*_),l.setRenderTarget(t),l.render(u,Pl)}};function L1(i){let e=[],t=[],n=[],s=i,r=i-Ts+1+wh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Ts?l=wh[o-i+Ts-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,E=new Float32Array(x*g*d),M=new Float32Array(m*g*d),_=new Float32Array(p*g*d);for(let A=0;A<d;A++){let P=A%3*2/3-1,N=A>2?0:-1,b=[P,N,0,P+2/3,N,0,P+2/3,N+1,0,P,N,0,P+2/3,N+1,0,P,N+1,0];E.set(b,x*g*A),M.set(f,m*g*A);let y=[A,A,A,A,A,A];_.set(y,p*g*A)}let w=new it;w.setAttribute("position",new Ct(E,x)),w.setAttribute("uv",new Ct(M,m)),w.setAttribute("faceIndex",new Ct(_,p)),e.push(w),s>Ts&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ch(i,e,t){let n=new Vt(i,e,t);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function a0(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function N1(i,e,t){let n=new Float32Array(Fi),s=new R(0,1,0);return new bt({name:"SphericalGaussianBlur",defines:{n:Fi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Ph(){return new bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Ih(){return new bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rt,depthTest:!1,depthWrite:!1})}function Xl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function U1(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Sa||l===Ea,h=l===Ii||l===Di;if(c||h){let u=e.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new As(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new As(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function O1(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&as("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function F1(i,e,t,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let d in f)e.update(f[d],i.ARRAY_BUFFER)}function c(u){let f=[],d=u.index,g=u.attributes.position,x=0;if(d!==null){let E=d.array;x=d.version;for(let M=0,_=E.length;M<_;M+=3){let w=E[M+0],A=E[M+1],P=E[M+2];f.push(w,A,A,P,P,w)}}else if(g!==void 0){let E=g.array;x=g.version;for(let M=0,_=E.length/3-1;M<_;M+=3){let w=M+0,A=M+1,P=M+2;f.push(w,A,A,P,P,w)}}else return;let m=new(El(f)?er:Qs)(f,1);m.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function B1(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){i.drawElements(n,d,r,f*o),t.update(d,n,1)}function c(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,f*o,g),t.update(d,n,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function u(f,d,g,x){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,g);let p=0;for(let E=0;E<g;E++)p+=d[E]*x[E];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function z1(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function k1(i,e,t){let n=new WeakMap,s=new rt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],M=0;d===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let _=a.attributes.position.count*M,w=1;_>e.maxTextureSize&&(w=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let A=new Float32Array(_*w*4*u),P=new js(A,_,w,u);P.type=en,P.needsUpdate=!0;let N=M*4;for(let y=0;y<u;y++){let C=m[y],L=p[y],F=E[y],H=_*w*4*y;for(let V=0;V<C.count;V++){let D=V*N;d===!0&&(s.fromBufferAttribute(C,V),A[H+D+0]=s.x,A[H+D+1]=s.y,A[H+D+2]=s.z,A[H+D+3]=0),g===!0&&(s.fromBufferAttribute(L,V),A[H+D+4]=s.x,A[H+D+5]=s.y,A[H+D+6]=s.z,A[H+D+7]=0),x===!0&&(s.fromBufferAttribute(F,V),A[H+D+8]=s.x,A[H+D+9]=s.y,A[H+D+10]=s.z,A[H+D+11]=F.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new $(_,w)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function H1(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Jh=new Ht,Dh=new bi(1,1),$h=new js,jh=new Oo,Qh=new nr,Lh=[],Nh=[],Uh=new Float32Array(16),Oh=new Float32Array(9),Fh=new Float32Array(4);function Rs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Lh[s];if(r===void 0&&(r=new Float32Array(s),Lh[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Et(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function h0(i,e){let t=Nh[e];t===void 0&&(t=new Int32Array(e),Nh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function V1(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function G1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function W1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function X1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function q1(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Fh.set(n),i.uniformMatrix2fv(this.addr,!1,Fh),Tt(t,n)}}function Y1(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Oh.set(n),i.uniformMatrix3fv(this.addr,!1,Oh),Tt(t,n)}}function Z1(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Uh.set(n),i.uniformMatrix4fv(this.addr,!1,Uh),Tt(t,n)}}function K1(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function J1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function $1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function j1(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function Q1(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ep(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function tp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function np(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function ip(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Dh.compareFunction=Ml,r=Dh):r=Jh,t.setTexture2D(e||r,s)}function sp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||jh,s)}function rp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Qh,s)}function op(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||$h,s)}function ap(i){switch(i){case 5126:return V1;case 35664:return G1;case 35665:return W1;case 35666:return X1;case 35674:return q1;case 35675:return Y1;case 35676:return Z1;case 5124:case 35670:return K1;case 35667:case 35671:return J1;case 35668:case 35672:return $1;case 35669:case 35673:return j1;case 5125:return Q1;case 36294:return ep;case 36295:return tp;case 36296:return np;case 35678:case 36198:case 36298:case 36306:case 35682:return ip;case 35679:case 36299:case 36307:return sp;case 35680:case 36300:case 36308:case 36293:return rp;case 36289:case 36303:case 36311:case 36292:return op}}function lp(i,e){i.uniform1fv(this.addr,e)}function cp(i,e){let t=Rs(e,this.size,2);i.uniform2fv(this.addr,t)}function hp(i,e){let t=Rs(e,this.size,3);i.uniform3fv(this.addr,t)}function up(i,e){let t=Rs(e,this.size,4);i.uniform4fv(this.addr,t)}function dp(i,e){let t=Rs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function fp(i,e){let t=Rs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pp(i,e){let t=Rs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function mp(i,e){i.uniform1iv(this.addr,e)}function gp(i,e){i.uniform2iv(this.addr,e)}function _p(i,e){i.uniform3iv(this.addr,e)}function xp(i,e){i.uniform4iv(this.addr,e)}function vp(i,e){i.uniform1uiv(this.addr,e)}function yp(i,e){i.uniform2uiv(this.addr,e)}function Mp(i,e){i.uniform3uiv(this.addr,e)}function bp(i,e){i.uniform4uiv(this.addr,e)}function Sp(i,e,t){let n=this.cache,s=e.length,r=h0(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Jh,r[o])}function Ep(i,e,t){let n=this.cache,s=e.length,r=h0(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||jh,r[o])}function Tp(i,e,t){let n=this.cache,s=e.length,r=h0(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Qh,r[o])}function wp(i,e,t){let n=this.cache,s=e.length,r=h0(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),Tt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||$h,r[o])}function Ap(i){switch(i){case 5126:return lp;case 35664:return cp;case 35665:return hp;case 35666:return up;case 35674:return dp;case 35675:return fp;case 35676:return pp;case 5124:case 35670:return mp;case 35667:case 35671:return gp;case 35668:case 35672:return _p;case 35669:case 35673:return xp;case 5125:return vp;case 36294:return yp;case 36295:return Mp;case 36296:return bp;case 35678:case 36198:case 36298:case 36306:case 35682:return Sp;case 35679:case 36299:case 36307:return Ep;case 35680:case 36300:case 36308:case 36293:return Tp;case 36289:case 36303:case 36311:case 36292:return wp}}var Ol=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ap(t.type)}},Fl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ap(t.type)}},Bl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ul=/(\w+)(\])?(\[|\.)?/g;function Bh(i,e){i.seq.push(e),i.map[e.id]=e}function Rp(i,e,t){let n=i.name,s=n.length;for(Ul.lastIndex=0;;){let r=Ul.exec(n),o=Ul.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Bh(t,c===void 0?new Ol(a,i,e):new Fl(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Bl(a),Bh(t,u)),t=u}}}var ws=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Rp(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function zh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Cp=37297,Pp=0;function Ip(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var kh=new qe;function Dp(i){$e._getMatrix(kh,$e.workingColorSpace,i);let e=`mat3( ${kh.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case Ks:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Hh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Ip(i.getShaderSource(e),a)}else return r}function Lp(i,e){let t=Dp(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Np(i,e){let t;switch(e){case _a:t="Linear";break;case xa:t="Reinhard";break;case va:t="Cineon";break;case Ms:t="ACESFilmic";break;case Ma:t="AgX";break;case ba:t="Neutral";break;case ya:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var l0=new R;function Up(){$e.getLuminanceCoefficients(l0);let i=l0.x.toFixed(4),e=l0.y.toFixed(4),t=l0.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Op(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Br).join(`
`)}function Fp(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Bp(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Br(i){return i!==""}function Vh(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var zp=/^[ \t]*#include +<([\w\d./]+)>/gm;function zl(i){return i.replace(zp,Hp)}var kp=new Map;function Hp(i,e){let t=Ze[e];if(t===void 0){let n=kp.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zl(t)}var Vp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wh(i){return i.replace(Vp,Gp)}function Gp(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Wp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===cl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ra?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(e="SHADOWMAP_TYPE_VSM"),e}function Xp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ii:case Di:e="ENVMAP_TYPE_CUBE";break;case Ir:e="ENVMAP_TYPE_CUBE_UV";break}return e}function qp(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Di:e="ENVMAP_MODE_REFRACTION";break}return e}function Yp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ga:e="ENVMAP_BLENDING_MULTIPLY";break;case sh:e="ENVMAP_BLENDING_MIX";break;case rh:e="ENVMAP_BLENDING_ADD";break}return e}function Zp(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Kp(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Wp(t),c=Xp(t),h=qp(t),u=Yp(t),f=Zp(t),d=Op(t),g=Fp(r),x=s.createProgram(),m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Br).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Br).join(`
`),p.length>0&&(p+=`
`)):(m=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Br).join(`
`),p=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Vn?Np("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Lp("linearToOutputTexel",t.outputColorSpace),Up(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Br).join(`
`)),o=zl(o),o=Vh(o,t),o=Gh(o,t),a=zl(a),a=Vh(a,t),a=Gh(a,t),o=Wh(o),a=Wh(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===bl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=E+m+o,_=E+p+a,w=zh(s,s.VERTEX_SHADER,M),A=zh(s,s.FRAGMENT_SHADER,_);s.attachShader(x,w),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function P(C){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(x)||"",F=s.getShaderInfoLog(w)||"",H=s.getShaderInfoLog(A)||"",V=L.trim(),D=F.trim(),G=H.trim(),B=!0,X=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,A);else{let K=Hh(s,w,"vertex"),re=Hh(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+V+`
`+K+`
`+re)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(D===""||G==="")&&(X=!1);X&&(C.diagnostics={runnable:B,programLog:V,vertexShader:{log:D,prefix:m},fragmentShader:{log:G,prefix:p}})}s.deleteShader(w),s.deleteShader(A),N=new ws(s,x),b=Bp(s,x)}let N;this.getUniforms=function(){return N===void 0&&P(this),N};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(x,Cp)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Pp++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=A,this}var Jp=0,kl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Hl(e),t.set(e,n)),n}},Hl=class{constructor(e){this.id=Jp++,this.code=e,this.usedTimes=0}};function $p(i,e,t,n,s,r,o){let a=new cs,l=new kl,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,y,C,L,F){let H=L.fog,V=F.geometry,D=b.isMeshStandardMaterial?L.environment:null,G=(b.isMeshStandardMaterial?t:e).get(b.envMap||D),B=G&&G.mapping===Ir?G.image.height:null,X=g[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));let K=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,re=K!==void 0?K.length:0,ye=0;V.morphAttributes.position!==void 0&&(ye=1),V.morphAttributes.normal!==void 0&&(ye=2),V.morphAttributes.color!==void 0&&(ye=3);let Ie,Ve,Xe,J;if(X){let nt=Pn[X];Ie=nt.vertexShader,Ve=nt.fragmentShader}else Ie=b.vertexShader,Ve=b.fragmentShader,l.update(b),Xe=l.getVertexShaderID(b),J=l.getFragmentShaderID(b);let te=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),Te=F.isInstancedMesh===!0,Me=F.isBatchedMesh===!0,Ke=!!b.map,tt=!!b.matcap,I=!!G,se=!!b.aoMap,ee=!!b.lightMap,Q=!!b.bumpMap,j=!!b.normalMap,fe=!!b.displacementMap,oe=!!b.emissiveMap,pe=!!b.metalnessMap,Be=!!b.roughnessMap,Oe=b.anisotropy>0,T=b.clearcoat>0,v=b.dispersion>0,k=b.iridescence>0,Y=b.sheen>0,ie=b.transmission>0,Z=Oe&&!!b.anisotropyMap,Se=T&&!!b.clearcoatMap,he=T&&!!b.clearcoatNormalMap,be=T&&!!b.clearcoatRoughnessMap,Ae=k&&!!b.iridescenceMap,le=k&&!!b.iridescenceThicknessMap,xe=Y&&!!b.sheenColorMap,Ne=Y&&!!b.sheenRoughnessMap,Pe=!!b.specularMap,me=!!b.specularColorMap,ze=!!b.specularIntensityMap,U=ie&&!!b.transmissionMap,ae=ie&&!!b.thicknessMap,de=!!b.gradientMap,we=!!b.alphaMap,ce=b.alphaTest>0,ne=!!b.alphaHash,Ce=!!b.extensions,Ge=Vn;b.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let ct={shaderID:X,shaderType:b.type,shaderName:b.name,vertexShader:Ie,fragmentShader:Ve,defines:b.defines,customVertexShaderID:Xe,customFragmentShaderID:J,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Me,batchingColor:Me&&F._colorsTexture!==null,instancing:Te,instancingColor:Te&&F.instanceColor!==null,instancingMorph:Te&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:yi,alphaToCoverage:!!b.alphaToCoverage,map:Ke,matcap:tt,envMap:I,envMapMode:I&&G.mapping,envMapCubeUVHeight:B,aoMap:se,lightMap:ee,bumpMap:Q,normalMap:j,displacementMap:f&&fe,emissiveMap:oe,normalMapObjectSpace:j&&b.normalMapType===ch,normalMapTangentSpace:j&&b.normalMapType===Fr,metalnessMap:pe,roughnessMap:Be,anisotropy:Oe,anisotropyMap:Z,clearcoat:T,clearcoatMap:Se,clearcoatNormalMap:he,clearcoatRoughnessMap:be,dispersion:v,iridescence:k,iridescenceMap:Ae,iridescenceThicknessMap:le,sheen:Y,sheenColorMap:xe,sheenRoughnessMap:Ne,specularMap:Pe,specularColorMap:me,specularIntensityMap:ze,transmission:ie,transmissionMap:U,thicknessMap:ae,gradientMap:de,opaque:b.transparent===!1&&b.blending===_i&&b.alphaToCoverage===!1,alphaMap:we,alphaTest:ce,alphaHash:ne,combine:b.combine,mapUv:Ke&&x(b.map.channel),aoMapUv:se&&x(b.aoMap.channel),lightMapUv:ee&&x(b.lightMap.channel),bumpMapUv:Q&&x(b.bumpMap.channel),normalMapUv:j&&x(b.normalMap.channel),displacementMapUv:fe&&x(b.displacementMap.channel),emissiveMapUv:oe&&x(b.emissiveMap.channel),metalnessMapUv:pe&&x(b.metalnessMap.channel),roughnessMapUv:Be&&x(b.roughnessMap.channel),anisotropyMapUv:Z&&x(b.anisotropyMap.channel),clearcoatMapUv:Se&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:he&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:le&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&x(b.sheenRoughnessMap.channel),specularMapUv:Pe&&x(b.specularMap.channel),specularColorMapUv:me&&x(b.specularColorMap.channel),specularIntensityMapUv:ze&&x(b.specularIntensityMap.channel),transmissionMapUv:U&&x(b.transmissionMap.channel),thicknessMapUv:ae&&x(b.thicknessMap.channel),alphaMapUv:we&&x(b.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(j||Oe),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!V.attributes.uv&&(Ke||we),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:F.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:ye,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Ke&&b.map.isVideoTexture===!0&&$e.getTransfer(b.map.colorSpace)===et,decodeVideoTextureEmissive:oe&&b.emissiveMap.isVideoTexture===!0&&$e.getTransfer(b.emissiveMap.colorSpace)===et,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===vt,flipSided:b.side===Lt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ce&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&b.extensions.multiDraw===!0||Me)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ct.vertexUv1s=c.has(1),ct.vertexUv2s=c.has(2),ct.vertexUv3s=c.has(3),c.clear(),ct}function p(b){let y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(let C in b.defines)y.push(C),y.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(E(y,b),M(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function E(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function M(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function _(b){let y=g[b.type],C;if(y){let L=Pn[y];C=Mn.clone(L.uniforms)}else C=b.uniforms;return C}function w(b,y){let C;for(let L=0,F=h.length;L<F;L++){let H=h[L];if(H.cacheKey===y){C=H,++C.usedTimes;break}}return C===void 0&&(C=new Kp(i,y,b,r),h.push(C)),C}function A(b){if(--b.usedTimes===0){let y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function P(b){l.remove(b)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:w,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:N}}function jp(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Qp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function qh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Yh(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,f,d,g,x,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),e++,p}function a(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):t.push(p)}function l(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||Qp),n.length>1&&n.sort(f||qh),s.length>1&&s.sort(f||qh)}function h(){for(let u=e,f=i.length;u<f;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function e3(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Yh,i.set(n,[o])):s>=r.length?(o=new Yh,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function t3(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Ue};break;case"SpotLight":t={position:new R,direction:new R,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function n3(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var i3=0;function s3(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function r3(i){let e=new t3,t=n3(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let s=new R,r=new Qe,o=new Qe;function a(c){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,E=0,M=0,_=0,w=0,A=0,P=0;c.sort(s3);for(let b=0,y=c.length;b<y;b++){let C=c[b],L=C.color,F=C.intensity,H=C.distance,V=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=L.r*F,u+=L.g*F,f+=L.b*F;else if(C.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(C.sh.coefficients[D],F);P++}else if(C.isDirectionalLight){let D=e.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let G=C.shadow,B=t.get(C);B.shadowIntensity=G.intensity,B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,n.directionalShadow[d]=B,n.directionalShadowMap[d]=V,n.directionalShadowMatrix[d]=C.shadow.matrix,E++}n.directional[d]=D,d++}else if(C.isSpotLight){let D=e.get(C);D.position.setFromMatrixPosition(C.matrixWorld),D.color.copy(L).multiplyScalar(F),D.distance=H,D.coneCos=Math.cos(C.angle),D.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),D.decay=C.decay,n.spot[x]=D;let G=C.shadow;if(C.map&&(n.spotLightMap[w]=C.map,w++,G.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[x]=G.matrix,C.castShadow){let B=t.get(C);B.shadowIntensity=G.intensity,B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,n.spotShadow[x]=B,n.spotShadowMap[x]=V,_++}x++}else if(C.isRectAreaLight){let D=e.get(C);D.color.copy(L).multiplyScalar(F),D.halfWidth.set(C.width*.5,0,0),D.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=D,m++}else if(C.isPointLight){let D=e.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),D.distance=C.distance,D.decay=C.decay,C.castShadow){let G=C.shadow,B=t.get(C);B.shadowIntensity=G.intensity,B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,B.shadowCameraNear=G.camera.near,B.shadowCameraFar=G.camera.far,n.pointShadow[g]=B,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=C.shadow.matrix,M++}n.point[g]=D,g++}else if(C.isHemisphereLight){let D=e.get(C);D.skyColor.copy(C.color).multiplyScalar(F),D.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[p]=D,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let N=n.hash;(N.directionalLength!==d||N.pointLength!==g||N.spotLength!==x||N.rectAreaLength!==m||N.hemiLength!==p||N.numDirectionalShadows!==E||N.numPointShadows!==M||N.numSpotShadows!==_||N.numSpotMaps!==w||N.numLightProbes!==P)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,N.directionalLength=d,N.pointLength=g,N.spotLength=x,N.rectAreaLength=m,N.hemiLength=p,N.numDirectionalShadows=E,N.numPointShadows=M,N.numSpotShadows=_,N.numSpotMaps=w,N.numLightProbes=P,n.version=i3++)}function l(c,h){let u=0,f=0,d=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,E=c.length;p<E;p++){let M=c[p];if(M.isDirectionalLight){let _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(M.isSpotLight){let _=n.spot[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),d++}else if(M.isRectAreaLight){let _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let _=n.point[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function Zh(i){let e=new r3(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function o3(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Zh(i),e.set(s,[a])):r>=o.length?(a=new Zh(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var a3=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,l3=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function c3(i,e,t){let n=new ms,s=new $,r=new $,o=new rt,a=new qo({depthPacking:lh}),l=new Yo,c={},h=t.maxTextureSize,u={[zn]:Lt,[Lt]:zn,[vt]:vt},f=new bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $},radius:{value:4}},vertexShader:a3,fragmentShader:l3}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new it;g.setAttribute("position",new Ct(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new He(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cl;let p=this.type;this.render=function(A,P,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),y=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Rt),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let F=p!==Cn&&this.type===Cn,H=p===Cn&&this.type!==Cn;for(let V=0,D=A.length;V<D;V++){let G=A[V],B=G.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);let X=B.getFrameExtents();if(s.multiply(X),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,B.mapSize.y=r.y)),B.map===null||F===!0||H===!0){let re=this.type!==Cn?{minFilter:Pt,magFilter:Pt}:{};B.map!==null&&B.map.dispose(),B.map=new Vt(s.x,s.y,re),B.map.texture.name=G.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();let K=B.getViewportCount();for(let re=0;re<K;re++){let ye=B.getViewport(re);o.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),L.viewport(o),B.updateMatrices(G,re),n=B.getFrustum(),_(P,N,B.camera,G,this.type)}B.isPointLightShadow!==!0&&this.type===Cn&&E(B,N),B.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,C)};function E(A,P){let N=e.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Vt(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(P,null,N,f,x,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(P,null,N,d,x,null)}function M(A,P,N,b){let y=null,C=N.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(C!==void 0)y=C;else if(y=N.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let L=y.uuid,F=P.uuid,H=c[L];H===void 0&&(H={},c[L]=H);let V=H[F];V===void 0&&(V=y.clone(),H[F]=V,P.addEventListener("dispose",w)),y=V}if(y.visible=P.visible,y.wireframe=P.wireframe,b===Cn?y.side=P.shadowSide!==null?P.shadowSide:P.side:y.side=P.shadowSide!==null?P.shadowSide:u[P.side],y.alphaMap=P.alphaMap,y.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,y.map=P.map,y.clipShadows=P.clipShadows,y.clippingPlanes=P.clippingPlanes,y.clipIntersection=P.clipIntersection,y.displacementMap=P.displacementMap,y.displacementScale=P.displacementScale,y.displacementBias=P.displacementBias,y.wireframeLinewidth=P.wireframeLinewidth,y.linewidth=P.linewidth,N.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let L=i.properties.get(y);L.light=N}return y}function _(A,P,N,b,y){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===Cn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,A.matrixWorld);let F=e.update(A),H=A.material;if(Array.isArray(H)){let V=F.groups;for(let D=0,G=V.length;D<G;D++){let B=V[D],X=H[B.materialIndex];if(X&&X.visible){let K=M(A,X,b,y);A.onBeforeShadow(i,A,P,N,F,K,B),i.renderBufferDirect(N,null,F,K,A,B),A.onAfterShadow(i,A,P,N,F,K,B)}}}else if(H.visible){let V=M(A,H,b,y);A.onBeforeShadow(i,A,P,N,F,V,null),i.renderBufferDirect(N,null,F,V,A,null),A.onAfterShadow(i,A,P,N,F,V,null)}}let L=A.children;for(let F=0,H=L.length;F<H;F++)_(L[F],P,N,b,y)}function w(A){A.target.removeEventListener("dispose",w);for(let N in c){let b=c[N],y=A.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}var h3={[ca]:ha,[ua]:pa,[da]:ma,[xi]:fa,[ha]:ca,[pa]:ua,[ma]:da,[fa]:xi};function u3(i,e){function t(){let U=!1,ae=new rt,de=null,we=new rt(0,0,0,0);return{setMask:function(ce){de!==ce&&!U&&(i.colorMask(ce,ce,ce,ce),de=ce)},setLocked:function(ce){U=ce},setClear:function(ce,ne,Ce,Ge,ct){ct===!0&&(ce*=Ge,ne*=Ge,Ce*=Ge),ae.set(ce,ne,Ce,Ge),we.equals(ae)===!1&&(i.clearColor(ce,ne,Ce,Ge),we.copy(ae))},reset:function(){U=!1,de=null,we.set(-1,0,0,0)}}}function n(){let U=!1,ae=!1,de=null,we=null,ce=null;return{setReversed:function(ne){if(ae!==ne){let Ce=e.get("EXT_clip_control");ne?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),ae=ne;let Ge=ce;ce=null,this.setClear(Ge)}},getReversed:function(){return ae},setTest:function(ne){ne?te(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(ne){de!==ne&&!U&&(i.depthMask(ne),de=ne)},setFunc:function(ne){if(ae&&(ne=h3[ne]),we!==ne){switch(ne){case ca:i.depthFunc(i.NEVER);break;case ha:i.depthFunc(i.ALWAYS);break;case ua:i.depthFunc(i.LESS);break;case xi:i.depthFunc(i.LEQUAL);break;case da:i.depthFunc(i.EQUAL);break;case fa:i.depthFunc(i.GEQUAL);break;case pa:i.depthFunc(i.GREATER);break;case ma:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=ne}},setLocked:function(ne){U=ne},setClear:function(ne){ce!==ne&&(ae&&(ne=1-ne),i.clearDepth(ne),ce=ne)},reset:function(){U=!1,de=null,we=null,ce=null,ae=!1}}}function s(){let U=!1,ae=null,de=null,we=null,ce=null,ne=null,Ce=null,Ge=null,ct=null;return{setTest:function(nt){U||(nt?te(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(nt){ae!==nt&&!U&&(i.stencilMask(nt),ae=nt)},setFunc:function(nt,Dn,Sn){(de!==nt||we!==Dn||ce!==Sn)&&(i.stencilFunc(nt,Dn,Sn),de=nt,we=Dn,ce=Sn)},setOp:function(nt,Dn,Sn){(ne!==nt||Ce!==Dn||Ge!==Sn)&&(i.stencilOp(nt,Dn,Sn),ne=nt,Ce=Dn,Ge=Sn)},setLocked:function(nt){U=nt},setClear:function(nt){ct!==nt&&(i.clearStencil(nt),ct=nt)},reset:function(){U=!1,ae=null,de=null,we=null,ce=null,ne=null,Ce=null,Ge=null,ct=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,E=null,M=null,_=null,w=null,A=null,P=new Ue(0,0,0),N=0,b=!1,y=null,C=null,L=null,F=null,H=null,V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),D=!1,G=0,B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(B)[1]),D=G>=1):B.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),D=G>=2);let X=null,K={},re=i.getParameter(i.SCISSOR_BOX),ye=i.getParameter(i.VIEWPORT),Ie=new rt().fromArray(re),Ve=new rt().fromArray(ye);function Xe(U,ae,de,we){let ce=new Uint8Array(4),ne=i.createTexture();i.bindTexture(U,ne),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<de;Ce++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,we,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(ae+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return ne}let J={};J[i.TEXTURE_2D]=Xe(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=Xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=Xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=Xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(i.DEPTH_TEST),o.setFunc(xi),Q(!1),j(ll),te(i.CULL_FACE),se(Rt);function te(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function _e(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Te(U,ae){return u[U]!==ae?(i.bindFramebuffer(U,ae),u[U]=ae,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ae),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function Me(U,ae){let de=d,we=!1;if(U){de=f.get(ae),de===void 0&&(de=[],f.set(ae,de));let ce=U.textures;if(de.length!==ce.length||de[0]!==i.COLOR_ATTACHMENT0){for(let ne=0,Ce=ce.length;ne<Ce;ne++)de[ne]=i.COLOR_ATTACHMENT0+ne;de.length=ce.length,we=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,we=!0);we&&i.drawBuffers(de)}function Ke(U){return g!==U?(i.useProgram(U),g=U,!0):!1}let tt={[gn]:i.FUNC_ADD,[Wc]:i.FUNC_SUBTRACT,[Xc]:i.FUNC_REVERSE_SUBTRACT};tt[qc]=i.MIN,tt[Yc]=i.MAX;let I={[Pr]:i.ZERO,[Zc]:i.ONE,[Kc]:i.SRC_COLOR,[Co]:i.SRC_ALPHA,[Qc]:i.SRC_ALPHA_SATURATE,[la]:i.DST_COLOR,[aa]:i.DST_ALPHA,[Jc]:i.ONE_MINUS_SRC_COLOR,[Po]:i.ONE_MINUS_SRC_ALPHA,[jc]:i.ONE_MINUS_DST_COLOR,[$c]:i.ONE_MINUS_DST_ALPHA,[eh]:i.CONSTANT_COLOR,[th]:i.ONE_MINUS_CONSTANT_COLOR,[nh]:i.CONSTANT_ALPHA,[ih]:i.ONE_MINUS_CONSTANT_ALPHA};function se(U,ae,de,we,ce,ne,Ce,Ge,ct,nt){if(U===Rt){x===!0&&(_e(i.BLEND),x=!1);return}if(x===!1&&(te(i.BLEND),x=!0),U!==oa){if(U!==m||nt!==b){if((p!==gn||_!==gn)&&(i.blendEquation(i.FUNC_ADD),p=gn,_=gn),nt)switch(U){case _i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hl:i.blendFunc(i.ONE,i.ONE);break;case ul:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case dl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case _i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ul:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case dl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}E=null,M=null,w=null,A=null,P.set(0,0,0),N=0,m=U,b=nt}return}ce=ce||ae,ne=ne||de,Ce=Ce||we,(ae!==p||ce!==_)&&(i.blendEquationSeparate(tt[ae],tt[ce]),p=ae,_=ce),(de!==E||we!==M||ne!==w||Ce!==A)&&(i.blendFuncSeparate(I[de],I[we],I[ne],I[Ce]),E=de,M=we,w=ne,A=Ce),(Ge.equals(P)===!1||ct!==N)&&(i.blendColor(Ge.r,Ge.g,Ge.b,ct),P.copy(Ge),N=ct),m=U,b=!1}function ee(U,ae){U.side===vt?_e(i.CULL_FACE):te(i.CULL_FACE);let de=U.side===Lt;ae&&(de=!de),Q(de),U.blending===_i&&U.transparent===!1?se(Rt):se(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let we=U.stencilWrite;a.setTest(we),we&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),oe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function Q(U){y!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),y=U)}function j(U){U!==Vc?(te(i.CULL_FACE),U!==C&&(U===ll?i.cullFace(i.BACK):U===Gc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),C=U}function fe(U){U!==L&&(D&&i.lineWidth(U),L=U)}function oe(U,ae,de){U?(te(i.POLYGON_OFFSET_FILL),(F!==ae||H!==de)&&(i.polygonOffset(ae,de),F=ae,H=de)):_e(i.POLYGON_OFFSET_FILL)}function pe(U){U?te(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function Be(U){U===void 0&&(U=i.TEXTURE0+V-1),X!==U&&(i.activeTexture(U),X=U)}function Oe(U,ae,de){de===void 0&&(X===null?de=i.TEXTURE0+V-1:de=X);let we=K[de];we===void 0&&(we={type:void 0,texture:void 0},K[de]=we),(we.type!==U||we.texture!==ae)&&(X!==de&&(i.activeTexture(de),X=de),i.bindTexture(U,ae||J[U]),we.type=U,we.texture=ae)}function T(){let U=K[X];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Y(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Se(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function he(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function be(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xe(U){Ie.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ie.copy(U))}function Ne(U){Ve.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ve.copy(U))}function Pe(U,ae){let de=c.get(ae);de===void 0&&(de=new WeakMap,c.set(ae,de));let we=de.get(U);we===void 0&&(we=i.getUniformBlockIndex(ae,U.name),de.set(U,we))}function me(U,ae){let we=c.get(ae).get(U);l.get(ae)!==we&&(i.uniformBlockBinding(ae,we,U.__bindingPointIndex),l.set(ae,we))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},X=null,K={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,E=null,M=null,_=null,w=null,A=null,P=new Ue(0,0,0),N=0,b=!1,y=null,C=null,L=null,F=null,H=null,Ie.set(0,0,i.canvas.width,i.canvas.height),Ve.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:te,disable:_e,bindFramebuffer:Te,drawBuffers:Me,useProgram:Ke,setBlending:se,setMaterial:ee,setFlipSided:Q,setCullFace:j,setLineWidth:fe,setPolygonOffset:oe,setScissorTest:pe,activeTexture:Be,bindTexture:Oe,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:k,texImage2D:Ae,texImage3D:le,updateUBOMapping:Pe,uniformBlockBinding:me,texStorage2D:he,texStorage3D:be,texSubImage2D:Y,texSubImage3D:ie,compressedTexSubImage2D:Z,compressedTexSubImage3D:Se,scissor:xe,viewport:Ne,reset:ze}}function d3(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return d?new OffscreenCanvas(T,v):$s("canvas")}function x(T,v,k){let Y=1,ie=Oe(T);if((ie.width>k||ie.height>k)&&(Y=k/Math.max(ie.width,ie.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let Z=Math.floor(Y*ie.width),Se=Math.floor(Y*ie.height);u===void 0&&(u=g(Z,Se));let he=v?g(Z,Se):u;return he.width=Z,he.height=Se,he.getContext("2d").drawImage(T,0,0,Z,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+Z+"x"+Se+")."),he}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(T,v,k,Y,ie=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Z=v;if(v===i.RED&&(k===i.FLOAT&&(Z=i.R32F),k===i.HALF_FLOAT&&(Z=i.R16F),k===i.UNSIGNED_BYTE&&(Z=i.R8)),v===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.R8UI),k===i.UNSIGNED_SHORT&&(Z=i.R16UI),k===i.UNSIGNED_INT&&(Z=i.R32UI),k===i.BYTE&&(Z=i.R8I),k===i.SHORT&&(Z=i.R16I),k===i.INT&&(Z=i.R32I)),v===i.RG&&(k===i.FLOAT&&(Z=i.RG32F),k===i.HALF_FLOAT&&(Z=i.RG16F),k===i.UNSIGNED_BYTE&&(Z=i.RG8)),v===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RG8UI),k===i.UNSIGNED_SHORT&&(Z=i.RG16UI),k===i.UNSIGNED_INT&&(Z=i.RG32UI),k===i.BYTE&&(Z=i.RG8I),k===i.SHORT&&(Z=i.RG16I),k===i.INT&&(Z=i.RG32I)),v===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),k===i.UNSIGNED_INT&&(Z=i.RGB32UI),k===i.BYTE&&(Z=i.RGB8I),k===i.SHORT&&(Z=i.RGB16I),k===i.INT&&(Z=i.RGB32I)),v===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),k===i.UNSIGNED_INT&&(Z=i.RGBA32UI),k===i.BYTE&&(Z=i.RGBA8I),k===i.SHORT&&(Z=i.RGBA16I),k===i.INT&&(Z=i.RGBA32I)),v===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),v===i.RGBA){let Se=ie?Ks:$e.getTransfer(Y);k===i.FLOAT&&(Z=i.RGBA32F),k===i.HALF_FLOAT&&(Z=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Z=Se===et?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function _(T,v){let k;return T?v===null||v===oi||v===ai?k=i.DEPTH24_STENCIL8:v===en?k=i.DEPTH32F_STENCIL8:v===bs&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===oi||v===ai?k=i.DEPTH_COMPONENT24:v===en?k=i.DEPTH_COMPONENT32F:v===bs&&(k=i.DEPTH_COMPONENT16),k}function w(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Pt&&T.minFilter!==_n?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function A(T){let v=T.target;v.removeEventListener("dispose",A),N(v),v.isVideoTexture&&h.delete(v)}function P(T){let v=T.target;v.removeEventListener("dispose",P),y(v)}function N(T){let v=n.get(T);if(v.__webglInit===void 0)return;let k=T.source,Y=f.get(k);if(Y){let ie=Y[v.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&b(T),Object.keys(Y).length===0&&f.delete(k)}n.remove(T)}function b(T){let v=n.get(T);i.deleteTexture(v.__webglTexture);let k=T.source,Y=f.get(k);delete Y[v.__cacheKey],o.memory.textures--}function y(T){let v=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let ie=0;ie<v.__webglFramebuffer[Y].length;ie++)i.deleteFramebuffer(v.__webglFramebuffer[Y][ie]);else i.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)i.deleteFramebuffer(v.__webglFramebuffer[Y]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let k=T.textures;for(let Y=0,ie=k.length;Y<ie;Y++){let Z=n.get(k[Y]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(k[Y])}n.remove(T)}let C=0;function L(){C=0}function F(){let T=C;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),C+=1,T}function H(T){let v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function V(T,v){let k=n.get(T);if(T.isVideoTexture&&pe(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&k.__version!==T.version){let Y=T.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(k,T,v);return}}else T.isExternalTexture&&(k.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+v)}function D(T,v){let k=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&k.__version!==T.version){J(k,T,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+v)}function G(T,v){let k=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&k.__version!==T.version){J(k,T,v);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+v)}function B(T,v){let k=n.get(T);if(T.version>0&&k.__version!==T.version){te(k,T,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+v)}let X={[vi]:i.REPEAT,[$n]:i.CLAMP_TO_EDGE,[Io]:i.MIRRORED_REPEAT},K={[Pt]:i.NEAREST,[oh]:i.NEAREST_MIPMAP_NEAREST,[Dr]:i.NEAREST_MIPMAP_LINEAR,[_n]:i.LINEAR,[Ta]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},re={[hh]:i.NEVER,[gh]:i.ALWAYS,[uh]:i.LESS,[Ml]:i.LEQUAL,[dh]:i.EQUAL,[mh]:i.GEQUAL,[fh]:i.GREATER,[ph]:i.NOTEQUAL};function ye(T,v){if(v.type===en&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===_n||v.magFilter===Ta||v.magFilter===Dr||v.magFilter===ri||v.minFilter===_n||v.minFilter===Ta||v.minFilter===Dr||v.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,X[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,X[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,X[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,K[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,K[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,re[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Pt||v.minFilter!==Dr&&v.minFilter!==ri||v.type===en&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ie(T,v){let k=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",A));let Y=v.source,ie=f.get(Y);ie===void 0&&(ie={},f.set(Y,ie));let Z=H(v);if(Z!==T.__cacheKey){ie[Z]===void 0&&(ie[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ie[Z].usedTimes++;let Se=ie[T.__cacheKey];Se!==void 0&&(ie[T.__cacheKey].usedTimes--,Se.usedTimes===0&&b(v)),T.__cacheKey=Z,T.__webglTexture=ie[Z].texture}return k}function Ve(T,v,k){return Math.floor(Math.floor(T/k)/v)}function Xe(T,v,k,Y){let Z=T.updateRanges;if(Z.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,k,Y,v.data);else{Z.sort((le,xe)=>le.start-xe.start);let Se=0;for(let le=1;le<Z.length;le++){let xe=Z[Se],Ne=Z[le],Pe=xe.start+xe.count,me=Ve(Ne.start,v.width,4),ze=Ve(xe.start,v.width,4);Ne.start<=Pe+1&&me===ze&&Ve(Ne.start+Ne.count-1,v.width,4)===me?xe.count=Math.max(xe.count,Ne.start+Ne.count-xe.start):(++Se,Z[Se]=Ne)}Z.length=Se+1;let he=i.getParameter(i.UNPACK_ROW_LENGTH),be=i.getParameter(i.UNPACK_SKIP_PIXELS),Ae=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let le=0,xe=Z.length;le<xe;le++){let Ne=Z[le],Pe=Math.floor(Ne.start/4),me=Math.ceil(Ne.count/4),ze=Pe%v.width,U=Math.floor(Pe/v.width),ae=me,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,ze,U,ae,de,k,Y,v.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,he),i.pixelStorei(i.UNPACK_SKIP_PIXELS,be),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ae)}}function J(T,v,k){let Y=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=i.TEXTURE_3D);let ie=Ie(T,v),Z=v.source;t.bindTexture(Y,T.__webglTexture,i.TEXTURE0+k);let Se=n.get(Z);if(Z.version!==Se.__version||ie===!0){t.activeTexture(i.TEXTURE0+k);let he=$e.getPrimaries($e.workingColorSpace),be=v.colorSpace===Gn?null:$e.getPrimaries(v.colorSpace),Ae=v.colorSpace===Gn||he===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let le=x(v.image,!1,s.maxTextureSize);le=Be(v,le);let xe=r.convert(v.format,v.colorSpace),Ne=r.convert(v.type),Pe=M(v.internalFormat,xe,Ne,v.colorSpace,v.isVideoTexture);ye(Y,v);let me,ze=v.mipmaps,U=v.isVideoTexture!==!0,ae=Se.__version===void 0||ie===!0,de=Z.dataReady,we=w(v,le);if(v.isDepthTexture)Pe=_(v.format===li,v.type),ae&&(U?t.texStorage2D(i.TEXTURE_2D,1,Pe,le.width,le.height):t.texImage2D(i.TEXTURE_2D,0,Pe,le.width,le.height,0,xe,Ne,null));else if(v.isDataTexture)if(ze.length>0){U&&ae&&t.texStorage2D(i.TEXTURE_2D,we,Pe,ze[0].width,ze[0].height);for(let ce=0,ne=ze.length;ce<ne;ce++)me=ze[ce],U?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,me.width,me.height,xe,Ne,me.data):t.texImage2D(i.TEXTURE_2D,ce,Pe,me.width,me.height,0,xe,Ne,me.data);v.generateMipmaps=!1}else U?(ae&&t.texStorage2D(i.TEXTURE_2D,we,Pe,le.width,le.height),de&&Xe(v,le,xe,Ne)):t.texImage2D(i.TEXTURE_2D,0,Pe,le.width,le.height,0,xe,Ne,le.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){U&&ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Pe,ze[0].width,ze[0].height,le.depth);for(let ce=0,ne=ze.length;ce<ne;ce++)if(me=ze[ce],v.format!==cn)if(xe!==null)if(U){if(de)if(v.layerUpdates.size>0){let Ce=Cl(me.width,me.height,v.format,v.type);for(let Ge of v.layerUpdates){let ct=me.data.subarray(Ge*Ce/me.data.BYTES_PER_ELEMENT,(Ge+1)*Ce/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,Ge,me.width,me.height,1,xe,ct)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,me.width,me.height,le.depth,xe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ce,Pe,me.width,me.height,le.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ce,0,0,0,me.width,me.height,le.depth,xe,Ne,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ce,Pe,me.width,me.height,le.depth,0,xe,Ne,me.data)}else{U&&ae&&t.texStorage2D(i.TEXTURE_2D,we,Pe,ze[0].width,ze[0].height);for(let ce=0,ne=ze.length;ce<ne;ce++)me=ze[ce],v.format!==cn?xe!==null?U?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,ce,0,0,me.width,me.height,xe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,ce,Pe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,me.width,me.height,xe,Ne,me.data):t.texImage2D(i.TEXTURE_2D,ce,Pe,me.width,me.height,0,xe,Ne,me.data)}else if(v.isDataArrayTexture)if(U){if(ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Pe,le.width,le.height,le.depth),de)if(v.layerUpdates.size>0){let ce=Cl(le.width,le.height,v.format,v.type);for(let ne of v.layerUpdates){let Ce=le.data.subarray(ne*ce/le.data.BYTES_PER_ELEMENT,(ne+1)*ce/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ne,le.width,le.height,1,xe,Ne,Ce)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,xe,Ne,le.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Pe,le.width,le.height,le.depth,0,xe,Ne,le.data);else if(v.isData3DTexture)U?(ae&&t.texStorage3D(i.TEXTURE_3D,we,Pe,le.width,le.height,le.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,xe,Ne,le.data)):t.texImage3D(i.TEXTURE_3D,0,Pe,le.width,le.height,le.depth,0,xe,Ne,le.data);else if(v.isFramebufferTexture){if(ae)if(U)t.texStorage2D(i.TEXTURE_2D,we,Pe,le.width,le.height);else{let ce=le.width,ne=le.height;for(let Ce=0;Ce<we;Ce++)t.texImage2D(i.TEXTURE_2D,Ce,Pe,ce,ne,0,xe,Ne,null),ce>>=1,ne>>=1}}else if(ze.length>0){if(U&&ae){let ce=Oe(ze[0]);t.texStorage2D(i.TEXTURE_2D,we,Pe,ce.width,ce.height)}for(let ce=0,ne=ze.length;ce<ne;ce++)me=ze[ce],U?de&&t.texSubImage2D(i.TEXTURE_2D,ce,0,0,xe,Ne,me):t.texImage2D(i.TEXTURE_2D,ce,Pe,xe,Ne,me);v.generateMipmaps=!1}else if(U){if(ae){let ce=Oe(le);t.texStorage2D(i.TEXTURE_2D,we,Pe,ce.width,ce.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,xe,Ne,le)}else t.texImage2D(i.TEXTURE_2D,0,Pe,xe,Ne,le);m(v)&&p(Y),Se.__version=Z.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function te(T,v,k){if(v.image.length!==6)return;let Y=Ie(T,v),ie=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+k);let Z=n.get(ie);if(ie.version!==Z.__version||Y===!0){t.activeTexture(i.TEXTURE0+k);let Se=$e.getPrimaries($e.workingColorSpace),he=v.colorSpace===Gn?null:$e.getPrimaries(v.colorSpace),be=v.colorSpace===Gn||Se===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let Ae=v.isCompressedTexture||v.image[0].isCompressedTexture,le=v.image[0]&&v.image[0].isDataTexture,xe=[];for(let ne=0;ne<6;ne++)!Ae&&!le?xe[ne]=x(v.image[ne],!0,s.maxCubemapSize):xe[ne]=le?v.image[ne].image:v.image[ne],xe[ne]=Be(v,xe[ne]);let Ne=xe[0],Pe=r.convert(v.format,v.colorSpace),me=r.convert(v.type),ze=M(v.internalFormat,Pe,me,v.colorSpace),U=v.isVideoTexture!==!0,ae=Z.__version===void 0||Y===!0,de=ie.dataReady,we=w(v,Ne);ye(i.TEXTURE_CUBE_MAP,v);let ce;if(Ae){U&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ze,Ne.width,Ne.height);for(let ne=0;ne<6;ne++){ce=xe[ne].mipmaps;for(let Ce=0;Ce<ce.length;Ce++){let Ge=ce[Ce];v.format!==cn?Pe!==null?U?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce,0,0,Ge.width,Ge.height,Pe,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce,ze,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce,0,0,Ge.width,Ge.height,Pe,me,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce,ze,Ge.width,Ge.height,0,Pe,me,Ge.data)}}}else{if(ce=v.mipmaps,U&&ae){ce.length>0&&we++;let ne=Oe(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ze,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(le){U?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,xe[ne].width,xe[ne].height,Pe,me,xe[ne].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ze,xe[ne].width,xe[ne].height,0,Pe,me,xe[ne].data);for(let Ce=0;Ce<ce.length;Ce++){let ct=ce[Ce].image[ne].image;U?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce+1,0,0,ct.width,ct.height,Pe,me,ct.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce+1,ze,ct.width,ct.height,0,Pe,me,ct.data)}}else{U?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Pe,me,xe[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ze,Pe,me,xe[ne]);for(let Ce=0;Ce<ce.length;Ce++){let Ge=ce[Ce];U?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce+1,0,0,Pe,me,Ge.image[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ce+1,ze,Pe,me,Ge.image[ne])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),Z.__version=ie.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function _e(T,v,k,Y,ie,Z){let Se=r.convert(k.format,k.colorSpace),he=r.convert(k.type),be=M(k.internalFormat,Se,he,k.colorSpace),Ae=n.get(v),le=n.get(k);if(le.__renderTarget=v,!Ae.__hasExternalTextures){let xe=Math.max(1,v.width>>Z),Ne=Math.max(1,v.height>>Z);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,Z,be,xe,Ne,v.depth,0,Se,he,null):t.texImage2D(ie,Z,be,xe,Ne,0,Se,he,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),oe(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,ie,le.__webglTexture,0,fe(v)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,ie,le.__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Te(T,v,k){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){let Y=v.depthTexture,ie=Y&&Y.isDepthTexture?Y.type:null,Z=_(v.stencilBuffer,ie),Se=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=fe(v);oe(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,he,Z,v.width,v.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,he,Z,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Z,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,T)}else{let Y=v.textures;for(let ie=0;ie<Y.length;ie++){let Z=Y[ie],Se=r.convert(Z.format,Z.colorSpace),he=r.convert(Z.type),be=M(Z.internalFormat,Se,he,Z.colorSpace),Ae=fe(v);k&&oe(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,be,v.width,v.height):oe(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ae,be,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,be,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Me(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=n.get(v.depthTexture);Y.__renderTarget=v,(!Y.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),V(v.depthTexture,0);let ie=Y.__webglTexture,Z=fe(v);if(v.depthTexture.format===rs)oe(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(v.depthTexture.format===li)oe(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function Ke(T){let v=n.get(T),k=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){let Y=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){let ie=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",ie)};Y.addEventListener("dispose",ie),v.__depthDisposeCallback=ie}v.__boundDepthTexture=Y}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");let Y=T.texture.mipmaps;Y&&Y.length>0?Me(v.__webglFramebuffer[0],T):Me(v.__webglFramebuffer,T)}else if(k){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=i.createRenderbuffer(),Te(v.__webglDepthbuffer[Y],T,!1);else{let ie=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,Z)}}else{let Y=T.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Te(v.__webglDepthbuffer,T,!1);else{let ie=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,Z)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function tt(T,v,k){let Y=n.get(T);v!==void 0&&_e(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Ke(T)}function I(T){let v=T.texture,k=n.get(T),Y=n.get(v);T.addEventListener("dispose",P);let ie=T.textures,Z=T.isWebGLCubeRenderTarget===!0,Se=ie.length>1;if(Se||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=v.version,o.memory.textures++),Z){k.__webglFramebuffer=[];for(let he=0;he<6;he++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[he]=[];for(let be=0;be<v.mipmaps.length;be++)k.__webglFramebuffer[he][be]=i.createFramebuffer()}else k.__webglFramebuffer[he]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let he=0;he<v.mipmaps.length;he++)k.__webglFramebuffer[he]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Se)for(let he=0,be=ie.length;he<be;he++){let Ae=n.get(ie[he]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&oe(T)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let he=0;he<ie.length;he++){let be=ie[he];k.__webglColorRenderbuffer[he]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[he]);let Ae=r.convert(be.format,be.colorSpace),le=r.convert(be.type),xe=M(be.internalFormat,Ae,le,be.colorSpace,T.isXRRenderTarget===!0),Ne=fe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,xe,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,k.__webglColorRenderbuffer[he])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Te(k.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),ye(i.TEXTURE_CUBE_MAP,v);for(let he=0;he<6;he++)if(v.mipmaps&&v.mipmaps.length>0)for(let be=0;be<v.mipmaps.length;be++)_e(k.__webglFramebuffer[he][be],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,be);else _e(k.__webglFramebuffer[he],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let he=0,be=ie.length;he<be;he++){let Ae=ie[he],le=n.get(Ae),xe=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(xe=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,le.__webglTexture),ye(xe,Ae),_e(k.__webglFramebuffer,T,Ae,i.COLOR_ATTACHMENT0+he,xe,0),m(Ae)&&p(xe)}t.unbindTexture()}else{let he=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(he=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,Y.__webglTexture),ye(he,v),v.mipmaps&&v.mipmaps.length>0)for(let be=0;be<v.mipmaps.length;be++)_e(k.__webglFramebuffer[be],T,v,i.COLOR_ATTACHMENT0,he,be);else _e(k.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,he,0);m(v)&&p(he),t.unbindTexture()}T.depthBuffer&&Ke(T)}function se(T){let v=T.textures;for(let k=0,Y=v.length;k<Y;k++){let ie=v[k];if(m(ie)){let Z=E(T),Se=n.get(ie).__webglTexture;t.bindTexture(Z,Se),p(Z),t.unbindTexture()}}}let ee=[],Q=[];function j(T){if(T.samples>0){if(oe(T)===!1){let v=T.textures,k=T.width,Y=T.height,ie=i.COLOR_BUFFER_BIT,Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(T),he=v.length>1;if(he)for(let Ae=0;Ae<v.length;Ae++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer);let be=T.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let Ae=0;Ae<v.length;Ae++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),he){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[Ae]);let le=n.get(v[Ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,k,Y,0,0,k,Y,ie,i.NEAREST),l===!0&&(ee.length=0,Q.length=0,ee.push(i.COLOR_ATTACHMENT0+Ae),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ee.push(Z),Q.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Q)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ee))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),he)for(let Ae=0;Ae<v.length;Ae++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,Se.__webglColorRenderbuffer[Ae]);let le=n.get(v[Ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function fe(T){return Math.min(s.maxSamples,T.samples)}function oe(T){let v=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function pe(T){let v=o.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function Be(T,v){let k=T.colorSpace,Y=T.format,ie=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||k!==yi&&k!==Gn&&($e.getTransfer(k)===et?(Y!==cn||ie!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function Oe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=L,this.setTexture2D=V,this.setTexture2DArray=D,this.setTexture3D=G,this.setTextureCube=B,this.rebindTextures=tt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=oe}function f3(i,e){function t(n,s=Gn){let r,o=$e.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===Aa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ra)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_l)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===pl)return i.BYTE;if(n===ml)return i.SHORT;if(n===bs)return i.UNSIGNED_SHORT;if(n===wa)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===en)return i.FLOAT;if(n===yn)return i.HALF_FLOAT;if(n===xl)return i.ALPHA;if(n===vl)return i.RGB;if(n===cn)return i.RGBA;if(n===rs)return i.DEPTH_COMPONENT;if(n===li)return i.DEPTH_STENCIL;if(n===Ss)return i.RED;if(n===Ca)return i.RED_INTEGER;if(n===yl)return i.RG;if(n===Pa)return i.RG_INTEGER;if(n===Ia)return i.RGBA_INTEGER;if(n===Lr||n===Nr||n===Ur||n===Or)if(o===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Lr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Lr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Or)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Da||n===La||n===Na||n===Ua)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Da)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===La)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oa||n===Fa||n===Ba)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Oa||n===Fa)return o===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ba)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===za||n===ka||n===Ha||n===Va||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===Za||n===Ka||n===Ja||n===$a||n===ja)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===za)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ka)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ha)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Va)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ga)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ya)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ka)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ja)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$a)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ja)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qa||n===e0||n===t0)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qa)return o===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===e0)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===t0)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===n0||n===i0||n===s0||n===r0)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===n0)return r.COMPRESSED_RED_RGTC1_EXT;if(n===i0)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===s0)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===r0)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ai?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var p3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,m3=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Vl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new lr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new bt({vertexShader:p3,fragmentShader:m3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new jt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Gl=class extends An{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,x=typeof XRWebGLBinding<"u",m=new Vl,p={},E=t.getContextAttributes(),M=null,_=null,w=[],A=[],P=new $,N=null,b=new kt;b.viewport=new rt;let y=new kt;y.viewport=new rt;let C=[b,y],L=new sa,F=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let te=w[J];return te===void 0&&(te=new hs,w[J]=te),te.getTargetRaySpace()},this.getControllerGrip=function(J){let te=w[J];return te===void 0&&(te=new hs,w[J]=te),te.getGripSpace()},this.getHand=function(J){let te=w[J];return te===void 0&&(te=new hs,w[J]=te),te.getHandSpace()};function V(J){let te=A.indexOf(J.inputSource);if(te===-1)return;let _e=w[te];_e!==void 0&&(_e.update(J.inputSource,J.frame,c||o),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function D(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",D),s.removeEventListener("inputsourceschange",G);for(let J=0;J<w.length;J++){let te=A[J];te!==null&&(A[J]=null,w[J].disconnect(te))}F=null,H=null,m.reset();for(let J in p)delete p[J];e.setRenderTarget(M),d=null,f=null,u=null,s=null,_=null,Xe.stop(),n.isPresenting=!1,e.setPixelRatio(N),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",D),s.addEventListener("inputsourceschange",G),E.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Te=null,Me=null;E.depth&&(Me=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=E.stencil?li:rs,Te=E.stencil?ai:oi);let Ke={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ke),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Vt(f.textureWidth,f.textureHeight,{format:cn,type:vn,depthTexture:new bi(f.textureWidth,f.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let _e={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new Vt(d.framebufferWidth,d.framebufferHeight,{format:cn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Xe.setContext(s),Xe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function G(J){for(let te=0;te<J.removed.length;te++){let _e=J.removed[te],Te=A.indexOf(_e);Te>=0&&(A[Te]=null,w[Te].disconnect(_e))}for(let te=0;te<J.added.length;te++){let _e=J.added[te],Te=A.indexOf(_e);if(Te===-1){for(let Ke=0;Ke<w.length;Ke++)if(Ke>=A.length){A.push(_e),Te=Ke;break}else if(A[Ke]===null){A[Ke]=_e,Te=Ke;break}if(Te===-1)break}let Me=w[Te];Me&&Me.connect(_e)}}let B=new R,X=new R;function K(J,te,_e){B.setFromMatrixPosition(te.matrixWorld),X.setFromMatrixPosition(_e.matrixWorld);let Te=B.distanceTo(X),Me=te.projectionMatrix.elements,Ke=_e.projectionMatrix.elements,tt=Me[14]/(Me[10]-1),I=Me[14]/(Me[10]+1),se=(Me[9]+1)/Me[5],ee=(Me[9]-1)/Me[5],Q=(Me[8]-1)/Me[0],j=(Ke[8]+1)/Ke[0],fe=tt*Q,oe=tt*j,pe=Te/(-Q+j),Be=pe*-Q;if(te.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Be),J.translateZ(pe),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Me[10]===-1)J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let Oe=tt+pe,T=I+pe,v=fe-Be,k=oe+(Te-Be),Y=se*I/T*Oe,ie=ee*I/T*Oe;J.projectionMatrix.makePerspective(v,k,Y,ie,Oe,T),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function re(J,te){te===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(te.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let te=J.near,_e=J.far;m.texture!==null&&(m.depthNear>0&&(te=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),L.near=y.near=b.near=te,L.far=y.far=b.far=_e,(F!==L.near||H!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),F=L.near,H=L.far),L.layers.mask=J.layers.mask|6,b.layers.mask=L.layers.mask&3,y.layers.mask=L.layers.mask&5;let Te=J.parent,Me=L.cameras;re(L,Te);for(let Ke=0;Ke<Me.length;Ke++)re(Me[Ke],Te);Me.length===2?K(L,b,y):L.projectionMatrix.copy(b.projectionMatrix),ye(J,L,Te)};function ye(J,te,_e){_e===null?J.matrix.copy(te.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(te.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=os*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(J){l=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(J){return p[J]};let Ie=null;function Ve(J,te){if(h=te.getViewerPose(c||o),g=te,h!==null){let _e=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let Te=!1;_e.length!==L.cameras.length&&(L.cameras.length=0,Te=!0);for(let I=0;I<_e.length;I++){let se=_e[I],ee=null;if(d!==null)ee=d.getViewport(se);else{let j=u.getViewSubImage(f,se);ee=j.viewport,I===0&&(e.setRenderTargetTextures(_,j.colorTexture,j.depthStencilTexture),e.setRenderTarget(_))}let Q=C[I];Q===void 0&&(Q=new kt,Q.layers.enable(I),Q.viewport=new rt,C[I]=Q),Q.matrix.fromArray(se.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(se.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(ee.x,ee.y,ee.width,ee.height),I===0&&(L.matrix.copy(Q.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Te===!0&&L.cameras.push(Q)}let Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let I=u.getDepthInformation(_e[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(Me&&Me.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let I=0;I<_e.length;I++){let se=_e[I].camera;if(se){let ee=p[se];ee||(ee=new lr,p[se]=ee);let Q=u.getCameraImage(se);ee.sourceTexture=Q}}}}for(let _e=0;_e<w.length;_e++){let Te=A[_e],Me=w[_e];Te!==null&&Me!==void 0&&Me.update(Te,te,c||o)}Ie&&Ie(J,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}let Xe=new Kh;Xe.setAnimationLoop(Ve),this.setAnimationLoop=function(J){Ie=J},this.dispose=function(){}}},Ui=new ln,g3=new Qe;function _3(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Tl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,E,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E=e.get(p),M=E.envMap,_=E.envMapRotation;M&&(m.envMap.value=M,Ui.copy(_),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),m.envMapRotation.value.setFromMatrix4(g3.makeRotationFromEuler(Ui)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,E,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Lt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function x3(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,M){let _=M.program;n.uniformBlockBinding(E,_)}function c(E,M){let _=s[E.id];_===void 0&&(g(E),_=h(E),s[E.id]=_,E.addEventListener("dispose",m));let w=M.program;n.updateUBOMapping(E,w);let A=e.render.frame;r[E.id]!==A&&(f(E),r[E.id]=A)}function h(E){let M=u();E.__bindingPointIndex=M;let _=i.createBuffer(),w=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let M=s[E.id],_=E.uniforms,w=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,P=_.length;A<P;A++){let N=Array.isArray(_[A])?_[A]:[_[A]];for(let b=0,y=N.length;b<y;b++){let C=N[b];if(d(C,A,b,w)===!0){let L=C.__offset,F=Array.isArray(C.value)?C.value:[C.value],H=0;for(let V=0;V<F.length;V++){let D=F[V],G=x(D);typeof D=="number"||typeof D=="boolean"?(C.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,L+H,C.__data)):D.isMatrix3?(C.__data[0]=D.elements[0],C.__data[1]=D.elements[1],C.__data[2]=D.elements[2],C.__data[3]=0,C.__data[4]=D.elements[3],C.__data[5]=D.elements[4],C.__data[6]=D.elements[5],C.__data[7]=0,C.__data[8]=D.elements[6],C.__data[9]=D.elements[7],C.__data[10]=D.elements[8],C.__data[11]=0):(D.toArray(C.__data,H),H+=G.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(E,M,_,w){let A=E.value,P=M+"_"+_;if(w[P]===void 0)return typeof A=="number"||typeof A=="boolean"?w[P]=A:w[P]=A.clone(),!0;{let N=w[P];if(typeof A=="number"||typeof A=="boolean"){if(N!==A)return w[P]=A,!0}else if(N.equals(A)===!1)return N.copy(A),!0}return!1}function g(E){let M=E.uniforms,_=0,w=16;for(let P=0,N=M.length;P<N;P++){let b=Array.isArray(M[P])?M[P]:[M[P]];for(let y=0,C=b.length;y<C;y++){let L=b[y],F=Array.isArray(L.value)?L.value:[L.value];for(let H=0,V=F.length;H<V;H++){let D=F[H],G=x(D),B=_%w,X=B%G.boundary,K=B+X;_+=X,K!==0&&w-K<G.storage&&(_+=w-K),L.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=_,_+=G.storage}}}let A=_%w;return A>0&&(_+=w-A),E.__size=_,E.__cache={},this}function x(E){let M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),M}function m(E){let M=E.target;M.removeEventListener("dispose",m);let _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var c0=class{constructor(e={}){let{canvas:t=_h(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,E=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let _=this,w=!1;this._outputColorSpace=St;let A=0,P=0,N=null,b=-1,y=null,C=new rt,L=new rt,F=null,H=new Ue(0),V=0,D=t.width,G=t.height,B=1,X=null,K=null,re=new rt(0,0,D,G),ye=new rt(0,0,D,G),Ie=!1,Ve=new ms,Xe=!1,J=!1,te=new Qe,_e=new R,Te=new rt,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function tt(){return N===null?B:1}let I=n;function se(S,O){return t.getContext(S,O)}try{let S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",ce,!1),I===null){let O="webgl2";if(I=se(O,S),I===null)throw se(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let ee,Q,j,fe,oe,pe,Be,Oe,T,v,k,Y,ie,Z,Se,he,be,Ae,le,xe,Ne,Pe,me,ze;function U(){ee=new O1(I),ee.init(),Pe=new f3(I,ee),Q=new C1(I,ee,e,Pe),j=new u3(I,ee),Q.reversedDepthBuffer&&f&&j.buffers.depth.setReversed(!0),fe=new z1(I),oe=new jp,pe=new d3(I,ee,j,oe,Q,Pe,fe),Be=new I1(_),Oe=new U1(_),T=new W4(I),me=new A1(I,T),v=new F1(I,T,fe,me),k=new H1(I,v,T,fe),le=new k1(I,Q,pe),he=new P1(oe),Y=new $p(_,Be,Oe,ee,Q,me,he),ie=new _3(_,oe),Z=new e3,Se=new o3(ee),Ae=new w1(_,Be,Oe,j,k,d,l),be=new c3(_,k,Q),ze=new x3(I,fe,Q,j),xe=new R1(I,ee,fe),Ne=new B1(I,ee,fe),fe.programs=Y.programs,_.capabilities=Q,_.extensions=ee,_.properties=oe,_.renderLists=Z,_.shadowMap=be,_.state=j,_.info=fe}U();let ae=new Gl(_,I);this.xr=ae,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let S=ee.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=ee.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(S){S!==void 0&&(B=S,this.setSize(D,G,!1))},this.getSize=function(S){return S.set(D,G)},this.setSize=function(S,O,W=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=S,G=O,t.width=Math.floor(S*B),t.height=Math.floor(O*B),W===!0&&(t.style.width=S+"px",t.style.height=O+"px"),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(D*B,G*B).floor()},this.setDrawingBufferSize=function(S,O,W){D=S,G=O,B=W,t.width=Math.floor(S*W),t.height=Math.floor(O*W),this.setViewport(0,0,S,O)},this.getCurrentViewport=function(S){return S.copy(C)},this.getViewport=function(S){return S.copy(re)},this.setViewport=function(S,O,W,q){S.isVector4?re.set(S.x,S.y,S.z,S.w):re.set(S,O,W,q),j.viewport(C.copy(re).multiplyScalar(B).round())},this.getScissor=function(S){return S.copy(ye)},this.setScissor=function(S,O,W,q){S.isVector4?ye.set(S.x,S.y,S.z,S.w):ye.set(S,O,W,q),j.scissor(L.copy(ye).multiplyScalar(B).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(S){j.setScissorTest(Ie=S)},this.setOpaqueSort=function(S){X=S},this.setTransparentSort=function(S){K=S},this.getClearColor=function(S){return S.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(S=!0,O=!0,W=!0){let q=0;if(S){let z=!1;if(N!==null){let ue=N.texture.format;z=ue===Ia||ue===Pa||ue===Ca}if(z){let ue=N.texture.type,ve=ue===vn||ue===oi||ue===bs||ue===ai||ue===Aa||ue===Ra,Re=Ae.getClearColor(),Ee=Ae.getClearAlpha(),Fe=Re.r,ke=Re.g,De=Re.b;ve?(g[0]=Fe,g[1]=ke,g[2]=De,g[3]=Ee,I.clearBufferuiv(I.COLOR,0,g)):(x[0]=Fe,x[1]=ke,x[2]=De,x[3]=Ee,I.clearBufferiv(I.COLOR,0,x))}else q|=I.COLOR_BUFFER_BIT}O&&(q|=I.DEPTH_BUFFER_BIT),W&&(q|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),Ae.dispose(),Z.dispose(),Se.dispose(),oe.dispose(),Be.dispose(),Oe.dispose(),k.dispose(),me.dispose(),ze.dispose(),Y.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Sn),ae.removeEventListener("sessionend",tc),hi.stop()};function de(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function we(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let S=fe.autoReset,O=be.enabled,W=be.autoUpdate,q=be.needsUpdate,z=be.type;U(),fe.autoReset=S,be.enabled=O,be.autoUpdate=W,be.needsUpdate=q,be.type=z}function ce(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ne(S){let O=S.target;O.removeEventListener("dispose",ne),Ce(O)}function Ce(S){Ge(S),oe.remove(S)}function Ge(S){let O=oe.get(S).programs;O!==void 0&&(O.forEach(function(W){Y.releaseProgram(W)}),S.isShaderMaterial&&Y.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,W,q,z,ue){O===null&&(O=Me);let ve=z.isMesh&&z.matrixWorld.determinant()<0,Re=pu(S,O,W,q,z);j.setMaterial(q,ve);let Ee=W.index,Fe=1;if(q.wireframe===!0){if(Ee=v.getWireframeAttribute(W),Ee===void 0)return;Fe=2}let ke=W.drawRange,De=W.attributes.position,Je=ke.start*Fe,ot=(ke.start+ke.count)*Fe;ue!==null&&(Je=Math.max(Je,ue.start*Fe),ot=Math.min(ot,(ue.start+ue.count)*Fe)),Ee!==null?(Je=Math.max(Je,0),ot=Math.min(ot,Ee.count)):De!=null&&(Je=Math.max(Je,0),ot=Math.min(ot,De.count));let _t=ot-Je;if(_t<0||_t===1/0)return;me.setup(z,q,Re,W,Ee);let ut,lt=xe;if(Ee!==null&&(ut=T.get(Ee),lt=Ne,lt.setIndex(ut)),z.isMesh)q.wireframe===!0?(j.setLineWidth(q.wireframeLinewidth*tt()),lt.setMode(I.LINES)):lt.setMode(I.TRIANGLES);else if(z.isLine){let Le=q.linewidth;Le===void 0&&(Le=1),j.setLineWidth(Le*tt()),z.isLineSegments?lt.setMode(I.LINES):z.isLineLoop?lt.setMode(I.LINE_LOOP):lt.setMode(I.LINE_STRIP)}else z.isPoints?lt.setMode(I.POINTS):z.isSprite&&lt.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)as("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),lt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(ee.get("WEBGL_multi_draw"))lt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let Le=z._multiDrawStarts,ft=z._multiDrawCounts,je=z._multiDrawCount,qt=Ee?T.get(Ee).bytesPerElement:1,zi=oe.get(q).currentProgram.getUniforms();for(let Yt=0;Yt<je;Yt++)zi.setValue(I,"_gl_DrawID",Yt),lt.render(Le[Yt]/qt,ft[Yt])}else if(z.isInstancedMesh)lt.renderInstances(Je,_t,z.count);else if(W.isInstancedBufferGeometry){let Le=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ft=Math.min(W.instanceCount,Le);lt.renderInstances(Je,_t,ft)}else lt.render(Je,_t)};function ct(S,O,W){S.transparent===!0&&S.side===vt&&S.forceSinglePass===!1?(S.side=Lt,S.needsUpdate=!0,Jr(S,O,W),S.side=zn,S.needsUpdate=!0,Jr(S,O,W),S.side=vt):Jr(S,O,W)}this.compile=function(S,O,W=null){W===null&&(W=S),p=Se.get(W),p.init(O),M.push(p),W.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),S!==W&&S.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let q=new Set;return S.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ue=z.material;if(ue)if(Array.isArray(ue))for(let ve=0;ve<ue.length;ve++){let Re=ue[ve];ct(Re,W,z),q.add(Re)}else ct(ue,W,z),q.add(ue)}),p=M.pop(),q},this.compileAsync=function(S,O,W=null){let q=this.compile(S,O,W);return new Promise(z=>{function ue(){if(q.forEach(function(ve){oe.get(ve).currentProgram.isReady()&&q.delete(ve)}),q.size===0){z(S);return}setTimeout(ue,10)}ee.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let nt=null;function Dn(S){nt&&nt(S)}function Sn(){hi.stop()}function tc(){hi.start()}let hi=new Kh;hi.setAnimationLoop(Dn),typeof self<"u"&&hi.setContext(self),this.setAnimationLoop=function(S){nt=S,ae.setAnimationLoop(S),S===null?hi.stop():hi.start()},ae.addEventListener("sessionstart",Sn),ae.addEventListener("sessionend",tc),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(O),O=ae.getCamera()),S.isScene===!0&&S.onBeforeRender(_,S,O,N),p=Se.get(S,M.length),p.init(O),M.push(p),te.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ve.setFromProjectionMatrix(te,mn,O.reversedDepth),J=this.localClippingEnabled,Xe=he.init(this.clippingPlanes,J),m=Z.get(S,E.length),m.init(),E.push(m),ae.enabled===!0&&ae.isPresenting===!0){let ue=_.xr.getDepthSensingMesh();ue!==null&&y0(ue,O,-1/0,_.sortObjects)}y0(S,O,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(X,K),Ke=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Ke&&Ae.addToRenderList(m,S),this.info.render.frame++,Xe===!0&&he.beginShadows();let W=p.state.shadowsArray;be.render(W,S,O),Xe===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=m.opaque,z=m.transmissive;if(p.setupLights(),O.isArrayCamera){let ue=O.cameras;if(z.length>0)for(let ve=0,Re=ue.length;ve<Re;ve++){let Ee=ue[ve];ic(q,z,S,Ee)}Ke&&Ae.render(S);for(let ve=0,Re=ue.length;ve<Re;ve++){let Ee=ue[ve];nc(m,S,Ee,Ee.viewport)}}else z.length>0&&ic(q,z,S,O),Ke&&Ae.render(S),nc(m,S,O);N!==null&&P===0&&(pe.updateMultisampleRenderTarget(N),pe.updateRenderTargetMipmap(N)),S.isScene===!0&&S.onAfterRender(_,S,O),me.resetDefaultState(),b=-1,y=null,M.pop(),M.length>0?(p=M[M.length-1],Xe===!0&&he.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function y0(S,O,W,q){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)W=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Ve.intersectsSprite(S)){q&&Te.setFromMatrixPosition(S.matrixWorld).applyMatrix4(te);let ve=k.update(S),Re=S.material;Re.visible&&m.push(S,ve,Re,W,Te.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Ve.intersectsObject(S))){let ve=k.update(S),Re=S.material;if(q&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Te.copy(S.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Te.copy(ve.boundingSphere.center)),Te.applyMatrix4(S.matrixWorld).applyMatrix4(te)),Array.isArray(Re)){let Ee=ve.groups;for(let Fe=0,ke=Ee.length;Fe<ke;Fe++){let De=Ee[Fe],Je=Re[De.materialIndex];Je&&Je.visible&&m.push(S,ve,Je,W,Te.z,De)}}else Re.visible&&m.push(S,ve,Re,W,Te.z,null)}}let ue=S.children;for(let ve=0,Re=ue.length;ve<Re;ve++)y0(ue[ve],O,W,q)}function nc(S,O,W,q){let z=S.opaque,ue=S.transmissive,ve=S.transparent;p.setupLightsView(W),Xe===!0&&he.setGlobalState(_.clippingPlanes,W),q&&j.viewport(C.copy(q)),z.length>0&&Kr(z,O,W),ue.length>0&&Kr(ue,O,W),ve.length>0&&Kr(ve,O,W),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function ic(S,O,W,q){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new Vt(1,1,{generateMipmaps:!0,type:ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float")?yn:vn,minFilter:ri,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));let ue=p.state.transmissionRenderTarget[q.id],ve=q.viewport||C;ue.setSize(ve.z*_.transmissionResolutionScale,ve.w*_.transmissionResolutionScale);let Re=_.getRenderTarget(),Ee=_.getActiveCubeFace(),Fe=_.getActiveMipmapLevel();_.setRenderTarget(ue),_.getClearColor(H),V=_.getClearAlpha(),V<1&&_.setClearColor(16777215,.5),_.clear(),Ke&&Ae.render(W);let ke=_.toneMapping;_.toneMapping=Vn;let De=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),Xe===!0&&he.setGlobalState(_.clippingPlanes,q),Kr(S,W,q),pe.updateMultisampleRenderTarget(ue),pe.updateRenderTargetMipmap(ue),ee.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let ot=0,_t=O.length;ot<_t;ot++){let ut=O[ot],lt=ut.object,Le=ut.geometry,ft=ut.material,je=ut.group;if(ft.side===vt&&lt.layers.test(q.layers)){let qt=ft.side;ft.side=Lt,ft.needsUpdate=!0,sc(lt,W,q,Le,ft,je),ft.side=qt,ft.needsUpdate=!0,Je=!0}}Je===!0&&(pe.updateMultisampleRenderTarget(ue),pe.updateRenderTargetMipmap(ue))}_.setRenderTarget(Re,Ee,Fe),_.setClearColor(H,V),De!==void 0&&(q.viewport=De),_.toneMapping=ke}function Kr(S,O,W){let q=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ue=S.length;z<ue;z++){let ve=S[z],Re=ve.object,Ee=ve.geometry,Fe=ve.group,ke=ve.material;ke.allowOverride===!0&&q!==null&&(ke=q),Re.layers.test(W.layers)&&sc(Re,O,W,Ee,ke,Fe)}}function sc(S,O,W,q,z,ue){S.onBeforeRender(_,O,W,q,z,ue),S.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),z.onBeforeRender(_,O,W,q,S,ue),z.transparent===!0&&z.side===vt&&z.forceSinglePass===!1?(z.side=Lt,z.needsUpdate=!0,_.renderBufferDirect(W,O,q,z,S,ue),z.side=zn,z.needsUpdate=!0,_.renderBufferDirect(W,O,q,z,S,ue),z.side=vt):_.renderBufferDirect(W,O,q,z,S,ue),S.onAfterRender(_,O,W,q,z,ue)}function Jr(S,O,W){O.isScene!==!0&&(O=Me);let q=oe.get(S),z=p.state.lights,ue=p.state.shadowsArray,ve=z.state.version,Re=Y.getParameters(S,z.state,ue,O,W),Ee=Y.getProgramCacheKey(Re),Fe=q.programs;q.environment=S.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(S.isMeshStandardMaterial?Oe:Be).get(S.envMap||q.environment),q.envMapRotation=q.environment!==null&&S.envMap===null?O.environmentRotation:S.envMapRotation,Fe===void 0&&(S.addEventListener("dispose",ne),Fe=new Map,q.programs=Fe);let ke=Fe.get(Ee);if(ke!==void 0){if(q.currentProgram===ke&&q.lightsStateVersion===ve)return oc(S,Re),ke}else Re.uniforms=Y.getUniforms(S),S.onBeforeCompile(Re,_),ke=Y.acquireProgram(Re,Ee),Fe.set(Ee,ke),q.uniforms=Re.uniforms;let De=q.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(De.clippingPlanes=he.uniform),oc(S,Re),q.needsLights=gu(S),q.lightsStateVersion=ve,q.needsLights&&(De.ambientLightColor.value=z.state.ambient,De.lightProbe.value=z.state.probe,De.directionalLights.value=z.state.directional,De.directionalLightShadows.value=z.state.directionalShadow,De.spotLights.value=z.state.spot,De.spotLightShadows.value=z.state.spotShadow,De.rectAreaLights.value=z.state.rectArea,De.ltc_1.value=z.state.rectAreaLTC1,De.ltc_2.value=z.state.rectAreaLTC2,De.pointLights.value=z.state.point,De.pointLightShadows.value=z.state.pointShadow,De.hemisphereLights.value=z.state.hemi,De.directionalShadowMap.value=z.state.directionalShadowMap,De.directionalShadowMatrix.value=z.state.directionalShadowMatrix,De.spotShadowMap.value=z.state.spotShadowMap,De.spotLightMatrix.value=z.state.spotLightMatrix,De.spotLightMap.value=z.state.spotLightMap,De.pointShadowMap.value=z.state.pointShadowMap,De.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=ke,q.uniformsList=null,ke}function rc(S){if(S.uniformsList===null){let O=S.currentProgram.getUniforms();S.uniformsList=ws.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function oc(S,O){let W=oe.get(S);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function pu(S,O,W,q,z){O.isScene!==!0&&(O=Me),pe.resetTextureUnits();let ue=O.fog,ve=q.isMeshStandardMaterial?O.environment:null,Re=N===null?_.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:yi,Ee=(q.isMeshStandardMaterial?Oe:Be).get(q.envMap||ve),Fe=q.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ke=!!W.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),De=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,ot=!!W.morphAttributes.color,_t=Vn;q.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(_t=_.toneMapping);let ut=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,lt=ut!==void 0?ut.length:0,Le=oe.get(q),ft=p.state.lights;if(Xe===!0&&(J===!0||S!==y)){let Bt=S===y&&q.id===b;he.setState(q,S,Bt)}let je=!1;q.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==ft.state.version||Le.outputColorSpace!==Re||z.isBatchedMesh&&Le.batching===!1||!z.isBatchedMesh&&Le.batching===!0||z.isBatchedMesh&&Le.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Le.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Le.instancing===!1||!z.isInstancedMesh&&Le.instancing===!0||z.isSkinnedMesh&&Le.skinning===!1||!z.isSkinnedMesh&&Le.skinning===!0||z.isInstancedMesh&&Le.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Le.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Le.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Le.instancingMorph===!1&&z.morphTexture!==null||Le.envMap!==Ee||q.fog===!0&&Le.fog!==ue||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==he.numPlanes||Le.numIntersection!==he.numIntersection)||Le.vertexAlphas!==Fe||Le.vertexTangents!==ke||Le.morphTargets!==De||Le.morphNormals!==Je||Le.morphColors!==ot||Le.toneMapping!==_t||Le.morphTargetsCount!==lt)&&(je=!0):(je=!0,Le.__version=q.version);let qt=Le.currentProgram;je===!0&&(qt=Jr(q,O,z));let zi=!1,Yt=!1,Ds=!1,pt=qt.getUniforms(),nn=Le.uniforms;if(j.useProgram(qt.program)&&(zi=!0,Yt=!0,Ds=!0),q.id!==b&&(b=q.id,Yt=!0),zi||y!==S){j.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),pt.setValue(I,"projectionMatrix",S.projectionMatrix),pt.setValue(I,"viewMatrix",S.matrixWorldInverse);let Wt=pt.map.cameraPosition;Wt!==void 0&&Wt.setValue(I,_e.setFromMatrixPosition(S.matrixWorld)),Q.logarithmicDepthBuffer&&pt.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&pt.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),y!==S&&(y=S,Yt=!0,Ds=!0)}if(z.isSkinnedMesh){pt.setOptional(I,z,"bindMatrix"),pt.setOptional(I,z,"bindMatrixInverse");let Bt=z.skeleton;Bt&&(Bt.boneTexture===null&&Bt.computeBoneTexture(),pt.setValue(I,"boneTexture",Bt.boneTexture,pe))}z.isBatchedMesh&&(pt.setOptional(I,z,"batchingTexture"),pt.setValue(I,"batchingTexture",z._matricesTexture,pe),pt.setOptional(I,z,"batchingIdTexture"),pt.setValue(I,"batchingIdTexture",z._indirectTexture,pe),pt.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&pt.setValue(I,"batchingColorTexture",z._colorsTexture,pe));let sn=W.morphAttributes;if((sn.position!==void 0||sn.normal!==void 0||sn.color!==void 0)&&le.update(z,W,qt),(Yt||Le.receiveShadow!==z.receiveShadow)&&(Le.receiveShadow=z.receiveShadow,pt.setValue(I,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(nn.envMap.value=Ee,nn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(nn.envMapIntensity.value=O.environmentIntensity),Yt&&(pt.setValue(I,"toneMappingExposure",_.toneMappingExposure),Le.needsLights&&mu(nn,Ds),ue&&q.fog===!0&&ie.refreshFogUniforms(nn,ue),ie.refreshMaterialUniforms(nn,q,B,G,p.state.transmissionRenderTarget[S.id]),ws.upload(I,rc(Le),nn,pe)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(ws.upload(I,rc(Le),nn,pe),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&pt.setValue(I,"center",z.center),pt.setValue(I,"modelViewMatrix",z.modelViewMatrix),pt.setValue(I,"normalMatrix",z.normalMatrix),pt.setValue(I,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let Bt=q.uniformsGroups;for(let Wt=0,M0=Bt.length;Wt<M0;Wt++){let ui=Bt[Wt];ze.update(ui,qt),ze.bind(ui,qt)}}return qt}function mu(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function gu(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(S,O,W){let q=oe.get(S);q.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),oe.get(S.texture).__webglTexture=O,oe.get(S.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:W,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,O){let W=oe.get(S);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0};let _u=I.createFramebuffer();this.setRenderTarget=function(S,O=0,W=0){N=S,A=O,P=W;let q=!0,z=null,ue=!1,ve=!1;if(S){let Ee=oe.get(S);if(Ee.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(I.FRAMEBUFFER,null),q=!1;else if(Ee.__webglFramebuffer===void 0)pe.setupRenderTarget(S);else if(Ee.__hasExternalTextures)pe.rebindTextures(S,oe.get(S.texture).__webglTexture,oe.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let De=S.depthTexture;if(Ee.__boundDepthTexture!==De){if(De!==null&&oe.has(De)&&(S.width!==De.image.width||S.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");pe.setupDepthRenderbuffer(S)}}let Fe=S.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(ve=!0);let ke=oe.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(ke[O])?z=ke[O][W]:z=ke[O],ue=!0):S.samples>0&&pe.useMultisampledRTT(S)===!1?z=oe.get(S).__webglMultisampledFramebuffer:Array.isArray(ke)?z=ke[W]:z=ke,C.copy(S.viewport),L.copy(S.scissor),F=S.scissorTest}else C.copy(re).multiplyScalar(B).floor(),L.copy(ye).multiplyScalar(B).floor(),F=Ie;if(W!==0&&(z=_u),j.bindFramebuffer(I.FRAMEBUFFER,z)&&q&&j.drawBuffers(S,z),j.viewport(C),j.scissor(L),j.setScissorTest(F),ue){let Ee=oe.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ee.__webglTexture,W)}else if(ve){let Ee=O;for(let Fe=0;Fe<S.textures.length;Fe++){let ke=oe.get(S.textures[Fe]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Fe,ke.__webglTexture,W,Ee)}}else if(S!==null&&W!==0){let Ee=oe.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ee.__webglTexture,W)}b=-1},this.readRenderTargetPixels=function(S,O,W,q,z,ue,ve,Re=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=oe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ve!==void 0&&(Ee=Ee[ve]),Ee){j.bindFramebuffer(I.FRAMEBUFFER,Ee);try{let Fe=S.textures[Re],ke=Fe.format,De=Fe.type;if(!Q.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Q.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-q&&W>=0&&W<=S.height-z&&(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Re),I.readPixels(O,W,q,z,Pe.convert(ke),Pe.convert(De),ue))}finally{let Fe=N!==null?oe.get(N).__webglFramebuffer:null;j.bindFramebuffer(I.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(S,O,W,q,z,ue,ve,Re=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=oe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ve!==void 0&&(Ee=Ee[ve]),Ee)if(O>=0&&O<=S.width-q&&W>=0&&W<=S.height-z){j.bindFramebuffer(I.FRAMEBUFFER,Ee);let Fe=S.textures[Re],ke=Fe.format,De=Fe.type;if(!Q.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Je=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Je),I.bufferData(I.PIXEL_PACK_BUFFER,ue.byteLength,I.STREAM_READ),S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Re),I.readPixels(O,W,q,z,Pe.convert(ke),Pe.convert(De),0);let ot=N!==null?oe.get(N).__webglFramebuffer:null;j.bindFramebuffer(I.FRAMEBUFFER,ot);let _t=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await xh(I,_t,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Je),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ue),I.deleteBuffer(Je),I.deleteSync(_t),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,O=null,W=0){let q=Math.pow(2,-W),z=Math.floor(S.image.width*q),ue=Math.floor(S.image.height*q),ve=O!==null?O.x:0,Re=O!==null?O.y:0;pe.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,ve,Re,z,ue),j.unbindTexture()};let xu=I.createFramebuffer(),vu=I.createFramebuffer();this.copyTextureToTexture=function(S,O,W=null,q=null,z=0,ue=null){ue===null&&(z!==0?(as("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ue=z,z=0):ue=0);let ve,Re,Ee,Fe,ke,De,Je,ot,_t,ut=S.isCompressedTexture?S.mipmaps[ue]:S.image;if(W!==null)ve=W.max.x-W.min.x,Re=W.max.y-W.min.y,Ee=W.isBox3?W.max.z-W.min.z:1,Fe=W.min.x,ke=W.min.y,De=W.isBox3?W.min.z:0;else{let sn=Math.pow(2,-z);ve=Math.floor(ut.width*sn),Re=Math.floor(ut.height*sn),S.isDataArrayTexture?Ee=ut.depth:S.isData3DTexture?Ee=Math.floor(ut.depth*sn):Ee=1,Fe=0,ke=0,De=0}q!==null?(Je=q.x,ot=q.y,_t=q.z):(Je=0,ot=0,_t=0);let lt=Pe.convert(O.format),Le=Pe.convert(O.type),ft;O.isData3DTexture?(pe.setTexture3D(O,0),ft=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(pe.setTexture2DArray(O,0),ft=I.TEXTURE_2D_ARRAY):(pe.setTexture2D(O,0),ft=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);let je=I.getParameter(I.UNPACK_ROW_LENGTH),qt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),zi=I.getParameter(I.UNPACK_SKIP_PIXELS),Yt=I.getParameter(I.UNPACK_SKIP_ROWS),Ds=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ut.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ut.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Fe),I.pixelStorei(I.UNPACK_SKIP_ROWS,ke),I.pixelStorei(I.UNPACK_SKIP_IMAGES,De);let pt=S.isDataArrayTexture||S.isData3DTexture,nn=O.isDataArrayTexture||O.isData3DTexture;if(S.isDepthTexture){let sn=oe.get(S),Bt=oe.get(O),Wt=oe.get(sn.__renderTarget),M0=oe.get(Bt.__renderTarget);j.bindFramebuffer(I.READ_FRAMEBUFFER,Wt.__webglFramebuffer),j.bindFramebuffer(I.DRAW_FRAMEBUFFER,M0.__webglFramebuffer);for(let ui=0;ui<Ee;ui++)pt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,oe.get(S).__webglTexture,z,De+ui),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,oe.get(O).__webglTexture,ue,_t+ui)),I.blitFramebuffer(Fe,ke,ve,Re,Je,ot,ve,Re,I.DEPTH_BUFFER_BIT,I.NEAREST);j.bindFramebuffer(I.READ_FRAMEBUFFER,null),j.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||S.isRenderTargetTexture||oe.has(S)){let sn=oe.get(S),Bt=oe.get(O);j.bindFramebuffer(I.READ_FRAMEBUFFER,xu),j.bindFramebuffer(I.DRAW_FRAMEBUFFER,vu);for(let Wt=0;Wt<Ee;Wt++)pt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,sn.__webglTexture,z,De+Wt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,sn.__webglTexture,z),nn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Bt.__webglTexture,ue,_t+Wt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Bt.__webglTexture,ue),z!==0?I.blitFramebuffer(Fe,ke,ve,Re,Je,ot,ve,Re,I.COLOR_BUFFER_BIT,I.NEAREST):nn?I.copyTexSubImage3D(ft,ue,Je,ot,_t+Wt,Fe,ke,ve,Re):I.copyTexSubImage2D(ft,ue,Je,ot,Fe,ke,ve,Re);j.bindFramebuffer(I.READ_FRAMEBUFFER,null),j.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else nn?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(ft,ue,Je,ot,_t,ve,Re,Ee,lt,Le,ut.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(ft,ue,Je,ot,_t,ve,Re,Ee,lt,ut.data):I.texSubImage3D(ft,ue,Je,ot,_t,ve,Re,Ee,lt,Le,ut):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ue,Je,ot,ve,Re,lt,Le,ut.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ue,Je,ot,ut.width,ut.height,lt,ut.data):I.texSubImage2D(I.TEXTURE_2D,ue,Je,ot,ve,Re,lt,Le,ut);I.pixelStorei(I.UNPACK_ROW_LENGTH,je),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,qt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,zi),I.pixelStorei(I.UNPACK_SKIP_ROWS,Yt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ds),ue===0&&O.generateMipmaps&&I.generateMipmap(ft),j.unbindTexture()},this.initRenderTarget=function(S){oe.get(S).__webglFramebuffer===void 0&&pe.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?pe.setTextureCube(S,0):S.isData3DTexture?pe.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?pe.setTexture2DArray(S,0):pe.setTexture2D(S,0),j.unbindTexture()},this.resetState=function(){A=0,P=0,N=null,j.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}};var eu={type:"change"},Yl={type:"start"},nu={type:"end"},u0=new jn,tu=new on,v3=Math.cos(70*hn.DEG2RAD),wt=new R,Xt=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ql=1e-6,d0=class extends Cr{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ii.ROTATE,MIDDLE:ii.DOLLY,RIGHT:ii.PAN},this.touches={ONE:si.ROTATE,TWO:si.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new an,this._lastTargetPosition=new R,this._quat=new an().setFromUnitVectors(e.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ys,this._sphericalDelta=new ys,this._scale=1,this._panOffset=new R,this._rotateStart=new $,this._rotateEnd=new $,this._rotateDelta=new $,this._panStart=new $,this._panEnd=new $,this._panDelta=new $,this._dollyStart=new $,this._dollyEnd=new $,this._dollyDelta=new $,this._dollyDirection=new R,this._mouse=new $,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=M3.bind(this),this._onPointerDown=y3.bind(this),this._onPointerUp=b3.bind(this),this._onContextMenu=C3.bind(this),this._onMouseWheel=T3.bind(this),this._onKeyDown=w3.bind(this),this._onTouchStart=A3.bind(this),this._onTouchMove=R3.bind(this),this._onMouseDown=S3.bind(this),this._onMouseMove=E3.bind(this),this._interceptControlDown=P3.bind(this),this._interceptControlUp=I3.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(eu),this.update(),this.state=at.NONE}update(e=null){let t=this.object.position;wt.copy(t).sub(this.target),wt.applyQuaternion(this._quat),this._spherical.setFromVector3(wt),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Xt:n>Math.PI&&(n-=Xt),s<-Math.PI?s+=Xt:s>Math.PI&&(s-=Xt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(wt.setFromSpherical(this._spherical),wt.applyQuaternion(this._quatInverse),t.copy(this.target).add(wt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=wt.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new R(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=wt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(u0.origin.copy(this.object.position),u0.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(u0.direction))<v3?this.object.lookAt(this.target):(tu.setFromNormalAndCoplanarPoint(this.object.up,this.target),u0.intersectPlane(tu,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ql||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ql||this._lastTargetPosition.distanceToSquared(this.target)>ql?(this.dispatchEvent(eu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Xt/60*this.autoRotateSpeed*e:Xt/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){wt.setFromMatrixColumn(t,0),wt.multiplyScalar(-e),this._panOffset.add(wt)}_panUp(e,t){this.screenSpacePanning===!0?wt.setFromMatrixColumn(t,1):(wt.setFromMatrixColumn(t,0),wt.crossVectors(this.object.up,wt)),wt.multiplyScalar(e),this._panOffset.add(wt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;wt.copy(s).sub(this.target);let r=wt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Xt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Xt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Xt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new $,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function y3(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function M3(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function b3(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(nu),this.state=at.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function S3(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ii.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=at.DOLLY;break;case ii.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}break;case ii.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(Yl)}function E3(i){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function T3(i){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(i.preventDefault(),this.dispatchEvent(Yl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(nu))}function w3(i){this.enabled!==!1&&this._handleKeyDown(i)}function A3(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case si.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=at.TOUCH_ROTATE;break;case si.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case si.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=at.TOUCH_DOLLY_PAN;break;case si.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(Yl)}function R3(i){switch(this._trackPointer(i),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=at.NONE}}function C3(i){this.enabled!==!1&&i.preventDefault()}function P3(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function I3(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function kr(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new it,c=0;for(let h=0;h<i.length;++h){let u=i[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0,u=[];for(let f=0;f<i.length;++f){let d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=i[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=iu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);let g=iu(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function iu(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ct(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){let x=h.getComponent(f,g);a.setComponent(f+u,g,x)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var f0=class extends Mi{constructor(){super();let e=new It;e.deleteAttribute("uv");let t=new ht({side:Lt}),n=new ht,s=new Tr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new He(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new rr(e,n,6),a=new Mt;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new He(e,Cs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new He(e,Cs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new He(e,Cs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new He(e,Cs(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let f=new He(e,Cs(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let d=new He(e,Cs(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Cs(i){return new Mr({color:0,emissive:16777215,emissiveIntensity:i})}var Ps={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var tn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},D3=new Hn(-1,1,1,-1,0,1),Zl=class extends it{constructor(){super(),this.setAttribute("position",new We([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new We([0,2,0,0,2,0],2))}},L3=new Zl,ci=class{constructor(e){this._mesh=new He(L3,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,D3)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var p0=class extends tn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof bt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Mn.clone(e.uniforms),this.material=new bt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ci(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Hr=class extends tn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},m0=class extends tn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var g0=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new $);this._width=n.width,this._height=n.height,t=new Vt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:yn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new p0(Ps),this.copyPass.material.blending=Rt,this.clock=new Ar}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Hr!==void 0&&(o instanceof Hr?n=!0:o instanceof m0&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new $);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var _0=class extends tn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ue}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var x0=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,f=l-u,d=c-u,g=e-f,x=t-d,m,p;g>x?(m=1,p=0):(m=0,p=1);let E=g-m+h,M=x-p+h,_=g-1+2*h,w=x-1+2*h,A=l&255,P=c&255,N=this.perm[A+this.perm[P]]%12,b=this.perm[A+m+this.perm[P+p]]%12,y=this.perm[A+1+this.perm[P+1]]%12,C=.5-g*g-x*x;C<0?n=0:(C*=C,n=C*C*this._dot(this.grad3[N],g,x));let L=.5-E*E-M*M;L<0?s=0:(L*=L,s=L*L*this._dot(this.grad3[b],E,M));let F=.5-_*_-w*w;return F<0?r=0:(F*=F,r=F*F*this._dot(this.grad3[y],_,w)),70*(n+s+r)}noise3d(e,t,n){let s,r,o,a,c=(e+t+n)*.3333333333333333,h=Math.floor(e+c),u=Math.floor(t+c),f=Math.floor(n+c),d=1/6,g=(h+u+f)*d,x=h-g,m=u-g,p=f-g,E=e-x,M=t-m,_=n-p,w,A,P,N,b,y;E>=M?M>=_?(w=1,A=0,P=0,N=1,b=1,y=0):E>=_?(w=1,A=0,P=0,N=1,b=0,y=1):(w=0,A=0,P=1,N=1,b=0,y=1):M<_?(w=0,A=0,P=1,N=0,b=1,y=1):E<_?(w=0,A=1,P=0,N=0,b=1,y=1):(w=0,A=1,P=0,N=1,b=1,y=0);let C=E-w+d,L=M-A+d,F=_-P+d,H=E-N+2*d,V=M-b+2*d,D=_-y+2*d,G=E-1+3*d,B=M-1+3*d,X=_-1+3*d,K=h&255,re=u&255,ye=f&255,Ie=this.perm[K+this.perm[re+this.perm[ye]]]%12,Ve=this.perm[K+w+this.perm[re+A+this.perm[ye+P]]]%12,Xe=this.perm[K+N+this.perm[re+b+this.perm[ye+y]]]%12,J=this.perm[K+1+this.perm[re+1+this.perm[ye+1]]]%12,te=.6-E*E-M*M-_*_;te<0?s=0:(te*=te,s=te*te*this._dot3(this.grad3[Ie],E,M,_));let _e=.6-C*C-L*L-F*F;_e<0?r=0:(_e*=_e,r=_e*_e*this._dot3(this.grad3[Ve],C,L,F));let Te=.6-H*H-V*V-D*D;Te<0?o=0:(Te*=Te,o=Te*Te*this._dot3(this.grad3[Xe],H,V,D));let Me=.6-G*G-B*B-X*X;return Me<0?a=0:(Me*=Me,a=Me*Me*this._dot3(this.grad3[J],G,B,X)),32*(s+r+o+a)}noise4d(e,t,n,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,f,d,g,x=(e+t+n+s)*l,m=Math.floor(e+x),p=Math.floor(t+x),E=Math.floor(n+x),M=Math.floor(s+x),_=(m+p+E+M)*c,w=m-_,A=p-_,P=E-_,N=M-_,b=e-w,y=t-A,C=n-P,L=s-N,F=b>y?32:0,H=b>C?16:0,V=y>C?8:0,D=b>L?4:0,G=y>L?2:0,B=C>L?1:0,X=F+H+V+D+G+B,K=o[X][0]>=3?1:0,re=o[X][1]>=3?1:0,ye=o[X][2]>=3?1:0,Ie=o[X][3]>=3?1:0,Ve=o[X][0]>=2?1:0,Xe=o[X][1]>=2?1:0,J=o[X][2]>=2?1:0,te=o[X][3]>=2?1:0,_e=o[X][0]>=1?1:0,Te=o[X][1]>=1?1:0,Me=o[X][2]>=1?1:0,Ke=o[X][3]>=1?1:0,tt=b-K+c,I=y-re+c,se=C-ye+c,ee=L-Ie+c,Q=b-Ve+2*c,j=y-Xe+2*c,fe=C-J+2*c,oe=L-te+2*c,pe=b-_e+3*c,Be=y-Te+3*c,Oe=C-Me+3*c,T=L-Ke+3*c,v=b-1+4*c,k=y-1+4*c,Y=C-1+4*c,ie=L-1+4*c,Z=m&255,Se=p&255,he=E&255,be=M&255,Ae=a[Z+a[Se+a[he+a[be]]]]%32,le=a[Z+K+a[Se+re+a[he+ye+a[be+Ie]]]]%32,xe=a[Z+Ve+a[Se+Xe+a[he+J+a[be+te]]]]%32,Ne=a[Z+_e+a[Se+Te+a[he+Me+a[be+Ke]]]]%32,Pe=a[Z+1+a[Se+1+a[he+1+a[be+1]]]]%32,me=.6-b*b-y*y-C*C-L*L;me<0?h=0:(me*=me,h=me*me*this._dot4(r[Ae],b,y,C,L));let ze=.6-tt*tt-I*I-se*se-ee*ee;ze<0?u=0:(ze*=ze,u=ze*ze*this._dot4(r[le],tt,I,se,ee));let U=.6-Q*Q-j*j-fe*fe-oe*oe;U<0?f=0:(U*=U,f=U*U*this._dot4(r[xe],Q,j,fe,oe));let ae=.6-pe*pe-Be*Be-Oe*Oe-T*T;ae<0?d=0:(ae*=ae,d=ae*ae*this._dot4(r[Ne],pe,Be,Oe,T));let de=.6-v*v-k*k-Y*Y-ie*ie;return de<0?g=0:(de*=de,g=de*de*this._dot4(r[Pe],v,k,Y,ie)),27*(h+u+f+d+g)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}_dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}};var Vr={name:"SSAOShader",defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new $},cameraProjectionMatrix:{value:new Qe},cameraInverseProjectionMatrix:{value:new Qe},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},Gr={name:"SSAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Wr={name:"SSAOBlurShader",uniforms:{tDiffuse:{value:null},resolution:{value:new $}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};var Xr=class i extends tn{constructor(e,t,n=512,s=512,r=32){super(),this.width=n,this.height=s,this.clear=!0,this.needsSwap=!1,this.camera=t,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(r),this._generateRandomKernelRotations();let o=new bi;o.format=li,o.type=ai,this.normalRenderTarget=new Vt(this.width,this.height,{minFilter:Pt,magFilter:Pt,type:yn,depthTexture:o}),this.ssaoRenderTarget=new Vt(this.width,this.height,{type:yn}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new bt({defines:Object.assign({},Vr.defines),uniforms:Mn.clone(Vr.uniforms),vertexShader:Vr.vertexShader,fragmentShader:Vr.fragmentShader,blending:Rt}),this.ssaoMaterial.defines.KERNEL_SIZE=r,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new yr,this.normalMaterial.blending=Rt,this.blurMaterial=new bt({defines:Object.assign({},Wr.defines),uniforms:Mn.clone(Wr.uniforms),vertexShader:Wr.vertexShader,fragmentShader:Wr.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new bt({defines:Object.assign({},Gr.defines),uniforms:Mn.clone(Gr.uniforms),vertexShader:Gr.vertexShader,fragmentShader:Gr.fragmentShader,blending:Rt}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new bt({uniforms:Mn.clone(Ps.uniforms),vertexShader:Ps.vertexShader,fragmentShader:Ps.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:la,blendDst:Pr,blendEquation:gn,blendSrcAlpha:aa,blendDstAlpha:Pr,blendEquationAlpha:gn}),this._fsQuad=new ci(null),this._originalClearColor=new Ue}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(e,t,n){switch(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case i.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=Rt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case i.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Rt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case i.OUTPUT.Depth:this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:n);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Rt,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=oa,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:n);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(e,t){this.width=e,this.height=t,this.ssaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.blurRenderTarget.setSize(e,t),this.ssaoMaterial.uniforms.resolution.value.set(e,t),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,t)}_renderPass(e,t,n,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_renderOverride(e,t,n,s,r){e.getClearColor(this._originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this._originalClearColor),e.setClearAlpha(o)}_generateSampleKernel(e){let t=this.kernel;for(let n=0;n<e;n++){let s=new R;s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random(),s.normalize();let r=n/e;r=hn.lerp(.1,1,r*r),s.multiplyScalar(r),t.push(s)}}_generateRandomKernelRotations(){let n=new x0,s=16,r=new Float32Array(s);for(let o=0;o<s;o++){let a=Math.random()*2-1,l=Math.random()*2-1,c=0;r[o]=n.noise3d(a,l,c)}this.noiseTexture=new fs(r,4,4,Ss,en),this.noiseTexture.wrapS=vi,this.noiseTexture.wrapT=vi,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,t.push(n))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}};Xr.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};var qr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var v0=class extends tn{constructor(){super(),this.uniforms=Mn.clone(qr.uniforms),this.material=new vr({name:qr.name,uniforms:this.uniforms,vertexShader:qr.vertexShader,fragmentShader:qr.fragmentShader}),this._fsQuad=new ci(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},$e.getTransfer(this._outputColorSpace)===et&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===_a?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===xa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===va?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ms?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ma?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ba?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ya&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var su=["#80a4ba","#96a5bb","#81b1b3","#a5a1b9","#8ea7bf","#94b7be"],ru="#f3f4f6",$l=class extends Xr{_overrideVisibility(){super._overrideVisibility(),this.scene.traverse(e=>{e.visible&&(e.userData.aoExcluded||e.isSprite||e.isMesh&&e.material?.transparent)&&(e.visible=!1,this._visibilityCache.push(e))})}},au=i=>[...i].reduce((e,t)=>e*31+t.charCodeAt(0)>>>0,17),In=(i,e)=>[(e[0]-i.registration.origin_wcs_mm[0])/1e3,(e[1]-i.registration.origin_wcs_mm[1])/1e3];function lu(i,e){let t=e.outer.map(s=>new $(...In(i,s))),n=new xn(t);for(let s of e.holes||[])n.holes.push(new Ei(s.map(r=>new $(...In(i,r)))));return n}function Kl(i,e,t){return new wi(lu(i,e),{depth:t,bevelEnabled:!1,curveSegments:2}).rotateX(-Math.PI/2)}function Jl(i,e){return new ei(lu(i,e)).rotateX(-Math.PI/2)}function N3(i,e,t=.1){let n=[];for(let r of e)for(let o=1;o<r.length;o++){let a=In(i,r[o-1]),l=In(i,r[o]);n.push(a[0],t,-a[1],l[0],t,-l[1])}let s=new it;return s.setAttribute("position",new We(n,3)),s}function ou(i,e,t){let n=[];for(let[r,o]of e){let a=In(i,r),l=In(i,o);n.push(a[0],0,-a[1],l[0],0,-l[1],l[0],t,-l[1],a[0],0,-a[1],l[0],t,-l[1],a[0],t,-a[1])}let s=new it;return s.setAttribute("position",new We(n,3)),s.setAttribute("uv",new We(new Array(n.length/3*2).fill(0),2)),s.computeVertexNormals(),s}function Yr(i,e="#476b97",t="rgba(255,255,255,.94)",n=8){let s=document.createElement("canvas"),r='500 52px Inter, "PingFang SC", "Microsoft YaHei UI", "Noto Sans SC", sans-serif',o=s.getContext("2d");o.font=r,s.width=Math.ceil(Math.max(n*40,o.measureText(i).width+64)),s.height=128,o=s.getContext("2d"),o.fillStyle=t,o.beginPath(),o.roundRect(2,2,s.width-4,124,18),o.fill(),o.strokeStyle="rgba(109,147,190,.20)",o.lineWidth=3,o.stroke(),o.font=r,o.textAlign="center",o.textBaseline="middle",o.fillStyle=e,o.fillText(i,s.width/2,67);let a=new Qn(s);a.colorSpace=St;let l=new sr(new ds({map:a,transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1}));return l.scale.set(n,n/(s.width/128),1),l.userData.labelPixels=s.width/4,l.userData.labelAspect=s.width/128,l.renderOrder=20,l}function jl(i,e){let t=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){let r=e[n],o=e[s];r[1]>i[1]!=o[1]>i[1]&&i[0]<(o[0]-r[0])*(i[1]-r[1])/(o[1]-r[1])+r[0]&&(t=!t)}return t}function ec(i,e){let t=au(i.spatial_id),n=e?.demo_camera_wcs_mm;return{simulated:!0,input_origin:"SIMULATED",demo_zone_id:"SIM-"+i.spatial_id,camera_count:n&&jl(n,i.footprint.outer)&&!i.footprint.holes.some(s=>jl(n,s))?1:0,visitors:8+t%24,dwell_seconds:95+t%210,experience_events:1+t%5,feedback:["\u7A7F\u8D77\u6765\u8FD8\u53EF\u4EE5\uFF0C\u4F46\u662F\u8170\u90E8\u6709\u70B9\u7D27\u3002","\u4E0A\u5761\u7684\u65F6\u5019\u611F\u89C9\u52A9\u529B\u8FD8\u4E0D\u9519\u3002","\u8D70\u4E45\u4E86\u4E4B\u540E\u611F\u89C9\u6709\u4E00\u70B9\u91CD\u3002"][t%3],event_id:"SIM-E-"+t,session_id:"SIM-SESSION-"+i.floor_id,feedback_status:"SIMULATED / \u793A\u4F8B\u539F\u8BDD\uFF0C\u975E\u73B0\u573A\u89C2\u6D4B"}}var Ql=class{constructor(e,{models:t,onSelect:n,onCamera:s,onEvent:r,onChange:o}){this.host=e,this.models=t,this.onSelect=n,this.onCamera=s,this.onEvent=r,this.onChange=o,this.abort=new AbortController,this.disposed=!1,this.floorGroups=new Map,this.regionMeshes=new Map,this.pickables=[],this.cameraRecords=[],this.demoCurves=[],this.selected=null,this.renderer=new c0({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)),this.renderer.setClearColor(ru),this.renderer.outputColorSpace=St,this.renderer.toneMapping=Ms,this.renderer.toneMappingExposure=.9,this.renderer.info.autoReset=!1,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ra,this.renderer.domElement.className="space-webgl",this.renderer.domElement.setAttribute("aria-label","\u53EF\u4EA4\u4E92\u4E09\u7EF4\u5EFA\u7B51\u6A21\u578B\uFF1B\u62D6\u52A8\u65CB\u8F6C\uFF0C\u53F3\u952E\u5E73\u79FB\uFF0C\u6EDA\u8F6E\u7F29\u653E"),this.renderer.domElement.tabIndex=0,this.renderer.domElement.__huboneViewer=this,this.scene=new Mi,this.scene.background=new Ue().setRGB(2.2,2.23,2.27);let a=new f0,l=new As(this.renderer);this.environmentTarget=l.fromScene(a,.04),this.scene.environment=this.environmentTarget.texture,this.scene.environmentIntensity=.12,a.dispose(),l.dispose(),this.camera=new Hn(-100,100,80,-80,.1,1200),this.camera.position.set(150,150,150),this.controls=new d0(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.13,this.controls.minZoom=.3,this.controls.maxZoom=24,this.controls.minPolarAngle=.05,this.controls.maxPolarAngle=Math.PI/2-.025,this.controls.screenSpacePanning=!0,this.controls.addEventListener("change",()=>{this.invalidate(),this.onChange?.(Math.round(this.camera.zoom*100))}),this.controls.addEventListener("start",()=>{this.focusMotion=null,this.controls.enableDamping=!0}),this.scene.add(new Er("#f5f7ff","#c0bdb6",.7)),this.scene.add(new wr("#ffffff",.18));let c=new vs("#dcecff",.7);c.position.set(70,45,-85),this.scene.add(c);let h=new vs("#fff4df",2.5);h.position.set(-30,110,60),h.castShadow=!0,h.shadow.mapSize.set(2048,2048),Object.assign(h.shadow.camera,{left:-110,right:110,top:90,bottom:-90,near:1,far:700}),h.shadow.normalBias=.035,h.shadow.bias=-1e-4,h.shadow.radius=3,this.sun=h,this.scene.add(h),this.scene.add(h.target),this.wallMaterial=new ht({color:"#f1eee7",roughness:.78,metalness:.015,side:vt}),this.columnMaterial=new ht({color:"#d9d6cf",roughness:.76,metalness:.025}),this.glassMaterial=new Ri({color:"#91c6d1",transparent:!0,opacity:.36,roughness:.17,metalness:.06,clearcoat:.4,clearcoatRoughness:.2,side:vt,depthWrite:!1}),this.slabMaterial=new ht({color:"#dfe1df",roughness:.88,metalness:.015}),this.cadLineMaterial=new Dt({color:"#87939f",transparent:!0,opacity:.48});for(let g of t)this.buildFloor(g);let u=this.fullBounds();this.modelCenter=u.getCenter(new R);let f=new He(new jt(430,340),new Ot({color:ru,toneMapped:!1}));f.material.color.copy(this.scene.background),f.rotation.x=-Math.PI/2,f.position.set(this.modelCenter.x,-.42,this.modelCenter.z),this.scene.add(f);let d=new He(new jt(430,340),new xr({color:"#737d89",opacity:.14}));d.rotation.x=-Math.PI/2,d.position.copy(f.position),d.position.y+=.002,d.receiveShadow=!0,this.scene.add(d),h.target.position.copy(this.modelCenter),h.position.add(new R(this.modelCenter.x,0,this.modelCenter.z)),this.screenLabels=[],this.scene.traverse(g=>{g.isSprite&&g.userData.labelPixels&&this.screenLabels.push(g)}),this.ray=new Rr,this.ndc=new $,e.replaceChildren(this.renderer.domElement),this.resize=new ResizeObserver(()=>this.onResize()),this.resize.observe(e),this.renderer.domElement.addEventListener("pointerdown",g=>{this.renderer.domElement.focus({preventScroll:!0}),this.down={x:g.clientX,y:g.clientY}},{signal:this.abort.signal}),this.renderer.domElement.addEventListener("pointerup",g=>this.pick(g),{signal:this.abort.signal}),this.renderer.domElement.addEventListener("pointermove",g=>{(!this.down||g.buttons===0)&&this.hover(g)},{signal:this.abort.signal}),this.renderer.domElement.addEventListener("contextmenu",g=>g.preventDefault(),{signal:this.abort.signal}),this.renderer.extensions.has("EXT_color_buffer_float")&&(this.composer=new g0(this.renderer),this.composer.addPass(new _0(this.scene,this.camera)),this.ao=new $l(this.scene,this.camera,512,512,16),this.ao.kernelRadius=.85,this.ao.minDistance=2e-5,this.ao.maxDistance=.002,this.ao.ssaoMaterial.defines.PERSPECTIVE_CAMERA=0,this.ao.depthRenderMaterial.defines.PERSPECTIVE_CAMERA=0,this.composer.addPass(this.ao),this.composer.addPass(new v0)),this.setOptions({floorId:t[0].floor_id,floorDisplay:"both",explode:0,simulated:!1,layers:{structure:!0,zones:!0,cameras:!1,coverage:!1}}),this.onResize(),this.fit(!0),this.renderer.domElement.dataset.ready="true",this.invalidate()}addMerged(e,t,n,s=!0){if(!t.length)return;let r=kr(t.map(a=>a.index?a.toNonIndexed():a),!1);for(let a of t)a.dispose();let o=new He(r,n);return o.castShadow=s,o.receiveShadow=!0,e.add(o),o}buildFloor(e){let t=new gt;t.name=e.floor_id,t.userData.model=e;let n=new gt,s=new gt,r=new gt;s.userData.aoExcluded=!0,r.userData.aoExcluded=!0,t.add(n,s,r),this.scene.add(t),this.floorGroups.set(e.floor_id,{group:t,structure:n,zones:s,operations:r,model:e});let o=e.demo_height_defaults_mm,a=[],l=[],c=[],h=[];for(let m of e.components)if(m.kind==="column"||m.kind==="wall_solid"){let p=Kl(e,m.footprint,(m.kind==="column"?o.column:o.wall)/1e3);(m.kind==="column"?a:l).push(p)}else m.kind==="wall_plane"?l.push(ou(e,m.segments,o.wall/1e3)):m.kind==="glazing"?c.push(ou(e,m.segments,o.glazing/1e3)):m.kind==="stair_plan"&&h.push(...m.paths_wcs_xyz_mm);for(let[m,p,E,M]of[["columns",a,this.columnMaterial,!0],["walls",l,this.wallMaterial,!0],["glazing",c,this.glassMaterial,!1]]){let _=this.addMerged(n,p,E,M);_&&(_.userData.assetType=m)}if(h.length){let m=new Gt(N3(e,h,.09),this.cadLineMaterial);m.userData.assetType="stairs",n.add(m)}let u=[];for(let m of e.presentation_slab.footprints)u.push(Kl(e,m,o.slab/1e3).translate(0,-o.slab/1e3,0));let f=this.addMerged(n,u,this.slabMaterial);f.userData.provenance="SIMULATED_RECONSTRUCTION",f.userData.assetType="slabs";let d=new Gt(new Rn(f.geometry,28),new Dt({color:"#aeb6bf",transparent:!0,opacity:.28}));d.userData.assetType="slabs",n.add(d);for(let[m,p]of[...e.regions].sort((E,M)=>M.area_m2-E.area_m2).entries()){let E=new Ot({color:su[au(p.spatial_id)%su.length],transparent:!0,opacity:.12,side:vt,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,toneMapped:!1}),M=new He(Jl(e,p.footprint),E);M.position.y=.02+m*2e-4,M.renderOrder=2,M.userData={kind:"region",region:p,model:e,baseColor:E.color.clone()},s.add(M),this.regionMeshes.set(p.spatial_id,M),this.pickables.push(M);let _=new He(Kl(e,p.footprint,o.wall/1e3*.65),new Ot({color:E.color,transparent:!0,opacity:.025,side:vt,depthWrite:!1,toneMapped:!1}));_.geometry.computeBoundingBox(),_.position.y=.025,_.renderOrder=1,_.userData={kind:"region",region:p,model:e,vertical_provenance:"SIMULATED"},s.add(_),M.userData.volume=_,this.pickables.push(_)}let g=new xt().setFromObject(n),x=Yr(`${e.level.toString().padStart(2,"0")}F  /  CAD PLAN`,"#42668e","rgba(255,255,255,.94)",10);x.position.set(g.min.x+5,.7,g.max.z+3),x.material.depthTest=!1,x.userData.floorLabel=!0,t.add(x),this.buildOperations(e,r)}buildOperations(e,t){let n={};for(let E of["activity","heatmap","trajectories","experience","events","cameras","coverage"])n[E]=new gt,n[E].name=E,t.add(n[E]);t.userData.parts=n;let s=e.regions.filter(E=>E.method==="CAD_LINEWORK_POLYGONIZATION"&&E.area_m2>25).sort((E,M)=>M.area_m2-E.area_m2).slice(0,5),r=s.length?s:e.regions.slice(0,3);for(let[E,M]of r.entries()){let _=In(e,M.label_wcs_mm),w=ec(M,e),A=Yr(`${w.visitors}  /  SIM`,E%2?"#6e62b2":"#278c9e","rgba(255,255,255,.9)",7);A.position.set(_[0],.7,-_[1]),n.activity.add(A);let P=Yr(`\u2197 ${w.experience_events}  SIM`,"#a57b37","rgba(255,248,229,.96)",6);if(P.position.set(_[0]+1,2,-_[1]),P.userData={...P.userData,kind:"event",model:e,region:M,demo:w},n.events.add(P),this.pickables.push(P),E===0){let y=new He(Jl(e,M.footprint),new Ot({color:"#7969d1",transparent:!0,opacity:.3,side:vt,depthWrite:!1}));y.position.y=.08,n.experience.add(y);let C=Yr("CREST C3 / SIM","#6e62b2","rgba(250,247,255,.95)",10);C.position.set(_[0],1.5,-_[1]-2),n.experience.add(C);let L=new He(new It(2.6,.7,1.4),new ht({color:"#628abb",roughness:.6}));L.position.set(_[0],.35,-_[1]),L.castShadow=!0,n.experience.add(L);let F=new He(new It(2.9,.12,1.65),new ht({color:"#f8fafc",roughness:.55}));F.position.set(_[0],.76,-_[1]),F.castShadow=!0,n.experience.add(F)}let b=M.footprint.outer.filter((y,C)=>C%Math.max(1,Math.floor(M.footprint.outer.length/6))===0).slice(0,6).map(y=>{let C=[M.label_wcs_mm[0]*.65+y[0]*.35,M.label_wcs_mm[1]*.65+y[1]*.35];jl(C,M.footprint.outer)||(C=M.label_wcs_mm);let L=In(e,C);return new R(L[0],.25,-L[1])});if(b.length>=3){let y=new _s(b,!0,"centripetal"),C=new He(new _r(y,64,.14,5,!0),new Ot({color:E%2?"#8372cf":"#36b8b6",transparent:!0,opacity:.8}));n.trajectories.add(C);let L=new He(new Ai(.35,8,6),new Ot({color:"#ffffff"}));n.trajectories.add(L),this.demoCurves.push({curve:y,dot:L,offset:E*.17})}}this.buildHeatmap(e,n.heatmap,r);let o=e.source_bounds_wcs_mm,a=e.demo_camera_wcs_mm||[(o[0]+o[2])/2,(o[1]+o[3])/2],l={camera_id:"SIM-"+e.floor_id+"-01",building_id:e.building_id,floor_id:e.floor_id,zone_id:null,x:a[0],y:a[1],z:null,direction:35,field_of_view:70,range_mm:9e3,stream_url:null,status:"not_connected",simulated:!0,input_origin:"SIMULATED"},c=In(e,[l.x,l.y]);this.cameraRecords.push(l);let h=new gt;h.position.set(c[0],2.8,-c[1]),h.rotation.y=(90+l.direction)*Math.PI/180;let u=new He(new It(1.4,.8,1.05),new ht({color:"#ffffff",roughness:.4})),f=new He(new Si(.3,.3,.3,12),new ht({color:"#315b85"}));f.rotation.x=Math.PI/2,f.position.z=.65,h.add(u,f),n.cameras.add(h);for(let E of[u,f])E.userData={kind:"camera",camera:l,model:e},this.pickables.push(E);let d=Yr(`${e.level}F CAM / SIM`,"#38648d","rgba(255,255,255,.98)",7);d.position.set(c[0],3.7,-c[1]),d.userData={...d.userData,kind:"camera",camera:l,model:e},n.cameras.add(d),this.pickables.push(d);let g=new xn;g.moveTo(c[0],-c[1]);let x=l.range_mm/1e3;for(let E=0;E<=32;E++){let M=(l.direction-l.field_of_view/2+l.field_of_view*E/32)*Math.PI/180;g.lineTo(c[0]+x*Math.cos(M),-c[1]-x*Math.sin(M))}g.closePath();let m=new ei(g);m.rotateX(Math.PI/2);let p=new He(m,new Ot({color:"#76aee0",transparent:!0,opacity:.19,side:vt,depthWrite:!1}));p.position.y=.13,n.coverage.add(p)}buildHeatmap(e,t,n){let s=e.source_bounds_wcs_mm,r=document.createElement("canvas");r.width=1024,r.height=512;let o=r.getContext("2d");for(let[c,h]of n.entries()){let u=(h.label_wcs_mm[0]-s[0])/(s[2]-s[0])*1024,f=(s[3]-h.label_wcs_mm[1])/(s[3]-s[1])*512,d=o.createRadialGradient(u,f,0,u,f,210);d.addColorStop(0,c%2?"rgba(155,74,220,.88)":"rgba(28,200,190,.88)"),d.addColorStop(.48,c%2?"rgba(149,101,222,.51)":"rgba(58,182,221,.52)"),d.addColorStop(1,"rgba(80,160,220,0)"),o.fillStyle=d,o.fillRect(u-210,f-210,420,420)}let a=new Qn(r);a.colorSpace=St,a.flipY=!0;let l=new Ot({map:a,transparent:!0,opacity:.86,side:vt,depthWrite:!1});for(let c of e.presentation_slab.footprints){let h=Jl(e,c),u=h.attributes.position,f=[];for(let g=0;g<u.count;g++){let x=u.getX(g)*1e3+e.registration.origin_wcs_mm[0],m=-u.getZ(g)*1e3+e.registration.origin_wcs_mm[1];f.push((x-s[0])/(s[2]-s[0]),(m-s[1])/(s[3]-s[1]))}h.setAttribute("uv",new We(f,2));let d=new He(h,l);d.position.y=.09,d.renderOrder=6,t.add(d)}}isVisible(e){let t=e;for(;t;){if(!t.visible)return!1;t=t.parent}return!0}hits(e){let t=this.renderer.domElement.getBoundingClientRect();return this.ndc.set((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),this.ray.setFromCamera(this.ndc,this.camera),this.ray.intersectObjects(this.pickables.filter(n=>this.isVisible(n)),!1)}pick(e){let t=this.down;if(this.down=null,!t||Math.hypot(e.clientX-t.x,e.clientY-t.y)>5||e.button!==0)return;let n=this.hits(e);if(!n.length)return;let s=n[0],r=n.filter(a=>Math.abs(a.distance-s.distance)<.1&&a.object.userData.kind==="region");s.object.userData.kind==="region"&&r.length&&(s=r.sort((a,l)=>a.object.userData.region.area_m2-l.object.userData.region.area_m2)[0]);let o=s.object.userData;o.kind==="camera"?this.onCamera?.(o.camera):(this.selectRegion(o.region.spatial_id),(o.kind==="event"?this.onEvent:this.onSelect)?.(o.region,o.model))}hover(e){this.renderer.domElement.style.cursor=this.hits(e).length?"pointer":"grab"}selectRegion(e){for(let[t,n]of this.regionMeshes){let s=t===e;if(n.material.color.copy(s?new Ue("#388abd"):n.userData.baseColor),n.material.opacity=s?.38:.12,n.userData.volume.material.color.copy(n.material.color),n.userData.volume.material.opacity=s?.12:.025,s&&!n.userData.outline){let r=new Gt(new Rn(n.userData.volume.geometry,35),new Dt({color:"#276c9b",transparent:!0,opacity:.65,depthWrite:!1}));r.position.copy(n.userData.volume.position),n.parent.add(r),n.userData.outline=r}n.userData.outline&&(n.userData.outline.visible=s)}this.selected=e,this.invalidate()}setOptions(e){this.options={...this.options,...e};let t=this.options;for(let{group:n,structure:s,zones:r,operations:o,model:a}of this.floorGroups.values()){n.visible=t.floorDisplay==="both"||a.floor_id===t.floorId,n.position.y=t.floorDisplay==="both"?(a.level-1)*(a.demo_height_defaults_mm.floor_spacing/1e3+t.explode*10):0,s.visible=t.layers.structure!==!1,r.visible=t.layers.zones!==!1;for(let l of s.children)l.userData.assetType&&(l.visible=t.assets?.[l.userData.assetType]!==!1);o.visible=!!t.simulated;for(let[l,c]of Object.entries(o.userData.parts))c.visible=!!t.layers[l]}this.invalidate()}fullBounds(){let e=new xt;for(let{structure:t,group:n}of this.floorGroups.values())n.visible&&(n.updateMatrixWorld(!0),e.union(new xt().setFromObject(t)));return e}fit(e=!0){let t=this.fullBounds(),n=t.getCenter(new R);if(t.isEmpty())return;this.focusMotion=null,this.focusedRegion=null,this.controls.enableDamping=!0;let s=e?new R(1,1,1).normalize():this.camera.position.clone().sub(this.controls.target).normalize();this.controls.target.copy(n),this.camera.position.copy(n).addScaledVector(s,280),this.camera.lookAt(n),this.camera.updateMatrixWorld(!0);let r=new xt;for(let c of[t.min.x,t.max.x])for(let h of[t.min.y,t.max.y])for(let u of[t.min.z,t.max.z])r.expandByPoint(new R(c,h,u).applyMatrix4(this.camera.matrixWorldInverse));let o=r.getSize(new R),a=Math.max(1,this.host.clientWidth)/Math.max(1,this.host.clientHeight);this.halfHeight=Math.max(o.y,o.x/a)*.57;let l=Math.max(t.getSize(new R).length()*.6,35);this.sun.target.position.copy(n),this.sun.position.copy(n).add(new R(-l,l*1.65,l*.8)),Object.assign(this.sun.shadow.camera,{left:-l,right:l,top:l,bottom:-l,near:1,far:l*5}),this.sun.shadow.camera.updateProjectionMatrix(),this.camera.zoom=1,this.updateProjection(),this.controls.update(),this.onChange?.(100),this.invalidate()}updateProjection(){let e=Math.max(1,this.host.clientWidth)/Math.max(1,this.host.clientHeight),t=this.halfHeight||70;Object.assign(this.camera,{left:-t*e,right:t*e,top:t,bottom:-t}),this.camera.updateProjectionMatrix()}onResize(){if(this.disposed)return;let e=Math.max(1,this.host.clientWidth),t=Math.max(1,this.host.clientHeight);if(this.renderer.setSize(e,t,!1),this.updateProjection(),this.fit(!1),this.composer){this.composer.setSize(e,t);let n=this.renderer.getPixelRatio();this.ao.setSize(Math.round(e*n*.65),Math.round(t*n*.65)),this.ao.enabled=e>=520}this.invalidate()}focusRegion(e){let t=this.regionMeshes.get(e);if(!t||!this.isVisible(t))return!1;t.parent.updateMatrixWorld(!0);let n=new xt().setFromObject(t.userData.volume),s=n.getCenter(new R),r=this.camera.position.clone().sub(this.controls.target).normalize(),o=this.camera.clone();o.position.copy(s).addScaledVector(r,280),o.lookAt(s),o.updateMatrixWorld(!0);let a=new xt;for(let h of[n.min.x,n.max.x])for(let u of[n.min.y,n.max.y])for(let f of[n.min.z,n.max.z])a.expandByPoint(new R(h,u,f).applyMatrix4(o.matrixWorldInverse));let l=a.getSize(new R),c=hn.clamp(Math.min((this.camera.right-this.camera.left)/Math.max(l.x,1),(this.camera.top-this.camera.bottom)/Math.max(l.y,1))*.74,1,10);return this.focusedRegion=e,this.controls.enableDamping=!1,this.focusMotion={start:performance.now(),duration:matchMedia("(prefers-reduced-motion: reduce)").matches?0:420,fromPosition:this.camera.position.clone(),toPosition:o.position.clone(),fromTarget:this.controls.target.clone(),toTarget:s,fromZoom:this.camera.zoom,toZoom:c},this.invalidate(),!0}projectedBounds(){let e=this.fullBounds(),t=[];for(let n of[e.min.x,e.max.x])for(let s of[e.min.y,e.max.y])for(let r of[e.min.z,e.max.z])t.push(new R(n,s,r).project(this.camera));return{minX:Math.min(...t.map(n=>n.x)),maxX:Math.max(...t.map(n=>n.x)),minY:Math.min(...t.map(n=>n.y)),maxY:Math.max(...t.map(n=>n.y))}}zoom(e){this.camera.zoom=hn.clamp(this.camera.zoom/e,.3,24),this.camera.updateProjectionMatrix(),this.onChange?.(Math.round(this.camera.zoom*100)),this.invalidate()}orbit(e){let t=this.camera.position.clone().sub(this.controls.target).applyAxisAngle(new R(0,1,0),e);this.camera.position.copy(this.controls.target).add(t),this.controls.update(),this.invalidate()}setExplode(e){this.setOptions({explode:e}),this.fit(!1)}projectRegion(e){let t=this.regionMeshes.get(e);if(!t||!this.isVisible(t))return null;let n=t.userData,s=In(n.model,n.region.label_wcs_mm),r=new R(s[0],.1,-s[1]);t.parent.localToWorld(r),r.project(this.camera);let o=this.renderer.domElement.getBoundingClientRect();return{x:o.left+(r.x+1)*o.width/2,y:o.top+(1-r.y)*o.height/2}}getDiagnostics(){return{ready:!this.disposed,engine:"Three.js r180",renderCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,visibleFloors:[...this.floorGroups].filter(([,e])=>e.group.visible).map(([e])=>e),selectedSpatialId:this.selected,cameraPosition:this.camera.position.toArray(),cameraTarget:this.controls.target.toArray(),zoom:this.camera.zoom,simulated:this.options?.simulated,explode:this.options?.explode,focusedRegionId:this.focusedRegion||null,focusAnimating:!!this.focusMotion,fitBoundsNDC:this.projectedBounds(),rendering:{ambientOcclusion:this.ao?.enabled?"SSAO":this.ao?"OFF_COMPACT_VIEW":"UNAVAILABLE",aoSamples:16,environment:"RoomEnvironment",shadowMapSize:this.sun.shadow.mapSize.x,pixelRatio:this.renderer.getPixelRatio(),wallColor:this.wallMaterial.color.getHexString(),columnColor:this.columnMaterial.color.getHexString(),glassColor:this.glassMaterial.color.getHexString(),glassOpacity:this.glassMaterial.opacity,slabColor:this.slabMaterial.color.getHexString()},floorY:Object.fromEntries([...this.floorGroups].map(([e,t])=>[e,t.group.position.y])),activeOperations:Object.fromEntries(["activity","heatmap","trajectories","experience","events","cameras","coverage"].map(e=>[e,[...this.floorGroups.values()].filter(t=>t.group.visible&&t.operations.visible&&t.operations.userData.parts[e].visible).length])),activeAssets:Object.fromEntries(["walls","columns","glazing","stairs","slabs"].map(e=>[e,[...this.floorGroups.values()].filter(t=>t.group.visible&&t.structure.visible).reduce((t,n)=>t+n.structure.children.filter(s=>s.userData.assetType===e&&s.visible).length,0)])),regions:[...this.regionMeshes].filter(([,e])=>this.isVisible(e)).map(([e,t])=>({id:e,floor_id:t.userData.model.floor_id,area_m2:t.userData.region.area_m2,volumeHeight:t.userData.volume.geometry.boundingBox.max.y-t.userData.volume.geometry.boundingBox.min.y,volumeProvenance:t.userData.volume.userData.vertical_provenance}))}}invalidate(){this.disposed||this.frame||(this.frame=requestAnimationFrame(e=>this.draw(e)))}draw(e){if(this.frame=null,this.disposed)return;if(this.focusMotion){let r=this.focusMotion,o=r.duration?Math.max(0,Math.min(1,(e-r.start)/r.duration)):1,a=1-Math.pow(1-o,3);this.camera.position.lerpVectors(r.fromPosition,r.toPosition,a),this.controls.target.lerpVectors(r.fromTarget,r.toTarget,a),this.camera.zoom=hn.lerp(r.fromZoom,r.toZoom,a),this.updateProjection(),this.onChange?.(Math.round(this.camera.zoom*100)),o===1&&(this.focusMotion=null,this.controls.enableDamping=!0)}let t=this.controls.update(),n=this.options?.simulated&&this.options?.layers.trajectories,s=(this.camera.top-this.camera.bottom)/this.camera.zoom/Math.max(1,this.host.clientHeight);for(let r of this.screenLabels){let o=r.userData.labelPixels*s;r.scale.set(o,o/(r.userData.labelAspect||4),1),r.userData.floorLabel&&(r.visible=this.host.clientWidth>=520&&(this.options?.floorDisplay==="single"||this.options?.explode>.15))}if(n)for(let r of this.demoCurves)r.dot.position.copy(r.curve.getPointAt((e/24e3+r.offset)%1));this.renderer.info.reset(),this.composer?(this.ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.composer.render()):this.renderer.render(this.scene,this.camera),(t||n||this.focusMotion)&&this.invalidate()}destroy(){this.disposed=!0,cancelAnimationFrame(this.frame),this.abort.abort(),this.resize.disconnect(),this.controls.dispose();let e=new Set,t=new Set,n=new Set;this.scene.traverse(s=>{s.geometry&&e.add(s.geometry);for(let r of s.material?Array.isArray(s.material)?s.material:[s.material]:[]){t.add(r);for(let o of Object.values(r))o?.isTexture&&n.add(o)}}),e.forEach(s=>s.dispose()),n.forEach(s=>s.dispose()),t.forEach(s=>s.dispose()),this.composer?.passes.forEach(s=>s.dispose?.()),this.ao?.ssaoMaterial.dispose(),this.ao?.noiseTexture.dispose(),this.composer?.dispose(),this.environmentTarget?.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.renderer.domElement.remove()}};function cu(i,e){return new Ql(i,e)}var bn=Object.freeze({wall:"#e9e7e2",column:"#cfceca",glass:"#b6d5dc",slab:"#d8dad7",graphite:"#39444b",region:"#aeb8bc",selection:"#c9473e"});function hu(i,e){let t=cu(i,e);t.wallMaterial.color.set(bn.wall),Object.assign(t.wallMaterial,{roughness:.83,metalness:.01}),t.columnMaterial.color.set(bn.column),Object.assign(t.columnMaterial,{roughness:.8,metalness:.02}),t.glassMaterial.color.set(bn.glass),Object.assign(t.glassMaterial,{opacity:.29,roughness:.19,metalness:.08,clearcoat:.65,clearcoatRoughness:.22}),t.slabMaterial.color.set(bn.slab),t.cadLineMaterial.color.set(bn.graphite),t.cadLineMaterial.opacity=.58,t.scene.environmentIntensity=.09,t.scene.background.setRGB(2.26,2.23,2.17),t.scene.traverse(r=>{r.isHemisphereLight?(r.color.set("#ffffff"),r.groundColor.set("#b3afa5"),r.intensity=.65):r.isAmbientLight?r.intensity=.16:r.isDirectionalLight&&!r.castShadow&&(r.color.set("#e8edf1"),r.intensity=.5),r.isMesh&&r.material?.isMeshBasicMaterial&&!r.userData.kind&&!r.parent?.userData.model&&r.geometry?.type==="PlaneGeometry"&&r.material.color.copy(t.scene.background),r.material?.isShadowMaterial&&(r.material.color.set("#646a70"),r.material.opacity=.23)}),t.sun.color.set("#fff7ec"),t.sun.intensity=3,t.sun.shadow.radius=3.5,t.ao&&(t.ao.kernelRadius=1.05,t.ao.maxDistance=.003);for(let{structure:r}of t.floorGroups.values())for(let o of[...r.children])if(o.isLineSegments&&(o.material.color.set("#727c80"),o.material.opacity=.27),o.isMesh&&o.userData.assetType==="glazing"){let a=new Gt(new Rn(o.geometry,35),new Dt({color:bn.graphite,transparent:!0,opacity:.36,depthWrite:!1}));a.userData={assetType:"glazing",presentationOnly:!0,provenance:"CAD_DERIVED_RENDER_EDGES; metalwork dimensions are not surveyed"},r.add(a)}for(let r of t.regionMeshes.values())r.userData.baseColor.set(bn.region);let n=t.selectRegion.bind(t);t.selectRegion=r=>{n(r);for(let[o,a]of t.regionMeshes){let l=o===r;a.material.color.set(l?bn.selection:bn.region),a.material.opacity=l?.27:.035,a.userData.volume.material.color.copy(a.material.color),a.userData.volume.material.opacity=l?.085:0,a.userData.outline&&(a.userData.outline.material.color.set(bn.selection),a.userData.outline.material.opacity=.55)}t.invalidate()},t.selectRegion(null);let s=t.getDiagnostics.bind(t);return t.getDiagnostics=()=>({...s(),presentation:{version:"V2",stage:1,style:"ARCHITECTURAL_STUDY",selectionColor:bn.selection,selectionMeaning:"USER_SELECTION_ONLY",newBuildingGeometry:!1,measuredMetalwork:!1,baseRenderer:"UNMODIFIED_V0.4",facadeEdgeSource:"EXISTING_CAD_DERIVED_GLAZING",surveyedHeights:!1}}),t.renderer.domElement.dataset.spacePresentation="v2-stage1",t.invalidate(),t}function Zr(i,e,t,n,s=.1){let r=e[0]-i[0],o=-(e[1]-i[1]),a=Math.hypot(r,o);return new It(a,n,s).rotateY(-Math.atan2(o,r)).translate((i[0]+e[0])/2,t+n/2,-(i[1]+e[1])/2)}function Wn(i,e,t,n,s=!0){if(!e.length)return;let r=e.map(l=>l.index?l.toNonIndexed():l),o=kr(r,!1);new Set([...e,...r]).forEach(l=>l.dispose());let a=new He(o,t);return a.name=n,a.castShadow=s,a.receiveShadow=!0,a.userData={presentationOnly:!0,input_origin:"SIMULATED",source_kind:"PDF_REFERENCE",physical_dimensions_verified:!1},i.add(a),a}function uu(i){let e=new gt;e.name="V21_PDF_REFERENCE_ENVELOPE",e.userData={spatial_id:i.spatial_id,status:i.facade_status,source_pdf_pages:[1,2,3,4,5]};let t=i.display_parameters,n=i.outline_local_xy_m,[s,r,o,a]=i.bounds_local_xy_m,l=(r+a)/2,c=(a-r)/2,h=[],u=[],f=[],d=[],g=new ht({color:"#eeeae2",roughness:.85,metalness:.01,side:vt}),x=new ht({color:"#303b40",roughness:.5,metalness:.32}),m=new Ri({color:"#adcbd1",roughness:.16,metalness:.09,clearcoat:.8,clearcoatRoughness:.14,transparent:!0,opacity:.38,depthWrite:!1,side:vt}),p=new ht({color:"#595448",roughness:.8}),E=0,M=0;for(let y=1;y<n.length;y++){let C=n[y-1],L=n[y],F=Math.hypot(L[0]-C[0],L[1]-C[1]);if(F<.25)continue;let H=Math.max(1,Math.ceil(F/t.facade_module_m));for(let V=0;V<H;V++){let D=C.map((Ie,Ve)=>Ie+(L[Ve]-Ie)*V/H),G=C.map((Ie,Ve)=>Ie+(L[Ve]-Ie)*(V+1)/H),B=(D[0]+G[0])/2,X=(D[1]+G[1])/2,K=(B-s)/(o-s),re=X>l&&(K>.12&&K<.34||K>.56&&K<.7)||X<l&&(K>.225&&K<.265||K>.715&&K<.765),ye=X<l&&(K>.1&&K<.31||K>.49&&K<.57);if(re)h.push(Zr(D,G,0,t.eave_height_m,.22));else{u.push(Zr(D,G,.1,t.eave_height_m-.2,.035)),M++;let Ie=D.map((Ve,Xe)=>(Ve+G[Xe])/2);f.push(new It(t.frame_width_m,t.eave_height_m,.17).translate(D[0],t.eave_height_m/2,-D[1])),E++;for(let Ve of[.12,2.05,4.2,6.25,t.eave_height_m-.06])f.push(Zr(D,G,Ve,.1,.18));X<l&&d.push(Zr(D,G,3.25,.42,.23)),ye&&h.push(Zr(D,G,4.5,t.eave_height_m-4.5,.24))}}}Wn(e,h,g,"PDF_WHITE_WALLS"),Wn(e,u,m,"PDF_GLASS_FACADES",!1),Wn(e,f,x,"PDF_BLACK_FRAME_GEOMETRY"),Wn(e,d,p,"PDF_STOREFRONT_FASCIA");let _=[],w=[];for(let y of i.roof_sections){let C=new ei(new xn(y.outer.map(H=>new $(...H)))),L=C.attributes.position,F=H=>y.eave_m+y.rise_m*Math.max(0,1-Math.abs(H-l)/c);for(let H=0;H<L.count;H++){let V=L.getX(H),D=L.getY(H);L.setXYZ(H,V,F(D),-D)}C.computeVertexNormals(),_.push(C);for(let H=1;H<y.outer.length;H++){let V=y.outer[H-1],D=y.outer[H],G=new it;G.setAttribute("position",new We([V[0],t.eave_height_m,-V[1],D[0],t.eave_height_m,-D[1],D[0],F(D[1]),-D[1],V[0],t.eave_height_m,-V[1],D[0],F(D[1]),-D[1],V[0],F(V[1]),-V[1]],3)),G.computeVertexNormals(),w.push(G)}}let A=kr(_.map(y=>y.toNonIndexed()),!1);_.forEach(y=>y.dispose());let P=new He(A,new ht({color:"#b7bcb6",roughness:.89,metalness:.025,side:vt}));P.name="PDF_REFERENCE_SLOPED_ROOF",P.castShadow=!0,P.receiveShadow=!0,P.userData={presentationOnly:!0,input_origin:"SIMULATED",source_pdf_pages:[3,4,5],roof_elevation_verified:!1},e.add(P),Wn(e,w,g,"PDF_GABLE_END_INFILL");let N=new Gt(new Rn(A,24),new Dt({color:"#7c8786",transparent:!0,opacity:.34}));N.name="PDF_ROOF_EDGES",e.add(N);let b=y=>{let C=[];for(let L=1;L<n.length;L++){let F=n[L-1],H=n[L];if(F[0]<=y&&H[0]>=y||H[0]<=y&&F[0]>=y){let V=(y-F[0])/(H[0]-F[0]||1);V>=0&&V<=1&&C.push(F[1]+(H[1]-F[1])*V)}}return Math.min(...C)};for(let[y,C]of[.245,.74].entries()){let L=s+(o-s)*C,F=y?9.2:8.8,H=b(L),V=t.gable_height_m-(y?0:1.3),D=new xn([new $(-F/2,0),new $(F/2,0),new $(F/2,V),new $(0,V+1.4),new $(-F/2,V)]),G=new He(new wi(D,{depth:.22,bevelEnabled:!1}),g);if(G.position.set(L,0,-H+.12),G.castShadow=!0,G.receiveShadow=!0,G.name="PDF_WHITE_GABLE_"+y,G.userData={input_origin:"SIMULATED",source_pdf_page:4,placement:"PDF_REFERENCE_ALONG_CAD_FRONTAGE"},e.add(G),y===1){let B=document.createElement("canvas");B.width=256,B.height=512;let X=B.getContext("2d");X.fillStyle="#eeeae2",X.fillRect(0,0,256,512),X.textAlign="center",X.font='500 91px "Microsoft YaHei UI",sans-serif';for(let[ye,Ie]of[..."\u89C2\u524D1\u53F7"].entries())X.fillStyle=Ie==="1"?"#b73d34":"#303b40",X.fillText(Ie,128,104+ye*112);let K=new Qn(B);K.colorSpace=St;let re=new He(new jt(1.65,3.4),new Ot({map:K,toneMapped:!1}));re.position.set(L,V*.61,-H+.36),e.add(re)}}return e.userData.statistics={panes:M,frame_posts:E,all_dimensions:"SIMULATED",roof_profile:"PDF_REFERENCE"},e}function du(i,e){let t=new gt;t.name="V21_ILLUSTRATIVE_CONTEXT",t.userData={spatial_id:i.spatial_id,input_origin:"SIMULATED"};let[n,s,r,o]=i.bounds_local_xy_m,[a,l,c,h]=e.bounds_local_xy_m,u=new He(new jt(r-n,o-s),new ht({color:"#e5e4df",roughness:.97,metalness:0}));u.rotation.x=-Math.PI/2,u.position.set((n+r)/2,-.28,-(s+o)/2),u.receiveShadow=!0,t.add(u);let f=new He(new jt(r-n,8),new ht({color:"#d0d3d1",roughness:.95}));f.rotation.x=-Math.PI/2,f.position.set((n+r)/2,-.27,-l+16),f.receiveShadow=!0,t.add(f);let d=[];for(let w=n;w<r;w+=3)d.push(w,-.268,-l,w,-.268,-l+11.8);for(let w=-l;w<-l+12;w+=3)d.push(n,-.268,w,r,-.268,w);let g=new it;g.setAttribute("position",new We(d,3)),t.add(new Gt(g,new Dt({color:"#d0d3ce",transparent:!0,opacity:.5})));let x=[],m=[],p=[];for(let w=0;w<7;w++){let A=a+10+(c-a-20)*w/6,P=-l+8.4;x.push(new It(2.4,.45,1.5).translate(A,-.05,P)),m.push(new Si(.1,.15,2.5,7).translate(A,1.1,P)),p.push(new Ai(1.05,7,5).scale(.9,1.25,.9).translate(A,2.8,P))}let E=Wn(t,x,new ht({color:"#b6bcb6",roughness:.95}),"SIMULATED_PLANTERS"),M=Wn(t,m,new ht({color:"#8e9389",roughness:1}),"SIMULATED_TREE_TRUNKS"),_=Wn(t,p,new ht({color:"#a4ada1",roughness:.96}),"SIMULATED_TREE_CROWNS");for(let w of[E,M,_])w.userData.source_kind="ILLUSTRATIVE_CONTEXT";return t}var Bi={schema_version:"2.1-stage1",floors:{floor_1:{floor_id:"floor_1",registration:{method:"CAD_SHARED_AXIS_BLOCK",axis_block:"A$C138296ba",source_spatial_id:"guanqian-1:floor_1:cad-fa9afea6bfcfb85f44c6",origin_wcs_mm:[-267.7279080402804,-447498.1960970567,0],formula:"x=(cad_x-origin_x)/1000; y=display_elevation; z=-(cad_y-origin_y)/1000",physical_verification:"NOT_SURVEYED"},vertical_reference:{floor_elevation_mm:null,floor_to_floor_height_mm:null,clear_height_mm:null,slab_thickness_mm:null,status:"NOT_SURVEYED"},surfaces:[{outer:[[7239.097,-408958.1756],[7039.097,-408558.1756],[7039.097,-408358.1756],[7239.097,-407908.1756],[7239.097,-407458.1756],[7039.097,-407008.1756],[7039.097,-406808.1756],[7239.097,-406408.1756],[7239.097,-398058.1756],[15039.097,-398058.1756],[15089.097,-398008.1756],[15339.097,-398008.1756],[15589.097,-397908.1756],[15939.097,-397558.1756],[15939.097,-397508.1756],[16239.097,-397558.1756],[16439.097,-397658.1756],[16689.097,-397658.1756],[16739.097,-397708.1756],[17239.097,-397658.1756],[17289.097,-397608.1756],[17689.097,-397508.1756],[17689.097,-397558.1756],[18039.097,-397908.1756],[18289.097,-398008.1756],[18539.097,-398008.1756],[18589.097,-398058.1756],[24039.097,-398058.1756],[24089.097,-398008.1756],[24339.097,-398008.1756],[24589.097,-397908.1756],[24939.097,-397558.1756],[24939.097,-397508.1756],[25239.097,-397558.1756],[25439.097,-397658.1756],[25689.097,-397658.1756],[25739.097,-397708.1756],[26239.097,-397658.1756],[26289.097,-397608.1756],[26689.097,-397508.1756],[26689.097,-397558.1756],[27039.097,-397908.1756],[27289.097,-398008.1756],[27539.097,-398008.1756],[27589.097,-398058.1756],[41189.097,-398058.1756],[41239.097,-398008.1756],[41489.097,-398008.1756],[41789.097,-397858.1756],[43289.097,-397858.1756],[43339.097,-397808.1756],[43589.097,-397808.1756],[43839.097,-397708.1756],[44039.097,-397508.1756],[44339.097,-397558.1756],[44539.097,-397658.1756],[44789.097,-397658.1756],[44839.097,-397708.1756],[45339.097,-397658.1756],[45389.097,-397608.1756],[45789.097,-397508.1756],[45789.097,-397558.1756],[46139.097,-397908.1756],[46389.097,-398008.1756],[46639.097,-398008.1756],[46689.097,-398058.1756],[49589.097,-398058.1756],[49639.097,-398008.1756],[49889.097,-398008.1756],[50139.097,-397908.1756],[50489.097,-397558.1756],[50589.097,-397358.1756],[50589.097,-397258.1756],[59789.097,-397258.1756],[59839.097,-397208.1756],[60089.097,-397208.1756],[60139.097,-397158.1756],[60239.097,-397158.1756],[60539.097,-396908.1756],[60689.097,-396908.1756],[60989.097,-397058.1756],[61089.097,-397058.1756],[61139.097,-397108.1756],[61389.097,-397108.1756],[61439.097,-397158.1756],[61889.097,-397108.1756],[62389.097,-396908.1756],[62489.097,-396908.1756],[62539.097,-396958.1756],[63039.097,-396908.1756],[63289.097,-396808.1756],[63639.097,-396458.1756],[63739.097,-396258.1756],[63739.097,-396158.1756],[63789.097,-396108.1756],[63789.097,-395058.1756],[64539.097,-395058.1756],[64589.097,-395008.1756],[64839.097,-395008.1756],[65089.097,-394908.1756],[65439.097,-394558.1756],[65439.097,-394508.1756],[65739.097,-394558.1756],[65939.097,-394658.1756],[66189.097,-394658.1756],[66239.097,-394708.1756],[66739.097,-394658.1756],[66789.097,-394608.1756],[67189.097,-394508.1756],[67189.097,-394558.1756],[67539.097,-394908.1756],[67789.097,-395008.1756],[68039.097,-395008.1756],[68089.097,-395058.1756],[69039.097,-395058.1756],[69089.097,-395008.1756],[69339.097,-395008.1756],[69589.097,-394908.1756],[69939.097,-394558.1756],[69939.097,-394508.1756],[70239.097,-394558.1756],[70439.097,-394658.1756],[70689.097,-394658.1756],[70739.097,-394708.1756],[71239.097,-394658.1756],[71289.097,-394608.1756],[71689.097,-394508.1756],[71689.097,-394558.1756],[72039.097,-394908.1756],[72289.097,-395008.1756],[72539.097,-395008.1756],[72589.097,-395058.1756],[73539.097,-395058.1756],[73589.097,-395008.1756],[73839.097,-395008.1756],[74089.097,-394908.1756],[74439.097,-394558.1756],[74439.097,-394508.1756],[74739.097,-394558.1756],[74939.097,-394658.1756],[75189.097,-394658.1756],[75239.097,-394708.1756],[75739.097,-394658.1756],[75789.097,-394608.1756],[76189.097,-394508.1756],[76489.097,-394808.1756],[76739.097,-394908.1756],[76989.097,-394908.1756],[77039.097,-394958.1756],[77089.097,-394908.1756],[77339.097,-394908.1756],[77589.097,-394808.1756],[77939.097,-394458.1756],[77939.097,-394408.1756],[78089.097,-394408.1756],[78389.097,-394558.1756],[78489.097,-394558.1756],[78539.097,-394608.1756],[78789.097,-394608.1756],[78839.097,-394658.1756],[79289.097,-394608.1756],[79589.097,-394458.1756],[79889.097,-394408.1756],[79939.097,-394558.1756],[80289.097,-394908.1756],[80539.097,-395008.1756],[80789.097,-395008.1756],[80839.097,-395058.1756],[82839.097,-395058.1756],[82889.097,-395008.1756],[83139.097,-395008.1756],[83389.097,-394908.1756],[83739.097,-394558.1756],[83739.097,-394508.1756],[84039.097,-394558.1756],[84239.097,-394658.1756],[84489.097,-394658.1756],[84539.097,-394708.1756],[85039.097,-394658.1756],[85089.097,-394608.1756],[85489.097,-394508.1756],[85489.097,-394558.1756],[85839.097,-394908.1756],[86089.097,-395008.1756],[86339.097,-395008.1756],[86389.097,-395058.1756],[87339.097,-395058.1756],[87389.097,-395008.1756],[87639.097,-395008.1756],[87889.097,-394908.1756],[88239.097,-394558.1756],[88239.097,-394508.1756],[88539.097,-394558.1756],[88739.097,-394658.1756],[88989.097,-394658.1756],[89039.097,-394708.1756],[89539.097,-394658.1756],[89589.097,-394608.1756],[89989.097,-394508.1756],[89989.097,-394558.1756],[90339.097,-394908.1756],[90589.097,-395008.1756],[90839.097,-395008.1756],[90889.097,-395058.1756],[91839.097,-395058.1756],[91889.097,-395008.1756],[92139.097,-395008.1756],[92389.097,-394908.1756],[92739.097,-394558.1756],[92739.097,-394508.1756],[93039.097,-394558.1756],[93239.097,-394658.1756],[93489.097,-394658.1756],[93539.097,-394708.1756],[94039.097,-394658.1756],[94089.097,-394608.1756],[94489.097,-394508.1756],[94489.097,-394558.1756],[94839.097,-394908.1756],[95089.097,-395008.1756],[95339.097,-395008.1756],[95389.097,-395058.1756],[96839.097,-395058.1756],[96889.097,-395008.1756],[97139.097,-395008.1756],[97389.097,-394908.1756],[97739.097,-394558.1756],[97739.097,-394508.1756],[98039.097,-394558.1756],[98239.097,-394658.1756],[98489.097,-394658.1756],[98539.097,-394708.1756],[99039.097,-394658.1756],[99089.097,-394608.1756],[99489.097,-394508.1756],[99489.097,-394558.1756],[99839.097,-394908.1756],[100089.097,-395008.1756],[100339.097,-395008.1756],[100389.097,-395058.1756],[101739.097,-395058.1756],[101789.097,-395008.1756],[102039.097,-395008.1756],[102289.097,-394908.1756],[102639.097,-394558.1756],[102639.097,-394508.1756],[102939.097,-394558.1756],[103139.097,-394658.1756],[103389.097,-394658.1756],[103439.097,-394708.1756],[103939.097,-394658.1756],[103989.097,-394608.1756],[104389.097,-394508.1756],[104389.097,-394558.1756],[104739.097,-394908.1756],[104989.097,-395008.1756],[105239.097,-395008.1756],[105289.097,-395058.1756],[106739.097,-395058.1756],[106789.097,-395008.1756],[107039.097,-395008.1756],[107289.097,-394908.1756],[107639.097,-394558.1756],[107639.097,-394508.1756],[107939.097,-394558.1756],[108139.097,-394658.1756],[108389.097,-394658.1756],[108439.097,-394708.1756],[108939.097,-394658.1756],[108989.097,-394608.1756],[109389.097,-394508.1756],[109389.097,-394558.1756],[109839.097,-394958.1756],[109939.097,-394958.1756],[109989.097,-395008.1756],[110239.097,-395008.1756],[110289.097,-395058.1756],[111139.097,-395058.1756],[111389.097,-395258.1756],[111489.097,-395258.1756],[111539.097,-395308.1756],[111789.097,-395308.1756],[111839.097,-395358.1756],[114639.097,-395358.1756],[114689.097,-395308.1756],[114939.097,-395308.1756],[114989.097,-395258.1756],[115089.097,-395258.1756],[115339.097,-395058.1756],[115589.097,-395058.1756],[115789.097,-395158.1756],[116039.097,-395158.1756],[116089.097,-395208.1756],[116139.097,-395158.1756],[116389.097,-395158.1756],[116589.097,-395058.1756],[116789.097,-395058.1756],[117039.097,-395258.1756],[117139.097,-395258.1756],[117189.097,-395308.1756],[117439.097,-395308.1756],[117489.097,-395358.1756],[119339.097,-395358.1756],[119389.097,-395308.1756],[119639.097,-395308.1756],[119889.097,-395208.1756],[120239.097,-394858.1756],[120389.097,-394508.1756],[120389.097,-393758.1756],[120589.097,-393758.1756],[120639.097,-393808.1756],[121239.097,-393758.1756],[121489.097,-393658.1756],[121739.097,-393408.1756],[122039.097,-393458.1756],[122239.097,-393558.1756],[122489.097,-393558.1756],[122539.097,-393608.1756],[123039.097,-393558.1756],[123089.097,-393508.1756],[123489.097,-393408.1756],[123489.097,-393458.1756],[123839.097,-393808.1756],[124089.097,-393908.1756],[124339.097,-393908.1756],[124389.097,-393958.1756],[124689.097,-393958.1756],[124739.097,-393908.1756],[125039.097,-393958.1756],[125089.097,-393908.1756],[125339.097,-393908.1756],[125389.097,-393858.1756],[125489.097,-393858.1756],[125589.097,-393808.1756],[125939.097,-393458.1756],[125939.097,-393408.1756],[126239.097,-393458.1756],[126439.097,-393558.1756],[126689.097,-393558.1756],[126739.097,-393608.1756],[127239.097,-393558.1756],[127289.097,-393508.1756],[127689.097,-393408.1756],[127739.097,-393558.1756],[128089.097,-393908.1756],[128339.097,-394008.1756],[128589.097,-394008.1756],[128639.097,-394058.1756],[128739.097,-394058.1756],[128789.097,-394008.1756],[129039.097,-394008.1756],[129239.097,-393908.1756],[129539.097,-393958.1756],[129589.097,-393908.1756],[129839.097,-393908.1756],[129889.097,-393858.1756],[129989.097,-393858.1756],[130089.097,-393808.1756],[130439.097,-393458.1756],[130439.097,-393408.1756],[130739.097,-393458.1756],[130939.097,-393558.1756],[131189.097,-393558.1756],[131239.097,-393608.1756],[131739.097,-393558.1756],[131789.097,-393508.1756],[132189.097,-393408.1756],[132239.097,-393558.1756],[132589.097,-393908.1756],[132839.097,-394008.1756],[133089.097,-394008.1756],[133139.097,-394058.1756],[133989.097,-394058.1756],[134039.097,-394008.1756],[134289.097,-394008.1756],[134339.097,-393958.1756],[134439.097,-393958.1756],[134889.097,-393558.1756],[134939.097,-393408.1756],[135239.097,-393458.1756],[135439.097,-393558.1756],[135689.097,-393558.1756],[135739.097,-393608.1756],[136239.097,-393558.1756],[136289.097,-393508.1756],[136689.097,-393408.1756],[136739.097,-393558.1756],[137089.097,-393908.1756],[137339.097,-394008.1756],[137589.097,-394008.1756],[137639.097,-394058.1756],[137739.097,-394058.1756],[137789.097,-394008.1756],[138039.097,-394008.1756],[138239.097,-393908.1756],[138539.097,-393958.1756],[138589.097,-393908.1756],[138839.097,-393908.1756],[138889.097,-393858.1756],[138989.097,-393858.1756],[139089.097,-393808.1756],[139439.097,-393458.1756],[139439.097,-393408.1756],[139739.097,-393458.1756],[139939.097,-393558.1756],[140189.097,-393558.1756],[140239.097,-393608.1756],[140739.097,-393558.1756],[140789.097,-393508.1756],[141189.097,-393408.1756],[141539.097,-393758.1756],[141789.097,-393858.1756],[142039.097,-393858.1756],[142089.097,-393908.1756],[142139.097,-393858.1756],[142389.097,-393858.1756],[142589.097,-393758.1756],[142789.097,-393758.1756],[142789.097,-393858.1756],[142839.097,-393908.1756],[142839.097,-394008.1756],[142789.097,-394058.1756],[142789.097,-398108.1756],[142939.097,-398458.1756],[143389.097,-398858.1756],[143489.097,-398858.1756],[143539.097,-398908.1756],[143789.097,-398908.1756],[144189.097,-399058.1756],[144689.097,-399108.1756],[144739.097,-399058.1756],[144989.097,-399058.1756],[145039.097,-399008.1756],[145439.097,-398908.1756],[145439.097,-399008.1756],[145589.097,-399308.1756],[145939.097,-399658.1756],[146189.097,-399758.1756],[146389.097,-399758.1756],[146439.097,-399908.1756],[146539.097,-400008.1756],[146539.097,-400108.1756],[146389.097,-400408.1756],[146389.097,-401208.1756],[146539.097,-401558.1756],[146889.097,-401908.1756],[147239.097,-402008.1756],[147239.097,-402108.1756],[147039.097,-402608.1756],[147039.097,-403158.1756],[147089.097,-403208.1756],[147239.097,-403758.1756],[146889.097,-403858.1756],[146539.097,-404208.1756],[146439.097,-404408.1756],[146439.097,-404508.1756],[146389.097,-404558.1756],[146389.097,-406008.1756],[146539.097,-406358.1756],[146889.097,-406708.1756],[147239.097,-406808.1756],[147239.097,-406908.1756],[147039.097,-407408.1756],[147039.097,-407958.1756],[147239.097,-408458.1756],[147239.097,-408758.1756],[147389.097,-409108.1756],[147739.097,-409458.1756],[147939.097,-409558.1756],[148039.097,-409558.1756],[148039.097,-409908.1756],[148189.097,-410258.1756],[148539.097,-410608.1756],[148889.097,-410708.1756],[148889.097,-410808.1756],[148689.097,-411308.1756],[148689.097,-411858.1756],[148739.097,-411908.1756],[148889.097,-412458.1756],[148739.097,-412608.1756],[148589.097,-412958.1756],[148589.097,-413358.1756],[148739.097,-413708.1756],[148889.097,-413858.1756],[148889.097,-413958.1756],[148689.097,-414458.1756],[148689.097,-415008.1756],[148739.097,-415058.1756],[148889.097,-415608.1756],[148539.097,-415708.1756],[148189.097,-416058.1756],[148039.097,-416408.1756],[148039.097,-420958.1756],[148189.097,-421258.1756],[148189.097,-421358.1756],[148039.097,-421658.1756],[148039.097,-426258.1756],[148189.097,-426608.1756],[148539.097,-426958.1756],[148889.097,-427058.1756],[148889.097,-427158.1756],[148689.097,-427658.1756],[148689.097,-428208.1756],[148739.097,-428258.1756],[148889.097,-428808.1756],[148739.097,-428958.1756],[148589.097,-429308.1756],[148589.097,-429708.1756],[148739.097,-430058.1756],[148889.097,-430208.1756],[148889.097,-430308.1756],[148689.097,-430808.1756],[148689.097,-431358.1756],[148739.097,-431408.1756],[148889.097,-431958.1756],[148739.097,-432108.1756],[148589.097,-432458.1756],[148589.097,-432908.1756],[148739.097,-433258.1756],[148889.097,-433408.1756],[148889.097,-433508.1756],[148689.097,-434008.1756],[148689.097,-434558.1756],[148739.097,-434608.1756],[148889.097,-435158.1756],[148539.097,-435258.1756],[148189.097,-435608.1756],[148039.097,-435958.1756],[148039.097,-438558.1756],[146589.097,-438558.1756],[146539.097,-438608.1756],[146289.097,-438608.1756],[146039.097,-438708.1756],[145689.097,-439058.1756],[145589.097,-439258.1756],[145589.097,-439358.1756],[145389.097,-439358.1756],[145039.097,-439208.1756],[144789.097,-439208.1756],[144689.097,-439158.1756],[144639.097,-439208.1756],[144389.097,-439208.1756],[144039.097,-439358.1756],[143789.097,-439358.1756],[143739.097,-439408.1756],[143539.097,-439408.1756],[143289.097,-439508.1756],[142939.097,-439858.1756],[142789.097,-440208.1756],[142789.097,-442058.1756],[142589.097,-442058.1756],[142389.097,-441958.1756],[142139.097,-441958.1756],[142089.097,-441908.1756],[141989.097,-441958.1756],[141739.097,-441958.1756],[141489.097,-442058.1756],[141189.097,-442358.1756],[140989.097,-442358.1756],[140639.097,-442208.1756],[140389.097,-442208.1756],[140339.097,-442158.1756],[140239.097,-442208.1756],[139989.097,-442208.1756],[139639.097,-442358.1756],[139439.097,-442358.1756],[139439.097,-442308.1756],[138989.097,-441908.1756],[138889.097,-441908.1756],[138839.097,-441858.1756],[138589.097,-441858.1756],[138539.097,-441808.1756],[138239.097,-441858.1756],[138189.097,-441808.1756],[137939.097,-441808.1756],[137889.097,-441758.1756],[137639.097,-441758.1756],[137589.097,-441808.1756],[137339.097,-441808.1756],[137289.097,-441858.1756],[137189.097,-441858.1756],[137089.097,-441908.1756],[136689.097,-442308.1756],[136689.097,-442358.1756],[136489.097,-442358.1756],[136139.097,-442208.1756],[135889.097,-442208.1756],[135839.097,-442158.1756],[135739.097,-442208.1756],[135489.097,-442208.1756],[135139.097,-442358.1756],[134939.097,-442358.1756],[134939.097,-442308.1756],[134539.097,-441908.1756],[134289.097,-441808.1756],[134039.097,-441808.1756],[133989.097,-441758.1756],[133689.097,-441758.1756],[133639.097,-441808.1756],[133389.097,-441808.1756],[133339.097,-441858.1756],[133239.097,-441808.1756],[132789.097,-441858.1756],[132539.097,-441958.1756],[132189.097,-442308.1756],[132189.097,-442358.1756],[131989.097,-442358.1756],[131639.097,-442208.1756],[131389.097,-442208.1756],[131339.097,-442158.1756],[131239.097,-442208.1756],[130989.097,-442208.1756],[130639.097,-442358.1756],[130439.097,-442358.1756],[130439.097,-442308.1756],[130039.097,-441908.1756],[129789.097,-441808.1756],[129539.097,-441808.1756],[129489.097,-441758.1756],[128639.097,-441758.1756],[128589.097,-441808.1756],[128339.097,-441808.1756],[128089.097,-441908.1756],[127689.097,-442308.1756],[127689.097,-442358.1756],[127489.097,-442358.1756],[127139.097,-442208.1756],[126889.097,-442208.1756],[126839.097,-442158.1756],[126739.097,-442208.1756],[126489.097,-442208.1756],[126139.097,-442358.1756],[125939.097,-442358.1756],[125939.097,-442308.1756],[125589.097,-441958.1756],[125339.097,-441858.1756],[125089.097,-441858.1756],[125039.097,-441808.1756],[124889.097,-441808.1756],[124839.097,-441858.1756],[124739.097,-441858.1756],[124689.097,-441808.1756],[124389.097,-441808.1756],[124339.097,-441858.1756],[124089.097,-441858.1756],[124039.097,-441908.1756],[123939.097,-441908.1756],[123839.097,-441958.1756],[123489.097,-442308.1756],[123489.097,-442358.1756],[123289.097,-442358.1756],[122939.097,-442208.1756],[122689.097,-442208.1756],[122639.097,-442158.1756],[122539.097,-442208.1756],[122289.097,-442208.1756],[121939.097,-442358.1756],[121739.097,-442358.1756],[121489.097,-442108.1756],[121239.097,-442008.1756],[120989.097,-442008.1756],[120939.097,-441958.1756],[120889.097,-442008.1756],[120389.097,-442058.1756],[120189.097,-441908.1756],[120089.097,-441908.1756],[120039.097,-441858.1756],[119789.097,-441858.1756],[119739.097,-441808.1756],[119239.097,-441808.1756],[119189.097,-441858.1756],[118939.097,-441858.1756],[118889.097,-441908.1756],[118789.097,-441908.1756],[118689.097,-441958.1756],[118339.097,-442308.1756],[118339.097,-442358.1756],[118289.097,-442308.1756],[118089.097,-442308.1756],[117789.097,-442158.1756],[117539.097,-442158.1756],[117489.097,-442108.1756],[117389.097,-442108.1756],[117339.097,-442158.1756],[117089.097,-442158.1756],[116889.097,-442258.1756],[116589.097,-442258.1756],[116539.097,-442108.1756],[116089.097,-441708.1756],[115789.097,-441658.1756],[115739.097,-441608.1756],[115539.097,-441608.1756],[115489.097,-441558.1756],[115339.097,-441558.1756],[115289.097,-441508.1756],[115139.097,-441508.1756],[115089.097,-441458.1756],[114689.097,-441358.1756],[114539.097,-441258.1756],[114439.097,-441258.1756],[114289.097,-441158.1756],[114189.097,-441158.1756],[113839.097,-440958.1756],[113739.097,-440958.1756],[113539.097,-440858.1756],[112739.097,-440308.1756],[112639.097,-440308.1756],[112589.097,-440258.1756],[112339.097,-440258.1756],[112289.097,-440208.1756],[112239.097,-440258.1756],[111989.097,-440258.1756],[111739.097,-440358.1756],[111039.097,-441058.1756],[91039.097,-441058.1756],[90389.097,-440408.1756],[90139.097,-440308.1756],[89889.097,-440308.1756],[89789.097,-440258.1756],[89739.097,-440308.1756],[89489.097,-440308.1756],[89439.097,-440358.1756],[89339.097,-440358.1756],[88939.097,-440658.1756],[88589.097,-440808.1756],[88489.097,-440908.1756],[88289.097,-440958.1756],[87939.097,-441158.1756],[87839.097,-441158.1756],[87489.097,-441358.1756],[87339.097,-441358.1756],[87289.097,-441408.1756],[87189.097,-441408.1756],[86989.097,-441508.1756],[86839.097,-441508.1756],[86789.097,-441558.1756],[86639.097,-441558.1756],[86589.097,-441608.1756],[86389.097,-441608.1756],[86339.097,-441658.1756],[86139.097,-441658.1756],[86089.097,-441708.1756],[85639.097,-441708.1756],[85589.097,-441758.1756],[83939.097,-441758.1756],[83889.097,-441808.1756],[82939.097,-441808.1756],[82889.097,-441858.1756],[82639.097,-441858.1756],[82589.097,-441908.1756],[82489.097,-441908.1756],[82289.097,-442058.1756],[82089.097,-442058.1756],[81889.097,-441958.1756],[81639.097,-441958.1756],[81539.097,-441908.1756],[81489.097,-441958.1756],[81239.097,-441958.1756],[80989.097,-442058.1756],[80689.097,-442358.1756],[80489.097,-442358.1756],[80139.097,-442208.1756],[79889.097,-442208.1756],[79839.097,-442158.1756],[79739.097,-442208.1756],[79489.097,-442208.1756],[79139.097,-442358.1756],[78939.097,-442358.1756],[78939.097,-442308.1756],[78539.097,-441908.1756],[78289.097,-441808.1756],[78039.097,-441808.1756],[77989.097,-441758.1756],[77139.097,-441758.1756],[77089.097,-441808.1756],[76839.097,-441808.1756],[76589.097,-441908.1756],[76189.097,-442308.1756],[76189.097,-442358.1756],[75989.097,-442358.1756],[75639.097,-442208.1756],[75389.097,-442208.1756],[75339.097,-442158.1756],[75239.097,-442208.1756],[74989.097,-442208.1756],[74639.097,-442358.1756],[74439.097,-442358.1756],[74439.097,-442308.1756],[73989.097,-441908.1756],[73889.097,-441908.1756],[73839.097,-441858.1756],[73589.097,-441858.1756],[73539.097,-441808.1756],[73289.097,-441858.1756],[73239.097,-441808.1756],[72989.097,-441808.1756],[72939.097,-441758.1756],[72639.097,-441758.1756],[72589.097,-441808.1756],[72339.097,-441808.1756],[72289.097,-441858.1756],[72189.097,-441858.1756],[72089.097,-441908.1756],[71689.097,-442308.1756],[71689.097,-442358.1756],[71489.097,-442358.1756],[71139.097,-442208.1756],[70889.097,-442208.1756],[70839.097,-442158.1756],[70739.097,-442208.1756],[70489.097,-442208.1756],[70139.097,-442358.1756],[69939.097,-442358.1756],[69939.097,-442308.1756],[69539.097,-441908.1756],[69289.097,-441808.1756],[69039.097,-441808.1756],[68989.097,-441758.1756],[68139.097,-441758.1756],[68089.097,-441808.1756],[67839.097,-441808.1756],[67589.097,-441908.1756],[67189.097,-442308.1756],[67189.097,-442358.1756],[66989.097,-442358.1756],[66639.097,-442208.1756],[66389.097,-442208.1756],[66339.097,-442158.1756],[66239.097,-442208.1756],[65989.097,-442208.1756],[65639.097,-442358.1756],[65439.097,-442358.1756],[65139.097,-442058.1756],[64889.097,-441958.1756],[64639.097,-441958.1756],[64589.097,-441908.1756],[64489.097,-441908.1756],[64439.097,-441958.1756],[64189.097,-441958.1756],[63989.097,-442058.1756],[63789.097,-442058.1756],[63789.097,-440708.1756],[63639.097,-440358.1756],[63289.097,-440008.1756],[63039.097,-439908.1756],[62789.097,-439908.1756],[62739.097,-439858.1756],[62689.097,-439908.1756],[62189.097,-439958.1756],[61839.097,-439808.1756],[61589.097,-439808.1756],[61539.097,-439758.1756],[61439.097,-439808.1756],[61189.097,-439808.1756],[60839.097,-439958.1756],[60639.097,-439958.1756],[60589.097,-439808.1756],[60239.097,-439458.1756],[59989.097,-439358.1756],[59739.097,-439358.1756],[59689.097,-439308.1756],[59139.097,-439308.1756],[59089.097,-439358.1756],[58839.097,-439358.1756],[58789.097,-439408.1756],[58689.097,-439408.1756],[58239.097,-439808.1756],[58189.097,-439958.1756],[57989.097,-439958.1756],[57639.097,-439808.1756],[57389.097,-439808.1756],[57339.097,-439758.1756],[57239.097,-439808.1756],[56989.097,-439808.1756],[56639.097,-439958.1756],[56439.097,-439958.1756],[56389.097,-439808.1756],[56039.097,-439458.1756],[55789.097,-439358.1756],[55539.097,-439358.1756],[55489.097,-439308.1756],[54639.097,-439308.1756],[54589.097,-439358.1756],[54339.097,-439358.1756],[54289.097,-439408.1756],[54189.097,-439408.1756],[53739.097,-439808.1756],[53689.097,-439958.1756],[53489.097,-439958.1756],[53139.097,-439808.1756],[52889.097,-439808.1756],[52839.097,-439758.1756],[52739.097,-439808.1756],[52489.097,-439808.1756],[52139.097,-439958.1756],[51939.097,-439958.1756],[51889.097,-439908.1756],[51789.097,-439958.1756],[51539.097,-439958.1756],[51289.097,-440058.1756],[50939.097,-440408.1756],[50839.097,-440608.1756],[50839.097,-440708.1756],[50789.097,-440758.1756],[50789.097,-442058.1756],[50589.097,-442058.1756],[50389.097,-441958.1756],[50139.097,-441958.1756],[50089.097,-441908.1756],[49989.097,-441958.1756],[49739.097,-441958.1756],[49489.097,-442058.1756],[49189.097,-442358.1756],[48989.097,-442358.1756],[48639.097,-442208.1756],[48389.097,-442208.1756],[48339.097,-442158.1756],[48239.097,-442208.1756],[47989.097,-442208.1756],[47639.097,-442358.1756],[47439.097,-442358.1756],[47439.097,-442308.1756],[46989.097,-441908.1756],[46889.097,-441908.1756],[46839.097,-441858.1756],[46589.097,-441858.1756],[46539.097,-441808.1756],[46289.097,-441858.1756],[46239.097,-441808.1756],[45989.097,-441808.1756],[45939.097,-441758.1756],[45639.097,-441758.1756],[45589.097,-441808.1756],[45339.097,-441808.1756],[45289.097,-441858.1756],[45189.097,-441858.1756],[45089.097,-441908.1756],[44689.097,-442308.1756],[44689.097,-442358.1756],[44489.097,-442358.1756],[44139.097,-442208.1756],[43889.097,-442208.1756],[43839.097,-442158.1756],[43739.097,-442208.1756],[43489.097,-442208.1756],[43139.097,-442358.1756],[42939.097,-442358.1756],[42939.097,-442308.1756],[42539.097,-441908.1756],[42289.097,-441808.1756],[42039.097,-441808.1756],[41989.097,-441758.1756],[41139.097,-441758.1756],[41089.097,-441808.1756],[40839.097,-441808.1756],[40589.097,-441908.1756],[40189.097,-442308.1756],[40189.097,-442358.1756],[39989.097,-442358.1756],[39639.097,-442208.1756],[39389.097,-442208.1756],[39339.097,-442158.1756],[39239.097,-442208.1756],[38989.097,-442208.1756],[38639.097,-442358.1756],[38439.097,-442358.1756],[38439.097,-442308.1756],[38039.097,-441908.1756],[37789.097,-441808.1756],[37539.097,-441808.1756],[37489.097,-441758.1756],[36639.097,-441758.1756],[36589.097,-441808.1756],[36339.097,-441808.1756],[36089.097,-441908.1756],[35689.097,-442308.1756],[35689.097,-442358.1756],[35489.097,-442358.1756],[35139.097,-442208.1756],[34889.097,-442208.1756],[34839.097,-442158.1756],[34739.097,-442208.1756],[34489.097,-442208.1756],[34139.097,-442358.1756],[33939.097,-442358.1756],[33639.097,-442058.1756],[33389.097,-441958.1756],[33139.097,-441958.1756],[33089.097,-441908.1756],[32989.097,-441908.1756],[32939.097,-441958.1756],[32689.097,-441958.1756],[32489.097,-442058.1756],[32289.097,-442058.1756],[32289.097,-432108.1756],[32139.097,-431758.1756],[31789.097,-431408.1756],[31539.097,-431308.1756],[31389.097,-431308.1756],[31339.097,-431258.1756],[31089.097,-431258.1756],[30739.097,-431108.1756],[30489.097,-431108.1756],[30439.097,-431058.1756],[30339.097,-431108.1756],[30089.097,-431108.1756],[29739.097,-431258.1756],[29489.097,-431258.1756],[29089.097,-431408.1756],[28689.097,-431808.1756],[28589.097,-432008.1756],[28589.097,-432108.1756],[13989.097,-432108.1756],[13989.097,-428058.1756],[13839.097,-427708.1756],[13489.097,-427358.1756],[13289.097,-427258.1756],[13189.097,-427258.1756],[13189.097,-427058.1756],[13389.097,-426608.1756],[13389.097,-426158.1756],[13189.097,-425708.1756],[13189.097,-425508.1756],[13239.097,-425458.1756],[13239.097,-425008.1756],[13189.097,-424958.1756],[13189.097,-424758.1756],[13389.097,-424308.1756],[13389.097,-423858.1756],[13189.097,-423408.1756],[13189.097,-423208.1756],[13289.097,-423208.1756],[13489.097,-423108.1756],[13839.097,-422758.1756],[13989.097,-422408.1756],[13989.097,-416908.1756],[14189.097,-416858.1756],[14589.097,-416458.1756],[14689.097,-416258.1756],[14689.097,-416158.1756],[14739.097,-416108.1756],[14739.097,-415008.1756],[14689.097,-414958.1756],[14689.097,-414858.1756],[14589.097,-414658.1756],[14239.097,-414308.1756],[13989.097,-414208.1756],[13739.097,-414208.1756],[13689.097,-414158.1756],[7239.097,-414158.1756],[7239.097,-408958.1756]],holes:[]}],region_picking_proxies:{"guanqian-1:floor_1:region-1427400cc07dae1795":{footprint:{outer:[[26650,-398340],[26650,-398400],[26690,-398400],[26680,-398480],[26710,-398480],[26710,-398540],[27960,-398540],[27960,-399740],[27810,-399740],[27810,-400340],[27960,-400340],[27960,-405440],[27810,-405440],[27810,-405640],[23810,-405640],[23810,-405440],[23310,-405440],[23310,-405640],[19310,-405640],[19310,-405440],[18810,-405440],[18810,-406040],[18960,-406040],[18960,-413240],[18810,-413240],[18810,-413640],[14810,-413640],[14810,-413240],[14310,-413240],[14310,-413640],[10310,-413640],[10310,-413240],[9810,-413240],[9810,-413640],[8060,-413640],[8060,-408590],[8e3,-408590],[8e3,-408560],[7920,-408570],[7920,-408530],[7860,-408530],[7860,-407693.3333],[7920,-407690],[7860,-407686.6667],[7860,-406850],[7920,-406850],[7920,-406810],[8e3,-406820],[8e3,-406790],[8060,-406790],[8060,-398540],[15910,-398540],[15910,-398480],[15940,-398480],[15930,-398400],[15970,-398400],[15970,-398340],[16806.6667,-398340],[16810,-398400],[16813.3333,-398340],[17650,-398340],[17650,-398400],[17690,-398400],[17680,-398480],[17710,-398480],[17710,-398540],[24910,-398540],[24910,-398480],[24940,-398480],[24930,-398400],[24970,-398400],[24970,-398340],[25806.6667,-398340],[25810,-398400],[25813.3333,-398340],[26650,-398340]],holes:[[[23810,-400340],[23810,-399740],[23310,-399740],[23310,-400340],[23810,-400340]],[[19310,-400340],[19310,-399740],[18810,-399740],[18810,-400340],[19310,-400340]],[[14810,-400340],[14810,-399740],[14310,-399740],[14310,-400340],[14810,-400340]],[[10310,-400340],[10310,-399740],[9810,-399740],[9810,-400340],[10310,-400340]],[[14810,-406040],[14810,-405440],[14310,-405440],[14310,-406040],[14810,-406040]],[[10310,-406040],[10310,-405440],[9810,-405440],[9810,-406040],[10310,-406040]],[[27775,-400445],[27810,-400460],[27845,-400445],[27860,-400410],[27855,-400390],[27830,-400360],[27790,-400360],[27765,-400390],[27760,-400410],[27775,-400445]],[[27845,-405400],[27865,-405360],[27860,-405335],[27845,-405315],[27805,-405300],[27760,-405315],[27745,-405360],[27760,-405400],[27780,-405415],[27805,-405420],[27845,-405400]]]},label_wcs_mm:[12310,-405840.00000000006],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-17a8754e9ca179d3fb":{footprint:{outer:[[32810,-429240],[36810,-429240],[36810,-429440],[37010,-429440],[37010,-435440],[36810,-435440],[36810,-436040],[37010,-436040],[37010,-441140],[36810,-441140],[36810,-441340],[35710,-441340],[35710,-441400],[35680,-441400],[35690,-441480],[35650,-441480],[35650,-441540],[34813.3333,-441540],[34810,-441480],[34806.6667,-441540],[33970,-441540],[33970,-441480],[33930,-441480],[33940,-441400],[33910,-441400],[33910,-441340],[32810,-441340],[32810,-441140],[32510,-441140],[32510,-436040],[32810,-436040],[32810,-435440],[32510,-435440],[32510,-431790],[32810,-431790],[32810,-431290],[32510,-431290],[32510,-429440],[32810,-429440],[32810,-429240]],holes:[]},label_wcs_mm:[34760,-433615],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-190d1a3d3221ad2c89":{footprint:{outer:[[77460,-427740],[77460,-428840],[77310,-428840],[77310,-429440],[77460,-429440],[77460,-435440],[77310,-435440],[77310,-436040],[77460,-436040],[77460,-441140],[77310,-441140],[77310,-441340],[73310,-441340],[73310,-441140],[73160,-441140],[73160,-436040],[73310,-436040],[73310,-435440],[73160,-435440],[73160,-429440],[73310,-429440],[73310,-428840],[73160,-428840],[73160,-427740],[77460,-427740]],holes:[]},label_wcs_mm:[75310,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-1b0b125d469c0d78ab":{footprint:{outer:[[90130,-439625],[90340,-439390],[90540,-439145],[90730,-438895],[90910,-438635],[90995,-438455],[91190,-438105],[91405,-437775],[91640,-437455],[91895,-437155],[92030,-437010],[92253.0545,-436793.0183],[92535,-437195],[92670,-437080],[92725,-437015],[92775,-436945],[92815,-436870],[92850,-436790],[92895,-436630],[92910,-436460],[92905,-436375],[92883.5471,-436269.3506],[92982.3826,-436198.6745],[93075,-436255],[93155,-436290],[93315,-436335],[93400,-436345],[93570,-436340],[93735,-436305],[93820,-436275],[93900,-436235],[93975,-436185],[93689.0289,-435777.2788],[93930,-435660],[94290,-435510],[94660,-435380],[94850,-435325],[95240,-435230],[95630,-435165],[95830,-435140],[96770,-435140],[96770,-435710],[96860,-435705],[97030,-435670],[97110,-435640],[97260,-435560],[97330,-435505],[97450,-435390],[97545,-435250],[97591.25,-435140],[97708.75,-435140],[97755,-435250],[97850,-435390],[97905,-435450],[98035,-435560],[98185,-435640],[98265,-435670],[98490,-435710],[98530,-435710],[98530,-435140],[103570,-435140],[103570,-435710],[103660,-435705],[103830,-435670],[103910,-435640],[104060,-435560],[104130,-435505],[104250,-435390],[104340,-435250],[104391.25,-435140],[104508.75,-435140],[104555,-435250],[104650,-435390],[104705,-435450],[104835,-435560],[104985,-435640],[105065,-435670],[105290,-435710],[105330,-435710],[105330,-435140],[106290,-435140],[106685,-435195],[106880,-435230],[107265,-435325],[107455,-435380],[107830,-435510],[108190,-435660],[108540,-435835],[108880,-436030],[109205,-436245],[109515,-436485],[109810,-436740],[110090,-437010],[110225,-437155],[110595,-437610],[110925,-438105],[111120,-438455],[111210,-438635],[111390,-438895],[111580,-439145],[111780,-439390],[111990,-439625],[112225.9425,-439864.9027],[111754.757,-440351.9116],[111739.097,-440358.1756],[111039.097,-441058.1756],[91048.5171,-441058.1756],[89891.7771,-439867.0344],[90130,-439625]],holes:[]},label_wcs_mm:[101056.24999999999,-437940],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-1de2573bede50c9609":{footprint:{outer:[[53210,-399740],[53210,-400840],[53045,-400840],[53045,-401040],[51505,-401040],[51505,-400840],[50810,-400840],[50810,-398040],[50910,-398040],[50910,-397970],[54810,-397970],[54810,-398040],[59610,-398040],[59610,-399740],[53210,-399740]],holes:[]},label_wcs_mm:[55210,-398890],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-28b9edf004992c4e84":{footprint:{outer:[[71650,-395340],[71650,-395400],[71690,-395400],[71680,-395480],[71710,-395480],[71710,-395540],[72810,-395540],[72810,-395590],[72960,-395590],[72960,-396740],[72810,-396740],[72810,-397340],[72960,-397340],[72960,-402740],[68660,-402740],[68660,-397340],[68810,-397340],[68810,-396740],[68660,-396740],[68660,-395590],[68810,-395590],[68810,-395540],[69910,-395540],[69910,-395480],[69940,-395480],[69930,-395400],[69970,-395400],[69970,-395340],[70806.6667,-395340],[70810,-395400],[70813.3333,-395340],[71650,-395340]],holes:[]},label_wcs_mm:[70810,-400039.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-39357c8547a1adfd75":{footprint:{outer:[[45810,-408440],[45810,-408240],[45790,-408240],[45790,-407420],[45610,-407435],[45445,-407485],[45295,-407570],[45165,-407675],[45060,-407805],[44980,-407955],[44925,-408120],[44913.3333,-408240],[44906.6667,-408240],[44870,-408035],[44840,-407955],[44760,-407805],[44650,-407675],[44590,-407620],[44520,-407570],[44370,-407485],[44205,-407435],[44030,-407420],[44030,-408240],[44010,-408240],[44010,-398480],[44040,-398480],[44030,-398400],[44070,-398400],[44070,-398340],[44906.6667,-398340],[44910,-398400],[44913.3333,-398340],[45750,-398340],[45750,-398400],[45790,-398400],[45780,-398480],[45810,-398480],[45810,-398540],[50610,-398540],[50610,-399740],[45810,-399740],[45810,-400340],[45960,-400340],[45960,-405440],[45810,-405440],[45810,-406040],[46410,-406040],[46410,-405980],[46430,-405980],[46430,-405940],[46440,-405940],[46440,-405900],[46410,-405900],[46410,-405840],[46310,-405840],[46310,-405440],[46160,-405440],[46160,-404290],[46945,-404290],[46970,-404315],[46990,-404305],[46995,-404290],[47685,-404290],[47685,-404315],[47735,-404315],[47735,-404290],[47760,-404290],[47760,-401490],[49010,-401490],[49010,-404640],[49020,-404640],[49020,-404660],[48920,-404665],[48825,-404680],[48735,-404700],[48645,-404735],[48480,-404820],[48340,-404940],[48225,-405080],[48175,-405160],[48135,-405245],[48100,-405335],[48080,-405425],[48065,-405520],[48060,-405620],[49020,-405620],[49020,-405640],[49110,-405640],[49110,-405835],[50310,-405835],[50310,-406040],[49940,-406250],[49810,-408240],[50610,-408240],[50610,-406040],[50810,-406040],[50810,-408440],[45810,-408440]],holes:[[[46430,-406710],[46470,-406707.3333],[46470,-405980],[46430,-405980],[46430,-406710]],[[47910,-405900],[47880,-405900],[47890,-405980],[47910,-405980],[47910,-405900]],[[47850,-405980],[47850,-406710],[47890,-406710],[47890,-405980],[47850,-405980]],[[44180,-400540],[44635,-400540],[44635,-401540],[45035,-401540],[45035,-400540],[45485,-400540],[44835,-399540],[44180,-400540]]]},label_wcs_mm:[44985,-402915],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-3f5a0179c374f7c339":{footprint:{outer:[[67150,-395340],[67150,-395400],[67190,-395400],[67180,-395480],[67210,-395480],[67210,-395540],[68310,-395540],[68310,-395590],[68460,-395590],[68460,-396740],[68310,-396740],[68310,-397340],[68460,-397340],[68460,-402740],[64010,-402740],[64010,-397340],[64310,-397340],[64310,-396740],[64010,-396740],[64010,-395540],[65410,-395540],[65410,-395480],[65440,-395480],[65430,-395400],[65470,-395400],[65470,-395340],[66306.6667,-395340],[66310,-395400],[66313.3333,-395340],[67150,-395340]],holes:[]},label_wcs_mm:[66235,-400039.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-41750d01749e53306e":{footprint:{outer:[[91309.097,-402738.1756],[91309.097,-406038.1756],[53209.097,-406038.1756],[53209.097,-403538.1756],[50809.097,-403538.1756],[50809.097,-408438.1756],[41609.097,-408438.1756],[41609.097,-411027.4772],[32559.097,-411027.4772],[32559.097,-425238.1756],[28059.097,-425238.1756],[28089.097,-432088.1756],[14009.097,-432088.1756],[14009.097,-416903.1756],[14069.097,-416888.1756],[15959.097,-416888.1756],[15959.097,-413838.1756],[7859.097,-413838.1756],[7859.097,-398338.1756],[41809.097,-398338.1756],[41809.097,-408238.1756],[43809.097,-408238.1756],[43809.097,-398338.1756],[50609.097,-398338.1756],[50609.097,-397838.1756],[63809.097,-397838.1756],[63809.097,-395338.1756],[111159.097,-395338.1756],[111159.097,-396738.1756],[115009.097,-396738.1756],[115009.097,-395718.1756],[120409.097,-395718.1756],[120409.097,-394038.1756],[128619.097,-394038.1756],[128639.097,-394058.1756],[128739.097,-394058.1756],[128759.097,-394038.1756],[133119.097,-394038.1756],[133139.097,-394058.1756],[133989.097,-394058.1756],[134009.097,-394038.1756],[137619.097,-394038.1756],[137639.097,-394058.1756],[137739.097,-394058.1756],[137759.097,-394038.1756],[142809.097,-394038.1756],[142789.097,-394058.1756],[142789.097,-398108.1756],[142809.097,-398154.8423],[142809.097,-399738.1756],[146139.097,-399738.1756],[146189.097,-399758.1756],[146389.097,-399758.1756],[146409.097,-399818.1756],[146409.097,-400368.1756],[146389.097,-400408.1756],[146389.097,-401208.1756],[146409.097,-401254.8423],[146409.097,-404538.1756],[146389.097,-404558.1756],[146389.097,-406008.1756],[146409.097,-406054.8423],[146409.097,-409538.1756],[147899.097,-409538.1756],[147939.097,-409558.1756],[148039.097,-409558.1756],[148039.097,-409908.1756],[148059.097,-409954.8423],[148059.097,-416361.5089],[148039.097,-416408.1756],[148039.097,-420958.1756],[148059.097,-420998.1756],[148059.097,-421618.1756],[148039.097,-421658.1756],[148039.097,-426258.1756],[148059.097,-426304.8423],[148059.097,-435911.5089],[148039.097,-435958.1756],[148039.097,-438538.1756],[142809.097,-438538.1756],[142809.097,-440161.5089],[142789.097,-440208.1756],[142789.097,-441538.1756],[120409.097,-441538.1756],[119809.097,-441580.8878],[116656.0334,-441488.2529],[116416.1726,-441469.6906],[115940.381,-441408.5048],[115704.8354,-441366.0131],[115239.4077,-441257.562],[114782.8154,-441118.2596],[114336.5996,-440948.6334],[113902.3011,-440749.2106],[113481.4609,-440520.5185],[113075.62,-440263.0844],[112837.8198,-440076.2486],[112608.5614,-439879.6641],[112388.1297,-439673.6336],[112176.8093,-439458.4595],[111974.8848,-439234.4445],[111782.6411,-439001.8911],[111600.3627,-438761.1019],[111428.3345,-438512.3794],[111235.9595,-438142.314],[111131.5308,-437963.1601],[110906.8243,-437617.0577],[110661.8306,-437287.8265],[110397.5635,-436976.183],[110115.0369,-436682.8439],[109815.2644,-436408.5256],[109499.2599,-436153.9449],[109168.0371,-435919.8184],[108822.6098,-435706.8625],[108644.8863,-435608.5475],[108280.0532,-435428.6914],[107903.55,-435271.7974],[107516.3906,-435138.5822],[107119.5888,-435029.7625],[106917.8887,-434984.7248],[106508.524,-434913.8418],[106301.1128,-434888.1756],[105809.097,-434888.1756],[105809.097,-433338.1756],[106309.097,-433338.1756],[106309.097,-432738.1756],[105809.097,-432738.1756],[105809.097,-431738.1756],[105729.097,-431738.1756],[105729.097,-425538.1756],[106309.097,-425538.1756],[106309.097,-425058.1756],[110809.097,-425058.1756],[110809.097,-406038.1756],[124809.097,-406038.1756],[124809.097,-405438.1756],[124659.097,-405438.1756],[124659.097,-402738.1756],[91309.097,-402738.1756]],holes:[]},label_wcs_mm:[129424.097,-418930.67559999996],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-42f87f073088823c8f":{footprint:{outer:[[121770,-441540],[121770,-441480],[121730,-441480],[121740,-441400],[121710,-441400],[121710,-441340],[120910,-441340],[120910,-441140],[120610,-441140],[120610,-436040],[120910,-436040],[120910,-435440],[120610,-435440],[120610,-429440],[120910,-429440],[120910,-428840],[120610,-428840],[120610,-427740],[124460,-427740],[124460,-428840],[124310,-428840],[124310,-429440],[124460,-429440],[124460,-435440],[124310,-435440],[124310,-436040],[124460,-436040],[124460,-441140],[124310,-441140],[124310,-441340],[123510,-441340],[123510,-441400],[123480,-441400],[123490,-441480],[123450,-441480],[123450,-441540],[122613.3333,-441540],[122610,-441480],[122606.6667,-441540],[121770,-441540]],holes:[]},label_wcs_mm:[122535,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-459ebaeaf94e72acbe":{footprint:{outer:[[148060,-412430],[148e3,-412430],[148e3,-412470],[147920,-412460],[147920,-412490],[147860,-412490],[147860,-413240],[142810,-413240],[142810,-409740],[147810,-409740],[147810,-409940],[147860,-409940],[147860,-410690],[147920,-410690],[147920,-410720],[148e3,-410710],[148e3,-410750],[148060,-410750],[148060,-411586.6667],[148e3,-411590],[148060,-411593.3333],[148060,-412430]],holes:[[[146445,-413065],[146430,-413110],[146445,-413150],[146465,-413165],[146490,-413170],[146530,-413150],[146550,-413110],[146545,-413085],[146530,-413065],[146490,-413050],[146445,-413065]]]},label_wcs_mm:[145435,-411168.33335000003],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-5736284c4484f3d376":{footprint:{outer:[[50610,-427740],[50610,-428840],[50310,-428840],[50310,-429440],[50610,-429440],[50610,-435440],[50310,-435440],[50310,-436040],[50610,-436040],[50610,-438790],[50310,-438790],[50310,-439290],[50610,-439290],[50610,-441140],[50310,-441140],[50310,-441340],[49210,-441340],[49210,-441400],[49180,-441400],[49190,-441480],[49150,-441480],[49150,-441540],[48313.3333,-441540],[48310,-441480],[48306.6667,-441540],[47470,-441540],[47470,-441480],[47430,-441480],[47440,-441400],[47410,-441400],[47410,-441340],[46310,-441340],[46310,-441140],[46160,-441140],[46160,-436040],[46310,-436040],[46310,-435440],[46160,-435440],[46160,-429440],[46310,-429440],[46310,-428840],[46160,-428840],[46160,-427740],[50610,-427740]],holes:[]},label_wcs_mm:[48385,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-5c759d8a0a5fcb45ff":{footprint:{outer:[[148060,-415580],[148e3,-415580],[148e3,-415620],[147920,-415610],[147920,-415640],[147860,-415640],[147860,-416010],[147835,-416010],[147835,-415985],[147785,-415985],[147785,-416010],[146885,-416010],[146870,-415985],[146840,-415990],[146835,-416010],[145985,-416010],[145985,-415985],[145935,-415985],[145935,-416010],[145910,-416010],[145910,-419090],[147860,-419090],[147860,-421040],[147810,-421040],[147810,-421440],[146410,-421440],[146410,-421040],[145910,-421040],[145910,-421440],[142810,-421440],[142810,-415740],[142750,-415740],[142750,-415720],[143630,-415720],[143610,-415540],[143590,-415455],[143560,-415375],[143480,-415225],[143370,-415095],[143310,-415040],[143240,-414990],[143090,-414905],[142925,-414855],[142750,-414840],[142840,-414835],[142925,-414820],[143010,-414800],[143090,-414770],[143240,-414690],[143370,-414580],[143430,-414520],[143480,-414450],[143525,-414380],[143560,-414300],[143590,-414220],[143610,-414135],[143625,-414050],[143630,-413960],[142750,-413960],[142750,-413940],[142810,-413940],[142810,-413440],[145910,-413440],[145910,-413840],[146410,-413840],[146410,-413440],[147810,-413440],[147810,-413840],[147920,-413840],[147920,-413870],[148e3,-413860],[148e3,-413900],[148060,-413900],[148060,-414736.6667],[148e3,-414740],[148060,-414743.3333],[148060,-415580]],holes:[]},label_wcs_mm:[144360,-417549.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-62509ee96294319a17":{footprint:{outer:[[95817.0812,-434888.1756],[94899.7863,-435054.4333],[94012.2868,-435352.759],[93175.4352,-435777.5751],[92413.4843,-436315.7279],[91737.222,-436958.0591],[91158.5731,-437694.3165],[90697.6093,-438496.2759],[90193.8447,-439175.2523],[89672.4185,-439729.2365],[89046.7266,-440259.9611],[88225.0671,-440746.292],[87340.1898,-441118.8691],[86412.1948,-441367.9003],[85495.4385,-441486.2403],[82309.097,-441580.8875],[82309.097,-441138.1756],[82159.097,-441138.1756],[82059.097,-429088.7712],[96509.097,-429088.7469],[96509.097,-434888.1756],[95817.0812,-434888.1756]],holes:[]},label_wcs_mm:[88282.94074680399,-435203.59614999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-661bda80d4fe7cdea1":{footprint:{outer:[[82160,-436040],[82310,-436040],[82310,-435440],[82160,-435440],[82160,-429440],[82310,-429440],[82310,-429210],[86910,-429210],[86910,-429440],[87410,-429440],[87410,-429210],[96385,-429210],[96388.2208,-432740],[95810,-432740],[95810,-433340],[96388.7682,-433340],[96390,-434690],[95805,-434690],[95195,-434780],[94890,-434850],[94595,-434930],[94300,-435030],[94010,-435140],[93725,-435260],[93445,-435395],[93485,-435455],[93440,-435390],[93415,-435405],[93440,-435440],[93445,-435435],[93470,-435465],[93435,-435490],[93507.2343,-435592.9875],[93295,-435705],[93120,-435810],[92795.3846,-436027.7622],[92750,-435970],[92787.8205,-436033.0342],[92390,-436335],[92133.9763,-436560.4712],[92060,-436455],[92030,-436475],[92107.7256,-436585.8167],[91860,-436825],[91720,-436975],[91585,-437130],[91330,-437450],[91210,-437615],[90985,-437965],[90880,-438140],[90692.5542,-438505.026],[90184.749,-439185.8368],[89696.9231,-439701.5385],[89045,-440260],[88225,-440745],[87340,-441120],[86464.9545,-441355.2273],[86359.4475,-441376.3536],[85495,-441485],[82310,-441580],[82310,-441510],[85465,-441420],[85935,-441375],[86170,-441340],[86405,-441300],[86635,-441250],[86865,-441190],[87315,-441055],[87760,-440885],[87975,-440790],[88400,-440575],[88605,-440460],[89005,-440205],[89240,-440020],[89465,-439825],[89685,-439620],[89890,-439410],[90090,-439190],[90280,-438960],[90460,-438725],[90630,-438480],[90765,-438210],[90915,-437945],[91075,-437690],[91250,-437445],[91435,-437205],[91630,-436975],[91835,-436755],[92048.9286,-436541.0714],[91975,-436435],[91755,-436650],[91540,-436875],[91340,-437110],[91155,-437355],[90975,-437610],[90810,-437870],[90655,-438140],[90515,-438415],[90175,-438885],[89795,-439325],[89380,-439730],[89160,-439920],[88930,-440100],[88535,-440350],[88335,-440465],[88130,-440570],[87705,-440765],[87490,-440850],[87275,-440930],[86830,-441065],[86380,-441170],[85920,-441245],[85690,-441270],[85455,-441290],[82310,-441380],[82310,-441140],[82160,-441140],[82160,-436040]],holes:[[[92005,-436445],[92015,-436435],[91990,-436405],[91965,-436420],[92010,-436485],[92030,-436475],[92005,-436445]],[[87410,-440840],[87410,-440240],[86910,-440240],[86910,-440840],[87410,-440840]],[[87410,-436040],[87410,-435440],[86910,-435440],[86910,-436040],[87410,-436040]],[[91310,-433340],[91310,-432740],[90810,-432740],[90810,-433340],[91310,-433340]],[[90810,-436840],[90810,-437440],[91060,-437440],[91310,-437140],[91310,-436840],[90810,-436840]],[[82265,-429560],[82285,-429575],[82310,-429580],[82350,-429560],[82370,-429520],[82365,-429495],[82350,-429475],[82310,-429460],[82265,-429475],[82250,-429520],[82265,-429560]]]},label_wcs_mm:[87797.91666666667,-435392.5],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-6b162ffe8ab56d3fbe":{footprint:{outer:[[125970,-441540],[125970,-441480],[125930,-441480],[125940,-441400],[125910,-441400],[125910,-441340],[124810,-441340],[124810,-441140],[124660,-441140],[124660,-436040],[124810,-436040],[124810,-435440],[124660,-435440],[124660,-429440],[124810,-429440],[124810,-428840],[124660,-428840],[124660,-427740],[128960,-427740],[128960,-428840],[128810,-428840],[128810,-429440],[128960,-429440],[128960,-435440],[128810,-435440],[128810,-436040],[128960,-436040],[128960,-441140],[128810,-441140],[128810,-441340],[127710,-441340],[127710,-441400],[127680,-441400],[127690,-441480],[127650,-441480],[127650,-441540],[126813.3333,-441540],[126810,-441480],[126806.6667,-441540],[125970,-441540]],holes:[]},label_wcs_mm:[126810,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-6bf48c04a936f0d843":{footprint:{outer:[[123450,-394040],[123450,-394300],[123490,-394300],[123480,-394380],[123510,-394380],[123510,-394440],[124310,-394440],[124310,-394640],[124460,-394640],[124460,-399740],[124310,-399740],[124310,-400340],[124460,-400340],[124460,-402540],[123415,-402540],[123415,-401720],[123235,-401735],[123070,-401785],[122920,-401870],[122790,-401975],[122685,-402105],[122605,-402255],[122550,-402420],[122538.3333,-402540],[122531.6667,-402540],[122495,-402335],[122465,-402255],[122385,-402105],[122275,-401975],[122215,-401920],[122145,-401870],[121995,-401785],[121830,-401735],[121695,-401720],[121655,-401720],[121655,-402540],[120610,-402540],[120610,-400340],[120910,-400340],[120910,-399740],[121510,-399740],[121515,-399755],[121535,-399765],[121560,-399740],[122385,-399740],[122385,-399765],[122435,-399765],[122435,-399740],[122460,-399740],[122460,-397835],[121635,-397630],[121620,-397370],[121500,-397850],[121485,-397590],[120610,-397375],[120610,-394640],[120910,-394640],[120910,-394440],[121710,-394440],[121710,-394380],[121740,-394380],[121730,-394300],[121770,-394300],[121770,-394040],[122571.1765,-394040],[122605,-394210],[122610,-394300],[122625,-394120],[122648.5294,-394040],[123450,-394040]],holes:[]},label_wcs_mm:[123460,-398795],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-6d04a160e998b319cd":{footprint:{outer:[[68460,-427740],[68460,-428840],[68310,-428840],[68310,-429440],[68460,-429440],[68460,-435440],[68310,-435440],[68310,-436040],[68460,-436040],[68460,-441140],[68310,-441140],[68310,-441340],[64310,-441340],[64310,-441140],[64010,-441140],[64010,-436040],[64310,-436040],[64310,-435440],[64010,-435440],[64010,-429440],[64310,-429440],[64310,-428840],[64010,-428840],[64010,-427740],[68460,-427740]],holes:[]},label_wcs_mm:[66235,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-732850a9daeaef5b0d":{footprint:{outer:[[28086.4964,-431290],[27810,-431290],[27810,-431790],[23810,-431790],[23810,-431290],[23660,-431290],[23660,-429440],[23810,-429440],[23810,-428840],[23660,-428840],[23660,-421640],[23810,-421640],[23810,-421040],[23660,-421040],[23660,-413840],[23810,-413840],[23810,-413640],[27810,-413640],[27810,-413840],[28310,-413840],[28310,-413640],[32310,-413640],[32310,-413840],[32560,-413840],[32560,-421040],[32310,-421040],[32310,-421640],[32560,-421640],[32560,-425240],[28060,-425240],[28060,-428840],[27810,-428840],[27810,-429440],[28078.3942,-429440],[28086.4964,-431290]],holes:[[[28310,-421640],[28310,-421040],[27810,-421040],[27810,-421640],[28310,-421640]],[[27765,-429475],[27750,-429520],[27765,-429560],[27785,-429575],[27810,-429580],[27850,-429560],[27870,-429520],[27865,-429495],[27850,-429475],[27810,-429460],[27765,-429475]]]},label_wcs_mm:[28110,-423440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-7b925015a01e150807":{footprint:{outer:[[139470,-441540],[139470,-441480],[139430,-441480],[139440,-441400],[139410,-441400],[139410,-441340],[138310,-441340],[138310,-441140],[138160,-441140],[138160,-436040],[138310,-436040],[138310,-435440],[138160,-435440],[138160,-429440],[138310,-429440],[138310,-429240],[142310,-429240],[142310,-429440],[142610,-429440],[142610,-435440],[142310,-435440],[142310,-436040],[142610,-436040],[142610,-441140],[142310,-441140],[142310,-441340],[141210,-441340],[141210,-441400],[141180,-441400],[141190,-441480],[141150,-441480],[141150,-441540],[140313.3333,-441540],[140310,-441480],[140306.6667,-441540],[139470,-441540]],holes:[]},label_wcs_mm:[140385,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-7ef805848c8718ffc7":{footprint:{outer:[[72960,-427740],[72960,-428840],[72810,-428840],[72810,-429440],[72960,-429440],[72960,-435440],[72810,-435440],[72810,-436040],[72960,-436040],[72960,-441140],[72810,-441140],[72810,-441340],[68810,-441340],[68810,-441140],[68660,-441140],[68660,-436040],[68810,-436040],[68810,-435440],[68660,-435440],[68660,-429440],[68810,-429440],[68810,-428840],[68660,-428840],[68660,-427740],[72960,-427740]],holes:[]},label_wcs_mm:[70810,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-867a934e2a60559836":{footprint:{outer:[[124660,-400340],[124810,-400340],[124810,-399740],[124660,-399740],[124660,-394640],[124810,-394640],[124810,-394440],[125910,-394440],[125910,-394380],[125940,-394380],[125930,-394300],[125970,-394300],[125970,-394040],[126771.1765,-394040],[126805,-394210],[126810,-394300],[126825,-394120],[126848.5294,-394040],[127650,-394040],[127650,-394300],[127690,-394300],[127680,-394380],[127710,-394380],[127710,-394440],[128810,-394440],[128810,-394640],[129310,-394640],[129310,-394440],[130410,-394440],[130410,-394380],[130440,-394380],[130430,-394300],[130470,-394300],[130470,-394040],[131271.1765,-394040],[131305,-394210],[131310,-394300],[131325,-394120],[131348.5294,-394040],[132150,-394040],[132150,-394300],[132190,-394300],[132180,-394380],[132210,-394380],[132210,-394440],[133310,-394440],[133310,-394640],[133460,-394640],[133460,-399740],[133310,-399740],[133310,-400340],[133810,-400340],[133810,-399740],[133660,-399740],[133660,-394640],[133810,-394640],[133810,-394440],[134910,-394440],[134910,-394380],[134940,-394380],[134930,-394300],[134970,-394300],[134970,-394040],[135771.1765,-394040],[135805,-394210],[135810,-394300],[135825,-394120],[135848.5294,-394040],[136650,-394040],[136650,-394300],[136690,-394300],[136680,-394380],[136710,-394380],[136710,-394440],[137810,-394440],[137810,-394640],[138310,-394640],[138310,-394440],[139410,-394440],[139410,-394380],[139440,-394380],[139430,-394300],[139470,-394300],[139470,-394040],[140271.1765,-394040],[140305,-394210],[140310,-394300],[140325,-394120],[140348.5294,-394040],[141150,-394040],[141150,-394300],[141190,-394300],[141180,-394380],[141210,-394380],[141210,-394440],[142310,-394440],[142310,-394640],[142610,-394640],[142610,-399740],[142310,-399740],[142310,-400340],[142810,-400340],[142810,-399940],[143660,-399940],[143660,-399880],[143690,-399880],[143680,-399800],[143720,-399800],[143720,-399740],[144556.6667,-399740],[144560,-399800],[144563.3333,-399740],[145400,-399740],[145400,-399800],[145440,-399800],[145430,-399880],[145460,-399880],[145460,-399940],[145910,-399940],[145910,-400340],[146210,-400340],[146210,-401990],[146270,-401990],[146270,-402020],[146350,-402010],[146350,-402050],[146410,-402050],[146410,-402886.6667],[146350,-402890],[146410,-402893.3333],[146410,-403730],[146350,-403730],[146350,-403770],[146270,-403760],[146270,-403790],[146210,-403790],[146210,-405440],[145910,-405440],[145910,-406040],[146210,-406040],[146210,-406790],[146270,-406790],[146270,-406820],[146350,-406810],[146350,-406850],[146410,-406850],[146410,-407686.6667],[146350,-407690],[146410,-407693.3333],[146410,-408530],[146350,-408530],[146350,-408570],[146270,-408560],[146270,-408590],[146210,-408590],[146210,-409540],[142610,-409540],[142610,-413240],[142310,-413240],[142310,-413440],[138310,-413440],[138310,-413240],[137810,-413240],[137810,-413440],[133810,-413440],[133810,-413240],[133310,-413240],[133310,-413440],[129310,-413440],[129310,-413240],[128810,-413240],[128810,-413440],[124810,-413440],[124810,-413240],[124310,-413240],[124310,-413440],[120910,-413440],[120910,-413240],[120410,-413240],[120410,-413840],[120910,-413840],[120910,-413640],[124310,-413640],[124310,-413840],[124810,-413840],[124810,-413640],[128810,-413640],[128810,-413840],[129310,-413840],[129310,-413640],[133310,-413640],[133310,-413840],[133810,-413840],[133810,-413640],[137810,-413640],[137810,-413840],[138310,-413840],[138310,-413640],[142310,-413640],[142310,-413840],[142610,-413840],[142610,-413940],[142670,-413940],[142670,-413970],[142750,-413960],[142750,-414e3],[143627.7778,-414e3],[143625,-414050],[143590,-414220],[143525,-414380],[143430,-414520],[143370,-414580],[143240,-414690],[143090,-414770],[143010,-414800],[142925,-414820],[142840,-414835],[142750,-414840],[142925,-414855],[143090,-414905],[143240,-414990],[143310,-415040],[143370,-415095],[143480,-415225],[143560,-415375],[143590,-415455],[143610,-415540],[143627.7778,-415680],[142750,-415680],[142750,-415720],[142670,-415710],[142670,-415740],[142610,-415740],[142610,-421040],[142310,-421040],[142310,-421640],[147860,-421640],[147860,-427040],[147920,-427040],[147920,-427070],[148e3,-427060],[148e3,-427100],[148060,-427100],[148060,-427936.6667],[148e3,-427940],[148060,-427943.3333],[148060,-428780],[148e3,-428780],[148e3,-428820],[147920,-428810],[147920,-428840],[147810,-428840],[147810,-429440],[147860,-429440],[147860,-430190],[147920,-430190],[147920,-430220],[148e3,-430210],[148e3,-430250],[148060,-430250],[148060,-431086.6667],[148e3,-431090],[148060,-431093.3333],[148060,-431930],[148e3,-431930],[148e3,-431970],[147920,-431960],[147920,-431990],[147860,-431990],[147860,-432940],[142810,-432940],[142810,-428840],[142310,-428840],[142310,-429040],[138310,-429040],[138310,-428840],[138160,-428840],[138160,-427540],[120410,-427540],[120410,-441540],[120310,-441546.6667],[120310,-427540],[114860,-427540],[114860,-428840],[114710,-428840],[114710,-429440],[114860,-429440],[114860,-435440],[114710,-435440],[114710,-436040],[114860,-436040],[114860,-440240],[114710,-440240],[114710,-440840],[114860,-440840],[114860,-441007.1591],[114360,-440820],[113940,-440625],[113735,-440515],[113335,-440280],[113155,-440160],[112920,-439975],[112695,-439785],[112480,-439585],[112275,-439375],[112075,-439155],[111710,-438690],[111540,-438450],[111345,-438070],[111240,-437890],[111010,-437535],[110760,-437200],[110625,-437040],[110345,-436730],[110050,-436440],[109735,-436170],[109235,-435805],[109060,-435695],[108700,-435490],[108325,-435305],[107945,-435150],[107550,-435010],[107145,-434900],[106730,-434815],[106310,-434760],[105810,-434760],[105810,-433340],[106310,-433340],[106310,-432740],[105810,-432740],[105810,-431740],[105730,-431740],[105730,-425540],[106310,-425540],[106310,-425060],[110810,-425060],[110810,-425540],[111310,-425540],[111310,-424940],[111010,-424940],[111010,-421640],[111310,-421640],[111310,-421040],[111010,-421040],[111010,-413840],[111310,-413840],[111310,-413640],[114710,-413640],[114710,-413840],[115210,-413840],[115210,-413640],[119810,-413640],[119810,-413840],[120310,-413840],[120310,-413240],[119810,-413240],[119810,-413440],[115210,-413440],[115210,-413240],[114710,-413240],[114710,-413440],[111310,-413440],[111310,-413240],[111010,-413240],[111010,-406040],[124810,-406040],[124810,-405440],[124660,-405440],[124660,-400340]],holes:[[[120310,-421640],[120310,-421040],[119810,-421040],[119810,-421640],[120310,-421640]],[[115210,-421640],[115210,-421040],[114710,-421040],[114710,-421640],[115210,-421640]],[[111310,-433340],[111310,-432740],[110810,-432740],[110810,-433340],[111310,-433340]],[[120910,-421640],[120910,-421040],[120410,-421040],[120410,-421640],[120910,-421640]],[[124810,-421640],[124810,-421040],[124310,-421040],[124310,-421640],[124810,-421640]],[[129310,-421640],[129310,-421040],[128810,-421040],[128810,-421640],[129310,-421640]],[[133810,-421640],[133810,-421040],[133310,-421040],[133310,-421640],[133810,-421640]],[[138310,-421640],[138310,-421040],[137810,-421040],[137810,-421640],[138310,-421640]],[[129310,-406040],[129310,-405440],[128810,-405440],[128810,-406040],[129310,-406040]],[[133810,-406040],[133810,-405440],[133310,-405440],[133310,-406040],[133810,-406040]],[[138310,-406040],[138310,-405440],[137810,-405440],[137810,-406040],[138310,-406040]],[[142810,-406040],[142810,-405440],[142310,-405440],[142310,-406040],[142810,-406040]],[[129310,-400340],[129310,-399740],[128810,-399740],[128810,-400340],[129310,-400340]],[[138310,-400340],[138310,-399740],[137810,-399740],[137810,-400340],[138310,-400340]],[[146410,-429440],[146410,-428840],[145910,-428840],[145910,-429440],[146410,-429440]],[[110810,-436840],[110810,-437140],[111060,-437440],[111310,-437440],[111310,-436840],[110810,-436840]],[[146005,-428750],[145980,-428720],[145940,-428720],[145915,-428750],[145910,-428770],[145925,-428805],[145960,-428820],[145995,-428805],[146010,-428770],[146005,-428750]],[[138270,-406160],[138290,-406175],[138315,-406180],[138355,-406160],[138375,-406120],[138370,-406095],[138355,-406075],[138315,-406060],[138270,-406075],[138255,-406120],[138270,-406160]],[[138270,-428800],[138290,-428815],[138315,-428820],[138355,-428800],[138375,-428760],[138370,-428735],[138355,-428715],[138315,-428700],[138270,-428715],[138255,-428760],[138270,-428800]],[[146445,-421725],[146430,-421770],[146445,-421810],[146465,-421825],[146490,-421830],[146530,-421810],[146550,-421770],[146545,-421745],[146530,-421725],[146490,-421710],[146445,-421725]]]},label_wcs_mm:[126810,-418390],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-884b0725a9ea3bc4fb":{footprint:{outer:[[76150,-395340],[76150,-395400],[76190,-395400],[76180,-395480],[76210,-395480],[76210,-395540],[77310,-395540],[77310,-395590],[77460,-395590],[77460,-396740],[77310,-396740],[77310,-397340],[77460,-397340],[77460,-402740],[73160,-402740],[73160,-397340],[73310,-397340],[73310,-396740],[73160,-396740],[73160,-395590],[73310,-395590],[73310,-395540],[74410,-395540],[74410,-395480],[74440,-395480],[74430,-395400],[74470,-395400],[74470,-395340],[75306.6667,-395340],[75310,-395400],[75313.3333,-395340],[76150,-395340]],holes:[]},label_wcs_mm:[75310,-400039.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-8aa5bbedbfa2f07fc4":{footprint:{outer:[[32310,-430240],[28310,-430240],[28310,-428840],[28075.7664,-428840],[28060,-425240],[32560,-425240],[32560,-428840],[32310,-428840],[32310,-430240]],holes:[]},label_wcs_mm:[30313.9416,-427039.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-8b09f1e719eee429cc":{footprint:{outer:[[79850,-395340],[79850,-395400],[79890,-395400],[79880,-395480],[79910,-395480],[79910,-395540],[81810,-395540],[81810,-395590],[81960,-395590],[81960,-396740],[81810,-396740],[81810,-397340],[81960,-397340],[81960,-399140],[79860,-399140],[79860,-403620],[79885,-403620],[79885,-403670],[79935,-403670],[79935,-403620],[80920,-403620],[80945,-403645],[80965,-403635],[80970,-403620],[81960,-403620],[81960,-405440],[81810,-405440],[81810,-405840],[79790,-405840],[79790,-404920],[79590,-404940],[79500,-404960],[79410,-404995],[79320,-405035],[79240,-405085],[79165,-405140],[79095,-405205],[78975,-405350],[78925,-405430],[78885,-405515],[78830,-405700],[78813,-405840],[78807,-405840],[78790,-405700],[78765,-405605],[78730,-405515],[78690,-405430],[78585,-405275],[78450,-405140],[78375,-405085],[78295,-405035],[78120,-404960],[77930,-404925],[77830,-404920],[77830,-405840],[77810,-405840],[77810,-405440],[77660,-405440],[77660,-397340],[77810,-397340],[77810,-396740],[77660,-396740],[77660,-395590],[77810,-395590],[77810,-395540],[77910,-395540],[77910,-395480],[77940,-395480],[77930,-395400],[77970,-395400],[77970,-395340],[78907,-395340],[78910,-395400],[78913,-395340],[79850,-395340]],holes:[[[77830,-396700],[77850,-396660],[77845,-396635],[77830,-396615],[77790,-396600],[77745,-396615],[77730,-396660],[77745,-396700],[77765,-396715],[77790,-396720],[77830,-396700]],[[81845,-405400],[81865,-405360],[81860,-405335],[81845,-405315],[81805,-405300],[81760,-405315],[81745,-405360],[81760,-405400],[81780,-405415],[81805,-405420],[81845,-405400]]]},label_wcs_mm:[78759.99999999999,-401380],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-a2a52debafd8f45503":{footprint:{outer:[[130470,-441540],[130470,-441480],[130430,-441480],[130440,-441400],[130410,-441400],[130410,-441340],[129310,-441340],[129310,-441140],[129160,-441140],[129160,-436040],[129310,-436040],[129310,-435440],[129160,-435440],[129160,-429440],[129310,-429440],[129310,-428840],[129160,-428840],[129160,-427740],[133460,-427740],[133460,-428840],[133310,-428840],[133310,-429440],[133460,-429440],[133460,-435440],[133310,-435440],[133310,-436040],[133460,-436040],[133460,-441140],[133310,-441140],[133310,-441340],[132210,-441340],[132210,-441400],[132180,-441400],[132190,-441480],[132150,-441480],[132150,-441540],[131313.3333,-441540],[131310,-441480],[131306.6667,-441540],[130470,-441540]],holes:[]},label_wcs_mm:[131310,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-a694a8f16cd663ba78":{footprint:{outer:[[62450,-397840],[62450,-397900],[62490,-397900],[62480,-397980],[62510,-397980],[62510,-398040],[63510,-398040],[63510,-405440],[63210,-405440],[63210,-405840],[61910,-405840],[61910,-405900],[61890,-405900],[61890,-404920],[61690,-404940],[61600,-404960],[61420,-405035],[61265,-405140],[61195,-405205],[61135,-405275],[61075,-405350],[61025,-405430],[60985,-405515],[60930,-405700],[60910,-405900],[60890,-405700],[60865,-405605],[60830,-405515],[60790,-405430],[60740,-405350],[60685,-405275],[60620,-405205],[60550,-405140],[60475,-405085],[60395,-405035],[60310,-404995],[60220,-404960],[60125,-404940],[60030,-404925],[59930,-404920],[59930,-405900],[59910,-405900],[59910,-405840],[59810,-405840],[59810,-405440],[59310,-405440],[59310,-405840],[57110,-405840],[57110,-404240],[56810,-404240],[56810,-402615],[56070,-402430],[56055,-402170],[55935,-402650],[55920,-402390],[55210,-402215],[55210,-400340],[55310,-400340],[55310,-399940],[59310,-399940],[59310,-400340],[59610,-400340],[59610,-402940],[59810,-402940],[59810,-398040],[60510,-398040],[60510,-397980],[60540,-397980],[60530,-397900],[60570,-397900],[60570,-397840],[61507,-397840],[61510,-397900],[61513,-397840],[62450,-397840]],holes:[[[63410,-399710],[61810,-399710],[61810,-404190],[62585,-404190],[62585,-404200],[62610,-404215],[62635,-404190],[63410,-404190],[63410,-399710]]]},label_wcs_mm:[57410,-401255],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-ac3355b501fd9b01d5":{footprint:{outer:[[41610,-411025],[41610,-408440],[50810,-408440],[50810,-413240],[50310,-413240],[50310,-413440],[46310,-413440],[46310,-413240],[45810,-413240],[45810,-413440],[41810,-413440],[41810,-413240],[41310,-413240],[41310,-413440],[37310,-413440],[37310,-413240],[36810,-413240],[36810,-413440],[32810,-413440],[32810,-413240],[32560,-413240],[32560,-411025],[41610,-411025]],holes:[]},label_wcs_mm:[46210,-409732.49999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-b4729158afd7457b17":{footprint:{outer:[[63510,-427740],[63510,-428840],[63210,-428840],[63210,-429440],[63510,-429440],[63510,-435440],[63210,-435440],[63210,-436040],[63510,-436040],[63510,-438790],[63210,-438790],[63210,-438940],[62410,-438940],[62410,-439e3],[62380,-439e3],[62390,-439080],[62350,-439080],[62350,-439140],[61513.3333,-439140],[61510,-439080],[61506.6667,-439140],[60670,-439140],[60670,-439080],[60630,-439080],[60640,-439e3],[60610,-439e3],[60610,-438940],[59810,-438940],[59810,-438790],[59660,-438790],[59660,-436040],[59810,-436040],[59810,-435440],[59660,-435440],[59660,-429440],[59810,-429440],[59810,-428840],[59660,-428840],[59660,-427740],[63510,-427740]],holes:[]},label_wcs_mm:[61584.99999999999,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-b6bf29fc3c9dbf921d":{footprint:{outer:[[45960,-427740],[45960,-428840],[45810,-428840],[45810,-429440],[45960,-429440],[45960,-435440],[45810,-435440],[45810,-436040],[45960,-436040],[45960,-441140],[45810,-441140],[45810,-441340],[44710,-441340],[44710,-441400],[44680,-441400],[44690,-441480],[44650,-441480],[44650,-441540],[43813.3333,-441540],[43810,-441480],[43806.6667,-441540],[42970,-441540],[42970,-441480],[42930,-441480],[42940,-441400],[42910,-441400],[42910,-441340],[41810,-441340],[41810,-441140],[41610,-441140],[41610,-436040],[41810,-436040],[41810,-435440],[41610,-435440],[41610,-429440],[41810,-429440],[41810,-428840],[41660,-428840],[41660,-427740],[45960,-427740]],holes:[]},label_wcs_mm:[43785,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-baf6ad7b6981f526fc":{footprint:{outer:[[134970,-441540],[134970,-441480],[134930,-441480],[134940,-441400],[134910,-441400],[134910,-441340],[133810,-441340],[133810,-441140],[133660,-441140],[133660,-436040],[133810,-436040],[133810,-435440],[133660,-435440],[133660,-429440],[133810,-429440],[133810,-428840],[133660,-428840],[133660,-427740],[137960,-427740],[137960,-428840],[137810,-428840],[137810,-429440],[137960,-429440],[137960,-435440],[137810,-435440],[137810,-436040],[137960,-436040],[137960,-441140],[137810,-441140],[137810,-441340],[136710,-441340],[136710,-441400],[136680,-441400],[136690,-441480],[136650,-441480],[136650,-441540],[135813.3333,-441540],[135810,-441480],[135806.6667,-441540],[134970,-441540]],holes:[]},label_wcs_mm:[135810,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-bb76ecf504e5b41afa":{footprint:{outer:[[120410,-395720],[120410,-402540],[116790,-402540],[116790,-401870],[116715,-401870],[116570,-401900],[116505,-401925],[116440,-401955],[116380,-401995],[116275,-402080],[116185,-402190],[116145,-402250],[116115,-402315],[116090,-402380],[116064,-402540],[116056,-402540],[116045,-402450],[116025,-402380],[115970,-402250],[115935,-402190],[115845,-402080],[115795,-402035],[115675,-401955],[115615,-401925],[115545,-401900],[115405,-401870],[115330,-401870],[115330,-402540],[115210,-402540],[115210,-395920],[115310,-395920],[115310,-395860],[115340,-395860],[115330,-395780],[115370,-395780],[115370,-395720],[116056,-395720],[116060,-395780],[116064,-395720],[116750,-395720],[116750,-395780],[116790,-395780],[116780,-395860],[116810,-395860],[116810,-395920],[120310,-395920],[120310,-395720],[120410,-395720]],holes:[[[118490,-397520],[118490,-400320],[118515,-400320],[118515,-400395],[118565,-400395],[118565,-400320],[119265,-400320],[119265,-400330],[119290,-400345],[119315,-400320],[120015,-400320],[120015,-400395],[120310,-400395],[120310,-400345],[120065,-400345],[120065,-400320],[120090,-400320],[120090,-397520],[118490,-397520]]]},label_wcs_mm:[116850,-398919.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-bdeb2705cecacf1278":{footprint:{outer:[[110810,-424940],[108780,-424940],[108780,-405560],[110810,-405560],[110810,-424940]],holes:[]},label_wcs_mm:[109795,-415250],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-ce6d50b7053b3e2a21":{footprint:{outer:[[63710,-427740],[63710,-427540],[41460,-427540],[41460,-428840],[41310,-428840],[41310,-429440],[41410,-429440],[41410,-431440],[40410,-431440],[40410,-430770],[40335,-430770],[40190,-430800],[40125,-430825],[40060,-430855],[4e4,-430895],[39895,-430980],[39805,-431090],[39765,-431150],[39735,-431215],[39710,-431280],[39684,-431440],[39676,-431440],[39665,-431350],[39645,-431280],[39590,-431150],[39555,-431090],[39465,-430980],[39415,-430935],[39295,-430855],[39235,-430825],[39165,-430800],[39025,-430770],[38950,-430770],[38950,-431440],[38810,-431440],[38810,-430116.8421],[38945,-430100],[39125,-430045],[39285,-429955],[39360,-429900],[39430,-429835],[39490,-429770],[39545,-429695],[39595,-429615],[39635,-429530],[39690,-429350],[39710,-429200],[39710,-429160],[38810,-429160],[38810,-428840],[36810,-428840],[36810,-429040],[32810,-429040],[32810,-428840],[32560,-428840],[32560,-421640],[32810,-421640],[32810,-421040],[32560,-421040],[32560,-413840],[32810,-413840],[32810,-413640],[36810,-413640],[36810,-413840],[37310,-413840],[37310,-413640],[41310,-413640],[41310,-413840],[41810,-413840],[41810,-413640],[45810,-413640],[45810,-413840],[46310,-413840],[46310,-413640],[50310,-413640],[50310,-413840],[50810,-413840],[50810,-403540],[51585,-403540],[51585,-403555],[52965,-403555],[52965,-403540],[53210,-403540],[53210,-404763],[53075,-404780],[52985,-404800],[52895,-404835],[52730,-404920],[52590,-405040],[52475,-405180],[52425,-405260],[52385,-405345],[52350,-405435],[52330,-405525],[52310,-405680],[52310,-405720],[53210,-405720],[53210,-406040],[91310,-406040],[91310,-402740],[124460,-402740],[124460,-405440],[124310,-405440],[124310,-406040],[120910,-406040],[120910,-405440],[120410,-405440],[120410,-406040],[120310,-406040],[120310,-405440],[119810,-405440],[119810,-406040],[115210,-406040],[115210,-405440],[114710,-405440],[114710,-406040],[111310,-406040],[111310,-405440],[108660,-405440],[108660,-424940],[105610,-424940],[105610,-434690],[96510,-434690],[96510,-428140],[96590,-428140],[96590,-427940],[96290,-427940],[96290,-428140],[96385,-428140],[96385,-429090],[87410,-429090],[87410,-428840],[86910,-428840],[86910,-429090],[82310,-429090],[82310,-428840],[82160,-428840],[82160,-423360],[82175,-423360],[82175,-423310],[82160,-423310],[82160,-423295],[82745,-423295],[82745,-423305],[82765,-423310],[82765,-423350],[82670,-423350],[82670,-423370],[82785,-423370],[82785,-423310],[82805,-423305],[82805,-423295],[82865,-423295],[82865,-423275],[82875,-423275],[82875,-423250],[82861.7857,-423250],[82835,-423090],[82810,-423025],[82745,-422905],[82660,-422795],[82550,-422710],[82430,-422645],[82365,-422620],[82295,-422605],[82160,-422590],[82295,-422575],[82430,-422535],[82550,-422470],[82660,-422380],[82745,-422275],[82780,-422215],[82835,-422085],[82860,-421950],[82865,-421880],[82790,-421875],[82785,-421810],[82670,-421810],[82670,-421825],[82765,-421825],[82765,-421870],[82745,-421880],[82160,-421880],[82160,-421870],[82175,-421870],[82175,-421820],[82160,-421820],[82160,-421640],[82310,-421640],[82310,-421400],[86910,-421400],[86910,-421640],[87410,-421640],[87410,-421400],[90810,-421400],[90810,-421640],[91190,-421640],[91190,-424940],[90810,-424940],[90810,-425540],[91310,-425540],[91310,-425060],[95810,-425060],[95810,-425540],[96510,-425540],[96510,-424940],[91310,-424940],[91310,-409040],[91190,-409040],[91190,-413240],[90810,-413240],[90810,-413840],[91190,-413840],[91190,-421040],[90810,-421040],[90810,-421280],[87410,-421280],[87410,-421040],[86910,-421040],[86910,-421280],[82310,-421280],[82310,-421040],[81810,-421040],[81810,-421640],[82040,-421640],[82040,-421830],[82025,-421830],[82025,-421880],[82040,-421880],[82040,-423300],[82025,-423300],[82025,-423350],[82040,-423350],[82040,-427540],[63810,-427540],[63810,-427740],[63710,-427740]],holes:[[[91860,-421350],[93450,-421350],[93450,-416280.468],[93350,-416312.4877],[93350,-416848.799],[93250,-416880.6618],[93250,-420770],[93155,-420770],[93155,-416790],[92155,-416790],[92155,-420770],[91860,-420770],[91860,-421350]],[[93555,-421350],[95145,-421350],[95145,-420770],[95295,-420770],[95295,-416232.4384],[95045,-416312.4877],[95045,-420770],[94850,-420770],[94850,-416790],[93850,-416790],[93850,-420770],[93555,-420770],[93555,-421350]],[[40760,-424970],[40760,-419900],[37475,-419900],[37475,-424970],[40760,-424970]],[[64310,-421640],[64310,-421040],[63810,-421040],[63810,-421640],[64310,-421640]],[[68810,-421640],[68810,-421040],[68310,-421040],[68310,-421640],[68810,-421640]],[[77810,-421640],[77810,-421040],[77310,-421040],[77310,-421640],[77810,-421640]],[[73310,-421640],[73310,-421040],[72810,-421040],[72810,-421640],[73310,-421640]],[[64310,-413840],[64310,-413240],[63810,-413240],[63810,-413840],[64310,-413840]],[[68810,-413840],[68810,-413240],[68310,-413240],[68310,-413840],[68810,-413840]],[[82310,-413840],[82310,-413240],[81810,-413240],[81810,-413840],[82310,-413840]],[[77810,-413840],[77810,-413240],[77310,-413240],[77310,-413840],[77810,-413840]],[[73310,-413840],[73310,-413240],[72810,-413240],[72810,-413840],[73310,-413840]],[[106310,-406040],[106310,-405440],[105610,-405440],[105610,-406040],[106310,-406040]],[[96510,-406040],[96510,-405440],[95810,-405440],[95810,-406040],[96510,-406040]],[[87410,-413840],[87410,-413240],[86910,-413240],[86910,-413840],[87410,-413840]],[[63710,-421640],[63710,-421040],[63210,-421040],[63210,-421640],[63710,-421640]],[[63710,-413840],[63710,-413240],[63210,-413240],[63210,-413840],[63710,-413840]],[[59810,-421640],[59810,-421040],[59310,-421040],[59310,-421640],[59810,-421640]],[[59810,-413840],[59810,-413240],[59310,-413240],[59310,-413840],[59810,-413840]],[[55310,-421640],[55310,-421040],[54810,-421040],[54810,-421640],[55310,-421640]],[[55310,-413840],[55310,-413240],[54810,-413240],[54810,-413840],[55310,-413840]],[[50810,-421640],[50810,-421040],[50310,-421040],[50310,-421640],[50810,-421640]],[[46310,-421640],[46310,-421040],[45810,-421040],[45810,-421640],[46310,-421640]],[[41810,-421640],[41810,-421040],[41310,-421040],[41310,-421640],[41810,-421640]],[[37310,-421640],[37310,-421040],[36810,-421040],[36810,-421640],[37310,-421640]],[[93050,-410015],[93050,-410415],[93450,-410415],[93450,-410015],[93050,-410015]],[[99515,-407940],[99515,-407925],[99495,-407925],[99495,-407940],[99480,-407940],[99480,-407990],[98685,-407990],[98685,-410290],[103435,-410290],[103435,-407990],[102640,-407990],[102640,-407940],[102625,-407940],[102625,-407925],[102600,-407925],[102600,-407940],[101635,-407940],[101635,-407925],[101610,-407925],[101610,-407940],[101600,-407940],[101600,-407990],[100520,-407990],[100520,-407940],[100505,-407940],[100505,-407925],[100485,-407925],[100485,-407940],[99515,-407940]]]},label_wcs_mm:[61875,-418390.3309],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-ce838a7c94bd795888":{footprint:{outer:[[82310,-405440],[82160,-405440],[82160,-402740],[91110,-402740],[91110,-405440],[90810,-405440],[90810,-405840],[87410,-405840],[87410,-405440],[86910,-405440],[86910,-405840],[82310,-405840],[82310,-405440]],holes:[]},label_wcs_mm:[86634.99999999999,-404090.00000000006],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-d1294da4ab0c755a50":{footprint:{outer:[[59460,-427740],[59460,-428840],[59310,-428840],[59310,-429440],[59460,-429440],[59460,-435440],[59310,-435440],[59310,-436040],[59460,-436040],[59460,-438790],[59310,-438790],[59310,-438940],[58210,-438940],[58210,-439e3],[58180,-439e3],[58190,-439080],[58150,-439080],[58150,-439140],[57313.3333,-439140],[57310,-439080],[57306.6667,-439140],[56470,-439140],[56470,-439080],[56430,-439080],[56440,-439e3],[56410,-439e3],[56410,-438940],[55310,-438940],[55310,-438790],[55160,-438790],[55160,-436040],[55310,-436040],[55310,-435440],[55160,-435440],[55160,-429440],[55310,-429440],[55310,-428840],[55160,-428840],[55160,-427740],[59460,-427740]],holes:[]},label_wcs_mm:[57310,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-d1cadd763171b898b6":{footprint:{outer:[[143870,-438540],[143870,-438480],[143830,-438480],[143840,-438400],[143810,-438400],[143810,-438340],[142810,-438340],[142810,-433140],[147860,-433140],[147860,-433390],[147920,-433390],[147920,-433420],[148e3,-433410],[148e3,-433450],[148060,-433450],[148060,-434286.6667],[148e3,-434290],[148060,-434293.3333],[148060,-435130],[148e3,-435130],[148e3,-435170],[147920,-435160],[147920,-435190],[147860,-435190],[147860,-438140],[147810,-438140],[147810,-438290],[147660,-438290],[147660,-438340],[145610,-438340],[145610,-438400],[145580,-438400],[145590,-438480],[145550,-438480],[145550,-438540],[144713.3333,-438540],[144710,-438480],[144706.6667,-438540],[143870,-438540]],holes:[[[146410,-436040],[146410,-435440],[145910,-435440],[145910,-436040],[146410,-436040]],[[146445,-435665],[146430,-435710],[146445,-435750],[146465,-435765],[146490,-435770],[146530,-435750],[146550,-435710],[146545,-435685],[146530,-435665],[146490,-435650],[146445,-435665]]]},label_wcs_mm:[144360,-435905],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-d5e104d296af5a109d":{footprint:{outer:[[81960,-428840],[81810,-428840],[81810,-429440],[81960,-429440],[81960,-435440],[81810,-435440],[81810,-436040],[81960,-436040],[81960,-441140],[81810,-441140],[81810,-441340],[77810,-441340],[77810,-441140],[77660,-441140],[77660,-436040],[77810,-436040],[77810,-435440],[77660,-435440],[77660,-429440],[77810,-429440],[77810,-428840],[77660,-428840],[77660,-427740],[81960,-427740],[81960,-428840]],holes:[]},label_wcs_mm:[79810,-432440],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-d5e84488d2a60ad2bd":{footprint:{outer:[[64310,-405440],[64010,-405440],[64010,-402940],[77460,-402940],[77460,-405440],[77310,-405440],[77310,-405840],[73310,-405840],[73310,-405440],[72810,-405440],[72810,-405840],[68810,-405840],[68810,-405440],[68310,-405440],[68310,-405840],[64310,-405840],[64310,-405440]],holes:[]},label_wcs_mm:[70735,-404190],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-d7343d7f36674fb473":{footprint:{outer:[[54960,-427740],[54960,-428840],[54810,-428840],[54810,-429440],[54960,-429440],[54960,-435440],[54810,-435440],[54810,-436040],[54960,-436040],[54960,-438790],[54810,-438790],[54810,-438940],[53710,-438940],[53710,-439e3],[53680,-439e3],[53690,-439080],[53650,-439080],[53650,-439140],[52813.3333,-439140],[52810,-439080],[52806.6667,-439140],[51970,-439140],[51970,-439080],[51930,-439080],[51940,-439e3],[51910,-439e3],[51910,-438940],[50810,-438940],[50810,-429580],[50850,-429560],[50870,-429520],[50865,-429495],[50850,-429475],[50810,-429460],[50810,-427740],[54960,-427740]],holes:[[[50860,-436130],[50865,-436150],[50875,-436170],[50895,-436185],[50940,-436185],[50975,-436150],[50975,-436105],[50960,-436085],[50940,-436075],[50895,-436075],[50875,-436085],[50860,-436130]]]},label_wcs_mm:[52885.00000000001,-432510],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-e2f766ca226508ad5c":{footprint:{outer:[[15960,-414775],[16020,-414775],[16020,-414735],[16100,-414745],[16100,-414715],[16160,-414715],[16160,-413840],[19310,-413840],[19310,-413640],[23310,-413640],[23310,-413840],[23460,-413840],[23460,-421040],[23310,-421040],[23310,-421640],[23460,-421640],[23460,-428840],[23310,-428840],[23310,-429440],[23460,-429440],[23460,-431290],[23310,-431290],[23310,-431790],[19310,-431790],[19310,-431290],[19010,-431290],[19010,-429440],[19310,-429440],[19310,-428840],[18810,-428840],[18810,-429240],[14810,-429240],[14810,-428840],[14310,-428840],[14310,-425490],[14810,-425490],[14810,-424990],[14310,-424990],[14310,-421640],[14810,-421640],[14810,-421040],[14310,-421040],[14310,-417690],[14810,-417690],[14810,-417390],[16160,-417390],[16160,-416515],[16100,-416515],[16100,-416485],[16020,-416495],[16020,-416455],[15960,-416455],[15960,-415618.3333],[16020,-415615],[15960,-415611.6667],[15960,-414775]],holes:[[[19310,-421640],[19310,-421040],[18810,-421040],[18810,-421640],[19310,-421640]],[[19310,-417690],[19310,-417190],[18810,-417190],[18810,-417690],[19310,-417690]],[[19310,-425490],[19310,-424990],[18810,-424990],[18810,-425490],[19310,-425490]]]},label_wcs_mm:[18885,-423315],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-e943ed00bf0c876f93":{footprint:{outer:[[32560,-411025],[32560,-413240],[32310,-413240],[32310,-413440],[28310,-413440],[28310,-413240],[27810,-413240],[27810,-413440],[23810,-413440],[23810,-413240],[23310,-413240],[23310,-413440],[19310,-413440],[19310,-413240],[19160,-413240],[19160,-406040],[19310,-406040],[19310,-405840],[23310,-405840],[23310,-406040],[23810,-406040],[23810,-405840],[27810,-405840],[27810,-406040],[28310,-406040],[28310,-405440],[28160,-405440],[28160,-400340],[28310,-400340],[28310,-399740],[28160,-399740],[28160,-398540],[41610,-398540],[41610,-399740],[41310,-399740],[41310,-400340],[41610,-400340],[41610,-405440],[41310,-405440],[41310,-406040],[41610,-406040],[41610,-411025],[32560,-411025]],holes:[[[37310,-406040],[37310,-405440],[36810,-405440],[36810,-406040],[37310,-406040]],[[37310,-400340],[37310,-399740],[36810,-399740],[36810,-400340],[37310,-400340]],[[32810,-406040],[32810,-405440],[32310,-405440],[32310,-406040],[32810,-406040]],[[32810,-400340],[32810,-399740],[32310,-399740],[32310,-400340],[32810,-400340]]]},label_wcs_mm:[30310.000000000004,-405940],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-ebd64531ea2be379d2":{footprint:{outer:[[81809.097,-441338.1756],[64309.097,-441338.1756],[64309.097,-441138.1756],[64009.097,-441138.1756],[64009.097,-439138.1756],[50809.097,-439138.1756],[50809.097,-440738.1756],[50789.097,-440758.1756],[50789.097,-441538.1756],[32309.097,-441538.1756],[32309.097,-429438.1756],[32809.097,-429438.1756],[32809.097,-429038.1756],[36809.097,-429038.1756],[36809.097,-428838.1756],[38809.097,-428838.1756],[38809.097,-431438.1756],[41609.097,-431438.1756],[41609.097,-429438.1756],[41809.097,-429438.1756],[41809.097,-428838.1756],[41659.097,-428838.1756],[41659.097,-427738.1756],[81959.097,-427738.1756],[81959.097,-429438.1756],[82259.097,-429438.1756],[82159.097,-429438.1758],[82159.097,-441138.1756],[81809.097,-441138.1756],[81809.097,-441338.1756]],holes:[]},label_wcs_mm:[57234.096999999994,-435288.1756],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-f60a5b1f8be1cb66fd":{footprint:{outer:[[109345,-395340],[109345,-395400],[109385,-395400],[109375,-395480],[109405,-395480],[109405,-395540],[110960,-395540],[110960,-396740],[110810,-396740],[110810,-397340],[110960,-397340],[110960,-398540],[115010,-398540],[115010,-402540],[82160,-402540],[82160,-397340],[82310,-397340],[82310,-396740],[82160,-396740],[82160,-395590],[82310,-395590],[82310,-395540],[83705,-395540],[83705,-395480],[83735,-395480],[83725,-395400],[83765,-395400],[83765,-395340],[84605,-395340],[84605,-395400],[84608.3333,-395340],[85445,-395340],[85445,-395400],[85485,-395400],[85475,-395480],[85505,-395480],[85505,-395540],[86910,-395540],[86910,-395590],[87410,-395590],[87410,-395540],[88205,-395540],[88205,-395480],[88235,-395480],[88225,-395400],[88265,-395400],[88265,-395340],[89105,-395340],[89105,-395400],[89108.3333,-395340],[89945,-395340],[89945,-395400],[89985,-395400],[89975,-395480],[90005,-395480],[90005,-395540],[90810,-395540],[90810,-395590],[91310,-395590],[91310,-395540],[92705,-395540],[92705,-395480],[92735,-395480],[92725,-395400],[92765,-395400],[92765,-395340],[93605,-395340],[93605,-395400],[93608.3333,-395340],[94445,-395340],[94445,-395400],[94485,-395400],[94475,-395480],[94505,-395480],[94505,-395540],[95910,-395540],[95910,-395590],[96410,-395590],[96410,-395540],[97705,-395540],[97705,-395480],[97735,-395480],[97725,-395400],[97765,-395400],[97765,-395340],[98605,-395340],[98605,-395400],[98608.3333,-395340],[99445,-395340],[99445,-395400],[99485,-395400],[99475,-395480],[99505,-395480],[99505,-395540],[100810,-395540],[100810,-395590],[101310,-395590],[101310,-395540],[102605,-395540],[102605,-395480],[102635,-395480],[102625,-395400],[102665,-395400],[102665,-395340],[103505,-395340],[103505,-395400],[103508.3333,-395340],[104345,-395340],[104345,-395400],[104385,-395400],[104375,-395480],[104405,-395480],[104405,-395540],[105710,-395540],[105710,-395590],[106210,-395590],[106210,-395540],[107605,-395540],[107605,-395480],[107635,-395480],[107625,-395400],[107665,-395400],[107665,-395340],[108505,-395340],[108505,-395400],[108508.3333,-395340],[109345,-395340]],holes:[[[106210,-397340],[106210,-396740],[105710,-396740],[105710,-397340],[106210,-397340]],[[106310,-401240],[106310,-400640],[105610,-400640],[105610,-401240],[106310,-401240]],[[96510,-401240],[96510,-400640],[95810,-400640],[95810,-401240],[96510,-401240]],[[96410,-397340],[96410,-396740],[95910,-396740],[95910,-397340],[96410,-397340]],[[87410,-397340],[87410,-396740],[86910,-396740],[86910,-397340],[87410,-397340]],[[91310,-397340],[91310,-396740],[90810,-396740],[90810,-397340],[91310,-397340]],[[106230,-396700],[106250,-396660],[106245,-396635],[106230,-396615],[106190,-396600],[106145,-396615],[106130,-396660],[106145,-396700],[106165,-396715],[106190,-396720],[106230,-396700]],[[96430,-396700],[96450,-396660],[96445,-396635],[96430,-396615],[96390,-396600],[96345,-396615],[96330,-396660],[96345,-396700],[96365,-396715],[96390,-396720],[96430,-396700]],[[87430,-396700],[87450,-396660],[87445,-396635],[87430,-396615],[87390,-396600],[87345,-396615],[87330,-396660],[87345,-396700],[87365,-396715],[87390,-396720],[87430,-396700]]]},label_wcs_mm:[98585.00000000001,-399590.00000000006],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_1:region-fe86fde8244771cc88":{footprint:{outer:[[116666.7499,-441490.3352],[116670,-441395],[116630,-441395],[116635,-441355],[116645,-441355],[116645,-441315],[116615,-441315],[116613.75,-441335],[116615,-441285],[116155,-441240],[115700,-441165],[115480,-441115],[115060,-440997.3864],[115060,-440840],[115210,-440840],[115210,-440240],[115060,-440240],[115060,-439340],[115210,-439340],[115210,-438940],[115060,-438940],[115060,-436040],[115210,-436040],[115210,-435440],[115060,-435440],[115060,-429440],[115210,-429440],[115210,-428840],[115060,-428840],[115060,-427740],[120110,-427740],[120110,-428840],[119810,-428840],[119810,-429440],[120110,-429440],[120110,-435440],[119810,-435440],[119810,-436040],[120110,-436040],[120110,-441140],[119810,-441140],[119810,-441379.7153],[118415,-441340],[118414.125,-441375],[118385,-441375],[118380,-441415],[118390,-441415],[118390,-441455],[118350,-441450],[118346.9913,-441538.2557],[117514.974,-441514.5317],[117510,-441425],[117505.0418,-441514.2484],[116666.7499,-441490.3352]],holes:[[[115165,-429560],[115185,-429575],[115210,-429580],[115250,-429560],[115270,-429520],[115265,-429495],[115250,-429475],[115210,-429460],[115165,-429475],[115150,-429520],[115165,-429560]]]},label_wcs_mm:[117585.00000000001,-432510],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"}},openings:[],stair_plan_reservations:[],upper_opening_references:[{source_entity_id:"guanqian-1:floor_1:cad-8821519f54ee28cd7e8e",source_handle:"274E",source_layer:"\u5EFA-\u4E0A\u90E8\u6D1E\u53E3",target_floor_id:null,status:"UPPER_OPENING_REFERENCE; target slab not confirmed; do not cut the current floor"}],walking_surface_verified:!1,surface_status:"SIMULATED_RECONSTRUCTION_WITH_CAD_OPENING_EXCLUSIONS",source_surface_area_m2:6029.436250000005,display_surface_area_m2:6029.436250000005},floor_2:{floor_id:"floor_2",registration:{method:"CAD_SHARED_AXIS_BLOCK",axis_block:"A$C138296ba",source_spatial_id:"guanqian-1:floor_2:cad-450b1318272c624ad836",origin_wcs_mm:[306207.499152335,-445919.6170965723,0],formula:"x=(cad_x-origin_x)/1000; y=display_elevation; z=-(cad_y-origin_y)/1000",physical_verification:"NOT_SURVEYED"},vertical_reference:{floor_elevation_mm:null,floor_to_floor_height_mm:null,clear_height_mm:null,slab_thickness_mm:null,status:"NOT_SURVEYED"},surfaces:[{outer:[[313684.3241,-411809.5966],[313634.3241,-411759.5966],[313684.3241,-411659.5966],[313684.3241,-410609.5966],[313634.3241,-410559.5966],[313684.3241,-410459.5966],[313684.3241,-409409.5966],[313634.3241,-409359.5966],[313684.3241,-409259.5966],[313684.3241,-408209.5966],[313634.3241,-408159.5966],[313684.3241,-408059.5966],[313684.3241,-407009.5966],[313634.3241,-406959.5966],[313684.3241,-406859.5966],[313684.3241,-405809.5966],[313634.3241,-405759.5966],[313684.3241,-405659.5966],[313684.3241,-404609.5966],[313634.3241,-404559.5966],[313684.3241,-404459.5966],[313684.3241,-403409.5966],[313634.3241,-403359.5966],[313684.3241,-403259.5966],[313684.3241,-402209.5966],[313634.3241,-402159.5966],[313684.3241,-402059.5966],[313684.3241,-401009.5966],[313634.3241,-400959.5966],[313684.3241,-400859.5966],[313684.3241,-399809.5966],[313634.3241,-399759.5966],[313684.3241,-399659.5966],[313684.3241,-398609.5966],[313634.3241,-398559.5966],[313684.3241,-398459.5966],[313684.3241,-397409.5966],[313634.3241,-397359.5966],[313684.3241,-397259.5966],[313684.3241,-396409.5966],[315184.3241,-396409.5966],[315234.3241,-396359.5966],[315484.3241,-396359.5966],[315734.3241,-396259.5966],[316084.3241,-395909.5966],[316134.3241,-395759.5966],[356734.3241,-395759.5966],[356784.3241,-395709.5966],[357284.3241,-395659.5966],[357284.3241,-395709.5966],[357634.3241,-396059.5966],[357884.3241,-396159.5966],[358134.3241,-396159.5966],[358184.3241,-396209.5966],[369234.3241,-396209.5966],[369284.3241,-396159.5966],[369534.3241,-396159.5966],[369784.3241,-396059.5966],[370134.3241,-395709.5966],[370284.3241,-395359.5966],[370284.3241,-392459.5966],[370484.3241,-392459.5966],[370734.3241,-392709.5966],[370984.3241,-392809.5966],[371234.3241,-392809.5966],[371284.3241,-392859.5966],[383134.3241,-392859.5966],[383184.3241,-392809.5966],[383434.3241,-392809.5966],[383484.3241,-392759.5966],[383584.3241,-392759.5966],[383934.3241,-392459.5966],[384134.3241,-392459.5966],[384134.3241,-392909.5966],[384284.3241,-393259.5966],[384634.3241,-393609.5966],[384884.3241,-393709.5966],[385134.3241,-393709.5966],[385184.3241,-393759.5966],[421534.3241,-393759.5966],[421784.3241,-393959.5966],[421884.3241,-393959.5966],[421934.3241,-394009.5966],[422184.3241,-394009.5966],[422234.3241,-394059.5966],[425834.3241,-394059.5966],[425884.3241,-394009.5966],[426134.3241,-394009.5966],[426384.3241,-393909.5966],[426734.3241,-393559.5966],[426884.3241,-393209.5966],[426884.3241,-390859.5966],[427084.3241,-390859.5966],[427234.3241,-390959.5966],[427334.3241,-390959.5966],[427384.3241,-391009.5966],[427634.3241,-391009.5966],[427684.3241,-391059.5966],[448484.3241,-391059.5966],[448534.3241,-391009.5966],[448784.3241,-391009.5966],[449084.3241,-390859.5966],[449284.3241,-390859.5966],[449284.3241,-397309.5966],[449334.3241,-397359.5966],[449334.3241,-397459.5966],[449434.3241,-397659.5966],[449784.3241,-398009.5966],[450034.3241,-398109.5966],[450284.3241,-398109.5966],[450334.3241,-398159.5966],[452884.3241,-398159.5966],[453034.3241,-398459.5966],[452884.3241,-398809.5966],[452884.3241,-410809.5966],[453034.3241,-411159.5966],[453384.3241,-411509.5966],[453634.3241,-411609.5966],[453884.3241,-411609.5966],[453934.3241,-411659.5966],[454534.3241,-411659.5966],[454684.3241,-411959.5966],[454534.3241,-412309.5966],[454534.3241,-413409.5966],[454584.3241,-413459.5966],[454534.3241,-413559.5966],[454534.3241,-414609.5966],[454584.3241,-414659.5966],[454534.3241,-414759.5966],[454534.3241,-415809.5966],[454584.3241,-415859.5966],[454534.3241,-415959.5966],[454534.3241,-417009.5966],[454584.3241,-417059.5966],[454534.3241,-417159.5966],[454534.3241,-418209.5966],[454584.3241,-418259.5966],[454534.3241,-418359.5966],[454534.3241,-419409.5966],[454684.3241,-419759.5966],[454534.3241,-420059.5966],[453934.3241,-420059.5966],[453884.3241,-420109.5966],[453634.3241,-420109.5966],[453384.3241,-420209.5966],[453034.3241,-420559.5966],[452884.3241,-420909.5966],[452884.3241,-433809.5966],[453034.3241,-434159.5966],[452884.3241,-434459.5966],[450334.3241,-434459.5966],[450284.3241,-434509.5966],[450034.3241,-434509.5966],[449784.3241,-434609.5966],[449434.3241,-434959.5966],[449334.3241,-435159.5966],[449334.3241,-435259.5966],[449284.3241,-435309.5966],[449284.3241,-441759.5966],[449084.3241,-441759.5966],[448834.3241,-441559.5966],[448734.3241,-441559.5966],[448684.3241,-441509.5966],[448434.3241,-441509.5966],[448384.3241,-441459.5966],[427784.3241,-441459.5966],[427734.3241,-441509.5966],[427484.3241,-441509.5966],[427434.3241,-441559.5966],[427334.3241,-441559.5966],[427084.3241,-441759.5966],[426884.3241,-441759.5966],[426884.3241,-441109.5966],[426834.3241,-441059.5966],[426834.3241,-440959.5966],[426734.3241,-440759.5966],[426284.3241,-440359.5966],[426184.3241,-440359.5966],[426134.3241,-440309.5966],[425884.3241,-440309.5966],[425834.3241,-440259.5966],[425534.3241,-440259.5966],[425484.3241,-440209.5966],[422784.3241,-440159.5966],[422734.3241,-440109.5966],[422484.3241,-440109.5966],[422434.3241,-440059.5966],[422084.3241,-440059.5966],[421734.3241,-439909.5966],[421534.3241,-439909.5966],[421484.3241,-439859.5966],[420934.3241,-439709.5966],[420784.3241,-439609.5966],[420684.3241,-439609.5966],[420084.3241,-439309.5966],[419734.3241,-439059.5966],[419384.3241,-438909.5966],[419234.3241,-438809.5966],[418134.3241,-437709.5966],[417984.3241,-437509.5966],[417934.3241,-437359.5966],[417634.3241,-437009.5966],[417334.3241,-436409.5966],[416984.3241,-435959.5966],[416884.3241,-435759.5966],[416084.3241,-434959.5966],[415884.3241,-434859.5966],[415484.3241,-434509.5966],[415234.3241,-434409.5966],[414984.3241,-434209.5966],[414784.3241,-434159.5966],[414334.3241,-433909.5966],[414234.3241,-433909.5966],[414034.3241,-433809.5966],[413884.3241,-433809.5966],[413834.3241,-433759.5966],[413684.3241,-433759.5966],[413634.3241,-433709.5966],[413484.3241,-433709.5966],[413434.3241,-433659.5966],[412934.3241,-433609.5966],[412884.3241,-433559.5966],[402234.3241,-433559.5966],[402184.3241,-433609.5966],[401684.3241,-433659.5966],[401634.3241,-433709.5966],[401484.3241,-433709.5966],[401434.3241,-433759.5966],[401284.3241,-433759.5966],[401234.3241,-433809.5966],[401084.3241,-433809.5966],[401034.3241,-433859.5966],[400784.3241,-433909.5966],[400434.3241,-434109.5966],[400334.3241,-434109.5966],[399934.3241,-434309.5966],[399684.3241,-434509.5966],[399434.3241,-434609.5966],[399184.3241,-434859.5966],[398984.3241,-434959.5966],[398034.3241,-435959.5966],[397634.3241,-436559.5966],[397384.3241,-437059.5966],[397134.3241,-437359.5966],[397084.3241,-437509.5966],[396934.3241,-437709.5966],[395834.3241,-438809.5966],[395634.3241,-438959.5966],[395284.3241,-439109.5966],[394934.3241,-439359.5966],[394434.3241,-439609.5966],[394334.3241,-439609.5966],[394184.3241,-439709.5966],[393884.3241,-439759.5966],[393734.3241,-439859.5966],[393334.3241,-439909.5966],[392984.3241,-440059.5966],[392634.3241,-440059.5966],[392584.3241,-440109.5966],[392334.3241,-440109.5966],[392284.3241,-440159.5966],[389834.3241,-440209.5966],[389784.3241,-440259.5966],[389534.3241,-440259.5966],[389484.3241,-440309.5966],[389384.3241,-440309.5966],[388934.3241,-440709.5966],[388834.3241,-440909.5966],[388834.3241,-441009.5966],[388784.3241,-441059.5966],[388784.3241,-441759.5966],[388584.3241,-441759.5966],[388334.3241,-441559.5966],[388234.3241,-441559.5966],[388184.3241,-441509.5966],[387934.3241,-441509.5966],[387884.3241,-441459.5966],[371184.3241,-441459.5966],[371134.3241,-441509.5966],[370884.3241,-441509.5966],[370834.3241,-441559.5966],[370734.3241,-441559.5966],[370484.3241,-441759.5966],[370284.3241,-441759.5966],[370284.3241,-439459.5966],[370134.3241,-439109.5966],[369784.3241,-438759.5966],[369534.3241,-438659.5966],[369284.3241,-438659.5966],[369234.3241,-438609.5966],[358334.3241,-438609.5966],[358284.3241,-438659.5966],[358034.3241,-438659.5966],[357784.3241,-438759.5966],[357434.3241,-439109.5966],[357284.3241,-439459.5966],[357284.3241,-441759.5966],[357084.3241,-441759.5966],[356834.3241,-441559.5966],[356734.3241,-441559.5966],[356684.3241,-441509.5966],[356434.3241,-441509.5966],[356384.3241,-441459.5966],[339684.3241,-441459.5966],[339634.3241,-441509.5966],[339384.3241,-441509.5966],[339334.3241,-441559.5966],[339234.3241,-441559.5966],[338984.3241,-441759.5966],[338784.3241,-441759.5966],[338784.3241,-431359.5966],[338634.3241,-431009.5966],[338284.3241,-430659.5966],[338034.3241,-430559.5966],[337784.3241,-430559.5966],[337734.3241,-430509.5966],[320484.3241,-430509.5966],[320484.3241,-428709.5966],[320334.3241,-428359.5966],[319984.3241,-428009.5966],[319734.3241,-427909.5966],[319484.3241,-427909.5966],[319434.3241,-427859.5966],[318684.3241,-427859.5966],[318684.3241,-419459.5966],[319434.3241,-419459.5966],[319484.3241,-419409.5966],[319734.3241,-419409.5966],[319784.3241,-419359.5966],[319884.3241,-419359.5966],[320334.3241,-418959.5966],[320434.3241,-418759.5966],[320434.3241,-418659.5966],[320484.3241,-418609.5966],[320484.3241,-415309.5966],[320684.3241,-415259.5966],[321084.3241,-414859.5966],[321184.3241,-414659.5966],[321184.3241,-414559.5966],[321234.3241,-414509.5966],[321234.3241,-413709.5966],[321184.3241,-413659.5966],[321184.3241,-413559.5966],[321084.3241,-413359.5966],[320734.3241,-413009.5966],[320484.3241,-412909.5966],[320234.3241,-412909.5966],[320184.3241,-412859.5966],[316134.3241,-412859.5966],[315934.3241,-412709.5966],[315834.3241,-412709.5966],[315784.3241,-412659.5966],[315534.3241,-412659.5966],[315484.3241,-412609.5966],[313684.3241,-412609.5966],[313684.3241,-411809.5966]],holes:[[[345341.8241,-422383.5896],[345341.8241,-412839.5966],[344146.8241,-412839.5966],[344146.8241,-422383.5896],[344244.3241,-422383.5896],[344244.3241,-420753.5896],[344244.3241,-420528.8996],[344244.3241,-420180.6855],[344244.3241,-419730.6855],[344244.3241,-419280.6855],[344244.3241,-418830.6855],[344244.3241,-418380.6855],[344244.3241,-417930.6855],[344244.3241,-417480.6855],[344244.3241,-417030.6855],[344244.3241,-416580.6855],[344244.3241,-416130.6855],[344244.3241,-415765.622],[344244.3241,-415349.5966],[344244.3241,-414899.5966],[344244.3241,-414749.5966],[344744.3241,-414749.5966],[345244.3241,-414749.5966],[345244.3241,-414899.5966],[345244.3241,-415349.5966],[345244.3241,-415765.622],[345244.3241,-416130.6855],[345244.3241,-416580.6855],[345244.3241,-417030.6855],[345244.3241,-417480.6855],[345244.3241,-417930.6855],[345244.3241,-418380.6855],[345244.3241,-418830.6855],[345244.3241,-419280.6855],[345244.3241,-419730.6855],[345244.3241,-420180.6855],[345244.3241,-420528.8996],[345244.3241,-420753.5896],[345244.3241,-422383.5896],[345341.8241,-422383.5896]],[[347036.8241,-422383.5896],[347036.8241,-412839.5966],[345841.8241,-412839.5966],[345841.8241,-422383.5896],[345939.3241,-422383.5896],[345939.3241,-420753.5896],[345939.3241,-420528.8996],[345939.3241,-420180.6855],[345939.3241,-419730.6855],[345939.3241,-419280.6855],[345939.3241,-418830.6855],[345939.3241,-418380.6855],[345939.3241,-417930.6855],[345939.3241,-417480.6855],[345939.3241,-417030.6855],[345939.3241,-416580.6855],[345939.3241,-416130.6855],[345939.3241,-415765.622],[345939.3241,-415349.5966],[345939.3241,-414899.5966],[345939.3241,-414749.5966],[346439.3241,-414749.5966],[346939.3241,-414749.5966],[346939.3241,-414899.5966],[346939.3241,-415349.5966],[346939.3241,-415765.622],[346939.3241,-416130.6855],[346939.3241,-416580.6855],[346939.3241,-417030.6855],[346939.3241,-417480.6855],[346939.3241,-417930.6855],[346939.3241,-418380.6855],[346939.3241,-418830.6855],[346939.3241,-419280.6855],[346939.3241,-419730.6855],[346939.3241,-420180.6855],[346939.3241,-420528.8996],[346939.3241,-420753.5896],[346939.3241,-422383.5896],[347036.8241,-422383.5896]],[[399726.8241,-419192.034],[399726.8241,-409219.5966],[398531.8241,-409219.5966],[398531.8241,-419192.034],[398629.3241,-419192.034],[398629.3241,-417562.034],[398629.3241,-417443.1229],[398629.3241,-417010.6855],[398629.3241,-416560.6855],[398629.3241,-416110.6855],[398629.3241,-415660.6855],[398629.3241,-415210.6855],[398629.3241,-414760.6855],[398629.3241,-414310.6855],[398629.3241,-413860.6855],[398629.3241,-413410.6855],[398629.3241,-412960.6855],[398629.3241,-412510.6855],[398629.3241,-412145.622],[398629.3241,-411729.5966],[398629.3241,-411279.5966],[398629.3241,-411129.5966],[399129.3241,-411129.5966],[399629.3241,-411129.5966],[399629.3241,-411279.5966],[399629.3241,-411729.5966],[399629.3241,-412145.622],[399629.3241,-412510.6855],[399629.3241,-412960.6855],[399629.3241,-413410.6855],[399629.3241,-413860.6855],[399629.3241,-414310.6855],[399629.3241,-414760.6855],[399629.3241,-415210.6855],[399629.3241,-415660.6855],[399629.3241,-416110.6855],[399629.3241,-416560.6855],[399629.3241,-417010.6855],[399629.3241,-417443.1229],[399629.3241,-417562.034],[399629.3241,-419192.034],[399726.8241,-419192.034]],[[401324.3241,-419192.034],[401421.8241,-419192.034],[401421.8241,-409219.5966],[400226.8241,-409219.5966],[400226.8241,-419192.034],[400324.3241,-419192.034],[400324.3241,-417562.034],[400324.3241,-417443.1229],[400324.3241,-417010.6855],[400324.3241,-416560.6855],[400324.3241,-416110.6855],[400324.3241,-415660.6855],[400324.3241,-415210.6855],[400324.3241,-414760.6855],[400324.3241,-414310.6855],[400324.3241,-413860.6855],[400324.3241,-413410.6855],[400324.3241,-412960.6855],[400324.3241,-412510.6855],[400324.3241,-412145.622],[400324.3241,-411729.5966],[400324.3241,-411279.5966],[400324.3241,-411129.5966],[400824.3241,-411129.5966],[401324.3241,-411129.5966],[401324.3241,-411279.5966],[401324.3241,-411729.5966],[401324.3241,-412145.622],[401324.3241,-412510.6855],[401324.3241,-412960.6855],[401324.3241,-413410.6855],[401324.3241,-413860.6855],[401324.3241,-414310.6855],[401324.3241,-414760.6855],[401324.3241,-415210.6855],[401324.3241,-415660.6855],[401324.3241,-416110.6855],[401324.3241,-416560.6855],[401324.3241,-417010.6855],[401324.3241,-417443.1229],[401324.3241,-417562.034],[401324.3241,-419192.034]],[[414955,-420285],[414975,-420150],[414985,-420010],[414985,-407810],[414975,-407665],[414955,-407525],[414875,-407265],[414804.401,-407122.5874],[414745,-407025],[414665,-406920],[414575,-406820],[414475,-406730],[414365,-406650],[414250,-406580],[414130,-406520],[414e3,-406475],[413865,-406440],[413725,-406415],[410060,-406410],[410060,-407960],[409910,-407960],[409910,-408610],[410060,-408610],[410060,-408860],[405010,-408860],[405010,-408610],[405160,-408610],[405160,-407960],[405010,-407960],[405010,-406410],[403170,-406410],[403025,-406415],[402885,-406440],[402755,-406475],[402625,-406520],[402500,-406580],[402385,-406650],[402280,-406730],[402180,-406820],[402090,-406920],[402010,-407025],[401940,-407140],[401880,-407265],[401830,-407395],[401775,-407665],[401770,-407810],[401770,-419190],[401620,-419190],[401620,-419770],[400085,-419770],[400090,-420155],[400145,-420425],[400195,-420555],[400255,-420675],[400325,-420790],[400405,-420900],[400495,-421e3],[400595,-421090],[400700,-421170],[400815,-421240],[400940,-421300],[401070,-421345],[401200,-421380],[401375.3381,-421402.4371],[401485,-421410],[413585,-421410],[413725,-421405],[413860,-421380],[413990,-421350],[414120,-421305],[414245,-421245],[414360,-421175],[414470,-421095],[414575,-421e3],[414750,-420785],[414820,-420670],[414880,-420545],[414925,-420415],[414955,-420285]]]}],region_picking_proxies:{"guanqian-1:floor_2:region-1145a31d91e42a918e":{footprint:{outer:[[320484.3241,-428709.5966],[320484.3241,-418609.5966],[320484.3241,-415309.5966],[322434.3241,-415309.5966],[322434.3241,-412529.5966],[313704.3241,-412529.5966],[313704.3241,-396459.5966],[330134.3241,-396459.5966],[330134.3241,-430509.5966],[320484.3241,-430509.5966],[320484.3241,-428709.5966]],holes:[]},label_wcs_mm:[326284.3241,-413919.5966],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-1d301b1efddf602253":{footprint:{outer:[[417505,-419360],[417265,-419360],[417245,-419365],[417215,-419390],[417190,-419420],[417185,-419440],[417190,-420100],[417215,-420130],[417265,-420160],[417505,-420160],[417505,-423260],[417265,-423260],[417245,-423265],[417215,-423290],[417190,-423320],[417185,-423340],[417185,-423630],[412885,-423630],[412885,-423360],[412870,-423305],[412840,-423275],[412805,-423260],[412045,-423265],[412e3,-423305],[411985,-423340],[411985,-423630],[403085,-423630],[403085,-423360],[403070,-423305],[403040,-423275],[403005,-423260],[402245,-423265],[402200,-423305],[402185,-423340],[402185,-423630],[397885,-423630],[397885,-423360],[397870,-423305],[397840,-423275],[397805,-423260],[397565,-423260],[397565,-420160],[397805,-420160],[397840,-420145],[397870,-420115],[397885,-420060],[397885,-419460],[397870,-419405],[397840,-419375],[397805,-419360],[397565,-419360],[397565,-412360],[397685,-412360],[397685,-418660],[398335,-418660],[398335,-419770],[399835,-419770],[399835,-420095],[399855,-420260],[399885,-420420],[399965,-420650],[400035,-420795],[400115,-420930],[400210,-421060],[400435,-421285],[400560,-421380],[400840,-421530],[401070,-421610],[401315,-421650],[401485,-421660],[413585,-421660],[413755,-421650],[413995,-421610],[414225,-421530],[414370,-421460],[414505,-421380],[414635,-421285],[414750,-421175],[414860,-421060],[414955,-420930],[415035,-420795],[415105,-420650],[415160,-420500],[415200,-420340],[415225,-420180],[415235,-420010],[415235,-419770],[416735,-419770],[416735,-418660],[417385,-418660],[417385,-412360],[417505,-412360],[417505,-419360]],holes:[]},label_wcs_mm:[397625,-415510],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-2b4b9bbdb2dd542b95":{footprint:{outer:[[357085,-396460],[330535,-396460],[330535,-396260],[316115,-396260],[316115,-395817.5689],[316134.1896,-395760],[357085,-395760],[357085,-396460]],holes:[]},label_wcs_mm:[336600,-396038.78445],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-45fc60be98b1e8d3b9":{footprint:{outer:[[452684.3241,-421859.5966],[449084.3241,-421859.5966],[449084.3241,-420059.5966],[448784.3241,-420059.5966],[448784.3241,-419859.5966],[449084.3241,-419859.5966],[449084.3241,-411659.5966],[453934.3241,-411659.5966],[454534.3241,-411659.5966],[454534.3241,-412309.5966],[454534.3241,-413409.5966],[454534.3241,-413559.5966],[454534.3241,-414609.5966],[454534.3241,-414759.5966],[454534.3241,-415809.5966],[454534.3241,-415959.5966],[454534.3241,-417009.5966],[454534.3241,-417159.5966],[454534.3241,-418209.5966],[454534.3241,-418359.5966],[454534.3241,-419409.5966],[454534.3241,-420059.5966],[453934.3241,-420059.5966],[452684.3241,-420059.5966],[452684.3241,-421859.5966]],holes:[]},label_wcs_mm:[451809.3241,-416484.59660000005],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-4942e4d2c08e6d25c0":{footprint:{outer:[[383934.3241,-404459.5966],[383934.3241,-395159.5966],[388784.3241,-395159.5966],[388784.3241,-402609.5966],[389434.3241,-402609.5966],[389434.3241,-404059.5966],[388784.3241,-404059.5966],[388784.3241,-404459.5966],[383934.3241,-404459.5966]],holes:[]},label_wcs_mm:[386359.3241,-398884.5966],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-51395fd532b6f5b6e2":{footprint:{outer:[[316485,-398760],[316485,-400560],[316495,-400560],[316495,-400590],[316575,-400580],[316575,-400620],[317302.3333,-400620],[317290,-400725],[317245,-400865],[317215,-400930],[317140,-401045],[317040,-401145],[316920,-401220],[316790,-401275],[316720,-401295],[316575,-401310],[316650,-401315],[316790,-401340],[316860,-401365],[317040,-401475],[317140,-401575],[317215,-401690],[317245,-401755],[317290,-401890],[317302.3333,-402e3],[316575,-402e3],[316575,-402040],[316495,-402030],[316495,-402060],[316485,-402060],[316485,-403860],[316285,-403860],[316285,-404110],[314035,-404110],[314035,-396760],[316485,-396760],[316485,-398160],[316285,-398160],[316285,-398760],[316485,-398760]],holes:[]},label_wcs_mm:[315260,-399659.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-51c120dd32a6615719":{footprint:{outer:[[402185,-404190],[402185,-404480],[402190,-404500],[402215,-404530],[402265,-404560],[403005,-404560],[403055,-404530],[403075,-404500],[403085,-404460],[403085,-404190],[411985,-404190],[411985,-404480],[411990,-404500],[412015,-404530],[412065,-404560],[412805,-404560],[412855,-404530],[412875,-404500],[412885,-404460],[412885,-404190],[417185,-404190],[417185,-404480],[417190,-404500],[417215,-404530],[417265,-404560],[417505,-404560],[417505,-411560],[417385,-411560],[417385,-407710],[415235,-407710],[415225,-407505],[415205,-407355],[415165,-407215],[415115,-407075],[415055,-406945],[414980,-406820],[414890,-406705],[414795,-406600],[414690,-406500],[414575,-406415],[414450,-406340],[414320,-406275],[414180,-406225],[413890,-406165],[413735,-406160],[409910,-406160],[409910,-406210],[413840,-406215],[414130,-406275],[414270,-406325],[414400,-406390],[414525,-406465],[414640,-406550],[414745,-406650],[414840,-406755],[414930,-406870],[415005,-406995],[415065,-407125],[415155,-407405],[415175,-407555],[415185,-407710],[415185,-409940],[414985,-409940],[414985,-407810],[414975,-407665],[414955,-407525],[414920,-407395],[414875,-407265],[414815,-407140],[414745,-407025],[414665,-406920],[414575,-406820],[414475,-406730],[414365,-406650],[414250,-406580],[414130,-406520],[414e3,-406475],[413865,-406440],[413725,-406415],[413585,-406410],[410060,-406410],[410060,-406360],[409100,-406360],[409100,-406345],[409075,-406345],[409075,-406610],[408110,-406610],[408110,-406345],[408085,-406345],[408085,-406360],[406980,-406360],[406980,-406345],[406960,-406345],[406960,-406610],[405990,-406610],[405990,-406345],[405970,-406345],[405970,-406360],[405010,-406360],[405010,-406410],[403170,-406410],[403025,-406415],[402885,-406440],[402755,-406475],[402625,-406520],[402500,-406580],[402385,-406650],[402280,-406730],[402180,-406820],[402090,-406920],[402010,-407025],[401940,-407140],[401880,-407265],[401830,-407395],[401775,-407665],[401770,-407810],[401770,-419190],[401620,-419190],[401620,-408640],[401580,-408640],[401580,-407680],[401585,-407600],[401610,-407450],[401650,-407300],[401700,-407160],[401765,-407025],[401840,-406900],[401930,-406780],[402030,-406670],[402140,-406570],[402385,-406405],[402520,-406340],[402660,-406290],[402810,-406250],[403040,-406220],[405160,-406220],[405160,-406170],[403040,-406170],[402800,-406200],[402645,-406240],[402500,-406295],[402360,-406360],[402230,-406440],[402110,-406535],[401995,-406635],[401890,-406750],[401800,-406870],[401720,-407e3],[401655,-407140],[401600,-407285],[401560,-407440],[401530,-407680],[401530,-408640],[400030,-408640],[400030,-414666.8473],[399925,-414700.468],[399925,-408640],[398335,-408640],[398335,-409740],[397685,-409740],[397685,-411560],[397565,-411560],[397565,-404560],[397805,-404560],[397840,-404545],[397870,-404515],[397885,-404460],[397885,-404190],[402185,-404190]],holes:[]},label_wcs_mm:[401695,-413113.42365],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-5c7947d3815fc34755":{footprint:{outer:[[330135,-427860],[330285,-427860],[330285,-427260],[330135,-427260],[330135,-420060],[330285,-420060],[330285,-419460],[330135,-419460],[330135,-412260],[330285,-412260],[330285,-412060],[334285,-412060],[334285,-412260],[334785,-412260],[334785,-412060],[338785,-412060],[338785,-412260],[339285,-412260],[339285,-411660],[339135,-411660],[339135,-409460],[356935,-409460],[356935,-411660],[356785,-411660],[356785,-412260],[356935,-412260],[356935,-419460],[356785,-419460],[356785,-420060],[356935,-420060],[356935,-427260],[356785,-427260],[356785,-427860],[356935,-427860],[356935,-428060],[356995,-428060],[356995,-428080],[356015,-428080],[356015,-428120],[356035,-428275],[356090,-428460],[356180,-428630],[356300,-428775],[356445,-428890],[356615,-428985],[356795,-429040],[356995,-429060],[356795,-429080],[356615,-429135],[356445,-429225],[356300,-429345],[356180,-429490],[356090,-429660],[356035,-429840],[356015,-430040],[356995,-430040],[356995,-430060],[356935,-430060],[356935,-433860],[356785,-433860],[356785,-434460],[357085,-434460],[357085,-439560],[356785,-439560],[356785,-440160],[357085,-440160],[357085,-441260],[338985,-441260],[338985,-440160],[339285,-440160],[339285,-439560],[338985,-439560],[338985,-434460],[339285,-434460],[339285,-433860],[338985,-433860],[338985,-430210],[339285,-430210],[339285,-429710],[338985,-429710],[338985,-427860],[339285,-427860],[339285,-427260],[338785,-427260],[338785,-427660],[338185,-427660],[338185,-429810],[338785,-429810],[338785,-430210],[334785,-430210],[334785,-429710],[334285,-429710],[334285,-430210],[330285,-430210],[330285,-429710],[330135,-429710],[330135,-427860]],holes:[[[352785,-440160],[352785,-439560],[352285,-439560],[352285,-440160],[352785,-440160]],[[352785,-434460],[352785,-433860],[352285,-433860],[352285,-434460],[352785,-434460]],[[352785,-427860],[352785,-427260],[352285,-427260],[352285,-427860],[352785,-427860]],[[352785,-420060],[352785,-419460],[352285,-419460],[352285,-420060],[352785,-420060]],[[352785,-412260],[352785,-411660],[352285,-411660],[352285,-412260],[352785,-412260]],[[348285,-440160],[348285,-439560],[347785,-439560],[347785,-440160],[348285,-440160]],[[348285,-434460],[348285,-433860],[348085,-433860],[348085,-429860],[346905,-429860],[346905,-429920],[346875,-429920],[346885,-43e4],[346845,-43e4],[346845,-430727.3333],[346735,-430715],[346665,-430695],[346535,-430640],[346420,-430565],[346320,-430465],[346240,-430350],[346185,-430215],[346160,-430075],[346155,-43e4],[346140,-430145],[346120,-430215],[346065,-430350],[345990,-430465],[345890,-430565],[345710,-430670],[345570,-430715],[345465,-430727.3333],[345465,-43e4],[345425,-43e4],[345435,-429920],[345405,-429920],[345405,-429860],[343485,-429860],[343485,-433860],[343285,-433860],[343285,-434460],[343485,-434460],[343485,-436660],[348085,-436660],[348085,-434460],[348285,-434460]],[[348285,-427860],[348285,-427260],[348035,-427260],[348035,-423810],[348185,-423810],[348185,-423510],[348065,-423510],[348065,-420060],[348285,-420060],[348285,-419460],[348065,-419460],[348065,-412260],[348285,-412260],[348285,-411660],[347785,-411660],[347785,-411930],[343785,-411930],[343785,-411660],[343285,-411660],[343285,-412260],[343505,-412260],[343505,-419460],[343285,-419460],[343285,-420060],[343505,-420060],[343505,-423510],[343385,-423510],[343385,-423810],[343535,-423810],[343535,-427260],[343285,-427260],[343285,-427860],[343785,-427860],[343785,-427560],[347785,-427560],[347785,-427860],[348285,-427860]],[[343785,-440160],[343785,-439560],[343285,-439560],[343285,-440160],[343785,-440160]],[[339285,-420060],[339285,-419460],[338785,-419460],[338785,-420060],[339285,-420060]],[[334785,-427860],[334785,-427260],[334285,-427260],[334285,-427860],[334785,-427860]],[[334785,-420060],[334785,-419460],[334285,-419460],[334285,-420060],[334785,-420060]],[[352740,-440265],[352775,-440280],[352810,-440265],[352825,-440230],[352810,-440195],[352775,-440180],[352740,-440195],[352725,-440230],[352740,-440265]],[[334240,-427895],[334225,-427940],[334240,-427980],[334260,-427995],[334285,-428e3],[334310,-427995],[334335,-427970],[334345,-427940],[334340,-427915],[334325,-427895],[334285,-427880],[334240,-427895]],[[339170,-440215],[339155,-440195],[339115,-440180],[339070,-440195],[339055,-440240],[339070,-440280],[339090,-440295],[339115,-440300],[339140,-440295],[339170,-440265],[339170,-440215]],[[357010,-440215],[356995,-440195],[356955,-440180],[356910,-440195],[356895,-440240],[356910,-440280],[356930,-440295],[356955,-440300],[356980,-440295],[357010,-440265],[357010,-440215]]]},label_wcs_mm:[336835.00000000006,-425534.99999999994],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-5ebafe4b84720b4a9b":{footprint:{outer:[[370484.3241,-392859.5966],[371284.3241,-392859.5966],[383134.3241,-392859.5966],[383934.3241,-392859.5966],[383934.3241,-395159.5966],[370484.3241,-395159.5966],[370484.3241,-392859.5966]],holes:[]},label_wcs_mm:[377209.3241,-394009.5966],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-5f8a5b0e28bb712487":{footprint:{outer:[[361535,-404460],[361535,-407460],[361435,-407460],[361435,-408160],[361535,-408160],[361535,-409160],[361435,-409160],[361435,-409260],[359715,-409260],[359715,-408590],[359570,-408605],[359500,-408620],[359435,-408645],[359310,-408715],[359200,-408805],[359110,-408910],[359075,-408970],[359045,-409035],[359e3,-409170],[358989,-409260],[358955,-409105],[358900,-408970],[358865,-408910],[358775,-408805],[358665,-408715],[358540,-408645],[358475,-408620],[358295,-408590],[358255,-408590],[358255,-409260],[352635,-409260],[352635,-404460],[357285,-404460],[357285,-401960],[358060,-401960],[358060,-401975],[358085,-401975],[358085,-401665],[358055,-401665],[358055,-401690],[358015,-401690],[357950,-401760],[357285,-401760],[357285,-401480],[357345,-401480],[357345,-401210],[357580,-401210],[357580,-401150],[357285,-401150],[357285,-400075],[357580,-400075],[357580,-400015],[357345,-400015],[357345,-399745],[357285,-399745],[357285,-399460],[359685,-399460],[359685,-400415],[359645,-400415],[359645,-400495],[359610,-400495],[359610,-400730],[359645,-400730],[359645,-400810],[359685,-400810],[359685,-401760],[359550,-401760],[359480,-401690],[359445,-401690],[359445,-401665],[359415,-401665],[359415,-401975],[359440,-401975],[359440,-401960],[359685,-401960],[359685,-402283],[359550,-402300],[359370,-402355],[359285,-402395],[359210,-402445],[359065,-402560],[358950,-402705],[358900,-402780],[358860,-402865],[358825,-402955],[358805,-403045],[358790,-403140],[358785,-403240],[359685,-403240],[359685,-404460],[361535,-404460]],holes:[[[357600,-401075],[357600,-400810],[357640,-400810],[357640,-400730],[357670,-400730],[357670,-400495],[357640,-400495],[357640,-400415],[357600,-400415],[357600,-400150],[357375,-400150],[357375,-401075],[357600,-401075]],[[358010,-401625],[358010,-401660],[358745,-401660],[358745,-401625],[358010,-401625]],[[358750,-401660],[359490,-401660],[359490,-401625],[358750,-401625],[358750,-401660]],[[357750,-399655],[357750,-401560],[359535,-401560],[359535,-399655],[357750,-399655]]]},label_wcs_mm:[358485,-403850],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-6907f997211fee11cd":{footprint:{outer:[[330135,-404460],[330285,-404460],[330285,-403860],[330135,-403860],[330135,-398760],[330285,-398760],[330285,-398160],[330135,-398160],[330135,-396760],[357085,-396760],[357085,-398160],[352285,-398160],[352285,-398760],[352435,-398760],[352435,-399560],[351635,-399560],[351635,-401160],[350235,-401160],[350235,-404210],[350535,-404210],[350535,-404150],[350555,-404150],[350555,-405110],[350750,-405090],[350930,-405035],[351090,-404945],[351235,-404830],[351350,-404685],[351440,-404525],[351495,-404345],[351510,-404250],[351515,-404150],[351535,-404150],[351535,-404210],[352285,-404210],[352285,-404460],[352435,-404460],[352435,-409260],[338935,-409260],[338935,-411660],[338785,-411660],[338785,-411860],[334785,-411860],[334785,-411660],[334285,-411660],[334285,-411860],[330285,-411860],[330285,-411660],[330135,-411660],[330135,-404460]],holes:[[[348285,-404460],[348285,-403860],[347785,-403860],[347785,-404460],[348285,-404460]],[[348285,-398760],[348285,-398160],[347785,-398160],[347785,-398760],[348285,-398760]],[[343785,-404460],[343785,-403860],[343285,-403860],[343285,-404460],[343785,-404460]],[[343785,-398760],[343785,-398160],[343285,-398160],[343285,-398760],[343785,-398760]],[[339285,-404460],[339285,-403860],[338785,-403860],[338785,-404460],[339285,-404460]],[[339285,-398760],[339285,-398160],[338785,-398160],[338785,-398760],[339285,-398760]],[[334785,-404460],[334785,-403860],[334285,-403860],[334285,-404460],[334785,-404460]],[[334785,-398760],[334785,-398160],[334285,-398160],[334285,-398760],[334785,-398760]],[[334250,-398865],[334285,-398880],[334320,-398865],[334335,-398830],[334320,-398795],[334285,-398780],[334250,-398795],[334235,-398830],[334250,-398865]],[[334305,-403835],[334335,-403805],[334340,-403780],[334335,-403755],[334320,-403735],[334280,-403720],[334235,-403735],[334220,-403780],[334235,-403820],[334255,-403835],[334305,-403835]]]},label_wcs_mm:[332285,-404297.5],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-a06d3928a968ae034b":{footprint:{outer:[[370785,-404460],[370785,-403860],[370485,-403860],[370485,-395760],[370785,-395760],[370785,-395360],[374785,-395360],[374785,-395760],[375285,-395760],[375285,-395360],[379285,-395360],[379285,-395760],[379785,-395760],[379785,-395360],[383785,-395360],[383785,-395760],[383935,-395760],[383935,-403860],[383785,-403860],[383785,-404460],[379785,-404460],[379785,-403860],[379285,-403860],[379285,-404460],[375285,-404460],[375285,-403860],[374785,-403860],[374785,-404460],[370785,-404460]],holes:[]},label_wcs_mm:[377210.00000000006,-399810],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-b5cbd49831c15f1099":{footprint:{outer:[[370485,-395160],[370485,-392860],[383935,-392860],[383935,-395160],[370485,-395160]],holes:[[[370720,-393655],[370705,-393635],[370665,-393620],[370620,-393635],[370605,-393680],[370620,-393720],[370640,-393735],[370665,-393740],[370690,-393735],[370720,-393705],[370720,-393655]]]},label_wcs_mm:[377210.00000000006,-394450.00000000006],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-beeea32f7e22022786":{footprint:{outer:[[329935,-427860],[329935,-429710],[329785,-429710],[329785,-430210],[325785,-430210],[325785,-429710],[325285,-429710],[325285,-430210],[320785,-430210],[320785,-427860],[321285,-427860],[321285,-427260],[320785,-427260],[320785,-423910],[321285,-423910],[321285,-423410],[320785,-423410],[320785,-420060],[321285,-420060],[321285,-419460],[320785,-419460],[320785,-416110],[321285,-416110],[321285,-415810],[322635,-415810],[322635,-412260],[321285,-412260],[321285,-411660],[320785,-411660],[320785,-412260],[316785,-412260],[316785,-411660],[316585,-411660],[316585,-408810],[316575,-408810],[316575,-408790],[317305,-408790],[317305,-408750],[317290,-408640],[317245,-408505],[317215,-408440],[317140,-408325],[317040,-408225],[316860,-408115],[316790,-408090],[316650,-408065],[316575,-408060],[316720,-408045],[316860,-408e3],[317040,-407895],[317140,-407795],[317215,-407680],[317270,-407545],[317290,-407475],[317305,-407330],[316575,-407330],[316575,-407310],[316585,-407310],[316585,-404460],[316785,-404460],[316785,-403860],[316585,-403860],[316585,-402060],[316575,-402060],[316575,-402040],[317305,-402040],[317305,-402e3],[317290,-401890],[317245,-401755],[317215,-401690],[317140,-401575],[317040,-401475],[316860,-401365],[316790,-401340],[316650,-401315],[316575,-401310],[316720,-401295],[316860,-401250],[317040,-401145],[317140,-401045],[317215,-400930],[317270,-400795],[317290,-400725],[317305,-400580],[316575,-400580],[316575,-400560],[316585,-400560],[316585,-398760],[316785,-398760],[316785,-398160],[316585,-398160],[316585,-396760],[329935,-396760],[329935,-398160],[329785,-398160],[329785,-398760],[329935,-398760],[329935,-403860],[329785,-403860],[329785,-404460],[329935,-404460],[329935,-411660],[329785,-411660],[329785,-411860],[325785,-411860],[325785,-411660],[325285,-411660],[325285,-412260],[325785,-412260],[325785,-412060],[329785,-412060],[329785,-412260],[329935,-412260],[329935,-419460],[329785,-419460],[329785,-420060],[329935,-420060],[329935,-427260],[329785,-427260],[329785,-427860],[329935,-427860]],holes:[[[325785,-427860],[325785,-427260],[325285,-427260],[325285,-427860],[325785,-427860]],[[325785,-420060],[325785,-419460],[325285,-419460],[325285,-420060],[325785,-420060]],[[325785,-404460],[325785,-403860],[325285,-403860],[325285,-404460],[325785,-404460]],[[325785,-398760],[325785,-398160],[325285,-398160],[325285,-398760],[325785,-398760]],[[321285,-398760],[321285,-398160],[320785,-398160],[320785,-398760],[321285,-398760]],[[321285,-404460],[321285,-403860],[320785,-403860],[320785,-404460],[321285,-404460]],[[325785,-416110],[325785,-415610],[325285,-415610],[325285,-416110],[325785,-416110]],[[325785,-423910],[325785,-423410],[325285,-423410],[325285,-423910],[325785,-423910]],[[320750,-398865],[320785,-398880],[320820,-398865],[320835,-398830],[320820,-398795],[320785,-398780],[320750,-398795],[320735,-398830],[320750,-398865]],[[316750,-403795],[316785,-403810],[316820,-403795],[316835,-403760],[316820,-403725],[316785,-403710],[316750,-403725],[316735,-403760],[316750,-403795]]]},label_wcs_mm:[326284.99999999994,-413935],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-db73a678d78e3a0f2e":{footprint:{outer:[[426884.3241,-393209.5966],[426884.3241,-391059.5966],[427684.3241,-391059.5966],[431134.3241,-391059.5966],[431134.3241,-400862.0966],[421378.0741,-400859.5966],[421390.5741,-397209.5966],[421409.3241,-397209.5966],[421384.3241,-394079.5966],[426884.3241,-394079.5966],[426884.3241,-393209.5966]],holes:[]},label_wcs_mm:[426265.57409999997,-395644.5966],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-f514fd87670396d4dd":{footprint:{outer:[[316485,-404460],[316485,-407310],[316495,-407310],[316495,-407340],[316575,-407330],[316575,-407370],[317302.3333,-407370],[317290,-407475],[317245,-407615],[317215,-407680],[317140,-407795],[317040,-407895],[316920,-407970],[316790,-408025],[316720,-408045],[316575,-408060],[316650,-408065],[316790,-408090],[316860,-408115],[317040,-408225],[317140,-408325],[317215,-408440],[317245,-408505],[317290,-408640],[317302.3333,-408750],[316575,-408750],[316575,-408790],[316495,-408780],[316495,-408810],[316485,-408810],[316485,-411660],[316285,-411660],[316285,-412260],[314035,-412260],[314035,-404210],[316285,-404210],[316285,-404460],[316485,-404460]],holes:[]},label_wcs_mm:[315562.5,-408275],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"},"guanqian-1:floor_2:region-fdb8568037fc0d92fd":{footprint:{outer:[[361484.3241,-398159.5966],[366084.3241,-398159.5966],[366084.3241,-396229.5966],[370484.3241,-396229.5966],[370484.3241,-404459.5966],[361534.3241,-404459.5966],[361534.3241,-399259.5966],[361484.3241,-399259.5966],[361484.3241,-398159.5966]],holes:[]},label_wcs_mm:[366009.3241000001,-401859.59660000005],status:"CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area"}},openings:[{spatial_id:"floor_2:opening:189F",floor_id:"floor_2",source_entity_id:"guanqian-1:floor_2:cad-27530b85128aec50291c",source_handle:"189F",source_layer:"\u5EFA-\u5B54",boundary_region_ids:["guanqian-1:floor_2:region-029b102738577cb2bb","guanqian-1:floor_2:region-c907c77718b70765cd"],boundary_source_entity_ids:["guanqian-1:floor_2:cad-0446c4dbf6ad6073d713","guanqian-1:floor_2:cad-27530b85128aec50291c","guanqian-1:floor_2:cad-36fbde770e46e5373da4","guanqian-1:floor_2:cad-55bd1e74a4381f91cab0","guanqian-1:floor_2:cad-5cf63d0d2661312f5572","guanqian-1:floor_2:cad-770b18462382c8c65d78","guanqian-1:floor_2:cad-80e7f90b0f489608051d","guanqian-1:floor_2:cad-849aa279ae47239981e4","guanqian-1:floor_2:cad-868f7b175460f3fa3611","guanqian-1:floor_2:cad-882c19490b0c8526d163","guanqian-1:floor_2:cad-9b61d81394ba4360f5ca","guanqian-1:floor_2:cad-d9ec12a0644ae12d7654","guanqian-1:floor_2:cad-ec24f669e78eb493395a","guanqian-1:floor_2:cad-ede63e697ddaa1bbf6a8","guanqian-1:floor_2:cad-fd1436bdf8835beb658e","guanqian-1:floor_2:cad-ffe848ce0e1f57b96496"],boundary_source_layers:{"P\u260516 \u697C\u68AF\u6276\u68AF":2,"\u5EFA-\u5B54":1,"Q\u25C609 \u5EFA\u7B51\u5E55\u5899":7,"P\u260507 \u5E73\u9762\u5B8C\u6210\u9762":3,"P\u260508 \u5E73\u9762\u5B8C\u6210\u9762(\u9876\u9762\u663E\u793A\uFF09":3},nearby_railing_source_ids:["guanqian-1:floor_2:cad-20f608c27c8a4926f236","guanqian-1:floor_2:cad-b106f1e28c9fe4fdea69","guanqian-1:floor_2:cad-2dcb9e5b77b55ca939c2","guanqian-1:floor_2:cad-537d0146a0f2afb06ea5","guanqian-1:floor_2:cad-0204a297d3fb94e6b990","guanqian-1:floor_2:cad-ae26a18ed12e611d2d33","guanqian-1:floor_2:cad-db5c1e4ea3a23a8caf3e","guanqian-1:floor_2:cad-3491b79c0b34a475bd33","guanqian-1:floor_2:cad-ce8b38b6d714ce9599ee","guanqian-1:floor_2:cad-65d3398ed9b5f937c6a9","guanqian-1:floor_2:cad-b187613b194095bec66b","guanqian-1:floor_2:cad-dc5c155105d2e369cefd","guanqian-1:floor_2:cad-1726fba5f04169170fa7","guanqian-1:floor_2:cad-06c1f9695fa2c61c0d0d","guanqian-1:floor_2:cad-46f104637e0874a86e59","guanqian-1:floor_2:cad-f6954b5a8f325850c22d","guanqian-1:floor_2:cad-f09e78d3bae95573eebb","guanqian-1:floor_2:cad-20c6697e64ef9c9b3b1c"],footprints:[{outer:[[414985,-420010],[414975,-420150],[414955,-420285],[414925,-420415],[414880,-420545],[414820,-420670],[414750,-420785],[414575,-421e3],[414470,-421095],[414360,-421175],[414245,-421245],[414120,-421305],[413990,-421350],[413860,-421380],[413725,-421405],[413585,-421410],[401485,-421410],[401375.3381,-421402.4371],[401200,-421380],[401070,-421345],[400940,-421300],[400815,-421240],[400700,-421170],[400595,-421090],[400495,-421e3],[400405,-420900],[400325,-420790],[400255,-420675],[400195,-420555],[400145,-420425],[400090,-420155],[400085,-419770],[401620,-419770],[401620,-419190],[401770,-419190],[401770,-407810],[401775,-407665],[401830,-407395],[401880,-407265],[401940,-407140],[402010,-407025],[402090,-406920],[402180,-406820],[402280,-406730],[402385,-406650],[402500,-406580],[402625,-406520],[402755,-406475],[402885,-406440],[403025,-406415],[403170,-406410],[405010,-406410],[405010,-407960],[405160,-407960],[405160,-408610],[405010,-408610],[405010,-408860],[410060,-408860],[410060,-408610],[409910,-408610],[409910,-407960],[410060,-407960],[410060,-406410],[413725,-406415],[413865,-406440],[414e3,-406475],[414130,-406520],[414250,-406580],[414365,-406650],[414475,-406730],[414575,-406820],[414665,-406920],[414745,-407025],[414804.401,-407122.5874],[414875,-407265],[414955,-407525],[414975,-407665],[414985,-407810],[414985,-420010]],holes:[]}],area_m2:187.1917,sample_wcs_mm:[408377.5,-414025],method:"CAD_HOLE_MARK_ADJACENT_CLOSED_PLAN_FACES",input_origin:"USER_PROVIDED_CAD",processing_method:"RULE_BASED",status:"CAD_INDICATED_OPENING; boundary derived; NOT_SURVEYED"}],stair_plan_reservations:[{spatial_id:"floor_2:stair-plan:552af7b2c5c3",footprints:[{outer:[[347036.8241,-412839.5966],[347036.8241,-422383.5896],[346939.3241,-422383.5896],[346939.3241,-420753.5896],[346939.3241,-420528.8996],[346939.3241,-420180.6855],[346939.3241,-419730.6855],[346939.3241,-419280.6855],[346939.3241,-418830.6855],[346939.3241,-418380.6855],[346939.3241,-417930.6855],[346939.3241,-417480.6855],[346939.3241,-417030.6855],[346939.3241,-416580.6855],[346939.3241,-416130.6855],[346939.3241,-415765.622],[346939.3241,-415349.5966],[346939.3241,-414899.5966],[346939.3241,-414749.5966],[346439.3241,-414749.5966],[345939.3241,-414749.5966],[345939.3241,-414899.5966],[345939.3241,-415349.5966],[345939.3241,-415765.622],[345939.3241,-416130.6855],[345939.3241,-416580.6855],[345939.3241,-417030.6855],[345939.3241,-417480.6855],[345939.3241,-417930.6855],[345939.3241,-418380.6855],[345939.3241,-418830.6855],[345939.3241,-419280.6855],[345939.3241,-419730.6855],[345939.3241,-420180.6855],[345939.3241,-420528.8996],[345939.3241,-420753.5896],[345939.3241,-422383.5896],[345841.8241,-422383.5896],[345841.8241,-412839.5966],[347036.8241,-412839.5966]],holes:[]}],area_m2:3.7711,source_entity_ids:["guanqian-1:floor_2:cad-269caaf2ecd1800b9591","guanqian-1:floor_2:cad-553c0d98dfe548ed850c","guanqian-1:floor_2:cad-645cbf91bdc7a879a746","guanqian-1:floor_2:cad-87a5c535063b0bbc7e2d","guanqian-1:floor_2:cad-97d2908b44a1c5aac6b3","guanqian-1:floor_2:cad-aaeea3d9fcd16ec5480c","guanqian-1:floor_2:cad-cd6c37156fed55ab54a2"],direction_annotation_id:"guanqian-1:floor_2:cad-9130fad623ba880e3843",status:"STAIR_PLAN_SURFACE_RESERVED; not a confirmed vertical void",note:"Preserve original stair lines; no flat walking surface or invented riser heights."},{spatial_id:"floor_2:stair-plan:f5efb807c0af",footprints:[{outer:[[345341.8241,-412839.5966],[345341.8241,-422383.5896],[345244.3241,-422383.5896],[345244.3241,-420753.5896],[345244.3241,-420528.8996],[345244.3241,-420180.6855],[345244.3241,-419730.6855],[345244.3241,-419280.6855],[345244.3241,-418830.6855],[345244.3241,-418380.6855],[345244.3241,-417930.6855],[345244.3241,-417480.6855],[345244.3241,-417030.6855],[345244.3241,-416580.6855],[345244.3241,-416130.6855],[345244.3241,-415765.622],[345244.3241,-415349.5966],[345244.3241,-414899.5966],[345244.3241,-414749.5966],[344744.3241,-414749.5966],[344244.3241,-414749.5966],[344244.3241,-414899.5966],[344244.3241,-415349.5966],[344244.3241,-415765.622],[344244.3241,-416130.6855],[344244.3241,-416580.6855],[344244.3241,-417030.6855],[344244.3241,-417480.6855],[344244.3241,-417930.6855],[344244.3241,-418380.6855],[344244.3241,-418830.6855],[344244.3241,-419280.6855],[344244.3241,-419730.6855],[344244.3241,-420180.6855],[344244.3241,-420528.8996],[344244.3241,-420753.5896],[344244.3241,-422383.5896],[344146.8241,-422383.5896],[344146.8241,-412839.5966],[345341.8241,-412839.5966]],holes:[]}],area_m2:3.7711,source_entity_ids:["guanqian-1:floor_2:cad-04779cec7b44eb198b34","guanqian-1:floor_2:cad-0b3426974dd90a1d66d4","guanqian-1:floor_2:cad-43cf91a57fad7bb308e9","guanqian-1:floor_2:cad-596b1e863e243a7397ed","guanqian-1:floor_2:cad-75a687a8e4d46e2e8154","guanqian-1:floor_2:cad-780fb49dbd3e55489e0c","guanqian-1:floor_2:cad-e43f4e5a5ed583cd709f"],direction_annotation_id:"guanqian-1:floor_2:cad-ffda8bda43717dc9dfe1",status:"STAIR_PLAN_SURFACE_RESERVED; not a confirmed vertical void",note:"Preserve original stair lines; no flat walking surface or invented riser heights."},{spatial_id:"floor_2:stair-plan:cf0db8c30df8",footprints:[{outer:[[399726.8241,-409219.5966],[399726.8241,-419192.034],[399629.3241,-419192.034],[399629.3241,-417562.034],[399629.3241,-417443.1229],[399629.3241,-417010.6855],[399629.3241,-416560.6855],[399629.3241,-416110.6855],[399629.3241,-415660.6855],[399629.3241,-415210.6855],[399629.3241,-414760.6855],[399629.3241,-414310.6855],[399629.3241,-413860.6855],[399629.3241,-413410.6855],[399629.3241,-412960.6855],[399629.3241,-412510.6855],[399629.3241,-412145.622],[399629.3241,-411729.5966],[399629.3241,-411279.5966],[399629.3241,-411129.5966],[399129.3241,-411129.5966],[398629.3241,-411129.5966],[398629.3241,-411279.5966],[398629.3241,-411729.5966],[398629.3241,-412145.622],[398629.3241,-412510.6855],[398629.3241,-412960.6855],[398629.3241,-413410.6855],[398629.3241,-413860.6855],[398629.3241,-414310.6855],[398629.3241,-414760.6855],[398629.3241,-415210.6855],[398629.3241,-415660.6855],[398629.3241,-416110.6855],[398629.3241,-416560.6855],[398629.3241,-417010.6855],[398629.3241,-417443.1229],[398629.3241,-417562.034],[398629.3241,-419192.034],[398531.8241,-419192.034],[398531.8241,-409219.5966],[399726.8241,-409219.5966]],holes:[]}],area_m2:3.8546,source_entity_ids:["guanqian-1:floor_2:cad-0b5c9e60df33119c8fee","guanqian-1:floor_2:cad-353514674e8296f3b226","guanqian-1:floor_2:cad-6f66815c532f378237d7","guanqian-1:floor_2:cad-73f1d7d5b139bdbbea93","guanqian-1:floor_2:cad-c5194dd8c606a7d917e5","guanqian-1:floor_2:cad-dac257ae2835d88b0ae9","guanqian-1:floor_2:cad-f3a8b2c7c55316b4bfc0"],direction_annotation_id:"guanqian-1:floor_2:cad-18161df16758a77af183",status:"STAIR_PLAN_SURFACE_RESERVED; not a confirmed vertical void",note:"Preserve original stair lines; no flat walking surface or invented riser heights."},{spatial_id:"floor_2:stair-plan:f2c6fc375b0b",footprints:[{outer:[[401421.8241,-409219.5966],[401421.8241,-419192.034],[401324.3241,-419192.034],[401324.3241,-417562.034],[401324.3241,-417443.1229],[401324.3241,-417010.6855],[401324.3241,-416560.6855],[401324.3241,-416110.6855],[401324.3241,-415660.6855],[401324.3241,-415210.6855],[401324.3241,-414760.6855],[401324.3241,-414310.6855],[401324.3241,-413860.6855],[401324.3241,-413410.6855],[401324.3241,-412960.6855],[401324.3241,-412510.6855],[401324.3241,-412145.622],[401324.3241,-411729.5966],[401324.3241,-411279.5966],[401324.3241,-411129.5966],[400824.3241,-411129.5966],[400324.3241,-411129.5966],[400324.3241,-411279.5966],[400324.3241,-411729.5966],[400324.3241,-412145.622],[400324.3241,-412510.6855],[400324.3241,-412960.6855],[400324.3241,-413410.6855],[400324.3241,-413860.6855],[400324.3241,-414310.6855],[400324.3241,-414760.6855],[400324.3241,-415210.6855],[400324.3241,-415660.6855],[400324.3241,-416110.6855],[400324.3241,-416560.6855],[400324.3241,-417010.6855],[400324.3241,-417443.1229],[400324.3241,-417562.034],[400324.3241,-419192.034],[400226.8241,-419192.034],[400226.8241,-409219.5966],[401421.8241,-409219.5966]],holes:[]}],area_m2:3.8546,source_entity_ids:["guanqian-1:floor_2:cad-04c6ce250ef68a2dd1c9","guanqian-1:floor_2:cad-518d83dbb9cee639b09e","guanqian-1:floor_2:cad-71c1af2e532bb25c273b","guanqian-1:floor_2:cad-984c78b12c533fb56c8a","guanqian-1:floor_2:cad-99364ba432c1c1211c48","guanqian-1:floor_2:cad-c0db85638b85841f0052","guanqian-1:floor_2:cad-d74c9867bf0e34ce80e2"],direction_annotation_id:"guanqian-1:floor_2:cad-0988c3956220931c192f",status:"STAIR_PLAN_SURFACE_RESERVED; not a confirmed vertical void",note:"Preserve original stair lines; no flat walking surface or invented riser heights."}],upper_opening_references:[],walking_surface_verified:!1,surface_status:"SIMULATED_RECONSTRUCTION_WITH_CAD_OPENING_EXCLUSIONS",source_surface_area_m2:5967.579999999998,display_surface_area_m2:5765.136864989747}},audit:[{floor_id:"floor_1",cad_openings:0,stair_plan_reservations:0,upper_references_pending:1,opening_area_m2:0,note:"Original geometry unchanged. An upper-opening reference is not cut from its source floor."},{floor_id:"floor_2",cad_openings:1,stair_plan_reservations:4,upper_references_pending:0,opening_area_m2:187.1917,note:"Original geometry unchanged. An upper-opening reference is not cut from its source floor."}],original_data_sha256:{"floor_1.json":"56155666a5c918ef410c314225f9bb24def1d158888efbc77f44301d7fe67eef","floor_1_model.json":"b627ae3db0c014d23bc9a00c8460bc5e477f9b174c8cc658b90b3c4dcd2003e1","floor_2.json":"f6b2ef67dc3dfcf7049cf5c0b7934b1763478a4436d507a6407721cc90ea0e19","floor_2_model.json":"44e4f5b4a3b49fcba0da7b2348122028f1663ee2c938491178fc31a9060ebd70"},floor_data_mutated:!1};var Is={building_id:"guanqian-1",spatial_id:"guanqian-1:pdf-reference-envelope:v21",coordinate_frame:"EXISTING_CAD_SHARED_AXIS_LOCAL_METRES",coordinate_formula:"x=(cad_x-origin_x)/1000; z=-(cad_y-origin_y)/1000",reference_floor_id:"floor_2",origin_wcs_mm:[306207.499152335,-445919.6170965723,0],axis_block:"A$C138296ba",cad_unit:"mm",display_unit:"m",registration_status:"CAD_SHARED_AXIS_DERIVED; NOT_SURVEYED",outline_local_xy_m:[[7.476825,33.31002],[7.476825,49.51002],[9.276825,49.56002],[9.926825,50.16002],[51.076825,50.26002],[51.426825,49.86002],[51.976825,49.71002],[63.026825,49.71002],[63.576825,49.86002],[64.076825,50.56002],[64.076825,53.46002],[65.076825,53.06002],[76.926825,53.06002],[77.926825,53.46002],[78.076825,52.66002],[78.976825,52.16002],[115.326825,52.16002],[116.026825,51.86002],[119.626825,51.86002],[120.176825,52.01002],[120.676825,52.71002],[120.676825,55.06002],[121.476825,54.86002],[142.276825,54.86002],[143.076825,55.06002],[143.126825,48.46002],[143.826825,47.81002],[146.676825,47.76002],[146.826825,47.46002],[146.676825,47.11002],[146.676825,35.11002],[147.176825,34.41002],[148.326825,34.26002],[148.476825,33.96002],[148.326825,33.61002],[148.326825,26.51002],[148.476825,26.16002],[148.326825,25.86002],[147.176825,25.71002],[146.676825,25.01002],[146.676825,12.11002],[146.826825,11.76002],[146.676825,11.46002],[143.826825,11.41002],[143.126825,10.76002],[143.076825,4.16002],[142.176825,4.46002],[121.576825,4.46002],[120.676825,4.16002],[120.626825,4.96002],[120.076825,5.56002],[115.876825,5.86002],[113.176825,7.01002],[111.926825,8.21002],[110.676825,10.16002],[109.876825,10.96002],[108.126825,12.01002],[106.676825,12.36002],[96.026825,12.36002],[94.576825,12.01002],[92.776825,10.96002],[91.826825,9.96002],[90.726825,8.21002],[89.426825,6.96002],[88.226825,6.31002],[86.776825,5.86002],[83.176825,5.61002],[82.626825,5.01002],[82.576825,4.16002],[81.676825,4.46002],[64.976825,4.46002],[64.076825,4.16002],[64.076825,6.46002],[63.576825,7.16002],[63.026825,7.31002],[51.826825,7.26002],[51.076825,6.46002],[51.076825,4.16002],[50.176825,4.46002],[33.476825,4.46002],[32.576825,4.16002],[32.576825,14.56002],[32.426825,14.91002],[31.526825,15.41002],[14.276825,15.41002],[14.126825,17.56002],[13.526825,18.01002],[12.476825,18.06002],[12.476825,26.46002],[13.676825,26.56002],[14.226825,27.16002],[14.276825,30.61002],[14.976825,31.26002],[14.976825,32.36002],[14.526825,32.91002],[13.976825,33.06002],[9.926825,33.06002],[9.276825,33.31002],[7.476825,33.31002]],bounds_local_xy_m:[7.476825,4.16002,148.476825,55.06002],outline_status:"CAD_LINEWORK_DERIVED_PRESENTATION_ENVELOPE; not a surveyed facade footprint",roof_sections:[{outer:[[33.476825,4.46002],[32.576825,4.16002],[32.576825,14.56002],[32.426825,14.91002],[31.526825,15.41002],[14.276825,15.41002],[14.126825,17.56002],[13.526825,18.01002],[12.476825,18.06002],[12.476825,26.46002],[13.676825,26.56002],[14.226825,27.16002],[14.262332,29.61002],[45.546825,29.61002],[45.546825,4.46002],[33.476825,4.46002]],eave_m:8.8,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[7.476825,49.51002],[9.276825,49.56002],[9.926825,50.16002],[45.546825,50.246582],[45.546825,29.61002],[14.262332,29.61002],[14.276825,30.61002],[14.976825,31.26002],[14.976825,32.36002],[14.526825,32.91002],[13.976825,33.06002],[9.926825,33.06002],[9.276825,33.31002],[7.476825,33.31002],[7.476825,49.51002]],eave_m:8.8,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[64.976825,4.46002],[64.076825,4.16002],[64.076825,6.46002],[63.576825,7.16002],[63.026825,7.31002],[51.826825,7.26002],[51.076825,6.46002],[51.076825,4.16002],[50.176825,4.46002],[45.546825,4.46002],[45.546825,29.61002],[80.796825,29.61002],[80.796825,4.46002],[64.976825,4.46002]],eave_m:9.450000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[51.076825,50.26002],[51.426825,49.86002],[51.976825,49.71002],[63.026825,49.71002],[63.576825,49.86002],[64.076825,50.56002],[64.076825,53.46002],[65.076825,53.06002],[76.926825,53.06002],[77.926825,53.46002],[78.076825,52.66002],[78.976825,52.16002],[80.796825,52.16002],[80.796825,29.61002],[45.546825,29.61002],[45.546825,50.246582],[51.076825,50.26002]],eave_m:9.450000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[115.876825,5.86002],[113.176825,7.01002],[111.926825,8.21002],[110.676825,10.16002],[109.876825,10.96002],[108.126825,12.01002],[106.676825,12.36002],[96.026825,12.36002],[94.576825,12.01002],[92.776825,10.96002],[91.826825,9.96002],[90.726825,8.21002],[89.426825,6.96002],[88.226825,6.31002],[86.776825,5.86002],[83.176825,5.61002],[82.626825,5.01002],[82.576825,4.16002],[81.676825,4.46002],[80.796825,4.46002],[80.796825,29.61002],[116.046825,29.61002],[116.046825,5.847878],[115.876825,5.86002]],eave_m:8.600000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[115.326825,52.16002],[116.026825,51.86002],[116.046825,51.86002],[116.046825,29.61002],[80.796825,29.61002],[80.796825,52.16002],[115.326825,52.16002]],eave_m:8.600000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[148.326825,26.51002],[148.476825,26.16002],[148.326825,25.86002],[147.176825,25.71002],[146.676825,25.01002],[146.676825,12.11002],[146.826825,11.76002],[146.676825,11.46002],[143.826825,11.41002],[143.126825,10.76002],[143.076825,4.16002],[142.176825,4.46002],[121.576825,4.46002],[120.676825,4.16002],[120.626825,4.96002],[120.076825,5.56002],[116.046825,5.847878],[116.046825,29.61002],[148.326825,29.61002],[148.326825,26.51002]],eave_m:9.100000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]},{outer:[[119.626825,51.86002],[120.176825,52.01002],[120.676825,52.71002],[120.676825,55.06002],[121.476825,54.86002],[142.276825,54.86002],[143.076825,55.06002],[143.126825,48.46002],[143.826825,47.81002],[146.676825,47.76002],[146.826825,47.46002],[146.676825,47.11002],[146.676825,35.11002],[147.176825,34.41002],[148.326825,34.26002],[148.476825,33.96002],[148.326825,33.61002],[148.326825,29.61002],[116.046825,29.61002],[116.046825,51.86002],[119.626825,51.86002]],eave_m:9.100000000000001,rise_m:1.8,input_origin:"SIMULATED",source_pdf_pages:[3,4,5]}],source_pdf:{filename:"\u89C2\u524D\u88571 \u53F7\u8D2D\u7269\u4E2D\u5FC3\uFF08\u4F01\u4E1A\u4ECB\u7ECD\uFF09.pdf",pages:[1,2,3,4,5],sha256:"874fe76b49369c9bd8bd87e0a4f78f9b2b1b1ffa0d2873cc5a69f23981c671ea",use:"Visual facade/roof reference only. No measured height or tenant inventory."},real_dimensions:{floor_elevation_mm:null,floor_height_mm:null,roof_height_mm:null,frame_section_mm:null},display_parameters:{input_origin:"SIMULATED",floor_spacing_m:4.2,eave_height_m:8.8,roof_rise_m:2,gable_height_m:11.8,frame_width_m:.1,facade_module_m:2.7,slab_thickness_m:.24},facade_status:"PDF_REFERENCE_RECONSTRUCTION; all divisions and vertical dimensions SIMULATED",roof_status:"PDF_REFERENCE_RECONSTRUCTION; roof profile and pitch SIMULATED",floor_ids:["floor_1","floor_2"],extra_floors_created:!1};var fu={building_id:"guanqian-1",spatial_id:"guanqian-1:illustrative-context:v21",status:"SIMULATED",note:"Illustrative paving, planters and trees; not surveyed surrounding assets. No people or analytics.",bounds_local_xy_m:[-10.523175,-17.83998,166.476825,69.06002000000001]};function T2(i,e){let t=e.models,n=t.map(D=>{let G=Bi.floors[D.floor_id];return{...D,presentation_slab:{...D.presentation_slab,footprints:G.surfaces},regions:D.regions.filter(B=>G.region_picking_proxies[B.spatial_id]).map(B=>({...B,...G.region_picking_proxies[B.spatial_id]}))}}),s=hu(i,{...e,models:n}),r=new gt;r.name="V21_CAD_REGISTERED_BUILDING",s.scene.add(r);let o=new gt;o.name="ORIGINAL_CAD_INTERIORS",r.add(o);for(let D of s.floorGroups.values())o.add(D.group);let a=uu(Is);r.add(a);let l=du(fu,Is);s.scene.add(l);for(let D of s.scene.children)D.isMesh&&D.geometry?.type==="PlaneGeometry"&&(D.visible=!1);let[c,h,u,f]=Is.bounds_local_xy_m,d={mode:"overview",floors:{floor_1:!0,floor_2:!0},context:!0,roof:!0,separation:0},g=Is.display_parameters.floor_spacing_m,x=Math.max(44,(u-c+(f-h))*.37)*1.25,m=new xt().setFromObject(a).getSize(new R).y,p=Math.max(x*1.5,m*1.5),E=new gt;E.name="DISPLAY_REGISTRATION_GUIDES",r.add(E);let M=new gt;M.name="CAD_OPENING_AUDIT",s.floorGroups.get("floor_2").group.add(M);let _=t.find(D=>D.floor_id==="floor_2").registration.origin_wcs_mm;for(let D of Bi.floors.floor_2.openings)for(let G of D.footprints){let B=G.outer.map(K=>new R((K[0]-_[0])/1e3,.08,-(K[1]-_[1])/1e3)),X=new ar(new it().setFromPoints(B),new Dt({color:"#aa7a48",transparent:!0,opacity:.72}));X.userData={floor_id:"floor_2",opening_id:D.spatial_id,cad_handle:D.source_handle},M.add(X)}let w=new br({color:"#80909a",dashSize:1.1,gapSize:.9,transparent:!0,opacity:.45}),A=new it;A.setAttribute("position",new We(new Float32Array(12),3)),A.setAttribute("lineDistance",new We(new Float32Array(4),1));let P=new Gt(A,w);E.add(P);let N=s.setOptions.bind(s),b=s.fullBounds.bind(s),y=s.getDiagnostics.bind(s),C=s.draw.bind(s),L=s.fit.bind(s),F=s.hits.bind(s);[...s.screenLabels].filter(D=>D.userData.floorLabel).forEach(D=>D.material.opacity=0),s.setOptions=D=>{N({...D,simulated:!1,layers:{...D.layers,cameras:!1,coverage:!1,activity:!1,heatmap:!1,trajectories:!1,experience:!1,events:!1}}),V()},s.fullBounds=()=>(r.updateMatrixWorld(!0),d.mode==="overview"?new xt().setFromObject(a):b()),s.fit=D=>{if(D){let G=s.fullBounds().getCenter(new R),B=(d.mode==="overview"?new R(1,1.05,1.65):new R(.6,1.1,1.6)).normalize();s.controls.target.copy(G),s.camera.position.copy(G).addScaledVector(B,280),s.camera.lookAt(G)}L(!1)};function V(){a.visible=d.mode==="overview",o.visible=!0,M.visible=d.mode!=="overview",l.visible=d.context&&d.mode==="overview",E.visible=d.mode==="interior"&&d.separation>0&&d.floors.floor_1&&d.floors.floor_2,a.getObjectByName("PDF_REFERENCE_SLOPED_ROOF").visible=d.roof,a.getObjectByName("PDF_ROOF_EDGES").visible=d.roof,a.getObjectByName("PDF_GABLE_END_INFILL").visible=d.roof;for(let[X,K]of s.floorGroups){let re=(K.model.level-1)*g;K.group.visible=d.floors[X],K.group.position.y=re+(d.mode==="interior"&&d.separation>0?(K.model.level-1)*p*d.separation:0),K.operations.visible=!1}for(let X of M.children)X.visible=d.floors.floor_2;let D=s.floorGroups.get("floor_2").group.position.y,G=[new R(c-2,0,-h),new R(c-2,D,-h),new R(u+2,0,-f),new R(u+2,D,-f)],B=P.geometry.attributes.position;G.forEach((X,K)=>B.setXYZ(K,X.x,X.y,X.z)),B.needsUpdate=!0,P.geometry.attributes.lineDistance.array.set([0,D,0,D]),P.geometry.attributes.lineDistance.needsUpdate=!0,s.invalidate()}return s.setPresentation=D=>{let G=D.mode&&D.mode!==d.mode;D.mode&&["overview","interior"].includes(D.mode)&&(d.mode=D.mode),D.floors&&Object.assign(d.floors,D.floors);for(let B of["context","roof"])B in D&&(d[B]=D[B]);"separation"in D&&(d.separation=hn.clamp(Number(D.separation)||0,0,1)),d.mode==="overview"&&(d.separation=0),V(),s.fit(!!G),i.dispatchEvent(new CustomEvent("hubone-v21-change",{bubbles:!0}))},s.setFloorSeparation=D=>{let G=Number(D);if(!Number.isFinite(G))return;d.mode="interior",d.separation=hn.clamp(G,0,1),V(),s.focusMotion=null,s.focusedRegion=null;let B=s.controls.enableDamping;s.controls.enableDamping=!1,s.controls.update();let X=s.fullBounds();if(!X.isEmpty()){let K=s.camera.position.clone().sub(s.controls.target).normalize(),re=X.getCenter(new R);s.controls.target.copy(re),s.camera.position.copy(re).addScaledVector(K,280),s.camera.lookAt(re),s.camera.updateMatrixWorld(!0);let ye=new xt;for(let Xe of[X.min.x,X.max.x])for(let J of[X.min.y,X.max.y])for(let te of[X.min.z,X.max.z])ye.expandByPoint(new R(Xe,J,te).applyMatrix4(s.camera.matrixWorldInverse));let Ie=ye.getSize(new R),Ve=Math.max(1,i.clientWidth)/Math.max(1,i.clientHeight);s.halfHeight=Math.max(Ie.y,Ie.x/Ve)*.57,s.camera.zoom=1,s.updateProjection(),s.controls.update(),s.onChange?.(100)}s.controls.enableDamping=B,s.invalidate(),i.dispatchEvent(new CustomEvent("hubone-v21-change",{bubbles:!0}))},s.setExplode=s.setFloorSeparation,s.getPresentation=()=>({...d,floors:{...d.floors}}),s.getFloorScreenAnchors=()=>{let D=i.getBoundingClientRect(),G={};for(let[B,X]of s.floorGroups){let K=new R(c,X.group.position.y+.1,-h);K.project(s.camera),G[B]={x:(K.x+1)*D.width/2,y:(1-K.y)*D.height/2,visible:d.mode!=="overview"&&X.group.visible}}return G},s.getFloorProjectedBounds=()=>{let D={},G=i.getBoundingClientRect();r.updateMatrixWorld(!0);for(let[B,X]of s.floorGroups){let K=new xt().setFromObject(X.structure),re=[];for(let ye of[K.min.x,K.max.x])for(let Ie of[K.min.y,K.max.y])for(let Ve of[K.min.z,K.max.z])re.push(new R(ye,Ie,Ve).project(s.camera));D[B]={left:(Math.min(...re.map(ye=>ye.x))+1)*G.width/2,right:(Math.max(...re.map(ye=>ye.x))+1)*G.width/2,top:(1-Math.max(...re.map(ye=>ye.y)))*G.height/2,bottom:(1-Math.min(...re.map(ye=>ye.y)))*G.height/2}}return D},s.projectOpening=()=>{let D=Bi.floors.floor_2.openings[0],G=D.footprints[0].outer,B=G.reduce((ye,Ie)=>ye+Ie[0],0)/G.length,X=G.reduce((ye,Ie)=>ye+Ie[1],0)/G.length,K=new R((B-_[0])/1e3,s.floorGroups.get("floor_2").group.position.y+.05,-(X-_[1])/1e3).project(s.camera),re=i.getBoundingClientRect();return{x:re.left+(K.x+1)*re.width/2,y:re.top+(1-K.y)*re.height/2}},s.focusOpening=()=>{s.setPresentation({mode:"interior",floors:{floor_1:!1,floor_2:!0}});let D=Bi.floors.floor_2.openings[0].footprints[0].outer,G=D.map(re=>(re[0]-_[0])/1e3),B=D.map(re=>-(re[1]-_[1])/1e3),X=new R((Math.min(...G)+Math.max(...G))/2,s.floorGroups.get("floor_2").group.position.y,(Math.min(...B)+Math.max(...B))/2),K=s.camera.position.clone().sub(s.controls.target);s.controls.target.copy(X),s.camera.position.copy(X).add(K),s.camera.zoom=3.1,s.updateProjection(),s.controls.update(),s.invalidate()},s.draw=D=>{C(D),i.dispatchEvent(new CustomEvent("hubone-v21-draw",{bubbles:!0}))},s.hits=D=>d.mode==="overview"?[]:F(D),s.getDiagnostics=()=>({...y(),presentation:{version:"V2.1",stage:1,mode:d.mode,visibleInternalFloors:o.visible?[...s.floorGroups].filter(([,D])=>D.group.visible).map(([D])=>D):[],envelopeVisible:a.visible,roofVisible:d.roof,contextVisible:l.visible,contextStatus:"SIMULATED",facadeStatus:Is.facade_status,heightStatus:"SIMULATED",sourceFloorIds:t.map(D=>D.floor_id),analyticsImplemented:!1,displayExplodedOffsetM:d.mode==="interior"?p*d.separation:0,separationProgress:d.separation,maxSeparationM:p,legacyMaxSeparationM:x,normalBuildingHeightM:m,baselineFloorY:{floor_1:0,floor_2:g},cameraFraming:"CONTINUOUS_CURRENT_VIEW_FIT",registration:t.map(D=>({floor_id:D.floor_id,...D.registration})),openingAudit:Bi.audit,openingSourceHandle:"189F",openingAreaM2:Bi.floors.floor_2.openings[0].area_m2,flatSurfaceOverOpening:!1,walkingSurfaceVerified:!1,envelope:a.userData.statistics}}),s.renderer.domElement.dataset.spacePresentation="v21-stage1",s.sun.intensity=3.1,s.sun.shadow.normalBias=.16,s.sun.shadow.bias=-25e-5,s.scene.environmentIntensity=.13,V(),s.fit(!0),s.invalidate(),s}export{T2 as createSpatialScene,ec as demoForRegion};
/*! For license information please see space-v21.bundle.js.LEGAL.txt */
