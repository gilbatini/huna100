'use strict';
(function(){
const E=window.HUNA_ESTATE;if(!E)return;
const $=id=>document.getElementById(id);
const STATUS={available:'Available',reserved:'Reserved',let:'Let'};
const ORDER=['available','reserved','let'];
const TYPES=['1 Bedroom','2 Bedroom','3 Bedroom'];
const units=[...E.units].sort((a,b)=>b.floor-a.floor||a.number.localeCompare(b.number,undefined,{numeric:true}));
const count=(list,s)=>list.filter(u=>u.status===s).length;
const pct=(n,d)=>d?Math.round(n/d*100):0;
const kes=n=>'KES '+n.toLocaleString('en-KE');
const usd=n=>'US$'+n.toLocaleString('en-US');
const rentFor=u=>{const r=E.rents[u.type];return r&&u.status==='available'?r:null};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// As-of date
const d=new Date(E.asOf+'T00:00:00');
$('as-of').textContent='UPDATED '+d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}).toUpperCase();

// Stat tiles
const total=units.length,avail=count(units,'available'),res=count(units,'reserved'),lt=count(units,'let');
$('stat-total').textContent=total;
$('stat-available').textContent=avail;$('stat-available-note').textContent=pct(avail,total)+'% of the building';
$('stat-reserved').textContent=res;$('stat-reserved-note').textContent=pct(res,total)+'% held for applicants';
$('stat-let').textContent=lt;$('stat-let-note').textContent=pct(lt,total)+'% occupied';

// Tooltip
const tip=$('tip');
function showTip(el,html){tip.innerHTML=html;tip.hidden=false;const r=el.getBoundingClientRect(),t=tip.getBoundingClientRect();
  let x=r.left+r.width/2-t.width/2,y=r.top-t.height-10;
  x=Math.max(10,Math.min(x,innerWidth-t.width-10));if(y<10)y=r.bottom+10;
  tip.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px)`}
function hideTip(){tip.hidden=true}
function bindTip(el,html){el.addEventListener('mouseenter',()=>showTip(el,html));el.addEventListener('mouseleave',hideTip);el.addEventListener('focus',()=>showTip(el,html));el.addEventListener('blur',hideTip)}
addEventListener('scroll',hideTip,{passive:true});

// Mix by type: one stacked bar per type, counts direct-labelled
const mix=$('mix');
TYPES.forEach(type=>{
  const list=units.filter(u=>u.type===type);if(!list.length)return;
  const row=document.createElement('div');row.className='mix-row';
  const rent=E.rents[type];
  row.innerHTML=`<div class="mix-label"><strong>${type.replace(' Bedroom','-bed')}</strong><span>${list.length} units · ${rent?kes(rent.kes)+' / mo':'Rent on request'}</span></div><div class="mix-bar" role="img" aria-label="${esc(type)}: ${ORDER.map(s=>count(list,s)+' '+STATUS[s].toLowerCase()).join(', ')}"></div>`;
  const bar=row.querySelector('.mix-bar');
  ORDER.forEach(s=>{const n=count(list,s);if(!n)return;const seg=document.createElement('span');seg.className='seg s-'+s;seg.style.flexGrow=n;seg.tabIndex=0;
    seg.innerHTML=n/list.length>=.12?`<em>${n}</em>`:'';
    bindTip(seg,`<b>${type}</b><span><i class="dot s-${s}"></i>${STATUS[s]}: ${n} of ${list.length}</span>`);bar.append(seg)});
  mix.append(row)});

// Building stack: one row per floor, a chip per unit
const stack=$('stack');
const floors=[...new Set(units.map(u=>u.floor))].sort((a,b)=>b-a);
floors.forEach(f=>{
  const row=document.createElement('div');row.className='floor';
  row.innerHTML=`<span class="floor-no">${String(f).padStart(2,'0')}</span><div class="floor-units"></div>`;
  const wrap=row.querySelector('.floor-units');
  units.filter(u=>u.floor===f).sort((a,b)=>a.number.localeCompare(b.number,undefined,{numeric:true})).forEach(u=>{
    const c=document.createElement('button');c.type='button';c.className='unit s-'+u.status;c.textContent=u.number;
    c.setAttribute('aria-label',`Unit ${u.number}, ${u.type}, ${STATUS[u.status]}`);
    const r=rentFor(u);
    bindTip(c,`<b>Unit ${u.number}</b><span>${u.type} · ${u.sizeSqm} m²</span><span><i class="dot s-${u.status}"></i>${STATUS[u.status]}${r?' · '+kes(r.kes)+' / mo':''}</span>`);
    c.addEventListener('click',()=>{filters.type='all';filters.status='all';syncChips();renderTable(u.number)});
    wrap.append(c)});
  stack.append(row)});

// Filters + table
const filters={type:'all',status:'all'};const PREVIEW=12;let showAll=false;
function chipGroup(id,key,options){const g=$(id);options.forEach(([val,label])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.val=val;b.textContent=label;b.addEventListener('click',()=>{filters[key]=val;showAll=false;syncChips();renderTable()});g.append(b)})}
chipGroup('type-filter','type',[['all','All types'],...TYPES.map(t=>[t,t.replace(' Bedroom','-bed')])]);
chipGroup('status-filter','status',[['all','Any status'],...ORDER.map(s=>[s,STATUS[s]])]);
function syncChips(){[['type-filter','type'],['status-filter','status']].forEach(([id,key])=>$(id).querySelectorAll('.chip').forEach(b=>{const on=b.dataset.val===filters[key];b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))}))}
function renderTable(highlight){
  const list=units.filter(u=>(filters.type==='all'||u.type===filters.type)&&(filters.status==='all'||u.status===filters.status));
  const body=$('unit-rows');body.replaceChildren();
  const idx=highlight?list.findIndex(u=>u.number===highlight):-1;if(idx>=PREVIEW)showAll=true;
  const shown=showAll?list:list.slice(0,PREVIEW);
  shown.forEach(u=>{const r=rentFor(u);const tr=document.createElement('tr');if(u.number===highlight)tr.className='hl';
    tr.innerHTML=`<td class="num">${esc(u.number)}</td><td>${esc(u.type)}</td><td class="r">${u.floor}</td><td class="r">${u.sizeSqm} m²<small>${u.sizeSqft.toLocaleString('en-US')} sq ft</small></td><td><span class="pill s-${u.status}"><i class="dot s-${u.status}"></i>${STATUS[u.status]}</span></td><td class="r">${r?kes(r.kes)+'<small>'+usd(r.usd)+'</small>':'<span class="muted">—</span>'}</td>`;
    body.append(tr)});
  $('unit-count').textContent=`${list.length} of ${units.length} units`;
  $('empty').hidden=list.length>0;
  const more=$('show-more');more.hidden=list.length<=PREVIEW;more.textContent=showAll?'Show fewer':`Show all ${list.length} units`;more.setAttribute('aria-expanded',String(showAll));
  if(highlight){const row=body.querySelector('.hl');if(row){row.scrollIntoView({behavior:'smooth',block:'center'})}}
}
$('show-more').addEventListener('click',()=>{showAll=!showAll;renderTable()});
syncChips();renderTable();
})();
