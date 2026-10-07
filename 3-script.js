const N=[["k","Energy","kcal"],["p","Protein","g"],["fe","Iron","mg"],["a","Vitamin A","µg"],["z","Zinc","mg"]];
const F=[
{id:"maize",n:"Maize porridge",e:"🥣",s:"1 bowl",c:.05,k:110,p:2.5,fe:.8,a:0,z:.5},
{id:"cass",n:"Cassava",e:"🍠",s:"100 g",c:.04,k:110,p:1,fe:.3,a:1,z:.3},
{id:"rice",n:"Rice",e:"🍚",s:"1 cup",c:.08,k:195,p:4,fe:.3,a:0,z:.8},
{id:"bean",n:"Beans",e:"🫘",s:"100 g",c:.10,k:130,p:8,fe:2.5,a:0,z:1},
{id:"egg",n:"Egg",e:"🥚",s:"1 egg",c:.12,k:75,p:6,fe:.9,a:80,z:.6},
{id:"osp",n:"Orange sweet potato",e:"🥕",s:"100 g",c:.06,k:90,p:1.6,fe:.7,a:700,z:.3},
{id:"leaf",n:"Leafy greens",e:"🥬",s:"50 g",c:.03,k:20,p:2,fe:1.8,a:250,z:.3},
{id:"nut",n:"Groundnuts",e:"🥜",s:"30 g",c:.08,k:170,p:7.5,fe:1.3,a:0,z:1},
{id:"fish",n:"Small dried fish",e:"🐟",s:"20 g",c:.06,k:60,p:12,fe:1.2,a:20,z:1},
{id:"milk",n:"Milk",e:"🥛",s:"150 ml",c:.10,k:90,p:5,fe:.1,a:40,z:.6},
{id:"banana",n:"Banana",e:"🍌",s:"1 medium",c:.07,k:90,p:1,fe:.3,a:3,z:.2}];
const R={"6-11":{k:700,p:11,fe:11,a:400,z:3},"12-23":{k:900,p:13,fe:7,a:400,z:3},"24-59":{k:1300,p:16,fe:7,a:450,z:4}};
const st={age:"12-23",cnt:{}};
const $=id=>document.getElementById(id);
function intake(cnt){const t={k:0,p:0,fe:0,a:0,z:0};for(const f of F){const q=cnt[f.id]||0;for(const[k]of N)t[k]+=f[k]*q}return t}
function fix(cnt,age){const rq=R[age],have=intake(cnt),gap={};for(const[k]of N)gap[k]=Math.max(0,rq[k]-have[k]);
const add={};let cost=0;
for(let i=0;i<6;i++){let best=null,bs=0;
for(const f of F){if((add[f.id]||0)>=2)continue;let s=0;for(const[k]of N)s+=Math.min(gap[k],f[k])/rq[k];s/=f.c;if(s>bs){bs=s;best=f}}
if(!best||bs<=0)break;
add[best.id]=(add[best.id]||0)+1;cost+=best.c;for(const[k]of N)gap[k]=Math.max(0,gap[k]-best[k]);
if(N.every(([k])=>gap[k]<.05*rq[k]))break}
return{add,cost,gap}}
function foods(){$("foods").innerHTML=F.map(f=>{const q=st.cnt[f.id]||0;return`<div class="food${q?" on":""}"><span class="e" aria-hidden="true">${f.e}</span><span>${f.n}<small>${f.s}</small></span><span class="q"><button data-m="${f.id}" aria-label="Remove ${f.n}">−</button><b>${q}</b><button data-p="${f.id}" aria-label="Add ${f.n}">+</button></span></div>`}).join("")}
function calc(){const rq=R[st.age],have=intake(st.cnt);
$("bars").innerHTML=N.map(([k,l,u])=>{const p=Math.round(have[k]/rq[k]*100),w=Math.min(100,p),c=p<50?"var(--r)":p<80?"var(--a)":"var(--g)";
return`<div class="bar"><span>${l}</span><div class="track"><div class="fill" style="width:${w}%;background:${c}"></div></div><b>${p}%</b></div>`}).join("")+`<p class="note">Percent of the child's daily need (illustrative targets).</p>`;
const r=fix(st.cnt,st.age),ids=Object.keys(r.add);
if(!Object.keys(st.cnt).some(k=>st.cnt[k])){$("fix").innerHTML=`<p class="note">Tap + on the foods the child ate to see the gap and a low-cost fix.</p>`;return}
if(!ids.length){$("fix").innerHTML=`<span class="pill ok">No major gap found</span><p>This diet meets the simplified targets. Keep monitoring growth.</p>`;return}
const rem=N.filter(([k])=>r.gap[k]>.05*rq[k]).map(([,l])=>l);
$("fix").innerHTML=`<div class="big">+$${r.cost.toFixed(2)} <span class="note">per day, illustrative</span></div><ul class="fix">${ids.map(i=>{const f=F.find(x=>x.id===i);return`<li>${f.e} ${r.add[i]} × ${f.n} (${f.s})</li>`}).join("")}</ul>`+(rem.length?`<span class="pill warn">Still short on: ${rem.join(", ")}</span><p class="note">Local foods alone may not close this gap. Ask a nutritionist about fortified foods or supplements.</p>`:`<span class="pill ok">Closes the gaps</span>`)}
function muac(){const v=parseFloat($("muac").value),o=$("muacOut");
if(!v){o.innerHTML="";return}
o.innerHTML=v<115?`<span class="pill bad">Arm band &lt; 115 mm: refer to a clinic today</span>`:v<125?`<span class="pill warn">Arm band 115–124 mm: refer for nutrition support</span>`:`<span class="pill ok">Arm band 125 mm or more: no risk flag</span>`;
o.innerHTML+=`<p class="note">This is a screening flag, not a diagnosis.</p>`}
const base=fix({maize:2,cass:1},"12-23").cost;
const D=[{n:"Northern Plains",kids:4200,risk:.41,gap:"Iron",m:1.2},{n:"Lakeshore",kids:3100,risk:.33,gap:"Vitamin A",m:1.0},{n:"Highland East",kids:2600,risk:.29,gap:"Zinc",m:1.1},{n:"River Delta",kids:5200,risk:.24,gap:"Protein",m:.9},{n:"Central Market Belt",kids:6100,risk:.17,gap:"Iron",m:.8},{n:"Western Hills",kids:1800,risk:.36,gap:"Vitamin A",m:1.3}].sort((a,b)=>b.risk-a.risk);
function plan(){let rem=Math.max(0,+$("budget").value||0);const days=Math.max(1,+$("days").value||1);let tot=0,risk=0;
const rows=D.map(d=>{const ar=Math.round(d.kids*d.risk),per=base*d.m*days,n=Math.min(ar,Math.floor(rem/per));rem-=n*per;tot+=n;risk+=ar;
return`<tr><td>${d.n}</td><td>${Math.round(d.risk*100)}%</td><td>${d.gap}</td><td>$${per.toFixed(2)}</td><td><b>${n.toLocaleString()}</b> / ${ar.toLocaleString()}</td></tr>`}).join("");
$("planOut").innerHTML=`<div class="big">${tot.toLocaleString()} of ${risk.toLocaleString()} at-risk children reached</div><div class="wrap"><table><thead><tr><th>District</th><th>At risk</th><th>Main gap</th><th>Cost per child</th><th>Funded / at risk</th></tr></thead><tbody>${rows}</tbody></table></div><p class="note">Unspent: $${rem.toFixed(0)}. Synthetic data for demonstration.</p>`}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
if(b.dataset.p){st.cnt[b.dataset.p]=Math.min(5,(st.cnt[b.dataset.p]||0)+1);foods();calc()}
else if(b.dataset.m){st.cnt[b.dataset.m]=Math.max(0,(st.cnt[b.dataset.m]||0)-1);foods();calc()}
else if(b.dataset.t){document.querySelectorAll("nav button").forEach(x=>x.setAttribute("aria-selected",x===b));["field","plan","about"].forEach(s=>$(s).hidden=s!==b.dataset.t)}});
$("age").onchange=e=>{st.age=e.target.value;calc()};$("muac").oninput=muac;$("budget").oninput=plan;$("days").oninput=plan;
foods();calc();plan();
