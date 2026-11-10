/* Agua: Spain's reservoirs as a wall of water. No build step, no dependencies.
   Data: data/agua.json, rebuilt weekly by tools/build_data.py from MITECO's bulletin. */
function startLang(){ try{const s=localStorage.getItem('agua-lang'); if(s==='es'||s==='en')return s}catch(e){} return (navigator.language||'es').toLowerCase().startsWith('es')?'es':'en' }
const getJ=u=>fetch(u).then(r=>{ if(!r.ok)throw new Error(u+' '+r.status); return r.json() });
Promise.all([getJ('data/agua.json'),getJ('data/geo.json').catch(()=>({r:{},es:[],pt:[]}))]).then(a=>start(a[0],a[1])).catch(e=>{ console.error(e);
  document.getElementById('main').innerHTML='<p class="msg">No se han podido cargar los datos. Recarga la página. / The data could not be loaded. Reload the page.</p>' });
function start(D,G){
const fmtDate=iso=>{const d=new Date(iso+'T12:00:00'); return d.toLocaleDateString(lang==='es'?'es-ES':'en-GB',{day:'numeric',month:'short',year:'numeric'})};
const Y0=D.first, N=D.nat.length;
const T={es:{h:['España','se llena'],strip:'ESTA SEMANA EN OTROS AÑOS',today:'último boletín',play:'Reproducir',pause:'Pausar',res:'embalses',close:'Cerrar',year:'Año',
  lede:'<b>Cada ladrillo es un embalse.</b> El tamaño es su capacidad, el agua es lo que tiene y la roca es lo que falta. Arriba, toda España en una pantalla; debajo, cuenca a cuenca, de norte a sur. Toca uno. Mueve los años.',
  foot:'Origen de los datos: MITECO, Boletín Hidrológico semanal. Datos provisionales, sin validar. Embalses peninsulares de más de 5 hm3: no incluye las islas, Ceuta ni Melilla. El área de cada ladrillo es su capacidad de hoy, a la misma escala en toda España. Cada año muestra el boletín más cercano a la fecha de hoy. Un hueco es un embalse que aún no existía.',
  credits:'Créditos y fuentes',kofi:'Invítame a un café',code:'Código',nodata:'sin boletín',
  none:'aún no existía',cap:'capacidad',now:'último dato',best:'más lleno',worst:'más vacío',ring:'esta semana, cada año',all:'Toda España',hid:'Lo que el agua esconde',hidn:'lugares con testigos',hidlede:'Bajo algunos embalses hay iglesias, pueblos y piedras de hace miles de años. Aquí solo entra lo que alguien vio y fechó: cada raya es un avistamiento con su fuente, cruzado con el nivel del embalse ese día. Lo que nadie ha documentado no se inventa.',v_out:'Fuera del agua',v_part:'Asoma',v_under:'Bajo el agua',v_unk:'Sin testigos a este nivel',w_out:'Visto fuera con el embalse igual o más lleno',w_part:'Como mínimo',w_under:'Visto cubierto con el embalse igual o más vacío',w_unk:'Nadie lo ha documentado con el embalse a este nivel. Las rayas marcan los niveles a los que sí hay testigos.',s_fuera:'fuera',s_parcial:'asoma',s_cubierto:'cubierto',seen:'Avistamientos',src:'Fuente',said:'la fuente dice',in:'Embalse de',hides:'Esconde',sketch:'Dibujo esquemático. La figura se coloca entre los avistamientos, no según un plano.',vt:'Tu vaso',vn:'ciudades con fuente',vph:'Escribe tu ciudad o tu pueblo',vlab:'Tu municipio',vlede:'Escribe cualquier municipio de España. Si tengo la fuente de quien gestiona su agua, te digo cómo están sus embalses. Si no, te enseño los cinco que tiene más cerca y lo digo claro: no existe una lista pública que diga de qué embalse bebe cada pueblo.',vbig:'Tu agua está al',vup:'puntos más que hace un año',vdown:'puntos menos que hace un año',vsame:'igual que hace un año',vfrom:'Viene de',vby:'La gestiona',vmiss:'No está en los datos del ministerio y no se cuenta',valso:'También vale para',vnone:'Buscando…',vnone2:'No encuentro ese municipio.',mp:'Dónde están',mpn:'embalses localizados de',mplede:'Cada embalse en su sitio, con el agua de esa semana. El tamaño del cuadrado es su capacidad. Toca uno. Los que no tienen coordenadas fiables no se dibujan.',onmap:'ver en el mapa',noloc:'sin localizar',vnear1:'Cerca de',vnear2:'al',km:'km',vhon1:'No sé de qué embalses bebe',vhon2:'no hay una fuente abierta que lo diga. Estos son los cinco embalses más cercanos, que no tienen por qué ser los que lo abastecen.',visl:'Sin datos aquí',visl2:'Las islas, Ceuta y Melilla no están en el boletín del ministerio.',vnearl:'Los más cercanos',vapprox:'Años anteriores: aproximado con la capacidad de hoy.'},
 en:{h:['Spain','fills up'],strip:'THIS WEEK IN OTHER YEARS',today:'latest bulletin',play:'Play',pause:'Pause',res:'reservoirs',close:'Close',year:'Year',
  lede:'<b>Every brick is a reservoir.</b> Size is its capacity, water is what it holds and rock is what is missing. Above, all of Spain on one screen; below, basin by basin, north to south. Tap one. Move the years.',
  foot:'Data source: MITECO, weekly Boletín Hidrológico. Provisional, unvalidated data. Mainland reservoirs over 5 hm3: the islands, Ceuta and Melilla are not included. Each brick\'s area is its capacity today, at one scale for all of Spain. Each year shows the bulletin closest to today\'s date. A gap is a reservoir that did not exist yet.',
  credits:'Credits and sources',kofi:'Buy me a coffee',code:'Code',nodata:'no bulletin',
  none:'did not exist yet',cap:'capacity',now:'latest',best:'fullest',worst:'emptiest',ring:'this week, every year',all:'All of Spain',hid:'What the water hides',hidn:'places with witnesses',hidlede:'Under some reservoirs lie churches, villages and stones thousands of years old. Only what someone saw and dated gets in: each line is a sighting with its source, matched to the reservoir level that day. What nobody has documented is not made up.',v_out:'Out of the water',v_part:'Showing',v_under:'Under water',v_unk:'No witnesses at this level',w_out:'Seen out with the reservoir as full or fuller',w_part:'At the very least',w_under:'Seen covered with the reservoir as empty or emptier',w_unk:'Nobody has documented it with the reservoir at this level. The lines mark the levels that do have witnesses.',s_fuera:'out',s_parcial:'showing',s_cubierto:'covered',seen:'Sightings',src:'Source',said:'the source says',in:'Reservoir:',hides:'Hides',sketch:'Schematic drawing. The figure is placed between the sightings, not from a survey.',vt:'Your glass',vn:'cities with a source',vph:'Type your city or town',vlab:'Your town',vlede:'Type any town in Spain. If I have its water operator\'s source, I tell you how its reservoirs are doing. If not, I show you the five nearest ones and say so plainly: there is no public list of which reservoir each town drinks from.',vbig:'Your water is at',vup:'points more than a year ago',vdown:'points fewer than a year ago',vsame:'the same as a year ago',vfrom:'It comes from',vby:'Managed by',vmiss:'Not in the ministry data and not counted',valso:'Also valid for',vnone:'Searching…',vnone2:'I cannot find that town.',mp:'Where they are',mpn:'reservoirs located out of',mplede:'Every reservoir in its place, with that week\'s water. The size of the square is its capacity. Tap one. Those without reliable coordinates are not drawn.',onmap:'see on the map',noloc:'not located',vnear1:'Near',vnear2:'at',km:'km',vhon1:'I do not know which reservoirs supply',vhon2:'no open source says so. These are the five nearest reservoirs, which are not necessarily the ones that supply it.',visl:'No data here',visl2:'The islands, Ceuta and Melilla are not in the ministry bulletin.',vnearl:'The nearest',vapprox:'Earlier years: approximated with today\'s capacity.'}};
let lang=startLang(), yi=N-1, playing=null, hover=null, picked=null, tChange=0;
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);
const num=(v,d)=>v.toLocaleString(lang==='es'?'es-ES':'en-GB',{minimumFractionDigits:d,maximumFractionDigits:d});
const hm=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g,lang==='es'?'.':',');
const hash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};

