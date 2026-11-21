const OWNER=window.OWNER===true;
let cur=-1,edit=OWNER,photos=Object.assign({},PHOTOS);
if(OWNER){
 try{const d=JSON.parse(localStorage.getItem('fc_data')||'null');if(d&&d.length)STALLS=d}catch(e){}
 try{Object.assign(photos,JSON.parse(localStorage.getItem('fc_photos')||'{}'))}catch(e){}
}
STALLS.forEach(s=>s.menu.forEach((m,i)=>{if(!m.k)m.k=s.id+i}));
const T={
 tag:"Fresh, local, made for you",
 foot:"Tap any item for full details",
 all:"← All stalls",
 welcome:"Welcome",
 pick:"Pick a stall",
 choose:"Choose a shop to see its full menu.",
 view:"View menu →",
 items:n=>`${n} items on the menu`,
 veg:"Veg",
 nonveg:"Non-veg",
 vegn:"Vegetarian",
 nonvegn:"Non-vegetarian",
 add:"+ Add",
 soldout:"Sold out",
 itemw:n=>n>1?'items':'item',
 viewcart:"View cart →",
 yourcart:"Your cart",
 each:"each",
 total:"Total",
 tablenum:"Table number",
 note:"Note for the stalls (optional)",
 noteph:"Less sugar, no ice…",
 place:"Place order",
 placed:"Order placed!",
 order:"Order",
 table:"Table",
 pay:"Please pay at the counter. A waiter will bring your food to your table.",
 wa:"Send order on WhatsApp",
 done:"Done",
 welcomeT:"Welcome!",
 changeT:"Change table",
 confirmQ:"Please confirm your table number",
 whichT:"Which table are you sitting at?",
 sticker:"The number is on the sticker on your table",
 selectT:"Select your table",
 confirmN:n=>`Confirm Table ${n}`
};
const t=(k,n)=>{const v=T[k];return typeof v==='function'?v(n):v};
const $=id=>document.getElementById(id);
const pid=i=>STALLS[cur].menu[i].k;
const nm=n=>{const w=n.split(' ');return w.length>1?`<span>${w[0]}</span>${w.slice(1).join(' ')}`:n};
const ph=(m,id)=>{const s=photos[id]||m.img;return `<span>${m.e}</span>${s?`<img src="${s}" alt="" onerror="this.remove()">`:''}`};

