/**
 * app.js — Main application entry point
 * Orchestrates all modules and manages global state.
 */

import {
  getProfiles,
  createProfile,
  deleteProfile,
  loginProfile,
  getActiveProfile,
  logoutProfile,
} from "./js/tauri.js";
import { renderProfileGrid } from "./js/profiles.js";
import { renderDashboard } from "./js/dashboard.js";
import { initUI, showStatus, showView, openModal, closeModal } from "./js/ui.js";
import { getAvatarColor } from "./js/utils.js";

// ============================================================
// State
// ============================================================

let profiles = [];
let activeProfile = null;
let pendingProfileId = null;
let pendingDeleteProfile = null;

// ============================================================
// DOM Refs — populated in DOMContentLoaded
// ============================================================

let profilesGrid;
let addModal, passwordModal, deleteModal;
let statusEl;

// ============================================================
// Core Functions
// ============================================================

async function loadProfiles() {
  try {
    const active = await getActiveProfile();
    if (active) {
      activeProfile = active;
      renderDashboard(active);
      showView("view-dashboard");
      return;
    }

    profiles = await getProfiles();
    // Hide header pill on profile selection
    const pill = document.getElementById("header-profile-pill");
    if (pill) pill.style.display = "none";

    renderProfileGrid(profiles, profilesGrid, {
      onSelect: handleProfileSelect,
      onDelete: handleDeleteRequest,
      onAdd: () => openAddModal(),
    });

    // Update count badge
    const countEl = document.getElementById("profiles-count");
    if (countEl) countEl.textContent = profiles.length > 0 ? `${profiles.length} learner${profiles.length > 1 ? "s" : ""}` : "";

    showView("view-profiles");
  } catch (err) {
    console.error("loadProfiles error:", err);
    showStatus("Unable to load learner profiles.", "error");
  }
}

function handleProfileSelect(profile) {
  if (profile.protected) {
    pendingProfileId = profile.id;

    // Set modal title with color
    const color = getAvatarColor(profile.name);
    const titleEl = document.getElementById("pwd-modal-profile-name");
    const avatarEl = document.getElementById("pwd-modal-avatar");
    if (titleEl) titleEl.textContent = profile.name;
    if (avatarEl) {
      avatarEl.textContent = profile.initials;
      avatarEl.style.background = color.bg;
      avatarEl.style.color = color.text;
    }

    const pwdInput = document.getElementById("profile-password-input");
    if (pwdInput) pwdInput.value = "";
    const errEl = document.getElementById("pwd-error");
    if (errEl) errEl.textContent = "";
    openModal(passwordModal);
    setTimeout(() => pwdInput && pwdInput.focus(), 250);
  } else {
    performLogin(profile.id, null);
  }
}

async function performLogin(id, password) {
  try {
    const profile = await loginProfile(id, password);
    closeModal(passwordModal);
    pendingProfileId = null;
    activeProfile = profile;
    renderDashboard(profile);
    showView("view-dashboard");
  } catch (err) {
    const errEl = document.getElementById("pwd-error");
    if (errEl) errEl.textContent = "Incorrect password. Please try again.";
    const pwdInput = document.getElementById("profile-password-input");
    if (pwdInput) {
      pwdInput.focus();
      pwdInput.select();
    }
  }
}

function handleDeleteRequest(profile) {
  pendingDeleteProfile = profile;
  const nameEl = document.getElementById("delete-profile-name");
  if (nameEl) nameEl.textContent = profile.name;
  openModal(deleteModal);
}

async function handleDeleteConfirm() {
  if (!pendingDeleteProfile) return;
  try {
    await deleteProfile(pendingDeleteProfile.id);
    closeModal(deleteModal);
    showStatus(`${pendingDeleteProfile.name}'s profile was removed.`);
    pendingDeleteProfile = null;
    await loadProfiles();
  } catch (err) {
    console.error("deleteProfile error:", err);
    showStatus("Unable to remove learner.", "error");
  }
}

// ============================================================
// Modal Helpers
// ============================================================

