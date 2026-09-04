const { invoke } = window.__TAURI__ ? window.__TAURI__.core : { invoke: null };

let pendingPasswordProfileId = null;

// DOM Elements
let profilesSection;
let profilesGrid;
let addModal;
let passwordModal;
let statusMsg;

function showStatus(message, isError = false) {
  if (!statusMsg) return;
  statusMsg.textContent = message;
  statusMsg.className = `status-toast ${isError ? 'error' : 'success'}`;
  statusMsg.style.display = "block";
  setTimeout(() => {
    if (statusMsg) statusMsg.style.display = "none";
  }, 4000);
}

function getInitials(username, name) {
  const source = (name && name.trim()) ? name : username;
  if (!source) return "A";
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export async function refreshProfiles() {
  if (!invoke) {
    // Demo mock profiles if running outside Tauri
    const demoProfiles = [
      { id: "1", username: "AVINASH", name: "Avinash Kumar", has_password: false },
      { id: "2", username: "DEV_TEAM", name: "Adhicode Lead", has_password: true }
    ];
    renderProfiles(demoProfiles);
    showProfilesView();
    return;
  }

  try {
    const activeProfile = await invoke("get_active_profile");
    if (activeProfile) {
      goToMiddlePage(activeProfile);
      return;
    }

    const profiles = await invoke("get_profiles");
    renderProfiles(profiles);
    showProfilesView();
  } catch (err) {
    showStatus(String(err), true);
  }
}

function showProfilesView() {
  if (profilesSection) profilesSection.style.display = "block";
}

function goToMiddlePage(profile) {
  window.location.href = 'middle.html';
}

function renderProfiles(profiles) {
  if (!profilesGrid) return;
  profilesGrid.innerHTML = "";

  if (!profiles || profiles.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-profiles-card";
    emptyState.innerHTML = `
      <div class="empty-icon-glow">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 4v16m-8-8h16" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="empty-title">WELCOME TO ADHICODE</h2>
      <p class="empty-sub">Create your first profile to begin learning Python.</p>
      <button type="button" class="btn-primary empty-create-btn">+ CREATE PROFILE</button>
    `;
    emptyState.querySelector(".empty-create-btn").addEventListener("click", () => {
      openAddModal();
    });
    profilesGrid.appendChild(emptyState);
    return;
  }

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.setAttribute("data-id", profile.id);

    const initials = getInitials(profile.username, profile.name);
    const isProtected = !!profile.has_password;

    card.innerHTML = `
      <button class="delete-profile-btn" type="button" title="Delete profile">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="profile-card-top">
        <div class="profile-avatar">${initials}</div>
        <span class="status-pill ${isProtected ? 'protected' : 'available'}">
          ${isProtected ? '🔒 PROTECTED' : '● AVAILABLE'}
        </span>
      </div>

      <div class="profile-info">
        <h3 class="profile-username">${profile.username}</h3>
        <p class="profile-name">${profile.name || "Personal Profile"}</p>
      </div>

      <div class="profile-card-footer">
        <span class="open-label">OPEN PROFILE</span>
        <span class="card-arrow">→</span>
      </div>
    `;

    // Delete handler
    const deleteBtn = card.querySelector(".delete-profile-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDeleteModal(profile);
    });

    // Card click handler
    card.addEventListener("click", () => {
      handleProfileSelect(profile);
    });

    profilesGrid.appendChild(card);
  });

  // Create Profile Card
  const createCard = document.createElement("div");
  createCard.className = "profile-card create-card";
  createCard.id = "open-add-modal-btn";
  createCard.innerHTML = `
    <div class="create-icon-wrapper">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <div class="profile-info">
      <h3 class="profile-username">+ NEW PROFILE</h3>
      <p class="profile-name">Create a new learner profile</p>
    </div>
  `;
  createCard.addEventListener("click", () => {
    openAddModal();
  });

  profilesGrid.appendChild(createCard);
}

function handleProfileSelect(profile) {
  if (profile.has_password) {
    pendingPasswordProfileId = profile.id;
    const pwdInput = document.getElementById("profile-password-input");
    if (pwdInput) pwdInput.value = "";
    if (passwordModal) passwordModal.style.display = "flex";
    if (pwdInput) pwdInput.focus();
  } else {
    performLogin(profile.id, null);
  }
}

async function performLogin(id, password) {
  if (!invoke) {
    window.location.href = 'middle.html';
    return;
  }

  try {
    const active = await invoke("login_profile", { id, password });
    goToMiddlePage(active);
  } catch (err) {
    showStatus(String(err), true);
  }
}

