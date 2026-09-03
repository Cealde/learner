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
  if (sub) sub.textContent = `${profile.name}'s learning path is ready for its next chapter.`;

  // Stats
  const statName = document.getElementById("stat-profile-name");
  if (statName) statName.textContent = profile.name;

  const statStatus = document.getElementById("stat-status");
  if (statStatus) {
    statStatus.textContent = profile.protected ? "Private profile" : "Ready to learn";
  }

  const statLastUsed = document.getElementById("stat-last-used");
  if (statLastUsed) statLastUsed.textContent = timeAgo(profile.last_used);

  const statCreated = document.getElementById("stat-created");
  if (statCreated) statCreated.textContent = formatDate(profile.created_at);

  renderSubjects(profile);
}

function renderSubjects(profile) {
  const grid = document.getElementById("subjects-grid");
  if (!grid) return;

  const subjects = [
    { name: "Mathematics", detail: "Patterns & problem solving", progress: 72, tone: "blue", icon: "∑" },
    { name: "Science", detail: "The world, understood", progress: 48, tone: "violet", icon: "✦" },
    { name: "English", detail: "Stories & expression", progress: 86, tone: "coral", icon: "Aa" },
    { name: "Social studies", detail: "People, places & time", progress: 35, tone: "mint", icon: "◌" },
  ];

  grid.innerHTML = subjects.map((subject, index) => `
    <button class="subject-card subject-card--${subject.tone}" type="button" style="--i:${index}" aria-label="Continue ${subject.name}">
      <span class="subject-orb">${subject.icon}</span>
      <span class="subject-card-top"><span>${subject.name}</span><b>${subject.progress}%</b></span>
      <span class="subject-detail">${subject.detail}</span>
      <span class="subject-progress"><i style="--progress:${subject.progress}%"></i></span>
      <span class="subject-continue">Continue <b>→</b></span>
    </button>
  `).join("");

  grid.querySelectorAll(".subject-card").forEach((card) => {
    card.addEventListener("click", () => {
      const subject = card.querySelector(".subject-card-top span").textContent;
      card.classList.remove("subject-card--active");
      void card.offsetWidth;
      card.classList.add("subject-card--active");
      document.getElementById("dash-sub").textContent = `${profile.name} is ready to continue ${subject}.`;
    });
  });
}
