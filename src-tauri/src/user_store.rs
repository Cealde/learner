use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

fn default_spec_no() -> f64 {
    1.0
}

#[derive(Serialize, Deserialize, Default, Clone, Debug, PartialEq)]
pub struct UserProgress {
    #[serde(alias = "lesson")]
    pub lesson_no: f64,
    #[serde(alias = "sub")]
    pub sub_no: f64,
    #[serde(alias = "spec", default = "default_spec_no")]
    pub spec_no: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(untagged)]
enum ProgressValueHelper {
    Full(UserProgress),
    TwoFields {
        lesson_no: f64,
        sub_no: f64,
    },
    Legacy(f64),
}

#[derive(Serialize, Deserialize, Default, Clone, Debug)]
pub struct UserStoreData {
    pub entries: HashMap<String, UserProgress>,
}

#[derive(Deserialize, Default)]
struct UserStoreDataRaw {
    #[serde(default)]
    pub entries: HashMap<String, ProgressValueHelper>,
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
                .and_then(|contents| {
                    if let Ok(raw) = serde_json::from_str::<UserStoreDataRaw>(&contents) {
                        let mut converted = HashMap::new();
                        for (k, v) in raw.entries {
                            match v {
                                ProgressValueHelper::Full(prog) => {
                                    converted.insert(k, prog);
                                }
                                ProgressValueHelper::TwoFields { lesson_no, sub_no } => {
                                    converted.insert(
                                        k,
                                        UserProgress {
                                            lesson_no,
                                            sub_no,
                                            spec_no: 1.0,
                                        },
                                    );
                                }
                                ProgressValueHelper::Legacy(num) => {
                                    converted.insert(
                                        k,
                                        UserProgress {
                                            lesson_no: num,
                                            sub_no: 1.0,
                                            spec_no: 1.0,
                                        },
                                    );
                                }
                            }
                        }
                        Some(UserStoreData { entries: converted })
                    } else {
                        serde_json::from_str::<UserStoreData>(&contents).ok()
                    }
                })
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
    lesson_no: f64,
    sub_no: Option<f64>,
    spec_no: Option<f64>,
) -> Result<UserProgress, String> {
    let user_key = user_key.trim().to_string();
    if user_key.is_empty() {
        return Err("User key cannot be empty".into());
    }

    let progress = UserProgress {
        lesson_no,
        sub_no: sub_no.unwrap_or(1.0),
        spec_no: spec_no.unwrap_or(1.0),
    };

    {
        let mut data = state.data.lock().map_err(|e| e.to_string())?;
        data.entries.insert(user_key, progress.clone());
    }

    state.persist()?;
    Ok(progress)
}

#[tauri::command]
pub fn get_user_value(
    state: State<'_, UserStoreState>,
    user_key: String,
) -> Result<Option<UserProgress>, String> {
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.entries.get(user_key.trim()).cloned())
}

#[tauri::command]
pub fn get_all_user_values(
    state: State<'_, UserStoreState>,
) -> Result<HashMap<String, UserProgress>, String> {
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
