import { markQuizCompleted, setMaxVisitedSub } from '../x_html/lessons/loader.js';

function getInvoke() {
  if (typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
    return window.__TAURI__.core.invoke;
  }
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
    return window.__TAURI_INTERNALS__.invoke;
  }
  return null;
}
const invoke = getInvoke();

// DOM Elements
const codeInput = document.getElementById('code-input');
const highlightLayer = document.getElementById('highlight-layer');
const highlightContent = document.getElementById('highlight-content');
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
const STARTER_CODE = `#Enter Code Here`

// ============================================================
// SYNTAX HIGHLIGHTING ENGINE
// ============================================================

const PYTHON_KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
  'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);

const PYTHON_BUILTINS = new Set([
  'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
  'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir',
  'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format',
  'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex',
  'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
  'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
  'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
  'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
  'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
]);

const PYTHON_CONSTANTS = new Set(['True', 'False', 'None']);

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightPython(code) {
  const tokenRegex = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b([0-9]+\.?[0-9]*(?:[eE][+-]?[0-9]+)?|0[xX][0-9a-fA-F]+|0[bB][01]+)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)\b|([+\-*/%=<>!&|^~:]+)/gm;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }

    const [fullMatch, comment, string, number, identifier, operator] = match;

    if (comment) {
      result += `<span class="token-comment">${escapeHtml(comment)}</span>`;
    } else if (string) {
      result += `<span class="token-string">${escapeHtml(string)}</span>`;
    } else if (number) {
      result += `<span class="token-number">${escapeHtml(number)}</span>`;
    } else if (identifier) {
      if (PYTHON_KEYWORDS.has(identifier)) {
        result += `<span class="token-keyword">${escapeHtml(identifier)}</span>`;
      } else if (PYTHON_CONSTANTS.has(identifier)) {
        result += `<span class="token-boolean">${escapeHtml(identifier)}</span>`;
      } else if (PYTHON_BUILTINS.has(identifier)) {
        result += `<span class="token-builtin">${escapeHtml(identifier)}</span>`;
      } else {
        result += escapeHtml(identifier);
      }
    } else if (operator) {
      result += `<span class="token-operator">${escapeHtml(operator)}</span>`;
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  return result;
}

function updateHighlighting() {
  if (!codeInput || !highlightContent) return;
  highlightContent.innerHTML = highlightPython(codeInput.value) + '\n';
}

// ============================================================
// AUTO BRACKET COMPLETION & INDENTATION ENGINE
// ============================================================

const PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'"
};
const CLOSING = new Set([')', ']', '}', '"', "'"]);

function handleEditorKeyDown(e) {
  const start = codeInput.selectionStart;
  const end = codeInput.selectionEnd;
  const val = codeInput.value;
  const hasSelection = start !== end;
  const selectedText = val.substring(start, end);

  // 1. Tab Key: Insert 4 spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    if (!hasSelection) {
      document.execCommand('insertText', false, '    ');
    } else {
      document.execCommand('insertText', false, '    ' + selectedText);
    }
    updateGutter();
    updateHighlighting();
    return;
  }

  // 2. Auto-close opening brackets & quotes
  if (PAIRS[e.key]) {
    const openChar = e.key;
    const closeChar = PAIRS[openChar];

    if (hasSelection) {
      e.preventDefault();
      const wrapped = openChar + selectedText + closeChar;
      document.execCommand('insertText', false, wrapped);
      codeInput.setSelectionRange(start + 1, end + 1);
      updateGutter();
      updateHighlighting();
      return;
    } else {
      // If typing quote and current char is the identical quote, step over
      if ((openChar === '"' || openChar === "'") && val[start] === openChar) {
        e.preventDefault();
        codeInput.setSelectionRange(start + 1, start + 1);
        return;
      }
      e.preventDefault();
      document.execCommand('insertText', false, openChar + closeChar);
      codeInput.setSelectionRange(start + 1, start + 1);
      updateGutter();
      updateHighlighting();
      return;
    }
  }

  // 3. Skip over closing brackets
  if (CLOSING.has(e.key) && !hasSelection) {
    if (val[start] === e.key) {
      e.preventDefault();
      codeInput.setSelectionRange(start + 1, start + 1);
      return;
    }
  }

  // 4. Backspace pair deletion (e.g. (|) -> deletes both)
  if (e.key === 'Backspace' && !hasSelection && start > 0) {
    const prevChar = val[start - 1];
    const nextChar = val[start];
    if (PAIRS[prevChar] && PAIRS[prevChar] === nextChar) {
      e.preventDefault();
      codeInput.value = val.substring(0, start - 1) + val.substring(start + 1);
      codeInput.setSelectionRange(start - 1, start - 1);
      updateGutter();
      updateHighlighting();
      return;
    }
  }

  // 5. Enter key auto-indentation & colon block expansion
  if (e.key === 'Enter') {
    e.preventDefault();
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const currentLine = val.substring(lineStart, start);
    const matchIndent = currentLine.match(/^\s*/);
    const indent = matchIndent ? matchIndent[0] : '';

    const charBefore = val[start - 1];
    const charAfter = val[start];

    // Splitting between matching braces e.g. {|} or (|)
    if (PAIRS[charBefore] && PAIRS[charBefore] === charAfter) {
      const extraIndent = indent + '    ';
      const insertStr = '\n' + extraIndent + '\n' + indent;
      document.execCommand('insertText', false, insertStr);
      codeInput.setSelectionRange(start + 1 + extraIndent.length, start + 1 + extraIndent.length);
    } else if (currentLine.trimEnd().endsWith(':')) {
      // Auto-indent after colon in Python
      const newIndent = indent + '    ';
      document.execCommand('insertText', false, '\n' + newIndent);
    } else {
      document.execCommand('insertText', false, '\n' + indent);
    }
    updateGutter();
    updateHighlighting();
    return;
  }
}

