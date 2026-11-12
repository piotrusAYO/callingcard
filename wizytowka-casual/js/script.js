let PAL={c1:'#9a2d5c',c2:'#5bc0eb',c3:'#e58bbb'};
const $=id=>document.getElementById(id),stage=$('stage'),card=$('card'),au=$('au');
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function tick(){const d=new Date(),p=n=>String(n).padStart(2,'0');$('clock').innerHTML=p(d.getHours())+'<br>'+p(d.getMinutes())}tick();setInterval(tick,10000);
[...card.children].forEach((c,i)=>c.style.setProperty('--i',i));
stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 if(!still){card.style.animation='none';card.style.transform=`rotateY(${x*9}deg) rotateX(${-y*9}deg)`}
 const c=card.getBoundingClientRect();card.style.setProperty('--mx',e.clientX-c.left+'px');card.style.setProperty('--my',e.clientY-c.top+'px')});
stage.addEventListener('mouseleave',()=>card.style.transform='');
/* jezyk bez przeladowania strony, dzieki temu muzyka gra dalej */
let lang='pl';const T={pl:'yao – nieoficjalna wizytówka',en:'yao – unofficial card'};
function setLang(l){lang=l;document.documentElement.lang=l;document.title=T[l];
 document.querySelectorAll('[data-'+l+']').forEach(e=>e.textContent=e.dataset[l]);
 document.querySelectorAll('[data-a'+l+']').forEach(e=>{e.setAttribute('aria-label',e.dataset['a'+l]);e.title=e.dataset['a'+l]});
 try{localStorage.setItem('lang',l)}catch(e){}}
let st=/^#(pl|en)$/.test(location.hash)?location.hash.slice(1):null;if(!st)try{st=localStorage.getItem('lang')}catch(e){}
setLang(st||((navigator.language||'').startsWith('pl')?'pl':'en'));
$('lang').addEventListener('click',()=>setLang(lang==='pl'?'en':'pl'));
/* muzyka */
const VOL=.3;au.volume=0;let an,data,touched=false,warp=0;
function setupAudio(){if(!/^https?:/.test(location.protocol))return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),s=c.createMediaElementSource(au);an=c.createAnalyser();an.fftSize=128;an.smoothingTimeConstant=.8;s.connect(an);an.connect(c.destination);data=new Uint8Array(an.frequencyBinCount);c.resume()}catch(e){an=null}}
function fadeIn(ms=2800){const t0=performance.now();(function s(n){if(touched)return;const k=Math.min(1,(n-t0)/ms);au.volume=VOL*k;$('vol').value=VOL*k*100;if(k<1)requestAnimationFrame(s)})(t0)}
$('vol').addEventListener('input',e=>{touched=true;au.volume=e.target.value/100});
$('pp').addEventListener('click',()=>au.paused?au.play():au.pause());
['play','pause'].forEach(e=>au.addEventListener(e,()=>$('pl').classList.toggle('playing',!au.paused)));
const tw=$('tw'),txt=tw.dataset.text;
function type(i=0){tw.textContent=txt.slice(0,i);if(i<txt.length)setTimeout(()=>type(i+1),still?0:55);else tw.classList.add('done')}
let entered=false;
$('intro').addEventListener('click',()=>{if(entered)return;entered=true;setupAudio();au.play().then(fadeIn).catch(()=>{au.volume=VOL});
 stage.classList.add('entering');warp=still?0:22;
 setTimeout(()=>stage.classList.remove('locked'),900);setTimeout(type,1900);setTimeout(()=>stage.classList.remove('entering'),2500)});
