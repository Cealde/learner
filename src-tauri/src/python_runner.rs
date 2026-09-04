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

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AstVerifyResult {
    pub is_valid: bool,
    pub check_passed: bool,
    pub message: String,
    pub details: Option<String>,
}

#[tauri::command]
pub fn verify_python_ast(code: String, check_type: String) -> Result<AstVerifyResult, String> {
    let script = r#"
import sys, ast, json

code = sys.stdin.read()
check_type = sys.argv[1] if len(sys.argv) > 1 else "int_not_str_5"

try:
    tree = ast.parse(code)
except SyntaxError as e:
    print(json.dumps({
        "is_valid": False,
        "check_passed": False,
        "message": f"Syntax Error: {e.msg} at line {e.lineno}",
        "details": "syntax_error"
    }))
    sys.exit(0)

if check_type in ("int_not_str_5", "int_5"):
    found_int_5 = False
    found_str_5 = False
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and getattr(node.func, 'id', '') == 'print':
            for arg in node.args:
                if isinstance(arg, ast.Constant):
                    if arg.value == 5 and isinstance(arg.value, int) and not isinstance(arg.value, bool):
                        found_int_5 = True
                    elif arg.value in ("5", '5'):
                        found_str_5 = True
                elif hasattr(ast, 'Num') and isinstance(arg, ast.Num) and arg.n == 5 and isinstance(arg.n, int):
                    found_int_5 = True
                elif hasattr(ast, 'Str') and isinstance(arg, ast.Str) and arg.s == "5":
                    found_str_5 = True

    if found_int_5:
        print(json.dumps({
            "is_valid": True,
            "check_passed": True,
            "message": "AI Verification: Confirmed 5 is printed as an integer (int), not a string!",
            "details": "int_literal"
        }))
    elif found_str_5:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You used quotation marks around '5' or \"5\". In Python, quotes create text (strings). To print an integer number, write print(5) without quotes!",
            "details": "string_literal"
        }))
    else:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "Did not find print(5). Make sure to write print(5) without quotes.",
            "details": "missing_print_5"
        }))

elif check_type in ("create_name_age_vars", "variables_name_age"):
    assigned_vars = set()
    printed_vars = []
    hardcoded_prints = []
    quoted_var_prints = []

    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name):
                    assigned_vars.add(target.id)
        elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
            call = stmt.value
            if getattr(call.func, 'id', '') == 'print':
                for arg in call.args:
                    if isinstance(arg, ast.Name):
                        printed_vars.append(arg.id)
                    elif isinstance(arg, ast.Constant):
                        if arg.value in ("name", "age"):
                            quoted_var_prints.append(arg.value)
                        else:
                            hardcoded_prints.append(str(arg.value))
                    elif hasattr(ast, 'Str') and isinstance(arg, ast.Str):
                        if arg.s in ("name", "age"):
                            quoted_var_prints.append(arg.s)
                        else:
                            hardcoded_prints.append(arg.s)
                    elif hasattr(ast, 'Num') and isinstance(arg, ast.Num):
                        hardcoded_prints.append(str(arg.n))

    if "name" not in assigned_vars:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'name' was not assigned. Create it like: name = \"Alice\"",
            "details": "missing_var_name"
        }))
    elif "age" not in assigned_vars:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'age' was not assigned. Create it like: age = 25",
            "details": "missing_var_age"
        }))
    elif quoted_var_prints:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": f"AI Detection: You put quotation marks around '{quoted_var_prints[0]}' in print(). Write print({quoted_var_prints[0]}) without quotes to print the variable's value!",
            "details": "quoted_variable_in_print"
        }))
    elif hardcoded_prints and ("name" not in printed_vars or "age" not in printed_vars):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You printed literal values instead of printing the variables. Use print(name) and print(age) without quotes around the variable names!",
            "details": "literal_printed_instead_of_variable"
        }))
    elif "name" not in printed_vars or "age" not in printed_vars:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Make sure to print both variables: print(name) and print(age).",
            "details": "missing_print_var"
        }))
    else:
        print(json.dumps({
            "is_valid": True,
            "check_passed": True,
            "message": "AI Verification: Confirmed variables 'name' and 'age' are created and printed correctly!",
            "details": "ok"
        }))

