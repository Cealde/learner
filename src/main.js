const { invoke } = window.__TAURI__.core;

let pendingPasswordProfileId = null;

// DOM Elements
let profilesSection;
let dashboardSection;
let profilesGrid;
let addModal;
let passwordModal;
let statusMsg;
let activeNameEl;

function showStatus(message, isError = false) {
  if (!statusMsg) return;
  statusMsg.textContent = message;
  statusMsg.style.display = "block";
  setTimeout(() => {
    if (statusMsg) statusMsg.style.display = "none";
  }, 4000);
}

export async function refreshProfiles() {
  try {
    const activeProfile = await invoke("get_active_profile");
    if (activeProfile) {
      showDashboard(activeProfile);
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
  if (dashboardSection) dashboardSection.style.display = "none";
}

function showDashboard(profile) {
  if (activeNameEl) activeNameEl.textContent = profile.name || "";
  if (profilesSection) profilesSection.style.display = "none";
  if (dashboardSection) dashboardSection.style.display = "block";
}

function renderProfiles(profiles) {
  if (!profilesGrid) return;
  profilesGrid.innerHTML = "";

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.setAttribute("data-id", profile.id);

    const nameSpan = document.createElement("span");
    nameSpan.className = "profile-name";
    nameSpan.textContent = profile.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-profile-btn";
    deleteBtn.setAttribute("type", "button");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        await invoke("delete_profile", { id: profile.id });
        refreshProfiles();
      } catch (err) {
        showStatus(String(err), true);
      }
    });

    card.appendChild(nameSpan);

    if (profile.has_password) {
      const lockIndicator = document.createElement("span");
      lockIndicator.className = "password-indicator";
      lockIndicator.textContent = "*";
      card.appendChild(lockIndicator);
    }

    card.appendChild(deleteBtn);

    card.addEventListener("click", () => {
      handleProfileSelect(profile);
    });

    profilesGrid.appendChild(card);
  });

  // Add profile trigger button
  const addTrigger = document.createElement("button");
  addTrigger.id = "open-add-modal-btn";
  addTrigger.setAttribute("type", "button");
  addTrigger.textContent = "+";
  addTrigger.addEventListener("click", () => {
    openAddModal();
  });
  profilesGrid.appendChild(addTrigger);
}

function handleProfileSelect(profile) {
  if (profile.has_password) {
    pendingPasswordProfileId = profile.id;
    const pwdInput = document.getElementById("profile-password-input");
    if (pwdInput) pwdInput.value = "";
    if (passwordModal) passwordModal.style.display = "block";
    if (pwdInput) pwdInput.focus();
  } else {
    performLogin(profile.id, null);
  }
}

async function performLogin(id, password) {
  try {
    const active = await invoke("login_profile", { id, password });
    showDashboard(active);
  } catch (err) {
    showStatus(String(err), true);
  }
}

function openAddModal() {
  const nameInput = document.getElementById("new-profile-name");
  const pwdInput = document.getElementById("new-profile-password");
  if (nameInput) nameInput.value = "";
  if (pwdInput) pwdInput.value = "";
  if (addModal) addModal.style.display = "block";
  if (nameInput) nameInput.focus();
}

function closeAddModal() {
  if (addModal) addModal.style.display = "none";
}

function closePasswordModal() {
  pendingPasswordProfileId = null;
  if (passwordModal) passwordModal.style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  profilesSection = document.getElementById("profiles-section");
  dashboardSection = document.getElementById("dashboard-section");
  profilesGrid = document.getElementById("profiles-grid");
  addModal = document.getElementById("add-modal");
  passwordModal = document.getElementById("password-modal");
  statusMsg = document.getElementById("status-msg");
  activeNameEl = document.getElementById("active-name");

  // Add profile form
  const addProfileForm = document.getElementById("add-profile-form");
  if (addProfileForm) {
    addProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("new-profile-name");
      const pwdInput = document.getElementById("new-profile-password");
      const name = nameInput ? nameInput.value : "";
      const password = pwdInput ? pwdInput.value : "";

      try {
        const created = await invoke("create_profile", {
          name,
          password: password || null,
        });
        closeAddModal();
        showDashboard(created);
      } catch (err) {
        showStatus(String(err), true);
      }
    });
  }

  const cancelAddBtn = document.getElementById("cancel-add-btn");
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", closeAddModal);

  // Password Form
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

  // Switch / Logout button
  const switchProfileBtn = document.getElementById("switch-profile-btn");
  if (switchProfileBtn) {
    switchProfileBtn.addEventListener("click", async () => {
      try {
        await invoke("logout_profile");
        refreshProfiles();
      } catch (err) {
        showStatus(String(err), true);
      }
    });
  }

  // Initial load
  refreshProfiles();
});
