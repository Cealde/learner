use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

#[derive(Serialize, Deserialize, Default, Clone, Debug)]
pub struct UserStoreData {
    pub entries: HashMap<String, f64>,
}

pub struct UserStoreState {
    db_path: PathBuf,
    data: Mutex<UserStoreData>,
}

impl UserStoreState {
    pub fn new(app_handle: &AppHandle) -> Self {
        let db_path = match app_handle.path().app_data_dir() {
            Ok(mut dir) => {
                let _ = fs::create_dir_all(&dir);
                dir.push("user_values.json");
                dir
            }
            Err(_) => PathBuf::from("user_values.json"),
        };

        let data = if db_path.exists() {
            fs::read_to_string(&db_path)
                .ok()
                .and_then(|contents| serde_json::from_str::<UserStoreData>(&contents).ok())
                .unwrap_or_default()
        } else {
            UserStoreData::default()
        };

        Self {
            db_path,
            data: Mutex::new(data),
        }
    }

    pub fn persist(&self) -> Result<(), String> {
        let data = self.data.lock().map_err(|e| e.to_string())?;
        let json = serde_json::to_string_pretty(&*data).map_err(|e| e.to_string())?;
        fs::write(&self.db_path, json).map_err(|e| e.to_string())?;
        Ok(())
    }
}

#[tauri::command]
pub fn set_user_value(
    state: State<'_, UserStoreState>,
    user_key: String,
    value: f64,
) -> Result<f64, String> {
    let user_key = user_key.trim().to_string();
    if user_key.is_empty() {
        return Err("User key cannot be empty".into());
    }

    {
        let mut data = state.data.lock().map_err(|e| e.to_string())?;
        data.entries.insert(user_key, value);
    }

    state.persist()?;
    Ok(value)
}

#[tauri::command]
pub fn get_user_value(
    state: State<'_, UserStoreState>,
    user_key: String,
) -> Result<Option<f64>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.entries.get(user_key.trim()).copied())
}

#[tauri::command]
pub fn get_all_user_values(
    state: State<'_, UserStoreState>,
) -> Result<HashMap<String, f64>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.entries.clone())
}

#[tauri::command]
pub fn delete_user_value(
    state: State<'_, UserStoreState>,
    user_key: String,
) -> Result<bool, String> {
    let removed = {
        let mut data = state.data.lock().map_err(|e| e.to_string())?;
        data.entries.remove(user_key.trim()).is_some()
    };

    if removed {
        state.persist()?;
    }
    Ok(removed)
}