/* headline: two fitted lines, filled like vessels at the national level */
const h1=$('#h1'); const lines=[0,1].map(()=>{const s=document.createElement('span'); s.className='big'; s.innerHTML='<span class="dry"></span><span class="wet" aria-hidden="true"></span>'; h1.appendChild(s); return {el:s,dry:s.firstChild,wet:s.lastChild,fs:100,cur:null,vel:0}});
function fitHead(){ const W=h1.clientWidth; if(!W)return; let fs=Math.min(innerHeight*0.24,260);
  lines.forEach(o=>{o.el.style.fontSize='100px'; fs=Math.min(fs,Math.floor(100*W/(o.dry.getBoundingClientRect().width||1)))});
  lines.forEach(o=>{o.fs=fs; o.el.style.fontSize=fs+'px'; o.cur=null}) }
const levelPx=(fs,p)=>fs*(0.16+0.098+0.686*(1-p/100));

/* wall */
const main=$('#main'); const basins=[]; let idx=0;
const WATER=['#3F93A8','#3B8CA0','#4399AE'];
function makePattern(base,line){const c=document.createElement('canvas'); c.width=8; c.height=9; const g=c.getContext('2d'); g.fillStyle=base; g.fillRect(0,0,8,9); g.fillStyle=line; g.fillRect(0,8,8,1); return c}
const ROCKS=[['#CDB98F','#B19C72'],['#C6B185','#AA956B'],['#D3C099','#B8A37A']].map(a=>makePattern(a[0],a[1]));
function mk(b,src,all){
  const sec=document.createElement('section'); sec.className='basin';
  sec.innerHTML='<div class="bh"><h2></h2><div class="bm"><b></b><span></span></div></div><canvas></canvas>';
  sec.querySelector('h2').textContent=b.n; main.appendChild(sec);
  const cv=sec.querySelector('canvas');
  const o={b,sec,cv,g:cv.getContext('2d'),pct:sec.querySelector('.bm b'),cnt:sec.querySelector('.bm span'),vis:false,pats:null,
    all,bricks:src.map(r=>({n:r[0],c:r[1],p:r[2],v:r[3],basin:r[4]||b.n,i:idx++,tone:hash(r[0])%3,cur:null,vel:0,x:0,y:0,w:0}))};
  basins.push(o);
  cv.addEventListener('pointermove',e=>{ if(e.pointerType==='touch')return; hover=hit(o,e); cv.style.cursor=hover?'pointer':'default'; tip(e)});
  cv.addEventListener('pointerleave',()=>{hover=null; tip()});
  cv.addEventListener('click',e=>{const k=hit(o,e); picked=(k&&!(picked&&picked.n===k.n))?k:null; showCard()});
  return o;
}
const ALL=mk({n:'',p:D.nat.map(v=>Math.round(v))},D.basins.flatMap(b=>b.r.map(r=>[r[0],r[1],r[2],r[3],b.n])),true); idx=0;

/* ---------- layer 2: what the water hides ---------- */
/* ---------- the map ---------- */
const LL=G.r||{};
const BX={lo0:-9.7,lo1:3.6,la0:35.8,la1:44.0}, KX=Math.cos(40*Math.PI/180), RATIO=(BX.la1-BX.la0)/((BX.lo1-BX.lo0)*KX);
const proj=(W,H,lat,lon)=>[(lon-BX.lo0)/(BX.lo1-BX.lo0)*W,(BX.la1-lat)/(BX.la1-BX.la0)*H];
const msec=document.createElement('section'); msec.className='basin map'; msec.id='mapa';
msec.innerHTML='<div class="bh"><h2></h2><div class="bm"><b></b><span></span></div></div><p class="lede tl2"></p><div class="mwrap"><canvas></canvas></div>';
main.appendChild(msec);
const mcv=msec.querySelector('canvas');
const MO={cv:mcv,g:mcv.getContext('2d'),sec:msec,rev:true,vis:true,W:0,h:0,pats:null,
  bricks:ALL.bricks.filter(k=>LL[k.n]).sort((a,b)=>b.c-a.c).map((k,i)=>({n:k.n,c:k.c,p:k.p,v:k.v,basin:k.basin,ll:LL[k.n],i,tone:k.tone,cur:null,vel:0,x:0,y:0,w:0,h:0}))};
