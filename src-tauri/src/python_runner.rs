use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::Write;
use std::process::{Command, Stdio};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct VariableInfo {
    pub val: String,
    pub r#type: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DebugStep {
    pub line: i32,
    pub event: String,
    pub locals: HashMap<String, VariableInfo>,
    pub stdout: String,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PythonDebugResult {
    pub success: bool,
    pub steps: Vec<DebugStep>,
    pub error: Option<String>,
    pub total_stdout: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PythonRunResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
}

const TRACER_WRAPPER: &str = r#"
import sys, json, io, traceback

code_str = sys.stdin.read()
trace_steps = []
stdout_capture = io.StringIO()
old_stdout = sys.stdout
sys.stdout = stdout_capture

def tracer(frame, event, arg):
    if frame.f_code.co_filename == "<user_code>" and event in ("line", "return", "exception"):
        locs = {}
        for k, v in frame.f_locals.items():
            if not k.startswith("__"):
                try:
                    val_repr = repr(v)
                    if len(val_repr) > 200:
                        val_repr = val_repr[:197] + "..."
                    locs[k] = {
                        "val": val_repr,
                        "type": type(v).__name__
                    }
                except Exception:
                    locs[k] = {
                        "val": "<unrepresentable>",
                        "type": type(v).__name__
                    }
        err_msg = None
        if event == "exception" and arg:
            exc_type, exc_val, _ = arg
            err_msg = f"{exc_type.__name__}: {exc_val}"
        trace_steps.append({
            "line": frame.f_lineno,
            "event": event,
            "locals": locs,
            "stdout": stdout_capture.getvalue(),
            "error": err_msg
        })
    return tracer

try:
    compiled = compile(code_str, "<user_code>", "exec")
    sys.settrace(tracer)
    exec(compiled, {"__name__": "__main__"})
except Exception as e:
    trace_steps.append({
        "line": -1,
        "event": "exception",
        "locals": {},
        "stdout": stdout_capture.getvalue(),
        "error": traceback.format_exc()
    })
finally:
    sys.settrace(None)
    sys.stdout = old_stdout

print(json.dumps(trace_steps))
"#;

#[tauri::command]
pub fn run_python(code: String) -> Result<PythonRunResult, String> {
    let mut child = Command::new("python")
        .arg("-u")
        .arg("-c")
        .arg("import sys; exec(sys.stdin.read())")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to launch Python: {}. Ensure Python is installed.", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(code.as_bytes())
            .map_err(|e| format!("Failed to pass code to Python: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Error waiting for Python output: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let success = output.status.success();

    Ok(PythonRunResult {
        success,
        stdout,
        stderr,
        exit_code: output.status.code(),
    })
}

#[tauri::command]
pub fn debug_python(code: String) -> Result<PythonDebugResult, String> {
    let mut child = Command::new("python")
        .arg("-u")
        .arg("-c")
        .arg(TRACER_WRAPPER)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to launch Python debugger: {}. Ensure Python is installed.", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(code.as_bytes())
            .map_err(|e| format!("Failed to pass code to Python debugger: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Error waiting for Python debugger: {}", e))?;

    let raw_stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let raw_stderr = String::from_utf8_lossy(&output.stderr).to_string();

    if !raw_stderr.is_empty() && raw_stdout.trim().is_empty() {
        return Ok(PythonDebugResult {
            success: false,
            steps: vec![],
            error: Some(raw_stderr.clone()),
            total_stdout: raw_stderr,
        });
    }

    match serde_json::from_str::<Vec<DebugStep>>(raw_stdout.trim()) {
        Ok(steps) => {
            let total_stdout = steps.last().map(|s| s.stdout.clone()).unwrap_or_default();
            let has_error = steps.iter().any(|s| s.error.is_some());
            let error = steps.iter().find_map(|s| s.error.clone());

            Ok(PythonDebugResult {
                success: !has_error,
                steps,
                error,
                total_stdout,
            })
        }
        Err(err) => Ok(PythonDebugResult {
            success: false,
            steps: vec![],
            error: Some(format!("Failed to parse debug trace: {}. Raw: {}", err, raw_stdout)),
            total_stdout: raw_stdout,
        }),
    }
}

#[tauri::command]
pub fn translate_with_ai(text: String, language: Option<String>) -> Result<String, String> {
    let _target_lang = language.unwrap_or_else(|| "malayalam".to_string());
    let script = r#"
import sys
try:
    from runtime import translate_to_malayalam
    raw = sys.stdin.read()
    res = translate_to_malayalam(raw)
    print(res)
except Exception as e:
    import sys
    sys.stdout.write(raw)
"#;

    let mut child = Command::new("python")
        .arg("-u")
        .arg("-c")
        .arg(script)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to launch AI translator: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(text.as_bytes())
            .map_err(|e| format!("Failed to pass content to translator: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Error waiting for translator: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if !stdout.is_empty() {
        Ok(stdout)
    } else {
        Ok(text)
    }
}
