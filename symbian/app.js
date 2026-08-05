(function(){
  "use strict";
  const data=window.SYMBIAN_DATA;
  const view=document.querySelector("#app-view");
  const title=document.querySelector("#screen-title");
  const left=document.querySelector("#left-softkey");
  const right=document.querySelector("#right-softkey");
  const toast=document.querySelector("#toast");
  let screen="home";

  const esc=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  function setChrome(name,leftText="☰",rightText="Done"){title.textContent=name;left.textContent=leftText;right.textContent=rightText}
  function showToast(text){toast.textContent=text;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,2400)}

  function home(){
    screen="home";setChrome("Applications","☰","Done");
    view.innerHTML=`<div class="home"><div class="home-banner"><div class="home-time">11:48 pm</div><div class="home-date">▰▰▰　▾ All</div></div><div class="grid"><button class="app-icon disabled" data-app="disabled"><span class="glyph">☏</span><span>Address</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">▦</span><span>Calc</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">▣</span><span>Card Info</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">◷</span><span>Clock</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">▤</span><span>Date Book</span></button><button class="app-icon maps-glyph-wrap" data-app="maps"><span class="glyph maps-glyph">⌖</span><span>Maps</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">↯</span><span>HotSync</span></button><button class="app-icon" data-app="mail"><span class="glyph mail-glyph">✉</span><span>Mail</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">✎</span><span>Memo Pad</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">☑</span><span>To Do</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">⚙</span><span>Prefs</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">⚿</span><span>Security</span></button></div></div>`;
  }
  function inbox(){
    screen="inbox";setChrome("Inbox","☰","Done");
    view.innerHTML=`<div class="list-title">Inbox (${data.messages.filter(m=>m.unread).length} new)</div><div class="mail-list">${data.messages.map(m=>`<button class="mail-row ${m.unread?"unread":""}" data-message="${esc(m.id)}"><span class="envelope">${m.unread?"✉":"▱"}</span><span class="mail-main"><span class="mail-from">${esc(m.from)}</span><span class="mail-subject">${esc(m.subject)}</span></span><span class="mail-time">${esc(m.time)}</span></button>`).join("")}</div>`;
  }
  function message(id){
    const mail=data.messages.find(m=>m.id===id);if(!mail)return;
    mail.unread=false;screen="message";setChrome("Message","☰","Done");
    view.innerHTML=`<div class="reader-head"><h1>${esc(mail.subject)}</h1><div class="reader-meta"><b>From:</b> ${esc(mail.from)}<br>${esc(mail.address)}<br><b>Sent:</b> ${esc(mail.date)} ${esc(mail.time)}</div></div><div class="reader-body">${mail.body.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`;
  }
  function maps(){
    if(data.mapsUrl){window.location.href=data.mapsUrl;return}
    screen="maps";setChrome("Maps","☰","Done");
    view.innerHTML='<div class="dialog-view"><div class="dialog-box"><div class="dialog-icon">⌖</div><h2>Maps link not configured</h2><p>Insert the Google Maps URL in <b>symbian/config.js</b>.</p></div></div>';
  }
  function back(){if(screen==="message")inbox();else if(screen!=="home")home();else showToast("Application cannot be closed")}
  view.addEventListener("click",event=>{const app=event.target.closest("[data-app]");const mail=event.target.closest("[data-message]");if(mail)message(mail.dataset.message);else if(app?.dataset.app==="mail")inbox();else if(app?.dataset.app==="maps")maps();else if(app)showToast("Feature not available")});
  right.addEventListener("click",back);left.addEventListener("click",()=>showToast(screen==="message"?"Reply unavailable — offline":"No options available"));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"||event.key==="Backspace")back()});
  home();
}());