/* gwiazdy (warp przy wejsciu) + cava */
const cv=$('fx'),g=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),N=56,bars=Array(N).fill(0);let W,H,stars=[],t=0;
function size(){const r=stage.getBoundingClientRect();W=cv.width=r.width*dpr;H=cv.height=r.height*dpr;stars=Array.from({length:Math.round(r.width/12)},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.4+.3)*dpr,s:(Math.random()*.3+.05)*dpr,p:Math.random()*6.3}))}
addEventListener('resize',size);size();
function frame(){t+=.016;g.clearRect(0,0,W,H);warp*=.968;if(warp<.05)warp=0;g.fillStyle=g.strokeStyle='#dff1ff';
 for(const s of stars){if(!still){s.y-=s.s*(1+warp);if(s.y<-4){s.y=H+4;s.x=Math.random()*W}}g.globalAlpha=Math.min(1,.25+.6*Math.abs(Math.sin(t*.8+s.p))+warp*.03);
  if(warp>1.5){g.lineWidth=s.r;g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x,s.y+s.s*warp*3);g.stroke()}else{g.beginPath();g.arc(s.x,s.y,s.r,0,6.3);g.fill()}}
 const on=!au.paused;let real=false;if(an&&on){an.getByteFrequencyData(data);real=data.some(v=>v)}
 const bw=W/N;g.globalAlpha=.55;const gr=g.createLinearGradient(0,H,0,H*.72);gr.addColorStop(0,PAL.c1);gr.addColorStop(1,PAL.c2);g.fillStyle=gr;
 for(let i=0;i<N;i++){const v=on?(real?data[Math.floor(i*.9)]/255:.3+.3*Math.sin(t*2.2+i*.55)*Math.sin(t*1.3+i*.23)):.03;bars[i]+=(v-bars[i])*.18;const h=Math.max(3*dpr,bars[i]*H*.26);g.beginPath();g.roundRect?g.roundRect(i*bw+bw*.2,H-h,bw*.6,h,bw*.3):g.rect(i*bw+bw*.2,H-h,bw*.6,h);g.fill()}
 requestAnimationFrame(frame)}frame();

