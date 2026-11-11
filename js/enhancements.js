/* Mutual Partners — shared interactions */
(function(){
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Active nav link */
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  $$('.clean-nav .top-links a, .mp-drawer a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===page)a.classList.add('is-active');});

  /* Mobile menu */
  const nav=$('.clean-nav'),tg=$('.nav-toggle');
  if(nav&&tg){
    const close=()=>{nav.classList.remove('menu-open');tg.setAttribute('aria-expanded','false');};
    tg.addEventListener('click',()=>{const o=nav.classList.toggle('menu-open');tg.setAttribute('aria-expanded',o);});
    $$('.mp-drawer a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
    addEventListener('resize',()=>{if(innerWidth>860)close();});
  }

  /* Scroll progress + back to top */
  const bar=document.createElement('div');bar.className='mp-progress';document.body.appendChild(bar);
  const top=document.createElement('button');top.className='mp-top';top.type='button';top.setAttribute('aria-label','Back to top');top.textContent='↑';document.body.appendChild(top);
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
  const onScroll=()=>{const h=document.documentElement,m=h.scrollHeight-innerHeight;bar.style.width=(m>0?scrollY/m*100:0)+'%';top.classList.toggle('show',scrollY>500);};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* Scroll reveal */
  if('IntersectionObserver' in window&&!reduce){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
    $$('main section, #vision section, #about section, .mp-hero, .mp-stat, .card, .approach-card, .qc-step, .coverage-item, .sif-showcase-card, .value, .accordion').forEach(el=>{el.classList.add('mp-reveal');io.observe(el);});
  }

  /* Home: auto-rotating solutions carousel */
  const car=$('.mp-carousel');
  if(car){
    const slides=$$('.mp-slide',car),dots=$$('.mp-dot',car);let i=0,t,paused=false;
    const go=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('is-active',k===i));dots.forEach((d,k)=>{d.classList.toggle('is-active',k===i);d.setAttribute('aria-current',k===i);});};
    const play=()=>{clearInterval(t);if(!reduce)t=setInterval(()=>{if(!paused&&!document.hidden)go(i+1);},4500);};
    $('.mp-prev',car).addEventListener('click',()=>{go(i-1);play();});
    $('.mp-next',car).addEventListener('click',()=>{go(i+1);play();});
    dots.forEach((d,k)=>d.addEventListener('click',()=>{go(k);play();}));
    ['mouseenter','focusin','touchstart'].forEach(ev=>car.addEventListener(ev,()=>paused=true,{passive:true}));
    ['mouseleave','focusout','touchend'].forEach(ev=>car.addEventListener(ev,()=>paused=false,{passive:true}));
    let x0=null;car.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
    car.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>45){go(i+(dx<0?1:-1));play();}x0=null;});
    go(0);play();
  }

  /* Solutions: deep links + live breadcrumb */
  const leaf=$('#mpCrumbLeaf'),names={investments:'Investments',insurance:'Insurance','loan-solution':'Loans'};
  if(leaf){
    $$('.top-solution').forEach(b=>b.addEventListener('click',()=>{leaf.textContent=names[b.dataset.target]||leaf.textContent;history.replaceState(null,'','#'+b.dataset.target);}));
    const fromHash=()=>{const b=$$('.top-solution').find(x=>x.dataset.target===location.hash.slice(1));if(b)b.click();};
    fromHash();addEventListener('hashchange',fromHash);
  }
})();
