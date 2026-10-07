'use strict';
const header=document.querySelector('.sticky-header');
const links=[...document.querySelectorAll('[data-section]')];
const sections=links.map(link=>document.getElementById(link.dataset.section));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let frame;
function updateHeaderHeight(){document.documentElement.style.setProperty('--header-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);}
updateHeaderHeight();
if('ResizeObserver' in window)new ResizeObserver(updateHeaderHeight).observe(header);
else window.addEventListener('resize',updateHeaderHeight);
function setActive(id){for(const link of links){if(link.dataset.section===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}
function updateActive(){frame=null;const threshold=header.getBoundingClientRect().bottom+100;let active=sections[0].id;for(const section of sections)if(section.getBoundingClientRect().top<=threshold)active=section.id;setActive(active);}
window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateActive);},{passive:true});
window.addEventListener('load',()=>{updateHeaderHeight();updateActive();},{once:true});
for(const link of links)link.addEventListener('click',event=>{event.preventDefault();const section=document.getElementById(link.dataset.section);setActive(section.id);section.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});history.pushState(null,'',`#${section.id}`);});
window.addEventListener('popstate',()=>{const target=document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView({block:'start',behavior:'instant'});updateActive();});