mcv.addEventListener('pointermove',e=>{ if(e.pointerType==='touch')return; hover=hit(MO,e); mcv.style.cursor=hover?'pointer':'default'; tip(e)});
mcv.addEventListener('pointerleave',()=>{hover=null; tip()});
mcv.addEventListener('click',e=>{const k=hit(MO,e); picked=(k&&k!==picked)?k:null; showCard()});
function sizeMap(){ const full=mcv.parentElement.clientWidth; if(!full)return; const W=Math.max(280,Math.min(full,(innerHeight-190)/RATIO)), H=Math.round(W*RATIO);
  MO.W=W; MO.h=H; mcv.style.width=W+'px'; mcv.style.height=H+'px'; mcv.width=Math.round(W*dpr); mcv.height=Math.round(H*dpr); MO.g.setTransform(dpr,0,0,dpr,0,0); MO.pats=ROCKS.map(c=>MO.g.createPattern(c,'repeat'));
  MO.bricks.forEach(k=>{ const s=Math.max(W<500?4:5,Math.sqrt(k.c)*W/1150), q=proj(W,H,k.ll[0],k.ll[1]); k.w=s; k.h=s; k.x=q[0]-s/2; k.y=q[1]-s/2 }) }
function ring(g,W,H,r){ g.beginPath(); r.forEach((q,i)=>{ const a=proj(W,H,q[1],q[0]); i?g.lineTo(a[0],a[1]):g.moveTo(a[0],a[1]) }); g.closePath() }
MO.bg=g=>{ (G.pt||[]).forEach(r=>{ ring(g,MO.W,MO.h,r); g.fillStyle='#131A1B'; g.fill() });
  (G.es||[]).forEach(r=>{ ring(g,MO.W,MO.h,r); g.fillStyle='#1B2526'; g.fill(); g.strokeStyle='#34403F'; g.lineWidth=2; g.stroke() }) };
MO.fg=g=>{ const names=new Set(VO.bricks.map(k=>k.n)); g.strokeStyle='#EEF1EC'; g.lineWidth=2;
  MO.bricks.forEach(k=>{ if(names.has(k.n))g.strokeRect(k.x-2,k.y-2,k.w+4,k.h+4) });
  if(vsel&&vsel.town){ const q=proj(MO.W,MO.h,vsel.town[1],vsel.town[2]); g.fillStyle='#EEF1EC'; g.beginPath(); g.arc(q[0],q[1],5,0,7); g.fill(); g.fillStyle='#0B1112'; g.beginPath(); g.arc(q[0],q[1],2,0,7); g.fill();
    g.font="800 12px Archivo, Arial, sans-serif"; const s=vsel.town[0], tw=g.measureText(s).width, tx=Math.min(MO.W-tw-8,q[0]+9); g.fillStyle='#0B1112'; g.fillRect(tx-4,q[1]-9,tw+8,18); g.fillStyle='#EEF1EC'; g.fillText(s,tx,q[1]+4) } };
const LW=104, LH=Math.round(104*RATIO);
const ESPATH=(G.es||[]).map(r=>r.map((q,i)=>{const a=proj(LW,LH,q[1],q[0]); return (i?'L':'M')+a[0].toFixed(1)+' '+a[1].toFixed(1)}).join('')+'Z').join('');
function locSvg(k){ const ll=LL[k.n]; if(!ll)return '<div class="nl">'+T[lang].noloc+'</div>'; const a=proj(LW,LH,ll[0],ll[1]);
  return '<svg width="'+LW+'" height="'+LH+'" viewBox="0 0 '+LW+' '+LH+'" role="img" aria-label="'+k.n+'"><path d="'+ESPATH+'" fill="#1B2526" stroke="#A3AFAC" stroke-width="1"/><rect x="'+(a[0]-4).toFixed(1)+'" y="'+(a[1]-4).toFixed(1)+'" width="8" height="8" fill="#3F93A8" stroke="#EEF1EC" stroke-width="2"/></svg>' }
function renderMap(){ const L=T[lang]; msec.querySelector('h2').textContent=L.mp; msec.querySelector('.bm b').textContent=MO.bricks.length; msec.querySelector('.bm span').textContent=L.mpn+' '+ALL.bricks.length; msec.querySelector('.tl2').textContent=L.mplede }
/* towns: every municipality, loaded only when someone types */
let TOWNS=null, tloading=false;
function loadTowns(){ if(tloading)return; tloading=true; fetch('data/municipios.json').then(r=>r.json()).then(a=>{ TOWNS=a.map(t=>[t[0],t[1],t[2],plain(t[0])]); chips($('#city').value) }).catch(()=>{tloading=false}) }
const kmBetween=(a,b,c,d)=>{ const R=6371,p=Math.PI/180,x=(d-b)*p*Math.cos((a+c)/2*p),y=(c-a)*p; return R*Math.sqrt(x*x+y*y) };
function pickTown(t){ const isl=t[1]<35.95||(t[2]>1.1&&t[1]<40.2); let near=[];
  if(!isl)near=MO.bricks.map(k=>[kmBetween(t[1],t[2],k.ll[0],k.ll[1]),k.n]).sort((a,b)=>a[0]-b[0]).slice(0,5);
  vsel={id:null,town:t,n:{es:t[0],en:t[0]},also:[],op:null,r:near.map(x=>x[1]),miss:[],src:[],km:Object.fromEntries(near.map(x=>[x[1],x[0]]))};
  $('#city').value=''; vBricks(vsel); renderVas() }
function renderTown(v){ const L=T[lang], p=v.r.length?vPct(v,yi):null, q=v.r.length&&yi>0?vPct(v,yi-1):null;
  let h='<div class="vk">'+v.town[0]+' · '+(D.dates[yi]?fmtDate(D.dates[yi]):(Y0+yi))+'</div>';
  if(!v.r.length){ h+='<div class="vd v-unk">'+L.visl+'</div><p>'+L.visl2+'</p>' }
  else { h+='<div class="vd v-part">'+L.vnear1+' '+v.town[0]+', '+L.vnear2+' '+(p==null?'·':num(p,0))+' %</div>';
    if(p!=null&&q!=null){ const d=Math.round(p)-Math.round(q); h+='<p class="why '+(d<0?'down':'up')+'">'+(d===0?L.vsame:Math.abs(d)+' '+(d>0?L.vup:L.vdown))+'.</p>' }
    h+='<p class="hon">'+L.vhon1+' '+v.town[0]+': '+L.vhon2+'</p>';
    h+='<p><b>'+L.vnearl+':</b> '+[...VO.bricks].sort((a,b)=>v.km[a.n]-v.km[b.n]).map(k=>k.n+' ('+Math.round(v.km[k.n])+' '+L.km+', '+(k.p[yi]==null?'·':k.p[yi]+' %')+')').join(', ')+'. <a href="#mapa">'+L.onmap+'</a></p>';
    if(yi!==N-1)h+='<p>'+L.vapprox+'</p>' }
  vsec.querySelector('.vtxt').innerHTML=h }

