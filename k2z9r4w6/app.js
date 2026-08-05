(function(){
  "use strict";
  const data=window.CAMERA_DATA;
  const stage=document.querySelector("#photo-stage");
  const number=document.querySelector("#photo-number");
  const date=document.querySelector("#photo-date");
  const time=document.querySelector("#photo-time");
  const title=document.querySelector("#caption-title");
  const caption=document.querySelector("#caption-text");
  const notice=document.querySelector("#notice");
  let index=0;
  let infoVisible=true;

  const esc=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  function render(){
    const photo=data.photos[index];
    stage.className="photo-stage";
    stage.style.backgroundImage=photo.src?`url("${photo.src.replace(/["\\]/g,"")}")`:"none";
    stage.innerHTML=photo.src?"":`<div class="placeholder ${esc(photo.tone)}"><span>${esc(photo.placeholder)}</span></div>`;
    number.textContent=`${index+1}/${data.photos.length}  ${photo.id}`;
    date.textContent=photo.date;time.textContent=photo.time;
    title.textContent=photo.id;caption.textContent=photo.caption;
    document.querySelectorAll(".lcd-status").forEach(el=>el.hidden=!infoVisible);
  }
  function move(delta){index=(index+delta+data.photos.length)%data.photos.length;render()}
  function showNotice(text){notice.textContent=text;notice.hidden=false;clearTimeout(showNotice.timer);showNotice.timer=setTimeout(()=>notice.hidden=true,1800)}
  document.addEventListener("click",event=>{
    const action=event.target.closest("[data-action]")?.dataset.action;
    if(action==="prev")move(-1);
    if(action==="next")move(1);
    if(action==="zoom")stage.classList.toggle("zoomed");
    if(action==="info"){infoVisible=!infoVisible;render()}
    if(action==="locked")showNotice("Файл захищено. Видалення неможливе.");
  });
  document.addEventListener("keydown",event=>{if(event.key==="ArrowLeft")move(-1);if(event.key==="ArrowRight")move(1)});
  render();
}());
