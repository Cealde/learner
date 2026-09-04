const { invoke } = window.__TAURI__ ? window.__TAURI__.core : { invoke: null };

// DOM Elements
const codeInput = document.getElementById('code-input');
const gutter = document.getElementById('gutter');
const lineHighlights = document.getElementById('line-highlights');
const varsTableBody = document.getElementById('vars-tbody');
const emptyVarsMsg = document.getElementById('empty-vars-msg');
const terminalBox = document.getElementById('terminal-box');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Toolbar Buttons
const btnRun = document.getElementById('btn-run');
const btnDebug = document.getElementById('btn-debug');
const btnStep = document.getElementById('btn-step');
const btnContinue = document.getElementById('btn-continue');
const btnReset = document.getElementById('btn-reset');
const btnClearOutput = document.getElementById('btn-clear-output');

// Debugger State
let breakpoints = new Set();
let debugSteps = [];
let currentStepIdx = -1;
let isDebugging = false;

// Starter Python code for Lesson 2
const STARTER_CODE = `# Lesson 2: Variables & Step-by-Step Execution
# Click the gutter to set breakpoints, then click "Debug" or "Step"

item_name = "Quantum Battery"
unit_price = 45.50
quantity = 3

subtotal = unit_price * quantity
discount = 10.00
total_price = subtotal - discount

print(f"Purchased: {quantity}x {item_name}")
print(f"Total Bill: \${total_price:.2f}")

# Loop example to observe variable changes
for step in range(1, 4):
    bonus = step * 5
    print(f"Step {step}: bonus = {bonus}")
`;

function initEditor() {
  if (codeInput) {
    codeInput.value = STARTER_CODE;
    updateGutter();
    codeInput.addEventListener('input', updateGutter);
    codeInput.addEventListener('scroll', syncScroll);
  }
}

function syncScroll() {
  if (!codeInput) return;
  if (gutter) gutter.scrollTop = codeInput.scrollTop;
  if (lineHighlights) lineHighlights.scrollTop = codeInput.scrollTop;
}

function updateGutter() {
  if (!codeInput || !gutter || !lineHighlights) return;
  const lines = codeInput.value.split('\n');
  const lineCount = lines.length;

  gutter.innerHTML = '';
  lineHighlights.innerHTML = '';

  for (let i = 1; i <= lineCount; i++) {
    // Gutter item (Line number + Breakpoint dot)
    const lineElem = document.createElement('div');
    lineElem.className = 'gutter-line';
    lineElem.setAttribute('data-line', i);

    const bpDot = document.createElement('span');
    bpDot.className = `bp-dot ${breakpoints.has(i) ? 'active' : ''}`;
    bpDot.title = `Toggle Breakpoint on line ${i}`;

    const numSpan = document.createElement('span');
    numSpan.textContent = i;

    lineElem.appendChild(bpDot);
    lineElem.appendChild(numSpan);

    lineElem.addEventListener('click', () => toggleBreakpoint(i, bpDot));
    gutter.appendChild(lineElem);

    // Highlight row
    const highlightRow = document.createElement('div');
    highlightRow.className = 'highlight-row';
    highlightRow.id = `highlight-line-${i}`;
    lineHighlights.appendChild(highlightRow);
  }
}

function toggleBreakpoint(lineNum, bpDotElement) {
  if (breakpoints.has(lineNum)) {
    breakpoints.delete(lineNum);
    bpDotElement.classList.remove('active');
    appendTerminal(`[Breakpoint Removed] Line ${lineNum}`, 'term-line-info');
  } else {
    breakpoints.add(lineNum);
    bpDotElement.classList.add('active');
    appendTerminal(`[Breakpoint Added] Line ${lineNum}`, 'term-line-info');
  }
}

function setStatus(text, stateClass = '') {
  if (statusText) statusText.textContent = text;
  if (statusDot) {
    statusDot.className = `status-dot ${stateClass}`;
  }
}

function appendTerminal(text, className = 'term-line-out') {
  if (!terminalBox) return;
  const div = document.createElement('div');
  div.className = className;
  div.textContent = text;
  terminalBox.appendChild(div);
  terminalBox.scrollTop = terminalBox.scrollHeight;
}

function clearTerminal() {
  if (terminalBox) terminalBox.innerHTML = '';
}

function clearLineHighlights() {
  const highlighted = document.querySelectorAll('.highlight-row.active-line');
  highlighted.forEach(el => el.classList.remove('active-line'));
}

function highlightLine(lineNum) {
  clearLineHighlights();
  if (lineNum <= 0) return;
  const row = document.getElementById(`highlight-line-${lineNum}`);
  if (row) {
    row.classList.add('active-line');
    // Scroll line into view if needed
    const lineHeight = 22;
    const targetScroll = (lineNum - 3) * lineHeight;
    if (codeInput && (codeInput.scrollTop > targetScroll || codeInput.scrollTop + 300 < targetScroll)) {
      codeInput.scrollTop = Math.max(0, targetScroll);
      syncScroll();
    }
  }
}

function renderVariables(localsMap) {
  if (!varsTableBody || !emptyVarsMsg) return;
  varsTableBody.innerHTML = '';

  const keys = Object.keys(localsMap || {});
  if (keys.length === 0) {
    emptyVarsMsg.style.display = 'block';
    return;
  }

  emptyVarsMsg.style.display = 'none';

  keys.forEach(key => {
    const info = localsMap[key];
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.className = 'var-name';
    tdName.textContent = key;

    const tdType = document.createElement('td');
    tdType.className = 'var-type';
    tdType.textContent = info.type || typeof info;

    const tdVal = document.createElement('td');
    tdVal.className = 'var-val';
    tdVal.textContent = info.val !== undefined ? info.val : String(info);

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdVal);
    varsTableBody.appendChild(tr);
  });
}