function initEditor() {
  if (codeInput) {
    if (!codeInput.value || codeInput.value.trim() === '') {
      codeInput.value = STARTER_CODE;
    }
    updateGutter();
    updateHighlighting();
    codeInput.addEventListener('input', () => {
      updateGutter();
      updateHighlighting();
    });
    codeInput.addEventListener('keydown', handleEditorKeyDown);
    codeInput.addEventListener('scroll', syncScroll);
  }
}

function syncScroll() {
  if (!codeInput) return;
  if (gutter) gutter.scrollTop = codeInput.scrollTop;
  if (lineHighlights) lineHighlights.scrollTop = codeInput.scrollTop;
  if (highlightLayer) {
    highlightLayer.scrollTop = codeInput.scrollTop;
    highlightLayer.scrollLeft = codeInput.scrollLeft;
  }
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
// OUTPUT VERIFICATION & NEXT PAGE UNLOCK
// ============================================================

const urlParams = new URLSearchParams(window.location.search);
const special = urlParams.get('spcl') || '1';
const lesson = urlParams.get('lsn') || '2';
const subset = urlParams.get('sub');

const nextBtn = document.getElementById('next-btn');

function normalizeOutput(text) {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

async function verifyOutput(actualOutput) {
  const intendedOutputEl = document.getElementById('task-intended-output');
  let expectedRaw = (intendedOutputEl && intendedOutputEl.textContent.trim() !== '') ? intendedOutputEl.textContent : null;

  if (!expectedRaw) {
    const candidateFiles = [
      `lesson_data/${special}_${lesson}_${subset}_op.txt`,
    ];
    for (const filePath of candidateFiles) {
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          expectedRaw = await response.text();
          break;
        }
      } catch (e) {
        // Try next candidate
      }
    }
  }

  if (expectedRaw === null) {
    console.warn('No expected output file found to verify against.');
    return false;
  }

  const cleanActual = normalizeOutput(actualOutput);
  const cleanExpected = normalizeOutput(expectedRaw);

  if (cleanActual === cleanExpected) {
    appendTerminal('\n✅ SUCCESS: Output matches expected results!', 'term-line-info');
    if (typeof markQuizCompleted === 'function') {
      markQuizCompleted(special, lesson, subset);
    }
    if (typeof setMaxVisitedSub === 'function') {
      setMaxVisitedSub(special, lesson, Number(subset) + 1);
    }

    const nextStepNum = Number(subset) + 1;
    const nextSidebarBtn = document.getElementById(`sidebar-nav-item-${nextStepNum}`);
    if (nextSidebarBtn) {
      nextSidebarBtn.disabled = false;
      nextSidebarBtn.removeAttribute('title');
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
      nextBtn.style.backgroundColor = '#22c55e';
      nextBtn.textContent = 'Next Page →';
      nextBtn.title = 'Proceed to next topic';
    }
    return true;
  } else {
    appendTerminal('\n❌ Output does not match expected result. Keep experimenting!', 'term-line-err');
    return false;
  }
}

// ============================================================
// RUN DIRECTLY
// ============================================================
async function runCode() {
  if (!invoke) {
    const demoOutput = 'Purchased: 3x Quantum Battery\nTotal Bill: $126.50\nStep 1: bonus = 5\nStep 2: bonus = 10\nStep 3: bonus = 15';
    appendTerminal('[Demo Mode] Simulated output:\n' + demoOutput, 'term-line-out');
    await verifyOutput(demoOutput);
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
      await verifyOutput(result.stdout);
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

async function finishDebugging() {
  clearLineHighlights();
  setStatus('Debug Session Finished', 'running');
  appendTerminal('\n[Execution Finished]', 'term-line-info');
  btnStep.disabled = true;
  btnContinue.disabled = true;
  isDebugging = false;

  const finalStdout = debugSteps.length > 0 ? debugSteps[debugSteps.length - 1].stdout : '';
  if (finalStdout) {
    await verifyOutput(finalStdout);
  }
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