function openAddModal() {
  document.getElementById("new-profile-name").value = "";
  document.getElementById("new-profile-description").value = "";
  document.getElementById("new-profile-password").value = "";
  document.getElementById("new-profile-confirm-password").value = "";
  document.getElementById("protect-checkbox").checked = false;

  const pwdFields = document.getElementById("add-password-fields");
  if (pwdFields) pwdFields.style.display = "none";

  const addErr = document.getElementById("add-form-error");
  if (addErr) addErr.textContent = "";

  openModal(addModal);
  setTimeout(() => document.getElementById("new-profile-name").focus(), 250);
}

function closeAddModal() {
  closeModal(addModal);
}

function closePasswordModal() {
  pendingProfileId = null;
  closeModal(passwordModal);
}

function closeDeleteModal() {
  pendingDeleteProfile = null;
  closeModal(deleteModal);
}

// ============================================================
// DOMContentLoaded
// ============================================================

window.addEventListener("DOMContentLoaded", () => {
  // DOM refs
  profilesGrid = document.getElementById("profiles-grid");
  addModal = document.getElementById("add-modal");
  passwordModal = document.getElementById("password-modal");
  deleteModal = document.getElementById("delete-modal");
  statusEl = document.getElementById("status-toast");

  // Init UI system
  initUI(statusEl);

  // ── Keyboard: Escape to close modals ──
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAddModal();
      closePasswordModal();
      closeDeleteModal();
    }
  });

  // ── Backdrop clicks ──
  [addModal, passwordModal, deleteModal].forEach((m) => {
    if (m) {
      m.addEventListener("click", (e) => {
        if (e.target === m) {
          if (m === addModal) closeAddModal();
          else if (m === passwordModal) closePasswordModal();
          else if (m === deleteModal) closeDeleteModal();
        }
      });
    }
  });

  // ── Protect checkbox toggle ──
  const protectCheckbox = document.getElementById("protect-checkbox");
  const pwdFields = document.getElementById("add-password-fields");
  if (protectCheckbox && pwdFields) {
    protectCheckbox.addEventListener("change", () => {
      pwdFields.style.display = protectCheckbox.checked ? "flex" : "none";
      if (!protectCheckbox.checked) {
        document.getElementById("new-profile-password").value = "";
        document.getElementById("new-profile-confirm-password").value = "";
      }
    });
  }

  // ── Add Profile Form ──
  const addForm = document.getElementById("add-profile-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("new-profile-name").value.trim();
      const description = document.getElementById("new-profile-description").value.trim();
      const protect = document.getElementById("protect-checkbox").checked;
      const password = document.getElementById("new-profile-password").value;
      const confirm = document.getElementById("new-profile-confirm-password").value;
      const errEl = document.getElementById("add-form-error");

      if (!name) {
        errEl.textContent = "Learner name is required.";
        return;
      }

      if (protect) {
        if (!password) {
          errEl.textContent = "Please enter a password.";
          return;
        }
        if (password !== confirm) {
          errEl.textContent = "Passwords do not match.";
          return;
        }
      }

      errEl.textContent = "";

      try {
        await createProfile(name, description || null, protect ? password : null);
        closeAddModal();
        showStatus(`${name}'s learning space is ready.`);
        await loadProfiles();
      } catch (err) {
        errEl.textContent = String(err);
      }
    });
  }

  const cancelAddBtn = document.getElementById("cancel-add-btn");
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", closeAddModal);

  // ── Password Form ──
  const pwdForm = document.getElementById("password-form");
  if (pwdForm) {
    pwdForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = document.getElementById("profile-password-input").value;
      if (pendingProfileId) {
        await performLogin(pendingProfileId, pwd);
      }
    });
  }

  const cancelPwdBtn = document.getElementById("cancel-password-btn");
  if (cancelPwdBtn) cancelPwdBtn.addEventListener("click", closePasswordModal);

  // ── Delete Modal ──
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener("click", handleDeleteConfirm);

  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // ── Switch Profile / Logout ──
  const switchBtn = document.getElementById("switch-profile-btn");
  if (switchBtn) {
    switchBtn.addEventListener("click", async () => {
      try {
        await logoutProfile();
        activeProfile = null;
        await loadProfiles();
      } catch (err) {
        console.error("logout error:", err);
        showStatus("Unable to switch learner.", "error");
      }
    });
  }

  // ── Initial load ──
  loadProfiles();
});
