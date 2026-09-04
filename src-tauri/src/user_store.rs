use crate::AppState;
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
    #[serde(alias = "lesson", default = "default_spec_no")]
    pub lesson_no: f64,
    #[serde(alias = "sub", default = "default_spec_no")]
    pub sub_no: f64,
    #[serde(alias = "spec", default = "default_spec_no")]
    pub spec_no: f64,
    #[serde(default)]
    pub completed_subtopics: Vec<String>,
    #[serde(default)]
    pub max_visited_subs: HashMap<String, u32>,
    #[serde(default)]
    pub lesson_mistakes: HashMap<String, Vec<serde_json::Value>>,
    #[serde(default)]
    pub ai_breakdowns: HashMap<String, serde_json::Value>,
    #[serde(default)]
    pub quiz_states: HashMap<String, serde_json::Value>,
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
                                            completed_subtopics: Vec::new(),
                                            max_visited_subs: HashMap::new(),
                                            lesson_mistakes: HashMap::new(),
                                            ai_breakdowns: HashMap::new(),
                                            quiz_states: HashMap::new(),
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
                                            completed_subtopics: Vec::new(),
                                            max_visited_subs: HashMap::new(),
                                            lesson_mistakes: HashMap::new(),
                                            ai_breakdowns: HashMap::new(),
                                            quiz_states: HashMap::new(),
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

    pub fn delete_user_data(&self, username: &str) -> Result<(), String> {
        let mut data = self.data.lock().map_err(|e| e.to_string())?;
        data.entries.remove(username);
        drop(data);
        self.persist()
    }
}

fn resolve_key(app_state: &State<'_, AppState>, user_key: Option<String>) -> String {
    if let Some(key) = user_key {
        let trimmed = key.trim().to_string();
        if !trimmed.is_empty() {
            return trimmed;
        }
    }
    app_state.get_active_username()
}

#[tauri::command]
pub fn get_user_progress(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
) -> Result<UserProgress, String> {
    let key = resolve_key(&app_state, user_key);
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.entries.get(&key).cloned().unwrap_or(UserProgress {
        lesson_no: 1.0,
        sub_no: 1.0,
        spec_no: 1.0,
        completed_subtopics: Vec::new(),
        max_visited_subs: HashMap::new(),
        lesson_mistakes: HashMap::new(),
        ai_breakdowns: HashMap::new(),
        quiz_states: HashMap::new(),
    }))
}

#[tauri::command]
pub fn record_subtopic_progress(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    spcl: String,
    lsn: u32,
    sub: u32,
    completed: bool,
    max_sub: Option<u32>,
) -> Result<UserProgress, String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    let prog = data.entries.entry(key).or_insert(UserProgress {
        lesson_no: 1.0,
        sub_no: 1.0,
        spec_no: 1.0,
        completed_subtopics: Vec::new(),
        max_visited_subs: HashMap::new(),
        lesson_mistakes: HashMap::new(),
        ai_breakdowns: HashMap::new(),
        quiz_states: HashMap::new(),
    });

    let sub_key = format!("{}_{}_{}", spcl, lsn, sub);
    if completed && !prog.completed_subtopics.contains(&sub_key) {
        prog.completed_subtopics.push(sub_key);
    }

    let lesson_key = format!("{}_{}", spcl, lsn);
    let current_max = *prog.max_visited_subs.get(&lesson_key).unwrap_or(&1);
    let new_max = current_max.max(max_sub.unwrap_or(sub));
    prog.max_visited_subs.insert(lesson_key, new_max);

    let result = prog.clone();
    drop(data);
    state.persist()?;
    Ok(result)
}

#[tauri::command]
pub fn save_lesson_mistakes(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    spcl: String,
    lsn: u32,
    mistakes: Vec<serde_json::Value>,
) -> Result<(), String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    let prog = data.entries.entry(key).or_insert_with(Default::default);
    let lesson_key = format!("{}_{}", spcl, lsn);
    prog.lesson_mistakes.insert(lesson_key, mistakes);
    drop(data);
    state.persist()?;
    Ok(())
}

#[tauri::command]
pub fn get_lesson_mistakes(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    spcl: String,
    lsn: u32,
) -> Result<Vec<serde_json::Value>, String> {
    let key = resolve_key(&app_state, user_key);
    let data = state.data.lock().map_err(|e| e.to_string())?;
    let lesson_key = format!("{}_{}", spcl, lsn);
    Ok(data
        .entries
        .get(&key)
        .and_then(|p| p.lesson_mistakes.get(&lesson_key).cloned())
        .unwrap_or_default())
}

#[tauri::command]
pub fn clear_lesson_mistakes(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    spcl: String,
    lsn: u32,
) -> Result<(), String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    if let Some(prog) = data.entries.get_mut(&key) {
        let lesson_key = format!("{}_{}", spcl, lsn);
        prog.lesson_mistakes.remove(&lesson_key);
    }
    drop(data);
    state.persist()?;
    Ok(())
}

#[tauri::command]
pub fn save_ai_breakdown(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    breakdown_key: String,
    breakdown: serde_json::Value,
) -> Result<(), String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    let prog = data.entries.entry(key).or_insert_with(Default::default);
    prog.ai_breakdowns.insert(breakdown_key, breakdown);
    drop(data);
    state.persist()?;
    Ok(())
}

#[tauri::command]
pub fn get_ai_breakdowns(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
) -> Result<HashMap<String, serde_json::Value>, String> {
    let key = resolve_key(&app_state, user_key);
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data
        .entries
        .get(&key)
        .map(|p| p.ai_breakdowns.clone())
        .unwrap_or_default())
}

#[tauri::command]
pub fn save_quiz_state(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    quiz_key: String,
    quiz_state: serde_json::Value,
) -> Result<(), String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    let prog = data.entries.entry(key).or_insert_with(Default::default);
    prog.quiz_states.insert(quiz_key, quiz_state);
    drop(data);
    state.persist()?;
    Ok(())
}

#[tauri::command]
pub fn get_quiz_states(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
) -> Result<HashMap<String, serde_json::Value>, String> {
    let key = resolve_key(&app_state, user_key);
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data
        .entries
        .get(&key)
        .map(|p| p.quiz_states.clone())
        .unwrap_or_default())
}

#[tauri::command]
pub fn set_user_value(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
    lesson_no: f64,
    sub_no: Option<f64>,
    spec_no: Option<f64>,
) -> Result<UserProgress, String> {
    let key = resolve_key(&app_state, user_key);
    let mut data = state.data.lock().map_err(|e| e.to_string())?;
    let prog = data.entries.entry(key).or_insert_with(Default::default);
    prog.lesson_no = lesson_no;
    if let Some(s) = sub_no {
        prog.sub_no = s;
    }
    if let Some(sp) = spec_no {
        prog.spec_no = sp;
    }
    let result = prog.clone();
    drop(data);
    state.persist()?;
    Ok(result)
}

#[tauri::command]
pub fn get_user_value(
    app_state: State<'_, AppState>,
    state: State<'_, UserStoreState>,
    user_key: Option<String>,
) -> Result<Option<UserProgress>, String> {
    let key = resolve_key(&app_state, user_key);
    let data = state.data.lock().map_err(|e| e.to_string())?;
    Ok(data.entries.get(&key).cloned())
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