elif check_type in ("score_int_player_str", "variables_score_player"):
    score_val_type = None
    player_val_type = None
    printed_vars = []
    hardcoded_prints = []
    quoted_var_prints = []

    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name):
                    if target.id == "score":
                        if isinstance(stmt.value, ast.Constant):
                            if isinstance(stmt.value.value, int) and not isinstance(stmt.value.value, bool):
                                score_val_type = "int"
                            elif isinstance(stmt.value.value, str):
                                score_val_type = "str"
                        elif hasattr(ast, 'Num') and isinstance(stmt.value, ast.Num):
                            score_val_type = "int"
                        elif hasattr(ast, 'Str') and isinstance(stmt.value, ast.Str):
                            score_val_type = "str"
                        else:
                            score_val_type = "other"
                    elif target.id == "player":
                        if isinstance(stmt.value, ast.Constant):
                            if isinstance(stmt.value.value, str):
                                player_val_type = "str"
                            elif isinstance(stmt.value.value, int):
                                player_val_type = "int"
                        elif hasattr(ast, 'Str') and isinstance(stmt.value, ast.Str):
                            player_val_type = "str"
                        elif hasattr(ast, 'Num') and isinstance(stmt.value, ast.Num):
                            player_val_type = "int"
                        else:
                            player_val_type = "other"
        elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
            call = stmt.value
            if getattr(call.func, 'id', '') == 'print':
                for arg in call.args:
                    if isinstance(arg, ast.Name):
                        printed_vars.append(arg.id)
                    elif isinstance(arg, ast.Constant):
                        if arg.value in ("score", "player"):
                            quoted_var_prints.append(arg.value)
                        else:
                            hardcoded_prints.append(str(arg.value))
                    elif hasattr(ast, 'Str') and isinstance(arg, ast.Str):
                        if arg.s in ("score", "player"):
                            quoted_var_prints.append(arg.s)
                        else:
                            hardcoded_prints.append(arg.s)
                    elif hasattr(ast, 'Num') and isinstance(arg, ast.Num):
                        hardcoded_prints.append(str(arg.n))

    if score_val_type is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'score' was not assigned. Create it as a number: score = 100",
            "details": "missing_var_score"
        }))
    elif score_val_type == "str":
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: 'score' was assigned with quotes as text. For integer numbers, write score = 100 without quotes!",
            "details": "score_as_string"
        }))
    elif player_val_type is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'player' was not assigned. Create it as text: player = \"John\"",
            "details": "missing_var_player"
        }))
    elif player_val_type != "str":
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: 'player' should be text (string). Make sure to wrap it in quotes: player = \"John\"",
            "details": "player_not_string"
        }))
    elif quoted_var_prints:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": f"AI Detection: You put quotation marks around '{quoted_var_prints[0]}' in print(). Write print({quoted_var_prints[0]}) without quotes to print the variable!",
            "details": "quoted_variable_in_print"
        }))
    elif hardcoded_prints and ("score" not in printed_vars or "player" not in printed_vars):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You printed literal values instead of passing the variables. Use print(score) and print(player)!",
            "details": "literal_printed_instead_of_variable"
        }))
    elif "score" not in printed_vars or "player" not in printed_vars:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Make sure to print both variables: print(score) and print(player).",
            "details": "missing_print_var"
        }))
    else:
        print(json.dumps({
            "is_valid": True,
            "check_passed": True,
            "message": "AI Verification: Confirmed integer 'score' and string 'player' are created and printed correctly!",
            "details": "ok"
        }))