/* === v4: tla, kopiowanie nicku, pasek postepu, skroty, spadajace gwiazdy, burst === */
const toast=$('toast');let tt;const say=(pl,en)=>{toast.textContent=lang==='pl'?pl:en;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),1900)};
$('dc').addEventListener('click',e=>{e.preventDefault();const f=()=>say('Skopiowano nick: piotrek','Copied username: piotrek');(navigator.clipboard?navigator.clipboard.writeText('piotrek'):Promise.reject()).then(f).catch(()=>{const t=document.createElement('textarea');t.value='piotrek';document.body.append(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove();f()})});
const BG=[["aurora","Aurora",{"a":"91,192,235","b":"190,90,150","l":"#9fd8f5","p":"#11152a","g":"14,18,38","m":"#9aa3c4"}],["gradient-cieply","Gradient",{"a":"238,138,99","b":"97,139,209","l":"#fabfa8","p":"#1b120e","g":"25,15,11","m":"#d3c2bb"}],["fale-niebieskie","Niebieskie fale",{"a":"99,139,238","b":"146,97,209","l":"#a8bffa","p":"#0e121b","g":"11,15,25","m":"#bbc2d3"}],["teczowy","Tęczowy",{"a":"202,99,238","b":"209,97,126","l":"#e5a8fa","p":"#170e1b","g":"21,11,25","m":"#cdbbd3"}],["neon","Neon",{"a":"99,208,238","b":"209,97,126","l":"#a8e9fa","p":"#0e181b","g":"11,22,25","m":"#bbced3"}],["mrok","Mrok",{"a":"238,139,99","b":"209,97,174","l":"#fac0a8","p":"#1b120e","g":"25,15,11","m":"#d3c2bb"}],["zachod","Zachód",{"a":"238,136,99","b":"114,97,209","l":"#fabea8","p":"#1b120e","g":"25,14,11","m":"#d3c1bb"}],["granat","Granat",{"a":"99,194,238","b":"101,97,209","l":"#a8e0fa","p":"#0e171b","g":"11,20,25","m":"#bbcbd3"}],["fiolet-fale","Fioletowe fale",{"a":"99,131,238","b":"166,97,209","l":"#a8bbfa","p":"#0e111b","g":"11,14,25","m":"#bbc0d3"}],["plynny","Płynny",{"a":"238,99,131","b":"209,161,97","l":"#faa8bb","p":"#1b0e11","g":"25,11,14","m":"#d3bbc0"}]];
let bi=0;const scrim=document.createElement('i');scrim.className='scrim';stage.prepend(scrim);
const wps=[0,1].map(()=>{const d=document.createElement('i');d.className='wp';stage.prepend(d);return d});let wi=0;
function applyPal(p){const s=(k,v)=>document.documentElement.style.setProperty(k,v);s('--acc',p.a);s('--acc2',p.b);s('--blue','rgb('+p.a+')');s('--pink','rgb('+p.b+')');s('--blue-l',p.l);s('--panel',p.p);s('--glass','rgba('+p.g+',.55)');s('--muted',p.m);PAL={c1:'rgb('+p.b+')',c2:'rgb('+p.a+')',c3:p.l};const m=document.querySelector('meta[name=theme-color]');if(m)m.content=p.p}
function setBg(i,quiet){bi=(i+BG.length)%BG.length;const[k,n,p]=BG[bi];applyPal(p);
 if(k==='aurora'){stage.classList.remove('has-wp');wps.forEach(w=>w.classList.remove('on'))}
 else{const nx=wps[wi^=1],pv=wps[wi^1];nx.style.backgroundImage=`url(img/bg/${k}.jpg)`;nx.classList.add('on');pv.classList.remove('on');stage.classList.add('has-wp')}
 try{localStorage.setItem('bg2',bi)}catch(e){}
 if(!quiet){say('Tło: '+n,'Background: '+n);const b=$('bgb');b.classList.remove('spin');void b.offsetWidth;b.classList.add('spin')}}
$('bgb').addEventListener('click',()=>setBg(bi+1));
try{const s=+localStorage.getItem('bg2');if(s>0)setBg(s,1)}catch(e){}
stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;if(!still)wps.forEach(w=>w.style.transform=`scale(1.06) translate(${-x*14}px,${-y*14}px)`)});
/* pasek postepu + seek */
au.addEventListener('timeupdate',()=>{if(au.duration)$('pgb').style.width=au.currentTime/au.duration*100+'%'});
$('pg').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();if(au.duration)au.currentTime=(e.clientX-r.left)/r.width*au.duration});
/* skroty */
addEventListener('keydown',e=>{if(!entered||e.ctrlKey||e.metaKey||e.altKey||/INPUT/.test(e.target.tagName)&&e.key===' ')return;const k=e.key.toLowerCase();
 if(k===' '){e.preventDefault();$('pp').click()}
 else if(k==='b')$('bgb').click();
 else if(k==='m'){au.muted=!au.muted;say(au.muted?'Wyciszono':'Dźwięk włączony',au.muted?'Muted':'Sound on')}
 else if(k==='l')$('lang').click()});
