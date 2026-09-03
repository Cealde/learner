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
  const nextView = document.getElementById(viewId);
  const currentView = document.querySelector(".view.view-visible");
  if (!nextView || currentView === nextView) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = () => {
    document.querySelectorAll(".view").forEach((view) => {
      const isNext = view === nextView;
      view.classList.toggle("view-hidden", !isNext);
      view.classList.toggle("view-visible", isNext);
      view.classList.remove("view-exit");
    });
    nextView.classList.remove("view-enter");
    if (!reduceMotion) {
      requestAnimationFrame(() => nextView.classList.add("view-enter"));
    }
  };

  if (!currentView || reduceMotion) {
    reveal();
    return;
  }

  document.body.classList.add("is-transitioning");
  currentView.classList.add("view-exit");
  window.setTimeout(() => {
    reveal();
    window.setTimeout(() => document.body.classList.remove("is-transitioning"), 620);
  }, 260);
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
