'use strict';
const header=document.querySelector('.sticky-header');
const links=[...document.querySelectorAll('[data-section]')];
const sections=links.map(link=>document.getElementById(link.dataset.section));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const categoryInner=document.querySelector('.category-inner');
const brandHeader=document.querySelector('.brand-header');
const categoryBar=document.querySelector('.category-bar');
const mobile=window.matchMedia('(max-width: 620px)');
let frame,currentId=null,lockUntil=0,lastY=window.scrollY;

/* ---------- Indicador deslizante de categorías ---------- */
const indicator=document.createElement('span');
indicator.className='cat-indicator';
indicator.setAttribute('aria-hidden','true');
categoryInner.prepend(indicator);
document.documentElement.classList.add('has-indicator');
function moveIndicator(){const link=links.find(l=>l.dataset.section===currentId)||links[0];indicator.style.width=`${link.offsetWidth}px`;indicator.style.transform=`translateX(${link.offsetLeft}px)`;}

function updateHeaderHeight(){const root=document.documentElement.style;root.setProperty('--header-height',`${Math.ceil(header.offsetHeight)}px`);root.setProperty('--brand-height',`${Math.ceil(brandHeader.offsetHeight)}px`);root.setProperty('--cat-height',`${Math.ceil(categoryBar.offsetHeight)}px`);moveIndicator();}
/* En celular el logo se oculta al bajar y reaparece al subir; la barra de categorías siempre queda visible. */
function setHeaderHidden(hidden){header.classList.toggle('header-hidden',hidden&&mobile.matches);}
if('ResizeObserver' in window)new ResizeObserver(updateHeaderHeight).observe(header);
else window.addEventListener('resize',updateHeaderHeight);

function setActive(id){if(id===currentId)return;currentId=id;for(const link of links){if(link.dataset.section===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}moveIndicator();}
function updateActive(){frame=null;const y=window.scrollY;header.classList.toggle('is-scrolled',y>8);if(performance.now()<lockUntil){lastY=y;return;}if(y<160)setHeaderHidden(false);else if(y>lastY+8)setHeaderHidden(true);else if(y<lastY-8)setHeaderHidden(false);if(Math.abs(y-lastY)>8)lastY=y;const threshold=header.getBoundingClientRect().bottom+100;let active=sections[0].id;for(const section of sections)if(section.getBoundingClientRect().top<=threshold)active=section.id;setActive(active);}

setActive(sections[0].id);
updateHeaderHeight();
requestAnimationFrame(()=>requestAnimationFrame(()=>indicator.classList.add('ready')));

window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateActive);},{passive:true});
window.addEventListener('scrollend',()=>{lockUntil=0;updateActive();});
window.addEventListener('load',()=>{updateHeaderHeight();updateActive();},{once:true});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(moveIndicator);
for(const link of links)link.addEventListener('click',event=>{event.preventDefault();const section=document.getElementById(link.dataset.section);lockUntil=performance.now()+1200;setHeaderHidden(true);setActive(section.id);section.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});history.pushState(null,'',`#${section.id}`);});
window.addEventListener('popstate',()=>{const target=document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView({block:'start',behavior:'instant'});updateActive();});

/* ---------- Animaciones al hacer scroll ---------- */
if(!reducedMotion.matches&&'IntersectionObserver' in window){
  const targets=document.querySelectorAll('.menu-title,.section-heading,.section-intro,.dish-card,.paper,.menu-list>.menu-item,.barbacoa-special,.extras-paper,.kids-paper,.guisos-table tbody tr,.tax-note,.footer-top,.branch,.map-cta,.footer-bottom');
  const io=new IntersectionObserver(entries=>{let i=0;for(const entry of entries){if(!entry.isIntersecting)continue;entry.target.style.setProperty('--d',`${Math.min(i++,10)*60}ms`);entry.target.classList.add('in');io.unobserve(entry.target);}},{rootMargin:'0px 0px -6% 0px',threshold:.06});
  for(const el of targets){el.classList.add('reveal');io.observe(el);}
}

/* ---------- Lightbox de fotos ---------- */
const dialog=document.getElementById('lightbox');
const lbImg=document.getElementById('lightbox-img');
const lbCap=document.getElementById('lightbox-caption');
let lastTrigger=null;
function openLightbox(src,caption,trigger){
  if(!dialog||typeof dialog.showModal!=='function'){window.open(src,'_blank','noopener');return;}
  lastTrigger=trigger;lbImg.src=src;lbImg.alt=caption;lbCap.textContent=caption;
  dialog.classList.remove('closing');dialog.showModal();
}
function closeLightbox(){
  if(!dialog.open||dialog.classList.contains('closing'))return;
  const done=()=>{dialog.classList.remove('closing');dialog.close();if(lastTrigger)lastTrigger.focus({preventScroll:true});};
  if(reducedMotion.matches){done();return;}
  dialog.classList.add('closing');
  dialog.addEventListener('animationend',done,{once:true});
}
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-lightbox]');if(!trigger)return;event.preventDefault();openLightbox(trigger.dataset.lightbox,trigger.dataset.caption||'',trigger);});
if(dialog){
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeLightbox();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)closeLightbox();});
  document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
}