/* spadajace gwiazdy + burst po kliknieciu */
const meteors=[],sparks=[];
function meteor(){if(!still&&entered&&!document.hidden)meteors.push({x:Math.random()*W*.9+W*.1,y:Math.random()*H*.35,l:1});setTimeout(meteor,3500+Math.random()*6000)}setTimeout(meteor,5000);
stage.addEventListener('click',e=>{if(!entered||still||e.target.closest('.card,.player,.intro'))return;const r=stage.getBoundingClientRect();for(let i=0;i<22;i++){const a=Math.random()*6.3,v=(Math.random()*3+1)*dpr;sparks.push({x:(e.clientX-r.left)*dpr,y:(e.clientY-r.top)*dpr,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1})}});
(function fx2(){g.save();g.fillStyle=g.strokeStyle='#fff';
 for(let i=meteors.length;i--;){const m=meteors[i];m.x-=9*dpr;m.y+=4.5*dpr;m.l-=.012;if(m.l<=0){meteors.splice(i,1);continue}
  const gr=g.createLinearGradient(m.x,m.y,m.x+110*dpr,m.y-55*dpr);gr.addColorStop(0,'rgba(255,255,255,'+m.l+')');gr.addColorStop(1,'transparent');g.strokeStyle=gr;g.lineWidth=1.6*dpr;g.beginPath();g.moveTo(m.x,m.y);g.lineTo(m.x+110*dpr,m.y-55*dpr);g.stroke()}
 for(let i=sparks.length;i--;){const s=sparks[i];s.x+=s.vx;s.y+=s.vy;s.vx*=.96;s.vy*=.96;s.l-=.02;if(s.l<=0){sparks.splice(i,1);continue}g.globalAlpha=s.l;g.fillStyle=i%2?PAL.c2:PAL.c3;g.beginPath();g.arc(s.x,s.y,2*dpr*s.l,0,6.3);g.fill()}
 g.restore();requestAnimationFrame(fx2)})();

/* === v5: powitania, avatar, platki, auto-tla, kursor === */
const GR=['こんにちは','Cześć','Hello','やあ'],hiEl=$('hi');let gi=0;
setInterval(()=>{hiEl.style.opacity=0;hiEl.style.transform='translateY(6px)';setTimeout(()=>{gi=(gi+1)%GR.length;hiEl.textContent=GR[gi];hiEl.style.opacity=1;hiEl.style.transform=''},350)},2800);
function burst(cx,cy,n){const r=stage.getBoundingClientRect();for(let i=0;i<n;i++){const a=Math.random()*6.3,v=(Math.random()*3+1)*dpr;sparks.push({x:(cx-r.left)*dpr,y:(cy-r.top)*dpr,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1})}}
document.querySelector('.av').addEventListener('click',e=>{const a=e.currentTarget;a.classList.remove('pop');void a.offsetWidth;a.classList.add('pop');const r=a.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,40);say('Cześć, jestem Piotrek 👋',"Hi, I'm Piotrek 👋")});
let petals=true;const PT=Array.from({length:26},()=>({x:Math.random(),y:Math.random(),s:.4+Math.random()*.8,r:3+Math.random()*4,p:Math.random()*6.3}));
function togglePetals(){petals=!petals;$('ptb').classList.toggle('off',!petals);say(petals?'Płatki: włączone':'Płatki: wyłączone',petals?'Petals: on':'Petals: off')}
$('ptb').addEventListener('click',togglePetals);
(function pt(){if(petals&&entered&&!still){for(const q of PT){q.y+=.0012*q.s;q.p+=.02*q.s;if(q.y>1.05){q.y=-.05;q.x=Math.random()}g.save();g.globalAlpha=.55;g.fillStyle=PAL.c3;g.translate((q.x+Math.sin(q.p)*.03)*W,q.y*H);g.rotate(q.p*1.3);g.beginPath();g.ellipse(0,0,q.r*dpr*1.6,q.r*dpr*.8,0,0,6.3);g.fill();g.restore()}}requestAnimationFrame(pt)})();
let auto=false;setInterval(()=>{if(auto&&!document.hidden)setBg(bi+1)},12000);
addEventListener('keydown',e=>{if(!entered||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();
 if(k==='p')togglePetals();else if(k==='a'){auto=!auto;say(auto?'Auto-zmiana tła: włączona':'Auto-zmiana tła: wyłączona',auto?'Auto background: on':'Auto background: off')}});
if(matchMedia('(pointer:fine)').matches&&!still){const o=document.createElement('i');o.className='cur';stage.append(o);let tx=0,ty=0,cx=0,cy=0;
 stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;o.style.opacity=1});stage.addEventListener('mouseleave',()=>o.style.opacity=0);
 (function m(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;o.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(m)})()}