function renderHome(){
 $('home').innerHTML=`<div class="hi"><div class="sc">${t('welcome')}</div><h1>${t('pick')}</h1><p>${t('choose')}</p></div>
 <div class="sgrid${edit?' edit':''}">${STALLS.map((s,i)=>`<div class="sk" style="--i:${i};background:${s.c1};color:${s.t1}" onclick="cur=${i};render();window.scrollTo({top:0})">
 <div class="ph" onclick="sphClick(event,${i})">${ph(s,'stall-'+s.id)}</div>
 <div class="sn">${s.name}</div><div class="ss">${s.script}</div><p>${s.tag}</p>
 <span class="go" style="background:${s.c2};color:${s.t2}">${t('view')}</span>${edit?`<button class="eb2" style="margin:10px auto 0" onclick="event.stopPropagation();openStall(${i})">✏️ Edit stall</button>`:''}</div>`).join('')}</div>`;
}
function render(keep){document.body.classList.toggle("noanim",!!keep);
 $('note').innerHTML=edit?'<div class="note">Owner mode: tap ✏️ Edit on any item or stall, or + Add item. Tap a round photo to add a picture. Changes stay in this browser until you tap Download menu-data.js and replace that file on your website.</div>':'';
 $('eb').textContent=edit?'👁 Preview as customer':'✏️ Back to editing';
 $('tools').innerHTML=edit?'<button onclick="openBg()">🖼 Background photos</button> <button onclick="openEl()">Scattered elements</button> <button onclick="downloadData()">⬇ Download menu-data.js</button> <button onclick="resetData(this)">↺ Discard my changes</button>':'';
 const home=cur<0;
 $('home').style.display=home?'':'none';$('mv').style.display=home?'none':'';$('back').style.display=home?'none':'';
 if(home){renderHome();return}
 const s=STALLS[cur];
 $('tabs').innerHTML=STALLS.map((x,i)=>`<button class="tab" style="border-color:${x.c1};${i===cur?`background:${x.c1};color:${x.t1}`:''}" onclick="cur=${i};render();window.scrollTo({top:0})">${x.name}</button>`).join('');
 const h=$('hero');h.style.cssText=`background:${s.c1};color:${s.t1};--c2:${s.c2}`;
 h.innerHTML=`<div class="sc">${s.script}</div><h1>${s.name}</h1><p>${s.tag}</p><span class="cnt">${t('items',s.menu.length)}</span>${edit?`<button class="eb2" style="display:inline-block;margin-left:8px" onclick="openStall(${cur})">✏️ Edit stall</button>`:''}`;
 $('grid').className='grid'+(edit?' edit':'');
 $('grid').innerHTML=s.menu.map((m,i)=>{const bg=i%2?s.c2:s.c1,fg=i%2?s.t2:s.t1;
  return `<div class="it${m.out?' out':''}" style="--i:${i};background:${bg};color:${fg}" onclick="openIt(${i})">
  <div class="ph" onclick="phClick(event,${i})">${ph(m,pid(i))}</div>
  <div class="pr" style="color:${bg}"><small>₹</small><b>${m.p}</b></div>
  <h3>${nm(m.n)}</h3><p class="d">${m.d}</p>
  <div class="ft"><span class="tg"><i style="background:${m.v?'#2b8a3e':'#e03131'}"></i>${m.v?t('veg'):t('nonveg')}</span>${edit?'':ctl(m.k)}</div>${edit?`<button class="eb2" onclick="event.stopPropagation();openEdit(${i})">✏️ Edit</button>`:''}</div>`}).join('')+(edit?'<div class="it add" onclick="openEdit(-1)">+ Add item</div>':'');
}
function openIt(i){openState=()=>openIt(i);
 const s=STALLS[cur],m=s.menu[i],bg=s.c1,fg=s.t1;
 const sh=$('sheet');sh.style.cssText=`background:${bg};color:${fg}`;
 sh.innerHTML=`<button class="x" onclick="closeIt()">✕</button><div class="big">${ph(m,pid(i))}</div>
 <h2>${nm(m.n)}</h2><div class="big-p">₹${m.p}</div><p>${m.d}</p>
 <div style="text-align:center"><span class="tg"><i style="background:${m.v?'#2b8a3e':'#e03131'}"></i>${m.v?t('vegn'):t('nonvegn')}</span> <span class="tg">${s.name}</span></div>${edit?'':`<div style="text-align:center;margin-top:16px">${ctl(m.k)}</div>`}`;
 $('ov').classList.add('on');
}
const WHATSAPP=''; /* optional: shop WhatsApp number with country code, no +, e.g. '919XXXXXXXXX' */
const TABLES=20;
let elT,elSheet=false,bgSheet=false,lastAdd=null,lastT,toastT,undoK=null,cart={},openState=null,tableNo=parseInt(new URLSearchParams(location.search).get('table'))||1;
const findItem=k=>{for(const s of STALLS){const m=s.menu.find(x=>x.k===k);if(m)return{s,m}}};
const cnt=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const tot=()=>Object.entries(cart).reduce((t,[k,q])=>{const f=findItem(k);return t+(f?f.m.p*q:0)},0);
const ctl=k=>{const q=cart[k]||0;const f=findItem(k);if(!q&&f&&f.m.out)return `<span class="so">${t('soldout')}</span>`;return q?`<div class="stp" onclick="event.stopPropagation()"><button onclick="chg('${k}',-1,this)">−</button><b${lastAdd===k?` class="tk" data-q="${q}"`:''}>${lastAdd===k?'✓':q}</b><button onclick="chg('${k}',1,this)">+</button></div>`:`<button class="add2" onclick="event.stopPropagation();chg('${k}',1,this)">${t('add')}</button>`};
document.body.insertAdjacentHTML('beforeend','<div id="toast"></div>');
function flash(k){
 lastAdd=k;clearTimeout(lastT);
 lastT=setTimeout(()=>{lastAdd=null;document.querySelectorAll('.stp b.tk').forEach(b=>{b.classList.remove('tk');b.textContent=b.dataset.q})},1000);
}
function toast(msg,k){
 const el=$('toast');undoK=k;
 el.innerHTML=`<span>${msg}</span><button onclick="undoAdd()">Undo</button>`;
 el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),3500);
}
function undoAdd(){if(!undoK)return;const k=undoK;undoK=null;$('toast').classList.remove('on');chg(k,-1)}
const prog=n=>'<div class="pg">'+['Cart','Table','Placed'].map((s,i)=>{const dn=n===3||i<n-1,cu=i===n-1&&n<3;return (i?`<u class="${i<n?'on':''}"></u>`:'')+`<div class="ps${dn?' dn':''}${cu?' cu':''}"><i>${dn?'✓':i+1}</i><span>${s}</span></div>`}).join('')+'</div>';
function confetti(){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const cols=['#FFD500','#46CC21','#DC592C','#0C9BED','#E09B57','#ffffff'];
 for(let i=0;i<46;i++){
  const d=document.createElement('i');d.className='cf';
  d.style.cssText=`left:50%;top:45%;background:${cols[i%6]};width:${6+Math.random()*6}px;height:${8+Math.random()*8}px;border-radius:${i%3?'2px':'50%'}`;
  document.body.appendChild(d);
  const x=(Math.random()-.5)*Math.min(innerWidth,700),y=-(120+Math.random()*220);
  d.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${x*.6}px,${y}px) rotate(${Math.random()*360}deg)`,opacity:1,offset:.45},{transform:`translate(${x}px,${y+520}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1400+Math.random()*700,easing:'cubic-bezier(.2,.7,.4,1)'}).onfinish=()=>d.remove();
 }
}
function chg(k,d,el){
 const q=Math.max(0,(cart[k]||0)+d);if(q)cart[k]=q;else delete cart[k];
 if(d>0){fly(el,k);flash(k);const f=findItem(k);if(f)toast('✓ Added '+f.m.n,k)}
 render(true);bar();if(openState)openState();
}
function fly(el,k){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const r=el.getBoundingClientRect(),f=findItem(k),d=document.createElement('div');
 d.className='fly';d.textContent=f?f.m.e:'🍽️';d.style.left=r.left+r.width/2-16+'px';d.style.top=r.top+'px';document.body.appendChild(d);
 const dx=innerWidth/2-(r.left+r.width/2),dy=innerHeight-50-r.top;
 d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.4}px,${dy*.25-70}px) scale(1.3)`,opacity:1,offset:.4},{transform:`translate(${dx}px,${dy}px) scale(.3)`,opacity:.5}],{duration:650,easing:'ease-in-out'}).onfinish=()=>d.remove();
}
function bar(){
 const n=cnt(),b=$('bar');
 if(n&&!edit){b.innerHTML=`<span>🛒 <i id="bn" style="font-style:normal">${n}</i> ${t('itemw',n)}</span><span>₹${tot()} · ${t('viewcart')}</span>`;b.classList.add('on');const i=$('bn');i.classList.add('bump')}
 else b.classList.remove('on');
}
function openCart(){
 const tn=$('tn')?+$('tn').value:tableNo,nv=$('nt')?$('nt').value:'';tableNo=tn;
 const ent=Object.entries(cart).map(([k,q])=>({k,q,f:findItem(k)})).filter(x=>x.f);
 if(!ent.length){closeIt();return}
 const g={};ent.forEach(x=>(g[x.f.s.name]=g[x.f.s.name]||[]).push(x));
 showSheet(`<h2 style="font-size:24px;margin-bottom:6px">${t('yourcart')}</h2>${prog(2)}`+Object.entries(g).map(([n,a])=>`<div class="cg">${n}</div>`+a.map(x=>`<div class="cr"><span class="ce">${x.f.m.e}</span><div class="cn">${x.f.m.n}<small>₹${x.f.m.p} ${t('each')}</small></div>${ctl(x.k)}<b class="cp">₹${x.f.m.p*x.q}</b></div>`).join('')).join('')+
 `<div class="ct"><span>${t('total')}</span><b>₹${tot()}</b></div>
 <label>${t('tablenum')}<select id="tn">${Array.from({length:TABLES},(_,i)=>`<option ${tableNo===i+1?'selected':''}>${i+1}</option>`).join('')}</select></label>
 <label>${t('note')}<input id="nt" value="${esc(nv)}" placeholder="${t('noteph')}"></label>
 <button class="fb ok" onclick="placeOrder()">${t('place')} · ₹${tot()}</button>`);
 openState=openCart;
}
function placeOrder(){
 const tn=+$('tn').value,note=$('nt').value.trim(),ent=Object.entries(cart).map(([k,q])=>({q,f:findItem(k)})).filter(x=>x.f);
 let no=1;try{no=(+localStorage.getItem('fc_no')||0)+1;localStorage.setItem('fc_no',no)}catch(e){}
 const lines=ent.map(x=>`${x.q} x ${x.f.m.n} (${x.f.s.name}) - ₹${x.f.m.p*x.q}`),total=tot();
 const text=`New order #${no}\nTable ${tn}\n`+lines.join('\n')+`\nTotal: ₹${total}`+(note?`\nNote: ${note}`:'');
 tableNo=tn;if(!OWNER)setTbl();cart={};render(true);bar();
 showSheet(`<div class="done">${prog(3)}<svg viewBox="0 0 52 52" width="84" height="84"><circle cx="26" cy="26" r="24" fill="none" stroke="#2b8a3e" stroke-width="3" class="dc"/><path d="M14 27l8 8 16-17" fill="none" stroke="#2b8a3e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="dk"/></svg>
 <h2 style="font-size:24px">${t('placed')}</h2><p>${t('order')} #${no} · ${t('table')} ${tn}</p><pre>${esc(lines.join('\n'))}\nTotal: ₹${total}${note?'\nNote: '+esc(note):''}</pre>
 <p>${t('pay')}</p>
 ${WHATSAPP?`<a class="fb ok" style="display:block;text-decoration:none" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${t('wa')}</a>`:''}
 <button class="fb" onclick="closeIt()">${t('done')}</button></div>`);
 confetti();
}
const esc=t=>String(t==null?'':t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function persist(){try{localStorage.setItem('fc_data',JSON.stringify(STALLS))}catch(e){}}
function showSheet(h){openState=null;const sh=$('sheet');sh.style.cssText='background:var(--card);color:var(--text)';sh.innerHTML='<button class="x" onclick="closeIt()">✕</button>'+h;$('ov').classList.add('on')}
function openEdit(i){
 const m=i<0?{n:'',p:'',v:1,e:'🍽️',d:''}:STALLS[cur].menu[i];
 showSheet(`<h2 style="font-size:22px;margin-bottom:14px">${i<0?'Add item':'Edit item'}</h2>
 <label>Name<input id="f-n" value="${esc(m.n)}"></label>
 <label>Price (₹)<input id="f-p" type="number" inputmode="numeric" value="${esc(m.p)}"></label>
 <label>Details (ingredients, spice level, allergens)<textarea id="f-d" rows="3">${esc(m.d)}</textarea></label>
 <label style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="f-o" ${m.out?'checked':''} style="width:auto;margin:0"> Sold out (customers can't add it)</label>
 <div class="two"><label>Type<select id="f-v"><option value="1" ${m.v?'selected':''}>Veg</option><option value="0" ${m.v?'':'selected'}>Non-veg</option></select></label>
 <label>Emoji<input id="f-e" value="${esc(m.e)}"></label></div>
 <button class="fb" onclick="saveItem(${i})">Save</button>${i>=0?`<button class="fb del" onclick="delItem(${i})">Delete item</button>`:''}`);
}
function saveItem(i){
 const n=$('f-n').value.trim();if(!n){$('f-n').focus();return}
 const o={n,p:Number($('f-p').value)||0,d:$('f-d').value.trim(),v:+$('f-v').value,e:$('f-e').value.trim()||'🍽️',out:$('f-o').checked};
 const menu=STALLS[cur].menu;
 if(i<0){o.k=STALLS[cur].id+'n'+Date.now();o.img='';menu.push(o)}else Object.assign(menu[i],o);
 persist();closeIt();render();
}
function delItem(i){const b=event.target;if(!b.dataset.s){b.dataset.s=1;b.textContent='Tap again to confirm delete';return}
 STALLS[cur].menu.splice(i,1);persist();closeIt();render()}
function openStall(i){
 const s=STALLS[i];
 showSheet(`<h2 style="font-size:22px;margin-bottom:14px">Edit stall</h2>
 <label>Stall name<input id="g-n" value="${esc(s.name)}"></label>
 <label>Short tagline (script text)<input id="g-s" value="${esc(s.script)}"></label>
 <label>Description<input id="g-t" value="${esc(s.tag)}"></label>
 <button class="fb" onclick="saveStall(${i})">Save</button>`);
}
function saveStall(i){
 const s=STALLS[i],n=$('g-n').value.trim();if(!n)return;
 s.name=n;s.script=$('g-s').value.trim();s.tag=$('g-t').value.trim();persist();closeIt();render();
}
function downloadData(){
 const t='/* Generated by owner.html */\nlet STALLS='+JSON.stringify(STALLS,null,1)+';\nconst PHOTOS='+JSON.stringify(photos)+';\n';
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/javascript'}));a.download='menu-data.js';
 document.body.appendChild(a);a.click();a.remove();
}
function resetData(b){if(!b.dataset.s){b.dataset.s=1;b.textContent='Tap again to confirm reset';return}
 try{localStorage.removeItem('fc_data');localStorage.removeItem('fc_photos')}catch(e){}location.reload()}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeIt()});
