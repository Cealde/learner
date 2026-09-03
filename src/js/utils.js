/**
 * utils.js — Shared utility functions
 */

/**
 * Format a unix timestamp (seconds) into a relative human-readable string.
 * e.g. "2 hours ago", "Just now", "3 days ago"
 */
export function timeAgo(unixSecs) {
  if (!unixSecs) return "Never";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixSecs;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(unixSecs * 1000).toLocaleDateString();
}

/**
 * Format unix timestamp into a display date string.
 */
export function formatDate(unixSecs) {
  if (!unixSecs) return "—";
  return new Date(unixSecs * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get a deterministic background color for an avatar based on the profile name.
 */
const AVATAR_COLORS = [
  { bg: "#1a6bff", text: "#ffffff" },
  { bg: "#0052cc", text: "#ffffff" },
  { bg: "#0ea5e9", text: "#ffffff" },
  { bg: "#6366f1", text: "#ffffff" },
  { bg: "#8b5cf6", text: "#ffffff" },
  { bg: "#ec4899", text: "#ffffff" },
  { bg: "#059669", text: "#ffffff" },
  { bg: "#dc2626", text: "#ffffff" },
  { bg: "#d97706", text: "#ffffff" },
  { bg: "#0891b2", text: "#ffffff" },
];

export function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Greet based on current hour.
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