/* ---------- layer 3: your glass ---------- */
const VAS=(D.v||[]); let vsel=null;
try{ const s=localStorage.getItem('agua-city'); vsel=VAS.find(v=>v.id===s)||null }catch(e){}
if(!vsel)vsel=VAS[0]||null;
const plain=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const vsec=document.createElement('section'); vsec.className='basin vas'; vsec.id='tu-vaso';
vsec.innerHTML='<div class="bh"><h2></h2><div class="bm"><b>'+VAS.length+'</b><span></span></div></div><p class="lede tl2"></p>'+
 '<form class="vf" autocomplete="off"><label for="city"></label><input id="city" type="search" enterkeyhint="search"><div class="chips" role="list"></div></form>'+
 '<div class="vout"><div class="vtxt"></div><div class="vwall"><canvas></canvas></div></div>';
if(VAS.length)main.appendChild(vsec);
const vcv=vsec.querySelector('canvas');
const VO={cv:vcv,g:vcv.getContext('2d'),sec:vsec,bricks:[],vis:true,W:0,h:0,pats:null};
vcv.addEventListener('pointermove',e=>{ if(e.pointerType==='touch')return; hover=hit(VO,e); vcv.style.cursor=hover?'pointer':'default'; tip(e)});
vcv.addEventListener('pointerleave',()=>{hover=null; tip()});
vcv.addEventListener('click',e=>{const k=hit(VO,e); picked=(k&&!(picked&&picked.n===k.n))?k:null; showCard()});
function vPct(v,i){ const ks=v.r.map(n=>ALL.bricks.find(k=>k.n===n)).filter(Boolean); let c=0,w=0;
  ks.forEach(k=>{ if(i===N-1){c+=k.c;w+=k.v} else if(k.p[i]!=null){c+=k.c;w+=k.c*k.p[i]/100} }); return c?100*w/c:null }
function vBricks(v,later){ let i=0; VO.bricks=v.r.map(n=>ALL.bricks.find(k=>k.n===n)).filter(Boolean).sort((a,b)=>b.c-a.c).map(k=>({n:k.n,c:k.c,p:k.p,v:k.v,basin:k.basin,i:i++,tone:k.tone,cur:null,vel:0,x:0,y:0,w:0,h:0})); vcv.style.display=VO.bricks.length?'':'none'; if(!later)sizeVas() }
function sizeVas(){ const W=vcv.parentElement.clientWidth; if(!W||!VO.bricks.length)return; const Hh=W<520?200:260;
  const tot=VO.bricks.reduce((a,k)=>a+k.c,0), f=W*Hh/tot; squarify(VO.bricks,VO.bricks.map(k=>k.c*f),{x:0,y:0,w:W,h:Hh});
  VO.W=W; VO.h=Hh; vcv.style.width=W+'px'; vcv.style.height=Hh+'px'; vcv.width=Math.round(W*dpr); vcv.height=Math.round(Hh*dpr); VO.g.setTransform(dpr,0,0,dpr,0,0); VO.pats=ROCKS.map(c=>VO.g.createPattern(c,'repeat')) }
function chips(q){ const box=vsec.querySelector('.chips'); box.innerHTML=''; const all=[]; VAS.forEach(v=>{ all.push([v.n[lang],v]); v.also.forEach(a=>all.push([a,v])) });
  const m=all.filter(([n])=>!q||plain(n).includes(plain(q)));
  m.forEach(([n,v])=>{ const b=document.createElement('button'); b.type='button'; b.textContent=n; b.setAttribute('aria-pressed',v===vsel&&n===v.n[lang]); b.addEventListener('click',()=>pickCity(v)); box.appendChild(b) });
  let tw=[]; if(q&&plain(q).length>=2){ loadTowns(); if(TOWNS){ const pq=plain(q), have=new Set(m.map(([n])=>plain(n))); tw=TOWNS.filter(t=>t[3].includes(pq)&&!have.has(t[3])).sort((a,b)=>(b[3].startsWith(pq)?1:0)-(a[3].startsWith(pq)?1:0)).slice(0,8) } }
  tw.forEach(t=>{ const b=document.createElement('button'); b.type='button'; b.className='tw'; b.textContent=t[0]; b.addEventListener('click',()=>pickTown(t)); box.appendChild(b) });
  if(q&&!m.length&&!tw.length){ const p=document.createElement('p'); p.className='vno'; p.textContent=TOWNS?T[lang].vnone2:T[lang].vnone; box.appendChild(p) }
  return m.concat(tw.map(t=>[t[0],null,t])) }
function pickCity(v){ vsel=v; try{localStorage.setItem('agua-city',v.id)}catch(e){} $('#city').value=''; vBricks(v); renderVas() }
function renderVas(){ if(!VAS.length)return; const L=T[lang];
  vsec.querySelector('h2').textContent=L.vt; vsec.querySelector('.bm span').textContent=L.vn; vsec.querySelector('.tl2').textContent=L.vlede;
  vsec.querySelector('label').textContent=L.vlab; $('#city').placeholder=L.vph; chips($('#city').value);
  const v=vsel; if(!v)return; if(v.town){ renderTown(v); return } const p=vPct(v,yi), q=yi>0?vPct(v,yi-1):null;
  let h='<div class="vk">'+v.n[lang]+' · '+(D.dates[yi]?fmtDate(D.dates[yi]):(Y0+yi))+'</div>';
  h+='<div class="vd v-under">'+L.vbig+' '+(p==null?'·':num(p,0))+' %</div>';
  if(p!=null&&q!=null){ const d=Math.round(p)-Math.round(q); h+='<p class="why '+(d<0?'down':'up')+'">'+(d===0?L.vsame:Math.abs(d)+' '+(d>0?L.vup:L.vdown))+'.</p>' }
  h+='<p><b>'+L.vfrom+':</b> '+VO.bricks.map(k=>k.n+' ('+(k.p[yi]==null?'·':k.p[yi]+' %')+')').join(', ')+'.</p>';
  h+='<p><b>'+L.vby+':</b> '+v.op+'. '+v.note[lang]+'</p>';
  if(v.miss.length)h+='<p>'+L.vmiss+': '+v.miss.join(', ')+'.</p>';
  if(v.also.length)h+='<p>'+L.valso+': '+v.also.join(', ')+'.</p>';
  if(yi!==N-1)h+='<p>'+L.vapprox+'</p>';
  h+='<p class="srcs">'+L.src+': '+v.src.map(x=>'<a href="'+x.u+'" rel="noopener">'+x.t+'</a>').join(', ')+'</p>';
  vsec.querySelector('.vtxt').innerHTML=h }