function closeIt(){openState=null;bgSheet=false;elSheet=false;$('ov').classList.remove('on')}
function toggleEdit(){edit=!edit;render()}
function phClick(e,i){if(!edit)return;e.stopPropagation();pickPhoto(pid(i))}
function sphClick(e,i){if(!edit)return;e.stopPropagation();pickPhoto('stall-'+STALLS[i].id)}
function pickPhoto(key){
 const f=document.createElement('input');f.type='file';f.accept='image/*';
 f.onchange=()=>{const file=f.files[0];if(!file)return;const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
   const k=Math.min(1,(key.startsWith("bg")?900:480)/Math.max(im.width,im.height)),c=document.createElement('canvas');
   c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);
   photos[key]=c.toDataURL('image/jpeg',key.startsWith('bg')?.7:.8);
   try{localStorage.setItem('fc_photos',JSON.stringify(photos))}catch(err){}
   render();applyBg();if(bgSheet&&$('ov').classList.contains('on'))openBg()};im.src=r.result};r.readAsDataURL(file)};
 f.click();
}
try{const t=parseInt(new URLSearchParams(location.search).get('table'));if(t)$('tbl').textContent='Table '+t}catch(e){}
render();

/* ---- Table number popup (customer page) ---- */
let tsel=0;
function setTbl(){$('tbl').textContent=t('table')+' '+tableNo+' ▾'}
function pickT(n){
 tsel=n;
 document.querySelectorAll('#tp .tpg button').forEach(b=>b.classList.toggle('on',+b.textContent===n));
 const b=document.querySelector('#tp .tpb');b.disabled=false;b.textContent=t('confirmN',n);
}
function confirmT(){
 if(!tsel)return;
 tableNo=tsel;try{sessionStorage.setItem('fc_table',tsel)}catch(e){}
 setTbl();document.body.style.overflow='';
 const el=$('tp');el.classList.add('out');setTimeout(()=>el.remove(),300);
}
function askTable(change){
 if($('tp'))return;
 const q=parseInt(new URLSearchParams(location.search).get('table'))||0;
 const el=document.createElement('div');el.id='tp';
 el.innerHTML=`<div class="tpc"><div class="tpe">🍽️</div><h2>${change?t('changeT'):t('welcomeT')}</h2>
 <p>${q&&!change?t('confirmQ'):t('whichT')}</p>
 <div class="tpg">${Array.from({length:TABLES},(_,i)=>`<button onclick="pickT(${i+1})">${i+1}</button>`).join('')}</div>
 <small>${t('sticker')}</small>
 <button class="tpb" disabled onclick="confirmT()">${t('selectT')}</button>
 ${change?'<button class="tpx" onclick="confirmT()" style="display:none"></button>':''}</div>`;
 document.body.appendChild(el);document.body.style.overflow='hidden';
 const pre=change?tableNo:q;if(pre&&pre<=TABLES)pickT(pre);
}
if(!OWNER){
 const pill=$('tbl');pill.style.cursor='pointer';pill.title='Change table';pill.onclick=()=>askTable(true);
 let st=0;try{st=+sessionStorage.getItem('fc_table')||0}catch(e){}
 const q=parseInt(new URLSearchParams(location.search).get('table'))||0;
 if(st&&(!q||q===st)){tableNo=st;setTbl()}else askTable(false);
}

