use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager, State};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Profile {
    pub id: String,
    pub username: String,
    pub name: Option<String>,
    pub password: Option<String>,
    pub created_at: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProfilePublic {
    pub id: String,
    pub username: String,
    pub name: Option<String>,
    pub has_password: bool,
    pub created_at: u64,
}

impl From<&Profile> for ProfilePublic {
    fn from(p: &Profile) -> Self {
        ProfilePublic {
            id: p.id.clone(),
            username: p.username.clone(),
            name: p.name.clone(),
            has_password: p.password.as_ref().map_or(false, |pwd| !pwd.trim().is_empty()),
            created_at: p.created_at,
        }
    }
}

#[derive(Serialize, Deserialize, Default)]
struct Database {
    profiles: Vec<Profile>,
    active_profile_id: Option<String>,
}

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

    pub fn get_active_username(&self) -> String {
        if let Ok(data) = self.data.lock() {
            if let Some(active_id) = &data.active_profile_id {
                if let Some(profile) = data.profiles.iter().find(|p| &p.id == active_id) {
                    return profile.username.clone();
                }
            }
        }
        "Guest".to_string()
    }
}

#[tauri::command]
fn get_profiles(state: State<'_, AppState>) -> Result<Vec<ProfilePublic>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.profiles.iter().map(ProfilePublic::from).collect())
}

#[tauri::command]
fn create_profile(
    state: State<'_, AppState>,
    username: String,
    name: Option<String>,
    password: Option<String>,
) -> Result<ProfilePublic, String> {
    let username = username.trim().to_string();
    if username.is_empty() {
        return Err("Username cannot be empty".into());
    }

    let name_cleaned = name.and_then(|n| {
        let trimmed = n.trim().to_string();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed)
        }
    });

    let password_cleaned = password.and_then(|p| {
        let trimmed = p.trim().to_string();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed)
        }
    });

    let mut data = state.data.lock().map_err(|e| e.to_string())?;

    if data
        .profiles
        .iter()
        .any(|p| p.username.eq_ignore_ascii_case(&username))
    {
        return Err("A profile with this username already exists".into());
    }

    let id = format!(
        "prof_{}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
    );

    let created_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let new_profile = Profile {
        id: id.clone(),
        username,
        name: name_cleaned,
        password: password_cleaned,
        created_at,
    };

    let public_profile = ProfilePublic::from(&new_profile);

    data.profiles.push(new_profile);
    data.active_profile_id = Some(id);

    drop(data);
    state.persist()?;

    Ok(public_profile)
}

#[tauri::command]
fn delete_profile(
    state: State<'_, AppState>,
    user_store_state: State<'_, user_store::UserStoreState>,
    id: String,
    password: Option<String>,
) -> Result<(), String> {
    let mut data = state.data.lock().map_err(|e| e.to_string())?;

    let profile = data
        .profiles
        .iter()
        .find(|p| p.id == id)
        .ok_or_else(|| "Profile not found".to_string())?;

    if let Some(required_pwd) = &profile.password {
        let input_pwd = password.unwrap_or_default();
        if &input_pwd != required_pwd {
            return Err("Incorrect password. Cannot delete protected profile.".into());
        }
    }

    let username = profile.username.clone();
    data.profiles.retain(|p| p.id != id);
    if data.active_profile_id.as_deref() == Some(&id) {
        data.active_profile_id = None;
    }

    drop(data);
    state.persist()?;

    let _ = user_store_state.delete_user_data(&username);

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

    if let Some(required_pwd) = &profile.password {
        let input_pwd = password.unwrap_or_default();
        if &input_pwd != required_pwd {
            return Err("Incorrect password".into());
        }
    }

    let public_profile = ProfilePublic::from(profile);
    data.active_profile_id = Some(id);

    drop(data);
    state.persist()?;

    Ok(public_profile)
}

#[tauri::command]
async fn get_active_profile(state: State<'_, AppState>) -> Result<Option<ProfilePublic>, String> {
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

pub mod user_store;
pub mod python_runner;

use python_runner::{debug_python, run_python, translate_with_ai, verify_python_ast};
use user_store::{
    clear_lesson_mistakes, delete_user_value, get_ai_breakdowns, get_all_user_values,
    get_lesson_mistakes, get_quiz_states, get_user_progress, get_user_value, record_subtopic_progress,
    save_ai_breakdown, save_lesson_mistakes, save_quiz_state, set_user_value,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_state = AppState::new(app.handle());
            let user_store_state = user_store::UserStoreState::new(app.handle());
            app.manage(app_state);
            app.manage(user_store_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_profiles,
            create_profile,
            delete_profile,
            login_profile,
            get_active_profile,
            logout_profile,
            set_user_value,
            get_user_value,
            get_all_user_values,
            delete_user_value,
            get_user_progress,
            record_subtopic_progress,
            save_lesson_mistakes,
            get_lesson_mistakes,
            clear_lesson_mistakes,
            save_ai_breakdown,
            get_ai_breakdowns,
            save_quiz_state,
            get_quiz_states,
            run_python,
            debug_python,
            translate_with_ai,
            verify_python_ast
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}