$('#city').addEventListener('input',e=>chips(e.target.value));
vsec.querySelector('form').addEventListener('submit',e=>{ e.preventDefault(); const m=chips($('#city').value); if($('#city').value&&m.length){ m[0][1]?pickCity(m[0][1]):pickTown(m[0][2]) } });
if(vsel)vBricks(vsel,true);

const TES=(D.t||[]).map(t=>({t,k:ALL.bricks.find(k=>k.n===t.r),cur:null,vel:0})).filter(o=>o.k);
const TESN=new Map(TES.map(o=>[o.t.r,o]));
const tsec=document.createElement('section'); tsec.className='basin tes'; tsec.id='esconde';
tsec.innerHTML='<div class="bh"><h2></h2><div class="bm"><b>'+TES.length+'</b><span></span></div></div><p class="lede tl2"></p><div class="tlist"></div>';
if(TES.length)main.appendChild(tsec);
TES.forEach(o=>{ const a=document.createElement('article'); a.innerHTML='<div><canvas></canvas><p class="sk"></p></div><div class="tx"></div>'; tsec.querySelector('.tlist').appendChild(a);
  o.cv=a.querySelector('canvas'); o.g=o.cv.getContext('2d'); o.tx=a.querySelector('.tx'); o.sk=a.querySelector('.sk') });
function verdict(o){ const p=o.k.p[yi]; if(p==null)return null; const ob=o.t.obs;
  const up=s=>ob.filter(x=>x.s===s&&x.pct>=p).sort((a,b)=>a.pct-b.pct)[0];
  const out=up('fuera'); if(out)return {v:'out',o:out};
  const part=up('parcial'); if(part)return {v:'part',o:part};
  const un=ob.filter(x=>x.s==='cubierto'&&x.pct<=p).sort((a,b)=>b.pct-a.pct)[0]; if(un)return {v:'under',o:un};
  return {v:'unk'} }
const fmtMon=iso=>new Date(iso+'T12:00:00').toLocaleDateString(lang==='es'?'es-ES':'en-GB',{month:'short',year:'numeric'});
function renderTes(){ if(!TES.length)return; const L=T[lang];
  tsec.querySelector('h2').textContent=L.hid; tsec.querySelector('.bm span').textContent=L.hidn; tsec.querySelector('.tl2').textContent=L.hidlede;
  TES.forEach(o=>{ const t=o.t, p=o.k.p[yi], r=verdict(o); o.sk.textContent=L.sketch;
    let h='<div class="vd v-'+(r?r.v:'unk')+'">'+(r?L['v_'+r.v]:L.none)+'</div><h3>'+t.n[lang]+'</h3>';
    h+='<div class="tr">'+L.in+' '+t.r+' · <b>'+(p==null?L.none:p+' %')+'</b> · '+(D.dates[yi]?fmtDate(D.dates[yi]):(Y0+yi))+'</div>';
    if(r)h+='<p class="why">'+L['w_'+r.v]+(r.o?': '+r.o.note[lang].toLowerCase()+' ('+r.o.pct+' %, '+fmtMon(r.o.d)+').':'')+'</p>';
    h+='<p>'+t.txt[lang]+'</p><h4>'+L.seen+'</h4><ul>';
    t.obs.forEach(x=>{ h+='<li><b>'+x.pct+' %</b> · '+fmtDate(x.d)+' · '+L['s_'+x.s]+'. '+x.note[lang]+'. <a href="'+x.u+'" rel="noopener">'+x.t+'</a>'+(x.said?' ('+L.said+' '+x.said+')':'')+'</li>' });
    h+='</ul><p class="srcs">'+L.src+': '+t.src.map(x=>'<a href="'+x.u+'" rel="noopener">'+x.t+'</a>').join(', ')+'</p>';
    o.tx.innerHTML=h }) }
