(function () {
  "use strict";

  const data = window.MAILBOX_DATA;
  const folders = [
    { id: "inbox", label: "Вхідні", icon: "📥" },
    { id: "sent", label: "Надіслані", icon: "📨" },
    { id: "drafts", label: "Чернетки", icon: "📝" },
    { id: "trash", label: "Видалені", icon: "🗑" }
  ];
  const state = { folder: "inbox", selectedId: null };
  const els = {
    folders: document.querySelector("#folder-list"), list: document.querySelector("#message-list"),
    reader: document.querySelector("#reader"), folderTitle: document.querySelector("#folder-title"),
    address: document.querySelector("#address-label"), total: document.querySelector("#message-total"),
    status: document.querySelector("#status-text"), modal: document.querySelector("#offline-modal")
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  }

  function folderMessages() {
    return data.messages.filter(message => message.folder === state.folder)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  function renderFolders() {
    els.folders.innerHTML = folders.map(folder => {
      const count = data.messages.filter(message => message.folder === folder.id && message.unread).length;
      return `<button class="folder ${folder.id === state.folder ? "active" : ""}" data-folder="${folder.id}"><span class="folder-icon">${folder.icon}</span><span>${folder.label}</span>${count ? `<span class="count">(${count})</span>` : ""}</button>`;
    }).join("");
  }

  function renderList() {
    const messages = folderMessages();
    els.list.innerHTML = messages.map(message => `<tr data-id="${escapeHtml(message.id)}" class="${message.unread ? "unread" : ""} ${message.id === state.selectedId ? "selected" : ""}" tabindex="0"><td class="state-icons">${message.flagged ? "⚑" : ""}${message.attachment ? " 📎" : ""}</td><td>${escapeHtml(message.from)}</td><td>${escapeHtml(message.subject)}</td><td>${escapeHtml(message.date)}</td></tr>`).join("");
    els.total.textContent = `${messages.length} повідомл.`;
  }

  function showMessage(id) {
    const message = data.messages.find(item => item.id === id);
    if (!message) return;
    state.selectedId = id;
    message.unread = false;
    els.reader.innerHTML = `<header class="message-head"><h1 class="message-subject">${escapeHtml(message.subject)}</h1><div class="header-row"><b>Від:</b><span>${escapeHtml(message.from)} &lt;${escapeHtml(message.email)}&gt;</span></div><div class="header-row"><b>Кому:</b><span>${escapeHtml(message.to)}</span></div><div class="header-row"><b>Дата:</b><span>${escapeHtml(message.date)}</span></div>${message.attachment ? `<div class="attachment">📎 ${escapeHtml(message.attachment)}</div>` : ""}</header><div class="message-body">${message.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}<div class="security-note">Це повідомлення та вкладення призначені лише для авторизованого персоналу комплексу VAL-04. Несанкціоноване поширення заборонено.</div></div>`;
    els.status.textContent = `Повідомлення від: ${message.email}`;
    renderFolders(); renderList();
  }

  function setFolder(id) {
    state.folder = id; state.selectedId = null;
    const folder = folders.find(item => item.id === id);
    els.folderTitle.textContent = folder.label; els.address.textContent = folder.label;
    els.reader.innerHTML = '<div class="reader-empty">Оберіть повідомлення, щоб прочитати його.</div>';
    els.status.textContent = "Готово";
    renderFolders(); renderList();
  }

  els.folders.addEventListener("click", event => { const button = event.target.closest("[data-folder]"); if (button) setFolder(button.dataset.folder); });
  els.list.addEventListener("click", event => { const row = event.target.closest("[data-id]"); if (row) showMessage(row.dataset.id); });
  els.list.addEventListener("keydown", event => { const row = event.target.closest("[data-id]"); if (row && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); showMessage(row.dataset.id); } });
  document.querySelectorAll('[data-action="offline"]').forEach(button => button.addEventListener("click", () => { els.modal.hidden = false; }));
  document.querySelector('[data-action="delete"]').addEventListener("click", () => {
    const message = data.messages.find(item => item.id === state.selectedId);
    if (!message) return;
    message.folder = "trash"; state.selectedId = null;
    els.reader.innerHTML = '<div class="reader-empty">Повідомлення переміщено до папки «Видалені».</div>';
    renderFolders(); renderList();
  });
  document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => { els.modal.hidden = true; }));
  els.modal.addEventListener("click", event => { if (event.target === els.modal) els.modal.hidden = true; });

  renderFolders(); renderList();
  const first = folderMessages()[0]; if (first) showMessage(first.id);
}());