/* ---- Background photos (add up to 3 from owner.html, or put images/bg1.jpg, bg2.jpg, bg3.jpg in your folder) ---- */
function applyBg(){
 let c=$('bgp');
 if(!c){c=document.createElement('div');c.id='bgp';c.innerHTML='<div class="bgp bgp1"></div><div class="bgp bgp2"></div><div class="bgp bgp3"></div>';document.body.appendChild(c)}
 [1,2,3].forEach(i=>{
  const el=c.children[i-1],src=photos['bg'+i]||'images/bg'+i+'.jpg',im=new Image();
  im.onload=()=>{el.style.backgroundImage='url("'+src+'")';el.classList.add('on')};
  im.onerror=()=>{el.classList.remove('on');el.style.backgroundImage='none'};
  im.src=src;
 });
 applyScatter();
}
function openBg(){
 const pos=['Top right','Bottom left','Bottom right'];
 showSheet(`<h2 style="font-size:22px;margin-bottom:6px">Background photos</h2>
 <p style="text-align:left;font-size:12px;margin-bottom:8px">Add up to 3 real food photos. They fade softly into the page background. Bright, simple photos work best.</p>`+
 [1,2,3].map(i=>{const p=photos['bg'+i];return `<div class="bgr"><div class="bgt" style="${p?`background-image:url(${p})`:''}"></div><div style="flex:1"><b>Photo ${i}</b><br><small>${pos[i-1]}</small></div>
 <button class="fb" style="width:auto;padding:8px 14px;margin:0" onclick="pickPhoto('bg${i}')">${p?'Change':'Upload'}</button>${p?`<button class="fb del" style="width:auto;padding:8px 14px;margin:0 0 0 6px" onclick="delBg(${i})">Remove</button>`:''}</div>`}).join(''));
 bgSheet=true;
}
function delBg(i){delete photos['bg'+i];try{localStorage.setItem('fc_photos',JSON.stringify(photos))}catch(e){}applyBg();openBg()}