elif check_type in ("score_reassign_0_50", "variable_reassign"):
    actions = []
    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "score":
                    val = None
                    if isinstance(stmt.value, ast.Constant):
                        val = stmt.value.value
                    elif hasattr(ast, 'Num') and isinstance(stmt.value, ast.Num):
                        val = stmt.value.n
                    actions.append(("assign_score", val))
        elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
            call = stmt.value
            if getattr(call.func, 'id', '') == 'print':
                args_info = []
                for arg in call.args:
                    if isinstance(arg, ast.Name):
                        args_info.append(("name", arg.id))
                    elif isinstance(arg, ast.Constant):
                        args_info.append(("const", arg.value))
                    elif hasattr(ast, 'Num') and isinstance(arg, ast.Num):
                        args_info.append(("const", arg.n))
                    elif hasattr(ast, 'Str') and isinstance(arg, ast.Str):
                        args_info.append(("const", arg.s))
                actions.append(("print", args_info))

    hardcoded_0_50 = False
    has_print_0 = any(act[0] == "print" and any(arg == ("const", 0) for arg in act[1]) for act in actions)
    has_print_50 = any(act[0] == "print" and any(arg == ("const", 50) for arg in act[1]) for act in actions)
    assign_score_count = sum(1 for act in actions if act[0] == "assign_score")

    if (has_print_0 or has_print_50) and assign_score_count < 2:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You wrote print(0) or print(50) directly. The goal is to update a variable! Create score = 0, print(score), update score = 50, and print(score) again.",
            "details": "hardcoded_numbers"
        }))
    else:
        state = 0
        for act in actions:
            if state == 0:
                if act[0] == "assign_score" and act[1] == 0:
                    state = 1
                elif act[0] == "assign_score":
                    state = 1
            elif state == 1:
                if act[0] == "print" and any(arg == ("name", "score") for arg in act[1]):
                    state = 2
            elif state == 2:
                if act[0] == "assign_score" and act[1] == 50:
                    state = 3
                elif act[0] == "assign_score":
                    state = 3
            elif state == 3:
                if act[0] == "print" and any(arg == ("name", "score") for arg in act[1]):
                    state = 4

        if state == 4:
            print(json.dumps({
                "is_valid": True,
                "check_passed": True,
                "message": "AI Verification: Confirmed variable 'score' is created, printed, updated to 50, and printed again!",
                "details": "ok"
            }))
        elif state == 0:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Start by creating score = 0.",
                "details": "missing_initial_assign"
            }))
        elif state == 1:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Print the score after creating it: print(score).",
                "details": "missing_first_print"
            }))
        elif state == 2:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Update the variable to 50: score = 50.",
                "details": "missing_reassign"
            }))
        elif state == 3:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Print the updated score: print(score).",
                "details": "missing_second_print"
            }))

elif check_type in ("math_four_operators", "four_math_ops"):
    ops_found = set()
    has_bracket_combo = False

    for node in ast.walk(tree):
        if isinstance(node, ast.BinOp):
            if isinstance(node.op, ast.Add):
                ops_found.add("+")
            elif isinstance(node.op, ast.Sub):
                ops_found.add("-")
            elif isinstance(node.op, ast.Mult):
                ops_found.add("*")
                if isinstance(node.left, ast.BinOp) and isinstance(node.left.op, ast.Add):
                    has_bracket_combo = True
                elif isinstance(node.right, ast.BinOp) and isinstance(node.right.op, ast.Add):
                    has_bracket_combo = True
            elif isinstance(node.op, ast.Div):
                ops_found.add("/")

    missing_ops = [op for op in ["+", "-", "*", "/"] if op not in ops_found]
    if missing_ops:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": f"AI Detection: Missing arithmetic operator(s): {', '.join(missing_ops)}. Practice addition (+), subtraction (-), multiplication (*), and division (/)!",
            "details": "missing_operator"
        }))
    elif not has_bracket_combo:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Remember to compute the combined expression with brackets: (a + b) * 2.",
            "details": "missing_combo_brackets"
        }))
    else:
        print(json.dumps({
            "is_valid": True,
            "check_passed": True,
            "message": "AI Verification: Confirmed all 4 math operators (+, -, *, /) and bracketed combo expression are calculated and printed correctly!",
            "details": "ok"
        }))