function openAddModal() {
  const usernameInput = document.getElementById("new-profile-username");
  const nameInput = document.getElementById("new-profile-name");
  const pwdInput = document.getElementById("new-profile-password");
  if (usernameInput) usernameInput.value = "";
  if (nameInput) nameInput.value = "";
  if (pwdInput) pwdInput.value = "";
  if (addModal) addModal.style.display = "flex";
  if (usernameInput) usernameInput.focus();
}

function closeAddModal() {
  if (addModal) addModal.style.display = "none";
}

let pendingDeleteProfile = null;
let deleteModal;

function openDeleteModal(profile) {
  pendingDeleteProfile = profile;
  const titleEl = document.getElementById("delete-modal-title");
  const descEl = document.getElementById("delete-modal-desc");
  const pwdGroup = document.getElementById("delete-password-group");
  const pwdInput = document.getElementById("delete-profile-password-input");

  if (titleEl) titleEl.textContent = `Delete Profile: ${profile.username}`;
  if (pwdInput) pwdInput.value = "";

  if (profile.has_password) {
    if (descEl) descEl.textContent = `Profile "${profile.username}" is password-protected. Enter its password to permanently delete it.`;
    if (pwdGroup) pwdGroup.style.display = "block";
    if (pwdInput) pwdInput.required = true;
  } else {
    if (descEl) descEl.textContent = `Are you sure you want to delete profile "${profile.username}"? All saved progress will be lost.`;
    if (pwdGroup) pwdGroup.style.display = "none";
    if (pwdInput) pwdInput.required = false;
  }

  if (deleteModal) deleteModal.style.display = "flex";
  if (profile.has_password && pwdInput) pwdInput.focus();
}

function closeDeleteModal() {
  pendingDeleteProfile = null;
  if (deleteModal) deleteModal.style.display = "none";
}

function closePasswordModal() {
  pendingPasswordProfileId = null;
  if (passwordModal) passwordModal.style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  profilesSection = document.getElementById("profiles-section");
  profilesGrid = document.getElementById("profiles-grid");
  addModal = document.getElementById("add-modal");
  passwordModal = document.getElementById("password-modal");
  deleteModal = document.getElementById("delete-modal");
  statusMsg = document.getElementById("status-msg");

  const addProfileForm = document.getElementById("add-profile-form");
  if (addProfileForm) {
    addProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById("new-profile-username");
      const nameInput = document.getElementById("new-profile-name");
      const pwdInput = document.getElementById("new-profile-password");
      const username = usernameInput ? usernameInput.value.trim() : "";
      const name = nameInput ? nameInput.value.trim() : "";
      const password = pwdInput ? pwdInput.value : "";

      if (!username) {
        showStatus("Username is required.", true);
        return;
      }

      if (!invoke) {
        closeAddModal();
        window.location.href = 'middle.html';
        return;
      }

      try {
        const created = await invoke("create_profile", {
          username,
          name: name || null,
          password: password || null,
        });
        closeAddModal();
        goToMiddlePage(created);
      } catch (err) {
        showStatus(String(err), true);
      }
    });
  }

  const cancelAddBtn = document.getElementById("cancel-add-btn");
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", closeAddModal);

  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwdInput = document.getElementById("profile-password-input");
      const password = pwdInput ? pwdInput.value : "";
      if (pendingPasswordProfileId) {
        const targetId = pendingPasswordProfileId;
        closePasswordModal();
        await performLogin(targetId, password);
      }
    });
  }

  const cancelPasswordBtn = document.getElementById("cancel-password-btn");
  if (cancelPasswordBtn) cancelPasswordBtn.addEventListener("click", closePasswordModal);

  // Delete profile form
  const deleteProfileForm = document.getElementById("delete-profile-form");
  if (deleteProfileForm) {
    deleteProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!pendingDeleteProfile) return;

      const pwdInput = document.getElementById("delete-profile-password-input");
      const password = pendingDeleteProfile.has_password ? (pwdInput ? pwdInput.value : "") : null;
      const targetId = pendingDeleteProfile.id;
      const targetUsername = pendingDeleteProfile.username;

      if (!invoke) {
        closeDeleteModal();
        showStatus(`Deleted profile "${targetUsername}"`);
        return;
      }

      try {
        await invoke("delete_profile", { id: targetId, password });
        closeDeleteModal();
        showStatus(`Deleted profile "${targetUsername}"`);
        refreshProfiles();
      } catch (err) {
        showStatus(String(err), true);
      }
    });
  }

  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // Close modals on backdrop click
  if (addModal) {
    addModal.addEventListener("click", (e) => {
      if (e.target === addModal) closeAddModal();
    });
  }
  if (passwordModal) {
    passwordModal.addEventListener("click", (e) => {
      if (e.target === passwordModal) closePasswordModal();
    });
  }
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });
  }

  // Initial load
  refreshProfiles();
});