const TH=250;
function sizeTes(){ TES.forEach(o=>{ const W=o.cv.parentElement.clientWidth; if(!W)return; o.W=W; o.cv.style.width=W+'px'; o.cv.style.height=TH+'px'; o.cv.width=Math.round(W*dpr); o.cv.height=Math.round(TH*dpr); o.g.setTransform(dpr,0,0,dpr,0,0); o.pat=o.g.createPattern(ROCKS[0],'repeat') }) }
function drawTes(tm){ TES.forEach(o=>{ if(!o.W)return; const r=o.cv.getBoundingClientRect(); if(r.bottom<-50||r.top>innerHeight+50)return;
  const g=o.g, W=o.W, top=26, floor=TH-22, dam=W-18, lx0=0, lx1=W*0.36, span=floor-top, p=o.k.p[yi];
  const Yp=q=>floor-span*q/100, sx=y=>lx0+(y-top)/span*(lx1-lx0);
  g.clearRect(0,0,W,TH);
  g.beginPath(); g.moveTo(lx0,top); g.lineTo(dam,top); g.lineTo(dam,floor); g.lineTo(lx1,floor); g.closePath(); g.fillStyle=o.pat; g.fill();
  if(p!=null){ if(o.cur==null||still){o.cur=p;o.vel=0}else{o.vel+=(p-o.cur)*0.07;o.vel*=0.84;o.cur+=o.vel}
    const yw=Yp(Math.max(0,Math.min(100,o.cur)));
    g.save(); g.beginPath(); g.moveTo(lx0,top); g.lineTo(dam,top); g.lineTo(dam,floor); g.lineTo(lx1,floor); g.closePath(); g.clip();
    g.beginPath(); g.moveTo(0,yw); for(let X=0;X<=dam;X+=6)g.lineTo(X,yw+(still?0:Math.sin(X*0.05+tm*0.002)*2)); g.lineTo(dam,floor); g.lineTo(0,floor); g.closePath(); g.fillStyle='#3F93A8'; g.fill(); g.restore();
    g.fillStyle='#EEF1EC'; g.fillRect(sx(yw),yw-1.5,dam-sx(yw),3) }
  /* the figure stands between the highest level it was seen fully out and the lowest level it was seen covered (or the highest partial sighting) */
  const ob=o.t.obs, mx=(s)=>Math.max(...ob.filter(x=>x.s===s).map(x=>x.pct)), mn=(s)=>Math.min(...ob.filter(x=>x.s===s).map(x=>x.pct));
  let b=mx('fuera'), tp=mn('cubierto'); if(!isFinite(tp))tp=mx('parcial'); if(!isFinite(b))b=0; if(!isFinite(tp))tp=b+20;
  const yb=Yp(b), yt=Math.min(Yp(tp),yb-26), x0=sx(yb)+18;
  g.fillStyle='#0B1112'; g.strokeStyle='#EEF1EC'; g.lineWidth=1.5; g.lineJoin='round';
  const box=(x,y,w,h)=>{g.fillRect(x,y,w,h); g.strokeRect(x,y,w,h)};
  if(o.t.kind==='iglesia'){ const nh=Math.min(26,(yb-yt)*0.3); box(x0+16,yb-nh,40,nh); box(x0,yt+12,16,yb-yt-12); g.beginPath(); g.moveTo(x0-2,yt+12); g.lineTo(x0+8,yt); g.lineTo(x0+18,yt+12); g.closePath(); g.fill(); g.stroke() }
  else if(o.t.kind==='pueblo'){ [[0,0.55,22],[26,1,18],[48,0.7,24],[76,0.45,20]].forEach(([dx,f,w])=>{ const h=Math.max(12,(yb-yt)*f), x=x0+dx; box(x,yb-h+7,w,h-7); g.beginPath(); g.moveTo(x-2,yb-h+7); g.lineTo(x+w/2,yb-h); g.lineTo(x+w+2,yb-h+7); g.closePath(); g.fill(); g.stroke() }) }
  else { [0.78,1,0.86,0.94,0.7,0.9].forEach((f,i)=>{ const h=(yb-yt)*f; box(x0+i*13,yb-h,8,h) }) }
  /* sightings */
  g.font="600 10px 'IBM Plex Mono', monospace"; g.textBaseline='middle';
  let last=-99; [...ob].sort((a,b)=>b.pct-a.pct).forEach(x=>{ const y=Yp(x.pct); g.strokeStyle='#0B1112'; g.lineWidth=2; g.setLineDash([5,4]); g.beginPath(); g.moveTo(sx(y),y); g.lineTo(dam,y); g.stroke(); g.setLineDash([]);
    const s=x.pct+' % · '+T[lang]['s_'+x.s]+' · '+fmtMon(x.d), tw=g.measureText(s).width, lx=dam-10-tw, ly=Math.max(y,last+18); last=ly;
    g.fillStyle='#0B1112'; g.fillRect(lx-5,ly-8,tw+10,16); g.fillStyle='#EEF1EC'; g.fillText(s,lx,ly+0.5) });
  g.textBaseline='alphabetic';
  g.beginPath(); g.moveTo(dam,top-12); g.lineTo(dam+10,top-12); g.lineTo(dam+16,floor+4); g.lineTo(dam,floor+4); g.closePath(); g.fillStyle='#EEF1EC'; g.fill();
  g.fillStyle='#34403F'; g.fillRect(0,floor+4,W,2) }) }