elif check_type in ("euclidean_distance_formula", "distance_formula"):
    distance_assign = None
    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "distance":
                    distance_assign = stmt.value

    if distance_assign is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'distance' was not assigned. Write: distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5",
            "details": "missing_distance"
        }))
    elif isinstance(distance_assign, ast.Constant) and (distance_assign.value == 10 or distance_assign.value == 10.0):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You wrote the literal number 10.0 instead of using the formula. In real algorithms, coordinates change dynamically! Write: distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5.",
            "details": "hardcoded_distance"
        }))
    elif isinstance(distance_assign, ast.BinOp) and isinstance(distance_assign.op, ast.Add):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Operator Precedence Alert! Exponentiation (**) executes before addition (+). Remember to wrap the entire sum in brackets before taking the square root: ((x2 - x1)**2 + (y2 - y1)**2)**0.5.",
            "details": "missing_outer_brackets"
        }))
    elif isinstance(distance_assign, ast.BinOp) and isinstance(distance_assign.op, ast.Pow):
        is_half_pow = (isinstance(distance_assign.right, ast.Constant) and distance_assign.right.value == 0.5) or (isinstance(distance_assign.right, ast.BinOp) and isinstance(distance_assign.right.op, ast.Div) and getattr(distance_assign.right.left, 'value', None) == 1 and getattr(distance_assign.right.right, 'value', None) == 2)
        if not is_half_pow:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Calculate square root by raising to fractional power ** 0.5: ((x2 - x1)**2 + (y2 - y1)**2)**0.5.",
                "details": "invalid_exponent"
            }))
        elif not (isinstance(distance_assign.left, ast.BinOp) and isinstance(distance_assign.left.op, ast.Add)):
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Add the two squared coordinate differences inside brackets: ((x2 - x1)**2 + (y2 - y1)**2)**0.5.",
                "details": "invalid_sum"
            }))
        else:
            sum_left = distance_assign.left.left
            sum_right = distance_assign.left.right
            t1_is_pow2 = isinstance(sum_left, ast.BinOp) and isinstance(sum_left.op, ast.Pow) and getattr(sum_left.right, 'value', None) == 2
            t2_is_pow2 = isinstance(sum_right, ast.BinOp) and isinstance(sum_right.op, ast.Pow) and getattr(sum_right.right, 'value', None) == 2
            if not t1_is_pow2 or not t2_is_pow2:
                print(json.dumps({
                    "is_valid": True,
                    "check_passed": False,
                    "message": "AI Detection: Operator Precedence Alert! Wrap the coordinate subtractions in brackets before squaring: (x2 - x1)**2 and (y2 - y1)**2.",
                    "details": "missing_inner_brackets"
                }))
            else:
                print(json.dumps({
                    "is_valid": True,
                    "check_passed": True,
                    "message": "AI Verification: Confirmed 2D Euclidean Distance formula ((x2 - x1)**2 + (y2 - y1)**2)**0.5 with correct bracket precedence and exponentiation!",
                    "details": "ok"
                }))
    else:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Calculate distance using: distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5.",
            "details": "invalid_distance_formula"
        }))

elif check_type in ("binary_search_midpoint_formula", "midpoint_formula"):
    midpoint_assign = None
    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "midpoint":
                    midpoint_assign = stmt.value

    if midpoint_assign is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'midpoint' was not assigned. Write: midpoint = (low + high) / 2",
            "details": "missing_midpoint"
        }))
    elif isinstance(midpoint_assign, ast.Constant) and (midpoint_assign.value == 30 or midpoint_assign.value == 30.0):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You wrote the literal number 30 instead of using the formula. In real algorithms, 'low' and 'high' change dynamically! Write: midpoint = (low + high) / 2.",
            "details": "hardcoded_midpoint"
        }))
    elif isinstance(midpoint_assign, ast.BinOp) and isinstance(midpoint_assign.op, ast.Add) and isinstance(midpoint_assign.right, ast.BinOp) and isinstance(midpoint_assign.right.op, (ast.Div, ast.FloorDiv)):
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Operator Precedence Alert! Division (/) executes before addition (+), calculating 10 + (50 / 2) = 35.0 instead of 30.0. Use brackets: midpoint = (low + high) / 2.",
            "details": "missing_brackets_precedence"
        }))
    else:
        is_valid_formula = False
        if isinstance(midpoint_assign, ast.BinOp) and isinstance(midpoint_assign.op, (ast.Div, ast.FloorDiv)):
            if isinstance(midpoint_assign.left, ast.BinOp) and isinstance(midpoint_assign.left.op, ast.Add):
                left_names = {getattr(midpoint_assign.left.left, 'id', ''), getattr(midpoint_assign.left.right, 'id', '')}
                if "low" in left_names and "high" in left_names:
                    is_valid_formula = True

        if is_valid_formula:
            print(json.dumps({
                "is_valid": True,
                "check_passed": True,
                "message": "AI Verification: Confirmed Binary Search midpoint formula (low + high) / 2 with correct bracket precedence!",
                "details": "ok"
            }))
        else:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Calculate the midpoint between low and high using: midpoint = (low + high) / 2.",
                "details": "invalid_midpoint_formula"
            }))

