/**
 * profiles.js — Profile card rendering logic
 */

import { getAvatarColor, timeAgo } from "./utils.js";

/**
 * Render all profiles into the profiles grid.
 * @param {Array} profiles
 * @param {HTMLElement} grid
 * @param {Object} handlers — { onSelect, onDelete, onAdd }
 */
export function renderProfileGrid(profiles, grid, handlers) {
  grid.innerHTML = "";

  if (!profiles || profiles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h3>No workspaces yet</h3>
      <p>Create your first workspace to get started.</p>
    `;
    grid.appendChild(empty);
  } else {
    profiles.forEach((profile, i) => {
      const card = createProfileCard(profile, handlers, i);
      grid.appendChild(card);
    });
  }

  // Add new workspace card
  const addCard = createAddCard(handlers.onAdd);
  grid.appendChild(addCard);
}

function createProfileCard(profile, handlers, index) {
  const color = getAvatarColor(profile.name);
  const card = document.createElement("div");
  card.className = "profile-card";
  card.setAttribute("data-id", profile.id);
  card.style.animationDelay = `${index * 60}ms`;

  card.innerHTML = `
    <div class="card-top">
      <div class="profile-avatar" style="background:${color.bg};color:${color.text}">
        ${profile.initials}
      </div>
      <button class="delete-profile-btn" data-id="${profile.id}" title="Delete workspace" type="button" aria-label="Delete ${profile.name}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="card-body">
      <div class="profile-name">${escapeHtml(profile.name)}</div>
      ${
        profile.description
          ? `<div class="profile-description">${escapeHtml(profile.description)}</div>`
          : ""
      }
      <div class="profile-meta-row">
        ${
          profile.protected
            ? `<span class="badge badge-protected">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Protected
              </span>`
            : `<span class="badge badge-open">Open</span>`
        }
        <span class="last-used">${profile.last_used ? timeAgo(profile.last_used) : "Never used"}</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="enter-hint">Open workspace →</span>
    </div>
  `;

  // Click card → select profile
  card.addEventListener("click", (e) => {
    if (e.target.closest(".delete-profile-btn")) return;
    handlers.onSelect(profile);
  });

  // Delete button
  const delBtn = card.querySelector(".delete-profile-btn");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onDelete(profile);
  });

  return card;
}

function createAddCard(onAdd) {
  const btn = document.createElement("button");
  btn.id = "open-add-modal-btn";
  btn.className = "add-profile-card";
  btn.type = "button";
  btn.innerHTML = `
    <div class="add-icon-circle">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
    <span class="add-profile-label">Create Workspace</span>
  `;
  btn.addEventListener("click", onAdd);
  return btn;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