D.basins.forEach(b=>mk(b,b.r,false));
const foot=document.createElement('footer'); main.appendChild(foot);
const io=new IntersectionObserver(es=>es.forEach(e=>{const o=basins.find(x=>x.sec===e.target); if(o)o.vis=e.isIntersecting}),{rootMargin:'300px'});
basins.forEach(o=>io.observe(o.sec));
let dpr=1;
function squarify(ks,areas,R){
  let i=0; const n=ks.length; const worst=(mx,mn,sum,side)=>Math.max(side*side*mx/(sum*sum),sum*sum/(side*side*mn));
  while(i<n){ const side=Math.min(R.w,R.h); let sum=areas[i], mx=areas[i], mn=areas[i], j=i+1;
    while(j<n){ const a=areas[j]; if(worst(Math.max(mx,a),Math.min(mn,a),sum+a,side)<=worst(mx,mn,sum,side)){sum+=a; mx=Math.max(mx,a); mn=Math.min(mn,a); j++} else break }
    const thick=sum/side; let off=0;
    for(let q=i;q<j;q++){ const len=areas[q]/thick, k=ks[q];
      if(R.w>=R.h){k.x=R.x; k.y=R.y+off; k.w=thick; k.h=len} else {k.x=R.x+off; k.y=R.y; k.w=len; k.h=thick}
      off+=len; k.x+=1; k.y+=1; k.w=Math.max(1,k.w-2); k.h=Math.max(1,k.h-2) }
    if(R.w>=R.h){R.x+=thick; R.w-=thick} else {R.y+=thick; R.h-=thick}
    i=j }
}
function layout(){
  dpr=Math.min(2,devicePixelRatio||1);
  const W=basins[0].cv.parentElement.clientWidth-2*parseFloat(getComputedStyle(basins[0].sec).paddingLeft); if(!(W>0))return;
  const K=Math.max(28,Math.min(64,W/19));
  basins.forEach(o=>{ let bw=W, bh;
    if(o.all){ bh=Math.round(Math.max(320,W<620?Math.min(innerHeight-230,W*1.5):Math.min(innerHeight-250,W*0.6)));
      const m=new Map(); o.bricks.forEach(k=>{ if(!m.has(k.basin))m.set(k.basin,{n:k.basin,bricks:[],cap:0}); const q=m.get(k.basin); q.bricks.push(k); q.cap+=k.c });
      const gs=[...m.values()].sort((a,b)=>b.cap-a.cap), f=W*bh/D.total; squarify(gs,gs.map(q=>q.cap*f),{x:0,y:0,w:W,h:bh});
      gs.forEach(q=>{ q.x+=2;q.y+=2;q.w=Math.max(2,q.w-4);q.h=Math.max(2,q.h-4); const ff=q.w*q.h/q.cap; squarify(q.bricks,q.bricks.map(k=>k.c*ff),{x:q.x,y:q.y,w:q.w,h:q.h}) });
      o.groups=gs;
    } else { const areas=o.bricks.map(k=>k.c*K), A=areas.reduce((a,b)=>a+b,0);
      bh=A/W; if(bh<150){ bw=Math.min(W,Math.sqrt(A*2.2)); bh=A/bw }
      squarify(o.bricks,areas,{x:0,y:0,w:bw,h:bh}); }
    o.h=Math.ceil(bh); o.W=Math.ceil(bw); o.cv.style.width=o.W+'px'; o.cv.style.height=o.h+'px'; o.cv.width=Math.round(o.W*dpr); o.cv.height=Math.round(o.h*dpr);
    o.g.setTransform(dpr,0,0,dpr,0,0); o.pats=ROCKS.map(c=>o.g.createPattern(c,'repeat')); });
  sizeTes(); sizeVas(); sizeMap();
}
function hit(o,e){const r=o.cv.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top; return (o.rev?[...o.bricks].reverse():o.bricks).find(k=>x>=k.x-1&&x<=k.x+k.w+1&&y>=k.y-1&&y<=k.y+k.h+1)||null}
function fitText(g,s,max){ if(g.measureText(s).width<=max)return s; let t=s; while(t.length>2&&g.measureText(t+'.').width>max)t=t.slice(0,-1); return t.length>2?t+'.':'' }
function draw(o,t){
  const g=o.g; g.clearRect(0,0,o.W,o.h); if(o.bg)o.bg(g);
  o.bricks.forEach(k=>{
    const p=k.p[yi], x=k.x, y=k.y, w=k.w, H=k.h;
    if(p==null){ k.cur=null; g.strokeStyle='#34403F'; g.lineWidth=1; g.setLineDash([3,3]); g.strokeRect(x+.5,y+.5,Math.max(1,w-1),H-1); g.setLineDash([]); return }
    if(k.cur==null||still){k.cur=p;k.vel=0}
    else if(t-tChange>k.i*2.2){ k.vel+=(p-k.cur)*0.075; k.vel*=0.83; k.cur+=k.vel }
    const cur=Math.max(0,Math.min(100,k.cur)), yw=y+H*(1-cur/100);
    g.fillStyle=o.pats[k.tone]; g.fillRect(x,y,w,H);
    if(cur>0.4){
      g.fillStyle=WATER[k.tone]; g.beginPath(); g.moveTo(x,y+H);
      const amp=still?0:Math.min(2.2,H*cur/100*0.5,H*0.05);
      for(let X=x;X<x+w;X+=5){g.lineTo(X,yw+Math.sin((X+o.sec.offsetTop*0.3)*0.06+t*0.0022)*amp)}
      g.lineTo(x+w,yw+Math.sin((x+w+o.sec.offsetTop*0.3)*0.06+t*0.0022)*amp); g.lineTo(x+w,y+H); g.closePath(); g.fill();
      g.fillStyle='rgba(11,17,18,.16)'; g.fillRect(x,y+H-Math.min(8,H*0.1,H*cur/100),w,Math.min(8,H*0.1,H*cur/100));
    }
    const p0=k.p[N-1];
    if(yi!==N-1&&p0!=null){const y0=y+H*(1-p0/100); g.strokeStyle='#0B1112'; g.lineWidth=2; g.setLineDash([4,3]); g.beginPath(); g.moveTo(x,y0); g.lineTo(x+w,y0); g.stroke(); g.setLineDash([])}
    g.fillStyle='#0B1112';
    if(w>=74&&H>=46){ g.font="800 14px Archivo, Arial, sans-serif"; const s=fitText(g,k.n,w-14); if(s)g.fillText(s,x+7,y+H-24);
      g.font="600 12px 'IBM Plex Mono', monospace"; g.fillText(Math.round(cur)+' %',x+7,y+H-9) }
    else if(w>=40&&H>=20){ g.font="700 11px Archivo, Arial, sans-serif"; const s=fitText(g,k.n,w-8); if(s)g.fillText(s,x+4,y+H-6) }
    else if(H>=44&&w>=15){ g.save(); g.translate(x+w/2+4,y+H-5); g.rotate(-Math.PI/2); g.font="700 11px Archivo, Arial, sans-serif"; const s=fitText(g,k.n,H-10); if(s)g.fillText(s,0,0); g.restore() }
    if(TESN.has(k.n)&&w>20&&H>20){ g.fillStyle='#0B1112'; g.beginPath(); g.moveTo(x+w-10,y+4); g.lineTo(x+w-4,y+10); g.lineTo(x+w-10,y+16); g.lineTo(x+w-16,y+10); g.closePath(); g.fill() }
    if((hover&&k.n===hover.n)||(picked&&k.n===picked.n)){ g.strokeStyle='#0B1112'; g.lineWidth=4; g.strokeRect(x+2,y+2,w-4,H-4); g.strokeStyle='#EEF1EC'; g.lineWidth=2; g.strokeRect(x-1,y-1,w+2,H+2) }
  });
  if(o.groups){ g.font="800 11px Archivo, Arial, sans-serif"; o.groups.forEach(q=>{ const s=q.n.toUpperCase(), tw=g.measureText(s).width; if(q.w<tw+16||q.h<26)return;
    g.fillStyle='#0B1112'; g.fillRect(q.x,q.y,tw+12,19); g.fillStyle='#EEF1EC'; g.fillText(s,q.x+6,q.y+13.5) }) }
  if(o.fg)o.fg(g);
}
/* card with tree rings */
const lerp=(a,b,t)=>'#'+[1,3,5].map(i=>{const x=parseInt(a.substr(i,2),16),y=parseInt(b.substr(i,2),16);return Math.round(x+(y-x)*t).toString(16).padStart(2,'0')}).join('');
function showCard(){
  const k=picked, card=$('#card'); if(!k){card.hidden=true;return} card.hidden=false;
  let s='<svg viewBox="0 0 312 64" width="100%" role="img" aria-label="'+T[lang].ring+'">';
  k.p.forEach((p,j)=>{ const x=j*8; if(p==null){s+='<rect x="'+(x+.5)+'" y=".5" width="6" height="55" fill="none" stroke="#34403F" stroke-dasharray="2 2"/>'}
    else{const h=56*p/100; s+='<rect x="'+x+'" y="0" width="7" height="56" fill="#CDB98F"/><rect x="'+x+'" y="'+(56-h).toFixed(1)+'" width="7" height="'+h.toFixed(1)+'" fill="#3F93A8"/>'}
    if(j===yi)s+='<rect x="'+x+'" y="59" width="7" height="4" fill="#EEF1EC"/>' });
  $('#ring').innerHTML=s+'</svg><div class="hx"><span>1988</span><span>'+T[lang].ring+'</span><span>2026</span></div>';
  const p=k.p[yi]; $('#cn').textContent=k.n; $('#cp').textContent=p==null?T[lang].none:p+' %  ·  '+(Y0+yi);
  let best=-1,worst=-1; k.p.forEach((v,j)=>{ if(v==null)return; if(best<0||v>k.p[best])best=j; if(worst<0||v<k.p[worst])worst=j});
  $('#cd').innerHTML=k.basin+' · '+T[lang].cap+' '+hm(k.c)+' hm3<br>'+T[lang].now+' '+k.p[N-1]+' % ('+hm(k.v)+' hm3) · '+T[lang].best+' '+(Y0+best)+' ('+k.p[best]+' %) · '+T[lang].worst+' '+(Y0+worst)+' ('+k.p[worst]+' %)'+(TESN.has(k.n)?'<br><a href="#esconde">'+T[lang].hides+': '+TESN.get(k.n).t.n[lang]+'</a>':'');
  $('#loc').innerHTML=locSvg(k); if(LL[k.n])$('#cd').innerHTML+=' · <a href="#mapa">'+T[lang].onmap+'</a>';
}
function tip(e){ const el=$('#tip'); if(!e||!hover){el.hidden=true;return} const p=hover.p[yi]; el.textContent=hover.n+' · '+(p==null?T[lang].none:p+' %'); el.hidden=false;
  el.style.left=Math.max(8,Math.min(e.clientX+14,innerWidth-el.offsetWidth-8))+'px'; el.style.top=Math.min(e.clientY+18,innerHeight-el.offsetHeight-8)+'px' }
