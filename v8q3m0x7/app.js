(function(){
  "use strict";
  const data=window.SYMBIAN_DATA;
  const view=document.querySelector("#app-view");
  const title=document.querySelector("#screen-title");
  const left=document.querySelector("#left-softkey");
  const right=document.querySelector("#right-softkey");
  const toast=document.querySelector("#toast");
  let screen="locked";

  const esc=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  function setChrome(name,leftText="☰",rightText="Готово"){title.textContent=name;left.textContent=leftText;right.textContent=rightText}
  function showToast(text){toast.textContent=text;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,2400)}

  function lock(){
    screen="locked";setChrome("Безпека","","Екстрено");
    view.innerHTML=`<form class="lock-screen" id="unlock-form"><div class="lock-title">Систему заблоковано</div><div class="lock-icon">⚿</div><p>Введіть пароль для доступу до пристрою.</p><label for="password-input">Пароль:</label><input id="password-input" name="password" type="password" autocomplete="off" autocapitalize="none" spellcheck="false"><div class="lock-error" id="lock-error" aria-live="polite"></div><button type="submit">OK</button><small>У разі знахідки повернути:<br>${esc(data.owner)} · VAL-04</small></form>`;
    setTimeout(()=>document.querySelector("#password-input")?.focus(),50);
  }

  function home(){
    screen="home";setChrome("Програми","☰","Готово");
    view.innerHTML=`<div class="home"><div class="home-banner"><div class="home-time">23:48</div><div class="home-date">▰▰▰　▾ Усі</div></div><div class="grid"><button class="app-icon disabled" data-app="disabled"><span class="glyph">☏</span><span>Адреси</span></button><button class="app-icon" data-app="calls"><span class="glyph call-glyph">☎</span><span>Виклики</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">▣</span><span>Картка</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">◷</span><span>Годинник</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">▤</span><span>Календар</span></button><button class="app-icon maps-glyph-wrap" data-app="maps"><span class="glyph maps-glyph">⌖</span><span>Карти</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">↯</span><span>Синхрон.</span></button><button class="app-icon" data-app="mail"><span class="glyph mail-glyph">✉</span><span>Пошта</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">✎</span><span>Нотатки</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">☑</span><span>Справи</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">⚙</span><span>Налашт.</span></button><button class="app-icon disabled" data-app="disabled"><span class="glyph">⚿</span><span>Безпека</span></button></div></div>`;
  }
  function calls(){
    screen="calls";setChrome("Виклики","☰","Готово");
    view.innerHTML=`<div class="list-title">Останні виклики</div><div class="call-list">${data.calls.map(call=>`<div class="call-row"><span class="call-direction ${call.direction}">${call.direction==="outgoing"?"↗":"↙"}</span><span class="call-main"><b>${esc(call.name)}</b><small>${esc(call.number)}</small></span><span class="call-meta">${esc(call.date)}<br>${esc(call.time)}<br>${esc(call.duration)}</span></div>`).join("")}</div>`;
  }
  function inbox(){
    screen="inbox";setChrome("Вхідні","☰","Готово");
    view.innerHTML=`<div class="list-title">Вхідні (${data.messages.filter(m=>m.unread).length} нових)</div><div class="mail-list">${data.messages.map(m=>`<button class="mail-row ${m.unread?"unread":""}" data-message="${esc(m.id)}"><span class="envelope">${m.unread?"✉":"▱"}</span><span class="mail-main"><span class="mail-from">${esc(m.from)}</span><span class="mail-subject">${esc(m.subject)}</span></span><span class="mail-time">${esc(m.time)}</span></button>`).join("")}</div>`;
  }
  function message(id){
    const mail=data.messages.find(m=>m.id===id);if(!mail)return;
    mail.unread=false;screen="message";setChrome("Повідомлення","☰","Готово");
    view.innerHTML=`<div class="reader-head"><h1>${esc(mail.subject)}</h1><div class="reader-meta"><b>Від:</b> ${esc(mail.from)}<br>${esc(mail.address)}<br><b>Надіслано:</b> ${esc(mail.date)} ${esc(mail.time)}</div></div><div class="reader-body">${mail.body.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`;
  }
  function maps(){
    screen="maps";setChrome("Карти","☰","Готово");
    if(!data.mapsEmbedUrl){
      view.innerHTML='<div class="dialog-view"><div class="dialog-box"><div class="dialog-icon">⌖</div><h2>Посилання не налаштовано</h2><p>Адресу карти не знайдено.</p></div></div>';
      return;
    }
    view.innerHTML=`<div class="map-view" id="map-view"><iframe class="map-frame" src="${esc(data.mapsEmbedUrl)}" title="Карта операції R-17" loading="eager" allowfullscreen></iframe><button class="map-fullscreen" data-map-fullscreen>⛶ На весь екран</button></div>`;
  }
  function back(){if(screen==="locked")showToast("Екстрені виклики недоступні");else if(screen==="message")inbox();else if(screen!=="home")home();else lock()}
  view.addEventListener("submit",event=>{if(event.target.id!=="unlock-form")return;event.preventDefault();const input=document.querySelector("#password-input");if(input.value.trim().toLowerCase()===String(data.password).toLowerCase())home();else{document.querySelector("#lock-error").textContent="Неправильний пароль";input.value="";input.focus()}});
  view.addEventListener("click",event=>{
    const fullscreen=event.target.closest("[data-map-fullscreen]");
    if(fullscreen){
      const mapView=document.querySelector("#map-view");
      if(mapView?.requestFullscreen)mapView.requestFullscreen().catch(()=>window.open(data.mapsEmbedUrl,"_blank","noopener"));
      else window.open(data.mapsEmbedUrl,"_blank","noopener");
      return;
    }
    const app=event.target.closest("[data-app]");const mail=event.target.closest("[data-message]");if(mail)message(mail.dataset.message);else if(app?.dataset.app==="mail")inbox();else if(app?.dataset.app==="maps")maps();else if(app?.dataset.app==="calls")calls();else if(app)showToast("Функція недоступна")
  });
  right.addEventListener("click",back);left.addEventListener("click",()=>showToast(screen==="message"?"Відповідь недоступна — немає мережі":"Немає доступних параметрів"));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"||event.key==="Backspace")back()});
  lock();
}());
