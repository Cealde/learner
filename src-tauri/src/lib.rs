use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager, State};

// ============================================================
// Helpers
// ============================================================

fn now_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn now_millis() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
}

fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    hex::encode(hasher.finalize())
}

/// Auto-generate initials from a name.
/// "Developer" → "D", "My Personal Workspace" → "MPW", "Pentesting Lab" → "PL"
fn generate_initials(name: &str) -> String {
    let words: Vec<&str> = name.split_whitespace().collect();
    if words.is_empty() {
        return "?".to_string();
    }
    if words.len() == 1 {
        words[0]
            .chars()
            .next()
            .map(|c| c.to_uppercase().to_string())
            .unwrap_or_else(|| "?".to_string())
    } else {
        words
            .iter()
            .filter_map(|w| w.chars().next())
            .map(|c| c.to_uppercase().to_string())
            .collect::<Vec<_>>()
            .join("")
    }
}

// ============================================================
// Data Models
// ============================================================

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub initials: String,
    pub password_hash: Option<String>,
    pub protected: bool,
    pub created_at: u64,
    pub last_used: Option<u64>,
}

/// Public-facing profile struct — never exposes password_hash
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProfilePublic {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub initials: String,
    pub protected: bool,
    pub created_at: u64,
    pub last_used: Option<u64>,
}

impl From<&Profile> for ProfilePublic {
    fn from(p: &Profile) -> Self {
        ProfilePublic {
            id: p.id.clone(),
            name: p.name.clone(),
            description: p.description.clone(),
            initials: p.initials.clone(),
            protected: p.protected,
            created_at: p.created_at,
            last_used: p.last_used,
        }
    }
}

#[derive(Serialize, Deserialize, Default)]
struct Database {
    profiles: Vec<Profile>,
    active_profile_id: Option<String>,
}

// ============================================================
// App State
// ============================================================

pub struct AppState {
    db_path: PathBuf,
    data: Mutex<Database>,
}

impl AppState {
    fn new(app_handle: &AppHandle) -> Self {
        let db_path = match app_handle.path().app_data_dir() {
            Ok(mut dir) => {
                let _ = fs::create_dir_all(&dir);
                dir.push("profiles.json");
                dir
            }
            Err(_) => PathBuf::from("profiles.json"),
        };

        let db = if db_path.exists() {
            fs::read_to_string(&db_path)
                .ok()
                .and_then(|contents| serde_json::from_str::<Database>(&contents).ok())
                .unwrap_or_default()
        } else {
            Database::default()
        };

        Self {
            db_path,
            data: Mutex::new(db),
        }
    }

    fn persist(&self) -> Result<(), String> {
        let data = self.data.lock().map_err(|e| e.to_string())?;
        let json = serde_json::to_string_pretty(&*data).map_err(|e| e.to_string())?;
        fs::write(&self.db_path, json).map_err(|e| e.to_string())?;
        Ok(())
    }
}

// ============================================================
// Tauri Commands
// ============================================================

#[tauri::command]
fn get_profiles(state: State<'_, AppState>) -> Result<Vec<ProfilePublic>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.profiles.iter().map(ProfilePublic::from).collect())
}

#[tauri::command]
fn create_profile(
    state: State<'_, AppState>,
    name: String,
    description: Option<String>,
    password: Option<String>,
) -> Result<ProfilePublic, String> {
    let name = name.trim().to_string();
    if name.is_empty() {
        return Err("Profile name cannot be empty".into());
    }

    let password_trimmed = password
        .as_deref()
        .map(str::trim)
        .filter(|p| !p.is_empty())
        .map(str::to_string);

    let mut data = state.data.lock().map_err(|e| e.to_string())?;

    if data
        .profiles
        .iter()
        .any(|p| p.name.eq_ignore_ascii_case(&name))
    {
        return Err("A workspace with this name already exists".into());
    }

    let id = format!("prof_{}", now_millis());
    let initials = generate_initials(&name);
    let protected = password_trimmed.is_some();
    let password_hash = password_trimmed.as_deref().map(hash_password);

    let new_profile = Profile {
        id: id.clone(),
        name,
        description: description.map(|d| d.trim().to_string()).filter(|d| !d.is_empty()),
        initials,
        password_hash,
        protected,
        created_at: now_secs(),
        last_used: None,
    };

    let public_profile = ProfilePublic::from(&new_profile);
    data.profiles.push(new_profile);

    drop(data);
    state.persist()?;

    Ok(public_profile)
}

#[tauri::command]
fn update_profile(
    state: State<'_, AppState>,
    id: String,
    description: Option<String>,
) -> Result<ProfilePublic, String> {
    let mut data = state.data.lock().map_err(|e| e.to_string())?;

    let profile = data
        .profiles
        .iter_mut()
        .find(|p| p.id == id)
        .ok_or_else(|| "Profile not found".to_string())?;

    profile.description = description
        .map(|d| d.trim().to_string())
        .filter(|d| !d.is_empty());

    let public_profile = ProfilePublic::from(&*profile);
    drop(data);
    state.persist()?;

    Ok(public_profile)
}

#[tauri::command]
fn delete_profile(state: State<'_, AppState>, id: String) -> Result<(), String> {
    {
        let mut data = state.data.lock().map_err(|e| e.to_string())?;
        data.profiles.retain(|p| p.id != id);
        if data.active_profile_id.as_deref() == Some(&id) {
            data.active_profile_id = None;
        }
    }
    state.persist()?;
    Ok(())
}

#[tauri::command]
fn login_profile(
    state: State<'_, AppState>,
    id: String,
    password: Option<String>,
) -> Result<ProfilePublic, String> {
    let mut data = state.data.lock().map_err(|e| e.to_string())?;

    let profile = data
        .profiles
        .iter()
        .find(|p| p.id == id)
        .ok_or_else(|| "Profile not found".to_string())?;

    if profile.protected {
        let input_pwd = password.as_deref().unwrap_or("").trim().to_string();
        if input_pwd.is_empty() {
            return Err("Password required".into());
        }
        let input_hash = hash_password(&input_pwd);
        if profile.password_hash.as_deref() != Some(&input_hash) {
            return Err("Incorrect password".into());
        }
    }

    // Update last_used
    let profile = data
        .profiles
        .iter_mut()
        .find(|p| p.id == id)
        .ok_or_else(|| "Profile not found".to_string())?;
    profile.last_used = Some(now_secs());

    let public_profile = ProfilePublic::from(&*profile);
    data.active_profile_id = Some(id);

    drop(data);
    state.persist()?;

    Ok(public_profile)
}

#[tauri::command]
fn get_active_profile(state: State<'_, AppState>) -> Result<Option<ProfilePublic>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    if let Some(active_id) = &data.active_profile_id {
        let profile = data.profiles.iter().find(|p| &p.id == active_id);
        Ok(profile.map(ProfilePublic::from))
    } else {
        Ok(None)
    }
}

#[tauri::command]
fn logout_profile(state: State<'_, AppState>) -> Result<(), String> {
    {
        let mut data = state.data.lock().map_err(|e| e.to_string())?;
        data.active_profile_id = None;
    }
    state.persist()?;
    Ok(())
}

#[tauri::command]
fn is_profile_protected(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    let profile = data
        .profiles
        .iter()
        .find(|p| p.id == id)
        .ok_or_else(|| "Profile not found".to_string())?;
    Ok(profile.protected)
}

// ============================================================
// Entry Point
// ============================================================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_state = AppState::new(app.handle());
            app.manage(app_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_profiles,
            create_profile,
            update_profile,
            delete_profile,
            login_profile,
            get_active_profile,
            logout_profile,
            is_profile_protected,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}