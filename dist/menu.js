'use strict';
// Shared site menu: opens the drawer, closes it before any action, and
// on the gallery page lets links like index.html#about open the right panel.
(function(){
  const menu=document.getElementById('menu-dialog');
  const open=document.getElementById('menu-open');
  if(!menu||!open)return;
  open.addEventListener('click',()=>{menu.showModal();open.setAttribute('aria-expanded','true')});
  menu.addEventListener('close',()=>open.setAttribute('aria-expanded','false'));
  menu.querySelector('.dialog-close').addEventListener('click',()=>menu.close());
  menu.addEventListener('click',e=>{
    if(e.target===menu){const r=menu.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)menu.close()}
  });
  // Close the drawer first so the next panel never stacks on top of it.
  menu.querySelectorAll('.menu-link').forEach(l=>l.addEventListener('click',()=>menu.close(),true));
})();
