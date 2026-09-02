use dotenvy::dotenv;
use postgrest::Postgrest;
use serde::{Deserialize, Serialize};
use std::env;
use tauri::State;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct UserProfile {
    pub id: String,
    pub email: String,
}

pub struct AppState {
    pub supabase: Postgrest,
}

#[tauri::command]
async fn simple_login(
    state: State<'_, AppState>,
    email: String,
    password: String,
) -> Result<UserProfile, String> {
    let query_email = format!("eq.{}", email);
    let query_password = format!("eq.{}", password);

    let response = state
        .supabase
        .from("app_users")
        .select("id, email")
        .eq("email", query_email)
        .eq("password", query_password)
        .limit(1)
        .execute()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let body = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    let users: Vec<UserProfile> = serde_json::from_str(&body)
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    match users.into_iter().next() {
        Some(user) => Ok(user),
        None => Err("Invalid email or password".into()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();

    let supabase_url = env::var("SUPABASE_URL")
        .expect("SUPABASE_URL must be set in .env or environment");
    let supabase_key = env::var("SUPABASE_ANON_KEY")
        .expect("SUPABASE_ANON_KEY must be set in .env or environment");

    let client = Postgrest::new(supabase_url)
        .insert_header("apikey", &supabase_key)
        .insert_header("Authorization", format!("Bearer {}", supabase_key));

    tauri::Builder::default()
        .manage(AppState { supabase: client })
        .invoke_handler(tauri::generate_handler![simple_login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}