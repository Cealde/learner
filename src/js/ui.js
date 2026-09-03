/**
 * ui.js — UI state management & notification system
 */

let _statusEl = null;
let _statusTimeout = null;

export function initUI(statusEl) {
  _statusEl = statusEl;
}

export function showStatus(message, type = "success") {
  if (!_statusEl) return;
  clearTimeout(_statusTimeout);
  _statusEl.className = `status-toast ${type}`;
  _statusEl.innerHTML = `
    <span class="toast-icon">${type === "error" ? "✕" : "✓"}</span>
    <span>${message}</span>
  `;
  _statusEl.style.display = "flex";
  _statusEl.classList.remove("toast-exit");
  _statusEl.classList.add("toast-enter");

  _statusTimeout = setTimeout(() => {
    _statusEl.classList.add("toast-exit");
    setTimeout(() => {
      if (_statusEl) _statusEl.style.display = "none";
    }, 300);
  }, 3500);
}

export function showView(viewId) {
  const views = document.querySelectorAll(".view");
  views.forEach((v) => {
    if (v.id === viewId) {
      v.classList.remove("view-hidden");
      v.classList.add("view-visible");
    } else {
      v.classList.add("view-hidden");
      v.classList.remove("view-visible");
    }
  });
}

export function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = "flex";
  requestAnimationFrame(() => {
    modalEl.classList.add("modal-active");
  });
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("modal-active");
  setTimeout(() => {
    modalEl.style.display = "none";
  }, 220);
}