/* ---- Small blurry food elements scattered in the background.
   Only the images YOU upload (owner page > Scattered elements) are used. ---- */
function applyScatter(){
 let c=$('sct');
 if(!c){c=document.createElement('div');c.id='sct';document.body.appendChild(c)}
 const els=Object.entries(photos).filter(([k])=>k.startsWith('el-')).map(x=>x[1]);
 c.innerHTML='';if(!els.length)return;
 const mob=innerWidth<600,cols=mob?3:6,rows=mob?6:4,f=document.createDocumentFragment();
 for(let i=0;i<cols*rows;i++){
  const r=n=>{const x=Math.sin((i+1)*12.9898+n*78.233)*43758.5453;return x-Math.floor(x)};
  const sz=(mob?28:36)+r(1)*(mob?28:34),d=document.createElement('div');
  d.className='sx';
  d.style.cssText=`left:${((i%cols)+.15+r(2)*.7)*100/cols}%;top:${(Math.floor(i/cols)+.15+r(3)*.7)*100/rows}%;width:${sz}px;height:${sz}px;--r:${Math.round(r(4)*70-35)}deg;--d:${(10+r(5)*10).toFixed(1)}s;filter:blur(${(.6+r(6)*1.2).toFixed(1)}px);opacity:${(.28+r(7)*.17).toFixed(2)}`;
  d.style.backgroundImage='url("'+els[Math.floor(r(8)*els.length)]+'")';
  f.appendChild(d);
 }
 c.appendChild(f);
}
function openEl(){
 const ks=Object.keys(photos).filter(k=>k.startsWith('el-'));
 showSheet(`<h2 style="font-size:22px;margin-bottom:6px">Scattered elements</h2>
 <p style="text-align:left;font-size:12px">Upload small food images (transparent PNG cut-outs look best). They are scattered across the page background, small and softly blurred. Add several different ones.</p>
 <div class="elg">${ks.map(k=>`<div class="elt"><img src="${photos[k]}" alt=""><button onclick="delEl('${k}')">✕</button></div>`).join('')||'<small>No images yet.</small>'}</div>
 <button class="fb" onclick="pickEls()">+ Add images</button>`);
 elSheet=true;
}
function pickEls(){
 const f=document.createElement('input');f.type='file';f.accept='image/*';f.multiple=true;
 f.onchange=()=>{[...f.files].forEach(file=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
  const k=Math.min(1,240/Math.max(im.width,im.height)),c=document.createElement('canvas');
  c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);
  photos['el-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)]=c.toDataURL('image/png');
  clearTimeout(elT);elT=setTimeout(()=>{try{localStorage.setItem('fc_photos',JSON.stringify(photos))}catch(e){}applyScatter();if(elSheet&&$('ov').classList.contains('on'))openEl()},200);
 };im.src=r.result};r.readAsDataURL(file)})};
 f.click();
}
function delEl(k){delete photos[k];try{localStorage.setItem('fc_photos',JSON.stringify(photos))}catch(e){}applyScatter();openEl()}
applyBg();
