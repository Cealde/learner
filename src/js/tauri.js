/**
 * tauri.js — Clean Tauri IPC abstraction layer
 * All Rust ↔ JS communication goes through this module.
 */

const { invoke } = window.__TAURI__.core;

export async function getProfiles() {
  return await invoke("get_profiles");
}

export async function createProfile(name, description, password) {
  return await invoke("create_profile", {
    name,
    description: description || null,
    password: password || null,
  });
}

export async function updateProfile(id, description) {
  return await invoke("update_profile", { id, description: description || null });
}

export async function deleteProfile(id) {
  return await invoke("delete_profile", { id });
}

export async function loginProfile(id, password) {
  return await invoke("login_profile", { id, password: password || null });
}

export async function getActiveProfile() {
  return await invoke("get_active_profile");
}

export async function logoutProfile() {
  return await invoke("logout_profile");
}

export async function isProfileProtected(id) {
  return await invoke("is_profile_protected", { id });
}