// ============================================================
// RUN DIRECTLY
// ============================================================
async function runCode() {
  if (!invoke) {
    appendTerminal('[Demo Mode] Tauri IPC not detected. Running simulated output:\n' +
      'Purchased: 3x Quantum Battery\nTotal Bill: $126.50\nStep 1: bonus = 5\nStep 2: bonus = 10\nStep 3: bonus = 15', 'term-line-out');
    return;
  }

  resetDebugger();
  setStatus('Running...', 'running');
  appendTerminal(`\n>>> python -u script.py`, 'term-prompt');

  try {
    const code = codeInput.value;
    const result = await invoke('run_python', { code });

    if (result.stdout && result.stdout.trim() !== '') {
      appendTerminal(result.stdout, 'term-line-out');
    }
    if (result.stderr && result.stderr.trim() !== '') {
      appendTerminal(result.stderr, 'term-line-err');
    }

    if (result.success) {
      setStatus('Completed', 'running');
      appendTerminal(`[Process exited with code ${result.exit_code ?? 0}]`, 'term-line-info');
    } else {
      setStatus('Error', 'error');
      appendTerminal(`[Process failed with exit code ${result.exit_code ?? 1}]`, 'term-line-err');
    }
  } catch (err) {
    setStatus('Execution Error', 'error');
    appendTerminal(`[Error]: ${String(err)}`, 'term-line-err');
  }
}

// ============================================================
// START DEBUGGING TRACE
// ============================================================
async function startDebugSession() {
  if (!invoke) {
    appendTerminal('[Demo Mode] Debugger requires Tauri desktop runtime.', 'term-line-err');
    return;
  }

  resetDebugger();
  setStatus('Initializing Debugger...', 'debugging');
  appendTerminal(`\n>>> [debugpy trace active]`, 'term-prompt');

  try {
    const code = codeInput.value;
    const result = await invoke('debug_python', { code });

    if (!result.success && (!result.steps || result.steps.length === 0)) {
      setStatus('Syntax / Load Error', 'error');
      appendTerminal(result.error || result.total_stdout, 'term-line-err');
      return;
    }

    debugSteps = result.steps || [];
    if (debugSteps.length === 0) {
      setStatus('No steps executed', '');
      appendTerminal('[No executable lines found]', 'term-line-info');
      return;
    }

    isDebugging = true;
    currentStepIdx = 0;
    btnStep.disabled = false;
    btnContinue.disabled = false;

    applyStep(currentStepIdx);
  } catch (err) {
    setStatus('Debug Error', 'error');
    appendTerminal(`[Debugger Error]: ${String(err)}`, 'term-line-err');
  }
}

function applyStep(index) {
  if (index < 0 || index >= debugSteps.length) {
    finishDebugging();
    return;
  }

  const step = debugSteps[index];
  highlightLine(step.line);
  renderVariables(step.locals);

  if (step.stdout) {
    // Update terminal with stdout up to this step
    clearTerminal();
    appendTerminal(`>>> [debugging: step ${index + 1}/${debugSteps.length}]`, 'term-prompt');
    appendTerminal(step.stdout, 'term-line-out');
  }

  if (step.error) {
    setStatus(`Exception at line ${step.line}`, 'error');
    appendTerminal(`\n[Exception]: ${step.error}`, 'term-line-err');
  } else if (breakpoints.has(step.line) && index > 0) {
    setStatus(`Paused at Breakpoint (Line ${step.line})`, 'paused');
  } else {
    setStatus(`Debugging (Line ${step.line})`, 'debugging');
  }
}

function stepForward() {
  if (!isDebugging || debugSteps.length === 0) {
    startDebugSession();
    return;
  }

  currentStepIdx++;
  if (currentStepIdx >= debugSteps.length) {
    finishDebugging();
  } else {
    applyStep(currentStepIdx);
  }
}

function continueExecution() {
  if (!isDebugging || debugSteps.length === 0) {
    startDebugSession();
    return;
  }

  let nextIdx = currentStepIdx + 1;
  while (nextIdx < debugSteps.length) {
    const step = debugSteps[nextIdx];
    if (breakpoints.has(step.line) || nextIdx === debugSteps.length - 1 || step.error) {
      break;
    }
    nextIdx++;
  }

  currentStepIdx = nextIdx;
  applyStep(currentStepIdx);
}

function finishDebugging() {
  clearLineHighlights();
  setStatus('Debug Session Finished', 'running');
  appendTerminal('\n[Execution Finished]', 'term-line-info');
  btnStep.disabled = true;
  btnContinue.disabled = true;
  isDebugging = false;
}

function resetDebugger() {
  isDebugging = false;
  debugSteps = [];
  currentStepIdx = -1;
  clearLineHighlights();
  renderVariables({});
  setStatus('Ready', '');
  if (btnStep) btnStep.disabled = false;
  if (btnContinue) btnContinue.disabled = false;
}

// Event Listeners
btnRun?.addEventListener('click', runCode);
btnDebug?.addEventListener('click', startDebugSession);
btnStep?.addEventListener('click', stepForward);
btnContinue?.addEventListener('click', continueExecution);
btnReset?.addEventListener('click', () => {
  resetDebugger();
  clearTerminal();
  appendTerminal('Output cleared. Debugger reset.', 'term-line-info');
});
btnClearOutput?.addEventListener('click', clearTerminal);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  renderVariables({});
  setStatus('Ready', '');
});
