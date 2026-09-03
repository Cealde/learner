/**
 * dashboard.js — Dashboard rendering and logic
 */

import { getAvatarColor, getGreeting, timeAgo, formatDate } from "./utils.js";

export function renderDashboard(profile) {
  const color = getAvatarColor(profile.name);

  // Show header pill
  const pill = document.getElementById("header-profile-pill");
  if (pill) pill.style.display = "flex";

  // Update header avatar
  const headerAvatar = document.getElementById("header-avatar");
  if (headerAvatar) {
    headerAvatar.textContent = profile.initials;
    headerAvatar.style.background = color.bg;
    headerAvatar.style.color = color.text;
  }

  // Update profile name
  const headerName = document.getElementById("header-profile-name");
  if (headerName) headerName.textContent = profile.name;

  // Update greeting
  const greeting = document.getElementById("dash-greeting");
  if (greeting) greeting.textContent = getGreeting() + ".";

  // Update subtext
  const sub = document.getElementById("dash-sub");
  if (sub) sub.textContent = `Welcome to your ${profile.name} workspace.`;

  // Stats
  const statName = document.getElementById("stat-profile-name");
  if (statName) statName.textContent = profile.name;

  const statStatus = document.getElementById("stat-status");
  if (statStatus) {
    statStatus.textContent = profile.protected ? "Password protected" : "Open workspace";
  }

  const statLastUsed = document.getElementById("stat-last-used");
  if (statLastUsed) statLastUsed.textContent = timeAgo(profile.last_used);

  const statCreated = document.getElementById("stat-created");
  if (statCreated) statCreated.textContent = formatDate(profile.created_at);
}