$('#cx').addEventListener('click',()=>{picked=null;hover=null;showCard()});

/* year strip */
const bars=$('#bars'); const dryest=D.nat.indexOf(Math.min(...D.nat.filter(v=>v!=null)));
D.nat.forEach((v,i)=>{const b=document.createElement('i'); b.style.height=(v||0)+'%'; if(i===dryest)b.className='dryest'; bars.appendChild(b)});
let natCur=D.nat[yi];
function setYear(i){ yi=Math.max(0,Math.min(N-1,i)); tChange=performance.now(); $('#year').value=Y0+yi; $('#yl').textContent=Y0+yi;
  [...bars.children].forEach((b,k)=>{b.classList.toggle('on',k===yi); b.classList.toggle('later',k>yi)});
  $('#when').textContent=(D.dates[yi]?fmtDate(D.dates[yi]):(Y0+yi)+' · '+T[lang].nodata)+(yi===N-1?' · '+T[lang].today+' · '+hm(D.stored)+' / '+hm(D.total)+' hm3':'');
  basins.forEach(o=>{const p=o.b.p[yi]; o.pct.textContent=p==null?'':p+' %'; o.cnt.textContent=o.bricks.filter(k=>k.p[yi]!=null).length+' '+T[lang].res});
  if(still||D.nat[yi]==null)$('#nat').textContent=D.nat[yi]==null?'· %':num(D.nat[yi],1)+' %'; showCard(); renderTes(); renderVas(); renderMap(); }
function setLang(l){ lang=l; document.documentElement.lang=l; $('#l-es').setAttribute('aria-pressed',l==='es'); $('#l-en').setAttribute('aria-pressed',l==='en');
  lines.forEach((o,j)=>{o.dry.textContent=T[l].h[j]; o.wet.textContent=T[l].h[j]}); h1.setAttribute('aria-label',T[l].h.join(' '));
  $('#lede').innerHTML=T[l].lede; $('#sl').textContent=T[l].strip; foot.innerHTML='<div>'+T[l].foot+'</div><nav><a href="creditos.html">'+T[l].credits+'</a><a href="https://ko-fi.com/lessane" rel="noopener">'+T[l].kofi+'</a><a href="https://github.com/lessane-land/agua" rel="noopener">'+T[l].code+'</a></nav>'; $('#cx').setAttribute('aria-label',T[l].close); $('#year').setAttribute('aria-label',T[l].year); try{localStorage.setItem('agua-lang',l)}catch(e){} ALL.sec.querySelector('h2').textContent=T[l].all; fitHead(); setYear(yi) }
function stop(){clearInterval(playing); playing=null; $('#pi').innerHTML='<path d="M3 1.5v13l11-6.5z" fill="currentColor"/>'; $('#play').setAttribute('aria-label',T[lang].play)}
$('#play').addEventListener('click',()=>{ if(playing){stop();return}
  if(yi===N-1)setYear(0); $('#pi').innerHTML='<path d="M3 2h4v12H3zM9 2h4v12H9z" fill="currentColor"/>'; $('#play').setAttribute('aria-label',T[lang].pause);
  playing=setInterval(()=>{ if(yi>=N-1){stop();return} setYear(yi+1)},650)});
$('#year').addEventListener('input',e=>{if(playing)stop(); setYear(+e.target.value-Y0)});
$('#l-es').addEventListener('click',()=>setLang('es')); $('#l-en').addEventListener('click',()=>setLang('en'));
let rz; addEventListener('resize',()=>{clearTimeout(rz); rz=setTimeout(()=>{fitHead(); layout()},80)});
function frame(t){
  const n=D.nat[yi]==null?natCur:D.nat[yi]; if(!still&&D.nat[yi]!=null){natCur+=(n-natCur)*0.12; if(Math.abs(n-natCur)<0.04)natCur=n; $('#nat').textContent=num(natCur,1)+' %'}
  lines.forEach((o,j)=>{ const tg=levelPx(o.fs,still?n:natCur); if(o.cur==null||still){o.cur=tg}else{o.vel+=(tg-o.cur)*0.08; o.vel*=0.8; o.cur+=o.vel}
    o.wet.style.setProperty('--y',o.cur.toFixed(1)+'px'); if(!still)o.wet.style.setProperty('--x',((t*0.025+j*40)%120).toFixed(1)+'px') });
  basins.forEach(o=>{ if(o.vis)draw(o,t) }); drawTes(t); if(MO.W){ const r=mcv.getBoundingClientRect(); if(r.bottom>-50&&r.top<innerHeight+50)draw(MO,t) } if(VO.bricks.length&&VO.W){ const r=vcv.getBoundingClientRect(); if(r.bottom>-50&&r.top<innerHeight+50)draw(VO,t) }
  requestAnimationFrame(frame);
}
setLang(lang); layout();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fitHead(); layout()});
requestAnimationFrame(frame);
}
