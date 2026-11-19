const PRODUCTS=[{id:"serum",name:"Glow Serum",desc:"Vitamin C · 30 ml",price:24},{id:"moist",name:"Daily Moisturiser",desc:"Hydrating · 50 ml",price:22},{id:"clean",name:"Gentle Cleanser",desc:"Fragrance-free · 100 ml",price:16},{id:"cream",name:"Night Repair Cream",desc:"Plant-based · 50 ml",price:28}];
const PLANS=[{id:"starter",name:"Starter Loop",price:19,items:["1 refillable product","Refill every 2 months","Free returns of empties"]},{id:"glow",name:"Glow Loop",price:34,pop:1,items:["3 refillable products","Monthly refills, skip anytime","10% off all extras"]},{id:"complete",name:"Complete Loop",price:52,items:["Full 5-step routine","Flexible refill schedule","15% off + early access"]}];
const $=s=>document.querySelector(s);
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
let bag=get("bl-bag",{}),plan=get("bl-plan",null),st=get("bl-st",{skip:false,pause:false});
$("#products").innerHTML=PRODUCTS.map(p=>`<article class="prod"><div class="pimg"><i></i></div><h3>${p.name}</h3><p>${p.desc}</p><p class="price">£${p.price}</p><button class="btn" data-add="${p.id}">ADD TO BAG</button></article>`).join("");
$("#planGrid").innerHTML=PLANS.map(p=>`<article class="plan${p.pop?" pop":""}" data-plan="${p.id}">${p.pop?'<span class="tag">MOST POPULAR</span>':""}<h3>${p.name}</h3><div class="cost">£${p.price}<small>/month</small></div><ul>${p.items.map(i=>`<li>${i}</li>`).join("")}</ul><button class="btn" data-pick="${p.id}">CHOOSE PLAN</button></article>`).join("");
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2000)}
function drawBag(){
 const rows=Object.entries(bag).map(([id,q])=>({p:PRODUCTS.find(x=>x.id===id),q})).filter(r=>r.p);
 const n=rows.reduce((a,r)=>a+r.q,0),s=rows.reduce((a,r)=>a+r.q*r.p.price,0);
 $("#bagCount").textContent=n;$("#sub").textContent="£"+s;$("#checkout").disabled=!n;
 $("#bagList").innerHTML=rows.length?rows.map(r=>`<li><span>${r.p.name}<br><small class="muted">£${r.p.price}</small></span><span><button data-dec="${r.p.id}" aria-label="Remove one ${r.p.name}">−</button> ${r.q} <button data-inc="${r.p.id}" aria-label="Add one ${r.p.name}">+</button></span></li>`).join(""):'<li class="muted">Your bag is empty.</li>';
 $("#accBag").textContent=rows.length?rows.map(r=>`${r.q} × ${r.p.name}`).join(", ")+` — £${s}`:"Your bag is empty.";put("bl-bag",bag)}
function drawPlan(){
 const p=PLANS.find(x=>x.id===plan);
 document.querySelectorAll(".plan").forEach(el=>{const on=el.dataset.plan===plan;el.setAttribute("aria-current",on);el.querySelector(".btn").textContent=on?"CURRENT PLAN":"CHOOSE PLAN"});
 $("#planName").textContent=p?`${p.name} — £${p.price}/month`:"No plan yet. Choose one above to start your loop.";
 $("#planState").textContent=!p?"":st.pause?"Plan paused. Resume anytime.":st.skip?"Next refill skipped.":"Next refill is on its way.";
 $("#skipBtn").disabled=$("#pauseBtn").disabled=!p;
 $("#skipBtn").textContent=st.skip?"Undo skip":"Skip next refill";$("#pauseBtn").textContent=st.pause?"Resume plan":"Pause plan";put("bl-plan",plan);put("bl-st",st)}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset;
 if(d.add){bag[d.add]=(bag[d.add]||0)+1;drawBag();toast("Added to bag")}
 if(d.inc){bag[d.inc]++;drawBag()}
 if(d.dec){if(--bag[d.dec]<=0)delete bag[d.dec];drawBag()}
 if(d.pick){plan=d.pick;st={skip:false,pause:false};drawPlan();toast("Plan selected")}});
$("#skipBtn").onclick=()=>{st.skip=!st.skip;drawPlan()};$("#pauseBtn").onclick=()=>{st.pause=!st.pause;drawPlan()};
const dlg=$("#bagDlg");$("#bagBtn").onclick=()=>dlg.showModal();$("#closeBag").onclick=()=>dlg.close();
$("#checkout").onclick=()=>{$("#cMsg").textContent="Prototype: payments are not connected yet."};
const menu=document.querySelector(".menu"),nav=$("#nav");
menu.onclick=()=>{menu.setAttribute("aria-expanded",nav.classList.toggle("open"))};
nav.onclick=e=>{if(e.target.tagName==="A"){nav.classList.remove("open");menu.setAttribute("aria-expanded",false)}};
$("#cForm").addEventListener("submit",e=>{e.preventDefault();const f=e.target;
 $("#fMsg").textContent=f.checkValidity()?(f.reset(),"Thanks! Your message will be sent once the site is connected to an email service."):"Please add your name, a valid email and a message."});
const links=[...nav.querySelectorAll("a")];
["home","bestsellers","refill","plans","account","reviews","contact"].forEach((id,i)=>{const el=document.getElementById(id);
 new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){links.forEach(l=>l.classList.remove("on"));links[i].classList.add("on")}}),{rootMargin:"-40% 0px -55% 0px"}).observe(el)});
drawBag();drawPlan();
