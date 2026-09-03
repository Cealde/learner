const invoke = window.__TAURI__ ? window.__TAURI__.core.invoke : null;

const displayUsername = document.getElementById('display-username');
const displayNameContainer = document.getElementById('display-name-container');
const displayName = document.getElementById('display-name');
const switchProfileBtn = document.getElementById('switch-profile-btn');

async function loadActiveProfile() {
  if (!invoke) {
    if (displayUsername) displayUsername.textContent = 'Demo User';
    return;
  }

  try {
    const active = await invoke('get_active_profile');
    if (!active) {
      window.location.href = 'index.html';
      return;
    }

    if (displayUsername) {
      displayUsername.textContent = active.username;
    }

    if (active.name && active.name.trim() !== '') {
      if (displayName) displayName.textContent = active.name;
      if (displayNameContainer) displayNameContainer.style.display = 'block';
    } else {
      if (displayNameContainer) displayNameContainer.style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to load active profile:', err);
    window.location.href = 'index.html';
  }
}

switchProfileBtn?.addEventListener('click', async () => {
  if (invoke) {
    try {
      await invoke('logout_profile');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
  window.location.href = 'index.html';
});

loadActiveProfile();