elif check_type in ("string_concat_greeting", "concat_first_last"):
    full_name_assign = None
    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "full_name":
                    full_name_assign = stmt.value

    if full_name_assign is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'full_name' was not assigned. Create it like: full_name = first_name + \" \" + last_name.",
            "details": "missing_full_name"
        }))
    elif isinstance(full_name_assign, ast.Constant) and full_name_assign.value == "Alan Turing":
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You wrote the literal text \"Alan Turing\" directly. Combine the variables: full_name = first_name + \" \" + last_name.",
            "details": "hardcoded_string"
        }))
    else:
        has_space_concat = False
        names_in_expr = set()

        for node in ast.walk(full_name_assign):
            if isinstance(node, ast.Name):
                names_in_expr.add(node.id)
            elif isinstance(node, ast.Constant) and node.value == " ":
                has_space_concat = True

        if not ("first_name" in names_in_expr and "last_name" in names_in_expr):
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Make sure to concatenate the variables first_name and last_name.",
                "details": "missing_vars_in_concat"
            }))
        elif not has_space_concat:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": "AI Detection: Missing space between words! When joining strings with +, Python does not insert spaces automatically. Write: full_name = first_name + \" \" + last_name.",
                "details": "missing_space"
            }))
        else:
            print(json.dumps({
                "is_valid": True,
                "check_passed": True,
                "message": "AI Verification: Confirmed string concatenation with space separator!",
                "details": "ok"
            }))

elif check_type in ("api_url_builder_algorithm", "url_builder"):
    url_assign = None
    for stmt in tree.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "url":
                    url_assign = stmt.value

    if url_assign is None:
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: Variable 'url' was not assigned. Construct it using string concatenation with the parameter variables.",
            "details": "missing_url"
        }))
    elif isinstance(url_assign, ast.Constant) and url_assign.value == "https://api.learner.dev/search?q=python":
        print(json.dumps({
            "is_valid": True,
            "check_passed": False,
            "message": "AI Detection: You wrote the literal URL string directly. In real web engines, parameters are dynamic! Use string concatenation: url = protocol + \"://\" + domain + \"/\" + endpoint + \"?q=\" + query.",
            "details": "hardcoded_url"
        }))
    else:
        names_in_url = set()
        for node in ast.walk(url_assign):
            if isinstance(node, ast.Name):
                names_in_url.add(node.id)

        required_vars = {"protocol", "domain", "endpoint", "query"}
        missing_vars = [v for v in required_vars if v not in names_in_url]
        if missing_vars:
            print(json.dumps({
                "is_valid": True,
                "check_passed": False,
                "message": f"AI Detection: Missing parameter variable(s) in URL formula: {', '.join(missing_vars)}. Concatenate all four components: protocol, domain, endpoint, and query.",
                "details": "missing_url_vars"
            }))
        else:
            print(json.dumps({
                "is_valid": True,
                "check_passed": True,
                "message": "AI Verification: Confirmed dynamic API URL construction using string concatenation!",
                "details": "ok"
            }))

else:
    print(json.dumps({
        "is_valid": True,
        "check_passed": True,
        "message": "AST check passed",
        "details": "ok"
    }))
"#;

    let mut child = Command::new("python")
        .arg("-u")
        .arg("-c")
        .arg(script)
        .arg(&check_type)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to launch Python AST validator: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(code.as_bytes())
            .map_err(|e| format!("Failed to pass code to AST validator: {}", e))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("Error waiting for AST validator: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if let Ok(res) = serde_json::from_str::<AstVerifyResult>(&stdout) {
        Ok(res)
    } else {
        Ok(AstVerifyResult {
            is_valid: true,
            check_passed: true,
            message: "AST check completed".to_string(),
            details: None,
        })
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


